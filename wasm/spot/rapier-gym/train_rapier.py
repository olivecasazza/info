"""Train Spot quadruped with PPO using Rapier3D physics (via spot-rapier).

Eliminates sim-to-sim gap — training and WASM deployment use identical physics.
Supports multi-behavior training via behavior conditioning.

Usage:
    python train_rapier.py --behavior walk
    python train_rapier.py --behavior terrain --terrain-difficulty 0.5
    python train_rapier.py --behavior sprint,walk,terrain  # multi-behavior
"""

import os
os.environ["RAY_TRAIN_V2_ENABLED"] = "0"

import argparse
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

import ray
from ray import tune
from ray.rllib.algorithms.ppo import PPOConfig
from ray.air.integrations.wandb import WandbLoggerCallback
import socket
import numpy as np

from spot_rapier import SpotEnvRapier


class CheckpointCallback(tune.Callback):
    """Force checkpoint saving every N iterations.

    Workaround: CheckpointConfig doesn't work with old RLlib API stack.
    This uses Tune's trial.should_checkpoint mechanism instead.
    """
    def __init__(self, frequency: int = 100):
        self.frequency = frequency
        self.best_reward = float("-inf")

    def on_trial_result(self, iteration, trials, trial, result, **info):
        ts = result.get("training_iteration", 0)
        reward = result.get("env_runners/episode_reward_mean",
                           result.get("episode_reward_mean", float("-inf")))

        if ts % self.frequency == 0 and ts > 0:
            result["should_checkpoint"] = True
        if reward > self.best_reward:
            self.best_reward = reward
            result["should_checkpoint"] = True


class CurriculumCallback(tune.Callback):
    def __init__(self, total_timesteps: int):
        self.total_timesteps = total_timesteps

    def on_trial_result(self, iteration, trials, trial, result, **info):
        ts = result.get("timesteps_total", 0)
        frac = min(ts / self.total_timesteps, 1.0)

        # Velocity curriculum: ramp from 0 to 1 over first 30%
        vel_scale = min(ts / (0.3 * self.total_timesteps), 1.0)

        # Terrain curriculum: ramp from 20% to 60%
        if frac < 0.2:
            terrain_diff = 0.0
        elif frac < 0.6:
            terrain_diff = (frac - 0.2) / 0.4
        else:
            terrain_diff = 1.0

        trial.config["env_config"]["cmd_vel_scale"] = vel_scale
        trial.config["env_config"]["terrain_difficulty"] = terrain_diff


def train(args):
    ray.init(address="auto" if os.environ.get("RAY_ADDRESS") else None)

    tune.register_env("spot_rapier", lambda c: SpotEnvRapier(config=c))

    total_timesteps = args.total_timesteps
    behaviors = [b.strip() for b in args.behavior.split(",")]

    # For multi-behavior: grid search over behaviors
    if len(behaviors) > 1:
        behavior_search = tune.grid_search(behaviors)
    else:
        behavior_search = behaviors[0]

    # Observation: 45 (physics) + 5 (behavior one-hot) = 50
    obs_dim = 50

    lr_schedule = [[0, 3e-4], [total_timesteps, 1e-5]]

    config = (
        PPOConfig()
        .environment(
            "spot_rapier",
            env_config={
                "behavior": behavior_search,
                "cmd_vel_scale": 0.0,
                "terrain_difficulty": 0.0,
                "max_episode_steps": 2000,
            },
            disable_env_checking=True,
        )
        .framework("torch")
        .env_runners(
            num_env_runners=args.num_workers,
            num_envs_per_env_runner=1,
            rollout_fragment_length=256,
            num_cpus_per_env_runner=1,
            sample_timeout_s=600.0,
        )
        .training(
            lr_schedule=lr_schedule,
            gamma=0.99,
            lambda_=0.95,
            clip_param=0.2,
            entropy_coeff=tune.grid_search([0.01, 0.005]) if not args.no_grid else 0.005,
            vf_loss_coeff=0.5,
            grad_clip=0.5,
            train_batch_size=4096,
            minibatch_size=1024,
            num_epochs=5,
        )
        .api_stack(
            enable_rl_module_and_learner=False,
            enable_env_runner_and_connector_v2=False,
        )
        .resources(num_gpus=1 if args.gpu else 0)
    )

    config.model = {
        "fcnet_hiddens": [256, 128, 64],
        "fcnet_activation": "tanh",
        "free_log_std": True,
    }
    config.observation_filter = "MeanStdFilter"

    hostname = socket.gethostname()
    callbacks = [
        CurriculumCallback(total_timesteps),
        CheckpointCallback(frequency=100),
    ]

    if not args.no_wandb:
        callbacks.append(WandbLoggerCallback(
            project="spot-rapier",
            entity=os.environ.get("WANDB_ENTITY", "olivecasazza"),
            group="spot_rapier_v1",
            tags=[f"host:{hostname}", "ppo", "rapier3d"],
            log_config=True,
            save_checkpoints=False,
        ))

    tuner = tune.Tuner(
        "PPO",
        param_space=config,
        tune_config=tune.TuneConfig(
            mode="max",
            metric="env_runners/episode_reward_mean",
            max_concurrent_trials=1,
            num_samples=1,
        ),
        run_config=tune.RunConfig(
            name="spot_rapier_v1",
            stop={"timesteps_total": total_timesteps},
            checkpoint_config=tune.CheckpointConfig(
                num_to_keep=5,
                checkpoint_score_attribute="env_runners/episode_reward_mean",
                checkpoint_score_order="max",
                checkpoint_frequency=50,
                checkpoint_at_end=True,
            ),
            callbacks=callbacks,
        ),
    )

    results = tuner.fit()
    best = results.get_best_result()
    print(f"Best result: {best.path}")
    print(f"Best reward: {best.metrics.get('episode_reward_mean')}")

    # Export best model to ONNX
    if best.checkpoint:
        export_onnx(best.checkpoint.path)


def export_onnx(checkpoint_path: str):
    """Export checkpoint to ONNX for WASM deployment."""
    import torch

    from ray.rllib.algorithms.ppo import PPO
    tune.register_env("spot_rapier", lambda c: SpotEnvRapier(config=c))

    algo = PPO.from_checkpoint(checkpoint_path)
    policy = algo.get_policy()
    model = policy.model.cpu()
    model.eval()

    class CleanPolicy(torch.nn.Module):
        def __init__(self, m):
            super().__init__()
            self.h0 = m._hidden_layers[0]._model
            self.h1 = m._hidden_layers[1]._model
            self.h2 = m._hidden_layers[2]._model
            self.logits = m._logits._model

        def forward(self, obs):
            x = self.h0(obs)
            x = self.h1(x)
            x = self.h2(x)
            return self.logits(x)

    clean = CleanPolicy(model)
    clean.eval()

    # Input is 50D (45 physics + 5 behavior one-hot)
    dummy = torch.zeros(1, 50)
    torch.onnx.export(clean, dummy, "/tmp/spot_rapier_policy.onnx",
                       input_names=["obs"], output_names=["actions"],
                       dynamic_axes={"obs": {0: "batch"}, "actions": {0: "batch"}},
                       opset_version=11)

    # Save normalization stats
    local_worker = algo.env_runner
    filters = local_worker.filters
    if "default_policy" in filters:
        f = filters["default_policy"]
        if hasattr(f, "running_stats"):
            rs = f.running_stats
            np.save("/tmp/obs_mean.npy", np.array(rs.mean, dtype=np.float32))
            np.save("/tmp/obs_std.npy", np.sqrt(np.array(rs.var, dtype=np.float32) + 1e-8))

    print(f"ONNX exported to /tmp/spot_rapier_policy.onnx")
    algo.stop()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--behavior", default="walk", help="Behavior(s) to train, comma-separated")
    parser.add_argument("--total-timesteps", type=int, default=50_000_000)
    parser.add_argument("--num-workers", type=int, default=4)
    parser.add_argument("--gpu", action="store_true", default=True)
    parser.add_argument("--no-gpu", dest="gpu", action="store_false")
    parser.add_argument("--no-wandb", action="store_true")
    parser.add_argument("--no-grid", action="store_true", help="Skip entropy grid search")
    args = parser.parse_args()
    train(args)

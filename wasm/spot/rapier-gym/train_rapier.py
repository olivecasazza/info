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
from ray.rllib.callbacks.callbacks import RLlibCallback
from ray.air.integrations.wandb import WandbLoggerCallback
import random
import socket
import numpy as np
import torch

from spot_rapier import SpotEnvRapier

try:
    import rerun as _rr
except ImportError:
    _rr = None


class RemoteRerunCallback(RLlibCallback):
    """Save training metrics to a local Rerun .rrd file.

    The training pod uploads the file to GCS at end-of-run; the public
    info site embeds https://app.rerun.io/?url=<gs-public-url>. No live
    streaming, no operator-managed dashboards.

    Output path: /tmp/spot.rrd (override via RERUN_RRD_PATH env).
    Application id from RERUN_APPLICATION_ID (defaults to spot_training).
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._rrd_path = os.environ.get("RERUN_RRD_PATH", "/tmp/spot.rrd")
        self._app_id = os.environ.get("RERUN_APPLICATION_ID", "spot_training")
        self._initialized = False
        self._iter_counter = 0
        self._episode_counter = 0

    def _ensure_initialized(self):
        if self._initialized or _rr is None:
            return
        try:
            _rr.init(
                self._app_id,
                recording_id=f"{self._app_id}-{socket.gethostname()}",
            )
            _rr.save(self._rrd_path)
            self._initialized = True
            import sys
            print(f"[rerun] writing to {self._rrd_path}", file=sys.stderr, flush=True)
        except Exception as e:
            import sys
            print(f"[rerun] save failed: {e}", file=sys.stderr, flush=True)

    def on_episode_end(self, *, episode, **kwargs):
        self._ensure_initialized()
        if not self._initialized:
            return
        try:
            self._episode_counter += 1
            _rr.set_time("episode", sequence=self._episode_counter)
            r = getattr(episode, "total_reward", None)
            length = getattr(episode, "length", None)
            if r is not None:
                _rr.log("training/episode_reward", _rr.Scalars(float(r)))
            if length is not None:
                _rr.log("training/episode_length", _rr.Scalars(float(length)))
        except Exception:
            pass

    def on_train_result(self, *, algorithm, result, **kwargs):
        self._ensure_initialized()
        if not self._initialized:
            return
        try:
            self._iter_counter = result.get("training_iteration", self._iter_counter + 1)
            _rr.set_time("iteration", sequence=self._iter_counter)

            def _get(path):
                cur = result
                for k in path.split("/"):
                    if not isinstance(cur, dict) or k not in cur:
                        return None
                    cur = cur[k]
                return cur

            for log_path, candidates in {
                "metrics/reward_mean": ["env_runners/episode_reward_mean", "episode_reward_mean"],
                "metrics/reward_min":  ["env_runners/episode_reward_min",  "episode_reward_min"],
                "metrics/reward_max":  ["env_runners/episode_reward_max",  "episode_reward_max"],
                "metrics/episode_len_mean": ["env_runners/episode_len_mean", "episode_len_mean"],
                "training/timesteps_total": ["timesteps_total"],
                "training/time_total_s":    ["time_total_s"],
            }.items():
                for k in candidates:
                    v = _get(k)
                    if v is not None:
                        _rr.log(log_path, _rr.Scalars(float(v)))
                        break

            learner = _get("info/learner/default_policy/learner_stats")
            if isinstance(learner, dict):
                for stat in ["entropy", "kl", "vf_loss", "policy_loss", "total_loss"]:
                    if stat in learner:
                        _rr.log(f"training/learner/{stat}", _rr.Scalars(float(learner[stat])))
        except Exception:
            pass


class AutoCheckpointCallback(RLlibCallback):
    """Save checkpoints directly via Algorithm.save() inside the training loop.

    Runs inside the algorithm actor, bypassing Tune's broken CheckpointConfig
    on the old RLlib API stack (RAY_TRAIN_V2_ENABLED=0).

    Saves on:
    - Every `frequency` iterations
    - New best reward
    """

    def __init__(self, checkpoint_dir: str = "/tmp/spot_checkpoints", frequency: int = 100):
        super().__init__()
        self.checkpoint_dir = checkpoint_dir
        self.frequency = frequency
        self.best_reward = float("-inf")
        import sys
        print(f"[CKPT] AutoCheckpointCallback initialized, dir={checkpoint_dir}", file=sys.stderr, flush=True)

    def on_train_result(self, *, algorithm, result, **kwargs):
        import sys, math
        iteration = result.get("training_iteration", 0)
        reward = result.get(
            "env_runners/episode_reward_mean",
            result.get("episode_reward_mean", float("-inf")),
        )

        should_save = False
        reason = ""

        # Periodic save
        if iteration % self.frequency == 0 and iteration > 0:
            should_save = True
            reason = "periodic"

        # Best reward save (handle NaN)
        if not math.isnan(reward) and reward > self.best_reward:
            self.best_reward = reward
            should_save = True
            reason = "best_reward"

        # Always save first iteration
        if iteration == 1:
            should_save = True
            reason = "first"

        if should_save:
            try:
                path = algorithm.save(self.checkpoint_dir)
                print(f"[CKPT] iter={iteration} reward={reward} reason={reason} -> {path}",
                      file=sys.stderr, flush=True)
            except Exception as e:
                print(f"[CKPT] save failed at iter={iteration}: {e}", file=sys.stderr, flush=True)


class TrainingCallbacks(AutoCheckpointCallback, RemoteRerunCallback):
    """Compose checkpoint saves and Rerun streaming.

    `make_multi_callbacks` was removed from `ray.rllib.callbacks.callbacks`
    in recent Ray. Multiple inheritance gives us both behaviours through a
    single class that RLlib instantiates with no args.
    """

    def __init__(self, *args, **kwargs):
        AutoCheckpointCallback.__init__(self)
        RemoteRerunCallback.__init__(self)

    def on_train_result(self, *, algorithm, result, **kwargs):
        AutoCheckpointCallback.on_train_result(
            self, algorithm=algorithm, result=result, **kwargs
        )
        RemoteRerunCallback.on_train_result(
            self, algorithm=algorithm, result=result, **kwargs
        )

    def on_episode_end(self, *, episode, **kwargs):
        RemoteRerunCallback.on_episode_end(self, episode=episode, **kwargs)


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


def _seed_all(seed: int) -> None:
    """Pin every RNG we touch so a re-run with the same --seed produces the
    same trajectory. Required to verify a config change is reproducible
    rather than reading noise.
    """
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


def train(args):
    if args.seed is not None:
        _seed_all(args.seed)

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
                "rerun_endpoint": args.rerun_endpoint,
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
        # Run a deterministic rollout every `eval_interval` train iterations on
        # one dedicated runner (separate from training rollouts so the eval
        # signal isn't confounded with on-policy training noise). This produces
        # the `evaluation/env_runners/episode_reward_mean` metric, which is
        # the load-bearing "is the policy actually improving" signal — distinct
        # from training-time reward, which moves around with reward shaping
        # changes and exploration.
        .evaluation(
            evaluation_interval=args.eval_interval if args.eval_interval > 0 else None,
            evaluation_duration=args.eval_episodes,
            evaluation_duration_unit="episodes",
            evaluation_num_env_runners=1,
            evaluation_config=PPOConfig.overrides(explore=False),
        )
        .debugging(seed=args.seed)
        .api_stack(
            enable_rl_module_and_learner=False,
            enable_env_runner_and_connector_v2=False,
        )
        .resources(num_gpus=1 if args.gpu else 0)
        .callbacks(TrainingCallbacks)
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

    # Parallelize across behaviors: one concurrent trial per behavior, so a
    # multi-behavior `--behavior walk,terrain,...` launch fans out instead
    # of serializing. `--max-concurrent-trials` overrides if explicitly set.
    max_concurrent = args.max_concurrent_trials or max(len(behaviors), 1)

    tuner = tune.Tuner(
        "PPO",
        param_space=config,
        tune_config=tune.TuneConfig(
            mode="max",
            metric="env_runners/episode_reward_mean",
            max_concurrent_trials=max_concurrent,
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
        from export_pipeline import export_onnx

        result = export_onnx(best.checkpoint.path, "/tmp/spot_rapier_policy.onnx")
        print(f"ONNX: {result['onnx_path']}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--behavior", default="walk", help="Behavior(s) to train, comma-separated")
    parser.add_argument("--total-timesteps", type=int, default=50_000_000)
    parser.add_argument("--num-workers", type=int, default=4)
    parser.add_argument("--gpu", action="store_true", default=True)
    parser.add_argument("--no-gpu", dest="gpu", action="store_false")
    parser.add_argument("--no-wandb", action="store_true")
    parser.add_argument("--no-grid", action="store_true", help="Skip entropy grid search")
    parser.add_argument(
        "--max-concurrent-trials",
        type=int,
        default=0,
        help="Max trials running concurrently. 0 = one per behavior in --behavior.",
    )
    parser.add_argument(
        "--rerun-endpoint",
        default="",
        help=(
            "Rerun gRPC endpoint template, e.g. "
            "'spot-<behavior>.hpc.svc.cluster.local:9876'. The literal "
            "'<behavior>' is substituted per-trial. Empty disables live logging."
        ),
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=None,
        help=(
            "Pin RNG state across Python (random/numpy/torch), Ray RLlib's "
            "policy init, and the env's reset() so two runs with the same "
            "seed produce the same trajectory. Required to verify a config "
            "change is causal rather than reading noise. None = unseeded."
        ),
    )
    parser.add_argument(
        "--eval-interval",
        type=int,
        default=10,
        help="Run a deterministic eval rollout every N train iterations. 0 disables.",
    )
    parser.add_argument(
        "--eval-episodes",
        type=int,
        default=5,
        help="Number of eval episodes per evaluation pass.",
    )
    args = parser.parse_args()
    train(args)

import os
import socket
# Disable Ray Train V2 to avoid deprecation errors and API mismatches
os.environ["RAY_TRAIN_V2_ENABLED"] = "0"

import argparse
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
import yaml
import ray
from ray import tune
from ray.rllib.algorithms.ppo import PPOConfig
from ray.tune.schedulers import PopulationBasedTraining
from ray.air.integrations.wandb import WandbLoggerCallback
from pathlib import Path
import sys

# Ensure we can import envs
sys.path.append(str(Path(__file__).parent.parent))
from envs.spot_env import SpotEnv


class CurriculumCallback(tune.Callback):
    """Ramp cmd_vel_scale and terrain_difficulty from 0 to 1.0 over training.

    Velocity ramps over the first 30%. Terrain difficulty ramps from 20% to
    60% of training so the agent learns flat-ground walking before rough
    terrain is introduced.
    """

    def __init__(self, total_timesteps: int):
        self.total_timesteps = total_timesteps
        self.vel_ramp_end = int(0.3 * total_timesteps)
        self.terrain_ramp_start = int(0.2 * total_timesteps)
        self.terrain_ramp_end = int(0.6 * total_timesteps)

    def on_trial_result(self, iteration, trials, trial, result, **info):
        ts = result.get("timesteps_total", 0)

        # Velocity curriculum
        if ts < self.vel_ramp_end:
            vel_scale = ts / self.vel_ramp_end
        else:
            vel_scale = 1.0

        # Terrain curriculum (starts later, ramps to 1.0)
        if ts < self.terrain_ramp_start:
            terrain_diff = 0.0
        elif ts < self.terrain_ramp_end:
            terrain_diff = (ts - self.terrain_ramp_start) / (
                self.terrain_ramp_end - self.terrain_ramp_start
            )
        else:
            terrain_diff = 1.0

        # Update env config so new episodes use the ramped values
        trial.config["env_config"]["cmd_vel_scale"] = vel_scale
        trial.config["env_config"]["terrain_difficulty"] = terrain_diff


def linear_schedule(initial: float, final: float, total_steps: int):
    """Return a Ray Tune schedule that linearly decays from initial to final."""
    # For RLlib we approximate with a piecewise constant via grid points
    # But RLlib supports lr_schedule natively as list of [timestep, value] pairs
    return [[0, initial], [total_steps, final]]


def train_rllib(args):
    # Load config
    with open(args.config, "r") as f:
        config_data = yaml.safe_load(f)

    # Initialize Ray
    if not ray.is_initialized():
        ray.init(address="auto" if os.environ.get("RAY_ADDRESS") else None)

    # Register Environment
    def env_creator(env_config):
        return SpotEnv(config=env_config)

    tune.register_env("spot_env", env_creator)

    # Config values
    training_conf = config_data["training"]
    model_conf = config_data["model"]
    total_timesteps = training_conf["total_timesteps"]

    # Workers per trial -- keep low to avoid OOM on 16-core nodes
    # Each PyBullet worker uses ~500MB; 4 workers + driver + Ray = ~4GB
    workers_per_trial = 4

    # Network architecture
    net_arch = model_conf["net_arch"]  # [256, 128, 64]

    # Learning rate schedule: 3e-4 -> 1e-5 linear decay
    lr_schedule = linear_schedule(3e-4, 1e-5, total_timesteps)

    # Entropy schedule: start -> end
    # RLlib doesn't natively support entropy_coeff schedule on legacy API,
    # so we use the initial value and rely on grid search across values
    entropy_coeff_search = tune.grid_search([0.01, 0.005, 0.001])

    # RLlib PPO Config
    config = (
        PPOConfig()
        .environment(
            "spot_env",
            env_config={
                "cmd_vel_scale": 0.0,          # curriculum starts at standing
                "terrain_difficulty": 0.0,      # flat terrain initially
                "reward_preset": "locomotion",  # composable reward preset
            },
            disable_env_checking=True,
        )
        .framework("torch")
        .env_runners(
            num_env_runners=workers_per_trial,
            num_envs_per_env_runner=1,  # isolated processes for PyBullet stability
            rollout_fragment_length=256,
            num_cpus_per_env_runner=1,
            sample_timeout_s=600.0,
        )
        .training(
            lr_schedule=lr_schedule,
            gamma=training_conf["gamma"],  # 0.99
            lambda_=training_conf["gae_lambda"],  # 0.95
            clip_param=training_conf["clip_range"],  # 0.2
            entropy_coeff=entropy_coeff_search,
            vf_loss_coeff=training_conf["vf_coef"],  # 0.5
            grad_clip=training_conf["max_grad_norm"],  # 0.5
            train_batch_size=training_conf["train_batch_size"],  # 32768
            minibatch_size=training_conf["sgd_minibatch_size"],  # 4096
            num_epochs=training_conf["num_sgd_iter"],  # 5
        )
        .api_stack(
            enable_rl_module_and_learner=False,
            enable_env_runner_and_connector_v2=False,
        )
        .resources(
            num_gpus=1,
        )
    )

    # Model config: MLP with specified architecture
    config.model = {
        "fcnet_hiddens": net_arch,
        "fcnet_activation": "tanh",
        "free_log_std": True,
    }

    # Observation normalization via RLlib built-in filter
    config.observation_filter = "MeanStdFilter"

    # Weights & Biases integration
    wandb_entity = os.environ.get("WANDB_ENTITY", "olivecasazza")
    wandb_project = os.environ.get("WANDB_PROJECT", "spot-locomotion")
    hostname = socket.gethostname()

    callbacks = []
    if not args.no_curriculum:
        callbacks.append(CurriculumCallback(total_timesteps))

    if not args.no_wandb:
        wandb_callback = WandbLoggerCallback(
            project=wandb_project,
            entity=wandb_entity,
            group="spot_ppo_locomotion_v1",
            tags=[f"host:{hostname}", "ppo", "spot", "locomotion"],
            log_config=True,
            save_checkpoints=False,
        )
        callbacks.append(wandb_callback)

    # Run Training via Tuner -- 3 parallel trials (grid search over entropy_coeff)
    print(f"Launching: 3 trials (entropy grid search), {workers_per_trial} workers/trial")
    if not args.no_wandb:
        print(f"W&B dashboard: https://wandb.ai/{wandb_entity}/{wandb_project}")

    tuner = tune.Tuner(
        "PPO",
        param_space=config,
        tune_config=tune.TuneConfig(
            mode="max",
            metric="env_runners/episode_reward_mean",
            max_concurrent_trials=1,  # 1 GPU = sequential trials; bump to 3 with full cluster
            num_samples=1,  # 1 sample per grid point = 3 total trials
        ),
        run_config=tune.RunConfig(
            name="spot_ppo_locomotion_v1",
            stop={"timesteps_total": total_timesteps},
            checkpoint_config=tune.CheckpointConfig(
                num_to_keep=5,
                checkpoint_score_attribute="env_runners/episode_reward_mean",
                checkpoint_score_order="max",
                checkpoint_frequency=10,
            ),
            callbacks=callbacks,
        ),
    )

    results = tuner.fit()
    print("Training complete.")
    best_result = results.get_best_result()
    print(f"Best result path: {best_result.path}")
    print(f"Best reward: {best_result.metrics.get('episode_reward_mean')}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Spot quadruped with PPO")
    parser.add_argument("--config", type=str, default="train/config.yaml")
    parser.add_argument("--no-curriculum", action="store_true",
                        help="Disable velocity curriculum (start at full speed)")
    parser.add_argument("--no-wandb", action="store_true",
                        help="Disable Weights & Biases logging")
    args = parser.parse_args()

    train_rllib(args)

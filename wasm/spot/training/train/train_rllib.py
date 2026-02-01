import os
# Disable Ray Train V2 to avoid deprecation errors and API mismatches
os.environ["RAY_TRAIN_V2_ENABLED"] = "0"

import argparse
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
import yaml
import ray
from ray import tune, train
from ray.rllib.algorithms.ppo import PPOConfig, PPO
from pathlib import Path
import sys

# Ensure we can import envs
sys.path.append(str(Path(__file__).parent.parent))
from envs.spot_env import SpotEnv

def train_rllib(args):
    # Load config
    with open(args.config, 'r') as f:
        config_data = yaml.safe_load(f)

    # Initialize Ray
    if not ray.is_initialized():
        ray.init(address="auto" if os.environ.get("RAY_ADDRESS") else None)

    # Register Environment
    def env_creator(env_config):
        return SpotEnv()

    tune.register_env("spot_env", env_creator)

    # Map Config
    training_conf = config_data['training']
    total_timesteps = training_conf['total_timesteps']

    # === Managed Scale Distributed Strategy ===
    # Using 2 concurrent trials to reduce cluster-wide process noise while keeping scale high.
    # Total workers: 12 workers * 2 trials = 24 rollout processes + 2 learners.
    workers_per_trial = 12

    # RLlib PPO Config
    config = (
        PPOConfig()
        .environment("spot_env")
        .framework("torch")
        .environment(
            "spot_env",
            disable_env_checking=True,
        )
        .env_runners(
            num_env_runners=workers_per_trial,
            num_envs_per_env_runner=1, # CRM: Isolated processes for PyBullet stability
            rollout_fragment_length=256, # Smaller fragments for more frequent reporting
            num_cpus_per_env_runner=1,
            sample_timeout_s=600.0,
        )
        .training(
            # Full Grid Search Depth
            lr=tune.grid_search([1e-4, 2e-4, 3e-4, 5e-4]),
            gamma=training_conf['gamma'],
            lambda_=training_conf['gae_lambda'],
            clip_param=training_conf['clip_range'],
            entropy_coeff=training_conf['ent_coef'],
            vf_loss_coeff=training_conf['vf_coef'],
            grad_clip=training_conf['max_grad_norm'],
            # Maintain high batch size
            train_batch_size=32768,
        )
        # Using Legacy API stack for proven stability on this hardware/OS combination
        .api_stack(
            enable_rl_module_and_learner=False,
            enable_env_runner_and_connector_v2=False,
        )
        .resources(
            num_gpus=1,
        )
    )

    # Set PPO specific training parameters directly
    config.sgd_minibatch_size = training_conf['batch_size']
    config.num_sgd_iter = training_conf['n_epochs']

    # Run Training via Tuner
    print(f"🚀 Launching STABLE RUN: 3 Trials, 12 Workers/Trial...")

    tuner = tune.Tuner(
        "PPO",
        param_space=config,
        tune_config=tune.TuneConfig(
            mode="max",
            metric="env_runners/episode_reward_mean",
            max_concurrent_trials=3,
        ),
        run_config=tune.RunConfig(
            name="spot_ppo_stable_v5",
            checkpoint_config=tune.CheckpointConfig(
                num_to_keep=5,
                checkpoint_score_attribute="env_runners/episode_reward_mean",
                checkpoint_score_order="max",
                checkpoint_frequency=10,
            ),
        ),
    )

    results = tuner.fit()
    print("✅ Training complete!")
    best_result = results.get_best_result()
    print(f"🏆 Best Result: Path={best_result.path}")
    print(f"   Reward: {best_result.metrics.get('episode_reward_mean')}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", type=str, default="train/config.yaml")
    args = parser.parse_args()

    train_rllib(args)

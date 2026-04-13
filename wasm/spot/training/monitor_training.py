#!/usr/bin/env python3
"""
Live training monitor for Spot PPO runs on Weights & Biases.

Connects to the W&B API and prints a summary of all active (or recent)
runs including reward, timesteps, entropy coefficient, and node hostname.

Usage:
    pip install wandb
    python monitor_training.py                       # default entity/project
    python monitor_training.py --entity foo --project bar
    WANDB_ENTITY=foo WANDB_PROJECT=bar python monitor_training.py
"""

import argparse
import os
import sys
import time

try:
    import wandb
except ImportError:
    print("wandb not installed. Run: pip install wandb")
    sys.exit(1)


def get_dashboard_url(entity: str, project: str) -> str:
    return f"https://wandb.ai/{entity}/{project}"


def print_run_summary(runs, entity: str, project: str):
    """Print a formatted summary table of runs."""
    print("\033[2J\033[H", end="")  # clear screen
    print(f"Spot Locomotion Training Monitor")
    print(f"Dashboard: {get_dashboard_url(entity, project)}")
    print(f"{'=' * 80}")
    print()

    if not runs:
        print("No runs found.")
        return

    # Header
    fmt = "{:<30s} {:>10s} {:>12s} {:>10s} {:>8s} {:<15s}"
    print(fmt.format("Run", "Reward", "Timesteps", "Entropy", "State", "Host"))
    print("-" * 90)

    for run in runs:
        name = run.name[:30] if run.name else run.id[:30]
        state = run.state

        summary = run.summary or {}
        reward = summary.get(
            "env_runners/episode_reward_mean",
            summary.get("episode_reward_mean", None),
        )
        timesteps = summary.get("timesteps_total", summary.get("num_env_steps_sampled", None))

        # Extract entropy coeff from config
        config = run.config or {}
        entropy = config.get("entropy_coeff", None)

        # Extract hostname from tags
        tags = run.tags or []
        host = ""
        for tag in tags:
            if tag.startswith("host:"):
                host = tag[5:]
                break

        reward_str = f"{reward:.2f}" if reward is not None else "n/a"
        ts_str = f"{int(timesteps):,}" if timesteps is not None else "n/a"
        ent_str = f"{entropy}" if entropy is not None else "n/a"

        print(fmt.format(name, reward_str, ts_str, ent_str, state, host))

    print()
    print(f"Total runs: {len(runs)}")
    active = sum(1 for r in runs if r.state == "running")
    if active:
        print(f"Active: {active}")


def main():
    parser = argparse.ArgumentParser(description="Monitor Spot PPO training on W&B")
    parser.add_argument("--entity", default=os.environ.get("WANDB_ENTITY", "olivecasazza"))
    parser.add_argument("--project", default=os.environ.get("WANDB_PROJECT", "spot-locomotion"))
    parser.add_argument("--watch", action="store_true", help="Refresh every 30s")
    parser.add_argument("--all", action="store_true", help="Show finished runs too (default: running only)")
    args = parser.parse_args()

    api = wandb.Api()

    print(f"Public dashboard: {get_dashboard_url(args.entity, args.project)}")
    print()

    while True:
        filters = {} if args.all else {"state": "running"}
        try:
            runs = list(api.runs(
                f"{args.entity}/{args.project}",
                filters=filters,
                order="-created_at",
                per_page=20,
            ))
        except wandb.errors.CommError as e:
            print(f"W&B API error: {e}")
            runs = []

        print_run_summary(runs, args.entity, args.project)

        if not args.watch:
            break

        print(f"\nRefreshing in 30s... (Ctrl+C to stop)")
        try:
            time.sleep(30)
        except KeyboardInterrupt:
            print("\nStopped.")
            break


if __name__ == "__main__":
    main()

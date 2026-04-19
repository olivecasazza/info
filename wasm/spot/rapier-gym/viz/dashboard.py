"""Standalone dashboard for monitoring Spot training across multiple nodes.

Reads Ray progress.csv files from training nodes via SSH and visualizes
them in Rerun. Designed to run on seir (192.168.1.35) while training
runs on hp01-hp03 (192.168.1.121-123).

Usage:
    # Monitor all 3 HP nodes
    python -m viz.dashboard

    # Monitor specific nodes
    python -m viz.dashboard --nodes hp01,hp02

    # Monitor local training
    python -m viz.dashboard --local ~/ray_results/spot_rapier_v1

    # Custom ports
    python -m viz.dashboard --web-port 9091 --grpc-port 9877
"""

from __future__ import annotations

import argparse
import csv
import io
import subprocess
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

try:
    import rerun as rr
except ImportError:
    raise ImportError("rerun-sdk is required: pip install rerun-sdk")

# Training node configuration
NODES = {
    "hp01": "192.168.1.121",
    "hp02": "192.168.1.122",
    "hp03": "192.168.1.123",
}

RAY_RESULTS_DIR = "~/ray_results"
EXPERIMENT_NAME = "spot_rapier_v1"

# Metrics to extract and visualize
SCALAR_METRICS = [
    "env_runners/episode_reward_mean",
    "env_runners/episode_reward_min",
    "env_runners/episode_reward_max",
    "env_runners/episode_len_mean",
    "episode_reward_mean",
    "episode_reward_min",
    "episode_reward_max",
    "episode_len_mean",
    "timesteps_total",
    "time_total_s",
    "training_iteration",
]

LEARNER_METRICS = [
    "info/learner/default_policy/learner_stats/entropy",
    "info/learner/default_policy/learner_stats/kl",
    "info/learner/default_policy/learner_stats/vf_loss",
    "info/learner/default_policy/learner_stats/policy_loss",
    "info/learner/default_policy/learner_stats/total_loss",
    "info/learner/default_policy/cur_lr",
]

# Component reward columns (from custom_metrics in RLlib)
REWARD_COMPONENTS = [
    "r_velocity",
    "r_action_rate",
    "r_orientation",
    "r_foot_air",
    "r_height",
    "r_alive",
    "r_lin_vel_z",
    "r_ang_vel_xy",
    "r_body_collision",
    "r_torque",
    "r_joint_accel",
]


@dataclass
class NodeState:
    """Tracks the last-seen row count for a node's progress.csv."""

    node_name: str
    last_row_count: int = 0
    trial_dir: str = ""
    errors: int = 0


def find_latest_trial_ssh(node_ip: str, experiment: str) -> Optional[str]:
    """Find the latest trial directory on a remote node via SSH."""
    cmd = (
        f"ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no root@{node_ip} "
        f"'ls -td {RAY_RESULTS_DIR}/{experiment}/PPO_* 2>/dev/null | head -1'"
    )
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=10,
        )
        path = result.stdout.strip()
        return path if path else None
    except (subprocess.TimeoutExpired, subprocess.CalledProcessError):
        return None


def read_progress_ssh(node_ip: str, trial_dir: str) -> Optional[str]:
    """Read progress.csv from a remote node via SSH."""
    cmd = (
        f"ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no root@{node_ip} "
        f"'cat {trial_dir}/progress.csv 2>/dev/null'"
    )
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30,
        )
        return result.stdout if result.returncode == 0 else None
    except (subprocess.TimeoutExpired, subprocess.CalledProcessError):
        return None


def read_progress_local(trial_dir: str) -> Optional[str]:
    """Read progress.csv from a local directory."""
    path = Path(trial_dir) / "progress.csv"
    if not path.exists():
        # Try finding latest trial in directory
        parent = Path(trial_dir)
        if parent.is_dir():
            trials = sorted(parent.glob("PPO_*"), key=lambda p: p.stat().st_mtime, reverse=True)
            if trials:
                path = trials[0] / "progress.csv"

    if path.exists():
        return path.read_text()
    return None


def parse_progress_csv(csv_text: str) -> list[dict[str, str]]:
    """Parse a progress.csv into a list of row dicts."""
    reader = csv.DictReader(io.StringIO(csv_text))
    return list(reader)


def log_metrics_for_node(
    node_name: str,
    rows: list[dict[str, str]],
    start_from: int = 0,
) -> int:
    """Log metrics from new rows to Rerun. Returns total row count."""
    new_rows = rows[start_from:]
    if not new_rows:
        return len(rows)

    for row in new_rows:
        iteration = _safe_int(row.get("training_iteration", "0"))
        rr.set_time("iteration", sequence=iteration)

        timesteps = _safe_int(row.get("timesteps_total", "0"))
        rr.set_time("timesteps", sequence=timesteps)

        wall_time = _safe_float(row.get("timestamp", str(time.time())))
        rr.set_time("wall_clock", timestamp=wall_time)

        # Reward curves
        for col_name, log_name in [
            ("env_runners/episode_reward_mean", "reward_mean"),
            ("env_runners/episode_reward_min", "reward_min"),
            ("env_runners/episode_reward_max", "reward_max"),
            ("episode_reward_mean", "reward_mean"),
            ("episode_reward_min", "reward_min"),
            ("episode_reward_max", "reward_max"),
        ]:
            val = _safe_float(row.get(col_name))
            if val is not None:
                rr.log(f"{node_name}/rewards/{log_name}", rr.Scalars(val))

        # Episode length
        for col_name in ["env_runners/episode_len_mean", "episode_len_mean"]:
            val = _safe_float(row.get(col_name))
            if val is not None:
                rr.log(f"{node_name}/episode_length", rr.Scalars(val))
                break

        # Throughput
        ts = _safe_float(row.get("timesteps_total"))
        elapsed = _safe_float(row.get("time_total_s"))
        if ts is not None and elapsed and elapsed > 0:
            rr.log(f"{node_name}/throughput_sps", rr.Scalars(ts / elapsed))

        # Learner stats
        for metric in LEARNER_METRICS:
            val = _safe_float(row.get(metric))
            if val is not None:
                short_name = metric.split("/")[-1]
                rr.log(f"{node_name}/learner/{short_name}", rr.Scalars(val))

        # Component rewards (if logged as custom metrics)
        for component in REWARD_COMPONENTS:
            for prefix in [
                f"custom_metrics/{component}_mean",
                f"env_runners/custom_metrics/{component}_mean",
            ]:
                val = _safe_float(row.get(prefix))
                if val is not None:
                    rr.log(f"{node_name}/reward_components/{component}", rr.Scalars(val))
                    break

        # Log iteration marker
        rr.log(
            f"{node_name}/status",
            rr.TextLog(f"iter={iteration} ts={timesteps}"),
        )

    return len(rows)


def poll_nodes(
    nodes: dict[str, str],
    states: dict[str, NodeState],
    local_dir: Optional[str] = None,
) -> None:
    """Poll all nodes once and log new data."""
    for node_name, node_ip in nodes.items():
        state = states[node_name]

        # Find trial directory if not yet known
        if not state.trial_dir:
            trial_dir = find_latest_trial_ssh(node_ip, EXPERIMENT_NAME)
            if trial_dir:
                state.trial_dir = trial_dir
                rr.log(
                    f"{node_name}/status",
                    rr.TextLog(f"found trial: {trial_dir}"),
                )
            else:
                if state.errors % 12 == 0:  # Log every ~60s at 5s interval
                    rr.log(
                        f"{node_name}/status",
                        rr.TextLog(f"no trial found on {node_ip}"),
                    )
                state.errors += 1
                continue

        # Read progress
        csv_text = read_progress_ssh(node_ip, state.trial_dir)
        if csv_text is None:
            state.errors += 1
            if state.errors % 12 == 0:
                rr.log(
                    f"{node_name}/status",
                    rr.TextLog(f"failed to read progress.csv ({state.errors} errors)"),
                )
            continue

        state.errors = 0
        rows = parse_progress_csv(csv_text)
        state.last_row_count = log_metrics_for_node(
            node_name, rows, state.last_row_count
        )

    # Local directory
    if local_dir:
        node_name = "local"
        state = states.setdefault(node_name, NodeState(node_name=node_name))
        csv_text = read_progress_local(local_dir)
        if csv_text:
            rows = parse_progress_csv(csv_text)
            state.last_row_count = log_metrics_for_node(
                node_name, rows, state.last_row_count
            )


def _safe_float(val: Optional[str]) -> Optional[float]:
    """Parse a string to float, returning None on failure."""
    if val is None or val == "" or val == "nan":
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def _safe_int(val: Optional[str]) -> int:
    """Parse a string to int, returning 0 on failure."""
    if val is None or val == "":
        return 0
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return 0


def main():
    global EXPERIMENT_NAME

    parser = argparse.ArgumentParser(
        description="Spot training dashboard via Rerun"
    )
    parser.add_argument(
        "--nodes",
        default="hp01,hp02,hp03",
        help="Comma-separated node names to monitor (default: hp01,hp02,hp03)",
    )
    parser.add_argument(
        "--local",
        default=None,
        help="Path to local ray_results directory (skip SSH)",
    )
    parser.add_argument(
        "--experiment",
        default=EXPERIMENT_NAME,
        help=f"Ray experiment name (default: {EXPERIMENT_NAME})",
    )
    parser.add_argument(
        "--grpc-port",
        type=int,
        default=9877,
        help="Rerun gRPC port (default: 9877, avoids conflict with rerun_logger)",
    )
    parser.add_argument(
        "--web-port",
        type=int,
        default=9091,
        help="Rerun web viewer port (default: 9091)",
    )
    parser.add_argument(
        "--poll-interval",
        type=float,
        default=5.0,
        help="Seconds between polling nodes (default: 5.0)",
    )
    args = parser.parse_args()

    EXPERIMENT_NAME = args.experiment

    # Build node list
    node_names = [n.strip() for n in args.nodes.split(",")]
    active_nodes = {n: NODES[n] for n in node_names if n in NODES}

    if not active_nodes and not args.local:
        print(f"No valid nodes found in: {node_names}")
        print(f"Available: {list(NODES.keys())}")
        return

    # Start Rerun
    rr.init("spot_dashboard")
    server_uri = rr.serve_grpc(grpc_port=args.grpc_port)
    # Override URI to use the machine's actual IP so remote browsers can connect
    public_uri = f"rerun+http://192.168.1.35:{args.grpc_port}/proxy"
    rr.serve_web_viewer(
        web_port=args.web_port,
        open_browser=False,
        connect_to=public_uri,
    )

    print(f"Spot Training Dashboard")
    print(f"  Web viewer: http://0.0.0.0:{args.web_port}")
    print(f"  gRPC:       {server_uri}")
    print(f"  Nodes:      {list(active_nodes.keys())}")
    if args.local:
        print(f"  Local:      {args.local}")
    print(f"  Polling every {args.poll_interval}s")
    print()

    # Initialize state
    states: dict[str, NodeState] = {
        name: NodeState(node_name=name) for name in active_nodes
    }

    # Poll loop
    try:
        while True:
            poll_nodes(active_nodes, states, args.local)
            time.sleep(args.poll_interval)
    except KeyboardInterrupt:
        print("\nDashboard stopped.")


if __name__ == "__main__":
    main()

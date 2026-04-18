"""ONNX export pipeline for Spot quadruped policy.

Monitors training checkpoints, exports best model to ONNX, and saves
normalization stats alongside the model for WASM deployment.

Checkpoint locality note: Ray Tune's trial actor writes checkpoints to the
node it runs on. The --watch mode must run on the same node as the trial,
or the checkpoint directory must be shared (NFS, rsync, etc.).

Usage:
    # One-shot export from a specific checkpoint
    python export_pipeline.py --checkpoint /tmp/spot_checkpoints/checkpoint_000500 --output /tmp/spot_policy.onnx

    # Watch a directory and auto-export new checkpoints
    python export_pipeline.py --watch /tmp/spot_checkpoints --output-dir /tmp/spot_exports

    # Watch with custom poll interval
    python export_pipeline.py --watch /tmp/spot_checkpoints --output-dir /tmp/spot_exports --poll-interval 30
"""

import os

os.environ["RAY_TRAIN_V2_ENABLED"] = "0"

import argparse
import time
import warnings
from pathlib import Path

warnings.filterwarnings("ignore", category=DeprecationWarning)

import numpy as np
import ray
import torch
from ray import tune
from ray.rllib.algorithms.ppo import PPO

from spot_rapier import SpotEnvRapier

OBS_DIM = 50  # 45 physics + 5 behavior one-hot
ACTION_DIM = 12  # joint action offsets


def _ensure_env_registered():
    """Register the spot_rapier environment with Ray Tune."""
    tune.register_env("spot_rapier", lambda c: SpotEnvRapier(config=c))


class CleanPolicy(torch.nn.Module):
    """Extract the raw MLP layers from TorchModelV2 wrapper.

    RLlib's FullyConnectedNetwork wraps each layer in a SlimFC module.
    We extract the underlying nn.Sequential (_model) from each to get
    a clean forward pass suitable for ONNX export.
    """

    def __init__(self, model):
        super().__init__()
        self.h0 = model._hidden_layers[0]._model
        self.h1 = model._hidden_layers[1]._model
        self.h2 = model._hidden_layers[2]._model
        self.logits = model._logits._model

    def forward(self, obs):
        x = self.h0(obs)
        x = self.h1(x)
        x = self.h2(x)
        return self.logits(x)


def export_onnx(checkpoint_path: str, output_path: str) -> dict:
    """Export a PPO checkpoint to ONNX with normalization stats.

    Args:
        checkpoint_path: Path to a Ray RLlib checkpoint directory.
        output_path: Path for the output .onnx file.

    Returns:
        dict with keys: onnx_path, mean_path, std_path (paths to saved files).
    """
    _ensure_env_registered()

    if not ray.is_initialized():
        ray.init(ignore_reinit_error=True, num_gpus=0)

    algo = PPO.from_checkpoint(checkpoint_path)
    policy = algo.get_policy()
    model = policy.model.cpu()
    model.eval()

    clean = CleanPolicy(model)
    clean.eval()

    output_path = str(output_path)
    output_dir = os.path.dirname(output_path)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    dummy = torch.zeros(1, OBS_DIM)
    torch.onnx.export(
        clean,
        dummy,
        output_path,
        input_names=["obs"],
        output_names=["actions"],
        dynamic_axes={"obs": {0: "batch"}, "actions": {0: "batch"}},
        opset_version=11,
    )

    # Extract normalization stats from MeanStdFilter
    base = output_path.rsplit(".onnx", 1)[0]
    mean_path = f"{base}.obs_mean.npy"
    std_path = f"{base}.obs_std.npy"

    saved_stats = False
    # Try both attribute names for compatibility across Ray versions
    local_worker = getattr(algo, "env_runner", None) or getattr(
        algo.workers, "local_worker", lambda: None
    )()
    if local_worker is not None:
        filters = getattr(local_worker, "filters", {})
        if "default_policy" in filters:
            f = filters["default_policy"]
            if hasattr(f, "running_stats"):
                rs = f.running_stats
                mean = np.array(rs.mean, dtype=np.float32)
                std = np.sqrt(np.array(rs.var, dtype=np.float32) + 1e-8)
                np.save(mean_path, mean)
                np.save(std_path, std)
                saved_stats = True
                print(f"  Normalization stats saved ({mean.shape[0]}D)")

    if not saved_stats:
        print("  Warning: could not extract MeanStdFilter stats")
        mean_path = None
        std_path = None

    algo.stop()

    print(f"  ONNX exported to {output_path}")
    return {"onnx_path": output_path, "mean_path": mean_path, "std_path": std_path}


def _checkpoint_iteration(name: str) -> int:
    """Extract iteration number from checkpoint directory name."""
    # Ray names them checkpoint_NNNNNN
    parts = name.split("_")
    try:
        return int(parts[-1])
    except (ValueError, IndexError):
        return -1


def watch_and_export(watch_dir: str, output_dir: str, poll_interval: float = 60.0):
    """Watch a checkpoint directory and auto-export new checkpoints.

    Tracks the best checkpoint by reward (from metadata) and exports
    every new checkpoint it discovers.

    Args:
        watch_dir: Directory where Ray writes checkpoints.
        output_dir: Directory to write exported ONNX files.
        poll_interval: Seconds between directory polls.
    """
    os.makedirs(output_dir, exist_ok=True)
    seen = set()
    best_reward = float("-inf")

    print(f"Watching {watch_dir} for new checkpoints (poll every {poll_interval}s)")
    print(f"Exporting to {output_dir}")

    while True:
        if not os.path.isdir(watch_dir):
            time.sleep(poll_interval)
            continue

        # Find checkpoint directories
        entries = []
        for name in os.listdir(watch_dir):
            full = os.path.join(watch_dir, name)
            if os.path.isdir(full) and name.startswith("checkpoint_"):
                entries.append((name, full))

        entries.sort(key=lambda e: _checkpoint_iteration(e[0]))

        for name, full_path in entries:
            if name in seen:
                continue

            # Check if checkpoint is complete (has the marker files)
            if not _is_checkpoint_complete(full_path):
                continue

            seen.add(name)
            iteration = _checkpoint_iteration(name)
            stem = f"spot_policy_iter_{iteration:06d}"
            onnx_path = os.path.join(output_dir, f"{stem}.onnx")

            print(f"\n[EXPORT] New checkpoint: {name} (iter {iteration})")
            try:
                result = export_onnx(full_path, onnx_path)
                print(f"[EXPORT] Done: {result['onnx_path']}")
            except Exception as e:
                print(f"[EXPORT] Failed for {name}: {e}")
                # Remove from seen so we retry next poll
                seen.discard(name)

        time.sleep(poll_interval)


def _is_checkpoint_complete(checkpoint_dir: str) -> bool:
    """Check if a checkpoint directory has finished writing."""
    # RLlib old-stack checkpoints contain these files
    p = Path(checkpoint_dir)
    # At minimum, the algorithm state pickle should exist
    has_state = (
        (p / "algorithm_state.pkl").exists()
        or (p / "rllib_checkpoint.json").exists()
        or any(p.glob("checkpoint-*"))
    )
    return has_state


def main():
    parser = argparse.ArgumentParser(
        description="Export Spot quadruped PPO checkpoints to ONNX"
    )
    parser.add_argument(
        "--checkpoint",
        type=str,
        help="Path to a specific checkpoint to export",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="/tmp/spot_policy.onnx",
        help="Output path for ONNX file (one-shot mode)",
    )
    parser.add_argument(
        "--watch",
        type=str,
        help="Directory to watch for new checkpoints",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default="/tmp/spot_exports",
        help="Output directory for exported models (watch mode)",
    )
    parser.add_argument(
        "--poll-interval",
        type=float,
        default=60.0,
        help="Seconds between polls in watch mode",
    )

    args = parser.parse_args()

    if args.checkpoint:
        if not ray.is_initialized():
            ray.init(ignore_reinit_error=True)
        result = export_onnx(args.checkpoint, args.output)
        print(f"\nExported: {result['onnx_path']}")
        if result["mean_path"]:
            print(f"Mean:     {result['mean_path']}")
            print(f"Std:      {result['std_path']}")
    elif args.watch:
        if not ray.is_initialized():
            ray.init(ignore_reinit_error=True)
        watch_and_export(args.watch, args.output_dir, args.poll_interval)
    else:
        parser.print_help()
        parser.exit(1)


if __name__ == "__main__":
    main()

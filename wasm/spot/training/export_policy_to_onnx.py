#!/usr/bin/env python3
"""
Export a trained RLlib PPO policy to ONNX format for WASM integration.

This script:
1. Loads the latest checkpoint from a Ray training run
2. Extracts the PyTorch policy network
3. Exports it to ONNX format
4. The ONNX file can then be loaded in the Rust/WASM app via tract_onnx
"""

import argparse
import json
import pickle
import sys
from pathlib import Path

import numpy as np
import torch
import torch.onnx

# RLlib imports
from ray.rllib.algorithms.ppo import PPO
from ray.rllib.policy.policy import Policy


def find_latest_checkpoint(results_dir: Path, experiment_name: str = None) -> Path:
    """Find the most recent checkpoint in the results directory."""
    # Look for experiment directories
    if experiment_name:
        exp_dirs = list(results_dir.glob(experiment_name))
    else:
        exp_dirs = list(results_dir.glob("*"))

    if not exp_dirs:
        raise ValueError(f"No experiments found in {results_dir}")

    # Find the latest experiment (by modification time)
    exp_dirs = [d for d in exp_dirs if d.is_dir()]
    latest_exp = max(exp_dirs, key=lambda p: p.stat().st_mtime)

    # Look for trial directories (PPO_*) inside the experiment
    trial_dirs = list(latest_exp.glob("PPO_*"))
    if not trial_dirs:
        # Maybe the experiment IS the trial directory
        trial_dirs = [latest_exp]

    # Find the latest trial
    trial_dirs = [d for d in trial_dirs if d.is_dir()]
    latest_trial = max(trial_dirs, key=lambda p: p.stat().st_mtime)

    # Find checkpoint directories inside the trial
    checkpoints = sorted(
        latest_trial.glob("checkpoint_*"),
        key=lambda p: int(p.name.split("_")[-1]) if p.is_dir() else -1
    )

    if not checkpoints:
        raise ValueError(f"No checkpoints found in {latest_trial}")

    return checkpoints[-1]


def export_policy_to_onnx(
    checkpoint_path: Path,
    output_path: Path,
    obs_size: int = 42,
    action_size: int = 12,
):
    """
    Export the policy network from a checkpoint to ONNX format.

    Args:
        checkpoint_path: Path to the RLlib checkpoint directory
        output_path: Path to save the ONNX file
        obs_size: Size of the observation space (default: 42 for Spot)
        action_size: Size of the action space (default: 12 joint targets)
    """
    print(f"📦 Loading checkpoint from: {checkpoint_path}")

    # Load policy state directly
    policy_state_path = checkpoint_path / "policies" / "default_policy" / "policy_state.pkl"

    if not policy_state_path.exists():
        raise ValueError(f"Policy state not found at {policy_state_path}")

    with open(policy_state_path, "rb") as f:
        policy_state = pickle.load(f)

    print(f"   Policy state keys: {list(policy_state.keys())}")

    # Extract the model weights
    # RLlib stores the model in different formats depending on version
    if "weights" in policy_state:
        weights = policy_state["weights"]
    elif "model" in policy_state:
        weights = policy_state["model"]
    else:
        print(f"   Available keys: {list(policy_state.keys())}")
        raise ValueError("Could not find model weights in policy state")

    print(f"   Found {len(weights)} weight tensors")

    # Create a minimal PyTorch model that matches the architecture
    # PPO default: [256, 256] hidden layers with tanh activation
    class PolicyNetwork(torch.nn.Module):
        def __init__(self, obs_size, hidden_sizes, action_size):
            super().__init__()
            layers = []
            prev_size = obs_size
            for hidden_size in hidden_sizes:
                layers.append(torch.nn.Linear(prev_size, hidden_size))
                layers.append(torch.nn.Tanh())
                prev_size = hidden_size
            layers.append(torch.nn.Linear(prev_size, action_size))
            self.network = torch.nn.Sequential(*layers)

        def forward(self, x):
            return self.network(x)

    # Determine hidden sizes from weights
    # RLlib naming: _hidden_layers.0._model.0.weight, etc.
    hidden_sizes = []

    # Parse weight names to determine architecture
    weight_names = sorted([k for k in weights.keys() if "weight" in k.lower()])
    print(f"   Weight tensor names: {weight_names}")

    # Try to infer architecture from weight shapes
    for name in weight_names:
        shape = weights[name].shape
        print(f"   {name}: {shape}")

    # For now, use the config default [256, 256]
    hidden_sizes = [256, 256]

    # Create model
    model = PolicyNetwork(obs_size, hidden_sizes, action_size)
    print(f"   Created policy network: {obs_size} -> {hidden_sizes} -> {action_size}")

    # Load weights into model
    # This requires mapping RLlib weight names to PyTorch names
    state_dict = {}

    # Common RLlib weight name patterns for Legacy API (used with api_stack_v1)
    weight_mapping = {
        # Legacy API stack - TorchModel with FullyConnectedNetwork
        "_hidden_layers.0._model.0.weight": "network.0.weight",
        "_hidden_layers.0._model.0.bias": "network.0.bias",
        "_hidden_layers.1._model.0.weight": "network.2.weight",
        "_hidden_layers.1._model.0.bias": "network.2.bias",
        # Note: _logits outputs 24 values (12 mean + 12 std for DiagGaussian)
        # We'll handle this specially below
    }

    # Try to map weights
    mapped_count = 0
    for rllib_name, torch_name in weight_mapping.items():
        if rllib_name in weights:
            tensor = weights[rllib_name]
            if isinstance(tensor, np.ndarray):
                tensor = torch.from_numpy(tensor)
            state_dict[torch_name] = tensor
            mapped_count += 1
            print(f"   Mapped: {rllib_name} -> {torch_name}")

    # Handle the logits layer specially: take only first action_size rows (means)
    # The _logits layer outputs [2*action_size] = [means, log_stds]
    if "_logits._model.0.weight" in weights:
        logits_weight = weights["_logits._model.0.weight"]
        logits_bias = weights["_logits._model.0.bias"]
        if isinstance(logits_weight, np.ndarray):
            logits_weight = torch.from_numpy(logits_weight)
            logits_bias = torch.from_numpy(logits_bias)
        # Take only the first action_size rows (the action means)
        state_dict["network.4.weight"] = logits_weight[:action_size, :]
        state_dict["network.4.bias"] = logits_bias[:action_size]
        mapped_count += 2
        print(f"   Mapped: _logits._model.0.* -> network.4.* (truncated to {action_size} outputs)")

    if mapped_count == 0:
        print("\n   ⚠️  Could not map weights automatically.")
        print("   Available weight keys:")
        for k, v in weights.items():
            shape = v.shape if hasattr(v, 'shape') else 'scalar'
            print(f"      {k}: {shape}")
        print("\n   Saving raw weights to JSON for inspection...")

        # Save weights info for debugging
        debug_path = output_path.parent / "weights_debug.json"
        with open(debug_path, "w") as f:
            info = {k: str(v.shape) if hasattr(v, 'shape') else str(type(v)) for k, v in weights.items()}
            json.dump(info, f, indent=2)
        print(f"   Saved to {debug_path}")
        return

    # Load state dict
    model.load_state_dict(state_dict)
    model.eval()

    # Export to ONNX
    print(f"\n🔧 Exporting to ONNX: {output_path}")

    dummy_input = torch.randn(1, obs_size)

    torch.onnx.export(
        model,
        dummy_input,
        str(output_path),
        export_params=True,
        opset_version=11,
        do_constant_folding=True,
        input_names=["observation"],
        output_names=["action"],
        dynamic_axes={
            "observation": {0: "batch_size"},
            "action": {0: "batch_size"},
        },
    )

    print(f"✅ Policy exported to {output_path}")
    print(f"   Input shape: (batch, {obs_size})")
    print(f"   Output shape: (batch, {action_size})")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export RLlib policy to ONNX")
    parser.add_argument(
        "--results-dir",
        type=Path,
        default=Path("/var/lib/ray/ray_results"),
        help="Path to Ray results directory",
    )
    parser.add_argument(
        "--experiment",
        type=str,
        default="spot_ppo_stable_v5",
        help="Experiment name pattern",
    )
    parser.add_argument(
        "--checkpoint",
        type=Path,
        default=None,
        help="Specific checkpoint path (overrides auto-detection)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("./policy.onnx"),
        help="Output ONNX file path",
    )
    parser.add_argument(
        "--obs-size",
        type=int,
        default=42,
        help="Observation space size",
    )
    parser.add_argument(
        "--action-size",
        type=int,
        default=12,
        help="Action space size",
    )

    args = parser.parse_args()

    if args.checkpoint:
        checkpoint_path = args.checkpoint
    else:
        checkpoint_path = find_latest_checkpoint(args.results_dir, args.experiment + "*")

    export_policy_to_onnx(
        checkpoint_path=checkpoint_path,
        output_path=args.output,
        obs_size=args.obs_size,
        action_size=args.action_size,
    )

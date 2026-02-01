"""
Export trained PPO model to ONNX for Rust/WASM deployment
"""

import argparse
import torch
import onnx
import onnxruntime as ort
import numpy as np
from pathlib import Path
from stable_baselines3 import PPO


def export_to_onnx(model_path: str, output_path: str, opset_version: int = 14):
    """
    Export Stable-Baselines3 PPO model to ONNX format

    Args:
        model_path: Path to saved .zip model
        output_path: Output path for .onnx file
        opset_version: ONNX opset version (14 works well with tract)
    """
    print(f"📦 Loading model from {model_path}")
    model = PPO.load(model_path)

    # Extract the policy network
    policy = model.policy
    policy.eval()

    # Create dummy input (42D observation)
    dummy_input = torch.randn(1, 42, dtype=torch.float32)

    print(f"🔧 Exporting to ONNX (opset {opset_version})...")

    # Export to ONNX
    torch.onnx.export(
        policy.mlp_extractor,  # The actual MLP network
        dummy_input,
        output_path,
        export_params=True,
        opset_version=opset_version,
        do_constant_folding=True,
        input_names=['observation'],
        output_names=['action'],
        dynamic_axes={
            'observation': {0: 'batch_size'},
            'action': {0: 'batch_size'}
        }
    )

    # Verify ONNX model
    print(f"✅ Verifying ONNX model...")
    onnx_model = onnx.load(output_path)
    onnx.checker.check_model(onnx_model)

    # Test inference
    print(f"🧪 Testing ONNX inference...")
    ort_session = ort.InferenceSession(output_path)

    test_input = np.random.randn(1, 42).astype(np.float32)
    ort_inputs = {ort_session.get_inputs()[0].name: test_input}
    ort_outputs = ort_session.run(None, ort_inputs)

    print(f"   Input shape: {test_input.shape}")
    print(f"   Output shape: {ort_outputs[0].shape}")
    print(f"   Output sample: {ort_outputs[0][0][:4]}...")  # First 4 values

    # Get model size
    file_size = Path(output_path).stat().st_size
    print(f"\n✅ Export complete!")
    print(f"   Output: {output_path}")
    print(f"   Size: {file_size / 1024:.2f} KB")
    print(f"   Ready for Rust/WASM deployment!")


def test_model_equivalence(sb3_model_path: str, onnx_path: str, num_tests: int = 100):
    """Verify ONNX model produces same outputs as original"""
    print(f"\n🔬 Testing model equivalence ({num_tests} samples)...")

    model = PPO.load(sb3_model_path)
    ort_session = ort.InferenceSession(onnx_path)

    max_diff = 0.0
    for i in range(num_tests):
        # Random observation
        obs = np.random.randn(1, 42).astype(np.float32)

        # SB3 prediction
        with torch.no_grad():
            sb3_action, _ = model.predict(obs[0], deterministic=True)

        # ONNX prediction
        ort_inputs = {ort_session.get_inputs()[0].name: obs}
        onnx_action = ort_session.run(None, ort_inputs)[0][0]

        # Compare
        diff = np.abs(sb3_action - onnx_action).max()
        max_diff = max(max_diff, diff)

    print(f"   Max difference: {max_diff:.6f}")

    if max_diff < 1e-4:
        print(f"   ✅ Models are equivalent!")
    else:
        print(f"   ⚠️  Warning: Models differ by {max_diff}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export PPO model to ONNX")
    parser.add_argument(
        "--model",
        type=str,
        required=True,
        help="Path to trained PPO model (.zip)"
    )
    parser.add_argument(
        "--output",
        type=str,
        default="policy.onnx",
        help="Output ONNX file path"
    )
    parser.add_argument(
        "--opset",
        type=int,
        default=14,
        help="ONNX opset version"
    )
    parser.add_argument(
        "--test",
        action="store_true",
        help="Test model equivalence after export"
    )

    args = parser.parse_args()

    # Export
    export_to_onnx(args.model, args.output, args.opset)

    # Optional: Test equivalence
    if args.test:
        test_model_equivalence(args.model, args.output)

    print(f"\n📋 Next steps:")
    print(f"   1. Copy {args.output} to your Rust project:")
    print(f"      cp {args.output} ../assets/")
    print(f"   2. Load in Rust controller:")
    print(f'      let policy = Policy::from_onnx(include_bytes!("../assets/{Path(args.output).name}"))?;')

#!/usr/bin/env bash
set -euo pipefail

# Build wheel and deploy to HP training nodes
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WHEEL_DIR="$SCRIPT_DIR/target/wheels"
NODES="192.168.1.121 192.168.1.122 192.168.1.123"

echo "=== Building wheel ==="
cd "$SCRIPT_DIR"
nix-shell -p maturin rustc cargo --run "maturin build --release"

WHEEL=$(ls -t "$WHEEL_DIR"/*.whl | head -1)
echo "Built: $WHEEL"

for node in $NODES; do
    echo ""
    echo "=== Deploying to $node ==="

    # Copy wheel + training script + URDF
    scp "$WHEEL" root@$node:/tmp/spot_rapier.whl
    scp "$SCRIPT_DIR/train_rapier.py" root@$node:/opt/spot-training-code/train_rapier.py
    scp "$SCRIPT_DIR/../assets/spot.urdf" root@$node:/opt/spot-training-code/assets/spot.urdf

    # Install wheel
    ssh root@$node "
        export LD_LIBRARY_PATH='/nix/store/xm08aqdd7pxcdhm0ak6aqb1v7hw5q6ri-gcc-14.3.0-lib/lib:/nix/store/l7xwm1f6f3zj2x8jwdbi8gdyfbx07sh7-zlib-1.3.1/lib:/run/opengl-driver/lib'
        /opt/spot-training/bin/pip install --force-reinstall /tmp/spot_rapier.whl
        echo 'Installed on $node'
    "
done

echo ""
echo "=== Deployment complete ==="
echo "To start training on a node:"
echo "  ssh root@192.168.1.121 'cd /opt/spot-training-code && /opt/spot-training/bin/python train_rapier.py --no-wandb'"

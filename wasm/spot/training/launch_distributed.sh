#!/usr/bin/env bash
# Launch distributed Spot PPO training across HP GPU nodes
# hp01 (192.168.1.121) = Ray head + 1 GPU
# hp02 (192.168.1.122) = Ray worker + 1 GPU
# hp03 (192.168.1.123) = Ray worker + 1 GPU
set -euo pipefail

TRAINING_DIR="/opt/spot-training-code"
VENV="/opt/spot-training"
HEAD_IP="192.168.1.121"
WORKER_IPS=("192.168.1.122" "192.168.1.123")
ALL_IPS=("$HEAD_IP" "${WORKER_IPS[@]}")
RAY_PORT=6379
DASHBOARD_PORT=8265

# Sync training code to all nodes
echo "=== Syncing training code to all nodes ==="
for ip in "${ALL_IPS[@]}"; do
  echo "  -> $ip"
  ssh root@"$ip" "mkdir -p $TRAINING_DIR"
  rsync -az --delete \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    --exclude='results/' \
    "$(dirname "$0")/" root@"$ip":"$TRAINING_DIR/"
done

# Stop any existing Ray processes
echo "=== Stopping existing Ray instances ==="
for ip in "${ALL_IPS[@]}"; do
  ssh root@"$ip" "$VENV/bin/ray stop --force 2>/dev/null || true" &
done
wait

# Start Ray head on hp01
echo "=== Starting Ray head on $HEAD_IP ==="
ssh root@"$HEAD_IP" "cd $TRAINING_DIR && $VENV/bin/ray start --head \
  --port=$RAY_PORT \
  --dashboard-host=0.0.0.0 \
  --dashboard-port=$DASHBOARD_PORT \
  --num-gpus=1 \
  --num-cpus=14"

sleep 3

# Start Ray workers on hp02 and hp03
for ip in "${WORKER_IPS[@]}"; do
  echo "=== Starting Ray worker on $ip ==="
  ssh root@"$ip" "cd $TRAINING_DIR && $VENV/bin/ray start \
    --address=$HEAD_IP:$RAY_PORT \
    --num-gpus=1 \
    --num-cpus=14"
done

sleep 2

# Verify cluster
echo "=== Ray cluster status ==="
ssh root@"$HEAD_IP" "$VENV/bin/ray status"

# Launch training
echo "=== Launching PPO training ==="
echo "  Ray Dashboard: http://$HEAD_IP:$DASHBOARD_PORT"
echo "  3 trials x 3 GPUs, grid search over entropy coeff"
ssh root@"$HEAD_IP" "cd $TRAINING_DIR && $VENV/bin/python train/train_rllib.py --config train/config.yaml"

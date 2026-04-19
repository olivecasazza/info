"""Live replay of latest checkpoint policy in Rapier env, streamed to Rerun.

Runs on a training node. Loads the latest checkpoint, runs episodes,
and streams robot state + terrain to Rerun on seir.

Usage: python viz/live_replay.py --rerun-addr 192.168.1.35:9877
"""
import os
os.environ["RAY_TRAIN_V2_ENABLED"] = "0"

import pickle
import math
import time
import argparse
import numpy as np
import torch
import torch.nn as nn

import rerun as rr
import rerun.blueprint as rrb

from spot_rapier.spot_rapier import SpotSim
from pathlib import Path


class CleanPolicy(nn.Module):
    def __init__(self, weights):
        super().__init__()
        self.h0 = nn.Sequential(nn.Linear(50, 256), nn.Tanh())
        self.h1 = nn.Sequential(nn.Linear(256, 128), nn.Tanh())
        self.h2 = nn.Sequential(nn.Linear(128, 64), nn.Tanh())
        self.logits = nn.Sequential(nn.Linear(64, 12))

        state = self.state_dict()
        state['h0.0.weight'] = torch.tensor(weights['_hidden_layers.0._model.0.weight'])
        state['h0.0.bias'] = torch.tensor(weights['_hidden_layers.0._model.0.bias'])
        state['h1.0.weight'] = torch.tensor(weights['_hidden_layers.1._model.0.weight'])
        state['h1.0.bias'] = torch.tensor(weights['_hidden_layers.1._model.0.bias'])
        state['h2.0.weight'] = torch.tensor(weights['_hidden_layers.2._model.0.weight'])
        state['h2.0.bias'] = torch.tensor(weights['_hidden_layers.2._model.0.bias'])
        state['logits.0.weight'] = torch.tensor(weights['_logits._model.0.weight'])
        state['logits.0.bias'] = torch.tensor(weights['_logits._model.0.bias'])
        self.load_state_dict(state)
        self.eval()

    def forward(self, obs):
        x = self.h0(obs)
        x = self.h1(x)
        x = self.h2(x)
        return self.logits(x)


def load_policy(checkpoint_dir):
    policy_path = os.path.join(checkpoint_dir, "policies/default_policy/policy_state.pkl")
    state = pickle.load(open(policy_path, "rb"))
    weights = state["weights"]

    # Load normalization stats
    algo_path = os.path.join(checkpoint_dir, "algorithm_state.pkl")
    algo_state = pickle.load(open(algo_path, "rb"))
    filters = algo_state.get("worker", {}).get("filters", {})
    mean = np.zeros(50, dtype=np.float32)
    std = np.ones(50, dtype=np.float32)
    if "default_policy" in filters:
        f = filters["default_policy"]
        if hasattr(f, "running_stats"):
            rs = f.running_stats
            mean = np.array(rs.mean, dtype=np.float32)
            std = np.sqrt(np.array(rs.var, dtype=np.float32) + 1e-8)

    return CleanPolicy(weights), mean, std


# Spot skeleton link definitions (Y-up Rapier frame)
SKELETON = {
    "body_f": ([0.15, 0, 0], [-0.15, 0, 0]),
    "body_l": ([0.15, 0, 0.08], [-0.15, 0, 0.08]),
    "body_r": ([0.15, 0, -0.08], [-0.15, 0, -0.08]),
    "fl_hip": ([0.15, 0, 0.08], [0.15, 0, 0.15]),
    "fl_upper": ([0.15, 0, 0.15], [0.15, -0.2, 0.15]),
    "fl_lower": ([0.15, -0.2, 0.15], [0.15, -0.35, 0.15]),
    "fr_hip": ([0.15, 0, -0.08], [0.15, 0, -0.15]),
    "fr_upper": ([0.15, 0, -0.15], [0.15, -0.2, -0.15]),
    "fr_lower": ([0.15, -0.2, -0.15], [0.15, -0.35, -0.15]),
    "bl_hip": ([-0.15, 0, 0.08], [-0.15, 0, 0.15]),
    "bl_upper": ([-0.15, 0, 0.15], [-0.15, -0.2, 0.15]),
    "bl_lower": ([-0.15, -0.2, 0.15], [-0.15, -0.35, 0.15]),
    "br_hip": ([-0.15, 0, -0.08], [-0.15, 0, -0.15]),
    "br_upper": ([-0.15, 0, -0.15], [-0.15, -0.2, -0.15]),
    "br_lower": ([-0.15, -0.2, -0.15], [-0.15, -0.35, -0.15]),
}


def log_terrain(sim, seed, difficulty):
    """Generate and log terrain mesh to Rerun."""
    if difficulty <= 0:
        # Flat ground
        rr.log("world/ground", rr.Boxes3D(
            centers=[[0, -0.01, 0]], sizes=[[4.0, 0.02, 4.0]],
            colors=[[60, 120, 60, 200]],
        ), static=True)
        return

    # Generate heightfield matching training terrain
    from noise import pnoise2
    res = 32
    size = 4.0
    half = size / 2
    step = size / (res - 1)
    height_scale = 0.05 * difficulty

    vertices = []
    colors = []
    for z in range(res):
        for x in range(res):
            wx = x * step - half
            wz = z * step - half
            h = pnoise2(wx * 0.3, wz * 0.3, base=int(seed)) * height_scale
            vertices.append([wx, h, wz])
            g = int(80 + h / max(height_scale, 0.01) * 60)
            colors.append([40, max(60, min(200, g)), 40, 200])

    indices = []
    for z in range(res - 1):
        for x in range(res - 1):
            tl = z * res + x
            indices.append([tl, tl + res, tl + 1])
            indices.append([tl + 1, tl + res, tl + res + 1])

    rr.log("world/terrain", rr.Mesh3D(
        vertex_positions=vertices,
        triangle_indices=indices,
        vertex_colors=colors,
    ), static=True)


def log_robot(sim, step_num):
    """Log robot skeleton state."""
    height = sim.get_base_height()
    rpy = sim.get_base_orientation()
    joints = sim.get_joint_positions()
    contacts = sim.get_foot_contacts()

    # Build skeleton with actual height
    segments = []
    seg_colors = []
    for name, (start, end) in SKELETON.items():
        s = [start[0], start[1] + height, start[2]]
        e = [end[0], end[1] + height, end[2]]
        segments.append([s, e])
        if "lower" in name:
            color = [50, 255, 50, 255] if any(contacts) else [255, 100, 50, 255]
        elif "upper" in name:
            seg_colors.append([100, 180, 255, 255])
            continue
        elif "body" in name:
            seg_colors.append([220, 220, 220, 255])
            continue
        elif "hip" in name:
            seg_colors.append([180, 180, 255, 255])
            continue
        seg_colors.append(color)

    # Fix: ensure colors match segments
    seg_colors = []
    for name, _ in SKELETON.items():
        if "lower" in name:
            seg_colors.append([255, 150, 50, 255])
        elif "upper" in name:
            seg_colors.append([100, 180, 255, 255])
        elif "body" in name:
            seg_colors.append([220, 220, 220, 255])
        else:
            seg_colors.append([180, 180, 255, 255])

    rr.log("world/robot/skeleton", rr.LineStrips3D(segments, colors=seg_colors, radii=0.008))

    # Foot contact indicators
    foot_names = ["fl", "fr", "bl", "br"]
    foot_positions = [
        [0.15, height - 0.35, 0.15],
        [0.15, height - 0.35, -0.15],
        [-0.15, height - 0.35, 0.15],
        [-0.15, height - 0.35, -0.15],
    ]
    foot_colors = []
    for i, c in enumerate(contacts):
        foot_colors.append([0, 255, 0, 255] if c else [255, 0, 0, 255])
    rr.log("world/robot/feet", rr.Points3D(foot_positions, radii=0.02, colors=foot_colors))

    # Base marker
    rr.log("world/robot/base", rr.Points3D([[0, height, 0]], radii=0.03, colors=[0, 200, 255, 255]))

    # Scalars
    rr.log("metrics/height", rr.Scalars(height))
    rr.log("metrics/roll", rr.Scalars(math.degrees(rpy[0])))
    rr.log("metrics/pitch", rr.Scalars(math.degrees(rpy[1])))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--checkpoint", default="/tmp/spot_checkpoints")
    parser.add_argument("--grpc-port", type=int, default=9877)
    parser.add_argument("--web-port", type=int, default=9091)
    parser.add_argument("--fps", type=int, default=30)
    parser.add_argument("--terrain-difficulty", type=float, default=0.0)
    parser.add_argument("--terrain-seed", type=int, default=42)
    args = parser.parse_args()

    # Load policy
    print(f"Loading checkpoint from {args.checkpoint}...", flush=True)
    policy, obs_mean, obs_std = load_policy(args.checkpoint)
    print(f"Policy loaded. Obs mean[:3]={obs_mean[:3]}", flush=True)

    # Find URDF
    urdf_path = Path("/opt/spot-training-code/assets/spot.urdf")
    urdf_content = urdf_path.read_text()

    blueprint = rrb.Blueprint(
        rrb.Horizontal(
            rrb.Spatial3DView(name="Robot", contents=["+ /world/**"]),
            rrb.Vertical(
                rrb.TimeSeriesView(name="Height", contents=["+ /metrics/height"]),
                rrb.TimeSeriesView(name="Orientation", contents=["+ /metrics/roll", "+ /metrics/pitch"]),
                rrb.TimeSeriesView(name="Episode Reward", contents=["+ /metrics/episode_reward"]),
            ),
            column_shares=[2, 1],
        ),
        collapse_panels=True,
    )

    rr.init("spot_replay", default_blueprint=blueprint)
    rr.serve_grpc(grpc_port=args.grpc_port)
    rr.serve_web_viewer(web_port=args.web_port, open_browser=False)
    rr.log("world", rr.ViewCoordinates.RIGHT_HAND_Y_UP, static=True)

    print(f"Replay: http://192.168.1.35:{args.web_port}/?url=rerun%2Bhttp%3A%2F%2F192.168.1.35%3A{args.grpc_port}%2Fproxy", flush=True)

    dt = 1.0 / args.fps
    episode = 0

    while True:
        # Create env
        terrain_type = "heightfield" if args.terrain_difficulty > 0 else "flat"
        seed = args.terrain_seed + episode
        sim = SpotSim(urdf_content, terrain_type, seed, args.terrain_difficulty)

        log_terrain(sim, seed, args.terrain_difficulty)

        episode_reward = 0.0
        prev_action = np.zeros(12, dtype=np.float32)
        behavior_onehot = np.array([1, 0, 0, 0, 0], dtype=np.float32)

        for step in range(2000):
            rr.set_time("step", sequence=episode * 2000 + step)

            # Get observation
            raw_obs = np.array(sim.get_observation(), dtype=np.float32)
            raw_obs[42:45] = [0.5, 0, 0]  # walk forward command
            full_obs = np.concatenate([raw_obs, behavior_onehot])

            # Normalize and run policy
            normed = (full_obs - obs_mean) / obs_std
            with torch.no_grad():
                action = policy(torch.tensor(normed).unsqueeze(0)).squeeze(0).numpy()
            action = np.clip(action, -0.25, 0.25)

            sim.step(action.tolist())

            # Approximate reward (alive + height)
            height = sim.get_base_height()
            episode_reward += 0.5 + max(0, 1.0 - abs(height - 0.35) * 5)

            # Log every few frames
            if step % 2 == 0:
                log_robot(sim, step)
                rr.log("metrics/episode_reward", rr.Scalars(episode_reward))

            if sim.is_fallen():
                print(f"  Episode {episode}: fell at step {step}, reward={episode_reward:.0f}", flush=True)
                break

            time.sleep(dt)
        else:
            print(f"  Episode {episode}: survived 2000 steps, reward={episode_reward:.0f}", flush=True)

        episode += 1

        # Reload policy periodically (picks up new checkpoints)
        if episode % 5 == 0:
            try:
                policy, obs_mean, obs_std = load_policy(args.checkpoint)
                print(f"  Reloaded checkpoint", flush=True)
            except Exception:
                pass


if __name__ == "__main__":
    main()

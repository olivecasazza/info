"""Live replay of latest checkpoint on ALL terrain types simultaneously.

Runs on a training node. Loads the latest checkpoint, runs the robot
on each terrain type in parallel, streams to Rerun with grid blueprint.

Usage: python live_replay.py
View:  http://<host>:9091/?url=rerun%2Bhttp%3A%2F%2F<host>%3A9877%2Fproxy
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

TERRAINS = ["flat", "heightfield", "stairs", "platforms", "obstacles", "slopes", "mixed"]


def log_robot(prefix, sim):
    height = sim.get_base_height()
    contacts = sim.get_foot_contacts()

    segments = []
    seg_colors = []
    for name, (start, end) in SKELETON.items():
        s = [start[0], start[1] + height, start[2]]
        e = [end[0], end[1] + height, end[2]]
        segments.append([s, e])
        if "lower" in name:
            seg_colors.append([255, 150, 50, 255])
        elif "upper" in name:
            seg_colors.append([100, 180, 255, 255])
        elif "body" in name:
            seg_colors.append([220, 220, 220, 255])
        else:
            seg_colors.append([180, 180, 255, 255])

    rr.log(f"{prefix}/skeleton", rr.LineStrips3D(segments, colors=seg_colors, radii=0.008))

    foot_positions = [
        [0.15, height - 0.35, 0.15],
        [0.15, height - 0.35, -0.15],
        [-0.15, height - 0.35, 0.15],
        [-0.15, height - 0.35, -0.15],
    ]
    foot_colors = [[0, 255, 0, 255] if c else [255, 0, 0, 255] for c in contacts]
    rr.log(f"{prefix}/feet", rr.Points3D(foot_positions, radii=0.02, colors=foot_colors))
    rr.log(f"{prefix}/base", rr.Points3D([[0, height, 0]], radii=0.03, colors=[0, 200, 255, 255]))


def log_ground(prefix, terrain_type):
    if terrain_type == "flat":
        rr.log(f"{prefix}/ground", rr.Boxes3D(
            centers=[[0, -0.01, 0]], sizes=[[3, 0.02, 3]], colors=[[60, 120, 60, 180]],
        ), static=True)
    elif terrain_type == "stairs":
        boxes = []
        for i in range(8):
            h = 0.03 * (i + 1)
            boxes.append({"center": [1.5 + i * 0.25, h / 2, 0], "size": [0.25, h, 1.0]})
        rr.log(f"{prefix}/ground", rr.Boxes3D(
            centers=[b["center"] for b in boxes],
            sizes=[b["size"] for b in boxes],
            colors=[[80, 80, 140, 200]] * len(boxes),
        ), static=True)
    elif terrain_type == "slopes":
        rr.log(f"{prefix}/ground", rr.Boxes3D(
            centers=[[1.5, 0.15, 0], [-1.5, 0.15, 0]],
            sizes=[[2.0, 0.05, 1.0], [2.0, 0.05, 1.0]],
            colors=[[140, 100, 60, 200], [140, 100, 60, 200]],
        ), static=True)
    elif terrain_type == "platforms":
        import random
        random.seed(42)
        centers, sizes, colors = [], [], []
        for _ in range(12):
            x = random.uniform(-2, 2)
            z = random.uniform(-2, 2)
            h = random.uniform(0.03, 0.12)
            w = random.uniform(0.3, 0.8)
            d = random.uniform(0.3, 0.8)
            centers.append([x, h / 2, z])
            sizes.append([w, h, d])
            colors.append([100, 140, 100, 200])
        rr.log(f"{prefix}/ground", rr.Boxes3D(centers=centers, sizes=sizes, colors=colors), static=True)
    elif terrain_type == "obstacles":
        import random
        random.seed(42)
        centers, radii, colors = [], [], []
        for _ in range(15):
            x = random.uniform(-2, 2)
            z = random.uniform(-2, 2)
            if abs(x) < 1 and abs(z) < 1:
                continue
            r = random.uniform(0.05, 0.15)
            centers.append([x, r, z])
            radii.append(r)
            colors.append([180, 80, 80, 200])
        if centers:
            rr.log(f"{prefix}/ground", rr.Points3D(centers, radii=radii, colors=colors), static=True)
    else:
        rr.log(f"{prefix}/ground", rr.Boxes3D(
            centers=[[0, -0.01, 0]], sizes=[[3, 0.02, 3]], colors=[[60, 100, 60, 150]],
        ), static=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--checkpoint", default="/tmp/spot_checkpoints")
    parser.add_argument("--grpc-port", type=int, default=9877)
    parser.add_argument("--web-port", type=int, default=9091)
    parser.add_argument("--fps", type=int, default=15)
    parser.add_argument("--difficulty", type=float, default=0.5)
    args = parser.parse_args()

    print(f"Loading checkpoint from {args.checkpoint}...", flush=True)
    policy, obs_mean, obs_std = load_policy(args.checkpoint)

    urdf_content = Path("/opt/spot-training-code/assets/spot.urdf").read_text()

    # Build blueprint: grid of 3D views (one per terrain) + metrics
    terrain_views = []
    for t in TERRAINS:
        terrain_views.append(
            rrb.Spatial3DView(name=t.capitalize(), contents=[f"+ /{t}/**"])
        )

    blueprint = rrb.Blueprint(
        rrb.Vertical(
            rrb.Grid(
                *terrain_views,
                name="Terrain Views",
            ),
            rrb.Horizontal(
                rrb.TimeSeriesView(
                    name="Survival (steps before fall)",
                    contents=[f"+ /{t}/survival" for t in TERRAINS],
                ),
                rrb.TimeSeriesView(
                    name="Height",
                    contents=[f"+ /{t}/height" for t in TERRAINS],
                ),
            ),
        ),
        collapse_panels=True,
    )

    rr.init("spot_terrains", default_blueprint=blueprint)
    rr.serve_grpc(grpc_port=args.grpc_port)
    rr.serve_web_viewer(web_port=args.web_port, open_browser=False)

    # Set Y-up for all terrain roots
    for t in TERRAINS:
        rr.log(t, rr.ViewCoordinates.RIGHT_HAND_Y_UP, static=True)
        log_ground(t, t)

    host = "192.168.1.123"
    print(f"View: http://{host}:{args.web_port}/?url=rerun%2Bhttp%3A%2F%2F{host}%3A{args.grpc_port}%2Fproxy", flush=True)

    dt = 1.0 / args.fps
    behavior_onehot = np.array([1, 0, 0, 0, 0], dtype=np.float32)
    episode = 0

    while True:
        # Create one sim per terrain
        sims = {}
        prev_actions = {}
        alive = {}
        step_counts = {}

        for t in TERRAINS:
            seed = 42 + episode
            sims[t] = SpotSim(urdf_content, t, seed, args.difficulty)
            prev_actions[t] = np.zeros(12, dtype=np.float32)
            alive[t] = True
            step_counts[t] = 0

        for step in range(2000):
            rr.set_time("step", sequence=episode * 2000 + step)

            any_alive = False
            for t in TERRAINS:
                if not alive[t]:
                    continue
                any_alive = True

                sim = sims[t]
                raw_obs = np.array(sim.get_observation(), dtype=np.float32)
                raw_obs[42:45] = [0.5, 0, 0]
                full_obs = np.concatenate([raw_obs, behavior_onehot])

                normed = (full_obs - obs_mean) / obs_std
                with torch.no_grad():
                    action = policy(torch.tensor(normed).unsqueeze(0)).squeeze(0).numpy()
                action = np.clip(action, -0.25, 0.25)

                sim.step(action.tolist())
                step_counts[t] = step + 1

                if step % 3 == 0:
                    log_robot(t, sim)
                    rr.log(f"{t}/height", rr.Scalars(sim.get_base_height()))

                if sim.is_fallen():
                    alive[t] = False
                    rr.log(f"{t}/survival", rr.Scalars(float(step)))
                    print(f"  {t}: fell at step {step}", flush=True)

            if not any_alive:
                break
            time.sleep(dt)

        # Log survival for terrains that didn't fall
        for t in TERRAINS:
            if alive[t]:
                rr.log(f"{t}/survival", rr.Scalars(2000.0))

        survived = sum(1 for t in TERRAINS if alive[t])
        print(f"Episode {episode}: {survived}/{len(TERRAINS)} survived, steps={step_counts}", flush=True)

        episode += 1

        # Reload policy every 3 episodes
        if episode % 3 == 0:
            try:
                policy, obs_mean, obs_std = load_policy(args.checkpoint)
                print(f"  Reloaded checkpoint", flush=True)
            except Exception:
                pass


if __name__ == "__main__":
    main()

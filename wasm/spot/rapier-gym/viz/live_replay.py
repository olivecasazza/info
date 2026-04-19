"""Live replay with actual robot STL meshes in Rerun 3D view.

Loads checkpoint policy, runs in Rapier, streams robot mesh poses + terrain
+ training metrics to Rerun. The 3D view shows the real robot model.

Usage: python viz/live_replay.py --checkpoint /tmp/spot_checkpoints
View:  http://<host>:9091/?url=rerun%2Bhttp%3A%2F%2F<host>%3A9877%2Fproxy
"""
import os
os.environ["RAY_TRAIN_V2_ENABLED"] = "0"

import pickle
import math
import time
import argparse
import xml.etree.ElementTree as ET
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
import rerun as rr
import rerun.blueprint as rrb

from spot_rapier.spot_rapier import SpotSim

ASSETS_DIR = Path(__file__).parent.parent.parent / "assets"
URDF_PATH = ASSETS_DIR / "spot.urdf"
if not URDF_PATH.exists():
    URDF_PATH = Path("/opt/spot-training-code/assets/spot.urdf")
    ASSETS_DIR = URDF_PATH.parent

TERRAINS = ["flat", "heightfield", "stairs", "platforms", "obstacles", "slopes", "mixed"]


class CleanPolicy(nn.Module):
    def __init__(self, weights):
        super().__init__()
        input_dim = weights['_hidden_layers.0._model.0.weight'].shape[1]
        self.h0 = nn.Sequential(nn.Linear(input_dim, 256), nn.Tanh())
        self.h1 = nn.Sequential(nn.Linear(256, 128), nn.Tanh())
        self.h2 = nn.Sequential(nn.Linear(128, 64), nn.Tanh())
        self.logits = nn.Sequential(nn.Linear(64, 12))

        state = self.state_dict()
        for k in ['h0.0', 'h1.0', 'h2.0', 'logits.0']:
            src = k.replace('h0.0', '_hidden_layers.0._model.0').replace(
                'h1.0', '_hidden_layers.1._model.0').replace(
                'h2.0', '_hidden_layers.2._model.0').replace(
                'logits.0', '_logits._model.0')
            state[f'{k}.weight'] = torch.tensor(weights[f'{src}.weight'])
            state[f'{k}.bias'] = torch.tensor(weights[f'{src}.bias'])
        self.load_state_dict(state)
        self.eval()

    def forward(self, obs):
        return self.logits(self.h2(self.h1(self.h0(obs))))


def load_policy(checkpoint_dir):
    policy_path = os.path.join(checkpoint_dir, "policies/default_policy/policy_state.pkl")
    state = pickle.load(open(policy_path, "rb"))
    weights = state["weights"]
    input_dim = weights['_hidden_layers.0._model.0.weight'].shape[1]

    mean = np.zeros(input_dim, dtype=np.float32)
    std = np.ones(input_dim, dtype=np.float32)
    try:
        algo_path = os.path.join(checkpoint_dir, "algorithm_state.pkl")
        algo_state = pickle.load(open(algo_path, "rb"))
        filters = algo_state.get("worker", {}).get("filters", {})
        if "default_policy" in filters:
            f = filters["default_policy"]
            if hasattr(f, "running_stats"):
                rs = f.running_stats
                mean = np.array(rs.mean, dtype=np.float32)
                std = np.sqrt(np.array(rs.var, dtype=np.float32) + 1e-8)
    except Exception as e:
        print(f"Warning: no normalization stats: {e}", flush=True)

    return CleanPolicy(weights), mean, std, input_dim


def parse_urdf_meshes(urdf_path, assets_dir):
    """Parse URDF and return link->mesh mapping with visual origins."""
    tree = ET.parse(urdf_path)
    root = tree.getroot()
    meshes = {}

    for link in root.findall('.//link'):
        name = link.get('name')
        visual = link.find('visual')
        if visual is None:
            continue
        mesh_el = visual.find('.//mesh')
        if mesh_el is None:
            continue

        fname = mesh_el.get('filename', '').split('/')[-1]
        stl_path = assets_dir / fname
        if not stl_path.exists():
            continue

        origin = visual.find('origin')
        xyz = [0.0, 0.0, 0.0]
        rpy = [0.0, 0.0, 0.0]
        if origin is not None:
            if origin.get('xyz'):
                xyz = [float(x) for x in origin.get('xyz').split()]
            if origin.get('rpy'):
                rpy = [float(x) for x in origin.get('rpy').split()]

        meshes[name] = {
            'stl_path': stl_path,
            'stl_bytes': stl_path.read_bytes(),
            'xyz': xyz,
            'rpy': rpy,
        }
    return meshes


def log_robot_meshes(meshes):
    """Log all robot STL meshes as static assets in Rerun."""
    for link_name, info in meshes.items():
        entity = f"world/robot/{link_name}"
        rr.log(entity, rr.Asset3D(contents=info['stl_bytes'], media_type="model/stl"),
               static=True)


def log_robot_pose(meshes, base_height):
    """Update robot mesh transforms based on physics state."""
    # For now, position the entire robot at the base height
    # A full FK solution would compute per-link transforms from joint angles
    rr.log("world/robot", rr.Transform3D(
        translation=[0.0, base_height, 0.0],
    ))


def log_terrain(terrain_type, difficulty, seed):
    """Log terrain as 3D geometry in Rerun."""
    if terrain_type == "flat":
        rr.log("world/terrain/ground", rr.Boxes3D(
            centers=[[0, -0.005, 0]], sizes=[[6, 0.01, 6]],
            colors=[[30, 30, 30, 200]],
        ), static=True)
    elif terrain_type == "stairs":
        centers, sizes, colors = [], [], []
        n_steps = int(6 + 10 * difficulty)
        step_h = 0.04 + 0.12 * difficulty
        for i in range(n_steps):
            h = step_h * (i + 1)
            centers.append([1.5 + i * 0.3, h / 2, 0])
            sizes.append([0.3, h, 2.0])
            colors.append([40, 40, 60, 200])
        # Top platform
        top_h = step_h * n_steps
        centers.append([1.5 + n_steps * 0.3 + 1.0, top_h / 2, 0])
        sizes.append([2.0, top_h, 2.0])
        colors.append([40, 40, 60, 200])
        rr.log("world/terrain/stairs", rr.Boxes3D(
            centers=centers, sizes=sizes, colors=colors), static=True)
    elif terrain_type == "platforms":
        import random
        random.seed(seed)
        centers, sizes, colors = [], [], []
        for _ in range(int(8 + 12 * difficulty)):
            x, z = random.uniform(-3, 3), random.uniform(-3, 3)
            if abs(x) < 1 and abs(z) < 1:
                continue
            h = random.uniform(0.02, 0.15 * max(difficulty, 0.1))
            w, d = random.uniform(0.3, 0.8), random.uniform(0.3, 0.8)
            centers.append([x, h / 2, z])
            sizes.append([w, h, d])
            colors.append([30, 50, 30, 200])
        if centers:
            rr.log("world/terrain/platforms", rr.Boxes3D(
                centers=centers, sizes=sizes, colors=colors), static=True)
    elif terrain_type == "obstacles":
        import random
        random.seed(seed)
        centers, radii, colors = [], [], []
        for _ in range(int(10 + 20 * difficulty)):
            x, z = random.uniform(-3, 3), random.uniform(-3, 3)
            if abs(x) < 1 and abs(z) < 1:
                continue
            r = random.uniform(0.05, 0.2 * max(difficulty, 0.1))
            centers.append([x, r, z])
            radii.append(r)
            colors.append([60, 30, 30, 200])
        if centers:
            rr.log("world/terrain/obstacles", rr.Points3D(
                centers, radii=radii, colors=colors), static=True)
    elif terrain_type == "slopes":
        rr.log("world/terrain/slopes", rr.Boxes3D(
            centers=[[2, 0.2, 0], [-2, 0.2, 0], [0, 0.2, 2], [0, 0.2, -2]],
            sizes=[[3, 0.1, 1], [3, 0.1, 1], [1, 0.1, 3], [1, 0.1, 3]],
            colors=[[50, 40, 30, 200]] * 4,
        ), static=True)
    else:
        rr.log("world/terrain/ground", rr.Boxes3D(
            centers=[[0, -0.005, 0]], sizes=[[6, 0.01, 6]],
            colors=[[30, 30, 30, 200]],
        ), static=True)
    # Grid lines
    lines = []
    for i in range(-5, 6):
        lines.append([[i, 0, -5], [i, 0, 5]])
        lines.append([[-5, 0, i], [5, 0, i]])
    rr.log("world/terrain/grid", rr.LineStrips3D(
        lines, colors=[[50, 50, 50, 100]] * len(lines), radii=0.002), static=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--checkpoint", default="/tmp/spot_checkpoints")
    parser.add_argument("--grpc-port", type=int, default=9877)
    parser.add_argument("--web-port", type=int, default=9091)
    parser.add_argument("--fps", type=int, default=15)
    parser.add_argument("--difficulty", type=float, default=0.3)
    parser.add_argument("--terrain", default="flat")
    parser.add_argument("--connect-url", default="rerun+https://rerun-data.casazza.io/proxy",
                        help="Public gRPC URL for web viewer auto-connect (via Envoy gRPC-Web proxy)")
    args = parser.parse_args()

    print(f"Loading checkpoint from {args.checkpoint}...", flush=True)
    policy, obs_mean, obs_std, input_dim = load_policy(args.checkpoint)
    print(f"Policy loaded (input_dim={input_dim})", flush=True)

    urdf_content = URDF_PATH.read_text()
    meshes = parse_urdf_meshes(URDF_PATH, ASSETS_DIR)
    print(f"Loaded {len(meshes)} mesh parts", flush=True)

    blueprint = rrb.Blueprint(
        rrb.Horizontal(
            rrb.Spatial3DView(name="Robot", contents=["+ /world/**"]),
            rrb.Vertical(
                rrb.TimeSeriesView(name="Height", contents=["+ /metrics/height"]),
                rrb.TimeSeriesView(name="Reward", contents=["+ /metrics/reward"]),
                rrb.TimeSeriesView(name="Contacts",
                                   contents=["+ /metrics/foot_contacts/**"]),
            ),
            column_shares=[3, 1],
        ),
        collapse_panels=True,
    )

    rr.init("spot_replay", default_blueprint=blueprint)
    grpc_uri = rr.serve_grpc(grpc_port=args.grpc_port)
    connect_url = args.connect_url or grpc_uri
    rr.serve_web_viewer(web_port=args.web_port, open_browser=False, connect_to=connect_url)
    rr.log("world", rr.ViewCoordinates.RIGHT_HAND_Y_UP, static=True)

    # Log robot meshes (static — transforms update per step)
    log_robot_meshes(meshes)
    log_terrain(args.terrain, args.difficulty, 42)

    print(f"Web: http://0.0.0.0:{args.web_port}", flush=True)
    print(f"gRPC: {grpc_uri}", flush=True)
    print(f"Connect URL: {connect_url}", flush=True)

    dt = 1.0 / args.fps
    behavior_onehot = np.zeros(max(6, input_dim - 45), dtype=np.float32)
    behavior_onehot[0] = 1.0  # walk
    episode = 0

    while True:
        sim = SpotSim(urdf_content, args.terrain, 42 + episode, args.difficulty)
        episode_reward = 0.0

        for step in range(2000):
            rr.set_time("step", sequence=episode * 2000 + step)

            raw_obs = np.array(sim.get_observation(), dtype=np.float32)
            raw_obs[42:45] = [0.5, 0, 0]  # walk forward
            full_obs = np.concatenate([raw_obs, behavior_onehot])[:input_dim]

            normed = (full_obs - obs_mean[:input_dim]) / obs_std[:input_dim]
            with torch.no_grad():
                action = policy(torch.tensor(normed).unsqueeze(0)).squeeze(0).numpy()
            action = np.clip(action, -0.25, 0.25)

            sim.step(action.tolist())

            height = sim.get_base_height()
            episode_reward += 0.5 + max(0, 1.0 - abs(height - 0.35) * 5)

            if step % 2 == 0:
                log_robot_pose(meshes, height)
                rr.log("metrics/height", rr.Scalars(height))
                rr.log("metrics/reward", rr.Scalars(episode_reward))

                contacts = sim.get_foot_contacts()
                for i, name in enumerate(["FL", "FR", "BL", "BR"]):
                    rr.log(f"metrics/foot_contacts/{name}",
                           rr.Scalars(1.0 if contacts[i] else 0.0))

            if sim.is_fallen():
                print(f"  Episode {episode}: fell at step {step}", flush=True)
                break

            time.sleep(dt)
        else:
            print(f"  Episode {episode}: survived 2000 steps, r={episode_reward:.0f}", flush=True)

        episode += 1
        if episode % 3 == 0:
            try:
                policy, obs_mean, obs_std, input_dim = load_policy(args.checkpoint)
                print(f"  Reloaded checkpoint", flush=True)
            except Exception:
                pass


if __name__ == "__main__":
    main()

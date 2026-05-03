"""Replay trained policy on heightfield terrain — Python rerun-sdk 0.31.3.

- Loads MeanStdFilter from algorithm_state.pkl (proper obs normalization).
- Reproduces the heightfield mesh in Python from the same Perlin params used
  by spot-physics/src/terrain.rs (same seed + difficulty + 64×64 grid + center
  flatten + 0.3/0.6 frequency mix). Logs as Mesh3D so app.rerun.io shows the
  actual ground geometry the robot is walking on.
- Y-up world frame matches Rapier; base translation is (x, y_height, z).

Output: /tmp/spot-walk-real.rrd
"""
import math
import os
import pickle
import xml.etree.ElementTree as ET
from pathlib import Path

import numpy as np
import rerun as rr
import rerun.blueprint as rrb
import torch
import torch.nn as nn

from spot_rapier.spot_rapier import SpotSim

ASSETS = Path("/home/olive/Repositories/info/wasm/spot/assets")
URDF = ASSETS / "spot.urdf"
CKPT = "/home/olive/ray_results/spot_rapier_v1/PPO_spot_rapier_43b73_00000_0_2026-04-19_01-58-30/checkpoint_000003"
OUT = "/tmp/spot-walk-real.rrd"

TERRAIN = os.environ.get("SPOT_TERRAIN", "heightfield")
TERRAIN_DIFFICULTY = float(os.environ.get("SPOT_DIFFICULTY", "0.3"))
TERRAIN_SEED = int(os.environ.get("SPOT_SEED", "42"))
N_STEPS = int(os.environ.get("SPOT_STEPS", "800"))
COMMAND = (0.5, 0.0, 0.0)
BEHAVIOR_ID = 0
BEHAVIOR_ONEHOT_LEN = 6


# ─── URDF parsing ──────────────────────────────────────────────────────────


def parse_xyz(s):
    return [float(x) for x in (s or "0 0 0").split()]


def euler_to_quat(r, p, y):
    cr, sr = math.cos(r / 2), math.sin(r / 2)
    cp, sp = math.cos(p / 2), math.sin(p / 2)
    cy, sy = math.cos(y / 2), math.sin(y / 2)
    return [
        sr * cp * cy - cr * sp * sy,
        cr * sp * cy + sr * cp * sy,
        cr * cp * sy - sr * sp * cy,
        cr * cp * cy + sr * sp * sy,
    ]


def axis_angle_to_quat(axis, angle):
    ax, ay, az = axis
    n = math.sqrt(ax * ax + ay * ay + az * az) or 1.0
    ax, ay, az = ax / n, ay / n, az / n
    s = math.sin(angle / 2)
    return [ax * s, ay * s, az * s, math.cos(angle / 2)]


def quat_mul(a, b):
    ax, ay, az, aw = a
    bx, by, bz, bw = b
    return (
        aw * bx + ax * bw + ay * bz - az * by,
        aw * by - ax * bz + ay * bw + az * bx,
        aw * bz + ax * by - ay * bx + az * bw,
        aw * bw - ax * bx - ay * by - az * bz,
    )


def parse_urdf():
    root = ET.parse(URDF).getroot()
    links = {}
    for link in root.findall("link"):
        name = link.get("name")
        visual = link.find("visual")
        mesh_file = None
        v_xyz = [0, 0, 0]
        v_rpy = [0, 0, 0]
        if visual is not None:
            mesh = visual.find("geometry/mesh")
            if mesh is not None:
                bare = mesh.get("filename", "").rsplit("/", 1)[-1]
                if bare == "Battery.stl":
                    bare = "BatteryRenamed.stl"
                mesh_file = bare
            origin = visual.find("origin")
            if origin is not None:
                v_xyz = parse_xyz(origin.get("xyz"))
                v_rpy = parse_xyz(origin.get("rpy"))
        links[name] = {"mesh": mesh_file, "v_xyz": v_xyz, "v_rpy": v_rpy}

    joints = []
    for joint in root.findall("joint"):
        origin = joint.find("origin")
        axis = joint.find("axis")
        joints.append({
            "name": joint.get("name"),
            "type": joint.get("type"),
            "parent": joint.find("parent").get("link"),
            "child": joint.find("child").get("link"),
            "xyz": parse_xyz(origin.get("xyz") if origin is not None else None),
            "rpy": parse_xyz(origin.get("rpy") if origin is not None else None),
            "axis": parse_xyz(axis.get("xyz") if axis is not None else "0 0 1"),
        })
    return links, joints


def build_paths(joints, root_link="base_link"):
    children_of = {}
    for j in joints:
        children_of.setdefault(j["parent"], []).append(j)
    paths = {root_link: f"world/robot/{root_link}"}

    def recurse(parent):
        for j in children_of.get(parent, []):
            paths[j["child"]] = f"{paths[parent]}/{j['child']}"
            recurse(j["child"])

    recurse(root_link)
    return paths


# ─── Policy + obs filter ────────────────────────────────────────────────────


class CleanPolicy(nn.Module):
    def __init__(self, weights):
        super().__init__()
        dim = weights["_hidden_layers.0._model.0.weight"].shape[1]
        self.net = nn.Sequential(
            nn.Linear(dim, 256), nn.Tanh(),
            nn.Linear(256, 128), nn.Tanh(),
            nn.Linear(128, 64), nn.Tanh(),
            nn.Linear(64, 12),
        )
        sd = self.net.state_dict()
        for i, layer in enumerate(["_hidden_layers.0", "_hidden_layers.1", "_hidden_layers.2", "_logits"]):
            sd[f"{i*2}.weight"] = torch.tensor(weights[f"{layer}._model.0.weight"])
            sd[f"{i*2}.bias"] = torch.tensor(weights[f"{layer}._model.0.bias"])
        self.net.load_state_dict(sd)
        self.eval()
        self.dim = dim

    def forward(self, x):
        return self.net(x)


def load_policy_and_filter(ckpt):
    """Load weights from policy_state.pkl and the MeanStdFilter from
    algorithm_state.pkl. The filter normalizes obs the way the env runners
    did during training; without it, the policy sees a different distribution
    and produces uncalibrated actions.
    """
    pol = pickle.load(open(f"{ckpt}/policies/default_policy/policy_state.pkl", "rb"))
    policy = CleanPolicy(pol["weights"])

    algo = pickle.load(open(f"{ckpt}/algorithm_state.pkl", "rb"))
    f = algo["worker"]["filters"]["default_policy"]
    rs = f.running_stats
    mean = np.asarray(rs.mean, dtype=np.float32)
    std = np.asarray(rs.std, dtype=np.float32)
    std = np.where(std < 1e-3, 1.0, std)  # avoid divide-by-zero on unseen dims
    print(f"[filter] mean[:3]={mean[:3]} std[:3]={std[:3]} samples={rs.n}", flush=True)
    return policy, mean, std


# ─── Joint order ────────────────────────────────────────────────────────────


JOINT_ORDER = [
    "motor_front_left_hip", "motor_front_left_upper_leg", "motor_front_left_lower_leg",
    "motor_front_right_hip", "motor_front_right_upper_leg", "motor_front_right_lower_leg",
    "motor_back_left_hip", "motor_back_left_upper_leg", "motor_back_left_lower_leg",
    "motor_back_right_hip", "motor_back_right_upper_leg", "motor_back_right_lower_leg",
]


def main():
    print(f"rerun-sdk {rr.__version__}", flush=True)

    links, joints = parse_urdf()
    paths = build_paths(joints)
    joints_by_name = {j["name"]: j for j in joints}

    # Explicit Blueprint so app.rerun.io shows every motor's plot on load
    # without the user having to drill into the entity tree. Per-leg time-series
    # views group the three joints of each leg together; sensor cone obstacle
    # distances get their own panel. Grid layout matches the kinematic
    # symmetry of the robot.
    blueprint = rrb.Blueprint(
        rrb.Horizontal(
            rrb.Spatial3DView(
                name="Robot + terrain + sensors",
                origin="/world",
                contents=["+ /world/**"],
            ),
            rrb.Vertical(
                rrb.TimeSeriesView(
                    name="Body",
                    contents=[
                        "+ /metrics/base_height",
                        "+ /metrics/forward_velocity",
                        "+ /metrics/lateral_velocity",
                        "+ /metrics/base_pitch",
                        "+ /metrics/base_roll",
                        "+ /metrics/base_yaw",
                    ],
                ),
                rrb.Grid(
                    rrb.TimeSeriesView(
                        name="Front Left motors",
                        contents=[
                            "+ /metrics/joints/motor_front_left_hip",
                            "+ /metrics/joints/motor_front_left_upper_leg",
                            "+ /metrics/joints/motor_front_left_lower_leg",
                        ],
                    ),
                    rrb.TimeSeriesView(
                        name="Front Right motors",
                        contents=[
                            "+ /metrics/joints/motor_front_right_hip",
                            "+ /metrics/joints/motor_front_right_upper_leg",
                            "+ /metrics/joints/motor_front_right_lower_leg",
                        ],
                    ),
                    rrb.TimeSeriesView(
                        name="Back Left motors",
                        contents=[
                            "+ /metrics/joints/motor_back_left_hip",
                            "+ /metrics/joints/motor_back_left_upper_leg",
                            "+ /metrics/joints/motor_back_left_lower_leg",
                        ],
                    ),
                    rrb.TimeSeriesView(
                        name="Back Right motors",
                        contents=[
                            "+ /metrics/joints/motor_back_right_hip",
                            "+ /metrics/joints/motor_back_right_upper_leg",
                            "+ /metrics/joints/motor_back_right_lower_leg",
                        ],
                    ),
                    grid_columns=2,
                ),
                rrb.TimeSeriesView(
                    name="Foot contacts",
                    contents=["+ /metrics/foot_contacts/**"],
                ),
                rrb.TimeSeriesView(
                    name="Obstacle distances (forward cone)",
                    contents=["+ /metrics/sensors/obstacle_ray_*"],
                ),
                row_shares=[1, 4, 1, 1],
            ),
            column_shares=[3, 4],
        ),
        collapse_panels=True,
    )

    rr.init("spot_walk_real", recording_id="spot-walk-heightfield",
            default_blueprint=blueprint)
    rr.save(OUT)

    rr.log("world", rr.ViewCoordinates.RIGHT_HAND_Y_UP, static=True)

    # Origin axes for visual orientation check (red=X, green=Y up, blue=Z).
    rr.log(
        "world/origin",
        rr.Arrows3D(
            origins=[(0, 0, 0)] * 3,
            vectors=[(1, 0, 0), (0, 1, 0), (0, 0, 1)],
            colors=[(255, 0, 0), (0, 255, 0), (0, 0, 255)],
        ),
        static=True,
    )

    # Static link meshes — flat hierarchy, each link logged at world/robot/<name>
    # with its mesh as a child carrying the URDF visual `<origin>` offset.
    # Per-step, get_link_world_poses() overwrites the link transform with the
    # authoritative pose from Rapier (which already includes the URDF Z-up →
    # Rapier Y-up axis remap done in urdf.rs::load_robot).
    for name, link in links.items():
        if not link["mesh"]:
            continue
        stl = ASSETS / link["mesh"]
        if not stl.exists():
            continue
        entity = f"world/robot/{name}"
        rr.log(f"{entity}/mesh", rr.Asset3D(path=str(stl)), static=True)
        rr.log(
            f"{entity}/mesh",
            rr.Transform3D(
                translation=link["v_xyz"],
                quaternion=euler_to_quat(*link["v_rpy"]),
            ),
            static=True,
        )

    urdf_text = URDF.read_text()
    sim = SpotSim(urdf_text, TERRAIN, TERRAIN_SEED, TERRAIN_DIFFICULTY)
    print(f"sim spawned: terrain={TERRAIN} difficulty={TERRAIN_DIFFICULTY}", flush=True)

    # Spawn-time invariants: base above feet, feet symmetric, terrain below
    # robot, drop test (gravity points -Y). Failure here means the .rrd this
    # script produces would render wrong-but-plausibly, so fail fast instead.
    from sanity_check import sanity_check_all
    sanity_check_all(sim, urdf_text=urdf_text, terrain=TERRAIN)

    # Pull the actual terrain mesh out of Rapier — exact physics geometry,
    # not a Python approximation. Flat ground returns None (Cuboid).
    mesh = sim.get_terrain_mesh()
    if mesh is not None:
        flat_v, flat_t = mesh
        verts = np.asarray(flat_v, dtype=np.float32).reshape(-1, 3)
        tris = np.asarray(flat_t, dtype=np.uint32).reshape(-1, 3)
        rr.log(
            "world/terrain",
            rr.Mesh3D(
                vertex_positions=verts,
                triangle_indices=tris,
                vertex_colors=np.tile([90, 90, 90], (len(verts), 1)).astype(np.uint8),
            ),
            static=True,
        )
        print(f"terrain mesh: {len(verts)} verts, {len(tris)} tris, "
              f"y range [{verts[:,1].min():.3f}, {verts[:,1].max():.3f}]", flush=True)
    else:
        rr.log(
            "world/terrain",
            rr.Boxes3D(half_sizes=[(8.0, 0.005, 8.0)], colors=[(50, 50, 50)]),
            static=True,
        )
        print("terrain mesh: flat (no trimesh)", flush=True)

    policy, obs_mean, obs_std = load_policy_and_filter(CKPT)
    print(f"policy loaded (obs_dim={policy.dim})", flush=True)

    behavior_onehot = np.zeros(BEHAVIOR_ONEHOT_LEN, dtype=np.float32)
    behavior_onehot[BEHAVIOR_ID] = 1.0
    forage_pad = np.zeros(12, dtype=np.float32)

    for step in range(N_STEPS):
        rr.set_time("step", sequence=step)
        rr.set_time("time", duration=step / 50.0)

        raw = np.array(sim.get_observation(), dtype=np.float32)
        # 60-dim physics obs: body_ang_vel(3) body_lin_vel(3) gravity(3)
        # joint_pos(12) joint_vel(12) prev_action(12) command(3)
        # foot_contacts(4) obstacle_dist(8). Command lives at 45:48.
        raw[45:48] = COMMAND
        obs = np.concatenate([raw, behavior_onehot, forage_pad])
        if obs.shape[0] < policy.dim:
            obs = np.concatenate([obs, np.zeros(policy.dim - obs.shape[0], dtype=np.float32)])
        else:
            obs = obs[: policy.dim]

        # Apply MeanStdFilter (normalize using training-distribution stats)
        normed = (obs - obs_mean) / obs_std

        with torch.no_grad():
            action = policy(torch.tensor(normed).unsqueeze(0)).squeeze(0).numpy()

        action = np.clip(action, -0.25, 0.25).astype(np.float32)
        sim.step(action.tolist())

        # Authoritative per-link pose from Rapier (no Python FK, no axis-remap
        # bugs). Each link is logged at world/robot/<name> independently — the
        # parent-chain transforms are baked into the world poses already.
        for link_name, t, q in sim.get_link_world_poses():
            rr.log(
                f"world/robot/{link_name}",
                rr.Transform3D(translation=tuple(t), quaternion=tuple(q)),
            )

        bp = sim.get_base_position()
        bo = sim.get_base_orientation()
        joint_pos = sim.get_joint_positions()

        rr.log("metrics/base_height", rr.Scalars(float(bp[1])))
        rr.log("metrics/base_x", rr.Scalars(float(bp[0])))
        rr.log("metrics/base_z", rr.Scalars(float(bp[2])))
        rr.log("metrics/base_roll", rr.Scalars(float(bo[0])))
        rr.log("metrics/base_pitch", rr.Scalars(float(bo[1])))
        rr.log("metrics/base_yaw", rr.Scalars(float(bo[2])))
        vel = sim.get_base_velocity()
        rr.log("metrics/forward_velocity", rr.Scalars(float(vel[0])))
        rr.log("metrics/lateral_velocity", rr.Scalars(float(vel[2])))
        for i, jname in enumerate(JOINT_ORDER):
            rr.log(f"metrics/joints/{jname}", rr.Scalars(float(joint_pos[i])))

        # Foot contacts (4) — exposed to the policy via obs[48:52].
        contacts = sim.get_foot_contacts()
        for i, foot in enumerate(("front_left", "front_right", "back_left", "back_right")):
            rr.log(f"metrics/foot_contacts/{foot}", rr.Scalars(1.0 if contacts[i] else 0.0))

        # Forward obstacle cone — 8 ray distances per step. Logged as scalars
        # for time-series view AND as Arrows3D under base_link so the cone is
        # visible in the 3D view (color-coded by hit distance, red=close).
        ray_dists = sim.cast_obstacle_cone()
        for i, d in enumerate(ray_dists):
            rr.log(f"metrics/sensors/obstacle_ray_{i}", rr.Scalars(float(d)))

        # Build cone arrows in base_link's local frame: forward = +X, half angle
        # 60°. Attached as a child of base_link so it follows the body.
        n = len(ray_dists)
        half_angle = 1.047  # OBSTACLE_CONE_HALF_ANGLE in radians
        vectors, colors = [], []
        for i, d in enumerate(ray_dists):
            t = i / max(n - 1, 1)
            angle = -half_angle + 2.0 * half_angle * t
            # Forward in base_link local = +X; spread on local XZ plane.
            dx = math.cos(angle) * d
            dz = math.sin(angle) * d
            vectors.append((dx, 0.0, dz))
            # Color: red (close) to green (far) along the ray's hit distance.
            far_frac = min(d / 3.0, 1.0)
            colors.append(
                (int(255 * (1.0 - far_frac)), int(255 * far_frac), 0)
            )
        rr.log(
            "world/robot/base_link/sensor_cone",
            rr.Arrows3D(
                origins=[(0.0, 0.0, 0.0)] * n,
                vectors=vectors,
                colors=colors,
            ),
        )

        if sim.is_fallen():
            print(f"fell at step {step}", flush=True)
            break

    size_mb = os.path.getsize(OUT) / 1e6
    print(f"saved {OUT} ({size_mb:.1f} MB)", flush=True)


if __name__ == "__main__":
    main()

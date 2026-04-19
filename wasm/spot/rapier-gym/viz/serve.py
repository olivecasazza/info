"""Ray Serve deployment for Rerun training dashboard.

Runs as a managed service inside the Ray cluster. Starts with training,
stops when training ends. No manual process management.

Provides:
- Multi-terrain policy replay (loads latest checkpoint automatically)
- Training metrics polling from local Ray results
- Rerun gRPC + web viewer on configurable ports
- Declarative Rerun blueprint with terrain grid + metrics

Usage (standalone):
    python -m viz.serve

Integration (from train_rapier.py):
    from viz.serve import start_dashboard
    start_dashboard(web_port=9091, grpc_port=9877)

View:
    http://<host>:9091/?url=rerun%2Bhttp%3A%2F%2F<host>%3A9877%2Fproxy
"""

from __future__ import annotations

import csv
import glob
import io
import os
import pickle
import threading
import time
from pathlib import Path
from typing import Optional


# ── Constants ──────────────────────────────────────────────────────────────

TERRAINS = ["flat", "heightfield", "stairs", "platforms", "obstacles", "slopes", "mixed"]

RAY_RESULTS_PATTERN = os.path.expanduser("~/ray_results/spot_rapier_v1/PPO_*/progress.csv")

CHECKPOINT_DIR = "/tmp/spot_checkpoints"

METRICS = [
    ("env_runners/episode_reward_mean", "reward_mean"),
    ("env_runners/episode_reward_max", "reward_max"),
    ("env_runners/episode_reward_min", "reward_min"),
    ("env_runners/episode_len_mean", "episode_len"),
]

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


# ── Policy loader ──────────────────────────────────────────────────────────

def _find_latest_checkpoint(checkpoint_dir: str = CHECKPOINT_DIR) -> Optional[str]:
    """Find the most recent checkpoint directory."""
    pattern = os.path.join(checkpoint_dir, "checkpoint_*")
    candidates = glob.glob(pattern)
    if not candidates:
        return None
    return max(candidates, key=os.path.getmtime)


def _load_policy(checkpoint_path: str):
    """Load policy weights and normalization stats from a checkpoint.

    Returns (CleanPolicy, obs_mean, obs_std) or None on failure.
    """
    import numpy as np
    import torch
    import torch.nn as nn

    policy_path = os.path.join(checkpoint_path, "policies/default_policy/policy_state.pkl")
    if not os.path.exists(policy_path):
        return None

    try:
        with open(policy_path, "rb") as f:
            state = pickle.load(f)
        weights = state["weights"]
    except Exception as e:
        print(f"[dashboard] Failed to load policy state: {e}", flush=True)
        return None

    input_dim = weights["_hidden_layers.0._model.0.weight"].shape[1]

    # Build a clean inference-only network
    class CleanPolicy(nn.Module):
        def __init__(self):
            super().__init__()
            self.h0 = nn.Sequential(nn.Linear(50, 256), nn.Tanh())
            self.h1 = nn.Sequential(nn.Linear(256, 128), nn.Tanh())
            self.h2 = nn.Sequential(nn.Linear(128, 64), nn.Tanh())
            self.logits = nn.Sequential(nn.Linear(64, 12))

        def forward(self, obs):
            return self.logits(self.h2(self.h1(self.h0(obs))))

    policy = CleanPolicy()
    sd = policy.state_dict()
    sd["h0.0.weight"] = torch.tensor(weights["_hidden_layers.0._model.0.weight"])
    sd["h0.0.bias"] = torch.tensor(weights["_hidden_layers.0._model.0.bias"])
    sd["h1.0.weight"] = torch.tensor(weights["_hidden_layers.1._model.0.weight"])
    sd["h1.0.bias"] = torch.tensor(weights["_hidden_layers.1._model.0.bias"])
    sd["h2.0.weight"] = torch.tensor(weights["_hidden_layers.2._model.0.weight"])
    sd["h2.0.bias"] = torch.tensor(weights["_hidden_layers.2._model.0.bias"])
    sd["logits.0.weight"] = torch.tensor(weights["_logits._model.0.weight"])
    sd["logits.0.bias"] = torch.tensor(weights["_logits._model.0.bias"])
    policy.load_state_dict(sd)
    policy.eval()

    # Normalization stats
    mean = np.zeros(input_dim, dtype=np.float32)
    std = np.ones(input_dim, dtype=np.float32)
    try:
        algo_path = os.path.join(checkpoint_path, "algorithm_state.pkl")
        with open(algo_path, "rb") as f:
            algo_state = pickle.load(f)
        filters = algo_state.get("worker", {}).get("filters", {})
        if "default_policy" in filters:
            filt = filters["default_policy"]
            if hasattr(filt, "running_stats"):
                rs = filt.running_stats
                mean = np.array(rs.mean, dtype=np.float32)
                std = np.sqrt(np.array(rs.var, dtype=np.float32) + 1e-8)
    except Exception as e:
        print(f"[dashboard] Could not load normalization stats: {e}", flush=True)

    return policy, mean, std


# ── URDF resolution ────────────────────────────────────────────────────────

def _find_urdf() -> str:
    """Find the URDF asset, checking repo-relative path first."""
    candidates = [
        Path(__file__).parent.parent / "assets" / "spot.urdf",
        Path("/opt/spot-training-code/assets/spot.urdf"),
    ]
    urdf_env = os.environ.get("SPOT_URDF_PATH")
    if urdf_env:
        candidates.insert(0, Path(urdf_env))
    for p in candidates:
        if p.exists():
            return p.read_text()
    raise FileNotFoundError(
        f"spot.urdf not found in any of: {[str(c) for c in candidates]}"
    )


# ── Rerun logging helpers ─────────────────────────────────────────────────

def _log_robot(rr, prefix: str, sim):
    """Log robot skeleton, feet, and base to Rerun."""
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


def _log_ground(rr, prefix: str, terrain_type: str):
    """Log static terrain geometry."""
    if terrain_type == "flat":
        rr.log(f"{prefix}/ground", rr.Boxes3D(
            centers=[[0, -0.01, 0]], sizes=[[3, 0.02, 3]], colors=[[60, 120, 60, 180]],
        ), static=True)
    elif terrain_type == "stairs":
        boxes_c, boxes_s = [], []
        for i in range(8):
            h = 0.03 * (i + 1)
            boxes_c.append([1.5 + i * 0.25, h / 2, 0])
            boxes_s.append([0.25, h, 1.0])
        rr.log(f"{prefix}/ground", rr.Boxes3D(
            centers=boxes_c, sizes=boxes_s, colors=[[80, 80, 140, 200]] * len(boxes_c),
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
            x, z = random.uniform(-2, 2), random.uniform(-2, 2)
            h = random.uniform(0.03, 0.12)
            w, d = random.uniform(0.3, 0.8), random.uniform(0.3, 0.8)
            centers.append([x, h / 2, z])
            sizes.append([w, h, d])
            colors.append([100, 140, 100, 200])
        rr.log(f"{prefix}/ground", rr.Boxes3D(centers=centers, sizes=sizes, colors=colors), static=True)
    elif terrain_type == "obstacles":
        import random
        random.seed(42)
        centers, radii, colors = [], [], []
        for _ in range(15):
            x, z = random.uniform(-2, 2), random.uniform(-2, 2)
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


# ── Rerun blueprint ───────────────────────────────────────────────────────

def _build_blueprint():
    """Construct the declarative Rerun blueprint."""
    import rerun.blueprint as rrb

    terrain_views = [
        rrb.Spatial3DView(name=t.capitalize(), contents=[f"+ /{t}/**"])
        for t in TERRAINS
    ]

    return rrb.Blueprint(
        rrb.Vertical(
            rrb.Grid(*terrain_views, name="Terrain Views"),
            rrb.Horizontal(
                rrb.TimeSeriesView(
                    name="Reward",
                    contents=["+ /metrics/*/reward_mean"],
                ),
                rrb.TimeSeriesView(
                    name="Episode Length",
                    contents=["+ /metrics/*/episode_len"],
                ),
                name="Training Metrics",
            ),
            rrb.Horizontal(
                rrb.TimeSeriesView(
                    name="Survival (steps)",
                    contents=[f"+ /{t}/survival" for t in TERRAINS],
                ),
                rrb.TimeSeriesView(
                    name="Height",
                    contents=[f"+ /{t}/height" for t in TERRAINS],
                ),
                rrb.TimeSeriesView(
                    name="Throughput",
                    contents=["+ /metrics/*/throughput"],
                ),
                name="Replay Metrics",
            ),
            row_shares=[5, 2, 2],
        ),
        collapse_panels=True,
    )


# ── Ray Serve deployment ──────────────────────────────────────────────────

def _make_deployment():
    """Build the Ray Serve deployment class. Deferred to avoid top-level ray import."""
    import ray
    from ray import serve

    @serve.deployment(num_replicas=1)
    class RerunDashboard:
        def __init__(self, web_port: int = 9091, grpc_port: int = 9877, difficulty: float = 0.5):
            import rerun as rr

            self._rr = rr
            self._web_port = web_port
            self._grpc_port = grpc_port
            self._difficulty = difficulty
            self._episode_count = 0
            self._latest_reward = None
            self._checkpoint_mtime = None
            self._stop = threading.Event()

            # Initialize Rerun
            blueprint = _build_blueprint()
            rr.init("spot_training", default_blueprint=blueprint)
            rr.serve_grpc(grpc_port=grpc_port)
            rr.serve_web_viewer(web_port=web_port, open_browser=False)

            # Set up terrain roots
            for t in TERRAINS:
                rr.log(t, rr.ViewCoordinates.RIGHT_HAND_Y_UP, static=True)
                _log_ground(rr, t, t)

            print(f"[dashboard] Rerun serving on grpc={grpc_port} web={web_port}", flush=True)

            # Start background threads
            self._poll_thread = threading.Thread(target=self._poll_metrics, daemon=True)
            self._poll_thread.start()

            self._replay_thread = threading.Thread(target=self._replay_loop, daemon=True)
            self._replay_thread.start()

        def _poll_metrics(self):
            """Poll local Ray results for training progress."""
            rr = self._rr
            prev_rows: dict[str, int] = {}

            while not self._stop.is_set():
                try:
                    progress_files = glob.glob(RAY_RESULTS_PATTERN)
                    for pf in progress_files:
                        trial_name = Path(pf).parent.name  # e.g. PPO_spot_rapier_00000_...
                        # Use a short label
                        label = trial_name[:20] if len(trial_name) > 20 else trial_name

                        try:
                            with open(pf, "r") as f:
                                rows = list(csv.DictReader(f))
                        except Exception:
                            continue

                        start = prev_rows.get(pf, 0)
                        if len(rows) <= start:
                            continue
                        new_rows = rows[start:]
                        prev_rows[pf] = len(rows)

                        for row in new_rows:
                            ts = int(row.get("timesteps_total", 0) or 0)
                            rr.set_time("steps", sequence=ts)

                            for csv_key, log_name in METRICS:
                                val = row.get(csv_key, "")
                                if val:
                                    try:
                                        rr.log(f"metrics/{label}/{log_name}", rr.Scalars(float(val)))
                                    except (ValueError, TypeError):
                                        pass

                            # Throughput
                            elapsed = float(row.get("time_total_s", 1) or 1)
                            if elapsed > 0 and ts > 0:
                                rr.log(f"metrics/{label}/throughput", rr.Scalars(ts / elapsed))

                            # Track latest reward
                            reward_str = row.get("env_runners/episode_reward_mean", "")
                            if reward_str:
                                try:
                                    self._latest_reward = float(reward_str)
                                except (ValueError, TypeError):
                                    pass

                except Exception as e:
                    print(f"[dashboard] Metrics poll error: {e}", flush=True)

                self._stop.wait(5.0)

        def _replay_loop(self):
            """Run policy replay episodes on all terrains, reloading checkpoints."""
            rr = self._rr
            import numpy as np
            import torch

            # Wait for first checkpoint
            print("[dashboard] Waiting for checkpoint...", flush=True)
            while not self._stop.is_set():
                ckpt = _find_latest_checkpoint()
                if ckpt:
                    break
                self._stop.wait(10.0)

            if self._stop.is_set():
                return

            # Resolve URDF
            try:
                urdf_content = _find_urdf()
            except FileNotFoundError as e:
                print(f"[dashboard] {e} -- replay disabled", flush=True)
                return

            from spot_rapier.spot_rapier import SpotSim

            policy_data = None
            reload_every = 3  # episodes between checkpoint reloads
            fps = 15
            dt = 1.0 / fps
            behavior_onehot = np.array([1, 0, 0, 0, 0], dtype=np.float32)

            while not self._stop.is_set():
                # Load or reload policy
                if policy_data is None or self._episode_count % reload_every == 0:
                    ckpt = _find_latest_checkpoint()
                    if ckpt:
                        new_mtime = os.path.getmtime(ckpt)
                        if policy_data is None or new_mtime != self._checkpoint_mtime:
                            loaded = _load_policy(ckpt)
                            if loaded is not None:
                                policy_data = loaded
                                self._checkpoint_mtime = new_mtime
                                print(f"[dashboard] Loaded checkpoint: {Path(ckpt).name}", flush=True)

                if policy_data is None:
                    self._stop.wait(5.0)
                    continue

                policy, obs_mean, obs_std = policy_data

                # Create one sim per terrain
                sims = {}
                alive = {}
                step_counts = {}
                for t in TERRAINS:
                    seed = 42 + self._episode_count
                    try:
                        sims[t] = SpotSim(urdf_content, t, seed, self._difficulty)
                    except Exception as e:
                        print(f"[dashboard] SpotSim({t}) failed: {e}", flush=True)
                        continue
                    alive[t] = True
                    step_counts[t] = 0

                if not sims:
                    self._stop.wait(5.0)
                    continue

                for step in range(2000):
                    if self._stop.is_set():
                        return

                    rr.set_time("step", sequence=self._episode_count * 2000 + step)
                    any_alive = False

                    for t in list(sims.keys()):
                        if not alive.get(t, False):
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
                            _log_robot(rr, t, sim)
                            rr.log(f"{t}/height", rr.Scalars(sim.get_base_height()))

                        if sim.is_fallen():
                            alive[t] = False
                            rr.log(f"{t}/survival", rr.Scalars(float(step)))

                    if not any_alive:
                        break
                    time.sleep(dt)

                # Log survival for terrains that never fell
                for t in sims:
                    if alive.get(t, False):
                        rr.log(f"{t}/survival", rr.Scalars(2000.0))

                survived = sum(1 for t in sims if alive.get(t, False))
                print(
                    f"[dashboard] Episode {self._episode_count}: "
                    f"{survived}/{len(sims)} survived",
                    flush=True,
                )
                self._episode_count += 1

        async def __call__(self, request):
            """Health check endpoint."""
            return {
                "status": "ok",
                "episodes": self._episode_count,
                "latest_reward": self._latest_reward,
                "checkpoint_mtime": self._checkpoint_mtime,
                "web_port": self._web_port,
                "grpc_port": self._grpc_port,
            }

        def __del__(self):
            self._stop.set()

    return RerunDashboard


# ── Public API ─────────────────────────────────────────────────────────────

def start_dashboard(
    web_port: int = 9091,
    grpc_port: int = 9877,
    difficulty: float = 0.5,
) -> str:
    """Start the Rerun dashboard as a Ray Serve deployment.

    Call from the training driver (after ray.init()) to launch the dashboard
    on the head node. Returns the Serve URL for the health endpoint.

    The deployment is non-detached: it stops when the driver process exits,
    matching the "stops with training" requirement.
    """
    import ray
    from ray import serve
    from ray.util.scheduling_strategies import NodeAffinitySchedulingStrategy

    head_node_id = ray.get_runtime_context().get_node_id()

    RerunDashboard = _make_deployment()

    app = RerunDashboard.options(
        ray_actor_options={
            "num_cpus": 1,
            "num_gpus": 0,
        },
    ).bind(web_port=web_port, grpc_port=grpc_port, difficulty=difficulty)

    serve.run(app, name="rerun-dashboard", route_prefix="/dashboard")

    import socket
    hostname = socket.gethostname()
    url = f"http://{hostname}:{web_port}/?url=rerun%2Bhttp%3A%2F%2F{hostname}%3A{grpc_port}%2Fproxy"
    print(f"[dashboard] View: {url}", flush=True)
    print(f"[dashboard] Health: http://{hostname}:8000/dashboard", flush=True)

    return url


def stop_dashboard():
    """Explicitly stop the dashboard deployment."""
    from ray import serve
    try:
        serve.delete("rerun-dashboard")
    except Exception:
        pass


# ── Standalone entry point ─────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Rerun training dashboard (Ray Serve)")
    parser.add_argument("--web-port", type=int, default=9091)
    parser.add_argument("--grpc-port", type=int, default=9877)
    parser.add_argument("--difficulty", type=float, default=0.5)
    args = parser.parse_args()

    import ray
    ray.init(address="auto" if os.environ.get("RAY_ADDRESS") else None)

    url = start_dashboard(
        web_port=args.web_port,
        grpc_port=args.grpc_port,
        difficulty=args.difficulty,
    )

    print(f"[dashboard] Running. Ctrl+C to stop.", flush=True)
    try:
        while True:
            time.sleep(60)
    except KeyboardInterrupt:
        stop_dashboard()
        print("[dashboard] Stopped.", flush=True)

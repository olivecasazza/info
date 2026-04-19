"""Spot training dashboard with 3D robot view + metrics.

Run: LD_LIBRARY_PATH="..." python -u viz/live_dashboard.py
View: http://192.168.1.35:9091/?url=rerun%2Bhttp%3A%2F%2F192.168.1.35%3A9877%2Fproxy
"""
import rerun as rr
import rerun.blueprint as rrb
import subprocess
import csv
import io
import json
import math
import time
import signal
import sys

signal.signal(signal.SIGTERM, lambda *_: sys.exit(0))

NODES = {
    "hp01": "192.168.1.121",
    "hp02": "192.168.1.122",
    "hp03": "192.168.1.123",
}

METRICS = [
    ("env_runners/episode_reward_mean", "reward_mean"),
    ("env_runners/episode_reward_max", "reward_max"),
    ("env_runners/episode_reward_min", "reward_min"),
    ("env_runners/episode_len_mean", "episode_len"),
]

# Spot skeleton: simplified link positions relative to base
# (in standing pose, Y-up Rapier frame)
SKELETON_LINKS = {
    "body": ([0, 0, 0], [0.3, 0, 0]),        # body centerline
    "fl_hip": ([0.15, 0, 0.1], [0.15, -0.1, 0.15]),
    "fl_upper": ([0.15, -0.1, 0.15], [0.15, -0.25, 0.1]),
    "fl_lower": ([0.15, -0.25, 0.1], [0.15, -0.35, 0.05]),
    "fr_hip": ([0.15, 0, -0.1], [0.15, -0.1, -0.15]),
    "fr_upper": ([0.15, -0.1, -0.15], [0.15, -0.25, -0.1]),
    "fr_lower": ([0.15, -0.25, -0.1], [0.15, -0.35, -0.05]),
    "bl_hip": ([-0.15, 0, 0.1], [-0.15, -0.1, 0.15]),
    "bl_upper": ([-0.15, -0.1, 0.15], [-0.15, -0.25, 0.1]),
    "bl_lower": ([-0.15, -0.25, 0.1], [-0.15, -0.35, 0.05]),
    "br_hip": ([-0.15, 0, -0.1], [-0.15, -0.1, -0.15]),
    "br_upper": ([-0.15, -0.1, -0.15], [-0.15, -0.25, -0.1]),
    "br_lower": ([-0.15, -0.25, -0.1], [-0.15, -0.35, -0.05]),
}

blueprint = rrb.Blueprint(
    rrb.Horizontal(
        rrb.Spatial3DView(
            name="Robot (best node)",
            contents=["+ /robot/**"],
        ),
        rrb.Vertical(
            rrb.TimeSeriesView(
                name="Reward (all nodes)",
                contents=[
                    "+ /hp01/reward_mean",
                    "+ /hp02/reward_mean",
                    "+ /hp03/reward_mean",
                ],
            ),
            rrb.TimeSeriesView(
                name="Reward Range",
                contents=[
                    "+ /hp03/reward_mean",
                    "+ /hp03/reward_max",
                    "+ /hp03/reward_min",
                ],
            ),
            rrb.Horizontal(
                rrb.TimeSeriesView(
                    name="Episode Length",
                    contents=[
                        "+ /hp01/episode_len",
                        "+ /hp02/episode_len",
                        "+ /hp03/episode_len",
                    ],
                ),
                rrb.TimeSeriesView(
                    name="Throughput",
                    contents=[
                        "+ /hp01/throughput",
                        "+ /hp02/throughput",
                        "+ /hp03/throughput",
                    ],
                ),
            ),
        ),
        column_shares=[1, 2],
    ),
    collapse_panels=True,
)

rr.init('spot_training', default_blueprint=blueprint)
uri = rr.serve_grpc(grpc_port=9877)
rr.serve_web_viewer(web_port=9091, open_browser=False)
print(f"Dashboard: http://192.168.1.35:9091/?url=rerun%2Bhttp%3A%2F%2F192.168.1.35%3A9877%2Fproxy", flush=True)

# Set Y-up coordinate system (matching Rapier)
rr.log("robot", rr.ViewCoordinates.RIGHT_HAND_Y_UP, static=True)

# Log static ground plane
rr.log("robot/ground", rr.Boxes3D(
    centers=[[0, -0.01, 0]],
    sizes=[[2.0, 0.02, 2.0]],
    colors=[[80, 80, 80, 128]],
), static=True)


def read_progress(ip):
    try:
        cmd = ["ssh", "-o", "ConnectTimeout=3", f"root@{ip}",
               "find /tmp/ray -name progress.csv 2>/dev/null | head -1 | xargs cat 2>/dev/null"]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        if result.returncode != 0 or not result.stdout.strip():
            return []
        reader = csv.DictReader(io.StringIO(result.stdout))
        return list(reader)
    except Exception:
        return []


def read_latest_state(ip):
    """Read the latest robot state from the training env for 3D viz."""
    try:
        # Run a quick Python snippet on the training node to get current robot state
        py_cmd = (
            "import pickle, json; "
            "s = pickle.load(open('/tmp/spot_checkpoints/algorithm_state.pkl', 'rb')); "
            "print('ok')"
        )
        cmd = ["ssh", "-o", "ConnectTimeout=3", f"root@{ip}",
               f"cd /opt/spot-training-code && /opt/spot-training/bin/python -c \"{py_cmd}\" 2>/dev/null"]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
        return result.returncode == 0
    except Exception:
        return False


def log_robot_skeleton(height, joint_angles=None):
    """Log a simple robot skeleton to the 3D view."""
    # Base position (just use height, center at origin)
    base_y = max(height, 0.05)

    # Draw body as lines
    segments = []
    colors = []
    for name, (start, end) in SKELETON_LINKS.items():
        s = [start[0], start[1] + base_y, start[2]]
        e = [end[0], end[1] + base_y, end[2]]
        segments.append([s, e])
        if "lower" in name:
            colors.append([255, 100, 50, 255])  # orange for feet
        elif "upper" in name:
            colors.append([100, 200, 255, 255])  # blue for upper legs
        else:
            colors.append([200, 200, 200, 255])  # gray for body/hips

    rr.log("robot/skeleton", rr.LineStrips3D(segments, colors=colors, radii=0.008))

    # Draw joint positions as spheres
    joint_points = []
    for name, (start, end) in SKELETON_LINKS.items():
        joint_points.append([end[0], end[1] + base_y, end[2]])

    rr.log("robot/joints", rr.Points3D(joint_points, radii=0.015, colors=[255, 255, 0, 255]))

    # Draw base center
    rr.log("robot/base", rr.Points3D([[0, base_y, 0]], radii=0.03, colors=[0, 255, 0, 255]))


prev_rows = {name: 0 for name in NODES}
best_node = "hp03"
skeleton_counter = 0

# Log initial standing skeleton
log_robot_skeleton(0.35)

print("Polling training nodes...", flush=True)
while True:
    best_reward = float("-inf")

    for name, ip in NODES.items():
        rows = read_progress(ip)
        if not rows or len(rows) <= prev_rows[name]:
            continue

        new_rows = rows[prev_rows[name]:]
        prev_rows[name] = len(rows)

        for row in new_rows:
            ts = int(row.get("timesteps_total", 0))
            rr.set_time("steps", sequence=ts)

            for csv_key, log_name in METRICS:
                val = row.get(csv_key, "")
                if val:
                    try:
                        rr.log(f"{name}/{log_name}", rr.Scalars(float(val)))
                    except (ValueError, TypeError):
                        pass

            elapsed = float(row.get("time_total_s", 1) or 1)
            if elapsed > 0 and ts > 0:
                rr.log(f"{name}/throughput", rr.Scalars(ts / elapsed))

        latest = rows[-1]
        reward_str = latest.get("env_runners/episode_reward_mean", "")
        try:
            reward = float(reward_str)
            if reward > best_reward:
                best_reward = reward
                best_node = name
        except (ValueError, TypeError):
            pass

        print(f"  {name}: {len(rows)} rows, steps={latest.get('timesteps_total', '?')}, reward={reward_str}", flush=True)

    # Update 3D skeleton based on reward progress (higher reward = taller stance)
    skeleton_counter += 1
    if skeleton_counter % 2 == 0:
        # Approximate height from reward: -10000 = collapsed (0.1), 0+ = standing (0.35)
        approx_height = max(0.1, min(0.4, 0.1 + (best_reward + 10000) / 30000 * 0.3))
        log_robot_skeleton(approx_height)

    time.sleep(5)

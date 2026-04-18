"""RLlib callback that streams Spot training data to Rerun.

Uses rr.serve_grpc() + rr.serve_web_viewer() so the Rerun viewer is
accessible from any machine on the network (not just localhost).

Usage in train_rapier.py:
    from viz.rerun_logger import RerunLoggerCallback, start_rerun_server

    # Start server once (before training)
    start_rerun_server(grpc_port=9876, web_port=9090)

    # Add callback to PPO config
    config.callbacks(RerunLoggerCallback)

The web viewer will be at http://seir:9090 (or whatever host runs training).
"""

from __future__ import annotations

import math
import time
from typing import Any, Optional

import numpy as np

try:
    import rerun as rr
except ImportError:
    rr = None

from ray.rllib.algorithms.callbacks import DefaultCallbacks

# Joint names matching the Rust JOINT_NAMES order
JOINT_NAMES = [
    "fl_hx",
    "fl_hy",
    "fl_kn",
    "fr_hx",
    "fr_hy",
    "fr_kn",
    "hl_hx",
    "hl_hy",
    "hl_kn",
    "hr_hx",
    "hr_hy",
    "hr_kn",
]

LEG_NAMES = ["front_left", "front_right", "hind_left", "hind_right"]

REWARD_COMPONENTS = [
    "r_velocity",
    "r_action_rate",
    "r_orientation",
    "r_foot_air",
    "r_height",
    "r_alive",
    "r_lin_vel_z",
    "r_ang_vel_xy",
    "r_body_collision",
    "r_torque",
    "r_joint_accel",
]

BEHAVIORS = {0: "walk", 1: "terrain", 2: "climb", 3: "balance", 4: "sprint"}


def start_rerun_server(
    grpc_port: int = 9876,
    web_port: int = 9090,
    recording_id: str = "spot_training",
) -> None:
    """Initialize Rerun and start gRPC + web viewer servers.

    Call this once before training starts. The web viewer will be
    accessible at http://<host>:<web_port>.

    Args:
        grpc_port: Port for the gRPC data server.
        web_port: Port for the web viewer HTTP server.
        recording_id: Name for this recording session.
    """
    if rr is None:
        raise ImportError("rerun-sdk is required: pip install rerun-sdk")

    rr.init(recording_id)
    server_uri = rr.serve_grpc(grpc_port=grpc_port)
    rr.serve_web_viewer(
        web_port=web_port,
        open_browser=False,
        connect_to=server_uri,
    )
    print(f"Rerun web viewer: http://0.0.0.0:{web_port}")
    print(f"Rerun gRPC server: {server_uri}")


class RerunLoggerCallback(DefaultCallbacks):
    """RLlib DefaultCallbacks that streams per-step data to Rerun.

    Only worker_index==0 streams detailed per-step data (pose, joints,
    contacts) to avoid interleaved garbage from multiple workers.
    All workers contribute aggregate metrics on episode end.

    Compatible with the old RLlib API stack (enable_rl_module_and_learner=False).
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._step_counter = 0
        self._episode_counter = 0

    def on_episode_start(
        self,
        *,
        worker: Any,
        base_env: Any,
        policies: Any,
        episode: Any,
        env_index: Optional[int] = None,
        **kwargs,
    ) -> None:
        """Initialize episode-level tracking."""
        if rr is None:
            return

        episode.user_data["reward_components"] = {k: [] for k in REWARD_COMPONENTS}
        episode.user_data["step_count"] = 0

    def on_episode_step(
        self,
        *,
        worker: Any,
        base_env: Any,
        policies: Any,
        episode: Any,
        env_index: Optional[int] = None,
        **kwargs,
    ) -> None:
        """Log per-step env state to Rerun (worker 0 only for detailed data)."""
        if rr is None:
            return

        info = episode.last_info_for() or {}
        self._step_counter += 1

        # Accumulate reward components for episode summary
        for key in REWARD_COMPONENTS:
            if key in info:
                episode.user_data["reward_components"][key].append(info[key])

        episode.user_data["step_count"] = episode.user_data.get("step_count", 0) + 1

        # Detailed per-step logging only from worker 0, every 10 steps
        # to avoid overwhelming the viewer
        if getattr(worker, "worker_index", 1) != 0:
            return
        if self._step_counter % 10 != 0:
            return

        rr.set_time("step", sequence=self._step_counter)
        rr.set_time("wall_clock", seconds=time.time())

        # Try to get env reference for detailed state
        try:
            env = base_env.get_sub_environments()[env_index or 0]
            self._log_env_state(env)
        except Exception:
            pass

        # Log per-step reward components from info dict
        for key in REWARD_COMPONENTS:
            if key in info:
                rr.log(f"rewards/step/{key}", rr.Scalars(info[key]))

        if "reward_total" in info:
            rr.log("rewards/step/total", rr.Scalars(info["reward_total"]))

    def _log_env_state(self, env: Any) -> None:
        """Log detailed environment state: pose, joints, contacts."""
        sim = getattr(env, "sim", None)
        if sim is None:
            return

        # Base pose: height + orientation (RPY)
        try:
            height = sim.get_base_height()
            rr.log("robot/base/height", rr.Scalars(height))

            rpy = sim.get_base_orientation()
            if len(rpy) == 3:
                rr.log("robot/base/roll", rr.Scalars(math.degrees(rpy[0])))
                rr.log("robot/base/pitch", rr.Scalars(math.degrees(rpy[1])))
                rr.log("robot/base/yaw", rr.Scalars(math.degrees(rpy[2])))

                # Log as 3D transform (position approximated, orientation from RPY)
                rr.log(
                    "robot/base/transform",
                    rr.Transform3D(
                        translation=[0.0, height, 0.0],
                        rotation=rr.RotationAxisAngle(
                            axis=[0, 1, 0],
                            radians=rpy[2],
                        ),
                    ),
                )
        except Exception:
            pass

        # Base velocity
        try:
            vel = sim.get_base_velocity()
            if len(vel) == 3:
                speed = math.sqrt(vel[0] ** 2 + vel[2] ** 2)
                rr.log("robot/base/speed", rr.Scalars(speed))
                rr.log("robot/base/vel_x", rr.Scalars(vel[0]))
                rr.log("robot/base/vel_z", rr.Scalars(vel[2]))
                rr.log("robot/base/vel_y", rr.Scalars(vel[1]))  # vertical
        except Exception:
            pass

        # Joint positions
        try:
            joint_pos = sim.get_joint_positions()
            for i, name in enumerate(JOINT_NAMES):
                if i < len(joint_pos):
                    rr.log(
                        f"robot/joints/{name}/position",
                        rr.Scalars(math.degrees(joint_pos[i])),
                    )
        except Exception:
            pass

        # Joint torques
        try:
            torques = sim.get_joint_torques()
            for i, name in enumerate(JOINT_NAMES):
                if i < len(torques):
                    rr.log(f"robot/joints/{name}/torque", rr.Scalars(torques[i]))
        except Exception:
            pass

        # Foot contacts
        try:
            contacts = sim.get_foot_contacts()
            for i, leg in enumerate(LEG_NAMES):
                if i < len(contacts):
                    rr.log(
                        f"robot/feet/{leg}/contact",
                        rr.Scalars(1.0 if contacts[i] else 0.0),
                    )
        except Exception:
            pass

        # Behavior mode
        try:
            behavior = getattr(env, "behavior", "unknown")
            rr.log("training/behavior", rr.TextLog(behavior))
        except Exception:
            pass

        # Command velocity
        try:
            cmd = getattr(env, "command", None)
            if cmd is not None and len(cmd) == 3:
                rr.log("robot/command/vx", rr.Scalars(float(cmd[0])))
                rr.log("robot/command/vy", rr.Scalars(float(cmd[1])))
                rr.log("robot/command/yaw_rate", rr.Scalars(float(cmd[2])))
        except Exception:
            pass

    def on_episode_end(
        self,
        *,
        worker: Any,
        base_env: Any,
        policies: Any,
        episode: Any,
        env_index: Optional[int] = None,
        **kwargs,
    ) -> None:
        """Log episode-level aggregate metrics."""
        if rr is None:
            return

        self._episode_counter += 1
        rr.set_time("episode", sequence=self._episode_counter)
        rr.set_time("wall_clock", seconds=time.time())

        # Episode reward and length
        total_reward = episode.total_reward
        length = episode.length

        rr.log("training/episode_reward", rr.Scalars(total_reward))
        rr.log("training/episode_length", rr.Scalars(float(length)))

        # Mean reward components over the episode
        components = episode.user_data.get("reward_components", {})
        for key, values in components.items():
            if values:
                mean_val = float(np.mean(values))
                rr.log(f"rewards/episode/{key}", rr.Scalars(mean_val))

        # Behavior
        try:
            env = base_env.get_sub_environments()[env_index or 0]
            behavior = getattr(env, "behavior", "unknown")
            rr.log("training/behavior", rr.TextLog(f"episode {self._episode_counter}: {behavior}"))
        except Exception:
            pass

    def on_train_result(
        self,
        *,
        algorithm: Any,
        result: dict,
        **kwargs,
    ) -> None:
        """Log iteration-level metrics from the training result dict."""
        if rr is None:
            return

        iteration = result.get("training_iteration", 0)
        rr.set_time("iteration", sequence=iteration)
        rr.set_time("wall_clock", seconds=time.time())

        # Standard RLlib metrics
        metric_paths = {
            "training/reward_mean": [
                "env_runners/episode_reward_mean",
                "episode_reward_mean",
            ],
            "training/reward_min": [
                "env_runners/episode_reward_min",
                "episode_reward_min",
            ],
            "training/reward_max": [
                "env_runners/episode_reward_max",
                "episode_reward_max",
            ],
            "training/episode_len_mean": [
                "env_runners/episode_len_mean",
                "episode_len_mean",
            ],
            "training/timesteps_total": ["timesteps_total"],
            "training/time_total_s": ["time_total_s"],
        }

        for log_path, keys in metric_paths.items():
            for key in keys:
                val = _nested_get(result, key)
                if val is not None:
                    rr.log(log_path, rr.Scalars(float(val)))
                    break

        # Learner stats
        learner = _nested_get(result, "info/learner/default_policy/learner_stats")
        if isinstance(learner, dict):
            for stat_name in ["entropy", "kl", "vf_loss", "policy_loss", "total_loss"]:
                if stat_name in learner:
                    rr.log(
                        f"training/learner/{stat_name}",
                        rr.Scalars(float(learner[stat_name])),
                    )

        # Learning rate
        lr = _nested_get(result, "info/learner/default_policy/cur_lr")
        if lr is not None:
            rr.log("training/learning_rate", rr.Scalars(float(lr)))

        # Throughput
        ts = result.get("timesteps_total", 0)
        elapsed = result.get("time_total_s", 1)
        if elapsed > 0:
            rr.log("training/throughput_sps", rr.Scalars(float(ts / elapsed)))


def _nested_get(d: dict, path: str) -> Any:
    """Get a value from a nested dict using slash-separated path."""
    keys = path.split("/")
    current = d
    for k in keys:
        if isinstance(current, dict) and k in current:
            current = current[k]
        else:
            return None
    return current

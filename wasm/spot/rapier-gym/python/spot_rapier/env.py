"""Spot quadruped gymnasium environment using Rapier3D physics.

Eliminates sim-to-sim transfer gap: training and WASM deployment use
the same Rapier physics engine with identical parameters.

Supports multi-behavior training via behavior conditioning:
    - "walk": flat ground locomotion
    - "terrain": rough terrain traversal
    - "climb": stair climbing
    - "balance": two-leg balancing
    - "sprint": high-speed locomotion
"""

import gymnasium as gym
import numpy as np
from pathlib import Path
from typing import Optional
from spot_rapier.spot_rapier import SpotSim

BEHAVIORS = {
    "walk":    0,
    "terrain": 1,
    "climb":   2,
    "balance": 3,
    "sprint":  4,
}
NUM_BEHAVIORS = len(BEHAVIORS)

# Reward weights per behavior
REWARD_PRESETS = {
    "walk": {
        "velocity": 1.0, "action_rate": 0.01, "orientation": 1.0,
        "foot_air": 1.0, "height": 2.0, "alive": 1.0,
        "lin_vel_z": 2.0, "ang_vel_xy": 0.05, "body_collision": 1.0,
        "torque": 0.0001, "joint_accel": 2.5e-7,
    },
    "terrain": {
        "velocity": 0.8, "action_rate": 0.01, "orientation": 0.5,
        "foot_air": 1.5, "height": 1.0, "alive": 1.0,
        "lin_vel_z": 1.0, "ang_vel_xy": 0.05, "body_collision": 0.5,
        "torque": 0.0001, "joint_accel": 2.5e-7,
    },
    "sprint": {
        "velocity": 2.0, "action_rate": 0.005, "orientation": 0.5,
        "foot_air": 0.5, "height": 1.0, "alive": 0.5,
        "lin_vel_z": 1.0, "ang_vel_xy": 0.02, "body_collision": 1.0,
        "torque": 0.00005, "joint_accel": 1e-7,
    },
    "climb": {
        "velocity": 0.5, "action_rate": 0.02, "orientation": 2.0,
        "foot_air": 0.5, "height": 3.0, "alive": 1.5,
        "lin_vel_z": 0.5, "ang_vel_xy": 0.1, "body_collision": 0.3,
        "torque": 0.0001, "joint_accel": 2.5e-7,
    },
    "balance": {
        "velocity": 0.0, "action_rate": 0.02, "orientation": 3.0,
        "foot_air": 0.0, "height": 3.0, "alive": 2.0,
        "lin_vel_z": 3.0, "ang_vel_xy": 0.1, "body_collision": 2.0,
        "torque": 0.001, "joint_accel": 5e-7,
    },
}

DEFAULT_JOINT_ANGLES = np.array([
    0.0, 0.6, -1.2, 0.0, 0.6, -1.2,
    0.0, 0.6, -1.2, 0.0, 0.6, -1.2,
], dtype=np.float32)


class SpotEnvRapier(gym.Env):
    """Spot robot env with Rapier3D physics and multi-behavior support.

    Observation (45 + NUM_BEHAVIORS = 50):
        [3]  body angular velocity (body frame)
        [3]  projected gravity (body frame)
        [12] joint position offsets from default
        [12] joint velocities
        [12] previous action
        [3]  velocity command (vx, vy, yaw_rate)
        [5]  behavior one-hot encoding

    Action (12): joint angle offsets from default pose, clipped to [-0.25, 0.25]
    """

    metadata = {"render_modes": []}

    def __init__(self, config: Optional[dict] = None):
        super().__init__()
        config = config or {}

        self.behavior = config.get("behavior", "walk")
        self.terrain_difficulty = config.get("terrain_difficulty", 0.0)
        self.terrain_type = config.get("terrain_type", None)  # auto-select if None
        self.cmd_vel_scale = config.get("cmd_vel_scale", 1.0)
        self.max_episode_steps = config.get("max_episode_steps", 2000)

        # Multi-behavior: observation includes behavior one-hot
        obs_dim = 45 + NUM_BEHAVIORS
        self.observation_space = gym.spaces.Box(
            low=-100.0, high=100.0, shape=(obs_dim,), dtype=np.float32,
        )
        self.action_space = gym.spaces.Box(
            low=-0.25, high=0.25, shape=(12,), dtype=np.float32,
        )

        # Load URDF — check config path, then common locations
        urdf_path = config.get("urdf_path", None)
        if urdf_path:
            urdf_path = Path(urdf_path)
        else:
            candidates = [
                Path(__file__).parent.parent.parent / "assets" / "spot.urdf",
                Path(__file__).parent.parent.parent.parent / "assets" / "spot.urdf",
                Path("/opt/spot-training-code/assets/spot.urdf"),
                Path("assets/spot.urdf"),
            ]
            urdf_path = next((p for p in candidates if p.exists()), None)
            if urdf_path is None:
                raise FileNotFoundError(f"spot.urdf not found in {[str(p) for p in candidates]}")
        self.urdf_content = urdf_path.read_text()

        self.reward_weights = REWARD_PRESETS.get(self.behavior, REWARD_PRESETS["walk"])
        self.sim: Optional[SpotSim] = None
        self.current_step = 0
        self.command = np.zeros(3, dtype=np.float32)
        self.foot_air_time = np.zeros(4, dtype=np.float32)
        self.prev_joint_vel = np.zeros(12, dtype=np.float32)
        self._episode_seed = 0

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self._episode_seed = self.np_random.integers(0, 2**31)

        terrain_type = self._resolve_terrain_type()
        self.sim = SpotSim(
            self.urdf_content,
            terrain_type,
            self._episode_seed,
            self.terrain_difficulty,
        )

        self.current_step = 0
        self.foot_air_time = np.zeros(4, dtype=np.float32)
        self.prev_joint_vel = np.zeros(12, dtype=np.float32)

        # Random command
        self._sample_command()

        obs = self._get_observation()
        return obs, {}

    def step(self, action):
        action = np.clip(action, -0.25, 0.25).astype(np.float32)

        self.sim.step(action.tolist())
        self.current_step += 1

        obs = self._get_observation()
        reward, reward_info = self._compute_reward(action)

        terminated = self.sim.is_fallen()
        truncated = self.current_step >= self.max_episode_steps

        # Update foot air time
        self._update_foot_contacts()

        # Update previous joint velocities for acceleration
        self.prev_joint_vel = np.array(self.sim.get_joint_velocities(), dtype=np.float32)

        # Resample command occasionally
        if self.current_step % 500 == 0:
            self._sample_command()

        info = {**reward_info, "episode_length": self.current_step}
        return obs, reward, terminated, truncated, info

    def _get_observation(self):
        raw_obs = np.array(self.sim.get_observation(), dtype=np.float32)
        # Replace command placeholder (last 3 elements) with actual command
        raw_obs[42:45] = self.command * self.cmd_vel_scale

        # Append behavior one-hot
        behavior_id = BEHAVIORS.get(self.behavior, 0)
        behavior_onehot = np.zeros(NUM_BEHAVIORS, dtype=np.float32)
        behavior_onehot[behavior_id] = 1.0

        return np.concatenate([raw_obs, behavior_onehot])

    # Valid terrain type strings accepted by the Rust backend
    TERRAIN_TYPES = [
        "flat", "heightfield", "stairs", "platforms",
        "obstacles", "dynamic_obstacles", "slopes", "mixed",
    ]

    def _resolve_terrain_type(self) -> str:
        """Pick terrain type for this episode.

        If terrain_type was explicitly set in config, use it.
        Otherwise auto-select based on behavior and difficulty.
        """
        if self.terrain_type is not None:
            return self.terrain_type
        if self.terrain_difficulty <= 0:
            return "flat"
        # Sensible defaults per behavior
        defaults = {
            "walk": "heightfield",
            "terrain": "mixed",
            "climb": "stairs",
            "balance": "dynamic_obstacles",
            "sprint": "obstacles",
        }
        return defaults.get(self.behavior, "heightfield")

    def _sample_command(self):
        if self.behavior == "balance":
            self.command = np.zeros(3, dtype=np.float32)
        elif self.behavior == "sprint":
            self.command = np.array([
                self.np_random.uniform(0.8, 1.0),
                self.np_random.uniform(-0.2, 0.2),
                self.np_random.uniform(-0.3, 0.3),
            ], dtype=np.float32)
        else:
            self.command = np.array([
                self.np_random.uniform(-1.0, 1.0),
                self.np_random.uniform(-0.5, 0.5),
                self.np_random.uniform(-1.0, 1.0),
            ], dtype=np.float32)

    def _update_foot_contacts(self):
        contacts = self.sim.get_foot_contacts()
        dt = 4 * (1.0 / 200.0)  # decimation * physics_dt
        for i in range(4):
            if contacts[i]:
                self.foot_air_time[i] = 0.0
            else:
                self.foot_air_time[i] += dt

    def _compute_reward(self, action):
        w = self.reward_weights
        info = {}

        # Velocity tracking
        vel = np.array(self.sim.get_base_velocity(), dtype=np.float32)
        cmd = self.command * self.cmd_vel_scale
        vel_error_x = (vel[0] - cmd[0]) ** 2  # X is forward in Rapier Y-up
        vel_error_y = (vel[2] - cmd[1]) ** 2  # Z is lateral in Rapier
        r_vel = np.exp(-4.0 * (vel_error_x + vel_error_y))
        info["r_velocity"] = r_vel

        # Action rate
        prev_action = np.array(self.sim.get_previous_action(), dtype=np.float32)
        # On first step, prev is zeros which is fine
        r_action_rate = -np.sum((action - prev_action) ** 2)
        info["r_action_rate"] = r_action_rate

        # Orientation
        rpy = np.array(self.sim.get_base_orientation(), dtype=np.float32)
        r_orientation = -(rpy[0] ** 2 + rpy[2] ** 2)  # roll + yaw penalty (pitch=rpy[1])
        info["r_orientation"] = r_orientation

        # Foot air time
        r_foot = 0.0
        contacts = self.sim.get_foot_contacts()
        for i in range(4):
            if contacts[i] and self.foot_air_time[i] > 0.0:
                air = self.foot_air_time[i]
                if 0.2 < air < 0.5:
                    r_foot += 1.0
        info["r_foot_air"] = r_foot

        # Height
        height = self.sim.get_base_height()
        nominal_height = 0.35
        r_height = -((height - nominal_height) ** 2)
        info["r_height"] = r_height

        # Alive
        r_alive = 0.5
        info["r_alive"] = r_alive

        # Linear velocity Z (anti-bounce)
        r_lin_vel_z = -(vel[1] ** 2)  # Y is up in Rapier
        info["r_lin_vel_z"] = r_lin_vel_z

        # Angular velocity XY (anti-flip)
        angvel = np.array(self.sim.get_base_angular_velocity(), dtype=np.float32)
        r_ang_vel_xy = -(angvel[0] ** 2 + angvel[2] ** 2)
        info["r_ang_vel_xy"] = r_ang_vel_xy

        # Body collision
        body_contacts = self.sim.get_body_contacts()
        r_body_collision = -float(body_contacts)
        info["r_body_collision"] = r_body_collision

        # Torque
        torques = np.array(self.sim.get_joint_torques(), dtype=np.float32)
        r_torque = -np.sum(torques ** 2)
        info["r_torque"] = r_torque

        # Joint acceleration
        joint_vel = np.array(self.sim.get_joint_velocities(), dtype=np.float32)
        dt = 4 * (1.0 / 200.0)
        joint_accel = (joint_vel - self.prev_joint_vel) / max(dt, 1e-6)
        r_joint_accel = -np.sum(joint_accel ** 2)
        info["r_joint_accel"] = r_joint_accel

        total = (
            w["velocity"] * r_vel
            + w["action_rate"] * r_action_rate
            + w["orientation"] * r_orientation
            + w["foot_air"] * r_foot
            + w["height"] * r_height
            + w["alive"] * r_alive
            + w["lin_vel_z"] * r_lin_vel_z
            + w["ang_vel_xy"] * r_ang_vel_xy
            + w["body_collision"] * r_body_collision
            + w["torque"] * r_torque
            + w["joint_accel"] * r_joint_accel
        )

        info["reward_total"] = total
        return float(total), info

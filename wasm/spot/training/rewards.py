"""
Composable reward function system for Spot RL training.

Each RewardComponent computes a scalar from the environment state dict.
CompositeReward aggregates weighted components and returns per-component
breakdowns for TensorBoard logging.

Presets:
  - locomotion: stable walking with velocity tracking
  - terrain_traversal: locomotion + terrain traversal bonus
  - sprint: velocity-heavy for max speed training
"""

from __future__ import annotations

import numpy as np
from typing import Optional


class RewardComponent:
    """Base class for a single reward term."""

    def __init__(self, name: str, weight: float = 1.0):
        self.name = name
        self.weight = weight

    def compute(self, env_state: dict) -> float:
        raise NotImplementedError


class VelocityTrackingReward(RewardComponent):
    """Gaussian velocity tracking: exp(-4 * (v - v_cmd)^2)"""

    def compute(self, env_state: dict) -> float:
        vel_x = env_state["base_velocity"][0]
        v_cmd = env_state["command"][0]
        return float(np.exp(-4.0 * (vel_x - v_cmd) ** 2))


class ActionRateReward(RewardComponent):
    """Penalize action changes: -||a_t - a_{t-1}||^2"""

    def compute(self, env_state: dict) -> float:
        action = env_state["action"]
        prev_action = env_state["previous_action"]
        return -float(np.sum((action - prev_action) ** 2))


class OrientationReward(RewardComponent):
    """Penalize body tilt: -(pitch^2 + roll^2)"""

    def compute(self, env_state: dict) -> float:
        roll = env_state["roll"]
        pitch = env_state["pitch"]
        return -float(pitch ** 2 + roll ** 2)


class FootAirTimeReward(RewardComponent):
    """Reward proper swing phases (0.2-0.5s air time per foot)."""

    def __init__(self, name: str = "foot_air", weight: float = 1.0,
                 min_time: float = 0.2, max_time: float = 0.5):
        super().__init__(name, weight)
        self.min_time = min_time
        self.max_time = max_time

    def compute(self, env_state: dict) -> float:
        foot_air_time = env_state["foot_air_time"]
        total = 0.0
        for t in foot_air_time:
            if self.min_time <= t <= self.max_time:
                total += 1.0
        return total


class HeightReward(RewardComponent):
    """Penalize deviation from nominal standing height."""

    def __init__(self, name: str = "height", weight: float = 5.0,
                 nominal_height: float = 0.3):
        super().__init__(name, weight)
        self.nominal_height = nominal_height

    def compute(self, env_state: dict) -> float:
        height = env_state["height"]
        return -float((height - self.nominal_height) ** 2)


class TorqueReward(RewardComponent):
    """Penalize excessive torques: -||tau||^2"""

    def compute(self, env_state: dict) -> float:
        torques = env_state["joint_torques"]
        return -float(np.sum(torques ** 2))


class JointAccelReward(RewardComponent):
    """Penalize joint accelerations: -||q_ddot||^2"""

    def compute(self, env_state: dict) -> float:
        joint_accel = env_state["joint_accel"]
        return -float(np.sum(joint_accel ** 2))


class LinearVelocityZReward(RewardComponent):
    """Penalize vertical (z) base velocity: -v_z^2. Prevents launching/bouncing."""

    def compute(self, env_state: dict) -> float:
        vel_z = env_state["base_velocity"][2]  # PyBullet Z-up
        return -float(vel_z ** 2)


class AngularVelocityXYReward(RewardComponent):
    """Penalize roll/pitch angular velocity: -(omega_x^2 + omega_y^2).
    Directly prevents spinning and flipping."""

    def compute(self, env_state: dict) -> float:
        ang_vel = env_state["base_angular_velocity"]
        return -float(ang_vel[0] ** 2 + ang_vel[1] ** 2)


class BodyCollisionReward(RewardComponent):
    """Penalize non-foot body parts contacting the ground. -1.0 per contact."""

    def compute(self, env_state: dict) -> float:
        return -float(env_state.get("body_collision_count", 0))


class TerrainTraversalReward(RewardComponent):
    """Reward forward progress on rough terrain without falling.

    Grants bonus proportional to forward velocity when terrain_difficulty > 0,
    scaled by how rough the terrain is. On flat terrain this is zero.
    """

    def compute(self, env_state: dict) -> float:
        difficulty = env_state.get("terrain_difficulty", 0.0)
        if difficulty <= 0.0:
            return 0.0
        vel_x = env_state["base_velocity"][0]
        # Reward positive forward progress, scaled by difficulty
        return float(max(vel_x, 0.0) * difficulty)


class AliveReward(RewardComponent):
    """Constant per-step alive bonus."""

    def __init__(self, name: str = "alive", weight: float = 1.0,
                 bonus: float = 0.5):
        super().__init__(name, weight)
        self.bonus = bonus

    def compute(self, env_state: dict) -> float:
        return self.bonus


class CompositeReward:
    """Aggregates weighted RewardComponents into a single scalar + info dict."""

    def __init__(self, components: list[RewardComponent]):
        self.components = components

    def compute(self, env_state: dict) -> tuple[float, dict]:
        total = 0.0
        info = {}
        for comp in self.components:
            r = comp.compute(env_state) * comp.weight
            total += r
            info[f"r_{comp.name}"] = r
        return total, info

    @classmethod
    def locomotion_default(cls) -> CompositeReward:
        """Standard locomotion reward preset (calibrated to legged_gym defaults)."""
        return cls([
            VelocityTrackingReward("velocity", weight=1.0),
            ActionRateReward("action_rate", weight=0.01),
            JointAccelReward("joint_accel", weight=2.5e-7),
            TorqueReward("torque", weight=0.0001),
            OrientationReward("orientation", weight=1.0),
            FootAirTimeReward("foot_air", weight=1.0),
            HeightReward("height", weight=2.0),
            AliveReward("alive", weight=1.0, bonus=0.5),
            # Anti-flip terms (critical for preventing back-flipping)
            LinearVelocityZReward("lin_vel_z", weight=2.0),
            AngularVelocityXYReward("ang_vel_xy", weight=0.05),
            BodyCollisionReward("body_collision", weight=1.0),
        ])

    @classmethod
    def terrain_traversal(cls) -> CompositeReward:
        """Locomotion + terrain traversal bonus."""
        return cls([
            VelocityTrackingReward("velocity", weight=1.0),
            ActionRateReward("action_rate", weight=0.01),
            JointAccelReward("joint_accel", weight=2.5e-7),
            TorqueReward("torque", weight=1e-5),
            OrientationReward("orientation", weight=5.0),
            FootAirTimeReward("foot_air", weight=1.0),
            HeightReward("height", weight=5.0),
            AliveReward("alive", weight=1.0, bonus=0.5),
            TerrainTraversalReward("terrain_traversal", weight=2.0),
        ])

    @classmethod
    def sprint(cls) -> CompositeReward:
        """Velocity-heavy preset for max speed training."""
        return cls([
            VelocityTrackingReward("velocity", weight=3.0),
            ActionRateReward("action_rate", weight=0.005),
            JointAccelReward("joint_accel", weight=1e-7),
            TorqueReward("torque", weight=5e-6),
            OrientationReward("orientation", weight=2.0),
            FootAirTimeReward("foot_air", weight=0.5),
            HeightReward("height", weight=3.0),
            AliveReward("alive", weight=1.0, bonus=0.5),
        ])

    @classmethod
    def from_config(cls, config: str | list[dict]) -> CompositeReward:
        """Build from a preset name or list of {name, weight} dicts.

        Args:
            config: Either a preset string ("locomotion", "terrain_traversal",
                    "sprint") or a list of dicts like:
                    [{"name": "velocity", "weight": 1.0}, ...]
        """
        if isinstance(config, str):
            presets = {
                "locomotion": cls.locomotion_default,
                "terrain_traversal": cls.terrain_traversal,
                "sprint": cls.sprint,
            }
            if config not in presets:
                raise ValueError(
                    f"Unknown reward preset '{config}'. "
                    f"Available: {list(presets.keys())}"
                )
            return presets[config]()

        # Custom component list
        component_classes = {
            "velocity": VelocityTrackingReward,
            "action_rate": ActionRateReward,
            "orientation": OrientationReward,
            "foot_air": FootAirTimeReward,
            "height": HeightReward,
            "torque": TorqueReward,
            "joint_accel": JointAccelReward,
            "terrain_traversal": TerrainTraversalReward,
            "alive": AliveReward,
            "lin_vel_z": LinearVelocityZReward,
            "ang_vel_xy": AngularVelocityXYReward,
            "body_collision": BodyCollisionReward,
        }

        components = []
        for spec in config:
            name = spec["name"]
            weight = spec.get("weight", 1.0)
            if name not in component_classes:
                raise ValueError(
                    f"Unknown reward component '{name}'. "
                    f"Available: {list(component_classes.keys())}"
                )
            components.append(component_classes[name](name, weight=weight))

        return cls(components)

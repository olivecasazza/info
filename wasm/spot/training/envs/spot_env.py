"""
Spot Robot Gymnasium Environment
Matches the Rust/WASM observation and action spaces exactly
"""

import numpy as np
import pybullet as p
import pybullet_data
import gymnasium as gym
from gymnasium import spaces
from typing import Optional, Tuple


class SpotEnv(gym.Env):
    """Spot quadruped robot environment for RL training"""

    metadata = {"render_modes": ["human", "rgb_array"], "render_fps": 60}

    def __init__(self, render_mode: Optional[str] = None, time_step: float = 1/120):
        super().__init__()

        self.render_mode = render_mode
        self.time_step = time_step
        self.max_episode_steps = 1000
        self.current_step = 0

        # === Observation Space (42D) ===
        # [gravity(3), joint_pos(12), joint_vel(12), prev_action(12), command(3)]
        obs_low = np.array([
            -1, -1, -1,  # gravity (normalized)
            *[-np.pi] * 12,  # joint positions
            *[-50] * 12,  # joint velocities
            *[-np.pi] * 12,  # previous actions
            -1, -1, -1,  # command (normalized)
        ], dtype=np.float32)

        obs_high = np.array([
            1, 1, 1,  # gravity
            *[np.pi] * 12,  # joint positions
            *[50] * 12,  # joint velocities
            *[np.pi] * 12,  # previous actions
            1, 1, 1,  # command
        ], dtype=np.float32)

        self.observation_space = spaces.Box(low=obs_low, high=obs_high, dtype=np.float32)

        # === Action Space (12D) ===
        # Target joint angles (will be clamped to reasonable ranges)
        self.action_space = spaces.Box(
            low=-np.pi,
            high=np.pi,
            shape=(12,),
            dtype=np.float32
        )

        # Joint names matching URDF
        self.joint_names = [
            "motor_front_left_hip", "motor_front_left_upper_leg", "motor_front_left_lower_leg",
            "motor_front_right_hip", "motor_front_right_upper_leg", "motor_front_right_lower_leg",
            "motor_back_left_hip", "motor_back_left_upper_leg", "motor_back_left_lower_leg",
            "motor_back_right_hip", "motor_back_right_upper_leg", "motor_back_right_lower_leg",
        ]

        # State tracking
        self.robot_id = None
        self.plane_id = None
        self.joint_indices = []
        self.previous_action = np.zeros(12, dtype=np.float32)
        self.command = np.array([0.0, 0.0, 0.0], dtype=np.float32)  # [vx, vy, yaw]

        # Connect to PyBullet
        if render_mode == "human":
            self.client = p.connect(p.GUI)
        else:
            self.client = p.connect(p.DIRECT)

        self._setup_simulation()

    def _setup_simulation(self):
        """Initialize PyBullet simulation"""
        p.setAdditionalSearchPath(pybullet_data.getDataPath())
        p.setGravity(0, 0, -9.81)
        p.setTimeStep(self.time_step)

        # Load ground plane
        self.plane_id = p.loadURDF("plane.urdf")

    def _load_robot(self):
        """Load Spot robot URDF"""
        start_pos = [0, 0, 0.3]
        start_orientation = p.getQuaternionFromEuler([0, 0, 0])

        # Load Spot URDF (relative to working directory)
        # We assume 'assets' folder is available in working dir
        self.robot_id = p.loadURDF("assets/spot.urdf", start_pos, start_orientation,
                                 flags=p.URDF_USE_SELF_COLLISION)

        # Map joint names to indices
        num_joints = p.getNumJoints(self.robot_id)
        joint_name_to_idx = {}
        for i in range(num_joints):
            info = p.getJointInfo(self.robot_id, i)
            name = info[1].decode('utf-8')
            joint_name_to_idx[name] = i

        # Build ordered list of indices matched to self.joint_names
        self.joint_indices = []
        for name in self.joint_names:
            if name in joint_name_to_idx:
                self.joint_indices.append(joint_name_to_idx[name])
            else:
                print(f"⚠️ Warning: Joint {name} not found in URDF!")

    def reset(self, seed: Optional[int] = None, options: Optional[dict] = None):
        """Reset environment to initial state"""
        super().reset(seed=seed)

        # Remove old robot
        if self.robot_id is not None:
            p.removeBody(self.robot_id)

        # Load fresh robot
        self._load_robot()

        # Reset state
        self.current_step = 0
        self.previous_action = np.zeros(12, dtype=np.float32)

        # Random command for curriculum learning
        if options and "command" in options:
            self.command = np.array(options["command"], dtype=np.float32)
        else:
            self.command = np.array([
                np.random.uniform(-1, 1),  # vel_x
                np.random.uniform(-0.5, 0.5),  # vel_y
                np.random.uniform(-0.5, 0.5),  # yaw_rate
            ], dtype=np.float32)

        # Get initial observation
        obs = self._get_observation()
        info = {}

        return obs, info

    def _get_observation(self) -> np.ndarray:
        """Collect 42D observation matching Rust controller"""
        # Get base link state
        base_pos, base_orn = p.getBasePositionAndOrientation(self.robot_id)
        base_vel, base_ang_vel = p.getBaseVelocity(self.robot_id)

        # 1. Gravity vector in body frame (3D)
        # Transform world gravity [0, 0, -1] to body frame
        inv_orn = p.invertTransform([0, 0, 0], base_orn)[1]
        gravity_body = p.multiplyTransforms(
            [0, 0, 0], inv_orn,
            [0, 0, -1], [0, 0, 0, 1]
        )[0]

        # 2. Joint positions and velocities
        joint_states = p.getJointStates(self.robot_id, self.joint_indices)
        joint_positions = np.array([s[0] for s in joint_states], dtype=np.float32)
        joint_velocities = np.array([s[1] for s in joint_states], dtype=np.float32)

        # Pad if we have fewer than 12 joints
        if len(joint_positions) < 12:
            joint_positions = np.pad(joint_positions, (0, 12 - len(joint_positions)))
            joint_velocities = np.pad(joint_velocities, (0, 12 - len(joint_velocities)))

        # 3. Construct observation
        obs = np.concatenate([
            gravity_body,           # 3
            joint_positions[:12],   # 12
            joint_velocities[:12],  # 12
            self.previous_action,   # 12
            self.command,           # 3
        ]).astype(np.float32)

        # Sanitize observation to prevent crashes
        if not np.isfinite(obs).all():
            print("⚠️ Warning: NaN/Inf detected in observation! Replacing with zeros.")
            obs = np.nan_to_num(obs)

        # Clip to observation space bounds to ensure validity
        # We assume standard bounds logic: gravity [-1,1], others wider
        # Just clamping to reasonable limits helps avoid strict checker warnings
        obs = np.clip(obs, self.observation_space.low, self.observation_space.high)

        return obs

    def step(self, action: np.ndarray) -> Tuple[np.ndarray, float, bool, bool, dict]:
        """Execute one timestep"""
        self.current_step += 1

        # Clamp action to valid range
        action = np.clip(action, -np.pi, np.pi)

        # Apply actions to joints (PD control)
        for i, joint_idx in enumerate(self.joint_indices[:12]):
            if i < len(action):
                target_pos = action[i]
                p.setJointMotorControl2(
                    self.robot_id,
                    joint_idx,
                    p.POSITION_CONTROL,
                    targetPosition=target_pos,
                    force=100,  # Max force
                    positionGain=0.3,  # P gain
                    velocityGain=0.1,  # D gain
                )

        # Step simulation
        p.stepSimulation()

        # Store action for next observation
        self.previous_action = action.copy()

        # Get new state
        obs = self._get_observation()

        # Calculate reward
        reward = self._calculate_reward()

        # Check termination
        terminated = self._is_terminated()
        truncated = self.current_step >= self.max_episode_steps

        info = {
            "is_success": not terminated and self.current_step > 500,
            "episode_length": self.current_step,
        }

        return obs, reward, terminated, truncated, info

    def _calculate_reward(self) -> float:
        """Compute reward for current state"""
        base_pos, base_orn = p.getBasePositionAndOrientation(self.robot_id)
        base_vel, base_ang_vel = p.getBaseVelocity(self.robot_id)

        # Get base height and orientation
        height = base_pos[2]
        roll, pitch, yaw = p.getEulerFromQuaternion(base_orn)

        # Velocity in body frame
        vel_world = np.array(base_vel)

        # === Reward Components ===

        # 1. Alive bonus (stay upright)
        alive_reward = 1.0 if height > 0.15 else 0.0

        # 2. Forward velocity tracking
        # Command[0] is target vel_x (-1 to 1)
        target_vel_x = self.command[0] * 0.5  # Scale to m/s
        vel_reward = -abs(vel_world[0] - target_vel_x)

        # 3. Orientation penalty (stay level)
        orientation_penalty = -(abs(roll) + abs(pitch))

        # 4. Energy penalty (smooth actions)
        action_diff = np.sum(np.square(self.previous_action))
        energy_penalty = -0.01 * action_diff

        # 5. Height bonus
        height_reward = 0.5 if 0.2 < height < 0.5 else -1.0

        # Total reward
        reward = (
            alive_reward * 1.0
            + vel_reward * 2.0
            + orientation_penalty * 0.5
            + energy_penalty
            + height_reward * 0.5
        )

        return float(reward)

    def _is_terminated(self) -> bool:
        """Check if episode should terminate"""
        base_pos, base_orn = p.getBasePositionAndOrientation(self.robot_id)

        # Check for physics explosion (NaNs)
        if not np.isfinite(base_pos).all() or not np.isfinite(base_orn).all():
            print("⚠️ Warning: Physics exploded (NaN/Inf)! Terminating episode.")
            return True

        height = base_pos[2]
        roll, pitch, _ = p.getEulerFromQuaternion(base_orn)

        # Terminate if fallen over
        if height < 0.1:
            return True

        # Terminate if tipped over
        if abs(roll) > np.pi/3 or abs(pitch) > np.pi/3:
            return True

        return False

    def render(self):
        """Render environment (handled by PyBullet GUI)"""
        if self.render_mode == "rgb_array":
            # Get camera image
            width, height = 640, 480
            view_matrix = p.computeViewMatrixFromYawPitchRoll(
                cameraTargetPosition=[0, 0, 0.3],
                distance=2.0,
                yaw=45,
                pitch=-30,
                roll=0,
                upAxisIndex=2
            )
            proj_matrix = p.computeProjectionMatrixFOV(
                fov=60, aspect=width/height, nearVal=0.1, farVal=100.0
            )
            _, _, rgba, _, _ = p.getCameraImage(
                width, height, view_matrix, proj_matrix
            )
            return rgba[:, :, :3]  # Return RGB only

    def close(self):
        """Clean up PyBullet connection"""
        if self.client >= 0:
            p.disconnect(self.client)


# Test the environment
if __name__ == "__main__":
    env = SpotEnv(render_mode="human")
    obs, info = env.reset()

    print(f"Observation space: {env.observation_space.shape}")
    print(f"Action space: {env.action_space.shape}")
    print(f"Initial observation: {obs.shape}")

    for _ in range(1000):
        action = env.action_space.sample()
        obs, reward, terminated, truncated, info = env.step(action)

        if terminated or truncated:
            obs, info = env.reset()

    env.close()

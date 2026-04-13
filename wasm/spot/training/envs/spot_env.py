"""
Spot Robot Gymnasium Environment
Locomotion-focused reward shaping with action-offset control

Physics Gap Notes -- PyBullet (training) vs Rapier3D (WASM inference)
---------------------------------------------------------------------
The training environment uses PyBullet while the deployed WASM runtime
uses Rapier3D (see wasm/spot/src/physics/mod.rs). Known divergences:

1. Constraint solver: PyBullet uses a sequential-impulse (Gauss-Seidel)
   solver with configurable iterations (default 10 here). Rapier3D uses a
   PGS (Projected Gauss-Seidel) solver with 4 velocity iterations by
   default. Joint limit enforcement and friction cone approximations
   differ between the two.

2. Contact model: PyBullet resolves contacts via speculative contact
   points with restitution and lateral/rolling friction. Rapier3D uses
   a different contact manifold generation pipeline and friction model.
   Expect small differences in foot-ground interaction forces.

3. Integration method: PyBullet uses semi-implicit Euler at 200Hz here.
   Rapier3D uses symplectic Euler at 60Hz (no substeps). The 3x timestep
   difference is the largest single source of sim-to-sim gap.

4. Gravity axis: PyBullet is Z-up (gravity = [0, 0, -9.81]). Rapier3D
   is Y-up (gravity = [0, -9.81, 0]). The WASM controller applies a
   coordinate mapping (swap Y<->Z, negate) so the policy sees a
   consistent observation frame regardless of backend.

5. Terrain: PyBullet uses a heightfield collision shape regenerated each
   episode. Rapier3D loads a pre-baked trimesh from terrain.json. The
   training heightfield is randomised for domain randomisation; the WASM
   terrain is deterministic Perlin noise.

Plan: Eventually replace PyBullet with Rapier3D via PyO3 bindings to
eliminate the sim-to-sim gap entirely. Until then, domain randomisation
(terrain, friction, mass) during training bridges the transfer gap.
---------------------------------------------------------------------
"""

import numpy as np
import pybullet as p
import pybullet_data
import gymnasium as gym
from gymnasium import spaces
from typing import Optional, Tuple

from rewards import CompositeReward


class RunningMeanStd:
    """Welford online running mean/variance for observation normalization."""

    def __init__(self, shape: tuple, epsilon: float = 1e-4):
        self.mean = np.zeros(shape, dtype=np.float64)
        self.var = np.ones(shape, dtype=np.float64)
        self.count = epsilon

    def update(self, batch: np.ndarray):
        batch = np.atleast_2d(batch)
        batch_mean = np.mean(batch, axis=0)
        batch_var = np.var(batch, axis=0)
        batch_count = batch.shape[0]
        self._update_from_moments(batch_mean, batch_var, batch_count)

    def _update_from_moments(self, batch_mean, batch_var, batch_count):
        delta = batch_mean - self.mean
        total_count = self.count + batch_count
        new_mean = self.mean + delta * batch_count / total_count
        m_a = self.var * self.count
        m_b = batch_var * batch_count
        m2 = m_a + m_b + np.square(delta) * self.count * batch_count / total_count
        new_var = m2 / total_count
        self.mean = new_mean
        self.var = new_var
        self.count = total_count

    def normalize(self, x: np.ndarray) -> np.ndarray:
        return ((x - self.mean) / np.sqrt(self.var + 1e-8)).astype(np.float32)


class SpotEnv(gym.Env):
    """Spot quadruped robot environment for RL training.

    Key design choices for stable locomotion:
    - Actions are offsets from a default standing pose (+/- 0.5 rad)
    - Reward tracks forward velocity via Gaussian kernel
    - Action rate penalty kills twitching
    - Strong PD gains (P=1.5, D=0.3) for servo-like response
    - Decimation=4: policy runs at 50Hz, physics at 200Hz
    - Running mean/std observation normalization
    """

    metadata = {"render_modes": ["human", "rgb_array"], "render_fps": 50}

    # Default standing joint angles (radians) -- neutral quadruped pose
    # Order: FL(hip, upper, lower), FR(hip, upper, lower),
    #        BL(hip, upper, lower), BR(hip, upper, lower)
    DEFAULT_JOINT_ANGLES = np.array([
        0.0, 0.6, -1.2,   # front left
        0.0, 0.6, -1.2,   # front right
        0.0, 0.6, -1.2,   # back left
        0.0, 0.6, -1.2,   # back right
    ], dtype=np.float32)

    # Nominal base height when standing (meters)
    NOMINAL_HEIGHT = 0.3

    # PD control gains
    KP = 1.5
    KD = 0.3
    MAX_FORCE = 200.0

    # Action offset limits (radians)
    ACTION_OFFSET_LIMIT = 0.5

    # Simulation parameters
    SIM_FREQ = 200    # Hz -- physics timestep
    POLICY_FREQ = 50  # Hz -- policy rate
    DECIMATION = SIM_FREQ // POLICY_FREQ  # = 4

    def __init__(self, render_mode: Optional[str] = None, config: Optional[dict] = None):
        super().__init__()

        self.render_mode = render_mode
        self.time_step = 1.0 / self.SIM_FREQ
        self.max_episode_steps = 2000  # 10s at 50Hz policy rate
        self.current_step = 0

        # Curriculum: velocity command scale (0..1), set externally or via config
        config = config or {}
        self.cmd_vel_scale = config.get("cmd_vel_scale", 1.0)

        # Terrain difficulty (0.0 = flat, 1.0 = max roughness)
        self.terrain_difficulty = config.get("terrain_difficulty", 0.0)
        self.terrain_body = None

        # Composable reward function
        reward_config = config.get("reward_preset", "locomotion")
        self.reward_fn = CompositeReward.from_config(reward_config)

        # === Observation Space (45D) ===
        # [body_ang_vel(3), gravity(3), joint_pos_offset(12), joint_vel(12),
        #  prev_action(12), command(3)]
        obs_dim = 3 + 3 + 12 + 12 + 12 + 3  # = 45
        # Use wide bounds; actual normalization handled by RunningMeanStd
        obs_bound = 100.0
        self.observation_space = spaces.Box(
            low=-obs_bound, high=obs_bound, shape=(obs_dim,), dtype=np.float32
        )

        # === Action Space (12D) -- offsets from default pose ===
        self.action_space = spaces.Box(
            low=-self.ACTION_OFFSET_LIMIT,
            high=self.ACTION_OFFSET_LIMIT,
            shape=(12,),
            dtype=np.float32,
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
        self.prev_joint_vel = np.zeros(12, dtype=np.float32)
        self.command = np.zeros(3, dtype=np.float32)  # [vx, vy, yaw_rate]

        # Foot air-time tracking (4 feet)
        self.foot_air_time = np.zeros(4, dtype=np.float32)
        self.foot_link_names = [
            "front_left_lower_leg",   # FL foot link
            "front_right_lower_leg",  # FR foot link
            "back_left_lower_leg",    # BL foot link
            "back_right_lower_leg",   # BR foot link
        ]
        self.foot_link_indices = []

        # Observation normalization
        self.obs_rms = RunningMeanStd(shape=(obs_dim,))
        self._normalize_obs = True

        # Connect to PyBullet
        if render_mode == "human":
            self.client = p.connect(p.GUI)
        else:
            self.client = p.connect(p.DIRECT)

        self._setup_simulation()

    def _setup_simulation(self):
        """Initialize PyBullet simulation."""
        p.setAdditionalSearchPath(pybullet_data.getDataPath())
        p.setGravity(0, 0, -9.81)
        p.setTimeStep(self.time_step)

        # Load flat ground plane (replaced per-episode when terrain_difficulty > 0)
        self.plane_id = p.loadURDF("plane.urdf")

        # Increase solver iterations for stability
        p.setPhysicsEngineParameter(numSolverIterations=10, numSubSteps=1)

    def _create_terrain(self):
        """Generate random terrain heightfield for this episode.

        When terrain_difficulty is 0, the flat plane.urdf is used instead.
        Otherwise, the flat plane is removed and replaced with a procedural
        heightfield whose amplitude scales with terrain_difficulty.
        """
        from scipy.ndimage import uniform_filter

        # Remove existing terrain body if present
        if self.terrain_body is not None:
            p.removeBody(self.terrain_body)
            self.terrain_body = None

        # Remove flat plane when using heightfield terrain
        if self.plane_id is not None:
            p.removeBody(self.plane_id)
            self.plane_id = None

        rows = cols = 64
        # height_scale ramps from 0 to 0.05m with difficulty
        height_scale = 0.05 * self.terrain_difficulty

        terrain_data = self.np_random.uniform(
            0, height_scale, (rows, cols)
        ).astype(np.float32)

        # Smooth with simple averaging to avoid spikes
        terrain_data = uniform_filter(terrain_data, size=3)

        # Flatten center area for spawn safety
        cx, cz = rows // 2, cols // 2
        r = 5
        terrain_data[cx - r:cx + r, cz - r:cz + r] *= 0.1

        terrain_shape = p.createCollisionShape(
            p.GEOM_HEIGHTFIELD,
            meshScale=[0.1, 0.1, 1.0],  # 6.4m x 6.4m
            heightfieldData=terrain_data.flatten(),
            numHeightfieldRows=rows,
            numHeightfieldColumns=cols,
        )
        self.terrain_body = p.createMultiBody(0, terrain_shape)
        p.resetBasePositionAndOrientation(
            self.terrain_body, [0, 0, 0], [0, 0, 0, 1]
        )
        p.changeDynamics(self.terrain_body, -1, lateralFriction=1.0)

    def _load_robot(self):
        """Load Spot robot URDF."""
        start_pos = [0, 0, self.NOMINAL_HEIGHT + 0.05]  # slightly above ground
        start_orientation = p.getQuaternionFromEuler([0, 0, 0])

        self.robot_id = p.loadURDF(
            "assets/spot.urdf", start_pos, start_orientation,
            flags=p.URDF_USE_SELF_COLLISION,
        )

        # Map joint names to indices
        num_joints = p.getNumJoints(self.robot_id)
        joint_name_to_idx = {}
        link_name_to_idx = {}
        for i in range(num_joints):
            info = p.getJointInfo(self.robot_id, i)
            name = info[1].decode("utf-8")
            link_name = info[12].decode("utf-8")
            joint_name_to_idx[name] = i
            link_name_to_idx[link_name] = i

        # Build ordered list of motor joint indices
        self.joint_indices = []
        for name in self.joint_names:
            if name in joint_name_to_idx:
                self.joint_indices.append(joint_name_to_idx[name])
            else:
                print(f"Warning: Joint {name} not found in URDF!")

        # Build foot link indices for contact detection
        self.foot_link_indices = []
        for name in self.foot_link_names:
            if name in link_name_to_idx:
                self.foot_link_indices.append(link_name_to_idx[name])
            elif name in joint_name_to_idx:
                self.foot_link_indices.append(joint_name_to_idx[name])

        # Set initial joint positions to default standing pose
        for i, joint_idx in enumerate(self.joint_indices[:12]):
            p.resetJointState(self.robot_id, joint_idx, self.DEFAULT_JOINT_ANGLES[i])

    def reset(self, seed: Optional[int] = None, options: Optional[dict] = None):
        """Reset environment to initial state."""
        super().reset(seed=seed)

        # Remove old robot
        if self.robot_id is not None:
            p.removeBody(self.robot_id)

        # Regenerate terrain each episode
        if self.terrain_difficulty > 0.0:
            self._create_terrain()
        else:
            # Ensure flat plane exists when difficulty is 0
            if self.plane_id is None:
                self.plane_id = p.loadURDF("plane.urdf")
            # Clean up any leftover heightfield
            if self.terrain_body is not None:
                p.removeBody(self.terrain_body)
                self.terrain_body = None

        # Load fresh robot
        self._load_robot()

        # Reset state
        self.current_step = 0
        self.previous_action = np.zeros(12, dtype=np.float32)
        self.prev_joint_vel = np.zeros(12, dtype=np.float32)
        self.foot_air_time = np.zeros(4, dtype=np.float32)

        # Velocity command (scaled by curriculum)
        if options and "command" in options:
            self.command = np.array(options["command"], dtype=np.float32)
        else:
            scale = self.cmd_vel_scale
            self.command = np.array([
                self.np_random.uniform(-1.0, 1.0) * scale,   # vx (m/s)
                self.np_random.uniform(-0.5, 0.5) * scale,   # vy (m/s)
                self.np_random.uniform(-0.5, 0.5) * scale,   # yaw_rate (rad/s)
            ], dtype=np.float32)

        # Let robot settle for a few physics steps
        for _ in range(10):
            p.stepSimulation()

        obs = self._get_observation()
        return obs, {}

    def _get_observation(self) -> np.ndarray:
        """Collect observation vector.

        Layout (45D):
            body_angular_velocity  (3)
            projected_gravity      (3)
            joint_pos - default    (12)
            joint_velocities       (12)
            previous_actions       (12)
            velocity_commands      (3)
        """
        base_pos, base_orn = p.getBasePositionAndOrientation(self.robot_id)
        base_vel, base_ang_vel = p.getBaseVelocity(self.robot_id)

        # Body angular velocity in body frame
        inv_pos, inv_orn = p.invertTransform([0, 0, 0], base_orn)
        ang_vel_body, _ = p.multiplyTransforms(
            [0, 0, 0], inv_orn,
            list(base_ang_vel), [0, 0, 0, 1],
        )

        # Projected gravity in body frame
        gravity_body, _ = p.multiplyTransforms(
            [0, 0, 0], inv_orn,
            [0, 0, -1], [0, 0, 0, 1],
        )

        # Joint states
        joint_states = p.getJointStates(self.robot_id, self.joint_indices[:12])
        joint_positions = np.array([s[0] for s in joint_states], dtype=np.float32)
        joint_velocities = np.array([s[1] for s in joint_states], dtype=np.float32)

        # Pad if fewer than 12 joints found
        if len(joint_positions) < 12:
            joint_positions = np.pad(joint_positions, (0, 12 - len(joint_positions)))
            joint_velocities = np.pad(joint_velocities, (0, 12 - len(joint_velocities)))

        # Joint positions relative to default standing pose
        joint_pos_offset = joint_positions - self.DEFAULT_JOINT_ANGLES

        obs = np.concatenate([
            np.array(ang_vel_body, dtype=np.float32),    # 3
            np.array(gravity_body, dtype=np.float32),    # 3
            joint_pos_offset,                             # 12
            joint_velocities,                             # 12
            self.previous_action,                         # 12
            self.command,                                 # 3
        ])

        # Sanitize
        if not np.isfinite(obs).all():
            obs = np.nan_to_num(obs, nan=0.0, posinf=0.0, neginf=0.0)

        # Running normalization
        self.obs_rms.update(obs)
        if self._normalize_obs:
            obs = self.obs_rms.normalize(obs)

        return obs.astype(np.float32)

    def step(self, action: np.ndarray) -> Tuple[np.ndarray, float, bool, bool, dict]:
        """Execute one policy step (decimated: 4 physics steps per action)."""
        self.current_step += 1

        # Clamp offsets to limit
        action = np.clip(action, -self.ACTION_OFFSET_LIMIT, self.ACTION_OFFSET_LIMIT).astype(np.float32)

        # Compute target joint positions = default pose + offset
        target_positions = self.DEFAULT_JOINT_ANGLES + action

        # Apply PD control and step physics (decimation)
        for _ in range(self.DECIMATION):
            for i, joint_idx in enumerate(self.joint_indices[:12]):
                p.setJointMotorControl2(
                    self.robot_id,
                    joint_idx,
                    p.POSITION_CONTROL,
                    targetPosition=float(target_positions[i]),
                    force=self.MAX_FORCE,
                    positionGain=self.KP,
                    velocityGain=self.KD,
                )
            p.stepSimulation()

        # Update foot air-time tracking
        self._update_foot_contacts()

        # Get new observation (before storing action, so prev_action is from last step)
        obs = self._get_observation()

        # Calculate reward
        reward, reward_info = self._calculate_reward(action)

        # Store for next step
        self.previous_action = action.copy()

        # Joint velocities for acceleration penalty next step
        joint_states = p.getJointStates(self.robot_id, self.joint_indices[:12])
        self.prev_joint_vel = np.array([s[1] for s in joint_states], dtype=np.float32)

        # Termination
        terminated = self._is_terminated()
        truncated = self.current_step >= self.max_episode_steps

        info = {
            **reward_info,
            "episode_length": self.current_step,
        }

        return obs, reward, terminated, truncated, info

    def _update_foot_contacts(self):
        """Track per-foot air time for swing phase reward."""
        dt = self.DECIMATION * self.time_step  # time elapsed this policy step

        for i, link_idx in enumerate(self.foot_link_indices):
            contacts = p.getContactPoints(bodyA=self.robot_id, linkIndexA=link_idx)
            if len(contacts) > 0:
                # Foot is on ground -- reset air timer
                self.foot_air_time[i] = 0.0
            else:
                # Foot is in the air
                self.foot_air_time[i] += dt

    def _calculate_reward(self, action: np.ndarray) -> Tuple[float, dict]:
        """Compute locomotion reward via composable reward system.

        Returns (total_reward, component_dict).
        """
        base_pos, base_orn = p.getBasePositionAndOrientation(self.robot_id)
        base_vel, base_ang_vel = p.getBaseVelocity(self.robot_id)
        roll, pitch, yaw = p.getEulerFromQuaternion(base_orn)

        # Joint state for torque and acceleration terms
        joint_states = p.getJointStates(self.robot_id, self.joint_indices[:12])
        current_joint_vel = np.array([s[1] for s in joint_states], dtype=np.float32)
        joint_torques = np.array([s[3] for s in joint_states], dtype=np.float32)
        dt = self.DECIMATION * self.time_step
        joint_accel = (current_joint_vel - self.prev_joint_vel) / max(dt, 1e-6)

        # Build env_state dict consumed by reward components
        env_state = {
            "base_velocity": np.array(base_vel, dtype=np.float32),
            "command": self.command,
            "action": action,
            "previous_action": self.previous_action,
            "roll": roll,
            "pitch": pitch,
            "height": base_pos[2],
            "foot_air_time": self.foot_air_time,
            "joint_torques": joint_torques,
            "joint_accel": joint_accel,
            "terrain_difficulty": self.terrain_difficulty,
        }

        return self.reward_fn.compute(env_state)

    def _is_terminated(self) -> bool:
        """Check early termination conditions."""
        base_pos, base_orn = p.getBasePositionAndOrientation(self.robot_id)

        # Physics explosion
        if not np.isfinite(base_pos).all() or not np.isfinite(base_orn).all():
            return True

        height = base_pos[2]
        roll, pitch, _ = p.getEulerFromQuaternion(base_orn)

        # Fell too low
        if height < 0.15:
            return True

        # Tipped over (0.8 rad ~ 46 degrees)
        if abs(roll) > 0.8 or abs(pitch) > 0.8:
            return True

        # Body contact with ground (check base link)
        ground_id = self.terrain_body if self.terrain_body is not None else self.plane_id
        if ground_id is not None:
            contacts = p.getContactPoints(
                bodyA=self.robot_id, bodyB=ground_id, linkIndexA=-1
            )
            if len(contacts) > 0:
                return True

        return False

    def render(self):
        """Render environment (handled by PyBullet GUI)."""
        if self.render_mode == "rgb_array":
            base_pos = [0, 0, 0.3]
            if self.robot_id is not None:
                base_pos, _ = p.getBasePositionAndOrientation(self.robot_id)
            width, height = 640, 480
            view_matrix = p.computeViewMatrixFromYawPitchRoll(
                cameraTargetPosition=list(base_pos),
                distance=2.0, yaw=45, pitch=-30, roll=0, upAxisIndex=2,
            )
            proj_matrix = p.computeProjectionMatrixFOV(
                fov=60, aspect=width / height, nearVal=0.1, farVal=100.0,
            )
            _, _, rgba, _, _ = p.getCameraImage(width, height, view_matrix, proj_matrix)
            return rgba[:, :, :3]

    def close(self):
        """Clean up PyBullet connection."""
        if self.client >= 0:
            p.disconnect(self.client)


# Standalone test
if __name__ == "__main__":
    env = SpotEnv(render_mode="human")
    obs, info = env.reset()

    print(f"Observation space: {env.observation_space.shape}")
    print(f"Action space: {env.action_space.shape}")
    print(f"Initial observation: {obs.shape}")

    for step in range(2000):
        action = env.action_space.sample() * 0.1  # small random offsets
        obs, reward, terminated, truncated, info = env.step(action)

        if step % 100 == 0:
            print(f"Step {step}: reward={reward:.3f} vel={info.get('r_velocity', 0):.3f}")

        if terminated or truncated:
            obs, info = env.reset()

    env.close()

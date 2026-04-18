use rapier3d::prelude::*;
use std::collections::HashMap;
use crate::config::SpotConfig;
use crate::ml::{Policy, Observation, Action, UserCommand};
use nalgebra as na;

macro_rules! console_log {
    ($($arg:tt)*) => {
        web_sys::console::log_1(&format!($($arg)*).into());
    }
}

pub struct PID {
    pub k_p: f32,
    pub k_i: f32,
    pub k_d: f32,
    pub integral: f32,
    pub prev_error: f32,
}

impl PID {
    pub fn new(k_p: f32, k_i: f32, k_d: f32) -> Self {
        Self {
            k_p,
            k_i,
            k_d,
            integral: 0.0,
            prev_error: 0.0,
        }
    }

    pub fn update(&mut self, setpoint: f32, measured: f32, dt: f32) -> f32 {
        let error = setpoint - measured;
        self.integral += error * dt;
        let derivative = (error - self.prev_error) / dt;
        self.prev_error = error;

        self.k_p * error + self.k_i * self.integral + self.k_d * derivative
    }
}

/// Joint state tracking (Rapier doesn't expose motor position getters)
#[derive(Clone, Debug)]
struct JointState {
    target: f32,
    velocity: f32,
    prev_target: f32,
}

pub struct SpotController {
    // Map joint names to their Rapier multibody joint handles
    pub joint_handles: HashMap<String, MultibodyJointHandle>,

    // Joint order for observation/action (consistent ordering)
    pub joint_names: Vec<String>,

    // Joint state tracking
    joint_states: HashMap<String, JointState>,

    // ML Policy for generating actions
    pub policy: Policy,

    // User command (from keyboard)
    pub command: UserCommand,

    // Previous action (for observation) - public for debug display
    pub previous_action: Action,

    // Soft start blending
    pub total_time: f32,
    dt: f32,

    // Debug: test mode bypasses policy with simple motion
    pub test_mode: bool,

    // History for plotting (time, [12 joint targets])
    pub action_history: Vec<(f32, [f32; 12])>,

    // Debug: last observation vector for visualization
    pub last_observation: Vec<f32>,
}

impl SpotController {
    pub fn new() -> Self {
        // Try to load trained ONNX policy, fall back to standing policy
        web_sys::console::log_1(&"SpotController: Attempting to load ONNX policy...".into());

        let policy = match Self::load_trained_policy() {
            Ok(p) => {
                web_sys::console::log_1(&"SpotController: ONNX policy loaded successfully!".into());
                log::info!("Loaded trained ONNX policy");
                p
            }
            Err(e) => {
                let msg = format!("SpotController: ONNX policy load FAILED: {}", e);
                web_sys::console::error_1(&msg.into());
                log::warn!("Failed to load ONNX policy: {}, using standing policy", e);
                Policy::standing(Observation::SIZE, Action::SIZE)
            }
        };

        Self {
            joint_handles: HashMap::new(),
            joint_names: Vec::new(),
            joint_states: HashMap::new(),
            policy,
            command: UserCommand::new(),
            previous_action: Action::zero(),
            total_time: 0.0,
            dt: 1.0 / 60.0,
            test_mode: false,
            action_history: Vec::with_capacity(500),
            last_observation: vec![0.0; 45],
        }
    }

    /// Load the trained policy from embedded ONNX file
    fn load_trained_policy() -> Result<Policy, Box<dyn std::error::Error>> {
        // Include the ONNX file at compile time
        const POLICY_ONNX: &[u8] = include_bytes!("../../assets/policy.onnx");
        Policy::from_onnx(POLICY_ONNX)
    }

    pub fn register_joint(&mut self, name: &str, handle: MultibodyJointHandle) {
        self.joint_handles.insert(name.to_string(), handle);
        // Don't add to joint_names yet - we'll set the order manually
        self.joint_states.insert(name.to_string(), JointState {
            target: 0.0,
            velocity: 0.0,
            prev_target: 0.0,
        });
    }

    /// Set joint ordering to match the Python training environment exactly
    /// This must be called after all joints are registered
    pub fn finalize_joint_order(&mut self) {
        // CRITICAL: Must match the exact order from envs/spot_env.py
        // This order is used for observation/action indexing
        self.joint_names = vec![
            "motor_front_left_hip".to_string(),
            "motor_front_left_upper_leg".to_string(),
            "motor_front_left_lower_leg".to_string(),
            "motor_front_right_hip".to_string(),
            "motor_front_right_upper_leg".to_string(),
            "motor_front_right_lower_leg".to_string(),
            "motor_back_left_hip".to_string(),
            "motor_back_left_upper_leg".to_string(),
            "motor_back_left_lower_leg".to_string(),
            "motor_back_right_hip".to_string(),
            "motor_back_right_upper_leg".to_string(),
            "motor_back_right_lower_leg".to_string(),
        ];
    }

    /// Collect current observation from physics state
    /// Layout must match training env (spot_env.py) exactly:
    /// [body_ang_vel(3), gravity(3), joint_pos_offset(12), joint_vel(12), prev_action(12), cmd(3)]
    fn collect_observation(
        &self,
        base_rotation: &na::UnitQuaternion<f32>,
        base_angvel: &na::Vector3<f32>,
        joint_set: &MultibodyJointSet,
        rigid_body_set: &RigidBodySet,
    ) -> Observation {
        // 1. Body angular velocity in body frame
        // Rapier Y-up -> PyBullet Z-up coordinate mapping
        let body_angvel_rapier = base_rotation.inverse() * base_angvel;
        let body_angular_velocity = [
            body_angvel_rapier.x,
            -body_angvel_rapier.z,
            body_angvel_rapier.y,
        ];

        // 2. Projected gravity in body frame
        let world_gravity_rapier = na::Vector3::new(0.0, -1.0, 0.0);
        let body_gravity_rapier = base_rotation.inverse() * world_gravity_rapier;
        let gravity_vector = [
            body_gravity_rapier.x,
            -body_gravity_rapier.z,
            body_gravity_rapier.y,
        ];

        // 3. Joint positions and velocities from ACTUAL physics state
        // CRITICAL: Must read real joint angles, not motor targets.
        // Training reads actual positions from PyBullet joint_states[i][0].
        //
        // Use MultibodyLink::local_to_parent() which gives the actual joint
        // transform (including the revolute rotation). For AngX joints, extract
        // the X-axis rotation angle from the isometry's rotation component.
        let mut joint_positions = [0.0; 12];
        let mut joint_velocities = [0.0; 12];

        for (i, name) in self.joint_names.iter().enumerate().take(12) {
            if let Some(handle) = self.joint_handles.get(name) {
                if let Some((multibody, link_id)) = joint_set.get(*handle) {
                    if let Some(link) = multibody.link(link_id) {
                        // local_to_parent includes the joint frame offsets AND the
                        // actual joint rotation. For a revolute AngX joint, the
                        // rotation component encodes the joint angle.
                        let l2p = link.local_to_parent();
                        let rot = l2p.rotation;
                        // Extract angle around X axis from the rotation quaternion
                        // For small rotations this is approximately 2*qx, but we
                        // use the full atan2 decomposition for accuracy.
                        let rot_mat = rot.to_rotation_matrix();
                        let m = rot_mat.matrix();
                        let actual_angle = m[(2, 1)].atan2(m[(1, 1)]);

                        // Store as offset from default (matches training)
                        joint_positions[i] = actual_angle - SpotConfig::DEFAULT_JOINT_ANGLES[i];

                        // Actual velocity: get from the link's rigid body angular velocity
                        let rb_handle = link.rigid_body_handle();
                        if let Some(rb) = rigid_body_set.get(rb_handle) {
                            let angvel = rb.angvel();
                            // Project world angular velocity onto joint's local X axis
                            let local_x = rot * na::Vector3::x();
                            joint_velocities[i] = angvel.dot(&local_x);
                        }
                    }
                }
            }
        }

        Observation {
            body_angular_velocity,
            gravity_vector,
            joint_positions,
            joint_velocities,
            previous_action: self.previous_action.joint_targets,
            command: self.command.to_array(),
        }
    }

    /// Update controller with ML policy
    pub fn update(
        &mut self,
        joint_set: &mut MultibodyJointSet,
        rigid_body_set: &RigidBodySet,
        base_body_handle: Option<RigidBodyHandle>,
        dt: f32,
    ) {
        self.total_time += dt;
        self.dt = dt;

        // Get base link rotation and angular velocity
        let (base_rotation, base_angvel) = if let Some(handle) = base_body_handle {
            if let Some(body) = rigid_body_set.get(handle) {
                (*body.rotation(), *body.angvel())
            } else {
                (na::UnitQuaternion::identity(), na::Vector3::zeros())
            }
        } else {
            (na::UnitQuaternion::identity(), na::Vector3::zeros())
        };

        // 1. Collect observation (matches training env 45D layout)
        let obs = self.collect_observation(&base_rotation, &base_angvel, joint_set, rigid_body_set);
        self.last_observation = obs.to_vec();

        // 2. Run policy OR test mode
        let use_test_mode = self.test_mode && (self.command.vel_x.abs() > 0.1 || self.command.vel_y.abs() > 0.1);

        // Policy outputs ACTION OFFSETS from default pose (matching training)
        let frame_num = (self.total_time * 60.0) as u64;
        let debug_frame = frame_num % 120 == 0; // log every ~2s
        let first_frame = frame_num < 5;
        let action_offsets = if use_test_mode {
            // Simple walking test: offsets from default
            let phase = self.total_time * 4.0;
            let amplitude = 0.3;

            let mut offsets = [0.0f32; 12];
            offsets[1] = amplitude * phase.sin();
            offsets[2] = amplitude * 0.5 * phase.cos();
            offsets[4] = amplitude * (phase + std::f32::consts::PI).sin();
            offsets[5] = amplitude * 0.5 * (phase + std::f32::consts::PI).cos();

            if debug_frame { console_log!("[SPOT] test_mode active"); }
            Action { joint_targets: offsets }
        } else {
            let raw_obs = obs.to_vec();
            let normed = normalize_obs(&raw_obs);
            if debug_frame || first_frame {
                console_log!("[SPOT] t={:.2} frame={}", self.total_time, frame_num);
                console_log!("[SPOT] ang_vel=({:.3},{:.3},{:.3}) gravity=({:.3},{:.3},{:.3})",
                    raw_obs[0], raw_obs[1], raw_obs[2], raw_obs[3], raw_obs[4], raw_obs[5]);
                console_log!("[SPOT] joint_pos={:.3},{:.3},{:.3},{:.3},{:.3},{:.3},{:.3},{:.3},{:.3},{:.3},{:.3},{:.3}",
                    raw_obs[6], raw_obs[7], raw_obs[8], raw_obs[9], raw_obs[10], raw_obs[11],
                    raw_obs[12], raw_obs[13], raw_obs[14], raw_obs[15], raw_obs[16], raw_obs[17]);
                console_log!("[SPOT] joint_vel={:.3},{:.3},{:.3},{:.3},{:.3},{:.3},{:.3},{:.3},{:.3},{:.3},{:.3},{:.3}",
                    raw_obs[18], raw_obs[19], raw_obs[20], raw_obs[21], raw_obs[22], raw_obs[23],
                    raw_obs[24], raw_obs[25], raw_obs[26], raw_obs[27], raw_obs[28], raw_obs[29]);
                console_log!("[SPOT] prev_act={:.3},{:.3},{:.3},{:.3}... cmd=({:.2},{:.2},{:.2})",
                    raw_obs[30], raw_obs[31], raw_obs[32], raw_obs[33],
                    raw_obs[42], raw_obs[43], raw_obs[44]);
            }
            match self.policy.forward(&normed) {
                Ok(output) => {
                    let actions = if output.len() >= 12 { &output[..12] } else { &output };
                    if debug_frame || first_frame {
                        console_log!("[SPOT] actions={:.3},{:.3},{:.3},{:.3},{:.3},{:.3},{:.3},{:.3},{:.3},{:.3},{:.3},{:.3}",
                            actions[0], actions[1], actions[2], actions[3], actions[4], actions[5],
                            actions[6], actions[7], actions[8], actions[9], actions[10], actions[11]);
                    }
                    Action::from_vec(actions)
                }
                Err(e) => {
                    console_log!("[SPOT] inference FAILED: {}", e);
                    Action::zero()
                }
            }
        };

        // 3. Apply action as OFFSETS from default standing pose (matching training)
        let t = (self.total_time / SpotConfig::RAMP_DURATION).min(1.0);

        for (i, name) in self.joint_names.iter().enumerate().take(12) {
            if let Some(handle) = self.joint_handles.get(name) {
                if let Some((multibody, link_id)) = joint_set.get_mut(*handle) {
                    if let Some(link) = multibody.link_mut(link_id) {
                        // Clamp offset to match training bounds
                        let offset = action_offsets.joint_targets[i]
                            .clamp(-SpotConfig::ACTION_OFFSET_LIMIT, SpotConfig::ACTION_OFFSET_LIMIT);

                        // Target = default pose + policy offset (matches training exactly)
                        let target = SpotConfig::DEFAULT_JOINT_ANGLES[i] + offset;

                        // Update joint state tracking
                        if let Some(state) = self.joint_states.get_mut(name) {
                            state.velocity = (target - state.prev_target) / dt;
                            state.prev_target = state.target;
                            state.target = target;
                        }

                        // Uniform stiffness/damping matching training PD gains
                        let target_stiffness = SpotConfig::STIFFNESS_END;
                        let target_damping = SpotConfig::DAMPING;

                        let current_stiffness = SpotConfig::STIFFNESS_START
                            + (target_stiffness - SpotConfig::STIFFNESS_START) * t;

                        link.joint.data.set_motor_position(
                            JointAxis::AngX,
                            target,
                            current_stiffness,
                            target_damping,
                        );
                        link.joint.data.set_motor_max_force(JointAxis::AngX, SpotConfig::MAX_FORCE);
                    }
                }
            }
        }

        // 4. Store action offsets for next observation (prev_action in obs)
        self.previous_action = action_offsets.clone();

        // 5. Store in history for plotting
        self.action_history.push((self.total_time, action_offsets.joint_targets));
        if self.action_history.len() > 500 {
            self.action_history.remove(0);
        }
    }

    /// Set user command (called from keyboard input)
    pub fn set_command(&mut self, command: UserCommand) {
        self.command = command;
    }

    /// Smoothly interpolate command towards target
    pub fn update_command(&mut self, target: UserCommand, alpha: f32) {
        self.command.lerp(&target, alpha);
        self.command.clamp();
    }
}

// MeanStdFilter normalization stats from training (hp01, entropy=0.005, ~49M steps, reward ~2800)
const OBS_MEAN: [f32; 45] = [0.09006468, 0.03371983, -0.10829499, -0.08697820, -0.06859386, -0.29379088, -0.16344893, 0.24526481, -0.27965876, -0.17873497, -0.24460216, 0.47146994, 0.20907307, 0.22034371, 0.31521577, -0.17483112, -0.25600368, 0.50500846, -0.00419696, -0.08685949, 0.16314979, -0.01027451, -0.10150900, 0.13434120, 0.01519287, -0.10107616, 0.17491503, -0.01330356, -0.12471904, 0.19150208, -0.18649717, 0.23474216, -0.22981121, -0.18709546, -0.23056240, 0.42388114, 0.20529777, 0.22892898, 0.27991357, -0.24115296, -0.23259698, 0.48090014, 0.00000000, 0.00000000, 0.00000000];
const OBS_STD: [f32; 45] = [0.48409012, 0.46822602, 0.59885615, 0.75488830, 0.45977539, 0.49188292, 0.25534448, 0.31533900, 0.39225656, 0.36814147, 0.35606515, 0.71584940, 0.37850210, 0.30283219, 0.35462439, 0.30446616, 0.31753558, 0.54907721, 0.22348304, 0.39808938, 0.42989609, 0.32598636, 0.53117043, 0.74091494, 0.41538668, 0.34469599, 0.36342978, 0.34855974, 0.38647884, 0.36994293, 0.25413319, 0.31573433, 0.33016309, 0.36344802, 0.32400140, 0.77971441, 0.26929131, 0.27821717, 0.35268861, 0.27800566, 0.32587242, 0.52202100, 0.00010000, 0.00010000, 0.00010000];

fn normalize_obs(obs: &[f32]) -> Vec<f32> {
    obs.iter()
        .enumerate()
        .map(|(i, &v)| (v - OBS_MEAN[i]) / OBS_STD[i])
        .collect()
}

use rapier3d::prelude::*;
use std::collections::HashMap;
use crate::config::SpotConfig;
use crate::ml::{Policy, Observation, Action, UserCommand};
use nalgebra as na;

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

        // 3. Joint positions relative to default standing pose (offsets)
        let mut joint_positions = [0.0; 12];
        let mut joint_velocities = [0.0; 12];

        for (i, name) in self.joint_names.iter().enumerate().take(12) {
            if let Some(handle) = self.joint_handles.get(name) {
                if let Some((multibody, link_id)) = joint_set.get(*handle) {
                    if let Some(link) = multibody.link(link_id) {
                        let motor = &link.joint.data.motor(JointAxis::AngX);
                        if let Some(motor) = motor {
                            // Store position as offset from default (matches training)
                            joint_positions[i] = motor.target_pos - SpotConfig::DEFAULT_JOINT_ANGLES[i];
                        }
                        if let Some(state) = self.joint_states.get(name) {
                            joint_velocities[i] = state.velocity;
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
        let obs = self.collect_observation(&base_rotation, &base_angvel, joint_set);
        self.last_observation = obs.to_vec();

        // 2. Run policy OR test mode
        let use_test_mode = self.test_mode && (self.command.vel_x.abs() > 0.1 || self.command.vel_y.abs() > 0.1);

        // Policy outputs ACTION OFFSETS from default pose (matching training)
        let action_offsets = if use_test_mode {
            // Simple walking test: offsets from default
            let phase = self.total_time * 4.0;
            let amplitude = 0.3;

            let mut offsets = [0.0f32; 12];
            offsets[1] = amplitude * phase.sin();
            offsets[2] = amplitude * 0.5 * phase.cos();
            offsets[4] = amplitude * (phase + std::f32::consts::PI).sin();
            offsets[5] = amplitude * 0.5 * (phase + std::f32::consts::PI).cos();

            Action { joint_targets: offsets }
        } else if let Ok(output) = self.policy.forward(&obs.to_vec()) {
            Action::from_vec(&output)
        } else {
            log::warn!("Policy inference failed, using standing");
            Action::zero()
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

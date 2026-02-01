// Observation and Action types for ML policy

/// Observation space for the Spot robot policy
/// This is what the neural network "sees" about the current state
#[derive(Clone, Debug)]
pub struct Observation {
    /// Gravity direction in body frame (3D unit vector)
    /// Tells the robot which way is "down" relative to its orientation
    pub gravity_vector: [f32; 3],

    /// Current joint positions (12 joints: 3 per leg × 4 legs)
    /// Relative to default/neutral position
    pub joint_positions: [f32; 12],

    /// Current joint velocities (12 joints)
    pub joint_velocities: [f32; 12],

    /// Previous action (what we commanded last frame)
    /// Helps with temporal coherence
    pub previous_action: [f32; 12],

    /// User command: [target_vel_x, target_vel_y, target_yaw_rate]
    /// From keyboard input (WASD controls)
    pub command: [f32; 3],
}

impl Observation {
    /// Create a new observation with all zeros
    pub fn zero() -> Self {
        Self {
            gravity_vector: [0.0, 0.0, -1.0],
            joint_positions: [0.0; 12],
            joint_velocities: [0.0; 12],
            previous_action: [0.0; 12],
            command: [0.0; 3],
        }
    }

    /// Convert to flat vector for neural network input
    /// Total size: 3 + 12 + 12 + 12 + 3 = 42 floats
    pub fn to_vec(&self) -> Vec<f32> {
        let mut vec = Vec::with_capacity(42);
        vec.extend_from_slice(&self.gravity_vector);
        vec.extend_from_slice(&self.joint_positions);
        vec.extend_from_slice(&self.joint_velocities);
        vec.extend_from_slice(&self.previous_action);
        vec.extend_from_slice(&self.command);
        vec
    }

    /// Size of observation vector
    pub const SIZE: usize = 42;
}

/// Action space for the Spot robot
/// This is what the neural network outputs
#[derive(Clone, Debug)]
pub struct Action {
    /// Target joint angles for all 12 joints
    /// These are fed into the PD controller (not raw torques)
    pub joint_targets: [f32; 12],
}

impl Action {
    /// Create from flat vector (from neural network output)
    pub fn from_vec(vec: &[f32]) -> Self {
        assert_eq!(vec.len(), 12, "Action vector must have 12 elements");
        let mut joint_targets = [0.0; 12];
        joint_targets.copy_from_slice(vec);
        Self { joint_targets }
    }

    /// Convert to flat vector
    pub fn to_vec(&self) -> Vec<f32> {
        self.joint_targets.to_vec()
    }

    /// Create a zero action (neutral stance)
    pub fn zero() -> Self {
        Self {
            joint_targets: [0.0; 12],
        }
    }

    /// Size of action vector
    pub const SIZE: usize = 12;
}

/// User command from keyboard input
#[derive(Clone, Debug, Default)]
pub struct UserCommand {
    /// Forward/backward velocity [-1, 1]
    pub vel_x: f32,
    /// Left/right velocity [-1, 1]
    pub vel_y: f32,
    /// Yaw rotation rate [-1, 1]
    pub yaw_rate: f32,
}

impl UserCommand {
    pub fn new() -> Self {
        Self::default()
    }

    /// Smooth interpolation towards target command
    pub fn lerp(&mut self, target: &UserCommand, alpha: f32) {
        self.vel_x += (target.vel_x - self.vel_x) * alpha;
        self.vel_y += (target.vel_y - self.vel_y) * alpha;
        self.yaw_rate += (target.yaw_rate - self.yaw_rate) * alpha;
    }

    /// Convert to array for observation
    pub fn to_array(&self) -> [f32; 3] {
        [self.vel_x, self.vel_y, self.yaw_rate]
    }

    /// Clamp to valid range
    pub fn clamp(&mut self) {
        self.vel_x = self.vel_x.clamp(-1.0, 1.0);
        self.vel_y = self.vel_y.clamp(-1.0, 1.0);
        self.yaw_rate = self.yaw_rate.clamp(-1.0, 1.0);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_observation_size() {
        let obs = Observation::zero();
        assert_eq!(obs.to_vec().len(), Observation::SIZE);
    }

    #[test]
    fn test_action_roundtrip() {
        let action = Action::zero();
        let vec = action.to_vec();
        let action2 = Action::from_vec(&vec);
        assert_eq!(action.joint_targets, action2.joint_targets);
    }

    #[test]
    fn test_command_lerp() {
        let mut cmd = UserCommand::new();
        let target = UserCommand {
            vel_x: 1.0,
            vel_y: 0.5,
            yaw_rate: -0.5,
        };

        cmd.lerp(&target, 0.5);
        assert_eq!(cmd.vel_x, 0.5);
        assert_eq!(cmd.vel_y, 0.25);
        assert_eq!(cmd.yaw_rate, -0.25);
    }
}

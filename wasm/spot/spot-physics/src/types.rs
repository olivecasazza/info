/// 45-dimensional observation vector matching the training environment layout:
/// [body_ang_vel(3), projected_gravity(3), joint_pos_offset(12), joint_vel(12), prev_action(12), command(3)]
#[derive(Clone, Debug)]
pub struct Observation {
    /// Body angular velocity in body frame (3).
    pub body_angular_velocity: [f32; 3],
    /// Projected gravity vector in body frame (3).
    pub projected_gravity: [f32; 3],
    /// Joint positions as offsets from default angles (12).
    pub joint_positions: [f32; 12],
    /// Joint velocities (12).
    pub joint_velocities: [f32; 12],
    /// Previous action offsets (12).
    pub previous_action: [f32; 12],
    /// Command [vx, vy, yaw_rate] (3).
    pub command: [f32; 3],
}

impl Observation {
    /// Total observation dimension.
    pub const SIZE: usize = 45;

    /// Flatten to a Vec<f32> in canonical training order.
    pub fn to_vec(&self) -> Vec<f32> {
        let mut v = Vec::with_capacity(Self::SIZE);
        v.extend_from_slice(&self.body_angular_velocity);
        v.extend_from_slice(&self.projected_gravity);
        v.extend_from_slice(&self.joint_positions);
        v.extend_from_slice(&self.joint_velocities);
        v.extend_from_slice(&self.previous_action);
        v.extend_from_slice(&self.command);
        v
    }
}

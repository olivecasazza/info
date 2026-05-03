/// 60-dimensional observation vector matching the training environment layout:
/// [body_ang_vel(3), body_lin_vel(3), projected_gravity(3),
///  joint_pos_offset(12), joint_vel(12), prev_action(12), command(3),
///  foot_contacts(4), obstacle_distances(8)]
///
/// Was 45 dims before adding foot contacts, body linear velocity, and the
/// forward obstacle ray cone. Bumped because:
///   - foot_contacts: the reward function used them but the policy couldn't
///     see them, making timing-aware gait impossible to learn.
///   - body_linear_velocity: reward tracks command vx/vy/yaw, but the policy
///     only had angular velocity, so it had to integrate joint state to
///     guess its own forward velocity.
///   - obstacle_distances: forward cone of 8 ray distances. Required for
///     terrain/path-planning behaviors and, paired with charge data, for
///     foraging.
#[derive(Clone, Debug)]
pub struct Observation {
    /// Body angular velocity in body frame (3).
    pub body_angular_velocity: [f32; 3],
    /// Body linear velocity in body frame (3).
    pub body_linear_velocity: [f32; 3],
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
    /// Per-foot contact flags in FL, FR, BL, BR order, 0.0 or 1.0 (4).
    pub foot_contacts: [f32; 4],
    /// Forward obstacle ray distances. NUM_OBSTACLE_RAYS rays evenly spread
    /// across SIGHT_CONE_HALF_ANGLE; rays with no hit clamp to the maximum
    /// range so the input distribution is bounded.
    pub obstacle_distances: [f32; 8],
    /// Per-joint torque applied last step (proprioceptive feedback). Same
    /// JOINT_NAMES order as positions/velocities. Required for the policy to
    /// reason about contact reactions and motor saturation — without it the
    /// policy is force-blind and learns timing-only gait. (12)
    pub joint_torques: [f32; 12],
    /// Count of non-foot body parts currently in contact with the
    /// environment, divided by 8 to keep the obs in a sensible range.
    /// Non-zero means the robot is scraping or tipping; the reward already
    /// penalizes this via get_body_collision_count, but the policy was blind
    /// to the signal until now. (1)
    pub body_contact_count: f32,
}

impl Observation {
    /// Total observation dimension.
    pub const SIZE: usize = 73;

    /// Flatten to a Vec<f32> in canonical training order.
    pub fn to_vec(&self) -> Vec<f32> {
        let mut v = Vec::with_capacity(Self::SIZE);
        v.extend_from_slice(&self.body_angular_velocity);
        v.extend_from_slice(&self.body_linear_velocity);
        v.extend_from_slice(&self.projected_gravity);
        v.extend_from_slice(&self.joint_positions);
        v.extend_from_slice(&self.joint_velocities);
        v.extend_from_slice(&self.previous_action);
        v.extend_from_slice(&self.command);
        v.extend_from_slice(&self.foot_contacts);
        v.extend_from_slice(&self.obstacle_distances);
        v.extend_from_slice(&self.joint_torques);
        v.push(self.body_contact_count);
        v
    }
}

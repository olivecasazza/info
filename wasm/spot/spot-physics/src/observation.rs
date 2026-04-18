use nalgebra as na;

use crate::physics::PhysicsWorld;
use crate::types::Observation;

/// Collect a 45D observation from the current physics state.
///
/// This matches the training environment layout exactly (Y-up Rapier frame,
/// no coordinate remapping). The `previous_action` and `command` are passed
/// in by the caller since the shared PhysicsWorld does not track control state.
pub fn collect_observation(
    world: &PhysicsWorld,
    previous_action: &[f32; 12],
    command: &[f32; 3],
) -> Observation {
    let base_handle = world.link_map.get("base_link").copied();
    let (base_rot, base_angvel) = if let Some(handle) = base_handle {
        if let Some(body) = world.rigid_body_set.get(handle) {
            (*body.rotation(), *body.angvel())
        } else {
            (na::UnitQuaternion::identity(), na::Vector3::zeros())
        }
    } else {
        (na::UnitQuaternion::identity(), na::Vector3::zeros())
    };

    // Body angular velocity in body frame (Y-up, no remap)
    let body_angvel = base_rot.inverse() * base_angvel;

    // Projected gravity in body frame
    let world_gravity = na::Vector3::new(0.0, -1.0, 0.0);
    let body_gravity = base_rot.inverse() * world_gravity;

    // Joint positions and velocities
    let joint_pos_vec = world.get_joint_positions();
    let joint_vel_vec = world.get_joint_velocities();

    let mut joint_positions = [0.0f32; 12];
    let mut joint_velocities = [0.0f32; 12];
    for i in 0..12 {
        joint_positions[i] = joint_pos_vec[i];
        joint_velocities[i] = joint_vel_vec[i];
    }

    Observation {
        body_angular_velocity: [body_angvel.x, body_angvel.y, body_angvel.z],
        projected_gravity: [body_gravity.x, body_gravity.y, body_gravity.z],
        joint_positions,
        joint_velocities,
        previous_action: *previous_action,
        command: *command,
    }
}

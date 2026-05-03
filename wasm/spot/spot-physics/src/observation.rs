use nalgebra as na;

use crate::physics::PhysicsWorld;
use crate::types::Observation;

/// Collect a 60D observation from the current physics state.
///
/// Layout matches Observation::to_vec — see types.rs. previous_action and
/// command are passed in by the caller since the shared PhysicsWorld does
/// not track control state.
pub fn collect_observation(
    world: &PhysicsWorld,
    previous_action: &[f32; 12],
    command: &[f32; 3],
) -> Observation {
    let base_handle = world.link_map.get("base_link").copied();
    let (base_rot, base_angvel, base_linvel) = if let Some(handle) = base_handle {
        if let Some(body) = world.rigid_body_set.get(handle) {
            (*body.rotation(), *body.angvel(), *body.linvel())
        } else {
            (
                na::UnitQuaternion::identity(),
                na::Vector3::zeros(),
                na::Vector3::zeros(),
            )
        }
    } else {
        (
            na::UnitQuaternion::identity(),
            na::Vector3::zeros(),
            na::Vector3::zeros(),
        )
    };

    // Body angular + linear velocity in body frame (Y-up, no remap)
    let body_angvel = base_rot.inverse() * base_angvel;
    let body_linvel = base_rot.inverse() * base_linvel;

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

    // Foot contacts as 0/1 floats (FL, FR, BL, BR)
    let contacts = world.get_foot_contacts();
    let foot_contacts = [
        if contacts[0] { 1.0 } else { 0.0 },
        if contacts[1] { 1.0 } else { 0.0 },
        if contacts[2] { 1.0 } else { 0.0 },
        if contacts[3] { 1.0 } else { 0.0 },
    ];

    // Forward obstacle ray cone — 8 ray distances, base_link as origin,
    // forward = base's local +X rotated to world frame. Hits clamped to
    // OBSTACLE_RAY_MAX_RANGE so input distribution is bounded.
    let base_pos = if let Some(handle) = base_handle {
        if let Some(body) = world.rigid_body_set.get(handle) {
            let t = body.position().translation;
            [t.x, t.y, t.z]
        } else {
            [0.0, 0.45, 0.0]
        }
    } else {
        [0.0, 0.45, 0.0]
    };
    let fwd_world = base_rot * na::Vector3::x();
    let fwd_arr = [fwd_world.x, fwd_world.y, fwd_world.z];
    let mut obstacle_distances = [0.0f32; 8];
    let dists = world.cast_obstacle_cone(base_pos, fwd_arr);
    for (i, d) in dists.iter().enumerate().take(8) {
        obstacle_distances[i] = *d;
    }

    Observation {
        body_angular_velocity: [body_angvel.x, body_angvel.y, body_angvel.z],
        body_linear_velocity: [body_linvel.x, body_linvel.y, body_linvel.z],
        projected_gravity: [body_gravity.x, body_gravity.y, body_gravity.z],
        joint_positions,
        joint_velocities,
        previous_action: *previous_action,
        command: *command,
        foot_contacts,
        obstacle_distances,
    }
}

/// Collect a 12D foraging observation:
/// [energy, energy_change, nearest_dx, nearest_dy, nearest_dz, nearest_charge,
///  2nd_dx, 2nd_dy, 2nd_dz, 2nd_charge, sight_total_charge, sight_avg_dist]
pub fn collect_foraging_observation(
    world: &PhysicsWorld,
    base_pos: [f32; 3],
    base_forward: [f32; 3],
    energy: f32,
    prev_energy: f32,
) -> [f32; 12] {
    let energy_change = energy - prev_energy;

    // Find the two nearest batteries by distance
    let mut dists: Vec<(usize, f32)> = world
        .batteries
        .iter()
        .enumerate()
        .map(|(i, b)| {
            let dx = b.position[0] - base_pos[0];
            let dy = b.position[1] - base_pos[1];
            let dz = b.position[2] - base_pos[2];
            (i, (dx * dx + dy * dy + dz * dz).sqrt())
        })
        .collect();
    dists.sort_by(|a, b| a.1.partial_cmp(&b.1).unwrap_or(std::cmp::Ordering::Equal));

    let (n1_dx, n1_dy, n1_dz, n1_charge) = if let Some(&(idx, _)) = dists.first() {
        let b = &world.batteries[idx];
        (
            b.position[0] - base_pos[0],
            b.position[1] - base_pos[1],
            b.position[2] - base_pos[2],
            b.charge,
        )
    } else {
        (0.0, 0.0, 0.0, 0.0)
    };

    let (n2_dx, n2_dy, n2_dz, n2_charge) = if let Some(&(idx, _)) = dists.get(1) {
        let b = &world.batteries[idx];
        (
            b.position[0] - base_pos[0],
            b.position[1] - base_pos[1],
            b.position[2] - base_pos[2],
            b.charge,
        )
    } else {
        (0.0, 0.0, 0.0, 0.0)
    };

    // Sight cone summary
    let (sight_total_charge, sight_avg_dist) = world.cast_sight_cone(base_pos, base_forward);

    [
        energy,
        energy_change,
        n1_dx,
        n1_dy,
        n1_dz,
        n1_charge,
        n2_dx,
        n2_dy,
        n2_dz,
        n2_charge,
        sight_total_charge,
        sight_avg_dist,
    ]
}

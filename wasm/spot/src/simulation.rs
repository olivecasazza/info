//! Simulation step for Spot robot.
//!
//! Runs physics and ML controller updates.

use bevy::prelude::*;

use crate::web_bevy::SpotState;

/// Run physics simulation step and ML controller
pub fn physics_step(mut state: ResMut<SpotState>) {
    let dt = 1.0 / 60.0;

    // Copy command to avoid borrow conflict
    let cmd = state.target_command.clone();
    state.controller.update_command(cmd, 0.1);

    // Get base body handle for gravity observation
    let base_handle = state.physics.link_map.get("base_link").copied();

    // Destructure state to allow split borrowing
    let SpotState { physics, controller, .. } = &mut *state;

    // Run ML controller
    controller.update(
        &mut physics.multibody_joint_set,
        &physics.rigid_body_set,
        base_handle,
        dt,
    );

    physics.step();
}

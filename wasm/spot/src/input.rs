//! Input handling for Spot robot simulation.
//!
//! Keyboard controls for robot movement commands.

use bevy::prelude::*;

use crate::ml::UserCommand;
use crate::web_bevy::SpotState;

/// Handle keyboard input for robot movement
pub fn keyboard_input(
    mut state: ResMut<SpotState>,
    keyboard: Res<ButtonInput<KeyCode>>,
) {
    // Toggle UI
    if keyboard.just_pressed(KeyCode::Tab) {
        state.ui_visible = !state.ui_visible;
    }

    // Movement commands
    let mut cmd = UserCommand::new();
    if keyboard.pressed(KeyCode::KeyW) { cmd.vel_x = 1.0; }
    if keyboard.pressed(KeyCode::KeyS) { cmd.vel_x = -1.0; }
    if keyboard.pressed(KeyCode::KeyA) { cmd.yaw_rate = 1.0; }
    if keyboard.pressed(KeyCode::KeyD) { cmd.yaw_rate = -1.0; }
    if keyboard.pressed(KeyCode::KeyQ) { cmd.vel_y = 1.0; }
    if keyboard.pressed(KeyCode::KeyE) { cmd.vel_y = -1.0; }

    state.target_command = cmd;
}

//! Input handling for Spot robot simulation.
//!
//! Keyboard controls for robot movement commands.

use bevy::prelude::*;
use std::sync::Mutex;
use std::sync::LazyLock;

use crate::ml::UserCommand;
use crate::web_bevy::SpotState;

// Global command state written to by JS (WebHandle) and read by Bevy system
pub static JS_COMMAND: LazyLock<Mutex<UserCommand>> = LazyLock::new(|| Mutex::new(UserCommand::new()));

/// Handle keyboard input and external agent commands for robot movement
pub fn keyboard_input(
    mut state: ResMut<SpotState>,
    keyboard: Res<ButtonInput<KeyCode>>,
) {
    let mut cmd = UserCommand::new();
    let mut active = false;

    // Standard WASD + QE + Arrows
    if keyboard.pressed(KeyCode::KeyW) || keyboard.pressed(KeyCode::ArrowUp) { cmd.vel_x = 1.0; active = true; }
    if keyboard.pressed(KeyCode::KeyS) || keyboard.pressed(KeyCode::ArrowDown) { cmd.vel_x = -1.0; active = true; }
    if keyboard.pressed(KeyCode::KeyA) || keyboard.pressed(KeyCode::ArrowLeft) { cmd.yaw_rate = 1.0; active = true; }
    if keyboard.pressed(KeyCode::KeyD) || keyboard.pressed(KeyCode::ArrowRight) { cmd.yaw_rate = -1.0; active = true; }
    if keyboard.pressed(KeyCode::KeyQ) { cmd.vel_y = 1.0; active = true; }
    if keyboard.pressed(KeyCode::KeyE) { cmd.vel_y = -1.0; active = true; }

    // External agent commands
    let js_cmd = JS_COMMAND.lock().unwrap();
    if js_cmd.vel_x.abs() > 0.01 || js_cmd.vel_y.abs() > 0.01 || js_cmd.yaw_rate.abs() > 0.01 {
        cmd.vel_x = js_cmd.vel_x;
        cmd.vel_y = js_cmd.vel_y;
        cmd.yaw_rate = js_cmd.yaw_rate;
        active = true;
    }

    if active {
        state.target_command.lerp(&cmd, 0.1);
    } else {
        state.target_command.lerp(&UserCommand::new(), 0.1);
    }
}

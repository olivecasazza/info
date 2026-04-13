//! Camera systems for Spot robot simulation.
//!
//! Provides orbit camera with mouse controls.

use bevy::prelude::*;

/// Main camera marker.
#[derive(Component)]
pub struct MainCamera;

/// Camera orbit state.
#[derive(Resource)]
pub struct CameraOrbit {
    pub target: Vec3,
    pub distance: f32,
    pub yaw: f32,
    pub pitch: f32,
    pub following: bool,
}

impl Default for CameraOrbit {
    fn default() -> Self {
        Self {
            target: Vec3::ZERO,
            distance: 2.5,
            yaw: 45.0_f32.to_radians(),
            pitch: 30.0_f32.to_radians(),
            following: true,
        }
    }
}

/// Handle camera mouse input: drag to orbit, shift+drag to pan, scroll to zoom
pub fn camera_input(
    mut orbit: ResMut<CameraOrbit>,
    mouse_button: Res<ButtonInput<MouseButton>>,
    keyboard: Res<ButtonInput<KeyCode>>,
    mut mouse_motion: EventReader<bevy::input::mouse::MouseMotion>,
    mut mouse_wheel: EventReader<bevy::input::mouse::MouseWheel>,
) {
    let shift_held = keyboard.pressed(KeyCode::ShiftLeft) || keyboard.pressed(KeyCode::ShiftRight);

    // Handle mouse drag
    if mouse_button.pressed(MouseButton::Left) || mouse_button.pressed(MouseButton::Middle) {
        for ev in mouse_motion.read() {
            let sensitivity = 0.005;
            if shift_held || mouse_button.pressed(MouseButton::Middle) {
                // Pan mode: Shift+Drag or Middle Mouse
                let distance = orbit.distance;
                let yaw = orbit.yaw;
                let right = Vec3::new(yaw.cos(), 0.0, -yaw.sin());
                let up = Vec3::Y;
                orbit.target -= right * ev.delta.x * sensitivity * distance;
                orbit.target += up * ev.delta.y * sensitivity * distance;
            } else {
                // Orbit mode: Regular drag
                orbit.yaw -= ev.delta.x * sensitivity;
                orbit.pitch += ev.delta.y * sensitivity;
                // Clamp pitch to avoid gimbal lock
                orbit.pitch = orbit.pitch.clamp(-1.4, 1.4);
            }
        }
    } else {
        // Clear events when not dragging
        mouse_motion.clear();
    }

    // Handle scroll zoom
    for ev in mouse_wheel.read() {
        let zoom_sensitivity = 0.1;
        orbit.distance -= ev.y * zoom_sensitivity;
        orbit.distance = orbit.distance.clamp(0.5, 20.0);
    }
}

/// Update camera to follow robot and apply orbit parameters
pub fn camera_follow(
    orbit: Res<CameraOrbit>,
    mut camera_query: Query<&mut Transform, With<MainCamera>>,
) {
    // Compute camera position from orbit
    let mut pos = orbit.target + Vec3::new(
        orbit.distance * orbit.yaw.sin() * orbit.pitch.cos(),
        orbit.distance * orbit.pitch.sin(),
        orbit.distance * orbit.yaw.cos() * orbit.pitch.cos(),
    );

    // Prevent camera from going under the terrain
    // Minimum height is 1.0m above ground (Y=0 is physics ground level)
    const MIN_CAMERA_HEIGHT: f32 = 1.0;
    if pos.y < MIN_CAMERA_HEIGHT {
        pos.y = MIN_CAMERA_HEIGHT;
    }

    if let Ok(mut camera_transform) = camera_query.get_single_mut() {
        *camera_transform = Transform::from_translation(pos).looking_at(orbit.target, Vec3::Y);
    }
}

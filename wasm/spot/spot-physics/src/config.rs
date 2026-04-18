use std::collections::HashMap;

/// Joint names in canonical training order (FL, FR, BL, BR legs, 3 joints each).
pub const JOINT_NAMES: [&str; 12] = [
    "motor_front_left_hip",
    "motor_front_left_upper_leg",
    "motor_front_left_lower_leg",
    "motor_front_right_hip",
    "motor_front_right_upper_leg",
    "motor_front_right_lower_leg",
    "motor_back_left_hip",
    "motor_back_left_upper_leg",
    "motor_back_left_lower_leg",
    "motor_back_right_hip",
    "motor_back_right_upper_leg",
    "motor_back_right_lower_leg",
];

/// Foot link names for contact detection.
pub const FOOT_LINKS: [&str; 4] = [
    "front_left_lower_leg",
    "front_right_lower_leg",
    "back_left_lower_leg",
    "back_right_lower_leg",
];

/// Default standing joint angles: [hip, upper, lower] x 4 legs.
pub const DEFAULT_JOINT_ANGLES: [f32; 12] = [
    0.0, 0.6, -1.2, // front left
    0.0, 0.6, -1.2, // front right
    0.0, 0.6, -1.2, // back left
    0.0, 0.6, -1.2, // back right
];

/// Action offset limit (radians) per joint per step.
pub const ACTION_LIMIT: f32 = 0.25;

// PD gains matching PyBullet: KP=1.5, KD=0.3
// PyBullet POSITION_CONTROL: torque = KD * (KP * pos_error - vel)
// Rapier spring-damper: torque = stiffness * pos_error - damping * vel
// stiffness = KP * KD = 0.45, damping = KD = 0.3
pub const STIFFNESS: f32 = 0.45;
pub const DAMPING: f32 = 0.3;
pub const MAX_FORCE: f32 = 200.0;

/// Physics timestep: 200Hz (matches PyBullet training).
pub const PHYSICS_DT: f32 = 1.0 / 200.0;

/// Policy runs every DECIMATION physics steps (200/4 = 50Hz policy).
pub const DECIMATION: usize = 4;

/// Density for URDF link colliders (kg/m^3).
pub const DENSITY: f32 = 2000.0;

/// Robot spawn height (Y coordinate).
pub const SPAWN_HEIGHT: f32 = 0.45;

/// Build a HashMap of joint name -> default angle from the canonical arrays.
pub fn default_angles_map() -> HashMap<String, f32> {
    JOINT_NAMES
        .iter()
        .enumerate()
        .map(|(i, name)| (name.to_string(), DEFAULT_JOINT_ANGLES[i]))
        .collect()
}

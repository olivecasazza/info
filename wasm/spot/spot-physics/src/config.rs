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

// PD gains for joint position control. Rapier joint motor uses
// `torque = stiffness * (target - pos) - damping * vel`, both N·m·rad^-1.
//
// Previous values (STIFFNESS=0.45, DAMPING=0.3) were derived from a wrong
// translation of PyBullet's positionGain/velocityGain (`stiffness = KP * KD`
// is dimensionally nonsensical; KP and stiffness share units). At those
// gains the actuators behave like rubber bands — even max torque can't drive
// the legs to commanded poses, so PPO never converges to a walking gait
// regardless of reward shaping.
//
// Current values match published legged-RL configs:
//   - legged_gym ANYmal/Spot: stiffness ≈ 80, damping ≈ 2
//   - ETH ANYmal-D papers:    stiffness 40–80 N·m/rad
//
// Any policy trained at the old gains is invalidated by this change; expect
// the robot to thrash on first replay until a fresh training run lands.
pub const STIFFNESS: f32 = 40.0;
pub const DAMPING: f32 = 2.0;
pub const MAX_FORCE: f32 = 200.0;

/// Physics timestep: 200Hz (matches PyBullet training).
pub const PHYSICS_DT: f32 = 1.0 / 200.0;

/// Policy runs every DECIMATION physics steps (200/4 = 50Hz policy).
pub const DECIMATION: usize = 4;

/// Density for URDF link colliders (kg/m^3).
pub const DENSITY: f32 = 2000.0;

/// Robot spawn height (Y coordinate).
pub const SPAWN_HEIGHT: f32 = 0.45;

// ---------------------------------------------------------------------------
// Energy system
// ---------------------------------------------------------------------------

pub const ENERGY_MAX: f32 = 1.0;
pub const ENERGY_START: f32 = 0.8;
pub const ENERGY_THRESHOLD: f32 = 0.2;
pub const ENERGY_REGEN: f32 = 0.0005;
pub const ENERGY_DECAY_ACTIVE: f32 = 0.002;
pub const ENERGY_DECAY_IDLE: f32 = 0.0005;
pub const BATTERY_COLLECT_RADIUS: f32 = 0.2;
pub const SIGHT_CONE_HALF_ANGLE: f32 = 1.047; // 60 degrees in radians
pub const SIGHT_CONE_RANGE: f32 = 3.0;
pub const NUM_SIGHT_RAYS: usize = 8;
pub const FORAGING_OBS_SIZE: usize = 12;

/// Forward obstacle-detection cone exposed to the policy via Observation
/// for non-foraging behaviors (path planning, walk, terrain). NUM_OBSTACLE_RAYS
/// must equal Observation::obstacle_distances.len().
pub const NUM_OBSTACLE_RAYS: usize = 8;
pub const OBSTACLE_CONE_HALF_ANGLE: f32 = 1.047; // 60° (matches SIGHT_CONE_HALF_ANGLE)
pub const OBSTACLE_RAY_MAX_RANGE: f32 = 3.0;

/// Build a HashMap of joint name -> default angle from the canonical arrays.
pub fn default_angles_map() -> HashMap<String, f32> {
    JOINT_NAMES
        .iter()
        .enumerate()
        .map(|(i, name)| (name.to_string(), DEFAULT_JOINT_ANGLES[i]))
        .collect()
}

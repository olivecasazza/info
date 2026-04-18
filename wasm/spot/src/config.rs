use std::collections::HashMap;

pub struct SpotConfig;

impl SpotConfig {
    // Physical Properties (from spot-physics)
    pub const DENSITY: f32 = spot_physics::config::DENSITY;

    // Motor Parameters (from spot-physics)
    pub const STIFFNESS_END: f32 = spot_physics::config::STIFFNESS; // KP * KD = 0.45
    pub const DAMPING: f32 = spot_physics::config::DAMPING; // KD = 0.3
    pub const MAX_FORCE: f32 = spot_physics::config::MAX_FORCE;

    // WASM-specific motor ramp parameters
    pub const STIFFNESS_START: f32 = 0.2;
    pub const STIFFNESS_HIP: f32 = 0.45;
    pub const STIFFNESS_KNEE: f32 = 0.45;
    pub const DAMPING_SPRINGY: f32 = 0.3;
    pub const RAMP_DURATION: f32 = 1.0;

    // WASM simulation parameters
    pub const DT: f32 = 1.0 / 60.0;
    pub const PHYSICS_SUBSTEPS: usize = 4;
    pub const SOLVER_ITERATIONS: usize = 10;

    // Action offset limit (radians) - must match training
    pub const ACTION_OFFSET_LIMIT: f32 = spot_physics::config::ACTION_LIMIT;

    // Default Joint Angles (from spot-physics)
    pub const DEFAULT_JOINT_ANGLES: [f32; 12] = spot_physics::config::DEFAULT_JOINT_ANGLES;

    pub fn default_angles() -> HashMap<String, f32> {
        spot_physics::config::default_angles_map()
    }
}

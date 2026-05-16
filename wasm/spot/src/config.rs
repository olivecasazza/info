use std::collections::HashMap;

pub struct SpotConfig;

impl SpotConfig {
    // Physical Properties (from spot-physics)
    pub const DENSITY: f32 = spot_physics::config::DENSITY;

    // Motor Parameters — WASM uses higher gains than training for visual response
    pub const STIFFNESS_END: f32 = 15.0;
    pub const DAMPING: f32 = 2.0;
    pub const MAX_FORCE: f32 = spot_physics::config::MAX_FORCE;

    // WASM motor parameters — higher than training (0.45) so the robot
    // can visibly hold its pose. The policy still outputs the same actions,
    // but the motors are strong enough to execute them against gravity.
    // Training uses stiffness=0.45 at 200Hz; WASM needs ~30x more because
    // the robot density (2000) creates high gravitational torques.
    pub const STIFFNESS_START: f32 = 5.0;
    pub const STIFFNESS_HIP: f32 = 15.0;
    pub const STIFFNESS_KNEE: f32 = 15.0;
    pub const DAMPING_SPRINGY: f32 = 2.0;
    pub const RAMP_DURATION: f32 = 0.5;

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

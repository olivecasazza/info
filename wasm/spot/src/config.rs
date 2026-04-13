use std::collections::HashMap;

pub struct SpotConfig;

impl SpotConfig {
    // Physical Properties
    pub const DENSITY: f32 = 2000.0;

    // Motor Parameters - MUST MATCH TRAINING (spot_env.py)
    // Training: KP=1.5, KD=0.3, MAX_FORCE=200
    // Rapier stiffness/damping map differently, scale for equivalent behavior
    pub const STIFFNESS_START: f32 = 100.0;  // Soft start
    pub const STIFFNESS_END: f32 = 1500.0;   // Match training KP=1.5 (scaled)

    pub const STIFFNESS_HIP: f32 = 1500.0;
    pub const STIFFNESS_KNEE: f32 = 1500.0;
    pub const DAMPING_SPRINGY: f32 = 300.0;  // Match training KD=0.3 (scaled)

    pub const DAMPING: f32 = 300.0;
    pub const MAX_FORCE: f32 = 200.0;        // Match training MAX_FORCE=200
    pub const RAMP_DURATION: f32 = 1.0;

    // Simulation Parameters
    // Training runs at 200Hz physics / 50Hz policy (decimation=4)
    // WASM runs at 60fps; we substep to approximate 200Hz
    pub const DT: f32 = 1.0 / 60.0;
    pub const PHYSICS_SUBSTEPS: usize = 4;   // ~240Hz effective physics
    pub const SOLVER_ITERATIONS: usize = 10; // Match training numSolverIterations=10

    // Action offset limit (radians) - must match training
    pub const ACTION_OFFSET_LIMIT: f32 = 0.5;

    // Default Joint Angles (Standing Pose) - MUST MATCH TRAINING
    // Training: [0.0, 0.6, -1.2] for all 4 legs (no hip splay)
    pub fn default_angles() -> HashMap<String, f32> {
        let mut angles = HashMap::new();

        let hip_angle = 0.0;   // No splay - matches training
        let leg_upper = 0.6;   // Matches training
        let leg_lower = -1.2;  // Matches training

        let joints = [
            ("motor_front_left_hip", hip_angle),
            ("motor_back_left_hip", hip_angle),
            ("motor_front_right_hip", hip_angle),
            ("motor_back_right_hip", hip_angle),

            ("motor_front_left_upper_leg", leg_upper),
            ("motor_back_left_upper_leg", leg_upper),
            ("motor_front_right_upper_leg", leg_upper),
            ("motor_back_right_upper_leg", leg_upper),

            ("motor_front_left_lower_leg", leg_lower),
            ("motor_back_left_lower_leg", leg_lower),
            ("motor_front_right_lower_leg", leg_lower),
            ("motor_back_right_lower_leg", leg_lower),
        ];

        for (name, angle) in joints.iter() {
            angles.insert(name.to_string(), *angle);
        }

        angles
    }

    // Default angles as flat array matching training joint order:
    // FL(hip,upper,lower), FR(hip,upper,lower), BL(hip,upper,lower), BR(hip,upper,lower)
    pub const DEFAULT_JOINT_ANGLES: [f32; 12] = [
        0.0, 0.6, -1.2,   // front left
        0.0, 0.6, -1.2,   // front right
        0.0, 0.6, -1.2,   // back left
        0.0, 0.6, -1.2,   // back right
    ];
}

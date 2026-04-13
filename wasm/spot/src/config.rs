use std::collections::HashMap;

pub struct SpotConfig;

impl SpotConfig {
    // Physical Properties
    pub const DENSITY: f32 = 2000.0;

    // Motor Parameters
    // Rapier stiffness/damping are spring constants (N·m/rad and N·m·s/rad).
    // At 60Hz, high stiffness causes numerical oscillation (vibrating joints).
    // Rule of thumb: stiffness < 1/(4*dt^2*mass) for stability.
    // With dt=1/60 and leg mass ~0.5kg, max stable stiffness ~1800.
    // But for smooth motion, use much lower values with adequate damping.
    //
    // These values are tuned for Rapier at 60Hz, NOT a direct mapping from
    // PyBullet's dimensionless PD gains (KP=1.5, KD=0.3).
    pub const STIFFNESS_START: f32 = 20.0;   // Soft start
    pub const STIFFNESS_END: f32 = 80.0;     // Target stiffness (smooth, no vibration)

    pub const STIFFNESS_HIP: f32 = 80.0;
    pub const STIFFNESS_KNEE: f32 = 80.0;
    pub const DAMPING_SPRINGY: f32 = 8.0;    // Near critical damping for these inertias

    pub const DAMPING: f32 = 8.0;
    pub const MAX_FORCE: f32 = 50.0;         // Reduced to prevent violent snapping
    pub const RAMP_DURATION: f32 = 2.0;      // Slower ramp for stability

    // Simulation Parameters
    pub const DT: f32 = 1.0 / 60.0;
    pub const SOLVER_ITERATIONS: usize = 10;

    // Action offset limit (radians) - must match training (legged_gym default)
    pub const ACTION_OFFSET_LIMIT: f32 = 0.25;

    // Default Joint Angles (Standing Pose) - MUST MATCH TRAINING
    // Training: [0.0, 0.6, -1.2] for all 4 legs (no hip splay)
    pub fn default_angles() -> HashMap<String, f32> {
        let mut angles = HashMap::new();

        let hip_angle = 0.0;
        let leg_upper = 0.6;
        let leg_lower = -1.2;

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

    // Default angles as flat array matching training joint order
    pub const DEFAULT_JOINT_ANGLES: [f32; 12] = [
        0.0, 0.6, -1.2,   // front left
        0.0, 0.6, -1.2,   // front right
        0.0, 0.6, -1.2,   // back left
        0.0, 0.6, -1.2,   // back right
    ];
}

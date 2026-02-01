use std::collections::HashMap;

pub struct SpotConfig;

impl SpotConfig {
    // Physical Properties
    pub const DENSITY: f32 = 2000.0; // Uniform density for stability

    // Motor Parameters - MUST MATCH TRAINING (PyBullet)
    // Training uses: positionGain=0.3, velocityGain=0.1, force=100
    // Rapier uses stiffness/damping differently, so we scale appropriately
    pub const STIFFNESS_START: f32 = 100.0;  // Soft start
    pub const STIFFNESS_END: f32 = 300.0;    // Match training P-gain (~0.3 * 1000)

    // Per-joint stiffness - softer to allow policy control
    pub const STIFFNESS_HIP: f32 = 300.0;    // Matching training
    pub const STIFFNESS_KNEE: f32 = 300.0;   // Matching training
    pub const DAMPING_SPRINGY: f32 = 100.0;  // Match training D-gain (~0.1 * 1000)

    pub const DAMPING: f32 = 100.0;
    pub const MAX_FORCE: f32 = 100.0;         // Match training force=100
    pub const RAMP_DURATION: f32 = 1.0;       // Faster ramp to see policy effect

    // Simulation Parameters
    pub const DT: f32 = 1.0 / 120.0;
    pub const SOLVER_ITERATIONS: usize = 60;

    // Default Joint Angles (Standing Pose)
    pub fn default_angles() -> HashMap<String, f32> {
        let mut angles = HashMap::new();

        let hip_angle = 0.5;   // Wide stance for stability
        let leg_upper = 0.7;
        let leg_lower = -1.8;  // Deep crouch

        let joints = [
            ("motor_front_left_hip", hip_angle),
            ("motor_back_left_hip", hip_angle),
            ("motor_front_right_hip", -hip_angle),
            ("motor_back_right_hip", -hip_angle),

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
}

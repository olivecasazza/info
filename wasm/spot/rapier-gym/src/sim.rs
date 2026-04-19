use nalgebra as na;

use spot_physics::config::{
    ACTION_LIMIT, ENERGY_DECAY_ACTIVE, ENERGY_DECAY_IDLE, ENERGY_MAX, ENERGY_REGEN,
    ENERGY_START, ENERGY_THRESHOLD, PHYSICS_DT, STIFFNESS, DAMPING, MAX_FORCE,
};
use spot_physics::config::JOINT_NAMES;
use spot_physics::observation::{collect_observation, collect_foraging_observation};
use spot_physics::physics::PhysicsWorld;

pub use spot_physics::config::DECIMATION;

pub struct RapierSim {
    pub world: PhysicsWorld,

    pub previous_action: [f32; 12],
    pub prev_joint_vel: [f32; 12],
    pub time: f32,
    pub decimation: usize,

    /// Current energy level (0.0 to 1.0).
    pub energy: f32,
    /// Energy level from the previous step (for delta observation).
    pub prev_energy: f32,
    /// Whether this sim is using foraging terrain.
    pub is_foraging: bool,
}

impl RapierSim {
    pub fn new(urdf_content: &str, terrain_type: &str, terrain_seed: u64, terrain_difficulty: f32) -> Self {
        let mut world = PhysicsWorld::new();

        let tt = spot_physics::terrain::TerrainType::from_str(terrain_type);
        let is_foraging = tt == spot_physics::terrain::TerrainType::Foraging;

        if is_foraging {
            // Foraging terrain needs full PhysicsWorld access to populate batteries
            spot_physics::terrain::create_foraging_terrain(&mut world, terrain_seed);
        } else {
            // Create terrain via the unified registry
            let terrain_handles = spot_physics::terrain::create_terrain(
                tt,
                &mut world.rigid_body_set,
                &mut world.collider_set,
                terrain_seed,
                terrain_difficulty,
            );
            world.ground_collider_handle = terrain_handles.first().copied();
        }

        // Load robot
        spot_physics::urdf::load_robot(&mut world, urdf_content);

        // Cache foot link handles
        world.cache_foot_handles();

        RapierSim {
            world,
            previous_action: [0.0; 12],
            prev_joint_vel: [0.0; 12],
            time: 0.0,
            decimation: DECIMATION,
            energy: ENERGY_START,
            prev_energy: ENERGY_START,
            is_foraging,
        }
    }

    pub fn physics_step(&mut self) {
        self.world.step();
        self.time += PHYSICS_DT;

        // Energy update (every physics step)
        if self.is_foraging {
            self.prev_energy = self.energy;

            // Determine active vs idle from action magnitude
            let action_norm: f32 = self
                .previous_action
                .iter()
                .map(|a| a * a)
                .sum::<f32>()
                .sqrt();
            let decay = if action_norm > 0.01 {
                ENERGY_DECAY_ACTIVE
            } else {
                ENERGY_DECAY_IDLE
            };
            self.energy = (self.energy + ENERGY_REGEN - decay).clamp(0.0, ENERGY_MAX);
        }
    }

    pub fn apply_actions(&mut self, actions: &[f32]) {
        self.world.apply_actions(actions);

        let mut new_prev = [0.0f32; 12];
        for i in 0..12 {
            new_prev[i] = actions.get(i).copied().unwrap_or(0.0).clamp(-ACTION_LIMIT, ACTION_LIMIT);
        }
        self.previous_action = new_prev;
    }

    pub fn post_step(&mut self) {
        self.prev_joint_vel = self.get_joint_velocities_array();
    }

    pub fn collect_observation(&self) -> Vec<f32> {
        let command = [0.0f32; 3]; // filled by Python env
        collect_observation(&self.world, &self.previous_action, &command).to_vec()
    }

    pub fn get_base_height(&self) -> f32 {
        self.world.get_base_height()
    }

    pub fn get_base_orientation_rpy(&self) -> Vec<f32> {
        self.world.get_base_orientation_rpy().to_vec()
    }

    pub fn get_base_velocity(&self) -> Vec<f32> {
        self.world.get_base_velocity().to_vec()
    }

    pub fn get_base_angular_velocity(&self) -> Vec<f32> {
        self.world.get_base_angular_velocity().to_vec()
    }

    pub fn get_joint_positions(&self) -> Vec<f32> {
        self.world.get_joint_positions()
    }

    pub fn get_joint_velocities(&self) -> Vec<f32> {
        self.world.get_joint_velocities()
    }

    fn get_joint_velocities_array(&self) -> [f32; 12] {
        let v = self.world.get_joint_velocities();
        let mut arr = [0.0f32; 12];
        for (i, &val) in v.iter().enumerate().take(12) {
            arr[i] = val;
        }
        arr
    }

    pub fn get_joint_torques(&self) -> Vec<f32> {
        self.world.get_joint_torques(&self.previous_action)
    }

    pub fn get_foot_contacts(&self) -> Vec<bool> {
        self.world.get_foot_contacts().to_vec()
    }

    pub fn get_body_collision_count(&self) -> usize {
        self.world.get_body_collision_count()
    }

    pub fn is_fallen(&self) -> bool {
        self.world.is_fallen()
    }

    // -------------------------------------------------------------------
    // Foraging / energy methods
    // -------------------------------------------------------------------

    /// Collect nearby batteries and add their charge to energy.
    pub fn collect_batteries(&mut self) -> f32 {
        let base_pos = self.get_base_pos();
        let charge = self.world.collect_nearby_batteries(base_pos);
        self.energy = (self.energy + charge).min(ENERGY_MAX);
        charge
    }

    /// 12D foraging observation vector.
    pub fn get_foraging_observation(&self) -> Vec<f32> {
        let base_pos = self.get_base_pos();
        let base_forward = self.get_base_forward();
        collect_foraging_observation(
            &self.world,
            base_pos,
            base_forward,
            self.energy,
            self.prev_energy,
        )
        .to_vec()
    }

    pub fn get_energy(&self) -> f32 {
        self.energy
    }

    /// Scale motor stiffness when energy is below threshold.
    /// Must be called AFTER apply_actions so we can override the stiffness.
    pub fn apply_energy_scaling(&mut self) {
        use rapier3d::prelude::JointAxis;
        use spot_physics::config::DEFAULT_JOINT_ANGLES;

        if !self.is_foraging || self.energy >= ENERGY_THRESHOLD {
            return;
        }
        // Linear scale from 1.0 at threshold to 0.0 at zero energy
        let scale = self.energy / ENERGY_THRESHOLD;
        let scaled_stiffness = STIFFNESS * scale;

        for (i, name) in JOINT_NAMES.iter().enumerate() {
            if let Some(&handle) = self.world.joint_map.get(*name) {
                if let Some((multibody, link_id)) =
                    self.world.multibody_joint_set.get_mut(handle)
                {
                    if let Some(link) = multibody.link_mut(link_id) {
                        // Re-apply target with scaled stiffness
                        let target = DEFAULT_JOINT_ANGLES[i]
                            + self.previous_action[i].clamp(-ACTION_LIMIT, ACTION_LIMIT);
                        link.joint.data.set_motor_position(
                            JointAxis::AngX,
                            target,
                            scaled_stiffness,
                            DAMPING,
                        );
                        link.joint
                            .data
                            .set_motor_max_force(JointAxis::AngX, MAX_FORCE);
                    }
                }
            }
        }
    }

    /// Get base link world position as [x, y, z].
    pub fn get_base_pos(&self) -> [f32; 3] {
        if let Some(&handle) = self.world.link_map.get("base_link") {
            if let Some(body) = self.world.rigid_body_set.get(handle) {
                let t = body.position().translation;
                return [t.x, t.y, t.z];
            }
        }
        [0.0, 0.0, 0.0]
    }

    /// Get base link forward direction (local +X rotated to world frame).
    pub fn get_base_forward(&self) -> [f32; 3] {
        if let Some(&handle) = self.world.link_map.get("base_link") {
            if let Some(body) = self.world.rigid_body_set.get(handle) {
                let fwd = body.rotation() * na::Vector3::x();
                return [fwd.x, fwd.y, fwd.z];
            }
        }
        [1.0, 0.0, 0.0]
    }
}

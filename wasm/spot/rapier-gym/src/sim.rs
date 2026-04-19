use spot_physics::config::{ACTION_LIMIT, PHYSICS_DT};
use spot_physics::observation::collect_observation;
use spot_physics::physics::PhysicsWorld;

pub use spot_physics::config::DECIMATION;

pub struct RapierSim {
    pub world: PhysicsWorld,

    pub previous_action: [f32; 12],
    pub prev_joint_vel: [f32; 12],
    pub time: f32,
    pub decimation: usize,
}

impl RapierSim {
    pub fn new(urdf_content: &str, terrain_type: &str, terrain_seed: u64, terrain_difficulty: f32) -> Self {
        let mut world = PhysicsWorld::new();

        // Create terrain via the unified registry
        let tt = spot_physics::terrain::TerrainType::from_str(terrain_type);
        let terrain_handles = spot_physics::terrain::create_terrain(
            tt,
            &mut world.rigid_body_set,
            &mut world.collider_set,
            terrain_seed,
            terrain_difficulty,
        );
        world.ground_collider_handle = terrain_handles.first().copied();

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
        }
    }

    pub fn physics_step(&mut self) {
        self.world.step();
        self.time += PHYSICS_DT;
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
}

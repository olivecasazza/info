use rapier3d::prelude::*;


pub struct PhysicsWorld {
    pub rigid_body_set: RigidBodySet,
    pub collider_set: ColliderSet,
    pub impulse_joint_set: ImpulseJointSet,
    pub multibody_joint_set: MultibodyJointSet,
    pub gravity: Vector<f32>,
    pub integration_parameters: IntegrationParameters,
    pub physics_pipeline: PhysicsPipeline,
    pub island_manager: IslandManager,
    pub broad_phase: DefaultBroadPhase,
    pub narrow_phase: NarrowPhase,
    pub ccd_solver: CCDSolver,
    pub query_pipeline: QueryPipeline,

    // Map link names to RigidBodyHandles for rendering sync
    pub link_map: std::collections::HashMap<String, RigidBodyHandle>,
    // Map joint names to MultibodyJointHandles for control
    pub joint_map: std::collections::HashMap<String, MultibodyJointHandle>,
}

impl PhysicsWorld {
    pub fn new() -> Self {
        let mut integration_parameters = IntegrationParameters::default();
        integration_parameters.dt = 1.0 / 120.0;
        integration_parameters.num_solver_iterations = std::num::NonZeroUsize::new(60).unwrap();

        Self {
            rigid_body_set: RigidBodySet::new(),
            collider_set: ColliderSet::new(),
            impulse_joint_set: ImpulseJointSet::new(),
            multibody_joint_set: MultibodyJointSet::new(),
            gravity: vector![0.0, -9.81, 0.0],
            integration_parameters,
            physics_pipeline: PhysicsPipeline::new(),
            island_manager: IslandManager::new(),
            broad_phase: DefaultBroadPhase::new(),
            narrow_phase: NarrowPhase::new(),
            ccd_solver: CCDSolver::new(),
            query_pipeline: QueryPipeline::new(),
            link_map: std::collections::HashMap::new(),
            joint_map: std::collections::HashMap::new(),
        }
    }

    pub fn step(&mut self) {
        self.physics_pipeline.step(
            &self.gravity,
            &self.integration_parameters,
            &mut self.island_manager,
            &mut self.broad_phase,
            &mut self.narrow_phase,
            &mut self.rigid_body_set,
            &mut self.collider_set,
            &mut self.impulse_joint_set,
            &mut self.multibody_joint_set,
            &mut self.ccd_solver,
            Some(&mut self.query_pipeline),
            &(),
            &(),
        );
    }

    pub fn build_robot(&mut self, urdf_content: &str) {
        // 1. Create Ground Plane
        let ground_collider = ColliderBuilder::cuboid(10.0, 0.1, 10.0)
            .translation(vector![0.0, -0.1, 0.0])
            .collision_groups(InteractionGroups::new(Group::GROUP_1, Group::ALL))
            .build();
        self.collider_set.insert(ground_collider);

        // 2. Load Robot
        crate::urdf::UrdfLoader::load_robot(self, urdf_content);
    }
    pub fn get_body_pose(&self, handle: RigidBodyHandle) -> Option<Isometry<f32>> {
        if let Some(body) = self.rigid_body_set.get(handle) {
            return Some(*body.position());
        }
        if let Some(_id) = self.multibody_joint_set.rigid_body_link(handle) {
            // TODO: Implement proper Multibody Pose retrieval
            // We need to access self.multibody_joint_set.get(_id.multibody) -> link(_id.id)
            // But we need to verify the field names for rapier3d 0.22
        }
        None
    }
}

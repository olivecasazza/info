use rapier3d::prelude::*;
use roxmltree::Document;
use nalgebra as na;

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
}

impl PhysicsWorld {
    pub fn new() -> Self {
        Self {
            rigid_body_set: RigidBodySet::new(),
            collider_set: ColliderSet::new(),
            impulse_joint_set: ImpulseJointSet::new(),
            multibody_joint_set: MultibodyJointSet::new(),
            gravity: vector![0.0, -9.81, 0.0],
            integration_parameters: IntegrationParameters::default(),
            physics_pipeline: PhysicsPipeline::new(),
            island_manager: IslandManager::new(),
            broad_phase: DefaultBroadPhase::new(),
            narrow_phase: NarrowPhase::new(),
            ccd_solver: CCDSolver::new(),
            query_pipeline: QueryPipeline::new(),
            link_map: std::collections::HashMap::new(),
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
        let doc = Document::parse(urdf_content).expect("Failed to parse URDF");

        // 1. Create Ground Plane
        let ground_collider = ColliderBuilder::cuboid(10.0, 0.1, 10.0)
            .translation(vector![0.0, -1.0, 0.0])
            .build();
        self.collider_set.insert(ground_collider);

        let mut links: std::collections::HashMap<&str, RigidBodyHandle> = std::collections::HashMap::new();

        // Pass 1: Create RigidBodies
        for node in doc.descendants().filter(|n| n.has_tag_name("link")) {
            if let Some(name) = node.attribute("name") {
                let rb = RigidBodyBuilder::dynamic()
                    .translation(vector![0.0, 2.0, 0.0])
                    .build();
                let handle = self.rigid_body_set.insert(rb);
                links.insert(name, handle);
                self.link_map.insert(name.to_string(), handle);

                if let Some(collision) = node.children().find(|n| n.has_tag_name("collision")) {
                    if let Some(geometry) = collision.children().find(|n| n.has_tag_name("geometry")) {
                        if let Some(box_geom) = geometry.children().find(|n| n.has_tag_name("box")) {
                            if let Some(size_str) = box_geom.attribute("size") {
                                let dims: Vec<f32> = size_str.split_whitespace()
                                    .filter_map(|s| s.parse().ok())
                                    .collect();
                                if dims.len() == 3 {
                                    let collider = ColliderBuilder::cuboid(dims[0]/2.0, dims[1]/2.0, dims[2]/2.0)
                                        .density(1.0)
                                        .build();
                                    self.collider_set.insert_with_parent(collider, handle, &mut self.rigid_body_set);
                                }
                            }
                        }
                    }
                } else {
                     if name == "base_link" {
                         let collider = ColliderBuilder::ball(0.01).build();
                         self.collider_set.insert_with_parent(collider, handle, &mut self.rigid_body_set);
                     }
                }
            }
        }

        // Pass 2: Create Joints
        for node in doc.descendants().filter(|n| n.has_tag_name("joint")) {
            let _name = node.attribute("name").unwrap_or("unknown");
            let type_ = node.attribute("type").unwrap_or("fixed");

            let parent_name = node.children().find(|n| n.has_tag_name("parent"))
                .and_then(|n| n.attribute("link"));
            let child_name = node.children().find(|n| n.has_tag_name("child"))
                .and_then(|n| n.attribute("link"));
            let origin_node = node.children().find(|n| n.has_tag_name("origin"));

            if let (Some(parent), Some(child)) = (parent_name, child_name) {
                if let (Some(&p_handle), Some(&c_handle)) = (links.get(parent), links.get(child)) {

                    let mut xyz = vector![0.0, 0.0, 0.0];
                    let mut rpy = vector![0.0, 0.0, 0.0];

                    if let Some(origin) = origin_node {
                        if let Some(xyz_str) = origin.attribute("xyz") {
                             let v: Vec<f32> = xyz_str.split_whitespace().filter_map(|s| s.parse().ok()).collect();
                             if v.len() == 3 { xyz = vector![v[0], v[1], v[2]]; }
                        }
                        if let Some(rpy_str) = origin.attribute("rpy") {
                             let v: Vec<f32> = rpy_str.split_whitespace().filter_map(|s| s.parse().ok()).collect();
                             if v.len() == 3 { rpy = vector![v[0], v[1], v[2]]; }
                        }
                    }

                    match type_ {
                        "fixed" => {
                            let joint = GenericJointBuilder::new(JointAxesMask::LOCKED_FIXED_AXES)
                                .local_anchor1(xyz.into())
                                .local_frame1(Isometry::from_parts(
                                    Translation::from(xyz),
                                    UnitQuaternion::from_euler_angles(rpy.x, rpy.y, rpy.z)
                                ))
                                .local_frame2(Isometry::identity())
                                .build();
                            self.impulse_joint_set.insert(p_handle, c_handle, joint, true);
                        },
                        "revolute" | "continuous" => {
                            let mut axis = vector![1.0, 0.0, 0.0];
                            if let Some(axis_node) = node.children().find(|n| n.has_tag_name("axis")) {
                                if let Some(xyz_str) = axis_node.attribute("xyz") {
                                    let v: Vec<f32> = xyz_str.split_whitespace().filter_map(|s| s.parse().ok()).collect();
                                    if v.len() == 3 { axis = vector![v[0], v[1], v[2]]; }
                                }
                            }

                            let joint = GenericJointBuilder::new(JointAxesMask::LOCKED_REVOLUTE_AXES)
                                .local_frame1(Isometry::from_parts(
                                    Translation::from(xyz),
                                    UnitQuaternion::from_euler_angles(rpy.x, rpy.y, rpy.z)
                                ))
                                .local_frame2(Isometry::identity())
                                .local_axis1(UnitVector::new_normalize(axis))
                                .local_axis2(UnitVector::new_normalize(axis))
                                .build();
                            self.impulse_joint_set.insert(p_handle, c_handle, joint, true);
                        },
                        _ => {}
                    }
                }
            }
        }
    }
}

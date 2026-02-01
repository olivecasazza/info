use rapier3d::prelude::*;
use roxmltree::Document;
use nalgebra as na;
use crate::physics::PhysicsWorld;
use crate::config::SpotConfig;


pub struct UrdfLoader;

impl UrdfLoader {
    pub fn load_robot(world: &mut PhysicsWorld, urdf_content: &str) {
        let doc = Document::parse(urdf_content).expect("Failed to parse URDF");

        // Data structures for kinematic tree
        let mut links_xml: std::collections::HashMap<&str, roxmltree::Node> = std::collections::HashMap::new();
        let mut joints_xml: std::collections::HashMap<&str, roxmltree::Node> = std::collections::HashMap::new();
        // Stores: (child_link_name, joint_origin_transform, joint_name, joint_axis)
        let mut adjacency: std::collections::HashMap<String, Vec<(String, Isometry<f32>, String, Option<Vector<f32>>)>> = std::collections::HashMap::new();

        // 1. Parse Links and Joints to build graph
        for node in doc.descendants() {
            if node.has_tag_name("link") {
                if let Some(name) = node.attribute("name") {
                    links_xml.insert(name, node);
                }
            } else if node.has_tag_name("joint") {
                if let Some(name) = node.attribute("name") {
                    if node.attribute("type").is_some() {
                        joints_xml.insert(name, node);

                        let mut parent_name: Option<&str> = None;
                        let mut child_name: Option<&str> = None;
                        let mut origin_node: Option<roxmltree::Node> = None;

                        for child in node.children() {
                            if child.has_tag_name("parent") {
                                parent_name = child.attribute("link");
                            } else if child.has_tag_name("child") {
                                child_name = child.attribute("link");
                            } else if child.has_tag_name("origin") {
                                origin_node = Some(child);
                            }
                        }

                        if let (Some(p), Some(c)) = (parent_name, child_name) {
                            let joint_transform = parse_urdf_origin(origin_node);

                            let mut axis = None;
                            if let Some(node) = node.children().find(|n| n.has_tag_name("axis")) {
                                if let Some(xyz_str) = node.attribute("xyz") {
                                    let v: Vec<f32> = xyz_str.split_whitespace().filter_map(|s| s.parse().ok()).collect();
                                    if v.len() == 3 { axis = Some(vector![v[0], v[1], v[2]]); }
                                }
                            }

                            if let Some(ax) = axis {
                                web_sys::console::log_1(&wasm_bindgen::JsValue::from_str(&format!("Joint '{}': Axis {:?}", name, ax)));
                            } else {
                                web_sys::console::log_1(&wasm_bindgen::JsValue::from_str(&format!("Joint '{}': No Axis (Fixed/Floating?)", name)));
                            }

                            adjacency.entry(p.to_string()).or_default().push((c.to_string(), joint_transform, name.to_string(), axis));
                        }
                    }
                }
            }
        }

        // 2. Traversal to compute global poses
        let mut global_poses: std::collections::HashMap<String, Isometry<f32>> = std::collections::HashMap::new();
        let root = "base_link";

        // Initial spawn pose: STANDING ATTEMPT - Height 0.45, Rot -90
        let root_pose = Isometry::from_parts(
            Translation::from(vector![0.0, 0.45, 0.0]),
            na::UnitQuaternion::from_axis_angle(&Vector::x_axis(), -std::f32::consts::FRAC_PI_2)
        );
        global_poses.insert(root.to_string(), root_pose);

        // Define default standing angles - STANDARD SYMMETRIC POSE
        let default_angles = SpotConfig::default_angles();

        let mut queue = std::collections::VecDeque::new();
        queue.push_back(root.to_string());

        while let Some(parent_name) = queue.pop_front() {
            if let Some(parent_pose) = global_poses.get(&parent_name).cloned() {
                if let Some(children) = adjacency.get(&parent_name) {
                    for (child_name, joint_transform, joint_name, joint_axis) in children {
                        let mut rotation_offset = na::UnitQuaternion::identity();

                        if let Some(&angle) = default_angles.get(joint_name.as_str()) {
                            if let Some(axis) = joint_axis {
                                rotation_offset = na::UnitQuaternion::from_axis_angle(&UnitVector::new_normalize(*axis), angle);
                            }
                        }

                        let child_pose = parent_pose * joint_transform * rotation_offset;
                        global_poses.insert(child_name.clone(), child_pose);
                        queue.push_back(child_name.clone());
                    }
                }
            }
        }

        let mut links_handles: std::collections::HashMap<String, RigidBodyHandle> = std::collections::HashMap::new();

        // 3. Create RigidBodies & Colliders
        for (name, node) in &links_xml {
            let pose = global_poses.get(*name).cloned().unwrap_or_else(|| {
                Isometry::from_parts(Translation::from(vector![0.0, 1.0, 0.0]), na::UnitQuaternion::identity())
            });

            // FIXED: Set Dynamic Body (reverting debug fixed base)
            let rb = RigidBodyBuilder::dynamic()
                .position(pose)
                .linear_damping(0.5)
                .angular_damping(0.5)
                .build();
            let handle = world.rigid_body_set.insert(rb);
            links_handles.insert(name.to_string(), handle);
            world.link_map.insert(name.to_string(), handle);

            // Collision Group Logic
            // Simplified: Filter self-collisions (Robot parts don't hit each other)
            // Robot = Group 2. Ground = Group 1.
            let self_group = Group::GROUP_2;
            let filter = Group::GROUP_1;

            if let Some(collision) = node.children().find(|n| n.has_tag_name("collision")) {
                let col_origin = parse_urdf_origin(collision.children().find(|n| n.has_tag_name("origin")));

                if let Some(geometry) = collision.children().find(|n| n.has_tag_name("geometry")) {
                    let mut collider_builder = None;

                    if let Some(box_geom) = geometry.children().find(|n| n.has_tag_name("box")) {
                        if let Some(size_str) = box_geom.attribute("size") {
                            let dims: Vec<f32> = size_str.split_whitespace()
                                .filter_map(|s| s.parse().ok())
                                .collect();
                            if dims.len() == 3 {
                                collider_builder = Some(ColliderBuilder::cuboid(dims[0]/2.0, dims[1]/2.0, dims[2]/2.0));
                            }
                        }
                    } else if let Some(sphere_geom) = geometry.children().find(|n| n.has_tag_name("sphere")) {
                        if let Some(radius_str) = sphere_geom.attribute("radius") {
                            if let Ok(radius) = radius_str.parse::<f32>() {
                                collider_builder = Some(ColliderBuilder::ball(radius));
                            }
                        }
                    } else if let Some(_mesh_geom) = geometry.children().find(|n| n.has_tag_name("mesh")) {
                         // FALLBACK FOOT: INCREASED SIZE AND FRICTION
                         // This is critical for stability.
                         collider_builder = Some(ColliderBuilder::ball(0.04));
                    }

                    if let Some(mut builder) = collider_builder {
                          // Apply properties to all parts
                          // UNIFORM HEAVY MASS - Eliminates "wiggling" caused by light body / heavy legs
                          builder = builder.friction(1.0).density(SpotConfig::DENSITY);

                         let collider = builder
                            .position(col_origin)
                            .collision_groups(InteractionGroups::new(self_group, filter))
                            .build();
                         world.collider_set.insert_with_parent(collider, handle, &mut world.rigid_body_set);
                    }
                }
            } else {
                 if *name == "base_link" {
                     let collider = ColliderBuilder::ball(0.01)
                        .collision_groups(InteractionGroups::new(self_group, filter))
                        .build();
                     world.collider_set.insert_with_parent(collider, handle, &mut world.rigid_body_set);
                 }
            }
        }

        // 4. Create Joints in Topological Order to ensure stable Multibody construction
        web_sys::console::log_1(&wasm_bindgen::JsValue::from_str("Starting Topological Joint Creation..."));

        let mut joint_creation_queue = std::collections::VecDeque::new();
        joint_creation_queue.push_back(root.to_string());

        let mut processed_joints = std::collections::HashSet::new();

        while let Some(parent_name) = joint_creation_queue.pop_front() {
            if let Some(children) = adjacency.get(&parent_name) {
                for (child_name, _jt, joint_name, _jax) in children {
                    if let Some(node) = joints_xml.get(joint_name.as_str()) {
                         // Avoid duplicates if graph has loops (unlikely in URDF tree)
                         if processed_joints.contains(joint_name) { continue; }
                         processed_joints.insert(joint_name.to_string());

                         // process joint
                         let type_ = node.attribute("type").unwrap_or("fixed");

                         if let (Some(parent), Some(child)) = (Some(&parent_name), Some(child_name)) {
                            if let (Some(&p_handle), Some(&c_handle)) = (links_handles.get(parent.as_str()), links_handles.get(child.as_str())) {

                                let mut origin_node: Option<roxmltree::Node> = None;
                                for c in node.children() { if c.has_tag_name("origin") { origin_node = Some(c); } }
                                let joint_origin = parse_urdf_origin(origin_node);

                                match type_ {
                                    "fixed" => {
                                        let joint = GenericJointBuilder::new(JointAxesMask::LOCKED_FIXED_AXES)
                                            .local_frame1(joint_origin)
                                            .local_frame2(Isometry::identity())
                                            .build();
                                        world.multibody_joint_set.insert(p_handle, c_handle, joint, true);
                                    },
                                    "revolute" | "continuous" => {
                                        let mut axis = vector![1.0, 0.0, 0.0];
                                        if let Some(axis_node) = node.children().find(|n| n.has_tag_name("axis")) {
                                            if let Some(xyz_str) = axis_node.attribute("xyz") {
                                                let v: Vec<f32> = xyz_str.split_whitespace().filter_map(|s| s.parse().ok()).collect();
                                                if v.len() == 3 { axis = vector![v[0], v[1], v[2]]; }
                                            }
                                        }

                                        let joint_transform = joint_origin;
                                        let axis_on_parent = joint_transform.rotation * axis;

                                        let mut joint = GenericJointBuilder::new(JointAxesMask::LOCKED_REVOLUTE_AXES)
                                            .local_frame1(joint_transform)
                                            .local_frame2(Isometry::identity())
                                            .local_axis1(UnitVector::new_normalize(axis_on_parent))
                                            .local_axis2(UnitVector::new_normalize(axis))
                                            .build();

                                        let target_pos = *default_angles.get(joint_name.as_str()).unwrap_or(&0.0);
                                        let stiffness = SpotConfig::STIFFNESS_START;
                                        let damping = SpotConfig::DAMPING;

                                        joint.set_motor_position(JointAxis::AngX, target_pos, stiffness, damping);
                                        joint.set_motor_max_force(JointAxis::AngX, 1000.0);

                                        if let Some(handle) = world.multibody_joint_set.insert(p_handle, c_handle, joint, true) {
                                            world.joint_map.insert(joint_name.to_string(), handle);
                                        }
                                    },
                                    _ => {}
                                }
                            }
                        }
                    }
                    joint_creation_queue.push_back(child_name.clone());
                }
            }
        }
    }
}

fn parse_urdf_origin(node: Option<roxmltree::Node>) -> Isometry<f32> {
    let mut xyz = vector![0.0, 0.0, 0.0];
    let mut rpy = vector![0.0, 0.0, 0.0];

    if let Some(origin) = node {
         if let Some(xyz_str) = origin.attribute("xyz") {
              let v: Vec<f32> = xyz_str.split_whitespace().filter_map(|s| s.parse::<f32>().ok()).collect();
              if v.len() == 3 { xyz = vector![v[0], v[1], v[2]]; }
         }
         if let Some(rpy_str) = origin.attribute("rpy") {
              let v: Vec<f32> = rpy_str.split_whitespace().filter_map(|s: &str| s.parse::<f32>().ok()).collect();
              if v.len() == 3 { rpy = vector![v[0], v[1], v[2]]; }
         }
    }

    Isometry::from_parts(
        Translation::from(xyz),
        na::UnitQuaternion::from_euler_angles(rpy.x, rpy.y, rpy.z)
    )
}

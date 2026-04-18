use rapier3d::prelude::*;
use roxmltree::Document;
use nalgebra as na;
use std::collections::{HashMap, HashSet, VecDeque};

use crate::sim::{RapierSim, DEFAULT_JOINT_ANGLES, JOINT_NAMES, STIFFNESS, DAMPING};

const DENSITY: f32 = 2000.0;

fn default_angles() -> HashMap<String, f32> {
    let mut angles = HashMap::new();
    for (i, name) in JOINT_NAMES.iter().enumerate() {
        angles.insert(name.to_string(), DEFAULT_JOINT_ANGLES[i]);
    }
    angles
}

pub fn load_robot(sim: &mut RapierSim, urdf_content: &str) {
    let doc = Document::parse(urdf_content).expect("Failed to parse URDF");

    let mut links_xml: HashMap<&str, roxmltree::Node> = HashMap::new();
    let mut joints_xml: HashMap<&str, roxmltree::Node> = HashMap::new();
    let mut adjacency: HashMap<String, Vec<(String, Isometry<f32>, String, Option<Vector<f32>>)>> = HashMap::new();

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
                        if child.has_tag_name("parent") { parent_name = child.attribute("link"); }
                        else if child.has_tag_name("child") { child_name = child.attribute("link"); }
                        else if child.has_tag_name("origin") { origin_node = Some(child); }
                    }

                    if let (Some(p), Some(c)) = (parent_name, child_name) {
                        let joint_transform = parse_urdf_origin(origin_node);
                        let mut axis = None;
                        if let Some(ax_node) = node.children().find(|n| n.has_tag_name("axis")) {
                            if let Some(xyz_str) = ax_node.attribute("xyz") {
                                let v: Vec<f32> = xyz_str.split_whitespace()
                                    .filter_map(|s| s.parse().ok()).collect();
                                if v.len() == 3 { axis = Some(vector![v[0], v[1], v[2]]); }
                            }
                        }
                        adjacency.entry(p.to_string()).or_default()
                            .push((c.to_string(), joint_transform, name.to_string(), axis));
                    }
                }
            }
        }
    }

    // Compute global poses via BFS
    let mut global_poses: HashMap<String, Isometry<f32>> = HashMap::new();
    let root = "base_link";
    let default_angles = default_angles();

    let root_pose = Isometry::from_parts(
        Translation::from(vector![0.0, 0.45, 0.0]),
        na::UnitQuaternion::from_axis_angle(&Vector::x_axis(), -std::f32::consts::FRAC_PI_2),
    );
    global_poses.insert(root.to_string(), root_pose);

    let mut queue = VecDeque::new();
    queue.push_back(root.to_string());

    while let Some(parent_name) = queue.pop_front() {
        if let Some(parent_pose) = global_poses.get(&parent_name).cloned() {
            if let Some(children) = adjacency.get(&parent_name) {
                for (child_name, joint_transform, joint_name, joint_axis) in children {
                    let mut rotation_offset = na::UnitQuaternion::identity();
                    if let Some(&angle) = default_angles.get(joint_name.as_str()) {
                        if let Some(axis) = joint_axis {
                            rotation_offset = na::UnitQuaternion::from_axis_angle(
                                &UnitVector::new_normalize(*axis), angle,
                            );
                        }
                    }
                    let child_pose = parent_pose * joint_transform * rotation_offset;
                    global_poses.insert(child_name.clone(), child_pose);
                    queue.push_back(child_name.clone());
                }
            }
        }
    }

    // Create rigid bodies and colliders
    let mut links_handles: HashMap<String, RigidBodyHandle> = HashMap::new();

    for (name, node) in &links_xml {
        let pose = global_poses.get(*name).cloned().unwrap_or_else(|| {
            Isometry::from_parts(
                Translation::from(vector![0.0, 1.0, 0.0]),
                na::UnitQuaternion::identity(),
            )
        });

        let rb = RigidBodyBuilder::dynamic()
            .position(pose)
            .linear_damping(0.5)
            .angular_damping(0.5)
            .build();
        let handle = sim.rigid_body_set.insert(rb);
        links_handles.insert(name.to_string(), handle);
        sim.link_map.insert(name.to_string(), handle);

        let self_group = Group::GROUP_2;
        let filter = Group::GROUP_1;

        if let Some(collision) = node.children().find(|n| n.has_tag_name("collision")) {
            let col_origin = parse_urdf_origin(collision.children().find(|n| n.has_tag_name("origin")));

            if let Some(geometry) = collision.children().find(|n| n.has_tag_name("geometry")) {
                let mut collider_builder = None;

                if let Some(box_geom) = geometry.children().find(|n| n.has_tag_name("box")) {
                    if let Some(size_str) = box_geom.attribute("size") {
                        let dims: Vec<f32> = size_str.split_whitespace()
                            .filter_map(|s| s.parse().ok()).collect();
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
                } else if geometry.children().any(|n| n.has_tag_name("mesh")) {
                    collider_builder = Some(ColliderBuilder::ball(0.06));
                }

                if let Some(builder) = collider_builder {
                    let collider = builder
                        .friction(1.0)
                        .density(DENSITY)
                        .position(col_origin)
                        .collision_groups(InteractionGroups::new(self_group, filter))
                        .build();
                    sim.collider_set.insert_with_parent(collider, handle, &mut sim.rigid_body_set);
                }
            }
        } else if *name == "base_link" {
            let collider = ColliderBuilder::ball(0.01)
                .collision_groups(InteractionGroups::new(self_group, filter))
                .build();
            sim.collider_set.insert_with_parent(collider, handle, &mut sim.rigid_body_set);
        }
    }

    // Create joints in topological order
    let mut joint_queue = VecDeque::new();
    joint_queue.push_back(root.to_string());
    let mut processed = HashSet::new();

    while let Some(parent_name) = joint_queue.pop_front() {
        if let Some(children) = adjacency.get(&parent_name) {
            for (child_name, _jt, joint_name, _jax) in children {
                if processed.contains(joint_name) { continue; }
                processed.insert(joint_name.clone());

                if let Some(node) = joints_xml.get(joint_name.as_str()) {
                    let type_ = node.attribute("type").unwrap_or("fixed");

                    if let (Some(&p_handle), Some(&c_handle)) = (
                        links_handles.get(&parent_name),
                        links_handles.get(child_name),
                    ) {
                        let joint_origin = parse_urdf_origin(
                            node.children().find(|c| c.has_tag_name("origin")),
                        );

                        match type_ {
                            "fixed" => {
                                let joint = GenericJointBuilder::new(JointAxesMask::LOCKED_FIXED_AXES)
                                    .local_frame1(joint_origin)
                                    .local_frame2(Isometry::identity())
                                    .build();
                                sim.multibody_joint_set.insert(p_handle, c_handle, joint, true);
                            }
                            "revolute" | "continuous" => {
                                let mut axis = vector![1.0, 0.0, 0.0];
                                if let Some(axis_node) = node.children().find(|n| n.has_tag_name("axis")) {
                                    if let Some(xyz_str) = axis_node.attribute("xyz") {
                                        let v: Vec<f32> = xyz_str.split_whitespace()
                                            .filter_map(|s| s.parse().ok()).collect();
                                        if v.len() == 3 { axis = vector![v[0], v[1], v[2]]; }
                                    }
                                }

                                let axis_on_parent = joint_origin.rotation * axis;

                                let mut joint = GenericJointBuilder::new(JointAxesMask::LOCKED_REVOLUTE_AXES)
                                    .local_frame1(joint_origin)
                                    .local_frame2(Isometry::identity())
                                    .local_axis1(UnitVector::new_normalize(axis_on_parent))
                                    .local_axis2(UnitVector::new_normalize(axis))
                                    .build();

                                let target = *default_angles.get(joint_name.as_str()).unwrap_or(&0.0);
                                joint.set_motor_position(JointAxis::AngX, target, STIFFNESS, DAMPING);
                                joint.set_motor_max_force(JointAxis::AngX, 1000.0);

                                if let Some(handle) = sim.multibody_joint_set.insert(p_handle, c_handle, joint, true) {
                                    sim.joint_map.insert(joint_name.to_string(), handle);
                                }
                            }
                            _ => {}
                        }
                    }
                }
                joint_queue.push_back(child_name.clone());
            }
        }
    }
}

fn parse_urdf_origin(node: Option<roxmltree::Node>) -> Isometry<f32> {
    let mut xyz = vector![0.0, 0.0, 0.0];
    let mut rpy = vector![0.0, 0.0, 0.0];

    if let Some(origin) = node {
        if let Some(xyz_str) = origin.attribute("xyz") {
            let v: Vec<f32> = xyz_str.split_whitespace()
                .filter_map(|s| s.parse().ok()).collect();
            if v.len() == 3 { xyz = vector![v[0], v[1], v[2]]; }
        }
        if let Some(rpy_str) = origin.attribute("rpy") {
            let v: Vec<f32> = rpy_str.split_whitespace()
                .filter_map(|s| s.parse().ok()).collect();
            if v.len() == 3 { rpy = vector![v[0], v[1], v[2]]; }
        }
    }

    Isometry::from_parts(
        Translation::from(xyz),
        na::UnitQuaternion::from_euler_angles(rpy.x, rpy.y, rpy.z),
    )
}

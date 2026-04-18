use rapier3d::prelude::*;
use nalgebra as na;
use std::collections::HashMap;

pub const JOINT_NAMES: [&str; 12] = [
    "motor_front_left_hip", "motor_front_left_upper_leg", "motor_front_left_lower_leg",
    "motor_front_right_hip", "motor_front_right_upper_leg", "motor_front_right_lower_leg",
    "motor_back_left_hip", "motor_back_left_upper_leg", "motor_back_left_lower_leg",
    "motor_back_right_hip", "motor_back_right_upper_leg", "motor_back_right_lower_leg",
];

pub const FOOT_LINKS: [&str; 4] = [
    "front_left_lower_leg", "front_right_lower_leg",
    "back_left_lower_leg", "back_right_lower_leg",
];

pub const DEFAULT_JOINT_ANGLES: [f32; 12] = [
    0.0, 0.6, -1.2,
    0.0, 0.6, -1.2,
    0.0, 0.6, -1.2,
    0.0, 0.6, -1.2,
];

const ACTION_LIMIT: f32 = 0.25;

// PD gains matching PyBullet: KP=1.5, KD=0.3
// PyBullet POSITION_CONTROL: torque = KD * (KP * pos_error - vel)
// Rapier spring-damper: torque = stiffness * pos_error - damping * vel
// stiffness = KP * KD = 0.45, damping = KD = 0.3
pub const STIFFNESS: f32 = 0.45;
pub const DAMPING: f32 = 0.3;
pub const MAX_FORCE: f32 = 200.0;

const PHYSICS_DT: f32 = 1.0 / 200.0; // 200Hz, same as PyBullet
pub const DECIMATION: usize = 4;       // 4 substeps → 50Hz policy

pub struct RapierSim {
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

    pub link_map: HashMap<String, RigidBodyHandle>,
    pub joint_map: HashMap<String, MultibodyJointHandle>,

    pub previous_action: [f32; 12],
    pub prev_joint_vel: [f32; 12],
    pub time: f32,
    pub decimation: usize,

    foot_link_handles: Vec<RigidBodyHandle>,
    ground_collider_handle: Option<ColliderHandle>,
}

impl RapierSim {
    pub fn new(urdf_content: &str, terrain_type: &str, terrain_seed: u64, terrain_difficulty: f32) -> Self {
        let mut integration_parameters = IntegrationParameters::default();
        integration_parameters.dt = PHYSICS_DT;

        let mut sim = Self {
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
            link_map: HashMap::new(),
            joint_map: HashMap::new(),
            previous_action: [0.0; 12],
            prev_joint_vel: [0.0; 12],
            time: 0.0,
            decimation: DECIMATION,
            foot_link_handles: Vec::new(),
            ground_collider_handle: None,
        };

        // Create terrain
        let ground_handle = match terrain_type {
            "heightfield" => crate::terrain::create_random_terrain(
                &mut sim.rigid_body_set,
                &mut sim.collider_set,
                terrain_seed,
                terrain_difficulty,
            ),
            _ => crate::terrain::create_flat_ground(
                &mut sim.rigid_body_set,
                &mut sim.collider_set,
            ),
        };
        sim.ground_collider_handle = Some(ground_handle);

        // Load robot
        crate::urdf::load_robot(&mut sim, urdf_content);

        // Cache foot link handles
        for foot_name in &FOOT_LINKS {
            if let Some(&handle) = sim.link_map.get(*foot_name) {
                sim.foot_link_handles.push(handle);
            }
        }

        sim
    }

    pub fn physics_step(&mut self) {
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
        self.time += PHYSICS_DT;
    }

    pub fn apply_actions(&mut self, actions: &[f32]) {
        for (i, name) in JOINT_NAMES.iter().enumerate() {
            if let Some(&handle) = self.joint_map.get(*name) {
                if let Some((multibody, link_id)) = self.multibody_joint_set.get_mut(handle) {
                    if let Some(link) = multibody.link_mut(link_id) {
                        let offset = actions.get(i).copied().unwrap_or(0.0)
                            .clamp(-ACTION_LIMIT, ACTION_LIMIT);
                        let target = DEFAULT_JOINT_ANGLES[i] + offset;

                        link.joint.data.set_motor_position(
                            JointAxis::AngX, target, STIFFNESS, DAMPING,
                        );
                        link.joint.data.set_motor_max_force(JointAxis::AngX, MAX_FORCE);
                    }
                }
            }
        }
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
        let base_handle = self.link_map.get("base_link").copied();
        let (base_rot, base_angvel, _base_linvel) = if let Some(handle) = base_handle {
            if let Some(body) = self.rigid_body_set.get(handle) {
                (*body.rotation(), *body.angvel(), *body.linvel())
            } else {
                (na::UnitQuaternion::identity(), na::Vector3::zeros(), na::Vector3::zeros())
            }
        } else {
            (na::UnitQuaternion::identity(), na::Vector3::zeros(), na::Vector3::zeros())
        };

        // Body angular velocity in body frame (no coordinate remapping needed —
        // training will learn directly in Rapier's Y-up frame)
        let body_angvel = base_rot.inverse() * base_angvel;

        // Projected gravity in body frame
        let world_gravity = na::Vector3::new(0.0, -1.0, 0.0);
        let body_gravity = base_rot.inverse() * world_gravity;

        // Joint positions and velocities
        let joint_pos = self.get_joint_positions();
        let joint_vel = self.get_joint_velocities();

        let mut obs = Vec::with_capacity(45);
        // Angular velocity (3)
        obs.push(body_angvel.x);
        obs.push(body_angvel.y);
        obs.push(body_angvel.z);
        // Gravity (3)
        obs.push(body_gravity.x);
        obs.push(body_gravity.y);
        obs.push(body_gravity.z);
        // Joint positions as offsets from default (12)
        for &p in &joint_pos {
            obs.push(p);
        }
        // Joint velocities (12)
        for &v in &joint_vel {
            obs.push(v);
        }
        // Previous action (12)
        for &a in &self.previous_action {
            obs.push(a);
        }
        // Command placeholder (3) — filled by Python env
        obs.push(0.0);
        obs.push(0.0);
        obs.push(0.0);

        obs
    }

    pub fn get_base_height(&self) -> f32 {
        if let Some(&handle) = self.link_map.get("base_link") {
            if let Some(body) = self.rigid_body_set.get(handle) {
                return body.position().translation.y;
            }
        }
        0.0
    }

    pub fn get_base_orientation_rpy(&self) -> Vec<f32> {
        if let Some(&handle) = self.link_map.get("base_link") {
            if let Some(body) = self.rigid_body_set.get(handle) {
                let (roll, pitch, yaw) = body.rotation().euler_angles();
                return vec![roll, pitch, yaw];
            }
        }
        vec![0.0, 0.0, 0.0]
    }

    pub fn get_base_velocity(&self) -> Vec<f32> {
        if let Some(&handle) = self.link_map.get("base_link") {
            if let Some(body) = self.rigid_body_set.get(handle) {
                let v = body.linvel();
                return vec![v.x, v.y, v.z];
            }
        }
        vec![0.0, 0.0, 0.0]
    }

    pub fn get_base_angular_velocity(&self) -> Vec<f32> {
        if let Some(&handle) = self.link_map.get("base_link") {
            if let Some(body) = self.rigid_body_set.get(handle) {
                let w = body.angvel();
                return vec![w.x, w.y, w.z];
            }
        }
        vec![0.0, 0.0, 0.0]
    }

    pub fn get_joint_positions(&self) -> Vec<f32> {
        let mut positions = vec![0.0f32; 12];
        for (i, name) in JOINT_NAMES.iter().enumerate() {
            if let Some(&handle) = self.joint_map.get(*name) {
                if let Some((multibody, link_id)) = self.multibody_joint_set.get(handle) {
                    if let Some(link) = multibody.link(link_id) {
                        let l2p = link.local_to_parent();
                        let rot_mat = l2p.rotation.to_rotation_matrix();
                        let m = rot_mat.matrix();
                        let actual_angle = m[(2, 1)].atan2(m[(1, 1)]);
                        positions[i] = actual_angle - DEFAULT_JOINT_ANGLES[i];
                    }
                }
            }
        }
        positions
    }

    pub fn get_joint_velocities(&self) -> Vec<f32> {
        let mut velocities = vec![0.0f32; 12];
        for (i, name) in JOINT_NAMES.iter().enumerate() {
            if let Some(&handle) = self.joint_map.get(*name) {
                if let Some((multibody, link_id)) = self.multibody_joint_set.get(handle) {
                    if let Some(link) = multibody.link(link_id) {
                        let rb_handle = link.rigid_body_handle();
                        if let Some(rb) = self.rigid_body_set.get(rb_handle) {
                            let angvel = rb.angvel();
                            let rot = link.local_to_parent().rotation;
                            let local_x = rot * na::Vector3::x();
                            velocities[i] = angvel.dot(&local_x);
                        }
                    }
                }
            }
        }
        velocities
    }

    fn get_joint_velocities_array(&self) -> [f32; 12] {
        let v = self.get_joint_velocities();
        let mut arr = [0.0f32; 12];
        for (i, &val) in v.iter().enumerate().take(12) {
            arr[i] = val;
        }
        arr
    }

    pub fn get_joint_torques(&self) -> Vec<f32> {
        // Approximate torque from spring-damper: stiffness * error - damping * vel
        let pos = self.get_joint_positions();
        let vel = self.get_joint_velocities();
        let mut torques = vec![0.0f32; 12];
        for i in 0..12 {
            let error = self.previous_action[i] - pos[i]; // target offset - actual offset
            torques[i] = (STIFFNESS * error - DAMPING * vel[i]).clamp(-MAX_FORCE, MAX_FORCE);
        }
        torques
    }

    pub fn get_foot_contacts(&self) -> Vec<bool> {
        let mut contacts = vec![false; 4];
        for (i, &foot_handle) in self.foot_link_handles.iter().enumerate() {
            // Check if this foot's colliders have any contact
            for contact_pair in self.narrow_phase.contact_pairs() {
                let c1 = contact_pair.collider1;
                let c2 = contact_pair.collider2;

                let foot_colliders: Vec<_> = self.collider_set.iter()
                    .filter(|(_, c)| c.parent() == Some(foot_handle))
                    .map(|(h, _)| h)
                    .collect();

                if contact_pair.has_any_active_contact {
                    for &fc in &foot_colliders {
                        if c1 == fc || c2 == fc {
                            contacts[i] = true;
                        }
                    }
                }
            }
        }
        contacts
    }

    pub fn get_body_collision_count(&self) -> usize {
        let foot_handles: std::collections::HashSet<_> = self.foot_link_handles.iter().copied().collect();
        let mut count = 0;

        for contact_pair in self.narrow_phase.contact_pairs() {
            if !contact_pair.has_any_active_contact { continue; }

            let c1 = contact_pair.collider1;
            let c2 = contact_pair.collider2;

            // Check if either collider belongs to a non-foot robot link
            for (handle, collider) in self.collider_set.iter() {
                if handle != c1 && handle != c2 { continue; }
                if let Some(parent) = collider.parent() {
                    if self.link_map.values().any(|&h| h == parent) && !foot_handles.contains(&parent) {
                        // Check the other collider is ground
                        let other = if handle == c1 { c2 } else { c1 };
                        if let Some(other_col) = self.collider_set.get(other) {
                            if other_col.parent().is_none() || !self.link_map.values().any(|&h| Some(h) == other_col.parent()) {
                                count += 1;
                            }
                        }
                    }
                }
            }
        }
        count
    }

    pub fn is_fallen(&self) -> bool {
        if let Some(&handle) = self.link_map.get("base_link") {
            if let Some(body) = self.rigid_body_set.get(handle) {
                let height = body.position().translation.y;
                if height < 0.15 { return true; }

                // The URDF is loaded with -90° X rotation (Z-up → Y-up).
                // When standing, body-frame gravity = (0, 0, -1).
                // "Up" in body frame is -Z, so check Z component.
                let world_gravity = na::Vector3::new(0.0, -1.0, 0.0);
                let body_gravity = body.rotation().inverse() * world_gravity;
                // Robot is fallen if gravity's Z projection is too small
                // (i.e. the body has tilted away from upright)
                if body_gravity.z > -0.5 { return true; }
            }
        }
        false
    }
}

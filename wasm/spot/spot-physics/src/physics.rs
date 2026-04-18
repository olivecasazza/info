use rapier3d::prelude::*;
use nalgebra as na;
use std::collections::HashMap;

use crate::config::{
    ACTION_LIMIT, DAMPING, DEFAULT_JOINT_ANGLES, FOOT_LINKS, JOINT_NAMES, MAX_FORCE, PHYSICS_DT,
    STIFFNESS,
};

/// Core physics world containing all Rapier state for the Spot robot.
///
/// This struct owns the Rapier simulation but is stateless with respect to
/// control (no previous_action, no time tracking). Consumers (rapier-gym,
/// WASM app) manage their own control state on top.
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

    /// Map link names to RigidBodyHandles.
    pub link_map: HashMap<String, RigidBodyHandle>,
    /// Map joint names to MultibodyJointHandles.
    pub joint_map: HashMap<String, MultibodyJointHandle>,

    /// Cached foot link handles (populated after robot load).
    pub foot_link_handles: Vec<RigidBodyHandle>,
    /// Ground collider handle (populated after terrain creation).
    pub ground_collider_handle: Option<ColliderHandle>,
}

impl PhysicsWorld {
    /// Create a new physics world with the configured timestep.
    pub fn new() -> Self {
        let mut integration_parameters = IntegrationParameters::default();
        integration_parameters.dt = PHYSICS_DT;

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
            link_map: HashMap::new(),
            joint_map: HashMap::new(),
            foot_link_handles: Vec::new(),
            ground_collider_handle: None,
        }
    }

    /// Create a new physics world with a custom timestep.
    pub fn with_dt(dt: f32) -> Self {
        let mut world = Self::new();
        world.integration_parameters.dt = dt;
        world
    }

    /// Cache foot link handles after robot loading. Must be called after
    /// `urdf::load_robot`.
    pub fn cache_foot_handles(&mut self) {
        self.foot_link_handles.clear();
        for foot_name in &FOOT_LINKS {
            if let Some(&handle) = self.link_map.get(*foot_name) {
                self.foot_link_handles.push(handle);
            }
        }
    }

    /// Step the physics simulation forward by one timestep.
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

    /// Apply action offsets to all motor joints.
    ///
    /// Each action value is clamped to [-ACTION_LIMIT, ACTION_LIMIT] and added
    /// to the default joint angle to produce the motor target.
    pub fn apply_actions(&mut self, actions: &[f32]) {
        for (i, name) in JOINT_NAMES.iter().enumerate() {
            if let Some(&handle) = self.joint_map.get(*name) {
                if let Some((multibody, link_id)) =
                    self.multibody_joint_set.get_mut(handle)
                {
                    if let Some(link) = multibody.link_mut(link_id) {
                        let offset = actions
                            .get(i)
                            .copied()
                            .unwrap_or(0.0)
                            .clamp(-ACTION_LIMIT, ACTION_LIMIT);
                        let target = DEFAULT_JOINT_ANGLES[i] + offset;

                        link.joint
                            .data
                            .set_motor_position(JointAxis::AngX, target, STIFFNESS, DAMPING);
                        link.joint
                            .data
                            .set_motor_max_force(JointAxis::AngX, MAX_FORCE);
                    }
                }
            }
        }
    }

    /// Get base link height (Y coordinate).
    pub fn get_base_height(&self) -> f32 {
        if let Some(&handle) = self.link_map.get("base_link") {
            if let Some(body) = self.rigid_body_set.get(handle) {
                return body.position().translation.y;
            }
        }
        0.0
    }

    /// Get base orientation as (roll, pitch, yaw).
    pub fn get_base_orientation_rpy(&self) -> [f32; 3] {
        if let Some(&handle) = self.link_map.get("base_link") {
            if let Some(body) = self.rigid_body_set.get(handle) {
                let (roll, pitch, yaw) = body.rotation().euler_angles();
                return [roll, pitch, yaw];
            }
        }
        [0.0, 0.0, 0.0]
    }

    /// Get base linear velocity.
    pub fn get_base_velocity(&self) -> [f32; 3] {
        if let Some(&handle) = self.link_map.get("base_link") {
            if let Some(body) = self.rigid_body_set.get(handle) {
                let v = body.linvel();
                return [v.x, v.y, v.z];
            }
        }
        [0.0, 0.0, 0.0]
    }

    /// Get base angular velocity.
    pub fn get_base_angular_velocity(&self) -> [f32; 3] {
        if let Some(&handle) = self.link_map.get("base_link") {
            if let Some(body) = self.rigid_body_set.get(handle) {
                let w = body.angvel();
                return [w.x, w.y, w.z];
            }
        }
        [0.0, 0.0, 0.0]
    }

    /// Get joint positions as offsets from default angles, in JOINT_NAMES order.
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

    /// Get joint velocities in JOINT_NAMES order.
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

    /// Get approximate joint torques from PD controller error.
    pub fn get_joint_torques(&self, previous_action: &[f32; 12]) -> Vec<f32> {
        let pos = self.get_joint_positions();
        let vel = self.get_joint_velocities();
        let mut torques = vec![0.0f32; 12];
        for i in 0..12 {
            let error = previous_action[i] - pos[i];
            torques[i] = (STIFFNESS * error - DAMPING * vel[i]).clamp(-MAX_FORCE, MAX_FORCE);
        }
        torques
    }

    /// Get foot contact state (true = in contact with ground).
    pub fn get_foot_contacts(&self) -> [bool; 4] {
        let mut contacts = [false; 4];
        for (i, &foot_handle) in self.foot_link_handles.iter().enumerate() {
            for contact_pair in self.narrow_phase.contact_pairs() {
                let c1 = contact_pair.collider1;
                let c2 = contact_pair.collider2;

                let foot_colliders: Vec<_> = self
                    .collider_set
                    .iter()
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

    /// Count non-foot body parts in contact with ground.
    pub fn get_body_collision_count(&self) -> usize {
        let foot_handles: std::collections::HashSet<_> =
            self.foot_link_handles.iter().copied().collect();
        let mut count = 0;

        for contact_pair in self.narrow_phase.contact_pairs() {
            if !contact_pair.has_any_active_contact {
                continue;
            }

            let c1 = contact_pair.collider1;
            let c2 = contact_pair.collider2;

            for (handle, collider) in self.collider_set.iter() {
                if handle != c1 && handle != c2 {
                    continue;
                }
                if let Some(parent) = collider.parent() {
                    if self.link_map.values().any(|&h| h == parent)
                        && !foot_handles.contains(&parent)
                    {
                        let other = if handle == c1 { c2 } else { c1 };
                        if let Some(other_col) = self.collider_set.get(other) {
                            if other_col.parent().is_none()
                                || !self
                                    .link_map
                                    .values()
                                    .any(|&h| Some(h) == other_col.parent())
                            {
                                count += 1;
                            }
                        }
                    }
                }
            }
        }
        count
    }

    /// Check if the robot has fallen over.
    pub fn is_fallen(&self) -> bool {
        if let Some(&handle) = self.link_map.get("base_link") {
            if let Some(body) = self.rigid_body_set.get(handle) {
                let height = body.position().translation.y;
                if height < 0.15 {
                    return true;
                }

                let world_gravity = na::Vector3::new(0.0, -1.0, 0.0);
                let body_gravity = body.rotation().inverse() * world_gravity;
                if body_gravity.z > -0.5 {
                    return true;
                }
            }
        }
        false
    }
}

use rapier3d::prelude::*;
use nalgebra as na;
use std::collections::HashMap;

use crate::config::{
    ACTION_LIMIT, BATTERY_COLLECT_RADIUS, DAMPING, DEFAULT_JOINT_ANGLES, FOOT_LINKS, JOINT_NAMES,
    MAX_FORCE, NUM_SIGHT_RAYS, PHYSICS_DT, SIGHT_CONE_HALF_ANGLE, SIGHT_CONE_RANGE, STIFFNESS,
};

/// A battery pickup item in the foraging environment.
pub struct BatteryItem {
    pub collider_handle: ColliderHandle,
    pub position: [f32; 3],
    pub charge: f32,
    pub radius: f32,
}

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

    /// Battery items for foraging terrain.
    pub batteries: Vec<BatteryItem>,
    /// PRNG state for battery respawn (SplitMix64).
    pub rng_state: u64,
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
            batteries: Vec::new(),
            rng_state: 0x1234_5678_9abc_def0,
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

    // -----------------------------------------------------------------------
    // Battery / foraging helpers
    // -----------------------------------------------------------------------

    /// Inline SplitMix64 step (matches terrain.rs Rng).
    pub(crate) fn rng_next(&mut self) -> u64 {
        self.rng_state = self.rng_state.wrapping_add(0x9e3779b97f4a7c15);
        let mut z = self.rng_state;
        z = (z ^ (z >> 30)).wrapping_mul(0xbf58476d1ce4e5b9);
        z = (z ^ (z >> 27)).wrapping_mul(0x94d049bb133111eb);
        z ^ (z >> 31)
    }

    /// Uniform f32 in [lo, hi).
    pub(crate) fn rng_range(&mut self, lo: f32, hi: f32) -> f32 {
        let u = (self.rng_next() >> 40) as f32 / (1u64 << 24) as f32;
        lo + u * (hi - lo)
    }

    /// Collect batteries within BATTERY_COLLECT_RADIUS of base_pos.
    /// Returns total charge collected. Collected batteries are respawned.
    pub fn collect_nearby_batteries(&mut self, base_pos: [f32; 3]) -> f32 {
        let mut total_charge = 0.0f32;
        let r2 = BATTERY_COLLECT_RADIUS * BATTERY_COLLECT_RADIUS;

        let indices_to_respawn: Vec<usize> = self
            .batteries
            .iter()
            .enumerate()
            .filter(|(_, b)| {
                let dx = b.position[0] - base_pos[0];
                let dy = b.position[1] - base_pos[1];
                let dz = b.position[2] - base_pos[2];
                dx * dx + dy * dy + dz * dz < r2
            })
            .map(|(i, _)| i)
            .collect();

        for &i in &indices_to_respawn {
            total_charge += self.batteries[i].charge;
        }

        for &i in &indices_to_respawn {
            self.respawn_battery(i);
        }

        total_charge
    }

    /// Get battery positions and charges: [(x, y, z, charge), ...].
    pub fn get_battery_positions(&self) -> Vec<[f32; 4]> {
        self.batteries
            .iter()
            .map(|b| [b.position[0], b.position[1], b.position[2], b.charge])
            .collect()
    }

    /// Respawn a battery at a new random position on the foraging arena.
    pub fn respawn_battery(&mut self, index: usize) {
        let arena = 4.0f32;
        let (x, z) = loop {
            let x = self.rng_range(-arena, arena);
            let z = self.rng_range(-arena, arena);
            // Keep out of spawn zone (radius ~1m)
            if x * x + z * z >= 1.0 {
                break (x, z);
            }
        };
        let radius = self.batteries[index].radius;
        let charge = self.rng_range(0.1, 0.5);
        let y = radius; // sit on ground

        self.batteries[index].position = [x, y, z];
        self.batteries[index].charge = charge;

        // Update collider position
        if let Some(col) = self.collider_set.get_mut(self.batteries[index].collider_handle) {
            col.set_translation(vector![x, y, z]);
        }
    }

    /// Cast NUM_SIGHT_RAYS rays in a forward cone and return
    /// (total_visible_charge, avg_distance) of batteries hit.
    pub fn cast_sight_cone(
        &self,
        base_pos: [f32; 3],
        base_forward: [f32; 3],
    ) -> (f32, f32) {
        let origin = point![base_pos[0], base_pos[1], base_pos[2]];
        let fwd = na::Vector3::new(base_forward[0], base_forward[1], base_forward[2]);
        let fwd_norm = if fwd.norm() > 1e-6 { fwd.normalize() } else { na::Vector3::x() };

        // Build a perpendicular vector for rotating rays in the horizontal plane
        let up = na::Vector3::y();
        let right = fwd_norm.cross(&up);
        let right_norm = if right.norm() > 1e-6 { right.normalize() } else { na::Vector3::z() };

        let mut total_charge = 0.0f32;
        let mut total_dist = 0.0f32;
        let mut hit_count = 0u32;

        for i in 0..NUM_SIGHT_RAYS {
            // Spread rays from -HALF_ANGLE to +HALF_ANGLE
            let t = if NUM_SIGHT_RAYS > 1 {
                i as f32 / (NUM_SIGHT_RAYS - 1) as f32
            } else {
                0.5
            };
            let angle = -SIGHT_CONE_HALF_ANGLE + 2.0 * SIGHT_CONE_HALF_ANGLE * t;

            // Rotate forward direction around Y axis by angle
            let dir = fwd_norm * angle.cos() + right_norm * angle.sin();
            let ray = Ray::new(origin, vector![dir.x, dir.y, dir.z]);

            let filter = QueryFilter::default().groups(InteractionGroups::new(
                Group::ALL,
                Group::GROUP_3,
            ));

            if let Some((handle, toi)) = self.query_pipeline.cast_ray(
                &self.rigid_body_set,
                &self.collider_set,
                &ray,
                SIGHT_CONE_RANGE,
                true,
                filter,
            ) {
                // Find which battery this hit
                if let Some(bat) = self.batteries.iter().find(|b| b.collider_handle == handle) {
                    total_charge += bat.charge;
                    total_dist += toi;
                    hit_count += 1;
                }
            }
        }

        let avg_dist = if hit_count > 0 {
            total_dist / hit_count as f32
        } else {
            SIGHT_CONE_RANGE
        };

        (total_charge, avg_dist)
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

use rapier3d::prelude::*;
use nalgebra as na;
use std::collections::HashMap;

use crate::config::{
    ACTION_LIMIT, BATTERY_COLLECT_RADIUS, DAMPING, DEFAULT_JOINT_ANGLES, FOOT_LINKS, JOINT_NAMES,
    MAX_FORCE, NUM_OBSTACLE_RAYS, NUM_SIGHT_RAYS, OBSTACLE_CONE_HALF_ANGLE, OBSTACLE_RAY_DOWN_PITCH,
    OBSTACLE_RAY_MAX_RANGE, OBSTACLE_RAYS_PER_PITCH, PHYSICS_DT, SIGHT_CONE_HALF_ANGLE,
    SIGHT_CONE_RANGE, STIFFNESS,
};

/// Generate the NUM_OBSTACLE_RAYS unit vectors for the forward obstacle cone.
///
/// 4-azimuth × 2-pitch grid: indices 0..3 are horizontal-level rays at four
/// evenly-spaced yaws across [-OBSTACLE_CONE_HALF_ANGLE, +OBSTACLE_CONE_HALF_ANGLE];
/// indices 4..7 are the same yaws but pitched down by OBSTACLE_RAY_DOWN_PITCH
/// to scan terrain in front of the robot's feet.
///
/// Pure function (no PhysicsWorld access) so visualizers can call it to render
/// the same cone shape Rapier is sampling. Up axis is Y (Rapier convention).
pub fn obstacle_cone_directions(base_forward: [f32; 3]) -> Vec<[f32; 3]> {
    let fwd = na::Vector3::new(base_forward[0], base_forward[1], base_forward[2]);
    let fwd_norm = if fwd.norm() > 1e-6 {
        fwd.normalize()
    } else {
        na::Vector3::x()
    };
    let up = na::Vector3::y();
    let right = fwd_norm.cross(&up);
    let right_norm = if right.norm() > 1e-6 {
        right.normalize()
    } else {
        na::Vector3::z()
    };
    // Re-orthogonalize "up" against the now-normalized right + forward so
    // the pitch axis is exactly perpendicular to both. Avoids any roll
    // sneaking in if base_forward isn't perfectly horizontal.
    let local_up = right_norm.cross(&fwd_norm).normalize();

    let mut dirs = Vec::with_capacity(NUM_OBSTACLE_RAYS);
    let pitches = [0.0f32, OBSTACLE_RAY_DOWN_PITCH];
    for &pitch in &pitches {
        for j in 0..OBSTACLE_RAYS_PER_PITCH {
            let t = if OBSTACLE_RAYS_PER_PITCH > 1 {
                j as f32 / (OBSTACLE_RAYS_PER_PITCH - 1) as f32
            } else {
                0.5
            };
            let yaw = -OBSTACLE_CONE_HALF_ANGLE + 2.0 * OBSTACLE_CONE_HALF_ANGLE * t;
            // Compose: yaw around up, then pitch around right.
            let yawed = fwd_norm * yaw.cos() + right_norm * yaw.sin();
            // Rotate `yawed` around the right axis by `pitch`. Since pitch is
            // small and `right_norm` is independent, use Rodrigues' formula
            // simplified to up-vs-yawed components.
            let cos_p = pitch.cos();
            let sin_p = pitch.sin();
            let dir = yawed * cos_p + local_up * sin_p;
            dirs.push([dir.x, dir.y, dir.z]);
        }
    }
    dirs
}

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
    /// Extract the ground terrain mesh as (vertices, triangle_indices).
    ///
    /// Walks every collider attached to no rigid body (terrain is static) and
    /// pulls vertices/indices off the underlying TriMesh shape. Heightfield,
    /// stairs, slopes, mixed, etc. all bake to TriMesh during construction;
    /// flat ground uses a Cuboid and is skipped here. Returns None if no
    /// terrain mesh is available (e.g. flat-only).
    pub fn get_terrain_mesh(&self) -> Option<(Vec<[f32; 3]>, Vec<[u32; 3]>)> {
        let mut all_verts: Vec<[f32; 3]> = Vec::new();
        let mut all_tris: Vec<[u32; 3]> = Vec::new();
        for (_, collider) in self.collider_set.iter() {
            // Only static (parentless) colliders are terrain.
            if collider.parent().is_some() {
                continue;
            }
            if let Some(trimesh) = collider.shape().as_trimesh() {
                let offset = all_verts.len() as u32;
                all_verts.extend(trimesh.vertices().iter().map(|p| [p.x, p.y, p.z]));
                all_tris.extend(trimesh.indices().iter().map(|&[a, b, c]| {
                    [a + offset, b + offset, c + offset]
                }));
            }
        }
        if all_verts.is_empty() {
            None
        } else {
            Some((all_verts, all_tris))
        }
    }

    /// Return every link's world-frame pose (translation + quaternion).
    ///
    /// Use this for visualization / external KSDK clients instead of computing
    /// forward kinematics in the consumer — Rapier already owns the authoritative
    /// pose, including the -π/2 X-axis rotation `urdf.rs::load_robot` applies
    /// to the root to remap URDF Z-up onto the Y-up Rapier world. Reproducing
    /// that chain in Python invariably drifts on the rotation, which surfaces
    /// as the robot rendering "sideways" relative to gravity.
    ///
    /// Returns `(name, [x, y, z], [qx, qy, qz, qw])` for each registered link.
    pub fn get_link_world_poses(&self) -> Vec<(String, [f32; 3], [f32; 4])> {
        let mut out = Vec::with_capacity(self.link_map.len());
        for (name, &handle) in &self.link_map {
            if let Some(body) = self.rigid_body_set.get(handle) {
                let pos = body.position();
                let t = pos.translation;
                let r = pos.rotation;
                out.push((
                    name.clone(),
                    [t.x, t.y, t.z],
                    [r.i, r.j, r.k, r.w],
                ));
            }
        }
        out
    }

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

    /// Cast NUM_OBSTACLE_RAYS rays in a forward cone and return per-ray
    /// distance to the nearest environment hit, clamped to OBSTACLE_RAY_MAX_RANGE.
    ///
    /// Distinct from `cast_sight_cone` (which scans Group::GROUP_3 — battery
    /// objects — and aggregates charge): this scans Group::GROUP_1 — terrain +
    /// obstacles — and returns per-ray data so the policy can reason about
    /// the spatial layout in front of the robot for path planning. Output
    /// length is fixed at NUM_OBSTACLE_RAYS (8) so it can sit in a fixed-size
    /// observation slot.
    pub fn cast_obstacle_cone(
        &self,
        base_pos: [f32; 3],
        base_forward: [f32; 3],
    ) -> Vec<f32> {
        let dirs = obstacle_cone_directions(base_forward);
        let origin = point![base_pos[0], base_pos[1], base_pos[2]];
        let mut distances = vec![OBSTACLE_RAY_MAX_RANGE; NUM_OBSTACLE_RAYS];
        let filter = QueryFilter::default()
            .groups(InteractionGroups::new(Group::ALL, Group::GROUP_1));

        for (i, dir) in dirs.iter().enumerate().take(NUM_OBSTACLE_RAYS) {
            let ray = Ray::new(origin, vector![dir[0], dir[1], dir[2]]);
            if let Some((_, toi)) = self.query_pipeline.cast_ray(
                &self.rigid_body_set,
                &self.collider_set,
                &ray,
                OBSTACLE_RAY_MAX_RANGE,
                true, // solid
                filter,
            ) {
                distances[i] = toi;
            }
        }
        distances
    }

    /// Public wrapper around the cone-direction generator so visualizers can
    /// render the same cone the policy is reading. Returns NUM_OBSTACLE_RAYS
    /// unit vectors in world frame, in the same index order as the distances
    /// from `cast_obstacle_cone`.
    pub fn obstacle_cone_directions(&self, base_forward: [f32; 3]) -> Vec<[f32; 3]> {
        obstacle_cone_directions(base_forward)
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

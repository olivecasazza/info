//! Rerun-based renderer for native training visualization.
//!
//! Logs Rapier physics state directly to the Rerun SDK so the Rerun Viewer
//! (native or web) can display the robot in real time. Gated behind the
//! `rerun` feature flag so WASM builds are unaffected.
//!
//! Entity hierarchy:
//! ```text
//! world/
//!   robot/
//!     base_link         <- Transform3D (+ Asset3D if STL provided)
//!     front_left_hip    <- Transform3D
//!     ...
//!   terrain/
//!     ground            <- Boxes3D
//!   metrics/
//!     height            <- Scalar
//!     velocity          <- Scalar
//! ```

use crate::config::{FOOT_LINKS, JOINT_NAMES};
use crate::physics::PhysicsWorld;
use crate::renderer::Renderer;

/// Rerun renderer that logs PhysicsWorld state via the Rerun Rust SDK.
pub struct RerunRenderer {
    rec: rerun::RecordingStream,
    initialized: bool,
}

impl RerunRenderer {
    /// Create a renderer that spawns a new Rerun Viewer process.
    ///
    /// The viewer executable must be in PATH (`pip install rerun-sdk` or
    /// `cargo install rerun-cli`).
    pub fn spawn(app_name: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let rec = rerun::RecordingStreamBuilder::new(app_name).spawn()?;
        Ok(Self {
            rec,
            initialized: false,
        })
    }

    /// Create a renderer that connects to an already-running Rerun Viewer
    /// via TCP (default `127.0.0.1:9876`).
    pub fn connect(app_name: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let rec = rerun::RecordingStreamBuilder::new(app_name).connect_tcp()?;
        Ok(Self {
            rec,
            initialized: false,
        })
    }

    /// Create a renderer that saves to an `.rrd` file for offline viewing.
    pub fn save(app_name: &str, path: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let rec = rerun::RecordingStreamBuilder::new(app_name).save(path)?;
        Ok(Self {
            rec,
            initialized: false,
        })
    }

    /// Log collider primitive shapes for a single link entity.
    fn log_link_colliders(&self, entity: &str, world: &PhysicsWorld, handle: rapier3d::prelude::RigidBodyHandle) {
        for (_, collider) in world.collider_set.iter() {
            if collider.parent() != Some(handle) {
                continue;
            }
            let shape = collider.shape();

            if let Some(ball) = shape.as_ball() {
                let _ = self.rec.log_static(
                    format!("{entity}/collider"),
                    &rerun::Ellipsoids3D::from_half_sizes([(
                        ball.radius,
                        ball.radius,
                        ball.radius,
                    )]),
                );
            } else if let Some(cuboid) = shape.as_cuboid() {
                let he = cuboid.half_extents;
                let _ = self.rec.log_static(
                    format!("{entity}/collider"),
                    &rerun::Boxes3D::from_half_sizes([(he.x, he.y, he.z)]),
                );
            }
        }
    }
}

impl Renderer for RerunRenderer {
    fn init(&mut self, world: &PhysicsWorld, stl_meshes: &[(String, Vec<u8>)]) {
        // Set Y-up coordinate system
        let _ = self
            .rec
            .log_static("world", &rerun::ViewCoordinates::RIGHT_HAND_Y_UP());

        // Build a lookup from link name -> STL bytes
        let mesh_map: std::collections::HashMap<&str, &[u8]> = stl_meshes
            .iter()
            .map(|(name, bytes)| (name.as_str(), bytes.as_slice()))
            .collect();

        // Log each link as a static entity with optional mesh
        for (link_name, &handle) in &world.link_map {
            let entity = format!("world/robot/{link_name}");

            if let Some(stl_bytes) = mesh_map.get(link_name.as_str()) {
                if !stl_bytes.is_empty() {
                    let _ = self.rec.log_static(
                        format!("{entity}/mesh"),
                        &rerun::Asset3D::from_file_contents(
                            stl_bytes.to_vec(),
                            Some(rerun::MediaType::STL),
                        ),
                    );
                }
            } else {
                // No mesh provided — log collider primitives as fallback
                self.log_link_colliders(&entity, world, handle);
            }
        }

        // Log ground plane
        if world.ground_collider_handle.is_some() {
            let _ = self.rec.log_static(
                "world/terrain/ground",
                &rerun::Boxes3D::from_half_sizes([(10.0f32, 0.005, 10.0)]),
            );
        }

        // Log battery positions (if foraging terrain)
        if !world.batteries.is_empty() {
            let positions: Vec<(f32, f32, f32)> = world
                .batteries
                .iter()
                .map(|b| (b.position[0], b.position[1], b.position[2]))
                .collect();
            let half_sizes: Vec<(f32, f32, f32)> = world
                .batteries
                .iter()
                .map(|b| (b.radius, b.radius, b.radius))
                .collect();
            let _ = self.rec.log_static(
                "world/terrain/batteries",
                &rerun::Ellipsoids3D::from_half_sizes(half_sizes)
                    .with_centers(positions),
            );
        }

        self.initialized = true;
    }

    fn update(&mut self, world: &PhysicsWorld, step: u64) {
        self.rec.set_time_sequence("step", step as i64);

        // Log transforms for every link
        for (link_name, &handle) in &world.link_map {
            if let Some(body) = world.rigid_body_set.get(handle) {
                let pos = body.position();
                let t = pos.translation;
                let r = pos.rotation;

                let _ = self.rec.log(
                    format!("world/robot/{link_name}"),
                    &rerun::Transform3D::from_translation_rotation(
                        [t.x, t.y, t.z],
                        rerun::Quaternion::from_xyzw([r.i, r.j, r.k, r.w]),
                    ),
                );
            }
        }

        // Log joint angles as scalars
        let joint_positions = world.get_joint_positions();
        for (i, name) in JOINT_NAMES.iter().enumerate() {
            let _ = self.rec.log(
                format!("world/metrics/joints/{name}"),
                &rerun::Scalar::new(joint_positions[i] as f64),
            );
        }

        // Log foot contacts
        let contacts = world.get_foot_contacts();
        for (i, foot_name) in FOOT_LINKS.iter().enumerate() {
            let _ = self.rec.log(
                format!("world/metrics/contacts/{foot_name}"),
                &rerun::Scalar::new(if contacts[i] { 1.0 } else { 0.0 }),
            );
        }

        // Log base height
        let height = world.get_base_height();
        let _ = self.rec.log(
            "world/metrics/height",
            &rerun::Scalar::new(height as f64),
        );

        // Log base velocity magnitude
        let vel = world.get_base_velocity();
        let vel_mag = (vel[0] * vel[0] + vel[1] * vel[1] + vel[2] * vel[2]).sqrt();
        let _ = self.rec.log(
            "world/metrics/velocity",
            &rerun::Scalar::new(vel_mag as f64),
        );

        // Log base orientation (roll, pitch, yaw)
        let rpy = world.get_base_orientation_rpy();
        let _ = self.rec.log(
            "world/metrics/orientation/roll",
            &rerun::Scalar::new(rpy[0] as f64),
        );
        let _ = self.rec.log(
            "world/metrics/orientation/pitch",
            &rerun::Scalar::new(rpy[1] as f64),
        );
        let _ = self.rec.log(
            "world/metrics/orientation/yaw",
            &rerun::Scalar::new(rpy[2] as f64),
        );

        // Update battery positions (they can respawn)
        if !world.batteries.is_empty() {
            let positions: Vec<(f32, f32, f32)> = world
                .batteries
                .iter()
                .map(|b| (b.position[0], b.position[1], b.position[2]))
                .collect();
            let half_sizes: Vec<(f32, f32, f32)> = world
                .batteries
                .iter()
                .map(|b| (b.radius, b.radius, b.radius))
                .collect();
            let _ = self.rec.log(
                "world/terrain/batteries",
                &rerun::Ellipsoids3D::from_half_sizes(half_sizes)
                    .with_centers(positions),
            );
        }
    }

    fn log_scalar(&mut self, name: &str, value: f32) {
        let _ = self.rec.log(
            format!("world/metrics/{name}"),
            &rerun::Scalar::new(value as f64),
        );
    }
}

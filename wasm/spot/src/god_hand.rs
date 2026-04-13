//! God Hand — click and drag to push/pull the robot with a spring force.
//!
//! Right-click to grab the nearest robot body, drag to apply force.
//! Uses Rapier's QueryPipeline for raycasting.

use bevy::prelude::*;
use rapier3d::prelude::*;
use rapier3d::na as rna;

use crate::camera::MainCamera;
use crate::web_bevy::SpotState;

/// State for the god hand interaction.
#[derive(Resource, Default)]
pub struct GodHand {
    /// Currently grabbed rigid body handle
    pub grabbed_body: Option<RigidBodyHandle>,
    /// World-space point where the grab started (on the body surface)
    pub grab_point_local: rna::Vector3<f32>,
    /// Current world-space target (where the mouse is dragging to)
    pub target_world: Option<Vec3>,
    /// Spring stiffness for the grab force
    pub stiffness: f32,
    /// Damping to prevent oscillation
    pub damping: f32,
    /// Is actively dragging
    pub active: bool,
}

impl GodHand {
    pub fn new() -> Self {
        Self {
            stiffness: 50.0,
            damping: 5.0,
            ..Default::default()
        }
    }
}

/// Raycast from screen position into the physics world.
/// Returns (hit_point_world, rigid_body_handle) if a robot body was hit.
fn raycast_into_physics(
    camera_transform: &GlobalTransform,
    camera: &Camera,
    cursor_pos: Vec2,
    physics: &crate::physics::PhysicsWorld,
) -> Option<(Vec3, RigidBodyHandle, rna::Point3<f32>)> {
    // Get ray from camera through cursor
    let ray = camera.viewport_to_world(camera_transform, cursor_pos).ok()?;

    // Convert Bevy ray to Rapier ray
    let ray_origin = rna::Point3::new(ray.origin.x, ray.origin.y, ray.origin.z);
    let ray_dir = rna::Vector3::new(ray.direction.x, ray.direction.y, ray.direction.z);
    let rapier_ray = Ray::new(ray_origin, ray_dir);

    // Cast ray against colliders
    let max_dist = 100.0;
    let solid = true;
    let filter = QueryFilter::default();

    let hit = physics.query_pipeline.cast_ray(
        &physics.rigid_body_set,
        &physics.collider_set,
        &rapier_ray,
        max_dist,
        solid,
        filter,
    )?;

    let (collider_handle, toi) = hit;
    let hit_point = ray_origin + ray_dir * toi;
    let hit_point_bevy = Vec3::new(hit_point.x, hit_point.y, hit_point.z);

    // Get the rigid body owning this collider
    let collider = physics.collider_set.get(collider_handle)?;
    let rb_handle = collider.parent()?;

    // Only grab robot bodies (those in the link_map)
    let is_robot = physics.link_map.values().any(|&h| h == rb_handle);
    if !is_robot {
        return None;
    }

    Some((hit_point_bevy, rb_handle, hit_point))
}

/// System: handle mouse input for god hand grab/drag/release
pub fn god_hand_input(
    mut god_hand: ResMut<GodHand>,
    mut state: ResMut<SpotState>,
    mouse_button: Res<ButtonInput<MouseButton>>,
    windows: Query<&Window>,
    camera_query: Query<(&Camera, &GlobalTransform), With<MainCamera>>,
) {
    let Ok((camera, cam_transform)) = camera_query.get_single() else { return };
    let Ok(window) = windows.get_single() else { return };

    // Right-click to grab
    if mouse_button.just_pressed(MouseButton::Right) {
        if let Some(cursor_pos) = window.cursor_position() {
            if let Some((hit_point, rb_handle, hit_rapier)) =
                raycast_into_physics(cam_transform, camera, cursor_pos, &state.physics)
            {
                // Store grab in local body coordinates
                if let Some(rb) = state.physics.rigid_body_set.get(rb_handle) {
                    let body_pos = rb.position();
                    let local_point = body_pos.inverse_transform_point(&hit_rapier);

                    god_hand.grabbed_body = Some(rb_handle);
                    god_hand.grab_point_local = local_point.coords;
                    god_hand.target_world = Some(hit_point);
                    god_hand.active = true;
                }
            }
        }
    }

    // Drag: update target position
    if god_hand.active && mouse_button.pressed(MouseButton::Right) {
        if let Some(cursor_pos) = window.cursor_position() {
            // Project cursor onto a plane at the grab distance from camera
            if let Some(target) = god_hand.target_world {
                let ray = camera.viewport_to_world(cam_transform, cursor_pos).ok();
                if let Some(ray) = ray {
                    // Intersect ray with plane perpendicular to camera forward at grab distance
                    let cam_forward = cam_transform.forward();
                    let plane_normal = Vec3::new(cam_forward.x, cam_forward.y, cam_forward.z);
                    let plane_point = target;

                    let denom = ray.direction.dot(plane_normal);
                    if denom.abs() > 1e-6 {
                        let t = (plane_point - ray.origin).dot(plane_normal) / denom;
                        if t > 0.0 {
                            god_hand.target_world = Some(ray.origin + *ray.direction * t);
                        }
                    }
                }
            }
        }
    }

    // Release
    if mouse_button.just_released(MouseButton::Right) {
        god_hand.grabbed_body = None;
        god_hand.target_world = None;
        god_hand.active = false;
    }

    // Apply spring force
    if god_hand.active {
        if let (Some(rb_handle), Some(target)) = (god_hand.grabbed_body, god_hand.target_world) {
            let target_rapier = rna::Point3::new(target.x, target.y, target.z);

            if let Some(rb) = state.physics.rigid_body_set.get_mut(rb_handle) {
                // Transform local grab point to world
                let world_grab = rb.position().transform_point(
                    &rna::Point3::from(god_hand.grab_point_local)
                );

                // Spring force: F = -k * (grab_point - target) - d * velocity
                let displacement = world_grab - target_rapier;
                let vel = *rb.linvel();

                let force = -displacement * god_hand.stiffness - vel * god_hand.damping;

                // Apply force at the grab point (creates torque too)
                rb.add_force_at_point(force, world_grab, true);
            }
        }
    }
}

/// System: draw visual indicator for god hand
pub fn god_hand_gizmos(
    god_hand: Res<GodHand>,
    state: Res<SpotState>,
    mut gizmos: Gizmos,
) {
    if !god_hand.active { return; }

    if let (Some(rb_handle), Some(target)) = (god_hand.grabbed_body, god_hand.target_world) {
        if let Some(rb) = state.physics.rigid_body_set.get(rb_handle) {
            // World-space grab point
            let world_grab = rb.position().transform_point(
                &rna::Point3::from(god_hand.grab_point_local)
            );
            let grab_bevy = Vec3::new(world_grab.x, world_grab.y, world_grab.z);

            // Draw line from grab point to target
            let color = if (grab_bevy - target).length() > 0.5 {
                Color::srgb(1.0, 0.3, 0.1) // Red when stretched
            } else {
                Color::srgb(0.3, 1.0, 0.3) // Green when close
            };

            gizmos.line(grab_bevy, target, color);

            // Draw sphere at grab point
            gizmos.sphere(Isometry3d::from_translation(grab_bevy), 0.02, color);
            // Draw sphere at target
            gizmos.sphere(Isometry3d::from_translation(target), 0.03, Color::WHITE);
        }
    }
}

//! Rendering systems for Spot robot simulation.
//!
//! Handles ground grid, material fixing, and visual synchronization.

use bevy::prelude::*;
use bevy::pbr::StandardMaterial;
use std::collections::HashSet;

use crate::scene::{RobotLink, VisualOffset};
use crate::web_bevy::SpotState;

/// Draw ground grid using gizmos (reliable on WebGL2, no shader issues)
pub fn draw_ground_grid(mut gizmos: Gizmos) {
    let grid_color = Color::srgb(0.15, 0.15, 0.18);
    let grid_size = 10.0;
    let grid_step = 1.0;

    // Draw grid lines
    let steps = (grid_size / grid_step) as i32;
    for i in -steps..=steps {
        let pos = i as f32 * grid_step;
        // X-axis lines (along Z)
        gizmos.line(
            Vec3::new(-grid_size, 0.0, pos),
            Vec3::new(grid_size, 0.0, pos),
            grid_color,
        );
        // Z-axis lines (along X)
        gizmos.line(
            Vec3::new(pos, 0.0, -grid_size),
            Vec3::new(pos, 0.0, grid_size),
            grid_color,
        );
    }

    // Draw origin axes (slightly brighter)
    let axis_color = Color::srgb(0.3, 0.3, 0.35);
    gizmos.line(Vec3::new(-grid_size, 0.0, 0.0), Vec3::new(grid_size, 0.0, 0.0), axis_color);
    gizmos.line(Vec3::new(0.0, 0.0, -grid_size), Vec3::new(0.0, 0.0, grid_size), axis_color);
}

/// Fix GLTF materials for WebGL2 compatibility.
/// WebGL2 doesn't support all PBR features, causing "pink" textures.
/// This clears textures and forces unlit mode.
/// Note: Colors are now baked into the GLB files via scripts/colorize-glb.mjs
pub fn fix_materials(
    mut materials: ResMut<Assets<StandardMaterial>>,
    mut fixed: Local<HashSet<AssetId<StandardMaterial>>>,
) {
    for (id, material) in materials.iter_mut() {
        if fixed.contains(&id) {
            continue;
        }

        // Clear ALL textures that could cause pink error in WebGL2
        material.base_color_texture = None;
        material.normal_map_texture = None;
        material.metallic_roughness_texture = None;
        material.occlusion_texture = None;
        material.emissive_texture = None;
        material.depth_map = None;

        // Force unlit mode for WebGL2 compatibility
        material.unlit = true;

        // Keep the base_color from the GLB file (now has proper colors baked in)

        fixed.insert(id);
    }
}

/// Sync visual meshes to physics body poses
pub fn sync_visuals(
    state: Res<SpotState>,
    mut query: Query<(&mut Transform, &RobotLink, Option<&VisualOffset>)>,
) {
    for (mut transform, link, visual_offset) in query.iter_mut() {
        if let Some(&handle) = state.physics.link_map.get(&link.link_name) {
            if let Some(pose) = state.physics.get_body_pose(handle) {
                let t = pose.translation;
                let r = pose.rotation;

                // Physics pose
                let physics_transform = Transform {
                    translation: Vec3::new(t.x, t.y, t.z),
                    rotation: Quat::from_xyzw(r.i, r.j, r.k, r.w),
                    scale: Vec3::ONE,
                };

                // Apply visual offset if present (like original renderer)
                if let Some(offset) = visual_offset {
                    // Combine: physics_transform * visual_offset
                    *transform = physics_transform * offset.offset;
                } else {
                    *transform = physics_transform;
                }
            }
        }
    }
}

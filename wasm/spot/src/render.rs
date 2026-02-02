//! Rendering systems for Spot robot simulation.
//!
//! Handles ground grid, material fixing, and visual synchronization.

use bevy::prelude::*;
use bevy::pbr::StandardMaterial;
use std::collections::HashSet;

use crate::scene::{RobotLink, VisualOffset};
use crate::web_bevy::SpotState;

/// Terrain heightmap - embedded from terrain.json for perfect alignment
/// This is parsed once at runtime via lazy_static
mod heightmap {
    use serde::Deserialize;

    #[derive(Deserialize)]
    pub struct TerrainData {
        pub size: f32,
        pub resolution: usize,
        #[serde(rename = "maxHeight")]
        pub max_height: f32,
        pub heights: Vec<f32>,
    }

    lazy_static::lazy_static! {
        pub static ref TERRAIN: TerrainData = {
            let json = include_str!("../assets/terrain.json");
            serde_json::from_str(json).expect("Failed to parse terrain.json")
        };
    }

    /// Sample height from heightmap at world coordinates
    pub fn sample_height(world_x: f32, world_z: f32) -> f32 {
        let terrain = &*TERRAIN;
        let half_size = terrain.size / 2.0;
        let step = terrain.size / (terrain.resolution as f32 - 1.0);

        // Convert world coords to grid indices
        let grid_x = ((world_x + half_size) / step).clamp(0.0, (terrain.resolution - 1) as f32);
        let grid_z = ((world_z + half_size) / step).clamp(0.0, (terrain.resolution - 1) as f32);

        // Bilinear interpolation
        let x0 = grid_x.floor() as usize;
        let z0 = grid_z.floor() as usize;
        let x1 = (x0 + 1).min(terrain.resolution - 1);
        let z1 = (z0 + 1).min(terrain.resolution - 1);

        let fx = grid_x.fract();
        let fz = grid_z.fract();

        let h00 = terrain.heights[z0 * terrain.resolution + x0];
        let h10 = terrain.heights[z0 * terrain.resolution + x1];
        let h01 = terrain.heights[z1 * terrain.resolution + x0];
        let h11 = terrain.heights[z1 * terrain.resolution + x1];

        let h0 = h00 + fx * (h10 - h00);
        let h1 = h01 + fx * (h11 - h01);

        h0 + fz * (h1 - h0)
    }
}

/// Terrain Y offset (adjusted for max_height=6.0, center at ~3.0m)
const TERRAIN_Y_OFFSET: f32 = -3.0;

/// Draw sharp grid lines that follow terrain height
/// Major lines every 5 meters, minor lines every 1 meter
pub fn draw_ground_grid(_gizmos: Gizmos) {
    // Grid is now rendered via terrain texture for perfect alignment
    // No gizmo rendering needed
}

/// Fix GLTF materials for WebGL2 compatibility.
/// WebGL2 doesn't support all PBR features, causing "pink" textures.
/// Clears problematic textures but keeps base_color_texture for grid.
pub fn fix_materials(
    mut materials: ResMut<Assets<StandardMaterial>>,
    mut fixed: Local<HashSet<AssetId<StandardMaterial>>>,
) {
    for (id, material) in materials.iter_mut() {
        if fixed.contains(&id) {
            continue;
        }

        // Clear textures that cause issues in WebGL2, but keep base_color
        // (base_color_texture is used for terrain grid pattern)
        material.normal_map_texture = None;
        material.metallic_roughness_texture = None;
        material.occlusion_texture = None;
        material.emissive_texture = None;
        material.depth_map = None;

        // Force unlit mode for WebGL2 compatibility
        material.unlit = true;

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

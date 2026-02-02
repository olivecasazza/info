//! Scene setup for Spot robot simulation.
//!
//! Handles loading URDF, spawning GLB meshes, and visual offset components.

use bevy::prelude::*;
use roxmltree::Document;
use std::collections::HashMap;

use crate::camera::{MainCamera, CameraOrbit};
use crate::web_bevy::SpotState;

/// Entity to visual mesh mapping.
#[derive(Component)]
pub struct RobotLink {
    pub link_name: String,
}

/// Visual offset from URDF (applied on top of physics pose)
#[derive(Component)]
pub struct VisualOffset {
    pub offset: Transform,
}

/// Parsed visual offsets from URDF
#[derive(Resource, Default)]
pub struct VisualOffsets {
    pub offsets: HashMap<String, Transform>,
}

/// Marker for terrain mesh
#[derive(Component)]
pub struct Terrain;

/// Setup the scene: camera, lights, and load robot meshes from URDF
pub fn setup_scene(
    mut commands: Commands,
    asset_server: Res<AssetServer>,
    state: Res<SpotState>,
) {
    use bevy::core_pipeline::tonemapping::Tonemapping;

    // Camera with disabled tonemapping and MSAA for WebGL2 performance
    // TonyMcMapFace (default) requires tonemapping_luts feature which isn't available in WebGL2
    commands.spawn((
        Camera3d::default(),
        Transform::from_xyz(2.0, 2.0, 5.0).looking_at(Vec3::ZERO, Vec3::Y),
        Tonemapping::None, // Disable tonemapping for WebGL2
        bevy::render::view::Msaa::Off, // Disable MSAA for performance
        MainCamera,
    ));
    commands.init_resource::<CameraOrbit>();

    // Use ambient light only (directional light adds overhead)
    commands.insert_resource(AmbientLight {
        color: Color::WHITE,
        brightness: 2000.0, // Boosted since we removed directional light
    });

    // Load pre-generated terrain mesh (visual only - physics uses flat ground at Y=0)
    // Offset terrain down by ~3.0 so the flat center area aligns with physics ground
    commands.spawn((
        SceneRoot(asset_server.load("terrain.glb#Scene0")),
        Transform::from_xyz(0.0, -3.0, 0.0),
        Terrain,
    ));

    // Ground grid is drawn via gizmos in draw_ground_grid system

    // Parse URDF for visual information (like original renderer)
    let urdf_content = include_str!("../assets/spot.urdf");
    let doc = Document::parse(urdf_content).expect("Failed to parse URDF");

    let mut visual_offsets = VisualOffsets::default();

    for node in doc.descendants().filter(|n| n.has_tag_name("link")) {
        if let Some(name) = node.attribute("name") {
            if let Some(visual) = node.children().find(|n| n.has_tag_name("visual")) {
                // Parse Visual Offset (like original renderer)
                let mut xyz = Vec3::ZERO;
                let mut rpy = Vec3::ZERO;

                if let Some(origin) = visual.children().find(|n| n.has_tag_name("origin")) {
                    if let Some(xyz_str) = origin.attribute("xyz") {
                        let v: Vec<f32> = xyz_str.split_whitespace().filter_map(|s| s.parse().ok()).collect();
                        if v.len() == 3 { xyz = Vec3::new(v[0], v[1], v[2]); }
                    }
                    if let Some(rpy_str) = origin.attribute("rpy") {
                        let v: Vec<f32> = rpy_str.split_whitespace().filter_map(|s| s.parse().ok()).collect();
                        if v.len() == 3 { rpy = Vec3::new(v[0], v[1], v[2]); }
                    }
                }

                // URDF RPY convention: extrinsic XYZ (R(z)*R(y)*R(x))
                let offset_rotation = Quat::from_euler(EulerRot::ZYX, rpy.z, rpy.y, rpy.x);
                let offset_transform = Transform::from_translation(xyz).with_rotation(offset_rotation);
                visual_offsets.offsets.insert(name.to_string(), offset_transform);

                // Extract mesh filename from geometry
                if let Some(geometry) = visual.children().find(|n| n.has_tag_name("geometry")) {
                    if let Some(mesh_node) = geometry.children().find(|n| n.has_tag_name("mesh")) {
                        if let Some(filename) = mesh_node.attribute("filename") {
                            // Extract stem from filename like "package://mini_ros/stl/OpenQuadruped/MAINBODY.stl"
                            if let Some(stem) = std::path::Path::new(filename)
                                .file_stem()
                                .and_then(|s| s.to_str())
                            {
                                // Load GLB file (we have these in assets/glb/)
                                // Use #Scene0 suffix for scene loading
                                let glb_path = format!("glb/{}.glb#Scene0", stem);

                                web_sys::console::log_1(&format!("Loading GLB for {}: {}", name, glb_path).into());

                                // Spawn GLTF scene with RobotLink marker
                                commands.spawn((
                                    SceneRoot(asset_server.load(&glb_path)),
                                    Transform::from_xyz(0.0, 0.3, 0.0),
                                    RobotLink { link_name: name.to_string() },
                                    VisualOffset { offset: offset_transform },
                                ));
                            }
                        }
                    }
                }
            }
        }
    }

    commands.insert_resource(visual_offsets);

    // Debug: log how many links were found
    web_sys::console::log_1(&format!("Physics link_map count: {}", state.physics.link_map.len()).into());
}

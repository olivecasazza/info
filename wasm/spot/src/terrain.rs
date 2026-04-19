//! Terrain selection and rebuild system.
//!
//! Provides a Bevy resource for terrain type selection and a system that
//! rebuilds the physics world and visual scene when the terrain changes.

use bevy::prelude::*;

use crate::camera::CameraOrbit;
use crate::physics::PhysicsWorld;
use crate::scene::{RobotLink, Terrain, VisualOffset, VisualOffsets};
use crate::web_bevy::SpotState;

/// Available terrain types (mirrors spot_physics::terrain::TerrainType).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TerrainType {
    Flat,
    Heightfield,
    Stairs,
    Platforms,
    Obstacles,
    Slopes,
    Mixed,
}

impl TerrainType {
    pub const ALL: &'static [TerrainType] = &[
        TerrainType::Flat,
        TerrainType::Heightfield,
        TerrainType::Stairs,
        TerrainType::Platforms,
        TerrainType::Obstacles,
        TerrainType::Slopes,
        TerrainType::Mixed,
    ];

    pub fn label(&self) -> &'static str {
        match self {
            TerrainType::Flat => "Flat",
            TerrainType::Heightfield => "Heightfield (Perlin)",
            TerrainType::Stairs => "Stairs",
            TerrainType::Platforms => "Platforms",
            TerrainType::Obstacles => "Obstacles",
            TerrainType::Slopes => "Slopes",
            TerrainType::Mixed => "Mixed",
        }
    }

    /// Convert to the spot_physics TerrainType for the unified constructor.
    fn to_physics(&self) -> spot_physics::terrain::TerrainType {
        match self {
            TerrainType::Flat => spot_physics::terrain::TerrainType::Flat,
            TerrainType::Heightfield => spot_physics::terrain::TerrainType::Heightfield,
            TerrainType::Stairs => spot_physics::terrain::TerrainType::Stairs,
            TerrainType::Platforms => spot_physics::terrain::TerrainType::Platforms,
            TerrainType::Obstacles => spot_physics::terrain::TerrainType::Obstacles,
            TerrainType::Slopes => spot_physics::terrain::TerrainType::Slopes,
            TerrainType::Mixed => spot_physics::terrain::TerrainType::Mixed,
        }
    }
}

/// Resource controlling terrain selection and rebuild triggers.
#[derive(Resource)]
pub struct TerrainSelection {
    pub current_terrain: TerrainType,
    pub difficulty: f32,
    pub seed: u64,
    pub needs_rebuild: bool,
}

impl Default for TerrainSelection {
    fn default() -> Self {
        Self {
            current_terrain: TerrainType::Heightfield,
            difficulty: 0.5,
            seed: 42,
            needs_rebuild: false,
        }
    }
}

/// Marker for procedurally generated terrain visuals (not the GLB terrain).
#[derive(Component)]
pub struct ProceduralTerrainVisual;

/// System that watches `TerrainSelection.needs_rebuild` and reconstructs
/// the physics world, terrain, robot, and visuals.
pub fn terrain_rebuild_system(
    mut commands: Commands,
    mut state: ResMut<SpotState>,
    mut selection: ResMut<TerrainSelection>,
    mut orbit: ResMut<CameraOrbit>,
    asset_server: Res<AssetServer>,
    terrain_query: Query<Entity, With<Terrain>>,
    procedural_query: Query<Entity, With<ProceduralTerrainVisual>>,
    robot_query: Query<Entity, With<RobotLink>>,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    if !selection.needs_rebuild {
        return;
    }
    selection.needs_rebuild = false;

    web_sys::console::log_1(
        &format!(
            "[TERRAIN] Rebuilding: {:?} difficulty={:.2} seed={}",
            selection.current_terrain, selection.difficulty, selection.seed
        )
        .into(),
    );

    // 1. Despawn existing terrain entities (GLB and procedural)
    for entity in terrain_query.iter() {
        commands.entity(entity).despawn_recursive();
    }
    for entity in procedural_query.iter() {
        commands.entity(entity).despawn_recursive();
    }

    // 2. Despawn existing robot link entities
    for entity in robot_query.iter() {
        commands.entity(entity).despawn_recursive();
    }

    // 3. Rebuild the physics world from scratch
    let urdf_content = include_str!("../assets/spot.urdf");
    let mut physics = PhysicsWorld::with_dt(1.0 / 240.0);

    // Use the unified terrain constructor from spot-physics
    let terrain_handles = spot_physics::terrain::create_terrain(
        selection.current_terrain.to_physics(),
        &mut physics.rigid_body_set,
        &mut physics.collider_set,
        selection.seed,
        selection.difficulty,
    );

    // Store the first collider as the ground handle (used for contact checks)
    if let Some(&first) = terrain_handles.first() {
        physics.ground_collider_handle = Some(first);
    }

    // 4. Spawn visual representations of terrain colliders
    spawn_terrain_visuals(
        &mut commands,
        &mut meshes,
        &mut materials,
        &physics,
        &terrain_handles,
        selection.current_terrain,
        selection.seed,
        selection.difficulty,
    );

    // 5. Load robot into new physics world
    spot_physics::urdf::load_robot(&mut physics, urdf_content);
    physics.cache_foot_handles();

    // 6. Rebuild controller with new joint handles
    let mut controller = crate::controller::SpotController::new();
    for (name, handle) in &physics.joint_map {
        controller.register_joint(name, *handle);
    }
    controller.finalize_joint_order();

    // 7. Update state
    state.physics = physics;
    state.controller = controller;
    state.target_command = crate::ml::UserCommand::new();

    // 8. Re-spawn robot visual meshes from URDF
    spawn_robot_visuals(&mut commands, &asset_server, &state);

    // 9. Reset camera
    orbit.target = Vec3::ZERO;
    orbit.distance = 2.5;
    orbit.yaw = 45.0_f32.to_radians();
    orbit.pitch = 30.0_f32.to_radians();
    orbit.following = true;

    web_sys::console::log_1(&"[TERRAIN] Rebuild complete".into());
}

/// Spawn visual meshes for terrain colliders.
///
/// For heightfield terrain, we generate a matching mesh from the Perlin noise.
/// For other types, we spawn a flat ground plane plus iterate the collider set
/// to create box/sphere/cylinder primitives for each non-ground collider.
fn spawn_terrain_visuals(
    commands: &mut Commands,
    meshes: &mut ResMut<Assets<Mesh>>,
    materials: &mut ResMut<Assets<StandardMaterial>>,
    physics: &PhysicsWorld,
    handles: &[rapier3d::prelude::ColliderHandle],
    terrain_type: TerrainType,
    seed: u64,
    difficulty: f32,
) {
    let ground_material = materials.add(StandardMaterial {
        base_color: Color::srgba(0.05, 0.05, 0.05, 0.9),
        unlit: true,
        alpha_mode: AlphaMode::Blend,
        ..default()
    });

    let obstacle_material = materials.add(StandardMaterial {
        base_color: Color::srgba(0.12, 0.12, 0.12, 0.9),
        unlit: true,
        alpha_mode: AlphaMode::Blend,
        double_sided: true,
        cull_mode: None,
        ..default()
    });

    match terrain_type {
        TerrainType::Flat => {
            // Simple flat plane
            let mesh = meshes.add(Plane3d::new(Vec3::Y, Vec2::splat(50.0)));
            commands.spawn((
                Mesh3d(mesh),
                MeshMaterial3d(ground_material),
                Transform::from_xyz(0.0, 0.0, 0.0),
                ProceduralTerrainVisual,
            ));
        }
        TerrainType::Heightfield => {
            // Generate mesh matching the Perlin heightfield
            spawn_heightfield_visual(commands, meshes, materials, seed, difficulty);
        }
        _ => {
            // For stairs, platforms, obstacles, slopes, mixed:
            // Spawn a flat ground plane, then iterate colliders to create
            // visual primitives for each non-halfspace collider.
            let plane_mesh = meshes.add(Plane3d::new(Vec3::Y, Vec2::splat(50.0)));
            commands.spawn((
                Mesh3d(plane_mesh),
                MeshMaterial3d(ground_material),
                Transform::from_xyz(0.0, 0.0, 0.0),
                ProceduralTerrainVisual,
            ));

            // Create visuals for each terrain collider that has a concrete shape
            for &handle in handles {
                if let Some(collider) = physics.collider_set.get(handle) {
                    let shape = collider.shape();
                    let pos = collider.position();
                    let translation = Vec3::new(
                        pos.translation.x,
                        pos.translation.y,
                        pos.translation.z,
                    );
                    let rotation = Quat::from_xyzw(
                        pos.rotation.i,
                        pos.rotation.j,
                        pos.rotation.k,
                        pos.rotation.w,
                    );

                    // Skip halfspace (infinite ground plane) -- already drawn above
                    if shape.as_halfspace().is_some() {
                        continue;
                    }

                    if let Some(cuboid) = shape.as_cuboid() {
                        let he = cuboid.half_extents;
                        let mesh = meshes.add(Cuboid::new(he.x * 2.0, he.y * 2.0, he.z * 2.0));
                        commands.spawn((
                            Mesh3d(mesh),
                            MeshMaterial3d(obstacle_material.clone()),
                            Transform {
                                translation,
                                rotation,
                                scale: Vec3::ONE,
                            },
                            ProceduralTerrainVisual,
                        ));
                    } else if let Some(ball) = shape.as_ball() {
                        let mesh = meshes.add(Sphere::new(ball.radius));
                        commands.spawn((
                            Mesh3d(mesh),
                            MeshMaterial3d(obstacle_material.clone()),
                            Transform {
                                translation,
                                rotation,
                                scale: Vec3::ONE,
                            },
                            ProceduralTerrainVisual,
                        ));
                    } else if let Some(cylinder) = shape.as_cylinder() {
                        let mesh =
                            meshes.add(Cylinder::new(cylinder.radius, cylinder.half_height * 2.0));
                        commands.spawn((
                            Mesh3d(mesh),
                            MeshMaterial3d(obstacle_material.clone()),
                            Transform {
                                translation,
                                rotation,
                                scale: Vec3::ONE,
                            },
                            ProceduralTerrainVisual,
                        ));
                    } else if shape.as_trimesh().is_some() {
                        // Trimesh colliders (heightfield variants) -- skip for now,
                        // these are complex to extract. The flat ground plane gives
                        // context and the collider shapes above cover discrete objects.
                    }
                }
            }
        }
    }
}

/// Spawn robot visual meshes by parsing the URDF (mirrors scene::setup_scene logic).
fn spawn_robot_visuals(
    commands: &mut Commands,
    asset_server: &Res<AssetServer>,
    state: &ResMut<SpotState>,
) {
    let urdf_content = include_str!("../assets/spot.urdf");
    let doc = roxmltree::Document::parse(urdf_content).expect("Failed to parse URDF");

    let mut visual_offsets = VisualOffsets::default();

    for node in doc.descendants().filter(|n| n.has_tag_name("link")) {
        if let Some(name) = node.attribute("name") {
            if let Some(visual) = node.children().find(|n| n.has_tag_name("visual")) {
                let mut xyz = Vec3::ZERO;
                let mut rpy = Vec3::ZERO;

                if let Some(origin) = visual.children().find(|n| n.has_tag_name("origin")) {
                    if let Some(xyz_str) = origin.attribute("xyz") {
                        let v: Vec<f32> = xyz_str
                            .split_whitespace()
                            .filter_map(|s| s.parse().ok())
                            .collect();
                        if v.len() == 3 {
                            xyz = Vec3::new(v[0], v[1], v[2]);
                        }
                    }
                    if let Some(rpy_str) = origin.attribute("rpy") {
                        let v: Vec<f32> = rpy_str
                            .split_whitespace()
                            .filter_map(|s| s.parse().ok())
                            .collect();
                        if v.len() == 3 {
                            rpy = Vec3::new(v[0], v[1], v[2]);
                        }
                    }
                }

                let offset_rotation = Quat::from_euler(EulerRot::ZYX, rpy.z, rpy.y, rpy.x);
                let offset_transform =
                    Transform::from_translation(xyz).with_rotation(offset_rotation);
                visual_offsets
                    .offsets
                    .insert(name.to_string(), offset_transform);

                if let Some(geometry) = visual.children().find(|n| n.has_tag_name("geometry")) {
                    if let Some(mesh_node) = geometry.children().find(|n| n.has_tag_name("mesh")) {
                        if let Some(filename) = mesh_node.attribute("filename") {
                            if let Some(stem) = std::path::Path::new(filename)
                                .file_stem()
                                .and_then(|s| s.to_str())
                            {
                                let glb_path = format!("glb/{}.glb#Scene0", stem);
                                commands.spawn((
                                    SceneRoot(asset_server.load(&glb_path)),
                                    Transform::from_xyz(0.0, 0.3, 0.0),
                                    RobotLink {
                                        link_name: name.to_string(),
                                    },
                                    VisualOffset {
                                        offset: offset_transform,
                                    },
                                ));
                            }
                        }
                    }
                }
            }
        }
    }

    commands.insert_resource(visual_offsets);

    web_sys::console::log_1(
        &format!(
            "[TERRAIN] Re-spawned robot, link_map count: {}",
            state.physics.link_map.len()
        )
        .into(),
    );
}

/// Spawn a procedural mesh visualizing the Perlin heightfield terrain.
fn spawn_heightfield_visual(
    commands: &mut Commands,
    meshes: &mut ResMut<Assets<Mesh>>,
    materials: &mut ResMut<Assets<StandardMaterial>>,
    seed: u64,
    difficulty: f32,
) {
    use noise::{NoiseFn, Perlin};

    let perlin = Perlin::new(seed as u32);
    let res = 64usize;
    let size = 10.0f32;
    let half_size = size / 2.0;
    let step = size / (res as f32 - 1.0);
    let height_scale = 0.05 * difficulty;

    let mut positions: Vec<[f32; 3]> = Vec::with_capacity(res * res);
    let mut normals: Vec<[f32; 3]> = Vec::with_capacity(res * res);
    let mut uvs: Vec<[f32; 2]> = Vec::with_capacity(res * res);

    for z in 0..res {
        for x in 0..res {
            let wx = (x as f32) * step - half_size;
            let wz = (z as f32) * step - half_size;

            let mut h = perlin.get([wx as f64 * 0.3, wz as f64 * 0.3]) as f32;
            h += 0.5 * perlin.get([wx as f64 * 0.6, wz as f64 * 0.6]) as f32;
            h *= height_scale;

            let dist = (wx * wx + wz * wz).sqrt();
            let flatten = (1.0 - dist / 2.0).max(0.0);
            h *= 1.0 - flatten;

            positions.push([wx, h, wz]);
            normals.push([0.0, 1.0, 0.0]);
            uvs.push([x as f32 / (res - 1) as f32, z as f32 / (res - 1) as f32]);
        }
    }

    let mut indices: Vec<u32> = Vec::new();
    for z in 0..(res - 1) {
        for x in 0..(res - 1) {
            let tl = (z * res + x) as u32;
            let tr = tl + 1;
            let bl = ((z + 1) * res + x) as u32;
            let br = bl + 1;
            indices.push(tl);
            indices.push(bl);
            indices.push(tr);
            indices.push(tr);
            indices.push(bl);
            indices.push(br);
        }
    }

    let mut mesh = Mesh::new(
        bevy::render::mesh::PrimitiveTopology::TriangleList,
        bevy::render::render_asset::RenderAssetUsages::default(),
    );
    mesh.insert_attribute(Mesh::ATTRIBUTE_POSITION, positions);
    mesh.insert_attribute(Mesh::ATTRIBUTE_NORMAL, normals);
    mesh.insert_attribute(Mesh::ATTRIBUTE_UV_0, uvs);
    mesh.insert_indices(bevy::render::mesh::Indices::U32(indices));

    let mesh_handle = meshes.add(mesh);
    let material = materials.add(StandardMaterial {
        base_color: Color::srgba(0.05, 0.05, 0.05, 0.9),
        unlit: true,
        alpha_mode: AlphaMode::Blend,
        double_sided: true,
        cull_mode: None,
        ..default()
    });

    commands.spawn((
        Mesh3d(mesh_handle),
        MeshMaterial3d(material),
        Transform::IDENTITY,
        ProceduralTerrainVisual,
    ));
}

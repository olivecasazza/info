use rapier3d::prelude::*;
use rapier3d::na::Point3;
use noise::{NoiseFn, Perlin};

/// Create a flat infinite ground plane at Y=0.
pub fn create_flat_ground(collider_set: &mut ColliderSet) -> ColliderHandle {
    let ground = ColliderBuilder::halfspace(Vector::y_axis())
        .friction(1.0)
        .restitution(0.0)
        .collision_groups(InteractionGroups::new(Group::GROUP_1, Group::GROUP_2))
        .build();
    collider_set.insert(ground)
}

/// Create a random Perlin-noise heightfield terrain (used by training).
pub fn create_heightfield_random(
    collider_set: &mut ColliderSet,
    seed: u64,
    difficulty: f32,
) -> ColliderHandle {
    let perlin = Perlin::new(seed as u32);
    let res = 64usize;
    let size = 10.0f32;
    let half_size = size / 2.0;
    let step = size / (res as f32 - 1.0);
    let height_scale = 0.05 * difficulty;

    let mut vertices: Vec<Point3<f32>> = Vec::with_capacity(res * res);
    for z in 0..res {
        for x in 0..res {
            let wx = (x as f32) * step - half_size;
            let wz = (z as f32) * step - half_size;

            let mut h = perlin.get([wx as f64 * 0.3, wz as f64 * 0.3]) as f32;
            h += 0.5 * perlin.get([wx as f64 * 0.6, wz as f64 * 0.6]) as f32;
            h *= height_scale;

            // Flatten center for spawn safety
            let dist = (wx * wx + wz * wz).sqrt();
            let flatten = (1.0 - dist / 2.0).max(0.0);
            h *= 1.0 - flatten;

            vertices.push(Point3::new(wx, h, wz));
        }
    }

    let mut indices: Vec<[u32; 3]> = Vec::new();
    for z in 0..(res - 1) {
        for x in 0..(res - 1) {
            let tl = (z * res + x) as u32;
            let tr = tl + 1;
            let bl = ((z + 1) * res + x) as u32;
            let br = bl + 1;
            indices.push([tl, bl, tr]);
            indices.push([tr, bl, br]);
        }
    }

    let trimesh = SharedShape::trimesh(vertices, indices);
    let ground = ColliderBuilder::new(trimesh)
        .friction(1.0)
        .restitution(0.0)
        .collision_groups(InteractionGroups::new(Group::GROUP_1, Group::GROUP_2))
        .build();
    collider_set.insert(ground)
}

/// Create a terrain trimesh from a precomputed height array (used by WASM app).
///
/// * `heights` - row-major height values, length must be `resolution * resolution`
/// * `resolution` - number of vertices per axis
/// * `size` - world-space extent of the terrain
/// * `y_offset` - vertical offset applied to all heights
pub fn create_heightfield_from_heights(
    collider_set: &mut ColliderSet,
    heights: &[f32],
    resolution: usize,
    size: f32,
    y_offset: f32,
) -> ColliderHandle {
    let half_size = size / 2.0;
    let step = size / (resolution as f32 - 1.0);

    let mut vertices: Vec<Point3<f32>> = Vec::with_capacity(resolution * resolution);
    for z in 0..resolution {
        for x in 0..resolution {
            let world_x = (x as f32) * step - half_size;
            let world_z = (z as f32) * step - half_size;
            let y = heights[z * resolution + x] + y_offset;
            vertices.push(Point3::new(world_x, y, world_z));
        }
    }

    let mut indices: Vec<[u32; 3]> = Vec::new();
    for z in 0..(resolution - 1) {
        for x in 0..(resolution - 1) {
            let tl = (z * resolution + x) as u32;
            let tr = tl + 1;
            let bl = ((z + 1) * resolution + x) as u32;
            let br = bl + 1;
            indices.push([tl, bl, tr]);
            indices.push([tr, bl, br]);
        }
    }

    let trimesh = SharedShape::trimesh(vertices, indices);
    let ground = ColliderBuilder::new(trimesh)
        .friction(1.0)
        .restitution(0.0)
        .collision_groups(InteractionGroups::new(Group::GROUP_1, Group::GROUP_2))
        .build();
    collider_set.insert(ground)
}

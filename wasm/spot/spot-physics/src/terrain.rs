use rapier3d::prelude::*;
use rapier3d::na::Point3;
use noise::{NoiseFn, Perlin};

// ---------------------------------------------------------------------------
// Deterministic PRNG (SplitMix64) — wasm-safe, no external crate needed
// ---------------------------------------------------------------------------

struct Rng(u64);

impl Rng {
    fn new(seed: u64) -> Self {
        Self(seed)
    }

    fn next_u64(&mut self) -> u64 {
        self.0 = self.0.wrapping_add(0x9e3779b97f4a7c15);
        let mut z = self.0;
        z = (z ^ (z >> 30)).wrapping_mul(0xbf58476d1ce4e5b9);
        z = (z ^ (z >> 27)).wrapping_mul(0x94d049bb133111eb);
        z ^ (z >> 31)
    }

    /// Uniform f32 in [0, 1).
    fn f32(&mut self) -> f32 {
        (self.next_u64() >> 40) as f32 / (1u64 << 24) as f32
    }

    /// Uniform f32 in [lo, hi).
    fn range(&mut self, lo: f32, hi: f32) -> f32 {
        lo + self.f32() * (hi - lo)
    }

    /// Uniform usize in [0, n).
    fn usize(&mut self, n: usize) -> usize {
        (self.next_u64() % n as u64) as usize
    }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const GROUND_GROUPS: fn() -> InteractionGroups =
    || InteractionGroups::new(Group::GROUP_1, Group::GROUP_2);

/// Returns true if the position is inside the flat spawn safe-zone (radius ~1m).
fn in_spawn_zone(x: f32, z: f32) -> bool {
    x * x + z * z < 1.0
}

// ---------------------------------------------------------------------------
// TerrainType enum + registry
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TerrainType {
    Flat,
    Heightfield,
    Stairs,
    Platforms,
    Obstacles,
    DynamicObstacles,
    Slopes,
    Mixed,
}

impl TerrainType {
    /// Parse from a string (used by the gym / WASM bridge).
    pub fn from_str(s: &str) -> Self {
        match s {
            "flat" => Self::Flat,
            "heightfield" => Self::Heightfield,
            "stairs" => Self::Stairs,
            "platforms" => Self::Platforms,
            "obstacles" => Self::Obstacles,
            "dynamic_obstacles" => Self::DynamicObstacles,
            "slopes" => Self::Slopes,
            "mixed" => Self::Mixed,
            _ => Self::Flat,
        }
    }
}

/// Unified terrain constructor. Returns collider handles for all terrain pieces.
///
/// For terrain types that need dynamic rigid bodies (DynamicObstacles, Mixed),
/// those bodies are inserted into `rigid_body_set` as a side-effect; only the
/// collider handles are returned for consistency.
pub fn create_terrain(
    terrain_type: TerrainType,
    rigid_body_set: &mut RigidBodySet,
    collider_set: &mut ColliderSet,
    seed: u64,
    difficulty: f32,
) -> Vec<ColliderHandle> {
    let d = difficulty.clamp(0.0, 1.0);
    match terrain_type {
        TerrainType::Flat => {
            vec![create_flat_ground(collider_set)]
        }
        TerrainType::Heightfield => {
            vec![create_heightfield_random(collider_set, seed, d)]
        }
        TerrainType::Stairs => {
            create_stairs(collider_set, 0.04 + 0.12 * d, 0.3, (6.0 + 10.0 * d) as usize, 2.0, true)
        }
        TerrainType::Platforms => {
            create_platforms(collider_set, seed, d)
        }
        TerrainType::Obstacles => {
            create_obstacle_course(collider_set, seed, d)
        }
        TerrainType::DynamicObstacles => {
            let pairs = create_dynamic_obstacles(rigid_body_set, collider_set, seed, d);
            pairs.into_iter().map(|(_, ch)| ch).collect()
        }
        TerrainType::Slopes => {
            create_slopes(collider_set, 5.0_f32.to_radians() + 25.0_f32.to_radians() * d, 2.0, 4.0)
        }
        TerrainType::Mixed => {
            create_mixed_terrain(rigid_body_set, collider_set, seed, d)
        }
    }
}

// ---------------------------------------------------------------------------
// 1. Flat ground (existing)
// ---------------------------------------------------------------------------

/// Create a flat infinite ground plane at Y=0.
pub fn create_flat_ground(collider_set: &mut ColliderSet) -> ColliderHandle {
    let ground = ColliderBuilder::halfspace(Vector::y_axis())
        .friction(1.0)
        .restitution(0.0)
        .collision_groups(GROUND_GROUPS())
        .build();
    collider_set.insert(ground)
}

// ---------------------------------------------------------------------------
// 2. Heightfield (existing)
// ---------------------------------------------------------------------------

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
        .collision_groups(GROUND_GROUPS())
        .build();
    collider_set.insert(ground)
}

// ---------------------------------------------------------------------------
// 3. Heightfield from pre-computed heights (existing, used by WASM app)
// ---------------------------------------------------------------------------

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
        .collision_groups(GROUND_GROUPS())
        .build();
    collider_set.insert(ground)
}

// ---------------------------------------------------------------------------
// 4. Stairs
// ---------------------------------------------------------------------------

/// Create an ascending or descending staircase from box colliders.
///
/// * `step_height` - height of each step (m)
/// * `step_depth` - depth of each step along the walking axis (m)
/// * `num_steps` - total number of steps
/// * `width` - staircase width (m)
/// * `ascending` - if true stairs go up along +X; if false, down
pub fn create_stairs(
    collider_set: &mut ColliderSet,
    step_height: f32,
    step_depth: f32,
    num_steps: usize,
    width: f32,
    ascending: bool,
) -> Vec<ColliderHandle> {
    let mut handles = Vec::with_capacity(num_steps + 1);

    // Flat ground plane underneath
    handles.push(create_flat_ground(collider_set));

    // Stairs start beyond the spawn zone at x = 1.5
    let x_start = 1.5;

    for i in 0..num_steps {
        let step_i = if ascending { i } else { num_steps - 1 - i };
        let y = (step_i + 1) as f32 * step_height;
        let x = x_start + i as f32 * step_depth + step_depth * 0.5;

        // Each step is a cuboid; half-extents
        let col = ColliderBuilder::cuboid(step_depth * 0.5, y * 0.5, width * 0.5)
            .friction(1.0)
            .restitution(0.0)
            .collision_groups(GROUND_GROUPS())
            .translation(vector![x, y * 0.5, 0.0])
            .build();
        handles.push(collider_set.insert(col));
    }

    // Upper platform at the top of the stairs
    let top_height = num_steps as f32 * step_height;
    let platform_length = 2.0; // 2m deep platform at the top
    let platform_x = x_start + num_steps as f32 * step_depth + platform_length * 0.5;
    let col = ColliderBuilder::cuboid(platform_length * 0.5, top_height * 0.5, width * 0.5)
        .friction(1.0)
        .restitution(0.0)
        .collision_groups(GROUND_GROUPS())
        .translation(vector![platform_x, top_height * 0.5, 0.0])
        .build();
    handles.push(collider_set.insert(col));

    handles
}

// ---------------------------------------------------------------------------
// 5. Platforms
// ---------------------------------------------------------------------------

/// Scattered rectangular platforms at varying heights.
pub fn create_platforms(
    collider_set: &mut ColliderSet,
    seed: u64,
    difficulty: f32,
) -> Vec<ColliderHandle> {
    let mut rng = Rng::new(seed);
    let count = 8 + (12.0 * difficulty) as usize; // 8..20 platforms
    let max_height = 0.02 + 0.13 * difficulty; // 0.02..0.15m
    let arena = 4.0f32;

    let mut handles = Vec::with_capacity(count + 1);
    handles.push(create_flat_ground(collider_set));

    for _ in 0..count {
        let hx = rng.range(0.15, 0.6); // half-width x
        let hz = rng.range(0.15, 0.6); // half-width z
        let h = rng.range(0.02, max_height);

        // Random position, reject if in spawn zone
        let (px, pz) = loop {
            let x = rng.range(-arena, arena);
            let z = rng.range(-arena, arena);
            if !in_spawn_zone(x, z) {
                break (x, z);
            }
        };

        let col = ColliderBuilder::cuboid(hx, h * 0.5, hz)
            .friction(1.0)
            .restitution(0.0)
            .collision_groups(GROUND_GROUPS())
            .translation(vector![px, h * 0.5, pz])
            .build();
        handles.push(collider_set.insert(col));
    }

    handles
}

// ---------------------------------------------------------------------------
// 6. Obstacle course
// ---------------------------------------------------------------------------

/// Static random solids (boxes, cylinders, spheres) scattered in the arena.
pub fn create_obstacle_course(
    collider_set: &mut ColliderSet,
    seed: u64,
    difficulty: f32,
) -> Vec<ColliderHandle> {
    let mut rng = Rng::new(seed);
    let count = 10 + (20.0 * difficulty) as usize; // 10..30 obstacles
    let max_size = 0.05 + 0.25 * difficulty; // 0.05..0.30m
    let arena = 4.0f32;

    let mut handles = Vec::with_capacity(count + 1);
    handles.push(create_flat_ground(collider_set));

    for _ in 0..count {
        let (px, pz) = loop {
            let x = rng.range(-arena, arena);
            let z = rng.range(-arena, arena);
            if !in_spawn_zone(x, z) {
                break (x, z);
            }
        };

        let size = rng.range(0.05, max_size);
        let shape_type = rng.usize(3);

        let col = match shape_type {
            0 => {
                // Box
                let hx = rng.range(size * 0.5, size);
                let hy = rng.range(size * 0.3, size);
                let hz = rng.range(size * 0.5, size);
                ColliderBuilder::cuboid(hx, hy, hz)
                    .translation(vector![px, hy, pz])
            }
            1 => {
                // Cylinder (upright)
                let r = size * 0.5;
                let half_h = rng.range(size * 0.3, size);
                ColliderBuilder::cylinder(half_h, r)
                    .translation(vector![px, half_h, pz])
            }
            _ => {
                // Sphere
                let r = size * 0.5;
                ColliderBuilder::ball(r)
                    .translation(vector![px, r, pz])
            }
        };

        let col = col
            .friction(0.8)
            .restitution(0.1)
            .collision_groups(GROUND_GROUPS())
            .build();
        handles.push(collider_set.insert(col));
    }

    handles
}

// ---------------------------------------------------------------------------
// 7. Dynamic obstacles
// ---------------------------------------------------------------------------

/// Moving/falling dynamic rigid bodies (spheres and boxes).
/// Returns (RigidBodyHandle, ColliderHandle) pairs.
pub fn create_dynamic_obstacles(
    rigid_body_set: &mut RigidBodySet,
    collider_set: &mut ColliderSet,
    seed: u64,
    difficulty: f32,
) -> Vec<(RigidBodyHandle, ColliderHandle)> {
    let mut rng = Rng::new(seed);
    let count = 4 + (12.0 * difficulty) as usize; // 4..16 objects
    let arena = 3.5f32;

    // Flat ground underneath (static, added separately)
    let _ground = create_flat_ground(collider_set);

    let mut pairs = Vec::with_capacity(count);

    for _ in 0..count {
        let (px, pz) = loop {
            let x = rng.range(-arena, arena);
            let z = rng.range(-arena, arena);
            if !in_spawn_zone(x, z) {
                break (x, z);
            }
        };

        let size = rng.range(0.04, 0.08 + 0.12 * difficulty);
        let elevated = rng.f32() < 0.5;
        let py = if elevated { rng.range(0.3, 1.0) } else { size + 0.01 };

        let rb = RigidBodyBuilder::dynamic()
            .translation(vector![px, py, pz])
            .linear_damping(0.3)
            .angular_damping(0.5)
            .build();
        let rb_handle = rigid_body_set.insert(rb);

        let is_sphere = rng.f32() < 0.5;
        let col = if is_sphere {
            ColliderBuilder::ball(size)
        } else {
            ColliderBuilder::cuboid(size, size, size)
        };

        let col = col
            .friction(0.6)
            .restitution(0.3)
            .density(200.0)
            .collision_groups(GROUND_GROUPS())
            .build();
        let col_handle = collider_set.insert_with_parent(col, rb_handle, rigid_body_set);

        // Give sliding objects an initial velocity push
        if !elevated {
            let vx = rng.range(-0.3, 0.3) * difficulty;
            let vz = rng.range(-0.3, 0.3) * difficulty;
            if let Some(rb) = rigid_body_set.get_mut(rb_handle) {
                rb.set_linvel(vector![vx, 0.0, vz], true);
            }
        }

        pairs.push((rb_handle, col_handle));
    }

    pairs
}

// ---------------------------------------------------------------------------
// 8. Slopes
// ---------------------------------------------------------------------------

/// Angled ramps built from rotated box colliders.
///
/// * `angle` - ramp angle in radians
/// * `width` - ramp width (m)
/// * `length` - ramp length along the slope (m)
pub fn create_slopes(
    collider_set: &mut ColliderSet,
    angle: f32,
    width: f32,
    length: f32,
) -> Vec<ColliderHandle> {
    let mut handles = Vec::with_capacity(5);
    handles.push(create_flat_ground(collider_set));

    let thickness = 0.1;
    let half_len = length * 0.5;
    let half_w = width * 0.5;
    let half_t = thickness * 0.5;

    // Ramp center is elevated so the bottom edge starts at ground level
    let cx = 1.5 + half_len * angle.cos();
    let cy = half_len * angle.sin();

    // Rotation around Z axis (pitch)
    let rotation = vector![0.0, 0.0, angle];

    // Up ramp along +X
    let col = ColliderBuilder::cuboid(half_len, half_t, half_w)
        .friction(1.0)
        .restitution(0.0)
        .collision_groups(GROUND_GROUPS())
        .position(Isometry::new(vector![cx, cy, 0.0], rotation))
        .build();
    handles.push(collider_set.insert(col));

    // Down ramp (opposite side, along -X)
    let col = ColliderBuilder::cuboid(half_len, half_t, half_w)
        .friction(1.0)
        .restitution(0.0)
        .collision_groups(GROUND_GROUPS())
        .position(Isometry::new(vector![-cx, cy, 0.0], vector![0.0, 0.0, -angle]))
        .build();
    handles.push(collider_set.insert(col));

    // Side ramps along +Z and -Z
    let rotation_x = vector![angle, 0.0, 0.0];
    let cz = 1.5 + half_len * angle.cos();

    let col = ColliderBuilder::cuboid(half_w, half_t, half_len)
        .friction(1.0)
        .restitution(0.0)
        .collision_groups(GROUND_GROUPS())
        .position(Isometry::new(vector![0.0, cy, cz], rotation_x))
        .build();
    handles.push(collider_set.insert(col));

    let col = ColliderBuilder::cuboid(half_w, half_t, half_len)
        .friction(1.0)
        .restitution(0.0)
        .collision_groups(GROUND_GROUPS())
        .position(Isometry::new(vector![0.0, cy, -cz], vector![-angle, 0.0, 0.0]))
        .build();
    handles.push(collider_set.insert(col));

    handles
}

// ---------------------------------------------------------------------------
// 9. Mixed terrain
// ---------------------------------------------------------------------------

/// Combination of all terrain types arranged in sectors around a central spawn.
///
/// Layout (top-down, +X right, +Z down):
///   - Center: flat spawn area
///   - +X sector: stairs
///   - -X sector: slopes
///   - +Z sector: platforms
///   - -Z sector: obstacles
///   - Scattered: dynamic obstacles (few)
pub fn create_mixed_terrain(
    rigid_body_set: &mut RigidBodySet,
    collider_set: &mut ColliderSet,
    seed: u64,
    difficulty: f32,
) -> Vec<ColliderHandle> {
    let mut handles = Vec::new();

    // Base ground
    handles.push(create_flat_ground(collider_set));

    // +X sector: stairs (fewer steps, scaled by difficulty)
    let num_steps = 3 + (6.0 * difficulty) as usize;
    let step_h = 0.03 + 0.08 * difficulty;
    for h in create_stairs(collider_set, step_h, 0.3, num_steps, 1.5, true) {
        // Skip duplicate flat grounds from sub-generators
        handles.push(h);
    }

    // -X sector: slopes
    let angle = 5.0_f32.to_radians() + 15.0_f32.to_radians() * difficulty;
    // Place slopes manually in -X region
    let thickness = 0.1;
    let length = 3.0;
    let half_len = length * 0.5;
    let half_t = thickness * 0.5;
    let cx = -(1.5 + half_len * angle.cos());
    let cy = half_len * angle.sin();
    let col = ColliderBuilder::cuboid(half_len, half_t, 1.0)
        .friction(1.0)
        .restitution(0.0)
        .collision_groups(GROUND_GROUPS())
        .position(Isometry::new(vector![cx, cy, 0.0], vector![0.0, 0.0, -angle]))
        .build();
    handles.push(collider_set.insert(col));

    // +Z sector: platforms
    let mut rng = Rng::new(seed.wrapping_add(1));
    let plat_count = 4 + (8.0 * difficulty) as usize;
    let max_h = 0.02 + 0.10 * difficulty;
    for _ in 0..plat_count {
        let hx = rng.range(0.15, 0.5);
        let hz = rng.range(0.15, 0.5);
        let h = rng.range(0.02, max_h);
        let px = rng.range(-2.5, 2.5);
        let pz = rng.range(1.5, 5.0);
        if !in_spawn_zone(px, pz) {
            let col = ColliderBuilder::cuboid(hx, h * 0.5, hz)
                .friction(1.0)
                .restitution(0.0)
                .collision_groups(GROUND_GROUPS())
                .translation(vector![px, h * 0.5, pz])
                .build();
            handles.push(collider_set.insert(col));
        }
    }

    // -Z sector: static obstacles
    let mut rng2 = Rng::new(seed.wrapping_add(2));
    let obs_count = 5 + (10.0 * difficulty) as usize;
    let max_size = 0.05 + 0.20 * difficulty;
    for _ in 0..obs_count {
        let px = rng2.range(-2.5, 2.5);
        let pz = rng2.range(-5.0, -1.5);
        if !in_spawn_zone(px, pz) {
            let size = rng2.range(0.05, max_size);
            let shape = rng2.usize(2);
            let col = match shape {
                0 => {
                    ColliderBuilder::cuboid(size, size * 0.7, size)
                        .translation(vector![px, size * 0.7, pz])
                }
                _ => {
                    ColliderBuilder::ball(size * 0.5)
                        .translation(vector![px, size * 0.5, pz])
                }
            };
            let col = col
                .friction(0.8)
                .restitution(0.1)
                .collision_groups(GROUND_GROUPS())
                .build();
            handles.push(collider_set.insert(col));
        }
    }

    // Scattered dynamic obstacles (very few, for perturbation)
    let dyn_count = 2 + (4.0 * difficulty) as usize;
    let mut rng3 = Rng::new(seed.wrapping_add(3));
    for _ in 0..dyn_count {
        let (px, pz) = loop {
            let x = rng3.range(-3.5, 3.5);
            let z = rng3.range(-3.5, 3.5);
            if !in_spawn_zone(x, z) {
                break (x, z);
            }
        };
        let size = rng3.range(0.04, 0.06 + 0.06 * difficulty);
        let py = rng3.range(0.3, 0.8);

        let rb = RigidBodyBuilder::dynamic()
            .translation(vector![px, py, pz])
            .linear_damping(0.3)
            .angular_damping(0.5)
            .build();
        let rb_handle = rigid_body_set.insert(rb);

        let col = ColliderBuilder::ball(size)
            .friction(0.6)
            .restitution(0.3)
            .density(200.0)
            .collision_groups(GROUND_GROUPS())
            .build();
        let ch = collider_set.insert_with_parent(col, rb_handle, rigid_body_set);
        handles.push(ch);
    }

    handles
}

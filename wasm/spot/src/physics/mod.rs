use rapier3d::prelude::*;

// Perlin noise implementation for terrain generation
// Must match generate-terrain.mjs exactly for visual/physics alignment

const SEED: u32 = 42;

fn seeded_random(seed: u32) -> f32 {
    // Must match JS: Math.sin(seed) * 10000
    let x = (seed as f32).sin() * 10000.0;
    x - x.floor()
}

fn generate_perm() -> [u8; 512] {
    let mut p: [u8; 256] = core::array::from_fn(|i| i as u8);

    // Shuffle using seed
    for i in (1..256).rev() {
        let j = (seeded_random(SEED + i as u32) * (i as f32 + 1.0)) as usize;
        p.swap(i, j);
    }

    let mut perm = [0u8; 512];
    for i in 0..512 {
        perm[i] = p[i & 255];
    }
    perm
}

lazy_static::lazy_static! {
    static ref PERM: [u8; 512] = generate_perm();
}

fn fade(t: f32) -> f32 {
    t * t * t * (t * (t * 6.0 - 15.0) + 10.0)
}

fn grad(hash: u8, x: f32, y: f32) -> f32 {
    let h = hash & 3;
    let u = if h < 2 { x } else { y };
    let v = if h < 2 { y } else { x };
    (if h & 1 != 0 { -u } else { u }) + (if h & 2 != 0 { -v } else { v })
}

fn noise2d(x: f32, y: f32) -> f32 {
    let xi = x.floor() as usize & 255;
    let yi = y.floor() as usize & 255;

    let xf = x - x.floor();
    let yf = y - y.floor();

    let u = fade(xf);
    let v = fade(yf);

    let a = PERM[xi] as usize + yi;
    let b = PERM[xi + 1] as usize + yi;

    fn lerp(a: f32, b: f32, t: f32) -> f32 { a + t * (b - a) }

    lerp(
        lerp(grad(PERM[a], xf, yf), grad(PERM[b], xf - 1.0, yf), u),
        lerp(grad(PERM[a + 1], xf, yf - 1.0), grad(PERM[b + 1], xf - 1.0, yf - 1.0), u),
        v
    )
}

fn fbm(x: f32, y: f32, octaves: u32, persistence: f32, lacunarity: f32) -> f32 {
    let mut total = 0.0;
    let mut amplitude = 1.0;
    let mut frequency = 1.0;
    let mut max_value = 0.0;

    for _ in 0..octaves {
        total += noise2d(x * frequency, y * frequency) * amplitude;
        max_value += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }

    total / max_value
}

/// Maximum terrain height in meters - increased for more dramatic hills
pub const TERRAIN_MAX_HEIGHT: f32 = 1.5;

fn get_terrain_height(x: f32, z: f32, max_height: f32) -> f32 {
    // Base terrain - rolling hills (lower frequency for gradual changes)
    let mut h = fbm(x * 0.2, z * 0.2, 4, 0.5, 2.0) * 0.5;

    // Add some larger features (very low frequency)
    h += fbm(x * 0.08, z * 0.08, 2, 0.6, 2.0) * 0.35;

    // Add small bumps for texture (subtle)
    h += fbm(x * 0.8, z * 0.8, 2, 0.25, 2.0) * 0.1;

    // Create a flatter area in the center for the robot spawn
    let dist_from_center = (x * x + z * z).sqrt();
    let flatten_factor = (1.0 - dist_from_center / 4.0).max(0.0);
    h *= 1.0 - flatten_factor * 0.8;

    // Normalize to [0, max_height]
    (h * 0.5 + 0.5) * max_height
}

/// Public accessor for terrain height at any world position
/// Used by grid rendering to follow terrain
pub fn get_terrain_height_at(x: f32, z: f32) -> f32 {
    get_terrain_height(x, z, TERRAIN_MAX_HEIGHT)
}

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

    // Map link names to RigidBodyHandles for rendering sync
    pub link_map: std::collections::HashMap<String, RigidBodyHandle>,
    // Map joint names to MultibodyJointHandles for control
    pub joint_map: std::collections::HashMap<String, MultibodyJointHandle>,
}

impl PhysicsWorld {
    pub fn new() -> Self {
        let mut integration_parameters = IntegrationParameters::default();
        // 60Hz physics (Bevy Update runs at ~60fps, no substeps needed)
        integration_parameters.dt = 1.0 / 60.0;
        // 4 iterations is typical for real-time (60 was causing severe performance issues)

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
            link_map: std::collections::HashMap::new(),
            joint_map: std::collections::HashMap::new(),
        }
    }

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

    pub fn build_robot(&mut self, urdf_content: &str) {
        // 1. Create Terrain Heightfield
        self.create_terrain_collider();

        // 2. Load Robot
        crate::urdf::UrdfLoader::load_robot(self, urdf_content);
    }

    /// Create ground collider - simple flat ground for reliable physics
    /// Visual terrain is separate (terrain.glb) but physics uses flat ground
    fn create_terrain_collider(&mut self) {
        // Flat ground plane - 100x100 meters, surface at Y=0
        // Ground is in GROUP_1, robot parts are in GROUP_2
        // Ground filters for ALL to collide with everything
        let ground_collider = ColliderBuilder::cuboid(50.0, 0.1, 50.0)
            .translation(vector![0.0, -0.1, 0.0]) // Center at Y=-0.1, so top surface at Y=0
            .friction(0.8)
            // Ground is GROUP_1, must filter for GROUP_2 (robot) to collide
            .collision_groups(InteractionGroups::new(Group::GROUP_1, Group::GROUP_2))
            .build();

        self.collider_set.insert(ground_collider);
    }
    pub fn get_body_pose(&self, handle: RigidBodyHandle) -> Option<Isometry<f32>> {
        if let Some(body) = self.rigid_body_set.get(handle) {
            return Some(*body.position());
        }
        if let Some(_id) = self.multibody_joint_set.rigid_body_link(handle) {
            // TODO: Implement proper Multibody Pose retrieval
            // We need to access self.multibody_joint_set.get(_id.multibody) -> link(_id.id)
            // But we need to verify the field names for rapier3d 0.22
        }
        None
    }
}

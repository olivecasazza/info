use crate::physics::PhysicsWorld;

/// Abstract renderer that can visualize PhysicsWorld state.
///
/// Implementations:
/// - Bevy (WASM app) — renders via ECS in `wasm/spot/src/render.rs`
/// - Rerun (native training) — logs directly from Rapier state to Rerun SDK
///
/// The trait takes only a `&PhysicsWorld` reference. All transforms come from
/// Rapier's rigid body set — no FK reimplementation needed.
pub trait Renderer {
    /// Called once at startup to log static geometry (collider shapes, terrain).
    ///
    /// `stl_meshes` maps link names to raw STL bytes for visual meshes.
    /// Pass an empty slice if mesh files are not available; the renderer
    /// should fall back to primitive shapes derived from colliders.
    fn init(&mut self, world: &PhysicsWorld, stl_meshes: &[(String, Vec<u8>)]);

    /// Called each policy step to update dynamic state (link transforms,
    /// joint angles, contacts, metrics).
    fn update(&mut self, world: &PhysicsWorld, step: u64);

    /// Log a named scalar metric (reward, energy, etc.).
    fn log_scalar(&mut self, name: &str, value: f32);
}

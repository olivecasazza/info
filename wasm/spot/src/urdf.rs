use crate::physics::PhysicsWorld;

pub struct UrdfLoader;

impl UrdfLoader {
    pub fn load_robot(world: &mut PhysicsWorld, urdf_content: &str) {
        spot_physics::urdf::load_robot(world, urdf_content);
    }
}

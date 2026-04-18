mod sim;
mod urdf;
mod terrain;

use pyo3::prelude::*;
use sim::RapierSim;

#[pyclass]
struct SpotSim {
    inner: RapierSim,
}

#[pymethods]
impl SpotSim {
    #[new]
    #[pyo3(signature = (urdf_content, terrain_type="flat", terrain_seed=0, terrain_difficulty=0.0))]
    fn new(urdf_content: &str, terrain_type: &str, terrain_seed: u64, terrain_difficulty: f32) -> Self {
        Self {
            inner: RapierSim::new(urdf_content, terrain_type, terrain_seed, terrain_difficulty),
        }
    }

    fn step(&mut self, actions: Vec<f32>) {
        self.inner.apply_actions(&actions);
        for _ in 0..self.inner.decimation {
            self.inner.physics_step();
        }
        self.inner.post_step();
    }

    fn get_observation(&self) -> Vec<f32> {
        self.inner.collect_observation()
    }

    fn get_base_height(&self) -> f32 {
        self.inner.get_base_height()
    }

    fn get_base_orientation(&self) -> Vec<f32> {
        self.inner.get_base_orientation_rpy()
    }

    fn get_base_velocity(&self) -> Vec<f32> {
        self.inner.get_base_velocity()
    }

    fn get_base_angular_velocity(&self) -> Vec<f32> {
        self.inner.get_base_angular_velocity()
    }

    fn get_joint_positions(&self) -> Vec<f32> {
        self.inner.get_joint_positions()
    }

    fn get_joint_velocities(&self) -> Vec<f32> {
        self.inner.get_joint_velocities()
    }

    fn get_joint_torques(&self) -> Vec<f32> {
        self.inner.get_joint_torques()
    }

    fn get_foot_contacts(&self) -> Vec<bool> {
        self.inner.get_foot_contacts()
    }

    fn get_body_contacts(&self) -> usize {
        self.inner.get_body_collision_count()
    }

    fn is_fallen(&self) -> bool {
        self.inner.is_fallen()
    }

    fn get_previous_action(&self) -> Vec<f32> {
        self.inner.previous_action.to_vec()
    }

    fn get_time(&self) -> f32 {
        self.inner.time
    }

    fn reset(&mut self, urdf_content: &str, terrain_type: &str, terrain_seed: u64, terrain_difficulty: f32) {
        self.inner = RapierSim::new(urdf_content, terrain_type, terrain_seed, terrain_difficulty);
    }
}

#[pymodule]
fn spot_rapier(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_class::<SpotSim>()?;
    Ok(())
}

mod sim;

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
        self.inner.apply_energy_scaling();
        for _ in 0..self.inner.decimation {
            self.inner.physics_step();
        }
        if self.inner.is_foraging {
            self.inner.collect_batteries();
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

    /// Per-ray distances from the forward obstacle cone. Length = 8.
    /// Distance to nearest environment-group collider per ray, clamped to the
    /// configured max range. Use this for terrain / obstacle-avoidance
    /// observations in non-foraging behaviors.
    fn cast_obstacle_cone(&self) -> Vec<f32> {
        self.inner.cast_obstacle_cone()
    }

    /// World-frame pose for every registered link.
    ///
    /// Returns a list of `(link_name, [x, y, z], [qx, qy, qz, qw])` so the
    /// caller can log each link's transform without re-doing forward kinematics
    /// (which is failure-prone given the URDF Z-up → Rapier Y-up axis remap
    /// applied during URDF load).
    fn get_link_world_poses(&self) -> Vec<(String, Vec<f32>, Vec<f32>)> {
        self.inner.get_link_world_poses().into_iter().map(|(n, t, q)| {
            (n, t.to_vec(), q.to_vec())
        }).collect()
    }

    /// Extract terrain mesh as (flat_vertices, flat_triangles).
    /// `flat_vertices`: x0,y0,z0,x1,y1,z1,...
    /// `flat_triangles`: i00,i01,i02,i10,i11,i12,...
    /// None if the active terrain has no TriMesh colliders (flat ground).
    fn get_terrain_mesh(&self) -> Option<(Vec<f32>, Vec<u32>)> {
        let (verts, tris) = self.inner.get_terrain_mesh()?;
        let mut flat_v = Vec::with_capacity(verts.len() * 3);
        for v in verts {
            flat_v.extend_from_slice(&v);
        }
        let mut flat_t = Vec::with_capacity(tris.len() * 3);
        for t in tris {
            flat_t.extend_from_slice(&t);
        }
        Some((flat_v, flat_t))
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

    // Foraging / energy API

    fn get_energy(&self) -> f32 {
        self.inner.get_energy()
    }

    fn collect_batteries(&mut self) -> f32 {
        self.inner.collect_batteries()
    }

    fn get_battery_positions(&self) -> Vec<Vec<f32>> {
        self.inner
            .world
            .get_battery_positions()
            .into_iter()
            .map(|arr| arr.to_vec())
            .collect()
    }

    fn get_foraging_observation(&self) -> Vec<f32> {
        self.inner.get_foraging_observation()
    }

    fn get_base_position(&self) -> Vec<f32> {
        self.inner.get_base_pos().to_vec()
    }

    fn compute_sight_reward(&self) -> f32 {
        let pos = self.inner.get_base_pos();
        let fwd = self.inner.get_base_forward();
        let (total_charge, avg_dist) = self.inner.world.cast_sight_cone(pos, fwd);
        if avg_dist > 0.0 { total_charge / avg_dist } else { 0.0 }
    }

    // Rerun visualization API

    /// Start Rerun visualization by spawning a viewer process.
    fn start_rerun(&mut self, app_name: &str) {
        self.inner.start_rerun(app_name);
    }

    /// Connect Rerun renderer to a specific TCP address.
    fn connect_rerun_to(&mut self, app_name: &str, addr: &str) {
        self.inner.connect_rerun_to(app_name, addr);
    }

    /// Start Rerun visualization by connecting to an existing viewer.
    fn connect_rerun(&mut self, app_name: &str) {
        self.inner.connect_rerun(app_name);
    }

    /// Start Rerun recording to an `.rrd` file.
    fn save_rerun(&mut self, app_name: &str, path: &str) {
        self.inner.save_rerun(app_name, path);
    }

    /// Stop Rerun visualization.
    fn stop_rerun(&mut self) {
        self.inner.stop_rerun();
    }

    /// Log a scalar metric to the active Rerun renderer.
    fn log_rerun_scalar(&mut self, name: &str, value: f32) {
        self.inner.log_rerun_scalar(name, value);
    }
}

#[pymodule]
fn spot_rapier(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_class::<SpotSim>()?;
    Ok(())
}

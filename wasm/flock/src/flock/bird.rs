use kd_tree::{KdPoint, KdTree2};
use nalgebra::Vector2;
use crate::utils::clamp_magnitude;

use super::bird_config::BirdConfig;

#[derive(Clone)]
pub struct Bird {
    pub position: Vector2<f32>,
    pub velocity: Vector2<f32>,
    pub acceleration: Vector2<f32>,
    pub config_id: String,
}

impl KdPoint for Bird {
    type Scalar = f32;
    type Dim = typenum::U2;
    fn at(&self, k: usize) -> f32 {
        self.position[k]
    }
}

impl Bird {
    /// Update bird forces and physics in a single pass.
    /// Uses ONE KdTree query (not two) and accumulates all three forces
    /// in a single loop over neighbors — no intermediate Vec allocations.
    pub fn update_bird(
        &mut self,
        birds: &KdTree2<Bird>,
        bird_config: &BirdConfig,
        width: &f32,
        height: &f32,
        time_step: &f32,
    ) {
        // Reset acceleration each frame
        self.acceleration = Vector2::new(0.0, 0.0);

        // Single neighbor query — cap at 30 to prevent O(n²) in dense clusters
        let all_neighbors = birds.within_radius(self, bird_config.neighbor_distance);
        let cap = all_neighbors.len().min(30);
        let neighbors = &all_neighbors[..cap];

        if !neighbors.is_empty() {
            let mut sep_steer = Vector2::new(0.0, 0.0);
            let mut ali_sum = Vector2::new(0.0, 0.0);
            let mut coh_sum = Vector2::new(0.0, 0.0);
            let mut sep_count = 0usize;
            let n = neighbors.len();

            for other in neighbors {
                let d = self.position.metric_distance(&other.position);

                // Alignment: average velocity of all neighbors
                ali_sum += other.velocity;
                // Cohesion: negative sum of positions (matches original behavior)
                coh_sum -= other.position;

                // Separation: only for birds within desired_separation
                if d > 0.0 && d <= bird_config.desired_separation {
                    let mut diff = self.position - other.position;
                    diff = diff.normalize();
                    // Inverse-square weighting: much stronger push at very close range
                    diff /= d * d;
                    sep_steer += diff;
                    sep_count += 1;
                }
            }

            // Finalize separation
            if sep_count > 0 {
                sep_steer /= sep_count as f32;
            }
            if sep_steer.magnitude() > 0.0 {
                sep_steer = sep_steer.normalize();
                sep_steer *= bird_config.max_speed;
                sep_steer -= self.velocity;
                clamp_magnitude(&mut sep_steer, bird_config.max_force);
            }

            // Finalize alignment
            ali_sum /= n as f32;
            if ali_sum.magnitude() > 0.0 {
                ali_sum = ali_sum.normalize();
                ali_sum *= bird_config.max_speed;
                ali_sum -= self.velocity;
                clamp_magnitude(&mut ali_sum, bird_config.max_force);
            }

            // Finalize cohesion
            coh_sum /= n as f32;
            coh_sum -= self.position;
            if coh_sum.magnitude() > 0.0 {
                coh_sum.normalize_mut();
                coh_sum *= bird_config.max_speed;
                coh_sum -= self.velocity;
                clamp_magnitude(&mut coh_sum, bird_config.max_force);
            }

            self.acceleration += sep_steer * bird_config.separation_multiplier;
            self.acceleration += ali_sum * bird_config.alignment_multiplier;
            self.acceleration += coh_sum * bird_config.cohesion_multiplier;
        }

        // Physics update
        clamp_magnitude(&mut self.acceleration, bird_config.max_force);
        self.velocity += 0.5 * (self.acceleration * (time_step * *time_step));
        clamp_magnitude(&mut self.velocity, bird_config.max_speed);
        self.position += *time_step * self.velocity;

        self.borders(bird_config, width, height);
    }

    fn borders(&mut self, bird_config: &BirdConfig, width: &f32, height: &f32) {
        let half_width = (width * 1.1) / 2.;
        let half_height = (height * 1.1) / 2.;
        let r = bird_config.bird_size * 1.5;
        if self.position.x + r < -half_width {
            self.position.x = half_width - r;
        }
        if self.position.y + r < -half_height {
            self.position.y = half_height - r;
        }
        if self.position.x + r > half_width + r {
            self.position.x = -half_width + r;
        }
        if self.position.y + r > half_height + r {
            self.position.y = -half_height + r;
        }
    }

    /// Returns 3 corner vertices as a fixed-size array (no heap allocation).
    #[inline]
    pub fn get_vertices(&self, bird_config: &BirdConfig) -> [Vector2<f32>; 3] {
        let angle = self.velocity.y.atan2(self.velocity.x);
        let r = bird_config.bird_size / 3.0_f32.sqrt();
        let spread = 2.4;

        [
            Vector2::new(r * 1.5 * angle.cos(), r * 1.5 * angle.sin()) + self.position,
            Vector2::new(r * (angle + spread).cos(), r * (angle + spread).sin()) + self.position,
            Vector2::new(r * (angle - spread).cos(), r * (angle - spread).sin()) + self.position,
        ]
    }
}

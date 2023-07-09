use kd_tree::{KdPoint, KdTree2};
use nalgebra::{Vector2};
use std::f32::consts::PI;

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
    pub fn update_bird(
        &mut self,
        birds: &KdTree2<Bird>,
        bird_config: &BirdConfig,
        width: &f32,
        height: &f32,
        time_step: &f32,
    ) {
        // update flock forces
        let birds_to_follow = birds.within_radius(self, bird_config.neighbor_distance);
        let birds_to_avoid = birds.within_radius(self, bird_config.desired_separation);
        let sep = self.seperate(birds_to_avoid, bird_config) * bird_config.separation_multiplier;
        let ali =
            self.align(birds_to_follow.to_owned(), bird_config) * bird_config.alignment_multiplier;
        let coh = self.cohesion(birds_to_follow.to_owned(), bird_config)
            * bird_config.cohesion_multiplier;
        self.acceleration += sep;
        self.acceleration += ali;
        self.acceleration += coh;
        // physics update
        clamp_magnitude(&mut self.acceleration, bird_config.max_force);
        self.velocity += 0.5 * (self.acceleration * (time_step * *time_step));
        clamp_magnitude(&mut self.velocity, bird_config.max_speed);
        self.position += *time_step * self.velocity;
        // wrap birds around borders
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

    fn seperate(&mut self, birds_to_avoid: Vec<&Bird>, bird_config: &BirdConfig) -> Vector2<f32> {
        let mut steer = Vector2::new(0., 0.);
        let count = birds_to_avoid.len();
        birds_to_avoid.iter().for_each(|other_bird| {
            let d = self.position.metric_distance(&other_bird.position);
            if d > 0f32 {
                let mut diff = self.position - other_bird.position;
                diff = diff.normalize();
                diff /= d;
                steer += diff;
            }
        });
        if count > 0 {
            steer /= count as f32;
        }
        if steer.magnitude() > 0f32 {
            steer = steer.normalize();
            steer *= bird_config.max_speed;
            steer -= self.velocity;
            clamp_magnitude(&mut steer, bird_config.max_force);
            return steer;
        }
        Vector2::new(0f32, 0f32)
    }

    fn align(&mut self, birds_to_follow: Vec<&Bird>, bird_config: &BirdConfig) -> Vector2<f32> {
        let mut steer = Vector2::new(0f32, 0f32);
        let count = birds_to_follow.len();
        birds_to_follow
            .iter()
            .for_each(|other_bird| steer += other_bird.velocity);
        if count > 0 {
            steer /= count as f32;
            steer = steer.normalize();
            steer *= bird_config.max_speed;
            steer -= self.velocity;
            clamp_magnitude(&mut steer, bird_config.max_force);
        }
        steer
    }

    fn cohesion(&mut self, birds_to_follow: Vec<&Bird>, bird_config: &BirdConfig) -> Vector2<f32> {
        let mut target = Vector2::new(0., 0.);
        let count = birds_to_follow.len();
        birds_to_follow
            .iter()
            .for_each(|other_bird| target -= other_bird.position);
        if count > 0 {
            target /= count as f32;
            target -= self.position;
            target.normalize_mut();
            target *= bird_config.max_speed;
            target -= self.velocity;
            clamp_magnitude(&mut target, bird_config.max_force);
        }
        target
    }

    pub fn get_vertices(&self, bird_config: &BirdConfig) -> Vec<Vector2<f32>> {
        let angle = self.velocity.angle(&Vector2::new(0., 1.));
        let r = bird_config.bird_size / ((3 as f32).sqrt());    
        let a = Vector2::new(
            r * angle.cos(), r * angle.sin()
        );
        let b = Vector2::new(
            r * (angle + ((4. * PI)/3.)).cos(),
            r * (angle + ((4. * PI)/3.)).sin()
        );
        let c = Vector2::new(
            r * (angle + ((2. * PI)/3.)).cos(),
            r * (angle + ((2. * PI)/3.)).sin()
        );
        // pairs of vertices represent line segments
        // (start vertex and end vertex of line)
        // e.g. 3 pairs makes a triangle
        [
            a, b,
            b, c,
            c, a
        ]
        .map(|e| e + self.position)
        .to_vec()
    }
}

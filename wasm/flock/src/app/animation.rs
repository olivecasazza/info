use std::collections::HashMap;

use egui::Color32;

use crate::app::math::{lerp, lerp_u8};
use crate::flock::bird_config::BirdConfig;

#[derive(Clone, Copy)]
pub struct BirdConfigTarget {
    pub probability: i32,
    pub neighbor_distance: f32,
    pub desired_separation: f32,
    pub separation_multiplier: f32,
    pub alignment_multiplier: f32,
    pub cohesion_multiplier: f32,
    pub max_speed: f32,
    pub max_force: f32,
    pub bird_size: f32,
    pub color: Color32,
}

fn lerp_color(a: Color32, b: Color32, t: f32) -> Color32 {
    Color32::from_rgba_unmultiplied(
        lerp_u8(a.r(), b.r(), t),
        lerp_u8(a.g(), b.g(), t),
        lerp_u8(a.b(), b.b(), t),
        lerp_u8(a.a(), b.a(), t),
    )
}

/// Per-config interpolation state.
#[derive(Clone, Copy)]
pub struct ConfigAnimation {
    from: BirdConfigTarget,
    to: BirdConfigTarget,
    /// Progress in [0, 1].
    t: f32,
    /// Total duration in seconds.
    duration_s: f32,
}

impl ConfigAnimation {
    pub fn new(from: BirdConfigTarget, to: BirdConfigTarget, duration_s: f32) -> Self {
        Self {
            from,
            to,
            t: 0.0,
            duration_s: duration_s.max(0.001),
        }
    }

    pub fn step(&mut self, dt_s: f32) {
        self.t = (self.t + dt_s / self.duration_s).min(1.0);
    }

    pub fn finished(&self) -> bool {
        self.t >= 1.0
    }

    pub fn current(&self) -> BirdConfigTarget {
        let t = self.t;
        BirdConfigTarget {
            probability: (lerp(self.from.probability as f32, self.to.probability as f32, t)).round()
                as i32,
            neighbor_distance: lerp(self.from.neighbor_distance, self.to.neighbor_distance, t),
            desired_separation: lerp(self.from.desired_separation, self.to.desired_separation, t),
            separation_multiplier: lerp(
                self.from.separation_multiplier,
                self.to.separation_multiplier,
                t,
            ),
            alignment_multiplier: lerp(
                self.from.alignment_multiplier,
                self.to.alignment_multiplier,
                t,
            ),
            cohesion_multiplier: lerp(
                self.from.cohesion_multiplier,
                self.to.cohesion_multiplier,
                t,
            ),
            max_speed: lerp(self.from.max_speed, self.to.max_speed, t),
            max_force: lerp(self.from.max_force, self.to.max_force, t),
            bird_size: lerp(self.from.bird_size, self.to.bird_size, t),
            color: lerp_color(self.from.color, self.to.color, t),
        }
    }
}

pub struct RandomizationAnimation {
    pub secs_since_last_cycle: f32,
    pub cycle_every_s: f32,
    pub interpolation_s: f32,
    pub active: HashMap<String, ConfigAnimation>,
}

impl Default for RandomizationAnimation {
    fn default() -> Self {
        Self {
            secs_since_last_cycle: 0.0,
            cycle_every_s: 10.0,
            interpolation_s: 2.0,
            active: HashMap::new(),
        }
    }
}

impl RandomizationAnimation {
    pub fn maybe_start_cycle(
        &mut self,
        rng: &mut oorandom::Rand32,
        enable: bool,
        dt_s: f32,
        configs: &HashMap<String, BirdConfig>,
    ) {
        if !enable {
            return;
        }

        self.secs_since_last_cycle += dt_s;
        if self.secs_since_last_cycle < self.cycle_every_s {
            return;
        }
        self.secs_since_last_cycle = 0.0;

        // Create new animation targets for each species.
        for (id, cfg) in configs.iter() {
            let from = BirdConfigTarget::from_cfg(cfg);
            let to = BirdConfigTarget::random(rng);
            self.active
                .insert(id.clone(), ConfigAnimation::new(from, to, self.interpolation_s));
        }
    }

    /// Advances active animations and returns a map of new configs for anything that changed.
    pub fn step(
        &mut self,
        dt_s: f32,
        configs: &mut HashMap<String, BirdConfig>,
    ) {
        let mut finished = Vec::new();

        for (id, anim) in self.active.iter_mut() {
            anim.step(dt_s);
            let cur = anim.current();

            if let Some(cfg) = configs.get_mut(id) {
                cur.apply_to_cfg(cfg);
            }

            if anim.finished() {
                finished.push(id.clone());
            }
        }

        for id in finished {
            self.active.remove(&id);
        }
    }
}

impl BirdConfigTarget {
    pub fn from_cfg(cfg: &BirdConfig) -> Self {
        Self {
            probability: cfg.probability,
            neighbor_distance: cfg.neighbor_distance,
            desired_separation: cfg.desired_separation,
            separation_multiplier: cfg.separation_multiplier,
            alignment_multiplier: cfg.alignment_multiplier,
            cohesion_multiplier: cfg.cohesion_multiplier,
            max_speed: cfg.max_speed,
            max_force: cfg.max_force,
            bird_size: cfg.bird_size,
            color: Color32::from_rgb(
                (cfg.color_r * 255.0) as u8,
                (cfg.color_g * 255.0) as u8,
                (cfg.color_b * 255.0) as u8,
            ),
        }
    }

    pub fn random(rng: &mut oorandom::Rand32) -> Self {
        // JS ranges from utils/background/background.ts
        Self {
            probability: rng.rand_range(25..75) as i32,
            neighbor_distance: rng.rand_range(0..50) as f32,
            desired_separation: rng.rand_range(50..250) as f32,
            separation_multiplier: 0.001 + rng.rand_float() * 1.199,
            alignment_multiplier: 0.001 + rng.rand_float() * 1.199,
            cohesion_multiplier: 0.001 + rng.rand_float() * 1.199,
            max_force: 0.001 + rng.rand_float() * 0.499,
            max_speed: 0.001 + rng.rand_float() * 9.999,
            bird_size: 3.0 + rng.rand_float() * 12.0,
            color: Color32::from_rgb(
                rng.rand_range(0..255) as u8,
                rng.rand_range(0..255) as u8,
                rng.rand_range(0..255) as u8,
            ),
        }
    }

    pub fn apply_to_cfg(&self, cfg: &mut BirdConfig) {
        cfg.probability = self.probability;
        cfg.neighbor_distance = self.neighbor_distance;
        cfg.desired_separation = self.desired_separation;
        cfg.separation_multiplier = self.separation_multiplier;
        cfg.alignment_multiplier = self.alignment_multiplier;
        cfg.cohesion_multiplier = self.cohesion_multiplier;
        cfg.max_speed = self.max_speed;
        cfg.max_force = self.max_force;
        cfg.bird_size = self.bird_size;
        cfg.color_r = self.color.r() as f32 / 255.0;
        cfg.color_g = self.color.g() as f32 / 255.0;
        cfg.color_b = self.color.b() as f32 / 255.0;
    }
}

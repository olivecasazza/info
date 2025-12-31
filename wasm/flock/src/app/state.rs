use std::{cell::RefCell, collections::HashMap, rc::Rc};

use egui::{Color32, Context, Pos2, Stroke};

use crate::app::animation::RandomizationAnimation;
use crate::app::math::lerp;
use crate::app::theme::species_colors;
use crate::flock::bird_config::BirdConfig;
use crate::flock::flock::Flock;

// `ui.rs` adds an impl block for `FlockApp`; module inclusion handled by `app/mod.rs`.

/// Global settings formerly controlled by Tweakpane.
#[derive(Clone, Copy)]
pub struct GlobalSettings {
    pub enable_randomization_animation: bool,
    pub simulation_timestep: f32,
    pub max_flock_size: usize,
}

impl Default for GlobalSettings {
    fn default() -> Self {
        Self {
            enable_randomization_animation: true,
            simulation_timestep: 1.0,
            max_flock_size: 1200,
        }
    }
}

#[derive(Default)]
pub struct ExternalCommands {
    pub pending_spawn_norm: Vec<(f32, f32)>,
    pub ui_visible: bool,
    /// Updated each frame from egui (only meaningful when ui_visible=true).
    pub pointer_over_ui: bool,
}

pub struct FlockApp {
    pub globals: GlobalSettings,

    // External commands from JS.
    pub(crate) commands: Rc<RefCell<ExternalCommands>>,

    // Simulation and configs.
    pub(crate) flock: Flock,
    pub(crate) configs: HashMap<String, BirdConfig>,

    // View.
    scene_width: f32,
    scene_height: f32,

    // Initial spawn ramp (2s like the old JS animate).
    initial_spawn_remaining: usize,
    initial_spawn_rate_per_s: f32,

    // Randomization animation.
    randomization: RandomizationAnimation,

    // UI.
    pub(crate) settings_expanded: bool,

    // RNG.
    pub(crate) rng: oorandom::Rand32,
}

impl FlockApp {
    pub fn new(seed: u64, commands: Rc<RefCell<ExternalCommands>>) -> Self {
        let globals = GlobalSettings::default();
        let rng = oorandom::Rand32::new(seed);

        let mut flock = Flock::new(globals.max_flock_size, seed);

        // Create 4 initial species: primary, secondary, tertiary, highlight.
        let mut configs = HashMap::new();

        let mk_cfg = |id: &str, probability: i32, color: Color32| {
            BirdConfig::new(
                id.to_string(),
                probability,
                // Keep defaults close to what existed before.
                40.0, // neighbor_distance
                25.0, // desired_separation
                0.5,  // separation_multiplier
                0.5,  // alignment_multiplier
                0.3,  // cohesion_multiplier
                5.0,  // max_speed
                0.33, // max_force
                6.0,  // bird_size (smaller initial birds)
                color.r() as f32 / 255.0,
                color.g() as f32 / 255.0,
                color.b() as f32 / 255.0,
            )
        };

        let primary_id = "primary".to_string();
        let secondary_id = "secondary".to_string();
        let tertiary_id = "tertiary".to_string();
        let highlight_id = "highlight".to_string();

        configs.insert(
            primary_id.clone(),
            mk_cfg(&primary_id, 40, species_colors::primary()),
        );
        configs.insert(
            secondary_id.clone(),
            mk_cfg(&secondary_id, 30, species_colors::secondary()),
        );
        configs.insert(
            tertiary_id.clone(),
            mk_cfg(&tertiary_id, 20, species_colors::tertiary()),
        );
        configs.insert(
            highlight_id.clone(),
            mk_cfg(&highlight_id, 10, species_colors::highlight()),
        );

        // Register configs with the flock.
        for (id, cfg) in configs.iter() {
            flock.insert_bird_config(id.clone(), cfg.clone());
        }

        // Spawn fewer birds at startup than max_flock_size.
        // (You can still grow the flock via click/drag or by raising max flock size in settings.)
        // Default: start at ~1/8 of max (e.g. 150 birds for max=1200), min 30.
        let initial_spawn_target = (globals.max_flock_size / 8).max(30);

        Self {
            globals,
            commands,
            flock,
            configs,
            scene_width: 1.0,
            scene_height: 1.0,
            initial_spawn_remaining: initial_spawn_target,
            initial_spawn_rate_per_s: initial_spawn_target as f32 / 2.0,
            randomization: RandomizationAnimation::default(),
            settings_expanded: false,
            rng,
        }
    }

    pub fn set_viewport_px(&mut self, w: f32, h: f32) {
        self.scene_width = w.max(1.0);
        self.scene_height = h.max(1.0);
    }

    fn spawn_from_norm(&mut self, x_norm: f32, y_norm: f32) {
        let half_w = self.scene_width / 2.0;
        let half_h = self.scene_height / 2.0;
        let x = lerp(-half_w, half_w, x_norm.clamp(0.0, 1.0));
        let y = -lerp(-half_h, half_h, y_norm.clamp(0.0, 1.0));

        if let Some(config_id) = self.choose_config_id_for_spawn() {
            self.flock.add_bird(config_id, x, y);
        }
    }

    pub fn add_species_random(&mut self) {
        // JS ranges from utils/background/background.ts
        let probability = self.rng.rand_range(25..75) as i32;
        let neighbor_distance = self.rng.rand_range(0..50) as f32;
        let desired_separation = self.rng.rand_range(50..250) as f32;

        let separation_multiplier = 0.001 + self.rng.rand_float() * 1.199;
        let alignment_multiplier = 0.001 + self.rng.rand_float() * 1.199;
        let cohesion_multiplier = 0.001 + self.rng.rand_float() * 1.199;
        let max_force = 0.001 + self.rng.rand_float() * 0.499;
        let max_speed = 0.001 + self.rng.rand_float() * 9.999;
        let bird_size = 3.0 + self.rng.rand_float() * 12.0;

        let r = self.rng.rand_range(0..255) as u8;
        let g = self.rng.rand_range(0..255) as u8;
        let b = self.rng.rand_range(0..255) as u8;

        let id = format!("{:08x}", self.rng.rand_u32());

        let cfg = BirdConfig::new(
            id.clone(),
            probability,
            neighbor_distance,
            desired_separation,
            separation_multiplier,
            alignment_multiplier,
            cohesion_multiplier,
            max_speed,
            max_force,
            bird_size,
            r as f32 / 255.0,
            g as f32 / 255.0,
            b as f32 / 255.0,
        );

        self.configs.insert(id.clone(), cfg.clone());
        self.flock.insert_bird_config(id, cfg);
    }

    fn choose_config_id_for_spawn(&mut self) -> Option<String> {
        // Weighted random selection, similar to JS weightedRandom.
        let total: i32 = self.configs.values().map(|c| c.probability).sum();
        if total <= 0 {
            return self.configs.keys().next().cloned();
        }

        let mut r = self.rng.rand_range(0..(total as u32)) as i32;
        for (id, cfg) in self.configs.iter() {
            r -= cfg.probability;
            if r < 0 {
                return Some(id.clone());
            }
        }

        self.configs.keys().next().cloned()
    }

    pub(crate) fn step(&mut self, ctx: &Context, dt_s: f32) {
        // Random interpolation animation.
        self.randomization.maybe_start_cycle(
            &mut self.rng,
            self.globals.enable_randomization_animation,
            dt_s,
            &self.configs,
        );
        self.randomization.step(dt_s, &mut self.configs);

        // Push updated configs into flock for any changes.
        for (id, cfg) in self.configs.iter() {
            self.flock.insert_bird_config(id.clone(), cfg.clone());
        }

        // Draw birds first (background).
        self.draw_birds(ctx, dt_s);

        // Draw UI.
        self.ui(ctx);
    }

    fn draw_birds(&mut self, ctx: &Context, dt_s: f32) {
        let screen_rect = ctx.screen_rect();
        let painter = ctx.layer_painter(egui::LayerId::background());

        // Clear background.
        painter.rect_filled(screen_rect, 0.0, Color32::BLACK);

        // Update view size used by spawn mapping.
        self.set_viewport_px(screen_rect.width(), screen_rect.height());

        // Initial spawn ramp: add birds over ~2 seconds.
        if self.initial_spawn_remaining > 0 {
            let want = (self.initial_spawn_rate_per_s * dt_s).ceil() as usize;
            let to_spawn = want.clamp(1, self.initial_spawn_remaining);
            for _ in 0..to_spawn {
                if let Some(config_id) = self.choose_config_id_for_spawn() {
                    self.flock.add_bird_at_random_position(
                        config_id,
                        self.scene_width,
                        self.scene_height,
                    );
                }
            }
            self.initial_spawn_remaining = self.initial_spawn_remaining.saturating_sub(to_spawn);
        }

        // Drain JS spawn requests.
        //
        // Important: when the pointer is interacting with egui UI, we must NOT spawn birds,
        // otherwise it feels like the UI is "unclickable" (because every click/drag turns
        // into spawning).
        let mut cmds = self.commands.borrow_mut();
        let spawns = std::mem::take(&mut cmds.pending_spawn_norm);
        let ui_visible = cmds.ui_visible;

        // Track whether the pointer is over any egui area, so JS can avoid spawning
        // while interacting with the settings panel.
        cmds.pointer_over_ui = ui_visible && ctx.is_pointer_over_area();
        let pointer_over_ui = cmds.pointer_over_ui;
        drop(cmds);

        if !pointer_over_ui {
            for (x_norm, y_norm) in spawns {
                self.spawn_from_norm(x_norm, y_norm);
            }
        }

        // Step simulation and collect line segments.
        let (vertices, colors) = self.flock.step_collect_geometry(
            self.scene_width,
            self.scene_height,
            self.globals.simulation_timestep,
        );

        let center = screen_rect.center();
        let mut shapes: Vec<egui::Shape> = Vec::with_capacity(vertices.len() / 6);

        // vertices: [x,y,0, x,y,0, ...] per vertex, so 2 vertices per segment = 6 floats.
        // colors:   [r,g,b, r,g,b, ...] per vertex, so 2 vertices per segment = 6 floats.
        let mut vi = 0usize;
        let mut ci = 0usize;
        while vi + 5 < vertices.len() && ci + 2 < colors.len() {
            let x1 = vertices[vi];
            let y1 = vertices[vi + 1];
            let x2 = vertices[vi + 3];
            let y2 = vertices[vi + 4];

            let r = colors[ci];
            let g = colors[ci + 1];
            let b = colors[ci + 2];

            let color = Color32::from_rgb(
                (r * 255.0).clamp(0.0, 255.0) as u8,
                (g * 255.0).clamp(0.0, 255.0) as u8,
                (b * 255.0).clamp(0.0, 255.0) as u8,
            );

            // World coords have origin at center, y up. Screen coords: y down.
            let p1 = Pos2::new(center.x + x1, center.y - y1);
            let p2 = Pos2::new(center.x + x2, center.y - y2);

            shapes.push(egui::Shape::line_segment(
                [p1, p2],
                Stroke::new(1.0, color),
            ));

            vi += 6;
            ci += 6;
        }

        painter.extend(shapes);
    }
}

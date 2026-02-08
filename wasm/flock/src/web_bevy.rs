//! WASM entrypoint for Bevy-based flock.
//!
//! Provides WebHandle API compatible with wasmProjects.ts loader.

use wasm_bindgen::prelude::*;
use bevy::prelude::*;
use bevy_egui::{egui, EguiContexts, EguiPlugin};
use bevy_core::BevyCorePlugins;
use std::collections::HashMap;

// Re-use existing flock simulation modules
use crate::flock::flock::Flock;
use crate::flock::bird_config::BirdConfig;

// ─────────────────────────────────────────────────────────────────────────────
// Randomization Animation (ported from app/animation.rs)
// ─────────────────────────────────────────────────────────────────────────────

fn lerp(a: f32, b: f32, t: f32) -> f32 {
    a + (b - a) * t
}

fn lerp_u8(a: u8, b: u8, t: f32) -> u8 {
    let a = a as f32;
    let b = b as f32;
    lerp(a, b, t).round().clamp(0.0, 255.0) as u8
}

#[derive(Clone, Copy)]
struct BirdConfigTarget {
    probability: i32,
    neighbor_distance: f32,
    desired_separation: f32,
    separation_multiplier: f32,
    alignment_multiplier: f32,
    cohesion_multiplier: f32,
    max_speed: f32,
    max_force: f32,
    bird_size: f32,
    color: egui::Color32,
}

impl BirdConfigTarget {
    fn from_cfg(cfg: &BirdConfig) -> Self {
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
            color: egui::Color32::from_rgb(
                (cfg.color_r * 255.0) as u8,
                (cfg.color_g * 255.0) as u8,
                (cfg.color_b * 255.0) as u8,
            ),
        }
    }

    fn random(rng: &mut oorandom::Rand32) -> Self {
        Self {
            probability: rng.rand_range(25..75) as i32,
            neighbor_distance: 20.0 + rng.rand_float() * 30.0,
            desired_separation: 20.0 + rng.rand_float() * 30.0,
            separation_multiplier: 0.8 + rng.rand_float() * 1.2,
            alignment_multiplier: 0.001 + rng.rand_float() * 1.199,
            cohesion_multiplier: 0.001 + rng.rand_float() * 1.199,
            max_force: 0.001 + rng.rand_float() * 0.499,
            max_speed: 0.001 + rng.rand_float() * 9.999,
            bird_size: 0.1 + rng.rand_float() * 4.9,
            color: egui::Color32::from_rgb(
                rng.rand_range(100..255) as u8,
                rng.rand_range(80..255) as u8,
                rng.rand_range(80..255) as u8,
            ),
        }
    }

    fn apply_to_cfg(&self, cfg: &mut BirdConfig) {
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

fn lerp_color(a: egui::Color32, b: egui::Color32, t: f32) -> egui::Color32 {
    egui::Color32::from_rgba_unmultiplied(
        lerp_u8(a.r(), b.r(), t),
        lerp_u8(a.g(), b.g(), t),
        lerp_u8(a.b(), b.b(), t),
        lerp_u8(a.a(), b.a(), t),
    )
}

#[derive(Clone, Copy)]
struct ConfigAnimation {
    from: BirdConfigTarget,
    to: BirdConfigTarget,
    t: f32,
    duration_s: f32,
}

impl ConfigAnimation {
    fn new(from: BirdConfigTarget, to: BirdConfigTarget, duration_s: f32) -> Self {
        Self {
            from,
            to,
            t: 0.0,
            duration_s: duration_s.max(0.001),
        }
    }

    fn step(&mut self, dt_s: f32) {
        self.t = (self.t + dt_s / self.duration_s).min(1.0);
    }

    fn finished(&self) -> bool {
        self.t >= 1.0
    }

    fn current(&self) -> BirdConfigTarget {
        let t = self.t;
        BirdConfigTarget {
            probability: lerp(self.from.probability as f32, self.to.probability as f32, t).round() as i32,
            neighbor_distance: lerp(self.from.neighbor_distance, self.to.neighbor_distance, t),
            desired_separation: lerp(self.from.desired_separation, self.to.desired_separation, t),
            separation_multiplier: lerp(self.from.separation_multiplier, self.to.separation_multiplier, t),
            alignment_multiplier: lerp(self.from.alignment_multiplier, self.to.alignment_multiplier, t),
            cohesion_multiplier: lerp(self.from.cohesion_multiplier, self.to.cohesion_multiplier, t),
            max_speed: lerp(self.from.max_speed, self.to.max_speed, t),
            max_force: lerp(self.from.max_force, self.to.max_force, t),
            bird_size: lerp(self.from.bird_size, self.to.bird_size, t),
            color: lerp_color(self.from.color, self.to.color, t),
        }
    }
}

struct RandomizationAnimation {
    secs_since_last_cycle: f32,
    cycle_every_s: f32,
    interpolation_s: f32,
    active: HashMap<String, ConfigAnimation>,
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
    fn maybe_start_cycle(
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

        for (id, cfg) in configs.iter() {
            let from = BirdConfigTarget::from_cfg(cfg);
            let to = BirdConfigTarget::random(rng);
            self.active.insert(id.clone(), ConfigAnimation::new(from, to, self.interpolation_s));
        }
    }

    fn step(&mut self, dt_s: f32, configs: &mut HashMap<String, BirdConfig>) {
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

// ─────────────────────────────────────────────────────────────────────────────
// WebHandle and Plugin
// ─────────────────────────────────────────────────────────────────────────────
#[wasm_bindgen]
pub struct WebHandle {}

#[wasm_bindgen]
impl WebHandle {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        console_error_panic_hook::set_once();
        Self {}
    }

    #[wasm_bindgen]
    pub async fn start(
        &self,
        canvas: web_sys::HtmlCanvasElement,
    ) -> Result<(), JsValue> {
        let canvas_id = canvas.id();
        let selector = if canvas_id.is_empty() {
            "#bevy-canvas".to_string()
        } else {
            format!("#{}", canvas_id)
        };

        App::new()
            .add_plugins(DefaultPlugins.set(WindowPlugin {
                primary_window: Some(Window {
                    title: "Flock".into(),
                    canvas: Some(selector),
                    fit_canvas_to_parent: true,
                    prevent_default_event_handling: false,
                    ..Default::default()
                }),
                ..Default::default()
            }))
            .add_plugins(EguiPlugin)
            .add_plugins(BevyCorePlugins)
            .add_plugins(FlockPlugin)
            .run();

        Ok(())
    }

    #[wasm_bindgen]
    pub fn destroy(&self) {}

    #[wasm_bindgen]
    pub fn has_panicked(&self) -> bool { false }

    #[wasm_bindgen]
    pub fn set_ui_visible(&self, _visible: bool) {}

    #[wasm_bindgen]
    pub fn is_pointer_over_ui(&self) -> bool { false }

    #[wasm_bindgen]
    pub fn spawn_at_norm(&self, _x: f32, _y: f32) {}
}

struct FlockPlugin;

impl Plugin for FlockPlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(ClearColor(Color::BLACK))
            .init_resource::<FlockState>()
            .add_systems(Startup, setup)
            .add_systems(Update, simulation_step)
            .add_systems(Update, render_birds.after(simulation_step))
            .add_systems(Update, ui_system.after(render_birds))
            .add_systems(Update, mouse_spawn.after(ui_system));
    }
}

#[derive(Resource)]
struct FlockState {
    flock: Flock,
    configs: HashMap<String, BirdConfig>,
    scene_width: f32,
    scene_height: f32,
    timestep: f32,
    max_flock_size: usize,
    initial_spawn_remaining: usize,
    initial_spawn_rate: f32,
    enable_randomization: bool,
    rng: oorandom::Rand32,
    animation: RandomizationAnimation,
    ui: ui_theme::ProjectUi,
}

impl Default for FlockState {
    fn default() -> Self {
        let seed = js_sys::Date::now() as u64;
        let max_flock_size = 2400;
        let mut flock = Flock::new(max_flock_size, seed);
        let mut configs = HashMap::new();
        let mut rng = oorandom::Rand32::new(seed);

        // Use brighter theme color shades for neon glow effect
        // (200-300 range instead of 400-500 for more luminous appearance)
        let primary = egui::Color32::from_hex("#98e7e1").unwrap_or(ui_theme::theme::primary());
        let secondary = egui::Color32::from_hex("#f7d3c6").unwrap_or(ui_theme::theme::secondary());
        let tertiary = egui::Color32::from_hex("#c2e1ec").unwrap_or(ui_theme::theme::compliment());
        let highlight = egui::Color32::from_hex("#f0dd7d").unwrap_or(ui_theme::theme::highlight());

        let mk_cfg = |id: &str, prob: i32, c: egui::Color32| {
            BirdConfig::new(
                id.to_string(),
                prob,
                35.0, 25.0, 1.2, 0.5, 0.3, 5.0, 0.33, 3.5,
                c.r() as f32 / 255.0,
                c.g() as f32 / 255.0,
                c.b() as f32 / 255.0,
            )
        };

        let cfg_primary = mk_cfg("primary", 30, primary);
        let cfg_secondary = mk_cfg("secondary", 30, secondary);
        let cfg_tertiary = mk_cfg("tertiary", 20, tertiary);
        let cfg_highlight = mk_cfg("highlight", 20, highlight);

        flock.insert_bird_config("primary".to_string(), cfg_primary.clone());
        flock.insert_bird_config("secondary".to_string(), cfg_secondary.clone());
        flock.insert_bird_config("tertiary".to_string(), cfg_tertiary.clone());
        flock.insert_bird_config("highlight".to_string(), cfg_highlight.clone());

        configs.insert("primary".to_string(), cfg_primary);
        configs.insert("secondary".to_string(), cfg_secondary);
        configs.insert("tertiary".to_string(), cfg_tertiary);
        configs.insert("highlight".to_string(), cfg_highlight);

        // Pre-spawn all birds for an immediately full, even distribution
        let w = 900.0_f32;
        let h = 700.0_f32;
        let total: i32 = configs.values().map(|c| c.probability).sum();
        for _ in 0..max_flock_size {
            // Weighted random config selection
            let mut r = (rng.rand_u32() % total as u32) as i32;
            let mut chosen_id = configs.keys().next().cloned().unwrap();
            for (id, cfg) in configs.iter() {
                r -= cfg.probability;
                if r < 0 {
                    chosen_id = id.clone();
                    break;
                }
            }
            flock.add_bird_at_random_position(chosen_id, w, h);
        }

        Self {
            flock,
            configs,
            scene_width: 900.0,
            scene_height: 700.0,
            timestep: 1.0,
            max_flock_size,
            initial_spawn_remaining: 0,
            initial_spawn_rate: 0.0,
            enable_randomization: true,
            rng,
            animation: RandomizationAnimation::default(),
            ui: ui_theme::ProjectUi::new("settings"),
        }
    }
}

/// Marker for the birds mesh entity
#[derive(Component)]
struct BirdsMesh;

fn setup(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<ColorMaterial>>,
) {
    commands.spawn(Camera2d::default());

    // Create a mesh for drawing bird wireframe outlines - updated each frame
    let mesh = Mesh::new(
        bevy::render::mesh::PrimitiveTopology::LineList,
        bevy::render::render_asset::RenderAssetUsages::MAIN_WORLD | bevy::render::render_asset::RenderAssetUsages::RENDER_WORLD,
    );

    commands.spawn((
        Mesh2d(meshes.add(mesh)),
        MeshMaterial2d(materials.add(ColorMaterial {
            color: Color::WHITE, // Vertex colors will override
            ..Default::default()
        })),
        BirdsMesh,
    ));
}

fn simulation_step(
    time: Res<Time>,
    mut state: ResMut<FlockState>,
    windows: Query<&Window>,
) {
    if let Ok(window) = windows.get_single() {
        state.scene_width = window.width();
        state.scene_height = window.height();
    }

    let dt = time.delta_secs();
    let w = state.scene_width;
    let h = state.scene_height;

    // Randomization animation
    let has_active_animations;
    {
        let FlockState { animation, rng, enable_randomization, configs, .. } = &mut *state;
        animation.maybe_start_cycle(rng, *enable_randomization, dt, configs);
        animation.step(dt, configs);
        has_active_animations = !animation.active.is_empty();
    }

    // Only sync configs when animations changed them (avoid cloning every frame)
    if has_active_animations {
        let updates: Vec<_> = state.configs.iter()
            .map(|(id, cfg)| (id.clone(), cfg.clone()))
            .collect();
        for (id, cfg) in updates {
            state.flock.insert_bird_config(id, cfg);
        }
    }

    if state.initial_spawn_remaining > 0 {
        let want = (state.initial_spawn_rate * dt).ceil() as usize;
        let to_spawn = want.clamp(1, state.initial_spawn_remaining);

        let FlockState { configs, rng, flock, .. } = &mut *state;
        for _ in 0..to_spawn {
            if let Some(config_id) = choose_config(configs, rng) {
                flock.add_bird_at_random_position(config_id, w, h);
            }
        }
        state.initial_spawn_remaining = state.initial_spawn_remaining.saturating_sub(to_spawn);
    }
}

fn choose_config(configs: &HashMap<String, BirdConfig>, rng: &mut oorandom::Rand32) -> Option<String> {
    let total: i32 = configs.values().map(|c| c.probability).sum();
    if total <= 0 {
        return configs.keys().next().cloned();
    }
    let mut r = (rng.rand_u32() % total as u32) as i32;
    for (id, cfg) in configs.iter() {
        r -= cfg.probability;
        if r < 0 {
            return Some(id.clone());
        }
    }
    configs.keys().next().cloned()
}

fn render_birds(
    mut state: ResMut<FlockState>,
    mut meshes: ResMut<Assets<Mesh>>,
    query: Query<&Mesh2d, With<BirdsMesh>>,
) {
    let width = state.scene_width;
    let height = state.scene_height;
    let timestep = state.timestep;

    let (vertices, colors) = state.flock.step_collect_geometry(width, height, timestep);

    let Ok(mesh_handle) = query.get_single() else {
        return;
    };

    let Some(mesh) = meshes.get_mut(&mesh_handle.0) else {
        return;
    };

    // Each bird = 3 corner vertices (9 pos floats, 9 color floats).
    // We render 3 layers of wireframe edges per bird:
    //   outer glow (2.8× scale, 0.12 alpha) + inner glow (1.6×, 0.28 alpha) + core (1.0×)
    // Each layer = 3 edges × 2 verts = 6 verts → 18 verts per bird.
    let num_birds = vertices.len() / 9;
    let total_verts = num_birds * 18;
    let mut positions: Vec<[f32; 3]> = Vec::with_capacity(total_verts);
    let mut vertex_colors: Vec<[f32; 4]> = Vec::with_capacity(total_verts);

    let mut vi = 0usize;
    let mut ci = 0usize;

    while vi + 8 < vertices.len() && ci + 8 < colors.len() {
        let v0 = [vertices[vi], vertices[vi + 1], 0.0];
        let v1 = [vertices[vi + 3], vertices[vi + 4], 0.0];
        let v2 = [vertices[vi + 6], vertices[vi + 7], 0.0];

        let cx = (v0[0] + v1[0] + v2[0]) / 3.0;
        let cy = (v0[1] + v1[1] + v2[1]) / 3.0;

        let r = colors[ci];
        let g = colors[ci + 1];
        let b = colors[ci + 2];

        // Helper: scale a vertex outward from centroid
        let scale_v = |v: [f32; 3], s: f32| -> [f32; 3] {
            [cx + (v[0] - cx) * s, cy + (v[1] - cy) * s, 0.0]
        };

        // Push 3 line-segment edges for a given scale + alpha
        let mut push_edges = |s: f32, a: f32| {
            let sv0 = scale_v(v0, s);
            let sv1 = scale_v(v1, s);
            let sv2 = scale_v(v2, s);
            let c = [r, g, b, a];
            positions.push(sv0); positions.push(sv1);
            vertex_colors.push(c); vertex_colors.push(c);
            positions.push(sv1); positions.push(sv2);
            vertex_colors.push(c); vertex_colors.push(c);
            positions.push(sv2); positions.push(sv0);
            vertex_colors.push(c); vertex_colors.push(c);
        };

        push_edges(2.8, 0.12);  // outer glow
        push_edges(1.6, 0.28);  // inner glow
        push_edges(1.0, 1.0);   // core wireframe

        vi += 9;
        ci += 9;
    }

    mesh.insert_attribute(Mesh::ATTRIBUTE_POSITION, positions);
    mesh.insert_attribute(Mesh::ATTRIBUTE_COLOR, vertex_colors);
}

fn mouse_spawn(
    mut state: ResMut<FlockState>,
    mouse: Res<ButtonInput<MouseButton>>,
    windows: Query<&Window>,
) {
    if mouse.pressed(MouseButton::Left) {
        if let Ok(window) = windows.get_single() {
            if let Some(pos) = window.cursor_position() {
                let x = pos.x - state.scene_width / 2.0;
                let y = state.scene_height / 2.0 - pos.y;

                let FlockState { configs, rng, flock, .. } = &mut *state;
                if let Some(config_id) = choose_config(configs, rng) {
                    flock.add_bird(config_id, x, y);
                }
            }
        }
    }
}

fn ui_system(
    mut contexts: EguiContexts,
    mut state: ResMut<FlockState>,
    keyboard: Res<ButtonInput<KeyCode>>,
    time: Res<Time>,
) {
    if keyboard.just_pressed(KeyCode::Tab) {
        state.ui.toggle();
    }

    let ctx = contexts.ctx_mut();
    let dt = time.delta_secs();

    // Take ProjectUi out so the closure gets full access to state fields.
    // Swapped back after frame() — this is a standard Rust/Bevy pattern.
    let mut ui = std::mem::take(&mut state.ui);
    let mut should_add_species = false;

    ui.frame(ctx, dt, |egui_ui| {
        egui_ui.collapsing("flock settings", |ui| {
            ui.checkbox(&mut state.enable_randomization, "enable randomization animation");
            ui.add(egui::Slider::new(&mut state.timestep, 0.0..=5.0).text("simulation timestep"));

            let mut max = state.max_flock_size as u32;
            if ui.add(egui::Slider::new(&mut max, 0..=5000).text("max flock size")).changed() {
                state.max_flock_size = max as usize;
                let new_max = state.max_flock_size;
                state.flock.set_max_flock_size(new_max);
            }

            ui.label(format!("current_flock_size {}", state.flock.current_flock_size()));

            if ui.button("generate random species").clicked() {
                should_add_species = true;
            }
        });

        egui_ui.separator();

        egui_ui.collapsing("bird settings", |ui| {
            let mut ids: Vec<_> = state.configs.keys().cloned().collect();
            ids.sort();

            for id in ids {
                let mut cfg = match state.configs.remove(&id) {
                    Some(c) => c,
                    None => continue,
                };

                let mut should_remove = false;

                ui.collapsing(id.clone(), |ui| {
                    ui.add(egui::Slider::new(&mut cfg.probability, 0..=100).text("spawn probability"));
                    ui.add(egui::Slider::new(&mut cfg.neighbor_distance, 0.0..=250.0).text("neighbor_distance"));
                    ui.add(egui::Slider::new(&mut cfg.desired_separation, 0.0..=250.0).text("desired_separation"));
                    ui.add(egui::Slider::new(&mut cfg.separation_multiplier, 0.0..=10.0).text("separation"));
                    ui.add(egui::Slider::new(&mut cfg.alignment_multiplier, 0.0..=10.0).text("alignment"));
                    ui.add(egui::Slider::new(&mut cfg.cohesion_multiplier, 0.0..=10.0).text("cohesion"));
                    ui.add(egui::Slider::new(&mut cfg.max_speed, 0.0..=10.0).text("max_speed"));
                    ui.add(egui::Slider::new(&mut cfg.max_force, 0.0..=10.0).text("max_force"));
                    ui.add(egui::Slider::new(&mut cfg.bird_size, 0.1..=5.0).text("bird_size"));

                    let mut color = egui::Color32::from_rgb(
                        (cfg.color_r * 255.0) as u8,
                        (cfg.color_g * 255.0) as u8,
                        (cfg.color_b * 255.0) as u8,
                    );
                    if ui.color_edit_button_srgba(&mut color).changed() {
                        cfg.color_r = color.r() as f32 / 255.0;
                        cfg.color_g = color.g() as f32 / 255.0;
                        cfg.color_b = color.b() as f32 / 255.0;
                    }

                    if !matches!(id.as_str(), "primary" | "secondary" | "tertiary" | "highlight")
                        && ui.button("remove species").clicked()
                    {
                        should_remove = true;
                    }
                });

                if should_remove {
                    state.flock.remove_bird_config(id.clone());
                } else {
                    state.flock.insert_bird_config(id.clone(), cfg.clone());
                    state.configs.insert(id, cfg);
                }
            }
        });
    });

    state.ui = ui;

    if should_add_species {
        add_random_species(&mut state);
    }
}

fn add_random_species(state: &mut FlockState) {
    let probability = state.rng.rand_range(25..75) as i32;
    let neighbor_distance = state.rng.rand_range(0..50) as f32;
    let desired_separation = state.rng.rand_range(50..250) as f32;
    let separation = 0.001 + state.rng.rand_float() * 1.199;
    let alignment = 0.001 + state.rng.rand_float() * 1.199;
    let cohesion = 0.001 + state.rng.rand_float() * 1.199;
    let max_force = 0.001 + state.rng.rand_float() * 0.499;
    let max_speed = 0.001 + state.rng.rand_float() * 9.999;
    let bird_size = 0.5 + state.rng.rand_float() * 4.5;
    let r = state.rng.rand_range(100..255) as u8;
    let g = state.rng.rand_range(0..255) as u8;
    let b = state.rng.rand_range(0..255) as u8;

    let id = format!("{:08x}", state.rng.rand_u32());

    let cfg = BirdConfig::new(
        id.clone(),
        probability,
        neighbor_distance,
        desired_separation,
        separation,
        alignment,
        cohesion,
        max_speed,
        max_force,
        bird_size,
        r as f32 / 255.0,
        g as f32 / 255.0,
        b as f32 / 255.0,
    );

    state.flock.insert_bird_config(id.clone(), cfg.clone());
    state.configs.insert(id, cfg);
}

#[wasm_bindgen(start)]
pub fn wasm_main() {}

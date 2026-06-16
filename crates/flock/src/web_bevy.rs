//! WASM entrypoint for Bevy-based flock.
//!
//! Provides WebHandle API with external config control via wasm_bindgen.

use bevy::prelude::*;
use bevy_core::BevyCorePlugins;
use bevy_egui::EguiPlugin;
use std::cell::RefCell;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

use crate::flock::bird_config::BirdConfig;
use crate::flock::flock::Flock;

// ─────────────────────────────────────────────────────────────────────────────
// Shared Config (accessible from both JS and Bevy)
// ─────────────────────────────────────────────────────────────────────────────

/// External config that can be modified from JS
#[derive(Clone)]
pub struct ExternalConfig {
    pub timestep: f32,
    pub max_flock_size: u32,
    pub enable_randomization: bool,
    pub show_ui: bool,
}

impl Default for ExternalConfig {
    fn default() -> Self {
        Self {
            timestep: 1.0,
            max_flock_size: 2400,
            enable_randomization: true,
            show_ui: false, // Hide egui by default when controlled externally
        }
    }
}

thread_local! {
    static EXTERNAL_CONFIG: RefCell<ExternalConfig> = RefCell::new(ExternalConfig::default());
    static CONFIG_DIRTY: RefCell<bool> = RefCell::new(false);
}

fn get_external_config() -> ExternalConfig {
    EXTERNAL_CONFIG.with(|c| c.borrow().clone())
}

fn mark_config_dirty() {
    CONFIG_DIRTY.with(|d| *d.borrow_mut() = true);
}

fn take_config_dirty() -> bool {
    CONFIG_DIRTY.with(|d| {
        let dirty = *d.borrow();
        *d.borrow_mut() = false;
        dirty
    })
}

// ─────────────────────────────────────────────────────────────────────────────
// WebHandle - JS interface
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
    pub async fn start(&self, canvas: web_sys::HtmlCanvasElement) -> Result<(), JsValue> {
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

    // ─── Getters ───

    #[wasm_bindgen(getter)]
    pub fn timestep(&self) -> f32 {
        EXTERNAL_CONFIG.with(|c| c.borrow().timestep)
    }

    #[wasm_bindgen(getter)]
    pub fn max_flock_size(&self) -> u32 {
        EXTERNAL_CONFIG.with(|c| c.borrow().max_flock_size)
    }

    #[wasm_bindgen(getter)]
    pub fn enable_randomization(&self) -> bool {
        EXTERNAL_CONFIG.with(|c| c.borrow().enable_randomization)
    }

    #[wasm_bindgen(getter)]
    pub fn show_ui(&self) -> bool {
        EXTERNAL_CONFIG.with(|c| c.borrow().show_ui)
    }

    // ─── Setters ───

    #[wasm_bindgen(setter)]
    pub fn set_timestep(&self, v: f32) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().timestep = v.clamp(0.0, 5.0));
        mark_config_dirty();
    }

    #[wasm_bindgen(setter)]
    pub fn set_max_flock_size(&self, v: u32) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().max_flock_size = v.clamp(0, 5000));
        mark_config_dirty();
    }

    #[wasm_bindgen(setter)]
    pub fn set_enable_randomization(&self, v: bool) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().enable_randomization = v);
        mark_config_dirty();
    }

    #[wasm_bindgen(setter)]
    pub fn set_show_ui(&self, v: bool) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().show_ui = v);
        mark_config_dirty();
    }

    // ─── Legacy stubs ───

    #[wasm_bindgen]
    pub fn destroy(&self) {}

    #[wasm_bindgen]
    pub fn has_panicked(&self) -> bool {
        false
    }

    #[wasm_bindgen]
    pub fn is_pointer_over_ui(&self) -> bool {
        false
    }

    #[wasm_bindgen]
    pub fn spawn_at_norm(&self, _x: f32, _y: f32) {}
}

impl Default for WebHandle {
    fn default() -> Self {
        Self::new()
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Bevy Plugin
// ─────────────────────────────────────────────────────────────────────────────

struct FlockPlugin;

impl Plugin for FlockPlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(ClearColor(Color::BLACK))
            .init_resource::<FlockState>()
            .add_systems(Startup, setup)
            .add_systems(Update, sync_external_config)
            .add_systems(Update, simulation_step.after(sync_external_config))
            .add_systems(Update, render_birds.after(simulation_step))
            .add_systems(Update, mouse_spawn.after(render_birds));
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
    enable_randomization: bool,
    rng: oorandom::Rand32,
    animation: RandomizationAnimation,
}

impl Default for FlockState {
    fn default() -> Self {
        let seed = js_sys::Date::now() as u64;
        let ext = get_external_config();
        let max_flock_size = ext.max_flock_size as usize;
        let mut flock = Flock::new(max_flock_size, seed);
        let mut configs = HashMap::new();
        let mut rng = oorandom::Rand32::new(seed);

        // Theme colors
        let primary = [0.596, 0.906, 0.882]; // #98e7e1
        let secondary = [0.969, 0.827, 0.776]; // #f7d3c6
        let tertiary = [0.761, 0.882, 0.925]; // #c2e1ec
        let highlight = [0.941, 0.867, 0.490]; // #f0dd7d

        let mk_cfg = |id: &str, prob: i32, c: [f32; 3]| {
            BirdConfig::new(
                id.to_string(),
                prob,
                35.0,
                25.0,
                1.2,
                0.5,
                0.3,
                5.0,
                0.33,
                3.5,
                c[0],
                c[1],
                c[2],
            )
        };

        let cfg_primary = mk_cfg("primary", 30, primary);
        let cfg_secondary = mk_cfg("secondary", 30, secondary);
        let cfg_tertiary = mk_cfg("tertiary", 20, tertiary);
        let cfg_highlight = mk_cfg("highlight", 20, highlight);

        for (id, cfg) in [
            ("primary", &cfg_primary),
            ("secondary", &cfg_secondary),
            ("tertiary", &cfg_tertiary),
            ("highlight", &cfg_highlight),
        ] {
            flock.insert_bird_config(id.to_string(), cfg.clone());
            configs.insert(id.to_string(), cfg.clone());
        }

        // Pre-spawn birds
        let w = 900.0_f32;
        let h = 700.0_f32;
        let total: i32 = configs.values().map(|c| c.probability).sum();
        for _ in 0..max_flock_size {
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
            timestep: ext.timestep,
            max_flock_size,
            enable_randomization: ext.enable_randomization,
            rng,
            animation: RandomizationAnimation::default(),
        }
    }
}

/// Sync external config changes into bevy state
fn sync_external_config(mut state: ResMut<FlockState>) {
    if !take_config_dirty() {
        return;
    }

    let ext = get_external_config();
    state.timestep = ext.timestep;
    state.enable_randomization = ext.enable_randomization;

    let new_max = ext.max_flock_size as usize;
    if new_max != state.max_flock_size {
        state.max_flock_size = new_max;
        state.flock.set_max_flock_size(new_max);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Randomization Animation
// ─────────────────────────────────────────────────────────────────────────────

fn lerp(a: f32, b: f32, t: f32) -> f32 {
    a + (b - a) * t
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
    color: [f32; 3],
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
            color: [cfg.color_r, cfg.color_g, cfg.color_b],
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
            color: [
                (100 + rng.rand_range(0..155)) as f32 / 255.0,
                (80 + rng.rand_range(0..175)) as f32 / 255.0,
                (80 + rng.rand_range(0..175)) as f32 / 255.0,
            ],
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
        cfg.color_r = self.color[0];
        cfg.color_g = self.color[1];
        cfg.color_b = self.color[2];
    }
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
            probability: lerp(self.from.probability as f32, self.to.probability as f32, t).round()
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
            color: [
                lerp(self.from.color[0], self.to.color[0], t),
                lerp(self.from.color[1], self.to.color[1], t),
                lerp(self.from.color[2], self.to.color[2], t),
            ],
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
            self.active.insert(
                id.clone(),
                ConfigAnimation::new(from, to, self.interpolation_s),
            );
        }
    }

    fn step(&mut self, dt_s: f32, configs: &mut HashMap<String, BirdConfig>) {
        let mut finished = Vec::new();
        for (id, anim) in self.active.iter_mut() {
            anim.step(dt_s);
            if let Some(cfg) = configs.get_mut(id) {
                anim.current().apply_to_cfg(cfg);
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
// Bevy Systems
// ─────────────────────────────────────────────────────────────────────────────

#[derive(Component)]
struct BirdsMesh;

fn setup(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<ColorMaterial>>,
) {
    commands.spawn(Camera2d::default());

    let mesh = Mesh::new(
        bevy::render::mesh::PrimitiveTopology::LineList,
        bevy::render::render_asset::RenderAssetUsages::MAIN_WORLD
            | bevy::render::render_asset::RenderAssetUsages::RENDER_WORLD,
    );

    commands.spawn((
        Mesh2d(meshes.add(mesh)),
        MeshMaterial2d(materials.add(ColorMaterial {
            color: Color::WHITE,
            ..Default::default()
        })),
        BirdsMesh,
    ));
}

fn simulation_step(time: Res<Time>, mut state: ResMut<FlockState>, windows: Query<&Window>) {
    if let Ok(window) = windows.get_single() {
        state.scene_width = window.width();
        state.scene_height = window.height();
    }

    let dt = time.delta_secs();

    // Randomization animation
    {
        let FlockState {
            animation,
            rng,
            enable_randomization,
            configs,
            ..
        } = &mut *state;
        animation.maybe_start_cycle(rng, *enable_randomization, dt, configs);
        animation.step(dt, configs);
    }

    // Sync configs to flock if animations changed them
    if !state.animation.active.is_empty() {
        let updates: Vec<_> = state
            .configs
            .iter()
            .map(|(id, cfg)| (id.clone(), cfg.clone()))
            .collect();
        for (id, cfg) in updates {
            state.flock.insert_bird_config(id, cfg);
        }
    }
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

        let scale_v =
            |v: [f32; 3], s: f32| -> [f32; 3] { [cx + (v[0] - cx) * s, cy + (v[1] - cy) * s, 0.0] };

        let mut push_edges = |s: f32, a: f32| {
            let sv0 = scale_v(v0, s);
            let sv1 = scale_v(v1, s);
            let sv2 = scale_v(v2, s);
            let c = [r, g, b, a];
            positions.extend([sv0, sv1, sv1, sv2, sv2, sv0]);
            vertex_colors.extend([c, c, c, c, c, c]);
        };

        push_edges(2.8, 0.12);
        push_edges(1.6, 0.28);
        push_edges(1.0, 1.0);

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

                let FlockState {
                    configs,
                    rng,
                    flock,
                    ..
                } = &mut *state;
                let total: i32 = configs.values().map(|c| c.probability).sum();
                if total > 0 {
                    let mut r = (rng.rand_u32() % total as u32) as i32;
                    for (id, cfg) in configs.iter() {
                        r -= cfg.probability;
                        if r < 0 {
                            flock.add_bird(id.clone(), x, y);
                            break;
                        }
                    }
                }
            }
        }
    }
}

#[wasm_bindgen(start)]
pub fn wasm_main() {}

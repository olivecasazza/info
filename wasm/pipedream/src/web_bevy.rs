//! WASM entrypoint for Bevy-based pipedream.
//!
//! Migrated from original app.rs, using egui painter for rendering.

use wasm_bindgen::prelude::*;
use bevy::prelude::*;
use bevy_egui::{egui, EguiContexts, EguiPlugin};
use bevy_core::BevyCorePlugins;
use egui::{pos2, vec2, Color32, Pos2, Rect, Shape, Stroke};
use std::collections::HashSet;

/// WebHandle for Bevy-based pipedream WASM app.
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
                    title: "Pipedream".into(),
                    canvas: Some(selector),
                    fit_canvas_to_parent: true,
                    prevent_default_event_handling: false,
                    ..Default::default()
                }),
                ..Default::default()
            }))
            .add_plugins(EguiPlugin)
            .add_plugins(BevyCorePlugins)
            .add_plugins(PipedreamPlugin)
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

//=============================================================================
// Types from original app.rs
//=============================================================================

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct IVec3 {
    x: i32,
    y: i32,
    z: i32,
}

impl IVec3 {
    fn new(x: i32, y: i32, z: i32) -> Self {
        Self { x, y, z }
    }

    fn add(self, o: IVec3) -> IVec3 {
        IVec3::new(self.x + o.x, self.y + o.y, self.z + o.z)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum Dir {
    PosX,
    NegX,
    PosY,
    NegY,
    PosZ,
    NegZ,
}

impl Dir {
    fn vec(self) -> IVec3 {
        match self {
            Dir::PosX => IVec3::new(1, 0, 0),
            Dir::NegX => IVec3::new(-1, 0, 0),
            Dir::PosY => IVec3::new(0, 1, 0),
            Dir::NegY => IVec3::new(0, -1, 0),
            Dir::PosZ => IVec3::new(0, 0, 1),
            Dir::NegZ => IVec3::new(0, 0, -1),
        }
    }

    fn opposite(self) -> Dir {
        match self {
            Dir::PosX => Dir::NegX,
            Dir::NegX => Dir::PosX,
            Dir::PosY => Dir::NegY,
            Dir::NegY => Dir::PosY,
            Dir::PosZ => Dir::NegZ,
            Dir::NegZ => Dir::PosZ,
        }
    }
}

#[derive(Debug, Clone, Copy)]
struct Segment {
    from: IVec3,
    to: IVec3,
    dir: Dir,
    pipe_id: usize,
}

#[derive(Debug, Clone)]
struct Palette {
    bg: Color32,
    pipes: Vec<Color32>,
}

impl Palette {
    fn from_theme() -> Self {
        let primary = ui_theme::theme::primary();
        let secondary = ui_theme::theme::secondary();
        let highlight = ui_theme::theme::highlight();
        let compliment = ui_theme::theme::compliment();

        let pipes = vec![primary, secondary, highlight, compliment];

        let bg = Color32::from_rgb(
            primary.r() / 12,
            primary.g() / 12,
            primary.b() / 12,
        );

        Self { bg, pipes }
    }

    fn pipe(&self, pipe_id: usize) -> Color32 {
        if self.pipes.is_empty() {
            return Color32::from_rgb(40, 220, 120);
        }
        self.pipes[pipe_id % self.pipes.len()]
    }

    fn pipe_light(&self, base: Color32) -> Color32 {
        let [r, g, b, _] = base.to_array();
        Color32::from_rgb(r.saturating_add(50), g.saturating_add(50), b.saturating_add(50))
    }

    fn pipe_dark(&self, base: Color32) -> Color32 {
        let [r, g, b, _] = base.to_array();
        Color32::from_rgb(r / 2, g / 2, b / 2)
    }
}

struct IsoRenderer {
    scale: f32,
    pixel: f32,
}

impl Default for IsoRenderer {
    fn default() -> Self {
        Self { scale: 10.0, pixel: 3.0 }
    }
}

impl IsoRenderer {
    fn project(&self, x: f32, y: f32, z: f32) -> Pos2 {
        let sx = (x - y) * self.scale;
        let sy = (x + y) * 0.5 * self.scale - z * self.scale;
        pos2(sx, sy)
    }
}

//=============================================================================
// Pipe Simulation (from original app.rs)
//=============================================================================

struct PipeSim {
    bounds: IVec3,
    heads: Vec<IVec3>,
    dirs: Vec<Dir>,
    visited: HashSet<IVec3>,
    segments: Vec<Segment>,
    rng: oorandom::Rand32,
    min_spacing: i32,
    straightness: u32,
    max_len_per_pipe: usize,
    turn_delay: Vec<u32>,
}

impl PipeSim {
    fn new(seed: u64, bounds: IVec3, pipe_count: usize, min_spacing: i32) -> Self {
        let mut s = Self {
            bounds,
            heads: Vec::new(),
            dirs: Vec::new(),
            visited: HashSet::new(),
            segments: Vec::new(),
            rng: oorandom::Rand32::new(seed),
            min_spacing,
            straightness: 10,
            max_len_per_pipe: 500,
            turn_delay: Vec::new(),
        };
        s.reset(pipe_count);
        s
    }

    fn in_bounds(&self, p: IVec3) -> bool {
        p.x >= 0 && p.y >= 0 && p.z >= 0
            && p.x < self.bounds.x
            && p.y < self.bounds.y
            && p.z < self.bounds.z
    }

    fn rand_dir(&mut self) -> Dir {
        match (self.rng.rand_u32() % 6) as u8 {
            0 => Dir::PosX,
            1 => Dir::NegX,
            2 => Dir::PosY,
            3 => Dir::NegY,
            4 => Dir::PosZ,
            _ => Dir::NegZ,
        }
    }

    fn is_free(&self, p: IVec3, ignore_head: Option<usize>) -> bool {
        if !self.in_bounds(p) || self.visited.contains(&p) {
            return false;
        }
        let m = self.min_spacing.max(0);
        if m == 0 { return true; }

        for (i, head) in self.heads.iter().enumerate() {
            if ignore_head == Some(i) { continue; }
            let dist = (head.x - p.x).abs() + (head.y - p.y).abs() + (head.z - p.z).abs();
            if dist <= m { return false; }
        }
        true
    }

    fn find_free_cell(&mut self) -> IVec3 {
        for _ in 0..256 {
            let p = IVec3::new(
                (self.rng.rand_u32() % self.bounds.x as u32) as i32,
                (self.rng.rand_u32() % self.bounds.y as u32) as i32,
                (self.rng.rand_u32() % self.bounds.z as u32) as i32,
            );
            if self.is_free(p, None) { return p; }
        }
        IVec3::new(
            (self.rng.rand_u32() % self.bounds.x as u32) as i32,
            (self.rng.rand_u32() % self.bounds.y as u32) as i32,
            (self.rng.rand_u32() % self.bounds.z as u32) as i32,
        )
    }

    fn reset(&mut self, pipe_count: usize) {
        self.visited.clear();
        self.segments.clear();
        self.heads.clear();
        self.dirs.clear();
        self.turn_delay.clear();

        for i in 0..pipe_count {
            let head = self.find_free_cell();
            let dir = self.rand_dir();
            self.heads.push(head);
            self.dirs.push(dir);
            self.visited.insert(head);
            self.turn_delay.push(0);

            let to = head.add(dir.vec());
            if self.is_free(to, None) {
                self.segments.push(Segment { from: head, to, dir, pipe_id: i });
                self.heads[i] = to;
                self.visited.insert(to);
            }
        }
    }

    fn step(&mut self) {
        for pipe_id in 0..self.heads.len() {
            self.step_one(pipe_id);
        }
    }

    fn step_one(&mut self, pipe_id: usize) {
        let head = self.heads[pipe_id];
        let cur_dir = self.dirs[pipe_id];

        if self.turn_delay[pipe_id] > 0 {
            let next = head.add(cur_dir.vec());
            if self.is_free(next, Some(pipe_id)) {
                self.turn_delay[pipe_id] -= 1;
                self.advance(pipe_id, next, cur_dir);
                return;
            }
            self.turn_delay[pipe_id] = 0;
        }

        let mut dirs = [cur_dir, Dir::PosX, Dir::NegX, Dir::PosY, Dir::NegY, Dir::PosZ, Dir::NegZ];
        for i in 1..dirs.len() {
            let j = 1 + (self.rng.rand_u32() as usize % (dirs.len() - 1));
            dirs.swap(i, j);
        }

        let back = cur_dir.opposite();
        let mut best: Option<Dir> = None;

        for &d in &dirs {
            if d == back { continue; }
            let next = head.add(d.vec());
            if self.is_free(next, Some(pipe_id)) {
                best = Some(d);
                break;
            }
        }

        if best.is_none() {
            let next = head.add(back.vec());
            if self.is_free(next, Some(pipe_id)) {
                best = Some(back);
            }
        }

        let Some(d) = best else {
            let new_head = self.find_free_cell();
            self.heads[pipe_id] = new_head;
            self.dirs[pipe_id] = self.rand_dir();
            self.visited.insert(new_head);
            self.turn_delay[pipe_id] = 0;
            return;
        };

        let run = 1 + (self.rng.rand_u32() % self.straightness);
        self.turn_delay[pipe_id] = run;
        self.advance(pipe_id, head.add(d.vec()), d);
    }

    fn advance(&mut self, pipe_id: usize, to: IVec3, d: Dir) {
        let from = self.heads[pipe_id];
        self.segments.push(Segment { from, to, dir: d, pipe_id });
        self.heads[pipe_id] = to;
        self.dirs[pipe_id] = d;
        self.visited.insert(to);

        let limit = self.max_len_per_pipe * self.heads.len().max(1);
        if self.segments.len() > limit {
            let old = self.segments.remove(0);
            self.visited.remove(&old.from);
        }
    }
}

//=============================================================================
// Bevy Plugin
//=============================================================================

struct PipedreamPlugin;

impl Plugin for PipedreamPlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(ClearColor(Color::BLACK))
            .init_resource::<PipedreamState>()
            .add_systems(Startup, setup)
            .add_systems(Update, simulation_step)
            .add_systems(Update, render_system.after(simulation_step))
            .add_systems(Update, ui_system.after(render_system));
    }
}

#[derive(Resource)]
struct PipedreamState {
    palette: Palette,
    renderer: IsoRenderer,
    bounds: IVec3,
    pipe_count: usize,
    speed: f32,
    accumulator: f32,
    sim: PipeSim,
    ui: ui_theme::ProjectUi,
}

impl Default for PipedreamState {
    fn default() -> Self {
        let seed = js_sys::Date::now() as u64;
        let bounds = IVec3::new(88, 88, 88);
        let pipe_count = 8;
        let min_spacing = 5;

        let sim = PipeSim::new(seed, bounds, pipe_count, min_spacing);

        Self {
            palette: Palette::from_theme(),
            renderer: IsoRenderer::default(),
            bounds,
            pipe_count,
            speed: 20.0,
            accumulator: 0.0,
            sim,
            ui: ui_theme::ProjectUi::new("pipedream"),
        }
    }
}

fn setup(mut commands: Commands) {
    commands.spawn(Camera2d::default());
}

fn simulation_step(
    time: Res<Time>,
    mut state: ResMut<PipedreamState>,
) {
    state.accumulator += time.delta_secs() * state.speed;

    while state.accumulator >= 1.0 {
        state.sim.step();
        state.accumulator -= 1.0;
    }
}

fn render_system(
    mut contexts: EguiContexts,
    state: Res<PipedreamState>,
) {
    let ctx = contexts.ctx_mut();

    egui::CentralPanel::default()
        .frame(egui::Frame::none())
        .show(ctx, |ui| {
            let rect = ui.max_rect();
            let painter = ui.painter_at(rect);

            // Draw background
            painter.rect_filled(rect, 0.0, state.palette.bg);

            // Draw pipes with depth sorting
            draw_pipes(&state, &painter, rect);
        });
}

fn draw_pipes(state: &PipedreamState, painter: &egui::Painter, rect: Rect) {
    let center = rect.center();

    // Project function
    let iso_centered = |x: f32, y: f32, z: f32| -> Pos2 {
        state.renderer.project(x, y, z) + center.to_vec2()
    };

    // Collect and depth-sort
    enum DrawCmd {
        Segment { from: IVec3, to: IVec3, pipe_id: usize, depth: f32 },
        Rj45 { pos: IVec3, dir: Dir, depth: f32 },
    }

    let mut cmds = Vec::with_capacity(state.sim.segments.len() + state.sim.heads.len());

    // Collect segments
    for seg in &state.sim.segments {
        let mx = (seg.from.x + seg.to.x) as f32 * 0.5;
        let my = (seg.from.y + seg.to.y) as f32 * 0.5;
        let mz = (seg.from.z + seg.to.z) as f32 * 0.5;
        let depth = mx + my + mz;
        cmds.push(DrawCmd::Segment { from: seg.from, to: seg.to, pipe_id: seg.pipe_id, depth });
    }

    // Collect RJ45 heads
    for (pipe_id, head) in state.sim.heads.iter().enumerate() {
        let dir = state.sim.dirs[pipe_id];
        let l = 2.0;
        let dv = dir.vec();
        let cx = head.x as f32 + (dv.x as f32) * (l * 0.4);
        let cy = head.y as f32 + (dv.y as f32) * (l * 0.4);
        let cz = head.z as f32 + (dv.z as f32) * (l * 0.4);
        let depth = cx + cy + cz;
        cmds.push(DrawCmd::Rj45 { pos: *head, dir, depth });
    }

    // Sort by depth
    cmds.sort_by(|a, b| {
        let da = match a { DrawCmd::Segment { depth, .. } => *depth, DrawCmd::Rj45 { depth, .. } => *depth };
        let db = match b { DrawCmd::Segment { depth, .. } => *depth, DrawCmd::Rj45 { depth, .. } => *depth };
        da.partial_cmp(&db).unwrap_or(std::cmp::Ordering::Equal)
    });

    let px = state.renderer.pixel.max(1.0);
    let s = state.renderer.scale;
    let base_thick = ((0.9 * s) / px).max(1.0);
    let shadow_thick = ((1.2 * s) / px).max(1.0);
    let high_thick = ((0.3 * s) / px).max(1.0);

    for cmd in cmds {
        match cmd {
            DrawCmd::Segment { from, to, pipe_id, .. } => {
                let a = iso_centered(from.x as f32, from.y as f32, from.z as f32);
                let b = iso_centered(to.x as f32, to.y as f32, to.z as f32);
                let base_color = state.palette.pipe(pipe_id);
                let highlight = state.palette.pipe_light(base_color);
                let shadow = state.palette.pipe_dark(base_color);

                let d = (b - a).normalized();
                let perp = vec2(-d.y, d.x);

                // Shadow
                draw_pixel_line(painter, a + perp * px, b + perp * px, shadow, shadow_thick, px);
                // Base
                draw_pixel_line(painter, a, b, base_color, base_thick, px);
                // Highlight
                draw_pixel_line(painter, a - perp * px * 0.5, b - perp * px * 0.5, highlight, high_thick, px);
            }
            DrawCmd::Rj45 { pos, dir, .. } => {
                draw_rj45(state, painter, rect, pos, dir);
            }
        }
    }
}

fn draw_pixel_line(painter: &egui::Painter, p1: Pos2, p2: Pos2, color: Color32, thickness: f32, px: f32) {
    let d = p2 - p1;
    let len = d.length();
    if len < 0.1 { return; }

    let step_size = px * 0.5;
    let steps = (len / step_size).ceil() as i32;

    for i in 0..=steps {
        let t = i as f32 / steps as f32;
        let pos = p1 + d * t;
        let cx = (pos.x / px).round() * px;
        let cy = (pos.y / px).round() * px;
        let size = px * thickness;
        let r = Rect::from_center_size(pos2(cx, cy), vec2(size, size));
        painter.rect_filled(r, 0.0, color);
    }
}

fn draw_rj45(state: &PipedreamState, painter: &egui::Painter, rect: Rect, pos: IVec3, dir: Dir) {
    let center = rect.center();
    let iso_centered = |x: f32, y: f32, z: f32| -> Pos2 {
        state.renderer.project(x, y, z) + center.to_vec2()
    };

    let l = 2.0;
    let w = 1.0;
    let h = 0.7;

    let (sx, sy, sz) = match dir {
        Dir::PosX | Dir::NegX => (l, w, h),
        Dir::PosY | Dir::NegY => (w, l, h),
        Dir::PosZ | Dir::NegZ => (w, h, l),
    };

    let px = pos.x as f32;
    let py = pos.y as f32;
    let pz = pos.z as f32;
    let dv = dir.vec();
    let cx = px + (dv.x as f32) * (l * 0.4);
    let cy = py + (dv.y as f32) * (l * 0.4);
    let cz = pz + (dv.z as f32) * (l * 0.4);

    // Draw body as isometric box
    draw_iso_box(state, painter, rect, [cx, cy, cz], [sx, sy, sz], Color32::from_rgb(210, 210, 230));
}

fn draw_iso_box(
    state: &PipedreamState,
    painter: &egui::Painter,
    rect: Rect,
    center: [f32; 3],
    size: [f32; 3],
    color: Color32,
) {
    let iso_centered = |x: f32, y: f32, z: f32| -> Pos2 {
        state.renderer.project(x, y, z) + rect.center().to_vec2()
    };

    let (cx, cy, cz) = (center[0], center[1], center[2]);
    let (sx, sy, sz) = (size[0] * 0.5, size[1] * 0.5, size[2] * 0.5);

    let px = state.renderer.pixel.max(1.0);
    let snap = |p: Pos2| {
        pos2((p.x / px).round() * px, (p.y / px).round() * px)
    };

    // Top face
    let t_back = snap(iso_centered(cx - sx, cy - sy, cz + sz));
    let t_right = snap(iso_centered(cx + sx, cy - sy, cz + sz));
    let t_front = snap(iso_centered(cx + sx, cy + sy, cz + sz));
    let t_left = snap(iso_centered(cx - sx, cy + sy, cz + sz));

    // Bottom face connections
    let b_right = snap(iso_centered(cx + sx, cy - sy, cz - sz));
    let b_front = snap(iso_centered(cx + sx, cy + sy, cz - sz));
    let b_left = snap(iso_centered(cx - sx, cy + sy, cz - sz));

    // Right face
    painter.add(Shape::convex_polygon(
        vec![t_right, t_front, b_front, b_right],
        state.palette.pipe_dark(color),
        Stroke::NONE,
    ));

    // Left face
    painter.add(Shape::convex_polygon(
        vec![t_left, t_front, b_front, b_left],
        color,
        Stroke::NONE,
    ));

    // Top face
    painter.add(Shape::convex_polygon(
        vec![t_back, t_right, t_front, t_left],
        state.palette.pipe_light(color),
        Stroke::NONE,
    ));
}

fn ui_system(
    mut contexts: EguiContexts,
    mut state: ResMut<PipedreamState>,
    keyboard: Res<ButtonInput<KeyCode>>,
    time: Res<Time>,
) {
    if keyboard.just_pressed(KeyCode::Tab) {
        state.ui.toggle();
    }

    let ctx = contexts.ctx_mut();
    let dt = time.delta_secs();

    let mut ui = std::mem::take(&mut state.ui);

    ui.frame(ctx, dt, |egui_ui| {
        egui_ui.collapsing("simulation", |ui| {
            ui.add(egui::Slider::new(&mut state.speed, 5.0..=240.0).text("speed"));
            ui.add(egui::Slider::new(&mut state.renderer.scale, 6.0..=26.0).text("scale"));
            ui.add(egui::Slider::new(&mut state.renderer.pixel, 1.0..=8.0).text("pixel"));
            ui.add(egui::Slider::new(&mut state.pipe_count, 1..=8).text("pipes"));
            ui.add(egui::Slider::new(&mut state.sim.min_spacing, 0..=2).text("min spacing"));
            ui.add(egui::Slider::new(&mut state.sim.straightness, 1..=20).text("straightness"));
            ui.add(egui::Slider::new(&mut state.sim.max_len_per_pipe, 10..=2000).text("max length"));

            if ui.button("reset pipes").clicked() {
                let pipe_count = state.pipe_count;
                state.sim.reset(pipe_count);
            }
        });
    });

    state.ui = ui;

    ctx.request_repaint();
}

#[wasm_bindgen(start)]
pub fn wasm_main() {}

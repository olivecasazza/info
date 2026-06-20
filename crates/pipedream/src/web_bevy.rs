//! WASM entrypoint for Bevy-based pipedream.
//!
//! A data-center campus visualizer. Three layers:
//!  * `PipeSim` — a 4-level wiring tree (global core → site core → aisle
//!    aggregation switch → server). Flows route up their source server's
//!    branch, across the backbone, and down into a destination server. Trunks
//!    emerge for free because siblings share parents.
//!  * `ServerNode` — low-poly server boxes laid out in site aisles (rows of
//!    racks) that assemble with a Lego-style "reverse explode" animation.
//!  * `draw_rj45` — a detailed RJ45 plug on each server faceplate.

use bevy::prelude::*;
use bevy::window::WindowResolution;
use bevy_core::BevyCorePlugins;
use bevy_egui::{egui, EguiContexts, EguiPlugin};
use egui::{pos2, Color32, Pos2, Rect, Shape, Stroke};
use std::cell::RefCell;
use wasm_bindgen::prelude::*;

//=============================================================================
// External config for JS control
//=============================================================================

#[derive(Clone)]
struct ExternalConfig {
    speed: f32,
    scale: f32,
    pixel: f32,
    flows: usize,
    sites: usize,
    aisles: usize,
    racks: usize,
    trail: usize,
    show_ui: bool,
    reset_requested: bool,
}

impl Default for ExternalConfig {
    fn default() -> Self {
        Self {
            speed: 24.0,
            scale: 2.0,
            pixel: 2.5,
            flows: 12,
            sites: 4,
            aisles: 3,
            racks: 5,
            trail: 320,
            show_ui: false, // Hide egui by default; Dioxus controls are used instead
            reset_requested: false,
        }
    }
}

thread_local! {
    static EXTERNAL_CONFIG: RefCell<ExternalConfig> = RefCell::new(ExternalConfig::default());
    static CONFIG_DIRTY: RefCell<bool> = const { RefCell::new(false) };
}

fn mark_config_dirty() {
    CONFIG_DIRTY.with(|d| *d.borrow_mut() = true);
}

fn take_config_dirty() -> bool {
    CONFIG_DIRTY.with(|d| {
        let was = *d.borrow();
        *d.borrow_mut() = false;
        was
    })
}

fn get_external_config() -> ExternalConfig {
    EXTERNAL_CONFIG.with(|c| c.borrow().clone())
}

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
    pub async fn start(&self, canvas: web_sys::HtmlCanvasElement) -> Result<(), JsValue> {
        let canvas_id = canvas.id();
        let selector = if canvas_id.is_empty() {
            "#bevy-canvas".to_string()
        } else {
            format!("#{}", canvas_id)
        };
        let parent_size = canvas.parent_element().map(|parent| {
            (
                parent.client_width().max(640) as f32,
                parent.client_height().max(360) as f32,
            )
        });
        let (css_w, css_h) = parent_size.unwrap_or((960.0, 540.0));
        let backing_scale = 2.5_f32;
        let backing_w = (css_w / backing_scale).round().max(320.0);
        let backing_h = (css_h / backing_scale).round().max(200.0);
        canvas.set_width(backing_w as u32);
        canvas.set_height(backing_h as u32);
        let style = canvas.style();
        let _ = style.set_property("width", "100%");
        let _ = style.set_property("height", "100%");
        let _ = style.set_property("image-rendering", "pixelated");

        App::new()
            .add_plugins(DefaultPlugins.set(WindowPlugin {
                primary_window: Some(Window {
                    title: "Pipedream".into(),
                    canvas: Some(selector),
                    resolution: WindowResolution::new(backing_w, backing_h)
                        .with_scale_factor_override(1.0),
                    fit_canvas_to_parent: false,
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
    pub fn has_panicked(&self) -> bool {
        false
    }

    #[wasm_bindgen]
    pub fn spawn_at_norm(&self, _x: f32, _y: f32) {}

    // External config getters/setters

    #[wasm_bindgen(getter)]
    pub fn speed(&self) -> f32 {
        EXTERNAL_CONFIG.with(|c| c.borrow().speed)
    }

    #[wasm_bindgen(setter)]
    pub fn set_speed(&self, v: f32) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().speed = v.clamp(1.0, 480.0));
        mark_config_dirty();
    }

    #[wasm_bindgen(getter)]
    pub fn scale(&self) -> f32 {
        EXTERNAL_CONFIG.with(|c| c.borrow().scale)
    }

    #[wasm_bindgen(setter)]
    pub fn set_scale(&self, v: f32) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().scale = v.clamp(1.0, 32.0));
        mark_config_dirty();
    }

    #[wasm_bindgen(getter)]
    pub fn pixel(&self) -> f32 {
        EXTERNAL_CONFIG.with(|c| c.borrow().pixel)
    }

    #[wasm_bindgen(setter)]
    pub fn set_pixel(&self, v: f32) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().pixel = v.clamp(1.0, 4.0));
        mark_config_dirty();
    }

    #[wasm_bindgen(getter)]
    pub fn flows(&self) -> usize {
        EXTERNAL_CONFIG.with(|c| c.borrow().flows)
    }

    #[wasm_bindgen(setter)]
    pub fn set_flows(&self, v: usize) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().flows = v.clamp(1, 40));
        mark_config_dirty();
    }

    #[wasm_bindgen(getter)]
    pub fn sites(&self) -> usize {
        EXTERNAL_CONFIG.with(|c| c.borrow().sites)
    }

    #[wasm_bindgen(setter)]
    pub fn set_sites(&self, v: usize) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().sites = v.clamp(1, 9));
        mark_config_dirty();
    }

    #[wasm_bindgen(getter)]
    pub fn aisles(&self) -> usize {
        EXTERNAL_CONFIG.with(|c| c.borrow().aisles)
    }

    #[wasm_bindgen(setter)]
    pub fn set_aisles(&self, v: usize) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().aisles = v.clamp(1, 6));
        mark_config_dirty();
    }

    #[wasm_bindgen(getter)]
    pub fn racks(&self) -> usize {
        EXTERNAL_CONFIG.with(|c| c.borrow().racks)
    }

    #[wasm_bindgen(setter)]
    pub fn set_racks(&self, v: usize) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().racks = v.clamp(1, 8));
        mark_config_dirty();
    }

    #[wasm_bindgen(getter)]
    pub fn trail(&self) -> usize {
        EXTERNAL_CONFIG.with(|c| c.borrow().trail)
    }

    #[wasm_bindgen(setter)]
    pub fn set_trail(&self, v: usize) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().trail = v.clamp(50, 2000));
        mark_config_dirty();
    }

    #[wasm_bindgen(getter)]
    pub fn show_ui(&self) -> bool {
        EXTERNAL_CONFIG.with(|c| c.borrow().show_ui)
    }

    #[wasm_bindgen(setter)]
    pub fn set_show_ui(&self, v: bool) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().show_ui = v);
        mark_config_dirty();
    }

    #[wasm_bindgen]
    pub fn reset_pipes(&self) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().reset_requested = true);
        mark_config_dirty();
    }
}

//=============================================================================
// Core types
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

    fn comp(self, i: usize) -> i32 {
        match i {
            0 => self.x,
            1 => self.y,
            _ => self.z,
        }
    }
}

fn manhattan(a: IVec3, b: IVec3) -> i32 {
    (a.x - b.x).abs() + (a.y - b.y).abs() + (a.z - b.z).abs()
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
}

#[derive(Debug, Clone, Copy)]
struct Segment {
    from: IVec3,
    to: IVec3,
    dir: Dir,
    pipe_id: usize,
}

/// Animation helpers (pure math).
fn smoothstep(edge0: f32, edge1: f32, x: f32) -> f32 {
    let t = ((x - edge0) / (edge1 - edge0)).clamp(0.0, 1.0);
    t * t * (3.0 - 2.0 * t)
}

/// Deterministic pseudo-random unit direction from a seed + part index — drives
/// the "pieces fly in from scattered offsets" assembly animation.
fn scatter_dir(seed: u32, idx: u32) -> [f32; 3] {
    let r = |k: u32| -> f32 {
        let v = seed
            .wrapping_mul(2654435761)
            .wrapping_add(k.wrapping_mul(40503));
        (((v >> 8) & 0xFFFF) as f32 / 65535.0) * 2.0 - 1.0
    };
    let x = r(idx * 3);
    let y = r(idx * 3 + 1);
    let z = r(idx * 3 + 2);
    let m = (x * x + y * y + z * z).sqrt().max(0.001);
    [x / m, y / m, z / m]
}

/// Shade a color by a multiplier, preserving (or replacing) alpha.
fn shade(c: Color32, f: f32, a: u8) -> Color32 {
    let [r, g, b, _] = c.to_array();
    let sr = (r as f32 * f).clamp(0.0, 255.0) as u8;
    let sg = (g as f32 * f).clamp(0.0, 255.0) as u8;
    let sb = (b as f32 * f).clamp(0.0, 255.0) as u8;
    Color32::from_rgba_unmultiplied(sr, sg, sb, a)
}

//=============================================================================
// Palette
//=============================================================================

#[derive(Debug, Clone)]
struct Palette {
    bg: Color32,
    pipes: Vec<Color32>,
    plug_clear: Color32,
    pin_gold: Color32,
    tab: Color32,
    chassis: Color32,
    faceplate: Color32,
    lid: Color32,
    led: [Color32; 3],
    /// Infrastructure node colors: [aisle agg, site core, global core].
    infra: [Color32; 3],
    /// T568B wire order, pin 1..8.
    wires: [Color32; 8],
}

impl Palette {
    fn from_theme() -> Self {
        let primary = ui_theme::theme::primary();
        let secondary = ui_theme::theme::secondary();
        let highlight = ui_theme::theme::highlight();
        let compliment = ui_theme::theme::compliment();

        let pipes = vec![primary, secondary, highlight, compliment];

        let bg = Color32::from_rgb(primary.r() / 12, primary.g() / 12, primary.b() / 12);

        let chassis = Color32::from_rgb(secondary.r() / 3, secondary.g() / 3, secondary.b() / 3);
        let lid = Color32::from_rgb(
            secondary.r() / 2 + 12,
            secondary.g() / 2 + 12,
            secondary.b() / 2 + 12,
        );
        let faceplate = Color32::from_rgb(40, 44, 52);

        let led = [
            Color32::from_rgb(90, 230, 120),
            Color32::from_rgb(240, 190, 70),
            Color32::from_rgb(80, 150, 240),
        ];

        // Aisle aggregation, site core, global core — escalating brightness so
        // the tree's spine reads top-down at a glance.
        let infra = [highlight, compliment, Color32::from_rgb(236, 232, 220)];

        // T568B pinout colors.
        let wires = [
            Color32::from_rgb(245, 228, 205), // 1 white/orange
            Color32::from_rgb(235, 150, 40),  // 2 orange
            Color32::from_rgb(218, 240, 212), // 3 white/green
            Color32::from_rgb(60, 110, 220),  // 4 blue
            Color32::from_rgb(214, 230, 246), // 5 white/blue
            Color32::from_rgb(60, 180, 90),   // 6 green
            Color32::from_rgb(236, 224, 202), // 7 white/brown
            Color32::from_rgb(150, 95, 50),   // 8 brown
        ];

        Self {
            bg,
            pipes,
            plug_clear: Color32::from_rgb(206, 218, 236),
            pin_gold: Color32::from_rgb(236, 200, 92),
            tab: Color32::from_rgb(196, 206, 224),
            chassis,
            faceplate,
            lid,
            led,
            infra,
            wires,
        }
    }

    fn pipe(&self, pipe_id: usize) -> Color32 {
        if self.pipes.is_empty() {
            return Color32::from_rgb(40, 220, 120);
        }
        self.pipes[pipe_id % self.pipes.len()]
    }

    fn pipe_light(&self, base: Color32) -> Color32 {
        let [r, g, b, _] = base.to_array();
        Color32::from_rgb(
            r.saturating_add(50),
            g.saturating_add(50),
            b.saturating_add(50),
        )
    }

    fn pipe_dark(&self, base: Color32) -> Color32 {
        let [r, g, b, _] = base.to_array();
        Color32::from_rgb(r / 2, g / 2, b / 2)
    }
}

/// Isometric projection. `focus` is the world point that maps to screen center,
/// so a campus laid out on the ground plane (x,y) with z up stays framed.
struct IsoRenderer {
    scale: f32,
    pixel: f32,
    focus: [f32; 3],
}

impl Default for IsoRenderer {
    fn default() -> Self {
        Self {
            scale: 2.0,
            pixel: 2.5,
            focus: [0.0, 0.0, 0.0],
        }
    }
}

impl IsoRenderer {
    fn project(&self, x: f32, y: f32, z: f32) -> Pos2 {
        let dx = x - self.focus[0];
        let dy = y - self.focus[1];
        let dz = z - self.focus[2];
        let sx = (dx - dy) * self.scale;
        let sy = (dx + dy) * 0.5 * self.scale - dz * self.scale;
        pos2(sx, sy)
    }
}

//=============================================================================
/// Data-center wiring tree on a voxel grid.
///
/// Layout: `sites` data centers on a ground-plane grid. Each site is `aisles`
/// rows of `racks` server boxes, with an aisle aggregation switch at the head
/// of each aisle and a site core switch in front. A single global core sits at
/// campus center and elevation.
///
/// Topology (4-level tree): global core → site core → aisle agg → server.
/// Each flow picks a random source and destination server and routes up its
/// source branch, across the backbone, and down the destination branch. Cables
/// bound for the same parent share that parent's junction, so trunks form
/// without any explicit corridor logic.

/// One data-center site: a core switch plus one aggregation switch per aisle.
struct Site {
    core: IVec3,
    aisle_aggs: Vec<IVec3>,
}

struct PipeSim {
    bounds: IVec3,
    global_core: IVec3,
    /// Persistent server positions and which site/aisle each belongs to.
    servers: Vec<IVec3>,
    server_facings: Vec<Dir>,
    server_site: Vec<usize>,
    server_aisle: Vec<usize>,
    sites: Vec<Site>,
    /// Per-flow state.
    heads: Vec<IVec3>,
    dirs: Vec<Dir>,
    leaf_targets: Vec<IVec3>,
    routes: Vec<Vec<Dir>>,
    segments: Vec<Segment>,
    rng: oorandom::Rand32,
    trail: usize,
    /// Topology dimensions.
    n_sites: usize,
    aisles: usize,
    racks: usize,
}

impl PipeSim {
    fn new(
        seed: u64,
        bounds: IVec3,
        flows: usize,
        sites: usize,
        aisles: usize,
        racks: usize,
    ) -> Self {
        let mut s = Self {
            bounds,
            global_core: IVec3::new(bounds.x / 2, bounds.y / 2, bounds.z / 2),
            servers: Vec::new(),
            server_facings: Vec::new(),
            server_site: Vec::new(),
            server_aisle: Vec::new(),
            sites: Vec::new(),
            heads: Vec::new(),
            dirs: Vec::new(),
            leaf_targets: Vec::new(),
            routes: Vec::new(),
            segments: Vec::new(),
            rng: oorandom::Rand32::new(seed),
            trail: 320,
            n_sites: sites,
            aisles,
            racks,
        };
        s.reset(flows);
        s
    }

    fn in_bounds(&self, p: IVec3) -> bool {
        p.x >= 0
            && p.y >= 0
            && p.z >= 0
            && p.x < self.bounds.x
            && p.y < self.bounds.y
            && p.z < self.bounds.z
    }

    fn clamp_point(&self, p: IVec3) -> IVec3 {
        IVec3::new(
            p.x.clamp(1, self.bounds.x - 2),
            p.y.clamp(1, self.bounds.y - 2),
            p.z.clamp(1, self.bounds.z - 2),
        )
    }

    /// Renderer focus (world point that maps to screen center). Centered on the
    /// server centroid — the bulk of the geometry — rather than the bounds box,
    /// so an off-center or non-square site grid still frames well. The z bias
    /// sits between the ground racks and the elevated cores so neither the
    /// backbone nor the rows fall off an edge.
    fn focus(&self) -> [f32; 3] {
        if self.servers.is_empty() {
            return [self.bounds.x as f32 * 0.5, self.bounds.y as f32 * 0.5, 14.0];
        }
        let (mut sx, mut sy) = (0.0_f32, 0.0_f32);
        for s in &self.servers {
            sx += s.x as f32;
            sy += s.y as f32;
        }
        let n = self.servers.len() as f32;
        [sx / n, sy / n, 14.0]
    }

    /// Lay out sites, aisles, racks and the switch tree on the ground plane.
    fn generate_topology(&mut self) {
        self.servers.clear();
        self.server_facings.clear();
        self.server_site.clear();
        self.server_aisle.clear();
        self.sites.clear();

        let n = self.n_sites.max(1);
        let aisles = self.aisles.max(1);
        let racks = self.racks.max(1);

        // Square-ish campus grid of sites.
        let cols = (n as f32).sqrt().ceil() as usize;
        let rows = n.div_ceil(cols);

        let lo = 14.0_f32;
        let hi = self.bounds.x.min(self.bounds.y) as f32 - 14.0;
        let cell_x = (hi - lo) / cols as f32;
        let cell_y = (hi - lo) / rows as f32;
        let cell = cell_x.min(cell_y);

        let ground_z = 8.0_f32;
        self.global_core = self.clamp_point(IVec3::new(
            self.bounds.x / 2,
            self.bounds.y / 2,
            (ground_z + 20.0) as i32,
        ));

        for s in 0..n {
            let cx = s % cols;
            let cy = s / cols;
            let center_x = lo + cell_x * (cx as f32 + 0.5);
            let center_y = lo + cell_y * (cy as f32 + 0.5);

            // Pitches sized to the cell so a site never bleeds into its
            // neighbor regardless of the aisle/rack sliders.
            let usable = cell * 0.74;
            let rack_pitch = (usable / racks as f32).clamp(3.0, 6.0);
            let aisle_pitch = (usable / aisles as f32).clamp(4.0, 7.0);

            let block_w = rack_pitch * (racks as f32 - 1.0); // along x (racks)
            let block_h = aisle_pitch * (aisles as f32 - 1.0); // along y (aisles)
            let x0 = center_x - block_w * 0.5;
            let y0 = center_y - block_h * 0.5;

            let mut site = Site {
                core: IVec3::new(0, 0, 0),
                aisle_aggs: Vec::with_capacity(aisles),
            };

            for a in 0..aisles {
                let ay = y0 + aisle_pitch * a as f32;
                // Aisle aggregation switch at the front (low x) of the row,
                // raised onto an overhead tray.
                let agg = self.clamp_point(IVec3::new(
                    (x0 - 4.0) as i32,
                    ay.round() as i32,
                    (ground_z + 4.0) as i32,
                ));
                site.aisle_aggs.push(agg);

                for r in 0..racks {
                    let rx = x0 + rack_pitch * r as f32;
                    let pos =
                        self.clamp_point(IVec3::new(rx.round() as i32, ay.round() as i32, ground_z as i32));
                    self.servers.push(pos);
                    self.server_facings.push(Dir::PosX);
                    self.server_site.push(s);
                    self.server_aisle.push(a);
                }
            }

            // Site core: in front of the aisles, higher than the aggs.
            site.core = self.clamp_point(IVec3::new(
                (x0 - 8.0) as i32,
                center_y.round() as i32,
                (ground_z + 10.0) as i32,
            ));
            self.sites.push(site);
        }
    }

    fn reset(&mut self, flows: usize) {
        self.segments.clear();
        self.heads.clear();
        self.dirs.clear();
        self.leaf_targets.clear();
        self.routes.clear();

        self.generate_topology();

        for _ in 0..flows {
            self.heads.push(self.global_core);
            self.dirs.push(Dir::PosX);
            self.leaf_targets.push(self.global_core);
            self.routes.push(Vec::new());
            self.respawn(self.heads.len() - 1);
        }
    }

    /// Pick a random destination server different from `src`.
    fn pick_dest(&mut self, src: usize) -> usize {
        if self.servers.len() <= 1 {
            return src;
        }
        loop {
            let d = (self.rng.rand_u32() % self.servers.len() as u32) as usize;
            if d != src {
                return d;
            }
        }
    }

    /// Small deterministic per-flow lane offset so parallel cables in a shared
    /// trunk separate into a bundle instead of collapsing onto one line.
    fn lane(flow: usize) -> IVec3 {
        let a = (flow % 5) as i32 - 2;
        let b = ((flow / 5) % 5) as i32 - 2;
        let c = (flow % 3) as i32 - 1;
        IVec3::new(a, b, c)
    }

    fn push_axis_steps(route: &mut Vec<Dir>, from: &mut IVec3, to: IVec3) {
        let mut axes = [
            (0usize, (to.x - from.x).abs()),
            (1usize, (to.y - from.y).abs()),
            (2usize, (to.z - from.z).abs()),
        ];
        axes.sort_by(|a, b| b.1.cmp(&a.1));

        for (axis, _) in axes {
            match axis {
                0 => {
                    while from.x != to.x {
                        if to.x > from.x {
                            route.push(Dir::PosX);
                            from.x += 1;
                        } else {
                            route.push(Dir::NegX);
                            from.x -= 1;
                        }
                    }
                }
                1 => {
                    while from.y != to.y {
                        if to.y > from.y {
                            route.push(Dir::PosY);
                            from.y += 1;
                        } else {
                            route.push(Dir::NegY);
                            from.y -= 1;
                        }
                    }
                }
                _ => {
                    while from.z != to.z {
                        if to.z > from.z {
                            route.push(Dir::PosZ);
                            from.z += 1;
                        } else {
                            route.push(Dir::NegZ);
                            from.z -= 1;
                        }
                    }
                }
            }
        }
    }

    /// Route a flow up the source server's branch (server → aisle agg → site
    /// core), across the backbone (→ global core → dest site core) when the
    /// destination is in another site, then down the destination branch.
    fn build_route(&self, src: usize, dest: usize, flow: usize) -> Vec<Dir> {
        let off = Self::lane(flow);
        let s_site = self.server_site[src];
        let s_aisle = self.server_aisle[src];
        let d_site = self.server_site[dest];
        let d_aisle = self.server_aisle[dest];

        let src_pos = self.servers[src];
        let dest_pos = self.servers[dest];

        let mut wps: Vec<IVec3> = Vec::new();
        wps.push(self.clamp_point(self.sites[s_site].aisle_aggs[s_aisle].add(off)));
        wps.push(self.clamp_point(self.sites[s_site].core.add(off)));
        if s_site != d_site {
            wps.push(self.clamp_point(self.global_core.add(off)));
            wps.push(self.clamp_point(self.sites[d_site].core.add(off)));
        }
        wps.push(self.clamp_point(self.sites[d_site].aisle_aggs[d_aisle].add(off)));
        wps.push(dest_pos);

        let mut route = Vec::new();
        let mut p = src_pos;
        for wp in wps {
            if wp != p {
                Self::push_axis_steps(&mut route, &mut p, wp);
            }
        }
        route
    }

    /// (Re)spawn a flow: pick a random src→dest server pair and route through
    /// the tree.
    fn respawn(&mut self, flow: usize) {
        if self.servers.is_empty() {
            self.routes[flow] = Vec::new();
            return;
        }
        let src = (self.rng.rand_u32() % self.servers.len() as u32) as usize;
        let dest = self.pick_dest(src);
        let src_pos = self.servers[src];
        let dest_pos = self.servers[dest];

        self.heads[flow] = src_pos;
        let route = self.build_route(src, dest, flow);
        self.dirs[flow] = route.first().copied().unwrap_or(Dir::PosX);
        self.leaf_targets[flow] = dest_pos;
        self.routes[flow] = route;
    }

    fn step(&mut self) {
        let count = self.heads.len();
        for flow in 0..count {
            self.step_one(flow);
        }
    }

    fn step_one(&mut self, flow: usize) {
        if self.routes.get(flow).map_or(true, |r| r.is_empty()) {
            self.respawn(flow);
            return;
        }

        let d = self.routes[flow].remove(0);
        let head = self.heads[flow];
        let next = head.add(d.vec());
        if !self.in_bounds(next) {
            self.respawn(flow);
            return;
        }

        self.advance(flow, next, d);

        if self.routes[flow].is_empty()
            || manhattan(self.heads[flow], self.leaf_targets[flow]) <= 1
        {
            self.respawn(flow);
        }
    }

    fn advance(&mut self, flow: usize, to: IVec3, d: Dir) {
        let from = self.heads[flow];
        self.segments.push(Segment {
            from,
            to,
            dir: d,
            pipe_id: flow,
        });
        self.heads[flow] = to;
        self.dirs[flow] = d;

        // FIFO trail reaping so the volume never saturates. Inter-site routes
        // are long, so the budget scales with both trail length and flow count.
        let limit = self.trail * self.heads.len().max(1);
        if self.segments.len() > limit {
            self.segments.remove(0);
        }
    }
}

//=============================================================================
// Server nodes (tree leaves) with assembly animation
//=============================================================================

struct ServerNode {
    pos: IVec3,
    facing: Dir,
    spawn_time: f32,
    seed: u32,
    ttl: f32,
}

/// One low-poly server part: offset from the node center + box size + base color.
struct ServerPart {
    offset: [f32; 3],
    size: [f32; 3],
    color: Color32,
}

struct IsoBoxCmd {
    center: [f32; 3],
    size: [f32; 3],
    faces: [Color32; 3],
    depth: f32,
}

/// Rotate a 3-component vector so that the +X axis maps to `facing` and
/// the original +Y/Z follow via a right-hand rotation.
fn rotate_front(facing: Dir, v: [f32; 3]) -> [f32; 3] {
    match facing {
        Dir::PosX => [v[0], v[1], v[2]],
        Dir::NegX => [-v[0], v[1], v[2]],
        Dir::PosY => [v[1], v[0], v[2]],
        Dir::NegY => [-v[1], -v[0], v[2]],
        Dir::PosZ => [v[1], v[2], v[0]],
        Dir::NegZ => [v[1], v[2], -v[0]],
    }
}

/// Rotate a size triple the same way as `rotate_front`.  Sizes are absolute
/// so we just permute axes without sign changes.
fn rotate_size(facing: Dir, v: [f32; 3]) -> [f32; 3] {
    match facing {
        Dir::PosX => [v[0], v[1], v[2]],
        Dir::NegX => [v[0], v[1], v[2]],
        Dir::PosY => [v[1], v[0], v[2]],
        Dir::NegY => [v[1], v[0], v[2]],
        Dir::PosZ => [v[0], v[2], v[1]],
        Dir::NegZ => [v[0], v[2], v[1]],
    }
}

fn server_parts(palette: &Palette, facing: Dir) -> Vec<ServerPart> {
    // 1U-ish server: authored with +X as "front", then rotated to `facing`.
    // Chassis front face is at x = +1.6 (size 3.2 centred at origin).
    let mut parts = Vec::with_capacity(6);
    parts.push(ServerPart {
        offset: rotate_front(facing, [0.0, 0.0, 0.0]),
        size: rotate_size(facing, [3.2, 2.0, 1.7]),
        color: palette.chassis,
    });
    parts.push(ServerPart {
        offset: rotate_front(facing, [0.0, 0.0, 1.05]),
        size: rotate_size(facing, [3.2, 2.0, 0.35]),
        color: palette.lid,
    });
    // Front faceplate — pushed well beyond the chassis front (+1.6) so the
    // painter's-algorithm depth sort never makes it clip through.
    parts.push(ServerPart {
        offset: rotate_front(facing, [1.78, 0.0, 0.0]),
        size: rotate_size(facing, [0.28, 1.7, 1.25]),
        color: palette.faceplate,
    });
    let led_y = [-0.55, 0.0, 0.55];
    for i in 0..3usize {
        parts.push(ServerPart {
            offset: rotate_front(facing, [1.95, led_y[i], -0.35]),
            size: rotate_size(facing, [0.12, 0.18, 0.18]),
            color: palette.led[i],
        });
    }
    parts
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
            .add_systems(Update, sync_external_config)
            .add_systems(Update, simulation_step.after(sync_external_config))
            .add_systems(Update, render_system.after(simulation_step))
            .add_systems(Update, ui_system.after(render_system));
    }
}

fn sync_external_config(mut state: ResMut<PipedreamState>) {
    if !take_config_dirty() {
        return;
    }

    let ext = get_external_config();

    state.speed = ext.speed;
    state.renderer.scale = ext.scale;
    state.renderer.pixel = ext.pixel;
    state.sim.trail = ext.trail;
    state.ui.visible = ext.show_ui;

    // Topology-changing knobs require a full reset + node rebuild.
    let topo_changed = ext.flows != state.flows
        || ext.sites != state.sites
        || ext.aisles != state.aisles
        || ext.racks != state.racks;

    if topo_changed {
        state.flows = ext.flows;
        state.sites = ext.sites;
        state.aisles = ext.aisles;
        state.racks = ext.racks;
        state.sim.n_sites = ext.sites;
        state.sim.aisles = ext.aisles;
        state.sim.racks = ext.racks;
        let flows = state.flows;
        state.sim.reset(flows);
        state.renderer.focus = state.sim.focus();
        state.sim_time = 0.0;
        rebuild_nodes(&mut state);
    }

    if ext.reset_requested {
        let flows = state.flows;
        state.sim.reset(flows);
        state.renderer.focus = state.sim.focus();
        state.sim_time = 0.0;
        rebuild_nodes(&mut state);
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().reset_requested = false);
    }
}

#[derive(Resource)]
struct PipedreamState {
    palette: Palette,
    renderer: IsoRenderer,
    flows: usize,
    sites: usize,
    aisles: usize,
    racks: usize,
    speed: f32,
    accumulator: f32,
    sim: PipeSim,
    nodes: Vec<ServerNode>,
    /// Wall-clock seconds accumulated for animation timing.
    sim_time: f32,
    node_seed: u32,
    ui: ui_theme::ProjectUi,
}

impl Default for PipedreamState {
    fn default() -> Self {
        let seed = js_sys::Date::now() as u64;
        let ext = get_external_config();
        let bounds = IVec3::new(96, 96, 48);

        let mut sim = PipeSim::new(seed, bounds, ext.flows, ext.sites, ext.aisles, ext.racks);
        sim.trail = ext.trail;

        // Populate initial server nodes from the sim's server positions.
        let mut node_seed = (seed as u32).wrapping_mul(2246822519);
        let mut initial_nodes = Vec::new();
        for (idx, &pos) in sim.servers.iter().enumerate() {
            node_seed = node_seed.wrapping_add(7919);
            let facing = sim.server_facings.get(idx).copied().unwrap_or(Dir::PosX);
            initial_nodes.push(ServerNode {
                pos,
                facing,
                spawn_time: 0.0,
                seed: node_seed,
                ttl: 9999.0, // persistent for the lifetime of the sim
            });
        }

        let mut ui = ui_theme::ProjectUi::new("pipedream");
        ui.visible = ext.show_ui;

        let focus = sim.focus();

        Self {
            palette: Palette::from_theme(),
            renderer: IsoRenderer {
                scale: ext.scale,
                pixel: ext.pixel,
                focus,
            },
            flows: ext.flows,
            sites: ext.sites,
            aisles: ext.aisles,
            racks: ext.racks,
            speed: ext.speed,
            accumulator: 0.0,
            sim,
            nodes: initial_nodes,
            sim_time: 0.0,
            node_seed,
            ui,
        }
    }
}

fn setup(mut commands: Commands) {
    commands.spawn(Camera2d::default());
}

/// Rebuild server nodes from the sim's server positions (called after reset).
fn rebuild_nodes(state: &mut PipedreamState) {
    state.nodes.clear();
    let mut seed = state.node_seed;
    for (idx, &pos) in state.sim.servers.iter().enumerate() {
        seed = seed.wrapping_add(7919);
        let facing = state
            .sim
            .server_facings
            .get(idx)
            .copied()
            .unwrap_or(Dir::PosX);
        state.nodes.push(ServerNode {
            pos,
            facing,
            spawn_time: state.sim_time,
            seed,
            ttl: 9999.0,
        });
    }
    state.node_seed = seed;
}

fn simulation_step(time: Res<Time>, mut state: ResMut<PipedreamState>) {
    let dt = time.delta_secs();
    // Animation clock runs in real time regardless of sim speed.
    state.sim_time += dt;
    state.accumulator += dt * state.speed;

    while state.accumulator >= 1.0 {
        state.sim.step();
        state.accumulator -= 1.0;
    }
}

fn render_system(mut contexts: EguiContexts, state: Res<PipedreamState>) {
    let ctx = contexts.ctx_mut();
    ctx.tessellation_options_mut(|opts| {
        opts.feathering = false;
        opts.feathering_size_in_pixels = 0.0;
    });

    egui::CentralPanel::default()
        .frame(egui::Frame::none())
        .show(ctx, |ui| {
            let rect = ui.max_rect();
            let painter = ui.painter_at(rect);

            painter.rect_filled(rect, 0.0, state.palette.bg);

            // Single depth-sorted pass over the whole scene. With sites spread
            // across the campus, separate passes for cables and servers would
            // let a far site's geometry paint over a near site's; one global
            // sort fixes occlusion everywhere.
            let mut cmds: Vec<IsoBoxCmd> = Vec::new();
            push_infra_cmds(&state, &mut cmds);
            push_pipe_cmds(&state, &mut cmds);
            push_server_cmds(&state, &mut cmds);

            cmds.sort_by(|a, b| {
                a.depth
                    .partial_cmp(&b.depth)
                    .unwrap_or(std::cmp::Ordering::Equal)
            });
            for cmd in cmds {
                draw_box(&state, &painter, rect, cmd.center, cmd.size, cmd.faces);
            }
        });
}

/// Isometric box primitive. `faces` = [right, left, top] face colors.
fn draw_box(
    state: &PipedreamState,
    painter: &egui::Painter,
    rect: Rect,
    center: [f32; 3],
    size: [f32; 3],
    faces: [Color32; 3],
) {
    let center_pt = rect.center();
    let iso =
        |x: f32, y: f32, z: f32| -> Pos2 { state.renderer.project(x, y, z) + center_pt.to_vec2() };

    let (cx, cy, cz) = (center[0], center[1], center[2]);
    let (sx, sy, sz) = (size[0] * 0.5, size[1] * 0.5, size[2] * 0.5);

    let t_back = iso(cx - sx, cy - sy, cz + sz);
    let t_right = iso(cx + sx, cy - sy, cz + sz);
    let t_front = iso(cx + sx, cy + sy, cz + sz);
    let t_left = iso(cx - sx, cy + sy, cz + sz);

    let b_right = iso(cx + sx, cy - sy, cz - sz);
    let b_front = iso(cx + sx, cy + sy, cz - sz);
    let b_left = iso(cx - sx, cy + sy, cz - sz);

    // Right face (+X)
    painter.add(Shape::convex_polygon(
        vec![t_right, t_front, b_front, b_right],
        faces[0],
        Stroke::NONE,
    ));
    // Left face (+Y)
    painter.add(Shape::convex_polygon(
        vec![t_left, t_front, b_front, b_left],
        faces[1],
        Stroke::NONE,
    ));
    // Top face (+Z)
    painter.add(Shape::convex_polygon(
        vec![t_back, t_right, t_front, t_left],
        faces[2],
        Stroke::NONE,
    ));
}

/// Depth key: corner-of-near-face sum, with a small size bias so nested boxes
/// (faceplate over chassis) sort stably.
fn box_depth(center: [f32; 3], size: [f32; 3]) -> f32 {
    center[0] + center[1] + center[2] + (size[0] + size[1] + size[2]) * 0.08
}

fn shaded_faces(palette: &Palette, color: Color32, alpha: u8) -> [Color32; 3] {
    [
        shade(palette.pipe_dark(color), 1.0, alpha),
        shade(color, 1.0, alpha),
        shade(palette.pipe_light(color), 1.0, alpha),
    ]
}

fn push_shaded_box_cmd(
    cmds: &mut Vec<IsoBoxCmd>,
    palette: &Palette,
    center: [f32; 3],
    size: [f32; 3],
    color: Color32,
    alpha: u8,
) {
    cmds.push(IsoBoxCmd {
        center,
        size,
        faces: shaded_faces(palette, color, alpha),
        depth: box_depth(center, size),
    });
}

/// Static tree infrastructure: global core, site cores, aisle aggregation
/// switches. Drawn opaque so the tree skeleton is legible between cable bursts.
fn push_infra_cmds(state: &PipedreamState, cmds: &mut Vec<IsoBoxCmd>) {
    let p = &state.palette;
    let gc = state.sim.global_core;
    push_shaded_box_cmd(
        cmds,
        p,
        [gc.x as f32, gc.y as f32, gc.z as f32],
        [5.0, 5.0, 4.0],
        p.infra[2],
        255,
    );
    for site in &state.sim.sites {
        let c = site.core;
        push_shaded_box_cmd(
            cmds,
            p,
            [c.x as f32, c.y as f32, c.z as f32],
            [3.2, 3.2, 3.2],
            p.infra[1],
            255,
        );
        for agg in &site.aisle_aggs {
            push_shaded_box_cmd(
                cmds,
                p,
                [agg.x as f32, agg.y as f32, agg.z as f32],
                [1.8, 1.4, 1.4],
                p.infra[0],
                255,
            );
        }
    }
}

fn push_server_cmds(state: &PipedreamState, cmds: &mut Vec<IsoBoxCmd>) {
    let now = state.sim_time;

    for node in &state.nodes {
        let age = now - node.spawn_time;
        if age < 0.0 || age > node.ttl {
            continue;
        }

        let fin = smoothstep(0.0, 0.55, age);
        let fout = 1.0 - smoothstep(node.ttl - 1.0, node.ttl, age);
        let base_alpha = (fin * fout).clamp(0.0, 1.0);
        let alpha = (base_alpha * 255.0) as u8;
        if alpha == 0 {
            continue;
        }

        let nx = node.pos.x as f32;
        let ny = node.pos.y as f32;
        let nz = node.pos.z as f32;
        let facing = node.facing;
        let parts = server_parts(&state.palette, facing);

        for (idx, part) in parts.iter().enumerate() {
            let t = ((age - idx as f32 * 0.06) / 0.7).clamp(0.0, 1.0);
            let e = 1.0 - (1.0 - t).powi(3);
            let scatter = 1.0 - e;
            let scale = 0.45 + 0.55 * e;

            let dir_offs = scatter_dir(node.seed, idx as u32);
            let dist = 2.6 * scatter;
            let center = [
                nx + part.offset[0] + dir_offs[0] * dist,
                ny + part.offset[1] + dir_offs[1] * dist,
                nz + part.offset[2] + dir_offs[2] * dist,
            ];
            let size = [
                part.size[0] * scale,
                part.size[1] * scale,
                part.size[2] * scale,
            ];
            push_shaded_box_cmd(cmds, &state.palette, center, size, part.color, alpha);
        }

        let plug_age = (age - 0.22).max(0.0);
        let plug_fin = smoothstep(0.0, 0.25, plug_age);
        if plug_fin > 0.0 {
            push_rj45_at_server_cmds(
                cmds,
                &state.palette,
                node.pos,
                facing,
                plug_fin * fin * fout,
            );
        }
    }
}

/// Draw an RJ45 plug oriented into the server's front face at `pos`.
fn push_rj45_at_server_cmds(
    cmds: &mut Vec<IsoBoxCmd>,
    palette: &Palette,
    pos: IVec3,
    facing: Dir,
    alpha_f: f32,
) {
    let dv = facing.vec();
    let (la, wa, ha) = plug_axes(facing);
    let dvl = dv.comp(la) as f32; // ±1 along the length axis

    let rl = 1.1_f32;
    let rw = 0.9_f32;
    let rh = 0.6_f32;

    // Sit clearly outside the front face so ports never appear to punch
    // through the chassis or faceplate.  Chassis front is at +1.6,
    // faceplate front is at +1.92 — push the plug past both.
    let mut bc = [pos.x as f32, pos.y as f32, pos.z as f32];
    bc[la] += dvl * 2.25;

    let alpha = (alpha_f * 255.0) as u8;
    if alpha == 0 {
        return;
    }

    for i in 0..8usize {
        let t = ((i as f32 + 0.5) / 8.0) - 0.5;
        let mut c = bc;
        c[la] += dvl * (-rl * 0.25);
        c[wa] += t * rw * 1.4;
        let mut sz = [0.0_f32; 3];
        sz[la] = rl * 0.12;
        sz[wa] = rw * 0.07;
        sz[ha] = rh * 0.55;
        push_shaded_box_cmd(cmds, palette, c, sz, palette.wires[i], alpha);
    }

    for i in 0..8usize {
        let t = ((i as f32 + 0.5) / 8.0) - 0.5;
        let mut c = bc;
        c[la] += dvl * (rl * 0.3);
        c[wa] += t * rw * 1.4;
        c[ha] += rh * 0.04;
        let mut sz = [0.0_f32; 3];
        sz[la] = rl * 0.05;
        sz[wa] = rw * 0.04;
        sz[ha] = rh * 0.25;
        push_shaded_box_cmd(cmds, palette, c, sz, palette.pin_gold, alpha);
    }

    let mut tc = bc;
    tc[la] += dvl * (rl * 0.15);
    tc[ha] += rh * 0.55;
    let mut tsz = [0.0_f32; 3];
    tsz[la] = rl * 0.35;
    tsz[wa] = rw * 0.38;
    tsz[ha] = rh * 0.18;
    push_shaded_box_cmd(cmds, palette, tc, tsz, palette.tab, alpha);

    // Transparent clear body gets a tiny depth nudge so it is painted after
    // internal wire/pin boxes in the same plug, preserving the "see-through"
    // RJ45 look without interpenetration flicker.
    let body_alpha = (alpha as f32 * 0.46) as u8;
    let faces = [
        shade(palette.plug_clear, 0.55, body_alpha),
        shade(palette.plug_clear, 1.0, body_alpha),
        shade(palette.plug_clear, 1.18, body_alpha),
    ];
    cmds.push(IsoBoxCmd {
        center: bc,
        size: [rl, rw, rh],
        faces,
        depth: bc[0] + bc[1] + bc[2] + 0.7,
    });
}

/// Cable runs and elbow joints, one depth-tagged box per voxel edge. Per-edge
/// (rather than merged-run) commands let crossings sort locally so cables
/// occlude correctly where they pass over one another.
fn push_pipe_cmds(state: &PipedreamState, cmds: &mut Vec<IsoBoxCmd>) {
    let pipe_count = state.sim.heads.len();
    let palette = &state.palette;

    for seg in &state.sim.segments {
        let base_color = palette.pipe(seg.pipe_id);
        let center = [
            (seg.from.x + seg.to.x) as f32 * 0.5,
            (seg.from.y + seg.to.y) as f32 * 0.5,
            (seg.from.z + seg.to.z) as f32 * 0.5,
        ];
        let mut size = [0.54_f32, 0.54_f32, 0.54_f32];
        match seg.dir {
            Dir::PosX | Dir::NegX => size[0] = 1.18,
            Dir::PosY | Dir::NegY => size[1] = 1.18,
            Dir::PosZ | Dir::NegZ => size[2] = 1.18,
        }
        cmds.push(IsoBoxCmd {
            center,
            size,
            faces: [
                palette.pipe_dark(base_color),
                base_color,
                palette.pipe_light(base_color),
            ],
            depth: center[0] + center[1] + center[2],
        });
    }

    // Elbow cubes at direction changes so consecutive segment cuboids connect.
    let mut seen_first: Vec<bool> = vec![false; pipe_count];
    let mut last_dir: Vec<Option<Dir>> = vec![None; pipe_count];
    for seg in &state.sim.segments {
        if seen_first[seg.pipe_id] && last_dir[seg.pipe_id].is_some_and(|prev| prev != seg.dir) {
            let base_color = palette.pipe(seg.pipe_id);
            let center = [seg.from.x as f32, seg.from.y as f32, seg.from.z as f32];
            cmds.push(IsoBoxCmd {
                center,
                size: [0.72, 0.72, 0.72],
                faces: [
                    palette.pipe_dark(base_color),
                    base_color,
                    palette.pipe_light(base_color),
                ],
                depth: center[0] + center[1] + center[2],
            });
        }
        seen_first[seg.pipe_id] = true;
        last_dir[seg.pipe_id] = Some(seg.dir);
    }
}

/// (length_axis, width_axis, height_axis) indices (0=x,1=y,2=z) for a plug
/// oriented along `dir`.
fn plug_axes(dir: Dir) -> (usize, usize, usize) {
    match dir {
        Dir::PosX | Dir::NegX => (0, 1, 2),
        Dir::PosY | Dir::NegY => (1, 0, 2),
        Dir::PosZ | Dir::NegZ => (2, 0, 1),
    }
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
        egui_ui.collapsing("campus", |ui| {
            ui.add(egui::Slider::new(&mut state.speed, 1.0..=480.0).text("speed"));
            ui.add(egui::Slider::new(&mut state.renderer.scale, 1.0..=32.0).text("zoom"));
            ui.add(egui::Slider::new(&mut state.renderer.pixel, 1.0..=4.0).text("pixel"));
            ui.add(egui::Slider::new(&mut state.sim.trail, 50..=2000).text("trail"));

            // Structural knobs route through ExternalConfig so the reset path is
            // shared with the Dioxus controls.
            let structural = |ui: &mut egui::Ui, label: &str, val: usize, set: &dyn Fn(usize)| {
                let mut v = val;
                let range = match label {
                    "flows" => 1..=40,
                    "sites" => 1..=9,
                    "aisles" => 1..=6,
                    _ => 1..=8,
                };
                if ui.add(egui::Slider::new(&mut v, range).text(label)).changed() {
                    set(v);
                    mark_config_dirty();
                }
            };
            structural(ui, "flows", state.flows, &|v| {
                EXTERNAL_CONFIG.with(|c| c.borrow_mut().flows = v)
            });
            structural(ui, "sites", state.sites, &|v| {
                EXTERNAL_CONFIG.with(|c| c.borrow_mut().sites = v)
            });
            structural(ui, "aisles", state.aisles, &|v| {
                EXTERNAL_CONFIG.with(|c| c.borrow_mut().aisles = v)
            });
            structural(ui, "racks", state.racks, &|v| {
                EXTERNAL_CONFIG.with(|c| c.borrow_mut().racks = v)
            });

            if ui.button("reset").clicked() {
                EXTERNAL_CONFIG.with(|c| c.borrow_mut().reset_requested = true);
                mark_config_dirty();
            }
        });
    });

    state.ui = ui;

    ctx.request_repaint();
}

#[wasm_bindgen(start)]
pub fn wasm_main() {}

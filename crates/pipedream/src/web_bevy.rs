//! WASM entrypoint for Bevy-based pipedream.
//!
//! Migrated from original app.rs, using egui painter for rendering.
//!
//! Three subsystems:
//!  * `PipeSim` — a center→leaf tree: cables bundle into shared trunk corridors
//!    near the core switch and fan out toward leaf servers, looping forever.
//!  * `draw_rj45` — a detailed RJ45 plug: transparent clear body over the eight
//!    T568B wire stripes, gold contact pins, and a release tab.
//!  * `ServerNode` — low-poly server boxes at the tree leaves that assemble with
//!    a Lego-style "reverse explode" animation when a cable reaches them.

use bevy::prelude::*;
use bevy_core::BevyCorePlugins;
use bevy_egui::{egui, EguiContexts, EguiPlugin};
use egui::{pos2, Color32, Pos2, Rect, Shape, Stroke};
use std::cell::RefCell;
use std::collections::{HashMap, HashSet};
use wasm_bindgen::prelude::*;

//=============================================================================
// External config for JS control
//=============================================================================

#[derive(Clone)]
struct ExternalConfig {
    speed: f32,
    scale: f32,
    pixel: f32,
    pipe_count: usize,
    min_spacing: i32,
    straightness: u32,
    min_run_length: u32,
    max_len_per_pipe: usize,
    depth_levels: u32,
    server_count: usize,
    show_ui: bool,
    reset_requested: bool,
}

impl Default for ExternalConfig {
    fn default() -> Self {
        Self {
            speed: 20.0,
            scale: 4.0,
            pixel: 3.0,
            pipe_count: 10,
            min_spacing: 5,
            straightness: 10,
            min_run_length: 5,
            max_len_per_pipe: 180,
            depth_levels: 3,
            server_count: 24,
            show_ui: false, // Hide egui by default; Dioxus controls are used instead
            reset_requested: false,
        }
    }
}

thread_local! {
    static EXTERNAL_CONFIG: RefCell<ExternalConfig> = RefCell::new(ExternalConfig::default());
    static CONFIG_DIRTY: RefCell<bool> = RefCell::new(false);
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
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().speed = v.clamp(5.0, 240.0));
        mark_config_dirty();
    }

    #[wasm_bindgen(getter)]
    pub fn scale(&self) -> f32 {
        EXTERNAL_CONFIG.with(|c| c.borrow().scale)
    }

    #[wasm_bindgen(setter)]
    pub fn set_scale(&self, v: f32) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().scale = v.clamp(6.0, 26.0));
        mark_config_dirty();
    }

    #[wasm_bindgen(getter)]
    pub fn pixel(&self) -> f32 {
        EXTERNAL_CONFIG.with(|c| c.borrow().pixel)
    }

    #[wasm_bindgen(setter)]
    pub fn set_pixel(&self, v: f32) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().pixel = v.clamp(1.0, 8.0));
        mark_config_dirty();
    }

    #[wasm_bindgen(getter)]
    pub fn pipe_count(&self) -> usize {
        EXTERNAL_CONFIG.with(|c| c.borrow().pipe_count)
    }

    #[wasm_bindgen(setter)]
    pub fn set_pipe_count(&self, v: usize) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().pipe_count = v.clamp(1, 24));
        mark_config_dirty();
    }

    #[wasm_bindgen(getter)]
    pub fn min_spacing(&self) -> i32 {
        EXTERNAL_CONFIG.with(|c| c.borrow().min_spacing)
    }

    #[wasm_bindgen(setter)]
    pub fn set_min_spacing(&self, v: i32) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().min_spacing = v.clamp(0, 12));
        mark_config_dirty();
    }

    #[wasm_bindgen(getter)]
    pub fn straightness(&self) -> u32 {
        EXTERNAL_CONFIG.with(|c| c.borrow().straightness)
    }

    #[wasm_bindgen(setter)]
    pub fn set_straightness(&self, v: u32) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().straightness = v.clamp(1, 50));
        mark_config_dirty();
    }

    #[wasm_bindgen(getter)]
    pub fn min_run_length(&self) -> u32 {
        EXTERNAL_CONFIG.with(|c| c.borrow().min_run_length)
    }

    #[wasm_bindgen(setter)]
    pub fn set_min_run_length(&self, v: u32) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().min_run_length = v.clamp(1, 20));
        mark_config_dirty();
    }

    #[wasm_bindgen(getter)]
    pub fn max_len_per_pipe(&self) -> usize {
        EXTERNAL_CONFIG.with(|c| c.borrow().max_len_per_pipe)
    }

    #[wasm_bindgen(setter)]
    pub fn set_max_len_per_pipe(&self, v: usize) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().max_len_per_pipe = v.clamp(10, 900));
        mark_config_dirty();
    }

    #[wasm_bindgen(getter)]
    pub fn depth_levels(&self) -> u32 {
        EXTERNAL_CONFIG.with(|c| c.borrow().depth_levels)
    }

    #[wasm_bindgen(setter)]
    pub fn set_depth_levels(&self, v: u32) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().depth_levels = v.clamp(2, 8));
        mark_config_dirty();
    }

    #[wasm_bindgen(getter)]
    pub fn server_count(&self) -> usize {
        EXTERNAL_CONFIG.with(|c| c.borrow().server_count)
    }

    #[wasm_bindgen(setter)]
    pub fn set_server_count(&self, v: usize) {
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().server_count = v.clamp(2, 48));
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

    fn sub(self, o: IVec3) -> IVec3 {
        IVec3::new(self.x - o.x, self.y - o.y, self.z - o.z)
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

/// Dominant signed axis of a vector — used to pick each cable's trunk corridor
/// so cables bound for the same octant share a trunk near the core.
fn dominant_axis(v: IVec3) -> Dir {
    let ax = v.x.abs();
    let ay = v.y.abs();
    let az = v.z.abs();
    if ax >= ay && ax >= az {
        if v.x >= 0 {
            Dir::PosX
        } else {
            Dir::NegX
        }
    } else if ay >= az {
        if v.y >= 0 {
            Dir::PosY
        } else {
            Dir::NegY
        }
    } else if v.z >= 0 {
        Dir::PosZ
    } else {
        Dir::NegZ
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

struct IsoRenderer {
    scale: f32,
    pixel: f32,
}

impl Default for IsoRenderer {
    fn default() -> Self {
        Self {
            scale: 7.0,
            pixel: 3.0,
        }
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
/// Cable simulation on a voxel grid — server-first architecture.
///
/// 1. Servers are spawned at edge positions facing the camera.
/// 2. Each cable picks a random source server and a random destination server.
/// 3. The cable routes: source → center (trunk up) → destination (trunk down).
///    Near the center all cables converge into high-probability shared corridors
///    (the "core switch cable ways").  Near the leaves cables diverge to their
///    individual targets.
/// 4. When a cable reaches its destination it respawns with a new src→dest pair.
/// Old segments are reaped FIFO so the volume never saturates.

#[derive(Clone, Copy, PartialEq)]
enum CablePhase {
    /// Source server → center.  Trunk axis is the direction from src toward center.
    TrunkUp,
    /// Center → destination server.  Trunk axis is direction from center toward dest.
    TrunkDown,
    /// Final leaf approach — beeline to dest, no trunk constraint.
    Leaf,
}

struct PipeSim {
    bounds: IVec3,
    center: IVec3,
    max_center_dist: i32,
    /// Persistent server positions (set once per reset, on the volume edges).
    servers: Vec<IVec3>,
    /// Per-cable state.
    heads: Vec<IVec3>,
    dirs: Vec<Dir>,
    run_lengths: Vec<u32>,
    leaf_targets: Vec<IVec3>,
    trunk_axes: Vec<Dir>,
    phases: Vec<CablePhase>,
    trunk_remaining: Vec<u32>,
    /// Explicit hierarchical route for each cable. Weighted random walking was
    /// too unstable visually; paths are now generated through shared cable-way
    /// waypoints, then consumed one voxel step at a time.
    routes: Vec<Vec<Dir>>,
    /// For each cable: index into `servers` for source and destination.
    cable_src: Vec<usize>,
    cable_dest: Vec<usize>,
    visited: HashSet<IVec3>,
    segments: Vec<Segment>,
    /// Cable way reinforcement — cells traversed by many cables get a routing
    /// bonus so trunk corridors self-reinforce.
    way_strength: HashMap<IVec3, u32>,
    rng: oorandom::Rand32,
    min_spacing: i32,
    straightness: u32,
    min_run_length: u32,
    max_len_per_pipe: usize,
    depth_levels: u32,
}

impl PipeSim {
    fn new(
        seed: u64,
        bounds: IVec3,
        pipe_count: usize,
        server_count: usize,
        min_spacing: i32,
    ) -> Self {
        let mut s = Self {
            bounds,
            center: IVec3::new(bounds.x / 2, bounds.y / 2, bounds.z / 2),
            max_center_dist: manhattan(
                IVec3::new(0, 0, 0),
                IVec3::new(bounds.x / 2, bounds.y / 2, bounds.z / 2),
            ),
            servers: Vec::new(),
            heads: Vec::new(),
            dirs: Vec::new(),
            run_lengths: Vec::new(),
            leaf_targets: Vec::new(),
            trunk_axes: Vec::new(),
            phases: Vec::new(),
            trunk_remaining: Vec::new(),
            routes: Vec::new(),
            cable_src: Vec::new(),
            cable_dest: Vec::new(),
            visited: HashSet::new(),
            segments: Vec::new(),
            way_strength: HashMap::new(),
            rng: oorandom::Rand32::new(seed),
            min_spacing,
            straightness: 10,
            min_run_length: 5,
            max_len_per_pipe: 180,
            depth_levels: 3,
        };
        s.reset(pipe_count, server_count);
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

    /// Generate server positions in visible rack aisles / rows.
    ///
    /// The earlier edge-wall scatter made many servers face sideways or away
    /// from the camera and also packed several leaves too closely together.
    /// Rows keep the leaf servers legible: each row is a rack aisle, slots are
    /// spread across the row, and every server uses the same camera-visible
    /// face orientation.
    fn generate_servers(&mut self, count: usize) {
        self.servers.clear();
        if count == 0 {
            return;
        }

        // Real aisle pods, not one long row:
        //   pod = two parallel rack rows with a walkway between them
        //   group gap = visible empty space before the next aisle pod
        // Each row contains adjacent servers.  Coordinates are generated in
        // projected/screen space then inverted back to world grid coordinates,
        // because rows that are straight in world space do not look straight in
        // the isometric view.
        let slots_per_row = 3usize;
        let rows_per_pod = 2usize;
        let pod_capacity = slots_per_row * rows_per_pod;
        let pod_count = ((count + pod_capacity - 1) / pod_capacity).clamp(1, 4);
        let slot_spacing = 12.0;
        let row_spacing = 11.0;
        let pod_col_spacing = 52.0;
        let pod_row_spacing = 44.0;
        let z_base = 7;
        // Keep aisle pods in a screen-space band with room to breathe instead
        // of centering them in the full 3D volume, where the far pods get
        // hidden behind the cable cage.
        let center_screen_y = 32.0;

        for i in 0..count {
            let pod = i / pod_capacity;
            let within_pod = i % pod_capacity;
            let row = within_pod / slots_per_row;
            let slot = within_pod % slots_per_row;
            let remaining_in_pod = (count - pod * pod_capacity).min(pod_capacity);
            let row_len = (remaining_in_pod.saturating_sub(row * slots_per_row))
                .min(slots_per_row)
                .max(1);

            let centered_slot = slot as f32 - (row_len as f32 - 1.0) * 0.5;
            let centered_row = row as f32 - 0.5;
            let pod_cols = if pod_count <= 1 { 1 } else { 2 };
            let pod_rows = ((pod_count + pod_cols - 1) / pod_cols).max(1);
            let pod_col = pod % pod_cols;
            let pod_row = pod / pod_cols;
            let centered_pod_col = pod_col as f32 - (pod_cols as f32 - 1.0) * 0.5;
            let centered_pod_row = pod_row as f32 - (pod_rows as f32 - 1.0) * 0.5;

            let screen_x = centered_pod_col * pod_col_spacing + centered_slot * slot_spacing;
            let screen_y =
                center_screen_y + centered_pod_row * pod_row_spacing + centered_row * row_spacing;
            let z = z_base + pod as i32 * 2;

            // Invert the renderer's projection basis:
            //   screen_x = x - y
            //   screen_y = (x + y) / 2 - z
            let sum = 2.0 * (screen_y + z as f32);
            let x = ((sum + screen_x) * 0.5).round() as i32;
            let y = ((sum - screen_x) * 0.5).round() as i32;

            self.servers.push(self.clamp_point(IVec3::new(x, y, z)));
        }
    }

    fn reset(&mut self, pipe_count: usize, server_count: usize) {
        self.visited.clear();
        self.segments.clear();
        self.way_strength.clear();
        self.heads.clear();
        self.dirs.clear();
        self.run_lengths.clear();
        self.leaf_targets.clear();
        self.trunk_axes.clear();
        self.phases.clear();
        self.trunk_remaining.clear();
        self.routes.clear();
        self.cable_src.clear();
        self.cable_dest.clear();
        self.center = IVec3::new(self.bounds.x / 2, self.bounds.y / 2, self.bounds.z / 2);
        self.max_center_dist = manhattan(IVec3::new(0, 0, 0), self.center);

        // 1. Spawn servers at edges first.
        self.generate_servers(server_count);

        // 2. Init cables — each picks a random src→dest pair.
        for _ in 0..pipe_count {
            self.heads.push(self.center);
            self.dirs.push(Dir::PosX);
            self.run_lengths.push(0);
            self.leaf_targets.push(self.center);
            self.trunk_axes.push(Dir::PosX);
            self.phases.push(CablePhase::TrunkUp);
            self.trunk_remaining.push(0);
            self.routes.push(Vec::new());
            self.cable_src.push(0);
            self.cable_dest.push(0);
            self.respawn(self.heads.len() - 1);
        }
    }

    /// Pick a random destination different from source.
    fn pick_dest(&mut self, src: usize) -> usize {
        if self.servers.len() <= 1 {
            return src;
        }
        loop {
            let d = self.rng.rand_u32() % self.servers.len() as u32;
            let d = d as usize;
            if d != src {
                return d;
            }
        }
    }

    fn clamp_point(&self, p: IVec3) -> IVec3 {
        IVec3::new(
            p.x.clamp(1, self.bounds.x - 2),
            p.y.clamp(1, self.bounds.y - 2),
            p.z.clamp(1, self.bounds.z - 2),
        )
    }

    fn cable_lane_offset(&self, pipe_id: usize, level: u32) -> IVec3 {
        // Same-space overlap fix: core cable ways are shared conceptually, but
        // not as identical voxels.  Give each pipe a tiny deterministic lane
        // in a bundle.  The spread is strongest at top/core levels and fades
        // near leaves so paths still visibly converge into the same cable tray.
        let lane = pipe_id as i32;
        let a = lane.rem_euclid(5) - 2; // -2..2
        let b = (lane / 5).rem_euclid(5) - 2;
        let c = lane.rem_euclid(3) - 1;
        let depth = self.depth_levels.max(3);
        let spread = (depth.saturating_sub(level).max(1) as i32).min(3);
        // X/Y separate adjacent cables in the tray; Z tiers separate crossings
        // so the isometric renderer can show one tray passing over another
        // instead of painting several routes into the same visual plane.
        IVec3::new(a * spread, b * spread, c * spread)
    }

    /// A deterministic hierarchy waypoint between the core and a server.
    /// level=1 is a high-sharing core cable-way; larger levels move toward the
    /// server and use a finer snap grid, so paths branch progressively.
    fn hierarchy_point(&self, server: IVec3, level: u32, pipe_id: usize) -> IVec3 {
        let depth = self.depth_levels.max(3);
        let t = (level as f32 / depth as f32).clamp(0.0, 1.0);
        let raw = IVec3::new(
            (self.center.x as f32 + (server.x - self.center.x) as f32 * t).round() as i32,
            (self.center.y as f32 + (server.y - self.center.y) as f32 * t).round() as i32,
            (self.center.z as f32 + (server.z - self.center.z) as f32 * t).round() as i32,
        );

        // Coarse near center, finer near servers. This is the static cable-way
        // probability tree: top levels snap many servers onto the same lanes;
        // leaf levels keep more individual variation.
        let q = (18 / level.max(1) as i32).max(3);
        let snap = |v: i32, c: i32| c + (((v - c) as f32 / q as f32).round() as i32) * q;
        let snapped = IVec3::new(
            snap(raw.x, self.center.x),
            snap(raw.y, self.center.y),
            snap(raw.z, self.center.z),
        );

        self.clamp_point(snapped.add(self.cable_lane_offset(pipe_id, level)))
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

    fn build_route(&self, src_pos: IVec3, dest_pos: IVec3, pipe_id: usize) -> Vec<Dir> {
        let depth = self.depth_levels.max(3);
        let mut waypoints = Vec::new();

        // Source leaf → aggregation → core. Level depth-1 is close to the
        // server; level 1 is the high-probability shared top-level cable-way.
        for level in (1..depth).rev() {
            waypoints.push(self.hierarchy_point(src_pos, level, pipe_id));
        }
        waypoints.push(self.clamp_point(self.center.add(self.cable_lane_offset(pipe_id, 1))));
        for level in 1..depth {
            waypoints.push(self.hierarchy_point(dest_pos, level, pipe_id));
        }
        waypoints.push(dest_pos);

        let mut route = Vec::new();
        let mut p = src_pos;
        for wp in waypoints {
            let wp = self.clamp_point(wp);
            if wp != p {
                Self::push_axis_steps(&mut route, &mut p, wp);
            }
        }
        route
    }

    /// (Re)spawn cable: pick random src→dest, start at source server, route
    /// through explicit static cable-way hierarchy.
    fn respawn(&mut self, pipe_id: usize) {
        let src = self.rng.rand_u32() % self.servers.len() as u32;
        let src = src as usize;
        let dest = self.pick_dest(src);
        self.cable_src[pipe_id] = src;
        self.cable_dest[pipe_id] = dest;

        let src_pos = self.servers[src];
        let dest_pos = self.servers[dest];

        self.heads[pipe_id] = src_pos;
        let route = self.build_route(src_pos, dest_pos, pipe_id);
        let first_dir = route
            .first()
            .copied()
            .unwrap_or_else(|| dominant_axis(dest_pos.sub(src_pos)));
        self.dirs[pipe_id] = first_dir;
        self.run_lengths[pipe_id] = 0;
        self.leaf_targets[pipe_id] = dest_pos;
        self.trunk_axes[pipe_id] = dominant_axis(self.center.sub(src_pos));
        self.phases[pipe_id] = CablePhase::TrunkUp;
        self.trunk_remaining[pipe_id] = route.len() as u32;
        self.routes[pipe_id] = route;

        self.visited.insert(src_pos);
    }

    fn step(&mut self) {
        let count = self.heads.len();
        for pipe_id in 0..count {
            self.step_one(pipe_id);
        }
    }

    fn step_one(&mut self, pipe_id: usize) {
        if self.routes.get(pipe_id).map_or(true, |r| r.is_empty()) {
            self.respawn(pipe_id);
            return;
        }

        let d = self.routes[pipe_id].remove(0);
        let head = self.heads[pipe_id];
        let next = head.add(d.vec());
        if !self.in_bounds(next) {
            self.respawn(pipe_id);
            return;
        }

        // Keep a coarse phase label for UI/RJ45 decisions. The first third of
        // the explicit route is source→core, middle is shared core/aggregation,
        // final third is leaf approach.
        let remaining = self.routes[pipe_id].len();
        let total_hint = self.trunk_remaining[pipe_id].max(1) as usize;
        self.phases[pipe_id] = if remaining > (total_hint * 2) / 3 {
            CablePhase::TrunkUp
        } else if remaining > total_hint / 3 {
            CablePhase::TrunkDown
        } else {
            CablePhase::Leaf
        };
        self.trunk_remaining[pipe_id] = remaining as u32;

        self.advance(pipe_id, next, d);

        if self.routes[pipe_id].is_empty()
            || manhattan(self.heads[pipe_id], self.leaf_targets[pipe_id]) <= 1
        {
            self.respawn(pipe_id);
        }
    }

    fn advance(&mut self, pipe_id: usize, to: IVec3, d: Dir) {
        let from = self.heads[pipe_id];
        self.segments.push(Segment {
            from,
            to,
            dir: d,
            pipe_id,
        });
        if d == self.dirs[pipe_id] {
            self.run_lengths[pipe_id] += 1;
        } else {
            self.run_lengths[pipe_id] = 1;
        }
        self.heads[pipe_id] = to;
        self.dirs[pipe_id] = d;
        self.visited.insert(to);

        *self.way_strength.entry(to).or_insert(0) += 1;

        let limit = self.max_len_per_pipe * self.heads.len().max(1);
        if self.segments.len() > limit {
            let old = self.segments.remove(0);
            self.visited.remove(&old.from);
            if let Some(strength) = self.way_strength.get_mut(&old.from) {
                *strength = strength.saturating_sub(1);
            }
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
    state.sim.min_spacing = ext.min_spacing;
    state.sim.straightness = ext.straightness;
    state.sim.min_run_length = ext.min_run_length;
    state.sim.max_len_per_pipe = ext.max_len_per_pipe;
    state.sim.depth_levels = ext.depth_levels;
    state.ui.visible = ext.show_ui;

    // Handle pipe count change - requires reset
    if ext.pipe_count != state.pipe_count {
        state.pipe_count = ext.pipe_count;
        let pc = state.pipe_count;
        let sc = state.server_count;
        state.sim.reset(pc, sc);
        state.sim_time = 0.0;
        rebuild_nodes(&mut state);
    }

    // Handle server count change - requires reset
    if ext.server_count != state.server_count {
        state.server_count = ext.server_count;
        let pc = state.pipe_count;
        let sc = state.server_count;
        state.sim.reset(pc, sc);
        state.sim_time = 0.0;
        rebuild_nodes(&mut state);
    }

    // Handle reset request
    if ext.reset_requested {
        let pc = state.pipe_count;
        let sc = state.server_count;
        state.sim.reset(pc, sc);
        state.sim_time = 0.0;
        rebuild_nodes(&mut state);
        EXTERNAL_CONFIG.with(|c| c.borrow_mut().reset_requested = false);
    }
}

#[derive(Resource)]
struct PipedreamState {
    palette: Palette,
    renderer: IsoRenderer,
    pipe_count: usize,
    server_count: usize,
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
        let bounds = IVec3::new(80, 80, 80);
        let pipe_count = ext.pipe_count;
        let server_count = ext.server_count;
        let min_spacing = ext.min_spacing;

        let mut sim = PipeSim::new(seed, bounds, pipe_count, server_count, min_spacing);
        sim.straightness = ext.straightness;
        sim.max_len_per_pipe = ext.max_len_per_pipe;

        // Populate initial server nodes from the sim's server positions.
        let mut node_seed = (seed as u32).wrapping_mul(2246822519);
        let mut initial_nodes = Vec::new();
        for (idx, &pos) in sim.servers.iter().enumerate() {
            node_seed = node_seed.wrapping_add(7919);
            let facing = server_facing_for_index(idx);
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

        Self {
            palette: Palette::from_theme(),
            renderer: IsoRenderer {
                scale: ext.scale,
                pixel: ext.pixel,
            },
            pipe_count,
            server_count,
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

fn server_facing_for_index(_index: usize) -> Dir {
    // All servers face the same camera-visible direction (+X = right-front
    // face in the iso projection).  Earlier code alternated rows between
    // PosY and PosX, which made half the fleet face away from the viewer.
    Dir::PosX
}

/// Rebuild server nodes from the sim's server positions (called after reset).
fn rebuild_nodes(state: &mut PipedreamState) {
    state.nodes.clear();
    let mut seed = state.node_seed;
    for (idx, &pos) in state.sim.servers.iter().enumerate() {
        seed = seed.wrapping_add(7919);
        let facing = server_facing_for_index(idx);
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

    egui::CentralPanel::default()
        .frame(egui::Frame::none())
        .show(ctx, |ui| {
            let rect = ui.max_rect();
            let painter = ui.painter_at(rect);

            // Background
            painter.rect_filled(rect, 0.0, state.palette.bg);

            // Pipes first; servers/RJ45 faceplates draw on top. This fixes the
            // worst occlusion failure from the previous pass where cable runs
            // painted over every server regardless of depth.
            draw_pipes(&state, &painter, rect);

            draw_servers(&state, &painter, rect);
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

    let px = state.renderer.pixel.max(1.0);
    let snap = |p: Pos2| pos2((p.x / px).round() * px, (p.y / px).round() * px);

    let t_back = snap(iso(cx - sx, cy - sy, cz + sz));
    let t_right = snap(iso(cx + sx, cy - sy, cz + sz));
    let t_front = snap(iso(cx + sx, cy + sy, cz + sz));
    let t_left = snap(iso(cx - sx, cy + sy, cz + sz));

    let b_right = snap(iso(cx + sx, cy - sy, cz - sz));
    let b_front = snap(iso(cx + sx, cy + sy, cz - sz));
    let b_left = snap(iso(cx - sx, cy + sy, cz - sz));

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

/// Shaded opaque box from a single base color.
fn draw_iso_box(
    state: &PipedreamState,
    painter: &egui::Painter,
    rect: Rect,
    center: [f32; 3],
    size: [f32; 3],
    color: Color32,
) {
    let faces = [
        state.palette.pipe_dark(color),
        color,
        state.palette.pipe_light(color),
    ];
    draw_box(state, painter, rect, center, size, faces);
}

fn push_box_cmd(cmds: &mut Vec<IsoBoxCmd>, center: [f32; 3], size: [f32; 3], faces: [Color32; 3]) {
    // Local painter's algorithm: sort by the near corner rather than only the
    // center, otherwise small faceplate/port boxes can appear to punch through
    // a larger chassis box from the wrong side.
    cmds.push(IsoBoxCmd {
        center,
        size,
        faces,
        depth: center[0] + center[1] + center[2] + (size[0] + size[1] + size[2]) * 0.08,
    });
}

fn push_shaded_box_cmd(
    cmds: &mut Vec<IsoBoxCmd>,
    palette: &Palette,
    center: [f32; 3],
    size: [f32; 3],
    color: Color32,
    alpha: u8,
) {
    push_box_cmd(
        cmds,
        center,
        size,
        [
            shade(palette.pipe_dark(color), 1.0, alpha),
            shade(color, 1.0, alpha),
            shade(palette.pipe_light(color), 1.0, alpha),
        ],
    );
}

fn draw_servers(state: &PipedreamState, painter: &egui::Painter, rect: Rect) {
    let now = state.sim_time;
    let mut cmds: Vec<IsoBoxCmd> = Vec::new();

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
            push_shaded_box_cmd(&mut cmds, &state.palette, center, size, part.color, alpha);
        }

        let plug_age = (age - 0.22).max(0.0);
        let plug_fin = smoothstep(0.0, 0.25, plug_age);
        if plug_fin > 0.0 {
            push_rj45_at_server_cmds(
                &mut cmds,
                &state.palette,
                node.pos,
                facing,
                plug_fin * fin * fout,
            );
        }
    }

    cmds.sort_by(|a, b| {
        a.depth
            .partial_cmp(&b.depth)
            .unwrap_or(std::cmp::Ordering::Equal)
    });
    for cmd in cmds {
        draw_box(state, painter, rect, cmd.center, cmd.size, cmd.faces);
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
    let mut body = IsoBoxCmd {
        center: bc,
        size: [rl, rw, rh],
        faces,
        depth: bc[0] + bc[1] + bc[2] + 0.5,
    };
    body.depth += 0.2;
    cmds.push(body);
}

fn draw_pipes(state: &PipedreamState, painter: &egui::Painter, rect: Rect) {
    // ---- Depth-sort every voxel edge independently ----
    // Earlier versions merged long same-direction runs into one draw command.
    // That looks continuous, but it makes isometric occlusion impossible at
    // crossings: a 40-cell run has only one depth, so half of it is necessarily
    // drawn in front of/behind the wrong thing.  Treat each grid edge as a
    // separate command; the pixel-line rasterizer still visually connects them,
    // but crossings now sort locally.

    struct Run {
        from: IVec3,
        to: IVec3,
        dir: Dir,
        pipe_id: usize,
    }

    let pipe_count = state.sim.heads.len();
    let mut runs: Vec<Run> = Vec::with_capacity(state.sim.segments.len());
    for seg in &state.sim.segments {
        runs.push(Run {
            from: seg.from,
            to: seg.to,
            dir: seg.dir,
            pipe_id: seg.pipe_id,
        });
    }

    // ---- Depth-sorted draw commands: cable runs, elbow joints, RJ45 heads ----

    enum Cmd {
        Cable(Run, f32),
        Elbow {
            pos: IVec3,
            pipe_id: usize,
            depth: f32,
        },
    }

    let mut cmds: Vec<Cmd> = Vec::with_capacity(runs.len() * 2 + pipe_count);

    for r in &runs {
        let mx = (r.from.x + r.to.x) as f32 * 0.5;
        let my = (r.from.y + r.to.y) as f32 * 0.5;
        let mz = (r.from.z + r.to.z) as f32 * 0.5;
        cmds.push(Cmd::Cable(
            Run {
                from: r.from,
                to: r.to,
                dir: r.dir,
                pipe_id: r.pipe_id,
            },
            mx + my + mz,
        ));
    }

    // Elbow joints at every local bend.  With per-edge rendering these are only
    // needed when direction changes, not at every segment boundary.
    let mut seen_first: Vec<bool> = vec![false; pipe_count];
    let mut last_dir: Vec<Option<Dir>> = vec![None; pipe_count];
    for r in &runs {
        let dir = r.dir;
        if seen_first[r.pipe_id] && last_dir[r.pipe_id].is_some_and(|prev| prev != dir) {
            cmds.push(Cmd::Elbow {
                pos: r.from,
                pipe_id: r.pipe_id,
                depth: r.from.x as f32 + r.from.y as f32 + r.from.z as f32,
            });
        }
        seen_first[r.pipe_id] = true;
        last_dir[r.pipe_id] = Some(dir);
    }

    // Cable-tip RJ45 plugs are intentionally not drawn. In this server-first
    // topology the persistent server faceplates own the visible plugs; drawing
    // a plug at the moving route head creates floating connectors mid-cable.

    cmds.sort_by(|a, b| {
        let da = match a {
            Cmd::Cable(_, d) | Cmd::Elbow { depth: d, .. } => *d,
        };
        let db = match b {
            Cmd::Cable(_, d) | Cmd::Elbow { depth: d, .. } => *d,
        };
        da.partial_cmp(&db).unwrap_or(std::cmp::Ordering::Equal)
    });

    for cmd in cmds {
        match cmd {
            Cmd::Cable(r, _) => {
                let base_color = state.palette.pipe(r.pipe_id);
                let center = [
                    (r.from.x + r.to.x) as f32 * 0.5,
                    (r.from.y + r.to.y) as f32 * 0.5,
                    (r.from.z + r.to.z) as f32 * 0.5,
                ];
                let mut size = [0.54_f32, 0.54_f32, 0.54_f32];
                match r.dir {
                    Dir::PosX | Dir::NegX => size[0] = 1.18,
                    Dir::PosY | Dir::NegY => size[1] = 1.18,
                    Dir::PosZ | Dir::NegZ => size[2] = 1.18,
                }
                draw_iso_box(state, painter, rect, center, size, base_color);
            }
            Cmd::Elbow { pos, pipe_id, .. } => {
                // Small cubical bend so consecutive segment cuboids connect.
                let base_color = state.palette.pipe(pipe_id);
                draw_iso_box(
                    state,
                    painter,
                    rect,
                    [pos.x as f32, pos.y as f32, pos.z as f32],
                    [0.72, 0.72, 0.72],
                    base_color,
                );
            }
        }
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
        egui_ui.collapsing("simulation", |ui| {
            ui.add(egui::Slider::new(&mut state.speed, 5.0..=240.0).text("speed"));
            ui.add(egui::Slider::new(&mut state.renderer.scale, 4.0..=18.0).text("scale"));
            ui.add(egui::Slider::new(&mut state.renderer.pixel, 1.0..=8.0).text("pixel"));
            ui.add(egui::Slider::new(&mut state.pipe_count, 1..=24).text("pipes"));
            ui.add(egui::Slider::new(&mut state.sim.min_spacing, 0..=12).text("min spacing"));
            ui.add(egui::Slider::new(&mut state.sim.straightness, 1..=50).text("straightness"));
            ui.add(egui::Slider::new(&mut state.sim.min_run_length, 1..=20).text("min run length"));
            ui.add(egui::Slider::new(&mut state.sim.depth_levels, 2..=8).text("depth levels"));
            if ui
                .add(egui::Slider::new(&mut state.server_count, 2..=48).text("servers"))
                .changed()
            {
                EXTERNAL_CONFIG.with(|c| c.borrow_mut().server_count = state.server_count);
                mark_config_dirty();
            }
            ui.add(egui::Slider::new(&mut state.sim.max_len_per_pipe, 10..=900).text("max length"));

            if ui.button("reset pipes").clicked() {
                let pc = state.pipe_count;
                let sc = state.server_count;
                state.sim.reset(pc, sc);
                state.sim_time = 0.0;
                rebuild_nodes(&mut state);
            }
        });
    });

    state.ui = ui;

    ctx.request_repaint();
}

#[wasm_bindgen(start)]
pub fn wasm_main() {}

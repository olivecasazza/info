use std::collections::HashSet;

use egui::{pos2, vec2, Color32, Pos2, Rect, Shape, Stroke, Vec2};

mod theme {
    include!(concat!(env!("OUT_DIR"), "/theme_gen.rs"));
}

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
    outline: Color32,
    pipes: Vec<Color32>,

    panel_body: Color32,
    panel_border: Color32,
    port: Color32,

    rj45_body: Color32,
    rj45_teeth: Color32,
}

impl Palette {
    fn from_theme() -> Self {
        let pipes = theme::PIPE_PALETTE
            .iter()
            .map(|(r, g, b)| Color32::from_rgb(*r, *g, *b))
            .collect::<Vec<_>>();

        let (r, g, b) = theme::PRIMARY_500;
        let bg = Color32::from_rgb(r / 12, g / 12, b / 12);

        let (sr, sg, sb) = theme::SECONDARY_400;
        let panel_body = Color32::from_rgb(sr / 4, sg / 4, sb / 4);
        let panel_border = Color32::from_rgb(sr / 2, sg / 2, sb / 2);

        let (hr, hg, hb) = theme::HIGHLIGHT_300;
        let port = Color32::from_rgb(hr, hg, hb);

        let (cr, cg, cb) = theme::COMPLIMENT_300;
        let rj45_body = Color32::from_rgb(cr, cg, cb);
        let rj45_teeth = Color32::from_rgb(cr / 2, cg / 2, cb / 2);

        Self {
            bg,
            outline: Color32::from_rgba_unmultiplied(0, 0, 0, 140),
            pipes,
            panel_body,
            panel_border,
            port,
            rj45_body,
            rj45_teeth,
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
        Color32::from_rgb(r.saturating_add(50), g.saturating_add(50), b.saturating_add(50))
    }

    fn pipe_dark(&self, base: Color32) -> Color32 {
        let [r, g, b, _] = base.to_array();
        Color32::from_rgb(r / 2, g / 2, b / 2)
    }
}

/// Endpoints + reserved cells.
#[derive(Clone)]
struct PatchPanel {
    // Lower-left corner on the XY plane at a fixed Z.
    pos: IVec3,
    w: i32,
    h: i32,
    port_count: i32,
}

struct Endpoints {
    panels: Vec<PatchPanel>,
    occupied: HashSet<IVec3>,
    rng: oorandom::Rand32,
}

impl Endpoints {
    fn new(seed: u64, bounds: IVec3) -> Self {
        let mut e = Self {
            panels: Vec::new(),
            occupied: HashSet::new(),
            rng: oorandom::Rand32::new(seed ^ 0xA5A5_1234),
        };
        e.randomize(bounds);
        e
    }

    fn randomize(&mut self, bounds: IVec3) {
        self.panels.clear();
        self.occupied.clear();

        let panel_count = 3 + (self.rng.rand_u32() % 3) as usize; // 3..5

        for _ in 0..panel_count {
            let w = 3 + (self.rng.rand_u32() % 4) as i32; // 3..6
            let h = 2;
            let port_count = 4 + (self.rng.rand_u32() % 7) as i32; // 4..10

            // Choose a placement that keeps the full rectangle in bounds.
            let x_max = (bounds.x - w).max(1);
            let y_max = (bounds.y - h).max(1);
            let z_max = (bounds.z.max(1) / 2 + 1).max(1);

            let pos = IVec3::new(
                (self.rng.rand_u32() % x_max as u32) as i32,
                (self.rng.rand_u32() % y_max as u32) as i32,
                (self.rng.rand_u32() % z_max as u32) as i32,
            );

            let panel = PatchPanel {
                pos,
                w,
                h,
                port_count,
            };

            // Reserve all cells on the panel footprint.
            for dx in 0..w {
                for dy in 0..h {
                    self.occupied.insert(IVec3::new(pos.x + dx, pos.y + dy, pos.z));
                }
            }

            self.panels.push(panel);
        }
    }
}

/// Pipe simulation on a voxel grid.
struct PipeSim {
    bounds: IVec3,
    heads: Vec<IVec3>,
    dirs: Vec<Dir>,
    visited: HashSet<IVec3>,
    segments: Vec<Segment>,
    rng: oorandom::Rand32,

    /// Minimum Manhattan spacing between pipe cells (0 = allow adjacent).
    pub min_spacing: i32,
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
        };
        s.reset(pipe_count, &HashSet::new());
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

    fn is_free_with_margin(
        &self,
        p: IVec3,
        reserved: &HashSet<IVec3>,
        ignore_head: Option<usize>,
    ) -> bool {
        // Always stay in-bounds and never overlap reserved cells (patch panels).
        if !self.in_bounds(p) || reserved.contains(&p) {
            return false;
        }

        // Never occupy a cell we've already drawn a segment through.
        if self.visited.contains(&p) {
            return false;
        }

        // No extra spacing requested.
        let m = self.min_spacing.max(0);
        if m == 0 {
            return true;
        }

        // Enforce spacing only against other pipe heads so we don't over-constrain
        // the walk and cause "freezing". This keeps pipes visually separated while
        // still allowing them to traverse most of the grid.
        for (i, head) in self.heads.iter().enumerate() {
            if ignore_head == Some(i) {
                continue;
            }
            let dx = (head.x - p.x).abs();
            let dy = (head.y - p.y).abs();
            let dz = (head.z - p.z).abs();
            if dx + dy + dz <= m {
                return false;
            }
        }

        true
    }

    fn find_free_cell(&mut self, reserved: &HashSet<IVec3>) -> IVec3 {
        // Try a modest number of random cells that satisfy spacing.
        // If we fail to find one quickly, fall back to a random cell so we
        // never spin for too long (prevents "freezing" when the grid is dense).
        for _ in 0..256 {
            let p = IVec3::new(
                (self.rng.rand_u32() % self.bounds.x as u32) as i32,
                (self.rng.rand_u32() % self.bounds.y as u32) as i32,
                (self.rng.rand_u32() % self.bounds.z as u32) as i32,
            );
            if self.is_free_with_margin(p, reserved, None) {
                return p;
            }
        }

        // Last-resort: just pick a random cell; spacing will be enforced
        // on subsequent steps via `is_free_with_margin`.
        IVec3::new(
            (self.rng.rand_u32() % self.bounds.x as u32) as i32,
            (self.rng.rand_u32() % self.bounds.y as u32) as i32,
            (self.rng.rand_u32() % self.bounds.z as u32) as i32,
        )
    }


    fn reset(&mut self, pipe_count: usize, reserved: &HashSet<IVec3>) {
        self.visited.clear();
        self.segments.clear();
        self.heads.clear();
        self.dirs.clear();

        for i in 0..pipe_count {
            let head = self.find_free_cell(reserved);
            let dir = self.rand_dir();
            self.heads.push(head);
            self.dirs.push(dir);
            self.visited.insert(head);

            // Prime with a single segment if possible.
            let to = head.add(dir.vec());
            if self.is_free_with_margin(to, reserved, None) {
                self.segments.push(Segment {
                    from: head,
                    to,
                    dir,
                    pipe_id: i,
                });
                self.heads[i] = to;
                self.visited.insert(to);
            }
        }
    }

    fn step_one(&mut self, pipe_id: usize, reserved: &HashSet<IVec3>) {
        let head = self.heads[pipe_id];
        let cur_dir = self.dirs[pipe_id];

        let mut dirs = [
            cur_dir,
            Dir::PosX,
            Dir::NegX,
            Dir::PosY,
            Dir::NegY,
            Dir::PosZ,
            Dir::NegZ,
        ];

        // Shuffle (except keep index 0 as current dir)
        for i in 1..dirs.len() {
            let j = 1 + (self.rng.rand_u32() as usize % (dirs.len() - 1));
            dirs.swap(i, j);
        }

        let back = cur_dir.opposite();

        let mut best: Option<Dir> = None;
        for &d in &dirs {
            if d == back {
                continue;
            }
            let next = head.add(d.vec());
            if self.is_free_with_margin(next, reserved, Some(pipe_id)) {
                best = Some(d);
                break;
            }
        }

        if best.is_none() {
            let next = head.add(back.vec());
            if self.is_free_with_margin(next, reserved, Some(pipe_id)) {
                best = Some(back);
            }
        }

        let Some(d) = best else {
            // Dead end: respawn this pipe elsewhere.
            let new_head = self.find_free_cell(reserved);
            self.heads[pipe_id] = new_head;
            self.dirs[pipe_id] = self.rand_dir();
            self.visited.insert(new_head);
            return;
        };

        let from = head;
        let to = head.add(d.vec());

        self.segments.push(Segment {
            from,
            to,
            dir: d,
            pipe_id,
        });
        self.heads[pipe_id] = to;
        self.dirs[pipe_id] = d;
        self.visited.insert(to);

        const MAX_SEGMENTS: usize = 10000;
        if self.segments.len() > MAX_SEGMENTS {
            let old = self.segments.remove(0);
            self.visited.remove(&old.from);
        }
    }

    fn step(&mut self, reserved: &HashSet<IVec3>) {
        for pipe_id in 0..self.heads.len() {
            self.step_one(pipe_id, reserved);
        }
    }
}

/// Renderer: isometric projection + pixel-ish quantization.
struct IsoRenderer {
    scale: f32,
    pixel: f32,
}

impl Default for IsoRenderer {
    fn default() -> Self {
        // Slightly smaller world scale with chunkier pixels to lean into the
        // 8-bit aesthetic (fewer, bolder steps and crisper alignment).
        Self { scale: 10.0, pixel: 3.0 }
    }
}

impl IsoRenderer {
    fn project(&self, p: IVec3) -> Pos2 {
        let x = p.x as f32;
        let y = p.y as f32;
        let z = p.z as f32;
        let sx = (x - y) * self.scale;
        let sy = (x + y) * 0.5 * self.scale - z * self.scale;
        pos2(sx, sy)
    }

    fn quantize(&self, p: Pos2) -> Pos2 {
        // Snap to a slightly larger grid than `pixel` itself. This helps keep
        // the isometric lines aligned on a coarse pixel lattice so they feel
        // more "8-bit" and less like subpixel anti-aliased lines.
        let q = (self.pixel * 2.0).max(1.0);
        pos2((p.x / q).round() * q, (p.y / q).round() * q)
    }
}

pub struct Ethernet3DPipesApp {
    pub ui_visible: std::rc::Rc<std::cell::Cell<bool>>,
    pub pointer_over_ui: std::rc::Rc<std::cell::Cell<bool>>,
    pub pending_spawn: std::rc::Rc<std::cell::RefCell<Vec<(f32, f32)>>>,

    palette: Palette,
    renderer: IsoRenderer,

    bounds: IVec3,
    pipe_count: usize,
    speed: f32,
    accumulator: f32,

    endpoints: Endpoints,
    sim: PipeSim,
}

impl Ethernet3DPipesApp {
    pub fn new(
        seed: u64,
        ui_visible: std::rc::Rc<std::cell::Cell<bool>>,
        pointer_over_ui: std::rc::Rc<std::cell::Cell<bool>>,
        pending_spawn: std::rc::Rc<std::cell::RefCell<Vec<(f32, f32)>>>,
    ) -> Self {
        // Double each axis vs the original grid (22x22x12) so the volume is
        // ~8x larger overall, and make it a cube for a more classic 3D pipes
        // feel.
        let bounds = IVec3::new(44, 44, 44);
        let pipe_count = 4;
        let min_spacing = 1; // 1 => don't allow adjacent cells

        let endpoints = Endpoints::new(seed, bounds);
        let sim = PipeSim::new(seed, bounds, pipe_count, min_spacing);

        Self {
            ui_visible,
            pointer_over_ui,
            pending_spawn,
            palette: Palette::from_theme(),
            renderer: IsoRenderer::default(),
            bounds,
            pipe_count,
            speed: 70.0,
            accumulator: 0.0,
            endpoints,
            sim,
        }
    }

    fn iso_centered(&self, rect: Rect, p: IVec3) -> Pos2 {
        let center = rect.center();
        self.renderer.quantize(self.renderer.project(p)) + center.to_vec2()
    }

    fn draw_background(&self, painter: &egui::Painter, rect: Rect) {
        painter.rect_filled(rect, 0.0, self.palette.bg);
    }

    fn draw_patch_panels(&self, painter: &egui::Painter, rect: Rect) {
        // Grid-aligned panels: draw as a projected quad using grid corners.
        for panel in &self.endpoints.panels {
            let z = panel.pos.z;
            let p0 = IVec3::new(panel.pos.x, panel.pos.y, z);
            let p1 = IVec3::new(panel.pos.x + panel.w, panel.pos.y, z);
            let p2 = IVec3::new(panel.pos.x + panel.w, panel.pos.y + panel.h, z);
            let p3 = IVec3::new(panel.pos.x, panel.pos.y + panel.h, z);

            let v0 = self.iso_centered(rect, p0);
            let v1 = self.iso_centered(rect, p1);
            let v2 = self.iso_centered(rect, p2);
            let v3 = self.iso_centered(rect, p3);

            let poly = vec![v0, v1, v2, v3];
            painter.add(Shape::convex_polygon(poly.clone(), self.palette.panel_body, Stroke::NONE));

            // Outline
            let px = self.renderer.pixel.max(1.0);
            let stroke = Stroke::new(px, self.palette.panel_border);
            painter.line_segment([v0, v1], stroke);
            painter.line_segment([v1, v2], stroke);
            painter.line_segment([v2, v3], stroke);
            painter.line_segment([v3, v0], stroke);

            // Ports: evenly distributed along the top edge (v0->v1).
            let ports = panel.port_count.max(1);
            for i in 0..ports {
                let t = (i as f32 + 0.5) / ports as f32;
                let port_pos = pos2(v0.x + (v1.x - v0.x) * t, v0.y + (v1.y - v0.y) * t);
                let port_rect = Rect::from_center_size(port_pos, vec2(px * 1.2, px * 1.2));
                painter.rect_filled(port_rect, 0.0, self.palette.port);
            }
        }
    }

    fn draw_rj45(&self, painter: &egui::Painter, pos: Pos2, dir: Dir) {
        // Very simple pixel-art RJ45 plug drawn in screen space.
        let px = self.renderer.pixel.max(1.0);

        let (w, h) = (px * 6.0, px * 3.0);
        let mut rect = Rect::from_center_size(pos, vec2(w, h));

        // Slight directional offset so it sits at the end of the segment.
        let offset = match dir {
            Dir::PosX | Dir::NegX => vec2(px * 2.0, 0.0),
            Dir::PosY | Dir::NegY => vec2(-px * 2.0, 0.0),
            Dir::PosZ | Dir::NegZ => vec2(0.0, -px * 2.0),
        };
        rect = rect.translate(offset);

        painter.rect_filled(rect, 1.0, self.palette.rj45_body);
        painter.rect_stroke(rect, 1.0, Stroke::new(px, self.palette.outline));

        // Teeth
        for i in 0..4 {
            let t = (i as f32 + 0.5) / 4.0;
            let x = rect.left() + t * rect.width();
            let tooth = Rect::from_center_size(pos2(x, rect.top() + px), vec2(px * 0.6, px));
            painter.rect_filled(tooth, 0.0, self.palette.rj45_teeth);
        }
    }

    fn draw_pipes(&self, painter: &egui::Painter, rect: Rect) {
        // Sort by depth so closer segments draw last.
        let mut segs = self.sim.segments.clone();
        segs.sort_by(|a, b| {
            let da = a.to.x + a.to.y + a.to.z;
            let db = b.to.x + b.to.y + b.to.z;
            da.cmp(&db)
        });

        let px = self.renderer.pixel.max(1.0);

        for seg in &segs {
            // Build a tiny "voxel tube" quad around each endpoint and fill the
            // strip between them, instead of drawing anti-aliased strokes. This
            // keeps everything locked to the quantized grid.
            let a = self.iso_centered(rect, seg.from);
            let b = self.iso_centered(rect, seg.to);

            let base = self.palette.pipe(seg.pipe_id);
            let (fill, shadow) = match seg.dir {
                Dir::PosZ | Dir::NegZ => (self.palette.pipe_light(base), base),
                Dir::PosX | Dir::NegX => (base, self.palette.pipe_dark(base)),
                Dir::PosY | Dir::NegY => (base, self.palette.pipe_dark(base)),
            };

            // Direction in screen space, snapped so segments are piecewise
            // axis-aligned in isometric space.
            let d = (b - a).normalized();
            let perp = vec2(-d.y, d.x);

            let half_w = px * 1.5;
            let o = perp * half_w;

            let v0 = a + o;
            let v1 = b + o;
            let v2 = b - o;
            let v3 = a - o;

            let poly = vec![v0, v1, v2, v3];
            painter.add(Shape::convex_polygon(poly, fill, Stroke::new(px * 0.5, self.palette.outline)));

            // Simple shadow offset for 8-bit depth.
            let sh = vec2(px, px);
            let shadow_poly = vec![v0 + sh, v1 + sh, v2 + sh, v3 + sh];
            painter.add(Shape::convex_polygon(
                shadow_poly,
                Color32::from_rgba_unmultiplied(shadow.r(), shadow.g(), shadow.b(), 180),
                Stroke::NONE,
            ));
        }

        // RJ45 ends at heads
        for (pipe_id, head) in self.sim.heads.iter().enumerate() {
            let pos = self.iso_centered(rect, *head);
            let dir = self.sim.dirs[pipe_id];
            self.draw_rj45(painter, pos, dir);
        }
    }
}

impl eframe::App for Ethernet3DPipesApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        // Drain click events (we'll use these later for interactions).
        self.pending_spawn.borrow_mut().clear();

        // Step simulation based on time.
        let dt = ctx.input(|i| i.unstable_dt).max(0.0);
        self.accumulator += dt * self.speed;
        while self.accumulator >= 1.0 {
            self.sim.step(&self.endpoints.occupied);
            self.accumulator -= 1.0;
        }

        egui::CentralPanel::default()
            .frame(egui::Frame::none())
            .show(ctx, |ui| {
                let rect = ui.max_rect();
                let painter = ui.painter_at(rect);

                self.draw_background(&painter, rect);
                // Patch panels are still part of the sim state, but we don't render
                // them visually anymore – this keeps the focus on the pipes and
                // improves the 8-bit look.
                self.draw_pipes(&painter, rect);
            });

        let over_ui = ctx.is_pointer_over_area();
        self.pointer_over_ui.set(over_ui);

        if self.ui_visible.get() {
            egui::Window::new("ethernet-3dpipes")
                .default_pos((16.0, 16.0))
                .show(ctx, |ui| {
                    ui.label("WIP: 8-bit 3D Pipes-style ethernet cables");
                    ui.separator();

                    ui.add(egui::Slider::new(&mut self.speed, 5.0..=240.0).text("speed"));
                    ui.add(egui::Slider::new(&mut self.renderer.scale, 6.0..=26.0).text("scale"));
                    ui.add(egui::Slider::new(&mut self.renderer.pixel, 1.0..=8.0).text("pixel"));

                    ui.add(egui::Slider::new(&mut self.pipe_count, 1..=8).text("pipes"));
                    ui.add(egui::Slider::new(&mut self.sim.min_spacing, 0..=2).text("min spacing"));

                    if ui.button("reset pipes").clicked() {
                        self.sim.reset(self.pipe_count, &self.endpoints.occupied);
                    }
                });
        }

        ctx.request_repaint();
    }
}

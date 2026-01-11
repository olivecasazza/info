use std::collections::HashSet;

use egui::{pos2, vec2, Color32, FontFamily, FontId, Pos2, Rect, Shape, Stroke, TextStyle};

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
    /// Max number of steps to go straight before forcing a turn check.
    pub straightness: u32,
    /// Max length per pipe (in segments).
    pub max_len_per_pipe: usize,
    /// Counters for each pipe: how many straight steps remaining.
    pub turn_delay: Vec<u32>,
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
        self.turn_delay.clear();

        for i in 0..pipe_count {
            let head = self.find_free_cell(reserved);
            let dir = self.rand_dir();
            self.heads.push(head);
            self.dirs.push(dir);
            self.visited.insert(head);
            self.turn_delay.push(0);

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

        // If we have "momentum" to go straight, try that first.
        if self.turn_delay[pipe_id] > 0 {
            let next = head.add(cur_dir.vec());
            if self.is_free_with_margin(next, reserved, Some(pipe_id)) {
                self.turn_delay[pipe_id] -= 1;
                self.advance_pipe(pipe_id, next, cur_dir);
                return;
            }
            // Blocked? Force a turn decision now.
            self.turn_delay[pipe_id] = 0;
        }

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
            // If we are choosing a new direction (turning), ensure we don't pick
            // straight again if we just failed it, or do we? The shuffle includes
            // cur_dir at index 0. If it's valid, we might continue straight
            // even if turn_delay was 0. That's fine, it just means we "re-rolled"
            // straight.
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
            self.turn_delay[pipe_id] = 0;
            return;
        };

        // Pick a new random run length for this direction.
        // 1..straightness+1
        let run = 1 + (self.rng.rand_u32() % self.straightness);
        self.turn_delay[pipe_id] = run;

        let to = head.add(d.vec());
        self.advance_pipe(pipe_id, to, d);
    }

    fn advance_pipe(&mut self, pipe_id: usize, to: IVec3, d: Dir) {
        let from = self.heads[pipe_id];
        self.segments.push(Segment {
            from,
            to,
            dir: d,
            pipe_id,
        });
        self.heads[pipe_id] = to;
        self.dirs[pipe_id] = d;
        self.visited.insert(to);

        let limit = self.max_len_per_pipe * self.heads.len().max(1);
        if self.segments.len() > limit {
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
    fn project(&self, x: f32, y: f32, z: f32) -> Pos2 {
        let sx = (x - y) * self.scale;
        let sy = (x + y) * 0.5 * self.scale - z * self.scale;
        pos2(sx, sy)
    }
}

pub struct PipedreamApp {
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

impl PipedreamApp {
    pub fn new(
        seed: u64,
        ui_visible: std::rc::Rc<std::cell::Cell<bool>>,
        pointer_over_ui: std::rc::Rc<std::cell::Cell<bool>>,
        pending_spawn: std::rc::Rc<std::cell::RefCell<Vec<(f32, f32)>>>,
    ) -> Self {
        // Double each axis vs the original grid (22x22x12) so the volume is
        // ~8x larger overall, and make it a cube for a more classic 3D pipes
        // feel.
        let bounds = IVec3::new(88, 88, 88);
        let pipe_count = 8;
        let min_spacing = 5; // 5 => don't allow adjacent cells

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
            speed: 20.0,
            accumulator: 0.0,
            endpoints,
            sim,
        }
    }

    fn iso_centered(&self, rect: Rect, x: f32, y: f32, z: f32) -> Pos2 {
        let center = rect.center();
        // Return raw projected position; quantization happens in rasterizer.
        self.renderer.project(x, y, z) + center.to_vec2()
    }

    /// Software rasterizer: draws an aliased line by stepping along the path
    /// and drawing a square (voxel) at each grid point.
    fn draw_pixel_line(
        &self,
        painter: &egui::Painter,
        p1: Pos2,
        p2: Pos2,
        color: Color32,
        thickness_in_pixels: f32,
    ) {
        let px = self.renderer.pixel.max(1.0);
        let d = p2 - p1;
        let len = d.length();
        if len < 0.1 {
            return;
        }

        // Number of steps to ensure we don't have gaps.
        // Stepping by 0.5 * px ensures good overlap.
        let step_size = px * 0.5;
        let steps = (len / step_size).ceil() as i32;

        for i in 0..=steps {
            let t = i as f32 / steps as f32;
            let pos = p1 + d * t;

            // Snap to grid
            let cx = (pos.x / px).round() * px;
            let cy = (pos.y / px).round() * px;

            // Draw a square of the desired thickness
            let size = px * thickness_in_pixels;
            let r = Rect::from_center_size(pos2(cx, cy), vec2(size, size));
            painter.rect_filled(r, 0.0, color);
        }
    }

    /// Draws a true 3D box in isometric projection.
    /// `center` is in world units (f32). `size` is (x, y, z) dimensions in world units.
    fn draw_iso_box(
        &self,
        painter: &egui::Painter,
        rect: Rect,
        center: [f32; 3],
        size: [f32; 3],
        color: Color32,
    ) {
        let (cx, cy, cz) = (center[0], center[1], center[2]);
        let (sx, sy, sz) = (size[0] * 0.5, size[1] * 0.5, size[2] * 0.5);

        // Visible faces from standard iso angle: Top (+Z), Right (+X), Left (+Y).

        // Define key corners in world space
        // Top Face (+Z)
        let t_back  = self.iso_centered(rect, cx - sx, cy - sy, cz + sz);
        let t_right = self.iso_centered(rect, cx + sx, cy - sy, cz + sz);
        let t_front = self.iso_centered(rect, cx + sx, cy + sy, cz + sz);
        let t_left  = self.iso_centered(rect, cx - sx, cy + sy, cz + sz);

        // Bottom Face (+Z) - only needed for side connections
        let b_right = self.iso_centered(rect, cx + sx, cy - sy, cz - sz);
        let b_front = self.iso_centered(rect, cx + sx, cy + sy, cz - sz);
        let b_left  = self.iso_centered(rect, cx - sx, cy + sy, cz - sz);

        let px = self.renderer.pixel.max(1.0);
        let snap = |p: Pos2| {
            let q = px;
            pos2((p.x / q).round() * q, (p.y / q).round() * q)
        };

        let t = [t_back, t_right, t_front, t_left].map(snap);
        let b_r = snap(b_right);
        let b_f = snap(b_front);
        let b_l = snap(b_left);

        // Draw Visible Faces

        // Right Face (+X): t_right, t_front, b_front, b_right
        painter.add(Shape::convex_polygon(
            vec![t[1], t[2], b_f, b_r],
            self.palette.pipe_dark(color),
            Stroke::NONE,
        ));

        // Left Face (+Y): t_left, t_front, b_front, b_left
        painter.add(Shape::convex_polygon(
            vec![t[3], t[2], b_f, b_l],
            color, // Base color
            Stroke::NONE,
        ));

        // Top Face (+Z): t_back, t_right, t_front, t_left
        painter.add(Shape::convex_polygon(
            vec![t[0], t[1], t[2], t[3]],
            self.palette.pipe_light(color),
            Stroke::NONE,
        ));
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

            let v0 = self.iso_centered(rect, p0.x as f32, p0.y as f32, p0.z as f32);
            let v1 = self.iso_centered(rect, p1.x as f32, p1.y as f32, p1.z as f32);
            let v2 = self.iso_centered(rect, p2.x as f32, p2.y as f32, p2.z as f32);
            let v3 = self.iso_centered(rect, p3.x as f32, p3.y as f32, p3.z as f32);

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

    fn draw_rj45(&self, painter: &egui::Painter, rect: Rect, pos: IVec3, dir: Dir) {
        // Updated per user feedback:
        // Length = 2.0 (Shorter)
        // Height = 0.7 (Taller than 0.6 but flatter than 0.9)
        // Width = 1.0 (Same)
        let l = 2.0;
        let w = 1.0;
        let h = 0.7;

        let (sx, sy, sz) = match dir {
            Dir::PosX | Dir::NegX => (l, w, h),
            Dir::PosY | Dir::NegY => (w, l, h),
            Dir::PosZ | Dir::NegZ => (w, h, l),
        };

        // Center position
        let px = pos.x as f32;
        let py = pos.y as f32;
        let pz = pos.z as f32;

        let dv = dir.vec();
        // Offset center: body is shifted so it connects to the pipe
        let cx = px + (dv.x as f32) * (l * 0.4);
        let cy = py + (dv.y as f32) * (l * 0.4);
        let cz = pz + (dv.z as f32) * (l * 0.4);

        struct Part {
            center: [f32; 3],
            size: [f32; 3],
            color: Color32,
        }
        let mut parts = Vec::with_capacity(6);

        // 1. Main Body
        let color_body = Color32::from_rgb(210, 210, 230); // Clear plastic
        parts.push(Part {
            center: [cx, cy, cz],
            size: [sx, sy, sz],
            color: color_body,
        });

        // 2. Latch (Clip) - Yellow tab
        // Adjusted logic: Place latch strictly ON TOP of the surface to avoid intersection clipping.
        let lx = if sx == l { l * 0.5 } else { sx * 0.4 };
        let ly = if sy == l { l * 0.5 } else { sy * 0.4 };
        let lz = if sz == l { l * 0.5 } else { sz * 0.4 };

        let (ox, oy, oz) = match dir {
            // If vertical, latch is on +Y side (width side)
            Dir::PosZ | Dir::NegZ => (0.0, sy * 0.5 + ly * 0.5, 0.0),
            // If horizontal, latch is on +Z side (top)
            _ => (0.0, 0.0, sz * 0.5 + lz * 0.5),
        };

        parts.push(Part {
            center: [cx + ox, cy + oy, cz + oz],
            size: [lx, ly, lz],
            color: Color32::from_rgb(230, 200, 100),
        });

        // 3. Gold Contacts (Pins)
        let pin_color = Color32::from_rgb(255, 215, 0);

        // Pins are now flat on the "Tip" face.
        // Thickness along the length axis.
        let pt = 0.05;
        // 8 pins fit in width 1.0.
        // Margin 0.1, Width 0.8. 8 pins -> ~0.1 pitch.
        let pw = 0.06;
        let ph = h * 0.2;

        let (pdx, pdy, pdz) = match dir {
            Dir::PosX | Dir::NegX => (pt, pw, ph),
            Dir::PosY | Dir::NegY => (pw, pt, ph),
            Dir::PosZ | Dir::NegZ => (pw, ph, pt),
        };

        for i in 0..8 {
            let t = i as f32 - 3.5;
            let shift = 0.1 * t;

            // Center on the tip face (offset 0 on height axis)
            let (off_x, off_y, off_z) = match dir {
                Dir::PosX | Dir::NegX => (0.0, shift, 0.0),
                Dir::PosY | Dir::NegY => (shift, 0.0, 0.0),
                Dir::PosZ | Dir::NegZ => (shift, 0.0, 0.0),
            };

            // Push pins to the tip face
            // Center of body is at 0.4*l. Front face is at 0.4*l + 0.5*l = 0.9*l.
            // Add slight epsilon (0.02) to ensure they sit ON TOP of the face and don't Z-fight/clip.
            let push_out = 0.92;
            let tx = px + (dv.x as f32) * (l * push_out) + off_x;
            let ty = py + (dv.y as f32) * (l * push_out) + off_y;
            let tz = pz + (dv.z as f32) * (l * push_out) + off_z;
            parts.push(Part {
                center: [tx, ty, tz],
                size: [pdx, pdy, pdz],
                color: pin_color,
            });
        }

        // Sort by depth (x+y+z) to handle occlusion
        parts.sort_by(|a, b| {
            let da = a.center[0] + a.center[1] + a.center[2];
            let db = b.center[0] + b.center[1] + b.center[2];
            da.partial_cmp(&db).unwrap_or(std::cmp::Ordering::Equal)
        });

        for p in parts {
            self.draw_iso_box(painter, rect, p.center, p.size, p.color);
        }
    }

    fn draw_pipes(&self, painter: &egui::Painter, rect: Rect) {
        enum DrawCmd {
            Segment {
                from: IVec3,
                to: IVec3,
                pipe_id: usize,
                depth: f32,
            },
            Rj45 {
                pos: IVec3,
                dir: Dir,
                depth: f32,
            },
        }

        let mut cmds = Vec::with_capacity(self.sim.segments.len() + self.sim.heads.len());

        // 1. Collect Segments
        for seg in &self.sim.segments {
            // Depth: midpoint
            let mx = (seg.from.x + seg.to.x) as f32 * 0.5;
            let my = (seg.from.y + seg.to.y) as f32 * 0.5;
            let mz = (seg.from.z + seg.to.z) as f32 * 0.5;
            let depth = mx + my + mz;

            cmds.push(DrawCmd::Segment {
                from: seg.from,
                to: seg.to,
                pipe_id: seg.pipe_id,
                depth,
            });
        }

        // 2. Collect RJ45s
        for (pipe_id, head) in self.sim.heads.iter().enumerate() {
            let dir = self.sim.dirs[pipe_id];

            // Calculate center depth matching draw_rj45 logic
            let l = 2.0;
            let dv = dir.vec();
            let cx = head.x as f32 + (dv.x as f32) * (l * 0.4);
            let cy = head.y as f32 + (dv.y as f32) * (l * 0.4);
            let cz = head.z as f32 + (dv.z as f32) * (l * 0.4);
            let depth = cx + cy + cz;

            cmds.push(DrawCmd::Rj45 {
                pos: *head,
                dir,
                depth,
            });
        }

        // 3. Sort (Ascending depth = Far to Near)
        cmds.sort_by(|a, b| {
            let da = match a {
                DrawCmd::Segment { depth, .. } => *depth,
                DrawCmd::Rj45 { depth, .. } => *depth,
            };
            let db = match b {
                DrawCmd::Segment { depth, .. } => *depth,
                DrawCmd::Rj45 { depth, .. } => *depth,
            };
            da.partial_cmp(&db).unwrap_or(std::cmp::Ordering::Equal)
        });

        // 4. Draw
        let px = self.renderer.pixel.max(1.0);
        let s = self.renderer.scale;

        // Scale pipe thickness with zoom so it matches the RJ45 model size.
        // Base width target is ~0.9 world units (scale * 0.9).
        // The draw_pixel_line function multiplies input by px, so we divide by px here.
        let base_thick = ((0.9 * s) / px).max(1.0);
        let shadow_thick = ((1.2 * s) / px).max(1.0);
        let high_thick = ((0.3 * s) / px).max(1.0);

        for cmd in cmds {
            match cmd {
                DrawCmd::Segment {
                    from,
                    to,
                    pipe_id,
                    ..
                } => {
                    let a = self.iso_centered(rect, from.x as f32, from.y as f32, from.z as f32);
                    let b = self.iso_centered(rect, to.x as f32, to.y as f32, to.z as f32);

                    let base_color = self.palette.pipe(pipe_id);
                    let highlight = self.palette.pipe_light(base_color);
                    let shadow = self.palette.pipe_dark(base_color);

                    // Draw "Tube" using pixel rasterization.
                    let d = (b - a).normalized();
                    let perp = vec2(-d.y, d.x);

                    // 1. Shadow (Widest, drawn behind/offset right)
                    self.draw_pixel_line(painter, a + perp * px, b + perp * px, shadow, shadow_thick);

                    // 2. Base (Medium, Center)
                    self.draw_pixel_line(painter, a, b, base_color, base_thick);

                    // 3. Highlight (Thin, offset left)
                    self.draw_pixel_line(
                        painter,
                        a - perp * px * 0.5,
                        b - perp * px * 0.5,
                        highlight,
                        high_thick,
                    );
                }
                DrawCmd::Rj45 { pos, dir, .. } => {
                    self.draw_rj45(painter, rect, pos, dir);
                }
            }
        }
    }
}

impl eframe::App for PipedreamApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        // Apply Flock style (Dark, high contrast, monospace)
        let mut style = (*ctx.style()).clone();
        style.text_styles = [
            (TextStyle::Heading, FontId::new(18.0, FontFamily::Monospace)),
            (TextStyle::Body, FontId::new(14.0, FontFamily::Monospace)),
            (TextStyle::Monospace, FontId::new(14.0, FontFamily::Monospace)),
            (TextStyle::Button, FontId::new(14.0, FontFamily::Monospace)),
            (TextStyle::Small, FontId::new(12.0, FontFamily::Monospace)),
        ].into();

        let gray_text = Color32::from_gray(160);
        let gray_border = Stroke::new(1.0, gray_text);

        style.visuals.window_fill = Color32::from_rgba_unmultiplied(0, 0, 0, 120);
        style.visuals.panel_fill = Color32::from_rgba_unmultiplied(0, 0, 0, 120);
        style.visuals.window_rounding = egui::Rounding::ZERO;

        style.visuals.widgets.noninteractive.fg_stroke = gray_border;
        style.visuals.widgets.inactive.fg_stroke = gray_border;
        style.visuals.widgets.hovered.fg_stroke = Stroke::new(1.0, Color32::from_gray(220));
        style.visuals.widgets.active.fg_stroke = Stroke::new(1.0, Color32::from_gray(240));

        style.visuals.widgets.noninteractive.bg_stroke = gray_border;
        style.visuals.widgets.inactive.bg_stroke = gray_border;
        style.visuals.widgets.hovered.bg_stroke = gray_border;
        style.visuals.widgets.active.bg_stroke = gray_border;

        style.visuals.override_text_color = Some(gray_text);

        ctx.set_style(style);

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
            egui::Window::new("pipedream")
                .default_pos((16.0, 16.0))
                .frame(
                    egui::Frame::none()
                        .fill(Color32::TRANSPARENT)
                        .rounding(egui::Rounding::ZERO)
                        .stroke(gray_border),
                )
                .show(ctx, |ui| {
                    ui.add(egui::Slider::new(&mut self.speed, 5.0..=240.0).text("speed"));
                    ui.add(egui::Slider::new(&mut self.renderer.scale, 6.0..=26.0).text("scale"));
                    ui.add(egui::Slider::new(&mut self.renderer.pixel, 1.0..=8.0).text("pixel"));

                    ui.add(egui::Slider::new(&mut self.pipe_count, 1..=8).text("pipes"));
                    ui.add(egui::Slider::new(&mut self.sim.min_spacing, 0..=2).text("min spacing"));
                    ui.add(egui::Slider::new(&mut self.sim.straightness, 1..=20).text("straightness"));
                    ui.add(egui::Slider::new(&mut self.sim.max_len_per_pipe, 10..=2000).text("max length"));

                    if ui.button("reset pipes").clicked() {
                        self.sim.reset(self.pipe_count, &self.endpoints.occupied);
                    }
                });
        }

        ctx.request_repaint();
    }
}

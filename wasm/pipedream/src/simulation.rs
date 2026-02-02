//! Pipe simulation logic.
//!
//! Extracted from the original pipedream app for reuse with Bevy.

use std::collections::HashSet;

/// Simple 3D integer vector.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct IVec3 {
    pub x: i32,
    pub y: i32,
    pub z: i32,
}

impl IVec3 {
    pub fn new(x: i32, y: i32, z: i32) -> Self {
        Self { x, y, z }
    }

    pub fn add(self, o: IVec3) -> IVec3 {
        IVec3::new(self.x + o.x, self.y + o.y, self.z + o.z)
    }
}

/// Direction in 3D.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Dir {
    PosX, NegX, PosY, NegY, PosZ, NegZ,
}

impl Dir {
    pub fn vec(self) -> IVec3 {
        match self {
            Dir::PosX => IVec3::new(1, 0, 0),
            Dir::NegX => IVec3::new(-1, 0, 0),
            Dir::PosY => IVec3::new(0, 1, 0),
            Dir::NegY => IVec3::new(0, -1, 0),
            Dir::PosZ => IVec3::new(0, 0, 1),
            Dir::NegZ => IVec3::new(0, 0, -1),
        }
    }

    pub fn opposite(self) -> Dir {
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

/// A pipe segment between two voxels.
#[derive(Debug, Clone, Copy)]
pub struct Segment {
    pub from: IVec3,
    pub to: IVec3,
    pub dir: Dir,
    pub pipe_id: usize,
}

/// Color palette for pipes.
pub struct Palette {
    pipes: Vec<(u8, u8, u8)>,
}

impl Palette {
    pub fn from_theme() -> Self {
        // Use colors from the shared ui-theme crate
        let primary = ui_theme::theme::primary();
        let secondary = ui_theme::theme::secondary();
        let highlight = ui_theme::theme::highlight();
        let compliment = ui_theme::theme::compliment();

        Self {
            pipes: vec![
                (primary.r(), primary.g(), primary.b()),
                (secondary.r(), secondary.g(), secondary.b()),
                (highlight.r(), highlight.g(), highlight.b()),
                (compliment.r(), compliment.g(), compliment.b()),
            ],
        }
    }

    pub fn pipe(&self, pipe_id: usize) -> (u8, u8, u8) {
        if self.pipes.is_empty() {
            return (40, 220, 120);
        }
        self.pipes[pipe_id % self.pipes.len()]
    }

    pub fn pipe_light(&self, base: (u8, u8, u8)) -> (u8, u8, u8) {
        (base.0.saturating_add(50), base.1.saturating_add(50), base.2.saturating_add(50))
    }

    pub fn pipe_dark(&self, base: (u8, u8, u8)) -> (u8, u8, u8) {
        (base.0 / 2, base.1 / 2, base.2 / 2)
    }
}

/// Pipe simulation on a voxel grid.
pub struct PipeSim {
    bounds: IVec3,
    heads: Vec<IVec3>,
    dirs: Vec<Dir>,
    visited: HashSet<IVec3>,
    segments_list: Vec<Segment>,
    rng: oorandom::Rand32,
    pub min_spacing: i32,
    pub straightness: u32,
    pub max_len_per_pipe: usize,
    turn_delay: Vec<u32>,
}

impl PipeSim {
    pub fn new(seed: u64, bounds: IVec3, pipe_count: usize, min_spacing: i32) -> Self {
        let mut s = Self {
            bounds,
            heads: Vec::new(),
            dirs: Vec::new(),
            visited: HashSet::new(),
            segments_list: Vec::new(),
            rng: oorandom::Rand32::new(seed),
            min_spacing,
            straightness: 10,
            max_len_per_pipe: 500,
            turn_delay: Vec::new(),
        };
        s.reset(pipe_count);
        s
    }

    pub fn segments(&self) -> &[Segment] {
        &self.segments_list
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

    pub fn reset(&mut self, pipe_count: usize) {
        self.visited.clear();
        self.segments_list.clear();
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
                self.segments_list.push(Segment { from: head, to, dir, pipe_id: i });
                self.heads[i] = to;
                self.visited.insert(to);
            }
        }
    }

    pub fn step(&mut self) {
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
        self.segments_list.push(Segment { from, to, dir: d, pipe_id });
        self.heads[pipe_id] = to;
        self.dirs[pipe_id] = d;
        self.visited.insert(to);

        let limit = self.max_len_per_pipe * self.heads.len().max(1);
        if self.segments_list.len() > limit {
            let old = self.segments_list.remove(0);
            self.visited.remove(&old.from);
        }
    }
}

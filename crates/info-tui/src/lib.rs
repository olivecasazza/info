//! Terminal frontend for the info site, shared between the native (crossterm)
//! binary and the in-browser (ratzilla) example.
//!
//! Same three panels as the Dioxus web app — projects, info, background — over
//! the same `info-core` content and the same `panel-kit` state machine, drawn
//! with ratatui instead of DOM. `App::draw` is backend-agnostic (it takes a
//! ratatui `Frame`); only the event loop + backend differ per target.

use panel_kit_core::{LayoutBuilder, PanelKind, PanelWin};
use panel_kit_tui::{scroll, Theme, TuiWorkspace};
use ratatui::style::{Modifier, Style};
use ratatui::text::{Line, Span};
use ratatui::widgets::Paragraph;
use ratatui::Frame;
use serde::{Deserialize, Serialize};

/// The site's panels (same set as the web app; layout differs because terminal
/// geometry is in cells, not px).
#[derive(Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum Panel {
    /// Projects / libraries / notebooks list.
    Projects,
    /// Experience list.
    Info,
    /// The former random-project background.
    Background,
}

impl PanelKind for Panel {
    fn title(self) -> &'static str {
        match self {
            Panel::Projects => "projects",
            Panel::Info => "info",
            Panel::Background => "background",
        }
    }
}

/// Default floating layout in terminal cells. Tile spans (`with_tile`) are
/// unit-agnostic, so tiling mode matches the web app.
pub fn defaults() -> Vec<PanelWin<Panel>> {
    let mut b = LayoutBuilder::new();
    vec![
        b.at(Panel::Projects, 1.0, 0.0, 62.0, 22.0).with_tile(2, 4),
        b.at(Panel::Info, 65.0, 0.0, 46.0, 13.0).with_tile(1, 3),
        b.at(Panel::Background, 65.0, 14.0, 46.0, 9.0)
            .with_tile(1, 2),
    ]
}

/// Frontend state: the workspace plus per-panel scroll offsets.
pub struct App {
    /// The shared panel-workspace state machine.
    pub ws: TuiWorkspace<Panel>,
    projects_scroll: usize,
    info_scroll: usize,
}

impl App {
    /// Build the app. `store` persists the layout to a JSON file (terminal
    /// equivalent of the web app's localStorage); pass `None` for ephemeral.
    pub fn new(store: Option<std::path::PathBuf>) -> Self {
        Self {
            ws: TuiWorkspace::new(store, defaults),
            projects_scroll: 0,
            info_scroll: 0,
        }
    }

    /// Scroll the projects panel (`+1` down, `-1` up).
    pub fn scroll_projects(&mut self, delta: isize) {
        self.projects_scroll = shift(self.projects_scroll, delta);
    }

    /// Scroll the info panel.
    pub fn scroll_info(&mut self, delta: isize) {
        self.info_scroll = shift(self.info_scroll, delta);
    }

    /// Draw one frame. Backend-agnostic — works under crossterm and ratzilla.
    pub fn draw(&mut self, f: &mut Frame) {
        // Copy theme out before the closure: reading `self.ws.theme` inside it
        // would alias the `&mut self.ws` that `render` holds. The closure only
        // touches the disjoint scroll fields, so 2021 closure captures keep the
        // borrows separate.
        let theme = self.ws.theme;
        let area = f.area();
        self.ws
            .render(f, area, &mut |f, rect, kind, _max| match kind {
                Panel::Projects => {
                    self.projects_scroll = scroll::lines(
                        f,
                        rect,
                        &theme,
                        projects_lines(&theme),
                        self.projects_scroll,
                    );
                }
                Panel::Info => {
                    self.info_scroll =
                        scroll::lines(f, rect, &theme, info_lines(&theme), self.info_scroll);
                }
                Panel::Background => {
                    f.render_widget(Paragraph::new(background_lines(&theme)), rect);
                }
            });
    }
}

fn shift(cur: usize, delta: isize) -> usize {
    if delta < 0 {
        cur.saturating_sub((-delta) as usize)
    } else {
        cur.saturating_add(delta as usize)
    }
}

/// `ProjectsWrapper.vue` content as terminal lines.
fn projects_lines(t: &Theme) -> Vec<Line<'static>> {
    let mut out = Vec::new();
    for cat in info_core::projects() {
        out.push(Line::from(Span::styled(
            cat.subject.to_uppercase(),
            Style::default().fg(t.dim).add_modifier(Modifier::BOLD),
        )));
        for item in cat.items {
            out.push(Line::from(Span::styled(
                item.heading,
                Style::default().fg(t.accent),
            )));
            out.push(Line::from(Span::styled(
                item.text,
                Style::default().fg(t.fg),
            )));
            if !item.links.is_empty() {
                let mut spans: Vec<Span<'static>> = Vec::new();
                for (i, l) in item.links.iter().enumerate() {
                    if i > 0 {
                        spans.push(Span::raw("  "));
                    }
                    spans.push(Span::styled(
                        format!("\u{21B3} {}", l.label),
                        Style::default().fg(t.dim),
                    ));
                }
                out.push(Line::from(spans));
            }
            out.push(Line::from(""));
        }
    }
    out
}

/// `ExperienceList.vue` content as terminal lines.
fn info_lines(t: &Theme) -> Vec<Line<'static>> {
    let mut out = Vec::new();
    for e in info_core::experiences() {
        out.push(Line::from(Span::styled(
            e.company,
            Style::default().fg(t.accent),
        )));
        for r in e.roles {
            out.push(Line::from(vec![
                Span::styled(
                    r.start,
                    Style::default().fg(t.dim).add_modifier(Modifier::BOLD),
                ),
                Span::raw(" - "),
                Span::styled(
                    r.end,
                    Style::default().fg(t.dim).add_modifier(Modifier::BOLD),
                ),
                Span::raw(": "),
                Span::styled(r.description, Style::default().fg(t.fg)),
            ]));
        }
        out.push(Line::from(""));
    }
    out
}

/// The former full-bleed background, as a card. Phase 2 swaps in the live
/// flock/pipedream canvas (terminal shows this placeholder).
fn background_lines(t: &Theme) -> Vec<Line<'static>> {
    let mut out = vec![
        Line::from(Span::styled(
            "random project background",
            Style::default().fg(t.dim),
        )),
        Line::from(Span::styled(
            "live 3D (flock / pipedream) lands in phase 2",
            Style::default().fg(t.dim),
        )),
        Line::from(""),
    ];
    if let Some((subject, p)) = info_core::project_at(0) {
        out.push(Line::from(Span::styled(
            subject.to_uppercase(),
            Style::default().fg(t.dim),
        )));
        out.push(Line::from(Span::styled(
            p.heading,
            Style::default().fg(t.accent).add_modifier(Modifier::BOLD),
        )));
        out.push(Line::from(Span::styled(p.text, Style::default().fg(t.fg))));
    }
    out
}

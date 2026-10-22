//! Terminal frontend for the info site, shared between the native (crossterm)
//! binary and the in-browser (ratzilla) example.

use std::path::PathBuf;

use panel_kit_core::frame::{
    project_into, ChromeProjectionInput, ProjectionBuffer, ProjectionInput, TileLayoutMetrics,
};
use panel_kit_core::persist::{
    apply_save_decision, restore_snapshot, LayoutError, RestoreContext, SavePolicy,
};
use panel_kit_core::reducer::{reduce, ResizePolicy, Snapshot, Viewport, WorkspaceEvent};
use panel_kit_core::{
    ChromeMetrics, Clamp, CommandStep, FocusContext, LayoutBuilder, Mode, PanelCatalog, PanelKind,
    PanelWin, PointerEvent, SnapPolicy, SurfaceCapabilities, SurfaceProfile, TileMetrics, Units,
    CELLS_COMPACT_MAX, CELLS_TABLET_MAX,
};
use panel_kit_tui::input::{workspace_event_from_key, workspace_event_from_pointer};
use panel_kit_tui::store::JsonFileLayoutStore;
use panel_kit_tui::widgets::{self, TuiHitBuffer};
use panel_kit_tui::scroll::PanelScroll;
use panel_kit_tui::{scroll, ResolvedTuiTheme, TerminalCharset};
use ratatui::layout::{Position, Rect};
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
    let mut builder = LayoutBuilder::new();
    vec![
        builder
            .at(Panel::Projects, 1.0, 0.0, 62.0, 22.0)
            .with_tile(2, 4),
        builder
            .at(Panel::Info, 65.0, 0.0, 46.0, 13.0)
            .with_tile(1, 3),
        builder
            .at(Panel::Background, 65.0, 14.0, 46.0, 9.0)
            .with_tile(1, 2),
    ]
}

/// Host-owned terminal workspace plus per-panel content state.
pub struct App {
    snapshot: Snapshot<Panel>,
    catalog: PanelCatalog<Panel>,
    projection: ProjectionBuffer<Panel>,
    hits: TuiHitBuffer<Panel>,
    store: Option<JsonFileLayoutStore>,
    save_policy: SavePolicy,
    theme: ResolvedTuiTheme,
    charset: TerminalCharset,
    hover: Option<Position>,
    scroll: PanelScroll<Panel>,
}

impl App {
    /// Build the app. `store` persists the exact panel-kit JSON payload to a
    /// file; pass `None` for an ephemeral browser workspace.
    pub fn new(store: Option<PathBuf>) -> Self {
        let default_snapshot = Snapshot::from_defaults(
            defaults(),
            Mode::Floating,
            Viewport {
                width: 120.0,
                height: 40.0,
                units: Units::Cells,
            },
        );
        let catalog = PanelCatalog::from_panel_kind_layout(&default_snapshot.panels)
            .expect("info TUI panel enum must serialize as stable string IDs");
        let store = store.map(JsonFileLayoutStore::new);
        let snapshot = match store.as_ref() {
            Some(store) => restore_snapshot(
                store,
                default_snapshot.clone(),
                &catalog,
                RestoreContext {
                    units: Units::Cells,
                    viewport: (
                        default_snapshot.viewport.width,
                        default_snapshot.viewport.height,
                    ),
                },
            )
            .unwrap_or_else(|error| {
                eprintln!("panel-kit failed to restore info TUI layout: {error}");
                default_snapshot
            }),
            None => default_snapshot,
        };
        let panel_count = catalog.len();

        Self {
            snapshot,
            catalog,
            projection: ProjectionBuffer::with_panel_capacity(panel_count),
            hits: TuiHitBuffer::with_capacity(panel_count, panel_count),
            store,
            save_policy: SavePolicy::OnSettle,
            theme: ResolvedTuiTheme::default(),
            charset: if cfg!(target_arch = "wasm32") {
                TerminalCharset::Ascii
            } else {
                TerminalCharset::Unicode
            },
            hover: None,
            scroll: PanelScroll::with_capacity(panel_count),
        }
    }

    /// Restore a minimized or maximized panel through the shared reducer.
    pub fn restore_panel(&mut self, panel: Panel) -> Result<(), LayoutError> {
        self.apply_event(WorkspaceEvent::Command {
            target: Some(panel),
            command: panel_kit_core::PanelCommand::Restore,
        })
    }

    /// Scroll the projects panel (`+1` down, `-1` up).
    pub fn scroll_projects(&mut self, delta: isize) {
        self.scroll.scroll_by(&Panel::Projects, 0, delta as i32);
    }

    /// Scroll the info panel.
    pub fn scroll_info(&mut self, delta: isize) {
        self.scroll.scroll_by(&Panel::Info, 0, delta as i32);
    }

    /// Send a normalized key chord to panel-kit after application bindings have
    /// had first refusal.
    pub fn handle_key_chord(
        &mut self,
        chord: panel_kit_core::KeyChord,
    ) -> Result<(), LayoutError> {
        let focus = self
            .snapshot
            .focused
            .map(FocusContext::Panel)
            .unwrap_or(FocusContext::Workspace);
        self.apply_event(workspace_event_from_key(chord, focus))
    }

    /// Translate a normalized pointer through the latest frame's hit buffer.
    pub fn handle_pointer(&mut self, pointer: PointerEvent) -> Result<(), LayoutError> {
        self.hover = Some(Position::new(pointer.x as u16, pointer.y as u16));
        if let Some(event) = workspace_event_from_pointer(&self.hits, pointer) {
            self.apply_event(event)?;
        }
        Ok(())
    }

    /// Draw one frame. Backend-agnostic — works under crossterm and ratzilla.
    pub fn draw(&mut self, frame: &mut Frame) -> Result<(), LayoutError> {
        self.sync_viewport(frame.area())?;
        self.hits.clear();

        let surface = tui_surface(self.snapshot.viewport.width);
        let chrome = ChromeProjectionInput::full(ChromeMetrics::CELLS);
        let tile = TileLayoutMetrics::from_tile_metrics(TileMetrics::CELLS, surface);
        let projected = project_into(
            ProjectionInput {
                snapshot: &self.snapshot,
                surface,
                chrome: &chrome,
                clamp: &Clamp::CELLS,
                tile: &tile,
            },
            &mut self.projection,
        );

        let root_area = rect_from_region(projected.chrome.root);
        let dock_area = rect_from_region(projected.chrome.dock);
        widgets::root::draw_root(frame, root_area, &self.theme, self.charset);

        for panel in projected.panels.iter().copied() {
            let Some(meta) = self.catalog.get(panel.key) else {
                continue;
            };
            widgets::panel::draw_panel_surface(
                frame,
                panel,
                &self.theme,
                self.charset,
                &mut self.hits,
            );
            let body = widgets::panel::draw_panel_chrome(
                frame,
                panel,
                meta,
                &self.theme,
                self.charset,
                &mut self.hits,
            );
            widgets::panel::draw_traffic_lights(
                frame,
                panel,
                projected.mode,
                self.hover,
                &self.theme,
                self.charset,
                &mut self.hits,
            );
            widgets::panel::draw_resize_grip(
                frame,
                panel,
                self.hover,
                &self.theme,
                &mut self.hits,
            );

            match panel.key {
                Panel::Projects => {
                    scroll::lines(
                        frame,
                        body,
                        &self.theme,
                        &Panel::Projects,
                        &mut self.scroll,
                        projects_lines(&self.theme),
                    );
                }
                Panel::Info => {
                    scroll::lines(
                        frame,
                        body,
                        &self.theme,
                        &Panel::Info,
                        &mut self.scroll,
                        info_lines(&self.theme),
                    );
                }
                Panel::Background => {
                    frame.render_widget(Paragraph::new(background_lines(&self.theme)), body);
                }
            }
        }

        widgets::dock::draw_dock(
            frame,
            dock_area,
            projected.dock,
            widgets::dock::DockRenderContext {
                catalog: &self.catalog,
                label: "dock:",
                theme: &self.theme,
                charset: self.charset,
            },
            &mut self.hits,
        );
        widgets::root::draw_workspace_scrollbar(frame, &projected, &self.theme);
        Ok(())
    }

    fn sync_viewport(&mut self, area: Rect) -> Result<(), LayoutError> {
        let viewport = Viewport {
            width: area.width as f64,
            height: area.height as f64,
            units: Units::Cells,
        };
        if self.snapshot.viewport == viewport {
            return Ok(());
        }
        self.apply_event(WorkspaceEvent::ViewportChanged {
            size: viewport,
            policy: ResizePolicy::PreserveIntent,
        })
    }

    fn apply_event(&mut self, event: WorkspaceEvent<Panel>) -> Result<(), LayoutError> {
        let context = panel_kit_core::reducer::ReduceContext {
            surface: tui_surface(self.snapshot.viewport.width),
            clamp: &Clamp::CELLS,
            command_step: CommandStep::CELLS,
            tile: &TileMetrics::CELLS,
            snap: SnapPolicy::CELLS,
        };
        let reduction = reduce(&mut self.snapshot, event, context);
        if let Some(store) = &self.store {
            apply_save_decision(
                self.save_policy.decide(&reduction),
                store,
                &self.snapshot,
                &self.catalog,
            )?;
        }
        Ok(())
    }
}

fn tui_surface(width: f64) -> SurfaceProfile {
    SurfaceProfile::from_logical_width(
        width,
        CELLS_COMPACT_MAX,
        CELLS_TABLET_MAX,
        SurfaceCapabilities {
            coarse_pointer: false,
            hover: true,
            keyboard: true,
        },
    )
}

fn rect_from_region(region: panel_kit_core::Region) -> Rect {
    Rect::new(
        region.x.max(0.0) as u16,
        region.y.max(0.0) as u16,
        region.w.max(0.0) as u16,
        region.h.max(0.0) as u16,
    )
}

fn projects_lines(theme: &ResolvedTuiTheme) -> Vec<Line<'static>> {
    let mut output = Vec::new();
    for category in info_core::projects() {
        output.push(Line::from(Span::styled(
            category.subject.to_uppercase(),
            Style::default().fg(theme.text_muted).add_modifier(Modifier::BOLD),
        )));
        for item in category.items {
            output.push(Line::from(Span::styled(
                item.heading,
                Style::default().fg(theme.highlight),
            )));
            output.push(Line::from(Span::styled(
                item.text,
                Style::default().fg(theme.text),
            )));
            if !item.links.is_empty() {
                let mut spans = Vec::new();
                for (index, link) in item.links.iter().enumerate() {
                    if index > 0 {
                        spans.push(Span::raw("  "));
                    }
                    spans.push(Span::styled(
                        format!("\u{21B3} {}", link.label),
                        Style::default().fg(theme.text_muted),
                    ));
                }
                output.push(Line::from(spans));
            }
            output.push(Line::from(""));
        }
    }
    output
}

fn info_lines(theme: &ResolvedTuiTheme) -> Vec<Line<'static>> {
    let mut output = Vec::new();
    for experience in info_core::experiences() {
        output.push(Line::from(Span::styled(
            experience.company,
            Style::default().fg(theme.highlight),
        )));
        for role in experience.roles {
            output.push(Line::from(vec![
                Span::styled(
                    role.start,
                    Style::default().fg(theme.text_muted).add_modifier(Modifier::BOLD),
                ),
                Span::raw(" - "),
                Span::styled(
                    role.end,
                    Style::default().fg(theme.text_muted).add_modifier(Modifier::BOLD),
                ),
                Span::raw(": "),
                Span::styled(role.description, Style::default().fg(theme.text)),
            ]));
        }
        output.push(Line::from(""));
    }
    output
}

fn background_lines(theme: &ResolvedTuiTheme) -> Vec<Line<'static>> {
    let mut output = vec![
        Line::from(Span::styled(
            "random project background",
            Style::default().fg(theme.text_muted),
        )),
        Line::from(Span::styled(
            "live 3D (flock / pipedream) lands in phase 2",
            Style::default().fg(theme.text_muted),
        )),
        Line::from(""),
    ];
    if let Some((subject, project)) = info_core::project_at(0) {
        output.push(Line::from(Span::styled(
            subject.to_uppercase(),
            Style::default().fg(theme.text_muted),
        )));
        output.push(Line::from(Span::styled(
            project.heading,
            Style::default()
                .fg(theme.highlight)
                .add_modifier(Modifier::BOLD),
        )));
        output.push(Line::from(Span::styled(
            project.text,
            Style::default().fg(theme.text),
        )));
    }
    output
}


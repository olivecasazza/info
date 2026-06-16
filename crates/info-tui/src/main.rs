//! Native terminal frontend (crossterm backend). Run with `cargo run -p info-tui`.
//!
//! `q`/`Esc` quits, `1`–`3` restore minimized panels, arrows scroll the
//! projects panel; drag headers to move, the corner grip to resize, click the
//! traffic lights. Layout persists to `$TMPDIR/info-tui-layout.json`.

#[cfg(not(target_arch = "wasm32"))]
fn main() -> std::io::Result<()> {
    use std::time::Duration;

    use crossterm::event::{
        self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode, MouseButton, MouseEventKind,
    };
    use crossterm::execute;
    use info_tui::{App, Panel};
    use panel_kit_tui::{TuiMouseButton, TuiMouseEvent, TuiMouseEventKind};

    let store = Some(std::env::temp_dir().join("info-tui-layout.json"));
    let mut app = App::new(store);

    let mut terminal = ratatui::init();
    let _ = execute!(std::io::stdout(), EnableMouseCapture);

    let res = loop {
        if let Err(e) = terminal.draw(|f| app.draw(f)) {
            break Err(e);
        }
        match event::poll(Duration::from_millis(100)) {
            Ok(true) => match event::read() {
                Ok(Event::Key(k)) => match k.code {
                    KeyCode::Char('q') | KeyCode::Esc => break Ok(()),
                    KeyCode::Char('1') => app.ws.restore_panel(Panel::Projects),
                    KeyCode::Char('2') => app.ws.restore_panel(Panel::Info),
                    KeyCode::Char('3') => app.ws.restore_panel(Panel::Background),
                    KeyCode::Up => app.scroll_projects(-1),
                    KeyCode::Down => app.scroll_projects(1),
                    _ => {}
                },
                // crossterm distinguishes Drag(button) from Moved, so no
                // press-tracking is needed (unlike the ratzilla path).
                Ok(Event::Mouse(m)) => {
                    let kind = match m.kind {
                        MouseEventKind::Down(MouseButton::Left) => {
                            Some(TuiMouseEventKind::Down(TuiMouseButton::Primary))
                        }
                        MouseEventKind::Up(MouseButton::Left) => {
                            Some(TuiMouseEventKind::Up(TuiMouseButton::Primary))
                        }
                        MouseEventKind::Drag(MouseButton::Left) => {
                            Some(TuiMouseEventKind::Drag(TuiMouseButton::Primary))
                        }
                        MouseEventKind::Moved => Some(TuiMouseEventKind::Moved),
                        _ => None,
                    };
                    if let Some(kind) = kind {
                        app.ws.handle_mouse(TuiMouseEvent {
                            kind,
                            x: m.column as f64,
                            y: m.row as f64,
                        });
                    }
                }
                Ok(_) => {}
                Err(e) => break Err(e),
            },
            Ok(false) => {}
            Err(e) => break Err(e),
        }
    };

    let _ = execute!(std::io::stdout(), DisableMouseCapture);
    ratatui::restore();
    res
}

#[cfg(target_arch = "wasm32")]
fn main() {
    // The browser build is the `browser_tui` example (ratzilla); this binary is
    // native-only.
}

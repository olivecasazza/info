//! In-browser terminal for the info site (ratzilla renders the ratatui shell
//! to DOM cells). Same `info-core` content + `panel-kit` state machine as the
//! native binary and the Dioxus web app.
//!
//! ```sh
//! trunk serve crates/info-tui/browser_tui.html \
//!   --example browser_tui --address 0.0.0.0 --port <n>
//! ```

#[cfg(not(target_arch = "wasm32"))]
fn main() {
    eprintln!(
        "browser_tui is a WASM/ratzilla example. Run it with `trunk serve \
         crates/info-tui/browser_tui.html --example browser_tui`."
    );
}

#[cfg(target_arch = "wasm32")]
mod browser {
    use std::{cell::RefCell, rc::Rc};

    use info_tui::{App, Panel};
    use panel_kit_tui::{TuiMouseButton, TuiMouseEvent, TuiMouseEventKind};
    use ratzilla::event::{
        KeyCode, MouseButton as WebMouseButton, MouseEvent as WebMouseEvent,
        MouseEventKind as WebMouseEventKind,
    };
    use ratzilla::{
        backend::cursor::CursorShape, backend::dom::DomBackendOptions, DomBackend, WebRenderer,
    };

    struct Ui {
        app: App,
        // ratzilla's Moved carries no button, so synthesize Drag from a
        // tracked press (crossterm gives Drag directly; the web doesn't).
        mouse_down: bool,
    }

    impl Ui {
        fn new() -> Self {
            Self {
                app: App::new(None),
                mouse_down: false,
            }
        }

        fn handle_key(&mut self, key: KeyCode) {
            match key {
                KeyCode::Char('1') => self.app.ws.restore_panel(Panel::Projects),
                KeyCode::Char('2') => self.app.ws.restore_panel(Panel::Info),
                KeyCode::Char('3') => self.app.ws.restore_panel(Panel::Background),
                KeyCode::Up => self.app.scroll_projects(-1),
                KeyCode::Down => self.app.scroll_projects(1),
                _ => {}
            }
        }

        fn handle_mouse(&mut self, event: WebMouseEvent) {
            let kind = match event.kind {
                WebMouseEventKind::ButtonDown(WebMouseButton::Left) => {
                    self.mouse_down = true;
                    TuiMouseEventKind::Down(TuiMouseButton::Primary)
                }
                WebMouseEventKind::ButtonUp(WebMouseButton::Left) => {
                    self.mouse_down = false;
                    TuiMouseEventKind::Up(TuiMouseButton::Primary)
                }
                WebMouseEventKind::Moved if self.mouse_down => {
                    TuiMouseEventKind::Drag(TuiMouseButton::Primary)
                }
                WebMouseEventKind::Moved => TuiMouseEventKind::Moved,
                WebMouseEventKind::SingleClick(WebMouseButton::Left) => {
                    TuiMouseEventKind::Up(TuiMouseButton::Primary)
                }
                _ => return,
            };
            self.app.ws.handle_mouse(TuiMouseEvent {
                kind,
                x: event.col as f64,
                y: event.row as f64,
            });
        }
    }

    pub fn main() -> Result<(), Box<dyn std::error::Error>> {
        std::panic::set_hook(Box::new(console_error_panic_hook::hook));
        let backend = DomBackend::new_with_options(DomBackendOptions::new(
            Some("info-tui".into()),
            CursorShape::None,
        ))?;
        let mut terminal = ratatui::Terminal::new(backend)?;
        let ui = Rc::new(RefCell::new(Ui::new()));

        terminal.on_key_event({
            let ui = ui.clone();
            move |key| ui.borrow_mut().handle_key(key.code)
        })?;
        terminal.on_mouse_event({
            let ui = ui.clone();
            move |event| ui.borrow_mut().handle_mouse(event)
        })?;
        terminal.draw_web(move |frame| ui.borrow_mut().app.draw(frame));
        Ok(())
    }
}

#[cfg(target_arch = "wasm32")]
fn main() -> Result<(), Box<dyn std::error::Error>> {
    browser::main()
}

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
    use panel_kit_tui::input::{ratzilla_key_chord, RatzillaPointerTranslator};
    use ratzilla::event::{KeyCode, KeyEvent, MouseEvent};
    use ratzilla::{
        backend::cursor::CursorShape, backend::dom::DomBackendOptions, DomBackend, WebRenderer,
    };

    struct Ui {
        app: App,
        // Browsers report drag motion as moved cells. The panel-kit adapter
        // tracks the primary press and synthesizes Drag until button-up.
        pointer: RatzillaPointerTranslator,
    }

    impl Ui {
        fn new() -> Self {
            Self {
                app: App::new(None),
                pointer: RatzillaPointerTranslator::new(),
            }
        }

        fn handle_key(&mut self, event: KeyEvent) {
            let result = match event.code {
                KeyCode::Char('1') => self.app.restore_panel(Panel::Projects),
                KeyCode::Char('2') => self.app.restore_panel(Panel::Info),
                KeyCode::Char('3') => self.app.restore_panel(Panel::Background),
                KeyCode::Up => {
                    self.app.scroll_projects(-1);
                    Ok(())
                }
                KeyCode::Down => {
                    self.app.scroll_projects(1);
                    Ok(())
                }
                _ => match ratzilla_key_chord(event) {
                    Some(chord) => self.app.handle_key_chord(chord),
                    None => Ok(()),
                },
            };
            result.expect("browser TUI workspace input should reduce");
        }

        fn handle_mouse(&mut self, event: MouseEvent) {
            if let Some(pointer) = self.pointer.pointer_event(event) {
                self.app
                    .handle_pointer(pointer)
                    .expect("browser TUI pointer input should reduce");
            }
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
            move |event| ui.borrow_mut().handle_key(event)
        })?;
        terminal.on_mouse_event({
            let ui = ui.clone();
            move |event| ui.borrow_mut().handle_mouse(event)
        })?;
        terminal.draw_web(move |frame| {
            ui.borrow_mut()
                .app
                .draw(frame)
                .expect("browser TUI frame should render")
        });
        Ok(())
    }
}

#[cfg(target_arch = "wasm32")]
fn main() -> Result<(), Box<dyn std::error::Error>> {
    browser::main()
}

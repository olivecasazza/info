//! Native terminal frontend (crossterm backend). Run with `cargo run -p info-tui`.
//!
//! `q`/`Esc` quits, `1`–`3` restore minimized panels, arrows scroll the
//! projects panel; drag headers to move, the corner grip to resize, click the
//! traffic lights. Layout persists to `$TMPDIR/info-tui-layout.json`.

#[cfg(not(target_arch = "wasm32"))]
fn main() -> std::io::Result<()> {
    use std::time::Duration;

    use crossterm::event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode};
    use crossterm::execute;
    use info_tui::{App, Panel};
    use panel_kit_tui::input::{crossterm_key_chord, crossterm_pointer_event};

    let store = Some(std::env::temp_dir().join("info-tui-layout.json"));
    let mut app = App::new(store);

    let mut terminal = ratatui::init();
    let _ = execute!(std::io::stdout(), EnableMouseCapture);

    let result = loop {
        let mut render_result = Ok(());
        if let Err(error) = terminal.draw(|frame| render_result = app.draw(frame)) {
            break Err(error);
        }
        if let Err(error) = render_result {
            break Err(std::io::Error::other(error));
        }

        match event::poll(Duration::from_millis(100)) {
            Ok(true) => match event::read() {
                Ok(Event::Key(key)) => {
                    let action = match key.code {
                        KeyCode::Char('q') | KeyCode::Esc => break Ok(()),
                        KeyCode::Char('1') => app.restore_panel(Panel::Projects),
                        KeyCode::Char('2') => app.restore_panel(Panel::Info),
                        KeyCode::Char('3') => app.restore_panel(Panel::Background),
                        KeyCode::Up => {
                            app.scroll_projects(-1);
                            Ok(())
                        }
                        KeyCode::Down => {
                            app.scroll_projects(1);
                            Ok(())
                        }
                        _ => match crossterm_key_chord(key) {
                            Some(chord) => app.handle_key_chord(chord),
                            None => Ok(()),
                        },
                    };
                    if let Err(error) = action {
                        break Err(std::io::Error::other(error));
                    }
                }
                Ok(Event::Mouse(mouse)) => {
                    if let Some(pointer) = crossterm_pointer_event(mouse) {
                        if let Err(error) = app.handle_pointer(pointer) {
                            break Err(std::io::Error::other(error));
                        }
                    }
                }
                Ok(_) => {}
                Err(error) => break Err(error),
            },
            Ok(false) => {}
            Err(error) => break Err(error),
        }
    };

    let _ = execute!(std::io::stdout(), DisableMouseCapture);
    ratatui::restore();
    result
}

#[cfg(target_arch = "wasm32")]
fn main() {
    // The browser build is the `browser_tui` example (ratzilla); this binary is
    // native-only.
}

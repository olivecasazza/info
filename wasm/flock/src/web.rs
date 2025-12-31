use std::{cell::RefCell, rc::Rc};

use wasm_bindgen::prelude::*;

use crate::app::{ExternalCommands, FlockApp};

/// Web entrypoint for the egui+flock app.
///
/// This follows the `eframe::WebRunner` pattern from the egui examples.
#[derive(Clone)]
#[wasm_bindgen]
pub struct WebHandle {
    runner: eframe::WebRunner,
    commands: Rc<RefCell<ExternalCommands>>,
}

#[wasm_bindgen]
impl WebHandle {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        // Initialize logging if possible.
        eframe::WebLogger::init(log::LevelFilter::Info).ok();

        Self {
            runner: eframe::WebRunner::new(),
            commands: Rc::new(RefCell::new(ExternalCommands::default())),
        }
    }

    /// Start the app on a given canvas.
    #[wasm_bindgen]
    pub async fn start(
        &self,
        canvas: web_sys::HtmlCanvasElement,
    ) -> Result<(), wasm_bindgen::JsValue> {
        let commands = self.commands.clone();

        // Seed: current millis (same as old JS init).
        let seed = js_sys::Date::now() as u64;

        self.runner
            .start(
                canvas,
                eframe::WebOptions::default(),
                Box::new(move |_cc| {
                    let app = FlockApp::new(seed, commands.clone());
                    // UI visibility is controlled by JS (route-aware).
                    Ok(Box::new(app))
                }),
            )
            .await
    }

    #[wasm_bindgen]
    pub fn destroy(&self) {
        self.runner.destroy();
    }

    #[wasm_bindgen]
    pub fn has_panicked(&self) -> bool {
        self.runner.has_panicked()
    }

    /// Request spawning birds at a normalized canvas coordinate (0..1).
    /// This is intentionally JS-facing so we can keep the current
    /// click/drag + debounce behavior in Vue.
    #[wasm_bindgen]
    pub fn spawn_at_norm(&self, x_norm: f32, y_norm: f32) {
        self.commands
            .borrow_mut()
            .pending_spawn_norm
            .push((x_norm, y_norm));
    }

    /// Toggle whether the settings UI is visible.
    #[wasm_bindgen]
    pub fn set_ui_visible(&self, visible: bool) {
        self.commands.borrow_mut().ui_visible = visible;
    }

    /// Whether the last egui frame reported the pointer is over UI.
    ///
    /// Use this from JS to avoid spawning birds while the user is interacting
    /// with the settings panel.
    #[wasm_bindgen]
    pub fn is_pointer_over_ui(&self) -> bool {
        self.commands.borrow().pointer_over_ui
    }
}

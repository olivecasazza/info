use wasm_bindgen::prelude::*;

/// WASM entrypoint following the same JS-facing API shape as `wasm/flock`.
///
/// BackgroundWrapper expects:
/// - `new WebHandle()`
/// - `await handle.start(canvas)`
/// - `handle.destroy()`
/// - `handle.set_ui_visible(bool)`
/// - `handle.is_pointer_over_ui()`
/// - `handle.spawn_at_norm(x,y)`
#[derive(Clone)]
#[wasm_bindgen]
pub struct WebHandle {
    runner: eframe::WebRunner,
    ui_visible: std::rc::Rc<std::cell::Cell<bool>>,
    pointer_over_ui: std::rc::Rc<std::cell::Cell<bool>>,
    pending_spawn: std::rc::Rc<std::cell::RefCell<Vec<(f32, f32)>>>,
}

#[wasm_bindgen]
impl WebHandle {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        eframe::WebLogger::init(log::LevelFilter::Info).ok();

        Self {
            runner: eframe::WebRunner::new(),
            ui_visible: std::rc::Rc::new(std::cell::Cell::new(false)),
            pointer_over_ui: std::rc::Rc::new(std::cell::Cell::new(false)),
            pending_spawn: std::rc::Rc::new(std::cell::RefCell::new(Vec::new())),
        }
    }

    /// Start the app on a given canvas.
    #[wasm_bindgen]
    pub async fn start(
        &self,
        canvas: web_sys::HtmlCanvasElement,
    ) -> Result<(), wasm_bindgen::JsValue> {
        let ui_visible = self.ui_visible.clone();
        let pointer_over_ui = self.pointer_over_ui.clone();
        let pending_spawn = self.pending_spawn.clone();

        // Seed: current millis.
        let seed = js_sys::Date::now() as u64;

        self.runner
            .start(
                canvas,
                eframe::WebOptions::default(),
                Box::new(move |_cc| {
                    Ok(Box::new(crate::app::PipedreamApp::new(
                        seed,
                        ui_visible.clone(),
                        pointer_over_ui.clone(),
                        pending_spawn.clone(),
                    )))
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

    /// Placeholder interaction hook (normalized canvas coordinates 0..1).
    #[wasm_bindgen]
    pub fn spawn_at_norm(&self, x_norm: f32, y_norm: f32) {
        self.pending_spawn.borrow_mut().push((x_norm, y_norm));
    }

    /// Toggle whether the settings UI is visible.
    #[wasm_bindgen]
    pub fn set_ui_visible(&self, visible: bool) {
        self.ui_visible.set(visible);
    }

    /// Whether the last egui frame reported the pointer is over UI.
    #[wasm_bindgen]
    pub fn is_pointer_over_ui(&self) -> bool {
        self.pointer_over_ui.get()
    }
}

// App logic lives in `app.rs`.

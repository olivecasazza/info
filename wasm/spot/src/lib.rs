mod app;
pub mod controller;
mod physics;
pub mod renderer;
pub mod urdf;
pub mod config;
pub mod ml;

pub use app::SpotApp;
use eframe::wasm_bindgen::{self, prelude::*};

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
#[derive(Clone)]
#[wasm_bindgen]
pub struct WebHandle {
    runner: eframe::WebRunner,
}

#[wasm_bindgen]
impl WebHandle {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        console_error_panic_hook::set_once();
        Self {
            runner: eframe::WebRunner::new(),
        }
    }

    #[wasm_bindgen]
    #[wasm_bindgen]
    pub async fn start(
        &self,
        canvas: web_sys::HtmlCanvasElement,
    ) -> Result<(), wasm_bindgen::JsValue> {
        self.runner
            .start(
                canvas,
                eframe::WebOptions::default(),
                Box::new(|cc| Ok(Box::new(SpotApp::new(cc)))),
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

    #[wasm_bindgen]
    pub fn spawn_at_norm(&self, _x_norm: f32, _y_norm: f32) {
        // TODO: Implement interactions for spot
    }

    #[wasm_bindgen]
    pub fn set_ui_visible(&self, _visible: bool) {
        // TODO: Implement UI visibility toggle
    }

    #[wasm_bindgen]
    pub fn is_pointer_over_ui(&self) -> bool {
        // TODO: Hook into egui context
        false
    }
}

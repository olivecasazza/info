mod app;
mod physics;
mod render;

pub use app::SpotApp;
use eframe::wasm_bindgen::{self, prelude::*};

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn start(canvas_id: &str) -> Result<(), eframe::wasm_bindgen::JsValue> {
    console_error_panic_hook::set_once();
    eframe::start_web(
        canvas_id,
        eframe::WebOptions::default(),
        Box::new(|cc| Ok(Box::new(SpotApp::new(cc)))),
    )
}

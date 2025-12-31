mod utils;
mod flock;

// `mod app;` uses `src/app/mod.rs`.
mod app;
mod web;

pub use web::WebHandle;

// NOTE: wee_alloc support removed during egui migration to avoid a dangling
// feature flag warning. Re-add when needed.

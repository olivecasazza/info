//! Shared Bevy plugins for WASM visualization projects.
//!
//! Provides common functionality across flock, pipedream, and spot:
//! - Debug overlay (FPS, draw calls)
//! - Pixel canvas for software rasterization
//! - Theme integration with ui-theme crate
//!
//! Note: Cameras are project-specific (isometric, 2D, 3D orbit) so not shared.

pub mod debug;
pub mod pixel_canvas;
pub mod theme;

use bevy::prelude::*;

/// Bundle of common plugins for all WASM projects.
pub struct BevyCorePlugins;

impl Plugin for BevyCorePlugins {
    fn build(&self, app: &mut App) {
        app.add_plugins((
            debug::DebugOverlayPlugin,
            theme::ThemePlugin,
        ));
    }
}

/// Re-export bevy_egui for convenience
pub use bevy_egui;

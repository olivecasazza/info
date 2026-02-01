//! Shared egui styling for WASM projects.
//!
//! Provides consistent high-contrast dark theme styling across all projects.
//!
//! # Usage
//! ```rust
//! use ui_theme::{apply_style, styled_window};
//!
//! // In your update() function:
//! apply_style(ctx);
//!
//! styled_window("Controls").show(ctx, |ui| {
//!     ui.label("Hello!");
//! });
//! ```

use std::collections::BTreeMap;
use egui::{Color32, Context, FontFamily, FontId, Margin, Stroke, TextStyle};

// Auto-generated theme values from themeColors.json
#[allow(dead_code)]
mod theme_gen {
    include!(concat!(env!("OUT_DIR"), "/theme_gen.rs"));
}

/// Semantic theme colors (from Tailwind config)
pub mod theme {
    use super::*;

    pub fn primary() -> Color32 {
        let (r, g, b) = theme_gen::PRIMARY_500;
        Color32::from_rgb(r, g, b)
    }

    pub fn secondary() -> Color32 {
        let (r, g, b) = theme_gen::SECONDARY_400;
        Color32::from_rgb(r, g, b)
    }

    pub fn highlight() -> Color32 {
        let (r, g, b) = theme_gen::HIGHLIGHT_300;
        Color32::from_rgb(r, g, b)
    }

    pub fn compliment() -> Color32 {
        let (r, g, b) = theme_gen::COMPLIMENT_300;
        Color32::from_rgb(r, g, b)
    }
}

/// UI color palette - high contrast dark theme
pub mod colors {
    use super::{Color32, Stroke};

    /// Semi-transparent black background (70% opacity)
    pub fn bg() -> Color32 {
        Color32::from_rgba_unmultiplied(0, 0, 0, 180)
    }

    /// Standard text color (gray)
    pub fn text() -> Color32 {
        Color32::from_gray(160)
    }

    /// Hovered text color (lighter gray)
    pub fn text_hovered() -> Color32 {
        Color32::from_gray(220)
    }

    /// Active/pressed text color (near white)
    pub fn text_active() -> Color32 {
        Color32::from_gray(240)
    }

    /// Border stroke
    pub fn border() -> Stroke {
        Stroke::new(1.0, text())
    }
}

/// Apply the shared high-contrast dark theme to the egui context.
///
/// Call this at the beginning of your `update()` function.
pub fn apply_style(ctx: &Context) {
    let mut style = (*ctx.style()).clone();

    // Monospace fonts throughout
    style.text_styles = BTreeMap::from([
        (TextStyle::Heading, FontId::new(16.0, FontFamily::Monospace)),
        (TextStyle::Body, FontId::new(13.0, FontFamily::Monospace)),
        (TextStyle::Monospace, FontId::new(13.0, FontFamily::Monospace)),
        (TextStyle::Button, FontId::new(13.0, FontFamily::Monospace)),
        (TextStyle::Small, FontId::new(11.0, FontFamily::Monospace)),
    ]);

    // Window/panel backgrounds
    style.visuals.window_fill = colors::bg();
    style.visuals.panel_fill = colors::bg();
    style.visuals.window_rounding = egui::Rounding::ZERO;

    // Text colors for widget states
    style.visuals.widgets.noninteractive.fg_stroke = Stroke::new(1.0, colors::text());
    style.visuals.widgets.inactive.fg_stroke = Stroke::new(1.0, colors::text());
    style.visuals.widgets.hovered.fg_stroke = Stroke::new(1.0, colors::text_hovered());
    style.visuals.widgets.active.fg_stroke = Stroke::new(1.0, colors::text_active());

    // Border strokes for all widgets
    let border = colors::border();
    style.visuals.widgets.noninteractive.bg_stroke = border;
    style.visuals.widgets.inactive.bg_stroke = border;
    style.visuals.widgets.hovered.bg_stroke = border;
    style.visuals.widgets.active.bg_stroke = border;

    // Override text color globally
    style.visuals.override_text_color = Some(colors::text());

    // Compact spacing
    style.spacing.item_spacing = egui::vec2(6.0, 4.0);
    style.spacing.window_margin = Margin::same(8.0);
    style.spacing.button_padding = egui::vec2(6.0, 2.0);

    ctx.set_style(style);
}

/// Create a styled window with the shared theme.
///
/// Returns an `egui::Window` preconfigured with:
/// - Dark semi-transparent background
/// - No rounding
/// - Gray border
/// - Inner margin for content padding
/// - Collapsible (default closed)
/// - Resizable and draggable
/// - Responsive positioning: top-right on desktop, bottom-center on mobile
pub fn styled_window(title: &str) -> egui::Window<'_> {
    egui::Window::new(title)
        .frame(
            egui::Frame::none()
                .fill(colors::bg())
                .rounding(egui::Rounding::ZERO)
                .stroke(colors::border())
                .inner_margin(Margin::symmetric(10.0, 6.0)),
        )
        .collapsible(true)
        .default_open(false)
        .resizable(true)
}

/// Create a styled window with responsive positioning.
///
/// On desktop (width > 768px): positions in top-right corner
/// On mobile (width <= 768px): positions at bottom-center
///
/// Call this in your update() after calling apply_style()
pub fn styled_window_responsive<'a>(ctx: &Context, title: &'a str) -> egui::Window<'a> {
    let screen = ctx.screen_rect();
    let is_mobile = screen.width() <= 768.0;

    let window = styled_window(title);

    if is_mobile {
        // Bottom center on mobile
        window.anchor(egui::Align2::CENTER_BOTTOM, egui::vec2(0.0, -16.0))
    } else {
        // Top right on desktop
        window.anchor(egui::Align2::RIGHT_TOP, egui::vec2(-16.0, 16.0))
    }
}

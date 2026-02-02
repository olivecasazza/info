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

    /// Opaque black background
    pub fn bg() -> Color32 {
        Color32::from_rgb(0, 0, 0)
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

    /// Border color
    pub fn border_color() -> Color32 {
        Color32::from_gray(80)
    }

    /// Border stroke
    pub fn border() -> Stroke {
        Stroke::new(1.0, border_color())
    }
}

/// Standard corner rounding - square corners for industrial look
pub fn rounding() -> egui::Rounding {
    egui::Rounding::ZERO
}

/// Apply the shared high-contrast dark theme to the egui context.
///
/// Call this at the beginning of your `update()` function.
pub fn apply_style(ctx: &Context) {
    let mut style = (*ctx.style()).clone();

    // Monospace fonts throughout
    style.text_styles = BTreeMap::from([
        (TextStyle::Heading, FontId::new(14.0, FontFamily::Monospace)),
        (TextStyle::Body, FontId::new(12.0, FontFamily::Monospace)),
        (TextStyle::Monospace, FontId::new(12.0, FontFamily::Monospace)),
        (TextStyle::Button, FontId::new(12.0, FontFamily::Monospace)),
        (TextStyle::Small, FontId::new(10.0, FontFamily::Monospace)),
    ]);

    // Window/panel backgrounds - opaque black with rounding
    style.visuals.window_fill = colors::bg();
    style.visuals.panel_fill = colors::bg();
    style.visuals.window_rounding = rounding();

    // Widget backgrounds - opaque black for title bar, etc.
    style.visuals.widgets.noninteractive.bg_fill = colors::bg();
    style.visuals.widgets.inactive.bg_fill = colors::bg();
    style.visuals.widgets.hovered.bg_fill = Color32::from_gray(20);
    style.visuals.widgets.active.bg_fill = Color32::from_gray(30);

    // Widget rounding
    style.visuals.widgets.noninteractive.rounding = rounding();
    style.visuals.widgets.inactive.rounding = rounding();
    style.visuals.widgets.hovered.rounding = rounding();
    style.visuals.widgets.active.rounding = rounding();

    // Text colors for widget states
    style.visuals.widgets.noninteractive.fg_stroke = Stroke::new(1.0, colors::text());
    style.visuals.widgets.inactive.fg_stroke = Stroke::new(1.0, colors::text());
    style.visuals.widgets.hovered.fg_stroke = Stroke::new(1.0, colors::text_hovered());
    style.visuals.widgets.active.fg_stroke = Stroke::new(1.0, colors::text_active());

    // No border strokes on widgets (we'll draw custom horizontal borders)
    let no_stroke = Stroke::NONE;
    style.visuals.widgets.noninteractive.bg_stroke = no_stroke;
    style.visuals.widgets.inactive.bg_stroke = no_stroke;
    style.visuals.widgets.hovered.bg_stroke = no_stroke;
    style.visuals.widgets.active.bg_stroke = no_stroke;

    // Override text color globally
    style.visuals.override_text_color = Some(colors::text());

    // Minimal spacing
    style.spacing.item_spacing = egui::vec2(6.0, 4.0);
    style.spacing.window_margin = Margin::same(8.0);
    style.spacing.button_padding = egui::vec2(6.0, 2.0);

    ctx.set_style(style);
}

/// Create a custom frame with horizontal-only borders (top and bottom)
fn horizontal_border_frame() -> egui::Frame {
    egui::Frame {
        fill: colors::bg(),
        rounding: rounding(),
        inner_margin: Margin::symmetric(8.0, 6.0),
        outer_margin: Margin::ZERO,
        stroke: Stroke::NONE, // We'll paint borders manually
        shadow: egui::Shadow::NONE,
    }
}

/// Paint horizontal borders (top and bottom only)
pub fn paint_horizontal_borders(ui: &mut egui::Ui, rect: egui::Rect) {
    let stroke = colors::border();
    let painter = ui.painter();

    // Top border
    painter.hline(rect.x_range(), rect.top(), stroke);
    // Bottom border
    painter.hline(rect.x_range(), rect.bottom(), stroke);
}

/// Create a styled window with the shared theme.
///
/// Returns an `egui::Window` preconfigured with:
/// - Dark opaque background
/// - Rounded corners
/// - Horizontal borders only (top/bottom)
/// - Inner margin for content padding
/// - Collapsible (default open)
/// - Resizable and draggable
pub fn styled_window(title: &str) -> egui::Window<'_> {
    egui::Window::new(title)
        .frame(horizontal_border_frame())
        .collapsible(true)
        .default_open(true)
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

    let window = styled_window(title)
        .default_width(300.0); // Consistent width across all projects

    if is_mobile {
        // Bottom center on mobile
        window.anchor(egui::Align2::CENTER_BOTTOM, egui::vec2(0.0, -16.0))
    } else {
        // Top right on desktop
        window.anchor(egui::Align2::RIGHT_TOP, egui::vec2(-16.0, 16.0))
    }
}

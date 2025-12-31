use egui::Color32;

// Auto-generated theme values from the Nuxt Tailwind config.
//
// Source of truth: `tailwind/themeColors.json`
//
// Rust constants are generated at compile-time by `wasm/flock/build.rs`.
mod theme_gen {
    include!(concat!(env!("OUT_DIR"), "/theme_gen.rs"));
}

/// Tailwind theme colors (generated from `tailwind/colors.ts`).
///
/// Note: `themeColors` doesn't define `tertiary` directly; we treat `compliment`
/// as tertiary.
pub mod species_colors {
    use super::*;

    pub fn primary() -> Color32 {
        let (r, g, b) = theme_gen::PRIMARY_500;
        Color32::from_rgb(r, g, b)
    }

    pub fn secondary() -> Color32 {
        let (r, g, b) = theme_gen::SECONDARY_400;
        Color32::from_rgb(r, g, b)
    }

    pub fn tertiary() -> Color32 {
        let (r, g, b) = theme_gen::COMPLIMENT_300;
        Color32::from_rgb(r, g, b)
    }

    pub fn highlight() -> Color32 {
        let (r, g, b) = theme_gen::HIGHLIGHT_300;
        Color32::from_rgb(r, g, b)
    }
}

/// GUI styling to approximate the old tweakpane theme.
pub mod ui_colors {
    use super::*;

    pub fn panel_fill() -> Color32 {
        Color32::from_rgba_unmultiplied(0, 0, 0, 120)
    }

    pub fn text() -> Color32 {
        Color32::from_gray(160)
    }

    pub fn text_hovered() -> Color32 {
        Color32::from_gray(220)
    }

    pub fn text_active() -> Color32 {
        Color32::from_gray(240)
    }
}

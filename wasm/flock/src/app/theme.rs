// Re-export from shared ui-theme crate
pub use ui_theme::colors as ui_colors;

/// Species colors with tertiary alias (compliment -> tertiary)
pub mod species_colors {
    use egui::Color32;

    pub fn primary() -> Color32 {
        ui_theme::theme::primary()
    }

    pub fn secondary() -> Color32 {
        ui_theme::theme::secondary()
    }

    /// Tertiary color (alias for compliment in themeColors.json)
    pub fn tertiary() -> Color32 {
        ui_theme::theme::compliment()
    }

    pub fn highlight() -> Color32 {
        ui_theme::theme::highlight()
    }
}

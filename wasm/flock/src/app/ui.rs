use egui::{Color32, Context};

use crate::app::FlockApp;

impl FlockApp {
    pub(crate) fn ui(&mut self, ctx: &Context) {
        if !self.commands.borrow().ui_visible {
            return;
        }

        // Apply shared high-contrast styling
        ui_theme::apply_style(ctx);

        // Responsive window positioning (top-right on desktop, bottom-center on mobile)
        ui_theme::styled_window_responsive(ctx, "settings")
            .default_width(420.0)
            .show(ctx, |ui| {
                ui.collapsing("flock settings", |ui| {
                    ui.checkbox(
                        &mut self.globals.enable_randomization_animation,
                        "enable randomization animation",
                    );

                    ui.add(
                        egui::Slider::new(&mut self.globals.simulation_timestep, 0.0..=5.0)
                            .text("simulation timestep"),
                    );

                    let mut max = self.globals.max_flock_size as u32;
                    if ui
                        .add(egui::Slider::new(&mut max, 0..=2000).text("max flock size"))
                        .changed()
                    {
                        self.globals.max_flock_size = max as usize;
                        self.flock.set_max_flock_size(self.globals.max_flock_size);
                    }

                    ui.label(format!(
                        "current_flock_size {}",
                        self.flock.current_flock_size()
                    ));

                    if ui.button("generate random species").clicked() {
                        self.add_species_random();
                    }
                });

                ui.separator();

                ui.collapsing("bird settings", |ui| {
                    let mut ids: Vec<_> = self.configs.keys().cloned().collect();
                    ids.sort();

                    for id in ids {
                        // Temporarily remove the config to avoid borrowing `self.configs` across the UI closure.
                        let mut cfg = match self.configs.remove(&id) {
                            Some(c) => c,
                            None => continue,
                        };

                        let mut should_remove = false;

                        ui.collapsing(id.clone(), |ui| {
                            ui.add(
                                egui::Slider::new(&mut cfg.probability, 0..=100)
                                    .text("spawn probability multiplier"),
                            );

                            ui.add(
                                egui::Slider::new(&mut cfg.neighbor_distance, 0.0..=250.0)
                                    .text("neighbor_distance"),
                            );
                            ui.add(
                                egui::Slider::new(&mut cfg.desired_separation, 0.0..=250.0)
                                    .text("desired_separation"),
                            );
                            ui.add(
                                egui::Slider::new(&mut cfg.separation_multiplier, 0.0..=10.0)
                                    .text("separation_multiplier"),
                            );
                            ui.add(
                                egui::Slider::new(&mut cfg.alignment_multiplier, 0.0..=10.0)
                                    .text("alignment_multiplier"),
                            );
                            ui.add(
                                egui::Slider::new(&mut cfg.cohesion_multiplier, 0.0..=10.0)
                                    .text("cohesion_multiplier"),
                            );
                            ui.add(
                                egui::Slider::new(&mut cfg.max_speed, 0.0..=10.0)
                                    .text("max_speed"),
                            );
                            ui.add(
                                egui::Slider::new(&mut cfg.max_force, 0.0..=10.0)
                                    .text("max_force"),
                            );
                            ui.add(
                                egui::Slider::new(&mut cfg.bird_size, 0.0..=25.0)
                                    .text("bird_size"),
                            );

                            let mut color = Color32::from_rgb(
                                (cfg.color_r * 255.0) as u8,
                                (cfg.color_g * 255.0) as u8,
                                (cfg.color_b * 255.0) as u8,
                            );
                            if ui.color_edit_button_srgba(&mut color).changed() {
                                cfg.color_r = color.r() as f32 / 255.0;
                                cfg.color_g = color.g() as f32 / 255.0;
                                cfg.color_b = color.b() as f32 / 255.0;
                            }

                            // Allow removing only for non-core species.
                            if !matches!(id.as_str(), "primary" | "secondary" | "tertiary" | "highlight")
                                && ui.button("remove species").clicked()
                            {
                                should_remove = true;
                            }
                        });

                        if should_remove {
                            self.flock.remove_bird_config(id.clone());
                            // Don't reinsert.
                        } else {
                            // Ensure edits take effect promptly.
                            self.flock.insert_bird_config(id.clone(), cfg.clone());
                            self.configs.insert(id, cfg);
                        }
                    }
                });
            });
    }
}

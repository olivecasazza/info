//! UI systems for Spot robot simulation.
//!
//! Provides egui debug interface with robot controls and diagnostics.

use bevy::prelude::*;
use bevy_egui::{egui, EguiContexts};

use crate::camera::CameraOrbit;
use crate::terrain::{TerrainSelection, TerrainType};
use crate::web_bevy::SpotState;

/// Main UI system - renders egui debug interface
pub fn ui_system(
    mut contexts: EguiContexts,
    mut state: ResMut<SpotState>,
    mut orbit: ResMut<CameraOrbit>,
    mut terrain: ResMut<TerrainSelection>,
    keyboard: Res<ButtonInput<KeyCode>>,
    time: Res<Time>,
) {
    if keyboard.just_pressed(KeyCode::Tab) {
        state.ui.toggle();
    }

    let ctx = contexts.ctx_mut();
    let dt = time.delta_secs();

    // Take ProjectUi out so the closure gets full access to state fields.
    // Swapped back after frame() — this is a standard Rust/Bevy pattern.
    let mut ui = std::mem::take(&mut state.ui);

    ui.frame(ctx, dt, |egui_ui| {
        egui::CollapsingHeader::new("Camera")
            .default_open(false)
            .show(egui_ui, |ui| {
                ui.checkbox(&mut orbit.following, "Follow Robot");
                ui.add(egui::Slider::new(&mut orbit.distance, 0.5..=10.0).text("Distance"));
                ui.label("Control: Drag to Orbit, Shift+Drag to Pan, Scroll to Zoom");
            });

        egui::CollapsingHeader::new("Terrain")
            .default_open(true)
            .show(egui_ui, |ui| {
                let current_label = terrain.current_terrain.label();
                egui::ComboBox::from_label("Type")
                    .selected_text(current_label)
                    .show_ui(ui, |ui| {
                        for &t in TerrainType::ALL {
                            let selected = terrain.current_terrain == t;
                            if ui.selectable_label(selected, t.label()).clicked() {
                                terrain.current_terrain = t;
                            }
                        }
                    });

                ui.add(
                    egui::Slider::new(&mut terrain.difficulty, 0.0..=1.0)
                        .text("Difficulty"),
                );

                ui.horizontal(|ui| {
                    ui.label(format!("Seed: {}", terrain.seed));
                    if ui.button("Random").clicked() {
                        // Use frame time as entropy source (no rand crate needed)
                        terrain.seed = (state.controller.total_time * 1_000_000.0) as u64
                            ^ 0xDEAD_BEEF_CAFE;
                    }
                });

                if ui.button("Regenerate Terrain").clicked() {
                    terrain.needs_rebuild = true;
                }
            });

        egui::CollapsingHeader::new("Robot Control")
            .default_open(false)
            .show(egui_ui, |ui| {
                ui.label("Keyboard Controls:");
                ui.monospace("W/S: Forward/Backward");
                ui.monospace("A/D: Rotate Left/Right");
                ui.monospace("Q/E: Strafe Left/Right");

                ui.separator();
                let cmd = &state.controller.command;
                ui.label(format!("Command: [{:.2}, {:.2}, {:.2}]",
                    cmd.vel_x, cmd.vel_y, cmd.yaw_rate));

                ui.checkbox(&mut state.controller.test_mode, "Test Mode (sine wave)");
            });

        // Policy output visualization - TIME SERIES GRAPH
        egui::CollapsingHeader::new("Policy Outputs (Graph)")
            .default_open(false)
            .show(egui_ui, |ui| {
                let history = &state.controller.action_history;
                if !history.is_empty() {
                    use egui_plot::{Line, Plot, PlotPoints};

                    let joint_names = ["FL_upper", "FL_lower", "FR_upper", "FR_lower"];
                    let joint_indices = [1, 2, 4, 5];
                    let colors = [
                        egui::Color32::from_rgb(255, 100, 100),
                        egui::Color32::from_rgb(255, 200, 100),
                        egui::Color32::from_rgb(100, 255, 100),
                        egui::Color32::from_rgb(100, 200, 255),
                    ];

                    Plot::new("policy_plot")
                        .height(150.0)
                        .show_axes(true)
                        .include_y(-2.0)
                        .include_y(2.0)
                        .show(ui, |plot_ui| {
                            for (j, &idx) in joint_indices.iter().enumerate() {
                                let points: PlotPoints = history
                                    .iter()
                                    .map(|(t, actions)| [*t as f64, actions[idx] as f64])
                                    .collect();
                                plot_ui.line(
                                    Line::new(points)
                                        .color(colors[j])
                                        .name(joint_names[j])
                                );
                            }
                        });

                    ui.horizontal(|ui| {
                        for (j, name) in joint_names.iter().enumerate() {
                            ui.colored_label(colors[j], format!("■ {}", name));
                        }
                    });
                } else {
                    ui.label("No data yet...");
                }

                ui.separator();
                let action = &state.controller.previous_action.joint_targets;
                ui.label(format!("FL: [{:+.2}, {:+.2}, {:+.2}]  FR: [{:+.2}, {:+.2}, {:+.2}]",
                    action[0], action[1], action[2], action[3], action[4], action[5]));
            });

        // Debug: Show observation being fed to policy
        egui::CollapsingHeader::new("Observation Debug")
            .default_open(false)
            .show(egui_ui, |ui| {
                let obs = &state.controller.last_observation;
                // Observation layout (45): [ang_vel(3), gravity(3), jpos(12), jvel(12), prev_act(12), cmd(3)]
                if obs.len() >= 45 {
                    ui.label(format!("AngVel: [{:+.2}, {:+.2}, {:+.2}]", obs[0], obs[1], obs[2]));
                    ui.label(format!("Gravity: [{:+.2}, {:+.2}, {:+.2}]", obs[3], obs[4], obs[5]));
                    ui.label(format!("Joint[0-2]: [{:+.2}, {:+.2}, {:+.2}]", obs[6], obs[7], obs[8]));
                    ui.label(format!("Command (obs[42-44]): [{:+.2}, {:+.2}, {:+.2}]", obs[42], obs[43], obs[44]));
                    ui.colored_label(
                        if obs[42].abs() > 0.1 || obs[43].abs() > 0.1 { egui::Color32::GREEN } else { egui::Color32::RED },
                        format!("Command active: {}", obs[42].abs() > 0.1 || obs[43].abs() > 0.1)
                    );
                }
            });
    });

    state.ui = ui;
}

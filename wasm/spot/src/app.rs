use crate::physics::PhysicsWorld;
use crate::renderer::SceneRenderer;
use eframe::egui;
use egui_plot::{Line, Plot, PlotPoints};
use three_d::*;
use std::sync::{Arc, Mutex};
use crate::controller::SpotController;
use crate::ml::UserCommand;

pub struct SpotApp {
    physics: PhysicsWorld,
    renderer: Arc<Mutex<SceneRenderer>>,
    #[allow(dead_code)]
    urdf: &'static str,
    controller: SpotController,
}

impl SpotApp {
    pub fn new(cc: &eframe::CreationContext<'_>) -> Self {
        let gl = cc.gl.as_ref().expect("No glow context available");
        // FIX: Context::from_gl_context
        let three_d_context = Context::from_gl_context(gl.clone()).unwrap();

        let mut physics = PhysicsWorld::new();
        let mut renderer = SceneRenderer::new(three_d_context);

        let urdf_content = include_str!("../assets/spot.urdf");

        physics.build_robot(urdf_content);

        renderer.load_assets();
        renderer.create_ground_plane();
        renderer.setup_models(urdf_content, &physics.link_map);

        let mut controller = SpotController::new();
        for (name, handle) in &physics.joint_map {
            controller.register_joint(name, *handle);
        }
        controller.finalize_joint_order();
        Self {
            physics,
            renderer: Arc::new(Mutex::new(renderer)),
            urdf: urdf_content,
            controller,
        }
    }
}

impl eframe::App for SpotApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        ctx.request_repaint();

        // Apply shared high-contrast styling
        ui_theme::apply_style(ctx);

        let dt = 1.0 / 120.0;

        // KEYBOARD INPUT -> USER COMMAND
        let mut target_command = UserCommand::new();
        ctx.input(|i| {
            if i.key_down(egui::Key::W) { target_command.vel_x = 1.0; }
            if i.key_down(egui::Key::S) { target_command.vel_x = -1.0; }
            if i.key_down(egui::Key::A) { target_command.yaw_rate = 1.0; }
            if i.key_down(egui::Key::D) { target_command.yaw_rate = -1.0; }
            if i.key_down(egui::Key::Q) { target_command.vel_y = 1.0; }
            if i.key_down(egui::Key::E) { target_command.vel_y = -1.0; }
        });

        // Smooth command interpolation (alpha = 0.1 for smooth acceleration)
        self.controller.update_command(target_command, 0.1);

        // Get base body handle for gravity observation
        let base_handle = self.physics.link_map.get("base_link").copied();

        // RUN ML CONTROLLER
        self.controller.update(
            &mut self.physics.multibody_joint_set,
            &self.physics.rigid_body_set,
            base_handle,
            dt,
        );

        self.physics.step();

        // Central Panel for 3D View
        egui::CentralPanel::default().frame(egui::Frame::none()).show(ctx, |ui| {
            let rect = ui.available_rect_before_wrap();

            // Capture Input via an invisible "Widget" covering the canvas
            let response = ui.allocate_rect(rect, egui::Sense::drag());

            if let Ok(mut renderer) = self.renderer.lock() {
                // INPUT HANDLING
                if response.dragged() {
                    let drag_delta = response.drag_delta();
                    // Conversions
                    let orbit_v2 = vec2(drag_delta.x, drag_delta.y);
                    let pan_v2 = vec2(drag_delta.x, drag_delta.y);

                    let modifiers = ui.input(|i| i.modifiers);
                    if modifiers.shift || ui.input(|i| i.pointer.middle_down()) {
                         renderer.handle_input(vec2(0.0, 0.0), 0.0, pan_v2);
                    } else {
                         renderer.handle_input(orbit_v2, 0.0, vec2(0.0, 0.0));
                    }
                }

                if response.hovered() {
                    let zoom = ui.input(|i| i.raw_scroll_delta.y);
                    if zoom != 0.0 {
                        renderer.handle_input(vec2(0.0, 0.0), zoom, vec2(0.0, 0.0));
                    }
                }

                // MODEL UPDATE & FOLLOW LOGIC
                let SceneRenderer { models, visual_offsets, camera_control, .. } = &mut *renderer;
                for (link_name, model) in models.iter_mut() {
                    if let Some(handle) = self.physics.link_map.get(link_name) {
                        if let Some(pose) = self.physics.get_body_pose(*handle) {
                            let t = pose.translation;

                            // FOLLOW LOGIC
                            if camera_control.following && link_name == "base_link" {
                                 camera_control.target = vec3(t.x, t.y, t.z);
                            }

                            let r = pose.rotation;

                            // Convert nalgebra::Rotation -> Matrix4 -> three_d::Mat4
                            let rot = r.to_rotation_matrix();

                            let mut m = Mat4::new(
                                rot[(0,0)], rot[(1,0)], rot[(2,0)], 0.0,
                                rot[(0,1)], rot[(1,1)], rot[(2,1)], 0.0,
                                rot[(0,2)], rot[(1,2)], rot[(2,2)], 0.0,
                                t.x,        t.y,        t.z,        1.0
                            );

                            if let Some(offset) = visual_offsets.get(link_name) {
                                m = m * offset;
                            }

                            model.update_transform(m);
                        }
                    }
                }
            }

            // Draw 3D Scene
            let renderer = self.renderer.clone();
            let callback = egui::PaintCallback {
                rect,
                callback: Arc::new(eframe::egui_glow::CallbackFn::new(move |_info, _painter| {
                    if let Ok(mut renderer) = renderer.lock() {
                        let viewport = Viewport {
                            x: (rect.min.x * _info.pixels_per_point) as i32,
                            y: (_info.screen_size_px[1] as i32)
                                - ((rect.min.y + rect.height()) * _info.pixels_per_point) as i32,
                            width: (rect.width() * _info.pixels_per_point) as u32,
                            height: (rect.height() * _info.pixels_per_point) as u32,
                        };
                        renderer.render(viewport, _info.screen_size_px[0], _info.screen_size_px[1]);
                    }
                })),
            };
            ui.painter().add(callback);
        });

        // Overlay UI with shared styling (responsive positioning)
        ui_theme::styled_window_responsive(ctx, "Settings")
            .default_width(280.0)
            .show(ctx, |ui| {
                ui.heading("Camera");
                if let Ok(mut renderer) = self.renderer.lock() {
                    ui.checkbox(&mut renderer.camera_control.following, "Follow Robot");
                    ui.add(egui::Slider::new(&mut renderer.camera_control.distance, 0.5..=10.0).text("Distance"));
                    ui.label("Control: Drag to Orbit, Shift+Drag to Pan, Scroll to Zoom");
                }

                ui.separator();
                ui.heading("Robot Control");
                ui.label("Keyboard Controls:");
                ui.monospace("W/S: Forward/Backward");
                ui.monospace("A/D: Rotate Left/Right");
                ui.monospace("Q/E: Strafe Left/Right");

                ui.separator();
                ui.label(format!("Command: [{:.2}, {:.2}, {:.2}]",
                    self.controller.command.vel_x,
                    self.controller.command.vel_y,
                    self.controller.command.yaw_rate
                ));

                ui.checkbox(&mut self.controller.test_mode, "Test Mode (sine wave)");

                // Policy output visualization - TIME SERIES GRAPH
                ui.separator();
                ui.heading("Policy Outputs (Graph)");

                // Build line data for front leg joints
                let history = &self.controller.action_history;
                if !history.is_empty() {
                    let joint_names = ["FL_upper", "FL_lower", "FR_upper", "FR_lower"];
                    let joint_indices = [1, 2, 4, 5]; // Front leg upper/lower joints
                    let colors = [
                        egui::Color32::from_rgb(255, 100, 100), // FL upper - red
                        egui::Color32::from_rgb(255, 200, 100), // FL lower - orange
                        egui::Color32::from_rgb(100, 255, 100), // FR upper - green
                        egui::Color32::from_rgb(100, 200, 255), // FR lower - cyan
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

                    // Legend
                    ui.horizontal(|ui| {
                        for (j, name) in joint_names.iter().enumerate() {
                            ui.colored_label(colors[j], format!("■ {}", name));
                        }
                    });
                } else {
                    ui.label("No data yet...");
                }

                // Current values summary
                ui.separator();
                let action = &self.controller.previous_action.joint_targets;
                ui.label(format!("FL: [{:+.2}, {:+.2}, {:+.2}]  FR: [{:+.2}, {:+.2}, {:+.2}]",
                    action[0], action[1], action[2], action[3], action[4], action[5]));

                // Debug: Show observation being fed to policy
                ui.separator();
                ui.heading("Observation Debug");
                let obs = &self.controller.last_observation;
                if obs.len() >= 42 {
                    ui.label(format!("Gravity: [{:+.2}, {:+.2}, {:+.2}]", obs[0], obs[1], obs[2]));
                    ui.label(format!("Joint[0-2]: [{:+.2}, {:+.2}, {:+.2}]", obs[3], obs[4], obs[5]));
                    ui.label(format!("Command (obs[39-41]): [{:+.2}, {:+.2}, {:+.2}]", obs[39], obs[40], obs[41]));
                    ui.colored_label(
                        if obs[39].abs() > 0.1 || obs[40].abs() > 0.1 { egui::Color32::GREEN } else { egui::Color32::RED },
                        format!("Command active: {}", obs[39].abs() > 0.1 || obs[40].abs() > 0.1)
                    );
                }
            });
    }
}

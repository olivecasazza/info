use crate::physics::PhysicsWorld;
use crate::render::SceneRenderer;
use eframe::egui;
use three_d::*;
use std::sync::{Arc, Mutex};

pub struct SpotApp {
    physics: PhysicsWorld,
    renderer: Arc<Mutex<SceneRenderer>>,
    #[allow(dead_code)]
    urdf: &'static str,
}

impl SpotApp {
    pub fn new(cc: &eframe::CreationContext<'_>) -> Self {
        let gl = cc.gl.as_ref().expect("No glow context available");
        // FIX: Context::from_gl_context
        let three_d_context = Context::from_gl_context(Arc::new(gl.clone())).unwrap();

        let mut physics = PhysicsWorld::new();
        let mut renderer = SceneRenderer::new(three_d_context);

        let urdf_content = include_str!("../assets/spot.urdf");

        physics.build_robot(urdf_content);

        renderer.load_assets();
        renderer.setup_models(urdf_content, &physics.link_map);

        Self {
            physics,
            renderer: Arc::new(Mutex::new(renderer)),
            urdf: urdf_content,
        }
    }
}

impl eframe::App for SpotApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        ctx.request_repaint();

        self.physics.step();

        if let Ok(mut renderer) = self.renderer.lock() {
             for (link_name, model) in renderer.models.iter_mut() {
                if let Some(handle) = self.physics.link_map.get(link_name) {
                    if let Some(body) = self.physics.rigid_body_set.get(*handle) {
                        let t = body.translation();
                        let r = body.rotation();

                        // Convert nalgebra::Rotation -> Matrix4 -> three_d::Mat4
                        // nalgebra Matrix4 is column-major.
                        // three_d::Mat4 is likely column-major (it's typical for GL).

                        let rot = r.to_rotation_matrix();

                        // Construct Mat4 manually to be safe across library versions
                        // set_transformation takes impl Into<Mat4>
                        let m = Mat4::new(
                            rot[(0,0)], rot[(1,0)], rot[(2,0)], 0.0,
                            rot[(0,1)], rot[(1,1)], rot[(2,1)], 0.0,
                            rot[(0,2)], rot[(1,2)], rot[(2,2)], 0.0,
                            t.x,        t.y,        t.z,        1.0
                        );

                        model.set_transformation(m);
                    }
                }
            }
        }

        egui::CentralPanel::default().show(ctx, |ui| {
            let rect = ui.available_rect_before_wrap();
            let renderer = self.renderer.clone();

            let callback = egui::PaintCallback {
                rect,
                callback: Arc::new(eframe::egui_glow::CallbackFn::new(move |_info, _painter| {
                    if let Ok(mut renderer) = renderer.lock() {
                         let viewport = Viewport {
                            x: (rect.min.x * _info.pixels_per_point) as i32,
                            y: (rect.min.y * _info.pixels_per_point) as i32,
                            width: (rect.width() * _info.pixels_per_point) as u32,
                            height: (rect.height() * _info.pixels_per_point) as u32,
                        };
                        renderer.render(viewport);
                    }
                })),
            };
            ui.painter().add(callback);
        });
    }
}

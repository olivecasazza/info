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
        // FIX: Context::from_gl_context expects Arc<glow::Context>.
        // eframe's gl is Arc<glow::Context>.
        // So just clone the Arc.
        let three_d_context = Context::from_gl_context(gl.clone()).unwrap();

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

                        let rot = r.to_rotation_matrix();

                        // Fix: Mat4::new takes column vectors in three-d (mint)? Or separate floats?
                        // three_d::Mat4 is an alias for `mint::ColumnMatrix4` or similar if no feature?
                        // If it's standard glam/nalgebra/cgmath:
                        // `Mat4::new` usually takes m11, m12, m13... row major?
                        // Let's assume standard `new(c0r0, c0r1...` ? No, documentation varies.

                        // Safest approach: `Mat4::from_cols` if available.
                        // Or `Mat4::from(array)`.

                        // Try `Mat4::from_cols` assuming we have it.
                        // If not, we will use `Mat4::from_translation(..)` * `Mat4::from(Quaternion)`.
                        // But we have `rotation_matrix` from nalgebra.

                        let mat_trans = Mat4::from_translation(vec3(t.x, t.y, t.z));
                        // Convert nalgebra rotation to three-d rotation.
                        // Try quaternion?
                        let q = body.rotation(); // UnitQuaternion
                        // Quat::new(w, x, y, z)
                        let mat_rot = Mat4::from(Quaternion::new(q.w, q.i, q.j, q.k));

                        model.set_transformation(mat_trans * mat_rot);
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

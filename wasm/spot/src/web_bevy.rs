//! WASM entrypoint for Bevy-based Spot robot simulation.
//!
//! Uses Bevy 3D with PBR rendering, keeping the existing Rapier physics
//! and tract-onnx ML inference. Loads GLB models similar to original three-d renderer.
//!
//! Module structure:
//! - camera: Orbit camera with mouse controls
//! - render: Ground grid, material fixing, visual sync
//! - scene: URDF parsing and mesh loading
//! - input: Keyboard controls
//! - simulation: Physics and ML updates
//! - ui: egui debug interface

use wasm_bindgen::prelude::*;
use bevy::prelude::*;
use bevy_egui::EguiPlugin;
use bevy_core::BevyCorePlugins;

use crate::physics::PhysicsWorld;
use crate::controller::SpotController;
use crate::ml::UserCommand;
use crate::{camera, render, scene, input, simulation, ui};

// Re-export commonly used types
pub use scene::{RobotLink, VisualOffset, VisualOffsets};

/// WebHandle for Bevy-based Spot WASM app.
#[wasm_bindgen]
pub struct WebHandle {}

#[wasm_bindgen]
impl WebHandle {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        console_error_panic_hook::set_once();
        Self {}
    }

    #[wasm_bindgen]
    pub async fn start(
        &self,
        canvas: web_sys::HtmlCanvasElement,
    ) -> Result<(), JsValue> {
        let canvas_id = canvas.id();
        let selector = if canvas_id.is_empty() {
            "#bevy-canvas".to_string()
        } else {
            format!("#{}", canvas_id)
        };

        // Assets are served from /spot-assets/
        // - Dev: via public/ symlink to wasm/spot/assets
        // - Prod: via _redirects to R2 CDN
        const ASSET_PATH: &str = "/spot-assets";

        App::new()
            .add_plugins(DefaultPlugins
                .set(WindowPlugin {
                    primary_window: Some(Window {
                        title: "Spot Robot".into(),
                        canvas: Some(selector),
                        fit_canvas_to_parent: true,
                        prevent_default_event_handling: false,
                        ..Default::default()
                    }),
                    ..Default::default()
                })
                // Load assets from local path (works for both dev and prod with redirects)
                .set(AssetPlugin {
                    meta_check: bevy::asset::AssetMetaCheck::Never,
                    file_path: ASSET_PATH.to_string(),
                    ..Default::default()
                })
            )
            .add_plugins(EguiPlugin)
            .add_plugins(BevyCorePlugins)
            .add_plugins(SpotPlugin)
            .run();

        Ok(())
    }

    #[wasm_bindgen]
    pub fn destroy(&self) {}

    #[wasm_bindgen]
    pub fn has_panicked(&self) -> bool { false }

    #[wasm_bindgen]
    pub fn set_ui_visible(&self, _visible: bool) {}

    #[wasm_bindgen]
    pub fn is_pointer_over_ui(&self) -> bool { false }

    #[wasm_bindgen]
    pub fn spawn_at_norm(&self, _x: f32, _y: f32) {}
}

/// Spot robot plugin for Bevy.
struct SpotPlugin;

impl Plugin for SpotPlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(ClearColor(Color::BLACK))
            .init_resource::<SpotState>()
            .add_systems(Startup, scene::setup_scene)
            .add_systems(Update, render::draw_ground_grid)
            .add_systems(Update, camera::camera_input)
            .add_systems(Update, input::keyboard_input.after(camera::camera_input))
            .add_systems(Update, simulation::physics_step.after(input::keyboard_input))
            .add_systems(Update, render::sync_visuals.after(simulation::physics_step))
            .add_systems(Update, update_camera_follow.after(render::sync_visuals))
            .add_systems(Update, camera::camera_follow.after(update_camera_follow))
            .add_systems(Update, ui::ui_system.after(camera::camera_follow))
            // Fix GLTF materials for WebGL2 compatibility - runs in PostUpdate to catch late-loaded materials
            // Note: Colors are baked into GLB files via scripts/colorize-glb.mjs
            .add_systems(PostUpdate, render::fix_materials);
    }
}

/// Main simulation state.
#[derive(Resource)]
pub struct SpotState {
    pub physics: PhysicsWorld,
    pub controller: SpotController,
    pub target_command: UserCommand,
    pub ui_visible: bool,
}

impl Default for SpotState {
    fn default() -> Self {
        let urdf_content = include_str!("../assets/spot.urdf");

        let mut physics = PhysicsWorld::new();
        physics.build_robot(urdf_content);

        let mut controller = SpotController::new();
        for (name, handle) in &physics.joint_map {
            controller.register_joint(name, *handle);
        }
        controller.finalize_joint_order();

        Self {
            physics,
            controller,
            target_command: UserCommand::new(),
            ui_visible: true,
        }
    }
}

/// Update camera orbit target to follow robot base
fn update_camera_follow(
    state: Res<SpotState>,
    mut orbit: ResMut<camera::CameraOrbit>,
) {
    if orbit.following {
        if let Some(&handle) = state.physics.link_map.get("base_link") {
            if let Some(pose) = state.physics.get_body_pose(handle) {
                let t = pose.translation;
                orbit.target = Vec3::new(t.x, t.y, t.z);
            }
        }
    }
}

#[wasm_bindgen(start)]
pub fn wasm_main() {}

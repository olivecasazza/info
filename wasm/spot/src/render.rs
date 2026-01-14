use three_d::*;
use std::collections::HashMap;
use roxmltree::Document;
use rapier3d::prelude::RigidBodyHandle;

pub struct SceneRenderer {
    pub context: Context,
    pub camera: Camera,
    pub models: HashMap<String, Gm<Mesh, PhysicalMaterial>>,
    pub light: DirectionalLight,
    pub ambient: AmbientLight,

    // Placeholder for pixelation target
    pub color_target: Option<Texture2D>,
    pub depth_target: Option<DepthTexture2D>,
}

impl SceneRenderer {
    pub fn new(context: Context) -> Self {
        let camera = Camera::new_perspective(
            Viewport::new_at_origo(1, 1),
            vec3(2.0, 2.0, 5.0),
            vec3(0.0, 0.0, 0.0),
            vec3(0.0, 1.0, 0.0),
            degrees(45.0),
            0.1,
            100.0,
        );

        // Fix: No reference for vec3
        let light = DirectionalLight::new(&context, 1.0, Srgba::WHITE, vec3(0.0, -1.0, -1.0));
        let ambient = AmbientLight::new(&context, 0.4, Srgba::WHITE);

        Self {
            context,
            camera,
            models: HashMap::new(),
            light,
            ambient,
            color_target: None,
            depth_target: None,
        }
    }

    pub fn load_assets(&mut self) {
        // No-op
    }

    pub fn setup_models(&mut self, urdf_content: &str, _link_map: &HashMap<String, RigidBodyHandle>) {
        let doc = Document::parse(urdf_content).expect("Failed to parse URDF");

        for node in doc.descendants().filter(|n| n.has_tag_name("link")) {
            if let Some(name) = node.attribute("name") {
                let mesh = CpuMesh::cube();
                let material = PhysicalMaterial::new_opaque(
                    &self.context,
                    &CpuMaterial {
                        albedo: Srgba::new(200, 100, 50, 255),
                        ..Default::default()
                    },
                );

                let mut gm = Gm::new(Mesh::new(&self.context, &mesh), material);
                gm.set_transformation(Mat4::from_scale(0.1));

                self.models.insert(name.to_string(), gm);
            }
        }
    }

    pub fn render(&mut self, screen_viewport: Viewport) {
        self.camera.set_viewport(screen_viewport);
        self.context.set_viewport(screen_viewport);

        let screen = RenderTarget::screen(&self.context, screen_viewport.width, screen_viewport.height);
        screen.clear(ClearState::color_and_depth(0.1, 0.1, 0.1, 1.0, 1.0));

        let objects: Vec<&dyn Object> = self.models.values().map(|m| m as &dyn Object).collect();
        screen.render(&self.camera, &objects, &[&self.ambient, &self.light]);
    }
}

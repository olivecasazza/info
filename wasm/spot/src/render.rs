use three_d::*;
use rapier3d::prelude::{RigidBodyHandle, RigidBodySet};
use std::collections::HashMap;
use roxmltree::Document;

pub struct SceneRenderer {
    pub context: Context,
    pub camera: Camera,
    pub models: HashMap<String, Gm<Mesh, PhysicalMaterial>>,
    pub light: DirectionalLight,
    pub ambient: AmbientLight,

    // Low-res target for pixelation
    pub color_target: Option<Texture2D>,
    pub depth_target: Option<DepthTexture2D>,

    // Original Meshes (loaded from GLB)
    pub loaded_meshes: HashMap<String, CpuMesh>,
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

        // Fix: Use three_d::Background (or just default) for Color
        // three_d 0.17+ uses `Srgba` or `Color` but sometimes expects different types.
        // Let's rely on standard colors.
        let light = DirectionalLight::new(&context, 1.0, Srgba::WHITE, &vec3(0.0, -1.0, -1.0));
        let ambient = AmbientLight::new(&context, 0.4, Srgba::WHITE);

        Self {
            context,
            camera,
            models: HashMap::new(),
            light,
            ambient,
            color_target: None,
            depth_target: None,
            loaded_meshes: HashMap::new(),
        }
    }

    pub fn load_assets(&mut self) {
        let mut cpu_meshes = HashMap::new();

        macro_rules! load_glb {
            ($name:expr, $path:expr) => {
                {
                    let bytes = include_bytes!($path);
                    let mut loaded = three_d_asset::io::load_from_bytes($name, bytes).expect("Failed to load GLB bytes");
                    let mesh: CpuMesh = loaded.deserialize("").expect("Failed to deserialize GLB");
                    cpu_meshes.insert($name.to_string(), mesh);
                }
            };
        }

        load_glb!("MAINBODY.glb", "../assets/glb/MAINBODY.glb");
        load_glb!("FRONT.glb", "../assets/glb/FRONT.glb");
        load_glb!("BACK.glb", "../assets/glb/BACK.glb");
        load_glb!("LEFT_HIP.glb", "../assets/glb/LEFT_HIP.glb");
        load_glb!("RIGHT_HIP.glb", "../assets/glb/RIGHT_HIP.glb");
        load_glb!("LEFT_UPPER_LEG.glb", "../assets/glb/LEFT_UPPER_LEG.glb");
        load_glb!("RIGHT_UPPER_LEG.glb", "../assets/glb/RIGHT_UPPER_LEG.glb");
        load_glb!("LEFT_LOWER_LEG.glb", "../assets/glb/LEFT_LOWER_LEG.glb");
        load_glb!("RIGHT_LOWER_LEG.glb", "../assets/glb/RIGHT_LOWER_LEG.glb");
        load_glb!("LEFT_FOOT.glb", "../assets/glb/LEFT_FOOT.glb");
        load_glb!("RIGHT_FOOT.glb", "../assets/glb/RIGHT_FOOT.glb");
        load_glb!("Front_Bracket.glb", "../assets/glb/Front_Bracket.glb");
        load_glb!("Back_Bracket.glb", "../assets/glb/Back_Bracket.glb");
        load_glb!("Chassis_Left_Side.glb", "../assets/glb/Chassis_Left_Side.glb");
        load_glb!("Chassis_Right_Side.glb", "../assets/glb/Chassis_Right_Side.glb");
        load_glb!("BATTERY.glb", "../assets/glb/BATTERY.glb");

        self.loaded_meshes = cpu_meshes;
    }

    pub fn setup_models(&mut self, urdf_content: &str, _link_map: &HashMap<String, RigidBodyHandle>) {
        let doc = Document::parse(urdf_content).expect("Failed to parse URDF");

        for node in doc.descendants().filter(|n| n.has_tag_name("link")) {
            if let Some(name) = node.attribute("name") {
                if let Some(visual) = node.children().find(|n| n.has_tag_name("visual")) {
                    if let Some(geometry) = visual.children().find(|n| n.has_tag_name("geometry")) {
                        if let Some(mesh_node) = geometry.children().find(|n| n.has_tag_name("mesh")) {
                            if let Some(filename) = mesh_node.attribute("filename") {
                                let path = std::path::Path::new(filename);
                                if let Some(stem) = path.file_stem() {
                                    let glb_name = format!("{}.glb", stem.to_str().unwrap());

                                    if let Some(mesh) = self.loaded_meshes.get(&glb_name) {
                                        let material = PhysicalMaterial::new_opaque(
                                            &self.context,
                                            &CpuMaterial {
                                                albedo: Srgba::new(200, 100, 50, 255),
                                                ..Default::default()
                                            },
                                        );
                                        let model = Gm::new(Mesh::new(&self.context, mesh), material);
                                        self.models.insert(name.to_string(), model);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    pub fn render(&mut self, screen_viewport: Viewport) {
        let pixel_scale = 4;
        let w = (screen_viewport.width / pixel_scale).max(1);
        let h = (screen_viewport.height / pixel_scale).max(1);

        if self.color_target.as_ref().map(|t| t.width() != w || t.height() != h).unwrap_or(true) {
             self.color_target = Some(Texture2D::new_empty::<[u8; 4]>(
                &self.context,
                w,
                h,
                Interpolation::Nearest,
                Interpolation::Nearest,
                None,
                Wrapping::ClampToEdge,
                Wrapping::ClampToEdge,
            ));
            self.depth_target = Some(DepthTexture2D::new::<f32>(
                &self.context,
                w,
                h,
                Wrapping::ClampToEdge,
                Wrapping::ClampToEdge,
            ));
        }

        let target = RenderTarget::new(
            self.color_target.as_mut().unwrap().as_color_target(None),
            self.depth_target.as_mut().unwrap().as_depth_target(),
        );

        self.camera.set_viewport(Viewport::new_at_origo(w, h));

        target.clear(ClearState::color_and_depth(0.1, 0.1, 0.1, 1.0, 1.0));

        let objects: Vec<&dyn Object> = self.models.values().map(|m| m as &dyn Object).collect();
        target.render(&self.camera, &objects, &[&self.ambient, &self.light]);

        self.context.set_viewport(screen_viewport);

        target.copy_to(RenderTarget::screen(&self.context, screen_viewport.width, screen_viewport.height));
    }
}

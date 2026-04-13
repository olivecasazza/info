use three_d::*;
use rapier3d::prelude::RigidBodyHandle;
use std::collections::HashMap;
use roxmltree::Document;

pub trait SpotModel: Object {
    fn update_transform(&mut self, transform: Mat4);
    fn as_object(&self) -> &dyn Object;
}

impl<M: Material + Clone + 'static> SpotModel for Gm<Mesh, M> {
    fn update_transform(&mut self, transform: Mat4) {
        self.geometry.set_transformation(transform);
    }
    fn as_object(&self) -> &dyn Object {
        self
    }
}

pub struct CameraController {
    pub target: Vec3,
    pub distance: f32,
    pub yaw: f32,
    pub pitch: f32,
    pub following: bool,
}

impl CameraController {
    pub fn new() -> Self {
        Self {
            target: vec3(0.0, 0.0, 0.0),
            distance: 2.5,
            yaw: 45.0_f32.to_radians(),
            pitch: 30.0_f32.to_radians(),
            following: false,
        }
    }
}

pub struct SceneRenderer {
    pub context: Context,
    pub camera: Camera,
    pub models: HashMap<String, Box<dyn SpotModel>>,
    pub light: DirectionalLight,
    pub ambient: AmbientLight,
    pub camera_control: CameraController,

    // Original Meshes (loaded from STL)
    pub loaded_meshes: HashMap<String, CpuMesh>,

    // Valid for applying to the visual model relative to the rigid body frame
    pub visual_offsets: HashMap<String, Mat4>,

    // Ground plane for visualization
    pub ground_plane: Option<Gm<Mesh, ColorMaterial>>,
}

// Unsafe impl to allow usage in egui callback (WASM is single threaded)
unsafe impl Send for SceneRenderer {}
unsafe impl Sync for SceneRenderer {}

/// Multi-octave sine noise for natural-looking terrain elevation
fn terrain_height(x: f32, z: f32) -> f32 {
    let h1 = (x * 0.3).sin() * (z * 0.3).cos() * 0.5;
    let h2 = (x * 0.7 + 1.3).sin() * (z * 0.5 + 2.1).cos() * 0.25;
    let h3 = (x * 1.5 + 0.7).sin() * (z * 1.3 + 0.4).cos() * 0.1;
    h1 + h2 + h3
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

        let light = DirectionalLight::new(&context, 1.0, Srgba::WHITE, vec3(0.0, -1.0, -1.0));
        let ambient = AmbientLight::new(&context, 0.4, Srgba::WHITE);

        Self {
            context,
            camera,
            models: HashMap::new(),
            light,
            ambient,
            camera_control: CameraController::new(),
            loaded_meshes: HashMap::new(),
            visual_offsets: HashMap::new(),
            ground_plane: None,
        }
    }

    /// Create ground plane with grid pattern for visualization
    pub fn create_ground_plane(&mut self) {
        // Create a grid of tiles with procedural elevation
        let grid_size = 20; // 20x20 grid
        let tile_size = 0.5f32; // 0.5 meter tiles for finer detail
        let half_size = (grid_size as f32 * tile_size) / 2.0;

        let mut positions = Vec::new();
        let mut indices = Vec::new();
        let mut normals = Vec::new();
        let mut colors = Vec::new();

        for i in 0..grid_size {
            for j in 0..grid_size {
                let x0 = (i as f32 * tile_size) - half_size;
                let z0 = (j as f32 * tile_size) - half_size;
                let x1 = x0 + tile_size;
                let z1 = z0 + tile_size;

                let base_idx = positions.len() as u32;

                // 4 vertices per tile with procedural elevation
                let p0 = vec3(x0, terrain_height(x0, z0), z0);
                let p1 = vec3(x1, terrain_height(x1, z0), z0);
                let p2 = vec3(x1, terrain_height(x1, z1), z1);
                let p3 = vec3(x0, terrain_height(x0, z1), z1);
                positions.push(p0);
                positions.push(p1);
                positions.push(p2);
                positions.push(p3);

                // Compute normals from cross product of edge vectors
                // Triangle 1: p0, p1, p2
                let edge1_a = p1 - p0;
                let edge1_b = p2 - p0;
                let n1 = edge1_a.cross(edge1_b).normalize();

                // Triangle 2: p0, p2, p3
                let edge2_a = p2 - p0;
                let edge2_b = p3 - p0;
                let n2 = edge2_a.cross(edge2_b).normalize();

                // Average normal for shared vertices
                let avg_n = ((n1 + n2) * 0.5).normalize();
                normals.push(n1);  // p0 - shared, but use n1 for tri1 vertex
                normals.push(n1);  // p1 - belongs to tri1
                normals.push(avg_n); // p2 - shared between both triangles
                normals.push(n2);  // p3 - belongs to tri2

                // Black tiles with dim white edges for grid lines
                let base = Srgba::new(15, 15, 18, 255); // Near-black base
                let edge = Srgba::new(60, 60, 65, 255); // Dim white grid line

                // Corner vertices: edges get grid line color
                colors.push(edge); // x0,z0 corner (always on grid line)
                colors.push(edge); // x1,z0
                colors.push(base); // x1,z1 (interior)
                colors.push(edge); // x0,z1

                // Two triangles per tile
                indices.push(base_idx);
                indices.push(base_idx + 1);
                indices.push(base_idx + 2);
                indices.push(base_idx);
                indices.push(base_idx + 2);
                indices.push(base_idx + 3);
            }
        }

        let cpu_mesh = CpuMesh {
            positions: Positions::F32(positions),
            indices: Indices::U32(indices),
            normals: Some(normals),
            colors: Some(colors),
            ..Default::default()
        };

        // Use ColorMaterial which properly reads vertex colors on WebGL2.
        // PhysicalMaterial ignores vertex colors on some WebGL2 backends,
        // causing the terrain to render as solid white.
        let material = ColorMaterial::new_opaque(
            &self.context,
            &CpuMaterial {
                albedo: Srgba::WHITE, // Multiplied by vertex colors
                ..Default::default()
            },
        );

        self.ground_plane = Some(Gm::new(Mesh::new(&self.context, &cpu_mesh), material));
    }

    pub fn handle_input(&mut self, orbit: Vec2, zoom: f32, pan: Vec2) {
        // Orbit (Yaw/Pitch)
        self.camera_control.yaw += orbit.x * 0.01;
        self.camera_control.pitch += orbit.y * 0.01;
        // Clamp pitch to avoid flip
        self.camera_control.pitch = self.camera_control.pitch.clamp(-1.5, 1.5);

        // Zoom (Distance)
        self.camera_control.distance *= 1.0 - zoom * 0.001; // 0.1% per pixel scroll
        self.camera_control.distance = self.camera_control.distance.clamp(0.5, 10.0);

        // Pan (Target move) - Only if NOT following
        if !self.camera_control.following {
             let right = self.camera.view().invert().unwrap().x.truncate().normalize();
             let up = vec3(0.0, 1.0, 0.0); // World Up
             // Or camera local up? World up is better for ground plane pan.
             self.camera_control.target -= right * pan.x * 0.005;
             self.camera_control.target += up * pan.y * 0.005;
        }
    }

    pub fn update_camera(&mut self) {
         let target = self.camera_control.target;
         let dist = self.camera_control.distance;
         let yaw = self.camera_control.yaw;
         let pitch = self.camera_control.pitch;

         // Spherical to Cartesian relative to target
         // Y is UP
         let pos = target + vec3(
             dist * yaw.sin() * pitch.cos(),
             dist * pitch.sin(),
             dist * yaw.cos() * pitch.cos()
         );
         // Wait, pitch=0 should be horizon. sin(0)=0 -> y=0. Correct.
         // yaw=0 -> x=0, z=dist. Correct.

         self.camera.set_view(pos, target, vec3(0.0, 1.0, 0.0));
    }

    pub fn load_assets(&mut self) {
        let mut cpu_meshes = HashMap::new();

        macro_rules! load_mesh {
            ($name:expr, $filename:expr) => {
                {
                    let bytes = include_bytes!(concat!(env!("CARGO_MANIFEST_DIR"), "/assets/", $filename));
                    let mut assets = three_d_asset::io::RawAssets::new();
                    assets.insert($name, bytes.to_vec());
                    let mut mesh: CpuMesh = assets.deserialize($name).expect("Failed to deserialize Mesh");
                    mesh.compute_normals();
                    cpu_meshes.insert($name.to_string(), mesh);
                }
            };
        }

        load_mesh!("MAINBODY.stl", "MAINBODY.stl");
        load_mesh!("Battery.stl", "BatteryRenamed.stl");
        load_mesh!("Back.stl", "Back.stl");
        load_mesh!("Back_Bracket.stl", "Back_Bracket.stl");
        load_mesh!("Front.stl", "Front.stl");
        load_mesh!("Front_Bracket.stl", "Front_Bracket.stl");
        load_mesh!("Chassis_Left_Side.stl", "Chassis_Left_Side.stl");
        load_mesh!("Chassis_Right_Side.stl", "Chassis_Right_Side.stl");

        load_mesh!("LEFT_HIP.stl", "LEFT_HIP.stl");
        load_mesh!("LEFT_UPPER_LEG.stl", "LEFT_UPPER_LEG.stl");
        load_mesh!("LEFT_LOWER_LEG.stl", "LEFT_LOWER_LEG.stl");
        load_mesh!("LEFT_FOOT.stl", "LEFT_FOOT.stl");

        load_mesh!("RIGHT_HIP.stl", "RIGHT_HIP.stl");
        load_mesh!("RIGHT_UPPER_LEG.stl", "RIGHT_UPPER_LEG.stl");
        load_mesh!("RIGHT_LOWER_LEG.stl", "RIGHT_LOWER_LEG.stl");
        load_mesh!("RIGHT_FOOT.stl", "RIGHT_FOOT.stl");

        self.loaded_meshes = cpu_meshes;
    }

    pub fn setup_models(&mut self, urdf_content: &str, _link_map: &HashMap<String, RigidBodyHandle>) {
        let doc = Document::parse(urdf_content).expect("Failed to parse URDF");

        for node in doc.descendants().filter(|n| n.has_tag_name("link")) {
            if let Some(name) = node.attribute("name") {
                if let Some(visual) = node.children().find(|n| n.has_tag_name("visual")) {

                    // Parse Visual Offset
                    let mut offset_matrix = Mat4::identity();
                    if let Some(origin) = visual.children().find(|n| n.has_tag_name("origin")) {
                        let mut xyz = vec3(0.0, 0.0, 0.0);
                        let mut rpy = vec3(0.0, 0.0, 0.0);

                        if let Some(xyz_str) = origin.attribute("xyz") {
                             let v: Vec<f32> = xyz_str.split_whitespace().filter_map(|s| s.parse().ok()).collect();
                             if v.len() == 3 { xyz = vec3(v[0], v[1], v[2]); }
                        }
                        if let Some(rpy_str) = origin.attribute("rpy") {
                             let v: Vec<f32> = rpy_str.split_whitespace().filter_map(|s| s.parse().ok()).collect();
                             if v.len() == 3 { rpy = vec3(v[0], v[1], v[2]); }
                        }

                        // URDF RPY is usually extrinsic XYZ: Fixed axis Roll->Pitch->Yaw (check this convention)
                        // Actually standard URDF is fixed axis extrinsic RPY: R(z)*R(y)*R(x).
                        offset_matrix = Mat4::from_translation(xyz)
                            * Mat4::from_angle_z(radians(rpy.z))
                            * Mat4::from_angle_y(radians(rpy.y))
                            * Mat4::from_angle_x(radians(rpy.x));
                    }
                    self.visual_offsets.insert(name.to_string(), offset_matrix);

                    // Parse Material Color
                    let mut color = Srgba::new(200, 100, 50, 255); // Default Orange
                    if let Some(mat) = visual.children().find(|n| n.has_tag_name("material")) {
                         if let Some(mat_name) = mat.attribute("name") {
                             match mat_name.to_lowercase().as_str() {
                                 "black" => color = Srgba::new(25, 25, 25, 255),
                                 "white" | "grey" => color = Srgba::new(200, 200, 200, 255),
                                 "orange" => color = Srgba::new(255, 128, 0, 255),
                                 _ => {}
                             }
                         }
                    }

                    if let Some(geometry) = visual.children().find(|n| n.has_tag_name("geometry")) {
                        if let Some(mesh_node) = geometry.children().find(|n| n.has_tag_name("mesh")) {
                            if let Some(filename) = mesh_node.attribute("filename") {
                                let stem = std::path::Path::new(filename)
                                    .file_stem()
                                    .and_then(|s| s.to_str());

                                if let Some(stem) = stem {
                                    let stl_name = format!("{}.stl", stem);

                                    // Special case for Battery
                                    let lookup_name = if stl_name == "Battery.stl" {
                                        "BatteryRenamed.stl".to_string()
                                    } else {
                                        stl_name.clone()
                                    };

                                    // Try loading with renamed battery or original
                                    if let Some(mesh) = self.loaded_meshes.get(&lookup_name).or_else(|| self.loaded_meshes.get(&stl_name)) {
                                        let material = PhysicalMaterial::new_opaque(
                                            &self.context,
                                            &CpuMaterial {
                                                albedo: color,
                                                ..Default::default()
                                            },
                                        );
                                        let model = Gm::new(Mesh::new(&self.context, mesh), material);
                                        web_sys::console::log_1(&wasm_bindgen::JsValue::from_str(&format!("Loaded Visual Model: {} -> {}", name, lookup_name)));
                                        self.models.insert(name.to_string(), Box::new(model));
                                    } else {
                                        web_sys::console::log_1(&wasm_bindgen::JsValue::from_str(&format!("MISSING MESH: {} for link {}", stl_name, name)));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    pub fn render(&mut self, screen_viewport: Viewport, screen_width: u32, screen_height: u32) {
        self.update_camera();
        self.camera.set_viewport(screen_viewport);
        let target = RenderTarget::screen(&self.context, screen_width, screen_height);

        unsafe {
            use three_d::context::SCISSOR_TEST;
            self.context.enable(SCISSOR_TEST);
            self.context.scissor(
                screen_viewport.x,
                screen_viewport.y,
                screen_viewport.width as i32,
                screen_viewport.height as i32,
            );
        }

        target.clear(ClearState::color_and_depth(0.2, 0.2, 0.2, 1.0, 1.0));

        // Collect all objects to render including ground plane
        let mut objects: Vec<&dyn Object> = self.models.values().map(|m| m.as_object()).collect();
        if let Some(ref ground) = self.ground_plane {
            objects.push(ground as &dyn Object);
        }

        target.render(&self.camera, &objects, &[&self.ambient, &self.light]);

        unsafe {
             self.context.disable(three_d::context::SCISSOR_TEST);
        }
    }
}

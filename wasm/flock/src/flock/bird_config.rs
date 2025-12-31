use wasm_bindgen::prelude::*;

#[derive(Clone)]
#[wasm_bindgen]
pub struct BirdConfig {
    id: String,
    pub probability: i32,
    pub neighbor_distance: f32,
    pub desired_separation: f32,
    pub separation_multiplier: f32,
    pub alignment_multiplier: f32,
    pub cohesion_multiplier: f32,
    pub max_speed: f32,
    pub max_force: f32,
    pub bird_size: f32,
    pub color_r: f32,
    pub color_g: f32,
    pub color_b: f32,
}

#[wasm_bindgen]
impl BirdConfig {

    #[wasm_bindgen(getter)]
    pub fn id(&self) -> String {
        self.id.to_string()
    }

    #[wasm_bindgen(setter)]
    pub fn set_id(&mut self, id: String) {
        self.id = id;
    }

    pub fn new(
        id: String,
        probability: i32,
        neighbor_distance: f32,
        desired_separation: f32,
        separation_multiplier: f32,
        alignment_multiplier: f32,
        cohesion_multiplier: f32,
        max_speed: f32,
        max_force: f32,
        bird_size: f32,
        color_r: f32,
        color_g: f32,
        color_b: f32,
    ) -> BirdConfig {
        BirdConfig {
            id,
            probability,
            neighbor_distance,
            desired_separation,
            separation_multiplier,
            alignment_multiplier,
            cohesion_multiplier,
            max_speed,
            max_force,
            bird_size,
            color_r,
            color_g,
            color_b,
        }
    }
}

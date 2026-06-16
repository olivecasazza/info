pub fn lerp(a: f32, b: f32, t: f32) -> f32 {
    a + (b - a) * t
}

pub fn lerp_u8(a: u8, b: u8, t: f32) -> u8 {
    let a = a as f32;
    let b = b as f32;
    lerp(a, b, t).round().clamp(0.0, 255.0) as u8
}

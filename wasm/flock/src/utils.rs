use std::{ops::{MulAssign, DivAssign}};

use nalgebra::{Vector2};

use wasm_bindgen::prelude::*;

/**
pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}
 */

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    pub fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    pub fn log_many(a: &str, b: &str);
}

pub fn clamp_magnitude(vector: &mut Vector2<f32>, max: f32) {
    let length = vector.magnitude();
    if nearly_equal(length, 0.0, 0.5) { return; };
    vector.div_assign(length);
    let scale = length.min(max).max(-max);
    vector.mul_assign(scale);
}

pub fn nearly_equal(a: f32, b: f32, epsilon: f32) -> bool {
    let abs_a = (a).abs();
    let abs_b = (b).abs();
    let diff = (a - b).abs();

    if a == b {
        // shortcut, handles infinities
        return true;
    } else if a == 0.0 || b == 0.0 || !diff.is_normal() {
        // a or b is zero or both are extremely close to it
        // relative error is less meaningful here
        return diff < (epsilon * f32::MIN);
    } else {
        // use relative error
        return diff / (abs_a + abs_b) < epsilon;
    }
}

#import bevy_pbr::{
    forward_io::VertexOutput,
    pbr_fragment::pbr_input_from_standard_material,
    pbr_functions::alpha_discard,
}

@fragment
fn fragment(in: VertexOutput, @builtin(front_facing) is_front: bool) -> @location(0) vec4<f32> {
    var pbr_input = pbr_input_from_standard_material(in, is_front);

    // Quantize lighting to 3 levels for toon/cel effect
    let light = max(dot(pbr_input.N, normalize(vec3<f32>(1.0, 1.0, 0.5))), 0.0);
    var shade: f32;
    if light > 0.7 {
        shade = 1.0;
    } else if light > 0.3 {
        shade = 0.6;
    } else {
        shade = 0.3;
    }

    let base_color = pbr_input.material.base_color;
    return vec4<f32>(base_color.rgb * shade, base_color.a);
}

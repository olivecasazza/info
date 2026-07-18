// Hand-drawn pencil sketch post-processing shader
// Dark theme: white lines on pure black background
// Inspired by: https://www.shadertoy.com/view/llScRz

#import bevy_core_pipeline::fullscreen_vertex_shader::FullscreenVertexOutput

@group(0) @binding(0) var screen_texture: texture_2d<f32>;
@group(0) @binding(1) var texture_sampler: sampler;

struct HandDrawnSettings {
    time: f32,
    resolution_x: f32,
    resolution_y: f32,
    intensity: f32,
}

@group(0) @binding(2) var<uniform> settings: HandDrawnSettings;

// Pure black background, white lines
const BACKGROUND_COLOR: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
const LINE_COLOR: vec3<f32> = vec3<f32>(1.0, 1.0, 1.0);

// Compute luminance
fn luminance(c: vec3<f32>) -> f32 {
    return dot(c, vec3<f32>(0.299, 0.587, 0.114));
}

// Check if pixel has scene content (above black threshold)
fn has_content(c: vec3<f32>) -> bool {
    // Very low threshold to catch even dark terrain
    return (c.r > 0.01 || c.g > 0.01 || c.b > 0.01);
}

// -----------------------------------------------------------------------
// Noise Functions
// -----------------------------------------------------------------------
fn hash(p: vec2<f32>) -> f32 {
    return fract(sin(dot(p, vec2<f32>(12.9898, 78.233))) * 43758.5453);
}

fn noise(p: vec2<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2<f32>(0.0, 0.0)), hash(i + vec2<f32>(1.0, 0.0)), u.x),
               mix(hash(i + vec2<f32>(0.0, 1.0)), hash(i + vec2<f32>(1.0, 1.0)), u.x), u.y);
}

@fragment
fn fragment(in: FullscreenVertexOutput) -> @location(0) vec4<f32> {
    let resolution = vec2<f32>(textureDimensions(screen_texture));
    let texel_size = 1.0 / resolution;

    // 1. PAPER DISTORTION (The "Wobble")
    // Offset the read coordinate using noise.
    // This makes straight lines in the 3D scene look like hand-drawn wavy lines.

    // Scale noise by time to animate it (boiling line effect)
    let time_scale = floor(settings.time * 12.0); // 12 FPS animation for "stop motion" look settings.time is uniform
    // If settings.time isn't animating, just use static

    let noise_scale = 10.0;
    let distortion_strength = 0.003; // Strength of wobble

    let noise_val = noise(in.uv * noise_scale + vec2<f32>(settings.time));
    let uv_offset = vec2<f32>(
        noise_val - 0.5,
        noise(in.uv * noise_scale + vec2<f32>(settings.time + 10.0)) - 0.5
    ) * distortion_strength;

    let uv = in.uv + uv_offset;

    // 2. EDGE DETECTION (Sobel on Distorted UVs)
    let k = 1.0;
    let t = texel_size * k;

    // We sample LUMINANCE to detect edges
    let gx =
        -1.0 * luminance(textureSample(screen_texture, texture_sampler, uv + vec2<f32>(-t.x, -t.y)).rgb) +
        1.0 * luminance(textureSample(screen_texture, texture_sampler, uv + vec2<f32>( t.x, -t.y)).rgb) +
        -2.0 * luminance(textureSample(screen_texture, texture_sampler, uv + vec2<f32>(-t.x,  0.0)).rgb) +
        2.0 * luminance(textureSample(screen_texture, texture_sampler, uv + vec2<f32>( t.x,  0.0)).rgb) +
        -1.0 * luminance(textureSample(screen_texture, texture_sampler, uv + vec2<f32>(-t.x,  t.y)).rgb) +
        1.0 * luminance(textureSample(screen_texture, texture_sampler, uv + vec2<f32>( t.x,  t.y)).rgb);
    let gy =
        -1.0 * luminance(textureSample(screen_texture, texture_sampler, uv + vec2<f32>(-t.x, -t.y)).rgb) +
        -2.0 * luminance(textureSample(screen_texture, texture_sampler, uv + vec2<f32>( 0.0, -t.y)).rgb) +
        -1.0 * luminance(textureSample(screen_texture, texture_sampler, uv + vec2<f32>( t.x, -t.y)).rgb) +
        1.0 * luminance(textureSample(screen_texture, texture_sampler, uv + vec2<f32>(-t.x,  t.y)).rgb) +
        2.0 * luminance(textureSample(screen_texture, texture_sampler, uv + vec2<f32>( 0.0,  t.y)).rgb) +
        1.0 * luminance(textureSample(screen_texture, texture_sampler, uv + vec2<f32>( t.x,  t.y)).rgb);

    let edge = sqrt(gx * gx + gy * gy);

    // Threshold edge to get clean strokes - Lower threshold to catch faint edges (hips)
    let stroke = smoothstep(0.02, 0.2, edge);

    // 3. SHADING (Hatching)
    // Also distorted
    let scene_color = textureSample(screen_texture, texture_sampler, uv);
    let lum = luminance(scene_color.rgb);

    var hatch = 0.0;

    // Simple diagonal hatching for shadows
    // DISABLED: User requested minimal landscape without 'noise'
    // We rely on the grid texture and outlines for variance
    if (lum < -1.0) {
        let p = in.uv * resolution * 0.7; // Scale ticks
        // Diagonal
        let d = (p.x + p.y) % 12.0;
        if (d < 1.5) {
            hatch = 0.5;
        }

        // Cross hatch for pitch black areas
        if (lum < 0.05) {
            let d2 = (p.x - p.y) % 12.0;
            if (d2 < 1.5) {
                hatch += 0.5;
            }
        }
    }

    // 4. COMPOSITION (White on Black)
    var result = vec3<f32>(0.0); // Pure black background

    // Check if pixel has content (is not pure black/background)
    let has_geo = (scene_color.r > 0.01 || scene_color.g > 0.01 || scene_color.b > 0.01);

    if (has_geo) {
        // Add hatching ONLY on deepest shadows
        result = max(result, vec3<f32>(hatch));

        // Add white outlines
        result = mix(result, vec3<f32>(1.0), stroke);
    }

    return vec4<f32>(result, 1.0);
}

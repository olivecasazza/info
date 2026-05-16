use image::{ImageBuffer, Rgba};
use rand::Rng;
use std::path::Path;

const SIZE: u32 = 1024; // High res texture

#[derive(Clone, Copy)]
struct Vertex {
    angle: f32,
    r: f32,
}

#[derive(Clone)]
struct Rock {
    x: f32,
    y: f32,
    verts: Vec<Vertex>,
    max_r: f32,
    brightness: u8,
}

fn generate_rocks(count: usize) -> Vec<Rock> {
    let mut rng = rand::thread_rng();
    let mut rocks = Vec::with_capacity(count);

    // 1. Generate Parent Boulders
    let num_boulders = rng.gen_range(8..12);
    let mut boulders = Vec::new();
    for _ in 0..num_boulders {
        boulders.push((
            rng.gen_range(0.0..SIZE as f32),
            rng.gen_range(0.0..SIZE as f32),
            rng.gen_range(35.0..55.0), // Large radius
        ));
    }

    // 2. Generate Rocks (Clustered)
    for _ in 0..count {
        let (x, y, r);

        // 70% chance to scatter near a boulder
        if rng.gen_bool(0.7) {
            let boulder = boulders[rng.gen_range(0..boulders.len())];
            let angle = rng.gen_range(0.0..std::f32::consts::TAU);
            let dist = rng.gen_range(boulder.2..(boulder.2 * 2.5)); // Spawn near edge

            x = boulder.0 + angle.cos() * dist;
            y = boulder.1 + angle.sin() * dist;
            r = rng.gen_range(3.0..11.0); // Small rocks
        } else {
            // Random scatter
            x = rng.gen_range(0.0..SIZE as f32);
            y = rng.gen_range(0.0..SIZE as f32);
            r = rng.gen_range(5.0..17.0); // Medium rocks
        }

        // Wrap coordinates
        let x = (x + SIZE as f32) % SIZE as f32;
        let y = (y + SIZE as f32) % SIZE as f32;
        let x = if x < 0.0 { x + SIZE as f32 } else { x };
        let y = if y < 0.0 { y + SIZE as f32 } else { y };

        // Generate jagged vertices
        let num_verts = rng.gen_range(5..10);
        let mut verts = Vec::with_capacity(num_verts);
        for v in 0..num_verts {
            let angle = (v as f32 / num_verts as f32) * std::f32::consts::TAU;
            let variance = rng.gen_range(0.8..1.4);
            verts.push(Vertex {
                angle,
                r: r * variance,
            });
        }

        rocks.push(Rock {
            x,
            y,
            verts,
            max_r: r * 1.5,
            brightness: rng.gen_range(90..150),
        });
    }

    rocks
}

use noise::{NoiseFn, Perlin, Seedable};

fn get_rock_value(px: f32, py: f32, rocks: &[Rock]) -> u8 {
    // scale coords to nice noise frequency
    let nx = px as f64 * 0.02;
    let ny = py as f64 * 0.02;

    // Use Perlin noise for organic, non-repeating ground texture
    let perlin = Perlin::new(42);
    let n = perlin.get([nx, ny]); // -1 to 1

    // Map to 50-100 range (visible but not too bright)
    let base_noise = ((n + 1.0) * 0.5 * 50.0 + 50.0) as f32;

    // Add some higher freq detail
    let n2 = perlin.get([nx * 4.0, ny * 4.0]);
    let detail = n2 * 10.0;

    let mut final_val = (base_noise + detail as f32).clamp(0.0, 255.0) as u8;

    for rock in rocks {
        // Tiling distance check
        let mut dx = (px - rock.x).abs();
        let mut dy = (py - rock.y).abs();

        if dx > SIZE as f32 / 2.0 { dx = SIZE as f32 - dx; }
        if dy > SIZE as f32 / 2.0 { dy = SIZE as f32 - dy; }

        let dist = (dx * dx + dy * dy).sqrt();
        if dist > rock.max_r {
            continue;
        }

        // Internal roughness noise
        let roughness = ((px * 0.2).sin() + (py * 0.2).cos()) * 20.0;

        // Edge noise based on angle
        let angle = dy.atan2(dx);
        let angle_noise = (angle * 5.0 + rock.x).sin() * 5.0;

        if dist < rock.max_r - 5.0 + angle_noise {
            let mut val = rock.brightness as f32 + roughness;

            // Rim highlight
            if dist > rock.max_r - 8.0 + angle_noise {
                val += 60.0;
            }

            final_val = final_val.max(val as u8);
        }
    }

    final_val.min(255)
}

fn main() {
    println!("Generating rock texture ({}x{})...", SIZE, SIZE);

    // Reduced rock count for clearer features
    let rocks = generate_rocks(50);

    let img = ImageBuffer::from_fn(SIZE, SIZE, |x, y| {
        let val = get_rock_value(x as f32, y as f32, &rocks);
        Rgba([val, val, val, 255])
    });

    // Output is relative to CWD: wasm/spot/tools/asset-gen
    // Target: wasm/spot/assets
    let output_path = Path::new("../../assets/grid.png");
    img.save(output_path).expect("Failed to save image");
    println!("✅ Texture saved to {:?}", output_path);

    // Export rock data for terrain height generation
    let rocks_data: Vec<serde_json::Value> = rocks.iter().map(|r| {
        serde_json::json!({
            "x": r.x,
            "y": r.y,
            "r": r.max_r,
        })
    }).collect();

    let rocks_json_path = Path::new("../../assets/rocks.json");
    let file = std::fs::File::create(rocks_json_path).expect("Failed to create rocks.json");
    serde_json::to_writer(file, &rocks_data).expect("Failed to write rocks.json");

    println!("✅ Rock data saved to {:?}", rocks_json_path);
}

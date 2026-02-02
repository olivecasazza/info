// Generate a grid texture for the terrain
// Run with: node scripts/generate-grid-texture.mjs

import { join } from 'path'
import sharp from 'sharp'

const OUTPUT_PATH = join(import.meta.dirname, '../assets/grid.png')
const SIZE = 64 // Texture size in pixels

// Create raw pixel data (RGBA)
const pixels = new Uint8Array(SIZE * SIZE * 4)

const bgColor = [8, 8, 8, 255] // Very dark background
const lineColor = [100, 100, 100, 255] // Slightly brighter grid lines

for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const i = (y * SIZE + x) * 4

    // Draw grid lines at edges - 3 pixels wide (will tile seamlessly)
    const lineWidth = 3
    const isLine = x < lineWidth || y < lineWidth
    const color = isLine ? lineColor : bgColor

    pixels[i + 0] = color[0]
    pixels[i + 1] = color[1]
    pixels[i + 2] = color[2]
    pixels[i + 3] = color[3]
  }
}

// Create image with sharp
await sharp(Buffer.from(pixels), {
  raw: { width: SIZE, height: SIZE, channels: 4 }
})
  .png()
  .toFile(OUTPUT_PATH)

console.log(`✅ Grid texture saved to: ${OUTPUT_PATH}`)
console.log(`   Size: ${SIZE}x${SIZE} pixels`)

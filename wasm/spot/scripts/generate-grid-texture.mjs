// Generate a grid texture for the terrain
// Run with: node scripts/generate-grid-texture.mjs

import { join } from 'path'
import sharp from 'sharp'

const OUTPUT_PATH = join(import.meta.dirname, '../assets/grid.png')
const SIZE = 512 // Higher res for better rock details

const pixels = new Uint8Array(SIZE * SIZE * 4)

// Rock generation removed (User requested minimal landscape)

for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const i = (y * SIZE + x) * 4

    // Background: Dark Grey (to blend with void)
    let finalVal = 20

    // Add Grid Lines (Border of the tile)
    // 1 UV = 1 meter = 1 tile. So this creates a 1x1 meter grid.
    const borderWidth = 4
    if (x < borderWidth || x >= SIZE - borderWidth || y < borderWidth || y >= SIZE - borderWidth) {
      finalVal = 180 // Bright grid line
    }

    // Add Rocks on top - DISABLED ("Minimal landscape")
    // finalVal = getRockValue(x, y, rocks, finalVal)

    pixels[i + 0] = finalVal
    pixels[i + 1] = finalVal
    pixels[i + 2] = finalVal
    pixels[i + 3] = 255
  }
}

// Create image with sharp
await sharp(Buffer.from(pixels), {
  raw: { width: SIZE, height: SIZE, channels: 4 }
})
  .png()
  .toFile(OUTPUT_PATH)

// Grid texture saved

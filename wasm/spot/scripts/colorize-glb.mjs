#!/usr/bin/env node
/**
 * Colorize GLB files for the Spot robot.
 *
 * Usage: node colorize-glb.mjs
 *
 * Requires: npm install -g @gltf-transform/cli @gltf-transform/core @gltf-transform/functions
 */

import { readdirSync, existsSync, mkdirSync } from 'fs'
import { join, basename } from 'path'
import { Document, NodeIO } from '@gltf-transform/core'

const ASSETS_DIR = join(import.meta.dirname, '../assets/glb')
const OUTPUT_DIR = join(import.meta.dirname, '../assets/glb-colored')

// Boston Dynamics Spot-inspired color scheme (RGB 0-1) - Darker, richer tones
const COLORS = {
  body: [0.85, 0.65, 0.05, 1.0], // Richer yellow - main body
  chassis: [0.85, 0.65, 0.05, 1.0], // Richer yellow - chassis
  battery: [0.05, 0.05, 0.05, 1.0], // Near black
  hip: [0.05, 0.05, 0.05, 1.0], // Black - joints
  upper: [0.20, 0.22, 0.25, 1.0], // Darker gray - upper legs
  lower: [0.20, 0.22, 0.25, 1.0], // Darker gray - lower legs
  foot: [0.30, 0.32, 0.35, 1.0], // Medium gray - feet
  front: [0.85, 0.65, 0.05, 1.0], // Richer yellow - front panel
  back: [0.85, 0.65, 0.05, 1.0], // Richer yellow - back panel
  bracket: [0.70, 0.50, 0.02, 1.0], // Darker golden yellow - brackets
  servo: [0.08, 0.08, 0.10, 1.0], // Near black - servos
  default: [0.20, 0.22, 0.25, 1.0] // Darker gray
}

function getColorForFile (filename) {
  const name = filename.toLowerCase()

  if (name.includes('body') || name.includes('mainbody')) { return COLORS.body }
  if (name.includes('chassis')) { return COLORS.chassis }
  if (name.includes('battery')) { return COLORS.battery }
  if (name.includes('hip') || name.includes('shoulder')) { return COLORS.hip }
  if (name.includes('upper') || name.includes('femur')) { return COLORS.upper }
  if (name.includes('lower') || name.includes('tibia')) { return COLORS.lower }
  if (name.includes('foot')) { return COLORS.foot }
  if (name.includes('front') && !name.includes('bracket')) { return COLORS.front }
  if (name.includes('back') && !name.includes('bracket')) { return COLORS.back }
  if (name.includes('bracket')) { return COLORS.bracket }
  if (name.includes('servo')) { return COLORS.servo }

  return COLORS.default
}

async function processGlb (inputPath, outputPath) {
  const io = new NodeIO()
  const document = await io.read(inputPath)

  const filename = basename(inputPath)
  const color = getColorForFile(filename)

  // Update all materials in the document
  const root = document.getRoot()
  const materials = root.listMaterials()

  if (materials.length === 0) {
    // Create a new material if none exist
    const material = document.createMaterial('SpotMaterial')
      .setBaseColorFactor(color)
      .setMetallicFactor(0.0)
      .setRoughnessFactor(0.8)

    // Apply to all meshes
    for (const mesh of root.listMeshes()) {
      for (const primitive of mesh.listPrimitives()) {
        primitive.setMaterial(material)
      }
    }
  } else {
    // Update existing materials
    for (const material of materials) {
      material.setBaseColorFactor(color)
      material.setBaseColorTexture(null) // Remove texture
      material.setMetallicFactor(0.0)
      material.setRoughnessFactor(0.8)
    }
  }

  await io.write(outputPath, document)
  console.log(`✓ ${filename} -> ${color.slice(0, 3).map(c => c.toFixed(2)).join(', ')}`)
}

async function main () {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const files = readdirSync(ASSETS_DIR).filter(f => f.endsWith('.glb'))
  console.log(`Processing ${files.length} GLB files...\n`)

  for (const file of files) {
    const inputPath = join(ASSETS_DIR, file)
    const outputPath = join(OUTPUT_DIR, file)
    await processGlb(inputPath, outputPath)
  }

  console.log(`\n✅ Done! Colored GLB files are in: ${OUTPUT_DIR}`)
  console.log('\nTo use: mv assets/glb-colored/* assets/glb/')
}

main().catch(console.error)

#!/usr/bin/env node
/**
 * Generate procedural terrain mesh for Spot robot simulation.
 *
 * Creates a heightmap-based terrain mesh using Perlin noise.
 * Outputs a GLB file with materials baked in.
 *
 * Usage: node generate-terrain.mjs
 *
 * Requires: npm install @gltf-transform/core
 */

import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'
import { Document, NodeIO } from '@gltf-transform/core'

const OUTPUT_PATH = join(import.meta.dirname, '../assets/terrain.glb')
const GRID_TEXTURE_PATH = join(import.meta.dirname, '../assets/grid.png')

// Terrain parameters - must match physics/mod.rs exactly!
const SIZE = 20.0 // Total size in world units (20x20 meters)
const RESOLUTION = 128 // Grid resolution (reduced for WebGL2 performance)
const MAX_HEIGHT = 6.0 // Dramatic hills with accurate physics
const SEED = 42 // Random seed for reproducibility

// Perlin noise implementation (simple 2D)
function fade (t) {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function lerp (a, b, t) {
  return a + t * (b - a)
}

function grad (hash, x, y) {
  const h = hash & 3
  const u = h < 2 ? x : y
  const v = h < 2 ? y : x
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v)
}

// Simple seeded random
function seededRandom (seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Generate permutation table
function generatePerm (seed) {
  const perm = new Array(512)
  const p = new Array(256)

  for (let i = 0; i < 256; i++) {
    p[i] = i
  }

  // Shuffle using seed
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [p[i], p[j]] = [p[j], p[i]]
  }

  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255]
  }

  return perm
}

const PERM = generatePerm(SEED)

function noise2d (x, y) {
  const X = Math.floor(x) & 255
  const Y = Math.floor(y) & 255

  x -= Math.floor(x)
  y -= Math.floor(y)

  const u = fade(x)
  const v = fade(y)

  const A = PERM[X] + Y
  const B = PERM[X + 1] + Y

  return lerp(
    lerp(grad(PERM[A], x, y), grad(PERM[B], x - 1, y), u),
    lerp(grad(PERM[A + 1], x, y - 1), grad(PERM[B + 1], x - 1, y - 1), u),
    v
  )
}

// Multi-octave noise (fractal Brownian motion)
function fbm (x, y, octaves = 4, persistence = 0.5, lacunarity = 2.0) {
  let total = 0
  let amplitude = 1
  let frequency = 1
  let maxValue = 0

  for (let i = 0; i < octaves; i++) {
    total += noise2d(x * frequency, y * frequency) * amplitude
    maxValue += amplitude
    amplitude *= persistence
    frequency *= lacunarity
  }

  return total / maxValue
}

// Get height at a point with interesting features
// Must match physics/mod.rs get_terrain_height exactly!
function getHeight (x, y) {
  // Base terrain - rolling hills (lower frequency for gradual changes)
  let h = fbm(x * 0.2, y * 0.2, 4, 0.5, 2.0) * 0.5

  // Add some larger features (very low frequency)
  h += fbm(x * 0.08, y * 0.08, 2, 0.6, 2.0) * 0.35

  // Add small bumps for texture (subtle)
  h += fbm(x * 0.8, y * 0.8, 2, 0.25, 2.0) * 0.1

  // Create a flatter area in the center for the robot spawn
  const distFromCenter = Math.sqrt(x * x + y * y)
  const flattenFactor = Math.max(0, 1 - distFromCenter / 4)
  h *= (1 - flattenFactor * 0.8)

  // Normalize to [0, MAX_HEIGHT]
  return (h * 0.5 + 0.5) * MAX_HEIGHT
}

// Get color based on height (solid dark, grid rendered via gizmos)
function getColor (_height, _normalY, _worldX, _worldZ) {
  // Solid dark gray - grid lines drawn via Bevy gizmos for sharp edges
  return [0.04, 0.04, 0.04]
}

async function generateTerrain () {
  console.log('Generating terrain mesh...')

  const vertices = []
  const normals = []
  const colors = []
  const indices = []

  const step = SIZE / (RESOLUTION - 1)
  const halfSize = SIZE / 2

  // Generate heightmap first for normal calculation
  const heights = new Array(RESOLUTION)
  for (let z = 0; z < RESOLUTION; z++) {
    heights[z] = new Array(RESOLUTION)
    for (let x = 0; x < RESOLUTION; x++) {
      const worldX = x * step - halfSize
      const worldZ = z * step - halfSize
      heights[z][x] = getHeight(worldX, worldZ)
    }
  }

  // Generate vertices with normals, colors, and UVs
  const uvs = []
  for (let z = 0; z < RESOLUTION; z++) {
    for (let x = 0; x < RESOLUTION; x++) {
      const worldX = x * step - halfSize
      const worldZ = z * step - halfSize
      const height = heights[z][x]

      // Vertex position
      vertices.push(worldX, height, worldZ)

      // Calculate normal from heightmap gradient
      const left = x > 0 ? heights[z][x - 1] : height
      const right = x < RESOLUTION - 1 ? heights[z][x + 1] : height
      const up = z > 0 ? heights[z - 1][x] : height
      const down = z < RESOLUTION - 1 ? heights[z + 1][x] : height

      const nx = (left - right) / (2 * step)
      const nz = (up - down) / (2 * step)
      const ny = 1.0
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz)

      normals.push(nx / len, ny / len, nz / len)

      // Vertex color (solid dark - grid from texture)
      const color = getColor(height, ny / len, worldX, worldZ)
      colors.push(...color, 1.0) // RGBA

      // UV coordinates - 1 UV unit = 1 meter for grid texture tiling
      uvs.push(worldX, worldZ)
    }
  }

  // Generate indices (triangles)
  for (let z = 0; z < RESOLUTION - 1; z++) {
    for (let x = 0; x < RESOLUTION - 1; x++) {
      const i = z * RESOLUTION + x

      // Two triangles per quad
      indices.push(i, i + RESOLUTION, i + 1)
      indices.push(i + 1, i + RESOLUTION, i + RESOLUTION + 1)
    }
  }

  console.log(`  Vertices: ${vertices.length / 3}`)
  console.log(`  Triangles: ${indices.length / 3}`)

  // Create GLTF document
  const document = new Document()

  // Create a buffer to hold all vertex data
  const buffer = document.createBuffer('TerrainBuffer')

  // Create buffer for vertex data
  const positionArray = new Float32Array(vertices)
  const normalArray = new Float32Array(normals)
  const colorArray = new Float32Array(colors)
  const uvArray = new Float32Array(uvs)
  const indexArray = new Uint16Array(indices)

  const positionAccessor = document.createAccessor('position')
    .setType('VEC3')
    .setArray(positionArray)
    .setBuffer(buffer)

  const normalAccessor = document.createAccessor('normal')
    .setType('VEC3')
    .setArray(normalArray)
    .setBuffer(buffer)

  const colorAccessor = document.createAccessor('color')
    .setType('VEC4')
    .setArray(colorArray)
    .setBuffer(buffer)

  const uvAccessor = document.createAccessor('texcoord')
    .setType('VEC2')
    .setArray(uvArray)
    .setBuffer(buffer)

  const indexAccessor = document.createAccessor('indices')
    .setType('SCALAR')
    .setArray(indexArray)
    .setBuffer(buffer)

  // Load grid texture
  const gridTextureData = readFileSync(GRID_TEXTURE_PATH)
  const gridTexture = document.createTexture('GridTexture')
    .setMimeType('image/png')
    .setImage(gridTextureData)

  // Create material with grid texture
  const material = document.createMaterial('TerrainMaterial')
    .setBaseColorTexture(gridTexture)
    .setMetallicFactor(0.0)
    .setRoughnessFactor(0.9)

  // Create mesh
  const primitive = document.createPrimitive()
    .setIndices(indexAccessor)
    .setAttribute('POSITION', positionAccessor)
    .setAttribute('NORMAL', normalAccessor)
    .setAttribute('COLOR_0', colorAccessor)
    .setAttribute('TEXCOORD_0', uvAccessor)
    .setMaterial(material)

  const mesh = document.createMesh('Terrain')
    .addPrimitive(primitive)

  // Create node
  const node = document.createNode('TerrainNode')
    .setMesh(mesh)

  // Create scene
  const scene = document.createScene('TerrainScene')
    .addChild(node)

  document.getRoot().setDefaultScene(scene)

  // Write to file
  const io = new NodeIO()
  await io.write(OUTPUT_PATH, document)

  console.log(`\n✅ Terrain saved to: ${OUTPUT_PATH}`)
  console.log(`   Size: ${SIZE}x${SIZE} meters`)
  console.log(`   Max height: ${MAX_HEIGHT} meters`)

  // Also output heightmap data for physics
  const heightmapPath = OUTPUT_PATH.replace('.glb', '.json')
  const heightmapData = {
    size: SIZE,
    resolution: RESOLUTION,
    maxHeight: MAX_HEIGHT,
    heights: heights.flat()
  }
  writeFileSync(heightmapPath, JSON.stringify(heightmapData))
  console.log(`   Heightmap: ${heightmapPath}`)
}

generateTerrain().catch(console.error)

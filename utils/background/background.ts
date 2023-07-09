import type { ColorRepresentation } from 'three'
import { generateUUID } from 'three/src/math/MathUtils'
import { truncate } from '../numbers'
import { generateRandomColor, randomFromRange, randomIntFromRange } from '../random'
import { BirdConfig } from '~/wasm/flock/pkg/flock'

export interface IBirdConfig {
  id: string;
  probability: number;
  neighborDistance: number;
  desiredSeparation: number;
  separationMultiplier: number;
  alignmentMultiplier: number;
  cohesionMultiplier: number;
  maxSpeed: number;
  maxForce: number;
  birdSize: number;
  birdColor: ColorRepresentation;
  wasmObject?: BirdConfig;
}

export const DEFAULT_BIRD_ID = 'default'

// todo: choose flock size based on screen size
export const MAX_FLOCK_SIZE = 1200
export function generateBirdId () {
  return truncate(generateUUID(), 8)
}

export function generateRandomBirdConfig (): IBirdConfig {
  return {
    id: generateBirdId(),
    probability: randomIntFromRange(25, 75),
    neighborDistance: randomIntFromRange(0, 50),
    desiredSeparation: randomIntFromRange(50, 250),
    separationMultiplier: randomFromRange(0.001, 1.2),
    alignmentMultiplier: randomFromRange(0.001, 1.2),
    cohesionMultiplier: randomFromRange(0.001, 1.2),
    maxForce: randomFromRange(0.001, 0.5),
    maxSpeed: randomFromRange(0.001, 10),
    birdColor: '#' + generateRandomColor().getHexString(),
    birdSize: randomFromRange(3, 15),
    wasmObject: undefined
  }
}

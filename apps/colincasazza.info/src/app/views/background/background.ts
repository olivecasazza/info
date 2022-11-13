import { truncate } from '@app/utils/numbers';
import type { ColorRepresentation } from 'three';
import { generateUUID } from 'three/src/math/MathUtils';
import type { BirdConfig } from '@libs/flock';

export interface IBirdConfig {
  id: string;
  weight: number;
  neighborDistance: number;
  desiredSeparation: number;
  separationMultiplier: number;
  alignmentMultiplier: number;
  cohesionMultiplier: number;
  maxSpeed: number;
  maxForce: number;
  birdSize: number;
  birdColor: ColorRepresentation;
  wasmObject: BirdConfig;
}

export const DEFAULT_BIRD_ID = 'default';

// todo: choose flock size based on screen size
export const MAX_FLOCK_SIZE = 500;
export function generateBirdId() {
  return truncate(generateUUID(), 8);
}

import { Color } from 'three'

export function randomFromRange (min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function randomIntFromRange (min: number, max: number) {
  return Math.round(randomFromRange(min, max))
}

export function generateRandomColor () {
  const r = randomFromRange(0, 1)
  const g = randomFromRange(0, 1)
  const b = randomFromRange(0, 1)
  return new Color(r, g, b)
}

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

export type IWeightedArray<T extends { probability: number }> = Array<T>

export function selectRandomFromWeightedArray<T extends {probability: number}> (array: IWeightedArray<T>) {
  let i
  let pickedValue
  const randomNr = Math.random()
  let threshold = 0
  for (i = 0; i < array.length; i++) {
    if (array[i].probability === -1) {
      continue
    }
    threshold += array[i].probability
    if (threshold > randomNr) {
      pickedValue = array[i]
      break
    }
  }
  if (!pickedValue) {
    // nothing found based on probability value, so pick element marked with wildcard
    pickedValue = array.find(value => value.probability === -1)
    if (!pickedValue) { throw new Error('weighted array has no default value.') }
  }
  return pickedValue
}

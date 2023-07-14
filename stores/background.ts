import { defineStore } from 'pinia'
import { Color } from 'three'
import { animate, interpolate } from 'popmotion'
import initFlock, { BirdConfig, Flock } from '~/wasm/flock/pkg/flock'

import { themeColors } from '~/tailwind/colors'
import {
  DEFAULT_BIRD_ID,
  IBirdConfig,
  MAX_FLOCK_SIZE, generateBirdId, generateRandomBirdConfig
} from '~/utils/background/background'

export const useBackgroundStore = defineStore('background', () => {
  const birdConfigs = ref(new Map<string, IBirdConfig>())
  const isDragging = ref(false)
  const isReady = ref(false)
  const updating = ref(false)
  const timeStep = ref(1.0)
  const maxFlockSize = ref(MAX_FLOCK_SIZE)
  const flock: Ref<Flock> = ref({} as Flock)

  async function init (): Promise<void> {
    await initFlock()
    flock.value = new Flock(
      // todo: determine number birds to add based on screen size and performance
      // const n = (view.value.viewPort.width * view.value.viewPort.height) / 500;
      maxFlockSize.value,
      BigInt(new Date().getUTCMilliseconds())
    )
    addOrUpdateBirdConfig({
      id: generateBirdId(),
      probability: 20,
      neighborDistance: 30,
      desiredSeparation: 40,
      separationMultiplier: 0.3,
      alignmentMultiplier: 0.01,
      cohesionMultiplier: 0.01,
      maxSpeed: 7,
      maxForce: 0.7,
      birdSize: 10,
      birdColor: themeColors.secondary[400]
    } as IBirdConfig)
    addOrUpdateBirdConfig({
      id: DEFAULT_BIRD_ID,
      probability: 80,
      neighborDistance: 40,
      desiredSeparation: 25,
      separationMultiplier: 0.5,
      alignmentMultiplier: 0.5,
      cohesionMultiplier: 0.3,
      maxSpeed: 5,
      maxForce: 0.33,
      birdSize: 12,
      birdColor: themeColors.primary[500]
    } as IBirdConfig)
    isReady.value = true
  }

  function dispose () {
    birdConfigs.value.forEach((birdConfig) => {
      if (birdConfig) { birdConfig.wasmObject?.free() }
    })
    flock.value?.free()
  }

  function updateMaxFlockSize (size: number) {
    if (!flock.value) { return }
    flock.value.max_flock_size = size
  }

  function addOrUpdateBirdConfig (
    params: IBirdConfig
  ) {
    if (!flock.value) {
      throw new Error(
        "[background.vuex] cannot add config, flock doesn't exist."
      )
    }
    const color = new Color(params.birdColor)
    params.wasmObject = BirdConfig.new(
      params.id,
      params.probability,
      params.neighborDistance,
      params.desiredSeparation,
      params.separationMultiplier,
      params.alignmentMultiplier,
      params.cohesionMultiplier,
      params.maxSpeed,
      params.maxForce,
      params.birdSize,
      color.r,
      color.g,
      color.b
    )
    if (!params.wasmObject) { throw new Error('wasm object could not be generated for bird config') }
    birdConfigs.value.set(params.id, params)
    flock.value.insert_bird_config(params.id, params.wasmObject)
  }

  function removeBirdConfig (configIdToRemove: string) {
    if (!flock.value) {
      throw new Error(
        "[background.vuex] cannot remove config, flock doesn't exist."
      )
    }
    const config = birdConfigs.value.get(configIdToRemove)
    if (!config) {
      throw new Error(
        '[background.vuex] cannot remove config, cannot find matching config.'
      )
    }
    flock.value.remove_bird_config(configIdToRemove)
    birdConfigs.value.delete(configIdToRemove)
  }
  function updateFlock (props: {
    sceneWidth: number;
    sceneHeight: number;
    timeStep: number;
    updateFlockGeometryCallback: (
      vertices: Float32Array,
      colors: Float32Array
    ) => void;
  }) {
    if (!flock.value) { return }
    flock.value.update(
      props.sceneWidth,
      props.sceneHeight,
      props.timeStep ? props.timeStep : timeStep.value,
      props.updateFlockGeometryCallback
    )
  }

  function addBirdAtRandomPosition (props: {
    viewWidth: number;
    viewHeight: number;
  }) {
    if (!flock.value) { return }
    const config = weightedRandom([...birdConfigs.value.values()])
    flock.value.add_bird_at_random_position(
      config.id,
      props.viewWidth,
      props.viewHeight
    )
  }

  function addBirdAtPosition (props: {
    x: number;
    y: number;
  }) {
    if (!flock.value) { return }
    const config = weightedRandom([...birdConfigs.value.values()])
    flock.value.add_bird(config.id, props.x, props.y)
  }

  function cycleAnimateBirdConfigs () {
    birdConfigs.value.forEach((birdConfig) => {
      const newBirdConfigTarget = {
        ...generateRandomBirdConfig(),
        id: birdConfig.id
      }
      const mapNeighborDistance = interpolate([0, 10000], [birdConfig.neighborDistance, newBirdConfigTarget.neighborDistance])
      const mapDesiredSeparation = interpolate([0, 10000], [birdConfig.desiredSeparation, newBirdConfigTarget.desiredSeparation])
      const mapSeparationMultiplier = interpolate([0, 10000], [birdConfig.separationMultiplier, newBirdConfigTarget.separationMultiplier])
      const mapAlignmentMultiplier = interpolate([0, 10000], [birdConfig.alignmentMultiplier, newBirdConfigTarget.alignmentMultiplier])
      const mapCohesionMultiplier = interpolate([0, 10000], [birdConfig.cohesionMultiplier, newBirdConfigTarget.cohesionMultiplier])
      const mapMaxForce = interpolate([0, 10000], [birdConfig.maxForce, newBirdConfigTarget.maxForce])
      const mapMaxSpeed = interpolate([0, 10000], [birdConfig.maxSpeed, newBirdConfigTarget.maxSpeed])
      const mapBirdColor = interpolate([0, 10000], [birdConfig.birdColor, newBirdConfigTarget.birdColor])
      animate({
        from: 0,
        to: 10000,
        duration: 1000 * 2,
        onUpdate: (latest) => {
          addOrUpdateBirdConfig({
            ...birdConfig,
            neighborDistance: mapNeighborDistance(latest),
            desiredSeparation: mapDesiredSeparation(latest),
            separationMultiplier: mapSeparationMultiplier(latest),
            alignmentMultiplier: mapAlignmentMultiplier(latest),
            cohesionMultiplier: mapCohesionMultiplier(latest),
            maxForce: mapMaxForce(latest),
            maxSpeed: mapMaxSpeed(latest),
            birdColor: mapBirdColor(latest)
          })
        }
      })
    })
  }

  return {
    birdConfigs,
    isDragging,
    isReady,
    updating,
    timeStep,
    maxFlockSize,
    updateMaxFlockSize,
    flock,
    init,
    dispose,
    addOrUpdateBirdConfig,
    removeBirdConfig,
    updateFlock,
    addBirdAtRandomPosition,
    addBirdAtPosition,
    cycleAnimateBirdConfigs
  }
})

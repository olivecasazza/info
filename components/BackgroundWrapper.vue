<template>
  <ViewPortComponent
    v-if="view"
    class="w-full h-full"
    :view="view"
    @mousedown="isDragging = true"
    @mouseup="isDragging = false"
    @mousemove="mouseMove"
    @touchmove="touchMove"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  LineBasicMaterial,
  LineSegments,
  Vector3
} from 'three'
import { lerp } from 'three/src/math/MathUtils'
import { animate } from 'popmotion'
import { useBackgroundStore } from '~/stores/background'
import { View } from '~/utils/renderer/view'

const backgroundStore = useBackgroundStore()
const { init, dispose, addBirdAtRandomPosition, addBirdAtPosition } =
  backgroundStore
const { isDragging, maxFlockSize, flock } =
  storeToRefs(backgroundStore)

let addBirdsToFlockInterval: NodeJS.Timer
// variables for rendering flock
const view = ref(null as View | null)
const birdsGeometry = ref(null as BufferGeometry | null)
const birdsMaterial = ref(null as LineBasicMaterial | null)
const birdsLine = ref(null as LineSegments | null)

onMounted(async () => {
  // variables for rendering flock
  view.value = new View({
    cameraOptions: {
      fov: 75,
      near: 0.1,
      far: 1200,
      startingPosition: new Vector3(0, 0, 1000)
    },
    controlsOptions: {
      startDirection: new Vector3(0, 0, 0),
      enabled: false
    },
    id: 'BACKGROUND_VIEW',
    background: new Color('black'),
    renderTickCallback
  })

  birdsGeometry.value = new BufferGeometry()
  birdsMaterial.value = new LineBasicMaterial({
    vertexColors: true
  })
  birdsLine.value = new LineSegments(birdsGeometry.value, birdsMaterial.value)
  view.value.scene.add(birdsLine.value)

  await init()
  const s = animate({
    from: 0,
    to: 100,
    duration: 1000 * 10,
    onUpdate: function () {
      if (flock.value && flock.value.current_flock_size > maxFlockSize.value) { s.stop() }
      if (view.value) {
        addBirdAtRandomPosition({
          viewWidth: view.value.visibleWidthAtZDepth,
          viewHeight: view.value.visibleHeightAtZDepth
        })
      }
    }
  })

  window.addEventListener('touchstart', throttle(touchMove, 40), false)
  window.addEventListener('touchmove', throttle(touchMove, 40), false)
  window.addEventListener('mousedown', () => (isDragging.value = true), false)
  window.addEventListener('mousemove', throttle(mouseMove, 40), false)
  window.addEventListener('mouseup', () => (isDragging.value = false), false)
})

onUnmounted(() => {
  /** remove all the random event listeners weve added */
  window.removeEventListener('touchstart', throttle(touchMove, 40), false)
  window.removeEventListener('touchmove', throttle(touchMove, 40), false)
  window.removeEventListener('mousedown', () => (isDragging.value = true), false)
  window.removeEventListener('mousemove', throttle(mouseMove, 40), false)
  window.removeEventListener('mouseup', () => (isDragging.value = false), false)
  clearInterval(addBirdsToFlockInterval as NodeJS.Timer)
  /** make sure we clean up the wasm resources
  can we write this into the flock free function */
  dispose()
})

function updateFlockGeometry (vertices: Float32Array, colors: Float32Array) {
  if (!birdsLine.value) {
    return
  }
  birdsLine.value.geometry.setAttribute(
    'position',
    new BufferAttribute(vertices, 3)
  )
  birdsLine.value.geometry.setAttribute(
    'color',
    new BufferAttribute(colors, 3)
  )
}

function renderTickCallback (_: View) {
  const backgroundStore = useBackgroundStore()
  const { isReady, updateFlock, timeStep } = backgroundStore
  if (!isReady || !view.value) {
    return
  }
  updateFlock({
    sceneWidth: view.value.visibleWidthAtZDepth,
    sceneHeight: view.value.visibleHeightAtZDepth,
    timeStep,
    updateFlockGeometryCallback: updateFlockGeometry
  })
}

function mouseMove (event: MouseEvent) {
  if (!isDragging) { return }
  addBirdFromEvent(event.x, event.y)
}

function touchMove (event: TouchEvent) {
  const touch = event.touches.item(event.touches.length - 1)
  if (!touch) { return }
  addBirdFromEvent(touch.clientX, touch.clientY)
}

function addBirdFromEvent (eventX: number, eventY: number) {
  if (!view.value) { return }
  const normClickX = eventX / view.value.viewPort.width
  const normClickY = eventY / view.value.viewPort.height
  const halfSceneWidth = view.value.visibleWidthAtZDepth / 2
  const halfSceneHeight = view.value.visibleHeightAtZDepth / 2
  const x = lerp(-halfSceneWidth, halfSceneWidth, normClickX)
  const y = -lerp(-halfSceneHeight, halfSceneHeight, normClickY)
  addBirdAtPosition({ x, y })
}
</script>

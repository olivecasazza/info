<template>
  <canvas
    ref="canvasElement"
    class="absolute w-full h-full"
    @mousedown="isDragging = true"
    @mouseup="isDragging = false"
    @mousemove="mouseMove"
    @touchmove="touchMove"
  />
  <div
    v-if="!(useRoute().path == '/projects/flock')"
    class="absolute left-0 top-0 w-full h-full bg-black bg-opacity-60 z-10"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { animate } from 'popmotion'
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { lerp } from 'three/src/math/MathUtils'
import { useFlockStore } from '~/stores/flock'

const backgroundStore = useFlockStore()
const { init, dispose, addBirdAtRandomPosition, addBirdAtPosition, cycleAnimateBirdConfigs } =
  backgroundStore
const { isDragging, maxFlockSize, flock } =
  storeToRefs(backgroundStore)

const stopped = ref(false)
const renderer = ref(null as WebGLRenderer | null)
const canvasElement: Ref<HTMLCanvasElement | undefined> = ref()
const scene = ref(new Scene())
const camera = ref(new PerspectiveCamera())
const controls = ref(null as OrbitControls | null)
const birdsGeometry = ref(null as BufferGeometry | null)
const birdsMaterial = ref(null as LineBasicMaterial | null)
const birdsLine = ref(null as LineSegments | null)

const visibleHeightAtZDepth = computed(() => {
  // compensate for cameras not positioned at z=0
  const depth = camera.value.position.z
  // vertical fov in radians
  const vFOV = (camera.value.fov * Math.PI) / 180
  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2.0) * Math.abs(depth)
})
const visibleWidthAtZDepth = computed(() => {
  const visibleHeight = visibleHeightAtZDepth.value
  return visibleHeight * (width.value / height.value)
})

const height = computed(() => {
  return window.innerHeight ?? 0
})

const width = computed(() => {
  return window.innerWidth ?? 0
})

onMounted(async () => {
  renderer.value = new WebGLRenderer({ canvas: canvasElement.value })
  camera.value = new PerspectiveCamera(75, (width.value / height.value), 0.1, 10000)
  camera.value.position.z = 1000
  controls.value = new OrbitControls(camera.value, canvasElement.value)
  controls.value.target = new Vector3(0, 0, 0)
  scene.value.background = new Color('black')
  birdsGeometry.value = new BufferGeometry()
  // birdsGeometry.value.toNonIndexed()

  birdsMaterial.value = new LineBasicMaterial({
    vertexColors: true
  })

  camera.value.aspect = width.value / height.value
  birdsLine.value = new LineSegments(birdsGeometry.value, birdsMaterial.value)
  scene.value.add(birdsLine.value)

  await init()

  animate({
    from: 0,
    to: maxFlockSize.value,
    duration: 1000 * 2,
    onUpdate: () => {
      if (flock.value && flock.value.current_flock_size > maxFlockSize.value) { return }
      addBirdAtRandomPosition({
        viewWidth: visibleWidthAtZDepth.value,
        viewHeight: visibleHeightAtZDepth.value
      })
    },
    onComplete: () => animate({
      from: 0,
      to: 100,
      duration: 1000 * 10,
      repeat: Infinity,
      onRepeat: cycleAnimateBirdConfigs
    })
  })

  window.addEventListener('resize', resize)
  window.addEventListener('touchstart', throttle(touchMove, 40), false)
  window.addEventListener('touchmove', throttle(touchMove, 40), false)
  window.addEventListener('mousedown', () => (isDragging.value = true), false)
  window.addEventListener('mousemove', throttle(mouseMove, 40), false)
  window.addEventListener('mouseup', () => (isDragging.value = false), false)

  render()
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  window.removeEventListener('touchstart', throttle(touchMove, 40), false)
  window.removeEventListener('touchmove', throttle(touchMove, 40), false)
  window.removeEventListener('mousedown', () => (isDragging.value = true), false)
  window.removeEventListener('mousemove', throttle(mouseMove, 40), false)
  window.removeEventListener('mouseup', () => (isDragging.value = false), false)
  dispose()
})

function resize (): void {
  // first resize the renderer root viewport
  if (!renderer.value) { return }
  const { innerWidth: width, innerHeight: height } = window
  renderer.value.setSize(width, height, true)
  camera.value.aspect = width / height
}
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

function start (): void {
  stopped.value = false
  render()
}

function render (): void {
  resize()
  requestAnimationFrame(() => start())
  const flockStore = useFlockStore()
  const { updateFlock, timeStep } = flockStore
  updateFlock({
    sceneWidth: visibleWidthAtZDepth.value,
    sceneHeight: visibleHeightAtZDepth.value,
    timeStep,
    updateFlockGeometryCallback: updateFlockGeometry
  })
  renderer.value?.render(toRaw(scene.value), camera.value)
  camera.value.updateProjectionMatrix()
  controls.value?.update()
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
  const { innerWidth: width, innerHeight: height } = window
  const normClickX = eventX / width
  const normClickY = eventY / height
  const halfSceneWidth = visibleWidthAtZDepth.value / 2
  const halfSceneHeight = visibleHeightAtZDepth.value / 2
  const x = lerp(-halfSceneWidth, halfSceneWidth, normClickX)
  const y = -lerp(-halfSceneHeight, halfSceneHeight, normClickY)
  addBirdAtPosition({ x, y })
}
</script>

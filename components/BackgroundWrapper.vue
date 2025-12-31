<template>
  <canvas
    ref="canvasElement"
    class="absolute w-full h-full touch-none"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointermove="onPointerMove"
  />

  <!-- Dark overlay for readability on non-project pages -->
  <div
    v-if="!isWasmProjectRoute"
    class="absolute left-0 top-0 w-full h-full bg-black bg-opacity-60 z-10"
  />
</template>

<script setup lang="ts">
import throttle from '~/utils/throttle'
import {
  WASM_PROJECTS,
  getWasmProjectSlugFromRoutePath,
  isWasmProjectRoutePath
} from '~/utils/wasmProjects'

type AnyWebHandle = {
  start: (canvas: HTMLCanvasElement) => Promise<unknown>
  destroy: () => void
  spawn_at_norm: (xNorm: number, yNorm: number) => void
  set_ui_visible: (visible: boolean) => void
  is_pointer_over_ui: () => boolean
}

type WasmModule = {
  default: () => Promise<unknown>
  WebHandle: new () => AnyWebHandle
}

const moduleCache = new Map<string, Promise<WasmModule>>()
let loadSeq = 0

const route = useRoute()

const canvasElement: Ref<HTMLCanvasElement | undefined> = ref()
const handle = ref<AnyWebHandle | null>(null)
const loadedSlug = ref<string | null>(null)
const isDragging = ref(false)

const isWasmProjectRoute = computed(() => isWasmProjectRoutePath(route.path))
const forcedSlug = computed(() => getWasmProjectSlugFromRoutePath(route.path))

function pickRandomBackgroundSlug (): string {
  // Exclude any project-specific routes from randomness by selecting from registry.
  const options = WASM_PROJECTS.map(p => p.slug)
  return options[Math.floor(Math.random() * options.length)]
}

const backgroundSlug = ref<string>(pickRandomBackgroundSlug())

const desiredSlug = computed(() => {
  // On /projects/<slug>, force that slug.
  if (forcedSlug.value) { return forcedSlug.value }
  // Otherwise use the random background slug.
  return backgroundSlug.value
})

function isUiVisibleForSlug (slug: string, path: string): boolean {
  return path === `/projects/${slug}`
}

async function loadWasmProject (slug: string): Promise<void> {
  // If already loaded, never reload; just update UI visibility.
  if (loadedSlug.value === slug && handle.value) {
    handle.value.set_ui_visible(isUiVisibleForSlug(slug, route.path))
    return
  }

  const mySeq = ++loadSeq

  // Tear down existing project (if any) before loading the next.
  if (handle.value) {
    handle.value.destroy()
    handle.value = null
    loadedSlug.value = null
  }

  const def = WASM_PROJECTS.find(p => p.slug === slug) ?? WASM_PROJECTS[0]
  if (!def) { throw new Error('No WASM projects registered') }

  // Cache the module + init so we don't re-fetch/re-init repeatedly.
  if (!moduleCache.has(def.slug)) {
    moduleCache.set(def.slug, (async () => {
      const mod = await def.loader() as unknown as WasmModule
      await mod.default()
      return mod
    })())
  }

  const mod = await moduleCache.get(def.slug)!

  // If another route change happened while we were loading, abort.
  if (mySeq !== loadSeq) {
    return
  }

  const newHandle = new mod.WebHandle()
  handle.value = newHandle
  loadedSlug.value = def.slug

  if (!canvasElement.value) { return }

  await newHandle.start(canvasElement.value)

  // If another route change happened during start(), abort and cleanup.
  if (mySeq !== loadSeq) {
    try { newHandle.destroy() } catch {}
    if (handle.value === newHandle) {
      handle.value = null
      loadedSlug.value = null
    }
    return
  }

  newHandle.set_ui_visible(isUiVisibleForSlug(def.slug, route.path))
}

function spawnFromEvent (clientX: number, clientY: number) {
  if (!handle.value || !canvasElement.value) { return }
  const rect = canvasElement.value.getBoundingClientRect()
  const xNorm = (clientX - rect.left) / rect.width
  const yNorm = (clientY - rect.top) / rect.height
  handle.value.spawn_at_norm(xNorm, yNorm)
}

const throttledSpawn = throttle((x: number, y: number) => spawnFromEvent(x, y), 40)

function onPointerDown (e: PointerEvent) {
  // If the user is interacting with egui UI, don't spawn birds.
  if (handle.value?.is_pointer_over_ui()) { return }

  isDragging.value = true
  spawnFromEvent(e.clientX, e.clientY)
}

function onPointerUp () {
  isDragging.value = false
}

function onPointerMove (e: PointerEvent) {
  if (!isDragging.value) { return }
  if (handle.value?.is_pointer_over_ui()) { return }
  throttledSpawn(e.clientX, e.clientY)
}

onMounted(async () => {
  await loadWasmProject(desiredSlug.value)
})

// Critical: keep UI + loaded wasm project in sync on client-side navigation.
watch(
  () => route.path,
  async (newPath, oldPath) => {
    // If we navigated into a project route, keep it as the "background" when leaving.
    // This prevents unnecessary teardown/recreate loops (and feels nicer UX-wise).
    const forced = forcedSlug.value
    if (forced && newPath !== oldPath) {
      backgroundSlug.value = forced
    }

    await loadWasmProject(desiredSlug.value)
  }
)

onUnmounted(() => {
  handle.value?.destroy()
  handle.value = null
  loadedSlug.value = null
})
</script>

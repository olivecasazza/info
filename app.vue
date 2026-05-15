<template>
  <div class="w-screen h-screen">
    <ClientOnly>
      <BackgroundWrapper />
    </ClientOnly>

    <!--
      This wrapper sits above the canvas.
      On /src/<wasm-project> we disable pointer events on the wrapper so clicks go to the canvas (egui + spawning),
      but we keep the NavBar interactive.
    -->
    <div class="z-20 fullscreen flex flex-col overflow-scroll pointer-events-none p-2">
      <!--
        On /src/<wasm-project> we want the canvas to be fully interactive.
        Keep the page content hidden but in layout so the NavBar stays bottom.
        On /spot we show the page content (sidebar overlay) but still have wasm fullscreen.
      -->
      <NuxtPage
        :class="[
          'flex-grow overflow-y-scroll',
          isWasmFullscreenRoute ? 'hidden' : 'pointer-events-auto'
        ]"
      />

      <!-- Keep NavBar interactive everywhere; hide it on /spot (has its own nav) -->
      <NavBar v-if="!isSpotRoute" class="h-fit z-50 pointer-events-auto mt-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { isWasmFullscreenRoutePath } from '~/utils/wasmProjects'

const route = useRoute()

const isWasmFullscreenRoute = computed(() => isWasmFullscreenRoutePath(route.path))
const isSpotRoute = computed(() => route.path === '/spot' || route.path === '/spot/')
</script>

<style>
.fullscreen {
  @apply absolute h-full w-full;
}

.html, body {
  font-family: 'Courier New', Courier, monospace;
  @apply bg-black text-sm text-gray-300 w-screen h-screen overflow-hidden;
}
</style>

<template>
  <div class="w-screen h-screen">
    <BackgroundWrapper />

    <!--
      This wrapper sits above the canvas.
      On /projects/<wasm-project> we disable pointer events on the wrapper so clicks go to the canvas (egui + spawning),
      but we keep the NavBar interactive.
    -->
    <div class="z-20 fullscreen flex flex-col overflow-scroll pointer-events-none p-2">
      <!--
        On /projects/<wasm-project> we want the canvas to be fully interactive.
        Keep the page content hidden but in layout so the NavBar stays bottom.
      -->
      <NuxtPage
        :class="[
          'flex-grow overflow-y-scroll',
          isWasmProjectRoute ? 'hidden' : 'pointer-events-auto'
        ]"
      />

      <!-- Keep NavBar interactive everywhere -->
      <NavBar class="h-fit z-50 pointer-events-auto mt-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { isWasmProjectRoutePath } from '~/utils/wasmProjects'

const route = useRoute()

const isWasmProjectRoute = computed(() => isWasmProjectRoutePath(route.path))
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

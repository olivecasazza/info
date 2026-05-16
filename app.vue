<template>
  <div class="w-screen h-screen">
    <ClientOnly>
      <BackgroundWrapper />
    </ClientOnly>

    <!--
      On /src/<wasm-project> we want the canvas to be fully interactive.
      Keep the page content hidden but in layout so the NavBar stays bottom.
    -->
    <div class="z-20 fullscreen flex flex-col overflow-scroll pointer-events-none p-2">
      <NuxtPage
        :class="[
          'flex-grow overflow-y-scroll',
          isWasmFullscreenRoute ? 'hidden' : 'pointer-events-auto'
        ]"
      />

      <NavBar class="h-fit z-50 pointer-events-auto mt-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { isWasmFullscreenRoutePath } from '~/utils/wasmProjects'

const route = useRoute()

const isWasmFullscreenRoute = computed(() => isWasmFullscreenRoutePath(route.path))
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

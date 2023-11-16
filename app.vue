<template>
  <div class="w-full h-full">
    <!-- <LazyRendererRootViewPortComponent class="z-1 fullscreen" /> -->
    <!-- <LazyBackgroundWrapper class="z-2 fullscreen" /> -->
    <div class="z-10 fullscreen flex flex-col overflow-scroll">
      <LazyNuxtPage class="flex-grow overflow-y-scroll" />
      <LazyNavBar class="h-fit" />
    </div>
  </div>
</template>

<style>
.fullscreen {
  @apply absolute h-full w-full;
}

.html, body {
  font-family: 'Courier New', Courier, monospace;
  @apply bg-black text-sm text-gray-300 w-screen h-screen overflow-hidden;
}
</style>

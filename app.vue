<template>
  <div class="w-full h-full">
    <RendererRootViewPortComponent class="z-1 fullscreen" />
    <BackgroundWrapper class="z-2 fullscreen" />
    <div class="z-10 fullscreen flex flex-col overflow-scroll">
      <NuxtPage class="flex-grow overflow-y-scroll" />
      <NavBar class="h-fit" />
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

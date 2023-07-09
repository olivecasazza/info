<template>
  <div class="min-h-screen flex flex-col h-screen">
    <RendererRootViewPortComponent class="z-1 absolute h-full w-full" />
    <BackgroundWrapper class="z-2 absolute h-full w-full" />
    <div class="z-10 flex-grow flex flex-col overflow-scroll">
      <NuxtPage class="flex-grow overflow-y-scroll" />
      <NavBar />
    </div>
  </div>
</template>

<style>
.html, body {
  font-family: 'Courier New', Courier, monospace;
  @apply bg-black text-sm text-gray-300 w-screen h-screen overflow-hidden;
}
</style>

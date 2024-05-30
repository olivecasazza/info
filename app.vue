<template>
  <div class="w-screen h-screen">
    <BackgroundWrapper />
    <div class="z-20 fullscreen flex flex-col overflow-scroll">
      <NuxtPage class="flex-grow overflow-y-scroll" />
      <NavBar class="h-fit z-50" />
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

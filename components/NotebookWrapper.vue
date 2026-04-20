<template>
  <div class="w-full h-full flex flex-col items-center justify-center">
    <div class="w-11/12 flex items-baseline justify-between text-xs text-gray-500 pb-1">
      <span v-if="title" class="truncate">{{ title }}</span>
      <span v-else />
      <span class="flex gap-3">
        <a v-if="sourceUrl" :href="sourceUrl" target="_blank" rel="noopener" class="link">source ↳</a>
        <a :href="notebookPath" target="_blank" rel="noopener" class="link">open in new tab ↗</a>
      </span>
    </div>
    <div class="w-11/12 h-5/6 relative border border-gray-600">
      <div
        v-if="!loaded && !errored"
        class="absolute inset-0 z-10 flex items-center justify-center bg-black/80 rainbow-text-animated text-sm"
      >
        loading…
      </div>
      <div
        v-if="errored"
        class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 text-sm text-gray-300 gap-2"
      >
        <span class="text-primary-300">failed to load notebook.</span>
        <a :href="notebookPath" target="_blank" rel="noopener" class="link">open in new tab ↗</a>
      </div>
      <iframe
        :src="notebookPath"
        sandbox="allow-same-origin allow-scripts"
        class="w-full h-full block bg-black"
        @load="loaded = true"
        @error="errored = true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  notebookPath: string
  title?: string
  sourceUrl?: string
}>()
const loaded = ref(false)
const errored = ref(false)
</script>

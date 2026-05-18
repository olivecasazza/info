<template>
  <div class="fixed inset-0 w-full h-full z-[100] bg-zinc-950 flex flex-col">
    <!-- Compact top bar for navigation while maximizing notebook space -->
    <header class="flex items-center justify-between px-4 py-2 bg-zinc-950 border-b border-zinc-800 text-sm">
      <div class="flex items-center gap-3">
        <NuxtLink to="/" class="text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </NuxtLink>
        <span class="text-zinc-700">|</span>
        <span class="font-medium text-zinc-300">{{ title || 'Notebook' }}</span>
        <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-2" v-if="!errored && loaded" />
        <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ml-2" v-else-if="!errored && !loaded" />
      </div>
      <div class="flex items-center gap-4">
        <a 
          v-if="sourceUrl" 
          :href="sourceUrl" 
          target="_blank" 
          class="text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          Source
        </a>
      </div>
    </header>

    <div class="relative flex-1 w-full h-full">
      <div
        v-if="!loaded && !errored"
        class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950 gap-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin text-zinc-600"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      </div>

      <iframe
        :src="notebookPath"
        class="absolute inset-0 w-full h-full border-none transition-opacity duration-500 bg-zinc-950"
        :class="{ 'opacity-0': !loaded, 'opacity-100': loaded }"
        @load="loaded = true"
        @error="errored = true"
        title="Marimo Notebook"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  notebookPath: string
  title?: string
  sourceUrl?: string
}>()
const loaded = ref(false)
const errored = ref(false)
</script>

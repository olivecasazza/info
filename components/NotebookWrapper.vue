<template>
  <div class="flex flex-col h-full w-full max-w-5xl mx-auto p-4 md:p-6 gap-3">
    <header class="flex items-center justify-between text-sm text-zinc-400">
      <div class="flex items-center gap-3 overflow-hidden">
        <div class="flex items-center gap-2 px-2 py-1 bg-zinc-800/50 rounded-md border border-zinc-700/50 backdrop-blur-sm">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" v-if="!errored && loaded" />
          <div class="w-2 h-2 rounded-full bg-amber-500 animate-pulse" v-else-if="!errored && !loaded" />
          <div class="w-2 h-2 rounded-full bg-rose-500" v-else />
          <span v-if="title" class="font-medium truncate text-zinc-200">{{ title }}</span>
          <span v-else class="italic">Untitled Notebook</span>
        </div>
      </div>
      <nav class="flex items-center gap-4 shrink-0">
        <a 
          v-if="sourceUrl" 
          :href="sourceUrl" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="flex items-center gap-1.5 hover:text-zinc-200 transition-colors"
          title="View Source"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          <span class="hidden sm:inline">Source</span>
        </a>
        <a 
          :href="notebookPath" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="flex items-center gap-1.5 hover:text-zinc-200 transition-colors"
          title="Open in new tab"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
          <span class="hidden sm:inline">Open</span>
        </a>
      </nav>
    </header>

    <main class="relative flex-1 w-full rounded-xl overflow-hidden border border-zinc-700/60 bg-zinc-900/50 shadow-2xl shadow-black/50 ring-1 ring-white/5">
      <!-- Loading State -->
      <div
        v-if="!loaded && !errored"
        class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm gap-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2 animate-spin text-zinc-400"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <span class="text-sm font-medium text-zinc-400 tracking-wider uppercase animate-pulse">Initializing Environment</span>
      </div>

      <!-- Error State -->
      <div
        v-if="errored"
        class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-md gap-4 p-6 text-center"
      >
        <div class="p-3 bg-rose-500/10 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle text-rose-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        </div>
        <div class="space-y-1">
          <h3 class="text-lg font-medium text-zinc-200">Failed to load notebook</h3>
          <p class="text-sm text-zinc-500 max-w-sm">The connection to the notebook server timed out or was refused.</p>
        </div>
        <a 
          :href="notebookPath" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="mt-2 px-4 py-2 bg-zinc-100 text-zinc-900 hover:bg-white transition-colors rounded-md text-sm font-medium inline-flex items-center gap-2"
        >
          Try opening directly
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>

      <!-- Iframe -->
      <iframe
        :src="notebookPath"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        class="w-full h-full bg-zinc-950 transition-opacity duration-500"
        :class="{ 'opacity-0': !loaded, 'opacity-100': loaded }"
        @load="loaded = true"
        @error="errored = true"
        title="Notebook Execution Environment"
      />
    </main>
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

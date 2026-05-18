<template>
  <article class="notebook-page">
    <header class="notebook-header">
      <h1 class="notebook-heading">{{ title }}</h1>
      <a
        v-if="sourceUrl"
        :href="sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="link notebook-source"
      >source</a>
    </header>

    <section class="notebook-frame-section">
      <div v-if="!loaded && !errored" class="notebook-loading">
        <span class="notebook-loading-text">loading marimo wasm</span>
      </div>

      <div v-if="errored" class="notebook-loading">
        <span class="notebook-error-text">failed to load notebook</span>
        <a :href="notebookPath" target="_blank" rel="noopener noreferrer" class="link">open directly</a>
      </div>

      <iframe
        :src="notebookPath"
        class="notebook-frame"
        :class="{ 'opacity-0': !loaded, 'opacity-100': loaded }"
        @load="loaded = true"
        @error="errored = true"
        title="Marimo Notebook"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
      />
    </section>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  notebookPath: string
  title?: string
  sourceUrl?: string
}>()

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: '/notebook-theme.css'
    }
  ]
})

const loaded = ref(false)
const errored = ref(false)
</script>

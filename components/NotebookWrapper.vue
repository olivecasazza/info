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

const loaded = ref(false)
const errored = ref(false)
</script>

<style scoped>
.notebook-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 42rem;
  min-height: calc(100vh - 4.5rem);
  padding-bottom: 1rem;
  background: transparent;
  color: #d1d5db;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.875rem;
  line-height: 1.625;
}

.notebook-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.notebook-heading {
  color: #5dcdbe;
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.notebook-source {
  width: fit-content;
  font-size: 0.75rem;
}

.notebook-frame-section {
  position: relative;
  min-height: 70vh;
  background: transparent;
}

.notebook-frame {
  display: block;
  width: 100%;
  min-height: 70vh;
  border: 0;
  background: transparent;
  transition: opacity 200ms ease;
}

.notebook-loading {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0.75rem;
  padding-top: 0.5rem;
  background: transparent;
  color: #9ca3af;
  font-size: 0.75rem;
  letter-spacing: 0.02em;
}

.notebook-error-text {
  color: #eba798;
}

.notebook-loading-text::after {
  content: '';
  animation: ellipsis 1.1s steps(4, end) infinite;
}

@keyframes ellipsis {
  0% { content: ''; }
  25% { content: '.'; }
  50% { content: '..'; }
  75% { content: '...'; }
  100% { content: ''; }
}
</style>

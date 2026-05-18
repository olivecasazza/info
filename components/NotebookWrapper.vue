<template>
  <div class="flex flex-col min-h-screen notebook-shell">
    <header class="notebook-header shrink-0">
      <NuxtLink to="/" class="notebook-link">/home</NuxtLink>
      <span class="notebook-separator">›</span>
      <span class="notebook-title">/{{ titleSlug }}</span>
      <span v-if="!loaded && !errored" class="notebook-status">loading</span>
      <span v-else-if="errored" class="notebook-status notebook-status-error">error</span>
      <a
        v-if="sourceUrl"
        :href="sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="notebook-link ml-auto"
      >source ↗</a>
    </header>

    <main class="relative flex-1 flex flex-col items-center justify-center">
      <div v-if="!loaded && !errored" class="notebook-loading">
        <span class="notebook-loading-text">loading marimo wasm</span>
      </div>

      <div v-if="errored" class="notebook-loading">
        <span class="notebook-error-text">failed to load notebook</span>
        <a :href="notebookPath" target="_blank" rel="noopener noreferrer" class="notebook-link">open directly ↗</a>
      </div>

      <iframe
        :src="notebookPath"
        class="absolute inset-0 h-full w-full border-0 bg-transparent transition-opacity duration-200"
        :class="{ 'opacity-0': !loaded, 'opacity-100': loaded }"
        @load="loaded = true"
        @error="errored = true"
        title="Marimo Notebook"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  notebookPath: string
  title?: string
  sourceUrl?: string
}>()

const loaded = ref(false)
const errored = ref(false)
const titleSlug = computed(() => (props.title || 'notebook').toLowerCase().replaceAll(' ', '-'))
</script>

<style scoped>
.notebook-shell {
  background: transparent;
  color: #d4d4d8;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
}

.notebook-header {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-height: 2.25rem;
  padding: 0.45rem 0.8rem;
  border-bottom: 1px solid rgba(244, 114, 182, 0.14);
  background: rgba(9, 9, 11, 0.86);
  color: #a1a1aa;
  font-size: 0.78rem;
  letter-spacing: 0.01em;
  backdrop-filter: blur(14px);
}

.notebook-link {
  color: #f9a8d4;
  text-decoration: none;
  transition: color 120ms ease;
}

.notebook-link:hover {
  color: #67e8f9;
}

.notebook-separator {
  color: #52525b;
}

.notebook-title {
  color: #d4d4d8;
}

.notebook-status {
  margin-left: 0.35rem;
  color: #71717a;
}

.notebook-status::before {
  content: '[';
  color: #52525b;
}

.notebook-status::after {
  content: ']';
  color: #52525b;
}

.notebook-status-error,
.notebook-error-text {
  color: #fb7185;
}

.notebook-loading {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: transparent;
  color: #71717a;
  font-size: 0.78rem;
  letter-spacing: 0.02em;
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

<script  setup lang="ts">

const props = defineProps < {
  notebookPath: string
}>()

const fullPath = computed(() => {
  if (window.location.origin.includes('github.io')) {
    return `https://olivecasazza.github.io/info/${props.notebookPath}`
  }
  return props.notebookPath
})

</script>

<template>
  <ClientOnly>
    <iframe
      :ref="fullPath"
      :src="fullPath"
      sandbox="allow-same-origin allow-scripts"
      class="w-full h-full app-view-port"
    />
  </ClientOnly>
</template>

<style scoped>
.jp-Notebook {
  @apply w-full h-full bg-transparent text-xs;
}

.jp-Notebook > * {
  background: transparent;
}
</style>

<script  setup lang="ts">

const props = defineProps < {
  notebookPath: string
}>()

</script>

<template>
  <iframe
    :ref="props.notebookPath"
    :src="props.notebookPath"
    sandbox="allow-same-origin allow-scripts"
    class="w-full h-full app-view-port"
  />
</template>

<style scoped>
.jp-Notebook {
  @apply w-full h-full bg-transparent text-xs;
}

.jp-Notebook > * {
  background: transparent;
}
</style>

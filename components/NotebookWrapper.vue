<script  setup lang="ts">

const props = defineProps < {
  notebookPath: string
}>()
const fullPath = computed(() => {
  return `${window.location.origin}/info/${props.notebookPath}`
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

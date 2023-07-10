<script  setup lang="ts">

const props = defineProps < {
  notebookPath: string
}>()

const fullPath = computed(() => {
  let base = ''
  if (window.location.origin.includes('localhost')) { base += 'info/' }
  const path = `${window.location.origin}${base}${props.notebookPath}`
  console.log(path)
  return path
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

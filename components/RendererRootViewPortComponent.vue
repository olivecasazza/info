<template>
  <canvas id="root" ref="root" />
</template>

<script setup lang="ts">
import { useRendererStore } from '~/stores/renderer'

const root: Ref<HTMLElement|undefined> = ref()

onMounted(() => {
  const rendererStore = useRendererStore()
  const { init, resize, start } = rendererStore
  if (!root.value) { throw new Error('root container not found') }
  init({ container: root.value })
  window.addEventListener('resize', resize)
  window.addEventListener('orientation_change', resize)
  start()
  resize()
})

onUnmounted((): void => {
  const rendererStore = useRendererStore()
  const { resize, webGLRenderer } = rendererStore

  window.removeEventListener('resize', resize)
  window.removeEventListener('orientation_change', resize)
  // remove any child components created by three in this component
  webGLRenderer?.dispose()
  // while (statsElement.value?.lastChild) { statsElement.value.removeChild(statsElement.value.lastChild) }
  while (root.value?.lastChild) { root.value.removeChild(root.value.lastChild) }
})

</script>

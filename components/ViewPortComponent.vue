<template>
  <div :ref="(el) => refs[props.view.id] = el" />
</template>

<script setup lang="ts">
import { useRendererStore } from '~/stores/renderer'
import type { View } from '~/utils/renderer/view'

const props = defineProps<{
  view: View
}>()

const refs = ref({
  [props.view.id]: null as Element | ComponentPublicInstance | null
})

onMounted(() => {
  const rendererStore = useRendererStore()
  const { addView } = rendererStore
  const container = refs.value[props.view.id]
  if (!props.view) { throw new Error('view was not provided to viewport.') }
  if (!container) { throw new Error('could not get container for view') }
  addView({
    view: props.view,
    container: container as HTMLElement
  })
})

onBeforeUnmount(() => {
  const rendererStore = useRendererStore()
  const { removeView } = rendererStore
  removeView({ viewId: props.view.id })
})

</script>

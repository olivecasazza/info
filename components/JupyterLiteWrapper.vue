<script  setup lang="ts">
const props = defineProps<{ notebookPath: string }>()

const fullPath = computed(() => {
  return `https://olivecasazza.github.io/notebooks/lab?path=${props.notebookPath}`
})

</script>

<template>
  <ClientOnly class="h-full w-full">
    <div class="flex justify-center items-center h-full w-full">
      <iframe
        :ref="fullPath"
        :src="fullPath"
        sandbox="allow-same-origin allow-scripts"
        class="w-full h-full m-5"
      />
    </div>
  </ClientOnly>
</template>

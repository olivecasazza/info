<script  setup lang="ts">

const isMounted = ref(false)
onMounted(() => { isMounted.value = true })

const props = defineProps<{
  notebookPath: string
}>()

</script>

<template>
  <div class="w-full h-full flex items-center justify-center z-20 absolute">
    <iframe
      :ref="props.notebookPath"
      :src="props.notebookPath"
      sandbox="allow-same-origin allow-scripts"
      class="w-11/12 h-5/6 z-20 border border-gray-600"
    />
  </div>
  <div class="w-full h-full flex items-center justify-center z-10 absolute rainbow-text-animated">
    LOADING....
  </div>
</template>

<style scoped>

@keyframes ldio-yepym19m4 {
  0% {
    transform: rotate(0deg)
  }

  100% {
    transform: rotate(360deg)
  }
}

.loader {
  width: 48px;
  height: 48px;
  border: 2px solid #FFF;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.loader::after {
  content: '';
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: 0;
  background: #FF3D00;
  width: 3px;
  height: 24px;
  transform: translateX(-50%);
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

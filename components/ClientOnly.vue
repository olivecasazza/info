<template>
  <div v-if="isMounted">
    <slot />
  </div>
</template>

<script setup lang="ts">
const isMounted = ref(false)
onMounted(() => { isMounted.value = true })
</script>

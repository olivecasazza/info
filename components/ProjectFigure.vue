<template>
  <figure class="flex flex-col gap-1">
    <div v-if="src && !failed" class="border border-gray-700 rounded-md overflow-hidden bg-black/60">
      <img :src="src" :alt="caption" class="w-full block" @error="failed = true">
    </div>
    <div v-else class="border border-dashed border-gray-700 rounded-md bg-black/30 aspect-video flex items-center justify-center text-gray-500 text-xs">
      [ gif coming soon ]
    </div>
    <figcaption class="text-xs text-gray-500">{{ caption }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
defineProps<{ src?: string; caption: string }>()
const failed = ref(false)
</script>

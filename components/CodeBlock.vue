<template>
  <pre class="bg-black/60 border border-gray-700 rounded-md p-3 text-xs text-gray-200 overflow-x-auto"><code>{{ code }}</code></pre>
</template>

<script setup lang="ts">
defineProps<{ code: string }>()
</script>

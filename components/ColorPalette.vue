<template>
  <div class="flex flex-row">
    <div v-for="(items, category) of themeColors" :key="category" class="flex flex-row">
      <div v-for="(color, k) of items" :key="color">
        <div v-if="k != 50 && k != 100" :style="`background: ${color};`" :class="`w-2 h-2 bg-${category}-${k}`" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { themeColors } from '~/tailwind/colors'
</script>

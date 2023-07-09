<template>
  <BackgroundGUI v-if="isReady" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBackgroundStore } from '~/stores/background'

const { isReady } = storeToRefs(useBackgroundStore())
</script>

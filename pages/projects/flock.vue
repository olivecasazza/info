<template>
  <BackgroundGUI v-if="isReady" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFlockStore } from '~/stores/flock'

const { isReady } = storeToRefs(useFlockStore())
</script>

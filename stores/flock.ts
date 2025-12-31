// NOTE: The flock simulation + GUI have been migrated into Rust (egui + eframe)
// under `wasm/flock`.
//
// We keep this Pinia store as a thin stub for backwards-compatibility with any
// components that still import it.

import { defineStore } from 'pinia'

export const useFlockStore = defineStore('flock', () => {
  // Historical reactive flags that some pages/components used.
  const isReady = ref(true)

  return {
    isReady
  }
})

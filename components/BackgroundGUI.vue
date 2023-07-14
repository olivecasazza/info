<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex-grow" />
    <div v-if="isReady" ref="guiContainer" class="noselect" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { FolderApi, Pane } from 'tweakpane'
import { useBackgroundStore } from '~/stores/background'
import { DEFAULT_BIRD_ID, generateRandomBirdConfig, IBirdConfig } from '~/utils/background/background'

const backgroundStore = useBackgroundStore()
const { addOrUpdateBirdConfig, removeBirdConfig, updateMaxFlockSize } = backgroundStore
const { birdConfigs, flock, isReady } = storeToRefs(backgroundStore)

const guiContainer = ref(null)
const pane = ref({} as Pane)
const rootFolder = ref({} as FolderApi)
const globalsFolder = ref({} as FolderApi)
const birdSpeciesFolder = ref({} as FolderApi)

onMounted(() => {
  pane.value = new Pane({ container: guiContainer.value as unknown as HTMLElement })
  rootFolder.value = pane.value.addFolder({ title: 'settings', expanded: false })
  globalsFolder.value = rootFolder.value.addFolder({
    title: 'flock settings'
  })
  birdSpeciesFolder.value = rootFolder.value.addFolder({
    title: 'bird settings'
  })
  loadGlobalsFolder()
  loadFlockSpeciesFolder()
})

function loadGlobalsFolder () {
  globalsFolder.value.addInput(backgroundStore, 'timeStep', {
    label: 'simulation timestep',
    step: 0.1,
    min: 0,
    max: 5
  })
  globalsFolder.value.addInput(backgroundStore, 'maxFlockSize', {
    label: 'max flock size',
    step: 1,
    min: 0,
    max: 2000
  }).on('change', event => updateMaxFlockSize(event.value))

  globalsFolder.value.addMonitor(flock.value, 'current_flock_size', {
    multiline: false
  })
  globalsFolder.value.addMonitor(flock.value, 'current_flock_size', {
    view: 'graph',
    min: 0,
    max: 2000
  })
  globalsFolder.value
    .addButton({ title: 'generate random species' })
    .on('click', async () => {
      const randomConfig = generateRandomBirdConfig()
      await addOrUpdateBirdConfig(randomConfig)
      addSpeciesToSpeciesFolder(randomConfig)
    })
}

function loadFlockSpeciesFolder () {
  birdConfigs.value.forEach(addSpeciesToSpeciesFolder)
}

function addSpeciesToSpeciesFolder (birdConfig: IBirdConfig) {
  const speciesFolder = birdSpeciesFolder.value.addFolder({
    title: birdConfig.id
  })
  speciesFolder.addInput(birdConfig, 'probability', {
    label: 'spawn probability multiplier',
    min: 0,
    max: 100,
    step: 1
  })
  speciesFolder.addInput(birdConfig, 'neighborDistance', {
    label: 'neighbor_distance',
    min: 0,
    max: 250,
    step: 1
  })
  speciesFolder.addInput(birdConfig, 'desiredSeparation', {
    label: 'desired_separation',
    min: 0,
    max: 250,
    step: 1
  })
  speciesFolder.addInput(birdConfig, 'separationMultiplier', {
    label: 'separation_multiplier',
    min: 0,
    max: 10,
    step: 0.01
  })
  speciesFolder.addInput(birdConfig, 'alignmentMultiplier', {
    label: 'alignment_multiplier',
    min: 0,
    max: 10,
    step: 0.01
  })
  speciesFolder.addInput(birdConfig, 'cohesionMultiplier', {
    label: 'cohesion_multiplier',
    min: 0,
    max: 10,
    step: 0.01
  })
  speciesFolder.addInput(birdConfig, 'maxSpeed', {
    label: 'max_speed',
    min: 0,
    max: 10,
    step: 0.01
  })
  speciesFolder.addInput(birdConfig, 'maxForce', {
    label: 'max_force',
    min: 0,
    max: 10,
    step: 0.01
  })
  speciesFolder.addInput(birdConfig, 'birdSize', {
    label: 'bird_size',
    min: 0,
    max: 25,
    step: 1
  })
  speciesFolder.addInput(birdConfig, 'birdColor', {
    label: 'bird_color'
  })
  if (birdConfig.id !== DEFAULT_BIRD_ID) {
    speciesFolder
      .addButton({ title: 'remove species' })
      .on('click', async () => {
        await removeBirdConfig(birdConfig.id)
        speciesFolder.dispose()
      })
  }
  speciesFolder.on('change', (ev) => {
    addOrUpdateBirdConfig({
      ...birdConfig,
      [ev.presetKey as string]: ev.value
    })
  })
}

</script>

<style>
:root {
  --tp-base-background-color: hsla(0, 0%, 10%, 0);
  --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
  --tp-button-background-color: hsla(0, 0%, 80%, 1);
  --tp-button-background-color-active: hsla(0, 0%, 100%, 1);
  --tp-button-background-color-focus: hsla(0, 0%, 95%, 1);
  --tp-button-background-color-hover: hsla(0, 0%, 85%, 1);
  --tp-button-foreground-color: hsla(0, 0%, 0%, 0.8);
  --tp-container-background-color: hsla(0, 0%, 0%, 0.3);
  --tp-container-background-color-active: hsla(0, 0%, 0%, 0.6);
  --tp-container-background-color-focus: hsla(0, 0%, 0%, 0.5);
  --tp-container-background-color-hover: hsla(0, 0%, 0%, 0.4);
  --tp-container-foreground-color: hsla(0, 0%, 100%, 0.5);
  --tp-groove-foreground-color: hsla(0, 0%, 0%, 0.2);
  --tp-input-background-color: hsla(0, 0%, 0%, 0.3);
  --tp-input-background-color-active: hsla(0, 0%, 0%, 0.6);
  --tp-input-background-color-focus: hsla(0, 0%, 0%, 0.5);
  --tp-input-background-color-hover: hsla(0, 0%, 0%, 0.4);
  --tp-input-foreground-color: hsla(0, 0%, 100%, 0.5);
  --tp-label-foreground-color: hsla(0, 0%, 100%, 0.5);
  --tp-monitor-background-color: hsla(0, 0%, 0%, 0.3);
  --tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.3);
}
</style>

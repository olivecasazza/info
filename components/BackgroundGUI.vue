<template>
  <div class="w-full sm:max-w-sm content-center flex flex-col">
    <div v-if="isReady" ref="guiContainer" class="noselect border border-gray-300 " />
    <div class="flex-grow" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { FolderApi, Pane } from 'tweakpane'
import { useFlockStore } from '~/stores/flock'
import { DEFAULT_BIRD_ID, generateRandomBirdConfig, IBirdConfig } from '~/utils/background/background'

const flockStore = useFlockStore()
const { addOrUpdateBirdConfig, removeBirdConfig, updateMaxFlockSize } = flockStore
const { birdConfigs, flock, isReady } = storeToRefs(flockStore)

let pane!: Pane
let rootFolder!: FolderApi
let globalsFolder!: FolderApi
let birdSpeciesFolder!: FolderApi

const guiContainer = ref(null)
const configs = computed(() => birdConfigs.value)

onMounted(() => {
  pane = new Pane({ container: guiContainer.value as unknown as HTMLElement })
  rootFolder = pane.addFolder({ title: 'settings', expanded: false })
  globalsFolder = rootFolder.addFolder({
    title: 'flock settings'
  })
  birdSpeciesFolder = rootFolder.addFolder({
    title: 'bird settings'
  })
  loadGlobalsFolder()
  loadFlockSpeciesFolder()
})

// disgusting hack to make gui react to changes in bird configs
watch(birdConfigs.value, () => {
  const preset = {} as { [key: string]: any };
  [...birdConfigs.value.values()].forEach((c) => {
    Object.entries(c).forEach(([k, v]) => {
      const validKeys = ['neighborDistance',
        'desiredSeparation',
        'separationMultiplier',
        'alignmentMultiplier',
        'cohesionMultiplier',
        'maxForce',
        'maxSpeed',
        'birdColor']
      const key = `${c.id}-${k}`
      if (validKeys.includes(k)) { preset[key] = v }
    })
  })
  pane.importPreset(preset)
  pane.refresh()
})

function loadGlobalsFolder () {
  globalsFolder.addInput(flockStore, 'isRandomizeAnimationEnabled',
    {
      label: 'enable randomization animation'
    })
  globalsFolder.addInput(flockStore, 'timeStep', {
    label: 'simulation timestep',
    step: 0.1,
    min: 0,
    max: 5
  })
  globalsFolder.addInput(flockStore, 'maxFlockSize', {
    label: 'max flock size',
    step: 1,
    min: 0,
    max: 2000
  }).on('change', event => updateMaxFlockSize(event.value))

  globalsFolder.addMonitor(flock.value, 'current_flock_size', {
    multiline: false
  })
  globalsFolder.addMonitor(flock.value, 'current_flock_size', {
    view: 'graph',
    min: 0,
    max: 2000
  })
  globalsFolder
    .addButton({ title: 'generate random species' })
    .on('click', async () => {
      const randomConfig = generateRandomBirdConfig()
      await addOrUpdateBirdConfig(randomConfig)
      addSpeciesToSpeciesFolder(randomConfig)
    })
}

function loadFlockSpeciesFolder () {
  configs.value.forEach(addSpeciesToSpeciesFolder)
}

function addSpeciesToSpeciesFolder (birdConfig: IBirdConfig) {
  const speciesFolder = birdSpeciesFolder.addFolder({
    title: birdConfig.id
  })
  speciesFolder.addInput(birdConfig, 'probability', {
    presetKey: `${birdConfig.id}-probability`,
    label: 'spawn probability multiplier',
    min: 0,
    max: 100,
    step: 1
  })
  speciesFolder.addInput(birdConfig, 'neighborDistance', {
    presetKey: `${birdConfig.id}-neighborDistance`,
    label: 'neighbor_distance',
    min: 0,
    max: 250,
    step: 1
  })
  speciesFolder.addInput(birdConfig, 'desiredSeparation', {
    presetKey: `${birdConfig.id}-desiredSeparation`,
    label: 'desired_separation',
    min: 0,
    max: 250,
    step: 1
  })
  speciesFolder.addInput(birdConfig, 'separationMultiplier', {
    presetKey: `${birdConfig.id}-separationMultiplier`,
    label: 'separation_multiplier',
    min: 0,
    max: 10,
    step: 0.01
  })
  speciesFolder.addInput(birdConfig, 'alignmentMultiplier', {
    presetKey: `${birdConfig.id}-alignmentMultiplier`,
    label: 'alignment_multiplier',
    min: 0,
    max: 10,
    step: 0.01
  })
  speciesFolder.addInput(birdConfig, 'cohesionMultiplier', {
    presetKey: `${birdConfig.id}-cohesionMultiplier`,
    label: 'cohesion_multiplier',
    min: 0,
    max: 10,
    step: 0.01
  })
  speciesFolder.addInput(birdConfig, 'maxSpeed', {
    presetKey: `${birdConfig.id}-maxSpeed`,
    label: 'max_speed',
    min: 0,
    max: 10,
    step: 0.01
  })
  speciesFolder.addInput(birdConfig, 'maxForce', {
    presetKey: `${birdConfig.id}-maxForce`,
    label: 'max_force',
    min: 0,
    max: 10,
    step: 0.01
  })
  speciesFolder.addInput(birdConfig, 'birdSize', {
    presetKey: `${birdConfig.id}-birdSize`,
    label: 'bird_size',
    min: 0,
    max: 25,
    step: 1
  })
  speciesFolder.addInput(birdConfig, 'birdColor', {
    presetKey: `${birdConfig.id}-birdColor`,
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

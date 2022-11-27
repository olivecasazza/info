<template>
  <div v-if="vxm.background.isMounted" class="app-view-port h-full w-full">
    <div ref="gui-container" class="noselect overflow-y-scroll max-w-md max-h-max"></div>
  </div>
</template>

<script lang="ts">
import { vxm } from '@app/store';
import { FolderApi, Pane } from 'tweakpane';
import { Vue } from 'vue-class-component';
import {
  DEFAULT_BIRD_ID, generateRandomBirdConfig,
  IBirdConfig
} from './background';

export default class BackgroundGUI extends Vue {
  pane!: Pane;
  rootFolder!: FolderApi;
  globalsFolder!: FolderApi;
  birdSpeciesFolder!: FolderApi;

  get container(): HTMLElement {
    return this.$refs['gui-container'] as HTMLElement;
  }

  get vxm() {
    return vxm;
  }

  mounted() {
    this.pane = new Pane({ container: this.container, });
    this.rootFolder = this.pane.addFolder({ title: "settings", expanded: false })
    this.globalsFolder = this.rootFolder.addFolder({
      title: 'flock settings',
    });
    this.birdSpeciesFolder = this.rootFolder.addFolder({
      title: 'bird settings',
    });
    this.loadGlobalsFolder();
    this.loadFlockSpeciesFolder();
  }

  unmounted() {
    this.pane.dispose();
  }

  loadGlobalsFolder() {
    this.globalsFolder.addInput(vxm.background, 'timeStep', {
      label: 'simulation timestep',
      step: 0.1,
      min: 0,
      max: 5,
    });
    this.globalsFolder.addInput(vxm.background, 'maxFlockSize', {
      label: 'max flock size',
      step: 1,
      min: 0,
      max: 2000,
    });
    this.globalsFolder.addMonitor(vxm.background, 'currentFlockSize', {
      multiline: false 
    });
    this.globalsFolder.addMonitor(vxm.background, 'currentFlockSize', {
      view: 'graph',
      min: 0,
      max: 2000,
    });
    this.globalsFolder
      .addButton({ title: 'generate random bird' })
      .on('click', async () => {
        const randomConfig = generateRandomBirdConfig();
        await vxm.background.addOrUpdateBirdConfig(randomConfig);
        this.addSpeciesToSpeciesFolder(randomConfig);
      });
  }

  loadFlockSpeciesFolder() {
    vxm.background.birdConfigs.forEach(this.addSpeciesToSpeciesFolder);
  }

  addSpeciesToSpeciesFolder(birdConfig: IBirdConfig) {
    const speciesFolder = this.birdSpeciesFolder.addFolder({
      title: birdConfig.id,
    });
    speciesFolder.addInput(birdConfig, 'weight', {
      label: 'weight',
      min: 0,
      max: 100,
      step: 1,
    });
    speciesFolder.addInput(birdConfig, 'neighborDistance', {
      label: 'neighbor_distance',
      min: -250,
      max: 250,
      step: 1,
    });
    speciesFolder.addInput(birdConfig, 'desiredSeparation', {
      label: 'desired_separation',
      min: -250,
      max: 250,
      step: 1,
    });
    speciesFolder.addInput(birdConfig, 'separationMultiplier', {
      label: 'separation_multiplier',
      min: -10,
      max: 10,
      step: 1,
    });
    speciesFolder.addInput(birdConfig, 'alignmentMultiplier', {
      label: 'alignment_multiplier',
      min: -10,
      max: 10,
      step: 1,
    });
    speciesFolder.addInput(birdConfig, 'cohesionMultiplier', {
      label: 'cohesion_multiplier',
      min: -10,
      max: 10,
      step: 1,
    });
    speciesFolder.addInput(birdConfig, 'maxSpeed', {
      label: 'max_speed',
      min: 0,
      max: 10,
      step: 0.1,
    });
    speciesFolder.addInput(birdConfig, 'maxForce', {
      label: 'max_force',
      min: 0,
      max: 10,
      step: 0.1,
    });
    speciesFolder.addInput(birdConfig, 'birdSize', {
      label: 'bird_size',
      min: 0,
      max: 25,
      step: 1,
    });
    speciesFolder.addInput(birdConfig, 'birdColor', {
      label: 'bird_color',
    });
    if (birdConfig.id !== DEFAULT_BIRD_ID) {
      speciesFolder
        .addButton({ title: 'remove species' })
        .on('click', async () => {
          await vxm.background.removeBirdConfig(birdConfig.id);
          speciesFolder.dispose();
        });
    }
    speciesFolder.on('change', (ev) => {
      vxm.background.addOrUpdateBirdConfig({
        ...birdConfig,
        [ev.presetKey as string]: ev.value,
      });
    });
  }
}
</script>

<style>
[class^='tp-r'] {
  background: transparent !important;
  background-color: transparent !important;
  color: white;
}
</style>

<template>
  <div class="app-view-port h-full w-full flex flex-col">
    <canvas :id="id" :ref="id" class="flex-grow"></canvas>
    <div v-if="isLoading" class="loading-bar content-end"></div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import init from '../../../../../../libs/renderer/pkg/renderer';

export default class BevyViewPort extends Vue {
  @Prop({ required: true, type: String }) readonly id!: string;
  isLoading = false;

  get container(): HTMLElement {
    return this.$refs[this.id as never] as HTMLElement;
  }

  async mounted(): Promise<void> {
    this.isLoading = true;
    const mod = await init();
    console.log(mod);
    await this.delay(5000);
    this.isLoading = false;
  }

  async delay(ms: number) {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), ms)).then(() =>
      console.log('loaded')
    );
  }
}
</script>

<template>
    <BevyViewPort class="app-view-port h-full w-full" :id="'bevy-canvas'" />
</template>

<script lang="ts">
import BevyViewPort from '@app/components/renderer/BevyViewPortComponent.vue';
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
    BevyViewPort: BevyViewPort,
  },
})
export default class BevyFlock extends Vue {
  get vxm() {
    return vxm;
  }

  async mounted() {}
}
</script>

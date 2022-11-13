<script lang="ts">
import RendererRootViewPortComponent from '@app/components/renderer/RendererRootViewPortComponent.vue';
import NavBar from '@app/views/NavBar.vue';
import Footer from '@app/views/Footer.vue';
import { Options, Vue } from 'vue-class-component';
import { vxm } from '@app/store';
import BackgroundWrapper from '@app/views/background/BackgroundWrapper.vue';

@Options({
  components: {
    BackgroundWrapper,
    RendererRootViewPortComponent,
    NavBar,
    Footer,
  },
})
export default class App extends Vue {
  get vxm() {
    return vxm;
  }
  mounted() {
    vxm.renderer.start();
    vxm.background.constructFlock();
  }
}
</script>

<template>
  <div class="app-wrapper">
    <div class="w-full h-full relative">
      <RendererRootViewPortComponent class="z-10" />
      <div v-if="vxm.renderer.rendererRootViewPort.isMounted">
        <BackgroundWrapper v-if="vxm.background.isMounted" class="absolute w-full h-full" />
        <div
          v-if="vxm.background.isMounted"
          class="absolute w-full h-full flex flex-col z-30 p-4"
        >
          <NavBar />
          <router-view />
          <Footer></Footer>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
html,
body {
  background: black;
}

.app-wrapper {
  @apply w-screen h-screen overflow-hidden;
}
</style>

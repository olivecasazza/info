import Vuex from "vuex";
import {
  createModule,
  createProxy,
  createSubModule,
  extractVuexModule,
} from "vuex-class-component";
import { BackgroundStore } from "./background.vuex";
import { RendererStore } from "./renderer.vuex";

const VuexModule = createModule({
  namespaced: "game",
  strict: false,
});

export default class MainStore extends VuexModule {
  renderer = createSubModule(RendererStore);
  background = createSubModule(BackgroundStore);
}

export const store = new Vuex.Store({
  modules: {
    ...extractVuexModule(MainStore),
  },
});

export const vxm = {
  ...createProxy(store, MainStore),
};

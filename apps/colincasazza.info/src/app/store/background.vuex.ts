import {
  DEFAULT_BIRD_ID,
  generateBirdId,
  MAX_FLOCK_SIZE,
  type IBirdConfig
} from '@app/views/background/background';
import { BirdConfig, Flock } from '@libs/flock';
import themeColors from '@libs/theme/src/lib/colors.cjs';
import { Color } from 'three';
import { action, createModule } from 'vuex-class-component';
import * as WeightedArray from 'weighted-array';
import { vxm } from '.';

const { select } = WeightedArray;

const VuexModule = createModule({
  namespaced: 'background',
  strict: false,
});

export class BackgroundStore extends VuexModule {
  birdConfigs: Map<string, IBirdConfig> = new Map<string, IBirdConfig>();
  isDragging = false;
  isMounted = false;
  updating = false;
  timeStep = 1.0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $subscribeAction: any;
  private _flock?: Flock;
  private _maxFlockSize = MAX_FLOCK_SIZE;

  get currentFlockSize() {
    if (!this._flock) return 1;
    return this._flock.current_flock_size;
  }

  get maxFlockSize() {
    return vxm.background._maxFlockSize;
  }

  @action async updateMaxFlockSize(newMaxFlockSize: number) {
    this._flock.max_flock_size = Math.ceil(newMaxFlockSize);
    this._maxFlockSize = newMaxFlockSize;
  }

  @action async constructFlock(): Promise<void> {
    this._flock = new Flock(
      // todo: determine number birds to add based on screen size and performance
      // const n = (this.view.viewPort.width * this.view.viewPort.height) / 500;
      this._maxFlockSize,
      BigInt(new Date().getUTCMilliseconds())
    );
    await vxm.background.addOrUpdateBirdConfig({
      id: generateBirdId(),
      weight: 1,
      neighborDistance: 20,
      desiredSeparation: 80,
      separationMultiplier: 0.6,
      alignmentMultiplier: 0.3,
      cohesionMultiplier: 0.3,
      maxSpeed: 7,
      maxForce: 0.1,
      birdSize: 12,
      birdColor: themeColors.highlight[200],
    } as IBirdConfig);
    await vxm.background.addOrUpdateBirdConfig({
      id: DEFAULT_BIRD_ID,
      weight: 80,
      neighborDistance: 80,
      desiredSeparation: -20,
      separationMultiplier: 0.3,
      alignmentMultiplier: 0.3,
      cohesionMultiplier: 0.4,
      maxSpeed: 5,
      maxForce: 0.05,
      birdSize: 6,
      birdColor: themeColors.compliment[500],
    } as IBirdConfig);
    this.isMounted = true;
  }

  @action async unmounted() {
    this.birdConfigs.forEach((birdConfig) => {
      if (birdConfig.wasmObject) birdConfig.wasmObject.free();
    });
    this._flock.free();
  }

  @action async addOrUpdateBirdConfig(
    configParams: IBirdConfig
  ): Promise<IBirdConfig> {
    if (!this._flock)
      throw new Error(
        "[background.vuex] cannot add config, flock doesn't exist."
      );
    const birdConfig = await this.generateBirdConfig(configParams);
    this.birdConfigs.set(birdConfig.id, birdConfig);
    this._flock.insert_bird_config(birdConfig.id, birdConfig.wasmObject);
    return birdConfig;
  }

  @action async removeBirdConfig(configIdToRemove: string) {
    if (!this._flock)
      throw new Error(
        "[background.vuex] cannot remove config, flock doesn't exist."
      );
    const config = this.birdConfigs.get(configIdToRemove);
    if (!config)
      throw new Error(
        '[background.vuex] cannot remove config, cannot find matching config.'
      );
    this._flock.remove_bird_config(configIdToRemove);
    this.birdConfigs.delete(configIdToRemove);
  }
  @action async updateFlock(props: {
    sceneWidth: number;
    sceneHeight: number;
    timeStep: number;
    updateFlockGeometryCallback: (
      vertices: Float32Array,
      colors: Float32Array
    ) => void;
  }) {
    if (!this._flock) return;
    this._flock.update(
      props.sceneWidth,
      props.sceneHeight,
      props.timeStep ? props.timeStep : vxm.background.timeStep,
      props.updateFlockGeometryCallback
    );
  }

  @action async addBirdAtRandomPosition(props: {
    viewWidth: number;
    viewHeight: number;
  }): Promise<void> {
    if (!this._flock) return;
    const config = select([...this.birdConfigs.values()]);
    this._flock.add_bird_at_random_position(
      config.id,
      props.viewWidth,
      props.viewHeight
    );
  }

  @action async addBirdAtPosition(props: {
    x: number;
    y: number;
  }): Promise<void> {
    if (!this._flock) return;
    const config = select([...this.birdConfigs.values()]);
    this._flock.add_bird(config.id, props.x, props.y);
  }

  /** generates the wasm bird config
   * and attaches the wasm object to
   * IBirdConfig object */
  @action async generateBirdConfig(params: IBirdConfig): Promise<IBirdConfig> {
    const color = new Color(params.birdColor);
    const wasmConfig = BirdConfig.new(
      params.id,
      params.weight,
      params.neighborDistance,
      params.desiredSeparation,
      params.separationMultiplier,
      params.alignmentMultiplier,
      params.cohesionMultiplier,
      params.maxSpeed,
      params.maxForce,
      params.birdSize,
      color.r,
      color.g,
      color.b
    );
    params.wasmObject = wasmConfig;
    return params;
  }
}

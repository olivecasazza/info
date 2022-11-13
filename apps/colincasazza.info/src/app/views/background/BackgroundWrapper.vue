<template>
  <ViewPortComponent :view="view" />
</template>

<script lang="ts">
import ViewPortComponent from '@app/components/renderer/ViewPortComponent.vue';
import { vxm } from '@app/store';
import { View } from '@app/utils/renderer/view';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  LineBasicMaterial,
  LineSegments,
  Vector3,
} from 'three';
import { lerp } from 'three/src/math/MathUtils';
import { Options, Vue } from 'vue-class-component';
import throttle from '@app/utils/lodash/throttle';

@Options({
  components: {
    ViewPortComponent: ViewPortComponent,
  },
})
export default class BackgroundWrapper extends Vue {
  addBirdsToFlockInterval!: NodeJS.Timer | number;
  // variables for rendering flock
  view!: View;
  birdsGeometry: any;
  birdsMaterial: any;
  birdsLine: any;

  get vxm() {
    return vxm;
  }

  created() {
    this.view = new View({
      cameraOptions: {
        fov: 75,
        near: 0.1,
        far: 1200,
        startingPosition: new Vector3(0, 0, 1000),
      },
      controlsOptions: {
        startDirection: new Vector3(0, 0, 0),
        enabled: false,
      },
      id: 'BACKGROUND_VIEW',
      background: new Color('black'),
      renderTickCallback: this.renderTickCallback,
    });
    this.birdsGeometry = new BufferGeometry();
    this.birdsMaterial = new LineBasicMaterial({
      vertexColors: true,
    });
    this.birdsLine = new LineSegments(this.birdsGeometry, this.birdsMaterial);
    this.view.scene.add(this.birdsLine);
  }

  async mounted() {
    window.addEventListener('touchstart', throttle(this.touchDrag, 10), false);
    window.addEventListener('touchmove', throttle(this.touchDrag, 10), false);
    window.addEventListener(
      'mousedown',
      () => (vxm.background.isDragging = true),
      false
    );
    window.addEventListener('mousemove', throttle(this.mouseDrag, 10), false);
    window.addEventListener(
      'mouseup',
      () => (vxm.background.isDragging = false),
      false
    );
    // add all the birds, but throttle it
    this.addBirdsToFlockInterval = setInterval(() => {
      if (vxm.background.currentFlockSize > vxm.background.maxFlockSize) {
        clearInterval(this.addBirdsToFlockInterval as NodeJS.Timer);
      }
      vxm.background.addBirdAtRandomPosition({
        viewWidth: this.view.visibleWidthAtZDepth,
        viewHeight: this.view.visibleHeightAtZDepth,
      });
    }, 25);
  }

  unmounted() {
    /** remove all the random event listeners weve added */
    window.addEventListener('touchstart', throttle(this.touchDrag, 10), false);
    window.addEventListener('touchmove', throttle(this.touchDrag, 10), false);
    window.addEventListener(
      'mousedown',
      () => (vxm.background.isDragging = true),
      false
    );
    window.addEventListener('mousemove', throttle(this.mouseDrag, 10), false);
    window.addEventListener(
      'mouseup',
      () => (vxm.background.isDragging = false),
      false
    );
    clearInterval(this.addBirdsToFlockInterval as NodeJS.Timer);
    /** make sure we clean up the wasm resources
    can we write this into the flock free function */
    // for (const config of vxm.background.birdConfigs) config.free();
    vxm.background.unmounted();
  }

  updateFlockGeometry(vertices: Float32Array, colors: Float32Array) {
    this.birdsLine.geometry.setAttribute(
      'position',
      new BufferAttribute(vertices, 3)
    );
    this.birdsLine.geometry.setAttribute(
      'color',
      new BufferAttribute(colors, 3)
    );
  }

  renderTickCallback(_: View) {
    if (!vxm.background.isMounted) return;
    vxm.background.updateFlock({
      sceneWidth: this.view.visibleWidthAtZDepth,
      sceneHeight: this.view.visibleHeightAtZDepth,
      timeStep: vxm.background.timeStep,
      updateFlockGeometryCallback: this.updateFlockGeometry,
    });
  }

  touchDrag(event: TouchEvent) {
    const touch = event.touches.item(event.touches.length - 1);
    if (!touch) return;
    this.addBirdFromEvent(touch.clientX, touch.clientY);
  }

  mouseDrag(event: MouseEvent) {
    if (!vxm.background.isDragging || vxm.background.updating) return;
    this.addBirdFromEvent(event.x, event.y);
  }

  addBirdFromEvent(eventX: number, eventY: number) {
    const normClickX = eventX / this.view.viewPort.width;
    const normClickY = eventY / this.view.viewPort.height;
    const halfSceneWidth = this.view.visibleWidthAtZDepth / 2;
    const halfSceneHeight = this.view.visibleHeightAtZDepth / 2;
    const x = lerp(-halfSceneWidth, halfSceneWidth, normClickX);
    const y = -lerp(-halfSceneHeight, halfSceneHeight, normClickY);
    vxm.background.addBirdAtPosition({ x, y });
  }
}
</script>

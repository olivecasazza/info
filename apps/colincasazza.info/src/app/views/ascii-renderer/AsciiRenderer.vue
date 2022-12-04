<template>
  <ViewPortComponent
    class="app-view-port border border-white h-full w-full bg-transparent"
    :view="view"
  />
</template>

<script lang="ts">
import ViewPortComponent from '@app/components/renderer/ViewPortComponent.vue';
import { vxm } from '@app/store';
import throttle from '@app/utils/lodash/throttle';
import { View } from '@app/utils/renderer/view';
import {
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PlaneGeometry,
  PointLight,
  SphereGeometry,
  Vector3,
} from 'three';
import { lerp } from 'three/src/math/MathUtils';
import { Options, Vue } from 'vue-class-component';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

@Options({
  components: {
    ViewPortComponent: ViewPortComponent,
  },
})
export default class BackgroundWrapper extends Vue {
  start = Date.now();
  pointLight1!: PointLight = new PointLight(0xffffff);
  pointLight2!: PointLight = new PointLight(0xffffff, 0.25);
  effect: AsciiEffect = new AsciiEffect(vxm.renderer.renderer, ' .:-+*=%@#', {
    invert: true,
  });
  view!: View;

  get vxm() {
    return vxm;
  }

  created() {
    this.view = new View({
      cameraOptions: {
        fov: 75,
        near: 0.1,
        far: 1200,
        startingPosition: new Vector3(-0.046, -0.028, 6.56),
      },
      controlsOptions: {
        startDirection: new Vector3(0, 0, 0),
        enabled: true,
      },
      id: 'ASCII_RENDERER_VUE',
      background: new Color('black'),
      renderTickCallback: this.renderTickCallback,
    });
    this.pointLight1.position.set(500, 500, 500);
    this.pointLight2.position.set(-500, -500, -500);
  }

  async mounted() {
    // Instantiate a loader
    const loader = new GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/examples/js/libs/draco/');
    loader.setDRACOLoader(dracoLoader);

    // Load a glTF resource
    const gltf = await loader.loadAsync(
      // resource URL
      '/gltf/beating-heart/scene.gltf',
      // called while loading is progressing
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      }
    );
    this.view.scene.add(gltf.scene);
    this.view.scene.add(this.pointLight1);
    this.view.scene.add(this.pointLight2);

    // gltf.animations; // Array<THREE.AnimationClip>
    // gltf.scene; // THREE.Group
    // gltf.scenes; // Array<THREE.Group>
    // gltf.cameras; // Array<THREE.Camera>
    // gltf.asset; // Object
    this.effect.setSize(this.view.visibleWidthAtZDepth, this.view.visibleHeightAtZDepth);
    this.effect.domElement.style.color = 'white';
    this.effect.domElement.style.backgroundColor = 'black';
    // this.view.viewPort.container.appendChild(this.effect.domElement);
    // event listeners
    window.addEventListener('resize', () => {
      this.view.camera.aspect = this.view.visibleWidthAtZDepth /this.view.visibleHeightAtZDepth;
      this.view.camera.updateProjectionMatrix();
      this.effect.setSize(this.view.visibleWidthAtZDepth, this.view.visibleHeightAtZDepth);
    });
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
  }

  renderTickCallback(_: View) {
    // const timer = Date.now() - this.start;
    // console.log(timer);
    // controls.update();
    this.effect.render(this.view.scene, this.view.camera);
    // console.log(this.view.camera.position)
  }

  touchDrag(event: TouchEvent) {
    const touch = event.touches.item(event.touches.length - 1);
    if (!touch) return;
  }

  mouseDrag(event: MouseEvent) {}

  sceneCordsFromEventCords(eventX: number, eventY: number) {
    const normClickX = eventX / this.view.viewPort.width;
    const normClickY = eventY / this.view.viewPort.height;
    const halfSceneWidth = this.view.visibleWidthAtZDepth / 2;
    const halfSceneHeight = this.view.visibleHeightAtZDepth / 2;
    const x = lerp(-halfSceneWidth, halfSceneWidth, normClickX);
    const y = -lerp(-halfSceneHeight, halfSceneHeight, normClickY);
    return { x, y };
  }
}
</script>

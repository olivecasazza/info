import { Color, Object3D, PerspectiveCamera, Scene, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { generateUUID } from "three/src/math/MathUtils";
import { ViewPort } from "./viewPort";

export interface IControlsOptions {
  enabled?: boolean;
  minAzimuthAngle?: number;
  minPolarAngle?: number;
  enableRotate?: boolean;
  startDirection?: Vector3;
}

export interface ICameraOptions {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
  startingPosition?: Vector3;
}

export type IViewData = Object

export interface IViewOptions {
  id: string;
  renderTickCallback: (view: View, timeStepMS: number) => void;
  background?: Color;
  scene?: Scene;
  cameraOptions?: ICameraOptions;
  controlsOptions?: IControlsOptions;
}

export class View {
  options: IViewOptions;
  id: string = generateUUID();
  background: Color = new Color("black");
  scene: Scene = new Scene();
  viewPort: ViewPort = new ViewPort();
  camera!: PerspectiveCamera;
  controls!: OrbitControls;

  renderTickCallback(view: View, timeStepMS: number): void {
    throw new Error('not implemented.')
  }

  constructor(options: IViewOptions) {
    this.options = options;
    Object.assign(this, options)
  }

  get isMounted() {
    return this.viewPort.isMounted || false;
  }

  get visibleHeightAtZDepth(): number {
    // compensate for cameras not positioned at z=0
    const depth = this.camera.position.z;
    // vertical fov in radians
    const vFOV = (this.camera.fov * Math.PI) / 180;
    // Math.abs to ensure the result is always positive
    return 2 * Math.tan(vFOV / 2.0) * Math.abs(depth);
  }

  get visibleWidthAtZDepth(): number {
    const visibleHeight = this.visibleHeightAtZDepth;
    return visibleHeight * this.camera.aspect;
  }

  mount(container: HTMLElement) {
    this.viewPort.mount({ container });
    // create camera
    const defaultCameraOptions = {
      fov: 75,
      near: 0.1,
      far: 10000,
    };
    const cameraOptions = {
      ...defaultCameraOptions,
      ...this.options.cameraOptions,
    };
    const { fov, near, far } = cameraOptions;
    this.camera = new PerspectiveCamera(fov, this.viewPort.aspect, near, far);
    // create controls
    const defaultControlsOptions = {
      minAzimuthAngle: 0,
      minPolarAngle: 0,
      enableRotate: false,
      enabled: false,
    };
    const controlsOptions = {
      ...defaultControlsOptions,
      ...this.options.controlsOptions,
    };
    this.controls = new OrbitControls(this.camera, this.viewPort.container);
    // camera options
    this.camera.aspect = this.viewPort.aspect;
    // controls options
    this.controls.minAzimuthAngle = controlsOptions.minAzimuthAngle;
    this.controls.minPolarAngle = controlsOptions.minPolarAngle;
    this.controls.enableRotate = controlsOptions.enableRotate;
    this.controls.enabled = controlsOptions.enabled;
    this.controls.maxDistance = this.camera.far;
    this.controls.minDistance = this.camera.near;
    // controls/camera start position
    if (cameraOptions.startingPosition) {
      const { x, y, z } = cameraOptions.startingPosition;
      this.controls.center = new Vector3(x, y, z);
      this.camera.position.set(x, y, z);
      this.camera.updateMatrix();
    }
    // controls/camera starting look direction
    if (controlsOptions.startDirection) {
      const { x, y, z } = controlsOptions.startDirection;
      this.controls.target = new Vector3(x, y, z);
      this.camera.lookAt(x, y, z);
      this.camera.updateMatrix();
    }
    this.viewPort.isMounted = true;
  }

  positionCamera(vector: Vector3): void {
    const { x, y, z } = vector;
    this.controls.center = new Vector3(x, y, z);
    this.camera.position.set(x, y, z);
    this.controls.target = new Vector3(x, y, 0);
    this.camera.lookAt(x, y, 0);
    this.camera.updateMatrix();
  }

  removeEntities(...entities: Object3D[]) {
    this.scene.children = this.scene.children.filter(e => !entities.includes(e))
  }
}

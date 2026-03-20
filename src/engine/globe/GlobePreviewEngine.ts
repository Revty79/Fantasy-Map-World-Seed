import {
  CanvasTexture,
  ClampToEdgeWrapping,
  Color,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  RepeatWrapping,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const DEFAULT_CAMERA_POSITION = new Vector3(0, 0.35, 3.15);

const fitCanvasToTextureLimit = (
  sourceCanvas: HTMLCanvasElement,
  maxTextureSize: number,
): HTMLCanvasElement => {
  const safeLimit = Math.max(64, Math.floor(maxTextureSize));
  const scale = Math.min(1, safeLimit / sourceCanvas.width, safeLimit / sourceCanvas.height);
  if (scale >= 1) {
    return sourceCanvas;
  }

  const resizedCanvas = document.createElement("canvas");
  resizedCanvas.width = Math.max(1, Math.floor(sourceCanvas.width * scale));
  resizedCanvas.height = Math.max(1, Math.floor(sourceCanvas.height * scale));

  const context = resizedCanvas.getContext("2d");
  if (!context) {
    return sourceCanvas;
  }

  context.imageSmoothingEnabled = true;
  context.drawImage(sourceCanvas, 0, 0, resizedCanvas.width, resizedCanvas.height);
  return resizedCanvas;
};

export class GlobePreviewEngine {
  private readonly host: HTMLElement;
  private renderer: WebGLRenderer | null = null;
  private scene: Scene | null = null;
  private camera: PerspectiveCamera | null = null;
  private controls: OrbitControls | null = null;
  private globeGeometry: SphereGeometry | null = null;
  private globeMaterial: MeshBasicMaterial | null = null;
  private globeTexture: CanvasTexture | null = null;
  private readonly cameraResetPosition = DEFAULT_CAMERA_POSITION.clone();

  constructor(host: HTMLElement) {
    this.host = host;
  }

  initialize(): void {
    if (this.renderer) {
      return;
    }

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(new Color("#050911"), 1);
    this.host.appendChild(renderer.domElement);

    const scene = new Scene();

    const camera = new PerspectiveCamera(44, 1, 0.1, 100);
    camera.position.copy(this.cameraResetPosition);
    camera.lookAt(0, 0, 0);

    const globeGeometry = new SphereGeometry(1, 128, 96);
    const globeMaterial = new MeshBasicMaterial({
      color: "#fefefe",
    });
    const globeMesh = new Mesh(globeGeometry, globeMaterial);
    globeMesh.rotation.y = Math.PI / 2;
    scene.add(globeMesh);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    controls.minDistance = 1.6;
    controls.maxDistance = 5.8;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1;
    controls.target.set(0, 0, 0);
    controls.update();

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.globeGeometry = globeGeometry;
    this.globeMaterial = globeMaterial;

    this.resize();
    renderer.setAnimationLoop(this.renderFrame);
  }

  setTextureFromCanvas(canvas: HTMLCanvasElement): void {
    if (!this.renderer || !this.globeMaterial) {
      return;
    }

    const boundedCanvas = fitCanvasToTextureLimit(canvas, this.renderer.capabilities.maxTextureSize);
    const nextTexture = new CanvasTexture(boundedCanvas);
    nextTexture.colorSpace = SRGBColorSpace;
    nextTexture.wrapS = RepeatWrapping;
    nextTexture.wrapT = ClampToEdgeWrapping;
    nextTexture.minFilter = LinearMipmapLinearFilter;
    nextTexture.magFilter = LinearFilter;
    nextTexture.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
    nextTexture.needsUpdate = true;

    if (this.globeTexture) {
      this.globeTexture.dispose();
    }

    this.globeTexture = nextTexture;
    this.globeMaterial.map = nextTexture;
    this.globeMaterial.needsUpdate = true;
  }

  resetView(): void {
    if (!this.camera || !this.controls) {
      return;
    }

    this.camera.position.copy(this.cameraResetPosition);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  resize(): void {
    if (!this.renderer || !this.camera) {
      return;
    }

    const width = Math.max(1, this.host.clientWidth);
    const height = Math.max(1, this.host.clientHeight);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  dispose(): void {
    if (!this.renderer) {
      return;
    }

    this.renderer.setAnimationLoop(null);
    this.controls?.dispose();

    if (this.globeTexture) {
      this.globeTexture.dispose();
      this.globeTexture = null;
    }

    this.globeMaterial?.dispose();
    this.globeGeometry?.dispose();

    const canvas = this.renderer.domElement;
    this.renderer.dispose();
    if (this.host.contains(canvas)) {
      this.host.removeChild(canvas);
    }

    this.globeGeometry = null;
    this.globeMaterial = null;
    this.controls = null;
    this.camera = null;
    this.scene = null;
    this.renderer = null;
  }

  private readonly renderFrame = (): void => {
    if (!this.renderer || !this.scene || !this.camera) {
      return;
    }

    this.controls?.update();
    this.renderer.render(this.scene, this.camera);
  };
}

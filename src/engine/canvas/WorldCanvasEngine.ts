import {
  Application,
  Container,
  FederatedPointerEvent,
  Graphics,
  Rectangle,
  Text,
  TextStyle,
} from "pixi.js";
import { useEditorStore } from "../../store/editorStore";
import type { DocumentPoint } from "../../types";
import { hitTestVectorFeature, hitTestVertex } from "../../lib/geometry/vectorMath";
import { getVisibleWorldRect, screenToWorld, zoomAtScreenPoint } from "../camera/cameraMath";
import { getVisibleChunks } from "../spatial/chunkMath";
import type { CanvasRenderInput, CanvasRuntimeCallbacks } from "./types";

const MIN_ZOOM = 0.08;
const MAX_ZOOM = 32;

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

const toHex = (cssColor: string): number => {
  const cleaned = cssColor.replace("#", "").trim();
  const normalized = cleaned.length === 3 ? cleaned.split("").map((part) => `${part}${part}`).join("") : cleaned;
  const parsed = Number.parseInt(normalized, 16);

  if (Number.isNaN(parsed)) {
    return 0xffffff;
  }

  return parsed;
};

const isEditableTargetFocused = (): boolean => {
  const active = document.activeElement as HTMLElement | null;

  if (!active) {
    return false;
  }

  const tag = active.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || active.isContentEditable;
};

interface DraggedVertexState {
  layerId: string;
  featureId: string;
  vertexIndex: number;
}

interface DraggedFeatureState {
  layerId: string;
  featureId: string;
  startWorld: DocumentPoint;
  lastWorld: DocumentPoint;
}

interface DraggedSymbolState {
  layerId: string;
  symbolId: string;
  startWorld: DocumentPoint;
  lastWorld: DocumentPoint;
}

interface DraggedLabelState {
  layerId: string;
  labelId: string;
  startWorld: DocumentPoint;
  lastWorld: DocumentPoint;
}

export class WorldCanvasEngine {
  private readonly host: HTMLElement;
  private readonly callbacks: CanvasRuntimeCallbacks;
  private app: Application | null = null;

  private readonly worldContainer = new Container();
  private readonly baseContainer = new Container();
  private readonly documentLayerContainer = new Container();
  private readonly gridContainer = new Container();
  private readonly chunkOverlayContainer = new Container();
  private readonly interactionOverlayContainer = new Container();
  private readonly screenOverlayContainer = new Container();

  private readonly worldGraphics = new Graphics();
  private readonly gridGraphics = new Graphics();
  private readonly chunkGraphics = new Graphics();
  private readonly mapExtentGraphics = new Graphics();
  private readonly selectionGraphics = new Graphics();
  private readonly draftGraphics = new Graphics();
  private readonly brushCursorGraphics = new Graphics();

  private readonly mapLabel = new Text({
    text: "",
    style: new TextStyle({
      fill: 0xc9d8f7,
      fontSize: 16,
      fontFamily: "Segoe UI",
      fontWeight: "600",
    }),
  });

  private currentInput: CanvasRenderInput | null = null;
  private readonly layerContainers = new Map<string, Container>();
  private readonly vectorGraphicsByLayer = new Map<string, Graphics>();
  private readonly paintGraphicsByLayer = new Map<string, Graphics>();
  private readonly symbolContainersByLayer = new Map<string, Container>();
  private readonly labelContainersByLayer = new Map<string, Container>();

  private pointerDown = false;
  private panActive = false;
  private spacePressed = false;
  private panStartScreen = { x: 0, y: 0 };
  private panStartCamera = { x: 0, y: 0 };
  private draggedVertex: DraggedVertexState | null = null;
  private draggedFeature: DraggedFeatureState | null = null;
  private draggedSymbol: DraggedSymbolState | null = null;
  private draggedLabel: DraggedLabelState | null = null;
  private paintActive = false;
  private hoverWorldPoint: DocumentPoint | null = null;

  private resizeObserver: ResizeObserver | null = null;

  constructor(host: HTMLElement, callbacks: CanvasRuntimeCallbacks) {
    this.host = host;
    this.callbacks = callbacks;
  }

  public async init(): Promise<void> {
    if (this.app) {
      return;
    }

    const app = new Application();
    await app.init({
      antialias: true,
      background: "#0f1522",
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      resizeTo: this.host,
    });

    this.app = app;
    this.host.appendChild(app.canvas);

    app.stage.eventMode = "static";
    app.stage.hitArea = new Rectangle(0, 0, this.host.clientWidth, this.host.clientHeight);

    this.baseContainer.addChild(this.worldGraphics);
    this.gridContainer.addChild(this.gridGraphics);
    this.chunkOverlayContainer.addChild(this.chunkGraphics);
    this.interactionOverlayContainer.addChild(this.mapExtentGraphics);
    this.interactionOverlayContainer.addChild(this.selectionGraphics);
    this.interactionOverlayContainer.addChild(this.draftGraphics);
    this.interactionOverlayContainer.addChild(this.brushCursorGraphics);
    this.screenOverlayContainer.addChild(this.mapLabel);

    this.worldContainer.addChild(this.baseContainer);
    this.worldContainer.addChild(this.documentLayerContainer);
    this.worldContainer.addChild(this.gridContainer);
    this.worldContainer.addChild(this.chunkOverlayContainer);
    this.worldContainer.addChild(this.interactionOverlayContainer);

    app.stage.addChild(this.worldContainer);
    app.stage.addChild(this.screenOverlayContainer);

    app.stage.on("pointerdown", this.onPointerDown);
    app.stage.on("pointermove", this.onPointerMove);
    app.stage.on("pointerup", this.endPointer);
    app.stage.on("pointerupoutside", this.endPointer);
    app.stage.on("pointerleave", this.onPointerLeave);

    app.canvas.addEventListener("wheel", this.onWheel, { passive: false });
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    this.resizeObserver = new ResizeObserver(() => {
      if (!this.currentInput || !this.app) {
        return;
      }

      this.app.stage.hitArea = new Rectangle(0, 0, this.host.clientWidth, this.host.clientHeight);

      const nextView = {
        ...this.currentInput.view,
        viewportWidth: Math.max(1, this.host.clientWidth),
        viewportHeight: Math.max(1, this.host.clientHeight),
      };

      this.callbacks.onViewChange(nextView);
    });

    this.resizeObserver.observe(this.host);
  }

  public update(input: CanvasRenderInput): void {
    this.currentInput = input;
    const visibleRect = getVisibleWorldRect(input.view);
    const visibleChunks = getVisibleChunks(
      visibleRect,
      input.map.settings.chunkSize,
      input.map.dimensions.width,
      input.map.dimensions.height,
    );

    this.syncLayerContainers(input.layers);
    this.drawWorldBounds(input);
    this.drawPaintLayers(input, visibleChunks);
    this.drawVectorLayers(input);
    this.drawSymbolLayers(input);
    this.drawLabelLayers(input);
    this.drawChildMapExtents(input);
    this.drawGrid(input);
    this.drawChunkOverlay(input, visibleChunks);
    this.drawSelectionOverlay(input);
    this.drawDraftOverlay(input);
    this.drawBrushCursor(input);
    this.applyView(input.view);
    this.updateCursor(this.hoverWorldPoint);

    this.mapLabel.text = `${input.map.name} (${input.map.scope.toUpperCase()})`;
    this.mapLabel.position.set(14, 14);
  }

  public destroy(): void {
    if (!this.app) {
      return;
    }

    this.app.stage.off("pointerdown", this.onPointerDown);
    this.app.stage.off("pointermove", this.onPointerMove);
    this.app.stage.off("pointerup", this.endPointer);
    this.app.stage.off("pointerupoutside", this.endPointer);
    this.app.stage.off("pointerleave", this.onPointerLeave);

    this.app.canvas.removeEventListener("wheel", this.onWheel);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    this.app.destroy(true, { children: true });
    this.layerContainers.clear();
    this.vectorGraphicsByLayer.clear();
    this.paintGraphicsByLayer.clear();
    this.symbolContainersByLayer.clear();
    this.labelContainersByLayer.clear();
    this.host.style.cursor = "";
    this.app = null;
  }

  private readonly onPointerDown = (event: FederatedPointerEvent) => {
    this.pointerDown = true;

    if (!this.currentInput) {
      return;
    }

    const worldPoint = screenToWorld({ x: event.global.x, y: event.global.y }, this.currentInput.view);
    this.hoverWorldPoint = worldPoint;
    this.callbacks.onPointerMove(worldPoint.x, worldPoint.y);

    this.panStartScreen = { x: event.global.x, y: event.global.y };

    const shouldPan =
      this.currentInput.activeTool === "pan" || this.spacePressed || event.button === 1 || event.buttons === 4;

    if (shouldPan) {
      this.panActive = true;
      this.panStartCamera = {
        x: this.currentInput.view.cameraX,
        y: this.currentInput.view.cameraY,
      };
      this.updateCursor(worldPoint);
      return;
    }

    if (event.button !== 0) {
      return;
    }

    if (this.currentInput.activeTool === "select") {
      this.handleSelectPointerDown(worldPoint, event.detail);
      return;
    }

    if (["coastline", "river", "border", "road"].includes(this.currentInput.activeTool)) {
      useEditorStore.getState().appendVectorDrawPoint(worldPoint.x, worldPoint.y, event.detail);
      return;
    }

    if (this.currentInput.activeTool === "paint" || this.currentInput.activeTool === "erase") {
      this.paintActive = true;
      const selectedLayer = this.currentInput.layers.find((layer) => layer.id === this.currentInput?.selectedLayerId);
      const canPaintOnLayer =
        selectedLayer &&
        (selectedLayer.kind === "paint" || selectedLayer.kind === "mask" || selectedLayer.kind === "dataOverlay") &&
        selectedLayer.visible &&
        !selectedLayer.locked;

      if (canPaintOnLayer) {
        useEditorStore.getState().checkpointHistory("Paint stroke");
      }

      useEditorStore.getState().applyBrushSample(worldPoint.x, worldPoint.y);
      return;
    }

    if (this.currentInput.activeTool === "symbol") {
      useEditorStore.getState().placeSymbolAt(worldPoint.x, worldPoint.y);
      return;
    }

    if (this.currentInput.activeTool === "label") {
      useEditorStore.getState().placeLabelAt(worldPoint.x, worldPoint.y);
      return;
    }

    if (this.currentInput.activeTool === "extent") {
      useEditorStore.getState().beginExtentSelection(worldPoint.x, worldPoint.y);
    }

    this.updateCursor(worldPoint);
  };

  private readonly onPointerMove = (event: FederatedPointerEvent) => {
    if (!this.currentInput) {
      return;
    }

    const view = this.currentInput.view;
    const worldPoint = screenToWorld({ x: event.global.x, y: event.global.y }, view);
    this.hoverWorldPoint = worldPoint;
    this.updateCursor(worldPoint);
    this.callbacks.onPointerMove(worldPoint.x, worldPoint.y);

    if (this.pointerDown && this.draggedVertex) {
      useEditorStore
        .getState()
        .moveVectorVertex(this.draggedVertex.layerId, this.draggedVertex.featureId, this.draggedVertex.vertexIndex, worldPoint.x, worldPoint.y);
      return;
    }

    if (this.pointerDown && this.draggedFeature) {
      const deltaX = worldPoint.x - this.draggedFeature.lastWorld.x;
      const deltaY = worldPoint.y - this.draggedFeature.lastWorld.y;
      useEditorStore
        .getState()
        .moveVectorFeature(this.draggedFeature.layerId, this.draggedFeature.featureId, deltaX, deltaY);
      this.draggedFeature.lastWorld = worldPoint;
      return;
    }

    if (this.pointerDown && this.draggedSymbol) {
      useEditorStore
        .getState()
        .moveSymbol(this.draggedSymbol.layerId, this.draggedSymbol.symbolId, worldPoint.x, worldPoint.y);
      this.draggedSymbol.lastWorld = worldPoint;
      return;
    }

    if (this.pointerDown && this.draggedLabel) {
      useEditorStore.getState().moveLabel(this.draggedLabel.layerId, this.draggedLabel.labelId, worldPoint.x, worldPoint.y);
      this.draggedLabel.lastWorld = worldPoint;
      return;
    }

    if (this.pointerDown && this.paintActive) {
      useEditorStore.getState().applyBrushSample(worldPoint.x, worldPoint.y);
      this.drawBrushCursor(this.currentInput);
      return;
    }

    if (this.pointerDown && this.currentInput.activeTool === "extent" && this.currentInput.inProgressExtent) {
      useEditorStore.getState().updateExtentSelection(worldPoint.x, worldPoint.y);
      this.drawDraftOverlay(this.currentInput);
      return;
    }

    if (!this.pointerDown || !this.panActive) {
      if (this.currentInput.inProgressDraw) {
        this.drawDraftOverlay(this.currentInput);
      }
      this.drawBrushCursor(this.currentInput);
      return;
    }

    const deltaX = event.global.x - this.panStartScreen.x;
    const deltaY = event.global.y - this.panStartScreen.y;

    const nextView = {
      ...view,
      cameraX: this.panStartCamera.x - deltaX / view.zoom,
      cameraY: this.panStartCamera.y - deltaY / view.zoom,
    };

    this.applyView(nextView);
    this.callbacks.onViewChange(nextView);
  };

  private readonly onPointerLeave = () => {
    this.hoverWorldPoint = null;
    this.paintActive = false;
    this.updateCursor(null);
    this.callbacks.onPointerMove(null, null);
  };

  private readonly endPointer = () => {
    this.pointerDown = false;
    this.panActive = false;
    this.draggedVertex = null;
    this.draggedFeature = null;
    this.draggedSymbol = null;
    this.draggedLabel = null;
    this.paintActive = false;
    this.updateCursor(this.hoverWorldPoint);
  };

  private readonly onWheel = (event: WheelEvent) => {
    event.preventDefault();

    if (!this.currentInput) {
      return;
    }

    const factor = Math.exp(-event.deltaY * 0.0018);
    const nextZoom = clamp(this.currentInput.view.zoom * factor, MIN_ZOOM, MAX_ZOOM);

    const cameraView = zoomAtScreenPoint(
      this.currentInput.view,
      {
        x: event.offsetX,
        y: event.offsetY,
      },
      nextZoom,
    );

    const nextView = {
      ...this.currentInput.view,
      ...cameraView,
    };

    this.applyView(nextView);
    this.callbacks.onViewChange(nextView);
  };

  private readonly onKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      this.spacePressed = true;
      this.updateCursor(this.hoverWorldPoint);
      return;
    }

    if (isEditableTargetFocused()) {
      return;
    }

    const store = useEditorStore.getState();
    const modifierPressed = event.ctrlKey || event.metaKey;

    if (modifierPressed && event.key.toLowerCase() === "z") {
      event.preventDefault();

      if (event.shiftKey) {
        store.redo();
      } else {
        store.undo();
      }

      return;
    }

    if (modifierPressed && event.key.toLowerCase() === "y") {
      event.preventDefault();
      store.redo();
      return;
    }

    if (modifierPressed && event.key.toLowerCase() === "d") {
      event.preventDefault();
      store.duplicateSelection();
      return;
    }

    if (event.key === "Enter") {
      const selection = store.session.selection;

      if (store.session.activeTool === "extent") {
        event.preventDefault();
        store.commitExtentSelection();
        return;
      }

      if (selection.type === "map-extent") {
        event.preventDefault();
        store.openChildMapFromLink(selection.linkId);
        return;
      }

      if (selection.type === "label") {
        event.preventDefault();
        this.openLabelTextPrompt(selection.layerId, selection.labelId);
        return;
      }

      store.completeVectorDraw();
    }

    if (event.key === "Escape") {
      if (store.session.activeTool === "extent") {
        event.preventDefault();
        store.cancelExtentSelection();
      } else {
        store.cancelVectorDraw();
      }
    }

    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      store.deleteSelection();
    }

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      const store = useEditorStore.getState();
      const selection = store.session.selection;
      const nudgeAmount = event.shiftKey ? 10 : 1;
      let deltaX = 0;
      let deltaY = 0;

      if (event.key === "ArrowUp") deltaY = -nudgeAmount;
      if (event.key === "ArrowDown") deltaY = nudgeAmount;
      if (event.key === "ArrowLeft") deltaX = -nudgeAmount;
      if (event.key === "ArrowRight") deltaX = nudgeAmount;

      if (selection.type === "vector") {
        event.preventDefault();
        store.moveVectorFeature(selection.layerId, selection.featureId, deltaX, deltaY);
        store.checkpointHistory("Nudge vector feature");
      }

      if (selection.type === "symbol") {
        const activeMap = store.document.maps[store.session.activeMapId];

        if (activeMap) {
          const layer = activeMap.layers[selection.layerId];
          if (layer && layer.kind === "symbol") {
            const symbol = layer.symbols[selection.symbolId];
            if (symbol) {
              event.preventDefault();
              const newX = symbol.position.x + deltaX;
              const newY = symbol.position.y + deltaY;
              store.moveSymbol(selection.layerId, selection.symbolId, newX, newY);
              store.checkpointHistory("Nudge symbol");
            }
          }
        }
      }

      if (selection.type === "label") {
        const activeMap = store.document.maps[store.session.activeMapId];

        if (activeMap) {
          const layer = activeMap.layers[selection.layerId];
          if (layer && layer.kind === "label") {
            const label = layer.labels[selection.labelId];
            if (label) {
              event.preventDefault();
              const newX = label.position.x + deltaX;
              const newY = label.position.y + deltaY;
              store.moveLabel(selection.layerId, selection.labelId, newX, newY);
              store.checkpointHistory("Nudge label");
            }
          }
        }
      }
    }
  };

  private readonly onKeyUp = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      this.spacePressed = false;
      this.updateCursor(this.hoverWorldPoint);
    }
  };

  private updateCursor(worldPoint: DocumentPoint | null): void {
    if (!this.currentInput) {
      return;
    }

    if (this.panActive || this.draggedVertex || this.draggedFeature || this.draggedSymbol || this.draggedLabel) {
      this.host.style.cursor = "grabbing";
      return;
    }

    if (this.spacePressed || this.currentInput.activeTool === "pan") {
      this.host.style.cursor = "grab";
      return;
    }

    if (
      this.currentInput.activeTool === "coastline" ||
      this.currentInput.activeTool === "river" ||
      this.currentInput.activeTool === "border" ||
      this.currentInput.activeTool === "road" ||
      this.currentInput.activeTool === "paint" ||
      this.currentInput.activeTool === "erase" ||
      this.currentInput.activeTool === "symbol" ||
      this.currentInput.activeTool === "label" ||
      this.currentInput.activeTool === "extent"
    ) {
      this.host.style.cursor = "crosshair";
      return;
    }

    if (this.currentInput.activeTool === "select" && worldPoint) {
      const hitTolerance = 8 / this.currentInput.view.zoom;
      const hitSelection = this.hitTestTopSelectable(worldPoint, hitTolerance);
      const hitExtent = this.hitTestChildExtentBorder(worldPoint, hitTolerance);
      this.host.style.cursor = hitSelection || hitExtent ? "pointer" : "default";
      return;
    }

    this.host.style.cursor = "default";
  }

  private handleSelectPointerDown(worldPoint: DocumentPoint, clickCount: number): void {
    if (!this.currentInput) {
      return;
    }

    const store = useEditorStore.getState();
    const hitTolerance = 8 / this.currentInput.view.zoom;
    const currentSelection = this.currentInput.selection;

    if (currentSelection.type === "vector" || currentSelection.type === "vector-vertex") {
      const selectedLayer = this.currentInput.layers.find((layer) => layer.id === currentSelection.layerId);

      if (selectedLayer && selectedLayer.kind === "vector") {
        const selectedFeature = selectedLayer.features[currentSelection.featureId];

        if (selectedFeature && !selectedLayer.locked) {
          const vertexIndex = hitTestVertex(selectedFeature.points, worldPoint, hitTolerance);

          if (vertexIndex !== null) {
            store.checkpointHistory("Move vector vertex");
            this.draggedVertex = {
              layerId: selectedLayer.id,
              featureId: selectedFeature.id,
              vertexIndex,
            };

            store.selectVectorVertex(selectedLayer.id, selectedFeature.id, vertexIndex);
            return;
          }

          if (hitTestVectorFeature(selectedFeature, worldPoint, hitTolerance)) {
            store.checkpointHistory("Move vector feature");
            this.draggedFeature = {
              layerId: selectedLayer.id,
              featureId: selectedFeature.id,
              startWorld: worldPoint,
              lastWorld: worldPoint,
            };
            return;
          }
        }
      }
    }

    if (currentSelection.type === "symbol") {
      const selectedLayer = this.currentInput.layers.find((layer) => layer.id === currentSelection.layerId);

      if (selectedLayer && selectedLayer.kind === "symbol") {
        const selectedSymbol = selectedLayer.symbols[currentSelection.symbolId];

        if (selectedSymbol && !selectedLayer.locked) {
          const distX = selectedSymbol.position.x - worldPoint.x;
          const distY = selectedSymbol.position.y - worldPoint.y;
          const distance = Math.sqrt(distX * distX + distY * distY);
          const hitRadius = (24 / this.currentInput.view.zoom / 2 + hitTolerance) * selectedSymbol.scale;

          if (distance <= hitRadius) {
            store.checkpointHistory("Move symbol");
            this.draggedSymbol = {
              layerId: selectedLayer.id,
              symbolId: currentSelection.symbolId,
              startWorld: worldPoint,
              lastWorld: worldPoint,
            };
            return;
          }
        }
      }
    }

    if (currentSelection.type === "label") {
      const selectedLayer = this.currentInput.layers.find((layer) => layer.id === currentSelection.layerId);

      if (selectedLayer && selectedLayer.kind === "label") {
        const selectedLabel = selectedLayer.labels[currentSelection.labelId];

        if (selectedLabel && !selectedLayer.locked && this.hitTestLabel(selectedLabel, worldPoint, hitTolerance)) {
          if (clickCount >= 2) {
            this.openLabelTextPrompt(selectedLayer.id, selectedLabel.id);
            return;
          }

          store.checkpointHistory("Move label");
          this.draggedLabel = {
            layerId: selectedLayer.id,
            labelId: selectedLabel.id,
            startWorld: worldPoint,
            lastWorld: worldPoint,
          };
          return;
        }
      }
    }

    const extentHit = this.hitTestChildExtentBorder(worldPoint, hitTolerance);

    if (extentHit) {
      store.setSelection({ type: "map-extent", linkId: extentHit });

      if (clickCount >= 2) {
        store.openChildMapFromLink(extentHit);
      }

      return;
    }

    const topHit = this.hitTestTopSelectable(worldPoint, hitTolerance);

    if (!topHit) {
      if (this.currentInput.selectedLayerId) {
        store.setSelection({ type: "layer", layerId: this.currentInput.selectedLayerId });
      } else {
        store.setSelection({ type: "none" });
      }
      return;
    }

    if (topHit.type === "vector") {
      store.selectVectorFeature(topHit.layerId, topHit.featureId);
      return;
    }

    if (topHit.type === "symbol") {
      store.selectSymbol(topHit.layerId, topHit.symbolId);
      return;
    }

    store.selectLabel(topHit.layerId, topHit.labelId);
    if (clickCount >= 2) {
      this.openLabelTextPrompt(topHit.layerId, topHit.labelId);
    }
  }

  private hitTestLabel(
    label: {
      text: string;
      style: { fontSize: number; align: "left" | "center" | "right" };
      position: DocumentPoint;
      rotationDegrees: number;
      anchorX: number;
      anchorY: number;
    },
    worldPoint: DocumentPoint,
    tolerance: number,
  ): boolean {
    const fontSize = Math.max(8, label.style.fontSize);
    const width = Math.max(fontSize * 0.5, label.text.length * fontSize * 0.55);
    const height = Math.max(fontSize * 1.2, 12);
    const localLeft = -label.anchorX * width;
    const localTop = -label.anchorY * height;
    const angle = (label.rotationDegrees * Math.PI) / 180;
    const cos = Math.cos(-angle);
    const sin = Math.sin(-angle);
    const dx = worldPoint.x - label.position.x;
    const dy = worldPoint.y - label.position.y;
    const localX = dx * cos - dy * sin;
    const localY = dx * sin + dy * cos;

    return (
      localX >= localLeft - tolerance &&
      localX <= localLeft + width + tolerance &&
      localY >= localTop - tolerance &&
      localY <= localTop + height + tolerance
    );
  }

  private hitTestChildExtentBorder(worldPoint: DocumentPoint, tolerance: number): string | null {
    if (!this.currentInput) {
      return null;
    }

    const links = Object.values(this.currentInput.map.nestedLinks).filter(
      (link) => link.parentMapId === this.currentInput?.map.id,
    );

    for (let index = links.length - 1; index >= 0; index -= 1) {
      const link = links[index];
      const rect = link.parentExtent;
      const inOuterBounds =
        worldPoint.x >= rect.x - tolerance &&
        worldPoint.x <= rect.x + rect.width + tolerance &&
        worldPoint.y >= rect.y - tolerance &&
        worldPoint.y <= rect.y + rect.height + tolerance;

      if (!inOuterBounds) {
        continue;
      }

      const hasInnerArea = rect.width > tolerance * 2 && rect.height > tolerance * 2;
      const inInnerBounds =
        hasInnerArea &&
        worldPoint.x > rect.x + tolerance &&
        worldPoint.x < rect.x + rect.width - tolerance &&
        worldPoint.y > rect.y + tolerance &&
        worldPoint.y < rect.y + rect.height - tolerance;

      if (!inInnerBounds) {
        return link.id;
      }
    }

    return null;
  }

  private hitTestTopSelectable(
    worldPoint: DocumentPoint,
    tolerance: number,
  ):
    | { type: "vector"; layerId: string; featureId: string }
    | { type: "symbol"; layerId: string; symbolId: string }
    | { type: "label"; layerId: string; labelId: string }
    | null {
    if (!this.currentInput) {
      return null;
    }

    for (let layerIndex = this.currentInput.layers.length - 1; layerIndex >= 0; layerIndex -= 1) {
      const layer = this.currentInput.layers[layerIndex];

      if (!layer.visible) {
        continue;
      }

      if (layer.kind === "label") {
        for (let labelIndex = layer.labelOrder.length - 1; labelIndex >= 0; labelIndex -= 1) {
          const labelId = layer.labelOrder[labelIndex];
          const label = layer.labels[labelId];

          if (!label) {
            continue;
          }

          if (this.hitTestLabel(label, worldPoint, tolerance)) {
            return { type: "label", layerId: layer.id, labelId };
          }
        }
      }

      if (layer.kind === "symbol") {
        for (let symbolIndex = layer.symbolOrder.length - 1; symbolIndex >= 0; symbolIndex -= 1) {
          const symbolId = layer.symbolOrder[symbolIndex];
          const symbol = layer.symbols[symbolId];

          if (!symbol) {
            continue;
          }

          const distX = symbol.position.x - worldPoint.x;
          const distY = symbol.position.y - worldPoint.y;
          const distance = Math.sqrt(distX * distX + distY * distY);
          const hitRadius = (24 / this.currentInput.view.zoom / 2 + tolerance) * symbol.scale;

          if (distance <= hitRadius) {
            return { type: "symbol", layerId: layer.id, symbolId };
          }
        }
      }

      if (layer.kind === "vector") {
        for (let featureIndex = layer.featureOrder.length - 1; featureIndex >= 0; featureIndex -= 1) {
          const featureId = layer.featureOrder[featureIndex];
          const feature = layer.features[featureId];

          if (!feature) {
            continue;
          }

          if (hitTestVectorFeature(feature, worldPoint, tolerance)) {
            return { type: "vector", layerId: layer.id, featureId };
          }
        }
      }
    }

    return null;
  }

  private openLabelTextPrompt(layerId: string, labelId: string): void {
    const store = useEditorStore.getState();
    const map = store.document.maps[store.session.activeMapId];
    const layer = map.layers[layerId];

    if (!layer || layer.kind !== "label" || layer.locked || !layer.visible) {
      return;
    }

    const label = layer.labels[labelId];

    if (!label) {
      return;
    }

    const inputText = window.prompt("Edit label text", label.text);

    if (inputText === null) {
      return;
    }

    store.updateLabel(layerId, labelId, { text: inputText }, "Edit label text");
  }

  private syncLayerContainers(layers: CanvasRenderInput["layers"]): void {
    const knownIds = new Set<string>();

    for (const layer of layers) {
      knownIds.add(layer.id);

      const existing = this.layerContainers.get(layer.id);
      const container = existing ?? new Container();

      container.visible = layer.visible;
      container.alpha = layer.opacity;
      container.label = layer.name;

      if (!existing) {
        this.layerContainers.set(layer.id, container);
      }
    }

    for (const [layerId, container] of this.layerContainers.entries()) {
      if (knownIds.has(layerId)) {
        continue;
      }

      container.removeFromParent();
      this.layerContainers.delete(layerId);

      const vectorGraphics = this.vectorGraphicsByLayer.get(layerId);
      if (vectorGraphics) {
        vectorGraphics.removeFromParent();
        this.vectorGraphicsByLayer.delete(layerId);
      }

      const paintGraphics = this.paintGraphicsByLayer.get(layerId);
      if (paintGraphics) {
        paintGraphics.removeFromParent();
        this.paintGraphicsByLayer.delete(layerId);
      }

      const symbolContainer = this.symbolContainersByLayer.get(layerId);
      if (symbolContainer) {
        symbolContainer.removeFromParent();
        this.symbolContainersByLayer.delete(layerId);
      }

      const labelContainer = this.labelContainersByLayer.get(layerId);
      if (labelContainer) {
        labelContainer.removeFromParent();
        this.labelContainersByLayer.delete(layerId);
      }
    }

    for (const layer of layers) {
      const container = this.layerContainers.get(layer.id);

      if (!container) {
        continue;
      }

      if (container.parent !== this.documentLayerContainer) {
        this.documentLayerContainer.addChild(container);
      }
    }
  }

  private drawWorldBounds(input: CanvasRenderInput): void {
    const width = input.map.dimensions.width;
    const height = input.map.dimensions.height;

    this.worldGraphics.clear();
    this.worldGraphics.rect(0, 0, width, height);
    this.worldGraphics.fill({ color: 0x1a2a45, alpha: 0.95 });
    this.worldGraphics.stroke({ color: 0x7ea7ee, width: 2, alpha: 0.85 });

    const seamColor = 0x45618e;
    this.worldGraphics.moveTo(0, 0);
    this.worldGraphics.lineTo(0, height);
    this.worldGraphics.moveTo(width, 0);
    this.worldGraphics.lineTo(width, height);
    this.worldGraphics.stroke({ color: seamColor, width: 1, alpha: 0.8 });
  }

  private drawPaintLayers(input: CanvasRenderInput, visibleChunks: Array<{ key: string; x: number; y: number }>): void {
    for (const layer of input.layers) {
      const layerContainer = this.layerContainers.get(layer.id);

      if (!layerContainer) {
        continue;
      }

      if (layer.kind !== "paint" && layer.kind !== "mask" && layer.kind !== "dataOverlay") {
        continue;
      }

      const paintGraphics = this.paintGraphicsByLayer.get(layer.id) ?? new Graphics();
      this.paintGraphicsByLayer.set(layer.id, paintGraphics);

      if (paintGraphics.parent !== layerContainer) {
        layerContainer.addChild(paintGraphics);
      }

      paintGraphics.clear();

      for (const chunkRef of visibleChunks) {
        const chunk = layer.chunks[chunkRef.key];

        if (!chunk) {
          continue;
        }

        for (const cell of Object.values(chunk.cells)) {
          const worldX = chunk.chunkX * layer.chunkSize + cell.x * layer.cellSize;
          const worldY = chunk.chunkY * layer.chunkSize + cell.y * layer.cellSize;

          let color = cell.sample.color;

          if (layer.kind === "mask") {
            color = cell.sample.category === "ocean" || cell.sample.value === 0 ? "#4c78c6" : "#73b486";
          }

          if (layer.kind === "dataOverlay" && cell.sample.category && layer.settings.legend[cell.sample.category]) {
            color = layer.settings.legend[cell.sample.category];
          }

          paintGraphics.rect(worldX, worldY, layer.cellSize, layer.cellSize);
          paintGraphics.fill({
            color: toHex(color),
            alpha: cell.sample.opacity,
          });
        }
      }
    }
  }

  private drawVectorLayers(input: CanvasRenderInput): void {
    for (const layer of input.layers) {
      const layerContainer = this.layerContainers.get(layer.id);

      if (!layerContainer) {
        continue;
      }

      if (layer.kind !== "vector") {
        continue;
      }

      const vectorGraphics = this.vectorGraphicsByLayer.get(layer.id) ?? new Graphics();
      this.vectorGraphicsByLayer.set(layer.id, vectorGraphics);

      if (vectorGraphics.parent !== layerContainer) {
        layerContainer.addChild(vectorGraphics);
      }

      vectorGraphics.clear();

      for (const featureId of layer.featureOrder) {
        const feature = layer.features[featureId];

        if (!feature || feature.points.length < 2) {
          continue;
        }

        const flatPoints = feature.points.flatMap((point) => [point.x, point.y]);
        vectorGraphics.poly(flatPoints, feature.closed);

        if (feature.closed && feature.style.fillColor) {
          vectorGraphics.fill({
            color: toHex(feature.style.fillColor),
            alpha: feature.style.fillOpacity ?? 0.25,
          });
        }

        vectorGraphics.stroke({
          color: toHex(feature.style.strokeColor),
          width: feature.style.strokeWidth / input.view.zoom,
          alpha: feature.style.strokeOpacity,
          cap: "round",
          join: "round",
        });
      }
    }
  }

  private drawSymbolLayers(input: CanvasRenderInput): void {
    for (const layer of input.layers) {
      if (layer.kind !== "symbol") {
        continue;
      }

      const layerContainer = this.layerContainers.get(layer.id);
      if (!layerContainer) {
        continue;
      }

      let symbolContainer = this.symbolContainersByLayer.get(layer.id);
      if (!symbolContainer) {
        symbolContainer = new Container();
        this.symbolContainersByLayer.set(layer.id, symbolContainer);
      }

      if (symbolContainer.parent !== layerContainer) {
        layerContainer.addChild(symbolContainer);
      }

      const removedChildren = symbolContainer.removeChildren();
      for (const child of removedChildren) {
        child.destroy({ children: true });
      }

      for (const symbolId of layer.symbolOrder) {
        const symbol = layer.symbols[symbolId];
        if (!symbol) {
          continue;
        }

        const symbolSize = 24 / input.view.zoom;
        const categoryColors: { [key: string]: number } = {
          mountains: 0x8b7355,
          forests: 0x228b22,
          settlements: 0xffa500,
          fortifications: 0x696969,
          ruins: 0xa9a9a9,
          ports: 0x4169e1,
          landmarks: 0xdaa520,
        };

        const color = categoryColors[symbol.category] || 0x808080;

        const graphics = new Graphics();
        graphics.circle(0, 0, symbolSize / 2);
        graphics.fill({ color, alpha: symbol.opacity });
        graphics.stroke({ color: 0xffffff, width: 1 / input.view.zoom, alpha: 0.8 });

        if (symbol.tint && symbol.tint !== "#ffffff") {
          graphics.tint = toHex(symbol.tint);
        }

        const label = new Text({
          text: symbol.symbolKey.charAt(0).toUpperCase(),
          style: new TextStyle({
            fill: 0xffffff,
            fontSize: 12 / input.view.zoom,
            fontFamily: "Segoe UI",
            fontWeight: "600",
            align: "center",
          }),
        });

        label.anchor.set(0.5, 0.5);
        label.position.set(0, 0);

        const container = new Container();
        container.position.set(symbol.position.x, symbol.position.y);
        container.rotation = (symbol.rotationDegrees * Math.PI) / 180;
        container.scale.set(symbol.scale, symbol.scale);

        container.addChild(graphics);
        container.addChild(label);

        symbolContainer.addChild(container);
      }
    }
  }

  private drawLabelLayers(input: CanvasRenderInput): void {
    for (const layer of input.layers) {
      if (layer.kind !== "label") {
        continue;
      }

      const layerContainer = this.layerContainers.get(layer.id);
      if (!layerContainer) {
        continue;
      }

      let labelContainer = this.labelContainersByLayer.get(layer.id);
      if (!labelContainer) {
        labelContainer = new Container();
        this.labelContainersByLayer.set(layer.id, labelContainer);
      }

      if (labelContainer.parent !== layerContainer) {
        layerContainer.addChild(labelContainer);
      }

      const removedChildren = labelContainer.removeChildren();
      for (const child of removedChildren) {
        child.destroy({ children: true });
      }

      for (const labelId of layer.labelOrder) {
        const label = layer.labels[labelId];
        if (!label) {
          continue;
        }

        const textNode = new Text({
          text: label.text,
          style: new TextStyle({
            fill: toHex(label.style.color),
            fontSize: Math.max(8, label.style.fontSize),
            fontFamily: label.style.fontFamily || "Georgia",
            fontWeight: label.style.fontWeight >= 600 ? "bold" : "normal",
            align: label.style.align,
          }),
        });
        textNode.anchor.set(label.anchorX, label.anchorY);
        textNode.alpha = Math.max(0, Math.min(1, label.style.opacity));

        const textContainer = new Container();
        textContainer.position.set(label.position.x, label.position.y);
        textContainer.rotation = (label.rotationDegrees * Math.PI) / 180;
        textContainer.addChild(textNode);
        labelContainer.addChild(textContainer);
      }
    }
  }

  private drawChildMapExtents(input: CanvasRenderInput): void {
    this.mapExtentGraphics.clear();

    const links = Object.values(input.map.nestedLinks).filter((link) => link.parentMapId === input.map.id);

    if (links.length === 0) {
      return;
    }

    for (const link of links) {
      const color = link.childScope === "region" ? 0x7dc6ff : 0xffc978;
      const isSelected = input.selection.type === "map-extent" && input.selection.linkId === link.id;
      const lineWidth = isSelected ? 3 / input.view.zoom : 2 / input.view.zoom;
      const fillAlpha = isSelected ? 0.2 : 0.09;
      const strokeAlpha = isSelected ? 0.98 : 0.8;

      this.mapExtentGraphics.rect(
        link.parentExtent.x,
        link.parentExtent.y,
        Math.max(1, link.parentExtent.width),
        Math.max(1, link.parentExtent.height),
      );
      this.mapExtentGraphics.fill({ color, alpha: fillAlpha });
      this.mapExtentGraphics.stroke({
        color,
        alpha: strokeAlpha,
        width: lineWidth,
      });
    }
  }

  private drawSelectionOverlay(input: CanvasRenderInput): void {
    this.selectionGraphics.clear();

    const selection = input.selection;

    if (selection.type === "vector" || selection.type === "vector-vertex") {
      const selectedLayer = input.layers.find((layer) => layer.id === selection.layerId);

      if (!selectedLayer || selectedLayer.kind !== "vector") {
        return;
      }

      const feature = selectedLayer.features[selection.featureId];

      if (!feature || feature.points.length < 2) {
        return;
      }

      const flatPoints = feature.points.flatMap((point) => [point.x, point.y]);
      this.selectionGraphics.poly(flatPoints, feature.closed);
      this.selectionGraphics.stroke({
        color: 0x7fd1ff,
        width: 3 / input.view.zoom,
        alpha: 1,
        cap: "round",
        join: "round",
      });

      const handleRadius = 5 / input.view.zoom;

      feature.points.forEach((point, index) => {
        this.selectionGraphics.circle(point.x, point.y, handleRadius);
        this.selectionGraphics.fill({
          color: selection.type === "vector-vertex" && selection.vertexIndex === index ? 0xffd272 : 0xf0f6ff,
          alpha: 0.95,
        });
        this.selectionGraphics.stroke({
          color: 0x2f405f,
          width: 1 / input.view.zoom,
          alpha: 0.95,
        });
      });
      return;
    }

    if (selection.type === "symbol") {
      const selectedLayer = input.layers.find((layer) => layer.id === selection.layerId);

      if (!selectedLayer || selectedLayer.kind !== "symbol") {
        return;
      }

      const symbol = selectedLayer.symbols[selection.symbolId];

      if (!symbol) {
        return;
      }

      const symbolSize = (24 / input.view.zoom) * symbol.scale;
      this.selectionGraphics.circle(symbol.position.x, symbol.position.y, symbolSize / 2 + 5 / input.view.zoom);
      this.selectionGraphics.stroke({
        color: 0xffd272,
        width: 3 / input.view.zoom,
        alpha: 1,
      });

      this.selectionGraphics.circle(symbol.position.x, symbol.position.y, 8 / input.view.zoom);
      this.selectionGraphics.fill({ color: 0xffd272, alpha: 0.95 });
      this.selectionGraphics.stroke({
        color: 0x2f405f,
        width: 1 / input.view.zoom,
        alpha: 0.95,
      });
      return;
    }

    if (selection.type === "label") {
      const selectedLayer = input.layers.find((layer) => layer.id === selection.layerId);

      if (!selectedLayer || selectedLayer.kind !== "label") {
        return;
      }

      const label = selectedLayer.labels[selection.labelId];

      if (!label) {
        return;
      }

      const fontSize = Math.max(8, label.style.fontSize);
      const width = Math.max(fontSize * 0.5, label.text.length * fontSize * 0.55);
      const height = Math.max(fontSize * 1.2, 12);
      const left = label.position.x - width * label.anchorX;
      const top = label.position.y - height * label.anchorY;

      this.selectionGraphics.rect(left, top, width, height);
      this.selectionGraphics.stroke({
        color: 0xffd272,
        width: 2 / input.view.zoom,
        alpha: 1,
      });

      this.selectionGraphics.circle(label.position.x, label.position.y, 5 / input.view.zoom);
      this.selectionGraphics.fill({ color: 0xffd272, alpha: 0.95 });
      this.selectionGraphics.stroke({
        color: 0x2f405f,
        width: 1 / input.view.zoom,
        alpha: 0.95,
      });
    }
  }

  private drawDraftOverlay(input: CanvasRenderInput): void {
    this.draftGraphics.clear();

    if (input.inProgressExtent) {
      const { start, current, scope } = input.inProgressExtent;
      const x = Math.min(start.x, current.x);
      const y = Math.min(start.y, current.y);
      const width = Math.abs(current.x - start.x);
      const height = Math.abs(current.y - start.y);
      const color = scope === "region" ? 0x7dc6ff : 0xffc978;

      if (width > 0 && height > 0) {
        this.draftGraphics.rect(x, y, width, height);
        this.draftGraphics.fill({ color, alpha: 0.12 });
        this.draftGraphics.stroke({
          color,
          alpha: 0.95,
          width: 2 / input.view.zoom,
        });
      }

      return;
    }

    if (!input.inProgressDraw || input.inProgressDraw.points.length === 0) {
      return;
    }

    const points = [...input.inProgressDraw.points];

    if (this.hoverWorldPoint) {
      points.push(this.hoverWorldPoint);
    }

    if (points.length < 2) {
      return;
    }

    const flatPoints = points.flatMap((point) => [point.x, point.y]);
    this.draftGraphics.poly(flatPoints, false);

    this.draftGraphics.stroke({
      color: 0xffdf9f,
      width: 2 / input.view.zoom,
      alpha: 0.95,
      cap: "round",
      join: "round",
    });

    const basePoints = input.inProgressDraw.points;

    for (const point of basePoints) {
      this.draftGraphics.circle(point.x, point.y, 4 / input.view.zoom);
      this.draftGraphics.fill({ color: 0xffe4ad, alpha: 0.9 });
      this.draftGraphics.stroke({ color: 0x3f2f19, width: 1 / input.view.zoom, alpha: 0.8 });
    }
  }

  private drawBrushCursor(input: CanvasRenderInput): void {
    this.brushCursorGraphics.clear();

    if (!this.hoverWorldPoint) {
      return;
    }

    if (input.activeTool !== "paint" && input.activeTool !== "erase") {
      return;
    }

    const layer = input.layers.find((entry) => entry.id === input.selectedLayerId);

    if (!layer || (layer.kind !== "paint" && layer.kind !== "mask" && layer.kind !== "dataOverlay")) {
      return;
    }

    const radius = Math.max(1, input.brush.size);
    const fillColor = input.activeTool === "erase" ? 0xff5a5a : toHex(input.brush.color);
    const strokeColor = input.activeTool === "erase" ? 0xffa0a0 : 0xcbe8ff;

    this.brushCursorGraphics.circle(this.hoverWorldPoint.x, this.hoverWorldPoint.y, radius);
    this.brushCursorGraphics.fill({ color: fillColor, alpha: input.activeTool === "erase" ? 0.08 : 0.12 });
    this.brushCursorGraphics.stroke({ color: strokeColor, width: 1.4 / input.view.zoom, alpha: 0.95 });
  }

  private drawGrid(input: CanvasRenderInput): void {
    this.gridGraphics.clear();

    if (!input.view.showGrid) {
      return;
    }

    const width = input.map.dimensions.width;
    const height = input.map.dimensions.height;

    const majorStep = 512;
    const minorStep = 128;

    for (let x = 0; x <= width; x += minorStep) {
      const major = x % majorStep === 0;
      this.gridGraphics.moveTo(x, 0);
      this.gridGraphics.lineTo(x, height);
      this.gridGraphics.stroke({ color: major ? 0x395173 : 0x2a3b58, width: major ? 1 : 0.5, alpha: major ? 0.52 : 0.3 });
    }

    for (let y = 0; y <= height; y += minorStep) {
      const major = y % majorStep === 0;
      this.gridGraphics.moveTo(0, y);
      this.gridGraphics.lineTo(width, y);
      this.gridGraphics.stroke({ color: major ? 0x395173 : 0x2a3b58, width: major ? 1 : 0.5, alpha: major ? 0.52 : 0.3 });
    }
  }

  private drawChunkOverlay(input: CanvasRenderInput, visibleChunks: Array<{ key: string; x: number; y: number }>): void {
    this.chunkGraphics.clear();

    if (!input.view.showChunkOverlay) {
      this.callbacks.onVisibleChunksChange(0);
      return;
    }

    const chunkSize = input.map.settings.chunkSize;

    for (const chunk of visibleChunks) {
      const x = chunk.x * chunkSize;
      const y = chunk.y * chunkSize;
      this.chunkGraphics.rect(x, y, chunkSize, chunkSize);
      this.chunkGraphics.stroke({ color: 0x89c4ff, width: 1 / input.view.zoom, alpha: 0.72 });
    }

    this.callbacks.onVisibleChunksChange(visibleChunks.length);
  }

  private applyView(view: CanvasRenderInput["view"]): void {
    this.worldContainer.scale.set(view.zoom);
    this.worldContainer.position.set(view.viewportWidth / 2 - view.cameraX * view.zoom, view.viewportHeight / 2 - view.cameraY * view.zoom);
    this.screenOverlayContainer.position.set(0, 0);
  }
}

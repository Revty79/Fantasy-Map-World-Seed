import { create } from "zustand";
import { applyTerrainBrushAtPoint, createRandomTerrainSeed, deriveTerrainProducts, generateTerrainForMap } from "../lib/terrain";
import {
  clampTerrainSeaLevel,
  createDefaultTerrainBrushSettings,
  invalidateTerrainDerivedCache,
  normalizeTerrainBrushSettingValue,
  normalizeTerrainDisplaySettingValue,
  normalizeTerrainGenerationSettingValue,
} from "./terrainStoreUtils";
import {
  createLabelAnnotationSkeleton,
  createLayerDocument,
  createMapDocument,
  createPaintChunkSkeleton,
  createProjectDocument,
  createSymbolInstanceSkeleton,
  createVectorFeatureSkeleton,
} from "../lib/factories/projectFactories";
import { createDocumentId, nowIso } from "../lib/factories/idFactory";
import { PROJECT_SCHEMA_VERSION } from "../lib/constants/documentDefaults";
import {
  buildSaveProjectBundle,
  hydrateProjectDocumentFromBundle,
  loadProjectBundle,
  pickProjectFolder,
  pickProjectManifest,
  saveProjectBundle,
  toPersistenceErrorMessage,
} from "../lib/persistence";
import type {
  CanvasStatus,
  DocumentRect,
  EditorSessionState,
  EditorToolId,
  LabelCategory,
  LabelStyle,
  LabelUpdatePayload,
  LayerId,
  LayerKind,
  MapDocument,
  MapId,
  MapLayerDocument,
  MapScope,
  NestedMapLink,
  ProjectSessionMeta,
  SelectionTarget,
  SidebarPanelId,
  TerrainGenerationSettings,
  WorldSeedProjectDocument,
} from "../types";

const MIN_ZOOM = 0.08;
const MAX_ZOOM = 32;

export interface EditorStoreState {
  document: WorldSeedProjectDocument;
  projectSession: ProjectSessionMeta;
  session: EditorSessionState;
  undoDocuments: WorldSeedProjectDocument[];
  redoDocuments: WorldSeedProjectDocument[];
  setActiveMap: (mapId: MapId) => void;
  setActiveScope: (scope: MapScope) => void;
  setActiveTool: (toolId: EditorToolId) => void;
  prepareCreateChildMap: (scope: Exclude<MapScope, "world">) => void;
  beginExtentSelection: (x: number, y: number) => void;
  updateExtentSelection: (x: number, y: number) => void;
  commitExtentSelection: () => void;
  cancelExtentSelection: () => void;
  openParentMap: () => void;
  openChildMapFromLink: (linkId: string) => void;
  renameMap: (mapId: MapId, name: string) => void;
  setSelectedLayer: (layerId: LayerId | null) => void;
  setSelection: (selection: SelectionTarget) => void;
  togglePanel: (panelId: SidebarPanelId) => void;
  setCanvasStatus: (status: Partial<CanvasStatus>) => void;
  setStatusHint: (hint: string) => void;
  setActiveView: (partial: Partial<EditorSessionState["viewStateByMap"][MapId]>) => void;
  setViewportSize: (width: number, height: number) => void;
  setPointerDocumentPosition: (x: number | null, y: number | null) => void;
  zoomToFit: () => void;
  resetView: () => void;
  toggleGrid: () => void;
  toggleChunkOverlay: () => void;
  markDirty: (dirty: boolean) => void;
  replaceDocument: (document: WorldSeedProjectDocument) => void;
  newProject: (name?: string) => Promise<void>;
  saveProject: () => Promise<void>;
  saveProjectAs: () => Promise<void>;
  openProject: () => Promise<void>;
  addLayer: (kind: LayerKind, name?: string) => LayerId | null;
  removeLayer: (layerId: LayerId) => void;
  toggleLayerVisibility: (layerId: LayerId) => void;
  toggleLayerLock: (layerId: LayerId) => void;
  setLayerOpacity: (layerId: LayerId, opacity: number) => void;
  renameLayer: (layerId: LayerId, name: string) => void;
  moveLayer: (layerId: LayerId, direction: "up" | "down") => void;
  appendVectorDrawPoint: (x: number, y: number, clickCount: number) => void;
  completeVectorDraw: () => void;
  cancelVectorDraw: () => void;
  selectVectorFeature: (layerId: LayerId, featureId: string | null) => void;
  selectVectorVertex: (layerId: LayerId, featureId: string, vertexIndex: number) => void;
  moveVectorVertex: (layerId: LayerId, featureId: string, vertexIndex: number, x: number, y: number) => void;
  moveVectorFeature: (layerId: LayerId, featureId: string, deltaX: number, deltaY: number) => void;
  placeSymbolAt: (x: number, y: number) => void;
  placeLabelAt: (x: number, y: number) => void;
  selectSymbol: (layerId: LayerId, symbolId: string | null) => void;
  selectLabel: (layerId: LayerId, labelId: string | null) => void;
  moveSymbol: (layerId: LayerId, symbolId: string, x: number, y: number) => void;
  moveLabel: (layerId: LayerId, labelId: string, x: number, y: number) => void;
  updateSymbolTransform: (layerId: LayerId, symbolId: string, scale: number, rotationDegrees: number) => void;
  updateLabel: (layerId: LayerId, labelId: string, updates: LabelUpdatePayload, historyLabel?: string) => void;
  deleteSelection: () => void;
  duplicateSelection: () => void;
  applyBrushSample: (x: number, y: number) => void;
  applyTerrainBrushSample: (x: number, y: number) => void;
  checkpointHistory: (label: string) => void;
  undo: () => void;
  redo: () => void;
  setBrushSetting: <K extends keyof EditorSessionState["activeBrush"]>(
    key: K,
    value: EditorSessionState["activeBrush"][K],
  ) => void;
  setVectorSetting: <K extends keyof EditorSessionState["activeVector"]>(
    key: K,
    value: EditorSessionState["activeVector"][K],
  ) => void;
  setSymbolSetting: <K extends keyof EditorSessionState["activeSymbol"]>(
    key: K,
    value: EditorSessionState["activeSymbol"][K],
  ) => void;
  setLabelSetting: <K extends keyof EditorSessionState["activeLabel"]>(
    key: K,
    value: EditorSessionState["activeLabel"][K],
  ) => void;
  setExtentSetting: <K extends keyof EditorSessionState["activeExtent"]>(
    key: K,
    value: EditorSessionState["activeExtent"][K],
  ) => void;
  setTerrainBrushSetting: <K extends keyof EditorSessionState["activeTerrainBrush"]>(
    key: K,
    value: EditorSessionState["activeTerrainBrush"][K],
  ) => void;
  setTerrainGenerationSetting: <K extends keyof TerrainGenerationSettings>(
    key: K,
    value: TerrainGenerationSettings[K],
  ) => void;
  setTerrainSeaLevel: (seaLevel: number) => void;
  setTerrainDisplaySetting: <K extends keyof MapDocument["terrain"]["display"]>(
    key: K,
    value: MapDocument["terrain"]["display"][K],
  ) => void;
  generateTerrainForActiveMap: () => void;
  regenerateTerrainForActiveMap: () => void;
  randomizeTerrainSeed: () => void;
  refreshTerrainDerivedForActiveMap: () => void;
}

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

const MIN_CHILD_EXTENT_SIZE = 48;

const getDefaultChildScopeForMap = (scope: MapScope): Exclude<MapScope, "world"> => {
  return scope === "world" ? "region" : "local";
};

const canCreateChildScope = (parentScope: MapScope, childScope: Exclude<MapScope, "world">): boolean => {
  if (parentScope === "world") {
    return childScope === "region" || childScope === "local";
  }

  if (parentScope === "region") {
    return childScope === "local";
  }

  return false;
};

const createStarterLayerStack = (): MapLayerDocument[] => {
  return [
    createLayerDocument("vector", "Coastlines"),
    createLayerDocument("vector", "Rivers & Roads"),
    createLayerDocument("mask", "Land / Ocean Mask"),
    createLayerDocument("dataOverlay", "Biome & Weather Overlay"),
    createLayerDocument("symbol", "Terrain Features"),
    createLayerDocument("label", "Labels"),
  ];
};

const attachLayersToMap = (map: MapDocument, layers: MapLayerDocument[]): MapDocument => {
  const layerOrder: LayerId[] = [];
  const layerRecord: Record<LayerId, MapLayerDocument> = {};

  for (const layer of layers) {
    const layerId = layer.id as LayerId;
    layerOrder.push(layerId);
    layerRecord[layerId] = layer;
  }

  return {
    ...map,
    layerOrder,
    layers: layerRecord,
  };
};

const clampToMapBounds = (x: number, y: number, map: MapDocument) => {
  return {
    x: clamp(x, 0, map.dimensions.width),
    y: clamp(y, 0, map.dimensions.height),
  };
};

const toExtentRect = (
  start: { x: number; y: number },
  current: { x: number; y: number },
  map: MapDocument,
): DocumentRect => {
  const safeStart = clampToMapBounds(start.x, start.y, map);
  const safeCurrent = clampToMapBounds(current.x, current.y, map);
  const x = Math.min(safeStart.x, safeCurrent.x);
  const y = Math.min(safeStart.y, safeCurrent.y);
  const width = Math.abs(safeCurrent.x - safeStart.x);
  const height = Math.abs(safeCurrent.y - safeStart.y);

  return { x, y, width, height };
};

const toNormalizedRect = (rect: DocumentRect, parentMap: MapDocument) => {
  const width = parentMap.dimensions.width || 1;
  const height = parentMap.dimensions.height || 1;

  return {
    x: clamp(rect.x / width, 0, 1),
    y: clamp(rect.y / height, 0, 1),
    width: clamp(rect.width / width, 0, 1),
    height: clamp(rect.height / height, 0, 1),
  };
};

const countMapsByScope = (document: WorldSeedProjectDocument, scope: MapScope): number => {
  return document.mapOrder.reduce((count, mapId) => {
    const map = document.maps[mapId];
    return map && map.scope === scope ? count + 1 : count;
  }, 0);
};

const buildDefaultChildMapName = (
  document: WorldSeedProjectDocument,
  scope: Exclude<MapScope, "world">,
): string => {
  if (scope === "region") {
    return `Region ${String(countMapsByScope(document, "region") + 1).padStart(2, "0")}`;
  }

  return `Local Map ${String(countMapsByScope(document, "local") + 1).padStart(2, "0")}`;
};

const createChildMapFromExtent = (
  document: WorldSeedProjectDocument,
  parentMap: MapDocument,
  childScope: Exclude<MapScope, "world">,
  extent: DocumentRect,
): { childMap: MapDocument; link: NestedMapLink } => {
  const childMapName = buildDefaultChildMapName(document, childScope);
  const childWidth = Math.max(128, Math.round(extent.width));
  const childHeight = Math.max(128, Math.round(extent.height));
  const seededChild = attachLayersToMap(
    createMapDocument({
      name: childMapName,
      scope: childScope,
      parentMapId: parentMap.id,
      width: childWidth,
      height: childHeight,
    }),
    createStarterLayerStack(),
  );

  const configuredChild: MapDocument = {
    ...seededChild,
    projection: {
      ...parentMap.projection,
    },
    settings: {
      ...seededChild.settings,
      backgroundColor: parentMap.settings.backgroundColor,
      chunkSize: parentMap.settings.chunkSize,
      cellSize: parentMap.settings.cellSize,
      gridEnabled: parentMap.settings.gridEnabled,
      guidesEnabled: parentMap.settings.guidesEnabled,
    },
  };

  const linkId = createDocumentId("map-link");
  const now = nowIso();
  const link: NestedMapLink = {
    id: linkId,
    parentMapId: parentMap.id,
    childMapId: configuredChild.id,
    childScope,
    relationshipKind: childScope === "region" ? "region-from-parent" : "local-from-parent",
    parentExtent: extent,
    normalizedParentExtent: toNormalizedRect(extent, parentMap),
    inheritanceMode: "anchored-independent",
    meta: {
      createdAt: now,
      updatedAt: now,
      notes:
        "Child maps are anchored to a parent extent but remain independent authoring spaces after creation.",
    },
  };

  return {
    childMap: {
      ...configuredChild,
      nestedLinks: {
        ...configuredChild.nestedLinks,
        [linkId]: link,
      },
    },
    link,
  };
};

const createDefaultProjectSession = (document: WorldSeedProjectDocument): ProjectSessionMeta => ({
  id: document.metadata.id,
  name: document.metadata.name,
  path: null,
  dirty: false,
  status: "ready",
  lastSavedAt: null,
});

const createDefaultSession = (document: WorldSeedProjectDocument): EditorSessionState => {
  const activeMapId = document.rootWorldMapId;
  const activeMap = document.maps[activeMapId];
  const firstLayerId = activeMap.layerOrder[0] ?? null;
  const initialZoom = 0.15;

  return {
    activeMapId,
    activeScope: activeMap.scope,
    activeTool: "select",
    selectedLayerId: firstLayerId,
    selection: firstLayerId ? { type: "layer", layerId: firstLayerId } : { type: "none" },
    panels: {
      layers: { visible: true, collapsed: false },
      inspector: { visible: true, collapsed: false },
      toolSettings: { visible: true, collapsed: false },
      maps: { visible: true, collapsed: false },
    },
    canvasStatus: {
      zoomPercent: initialZoom * 100,
      pointerDocumentX: null,
      pointerDocumentY: null,
      visibleChunkCount: 0,
    },
    viewStateByMap: {
      [activeMapId]: {
        mapId: activeMapId,
        cameraX: activeMap.dimensions.width / 2,
        cameraY: activeMap.dimensions.height / 2,
        zoom: initialZoom,
        viewportWidth: 1280,
        viewportHeight: 720,
        showGrid: true,
        showChunkOverlay: false,
      },
    },
    statusHint: "Workspace ready",
    inProgressDraw: null,
    inProgressExtent: null,
    activeExtent: {
      childScope: getDefaultChildScopeForMap(activeMap.scope),
      autoNavigateToChild: true,
    },
    activeBrush: {
      size: 24,
      opacity: 0.7,
      hardness: 0.8,
      mode: "paint",
      category: "land",
      value: 1,
      color: "#77b58f",
    },
    activeTerrainBrush: createDefaultTerrainBrushSettings(),
    activeVector: {
      strokeColor: "#dbe9ff",
      strokeWidth: 2,
      fillColor: "#4f6f94",
      closed: false,
      category: "path",
    },
    activeSymbol: {
      symbolKey: "mountain",
      category: "mountains",
      scale: 1,
      rotationDegrees: 0,
      tint: "#f2eadf",
    },
    activeLabel: {
      defaultText: "New label",
      category: "annotation",
      fontFamily: "Georgia",
      fontSize: 24,
      fontWeight: 600,
      color: "#f7edd7",
      opacity: 1,
      alignment: "center",
      rotationDegrees: 0,
    },
    undoStack: [],
    redoStack: [],
  };
};

const defaultDocument = createProjectDocument();

const mutateActiveMap = (
  state: EditorStoreState,
  updater: (map: WorldSeedProjectDocument["maps"][string]) => WorldSeedProjectDocument["maps"][string],
): WorldSeedProjectDocument => {
  const mapId = state.session.activeMapId;
  const currentMap = state.document.maps[mapId];
  const nextMap = updater(currentMap);

  return {
    ...state.document,
    metadata: {
      ...state.document.metadata,
      updatedAt: new Date().toISOString(),
    },
    maps: {
      ...state.document.maps,
      [mapId]: nextMap,
    },
  };
};

const ensureViewState = (state: EditorStoreState, mapId: MapId): EditorSessionState["viewStateByMap"][MapId] => {
  const existing = state.session.viewStateByMap[mapId];

  if (existing) {
    return existing;
  }

  const map = state.document.maps[mapId];

  return {
    mapId,
    cameraX: map.dimensions.width / 2,
    cameraY: map.dimensions.height / 2,
    zoom: 1,
    viewportWidth: 1280,
    viewportHeight: 720,
    showGrid: true,
    showChunkOverlay: false,
  };
};

const buildZoomToFit = (
  mapWidth: number,
  mapHeight: number,
  viewportWidth: number,
  viewportHeight: number,
): number => {
  if (viewportWidth <= 1 || viewportHeight <= 1 || mapWidth <= 1 || mapHeight <= 1) {
    return 1;
  }

  return clamp(Math.min(viewportWidth / mapWidth, viewportHeight / mapHeight) * 0.9, MIN_ZOOM, MAX_ZOOM);
};

const VECTOR_TOOL_KINDS: Record<
  EditorToolId,
  { category: "coastline" | "river" | "border" | "road" | "path" | "polygon"; geometry: "polyline" | "polygon" } | null
> = {
  select: null,
  pan: null,
  terrain: null,
  coastline: { category: "coastline", geometry: "polygon" },
  river: { category: "river", geometry: "polyline" },
  border: { category: "border", geometry: "polyline" },
  road: { category: "road", geometry: "polyline" },
  paint: null,
  erase: null,
  symbol: null,
  label: null,
  extent: null,
};

const LABEL_CATEGORY_SET = new Set<LabelCategory>([
  "world",
  "ocean",
  "region",
  "settlement",
  "landmark",
  "annotation",
]);

const LABEL_ALIGNMENT_SET = new Set<LabelStyle["align"]>(["left", "center", "right"]);

const isLabelCategory = (value: string): value is LabelCategory => LABEL_CATEGORY_SET.has(value as LabelCategory);

const toLabelAlignment = (value: string, fallback: LabelStyle["align"]): LabelStyle["align"] => {
  if (LABEL_ALIGNMENT_SET.has(value as LabelStyle["align"])) {
    return value as LabelStyle["align"];
  }

  return fallback;
};

const anchorFromAlignment = (align: LabelStyle["align"]): number => {
  if (align === "left") {
    return 0;
  }

  if (align === "right") {
    return 1;
  }

  return 0.5;
};

const HISTORY_LIMIT = 80;

const cloneDocumentSnapshot = (document: WorldSeedProjectDocument): WorldSeedProjectDocument => {
  return structuredClone(document);
};

const createHistoryEntry = (label: string) => ({
  id: createDocumentId("hist"),
  label,
  committedAt: new Date().toISOString(),
});

const buildHistoryPatch = (state: EditorStoreState, label: string) => {
  return {
    undoDocuments: [...state.undoDocuments, cloneDocumentSnapshot(state.document)].slice(-HISTORY_LIMIT),
    redoDocuments: [] as WorldSeedProjectDocument[],
    undoStack: [...state.session.undoStack, createHistoryEntry(label)].slice(-HISTORY_LIMIT),
    redoStack: [] as EditorSessionState["redoStack"],
  };
};

const normalizeProjectName = (name: string | undefined): string => {
  const trimmed = name?.trim();
  if (!trimmed) {
    return "Untitled World Seed";
  }
  return trimmed;
};

const confirmDiscardUnsavedChanges = (dirty: boolean, action: "create a new project" | "open another project"): boolean => {
  if (!dirty || typeof window === "undefined") {
    return true;
  }

  return window.confirm(`You have unsaved changes. Continue and ${action}?`);
};

const stampDocumentForSave = (document: WorldSeedProjectDocument): WorldSeedProjectDocument => {
  const savedAt = nowIso();
  return {
    ...document,
    metadata: {
      ...document.metadata,
      schemaVersion: PROJECT_SCHEMA_VERSION,
      updatedAt: savedAt,
    },
  };
};

const buildFreshProjectSession = (
  document: WorldSeedProjectDocument,
  path: string | null,
  savedAt: string | null,
): ProjectSessionMeta => ({
  id: document.metadata.id,
  name: document.metadata.name,
  path,
  dirty: false,
  status: "ready",
  lastSavedAt: savedAt,
});

export const useEditorStore = create<EditorStoreState>((set, get) => ({
  document: defaultDocument,
  projectSession: createDefaultProjectSession(defaultDocument),
  session: createDefaultSession(defaultDocument),
  undoDocuments: [],
  redoDocuments: [],
  setActiveMap: (mapId) =>
    set((state) => {
      const map = state.document.maps[mapId];

      if (!map) {
        return state;
      }

      const selectedLayerId = map.layerOrder[0] ?? null;
      const existingView = ensureViewState(state, mapId);
      const preferredChildScope = canCreateChildScope(map.scope, state.session.activeExtent.childScope)
        ? state.session.activeExtent.childScope
        : getDefaultChildScopeForMap(map.scope);

      return {
        session: {
          ...state.session,
          activeMapId: mapId,
          activeScope: map.scope,
          selectedLayerId,
          selection: selectedLayerId ? { type: "layer", layerId: selectedLayerId } : { type: "none" },
          inProgressExtent: null,
          activeExtent: {
            ...state.session.activeExtent,
            childScope: preferredChildScope,
          },
          viewStateByMap: {
            ...state.session.viewStateByMap,
            [mapId]: existingView,
          },
          canvasStatus: {
            ...state.session.canvasStatus,
            zoomPercent: existingView.zoom * 100,
          },
          statusHint: `Active map: ${map.name}`,
        },
      };
    }),
  setActiveScope: (scope) =>
    set((state) => ({
      session: {
        ...state.session,
        activeScope: scope,
        statusHint: `Scope switched to ${scope}`,
      },
    })),
  setActiveTool: (toolId) =>
    set((state) => {
      const vectorConfig = VECTOR_TOOL_KINDS[toolId];
      const isVectorTool = Boolean(vectorConfig);
      const shouldCancelDraw = state.session.inProgressDraw !== null && !isVectorTool;
      const shouldCancelExtent = state.session.inProgressExtent !== null && toolId !== "extent";
      const nextStatusParts = [`Active tool: ${toolId}`];

      if (shouldCancelDraw) {
        nextStatusParts.push("canceled pending vector draw");
      }

      if (shouldCancelExtent) {
        nextStatusParts.push("cleared pending child-map extent");
      }

      return {
        session: {
          ...state.session,
          activeTool: toolId,
          activeBrush:
            toolId === "paint" || toolId === "erase"
              ? {
                  ...state.session.activeBrush,
                  mode: toolId === "erase" ? "erase" : "paint",
                }
              : state.session.activeBrush,
          activeVector: vectorConfig
            ? {
                ...state.session.activeVector,
                category: vectorConfig.category,
              }
            : state.session.activeVector,
          inProgressDraw: shouldCancelDraw ? null : state.session.inProgressDraw,
          inProgressExtent: shouldCancelExtent ? null : state.session.inProgressExtent,
          statusHint: nextStatusParts.join(" | "),
        },
      };
    }),
  prepareCreateChildMap: (scope) =>
    set((state) => {
      const activeMap = state.document.maps[state.session.activeMapId];

      if (!canCreateChildScope(activeMap.scope, scope)) {
        return {
          session: {
            ...state.session,
            statusHint:
              activeMap.scope === "local"
                ? "Local maps are leaf scopes in Phase 1. Open a world or region map to create children."
                : `Cannot create a ${scope} map from ${activeMap.scope} scope.`,
          },
        };
      }

      return {
        session: {
          ...state.session,
          activeTool: "extent",
          selection: { type: "none" },
          inProgressExtent: null,
          activeExtent: {
            ...state.session.activeExtent,
            childScope: scope,
          },
          statusHint: `Create ${scope} map mode: drag an extent on ${activeMap.name}, then press Enter to confirm.`,
        },
      };
    }),
  beginExtentSelection: (x, y) =>
    set((state) => {
      const activeMap = state.document.maps[state.session.activeMapId];
      const scope = state.session.activeExtent.childScope;

      if (state.session.activeTool !== "extent") {
        return state;
      }

      if (!canCreateChildScope(activeMap.scope, scope)) {
        return {
          session: {
            ...state.session,
            statusHint:
              activeMap.scope === "local"
                ? "Local maps are leaf scopes. Open a world or region map first."
                : `Cannot create a ${scope} map from ${activeMap.scope} scope.`,
          },
        };
      }

      const anchor = clampToMapBounds(x, y, activeMap);

      return {
        session: {
          ...state.session,
          selection: { type: "none" },
          inProgressExtent: {
            scope,
            start: anchor,
            current: anchor,
          },
          statusHint: `Drag to define the ${scope} extent, then press Enter to create the child map.`,
        },
      };
    }),
  updateExtentSelection: (x, y) =>
    set((state) => {
      const draft = state.session.inProgressExtent;

      if (!draft) {
        return state;
      }

      const activeMap = state.document.maps[state.session.activeMapId];
      const current = clampToMapBounds(x, y, activeMap);

      if (current.x === draft.current.x && current.y === draft.current.y) {
        return state;
      }

      const previewRect = toExtentRect(draft.start, current, activeMap);

      return {
        session: {
          ...state.session,
          inProgressExtent: {
            ...draft,
            current,
          },
          statusHint: `${draft.scope.toUpperCase()} extent: ${Math.round(previewRect.width)} x ${Math.round(previewRect.height)} units`,
        },
      };
    }),
  commitExtentSelection: () =>
    set((state) => {
      const activeMap = state.document.maps[state.session.activeMapId];
      const draft = state.session.inProgressExtent;

      if (!draft) {
        return {
          session: {
            ...state.session,
            statusHint: "No extent selected yet. Drag a rectangle on the parent map first.",
          },
        };
      }

      if (!canCreateChildScope(activeMap.scope, draft.scope)) {
        return {
          session: {
            ...state.session,
            inProgressExtent: null,
            statusHint:
              activeMap.scope === "local"
                ? "Local maps are leaf scopes in Phase 1. Child map creation was canceled."
                : `Cannot create ${draft.scope} maps from ${activeMap.scope} scope.`,
          },
        };
      }

      const extent = toExtentRect(draft.start, draft.current, activeMap);

      if (extent.width < MIN_CHILD_EXTENT_SIZE || extent.height < MIN_CHILD_EXTENT_SIZE) {
        return {
          session: {
            ...state.session,
            statusHint: `Extent is too small. Minimum size is ${MIN_CHILD_EXTENT_SIZE} x ${MIN_CHILD_EXTENT_SIZE}.`,
          },
        };
      }

      const { childMap, link } = createChildMapFromExtent(state.document, activeMap, draft.scope, extent);
      const now = nowIso();
      const parentMap: MapDocument = {
        ...activeMap,
        childMapIds: [...activeMap.childMapIds, childMap.id],
        nestedLinks: {
          ...activeMap.nestedLinks,
          [link.id]: link,
        },
        meta: {
          ...activeMap.meta,
          updatedAt: now,
        },
      };

      const nextDocument: WorldSeedProjectDocument = {
        ...state.document,
        metadata: {
          ...state.document.metadata,
          updatedAt: now,
        },
        mapOrder: [...state.document.mapOrder, childMap.id],
        maps: {
          ...state.document.maps,
          [parentMap.id]: parentMap,
          [childMap.id]: childMap,
        },
      };

      const parentView = ensureViewState(state, parentMap.id);
      const childZoom = buildZoomToFit(
        childMap.dimensions.width,
        childMap.dimensions.height,
        parentView.viewportWidth,
        parentView.viewportHeight,
      );
      const childView = {
        mapId: childMap.id,
        cameraX: childMap.dimensions.width / 2,
        cameraY: childMap.dimensions.height / 2,
        zoom: childZoom,
        viewportWidth: parentView.viewportWidth,
        viewportHeight: parentView.viewportHeight,
        showGrid: parentView.showGrid,
        showChunkOverlay: parentView.showChunkOverlay,
      };

      const historyPatch = buildHistoryPatch(state, `Create ${draft.scope} map`);
      const shouldAutoNavigate = state.session.activeExtent.autoNavigateToChild;
      const targetMap = shouldAutoNavigate ? childMap : parentMap;
      const targetView = shouldAutoNavigate ? childView : parentView;
      const selectedLayerId = targetMap.layerOrder[0] ?? null;

      return {
        document: nextDocument,
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          activeMapId: targetMap.id,
          activeScope: targetMap.scope,
          activeTool: "select",
          selectedLayerId,
          selection: selectedLayerId ? { type: "layer", layerId: selectedLayerId } : { type: "none" },
          inProgressExtent: null,
          viewStateByMap: {
            ...state.session.viewStateByMap,
            [childMap.id]: childView,
          },
          canvasStatus: {
            ...state.session.canvasStatus,
            zoomPercent: targetView.zoom * 100,
          },
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
          statusHint: `Created ${childMap.name} from ${activeMap.name}. Child maps are anchored to parent extents but edit independently.`,
        },
      };
    }),
  cancelExtentSelection: () =>
    set((state) => {
      if (state.session.inProgressExtent) {
        return {
          session: {
            ...state.session,
            inProgressExtent: null,
            statusHint: "Canceled child-map extent selection.",
          },
        };
      }

      if (state.session.activeTool === "extent") {
        return {
          session: {
            ...state.session,
            activeTool: "select",
            statusHint: "Exited child-map extent mode.",
          },
        };
      }

      return state;
    }),
  openParentMap: () =>
    set((state) => {
      const activeMap = state.document.maps[state.session.activeMapId];

      if (!activeMap.parentMapId) {
        return {
          session: {
            ...state.session,
            statusHint: `${activeMap.name} is already the root map.`,
          },
        };
      }

      const parentMap = state.document.maps[activeMap.parentMapId];

      if (!parentMap) {
        return {
          session: {
            ...state.session,
            statusHint: "Parent map reference is missing.",
          },
        };
      }

      const parentView = ensureViewState(state, parentMap.id);
      const selectedLayerId = parentMap.layerOrder[0] ?? null;

      return {
        session: {
          ...state.session,
          activeMapId: parentMap.id,
          activeScope: parentMap.scope,
          selectedLayerId,
          selection: selectedLayerId ? { type: "layer", layerId: selectedLayerId } : { type: "none" },
          inProgressExtent: null,
          viewStateByMap: {
            ...state.session.viewStateByMap,
            [parentMap.id]: parentView,
          },
          canvasStatus: {
            ...state.session.canvasStatus,
            zoomPercent: parentView.zoom * 100,
          },
          statusHint: `Opened parent map: ${parentMap.name}`,
        },
      };
    }),
  openChildMapFromLink: (linkId) =>
    set((state) => {
      const activeMap = state.document.maps[state.session.activeMapId];
      const link = activeMap.nestedLinks[linkId];

      if (!link || link.parentMapId !== activeMap.id) {
        return {
          session: {
            ...state.session,
            statusHint: "Child extent link not found on the active map.",
          },
        };
      }

      const childMap = state.document.maps[link.childMapId];

      if (!childMap) {
        return {
          session: {
            ...state.session,
            statusHint: "The linked child map is missing.",
          },
        };
      }

      const childView = ensureViewState(state, childMap.id);
      const selectedLayerId = childMap.layerOrder[0] ?? null;

      return {
        session: {
          ...state.session,
          activeMapId: childMap.id,
          activeScope: childMap.scope,
          selectedLayerId,
          selection: selectedLayerId ? { type: "layer", layerId: selectedLayerId } : { type: "none" },
          inProgressExtent: null,
          viewStateByMap: {
            ...state.session.viewStateByMap,
            [childMap.id]: childView,
          },
          canvasStatus: {
            ...state.session.canvasStatus,
            zoomPercent: childView.zoom * 100,
          },
          statusHint: `Opened child map: ${childMap.name}`,
        },
      };
    }),
  renameMap: (mapId, name) =>
    set((state) => {
      const map = state.document.maps[mapId];

      if (!map) {
        return state;
      }

      const trimmed = name.trim();
      const nextName = trimmed.length > 0 ? trimmed : map.name;

      if (nextName === map.name) {
        return state;
      }

      const now = nowIso();
      const historyPatch = buildHistoryPatch(state, "Rename map");

      return {
        document: {
          ...state.document,
          metadata: {
            ...state.document.metadata,
            updatedAt: now,
          },
          maps: {
            ...state.document.maps,
            [mapId]: {
              ...map,
              name: nextName,
              meta: {
                ...map.meta,
                updatedAt: now,
              },
            },
          },
        },
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
          statusHint: `Renamed map to ${nextName}`,
        },
      };
    }),
  setSelectedLayer: (layerId) =>
    set((state) => ({
      session: {
        ...state.session,
        selectedLayerId: layerId,
        selection: layerId ? { type: "layer", layerId } : { type: "none" },
      },
    })),
  setSelection: (selection) =>
    set((state) => ({
      session: {
        ...state.session,
        selection,
      },
    })),
  togglePanel: (panelId) =>
    set((state) => ({
      session: {
        ...state.session,
        panels: {
          ...state.session.panels,
          [panelId]: {
            ...state.session.panels[panelId],
            collapsed: !state.session.panels[panelId].collapsed,
          },
        },
      },
    })),
  setCanvasStatus: (status) =>
    set((state) => {
      const nextCanvasStatus = {
        ...state.session.canvasStatus,
        ...status,
      };

      if (
        nextCanvasStatus.zoomPercent === state.session.canvasStatus.zoomPercent &&
        nextCanvasStatus.pointerDocumentX === state.session.canvasStatus.pointerDocumentX &&
        nextCanvasStatus.pointerDocumentY === state.session.canvasStatus.pointerDocumentY &&
        nextCanvasStatus.visibleChunkCount === state.session.canvasStatus.visibleChunkCount
      ) {
        return state;
      }

      return {
        session: {
          ...state.session,
          canvasStatus: nextCanvasStatus,
        },
      };
    }),
  setStatusHint: (hint) =>
    set((state) => ({
      session: {
        ...state.session,
        statusHint: hint,
      },
    })),
  setActiveView: (partial) =>
    set((state) => {
      const mapId = state.session.activeMapId;
      const previous = ensureViewState(state, mapId);
      const nextZoom = partial.zoom !== undefined ? clamp(partial.zoom, MIN_ZOOM, MAX_ZOOM) : previous.zoom;

      const nextView = {
        ...previous,
        ...partial,
        zoom: nextZoom,
      };

      return {
        session: {
          ...state.session,
          viewStateByMap: {
            ...state.session.viewStateByMap,
            [mapId]: nextView,
          },
          canvasStatus: {
            ...state.session.canvasStatus,
            zoomPercent: nextZoom * 100,
          },
        },
      };
    }),
  setViewportSize: (width, height) =>
    set((state) => {
      const mapId = state.session.activeMapId;
      const previous = ensureViewState(state, mapId);
      const nextView = {
        ...previous,
        viewportWidth: Math.max(1, width),
        viewportHeight: Math.max(1, height),
      };

      return {
        session: {
          ...state.session,
          viewStateByMap: {
            ...state.session.viewStateByMap,
            [mapId]: nextView,
          },
        },
      };
    }),
  setPointerDocumentPosition: (x, y) =>
    set((state) => ({
      session: {
        ...state.session,
        canvasStatus: {
          ...state.session.canvasStatus,
          pointerDocumentX: x,
          pointerDocumentY: y,
        },
      },
    })),
  zoomToFit: () =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const previous = ensureViewState(state, map.id);
      const nextZoom = buildZoomToFit(
        map.dimensions.width,
        map.dimensions.height,
        previous.viewportWidth,
        previous.viewportHeight,
      );

      const nextView = {
        ...previous,
        cameraX: map.dimensions.width / 2,
        cameraY: map.dimensions.height / 2,
        zoom: nextZoom,
      };

      return {
        session: {
          ...state.session,
          viewStateByMap: {
            ...state.session.viewStateByMap,
            [map.id]: nextView,
          },
          canvasStatus: {
            ...state.session.canvasStatus,
            zoomPercent: nextZoom * 100,
          },
          statusHint: "View fitted to active map bounds.",
        },
      };
    }),
  resetView: () =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const previous = ensureViewState(state, map.id);

      const nextView = {
        ...previous,
        cameraX: map.dimensions.width / 2,
        cameraY: map.dimensions.height / 2,
        zoom: 1,
      };

      return {
        session: {
          ...state.session,
          viewStateByMap: {
            ...state.session.viewStateByMap,
            [map.id]: nextView,
          },
          canvasStatus: {
            ...state.session.canvasStatus,
            zoomPercent: 100,
            pointerDocumentX: null,
            pointerDocumentY: null,
          },
          statusHint: "View reset to default center.",
        },
      };
    }),
  toggleGrid: () =>
    set((state) => {
      const mapId = state.session.activeMapId;
      const previous = ensureViewState(state, mapId);
      const nextView = {
        ...previous,
        showGrid: !previous.showGrid,
      };

      return {
        session: {
          ...state.session,
          viewStateByMap: {
            ...state.session.viewStateByMap,
            [mapId]: nextView,
          },
          statusHint: nextView.showGrid ? "Grid overlay enabled." : "Grid overlay hidden.",
        },
      };
    }),
  toggleChunkOverlay: () =>
    set((state) => {
      const mapId = state.session.activeMapId;
      const previous = ensureViewState(state, mapId);
      const nextView = {
        ...previous,
        showChunkOverlay: !previous.showChunkOverlay,
      };

      return {
        session: {
          ...state.session,
          viewStateByMap: {
            ...state.session.viewStateByMap,
            [mapId]: nextView,
          },
          statusHint: nextView.showChunkOverlay ? "Chunk debug overlay enabled." : "Chunk debug overlay hidden.",
        },
      };
    }),
  markDirty: (dirty) =>
    set((state) => ({
      projectSession: {
        ...state.projectSession,
        dirty,
        status: dirty ? "needs-save" : "ready",
      },
    })),
  replaceDocument: (document) =>
    set((state) => ({
      document,
      undoDocuments: [],
      redoDocuments: [],
      projectSession: buildFreshProjectSession(document, state.projectSession.path, state.projectSession.lastSavedAt),
      session: {
        ...createDefaultSession(document),
        statusHint: state.session.statusHint,
      },
    })),
  newProject: async (name) => {
    const current = get();

    if (!confirmDiscardUnsavedChanges(current.projectSession.dirty, "create a new project")) {
      set((state) => ({
        session: {
          ...state.session,
          statusHint: "New project canceled to preserve unsaved work.",
        },
      }));
      return;
    }

    const document = createProjectDocument({ name: normalizeProjectName(name) });
    set(() => ({
      document,
      undoDocuments: [],
      redoDocuments: [],
      projectSession: buildFreshProjectSession(document, null, null),
      session: {
        ...createDefaultSession(document),
        statusHint: "Created a new in-memory project.",
      },
    }));
  },
  saveProject: async () => {
    const snapshot = get();
    if (!snapshot.projectSession.path) {
      await get().saveProjectAs();
      return;
    }

    try {
      const stampedDocument = stampDocumentForSave(snapshot.document);
      const bundle = buildSaveProjectBundle(stampedDocument, snapshot.projectSession.path);
      const result = await saveProjectBundle(bundle);

      set((state) => ({
        document: stampedDocument,
        projectSession: buildFreshProjectSession(stampedDocument, result.projectRoot, result.savedAt),
        session: {
          ...state.session,
          statusHint: `Saved project to ${result.projectRoot}.`,
        },
      }));
    } catch (error) {
      const message = toPersistenceErrorMessage(error);
      set((state) => ({
        projectSession: {
          ...state.projectSession,
          status: "error",
        },
        session: {
          ...state.session,
          statusHint: `Save failed: ${message}`,
        },
      }));
    }
  },
  saveProjectAs: async () => {
    try {
      const folderPath = await pickProjectFolder();

      if (!folderPath) {
        set((state) => ({
          session: {
            ...state.session,
            statusHint: "Save As canceled.",
          },
        }));
        return;
      }

      const snapshot = get();
      const stampedDocument = stampDocumentForSave(snapshot.document);
      const bundle = buildSaveProjectBundle(stampedDocument, folderPath);
      const result = await saveProjectBundle(bundle);

      set((state) => ({
        document: stampedDocument,
        projectSession: buildFreshProjectSession(stampedDocument, result.projectRoot, result.savedAt),
        session: {
          ...state.session,
          statusHint: `Saved project at ${result.manifestPath}.`,
        },
      }));
    } catch (error) {
      const message = toPersistenceErrorMessage(error);
      set((state) => ({
        projectSession: {
          ...state.projectSession,
          status: "error",
        },
        session: {
          ...state.session,
          statusHint: `Save As failed: ${message}`,
        },
      }));
    }
  },
  openProject: async () => {
    const current = get();
    if (!confirmDiscardUnsavedChanges(current.projectSession.dirty, "open another project")) {
      set((state) => ({
        session: {
          ...state.session,
          statusHint: "Open canceled to preserve unsaved work.",
        },
      }));
      return;
    }

    try {
      const selectedManifest = await pickProjectManifest();

      if (!selectedManifest) {
        set((state) => ({
          session: {
            ...state.session,
            statusHint: "Open project canceled.",
          },
        }));
        return;
      }

      const loaded = await loadProjectBundle(selectedManifest);
      const hydrated = hydrateProjectDocumentFromBundle(loaded);

      set(() => ({
        document: hydrated.document,
        undoDocuments: [],
        redoDocuments: [],
        projectSession: buildFreshProjectSession(
          hydrated.document,
          hydrated.projectRoot,
          hydrated.document.metadata.updatedAt,
        ),
        session: {
          ...createDefaultSession(hydrated.document),
          statusHint: `Opened project: ${hydrated.document.metadata.name}.`,
        },
      }));
    } catch (error) {
      const message = toPersistenceErrorMessage(error);
      set((state) => ({
        projectSession: {
          ...state.projectSession,
          status: "error",
        },
        session: {
          ...state.session,
          statusHint: `Open failed: ${message}`,
        },
      }));
    }
  },
  addLayer: (kind, name) => {
    const layer = createLayerDocument(kind, name);
    const layerId = layer.id as LayerId;

    set((current) => {
      const activeMap = current.document.maps[current.session.activeMapId];
      const selectedLayer = current.session.selectedLayerId
        ? activeMap.layers[current.session.selectedLayerId]
        : null;

      const shouldAttachToGroup = selectedLayer?.kind === "group" && layer.kind !== "group";

      const nextDocument = mutateActiveMap(current, (map) => {
        const nextLayers = { ...map.layers };

        if (shouldAttachToGroup && selectedLayer?.kind === "group") {
          layer.parentGroupId = selectedLayer.id;
          nextLayers[selectedLayer.id] = {
            ...selectedLayer,
            childLayerIds: [...selectedLayer.childLayerIds, layerId],
          };
        }

        nextLayers[layerId] = layer;

        return {
          ...map,
          layerOrder: [...map.layerOrder, layerId],
          layers: nextLayers,
        };
      });
      const historyPatch = buildHistoryPatch(current, `Add ${kind} layer`);

      return {
        document: nextDocument,
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        projectSession: {
          ...current.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...current.session,
          selectedLayerId: layerId,
          selection: { type: "layer", layerId },
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
          statusHint: `Created ${kind} layer`,
        },
      };
    });

    return layerId;
  },
  removeLayer: (layerId) =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const layerToDelete = map.layers[layerId];

      if (!layerToDelete) {
        return state;
      }

      const nextLayerOrder = map.layerOrder.filter((id) => id !== layerId);
      const nextLayers: typeof map.layers = { ...map.layers };
      delete nextLayers[layerId];

      for (const existingLayer of Object.values(nextLayers)) {
        if (existingLayer.kind === "group") {
          nextLayers[existingLayer.id] = {
            ...existingLayer,
            childLayerIds: existingLayer.childLayerIds.filter((childId) => childId !== layerId),
          };
        }
      }

      if (layerToDelete.kind === "group") {
        for (const childLayerId of layerToDelete.childLayerIds) {
          const childLayer = nextLayers[childLayerId];

          if (!childLayer) {
            continue;
          }

          nextLayers[childLayerId] = {
            ...childLayer,
            parentGroupId: null,
          };
        }
      }

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        layerOrder: nextLayerOrder,
        layers: nextLayers,
      }));
      const historyPatch = buildHistoryPatch(state, "Remove layer");

      const fallbackLayerId = nextLayerOrder[nextLayerOrder.length - 1] ?? null;

      return {
        document: nextDocument,
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          selectedLayerId: fallbackLayerId,
          selection: fallbackLayerId ? { type: "layer", layerId: fallbackLayerId } : { type: "none" },
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
          statusHint: "Removed selected layer",
        },
      };
    }),
  toggleLayerVisibility: (layerId) =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const layer = map.layers[layerId];

      if (!layer) {
        return state;
      }

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        layers: {
          ...map.layers,
          [layerId]: {
            ...layer,
            visible: !layer.visible,
          },
        },
      }));
      const historyPatch = buildHistoryPatch(state, "Toggle layer visibility");

      return {
        document: nextDocument,
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
        },
      };
    }),
  toggleLayerLock: (layerId) =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const layer = map.layers[layerId];

      if (!layer) {
        return state;
      }

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        layers: {
          ...map.layers,
          [layerId]: {
            ...layer,
            locked: !layer.locked,
          },
        },
      }));
      const historyPatch = buildHistoryPatch(state, "Toggle layer lock");

      return {
        document: nextDocument,
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
        },
      };
    }),
  setLayerOpacity: (layerId, opacity) =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const layer = map.layers[layerId];

      if (!layer) {
        return state;
      }

      const normalizedOpacity = Math.max(0, Math.min(1, opacity));
      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        layers: {
          ...map.layers,
          [layerId]: {
            ...layer,
            opacity: normalizedOpacity,
          },
        },
      }));
      const historyPatch = buildHistoryPatch(state, "Set layer opacity");

      return {
        document: nextDocument,
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
        },
      };
    }),
  renameLayer: (layerId, name) =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const layer = map.layers[layerId];

      if (!layer) {
        return state;
      }

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        layers: {
          ...map.layers,
          [layerId]: {
            ...layer,
            name,
          },
        },
      }));
      const historyPatch = buildHistoryPatch(state, "Rename layer");

      return {
        document: nextDocument,
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
        },
      };
    }),
  moveLayer: (layerId, direction) =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const index = map.layerOrder.indexOf(layerId);

      if (index === -1) {
        return state;
      }

      const targetIndex = direction === "up" ? index + 1 : index - 1;

      if (targetIndex < 0 || targetIndex >= map.layerOrder.length) {
        return state;
      }

      const nextOrder = [...map.layerOrder];
      const swap = nextOrder[targetIndex];
      nextOrder[targetIndex] = layerId;
      nextOrder[index] = swap;

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        layerOrder: nextOrder,
      }));
      const historyPatch = buildHistoryPatch(state, "Reorder layer");

      return {
        document: nextDocument,
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
        },
      };
    }),
  appendVectorDrawPoint: (x, y, clickCount) =>
    set((state) => {
      const vectorConfig = VECTOR_TOOL_KINDS[state.session.activeTool];

      if (!vectorConfig) {
        return state;
      }

      const map = state.document.maps[state.session.activeMapId];
      const selectedLayerId = state.session.selectedLayerId;

      if (!selectedLayerId) {
        return {
          session: {
            ...state.session,
            statusHint: "Select a vector layer before drawing.",
          },
        };
      }

      const layer = map.layers[selectedLayerId];

      if (!layer || layer.kind !== "vector") {
        return {
          session: {
            ...state.session,
            statusHint: "Vector tools only draw on vector layers.",
          },
        };
      }

      if (layer.locked || !layer.visible) {
        return {
          session: {
            ...state.session,
            statusHint: "Selected vector layer is locked or hidden.",
          },
        };
      }

      const point = { x, y };
      const shouldStartNew =
        !state.session.inProgressDraw ||
        state.session.inProgressDraw.layerId !== selectedLayerId ||
        state.session.inProgressDraw.tool !== state.session.activeTool;

      const existingPoints = !shouldStartNew && state.session.inProgressDraw ? state.session.inProgressDraw.points : [];
      const nextPoints = [...existingPoints, point];
      const minPoints = vectorConfig.geometry === "polygon" ? 3 : 2;
      const shouldComplete = clickCount >= 2 && nextPoints.length >= minPoints;

      if (!shouldComplete) {
        return {
          session: {
            ...state.session,
            inProgressDraw: {
              tool: state.session.activeTool,
              layerId: selectedLayerId,
              points: nextPoints,
            },
            statusHint: "Drawing vector feature. Double-click or press Enter to commit.",
          },
        };
      }

      const feature = createVectorFeatureSkeleton(vectorConfig.category, vectorConfig.geometry, nextPoints);
      feature.style.strokeColor = state.session.activeVector.strokeColor;
      feature.style.strokeWidth = state.session.activeVector.strokeWidth;
      feature.style.fillColor = state.session.activeVector.fillColor;
      feature.closed = vectorConfig.geometry === "polygon" ? true : state.session.activeVector.closed;
      const featureId = feature.id;

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        layers: {
          ...map.layers,
          [selectedLayerId]: {
            ...layer,
            features: {
              ...layer.features,
              [featureId]: feature,
            },
            featureOrder: [...layer.featureOrder, featureId],
          },
        },
      }));
      const historyPatch = buildHistoryPatch(state, `Create ${vectorConfig.category} feature`);

      return {
        document: nextDocument,
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          inProgressDraw: null,
          selection: { type: "vector", layerId: selectedLayerId, featureId },
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
          statusHint: `Created ${vectorConfig.category} feature`,
        },
      };
    }),
  completeVectorDraw: () =>
    set((state) => {
      const draw = state.session.inProgressDraw;

      if (!draw) {
        return state;
      }

      const vectorConfig = VECTOR_TOOL_KINDS[draw.tool];

      if (!vectorConfig) {
        return state;
      }

      const minPoints = vectorConfig.geometry === "polygon" ? 3 : 2;

      if (draw.points.length < minPoints) {
        return {
          session: {
            ...state.session,
            statusHint: `Need at least ${minPoints} points before completing.`,
          },
        };
      }

      const map = state.document.maps[state.session.activeMapId];
      const layer = map.layers[draw.layerId];

      if (!layer || layer.kind !== "vector") {
        return {
          session: {
            ...state.session,
            inProgressDraw: null,
          },
        };
      }

      const feature = createVectorFeatureSkeleton(vectorConfig.category, vectorConfig.geometry, draw.points);
      feature.style.strokeColor = state.session.activeVector.strokeColor;
      feature.style.strokeWidth = state.session.activeVector.strokeWidth;
      feature.style.fillColor = state.session.activeVector.fillColor;
      feature.closed = vectorConfig.geometry === "polygon" ? true : state.session.activeVector.closed;
      const featureId = feature.id;

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        layers: {
          ...map.layers,
          [draw.layerId]: {
            ...layer,
            features: {
              ...layer.features,
              [featureId]: feature,
            },
            featureOrder: [...layer.featureOrder, featureId],
          },
        },
      }));
      const historyPatch = buildHistoryPatch(state, `Commit ${vectorConfig.category} feature`);

      return {
        document: nextDocument,
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          inProgressDraw: null,
          selection: { type: "vector", layerId: draw.layerId, featureId },
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
          statusHint: `Committed ${vectorConfig.category} feature`,
        },
      };
    }),
  cancelVectorDraw: () =>
    set((state) => {
      if (!state.session.inProgressDraw) {
        return state;
      }

      return {
        session: {
          ...state.session,
          inProgressDraw: null,
          statusHint: "Canceled in-progress vector draw.",
        },
      };
    }),
  selectVectorFeature: (layerId, featureId) =>
    set((state) => {
      if (!featureId) {
        return {
          session: {
            ...state.session,
            selectedLayerId: layerId,
            selection: { type: "layer", layerId },
          },
        };
      }

      return {
        session: {
          ...state.session,
          selectedLayerId: layerId,
          selection: { type: "vector", layerId, featureId },
        },
      };
    }),
  selectVectorVertex: (layerId, featureId, vertexIndex) =>
    set((state) => ({
      session: {
        ...state.session,
        selectedLayerId: layerId,
        selection: { type: "vector-vertex", layerId, featureId, vertexIndex },
      },
    })),
  moveVectorVertex: (layerId, featureId, vertexIndex, x, y) =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const layer = map.layers[layerId];

      if (!layer || layer.kind !== "vector" || layer.locked || !layer.visible) {
        return state;
      }

      const feature = layer.features[featureId];

      if (!feature || vertexIndex < 0 || vertexIndex >= feature.points.length) {
        return state;
      }

      const nextPoints = feature.points.map((point, index) => {
        if (index !== vertexIndex) {
          return point;
        }

        return { x, y };
      });

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        layers: {
          ...map.layers,
          [layerId]: {
            ...layer,
            features: {
              ...layer.features,
              [featureId]: {
                ...feature,
                points: nextPoints,
                meta: {
                  ...feature.meta,
                  updatedAt: new Date().toISOString(),
                },
              },
            },
          },
        },
      }));

      return {
        document: nextDocument,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
      };
    }),
  moveVectorFeature: (layerId, featureId, deltaX, deltaY) =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const layer = map.layers[layerId];

      if (!layer || layer.kind !== "vector" || layer.locked || !layer.visible) {
        return state;
      }

      const feature = layer.features[featureId];

      if (!feature) {
        return state;
      }

      const nextPoints = feature.points.map((point) => ({
        x: point.x + deltaX,
        y: point.y + deltaY,
      }));

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        layers: {
          ...map.layers,
          [layerId]: {
            ...layer,
            features: {
              ...layer.features,
              [featureId]: {
                ...feature,
                points: nextPoints,
                meta: {
                  ...feature.meta,
                  updatedAt: new Date().toISOString(),
                },
              },
            },
          },
        },
      }));

      return {
        document: nextDocument,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
      };
    }),
  placeSymbolAt: (x, y) =>
    set((state) => {
      const selectedLayerId = state.session.selectedLayerId;
      const map = state.document.maps[state.session.activeMapId];

      if (!selectedLayerId) {
        return {
          session: {
            ...state.session,
            statusHint: "Select a symbol layer before placing symbols.",
          },
        };
      }

      const layer = map.layers[selectedLayerId];

      if (!layer || layer.kind !== "symbol") {
        return {
          session: {
            ...state.session,
            statusHint: "Symbol placement requires a symbol layer.",
          },
        };
      }

      if (layer.locked || !layer.visible) {
        return {
          session: {
            ...state.session,
            statusHint: "Selected symbol layer is locked or hidden.",
          },
        };
      }

      const symbolAsset = Object.values(state.document.assets).find(
        (asset) => asset.kind === "symbol" && asset.key === state.session.activeSymbol.symbolKey,
      );

      const symbol = createSymbolInstanceSkeleton(
        state.session.activeSymbol.symbolKey,
        state.session.activeSymbol.category,
        { x, y },
        symbolAsset?.id ?? null,
      );
      symbol.scale = state.session.activeSymbol.scale;
      symbol.rotationDegrees = state.session.activeSymbol.rotationDegrees;
      symbol.tint = state.session.activeSymbol.tint;
      const symbolId = symbol.id;

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        layers: {
          ...map.layers,
          [selectedLayerId]: {
            ...layer,
            symbols: {
              ...layer.symbols,
              [symbolId]: symbol,
            },
            symbolOrder: [...layer.symbolOrder, symbolId],
          },
        },
      }));
      const historyPatch = buildHistoryPatch(state, "Place symbol");

      return {
        document: nextDocument,
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          selection: { type: "symbol", layerId: selectedLayerId, symbolId },
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
          statusHint: `Placed symbol: ${symbol.symbolKey}`,
        },
      };
    }),
  placeLabelAt: (x, y) =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const selectedLayerId = state.session.selectedLayerId;
      const selectedLayer = selectedLayerId ? map.layers[selectedLayerId] : null;

      const findFallbackLabelLayer = () => {
        for (let index = map.layerOrder.length - 1; index >= 0; index -= 1) {
          const layer = map.layers[map.layerOrder[index]];

          if (!layer || layer.kind !== "label" || layer.locked || !layer.visible) {
            continue;
          }

          return layer;
        }

        return null;
      };

      let targetLayer = selectedLayer && selectedLayer.kind === "label" ? selectedLayer : null;
      let targetLayerId = targetLayer?.id ?? null;
      let autoSwitched = false;

      if (!targetLayer || targetLayer.locked || !targetLayer.visible) {
        const fallback = findFallbackLabelLayer();

        if (!fallback) {
          return {
            session: {
              ...state.session,
              statusHint: "Label placement requires a visible, unlocked label layer.",
            },
          };
        }

        targetLayer = fallback;
        targetLayerId = fallback.id;
        autoSwitched = fallback.id !== selectedLayerId;
      }

      if (!targetLayer || !targetLayerId) {
        return state;
      }

      const activeLabel = state.session.activeLabel;
      const baseCategory = isLabelCategory(activeLabel.category) ? activeLabel.category : "annotation";
      const text = activeLabel.defaultText.trim().length > 0 ? activeLabel.defaultText.trim() : "New label";
      const alignment = toLabelAlignment(activeLabel.alignment, "center");
      const label = createLabelAnnotationSkeleton(text, baseCategory, { x, y });
      const labelId = label.id;

      label.rotationDegrees = Number.isFinite(activeLabel.rotationDegrees) ? activeLabel.rotationDegrees : 0;
      label.anchorX = anchorFromAlignment(alignment);
      label.anchorY = 0.5;
      label.style.fontFamily = activeLabel.fontFamily || "Georgia";
      label.style.fontSize = Number.isFinite(activeLabel.fontSize)
        ? Math.max(8, Math.min(240, activeLabel.fontSize))
        : 24;
      label.style.fontWeight = Number.isFinite(activeLabel.fontWeight)
        ? Math.max(100, Math.min(900, Math.round(activeLabel.fontWeight)))
        : 600;
      label.style.color = activeLabel.color;
      label.style.opacity = Number.isFinite(activeLabel.opacity)
        ? Math.max(0, Math.min(1, activeLabel.opacity))
        : 1;
      label.style.align = alignment;

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        layers: {
          ...map.layers,
          [targetLayerId]: {
            ...targetLayer,
            labels: {
              ...targetLayer.labels,
              [labelId]: label,
            },
            labelOrder: [...targetLayer.labelOrder, labelId],
          },
        },
      }));
      const historyPatch = buildHistoryPatch(state, "Place label");

      return {
        document: nextDocument,
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          selectedLayerId: targetLayerId,
          selection: { type: "label", layerId: targetLayerId, labelId },
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
          statusHint: autoSwitched
            ? `Switched to "${targetLayer.name}" and placed label. Edit text in Inspector.`
            : "Placed label. Edit text in Inspector.",
        },
      };
    }),
  selectSymbol: (layerId, symbolId) =>
    set((state) => {
      if (!symbolId) {
        return {
          session: {
            ...state.session,
            selectedLayerId: layerId,
            selection: { type: "layer", layerId },
          },
        };
      }

      return {
        session: {
          ...state.session,
          selectedLayerId: layerId,
          selection: { type: "symbol", layerId, symbolId },
        },
      };
    }),
  selectLabel: (layerId, labelId) =>
    set((state) => {
      if (!labelId) {
        return {
          session: {
            ...state.session,
            selectedLayerId: layerId,
            selection: { type: "layer", layerId },
          },
        };
      }

      return {
        session: {
          ...state.session,
          selectedLayerId: layerId,
          selection: { type: "label", layerId, labelId },
        },
      };
    }),
  moveSymbol: (layerId, symbolId, x, y) =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const layer = map.layers[layerId];

      if (!layer || layer.kind !== "symbol" || layer.locked || !layer.visible) {
        return state;
      }

      const symbol = layer.symbols[symbolId];

      if (!symbol) {
        return state;
      }

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        layers: {
          ...map.layers,
          [layerId]: {
            ...layer,
            symbols: {
              ...layer.symbols,
              [symbolId]: {
                ...symbol,
                position: { x, y },
                meta: {
                  ...symbol.meta,
                  updatedAt: new Date().toISOString(),
                },
              },
            },
          },
        },
      }));

      return {
        document: nextDocument,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
      };
    }),
  moveLabel: (layerId, labelId, x, y) =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const layer = map.layers[layerId];

      if (!layer || layer.kind !== "label" || layer.locked || !layer.visible) {
        return state;
      }

      const label = layer.labels[labelId];

      if (!label) {
        return state;
      }

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        layers: {
          ...map.layers,
          [layerId]: {
            ...layer,
            labels: {
              ...layer.labels,
              [labelId]: {
                ...label,
                position: { x, y },
                meta: {
                  ...label.meta,
                  updatedAt: new Date().toISOString(),
                },
              },
            },
          },
        },
      }));

      return {
        document: nextDocument,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
      };
    }),
  updateSymbolTransform: (layerId, symbolId, scale, rotationDegrees) =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const layer = map.layers[layerId];

      if (!layer || layer.kind !== "symbol" || layer.locked || !layer.visible) {
        return state;
      }

      const symbol = layer.symbols[symbolId];

      if (!symbol) {
        return state;
      }

      const normalizedScale = Number.isFinite(scale) ? Math.max(0.2, Math.min(6, scale)) : symbol.scale;
      const normalizedRotation = Number.isFinite(rotationDegrees) ? rotationDegrees : 0;
      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        layers: {
          ...map.layers,
          [layerId]: {
            ...layer,
            symbols: {
              ...layer.symbols,
              [symbolId]: {
                ...symbol,
                scale: normalizedScale,
                rotationDegrees: normalizedRotation,
                meta: {
                  ...symbol.meta,
                  updatedAt: new Date().toISOString(),
                },
              },
            },
          },
        },
      }));
      const historyPatch = buildHistoryPatch(state, "Update symbol transform");

      return {
        document: nextDocument,
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
        },
      };
    }),
  updateLabel: (layerId, labelId, updates, historyLabel = "Update label") =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const layer = map.layers[layerId];

      if (!layer || layer.kind !== "label") {
        return state;
      }

      if (layer.locked || !layer.visible) {
        return {
          session: {
            ...state.session,
            statusHint: "Cannot edit labels on a hidden or locked layer.",
          },
        };
      }

      const label = layer.labels[labelId];

      if (!label) {
        return state;
      }

      let changed = false;
      let nextLabel = label;

      if (updates.text !== undefined) {
        const normalizedText = updates.text.trim().length > 0 ? updates.text : "Untitled label";
        if (normalizedText !== nextLabel.text) {
          changed = true;
          nextLabel = {
            ...nextLabel,
            text: normalizedText,
          };
        }
      }

      if (updates.category !== undefined && updates.category !== nextLabel.category) {
        changed = true;
        nextLabel = {
          ...nextLabel,
          category: updates.category,
        };
      }

      if (updates.rotationDegrees !== undefined) {
        const normalizedRotation = Number.isFinite(updates.rotationDegrees)
          ? updates.rotationDegrees
          : nextLabel.rotationDegrees;

        if (normalizedRotation !== nextLabel.rotationDegrees) {
          changed = true;
          nextLabel = {
            ...nextLabel,
            rotationDegrees: normalizedRotation,
          };
        }
      }

      if (updates.anchorX !== undefined) {
        const normalizedAnchorX = Number.isFinite(updates.anchorX) ? Math.max(0, Math.min(1, updates.anchorX)) : nextLabel.anchorX;
        if (normalizedAnchorX !== nextLabel.anchorX) {
          changed = true;
          nextLabel = {
            ...nextLabel,
            anchorX: normalizedAnchorX,
          };
        }
      }

      if (updates.anchorY !== undefined) {
        const normalizedAnchorY = Number.isFinite(updates.anchorY) ? Math.max(0, Math.min(1, updates.anchorY)) : nextLabel.anchorY;
        if (normalizedAnchorY !== nextLabel.anchorY) {
          changed = true;
          nextLabel = {
            ...nextLabel,
            anchorY: normalizedAnchorY,
          };
        }
      }

      if (updates.style) {
        const nextStyle = { ...nextLabel.style };
        let styleChanged = false;

        if (updates.style.fontFamily !== undefined && updates.style.fontFamily !== nextStyle.fontFamily) {
          nextStyle.fontFamily = updates.style.fontFamily;
          styleChanged = true;
        }

        if (updates.style.fontSize !== undefined) {
          const normalizedFontSize = Number.isFinite(updates.style.fontSize)
            ? Math.max(8, Math.min(240, updates.style.fontSize))
            : nextStyle.fontSize;
          if (normalizedFontSize !== nextStyle.fontSize) {
            nextStyle.fontSize = normalizedFontSize;
            styleChanged = true;
          }
        }

        if (updates.style.fontWeight !== undefined) {
          const normalizedFontWeight = Number.isFinite(updates.style.fontWeight)
            ? Math.max(100, Math.min(900, Math.round(updates.style.fontWeight)))
            : nextStyle.fontWeight;
          if (normalizedFontWeight !== nextStyle.fontWeight) {
            nextStyle.fontWeight = normalizedFontWeight;
            styleChanged = true;
          }
        }

        if (updates.style.color !== undefined && updates.style.color !== nextStyle.color) {
          nextStyle.color = updates.style.color;
          styleChanged = true;
        }

        if (updates.style.opacity !== undefined) {
          const normalizedOpacity = Number.isFinite(updates.style.opacity)
            ? Math.max(0, Math.min(1, updates.style.opacity))
            : nextStyle.opacity;
          if (normalizedOpacity !== nextStyle.opacity) {
            nextStyle.opacity = normalizedOpacity;
            styleChanged = true;
          }
        }

        if (updates.style.align !== undefined) {
          const normalizedAlign = toLabelAlignment(updates.style.align, nextStyle.align);
          if (normalizedAlign !== nextStyle.align) {
            nextStyle.align = normalizedAlign;
            styleChanged = true;
          }
        }

        if (styleChanged) {
          changed = true;
          nextLabel = {
            ...nextLabel,
            style: nextStyle,
          };
        }
      }

      if (!changed) {
        return state;
      }

      nextLabel = {
        ...nextLabel,
        meta: {
          ...nextLabel.meta,
          updatedAt: new Date().toISOString(),
        },
      };

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        layers: {
          ...map.layers,
          [layerId]: {
            ...layer,
            labels: {
              ...layer.labels,
              [labelId]: nextLabel,
            },
          },
        },
      }));
      const historyPatch = buildHistoryPatch(state, historyLabel);

      return {
        document: nextDocument,
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
          statusHint: historyLabel,
        },
      };
    }),
  deleteSelection: () =>
    set((state) => {
      const selection = state.session.selection;

      if (selection.type === "label") {
        const map = state.document.maps[state.session.activeMapId];
        const layer = map.layers[selection.layerId];

        if (layer && layer.kind === "label" && (layer.locked || !layer.visible)) {
          return {
            session: {
              ...state.session,
              statusHint: "Cannot delete labels from a hidden or locked layer.",
            },
          };
        }

        if (!layer || layer.kind !== "label" || !layer.labels[selection.labelId]) {
          return state;
        }

        const nextLabels = { ...layer.labels };
        delete nextLabels[selection.labelId];

        const nextDocument = mutateActiveMap(state, () => ({
          ...map,
          layers: {
            ...map.layers,
            [selection.layerId]: {
              ...layer,
              labels: nextLabels,
              labelOrder: layer.labelOrder.filter((id) => id !== selection.labelId),
            },
          },
        }));
        const historyPatch = buildHistoryPatch(state, "Delete label");

        return {
          document: nextDocument,
          undoDocuments: historyPatch.undoDocuments,
          redoDocuments: historyPatch.redoDocuments,
          projectSession: {
            ...state.projectSession,
            dirty: true,
            status: "needs-save",
          },
          session: {
            ...state.session,
            selection: { type: "layer", layerId: selection.layerId },
            undoStack: historyPatch.undoStack,
            redoStack: historyPatch.redoStack,
            statusHint: "Deleted selected label.",
          },
        };
      }

      if (selection.type === "symbol") {
        const map = state.document.maps[state.session.activeMapId];
        const layer = map.layers[selection.layerId];

        if (layer && layer.kind === "symbol" && (layer.locked || !layer.visible)) {
          return {
            session: {
              ...state.session,
              statusHint: "Cannot delete symbols from a hidden or locked layer.",
            },
          };
        }

        if (!layer || layer.kind !== "symbol" || !layer.symbols[selection.symbolId]) {
          return state;
        }

        const nextSymbols = { ...layer.symbols };
        delete nextSymbols[selection.symbolId];

        const nextDocument = mutateActiveMap(state, () => ({
          ...map,
          layers: {
            ...map.layers,
            [selection.layerId]: {
              ...layer,
              symbols: nextSymbols,
              symbolOrder: layer.symbolOrder.filter((id) => id !== selection.symbolId),
            },
          },
        }));
        const historyPatch = buildHistoryPatch(state, "Delete symbol");

        return {
          document: nextDocument,
          undoDocuments: historyPatch.undoDocuments,
          redoDocuments: historyPatch.redoDocuments,
          projectSession: {
            ...state.projectSession,
            dirty: true,
            status: "needs-save",
          },
          session: {
            ...state.session,
            selection: { type: "layer", layerId: selection.layerId },
            undoStack: historyPatch.undoStack,
            redoStack: historyPatch.redoStack,
            statusHint: "Deleted selected symbol.",
          },
        };
      }

      if (selection.type !== "vector" && selection.type !== "vector-vertex") {
        return state;
      }

      const layerId = selection.layerId;
      const featureId = selection.featureId;
      const map = state.document.maps[state.session.activeMapId];
      const layer = map.layers[layerId];

      if (layer && layer.kind === "vector" && (layer.locked || !layer.visible)) {
        return {
          session: {
            ...state.session,
            statusHint: "Cannot delete vector features from a hidden or locked layer.",
          },
        };
      }

      if (!layer || layer.kind !== "vector" || !layer.features[featureId]) {
        return state;
      }

      const nextFeatures = { ...layer.features };
      delete nextFeatures[featureId];

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        layers: {
          ...map.layers,
          [layerId]: {
            ...layer,
            features: nextFeatures,
            featureOrder: layer.featureOrder.filter((id) => id !== featureId),
          },
        },
      }));
      const historyPatch = buildHistoryPatch(state, "Delete vector feature");

      return {
        document: nextDocument,
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          selection: { type: "layer", layerId },
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
          statusHint: "Deleted selected vector feature.",
        },
      };
    }),
  duplicateSelection: () =>
    set((state) => {
      const selection = state.session.selection;

      if (selection.type === "vector") {
        const layerId = selection.layerId;
        const featureId = selection.featureId;
        const map = state.document.maps[state.session.activeMapId];
        const layer = map.layers[layerId];

        if (layer && layer.kind === "vector" && (layer.locked || !layer.visible)) {
          return {
            session: {
              ...state.session,
              statusHint: "Cannot duplicate vector features from a hidden or locked layer.",
            },
          };
        }

        if (!layer || layer.kind !== "vector" || !layer.features[featureId]) {
          return state;
        }

        const originalFeature = layer.features[featureId];
        const offsetX = 20;
        const offsetY = 20;

        const duplicatedFeature: typeof originalFeature = {
          ...originalFeature,
          id: createDocumentId("vector"),
          name: `${originalFeature.name} copy`,
          points: originalFeature.points.map((p) => ({
            x: p.x + offsetX,
            y: p.y + offsetY,
          })),
          meta: {
            createdAt: nowIso(),
            updatedAt: nowIso(),
          },
        };

        const nextDocument = mutateActiveMap(state, () => ({
          ...map,
          layers: {
            ...map.layers,
            [layerId]: {
              ...layer,
              features: {
                ...layer.features,
                [duplicatedFeature.id]: duplicatedFeature,
              },
              featureOrder: [...layer.featureOrder, duplicatedFeature.id],
            },
          },
        }));
        const historyPatch = buildHistoryPatch(state, "Duplicate vector feature");

        return {
          document: nextDocument,
          undoDocuments: historyPatch.undoDocuments,
          redoDocuments: historyPatch.redoDocuments,
          projectSession: {
            ...state.projectSession,
            dirty: true,
            status: "needs-save",
          },
          session: {
            ...state.session,
            selection: { type: "vector", layerId, featureId: duplicatedFeature.id },
            undoStack: historyPatch.undoStack,
            redoStack: historyPatch.redoStack,
            statusHint: "Duplicated vector feature.",
          },
        };
      }

      if (selection.type === "label") {
        const layerId = selection.layerId;
        const labelId = selection.labelId;
        const map = state.document.maps[state.session.activeMapId];
        const layer = map.layers[layerId];

        if (layer && layer.kind === "label" && (layer.locked || !layer.visible)) {
          return {
            session: {
              ...state.session,
              statusHint: "Cannot duplicate labels from a hidden or locked layer.",
            },
          };
        }

        if (!layer || layer.kind !== "label" || !layer.labels[labelId]) {
          return state;
        }

        const originalLabel = layer.labels[labelId];
        const offsetX = 20;
        const offsetY = 20;

        const duplicatedLabel: typeof originalLabel = {
          ...originalLabel,
          id: createDocumentId("label"),
          text: `${originalLabel.text} copy`,
          position: {
            x: originalLabel.position.x + offsetX,
            y: originalLabel.position.y + offsetY,
          },
          meta: {
            createdAt: nowIso(),
            updatedAt: nowIso(),
          },
        };

        const nextDocument = mutateActiveMap(state, () => ({
          ...map,
          layers: {
            ...map.layers,
            [layerId]: {
              ...layer,
              labels: {
                ...layer.labels,
                [duplicatedLabel.id]: duplicatedLabel,
              },
              labelOrder: [...layer.labelOrder, duplicatedLabel.id],
            },
          },
        }));
        const historyPatch = buildHistoryPatch(state, "Duplicate label");

        return {
          document: nextDocument,
          undoDocuments: historyPatch.undoDocuments,
          redoDocuments: historyPatch.redoDocuments,
          projectSession: {
            ...state.projectSession,
            dirty: true,
            status: "needs-save",
          },
          session: {
            ...state.session,
            selection: { type: "label", layerId, labelId: duplicatedLabel.id },
            undoStack: historyPatch.undoStack,
            redoStack: historyPatch.redoStack,
            statusHint: "Duplicated label.",
          },
        };
      }

      if (selection.type === "symbol") {
        const layerId = selection.layerId;
        const symbolId = selection.symbolId;
        const map = state.document.maps[state.session.activeMapId];
        const layer = map.layers[layerId];

        if (layer && layer.kind === "symbol" && (layer.locked || !layer.visible)) {
          return {
            session: {
              ...state.session,
              statusHint: "Cannot duplicate symbols from a hidden or locked layer.",
            },
          };
        }

        if (!layer || layer.kind !== "symbol" || !layer.symbols[symbolId]) {
          return state;
        }

        const originalSymbol = layer.symbols[symbolId];
        const offsetX = 20;
        const offsetY = 20;

        const duplicatedSymbol: typeof originalSymbol = {
          ...originalSymbol,
          id: createDocumentId("symbol"),
          name: `${originalSymbol.name} copy`,
          position: {
            x: originalSymbol.position.x + offsetX,
            y: originalSymbol.position.y + offsetY,
          },
          meta: {
            createdAt: nowIso(),
            updatedAt: nowIso(),
          },
        };

        const nextDocument = mutateActiveMap(state, () => ({
          ...map,
          layers: {
            ...map.layers,
            [layerId]: {
              ...layer,
              symbols: {
                ...layer.symbols,
                [duplicatedSymbol.id]: duplicatedSymbol,
              },
              symbolOrder: [...layer.symbolOrder, duplicatedSymbol.id],
            },
          },
        }));
        const historyPatch = buildHistoryPatch(state, "Duplicate symbol");

        return {
          document: nextDocument,
          undoDocuments: historyPatch.undoDocuments,
          redoDocuments: historyPatch.redoDocuments,
          projectSession: {
            ...state.projectSession,
            dirty: true,
            status: "needs-save",
          },
          session: {
            ...state.session,
            selection: { type: "symbol", layerId, symbolId: duplicatedSymbol.id },
            undoStack: historyPatch.undoStack,
            redoStack: historyPatch.redoStack,
            statusHint: "Duplicated symbol.",
          },
        };
      }

      return {
        session: {
          ...state.session,
          statusHint: "Can only duplicate vector features, symbols, or labels.",
        },
      };
    }),
  applyBrushSample: (x, y) =>
    set((state) => {
      if (state.session.activeTool !== "paint" && state.session.activeTool !== "erase") {
        return state;
      }

      const map = state.document.maps[state.session.activeMapId];
      const selectedLayerId = state.session.selectedLayerId;

      if (!selectedLayerId) {
        return {
          session: {
            ...state.session,
            statusHint: "Select a paint, mask, or data overlay layer before brushing.",
          },
        };
      }

      const layer = map.layers[selectedLayerId];

      if (!layer || (layer.kind !== "paint" && layer.kind !== "mask" && layer.kind !== "dataOverlay")) {
        return {
          session: {
            ...state.session,
            statusHint: "Paint tools only work on paint/mask/data overlay layers.",
          },
        };
      }

      if (!layer.visible || layer.locked) {
        return {
          session: {
            ...state.session,
            statusHint: "Target layer is hidden or locked.",
          },
        };
      }

      const isErase = state.session.activeTool === "erase";
      const brush = state.session.activeBrush;
      const radius = Math.max(1, brush.size);
      const cellSize = Math.max(1, layer.cellSize);
      const chunkSize = Math.max(cellSize, layer.chunkSize);
      const cellsPerChunk = Math.max(1, Math.round(chunkSize / cellSize));

      const minCellX = Math.floor((x - radius) / cellSize);
      const maxCellX = Math.floor((x + radius) / cellSize);
      const minCellY = Math.floor((y - radius) / cellSize);
      const maxCellY = Math.floor((y + radius) / cellSize);

      const nextChunks = { ...layer.chunks };
      let changed = false;

      for (let globalCellY = minCellY; globalCellY <= maxCellY; globalCellY += 1) {
        for (let globalCellX = minCellX; globalCellX <= maxCellX; globalCellX += 1) {
          const centerX = globalCellX * cellSize + cellSize / 2;
          const centerY = globalCellY * cellSize + cellSize / 2;
          const dx = centerX - x;
          const dy = centerY - y;

          if (dx * dx + dy * dy > radius * radius) {
            continue;
          }

          const chunkX = Math.floor(globalCellX / cellsPerChunk);
          const chunkY = Math.floor(globalCellY / cellsPerChunk);
          const key = `${chunkX}:${chunkY}`;
          const localX = globalCellX - chunkX * cellsPerChunk;
          const localY = globalCellY - chunkY * cellsPerChunk;
          const cellKey = `${localX}:${localY}`;

          const existingChunk = nextChunks[key];
          const chunk =
            existingChunk ??
            createPaintChunkSkeleton(chunkX, chunkY, cellsPerChunk, cellsPerChunk, cellSize);

          const nextChunk = existingChunk
            ? {
                ...existingChunk,
                cells: { ...existingChunk.cells },
                meta: {
                  ...existingChunk.meta,
                  updatedAt: new Date().toISOString(),
                },
              }
            : chunk;

          if (isErase) {
            if (nextChunk.cells[cellKey]) {
              delete nextChunk.cells[cellKey];
              changed = true;
            }
          } else {
            nextChunk.cells[cellKey] = {
              x: localX,
              y: localY,
              sample: {
                color: brush.color,
                opacity: brush.opacity,
                value: brush.value,
                category: brush.category,
              },
            };
            changed = true;
          }

          nextChunks[key] = nextChunk;
        }
      }

      if (!changed) {
        return state;
      }

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        layers: {
          ...map.layers,
          [selectedLayerId]: {
            ...layer,
            chunks: nextChunks,
          },
        },
      }));

      return {
        document: nextDocument,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
      };
    }),
  applyTerrainBrushSample: (x, y) =>
    set((state) => {
      if (state.session.activeTool !== "terrain") {
        return state;
      }

      const map = state.document.maps[state.session.activeMapId];
      const brush = state.session.activeTerrainBrush;
      const result = applyTerrainBrushAtPoint(map.terrain, {
        worldX: x,
        worldY: y,
        brush,
      });

      if (!result.changed) {
        return state;
      }

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        terrain: result.terrain,
      }));

      return {
        document: nextDocument,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          statusHint: `Terrain ${brush.tool} stroke (${result.affectedSamples} samples).`,
        },
      };
    }),
  checkpointHistory: (label) =>
    set((state) => {
      const historyPatch = buildHistoryPatch(state, label);

      return {
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        session: {
          ...state.session,
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
        },
      };
    }),
  undo: () =>
    set((state) => {
      if (state.undoDocuments.length === 0) {
        return state;
      }

      const previousDocument = state.undoDocuments[state.undoDocuments.length - 1];
      const nextUndoDocuments = state.undoDocuments.slice(0, -1);
      const nextRedoDocuments = [...state.redoDocuments, cloneDocumentSnapshot(state.document)].slice(-HISTORY_LIMIT);

      const nextUndoStack = state.session.undoStack.slice(0, -1);
      const lastUndo = state.session.undoStack[state.session.undoStack.length - 1];
      const nextRedoStack = lastUndo
        ? [...state.session.redoStack, { ...lastUndo, label: `Redo ${lastUndo.label}` }].slice(-HISTORY_LIMIT)
        : state.session.redoStack;

      const nextActiveMapId = previousDocument.maps[state.session.activeMapId]
        ? state.session.activeMapId
        : previousDocument.rootWorldMapId;
      const nextMap = previousDocument.maps[nextActiveMapId];
      const selectedLayerStillExists =
        state.session.selectedLayerId !== null &&
        Boolean(nextMap.layers[state.session.selectedLayerId]);

      return {
        document: previousDocument,
        undoDocuments: nextUndoDocuments,
        redoDocuments: nextRedoDocuments,
        session: {
          ...state.session,
          activeMapId: nextActiveMapId,
          activeScope: nextMap.scope,
          selectedLayerId: selectedLayerStillExists ? state.session.selectedLayerId : nextMap.layerOrder[0] ?? null,
          selection: { type: "none" },
          inProgressDraw: null,
          inProgressExtent: null,
          activeExtent: {
            ...state.session.activeExtent,
            childScope: canCreateChildScope(nextMap.scope, state.session.activeExtent.childScope)
              ? state.session.activeExtent.childScope
              : getDefaultChildScopeForMap(nextMap.scope),
          },
          undoStack: nextUndoStack,
          redoStack: nextRedoStack,
          statusHint: "Undo applied.",
        },
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
      };
    }),
  redo: () =>
    set((state) => {
      if (state.redoDocuments.length === 0) {
        return state;
      }

      const nextDocument = state.redoDocuments[state.redoDocuments.length - 1];
      const nextRedoDocuments = state.redoDocuments.slice(0, -1);
      const nextUndoDocuments = [...state.undoDocuments, cloneDocumentSnapshot(state.document)].slice(-HISTORY_LIMIT);

      const lastRedo = state.session.redoStack[state.session.redoStack.length - 1];
      const nextRedoStack = state.session.redoStack.slice(0, -1);
      const nextUndoStack = lastRedo
        ? [...state.session.undoStack, { ...lastRedo, label: lastRedo.label.replace(/^Redo\\s+/, "") }].slice(-HISTORY_LIMIT)
        : state.session.undoStack;

      const nextActiveMapId = nextDocument.maps[state.session.activeMapId]
        ? state.session.activeMapId
        : nextDocument.rootWorldMapId;
      const nextMap = nextDocument.maps[nextActiveMapId];
      const selectedLayerStillExists =
        state.session.selectedLayerId !== null &&
        Boolean(nextMap.layers[state.session.selectedLayerId]);

      return {
        document: nextDocument,
        undoDocuments: nextUndoDocuments,
        redoDocuments: nextRedoDocuments,
        session: {
          ...state.session,
          activeMapId: nextActiveMapId,
          activeScope: nextMap.scope,
          selectedLayerId: selectedLayerStillExists ? state.session.selectedLayerId : nextMap.layerOrder[0] ?? null,
          selection: { type: "none" },
          inProgressDraw: null,
          inProgressExtent: null,
          activeExtent: {
            ...state.session.activeExtent,
            childScope: canCreateChildScope(nextMap.scope, state.session.activeExtent.childScope)
              ? state.session.activeExtent.childScope
              : getDefaultChildScopeForMap(nextMap.scope),
          },
          undoStack: nextUndoStack,
          redoStack: nextRedoStack,
          statusHint: "Redo applied.",
        },
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
      };
    }),
  setBrushSetting: (key, value) =>
    set((state) => ({
      session: {
        ...state.session,
        activeBrush: {
          ...state.session.activeBrush,
          [key]: value,
        },
      },
    })),
  setVectorSetting: (key, value) =>
    set((state) => ({
      session: {
        ...state.session,
        activeVector: {
          ...state.session.activeVector,
          [key]: value,
        },
      },
    })),
  setSymbolSetting: (key, value) =>
    set((state) => ({
      session: {
        ...state.session,
        activeSymbol: {
          ...state.session.activeSymbol,
          [key]: value,
        },
      },
    })),
  setLabelSetting: (key, value) =>
    set((state) => ({
      session: {
        ...state.session,
        activeLabel: {
          ...state.session.activeLabel,
          [key]: value,
        },
      },
    })),
  setExtentSetting: (key, value) =>
    set((state) => ({
      session: {
        ...state.session,
        activeExtent: {
          ...state.session.activeExtent,
          [key]: value,
        },
      },
    })),
  setTerrainBrushSetting: (key, value) =>
    set((state) => {
      const normalizedValue = normalizeTerrainBrushSettingValue(key, value);

      if (state.session.activeTerrainBrush[key] === normalizedValue) {
        return state;
      }

      return {
        session: {
          ...state.session,
          activeTerrainBrush: {
            ...state.session.activeTerrainBrush,
            [key]: normalizedValue,
          },
        },
      };
    }),
  setTerrainGenerationSetting: (key, value) =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const normalizedValue = normalizeTerrainGenerationSettingValue(key, value);
      const currentValue = map.terrain.generation.settings[key];

      if (currentValue === normalizedValue) {
        return state;
      }

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        terrain: {
          ...map.terrain,
          generation: {
            ...map.terrain.generation,
            settings: {
              ...map.terrain.generation.settings,
              [key]: normalizedValue,
            },
          },
          meta: {
            ...map.terrain.meta,
            updatedAt: nowIso(),
          },
        },
      }));

      return {
        document: nextDocument,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
      };
    }),
  setTerrainSeaLevel: (seaLevel) =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const normalizedSeaLevel = clampTerrainSeaLevel(seaLevel);

      if (map.terrain.seaLevel === normalizedSeaLevel) {
        return state;
      }

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        terrain: {
          ...map.terrain,
          seaLevel: normalizedSeaLevel,
          derived: invalidateTerrainDerivedCache(map.terrain.derived),
          meta: {
            ...map.terrain.meta,
            updatedAt: nowIso(),
          },
        },
      }));

      return {
        document: nextDocument,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          statusHint: "Updated terrain sea level.",
        },
      };
    }),
  setTerrainDisplaySetting: (key, value) =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const normalizedValue = normalizeTerrainDisplaySettingValue(key, value);
      const currentValue = map.terrain.display[key];

      if (currentValue === normalizedValue) {
        return state;
      }

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        terrain: {
          ...map.terrain,
          display: {
            ...map.terrain.display,
            [key]: normalizedValue,
          },
          derived:
            key === "contourInterval" || key === "showContours"
              ? {
                  ...map.terrain.derived,
                  contourRevision: null,
                  cachedAt: null,
                  contourSegmentCount: 0,
                }
              : map.terrain.derived,
          meta: {
            ...map.terrain.meta,
            updatedAt: nowIso(),
          },
        },
      }));

      return {
        document: nextDocument,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          statusHint: `Updated terrain display ${String(key)}.`,
        },
      };
    }),
  generateTerrainForActiveMap: () =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const randomSeed = createRandomTerrainSeed();
      const generatedTerrain = generateTerrainForMap(
        {
          ...map,
          terrain: {
            ...map.terrain,
            generation: {
              ...map.terrain.generation,
              settings: {
                ...map.terrain.generation.settings,
                seed: randomSeed,
              },
            },
          },
        },
        { seedOverride: randomSeed },
      );
      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        terrain: generatedTerrain,
      }));
      const historyPatch = buildHistoryPatch(state, "Generate terrain");

      return {
        document: nextDocument,
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
          statusHint: `Generated terrain with seed ${randomSeed}.`,
        },
      };
    }),
  regenerateTerrainForActiveMap: () =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const generatedTerrain = generateTerrainForMap(map);
      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        terrain: generatedTerrain,
      }));
      const historyPatch = buildHistoryPatch(state, "Regenerate terrain");

      return {
        document: nextDocument,
        undoDocuments: historyPatch.undoDocuments,
        redoDocuments: historyPatch.redoDocuments,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          undoStack: historyPatch.undoStack,
          redoStack: historyPatch.redoStack,
          statusHint: `Regenerated terrain from seed ${generatedTerrain.generation.settings.seed}.`,
        },
      };
    }),
  randomizeTerrainSeed: () =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const nextSeed = createRandomTerrainSeed();
      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        terrain: {
          ...map.terrain,
          generation: {
            ...map.terrain.generation,
            settings: {
              ...map.terrain.generation.settings,
              seed: nextSeed,
            },
          },
          meta: {
            ...map.terrain.meta,
            updatedAt: nowIso(),
          },
        },
      }));

      return {
        document: nextDocument,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          statusHint: `Terrain seed randomized to ${nextSeed}.`,
        },
      };
    }),
  refreshTerrainDerivedForActiveMap: () =>
    set((state) => {
      const map = state.document.maps[state.session.activeMapId];
      const includeContours =
        map.terrain.display.showContours || map.terrain.display.renderMode === "contour-preview";
      const derivedProducts = deriveTerrainProducts(map.terrain, {
        includeContours,
        contourInterval: map.terrain.display.contourInterval,
      });
      const terrainRevision = map.terrain.generation.revision;
      const refreshedAt = nowIso();

      const nextDocument = mutateActiveMap(state, () => ({
        ...map,
        terrain: {
          ...map.terrain,
          derived: {
            ...map.terrain.derived,
            coastlineRevision: terrainRevision,
            landMaskRevision: terrainRevision,
            contourRevision: includeContours ? terrainRevision : null,
            cachedAt: refreshedAt,
            lastSeaLevel: map.terrain.seaLevel,
            coastlineSegmentCount: derivedProducts.coastlineSegments.length,
            contourSegmentCount: derivedProducts.contourSegments.length,
            landSampleCount: derivedProducts.landSampleCount,
            waterSampleCount: derivedProducts.waterSampleCount,
          },
          meta: {
            ...map.terrain.meta,
            updatedAt: refreshedAt,
          },
        },
      }));

      return {
        document: nextDocument,
        projectSession: {
          ...state.projectSession,
          dirty: true,
          status: "needs-save",
        },
        session: {
          ...state.session,
          statusHint: `Derived terrain refreshed (${derivedProducts.coastlineSegments.length} coastline segments).`,
        },
      };
    }),
}));

export const selectActiveMap = (state: EditorStoreState) => {
  return state.document.maps[state.session.activeMapId];
};

export const selectActiveView = (state: EditorStoreState) => {
  return ensureViewState(state, state.session.activeMapId);
};

export const selectActiveMapLayers = (state: EditorStoreState): MapLayerDocument[] => {
  const map = selectActiveMap(state);
  return map.layerOrder.map((layerId) => map.layers[layerId]).filter(Boolean);
};

export const selectSelectedLayer = (state: EditorStoreState) => {
  const activeMap = selectActiveMap(state);
  const selectedLayerId = state.session.selectedLayerId;

  if (!selectedLayerId) {
    return null;
  }

  return activeMap.layers[selectedLayerId] ?? null;
};

export const selectSelectedVectorFeature = (state: EditorStoreState) => {
  const selection = state.session.selection;

  if (selection.type !== "vector" && selection.type !== "vector-vertex") {
    return null;
  }

  const map = selectActiveMap(state);
  const layer = map.layers[selection.layerId];

  if (!layer || layer.kind !== "vector") {
    return null;
  }

  const feature = layer.features[selection.featureId];

  if (!feature) {
    return null;
  }

  return {
    layer,
    feature,
  };
};

export const selectSelectedSymbol = (state: EditorStoreState) => {
  const selection = state.session.selection;

  if (selection.type !== "symbol") {
    return null;
  }

  const map = selectActiveMap(state);
  const layer = map.layers[selection.layerId];

  if (!layer || layer.kind !== "symbol") {
    return null;
  }

  const symbol = layer.symbols[selection.symbolId];

  if (!symbol) {
    return null;
  }

  return {
    layer,
    symbol,
  };
};

export const selectSelectedLabel = (state: EditorStoreState) => {
  const selection = state.session.selection;

  if (selection.type !== "label") {
    return null;
  }

  const map = selectActiveMap(state);
  const layer = map.layers[selection.layerId];

  if (!layer || layer.kind !== "label") {
    return null;
  }

  const label = layer.labels[selection.labelId];

  if (!label) {
    return null;
  }

  return {
    layer,
    label,
  };
};

export const selectSelectedMapLink = (state: EditorStoreState) => {
  const selection = state.session.selection;

  if (selection.type !== "map-extent") {
    return null;
  }

  const activeMap = selectActiveMap(state);
  const link = activeMap.nestedLinks[selection.linkId];

  if (!link) {
    return null;
  }

  const parentMap = state.document.maps[link.parentMapId] ?? null;
  const childMap = state.document.maps[link.childMapId] ?? null;

  return {
    link,
    parentMap,
    childMap,
  };
};

export const selectMapBreadcrumbNodes = (state: EditorStoreState): MapId[] => {
  const activeMap = selectActiveMap(state);
  const chain: MapId[] = [activeMap.id];
  let parentId = activeMap.parentMapId;

  while (parentId) {
    const parentMap = state.document.maps[parentId];

    if (!parentMap) {
      break;
    }

    chain.unshift(parentMap.id);
    parentId = parentMap.parentMapId;
  }

  return chain;
};

export const selectMapBreadcrumb = (state: EditorStoreState): string[] => {
  return selectMapBreadcrumbNodes(state).map((mapId) => state.document.maps[mapId]?.name ?? mapId);
};

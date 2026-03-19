import {
  DEFAULT_CELL_SIZE,
  DEFAULT_CHUNK_SIZE,
  DEFAULT_PROJECT_SETTINGS,
  DEFAULT_WORLD_HEIGHT,
  DEFAULT_WORLD_WIDTH,
  PROJECT_SCHEMA_VERSION,
} from "../constants/documentDefaults";
import { STARTER_SYMBOLS } from "../assets";
import type {
  AssetReference,
  DataOverlayLayerDocument,
  DocumentPoint,
  LabelAnnotation,
  LabelLayerDocument,
  LayerId,
  LayerKind,
  MapDocument,
  MapLayerDocument,
  MapScope,
  PaintChunk,
  PaintLayerDocument,
  ProjectManifest,
  SymbolInstance,
  SymbolLayerDocument,
  VectorFeature,
  VectorFeatureCategory,
  VectorLayerDocument,
  WorldSeedProjectDocument,
} from "../../types";
import { createDocumentId, nowIso } from "./idFactory";

const buildMeta = () => {
  const now = nowIso();
  return {
    createdAt: now,
    updatedAt: now,
  };
};

const createBuiltinAssetReferences = (): Record<string, AssetReference> => {
  return STARTER_SYMBOLS.reduce<Record<string, AssetReference>>((record, symbol) => {
    const assetId = `asset-builtin-symbol-${symbol.key}`;
    record[assetId] = {
      id: assetId,
      key: symbol.key,
      kind: "symbol",
      source: "builtin",
      relativePath: `builtin://symbols/${symbol.key}`,
      format: "builtin-symbol",
      metadata: {
        category: symbol.category,
        label: symbol.label,
      },
      meta: buildMeta(),
    };
    return record;
  }, {});
};

const createBaseLayer = (kind: LayerKind, name: string): Omit<MapLayerDocument, "kind"> & { kind: LayerKind } => ({
  id: createDocumentId("layer") as LayerId,
  name,
  kind,
  visible: true,
  locked: false,
  opacity: 1,
  blendMode: "normal",
  parentGroupId: null,
  meta: buildMeta(),
} as MapLayerDocument & { kind: LayerKind });

export const createLayerDocument = (kind: LayerKind, name?: string): MapLayerDocument => {
  const baseName = name ?? `${kind[0].toUpperCase()}${kind.slice(1)} Layer`;
  const base = createBaseLayer(kind, baseName);

  switch (kind) {
    case "group":
      return {
        ...base,
        kind,
        childLayerIds: [],
      };
    case "vector":
      return {
        ...base,
        kind,
        features: {},
        featureOrder: [],
      } as VectorLayerDocument;
    case "paint":
      return {
        ...base,
        kind,
        paintMode: "paint",
        chunkSize: DEFAULT_CHUNK_SIZE,
        cellSize: DEFAULT_CELL_SIZE,
        chunks: {},
      } as PaintLayerDocument;
    case "mask":
      return {
        ...base,
        kind,
        paintMode: "mask",
        chunkSize: DEFAULT_CHUNK_SIZE,
        cellSize: DEFAULT_CELL_SIZE,
        chunks: {},
      } as PaintLayerDocument;
    case "symbol":
      return {
        ...base,
        kind,
        symbols: {},
        symbolOrder: [],
      } as SymbolLayerDocument;
    case "label":
      return {
        ...base,
        kind,
        labels: {},
        labelOrder: [],
      } as LabelLayerDocument;
    case "dataOverlay":
      return {
        ...base,
        kind,
        paintMode: "data",
        chunkSize: DEFAULT_CHUNK_SIZE,
        cellSize: DEFAULT_CELL_SIZE,
        settings: {
          mode: "categorical",
          legend: {
            dry: "#d8a35f",
            temperate: "#77bf8a",
            wet: "#5c88d9",
          },
        },
        chunks: {},
      } as DataOverlayLayerDocument;
    case "reference":
      return {
        ...base,
        kind,
        assetId: null,
      };
    case "elevation":
      return {
        ...base,
        kind,
        method: "heightfield",
      };
    case "annotation":
      return {
        ...base,
        kind,
        notes: [],
      };
    default:
      return {
        ...base,
        kind: "vector",
        features: {},
        featureOrder: [],
      } as VectorLayerDocument;
  }
};

const createStarterLayers = (): MapLayerDocument[] => {
  return [
    createLayerDocument("vector", "Coastlines"),
    createLayerDocument("vector", "Rivers & Roads"),
    createLayerDocument("mask", "Land / Ocean Mask"),
    createLayerDocument("dataOverlay", "Biome & Weather Overlay"),
    createLayerDocument("symbol", "Terrain Features"),
    createLayerDocument("label", "Labels"),
  ];
};

const addLayersToMap = (map: MapDocument, layers: MapLayerDocument[]): MapDocument => {
  const layerOrder: LayerId[] = [];
  const layerRecord: Record<LayerId, MapLayerDocument> = {};

  for (const layer of layers) {
    layerOrder.push(layer.id as LayerId);
    layerRecord[layer.id as LayerId] = layer;
  }

  return {
    ...map,
    layerOrder,
    layers: layerRecord,
  };
};

export interface CreateMapDocumentInput {
  name: string;
  scope: MapScope;
  parentMapId?: string | null;
  width?: number;
  height?: number;
}

export const createMapDocument = ({
  name,
  scope,
  parentMapId = null,
  width = DEFAULT_WORLD_WIDTH,
  height = DEFAULT_WORLD_HEIGHT,
}: CreateMapDocumentInput): MapDocument => {
  return {
    id: createDocumentId("map"),
    name,
    scope,
    parentMapId,
    childMapIds: [],
    projection: {
      kind: "equirectangular",
      unitLabel: "world-unit",
      wrapsHorizontally: true,
    },
    dimensions: {
      width,
      height,
    },
    layerOrder: [],
    layers: {},
    nestedLinks: {},
    settings: {
      backgroundColor: "#0f1829",
      gridEnabled: true,
      guidesEnabled: true,
      chunkSize: DEFAULT_CHUNK_SIZE,
      cellSize: DEFAULT_CELL_SIZE,
    },
    meta: buildMeta(),
  };
};

export const createDefaultWorldMap = (name = "Master World"): MapDocument => {
  const worldMap = createMapDocument({
    name,
    scope: "world",
    width: DEFAULT_WORLD_WIDTH,
    height: DEFAULT_WORLD_HEIGHT,
  });

  return addLayersToMap(worldMap, createStarterLayers());
};

export interface CreateProjectInput {
  name?: string;
  description?: string;
  author?: string;
}

export const createProjectDocument = ({
  name = "Untitled World Seed",
  description,
  author,
}: CreateProjectInput = {}): WorldSeedProjectDocument => {
  const rootMap = createDefaultWorldMap();
  const now = nowIso();

  return {
    metadata: {
      id: createDocumentId("project"),
      name,
      description,
      author,
      schemaVersion: PROJECT_SCHEMA_VERSION,
      createdAt: now,
      updatedAt: now,
    },
    rootWorldMapId: rootMap.id,
    mapOrder: [rootMap.id],
    maps: {
      [rootMap.id]: rootMap,
    },
    assets: createBuiltinAssetReferences(),
    settings: {
      ...DEFAULT_PROJECT_SETTINGS,
    },
  };
};

export const createProjectManifest = (project: WorldSeedProjectDocument): ProjectManifest => {
  return {
    projectId: project.metadata.id,
    projectName: project.metadata.name,
    schemaVersion: project.metadata.schemaVersion,
    createdAt: project.metadata.createdAt,
    updatedAt: project.metadata.updatedAt,
    rootWorldMapId: project.rootWorldMapId,
    mapRegistry: project.mapOrder.map((mapId, index) => {
      const map = project.maps[mapId];
      return {
        mapId,
        name: map.name,
        scope: map.scope,
        parentMapId: map.parentMapId,
        file: `maps/${mapId}.json`,
        order: index,
      };
    }),
    assetRegistry: Object.values(project.assets).map((asset) => ({
      assetId: asset.id,
      key: asset.key,
      kind: asset.kind,
      source: asset.source,
      relativePath: asset.relativePath,
      format: asset.format,
    })),
    settings: {
      ...project.settings,
    },
  };
};

export const createVectorFeatureSkeleton = (
  category: VectorFeatureCategory,
  geometryType: "polyline" | "polygon",
  points: DocumentPoint[] = [],
): VectorFeature => {
  const isClosed = geometryType === "polygon";

  const styleByCategory: Record<VectorFeatureCategory, { strokeColor: string; strokeWidth: number; fillColor?: string }> = {
    coastline: { strokeColor: "#e8f1ff", strokeWidth: 3, fillColor: "#335f9d" },
    river: { strokeColor: "#4fb0ff", strokeWidth: 2 },
    border: { strokeColor: "#f4bf5e", strokeWidth: 2 },
    road: { strokeColor: "#a99670", strokeWidth: 1.8 },
    path: { strokeColor: "#dbe7f7", strokeWidth: 1.6 },
    polygon: { strokeColor: "#dbe7f7", strokeWidth: 1.6, fillColor: "#5c7ca8" },
  };

  const style = styleByCategory[category];

  return {
    id: createDocumentId("vector"),
    name: `${category[0].toUpperCase()}${category.slice(1)} Feature`,
    category,
    geometryType,
    points,
    closed: isClosed,
    style: {
      strokeColor: style.strokeColor,
      strokeWidth: style.strokeWidth,
      strokeOpacity: 1,
      fillColor: style.fillColor,
      fillOpacity: style.fillColor ? 0.22 : undefined,
      dashed: category === "border",
      lineJoin: "round",
    },
    meta: buildMeta(),
  };
};

export const createSymbolInstanceSkeleton = (
  symbolKey: string,
  category: string,
  position: DocumentPoint,
  assetId: string | null = null,
): SymbolInstance => {
  return {
    id: createDocumentId("symbol"),
    name: `${category} marker`,
    symbolKey,
    assetId,
    category,
    position,
    rotationDegrees: 0,
    scale: 1,
    tint: "#f2eadf",
    opacity: 1,
    meta: buildMeta(),
  };
};

export const createLabelAnnotationSkeleton = (
  text: string,
  category: LabelAnnotation["category"],
  position: DocumentPoint,
): LabelAnnotation => {
  return {
    id: createDocumentId("label"),
    text,
    category,
    position,
    rotationDegrees: 0,
    anchorX: 0.5,
    anchorY: 0.5,
    style: {
      fontFamily: "Georgia",
      fontSize: 24,
      fontWeight: 600,
      color: "#f7edd7",
      opacity: 1,
      align: "center",
    },
    meta: buildMeta(),
  };
};

export const createPaintChunkSkeleton = (
  chunkX: number,
  chunkY: number,
  widthCells = 32,
  heightCells = 32,
  cellSize = DEFAULT_CELL_SIZE,
): PaintChunk => {
  return {
    key: `${chunkX}:${chunkY}`,
    chunkX,
    chunkY,
    widthCells,
    heightCells,
    cellSize,
    cells: {},
    meta: buildMeta(),
  };
};

import type {
  DataOverlayLayerDocument,
  EditorViewState,
  MapDocument,
  MapLayerDocument,
  PaintLayerDocument,
  WorldSeedProjectDocument,
} from "../../types";
import { computeExportSourceExtent } from "./geometry";
import type { ExportArea } from "./types";

interface JsonExportInput {
  document: WorldSeedProjectDocument;
  map: MapDocument;
  layers: MapLayerDocument[];
  view: EditorViewState;
  area: ExportArea;
}

interface PaintSummary {
  chunkCount: number;
  paintedCellCount: number;
  categoryCounts: Record<string, number>;
  chunkSize: number;
  cellSize: number;
}

interface TerrainStorageSummary {
  chunkCount: number;
  sampleResolution: number;
  chunkSize: number;
  width: number;
  height: number;
  sampleCount: number;
}

const summarizePaintLikeLayer = (layer: PaintLayerDocument | DataOverlayLayerDocument): PaintSummary => {
  const categoryCounts: Record<string, number> = {};
  let paintedCellCount = 0;

  for (const chunk of Object.values(layer.chunks)) {
    for (const cell of Object.values(chunk.cells)) {
      paintedCellCount += 1;
      const category = cell.sample.category ?? "uncategorized";
      categoryCounts[category] = (categoryCounts[category] ?? 0) + 1;
    }
  }

  return {
    chunkCount: Object.keys(layer.chunks).length,
    paintedCellCount,
    categoryCounts,
    chunkSize: layer.chunkSize,
    cellSize: layer.cellSize,
  };
};

const findParentLinkForMap = (
  document: WorldSeedProjectDocument,
  map: MapDocument,
) => {
  if (!map.parentMapId) {
    return null;
  }

  const parentMap = document.maps[map.parentMapId];
  if (!parentMap) {
    return null;
  }

  return (
    Object.values(parentMap.nestedLinks).find((link) => link.childMapId === map.id) ?? null
  );
};

const summarizeTerrainStorage = (map: MapDocument): TerrainStorageSummary => {
  const sampleResolution = Math.max(1, Math.round(map.terrain.storage.sampleResolution));
  const widthSamples = Math.max(1, Math.ceil(map.terrain.width / sampleResolution));
  const heightSamples = Math.max(1, Math.ceil(map.terrain.height / sampleResolution));

  return {
    chunkCount: Object.keys(map.terrain.storage.chunks).length,
    sampleResolution,
    chunkSize: map.terrain.storage.chunkSize,
    width: map.terrain.width,
    height: map.terrain.height,
    sampleCount: widthSamples * heightSamples,
  };
};

export const buildMapJsonExport = (input: JsonExportInput) => {
  const exportedAt = new Date().toISOString();
  const sourceExtent = computeExportSourceExtent(input.map, input.view, input.area);
  const parentLink = findParentLinkForMap(input.document, input.map);
  const childLinks = Object.values(input.map.nestedLinks).filter((link) => link.parentMapId === input.map.id);

  const layers = input.layers.map((layer) => {
    const base = {
      id: layer.id,
      name: layer.name,
      kind: layer.kind,
      visible: layer.visible,
      locked: layer.locked,
      opacity: layer.opacity,
      blendMode: layer.blendMode,
      parentGroupId: layer.parentGroupId,
    };

    if (layer.kind === "vector") {
      return {
        ...base,
        featureCount: layer.featureOrder.length,
        features: layer.featureOrder
          .map((featureId) => layer.features[featureId])
          .filter(Boolean),
      };
    }

    if (layer.kind === "symbol") {
      return {
        ...base,
        symbolCount: layer.symbolOrder.length,
        symbols: layer.symbolOrder
          .map((symbolId) => layer.symbols[symbolId])
          .filter(Boolean),
      };
    }

    if (layer.kind === "label") {
      return {
        ...base,
        labelCount: layer.labelOrder.length,
        labels: layer.labelOrder
          .map((labelId) => layer.labels[labelId])
          .filter(Boolean),
      };
    }

    if (layer.kind === "paint" || layer.kind === "mask" || layer.kind === "dataOverlay") {
      return {
        ...base,
        paintMode: layer.paintMode,
        summary: summarizePaintLikeLayer(layer),
        chunkRefs: layer.chunkRefs ?? null,
        dataOverlaySettings: layer.kind === "dataOverlay" ? layer.settings : undefined,
      };
    }

    if (layer.kind === "group") {
      return {
        ...base,
        childLayerIds: layer.childLayerIds,
      };
    }

    if (layer.kind === "reference") {
      return {
        ...base,
        assetId: layer.assetId,
      };
    }

    if (layer.kind === "elevation") {
      return {
        ...base,
        method: layer.method,
      };
    }

    return {
      ...base,
      notes: layer.kind === "annotation" ? layer.notes : undefined,
    };
  });

  const visibleLayerCount = input.layers.filter((layer) => layer.visible).length;
  const vectorFeatureCount = input.layers.reduce((count, layer) => {
    if (layer.kind !== "vector") {
      return count;
    }
    return count + layer.featureOrder.length;
  }, 0);
  const symbolCount = input.layers.reduce((count, layer) => {
    if (layer.kind !== "symbol") {
      return count;
    }
    return count + layer.symbolOrder.length;
  }, 0);
  const labelCount = input.layers.reduce((count, layer) => {
    if (layer.kind !== "label") {
      return count;
    }
    return count + layer.labelOrder.length;
  }, 0);

  return {
    kind: "world-seed-map-export",
    version: "1.0.0",
    exportedAt,
    exportSource: {
      area: input.area,
      sourceExtent,
    },
    project: {
      id: input.document.metadata.id,
      name: input.document.metadata.name,
      schemaVersion: input.document.metadata.schemaVersion,
      rootWorldMapId: input.document.rootWorldMapId,
    },
    map: {
      id: input.map.id,
      name: input.map.name,
      scope: input.map.scope,
      dimensions: input.map.dimensions,
      projection: input.map.projection,
      settings: input.map.settings,
      parentMapId: input.map.parentMapId,
      childMapIds: input.map.childMapIds,
      parentLink,
      childLinks,
      layerOrder: input.map.layerOrder,
      terrain: input.map.terrain,
      terrainSummary: summarizeTerrainStorage(input.map),
    },
    layers,
    summary: {
      layerCount: input.layers.length,
      visibleLayerCount,
      vectorFeatureCount,
      symbolCount,
      labelCount,
    },
  };
};

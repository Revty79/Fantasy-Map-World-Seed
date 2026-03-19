import { PROJECT_SCHEMA_VERSION } from "../constants/documentDefaults";
import { createProjectManifest } from "../factories/projectFactories";
import { hydrateMapTerrainDocument } from "../factories/terrainFactories";
import { nowIso } from "../factories/idFactory";
import { isProjectManifest } from "../guards/projectGuards";
import { isLayerPaintCompatible } from "../guards/layerGuards";
import type { AssetKind, AssetReference, LayerId, MapLayerDocument, WorldSeedProjectDocument } from "../../types";
import {
  MAP_DOCUMENT_KIND,
  PAINT_CHUNK_KIND,
  PROJECT_MANIFEST_FILE_NAME,
  PROJECT_MANIFEST_KIND,
  type LoadProjectBundleResult,
  type PersistedMapDocumentFile,
  type PersistedProjectManifest,
  type SaveProjectBundleRequest,
} from "./types";

const REQUIRED_ASSET_DIRECTORIES = [
  "maps",
  "assets",
  "assets/symbols",
  "assets/imports",
  "assets/brushes",
  "assets/reference-images",
  "assets/textures",
  "assets/palettes",
];

const ASSET_KIND_SET = new Set<AssetKind>([
  "symbol",
  "brush",
  "texture",
  "referenceImage",
  "font",
  "palette",
  "stamp",
]);

const normalizeRelativePath = (value: string): string => value.replace(/\\/g, "/");

const chunkKeyToFileName = (chunkKey: string): string => {
  return chunkKey.replace(/[^a-zA-Z0-9_-]/g, "_");
};

const normalizeAssetKind = (kind: string): AssetKind => {
  if (ASSET_KIND_SET.has(kind as AssetKind)) {
    return kind as AssetKind;
  }

  return "texture";
};

const buildAssetReferenceFromManifest = (
  entry: PersistedProjectManifest["assetRegistry"][number],
  timestamp: string,
): AssetReference => {
  const relativePath = normalizeRelativePath(entry.relativePath);
  return {
    id: entry.assetId,
    key: entry.key,
    kind: normalizeAssetKind(entry.kind),
    source: entry.source ?? (relativePath.startsWith("builtin://") ? "builtin" : "project"),
    relativePath,
    format: entry.format,
    metadata: {},
    meta: {
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };
};

const toPersistedManifest = (document: WorldSeedProjectDocument): PersistedProjectManifest => {
  return {
    kind: PROJECT_MANIFEST_KIND,
    ...createProjectManifest(document),
    schemaVersion: PROJECT_SCHEMA_VERSION,
  };
};

const toPersistedMapFile = (
  projectId: string,
  mapPath: string,
  map: WorldSeedProjectDocument["maps"][string],
): {
  relativeMapPath: string;
  mapFile: PersistedMapDocumentFile;
  chunks: SaveProjectBundleRequest["maps"][number]["chunks"];
} => {
  const savedAt = nowIso();
  const hydratedMap = {
    ...structuredClone(map),
    terrain: hydrateMapTerrainDocument({
      terrain: map.terrain,
      dimensions: map.dimensions,
      fallbackChunkSize: map.settings.chunkSize,
      timestamp: savedAt,
    }),
  };
  const nextLayers: Record<LayerId, MapLayerDocument> = {};
  const chunks: SaveProjectBundleRequest["maps"][number]["chunks"] = [];

  for (const [layerId, layer] of Object.entries(hydratedMap.layers)) {
    if (!isLayerPaintCompatible(layer)) {
      nextLayers[layerId as LayerId] = structuredClone(layer);
      continue;
    }

    const chunkRefs: Record<string, string> = {};
    for (const [chunkKey, chunk] of Object.entries(layer.chunks)) {
      const relativeChunkPath = normalizeRelativePath(
        `maps/${hydratedMap.id}/paint/${layer.id}/${chunkKeyToFileName(chunkKey)}.json`,
      );
      chunkRefs[chunkKey] = relativeChunkPath;
      chunks.push({
        layerId: layer.id,
        chunkKey,
        relativeChunkPath,
        chunkFile: {
          kind: PAINT_CHUNK_KIND,
          schemaVersion: PROJECT_SCHEMA_VERSION,
          projectId,
          mapId: hydratedMap.id,
          layerId: layer.id,
          chunkKey,
          chunk: structuredClone(chunk),
        },
      });
    }

    nextLayers[layerId as LayerId] = {
      ...structuredClone(layer),
      chunks: {},
      chunkRefs,
    };
  }

  return {
    relativeMapPath: normalizeRelativePath(mapPath),
    mapFile: {
      kind: MAP_DOCUMENT_KIND,
      schemaVersion: PROJECT_SCHEMA_VERSION,
      projectId,
      mapId: hydratedMap.id,
      savedAt,
      map: {
        ...hydratedMap,
        layers: nextLayers,
      },
    },
    chunks,
  };
};

export const buildSaveProjectBundle = (
  document: WorldSeedProjectDocument,
  projectRoot: string,
): SaveProjectBundleRequest => {
  const manifest = toPersistedManifest(document);
  const mapRegistryById = new Map(manifest.mapRegistry.map((entry) => [entry.mapId, entry]));
  const maps: SaveProjectBundleRequest["maps"] = [];

  for (const mapId of document.mapOrder) {
    const map = document.maps[mapId];
    const registryEntry = mapRegistryById.get(mapId);
    const mapPath = registryEntry?.file ?? `maps/${mapId}.json`;
    const persistedMap = toPersistedMapFile(document.metadata.id, mapPath, map);
    maps.push({
      mapId,
      relativeMapPath: persistedMap.relativeMapPath,
      mapFile: persistedMap.mapFile,
      chunks: persistedMap.chunks,
    });
  }

  return {
    projectRoot,
    manifestFileName: PROJECT_MANIFEST_FILE_NAME,
    manifest,
    maps,
    ensureDirectories: REQUIRED_ASSET_DIRECTORIES,
  };
};

const validateMapFile = (mapFile: PersistedMapDocumentFile, mapId: string) => {
  if (mapFile.kind !== MAP_DOCUMENT_KIND) {
    throw new Error(`Map file for "${mapId}" is not a valid world-seed map document.`);
  }

  if (mapFile.schemaVersion !== PROJECT_SCHEMA_VERSION) {
    throw new Error(
      `Map "${mapId}" uses unsupported schema version "${mapFile.schemaVersion}". Expected "${PROJECT_SCHEMA_VERSION}".`,
    );
  }

  if (mapFile.mapId !== mapId || mapFile.map.id !== mapId) {
    throw new Error(`Map file identity mismatch for "${mapId}".`);
  }
};

export const hydrateProjectDocumentFromBundle = (
  result: LoadProjectBundleResult,
): {
  document: WorldSeedProjectDocument;
  projectRoot: string;
  manifestPath: string;
} => {
  if (result.manifest.kind !== PROJECT_MANIFEST_KIND) {
    throw new Error("Unsupported project manifest kind. Expected world-seed project manifest.");
  }

  if (!isProjectManifest(result.manifest)) {
    throw new Error("Invalid project manifest shape.");
  }

  if (result.manifest.schemaVersion !== PROJECT_SCHEMA_VERSION) {
    throw new Error(
      `Unsupported project schema "${result.manifest.schemaVersion}". Expected "${PROJECT_SCHEMA_VERSION}".`,
    );
  }

  const sortedMapRegistry = [...result.manifest.mapRegistry].sort((a, b) => a.order - b.order);
  const loadedMapById = new Map(result.maps.map((entry) => [entry.mapId, entry]));
  const maps: WorldSeedProjectDocument["maps"] = {};
  const mapOrder: string[] = [];

  for (const registryEntry of sortedMapRegistry) {
    const mapEntry = loadedMapById.get(registryEntry.mapId);
    if (!mapEntry) {
      throw new Error(`Project is missing map file for "${registryEntry.name}" (${registryEntry.mapId}).`);
    }

    validateMapFile(mapEntry.mapFile, registryEntry.mapId);
    const map = structuredClone(mapEntry.mapFile.map);
    const terrain = hydrateMapTerrainDocument({
      terrain: map.terrain,
      dimensions: map.dimensions,
      fallbackChunkSize: map.settings.chunkSize,
      timestamp: map.meta.updatedAt,
    });
    const chunksByPath = new Map(
      mapEntry.chunks.map((chunkEntry) => [normalizeRelativePath(chunkEntry.relativeChunkPath), chunkEntry]),
    );
    const nextLayers: typeof map.layers = {};

    for (const [layerId, layer] of Object.entries(map.layers)) {
      if (!isLayerPaintCompatible(layer)) {
        nextLayers[layerId as LayerId] = layer;
        continue;
      }

      const restoredChunks = { ...layer.chunks };
      const chunkRefs: Record<string, string> = layer.chunkRefs ?? {};

      for (const [chunkKey, chunkRelativePath] of Object.entries(chunkRefs)) {
        const normalizedPath = normalizeRelativePath(chunkRelativePath);
        const chunkEntry = chunksByPath.get(normalizedPath);

        if (!chunkEntry) {
          throw new Error(
            `Missing chunk file "${chunkRelativePath}" for map "${map.id}" layer "${layer.id}" chunk "${chunkKey}".`,
          );
        }

        if (chunkEntry.chunkFile.kind !== PAINT_CHUNK_KIND) {
          throw new Error(`Chunk file "${chunkRelativePath}" has invalid type.`);
        }

        if (chunkEntry.chunkFile.schemaVersion !== PROJECT_SCHEMA_VERSION) {
          throw new Error(
            `Chunk file "${chunkRelativePath}" uses unsupported schema version "${chunkEntry.chunkFile.schemaVersion}".`,
          );
        }

        restoredChunks[chunkKey] = chunkEntry.chunkFile.chunk;
      }

      nextLayers[layerId as LayerId] = {
        ...layer,
        chunks: restoredChunks,
      };
    }

    maps[registryEntry.mapId] = {
      ...map,
      terrain,
      layers: nextLayers,
    };
    mapOrder.push(registryEntry.mapId);
  }

  const rootWorldMap = maps[result.manifest.rootWorldMapId];

  if (!rootWorldMap) {
    throw new Error(`Project manifest root map "${result.manifest.rootWorldMapId}" is missing.`);
  }

  const assets = result.manifest.assetRegistry.reduce<Record<string, AssetReference>>((record, entry) => {
    record[entry.assetId] = buildAssetReferenceFromManifest(entry, result.manifest.updatedAt);
    return record;
  }, {});

  return {
    document: {
      metadata: {
        id: result.manifest.projectId,
        name: result.manifest.projectName,
        schemaVersion: result.manifest.schemaVersion,
        createdAt: result.manifest.createdAt,
        updatedAt: result.manifest.updatedAt,
      },
      rootWorldMapId: result.manifest.rootWorldMapId,
      mapOrder,
      maps,
      assets,
      settings: { ...result.manifest.settings },
    },
    projectRoot: result.projectRoot,
    manifestPath: result.manifestPath,
  };
};

export const toPersistenceErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

export { PROJECT_MANIFEST_FILE_NAME };

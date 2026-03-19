import type { LayerId, MapDocument, MapId, PaintChunk, ProjectManifest } from "../../types";

export const PROJECT_MANIFEST_FILE_NAME = "world-seed-project.json";
export const PROJECT_MANIFEST_KIND = "world-seed-project-manifest";
export const MAP_DOCUMENT_KIND = "world-seed-map-document";
export const PAINT_CHUNK_KIND = "world-seed-paint-chunk";

export interface PersistedProjectManifest extends ProjectManifest {
  kind: typeof PROJECT_MANIFEST_KIND;
}

export interface PersistedMapDocumentFile {
  kind: typeof MAP_DOCUMENT_KIND;
  schemaVersion: string;
  projectId: string;
  mapId: MapId;
  savedAt: string;
  map: MapDocument;
}

export interface PersistedPaintChunkFile {
  kind: typeof PAINT_CHUNK_KIND;
  schemaVersion: string;
  projectId: string;
  mapId: MapId;
  layerId: LayerId;
  chunkKey: string;
  chunk: PaintChunk;
}

export interface PersistedChunkWriteEntry {
  layerId: LayerId;
  chunkKey: string;
  relativeChunkPath: string;
  chunkFile: PersistedPaintChunkFile;
}

export interface PersistedMapWriteEntry {
  mapId: MapId;
  relativeMapPath: string;
  mapFile: PersistedMapDocumentFile;
  chunks: PersistedChunkWriteEntry[];
}

export interface SaveProjectBundleRequest {
  projectRoot: string;
  manifestFileName: string;
  manifest: PersistedProjectManifest;
  maps: PersistedMapWriteEntry[];
  ensureDirectories: string[];
}

export interface SaveProjectBundleResult {
  projectRoot: string;
  manifestPath: string;
  savedAt: string;
}

export interface LoadedChunkEntry {
  layerId: LayerId;
  chunkKey: string;
  relativeChunkPath: string;
  chunkFile: PersistedPaintChunkFile;
}

export interface LoadedMapEntry {
  mapId: MapId;
  relativeMapPath: string;
  mapFile: PersistedMapDocumentFile;
  chunks: LoadedChunkEntry[];
}

export interface LoadProjectBundleResult {
  projectRoot: string;
  manifestPath: string;
  manifest: PersistedProjectManifest;
  maps: LoadedMapEntry[];
}

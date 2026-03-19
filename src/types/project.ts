import type { AssetReference, AssetSource } from "./assets";
import type { DocumentId, TimestampIso } from "./common";
import type { MapDocument, MapId, MapScope } from "./maps";

export type ProjectId = DocumentId;

export interface ProjectMetadata {
  id: ProjectId;
  name: string;
  description?: string;
  author?: string;
  schemaVersion: string;
  createdAt: TimestampIso;
  updatedAt: TimestampIso;
}

export interface ProjectDocumentSettings {
  defaultWorldWidth: number;
  defaultWorldHeight: number;
  defaultChunkSize: number;
  defaultCellSize: number;
}

export interface MapRegistryEntry {
  mapId: MapId;
  name: string;
  scope: MapScope;
  parentMapId: MapId | null;
  file: string;
  order: number;
}

export interface AssetRegistryEntry {
  assetId: string;
  key: string;
  kind: string;
  source: AssetSource;
  relativePath: string;
  format?: string;
}

export interface ProjectManifest {
  projectId: ProjectId;
  projectName: string;
  schemaVersion: string;
  createdAt: TimestampIso;
  updatedAt: TimestampIso;
  rootWorldMapId: MapId;
  mapRegistry: MapRegistryEntry[];
  assetRegistry: AssetRegistryEntry[];
  settings: ProjectDocumentSettings;
}

export interface WorldSeedProjectDocument {
  metadata: ProjectMetadata;
  rootWorldMapId: MapId;
  mapOrder: MapId[];
  maps: Record<MapId, MapDocument>;
  assets: Record<string, AssetReference>;
  settings: ProjectDocumentSettings;
}

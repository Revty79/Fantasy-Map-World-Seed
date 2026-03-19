import type { DocumentEntityMeta, TimestampIso } from "./common";

export type TerrainChunkKey = `${number}:${number}`;

export type TerrainChunkEncoding = "float32-normalized";

export interface TerrainChunk {
  key: TerrainChunkKey;
  chunkX: number;
  chunkY: number;
  widthSamples: number;
  heightSamples: number;
  samples: number[];
  meta: DocumentEntityMeta;
}

export interface TerrainStorageDocument {
  kind: "chunked-heightfield";
  chunkSize: number;
  sampleResolution: number;
  encoding: TerrainChunkEncoding;
  chunks: Record<TerrainChunkKey, TerrainChunk>;
}

export type TerrainGeneratorKind =
  | "none"
  | "fbm-simplex"
  | "fbm-perlin"
  | "ridged-multifractal"
  | "custom";

export interface TerrainGenerationSettings {
  seed: number;
  generator: TerrainGeneratorKind;
  octaves: number;
  frequency: number;
  lacunarity: number;
  persistence: number;
  amplitude: number;
  warp: number;
  continentFrequency: number;
  continentStrength: number;
  offsetX: number;
  offsetY: number;
}

export interface TerrainGenerationMetadata {
  source: "none" | "seeded-procedural" | "imported-heightmap" | "manual-edit";
  revision: number;
  hasGenerated: boolean;
  lastGeneratedAt: TimestampIso | null;
  settings: TerrainGenerationSettings;
}

export interface TerrainNormalizationMetadata {
  domainMin: number;
  domainMax: number;
  normalizedMin: number;
  normalizedMax: number;
  observedMin: number;
  observedMax: number;
}

export interface TerrainDisplaySettings {
  renderMode: "hypsometric" | "grayscale" | "shaded-relief" | "land-water" | "contour-preview";
  paletteKey: string;
  verticalExaggeration: number;
  hillshadeStrength: number;
  showContours: boolean;
  contourInterval: number;
  showDerivedCoastline: boolean;
  showLandWaterOverlay: boolean;
}

export interface TerrainLineSegment {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  level: number;
}

export interface TerrainDerivedCacheMetadata {
  coastlineRevision: number | null;
  landMaskRevision: number | null;
  contourRevision: number | null;
  cachedAt: TimestampIso | null;
  lastSeaLevel: number | null;
  coastlineSegmentCount: number;
  contourSegmentCount: number;
  landSampleCount: number;
  waterSampleCount: number;
}

export interface MapTerrainDocument {
  version: 1;
  width: number;
  height: number;
  seaLevel: number;
  storage: TerrainStorageDocument;
  normalization: TerrainNormalizationMetadata;
  generation: TerrainGenerationMetadata;
  display: TerrainDisplaySettings;
  derived: TerrainDerivedCacheMetadata;
  meta: DocumentEntityMeta;
}

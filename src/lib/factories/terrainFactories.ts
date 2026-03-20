import { DEFAULT_CHUNK_SIZE } from "../constants/documentDefaults";
import { nowIso } from "./idFactory";
import type {
  DocumentEntityMeta,
  MapDimensions,
  MapTerrainDocument,
  TerrainChunk,
  TerrainChunkKey,
  TerrainDisplaySettings,
  TerrainGenerationMetadata,
  TerrainGenerationSettings,
  TerrainNormalizationMetadata,
  TerrainStorageDocument,
} from "../../types";

interface CreateMapTerrainDocumentOptions {
  chunkSize?: number;
  timestamp?: string;
}

interface HydrateMapTerrainDocumentOptions {
  terrain: unknown;
  dimensions: MapDimensions;
  fallbackChunkSize?: number;
  timestamp?: string;
}

const MIN_DIMENSION = 1;
const MIN_TERRAIN_CHUNK_SIZE = 16;
const MAX_TERRAIN_CHUNK_SIZE = 4096;
const MIN_SAMPLE_RESOLUTION = 1;
const MAX_SAMPLE_RESOLUTION = 64;
const MIN_OCTAVES = 1;
const MAX_OCTAVES = 12;
const MIN_CONTOUR_INTERVAL = 0.005;
const MAX_CONTOUR_INTERVAL = 1;
const MIN_VERTICAL_EXAGGERATION = 0.1;
const MAX_VERTICAL_EXAGGERATION = 10;
const MIN_HILLSHADE_STRENGTH = 0;
const MAX_HILLSHADE_STRENGTH = 2;
const TERRAIN_CHUNK_KEY_PATTERN = /^-?\d+:-?\d+$/;
const DEFAULT_TERRAIN_GENERATOR: TerrainGenerationSettings["generator"] = "fbm-simplex";
const DEFAULT_GENERATION_SOURCE: TerrainGenerationMetadata["source"] = "none";
const DEFAULT_TERRAIN_RENDER_MODE: TerrainDisplaySettings["renderMode"] = "hypsometric";

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
};

const toFiniteNumber = (value: unknown, fallback: number): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return fallback;
};

const toInteger = (value: unknown, fallback: number): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }

  return fallback;
};

const toPositiveInt = (value: unknown, fallback: number, min: number, max: number): number => {
  const parsed = toInteger(value, fallback);
  return clamp(Math.abs(parsed), min, max);
};

const toTimestampOrNull = (value: unknown): string | null => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  return value;
};

const normalizeMeta = (value: unknown, fallbackTimestamp: string): DocumentEntityMeta => {
  if (!isRecord(value)) {
    return {
      createdAt: fallbackTimestamp,
      updatedAt: fallbackTimestamp,
    };
  }

  const createdAt = typeof value.createdAt === "string" && value.createdAt.trim().length > 0
    ? value.createdAt
    : fallbackTimestamp;
  const updatedAt = typeof value.updatedAt === "string" && value.updatedAt.trim().length > 0
    ? value.updatedAt
    : fallbackTimestamp;
  const notes = typeof value.notes === "string" && value.notes.trim().length > 0
    ? value.notes
    : undefined;

  return {
    createdAt,
    updatedAt,
    notes,
  };
};

const isTerrainChunkKey = (value: string): value is TerrainChunkKey => {
  return TERRAIN_CHUNK_KEY_PATTERN.test(value);
};

const getChunkCoordinatesFromKey = (key: TerrainChunkKey): { chunkX: number; chunkY: number } => {
  const [chunkX, chunkY] = key.split(":");
  return {
    chunkX: Number.parseInt(chunkX, 10),
    chunkY: Number.parseInt(chunkY, 10),
  };
};

const normalizeChunkSamples = (value: unknown, sampleCount: number): number[] => {
  if (!Array.isArray(value)) {
    return Array.from({ length: sampleCount }, () => 0);
  }

  const samples = value
    .filter((sample) => typeof sample === "number" && Number.isFinite(sample))
    .map((sample) => clamp(sample, -1, 1))
    .slice(0, sampleCount);

  if (samples.length >= sampleCount) {
    return samples;
  }

  const padded = [...samples];
  while (padded.length < sampleCount) {
    padded.push(0);
  }

  return padded;
};

const normalizeTerrainChunk = (
  key: TerrainChunkKey,
  value: unknown,
  chunkSize: number,
  timestamp: string,
): TerrainChunk | null => {
  if (!isRecord(value)) {
    return null;
  }

  const coordinatesFromKey = getChunkCoordinatesFromKey(key);
  const widthSamples = toPositiveInt(value.widthSamples, chunkSize, MIN_SAMPLE_RESOLUTION, chunkSize);
  const heightSamples = toPositiveInt(value.heightSamples, chunkSize, MIN_SAMPLE_RESOLUTION, chunkSize);
  const sampleCount = widthSamples * heightSamples;

  return {
    key,
    chunkX: toInteger(value.chunkX, coordinatesFromKey.chunkX),
    chunkY: toInteger(value.chunkY, coordinatesFromKey.chunkY),
    widthSamples,
    heightSamples,
    samples: normalizeChunkSamples(value.samples, sampleCount),
    meta: normalizeMeta(value.meta, timestamp),
  };
};

const normalizeTerrainChunks = (
  value: unknown,
  chunkSize: number,
  timestamp: string,
): Record<TerrainChunkKey, TerrainChunk> => {
  if (!isRecord(value)) {
    return {};
  }

  const chunks: Record<TerrainChunkKey, TerrainChunk> = {};

  for (const [chunkKey, chunkValue] of Object.entries(value)) {
    if (!isTerrainChunkKey(chunkKey)) {
      continue;
    }

    const normalizedChunk = normalizeTerrainChunk(chunkKey, chunkValue, chunkSize, timestamp);
    if (normalizedChunk) {
      chunks[chunkKey] = normalizedChunk;
    }
  }

  return chunks;
};

const createDefaultGenerationSettings = (): TerrainGenerationSettings => {
  return {
    seed: 0,
    generator: DEFAULT_TERRAIN_GENERATOR,
    octaves: 6,
    frequency: 1.15,
    lacunarity: 2,
    persistence: 0.52,
    amplitude: 1,
    warp: 1.2,
    continentFrequency: 0.85,
    continentStrength: 0.62,
    offsetX: 0,
    offsetY: 0,
  };
};

const normalizeGenerationSettings = (value: unknown): TerrainGenerationSettings => {
  const defaults = createDefaultGenerationSettings();
  if (!isRecord(value)) {
    return defaults;
  }

  const generator = value.generator === "none" ||
    value.generator === "fbm-simplex" ||
    value.generator === "fbm-perlin" ||
    value.generator === "ridged-multifractal" ||
    value.generator === "custom"
    ? value.generator
    : defaults.generator;

  return {
    seed: toInteger(value.seed, defaults.seed),
    generator,
    octaves: toPositiveInt(value.octaves, defaults.octaves, MIN_OCTAVES, MAX_OCTAVES),
    frequency: clamp(toFiniteNumber(value.frequency, defaults.frequency), 0.0001, 100),
    lacunarity: clamp(toFiniteNumber(value.lacunarity, defaults.lacunarity), 0.1, 10),
    persistence: clamp(toFiniteNumber(value.persistence, defaults.persistence), 0, 1),
    amplitude: clamp(toFiniteNumber(value.amplitude, defaults.amplitude), 0, 4),
    warp: clamp(toFiniteNumber(value.warp, defaults.warp), 0, 10),
    continentFrequency: clamp(
      toFiniteNumber(value.continentFrequency, defaults.continentFrequency),
      0.01,
      10,
    ),
    continentStrength: clamp(toFiniteNumber(value.continentStrength, defaults.continentStrength), 0, 1),
    offsetX: toFiniteNumber(value.offsetX, defaults.offsetX),
    offsetY: toFiniteNumber(value.offsetY, defaults.offsetY),
  };
};

const createDefaultNormalization = (): TerrainNormalizationMetadata => {
  return {
    domainMin: -1,
    domainMax: 1,
    normalizedMin: 0,
    normalizedMax: 1,
    observedMin: 0,
    observedMax: 0,
  };
};

const normalizeNormalization = (value: unknown): TerrainNormalizationMetadata => {
  const defaults = createDefaultNormalization();
  if (!isRecord(value)) {
    return defaults;
  }

  const domainMin = toFiniteNumber(value.domainMin, defaults.domainMin);
  const rawDomainMax = toFiniteNumber(value.domainMax, defaults.domainMax);
  const domainMax = rawDomainMax > domainMin ? rawDomainMax : domainMin + 1;
  const normalizedMin = toFiniteNumber(value.normalizedMin, defaults.normalizedMin);
  const rawNormalizedMax = toFiniteNumber(value.normalizedMax, defaults.normalizedMax);
  const normalizedMax = rawNormalizedMax > normalizedMin ? rawNormalizedMax : normalizedMin + 1;
  const observedMin = clamp(toFiniteNumber(value.observedMin, defaults.observedMin), domainMin, domainMax);
  const observedMax = clamp(toFiniteNumber(value.observedMax, defaults.observedMax), observedMin, domainMax);

  return {
    domainMin,
    domainMax,
    normalizedMin,
    normalizedMax,
    observedMin,
    observedMax,
  };
};

const createDefaultDisplay = (): TerrainDisplaySettings => {
  return {
    renderMode: DEFAULT_TERRAIN_RENDER_MODE,
    paletteKey: "terrain-basic",
    verticalExaggeration: 1,
    hillshadeStrength: 0.5,
    showContours: false,
    contourInterval: 0.1,
    showDerivedCoastline: false,
    showLandWaterOverlay: false,
  };
};

const normalizeDisplay = (value: unknown): TerrainDisplaySettings => {
  const defaults = createDefaultDisplay();
  if (!isRecord(value)) {
    return defaults;
  }

  const renderMode = value.renderMode === "hypsometric" ||
    value.renderMode === "grayscale" ||
    value.renderMode === "shaded-relief" ||
    value.renderMode === "land-water" ||
    value.renderMode === "contour-preview"
    ? value.renderMode
    : defaults.renderMode;

  return {
    renderMode,
    paletteKey:
      typeof value.paletteKey === "string" && value.paletteKey.trim().length > 0
        ? value.paletteKey
        : defaults.paletteKey,
    verticalExaggeration: clamp(
      toFiniteNumber(value.verticalExaggeration, defaults.verticalExaggeration),
      MIN_VERTICAL_EXAGGERATION,
      MAX_VERTICAL_EXAGGERATION,
    ),
    hillshadeStrength: clamp(
      toFiniteNumber(value.hillshadeStrength, defaults.hillshadeStrength),
      MIN_HILLSHADE_STRENGTH,
      MAX_HILLSHADE_STRENGTH,
    ),
    showContours: typeof value.showContours === "boolean" ? value.showContours : defaults.showContours,
    contourInterval: clamp(toFiniteNumber(value.contourInterval, defaults.contourInterval), MIN_CONTOUR_INTERVAL, MAX_CONTOUR_INTERVAL),
    showDerivedCoastline:
      typeof value.showDerivedCoastline === "boolean"
        ? value.showDerivedCoastline
        : defaults.showDerivedCoastline,
    showLandWaterOverlay:
      typeof value.showLandWaterOverlay === "boolean"
        ? value.showLandWaterOverlay
        : defaults.showLandWaterOverlay,
  };
};

const createDefaultGenerationMetadata = (): TerrainGenerationMetadata => {
  return {
    source: DEFAULT_GENERATION_SOURCE,
    revision: 0,
    hasGenerated: false,
    lastGeneratedAt: null,
    settings: createDefaultGenerationSettings(),
  };
};

const normalizeGenerationMetadata = (value: unknown): TerrainGenerationMetadata => {
  const defaults = createDefaultGenerationMetadata();
  if (!isRecord(value)) {
    return defaults;
  }

  const source = value.source === "none" ||
    value.source === "seeded-procedural" ||
    value.source === "imported-heightmap" ||
    value.source === "manual-edit"
    ? value.source
    : defaults.source;

  return {
    source,
    revision: Math.max(0, toInteger(value.revision, defaults.revision)),
    hasGenerated: typeof value.hasGenerated === "boolean" ? value.hasGenerated : defaults.hasGenerated,
    lastGeneratedAt: toTimestampOrNull(value.lastGeneratedAt),
    settings: normalizeGenerationSettings(value.settings),
  };
};

const createDefaultStorage = (chunkSize: number): TerrainStorageDocument => {
  return {
    kind: "chunked-heightfield",
    chunkSize,
    sampleResolution: 8,
    encoding: "float32-normalized",
    chunks: {},
  };
};

const normalizeStorage = (
  value: unknown,
  fallbackChunkSize: number,
  timestamp: string,
): TerrainStorageDocument => {
  const chunkSize = toPositiveInt(
    isRecord(value) ? value.chunkSize : fallbackChunkSize,
    fallbackChunkSize,
    MIN_TERRAIN_CHUNK_SIZE,
    MAX_TERRAIN_CHUNK_SIZE,
  );
  const defaults = createDefaultStorage(chunkSize);

  if (!isRecord(value)) {
    return defaults;
  }

  return {
    kind: value.kind === "chunked-heightfield" ? "chunked-heightfield" : defaults.kind,
    chunkSize,
    sampleResolution: toPositiveInt(
      value.sampleResolution,
      defaults.sampleResolution,
      MIN_SAMPLE_RESOLUTION,
      MAX_SAMPLE_RESOLUTION,
    ),
    encoding: value.encoding === "float32-normalized" ? value.encoding : defaults.encoding,
    chunks: normalizeTerrainChunks(value.chunks, chunkSize, timestamp),
  };
};

const createDefaultDerived = (): MapTerrainDocument["derived"] => {
  return {
    coastlineRevision: null,
    landMaskRevision: null,
    contourRevision: null,
    cachedAt: null,
    lastSeaLevel: null,
    coastlineSegmentCount: 0,
    contourSegmentCount: 0,
    landSampleCount: 0,
    waterSampleCount: 0,
  };
};

const normalizeDerived = (value: unknown): MapTerrainDocument["derived"] => {
  const defaults = createDefaultDerived();
  if (!isRecord(value)) {
    return defaults;
  }

  return {
    coastlineRevision:
      typeof value.coastlineRevision === "number" && Number.isFinite(value.coastlineRevision)
        ? Math.max(0, Math.trunc(value.coastlineRevision))
        : null,
    landMaskRevision:
      typeof value.landMaskRevision === "number" && Number.isFinite(value.landMaskRevision)
        ? Math.max(0, Math.trunc(value.landMaskRevision))
        : null,
    contourRevision:
      typeof value.contourRevision === "number" && Number.isFinite(value.contourRevision)
        ? Math.max(0, Math.trunc(value.contourRevision))
        : null,
    cachedAt: toTimestampOrNull(value.cachedAt) ?? defaults.cachedAt,
    lastSeaLevel:
      typeof value.lastSeaLevel === "number" && Number.isFinite(value.lastSeaLevel)
        ? clamp(value.lastSeaLevel, -1, 1)
        : defaults.lastSeaLevel,
    coastlineSegmentCount:
      typeof value.coastlineSegmentCount === "number" && Number.isFinite(value.coastlineSegmentCount)
        ? Math.max(0, Math.trunc(value.coastlineSegmentCount))
        : defaults.coastlineSegmentCount,
    contourSegmentCount:
      typeof value.contourSegmentCount === "number" && Number.isFinite(value.contourSegmentCount)
        ? Math.max(0, Math.trunc(value.contourSegmentCount))
        : defaults.contourSegmentCount,
    landSampleCount:
      typeof value.landSampleCount === "number" && Number.isFinite(value.landSampleCount)
        ? Math.max(0, Math.trunc(value.landSampleCount))
        : defaults.landSampleCount,
    waterSampleCount:
      typeof value.waterSampleCount === "number" && Number.isFinite(value.waterSampleCount)
        ? Math.max(0, Math.trunc(value.waterSampleCount))
        : defaults.waterSampleCount,
  };
};

export const createMapTerrainDocument = (
  dimensions: MapDimensions,
  options: CreateMapTerrainDocumentOptions = {},
): MapTerrainDocument => {
  const timestamp = options.timestamp ?? nowIso();
  const width = toPositiveInt(dimensions.width, MIN_DIMENSION, MIN_DIMENSION, Number.MAX_SAFE_INTEGER);
  const height = toPositiveInt(dimensions.height, MIN_DIMENSION, MIN_DIMENSION, Number.MAX_SAFE_INTEGER);
  const chunkSize = toPositiveInt(
    options.chunkSize ?? DEFAULT_CHUNK_SIZE,
    DEFAULT_CHUNK_SIZE,
    MIN_TERRAIN_CHUNK_SIZE,
    MAX_TERRAIN_CHUNK_SIZE,
  );

  return {
    version: 1,
    width,
    height,
    seaLevel: 0,
    storage: createDefaultStorage(chunkSize),
    normalization: createDefaultNormalization(),
    generation: createDefaultGenerationMetadata(),
    display: createDefaultDisplay(),
    derived: createDefaultDerived(),
    meta: normalizeMeta(undefined, timestamp),
  };
};

export const hydrateMapTerrainDocument = ({
  terrain,
  dimensions,
  fallbackChunkSize = DEFAULT_CHUNK_SIZE,
  timestamp = nowIso(),
}: HydrateMapTerrainDocumentOptions): MapTerrainDocument => {
  const defaults = createMapTerrainDocument(dimensions, {
    chunkSize: fallbackChunkSize,
    timestamp,
  });

  if (!isRecord(terrain)) {
    return defaults;
  }

  return {
    version: 1,
    width: defaults.width,
    height: defaults.height,
    seaLevel: clamp(toFiniteNumber(terrain.seaLevel, defaults.seaLevel), -1, 1),
    storage: normalizeStorage(terrain.storage, defaults.storage.chunkSize, timestamp),
    normalization: normalizeNormalization(terrain.normalization),
    generation: normalizeGenerationMetadata(terrain.generation),
    display: normalizeDisplay(terrain.display),
    derived: normalizeDerived(terrain.derived),
    meta: normalizeMeta(terrain.meta, timestamp),
  };
};

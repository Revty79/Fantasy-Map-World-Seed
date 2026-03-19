import { nowIso } from "../factories/idFactory";
import type { MapDocument, MapTerrainDocument, TerrainChunk, TerrainChunkKey, TerrainGenerationSettings } from "../../types";

export interface GenerateTerrainForMapOptions {
  seedOverride?: number;
  generatedAt?: string;
}

const MIN_DIMENSION = 1;
const MIN_CHUNK_SIZE = 16;
const MAX_CHUNK_SIZE = 4096;
const MIN_SAMPLE_RESOLUTION = 1;
const MAX_SAMPLE_RESOLUTION = 64;
const UINT32_MAX = 0xffffffff;

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
};

const mixToUInt32 = (value: number): number => {
  return value >>> 0;
};

const normalizeSeed = (seed: number): number => {
  if (!Number.isFinite(seed)) {
    return 0;
  }

  return mixToUInt32(Math.trunc(seed));
};

const lerp = (from: number, to: number, t: number): number => {
  return from + (to - from) * t;
};

const smoothStep = (value: number): number => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

const hash2D = (seed: number, x: number, y: number): number => {
  let hash = mixToUInt32(seed ^ mixToUInt32(x * 374761393) ^ mixToUInt32(y * 668265263));
  hash = mixToUInt32((hash ^ (hash >>> 13)) * 1274126177);
  hash = mixToUInt32(hash ^ (hash >>> 16));
  return hash;
};

const randomFromHash = (hash: number): number => {
  return hash / UINT32_MAX;
};

const valueNoise2D = (seed: number, x: number, y: number): number => {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1;
  const y1 = y0 + 1;

  const tx = smoothStep(x - x0);
  const ty = smoothStep(y - y0);

  const v00 = randomFromHash(hash2D(seed, x0, y0));
  const v10 = randomFromHash(hash2D(seed, x1, y0));
  const v01 = randomFromHash(hash2D(seed, x0, y1));
  const v11 = randomFromHash(hash2D(seed, x1, y1));

  const row0 = lerp(v00, v10, tx);
  const row1 = lerp(v01, v11, tx);
  return lerp(row0, row1, ty);
};

const fractalNoise = (
  seed: number,
  x: number,
  y: number,
  settings: TerrainGenerationSettings,
): number => {
  const octaves = clamp(Math.round(settings.octaves), 1, 12);
  let frequency = clamp(settings.frequency, 0.0001, 100);
  let amplitude = 1;
  let amplitudeSum = 0;
  let total = 0;

  for (let octave = 0; octave < octaves; octave += 1) {
    const octaveSeed = mixToUInt32(seed + octave * 1013);
    const octaveSample = valueNoise2D(octaveSeed, x * frequency, y * frequency) * 2 - 1;
    total += octaveSample * amplitude;
    amplitudeSum += amplitude;
    amplitude *= clamp(settings.persistence, 0, 1);
    frequency *= clamp(settings.lacunarity, 0.1, 10);
  }

  if (amplitudeSum <= 0) {
    return 0;
  }

  return total / amplitudeSum;
};

const evaluateHeightSample = (
  x: number,
  y: number,
  settings: TerrainGenerationSettings,
): number => {
  const seed = normalizeSeed(settings.seed);
  const warpStrength = clamp(settings.warp, 0, 10) * 0.25;
  const offsetX = settings.offsetX;
  const offsetY = settings.offsetY;
  const baseX = x + offsetX;
  const baseY = y + offsetY;

  let sampleX = baseX;
  let sampleY = baseY;

  if (warpStrength > 0) {
    const warpFrequency = Math.max(0.01, settings.frequency * 0.35);
    const warpX = (valueNoise2D(mixToUInt32(seed + 7919), baseX * warpFrequency, baseY * warpFrequency) * 2 - 1) * warpStrength;
    const warpY =
      (valueNoise2D(mixToUInt32(seed + 16127), (baseX + 17.311) * warpFrequency, (baseY - 9.173) * warpFrequency) * 2 - 1) *
      warpStrength;
    sampleX += warpX;
    sampleY += warpY;
  }

  const baseFractal = fractalNoise(seed, sampleX, sampleY, settings);
  let ruggedness = baseFractal;

  if (settings.generator === "ridged-multifractal") {
    ruggedness = (1 - Math.abs(baseFractal)) * 2 - 1;
  }

  if (settings.generator === "none") {
    ruggedness = 0;
  }
  const continentNoise = valueNoise2D(
    mixToUInt32(seed + 31337),
    sampleX * clamp(settings.continentFrequency, 0.01, 10),
    sampleY * clamp(settings.continentFrequency, 0.01, 10),
  );
  const continentInfluence = (continentNoise * 2 - 1) * clamp(settings.continentStrength, 0, 1);
  const latitudeFactor = 1 - Math.pow(Math.abs(sampleY * 2 - 1), 1.35) * 0.3;

  const amplitude = clamp(settings.amplitude, 0, 4);
  const composed = (ruggedness * 0.78 + continentInfluence * 0.9) * latitudeFactor * amplitude;
  return clamp(composed, -1, 1);
};

const buildTerrainChunk = (
  chunkKey: TerrainChunkKey,
  chunkX: number,
  chunkY: number,
  startSampleX: number,
  startSampleY: number,
  widthSamples: number,
  heightSamples: number,
  sampleWidth: number,
  sampleHeight: number,
  settings: TerrainGenerationSettings,
  createdAt: string,
): TerrainChunk => {
  const samples = new Array<number>(widthSamples * heightSamples);
  let sampleIndex = 0;

  const widthDenominator = Math.max(1, sampleWidth - 1);
  const heightDenominator = Math.max(1, sampleHeight - 1);

  for (let localY = 0; localY < heightSamples; localY += 1) {
    for (let localX = 0; localX < widthSamples; localX += 1) {
      const globalX = startSampleX + localX;
      const globalY = startSampleY + localY;
      const normalizedX = clamp(globalX / widthDenominator, 0, 1);
      const normalizedY = clamp(globalY / heightDenominator, 0, 1);
      samples[sampleIndex] = evaluateHeightSample(normalizedX, normalizedY, settings);
      sampleIndex += 1;
    }
  }

  return {
    key: chunkKey,
    chunkX,
    chunkY,
    widthSamples,
    heightSamples,
    samples,
    meta: {
      createdAt,
      updatedAt: createdAt,
      notes: "Generated by deterministic seeded fractal terrain engine.",
    },
  };
};

const computeObservedRange = (chunks: Record<TerrainChunkKey, TerrainChunk>): { min: number; max: number } => {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (const chunk of Object.values(chunks)) {
    for (const sample of chunk.samples) {
      if (sample < min) {
        min = sample;
      }

      if (sample > max) {
        max = sample;
      }
    }
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: 0, max: 0 };
  }

  return {
    min,
    max,
  };
};

const buildGeneratedChunks = (
  terrain: MapTerrainDocument,
  settings: TerrainGenerationSettings,
  generatedAt: string,
): Record<TerrainChunkKey, TerrainChunk> => {
  const chunkSize = clamp(Math.round(terrain.storage.chunkSize), MIN_CHUNK_SIZE, MAX_CHUNK_SIZE);
  const sampleResolution = clamp(Math.round(terrain.storage.sampleResolution), MIN_SAMPLE_RESOLUTION, MAX_SAMPLE_RESOLUTION);
  const sampleWidth = Math.max(MIN_DIMENSION, Math.ceil(terrain.width / sampleResolution));
  const sampleHeight = Math.max(MIN_DIMENSION, Math.ceil(terrain.height / sampleResolution));
  const chunkColumns = Math.ceil(sampleWidth / chunkSize);
  const chunkRows = Math.ceil(sampleHeight / chunkSize);
  const chunks: Record<TerrainChunkKey, TerrainChunk> = {};

  for (let chunkY = 0; chunkY < chunkRows; chunkY += 1) {
    const startY = chunkY * chunkSize;
    const heightSamples = Math.min(chunkSize, sampleHeight - startY);

    for (let chunkX = 0; chunkX < chunkColumns; chunkX += 1) {
      const startX = chunkX * chunkSize;
      const widthSamples = Math.min(chunkSize, sampleWidth - startX);
      const chunkKey = `${chunkX}:${chunkY}` as TerrainChunkKey;
      chunks[chunkKey] = buildTerrainChunk(
        chunkKey,
        chunkX,
        chunkY,
        startX,
        startY,
        widthSamples,
        heightSamples,
        sampleWidth,
        sampleHeight,
        settings,
        generatedAt,
      );
    }
  }

  return chunks;
};

const normalizeGenerationSettings = (
  terrain: MapTerrainDocument,
  seedOverride: number | undefined,
): TerrainGenerationSettings => {
  const source = terrain.generation.settings;
  const normalizedSeed = normalizeSeed(seedOverride ?? source.seed);

  return {
    ...source,
    seed: normalizedSeed,
    octaves: clamp(Math.round(source.octaves), 1, 12),
    frequency: clamp(source.frequency, 0.0001, 100),
    lacunarity: clamp(source.lacunarity, 0.1, 10),
    persistence: clamp(source.persistence, 0, 1),
    amplitude: clamp(source.amplitude, 0, 4),
    warp: clamp(source.warp, 0, 10),
    continentFrequency: clamp(source.continentFrequency, 0.01, 10),
    continentStrength: clamp(source.continentStrength, 0, 1),
  };
};

export const generateTerrainForMap = (
  map: MapDocument,
  options: GenerateTerrainForMapOptions = {},
): MapTerrainDocument => {
  const generatedAt = options.generatedAt ?? nowIso();
  const terrain = map.terrain;
  const normalizedSettings = normalizeGenerationSettings(terrain, options.seedOverride);
  const generatedChunks = buildGeneratedChunks(terrain, normalizedSettings, generatedAt);
  const observedRange = computeObservedRange(generatedChunks);

  return {
    ...terrain,
    width: map.dimensions.width,
    height: map.dimensions.height,
    seaLevel: clamp(terrain.seaLevel, -1, 1),
    storage: {
      ...terrain.storage,
      chunkSize: clamp(Math.round(terrain.storage.chunkSize), MIN_CHUNK_SIZE, MAX_CHUNK_SIZE),
      sampleResolution: clamp(Math.round(terrain.storage.sampleResolution), MIN_SAMPLE_RESOLUTION, MAX_SAMPLE_RESOLUTION),
      chunks: generatedChunks,
    },
    normalization: {
      ...terrain.normalization,
      domainMin: -1,
      domainMax: 1,
      normalizedMin: 0,
      normalizedMax: 1,
      observedMin: observedRange.min,
      observedMax: observedRange.max,
    },
    generation: {
      ...terrain.generation,
      source: "seeded-procedural",
      revision: terrain.generation.revision + 1,
      hasGenerated: true,
      lastGeneratedAt: generatedAt,
      settings: normalizedSettings,
    },
    derived: {
      coastlineRevision: null,
      landMaskRevision: null,
      contourRevision: null,
      cachedAt: null,
      lastSeaLevel: null,
      coastlineSegmentCount: 0,
      contourSegmentCount: 0,
      landSampleCount: 0,
      waterSampleCount: 0,
    },
    meta: {
      ...terrain.meta,
      updatedAt: generatedAt,
    },
  };
};

export const createRandomTerrainSeed = (): number => {
  return Math.floor(Math.random() * UINT32_MAX);
};

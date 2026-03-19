import type {
  ActiveTerrainBrushSettings,
  MapTerrainDocument,
  TerrainChunk,
  TerrainChunkKey,
  TerrainSculptTool,
} from "../../types";
import { nowIso } from "../factories/idFactory";

interface TerrainStorageMetrics {
  chunkSize: number;
  sampleResolution: number;
  sampleWidth: number;
  sampleHeight: number;
}

interface TerrainSamplePointer {
  key: TerrainChunkKey;
  chunkX: number;
  chunkY: number;
  localX: number;
  localY: number;
  widthSamples: number;
  heightSamples: number;
}

export interface ApplyTerrainBrushOptions {
  worldX: number;
  worldY: number;
  brush: ActiveTerrainBrushSettings;
  editedAt?: string;
}

export interface ApplyTerrainBrushResult {
  terrain: MapTerrainDocument;
  changed: boolean;
  affectedSamples: number;
}

interface ChunkPendingUpdates {
  pointer: TerrainSamplePointer;
  updates: Array<{ index: number; value: number }>;
}

const MIN_CHUNK_SIZE = 16;
const MAX_CHUNK_SIZE = 4096;
const MIN_SAMPLE_RESOLUTION = 1;
const MAX_SAMPLE_RESOLUTION = 64;
const RAISE_LOWER_SCALE = 0.12;
const SAMPLE_EPSILON = 0.000001;

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
};

const lerp = (from: number, to: number, t: number): number => {
  return from + (to - from) * t;
};

const toChunkKey = (chunkX: number, chunkY: number): TerrainChunkKey => {
  return `${chunkX}:${chunkY}` as TerrainChunkKey;
};

const normalizeBrush = (brush: ActiveTerrainBrushSettings): ActiveTerrainBrushSettings => {
  const tool: TerrainSculptTool =
    brush.tool === "raise" || brush.tool === "lower" || brush.tool === "smooth" || brush.tool === "flatten"
      ? brush.tool
      : "raise";

  return {
    tool,
    size: clamp(Number.isFinite(brush.size) ? brush.size : 96, 1, 4096),
    strength: clamp(Number.isFinite(brush.strength) ? brush.strength : 0.35, 0.01, 1),
    hardness: clamp(Number.isFinite(brush.hardness) ? brush.hardness : 0.45, 0, 1),
    flattenTarget: clamp(Number.isFinite(brush.flattenTarget) ? brush.flattenTarget : 0, -1, 1),
  };
};

const resolveStorageMetrics = (terrain: MapTerrainDocument): TerrainStorageMetrics => {
  const chunkSize = clamp(Math.round(terrain.storage.chunkSize), MIN_CHUNK_SIZE, MAX_CHUNK_SIZE);
  const sampleResolution = clamp(Math.round(terrain.storage.sampleResolution), MIN_SAMPLE_RESOLUTION, MAX_SAMPLE_RESOLUTION);

  return {
    chunkSize,
    sampleResolution,
    sampleWidth: Math.max(1, Math.ceil(Math.max(1, terrain.width) / sampleResolution)),
    sampleHeight: Math.max(1, Math.ceil(Math.max(1, terrain.height) / sampleResolution)),
  };
};

const resolveChunkDimension = (chunkCoordinate: number, chunkSize: number, sampleExtent: number): number => {
  const start = chunkCoordinate * chunkSize;
  const remaining = sampleExtent - start;
  return Math.max(1, Math.min(chunkSize, remaining));
};

const resolvePointer = (
  sampleX: number,
  sampleY: number,
  metrics: TerrainStorageMetrics,
): TerrainSamplePointer | null => {
  if (
    sampleX < 0 ||
    sampleY < 0 ||
    sampleX >= metrics.sampleWidth ||
    sampleY >= metrics.sampleHeight
  ) {
    return null;
  }

  const chunkX = Math.floor(sampleX / metrics.chunkSize);
  const chunkY = Math.floor(sampleY / metrics.chunkSize);
  const localX = sampleX - chunkX * metrics.chunkSize;
  const localY = sampleY - chunkY * metrics.chunkSize;

  return {
    key: toChunkKey(chunkX, chunkY),
    chunkX,
    chunkY,
    localX,
    localY,
    widthSamples: resolveChunkDimension(chunkX, metrics.chunkSize, metrics.sampleWidth),
    heightSamples: resolveChunkDimension(chunkY, metrics.chunkSize, metrics.sampleHeight),
  };
};

const readSampleAt = (terrain: MapTerrainDocument, pointer: TerrainSamplePointer): number => {
  const chunk = terrain.storage.chunks[pointer.key];

  if (!chunk) {
    return 0;
  }

  const widthSamples = Math.max(1, Math.round(chunk.widthSamples));
  const heightSamples = Math.max(1, Math.round(chunk.heightSamples));

  if (
    pointer.localX < 0 ||
    pointer.localY < 0 ||
    pointer.localX >= widthSamples ||
    pointer.localY >= heightSamples
  ) {
    return 0;
  }

  const index = pointer.localY * widthSamples + pointer.localX;
  const sample = index < chunk.samples.length ? chunk.samples[index] : 0;
  return clamp(sample, -1, 1);
};

const sampleSmoothNeighborhood = (
  terrain: MapTerrainDocument,
  sampleX: number,
  sampleY: number,
  metrics: TerrainStorageMetrics,
): number => {
  let total = 0;
  let count = 0;

  for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
    for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
      const pointer = resolvePointer(sampleX + offsetX, sampleY + offsetY, metrics);
      if (!pointer) {
        continue;
      }

      total += readSampleAt(terrain, pointer);
      count += 1;
    }
  }

  if (count <= 0) {
    return 0;
  }

  return total / count;
};

const computeFalloffWeight = (distance: number, radius: number, hardness: number): number => {
  if (radius <= 0) {
    return 0;
  }

  if (distance >= radius) {
    return 0;
  }

  const normalizedDistance = clamp(distance / radius, 0, 1);
  const clampedHardness = clamp(hardness, 0, 1);

  if (clampedHardness >= 1 || normalizedDistance <= clampedHardness) {
    return 1;
  }

  const t = (normalizedDistance - clampedHardness) / Math.max(SAMPLE_EPSILON, 1 - clampedHardness);
  const smoothT = t * t * (3 - 2 * t);
  return clamp(1 - smoothT, 0, 1);
};

const createWritableChunk = (
  sourceChunk: TerrainChunk | undefined,
  pointer: TerrainSamplePointer,
  editedAt: string,
): TerrainChunk => {
  const sampleCount = pointer.widthSamples * pointer.heightSamples;
  const samples = new Array<number>(sampleCount).fill(0);

  if (sourceChunk) {
    const sourceWidth = Math.max(1, Math.round(sourceChunk.widthSamples));
    const sourceHeight = Math.max(1, Math.round(sourceChunk.heightSamples));
    const copiedWidth = Math.min(sourceWidth, pointer.widthSamples);
    const copiedHeight = Math.min(sourceHeight, pointer.heightSamples);

    for (let row = 0; row < copiedHeight; row += 1) {
      for (let column = 0; column < copiedWidth; column += 1) {
        const sourceIndex = row * sourceWidth + column;
        const targetIndex = row * pointer.widthSamples + column;
        const sample = sourceIndex < sourceChunk.samples.length ? sourceChunk.samples[sourceIndex] : 0;
        samples[targetIndex] = clamp(sample, -1, 1);
      }
    }

    return {
      ...sourceChunk,
      widthSamples: pointer.widthSamples,
      heightSamples: pointer.heightSamples,
      samples,
      meta: {
        ...sourceChunk.meta,
        updatedAt: editedAt,
      },
    };
  }

  return {
    key: pointer.key,
    chunkX: pointer.chunkX,
    chunkY: pointer.chunkY,
    widthSamples: pointer.widthSamples,
    heightSamples: pointer.heightSamples,
    samples,
    meta: {
      createdAt: editedAt,
      updatedAt: editedAt,
      notes: "Created by terrain sculpting tool.",
    },
  };
};

const evaluateNextSample = (
  terrain: MapTerrainDocument,
  sampleX: number,
  sampleY: number,
  currentValue: number,
  weight: number,
  brush: ActiveTerrainBrushSettings,
  metrics: TerrainStorageMetrics,
): number => {
  const blendedStrength = clamp(brush.strength * weight, 0, 1);

  if (brush.tool === "raise") {
    return clamp(currentValue + blendedStrength * RAISE_LOWER_SCALE, -1, 1);
  }

  if (brush.tool === "lower") {
    return clamp(currentValue - blendedStrength * RAISE_LOWER_SCALE, -1, 1);
  }

  if (brush.tool === "flatten") {
    return clamp(lerp(currentValue, brush.flattenTarget, blendedStrength), -1, 1);
  }

  const neighborhoodAverage = sampleSmoothNeighborhood(terrain, sampleX, sampleY, metrics);
  return clamp(lerp(currentValue, neighborhoodAverage, blendedStrength), -1, 1);
};

export const applyTerrainBrushAtPoint = (
  terrain: MapTerrainDocument,
  options: ApplyTerrainBrushOptions,
): ApplyTerrainBrushResult => {
  const editedAt = options.editedAt ?? nowIso();
  const brush = normalizeBrush(options.brush);
  const metrics = resolveStorageMetrics(terrain);
  const radius = Math.max(1, brush.size);
  const minSampleX = clamp(
    Math.floor((options.worldX - radius) / metrics.sampleResolution),
    0,
    metrics.sampleWidth - 1,
  );
  const maxSampleX = clamp(
    Math.floor((options.worldX + radius) / metrics.sampleResolution),
    0,
    metrics.sampleWidth - 1,
  );
  const minSampleY = clamp(
    Math.floor((options.worldY - radius) / metrics.sampleResolution),
    0,
    metrics.sampleHeight - 1,
  );
  const maxSampleY = clamp(
    Math.floor((options.worldY + radius) / metrics.sampleResolution),
    0,
    metrics.sampleHeight - 1,
  );

  const pendingUpdates = new Map<TerrainChunkKey, ChunkPendingUpdates>();
  let changedSampleCount = 0;
  let changedMin = Number.POSITIVE_INFINITY;
  let changedMax = Number.NEGATIVE_INFINITY;

  for (let sampleY = minSampleY; sampleY <= maxSampleY; sampleY += 1) {
    for (let sampleX = minSampleX; sampleX <= maxSampleX; sampleX += 1) {
      const pointer = resolvePointer(sampleX, sampleY, metrics);
      if (!pointer) {
        continue;
      }

      const centerX = sampleX * metrics.sampleResolution + metrics.sampleResolution / 2;
      const centerY = sampleY * metrics.sampleResolution + metrics.sampleResolution / 2;
      const distanceX = centerX - options.worldX;
      const distanceY = centerY - options.worldY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance > radius) {
        continue;
      }

      const weight = computeFalloffWeight(distance, radius, brush.hardness);
      if (weight <= 0) {
        continue;
      }

      const currentValue = readSampleAt(terrain, pointer);
      const nextValue = evaluateNextSample(terrain, sampleX, sampleY, currentValue, weight, brush, metrics);

      if (Math.abs(nextValue - currentValue) <= SAMPLE_EPSILON) {
        continue;
      }

      const index = pointer.localY * pointer.widthSamples + pointer.localX;
      const existingPending = pendingUpdates.get(pointer.key);

      if (existingPending) {
        existingPending.updates.push({ index, value: nextValue });
      } else {
        pendingUpdates.set(pointer.key, {
          pointer,
          updates: [{ index, value: nextValue }],
        });
      }
      changedSampleCount += 1;
      changedMin = Math.min(changedMin, nextValue);
      changedMax = Math.max(changedMax, nextValue);
    }
  }

  if (changedSampleCount <= 0) {
    return {
      terrain,
      changed: false,
      affectedSamples: 0,
    };
  }

  const nextChunks: Record<TerrainChunkKey, TerrainChunk> = {
    ...terrain.storage.chunks,
  };

  for (const [chunkKey, pending] of pendingUpdates.entries()) {
    const writableChunk = createWritableChunk(nextChunks[chunkKey], pending.pointer, editedAt);

    for (const update of pending.updates) {
      if (update.index < 0 || update.index >= writableChunk.samples.length) {
        continue;
      }

      writableChunk.samples[update.index] = clamp(update.value, -1, 1);
    }

    writableChunk.meta = {
      ...writableChunk.meta,
      updatedAt: editedAt,
    };
    nextChunks[chunkKey] = writableChunk;
  }

  return {
    terrain: {
      ...terrain,
      storage: {
        ...terrain.storage,
        chunkSize: metrics.chunkSize,
        sampleResolution: metrics.sampleResolution,
        chunks: nextChunks,
      },
      normalization: {
        ...terrain.normalization,
        observedMin: Math.min(terrain.normalization.observedMin, changedMin),
        observedMax: Math.max(terrain.normalization.observedMax, changedMax),
      },
      generation: {
        ...terrain.generation,
        source: "manual-edit",
        revision: terrain.generation.revision + 1,
        hasGenerated: true,
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
        updatedAt: editedAt,
      },
    },
    changed: true,
    affectedSamples: changedSampleCount,
  };
};

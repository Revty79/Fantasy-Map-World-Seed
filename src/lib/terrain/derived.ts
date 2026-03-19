import type { MapTerrainDocument, TerrainLineSegment } from "../../types";

export interface TerrainSampleGrid {
  width: number;
  height: number;
  sampleResolution: number;
  values: Float32Array;
}

export interface TerrainDerivedProducts {
  grid: TerrainSampleGrid;
  seaLevel: number;
  coastlineSegments: TerrainLineSegment[];
  contourSegments: TerrainLineSegment[];
  landMask: Uint8Array;
  landSampleCount: number;
  waterSampleCount: number;
}

export interface DeriveTerrainProductsOptions {
  includeContours?: boolean;
  contourInterval?: number;
  maxContourLevels?: number;
  seaLevelOverride?: number;
}

interface GridPoint {
  x: number;
  y: number;
}

interface TerrainDerivedCacheEntry {
  key: string;
  products: TerrainDerivedProducts;
}

const MIN_CHUNK_SIZE = 16;
const MAX_CHUNK_SIZE = 4096;
const MIN_SAMPLE_RESOLUTION = 1;
const MAX_SAMPLE_RESOLUTION = 64;
const MIN_CONTOUR_INTERVAL = 0.005;
const MAX_CONTOUR_INTERVAL = 1;
const DEFAULT_MAX_CONTOUR_LEVELS = 24;
const INTERPOLATION_EPSILON = 0.000001;
const DERIVED_CACHE = new WeakMap<MapTerrainDocument, TerrainDerivedCacheEntry>();

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
};

const buildDerivedCacheKey = (
  terrain: MapTerrainDocument,
  options: DeriveTerrainProductsOptions,
  seaLevel: number,
): string => {
  const includeContours = Boolean(options.includeContours);
  const contourInterval = clamp(
    options.contourInterval ?? terrain.display.contourInterval,
    MIN_CONTOUR_INTERVAL,
    MAX_CONTOUR_INTERVAL,
  );
  const maxContourLevels = Math.max(1, Math.round(options.maxContourLevels ?? DEFAULT_MAX_CONTOUR_LEVELS));

  return [
    terrain.meta.updatedAt,
    terrain.generation.revision,
    terrain.storage.sampleResolution,
    terrain.storage.chunkSize,
    seaLevel.toFixed(4),
    includeContours ? "contours" : "no-contours",
    contourInterval.toFixed(4),
    maxContourLevels,
  ].join("|");
};

const readGridValue = (grid: TerrainSampleGrid, x: number, y: number): number => {
  const clampedX = clamp(Math.round(x), 0, grid.width - 1);
  const clampedY = clamp(Math.round(y), 0, grid.height - 1);
  return grid.values[clampedY * grid.width + clampedX];
};

const toSampleGrid = (terrain: MapTerrainDocument): TerrainSampleGrid => {
  const sampleResolution = clamp(
    Math.round(terrain.storage.sampleResolution),
    MIN_SAMPLE_RESOLUTION,
    MAX_SAMPLE_RESOLUTION,
  );
  const chunkSize = clamp(Math.round(terrain.storage.chunkSize), MIN_CHUNK_SIZE, MAX_CHUNK_SIZE);
  const sampleWidth = Math.max(1, Math.ceil(terrain.width / sampleResolution));
  const sampleHeight = Math.max(1, Math.ceil(terrain.height / sampleResolution));
  const values = new Float32Array(sampleWidth * sampleHeight);

  for (const chunk of Object.values(terrain.storage.chunks)) {
    const widthSamples = Math.max(1, Math.round(chunk.widthSamples));
    const heightSamples = Math.max(1, Math.round(chunk.heightSamples));

    for (let localY = 0; localY < heightSamples; localY += 1) {
      for (let localX = 0; localX < widthSamples; localX += 1) {
        const globalX = chunk.chunkX * chunkSize + localX;
        const globalY = chunk.chunkY * chunkSize + localY;

        if (globalX < 0 || globalY < 0 || globalX >= sampleWidth || globalY >= sampleHeight) {
          continue;
        }

        const sourceIndex = localY * widthSamples + localX;
        const targetIndex = globalY * sampleWidth + globalX;
        const sampleValue = sourceIndex < chunk.samples.length ? chunk.samples[sourceIndex] : 0;
        values[targetIndex] = clamp(sampleValue, -1, 1);
      }
    }
  }

  return {
    width: sampleWidth,
    height: sampleHeight,
    sampleResolution,
    values,
  };
};

const hasEdgeCrossing = (fromValue: number, toValue: number, threshold: number): boolean => {
  const fromAbove = fromValue >= threshold;
  const toAbove = toValue >= threshold;

  if (fromAbove !== toAbove) {
    return true;
  }

  if (Math.abs(fromValue - threshold) <= INTERPOLATION_EPSILON && Math.abs(toValue - threshold) > INTERPOLATION_EPSILON) {
    return true;
  }

  if (Math.abs(toValue - threshold) <= INTERPOLATION_EPSILON && Math.abs(fromValue - threshold) > INTERPOLATION_EPSILON) {
    return true;
  }

  return false;
};

const interpolatePoint = (
  fromX: number,
  fromY: number,
  fromValue: number,
  toX: number,
  toY: number,
  toValue: number,
  threshold: number,
): GridPoint => {
  const denominator = toValue - fromValue;
  const t = Math.abs(denominator) <= INTERPOLATION_EPSILON
    ? 0.5
    : clamp((threshold - fromValue) / denominator, 0, 1);

  return {
    x: fromX + (toX - fromX) * t,
    y: fromY + (toY - fromY) * t,
  };
};

const appendSegment = (
  segments: TerrainLineSegment[],
  from: GridPoint,
  to: GridPoint,
  sampleResolution: number,
  level: number,
): void => {
  segments.push({
    startX: from.x * sampleResolution,
    startY: from.y * sampleResolution,
    endX: to.x * sampleResolution,
    endY: to.y * sampleResolution,
    level,
  });
};

const deriveIsolineSegmentsFromGrid = (
  grid: TerrainSampleGrid,
  threshold: number,
): TerrainLineSegment[] => {
  const segments: TerrainLineSegment[] = [];

  if (grid.width < 2 || grid.height < 2) {
    return segments;
  }

  for (let y = 0; y < grid.height - 1; y += 1) {
    for (let x = 0; x < grid.width - 1; x += 1) {
      const topLeft = readGridValue(grid, x, y);
      const topRight = readGridValue(grid, x + 1, y);
      const bottomRight = readGridValue(grid, x + 1, y + 1);
      const bottomLeft = readGridValue(grid, x, y + 1);

      const edgePoints: Partial<Record<"top" | "right" | "bottom" | "left", GridPoint>> = {};

      if (hasEdgeCrossing(topLeft, topRight, threshold)) {
        edgePoints.top = interpolatePoint(x, y, topLeft, x + 1, y, topRight, threshold);
      }

      if (hasEdgeCrossing(topRight, bottomRight, threshold)) {
        edgePoints.right = interpolatePoint(x + 1, y, topRight, x + 1, y + 1, bottomRight, threshold);
      }

      if (hasEdgeCrossing(bottomLeft, bottomRight, threshold)) {
        edgePoints.bottom = interpolatePoint(x, y + 1, bottomLeft, x + 1, y + 1, bottomRight, threshold);
      }

      if (hasEdgeCrossing(topLeft, bottomLeft, threshold)) {
        edgePoints.left = interpolatePoint(x, y, topLeft, x, y + 1, bottomLeft, threshold);
      }

      const intersections = [edgePoints.top, edgePoints.right, edgePoints.bottom, edgePoints.left].filter(Boolean) as GridPoint[];

      if (intersections.length < 2) {
        continue;
      }

      if (intersections.length === 2) {
        appendSegment(segments, intersections[0], intersections[1], grid.sampleResolution, threshold);
        continue;
      }

      if (intersections.length === 4 && edgePoints.top && edgePoints.right && edgePoints.bottom && edgePoints.left) {
        const centerAverage = (topLeft + topRight + bottomRight + bottomLeft) * 0.25;
        const centerAbove = centerAverage >= threshold;

        if (centerAbove) {
          appendSegment(segments, edgePoints.top, edgePoints.right, grid.sampleResolution, threshold);
          appendSegment(segments, edgePoints.bottom, edgePoints.left, grid.sampleResolution, threshold);
        } else {
          appendSegment(segments, edgePoints.top, edgePoints.left, grid.sampleResolution, threshold);
          appendSegment(segments, edgePoints.right, edgePoints.bottom, grid.sampleResolution, threshold);
        }
      }
    }
  }

  return segments;
};

const deriveLandMask = (
  grid: TerrainSampleGrid,
  seaLevel: number,
): { mask: Uint8Array; landSampleCount: number; waterSampleCount: number } => {
  const mask = new Uint8Array(grid.values.length);
  let landSampleCount = 0;
  let waterSampleCount = 0;

  for (let index = 0; index < grid.values.length; index += 1) {
    const isLand = grid.values[index] >= seaLevel;
    mask[index] = isLand ? 1 : 0;
    if (isLand) {
      landSampleCount += 1;
    } else {
      waterSampleCount += 1;
    }
  }

  return {
    mask,
    landSampleCount,
    waterSampleCount,
  };
};

const deriveContourSegments = (
  grid: TerrainSampleGrid,
  contourInterval: number,
  maxContourLevels: number,
): TerrainLineSegment[] => {
  const clampedInterval = clamp(contourInterval, MIN_CONTOUR_INTERVAL, MAX_CONTOUR_INTERVAL);
  const levelStep = clampedInterval * 2;
  const thresholds: number[] = [];

  for (
    let threshold = -1 + levelStep;
    threshold < 1 && thresholds.length < maxContourLevels;
    threshold += levelStep
  ) {
    thresholds.push(clamp(threshold, -1, 1));
  }

  const segments: TerrainLineSegment[] = [];
  for (const threshold of thresholds) {
    segments.push(...deriveIsolineSegmentsFromGrid(grid, threshold));
  }

  return segments;
};

export const buildTerrainSampleGrid = (terrain: MapTerrainDocument): TerrainSampleGrid => {
  return toSampleGrid(terrain);
};

export const deriveTerrainProducts = (
  terrain: MapTerrainDocument,
  options: DeriveTerrainProductsOptions = {},
): TerrainDerivedProducts => {
  const seaLevel = clamp(options.seaLevelOverride ?? terrain.seaLevel, -1, 1);
  const cacheKey = buildDerivedCacheKey(terrain, options, seaLevel);
  const cached = DERIVED_CACHE.get(terrain);

  if (cached && cached.key === cacheKey) {
    return cached.products;
  }

  const grid = toSampleGrid(terrain);
  const coastlineSegments = deriveIsolineSegmentsFromGrid(grid, seaLevel);
  const landMaskSummary = deriveLandMask(grid, seaLevel);
  const includeContours = Boolean(options.includeContours);
  const contourInterval = clamp(
    options.contourInterval ?? terrain.display.contourInterval,
    MIN_CONTOUR_INTERVAL,
    MAX_CONTOUR_INTERVAL,
  );
  const maxContourLevels = Math.max(1, Math.round(options.maxContourLevels ?? DEFAULT_MAX_CONTOUR_LEVELS));
  const contourSegments = includeContours
    ? deriveContourSegments(grid, contourInterval, maxContourLevels)
    : [];

  const products: TerrainDerivedProducts = {
    grid,
    seaLevel,
    coastlineSegments,
    contourSegments,
    landMask: landMaskSummary.mask,
    landSampleCount: landMaskSummary.landSampleCount,
    waterSampleCount: landMaskSummary.waterSampleCount,
  };

  DERIVED_CACHE.set(terrain, {
    key: cacheKey,
    products,
  });

  return products;
};

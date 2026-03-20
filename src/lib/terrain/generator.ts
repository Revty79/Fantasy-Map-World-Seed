import { nowIso } from "../factories/idFactory";
import type { MapDocument, MapTerrainDocument, TerrainChunk, TerrainChunkKey, TerrainGenerationSettings } from "../../types";

export interface GenerateTerrainForMapOptions {
  seedOverride?: number;
  generatedAt?: string;
}

interface TerrainField {
  width: number;
  height: number;
  values: Float32Array;
}

interface ContinentalTemplateProfile {
  continentCount: number;
  continentRadiusMinFraction: number;
  continentRadiusMaxFraction: number;
  ridgeCount: number;
  troughCount: number;
  straitCount: number;
  smoothPasses: number;
  edgeMaskPower: number;
  ridgeWidthMin: number;
  ridgeWidthMax: number;
}

const MIN_DIMENSION = 1;
const MIN_CHUNK_SIZE = 16;
const MAX_CHUNK_SIZE = 4096;
const MIN_SAMPLE_RESOLUTION = 1;
const MAX_SAMPLE_RESOLUTION = 64;
const UINT32_MAX = 0xffffffff;
const FIELD_HISTOGRAM_BUCKETS = 1024;
const SAMPLE_EPSILON = 0.000001;
const HORIZONTAL_SEAM_BLEND_FRACTION = 0.08;

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

const inverseLerp = (from: number, to: number, value: number): number => {
  const denominator = to - from;
  if (Math.abs(denominator) <= SAMPLE_EPSILON) {
    return 0;
  }

  return (value - from) / denominator;
};

const smoothStep = (value: number): number => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

const wrapIndex = (value: number, size: number): number => {
  if (size <= 0) {
    return 0;
  }

  const wrapped = value % size;
  return wrapped < 0 ? wrapped + size : wrapped;
};

const shortestWrappedDistance = (from: number, to: number, size: number): number => {
  const direct = Math.abs(from - to);
  return Math.min(direct, Math.max(0, size - direct));
};

const shortestWrappedDelta = (delta: number, size: number): number => {
  if (Math.abs(delta) <= size * 0.5) {
    return delta;
  }

  return delta > 0 ? delta - size : delta + size;
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

const createSeededRandom = (seed: number): (() => number) => {
  let state = normalizeSeed(seed);
  if (state === 0) {
    state = 0x6d2b79f5;
  }

  return () => {
    state = mixToUInt32(state + 0x6d2b79f5);
    let mixed = state;
    mixed = mixToUInt32(Math.imul(mixed ^ (mixed >>> 15), mixed | 1));
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    const output = mixToUInt32(mixed ^ (mixed >>> 14));
    return output / UINT32_MAX;
  };
};

const addEllipticalBlob = (
  field: TerrainField,
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  height: number,
  falloffPower: number,
): void => {
  const clampedRadiusX = Math.max(1, radiusX);
  const clampedRadiusY = Math.max(1, radiusY);
  const minY = Math.max(0, Math.floor(centerY - clampedRadiusY));
  const maxY = Math.min(field.height - 1, Math.ceil(centerY + clampedRadiusY));

  for (let y = minY; y <= maxY; y += 1) {
    const normalizedY = (y - centerY) / clampedRadiusY;
    const normalizedYSquared = normalizedY * normalizedY;
    if (normalizedYSquared >= 1) {
      continue;
    }

    const spanFactor = Math.sqrt(1 - normalizedYSquared);
    const spanX = clampedRadiusX * spanFactor;
    const minX = Math.floor(centerX - spanX);
    const maxX = Math.ceil(centerX + spanX);

    for (let sourceX = minX; sourceX <= maxX; sourceX += 1) {
      const x = wrapIndex(sourceX, field.width);
      const wrappedDistanceX = shortestWrappedDistance(x, centerX, field.width);
      const normalizedX = wrappedDistanceX / clampedRadiusX;
      const radialSquared = normalizedX * normalizedX + normalizedYSquared;
      if (radialSquared >= 1) {
        continue;
      }

      const weight = Math.pow(1 - radialSquared, falloffPower);
      const index = y * field.width + x;
      field.values[index] = clamp(field.values[index] + height * weight, -1, 1);
    }
  }
};

const addRidgeline = (
  field: TerrainField,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  height: number,
  width: number,
  jitter: number,
  falloffPower: number,
  random: () => number,
): void => {
  const wrappedDeltaX = shortestWrappedDelta(endX - startX, field.width);
  const distance = Math.hypot(wrappedDeltaX, endY - startY);
  const steps = Math.max(8, Math.ceil(distance * 1.25));

  for (let step = 0; step <= steps; step += 1) {
    const t = step / steps;
    const taper = 1 - Math.abs(t * 2 - 1) * 0.55;
    const sway = Math.sin(t * Math.PI * 2) * jitter * (0.35 + random() * 0.65);
    const pointX = wrapIndex(startX + wrappedDeltaX * t + sway, field.width);
    const pointY = clamp(lerp(startY, endY, t) + (random() - 0.5) * jitter * 0.45, 0, field.height - 1);
    const blobRadius = width * (0.8 + taper * 0.35);
    const blobHeight = height * taper;

    addEllipticalBlob(
      field,
      pointX,
      pointY,
      blobRadius,
      blobRadius * 0.72,
      blobHeight,
      falloffPower,
    );
  }
};

const smoothField = (field: TerrainField, passes: number): void => {
  const clampedPasses = Math.max(0, Math.round(passes));
  if (clampedPasses <= 0) {
    return;
  }

  let currentValues = field.values;

  for (let pass = 0; pass < clampedPasses; pass += 1) {
    const nextValues = new Float32Array(currentValues.length);

    for (let y = 0; y < field.height; y += 1) {
      const upY = Math.max(0, y - 1);
      const downY = Math.min(field.height - 1, y + 1);

      for (let x = 0; x < field.width; x += 1) {
        const leftX = wrapIndex(x - 1, field.width);
        const rightX = wrapIndex(x + 1, field.width);
        const centerIndex = y * field.width + x;

        const center = currentValues[centerIndex] * 4;
        const axial =
          currentValues[y * field.width + leftX] +
          currentValues[y * field.width + rightX] +
          currentValues[upY * field.width + x] +
          currentValues[downY * field.width + x];
        const diagonals =
          currentValues[upY * field.width + leftX] +
          currentValues[upY * field.width + rightX] +
          currentValues[downY * field.width + leftX] +
          currentValues[downY * field.width + rightX];

        nextValues[centerIndex] = clamp((center + axial * 1.2 + diagonals * 0.55) / 9.8, -1, 1);
      }
    }

    currentValues = nextValues;
  }

  field.values = currentValues;
};

const applyEdgeMask = (
  field: TerrainField,
  edgeMaskPower: number,
  oceanFloor: number,
): void => {
  const widthDenominator = Math.max(1, field.width - 1);
  const heightDenominator = Math.max(1, field.height - 1);

  for (let y = 0; y < field.height; y += 1) {
    const latitude = (y / heightDenominator) * 2 - 1;
    const latitudeMask = 1 - latitude * latitude;
    const polarPenalty = Math.pow(Math.abs(latitude), 2.45) * 0.14;

    for (let x = 0; x < field.width; x += 1) {
      const longitude = (x / widthDenominator) * 2 - 1;
      const edgeDistance = clamp((1 - longitude * longitude) * latitudeMask, 0, 1);
      const centerWeight = Math.pow(edgeDistance, edgeMaskPower);
      const index = y * field.width + x;
      const maskedValue = lerp(oceanFloor, field.values[index], centerWeight) - polarPenalty;
      field.values[index] = clamp(maskedValue, -1, 1);
    }
  }
};

const createTemplateProfile = (
  settings: TerrainGenerationSettings,
  sampleWidth: number,
  sampleHeight: number,
): ContinentalTemplateProfile => {
  const strength = clamp(settings.continentStrength, 0, 1);
  const frequency = clamp(settings.continentFrequency, 0.05, 3);
  const frequencyNormalized = clamp((frequency - 0.2) / 1.8, 0, 1);
  const scale = Math.max(64, Math.min(sampleWidth, sampleHeight));

  const isArchipelago = strength < 0.35;
  const isSupercontinent = strength > 0.72;

  const baseContinentCount = isArchipelago ? 8 : isSupercontinent ? 2 : 4;
  const continentCount = clamp(
    Math.round(baseContinentCount * lerp(0.8, 1.5, frequencyNormalized)),
    1,
    16,
  );
  const sizeScale = lerp(1.38, 0.72, frequencyNormalized);
  const continentRadiusMinFraction = (isArchipelago ? 0.075 : isSupercontinent ? 0.22 : 0.14) * sizeScale;
  const continentRadiusMaxFraction = (isArchipelago ? 0.16 : isSupercontinent ? 0.38 : 0.27) * sizeScale;

  const ridgeWidthBase = isSupercontinent ? 0.017 : isArchipelago ? 0.009 : 0.012;
  const ridgeWidthMin = Math.max(2, scale * ridgeWidthBase);
  const ridgeWidthMax = Math.max(ridgeWidthMin + 1, scale * (ridgeWidthBase * 2.15));

  return {
    continentCount,
    continentRadiusMinFraction,
    continentRadiusMaxFraction,
    ridgeCount: isArchipelago ? 4 : isSupercontinent ? 7 : 5,
    troughCount: isArchipelago ? 4 : isSupercontinent ? 2 : 3,
    straitCount: isArchipelago ? 3 : isSupercontinent ? 1 : 2,
    smoothPasses: isSupercontinent ? 3 : 2,
    edgeMaskPower: isArchipelago ? 1.35 : isSupercontinent ? 1.75 : 1.52,
    ridgeWidthMin,
    ridgeWidthMax,
  };
};

const buildContinentalBaseField = (
  sampleWidth: number,
  sampleHeight: number,
  settings: TerrainGenerationSettings,
): TerrainField => {
  const field: TerrainField = {
    width: sampleWidth,
    height: sampleHeight,
    values: new Float32Array(sampleWidth * sampleHeight),
  };
  field.values.fill(-0.78);

  const normalizedSeed = normalizeSeed(settings.seed);
  const random = createSeededRandom(normalizedSeed ^ 0x9e3779b9);
  const strength = clamp(settings.continentStrength, 0, 1);
  const profile = createTemplateProfile(settings, sampleWidth, sampleHeight);
  const worldScale = Math.min(sampleWidth, sampleHeight);
  const continentAnchors: Array<{ x: number; y: number; radius: number }> = [];

  const latMargin = Math.max(2, sampleHeight * 0.12);
  const yMin = latMargin;
  const yMax = Math.max(yMin + 1, sampleHeight - 1 - latMargin);

  for (let index = 0; index < profile.continentCount; index += 1) {
    const centerX = random() * sampleWidth;
    const centerY = lerp(yMin, yMax, random());
    const baseRadius =
      worldScale *
      lerp(profile.continentRadiusMinFraction, profile.continentRadiusMaxFraction, random());
    const radiusX = baseRadius * lerp(0.78, 1.36, random());
    const radiusY = baseRadius * lerp(0.58, 1.15, random());
    const primaryHeight = lerp(0.45, 0.98, random()) * (0.72 + strength * 0.62);

    addEllipticalBlob(field, centerX, centerY, radiusX, radiusY, primaryHeight, 1.45);
    continentAnchors.push({ x: centerX, y: centerY, radius: baseRadius });

    const lobeCount = 2 + Math.floor(random() * 4);
    for (let lobeIndex = 0; lobeIndex < lobeCount; lobeIndex += 1) {
      const angle = random() * Math.PI * 2;
      const distance = baseRadius * lerp(0.28, 0.95, random());
      const lobeX = wrapIndex(centerX + Math.cos(angle) * distance, sampleWidth);
      const lobeY = clamp(centerY + Math.sin(angle) * distance * 0.72, 0, sampleHeight - 1);
      const lobeRadius = baseRadius * lerp(0.28, 0.66, random());
      const lobeHeight = primaryHeight * lerp(0.32, 0.68, random());
      addEllipticalBlob(
        field,
        lobeX,
        lobeY,
        lobeRadius * lerp(0.72, 1.28, random()),
        lobeRadius * lerp(0.6, 1.16, random()),
        lobeHeight,
        1.3 + random() * 0.8,
      );
    }
  }

  const pickRandomAnchor = (): { x: number; y: number; radius: number } => {
    if (continentAnchors.length <= 0) {
      return {
        x: random() * sampleWidth,
        y: random() * sampleHeight,
        radius: worldScale * 0.1,
      };
    }

    return continentAnchors[Math.floor(random() * continentAnchors.length)];
  };

  for (let ridgeIndex = 0; ridgeIndex < profile.ridgeCount; ridgeIndex += 1) {
    const startAnchor = pickRandomAnchor();
    const endAnchor = pickRandomAnchor();
    const startX = wrapIndex(
      startAnchor.x + (random() - 0.5) * startAnchor.radius * 0.7,
      sampleWidth,
    );
    const startY = clamp(
      startAnchor.y + (random() - 0.5) * startAnchor.radius * 0.65,
      0,
      sampleHeight - 1,
    );
    const endX = wrapIndex(
      endAnchor.x + (random() - 0.5) * endAnchor.radius * 0.85,
      sampleWidth,
    );
    const endY = clamp(
      endAnchor.y + (random() - 0.5) * endAnchor.radius * 0.85,
      0,
      sampleHeight - 1,
    );
    const ridgeHeight = lerp(0.08, 0.24, random()) * (0.85 + strength * 0.7);
    const ridgeWidth = lerp(profile.ridgeWidthMin, profile.ridgeWidthMax, random());

    addRidgeline(
      field,
      startX,
      startY,
      endX,
      endY,
      ridgeHeight,
      ridgeWidth,
      ridgeWidth * (0.4 + random() * 0.7),
      1.35,
      random,
    );
  }

  for (let troughIndex = 0; troughIndex < profile.troughCount; troughIndex += 1) {
    const startAnchor = pickRandomAnchor();
    const endAnchor = pickRandomAnchor();
    const startX = wrapIndex(
      startAnchor.x + (random() - 0.5) * startAnchor.radius * 0.95,
      sampleWidth,
    );
    const startY = clamp(
      startAnchor.y + (random() - 0.5) * startAnchor.radius * 0.85,
      0,
      sampleHeight - 1,
    );
    const endX = wrapIndex(
      endAnchor.x + (random() - 0.5) * endAnchor.radius * 1.05,
      sampleWidth,
    );
    const endY = clamp(
      endAnchor.y + (random() - 0.5) * endAnchor.radius * 1.05,
      0,
      sampleHeight - 1,
    );
    const troughDepth = -lerp(0.08, 0.23, random()) * (0.75 + (1 - strength) * 0.65);
    const troughWidth = lerp(profile.ridgeWidthMin, profile.ridgeWidthMax, random()) * 0.95;

    addRidgeline(
      field,
      startX,
      startY,
      endX,
      endY,
      troughDepth,
      troughWidth,
      troughWidth * (0.45 + random() * 0.7),
      1.28,
      random,
    );
  }

  for (let straitIndex = 0; straitIndex < profile.straitCount; straitIndex += 1) {
    const isVertical = random() >= 0.4;
    const width = lerp(profile.ridgeWidthMin, profile.ridgeWidthMax, random()) * 1.05;
    const depth = -lerp(0.24, 0.44, random());
    const margin = Math.max(2, worldScale * 0.06);

    if (isVertical) {
      const x = lerp(margin, sampleWidth - 1 - margin, random());
      addRidgeline(
        field,
        x,
        margin,
        wrapIndex(x + (random() - 0.5) * worldScale * 0.14, sampleWidth),
        sampleHeight - 1 - margin,
        depth,
        width,
        width * 0.5,
        1.25,
        random,
      );
    } else {
      const y = lerp(margin, sampleHeight - 1 - margin, random());
      addRidgeline(
        field,
        margin,
        y,
        sampleWidth - 1 - margin,
        clamp(y + (random() - 0.5) * worldScale * 0.1, 0, sampleHeight - 1),
        depth,
        width,
        width * 0.44,
        1.25,
        random,
      );
    }
  }

  applyEdgeMask(field, profile.edgeMaskPower, -0.86);
  smoothField(field, profile.smoothPasses);
  return field;
};

const rebalanceFieldToTargetLandCoverage = (
  values: Float32Array,
  targetLandPercent: number,
): void => {
  if (values.length <= 0) {
    return;
  }

  const histogram = new Uint32Array(FIELD_HISTOGRAM_BUCKETS);
  let minValue = Number.POSITIVE_INFINITY;
  let maxValue = Number.NEGATIVE_INFINITY;

  for (const sample of values) {
    const clampedSample = clamp(sample, -1, 1);
    if (clampedSample < minValue) {
      minValue = clampedSample;
    }
    if (clampedSample > maxValue) {
      maxValue = clampedSample;
    }

    const normalized = (clampedSample + 1) * 0.5;
    const bucket = clamp(
      Math.floor(normalized * (FIELD_HISTOGRAM_BUCKETS - 1)),
      0,
      FIELD_HISTOGRAM_BUCKETS - 1,
    );
    histogram[bucket] += 1;
  }

  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue) || maxValue - minValue <= SAMPLE_EPSILON) {
    return;
  }

  const desiredLand = clamp(targetLandPercent, 0.05, 0.95);
  const desiredWaterCount = Math.floor((1 - desiredLand) * values.length);
  let cumulative = 0;
  let thresholdBucket = FIELD_HISTOGRAM_BUCKETS - 1;

  for (let bucket = 0; bucket < FIELD_HISTOGRAM_BUCKETS; bucket += 1) {
    cumulative += histogram[bucket];
    if (cumulative >= desiredWaterCount) {
      thresholdBucket = bucket;
      break;
    }
  }

  const threshold = (thresholdBucket / (FIELD_HISTOGRAM_BUCKETS - 1)) * 2 - 1;

  for (let index = 0; index < values.length; index += 1) {
    values[index] = clamp(values[index] - threshold, -1, 1);
  }
};

const applyDetailNoise = (
  field: TerrainField,
  settings: TerrainGenerationSettings,
): void => {
  const seed = normalizeSeed(settings.seed);
  const widthDenominator = Math.max(1, field.width - 1);
  const heightDenominator = Math.max(1, field.height - 1);
  const strength = clamp(settings.continentStrength, 0, 1);
  const coastLevel = lerp(0.68, 0.45, strength);
  const shelfLevel = clamp(coastLevel - 0.13, 0.02, 0.95);
  const interiorLevel = clamp(coastLevel + 0.09, 0.08, 0.98);

  for (let y = 0; y < field.height; y += 1) {
    const normalizedY = y / heightDenominator;
    const baseY = normalizedY + settings.offsetY;

    for (let x = 0; x < field.width; x += 1) {
      const index = y * field.width + x;
      const normalizedX = x / widthDenominator;
      const baseX = normalizedX + settings.offsetX;
      const warpStrength = settings.warp * 0.24;
      let sampleX = baseX;
      let sampleY = baseY;

      if (warpStrength > 0) {
        const warpFrequency = Math.max(0.01, settings.frequency * 0.48);
        const warpX =
          (valueNoise2D(mixToUInt32(seed + 7919), baseX * warpFrequency, baseY * warpFrequency) * 2 - 1) *
          warpStrength;
        const warpY =
          (valueNoise2D(
            mixToUInt32(seed + 16127),
            (baseX + 13.87) * warpFrequency,
            (baseY - 9.11) * warpFrequency,
          ) *
            2 -
            1) *
          warpStrength;
        sampleX += warpX;
        sampleY += warpY;
      }

      const macroValue = clamp(field.values[index], -1, 1);
      const macroNormalized = clamp((macroValue + 1) * 0.5, 0, 1);
      const landMask = smoothStep(inverseLerp(coastLevel, 1, macroNormalized));
      const shelfMask = smoothStep(inverseLerp(shelfLevel, 1, macroNormalized));
      const interiorMask = smoothStep(inverseLerp(interiorLevel, 1, macroNormalized));

      const baseFractal = fractalNoise(seed, sampleX, sampleY, settings);
      const ridgedFractal = (1 - Math.abs(baseFractal)) * 2 - 1;
      let ruggedness = baseFractal;

      if (settings.generator === "ridged-multifractal") {
        ruggedness = ridgedFractal;
      } else if (settings.generator === "custom") {
        ruggedness = baseFractal * 0.58 + ridgedFractal * 0.42;
      } else if (settings.generator === "none") {
        ruggedness = 0;
      }

      const detailScale = (0.09 + settings.amplitude * 0.18) * (0.26 + shelfMask * 0.74);
      const detailContribution = ruggedness * detailScale;
      const mountainFrequency = Math.max(0.15, settings.frequency * 4.4);
      const mountainNoise =
        valueNoise2D(
          mixToUInt32(seed + 74273),
          sampleX * mountainFrequency + 12.31,
          sampleY * mountainFrequency - 9.41,
        ) *
          2 -
        1;
      const mountainMask = interiorMask * Math.pow(clamp((mountainNoise + 1) * 0.5, 0, 1), 2.2);
      const mountainScale =
        settings.generator === "none"
          ? 0
          : (0.1 + settings.amplitude * 0.16) * (0.56 + strength * 0.44);
      const mountainContribution = mountainMask * mountainScale;
      const coastalErosion = (1 - landMask) * (0.02 + (1 - strength) * 0.05);

      field.values[index] = clamp(
        macroValue + detailContribution + mountainContribution - coastalErosion,
        -1,
        1,
      );
    }
  }

  const targetLandPercent = lerp(0.3, 0.56, strength);
  rebalanceFieldToTargetLandCoverage(field.values, targetLandPercent);
};

const enforceHorizontalWrapContinuity = (field: TerrainField): void => {
  if (field.width <= 1 || field.height <= 0) {
    return;
  }

  const seamBandWidth = clamp(
    Math.round(field.width * HORIZONTAL_SEAM_BLEND_FRACTION),
    1,
    Math.max(1, Math.floor(field.width * 0.5)),
  );
  const seamBandDenominator = Math.max(1, seamBandWidth - 1);

  for (let y = 0; y < field.height; y += 1) {
    const rowOffset = y * field.width;

    for (let offset = 0; offset < seamBandWidth; offset += 1) {
      const leftIndex = rowOffset + offset;
      const rightIndex = rowOffset + (field.width - 1 - offset);
      const blendWeight = 1 - smoothStep(offset / seamBandDenominator);
      const leftValue = field.values[leftIndex];
      const rightValue = field.values[rightIndex];
      const seamAverage = (leftValue + rightValue) * 0.5;

      field.values[leftIndex] = clamp(lerp(leftValue, seamAverage, blendWeight), -1, 1);
      field.values[rightIndex] = clamp(lerp(rightValue, seamAverage, blendWeight), -1, 1);
    }

    const leftEdgeIndex = rowOffset;
    const rightEdgeIndex = rowOffset + field.width - 1;
    const seamValue = clamp((field.values[leftEdgeIndex] + field.values[rightEdgeIndex]) * 0.5, -1, 1);
    field.values[leftEdgeIndex] = seamValue;
    field.values[rightEdgeIndex] = seamValue;
  }
};

const generateTerrainField = (
  sampleWidth: number,
  sampleHeight: number,
  settings: TerrainGenerationSettings,
): TerrainField => {
  const baseField = buildContinentalBaseField(sampleWidth, sampleHeight, settings);
  applyDetailNoise(baseField, settings);
  enforceHorizontalWrapContinuity(baseField);
  return baseField;
};

const buildTerrainChunk = (
  chunkKey: TerrainChunkKey,
  chunkX: number,
  chunkY: number,
  startSampleX: number,
  startSampleY: number,
  widthSamples: number,
  heightSamples: number,
  field: TerrainField,
  createdAt: string,
): TerrainChunk => {
  const samples = new Array<number>(widthSamples * heightSamples);
  let sampleIndex = 0;

  for (let localY = 0; localY < heightSamples; localY += 1) {
    const globalY = startSampleY + localY;

    for (let localX = 0; localX < widthSamples; localX += 1) {
      const globalX = startSampleX + localX;
      const sourceIndex = globalY * field.width + globalX;
      samples[sampleIndex] = clamp(field.values[sourceIndex] ?? 0, -1, 1);
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
      notes: "Generated by deterministic seeded continental terrain engine.",
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
  const field = generateTerrainField(sampleWidth, sampleHeight, settings);

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
        field,
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

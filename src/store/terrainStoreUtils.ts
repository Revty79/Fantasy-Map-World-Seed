import type { EditorSessionState, MapDocument, TerrainGenerationSettings, TerrainSculptTool } from "../types";

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
};

const TERRAIN_SCULPT_TOOLS = new Set<TerrainSculptTool>(["raise", "lower", "smooth", "flatten"]);

export const createDefaultTerrainBrushSettings = (): EditorSessionState["activeTerrainBrush"] => {
  return {
    tool: "raise",
    size: 96,
    strength: 0.35,
    hardness: 0.45,
    flattenTarget: 0,
  };
};

export const clampTerrainSeaLevel = (seaLevel: number): number => {
  if (!Number.isFinite(seaLevel)) {
    return 0;
  }

  return clamp(seaLevel, -1, 1);
};

const normalizeTerrainSeed = (seed: number): number => {
  if (!Number.isFinite(seed)) {
    return 0;
  }

  return Math.trunc(seed) >>> 0;
};

export const normalizeTerrainGenerationSettingValue = <K extends keyof TerrainGenerationSettings>(
  key: K,
  value: TerrainGenerationSettings[K],
): TerrainGenerationSettings[K] => {
  if (key === "generator") {
    if (
      value === "none" ||
      value === "fbm-simplex" ||
      value === "fbm-perlin" ||
      value === "ridged-multifractal" ||
      value === "custom"
    ) {
      return value;
    }

    return "fbm-simplex" as TerrainGenerationSettings[K];
  }

  if (typeof value !== "number") {
    return value;
  }

  if (!Number.isFinite(value)) {
    return value;
  }

  switch (key) {
    case "seed":
      return normalizeTerrainSeed(value) as TerrainGenerationSettings[K];
    case "octaves":
      return clamp(Math.round(value), 1, 12) as TerrainGenerationSettings[K];
    case "frequency":
      return clamp(value, 0.0001, 100) as TerrainGenerationSettings[K];
    case "lacunarity":
      return clamp(value, 0.1, 10) as TerrainGenerationSettings[K];
    case "persistence":
      return clamp(value, 0, 1) as TerrainGenerationSettings[K];
    case "amplitude":
      return clamp(value, 0, 4) as TerrainGenerationSettings[K];
    case "warp":
      return clamp(value, 0, 10) as TerrainGenerationSettings[K];
    case "continentFrequency":
      return clamp(value, 0.01, 10) as TerrainGenerationSettings[K];
    case "continentStrength":
      return clamp(value, 0, 1) as TerrainGenerationSettings[K];
    case "offsetX":
    case "offsetY":
      return value as TerrainGenerationSettings[K];
    default:
      return value;
  }
};

export const normalizeTerrainDisplaySettingValue = <K extends keyof MapDocument["terrain"]["display"]>(
  key: K,
  value: MapDocument["terrain"]["display"][K],
): MapDocument["terrain"]["display"][K] => {
  if (key === "renderMode") {
    if (
      value === "hypsometric" ||
      value === "grayscale" ||
      value === "shaded-relief" ||
      value === "land-water" ||
      value === "contour-preview"
    ) {
      return value;
    }

    return "hypsometric" as MapDocument["terrain"]["display"][K];
  }

  if (key === "showContours" || key === "showDerivedCoastline" || key === "showLandWaterOverlay") {
    return Boolean(value) as MapDocument["terrain"]["display"][K];
  }

  if (key === "paletteKey") {
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }

    return "terrain-basic" as MapDocument["terrain"]["display"][K];
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return value;
  }

  switch (key) {
    case "verticalExaggeration":
      return clamp(value, 0.1, 10) as MapDocument["terrain"]["display"][K];
    case "hillshadeStrength":
      return clamp(value, 0, 2) as MapDocument["terrain"]["display"][K];
    case "contourInterval":
      return clamp(value, 0.005, 1) as MapDocument["terrain"]["display"][K];
    default:
      return value;
  }
};

export const normalizeTerrainBrushSettingValue = <K extends keyof EditorSessionState["activeTerrainBrush"]>(
  key: K,
  value: EditorSessionState["activeTerrainBrush"][K],
): EditorSessionState["activeTerrainBrush"][K] => {
  if (key === "tool") {
    if (typeof value === "string" && TERRAIN_SCULPT_TOOLS.has(value as TerrainSculptTool)) {
      return value;
    }

    return "raise" as EditorSessionState["activeTerrainBrush"][K];
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return value;
  }

  switch (key) {
    case "size":
      return clamp(value, 1, 4096) as EditorSessionState["activeTerrainBrush"][K];
    case "strength":
      return clamp(value, 0.01, 1) as EditorSessionState["activeTerrainBrush"][K];
    case "hardness":
      return clamp(value, 0, 1) as EditorSessionState["activeTerrainBrush"][K];
    case "flattenTarget":
      return clamp(value, -1, 1) as EditorSessionState["activeTerrainBrush"][K];
    default:
      return value;
  }
};

export const invalidateTerrainDerivedCache = (
  derived: MapDocument["terrain"]["derived"],
): MapDocument["terrain"]["derived"] => {
  return {
    ...derived,
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

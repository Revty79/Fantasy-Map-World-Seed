import type { DocumentRect, MapDocument, MapLayerDocument } from "../../types";
import { renderMapToCanvas } from "../export/rasterExporter";

const DEFAULT_MAX_GLOBE_TEXTURE_DIMENSION = 4096;

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

const lerp = (from: number, to: number, t: number): number => {
  return from + (to - from) * t;
};

const smoothStep = (value: number): number => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

const enforceHorizontalWrapContinuity = (canvas: HTMLCanvasElement): void => {
  const context = canvas.getContext("2d");
  if (!context || canvas.width <= 1 || canvas.height <= 0) {
    return;
  }

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;
  const seamBandWidth = clamp(Math.round(canvas.width * 0.015), 1, Math.max(1, Math.floor(canvas.width * 0.5)));
  const seamBandDenominator = Math.max(1, seamBandWidth - 1);

  for (let y = 0; y < canvas.height; y += 1) {
    const rowOffset = y * canvas.width;

    for (let offset = 0; offset < seamBandWidth; offset += 1) {
      const leftPixelOffset = (rowOffset + offset) * 4;
      const rightPixelOffset = (rowOffset + (canvas.width - 1 - offset)) * 4;
      const blendWeight = 1 - smoothStep(offset / seamBandDenominator);

      for (let channel = 0; channel < 4; channel += 1) {
        const left = data[leftPixelOffset + channel] ?? 0;
        const right = data[rightPixelOffset + channel] ?? 0;
        const seamAverage = (left + right) * 0.5;
        data[leftPixelOffset + channel] = Math.round(lerp(left, seamAverage, blendWeight));
        data[rightPixelOffset + channel] = Math.round(lerp(right, seamAverage, blendWeight));
      }
    }

    const leftEdgePixelOffset = rowOffset * 4;
    const rightEdgePixelOffset = (rowOffset + canvas.width - 1) * 4;

    for (let channel = 0; channel < 4; channel += 1) {
      const seamValue = Math.round(
        ((data[leftEdgePixelOffset + channel] ?? 0) + (data[rightEdgePixelOffset + channel] ?? 0)) * 0.5,
      );
      data[leftEdgePixelOffset + channel] = seamValue;
      data[rightEdgePixelOffset + channel] = seamValue;
    }
  }

  context.putImageData(imageData, 0, 0);
};

const normalizeExtent = (extent: DocumentRect, map: MapDocument): DocumentRect => {
  const x = clamp(extent.x, 0, map.dimensions.width);
  const y = clamp(extent.y, 0, map.dimensions.height);
  const right = clamp(extent.x + extent.width, 0, map.dimensions.width);
  const bottom = clamp(extent.y + extent.height, 0, map.dimensions.height);

  return {
    x,
    y,
    width: Math.max(0, right - x),
    height: Math.max(0, bottom - y),
  };
};

const computeGlobeTextureSize = (
  mapWidth: number,
  mapHeight: number,
  maxDimension: number,
): { width: number; height: number; warnings: string[] } => {
  const warnings: string[] = [];
  const safeWidth = Math.max(1, mapWidth);
  const safeHeight = Math.max(1, mapHeight);
  const limit = Math.max(512, Math.round(maxDimension));
  const scale = Math.min(1, limit / safeWidth, limit / safeHeight);
  const width = Math.max(1, Math.round(safeWidth * scale));
  const height = Math.max(1, Math.round(safeHeight * scale));

  if (scale < 1) {
    warnings.push(
      `World texture was downscaled from ${safeWidth}x${safeHeight} to ${width}x${height} for smooth preview performance.`,
    );
  }

  return {
    width,
    height,
    warnings,
  };
};

const drawExtentOverlay = (
  canvas: HTMLCanvasElement,
  map: MapDocument,
  highlightExtent: DocumentRect,
): void => {
  const normalizedExtent = normalizeExtent(highlightExtent, map);
  if (normalizedExtent.width <= 0 || normalizedExtent.height <= 0) {
    return;
  }

  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const scaleX = canvas.width / Math.max(1, map.dimensions.width);
  const scaleY = canvas.height / Math.max(1, map.dimensions.height);
  const x = normalizedExtent.x * scaleX;
  const y = normalizedExtent.y * scaleY;
  const width = normalizedExtent.width * scaleX;
  const height = normalizedExtent.height * scaleY;

  context.save();
  context.globalAlpha = 0.28;
  context.fillStyle = "#f7c86c";
  context.fillRect(x, y, width, height);
  context.globalAlpha = 0.95;
  context.strokeStyle = "#ffe8b0";
  context.lineWidth = 2;
  context.setLineDash([8, 6]);
  context.strokeRect(x + 0.5, y + 0.5, Math.max(1, width - 1), Math.max(1, height - 1));
  context.restore();
};

const buildEmergencyTextureCanvas = (width: number, height: number): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const context = canvas.getContext("2d");
  if (!context) {
    return canvas;
  }

  context.fillStyle = "#121b2d";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#365a92");
  gradient.addColorStop(1, "#1e365a");
  context.globalAlpha = 0.9;
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.globalAlpha = 1;
  context.strokeStyle = "rgba(229, 236, 252, 0.36)";
  context.lineWidth = 2;
  context.strokeRect(1, 1, Math.max(1, canvas.width - 2), Math.max(1, canvas.height - 2));
  context.fillStyle = "#e3ecff";
  context.font = `600 ${Math.max(14, Math.round(canvas.height * 0.035))}px "Segoe UI", sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("Preview Texture Fallback", canvas.width / 2, canvas.height / 2);
  return canvas;
};

export interface BuildGlobeTextureInput {
  map: MapDocument;
  layers: MapLayerDocument[];
  maxTextureDimension?: number;
  highlightExtent?: DocumentRect | null;
  terrainRenderModeOverride?: MapDocument["terrain"]["display"]["renderMode"] | null;
}

export interface BuildGlobeTextureResult {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  warnings: string[];
}

const resolveGlobeTerrainSourceMap = (
  map: MapDocument,
  terrainRenderModeOverride: BuildGlobeTextureInput["terrainRenderModeOverride"],
): MapDocument => {
  if (!terrainRenderModeOverride || map.terrain.display.renderMode === terrainRenderModeOverride) {
    return map;
  }

  return {
    ...map,
    terrain: {
      ...map.terrain,
      display: {
        ...map.terrain.display,
        renderMode: terrainRenderModeOverride,
      },
    },
  };
};

export const buildGlobeTextureCanvas = (
  input: BuildGlobeTextureInput,
): BuildGlobeTextureResult => {
  const sourceMap = resolveGlobeTerrainSourceMap(input.map, input.terrainRenderModeOverride ?? null);
  const output = computeGlobeTextureSize(
    sourceMap.dimensions.width,
    sourceMap.dimensions.height,
    input.maxTextureDimension ?? DEFAULT_MAX_GLOBE_TEXTURE_DIMENSION,
  );

  const warnings = [...output.warnings];
  const sourceExtent = {
    x: 0,
    y: 0,
    width: sourceMap.dimensions.width,
    height: sourceMap.dimensions.height,
  };

  const renderTextureFromMap = (map: MapDocument): HTMLCanvasElement =>
    renderMapToCanvas({
      map,
      layers: input.layers,
      sourceExtent,
      outputWidth: output.width,
      outputHeight: output.height,
      transparentBackground: false,
    });

  let canvas: HTMLCanvasElement;

  try {
    canvas = renderTextureFromMap(sourceMap);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    warnings.push(`Terrain-aware globe texture build failed (${message}). Fallback texture was used.`);

    const fallbackMap: MapDocument = {
      ...sourceMap,
      terrain: {
        ...sourceMap.terrain,
        storage: {
          ...sourceMap.terrain.storage,
          chunks: {},
        },
      },
    };

    try {
      canvas = renderTextureFromMap(fallbackMap);
    } catch (fallbackError) {
      const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
      warnings.push(
        `Fallback globe texture build also failed (${fallbackMessage}). An emergency placeholder texture was used.`,
      );
      canvas = buildEmergencyTextureCanvas(output.width, output.height);
    }
  }

  if (sourceMap.projection.wrapsHorizontally) {
    enforceHorizontalWrapContinuity(canvas);
  }

  if (input.highlightExtent) {
    drawExtentOverlay(canvas, sourceMap, input.highlightExtent);
  }

  return {
    canvas,
    width: output.width,
    height: output.height,
    warnings,
  };
};

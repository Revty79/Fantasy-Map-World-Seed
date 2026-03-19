import type { DocumentRect, MapDocument, MapLayerDocument } from "../../types";
import { renderMapToCanvas } from "../export/rasterExporter";

const DEFAULT_MAX_GLOBE_TEXTURE_DIMENSION = 4096;

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
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

export interface BuildGlobeTextureInput {
  map: MapDocument;
  layers: MapLayerDocument[];
  maxTextureDimension?: number;
  highlightExtent?: DocumentRect | null;
}

export interface BuildGlobeTextureResult {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  warnings: string[];
}

export const buildGlobeTextureCanvas = (
  input: BuildGlobeTextureInput,
): BuildGlobeTextureResult => {
  const output = computeGlobeTextureSize(
    input.map.dimensions.width,
    input.map.dimensions.height,
    input.maxTextureDimension ?? DEFAULT_MAX_GLOBE_TEXTURE_DIMENSION,
  );

  const canvas = renderMapToCanvas({
    map: input.map,
    layers: input.layers,
    sourceExtent: {
      x: 0,
      y: 0,
      width: input.map.dimensions.width,
      height: input.map.dimensions.height,
    },
    outputWidth: output.width,
    outputHeight: output.height,
    transparentBackground: false,
  });

  if (input.highlightExtent) {
    drawExtentOverlay(canvas, input.map, input.highlightExtent);
  }

  return {
    canvas,
    width: output.width,
    height: output.height,
    warnings: output.warnings,
  };
};


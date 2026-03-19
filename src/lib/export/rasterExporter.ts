import type {
  DataOverlayLayerDocument,
  LabelLayerDocument,
  MapDocument,
  MapLayerDocument,
  PaintLayerDocument,
  SymbolLayerDocument,
  VectorFeature,
  VectorLayerDocument,
} from "../../types";
import { computeExportSourceExtent, computeRasterOutputSize } from "./geometry";
import type { ExportArea, ExportExtent } from "./types";
import { buildTerrainPreviewCanvas } from "../terrain";

const MASK_OCEAN_COLOR = "#4c78c6";
const MASK_LAND_COLOR = "#73b486";
const SYMBOL_CATEGORY_COLORS: Record<string, string> = {
  mountains: "#8b7355",
  forests: "#228b22",
  settlements: "#ffa500",
  fortifications: "#696969",
  ruins: "#a9a9a9",
  ports: "#4169e1",
  landmarks: "#daa520",
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

const toRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

const applyWorldTransform = (
  context: CanvasRenderingContext2D,
  sourceExtent: ExportExtent,
  outputWidth: number,
  outputHeight: number,
) => {
  const scaleX = outputWidth / sourceExtent.width;
  const scaleY = outputHeight / sourceExtent.height;
  context.setTransform(
    scaleX,
    0,
    0,
    scaleY,
    -sourceExtent.x * scaleX,
    -sourceExtent.y * scaleY,
  );
};

const drawVectorFeature = (
  context: CanvasRenderingContext2D,
  feature: VectorFeature,
  layerAlpha: number,
) => {
  if (feature.points.length < 2) {
    return;
  }

  context.beginPath();
  context.moveTo(feature.points[0].x, feature.points[0].y);
  for (let index = 1; index < feature.points.length; index += 1) {
    context.lineTo(feature.points[index].x, feature.points[index].y);
  }

  if (feature.closed) {
    context.closePath();
  }

  if (feature.closed && feature.style.fillColor) {
    context.globalAlpha = layerAlpha * clamp(feature.style.fillOpacity ?? 0.25, 0, 1);
    context.fillStyle = feature.style.fillColor;
    context.fill();
  }

  context.globalAlpha = layerAlpha * clamp(feature.style.strokeOpacity, 0, 1);
  context.strokeStyle = feature.style.strokeColor;
  context.lineWidth = Math.max(0.5, feature.style.strokeWidth);
  context.lineJoin = feature.style.lineJoin ?? "round";
  context.lineCap = "round";
  if (feature.style.dashed) {
    context.setLineDash([8, 5]);
  } else {
    context.setLineDash([]);
  }
  context.stroke();
  context.setLineDash([]);
  context.globalAlpha = layerAlpha;
};

const drawVectorLayer = (
  context: CanvasRenderingContext2D,
  layer: VectorLayerDocument,
  layerAlpha: number,
) => {
  for (const featureId of layer.featureOrder) {
    const feature = layer.features[featureId];
    if (!feature) {
      continue;
    }
    drawVectorFeature(context, feature, layerAlpha);
  }
};

const cellColorForLayer = (
  layer: PaintLayerDocument | DataOverlayLayerDocument,
  sample: { color: string; value: number; category?: string },
): string => {
  if (layer.kind === "mask") {
    return sample.category === "ocean" || sample.value === 0
      ? MASK_OCEAN_COLOR
      : MASK_LAND_COLOR;
  }

  if (layer.kind === "dataOverlay" && sample.category && layer.settings.legend[sample.category]) {
    return layer.settings.legend[sample.category];
  }

  return sample.color;
};

const drawPaintLayer = (
  context: CanvasRenderingContext2D,
  layer: PaintLayerDocument | DataOverlayLayerDocument,
  layerAlpha: number,
) => {
  for (const chunk of Object.values(layer.chunks)) {
    for (const cell of Object.values(chunk.cells)) {
      const worldX = chunk.chunkX * layer.chunkSize + cell.x * layer.cellSize;
      const worldY = chunk.chunkY * layer.chunkSize + cell.y * layer.cellSize;
      context.globalAlpha = layerAlpha * clamp(cell.sample.opacity, 0, 1);
      context.fillStyle = cellColorForLayer(layer, {
        color: cell.sample.color,
        value: cell.sample.value,
        category: cell.sample.category,
      });
      context.fillRect(worldX, worldY, layer.cellSize, layer.cellSize);
    }
  }
  context.globalAlpha = layerAlpha;
};

const drawSymbolLayer = (
  context: CanvasRenderingContext2D,
  layer: SymbolLayerDocument,
  layerAlpha: number,
) => {
  for (const symbolId of layer.symbolOrder) {
    const symbol = layer.symbols[symbolId];

    if (!symbol) {
      continue;
    }

    const color = symbol.tint && symbol.tint !== "#ffffff"
      ? symbol.tint
      : SYMBOL_CATEGORY_COLORS[symbol.category] ?? "#808080";
    const radius = 12 * Math.max(0.1, symbol.scale);
    const text = symbol.symbolKey.charAt(0).toUpperCase();

    context.save();
    context.translate(symbol.position.x, symbol.position.y);
    context.rotate(toRadians(symbol.rotationDegrees));

    context.globalAlpha = layerAlpha * clamp(symbol.opacity, 0, 1);
    context.fillStyle = color;
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fill();

    context.globalAlpha = layerAlpha * clamp(symbol.opacity * 0.8, 0, 1);
    context.strokeStyle = "#ffffff";
    context.lineWidth = 1;
    context.stroke();

    context.globalAlpha = layerAlpha * clamp(symbol.opacity, 0, 1);
    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `${Math.max(8, 12 * symbol.scale)}px "Segoe UI", sans-serif`;
    context.fillText(text, 0, 0);
    context.restore();
  }
};

const drawLabelLayer = (
  context: CanvasRenderingContext2D,
  layer: LabelLayerDocument,
  layerAlpha: number,
) => {
  for (const labelId of layer.labelOrder) {
    const label = layer.labels[labelId];

    if (!label) {
      continue;
    }

    const fontSize = Math.max(8, label.style.fontSize);
    const lineHeight = fontSize * 1.2;
    const textWidth = Math.max(1, label.text.length * fontSize * 0.55);
    const offsetX = -textWidth * clamp(label.anchorX, 0, 1);
    const offsetY = -lineHeight * clamp(label.anchorY, 0, 1);

    context.save();
    context.translate(label.position.x, label.position.y);
    context.rotate(toRadians(label.rotationDegrees));
    context.globalAlpha = layerAlpha * clamp(label.style.opacity, 0, 1);
    context.fillStyle = label.style.color;
    context.textAlign = "left";
    context.textBaseline = "top";
    context.font = `${Math.max(100, label.style.fontWeight)} ${fontSize}px "${label.style.fontFamily}", serif`;
    context.fillText(label.text, offsetX, offsetY);
    context.restore();
  }
};

const drawLayer = (context: CanvasRenderingContext2D, layer: MapLayerDocument) => {
  if (!layer.visible) {
    return;
  }

  const layerAlpha = clamp(layer.opacity, 0, 1);
  context.save();
  context.globalAlpha = layerAlpha;

  if (layer.kind === "vector") {
    drawVectorLayer(context, layer, layerAlpha);
  } else if (layer.kind === "paint" || layer.kind === "mask" || layer.kind === "dataOverlay") {
    drawPaintLayer(context, layer, layerAlpha);
  } else if (layer.kind === "symbol") {
    drawSymbolLayer(context, layer, layerAlpha);
  } else if (layer.kind === "label") {
    drawLabelLayer(context, layer, layerAlpha);
  }

  context.restore();
};

const drawTerrainBase = (context: CanvasRenderingContext2D, map: MapDocument) => {
  if (Object.keys(map.terrain.storage.chunks).length <= 0) {
    return;
  }

  const terrainCanvas = buildTerrainPreviewCanvas(map.terrain);
  context.save();
  context.globalAlpha = 0.96;
  context.imageSmoothingEnabled = true;
  context.drawImage(terrainCanvas, 0, 0, Math.max(1, map.dimensions.width), Math.max(1, map.dimensions.height));
  context.restore();
};

interface RasterExportInput {
  map: MapDocument;
  layers: MapLayerDocument[];
  view: {
    cameraX: number;
    cameraY: number;
    zoom: number;
    viewportWidth: number;
    viewportHeight: number;
  };
  area: ExportArea;
  scaleMultiplier: number;
  transparentBackground: boolean;
}

export interface RasterCanvasRenderInput {
  map: MapDocument;
  layers: MapLayerDocument[];
  sourceExtent: ExportExtent;
  outputWidth: number;
  outputHeight: number;
  transparentBackground: boolean;
}

export interface RasterExportResult {
  dataUrl: string;
  outputWidth: number;
  outputHeight: number;
  sourceExtent: ExportExtent;
  warnings: string[];
}

export const renderMapToCanvas = (input: RasterCanvasRenderInput): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(input.outputWidth));
  canvas.height = Math.max(1, Math.round(input.outputHeight));

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to create a canvas rendering context for map rendering.");
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  if (!input.transparentBackground) {
    context.fillStyle = input.map.settings.backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  context.save();
  applyWorldTransform(context, input.sourceExtent, canvas.width, canvas.height);
  drawTerrainBase(context, input.map);
  for (const layer of input.layers) {
    drawLayer(context, layer);
  }
  context.restore();

  return canvas;
};

export const exportMapToPngDataUrl = (input: RasterExportInput): RasterExportResult => {
  const sourceExtent = computeExportSourceExtent(input.map, input.view, input.area);
  const outputSize = computeRasterOutputSize(sourceExtent, input.scaleMultiplier);
  const canvas = renderMapToCanvas({
    map: input.map,
    layers: input.layers,
    sourceExtent,
    outputWidth: outputSize.width,
    outputHeight: outputSize.height,
    transparentBackground: input.transparentBackground,
  });

  return {
    dataUrl: canvas.toDataURL("image/png"),
    outputWidth: canvas.width,
    outputHeight: canvas.height,
    sourceExtent,
    warnings: outputSize.warnings,
  };
};

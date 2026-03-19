import type { EditorViewState, MapDocument } from "../../types";
import type { ExportArea, ExportExtent, ExportOutputSize } from "./types";

const MAX_EXPORT_DIMENSION = 16384;

type ExportView = Pick<EditorViewState, "cameraX" | "cameraY" | "zoom" | "viewportWidth" | "viewportHeight">;

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

const normalizeExtent = (extent: ExportExtent): ExportExtent => {
  return {
    x: extent.x,
    y: extent.y,
    width: Math.max(1, extent.width),
    height: Math.max(1, extent.height),
  };
};

export const computeExportSourceExtent = (
  map: MapDocument,
  view: ExportView,
  area: ExportArea,
): ExportExtent => {
  if (area === "full-map") {
    return normalizeExtent({
      x: 0,
      y: 0,
      width: map.dimensions.width,
      height: map.dimensions.height,
    });
  }

  const halfWidth = view.viewportWidth / Math.max(0.0001, view.zoom) / 2;
  const halfHeight = view.viewportHeight / Math.max(0.0001, view.zoom) / 2;
  const left = clamp(view.cameraX - halfWidth, 0, map.dimensions.width);
  const right = clamp(view.cameraX + halfWidth, 0, map.dimensions.width);
  const top = clamp(view.cameraY - halfHeight, 0, map.dimensions.height);
  const bottom = clamp(view.cameraY + halfHeight, 0, map.dimensions.height);

  return normalizeExtent({
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  });
};

export const computeRasterOutputSize = (extent: ExportExtent, scaleMultiplier: number): ExportOutputSize => {
  const warnings: string[] = [];
  const safeScale = Number.isFinite(scaleMultiplier) && scaleMultiplier > 0 ? scaleMultiplier : 1;

  const rawWidth = Math.max(1, Math.round(extent.width * safeScale));
  const rawHeight = Math.max(1, Math.round(extent.height * safeScale));

  let width = rawWidth;
  let height = rawHeight;

  if (width > MAX_EXPORT_DIMENSION || height > MAX_EXPORT_DIMENSION) {
    const factor = Math.min(MAX_EXPORT_DIMENSION / width, MAX_EXPORT_DIMENSION / height);
    width = Math.max(1, Math.floor(width * factor));
    height = Math.max(1, Math.floor(height * factor));
    warnings.push(
      `Raster export exceeded ${MAX_EXPORT_DIMENSION}px max dimension and was clamped to ${width}x${height}.`,
    );
  }

  return {
    width,
    height,
    warnings,
  };
};

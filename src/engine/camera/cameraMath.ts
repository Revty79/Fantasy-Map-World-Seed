import type { DocumentPoint } from "../../types";

export interface CameraView {
  cameraX: number;
  cameraY: number;
  zoom: number;
  viewportWidth: number;
  viewportHeight: number;
}

export interface ViewRect {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export const worldToScreen = (point: DocumentPoint, view: CameraView): DocumentPoint => {
  return {
    x: (point.x - view.cameraX) * view.zoom + view.viewportWidth / 2,
    y: (point.y - view.cameraY) * view.zoom + view.viewportHeight / 2,
  };
};

export const screenToWorld = (point: DocumentPoint, view: CameraView): DocumentPoint => {
  return {
    x: (point.x - view.viewportWidth / 2) / view.zoom + view.cameraX,
    y: (point.y - view.viewportHeight / 2) / view.zoom + view.cameraY,
  };
};

export const getVisibleWorldRect = (view: CameraView): ViewRect => {
  const topLeft = screenToWorld({ x: 0, y: 0 }, view);
  const bottomRight = screenToWorld({ x: view.viewportWidth, y: view.viewportHeight }, view);

  return {
    minX: Math.min(topLeft.x, bottomRight.x),
    minY: Math.min(topLeft.y, bottomRight.y),
    maxX: Math.max(topLeft.x, bottomRight.x),
    maxY: Math.max(topLeft.y, bottomRight.y),
  };
};

export const zoomAtScreenPoint = (
  view: CameraView,
  screenPoint: DocumentPoint,
  nextZoom: number,
): CameraView => {
  const worldBefore = screenToWorld(screenPoint, view);

  return {
    ...view,
    zoom: nextZoom,
    cameraX: worldBefore.x - (screenPoint.x - view.viewportWidth / 2) / nextZoom,
    cameraY: worldBefore.y - (screenPoint.y - view.viewportHeight / 2) / nextZoom,
  };
};

export const fitBounds = (
  boundsWidth: number,
  boundsHeight: number,
  viewWidth: number,
  viewHeight: number,
  zoomMin = 0.08,
  zoomMax = 32,
): CameraView => {
  const zoom = Math.max(
    zoomMin,
    Math.min(zoomMax, Math.min(viewWidth / boundsWidth, viewHeight / boundsHeight) * 0.9),
  );

  return {
    cameraX: boundsWidth / 2,
    cameraY: boundsHeight / 2,
    zoom,
    viewportWidth: viewWidth,
    viewportHeight: viewHeight,
  };
};

import type { Bounds2D, DocumentPoint, VectorFeature } from "../../types";

export const distanceSquared = (a: DocumentPoint, b: DocumentPoint): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
};

export const distancePointToSegment = (
  point: DocumentPoint,
  segmentStart: DocumentPoint,
  segmentEnd: DocumentPoint,
): number => {
  const dx = segmentEnd.x - segmentStart.x;
  const dy = segmentEnd.y - segmentStart.y;

  if (dx === 0 && dy === 0) {
    return Math.sqrt(distanceSquared(point, segmentStart));
  }

  const t = ((point.x - segmentStart.x) * dx + (point.y - segmentStart.y) * dy) / (dx * dx + dy * dy);
  const clamped = Math.max(0, Math.min(1, t));

  const closest = {
    x: segmentStart.x + clamped * dx,
    y: segmentStart.y + clamped * dy,
  };

  return Math.sqrt(distanceSquared(point, closest));
};

export const isPointInsidePolygon = (point: DocumentPoint, polygonPoints: DocumentPoint[]): boolean => {
  let inside = false;

  for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
    const xi = polygonPoints[i].x;
    const yi = polygonPoints[i].y;
    const xj = polygonPoints[j].x;
    const yj = polygonPoints[j].y;

    const intersects =
      yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi + Number.EPSILON) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
};

export const getVectorFeatureBounds = (feature: VectorFeature): Bounds2D | null => {
  if (feature.points.length === 0) {
    return null;
  }

  let minX = feature.points[0].x;
  let minY = feature.points[0].y;
  let maxX = feature.points[0].x;
  let maxY = feature.points[0].y;

  for (const point of feature.points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
  };
};

export const hitTestVectorFeature = (
  feature: VectorFeature,
  point: DocumentPoint,
  tolerance: number,
): boolean => {
  if (feature.points.length < 2) {
    return false;
  }

  const points = feature.points;

  for (let index = 1; index < points.length; index += 1) {
    if (distancePointToSegment(point, points[index - 1], points[index]) <= tolerance) {
      return true;
    }
  }

  if (feature.closed && points.length >= 3) {
    if (distancePointToSegment(point, points[points.length - 1], points[0]) <= tolerance) {
      return true;
    }

    return isPointInsidePolygon(point, points);
  }

  return false;
};

export const hitTestVertex = (
  points: DocumentPoint[],
  point: DocumentPoint,
  tolerance: number,
): number | null => {
  const thresholdSquared = tolerance * tolerance;

  for (let index = 0; index < points.length; index += 1) {
    if (distanceSquared(points[index], point) <= thresholdSquared) {
      return index;
    }
  }

  return null;
};

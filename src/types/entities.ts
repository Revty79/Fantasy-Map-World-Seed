import type { Bounds2D, DocumentEntityMeta, DocumentId, DocumentPoint } from "./common";

export type VectorFeatureId = DocumentId;
export type SymbolInstanceId = DocumentId;
export type LabelAnnotationId = DocumentId;

export type VectorFeatureCategory =
  | "coastline"
  | "river"
  | "border"
  | "road"
  | "path"
  | "polygon";

export type VectorGeometryType = "polyline" | "polygon";

export interface VectorFeatureStyle {
  strokeColor: string;
  strokeWidth: number;
  strokeOpacity: number;
  fillColor?: string;
  fillOpacity?: number;
  dashed?: boolean;
  lineJoin?: "miter" | "round" | "bevel";
}

export interface VectorFeature {
  id: VectorFeatureId;
  name: string;
  category: VectorFeatureCategory;
  geometryType: VectorGeometryType;
  points: DocumentPoint[];
  closed: boolean;
  style: VectorFeatureStyle;
  bounds?: Bounds2D;
  meta: DocumentEntityMeta;
}

export type PaintMode = "paint" | "mask" | "biome" | "weather" | "data";

export interface PaintSample {
  color: string;
  opacity: number;
  value: number;
  category?: string;
}

export interface PaintChunkCell {
  x: number;
  y: number;
  sample: PaintSample;
}

export type PaintChunkKey = `${number}:${number}`;

export interface PaintChunk {
  key: PaintChunkKey;
  chunkX: number;
  chunkY: number;
  widthCells: number;
  heightCells: number;
  cellSize: number;
  cells: Record<string, PaintChunkCell>;
  meta: DocumentEntityMeta;
}

export interface SymbolInstance {
  id: SymbolInstanceId;
  name: string;
  symbolKey: string;
  assetId: string | null;
  category: string;
  position: DocumentPoint;
  rotationDegrees: number;
  scale: number;
  tint: string;
  opacity: number;
  meta: DocumentEntityMeta;
}

export type LabelCategory =
  | "world"
  | "ocean"
  | "region"
  | "settlement"
  | "landmark"
  | "annotation";

export interface LabelStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  opacity: number;
  align: "left" | "center" | "right";
}

export interface LabelAnnotation {
  id: LabelAnnotationId;
  text: string;
  category: LabelCategory;
  position: DocumentPoint;
  rotationDegrees: number;
  anchorX: number;
  anchorY: number;
  style: LabelStyle;
  meta: DocumentEntityMeta;
}

export interface DataOverlaySettings {
  mode: "categorical" | "scalar";
  legend: Record<string, string>;
  minValue?: number;
  maxValue?: number;
}

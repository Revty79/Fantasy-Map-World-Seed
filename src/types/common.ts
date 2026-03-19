export type DocumentId = string;
export type TimestampIso = string;

export interface DocumentPoint {
  x: number;
  y: number;
}

export interface DocumentRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NormalizedRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DocumentEntityMeta {
  createdAt: TimestampIso;
  updatedAt: TimestampIso;
  tags?: string[];
  notes?: string;
}

export interface Bounds2D {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

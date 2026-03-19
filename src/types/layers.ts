import type { DocumentEntityMeta, DocumentId } from "./common";
import type {
  DataOverlaySettings,
  LabelAnnotation,
  PaintChunk,
  PaintMode,
  SymbolInstance,
  VectorFeature,
} from "./entities";

export type LayerId = DocumentId;

export type LayerKind =
  | "group"
  | "vector"
  | "paint"
  | "mask"
  | "symbol"
  | "label"
  | "dataOverlay"
  | "reference"
  | "elevation"
  | "annotation";

export interface BaseLayerDocument {
  id: LayerId;
  name: string;
  kind: LayerKind;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: "normal" | "multiply" | "overlay" | "screen";
  parentGroupId: LayerId | null;
  meta: DocumentEntityMeta;
}

export interface GroupLayerDocument extends BaseLayerDocument {
  kind: "group";
  childLayerIds: LayerId[];
}

export interface VectorLayerDocument extends BaseLayerDocument {
  kind: "vector";
  features: Record<string, VectorFeature>;
  featureOrder: string[];
}

export interface PaintLayerDocument extends BaseLayerDocument {
  kind: "paint" | "mask";
  paintMode: PaintMode;
  chunkSize: number;
  cellSize: number;
  chunks: Record<string, PaintChunk>;
  chunkRefs?: Record<string, string>;
}

export interface SymbolLayerDocument extends BaseLayerDocument {
  kind: "symbol";
  symbols: Record<string, SymbolInstance>;
  symbolOrder: string[];
}

export interface LabelLayerDocument extends BaseLayerDocument {
  kind: "label";
  labels: Record<string, LabelAnnotation>;
  labelOrder: string[];
}

export interface DataOverlayLayerDocument extends BaseLayerDocument {
  kind: "dataOverlay";
  paintMode: PaintMode;
  chunkSize: number;
  cellSize: number;
  settings: DataOverlaySettings;
  chunks: Record<string, PaintChunk>;
  chunkRefs?: Record<string, string>;
}

export interface ReferenceLayerDocument extends BaseLayerDocument {
  kind: "reference";
  assetId: string | null;
}

export interface ElevationLayerDocument extends BaseLayerDocument {
  kind: "elevation";
  method: "heightfield" | "contour";
}

export interface AnnotationLayerDocument extends BaseLayerDocument {
  kind: "annotation";
  notes: string[];
}

export type MapLayerDocument =
  | GroupLayerDocument
  | VectorLayerDocument
  | PaintLayerDocument
  | SymbolLayerDocument
  | LabelLayerDocument
  | DataOverlayLayerDocument
  | ReferenceLayerDocument
  | ElevationLayerDocument
  | AnnotationLayerDocument;

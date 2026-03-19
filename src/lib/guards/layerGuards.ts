import type {
  DataOverlayLayerDocument,
  GroupLayerDocument,
  LabelLayerDocument,
  LayerKind,
  MapLayerDocument,
  PaintLayerDocument,
  SymbolLayerDocument,
  VectorLayerDocument,
} from "../../types/layers";

const LAYER_KIND_SET = new Set<LayerKind>([
  "group",
  "vector",
  "paint",
  "mask",
  "symbol",
  "label",
  "dataOverlay",
  "reference",
  "elevation",
  "annotation",
]);

export const isLayerKind = (value: unknown): value is LayerKind => {
  return typeof value === "string" && LAYER_KIND_SET.has(value as LayerKind);
};

export const isGroupLayer = (layer: MapLayerDocument): layer is GroupLayerDocument => layer.kind === "group";

export const isVectorLayer = (layer: MapLayerDocument): layer is VectorLayerDocument => layer.kind === "vector";

export const isPaintLayer = (layer: MapLayerDocument): layer is PaintLayerDocument => {
  return layer.kind === "paint" || layer.kind === "mask";
};

export const isDataOverlayLayer = (layer: MapLayerDocument): layer is DataOverlayLayerDocument => {
  return layer.kind === "dataOverlay";
};

export const isSymbolLayer = (layer: MapLayerDocument): layer is SymbolLayerDocument => {
  return layer.kind === "symbol";
};

export const isLabelLayer = (layer: MapLayerDocument): layer is LabelLayerDocument => {
  return layer.kind === "label";
};

export const isLayerPaintCompatible = (
  layer: MapLayerDocument,
): layer is PaintLayerDocument | DataOverlayLayerDocument => {
  return layer.kind === "paint" || layer.kind === "mask" || layer.kind === "dataOverlay";
};

export const isLayerVectorCompatible = (layer: MapLayerDocument): boolean => {
  return layer.kind === "vector";
};

export const isLayerSymbolCompatible = (layer: MapLayerDocument): boolean => {
  return layer.kind === "symbol";
};

export const isLayerLabelCompatible = (layer: MapLayerDocument): boolean => {
  return layer.kind === "label";
};

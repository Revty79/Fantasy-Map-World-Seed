import type { EditorViewState, MapDocument, MapLayerDocument, WorldSeedProjectDocument } from "../../types";

export type ExportFormat = "png" | "svg" | "json";
export type ExportArea = "full-map" | "current-view";

export interface ExportRequest {
  format: ExportFormat;
  area: ExportArea;
  scaleMultiplier: number;
  transparentBackground: boolean;
}

export interface ExportSourceContext {
  document: WorldSeedProjectDocument;
  map: MapDocument;
  layers: MapLayerDocument[];
  view: EditorViewState;
  projectPath: string | null;
}

export interface ExportExtent {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ExportOutputSize {
  width: number;
  height: number;
  warnings: string[];
}

export interface ExportResult {
  format: ExportFormat;
  filePath: string;
  fileName: string;
  warnings: string[];
}


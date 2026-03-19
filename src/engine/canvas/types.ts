import type {
  ActiveTerrainBrushSettings,
  EditorToolId,
  InProgressDrawState,
  InProgressExtentState,
  MapDocument,
  MapLayerDocument,
  SelectionTarget,
} from "../../types";

export interface CanvasRenderInput {
  map: MapDocument;
  layers: MapLayerDocument[];
  activeTool: EditorToolId;
  selectedLayerId: string | null;
  selection: SelectionTarget;
  inProgressDraw: InProgressDrawState | null;
  inProgressExtent: InProgressExtentState | null;
  brush: {
    size: number;
    opacity: number;
    mode: "paint" | "erase";
    category: string;
    value: number;
    color: string;
  };
  terrainBrush: ActiveTerrainBrushSettings;
  view: {
    cameraX: number;
    cameraY: number;
    zoom: number;
    viewportWidth: number;
    viewportHeight: number;
    showGrid: boolean;
    showChunkOverlay: boolean;
  };
}

export interface CanvasRuntimeCallbacks {
  onViewChange: (nextView: CanvasRenderInput["view"]) => void;
  onPointerMove: (x: number | null, y: number | null) => void;
  onVisibleChunksChange: (count: number) => void;
}

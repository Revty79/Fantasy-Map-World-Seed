import type { DocumentId, DocumentPoint } from "./common";
import type { LabelCategory, LabelStyle } from "./entities";
import type { LayerId } from "./layers";
import type { MapId, MapScope } from "./maps";

export type { MapScope } from "./maps";

export type EditorToolId =
  | "select"
  | "pan"
  | "coastline"
  | "river"
  | "border"
  | "road"
  | "paint"
  | "erase"
  | "symbol"
  | "label"
  | "extent";

export type SidebarPanelId = "layers" | "inspector" | "toolSettings" | "maps";

export interface ProjectSessionMeta {
  id: string;
  name: string;
  path: string | null;
  dirty: boolean;
  status: "ready" | "needs-save" | "error";
  lastSavedAt: string | null;
}

export interface CanvasStatus {
  zoomPercent: number;
  pointerDocumentX: number | null;
  pointerDocumentY: number | null;
  visibleChunkCount: number;
}

export interface PanelState {
  collapsed: boolean;
  visible: boolean;
}

export type SelectionTarget =
  | { type: "none" }
  | { type: "layer"; layerId: LayerId }
  | { type: "vector"; layerId: LayerId; featureId: DocumentId }
  | { type: "vector-vertex"; layerId: LayerId; featureId: DocumentId; vertexIndex: number }
  | { type: "symbol"; layerId: LayerId; symbolId: DocumentId }
  | { type: "label"; layerId: LayerId; labelId: DocumentId }
  | { type: "map-extent"; linkId: DocumentId };

export interface EditorViewState {
  mapId: MapId;
  cameraX: number;
  cameraY: number;
  zoom: number;
  viewportWidth: number;
  viewportHeight: number;
  showGrid: boolean;
  showChunkOverlay: boolean;
}

export interface ActiveBrushSettings {
  size: number;
  opacity: number;
  hardness: number;
  mode: "paint" | "erase";
  category: string;
  value: number;
  color: string;
}

export interface ActiveVectorSettings {
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  closed: boolean;
  category: "coastline" | "river" | "border" | "road" | "path" | "polygon";
}

export interface ActiveSymbolSettings {
  symbolKey: string;
  category: string;
  scale: number;
  rotationDegrees: number;
  tint: string;
}

export interface ActiveLabelSettings {
  defaultText: string;
  category: LabelCategory;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  opacity: number;
  alignment: "left" | "center" | "right";
  rotationDegrees: number;
}

export interface ActiveExtentSettings {
  childScope: Exclude<MapScope, "world">;
  autoNavigateToChild: boolean;
}

export interface LabelUpdatePayload {
  text?: string;
  category?: LabelCategory;
  rotationDegrees?: number;
  anchorX?: number;
  anchorY?: number;
  style?: Partial<LabelStyle>;
}

export interface InProgressDrawState {
  tool: EditorToolId;
  layerId: LayerId;
  points: DocumentPoint[];
}

export interface InProgressExtentState {
  scope: Exclude<MapScope, "world">;
  start: DocumentPoint;
  current: DocumentPoint;
}

export interface RuntimeHistoryEntry {
  id: string;
  label: string;
  committedAt: string;
}

export interface EditorSessionState {
  activeMapId: MapId;
  activeScope: MapScope;
  activeTool: EditorToolId;
  selectedLayerId: LayerId | null;
  selection: SelectionTarget;
  panels: Record<SidebarPanelId, PanelState>;
  canvasStatus: CanvasStatus;
  viewStateByMap: Record<MapId, EditorViewState>;
  statusHint: string;
  inProgressDraw: InProgressDrawState | null;
  inProgressExtent: InProgressExtentState | null;
  activeExtent: ActiveExtentSettings;
  activeBrush: ActiveBrushSettings;
  activeVector: ActiveVectorSettings;
  activeSymbol: ActiveSymbolSettings;
  activeLabel: ActiveLabelSettings;
  undoStack: RuntimeHistoryEntry[];
  redoStack: RuntimeHistoryEntry[];
}



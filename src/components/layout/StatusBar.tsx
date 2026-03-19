interface StatusBarProps {
  workspaceMode: "flat" | "globe";
  globeSourceMapName: string | null;
  mapName: string;
  zoomPercent: number;
  pointerX: number | null;
  pointerY: number | null;
  visibleChunkCount: number;
  activeTool: string;
  scope: string;
  selectedLayerName: string | null;
  selectionSummary: string;
  layerEditableSummary: string;
  dirty: boolean;
  projectStatus: string;
  canUndo: boolean;
  canRedo: boolean;
  hint: string;
}

const formatCoord = (value: number | null): string => {
  if (value === null) {
    return "-";
  }

  return value.toFixed(0);
};

export function StatusBar({
  workspaceMode,
  globeSourceMapName,
  mapName,
  zoomPercent,
  pointerX,
  pointerY,
  visibleChunkCount,
  activeTool,
  scope,
  selectedLayerName,
  selectionSummary,
  layerEditableSummary,
  dirty,
  projectStatus,
  canUndo,
  canRedo,
  hint,
}: StatusBarProps) {
  return (
    <footer className="status-bar">
      <div className="status-bar__segment">
        <span className="status-key">Map</span>
        <strong title={mapName}>{mapName}</strong>
      </div>
      <div className="status-bar__segment">
        <span className="status-key">Tool</span>
        <strong>{activeTool}</strong>
      </div>
      <div className="status-bar__segment">
        <span className="status-key">Scope</span>
        <strong>{scope}</strong>
      </div>
      <div className="status-bar__segment">
        <span className="status-key">Layer</span>
        <strong>{selectedLayerName ?? "None"}</strong>
      </div>
      <div className="status-bar__segment">
        <span className="status-key">Selection</span>
        <strong>{selectionSummary}</strong>
      </div>
      <div className="status-bar__segment">
        <span className="status-key">Editable</span>
        <strong>{layerEditableSummary}</strong>
      </div>
      <div className="status-bar__segment">
        <span className="status-key">Zoom</span>
        <strong>{zoomPercent.toFixed(0)}%</strong>
      </div>
      <div className="status-bar__segment">
        <span className="status-key">Coords</span>
        <strong>
          {formatCoord(pointerX)}, {formatCoord(pointerY)}
        </strong>
      </div>
      <div className="status-bar__segment">
        <span className="status-key">Chunks</span>
        <strong>{visibleChunkCount}</strong>
      </div>
      <div className="status-bar__segment">
        <span className="status-key">History</span>
        <strong>
          {canUndo ? "Undo" : "-"} / {canRedo ? "Redo" : "-"}
        </strong>
      </div>
      <div className="status-bar__segment">
        <span className="status-key">Project</span>
        <strong>{dirty ? "Unsaved" : "Saved"}</strong>
      </div>
      <div className="status-bar__segment">
        <span className="status-key">Mode</span>
        <strong>{workspaceMode}</strong>
      </div>
      <div className="status-bar__segment">
        <span className="status-key">State</span>
        <strong>{projectStatus}</strong>
      </div>
      {globeSourceMapName ? (
        <div className="status-bar__segment">
          <span className="status-key">Globe source</span>
          <strong>{globeSourceMapName}</strong>
        </div>
      ) : null}
      <div className="status-bar__hint">
        <span>{hint}</span>
        <span className="status-shortcuts">Shortcuts: `?` help, `G` globe, `F` fit, `0` reset</span>
      </div>
    </footer>
  );
}

import type { MapScope } from "../../types/editor";

interface TopBarProps {
  workspaceMode: "flat" | "globe";
  projectName: string;
  projectPath: string | null;
  mapName: string;
  selectedLayerName: string | null;
  selectionSummary: string;
  scope: MapScope;
  dirty: boolean;
  breadcrumb: Array<{ mapId: string; name: string; scope: MapScope }>;
  canOpenParent: boolean;
  onSelectBreadcrumb: (mapId: string) => void;
  onOpenParent: () => void;
  onNewProject: () => void;
  onOpenProject: () => void;
  onSaveProject: () => void;
  onSaveProjectAs: () => void;
  onOpenExport: () => void;
  onToggleGlobePreview: () => void;
  onZoomToFit: () => void;
  onResetView: () => void;
  onToggleGrid: () => void;
  onToggleChunkOverlay: () => void;
  onOpenShortcutHelp: () => void;
}

export function TopBar({
  workspaceMode,
  projectName,
  projectPath,
  mapName,
  selectedLayerName,
  selectionSummary,
  scope,
  dirty,
  breadcrumb,
  canOpenParent,
  onSelectBreadcrumb,
  onOpenParent,
  onNewProject,
  onOpenProject,
  onSaveProject,
  onSaveProjectAs,
  onOpenExport,
  onToggleGlobePreview,
  onZoomToFit,
  onResetView,
  onToggleGrid,
  onToggleChunkOverlay,
  onOpenShortcutHelp,
}: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar__section topbar__identity">
        <strong className="app-title">World Seed Mapper</strong>
        <span className="project-name" title={projectName}>
          {projectName}
        </span>
        {dirty ? <span className="dirty-dot">Unsaved</span> : <span className="saved-dot">Saved</span>}
      </div>

      <div className="topbar__section topbar__actions">
        <button type="button" className="button button--ghost button--with-shortcut" onClick={onNewProject}>
          <span>New</span>
          <kbd>Ctrl+N</kbd>
        </button>
        <button type="button" className="button button--ghost button--with-shortcut" onClick={onOpenProject}>
          <span>Open</span>
          <kbd>Ctrl+O</kbd>
        </button>
        <button type="button" className="button button--primary button--with-shortcut" onClick={onSaveProject}>
          <span>Save</span>
          <kbd>Ctrl+S</kbd>
        </button>
        <button type="button" className="button button--ghost button--with-shortcut" onClick={onSaveProjectAs}>
          <span>Save As</span>
          <kbd>Ctrl+Shift+S</kbd>
        </button>
        <button type="button" className="button button--ghost button--with-shortcut" onClick={onOpenExport}>
          <span>Export</span>
          <kbd>Ctrl+E</kbd>
        </button>
        <button
          type="button"
          className={`button button--with-shortcut ${workspaceMode === "globe" ? "button--primary" : "button--ghost"}`}
          onClick={onToggleGlobePreview}
        >
          <span>{workspaceMode === "globe" ? "Flat Editor" : "Globe Preview"}</span>
          <kbd>G</kbd>
        </button>
      </div>

      <div className="topbar__section topbar__context">
        <span className="scope-badge">{scope.toUpperCase()}</span>
        <span className="map-name" title={mapName}>
          {mapName}
        </span>
        <span className="context-chip" title={selectionSummary}>
          {selectionSummary}
        </span>
        <span className="context-chip" title={selectedLayerName ?? "No active layer"}>
          Layer: {selectedLayerName ?? "None"}
        </span>
        {workspaceMode === "globe" ? <span className="mode-badge">GLOBE MODE</span> : null}
        <button type="button" className="button button--ghost" onClick={onOpenParent} disabled={!canOpenParent}>
          Open Parent
        </button>
      </div>

      <div className="topbar__section topbar__view">
        <button type="button" className="button button--ghost button--with-shortcut" onClick={onZoomToFit}>
          <span>Zoom To Fit</span>
          <kbd>F</kbd>
        </button>
        <button type="button" className="button button--ghost button--with-shortcut" onClick={onResetView}>
          <span>Reset View</span>
          <kbd>0</kbd>
        </button>
        <button type="button" className="button button--ghost" onClick={onToggleGrid}>
          Grid
        </button>
        <button type="button" className="button button--ghost" onClick={onToggleChunkOverlay}>
          Chunks
        </button>
        <button type="button" className="button button--ghost button--with-shortcut" onClick={onOpenShortcutHelp}>
          <span>Shortcuts</span>
          <kbd>?</kbd>
        </button>
      </div>

      <div className="topbar__section topbar__meta">
        <div className="breadcrumb" aria-label="Map breadcrumb">
          {breadcrumb.map((entry, index) => (
            <span key={entry.mapId} className="breadcrumb__item">
              {index > 0 ? <span className="breadcrumb__divider">/</span> : null}
              <button
                type="button"
                className="breadcrumb__button"
                onClick={() => onSelectBreadcrumb(entry.mapId)}
                aria-current={index === breadcrumb.length - 1 ? "page" : undefined}
              >
                {entry.name}
              </button>
            </span>
          ))}
        </div>
        <span className="project-path" title={projectPath ?? "No project folder selected"}>
          {projectPath ?? "No project folder selected"}
        </span>
      </div>
    </header>
  );
}

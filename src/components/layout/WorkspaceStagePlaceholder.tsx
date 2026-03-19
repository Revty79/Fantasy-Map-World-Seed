import type { EditorToolId, MapScope } from "../../types/editor";

interface WorkspaceStagePlaceholderProps {
  projectName: string;
  mapName: string;
  scope: MapScope;
  activeTool: EditorToolId;
  selectedLayerName: string | null;
  mapWidth: number;
  mapHeight: number;
}

export function WorkspaceStagePlaceholder({
  projectName,
  mapName,
  scope,
  activeTool,
  selectedLayerName,
  mapWidth,
  mapHeight,
}: WorkspaceStagePlaceholderProps) {
  return (
    <main className="workspace-stage">
      <div className="workspace-stage__frame">
        <div className="workspace-stage__header">
          <h1>Master Canvas Stage</h1>
          <p>Renderer status: waiting for Pixi engine attachment in the next build step.</p>
        </div>

        <div className="workspace-stage__grid">
          <div>
            <strong>Project</strong>
            <span>{projectName}</span>
          </div>
          <div>
            <strong>Map</strong>
            <span>{mapName}</span>
          </div>
          <div>
            <strong>Scope</strong>
            <span>{scope}</span>
          </div>
          <div>
            <strong>Projection</strong>
            <span>Equirectangular</span>
          </div>
          <div>
            <strong>Document Size</strong>
            <span>
              {mapWidth} x {mapHeight}
            </span>
          </div>
          <div>
            <strong>Active Tool</strong>
            <span>{activeTool}</span>
          </div>
          <div>
            <strong>Active Layer</strong>
            <span>{selectedLayerName ?? "None selected"}</span>
          </div>
          <div>
            <strong>Pipeline note</strong>
            <span>World map remains the globe-safe master source for future 3D preview.</span>
          </div>
        </div>
      </div>
    </main>
  );
}

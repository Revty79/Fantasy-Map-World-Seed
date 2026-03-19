import { useState } from "react";
import { WorldCanvas } from "../../features/workspace/components/WorldCanvas";
import { GlobePreview } from "../../features/globe-preview/components/GlobePreview";
import type { CanvasRenderInput } from "../../engine/canvas/types";
import type { EditorToolId, MapScope } from "../../types";

interface GlobePreviewState {
  sourceMapName: string;
  usingFallbackWorldSource: boolean;
  textureCanvas: HTMLCanvasElement | null;
  textureWidth: number | null;
  textureHeight: number | null;
  generatedAt: string | null;
  warnings: string[];
  isLoading: boolean;
  isStale: boolean;
  errorMessage: string | null;
}

interface WorkspaceStageProps {
  stageMode: "flat" | "globe";
  projectName: string;
  mapName: string;
  scope: MapScope;
  activeTool: EditorToolId;
  selectedLayerName: string | null;
  mapWidth: number;
  mapHeight: number;
  chunkSize: number;
  canvasInput: CanvasRenderInput;
  onViewChange: (nextView: CanvasRenderInput["view"]) => void;
  onPointerMove: (x: number | null, y: number | null) => void;
  onVisibleChunksChange: (count: number) => void;
  globePreview: GlobePreviewState;
  onRefreshGlobePreview: () => void;
  onExitGlobePreview: () => void;
}

export function WorkspaceStage({
  stageMode,
  projectName,
  mapName,
  scope,
  activeTool,
  selectedLayerName,
  mapWidth,
  mapHeight,
  chunkSize,
  canvasInput,
  onViewChange,
  onPointerMove,
  onVisibleChunksChange,
  globePreview,
  onRefreshGlobePreview,
  onExitGlobePreview,
}: WorkspaceStageProps) {
  const isGlobeMode = stageMode === "globe";
  const [overlayCollapsed, setOverlayCollapsed] = useState(false);

  return (
    <main className="workspace-stage">
      <div className="workspace-stage__frame">
        {isGlobeMode ? (
          <GlobePreview
            activeMapName={mapName}
            activeMapScope={scope}
            sourceMapName={globePreview.sourceMapName}
            usingFallbackWorldSource={globePreview.usingFallbackWorldSource}
            textureCanvas={globePreview.textureCanvas}
            textureWidth={globePreview.textureWidth}
            textureHeight={globePreview.textureHeight}
            generatedAt={globePreview.generatedAt}
            warnings={globePreview.warnings}
            isLoading={globePreview.isLoading}
            isStale={globePreview.isStale}
            errorMessage={globePreview.errorMessage}
            onRefresh={onRefreshGlobePreview}
            onExit={onExitGlobePreview}
          />
        ) : (
          <>
            <WorldCanvas
              input={canvasInput}
              onViewChange={onViewChange}
              onPointerMove={onPointerMove}
              onVisibleChunksChange={onVisibleChunksChange}
            />

            <aside className={`workspace-stage__overlay-card ${overlayCollapsed ? "is-collapsed" : ""}`}>
              <div className="workspace-stage__overlay-header">
                <h2>World Canvas</h2>
                <button
                  type="button"
                  className="button button--ghost workspace-stage__overlay-toggle"
                  onClick={() => setOverlayCollapsed((value) => !value)}
                  aria-expanded={!overlayCollapsed}
                  aria-label={overlayCollapsed ? "Expand world canvas info panel" : "Collapse world canvas info panel"}
                >
                  {overlayCollapsed ? "Expand" : "Collapse"}
                </button>
              </div>
              {!overlayCollapsed ? (
                <>
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
                    <strong>Tool</strong>
                    <span>{activeTool}</span>
                  </div>
                  <div>
                    <strong>Layer</strong>
                    <span>{selectedLayerName ?? "None"}</span>
                  </div>
                  <div>
                    <strong>Extent</strong>
                    <span>
                      {mapWidth} x {mapHeight}
                    </span>
                  </div>
                  <div>
                    <strong>Chunk size</strong>
                    <span>{chunkSize}</span>
                  </div>
                  <p>Use `F` to fit view, `0` to reset, `Space` to pan temporarily, and `?` to view full shortcuts.</p>
                </>
              ) : null}
            </aside>
          </>
        )}
      </div>
    </main>
  );
}

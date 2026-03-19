import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { RightSidebar } from "../../components/layout/RightSidebar";
import { StatusBar } from "../../components/layout/StatusBar";
import { ToolRail } from "../../components/layout/ToolRail";
import { TopBar } from "../../components/layout/TopBar";
import { WorkspaceStage } from "../../components/layout/WorkspaceStage";
import { ExportModal } from "../export/ExportModal";
import { ShortcutHelpModal } from "../shortcuts/ShortcutHelpModal";
import type { CanvasRenderInput } from "../../engine/canvas/types";
import { isExportCanceledError, runMapExport, type ExportRequest } from "../../lib/export";
import { buildGlobeTextureCanvas } from "../../lib/globe";
import { TOOL_SHORTCUT_KEY_TO_TOOL } from "../shortcuts/shortcuts";
import type { DocumentRect, SelectionTarget } from "../../types";
import {
  selectActiveMap,
  selectActiveMapLayers,
  selectActiveView,
  selectMapBreadcrumbNodes,
  selectSelectedLabel,
  selectSelectedLayer,
  selectSelectedMapLink,
  selectSelectedSymbol,
  selectSelectedVectorFeature,
  useEditorStore,
} from "../../store/editorStore";

const isTextInputTarget = (target: EventTarget | null): boolean => {
  const element = target as HTMLElement | null;
  if (!element) {
    return false;
  }

  const tag = element.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || element.isContentEditable;
};

const getSelectionSummary = (
  selection: SelectionTarget,
  selectedVectorName: string | null,
  selectedSymbolName: string | null,
  selectedLabelName: string | null,
): string => {
  switch (selection.type) {
    case "vector":
    case "vector-vertex":
      return selectedVectorName ? `Vector: ${selectedVectorName}` : "Vector selected";
    case "symbol":
      return selectedSymbolName ? `Symbol: ${selectedSymbolName}` : "Symbol selected";
    case "label":
      return selectedLabelName ? `Label: ${selectedLabelName}` : "Label selected";
    case "map-extent":
      return "Map extent selected";
    case "layer":
      return "Layer selected";
    default:
      return "No selection";
  }
};

export function WorkspaceScreen() {
  const document = useEditorStore((state) => state.document);
  const projectSession = useEditorStore((state) => state.projectSession);

  const activeMap = useEditorStore(selectActiveMap);
  const activeMapLayers = useEditorStore(useShallow(selectActiveMapLayers));
  const activeView = useEditorStore(useShallow(selectActiveView));
  const selectedLayer = useEditorStore(selectSelectedLayer);
  const selectedVectorFeature = useEditorStore(useShallow(selectSelectedVectorFeature));
  const selectedSymbolInstance = useEditorStore(useShallow(selectSelectedSymbol));
  const selectedLabelAnnotation = useEditorStore(useShallow(selectSelectedLabel));
  const selectedMapLink = useEditorStore(useShallow(selectSelectedMapLink));
  const breadcrumbMapIds = useEditorStore(useShallow(selectMapBreadcrumbNodes));
  const session = useEditorStore((state) => state.session);

  const setActiveTool = useEditorStore((state) => state.setActiveTool);
  const setActiveMap = useEditorStore((state) => state.setActiveMap);
  const prepareCreateChildMap = useEditorStore((state) => state.prepareCreateChildMap);
  const openParentMap = useEditorStore((state) => state.openParentMap);
  const openChildMapFromLink = useEditorStore((state) => state.openChildMapFromLink);
  const renameMap = useEditorStore((state) => state.renameMap);
  const commitExtentSelection = useEditorStore((state) => state.commitExtentSelection);
  const cancelExtentSelection = useEditorStore((state) => state.cancelExtentSelection);
  const setSelectedLayer = useEditorStore((state) => state.setSelectedLayer);
  const togglePanel = useEditorStore((state) => state.togglePanel);
  const newProject = useEditorStore((state) => state.newProject);
  const openProject = useEditorStore((state) => state.openProject);
  const saveProject = useEditorStore((state) => state.saveProject);
  const saveProjectAs = useEditorStore((state) => state.saveProjectAs);
  const zoomToFit = useEditorStore((state) => state.zoomToFit);
  const resetView = useEditorStore((state) => state.resetView);
  const toggleGrid = useEditorStore((state) => state.toggleGrid);
  const toggleChunkOverlay = useEditorStore((state) => state.toggleChunkOverlay);
  const addLayer = useEditorStore((state) => state.addLayer);
  const removeLayer = useEditorStore((state) => state.removeLayer);
  const moveLayer = useEditorStore((state) => state.moveLayer);
  const toggleLayerVisibility = useEditorStore((state) => state.toggleLayerVisibility);
  const toggleLayerLock = useEditorStore((state) => state.toggleLayerLock);
  const renameLayer = useEditorStore((state) => state.renameLayer);
  const setLayerOpacity = useEditorStore((state) => state.setLayerOpacity);
  const setStatusHint = useEditorStore((state) => state.setStatusHint);
  const setActiveView = useEditorStore((state) => state.setActiveView);
  const setPointerDocumentPosition = useEditorStore((state) => state.setPointerDocumentPosition);
  const setCanvasStatus = useEditorStore((state) => state.setCanvasStatus);

  const setBrushSetting = useEditorStore((state) => state.setBrushSetting);
  const setTerrainBrushSetting = useEditorStore((state) => state.setTerrainBrushSetting);
  const setVectorSetting = useEditorStore((state) => state.setVectorSetting);
  const setSymbolSetting = useEditorStore((state) => state.setSymbolSetting);
  const setLabelSetting = useEditorStore((state) => state.setLabelSetting);
  const setExtentSetting = useEditorStore((state) => state.setExtentSetting);
  const setTerrainGenerationSetting = useEditorStore((state) => state.setTerrainGenerationSetting);
  const setTerrainDisplaySetting = useEditorStore((state) => state.setTerrainDisplaySetting);
  const setTerrainSeaLevel = useEditorStore((state) => state.setTerrainSeaLevel);
  const generateTerrainForActiveMap = useEditorStore((state) => state.generateTerrainForActiveMap);
  const regenerateTerrainForActiveMap = useEditorStore((state) => state.regenerateTerrainForActiveMap);
  const randomizeTerrainSeed = useEditorStore((state) => state.randomizeTerrainSeed);
  const refreshTerrainDerivedForActiveMap = useEditorStore((state) => state.refreshTerrainDerivedForActiveMap);
  const updateSymbolTransform = useEditorStore((state) => state.updateSymbolTransform);
  const updateLabel = useEditorStore((state) => state.updateLabel);
  const [workspaceMode, setWorkspaceMode] = useState<"flat" | "globe">("flat");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportInProgress, setExportInProgress] = useState(false);
  const [shortcutHelpOpen, setShortcutHelpOpen] = useState(false);
  const [globeTextureCanvas, setGlobeTextureCanvas] = useState<HTMLCanvasElement | null>(null);
  const [globeTextureWidth, setGlobeTextureWidth] = useState<number | null>(null);
  const [globeTextureHeight, setGlobeTextureHeight] = useState<number | null>(null);
  const [globeGeneratedAt, setGlobeGeneratedAt] = useState<string | null>(null);
  const [globeWarnings, setGlobeWarnings] = useState<string[]>([]);
  const [globeLoading, setGlobeLoading] = useState(false);
  const [globeError, setGlobeError] = useState<string | null>(null);
  const [globeStale, setGlobeStale] = useState(false);
  const lastRenderedGlobeContextRef = useRef<string | null>(null);
  const previousWorkspaceModeRef = useRef<"flat" | "globe">("flat");

  useEffect(() => {
    zoomToFit();
  }, [zoomToFit]);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!projectSession.dirty) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [projectSession.dirty]);

  const canvasInput: CanvasRenderInput = useMemo(
    () => ({
      map: activeMap,
      layers: activeMapLayers,
      activeTool: session.activeTool,
      selectedLayerId: session.selectedLayerId,
      selection: session.selection,
      inProgressDraw: session.inProgressDraw,
      inProgressExtent: session.inProgressExtent,
      brush: session.activeBrush,
      terrainBrush: session.activeTerrainBrush,
      view: activeView,
    }),
    [
      activeMap,
      activeMapLayers,
      session.activeTool,
      session.selectedLayerId,
      session.selection,
      session.inProgressDraw,
      session.inProgressExtent,
      session.activeBrush,
      session.activeTerrainBrush,
      activeView,
    ]
  );

  const handleVisibleChunksChange = useCallback(
    (count: number) => {
      setCanvasStatus({ visibleChunkCount: count });
    },
    [setCanvasStatus]
  );

  const maps = useMemo(
    () => document.mapOrder.map((mapId) => document.maps[mapId]),
    [document.mapOrder, document.maps]
  );

  const breadcrumb = useMemo(
    () =>
      breadcrumbMapIds
        .map((mapId) => document.maps[mapId])
        .filter(Boolean)
        .map((map) => ({
          mapId: map.id,
          name: map.name,
          scope: map.scope,
        })),
    [breadcrumbMapIds, document.maps]
  );

  const selectedVector = useMemo(
    () =>
      selectedVectorFeature
        ? {
            feature: selectedVectorFeature.feature,
            layerId: selectedVectorFeature.layer.id,
          }
        : null,
    [selectedVectorFeature]
  );

  const selectedSymbol = useMemo(
    () =>
      selectedSymbolInstance
        ? {
            symbol: selectedSymbolInstance.symbol,
            layerId: selectedSymbolInstance.layer.id,
          }
        : null,
    [selectedSymbolInstance]
  );

  const selectedLabel = useMemo(
    () =>
      selectedLabelAnnotation
        ? {
            label: selectedLabelAnnotation.label,
            layerId: selectedLabelAnnotation.layer.id,
          }
        : null,
    [selectedLabelAnnotation]
  );

  const selectionSummary = useMemo(
    () =>
      getSelectionSummary(
        session.selection,
        selectedVector?.feature.category ?? null,
        selectedSymbol?.symbol.symbolKey ?? null,
        selectedLabel?.label.text ?? null,
      ),
    [selectedLabel?.label.text, selectedSymbol?.symbol.symbolKey, selectedVector?.feature.category, session.selection]
  );

  const layerEditableSummary = useMemo(() => {
    if (!selectedLayer) {
      return "No layer";
    }

    if (!selectedLayer.visible) {
      return "Hidden";
    }

    if (selectedLayer.locked) {
      return "Locked";
    }

    return "Editable";
  }, [selectedLayer]);

  const rootWorldMap = useMemo(() => document.maps[document.rootWorldMapId] ?? activeMap, [activeMap, document]);
  const rootWorldLayers = useMemo(
    () => rootWorldMap.layerOrder.map((layerId) => rootWorldMap.layers[layerId]),
    [rootWorldMap]
  );
  const usingFallbackWorldSource = activeMap.id !== rootWorldMap.id;

  const activeMapWorldExtent = useMemo((): DocumentRect | null => {
    if (activeMap.scope === "world" || !activeMap.parentMapId) {
      return null;
    }

    const activeSourceLink =
      Object.values(activeMap.nestedLinks).find(
        (link) => link.childMapId === activeMap.id && link.parentMapId === activeMap.parentMapId
      ) ?? null;

    if (!activeSourceLink) {
      return null;
    }

    if (activeSourceLink.parentMapId === rootWorldMap.id) {
      return activeSourceLink.parentExtent;
    }

    const parentMap = document.maps[activeSourceLink.parentMapId];
    if (!parentMap || !parentMap.parentMapId) {
      return null;
    }

    const parentSourceLink =
      Object.values(parentMap.nestedLinks).find(
        (link) => link.childMapId === parentMap.id && link.parentMapId === parentMap.parentMapId
      ) ?? null;

    if (!parentSourceLink || parentSourceLink.parentMapId !== rootWorldMap.id) {
      return null;
    }

    const normalized = activeSourceLink.normalizedParentExtent;
    return {
      x: parentSourceLink.parentExtent.x + normalized.x * parentSourceLink.parentExtent.width,
      y: parentSourceLink.parentExtent.y + normalized.y * parentSourceLink.parentExtent.height,
      width: normalized.width * parentSourceLink.parentExtent.width,
      height: normalized.height * parentSourceLink.parentExtent.height,
    };
  }, [activeMap, document.maps, rootWorldMap.id]);

  const activeMapWorldExtentKey = activeMapWorldExtent
    ? [
        activeMapWorldExtent.x.toFixed(1),
        activeMapWorldExtent.y.toFixed(1),
        activeMapWorldExtent.width.toFixed(1),
        activeMapWorldExtent.height.toFixed(1),
      ].join(":")
    : "none";

  const globeContextKey = [
    rootWorldMap.id,
    activeMap.id,
    activeMapWorldExtentKey,
    document.metadata.updatedAt,
    rootWorldMap.terrain.meta.updatedAt,
    rootWorldMap.terrain.generation.revision,
    rootWorldMap.terrain.display.renderMode,
    rootWorldMap.terrain.display.showDerivedCoastline ? "derived-coast-on" : "derived-coast-off",
    rootWorldMap.terrain.display.showLandWaterOverlay ? "land-water-overlay-on" : "land-water-overlay-off",
  ].join(":");

  const refreshGlobePreview = useCallback(async () => {
    if (rootWorldMap.scope !== "world") {
      const message = "Globe preview requires a valid root world map source.";
      setGlobeError(message);
      setStatusHint(message);
      return;
    }

    setGlobeLoading(true);
    setGlobeError(null);

    try {
      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => resolve());
      });

      const result = buildGlobeTextureCanvas({
        map: rootWorldMap,
        layers: rootWorldLayers,
        highlightExtent: activeMap.scope === "world" ? null : activeMapWorldExtent,
      });

      const warnings = [...result.warnings];
      if (activeMap.scope !== "world" && !activeMapWorldExtent) {
        warnings.push(
          "Current child-map extent could not be resolved for overlay; showing the world texture without highlight."
        );
      }

      setGlobeTextureCanvas(result.canvas);
      setGlobeTextureWidth(result.width);
      setGlobeTextureHeight(result.height);
      setGlobeGeneratedAt(new Date().toISOString());
      setGlobeWarnings(warnings);
      setGlobeStale(false);
      lastRenderedGlobeContextRef.current = globeContextKey;
      setStatusHint(
        activeMap.scope === "world"
          ? `Globe preview refreshed from ${rootWorldMap.name}.`
          : `Globe preview refreshed from ${rootWorldMap.name} (active ${activeMap.scope} map context).`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setGlobeError(`Failed to build globe texture: ${message}`);
      setStatusHint(`Globe preview failed: ${message}`);
    } finally {
      setGlobeLoading(false);
    }
  }, [activeMap.scope, activeMapWorldExtent, globeContextKey, rootWorldLayers, rootWorldMap, setStatusHint]);

  const toggleWorkspaceMode = useCallback(() => {
    setWorkspaceMode((previous) => {
      const next = previous === "flat" ? "globe" : "flat";
      setStatusHint(
        next === "globe"
          ? usingFallbackWorldSource
            ? `Globe mode opened. Showing root world map: ${rootWorldMap.name}.`
            : `Globe mode opened for ${rootWorldMap.name}.`
          : "Returned to flat editor mode."
      );
      return next;
    });
  }, [rootWorldMap.name, setStatusHint, usingFallbackWorldSource]);

  const exitGlobePreview = useCallback(() => {
    setWorkspaceMode("flat");
    setStatusHint("Returned to flat editor mode.");
  }, [setStatusHint]);

  useEffect(() => {
    if (lastRenderedGlobeContextRef.current && lastRenderedGlobeContextRef.current !== globeContextKey) {
      setGlobeStale(true);
    }
  }, [globeContextKey]);

  useEffect(() => {
    const previousMode = previousWorkspaceModeRef.current;
    previousWorkspaceModeRef.current = workspaceMode;

    if (workspaceMode === "globe" && previousMode !== "globe") {
      void refreshGlobePreview();
    }
  }, [refreshGlobePreview, workspaceMode]);

  const currentViewDocumentWidth = Math.max(1, Math.round(activeView.viewportWidth / Math.max(0.001, activeView.zoom)));
  const currentViewDocumentHeight = Math.max(1, Math.round(activeView.viewportHeight / Math.max(0.001, activeView.zoom)));

  const openExportModal = useCallback(() => {
    setExportModalOpen(true);
  }, []);

  const openShortcutHelp = useCallback(() => {
    setShortcutHelpOpen(true);
  }, []);

  const closeShortcutHelp = useCallback(() => {
    setShortcutHelpOpen(false);
  }, []);

  const closeExportModal = useCallback(() => {
    if (exportInProgress) {
      return;
    }
    setExportModalOpen(false);
  }, [exportInProgress]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      if (event.key === "F1") {
        event.preventDefault();
        setShortcutHelpOpen((value) => !value);
        return;
      }

      const isTyping = isTextInputTarget(event.target);
      const modifierPressed = event.ctrlKey || event.metaKey;
      const normalizedKey = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (!modifierPressed && !isTyping && normalizedKey === "?") {
        event.preventDefault();
        setShortcutHelpOpen((value) => !value);
        return;
      }

      if (shortcutHelpOpen && event.key === "Escape") {
        event.preventDefault();
        setShortcutHelpOpen(false);
        return;
      }

      if (isTyping) {
        return;
      }

      if (modifierPressed && normalizedKey === "s") {
        event.preventDefault();
        if (event.shiftKey) {
          void saveProjectAs();
          setStatusHint("Save As started.");
        } else {
          void saveProject();
          setStatusHint("Save started.");
        }
        return;
      }

      if (modifierPressed && normalizedKey === "o") {
        event.preventDefault();
        void openProject();
        setStatusHint("Open project started.");
        return;
      }

      if (modifierPressed && normalizedKey === "n") {
        event.preventDefault();
        void newProject();
        return;
      }

      if (modifierPressed && normalizedKey === "e") {
        event.preventDefault();
        if (!exportInProgress) {
          setExportModalOpen(true);
          setStatusHint("Export options opened.");
        }
        return;
      }

      if (!modifierPressed && normalizedKey in TOOL_SHORTCUT_KEY_TO_TOOL) {
        event.preventDefault();
        const toolId = TOOL_SHORTCUT_KEY_TO_TOOL[normalizedKey];
        setActiveTool(toolId);
        return;
      }

      if (!modifierPressed && normalizedKey === "g") {
        event.preventDefault();
        toggleWorkspaceMode();
        return;
      }

      if (!modifierPressed && normalizedKey === "f") {
        event.preventDefault();
        zoomToFit();
        return;
      }

      if (!modifierPressed && normalizedKey === "0") {
        event.preventDefault();
        resetView();
        return;
      }

      if (!modifierPressed && normalizedKey === "1") {
        event.preventDefault();
        togglePanel("maps");
        return;
      }

      if (!modifierPressed && normalizedKey === "2") {
        event.preventDefault();
        togglePanel("layers");
        return;
      }

      if (!modifierPressed && normalizedKey === "3") {
        event.preventDefault();
        togglePanel("inspector");
        return;
      }

      if (!modifierPressed && normalizedKey === "4") {
        event.preventDefault();
        togglePanel("toolSettings");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    exportInProgress,
    newProject,
    openProject,
    resetView,
    saveProject,
    saveProjectAs,
    setActiveTool,
    setStatusHint,
    shortcutHelpOpen,
    togglePanel,
    toggleWorkspaceMode,
    zoomToFit,
  ]);

  const handleExport = useCallback(
    async (request: ExportRequest) => {
      setExportInProgress(true);
      setStatusHint(`Exporting ${activeMap.name} as ${request.format.toUpperCase()}...`);

      try {
        const result = await runMapExport({
          document,
          map: activeMap,
          layers: activeMapLayers,
          view: activeView,
          projectPath: projectSession.path,
        }, request);

        if (result.warnings.length > 0) {
          setStatusHint(`Exported ${result.format.toUpperCase()} with notes: ${result.warnings.join(" ")}`);
        } else {
          setStatusHint(`Exported ${result.format.toUpperCase()} to ${result.filePath}`);
        }

        setExportModalOpen(false);
      } catch (error) {
        if (isExportCanceledError(error)) {
          setStatusHint("Export canceled.");
          return;
        }

        const message = error instanceof Error ? error.message : String(error);
        setStatusHint(`Export failed: ${message}`);
      } finally {
        setExportInProgress(false);
      }
    },
    [activeMap, activeMapLayers, activeView, document, projectSession.path, setStatusHint]
  );

  return (
    <div className="workspace-root">
      <TopBar
        workspaceMode={workspaceMode}
        projectName={projectSession.name}
        projectPath={projectSession.path}
        mapName={activeMap.name}
        selectedLayerName={selectedLayer?.name ?? null}
        selectionSummary={selectionSummary}
        scope={session.activeScope}
        dirty={projectSession.dirty}
        breadcrumb={breadcrumb}
        canOpenParent={Boolean(activeMap.parentMapId)}
        onSelectBreadcrumb={setActiveMap}
        onOpenParent={openParentMap}
        onNewProject={newProject}
        onOpenProject={openProject}
        onSaveProject={saveProject}
        onSaveProjectAs={saveProjectAs}
        onOpenExport={openExportModal}
        onToggleGlobePreview={toggleWorkspaceMode}
        onZoomToFit={zoomToFit}
        onResetView={resetView}
        onToggleGrid={toggleGrid}
        onToggleChunkOverlay={toggleChunkOverlay}
        onOpenShortcutHelp={openShortcutHelp}
      />

      <div className="workspace-main">
        <ToolRail activeTool={session.activeTool} onSelectTool={setActiveTool} />

        <WorkspaceStage
          stageMode={workspaceMode}
          projectName={projectSession.name}
          mapName={activeMap.name}
          scope={session.activeScope}
          activeTool={session.activeTool}
          selectedLayerName={selectedLayer?.name ?? null}
          mapWidth={activeMap.dimensions.width}
          mapHeight={activeMap.dimensions.height}
          chunkSize={activeMap.settings.chunkSize}
          canvasInput={canvasInput}
          onViewChange={setActiveView}
          onPointerMove={setPointerDocumentPosition}
          onVisibleChunksChange={handleVisibleChunksChange}
          globePreview={{
            sourceMapName: rootWorldMap.name,
            usingFallbackWorldSource,
            textureCanvas: globeTextureCanvas,
            textureWidth: globeTextureWidth,
            textureHeight: globeTextureHeight,
            generatedAt: globeGeneratedAt,
            warnings: globeWarnings,
            isLoading: globeLoading,
            isStale: globeStale,
            errorMessage: globeError,
          }}
          onRefreshGlobePreview={() => {
            void refreshGlobePreview();
          }}
          onExitGlobePreview={exitGlobePreview}
        />

        <RightSidebar
          activeMap={activeMap}
          maps={maps}
          layers={activeMapLayers}
          selectedLayerId={session.selectedLayerId}
          selectedLayer={selectedLayer}
          selectedVector={selectedVector}
          selectedSymbol={selectedSymbol}
          selectedLabel={selectedLabel}
          selectedMapLink={selectedMapLink}
          activeTool={session.activeTool}
          selection={session.selection}
          session={session}
          workspaceMode={workspaceMode}
          globeSourceMapName={rootWorldMap.name}
          globeUsingFallbackSource={usingFallbackWorldSource}
          globeIsStale={globeStale}
          onRefreshGlobePreview={() => {
            void refreshGlobePreview();
          }}
          panels={session.panels}
          onTogglePanel={togglePanel}
          onSelectLayer={setSelectedLayer}
          onSelectMap={setActiveMap}
          onPrepareCreateChildMap={prepareCreateChildMap}
          onOpenParentMap={openParentMap}
          onOpenChildMapFromLink={openChildMapFromLink}
          onRenameMap={(name) => renameMap(activeMap.id, name)}
          onAddLayer={(kind) => {
            addLayer(kind);
            setStatusHint(`Added ${kind} layer`);
          }}
          onDeleteLayer={() => {
            if (session.selectedLayerId) {
              removeLayer(session.selectedLayerId);
            } else {
              setStatusHint("Select a layer to delete.");
            }
          }}
          onMoveLayer={moveLayer}
          onToggleLayerVisibility={toggleLayerVisibility}
          onToggleLayerLock={toggleLayerLock}
          onRenameLayer={(name) => {
            if (!session.selectedLayerId) return;
            renameLayer(session.selectedLayerId, name);
          }}
          onLayerOpacityChange={(opacity) => {
            if (!session.selectedLayerId) return;
            setLayerOpacity(session.selectedLayerId, opacity);
          }}
          onInspectorToggleVisibility={() => {
            if (!session.selectedLayerId) return;
            toggleLayerVisibility(session.selectedLayerId);
          }}
          onInspectorToggleLock={() => {
            if (!session.selectedLayerId) return;
            toggleLayerLock(session.selectedLayerId);
          }}
          onBrushChange={setBrushSetting}
          onTerrainBrushChange={setTerrainBrushSetting}
          onVectorChange={setVectorSetting}
          onSymbolChange={setSymbolSetting}
          onLabelChange={setLabelSetting}
          onExtentChange={setExtentSetting}
          onTerrainGenerationSettingChange={setTerrainGenerationSetting}
          onTerrainDisplaySettingChange={setTerrainDisplaySetting}
          onTerrainSeaLevelChange={setTerrainSeaLevel}
          onGenerateTerrain={generateTerrainForActiveMap}
          onRegenerateTerrain={regenerateTerrainForActiveMap}
          onRandomizeTerrainSeed={randomizeTerrainSeed}
          onRefreshTerrainDerived={refreshTerrainDerivedForActiveMap}
          onCommitExtent={commitExtentSelection}
          onCancelExtent={cancelExtentSelection}
          onSymbolTransformChange={(scale, rotationDegrees) => {
            if (!selectedSymbol) return;
            updateSymbolTransform(selectedSymbol.layerId, selectedSymbol.symbol.id, scale, rotationDegrees);
          }}
          onLabelUpdate={updateLabel}
        />
      </div>

      <StatusBar
        workspaceMode={workspaceMode}
        globeSourceMapName={workspaceMode === "globe" ? rootWorldMap.name : null}
        mapName={activeMap.name}
        zoomPercent={session.canvasStatus.zoomPercent}
        pointerX={session.canvasStatus.pointerDocumentX}
        pointerY={session.canvasStatus.pointerDocumentY}
        visibleChunkCount={session.canvasStatus.visibleChunkCount}
        activeTool={session.activeTool}
        scope={session.activeScope}
        selectedLayerName={selectedLayer?.name ?? null}
        selectionSummary={selectionSummary}
        layerEditableSummary={layerEditableSummary}
        dirty={projectSession.dirty}
        projectStatus={projectSession.status}
        canUndo={session.undoStack.length > 0}
        canRedo={session.redoStack.length > 0}
        hint={session.statusHint}
      />

      <ExportModal
        open={exportModalOpen}
        busy={exportInProgress}
        mapName={activeMap.name}
        mapScope={activeMap.scope}
        mapWidth={activeMap.dimensions.width}
        mapHeight={activeMap.dimensions.height}
        currentViewWidth={currentViewDocumentWidth}
        currentViewHeight={currentViewDocumentHeight}
        onClose={closeExportModal}
        onExport={handleExport}
      />

      <ShortcutHelpModal open={shortcutHelpOpen} onClose={closeShortcutHelp} />
    </div>
  );
}

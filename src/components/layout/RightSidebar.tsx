import { PanelSection } from "../panels/PanelSection";
import { InspectorPanel } from "../panels/InspectorPanel";
import { LayersPanel } from "../panels/LayersPanel";
import { MapNavigatorPanel } from "../panels/MapNavigatorPanel";
import { ToolSettingsPanel } from "../panels/ToolSettingsPanel";
import type {
  EditorSessionState,
  LabelAnnotation,
  LabelUpdatePayload,
  LayerKind,
  MapDocument,
  MapLayerDocument,
  NestedMapLink,
  SelectionTarget,
  SidebarPanelId,
  SymbolInstance,
  TerrainGenerationSettings,
  VectorFeature,
} from "../../types";

interface SelectedVectorContext {
  feature: VectorFeature;
  layerId: string;
}

interface SelectedSymbolContext {
  symbol: SymbolInstance;
  layerId: string;
}

interface SelectedLabelContext {
  label: LabelAnnotation;
  layerId: string;
}

interface SelectedMapLinkContext {
  link: NestedMapLink;
  parentMap: MapDocument | null;
  childMap: MapDocument | null;
}

interface RightSidebarProps {
  activeMap: MapDocument;
  maps: MapDocument[];
  layers: MapLayerDocument[];
  selectedLayerId: string | null;
  selectedLayer: MapLayerDocument | null;
  selectedVector: SelectedVectorContext | null;
  selectedSymbol: SelectedSymbolContext | null;
  selectedLabel: SelectedLabelContext | null;
  selectedMapLink: SelectedMapLinkContext | null;
  activeTool: string;
  selection: SelectionTarget;
  session: EditorSessionState;
  workspaceMode: "flat" | "globe";
  globeSourceMapName: string;
  globeUsingFallbackSource: boolean;
  globeIsStale: boolean;
  onRefreshGlobePreview: () => void;
  panels: Record<SidebarPanelId, { collapsed: boolean; visible: boolean }>;
  onTogglePanel: (panelId: SidebarPanelId) => void;
  onSelectLayer: (layerId: string) => void;
  onSelectMap: (mapId: string) => void;
  onPrepareCreateChildMap: (scope: "region" | "local") => void;
  onOpenParentMap: () => void;
  onOpenChildMapFromLink: (linkId: string) => void;
  onRenameMap: (name: string) => void;
  onAddLayer: (kind: LayerKind) => void;
  onDeleteLayer: () => void;
  onMoveLayer: (layerId: string, direction: "up" | "down") => void;
  onToggleLayerVisibility: (layerId: string) => void;
  onToggleLayerLock: (layerId: string) => void;
  onRenameLayer: (name: string) => void;
  onLayerOpacityChange: (opacity: number) => void;
  onInspectorToggleVisibility: () => void;
  onInspectorToggleLock: () => void;
  onBrushChange: <K extends keyof EditorSessionState["activeBrush"]>(
    key: K,
    value: EditorSessionState["activeBrush"][K],
  ) => void;
  onTerrainBrushChange: <K extends keyof EditorSessionState["activeTerrainBrush"]>(
    key: K,
    value: EditorSessionState["activeTerrainBrush"][K],
  ) => void;
  onVectorChange: <K extends keyof EditorSessionState["activeVector"]>(
    key: K,
    value: EditorSessionState["activeVector"][K],
  ) => void;
  onSymbolChange: <K extends keyof EditorSessionState["activeSymbol"]>(
    key: K,
    value: EditorSessionState["activeSymbol"][K],
  ) => void;
  onLabelChange: <K extends keyof EditorSessionState["activeLabel"]>(
    key: K,
    value: EditorSessionState["activeLabel"][K],
  ) => void;
  onExtentChange: <K extends keyof EditorSessionState["activeExtent"]>(
    key: K,
    value: EditorSessionState["activeExtent"][K],
  ) => void;
  onTerrainGenerationSettingChange: <K extends keyof TerrainGenerationSettings>(
    key: K,
    value: TerrainGenerationSettings[K],
  ) => void;
  onTerrainDisplaySettingChange: <K extends keyof MapDocument["terrain"]["display"]>(
    key: K,
    value: MapDocument["terrain"]["display"][K],
  ) => void;
  onTerrainSeaLevelChange: (seaLevel: number) => void;
  onGenerateTerrain: () => void;
  onRegenerateTerrain: () => void;
  onRandomizeTerrainSeed: () => void;
  onRefreshTerrainDerived: () => void;
  onCommitExtent: () => void;
  onCancelExtent: () => void;
  onSymbolTransformChange: (scale: number, rotationDegrees: number) => void;
  onLabelUpdate: (layerId: string, labelId: string, updates: LabelUpdatePayload, historyLabel?: string) => void;
}

export function RightSidebar({
  activeMap,
  maps,
  layers,
  selectedLayerId,
  selectedLayer,
  selectedVector,
  selectedSymbol,
  selectedLabel,
  selectedMapLink,
  activeTool,
  selection,
  session,
  workspaceMode,
  globeSourceMapName,
  globeUsingFallbackSource,
  globeIsStale,
  onRefreshGlobePreview,
  panels,
  onTogglePanel,
  onSelectLayer,
  onSelectMap,
  onPrepareCreateChildMap,
  onOpenParentMap,
  onOpenChildMapFromLink,
  onRenameMap,
  onAddLayer,
  onDeleteLayer,
  onMoveLayer,
  onToggleLayerVisibility,
  onToggleLayerLock,
  onRenameLayer,
  onLayerOpacityChange,
  onInspectorToggleVisibility,
  onInspectorToggleLock,
  onBrushChange,
  onTerrainBrushChange,
  onVectorChange,
  onSymbolChange,
  onLabelChange,
  onExtentChange,
  onTerrainGenerationSettingChange,
  onTerrainDisplaySettingChange,
  onTerrainSeaLevelChange,
  onGenerateTerrain,
  onRegenerateTerrain,
  onRandomizeTerrainSeed,
  onRefreshTerrainDerived,
  onCommitExtent,
  onCancelExtent,
  onSymbolTransformChange,
  onLabelUpdate,
}: RightSidebarProps) {
  const canCreateRegion = activeMap.scope === "world";
  const canCreateLocal = activeMap.scope === "world" || activeMap.scope === "region";
  const selectedEntityLayerId =
    selection.type === "vector" ||
    selection.type === "vector-vertex" ||
    selection.type === "symbol" ||
    selection.type === "label"
      ? selection.layerId
      : null;

  return (
    <aside className="right-sidebar">
      {panels.maps.visible ? (
        <PanelSection title="Map Navigator" collapsed={panels.maps.collapsed} onToggle={() => onTogglePanel("maps")}>
          <MapNavigatorPanel
            maps={maps}
            activeMapId={activeMap.id}
            onSelectMap={onSelectMap}
            onPrepareCreateChildMap={onPrepareCreateChildMap}
            onOpenParent={onOpenParentMap}
            canOpenParent={Boolean(activeMap.parentMapId)}
            canCreateRegion={canCreateRegion}
            canCreateLocal={canCreateLocal}
          />
        </PanelSection>
      ) : null}

      {panels.layers.visible ? (
        <PanelSection
          title="Layers"
          collapsed={panels.layers.collapsed}
          onToggle={() => onTogglePanel("layers")}
        >
          <LayersPanel
            layers={layers}
            selectedLayerId={selectedLayerId}
            selectedEntityLayerId={selectedEntityLayerId}
            onSelectLayer={onSelectLayer}
            onAddLayer={onAddLayer}
            onDeleteLayer={onDeleteLayer}
            onMoveLayer={onMoveLayer}
            onToggleLayerVisibility={onToggleLayerVisibility}
            onToggleLayerLock={onToggleLayerLock}
          />
        </PanelSection>
      ) : null}

      {panels.inspector.visible ? (
        <PanelSection
          title="Selection / Inspector"
          collapsed={panels.inspector.collapsed}
          onToggle={() => onTogglePanel("inspector")}
        >
          <InspectorPanel
            activeMap={activeMap}
            maps={maps}
            selectedLayer={selectedLayer}
            selectedVector={selectedVector}
            selectedSymbol={selectedSymbol}
            selectedLabel={selectedLabel}
            selectedMapLink={selectedMapLink}
            selection={selection}
            activeTool={activeTool}
            workspaceMode={workspaceMode}
            globeSourceMapName={globeSourceMapName}
            globeUsingFallbackSource={globeUsingFallbackSource}
            globeIsStale={globeIsStale}
            onRenameLayer={onRenameLayer}
            onRenameMap={onRenameMap}
            onOpenMap={onSelectMap}
            onOpenParentMap={onOpenParentMap}
            onOpenChildMapFromLink={onOpenChildMapFromLink}
            onRefreshGlobePreview={onRefreshGlobePreview}
            onOpacityChange={onLayerOpacityChange}
            onToggleVisibility={onInspectorToggleVisibility}
            onToggleLock={onInspectorToggleLock}
            onSymbolTransformChange={onSymbolTransformChange}
            onLabelUpdate={onLabelUpdate}
          />
        </PanelSection>
      ) : null}

      {panels.toolSettings.visible ? (
        <PanelSection
          title="Tool Settings"
          collapsed={panels.toolSettings.collapsed}
          onToggle={() => onTogglePanel("toolSettings")}
        >
          <ToolSettingsPanel
            activeTool={session.activeTool}
            brush={session.activeBrush}
            terrainBrush={session.activeTerrainBrush}
            vector={session.activeVector}
            symbol={session.activeSymbol}
            label={session.activeLabel}
            extent={session.activeExtent}
            terrain={activeMap.terrain}
            activeMapScope={activeMap.scope}
            hasInProgressExtent={Boolean(session.inProgressExtent)}
            canCreateRegion={canCreateRegion}
            canCreateLocal={canCreateLocal}
            selectedLayer={selectedLayer}
            onBrushChange={onBrushChange}
            onTerrainBrushChange={onTerrainBrushChange}
            onVectorChange={onVectorChange}
            onSymbolChange={onSymbolChange}
            onLabelChange={onLabelChange}
            onExtentChange={onExtentChange}
            onTerrainGenerationSettingChange={onTerrainGenerationSettingChange}
            onTerrainDisplaySettingChange={onTerrainDisplaySettingChange}
            onTerrainSeaLevelChange={onTerrainSeaLevelChange}
            onGenerateTerrain={onGenerateTerrain}
            onRegenerateTerrain={onRegenerateTerrain}
            onRandomizeTerrainSeed={onRandomizeTerrainSeed}
            onRefreshTerrainDerived={onRefreshTerrainDerived}
            onCommitExtent={onCommitExtent}
            onCancelExtent={onCancelExtent}
          />
        </PanelSection>
      ) : null}
    </aside>
  );
}

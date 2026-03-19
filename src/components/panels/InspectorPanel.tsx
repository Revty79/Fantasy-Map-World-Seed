import { useState } from "react";
import type {
  LabelAnnotation,
  LabelUpdatePayload,
  MapDocument,
  MapLayerDocument,
  NestedMapLink,
  SelectionTarget,
  SymbolInstance,
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

interface InspectorPanelProps {
  activeMap: MapDocument;
  maps: MapDocument[];
  selectedLayer: MapLayerDocument | null;
  selectedVector: SelectedVectorContext | null;
  selectedSymbol: SelectedSymbolContext | null;
  selectedLabel: SelectedLabelContext | null;
  selectedMapLink: SelectedMapLinkContext | null;
  selection: SelectionTarget;
  activeTool: string;
  workspaceMode: "flat" | "globe";
  globeSourceMapName: string;
  globeUsingFallbackSource: boolean;
  globeIsStale: boolean;
  onRenameLayer: (name: string) => void;
  onRenameMap: (name: string) => void;
  onOpenMap: (mapId: string) => void;
  onOpenParentMap: () => void;
  onOpenChildMapFromLink: (linkId: string) => void;
  onRefreshGlobePreview: () => void;
  onOpacityChange: (opacity: number) => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onSymbolTransformChange: (scale: number, rotationDegrees: number) => void;
  onLabelUpdate: (layerId: string, labelId: string, updates: LabelUpdatePayload, historyLabel?: string) => void;
}

export function InspectorPanel({
  activeMap,
  maps,
  selectedLayer,
  selectedVector,
  selectedSymbol,
  selectedLabel,
  selectedMapLink,
  selection,
  activeTool,
  workspaceMode,
  globeSourceMapName,
  globeUsingFallbackSource,
  globeIsStale,
  onRenameLayer,
  onRenameMap,
  onOpenMap,
  onOpenParentMap,
  onOpenChildMapFromLink,
  onRefreshGlobePreview,
  onOpacityChange,
  onToggleVisibility,
  onToggleLock,
  onSymbolTransformChange,
  onLabelUpdate,
}: InspectorPanelProps) {
  const [labelDraft, setLabelDraft] = useState<{ labelId: string; text: string } | null>(null);
  const [mapNameDraftState, setMapNameDraftState] = useState<{ mapId: string; name: string } | null>(null);

  const mapsById = new Map(maps.map((map) => [map.id, map]));
  const parentMap = activeMap.parentMapId ? mapsById.get(activeMap.parentMapId) ?? null : null;
  const childLinks = Object.values(activeMap.nestedLinks).filter((link) => link.parentMapId === activeMap.id);
  const sourceLink =
    activeMap.parentMapId === null
      ? null
      : Object.values(activeMap.nestedLinks).find(
          (link) => link.childMapId === activeMap.id && link.parentMapId === activeMap.parentMapId,
        ) ?? null;

  const labelDraftText =
    selectedLabel && labelDraft?.labelId === selectedLabel.label.id ? labelDraft.text : selectedLabel?.label.text ?? "";
  const mapNameDraft = mapNameDraftState?.mapId === activeMap.id ? mapNameDraftState.name : activeMap.name;

  const commitLabelText = () => {
    if (!selectedLabel) {
      return;
    }

    const normalizedText = labelDraftText.trim().length > 0 ? labelDraftText : "Untitled label";

    if (normalizedText !== selectedLabel.label.text) {
      onLabelUpdate(selectedLabel.layerId, selectedLabel.label.id, { text: normalizedText }, "Edit label text");
    }

    setLabelDraft(null);
  };

  const commitMapName = () => {
    const normalized = mapNameDraft.trim();

    if (normalized.length === 0) {
      setMapNameDraftState(null);
      return;
    }

    if (normalized !== activeMap.name) {
      onRenameMap(normalized);
    }

    setMapNameDraftState(null);
  };

  const selectedLayerEditState = selectedLayer
    ? !selectedLayer.visible
      ? "Hidden"
      : selectedLayer.locked
        ? "Locked"
        : "Editable"
    : "No layer selected";

  return (
    <div className="inspector-panel">
      <h3 className="inspector-section-title">Context</h3>
      <div className="panel-row">
        <span>Selection</span>
        <strong>{selection.type}</strong>
      </div>
      <div className="panel-row">
        <span>Workspace</span>
        <strong>{workspaceMode === "globe" ? "globe preview" : "flat editor"}</strong>
      </div>
      <div className="panel-row">
        <span>Edit state</span>
        <strong>{selectedLayerEditState}</strong>
      </div>
      {workspaceMode === "globe" ? (
        <>
          <h3 className="inspector-section-title">Globe</h3>
          <div className="panel-row">
            <span>Globe source</span>
            <strong>{globeSourceMapName}</strong>
          </div>
          <div className="panel-row">
            <span>Preview state</span>
            <strong>{globeIsStale ? "stale" : "current"}</strong>
          </div>
          {globeUsingFallbackSource ? (
            <p className="empty-copy">
              Active region/local context is preserved, but globe texture always comes from the root world map.
            </p>
          ) : null}
          <button type="button" className="button button--ghost" onClick={onRefreshGlobePreview}>
            Refresh Globe Texture
          </button>
        </>
      ) : null}

      {selectedVector ? (
        <>
          <h3 className="inspector-section-title">Vector</h3>
          <div className="panel-row">
            <span>Vector id</span>
            <strong>{selectedVector.feature.id.slice(0, 12)}</strong>
          </div>
          <div className="panel-row">
            <span>Category</span>
            <strong>{selectedVector.feature.category}</strong>
          </div>
          <div className="panel-row">
            <span>Layer</span>
            <strong>{selectedLayer?.name ?? selectedVector.layerId}</strong>
          </div>
          <div className="panel-row">
            <span>Vertices</span>
            <strong>{selectedVector.feature.points.length}</strong>
          </div>
          <div className="panel-row">
            <span>Geometry</span>
            <strong>{selectedVector.feature.closed ? "closed" : "open"}</strong>
          </div>
          <div className="panel-row">
            <span>Stroke</span>
            <strong>{selectedVector.feature.style.strokeWidth.toFixed(1)}</strong>
          </div>
          <p className="empty-copy">Drag vertex handles to reshape. `Delete` removes the selected feature.</p>
        </>
      ) : selectedSymbol ? (
        <>
          <h3 className="inspector-section-title">Symbol</h3>
          <div className="panel-row">
            <span>Symbol</span>
            <strong>{selectedSymbol.symbol.symbolKey}</strong>
          </div>
          <div className="panel-row">
            <span>Category</span>
            <strong>{selectedSymbol.symbol.category}</strong>
          </div>
          <div className="panel-row">
            <span>Layer</span>
            <strong>{selectedLayer?.name ?? selectedSymbol.layerId}</strong>
          </div>
          <div className="panel-row">
            <span>Position</span>
            <strong>
              {selectedSymbol.symbol.position.x.toFixed(0)}, {selectedSymbol.symbol.position.y.toFixed(0)}
            </strong>
          </div>
          <label className="field-grid field-grid--compact">
            <span>Scale</span>
            <input
              type="number"
              min={0.2}
              max={6}
              step={0.1}
              value={selectedSymbol.symbol.scale}
              onChange={(event) =>
                onSymbolTransformChange(Number(event.target.value), selectedSymbol.symbol.rotationDegrees)
              }
            />
          </label>
          <label className="field-grid field-grid--compact">
            <span>Rotation</span>
            <input
              type="number"
              min={-360}
              max={360}
              step={1}
              value={selectedSymbol.symbol.rotationDegrees}
              onChange={(event) =>
                onSymbolTransformChange(selectedSymbol.symbol.scale, Number(event.target.value))
              }
            />
          </label>
          <p className="empty-copy">Drag the symbol to move. Arrow keys nudge. `Delete` removes.</p>
        </>
      ) : selectedLabel ? (
        <>
          <h3 className="inspector-section-title">Label</h3>
          <div className="panel-row">
            <span>Label id</span>
            <strong>{selectedLabel.label.id.slice(0, 12)}</strong>
          </div>
          <div className="panel-row">
            <span>Layer</span>
            <strong>{selectedLayer?.name ?? selectedLabel.layerId}</strong>
          </div>
          <div className="panel-row">
            <span>Position</span>
            <strong>
              {selectedLabel.label.position.x.toFixed(0)}, {selectedLabel.label.position.y.toFixed(0)}
            </strong>
          </div>
          <label className="field-grid field-grid--compact">
            <span>Text</span>
            <textarea
              rows={3}
              value={labelDraftText}
              autoFocus
              onChange={(event) =>
                setLabelDraft({
                  labelId: selectedLabel.label.id,
                  text: event.target.value,
                })
              }
              onBlur={commitLabelText}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  commitLabelText();
                  event.currentTarget.blur();
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  setLabelDraft(null);
                  event.currentTarget.blur();
                }
              }}
            />
          </label>
          <label className="field-grid field-grid--compact">
            <span>Category</span>
            <select
              value={selectedLabel.label.category}
              onChange={(event) =>
                onLabelUpdate(
                  selectedLabel.layerId,
                  selectedLabel.label.id,
                  { category: event.target.value as LabelAnnotation["category"] },
                  "Set label category",
                )
              }
            >
              <option value="world">World / Continent</option>
              <option value="ocean">Ocean / Water</option>
              <option value="region">Region / Realm</option>
              <option value="settlement">Settlement</option>
              <option value="landmark">Landmark</option>
              <option value="annotation">Annotation / Note</option>
            </select>
          </label>
          <label className="field-grid field-grid--compact">
            <span>Font size</span>
            <input
              type="number"
              min={8}
              max={240}
              step={1}
              value={selectedLabel.label.style.fontSize}
              onChange={(event) =>
                onLabelUpdate(
                  selectedLabel.layerId,
                  selectedLabel.label.id,
                  { style: { fontSize: Number(event.target.value) } },
                  "Set label font size",
                )
              }
            />
          </label>
          <label className="field-grid field-grid--compact">
            <span>Weight</span>
            <input
              type="number"
              min={100}
              max={900}
              step={100}
              value={selectedLabel.label.style.fontWeight}
              onChange={(event) =>
                onLabelUpdate(
                  selectedLabel.layerId,
                  selectedLabel.label.id,
                  { style: { fontWeight: Number(event.target.value) } },
                  "Set label weight",
                )
              }
            />
          </label>
          <label className="field-grid field-grid--compact">
            <span>Color</span>
            <input
              type="color"
              value={selectedLabel.label.style.color}
              onChange={(event) =>
                onLabelUpdate(
                  selectedLabel.layerId,
                  selectedLabel.label.id,
                  { style: { color: event.target.value } },
                  "Set label color",
                )
              }
            />
          </label>
          <label className="field-grid field-grid--compact">
            <span>Opacity</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={selectedLabel.label.style.opacity}
              onChange={(event) =>
                onLabelUpdate(
                  selectedLabel.layerId,
                  selectedLabel.label.id,
                  { style: { opacity: Number(event.target.value) } },
                  "Set label opacity",
                )
              }
            />
          </label>
          <label className="field-grid field-grid--compact">
            <span>Alignment</span>
            <select
              value={selectedLabel.label.style.align}
              onChange={(event) => {
                const align = event.target.value as LabelAnnotation["style"]["align"];
                const anchorX = align === "left" ? 0 : align === "right" ? 1 : 0.5;
                onLabelUpdate(
                  selectedLabel.layerId,
                  selectedLabel.label.id,
                  {
                    style: { align },
                    anchorX,
                  },
                  "Set label alignment",
                );
              }}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
          <label className="field-grid field-grid--compact">
            <span>Rotation</span>
            <input
              type="number"
              min={-360}
              max={360}
              step={1}
              value={selectedLabel.label.rotationDegrees}
              onChange={(event) =>
                onLabelUpdate(
                  selectedLabel.layerId,
                  selectedLabel.label.id,
                  { rotationDegrees: Number(event.target.value) },
                  "Rotate label",
                )
              }
            />
          </label>
          <label className="field-grid field-grid--compact">
            <span>Anchor Y</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={selectedLabel.label.anchorY}
              onChange={(event) =>
                onLabelUpdate(
                  selectedLabel.layerId,
                  selectedLabel.label.id,
                  { anchorY: Number(event.target.value) },
                  "Set label anchor",
                )
              }
            />
          </label>
          <p className="empty-copy">Drag label to move. Double-click or press `Enter` to quick-edit text.</p>
        </>
      ) : selectedMapLink ? (
        <>
          <h3 className="inspector-section-title">Map Relationship</h3>
          <div className="panel-row">
            <span>Relationship</span>
            <strong>{selectedMapLink.link.relationshipKind}</strong>
          </div>
          <div className="panel-row">
            <span>Parent</span>
            <strong>{selectedMapLink.parentMap?.name ?? selectedMapLink.link.parentMapId}</strong>
          </div>
          <div className="panel-row">
            <span>Child</span>
            <strong>{selectedMapLink.childMap?.name ?? selectedMapLink.link.childMapId}</strong>
          </div>
          <div className="panel-row">
            <span>Child scope</span>
            <strong>{selectedMapLink.link.childScope}</strong>
          </div>
          <div className="panel-row">
            <span>Parent extent</span>
            <strong>
              {Math.round(selectedMapLink.link.parentExtent.x)}, {Math.round(selectedMapLink.link.parentExtent.y)} /{" "}
              {Math.round(selectedMapLink.link.parentExtent.width)} x{" "}
              {Math.round(selectedMapLink.link.parentExtent.height)}
            </strong>
          </div>
          <div className="panel-row">
            <span>Inheritance</span>
            <strong>{selectedMapLink.link.inheritanceMode}</strong>
          </div>
          <div className="panel-actions panel-actions--inspector">
            <button
              type="button"
              className="button button--ghost"
              onClick={() => onOpenChildMapFromLink(selectedMapLink.link.id)}
              disabled={!selectedMapLink.childMap}
            >
              Open Child
            </button>
            <button type="button" className="button button--ghost" onClick={onOpenParentMap}>
              Open Parent
            </button>
          </div>
          <p className="empty-copy">
            Child maps stay anchored to this extent while remaining independent authoring spaces.
          </p>
        </>
      ) : selectedLayer ? (
        <>
          <h3 className="inspector-section-title">Layer</h3>
          <label className="field-grid field-grid--compact">
            <span>Layer name</span>
            <input type="text" value={selectedLayer.name} onChange={(event) => onRenameLayer(event.target.value)} />
          </label>

          <div className="panel-row">
            <span>Kind</span>
            <strong>{selectedLayer.kind}</strong>
          </div>
          <div className="panel-row">
            <span>Visible</span>
            <strong>{selectedLayer.visible ? "Yes" : "No"}</strong>
          </div>
          <div className="panel-row">
            <span>Locked</span>
            <strong>{selectedLayer.locked ? "Yes" : "No"}</strong>
          </div>
          <div className="panel-row">
            <span>Edit state</span>
            <strong>{selectedLayerEditState}</strong>
          </div>
          {selectedLayer.kind === "paint" || selectedLayer.kind === "mask" || selectedLayer.kind === "dataOverlay" ? (
            <div className="panel-row">
              <span>Paint chunks</span>
              <strong>{Object.keys(selectedLayer.chunks).length}</strong>
            </div>
          ) : null}
          {selectedLayer.kind === "paint" || selectedLayer.kind === "mask" ? (
            <div className="panel-row">
              <span>Paint mode</span>
              <strong>{selectedLayer.paintMode}</strong>
            </div>
          ) : null}
          {selectedLayer.kind === "dataOverlay" ? (
            <div className="panel-row">
              <span>Overlay mode</span>
              <strong>{selectedLayer.settings.mode}</strong>
            </div>
          ) : null}
          <label className="field-grid field-grid--compact">
            <span>Opacity ({Math.round(selectedLayer.opacity * 100)}%)</span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(selectedLayer.opacity * 100)}
              onChange={(event) => onOpacityChange(Number(event.target.value) / 100)}
            />
          </label>
          <div className="panel-actions panel-actions--inspector">
            <button type="button" className="button button--ghost" onClick={onToggleVisibility}>
              {selectedLayer.visible ? "Hide" : "Show"}
            </button>
            <button type="button" className="button button--ghost" onClick={onToggleLock}>
              {selectedLayer.locked ? "Unlock" : "Lock"}
            </button>
          </div>
          {!selectedLayer.visible || selectedLayer.locked ? (
            <p className="empty-copy empty-copy--warning">This layer is not currently editable on canvas.</p>
          ) : null}
        </>
      ) : (
        <>
          <h3 className="inspector-section-title">Map</h3>
          <label className="field-grid field-grid--compact">
            <span>Map name</span>
            <input
              type="text"
              value={mapNameDraft}
              onChange={(event) =>
                setMapNameDraftState({
                  mapId: activeMap.id,
                  name: event.target.value,
                })
              }
              onBlur={commitMapName}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitMapName();
                  event.currentTarget.blur();
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  setMapNameDraftState(null);
                  event.currentTarget.blur();
                }
              }}
            />
          </label>
          <div className="panel-row">
            <span>Active map</span>
            <strong>{activeMap.name}</strong>
          </div>
          <div className="panel-row">
            <span>Scope</span>
            <strong>{activeMap.scope}</strong>
          </div>
          <div className="panel-row">
            <span>Parent</span>
            <strong>{parentMap ? parentMap.name : "None (root world map)"}</strong>
          </div>
          <div className="panel-row">
            <span>Children</span>
            <strong>{childLinks.length}</strong>
          </div>
          {sourceLink ? (
            <div className="panel-row">
              <span>Source extent</span>
              <strong>
                {Math.round(sourceLink.parentExtent.width)} x {Math.round(sourceLink.parentExtent.height)}
              </strong>
            </div>
          ) : null}
          <div className="panel-row">
            <span>Tool</span>
            <strong>{activeTool}</strong>
          </div>
          {parentMap ? (
            <button type="button" className="button button--ghost" onClick={() => onOpenMap(parentMap.id)}>
              Open Parent Map
            </button>
          ) : null}
          {childLinks.length > 0 ? (
            <div className="map-link-list">
              {childLinks.map((link) => {
                const childMap = mapsById.get(link.childMapId) ?? null;

                return (
                  <button
                    key={link.id}
                    type="button"
                    className="map-link-row"
                    onClick={() => onOpenMap(link.childMapId)}
                    disabled={!childMap}
                  >
                    <span>{childMap?.name ?? link.childMapId}</span>
                    <strong>{link.childScope}</strong>
                  </button>
                );
              })}
            </div>
          ) : null}
          {childLinks.length === 0 ? <p className="empty-copy">No child maps yet. Use Extent tool or Map Navigator to create one.</p> : null}
          <p className="empty-copy">Select a layer, feature, symbol, label, or extent to edit targeted properties.</p>
        </>
      )}
    </div>
  );
}

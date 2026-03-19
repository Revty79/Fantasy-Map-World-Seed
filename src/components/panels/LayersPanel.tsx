import { useState } from "react";
import type { LayerKind, MapLayerDocument } from "../../types";

interface LayersPanelProps {
  layers: MapLayerDocument[];
  selectedLayerId: string | null;
  selectedEntityLayerId: string | null;
  onSelectLayer: (layerId: string) => void;
  onAddLayer: (kind: LayerKind) => void;
  onDeleteLayer: () => void;
  onMoveLayer: (layerId: string, direction: "up" | "down") => void;
  onToggleLayerVisibility: (layerId: string) => void;
  onToggleLayerLock: (layerId: string) => void;
}

const ADDABLE_LAYER_KINDS: LayerKind[] = [
  "vector",
  "paint",
  "mask",
  "symbol",
  "label",
  "dataOverlay",
  "group",
];

const layerKindLabel = (kind: LayerKind): string => {
  if (kind === "dataOverlay") {
    return "data";
  }

  return kind;
};

const getLayerContentHint = (layer: MapLayerDocument): string => {
  switch (layer.kind) {
    case "vector":
      return `${layer.featureOrder.length} features`;
    case "symbol":
      return `${layer.symbolOrder.length} symbols`;
    case "label":
      return `${layer.labelOrder.length} labels`;
    case "group":
      return `${layer.childLayerIds.length} children`;
    case "paint":
    case "mask":
    case "dataOverlay":
      return `${Object.keys(layer.chunks).length} chunks`;
    default:
      return "empty";
  }
};

export function LayersPanel({
  layers,
  selectedLayerId,
  selectedEntityLayerId,
  onSelectLayer,
  onAddLayer,
  onDeleteLayer,
  onMoveLayer,
  onToggleLayerVisibility,
  onToggleLayerLock,
}: LayersPanelProps) {
  const [newLayerKind, setNewLayerKind] = useState<LayerKind>("vector");

  return (
    <div className="layers-panel">
      <div className="panel-actions panel-actions--wide">
        <select
          aria-label="Layer kind"
          value={newLayerKind}
          title="New layer kind"
          onChange={(event) => setNewLayerKind(event.target.value as LayerKind)}
        >
          {ADDABLE_LAYER_KINDS.map((kind) => (
            <option key={kind} value={kind}>
              {layerKindLabel(kind)}
            </option>
          ))}
        </select>
        <button type="button" className="button button--ghost" title="Add selected layer type" onClick={() => onAddLayer(newLayerKind)}>
          Add
        </button>
        <button type="button" className="button button--ghost" title="Delete selected layer (Delete)" onClick={onDeleteLayer}>
          Delete
        </button>
      </div>

      <p className="panel-caption">Top rows render above lower rows. Active row controls the target layer.</p>

      <div className="layer-list" role="listbox" aria-label="Layer list">
        {layers.map((layer, index) => {
          const isActive = selectedLayerId === layer.id;
          const isSelectionOwner = selectedEntityLayerId === layer.id;
          const isChildLayer = Boolean(layer.parentGroupId);
          const groupChildCount = layer.kind === "group" ? layer.childLayerIds.length : 0;
          const editability =
            !layer.visible ? "hidden" : layer.locked ? "locked" : "editable";

          return (
            <div
              key={layer.id}
              className={`layer-row ${isActive ? "is-active" : ""} ${isSelectionOwner ? "is-selection-owner" : ""} ${isChildLayer ? "is-child" : ""}`}
              role="option"
              aria-selected={isActive}
              onClick={() => onSelectLayer(layer.id)}
            >
              <button
                type="button"
                className="layer-flag"
                title={layer.visible ? "Hide layer" : "Show layer"}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleLayerVisibility(layer.id);
                }}
              >
                {layer.visible ? "Eye" : "Off"}
              </button>
              <button
                type="button"
                className="layer-flag"
                title={layer.locked ? "Unlock layer" : "Lock layer"}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleLayerLock(layer.id);
                }}
              >
                {layer.locked ? "Lock" : "Free"}
              </button>
              <div className="layer-body">
                <div className="layer-body__title">
                  <strong>{layer.name}</strong>
                  <span className="layer-kind-badge">{layerKindLabel(layer.kind)}</span>
                </div>
                <span>{getLayerContentHint(layer)}</span>
                <span>
                  {Math.round(layer.opacity * 100)}% opacity
                  {layer.kind === "group" ? ` | ${groupChildCount} children` : ""} | {editability}
                </span>
              </div>
              <div className="layer-move">
                <button
                  type="button"
                  className="layer-flag"
                  title="Move up"
                  disabled={index === layers.length - 1}
                  onClick={(event) => {
                    event.stopPropagation();
                    onMoveLayer(layer.id, "up");
                  }}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="layer-flag"
                  title="Move down"
                  disabled={index === 0}
                  onClick={(event) => {
                    event.stopPropagation();
                    onMoveLayer(layer.id, "down");
                  }}
                >
                  Dn
                </button>
              </div>
              {isSelectionOwner ? <span className="layer-selection-badge">Selection</span> : null}
            </div>
          );
        })}
        {layers.length === 0 ? (
          <p className="empty-copy">No layers yet. Add a vector, paint, symbol, or label layer to start authoring.</p>
        ) : null}
      </div>
    </div>
  );
}

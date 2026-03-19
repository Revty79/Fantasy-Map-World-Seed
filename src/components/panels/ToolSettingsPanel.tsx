import type { EditorSessionState, EditorToolId, MapLayerDocument, MapScope } from "../../types";
import { STARTER_SYMBOLS } from "../../lib/assets/starterSymbols";
import { formatToolShortcut } from "../../features/shortcuts/shortcuts";

interface ToolSettingsPanelProps {
  activeTool: EditorToolId;
  brush: EditorSessionState["activeBrush"];
  vector: EditorSessionState["activeVector"];
  symbol: EditorSessionState["activeSymbol"];
  label: EditorSessionState["activeLabel"];
  extent: EditorSessionState["activeExtent"];
  activeMapScope: MapScope;
  hasInProgressExtent: boolean;
  canCreateRegion: boolean;
  canCreateLocal: boolean;
  selectedLayer: MapLayerDocument | null;
  onBrushChange: <K extends keyof EditorSessionState["activeBrush"]>(
    key: K,
    value: EditorSessionState["activeBrush"][K],
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
  onCommitExtent: () => void;
  onCancelExtent: () => void;
}

const VECTOR_TOOLS = new Set<EditorToolId>(["coastline", "river", "border", "road"]);
const PAINT_TOOLS = new Set<EditorToolId>(["paint", "erase"]);

const getToolDisplayName = (tool: EditorToolId): string => {
  switch (tool) {
    case "coastline":
      return "Coastline";
    case "river":
      return "River";
    case "border":
      return "Border";
    case "road":
      return "Road";
    default:
      return tool[0].toUpperCase() + tool.slice(1);
  }
};

const getLayerCompatibility = (tool: EditorToolId, selectedLayer: MapLayerDocument | null) => {
  if (!selectedLayer) {
    return {
      summary: "No layer selected",
      warning: "Select a target layer before editing with this tool.",
      isCompatible: false,
    };
  }

  if (!selectedLayer.visible) {
    return {
      summary: "Layer hidden",
      warning: `"${selectedLayer.name}" is hidden. Show it before editing.`,
      isCompatible: false,
    };
  }

  if (selectedLayer.locked) {
    return {
      summary: "Layer locked",
      warning: `"${selectedLayer.name}" is locked. Unlock it before editing.`,
      isCompatible: false,
    };
  }

  if (VECTOR_TOOLS.has(tool) && selectedLayer.kind !== "vector") {
    return {
      summary: `Incompatible (${selectedLayer.kind})`,
      warning: "Vector tools require a vector layer target.",
      isCompatible: false,
    };
  }

  if (PAINT_TOOLS.has(tool) && selectedLayer.kind !== "paint" && selectedLayer.kind !== "mask" && selectedLayer.kind !== "dataOverlay") {
    return {
      summary: `Incompatible (${selectedLayer.kind})`,
      warning: "Paint and erase require a paint, mask, or data overlay layer.",
      isCompatible: false,
    };
  }

  if (tool === "symbol" && selectedLayer.kind !== "symbol") {
    return {
      summary: `Incompatible (${selectedLayer.kind})`,
      warning: "Symbol placement requires a symbol layer.",
      isCompatible: false,
    };
  }

  if (tool === "label" && selectedLayer.kind !== "label") {
    return {
      summary: `Incompatible (${selectedLayer.kind})`,
      warning: "Label placement requires a label layer.",
      isCompatible: false,
    };
  }

  return {
    summary: "Editable",
    warning: null as string | null,
    isCompatible: true,
  };
};

export function ToolSettingsPanel({
  activeTool,
  brush,
  vector,
  symbol,
  label,
  extent,
  activeMapScope,
  hasInProgressExtent,
  canCreateRegion,
  canCreateLocal,
  selectedLayer,
  onBrushChange,
  onVectorChange,
  onSymbolChange,
  onLabelChange,
  onExtentChange,
  onCommitExtent,
  onCancelExtent,
}: ToolSettingsPanelProps) {
  const toolName = getToolDisplayName(activeTool);
  const toolShortcut = formatToolShortcut(activeTool);
  const layerCompatibility = getLayerCompatibility(activeTool, selectedLayer);
  const noExtentTargets = !canCreateRegion && !canCreateLocal;
  const showLayerCompatibility = activeTool !== "select" && activeTool !== "pan" && activeTool !== "extent";

  return (
    <div className="tool-settings-panel">
      <div className="panel-row panel-row--emphasis">
        <span>Active tool</span>
        <strong>{toolName}</strong>
      </div>
      <div className="panel-row">
        <span>Shortcut</span>
        <strong>{toolShortcut || "None"}</strong>
      </div>

      {showLayerCompatibility ? (
        <>
          <div className="panel-row">
            <span>Target layer</span>
            <strong>{selectedLayer ? `${selectedLayer.name} (${selectedLayer.kind})` : "None selected"}</strong>
          </div>
          <div className="panel-row">
            <span>Edit state</span>
            <strong>{layerCompatibility.summary}</strong>
          </div>
          {layerCompatibility.warning ? <p className="empty-copy empty-copy--warning">{layerCompatibility.warning}</p> : null}
        </>
      ) : null}

      {PAINT_TOOLS.has(activeTool) ? (
        <>
          <section className="field-group">
            <h3>Brush</h3>
            <div className="field-grid">
              <label>
                Mode
                <input type="text" value={brush.mode} readOnly />
              </label>
              <label>
                Size
                <input
                  type="number"
                  min={1}
                  max={256}
                  value={brush.size}
                  onChange={(event) => onBrushChange("size", Number(event.target.value))}
                />
              </label>
              <label>
                Strength
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={brush.opacity}
                  onChange={(event) => onBrushChange("opacity", Number(event.target.value))}
                />
              </label>
              <label>
                Hardness
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={brush.hardness}
                  onChange={(event) => onBrushChange("hardness", Number(event.target.value))}
                />
              </label>
            </div>
          </section>

          <section className="field-group">
            <h3>Sample</h3>
            <div className="field-grid">
              <label>
                Category
                <select value={brush.category} onChange={(event) => onBrushChange("category", event.target.value)}>
                  <option value="land">Land</option>
                  <option value="ocean">Ocean</option>
                  <option value="forest">Forest</option>
                  <option value="desert">Desert</option>
                  <option value="weather">Weather</option>
                  <option value="custom">Custom</option>
                </select>
              </label>
              <label>
                Value
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  value={brush.value}
                  onChange={(event) => onBrushChange("value", Number(event.target.value))}
                />
              </label>
              <label>
                Color
                <input type="color" value={brush.color} onChange={(event) => onBrushChange("color", event.target.value)} />
              </label>
            </div>
          </section>
        </>
      ) : null}

      {VECTOR_TOOLS.has(activeTool) ? (
        <>
          <section className="field-group">
            <h3>Stroke</h3>
            <div className="field-grid">
              <label>
                Category
                <select
                  value={vector.category}
                  onChange={(event) =>
                    onVectorChange("category", event.target.value as EditorSessionState["activeVector"]["category"])
                  }
                >
                  <option value="coastline">Coastline</option>
                  <option value="river">River</option>
                  <option value="border">Border</option>
                  <option value="road">Road</option>
                  <option value="path">Path</option>
                  <option value="polygon">Polygon</option>
                </select>
              </label>
              <label>
                Width
                <input
                  type="number"
                  min={1}
                  max={32}
                  value={vector.strokeWidth}
                  onChange={(event) => onVectorChange("strokeWidth", Number(event.target.value))}
                />
              </label>
              <label>
                Stroke color
                <input
                  type="color"
                  value={vector.strokeColor}
                  onChange={(event) => onVectorChange("strokeColor", event.target.value)}
                />
              </label>
              <label>
                Fill color
                <input
                  type="color"
                  value={vector.fillColor}
                  onChange={(event) => onVectorChange("fillColor", event.target.value)}
                />
              </label>
              <label>
                Closed geometry
                <select
                  value={vector.closed ? "yes" : "no"}
                  onChange={(event) => onVectorChange("closed", event.target.value === "yes")}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </label>
            </div>
          </section>
          <p className="empty-copy">Click to add vertices, `Enter` to commit, `Escape` to cancel in-progress geometry.</p>
        </>
      ) : null}

      {activeTool === "symbol" ? (
        <section className="field-group">
          <h3>Placement</h3>
          <div className="field-grid">
            <label>
              Symbol
              <select value={symbol.symbolKey} onChange={(event) => onSymbolChange("symbolKey", event.target.value)}>
                {STARTER_SYMBOLS.map((entry) => (
                  <option key={entry.key} value={entry.key}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Category
              <select value={symbol.category} onChange={(event) => onSymbolChange("category", event.target.value)}>
                <option value="mountains">Mountains</option>
                <option value="hills">Hills</option>
                <option value="forests">Forests</option>
                <option value="settlements">Settlements</option>
                <option value="structures">Structures</option>
                <option value="landmarks">Landmarks</option>
              </select>
            </label>
            <label>
              Scale
              <input
                type="number"
                min={0.1}
                max={6}
                step={0.1}
                value={symbol.scale}
                onChange={(event) => onSymbolChange("scale", Number(event.target.value))}
              />
            </label>
            <label>
              Rotation
              <input
                type="number"
                min={-360}
                max={360}
                step={1}
                value={symbol.rotationDegrees}
                onChange={(event) => onSymbolChange("rotationDegrees", Number(event.target.value))}
              />
            </label>
            <label>
              Tint
              <input type="color" value={symbol.tint} onChange={(event) => onSymbolChange("tint", event.target.value)} />
            </label>
          </div>
          <p className="empty-copy">Click to place symbols. Drag to move selected symbols. `Ctrl/Cmd+D` duplicates selection.</p>
        </section>
      ) : null}

      {activeTool === "label" ? (
        <>
          <section className="field-group">
            <h3>Text defaults</h3>
            <div className="field-grid">
              <label>
                Default text
                <input
                  type="text"
                  value={label.defaultText}
                  onChange={(event) => onLabelChange("defaultText", event.target.value)}
                />
              </label>
              <label>
                Category
                <select
                  value={label.category}
                  onChange={(event) =>
                    onLabelChange("category", event.target.value as EditorSessionState["activeLabel"]["category"])
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
            </div>
          </section>

          <section className="field-group">
            <h3>Style defaults</h3>
            <div className="field-grid">
              <label>
                Font family
                <input type="text" value={label.fontFamily} onChange={(event) => onLabelChange("fontFamily", event.target.value)} />
              </label>
              <label>
                Size
                <input
                  type="number"
                  min={8}
                  max={120}
                  value={label.fontSize}
                  onChange={(event) => onLabelChange("fontSize", Number(event.target.value))}
                />
              </label>
              <label>
                Weight
                <input
                  type="number"
                  min={100}
                  max={900}
                  step={100}
                  value={label.fontWeight}
                  onChange={(event) => onLabelChange("fontWeight", Number(event.target.value))}
                />
              </label>
              <label>
                Color
                <input type="color" value={label.color} onChange={(event) => onLabelChange("color", event.target.value)} />
              </label>
              <label>
                Opacity
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={label.opacity}
                  onChange={(event) => onLabelChange("opacity", Number(event.target.value))}
                />
              </label>
              <label>
                Alignment
                <select
                  value={label.alignment}
                  onChange={(event) =>
                    onLabelChange("alignment", event.target.value as EditorSessionState["activeLabel"]["alignment"])
                  }
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </label>
              <label>
                Rotation
                <input
                  type="number"
                  min={-360}
                  max={360}
                  step={1}
                  value={label.rotationDegrees}
                  onChange={(event) => onLabelChange("rotationDegrees", Number(event.target.value))}
                />
              </label>
            </div>
          </section>
          <p className="empty-copy">Double-click selected labels to quick edit text. Inspector shows full transform controls.</p>
        </>
      ) : null}

      {activeTool === "extent" ? (
        <section className="field-group">
          <h3>Child map creation</h3>
          <div className="field-grid">
            <label>
              Child scope
              <select
                value={extent.childScope}
                disabled={noExtentTargets}
                onChange={(event) =>
                  onExtentChange("childScope", event.target.value as EditorSessionState["activeExtent"]["childScope"])
                }
              >
                {canCreateRegion ? <option value="region">Region</option> : null}
                {canCreateLocal ? <option value="local">Local</option> : null}
              </select>
            </label>
            <label>
              Navigate on create
              <select
                value={extent.autoNavigateToChild ? "yes" : "no"}
                onChange={(event) => onExtentChange("autoNavigateToChild", event.target.value === "yes")}
              >
                <option value="yes">Yes</option>
                <option value="no">Stay on parent</option>
              </select>
            </label>
            <div className="panel-row">
              <span>Parent scope</span>
              <strong>{activeMapScope}</strong>
            </div>
            <div className="panel-actions panel-actions--inspector">
              <button
                type="button"
                className="button button--primary"
                onClick={onCommitExtent}
                disabled={!hasInProgressExtent || noExtentTargets}
              >
                Create Child
              </button>
              <button type="button" className="button button--ghost" onClick={onCancelExtent}>
                Cancel
              </button>
            </div>
          </div>

          {noExtentTargets ? (
            <p className="empty-copy">Open a world or region map to create a nested child map extent.</p>
          ) : !hasInProgressExtent ? (
            <p className="empty-copy">Drag on canvas to define a child extent, then confirm with `Enter` or Create Child.</p>
          ) : (
            <p className="empty-copy">Extent ready. Press `Enter` to create the child map.</p>
          )}
        </section>
      ) : null}

      {!PAINT_TOOLS.has(activeTool) && !VECTOR_TOOLS.has(activeTool) && activeTool !== "symbol" && activeTool !== "label" && activeTool !== "extent" ? (
        <section className="field-group">
          <h3>Tool overview</h3>
          <p className="empty-copy">Select a drawing tool to edit style presets and placement defaults. Use `?` for all shortcuts.</p>
        </section>
      ) : null}
    </div>
  );
}

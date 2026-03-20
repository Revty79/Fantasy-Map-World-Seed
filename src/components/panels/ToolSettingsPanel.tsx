import type {
  EditorSessionState,
  EditorToolId,
  MapLayerDocument,
  MapScope,
  MapTerrainDocument,
  TerrainGenerationSettings,
} from "../../types";
import { STARTER_SYMBOLS } from "../../lib/assets/starterSymbols";
import { formatToolShortcut } from "../../features/shortcuts/shortcuts";

interface ToolSettingsPanelProps {
  activeTool: EditorToolId;
  brush: EditorSessionState["activeBrush"];
  terrainBrush: EditorSessionState["activeTerrainBrush"];
  vector: EditorSessionState["activeVector"];
  symbol: EditorSessionState["activeSymbol"];
  label: EditorSessionState["activeLabel"];
  extent: EditorSessionState["activeExtent"];
  terrain: MapTerrainDocument;
  activeMapScope: MapScope;
  hasInProgressExtent: boolean;
  canCreateRegion: boolean;
  canCreateLocal: boolean;
  selectedLayer: MapLayerDocument | null;
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
  onTerrainDisplaySettingChange: <K extends keyof MapTerrainDocument["display"]>(
    key: K,
    value: MapTerrainDocument["display"][K],
  ) => void;
  onTerrainSeaLevelChange: (seaLevel: number) => void;
  onGenerateTerrain: () => void;
  onRegenerateTerrain: () => void;
  onRandomizeTerrainSeed: () => void;
  onRefreshTerrainDerived: () => void;
  onCommitExtent: () => void;
  onCancelExtent: () => void;
}

const VECTOR_TOOLS = new Set<EditorToolId>(["coastline", "river", "border", "road"]);
const PAINT_TOOLS = new Set<EditorToolId>(["paint", "erase"]);
const TERRAIN_SCULPT_TOOLS = new Set<EditorSessionState["activeTerrainBrush"]["tool"]>([
  "raise",
  "lower",
  "smooth",
  "flatten",
]);

const getToolDisplayName = (tool: EditorToolId): string => {
  switch (tool) {
    case "terrain":
      return "Terrain Sculpt";
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
  if (tool === "terrain") {
    return {
      summary: "Terrain source",
      warning: null as string | null,
      isCompatible: true,
    };
  }

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
  terrainBrush,
  vector,
  symbol,
  label,
  extent,
  terrain,
  activeMapScope,
  hasInProgressExtent,
  canCreateRegion,
  canCreateLocal,
  selectedLayer,
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
}: ToolSettingsPanelProps) {
  const toolName = getToolDisplayName(activeTool);
  const toolShortcut = formatToolShortcut(activeTool);
  const layerCompatibility = getLayerCompatibility(activeTool, selectedLayer);
  const noExtentTargets = !canCreateRegion && !canCreateLocal;
  const showLayerCompatibility =
    activeTool !== "select" && activeTool !== "pan" && activeTool !== "extent" && activeTool !== "terrain";
  const terrainSettings = terrain.generation.settings;

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

      {activeTool === "terrain" ? (
        <section className="field-group">
          <h3>Terrain sculpt</h3>
          <div className="field-grid">
            <label>
              Operation
              <select
                value={terrainBrush.tool}
                onChange={(event) => {
                  const value = event.target.value as EditorSessionState["activeTerrainBrush"]["tool"];
                  if (TERRAIN_SCULPT_TOOLS.has(value)) {
                    onTerrainBrushChange("tool", value);
                  }
                }}
              >
                <option value="raise">Raise</option>
                <option value="lower">Lower</option>
                <option value="smooth">Smooth</option>
                <option value="flatten">Flatten / Level</option>
              </select>
            </label>
            <label>
              Size
              <input
                type="number"
                min={1}
                max={4096}
                step={1}
                value={terrainBrush.size}
                onChange={(event) => onTerrainBrushChange("size", Number(event.target.value))}
              />
            </label>
            <label>
              Strength
              <input
                type="range"
                min={0.01}
                max={1}
                step={0.01}
                value={terrainBrush.strength}
                onChange={(event) => onTerrainBrushChange("strength", Number(event.target.value))}
              />
            </label>
            <label>
              Hardness
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={terrainBrush.hardness}
                onChange={(event) => onTerrainBrushChange("hardness", Number(event.target.value))}
              />
            </label>
            <label>
              Flatten target
              <input
                type="number"
                min={-1}
                max={1}
                step={0.01}
                value={terrainBrush.flattenTarget}
                onChange={(event) => onTerrainBrushChange("flattenTarget", Number(event.target.value))}
              />
            </label>
          </div>
          {terrainBrush.tool === "flatten" ? (
            <p className="empty-copy">Flatten blends terrain toward the target elevation inside the brush radius.</p>
          ) : terrainBrush.tool === "smooth" ? (
            <p className="empty-copy">Smooth averages local elevations while preserving macro form with strength and falloff.</p>
          ) : (
            <p className="empty-copy">Drag on the map to sculpt elevation directly. Undo/redo works per stroke.</p>
          )}
        </section>
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

      <section className="field-group">
        <h3>Terrain generation</h3>
        <div className="field-grid">
          <label>
            Seed
            <input
              type="number"
              step={1}
              value={terrainSettings.seed}
              onChange={(event) => onTerrainGenerationSettingChange("seed", Number(event.target.value))}
            />
          </label>
          <label>
            Generator
            <select
              value={terrainSettings.generator}
              onChange={(event) =>
                onTerrainGenerationSettingChange(
                  "generator",
                  event.target.value as TerrainGenerationSettings["generator"],
                )
              }
            >
              <option value="fbm-simplex">FBM (simplex-like)</option>
              <option value="fbm-perlin">FBM (perlin-like)</option>
              <option value="ridged-multifractal">Ridged multifractal</option>
              <option value="none">Macro-only</option>
              <option value="custom">Custom</option>
            </select>
          </label>
          <label>
            Sea level
            <input
              type="number"
              min={-1}
              max={1}
              step={0.01}
              value={terrain.seaLevel}
              onChange={(event) => onTerrainSeaLevelChange(Number(event.target.value))}
            />
          </label>
          <label>
            Frequency
            <input
              type="number"
              min={0.0001}
              max={100}
              step={0.01}
              value={terrainSettings.frequency}
              onChange={(event) => onTerrainGenerationSettingChange("frequency", Number(event.target.value))}
            />
          </label>
          <label>
            Octaves
            <input
              type="number"
              min={1}
              max={12}
              step={1}
              value={terrainSettings.octaves}
              onChange={(event) => onTerrainGenerationSettingChange("octaves", Number(event.target.value))}
            />
          </label>
          <label>
            Lacunarity
            <input
              type="number"
              min={0.1}
              max={10}
              step={0.05}
              value={terrainSettings.lacunarity}
              onChange={(event) => onTerrainGenerationSettingChange("lacunarity", Number(event.target.value))}
            />
          </label>
          <label>
            Persistence
            <input
              type="number"
              min={0}
              max={1}
              step={0.01}
              value={terrainSettings.persistence}
              onChange={(event) => onTerrainGenerationSettingChange("persistence", Number(event.target.value))}
            />
          </label>
          <label>
            Amplitude
            <input
              type="number"
              min={0}
              max={4}
              step={0.05}
              value={terrainSettings.amplitude}
              onChange={(event) => onTerrainGenerationSettingChange("amplitude", Number(event.target.value))}
            />
          </label>
          <label>
            Warp strength
            <input
              type="number"
              min={0}
              max={10}
              step={0.05}
              value={terrainSettings.warp}
              onChange={(event) => onTerrainGenerationSettingChange("warp", Number(event.target.value))}
            />
          </label>
          <label>
            Continent freq
            <input
              type="number"
              min={0.01}
              max={10}
              step={0.01}
              value={terrainSettings.continentFrequency}
              onChange={(event) => onTerrainGenerationSettingChange("continentFrequency", Number(event.target.value))}
            />
          </label>
          <label>
            Continent strength
            <input
              type="number"
              min={0}
              max={1}
              step={0.01}
              value={terrainSettings.continentStrength}
              onChange={(event) => onTerrainGenerationSettingChange("continentStrength", Number(event.target.value))}
            />
          </label>
        </div>
        <p className="empty-copy">
          Continent controls drive macro world shape: higher `Continent strength` yields more/larger landmasses, while
          lower `Continent freq` yields fewer, broader continents.
        </p>
        <div className="field-grid">
          <label>
            Display mode
            <select
              value={terrain.display.renderMode}
              onChange={(event) =>
                onTerrainDisplaySettingChange(
                  "renderMode",
                  event.target.value as MapTerrainDocument["display"]["renderMode"],
                )
              }
            >
              <option value="hypsometric">Colored elevation</option>
              <option value="grayscale">Grayscale height</option>
              <option value="shaded-relief">Shaded relief</option>
              <option value="land-water">Land / Water</option>
              <option value="contour-preview">Contour preview</option>
            </select>
          </label>
          <label>
            Vertical exaggeration
            <input
              type="number"
              min={0.1}
              max={10}
              step={0.1}
              value={terrain.display.verticalExaggeration}
              onChange={(event) => onTerrainDisplaySettingChange("verticalExaggeration", Number(event.target.value))}
            />
          </label>
          <label>
            Hillshade strength
            <input
              type="number"
              min={0}
              max={2}
              step={0.05}
              value={terrain.display.hillshadeStrength}
              onChange={(event) => onTerrainDisplaySettingChange("hillshadeStrength", Number(event.target.value))}
            />
          </label>
          <label>
            Show contours
            <select
              value={terrain.display.showContours ? "yes" : "no"}
              onChange={(event) => onTerrainDisplaySettingChange("showContours", event.target.value === "yes")}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
          <label>
            Contour interval
            <input
              type="number"
              min={0.005}
              max={1}
              step={0.005}
              value={terrain.display.contourInterval}
              onChange={(event) => onTerrainDisplaySettingChange("contourInterval", Number(event.target.value))}
            />
          </label>
          <label>
            Derived coastline
            <select
              value={terrain.display.showDerivedCoastline ? "yes" : "no"}
              onChange={(event) => onTerrainDisplaySettingChange("showDerivedCoastline", event.target.value === "yes")}
            >
              <option value="no">Hidden</option>
              <option value="yes">Visible</option>
            </select>
          </label>
          <label>
            Land/water overlay
            <select
              value={terrain.display.showLandWaterOverlay ? "yes" : "no"}
              onChange={(event) => onTerrainDisplaySettingChange("showLandWaterOverlay", event.target.value === "yes")}
            >
              <option value="no">Off</option>
              <option value="yes">On</option>
            </select>
          </label>
        </div>
        <div className="panel-row">
          <span>Generated</span>
          <strong>{terrain.generation.hasGenerated ? "Yes" : "No"}</strong>
        </div>
        <div className="panel-row">
          <span>Revision</span>
          <strong>{terrain.generation.revision}</strong>
        </div>
        <div className="panel-row">
          <span>Derived cache</span>
          <strong>{terrain.derived.cachedAt ? "Ready" : "Not built"}</strong>
        </div>
        <div className="panel-row">
          <span>Derived coastline</span>
          <strong>{terrain.derived.coastlineSegmentCount}</strong>
        </div>
        <div className="panel-row">
          <span>Land / Water samples</span>
          <strong>{terrain.derived.landSampleCount} / {terrain.derived.waterSampleCount}</strong>
        </div>
        <p className="empty-copy">
          Derived coastline is a non-destructive terrain overlay and does not overwrite authored coastline vectors.
        </p>
        <div className="panel-actions panel-actions--inspector">
          <button type="button" className="button button--ghost" onClick={onRandomizeTerrainSeed}>
            Randomize Seed
          </button>
          <button type="button" className="button button--primary" onClick={onGenerateTerrain}>
            Generate New
          </button>
          <button type="button" className="button button--ghost" onClick={onRegenerateTerrain}>
            Regenerate
          </button>
          <button type="button" className="button button--ghost" onClick={onRefreshTerrainDerived}>
            Refresh Derived
          </button>
        </div>
      </section>

      {!PAINT_TOOLS.has(activeTool) &&
      !VECTOR_TOOLS.has(activeTool) &&
      activeTool !== "symbol" &&
      activeTool !== "label" &&
      activeTool !== "extent" &&
      activeTool !== "terrain" ? (
        <section className="field-group">
          <h3>Tool overview</h3>
          <p className="empty-copy">Select a drawing tool to edit style presets and placement defaults. Use `?` for all shortcuts.</p>
        </section>
      ) : null}
    </div>
  );
}

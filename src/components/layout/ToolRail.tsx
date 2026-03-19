import type { EditorToolId } from "../../types/editor";
import { formatToolShortcut } from "../../features/shortcuts/shortcuts";

interface ToolDefinition {
  id: EditorToolId;
  label: string;
  hint: string;
}

interface ToolRailProps {
  activeTool: EditorToolId;
  onSelectTool: (toolId: EditorToolId) => void;
}

const TOOL_DEFINITIONS: ToolDefinition[] = [
  { id: "select", label: "Select", hint: "Selection and editing" },
  { id: "pan", label: "Pan", hint: "Move camera" },
  { id: "coastline", label: "Coast", hint: "Land boundaries" },
  { id: "river", label: "River", hint: "River lines" },
  { id: "border", label: "Border", hint: "Political borders" },
  { id: "road", label: "Road", hint: "Road network" },
  { id: "paint", label: "Paint", hint: "Overlay paint" },
  { id: "erase", label: "Erase", hint: "Erase paint" },
  { id: "symbol", label: "Symbol", hint: "Terrain and features" },
  { id: "label", label: "Label", hint: "Map labels" },
  { id: "extent", label: "Extent", hint: "Create child maps" },
];

export function ToolRail({ activeTool, onSelectTool }: ToolRailProps) {
  return (
    <aside className="tool-rail" aria-label="Tool rail">
      {TOOL_DEFINITIONS.map((tool) => {
        const shortcut = formatToolShortcut(tool.id);
        return (
          <button
            key={tool.id}
            type="button"
            className={`tool-rail__button ${activeTool === tool.id ? "is-active" : ""}`}
            onClick={() => onSelectTool(tool.id)}
            title={`${tool.label}${shortcut ? ` (${shortcut})` : ""}: ${tool.hint}`}
          >
            <span className="tool-rail__label-row">
              <span className="tool-rail__label">{tool.label}</span>
              {shortcut ? <kbd className="tool-rail__shortcut">{shortcut}</kbd> : null}
            </span>
            <span className="tool-rail__hint">{tool.hint}</span>
          </button>
        );
      })}
    </aside>
  );
}

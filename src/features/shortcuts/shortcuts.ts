import type { EditorToolId } from "../../types";

export interface ShortcutEntry {
  combo: string;
  description: string;
  category: "Tools" | "Edit" | "Project" | "View" | "Panels";
}

export const TOOL_SHORTCUTS: Record<EditorToolId, string | null> = {
  select: "V",
  pan: "H",
  terrain: "Q",
  coastline: "C",
  river: "R",
  border: "B",
  road: "D",
  paint: "P",
  erase: "E",
  symbol: "Y",
  label: "T",
  extent: "M",
};

export const TOOL_SHORTCUT_KEY_TO_TOOL: Record<string, EditorToolId> = {
  v: "select",
  h: "pan",
  q: "terrain",
  c: "coastline",
  r: "river",
  b: "border",
  d: "road",
  p: "paint",
  e: "erase",
  y: "symbol",
  t: "label",
  m: "extent",
};

export const SHORTCUT_REFERENCE: ShortcutEntry[] = [
  { combo: "V", description: "Select tool", category: "Tools" },
  { combo: "H", description: "Pan tool", category: "Tools" },
  { combo: "Q", description: "Terrain sculpt tool", category: "Tools" },
  { combo: "C", description: "Coastline tool", category: "Tools" },
  { combo: "R", description: "River tool", category: "Tools" },
  { combo: "B", description: "Border tool", category: "Tools" },
  { combo: "D", description: "Road tool", category: "Tools" },
  { combo: "P", description: "Paint tool", category: "Tools" },
  { combo: "E", description: "Erase tool", category: "Tools" },
  { combo: "Y", description: "Symbol tool", category: "Tools" },
  { combo: "T", description: "Label tool", category: "Tools" },
  { combo: "M", description: "Nested-map extent tool", category: "Tools" },
  { combo: "Ctrl/Cmd+Z", description: "Undo", category: "Edit" },
  { combo: "Ctrl/Cmd+Shift+Z", description: "Redo", category: "Edit" },
  { combo: "Ctrl/Cmd+Y", description: "Redo (alternate)", category: "Edit" },
  { combo: "Delete", description: "Delete selected item", category: "Edit" },
  { combo: "Ctrl/Cmd+D", description: "Duplicate selection", category: "Edit" },
  { combo: "Enter", description: "Commit vector/extent or open selected child map", category: "Edit" },
  { combo: "Escape", description: "Cancel vector draw or extent mode", category: "Edit" },
  { combo: "Arrows", description: "Nudge selected vector/symbol/label", category: "Edit" },
  { combo: "Shift+Arrows", description: "Nudge by 10 units", category: "Edit" },
  { combo: "Ctrl/Cmd+S", description: "Save project", category: "Project" },
  { combo: "Ctrl/Cmd+Shift+S", description: "Save project as", category: "Project" },
  { combo: "Ctrl/Cmd+O", description: "Open project", category: "Project" },
  { combo: "Ctrl/Cmd+N", description: "New project", category: "Project" },
  { combo: "Ctrl/Cmd+E", description: "Export active map", category: "Project" },
  { combo: "F", description: "Zoom to fit active map", category: "View" },
  { combo: "0", description: "Reset view", category: "View" },
  { combo: "G", description: "Toggle globe preview", category: "View" },
  { combo: "1", description: "Toggle map navigator panel", category: "Panels" },
  { combo: "2", description: "Toggle layers panel", category: "Panels" },
  { combo: "3", description: "Toggle inspector panel", category: "Panels" },
  { combo: "4", description: "Toggle tool settings panel", category: "Panels" },
  { combo: "?", description: "Open shortcut reference", category: "Panels" },
];

export const SHORTCUT_HELP_KEYS = ["?", "F1"] as const;

export const formatToolShortcut = (toolId: EditorToolId): string => {
  return TOOL_SHORTCUTS[toolId] ?? "";
};

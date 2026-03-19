import type { EditorToolId } from "../../types/editor";
import type { MapScope } from "../../types/maps";

const SCOPE_SET = new Set<MapScope>(["world", "region", "local"]);
const TOOL_SET = new Set<EditorToolId>([
  "select",
  "pan",
  "coastline",
  "river",
  "border",
  "road",
  "paint",
  "erase",
  "symbol",
  "label",
  "extent",
]);

export const isMapScope = (value: unknown): value is MapScope => {
  return typeof value === "string" && SCOPE_SET.has(value as MapScope);
};

export const isEditorToolId = (value: unknown): value is EditorToolId => {
  return typeof value === "string" && TOOL_SET.has(value as EditorToolId);
};

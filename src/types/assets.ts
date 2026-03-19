import type { DocumentEntityMeta, DocumentId } from "./common";

export type AssetId = DocumentId;
export type AssetSource = "builtin" | "project" | "external";

export type AssetKind =
  | "symbol"
  | "brush"
  | "texture"
  | "referenceImage"
  | "font"
  | "palette"
  | "stamp";

export interface AssetReference {
  id: AssetId;
  key: string;
  kind: AssetKind;
  source: AssetSource;
  relativePath: string;
  format?: string;
  width?: number;
  height?: number;
  metadata: Record<string, string | number | boolean>;
  meta: DocumentEntityMeta;
}

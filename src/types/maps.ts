import type { DocumentEntityMeta, DocumentId, DocumentRect, NormalizedRect } from "./common";
import type { LayerId, MapLayerDocument } from "./layers";
import type { MapTerrainDocument } from "./terrain";

export type MapId = DocumentId;

export type MapScope = "world" | "region" | "local";

export type MapProjectionKind = "equirectangular" | "mercator" | "orthographic" | "custom";

export interface MapProjection {
  kind: MapProjectionKind;
  unitLabel: "world-unit" | "degree";
  wrapsHorizontally: boolean;
}

export interface MapDimensions {
  width: number;
  height: number;
}

export type MapRelationshipKind = "region-from-parent" | "local-from-parent" | "detail-inset";

export interface NestedMapLink {
  id: DocumentId;
  parentMapId: MapId;
  childMapId: MapId;
  childScope: MapScope;
  relationshipKind: MapRelationshipKind;
  parentExtent: DocumentRect;
  normalizedParentExtent: NormalizedRect;
  inheritanceMode: "anchored-independent" | "anchored-with-copied-settings";
  meta: DocumentEntityMeta;
}

export interface MapDocumentSettings {
  backgroundColor: string;
  gridEnabled: boolean;
  guidesEnabled: boolean;
  chunkSize: number;
  cellSize: number;
}

export interface MapDocument {
  id: MapId;
  name: string;
  scope: MapScope;
  parentMapId: MapId | null;
  childMapIds: MapId[];
  projection: MapProjection;
  dimensions: MapDimensions;
  layerOrder: LayerId[];
  layers: Record<LayerId, MapLayerDocument>;
  nestedLinks: Record<DocumentId, NestedMapLink>;
  terrain: MapTerrainDocument;
  settings: MapDocumentSettings;
  meta: DocumentEntityMeta;
}

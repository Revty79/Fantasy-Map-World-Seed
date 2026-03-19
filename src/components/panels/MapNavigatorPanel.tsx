import type { ReactElement } from "react";
import type { MapDocument } from "../../types";

interface MapNavigatorPanelProps {
  maps: MapDocument[];
  activeMapId: string;
  onSelectMap: (mapId: string) => void;
  onPrepareCreateChildMap: (scope: "region" | "local") => void;
  onOpenParent: () => void;
  canOpenParent: boolean;
  canCreateRegion: boolean;
  canCreateLocal: boolean;
}

export function MapNavigatorPanel({
  maps,
  activeMapId,
  onSelectMap,
  onPrepareCreateChildMap,
  onOpenParent,
  canOpenParent,
  canCreateRegion,
  canCreateLocal,
}: MapNavigatorPanelProps) {
  const orderById = new Map(maps.map((map, index) => [map.id, index]));
  const childrenByParent = new Map<string | null, MapDocument[]>();

  for (const map of maps) {
    const key = map.parentMapId;
    const bucket = childrenByParent.get(key) ?? [];
    bucket.push(map);
    childrenByParent.set(key, bucket);
  }

  for (const childMaps of childrenByParent.values()) {
    childMaps.sort((left, right) => (orderById.get(left.id) ?? 0) - (orderById.get(right.id) ?? 0));
  }

  const renderTree = (map: MapDocument, depth: number): ReactElement[] => {
    const children = childrenByParent.get(map.id) ?? [];
    const childLabel = map.childMapIds.length === 1 ? "1 child" : `${map.childMapIds.length} children`;

    const rows: ReactElement[] = [
      <button
        key={map.id}
        type="button"
        className={`map-row map-row--tree ${map.id === activeMapId ? "is-active" : ""}`}
        onClick={() => onSelectMap(map.id)}
        style={{ paddingLeft: `${0.5 + depth * 0.8}rem` }}
      >
        <span title={map.name}>{map.name}</span>
        <div className="map-row__meta">
          <strong>{map.scope.toUpperCase()}</strong>
          {map.childMapIds.length > 0 ? <em>{childLabel}</em> : null}
        </div>
      </button>,
    ];

    for (const child of children) {
      rows.push(...renderTree(child, depth + 1));
    }

    return rows;
  };

  const rootMaps = childrenByParent.get(null) ?? [];

  return (
    <div className="map-navigator-panel">
      <p className="panel-caption">Project hierarchy</p>
      <div className="panel-actions panel-actions--maps">
        <button
          type="button"
          className="button button--ghost"
          onClick={() => onPrepareCreateChildMap("region")}
          disabled={!canCreateRegion}
        >
          Create Region
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => onPrepareCreateChildMap("local")}
          disabled={!canCreateLocal}
        >
          Create Local
        </button>
        <button type="button" className="button button--ghost" onClick={onOpenParent} disabled={!canOpenParent}>
          Open Parent
        </button>
      </div>
      {!canCreateRegion && !canCreateLocal ? (
        <p className="empty-copy">Local maps are leaf scopes in Phase 1. Open a world or region map to create children.</p>
      ) : null}
      <div className="map-list">
        {rootMaps.length > 0 ? (
          rootMaps.flatMap((map) => renderTree(map, 0))
        ) : (
          <p className="empty-copy">No maps loaded.</p>
        )}
      </div>
    </div>
  );
}

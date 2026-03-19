import { useEffect, useState } from "react";
import type { MapScope } from "../../types";
import type { ExportFormat, ExportRequest } from "../../lib/export";

interface ExportModalProps {
  open: boolean;
  busy: boolean;
  mapName: string;
  mapScope: MapScope;
  mapWidth: number;
  mapHeight: number;
  currentViewWidth: number;
  currentViewHeight: number;
  onClose: () => void;
  onExport: (request: ExportRequest) => Promise<void>;
}

const DEFAULT_SCALE = 1;

export function ExportModal({
  open,
  busy,
  mapName,
  mapScope,
  mapWidth,
  mapHeight,
  currentViewWidth,
  currentViewHeight,
  onClose,
  onExport,
}: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>("png");
  const [area, setArea] = useState<ExportRequest["area"]>("full-map");
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(DEFAULT_SCALE);
  const [transparentBackground, setTransparentBackground] = useState<boolean>(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [busy, onClose, open]);

  if (!open) {
    return null;
  }

  const supportsBackgroundToggle = format === "png" || format === "svg";
  const supportsRasterSizing = format === "png" || format === "svg";
  const safeScale = Number.isFinite(scaleMultiplier) && scaleMultiplier > 0 ? scaleMultiplier : DEFAULT_SCALE;
  const estimatedWidth = area === "full-map" ? mapWidth : Math.max(1, currentViewWidth);
  const estimatedHeight = area === "full-map" ? mapHeight : Math.max(1, currentViewHeight);
  const outputWidth = Math.max(1, Math.round(estimatedWidth * safeScale));
  const outputHeight = Math.max(1, Math.round(estimatedHeight * safeScale));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onExport({
      format,
      area,
      scaleMultiplier: supportsRasterSizing ? safeScale : 1,
      transparentBackground: supportsBackgroundToggle ? transparentBackground : false,
    });
  };

  return (
    <div className="export-modal-backdrop" role="presentation" onMouseDown={busy ? undefined : onClose}>
      <div
        className="export-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Export active map"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="export-modal__header">
          <div>
            <h2>Export Map</h2>
            <p>
              {mapName} ({mapScope.toUpperCase()})
            </p>
          </div>
          <button type="button" className="button button--ghost" onClick={onClose} disabled={busy}>
            Close
          </button>
        </header>

        <form className="export-modal__body" onSubmit={handleSubmit}>
          <label>
            Format
            <select value={format} onChange={(event) => setFormat(event.target.value as ExportFormat)} disabled={busy}>
              <option value="png">PNG raster image</option>
              <option value="svg">SVG vector export</option>
              <option value="json">JSON data export</option>
            </select>
          </label>

          <label>
            Source Area
            <select value={area} onChange={(event) => setArea(event.target.value as ExportRequest["area"])} disabled={busy}>
              <option value="full-map">Full active map ({mapWidth} x {mapHeight})</option>
              <option value="current-view">Current view ({currentViewWidth} x {currentViewHeight})</option>
            </select>
          </label>

          <label>
            Scale Multiplier
            <input
              type="number"
              min={0.25}
              max={8}
              step={0.25}
              value={scaleMultiplier}
              disabled={busy || !supportsRasterSizing}
              onChange={(event) => setScaleMultiplier(Number(event.target.value))}
            />
          </label>

          <label className="export-modal__checkbox">
            <input
              type="checkbox"
              checked={transparentBackground}
              disabled={busy || !supportsBackgroundToggle}
              onChange={(event) => setTransparentBackground(event.target.checked)}
            />
            Transparent background
          </label>

          <p className="export-modal__note">
            Inclusion rules: visible layers export, hidden layers do not, locked layers still export when visible, and editor overlays/debug guides are excluded.
          </p>

          <p className="export-modal__note">
            Estimated output: {outputWidth} x {outputHeight} px
          </p>

          <footer className="export-modal__actions">
            <button type="button" className="button button--ghost" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button type="submit" className="button button--primary" disabled={busy}>
              {busy ? "Exporting..." : `Export ${format.toUpperCase()}`}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}


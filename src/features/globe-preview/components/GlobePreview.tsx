import { useCallback, useEffect, useRef, useState } from "react";
import { GlobePreviewEngine } from "../../../engine/globe/GlobePreviewEngine";
import type { MapScope } from "../../../types";

interface GlobePreviewProps {
  activeMapName: string;
  activeMapScope: MapScope;
  sourceMapName: string;
  usingFallbackWorldSource: boolean;
  textureCanvas: HTMLCanvasElement | null;
  textureWidth: number | null;
  textureHeight: number | null;
  generatedAt: string | null;
  warnings: string[];
  isLoading: boolean;
  isStale: boolean;
  errorMessage: string | null;
  onRefresh: () => void;
  onExit: () => void;
}

const formatGeneratedAt = (timestamp: string | null): string => {
  if (!timestamp) {
    return "Not generated yet";
  }

  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return timestamp;
  }

  return parsed.toLocaleString();
};

export function GlobePreview({
  activeMapName,
  activeMapScope,
  sourceMapName,
  usingFallbackWorldSource,
  textureCanvas,
  textureWidth,
  textureHeight,
  generatedAt,
  warnings,
  isLoading,
  isStale,
  errorMessage,
  onRefresh,
  onExit,
}: GlobePreviewProps) {
  const hostElementRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GlobePreviewEngine | null>(null);
  const resizeCleanupRef = useRef<(() => void) | null>(null);
  const [engineError, setEngineError] = useState<string | null>(null);
  const [fallbackTextureDataUrl, setFallbackTextureDataUrl] = useState<string | null>(null);

  const disposeEngine = useCallback(() => {
    if (resizeCleanupRef.current) {
      resizeCleanupRef.current();
      resizeCleanupRef.current = null;
    }

    if (engineRef.current) {
      engineRef.current.dispose();
      engineRef.current = null;
    }
  }, []);

  const setHostElement = useCallback(
    (host: HTMLDivElement | null) => {
      if (hostElementRef.current === host) {
        return;
      }

      disposeEngine();
      hostElementRef.current = host;

      if (!host) {
        return;
      }

      const engine = new GlobePreviewEngine(host);

      try {
        engine.initialize();
        setEngineError(null);
      } catch (error) {
        setEngineError(error instanceof Error ? error.message : String(error));
        return;
      }

      engineRef.current = engine;

      if (typeof ResizeObserver !== "undefined") {
        const resizeObserver = new ResizeObserver(() => {
          engine.resize();
        });
        resizeObserver.observe(host);
        resizeCleanupRef.current = () => resizeObserver.disconnect();
      } else {
        const handleWindowResize = () => {
          engine.resize();
        };
        window.addEventListener("resize", handleWindowResize);
        resizeCleanupRef.current = () => {
          window.removeEventListener("resize", handleWindowResize);
        };
      }
    },
    [disposeEngine]
  );

  useEffect(() => {
    return () => {
      hostElementRef.current = null;
      disposeEngine();
    };
  }, [disposeEngine]);

  useEffect(() => {
    if (!textureCanvas) {
      return;
    }

    engineRef.current?.setTextureFromCanvas(textureCanvas);
  }, [textureCanvas]);

  useEffect(() => {
    if (!textureCanvas) {
      setFallbackTextureDataUrl(null);
      return;
    }

    try {
      setFallbackTextureDataUrl(textureCanvas.toDataURL("image/png"));
    } catch {
      setFallbackTextureDataUrl(null);
    }
  }, [textureCanvas]);

  const handleResetView = useCallback(() => {
    engineRef.current?.resetView();
  }, []);

  const previewStatus = isLoading
    ? "Rendering world texture..."
    : engineError
      ? fallbackTextureDataUrl
        ? `WebGL unavailable (${engineError}). Showing a flat texture fallback.`
        : `WebGL unavailable: ${engineError}`
      : errorMessage
        ? errorMessage
        : isStale
          ? "Preview may be stale. Refresh to sync world edits."
          : "Preview is up to date.";

  return (
    <div className="globe-preview">
      <div ref={setHostElement} className={`globe-preview__host ${engineError ? "is-hidden" : ""}`} />
      {engineError ? (
        <div className="globe-preview__fallback" role="img" aria-label="Flat world texture fallback">
          {fallbackTextureDataUrl ? (
            <img src={fallbackTextureDataUrl} alt="Flat world texture fallback preview" />
          ) : (
            <p className="globe-preview__fallback-empty">Texture unavailable. Use Refresh to rebuild preview.</p>
          )}
        </div>
      ) : null}

      <aside className="globe-preview__overlay">
        <h2>Globe Preview</h2>
        <div className="globe-preview__row">
          <strong>Source world</strong>
          <span>{sourceMapName}</span>
        </div>
        <div className="globe-preview__row">
          <strong>Active map</strong>
          <span>
            {activeMapName} ({activeMapScope})
          </span>
        </div>
        <div className="globe-preview__row">
          <strong>Texture</strong>
          <span>
            {textureWidth && textureHeight ? `${textureWidth} x ${textureHeight}` : "Not available"}
          </span>
        </div>
        <div className="globe-preview__row">
          <strong>Generated</strong>
          <span>{formatGeneratedAt(generatedAt)}</span>
        </div>

        <div className="globe-preview__actions">
          <button type="button" className="button button--ghost" onClick={onRefresh} disabled={isLoading}>
            Refresh
          </button>
          <button type="button" className="button button--ghost" onClick={handleResetView}>
            Reset View
          </button>
          <button type="button" className="button button--primary" onClick={onExit}>
            Return To Flat
          </button>
        </div>

        <p className="globe-preview__note">{previewStatus}</p>
        <p className="globe-preview__note">
          Globe texture is terrain-aware and sourced from the root world map render truth.
        </p>
        {usingFallbackWorldSource ? (
          <p className="globe-preview__note">
            Globe mode always uses the root world map. The active {activeMapScope} map is shown as context only.
          </p>
        ) : null}
        {warnings.length > 0 ? <p className="globe-preview__note">{warnings[0]}</p> : null}
      </aside>
    </div>
  );
}

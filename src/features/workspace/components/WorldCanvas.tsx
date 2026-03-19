import { useEffect, useMemo, useRef } from "react";
import { WorldCanvasEngine } from "../../../engine/canvas/WorldCanvasEngine";
import type { CanvasRenderInput } from "../../../engine/canvas/types";

interface WorldCanvasProps {
  input: CanvasRenderInput;
  onViewChange: (nextView: CanvasRenderInput["view"]) => void;
  onPointerMove: (x: number | null, y: number | null) => void;
  onVisibleChunksChange: (count: number) => void;
}

export function WorldCanvas({ input, onViewChange, onPointerMove, onVisibleChunksChange }: WorldCanvasProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<WorldCanvasEngine | null>(null);

  const latestCallbacks = useRef({
    onViewChange,
    onPointerMove,
    onVisibleChunksChange,
  });

  useEffect(() => {
    latestCallbacks.current = {
      onViewChange,
      onPointerMove,
      onVisibleChunksChange,
    };
  }, [onViewChange, onPointerMove, onVisibleChunksChange]);

  const renderInput = useMemo(() => input, [input]);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    const engine = new WorldCanvasEngine(host, {
      onViewChange: (nextView) => latestCallbacks.current.onViewChange(nextView),
      onPointerMove: (x, y) => latestCallbacks.current.onPointerMove(x, y),
      onVisibleChunksChange: (count) => latestCallbacks.current.onVisibleChunksChange(count),
    });

    engineRef.current = engine;

    engine.init().catch((error) => {
        console.error("Failed to initialize Pixi canvas", error);
      });

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    engineRef.current?.update(renderInput);
  }, [renderInput]);

  return <div ref={hostRef} className="world-canvas-host" />;
}

import { useEffect, useRef } from "react";
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
  const latestInputRef = useRef(input);

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

  useEffect(() => {
    latestInputRef.current = input;
  }, [input]);

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
    let disposed = false;

    engine.init().then(() => {
      if (disposed) {
        engine.destroy();
        return;
      }

      engine.update(latestInputRef.current);
    }).catch((error) => {
        console.error("Failed to initialize Pixi canvas", error);
      });

    return () => {
      disposed = true;
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    latestInputRef.current = input;
    engineRef.current?.update(input);
  }, [input]);

  return <div ref={hostRef} className="world-canvas-host" />;
}

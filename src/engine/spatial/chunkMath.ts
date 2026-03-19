import type { ViewRect } from "../camera/cameraMath";

export interface ChunkAddress {
  x: number;
  y: number;
  key: `${number}:${number}`;
}

export interface ChunkRange {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export const getChunkRangeForRect = (
  rect: ViewRect,
  chunkSize: number,
  worldWidth: number,
  worldHeight: number,
): ChunkRange => {
  const minX = Math.max(0, Math.floor(rect.minX / chunkSize));
  const minY = Math.max(0, Math.floor(rect.minY / chunkSize));
  const maxX = Math.min(Math.ceil(worldWidth / chunkSize) - 1, Math.floor(rect.maxX / chunkSize));
  const maxY = Math.min(Math.ceil(worldHeight / chunkSize) - 1, Math.floor(rect.maxY / chunkSize));

  return {
    minX,
    minY,
    maxX,
    maxY,
  };
};

export const getVisibleChunks = (
  rect: ViewRect,
  chunkSize: number,
  worldWidth: number,
  worldHeight: number,
): ChunkAddress[] => {
  const range = getChunkRangeForRect(rect, chunkSize, worldWidth, worldHeight);
  const chunks: ChunkAddress[] = [];

  for (let y = range.minY; y <= range.maxY; y += 1) {
    for (let x = range.minX; x <= range.maxX; x += 1) {
      chunks.push({
        x,
        y,
        key: `${x}:${y}`,
      });
    }
  }

  return chunks;
};

import type { MapDocument, MapTerrainDocument } from "../../types";

export interface TerrainRoundTripSnapshot {
  mapId: string;
  width: number;
  height: number;
  seaLevel: number;
  generationRevision: number;
  chunkCount: number;
  sampleResolution: number;
  chunkSize: number;
  checksum: number;
}

export interface TerrainRoundTripCheckResult {
  ok: boolean;
  issues: string[];
}

const round = (value: number, precision = 6): number => {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
};

const computeTerrainChecksum = (terrain: MapTerrainDocument): number => {
  let total = 0;

  for (const chunk of Object.values(terrain.storage.chunks)) {
    for (const sample of chunk.samples) {
      total += sample;
    }
  }

  return round(total, 4);
};

export const createTerrainRoundTripSnapshot = (map: MapDocument): TerrainRoundTripSnapshot => {
  return {
    mapId: map.id,
    width: map.terrain.width,
    height: map.terrain.height,
    seaLevel: round(map.terrain.seaLevel, 6),
    generationRevision: map.terrain.generation.revision,
    chunkCount: Object.keys(map.terrain.storage.chunks).length,
    sampleResolution: map.terrain.storage.sampleResolution,
    chunkSize: map.terrain.storage.chunkSize,
    checksum: computeTerrainChecksum(map.terrain),
  };
};

export const checkTerrainRoundTrip = (
  before: TerrainRoundTripSnapshot,
  after: TerrainRoundTripSnapshot,
): TerrainRoundTripCheckResult => {
  const issues: string[] = [];

  if (before.mapId !== after.mapId) {
    issues.push(`Map id mismatch (${before.mapId} vs ${after.mapId}).`);
  }

  if (before.width !== after.width || before.height !== after.height) {
    issues.push(
      `Terrain dimensions changed (${before.width}x${before.height} -> ${after.width}x${after.height}).`,
    );
  }

  if (before.seaLevel !== after.seaLevel) {
    issues.push(`Sea level changed (${before.seaLevel} -> ${after.seaLevel}).`);
  }

  if (before.generationRevision !== after.generationRevision) {
    issues.push(
      `Generation revision changed (${before.generationRevision} -> ${after.generationRevision}).`,
    );
  }

  if (before.chunkCount !== after.chunkCount) {
    issues.push(`Chunk count changed (${before.chunkCount} -> ${after.chunkCount}).`);
  }

  if (before.sampleResolution !== after.sampleResolution) {
    issues.push(`Sample resolution changed (${before.sampleResolution} -> ${after.sampleResolution}).`);
  }

  if (before.chunkSize !== after.chunkSize) {
    issues.push(`Chunk size changed (${before.chunkSize} -> ${after.chunkSize}).`);
  }

  if (before.checksum !== after.checksum) {
    issues.push(`Terrain checksum changed (${before.checksum} -> ${after.checksum}).`);
  }

  return {
    ok: issues.length === 0,
    issues,
  };
};

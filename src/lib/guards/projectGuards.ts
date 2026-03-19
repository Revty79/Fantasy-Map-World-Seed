import type { ProjectManifest } from "../../types/project";
import { isMapScope } from "./editorGuards";

export const isProjectManifest = (value: unknown): value is ProjectManifest => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const manifest = value as Partial<ProjectManifest>;

  if (typeof manifest.projectId !== "string" || typeof manifest.projectName !== "string") {
    return false;
  }

  if (typeof manifest.schemaVersion !== "string" || typeof manifest.rootWorldMapId !== "string") {
    return false;
  }

  if (!Array.isArray(manifest.mapRegistry) || !Array.isArray(manifest.assetRegistry)) {
    return false;
  }

  const validMapRegistry = manifest.mapRegistry.every((entry) => {
    return (
      typeof entry.mapId === "string" &&
      typeof entry.name === "string" &&
      isMapScope(entry.scope) &&
      typeof entry.file === "string"
    );
  });

  if (!validMapRegistry) {
    return false;
  }

  return manifest.assetRegistry.every((entry) => {
    return (
      typeof entry.assetId === "string" &&
      typeof entry.key === "string" &&
      typeof entry.kind === "string" &&
      typeof entry.relativePath === "string"
    );
  });
};

export const assertProjectManifest = (value: unknown): asserts value is ProjectManifest => {
  if (!isProjectManifest(value)) {
    throw new Error("Invalid project manifest shape.");
  }
};

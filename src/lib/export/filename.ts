import type { ExportFormat } from "./types";

const EXTENSION_BY_FORMAT: Record<ExportFormat, string> = {
  png: "png",
  svg: "svg",
  json: "json",
};

const slugPart = (value: string, fallback: string): string => {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  return normalized || fallback;
};

export const extensionForExportFormat = (format: ExportFormat): string => {
  return EXTENSION_BY_FORMAT[format];
};

export const buildDefaultExportFileName = (
  projectName: string,
  mapName: string,
  scope: "world" | "region" | "local",
  format: ExportFormat,
): string => {
  const projectPart = slugPart(projectName, "world-seed");
  const mapPart = slugPart(mapName, "map");
  const scopePart = slugPart(scope, "map");
  return `${projectPart}-${mapPart}-${scopePart}.${extensionForExportFormat(format)}`;
};

export const ensureExportFileExtension = (path: string, format: ExportFormat): string => {
  const extension = extensionForExportFormat(format);
  const safePath = path.trim();
  if (safePath.toLowerCase().endsWith(`.${extension}`)) {
    return safePath;
  }

  return `${safePath}.${extension}`;
};


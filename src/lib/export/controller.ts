import { buildMapJsonExport } from "./jsonExporter";
import { buildDefaultExportFileName, ensureExportFileExtension, extensionForExportFormat } from "./filename";
import { exportMapToPngDataUrl } from "./rasterExporter";
import { exportMapToSvg } from "./svgExporter";
import type { ExportFormat, ExportRequest, ExportResult, ExportSourceContext } from "./types";
import { pickExportFile, writeExportBinaryFile, writeExportTextFile } from "./tauriExport";

class ExportCanceledError extends Error {
  constructor() {
    super("Export canceled.");
    this.name = "ExportCanceledError";
  }
}

const filtersForFormat = (format: ExportFormat): Array<{ name: string; extensions: string[] }> => {
  if (format === "png") {
    return [{ name: "PNG Image", extensions: ["png"] }];
  }

  if (format === "svg") {
    return [{ name: "SVG Document", extensions: ["svg"] }];
  }

  return [{ name: "JSON Document", extensions: ["json"] }];
};

const titleForFormat = (format: ExportFormat, mapName: string): string => {
  if (format === "png") {
    return `Export PNG - ${mapName}`;
  }

  if (format === "svg") {
    return `Export SVG - ${mapName}`;
  }

  return `Export JSON - ${mapName}`;
};

const dataUrlToBase64Payload = (dataUrl: string): string => {
  const splitIndex = dataUrl.indexOf(",");
  if (splitIndex < 0) {
    throw new Error("PNG export failed to encode image data.");
  }
  return dataUrl.slice(splitIndex + 1);
};

export const isExportCanceledError = (error: unknown): boolean => {
  return error instanceof ExportCanceledError;
};

export const runMapExport = async (
  context: ExportSourceContext,
  request: ExportRequest,
): Promise<ExportResult> => {
  const suggestedFileName = buildDefaultExportFileName(
    context.document.metadata.name,
    context.map.name,
    context.map.scope,
    request.format,
  );

  const selectedPath = await pickExportFile({
    title: titleForFormat(request.format, context.map.name),
    defaultFileName: suggestedFileName,
    filters: filtersForFormat(request.format),
  });

  if (!selectedPath) {
    throw new ExportCanceledError();
  }

  const filePath = ensureExportFileExtension(selectedPath, request.format);
  const warnings: string[] = [];

  if (request.format === "png") {
    const rasterResult = exportMapToPngDataUrl({
      map: context.map,
      layers: context.layers,
      view: context.view,
      area: request.area,
      scaleMultiplier: request.scaleMultiplier,
      transparentBackground: request.transparentBackground,
    });
    warnings.push(...rasterResult.warnings);
    const base64 = dataUrlToBase64Payload(rasterResult.dataUrl);
    await writeExportBinaryFile(filePath, base64);
  } else if (request.format === "svg") {
    const svgResult = exportMapToSvg({
      map: context.map,
      layers: context.layers,
      view: context.view,
      area: request.area,
      scaleMultiplier: request.scaleMultiplier,
      transparentBackground: request.transparentBackground,
    });
    warnings.push(...svgResult.warnings);
    await writeExportTextFile(filePath, svgResult.svg);
  } else {
    const jsonExport = buildMapJsonExport({
      document: context.document,
      map: context.map,
      layers: context.layers,
      view: context.view,
      area: request.area,
    });
    await writeExportTextFile(filePath, `${JSON.stringify(jsonExport, null, 2)}\n`);
  }

  return {
    format: request.format,
    filePath,
    fileName: suggestedFileName.replace(/\.[a-z0-9]+$/i, `.${extensionForExportFormat(request.format)}`),
    warnings,
  };
};


import type {
  LabelLayerDocument,
  MapDocument,
  MapLayerDocument,
  SymbolLayerDocument,
  VectorLayerDocument,
} from "../../types";
import { computeExportSourceExtent } from "./geometry";
import type { ExportArea, ExportExtent } from "./types";

const SYMBOL_CATEGORY_COLORS: Record<string, string> = {
  mountains: "#8b7355",
  forests: "#228b22",
  settlements: "#ffa500",
  fortifications: "#696969",
  ruins: "#a9a9a9",
  ports: "#4169e1",
  landmarks: "#daa520",
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return Number.parseFloat(value.toFixed(3)).toString();
};

const escapeXml = (value: string): string => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

const textAnchorFromAlign = (align: "left" | "center" | "right"): "start" | "middle" | "end" => {
  if (align === "left") {
    return "start";
  }

  if (align === "right") {
    return "end";
  }

  return "middle";
};

const layerTag = (
  layer: MapLayerDocument,
  body: string[],
): string => {
  const opacity = formatNumber(clamp(layer.opacity, 0, 1));
  return `<g data-layer-id="${escapeXml(layer.id)}" data-layer-kind="${layer.kind}" opacity="${opacity}">${body.join(
    "",
  )}</g>`;
};

const vectorLayerToSvg = (layer: VectorLayerDocument): string => {
  const body: string[] = [];

  for (const featureId of layer.featureOrder) {
    const feature = layer.features[featureId];
    if (!feature || feature.points.length < 2) {
      continue;
    }

    const parts: string[] = [];
    for (let index = 0; index < feature.points.length; index += 1) {
      const prefix = index === 0 ? "M" : "L";
      const point = feature.points[index];
      parts.push(`${prefix} ${formatNumber(point.x)} ${formatNumber(point.y)}`);
    }

    if (feature.closed) {
      parts.push("Z");
    }

    const fill = feature.closed && feature.style.fillColor ? feature.style.fillColor : "none";
    const fillOpacity = formatNumber(clamp(feature.style.fillOpacity ?? 0.25, 0, 1));
    const strokeOpacity = formatNumber(clamp(feature.style.strokeOpacity, 0, 1));
    const dash = feature.style.dashed ? ` stroke-dasharray="8 5"` : "";

    body.push(
      `<path d="${parts.join(" ")}" fill="${escapeXml(fill)}" fill-opacity="${fillOpacity}" stroke="${escapeXml(
        feature.style.strokeColor,
      )}" stroke-width="${formatNumber(feature.style.strokeWidth)}" stroke-opacity="${strokeOpacity}" stroke-linejoin="${feature.style.lineJoin ?? "round"}" stroke-linecap="round"${dash} />`,
    );
  }

  return layerTag(layer, body);
};

const symbolLayerToSvg = (layer: SymbolLayerDocument): string => {
  const body: string[] = [];

  for (const symbolId of layer.symbolOrder) {
    const symbol = layer.symbols[symbolId];
    if (!symbol) {
      continue;
    }

    const fillColor = symbol.tint && symbol.tint !== "#ffffff"
      ? symbol.tint
      : SYMBOL_CATEGORY_COLORS[symbol.category] ?? "#808080";
    const radius = 12;
    const opacity = formatNumber(clamp(symbol.opacity, 0, 1));
    const text = escapeXml(symbol.symbolKey.charAt(0).toUpperCase());

    body.push(
      `<g transform="translate(${formatNumber(symbol.position.x)} ${formatNumber(symbol.position.y)}) rotate(${formatNumber(
        symbol.rotationDegrees,
      )}) scale(${formatNumber(Math.max(0.1, symbol.scale))})" opacity="${opacity}"><circle cx="0" cy="0" r="${radius}" fill="${escapeXml(
        fillColor,
      )}" stroke="#ffffff" stroke-width="1" /><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-family="Segoe UI, sans-serif" font-size="12" fill="#ffffff">${text}</text></g>`,
    );
  }

  return layerTag(layer, body);
};

const labelLayerToSvg = (layer: LabelLayerDocument): string => {
  const body: string[] = [];

  for (const labelId of layer.labelOrder) {
    const label = layer.labels[labelId];
    if (!label) {
      continue;
    }

    const fontSize = Math.max(8, label.style.fontSize);
    const lineHeight = fontSize * 1.2;
    const estimatedWidth = Math.max(1, label.text.length * fontSize * 0.55);
    const anchor = textAnchorFromAlign(label.style.align);
    const alignAnchorX = anchor === "start" ? 0 : anchor === "middle" ? 0.5 : 1;
    const x = label.position.x - estimatedWidth * clamp(label.anchorX, 0, 1) + estimatedWidth * alignAnchorX;
    const y = label.position.y + (0.5 - clamp(label.anchorY, 0, 1)) * lineHeight;
    const opacity = formatNumber(clamp(label.style.opacity, 0, 1));
    const rotation = label.rotationDegrees !== 0
      ? ` transform="rotate(${formatNumber(label.rotationDegrees)} ${formatNumber(label.position.x)} ${formatNumber(
          label.position.y,
        )})"`
      : "";

    body.push(
      `<text x="${formatNumber(x)}" y="${formatNumber(y)}" text-anchor="${anchor}" dominant-baseline="middle" font-family="${escapeXml(
        label.style.fontFamily,
      )}" font-size="${formatNumber(fontSize)}" font-weight="${Math.max(
        100,
        Math.round(label.style.fontWeight),
      )}" fill="${escapeXml(label.style.color)}" fill-opacity="${opacity}"${rotation}>${escapeXml(label.text)}</text>`,
    );
  }

  return layerTag(layer, body);
};

const toSvgWidthHeight = (extent: ExportExtent, scaleMultiplier: number): { width: number; height: number } => {
  const scale = Number.isFinite(scaleMultiplier) && scaleMultiplier > 0 ? scaleMultiplier : 1;
  return {
    width: Math.max(1, Math.round(extent.width * scale)),
    height: Math.max(1, Math.round(extent.height * scale)),
  };
};

interface SvgExportInput {
  map: MapDocument;
  layers: MapLayerDocument[];
  view: {
    cameraX: number;
    cameraY: number;
    zoom: number;
    viewportWidth: number;
    viewportHeight: number;
  };
  area: ExportArea;
  scaleMultiplier: number;
  transparentBackground: boolean;
}

export interface SvgExportResult {
  svg: string;
  omittedLayerKinds: string[];
  warnings: string[];
}

export const exportMapToSvg = (input: SvgExportInput): SvgExportResult => {
  const extent = computeExportSourceExtent(input.map, input.view, input.area);
  const size = toSvgWidthHeight(extent, input.scaleMultiplier);
  const omittedKinds = new Set<string>();
  const body: string[] = [];
  const hasTerrainData = Object.keys(input.map.terrain.storage.chunks).length > 0;
  const warnings: string[] = [];

  if (!input.transparentBackground) {
    body.push(
      `<rect x="${formatNumber(extent.x)}" y="${formatNumber(extent.y)}" width="${formatNumber(
        extent.width,
      )}" height="${formatNumber(extent.height)}" fill="${escapeXml(input.map.settings.backgroundColor)}" />`,
    );
  }

  for (const layer of input.layers) {
    if (!layer.visible) {
      continue;
    }

    if (layer.kind === "vector") {
      body.push(vectorLayerToSvg(layer));
    } else if (layer.kind === "symbol") {
      body.push(symbolLayerToSvg(layer));
    } else if (layer.kind === "label") {
      body.push(labelLayerToSvg(layer));
    } else {
      omittedKinds.add(layer.kind);
    }
  }

  const omitted = Array.from(omittedKinds);

  if (hasTerrainData) {
    warnings.push(
      "SVG does not embed terrain raster, derived coastline overlays, or land/water terrain shading; use PNG for visual terrain output.",
    );
  }

  if (omitted.length > 0) {
    warnings.push(`SVG omitted unsupported layer kinds: ${omitted.join(", ")}.`);
  }

  const limitationNotes: string[] = [];
  if (hasTerrainData) {
    limitationNotes.push("Terrain visuals are omitted from SVG output.");
  }
  if (omitted.length > 0) {
    limitationNotes.push(`Layer kinds omitted: ${omitted.join(", ")}.`);
  }

  const limitations =
    limitationNotes.length > 0
      ? limitationNotes.join(" ")
      : "SVG includes visible vector, symbol, and label layers.";

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="${formatNumber(
    extent.x,
  )} ${formatNumber(extent.y)} ${formatNumber(extent.width)} ${formatNumber(extent.height)}">
  <title>${escapeXml(input.map.name)}</title>
  <desc>${escapeXml(limitations)}</desc>
  ${body.join("\n  ")}
</svg>
`;

  return {
    svg,
    omittedLayerKinds: omitted,
    warnings,
  };
};

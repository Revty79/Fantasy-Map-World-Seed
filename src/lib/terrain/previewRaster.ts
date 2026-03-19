import type { MapTerrainDocument } from "../../types";
import { buildTerrainSampleGrid, deriveTerrainProducts } from "./derived";

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

interface RampStop {
  at: number;
  color: RgbColor;
}

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
};

const lerp = (from: number, to: number, t: number): number => {
  return from + (to - from) * t;
};

const clampColor = (value: number): number => {
  return Math.round(clamp(value, 0, 255));
};

const createColor = (r: number, g: number, b: number): RgbColor => {
  return {
    r: clampColor(r),
    g: clampColor(g),
    b: clampColor(b),
  };
};

const interpolateColor = (from: RgbColor, to: RgbColor, t: number): RgbColor => {
  return createColor(
    lerp(from.r, to.r, t),
    lerp(from.g, to.g, t),
    lerp(from.b, to.b, t),
  );
};

const sampleRamp = (value: number, stops: RampStop[]): RgbColor => {
  if (value <= stops[0].at) {
    return stops[0].color;
  }

  for (let index = 1; index < stops.length; index += 1) {
    const previous = stops[index - 1];
    const next = stops[index];

    if (value <= next.at) {
      const t = (value - previous.at) / Math.max(0.000001, next.at - previous.at);
      return interpolateColor(previous.color, next.color, t);
    }
  }

  return stops[stops.length - 1].color;
};

const readGridSample = (grid: ReturnType<typeof buildTerrainSampleGrid>, x: number, y: number): number => {
  const clampedX = clamp(Math.round(x), 0, grid.width - 1);
  const clampedY = clamp(Math.round(y), 0, grid.height - 1);
  return grid.values[clampedY * grid.width + clampedX];
};

const buildBaseTerrainColor = (
  heightValue: number,
  seaLevel: number,
  mode: MapTerrainDocument["display"]["renderMode"],
): RgbColor => {
  const normalizedHeight = (heightValue + 1) * 0.5;

  if (mode === "grayscale" || mode === "contour-preview") {
    const gray = clampColor(normalizedHeight * 255);
    return createColor(gray, gray, gray);
  }

  if (mode === "land-water") {
    if (heightValue < seaLevel) {
      const range = Math.max(0.000001, seaLevel + 1);
      const depth = clamp((seaLevel - heightValue) / range, 0, 1);
      return sampleRamp(depth, [
        { at: 0, color: createColor(78, 129, 192) },
        { at: 0.5, color: createColor(45, 92, 158) },
        { at: 1, color: createColor(22, 58, 112) },
      ]);
    }

    const range = Math.max(0.000001, 1 - seaLevel);
    const elevation = clamp((heightValue - seaLevel) / range, 0, 1);
    return sampleRamp(elevation, [
      { at: 0, color: createColor(98, 146, 96) },
      { at: 0.45, color: createColor(132, 162, 98) },
      { at: 0.75, color: createColor(149, 132, 92) },
      { at: 1, color: createColor(229, 226, 217) },
    ]);
  }

  return sampleRamp(normalizedHeight, [
    { at: 0, color: createColor(21, 43, 82) },
    { at: 0.3, color: createColor(73, 120, 178) },
    { at: 0.5, color: createColor(93, 145, 96) },
    { at: 0.68, color: createColor(138, 169, 98) },
    { at: 0.82, color: createColor(148, 129, 91) },
    { at: 1, color: createColor(236, 234, 229) },
  ]);
};

const applyReliefShading = (
  grid: ReturnType<typeof buildTerrainSampleGrid>,
  x: number,
  y: number,
  color: RgbColor,
  verticalExaggeration: number,
  hillshadeStrength: number,
): RgbColor => {
  const left = readGridSample(grid, x - 1, y);
  const right = readGridSample(grid, x + 1, y);
  const up = readGridSample(grid, x, y - 1);
  const down = readGridSample(grid, x, y + 1);

  const dzdx = (right - left) * 0.5 * verticalExaggeration;
  const dzdy = (down - up) * 0.5 * verticalExaggeration;

  const normalX = -dzdx;
  const normalY = -dzdy;
  const normalZ = 1;
  const normalLength = Math.sqrt(normalX * normalX + normalY * normalY + normalZ * normalZ);

  const nx = normalX / normalLength;
  const ny = normalY / normalLength;
  const nz = normalZ / normalLength;

  const lightX = -0.58;
  const lightY = -0.42;
  const lightZ = 0.7;
  const lightLength = Math.sqrt(lightX * lightX + lightY * lightY + lightZ * lightZ);
  const lx = lightX / lightLength;
  const ly = lightY / lightLength;
  const lz = lightZ / lightLength;

  const diffuse = clamp(nx * lx + ny * ly + nz * lz, 0, 1);
  const shadeFactor = 1 + (diffuse - 0.5) * clamp(hillshadeStrength, 0, 2);

  return createColor(color.r * shadeFactor, color.g * shadeFactor, color.b * shadeFactor);
};

const shouldDrawContour = (
  value: number,
  interval: number,
  contourWidth: number,
): boolean => {
  const normalized = (value + 1) * 0.5;
  const stepped = normalized / Math.max(0.000001, interval);
  const fractional = stepped - Math.floor(stepped);
  const distanceFromLine = Math.min(fractional, 1 - fractional);
  return distanceFromLine < contourWidth;
};

export const buildTerrainPreviewCanvas = (terrain: MapTerrainDocument): HTMLCanvasElement => {
  const derivedProducts = terrain.display.showDerivedCoastline ? deriveTerrainProducts(terrain) : null;
  const grid = derivedProducts?.grid ?? buildTerrainSampleGrid(terrain);
  const canvas = document.createElement("canvas");
  canvas.width = grid.width;
  canvas.height = grid.height;

  const context = canvas.getContext("2d");
  if (!context) {
    return canvas;
  }

  const imageData = context.createImageData(grid.width, grid.height);
  const seaLevel = clamp(terrain.seaLevel, -1, 1);
  const renderMode = terrain.display.renderMode;
  const contourInterval = clamp(terrain.display.contourInterval, 0.005, 1);
  const contourWidth = renderMode === "contour-preview" ? 0.055 : 0.025;
  const shouldShade = renderMode === "shaded-relief";
  const showLandWaterOverlay = terrain.display.showLandWaterOverlay && renderMode !== "land-water";
  const verticalExaggeration = clamp(terrain.display.verticalExaggeration, 0.1, 10);
  const hillshadeStrength = clamp(terrain.display.hillshadeStrength, 0, 2);

  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      const sampleIndex = y * grid.width + x;
      const heightValue = grid.values[sampleIndex];
      let color = buildBaseTerrainColor(heightValue, seaLevel, renderMode);

      if (shouldShade) {
        color = applyReliefShading(grid, x, y, color, verticalExaggeration, hillshadeStrength);
      }

      if (showLandWaterOverlay) {
        const overlayColor = heightValue < seaLevel ? createColor(44, 94, 156) : createColor(112, 158, 97);
        color = interpolateColor(color, overlayColor, 0.22);
      }

      if (terrain.display.showContours || renderMode === "contour-preview") {
        if (shouldDrawContour(heightValue, contourInterval, contourWidth)) {
          color = createColor(color.r * 0.45, color.g * 0.45, color.b * 0.45);
        }
      }

      const pixelIndex = sampleIndex * 4;
      imageData.data[pixelIndex] = color.r;
      imageData.data[pixelIndex + 1] = color.g;
      imageData.data[pixelIndex + 2] = color.b;
      imageData.data[pixelIndex + 3] = 255;
    }
  }

  context.putImageData(imageData, 0, 0);

  if (derivedProducts) {
    const inverseResolution = 1 / Math.max(1, grid.sampleResolution);

    context.save();
    context.strokeStyle = "#fff2bf";
    context.lineWidth = 1;
    context.globalAlpha = 0.92;
    context.lineJoin = "round";
    context.lineCap = "round";

    for (const segment of derivedProducts.coastlineSegments) {
      context.beginPath();
      context.moveTo(segment.startX * inverseResolution, segment.startY * inverseResolution);
      context.lineTo(segment.endX * inverseResolution, segment.endY * inverseResolution);
      context.stroke();
    }

    context.restore();
  }

  return canvas;
};

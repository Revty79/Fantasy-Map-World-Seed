# World Seed Mapper (Phase 01 + Phase 01A Complete)

World Seed Mapper is a desktop-first fantasy cartography editor focused on very large, globe-safe maps and hand-authored worldbuilding workflows.

Current delivery status:
- Phase 01 is complete as a drafting/editor baseline.
- Phase 01A is complete and retrofits a terrain-first foundation into that baseline (not a scratch rebuild).

Phase 01 baseline delivers:
- world canvas navigation for large maps
- typed layer workflows
- vector, paint/mask, symbol, and label authoring
- nested world -> region -> local map foundations
- folder-based project persistence
- PNG/SVG/JSON export
- Three.js globe preview from the root world map

Phase 01A terrain foundation delivers:
- first-class terrain/elevation schema per map
- deterministic seeded terrain generation
- terrain-aware flat rendering modes (hypsometric, grayscale, shaded relief, land/water, contour preview)
- direct terrain sculpt tools (raise/lower/smooth/flatten)
- derived terrain workflows (land/water interpretation and derived coastline overlay)
- terrain-aware PNG/export raster path and terrain-aware globe texture pipeline
- backward-compatible hydration for projects missing terrain fields

## Tech Stack

- Desktop shell: Tauri 2
- UI: React 19 + TypeScript
- Build tooling: Vite 5
- 2D canvas renderer: PixiJS 8
- Globe preview: Three.js
- State: Zustand
- Persistence: project folder on disk (manifest + per-map files + paint chunks)

## Prerequisites

- Node.js 20+
- npm 10+ (or Yarn 1 if you prefer)
- Rust stable toolchain
- Tauri platform requirements for your OS
  - Windows: WebView2 runtime + Visual Studio C++ build tools

## Install

```bash
npm install
```

## Run

Frontend-only dev server:

```bash
npm run dev
```

Desktop app (Tauri + frontend):

```bash
npm run tauri:dev
```

Production web build:

```bash
npm run build
```

Desktop bundle build:

```bash
npm run tauri:build
```

## Quality Checks

```bash
npm run typecheck
npm run lint
npm run build
cargo check --manifest-path src-tauri/Cargo.toml
```

## Project Structure

```text
src/
  app/                  React app bootstrap and app shell entry
  components/           Layout chrome + sidebar/panel UI
  engine/               Pixi canvas engine + camera/spatial + globe engine
  features/             Workspace, export UI, shortcuts, globe preview UI
  lib/                  Factories, guards, persistence, export, globe texture pipeline
  store/                Zustand editor store + command helpers
  styles/               Global/editor styles
  types/                Document model and editor runtime types
src-tauri/
  src/lib.rs            Tauri commands for fs/export helpers
  src/main.rs           Tauri app entry
Prompts/
  phase_01_core_world_drafting/STATUS.md   Prompt queue and run log record
  phase_01a_terrain_foundation_repair/STATUS.md
docs/
  ARCHITECTURE.md
  PHASE1A_COMPLETION_SUMMARY.md
  PHASE1A_REPAIR_CONTRACT.md
  PHASE1_CAPABILITIES_AND_LIMITATIONS.md
  PHASE2_HANDOFF.md
```

## Phase 01 Baseline Scope

Included in Phase 1:
- create/open/save project workflows
- large-map canvas pan/zoom and view controls
- layer stack management (typed layers, visibility/lock, opacity, order)
- vector authoring (coastlines/rivers/borders/roads)
- brush authoring for masks and overlays
- symbol placement/editing
- label placement/editing
- nested map extent-based child map creation and navigation
- export pipeline (PNG, SVG, JSON)
- read-only globe preview sourced from the root world map

Deferred beyond the Phase 01 baseline:
- advanced erosion/climate simulation and biome systems
- direct globe editing workflows
- true 3D terrain/displacement scene authoring
- alternate planetary/world-model abstractions (rings, multi-body maps, hollow-earth variants, and other exotic world models)
- collaborative/multiplayer workflows
- advanced asset import/management UI
- deeper layer hierarchy tooling (full drag-drop tree management)

## Documentation Index

- Architecture notes: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Phase 01A terrain retrofit contract: [docs/PHASE1A_REPAIR_CONTRACT.md](docs/PHASE1A_REPAIR_CONTRACT.md)
- Phase 01A completion summary: [docs/PHASE1A_COMPLETION_SUMMARY.md](docs/PHASE1A_COMPLETION_SUMMARY.md)
- Phase 1 capabilities and limitations: [docs/PHASE1_CAPABILITIES_AND_LIMITATIONS.md](docs/PHASE1_CAPABILITIES_AND_LIMITATIONS.md)
- Phase 2 handoff summary: [docs/PHASE2_HANDOFF.md](docs/PHASE2_HANDOFF.md)

## Troubleshooting

- If `tauri:dev` does not open a window, run `npm run tauri -- info` and verify WebView2/Rust toolchain setup.
- Persistence dialogs require the desktop app flow (`tauri:dev` or packaged app), not browser-only mode.
- SVG export is intentionally partial for non-vectorizable content; review export warnings after each SVG export.

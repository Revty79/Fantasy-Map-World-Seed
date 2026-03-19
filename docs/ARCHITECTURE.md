# World Seed Mapper Architecture (Phase 01 Baseline + Phase 01A Retrofit)

This document summarizes the current project shape at the end of Phase 01 and the architectural guardrails used during Phase 01A terrain foundation repair.

## Phase 01A Architectural Contract

- Treat Phase 01 as a successful drafting baseline, not failed work.
- Retrofit terrain as first-class document data; do not fake terrain through paint colors or vector-only coastlines.
- Preserve stable workflows (project lifecycle, typed layers, nested maps, export, read-only globe preview).
- Reuse shared render truth across canvas, export, and globe pipelines as terrain support is added.

## System Boundaries

- App shell (`src/app`, `src/components`, `src/features`)
  - React UI for workspace layout, tool/panel controls, and modal workflows.
  - Calls store actions; does not own document mutation logic directly.
- Editor state + commands (`src/store`)
  - Zustand store is the source of truth for:
    - persisted authoring document (`document`)
    - runtime/editor session (`session`)
    - project save/open metadata (`projectSession`)
  - Store actions implement map/layer/entity edits, history checkpoints, and project workflow commands.
- Rendering engines (`src/engine`)
  - `engine/canvas/WorldCanvasEngine.ts`: Pixi scene, canvas interactions, hit testing, and edit gestures.
  - `engine/globe/GlobePreviewEngine.ts`: Three.js read-only globe preview renderer and controls.
- Domain utilities (`src/lib`)
  - Factories and default document creation
  - Type guards and shared geometry helpers
  - Persistence pipeline
  - Export pipeline
  - Globe texture generation from authored world data
- Tauri backend (`src-tauri`)
  - Rust commands for native file operations and save/export paths.

## Document Model

The document model is file-serializable and separate from runtime UI state.

- Root type: `WorldSeedProjectDocument`
- Includes:
  - metadata (project identity, schema version, timestamps)
  - `rootWorldMapId`
  - map registry (`mapOrder`, `maps`)
  - asset references
  - project settings
- Map documents include:
  - scope (`world`, `region`, `local`)
  - dimensions/projection/settings
  - layer stack (`layerOrder`, `layers`)
  - nested-map relationship links
- Layer documents are typed (`vector`, `paint`, `mask`, `symbol`, `label`, `dataOverlay`, plus structural kinds).

## Nested Map Model

- Child maps are created from parent extents.
- Relationship links store:
  - parent/child map ids
  - parent extent + normalized extent
  - relationship kind and inheritance mode
- Child maps are anchored to parent extents but are independent authoring documents after creation.

## Persistence Pipeline

Key files:
- `src/lib/persistence/projectPersistence.ts`
- `src/lib/persistence/tauriPersistence.ts`

Current flow:
- Save/Save As serializes the project into a folder structure:
  - project manifest
  - per-map JSON files
  - paint/data chunk files
- Open loads and validates schema/version, then hydrates runtime document state.
- Dirty-state and unsaved-change prompts are managed in store workflows.

## Export Pipeline

Key files:
- `src/lib/export/controller.ts`
- `src/lib/export/rasterExporter.ts`
- `src/lib/export/svgExporter.ts`
- `src/lib/export/jsonExporter.ts`

Current behavior:
- Exports active map context with Tauri save dialogs.
- Formats:
  - PNG: rasterized authored content, no editor overlays
  - SVG: vector/symbol/label-focused output with unsupported-layer warnings
  - JSON: outward-facing map data package with metadata

## Globe Preview Relationship

Key files:
- `src/lib/globe/texturePipeline.ts`
- `src/features/globe-preview/components/GlobePreview.tsx`
- `src/engine/globe/GlobePreviewEngine.ts`

Behavior:
- Globe preview always uses the root world map as texture source.
- Region/local active map context is preserved in UI context and optional extent highlighting.
- Preview is intentionally read-only in Phase 1.

## Extension Guidance For Phase 01A And Later

- Preserve the current editor/store/persistence boundaries while adding terrain capabilities.
- Keep document model and runtime state separation intact.
- Reuse the same authored-data render truth between canvas, export, and globe pipelines.
- Extend typed layers/entities instead of adding untyped ad-hoc payloads.
- Favor targeted store actions plus history checkpoints over side-effect-heavy component logic.

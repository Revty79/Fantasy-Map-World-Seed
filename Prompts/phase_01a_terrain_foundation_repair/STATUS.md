# Codex Prompt Queue Status — Phase 01A Terrain Foundation Repair

## How this works
- Codex reads this file to find the next unchecked prompt.
- After completing a prompt, Codex checks it off and fills in the matching Run Log section.
- This file is the source of truth for progress for Phase 01A.
- Phase 01A builds on the existing Phase 01 drafting baseline. It does not replace or rewrite that history.

## Mission
Retrofit the current World Seed Mapper codebase so it evolves from a strong drafting editor into a true terrain-first map foundation.

The existing app already provides:
- desktop editor shell
- typed layer workflows
- vector / paint / symbol / label authoring
- nested world -> region -> local maps
- persistence and export
- read-only globe preview

Phase 01A adds the missing core:
- real terrain data model
- seeded fractal terrain generation
- terrain-aware flat rendering
- terrain editing tools
- derived coastline / land-water / contour support
- terrain-aware globe pipeline
- persistence/export compatibility for terrain data

## Non-Regression Rules
These must remain working throughout Phase 01A:
- project open/save/save as
- map registry and root world map logic
- nested map extent relationships
- vector, paint, symbol, and label authoring already present
- PNG/SVG/JSON export should continue to function, even if SVG still warns for unsupported terrain content
- globe preview must still work in a read-only mode
- existing project files should not be casually broken without an explicit migration path or compatibility note

## Definition of Done for Phase 01A
Phase 01A is complete when:
- a map has a real terrain/elevation data source of truth
- the user can generate a terrain field from seeded parameters
- the flat editor can render terrain meaningfully in 2D
- the user can edit terrain directly with terrain tools
- coastlines / land-water boundaries can be derived from terrain + sea level
- globe preview uses terrain-aware render truth
- terrain data persists cleanly through save/open/export
- current drafting tools still function on top of the new foundation

## Queue
- [x] 00_phase1a_baseline_lock_and_repair_contract.md
- [x] 01_terrain_data_schema_and_document_integration.md
- [x] 02_seeded_fractal_generation_engine.md
- [x] 03_flat_terrain_render_modes_and_ui.md
- [x] 04_terrain_editing_tools.md
- [x] 05_derived_coastlines_masks_and_contours.md
- [x] 06_globe_pipeline_terrain_integration.md
- [x] 07_persistence_export_and_schema_compatibility.md
- [x] 08_editor_store_split_performance_and_phase1a_docs.md

---

## Run Log

### 00_phase1a_baseline_lock_and_repair_contract.md
- Status: Complete (2026-03-19)
- Summary: Locked the queue baseline by checking and aligning architecture/handoff wording so Phase 01 remains a preserved drafting baseline and Phase 01A is the required additive terrain retrofit path.
- Files Changed: `docs/ARCHITECTURE.md`, `docs/PHASE2_HANDOFF.md`, `Prompts/phase_01a_terrain_foundation_repair/STATUS.md`
- Notes / Follow-ups: Prompt 01 should implement terrain schema integration against the new non-regression and terrain-first contract language.

### 01_terrain_data_schema_and_document_integration.md
- Status: Complete (2026-03-19)
- Summary: Added a first-class map terrain document schema (chunked height storage, generation/sea-level/normalization/display/derived metadata), integrated terrain defaults into map factories, and added load/save hydration so legacy map files missing terrain are upgraded safely.
- Files Changed: `src/types/terrain.ts`, `src/types/maps.ts`, `src/types/index.ts`, `src/lib/factories/terrainFactories.ts`, `src/lib/factories/projectFactories.ts`, `src/lib/factories/index.ts`, `src/lib/persistence/projectPersistence.ts`, `Prompts/phase_01a_terrain_foundation_repair/STATUS.md`
- Notes / Follow-ups: Prompt 02 can now generate deterministic terrain into `map.terrain.storage.chunks` using `terrain.generation.settings` as seeded input metadata.

### 02_seeded_fractal_generation_engine.md
- Status: Complete (2026-03-19)
- Summary: Implemented a deterministic seeded fractal terrain generator that writes chunked height samples into `map.terrain`, added terrain generation store actions (generate new, regenerate, randomize seed, and settings updates), and wired minimal Tool Settings UI controls for terrain parameter editing and generation triggers.
- Files Changed: `src/lib/terrain/generator.ts`, `src/lib/terrain/index.ts`, `src/store/editorStore.ts`, `src/components/panels/ToolSettingsPanel.tsx`, `src/components/layout/RightSidebar.tsx`, `src/features/workspace/WorkspaceScreen.tsx`, `src/types/terrain.ts`, `src/lib/factories/terrainFactories.ts`, `Prompts/phase_01a_terrain_foundation_repair/STATUS.md`
- Notes / Follow-ups: Prompt 03 should render terrain data in flat-map modes (hypsometric/grayscale/contour preview) using the generated chunk data and sea-level interpretation from `map.terrain`.

### 03_flat_terrain_render_modes_and_ui.md
- Status: Complete (2026-03-19)
- Summary: Added terrain-aware flat rendering to the Pixi canvas base layer with deterministic terrain rasterization from `map.terrain`, including grayscale, hypsometric, shaded-relief, land/water, and contour-preview display modes; added persistent store-driven terrain display controls in Tool Settings.
- Files Changed: `src/lib/terrain/previewRaster.ts`, `src/lib/terrain/index.ts`, `src/engine/canvas/WorldCanvasEngine.ts`, `src/store/editorStore.ts`, `src/components/panels/ToolSettingsPanel.tsx`, `src/components/layout/RightSidebar.tsx`, `src/features/workspace/WorkspaceScreen.tsx`, `src/types/terrain.ts`, `src/lib/factories/terrainFactories.ts`, `Prompts/phase_01a_terrain_foundation_repair/STATUS.md`
- Notes / Follow-ups: Prompt 04 should add direct terrain editing brushes/tools that mutate terrain chunks and immediately update the same flat terrain render pipeline.

### 04_terrain_editing_tools.md
- Status: Complete (2026-03-19)
- Summary: Added terrain sculpt editing to the flat editor with direct chunked-heightfield mutation (raise, lower, smooth, flatten), per-tool brush controls (size, strength, hardness, flatten target), pointer-drag sculpt strokes on canvas, immediate terrain rerender updates, and undo/redo integration via stroke history checkpoints.
- Files Changed: `src/types/editor.ts`, `src/lib/guards/editorGuards.ts`, `src/lib/terrain/editing.ts`, `src/lib/terrain/index.ts`, `src/store/editorStore.ts`, `src/engine/canvas/types.ts`, `src/engine/canvas/WorldCanvasEngine.ts`, `src/components/layout/ToolRail.tsx`, `src/features/shortcuts/shortcuts.ts`, `src/components/panels/ToolSettingsPanel.tsx`, `src/components/layout/RightSidebar.tsx`, `src/features/workspace/WorkspaceScreen.tsx`, `Prompts/phase_01a_terrain_foundation_repair/STATUS.md`
- Notes / Follow-ups: Prompt 05 should consume terrain generation/terrain sculpt revisions to derive and cache coastline/land-water mask/contour products from the same terrain source of truth.

### 05_derived_coastlines_masks_and_contours.md
- Status: Complete (2026-03-19)
- Summary: Added a terrain-derived products module (land/water mask + coastline extraction), integrated non-destructive derived coastline overlay rendering from terrain truth, added land/water overlay and derived coastline display controls, and added a refresh-derived workflow with cached derived summary metadata in the terrain document.
- Files Changed: `src/types/terrain.ts`, `src/lib/terrain/derived.ts`, `src/lib/terrain/previewRaster.ts`, `src/lib/terrain/index.ts`, `src/store/editorStore.ts`, `src/components/panels/ToolSettingsPanel.tsx`, `src/components/layout/RightSidebar.tsx`, `src/features/workspace/WorkspaceScreen.tsx`, `src/lib/factories/terrainFactories.ts`, `src/lib/terrain/generator.ts`, `src/lib/terrain/editing.ts`, `src/engine/canvas/WorldCanvasEngine.ts`, `Prompts/phase_01a_terrain_foundation_repair/STATUS.md`
- Notes / Follow-ups: Prompt 06 should ensure globe texture generation consumes the same terrain-aware render truth (including derived coastline visibility when enabled).

### 06_globe_pipeline_terrain_integration.md
- Status: Complete (2026-03-19)
- Summary: Routed globe texture generation through terrain-aware raster render truth (terrain base + authored overlays), added a globe terrain render-mode override hook for future growth, and improved globe staleness/context tracking so terrain and display changes are reflected reliably in read-only globe mode.
- Files Changed: `src/lib/export/rasterExporter.ts`, `src/lib/globe/texturePipeline.ts`, `src/features/workspace/WorkspaceScreen.tsx`, `src/features/globe-preview/components/GlobePreview.tsx`, `Prompts/phase_01a_terrain_foundation_repair/STATUS.md`
- Notes / Follow-ups: Prompt 07 should finalize outward compatibility guarantees for terrain persistence/export behavior and add practical terrain round-trip smoke helpers.

### 07_persistence_export_and_schema_compatibility.md
- Status: Complete (2026-03-19)
- Summary: Extended terrain schema hydration defaults for new display/derived fields, made PNG/export raster terrain-aware, expanded JSON export to include terrain payload + terrain summaries, added explicit SVG terrain-omission warnings, and added persistence smoke helper utilities for terrain round-trip verification.
- Files Changed: `src/types/terrain.ts`, `src/lib/factories/terrainFactories.ts`, `src/lib/export/rasterExporter.ts`, `src/lib/export/jsonExporter.ts`, `src/lib/export/svgExporter.ts`, `src/lib/persistence/smokeChecks.ts`, `src/lib/persistence/index.ts`, `Prompts/phase_01a_terrain_foundation_repair/STATUS.md`
- Notes / Follow-ups: Prompt 08 should focus on maintainability cleanup/perf polish and update docs to reflect completed Phase 01A terrain-first baseline.

### 08_editor_store_split_performance_and_phase1a_docs.md
- Status: Complete (2026-03-19)
- Summary: Reduced editor-store terrain sprawl by extracting terrain-specific normalization/invalidation defaults into `terrainStoreUtils`, improved terrain derivation/render reuse with caching-aware paths, and updated README/architecture/handoff/capabilities docs plus a dedicated Phase 01A completion summary documenting what shipped and what remains.
- Files Changed: `src/store/terrainStoreUtils.ts`, `src/store/editorStore.ts`, `src/lib/terrain/previewRaster.ts`, `README.md`, `docs/ARCHITECTURE.md`, `docs/PHASE2_HANDOFF.md`, `docs/PHASE1_CAPABILITIES_AND_LIMITATIONS.md`, `docs/PHASE1A_COMPLETION_SUMMARY.md`, `Prompts/phase_01a_terrain_foundation_repair/STATUS.md`
- Notes / Follow-ups: Phase 01A queue is complete; next phase work should prioritize advanced terrain simulation, direct globe editing, true 3D terrain, and alternate planetary/world-model abstractions.

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
- [ ] 01_terrain_data_schema_and_document_integration.md
- [ ] 02_seeded_fractal_generation_engine.md
- [ ] 03_flat_terrain_render_modes_and_ui.md
- [ ] 04_terrain_editing_tools.md
- [ ] 05_derived_coastlines_masks_and_contours.md
- [ ] 06_globe_pipeline_terrain_integration.md
- [ ] 07_persistence_export_and_schema_compatibility.md
- [ ] 08_editor_store_split_performance_and_phase1a_docs.md

---

## Run Log

### 00_phase1a_baseline_lock_and_repair_contract.md
- Status: Complete (2026-03-19)
- Summary: Locked the queue baseline by checking and aligning architecture/handoff wording so Phase 01 remains a preserved drafting baseline and Phase 01A is the required additive terrain retrofit path.
- Files Changed: `docs/ARCHITECTURE.md`, `docs/PHASE2_HANDOFF.md`, `Prompts/phase_01a_terrain_foundation_repair/STATUS.md`
- Notes / Follow-ups: Prompt 01 should implement terrain schema integration against the new non-regression and terrain-first contract language.

### 01_terrain_data_schema_and_document_integration.md
- Status:
- Summary:
- Files Changed:
- Notes / Follow-ups:

### 02_seeded_fractal_generation_engine.md
- Status:
- Summary:
- Files Changed:
- Notes / Follow-ups:

### 03_flat_terrain_render_modes_and_ui.md
- Status:
- Summary:
- Files Changed:
- Notes / Follow-ups:

### 04_terrain_editing_tools.md
- Status:
- Summary:
- Files Changed:
- Notes / Follow-ups:

### 05_derived_coastlines_masks_and_contours.md
- Status:
- Summary:
- Files Changed:
- Notes / Follow-ups:

### 06_globe_pipeline_terrain_integration.md
- Status:
- Summary:
- Files Changed:
- Notes / Follow-ups:

### 07_persistence_export_and_schema_compatibility.md
- Status:
- Summary:
- Files Changed:
- Notes / Follow-ups:

### 08_editor_store_split_performance_and_phase1a_docs.md
- Status:
- Summary:
- Files Changed:
- Notes / Follow-ups:

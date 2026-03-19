# Phase 2 Handoff Summary

Phase 1 closes as a runnable, documented, and persistence-backed core world drafting milestone.

## Recommended Phase 2 Focus Areas

1. Terrain and elevation authoring
- Add robust elevation layers and tools (heightfield editing, slope/contour support, derived shading).
- Keep typed layer contracts and export compatibility aligned with new terrain data.

2. Advanced paint and style workflows
- Improve paint performance for very large maps (tiled/offscreen strategies, chunk streaming).
- Add richer compositing and style presets across layer kinds.

3. Label and typography upgrades
- Replace prompt-based quick edit with inline canvas text edit overlays.
- Add better glyph metrics, collision options, and style presets.

4. Nested map depth improvements
- Add map unlink/delete workflows with relationship integrity checks.
- Expand extent editing (resize/move) and deeper hierarchy projection helpers.

5. Export maturity
- Improve SVG parity for currently omitted layer kinds where feasible.
- Add large-export memory safety and optional tiled raster export.

6. Asset pipeline expansion
- Add user asset import/registry UI and validation.
- Keep persistence manifest and references stable and versioned.

## Architectural Expansion Points

- `src/store/editorStore.ts`
  - Continue extending action-driven edits with explicit history checkpoints.
- `src/lib/persistence/*`
  - Add migration/version adapters and optional incremental save strategies.
- `src/lib/export/*`
  - Expand format adapters while preserving explicit unsupported-content warnings.
- `src/engine/canvas/*`
  - Add heavier editing behaviors without mixing UI-level concerns into engine internals.
- `src/lib/globe/*` and `src/engine/globe/*`
  - Keep globe preview and authored data rendering in sync from shared render truth.

## Technical Debt And Risk Notes

- `editorStore.ts` is intentionally centralized and now large; phase 2 should split domain slices carefully without breaking action semantics.
- Export and globe pipelines should continue to share rendering assumptions to avoid contradictory outputs.
- Persistence reliability depends on schema contracts; migration planning should happen before schema expansion accelerates.

## Practical First Steps For The Next Queue

1. Add automated smoke tests for save/open/export happy paths.
2. Break store logic into domain modules (maps, layers, labels, symbols, persistence commands).
3. Implement terrain/elevation layer behavior with explicit serialization contracts.
4. Replace label quick-edit prompt with inline editor overlay.

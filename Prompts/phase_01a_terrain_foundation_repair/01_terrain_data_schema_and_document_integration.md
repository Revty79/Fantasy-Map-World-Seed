# Prompt 01 — Terrain Data Schema and Document Integration

## Goal
Introduce a real terrain/elevation data model into the project document so maps can store true terrain information independently of vectors, paint overlays, symbols, and labels.

## Why this exists
Right now the app is centered around authored presentation layers. That is useful, but it is not enough for:
- heightmaps
- terrain editing
- derived coastlines
- future 3D terrain
- globe displacement
- terrain-aware exports and simulation

Phase 01A needs a real terrain source of truth.

## Required outcomes
1. Design and add terrain types to the TypeScript domain model.
   Terrain data should be structured, serializable, and chunk-friendly.

2. Each map should gain a terrain payload or terrain reference structure that supports at minimum:
   - width / height alignment to map dimensions
   - chunked or tiled height sample storage
   - terrain generation metadata
   - sea level
   - min/max elevation or normalization metadata
   - future-friendly room for derived products

3. Add safe factory defaults so new maps can include terrain scaffolding without breaking existing maps.

4. Add compatibility handling so older project documents that lack terrain data can still load safely.
   Graceful default hydration is acceptable at this stage.

5. Keep the terrain model separate from current paint/mask/data overlay layers.
   Terrain is not just another paint layer.

## Strong guidance
A good direction is something like:
- `MapTerrainDocument`
- `TerrainChunk`
- `TerrainSample`
- `TerrainGenerationSettings`
- `TerrainDisplaySettings`
- optional derived cache metadata

The exact names are up to you, but the structure should clearly communicate that terrain is first-class data.

## Constraints
- Do not fake terrain by reusing paint cells as the canonical height source.
- Do not break current save/open flows.
- Do not remove or repurpose current vector coastlines yet.
- Do not build the generator yet unless minimal helper scaffolding is required.

## Acceptance criteria
- Terrain types exist in the document model.
- Maps can carry terrain data or terrain state.
- New project/map factories create safe terrain defaults.
- Older documents can still load without crashing.
- Typecheck passes.
- `STATUS.md` is updated and this prompt is checked off.

## Suggested files
- `src/types/maps.ts`
- `src/types/entities.ts`
- `src/types/layers.ts` only if needed
- new terrain types file(s) under `src/types/`
- `src/lib/factories/projectFactories.ts`
- persistence / hydration helpers as needed

## End-of-prompt instructions
When complete:
1. Check off this prompt in `STATUS.md`
2. Fill in its Run Log section
3. Commit only the work for this prompt
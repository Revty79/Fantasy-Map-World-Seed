# Prompt 06 — Globe Pipeline Terrain Integration

## Goal
Integrate the new terrain-aware render truth into the globe preview pipeline so globe mode reflects actual terrain-based world structure.

## Why this exists
The current globe preview works, but it is downstream of the drafting renderer. After Phase 01A terrain work, globe preview should be downstream of terrain-aware rendering.

## Required outcomes
1. Update globe texture generation so it uses terrain-aware flat render output.

2. Ensure the globe preview reflects:
   - terrain rendering modes or a globe-appropriate terrain texture mode
   - derived land/water boundaries
   - authored overlays where appropriate

3. Preserve the current rule that the root world map remains the authoritative globe texture source.

4. Keep globe preview read-only in this phase.
   This prompt is not for direct globe editing yet.

5. Add clear code structure so later 3D/displacement work has a clean place to grow.

## Strong guidance
This phase is about making the globe preview honest, not about building a full Google Earth clone yet.

## Constraints
- Do not break the existing globe preview workflow.
- Keep region/local context behavior intact where possible.
- Avoid overbuilding displacement mesh logic unless a lightweight hook is useful.

## Acceptance criteria
- Globe preview still opens and works.
- Globe preview now reflects terrain-aware world rendering.
- Root world map remains authoritative.
- Existing flat editor behavior remains intact.
- Typecheck passes.
- `STATUS.md` is updated and this prompt is checked off.

## Suggested files
- `src/lib/globe/texturePipeline.ts`
- `src/engine/globe/*`
- terrain-aware raster/shared render helpers

## End-of-prompt instructions
When complete:
1. Check off this prompt in `STATUS.md`
2. Fill in its Run Log section
3. Commit only the work for this prompt
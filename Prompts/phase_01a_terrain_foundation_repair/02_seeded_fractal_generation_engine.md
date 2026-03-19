# Prompt 02 — Seeded Fractal Generation Engine

## Goal
Implement the first real terrain generator that writes procedural height data into the new terrain source of truth.

## Why this exists
Phase 01A needs the app to become a real map generator, not only a drafting editor. The generator must create terrain data, not just visible decoration.

## Required outcomes
1. Add a deterministic seeded terrain generator.
   The same settings + seed must produce the same result.

2. Support a practical first-pass terrain generation parameter set, such as:
   - seed
   - frequency / scale
   - octaves
   - lacunarity
   - persistence / gain
   - amplitude or height scale
   - sea level
   - optional continent bias / macro mask strength
   - optional warp strength if feasible

3. The generator must write into the map’s terrain data structure.

4. Provide store actions to:
   - generate new terrain for active map
   - regenerate terrain from settings
   - optionally randomize seed

5. Preserve existing authored layers. Terrain generation should not delete user vectors, symbols, labels, or paint data.

6. Add a minimal UI entry point for triggering terrain generation.
   Simple panel controls are fine at this stage.

## Strong guidance
Start with a reliable 2D noise-based terrain field, not a fake visual preview.
Good enough for this phase:
- value noise / Perlin / Simplex style composition
- multi-octave fractal field
- continent-shaping mask or low-frequency macro influence

Do not overbuild erosion/climate here.

## Constraints
- Generation must be deterministic.
- Avoid giant monolithic code blocks; place generator logic in engine/lib modules.
- Keep performance reasonable for large maps.
- Do not tie generation directly to render-only code.

## Acceptance criteria
- Active map can generate terrain data from seed/settings.
- Regeneration updates terrain data consistently.
- Terrain exists in data, not just UI state.
- Existing drafting systems still work afterward.
- Typecheck passes.
- `STATUS.md` is updated and this prompt is checked off.

## Suggested files
- `src/lib/terrain/`
- `src/engine/terrain/`
- `src/store/editorStore.ts` or terrain slice/scaffold
- terrain settings UI component files as needed

## End-of-prompt instructions
When complete:
1. Check off this prompt in `STATUS.md`
2. Fill in its Run Log section
3. Commit only the work for this prompt
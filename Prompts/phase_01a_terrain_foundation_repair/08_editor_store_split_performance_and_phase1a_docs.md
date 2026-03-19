# Prompt 08 — Editor Store Split, Performance Pass, and Phase 01A Documentation

## Goal
Stabilize the Phase 01A work by reducing editor-store sprawl, tightening performance hotspots, and documenting the completed terrain-first foundation.

## Why this exists
The repo already has a large centralized store. Terrain work will increase that pressure. Before moving on to later phases, Phase 01A should leave the codebase cleaner and better documented.

## Required outcomes
1. Refactor oversized editor-store logic into clearer domain modules where safe.
   Good candidates:
   - terrain state/actions
   - layer actions
   - map actions
   - persistence commands

2. Reduce obvious performance hotspots introduced by terrain generation/render/editing where feasible.

3. Update docs so Phase 01A is clearly reflected in:
   - README
   - architecture doc
   - handoff doc for next phase
   - capabilities/limitations doc

4. Add a concise “what Phase 01A completed” summary.

5. Add a concise “what remains for later phases” summary, especially around:
   - advanced erosion/climate simulation
   - direct globe editing
   - true 3D terrain scene
   - alternate planetary/world models
   - hollow-earth or exotic world-model abstractions

## Constraints
- Do not perform reckless refactors that destabilize working behavior.
- Preserve user-visible workflows.
- Keep docs truthful and plain.

## Acceptance criteria
- Store logic is meaningfully cleaner or better partitioned.
- Terrain behavior is still working after cleanup.
- Docs now accurately describe the post-Phase-01A foundation.
- Phase 01A closes in a maintainable state.
- `STATUS.md` is updated and this prompt is checked off.

## Suggested files
- `src/store/*`
- docs files
- performance-related terrain/render helpers

## End-of-prompt instructions
When complete:
1. Check off this prompt in `STATUS.md`
2. Fill in its Run Log section
3. Commit only the work for this prompt
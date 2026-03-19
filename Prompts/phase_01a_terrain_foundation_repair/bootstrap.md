# Codex Bootstrap — Continue the Phase 01A Terrain Foundation Repair Queue

You are Codex working in this repository.

## Your job
Continue building **World Seed Mapper** by executing the prompt files in:

`/prompts/phase_01a_terrain_foundation_repair/`

using that folder’s `STATUS.md` as the single source of truth.

This is **not** a scratch rebuild.

You are working on top of an existing, functional **Phase 01 drafting/editor baseline** that already includes:
- desktop editor shell
- flat world canvas
- typed layers
- vector, paint/mask, symbol, and label authoring
- nested world -> region -> local map relationships
- project persistence
- export flows
- read-only globe preview

Your job in **Phase 01A** is to **retrofit a true terrain-first foundation** into that existing app without breaking the baseline.

## What Phase 01A is for
Phase 01A exists because the current app is a strong drafting editor, but it is **not yet a true fractal terrain mapper**.

You must add:
- real terrain/elevation data model
- seeded fractal terrain generation
- terrain-aware flat rendering
- terrain editing tools
- derived coastline / land-water / contour support
- terrain-aware globe pipeline
- persistence/export compatibility for terrain data

## What must remain true
The following must **not regress** unless a prompt explicitly says otherwise:
- project create/open/save/save as
- root world map logic
- nested map extent relationships
- vector authoring
- paint/mask/data overlay authoring
- symbol placement/editing
- label placement/editing
- export flows
- globe preview still opening and functioning in read-only mode

## Critical build rule
Do **not** treat the current codebase like failed work.
Do **not** replace the editor with a brand-new unrelated system.
Do **not** discard the current document model, persistence, or layer architecture unless a prompt clearly requires a specific change.

This phase is an **additive corrective retrofit**:
- preserve what is already working
- add the missing terrain core
- connect the new terrain core to rendering, persistence, export, and globe preview

## Terrain-first rule
Terrain data must become a **real source of truth**.

That means:
- terrain is **not** just painted color cells
- terrain is **not** just vector coastline artwork
- terrain is **not** just a visual overlay

Terrain must exist as structured map data that can support:
- sea level interpretation
- land/water derivation
- future heightmap workflows
- future 3D terrain workflows
- future globe displacement / globe-aware rendering
- future alternate world model abstractions

## Existing architecture guidance
Favor the current architecture shape:
- React app shell for UI
- Zustand/editor actions for document mutations
- typed document model
- renderer separation
- persistence/export modules
- globe pipeline using shared render truth

Prefer extending the architecture cleanly rather than bypassing it.

## Process (repeat until done)
1. Open and read:
   `/prompts/phase_01a_terrain_foundation_repair/STATUS.md`

2. Find the **first** prompt in the Queue that is still unchecked `[ ]`.

3. Open that prompt file.

4. Implement that prompt completely.

5. Update the queue in `STATUS.md`:
   - change that prompt from `[ ]` to `[x]`
   - fill in its matching Run Log section with:
     - Status
     - Summary
     - Files Changed
     - Notes / Follow-ups

6. Commit only the work for that prompt.

7. Stop after that prompt is complete.

## Implementation standards
- Keep TypeScript types explicit and clean.
- Keep document data serializable.
- Preserve backward compatibility where practical.
- Add migration/default hydration behavior when older project documents may lack new terrain fields.
- Prefer focused modules over giant new blobs of logic.
- Do not silently break existing files or workflows.
- Keep docs truthful.

## Scope control
Do not jump ahead into later prompts unless required to complete the current one safely.

Especially do **not** prematurely build:
- full climate simulation
- full erosion simulation
- direct globe editing
- full 3D terrain scene
- multiplayer/collaboration
- exotic world models as full features

You may add small architecture hooks for future work when clearly beneficial, but stay inside the current prompt.

## Definition of success for Phase 01A
Phase 01A succeeds when the codebase is no longer only a drafting editor, but a **terrain-capable flat world foundation** that can credibly support later phases.

## If you encounter ambiguity
When in doubt:
- preserve existing behavior
- prefer additive terrain integration
- keep terrain as first-class data
- do the smallest clean thing that satisfies the active prompt
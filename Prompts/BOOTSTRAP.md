# Codex Bootstrap — Continue the World Seed Mapper Prompt Queue

You are Codex working in this repository.

## Your job
Start building **World Seed Mapper** by executing the prompt files in `/prompts/Prompts/phase_01_core_world_drafting` in numeric order, using `STATUS.md` as the single source of truth.

This product is:
- a desktop-first fantasy world mapping application
- built for very large, detailed, globe-safe world maps
- hand-drawn first, not auto-generated
- designed around a master equirectangular world map so it can later wrap to a 3D globe
- architected for world → region → local nested map workflows
- performance-minded from the start

## Locked architecture for this run
Unless a prompt explicitly says otherwise, keep these choices locked:

- **Desktop shell:** Tauri
- **UI:** React + TypeScript
- **Build tooling:** Vite
- **2D render engine:** PixiJS
- **3D globe preview:** Three.js
- **Project storage:** project folder on disk, not database-first
- **Rendering philosophy:** chunk/tile-aware, GPU-accelerated, large-map safe
- **Editing philosophy:** hybrid vector + paint + masks + metadata layers

## Product intent
The user wants the foundation for an eventual best-in-class fantasy map suite with:

- hand drawing
- vector coastlines, rivers, borders, and roads
- paint layers and masks
- terrain and feature tools
- weather layers
- labels and symbols
- globe preview
- nested world, regional, and local maps
- future expansion to elevation systems, advanced climate logic, and deeper rendering

## Phase intent
This run is for **Phase 1 — Core World Drafting**.

Phase 1 should produce a working vertical slice that allows the user to:
- create or open a project
- work on a globe-safe world map
- draw and edit core map geometry
- use layers
- place terrain/features/symbols
- add labels
- paint weather/data overlays
- save/load/export the project
- preview the world on a simple 3D globe

## Non-negotiable design principles
- Do not build procedural world generation.
- Do not build empty scaffolding with no usable in-app progress.
- Do not sacrifice future scale for short-term convenience.
- Do not overcomplicate phase 1 with advanced simulation systems.
- Keep the world map pipeline globe-safe from the beginning.
- Favor smooth editing and responsiveness over flashy but fragile visuals.
- Build foundations that can later support multiple visual styles, even though the initial implementation may be cleaner and more atlas-like than fully realistic satellite rendering.

## Core process (repeat until queue is complete)
1. Open and read `/prompts/STATUS.md`.
2. Find the **first** unchecked prompt in the Queue.
3. Open that prompt file.
4. Implement it completely.
5. Update `/prompts/STATUS.md`:
   - mark the prompt as completed
   - fill in the matching Run Log section
   - note important files created or changed
   - note any important limitations or follow-up constraints
6. Stop only when every prompt in the Queue is checked off.

## Execution rules
- Do **not** skip ahead.
- Do **not** silently rewrite completed work unless the current prompt requires it.
- Do **not** change the stack unless there is a strong implementation reason, and if that happens it must be documented clearly in `STATUS.md`.
- Make reasonable implementation decisions without waiting for the user unless something is truly blocked.
- Keep the application runnable throughout the queue.
- Keep code organized and maintainable.
- Prefer direct, testable implementations over speculative architecture.
- Prefer typed models and clean contracts between UI, renderer, and persistence layers.
- Preserve a clean separation between:
  - app shell/UI
  - renderer/engine
  - document/project model
  - editing tools
  - persistence/export
  - globe preview

## Quality bar
Every completed prompt should leave the project in a better, still-runnable state with:
- no knowingly broken core flows
- clean file organization
- useful types/schemas/interfaces
- minimal but real UX progress
- honest notes in `STATUS.md`
- no major lint/type/build regressions introduced by the prompt

## Performance bar
This product is intended for very large maps. Build with that in mind from the beginning:
- avoid full-canvas brute force redraw assumptions
- prefer chunk/tile-aware rendering strategy
- avoid storing giant monolithic structures when partitioning is cleaner
- separate editable document data from render-ready caches where helpful
- keep zoom, pan, and layer visibility responsive

## File discipline
Prefer a structure along these lines unless the repo already has a better equivalent:

- `src/app`
- `src/components`
- `src/features`
- `src/engine`
- `src/store`
- `src/types`
- `src/lib`
- `src-tauri`

## Testing expectation
For each prompt:
- run the most relevant checks available
- fix obvious issues introduced by the prompt
- document anything incomplete or intentionally deferred in `STATUS.md`

## End condition
When the full queue is complete:
- ensure `STATUS.md` is fully updated
- ensure setup/run instructions are usable
- ensure the app launches cleanly
- ensure Phase 1 is in a real handoff-ready state for Phase 2
# Phase 4 — Globe Pipeline Foundation

## Objective
Build the foundational globe pipeline for **World Seed Mapper** so the project can move from a flattened authoring-first world map into a real, structured **flat-map-to-globe** system.

This prompt should establish:
- the architectural foundation for globe rendering
- the data flow from flattened authored world data into globe-ready representations
- the core globe pipeline boundaries and source-of-truth rules
- shared globe-view state and pipeline modules
- the structural separation between flat-map authoring and globe projection/rendering
- a clean extension path for all later Phase 4 prompts

This prompt is about **pipeline architecture first**, not final globe polish.

---

## Context
Earlier phases already established:
- flattened-globe-safe world canvas assumptions
- procedural/fractal world generation
- elevation and heightmap editing
- a large authored map stack including hydrology, paint, regions, symbols, labels, masks
- save/load and export-ready persistence hooks
- a polished flattened authoring workspace

Phase 4 now begins the transition into:
- projecting that authored world onto a globe
- previewing the world on a sphere
- validating seams/poles/continuity
- preparing real export pipelines

Important product rule:
**the flattened map remains the canonical editable source of truth unless explicitly changed later.**

The globe should initially be treated as a derived view/output pipeline fed by authored flat-map data.

---

## Required outcome
When complete, the app should have a real Phase 4 globe foundation with:
1. a dedicated globe pipeline module or equivalent architecture
2. a clear distinction between flat authored data and derived globe-ready data
3. a centralized globe-view state model
4. a structured transformation flow from persisted/authored map data into globe pipeline inputs
5. a globe workspace/view shell or entry point ready for later prompts
6. no breaking regressions to the flattened authoring workflow

This prompt should make the later globe prompts straightforward rather than forcing architectural guesswork.

---

## Core implementation tasks

### 1) Establish explicit source-of-truth rules
Implement or document in code the core rule that:
- the flattened world map and its authored data remain the primary editable source of truth
- globe representations are initially derived from the flat world state
- globe-side views should not silently create a second conflicting authoritative data model

Requirements:
- this rule should be reflected in state architecture and module boundaries
- naming should make it obvious which data is canonical and which is derived
- later prompts should be able to add controlled round-trip behavior without first undoing this architecture

Avoid any foundation that accidentally creates two independent map states.

---

### 2) Create the globe pipeline module/foundation
Implement the structural foundation for a globe pipeline.

This may include modules/services/stores such as:
- globe pipeline coordinator
- flat-map-to-globe transform preparation layer
- globe scene/view state
- derived globe asset cache
- globe layer projection pipeline
- shared globe render inputs

Requirements:
- the pipeline must be modular and clearly separable from flat-map authoring systems
- it must integrate with existing persistence/editor state without bypassing them
- it must be easy for later prompts to extend for mesh generation, seams, viewer controls, and export

The exact structure can match the codebase style, but it must be real and coherent.

---

### 3) Define the flat-to-globe data flow
Create the shared pathway that turns persisted/authored world data into globe pipeline inputs.

At minimum this should account for:
- world dimensions / map resolution
- coordinate-space conventions
- elevation/height data
- paint/biome/surface overlays
- hydrology data
- region overlay data
- symbols/landmarks
- labels/text
- persistent metadata needed for globe rendering/export

Requirements:
- the pipeline should clearly separate authored inputs, transformed intermediates, and render-ready globe outputs
- not every layer must be fully projected yet, but the flow must be structured now
- later prompts must be able to plug in layer-specific projection behavior without rearchitecting everything

Think in terms of a real transform pipeline, not a one-off render shortcut.

---

### 4) Introduce centralized globe state
Create a shared globe state model/store/context/slice for globe-specific behavior.

At minimum support structure for:
- globe view enabled/disabled
- active globe workspace/view mode
- camera/view orientation hooks
- zoom/distance hooks
- render quality/detail hooks if useful
- globe debug overlays toggle(s)
- seam/pole debug visibility hooks
- derived-data refresh state
- dirty/rebuild flags if appropriate
- active projected layer visibility hooks
- future globe interaction mode hooks

Not every field must be fully exercised yet, but the shared state foundation should exist now.

This must not become an isolated local-state island.

---

### 5) Add a globe workspace/view entry point
Implement a real entry point for globe work inside the application.

This can be:
- a dedicated globe tab/view
- a split editor mode
- a secondary workspace route/panel
- another coherent approach that fits the current app

Requirements:
- the user can reach a dedicated globe-related area/view
- the view communicates that it is derived from the authored map
- it is structurally ready for later prompts that will add interactive globe rendering
- it does not replace or destabilize the flattened authoring workspace

This prompt does not require the final interactive globe viewer yet, but the app should now have a real place for it.

---

### 6) Create derived globe asset boundaries
Define how derived globe-side assets will be represented.

Examples may include:
- projected raster/texture inputs
- projected vector/object overlays
- derived globe mesh inputs
- seam-aware projected layer data
- globe material/texture preparation results
- cached transform outputs

Requirements:
- the architecture should make it clear what can be cached versus what must be recomputed
- the system should leave room for partial invalidation when authored flat-map data changes
- the design should avoid forcing a full rebuild for every tiny future edit unless clearly necessary

The exact asset set can be partial for now, but the boundaries must be established.

---

### 7) Add globe pipeline invalidation/rebuild structure
Because globe outputs are derived, create a clear mechanism for marking globe representations stale when flat authored data changes.

At minimum support the concept of:
- clean derived state
- dirty derived state
- selective refresh/rebuild hooks
- future per-layer invalidation potential
- safe initial rebuild on entering globe view if needed

Requirements:
- this can be modest now, but it must be a real structural concept
- later prompts should be able to attach mesh/texture/layer rebuild behavior cleanly
- the user should not unknowingly view stale globe data forever after edits

Do not overengineer, but do not ignore invalidation entirely.

---

### 8) Preserve persistence and export compatibility
Extend persistence-aware structures where needed so globe pipeline metadata can exist without corrupting the main authored schema.

At minimum provide hooks for:
- globe view settings or preferences where appropriate
- projection-related metadata
- globe pipeline versioning hooks if useful
- cached/derived-data strategy boundaries
- export-preparation metadata hooks

Requirements:
- persisted authored world data remains clean and canonical
- derived globe metadata should be clearly distinguished from authored world content
- later export prompts must be able to discover globe-ready context without hacks

Do not bloat the save format with ambiguous mixed transient/derived state unless it is clearly intentional.

---

### 9) Add initial developer-facing continuity structure
Where useful, add concise internal comments/notes/types that clarify:
- flat source-of-truth vs derived globe data
- the expected flow through the globe pipeline
- where later prompts should extend mesh/projection/viewer/export behavior
- what is intentionally placeholder now

Keep this brief and useful.

The goal is to make later Phase 4 prompt implementation cleaner and safer.

---

### 10) Maintain flattened workflow stability
The existing flattened authoring workflow must remain intact.

Requirements:
- no breaking regressions to terrain/elevation editing
- no breaking regressions to hydrology, paint, regions, symbols, labels, masks
- save/load of authored flat-map content must still work
- any new globe entry points should not confuse normal flat-map editing
- existing UI should remain coherent

This is critical. Phase 4 adds a pipeline; it must not destabilize the established editor.

---

### 11) Prepare for later projection system work
Even though the actual transform math will come in the next prompt, this prompt should leave the right architectural seam for it.

The pipeline should be clearly ready for later modules such as:
- coordinate conversion utilities
- UV/projection mapping logic
- seam-aware coordinate handling
- pole-aware transforms
- vector/object projection helpers
- raster layer projection preparation

Do not implement all that here, but the foundation should make their placement obvious.

---

### 12) Prepare for later globe rendering work
Likewise, this prompt should leave a clean place for:
- globe mesh generation
- globe materials/textures
- interactive camera controls
- layer toggles on the globe
- overlay projection and rendering
- debug validation views

Requirements:
- the rendering entry point should be structurally clear
- there should be a predictable contract between pipeline outputs and future globe viewer inputs
- later prompts should not need to replace this prompt’s architecture to continue

---

### 13) Keep performance reasonable
The foundation should support future performance-conscious behavior.

Take sensible measures such as:
- separating canonical authored data from derived globe caches
- enabling future partial refreshes
- avoiding immediate eager construction of expensive globe outputs when not needed
- choosing types/modules that can scale

Do not optimize prematurely in depth, but avoid an obviously fragile architecture.

---

## UX expectations
By the end of this prompt, the user should be able to understand that:
- the flat map is still the main editable world source
- the app now has a real globe pipeline foundation
- there is a dedicated place in the product for globe-stage work
- the system is ready to begin projecting the world onto a globe in later prompts

This prompt is mostly architectural, but the visible product should still show meaningful Phase 4 progress.

---

## Implementation guidance
Prefer:
- centralized globe pipeline/state modules
- clean contracts between authored world data and derived globe outputs
- explicit naming around canonical vs derived data
- extension-ready architecture for projection, mesh generation, and export
- minimal but real UI integration for entering globe-related workflows

Avoid:
- globe-only hacks that screenshot the flat map and fake-wrap it without a real pipeline
- mixing transient viewer state directly into authored world data structures
- creating an entirely separate second editor state that competes with the flat map
- burying globe logic across random unrelated components
- breaking the established flat-map authoring workspace

---

## Deliverables
Implement:
- globe pipeline foundation modules/services/state
- clear canonical-vs-derived data flow structure
- centralized globe view state
- a globe workspace/view entry point
- derived asset/cache boundaries
- invalidation/rebuild foundations
- any necessary shared type/store/persistence-hook updates
- concise developer continuity notes/comments where helpful

Also update any lightweight internal notes if appropriate.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. The codebase has a real globe pipeline foundation rather than ad hoc future placeholders.
2. The flattened authored world remains the clear canonical source of truth.
3. A centralized globe-specific state model exists.
4. The app has a dedicated globe-related entry point/workspace/view ready for later prompts.
5. The flat-to-globe data flow is structurally defined for major authored systems.
6. Derived globe asset/cache boundaries and invalidation concepts exist in real code.
7. Existing flat-map editing, authored content systems, and persistence are not broken.
8. The implementation clearly prepares for projection math, globe rendering, seam handling, and export work in later Phase 4 prompts.

---

## What not to do
Do not:
- implement the full projection math here
- build the final globe mesh/material system here
- build final seam/pole correction here
- build the full interactive globe viewer here
- build final export UX here
- replace the flat-map editor with a globe-only workflow

This prompt is the globe pipeline foundation only.

---

## Final instruction
Implement the Phase 4 globe pipeline foundation cleanly and completely, wiring it into the existing application in a way that preserves the flattened map as the canonical authored source while establishing a strong architectural base for all later globe-stage prompts.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
# Phase 4 — Globe Mesh and Surface Wrapping

## Objective
Build the globe mesh and surface-wrapping system for **World Seed Mapper** so the authored flattened world can be rendered as a real spherical surface rather than only existing as transform math and pipeline scaffolding.

This prompt should establish:
- the actual globe mesh foundation
- surface sampling from flat authored data onto that globe
- elevation-aware globe displacement hooks
- texture/material input preparation from flat-map layers
- a clean render-ready surface contract for later viewer, seam, overlay, and export work

This prompt is about making the globe become a real rendered object in the app.

---

## Context
The previous prompts in Phase 4 already established:
- the globe pipeline foundation
- canonical flat authored data as the source of truth
- the coordinate projection and transform system
- reusable transform helpers for point/path/polygon/raster content
- seam/pole-aware transform foundations
- globe workspace/state entry points

Now the project needs a real globe surface that can consume those transforms and display the authored world on a sphere.

Important product rule:
- the flattened map remains the canonical editable source
- the globe mesh and surface are derived render/output artifacts
- globe rendering must be driven from real authored world data and real projection logic, not screenshot hacks

---

## Required outcome
When complete, the app should have:
1. a real globe mesh or sphere-surface rendering foundation
2. a real path for flat map surface data to appear on that globe
3. a clear contract for base color/albedo-like globe surface inputs
4. elevation/displacement hooks for later terrain-aware globe relief
5. a structurally correct render pipeline for later viewer and overlay prompts
6. no regressions to the flattened authoring workflow

At least one real **derived globe surface render** should be visible by the end of this prompt.

---

## Core implementation tasks

### 1) Implement the globe surface geometry foundation
Create the actual globe surface geometry for rendering the world.

Acceptable approaches include:
- sphere geometry driven by UV-style wrapping
- custom globe mesh generation
- subdivided sphere/icosphere with surface sampling hooks
- another structurally sound globe mesh approach that fits the stack

Requirements:
- the globe must be a real rendered spherical surface
- the geometry must be compatible with later elevation displacement
- the geometry must be compatible with later overlay projection and interactive viewing
- the geometry should work with the projection conventions established in the prior prompt

Choose an approach that fits the current rendering stack cleanly.

---

### 2) Define globe surface sampling strategy
Implement the shared strategy for turning flat authored map data into globe surface appearance.

At minimum define/support:
- how flat base color/surface appearance is sampled for the globe
- how normalized map coordinates map into globe surface sample points
- how the mesh/material pipeline retrieves or receives flat-map-derived data
- how later multiple layers can feed the globe surface

Requirements:
- the sampling strategy must be explicit and reusable
- it must align with the transform system already established
- it must avoid hidden one-off render hacks inside UI components

This should become the standard surface-wrapping path for the globe.

---

### 3) Create base surface render input generation
Implement a real derived globe-surface input based on the authored flat world.

At minimum support one clear base surface representation, such as:
- a derived texture from the authored map layers
- a sampled render target
- a generated raster/material input
- another structurally sound globe-ready surface input

Requirements:
- the globe must visibly show the authored world surface
- the derived input must come from real authored flat-map data
- the implementation must leave room for later higher-fidelity layer compositing
- the output should be cacheable/rebuildable through the globe pipeline

This does not have to be the final perfect material stack yet, but it must be real.

---

### 4) Support terrain/elevation contribution hooks
Integrate the terrain/elevation system into globe surface preparation.

At minimum establish support for:
- sampling elevation/height data for globe surface use
- configurable elevation scale/displacement hooks
- optional debug display of elevation contribution
- a clean distinction between base spherical surface and displaced terrain-ready surface behavior

Requirements:
- even if full dramatic terrain displacement is modest at first, the data path must exist
- elevation handling must be derived from the canonical authored terrain/elevation data
- later prompts should be able to refine relief without replacing the whole mesh pipeline

The goal is to make globe terrain possible and structurally prepared now.

---

### 5) Implement initial globe material/render contract
Create the render/material contract the globe viewer will consume.

At minimum define/support:
- base surface/albedo-like input
- optional elevation/displacement input hooks
- opacity/debug options if useful
- quality/detail hooks where appropriate
- layer-ready expansion points for later prompts

Requirements:
- the render contract should be centralized and discoverable
- it should fit the globe pipeline architecture already created
- later prompts should be able to attach projected overlays, seam diagnostics, and export capture without rewriting this layer

Do not bury material rules across unrelated components.

---

### 6) Add globe surface rebuild/invalidation behavior
Hook the new mesh/surface system into the globe pipeline invalidation model.

Requirements:
- when relevant flat authored data changes, the globe surface can be marked stale
- entering globe view can rebuild missing or stale derived surface data
- there is a clear path for selective refresh later
- the system should avoid permanently displaying stale globe surfaces after flat-map edits

This can be modest in this prompt, but it must be real.

---

### 7) Create visible globe surface debug/readout support
Add at least lightweight validation/debug support so the globe surface behavior is inspectable.

Examples:
- display current globe surface generation status
- show source texture resolution or derived asset metadata
- allow a basic elevation/displacement debug toggle
- show whether surface data is fresh or stale
- expose a simple globe debug overlay state in the globe workspace

Requirements:
- there should be at least one meaningful way to verify the globe surface is derived and updating intentionally
- avoid leaving the whole system as a black box

This will help later seam, overlay, and export prompts.

---

### 8) Preserve compatibility with the transform system
The globe mesh and surface wrapping must use the transform/projection system from the previous prompt.

Requirements:
- no ad hoc alternative coordinate mapping should appear here
- mesh/sample orientation must respect the canonical longitude/latitude assumptions
- surface wrapping must align with seam/pole conventions already defined
- later overlay projection must be able to assume the same globe orientation

The math layer and render layer must stay consistent.

---

### 9) Prepare for later seam and pole handling
This prompt does not fully solve seam/pole polish, but the mesh/surface system must be prepared for it.

Requirements:
- mesh/material/sampling choices must not make seam handling impossible later
- pole behavior should remain compatible with the pole-aware transform foundations
- derived surface inputs should be inspectable enough to support seam debugging later
- later continuity fixes should be able to extend this system rather than replace it

Choose approaches that keep seam/pole work feasible.

---

### 10) Preserve compatibility with later projected layers
The globe surface system must leave room for later projection of:
- hydrology
- biome/surface paint refinements
- regions/overlays
- symbols/landmarks
- labels
- masks/debug overlays

Requirements:
- later prompts should be able to add globe-side layer rendering without undoing this prompt
- the base globe surface should have a clean layering contract
- the globe viewer should not be trapped into one monolithic texture-only architecture unless it still allows those later features cleanly

The system should support growth.

---

### 11) Maintain flattened workflow stability
The existing flat-map editor must remain stable.

Requirements:
- no regressions to flat terrain/elevation editing
- no regressions to hydrology, paint, regions, symbols, labels, masks
- save/load of flat authored data must still work
- globe work should feel additive, not disruptive

Phase 4 is still derived from the flat authoring system.

---

### 12) Preserve persistence and export compatibility
Extend globe pipeline metadata/hooks where needed so this surface-wrapping system can support later save/load/export behavior.

At minimum provide hooks for:
- derived surface asset metadata
- surface generation settings where appropriate
- elevation scale settings if user-facing or pipeline-relevant
- export capture discovery hooks
- render-ready globe asset descriptors if useful

Requirements:
- canonical authored data remains distinct from derived globe surface artifacts
- future export prompts must be able to find and use the correct derived surface pipeline without hacks

Do not mix transient surface rendering details into canonical authored world data unnecessarily.

---

### 13) Keep performance reasonable
The globe surface pipeline should be built with practical performance awareness.

Take sensible measures such as:
- reusable/cached derived surface assets
- not rebuilding everything every frame
- configurable resolution/detail where appropriate
- clean separation between rebuild and render steps
- preparation for later selective refresh

Do not overengineer prematurely, but avoid an obviously fragile brute-force approach.

---

## UX expectations
By the end of this prompt, the visible product should show meaningful globe progress:
- the user can reach the globe area/view
- there is a real spherical world surface visible
- that surface reflects the authored flat map rather than a placeholder sphere
- the system visibly feels like the world is now being wrapped onto a globe

This is one of the first Phase 4 prompts that should feel visibly exciting.

---

## Implementation guidance
Prefer:
- a real sphere/globe mesh integrated into the established globe pipeline
- explicit surface input generation from flat authored data
- elevation/displacement-ready contracts
- centralized material/render setup
- pipeline-driven rebuild behavior rather than ad hoc component-local work

Avoid:
- screenshotting the flat map and loosely faking a globe without pipeline structure
- creating a render path inconsistent with the transform system
- hardcoding one-off globe rendering inside a UI component with no reuse path
- destabilizing the flat authoring workspace
- choosing a surface architecture that blocks later overlay projection

---

## Deliverables
Implement:
- real globe mesh/surface geometry foundation
- explicit globe surface sampling/wrapping strategy
- real derived base surface render input from flat authored data
- elevation/displacement hooks tied to canonical terrain data
- centralized globe material/render contract
- surface rebuild/invalidation integration
- lightweight surface debug/readout support
- any necessary shared type/store/pipeline updates
- concise developer continuity notes/comments if helpful

Also update any lightweight internal notes if appropriate.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. The app renders a real globe surface rather than only having transform/pipeline scaffolding.
2. The globe surface is visibly derived from the flat authored world data.
3. The geometry/render path is compatible with the established transform system.
4. There is a clear base surface/material contract for later globe features.
5. Elevation/terrain contribution hooks exist in real code.
6. Globe surface rebuild/invalidation behavior exists at least in a basic but real form.
7. Existing flat authored workflows and persistence are not broken.
8. The implementation clearly prepares for seam handling, interactive viewing, projected overlays, and export work in later Phase 4 prompts.

---

## What not to do
Do not:
- build the full final interactive globe viewer here
- fully solve seam and pole polish here
- fully project all authored overlay layers here
- replace canonical flat authored data with globe-side source data
- bury the surface-wrapping logic inside one-off UI code

This prompt is the globe mesh and surface-wrapping foundation only.

---

## Final instruction
Implement the globe mesh and surface-wrapping system cleanly and completely, giving World Seed Mapper a real derived spherical world surface that faithfully reflects the canonical flat authored map and is ready for the rest of Phase 4.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
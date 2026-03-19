# Phase 4 — Seams, Poles, and Continuity Handling

## Objective
Build the seam, pole, and continuity handling system for **World Seed Mapper** so the derived globe remains visually and spatially coherent when wrapping canonical flat-map data around a sphere.

This prompt should establish real handling for:
- dateline / wrap seam continuity
- pole-adjacent stability
- discontinuity-aware projection of paths, polygons, and raster-backed layers
- continuity-safe rendering rules for globe surface and overlays
- debugging and validation of seam/pole problem areas
- future compatibility with interactive globe viewing, projected overlays, and export

This prompt is about turning the globe from “mostly wrapped” into “structurally trustworthy.”

---

## Context
The earlier Phase 4 prompts already established:
- the globe pipeline foundation
- canonical flat authored data as the source of truth
- the coordinate projection and transform system
- seam-aware and pole-aware transform foundations
- a real globe mesh and surface-wrapping foundation

Now the project needs to deal with the hardest globe-specific continuity concerns:
- content crossing the wrap seam
- content near or across pole-adjacent regions
- overlay/path/polygon continuity on a spherical surface
- derived surface behavior that should not visibly tear or distort in obvious avoidable ways

Important product rule:
- the flattened map remains canonical
- seam/pole handling must work from that canonical flat-map data
- fixes must be mathematically and pipeline-structurally grounded, not visual-only bandages

---

## Required outcome
When complete, the app should have:
1. real seam-handling rules for globe projection/rendering
2. real pole-aware handling for globe projection/rendering
3. continuity-safe behavior for at least the major projected data categories
4. visible validation/debug support for seam and pole problem areas
5. a globe that behaves more coherently at its hardest boundaries
6. no regressions to the flattened authoring workflow

At least one real **seam-crossing validation workflow** and one real **pole-adjacent validation workflow** should be functional by the end of this prompt.

---

## Core implementation tasks

### 1) Formalize seam continuity rules
Implement explicit code-level rules for how the globe pipeline handles the wrap seam.

At minimum define/support:
- the canonical seam position relative to flat map x and longitude
- how coordinates normalize across the seam
- how derived globe surface inputs avoid obvious wrap mismatch
- how multi-vertex data is evaluated for seam crossing
- how continuity should be preserved when data logically wraps around the world

Requirements:
- seam handling must be centralized and reusable
- later overlay/viewer/export prompts must not need to invent new incompatible seam logic
- the rules must align with the transform assumptions already established earlier

This should turn seam behavior into a real product-system concern, not an implicit side effect.

---

### 2) Implement seam-aware handling for raster/grid-backed data
Add real continuity handling for raster or grid-backed authored data such as:
- elevation / height data
- biome/surface paint
- masks
- other grid-backed overlays
- derived base globe surface inputs

Requirements:
- the wrapped globe surface should not show obvious avoidable seam mismatch caused by incorrect edge handling
- sampling behavior at the map edges should be deliberate
- derived textures/material inputs should use seam-safe addressing or equivalent logic
- debug visibility should exist for inspecting seam continuity if practical

This does not need to solve every artistic mismatch the user paints into the flat map, but the pipeline itself must not introduce preventable discontinuity.

---

### 3) Implement seam-aware handling for paths and polylines
Add real handling for seam-crossing path-like data such as:
- rivers
- region boundaries
- routes
- freeform drawn paths
- line-based overlay features

Requirements:
- seam-crossing segments must be detected
- the projected globe representation should avoid long incorrect “back across the world” segments
- paths may be split, normalized, duplicated, or otherwise prepared in a continuity-safe way
- the chosen approach must be compatible with later rendering and export

This is one of the most important continuity cases. It must be structurally correct.

---

### 4) Implement seam-aware handling for polygons/regions
Add real handling for polygonal data such as:
- regions
- lakes if vector-based
- filled overlays
- selection/mask shapes if projected
- future polygon-based annotation layers

Requirements:
- seam-crossing polygons must be detected
- projected region behavior should avoid catastrophic fill or triangulation errors across the globe
- the system should prepare polygon rings for seam-safe rendering or splitting
- the approach must leave room for later higher-fidelity triangulation/render improvements

Full perfect computational-geometry sophistication is not required yet, but the system must move beyond naive projection.

---

### 5) Implement pole-aware handling for projected content
Add real pole-adjacent continuity handling for major projected content categories.

At minimum account for:
- points/anchors near poles
- paths approaching poles
- polygons enclosing or approaching pole regions
- raster sampling behavior near the poles
- viewer/render assumptions that may become unstable or visually confusing at extreme latitudes

Requirements:
- pole handling must be explicit, not just “whatever the math does”
- later viewer and export prompts must be able to build on these rules
- projected results near poles should be inspectable and defensible

The goal is not to eliminate all projection weirdness, but to manage it deliberately.

---

### 6) Add continuity-prepared derived geometry/data structures
Where needed, introduce derived seam/pole-safe intermediate data structures.

Examples may include:
- split seam-safe path segments
- continuity-normalized polygon rings
- pole-proximity flags
- seam-crossing metadata
- wrapped duplicate edge segments where useful
- derived render packets for continuity-safe globe overlays

Requirements:
- these derived structures must remain clearly distinct from canonical authored flat data
- they must fit into the globe pipeline cleanly
- later prompts should be able to consume them for interactive rendering and export

This prompt should strengthen the derived-data stage of the globe pipeline.

---

### 7) Improve globe surface/material continuity behavior
Apply seam/pole continuity handling to the globe surface/render path.

At minimum review and improve:
- texture/material wrap behavior
- visible seam artifacts caused by sampling/orientation issues
- pole-adjacent surface stability
- debug visualization of seam line / pole zones where useful
- derived surface rebuild logic when seam-sensitive inputs change

Requirements:
- the globe surface should become visibly more trustworthy after this pass
- improvements should come from real pipeline logic, not only UI camouflage
- the work must remain compatible with the earlier globe mesh/surface foundation

This is the prompt where globe wrapping should start feeling product-grade rather than merely technical-demo-grade.

---

### 8) Add seam and pole diagnostics
Create meaningful validation/debug support for continuity concerns.

At minimum support one or more of:
- seam line overlay on globe view
- pole zone overlay or pole-proximity highlighting
- seam-crossing feature indicators
- continuity debug readout for selected paths/polygons
- derived geometry inspection metadata
- warnings for problematic or degenerate projected cases

Requirements:
- there should be a practical way to inspect whether seam/pole handling is working
- diagnostics should help later prompts and future debugging
- keep the tools concise and useful rather than noisy

This is important for trust and for future extension work.

---

### 9) Integrate with invalidation/rebuild behavior
Hook seam/pole continuity handling into the derived globe rebuild pipeline.

Requirements:
- continuity-sensitive derived outputs should rebuild when relevant canonical flat data changes
- seam/pole diagnostics should not silently go stale forever
- later selective rebuild improvements should remain possible
- the pipeline should make it clear when continuity-prepared outputs are fresh or stale

This can be modest now, but it must be real.

---

### 10) Preserve compatibility with projected content layers
This continuity system must prepare the globe for later projected rendering of:
- hydrology
- biome/surface paint refinements
- regions and overlays
- symbols/landmarks
- labels/text
- masks/debug overlays

Requirements:
- the seam/pole handling logic should be reusable across these systems
- later prompts should not need to replace this prompt’s decisions to continue
- the contracts for continuity-prepared derived data should be clear and centralized

The goal is to build shared continuity infrastructure, not one-off fixes for one layer only.

---

### 11) Maintain flattened workflow stability
The flat-map authoring workflow must remain stable and canonical.

Requirements:
- do not mutate flat authored data in globe-specific continuity logic
- no regressions to flat editing, persistence, or authoring tools
- seam/pole fixes must live in the derived globe pipeline or explicit transform helpers
- the user should still understand the flat map as the source and the globe as the derived view

This is non-negotiable.

---

### 12) Preserve persistence and export compatibility
Extend metadata/hooks where needed so seam/pole continuity handling is available to later export stages.

At minimum provide hooks for:
- seam-crossing metadata
- pole-proximity metadata
- continuity-prepared derived geometry access
- diagnostics or validation flags where useful
- export-time access to the same continuity-safe derived forms used by rendering

Requirements:
- canonical authored save data remains clean
- derived continuity data remains clearly distinguished from canonical data
- later export prompts should be able to reuse this logic instead of duplicating it

Do not bloat project saves with unnecessary transient render artifacts unless clearly intentional.

---

### 13) Keep performance reasonable
Continuity handling can become expensive. Keep the implementation practical.

Take sensible measures such as:
- compute seam/pole-prepared derived data only where needed
- cache continuity-prepared forms when practical
- avoid repeated full recomputation every frame
- keep diagnostics opt-in or scoped where appropriate
- structure the system so selective rebuild remains possible

Do not overengineer, but do not choose an obviously brute-force approach that will age badly.

---

## UX expectations
By the end of this prompt, the globe should feel more correct in the places users naturally distrust most:
- the wrap seam
- the pole regions
- long paths and large regions crossing boundary conditions

The visible product should communicate that globe continuity is being handled deliberately, not left to luck.

---

## Implementation guidance
Prefer:
- centralized continuity rules
- reusable seam/pole-aware helpers and derived data structures
- continuity fixes that live in the globe pipeline, not in canonical flat data
- diagnostics that make problem cases inspectable
- improvements grounded in the transform and globe-surface systems already established

Avoid:
- ad hoc per-component continuity hacks
- silently mutating canonical flat authored content to “fix” the globe
- ignoring seam-crossing polygons/paths and hoping later prompts solve it
- purely cosmetic seam hiding without underlying structural correctness
- destabilizing the existing flat editor or earlier Phase 4 foundations

---

## Deliverables
Implement:
- explicit seam continuity rules
- seam-safe handling for raster/grid-backed data
- seam-safe handling for paths/polylines
- seam-safe handling for polygons/regions
- pole-aware handling for projected content
- continuity-prepared derived data structures
- globe surface/material continuity improvements
- seam/pole diagnostics and debug support
- invalidation/rebuild integration
- any necessary shared type/store/pipeline updates
- concise developer continuity notes/comments if helpful

Also update any lightweight internal notes if appropriate.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. The globe pipeline has explicit seam and pole continuity handling in real code.
2. Raster/grid-backed globe surface inputs behave more coherently at the seam.
3. Seam-crossing paths no longer produce naive incorrect globe-spanning segments.
4. Seam-crossing polygons/regions are handled in a structurally safer way than naive projection.
5. Pole-aware handling exists as a real operational part of the projection/render pipeline.
6. Meaningful seam/pole diagnostics or debug support exist.
7. Existing flat authored workflows and earlier globe foundations are not broken.
8. The implementation clearly prepares for interactive globe viewing, projected overlay layers, and export work in later Phase 4 prompts.

---

## What not to do
Do not:
- replace the canonical flat data model with globe-side source data
- build the full final overlay projection stack here
- build the final export UX here
- hide all continuity issues purely with visual tricks
- undertake a giant unrelated renderer rewrite unless truly necessary

This prompt is about seams, poles, and continuity handling only.

---

## Final instruction
Implement the seam, pole, and continuity handling system cleanly and completely, making the derived globe significantly more trustworthy at wrap and pole boundary conditions while preserving the flat map as the canonical authored source.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
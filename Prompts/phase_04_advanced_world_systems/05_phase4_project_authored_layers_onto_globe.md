# Phase 4 — Project Authored Layers onto Globe

## Objective
Build the authored-layer projection system for **World Seed Mapper** so the major Phase 1–3 authored map systems can appear meaningfully on the derived interactive globe rather than only existing as a base wrapped surface.

This prompt should establish real projection/render support for major authored content categories such as:
- hydrology
- biome/surface paint refinements
- regions and overlays
- symbols/landmarks
- labels/text
- masks/debug overlays where useful

This prompt is about turning the globe from a wrapped world surface into a true **derived world-view of authored content**.

---

## Context
Earlier Phase 4 prompts already established:
- the globe pipeline foundation
- the coordinate projection and transform system
- the globe mesh and surface-wrapping system
- seam, pole, and continuity handling
- the interactive globe viewer
- flat authored world data as the canonical source of truth

At this stage, the globe should already exist as a navigable derived sphere. Now it needs to display the major authored layers from the flat editor in a structured and inspectable way.

Important product rule:
- the flat map remains the canonical editable source
- globe-side content projection is derived from canonical authored flat data
- globe projection must not silently create competing source data or one-off visual hacks

---

## Required outcome
When complete, the app should support a real authored-layer projection workflow where:
1. major authored layer types can appear on the globe in structured ways
2. projected layers are driven by the shared transform and continuity systems
3. globe-side layer visibility behaves coherently
4. projected authored content is inspectable and visually meaningful
5. the globe starts to feel like a true whole-world validation workspace
6. the flat authoring workflow remains stable and canonical

At least one complete projection/render workflow for each major content family should be functional by the end of this prompt, even if some are basic first-pass versions.

---

## Core implementation tasks

### 1) Define the globe-layer projection contract
Create a shared contract for how authored flat-map layers become projected globe layers.

At minimum the contract should distinguish between:
- canonical authored source data
- transform/preparation stage
- continuity-prepared derived forms
- globe render packets or globe-ready layer outputs
- viewer-facing visibility/debug state

Requirements:
- the projection contract must be centralized and reusable
- different content types must fit into one coherent globe-layer architecture
- later export and picking prompts must be able to build on it without replacing it

Do not implement each layer as a separate ad hoc globe-only hack.

---

### 2) Project hydrology onto the globe
Add real globe-side projection/render support for hydrology authored in the flat editor.

At minimum support:
- projected rivers
- projected lakes/inland water bodies
- seam-safe handling for hydrology paths/areas
- globe visibility toggle(s) for hydrology
- basic projected styling that reads clearly on the globe

Requirements:
- projected hydrology must derive from canonical authored hydrology data
- rivers should not render as naive incorrect world-spanning paths across seams
- lakes/water bodies should appear in structurally correct projected positions
- the result should feel like real authored world water projected onto the sphere

This is one of the most important globe overlays. It should be visibly useful.

---

### 3) Project biome and surface paint refinements onto the globe
Extend globe-side layer projection so the authored biome/surface systems appear meaningfully beyond the base globe wrap where appropriate.

Depending on the architecture, this may include:
- projecting authored biome/surface overlays as globe material contributions
- showing biome boundaries or thematic overlays
- supporting globe-side visibility control for biome/surface contributions
- exposing projected paint debug modes if useful

Requirements:
- projected biome/surface behavior must come from canonical paint-layer data
- it must align with the base globe surface and not conflict with it
- visibility behavior should be coherent
- the architecture should support future refinement without rework

Do not duplicate the same data in multiple conflicting render paths.

---

### 4) Project regions and overlays onto the globe
Add real globe-side projection/render support for regions and overlay data.

At minimum support:
- projected region boundaries
- projected region fills or highlight overlays where practical
- seam-safe handling for region geometries
- visibility toggle(s) for regions/overlays on the globe
- selection/readability-ready structure for later viewer interaction work

Requirements:
- projected regions must derive from canonical flat authored region data
- seam-crossing region behavior must use the continuity systems already built
- projected regions should be visually understandable on the globe
- the architecture should support future picking/inspection and export

This is a core test of whether the worldbuilding overlays truly survive the flat-to-globe pipeline.

---

### 5) Project symbols and landmarks onto the globe
Add real globe-side projection/render support for placed symbols, stamps, and landmarks.

At minimum support:
- projected landmark anchors
- projected symbol rendering at globe-space positions
- stable scale/orientation rules appropriate to the globe view
- visibility toggle(s) for symbol/landmark layers
- continuity-safe handling for seam-adjacent placements

Requirements:
- projected objects must derive from canonical flat authored object data
- anchored positions must align with globe-space transforms already established
- symbols should remain understandable and not drift arbitrarily
- the system should prepare for later picking/focus/inspection behavior

This is a major step toward making the globe useful for validating actual world features.

---

### 6) Project labels and text onto the globe
Add real globe-side support for labels/text authored in the flat editor.

At minimum support:
- projected label anchors
- readable globe-side label placement in a basic but real form
- visibility toggle(s) for labels
- category-aware support where useful
- seam/pole-safe anchoring behavior at least in a first-pass usable form

Requirements:
- labels must derive from canonical flat authored label data
- the initial solution does not need to solve every advanced globe text problem, but it must be real
- label projection should preserve anchor correctness and basic readability
- the system should prepare for later picking/export or viewpoint capture work

A modest but structurally sound solution is better than a fake text overlay pinned to the screen.

---

### 7) Add mask/debug overlay projection where useful
Project masks or debugging overlays where they materially help validation.

Possible examples:
- selection/mask previews
- seam diagnostics
- pole zone overlays
- debug highlight regions
- active projected layer bounds/coverage previews

Requirements:
- these overlays should use the same projection system where practical
- they should remain clearly distinguished from canonical authored content
- they should help the user inspect derived globe behavior, not confuse it

These overlays can be optional/toggled, but at least one useful debug/projection overlay path should exist.

---

### 8) Build coherent globe-side layer visibility and ordering
Integrate projected authored layers into a coherent globe layer management model.

At minimum support:
- per-layer-family visibility toggles
- sensible default ordering or rendering precedence
- clear distinction between base globe surface and projected overlay layers
- globe-side debug layer visibility hooks
- future extensibility for sublayers or category grouping

Requirements:
- visibility controls should feel intentional in the globe viewer
- the projected layers should not devolve into an unmanageable stack
- later prompts should be able to refine grouping/order without major rework

The globe needs a real layer model, not just “draw everything if present.”

---

### 9) Add projected-layer preparation and rebuild integration
Wire projected authored layers into the globe pipeline invalidation/rebuild flow.

Requirements:
- projected layer outputs should rebuild when their canonical flat source data changes
- the pipeline should distinguish which layer families are stale or fresh where practical
- viewer camera movement should not force unnecessary re-projection of static authored data
- the structure should support future selective rebuild improvements

This can be modest, but it must be real and centralized.

---

### 10) Add lightweight projected-layer diagnostics
Create useful diagnostics or readouts for projected authored content.

Examples:
- which authored layer families are currently projected
- which projected layers are stale/fresh
- projected object/feature counts by family
- continuity warnings for projected content
- label/symbol visibility/debug summaries
- selection placeholder state for future viewer picking

Requirements:
- diagnostics should help validate the globe-side layer system
- keep them concise and useful
- they should reinforce trust in the derived globe pipeline

This is especially valuable now that multiple authored systems are being projected together.

---

### 11) Preserve compatibility with transform and continuity systems
All projected layer work must use the shared transform and seam/pole continuity foundations built earlier.

Requirements:
- no new ad hoc globe projection math should appear here
- seam-safe handling for paths/polygons/anchors must reuse the shared continuity logic
- projected layer behavior should align with the globe mesh/surface orientation and conventions already established
- later export and picking prompts must be able to depend on this consistency

The math and layer systems must remain unified.

---

### 12) Preserve compatibility with flat-authoring workflow
The flat authoring workflow must remain the canonical system.

Requirements:
- the globe must remain derived from canonical flat authored data
- no edits should silently happen only on globe-side projected representations
- switching between flat and globe views should remain stable
- no regressions to Phase 1–3 authoring or save/load behavior
- the user should still understand the globe as a derived inspection/validation stage

This rule must remain obvious in both code and UX.

---

### 13) Prepare for later picking, sync, and export work
This projection system should leave clean hooks for later prompts involving:
- globe-side feature picking and focus
- flat-map to globe sync rules
- export capture and rendering
- structured data exports with projected content access
- future globe-side inspection workflows

Requirements:
- projected layer outputs should be discoverable and structured
- later prompts should not need to rebuild this layer architecture to continue
- viewer and export systems should have obvious access points

This prompt should make the globe-side content model real and extension-ready.

---

### 14) Preserve persistence and export compatibility
Extend metadata/hooks where needed so projected layer behavior can support save/load and export without corrupting canonical data boundaries.

At minimum provide hooks for:
- projected layer configuration/visibility preferences where appropriate
- derived projection metadata
- stale/fresh projected-layer state boundaries
- export-time access to projected authored content families

Requirements:
- canonical authored save data remains distinct from derived projection outputs
- transient derived layer packets should not become ambiguous persisted source data
- later export prompts should be able to reuse the projection pipeline directly

Do not blur authored content and derived viewer render state.

---

### 15) Keep performance reasonable
Projected authored layers can become expensive. Keep the implementation practical.

Take sensible measures such as:
- caching projected layer outputs where appropriate
- reusing transform results when possible
- avoiding unnecessary full reprojection on camera changes
- scoping diagnostics or debug overlays sensibly
- structuring layer families so selective rebuild remains possible

Do not overengineer, but do not choose a brute-force approach that obviously will not scale.

---

## UX expectations
By the end of this prompt, the globe viewer should feel much more like a real world-inspection space:
- rivers and lakes should appear on the globe
- regions should be visible on the globe
- landmarks and labels should begin to appear on the globe
- the user should be able to toggle major projected layer families
- the globe should now look like the user’s authored world, not only a wrapped terrain surface

This is a major “wow” step for the product.

---

## Implementation guidance
Prefer:
- centralized globe-layer projection contracts
- reuse of transform and continuity systems
- clear distinction between base surface and projected overlays
- structured visibility/order management
- derived packets that later picking/export can consume cleanly

Avoid:
- one-off rendering hacks for each authored system
- duplicating transform logic inside viewer components
- globe-side projected layers that quietly become source data
- destabilizing the flat editor or earlier Phase 4 foundations
- a monolithic render blob with no layer boundaries

---

## Deliverables
Implement:
- a shared projected-layer contract/architecture
- projected hydrology support
- projected biome/surface support where appropriate
- projected regions/overlays support
- projected symbols/landmarks support
- projected labels/text support
- useful debug/mask overlay projection where appropriate
- globe-side visibility/order management for projected layers
- rebuild/invalidation integration for projected layer families
- lightweight diagnostics/readouts for projected content
- any necessary shared type/store/pipeline updates
- concise developer continuity notes/comments if helpful

Also update any lightweight internal notes if appropriate.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. Major authored content families can appear on the globe in real projected forms.
2. Hydrology, regions, symbols/landmarks, and labels each have at least a basic but real projected globe workflow.
3. Projected layers use the shared transform and continuity systems rather than ad hoc math.
4. Globe-side visibility/ordering for projected layers behaves coherently.
5. Projected layer outputs participate in derived-data rebuild/invalidation behavior.
6. The globe viewer now reflects authored world content meaningfully beyond the base surface.
7. Existing flat authored workflows, persistence, and earlier globe foundations are not broken.
8. The implementation clearly prepares for sync rules, picking, export capture, and structured data export work in later Phase 4 prompts.

---

## What not to do
Do not:
- turn projected globe layers into canonical editable source data here
- build the full globe picking/edit workflow here
- build the final export UX here
- hide continuity problems with one-off visual tricks
- destabilize the flat authoring pipeline

This prompt is about projecting authored layers onto the globe only.

---

## Final instruction
Implement the authored-layer projection system cleanly and completely, so the interactive globe becomes a true derived view of the user’s worldbuilding work across hydrology, overlays, landmarks, and labels while preserving the flat map as the canonical authored source.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
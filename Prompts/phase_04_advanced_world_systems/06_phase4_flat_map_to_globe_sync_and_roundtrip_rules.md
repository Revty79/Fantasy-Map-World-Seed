# Phase 4 — Flat Map to Globe Sync and Roundtrip Rules

## Objective
Build the flat-map-to-globe sync and roundtrip rule system for **World Seed Mapper** so the relationship between the canonical flat editor and the derived globe workspace stays clear, predictable, and technically safe as Phase 4 becomes more interactive.

This prompt should establish:
- explicit sync rules between canonical flat authored data and derived globe data
- rebuild/update behavior when flat authored data changes
- safe roundtrip conventions for globe-side inspection and any limited globe-side interactions
- clear boundaries for what may update canonical data and what must remain derived-only
- state and UX rules that prevent the globe workflow from becoming a conflicting second editor
- a stable architectural base for later export, picking, and possible future globe-assisted editing

This prompt is about making the **relationship** between flat and globe workflows trustworthy.

---

## Context
Earlier Phase 4 prompts already established:
- the globe pipeline foundation
- the coordinate projection and transform system
- the globe mesh and surface-wrapping system
- seam, pole, and continuity handling
- the interactive globe viewer
- projected authored layers on the globe

At this point, the globe is no longer just a concept. It is a real derived workspace showing canonical authored content.

That means the product now needs explicit rules for:
- when the globe updates after flat edits
- what counts as stale or fresh
- what globe interactions are inspection-only
- what globe interactions may legally map back to canonical flat-map positions
- how later globe-assisted workflows can exist without corrupting source-of-truth rules

Important product rule:
**the flattened map remains the canonical editable source unless a specific future interaction is explicitly designed to roundtrip safely.**

---

## Required outcome
When complete, the app should have:
1. explicit sync rules between canonical flat data and derived globe data
2. a real stale/fresh/update model that users and code can both rely on
3. clear architectural roundtrip boundaries for globe-side interactions
4. a stable path for reverse lookup from globe context back to flat canonical context where needed
5. UX feedback that makes source-of-truth and derived-state behavior understandable
6. no regressions to the flattened authoring workflow

At least one real **flat edit -> globe refresh workflow** and one real **globe context -> flat context roundtrip workflow** should be functional by the end of this prompt.

---

## Core implementation tasks

### 1) Formalize canonical vs derived sync rules
Implement explicit code-level rules describing how canonical flat authored data and derived globe data relate.

At minimum define/support:
- flat authored content as the canonical source
- globe-rendered/projected content as derived from the canonical source
- which state categories are canonical, derived, transient viewer-only, or cached
- which events should invalidate derived globe outputs
- which derived outputs may safely persist as caches versus which should always rebuild

Requirements:
- these rules must be represented in code structure, not only comments
- naming and architecture should make it obvious what is canonical vs derived
- later prompts should be able to build on this system without redefining the product model

Do not leave this as an implicit assumption.

---

### 2) Define flat-to-globe update triggers
Create explicit update trigger rules for when globe outputs should refresh because flat authored content changed.

At minimum account for changes to:
- terrain/elevation
- biome/surface paint
- hydrology
- regions/overlays
- symbols/landmarks
- labels/text
- persistent masks or other authored supporting layers
- projection/view settings that materially affect globe rendering

Requirements:
- update triggers should be centralized and inspectable
- not every change has to cause a full globe rebuild if a narrower refresh is possible
- the system should prepare for selective refresh, even if the first pass is somewhat coarse

The goal is to make refresh behavior predictable, not magical.

---

### 3) Implement globe stale/fresh state behavior
Create a real stale/fresh model users and systems can rely on.

At minimum support:
- fresh derived globe state
- stale derived globe state after relevant flat edits
- rebuilding/in-progress state
- rebuild failed/error state if relevant
- per-layer-family stale/fresh hooks where practical
- visible indication of whether the globe reflects current canonical data

Requirements:
- stale/fresh behavior must be reflected in centralized state
- globe workspace UI should expose enough feedback that users understand when the globe is out of date
- the system should not quietly leave users looking at stale globe data with no clue

This is one of the core trust features of Phase 4.

---

### 4) Implement at least one real flat-edit -> globe refresh workflow
Create a real end-to-end refresh path proving the sync system works.

Examples:
- user edits terrain or paint on the flat map -> globe marks stale -> user refreshes or globe auto-refreshes based on the chosen model
- user edits hydrology or labels -> affected projected globe layers update appropriately
- user loads a saved project -> globe derived outputs rebuild into a fresh state

Requirements:
- at least one meaningful authoring flow must visibly propagate into the globe
- the user should be able to understand what changed and when the globe updated
- the implementation should use the centralized stale/fresh/update system rather than ad hoc direct forcing

This prompt is not complete without a real visible sync proof.

---

### 5) Decide and implement refresh strategy rules
Define how globe refresh should behave from a UX/product standpoint.

Possible approaches:
- automatic refresh for small/cheap derived updates
- manual refresh for expensive/full rebuilds
- hybrid refresh with auto for lightweight layers and manual for heavier globe surface rebuilds
- background-like staged refresh within the current response cycle if supported by the architecture

Requirements:
- the chosen behavior should be explicit in code and UI
- the strategy should balance trust, responsiveness, and performance
- the user should not be confused about whether the globe is live, delayed, or manual-refresh-based

A hybrid model is acceptable if it is clearly communicated and well-structured.

---

### 6) Implement reverse mapping / roundtrip lookup foundations
Create the shared foundation for mapping globe-side inspection context back into flat-map canonical context.

At minimum support one or more of:
- globe point / picked surface location -> normalized map coordinates
- globe anchor/object selection -> corresponding canonical authored entity id
- globe viewer focus location -> corresponding flat map location
- selected projected feature -> canonical flat feature reference

Requirements:
- this must use the shared projection/transform system already established
- the roundtrip mapping should be mathematically grounded and structurally reusable
- later prompts for picking, export framing, or globe-assisted workflows should be able to consume it directly

This does **not** mean globe becomes the editor. It means the globe can point back to canonical authored context safely.

---

### 7) Implement at least one real globe-context -> flat-context workflow
Add one real workflow that proves roundtrip lookup works.

Examples:
- select or focus a projected landmark on the globe -> reveal/highlight/open corresponding canonical object in flat-side inspector
- click/focus a globe region -> navigate the flat editor to the corresponding map area
- viewer center/focus -> “show on flat map” action

Requirements:
- the workflow must be real, not just a placeholder comment
- the user should be able to understand that the globe is derived, but still useful for navigating canonical content
- the implementation should reinforce the source-of-truth model rather than blur it

This is a major usability bridge between the two workspaces.

---

### 8) Define legal vs illegal globe-side interactions
Introduce explicit rules for what the globe may and may not do at this stage.

At minimum distinguish:
- allowed globe-side actions:
  - inspect
  - navigate
  - focus
  - reveal canonical source content
  - possibly select projected features if that selection maps back safely
- disallowed or deferred actions:
  - silent globe-only edits that do not update canonical data
  - ambiguous direct manipulation without defined roundtrip mapping
  - any interaction that creates conflicting second-source data

Requirements:
- these boundaries should be visible in code architecture and, where useful, in UI language
- later prompts should be able to extend the allowed set intentionally rather than accidentally
- the user should not be misled into thinking the globe is already a full editor if it is not

This protects the product from architectural drift.

---

### 9) Add sync/roundtrip UI feedback
Expose useful UI feedback about sync and roundtrip behavior.

At minimum support some combination of:
- stale/fresh indicators
- refresh/rebuild controls if applicable
- “derived from flat map” messaging where useful
- “show in flat editor” or equivalent roundtrip action
- globe selection status tied to canonical entities
- sync/readiness status in the globe workspace

Requirements:
- the UI should make the source-of-truth relationship understandable
- feedback should be concise and useful, not noisy
- the user should understand what happens when they move between workspaces

This is a product communication problem as much as an engineering one.

---

### 10) Integrate with projected layer systems
The sync and roundtrip rules must work with the projected authored layer families already built.

At minimum support structured behavior for:
- hydrology
- biome/surface-related globe content
- regions/overlays
- symbols/landmarks
- labels/text
- debug/mask overlays where relevant

Requirements:
- projected layer invalidation and refresh should fit the centralized sync model
- globe-side selections/focus should be able to resolve back to canonical entities where appropriate
- no layer family should invent its own incompatible sync rules

This system must be shared and coherent.

---

### 11) Integrate with persistence and project load behavior
Make sure save/load and project restoration fit the sync model.

At minimum support:
- loading canonical authored project data correctly marks or rebuilds derived globe outputs
- persisted viewer preferences stay distinct from canonical authored data
- stale/fresh state after load is sensible and not misleading
- any persisted globe metadata remains clearly derived/view-related rather than canonical source content

Requirements:
- loading a project should not leave the globe in an ambiguous half-valid state
- save/load should reinforce the architectural separation already established
- later export prompts must be able to trust that canonical authored data is authoritative after load

---

### 12) Preserve compatibility with the interactive globe viewer
The sync system must work cleanly with the viewer.

Requirements:
- camera movement should not be treated as canonical authored change
- viewer-only state should remain viewer-only
- projected layer visibility should be separable from canonical authored data where appropriate
- viewer interactions that roundtrip to flat context should use the new shared lookup rules
- refresh behavior should not make the viewer feel unstable or arbitrary

Do not let the viewer become a hidden state mutation trap.

---

### 13) Preserve compatibility with future export and picking work
This prompt should prepare the architecture for later:
- globe-side picking and focus flows
- viewpoint-based export capture
- structured data exports referencing projected content
- possible future controlled globe-assisted edit actions

Requirements:
- sync and roundtrip rules should be centralized and explicit enough that later prompts can extend them safely
- the contracts between canonical data, derived projections, and viewer interactions should remain clear
- later prompts should not need to undo this prompt to continue

---

### 14) Preserve flattened workflow stability
The flat authoring workspace must remain stable and obviously primary.

Requirements:
- no regressions to flat editing behavior
- no confusion about where real edits happen
- flat workspace and save/load behavior must remain intact
- any globe->flat roundtrip should strengthen the flat workspace’s role, not weaken it
- existing Phase 1–3 workflows should remain unbroken

This prompt should make the relationship clearer, not muddier.

---

### 15) Keep performance reasonable
Sync and roundtrip handling should be practical.

Take sensible measures such as:
- dirty flags or granular invalidation
- avoiding unnecessary full globe rebuilds on unrelated viewer-only changes
- resolving canonical entity links efficiently
- keeping reverse lookup logic structured and reusable
- choosing a refresh strategy that fits the app’s real cost profile

Do not overengineer, but do not leave sync behavior as a brute-force black box.

---

## UX expectations
By the end of this prompt, the user should be able to understand:
- the flat map is the canonical editor
- the globe is a derived validation/view workspace
- flat edits can meaningfully refresh the globe
- globe inspection can meaningfully take them back to the right flat-map context
- sync state is understandable and trustworthy

The result should make the whole product feel much more coherent.

---

## Implementation guidance
Prefer:
- centralized sync rules and stale/fresh state
- reusable roundtrip mapping based on the transform system
- explicit allowed/disallowed globe interactions
- globe UI feedback that reinforces source-of-truth clarity
- integration with projected layer families rather than one-off per-layer hacks

Avoid:
- globe-side interactions that quietly mutate conflicting data
- scattering refresh logic into random components
- unclear stale/fresh behavior
- ad hoc reverse lookups that bypass the transform/projection system
- weakening the flat-as-canonical architecture

---

## Deliverables
Implement:
- explicit canonical-vs-derived sync rules in code
- centralized stale/fresh/update state for globe data
- real flat-edit -> globe refresh behavior
- reverse lookup / roundtrip mapping foundations
- at least one real globe-context -> flat-context workflow
- UI feedback for sync and roundtrip state
- integration with projected layer families, persistence, and viewer behavior
- any necessary shared type/store/pipeline updates
- concise developer continuity notes/comments if helpful

Also update any lightweight internal notes if appropriate.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. The codebase has explicit sync rules between canonical flat data and derived globe data.
2. Globe stale/fresh/rebuild state exists in real centralized logic.
3. At least one real flat edit -> globe refresh workflow works end-to-end.
4. The project has a real reverse lookup / roundtrip foundation from globe context to flat canonical context.
5. At least one real globe-context -> flat-context workflow works end-to-end.
6. UI feedback makes the derived-vs-canonical relationship understandable.
7. Existing flat authored workflows, persistence, viewer behavior, and projected globe layers are not broken.
8. The implementation clearly prepares for later picking, export capture, and future controlled roundtrip interactions.

---

## What not to do
Do not:
- turn the globe into a second canonical editor here
- add ambiguous direct globe editing without explicit safe roundtrip design
- hide stale globe state from the user
- scatter sync logic across unrelated components
- destabilize the flat authoring workflow

This prompt is about sync and roundtrip rules only.

---

## Final instruction
Implement the flat-map-to-globe sync and roundtrip rule system cleanly and completely, so World Seed Mapper has a trustworthy relationship between canonical flat authored content and the derived globe workspace, with real refresh behavior and real globe-to-flat context roundtripping.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
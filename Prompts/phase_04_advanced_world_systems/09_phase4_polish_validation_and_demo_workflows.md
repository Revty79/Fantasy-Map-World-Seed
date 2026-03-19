# Phase 4 — Polish, Validation, and Demo Workflows

## Objective
Polish, validate, and harden the completed **Phase 4 flat-to-globe pipeline** for **World Seed Mapper** so the product feels coherent, trustworthy, and demonstrably usable as a full world-authoring-to-globe workflow.

This prompt should focus on:
- globe workflow polish
- validation of the flat-to-globe pipeline
- consistency across flat workspace, globe workspace, sync rules, and export flows
- stability and usability improvements
- clear end-to-end demo-ready workflows
- final Phase 4 handoff quality

This is not a small cosmetic cleanup prompt. It should turn the completed Phase 4 systems into a **cohesive, credible world-to-globe product slice**.

---

## Context
Earlier phases already established:
- flattened-globe-safe procedural world generation
- terrain/elevation authoring
- full flat-map authoring tools across paint, hydrology, regions, symbols, labels, masks
- persistence and save/load behavior
- globe pipeline foundation
- coordinate projection and transform systems
- globe mesh and surface wrapping
- seam, pole, and continuity handling
- interactive globe viewing
- projected authored layers on the globe
- flat-to-globe sync and roundtrip rules
- visual export outputs
- structured data export formats and integration hooks

At this point, the product should already be functionally capable.

This prompt now needs to:
- tighten rough edges
- validate that the flat and globe systems truly agree
- improve usability and trust
- ensure export/sync/view behavior is understandable
- leave the codebase in a strong demoable state

---

## Required outcome
When complete, the app should feel like a **real integrated world authoring and globe validation workspace** where:
1. flat authoring and globe viewing clearly belong to the same product
2. sync behavior is understandable and trustworthy
3. projected globe content feels coherent and inspectable
4. export behavior feels intentional and dependable
5. continuity and transform assumptions are validated enough to trust
6. the codebase is left in a strong handoff state after Phase 4

At least one full **end-to-end flat-author -> globe -> export demo workflow** should be easy to perform by the end of this prompt.

---

## Core implementation tasks

### 1) Audit and unify the Phase 4 UX
Review and improve consistency across:
- flat workspace to globe workspace transitions
- globe viewer controls
- sync/freshness messaging
- export entry points
- projected layer controls
- diagnostics/debug overlays
- action naming and button hierarchy
- status messaging about canonical vs derived data

Requirements:
- the product should feel like one system, not a flat app plus a separate globe demo
- similar actions should behave similarly
- confusing wording or duplicated controls should be reduced where practical
- the canonical flat map / derived globe relationship should be obvious without being noisy

This must improve real usability, not only visuals.

---

### 2) Tighten flat-to-globe workflow transitions
Validate and polish the transitions between:
- flat editing
- globe inspection
- stale/fresh refresh states
- “show on flat map” or equivalent roundtrip actions
- exporting from flat vs exporting from globe
- loading a project and moving into globe view

Requirements:
- the user should understand what state they are in
- transitions should not leave stale inspector, selection, or viewer state hanging around in confusing ways
- the globe should not feel disconnected from the flat editor
- stale/fresh transitions should feel predictable

This is one of the biggest trust issues in the product and should be tightened carefully.

---

### 3) Improve globe viewer interaction clarity
Polish the interactive globe viewer so it feels dependable and intentional.

At minimum review and improve:
- orbit/zoom smoothness and constraints
- reset/home behavior
- seam/pole diagnostic visibility controls
- status readouts
- projected layer toggles
- camera framing defaults
- empty or loading states for globe-derived data

Requirements:
- the viewer should feel like a real workspace, not a fragile sandbox
- users should not get lost easily
- diagnostics should help rather than clutter
- the viewer should remain clearly derived from flat authored data

---

### 4) Validate transform, seam, and pole correctness in real workflows
Perform a focused integration pass on:
- coordinate transforms
- seam crossing behavior
- pole-adjacent behavior
- continuity of projected paths/polygons
- continuity of raster-backed globe surface content
- viewer/readout behavior around problem areas

Requirements:
- obvious mismatches or broken cases should be fixed where practical
- validation should go beyond internal assumptions and appear in real app workflows
- the project should gain stronger confidence in the flat-to-globe transform path
- the product should not silently fail in the places users naturally distrust most

This is a major trust-building part of the polish pass.

---

### 5) Harden projected layer coexistence on the globe
Review and improve how projected authored content appears together on the globe.

At minimum validate and polish:
- hydrology visibility/readability
- region overlays
- symbols/landmarks
- labels/text
- debug/mask overlays where present
- render ordering and clutter management
- selection/focus feedback where applicable

Requirements:
- the globe should not become visually chaotic by default
- important layers should remain legible
- projected content should feel like real authored world content, not random decorations
- default visibility/order choices should be sane and demo-friendly

---

### 6) Improve sync and stale/fresh feedback
The sync system is central to trust. Review and improve it.

At minimum ensure:
- stale state is clearly communicated
- fresh state is clearly communicated
- refresh/rebuild actions are obvious if relevant
- derived rebuild-in-progress state is understandable
- export behavior clearly reflects freshness rules
- globe state after flat edits or project load is not ambiguous

Requirements:
- users should understand whether the globe reflects the current canonical flat world
- the system should avoid both silent staleness and excessive noisy warnings
- the chosen refresh strategy should feel consistent across the product

---

### 7) Validate roundtrip and canonical-context workflows
Perform a real polish pass on workflows where globe context leads back to canonical flat context.

At minimum review and improve:
- “show in flat editor” or equivalent actions
- projected feature selection/focus handoff
- globe context -> flat location navigation
- viewer state preservation where appropriate
- canonical inspector/selection behavior after roundtrip

Requirements:
- roundtrip behavior should reinforce the flat map as source of truth
- users should not feel like the globe is a dead-end view
- roundtrip actions should feel intentional and useful, not technical

This is a key part of making the two workspaces feel like one product.

---

### 8) Validate visual export workflows end-to-end
Perform a real export validation pass for:
- flat image export
- globe image capture
- resolution/sizing behavior
- layer-aware export options
- freshness-aware globe export behavior
- export success/failure messaging

Requirements:
- obvious broken or misleading export paths should be fixed
- exports should match user expectations closely enough for a demo-ready product
- stale globe export warnings/behavior should be trustworthy
- output naming and workflow clarity should improve where practical

The app should feel capable of producing real outputs, not only internal renders.

---

### 9) Validate structured data export workflows
Perform a real validation pass for:
- full world/project structured export
- layer-family-specific exports
- version metadata
- coordinate-space metadata
- canonical vs derived export distinctions
- failure handling for invalid or incomplete export requests

Requirements:
- the structured export system should feel coherent and intentional
- obvious schema or missing-field issues should be tightened
- the app should communicate clearly when exporting data versus images
- exported outputs should be trustworthy enough for downstream experimentation

This helps the product feel like a platform rather than only a viewer.

---

### 10) Improve startup, load, and demo experience
Polish the experience when the user:
- opens a fresh project
- loads an existing project
- first opens the globe workspace
- performs a first sync/refresh
- runs an export
- explores diagnostics

Requirements:
- default states should feel understandable
- the user should not need developer knowledge to get value out of the app
- empty states or first-use guidance should be helpful and light
- the app should feel demoable from a clean start

This is especially important for showing the product to others.

---

### 11) Create one or more demo-ready end-to-end workflows
Ensure the app supports at least one polished workflow such as:

#### Demo workflow example
1. generate or open a world
2. make a visible flat-map terrain or paint edit
3. add or confirm hydrology/regions/landmarks/labels
4. move to the globe workspace
5. refresh or confirm fresh globe state
6. inspect the globe with seam/pole diagnostics if useful
7. roundtrip a globe context back to the flat map
8. export a globe image
9. export a structured world package

Requirements:
- the workflow should be realistically performable through the current UI
- blocking rough edges should be fixed where practical
- lightweight demo notes/checklists are allowed if useful, but keep them concise
- this should feel like a product walkthrough, not a dev-only test sequence

---

### 12) Improve action clarity across build/refresh/export flows
Review the primary action language and behavior across:
- refresh/rebuild
- reset/home
- export/capture
- reveal/show on flat map
- diagnostics toggles
- layer toggles
- save/load-related globe rebuild messaging

Requirements:
- action wording should become more consistent
- destructive/confusing actions should be clearer
- users should understand when they are previewing, rebuilding, exporting, or navigating
- the product should feel more polished and less ambiguous

---

### 13) Polish performance-sensitive rough edges
Without turning this into a deep optimization phase, identify and improve practical performance pain points such as:
- unnecessary globe rebuilds
- expensive projected layer refreshes
- viewer lag during interaction
- overly chatty diagnostics
- export preparation stalls where avoidable
- redundant transform work
- avoidable sync churn after ordinary flat edits

Requirements:
- prioritize practical improvements with clear payoff
- avoid giant speculative rewrites
- the app should feel more stable and responsive after this pass

---

### 14) Add concise developer-facing continuity notes where helpful
Where useful, add brief notes/comments describing:
- current canonical vs derived rules
- current transform/continuity assumptions
- current refresh strategy
- current export boundaries
- known deliberate simplifications
- recommended future extension points if the project continues later

Keep this concise and useful.
Do not create documentation clutter.

---

### 15) Leave the codebase in a clean final Phase 4 handoff state
Make final small architectural or organizational improvements that reduce friction after this prompt.

At minimum ensure:
- export hooks are easy to find
- globe pipeline modules are not scattered confusingly
- sync and stale/fresh logic are centralized enough to maintain
- projected layer architecture is readable
- canonical-vs-derived naming remains clear
- the final state of the project feels intentional

Do not start a new phase here. Leave the codebase clean, stable, and coherent.

---

## UX expectations
By the end of this prompt, the user should be able to open World Seed Mapper and feel that:
- the flat world authoring and globe workspace belong together
- projected globe content is meaningful and trustworthy
- freshness/sync behavior makes sense
- exporting visuals and data is real and usable
- seam/pole/continuity concerns are being handled deliberately
- the product is demo-ready rather than still feeling experimental

The result should feel like “a coherent world authoring to globe pipeline application.”

---

## Implementation guidance
Prefer:
- focused integration fixes with meaningful trust/usability payoff
- consistency improvements across flat, globe, sync, and export systems
- polish grounded in real workflows rather than superficial styling alone
- stability improvements around state transitions, diagnostics, and export
- practical demoability and trust improvements

Avoid:
- spending the whole prompt on surface-only cosmetic tweaks
- giant rewrites that destabilize already-working systems
- adding noisy tutorial bloat unless it clearly improves clarity
- expanding scope into new major features beyond polish/validation/handoff
- undermining the canonical flat-map architecture

---

## Deliverables
Implement:
- Phase 4 UX and workflow polish improvements
- transform/continuity validation fixes where needed
- sync/roundtrip/export usability improvements
- projected-layer coexistence polish
- startup/load/demo workflow improvements
- at least one clearly demoable end-to-end workflow
- small performance/stability improvements where high-value
- concise developer continuity notes/comments if useful

Also update any lightweight internal notes if helpful.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. The major flat-to-globe systems feel more cohesive and consistent in one product workflow.
2. Globe viewing, sync state, roundtrip behavior, and export flows are more predictable and understandable.
3. Transform/seam/pole behavior has been validated and tightened enough to improve trust materially.
4. Projected authored content on the globe behaves more coherently and readably.
5. Visual export and structured data export workflows both work reliably enough for a real demo.
6. At least one end-to-end world-author -> globe -> export workflow is easy to perform.
7. Existing Phase 1–4 functionality is not broken.
8. The codebase is left in a clean, stable, trustworthy final Phase 4 handoff state.

---

## What not to do
Do not:
- introduce a brand new major phase of features here
- turn this into a purely cosmetic styling pass
- destabilize working flat/globe architecture with broad rewrites
- weaken the canonical flat-map / derived globe product model

This prompt is about polish, validation, cohesion, and final handoff quality.

---

## Final instruction
Polish and validate the completed Phase 4 world-to-globe pipeline so World Seed Mapper feels cohesive, trustworthy, and demo-ready across flat authoring, globe inspection, sync behavior, and export workflows, and leave the codebase in a clean final handoff state.

When finished, update `/prompts/phase_01_core_world_drafting/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
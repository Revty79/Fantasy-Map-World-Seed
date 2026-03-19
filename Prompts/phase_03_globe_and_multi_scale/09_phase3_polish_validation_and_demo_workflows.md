# Phase 3 — Polish, Validation, and Demo Workflows

## Objective
Polish, validate, and harden the completed **Phase 3 authoring stack** for **World Seed Mapper** so the editor feels coherent, dependable, and demonstrably usable before Phase 4 begins.

This prompt should focus on:
- quality and workflow polish
- stability and usability improvements
- validation of core authoring systems
- consistency across tools and panels
- clear demo-ready workflows
- preparation for the Phase 4 globe/export stage

This is not a “small cleanup only” prompt. It should turn the Phase 3 editor from “many implemented systems” into a **cohesive, usable authoring product slice**.

---

## Context
Earlier phases already established:
- flattened-globe-safe map canvas assumptions
- procedural/fractal world generation
- elevation and heightmap editing
- Phase 3 authoring workspace foundation
- reusable brush/painter foundations
- hydrology tools
- biome and surface painting
- regions, boundaries, and overlays
- symbols, stamps, and landmarks
- labeling and text tools
- selection/fill/erase/mask utilities
- persistence schema and export hooks

At this point, the editor should already have most major Phase 3 systems in place.

This prompt now needs to:
- remove rough edges
- validate that systems coexist correctly
- improve UX clarity and consistency
- make the editor presentable and trustworthy
- leave the codebase in a strong handoff state for Phase 4

---

## Required outcome
When complete, the app should feel like a **real integrated world-authoring workspace** where the major Phase 3 systems:
1. work together coherently
2. are visibly understandable to the user
3. do not feel like disconnected prototypes
4. survive core save/load workflows
5. are ready to feed Phase 4 globe/export features

At least one real **end-to-end demo authoring workflow** should be easy to perform by the end of this prompt.

---

## Core implementation tasks

### 1) Audit and unify Phase 3 UX
Review the complete Phase 3 editor and improve consistency across:
- toolbar behavior
- side panel structure
- active mode/tool presentation
- layer visibility controls
- inspector/property editing patterns
- selection behavior
- empty states and placeholder messaging
- action naming and labels
- button hierarchy and interaction clarity

Requirements:
- the UI should feel like one editor, not many unrelated mini-tools
- similar actions should behave similarly across systems
- obvious rough spots should be tightened
- confusing or redundant controls should be cleaned up where practical

Do not do shallow cosmetics only; improve real usability.

---

### 2) Tighten authoring workflow transitions
Validate and polish switching between major authoring modes such as:
- navigation/view
- elevation/terrain editing
- brush paint modes
- hydrology
- regions/overlays
- symbols/landmarks
- labels/text
- selection/mask utilities

Requirements:
- mode changes should be predictable
- stale transient state should not leak between tools
- accidental tool conflicts should be reduced
- selection and inspector state should behave sensibly during transitions
- the editor should communicate what mode/tool is currently active

This is especially important because the editor now has many systems competing for the same canvas.

---

### 3) Improve canvas feedback and interaction clarity
Polish the editor’s on-canvas feedback.

At minimum review and improve:
- hover states
- active selection states
- placement previews
- brush previews
- in-progress creation/edit previews
- cancellation behavior
- cursor/readout/status feedback
- target layer/tool visibility cues

Requirements:
- users should understand what will happen before committing major edits
- placement and selection workflows should feel less ambiguous
- preview vs committed state should be visually distinct

This does not need to become visually flashy, but it should become more trustworthy.

---

### 4) Validate coexistence of all Phase 3 layers
Perform a real integration pass across:
- terrain/elevation
- paint layers
- hydrology
- regions/overlays
- symbols/landmarks
- labels/text
- masks/selections
- debug/preview overlays if present

Requirements:
- visibility toggles should work coherently
- render order should be sensible
- no major authored content should disappear unexpectedly behind other layers
- overlay clutter should be reduced where practical
- selected objects/features should remain visually legible

Where conflicts exist, choose sane default ordering and visibility behavior.

---

### 5) Harden selection and inspector behavior
Selection is now central to the editor. Validate and polish it.

At minimum ensure:
- selecting objects/features is predictable
- selection clears or persists sensibly when tools change
- active inspector content is accurate
- editing one object does not leave stale inspector state for another
- delete/duplicate/edit actions target the correct thing
- selection feedback remains visible across zoom levels where reasonable

If multiple systems implemented their own local patterns, unify them now as much as practical.

---

### 6) Improve layer panel usability
Polish the layer/overlay management UI.

At minimum review and improve:
- visibility toggles
- active-target indication
- grouping or sectioning of layers
- naming clarity
- selected layer feedback
- locked/editable state presentation if implemented
- opacity/style controls where already supported

Requirements:
- users should understand what each layer represents
- the currently editable target should be obvious
- the panel should support real authoring rather than only debug inspection

If the app already supports layer ordering or grouping, tighten it. If not, do not force a giant rework unless clearly necessary.

---

### 7) Validate persistence round-trips across major systems
Perform a real save/load validation pass for major Phase 3 content.

At minimum verify that the current save/load workflow properly restores:
- terrain/elevation edits
- paint layers
- hydrology features
- regions
- placed symbols/landmarks
- labels/text
- persistent masks if applicable
- relevant layer metadata/settings where intended

Requirements:
- obvious broken restore paths should be fixed
- missing/null handling should be improved where practical
- saved data should restore into the actual authoring architecture
- the editor should remain stable after loading

This should result in higher confidence that Phase 3 work is durable.

---

### 8) Add validation and guardrails for common error cases
Tighten the editor against common failure modes.

Examples:
- invalid creation state when a user cancels midway
- orphaned linked labels/objects
- malformed persisted data
- empty text labels or half-created features
- duplicate temporary ids
- bad active-layer/tool combinations
- trying to edit a hidden/locked/unavailable target
- mismatched inspector state after deleting selected objects

Requirements:
- the app should degrade gracefully
- obvious error states should not leave the editor confused
- minimal, practical safeguards are preferred over giant abstractions

Add focused guardrails where they materially improve reliability.

---

### 9) Improve default starter/project experience
Polish how the editor feels when opening a fresh or recently loaded map.

At minimum improve:
- initial visible state
- default active mode/tool
- default visible layers
- first-use hints or empty-state guidance where appropriate
- basic workflow discoverability
- clarity around what to do first

Requirements:
- opening the editor should not feel like being dropped into an unmarked control room
- the user should be able to understand the basic authoring flow quickly
- the project should feel demoable without requiring internal developer knowledge

Keep this lightweight and practical.

---

### 10) Create one or more demo-ready authoring workflows
Make sure the app supports at least one polished demo flow that proves Phase 3 value.

At minimum, define and support a workflow similar to:
1. generate/open a world map
2. adjust some terrain/elevation
3. paint biome/surface areas
4. add a river and lake
5. define a region
6. place a landmark/symbol
7. add labels
8. save the project
9. reload it successfully

Requirements:
- the workflow should be realistically performable in the current UI
- rough edges that block the flow should be fixed where practical
- this does not need a separate tutorial system unless lightweight guidance already fits well
- the editor should feel demonstrably capable by the end

You may add a lightweight dev/demo note or sample checklist if useful, but keep it concise.

---

### 11) Improve action clarity for create/edit/delete flows
Review the primary CRUD-style actions across Phase 3 systems.

At minimum improve:
- commit/apply/confirm actions
- cancel behavior
- delete/remove behavior
- duplicate behavior where supported
- rename/edit behavior
- explicitness of destructive actions where necessary

Requirements:
- users should not be confused about whether they are previewing, editing, or committing
- destructive actions should not feel accidental
- action wording and placement should become more consistent

---

### 12) Polish performance-sensitive rough edges
Without overengineering, identify and improve obvious performance issues in the Phase 3 editor.

Examples:
- unnecessary rerenders during selection changes
- expensive full-map redraws for tiny overlay edits
- slow hover hit-testing
- laggy inspector updates
- duplicated layer processing
- avoidable persistence serialization overhead during ordinary editing

Requirements:
- prioritize practical fixes with good payoff
- do not undertake giant speculative rewrites
- the editor should feel more stable and responsive after this pass

This is a polish pass, not a full optimization phase.

---

### 13) Add concise developer-facing continuity notes where helpful
Where useful, add brief notes/comments describing:
- current render/layer assumptions
- current persistence expectations
- known deliberate simplifications
- recommended Phase 4 extension points
- major integration decisions from this prompt

Keep this brief and useful.
Do not produce excessive documentation clutter.

---

### 14) Prepare clean handoff into Phase 4
Make small architectural or organizational improvements that reduce friction for the globe/export stage.

At minimum make sure:
- export hooks remain easy to find
- projection/globe-related metadata is not lost or hidden
- authored content remains clearly map/world-space aligned
- layer/object systems do not rely on screen-only assumptions
- there is a clear, stable base for later globe wrapping and export workflows

Do not build Phase 4 here, but leave the codebase obviously ready for it.

---

## UX expectations
By the end of this prompt, the user should be able to open the editor and feel that:
- the major authoring tools belong together
- the interface is understandable
- selections, tools, and layers behave consistently
- saving/loading is trustworthy
- the app is ready for a serious next phase rather than still being a loose experiment

The result should feel more like “a cohesive map authoring application” and less like “a collection of implemented features.”

---

## Implementation guidance
Prefer:
- focused cleanup with meaningful usability payoff
- consistency improvements across existing components
- stabilization of state transitions and selection behavior
- render/layer order improvements grounded in actual editor use
- practical fixes that improve demoability and trust

Avoid:
- turning this into a purely cosmetic restyling pass
- giant rewrites that destabilize already-working systems
- scattering one-off fixes without reinforcing the shared architecture
- adding noisy tutorial bloat unless it clearly improves usability
- expanding scope into full Phase 4 globe/export implementation

---

## Deliverables
Implement:
- Phase 3 UX and workflow polish improvements
- consistency fixes across modes/tools/panels
- integration fixes across major authored systems
- persistence validation fixes where needed
- improved demo-ready authoring flow
- small performance/stability improvements where high-value
- concise developer continuity notes/comments if useful

Also update any lightweight internal notes if helpful for the next phase.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. The major Phase 3 systems feel more cohesive and consistent in one editor workspace.
2. Mode switching, selection behavior, and inspector behavior are more predictable and stable.
3. Layer/overlay visibility and render ordering behave sensibly across major systems.
4. At least one real end-to-end authoring workflow is easy to perform in the current UI.
5. Save/load works reliably enough to support a demo round-trip of major authored content.
6. Common rough edges and obvious failure cases are reduced or guarded against.
7. The editor feels more trustworthy, understandable, and presentable than before this prompt.
8. Existing Phase 1/2/3 functionality is not broken.
9. The codebase is left in a strong, clear handoff state for Phase 4 globe/export work.

---

## What not to do
Do not:
- build the full Phase 4 globe wrapping/export system here
- undertake a broad redesign that discards working architecture
- spend the entire prompt on superficial visual tweaks only
- add heavy tutorial systems unless truly necessary for usability

This prompt is about polish, validation, cohesion, and handoff readiness.

---

## Final instruction
Polish and validate the completed Phase 3 editor so it feels cohesive, stable, and demo-ready, and leave the codebase in a strong handoff state for Phase 4.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
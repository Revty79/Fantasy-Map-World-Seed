# Phase 4 — Interactive Globe Viewer

## Objective
Build the interactive globe viewer for **World Seed Mapper** so users can meaningfully inspect, navigate, and validate their derived globe rather than only seeing a static spherical render.

This prompt should establish:
- real interactive globe camera controls
- globe-focused viewer state and interaction behavior
- inspectable globe navigation and viewpoint management
- globe-side layer visibility and debug controls
- meaningful feedback for projected content and continuity validation
- a viewer experience that fits the existing flat-authoring-first workflow

This prompt is about turning the derived globe into a usable inspection and validation workspace.

---

## Context
Earlier Phase 4 prompts already established:
- the globe pipeline foundation
- the coordinate projection and transform system
- the globe mesh and surface-wrapping system
- seam, pole, and continuity handling foundations
- canonical flat authored data as the source of truth
- a globe workspace/view entry point and derived globe pipeline boundaries

Now the product needs a real interactive globe viewer so users can:
- rotate around the globe
- zoom in/out
- inspect seam and pole behavior
- validate how authored flat-map data appears on the sphere
- prepare for projected layers and export workflows later

Important product rule:
- the flat map remains the canonical editable source
- the globe viewer is initially an inspection/validation/render workspace derived from flat authored data
- globe interactivity must not silently create a competing source of truth

---

## Required outcome
When complete, the app should support a real interactive globe viewing workflow where the user can:
1. open the globe workspace
2. rotate the globe smoothly and intentionally
3. zoom and inspect different regions of the world
4. reset or reorient the view predictably
5. toggle relevant globe-side layers/debug aids
6. inspect the globe as a real product feature rather than a static demo
7. do all of the above without breaking the flat authoring workflow

At least one fully usable **interactive orbit/zoom globe workflow** should be functional by the end of this prompt.

---

## Core implementation tasks

### 1) Implement the globe camera/view interaction model
Create the core interaction model for the globe viewer.

At minimum support:
- orbit/rotation around the globe
- zoom in/out
- pan-style behavior only if it truly fits the chosen viewer model
- predictable focus/target behavior
- stable camera constraints that prevent unusable states
- smooth input handling for mouse/trackpad and reasonable extensibility for touch later

Requirements:
- interaction should feel deliberate and editor-grade
- the globe should remain the clear center of navigation
- camera behavior should not fight the user
- the model must fit the existing globe pipeline/view architecture

Choose a viewer model that makes sense for a spherical world inspector.

---

### 2) Centralize globe viewer state
Extend or refine the globe-specific state model so the viewer uses centralized state rather than ad hoc local component state.

At minimum support structure for:
- camera orientation
- zoom/distance
- target/focus state
- viewer mode or interaction mode
- selected globe debug overlays
- active projected layer visibility where appropriate
- reset/default-view behavior
- stale/fresh derived state visibility if useful

Requirements:
- viewer state should be discoverable and maintainable
- the implementation should fit the globe pipeline/state architecture established earlier
- later prompts should be able to add picking, overlay interactions, and export framing without replacing this state model

Do not scatter critical viewer behavior across unrelated components.

---

### 3) Add globe workspace controls
Create the visible globe viewer control surface in the UI.

At minimum include usable controls for:
- reset view
- zoom in/out if not entirely gesture-driven
- globe debug overlay visibility where applicable
- seam/pole diagnostic toggle access if already available
- projected layer visibility controls or at least placeholders wired to real state
- view/status readouts where helpful

Requirements:
- controls should feel integrated into the globe workspace
- the user should understand that this is a viewer/inspection environment
- controls should not overwhelm the workspace or feel like a raw debug dump

The globe view should feel intentional and navigable.

---

### 4) Implement stable default viewpoints
Add clear default and resettable globe viewpoints.

At minimum support:
- a default initial globe orientation
- a reset-to-home/default view action
- a sensible zoom default
- optional predefined viewpoints such as seam-facing or pole-facing if useful
- persistence of viewer preferences only where appropriate

Requirements:
- entering the globe viewer should feel understandable
- users should not get lost permanently after rotating/zooming awkwardly
- the default viewpoint should help demonstrate the world clearly

A strong reset/home behavior matters a lot for usability.

---

### 5) Add visible status/inspection readouts
Provide lightweight globe-view feedback so the user can understand what they are seeing.

Useful readouts may include:
- current viewer mode
- zoom level or camera distance
- active debug overlays
- derived globe freshness/staleness
- current globe-facing longitude/latitude center if practical
- projected layer visibility summary
- selected object/feature placeholder if later interaction is not fully implemented yet

Requirements:
- readouts should help the user trust the viewer
- keep them concise and useful
- avoid turning the UI into a noisy developer console

At least one meaningful status/inspection feedback path should exist.

---

### 6) Integrate seam/pole diagnostics into the viewer
Use the continuity systems from the previous prompt in a visible way inside the viewer.

At minimum support one or more of:
- seam line visibility toggle
- pole region highlight toggle
- continuity debug overlay toggle
- seam/pole issue indicators for selected or visible data if practical
- viewer-accessible continuity diagnostics state

Requirements:
- the interactive globe should help validate continuity, not hide it
- diagnostics should feel like a purposeful inspection aid
- these controls should use the centralized globe state and pipeline structures already established

This is a major reason the globe viewer exists in Phase 4.

---

### 7) Support responsive viewer rendering behavior
Make sure the interactive viewer remains usable as the user manipulates it.

Requirements:
- camera interaction should update the rendered globe cleanly
- the viewer should remain stable during zoom/rotation
- visible lag from avoidable full rebuilds should be reduced where practical
- derived globe assets should not rebuild unnecessarily on every camera movement
- the render loop and derived-data pipeline should remain clearly separated

This prompt should make the globe feel alive without turning the pipeline into chaos.

---

### 8) Add viewport/container resilience
Ensure the globe viewer behaves sensibly inside the app layout.

At minimum account for:
- resizing the window/panel
- sidebar/panel changes affecting available space
- maintaining aspect ratio and camera stability
- keeping the globe visible and framed correctly
- avoiding broken viewer states when the workspace layout changes

Requirements:
- the globe viewer should feel like a real part of the app, not a fragile embedded demo
- layout changes should not easily break camera framing or rendering

This matters because the globe workspace will likely coexist with controls and diagnostics.

---

### 9) Prepare for later picking and feature interaction
Even if full picking comes later, structure the viewer so later prompts can support:
- selecting projected landmarks/symbols
- selecting regions or paths
- feature hover inspection
- reverse lookup from globe position to authored flat-map position
- click-to-focus on projected content

Requirements:
- the viewer architecture should leave a clean place for interaction hooks
- the camera/control system should not block future picking
- state contracts for selection/focus should be prepared where appropriate

Do not build the full projected-overlay interaction stack here unless it is straightforward, but do leave clear seams for it.

---

### 10) Preserve compatibility with flat-authoring workflow
The interactive globe viewer must coexist cleanly with the established flat editor.

Requirements:
- the flat map remains the main canonical editing surface
- the globe viewer should not confuse users into thinking edits are happening directly on the globe unless explicitly supported later
- switching between flat and globe workspaces should be stable
- no regressions to earlier authoring systems or persistence
- the viewer should reinforce the flat->globe derived relationship, not obscure it

This is a core product architecture rule.

---

### 11) Preserve compatibility with later projected layers
The viewer must be ready for later prompts that project authored systems onto the globe, including:
- hydrology
- biome/surface paint refinement
- regions/overlays
- symbols/landmarks
- labels/text
- masks/debug overlays

Requirements:
- viewer render layering should be organized cleanly
- later projected content should have obvious render and visibility integration points
- the viewer should not be architected as “one globe texture and nothing else”

This prompt should make the viewer extension-ready.

---

### 12) Preserve persistence and export compatibility
Extend state/hooks where needed so the viewer can support later save/load/export scenarios.

At minimum provide hooks for:
- optional persisted globe viewer preferences where appropriate
- export capture viewpoint framing later
- stable default viewpoint metadata if useful
- debug/view mode state boundaries that remain distinct from canonical authored data

Requirements:
- canonical authored map data remains separate from viewer state
- export and capture prompts later should be able to find viewer framing/state intentionally rather than through hacks

Do not bloat the project save with transient viewer noise unless clearly beneficial.

---

### 13) Keep performance reasonable
Interactive globe navigation should feel usable on reasonable hardware.

Take sensible measures such as:
- separating viewer camera updates from expensive derived globe rebuilds
- avoiding unnecessary rerender work outside what camera changes require
- keeping diagnostics opt-in or lightweight where possible
- choosing control and render approaches that scale reasonably

Do not overengineer, but do not create a viewer that feels obviously fragile or laggy.

---

## UX expectations
By the end of this prompt, the user should be able to:
- open the globe viewer
- rotate and zoom around their world
- reset to a helpful default view
- inspect seam/pole diagnostics in an interactive way
- understand that the globe is now a real derived inspection workspace

The globe should feel like a real product feature, not just a static proof of concept.

---

## Implementation guidance
Prefer:
- centralized globe viewer state
- structured orbit/zoom camera controls
- integrated control UI within the globe workspace
- viewer behavior that clearly respects the flat-as-canonical rule
- lightweight but useful diagnostics and status feedback

Avoid:
- ad hoc camera behavior buried inside a render component
- uncontrolled free-fly navigation that confuses the product purpose
- rebuilding derived globe assets every time the camera moves
- a viewer that hides important seam/pole issues instead of helping inspect them
- destabilizing the flat editor or earlier Phase 4 foundations

---

## Deliverables
Implement:
- real interactive globe camera controls
- centralized viewer state integration
- globe workspace controls
- default/reset viewpoints
- viewer status/readout support
- seam/pole diagnostic visibility integration
- responsive viewer rendering/layout behavior
- extension-ready hooks for later picking/feature interactions
- any necessary shared type/store/pipeline updates
- concise developer continuity notes/comments if helpful

Also update any lightweight internal notes if appropriate.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. The user can rotate and zoom a real globe interactively inside the app.
2. Globe viewer behavior is driven by centralized globe/viewer state.
3. The viewer has a sensible default orientation and reset/home workflow.
4. Globe-side controls and status/readouts exist in a usable form.
5. Seam/pole diagnostics can be surfaced interactively in the viewer.
6. Camera interaction does not trigger unnecessary full derived-data rebuild behavior.
7. Existing flat authored workflows and earlier globe foundations are not broken.
8. The implementation clearly prepares for projected-feature layers, picking, and export-oriented viewpoint capture later in Phase 4.

---

## What not to do
Do not:
- turn the globe into the canonical editable source here
- build the full projected overlay interaction stack here
- build final export capture workflows here
- hide all important diagnostics for the sake of looking pretty
- destabilize the existing flat authoring workflow

This prompt is the interactive globe viewer foundation only.

---

## Final instruction
Implement the interactive globe viewer cleanly and completely, giving World Seed Mapper a real navigable globe inspection workspace built on the established derived-globe pipeline while preserving the flat map as the canonical authored source.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
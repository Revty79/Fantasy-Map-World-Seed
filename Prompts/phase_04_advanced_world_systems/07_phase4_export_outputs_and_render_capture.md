# Phase 4 — Export Outputs and Render Capture

## Objective
Build the export outputs and render-capture system for **World Seed Mapper** so users can generate meaningful visual outputs from both the canonical flat map and the derived globe workspace.

This prompt should establish real export/render workflows for:
- flat map image export
- globe render/image capture
- layer-aware export options
- consistent framing and resolution controls
- export-time use of the derived globe pipeline
- future compatibility with structured data export and downstream publishing workflows

This prompt is about turning the project from “viewable in-app” into “able to produce real usable visual outputs.”

---

## Context
Earlier Phase 4 prompts already established:
- the globe pipeline foundation
- the coordinate projection and transform system
- the globe mesh and surface-wrapping system
- seam, pole, and continuity handling
- the interactive globe viewer
- projected authored layers on the globe
- sync and roundtrip rules between canonical flat data and the derived globe workspace

At this stage, the app should already have:
- a flat canonical world authoring workspace
- a derived interactive globe workspace
- projected authored content visible on the globe
- clear stale/fresh rules for globe-derived state

Now the product needs real visual export capabilities so users can:
- save flat world maps as images
- capture globe renders as images
- produce useful outputs for presentation, sharing, reference, and later publishing pipelines

Important product rule:
- flat exports come from canonical or canonically-derived flat render state
- globe exports come from the derived globe pipeline/viewer state
- export logic must respect the canonical-vs-derived boundary already established

---

## Required outcome
When complete, the app should support a real export workflow where the user can:
1. export a flat map render/image
2. export a globe render/image
3. choose useful export options such as resolution and layer visibility scope
4. capture outputs that reflect current authored/projected content accurately
5. understand whether an export is using fresh or stale derived globe state
6. do all of the above without breaking the authoring workflow

At least one complete **flat image export workflow** and one complete **globe render capture workflow** should be functional by the end of this prompt.

---

## Core implementation tasks

### 1) Define the export output model
Implement a shared output/export model that clearly distinguishes export families such as:
- flat map image export
- globe image/render capture
- future structured data export hooks
- future print/presentation outputs

At minimum support metadata or structured handling for:
- export type
- output format
- dimensions/resolution
- included layers or layer preset
- source workspace/view context
- freshness/staleness requirements
- file naming hooks
- optional background/transparency hooks if practical

Requirements:
- the export model should be centralized and reusable
- later prompts should be able to extend it for data export without replacing it
- the model should make canonical flat exports and derived globe exports clearly distinguishable

Do not scatter output behavior across unrelated UI components.

---

### 2) Implement flat map image export
Create a real flat map export workflow.

At minimum support:
- exporting the flat world map to a common raster image format
- using the current authored flat content/layers coherently
- reasonable export dimensions or resolution options
- clear handling of visible vs selected layer scope where appropriate
- file generation/download in a real user workflow

Requirements:
- the flat export should reflect canonical authored map state accurately
- export should not rely on arbitrary screenshots of the browser UI unless that is the only structurally sound first pass
- the workflow should feel intentional and product-grade rather than debug-only

This is one of the main outputs users will expect.

---

### 3) Implement globe render/image capture
Create a real globe export/capture workflow.

At minimum support:
- capturing the current globe view as an image
- using the actual derived globe render rather than a fake placeholder
- preserving meaningful visual fidelity of the globe surface and projected layers
- using current viewer framing/orientation
- file generation/download in a real user workflow

Requirements:
- the globe export must come from the real derived globe workspace/render path
- if the globe is stale, the workflow must handle that intentionally
- the export should preserve the relationship between current viewer state and output framing

This is a major user-facing value point for the globe workspace.

---

### 4) Add resolution and sizing controls
Provide useful export size controls.

At minimum support:
- one or more preset export resolutions/sizes
- custom width/height or another reasonable sizing model if practical
- clear distinction between on-screen viewer size and output size
- aspect-ratio handling that does not produce obviously broken results

Requirements:
- the user should have intentional control over output size
- the system should avoid ambiguous low-quality default outputs where possible
- size settings should be reusable by both flat and globe export paths where appropriate

Keep it practical and product-oriented.

---

### 5) Add layer-aware export behavior
Implement export options that account for layers and overlays.

At minimum support one or more of:
- export current visible layers only
- export with specific layer family toggles
- export with or without debug overlays
- export with or without labels/symbols/regions where relevant
- export a clean presentation view versus a diagnostic/debug view

Requirements:
- behavior should be consistent with the existing layer systems
- exported output should match the user’s intent, not accidentally include random hidden/debug state
- the model should be extensible for future export presets

This matters a lot once the globe has many projected overlays.

---

### 6) Integrate freshness/staleness rules into export
Exports must respect the sync model built earlier.

At minimum support:
- checking whether the globe-derived output is fresh or stale before capture
- clearly communicating this to the user
- blocking, warning, or offering refresh behavior according to the chosen UX strategy
- ensuring flat exports use current canonical authored data
- making export trustable

Requirements:
- users should not unknowingly export stale globe content with no warning
- stale/fresh behavior should use the centralized sync state rather than ad hoc checks
- export behavior should reinforce the canonical-vs-derived model

This is essential for trust.

---

### 7) Implement export UI in the app
Add a real export control surface to the product.

At minimum support:
- an export entry point that is discoverable from the flat workspace and/or globe workspace as appropriate
- export type selection
- sizing/resolution controls
- relevant layer/export option controls
- export action buttons
- helpful status/error messaging

Requirements:
- export UI should feel integrated into the app, not like an internal tool panel
- the user should understand whether they are exporting flat or globe output
- controls should be concise and understandable

This does not need to be a giant wizard, but it must be real and usable.

---

### 8) Add render-capture pipeline structure
Create the render-capture pipeline structure needed for output generation.

At minimum support clear handling for:
- preparing export render inputs
- reading/capturing flat render output
- reading/capturing globe render output
- applying resolution/framing settings
- producing final downloadable output blobs/files

Requirements:
- the capture pipeline should be centralized and reusable
- it should align with the viewer/render architecture already established
- later prompts for more advanced export formats should be able to build on it

Do not bury export capture logic inside one-off button handlers.

---

### 9) Support viewpoint-aware globe export behavior
Globe capture should intentionally use viewer state.

At minimum support:
- exporting the current globe orientation/viewpoint
- capturing current zoom/framing
- reset/default-view export if useful
- future preset-view export hooks if practical

Requirements:
- the captured globe output should match what the user expects from the viewer
- viewer-only state should still remain distinct from canonical authored data
- export framing should be intentional and reproducible enough for later extension

This makes the globe viewer materially useful.

---

### 10) Add export feedback and error handling
Provide clear export feedback.

At minimum support:
- export-in-progress state
- success/failure feedback
- handling of invalid sizing/options
- handling of stale globe output states
- handling of missing derived assets or failed capture states gracefully

Requirements:
- the export workflow should not silently fail
- the user should understand what happened
- failure handling should be practical and stable rather than noisy

This is important for perceived reliability.

---

### 11) Preserve compatibility with projected layer systems
Flat and globe export must work with the authored/projected content families already built.

At minimum account for:
- terrain/elevation
- biome/surface paint
- hydrology
- regions/overlays
- symbols/landmarks
- labels/text
- masks/debug overlays where relevant

Requirements:
- export behavior should align with current layer visibility/order logic
- globe exports should use the derived projected layer outputs rather than inventing parallel render logic
- later export refinements should be able to extend this structure cleanly

This prompt should make export a real consumer of the actual app pipeline.

---

### 12) Preserve compatibility with later data export work
Structure the export system so later prompts can add:
- structured project data export
- terrain/heightmap export
- layer-specific data export
- downstream worldbuilding integrations
- publishing-oriented output presets

Requirements:
- the export architecture should distinguish image/render outputs from future data outputs
- later prompts should not need to replace this prompt’s structure to continue
- shared output metadata and configuration handling should be reusable

This prompt is about visual outputs, but it should not trap the future.

---

### 13) Preserve flattened workflow stability
The export system must not destabilize normal authoring.

Requirements:
- no regressions to flat editing
- no regressions to globe viewing
- no regressions to persistence or sync behavior
- export UI/actions should not confuse where canonical edits happen
- the app should remain understandable even as export features appear

Exports are outputs, not a new editing paradigm.

---

### 14) Keep performance reasonable
Export workflows should be practical.

Take sensible measures such as:
- not rebuilding unrelated derived assets unnecessarily
- separating export-time render preparation from normal interactive rendering where appropriate
- reusing existing render outputs or derived packets where practical
- not freezing the app for avoidable reasons on routine exports

Do not overengineer, but do not implement an obviously fragile capture approach.

---

## UX expectations
By the end of this prompt, the user should be able to:
- export a flat world image
- export a globe image from the current viewer
- control export size/options in a basic but real way
- understand whether the output reflects fresh current project state
- feel that the app can now produce meaningful presentation-ready visuals

This is one of the first moments the project should start feeling shareable.

---

## Implementation guidance
Prefer:
- centralized export/output models
- real flat export and real globe capture paths
- export controls integrated into the current app/workspace structure
- freshness-aware export decisions
- reuse of current render/view/layer systems rather than parallel hacks

Avoid:
- ad hoc screenshot-only behavior that captures random UI chrome unless unavoidable
- exporting stale globe content with no warning
- duplicating large parts of the render pipeline just for export
- burying logic in button components
- destabilizing flat/globe workflow boundaries

---

## Deliverables
Implement:
- shared export output model
- real flat map image export workflow
- real globe render/image capture workflow
- sizing/resolution controls
- layer-aware export behavior
- freshness/staleness-aware export rules
- integrated export UI
- centralized render-capture/export pipeline structure
- export feedback/error handling
- any necessary shared type/store/pipeline updates
- concise developer continuity notes/comments if helpful

Also update any lightweight internal notes if appropriate.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. The app can export a real flat map image in a user-facing workflow.
2. The app can capture/export a real globe image from the derived globe viewer.
3. Export sizing/resolution controls exist in a basic but real form.
4. Export behavior accounts for layer visibility/options in a coherent way.
5. Globe export respects centralized stale/fresh derived-state rules.
6. Export UI and feedback are usable and integrated into the product.
7. Existing flat authoring, globe viewing, sync, and projected layer systems are not broken.
8. The implementation clearly prepares for later structured data export and richer publishing/export presets.

---

## What not to do
Do not:
- collapse visual export and structured data export into one ambiguous system here
- export stale globe content silently
- build the final publishing pipeline for every possible format here
- destabilize the existing flat/globe architecture
- replace canonical render logic with export-only hacks

This prompt is about visual export outputs and render capture only.

---

## Final instruction
Implement the export outputs and render-capture system cleanly and completely, giving World Seed Mapper real flat-map image export and real globe render capture workflows that respect canonical-vs-derived boundaries, current layer behavior, and sync freshness rules.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
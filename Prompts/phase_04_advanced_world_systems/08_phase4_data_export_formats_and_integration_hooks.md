# Phase 4 — Data Export Formats and Integration Hooks

## Objective
Build the structured data export formats and integration-hook system for **World Seed Mapper** so the project can export meaningful non-image outputs for downstream worldbuilding, rendering, simulation, and tooling workflows.

This prompt should establish real export foundations for:
- project/world data export
- terrain/elevation export
- hydrology export
- biome/surface layer export
- regions/overlays export
- symbols/landmarks export
- labels/text export
- integration-ready export hooks for external tools and future internal modules

This prompt is about turning World Seed Mapper into a system that can **hand off usable world data**, not only pictures.

---

## Context
Earlier Phase 4 prompts already established:
- the globe pipeline foundation
- the coordinate projection and transform system
- the globe mesh and surface-wrapping system
- seam, pole, and continuity handling
- the interactive globe viewer
- projected authored layers on the globe
- flat/globe sync and roundtrip rules
- visual export outputs and render capture workflows

At this point, the app should already be able to:
- author a flattened world
- derive that world onto a globe
- export visual outputs

Now it needs structured **data export** so users can reuse their world in:
- other apps
- simulations
- rendering pipelines
- game tools
- archival/project interchange
- future World Seed Mapper ecosystem modules

Important product rule:
- canonical authored data remains the source
- structured exports should derive from canonical data or clearly-defined derived representations
- export formats must respect the canonical-vs-derived architecture already established

---

## Required outcome
When complete, the app should support a real structured export workflow where:
1. major world-data families can be exported in coherent machine-readable forms
2. export formats are clearly defined and version-aware
3. derived globe-specific export hooks exist where appropriate without confusing them with canonical authored exports
4. downstream systems have stable integration access points
5. exports remain aligned with flattened-globe-safe coordinate assumptions and globe transform conventions
6. the flat authoring workflow remains stable and canonical

At least one complete **project/world structured export workflow** and one complete **layer-family-specific export workflow** should be functional by the end of this prompt.

---

## Core implementation tasks

### 1) Define the structured export model
Implement a shared structured-export model that clearly distinguishes:
- image/render exports
- project/world data exports
- layer-family-specific data exports
- canonical flat-data exports
- derived globe-oriented exports where appropriate
- integration-hook/adapter outputs for future systems

At minimum support structured metadata for:
- export family/type
- format id
- version
- source scope
- included content families
- coordinate-space conventions
- projection/globe assumptions where relevant
- export-time options
- file naming hooks

Requirements:
- the model should be centralized and reusable
- later export targets should be able to extend it cleanly
- the model should make canonical and derived outputs clearly distinguishable

Do not treat all exports as one vague blob.

---

### 2) Define a versioned project/world data export format
Create or refine a structured, versioned export format representing a full world/project data package.

At minimum support:
- project/world metadata
- map dimensions / coordinate conventions
- terrain/elevation references or embedded data as appropriate
- paint/biome/surface data
- hydrology data
- regions/overlays data
- symbols/landmarks data
- labels/text data
- persistent masks or related authored utility data where applicable
- export schema version and compatibility metadata

Requirements:
- this export should represent the canonical authored world coherently
- it should be understandable and stable enough for downstream use
- it should not depend on transient UI/viewer-only state
- it should be aligned with the persistence schema while remaining an intentional export format, not merely a dump of internal state

This is the backbone structured export.

---

### 3) Implement terrain/elevation export
Add a real export path for terrain/elevation data.

At minimum support one or more of:
- structured elevation grid export
- terrain metadata export
- heightmap-like data export
- packaged terrain export bundled into the world/project export
- future-ready hooks for external terrain/render pipelines

Requirements:
- the terrain export must derive from canonical authored terrain/elevation data
- coordinate-space assumptions must be explicit
- resolution/dimensions must be clear
- later downstream tools should be able to interpret it without guesswork

This is one of the most important non-visual data families.

---

### 4) Implement hydrology export
Add a real export path for hydrology data.

At minimum support:
- river data export
- lake/waterbody export
- source/flow metadata where available
- seam/continuity-safe representation where relevant
- stable ids and coordinates

Requirements:
- the hydrology export must derive from canonical authored hydrology data
- data should be machine-readable and structurally meaningful
- globe-specific derived handling should remain separate unless explicitly exported as a derived form
- later simulation or rendering tools should be able to consume it

Hydrology is a major integration target.

---

### 5) Implement biome and surface layer export
Add a real export path for biome/surface authored data.

At minimum support:
- biome class/category export
- surface/ground-type export
- paint-layer metadata as appropriate
- explicit dimensions/coordinate-space rules
- stable identifiers and taxonomy hooks

Requirements:
- the export must derive from canonical paint-layer/authored data
- the chosen representation must be understandable and reusable
- later systems should be able to interpret categories without internal code access
- future richer climate/ecology systems should have room to extend the format

This is important for both rendering and gameplay/tooling integrations later.

---

### 6) Implement regions/overlays export
Add a real export path for regions and overlays.

At minimum support:
- region identities
- region names/categories
- boundaries/geometries or mask-backed representation as appropriate
- style metadata where meaningfully exportable
- stable ids and coordinate-space definitions

Requirements:
- export must derive from canonical authored region data
- seam-sensitive geometries should be exported intentionally, not naively corrupted
- the structure should be reusable for geopolitical, cultural, or custom overlay systems later
- later integration tools should be able to attach meaningfully to region ids

This is a major worldbuilding handoff format.

---

### 7) Implement symbols/landmarks and labels export
Add real export paths for placed feature objects and labels.

At minimum support:
- symbol/landmark identities and anchors
- category/type and relevant metadata
- transform properties where applicable
- labels/text content and anchors
- linkage metadata where applicable (for example region-linked or landmark-linked labels)

Requirements:
- exports must derive from canonical authored object/text data
- coordinates must remain explicit and interpretable
- later downstream tools should be able to reconstruct placed world features or annotations
- labels and landmark metadata should not be reduced to purely decorative export noise

This is key for interoperability with future atlas/game/worldbuilding systems.

---

### 8) Define derived globe-oriented export hooks where appropriate
Some downstream workflows may need derived globe-space or globe-aware forms. Add clear hooks for those without blurring them with canonical exports.

Possible examples:
- projected globe anchor positions for symbols/labels
- globe-space coordinates for export consumers that need sphere-ready data
- continuity-prepared path/polygon exports
- export descriptors referencing globe render assumptions

Requirements:
- derived globe-oriented exports must be clearly labeled as derived outputs
- canonical flat-data exports remain primary unless the export type explicitly calls for derived globe-space forms
- later globe-consuming tools should have an intentional path to access these outputs
- do not silently replace canonical exports with derived globe-space data

This preserves architectural clarity while enabling real integrations.

---

### 9) Build integration-hook/adaptor structure
Create a clean place in the codebase for external or downstream integration adaptors.

Examples may include future adaptors for:
- game engine tooling
- map renderers
- simulation tools
- procedural refinement pipelines
- internal World Seed Mapper companion modules
- archival/interchange packages

Requirements:
- the adaptor structure should be centralized and discoverable
- export logic should not be hardwired only to the current UI
- later integrations should be able to reuse canonical export packets and/or derived export packets cleanly

This prompt should make the product more like a platform foundation.

---

### 10) Add export UI/workflows for structured data
Expose a real structured export workflow in the app.

At minimum support:
- choosing a structured export type
- selecting world/package export vs layer-family-specific export
- basic export options where relevant
- initiating a real file generation/download flow
- clear distinction from visual image export

Requirements:
- users should understand when they are exporting data instead of images
- the UI should feel integrated with the existing export system
- options should be concise and understandable

This does not need to be huge, but it must be real and user-facing.

---

### 11) Add validation and compatibility metadata
Implement basic validation for structured exports.

At minimum support:
- schema version metadata
- required-field validation before export where practical
- graceful handling of unsupported or incomplete export requests
- coordinate/projection metadata sufficient for downstream interpretation
- future migration/compatibility-friendly format handling

Requirements:
- structured exports should be trustworthy and self-describing
- export failures should not be mysterious
- downstream tools should not have to guess how to interpret coordinates or data families

This matters more for data export than image export.

---

### 12) Integrate with sync, projection, and continuity systems
Structured exports must align with the systems already built.

At minimum ensure:
- canonical exports come from canonical flat authored data
- derived globe exports use the shared transform and continuity systems when applicable
- stale/fresh derived-state rules are respected for derived export families
- seam/pole-aware derived outputs are accessed intentionally and consistently
- no export family invents incompatible projection math

Requirements:
- the export system must remain consistent with the product architecture
- later export consumers should be able to trust the same world model as the viewer/pipeline
- there should be no silent divergence between render behavior and exported data

---

### 13) Preserve compatibility with persistence and project schema
Where helpful, align structured export formats with the persistence schema without conflating them.

Requirements:
- project persistence remains the internal/source continuity mechanism
- structured export formats remain intentional public-facing or integration-facing outputs
- exports should not indiscriminately dump every transient internal state detail
- alignment with schema versioning and metadata should be strong enough to reduce duplication and confusion

Exports and saves should be related, but not identical by accident.

---

### 14) Preserve flattened workflow stability
The structured export system must not destabilize normal authoring.

Requirements:
- no regressions to flat editing
- no regressions to globe viewing or sync behavior
- no confusion about where canonical edits happen
- export UI/actions should reinforce the canonical-vs-derived model, not obscure it
- existing Phase 1–4 systems should remain stable

Exports are outputs and integrations, not a replacement editing model.

---

### 15) Keep performance reasonable
Structured export should be practical even for larger worlds.

Take sensible measures such as:
- streaming or chunk-aware preparation where practical
- reusing validated canonical data structures when appropriate
- not forcing unnecessary globe-derived computation for canonical exports
- avoiding repeated expensive transformations unless the selected export type truly requires them

Do not overengineer, but do not choose an obviously fragile brute-force approach.

---

## UX expectations
By the end of this prompt, the user should be able to:
- export a full structured world/project package
- export at least one meaningful layer-family-specific data output
- clearly distinguish image export from data export
- understand whether an export is canonical flat data or derived globe-oriented data
- feel that World Seed Mapper is becoming a real platform for downstream use

This is a major step toward making the project truly reusable outside itself.

---

## Implementation guidance
Prefer:
- versioned structured export models
- explicit canonical-vs-derived export families
- reusable data-packet/adaptor architecture
- integration hooks that separate export preparation from UI
- metadata-rich outputs that downstream consumers can actually use

Avoid:
- dumping raw internal state indiscriminately as “export”
- mixing transient viewer state into canonical world exports
- inventing separate one-off export math outside the transform/continuity systems
- making structured export UI indistinguishable from image export
- destabilizing flat/globe authoring architecture

---

## Deliverables
Implement:
- shared structured export model
- versioned project/world data export format
- terrain/elevation export
- hydrology export
- biome/surface export
- regions/overlays export
- symbols/landmarks and labels export
- derived globe-oriented export hooks where appropriate
- centralized integration-hook/adaptor structure
- user-facing structured export workflow/UI
- validation and compatibility metadata handling
- any necessary shared type/store/pipeline updates
- concise developer continuity notes/comments if helpful

Also update any lightweight internal notes if appropriate.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. The app can export a real structured world/project data package.
2. At least one real layer-family-specific structured export workflow exists.
3. Major data families such as terrain, hydrology, regions, landmarks, and labels each have a real export path or structured inclusion in the world package.
4. Structured exports are versioned and self-describing enough for downstream use.
5. Canonical flat-data exports and derived globe-oriented export hooks are clearly distinguished.
6. The export architecture includes centralized integration/adaptor hooks for future downstream systems.
7. Existing flat authoring, globe viewing, sync, persistence, and visual export systems are not broken.
8. The implementation clearly prepares for richer downstream tooling and ecosystem integrations.

---

## What not to do
Do not:
- collapse structured data export into the visual export system as one ambiguous workflow
- dump raw transient UI/viewer state as canonical data export
- invent separate incompatible geometry/projection rules for exports
- destabilize the existing flat/globe architecture
- build every imaginable integration target here

This prompt is about structured data export formats and integration hooks only.

---

## Final instruction
Implement the structured data export formats and integration-hook system cleanly and completely, giving World Seed Mapper real machine-readable world-data export capability across major authored content families while preserving canonical-vs-derived clarity and preparing the project for downstream tooling integrations.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
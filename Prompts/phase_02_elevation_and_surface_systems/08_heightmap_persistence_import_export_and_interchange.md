# 08 — Heightmap Persistence, Import, Export, and Interchange

## Objective
Implement the first real **height-oriented persistence and interchange workflow** for World Seed Mapper so elevation data can be **saved**, **reloaded**, **imported**, **exported**, and **moved between tools** in practical formats without breaking the project’s chunk-aware terrain architecture.

This prompt is where terrain stops being only an internal editor system and becomes a reusable, portable data asset.

---

## Why this prompt exists
By this point, Phase 2 should already have:
- terrain-capable layers
- chunk-aware height data
- sculpt tools
- landform tools
- terrain preview
- hydrology assistance
- biome assistance
- multi-scale terrain workflows

That means the app now has meaningful authored terrain — but the user also needs to:
- save it reliably
- reopen it reliably
- export it for use elsewhere
- import terrain from outside sources
- preserve terrain lineage and scale-aware terrain structures without flattening the whole architecture into something fragile

This prompt should create a practical terrain persistence/interchange foundation that is:
- editor-safe
- chunk-aware
- future-ready
- honest about format limitations

---

## Required outcome
By the end of this prompt, the app should have:

- reliable persistence of terrain/height data in project save/load workflows
- practical import of height-oriented external data
- practical export of height-oriented data
- clear interchange behavior between internal terrain structures and external formats
- terrain-aware file handling that preserves multi-map scope correctly
- separation between internal terrain storage and external interchange representations
- coherent UI for import/export heightmap actions
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** abandon the project’s chunk-aware terrain architecture just to match a simple import/export format.
- Do **not** make import/export depend on full 3D terrain or globe editing.
- Do **not** silently destroy authored terrain when importing.
- Do **not** pretend every external format has perfect fidelity with internal terrain data.
- Do **not** flatten all terrain persistence into a single giant blob if segmented persistence is cleaner.
- Do **not** overbuild a giant GIS interchange suite.
- Do **not** store runtime preview caches as part of terrain interchange.

---

## Main goal
Create a terrain persistence/interchange workflow that already feels like a real creative tool:

- terrain saves and reloads correctly
- a user can export a height representation of a map
- a user can import a height representation into a terrain layer
- the editor makes the rules and limitations understandable
- internal chunk-aware terrain stays clean and future-ready

This should feel grounded and useful.

---

## What to build

### 1) Terrain persistence hardening
Deepen and verify terrain persistence inside the project save/load system.

Requirements:
- terrain chunk data on all supported map scopes saves correctly
- terrain chunk data reloads correctly
- seeded child terrain persists correctly as independent child terrain
- terrain metadata such as sea level, chunk resolution, and terrain mode settings persist coherently
- load reconstruction restores terrain editing usability, not just raw data blobs

This is the foundation before interchange.

---

### 2) Clear distinction: internal storage vs interchange
Define and enforce a clean distinction between:
- **internal terrain storage**
- **external terrain interchange**

A good baseline:
- internal storage remains chunk-aware and editor-friendly
- external interchange formats may be simpler, flatter, or format-constrained
- conversion between them is explicit and deliberate

Requirements:
- the code architecture reflects this distinction
- the UI does not blur “save project” with “export heightmap”
- limitations are surfaced clearly where appropriate

This separation matters a lot for long-term sanity.

---

### 3) Heightmap export foundation
Implement a practical **heightmap export** workflow.

At minimum support exporting terrain from the active map into a height-oriented file representation.

Good baseline export targets include:
- grayscale image-based heightmap
- structured numeric height data export
- or both

Requirements:
- the active map’s terrain is the export source
- exported data reflects authored height values coherently
- exported terrain excludes runtime/editor-only overlays
- export respects active map scope
- export path/file naming is coherent

This is one of the most immediately useful terrain outputs.

---

### 4) Grayscale heightmap export
Implement a practical grayscale image heightmap export.

Requirements:
- active terrain data can be converted into a grayscale representation
- height values map consistently to pixel values
- sea level / min-max semantics are handled in a clear and documented way
- export resolution is coherent and user-controlled enough to be useful
- world/region/local map export all work against the active scope

A good baseline:
- low values are darker, high values are lighter
- mapping behavior is explicit
- output is useful to external tools even if not perfect

Be honest about whether this is:
- normalized relative export
- or based on explicit terrain min/max semantics

Do not leave the user guessing.

---

### 5) Structured terrain data export
Implement a structured terrain data export path.

A good baseline could include exporting:
- map metadata
- terrain metadata
- chunk or tile summaries
- or flattened sampled height grid data in JSON or another practical structured format

Requirements:
- output is useful to a developer or external pipeline
- internal editor/runtime-only state is excluded
- the format is understandable
- the terrain meaning is preserved more richly than with grayscale alone

This is especially helpful for downstream custom tools and future pipelines.

---

### 6) Heightmap import foundation
Implement a practical **heightmap import** workflow.

Requirements:
- user can import external terrain/height-oriented data into a terrain-capable layer
- import targets the active map or an explicitly chosen map/terrain layer
- wrong-target situations are handled clearly
- imported terrain becomes real authored terrain data
- the import path does not bypass the chunk-aware terrain architecture

Good baseline:
- import into an existing terrain layer
- or create a new terrain layer during import if that is cleaner

This is one of the core “real tool” features of Phase 2.

---

### 7) Grayscale heightmap import
Implement practical import of grayscale image-based heightmaps.

Requirements:
- grayscale image values can be mapped into internal terrain height values
- the user can choose or understand how image values map to terrain value semantics
- import can populate terrain chunks coherently
- imported terrain aligns to the active map’s terrain space in a practical way
- import does not require the entire terrain architecture to become image-first

A good baseline:
- grayscale intensity → normalized terrain height
- user can choose or accept basic mapping settings
- imported data becomes chunk-based terrain samples internally

Be honest about limitations, especially if imported images do not match the active map aspect or intended terrain resolution perfectly.

---

### 8) Import mapping controls
Provide practical controls for how imports are mapped into terrain.

At minimum consider:
- source value range interpretation
- target height range mapping
- import resolution fit / resample behavior
- overwrite existing terrain vs import into new layer
- sea-level reference handling if relevant
- whether import targets whole map extents or selected terrain extent if you support that now

You do **not** need a huge geospatial import wizard.  
A small set of understandable controls is enough.

The important thing is that the import behavior feels deliberate.

---

### 9) Resampling and scaling behavior
Define and implement practical resampling behavior when external terrain data does not match internal terrain resolution.

Requirements:
- imported heightmap data can be resampled into the map’s terrain chunk/sample structure
- export can sample internal terrain into output resolution coherently
- the system handles mismatch in dimensions or resolution sensibly
- behavior is documented and understandable

A good baseline:
- nearest-neighbor or bilinear-like resampling is acceptable
- keep it practical and predictable
- do not pretend scientific precision if it is not there yet

This matters for both import and export fidelity.

---

### 10) Import overwrite / merge rules
Define clear rules for what happens when importing terrain into a map that already has terrain data.

Good options:
- import into a new terrain layer
- overwrite an existing terrain layer with confirmation
- or offer a replace-vs-new-layer choice

My recommendation:
- default toward safety
- either create a new terrain layer
- or ask clearly before destructive overwrite

Requirements:
- user intent is explicit
- import does not silently destroy work
- destructive actions are confirmable and history-aware where practical

This is very important for trust.

---

### 11) Map-scope-aware terrain import/export
Import and export must respect active map scope.

Requirements:
- world map terrain import/export uses world scope
- region map terrain import/export uses region scope
- local map terrain import/export uses local scope
- no confusion about parent/child terrain source during export
- import applies to the active map or explicitly chosen map target, not some hidden other scope

This keeps the terrain workflow coherent across the nested-map system.

---

### 12) Multi-scale metadata handling
Terrain interchange should include or respect map-scope metadata where useful.

Examples:
- map id / map name
- scope kind
- terrain resolution info
- sea level
- chunk size or sample density summary
- source extents for child maps if useful in structured export

This does not need to be stuffed into every grayscale export, but structured export should carry meaningful context where it helps.

---

### 13) Persistence compatibility with child terrain lineage
Ensure terrain persistence and interchange do not break multi-scale terrain lineage understanding.

Requirements:
- child terrain remains its own authored terrain after import/export interactions unless explicitly replaced
- terrain lineage metadata remains intact after normal save/load
- import/export UI should not imply hidden live sync with parent terrain
- terrain reseeding/replacement behaviors remain explicit if they exist

This prompt must not introduce confusion into the world/region/local terrain model.

---

### 14) UI for terrain import/export
Add practical UI for terrain import/export actions.

Good entry points:
- top bar / file menu
- terrain layer inspector actions
- terrain panel actions
- map-level import/export section

At minimum support actions such as:
- Import Heightmap
- Export Heightmap
- Export Terrain Data

Requirements:
- it is clear what map/layer is the target/source
- it is clear what format is being used
- destructive actions are explained when relevant
- the workflow feels like a real desktop tool, not a hidden dev feature

Do not bury this in obscure controls.

---

### 15) Inspector / panel integration
Upgrade the inspector or relevant terrain panel to acknowledge terrain interchange context.

At minimum consider:
- active terrain layer
- terrain export source summary
- import target summary
- existing terrain resolution/metadata
- overwrite/create-new-layer choice context
- last import/export info if useful

The goal is to help the user understand what they are about to move in or out of the app.

---

### 16) Status and feedback messaging
The status bar and/or feedback system should communicate terrain interchange actions clearly.

Examples:
- imported into terrain layer X
- exported heightmap for active map Y
- overwrite blocked pending confirmation
- import failed due to incompatible format
- exported structured terrain data successfully

This improves trust a lot.

---

### 17) History integration
Terrain import should integrate with history in a sensible way where practical.

Requirements:
- importing terrain into a layer should create a meaningful history entry
- creating a new terrain layer during import should be undoable if possible
- runtime-only export actions should not pollute history
- destructive overwrite imports should be history-aware if feasible

Be practical and honest in `STATUS.md` about any limits here.

---

### 18) Error handling and validation
Add practical validation/error handling around terrain interchange.

Good examples:
- invalid or unreadable image file
- unsupported structured terrain file
- terrain data dimension mismatch
- impossible target mapping settings
- no compatible target layer
- canceled overwrite
- corrupted terrain chunk input

Requirements:
- errors are understandable
- partial failure does not silently corrupt authored terrain
- invalid operations are blocked cleanly

This is important for trust.

---

### 19) Performance guidance
This prompt must remain scale-aware.

Aim for:
- import paths that populate terrain chunks progressively/coherently
- export paths that sample terrain without rewriting the whole project architecture
- no unnecessary duplication of giant terrain arrays if chunk-streamed handling is practical
- keeping runtime/editor-only preview caches out of persistence and interchange files

Avoid:
- flattening internal storage just because export is flatter
- loading huge unrelated terrain data when only active map terrain is needed
- tying import/export logic tightly to UI rerenders
- hidden full-project terrain rewrites for active-map actions

Be practical and honest about current limits.

---

### 20) UX guidance
The terrain import/export workflow should feel safe, understandable, and useful.

Aim for:
- clear source/target identification
- obvious import vs export distinction
- explicit destructive-action confirmation
- useful baseline settings
- predictable grayscale mapping
- structured export that feels deliberate and inspectable

Avoid:
- mystery height scaling
- silent overwrites
- import actions that go to the wrong map/layer
- formats named in the UI but not actually supported
- pretending image heightmaps preserve every nuance of internal terrain structure

This is where the terrain system becomes portable.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/terrain/io/...`
- `src/lib/terrain/io/...`
- `src/lib/terrain/import/...`
- `src/lib/terrain/export/...`
- `src/store/editorActions/terrainIo...`
- `src/components/panels/...`
- `src-tauri/src/...` for desktop file operations where appropriate

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- terrain saves and reloads correctly as part of project persistence
- the app can export a practical heightmap representation of active-map terrain
- the app can export structured terrain data in a useful form
- the app can import grayscale heightmap data into terrain layers in a practical way
- import/export behavior respects active map scope
- the distinction between internal chunk-aware storage and external interchange is clear
- destructive import behavior is handled safely
- UI/feedback for terrain import/export is coherent
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- export resolution presets
- new-layer vs overwrite import toggle
- structured terrain legend/metadata preview
- recent import/export path hint
- quick “import into new terrain layer” convenience action
- basic terrain export summary dialog

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- hardened terrain persistence behavior
- practical grayscale heightmap import/export
- structured terrain data export
- safe and understandable terrain interchange workflows
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should no longer treat terrain as something trapped inside the editor.

A user should be able to save real terrain, export useful height representations, import external height data into terrain layers, and move terrain information in and out of the app without breaking the project’s core architecture.

That is the bar.
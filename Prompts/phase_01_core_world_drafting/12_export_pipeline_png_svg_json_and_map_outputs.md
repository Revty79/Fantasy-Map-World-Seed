# 12 — Export Pipeline: PNG, SVG, JSON, and Map Outputs

## Objective
Implement the first real **export pipeline** for World Seed Mapper so the user can export useful map outputs from authored project data, including raster images, vector-friendly outputs where appropriate, and structured data exports that preserve meaning beyond the app itself.

This prompt is where the editor starts producing outward-facing artifacts instead of only saving internal project files.

---

## Why this prompt exists
Saving a project is not the same as exporting useful map outputs.

A serious mapmaking tool needs to let the user produce outputs such as:
- flat map images
- print/shareable renders
- vector-friendly outputs where appropriate
- structured data exports for future tooling
- scoped exports for world, region, and local maps

This prompt should establish a clean export foundation that already feels practical and future-ready.

Do this in a way that respects the product architecture, not as a pile of ad hoc screenshots.

---

## Required outcome
By the end of this prompt, the app should have:

- a real export workflow
- export actions available from the app UI
- export for the active map scope
- practical raster export support
- practical vector-friendly export support where feasible
- structured JSON export for map data
- export settings for common output needs
- clear handling of layer visibility and scope during export
- basic export path/file handling
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** confuse project save/load with export.
- Do **not** build a fake export button that just dumps random screenshots.
- Do **not** attempt full production-grade print publishing in one prompt.
- Do **not** overpromise true SVG export for layer types that are not meaningfully representable yet.
- Do **not** flatten structured map meaning unnecessarily if richer export is practical.
- Do **not** export runtime-only editor overlays, selection boxes, or debug visuals unless explicitly chosen for debug output.

---

## Main goal
Create an export system that already feels like a real creative tool:

- user chooses an export action
- picks a useful output type
- exports the current map or relevant scope
- gets a clean file they can use outside the app
- understands what is and is not included

This should feel intentional and trustworthy.

---

## What to build

### 1) Export workflow foundation
Implement a practical export workflow in the desktop app.

At minimum:
- export actions are available from the top bar/menu area
- export is connected to the active project and active map
- user can choose destination path/file where appropriate
- export success/failure is surfaced clearly
- export logic is organized separately from persistence logic

Good export entry points:
- Export PNG
- Export SVG
- Export JSON
- optional Export Current View vs Export Full Map if it fits naturally

Do not bury export logic inside random UI handlers.

---

### 2) Active map export awareness
Exports should operate meaningfully on the currently active map.

Requirements:
- world, region, and local maps can all be exported
- current active map drives the export source unless the user explicitly chooses another scope
- export metadata includes map identity/scope where appropriate
- UI makes it clear what map is being exported

The export pipeline should not assume world-only.

---

### 3) Raster export foundation (PNG)
Implement the first practical raster export.

At minimum support:
- export current active map to PNG
- output includes authored content for the active map
- layer visibility is respected
- layer ordering is respected
- selection/debug/runtime overlays are excluded by default
- output size is sensible and configurable at a baseline

Good baseline export modes:
- full active map bounds
- optional current viewport export if easy and clearly distinct
- optional background on/off behavior if relevant

This is likely the most immediately useful export type, so make it solid.

---

### 4) Full-map vs current-view raster export
If it fits naturally, support a distinction between:
- **Export Full Map**
- **Export Current View**

A good baseline:
- Full Map exports the authored map extents
- Current View exports what the user is currently framed on

This is optional, but very useful.

If both are included:
- make the distinction very clear
- keep runtime overlays/debug guides off unless explicitly asked for
- do not confuse “current view” with “whatever random debug stuff is on screen”

---

### 5) Export sizing and resolution controls
Provide practical export sizing controls for raster output.

At minimum consider:
- width/height or scale multiplier
- export resolution preset
- optional transparent background if meaningful
- default to sensible, usable values

You do **not** need a huge print wizard.  
But the user should have more control than “one mystery size only.”

A good baseline is enough if it is clear and stable.

---

### 6) Layer inclusion rules
Define and implement clear export inclusion rules.

Good baseline rules:
- visible layers export
- hidden layers do not export
- locked layers still export if visible
- debug overlays, guides, chunk overlays, selection highlights, handles, and editor-only UI do **not** export by default
- future optional debug export can be deferred

Document these rules clearly in code/comments/status if useful.

This is important for user trust.

---

### 7) Raster export implementation quality
The raster export should be based on real authored content/state, not a sloppy UI screenshot approach.

Requirements:
- export path should render from map/layer data or renderer stage in a controlled way
- output should be reproducible and not contaminated by editor chrome
- world/document-space bounds should drive full-map export
- active-map content should render consistently with layer order and visibility

Be practical:
- using the render engine/stage in a controlled export path is acceptable
- using dedicated offscreen rendering is welcome if it fits naturally
- a simple but correct export path is better than an elaborate unreliable one

---

### 8) SVG export foundation
Implement a practical first **SVG export** where appropriate.

Be honest and scoped.

A good baseline:
- export vector-representable content meaningfully
- focus first on content that maps well to SVG, such as:
  - vector geometry
  - labels if feasible
  - symbol instances if represented as vector/SVG-compatible assets or simple references
- clearly define what does **not** export to SVG yet if paint/mask layers are not naturally representable in current architecture

You do **not** need perfect parity with every layer type.  
But do make SVG export real for the content it can support sensibly.

Honesty matters more than pretending full fidelity exists where it does not.

---

### 9) SVG scope and fidelity rules
Define clear rules for what SVG export includes.

A strong baseline might be:
- include vector layers
- include labels in a practical baseline form if feasible
- include symbol placements if cleanly representable
- exclude or flatten unsupported paint/mask/data layers, or clearly omit them with documented behavior
- preserve map document coordinates in a consistent export-space transform

Whatever rule you choose:
- keep it understandable
- make it consistent
- surface limitations honestly in `STATUS.md`

Do not create mysterious half-working SVGs with no explanation.

---

### 10) Structured JSON export
Implement a useful **JSON export** path.

This is not the same as the internal project persistence format.

A good JSON export should be outward-facing and structured for reuse.

At minimum, it should be able to export:
- map metadata
- map scope
- dimensions/bounds
- layer summaries
- authored vector features
- symbols
- labels
- relationship metadata for nested maps if relevant
- paint/data layer summaries or structured references if full raw paint export is too heavy

A good use case:
- future data interchange
- analysis tooling
- custom downstream transforms
- external generators or game tools later

This export should be deliberate and useful.

---

### 11) JSON export design guidance
The JSON export should not simply dump the entire raw in-memory editor store.

Requirements:
- exclude editor/runtime-only state
- exclude ephemeral UI state
- include meaningful authored document content
- include versioning/export metadata
- be understandable to a developer reading it
- be stable enough to serve as a future interchange format

You may choose:
- compact JSON
- readable pretty-printed JSON
- export metadata wrapper
as long as it is coherent and useful.

---

### 12) Export naming conventions
Implement sensible default export filenames.

Examples:
- `my-world-world.png`
- `northern-continent-region.svg`
- `frostmere-valley-local.json`

Good default naming should consider:
- project name
- map name
- scope
- export type

This is small, but it improves polish a lot.

---

### 13) Export settings UI
Create a practical export UI.

This can be:
- a compact modal
- a sheet/popover
- a small export panel
- or lightweight separate commands with minimal prompts

At minimum, the user should be able to understand:
- what map is being exported
- what format is being exported
- what major options apply
- where the file will go

Do not build a giant intimidating export wizard unless it genuinely helps.

A small clean export flow is better.

---

### 14) Nested-map export awareness
Exports should behave coherently with the nested map system.

Requirements:
- exporting a region map exports the region map, not the whole world
- exporting a local map exports the local map
- JSON export can include parent relationship metadata when useful
- exported filenames and metadata can reflect map scope
- future multi-map/batch export can be deferred, but structure should not block it

Do not let nested maps turn export behavior into confusion.

---

### 15) Asset and symbol export handling
Consider how symbols/assets behave during export.

Requirements:
- visible symbol placements appear in raster export
- SVG export includes symbol content only if representable in a meaningful way
- JSON export includes symbol references/metadata clearly
- export path should not break simply because symbols exist

Be honest about current limitations if some asset forms are not yet fully portable.

---

### 16) Label/text export handling
Consider how labels behave during export.

Requirements:
- labels appear in raster export
- labels export in SVG if practical in baseline form
- labels are included structurally in JSON export
- label transforms/basic styling are handled coherently where supported

Again, practicality and honesty are more important than pretending perfect typography fidelity exists.

---

### 17) Paint/mask/data layer export handling
Consider how paint/mask/data layers behave during export.

Requirements:
- raster export should include visible paint/mask/data layers
- SVG export should either omit, flatten, or clearly not support them for now
- JSON export should include meaningful references or summaries
- export rules should not be mysterious

This is a key place to be explicit about current Phase 1 limits.

---

### 18) Background / transparency behavior
Decide and implement baseline background behavior.

Good options:
- export with map background included by default
- optional transparent background for PNG if meaningful
- SVG background optional if relevant

Whatever you choose:
- keep it consistent
- make it understandable in export UI/settings

Do not leave the user guessing why output backgrounds differ.

---

### 19) Error handling and user feedback
Add practical error handling around export.

Good examples:
- user cancels export path selection
- unsupported export option combination
- file write failure
- export render failure
- unsupported content type for chosen format

Requirements:
- user feedback is understandable
- failed export does not corrupt project data
- limitations are surfaced cleanly where possible

This should feel trustworthy.

---

### 20) Export architecture guidance
Organize export logic cleanly.

Good separation might include modules such as:
- raster exporter
- SVG exporter
- JSON exporter
- export option types
- export filename helpers
- export UI flow/controller

Do not bury all export behavior in one giant component or in random button handlers.

Keep it extensible for future:
- PDF
- atlas packs
- tiles
- globe texture outputs
- batch export
- print presets

---

### 21) Performance guidance
Export should respect project scale without wrecking editor responsiveness.

Aim for:
- controlled export path per format
- no unnecessary mutation of live editor state
- clear distinction between export-time rendering and interactive viewport rendering
- ability to export full-map bounds without depending on current viewport being on screen
- room for future offscreen/segmented export if maps become very large

Avoid:
- editor-chrome screenshots as the main export path
- permanently altering live view/camera state just to export
- forcing huge avoidable memory spikes where a cleaner approach is available

Be practical and honest in `STATUS.md` about any current limits.

---

### 22) UX guidance
The export workflow should feel useful and grounded.

Aim for:
- obvious export entry points
- clear format choice
- practical option set
- stable file naming
- exported results that match user expectations
- no mystery about what is included

Avoid:
- fake exports
- hidden omissions with no explanation
- giant overbuilt export dialogs
- “SVG export” that is really just a PNG with a different extension
- random UI/debug overlays leaking into output

This is where the app starts creating shareable artifacts.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/export/...`
- `src/lib/export/...`
- `src/lib/export/raster/...`
- `src/lib/export/svg/...`
- `src/lib/export/json/...`
- `src/store/editorActions/export...`
- `src-tauri/src/...` for desktop file output where appropriate

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- the app has real export actions in the UI
- the active map can be exported to PNG
- layer ordering/visibility are respected in raster export
- editor/debug overlays are excluded by default
- SVG export exists in a practical truthful form for supported content
- JSON export exists as a useful outward-facing structured format
- export settings/path handling are coherent
- nested map scope is respected during export
- user feedback/error handling are practical
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- current-view export
- transparent PNG option
- simple export preset list
- “open export folder” convenience action
- export success toast
- small export summary preview

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- real export workflow
- PNG export
- practical SVG export
- useful JSON export
- export settings/path handling
- nested-map-aware export behavior
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should feel like it can produce real outputs from authored maps instead of only storing internal project state.

The user should be able to export a world, region, or local map into useful files they can share, inspect, or build on.

That is the bar.
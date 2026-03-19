# Phase 3 — Regions, Boundaries, and Overlays

## Objective
Build the regions, boundaries, and overlay authoring system for **World Seed Mapper** so users can define meaningful world-space areas on top of terrain, hydrology, biome, and surface data.

This prompt should establish real editing workflows for:
- region creation and management
- boundary drawing/editing
- overlay visualization
- region fill and assignment workflows
- region metadata foundations
- visibility, selection, and styling controls
- future compatibility with labels, symbols, globe wrapping, and export

This system should feel like the beginning of province/kingdom/biome-zone/territory authoring, not just a debug mask.

---

## Context
Earlier phases already established:
- flattened-globe-safe map canvas assumptions
- procedural terrain generation
- elevation/heightmap editing
- Phase 3 authoring workspace foundation
- shared authoring/tool/layer state
- reusable brush engine and paint-layer foundations
- hydrology authoring tools
- biome and surface painting

This prompt should build on those systems rather than bypass them.

Regions and overlays should:
- operate in map/world space
- remain editable and persistence-friendly
- coexist with terrain, hydrology, biome paint, and future labels/symbols
- provide a foundation for both visual map overlays and structured worldbuilding data

---

## Required outcome
When complete, the app should support a real workflow where the user can:
1. create named or unnamed regions on the map
2. define or edit region boundaries
3. visualize regions as overlays
4. select, inspect, rename, recolor, and delete regions
5. toggle overlay visibility and styling behavior
6. keep all region/boundary data aligned to the flattened world canvas for later globe conversion

At least one full **region creation/edit workflow** and one full **boundary/overlay visualization workflow** should be functional by the end of this prompt.

---

## Core implementation tasks

### 1) Define region and overlay data models
Implement shared typed data structures for region and boundary authoring.

At minimum support:
- region id
- region name
- region type/category hooks
- region geometry representation
- region style metadata
- region fill/display color or style hooks
- region visibility/editability hooks
- region selection/hover hooks
- boundary id or boundary data embedded in the region model
- boundary geometry
- overlay ordering/priority hooks if useful
- metadata fields useful for future export/worldbuilding integration

The model should support future use cases such as:
- nations/kingdoms
- provinces/counties
- climate zones
- cultural areas
- map-note overlays
- custom user-defined region sets

Do not hardcode it only for political borders.

---

### 2) Choose and implement a region geometry approach
Implement a geometry representation that fits the app architecture and remains editable.

Acceptable approaches include:
- polygon-based regions
- point-defined closed paths
- raster/chunk mask-backed regions
- hybrid region mask + editable outline model
- another structurally sound world-space approach

Requirements:
- geometry must represent real authored map-space/world-space data
- it must be editable later
- it must be persistence-friendly
- it must remain compatible with later globe wrapping

Choose what best fits the existing editor architecture, but do not use a fake screen-space-only overlay as the persisted source of truth.

---

### 3) Implement region creation workflow
Create a real end-to-end workflow for making a new region.

Possible workflows include:
- click-to-place polygon points, then close the region
- draw boundary path and convert to region
- paint/fill region mask into a new named region
- selection-to-region conversion
- another clean editor workflow

Requirements:
- user can create a region intentionally
- region data is stored in a real authored structure
- the region becomes visible as an overlay
- the region can be selected afterward
- the workflow feels like a true editor feature, not a temporary test tool

If multiple creation workflows are practical, that is welcome, but at least one should be complete and usable.

---

### 4) Implement boundary drawing/editing
Users must be able to define and modify region boundaries.

At minimum support:
- drawing an initial region boundary
- selecting a region boundary or region
- editing region shape in some real way
- deleting a region
- canceling an in-progress region
- clearly distinguishing between creation mode and edit mode

Editing may be point-based, handle-based, mask-based, or another clean representation depending on the chosen geometry model.

If full shape editing is too large for this prompt, implement a minimal but real editing model that can be extended cleanly.

---

### 5) Implement overlay rendering
Add clear rendering for regions and overlays on top of the map.

At minimum support:
- visible region fill
- visible region outline/border
- hover/selection feedback
- reasonable readability over terrain, hydrology, and biome/surface layers
- pan/zoom compatibility
- visibility toggles

Rendering does not need to be final atlas polish yet, but it must be clean and structurally correct.

The user should immediately understand where each region exists on the map.

---

### 6) Add region style controls
Integrate usable style controls into the authoring UI.

At minimum support:
- region name editing
- fill color/style selection or equivalent
- border visibility and/or border style controls
- opacity/transparency controls if appropriate
- active region display in the side panel
- visibility toggle(s)

The UI should make region editing feel real and approachable.

---

### 7) Add region categories and metadata hooks
Support at least lightweight categorization and metadata structure.

Examples:
- political
- cultural
- geographic
- biome-zone
- custom

At minimum provide hooks for:
- category/type
- notes/description placeholder
- custom color/style
- future export id or slug
- future symbol/label linkage

You do not need to build a full metadata editor, but the structure should exist now.

---

### 8) Add overlay/layer management integration
Regions must participate in the shared layer and overlay system.

Requirements:
- regions appear in the layer/overlay UI
- visibility toggles work
- active editing target is clear
- overlays can coexist with hydrology, biome/surface paint, and future labels/symbols
- future multiple region sets or overlay groups should remain possible

Do not bury region handling in a one-off local component that bypasses the Phase 3 workspace architecture.

---

### 9) Support selection and inspection
Region features should behave like first-class editable objects.

At minimum support:
- selecting a region
- hover feedback
- active region highlight
- basic property display
- delete action
- rename action
- indication of region type/category if available

This will matter later when labels, symbols, and export features interact with regions.

---

### 10) Add fill/assignment support where practical
If the architecture allows, add one practical fill/assignment workflow for region authoring.

Examples:
- assign selected polygon as region
- fill selected mask area into a region
- convert painted mask area into region data
- flood-fill style region seed tool if appropriate

Important:
- do not block completion on a complex segmentation system
- one clean and extensible assignment/fill workflow is enough
- if deferred, leave hooks so later prompts can add stronger tools

This prompt should still result in a genuinely usable region workflow.

---

### 11) Preserve compatibility with prior map systems
Regions and overlays must coexist cleanly with:
- navigation/pan/zoom
- elevation tools
- hydrology
- biome/surface paint
- shared brush/selection foundations
- future symbols and labels

Do not break earlier functionality.

Interaction routing must remain mode-aware and stable.

---

### 12) Preserve persistence compatibility
Region and boundary data must remain save/load/export friendly.

Requirements:
- authored region data is stored in real map/world-space aligned structures
- no dependence on temporary DOM/CSS-only visuals
- the structure supports future save/load logic
- export and downstream systems can consume the data later without architectural rework

If persistence foundations already exist in the repo, extend them appropriately.

---

### 13) Preserve flattened globe compatibility
All region and boundary authoring must remain compatible with later globe wrapping.

Important:
- store region data in flattened global map/world coordinates
- avoid screen-space-only persistence
- consider seam-safe representation where practical
- do not assume regions only exist comfortably away from map edges
- later globe conversion must be able to interpret these overlays as world-surface data

Even if seam editing UX is not finished yet, the data model should not make it impossible later.

---

### 14) Preserve undo/redo compatibility
If undo/redo already exists, integrate region actions at sensible boundaries such as:
- completed region creation
- confirmed boundary edit
- rename/style change
- delete action

If undo/redo is not fully implemented yet:
- structure region commits so they can become clean undoable actions later
- keep transient/in-progress edit state separate from committed region data
- avoid mutation patterns that will make history painful later

---

### 15) Keep performance reasonable
The region and overlay system should remain usable on large world maps.

Take sensible measures such as:
- localized redraw where possible
- reasonable geometry handling
- efficient hit-testing or selection logic
- not rerendering unrelated systems unnecessarily

Do not overengineer, but do not knowingly create a fragile bottleneck.

---

## UX expectations
By the end of this prompt, the user should be able to:
- switch into a region/overlay workflow
- create a new region
- see its fill and boundary
- select it again later
- rename and recolor it
- toggle visibility
- understand that regions are now real authored worldbuilding layers in the editor

The tool should feel like the start of serious territory and zone creation.

---

## Implementation guidance
Prefer:
- typed region/boundary models
- reuse of shared Phase 3 authoring state and panels
- world-space geometry or mask-backed authored data
- clean separation between region data, rendering, and editing interactions
- code structured so future labels/symbols/export can attach to regions cleanly

Avoid:
- purely decorative non-editable overlays
- storing persisted region data only as temporary screen visuals
- hardcoding only political borders
- one giant monolithic region editor component
- breaking existing tool routing or navigation behavior

---

## Deliverables
Implement:
- region/boundary data models
- real region creation workflow
- real boundary editing workflow in at least a minimal but usable form
- overlay rendering for regions
- region selection/rename/delete/style controls
- layer/overlay system integration
- any necessary state/store/type updates
- persistence hooks as appropriate

Also update light internal comments/docs if helpful for future prompt continuity.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. The user can create at least one real region on the map.
2. Regions are stored as real authored map/world-space data.
3. Region overlays render visibly with fill and/or boundary.
4. The user can select an existing region again later.
5. The user can rename, restyle, or delete a region in a real workflow.
6. Regions participate in the shared layer/visibility system.
7. Existing terrain, hydrology, biome/surface paint, navigation, and editor systems are not broken.
8. The implementation remains compatible with flattened-globe-safe data assumptions.
9. The code leaves a clean path for later labels, symbols, and export features.

---

## What not to do
Do not:
- build a full geopolitical simulation here
- build final label placement here
- build final symbol/settlement systems here
- build final globe export here
- rewrite the renderer unless truly necessary

This prompt is about real region/boundary/overlay authoring, not every downstream worldbuilding system.

---

## Final instruction
Implement the regions, boundaries, and overlays system cleanly and completely, with at least one real region creation/edit workflow and one real overlay visualization workflow working end-to-end in the editor.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
# Phase 3 — Labeling and Text Tools

## Objective
Build the labeling and text authoring system for **World Seed Mapper** so users can place, edit, and manage map text directly on top of terrain, hydrology, biomes, regions, and landmarks.

This prompt should establish real editing workflows for:
- free text label placement
- named feature labels
- region labels
- landmark-linked labels
- text selection/editing/removal
- label styling and visibility
- future compatibility with export, globe wrapping, and downstream worldbuilding systems

This system should feel like the beginning of real cartographic text authoring, not just temporary debug annotations.

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
- regions, boundaries, and overlays
- symbols, stamps, and landmarks

This prompt should build on those systems rather than bypass them.

Labels and text should:
- operate in map/world space
- remain editable and persistence-friendly
- coexist cleanly with terrain, water, paint, overlays, and symbols
- support both decorative cartographic labels and meaningful named world features

---

## Required outcome
When complete, the app should support a real workflow where the user can:
1. enter a label/text mode
2. place text at a real world-space location
3. edit label content after placement
4. style labels in a usable way
5. select, move, duplicate, and delete labels
6. toggle label visibility through the layer system
7. optionally link labels to landmarks or regions where practical
8. keep all label data aligned to the flattened world canvas for later globe conversion

At least one full **free label placement/edit workflow** and one full **feature-linked label workflow** should be functional by the end of this prompt.

---

## Core implementation tasks

### 1) Define label and text data models
Implement shared typed data structures for map labels/text.

At minimum support:
- label id
- label text/content
- label type/category
- world/map anchor position
- optional linked entity id/type
- font/style hooks
- size/scale
- rotation/orientation hooks if needed
- alignment/anchor settings
- curvature/path-text hooks for future extensibility if useful
- visibility/editability/locked hooks
- hover/selection hooks
- z-order/render priority hooks if useful
- metadata fields for future export/worldbuilding integration

Support categories such as:
- region label
- landmark label
- hydrology label
- settlement label
- mountain range label
- free text note
- custom label

Do not hardcode the system only for one narrow label type.

---

### 2) Create a label style foundation
Implement a clean label style system.

At minimum support:
- stable style ids or structured style presets
- font family hooks or safe fallback handling
- size
- weight/style hooks
- fill color
- outline/stroke or halo support
- opacity
- letter spacing hooks if useful
- alignment behavior
- future extensibility for curved/path text or thematic presets

You do not need a giant final typography system yet, but there must be a real usable starter styling foundation.

Use structurally sound defaults even if the first pass uses a limited set of available fonts/styles.

---

### 3) Implement free label placement workflow
Create a real end-to-end workflow for placing free text labels.

Requirements:
- user can enter label mode
- user can choose a basic free-label tool
- clicking on the map creates a real label anchor in world space
- user can enter/edit text content
- the label renders clearly on the map
- the label can be selected again later
- the label persists as real authored data

The flow may use:
- side panel text entry
- inline edit popover
- inspector-based text editing
- another clean editor-grade approach

At least one straightforward free-placement flow must be complete and usable.

---

### 4) Implement feature-linked label workflow
Add a workflow for labels that can attach to existing authored features when practical.

At minimum support one or more of:
- landmark-linked labels
- region-linked labels
- hydrology feature labels
- symbol-linked labels

Requirements:
- user can create a label associated with an existing feature
- the label stores real linkage metadata where appropriate
- the user can inspect and edit the linked label later
- the label remains understandable as a real cartographic/worldbuilding object

This does not need a perfect auto-placement system yet, but it must be a real linked-label workflow.

---

### 5) Add label editing and inspection
Users must be able to interact with placed labels after creation.

At minimum support:
- hover feedback
- selection
- content editing
- repositioning/moving
- deletion
- duplication if practical
- editing basic properties such as style, size, alignment, and type
- clear distinction between placement mode and edit mode

If direct inline editing is awkward in the current architecture, a side-panel inspector is acceptable as long as it is real and usable.

---

### 6) Add transform and anchor controls
Implement practical controls for label layout.

At minimum support:
- size/scale adjustment
- alignment or anchor selection
- stable map/world-space anchoring
- optional rotation if it fits the architecture well
- transform persistence in the underlying label data

These controls may live in:
- the side panel
- an inspector
- a toolbar
- a hybrid approach

The important part is that label positioning and styling are real, editable, and persisted.

---

### 7) Implement label rendering
Add clear rendering for labels/text on top of the map.

Requirements:
- labels are visible and readable over terrain and overlays
- selection/hover state is obvious
- rendering respects pan/zoom
- labels remain anchored correctly in map/world space
- visibility toggles work
- label order is coherent with other overlays
- the map remains legible rather than becoming visually chaotic

At minimum, support a strong readability strategy such as:
- outline/halo
- stroke
- subtle background treatment
- another structurally clean approach

Rendering does not need final atlas polish yet, but it must be stable and editor-ready.

---

### 8) Add label collision/readability hooks where practical
Implement at least lightweight groundwork for readability management.

Possible behaviors:
- simple overlap warning
- selection-aware label priority
- optional hide/ghost non-selected labels in edit mode
- placeholder collision metadata hooks
- basic offset/anchor adjustments to reduce overlaps

Important:
- do not block completion on a complex full auto-label engine
- a modest, cleanly structured readability foundation is enough
- if full collision handling is deferred, code should leave a clear path for it later

A good minimal implementation is better than an unfinished advanced one.

---

### 9) Integrate label tools into the authoring UI
Add usable controls to the Phase 3 side panel and/or toolbar.

Useful controls include:
- active label tool
- label category/type
- text content
- linked feature display
- size/style controls
- alignment/anchor controls
- outline/halo toggle or intensity control if used
- duplicate/delete actions
- visibility toggle
- layer target if appropriate

The UI should make text placement and editing feel organized and approachable.

---

### 10) Integrate with the shared layer system
Labels and text must participate in the Phase 3 layer/overlay architecture.

Requirements:
- labels/text appear as a distinct layer or layer family
- visibility toggles work
- active editing target is clear
- the system can support many labels
- later grouping/sub-layer behavior remains possible

Do not implement labels as one-off floating UI state disconnected from the shared editor architecture.

---

### 11) Add metadata hooks for future systems
Labels should expose structure for later expansion.

At minimum provide hooks for:
- linked region id
- linked landmark/symbol id
- linked hydrology feature id if useful
- export slug/id
- notes/description placeholder
- category/type
- future localization or alias hooks if useful
- future gameplay/system tags

You do not need to build the whole downstream ecosystem now, but the structure should exist.

---

### 12) Preserve compatibility with prior map systems
Labels and text must coexist cleanly with:
- navigation/pan/zoom
- elevation tools
- hydrology
- biome/surface paint
- regions/overlays
- symbols/stamps/landmarks
- future export/globe systems

Do not break earlier functionality.

Interaction routing must remain mode-aware and stable.

---

### 13) Preserve persistence compatibility
Label and text data must remain save/load/export friendly.

Requirements:
- authored labels are stored in real map/world-space aligned structures
- no dependence on temporary DOM/CSS-only visuals as the source of truth
- future save/load logic can consume the data
- export/downstream systems can consume the data later without architectural rework

If persistence foundations already exist in the repo, extend them appropriately.

---

### 14) Preserve flattened globe compatibility
All label/text authoring must remain compatible with later globe wrapping.

Important:
- store anchors in flattened global map/world coordinates
- avoid screen-space-only persistence
- ensure anchor logic remains interpretable as world-surface positions
- consider seam-safe placement behavior where practical, even if seam UX is not fully polished yet

Later globe conversion must be able to interpret these labels as real world-surface annotations.

---

### 15) Preserve undo/redo compatibility
If undo/redo already exists, integrate label actions at sensible boundaries such as:
- completed placement
- content edit commit
- move/transform change
- style/property edits
- duplication
- delete action

If undo/redo is not fully implemented yet:
- structure label commits so they can become clean undoable actions later
- keep preview/in-progress placement separate from committed label data
- avoid mutation patterns that will make action history painful later

---

### 16) Keep performance reasonable
The label/text system should remain usable on large world maps.

Take sensible measures such as:
- efficient text render/update paths
- reasonable hit-testing or selection logic
- not rerendering unrelated systems unnecessarily
- scalable handling for many labels

Do not overengineer, but do not knowingly create a fragile bottleneck.

---

## UX expectations
By the end of this prompt, the user should be able to:
- enter label mode
- place a free text label
- edit the label text
- move or delete it later
- style it in a basic but real way
- create at least one label tied to a landmark or other feature
- understand that map text is now a real authored cartographic layer in the editor

The workflow should feel like the start of serious atlas-style annotation and naming.

---

## Implementation guidance
Prefer:
- typed label/style/object models
- reuse of shared authoring state and side-panel systems
- world-space anchored label data
- clean separation between style presets, placed-label data, rendering, and editing interactions
- a readability strategy that keeps the map usable

Avoid:
- purely decorative non-editable text overlays
- storing persisted labels only as temporary screen visuals
- hardcoding only one label category such as settlements
- monolithic one-off text placement code disconnected from the shared editor architecture
- breaking navigation or existing tool routing behavior

---

## Deliverables
Implement:
- label/text data models
- label style foundation
- real free label placement workflow
- real feature-linked label workflow
- selection/edit/move/delete support
- transform and style controls in at least a basic but usable form
- rendering for labels
- side-panel/toolbar integration
- any necessary state/store/type updates
- persistence hooks as appropriate

Also update light internal comments/docs if helpful for future prompt continuity.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. The user can place at least one real free text label on the map.
2. Placed labels are stored as real authored map/world-space data.
3. The user can select and edit an existing label again later.
4. The user can move, restyle, duplicate or delete a label in a real workflow.
5. At least one label can carry linkage to another feature such as a landmark or region.
6. Labels render clearly and participate in the shared layer/visibility system.
7. Existing terrain, hydrology, biome/surface paint, regions, symbols, navigation, and editor systems are not broken.
8. The implementation remains compatible with flattened-globe-safe data assumptions.
9. The code leaves a clean path for later export and globe-stage polish features.

---

## What not to do
Do not:
- build the final export/globe system here
- build a full advanced automatic atlas labeling engine here
- rewrite the renderer unless truly necessary

This prompt is about real label and text authoring, not every downstream publishing feature.

---

## Final instruction
Implement the labeling and text tools cleanly and completely, with at least one real free-label workflow and one real feature-linked label workflow working end-to-end in the editor.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
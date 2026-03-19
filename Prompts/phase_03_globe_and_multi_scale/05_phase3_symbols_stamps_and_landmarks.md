# Phase 3 — Symbols, Stamps, and Landmarks

## Objective
Build the symbols, stamps, and landmark authoring system for **World Seed Mapper** so users can place meaningful map objects and visual markers on top of terrain, hydrology, biome/surface paint, and regions.

This prompt should establish real editing workflows for:
- map symbol placement
- reusable stamp placement
- landmark object creation
- symbol selection/editing/removal
- symbol layering and visibility
- metadata foundations for placed world features
- future compatibility with labels, export, globe wrapping, and downstream worldbuilding systems

This system should feel like the beginning of real cartographic object authoring, not just decorative stickers.

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

This prompt should build on those systems rather than bypass them.

Symbols and landmarks should:
- operate in map/world space
- remain editable and persistence-friendly
- coexist with terrain, hydrology, biome paint, regions, and future labels
- support both cartographic symbols and meaningful worldbuilding feature objects

---

## Required outcome
When complete, the app should support a real workflow where the user can:
1. choose a symbol/stamp/landmark tool
2. select a symbol type or stamp preset
3. place symbols on the map in real authored world-space positions
4. select and edit placed symbols
5. move, rotate, resize, duplicate, and delete symbols in a usable workflow
6. toggle symbol visibility through the layer system
7. keep all symbol/landmark data aligned to the flattened world canvas for later globe conversion

At least one full **symbol placement/edit workflow** and one full **landmark metadata workflow** should be functional by the end of this prompt.

---

## Core implementation tasks

### 1) Define symbol, stamp, and landmark data models
Implement shared typed data structures for placed map objects.

At minimum support:
- object id
- object type/category
- preset/symbol key
- world/map position
- scale/size
- rotation
- anchor behavior if needed
- style/render hooks
- visibility/editability/locked hooks
- hover/selection hooks
- z-order or render priority hooks if useful
- metadata fields for future export/worldbuilding integration

Support categories such as:
- settlement/town/city
- ruin
- fort/castle
- mountain marker
- forest marker
- cave
- temple/shrine
- port
- waypoint
- custom marker
- generic landmark

Do not hardcode the system only for one narrow category.

---

### 2) Create a symbol catalog / preset library foundation
Implement a clean preset system for symbols/stamps.

At minimum support:
- stable symbol ids/keys
- display names
- category grouping
- render asset/style hooks
- future extensibility for custom packs or imported symbol libraries
- clean UI presentation in the Phase 3 authoring panel

You do not need a giant final art library yet, but there must be a real usable starter catalog.

Use placeholder vector/icon assets if necessary, as long as the system is structurally sound.

---

### 3) Implement symbol placement workflow
Create a real end-to-end workflow for placing symbols on the map.

Requirements:
- user can enter symbol/landmark mode
- user can choose a symbol preset
- user can preview placement before committing
- clicking places the symbol as real authored data
- placed symbols render clearly on the map
- symbols can be selected again later

Placement should feel intentional and editor-grade, not like a debug dropper.

At least one straightforward point-placement workflow must be complete and usable.

---

### 4) Implement stamp workflow
Support a stamp-style placement mode for reusable visual marks.

This may overlap with symbol placement, but there should be a clear concept of reusable stamped objects such as:
- settlement markers
- mountain icons
- forest cluster icons
- ruins
- ports
- points of interest

Requirements:
- stamps use the shared placement architecture
- the user can rapidly place repeated objects
- stamps remain editable after placement
- stamps are persisted as real map/world-space object data

The system should be clean enough that future brush-like scatter or batch-stamp tools can build on it later.

---

### 5) Implement landmark object workflow
Add a first-class landmark object concept on top of symbol placement.

A landmark should support at minimum:
- placed position
- chosen type/preset
- name placeholder or editable name
- category/type
- description/notes placeholder
- future region/label linkage hooks
- future export id/slug hooks

Requirements:
- at least one landmark can be placed and inspected in a property panel
- landmark metadata is stored in real authored structures
- landmark objects can be selected, renamed, and deleted

This turns map symbols into actual worldbuilding features rather than purely visual icons.

---

### 6) Add selection and editing for placed objects
Users must be able to interact with placed symbols/landmarks after creation.

At minimum support:
- hover feedback
- selection
- moving/repositioning
- deletion
- duplication if practical
- editing basic properties such as preset, scale, rotation, or name
- clear distinction between placement mode and editing mode

If full transform handles are too large for this prompt, implement a minimal but real editing model that can be extended cleanly.

---

### 7) Add rotation, scale, and anchor support
Implement practical transform controls for placed objects.

At minimum support:
- adjustable scale/size
- adjustable rotation or orientation
- stable anchoring to map/world position
- transform persistence in the underlying object data

These controls may live in:
- the side panel
- direct manipulation handles
- a toolbar
- a hybrid approach

The important part is that transforms are real, editable, and persisted.

---

### 8) Implement symbol/landmark rendering
Add clear rendering for symbols/stamps/landmarks on top of the map.

Requirements:
- symbols are clearly visible over terrain and paint layers
- hover/selection state is obvious
- rendering respects pan/zoom
- symbols remain anchored correctly in map/world space
- visibility toggles work
- rendering order is coherent with other overlays

Rendering does not need final atlas polish yet, but it must be stable and editor-ready.

---

### 9) Integrate symbol tools into the authoring UI
Add usable controls to the Phase 3 side panel and/or toolbar.

Useful controls include:
- active symbol/landmark tool
- catalog/preset picker
- category filters
- selected object properties
- size/scale
- rotation
- visibility toggle
- duplicate/delete actions
- name/metadata fields for landmarks
- layer target if appropriate

The UI should make object placement and editing feel approachable and organized.

---

### 10) Integrate with the shared layer system
Symbols and landmarks must participate in the Phase 3 layer/overlay architecture.

Requirements:
- symbols/landmarks appear as a distinct layer or layer family
- visibility toggles work
- active editing target is clear
- the system can support many placed objects
- later grouping/sub-layer behavior remains possible

Do not implement symbols as one-off floating UI state disconnected from the shared editor architecture.

---

### 11) Add metadata hooks for future systems
Placed landmarks should expose structure for later expansion.

At minimum provide hooks for:
- linked region id
- linked label id
- linked hydrology feature id if useful
- export slug/id
- notes/description
- category/type
- settlement class / landmark importance hooks
- future gameplay/system tags

You do not need to build the whole downstream ecosystem now, but the structure should exist.

---

### 12) Preserve compatibility with prior map systems
Symbols and landmarks must coexist cleanly with:
- navigation/pan/zoom
- elevation tools
- hydrology
- biome/surface paint
- regions/overlays
- future labels and export tools

Do not break earlier functionality.

Interaction routing must remain mode-aware and stable.

---

### 13) Preserve persistence compatibility
Symbol and landmark data must remain save/load/export friendly.

Requirements:
- authored objects are stored in real map/world-space aligned structures
- no dependence on temporary DOM/CSS-only visuals
- future save/load logic can consume the data
- export/downstream systems can consume the data later without architectural rework

If persistence foundations already exist in the repo, extend them appropriately.

---

### 14) Preserve flattened globe compatibility
All symbol/stamp/landmark authoring must remain compatible with later globe wrapping.

Important:
- store positions in flattened global map/world coordinates
- avoid screen-space-only persistence
- ensure anchors remain interpretable as world-surface positions
- consider seam-safe placement behavior where practical, even if seam UX is not fully polished yet

Later globe conversion must be able to interpret these objects as real world features.

---

### 15) Preserve undo/redo compatibility
If undo/redo already exists, integrate symbol actions at sensible boundaries such as:
- completed placement
- completed move
- transform/property edits
- duplication
- delete action

If undo/redo is not fully implemented yet:
- structure symbol commits so they can become clean undoable actions later
- keep preview/in-progress placement separate from committed object data
- avoid mutation patterns that will make action history painful later

---

### 16) Keep performance reasonable
The symbol/landmark system should remain usable on large world maps.

Take sensible measures such as:
- efficient render/update of placed objects
- reasonable hit-testing or selection logic
- not rerendering unrelated systems unnecessarily
- scalable handling for many symbols

Do not overengineer, but do not knowingly create a fragile bottleneck.

---

## UX expectations
By the end of this prompt, the user should be able to:
- enter symbol/landmark mode
- choose a preset from a usable catalog
- place symbols on the map
- select a placed symbol later
- move/edit/delete it
- give at least one landmark a name or metadata
- understand that map objects are now real authored world features in the editor

The workflow should feel like the start of serious object-level cartography and worldbuilding.

---

## Implementation guidance
Prefer:
- typed symbol/preset/object models
- reuse of shared authoring state and side-panel systems
- world-space anchored object data
- clean separation between catalog definitions, placed-object data, rendering, and editing interactions
- a starter asset system that can be expanded later

Avoid:
- purely decorative non-editable icon drops
- storing persisted symbols only as temporary screen visuals
- hardcoding only one category such as settlements
- monolithic one-off placement code disconnected from the shared editor architecture
- breaking navigation or existing tool routing behavior

---

## Deliverables
Implement:
- symbol/stamp/landmark data models
- starter symbol catalog/preset system
- real symbol placement workflow
- real landmark metadata workflow
- selection/edit/move/delete support
- transform support for scale/rotation in at least a basic but usable form
- rendering for placed objects
- side-panel/toolbar integration
- any necessary state/store/type updates
- persistence hooks as appropriate

Also update light internal comments/docs if helpful for future prompt continuity.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. The user can place at least one real symbol/stamp on the map.
2. Placed symbols are stored as real authored map/world-space data.
3. The user can select an existing placed symbol again later.
4. The user can move, edit, or delete a placed symbol in a real workflow.
5. At least one landmark can carry editable metadata such as a name/category.
6. Symbols/landmarks render clearly and participate in the shared layer/visibility system.
7. Existing terrain, hydrology, biome/surface paint, regions, navigation, and editor systems are not broken.
8. The implementation remains compatible with flattened-globe-safe data assumptions.
9. The code leaves a clean path for later labels and export features.

---

## What not to do
Do not:
- build the final labeling/text system here
- build the final export/globe system here
- build a full custom asset marketplace here
- rewrite the renderer unless truly necessary

This prompt is about real symbols, stamps, and landmarks authoring, not every downstream mapping feature.

---

## Final instruction
Implement the symbols, stamps, and landmarks system cleanly and completely, with at least one real symbol placement/edit workflow and one real landmark metadata workflow working end-to-end in the editor.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
# Phase 3 — Biome and Surface Paint

## Objective
Build the biome and surface painting system for **World Seed Mapper** so users can author the visible ecological and surface makeup of their world on top of the terrain, elevation, and brush-layer foundations established earlier.

This prompt should turn the shared brush engine into a real map-painting workflow for:
- biome painting
- surface/ground-type painting
- transitions between painted regions
- erase/replace workflows
- layer-aware rendering and visibility
- future compatibility with labels, symbols, hydrology, and globe wrapping

This is one of the core creative workflows of the app and should feel real by the end of this prompt.

---

## Context
Earlier phases already established:
- flattened-globe-safe world canvas assumptions
- procedural/fractal terrain generation
- elevation and heightmap editing
- Phase 3 authoring workspace foundation
- shared authoring/tool/layer state
- reusable brush engine and paint-layer architecture
- hydrology authoring tools

This prompt should build on those systems rather than bypass them.

Biome and surface painting should:
- use the shared brush and layer systems
- operate in map/world space
- remain editable and visible as authored overlay data
- coexist cleanly with terrain and hydrology
- prepare for future region, symbol, and label workflows

---

## Required outcome
When complete, the app should support a real painting workflow where the user can:
1. select biome or surface paint tools
2. choose a paint target/category/material
3. paint onto real authored map layers
4. erase or replace painted areas
5. see painted results clearly on the map
6. manage visibility/active target behavior through the layer system
7. preserve compatibility with later globe wrapping and export

At least one complete **biome painting** workflow and one complete **surface painting** workflow should be functional by the end of this prompt.

---

## Core implementation tasks

### 1) Define biome and surface classification models
Implement shared typed models/constants for paintable biome and surface classes.

At minimum support a useful initial set such as:
- ocean/coast support hooks where relevant
- plains/grassland
- forest
- desert
- tundra
- swamp/marsh
- jungle
- mountain/alpine
- scrub/steppe
- snow/ice
- rocky/barren

And for surface/ground-type painting, support categories such as:
- grass
- dirt
- sand
- rock
- snow
- mud
- ash/volcanic
- custom placeholder surface classes if needed

You do not need perfect final taxonomy, but the system must support:
- stable ids/keys
- labels/display names
- render styling hooks
- future extension
- metadata useful for export or gameplay later

---

### 2) Decide and implement layer structure
Use the existing paint-layer system to support authored biome and surface data.

You may choose one of these approaches if it fits the codebase well:
- separate biome layer and surface layer
- one shared thematic paint system with typed targets
- multiple layer instances grouped under biome/surface families

Requirements:
- the user must be able to tell what they are painting into
- biome and surface data must be stored as real editable authored data
- layer visibility must work
- the model must remain compatible with persistence and later globe wrapping

Keep the architecture extensible rather than one-off.

---

### 3) Implement biome paint workflow
Create a real end-to-end biome painting tool.

Requirements:
- user can enter biome paint mode/tool
- user can select a biome type/category
- brush preview appears correctly
- click and drag painting modifies the biome layer
- results render clearly on the map
- the active biome type is obvious in the UI
- painted data persists in the authored layer model

Biome painting should feel like a true editor feature, not a tech demo.

---

### 4) Implement surface paint workflow
Create a real end-to-end surface/ground painting tool.

Requirements:
- user can select a surface type/material
- brush preview appears correctly
- click and drag painting modifies the surface layer
- results render visibly and distinct from pure biome paint where appropriate
- surface paint integrates into the same authoring/layer framework cleanly

Surface painting may be represented as:
- broad map-scale texture classes
- ground material overlays
- cartographic surface styles
- another structurally sound interpretation that fits the app

The important part is that it is real authored paint data with an editable workflow.

---

### 5) Support replace, erase, and overwrite behavior
Implement practical edit behaviors for biome/surface painting.

At minimum support:
- normal paint/apply
- erase/clear
- replace/overwrite of existing values
- clear visual indication of the current operation mode

If the shared brush system already supports operation modes, extend and use it cleanly instead of duplicating logic.

Users must be able to correct mistakes easily.

---

### 6) Add optional adjacency/transition support where practical
Add lightweight transition support if the architecture allows it without overcomplication.

Possible behaviors:
- softened brush transitions using opacity/weight painting
- smoothing pass hooks
- transition preview
- boundary feathering or blend-aware rendering hooks

Important:
- do not block completion on a giant terrain-material blending system
- a modest, cleanly structured transition foundation is enough
- if full blending is deferred, code should still leave room for it later

A good minimal implementation is better than an unfinished fancy one.

---

### 7) Add renderer support for biome and surface layers
Implement rendering so biome and surface paint results are clearly visible on the map.

Requirements:
- biome-painted areas are visually readable
- surface-painted areas are visually readable
- visibility toggles work
- the rendering remains compatible with base terrain/elevation/hydrology
- the app still feels like a map editor rather than a flat debug overlay

The rendering can be stylized or semi-abstract for now, but it must be coherent.

---

### 8) Respect existing terrain and hydrology context
Biome/surface painting should coexist cleanly with:
- elevation and terrain shading
- water features from hydrology tools
- future regions/overlays/symbols/labels

Useful considerations:
- water should remain visible and not be accidentally buried by paint rendering
- mountain terrain should still remain legible
- painted layers should appear like authored overlays tied to the world surface

You may choose the correct render order/compositing strategy as needed.

---

### 9) Add side-panel and toolbar controls
Integrate biome and surface painting into the Phase 3 authoring UI.

Useful controls include:
- active tool
- active category/type
- size
- opacity/strength
- hardness/falloff
- paint mode (apply / erase / replace)
- target layer selection
- preview toggle if useful
- selected layer visibility/opacity controls if appropriate

The controls should be organized and easy to understand.

---

### 10) Add selection/inspection hooks
Biome and surface paint systems should expose useful state for later tools.

At minimum support hooks or structure for:
- identifying the active painted value under cursor
- identifying selected paint target/category
- showing current target layer
- future fill/bucket tools
- future legend generation or metadata inspection
- future region extraction if needed

You do not need to build all those tools now, but the implementation should not block them.

---

### 11) Preserve persistence compatibility
Biome and surface data must remain persistence-friendly.

Requirements:
- authored paint data is stored in real map/world-space aligned structures
- no dependence on temporary DOM/CSS-only visuals
- future save/load logic can consume the data
- the structure supports export or later downstream systems without rework

If the repository already has persistence foundations for map edits, extend them appropriately.

---

### 12) Preserve flattened globe compatibility
All biome and surface paint data must remain compatible with later globe wrapping.

Important:
- store data aligned to the flattened global canvas/map space
- avoid screen-space-only persistence
- avoid assumptions that break when the map becomes a wrapped globe
- consider seam-safe data representation where appropriate, even if seam editing UX comes later

This data should represent world-surface authorship, not just screen decoration.

---

### 13) Maintain coexistence with prior tools
Biome/surface paint must coexist cleanly with:
- navigation/pan/zoom
- elevation tools
- hydrology tools
- brush engine foundations
- future region/symbol/label tools

Do not break earlier functionality.

Canvas interaction routing must remain stable and mode-aware.

---

### 14) Preserve undo/redo compatibility
If undo/redo already exists, integrate biome/surface paint actions at sensible stroke boundaries.

If undo/redo is not fully implemented yet:
- structure commits so each finished paint stroke can become a clean undoable action later
- keep preview/in-progress/committed state separated
- avoid mutation patterns that will make action history difficult later

This should follow the architecture established in earlier Phase 3 prompts.

---

### 15) Keep performance reasonable
Painting should remain responsive on reasonably large world maps.

Take sensible measures such as:
- localized updates
- chunk invalidation if relevant
- efficient paint storage and rendering
- avoiding unnecessary full-world rerenders for small edits where possible

Do not overengineer, but do not knowingly create a fragile bottleneck.

---

## UX expectations
By the end of this prompt, the user should be able to:
- choose biome paint or surface paint
- pick a category/material
- see the brush preview
- paint and erase real map data
- see results clearly
- understand that this is a major creative authoring system in the editor

The workflow should feel satisfying and immediately useful for worldbuilding.

---

## Implementation guidance
Prefer:
- reuse of shared brush/layer/editor state
- typed biome/surface catalogs
- renderer integration that respects the map-space data model
- clean separation between paint data, UI controls, and rendering
- layering/compositing that keeps the map readable

Avoid:
- hardcoding all logic into one monolithic component
- screen-space-only fake paint data
- duplicate brush logic separate from the shared brush engine
- visual-only implementations that cannot persist later
- breaking hydrology or terrain readability

---

## Deliverables
Implement:
- biome classification model/catalog
- surface classification model/catalog
- real biome paint workflow
- real surface paint workflow
- erase/replace support
- rendering for biome/surface layers
- side-panel/toolbar controls
- any needed store/type/layer updates
- persistence hooks as appropriate

Also update light internal comments/docs if helpful for future prompt continuity.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. The user can select a biome painting workflow and paint real biome data.
2. The user can select a surface painting workflow and paint real surface data.
3. Biome and surface data are stored as real authored layer data in map/world space.
4. Brush preview, click, and drag painting work cleanly.
5. Erase or replace workflows exist in a usable form.
6. Painted results render clearly on the map.
7. Layer visibility and active-target behavior work at least in a basic but real form.
8. Existing terrain, hydrology, navigation, and prior editor systems are not broken.
9. The implementation remains compatible with flattened-globe-safe data assumptions.
10. The system clearly prepares for later regions, labels, symbols, and export.

---

## What not to do
Do not:
- build final climate simulation here
- build full procedural biome auto-generation logic as the main deliverable here
- build final region/political boundary tools here
- build label placement here
- build final globe export here
- rewrite the renderer unless truly necessary

This prompt is about authored biome and surface painting, not every downstream mapping system.

---

## Final instruction
Implement the biome and surface painting system cleanly and completely, with one real biome paint workflow and one real surface paint workflow working end-to-end in the editor.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
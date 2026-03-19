# Phase 3 — Brush Engine and Paint Layer Foundations

## Objective
Build the reusable brush engine and paint-layer foundation for **World Seed Mapper** so later Phase 3 tools can share one consistent editing system.

This prompt should establish:
- a generalized brush/stroke engine
- paint application flow on map-space data
- reusable preview behavior for brush-based tools
- foundational editable paint layers for future biome/surface/water/selection workflows
- clean integration with the Phase 3 authoring workspace created in the previous prompt

Do **not** fully implement every paintable feature yet. This prompt is about the common brush/painter architecture and the first working layer-backed painting flow.

---

## Context
Earlier phases already established:
- flattened-globe-safe map projection/canvas assumptions
- procedural terrain generation
- elevation/heightmap editing
- a Phase 3 authoring workspace shell
- centralized authoring mode/tool/layer state
- mode-aware interaction plumbing

Phase 3 now needs a true brush system that future prompts can reuse for:
- biome painting
- surface painting
- moisture/temperature overlays if added later
- hydrology influence painting
- selection masks
- region fills or brushes where appropriate
- erase/smooth/blur style paint operations

This prompt should create the common brush-and-layer infrastructure those later tools depend on.

---

## Required outcome
When complete, the app should support a real, working brush-based paint flow that:
1. operates in map/world space rather than screen-space hacks
2. uses reusable layer-backed paint data
3. previews brush placement before application
4. supports click and click-drag strokes
5. preserves flattened-globe-safe alignment
6. provides a clean extension path for later painting tools

At least one actual editable paint layer should already work by the end of this prompt.

---

## Core implementation tasks

### 1) Create a reusable brush engine
Implement a generalized brush engine/service/module that can be used by multiple future tools.

It should support a base model for:
- brush radius/size
- strength/opacity
- hardness/falloff
- spacing for drag strokes
- optional smoothing/interpolation between drag samples
- brush shape support structure (start with circle; allow future expansion)
- add/replace/erase style operation modes as appropriate
- optional pressure/intensity multiplier structure for future extensibility

The brush engine should be written so the paint target is abstracted from the brush logic.

Avoid making the brush engine specific only to biomes.

---

### 2) Define stroke session behavior
Implement the interaction/session logic for brush strokes.

Support:
- hover preview
- pointer down to start a stroke
- drag to continue stroke
- pointer up to end stroke
- stroke sampling along drag paths so fast movement does not leave large gaps
- clean cancellation/reset if interaction is interrupted

There should be a clear distinction between:
- transient preview state
- in-progress stroke state
- committed layer data

This structure is important for later undo/redo support.

---

### 3) Add paint-layer data foundations
Implement the shared data model for editable paint layers.

At minimum support a consistent model for:
- layer id
- layer type
- visibility
- opacity or blend strength if appropriate
- paint data backing store
- metadata needed for future tools
- editability / locked state hooks if useful

At least one real paintable layer should exist now, such as:
- a generic test paint layer, or
- a surface/biome prototype layer

The key is that it is not just a visual mockup; it should store editable authored data in a reusable format.

---

### 4) Choose a durable paint-data representation
Use a representation that is compatible with:
- large maps
- future persistence
- later globe conversion
- efficient localized brush updates

Possible approaches might include:
- texture-like grid data aligned to the world map
- tile/chunk-based authored overlays
- typed arrays or other efficient backing stores
- structured sparse data where appropriate

Choose what best fits the current codebase, but the implementation must be:
- deterministic
- map-space aligned
- reasonable for repeated edits
- not dependent on DOM-only or CSS-only tricks

Keep the design flexible enough that multiple paint layers can coexist later.

---

### 5) Implement a first working brush-edit tool
Add one actual brush-edit workflow to prove the system works.

This can be a prototype such as:
- painting values into a generic paint layer
- painting a placeholder “surface class”
- painting a biome index/value prototype
- painting a grayscale influence/weight layer

Requirements:
- the user can select the tool
- the brush preview is visible
- clicking/dragging modifies the layer
- the result is visibly rendered on the map
- the layer can be toggled on/off in the layer UI
- the tool uses shared authoring/brush state, not isolated local hacks

This first working implementation should be clean enough that future prompts can expand it instead of replacing it.

---

### 6) Add brush preview rendering
Implement preview behavior for the active brush.

Preview should support at least:
- current brush footprint under cursor
- feedback for size
- feedback for active target layer/tool
- reasonable visibility across different terrain backgrounds

Preview may be rendered via:
- overlay canvas
- editor overlay layer
- render pass in the map renderer
- another clean approach compatible with the app architecture

Important:
- preview state must not accidentally mutate persisted map data
- preview must track world/map coordinates accurately
- preview must remain aligned with pan/zoom behavior

---

### 7) Integrate brush controls into the authoring UI
Connect the brush engine to the Phase 3 side panel and/or toolbar.

Expose appropriate controls for at least:
- size
- strength/opacity
- hardness/falloff
- active paint target/layer
- brush mode if applicable
- preview enable/disable if useful

The controls should be:
- clearly grouped
- reusable by later tools
- connected to centralized authoring state
- not duplicated across multiple isolated components

---

### 8) Establish paint rendering behavior
Implement rendering for the first paint layer(s).

Requirements:
- the user must see paint results clearly on the map
- layer visibility toggles should work
- rendering should be compatible with the existing terrain/map display
- it should be obvious the paint sits as authored overlay data rather than replacing the whole terrain renderer

The rendering does not need to be final-polish cartography yet, but it must be structurally correct.

---

### 9) Prepare for future blend/stack logic
Even if full compositing is not finished here, structure the paint layer system so future prompts can support:
- multiple visible paint layers
- ordering/stacking
- opacity blending
- locked layers
- selectable active target layer
- future import/export

It is acceptable to scaffold some of this, but the current implementation should not paint the project into a corner.

---

### 10) Maintain compatibility with existing editing systems
This new brush system must coexist cleanly with:
- pan/zoom/navigation
- prior terrain/elevation editing
- Phase 3 mode switching
- future non-brush tools like labels and symbols

Do not break earlier map interaction behavior.

Mode routing should ensure:
- brush tools capture interaction only when active
- navigation still feels natural
- prior terrain tools remain available if already exposed

---

### 11) Preserve future undo/redo compatibility
If undo/redo already exists, wire committed brush strokes into that system at the correct action boundary.

If undo/redo is not fully implemented yet:
- structure stroke commits so one finished stroke can become one undoable action later
- keep preview/in-progress state separate from committed state
- avoid directly mutating data in ways that will be hard to track later

Useful comments or small abstractions are welcome if they help future continuity.

---

### 12) Keep performance acceptable
Brush painting should remain usable on reasonably large maps.

Take sensible measures such as:
- localized updates
- chunk invalidation if relevant
- efficient sampling/application
- not rerendering the entire world unnecessarily for tiny edits unless the current architecture truly requires it

Do not overengineer prematurely, but do not implement a knowingly fragile approach either.

---

## UX expectations
By the end of this prompt, the user should be able to:
- select a brush-based tool
- see the active brush footprint
- adjust brush settings
- paint on a real editable layer
- toggle layer visibility
- understand that this system is the shared foundation for future authoring tools

The experience should feel like the start of a real map painter.

---

## Implementation guidance
Prefer:
- shared typed brush/stroke models
- centralized editor store/state slice usage
- reusable paint-layer abstractions
- renderer integration that respects map-space/world-space coordinates
- modular separation between stroke logic, paint data, and rendering

Avoid:
- hardcoding the system only for a single later feature
- screen-space-only overlays used as persisted data
- duplicated brush logic in UI components
- direct mutation patterns that make undo/redo difficult
- brittle preview code mixed into unrelated rendering paths

---

## Deliverables
Implement:
- reusable brush engine/stroke logic
- paint layer data structures
- first working brush-edit tool
- preview rendering
- UI controls wired into the authoring workspace
- rendering for the first editable paint layer
- any required shared types/store updates

Also update any light internal docs/comments if helpful for future prompts.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. A reusable brush engine exists in code.
2. Brush interaction supports hover preview, click, and drag painting.
3. At least one real editable paint layer exists and stores authored data.
4. Paint is applied in map/world space, not as a fake screen overlay.
5. The painted result is visibly rendered on the map.
6. Brush controls are exposed in the authoring UI and use centralized state.
7. Layer visibility/active-target behavior exists at least in a basic form.
8. The implementation does not break navigation or prior editing flows.
9. The system is clearly reusable for later biome, hydrology, and mask tools.

---

## What not to do
Do not:
- fully implement biome rules/classification logic here
- fully implement rivers/lakes/hydrology authoring here
- build full region fills here
- build label placement here
- build symbol catalogs here
- attempt final export/globe wrapping features here

This prompt is the common brush-and-layer foundation.

---

## Final instruction
Implement the reusable brush engine and paint-layer foundation completely and cleanly, with one working brush-edit tool proving the system end-to-end.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
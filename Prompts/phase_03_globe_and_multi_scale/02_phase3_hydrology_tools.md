# Phase 3 — Hydrology Tools

## Objective
Build the hydrology authoring tools for **World Seed Mapper** so users can create, edit, and manage water features on top of the existing terrain, heightmap, and paint-layer systems.

This prompt should establish a practical hydrology editing workflow for:
- rivers and tributaries
- lakes and inland water bodies
- springs/source points
- river path editing and cleanup
- water feature visibility and layer organization
- basic terrain-aware water behavior where practical

This prompt should create real usable hydrology tools, not just placeholders.

---

## Context
Earlier phases already established:
- flattened-globe-safe map canvas assumptions
- procedural terrain generation
- elevation/heightmap editing
- Phase 3 authoring workspace shell
- centralized authoring/tool/layer state
- reusable brush engine and paint-layer foundation

Hydrology now needs to sit on top of those systems in a way that:
- respects the elevation map where possible
- stores water data in world/map space
- stays compatible with future globe wrapping
- works as authored cartography data, not only visual decoration

This prompt should add the first complete non-placeholder map-authoring system of Phase 3.

---

## Required outcome
When complete, the app should support a real hydrology workflow where the user can:
1. place or define river source points
2. create/edit river paths
3. create lakes/inland water bodies
4. erase or modify water features
5. see water features rendered clearly on the map
6. manage hydrology visibility through the layer system
7. keep all water data aligned to the flattened world canvas for later globe conversion

At least one end-to-end river workflow and one end-to-end lake workflow should be functional by the end of this prompt.

---

## Core implementation tasks

### 1) Define hydrology data models
Implement shared typed data structures for hydrology entities.

At minimum support:
- river id
- river source/origin data
- river path geometry
- river width or width profile hooks
- tributary/parent relationship hooks
- flow direction where applicable
- lake id
- lake geometry/area data
- waterbody type classification hooks (lake, inland sea, reservoir, marsh, etc. if useful)
- metadata fields needed for future editing/export
- visibility/editability hooks
- selection/hover support hooks

Use a data model that can persist authored water features cleanly.

---

### 2) Create a hydrology authoring mode and tool set
Within the Phase 3 workspace, implement hydrology mode with real tools.

At minimum include tools such as:
- River Draw / River Path
- River Edit
- Lake Paint or Lake Create
- Water Erase
- Source Placement
- Select Water Feature

The exact names can match the app’s style, but users should be able to clearly understand what each tool does.

Hydrology mode should plug into the shared authoring state and side-panel system created earlier.

---

### 3) Implement river creation workflow
Add a real river authoring workflow.

A usable river workflow may include one of these approaches:
- click-to-place sequential river points that form a path
- click-drag path drawing converted into sampled points
- source point + destination/path sketch
- terrain-guided routing with manual correction

Requirements:
- user can create a river path
- path is stored as real authored map data
- river is visibly rendered
- river can be selected again later
- river creation should feel intentional, not like a debug-only feature

If terrain-aware guidance is practical, use it. If not, manual authoring is acceptable as long as the structure allows later terrain guidance refinement.

---

### 4) Add terrain-aware river assistance where practical
Use the existing elevation/heightmap information to improve river authoring when possible.

Possible behaviors:
- suggest downhill flow direction
- discourage obviously uphill routing
- show terrain-aware preview hints
- optionally snap or bias new segments along plausible drainage directions
- warn on invalid or strange flow if needed

Important:
- do not overcomplicate this into a full hydrology simulation engine unless the repo already supports it well
- authored control must remain primary
- terrain-aware behavior should assist, not trap the user

A modest, well-implemented terrain-aware helper is better than an unfinished simulation system.

---

### 5) Implement river editing
Users must be able to edit existing rivers after creation.

At minimum support:
- selecting a river
- moving or adjusting control points / sampled path points, or another equivalent editable representation
- deleting a river
- splitting or trimming if practical
- changing width/basic style settings
- preserving path integrity after edits

If full point-level editing is too large for this prompt, implement a minimal but real editing model that can be extended cleanly.

---

### 6) Implement lake/inland water workflow
Add a real lake creation workflow.

Possible approaches:
- brush-based lake painting into the hydrology layer
- shape-based lake polygon creation
- basin fill driven from selected area
- region fill over a selected depression or user-defined boundary

Requirements:
- user can create at least one lake/inland water body intentionally
- lake data is stored as real authored water data
- lake is visibly rendered
- lake can be selected and deleted or modified
- lake authoring remains aligned to map/world space

If the app architecture makes raster-like painted lakes a better fit right now, that is acceptable as long as it is stored cleanly and remains compatible with later editing.

---

### 7) Add hydrology erase/cleanup tools
Implement removal/correction workflows for water features.

At minimum support:
- deleting selected rivers
- deleting selected lakes/water bodies
- an erase workflow appropriate to the chosen hydrology data model
- cleanup of partial/in-progress features if the user cancels

Users should not feel trapped by mistakes.

---

### 8) Add hydrology rendering
Render water features clearly and consistently on the map.

At minimum:
- rivers are visible as lines/paths with readable scale
- lakes/inland waters are visible as filled areas or otherwise distinct bodies
- selected/hovered hydrology features have visible feedback
- layer visibility toggles work
- hydrology rendering remains compatible with pan/zoom and existing map rendering

Rendering does not need to be final atlas polish yet, but it must be clean and structurally correct.

---

### 9) Integrate hydrology controls into the authoring UI
Add hydrology controls to the Phase 3 side panel and toolbar.

Useful controls may include:
- active hydrology tool
- river width
- terrain guidance toggle
- snap/simplify/smoothing settings if applicable
- selected feature properties
- create/delete/apply/cancel actions
- hydrology layer visibility
- hydrology preview controls if useful

The UI should make hydrology feel like a real editor feature, not a hidden dev panel.

---

### 10) Support selection and inspection
Hydrology features should participate in the Phase 3 authoring workspace as first-class editable objects.

At minimum support:
- selecting a river or lake
- hover feedback
- basic metadata/property display
- active feature highlight
- clear distinction between drawing mode and editing mode

This will help future prompts when symbols, labels, and regions begin interacting with water features.

---

### 11) Preserve layer and persistence compatibility
Hydrology data must integrate with the shared layer/overlay system.

Requirements:
- hydrology appears as a distinct editable/visible layer or layer family
- visibility toggles work
- data is stored in a persistence-friendly structure
- implementation does not rely on temporary screen-space-only objects
- future save/load/export paths can consume the data without architectural rework

If the project already has persistence foundations, extend them appropriately.

---

### 12) Preserve flattened globe compatibility
All hydrology authoring must remain compatible with later globe wrapping.

Important:
- rivers and lakes must be stored in map/world coordinates aligned to the flattened global canvas
- do not use ad hoc pixel-only screen-space persistence
- avoid assumptions that break when the map later wraps into a globe
- dateline/seam behavior should at least be considered in the model, even if full seam tooling comes later

Any persisted hydrology data must be understandable as real world-surface data.

---

### 13) Maintain coexistence with prior tools
Hydrology mode must coexist cleanly with:
- navigation/pan/zoom
- elevation tools from Phase 2
- brush/painter infrastructure from Prompt 01
- future symbols/labels/selection tools

Do not break earlier functionality.

Canvas interaction routing should remain mode-aware and stable.

---

### 14) Preserve undo/redo compatibility
If undo/redo already exists, integrate hydrology actions at sensible boundaries such as:
- completed river creation
- confirmed river edit
- completed lake creation
- delete action
- property change

If undo/redo is not fully implemented yet, structure hydrology commits so these actions can become clean undoable units later.

Avoid mutation patterns that would make later history tracking painful.

---

### 15) Keep performance reasonable
Hydrology tools should remain usable on large world maps.

Take practical measures such as:
- localized redraws where possible
- efficient path/lake data structures
- not rerendering unrelated systems unnecessarily
- not over-simulating terrain flow when simple guidance is enough

Do not overengineer, but do not knowingly choose a fragile approach.

---

## UX expectations
By the end of this prompt, the user should be able to:
- switch into hydrology mode
- create a river
- create a lake or inland water body
- select/edit/delete water features
- see water features clearly on the map
- understand that hydrology is now a real authored layer in the editor

The tool should feel like the beginning of serious world water-feature design.

---

## Implementation guidance
Prefer:
- typed hydrology entity models
- clear distinction between vector-like river data and area-based lake data if that suits the architecture
- reuse of shared editor state and interaction routing
- reuse of brush/panel/layer infrastructure when appropriate
- terrain-aware assistance as a helper, not a hard requirement
- code structured for future export and globe wrapping

Avoid:
- purely decorative uneditable water rendering
- storing persisted hydrology as temporary screen overlay state
- hardcoding everything into one giant hydrology component
- breaking existing navigation/edit flows
- forcing a full physical hydrology simulation if the project is not ready for it

---

## Deliverables
Implement:
- hydrology data models
- hydrology mode and tools
- real river creation workflow
- real lake/inland water workflow
- hydrology edit/delete support
- hydrology rendering
- hydrology UI controls
- any necessary state/store/type updates
- persistence hooks as appropriate

Also update light internal comments/docs if helpful for future prompt continuity.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. Hydrology mode exists in the authoring workspace.
2. The user can create at least one real river feature.
3. The user can create at least one real lake/inland water feature.
4. Water features are stored as real authored map/world-space data.
5. Rivers and lakes render visibly and cleanly on the map.
6. Water features can be selected and deleted or modified in a real workflow.
7. Hydrology participates in the shared layer/visibility system.
8. Existing navigation and earlier editing tools are not broken.
9. The implementation remains compatible with flattened-globe-safe data assumptions.
10. The code leaves a clear path for later labels, symbols, and export features.

---

## What not to do
Do not:
- build the final globe wrapping/export system here
- fully simulate climate, erosion, or watershed generation unless it is already straightforward in this codebase
- build all biome logic here
- build final cartographic labeling here
- rewrite the renderer unless truly necessary

This prompt is about real hydrology authoring tools, not every downstream system.

---

## Final instruction
Implement the hydrology authoring tools cleanly and completely, with at least one real river workflow and one real lake workflow working end-to-end in the editor.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
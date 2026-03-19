# 05 — Vector Geometry Tools: Coasts, Rivers, Borders, Roads

## Objective
Implement the first real **vector geometry editing workflow** for World Seed Mapper so the user can create, view, select, and edit foundational path/polygon-based map features such as coastlines, rivers, borders, and roads.

This prompt is where the editor begins doing real authored map work.

---

## Why this prompt exists
A serious fantasy map tool cannot rely only on paint layers.

Coastlines, rivers, roads, and borders need editable geometry:
- scalable
- precise
- reshapeable
- layer-aware
- future-ready for styling, snapping, nesting, and export

This prompt should establish the first strong vector-authoring foundation.

Do it in a way that can grow, not in a way that will need to be torn out later.

---

## Required outcome
By the end of this prompt, the app should have:

- a usable vector geometry layer workflow
- the ability to create vector features on compatible layers
- support for foundational geometry types:
  - polyline/path
  - polygon/closed shape
- dedicated authoring behaviors for:
  - coastlines
  - rivers
  - borders
  - roads
- visible rendered vector features on the world canvas
- selection of vector features
- basic point/vertex editing
- simple geometry deletion
- inspector integration for selected vector features
- tool-aware creation/edit states
- layer compatibility rules for vector authoring
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** build every advanced Bézier/vector feature on day one if it slows progress.
- Do **not** overbuild a CAD/GIS suite.
- Do **not** make vector authoring depend on future undo/redo being finished.
- Do **not** lock the system into one feature type only.
- Do **not** fake vector features as uneditable screenshots or dead overlays.
- Do **not** mix persisted document geometry with screen-space coordinates.

---

## Main goal
Create a vector editing system that already feels like the start of a real map editor:

- the user can choose a vector tool
- click on the canvas to create meaningful geometry
- see that geometry render clearly
- select and inspect it
- adjust it at a basic level
- keep it attached to the correct layer and map document

This should be real authored content, not just placeholder visuals.

---

## What to build

### 1) Vector-tool foundation
Add real vector-oriented tools to the tool rail and shared editor state.

At minimum include tools or submodes for:
- select/edit vector
- draw path/polyline
- draw polygon
- coastline mode
- river mode
- border mode
- road mode

These can share a common vector-authoring engine internally, but the UI should make the intended feature mode understandable.

Good outcome:
- the user can tell what kind of thing they are drawing
- the resulting feature is tagged/typed appropriately
- defaults differ where sensible

Do not create needless tool duplication, but do make the workflow clear.

---

### 2) Compatible layer behavior
Vector authoring should only target compatible layers.

Requirements:
- vector tools should work against vector-capable layers
- if the selected layer is not compatible, show a clear message or guided fallback
- optionally offer:
  - auto-create a vector layer
  - switch to an existing compatible vector layer
- layer lock/visibility should be respected

Do not silently dump vector features into random places.

---

### 3) Geometry model hookup
Use the document model properly.

Persist vector features as real document entities, not temporary UI-only objects.

At minimum support geometry entities for:
- open polyline/path
- closed polygon

A vector feature should reasonably capture:
- id
- feature kind/category (coastline, river, border, road, generic path, generic polygon)
- geometry points/vertices in document space
- closed/open state
- style metadata
- layer id
- map id or implicit parent through the layer
- optional tags/notes metadata if natural

---

### 4) Canvas rendering of vector features
Render vector features on the Pixi world canvas.

Requirements:
- visible on the correct map/layer
- ordering respects layer stack
- visibility and opacity honor layer settings
- selected feature is visually distinct
- hovered or active drawing geometry should be visually understandable

Keep styling simple but legible.

Examples:
- coastline: stronger neutral stroke
- river: thinner blue-ish default if color exists, or a clearly distinct style token
- border: dashed or contrasting style if easy
- road: moderate-width line

No need for perfect art styling yet. Focus on clarity and functionality.

---

### 5) Path/polygon creation workflow
Implement a basic but usable authoring workflow.

At minimum:
- click to place points
- continue placing points to extend a path
- complete/commit the feature with a clear gesture
- support closed polygon completion where appropriate
- show live preview of the pending segment while drawing
- allow canceling current draw operation cleanly

Good examples:
- click adds vertex
- double-click or Enter completes
- Escape cancels current in-progress shape

Choose a coherent interaction model and keep it consistent.

---

### 6) Coastline workflow
Provide a coastline-focused vector creation mode.

This does not need a separate geometry engine from generic path/polygon creation, but it should produce coastline-tagged geometry with sensible defaults.

Good coastline baseline:
- polygon or closed boundary support for landmass outlines
- or polyline that can later be used to define closed coast edges, if your architecture prefers that

Best practical outcome:
- user can draw a coastline-like closed land outline on a vector layer
- resulting feature is clearly categorized as coastline/land boundary

This is one of the core fantasy-map authoring workflows, so make it feel intentional.

---

### 7) River workflow
Provide a river-focused vector creation mode.

Requirements:
- open-path friendly
- visually distinct from roads/borders
- tagged as river
- easy to create on a vector layer

Future branching logic is not required yet, but the chosen data model should not block it.

Do not overcomplicate river simulation or flow rules here.  
This is an authoring tool prompt.

---

### 8) Border workflow
Provide a border-focused vector creation mode.

Requirements:
- open or closed geometry depending on use case
- tagged as border
- visually distinct in rendering and inspector
- suitable for later political overlay expansion

This can share the same core path tool system with different defaults.

---

### 9) Road workflow
Provide a road-focused vector creation mode.

Requirements:
- open-path friendly
- tagged as road
- rendered distinctly enough from rivers and borders
- future-ready for road hierarchies if possible, but not required now

Again: same base engine is fine, but different authored intent should be preserved.

---

### 10) Feature selection
Implement vector feature selection.

At minimum:
- click a rendered vector feature to select it
- selected feature is tracked in shared state
- inspector updates for the selected feature
- selection is visually obvious on canvas
- clicking away can clear selection where sensible

A simple hit-testing approach is fine if reliable enough.

Do not make selection so fragile that it feels broken.

---

### 11) Vertex editing foundation
Implement the first basic geometry editing workflow for selected vector features.

At minimum:
- show vertices or handles for selected feature
- allow moving existing vertices
- update rendered geometry live
- keep changes in document space
- respect lock state and layer compatibility

Nice minimal extras if natural:
- insert vertex on segment
- delete vertex
- drag whole feature later stub

But do not let advanced editing bloat the prompt.

The main thing is: selected vector geometry should no longer be static.

---

### 12) Deletion and cleanup
Implement basic vector feature deletion.

At minimum:
- delete selected vector feature
- clean selection state afterward
- optionally support deleting a selected vertex if that fits naturally
- avoid leaving orphan references or broken layer content

Keep it safe and simple.

---

### 13) Inspector integration
Upgrade the inspector for selected vector features.

At minimum show:
- feature id or label
- feature kind/category
- parent layer
- vertex count
- open vs closed state
- basic style info
- maybe bounds or length placeholder if useful

Light editing is welcome if natural:
- rename/title placeholder
- category change
- stroke width
- line style placeholder
- closed/open toggle when appropriate

Do not turn this into a full style system yet.

---

### 14) Tool settings integration
The tool settings panel should reflect active vector tool context.

Examples:
- stroke width
- smoothing placeholder
- auto-close toggle
- snapping placeholder
- feature category
- default style by tool

A few real editable defaults are welcome if they fit naturally.

The important part is that vector authoring now has a settings home.

---

### 15) Geometry utilities
Add useful geometry helpers/utilities where needed.

Examples:
- screen ↔ document coordinate conversion usage helpers
- point-to-segment distance or simple hit testing
- bounds calculation
- polyline length placeholder
- polygon closure helpers
- vertex insertion/removal helpers

Keep this organized and reusable for later prompts.

---

### 16) Layer panel feedback
The layers panel should reflect that vector content now exists.

Nice examples:
- content count or feature count hint
- vector icon/badge
- selected feature’s layer remains obvious
- active vector layer is legible during drawing

Do not overbuild content summaries, but the UI should begin acknowledging real map content.

---

### 17) Interaction rules
Choose clean rules and keep them coherent.

Examples of good decisions:
- select tool edits existing features
- vector draw tools create new features
- locked layers cannot be authored to
- hidden layers cannot be selected from canvas
- active compatible vector layer is required for creation
- Escape cancels current drawing
- Delete/Backspace removes selected feature if safe

Document the behavior in code/comments/status if useful.

---

### 18) Performance guidance
Even early vector editing should respect scale.

Aim for:
- rendering only current map/layer content as appropriate
- efficient redraw/update for edited features
- no unnecessary full-scene rebuild if a smaller update works
- geometry caches or redraw boundaries only if simple and helpful

Avoid:
- deeply coupling vector drawing to React rerenders
- rebuilding every layer on every mouse move if avoidable
- storing transient drag state in persisted document structures

---

### 19) UX guidance
The vector workflow should feel calm and understandable.

Aim for:
- obvious active draw mode
- visible preview while drawing
- clear selected-state handles
- minimal confusion about how to finish a shape
- distinct rendering between feature categories

Avoid:
- hidden completion gestures with no clue
- tiny impossible-to-hit handles
- all vector types looking identical
- silent failure when wrong layer is selected

This should already feel like the start of a real map-authoring tool.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/vector-tools/...`
- `src/engine/vector/...`
- `src/lib/geometry/...`
- `src/components/panels/Inspector...`
- `src/store/editorActions/vector...`

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- vector-compatible tools exist in the tool rail/workflow
- the user can create vector features on compatible layers
- coastlines, rivers, borders, and roads can be authored as categorized geometry
- vector features render on the canvas
- vector features can be selected
- selected vector features show editable vertices/handles
- at least basic vertex movement works
- selected vector features can be deleted
- inspector/tool settings reflect vector context
- document-space geometry is preserved correctly
- layer visibility/locking rules are respected
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- segment midpoint handles for vertex insertion
- duplicate selected feature
- simple dashed border rendering
- simple measurement readout
- inline rename/title for vector feature
- hover highlight before selection

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- real vector-authoring tools
- categorized vector feature creation
- on-canvas vector rendering
- basic selection/editing/deletion for vector geometry
- inspector/tool-settings integration
- reusable geometry utilities
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should no longer feel like “a canvas with panels.”

It should feel like the user has begun truly authoring a world: drawing coastlines, laying rivers, marking roads, and defining borders with editable geometry.

That is the bar.
# 04 — Layer System and Visibility / Locking

## Objective
Implement the first real **layer system** for World Seed Mapper so maps can contain organized, typed, stateful layer stacks that the editor can display, select, reorder, show/hide, lock, and prepare for future content editing.

This prompt is where the app gains one of the most important foundations of any serious creative tool.

---

## Why this prompt exists
Everything that comes next depends on layers.

Vector tools, paint tools, symbols, labels, overlays, weather, terrain, nested maps, exports, and globe preview all become far easier if the layer system is strong and sane.

This prompt should establish:
- typed layers
- stack ordering
- visibility
- locking
- selection
- grouping foundations
- editor integration
- renderer integration hooks

Do this well. Weak layer systems become permanent pain.

---

## Required outcome
By the end of this prompt, the app should have:

- a real typed layer stack for the active map
- layer rows rendered from actual document data
- selectable layers
- visibility toggles
- lock toggles
- opacity support in the model/UI
- add-layer flow for supported Phase 1 layer kinds
- delete-layer flow
- reordering controls
- basic group/container layer support or a clearly prepared foundation for it
- right sidebar layer panel upgraded from placeholder to real editor panel behavior
- inspector integration for selected layer details
- renderer/canvas layer container hookup foundation
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** fully implement vector or paint content authoring yet.
- Do **not** build a giant Photoshop clone all at once.
- Do **not** store layer UI state in random component-local islands if shared state is cleaner.
- Do **not** make every possible future layer feature now.
- Do **not** create a layer system that only works for one content type.
- Do **not** hardcode assumptions that all layers are raster or all layers are vector.

---

## Main goal
Create a layer system that already feels like the beginning of a real map editor:

- multiple layers per map
- clear ordering
- visible active selection
- easy show/hide and lock/unlock
- future-ready typed layer behavior
- clean pathway into renderer containers and tools

This should feel functional, not decorative.

---

## What to build

### 1) Real map-backed layer stack
Use the document model to drive the layer panel for the currently open map.

The active map should expose a real ordered layer collection.

Requirements:
- layer rows come from actual map document state
- selection updates shared editor state
- the active layer is visually clear
- empty states are handled gracefully
- default starter layers can exist if helpful for bootstrapping

The layer panel should now behave like the real home of map layers.

---

### 2) Supported Phase 1 layer kinds
Implement practical support for the core Phase 1 layer kinds already defined in the model.

At minimum, support creation/display of:
- vector geometry layer
- paint layer
- mask layer
- symbol/feature layer
- label/text layer
- data overlay layer
- group/container layer

If some are initially "structurally supported but content-light," that is okay — but the user should be able to create them and see them represented correctly.

Do not create 20 half-baked layer kinds just because the model can.

---

### 3) Layer row UI
Each layer row should show meaningful information in a clean editor-style format.

At minimum each row should communicate:
- layer name
- layer kind
- visibility state
- lock state
- selection state
- maybe opacity hint or child/group count if useful

Nice touches are welcome if natural:
- icons by layer kind
- active accent highlight
- indentation for group children
- badges for empty/content-present state

Avoid clutter. Make it scannable.

---

### 4) Visibility toggles
Implement real visibility toggles.

Requirements:
- toggle visible/hidden per layer
- state persists in the current document/editor session as appropriate
- layer row reflects state immediately
- hidden layers should be ignored by future rendering hooks where possible
- canvas/renderer structure should already have a place to respect visibility

At this stage, even if only world-bounds/base placeholders are rendering, the architecture should make visibility meaningful.

---

### 5) Lock toggles
Implement real lock toggles.

Requirements:
- toggle locked/unlocked per layer
- locked state is visible in the panel
- active tools should be able to query lock state later
- selection behavior should respect lock rules where sensible
- inspector should show lock state

You do not need full editing-block behavior yet, but the system should be ready for it.

---

### 6) Layer creation flow
Add a usable “add layer” flow.

This can be:
- a small menu
- a popover
- a dropdown
- or a compact inline creation UI

Requirements:
- user can choose supported layer kind
- new layer gets a sensible default name
- new layer is inserted in a sensible position
- the new layer becomes selected
- the inspector updates to that layer
- creation logic should reuse document factories/helpers where practical

This should feel lightweight and real, not clunky.

---

### 7) Layer deletion flow
Implement delete/remove layer behavior.

Requirements:
- delete selected layer
- or delete via row action
- handle selection updates safely after deletion
- avoid breaking the map when last layer is removed
- optionally guard destructive actions with a minimal confirmation if needed

Be practical. Do not overcomplicate deletion UX.

---

### 8) Reordering
Implement a basic layer reorder flow.

Good options:
- move up / move down buttons
- drag-and-drop if it is clean and low-risk
- or both if natural

Requirements:
- layer order changes should affect document order
- the panel should rerender correctly
- selected layer should remain selected after move
- order rules should be consistent
- group/container handling should not become chaos

If drag-and-drop adds too much complexity here, simple move controls are acceptable.

---

### 9) Group/container layer foundation
Implement group/container layer support, or at minimum a practical first step.

The system should support the idea that layers can be grouped.

Preferred behavior:
- group layers can exist in the stack
- layers can belong under a group
- group rows can show child count
- optional expand/collapse state is welcome
- visibility/lock inheritance behavior can be basic but should be thought through

Minimum acceptable:
- group layers exist structurally
- group rows render distinctly
- hierarchy/future nesting is not blocked

Do not let hierarchy logic spiral into complexity, but do not skip it entirely.

---

### 10) Layer selection and active layer rules
Define and implement clear active layer behavior.

Questions the system should answer:
- what is the active editable layer?
- what happens if selected layer is hidden?
- what happens if selected layer is locked?
- what happens if selected layer is deleted?
- what if a group is selected instead of a leaf layer?

You do not need every advanced rule solved perfectly, but the behavior should be coherent.

A good baseline:
- selected layer can be any layer
- active editable target should later prefer visible/unlocked compatible leaf layers
- hidden/locked state is surfaced clearly in inspector and UI

---

### 11) Inspector integration
Upgrade the inspector so it shows real selected-layer information.

At minimum, show:
- layer name
- layer kind
- visibility
- locked state
- opacity
- group membership or parent if applicable
- id or debug info only if useful
- placeholder content summary

Optional light editing:
- rename layer
- change opacity
- toggle visibility/lock from inspector too

This should feel like the beginning of a real layer inspector.

---

### 12) Opacity foundation
Support opacity at the layer model/UI level.

Requirements:
- opacity value exists and is editable for selected layers
- layer rows may optionally hint at opacity
- renderer integration path can consume opacity later
- value handling is typed and normalized sensibly

You do not need advanced blend modes yet unless they fit very naturally.

---

### 13) Layer-panel actions and commands
Refine shared editor actions/commands for layer operations such as:
- add layer
- remove layer
- rename layer
- set selected layer
- toggle visibility
- toggle lock
- move layer
- set opacity

Keep this logic centralized enough that later prompts can reuse it instead of duplicating panel behavior.

---

### 14) Renderer/canvas integration foundation
The layer system should begin touching the world canvas architecture.

You do **not** need full content rendering for all layer kinds yet, but the renderer/stage structure should now have a clean way to map layer documents to scene containers.

A good outcome:
- layer containers or scene nodes can be created from active map layers
- visibility maps to container visibility
- opacity maps to container alpha where appropriate
- ordering maps to container order
- empty layers still have a structural presence for future use

This is important. The layer system should not live only in the sidebar.

---

### 15) Default starter map behavior
When the default in-memory project loads, the map should have a sensible starter layer stack.

For example, something like:
- Coastlines
- Terrain Features
- Labels
- Weather
or a similarly sensible default set

This makes the editor immediately more legible and useful.

Keep it modest and aligned with Phase 1 goals.

---

### 16) Panel UX guidance
The layers panel should feel like a real editor panel, not a crude checklist.

Aim for:
- compact rows
- clear affordances
- active selection highlight
- readable icons/text
- meaningful empty states
- usable action buttons

Avoid:
- giant oversized cards for each layer
- too many nested buttons
- confusing row click targets
- noisy visual styling

This is a productivity surface.

---

### 17) History/readiness note
You do not need full undo/redo yet, but implement layer actions in a way that later history support will be possible.

That means:
- avoid scattered ad hoc mutations
- prefer clear action pathways
- keep document changes reasonably centralized

Future prompt 07 will thank you for this.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/layers/...`
- `src/components/panels/LayersPanel...`
- `src/store/editorActions/layers...`
- `src/engine/layers/...`
- `src/lib/layers/...`

You may choose slightly different organization if it is cleaner.

---

## UX guidance
The app should now feel much closer to a real creative tool.

Aim for:
- quick scanning of layer stack
- obvious active layer
- meaningful row controls
- low-friction add/delete/reorder
- inspector that helps explain the selected layer

Avoid:
- stub-only UI
- rows that look interactive but do nothing
- heavy modal flows for simple actions
- generic dashboard styling

---

## Acceptance criteria
This prompt is complete when:

- the active map has a real typed layer stack in the UI
- layers can be selected
- visibility toggles work
- lock toggles work
- layer creation works for supported layer kinds
- layer deletion works safely
- basic reordering works
- group/container layer foundation exists
- inspector reflects real selected-layer data
- opacity is represented and editable
- layer state is wired toward renderer/canvas structure
- the editor feels more like a real map tool
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- inline layer rename
- expand/collapse for group layers
- duplicate layer action
- quick filter/search placeholder
- simple layer-kind icons
- row badges for child count or hidden/locked state

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- real active-map layer panel behavior
- typed layer creation and management
- visibility/lock/opacity controls
- reorder functionality
- group/container layer foundation
- inspector integration
- initial renderer-layer hookup structure
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should no longer feel like “a canvas with a fake layers sidebar.”

It should feel like the beginning of a real layered world editor where map content will soon have proper places to live.

That is the bar.
# Phase 3 — Authoring Workspace Foundation

## Objective
Build the Phase 3 authoring workspace foundation for **World Seed Mapper** so the app can move from terrain generation/elevation editing into full map authoring.

This prompt should create the structural foundation for:
- paint/edit mode switching
- authoring tool panels
- layer-aware editing state
- shared brush/tool session state
- map interaction routing for future Phase 3 tools
- a stable workspace shell that later prompts can extend cleanly

Do **not** try to complete all Phase 3 features here. This prompt is about establishing the workspace architecture and UI scaffolding that later prompts will plug into.

---

## Context
Phase 1 already established:
- flattened-globe-safe map canvas assumptions
- procedural/fractal map generation base
- viewport/navigation basics
- map rendering foundation

Phase 2 already established:
- heightmap/elevation editing workflows
- terrain manipulation tools
- terrain-state persistence foundations
- editing interactions that modify map data

Phase 3 now adds the **authoring layer**:
- terrain/biome painting
- hydrology tools
- regions and overlays
- symbols/landmarks
- labels/text
- selection/mask/fill/erase workflows

This prompt must create the common workspace and editing framework for those tools.

---

## Required outcome
When this prompt is complete, the app should have a dedicated Phase 3-capable authoring workspace with:
1. a clear editing shell around the existing map canvas
2. a left or right tool panel area for authoring tools
3. a layer/overlay panel area
4. a shared toolbar/status area for active tool state
5. centralized authoring state management
6. a clean extension path for future prompts without reworking the workspace

---

## Core implementation tasks

### 1) Create a dedicated authoring workspace shell
Implement or refactor the main map editing screen so it supports a proper authoring layout.

Include:
- top toolbar/header area for active mode, tool summaries, and quick actions
- side panel for tool controls
- optional second panel or tabbed section for layers/objects/labels depending on the existing UI style
- central canvas area that continues using the map renderer from earlier phases
- bottom or inline status readout for cursor/world/map feedback if appropriate

The shell should feel like a real editor, not a temporary mockup.

---

### 2) Introduce authoring modes
Create a mode system that can distinguish at minimum between:
- navigation/view mode
- terrain/elevation edit mode
- paint mode
- hydrology mode
- region/overlay mode
- symbol mode
- label/text mode
- selection/mask mode

These do not all need full functionality yet, but the app should have the state model and UI hooks for them now.

Requirements:
- active mode must be centrally stored
- workspace UI must update based on active mode
- canvas input routing must be mode-aware
- modes should be easy to extend later

---

### 3) Add shared authoring tool state
Create centralized authoring state for tool sessions.

Support a base structure for things like:
- active tool id
- brush size
- brush strength/opacity
- falloff/hardness
- selected paint target/layer
- selected symbol set
- selected label tool
- selection behavior
- snapping toggle if later needed
- preview toggle(s)

Not every field must be fully used yet, but the shape of the shared editing model should be established now.

This state should be designed so future prompts can reuse it rather than inventing parallel local state.

---

### 4) Add layer-aware workspace foundations
Implement the basic concept of editable map layers/overlays.

At minimum define support for:
- base terrain/elevation layer reference
- biome/surface paint layer
- water/hydrology layer
- regions/boundaries overlay
- symbols/landmarks layer
- labels/text layer
- selection/mask overlay
- preview/debug overlays if needed

Requirements:
- represent these in a consistent model
- allow visibility toggles in UI
- allow active-target selection where appropriate
- future prompts must be able to attach data to these layers cleanly

This can be scaffolded even if some layers are not fully populated yet.

---

### 5) Build the Phase 3 side panel system
Create a reusable authoring panel framework.

The panel system should support:
- contextual controls based on active mode/tool
- reusable section cards/groups
- collapsible sections if appropriate
- empty/placeholder states for upcoming prompts
- a stable layout for future controls

Add placeholder control groups for:
- Brush
- Hydrology
- Biome Paint
- Regions
- Symbols
- Labels
- Selection

Each section can be partial for now, but the workspace should visibly show the editor is prepared for these capabilities.

---

### 6) Add interaction routing for future tools
Refactor or extend map interaction handling so future tools can hook into the canvas cleanly.

Implement a mode-aware interaction pipeline that can conceptually support:
- hover preview
- click-to-apply
- click-drag brush strokes
- drag-select
- point placement
- path placement
- text anchor placement

For this prompt:
- the routing structure must exist
- at least one or two simple placeholder interactions should work without breaking earlier map interaction behavior
- navigation/pan/zoom must remain functional

This is architectural groundwork first, not full feature completion.

---

### 7) Preserve undo/redo compatibility
If undo/redo already exists from earlier phases, integrate the new authoring state/actions into that system where appropriate.

If a full undo/redo stack does not yet exist, prepare the action model so future prompts can register discrete authoring actions cleanly.

At minimum:
- do not hardcode future tools in a way that prevents undoable actions later
- document the intended action boundaries in code comments where useful

---

### 8) Add workspace-level status and feedback
Add lightweight editor feedback so users can tell what mode/tool is active.

Examples:
- active mode badge
- active tool label
- current target layer
- cursor/world coordinate readout if already available
- stroke preview indicator placeholder
- selected object count placeholder
- label placement readiness placeholder

Keep this clean and useful, not cluttered.

---

### 9) Maintain compatibility with flattened globe workflow
Nothing in this prompt may break the projection-safe assumptions established earlier.

Important:
- authoring data must remain aligned to the flattened world canvas
- do not introduce ad hoc distortions or screen-space-only hacks for persisted authoring data
- future globe wrapping must be able to consume these authored layers later

Use map-space/world-space data, not purely visual overlays when persistence is intended.

---

## UX expectations
The editor should feel like a serious creative workspace.

Aim for:
- clean layout
- obvious active mode
- obvious next place to click
- no confusing dead controls
- placeholder controls clearly labeled where full implementation is coming later
- no visual regression from earlier phases

The user should be able to open the editor and immediately understand:
- this is where world authoring happens
- the canvas is central
- tools are organized
- more specialized features will slot into this workspace naturally

---

## Implementation guidance
You may adapt existing files rather than creating a parallel editor if the current structure is already strong.

Prefer:
- central editor store/state slice/context
- reusable panel components
- reusable toolbar/status components
- typed mode/tool/layer enums or equivalent constants
- clear separation between render state, persisted map state, and transient tool-preview state

Avoid:
- scattering authoring logic across unrelated components
- hardcoding one-off UI pieces for every future mode
- tightly coupling canvas rendering to a single tool
- introducing duplicate state for mode/tool/layer selection

---

## Deliverables
Implement the workspace foundation in code.

Also update:
- any relevant shared types/interfaces
- editor state/store modules
- authoring UI components
- canvas interaction plumbing as needed
- any documentation comments that help future prompt continuity

If this repository includes a project log, dev notes, or status-oriented technical notes, update them only if appropriate and only briefly.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. The app has a recognizable authoring workspace shell around the map canvas.
2. There is a centralized concept of Phase 3 editing modes.
3. There is a centralized shared tool/authoring state model.
4. A layer/overlay model exists and is represented in the UI.
5. The side panel system exists and can swap contextual sections.
6. Canvas interaction handling is mode-aware at the architectural level.
7. Existing navigation and prior editing behavior are not broken.
8. The workspace clearly prepares for hydrology, paint, symbols, labels, and selection tools in later prompts.
9. The implementation remains compatible with flattened-globe-safe map data assumptions.

---

## What not to do
Do not:
- fully implement hydrology editing here
- fully implement biome painting here
- fully implement labels here
- build symbol libraries here
- build full selection masking here
- add globe wrapping/export as a major feature here
- rewrite the entire existing renderer unless absolutely necessary

This prompt is foundation first.

---

## Final instruction
Implement the Phase 3 authoring workspace foundation completely, wire it into the existing application cleanly, and leave the codebase in a strong state for the next Phase 3 prompt.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
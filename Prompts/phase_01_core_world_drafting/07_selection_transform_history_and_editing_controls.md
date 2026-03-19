# 07 — Selection, Transform, History, and Editing Controls

## Objective
Implement the core **selection and editing control system** for World Seed Mapper so authored content can be selected, manipulated, tracked, and safely revised through coherent editor behaviors and an initial undo/redo history foundation.

This prompt is where the editor begins to feel like a true creation tool instead of a set of disconnected authoring modes.

---

## Why this prompt exists
By this point, the app should already have:
- a real world canvas
- typed layers
- vector authoring
- paint/mask authoring foundations

Now the user needs the basic editing power that makes all of that usable:
- select things reliably
- see what is selected
- move or adjust selected content
- manage editing context clearly
- undo mistakes
- redo intentional reversals
- work without fear of breaking the map permanently

This prompt is where the editing experience starts to become trustworthy.

---

## Required outcome
By the end of this prompt, the app should have:

- a coherent shared selection model
- support for selecting relevant authored content
- clear selected-state feedback on canvas and in panels
- transform foundations for selected vector/symbol/label content where applicable
- multi-context editing rules (layer, feature, vertex, paint layer target, etc.)
- keyboard-friendly editing controls where practical
- undo/redo history foundation for major authoring operations
- safe state transitions between tools and selection modes
- delete/cancel/escape behaviors that are consistent
- inspector integration for selected targets
- status bar feedback for selection/editing state
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** attempt to build every professional transform feature in one prompt.
- Do **not** build a huge Photoshop-style history browser yet if simple undo/redo stacks are enough.
- Do **not** make history depend on fragile scattered mutations.
- Do **not** mix transient drag state into persisted document data.
- Do **not** create selection rules that silently contradict layer lock/visibility rules.
- Do **not** overcomplicate multi-select if a clean staged foundation is better.

---

## Main goal
Create an editing control system that makes the authored map feel manageable and safe.

The user should begin to feel:
- “I can click what I made.”
- “I can tell what is selected.”
- “I can move or adjust it.”
- “I can undo if I mess up.”
- “The editor understands what I’m trying to edit.”

That is the emotional shift this prompt should create.

---

## What to build

### 1) Shared selection model
Implement a clean, centralized selection model for the editor.

It should be able to represent things like:
- selected layer
- selected vector feature
- selected vertex/handle
- selected symbol instance
- selected label
- active paint target layer
- no selection

Important:
The app should distinguish between:
- **active layer**
- **selected content entity**
- **active tool context**

These are related, but not identical.

A good outcome:
- one shared editor selection shape
- typed selection target kinds
- consistent state transitions

---

### 2) Selection behavior rules
Define and implement coherent selection rules.

Examples of important questions:
- what happens when clicking on a vector feature?
- what happens when clicking on empty canvas?
- what happens when a locked layer contains a visible feature?
- what happens when the selected layer becomes hidden or deleted?
- what happens when switching from paint mode to select mode?
- what happens when a group layer is selected versus a leaf layer?

You do not need every advanced edge case solved perfectly, but the rules must feel coherent and predictable.

A good baseline:
- select tool is the main content-selection mode
- content on hidden layers is not selectable from canvas
- locked content may be inspectable but not editable, or fully unselectable depending on your chosen rule
- empty click clears entity selection but may preserve active layer
- deleting a selected item clears selection safely

Pick rules and keep them consistent.

---

### 3) Canvas hit-testing and selection feedback
Improve canvas hit-testing and visual selection response.

Requirements:
- clicking selectable content on the canvas selects it reliably
- selected content is visually distinct
- hover feedback is welcome if natural
- selected-state visuals should remain readable at different zoom levels
- selection overlays should live in runtime/editor space, not persisted document structures

Examples:
- vector features show highlight stroke or handles
- symbols show bounding or anchor feedback
- labels show anchor/box indication
- active paint layer can show target highlight in panels/status

Do not make selection feel invisible or fragile.

---

### 4) Selection modes by content type
Selection must begin to support different authored content types.

At minimum, support practical selection behavior for:
- vector features
- vector vertices/handles
- symbols/features if already implemented
- labels if already implemented
- layers in the panel
- paint/mask layers as authoring targets even if the painted pixels are not directly object-selected yet

You do not need perfect parity for every content type, but the selection system should not assume vector-only forever.

---

### 5) Transform foundation
Implement the first transform/manipulation foundation for selected content.

At minimum, support what is practical for currently authored entities:
- move selected vector feature as a whole, or
- move selected vertices/handles
- move selected symbol instances later if symbols exist by then
- move selected labels later if labels exist by then

A transform foundation should include concepts like:
- translation
- drag state
- document-space updates
- commit/cancel behavior
- visual feedback during transform

Do not try to build rotation/scale for everything if it would dilute the core job.  
Translation is the minimum essential transform.

---

### 6) Marquee / box selection foundation
If it fits naturally, add the first stage of box/marquee selection.

Good outcomes:
- drag a rectangle in select mode
- select all compatible entities intersecting that area
- maybe only on visible/unlocked layers

This is optional if it adds too much complexity right now.  
If skipped, leave a clear foundation for later multi-select.

At minimum, the architecture should not block future multi-selection.

---

### 7) Selection overlay architecture
Create a clean overlay approach for selection visuals.

This should support things like:
- selection outlines
- vertex handles
- transform previews
- hover hints
- future snapping guides
- future measurement overlays

The important part is separation:
- overlays belong to runtime/canvas systems
- authored map content remains authored content
- selection visuals are not baked into persisted data

Keep this clean and reusable.

---

### 8) Keyboard editing controls
Implement practical editing keyboard controls where reasonable.

At minimum consider support for:
- `Delete` / `Backspace` to delete selected feature/entity when safe
- `Escape` to cancel current drawing or transform
- `Ctrl/Cmd+Z` undo
- `Ctrl/Cmd+Shift+Z` or `Ctrl/Cmd+Y` redo
- optional temporary pan modifier if not already handled
- optional `Enter` to confirm/commit certain in-progress edits where relevant

These controls should behave consistently and not conflict badly with text entry fields.

---

### 9) Undo/redo history foundation
This is a major part of the prompt.

Implement the first usable history system for editor operations.

At minimum, history should cover the most important recent actions such as:
- add/delete layer
- reorder layer
- rename layer if editable
- create/delete vector feature
- move vector vertex
- move selected feature if implemented
- paint stroke commit if practical
- symbol/label placement when those prompts land later, if it fits naturally now

Good outcome:
- history stack exists
- undo restores prior editor/document state coherently
- redo reapplies coherently
- actions are grouped sensibly enough to feel usable

This does **not** need to become a giant enterprise event-sourcing engine.  
But it must be real and trustworthy.

---

### 10) History architecture guidance
Choose a pragmatic history approach.

Good options:
- command-style action history
- snapshot + patch strategy
- reducer history with typed operations
- document patch history for authored-state changes

Important:
- avoid deeply ad hoc mutations that are impossible to reverse
- avoid storing massive full-project snapshots for every mouse move if a cleaner approach is possible
- for paint strokes, commit history at the stroke level, not every single brush sample point if you can avoid it

The goal is practical correctness, not theoretical purity.

---

### 11) In-progress edit state vs committed history
Be careful about edit lifecycles.

Examples:
- drawing a vector path is in-progress until committed
- dragging a vertex is in-progress until mouse release/commit
- painting a brush stroke may be in-progress until stroke end
- only committed edits should generally land in undo history

This distinction matters a lot for usability and performance.

The architecture should make that boundary reasonably clear.

---

### 12) Inspector integration
Upgrade the inspector to better reflect current selection/edit context.

At minimum:
- show selected target type
- show selected entity details where available
- show whether selection is editable or blocked due to lock/visibility/tool rules
- surface transform-relevant info where practical
- make it obvious when no content entity is selected and only a layer or tool is active

Optional light editing is welcome if natural:
- rename selected feature/label
- quick property edits
- toggle lock/visibility from related contexts

The inspector should feel aware of what the user is actually editing.

---

### 13) Status bar integration
The bottom status bar should now reflect selection/editing state more meaningfully.

Examples:
- selected entity type
- selected layer name
- current tool
- current zoom
- pointer coordinates
- history state hint (undo available / redo available)
- current transform mode or draw mode if useful

Do not overload it, but it should feel alive and relevant.

---

### 14) Safe transitions between tools
Implement coherent transitions between major editor modes.

Examples:
- leaving a draw tool mid-draw should require commit/cancel behavior
- switching to paint tool should clear incompatible entity-edit states where sensible
- switching back to select should preserve valid selection if possible
- invalid selection after deletion/hide/lock should resolve cleanly

This is important for keeping the editor from feeling glitchy.

---

### 15) Selection and layer interaction
Selection should respect the layer model.

Requirements:
- selecting an entity should also make its parent layer clear/active
- selecting a layer in the panel should update selection context appropriately
- hidden layers should not silently remain active edit targets without warning
- locked layers should surface that state clearly
- group layers should have coherent selection behavior even if not directly content-editable

This prompt is partly about making layers and authored entities feel like one coherent editor.

---

### 16) Paint editing integration
Even though paint is not object-selected in the same way vector content is, selection/history logic should begin to accommodate paint workflows.

Good outcomes:
- the active paint layer is treated as the current paint target
- inspector/tool settings clearly reflect the target layer
- paint stroke commits can integrate with history if practical
- erase and brush operations obey undo/redo boundaries at a stroke level if implemented

If full paint history is too heavy for now, be honest in `STATUS.md` and leave a clean foundation.

---

### 17) Performance guidance
Selection and history should not destroy responsiveness.

Aim for:
- lightweight hover/selection overlays
- minimal full-scene rebuild during selection changes
- history entries that are granular but not absurdly noisy
- transform previews handled in runtime state until commit
- document updates committed sensibly

Avoid:
- storing full cloned project state on every mouse move unless the project is still tiny and clearly temporary
- forcing React rerenders for every tiny overlay update if the canvas can manage runtime overlays more efficiently
- mixing transient drag state into persisted content structures

---

### 18) UX guidance
The editing workflow should start to feel mature and forgiving.

Aim for:
- obvious selection visuals
- clear active-context cues
- transforms that are easy to understand
- coherent delete/cancel rules
- undo/redo that builds trust
- no “where did my selection go?” confusion

Avoid:
- hidden modal editing states
- selections that disappear without explanation
- overly tiny handles or impossible click targets
- undo that only works sometimes
- history entries so granular they become useless noise

The user should begin to feel safe doing real work here.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/selection/...`
- `src/features/history/...`
- `src/engine/selection/...`
- `src/engine/overlays/...`
- `src/store/editorActions/history...`
- `src/store/editorActions/selection...`

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- the editor has a coherent shared selection model
- selectable authored content can be selected reliably
- selection state is visually clear on canvas and in panels
- at least basic transform/edit control exists for relevant selected content
- delete/cancel/edit keyboard behavior is coherent
- undo/redo works for major authoring operations
- history boundaries are sensible for committed edits
- inspector/status bar meaningfully reflect selection/edit context
- layer/selection/tool interactions are coherent
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- marquee selection
- duplicate selected entity
- nudge selected entity with arrow keys
- history dropdown placeholder
- hover highlight before selection
- simple selection count display for future multi-select

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- centralized selection model
- reliable canvas/content selection behavior
- transform/editing foundation
- keyboard editing controls
- usable undo/redo history foundation
- improved inspector/status integration for editing context
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should feel significantly more trustworthy.

The user should be able to author content, select it, adjust it, and recover from mistakes without feeling like the editor is fragile.

That is the bar.
# 02 — Sculpt Brushes: Raise, Lower, Smooth, Flatten

## Objective
Implement the first real **terrain sculpting workflow** for World Seed Mapper so the user can author elevation data directly with brush-based tools such as **raise**, **lower**, **smooth**, and **flatten** on active terrain layers.

This prompt is where the editor begins truly shaping terrain instead of only storing terrain-capable data.

---

## Why this prompt exists
Prompt 00 established the terrain model.  
Prompt 01 made terrain layers and edit targets real in the live editor.

Now the user needs actual terrain tools.

The editor should be able to:
- target an active terrain layer
- brush onto height data in document space
- modify terrain chunks coherently
- respect chunk-aware storage and visible runtime foundations
- give useful cursor/preview feedback
- commit sculpt operations in a way that can participate in history and persistence

This prompt creates the baseline terrain-authoring experience that everything else in Phase 2 builds on.

---

## Required outcome
By the end of this prompt, the app should have:

- real terrain sculpt tools in the tool rail / editor workflow
- support for at least these sculpt operations:
  - raise
  - lower
  - smooth
  - flatten
- brush-based terrain editing on valid active terrain layers
- document-space sculpting behavior
- chunk-aware terrain edits with create-if-missing behavior where appropriate
- visible sculpt cursor / footprint feedback
- terrain tool settings for brush operation and strength
- coherent edit-target validation and blocked-state messaging
- sculpt-operation integration with history at sensible commit boundaries
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** build complex landform tools yet; those belong in the next prompt.
- Do **not** build full erosion simulation here.
- Do **not** brute-force a giant whole-map rewrite for every brush move if chunk-local updates can be used.
- Do **not** mix transient stroke state into persisted terrain documents.
- Do **not** ignore layer visibility/lock/edit-target rules.
- Do **not** turn this into a 3D terrain renderer; remain focused on sculpt authoring.

---

## Main goal
Create a sculpt workflow that already feels like the beginning of a serious terrain editor:

- choose a terrain brush tool
- see where the brush will affect the map
- drag on the world canvas
- change height data on the active terrain layer
- understand what the tool is doing
- trust that edits are being applied coherently and can later be visualized better

This should feel real, not fake.

---

## What to build

### 1) Terrain sculpt tool foundation
Add real terrain sculpt tools to the tool rail and shared editor state.

At minimum include:
- raise
- lower
- smooth
- flatten

Optional if it fits naturally:
- a unified terrain brush tool with selectable sculpt mode
- or separate tool entries for each operation

Either approach is acceptable if the workflow is clear.

Requirements:
- one terrain sculpt operation is active at a time
- active tool state is obvious
- the system clearly distinguishes terrain sculpt tools from paint/vector/symbol/label tools

Do not create confusion about what kind of editing mode the user is in.

---

### 2) Valid terrain target behavior
Terrain sculpting must only work when a valid terrain target exists.

Requirements:
- sculpt tools operate only on an active visible/unlocked terrain layer
- wrong-target situations are handled clearly
- if no valid terrain target exists, the UI should guide the user rather than failing silently
- hidden terrain layers are not sculpt targets
- locked terrain layers are not sculpt targets
- group layers are not sculpt targets unless your architecture explicitly supports that later

A good baseline:
- tool settings and status bar clearly indicate whether a valid terrain target exists
- sculpt input is blocked with understandable feedback if not

This must feel coherent and trustworthy.

---

### 3) Brush cursor / footprint preview
Implement a visible terrain brush cursor or footprint preview.

Requirements:
- cursor shows where sculpting will affect the map
- size reflects current brush radius/diameter
- preview updates correctly with zoom and camera movement
- preview is shown in document-space terms even though rendered in viewport space
- invalid-target state should be visually distinguishable if practical

Optional nice touches:
- color/style change by tool mode
- projected falloff ring
- center point marker

This is one of the biggest usability wins in the prompt.

---

### 4) Brush settings foundation
Implement practical sculpt brush settings.

At minimum support:
- brush size
- brush strength / intensity
- brush falloff or hardness, if practical
- flatten target height, if relevant to flatten mode
- smooth strength or passes factor, if relevant

These should live in the tool settings panel and update live editor behavior.

Do not overbuild a giant brush lab.  
A small strong set of controls is enough.

---

### 5) Terrain stroke lifecycle
Define and implement a coherent terrain stroke lifecycle.

Good baseline:
- pointer down begins a sculpt stroke
- pointer move continues the stroke
- pointer up commits the stroke
- Escape can cancel the in-progress stroke if practical
- history entry is created at the stroke level, not every individual sample update

This distinction matters a lot.

The system should clearly separate:
- in-progress runtime brush state
- committed document changes
- history commit boundaries

Do not let this become noisy or fragile.

---

### 6) Raise tool behavior
Implement the raise sculpt operation.

Requirements:
- dragging with raise increases height values on the active terrain layer
- effect strength depends on brush size/strength/falloff settings as appropriate
- edits apply in document space
- touched terrain chunks are created if missing and if creation rules allow it
- repeated strokes continue raising coherently

Choose a sensible height accumulation rule and keep it consistent.

Do not leave raise semantics vague.

---

### 7) Lower tool behavior
Implement the lower sculpt operation.

Requirements:
- dragging with lower decreases height values on the active terrain layer
- effect strength depends on brush settings
- terrain values remain within the chosen valid range semantics
- touched terrain chunks are created if missing where appropriate
- repeated strokes continue lowering coherently

Raise and lower should feel like mirrored terrain operations, not unrelated behaviors.

---

### 8) Smooth tool behavior
Implement the smooth sculpt operation.

Requirements:
- smoothing reduces harsh local terrain variation in the brushed area
- smoothing works on sampled terrain neighborhoods coherently
- the operation respects chunk boundaries cleanly
- smoothing does not create wild artifacts at chunk edges if that can be avoided
- smoothing is controllable by brush settings or strength

A good baseline:
- local averaging or weighted blending toward neighboring sample values
- practical and stable, not overly fancy

This is one of the key tools for terrain usability, so it should feel dependable.

---

### 9) Flatten tool behavior
Implement the flatten sculpt operation.

Requirements:
- flatten pushes brushed terrain toward a target height
- target height can be:
  - a user-controlled explicit value, or
  - sampled from initial click/start point, if that is cleaner
- the chosen behavior must be clear in the UI
- flatten should not behave mysteriously
- effect should be controlled by brush strength rather than all-or-nothing unless you intentionally choose otherwise

A strong baseline:
- flatten toward a configurable target value
- or flatten toward start-point sampled height with clear feedback

Whatever you choose, explain it clearly in tool settings or status messaging.

---

### 10) Chunk-aware edit application
This is a major part of the prompt.

Terrain sculpt operations must update chunk-based terrain storage coherently.

Requirements:
- edits are applied to affected terrain chunks only
- touched chunks are resolved from document-space brush influence
- the system can update samples across chunk boundaries without breaking continuity
- create-if-missing chunk behavior is coherent
- chunk access/update logic is shared and reusable

Do not fake sculpting with a temporary overlay that is not reflected in terrain data.

This prompt should create real authored height changes.

---

### 11) Terrain sampling and interpolation during sculpt
Use the terrain query/sampling helpers from Prompt 00 in practical sculpting flows.

Requirements:
- brush application can evaluate sample positions and neighboring samples as needed
- smooth/flatten operations use coherent sampling logic
- the system distinguishes between:
  - world/document coordinate brush location
  - terrain sample grid coordinates
  - chunk/sample addressing

Keep this math organized and reusable.

---

### 12) Runtime terrain update handling
When sculpting changes terrain data, the live runtime/editor system must update coherently.

Requirements:
- terrain-edit changes are reflected immediately enough to feel interactive
- the runtime update path is localized to affected terrain chunks where practical
- selection/panel state does not thrash unnecessarily during strokes
- visible-chunk/runtime terrain handling remains separate from persisted terrain data

You do **not** need the final terrain visualization yet, but edits must already be real and visibly acknowledged somehow.

---

### 13) Minimal visual feedback for sculpted terrain
You do not yet need full relief/slope rendering, but the user must be able to tell that sculpting is doing something.

Good options:
- lightweight debug terrain preview shading
- sampled terrain-value overlay in affected chunks
- inspector/status terrain readouts under cursor
- simple grayscale terrain preview if practical
- chunk-local visual updates that show height influence

Do not let this fully consume the next prompt.  
Just ensure sculpting is visibly meaningful enough to use.

---

### 14) Inspector integration
Upgrade the inspector and/or relevant context surfaces for terrain sculpting.

At minimum show:
- active terrain layer
- active sculpt tool
- brush size
- brush strength
- flatten target info if relevant
- target validity/editability state
- possibly cursor sample height under pointer if useful

The inspector should help the user understand terrain editing context.

---

### 15) Status bar integration
The status bar should meaningfully reflect terrain sculpt workflow.

Examples:
- active tool: Raise / Lower / Smooth / Flatten
- active terrain layer name
- brush size
- strength
- cursor coordinates
- sampled height under cursor if practical
- blocked state if no valid terrain target exists

Do not overload it, but make terrain work feel alive.

---

### 16) History integration
Terrain sculpting should participate in the editor history system in a sensible way.

Requirements:
- each completed sculpt stroke should generally become one history entry
- undo restores prior terrain state coherently
- redo reapplies coherently
- history granularity is stroke-level, not individual sample tick spam
- large terrain edits should avoid absurdly noisy history payloads where possible

This is a critical trust feature.

Be practical in implementation, and honest in `STATUS.md` about any current limits.

---

### 17) Persistence compatibility
Terrain edits must remain compatible with persistence foundations.

Requirements:
- sculpting updates real terrain document content
- saved terrain chunk data can later include those edits
- no dependence on runtime-only state for the edited terrain to “exist”
- chunk-modification state is representable cleanly for save/load workflows

You do not need to fully harden terrain persistence here, but sculpting must modify the real authoring data path.

---

### 18) Editing rules and transitions
Choose and implement coherent sculpt editing rules.

Examples:
- switching away from a sculpt tool ends the active stroke safely
- Escape cancels the in-progress stroke if practical
- switching terrain target during a stroke is blocked or handled safely
- hidden/locked target changes invalidate sculpt input clearly
- no compatible terrain target means brush preview may show blocked state but not commit edits

These rules should make the editor feel reliable, not glitchy.

---

### 19) Performance guidance
This prompt must respect large-map editing goals.

Aim for:
- localized chunk/sample updates
- brush influence evaluation only over affected terrain area
- no giant full-map terrain recompute on every mouse move
- runtime overlays updated efficiently
- history captured at sensible boundaries
- minimal unnecessary React rerenders during strokes

Avoid:
- rewriting the entire terrain dataset every frame
- storing heavy transient stroke state in persisted terrain documents
- history snapshots of the whole project for every brush move if a smaller scoped approach is possible
- brush handling that becomes frame-jittery or obviously sluggish

---

### 20) UX guidance
The sculpt workflow should feel calm, clear, and powerful enough to trust.

Aim for:
- obvious active sculpt mode
- visible brush footprint
- intuitive response from raise/lower
- smooth tool that actually helps
- flatten behavior that is understandable
- coherent blocked-state messaging
- immediate enough visible response to feel real

Avoid:
- no cursor preview
- silent invalid-target failure
- flatten behavior with no explanation
- tools that feel wildly inconsistent
- giant debug spam in the UI

This is the first moment the user should truly feel they can shape terrain.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/terrain/tools/...`
- `src/engine/terrain/sculpt/...`
- `src/lib/terrain/brushes/...`
- `src/store/editorActions/terrain...`
- `src/components/panels/ToolSettings...`
- `src/engine/overlays/...`

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- the editor has real terrain sculpt tools for raise, lower, smooth, and flatten
- sculpting works only on valid active terrain layers
- a visible terrain brush cursor/footprint exists
- brush size/strength and other basic settings work
- sculpt operations update real chunk-based terrain data
- smooth and flatten behave in a practical, understandable way
- sculpt edits are reflected in the live editor with enough feedback to be usable
- sculpt strokes participate sensibly in history
- persistence compatibility is preserved
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- sampled start-height flatten mode
- hardness/falloff visualization
- hover height readout under cursor
- modifier key for temporary invert raise/lower
- simple stroke preview accumulation visualization
- quick reset brush values action

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- real terrain sculpt tools
- raise/lower/smooth/flatten authoring workflow
- visible brush cursor and terrain-target-aware settings
- chunk-aware terrain edit application
- terrain stroke history integration
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should no longer just “have terrain layers.”

A user should be able to choose an elevation layer, pick a sculpt tool, and start actually shaping the terrain in a way that feels real, responsive, and trustworthy.

That is the bar.
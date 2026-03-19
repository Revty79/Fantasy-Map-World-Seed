# 06 — Paint, Masks, Land/Ocean, Biome, and Weather Layers

## Objective
Implement the first real **paint and mask workflow** for World Seed Mapper so the user can paint authored map surfaces and editable overlays for land, ocean, biome regions, and weather/data layers on large maps without abandoning the performance foundations already established.

This prompt is where the editor gains its first true brush-based authoring system.

---

## Why this prompt exists
Vector geometry alone is not enough for fantasy worldbuilding.

A serious world map tool also needs paint and mask workflows for things like:
- land/ocean definition
- biome regions
- terrain coverage
- weather overlays
- editable data masks
- future height/elevation and climate foundations

This prompt should establish a brush-authored system that is:
- map-scale aware
- layer-aware
- chunk/tile-ready
- editable
- future-friendly

Do this in a way that can grow into a powerful terrain and overlay authoring system later.

---

## Required outcome
By the end of this prompt, the app should have:

- real paint-capable layer workflows
- real mask-capable layer workflows
- brush-based painting on compatible layers
- editable land/ocean mask authoring
- biome paint/region authoring foundation
- weather/data overlay paint foundation
- visible painted content on the world canvas
- brush settings in tool settings
- layer compatibility rules for paint/mask authoring
- selection/inspector context for paint-capable layers
- chunk/tile-aware paint data structures or a clearly prepared equivalent
- basic erase behavior
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** implement full realistic terrain rendering yet.
- Do **not** brute-force paint everything into one giant always-loaded image if the architecture can avoid it.
- Do **not** depend on full undo/redo being complete yet.
- Do **not** implement advanced weather simulation here.
- Do **not** overbuild a Photoshop replacement in one prompt.
- Do **not** store transient brush cursor/runtime state in persisted document structures.
- Do **not** make paint tooling ignore layer visibility/lock rules.

---

## Main goal
Create a paint/mask system that already feels like a real world-authoring tool:

- the user can pick a paint-capable layer
- choose a paint or erase tool
- brush onto the world canvas
- see results appear on the correct layer
- define land/ocean/biome/weather information visually
- keep the system compatible with large maps

This should be real authored content, not fake overlay decoration.

---

## What to build

### 1) Paint tool foundation
Add real paint-oriented tools to the tool rail and shared editor state.

At minimum include:
- paint brush
- erase brush
- fill or region-fill placeholder if natural
- mask-paint mode if distinct from generic paint
- biome/weather paint mode or shared paint mode with category context

The tool structure should make it clear what the user is doing:
- painting a general paint layer
- painting a mask layer
- painting a biome/data/weather overlay

This can share a core brush engine internally, but the authored intent should remain clear.

---

### 2) Compatible layer behavior
Paint tools must only target compatible layers.

Requirements:
- paint tools work only on paint/mask/data-overlay compatible layers
- wrong-layer situations are handled clearly
- optionally offer:
  - auto-create compatible layer
  - switch to compatible layer
- hidden/locked layers cannot be authored to
- group layers are not direct paint targets unless your system explicitly supports that later

Do not silently paint into the wrong layer.

---

### 3) Paint data model hookup
Use the document model properly.

Painted content must become persisted document content, not temporary screen-only visuals.

The model should support:
- chunk/tile-aware storage, or a clearly equivalent partitioned approach
- brush-authored content in document space
- per-layer painted data
- masks and overlays with future extensibility

You do **not** need perfect production paint serialization yet, but the document-side structure should clearly allow:
- partitioned paint content
- selective loading/rendering
- large map support
- future exports

Avoid one massive monolithic canvas blob if possible.

---

### 4) Chunk/tile-aware paint foundation
This is a major part of the prompt.

Create a paint storage/rendering strategy that respects the large-map goal.

Good outcomes include:
- document-space paint chunks/tiles
- chunk keys/indexing
- only touched chunks are created
- visible chunk rendering can be limited to relevant viewport chunks
- future persistence can store chunk assets or chunk data cleanly

This does **not** need to become a deeply optimized final paint engine yet, but the architecture must clearly be scale-aware.

Do not sabotage future performance for short-term simplicity.

---

### 5) Canvas rendering of paint and mask layers
Render painted layers on the Pixi world canvas.

Requirements:
- painted content appears on the correct layer
- layer ordering, visibility, and opacity are respected
- mask/data layers are visually distinct enough to understand
- active painting feedback is visible
- large-map behavior stays coherent with chunk strategy

Acceptable initial visuals:
- straightforward texture or graphics-based chunk rendering
- alpha-based masks
- tinted biome/weather overlays
- simple land/ocean coloration on mask layers

No need for full artistic beauty yet. Focus on clarity and structure.

---

### 6) Land/ocean mask workflow
Provide an intentional land/ocean authoring workflow.

Requirements:
- the user can paint a land/ocean mask on a mask-capable layer
- the meaning of the layer is clear in UI/inspector
- painted results are visible on the canvas
- the system is future-ready for land/ocean-aware tools later

Good baseline:
- binary or category-based mask values
- land and ocean distinguishable visually
- easy erase/correct workflow

This is one of the most important worldbuilding surfaces. Make it feel intentional.

---

### 7) Biome paint workflow
Provide a biome-region paint workflow.

Requirements:
- user can paint biome regions or categories onto compatible layers
- at minimum support the concept of biome category assignment
- render with visually distinct but manageable overlay styling
- category/state should be inspectable and configurable

You do not need a complete biome library yet, but the system should support categories such as:
- forest
- desert
- plains
- tundra
- swamp
- mountain-region marker
or a similarly sensible starter set

Keep the category model clean and extensible.

---

### 8) Weather/data overlay workflow
Provide a weather/data-overlay paint workflow.

Requirements:
- user can paint weather/data-style overlays on compatible layers
- examples may include:
  - rainfall zones
  - temperature bands
  - wind regions
  - storm belts
  - humidity zones
- the layer remains clearly understood as an overlay/data layer rather than decorative paint
- inspector/tool settings can reflect the active category/value mode

My recommendation for implementation:
- start with category/value overlays rather than simulation
- support either categorical paint or simple scalar/intensity paint if natural

Do not build a full climate engine here.

---

### 9) Brush engine basics
Implement a usable brush engine.

At minimum support:
- brush size
- brush opacity/strength
- continuous stroke behavior while dragging
- document-space brush placement
- visual brush cursor/preview if practical
- erase mode
- optional hardness/softness if it fits naturally

This does not need to be ultra-advanced, but it must feel real enough to author with.

Avoid:
- single-click-only fake painting
- severe lag/jitter
- brush behavior that depends on screen scale in the wrong way

---

### 10) Brush settings integration
The tool settings panel should now meaningfully reflect paint context.

At minimum show/edit:
- brush size
- opacity/strength
- active paint category/value
- erase vs paint mode
- layer target info
- maybe hardness/flow if implemented

This should feel like a real settings home for brush authoring.

---

### 11) Fill / region assistance foundation
If it fits naturally, add a basic fill-oriented helper.

Good candidates:
- fill visible region on a mask layer
- flood-fill style within a simple chunk/texture context
- fill current category into connected area
- quick “set all visible chunk area” test helper if scoped carefully

This is optional.  
Do not let fill logic derail the brush authoring core.

If skipped, leave the architecture ready for it.

---

### 12) Inspector integration
Upgrade the inspector for selected paint/mask/data layers.

At minimum show:
- layer name
- layer kind
- target content mode (paint, mask, biome, weather, overlay)
- opacity
- basic content summary if possible
  - touched chunk count
  - category summary placeholder
  - content present / empty
- active brush context when that layer is selected and compatible

Optional light editing:
- rename layer
- default category/value
- preview mode
- layer tint/legend placeholder

Do not overbuild the inspector, but it should acknowledge real content now.

---

### 13) Cursor and hover feedback
Painting should feel intentional and visible.

At minimum:
- show brush cursor or brush footprint preview on the canvas
- make active paint mode obvious
- indicate when the current layer is invalid/locked/hidden
- status bar can reflect paint context if useful

This dramatically improves usability.

---

### 14) Layer panel feedback
The layers panel should reflect that paint/mask/data content exists.

Nice examples:
- content badge
- touched chunk count hint
- mask/paint/data icon difference
- active authoring layer highlight

Keep it restrained but informative.

---

### 15) Status bar integration
The bottom status bar should reflect paint workflow where helpful.

Examples:
- active tool: Paint / Erase
- active layer name
- brush size
- active category/value
- pointer coordinates
- maybe visible chunk count

This is not mandatory for every field, but the workflow should feel alive.

---

### 16) Editing rules
Choose coherent editing rules and keep them consistent.

Good baseline examples:
- paint only affects compatible, visible, unlocked target layer
- erase only affects the active compatible layer
- switching tools preserves sensible brush settings
- hidden layers are not painted
- locked layers are not painted
- if no compatible layer is selected, prompt or guide rather than failing silently

Document behavior in code/comments/status where useful.

---

### 17) Performance guidance
This prompt must respect the large-map vision.

Aim for:
- touched chunks created lazily
- visible chunk rendering limited where possible
- brush updates focused to affected chunks
- minimal unnecessary React rerenders during stroke painting
- render/runtime structures separated from persisted document data
- future-ready selective serialization

Avoid:
- one huge texture/canvas for the whole world
- reprocessing every chunk on every mouse event
- coupling brush strokes to sidebar rerender storms
- baking all data directly into UI state blobs

---

### 18) UX guidance
The first paint workflow should feel calm, understandable, and useful.

Aim for:
- obvious active layer and mode
- visible brush preview
- distinct overlay appearance by content type
- easy correction with erase
- simple category selection for biome/weather modes
- coherent layer targeting

Avoid:
- painting with no visible cursor feedback
- silent wrong-layer failure
- every overlay looking the same
- noisy over-styled colors that make the map unreadable
- mysterious behavior around opacity/strength

This should feel like the start of a serious paint-capable map editor.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/paint-tools/...`
- `src/engine/paint/...`
- `src/engine/chunks/...`
- `src/lib/paint/...`
- `src/components/panels/ToolSettings...`
- `src/store/editorActions/paint...`

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- paint-capable tools exist in the tool rail/workflow
- the user can paint on compatible paint/mask/data layers
- land/ocean masking is authorable
- biome paint/region authoring exists in a practical form
- weather/data-overlay painting exists in a practical form
- brush size/strength and erase behavior work
- painted content renders on the world canvas
- layer visibility/locking/opacity rules are respected
- the system uses chunk/tile-aware or similarly partition-friendly foundations
- inspector/tool settings reflect paint context
- active paint workflow has visible cursor/feedback
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- simple flood fill
- brush hardness/softness
- paint-category legend chip UI
- temporary solo-layer preview toggle
- chunk debug overlay for painted content
- simple palette presets for biome/weather categories

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- real paint/mask authoring tools
- land/ocean mask workflow
- biome/data/weather overlay painting foundation
- brush settings and erase behavior
- chunk/tile-aware paint structures or equivalent scalable preparation
- on-canvas paint rendering
- inspector/status/tool-settings integration
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should feel like the user can do real surface authoring on a world map: defining land and ocean, blocking in biomes, and painting weather/data overlays on purpose-built layers.

That is the bar.
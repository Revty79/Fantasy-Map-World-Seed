# 03 — World Canvas, Camera, and Chunk Strategy

## Objective
Implement the first real **world canvas foundation** for World Seed Mapper using the locked 2D renderer path, with smooth pan/zoom behavior, clear separation between document-space and screen-space, and a chunk/tile-aware structure that is safe for very large maps.

This prompt is where the center workspace stops being a placeholder and becomes the real rendering stage.

---

## Why this prompt exists
Before layers become powerful, before vector tools and paint tools arrive, the app needs a real canvas system that can:

- render inside the workspace cleanly
- respond to resize
- support large maps
- pan and zoom smoothly
- understand world/document coordinates
- prepare for chunk-aware rendering and editing
- leave room for overlays, guides, selections, and future tools

If this foundation is bad, every later tool becomes painful.

---

## Required outcome
By the end of this prompt, the app should have:

- a real renderer-backed center canvas area
- the renderer mounted cleanly into the workspace
- a world/document-space camera model
- smooth pan/zoom controls
- zoom limits and sensible defaults
- resize handling
- visible world bounds / canvas extents
- a chunk-aware spatial foundation for very large maps
- a clear separation between persisted map coordinates and viewport/runtime coordinates
- optional grid/guides/world-bounds overlays if they help
- status bar integration for zoom and coordinates
- hooks/interfaces ready for future vector, paint, and overlay layers
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** implement full drawing tools yet.
- Do **not** implement full vector editing yet.
- Do **not** implement paint authoring yet.
- Do **not** load giant image assets just to fake progress.
- Do **not** brute-force everything as one giant monolithic surface if the architecture can avoid it.
- Do **not** mix camera/view state into persisted document data.
- Do **not** overbuild a full GIS engine.

---

## Locked renderer direction
Follow the locked stack unless there is a very strong reason otherwise:

- use **PixiJS** for the 2D canvas/render stage
- keep **Three.js** reserved for later globe preview
- keep the canvas architecture ready for:
  - multiple visible layers
  - overlay UI
  - chunk/tile-aware drawing
  - large extents
  - future selection and tool previews

---

## Main goal
Create a real world canvas that already behaves like the beginning of a serious map editor:
- it can display the world working area
- it can navigate smoothly
- it can report meaningful coordinates
- it is architected for scale

This is not just “draw a blank rectangle.”

---

## What to build

### 1) Pixi canvas integration
Replace the center workspace placeholder with a real Pixi-backed render surface.

Requirements:
- mount/unmount cleanly in React
- resize with the workspace container
- avoid memory leaks
- separate Pixi setup from UI layout where practical
- leave a clean engine boundary for future renderer logic

A structure like this is welcome:
- React workspace component
- engine/canvas adapter or host component
- scene/stage setup module
- camera controller module

Avoid shoving everything into one component.

---

### 2) World/document-space foundation
Define and use a proper document-space/world-space concept for the canvas.

The world map should render in **document coordinates**, not screen coordinates.

At minimum, support:
- map document width/height extents
- origin / bounds
- conversion between:
  - screen/view coordinates
  - viewport coordinates
  - document/world coordinates

These conversions will be essential for all later tools.

Make them clear and testable.

---

### 3) Camera model
Implement a runtime camera/view model for the world canvas.

It should support:
- pan position / camera offset
- zoom level
- zoom-to-point behavior if practical
- reset view
- zoom to fit world bounds
- optional clamping behavior or soft limits
- future support for region/local scopes

Important:
This belongs to editor/runtime state, not persisted map document state.

---

### 4) Interaction basics
Add the basic canvas interactions needed for navigation.

At minimum:
- mouse wheel or trackpad zoom
- click-drag or tool-based pan
- responsive feel
- no awkward jittering
- sensible default zoom speed

If the app already has a pan tool, respect it.  
If not, use a pragmatic approach such as:
- middle mouse drag pans
- space-drag pans
- or active pan tool pans

Choose something clean and documentable.

---

### 5) World bounds visualization
Render the world map extents in a way the user can understand.

At minimum show:
- the usable world/document bounds
- the fact that this is the globe-safe master map stage
- a visible working surface area

Good examples:
- a framed world rectangle
- subtle background contrast outside the map bounds
- optional grid/latitude-longitude guide feel if appropriate
- scale/readout hints

Do not over-style it, but do make the workspace legible.

---

### 6) Chunk/tile-aware foundation
This is one of the most important parts of the prompt.

The app must eventually support very large detailed maps.  
Do **not** architect the canvas as “everything is one gigantic flat always-redrawn surface” if you can avoid it.

Create a chunk/tile-aware foundation.

This does **not** mean full chunked paint implementation yet.  
It means the architecture should have clear concepts like:
- chunk size or tile size in document units
- visible chunk computation based on camera/view
- a scene partition or spatial partition helper
- future hooks for loading/rendering only visible content

Good outcome:
- a basic chunk grid model exists
- visible chunks can be computed from current camera + viewport
- optional chunk boundary overlay can be toggled for debugging

Even if only lightly used now, this foundation matters greatly.

---

### 7) Renderer layers / scene structure
Organize the Pixi scene so later prompts can plug into it cleanly.

A good early scene structure might include containers for:
- background
- world bounds/base surface
- grid/guides
- future paint layers
- future vector layers
- future symbol layers
- future labels
- overlays / interaction previews

You do not need to implement all these fully, but the scene graph should not be flat chaos.

---

### 8) Camera-to-status-bar integration
Wire the canvas state into the bottom status bar.

At minimum show:
- current zoom
- current pointer coordinates in document/world space when hovering the canvas
- maybe world bounds or projection basis
- optional visible chunk count/debug value if useful

This makes the canvas feel alive and helps debugging.

---

### 9) View actions integration
Hook the canvas into the top bar view actions if those placeholders already exist.

Examples:
- reset view
- zoom to fit
- toggle grid/guides
- toggle chunk debug overlay if helpful

These do not need to be fancy, but should work if present.

---

### 10) Default world boot behavior
When the default in-memory project loads, the world canvas should:
- attach to the world map
- fit that map sensibly into view
- present an immediately understandable working surface

The user should not open the app to a random empty zoomed-off void.

---

### 11) Scope readiness
Even though world/region/local behaviors deepen later, the canvas architecture should be aware that maps can have different scopes.

At minimum:
- the canvas host should work against the currently open map document
- it should not assume “world only forever”
- map dimensions/bounds should come from document data, not hardcoded constants wherever possible

---

### 12) Debug-friendly utilities
Add clean utilities/helpers for canvas math and debugging.

Examples:
- coordinate transforms
- visible world rect calculation
- visible chunk range calculation
- zoom formatting
- fit-to-bounds helper

These helpers should be kept organized so later prompts reuse them.

---

### 13) Performance guidance
Treat performance as part of the design, not future cleanup.

Aim for:
- efficient resize behavior
- no excessive rerender loops between React and Pixi
- scene updates driven sensibly
- view math separated from React UI noise
- clear room for selective rendering by chunk/visibility later

Avoid:
- rebuilding the whole scene unnecessarily on every tiny state change
- storing Pixi objects directly in persisted app/document structures
- tight coupling between UI panels and renderer internals

---

### 14) Optional overlays
If they fit naturally, add one or more helpful overlays:

- grid overlay
- chunk debug overlay
- document bounds labels
- centerline / seam indicators for the equirectangular world map
- latitude/longitude-inspired guides

These are optional, but can make the canvas much more readable.

Do not let them bloat the prompt.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/engine/canvas/...`
- `src/engine/camera/...`
- `src/engine/spatial/...`
- `src/features/workspace/components/WorldCanvas.tsx`
- `src/lib/geometry/...`
- `src/store/editorViewStore.ts` or equivalent

You may use a slightly different organization if it is cleaner.

---

## UX guidance
The canvas should feel calm, clean, and competent.

Aim for:
- smooth navigation
- obvious world bounds
- clear workspace focus
- legible overlays
- helpful status readouts
- no clutter

Avoid:
- flashy placeholder effects
- overly bright noisy grids
- awkward laggy drag behavior
- an empty void with no spatial cues

This is the foundation of a creative tool.

---

## Acceptance criteria
This prompt is complete when:

- the workspace contains a real Pixi-backed render surface
- the canvas resizes cleanly with the layout
- pan and zoom work smoothly
- document/world coordinates are clearly modeled
- screen-to-world and world-to-screen conversion utilities exist
- world bounds are visible
- a chunk/tile-aware foundation exists
- visible chunk computation is possible
- the status bar reflects live zoom/coordinate info
- top-bar view actions are wired if present
- the architecture is ready for later layer/tool prompts
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- chunk debug overlay toggle
- grid/guides toggle
- mini navigator placeholder overlay
- fit-to-selection placeholder helper stub
- subtle equirectangular seam indicator

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- real world canvas integration
- Pixi renderer/stage foundation
- camera/view model
- pan/zoom controls
- document/world coordinate helpers
- chunk/tile-aware spatial foundation
- status/view integration
- updated `STATUS.md`

---

## Definition of done note
After this prompt, a person opening the app should feel like they are looking at the beginning of a real large-scale map editor.

They should be able to move around the world stage, understand where the world lives, and see that the system is being built for scale.

That is the bar.
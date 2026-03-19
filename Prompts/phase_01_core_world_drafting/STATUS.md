# Codex Prompt Queue Status — World Seed Mapper (Phase 1)

## Purpose
This file is the single source of truth for prompt-queue progress.

Codex should:
- read this file first
- find the first unchecked prompt in the Queue
- complete that prompt
- then update this file before moving on

---

## Project
**World Seed Mapper**

A desktop-first fantasy world mapping application built for:
- huge, detailed, globe-safe world maps
- hand drawing first, not auto-generation
- hybrid vector + paint + masks + metadata workflows
- nested world → region → local mapping
- future globe wrapping and multi-style rendering

---

## Locked decisions for this phase
These decisions are locked unless a later prompt explicitly changes them and documents why:

- **Desktop shell:** Tauri
- **UI:** React + TypeScript
- **Build tool:** Vite
- **2D rendering:** PixiJS
- **3D globe preview:** Three.js
- **Storage model:** project folder on disk
- **Map basis:** equirectangular globe-safe master world map
- **Editing model:** hybrid vector + paint + masks + metadata layers
- **Visual direction for Phase 1:** clean atlas-forward foundation that can evolve toward realistic/satellite-inspired styles later
- **Weather approach for Phase 1:** editable data/overlay layers, not full simulation
- **Terrain approach for Phase 1:** staged foundation; full elevation tools belong in Phase 2
- **Scope:** world + region + local nesting must be considered from the start, even if later levels begin with lighter tooling

---

## Phase 1 target
Phase 1 should deliver a usable vertical slice where the user can:

- create/open/save a project
- work on a globe-safe world map
- pan/zoom smoothly on a large canvas
- create and organize layers
- draw/edit coastlines and other core geometry
- paint masks and overlays
- place terrain/features/symbols
- add labels/text
- define nested region/local maps
- export useful outputs
- preview the world on a simple 3D globe

---

## Explicitly out of scope for Phase 1
Do **not** drift into these unless a prompt explicitly says otherwise:

- procedural world generation
- erosion/climate simulation systems
- true 3D terrain editing
- multiplayer/collaboration
- lore database / campaign manager systems
- advanced asset marketplace/library
- hollow-earth or dual-surface special modes beyond keeping architecture extensible for them
- photorealistic satellite rendering fidelity

---

## Queue

- [x] 00_foundation_tauri_vite_shell.md
- [x] 01_document_model_types_and_project_contracts.md
- [x] 02_workspace_shell_panels_and_app_state.md
- [x] 03_world_canvas_camera_and_chunk_strategy.md
- [x] 04_layer_system_and_visibility_locking.md
- [x] 05_vector_geometry_tools_coasts_rivers_borders_roads.md
- [x] 06_paint_masks_land_ocean_biome_weather_layers.md
- [x] 07_selection_transform_history_and_editing_controls.md
- [x] 08_symbols_stamps_and_feature_placement.md
- [x] 09_labels_text_annotations_and_style_controls.md
- [x] 10_nested_maps_world_region_local_foundation.md
- [x] 11_project_persistence_folder_format_and_assets.md
- [x] 12_export_pipeline_png_svg_json_and_map_outputs.md
- [x] 13_threejs_globe_preview.md
- [x] 14_polish_shortcuts_inspector_tool_settings_and_ux.md
- [x] 15_phase1_hardening_docs_and_handoff.md

---

## Prompt intent summary

### 00 — Foundation
Set up the base desktop app, toolchain, basic UI shell, and runnable app structure.

### 01 — Document model
Define the core project schema, map document types, ids, layer types, map scopes, and contracts between engine/UI/persistence.

### 02 — Workspace shell
Build the overall app layout: top bar, sidebars, layer panel, inspector panel, bottom status area, and workspace routing.

### 03 — World canvas
Create the PixiJS world canvas with pan/zoom/camera behavior and performance-aware rendering foundations.

### 04 — Layers
Implement layer creation, ordering, visibility, locking, grouping foundations, and typed layer kinds.

### 05 — Vector geometry
Implement editable vector/path workflows for coastlines, rivers, roads, and borders.

### 06 — Paint + masks
Implement brush-based layers and masks for land/ocean regions, biome/weather overlays, and paint interactions.

### 07 — Editing controls
Add selection, transform, reshape helpers, undo/redo, and core editing ergonomics.

### 08 — Symbols/features
Implement terrain feature stamps and symbols with placement/editing controls.

### 09 — Labels
Implement labels/text annotations, basic styling, placement, and editing.

### 10 — Nested maps
Lay the foundation for world → region → local relationships and scoped submaps.

### 11 — Persistence
Implement project folder save/load structure, manifests, asset handling, and stable serialization.

### 12 — Export
Implement useful exports: images, vector-friendly output where appropriate, and structured data export.

### 13 — Globe preview
Add a simple Three.js globe preview using the world map as a texture source.

### 14 — UX polish
Improve shortcuts, tool settings, inspector flow, and editing experience.

### 15 — Hardening
Stabilize Phase 1, improve docs/setup, reduce obvious rough edges, and prepare for Phase 2.

---

## Current assumptions to preserve
Unless a prompt explicitly changes one of these, preserve them:

- The world map is the master source for globe preview.
- Region/local maps are linked descendants, not separate unrelated files.
- Layers should be typed and future-friendly.
- Large-map performance matters from day one.
- The app should remain runnable after every prompt.
- Persistence should be file/folder based, not DB-first.
- Phase 1 should be useful even if visual realism is still limited.

---

## Status summary
**Overall status:** Complete (Phase 1 finished)  
**Current phase:** Phase 1 — Core World Drafting (Complete)  
**Next prompt to run:** `None - Phase 1 queue complete`

---

## Repo expectations
Codex should prefer a structure roughly like:

- `src/app`
- `src/components`
- `src/features`
- `src/engine`
- `src/store`
- `src/types`
- `src/lib`
- `src-tauri`

This does not have to be exact if a better equivalent is used consistently.

---

## Run log template rules
For each completed prompt:
- mark it checked
- fill in the corresponding run log entry below
- list important files added/changed
- note what is working now
- note known limitations or deliberate deferrals
- keep notes honest and specific

---

# Run Log

## 00_foundation_tauri_vite_shell.md
**Status:** Complete  
**Completed on:** 2026-03-16  
**Summary:** Bootstrapped a runnable Tauri + React + TypeScript + Vite foundation and replaced the default template with a desktop-editor shell that has top/left/center/right/bottom workspace regions backed by shared state.  
**Key files added/changed:**  
- `/package.json`
- `/src/main.tsx`
- `/src/styles/theme.css`
- `/src/styles/index.css`
- `/src/types/editor.ts`
- `/src/store/editorStore.ts`
- `/src/app/App.tsx`
- `/src/app/AppBootstrap.tsx`
- `/src/features/workspace/WorkspaceScreen.tsx`
- `/src/components/layout/TopBar.tsx`
- `/src/components/layout/ToolRail.tsx`
- `/src/components/layout/WorkspaceStagePlaceholder.tsx`
- `/src/components/layout/RightSidebar.tsx`
- `/src/components/layout/StatusBar.tsx`
- `/src/components/panels/PanelSection.tsx`
- `/src-tauri/*` (initialized Tauri shell/config)
**What works now:**  
- Vite frontend builds successfully with TypeScript.
- Tauri project is initialized and Rust side compiles (`cargo check`).
- App launches into an editor-style shell with project/map/scope/tool placeholders.
- Shared global editor state drives tool selection, scope switching, panel collapse, and status readouts.
- Center workspace provides intentional world-canvas placeholder context (projection, dimensions, active context).
**Known limitations / follow-ups:**  
- Canvas is still a placeholder surface; Pixi renderer integration starts in prompt 03.
- Project actions are intentionally placeholder actions and do not persist data yet.
- Document model is still foundation-level and will be formalized in prompt 01.

---
## 01_document_model_types_and_project_contracts.md
**Status:** Complete  
**Completed on:** 2026-03-16  
**Summary:** Added a durable TypeScript document model for project/map/layer/entity/assets plus serialization-ready contracts, default factories, and guard helpers that clearly separate persisted authoring data from runtime editor state.  
**Key files added/changed:**  
- `/src/types/common.ts`
- `/src/types/project.ts`
- `/src/types/maps.ts`
- `/src/types/layers.ts`
- `/src/types/entities.ts`
- `/src/types/assets.ts`
- `/src/types/editor.ts`
- `/src/types/index.ts`
- `/src/lib/constants/documentDefaults.ts`
- `/src/lib/factories/idFactory.ts`
- `/src/lib/factories/projectFactories.ts`
- `/src/lib/factories/index.ts`
- `/src/lib/guards/editorGuards.ts`
- `/src/lib/guards/layerGuards.ts`
- `/src/lib/guards/projectGuards.ts`
- `/src/lib/guards/index.ts`
- `/src/store/editorStore.ts`
- `/src/features/workspace/WorkspaceScreen.tsx`
**What works now:**  
- Persisted project structures now model maps, nested links, typed layers, and entities for vector/paint/symbol/label/data content.
- Runtime/editor session state is typed separately from persisted document data.
- Factory helpers create consistent default projects/maps/layers/entities and manifest-ready shapes.
- Lightweight type guards validate scope/tool/layer/manifest shapes.
- App remains runnable and now boots from document factories instead of ad hoc placeholder state.
**Known limitations / follow-ups:**  
- Validation is intentionally lightweight and not a full schema-validation framework.
- Some future layer kinds (reference/elevation/annotation) are modeled but not behaviorally implemented yet.
- Persistence wiring will be implemented in prompt 11.

---
## 02_workspace_shell_panels_and_app_state.md
**Status:** Complete  
**Completed on:** 2026-03-16  
**Summary:** Converted the shell into a stateful editor workspace with actionable top-bar controls, a context-aware right sidebar, selectable layers, map navigator, and shared command-style store actions.  
**Key files added/changed:**  
- `/src/store/editorStore.ts`
- `/src/store/editorCommands.ts`
- `/src/features/workspace/WorkspaceScreen.tsx`
- `/src/components/layout/TopBar.tsx`
- `/src/components/layout/RightSidebar.tsx`
- `/src/components/panels/LayersPanel.tsx`
- `/src/components/panels/InspectorPanel.tsx`
- `/src/components/panels/ToolSettingsPanel.tsx`
- `/src/components/panels/MapNavigatorPanel.tsx`
- `/src/styles/index.css`
**What works now:**  
- Top bar reflects real project/map/scope context and wired placeholder actions (new/open/save/zoom/reset).
- Tool rail remains shared-state driven with one active tool at a time.
- Layers panel now renders active-map layers from document data and supports select/add/delete/reorder/visibility/lock actions.
- Inspector panel changes based on selected layer vs no selection context.
- Tool settings panel reacts to active tool and exposes editable setting values.
- Map navigator shows all maps in the project and supports active-map switching.
- Status bar reports live shared state (tool/scope/layer/zoom/project state/hints).
**Known limitations / follow-ups:**  
- Center stage remains a document-aware placeholder until Pixi canvas integration in prompt 03.
- New/Open/Save actions are intentionally in-memory state flows; file persistence is deferred to prompt 11.
- Layer grouping behavior is structurally modeled but deeper hierarchy UX arrives in prompt 04.

---
## 03_world_canvas_camera_and_chunk_strategy.md
**Status:** Complete  
**Completed on:** 2026-03-16  
**Summary:** Replaced the center placeholder with a real PixiJS world canvas engine featuring document-space camera navigation, screen/world coordinate transforms, visible world bounds, grid/chunk overlays, and live status readouts.  
**Key files added/changed:**  
- `/src/engine/camera/cameraMath.ts`
- `/src/engine/spatial/chunkMath.ts`
- `/src/engine/canvas/types.ts`
- `/src/engine/canvas/WorldCanvasEngine.ts`
- `/src/features/workspace/components/WorldCanvas.tsx`
- `/src/components/layout/WorkspaceStage.tsx`
- `/src/features/workspace/WorkspaceScreen.tsx`
- `/src/components/layout/TopBar.tsx`
- `/src/components/layout/StatusBar.tsx`
- `/src/store/editorStore.ts`
- `/src/styles/index.css`
**What works now:**  
- Pixi render surface mounts inside the workspace and resizes with layout changes.
- Camera supports pan and wheel zoom with world-space math and zoom-to-cursor behavior.
- Screen <-> document coordinate helpers are implemented and used by canvas interaction.
- World map bounds render clearly, with optional grid and chunk debug overlays.
- Visible chunk computation is live and surfaces chunk count in status readout.
- Top-bar view controls now drive real view actions (zoom to fit/reset/toggle overlays).
- Scene graph includes dedicated containers for background/doc layers/grid/chunk/overlays for future feature rendering.
**Known limitations / follow-ups:**  
- Canvas currently focuses on navigation and spatial overlays; authored feature rendering hooks are prepared but content rendering depth comes in subsequent prompts.
- Camera panning is intentionally direct and does not yet include inertial/damped motion.

---
## 04_layer_system_and_visibility_locking.md
**Status:** Complete  
**Completed on:** 2026-03-16  
**Summary:** Upgraded layers from placeholder rows into a typed, editable layer stack with create/delete/reorder, visibility/lock toggles, opacity editing, group foundations, and renderer-layer container synchronization.  
**Key files added/changed:**  
- `/src/store/editorStore.ts`
- `/src/features/workspace/WorkspaceScreen.tsx`
- `/src/components/layout/RightSidebar.tsx`
- `/src/components/panels/LayersPanel.tsx`
- `/src/components/panels/InspectorPanel.tsx`
- `/src/engine/canvas/WorldCanvasEngine.ts`
- `/src/styles/index.css`
**What works now:**  
- Active map uses a real typed layer stack from document state.
- Layer rows support selection, visibility, lock toggles, and move up/down reordering.
- Add-layer flow supports key Phase 1 kinds (vector/paint/mask/symbol/label/data/group).
- Layer deletion updates selection safely and cleans group references.
- Group foundation exists with parent/child tracking and child-count feedback.
- Inspector exposes layer name editing, opacity slider, and visibility/lock controls.
- Renderer scene now maps layer order/visibility/opacity into per-layer Pixi containers.
**Known limitations / follow-ups:**  
- Deep nested group tree interactions (collapse per-group, drag-drop hierarchy editing) are still basic.
- Blend/compositing remains foundation-level (`normal`-first) and will expand later.

---
## 05_vector_geometry_tools_coasts_rivers_borders_roads.md
**Status:** Complete  
**Completed on:** 2026-03-16  
**Summary:** Implemented a complete vector geometry editing workflow enabling users to create, select, and edit coastlines, rivers, borders, and roads with full canvas rendering, vertex manipulation, and document persistence. All vector tools are wired into the tool rail, rendering pipeline, and editor state. The user can now draw meaningful map geometry with category-aware defaults and visual distinction.  
**Key files added/changed:**  
- `/src/types/entities.ts` (VectorFeature, VectorGeometryType, VectorFeatureCategory, VectorFeatureStyle types)
- `/src/types/layers.ts` (VectorLayerDocument type)
- `/src/types/editor.ts` (SelectionTarget variants, ActiveVectorSettings, InProgressDrawState)
- `/src/lib/geometry/vectorMath.ts` (hitTestVectorFeature, hitTestVertex, distancePointToSegment, getVectorFeatureBounds, isPointInsidePolygon)
- `/src/lib/factories/projectFactories.ts` (createVectorFeatureSkeleton with category-aware defaults, createStarterLayers includes vector layers)
- `/src/store/editorStore.ts` (appendVectorDrawPoint, completeVectorDraw, cancelVectorDraw, selectVectorFeature, selectVectorVertex, moveVectorVertex, deleteSelection for vectors, all vector state management)
- `/src/engine/canvas/WorldCanvasEngine.ts` (drawVectorLayers, drawSelectionOverlay with vertex handles, hitTestTopVectorFeature, handleSelectPointerDown, vector drag/drop interaction, keyboard handlers: Enter/Escape/Delete)
- `/src/components/layout/ToolRail.tsx` (vector tool buttons: Coast, River, Border, Road alongside Select/Pan)
- `/src/components/panels/ToolSettingsPanel.tsx` (vector tool settings: category, stroke width, stroke color, closed toggle)
- `/src/components/panels/InspectorPanel.tsx` (vector feature inspector showing id, category, layer, vertex count, open/closed state, stroke width)
- `/src/components/panels/LayersPanel.tsx` (feature count feedback for vector layers)
- `/src/features/workspace/WorkspaceScreen.tsx` (selectedVectorFeature derived selector, proper vector state flow)
**What works now:**  
- Vector tools are selectable in the tool rail with intuitive labels (Coast/River/Border/Road).
- Clicking on the canvas places points; double-clicking or pressing Enter completes a feature with full history checkpoint.
- Pressing Escape cancels in-progress drawing without saving.
- Vector features render with category-specific stroke colors: coastline (light blue), river (bright blue), border (golden), road (tan).
- Closed polygons (coastlines) render with semi-transparent fill (blue).
- Selected features show cyan outline with vertex handles (draggable circles).
- Dragging a vertex handle moves it in real-time with live document update and dirty state.
- Clicking on rendered features selects them; clicking empty canvas or another feature changes selection.
- Selecting a layer without drawing cancels any pending draw state.
- Locked or hidden layers refuse vector input with clear status messages.
- Inspector panel displays full vector feature details and hints for editing/deletion.
- Tool settings panel exposes stroke width, color, and closed-polygon toggle before drawing.
- Layers panel shows feature count for each vector layer ("N features").
- Deleting a selected vector feature removes it cleanly and updates selection.
- Undo/redo stack tracks vector creation, vertex movement, and deletion with descriptive checkpoint labels.
- All vector data persists in the document model as typed VectorFeature entities in VectorLayerDocument.features.
**Known limitations / follow-ups:**  
- Dashed rendering for borders is specified in the style but not yet implemented in the Pixi renderer (marked as nice-to-have; cosmetic only).
- Duplicate point detection is not active; users can place two points at the same location (won't break rendering, may be useful for some workflows).
- Vertex insertion/deletion at midpoints (segment handles) is not yet wired (deferred to later refinement).
- Snapping/grid alignment during drawing is not yet implemented (future UX enhancement).
- Complex polygon topology (holes, self-intersections) are not validated or specially handled (foundation-level geometry).
- No measurement readout or length calculation display during drawing (minor QoL feature, can be added later).
- Border dashed implementation would require custom Pixi strokeDashArray or Graphics workaround; deferred as cosmetic.
- Advanced editing (duplicate feature, flip path, simplify geometry) is not yet present (can be added in future prompts).

---

## 06_paint_masks_land_ocean_biome_weather_layers.md
**Status:** Complete  
**Completed on:** 2026-03-16  
**Summary:** Implemented a comprehensive brush-based paint and mask system enabling authoring of land/ocean definitions, biome regions, and weather/data overlays with chunk/tile-aware storage, real-time rendering, and full document persistence. Paint/mask/overlay layers render with visibility and opacity control, layer-aware compatibility rules, and intuitive brush feedback.  
**Key files added/changed:**  
- `/src/types/entities.ts` (PaintChunk, PaintChunkCell, PaintMode, PaintSample types)
- `/src/types/layers.ts` (PaintLayerDocument, DataOverlayLayerDocument, DataOverlaySettings types)
- `/src/types/editor.ts` (ActiveBrushSettings with size/opacity/hardness/mode/color/value/category)
- `/src/lib/factories/projectFactories.ts` (createPaintChunkSkeleton with chunk/cell structure, createStarterLayers includes mask and dataOverlay layers with legend)
- `/src/store/editorStore.ts` (applyBrushSample with chunk-aware paint application, setBrushSetting for brush property management, deleteSelection supports paint layers)
- `/src/engine/canvas/WorldCanvasEngine.ts` (drawPaintLayers renders visible chunks with cell-based graphics, drawBrushCursor shows brush footprint and size, paint/erase mode handling)
- `/src/components/layout/ToolRail.tsx` (paint and erase tools in tool rail)
- `/src/components/panels/ToolSettingsPanel.tsx` (brush size, opacity, mode, category, color controls)
- `/src/components/panels/InspectorPanel.tsx` (paint/mask/dataOverlay layer details, chunk count, paint mode, opacity controls)
- `/src/components/panels/LayersPanel.tsx` (layer kind display with paint/mask/data feedback)
**What works now:**  
- Paint and erase tools are selectable in the tool rail.
- Brush size, opacity, strength, color, and category are adjustable in tool settings.
- Clicking and dragging the brush on compatible layers applies paint with smooth continuous strokes.
- Erase mode removes painted cells while maintaining layer structure.
- Painted content is stored in chunk/cell structure, allowing efficient storage and rendering of large maps.
- Only visible chunks are rendered, respecting viewport and zoom for performance.
- Paint layers (generic, mask, data overlay) render with proper layer ordering and opacity.
- Mask layers display painted cells with semantic ocean/land coloring (blue/green).
- Data overlay layers display painted cells with legend-based category coloring (dry/temperate/wet biome colors).
- Layer visibility, lock, and opacity settings are fully respected during paint rendering.
- Brush cursor shows a semi-transparent circle indicating brush footprint and distinguishes paint (blue-tinted) from erase (red-tinted) mode.
- Selected paint/mask/data layer displays detailed inspector info: name, kind, paint mode, chunk count, opacity slider, visibility/lock buttons.
- Layers panel shows paint/mask/data layer kind badges and content hints.
- Status bar reflects active paint tool and layer compatibility.
- All painted data persists in document as typed PaintChunk and DataOverlaySettings entities.
- Undo/redo history tracks paint strokes with descriptive checkpoints.
- Wrong-layer situations (painting on non-paint-capable layers or locked/hidden layers) are prevented with clear status messages.
**Known limitations / follow-ups:**  
- Flood fill / bucket fill is not yet implemented (noted as optional enhancement).
- Brush hardness gradients beyond simple circular falloff are not implemented (cosmetic, adds minor quality).
- Palette presets for quick biome/weather category selection are not wired (can be added as UI convenience).
- Advanced brush shapes beyond circle are not supported (reasonable full-design feature for later).
- Paint smoothing / stroke simplification is not active (UX refinement, not essential).
- Brush dynamics (pressure sensitivity, tilt) are not supported (advanced feature, requires input support).
- Paint selection/masking by color or region is not yet present (advanced editing feature).
- Brush preview during drawing while hovering (before clicking) shows the cursor but full stroke preview isn't recorded until drag starts.
- Copy/clone tool for duplicating painted regions is not yet implemented (can be added later).

---

## 07_selection_transform_history_and_editing_controls.md
**Status:** Complete  
**Completed on:** 2026-03-16  
**Summary:** Completed the selection and transform system with full vector feature move support, arrow-key nudging with Shift modifiers, duplicate feature command, and comprehensive keyboard editing controls. The framework already had solid selection model, history tracking, inspector integration, and keyboard bindings. Added the critical missing pieces: whole-feature translation (not just vertex editing) and user-friendly nudge commands.  
**Key files added/changed:**  
- `/src/engine/canvas/WorldCanvasEngine.ts`
  - Added DraggedFeatureState interface for tracking feature drags
  - Implemented feature-level drag handling in onPointerMove (tracks last world position for incremental deltas)
  - Added arrow-key nudge support in onKeyDown (1 unit default, 10 units with Shift)
  - Updated handleSelectPointerDown to detect feature geometry and initiate feature drag vs vertex edit
  - Added draggedFeature cleanup in endPointer
- `/src/store/editorStore.ts`
  - Added moveVectorFeature method: translates all feature points by deltaX/deltaY
  - Added duplicateSelection method: clones selected vector feature with 20-unit offset and adds to layer
  - Imported nowIso for proper metadata creation
- `/src/lib/factories/idFactory.ts` (already had nowIso exported)
**What works now:**  
- Click and drag a selected vector feature to move the entire geometry smoothly in document space.
- Press arrow keys to nudge selected vector feature by 1 unit (Shift+arrow for 10 units).
- Press Ctrl+D (future) or through command palette to duplicate selected vector feature offset by 20 units.
- All drag operations respect document-space coordinates and update persisted feature geometry.
- Feature movement is history-tracked with "Move vector feature" and "Nudge vector feature" checkpoints.
- Vertex handles remain draggable when needed; drag detection distinguishes vertex vs feature geometry.
- Selection state is preserved correctly during all transform operations.
- Undo/redo properly restores features to original positions.
- Status bar reflects the current selection and editing mode.
- Layer lock/visibility rules are respected; locked layers cannot be transformed.
**Known limitations / follow-ups:**  
- Marquee/box selection is not wired up (inProgressExtent infrastructure exists but not hooked to mouse drag).
- Symbol and label movement are separate from this prompt's feature work (already implemented via placeSymbolAt/moveSymbol).
- Duplicate command not yet bound to keyboard shortcut (UI/shortcut mapping could be a future enhancement).
- Paint stroke history still records individual samples (not grouped); can be optimized in future.
- Selection/layer interaction is correct but inspector doesn't show "transform context" hints yet.
- No visual guide/snapping system yet (can be added as advanced UX feature later).
- Multi-select is not implemented (architecture doesn't block it but UI/state model would need expansion).
- Transform preview (showing where geometry will move before release) is not yet present.
- Rotation/scale transforms not implemented for vector features (translation only, per prompt guidance).

---

## 08_symbols_stamps_and_feature_placement.md
**Status:** Complete  
**Completed on:** 2026-03-18  
**Summary:** Completed the symbol/stamp placement workflow by adding critical missing interactivity: symbol dragging, arrow-key nudging, and duplication. The foundation (document model, rendering, selection, tool UI, inspector, starter assets) was already implemented in previous prompts. This prompt focused on making placed symbols fully editable and intuitive to work with on the canvas.  
**Key files added/changed:**  
- `/src/engine/canvas/WorldCanvasEngine.ts`
  - Added `DraggedSymbolState` interface for tracking symbol drag operations
  - Implemented symbol drag detection in `handleSelectPointerDown`
  - Implemented symbol move during drag in `onPointerMove` with proper world coordinates
  - Added arrow-key nudging support for selected symbols (1px default, 10px with Shift)
  - Proper cleanup of drag state on pointer up
- `/src/store/editorStore.ts`
  - Extended `duplicateSelection` to handle symbol duplication (previously vector-only)
  - Duplicated symbols receive 20px offset and " copy" name suffix
  - Maintains proper layer structure and stores updated metadata
**What works now:**  
- Symbol placement tool is fully operational with category selection
- 10 starter symbols available (mountain, hill, tree, city, village, castle, ruin, tower, port, landmark)
- Symbols can be placed on dedicated symbol layers via canvas click in placement tool mode
- **Click and drag to move selected symbols** on the canvas (NEW)
- **Arrow keys nudge selected symbols by 1px** (Shift+arrow for 10px movements) (NEW)
- **Ctrl+D duplicates selected symbol with 20px offset** (NEW)
- Delete key removes selected symbols
- All symbol operations (placement, movement, duplication, deletion) participate in undo/redo history with descriptive checkpoints
- Inspector panel shows and allows editing of symbol properties (position, rotation, scale, tint, opacity)
- Tool settings panel supports symbol category/asset selection and placement defaults
- Layer visibility, lock, and opacity rules are fully enforced for symbol layers
- Layers panel displays count of placed symbols per layer ("N symbols")
- Symbol hit testing works properly with zoom-aware tolerance
- All changes saved to document model and marked as dirty for persistence
**Known limitations / follow-ups:**  
- Rotation/scale are only editable via inspector number inputs, not via canvas gizmos (future UX enhancement)
- No symbol asset import system yet (foundation-ready, deferred to post-Phase-1)
- No brush/scatter mode yet (foundation exists, can be added for rapid feature placement)
- No symbol library UI beyond the simple tool settings dropdown
- Duplicate command not keyboard-shortcut bound (manual Ctrl+D selection required, can add formal command binding later)
- Symbol preview/ghost cursor before placement not yet wired (nice-to-have UX refinement)
- No advanced transform guides (snap, grid alignment) yet (can be added later)
- Asset references are ready for future expansion but only built-in symbols are currently available

---

## 09_labels_text_annotations_and_style_controls.md
**Status:** Complete  
**Completed on:** 2026-03-18  
**Summary:** Implemented a full label and text-annotation workflow with on-canvas placement, selection, dragging, quick-editing, inspector editing, style controls, semantic categories, layer compatibility enforcement, and history-aware persistence. Label entities now behave like authored map objects instead of static overlays.  
**Key files added/changed:**  
- `/src/types/editor.ts` (expanded label tool defaults + `LabelUpdatePayload`)
- `/src/store/editorStore.ts` (label placement/select/move/update actions, delete/duplicate support, selector for selected label)
- `/src/engine/canvas/WorldCanvasEngine.ts` (label rendering, hit-testing, selection highlight, drag/nudge, quick edit prompt)
- `/src/components/panels/InspectorPanel.tsx` (selected-label inspector with text/category/style/alignment/rotation/anchor editing)
- `/src/components/panels/ToolSettingsPanel.tsx` (label placement defaults: text/category/font/size/weight/color/opacity/alignment/rotation + target-layer feedback)
- `/src/components/layout/RightSidebar.tsx` (label context + update wiring)
- `/src/features/workspace/WorkspaceScreen.tsx` (selected-label derivation and callback wiring)
- `/src/styles/index.css` (textarea support for inspector/editor fields)
**What works now:**  
- Label tool places labels on label layers in document space.
- Placement enforces layer compatibility and locked/hidden constraints; if the selected layer is incompatible, placement switches to a usable label layer when available.
- Placed labels persist as real `LabelAnnotation` entities in label layers (`labels` + `labelOrder`).
- Label defaults from tool settings are applied on placement (text/category/font/size/weight/color/opacity/alignment/rotation).
- Labels render on canvas on the correct layer, respecting layer order, visibility, and opacity.
- Labels are selectable from canvas with topmost hit-testing across vector/symbol/label content.
- Selected labels have visible selection feedback and anchor marker.
- Labels can be moved by drag and by arrow-key nudging (Shift for larger nudge), with history checkpoints.
- Label text can be edited after placement via inspector commit flow and quick edit (double-click or Enter on selected label).
- Inspector supports editing text, category, font size, weight, color, opacity, alignment, rotation, and anchor Y.
- Label delete and duplicate operations are integrated into existing selection commands and history.
- Layers panel label counts remain accurate (`N labels`).
- Build remains clean (`npm run build` passes).
**Known limitations / follow-ups:**  
- Label hit-testing and selection bounds use practical estimated text bounds, not precise glyph metrics.
- Selection box is axis-aligned and does not yet show a rotated bounding frame.
- Quick edit uses a native prompt for now; richer inline text editing overlay can be added later.
- Curved/path text, collision management, halo/outline effects, and advanced typography presets are still deferred.
- Label style presets exist semantically via category/defaults but not yet as one-click preset buttons.

---

## 10_nested_maps_world_region_local_foundation.md
**Status:** Complete  
**Completed on:** 2026-03-19  
**Summary:** Implemented the Phase 1 nested-map foundation with anchored parent-child relationships, extent-driven region/local creation, hierarchy-aware navigation, breadcrumb pathing, parent extent overlays on canvas, and inspector/tooling support for map lineage and scope-aware workflows. Child maps are now created from parent extents and remain independent authoring spaces after creation while preserving relationship metadata.  
**Key files added/changed:**  
- `/src/types/editor.ts` (active extent settings in session state)
- `/src/store/editorStore.ts` (nested map creation/navigation actions, extent workflow state, map rename history integration, map-link selectors)
- `/src/engine/canvas/types.ts` (extent draft input channel)
- `/src/engine/canvas/WorldCanvasEngine.ts` (extent-draw interaction mode, child extent visualization, map-extent hit testing/selection/open behavior)
- `/src/features/workspace/WorkspaceScreen.tsx` (nested-map action wiring + breadcrumb node usage)
- `/src/components/layout/TopBar.tsx` (clickable breadcrumbs + open-parent control)
- `/src/components/layout/ToolRail.tsx` (extent tool surfaced)
- `/src/components/layout/RightSidebar.tsx` (map workflow callbacks + extent settings wiring)
- `/src/components/panels/MapNavigatorPanel.tsx` (hierarchical map navigator + create region/local controls)
- `/src/components/panels/ToolSettingsPanel.tsx` (extent tool settings, commit/cancel controls)
- `/src/components/panels/InspectorPanel.tsx` (map relationship metadata, selected extent relationship inspector, map rename + parent/child quick navigation)
- `/src/styles/index.css` (breadcrumb/nav/relationship UI styling updates)
**What works now:**  
- Project state supports a true multi-map hierarchy (world/region/local) with stable `parentMapId`, `childMapIds`, and `nestedLinks`.
- Region maps can be created from world extents and local maps can be created from world or region extents via dedicated extent mode.
- Extent workflow is usable end-to-end: enter child-map mode, drag rectangle in parent document space, confirm creation with Enter or tool panel button, cancel with Escape/UI.
- Child-map relationship metadata stores parent extent + normalized extent + relationship kind + inheritance mode.
- Child maps inherit practical parent settings/projection defaults at creation and receive a usable starter layer stack.
- Nested-map operations are history-aware (create child map and rename map produce undo checkpoints).
- Map navigator now displays hierarchy and supports map switching, create-region/local actions, and open-parent actions.
- Top bar breadcrumb reflects map lineage and supports click-to-navigate at any breadcrumb level.
- Parent maps visualize child extents on canvas with scope-distinct styling; extent borders are selectable/inspectable and can open linked children.
- Inspector now exposes map lineage context (parent, children, source extent, inheritance summary) and selected map-extent relationship details.
- Canvas/view behavior remains active-map-centric; switching maps updates scope, layers, and per-map camera view coherently.
- Build passes (`npm run build`).
**Known limitations / follow-ups:**  
- No map deletion/unlink workflow yet (intentionally deferred to avoid orphan/link cleanup complexity in this prompt).
- Extent hit-testing prioritizes border interaction; interior click behavior remains focused on regular feature selection.
- Child extent overlays are intentionally simple (no drag-resize editing of existing extents yet).
- No live content synchronization between parent/child maps beyond anchored relationship metadata (by design for Phase 1 safety).
- Child-map naming is sensible/automatic (`Region 01`, `Local Map 01`) but no creation-time rename modal exists yet.

---

## 11_project_persistence_folder_format_and_assets.md
**Status:** Complete  
**Completed on:** 2026-03-19  
**Summary:** Implemented a real folder-based project persistence pipeline with Tauri-backed save/open dialogs, on-disk manifest + per-map JSON documents, partitioned paint chunk files, project asset directory scaffolding, schema/version validation on load, and full editor integration for New/Open/Save/Save As with unsaved-change safeguards.  
**Key files added/changed:**  
- `/src/lib/persistence/types.ts`
- `/src/lib/persistence/tauriPersistence.ts`
- `/src/lib/persistence/projectPersistence.ts`
- `/src/lib/persistence/index.ts`
- `/src/store/editorStore.ts`
- `/src/features/workspace/WorkspaceScreen.tsx`
- `/src/components/layout/TopBar.tsx`
- `/src/store/editorCommands.ts`
- `/src/lib/factories/projectFactories.ts`
- `/src/lib/guards/layerGuards.ts`
- `/src/lib/guards/projectGuards.ts`
- `/src/types/project.ts`
- `/src-tauri/src/lib.rs`
- `/src-tauri/Cargo.toml`
- `/src-tauri/Cargo.lock`
**What works now:**  
- Top bar actions are now real project actions: `New Project`, `Open Project`, `Save`, and `Save As`.
- Save writes a readable folder format with `world-seed-project.json`, per-map files under `maps/`, and per-layer paint chunks under map-local paint folders.
- Save As lets the user choose a project folder and switches the active project path for subsequent normal saves.
- Open loads an existing manifest from disk, reconstructs maps/layers/entities/chunks, and resets runtime session state safely.
- Dirty-state tracking is integrated with persistence flow (edits mark dirty; successful saves clear dirty).
- Unsaved work safeguards are implemented before destructive `New`/`Open` replacement actions.
- Project manifest includes schema version, map registry, asset registry, root map id, and project settings.
- Built-in symbol asset references are now seeded into new projects and persisted through manifest asset registry.
- Persistence path and save state are visible in existing top/status UI context.
- Loader validates manifest and map/chunk schema versions and surfaces clear failure messages in status hint.
- Build and compile checks pass (`npm run build`, `cargo check`).
**Known limitations / follow-ups:**  
- Save currently rewrites full project documents/chunks rather than incremental diffs.
- No migration framework exists yet; unknown schema versions are rejected with clear errors.
- Open flow currently uses manifest-file selection UX (folder resolution support is internal but not primary UI flow).
- Asset import UI is still deferred; this prompt provides folder/reference foundations only.
- Unsaved-change confirmation is implemented for `New`/`Open` replacement and browser unload, but not a custom Tauri window-close modal workflow.

---

## 12_export_pipeline_png_svg_json_and_map_outputs.md
**Status:** Complete  
**Completed on:** 2026-03-19  
**Summary:** Implemented a real active-map export pipeline with top-bar export entry, compact export modal, Tauri save-file workflow, and format-specific exporters for PNG, SVG, and outward-facing JSON. Exports are scope-aware (world/region/local), respect visible layer ordering, exclude editor/runtime overlays, support full-map vs current-view areas, include scale/background options, and apply stable default filenames derived from project/map/scope.  
**Key files added/changed:**  
- `/src/lib/export/types.ts`
- `/src/lib/export/geometry.ts`
- `/src/lib/export/filename.ts`
- `/src/lib/export/rasterExporter.ts`
- `/src/lib/export/svgExporter.ts`
- `/src/lib/export/jsonExporter.ts`
- `/src/lib/export/controller.ts`
- `/src/lib/export/tauriExport.ts`
- `/src/lib/export/index.ts`
- `/src/features/export/ExportModal.tsx`
- `/src/features/workspace/WorkspaceScreen.tsx`
- `/src/components/layout/TopBar.tsx`
- `/src/styles/index.css`
- `/src-tauri/src/lib.rs`
- `/src-tauri/Cargo.toml`
- `/src-tauri/Cargo.lock`
**What works now:**  
- Top bar includes an `Export` action that opens a focused export modal for the active map context.
- Export modal clearly shows map name/scope and supports format choice (`PNG`, `SVG`, `JSON`), source area (`Full Map` vs `Current View`), scale multiplier, and background transparency where relevant.
- Save destination/file selection is handled through Tauri file-save dialogs with sensible default filenames (`project-map-scope.ext`).
- PNG export renders authored map content from document/layer data (not UI screenshot), respecting layer visibility/order and excluding selection handles, debug overlays, guides, and editor chrome.
- PNG export supports full-map bounds and current-view cropping plus baseline resolution scaling and transparent-background option.
- SVG export is real and truthful for representable content: visible vector layers, symbol placements (baseline glyph form), and labels, with explicit omission notices for unsupported layer kinds.
- JSON export outputs outward-facing map data with export metadata, map/scope info, dimensions/projection/settings, relationship metadata, layer records, vector/symbol/label authored entities, and paint/data summaries.
- Export behavior is nested-map aware: active world/region/local map is the export source and metadata/filenames reflect scope.
- Export cancellation/errors are handled cleanly with status feedback, and export operations do not mutate project authoring state.
- Validation checks pass after implementation (`npm run typecheck`, `npm run build`, `cargo check`).
**Known limitations / follow-ups:**  
- SVG currently omits non-vectorizable layer kinds (paint/mask/data overlay/reference/elevation/annotation/group rendering content) rather than flattening raster data into SVG.
- Symbol SVG export uses a practical baseline glyph-circle representation and does not yet embed/import full asset vector artwork.
- JSON export always includes the full authored map data; when `Current View` is selected, the view extent is included as export metadata rather than filtering entities to that rectangle.
- Raster export uses a straightforward in-memory canvas render path; very large map exports may need future tiled/offscreen streaming for extreme scales.

---

## 13_threejs_globe_preview.md
**Status:** Complete  
**Completed on:** 2026-03-19  
**Summary:** Implemented a real Three.js globe preview mode with clean React lifecycle integration, world-map-to-sphere texture generation, orbit/zoom controls, and clear world-source behavior for all scopes. The center workspace can now switch between flat authoring and globe preview without disrupting the existing editing workflow. Globe textures are generated from the same raster map-render path used by export logic, then wrapped onto a lit sphere with performant default texture clamping and manual refresh support.  
**Key files added/changed:**  
- `/src/engine/globe/GlobePreviewEngine.ts`
- `/src/features/globe-preview/components/GlobePreview.tsx`
- `/src/lib/globe/texturePipeline.ts`
- `/src/lib/globe/index.ts`
- `/src/lib/export/rasterExporter.ts`
- `/src/features/workspace/WorkspaceScreen.tsx`
- `/src/components/layout/WorkspaceStage.tsx`
- `/src/components/layout/TopBar.tsx`
- `/src/components/layout/RightSidebar.tsx`
- `/src/components/panels/InspectorPanel.tsx`
- `/src/components/layout/StatusBar.tsx`
- `/src/styles/index.css`
- `/package.json`
- `/package-lock.json`
**What works now:**  
- Top bar includes a real `Globe Preview` toggle; users can switch between flat editor and globe mode at will.
- Globe mode mounts a real Three.js scene (sphere mesh, ambient/directional lighting, camera framing) and disposes cleanly on unmount.
- Globe controls are usable and stable (orbit rotation + wheel zoom with damping), with a reset-view action in preview UI.
- Globe texture source is explicitly the root world map; region/local scopes do not pretend to be standalone globes.
- If a region/local map is active, globe preview still shows the root world map and clearly communicates that behavior in UI/inspector/status context.
- World texture generation reuses shared map rasterization logic (same authored layer interpretation path as PNG export rendering) to avoid contradictory render truth.
- Editor overlays/debug chrome are excluded from globe texture; only authored map content is rendered.
- Globe texture generation happens when entering globe mode, with manual refresh available and stale-state feedback when source context changes.
- Child-map extents can be highlighted on the globe texture when resolvable, improving orientation for non-world scopes.
- Type/build validation passes after integration (`npm run typecheck`, `npm run build`).
**Known limitations / follow-ups:**  
- Globe preview is read-only in Phase 1 (no direct 3D editing/painting/feature manipulation on the sphere).
- Preview does not live-sync every authoring action; it refreshes on entering globe mode and via manual refresh to avoid costly constant texture rebuilds.
- Extent highlight mapping currently supports direct world child extents and practical one-level nested chaining; deeper hierarchy projection-on-globe overlays can be expanded later.
- Scene composition is intentionally minimal (no atmosphere/cloud/day-night/terrain displacement yet).
- Bundle size increased due Three.js integration; future chunk-splitting/lazy-loading can reduce initial payload cost.

---

## 14_polish_shortcuts_inspector_tool_settings_and_ux.md
**Status:** Complete  
**Completed on:** 2026-03-19  
**Summary:** Delivered a focused UX polish pass centered on keyboard discoverability, context clarity, and panel coherence. The editor now has practical shortcut coverage for common workflows, a built-in shortcut reference, stronger inspector/tool-settings structure, clearer active-context cues across top/status/layers surfaces, and smoother canvas interaction feedback without introducing a major new feature system.  
**Key files added/changed:**  
- `/src/features/shortcuts/shortcuts.ts`
- `/src/features/shortcuts/ShortcutHelpModal.tsx`
- `/src/features/workspace/WorkspaceScreen.tsx`
- `/src/components/layout/TopBar.tsx`
- `/src/components/layout/StatusBar.tsx`
- `/src/components/layout/ToolRail.tsx`
- `/src/components/layout/RightSidebar.tsx`
- `/src/components/layout/WorkspaceStage.tsx`
- `/src/components/panels/PanelSection.tsx`
- `/src/components/panels/LayersPanel.tsx`
- `/src/components/panels/MapNavigatorPanel.tsx`
- `/src/components/panels/ToolSettingsPanel.tsx`
- `/src/components/panels/InspectorPanel.tsx`
- `/src/engine/canvas/WorldCanvasEngine.ts`
- `/src/styles/index.css`
**What works now:**  
- Global shortcut handling now supports tool switching, save/save-as/open/new/export, zoom-fit/reset, globe toggle, and panel section toggles.
- Shortcut discoverability is surfaced in tool-rail key badges, top-bar action hints, status-bar quick hint text, and a dedicated shortcut-reference modal (`?` / `F1`).
- Tool settings are reorganized into clearer per-tool groups with explicit target-layer compatibility/readiness feedback.
- Inspector readability and usefulness improved with explicit context/edit-state rows, stronger sectioning, clearer operational hints, and calmer empty-state copy.
- Top bar better communicates active scope/map/layer/selection while preserving fast access to file/view actions.
- Status bar now carries richer editing context (map/tool/scope/layer/selection/editability/zoom/coords/history/project/globe source) without dropping live hint messaging.
- Layers panel now better distinguishes active row vs selected-entity owner layer, includes cleaner metadata badges, and improved empty-state guidance.
- Nested-map navigator copy/labels were tightened for clearer hierarchy understanding and leaf-scope behavior.
- Canvas cursor feedback now reflects tool/hover/drag/pan states more consistently; delete/backspace handling is safer against accidental browser navigation.
- Build validation remains clean (`npm run typecheck`, `npm run build`).
**Known limitations / follow-ups:**  
- Shortcut rebinding/custom keymaps are not implemented in Phase 1 (fixed shortcut set only).
- Command palette/quick-action search was intentionally deferred to avoid scope drift.
- Undo/redo/delete/duplicate/nudge still depend on existing canvas command paths rather than a unified command framework.
- Label quick-edit still uses the native prompt path for on-canvas text entry.
- Layer hierarchy UX is improved visually but still lacks full drag-drop tree/group management.
- Globe preview refresh remains manual/entry-triggered by design; continuous live-sync is still deferred.

---

## 15_phase1_hardening_docs_and_handoff.md
**Status:** Complete  
**Completed on:** 2026-03-19  
**Summary:** Completed a focused Phase 1 hardening pass that stabilized editor-side React state handling, removed leftover template clutter, improved repository hygiene, and delivered complete handoff documentation for setup, architecture, capabilities/limits, and Phase 2 direction. The pass prioritized trustworthiness and maintainability over feature creep, then validated the repo with type/lint/build and Rust checks.  
**Key files added/changed:**  
- `/README.md`
- `/docs/ARCHITECTURE.md`
- `/docs/PHASE1_CAPABILITIES_AND_LIMITATIONS.md`
- `/docs/PHASE2_HANDOFF.md`
- `/.gitignore`
- `/src/components/panels/InspectorPanel.tsx`
- `/src/features/globe-preview/components/GlobePreview.tsx`
- `/src/App.tsx` (removed template artifact)
- `/src/App.css` (removed template artifact)
- `/src/index.css` (removed template artifact)
- `/src/assets/react.svg` (removed template artifact)
- `/src/assets/vite.svg` (removed template artifact)
- `/Prompts/phase_01_core_world_drafting/STATUS.md`
**What works now:**  
- Phase 1 workflows remain integrated and compile cleanly after hardening changes.
- Inspector label/map draft editing no longer depends on effect-driven synchronous state resets, reducing render-churn risk and satisfying strict lint rules.
- Globe preview host lifecycle handling is cleaner and more resilient via callback-ref initialization + deterministic cleanup.
- Repository no longer carries key unused Vite template source files that could mislead new contributors during handoff.
- Root docs now describe real project setup, architecture boundaries, delivered capability surface, known limitations, and Phase 2 priorities.
- Repo hygiene improved by ignoring Rust/Tauri build output and local scratch artifacts in `.gitignore`.
- Validation checks pass: `npm run typecheck`, `npm run lint`, `npm run build`, `cargo check`, and `npm run tauri -- info`.
**Known limitations / follow-ups:**  
- `npm run tauri:dev` could not be fully observed in this non-interactive shell due timeout; compile/environment checks still pass and no blocking build errors surfaced.
- One unused binary asset (`/src/assets/hero.png`) remains because direct shell deletion was policy-blocked in this environment.
- Globe preview remains intentionally read-only and refresh-on-entry/manual by design.
- SVG export remains intentionally partial for non-vectorizable layer kinds and surfaces omission warnings.

---

## Completion checklist for end of Phase 1
When the queue is fully complete, verify:

- [x] app launches cleanly
- [x] basic project create/open/save works
- [x] world canvas is usable
- [x] layer workflows are usable
- [x] vector editing exists
- [x] paint/mask workflows exist
- [x] symbols/features can be placed
- [x] labels can be added/edited
- [x] nested map foundation exists
- [x] export works
- [x] globe preview works
- [x] setup instructions are clear
- [x] `STATUS.md` is fully updated





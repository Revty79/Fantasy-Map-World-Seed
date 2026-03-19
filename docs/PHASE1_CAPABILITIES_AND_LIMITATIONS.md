# Phase 1 Capabilities And Limitations

This is the user-facing truth for what Phase 1 can do today.

## Capabilities

### Core workspace
- Desktop editor shell with top bar, tool rail, central stage, sidebar panels, and status bar.
- Keyboard shortcut coverage for common workflows (tool switching, file actions, view actions, panel toggles, help).

### World canvas
- Pixi-powered large-map canvas with pan and zoom.
- World bounds, optional grid/chunk overlays, and per-map view state.
- Terrain-aware base rendering in multiple elevation display modes.

### Layer system
- Typed layer stack per map.
- Add/delete/reorder layers.
- Visibility, lock, and opacity controls.

### Vector authoring
- Coastline/river/border/road tools.
- Feature selection, vertex editing, and deletion.
- Category-aware default styling.

### Paint and masks
- Brush painting for paint/mask/data overlay style layers.
- Chunk-based paint data persistence model.

### Terrain foundation
- Deterministic seeded terrain generation with editable generator settings.
- Direct terrain sculpting (raise, lower, smooth, flatten).
- Sea-level driven land/water interpretation and derived coastline overlay.
- Contour visualization and contour-preview display mode.
- Derived terrain cache metadata (segment/sample counts + revision tracking).

### Symbols
- Symbol placement on symbol layers.
- Selection, dragging, nudge, rotation, and scale controls.

### Labels
- Label placement and selection.
- Text/category/style edits through inspector controls.
- Drag and keyboard nudge support.

### Nested maps
- World -> region -> local child map creation from drawn extents.
- Breadcrumb/map navigator hierarchy navigation.
- Parent extent visualization and relationship metadata.

### Persistence
- New, Open, Save, Save As project flows.
- Folder-based project format (manifest + maps + chunk data).
- Dirty-state handling and unsaved-change confirmations.

### Export
- PNG export (full map or current view) with terrain-aware raster truth.
- SVG export for representable vector/symbol/label content with explicit terrain omission warnings.
- JSON export for authored map/project data including terrain payload and terrain summaries.

### Globe preview
- Three.js read-only globe preview mode.
- Root world map as terrain-aware texture source.
- Manual refresh plus stale-state feedback.

## Known Limitations

- No direct editing on globe surface (preview only).
- SVG export intentionally omits terrain raster and other non-vectorizable content such as paint/mask raster layers.
- Label quick-edit still uses native prompt-based interaction.
- Layer hierarchy supports foundational grouping but not full drag-drop tree management.
- Persistence currently rewrites full project payloads instead of incremental diffs.
- No schema migration framework yet for unknown future schema versions.
- Terrain/elevation tooling remains foundational and is not yet an advanced erosion/climate simulation stack.
- Weather/climate overlays are editable data layers, not physically simulated systems.
- No direct globe editing or true 3D displacement terrain authoring yet.
- No alternate planetary/world-model abstraction layer yet (rings, multi-body planets, hollow-earth, or other exotic models).
- No multiplayer/collaboration stack in Phase 1.

## What Must Not Regress In Phase 2

- Root world map remains the authoritative globe texture source.
- Nested map relationships remain anchored and serializable.
- Save/open/export flows remain deterministic and schema-versioned.
- Canvas/edit interactions remain responsive on large map dimensions.

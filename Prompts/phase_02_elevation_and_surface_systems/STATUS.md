# Codex Prompt Queue Status — World Seed Mapper (Phase 2)

## Purpose
This file is the single source of truth for the Phase 2 prompt queue.

Codex should:
- read this file first
- find the first unchecked prompt in the Queue
- complete that prompt
- then update this file before moving on

---

## Project
**World Seed Mapper — Phase 2: Elevation and Surface Systems**

Phase 2 expands World Seed Mapper from a strong flat-drafting editor into a true terrain-shaping tool.

The focus of this phase is:
- authored elevation data
- terrain sculpting
- landform tools
- relief and slope visualization
- elevation-aware river/lake helpers
- biome assistance from surface shape
- stronger terrain rendering foundations
- persistence/export for height data

---

## Relationship to Phase 1
Phase 2 builds on the completed or in-progress Phase 1 foundation:

- desktop editor shell
- world canvas
- layer system
- vector geometry
- paint/mask workflows
- symbols
- labels
- nested maps
- persistence/export foundations
- globe preview
- editor UX framework

Phase 2 should **extend** those systems, not replace them.

---

## Locked decisions for this phase
These decisions are locked unless a later prompt explicitly changes them and documents why:

- **Desktop shell:** Tauri
- **UI:** React + TypeScript
- **Build tool:** Vite
- **2D editing/render path:** PixiJS
- **3D globe preview path:** Three.js
- **Storage model:** project folder on disk
- **Root world basis:** equirectangular globe-safe master world map
- **Map hierarchy:** world → region → local remains foundational
- **Terrain data approach:** chunk/tile-aware, large-map-safe
- **Editing philosophy:** authored tools first, not procedural generation first
- **Elevation philosophy:** editable height data with practical brush/landform tools
- **Surface philosophy:** realistic/satellite-inspired direction may begin here, but architecture clarity and performance come before visual excess
- **Phase boundary:** Phase 2 is about shaping terrain and surface systems, not full climate simulation

---

## Phase 2 target
Phase 2 should deliver a usable terrain-authoring vertical slice where the user can:

- create and manage elevation-capable layers
- author terrain height data on world/region/local maps
- sculpt terrain with raise/lower/smooth/flatten-style tools
- create major landforms like ridges, basins, plateaus, and terraces
- preview terrain through relief, slope, contour, and surface shading modes
- use elevation-aware helpers for rivers, lakes, drainage, and water placement
- get biome assistance from elevation/slope/water relationships
- persist, reload, and export height-oriented data
- work at useful scale without destroying performance foundations

---

## Explicitly out of scope for Phase 2
Do **not** drift into these unless a prompt explicitly says otherwise:

- full procedural terrain generation
- tectonic simulation
- full erosion simulation suite
- full climate simulation
- seasons/currents/weather simulation engine
- true 3D terrain editing on the globe
- multiplayer/collaboration
- asset marketplace/library expansion as a major system
- final-market visual polish beyond what is needed to prove the surface system works

---

## Queue

- [ ] 00_elevation_foundation_and_height_data_model.md
- [ ] 01_height_layers_chunk_storage_and_edit_targets.md
- [ ] 02_sculpt_brushes_raise_lower_smooth_flatten.md
- [ ] 03_landform_tools_ridges_basins_plateaus_terraces.md
- [ ] 04_relief_shading_contours_slope_and_surface_preview.md
- [ ] 05_hydrology_assist_rivers_lakes_flow_and_drainage.md
- [ ] 06_biome_assist_from_elevation_and_surface_rules.md
- [ ] 07_world_region_local_terrain_workflows.md
- [ ] 08_heightmap_persistence_import_export_and_interchange.md
- [ ] 09_surface_renderer_upgrades_and_satellite_foundation.md
- [ ] 10_phase2_tool_ux_performance_and_polish.md
- [ ] 11_phase2_hardening_docs_and_handoff.md

---

## Prompt intent summary

### 00 — Elevation foundation
Extend the project/document model for elevation and terrain data. Define height value conventions, layer contracts, chunk/tile strategy, sampling helpers, and runtime/editor separation.

### 01 — Height layers
Implement real elevation-capable layers, active terrain targets, chunk-aware storage hookup, and basic layer/editor integration.

### 02 — Sculpt brushes
Add real height sculpting tools such as raise, lower, smooth, flatten, and related baseline brush controls.

### 03 — Landform tools
Add higher-level terrain shaping workflows for ridges, basins, plateaus, terraces, and landform assist tools.

### 04 — Surface preview
Add relief shading, contour display, slope visualization, and terrain preview modes that make elevation data readable and useful.

### 05 — Hydrology assist
Use elevation data to assist rivers, lakes, drainage, water placement, and basin-aware terrain behavior without building full simulation.

### 06 — Biome assist
Add elevation/slope/water-aware biome helpers and surface rules that improve worldbuilding workflows without becoming a full climate engine.

### 07 — Multi-scale terrain workflows
Ensure terrain systems work coherently across world, region, and local maps, with clear inheritance/copy/independence rules.

### 08 — Persistence and interchange
Persist terrain data well, support heightmap-oriented save/load details, and add import/export/interchange pathways for elevation data.

### 09 — Surface renderer upgrades
Improve terrain rendering toward a more realistic/satellite-inspired direction using the authored height/surface data.

### 10 — Tool UX and performance
Polish terrain tools, improve inspector/tool settings flow, reduce friction, and harden performance around large terrain editing.

### 11 — Hardening and handoff
Stabilize Phase 2, improve docs, note limits honestly, and leave a strong handoff into Phase 3.

---

## Current assumptions to preserve
Unless a prompt explicitly changes one of these, preserve them:

- The world map remains the canonical globe-safe source.
- Elevation data is authored, editable, and chunk-aware.
- Region/local terrain workflows must not break world/region/local map architecture.
- Persisted terrain data must remain clearly separate from runtime caches and overlays.
- Phase 2 should remain useful even before advanced simulation exists.
- Terrain tools must respect layer visibility/locking/edit-target rules.
- Performance for large maps matters from day one.

---

## Status summary
**Overall status:** Not started  
**Current phase:** Phase 2 — Elevation and Surface Systems  
**Next prompt to run:** `00_elevation_foundation_and_height_data_model.md`

---

## Repo expectations
Codex should continue using a structure roughly like:

- `src/app`
- `src/components`
- `src/features`
- `src/engine`
- `src/store`
- `src/types`
- `src/lib`
- `src/styles`
- `src-tauri`

Phase 2 may expand that with terrain-specific organization such as:

- `src/features/terrain`
- `src/engine/terrain`
- `src/lib/terrain`

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

## 00_elevation_foundation_and_height_data_model.md
**Status:** Not started  
**Completed on:**  
**Summary:**  
**Key files added/changed:**  
-  
**What works now:**  
-  
**Known limitations / follow-ups:**  
-  

---

## 01_height_layers_chunk_storage_and_edit_targets.md
**Status:** Not started  
**Completed on:**  
**Summary:**  
**Key files added/changed:**  
-  
**What works now:**  
-  
**Known limitations / follow-ups:**  
-  

---

## 02_sculpt_brushes_raise_lower_smooth_flatten.md
**Status:** Not started  
**Completed on:**  
**Summary:**  
**Key files added/changed:**  
-  
**What works now:**  
-  
**Known limitations / follow-ups:**  
-  

---

## 03_landform_tools_ridges_basins_plateaus_terraces.md
**Status:** Not started  
**Completed on:**  
**Summary:**  
**Key files added/changed:**  
-  
**What works now:**  
-  
**Known limitations / follow-ups:**  
-  

---

## 04_relief_shading_contours_slope_and_surface_preview.md
**Status:** Not started  
**Completed on:**  
**Summary:**  
**Key files added/changed:**  
-  
**What works now:**  
-  
**Known limitations / follow-ups:**  
-  

---

## 05_hydrology_assist_rivers_lakes_flow_and_drainage.md
**Status:** Not started  
**Completed on:**  
**Summary:**  
**Key files added/changed:**  
-  
**What works now:**  
-  
**Known limitations / follow-ups:**  
-  

---

## 06_biome_assist_from_elevation_and_surface_rules.md
**Status:** Not started  
**Completed on:**  
**Summary:**  
**Key files added/changed:**  
-  
**What works now:**  
-  
**Known limitations / follow-ups:**  
-  

---

## 07_world_region_local_terrain_workflows.md
**Status:** Not started  
**Completed on:**  
**Summary:**  
**Key files added/changed:**  
-  
**What works now:**  
-  
**Known limitations / follow-ups:**  
-  

---

## 08_heightmap_persistence_import_export_and_interchange.md
**Status:** Not started  
**Completed on:**  
**Summary:**  
**Key files added/changed:**  
-  
**What works now:**  
-  
**Known limitations / follow-ups:**  
-  

---

## 09_surface_renderer_upgrades_and_satellite_foundation.md
**Status:** Not started  
**Completed on:**  
**Summary:**  
**Key files added/changed:**  
-  
**What works now:**  
-  
**Known limitations / follow-ups:**  
-  

---

## 10_phase2_tool_ux_performance_and_polish.md
**Status:** Not started  
**Completed on:**  
**Summary:**  
**Key files added/changed:**  
-  
**What works now:**  
-  
**Known limitations / follow-ups:**  
-  

---

## 11_phase2_hardening_docs_and_handoff.md
**Status:** Not started  
**Completed on:**  
**Summary:**  
**Key files added/changed:**  
-  
**What works now:**  
-  
**Known limitations / follow-ups:**  
-  

---

## Completion checklist for end of Phase 2
When the queue is fully complete, verify:

- [ ] elevation-capable layers exist and are usable
- [ ] terrain sculpt tools work
- [ ] major landform tools work in a practical form
- [ ] relief/slope/contour visualization exists
- [ ] elevation-aware hydrology helpers exist
- [ ] biome assistance from terrain exists
- [ ] terrain workflows work across world/region/local
- [ ] terrain persistence and reload work
- [ ] height-oriented import/export works in a practical form
- [ ] surface rendering is improved beyond Phase 1
- [ ] setup/docs are updated honestly
- [ ] `STATUS.md` is fully updated
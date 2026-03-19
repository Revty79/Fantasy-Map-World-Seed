# Codex Prompt Queue Status — World Seed Mapper — Phase 4

## Phase Goal
Build the globe-wrapping, projection-transfer, and export stage for **World Seed Mapper** so the authored flattened world map can be:
- wrapped onto a 3D globe
- previewed interactively
- validated for seam/pole continuity
- kept compatible with authored Phase 1–3 data
- exported in useful formats for downstream worldbuilding and rendering workflows

Phase 4 should turn the editor from a flattened world-authoring tool into a true **world-to-globe pipeline**.

## Relationship to earlier phases
- Phase 1 established the flattened-globe-safe procedural world canvas and map-generation foundation.
- Phase 2 established heightmap and elevation authoring.
- Phase 3 established the full authoring stack: paint, hydrology, regions, symbols, labels, masks, persistence, and editor polish.
- Phase 4 must now convert that authored flattened world into a coherent globe workflow **without breaking the flattened map as the primary editable source of truth**.

## Global rules for this phase
- The flattened map remains the canonical editable authoring surface unless a prompt explicitly adds safe globe-side editing behavior.
- Globe rendering must be driven from real world/map-space data, not fake screenshot wrapping hacks.
- Preserve Phase 3 authored content fidelity as much as practical when projecting to the globe.
- Seam behavior and dateline continuity must be treated as real product concerns.
- Pole behavior must be handled deliberately and not ignored.
- Export paths should be structured and reusable, not one-off button hacks.
- Do not discard the existing flattened workflow in favor of globe-only interaction.
- Prefer reversible, inspectable transform pipelines over hidden visual shortcuts.

## Queue
- [ ] 00_phase4_globe_pipeline_foundation.md
- [ ] 01_phase4_coordinate_projection_and_transform_system.md
- [ ] 02_phase4_globe_mesh_and_surface_wrapping.md
- [ ] 03_phase4_seams_poles_and_continuity_handling.md
- [ ] 04_phase4_interactive_globe_viewer.md
- [ ] 05_phase4_project_authored_layers_onto_globe.md
- [ ] 06_phase4_flat_map_to_globe_sync_and_roundtrip_rules.md
- [ ] 07_phase4_export_outputs_and_render_capture.md
- [ ] 08_phase4_data_export_formats_and_integration_hooks.md
- [ ] 09_phase4_polish_validation_and_demo_workflows.md

---

## Run Log

### 00_phase4_globe_pipeline_foundation.md
- Status:
- Notes:
- Files touched:
- Follow-ups:

### 01_phase4_coordinate_projection_and_transform_system.md
- Status:
- Notes:
- Files touched:
- Follow-ups:

### 02_phase4_globe_mesh_and_surface_wrapping.md
- Status:
- Notes:
- Files touched:
- Follow-ups:

### 03_phase4_seams_poles_and_continuity_handling.md
- Status:
- Notes:
- Files touched:
- Follow-ups:

### 04_phase4_interactive_globe_viewer.md
- Status:
- Notes:
- Files touched:
- Follow-ups:

### 05_phase4_project_authored_layers_onto_globe.md
- Status:
- Notes:
- Files touched:
- Follow-ups:

### 06_phase4_flat_map_to_globe_sync_and_roundtrip_rules.md
- Status:
- Notes:
- Files touched:
- Follow-ups:

### 07_phase4_export_outputs_and_render_capture.md
- Status:
- Notes:
- Files touched:
- Follow-ups:

### 08_phase4_data_export_formats_and_integration_hooks.md
- Status:
- Notes:
- Files touched:
- Follow-ups:

### 09_phase4_polish_validation_and_demo_workflows.md
- Status:
- Notes:
- Files touched:
- Follow-ups:
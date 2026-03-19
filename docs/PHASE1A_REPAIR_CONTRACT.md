# Phase 01A Terrain Foundation Repair Contract

## Purpose

Phase 01A is an additive corrective phase.

- Phase 01 is complete as a drafting/editor baseline.
- Phase 01A retrofits a terrain-first foundation into that baseline.
- This is not a scratch rebuild and not a replacement architecture effort.

## Baseline That Must Be Preserved

The following Phase 01 capabilities are considered stable baseline behavior:

- Desktop editor shell and workspace flows
- Project create/open/save/save-as workflows
- Root world map and map registry logic
- Nested world -> region -> local map relationships
- Typed layer architecture
- Vector, paint/mask/data-overlay, symbol, and label authoring
- PNG/SVG/JSON export flows (with existing SVG limitations)
- Read-only globe preview workflow

## Missing Terrain Core (Current Gap)

The existing app is still missing a true terrain/elevation source of truth:

- No first-class terrain field integrated into map data contracts
- No seeded fractal terrain generation pipeline
- No terrain-aware flat render modes tied to real elevation values
- No direct terrain editing tools over elevation data
- No derived coastline/land-water/contour output from terrain + sea level
- No terrain-aware globe pipeline fed from shared terrain render truth
- No complete terrain persistence/export compatibility contract

## Phase 01A Required Additions

Phase 01A must add terrain-first foundations while preserving the baseline:

- Explicit terrain/elevation document schema per map
- Seeded terrain generation from deterministic parameters
- Terrain-aware rendering in the flat editor
- Terrain editing tools that mutate terrain data directly
- Derived shoreline/land-water/contour support from terrain + sea level
- Terrain-aware globe texture/data pipeline integration
- Save/open/export compatibility for terrain fields, including older document hydration defaults

## Non-Regression Contract

Unless a later prompt explicitly allows a change, Phase 01A work must not regress:

- Project lifecycle workflows (new/open/save/save as)
- Existing map/layer/entity editing behavior
- Nested map relationship integrity
- Current export flows and warning behavior
- Globe preview opening and read-only operation

## Implementation Guardrails

- Extend existing typed document/store/render/persistence architecture; do not bypass it.
- Keep terrain data serializable and explicit in schema.
- Prefer targeted modules and migrations/hydration behavior over broad refactors.
- Keep documentation aligned with implemented truth at each prompt step.

## Sequencing Note

Phase 01A prompt execution order and run logs are tracked in:

- `Prompts/phase_01a_terrain_foundation_repair/STATUS.md`

Phase 02 elevation/surface expansion should proceed only after this Phase 01A repair queue establishes the terrain foundation.

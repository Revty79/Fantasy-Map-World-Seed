# Phase 4 — Coordinate Projection and Transform System

## Objective
Build the coordinate projection and transform system for **World Seed Mapper** so the authored flattened world map can be translated into a mathematically coherent globe-space representation.

This prompt should establish:
- the shared coordinate-space model for flat map space, normalized space, spherical space, and globe/world space
- conversion utilities between those spaces
- a reliable transform contract for raster, vector, and point-based authored content
- seam-aware and pole-aware transform foundations
- reusable projection helpers for later globe mesh, overlays, symbols, labels, and export work

This prompt is about **the math and transform architecture** that the rest of Phase 4 depends on.

---

## Context
The previous prompt established:
- the globe pipeline foundation
- flat-map authored data as the canonical source of truth
- centralized globe pipeline/state boundaries
- a globe workspace/view entry point
- derived asset/cache boundaries and invalidation foundations

Now the project needs the actual coordinate/transform layer that converts:
- authored flattened world data
into
- globe-ready spatial data

This system must support later work for:
- globe surface wrapping
- projected paint/biome/hydrology overlays
- symbol/landmark projection
- label anchoring
- seam and pole handling
- export-ready spatial outputs

Important product rule:
The flattened map remains canonical. The projection system must derive globe-space results from flat authored data cleanly and predictably.

---

## Required outcome
When complete, the app should have a real coordinate projection and transform system with:
1. clearly defined coordinate spaces
2. reusable conversion utilities between those spaces
3. a normalized transform pipeline from flat map coordinates to sphere/globe coordinates
4. support structures for raster, point, path, polygon, and object projection
5. explicit seams/poles awareness in the transform design
6. a strong contract for later rendering and export prompts

This prompt should make later globe work mathematically grounded instead of approximate.

---

## Core implementation tasks

### 1) Define coordinate spaces explicitly
Implement shared typed definitions and documentation-in-code for the major coordinate spaces used by the app.

At minimum define and distinguish:
- **flat map pixel/grid space**  
  the authored 2D map surface aligned to the flattened world canvas
- **normalized map space**  
  a stable 0..1 or equivalent normalized representation of the flat world
- **geographic/spherical parameter space**  
  longitude/latitude or equivalent spherical coordinates
- **unit sphere space**  
  3D coordinates on a normalized sphere
- **globe/world render space**  
  scaled/rendered 3D coordinates used by the globe viewer/mesh pipeline
- **screen/view space**  
  only where needed for viewer interactions, kept separate from persisted data

Requirements:
- these spaces must be named clearly and consistently
- the code should make it obvious which functions expect which space
- later prompts should not need to guess coordinate meaning

Do not blur these spaces together.

---

### 2) Define canonical map-to-sphere assumptions
Establish the mathematical assumptions for converting the flattened world into spherical coordinates.

At minimum specify in code/types/helpers:
- how x on the flat map maps to longitude
- how y on the flat map maps to latitude
- whether the canonical flat map is treated as equirectangular or another explicit equivalent
- coordinate orientation conventions (left/right, top/bottom, north/south, handedness)
- meridian/datetime seam convention
- pole placement convention

Requirements:
- assumptions must be explicit and stable
- later prompts must be able to rely on them across the whole pipeline
- any chosen convention should be consistent with the flattened-globe-safe authoring model established earlier

This is foundational. Be explicit.

---

### 3) Implement core transform utilities
Create reusable transformation helpers/modules for converting between the coordinate spaces.

At minimum provide utilities for:
- flat map -> normalized map
- normalized map -> flat map
- normalized map -> longitude/latitude
- longitude/latitude -> normalized map
- longitude/latitude -> unit sphere XYZ
- unit sphere XYZ -> longitude/latitude
- unit sphere -> globe/world space with configurable radius/scale
- globe/world space -> unit sphere or geographic space where needed

Requirements:
- these utilities must be strongly typed or otherwise clearly structured
- they must be reusable by later raster/vector/object projection code
- they must avoid hidden assumptions or one-off embedded math in components

Use clear naming and contracts.

---

### 4) Add projection helpers for different authored content types
Different authored systems need different projection handling. Create reusable transform helpers for at least the following categories:

#### a) Point/object projection
For:
- symbols
- landmarks
- label anchors
- source points
- generic map markers

Provide helpers that convert authored flat-map anchor positions into globe-space anchor positions.

#### b) Path/polyline projection
For:
- rivers
- boundary lines
- routes
- freeform authored paths

Provide helpers that can project sampled point sequences into globe-space paths.

#### c) Polygon/region projection
For:
- region boundaries/fills
- lake polygons if vector-based
- overlay regions

Provide helpers that transform polygon vertices/rings and prepare them for later seam-safe rendering.

#### d) Raster/grid projection hooks
For:
- height/elevation maps
- biome/surface layers
- masks
- paint textures
- other grid-backed overlays

Provide the transform hooks or sampling contracts these systems will need later.

Not every consumer must be fully wired here, but the shared helpers/contracts must exist.

---

### 5) Implement seam-aware transform foundations
Because the flat map wraps around the globe, create explicit seam-aware logic at the transform layer.

At minimum support structure for:
- identifying positions near the wrap seam
- normalizing longitudes consistently
- handling discontinuities between one side of the map and the other
- splitting or marking path/polygon segments that cross the seam where necessary
- preserving continuity for data that should wrap

Requirements:
- seam handling should exist as a real part of the transform system
- later viewer/render prompts should not need to invent their own incompatible seam logic
- the design should work for both point-like and multi-vertex data

This does not need final full seam UX yet, but it must be real mathematically.

---

### 6) Implement pole-aware transform foundations
Create explicit pole-aware handling in the transform design.

At minimum account for:
- flattening behavior near the north and south poles
- singularity-like conditions at poles
- label/object/path behaviors that may become unstable near poles
- region/path projection assumptions near high-latitude areas
- future render/debug logic that needs to identify pole-adjacent data

Requirements:
- pole awareness must be explicit, not ignored
- later mesh/render/export prompts must be able to rely on these helpers/flags/metadata
- the system should avoid silent corruption or undefined behavior at extreme latitudes

Again, this is foundation work, not final pole polish.

---

### 7) Add transform metadata and diagnostics hooks
Provide metadata/hooks that help later layers and debug tools inspect transform results.

Examples:
- normalized longitude/latitude readouts
- seam-crossing flags
- pole-proximity flags
- projected bounds/spherical extents
- invalid/degenerate geometry warnings
- transform version or configuration markers if useful

Requirements:
- these hooks can be modest, but must be real and reusable
- they should help later prompts validate projection correctness
- they should not clutter the main authoring state unnecessarily

This will be useful for debugging globe fidelity later.

---

### 8) Integrate with the globe pipeline foundation
Wire the transform system into the pipeline architecture created in the prior prompt.

Requirements:
- the globe pipeline should now have a clear transform stage
- derived globe data generation should call shared transform utilities rather than embedding ad hoc math
- invalidation/rebuild logic should have a sensible place to trigger transform updates
- the transform system should be discoverable and centrally used

Do not leave the transform system floating unused.

---

### 9) Add lightweight viewer/dev validation surfaces
Where practical, expose minimal validation affordances so the project visibly benefits from this prompt.

Examples:
- debug readout of projected coordinates for hovered/selected map points
- small dev/debug panel showing current coordinate-space conversions
- unit-testable transform functions with a few sanity checks
- lightweight globe workspace placeholder that can report transformed sample positions

Requirements:
- at least one meaningful validation path should exist
- the project should not rely purely on hope that the math is correct

A few strong sanity checks are better than lots of noise.

---

### 10) Preserve compatibility with existing authored systems
This transform system must be designed to support the authored systems already built:
- terrain/elevation
- biome/surface paint
- hydrology
- regions/overlays
- symbols/landmarks
- labels/text
- masks

Requirements:
- the transform contracts must be compatible with how those systems currently store their flat-map/world-space data
- do not force unnecessary rewrites of Phase 1–3 data models unless clearly required
- if adapters are needed, structure them cleanly

The transform system should bridge the existing editor into globe space, not fight it.

---

### 11) Preserve persistence and export compatibility
Extend shared types or metadata where needed so the transform system supports save/load and later export work.

At minimum provide hooks for:
- coordinate convention metadata
- projection assumption metadata if appropriate
- transform-related version/configuration markers where useful
- export helpers discovering the correct coordinate conversions

Requirements:
- canonical authored data remains clean
- transform rules should be explicit enough that exports later do not guess incorrectly
- derived transform data should stay clearly distinguished from canonical authored content

Do not bloat saved authored documents with unnecessary transient transform outputs unless clearly intentional.

---

### 12) Preserve flattened workflow stability
The existing flattened authoring workflow must remain intact.

Requirements:
- no regressions to map editing
- no regressions to persistence of authored flat-map data
- no UI confusion that makes the flat map feel replaced
- transform work should feel additive and foundational

Phase 4 is still building on the flat editor, not abandoning it.

---

### 13) Prepare for later globe mesh/viewer work
This prompt should leave clean hooks for:
- globe mesh UV/sample generation
- per-vertex elevation displacement
- globe texture/material inputs
- projected overlay rendering
- interactive viewer picking and reverse lookup
- export capture workflows

Requirements:
- later prompts should be able to consume this transform system directly
- the contracts between transforms and viewer/mesh code should be obvious
- no later prompt should need to replace this math layer wholesale

---

### 14) Keep performance reasonable
Projection math should be structured with future performance in mind.

Take sensible measures such as:
- pure reusable functions where appropriate
- caching-friendly contracts
- avoiding repeated recomputation of invariant conversions
- preparing for batch transforms of paths/grids/objects

Do not prematurely over-optimize everything, but do not design a math layer that will be obviously painful at scale.

---

## UX expectations
By the end of this prompt, the visible product should communicate that:
- flat map data now has a real mathematical path to the globe
- the project is no longer merely “planning” globe support
- there is a reliable transform foundation for later viewer and wrapping steps

This prompt is heavily architectural, but it should still produce visible validation progress.

---

## Implementation guidance
Prefer:
- explicit typed coordinate-space models
- centralized transform utility modules
- reusable helpers for point/path/polygon/raster consumers
- seam/pole awareness built into the transform layer
- simple validation hooks/tests proving the math path works

Avoid:
- embedding projection math ad hoc inside UI components
- vague unnamed vector conversions
- hidden assumptions about map orientation
- screen-space-only shortcuts masquerading as world transforms
- postponing seam/pole awareness entirely

---

## Deliverables
Implement:
- explicit coordinate-space definitions
- canonical map-to-sphere assumption helpers/constants
- reusable transform utilities
- projection helpers for point/path/polygon/raster content
- seam-aware and pole-aware transform foundations
- transform metadata/diagnostics hooks
- integration of the transform stage into the globe pipeline
- lightweight validation/debug/test support where appropriate
- any necessary shared type/store/persistence-hook updates

Also update any lightweight internal notes if helpful.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. The codebase has clearly defined coordinate spaces for flat, normalized, geographic, spherical, and globe render contexts.
2. Reusable transform utilities exist for converting between those spaces.
3. The map-to-sphere assumptions are explicit and consistent.
4. The transform layer supports at least point, path, polygon, and raster/grid projection foundations.
5. Seam-aware and pole-aware handling exists as real code-level concepts in the transform system.
6. The globe pipeline uses this transform layer rather than relying on ad hoc embedded math.
7. Existing flat authored systems remain compatible and unbroken.
8. The implementation clearly prepares for globe mesh wrapping, projected overlays, interactive viewer work, and export.

---

## What not to do
Do not:
- build the full globe mesh here
- build the final interactive globe viewer here
- implement final seam/pole UX polish here
- replace canonical flat authored data with globe-space source data
- bury transform logic in rendering components

This prompt is the shared projection and transform system only.

---

## Final instruction
Implement the coordinate projection and transform system cleanly and completely, giving World Seed Mapper a reliable mathematical bridge from canonical flat authored data into globe-ready spatial data for the rest of Phase 4.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
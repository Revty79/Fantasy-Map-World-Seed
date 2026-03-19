# 00 — Elevation Foundation and Height Data Model

## Objective
Extend World Seed Mapper’s document, layer, and engine foundations so the app has a stable and future-ready internal model for **elevation data**, **terrain-aware layers**, **height sampling**, and **chunk/tile-based surface storage**.

This prompt is about defining the terrain backbone correctly before sculpt tools begin.

Do this carefully. A weak elevation model will poison every later terrain system.

---

## Why this prompt exists
Phase 1 established:
- maps
- layers
- vector features
- paint/masks
- symbols
- labels
- nested maps
- persistence/export foundations
- editor/runtime separation

Phase 2 now needs those systems to understand terrain and elevation in a way that supports:
- editable height data
- chunk-aware storage
- world/region/local terrain workflows
- terrain visualization
- hydrology helpers
- biome assistance
- improved surface rendering
- future import/export/interchange

This prompt creates the terrain language the rest of Phase 2 will speak.

---

## Required outcome
By the end of this prompt, the repo should have:

- document-model extensions for elevation and terrain data
- terrain-capable layer contracts
- clean height value conventions and metadata
- chunk/tile-aware terrain data structures
- separation between persisted terrain data and runtime terrain caches
- terrain sampling/query helpers
- world/region/local compatibility in the terrain model
- factory/helpers for terrain-capable maps and layers
- guards/validation helpers where useful
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** implement sculpt brushes yet.
- Do **not** implement full terrain rendering yet.
- Do **not** implement full hydrology/climate systems yet.
- Do **not** flatten elevation into one giant monolithic blob if the architecture can avoid it.
- Do **not** mix runtime render caches into persisted terrain documents.
- Do **not** abandon the existing project/map/layer model unless a genuine structural issue forces a documented adjustment.

---

## Main goal
Create a terrain document and runtime contract that already feels like it could support a serious mapmaking application:

- elevation-capable layers
- chunk-aware height data
- normalized/document-space terrain queries
- terrain-aware world/region/local maps
- future sculpting and rendering
- future import/export

This is the slab for everything that follows.

---

## What to build

### 1) Extend the document model for terrain
Extend the Phase 1 project/map/layer/entity model to support terrain and elevation data cleanly.

Requirements:
- add terrain/elevation-capable concepts without polluting unrelated content types
- preserve separation between persisted document state and editor/runtime state
- keep the result readable and future-friendly

Good outcomes:
- terrain-capable layer types or subtypes
- terrain data payload contracts
- surface metadata where appropriate

Do not create a giant unreadable generic system.

---

### 2) Height value conventions
Define and document the app’s core height value conventions.

The system needs a clear answer to questions like:
- how is height represented?
- normalized 0–1?
- signed range?
- integer or float?
- how are sea level and land level represented?
- how do world/document units relate to height values?

A strong practical baseline might include:
- normalized stored height values
- explicit sea-level metadata or conventions
- layer/map metadata describing interpretation

Whatever you choose:
- make it explicit
- make it consistent
- keep it suitable for later tooling and export

Do not leave height semantics vague.

---

### 3) Terrain-capable layer kinds
Define and/or extend layer kinds so terrain data has a real home.

At minimum support a clean conceptual place for:
- elevation/height data
- terrain/surface preview metadata
- derived terrain assists if needed later

This does **not** mean 20 new layer types.  
It means terrain data should not feel bolted onto an unrelated paint layer with no structure.

A good baseline:
- one or more explicit terrain/elevation layer types
- room for related derived overlays later

Keep it practical.

---

### 4) Chunk/tile-aware terrain storage contracts
This is one of the most important parts of the prompt.

The terrain system must be large-map aware.  
Do not design it as one enormous always-loaded height array if a partitioned strategy is cleaner.

Create a terrain storage contract that supports:
- chunk/tile keys
- terrain chunks in document space
- sparse creation of only touched chunks where appropriate
- future selective loading/rendering
- future export/import by chunk or tiles

You do **not** need a final production-optimized system yet.  
But the model must clearly support scale.

---

### 5) Terrain chunk payload shape
Define the per-chunk terrain payload shape.

A terrain chunk should be able to represent things like:
- chunk id/key
- chunk bounds in document space or grid coordinates
- stored height samples
- optional resolution metadata
- optional derived summaries later
- versioning metadata if useful

Important:
- keep persisted chunk data clean
- do not mix in runtime-only render textures or GPU objects
- do not hardwire the system to one resolution forever if that would be limiting

A practical first pass is enough if it is structurally sound.

---

### 6) Resolution and sampling strategy
Define how elevation sampling works at the data level.

Questions the model should answer:
- what is the sample grid density or resolution per chunk?
- can different maps/layers theoretically use different terrain resolutions?
- how are samples addressed within a chunk?
- how do document coordinates map to terrain samples?

You do not need a fully dynamic multi-resolution terrain LOD system now.  
But the contracts should not block future refinement.

A good baseline:
- fixed resolution per chunk for now
- metadata that allows future expansion later

---

### 7) Sea level and terrain metadata
Add terrain metadata that makes later tools possible.

Examples:
- sea level
- default terrain min/max semantics
- terrain display mode defaults
- terrain resolution settings
- vertical exaggeration hint for previews later
- map-scope terrain settings if appropriate

Keep it modest but useful.

This metadata will help later:
- hydrology
- biome assists
- relief shading
- surface rendering
- export

---

### 8) Terrain query and sampling helpers
Add practical terrain helpers/utilities.

Examples:
- sample height at document coordinate
- map document coordinate → chunk/sample index
- chunk key from coordinate
- bounds helpers for terrain layers
- nearest sample helpers
- interpolation helpers if appropriate
- terrain metadata accessors

These helpers should be clean, reusable, and future-facing.

Later prompts will lean on them heavily.

---

### 9) World / region / local terrain compatibility
Ensure the terrain model works across map scopes.

Requirements:
- world maps can carry terrain data
- region maps can carry terrain data
- local maps can carry terrain data
- the model does not assume world-only terrain
- child maps can later choose copied/derived/independent terrain behavior without the model fighting that

Do not fully solve multi-map terrain relationships yet.  
But do make sure the model allows them.

---

### 10) Runtime/editor separation
Very important: keep terrain runtime state separate from persisted terrain data.

Examples of runtime-only terrain state:
- visible terrain chunks
- cached mesh/graphics data
- derived shading textures
- active sculpt preview
- brush cursor overlays
- temporary sampling caches

These should **not** be persisted directly in the terrain document.

Make the boundary obvious.

---

### 11) Terrain factories/helpers
Create practical helpers/factories for common terrain model operations.

Examples:
- create terrain/elevation layer
- create default terrain metadata for a map
- create empty terrain chunk
- create terrain chunk key
- initialize default terrain-ready map state
- create terrain-capable default project/map bootstrap pieces where appropriate

These helpers should reduce boilerplate and keep later prompts cleaner.

---

### 12) Terrain guards/validation
Add lightweight validation/guard helpers where useful.

Examples:
- is elevation-capable layer
- is terrain chunk payload
- is valid terrain metadata shape
- assert height sample bounds or array shape basics
- guard chunk key format if appropriate

Do not build a giant schema framework unless it is genuinely lightweight and useful.

---

### 13) Integration with inspector/editor foundations
You do not need full terrain editing UI yet, but the terrain model should integrate sensibly with the existing editor foundations.

A good outcome:
- terrain-capable layers can already exist in typed/editor state
- inspector can later recognize them cleanly
- tool settings can later target them cleanly
- selection/edit-target rules can later use them cleanly

This prompt is mostly model/contract work, but it should not be detached from the live editor architecture.

---

### 14) Terrain naming and terminology guidance
Use names that will still make sense later.

Good examples:
- `ElevationLayer`
- `TerrainChunk`
- `HeightSampleGrid`
- `TerrainMetadata`
- `TerrainEditTarget`
- `TerrainChunkKey`
- `sampleTerrainHeightAtCoordinate`

Avoid vague or flimsy names like:
- `HeightStuff`
- `TerrainBlob`
- `MapDepthThing`

Keep the terrain language sharp and durable.

---

### 15) Performance guidance
Even at the type/model level, design with performance in mind.

Favor contracts that can later support:
- selective terrain chunk loading
- per-layer terrain chunk access
- sparse writes
- visible chunk evaluation
- derived shading caches
- multi-map terrain without giant full-project terrain blobs

Avoid:
- one gigantic always-hot terrain structure
- no clear chunk access boundaries
- storing runtime rendering data inside persisted terrain content

---

### 16) Suggested file targets
Use clean organization. Something roughly like:

- `src/types/terrain.ts`
- `src/types/layers.ts`
- `src/lib/terrain/...`
- `src/lib/factories/terrain...`
- `src/lib/guards/terrain...`
- `src/engine/terrain/...`

You may choose a slightly different structure if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- the document model has clean terrain/elevation extensions
- terrain-capable layer concepts exist
- height value conventions are explicit and consistent
- terrain chunk/tile-aware storage contracts exist
- terrain query/sampling helpers exist
- persisted terrain data is clearly separated from runtime/editor terrain state
- world/region/local maps are all structurally compatible with terrain data
- factories/helpers/guards exist where useful
- no major type/build regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- default constants for terrain chunk sizes/resolution
- inline comments for especially important terrain contracts
- a central terrain exports index
- basic terrain debug metadata helpers

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- a stable terrain/elevation model foundation
- terrain-capable layer and chunk contracts
- clear height value semantics
- terrain sampling/query helpers
- world/region/local terrain compatibility in the model
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the codebase should have a trustworthy internal language for elevation and terrain.

Later sculpting, shading, hydrology, biome, persistence, and rendering prompts should be able to build on this without rethinking the terrain backbone.

That is the bar.
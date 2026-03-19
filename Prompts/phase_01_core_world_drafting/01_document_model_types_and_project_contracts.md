# 01 — Document Model, Types, and Project Contracts

## Objective
Define the foundational **document model** for World Seed Mapper so the app has a stable internal language for projects, maps, layers, entities, nesting, and future persistence.

This prompt is about creating the core **types/contracts/schema shape** that the rest of the system will build on.

Do this carefully. Bad document models create endless pain later.

---

## Why this prompt exists
World Seed Mapper is not just a drawing canvas.

It needs to support:
- a master globe-safe world map
- nested world → region → local maps
- hybrid vector + paint + mask workflows
- typed layers
- symbols, labels, and future terrain/weather/elevation systems
- project-folder persistence
- exports
- future globe preview
- future advanced features like elevation tools, style systems, special map modes, and more

All of that gets easier or harder depending on the quality of the document model.

This prompt is where we define the backbone.

---

## Required outcome
By the end of this prompt, the repo should have:

- a clear set of TypeScript types/interfaces for the project model
- ids and contracts for projects, maps, layers, groups, entities, and references
- a stable way to represent **world / region / local** maps
- typed layer kinds for current and future editing workflows
- contracts that separate:
  - document data
  - editor/view state
  - render/cache/runtime concerns
- a basic project manifest shape
- future-friendly serialization-ready structures
- utility helpers/factories for creating core model objects
- light validation/guard patterns where reasonable
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** implement actual save/load yet beyond model contracts/helpers.
- Do **not** build real rendering here.
- Do **not** build full editor tools yet.
- Do **not** introduce database schemas.
- Do **not** create overly abstract generic type systems that become unreadable.
- Do **not** mix runtime render caches into persisted document types.
- Do **not** assume only one map per project.

---

## Core design principle
The document model should distinguish **persisted authoring data** from **ephemeral editor/runtime state**.

That means:
- project/map/layer/entity content belongs in persisted document structures
- selection state, active tool, hover state, caches, compiled geometry, GPU textures, etc. do **not**

Keep those worlds separate.

---

## What to model

### 1) Project root model
Define the top-level project shape.

The project should be able to represent:
- project id
- project name
- version/schema version
- creation/update timestamps
- optional author/description metadata
- map registry / map ordering
- root world map id
- asset references
- settings relevant to the project document

It should feel natural for future folder-based persistence.

Suggested idea:
- `WorldSeedProject`
- `ProjectManifest`
- `ProjectMetadata`

Use names that are clean and durable.

---

### 2) Map document model
Each map should have its own document shape.

A map document should be able to represent:
- map id
- parent/child relationships where applicable
- map scope kind: `world`, `region`, `local`
- display name
- projection/basis info
- dimensions/logical extents
- layer stack
- map settings
- references to related maps
- optional geographic/world extents for nested maps
- timestamps/metadata

This must support:
- one world map as the master source
- region maps linked to part of a world
- local maps linked to part of a region or world

---

### 3) Nested mapping contracts
Define how nested maps relate to each other.

The app needs world → region → local nesting from early on.

You do **not** need to implement full behaviors yet, but the types must support them.

A nested map relationship should be able to express:
- parent map id
- child map id
- source extent / anchor area in parent coordinates
- optional transform / normalized bounds
- intent or relationship kind
- inherited or independent layer behavior if relevant later

Keep it simple but future-proof.

---

### 4) Projection / spatial basis contracts
The project is globe-safe from the start.

Define the model shape for map spatial/projection info.

At minimum support:
- `equirectangular` as the initial master world basis
- the possibility of other projections or specialized layouts later
- normalized world-space or document-space coordinates
- clear separation between logical world coordinates and screen/render coordinates

Do not overbuild a GIS engine, but do establish clean naming.

---

### 5) Layer model
This is one of the most important parts.

Define a typed layer system that can support both Phase 1 and later expansion.

Each layer should be able to represent:
- id
- name
- kind/type
- visibility
- lock state
- opacity
- blend or compositing hints if appropriate
- ordering/group membership
- metadata/settings
- persisted content payload relevant to its type

At minimum, define clean layer kinds for:
- vector geometry
- paint/raster-like layer
- mask layer
- symbol/feature layer
- label/text layer
- data overlay layer
- group layer/container

You may also define future-facing kinds such as:
- elevation
- biome
- climate
- reference/image
- annotation
if it helps keep the model future-ready

But do not create 40 unnecessary kinds.

---

### 6) Entity/content models inside layers
Define the persisted content contracts for the kinds of things layers will hold.

For example:

#### Vector content
Should support future entities like:
- coastlines
- rivers
- roads
- borders
- freeform paths
- polygons
- polylines

A vector entity should have concepts like:
- id
- geometry type
- control points / vertices
- closed/open state
- styling metadata
- tags/category
- edit metadata where useful

#### Paint/mask content
Should support:
- paint channel or tile/chunk-based references
- brush-authored content
- masks for land/ocean/biome/weather zones
- future large-map partitioning

Important:
Do not store this as “one giant always-loaded blob” if you can avoid it.
You do not need to fully implement chunk storage yet, but the contracts should clearly allow partitioned content.

#### Symbol content
Should support:
- placed feature id
- symbol asset key/reference
- position
- rotation
- scale
- style overrides
- tags/category

#### Label content
Should support:
- text
- position
- rotation/curve-ready possibility
- style settings
- anchor/alignment
- metadata

#### Data overlay content
Should support:
- weather/climate/value-based overlays
- layer-specific settings
- future grid/tile/field representations

The goal is not to fully implement all behavior now. The goal is to define sane persisted shapes.

---

### 7) Grouping and hierarchy
Layers should be able to support grouping.

Define clean contracts for:
- group/container layers or folder-like grouping
- parent-child layer relationships if you choose that approach
- ordering rules
- ids/reference safety

Keep it understandable.

---

### 8) Asset references
The project will eventually use:
- imported textures
- symbol libraries
- brush definitions
- reference images
- other assets

Define a basic asset reference model now.

It should be able to represent:
- asset id
- asset type
- relative path or logical key
- metadata
- optional dimensions or format info where useful

Do not build the asset system yet. Just define the contract.

---

### 9) Versioning / schema readiness
Add a lightweight schema-versioning concept to the project model.

The app will evolve. The document model should acknowledge that.

Examples:
- `schemaVersion`
- `documentVersion`
- migration note placeholder

No migration system is needed yet, but the model should not pretend versioning does not matter.

---

### 10) Factories / helpers
Create practical helper utilities for constructing the core model.

Examples:
- create new project
- create new map document
- create default world map
- create layer by kind
- create symbol/label/vector entity skeleton

These helpers should reduce repeated boilerplate and keep later prompts cleaner.

---

### 11) Type guards / validation helpers
Add lightweight validation/guard helpers where useful.

Examples:
- is map scope kind
- is supported layer kind
- assert project manifest shape basics
- guard for group vs non-group layer

Do not build a giant validation framework unless it is truly lightweight and helpful.

---

### 12) Separation from editor state
Very important: ensure there is a separate place/type family for non-persisted editor state.

Define basic distinctions such as:
- `WorldSeedProjectDocument` for persisted data
- `EditorSessionState` or similar for UI/runtime state

You do not need to fully flesh out the editor state yet, but do make the boundary obvious.

---

## Naming guidance
Prefer names that will still make sense a year from now.

Good:
- `MapDocument`
- `LayerKind`
- `NestedMapLink`
- `ProjectManifest`
- `VectorFeature`
- `SymbolInstance`
- `LabelAnnotation`

Avoid vague names like:
- `Thing`
- `DataObject`
- `MiscLayer`
- `MapStuff`

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/types/project.ts`
- `src/types/maps.ts`
- `src/types/layers.ts`
- `src/types/entities.ts`
- `src/types/assets.ts`
- `src/types/editor.ts`
- `src/lib/factories/...`
- `src/lib/guards/...`

You may choose a slightly different structure if it is cleaner, but keep it organized.

---

## Spatial modeling guidance
This matters a lot.

Try to define clear coordinate concepts such as:
- document-space coordinates
- normalized coordinates for parent-child extents
- world coordinates for the equirectangular master map
- screen/view coordinates as non-persisted runtime data

Do not blur these together.

A future developer should be able to tell:
“this coordinate lives in the saved map document”
vs
“this coordinate exists only for viewport rendering”

---

## Performance guidance
Even though this prompt is “just types,” performance concerns should shape the contracts.

Favor contracts that can later support:
- chunked paint storage
- chunk/tile-aware rendering
- lazy asset loading
- selective map/layer loading
- future cache compilation

Avoid contracts that force everything into a single gigantic monolith.

---

## Acceptance criteria
This prompt is complete when:

- the project has a clean typed document model
- project, map, layer, entity, asset, and nesting concepts are represented
- world / region / local relationships are modeled clearly
- persisted data is clearly separated from editor/runtime state
- factory/helper functions exist for common object creation
- basic guards or validation helpers exist where helpful
- the structure is readable and future-friendly
- no major type/build regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if natural:

- default constants for initial world map dimensions/settings
- small inline docs/comments for especially important types
- sample default project bootstrap helper
- a central export index for the type system

Do not derail the prompt with excess polish.

---

## Deliverables
Codex should leave behind:

- a stable project document model
- typed contracts for maps/layers/entities/assets
- nested map relationship contracts
- separation of persisted vs editor/runtime state
- helper factories/guards
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the codebase should have a trustworthy internal language for what a project **is**.

Later prompts should be able to build tools and persistence on top of these contracts without needing to rethink the entire model.

That is the bar.
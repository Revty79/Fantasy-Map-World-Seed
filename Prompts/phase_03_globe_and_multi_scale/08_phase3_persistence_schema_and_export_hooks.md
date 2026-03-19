# Phase 3 — Persistence Schema and Export Hooks

## Objective
Build the persistence schema and export-hook foundations for **World Seed Mapper** so all major Phase 3 authored content can be saved, loaded, restored, and prepared for later export workflows without needing architectural rework in Phase 4.

This prompt should establish real persistence and export-readiness for:
- authoring workspace state where appropriate
- paint layers
- hydrology features
- regions and overlays
- symbols/landmarks
- labels/text
- masks and other persistent authored utilities where applicable
- stable project/document serialization structure
- clean downstream hooks for later globe wrapping and export features

This prompt is about **making Phase 3 durable**. It should turn the editor from a temporary session tool into a real world-authoring system with coherent saved state and export-ready data structure.

---

## Context
Earlier phases already established:
- flattened-globe-safe world canvas assumptions
- procedural/fractal terrain generation
- elevation and heightmap editing
- Phase 3 authoring workspace foundation
- reusable brush/painter foundations
- hydrology tools
- biome and surface painting
- regions, boundaries, and overlays
- symbols, stamps, and landmarks
- labels and text tools
- selection/fill/erase/mask utilities

At this point, the editor likely contains a lot of authored state. This prompt should ensure that authored state is:
- structured coherently
- serializable
- reloadable
- versionable
- compatible with later export/globe conversion work

This prompt should build on the current codebase, not replace everything with a separate parallel data model unless truly necessary.

---

## Required outcome
When complete, the app should support a real persistence foundation where:
1. major authored world-map data can be serialized into a stable project/document structure
2. that data can be loaded back into the editor reliably
3. persistence boundaries between transient UI state and authored map data are clear
4. exported data hooks exist for later globe/export pipelines
5. the saved structure remains aligned with flattened-globe-safe world/map coordinates

At least one real **save/load round-trip** for the authored map project should be functional by the end of this prompt.

---

## Core implementation tasks

### 1) Define the project/document persistence schema
Create or refine a single coherent saved-project structure for World Seed Mapper.

At minimum, the project/document schema should support:
- project/document id
- project/document name
- schema version
- creation/update metadata if appropriate
- base map/world dimensions or projection-aligned metadata
- terrain/elevation authored state references
- paint-layer state
- hydrology data
- region/overlay data
- symbol/landmark data
- label/text data
- persistent mask data where appropriate
- editor settings metadata where appropriate
- placeholders/hooks for future globe/export metadata

The schema should clearly distinguish:
- persisted authored world data
- optionally persisted editor preferences
- transient UI/session-only state that should not be saved

Do not create an ambiguous blob that becomes hard to migrate later.

---

### 2) Introduce versioned schema handling
Implement version-awareness in the persistence layer.

Requirements:
- saved project data includes a schema version
- load logic can validate or interpret the version
- code structure leaves room for migrations later
- invalid/missing version behavior is handled gracefully

You do not need to build a giant migration framework yet, but the implementation should not assume the schema will never change.

This matters because the project is clearly multi-phase and likely to evolve.

---

### 3) Define persistence boundaries clearly
Audit the Phase 3 systems and decide what should persist now versus what should remain transient.

Examples of data that should likely persist:
- authored paint data
- hydrology entities
- regions
- landmarks/symbols
- labels
- committed masks if masks are authored content
- terrain/elevation edits
- user-visible layer settings where appropriate

Examples of data that may remain transient:
- hover state
- in-progress brush stroke preview
- temporary selection marquee
- non-committed edit previews
- temporary tool UI focus

Implement these boundaries cleanly in code so future prompts are not forced to untangle mixed editor/session and authored state.

---

### 4) Implement serialization for major Phase 3 authored systems
Extend the existing models/stores so major authored systems can serialize into the project/document schema.

At minimum include:
- terrain/elevation authored data references or embedded structure as appropriate
- paint layers and their metadata/data backing
- hydrology features
- regions and overlays
- placed symbols/landmarks
- labels/text
- persistent masks or other authored utility data where applicable

Requirements:
- serialization should use real structured data, not DOM snapshots or visual-state hacks
- saved data must remain map/world-space aligned
- the implementation must be deterministic and understandable

If a subsystem is not yet fully persistence-ready, bring it to a minimal real standard here rather than punting with TODO-only scaffolding.

---

### 5) Implement deserialization / load restoration
Create the matching load pathway so saved project data can restore the editor.

Requirements:
- the editor can reconstruct major authored layers and objects from saved data
- loaded data restores into the shared Phase 3 architecture rather than bypassing it
- missing/partial data is handled reasonably
- invalid data is guarded against at least at a basic level
- restored content renders correctly on the map

This is not complete until there is a real round-trip path, not just serialization code.

---

### 6) Implement at least one real save/load workflow
Add a real workflow the user can trigger for saving and loading a project/document state.

Depending on the current app architecture, this may be:
- local file export/import of a project document
- app-level saved document state in browser storage/local storage/indexedDB
- repository/server-backed persistence if that already exists
- another structurally sound first persistence path

Requirements:
- the user can save authored map data
- the user can reload that saved data into the editor
- the workflow is visible and intentional in the UI
- the implementation proves the schema works in practice

At least one real save/load round-trip must work by the end of this prompt.

---

### 7) Add validation and safety checks
Implement basic validation and error handling for persistence.

At minimum:
- validate required top-level fields during load
- validate schema version presence
- handle malformed or incompatible data gracefully
- avoid crashing the editor on bad input
- provide reasonable user/dev feedback when load fails

This can be lightweight, but it must be real.

---

### 8) Add export hooks for downstream systems
Create clean export-oriented hooks or transformation helpers for later phases.

You do **not** need to build the final export UX here, but the code should support future export flows such as:
- flattened map export
- globe-wrapping preparation
- layer-specific export
- data-only export
- downstream worldbuilding tool integrations

At minimum provide structured export-ready access paths for:
- terrain/elevation data
- hydrology data
- biome/surface paint data
- regions
- symbols/landmarks
- labels

These export hooks should be clean and centralized, not scattered across random components.

---

### 9) Add projection/globe-prep metadata hooks
Because later phases will move toward globe wrapping/export, ensure the persisted structure carries the right contextual metadata.

At minimum include hooks or metadata for:
- map dimensions/resolution
- flattened-global-canvas assumptions
- coordinate-space conventions
- seam-related awareness if applicable
- later globe/export transform compatibility

You do not need to solve all seam/globe behavior here, but the persistence model should not forget the data context needed later.

---

### 10) Preserve compatibility with the shared layer architecture
Persistence should reflect the editor’s real layer and object model.

Requirements:
- saved structure represents paint layers, hydrology, regions, symbols, labels, and masks coherently
- visibility/editability/metadata are saved where appropriate
- persistence does not bypass the shared Phase 3 architecture with separate hidden representations
- later layer reordering/grouping remains possible

This prompt should reinforce the architecture, not create a second incompatible one.

---

### 11) Preserve compatibility with prior tools and workflows
The persistence system must coexist cleanly with:
- navigation/pan/zoom
- terrain/elevation editing
- hydrology
- biome/surface paint
- regions/overlays
- symbols/landmarks
- labels/text
- selection/mask utilities

Do not break earlier functionality.

Saving/loading should restore into the same systems users already edit with.

---

### 12) Preserve flattened globe compatibility
All persisted authored data must remain compatible with later globe wrapping/export.

Important:
- store authored content in flattened global map/world-space coordinates or coordinate-aligned structures
- avoid screen-space-only persistence
- preserve enough coordinate metadata for later globe interpretation
- consider seam-safe data assumptions where practical

Later globe conversion must be able to interpret saved Phase 3 content as real world-surface data.

---

### 13) Preserve undo/redo compatibility where practical
If undo/redo already exists, ensure save/load integration does not corrupt it.

Useful behaviors may include:
- clear action boundaries around load/import
- reset or reinitialize history safely when a project is loaded if appropriate
- avoid hidden mutations during serialization
- keep persisted authored state separate from transient history stacks unless history persistence is intentionally supported

You do not need to persist the full undo history unless the current architecture already expects that, but the system should remain stable.

---

### 14) Add documentation comments or lightweight developer notes
Where helpful, add concise comments or brief technical notes explaining:
- persistence schema structure
- what is intentionally transient vs persisted
- where future migrations/export flows should extend the system

Keep documentation brief and useful. Do not create excessive noise.

---

### 15) Keep performance reasonable
Persistence operations should remain practical for reasonably large maps.

Take sensible measures such as:
- efficient serialization of paint-layer data
- avoiding unnecessary duplication during export/serialization
- not blocking the entire editor with obviously wasteful conversions if avoidable
- choosing storage representations that are realistic for world-scale authored data

Do not overengineer prematurely, but do not knowingly choose a format that will obviously collapse as data grows.

---

## UX expectations
By the end of this prompt, the user should be able to:
- save a project/document containing real authored world-map data
- load that saved project/document back into the editor
- see authored terrain/paint/hydrology/regions/symbols/labels restored correctly
- understand that the editor is now becoming a durable creative tool rather than an ephemeral sandbox

The flow should feel like the project has crossed into “real software” territory.

---

## Implementation guidance
Prefer:
- typed persistence schema models
- centralized serializer/deserializer modules
- explicit versioned project/document format
- clean separation between persisted authored data and transient session state
- structured export-hook modules for later phases

Avoid:
- serializing raw UI component state indiscriminately
- storing persisted map content only as temporary visual artifacts
- scattering save/load logic across unrelated feature components
- creating a second hidden data model that conflicts with the shared editor architecture
- breaking existing authoring workflows during restore/load

---

## Deliverables
Implement:
- a versioned project/document persistence schema
- serialization for major Phase 3 authored systems
- deserialization/load restoration
- at least one real save/load workflow
- validation/error handling for load
- export hooks for later downstream flows
- any necessary state/store/type updates
- concise technical notes/comments if helpful

Also update light internal comments/docs if helpful for future prompt continuity.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. The editor has a coherent versioned persistence schema for major authored project data.
2. Major Phase 3 authored systems serialize into that schema in a real structured way.
3. The editor can load/restore saved project data back into the shared authoring architecture.
4. At least one real save/load round-trip works end-to-end.
5. Bad or malformed load data is handled at least in a basic but real way.
6. Export-oriented hooks exist for later phases without requiring major rework.
7. Existing terrain, hydrology, paint, regions, symbols, labels, masks, navigation, and editor systems are not broken.
8. The implementation remains compatible with flattened-globe-safe data assumptions.
9. The code leaves a clean path for Phase 4 globe/export work.

---

## What not to do
Do not:
- build the full final globe export UX here
- build every possible storage backend here
- overcomplicate migrations far beyond current needs
- rewrite the entire app state architecture unless truly necessary

This prompt is about making Phase 3 durable and export-ready, not finishing all publication/export features.

---

## Final instruction
Implement the persistence schema and export-hook foundations cleanly and completely, with a real save/load round-trip working for major authored map data and a strong architectural path into Phase 4.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
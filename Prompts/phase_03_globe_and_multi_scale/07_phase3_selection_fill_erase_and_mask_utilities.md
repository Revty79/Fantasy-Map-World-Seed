# Phase 3 — Selection, Fill, Erase, and Mask Utilities

## Objective
Build the shared selection, fill, erase, and mask utility system for **World Seed Mapper** so users can perform precision editing across hydrology, biome/surface paint, regions, symbols, and labels without relying only on raw brush strokes.

This prompt should establish real utility workflows for:
- area selection
- object selection
- lasso/rectangular selection where appropriate
- fill/bucket-style operations
- erase/clear operations
- editable masks and protected areas
- selection-aware editing across existing Phase 3 systems
- future compatibility with export, globe wrapping, and advanced editing workflows

This system should feel like the editor’s precision-tool layer, not a temporary debugging helper.

---

## Context
Earlier phases already established:
- flattened-globe-safe map canvas assumptions
- procedural terrain generation
- elevation/heightmap editing
- Phase 3 authoring workspace foundation
- shared authoring/tool/layer state
- reusable brush engine and paint-layer foundations
- hydrology authoring tools
- biome and surface painting
- regions, boundaries, and overlays
- symbols, stamps, and landmarks
- labeling and text tools

This prompt should build on those systems rather than bypass them.

Selection and mask utilities should:
- operate in map/world space
- remain editable and persistence-friendly where needed
- coexist cleanly with terrain, water, paint, overlays, symbols, and labels
- improve authoring precision for both area-based and object-based workflows

---

## Required outcome
When complete, the app should support a real workflow where the user can:
1. select areas of the map using at least one area-selection method
2. select placed objects/features using a consistent shared selection model
3. fill selected areas where appropriate
4. erase/clear selected data where appropriate
5. create or use masks to limit editing
6. see clear visual feedback for active selections and masks
7. keep selection/mask data aligned to the flattened world canvas for later globe conversion

At least one full **area selection + fill/erase workflow** and one full **object selection utility workflow** should be functional by the end of this prompt.

---

## Core implementation tasks

### 1) Define shared selection and mask data models
Implement shared typed data structures for selection and masking.

At minimum support:
- selection id or active selection state
- selection type/category
- selection geometry or selected-entity references
- selection bounds
- selection visibility hooks
- selection editability hooks
- transient vs committed selection distinction where appropriate
- mask id or active mask state
- mask type/category
- mask geometry/data backing
- invert/union/intersect/subtract hooks if useful
- metadata fields for future export/worldbuilding integration

Support both broad families of selection:
- area/map-space selection
- object/feature selection

Do not hardcode the system only for one tool.

---

### 2) Implement a shared object selection model
Create a unified way to select existing authored features.

At minimum support selecting:
- hydrology features
- regions
- symbols/landmarks
- labels

Requirements:
- clicking a feature can select it when the relevant tool/mode allows
- selection state is centralized rather than reinvented per feature system
- selected object identity/type is available to the UI
- hover and active-selection feedback are visible
- future multi-select can be added without reworking everything

If multi-select is practical now, that is welcome, but at minimum the architecture should prepare for it.

---

### 3) Implement at least one area-selection workflow
Create a real area-selection workflow operating in map/world space.

Choose one or more approaches that fit the editor architecture, such as:
- rectangular marquee selection
- lasso selection
- magic-wand or contiguous-value selection hooks
- brush-defined mask selection
- polygon selection

Requirements:
- user can intentionally create an area selection
- the selection is visibly represented on the map
- the selection can be cleared/canceled
- selection data is structurally sound and reusable by later operations

At least one area-selection method must be complete and usable.

---

### 4) Implement fill/bucket-style operations
Add at least one real fill workflow that applies to authored map data.

Possible uses include:
- fill a biome/surface category into a selected area
- fill a mask into a region assignment
- fill a hydrology-area layer where appropriate
- fill a generic paint layer

Requirements:
- user can target a valid editable layer/system
- fill operates in real map/world-space authored data
- the result is visibly rendered
- fill uses the shared selection/mask infrastructure where appropriate
- the operation feels like a real editor feature, not a hidden test action

You do not need to support every content type equally in this prompt, but at least one end-to-end fill workflow must be real and usable.

---

### 5) Implement erase/clear workflows
Add shared erase/clear utilities for both area data and placed objects where appropriate.

At minimum support:
- clearing selected painted area data
- deleting or clearing selected objects/features where applicable
- clear/cancel selection
- reasonable handling of partial/in-progress selections/masks

Requirements:
- erase/clear behavior is explicit and understandable
- users can recover from mistakes more precisely than only with manual repainting
- erase utilities integrate with the shared editor architecture

This should not replace domain-specific deletion tools, but it should provide a stronger shared utility layer.

---

### 6) Implement mask foundations
Create a real editable mask concept for limiting or guiding edits.

Possible mask uses include:
- protecting areas from paint/erase
- restricting brush operations to masked areas
- temporary edit regions
- converting selection into mask
- mask visibility preview

Requirements:
- at least one active mask can exist in a real workflow
- the mask has visible feedback
- the mask can be applied to at least one editing workflow
- mask data is compatible with the map/world-space data model

The first implementation can be modest, but it must be real and extendable.

---

### 7) Support selection-to-operation handoff
Implement the shared plumbing that lets selections and masks drive other tools.

Examples:
- select area -> fill with biome
- select area -> erase surface paint
- select region/object -> inspect/edit/delete
- selection -> convert to mask
- mask -> constrain brush painting

Requirements:
- the handoff structure must be centralized and reusable
- operations should understand whether they apply to area data, objects, or both
- the editor should clearly show what the current target/action is

This is one of the main reasons this prompt exists, so the architecture matters.

---

### 8) Add clear visual feedback for selections and masks
Implement rendering for selections and masks on top of the map.

At minimum support:
- visible active selection outline and/or fill tint
- visible mask overlay or boundary
- hover/selection distinction where practical
- compatibility with pan/zoom
- reasonable readability over terrain, hydrology, paint, regions, symbols, and labels
- visibility toggles where appropriate

Rendering does not need final polish yet, but it must be stable and editor-readable.

---

### 9) Integrate utilities into the authoring UI
Add usable controls to the Phase 3 side panel and/or toolbar.

Useful controls include:
- active selection tool
- selection mode/type
- fill target/category/material
- erase/clear action
- convert selection to mask
- clear mask
- invert mask if practical
- object selection info
- selected item count placeholder if useful
- active target layer/system

The UI should make precision editing feel organized and intentional.

---

### 10) Integrate with the shared layer system
Selections and masks must participate appropriately in the Phase 3 layer/overlay architecture.

Requirements:
- selection/mask overlays can be shown/hidden where appropriate
- active editing target is clear
- masks can coexist with paint, hydrology, regions, symbols, and labels
- the system does not bypass the shared editor architecture with one-off temporary state everywhere

Selections may remain largely transient, but the architecture should still be coherent and centralized.

---

### 11) Preserve compatibility with prior map systems
Selection/fill/erase/mask utilities must coexist cleanly with:
- navigation/pan/zoom
- elevation tools
- hydrology
- biome/surface paint
- regions/overlays
- symbols/stamps/landmarks
- labels/text
- future export/globe-stage tooling

Do not break earlier functionality.

Interaction routing must remain mode-aware and stable.

---

### 12) Preserve persistence compatibility where needed
Not every selection must persist, but persistent masks or derived authored results must remain save/load/export friendly.

Requirements:
- any persisted mask or derived edited result is stored in real map/world-space aligned structures
- no dependence on temporary DOM/CSS-only visuals as the source of truth
- future save/load logic can consume persisted mask/edited data where applicable
- downstream systems can consume the results later without architectural rework

Transient selection state can remain transient, but the architecture should distinguish that clearly from persistent authored data.

---

### 13) Preserve flattened globe compatibility
All selection and mask operations must remain compatible with later globe wrapping.

Important:
- selections and masks must operate against flattened global map/world coordinates
- avoid screen-space-only persistence for anything authored or saved
- seam-safe data representation should be considered where practical
- later globe conversion must be able to interpret the resulting authored edits correctly

This system should edit world-surface data, not just screen decorations.

---

### 14) Preserve undo/redo compatibility
If undo/redo already exists, integrate selection-driven operations at sensible boundaries such as:
- completed fill
- completed clear/erase
- delete action
- convert selection to mask
- mask application commits

If undo/redo is not fully implemented yet:
- structure these actions so they can become clean undoable units later
- keep transient selection state separate from committed edited results
- avoid mutation patterns that will make history painful later

---

### 15) Keep performance reasonable
The selection and mask system should remain usable on large world maps.

Take sensible measures such as:
- localized updates
- efficient geometry or mask handling
- reasonable hit-testing
- avoiding unnecessary full-world rerenders when possible
- efficient visual overlays for selections/masks

Do not overengineer, but do not knowingly create a fragile bottleneck.

---

## UX expectations
By the end of this prompt, the user should be able to:
- choose a selection tool
- create an area selection
- use that selection for a real fill or erase action
- select authored objects consistently
- see clear selection and mask feedback
- understand that precision editing is now a real layer of the editor

The workflow should feel like a major usability upgrade for serious map authoring.

---

## Implementation guidance
Prefer:
- typed shared selection/mask models
- reuse of shared authoring state and side-panel systems
- world-space aligned selection/mask logic
- clean separation between transient selection state, persistent mask state, and committed authored edits
- centralized operation routing for fill/erase utilities

Avoid:
- scattering bespoke selection logic into every feature subsystem
- purely decorative non-functional selection overlays
- storing persisted selections/masks only as temporary screen visuals
- hardcoding everything to one content type such as biome paint
- breaking navigation or existing tool routing behavior

---

## Deliverables
Implement:
- shared selection and mask data models
- real object selection support
- at least one real area-selection workflow
- at least one real fill operation
- at least one real erase/clear operation
- at least one real mask workflow
- selection/mask rendering
- side-panel/toolbar integration
- any necessary state/store/type updates
- persistence hooks as appropriate

Also update light internal comments/docs if helpful for future prompt continuity.

---

## Acceptance criteria
This prompt is complete when all of the following are true:

1. The user can create at least one real area selection on the map.
2. The user can use a selection for at least one real fill or erase workflow.
3. The editor has a shared object-selection model for authored features.
4. At least one real mask workflow exists and affects editing in a visible way.
5. Selection and mask feedback render clearly on the map.
6. Selection/fill/erase/mask behavior integrates with the shared authoring UI and architecture.
7. Existing terrain, hydrology, biome/surface paint, regions, symbols, labels, navigation, and editor systems are not broken.
8. The implementation remains compatible with flattened-globe-safe data assumptions.
9. The code leaves a clean path for later export and advanced precision-edit tooling.

---

## What not to do
Do not:
- build a fully advanced Photoshop-style selection suite here
- build the final export/globe system here
- rewrite the renderer unless truly necessary

This prompt is about real shared precision-editing utilities, not every future advanced editing feature.

---

## Final instruction
Implement the selection, fill, erase, and mask utility system cleanly and completely, with at least one real area-selection workflow, one real fill/erase workflow, and one real mask workflow working end-to-end in the editor.

When finished, update `/prompts/STATUS.md`:
- check off this prompt
- fill in its Run Log entry with concise implementation notes, files touched, and follow-ups
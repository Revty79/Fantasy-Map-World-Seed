# 01 — Height Layers, Chunk Storage, and Edit Targets

## Objective
Implement the first real **elevation-capable layer workflow** for World Seed Mapper so the editor can create, manage, target, display, and persist terrain-aware layers backed by chunk/tile-based height storage.

This prompt is where terrain stops being only a data model and becomes a real editable map system inside the live editor.

---

## Why this prompt exists
Prompt 00 defined the terrain backbone:
- elevation-aware layer contracts
- height value semantics
- terrain chunk storage structures
- terrain sampling/query helpers
- runtime/editor separation

Now the live editor needs to actually use those foundations.

The user should be able to:
- create terrain/elevation layers
- see them in the layer panel
- select them as terrain edit targets
- inspect them meaningfully
- initialize and manage chunked height data
- keep terrain state coherent with visibility, locking, active layer rules, and persistence foundations

This prompt creates the real terrain layer system that sculpt tools will operate on next.

---

## Required outcome
By the end of this prompt, the app should have:

- real elevation-capable layers in the active map
- terrain/elevation layers visible and manageable in the layer panel
- chunk/tile-aware height storage actually attached to those layers
- a coherent active terrain edit target concept
- inspector integration for terrain layers
- tool/settings foundations aware of terrain targets
- terrain layer creation, selection, rename, visibility, lock, and opacity support
- basic terrain chunk creation/initialization rules
- runtime/editor handling of visible/loaded terrain chunks in a practical baseline form
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** implement sculpt brushes yet.
- Do **not** implement contour/relief rendering yet beyond what is minimally helpful for proving the layer exists.
- Do **not** abandon the existing layer architecture unless there is a clearly documented structural issue.
- Do **not** brute-force one giant height grid if the chunk-aware design can be used.
- Do **not** mix runtime terrain cache state into persisted layer data.
- Do **not** make terrain layers behave like generic paint layers with no terrain-specific identity.

---

## Main goal
Create a terrain layer system that already feels like the beginning of a serious terrain editor:

- the user can add an elevation layer
- select it
- understand that it is the current terrain target
- see terrain-specific information in the UI
- rely on chunk-aware height storage existing behind it
- prepare for sculpt tools in the next prompt

This should feel functional, not decorative.

---

## What to build

### 1) Real elevation-capable layers in the layer stack
Integrate terrain/elevation-capable layers into the live map layer system.

Requirements:
- elevation-capable layers can be created on the active map
- they appear in the layer panel as real typed layers
- they have terrain-specific identity, not generic placeholder identity
- they participate in selection, ordering, visibility, lock, and opacity rules

At minimum, terrain/elevation layers should be first-class citizens in the same general layer system as other map content.

---

### 2) Supported terrain layer kinds
Implement practical support for the terrain-related layer kinds defined in the Phase 2 model.

At minimum, support creation/display of:
- elevation / height layer
- optional derived terrain preview/helper layer structures only if they fit naturally
- group/container compatibility if your layer system uses groups

Do not create a pile of speculative terrain layer types.  
Create only what is needed for a strong Phase 2 foundation.

A good baseline is:
- one strong elevation layer type
- room for derived terrain displays later

---

### 3) Terrain layer row UI
Make terrain layers clearly distinguishable in the layer panel.

Each terrain layer row should communicate useful information such as:
- layer name
- terrain/elevation type
- visibility state
- lock state
- selection state
- opacity
- maybe terrain chunk count or resolution hint if useful
- maybe terrain edit-target indicator if active

Nice additions if natural:
- terrain icon/badge
- chunk count hint
- current target indicator
- compact terrain metadata hint

Avoid clutter.  
Make terrain layers easy to scan and understand.

---

### 4) Terrain layer creation flow
Add a usable “add terrain layer” flow.

Requirements:
- user can create a new terrain/elevation layer from the layer panel or relevant layer creation flow
- the new terrain layer gets a sensible default name
- the new terrain layer is inserted in a sensible place in the stack
- it becomes selected
- it can become the active terrain edit target
- terrain creation uses the terrain factories/helpers from Prompt 00 where practical

This should feel lightweight and real.

---

### 5) Active terrain edit target
This is one of the most important parts of the prompt.

The editor needs a clear concept of:
- selected layer
- active terrain target
- whether the target is editable

Requirements:
- a visible/unlocked terrain layer can become the active terrain edit target
- the editor can clearly tell which terrain layer sculpt tools would operate on
- hidden/locked terrain layers cannot be active edit targets unless your rules explicitly allow inspectable but non-editable selection
- changing selection/tool/layer state resolves the target coherently

A good baseline:
- the selected visible/unlocked terrain layer becomes the active terrain target
- the UI clearly communicates this
- if no valid terrain layer is selected, the terrain target is empty and the user is guided clearly

This should reduce future confusion enormously.

---

### 6) Terrain layer inspector integration
Upgrade the inspector for terrain/elevation layers.

At minimum show:
- layer name
- layer type
- visibility
- lock state
- opacity
- terrain metadata such as:
  - resolution
  - chunk size
  - sea level
  - stored value convention summary
- chunk/content summary
  - number of existing chunks
  - whether terrain data is empty or initialized
- target/editability state

Optional light editing if natural:
- rename layer
- adjust opacity
- tweak sea level metadata
- basic terrain resolution metadata if safe to expose

Do not overbuild the inspector, but it should feel terrain-aware.

---

### 7) Terrain tool-settings awareness
Even though sculpt tools are next, the editor should begin understanding terrain context now.

A good outcome:
- if a terrain layer is active, the tool settings area can show terrain-target context
- if no valid terrain target exists, the tool/settings area can say so clearly
- terrain editing controls can have a placeholder home without pretending the tools already exist

This prompt does not need full terrain controls yet, but it should prepare the editor surface for them.

---

### 8) Chunk-aware height storage hookup
Attach real chunk/tile-aware height storage to terrain layers.

Requirements:
- terrain layers actually own terrain chunk data through the document model
- chunk access is keyed and structured cleanly
- chunks are not all eagerly created if sparse creation is cleaner
- the active map can contain terrain data without forcing a single monolithic structure

This is not just “the type exists.”  
The live editor layer now needs the actual terrain data container attached and usable.

---

### 9) Terrain chunk initialization rules
Define and implement practical terrain chunk initialization behavior.

Questions to answer:
- when does a chunk come into existence?
- immediately when the terrain layer is created?
- lazily when touched?
- should there be a default empty terrain state?
- how are initial height values set?

A strong baseline:
- terrain layers begin with a logically empty terrain dataset
- chunks are created lazily when first needed
- initial sample values are set to a consistent default height/sea-level-relative baseline

Whatever rule you choose:
- keep it consistent
- keep it practical for large maps
- document it in code/comments/`STATUS.md` if useful

---

### 10) Terrain chunk indexing and access helpers in live use
Move from pure model helpers to real editor use.

Requirements:
- terrain layers can request chunk creation/access through shared helper logic
- editor/runtime code can query which chunks exist for a terrain layer
- future sculpt tools will be able to ask for:
  - chunk at coordinate
  - create-if-missing behavior
  - terrain sample neighborhood access

You do not need sculpting yet, but the live layer system should now make those future calls straightforward.

---

### 11) Visible/loaded terrain chunk runtime foundation
Create a practical runtime concept for terrain chunks that are:
- present in the document
- visible in the current map
- active in the current viewport/runtime

This should remain separate from persisted document data.

A good baseline:
- runtime helpers can determine which terrain chunks intersect the current viewport
- terrain layer visibility affects whether those chunks matter
- runtime state can track visible chunk ranges or active chunk sets
- later sculpt/render prompts can build on that instead of reinventing it

This does **not** need a full optimized streaming system yet.  
It does need a real runtime foundation.

---

### 12) Terrain layer visibility and locking rules
Make terrain layers obey coherent editing rules.

Requirements:
- hidden terrain layers are not active edit targets
- locked terrain layers are not active edit targets
- hidden terrain layers should not be considered visible terrain contributors in later preview paths
- terrain layer selection and terrain target rules should remain understandable

This needs to feel consistent with the rest of the editor.

---

### 13) Terrain layer ordering and grouping behavior
Terrain layers should participate cleanly in layer ordering/grouping.

Requirements:
- terrain layers can be reordered like other layers
- group/container behavior should not break terrain identity
- ordering is preserved in document state
- the renderer/runtime structure has a clear place for terrain-aware layer handling later

Do not overbuild terrain compositing here, but terrain should not feel excluded from the layer architecture.

---

### 14) Default starter terrain layer behavior
Decide how terrain layers appear in a new or default terrain-ready workflow.

Good options:
- no terrain layer by default until the user creates one
- or one sensible starter elevation layer for terrain workflows

My recommendation:
- keep normal project boot modest
- but make terrain layer creation easy
- optionally create a starter terrain layer when entering terrain workflows or via a clear “Add Elevation Layer” action

Whichever you choose, keep it intentional and document it honestly.

---

### 15) Terrain panel and layer feedback
The layer panel and related UI should begin acknowledging terrain content.

Nice examples:
- chunk count hint
- terrain target marker
- empty terrain badge vs initialized terrain badge
- terrain icon
- resolution hint

Keep it restrained but informative.

---

### 16) Runtime/editor state organization
Refine shared state so terrain-specific editor context is represented cleanly.

At minimum support:
- active terrain layer id / target id
- terrain editability status
- terrain-visible chunk runtime info or hooks for it
- terrain-related UI context
- future sculpt session state readiness

Do not scatter terrain edit-target state across random components.

---

### 17) Integration with persistence foundations
Terrain-capable layers and terrain chunk data should be compatible with the existing save/load architecture.

You do **not** need to fully harden terrain persistence here if Prompt 08 will deepen it, but:
- terrain data structures used here should be serializable cleanly
- terrain layers should not rely on runtime-only data to exist meaningfully
- the persistence path should not be contradicted

Be honest in `STATUS.md` if persistence support is structurally ready but not yet fully exercised.

---

### 18) Minimal visual proof of terrain layer presence
You do not need full terrain rendering yet, but the editor should provide **some** practical proof that terrain layers are real and present.

Good options:
- inspector summaries
- chunk debug indicators
- subtle viewport overlay for terrain target bounds/chunk cells
- lightweight terrain debug preview only if it is cheap and clean

Do not let this turn into Prompt 04 early.  
Just make the terrain layer feel real enough that the user knows it exists.

---

### 19) Performance guidance
This prompt must keep the terrain system scalable.

Aim for:
- sparse chunk creation
- shared helper-based chunk access
- runtime visible-chunk evaluation foundations
- minimal unnecessary React rerenders for terrain-layer metadata changes
- clear separation between document terrain data and runtime chunk state

Avoid:
- eagerly allocating the full map terrain grid
- giant terrain arrays created just because a layer exists
- storing runtime-visible chunk sets in persisted document data
- mixing future render caches into terrain layer documents

---

### 20) UX guidance
The terrain layer workflow should feel deliberate and understandable.

Aim for:
- obvious terrain layer identity
- clear active terrain target feedback
- readable inspector information
- coherent handling of hidden/locked terrain layers
- easy terrain layer creation
- no mystery about whether sculpt tools would have a valid target

Avoid:
- terrain layers that look identical to generic layers
- silent failure when no valid terrain target exists
- too much raw debug data in the UI
- clumsy terrain creation flows

This is the point where terrain becomes a real part of the editor.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/terrain/...`
- `src/components/panels/LayersPanel...`
- `src/components/panels/Inspector...`
- `src/store/editorActions/terrain...`
- `src/engine/terrain/...`
- `src/lib/terrain/...`

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- terrain/elevation layers can be created on active maps
- terrain layers appear as real typed layers in the UI
- terrain layers have real chunk-aware height storage attached
- the editor has a coherent active terrain edit target concept
- terrain layer selection, visibility, locking, and opacity work coherently
- inspector/tool-settings areas meaningfully acknowledge terrain context
- runtime visible-chunk foundations exist for terrain layers
- the architecture remains compatible with persistence and later sculpt tools
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- compact terrain-target badge in the layer list
- terrain chunk count display in the inspector
- auto-select newly created terrain layer as edit target
- lightweight visible-chunk debug overlay toggle
- quick “make active terrain target” action

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- real elevation-capable layers in the editor
- chunk-aware height storage attached to terrain layers
- a coherent active terrain edit target system
- terrain-aware inspector/tool-settings foundations
- runtime visible-chunk groundwork for terrain
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should feel like it truly has terrain layers, not just terrain types on paper.

A user should be able to create an elevation layer, select it, understand that it is the active terrain target, and trust that the terrain data system is live and ready for sculpting.

That is the bar.
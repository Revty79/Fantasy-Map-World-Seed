# 03 — Landform Tools: Ridges, Basins, Plateaus, Terraces

## Objective
Implement the first real **landform-shaping tools** for World Seed Mapper so the user can create higher-level terrain forms such as **ridges**, **basins**, **plateaus**, and **terraces** with more intent and speed than raw brush sculpting alone.

This prompt is where terrain editing starts feeling like terrain design, not just terrain pushing.

---

## Why this prompt exists
Prompt 02 added the baseline sculpt brushes:
- raise
- lower
- smooth
- flatten

Those are essential, but they are still low-level.

A serious worldbuilding terrain tool also needs faster ways to create meaningful landforms:
- mountain chains
- ridgelines
- basins
- high plains
- stepped mesas
- shelf-like elevation changes
- shaped depressions

This prompt should establish higher-level authored terrain tools that:
- remain editable
- respect chunk-aware terrain storage
- work in document space
- integrate with history and the editor state model
- feel intentional rather than procedural

---

## Required outcome
By the end of this prompt, the app should have:

- real landform-oriented terrain tools or modes
- practical workflows for:
  - ridge creation
  - basin creation
  - plateau creation
  - terrace creation
- visible previews for in-progress landform operations
- chunk-aware application of landform edits
- tool settings for landform behavior
- coherent interaction rules for creation, adjustment, commit, and cancel
- history integration for committed landform operations
- inspector/tool settings context for active landform tools
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** build a full procedural terrain generator.
- Do **not** build tectonic simulation.
- Do **not** replace the core sculpt brushes; these tools should complement them.
- Do **not** depend on future climate/hydrology systems being finished.
- Do **not** brute-force full-map recalculation for each operation when localized edits are possible.
- Do **not** mix transient preview geometry/state into persisted terrain documents.
- Do **not** make the landform tools feel like black-box magic with no understandable controls.

---

## Main goal
Create higher-level terrain tools that already feel like the beginning of a serious terrain authoring suite:

- the user chooses a landform tool
- defines the intended form on the map
- sees a live preview
- commits the landform
- gets a coherent terrain result
- can still refine it afterward with sculpt brushes

This should feel like purposeful terrain construction.

---

## What to build

### 1) Landform tool foundation
Add real landform tools or submodes to the terrain tool workflow.

At minimum include support for:
- ridge
- basin
- plateau
- terrace

These may exist as:
- separate tool entries
- or a shared landform tool with selectable landform mode

Either approach is acceptable if the UI is clear.

Requirements:
- one active landform mode at a time
- active mode is obvious in the UI
- tool settings update based on the selected landform mode
- the editor clearly distinguishes landform creation from ordinary sculpt brushing

---

### 2) Valid terrain target behavior
Landform tools must only operate on valid active terrain layers.

Requirements:
- landform tools require a valid visible/unlocked terrain target
- hidden terrain layers are not landform targets
- locked terrain layers are not landform targets
- if no valid terrain layer exists, the UI should guide the user clearly
- landform operations should not silently fail

This should behave consistently with the sculpt brush rules.

---

### 3) Landform interaction model
Define and implement a coherent interaction model for landform creation.

Good baseline options include:
- click-drag to define a line, width, and influence area
- click-place anchor points then confirm
- drag a bounding region then adjust settings before commit

Requirements:
- the chosen model must be understandable
- the same tool should behave consistently
- in-progress previews must be visible
- Enter/confirm can commit if appropriate
- Escape can cancel safely
- landform operations should have clear start and end boundaries

Do not make these tools feel mysterious or overly modal.

---

### 4) Ridge tool behavior
Implement a ridge-creation workflow.

A ridge tool should help the user create raised linear terrain features such as:
- mountain spines
- hill chains
- raised divides
- long continental uplifts

Requirements:
- user can define the ridge path or axis in document space
- user can control at least some combination of:
  - height/intensity
  - width
  - falloff
  - sharpness or profile shape
- resulting terrain raises coherently around the ridge axis
- the effect feels directional and landform-like, not like a blurry round brush dragged around

A strong baseline:
- ridge defined from a path or segment
- elevation falloff based on distance from that path
- coherent application across terrain chunks

The ridge tool should feel like a real terrain-shaping shortcut.

---

### 5) Basin tool behavior
Implement a basin-creation workflow.

A basin tool should help create:
- depressions
- bowls
- inland lowlands
- crater-like or sink-like terrain forms
- future lake basins

Requirements:
- user can define basin center/area in document space
- user can control at least:
  - depth/intensity
  - radius/width
  - falloff/profile
- resulting terrain lowers coherently toward the basin center or defined area
- the effect should feel shaped, not like just “lower brush but bigger”

A strong baseline:
- circular or elliptical basin creation is acceptable at first
- profile can be simple but should be intentional

This tool should be especially useful for building terrain that later supports water placement.

---

### 6) Plateau tool behavior
Implement a plateau-creation workflow.

A plateau tool should help create:
- broad elevated areas
- mesas
- raised plains
- table-like terrain zones
- highland shelves

Requirements:
- user can define an area or region in document space
- user can set target elevation and transition behavior
- the tool creates a relatively flatter interior region with a controlled edge transition
- result should feel distinct from just “flatten” brushed over a broad area

A strong baseline:
- define area
- raise/flatten toward plateau height
- controlled edge falloff around the plateau boundary

This tool should feel like a terrain form, not just a convenience macro.

---

### 7) Terrace tool behavior
Implement a terrace-creation workflow.

A terrace tool should help create:
- stepped elevation bands
- mesa-side tiers
- shelf-like terrain transitions
- stylized terrain breaks
- useful fantasy-map land shape stylization

Requirements:
- user can define area or affected region
- user can control step count, spacing, or step height in some practical way
- resulting terrain becomes quantized or stepped in a controlled way
- the effect is understandable and previewable

A good baseline:
- take current terrain in region
- quantize toward a limited number of elevation bands or step intervals
- keep transitions understandable

This does not need to be perfect geological realism.  
It needs to be a useful terrain design tool.

---

### 8) In-progress preview overlays
This is a major part of the prompt.

Landform tools must show meaningful preview feedback before commit.

At minimum:
- preview the intended ridge axis / basin area / plateau area / terrace region
- show influence width/radius if relevant
- show the operation footprint clearly on the canvas
- indicate blocked/invalid target state visually if practical

Good optional additions:
- ghost relief preview
- edge/falloff guide lines
- centerline and control points
- preview shading differences if cheap and clear

Do not persist previews as authored content.  
Keep them in runtime/editor overlay space.

---

### 9) Tool settings for landforms
The tool settings panel should meaningfully support landform creation.

At minimum consider support for:
- width / radius
- height / depth / target elevation
- falloff
- sharpness/profile
- terrace step settings
- plateau edge softness
- target terrain layer info

These settings should:
- update based on active landform mode
- be understandable
- avoid overwhelming the user with unexplained math

A smaller set of good controls is better than an overgrown pile.

---

### 10) Landform profile semantics
Define practical profile behavior for landforms.

Examples:
- ridge profile can be peaked, rounded, or simple linear falloff
- basin can be bowl-like or smooth depression
- plateau can be flat-top with softened edges
- terrace can quantize heights into steps

You do **not** need a huge profile library now.  
But the effects should not all feel like the same blurred stamp.

Use clear, consistent internal semantics.

---

### 11) Chunk-aware landform application
Landform operations must update chunk-based terrain data coherently.

Requirements:
- affected chunks are identified from the operation footprint
- edits are localized to relevant chunks
- cross-chunk continuity is preserved as well as practical
- chunk creation occurs if missing and appropriate
- operations use shared terrain chunk helpers rather than duplicating brittle math everywhere

This is real terrain authoring, not a visual trick.

---

### 12) Terrain sampling and application helpers
Add landform-specific terrain helpers/utilities where needed.

Examples:
- apply distance-to-line falloff for ridge shaping
- apply radial/elliptical basin influence
- apply region flatten/plateau blending
- apply quantized step/terrace transforms
- region bounds and footprint helpers
- terrain blending profiles

Keep these helpers organized and reusable.

They will likely matter later for more advanced terrain tools too.

---

### 13) Commit / cancel / edit lifecycle
Define a coherent lifecycle for landform operations.

Good baseline:
- start defining the form
- adjust relevant preview state
- commit once satisfied
- cancel safely without modifying the terrain
- history entry created on commit only

This should clearly separate:
- preview state
- live runtime interaction state
- committed terrain modification

Do not let partial preview state leak into authored data.

---

### 14) History integration
Landform operations should integrate sensibly with history.

Requirements:
- each committed landform action becomes a meaningful history entry
- undo restores prior terrain state coherently
- redo reapplies coherently
- history granularity is operation-level, not every pointer move tick
- payload size remains practical where possible

This is important because landform tools can make large terrain changes quickly.

Be practical and honest in `STATUS.md` about any current limitations.

---

### 15) Minimal visible terrain feedback after commit
The user must be able to tell that a landform operation changed the terrain.

You still do not need full Prompt 04 visual richness yet, but committed landform changes must have visible enough feedback to use.

Good options:
- improved debug terrain shading
- local grayscale/surface feedback
- contour-ish preview stubs if they fit cheaply
- inspector/status terrain sample readouts
- visible preview refresh in affected area

Do not consume Prompt 04 early, but do not leave landform tools visually blind.

---

### 16) Inspector integration
The inspector should acknowledge active landform context.

At minimum show:
- active terrain layer
- active landform mode
- current relevant settings
- operation validity / blocked state
- maybe last committed operation summary if useful

If selected terrain layer is active, the inspector can also show terrain metadata that matters to landform tools.

This should help the user stay oriented.

---

### 17) Status bar integration
The status bar should reflect landform workflow where helpful.

Examples:
- active tool/mode: Ridge / Basin / Plateau / Terrace
- active terrain layer
- key setting summary such as width, strength, target elevation, or step count
- cursor coordinates
- blocked/invalid target message if relevant

Keep it concise but useful.

---

### 18) Performance guidance
This prompt must keep terrain editing scalable.

Aim for:
- localized computation to affected chunks/regions
- reusable math helpers
- preview overlays that are runtime-only and lightweight
- no giant full-map recompute on every preview movement
- history committed only at operation boundaries
- minimal unnecessary React churn during preview

Avoid:
- brute-force recalculating the entire terrain dataset
- preview behavior that becomes visibly sluggish
- history snapshots for every tiny preview adjustment
- storing large transient preview data in persisted documents

---

### 19) UX guidance
The landform tools should feel intentional and empowering.

Aim for:
- clear distinction between each landform mode
- visible preview before commit
- settings that map to intuitive outcomes
- ridge feels directional
- basin feels hollowed
- plateau feels flat-topped
- terrace feels stepped
- cancel/confirm behavior is coherent

Avoid:
- four tools that all feel like the same blur
- no preview feedback
- unexplained settings
- operations that commit too early or too opaquely
- wrong-layer silent failure

This is where terrain authoring starts to feel like design, not just sculpting.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/terrain/tools/landforms/...`
- `src/engine/terrain/landforms/...`
- `src/lib/terrain/landforms/...`
- `src/engine/overlays/...`
- `src/store/editorActions/terrain...`
- `src/components/panels/ToolSettings...`

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- the editor has real landform tools or modes for ridge, basin, plateau, and terrace
- a valid terrain target is required and handled coherently
- in-progress landform previews are visible
- ridge, basin, plateau, and terrace each produce meaningfully distinct terrain results
- landform operations update real chunk-based terrain data
- tool settings reflect active landform context
- committed operations participate sensibly in history
- the live editor provides enough feedback to use the tools meaningfully
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- simple profile preset dropdown
- ellipse support for basins/plateaus
- ridge polyline support beyond a single segment
- terrace preview bands
- editable last-operation handles before commit
- quick “soften after commit” action

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- real landform-oriented terrain tools
- ridge, basin, plateau, and terrace workflows
- preview overlays and settings for landform creation
- chunk-aware terrain application for higher-level landforms
- history integration for committed landform operations
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should no longer feel limited to generic terrain brushing.

A user should be able to deliberately build ridges, carve basins, form plateaus, and create terraces in a way that feels like purposeful world shaping.

That is the bar.
# 07 — World, Region, and Local Terrain Workflows

## Objective
Implement the first coherent **multi-scale terrain workflow** for World Seed Mapper so elevation, terrain editing, terrain preview, hydrology assist, and biome assist all work sensibly across **world**, **region**, and **local** maps without breaking the nested-map model established in Phase 1.

This prompt is where terrain stops being “per-map only” and becomes part of the real world → region → local authoring system.

---

## Why this prompt exists
By this point, Phase 2 should already have:
- terrain-capable layers
- chunk-aware height data
- sculpt brushes
- landform tools
- terrain preview modes
- hydrology assistance
- biome assistance

That means the editor now has meaningful terrain systems — but they still need to behave coherently across the project’s core nested-map structure:
- world maps
- region maps
- local maps

A serious worldbuilding tool cannot treat terrain on each map as isolated chaos.

This prompt should establish the first practical rules and workflows for:
- creating child-map terrain from parent-map terrain context
- deciding when child terrain is copied, derived, or independent
- navigating and editing terrain across scales
- keeping the system understandable to the user

Do this cleanly. Multi-scale terrain confusion will poison the whole product if the rules are vague.

---

## Required outcome
By the end of this prompt, the app should have:

- a clear terrain workflow across world, region, and local maps
- practical terrain-aware child-map creation behavior
- coherent rules for parent-derived vs independent terrain state
- terrain preview/edit behavior that respects active map scope
- UI/panel support for understanding terrain lineage and map-scope terrain context
- practical copy/seed/derive behavior when creating child maps from parent extents
- save/load compatibility for multi-map terrain content
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** build full live bi-directional terrain sync across parent and child maps.
- Do **not** create vague magical inheritance rules that users cannot reason about.
- Do **not** break the existing Phase 1 nested-map architecture.
- Do **not** force every child map to remain permanently coupled to the parent if a cleaner authored workflow is better.
- Do **not** overbuild GIS-grade resampling/projection systems.
- Do **not** turn this into a terrain version-control project.
- Do **not** remove user control in the name of “smart” hierarchy.

---

## Main goal
Create a terrain workflow across map scopes that already feels like the beginning of a real worldbuilding suite:

- a world has terrain
- a region can be made from part of that world
- that region can start with terrain derived from the parent area
- the user can continue shaping it
- a local map can do the same
- the editor makes it clear what is inherited, copied, or now independent

This should feel powerful and understandable.

---

## What to build

### 1) Terrain-aware multi-map foundation
Extend the live editor so terrain systems behave coherently across:
- `world`
- `region`
- `local`

Requirements:
- terrain tools operate against the active map’s terrain context
- terrain preview reflects the active map’s terrain layers
- hydrology and biome assists respect the active map scope
- the system no longer feels “world-only” in terrain terms

This prompt is about making terrain a real part of the nested-map workflow.

---

### 2) Child-map terrain creation rules
Define and implement clear rules for what happens to terrain when a child map is created from a parent extent.

This is one of the most important decisions in the prompt.

A strong practical baseline is:
- child maps are created from a parent extent
- terrain for the child may be **seeded/copied/derived at creation time**
- once created, the child terrain is an **independent authored terrain space**
- parent relationship metadata remains visible
- advanced live sync is deferred

This is probably the safest and most usable rule set for Phase 2.

Whatever exact rule you choose:
- make it explicit
- apply it consistently
- surface it clearly in the UI and `STATUS.md`

Do not leave this vague.

---

### 3) Terrain seeding from parent extent
Implement a practical terrain seeding workflow when creating region/local maps.

Requirements:
- when a region or local map is created from a parent extent, terrain data can be initialized from the parent terrain in that extent
- the seeding should use a coherent sampling/copy strategy
- the user should start with meaningful terrain in the child map rather than a blank terrain void, if terrain seeding is chosen
- terrain seeding should work for world → region and region → local, and optionally world → local

A strong baseline:
- resample/copy parent terrain into the child map’s terrain layer space at creation time
- preserve the broad shape enough that the child map feels related to the parent

This is a signature feature. Make it feel intentional.

---

### 4) Child terrain initialization options
Give the user or the system a clear choice or default about child terrain initialization.

Good options:
- create child map with no terrain
- create child map with terrain seeded from parent extent
- create child map with seeded terrain plus a starter terrain layer
- possibly duplicate/derive terrain metadata sensibly from parent

My recommendation:
- default to **seed terrain from parent extent** when valid parent terrain exists
- allow a clear “blank terrain” alternative if practical

Requirements:
- behavior should be obvious
- not hidden behind magic
- not destructive to the parent

---

### 5) Parent-to-child terrain sampling / resampling
Implement a practical terrain sampling/resampling path for child-map seeding.

Requirements:
- parent terrain in the selected extent can be sampled into child terrain space
- the process must account for differences in:
  - map dimensions
  - child terrain resolution
  - child chunk layout
- the result should be structurally coherent, not just a random rough copy
- terrain data should remain chunk-aware in the child map

You do **not** need a perfect advanced resampler.  
A strong, practical baseline is enough if it is clean and understandable.

---

### 6) Parent terrain context visibility in child maps
Make it possible for the user to understand where child terrain came from.

At minimum provide practical context such as:
- this child terrain was seeded from parent extent
- show parent map relationship
- show source extent summary
- show whether the child terrain is still independent after seeding

This may appear in:
- inspector
- map info panel
- breadcrumb/map navigator
- child map metadata section

The user should not feel like terrain lineage is hidden.

---

### 7) Terrain lineage metadata
Extend the map or terrain metadata so terrain lineage is explicit where useful.

Examples:
- seeded from parent map id
- source extent bounds
- seed time/version metadata
- terrain derivation mode: `blank`, `seeded_from_parent`, or similar
- independence rule summary

Do not overbuild a full provenance engine.  
Just make the terrain relationship visible and trustworthy.

---

### 8) World → region terrain editing workflow
Make terrain editing in region maps feel like a natural refinement of world terrain.

Requirements:
- region maps created from world extents can start from seeded terrain
- region terrain tools work normally after creation
- region terrain does not feel blocked or second-class
- the editor clearly indicates that region terrain is now being edited in region scope
- preview/hydrology/biome systems all work against region terrain

This should feel like “zooming in to refine,” not starting over.

---

### 9) Region → local terrain editing workflow
Make terrain editing in local maps feel like a natural refinement of region terrain.

Requirements:
- local maps created from region extents can start from seeded terrain
- local terrain tools work normally after creation
- local terrain can be further refined independently
- active scope and terrain context remain obvious

The worldbuilding promise is:
- broad form at world scale
- stronger shape at region scale
- detailed terrain at local scale

This prompt should make that believable.

---

### 10) Active-map terrain context
Ensure terrain tools always operate against the **currently active map** and its terrain layers.

Requirements:
- switching maps updates terrain target context coherently
- terrain preview modes update to the active map
- hydrology and biome assists update to the active map
- no stale terrain-target bleed from previously active maps
- view reset / zoom / preview controls respect the active map bounds and terrain

This is important for trust and usability.

---

### 11) Multi-scale terrain UI cues
Surface terrain scope clearly in the UI.

At minimum make it obvious:
- which map is active
- whether it is world / region / local
- which terrain layer is active in that map
- whether the terrain was blank or parent-seeded
- where the child came from if relevant

Good places:
- top bar
- breadcrumb
- inspector
- map navigator
- status bar

This helps prevent “where am I editing?” confusion.

---

### 12) Child extent visualization with terrain context
Improve parent extent visualization so it is useful for terrain workflows too.

At minimum:
- child extents remain visible/selectable on parent maps where appropriate
- the user can tell that a region/local terrain came from a specific area
- opening the child from the extent remains practical
- terrain-related metadata or badges can be shown if useful

Optional if natural:
- a terrain-seeded badge on the extent
- quick “open child terrain” action
- preview summary of child terrain state

Keep it clear, not cluttered.

---

### 13) Terrain-specific map navigator support
If a map navigator/tree exists, improve it for terrain lineage/context.

Good outcomes:
- map hierarchy shows scope badges
- terrain-seeded vs blank child maps can be indicated
- current active map is obvious
- opening parent/child maps is easy
- current terrain context is easier to reason about

This is optional if existing navigation surfaces are already enough, but some terrain-aware hierarchy support will help a lot.

---

### 14) Terrain persistence across map scopes
Ensure terrain content across world/region/local maps remains persistence-compatible.

Requirements:
- seeded child terrain becomes real child terrain data
- save/load preserves terrain on each map separately
- parent-child relationship metadata remains intact
- the editor can reopen a project and still understand terrain lineage and independence rules
- no runtime-only assumptions are required for child terrain to exist

This is very important. Multi-map terrain must not be “session-only magic.”

---

### 15) Terrain export and scope behavior
Make sure terrain-related export behavior remains coherent with multi-scale maps.

Requirements:
- exporting a region map uses the region map’s terrain/content
- exporting a local map uses the local map’s terrain/content
- terrain lineage metadata can appear in JSON export if useful
- no export confusion about parent vs child terrain source

You do not need to add new export formats here, but the workflow should stay coherent.

---

### 16) Terrain preview consistency across scopes
Terrain preview systems should work coherently at every scope.

Requirements:
- relief, slope, contour, and height preview modes work on world maps
- they also work on region maps
- they also work on local maps
- preview settings remain understandable when switching between scopes
- child-map terrain preview does not accidentally read from the parent unless your explicit rule says so

This helps reinforce that each scope is a real terrain editing space.

---

### 17) Hydrology and biome assist scope behavior
Hydrology and biome assist workflows should behave cleanly across scopes.

Requirements:
- active map determines terrain source and analysis space
- seeded child terrain can be used immediately for flow, basin, lake, and biome assistance
- accepted river/biome outputs go into the active map’s compatible layers
- the system does not assume world-only analysis

This is an important proof that Phase 2 systems are truly multi-scale.

---

### 18) Copy / reseed / refresh guidance
Decide what limited maintenance workflows exist for seeded terrain.

A practical Phase 2 baseline may be:
- child terrain is seeded once and then independent
- no automatic refresh from parent
- no live sync
- optional future placeholder for “reseed from parent” if easy and clearly destructive/confirmable

If you include a reseed action:
- make it explicit
- warn before overwriting child terrain
- keep it simple and safe

Do not accidentally imply live sync if it is not there.

---

### 19) Performance guidance
This prompt must stay scalable.

Aim for:
- seed/copy/resample work occurring at meaningful creation boundaries
- active-map-centric terrain runtime state
- no need to keep all map terrains live at once
- sensible map-switch behavior
- no giant project-wide terrain recompute when switching scopes

Avoid:
- merging all terrains into one active scene
- stale runtime caches leaking across map switches
- full project terrain loads for unrelated actions
- vague “inherits everything live” rules that wreck performance and clarity

Be practical and honest about any current limits.

---

### 20) UX guidance
The multi-scale terrain workflow should feel powerful and understandable.

Aim for:
- child maps start with useful seeded terrain when appropriate
- active scope is always obvious
- the user understands whether terrain is inherited, copied, or independent
- moving between world, region, and local feels like a meaningful refinement workflow
- hydrology, biome, and preview tools all continue to work naturally at each scope

Avoid:
- hidden terrain lineage
- magical sync behavior
- users not knowing whether they are editing parent or child terrain
- blank child maps when the user expected derived terrain
- contradictory rules between world, region, and local behavior

This is one of the defining workflows of the whole product.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/maps/...`
- `src/features/terrain/...`
- `src/engine/terrain/multiscale/...`
- `src/lib/terrain/multiscale/...`
- `src/store/editorActions/maps...`
- `src/store/editorActions/terrain...`

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- terrain workflows behave coherently across world, region, and local maps
- child maps can be created with practical parent-terrain seeding
- parent-to-child terrain copy/resample behavior exists in a useful baseline form
- terrain lineage and independence rules are explicit and visible
- terrain tools, preview, hydrology, and biome assist all respect active map scope
- persistence/export compatibility remains coherent
- UI surfaces help the user understand terrain context and ancestry
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- optional reseed-from-parent action
- terrain-seeded badge in the map navigator
- extent overlay labels that mention terrain lineage
- child terrain creation choice on map-creation flow
- quick “open parent terrain context” action

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- coherent multi-scale terrain workflows
- parent-seeded child terrain creation
- explicit terrain lineage and independence rules
- active-scope-respecting terrain tools and previews
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should no longer feel like terrain exists only on isolated maps.

A user should be able to shape a world, spin off a region from that world with meaningful starting terrain, refine it, then do the same again at the local level in a way that feels coherent and powerful.

That is the bar.
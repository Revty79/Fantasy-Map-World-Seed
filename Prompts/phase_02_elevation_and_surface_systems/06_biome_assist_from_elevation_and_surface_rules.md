# 06 — Biome Assist from Elevation and Surface Rules

## Objective
Implement the first real **terrain-aware biome assistance system** for World Seed Mapper so the user can use authored elevation, slope, water proximity, and related surface cues to **suggest, guide, and improve biome placement** without turning Phase 2 into a full climate simulation engine.

This prompt is where terrain starts meaningfully informing ecology and surface classification.

---

## Why this prompt exists
By this point, the app should already have:
- terrain layers
- sculpt tools
- landform tools
- terrain preview modes
- hydrology assistance

That means the editor now has enough authored terrain intelligence to begin helping with biome decisions.

A serious fantasy worldbuilding tool benefits enormously from:
- elevation-aware biome suggestions
- slope-aware biome constraints
- water-proximity-informed biome guidance
- better transitions between terrain and painted biome layers
- terrain-informed ecological blocking for the user’s own creative decisions

This prompt should create **biome assistance**, not a rigid world simulator.

The goal is:
- useful
- editable
- transparent
- terrain-aware
- future-ready

---

## Required outcome
By the end of this prompt, the app should have:

- a practical biome-assist workflow driven by terrain/surface rules
- use of authored elevation, slope, and hydrology-related cues to inform biome suggestions
- a way to preview suggested biome regions or classifications
- integration with existing biome paint / data overlay workflows where appropriate
- user-controlled acceptance, refinement, or discard of biome suggestions
- runtime biome-assist analysis kept separate from authored biome content unless explicitly promoted
- coherent UI/tool/settings/inspector support for biome assistance
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** build a full climate simulation engine.
- Do **not** build seasons/currents/weather simulation here.
- Do **not** overwrite authored biome data automatically without user intent.
- Do **not** make biome decisions opaque or magical.
- Do **not** store transient biome-analysis overlays as authored biome content unless explicitly committed.
- Do **not** lock the app into one hardcoded realism model for all worlds.
- Do **not** remove the user’s creative control.

---

## Main goal
Create terrain-aware biome assistance that already feels genuinely useful:

- the user can inspect terrain-informed biome suggestions
- see where elevation and slope point toward likely biome patterns
- use water-aware cues to improve biome layout
- accept, blend, or ignore suggestions as needed
- turn useful suggestions into editable biome content

This should feel like **intelligent assistance**, not an automatic world generator.

---

## What to build

### 1) Biome assist foundation
Add a real biome-assist mode or feature group to the editor.

At minimum support practical biome assistance informed by:
- elevation
- slope
- water proximity / hydrology cues
- optional latitude or map-zone hints if they already exist cleanly
- optional user-selectable world assumptions if practical

These may exist as:
- a biome assist tool
- a biome analysis panel
- terrain-aware biome overlays
- or a suggestion mode integrated into existing biome layers

Any of those is acceptable if the workflow is coherent.

The user should be able to tell:
“this is the terrain-informed biome guidance system.”

---

### 2) Valid terrain and biome target behavior
Biome assistance must operate against valid source data and valid biome-capable targets.

Requirements:
- biome assist requires a valid terrain source on the active map
- if biome suggestions can be promoted into authored content, a compatible biome/data layer must be available or creatable
- hidden terrain layers are not used unless your rules explicitly allow visible-source overrides
- locked biome layers are not valid write targets
- if valid terrain or valid biome targets are missing, the UI should explain that clearly

This should feel consistent with terrain and paint target rules already established.

---

### 3) Terrain-aware biome rule model
Define and implement a practical rule model for terrain-informed biome suggestions.

At minimum, the system should be able to consider factors like:
- elevation band
- slope steepness
- basin/depression or drainage context
- water adjacency / river proximity / lake proximity where practical
- optional sea-level-relative behavior

A good baseline:
- use a compact rule set that maps surface cues to likely biome categories
- keep the rules understandable and inspectable
- allow room for future expansion later

Do **not** build a huge ecology engine.  
Build a clear, useful rule system.

---

### 4) Biome category support
Use or extend the existing biome category system in a practical way.

At minimum support categories such as:
- plains / grassland
- forest
- desert
- tundra
- swamp / marsh
- mountain / alpine
- coastal / shore
- scrub / rocky
- snow / ice if your terrain rules justify it

You do not need all of them if your system already has a smaller set, but the assist model should support meaningful terrain-informed differentiation.

Keep the category model extensible and editable.

---

### 5) Suggested biome overlay / preview
Implement a practical biome suggestion preview.

Requirements:
- biome suggestions are visible as an overlay or region preview
- the preview clearly reads as **suggested**, not already authored/committed
- different biome categories are distinguishable in a restrained, readable way
- the suggestion can be viewed without permanently overwriting biome layers
- the preview is generated in the active map scope

Good options:
- colored overlay
- category mask preview
- cell/region tint preview
- chunk-aware biome suggestion overlay

Do not make it visually chaotic.

---

### 6) Elevation-aware biome suggestions
Use elevation as a practical biome influence.

Requirements:
- the biome assist system can classify or weight biome suggestions based on height
- lowlands, uplands, alpine areas, and below-sea-level/coastal areas can be treated differently where relevant
- the user can understand that elevation is affecting the result

A strong baseline:
- terrain elevation bands influence the biome suggestion category
- elevation influence is readable enough to feel intentional

Do not leave elevation influence vague.

---

### 7) Slope-aware biome suggestions
Use slope as a practical biome influence.

Requirements:
- flatter areas can bias toward different biome suggestions than steep areas
- steep areas can help identify mountain, rocky, escarpment, or otherwise non-flat biome regions
- the slope influence should help terrain feel ecologically structured

A good baseline:
- use slope thresholds or weighted bands
- expose enough of the effect that the user can understand why mountain-like regions differ from plains

This is one of the most valuable terrain-to-biome links.

---

### 8) Water / hydrology-aware biome suggestions
Use hydrology-related cues where practical.

Requirements:
- water proximity can influence biome suggestions
- river/lake-adjacent terrain can be distinguished from dry interior terrain where practical
- basin/wetland suggestions can be supported in a practical form
- hydrology influence should remain assistive, not a full moisture simulation

A good baseline:
- near-water areas can bias toward swamp/marsh/riparian or greener categories
- water influence can be previewed through the suggestion overlay

This helps the terrain-water-biome relationship feel more coherent.

---

### 9) Optional coastline / sea-level awareness
If it fits naturally, include coastline or sea-level-aware biome cues.

Examples:
- coastal biome suggestions
- shore belts
- low-elevation littoral or marsh hints
- salt-flat or coastal plain possibilities depending on your world assumptions

This is optional, but often very helpful.

If included:
- keep it simple
- make the rules understandable

Do not let coastline logic balloon into a new simulation system.

---

### 10) User-controlled biome suggestion parameters
Provide practical settings for the biome assist workflow.

At minimum consider controls such as:
- biome rule preset or world style preset
- elevation influence weight
- slope influence weight
- water influence weight
- suggestion strength / threshold
- target biome layer for acceptance
- overlay visibility / opacity

You do **not** need a giant ecology lab.  
A few understandable controls are enough.

The user should feel like they are steering the assistance, not surrendering to it.

---

### 11) Biome assist presets or world assumptions
If it fits naturally, support a small set of biome-assist presets.

Examples:
- temperate default
- arid-leaning
- cold-world leaning
- high-fantasy exaggerated
- user-tuned/custom baseline

This is optional but very useful.

If included:
- keep it modest
- do not pretend scientific realism
- let presets be assistance profiles, not hard truth

This can help the system feel more flexible for fantasy worlds.

---

### 12) Integration with authored biome layers
This is important.

The biome assist system should connect meaningfully to the existing biome paint/data overlay workflow.

Requirements:
- the user can preview suggested biome areas
- the user can choose to:
  - accept suggestions into a compatible biome/data layer
  - use suggestions as a guide while painting manually
  - discard them
- accepted results remain editable authored biome content
- the system should not bypass the layer architecture

This keeps the app coherent:
terrain informs biome suggestions, but biome content remains real authored map content.

---

### 13) Acceptance / promotion workflow
Define a clean workflow for promoting biome suggestions into authored content.

Good baseline:
- suggestion preview is runtime-only
- user explicitly accepts the suggestion
- accepted suggestion writes biome category data into a chosen biome-capable layer
- user can then continue refining it with normal paint/edit workflows

Requirements:
- acceptance is deliberate
- preview and authored states are clearly distinct
- target layer compatibility is handled clearly
- accepted content participates in history

Do not silently overwrite the user’s work.

---

### 14) Runtime-only biome analysis architecture
Biome suggestions should generally be treated as runtime/editor analysis until explicitly committed.

Examples of runtime-only biome analysis:
- biome overlay preview
- category confidence fields
- temporary biome region suggestions
- terrain-rule classification outputs
- highlight of likely wetland/alpine/coastal zones

Requirements:
- keep runtime suggestions separate from persisted authored biome content by default
- make clear what is suggestion versus authored data
- keep the architecture regenerable and disposable

This separation matters a lot.

---

### 15) Tool and panel UI
Add practical UI for biome assistance.

Good possibilities:
- biome assist section in terrain/biome tools
- biome analysis panel
- overlay controls in the view/preview area
- accept/discard controls
- target biome layer selection

Requirements:
- the current biome-assist mode is visible
- the user can understand what factors are being used
- controls are compact and editor-like
- invalid source/target cases are explained clearly

Do not bury the workflow in obscure controls.

---

### 16) Inspector integration
Upgrade the inspector for biome assist context.

At minimum consider:
- active terrain source layer
- active biome target layer
- current biome assist preset/rule profile
- influence weights or thresholds
- selected suggestion summary if relevant
- category breakdown summary if practical
- acceptance readiness / blocked reasons

The inspector should help the user understand what the biome assist is doing.

---

### 17) Status bar integration
The status bar should reflect biome assist context where helpful.

Examples:
- active mode: Biome Assist
- active terrain source
- target biome layer
- hover coordinates
- sampled height/slope/water context under cursor if practical
- current suggestion category under cursor if practical

Keep it useful, not overloaded.

---

### 18) Commit / cancel rules
Define a coherent lifecycle for biome assist operations.

Good baseline:
- start or enable biome assist preview
- adjust settings/preset
- inspect the suggestion overlay
- accept/promote or discard
- Escape can cancel the current suggestion state if practical
- runtime suggestions do not pollute authored history until committed

This distinction is important for keeping the workflow trustworthy.

---

### 19) History integration
Biome assistance should integrate with history in a sensible way.

Requirements:
- accepting biome suggestions into authored biome content should create a meaningful history entry
- discarding runtime-only suggestions should generally not create noisy history
- undo/redo should restore accepted biome changes coherently
- the system should not create history spam for every parameter tweak while previewing

Be practical and honest in `STATUS.md` about what is runtime-only versus committed.

---

### 20) Multi-scale behavior
Biome assistance should work coherently across:
- world maps
- region maps
- local maps

Requirements:
- the active map determines the terrain source and suggestion bounds
- the system should not assume world-only biome analysis
- region/local workflows should remain meaningful
- accepted biome output should go to the active map’s biome-capable layers

Do not fully solve cross-map biome inheritance here, but do make the assist workflow scope-aware.

---

### 21) Performance guidance
This prompt must remain scale-aware.

Aim for:
- localized or chunk-aware biome suggestion generation where practical
- runtime suggestion overlays separate from authored content
- ability to regenerate suggestions without full unrelated-map recomputation
- sensible caching or reuse where it helps, without overbuilding

Avoid:
- giant full-map ecology recomputes for every small UI change
- storing runtime suggestions in persisted documents by default
- analysis that visibly lags on ordinary terrain interaction
- tightly coupling biome suggestion logic to unrelated UI rerenders

Be practical and honest about current limits.

---

### 22) UX guidance
The biome assist workflow should feel helpful, transparent, and creative-friendly.

Aim for:
- obvious distinction between suggestion and authored biome data
- readable overlay previews
- terrain clearly feels like it is influencing biome outcomes
- explicit accept/discard control
- settings that map to understandable results
- user retains final creative control

Avoid:
- black-box magical biome generation
- suggestions that instantly overwrite authored work
- every biome overlay looking noisy or muddy
- too many cryptic ecology parameters
- implying scientific realism where the system is only assistive

This should feel like the terrain is now helping the user think ecologically.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/terrain/biomes/...`
- `src/engine/terrain/biomes/...`
- `src/lib/terrain/biomes/...`
- `src/engine/overlays/...`
- `src/store/editorActions/biomes...`
- `src/components/panels/...`

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- the editor has a practical biome-assist workflow
- biome suggestions use terrain-aware rules in a useful baseline form
- elevation, slope, and water-related cues meaningfully influence suggestions
- suggestion overlays are visible and clearly distinct from authored biome content
- the user can promote accepted suggestions into editable biome/data layers
- runtime-only suggestion architecture remains separate from authored content
- UI/tool/settings/inspector/status support biome assist coherently
- world/region/local active-map behavior is respected
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- compact biome legend
- biome assist preset dropdown
- under-cursor biome explanation readout
- confidence/intensity tint mode
- “accept only selected biome category” convenience action
- lightweight coastal biome band support

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- practical terrain-aware biome assistance
- biome suggestion overlays driven by terrain/surface rules
- promotion workflow into authored biome layers
- runtime biome-analysis architecture
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should no longer treat biomes as completely disconnected painted regions.

A user should be able to use terrain, slope, and water cues to preview smarter biome suggestions, then promote the useful parts into real authored biome content while staying fully in control.

That is the bar.
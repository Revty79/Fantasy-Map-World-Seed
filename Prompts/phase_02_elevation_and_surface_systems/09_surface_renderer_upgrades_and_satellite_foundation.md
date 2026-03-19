# 09 — Surface Renderer Upgrades and Satellite Foundation

## Objective
Upgrade World Seed Mapper’s terrain rendering so authored elevation, biome, hydrology, and surface information can be displayed through a stronger **surface renderer** that moves the app closer to a **realistic / satellite-inspired terrain foundation** without abandoning editor clarity or performance.

This prompt is where the terrain begins to look more like a world surface and less like an analysis-only drafting layer.

---

## Why this prompt exists
By this point, Phase 2 should already have:
- elevation-capable terrain layers
- sculpt tools
- landform tools
- relief / contour / slope / height previews
- hydrology assistance
- biome assistance
- multi-scale terrain workflows
- terrain persistence and interchange

That means the app now has enough authored data to support a more compelling surface presentation.

Phase 1 intentionally started with cleaner, atlas-forward foundations.  
Phase 2 is where we begin the transition toward:
- more realistic terrain reading
- better surface cues
- richer terrain visualization
- an eventual satellite-inspired visual direction

This prompt should improve the renderer in a way that is:
- terrain-aware
- layered
- performant
- honest
- extensible for Phase 3 and Phase 4

---

## Required outcome
By the end of this prompt, the app should have:

- a stronger terrain surface renderer
- practical integration of elevation, biome, water, and related surface cues into the rendered map surface
- a satellite-inspired or realistic-terrain visual foundation in a usable baseline form
- a clean separation between authored terrain data and runtime-derived rendered surface output
- renderer controls for switching between clearer analytic view and richer surface view
- multi-scale compatibility for world / region / local maps
- coherent interaction with existing layer visibility and terrain preview systems
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** attempt full photoreal satellite rendering.
- Do **not** build a true 3D terrain engine here.
- Do **not** replace the existing terrain analysis previews; they are still useful and should remain available.
- Do **not** bake runtime-rendered surface textures into persisted authored data.
- Do **not** require climate simulation or full biome realism to make the renderer useful.
- Do **not** overcomplicate the visual stack so much that the editor becomes unreadable or slow.
- Do **not** break the chunk-aware terrain architecture.

---

## Main goal
Create a terrain surface renderer that already feels like a meaningful leap forward:

- sculpted terrain reads more naturally
- terrain, water, and biome information blend into a coherent surface view
- the map can begin to feel more like a planet surface
- the user can still switch back to clearer analysis modes when needed
- the app feels closer to the long-term “ultimate fantasy world mapper” direction

This should feel like the first real bridge between editing and beautiful terrain display.

---

## What to build

### 1) Surface renderer foundation
Add a real runtime **surface rendering mode** for terrain.

This should be distinct from:
- pure height grayscale preview
- contour preview
- slope preview
- debug analysis overlays

Requirements:
- surface view is a deliberate terrain display mode
- the renderer uses authored terrain-related data as input
- output is clearly runtime-derived and regenerable
- surface rendering remains compatible with the editor architecture and active map scope

The user should be able to tell:
“this is the richer terrain surface mode.”

---

### 2) Satellite-inspired visual direction
The surface renderer should move in a **satellite-inspired / realistic terrain** direction, but in a controlled way.

That means:
- terrain should read more like land surface
- broad landform shapes should be visually enhanced
- biome and water cues should influence surface appearance
- the result should still be understandable inside an editor

A good baseline:
- restrained terrain tinting
- relief-aware shading
- water bodies and wet areas reading more naturally
- biome regions contributing surface tone without becoming cartoon blocks

Do **not** try to fake perfect Earth satellite imagery.  
Aim for “credible world surface foundation.”

---

### 3) Surface composition inputs
Define and implement the core data inputs the surface renderer uses.

At minimum consider inputs such as:
- elevation
- slope / relief
- biome categories or biome layer contributions
- river/lake/water masks or water-related cues
- sea-level / coastline context
- optional symbol or vector water overlays only where they fit naturally

Requirements:
- the composition inputs are explicit and understandable
- the render stack remains modular enough to improve later
- runtime surface generation does not blur the distinction between source data and final surface appearance

This is the heart of the renderer.

---

### 4) Relief-integrated surface shading
Use terrain relief to make the surface read more naturally.

Requirements:
- hillshade / relief cues can influence the richer surface renderer
- ridges, valleys, basins, plateaus, and other landforms should read more clearly
- relief should support the surface view, not overpower it
- the result should still allow the user to understand terrain while editing

A good baseline:
- combine subtle terrain tint with relief shading
- retain strong legibility of sculpted structure

This is one of the most important improvements in the whole prompt.

---

### 5) Biome-informed surface tinting
Use biome data to influence the surface renderer in a practical, readable way.

Requirements:
- biome categories can meaningfully affect terrain coloration/appearance
- the result should feel more integrated than simple flat paint overlays
- biome tinting should remain restrained enough that terrain shape is still readable
- authored biome content and/or accepted biome assistance should contribute where appropriate

A good baseline:
- forest areas slightly greener/darker
- desert areas drier/lighter
- tundra/alpine areas cooler or rockier
- swamp/wetland areas more saturated/damp
- plains/grasslands more moderate

Do not make it look like a board game heatmap.  
Subtlety matters here.

---

### 6) Water and coastline integration
Make water-related terrain read more naturally in the surface renderer.

Requirements:
- rivers, lakes, and sea/coastline context can influence surface appearance
- water features should visually belong to the terrain rather than floating awkwardly above it
- coastal and shoreline areas can receive a modest visual treatment if helpful
- the rules should remain compatible with the existing water/hydrology workflows

A good baseline:
- water rendered more coherently against terrain
- shore areas subtly distinguished
- wetland / basin areas can read differently if relevant data exists

This helps the map feel far more like a coherent surface.

---

### 7) Surface texture logic foundation
Add a practical foundation for more surface-rich visual treatment.

This does **not** need a massive texture asset system yet.

A good baseline could include:
- procedural or rule-based tinting
- terrain band/material hints
- simple runtime texture/noise modulation if appropriate and lightweight
- surface variation that prevents the terrain from looking flat and dead

Requirements:
- whatever variation is added should remain consistent and controllable
- the architecture should leave room for richer material/style systems later
- the result should remain editor-friendly

Do not let this devolve into random noisy decoration.

---

### 8) Surface view vs analysis view controls
The user should be able to control whether they are looking at:
- analysis-oriented terrain previews
- or richer surface-oriented terrain rendering

Requirements:
- clear UI for switching modes
- analysis views remain available
- surface mode is clearly labeled and not confused with debug modes
- users can still access contour / slope / height / relief as needed
- the surface view should not trap the user in one visual style

A strong baseline:
- terrain display mode selector with:
  - Height
  - Relief
  - Slope
  - Contours
  - Surface
  - maybe Combined
- active mode clearly visible in the UI

This preserves editing clarity while adding richness.

---

### 9) Layer and visibility integration
Surface rendering must respect existing map and layer rules.

Requirements:
- hidden terrain layers do not contribute
- visible terrain layers contribute according to clear rules
- biome/water-related contributions follow visibility rules where appropriate
- active map scope determines which data is rendered
- non-terrain overlays remain coherent on top of the surface view

Do not let the richer renderer bypass the layer system.

---

### 10) Multi-scale surface behavior
The surface renderer should work across:
- world maps
- region maps
- local maps

Requirements:
- the renderer works meaningfully at all three scopes
- terrain-seeded child maps can display surface rendering immediately
- switching between scopes updates the surface correctly
- the renderer does not assume one fixed scale of terrain detail forever

This is important for preserving the whole world → region → local promise.

---

### 11) Runtime-derived surface architecture
This is a major part of the prompt.

Surface rendering outputs should be treated as **runtime-derived** data.

Examples:
- terrain surface textures
- biome-tinted surface chunks
- relief-enhanced surface composites
- water-surface blends
- cached visible surface tiles/chunks

Requirements:
- keep these clearly separate from persisted authored terrain documents
- make surface caches disposable and regenerable
- organize the renderer cleanly for future expansion

Do **not** store final rendered surface output as authored content by default.

---

### 12) Chunk-aware surface generation
The upgraded surface renderer must respect large-map performance goals.

Requirements:
- runtime surface generation should be chunk-aware where practical
- visible area / visible chunk logic should be reused
- terrain edits should trigger localized surface updates when possible
- map switching should not require unrelated terrain surface generation
- the architecture should support future streaming/tiling improvements

You do **not** need perfect optimization yet.  
You do need a structure that clearly supports scale.

---

### 13) Terrain edit → surface refresh behavior
Define how sculpting and terrain changes update the surface renderer.

Good baseline:
- affected terrain chunks trigger localized surface refresh
- major terrain changes visibly update the rendered surface
- changes feel responsive enough to trust
- the app avoids giant full-surface recomputation on every tiny input if possible

Recommended practical approach:
- localized update when terrain chunks change
- full refresh only when truly needed
- behavior documented honestly in `STATUS.md`

This matters a lot for perceived quality.

---

### 14) Symbol, label, and vector coexistence
Make sure the richer surface renderer coexists cleanly with the rest of the map content.

Requirements:
- symbols/features still read on top of the surface
- labels remain legible
- vector rivers/borders/roads remain coherent
- the surface renderer does not drown out authored top-layer content
- there is a clear stacking/order relationship in the renderer

This is important: better terrain should not make the rest of the editor worse.

---

### 15) Globe-preview compatibility
The upgraded surface renderer should fit cleanly with the existing globe preview foundation.

Requirements:
- the world map’s surface-rendered state should be usable as a stronger globe texture source where practical
- the renderer should not create a contradictory visual truth relative to the globe preview
- future world-to-globe rendering should feel more compelling after this prompt
- do not fully rebuild globe preview here; just keep the surface system compatible with it

This is an important architectural bridge toward later phases.

---

### 16) Renderer controls and settings
Provide practical settings for the richer surface mode.

At minimum consider:
- surface mode on/off
- surface intensity / blend amount
- relief strength
- biome tint strength
- water/coast contribution strength
- optional style preset or surface profile
- overlay opacity if analysis overlays can be combined with surface mode

You do **not** need a huge style editor.  
A few useful controls are enough.

These settings should live in a coherent place such as:
- terrain preview panel
- view controls
- inspector section
- surface renderer settings area

---

### 17) Optional style presets
If it fits naturally, support a few modest surface presets.

Examples:
- neutral realistic
- greener world
- arid world
- colder world
- fantasy stylized-natural

This is optional, but it can help the renderer feel more intentionally directed.

If included:
- keep it restrained
- do not turn it into a giant theme system yet
- treat presets as surface-rendering biases, not full art packs

---

### 18) Inspector and status integration
Upgrade the inspector and/or status bar to reflect surface rendering context.

At minimum consider:
- active terrain display mode
- whether surface mode is active
- active terrain source / biome source / water source contributions
- major surface settings summary
- under-cursor terrain readouts still available where practical

This helps the richer surface view remain an editor tool, not just a pretty picture.

---

### 19) Performance guidance
This prompt must stay scale-aware and editor-safe.

Aim for:
- chunk-aware surface generation
- localized refresh on edited chunks
- runtime caching that is disposable/regenerable
- keeping analysis modes available without heavy conflict
- preserving editor responsiveness

Avoid:
- full-map rerender on every tiny edit if avoidable
- giant monolithic surface textures where chunked composition is cleaner
- tightly coupling surface generation to unrelated panel/UI state
- overloading the GPU/renderer with unnecessary visual complexity

Be practical and honest about current limits.

---

### 20) UX guidance
The richer terrain renderer should feel like a real visual upgrade without hurting usability.

Aim for:
- terrain that feels more like a believable surface
- landforms that read clearly
- biome and water influence that feels natural
- easy switching between analytic and richer views
- labels/symbols remaining readable
- world, region, and local maps all benefiting

Avoid:
- noisy texture spam
- muddy unreadable colors
- losing the ability to read terrain structure
- a surface mode that looks better in screenshots but worse for editing
- overpromising “satellite realism” beyond what is actually built

This is the first major step toward the app looking like a finished world surface tool.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/terrain/surface/...`
- `src/engine/terrain/surface/...`
- `src/lib/terrain/surface/...`
- `src/engine/render/...`
- `src/store/editorActions/terrainView...`
- `src/components/panels/...`

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- the app has a richer terrain surface rendering mode
- elevation, relief, biome, and water cues contribute to a coherent surface view
- the user can switch between analysis views and surface view through coherent UI
- surface rendering remains runtime-derived and separate from authored terrain data
- chunk-aware/localized surface update behavior exists in a practical form
- world / region / local maps all support the upgraded surface rendering
- symbols, labels, and vector content remain readable on top of the surface
- globe-preview compatibility is preserved or improved in a practical way
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- modest surface style presets
- combined surface + contour mode
- under-cursor surface material readout
- simple coast shading toggle
- biome tint strength quick slider
- surface legend/help text

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- a stronger terrain surface renderer
- satellite-inspired / realistic terrain foundation in a practical baseline form
- coherent mode switching between analysis and richer surface view
- chunk-aware runtime surface architecture
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should no longer make terrain feel like only a technical editing layer.

A user should be able to switch into a richer surface view and see their sculpted terrain, water, and biome work begin to read like a believable world surface while still staying inside a serious editor.

That is the bar.
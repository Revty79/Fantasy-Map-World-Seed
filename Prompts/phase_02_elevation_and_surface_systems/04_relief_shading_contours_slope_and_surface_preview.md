# 04 — Relief Shading, Contours, Slope, and Surface Preview

## Objective
Implement the first real **terrain visualization system** for World Seed Mapper so the user can meaningfully read authored elevation through **relief shading**, **contours**, **slope visualization**, and practical **surface preview modes**.

This prompt is where terrain authoring becomes visually understandable instead of mostly numerical or abstract.

---

## Why this prompt exists
Prompt 02 made terrain sculpting real.  
Prompt 03 added higher-level landform tools.

Now the editor needs to show the terrain in ways that help the user actually understand what they have built.

A serious terrain workflow needs visual aids such as:
- relief shading
- slope steepness visualization
- contour lines
- height/altitude preview
- terrain surface preview modes

Without these, terrain editing becomes guesswork.

This prompt should create practical terrain-reading views that:
- work on authored elevation data
- respect active map/layer visibility
- remain performant on large maps
- integrate with the existing editor/view systems
- prepare for stronger surface rendering later

---

## Required outcome
By the end of this prompt, the app should have:

- practical terrain visualization modes
- relief/hillshade-style preview
- slope visualization
- contour line visualization in a usable baseline form
- at least one direct height/elevation preview mode
- editor controls for switching terrain preview/display modes
- runtime generation of terrain preview data separate from persisted terrain documents
- terrain preview behavior that respects active map, terrain layers, and visibility rules
- inspector/status/tool-settings support for terrain preview context
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** build the final realistic/satellite terrain renderer yet; that belongs later.
- Do **not** store derived preview textures/meshes directly in persisted terrain documents.
- Do **not** require full hydrology/climate systems to make terrain preview useful.
- Do **not** turn this into a 3D terrain system.
- Do **not** brute-force full-map recomputation for every tiny change if more localized updates are practical.
- Do **not** let preview systems contradict the chunk-aware terrain foundations.

---

## Main goal
Create terrain preview modes that already make the editor feel much more usable:

- the user can sculpt terrain
- switch terrain display modes
- see elevation clearly
- understand slopes and landforms
- read contour structure
- trust what the terrain is doing

This should feel like the terrain has become legible.

---

## What to build

### 1) Terrain visualization mode foundation
Add a real terrain visualization/display-mode system to the editor.

At minimum support practical modes such as:
- relief / hillshade
- slope
- contour
- height/elevation grayscale or color ramp

Optional if it fits naturally:
- combined relief + contours
- combined height tint + relief
- simple normal-like shading preview

Requirements:
- one or more preview modes can be toggled intentionally
- the current mode is visible in UI
- switching modes updates the terrain presentation coherently
- preview mode state belongs to runtime/editor state, not persisted terrain data unless you also store user-facing view preference separately

This should feel like a real terrain-reading control system.

---

### 2) Relief / hillshade preview
Implement a practical relief shading mode.

Requirements:
- use authored height data to compute a readable hillshade-style preview
- relief should help reveal ridges, basins, and landforms clearly
- the effect should work in document/map space
- lighting assumptions can be simple, but should be consistent and understandable
- runtime generation should be kept separate from persisted terrain content

A good baseline:
- single directional light assumption
- derived shading from neighboring height samples
- grayscale or subtle tint result

Do not overcomplicate physically based shading here.  
Readability matters most.

---

### 3) Slope visualization
Implement a slope preview mode.

Requirements:
- visualize relative steepness from terrain data
- make steep areas easy to distinguish from flatter areas
- use a readable value ramp or shading approach
- maintain clarity across the active map
- keep the mode understandable and not overly noisy

A good baseline:
- derive slope magnitude from neighboring sample differences
- map slope into grayscale or a restrained color ramp

This mode is important for reading terrain difficulty and flow direction later.

---

### 4) Contour visualization
Implement a practical contour visualization mode.

Requirements:
- generate contour lines or contour-like bands from terrain data
- contour interval should be based on height value semantics in a coherent way
- contours should be readable enough to help the user understand elevation bands
- contour display should work across chunk boundaries without obviously broken seams where practical

A good baseline:
- derive contour lines from sample thresholds or band transitions
- allow a simple contour interval setting
- keep the output clear, not cluttered

This does not need to be a GIS-grade contour engine yet.  
It does need to be useful.

---

### 5) Height / elevation preview mode
Implement a direct height preview mode.

Requirements:
- user can view terrain heights through a simple grayscale or restrained color ramp
- the mapping between displayed tone/color and elevation should be coherent
- sea level or reference level should be respected sensibly
- the mode should help the user read broad terrain structure quickly

A good baseline:
- grayscale height visualization
- optional simple color ramp if clear and not noisy

This is the most direct way to inspect elevation and should be practical even if plain.

---

### 6) Optional combined preview mode
If it fits naturally, support a combined terrain preview mode such as:
- height tint + relief
- relief + contours
- slope + contours

This is optional, but often extremely useful.

If included:
- keep it readable
- avoid clutter
- do not sacrifice performance wildly just to combine modes

A restrained combined mode can make the terrain editor feel much more complete.

---

### 7) Terrain preview controls in the UI
Add practical UI for choosing terrain preview modes.

Good locations:
- top bar view controls
- terrain tool settings area
- right sidebar preview section
- map/terrain inspector section

Requirements:
- user can clearly see the current preview mode
- switching preview modes is straightforward
- toggles or selectors are editor-like and not clumsy
- preview settings belong to the active view/runtime context

Do not hide terrain preview controls in obscure places.

---

### 8) Preview settings
Support practical settings for the preview modes.

At minimum consider controls such as:
- contour interval
- relief intensity
- slope contrast
- preview opacity or blend amount
- preview-on/off toggle
- sea-level reference visualization if relevant

You do not need a huge control panel.  
A few useful settings are enough if they are understandable.

The settings should live in the inspector/tool settings/view controls in a coherent way.

---

### 9) Runtime-derived preview data architecture
This is a major part of the prompt.

Terrain preview outputs should be treated as **derived runtime data**, not authored terrain documents.

Examples of derived runtime state:
- hillshade textures
- slope preview textures
- contour overlay geometry
- cached preview chunks
- viewport-dependent terrain preview overlays

Requirements:
- keep these structures separate from persisted terrain chunks
- make it clear that preview data can be regenerated
- organize preview logic cleanly for later upgrades

This separation matters a lot for correctness and future maintainability.

---

### 10) Chunk-aware preview generation
Terrain preview must respect large-map editing goals.

Requirements:
- preview generation should operate in a chunk-aware way where practical
- visible chunk evaluation should be reused if helpful
- changed chunks can trigger localized preview updates instead of full-map recomputation where practical
- preview across chunk boundaries should remain visually coherent as much as practical

You do **not** need perfect optimization yet.  
But the preview architecture must not fight the chunk-based terrain system.

---

### 11) Terrain change → preview refresh behavior
Decide how preview updates react to terrain edits.

Good baseline options:
- changed affected chunks regenerate their derived preview data
- preview updates at stroke/operation boundaries
- optionally update incrementally during sculpting if cheap enough
- preview refresh behavior should feel responsive but not reckless

Recommended practical approach:
- update incrementally enough to feel live
- avoid giant expensive full recomputes for every small pointer movement
- keep the behavior honest and stable

Document the chosen behavior clearly in code/comments/`STATUS.md` if useful.

---

### 12) Layer and visibility rules
Terrain preview should respect the editor’s layer rules.

Requirements:
- hidden terrain layers should not contribute to terrain preview
- locked terrain layers may still preview if visible, but are not editable
- active map scope determines which terrain content is previewed
- if multiple terrain layers are possible, rules for preview source should be clear
- terrain preview should not accidentally use non-target layers unless your architecture explicitly intends combined terrain display

A good baseline:
- preview the visible terrain layer(s) in the active map
- active terrain target receives editing, but visible terrain display respects layer visibility rules

Keep the rules understandable.

---

### 13) Status bar integration
The status bar should meaningfully reflect terrain preview context.

Examples:
- current terrain preview mode
- active terrain layer
- cursor coordinates
- sampled height under cursor
- slope value under cursor if practical
- contour interval if currently relevant

Keep it useful, not overloaded.

---

### 14) Inspector / panel integration
Upgrade the inspector or a terrain preview panel to show terrain visualization context.

At minimum consider:
- current preview mode
- relevant preview settings
- active terrain layer
- sampled height under cursor or selected point, if practical
- preview refresh status if that matters
- visibility / target validity context

This should help the user read what they are looking at.

---

### 15) Contour labeling or guides
If it fits naturally, add a small baseline assist for contour readability.

Examples:
- contour interval display in UI
- occasional labeled contour values later stub
- contour legend placeholder
- altitude ramp legend placeholder

This is optional.

Do not let labeling complexity derail the core preview system.

---

### 16) Terrain sample readout helpers
Add useful sample readout helpers where appropriate.

Good examples:
- hover height readout
- selected-point height readout
- slope-at-point readout
- nearest contour band estimate
- sea-level-relative height readout

These can be lightweight but are very helpful for making the terrain feel measurable and real.

---

### 17) Canvas overlay organization
Integrate terrain preview cleanly into the canvas/stage architecture.

A good outcome:
- terrain preview has a clear place in the render layer/scene structure
- relief shading, contour overlays, slope overlays, and other derived displays are organized coherently
- terrain preview does not become random ad hoc drawing logic scattered through unrelated systems

Keep the render architecture clean and extensible.

---

### 18) Performance guidance
This prompt must stay scalable.

Aim for:
- chunk-aware preview generation
- localized updates when terrain changes
- runtime preview caches that are disposable/regenerable
- minimal unnecessary React rerenders from terrain display changes
- clear room for stronger surface rendering later

Avoid:
- recomputing the entire terrain preview every frame
- storing derived preview images in persisted terrain documents
- giant monolithic preview textures where partitioned preview is cleaner
- preview logic tightly coupled to unrelated editor UI updates

Be practical and honest in `STATUS.md` about any current performance bounds.

---

### 19) UX guidance
Terrain visualization should feel clear and useful.

Aim for:
- preview modes that are easy to switch
- relief that makes landforms obvious
- slope that clearly highlights steepness
- contours that are readable rather than overwhelming
- height preview that is understandable at a glance
- enough under-cursor information to support deliberate editing

Avoid:
- too many noisy colors
- unreadable contour clutter
- preview modes that all look too similar
- hidden settings with unclear effects
- mismatched preview behavior across maps/scopes

This is where terrain becomes understandable, not just editable.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/terrain/preview/...`
- `src/engine/terrain/preview/...`
- `src/lib/terrain/preview/...`
- `src/engine/overlays/...`
- `src/components/panels/...`
- `src/store/editorActions/terrainView...`

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- the editor has practical terrain preview modes
- relief/hillshade preview works
- slope visualization works
- contour visualization exists in a useful baseline form
- direct height/elevation preview exists
- the user can switch terrain preview modes through coherent UI
- terrain preview data is treated as runtime-derived, not persisted authored data
- preview generation respects active maps, terrain layers, and visibility rules
- chunk-aware/localized preview behavior exists in a practical form
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- combined preview mode
- simple terrain legend
- hover slope/height dual readout
- contour color customization
- preview opacity slider
- quick preview hotkeys

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- practical terrain visualization modes
- relief, slope, contour, and height preview foundations
- runtime-derived terrain preview architecture
- terrain preview controls in the editor
- terrain sample/readout helpers where practical
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should no longer make terrain feel blind.

A user should be able to sculpt landforms and then switch preview modes to actually understand the terrain’s elevation, slope, and structure in a useful, readable way.

That is the bar.
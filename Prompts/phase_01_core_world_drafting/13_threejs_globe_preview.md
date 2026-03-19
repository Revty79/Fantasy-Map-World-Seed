# 13 — Three.js Globe Preview

## Objective
Implement the first real **3D globe preview** for World Seed Mapper using **Three.js**, so the user can preview the active globe-safe world map wrapped onto a rotatable sphere while keeping the flat editor as the primary authoring surface.

This prompt is where the app proves that the master world map is truly globe-ready.

---

## Why this prompt exists
One of the defining promises of World Seed Mapper is that the world map is not just a flat drawing surface.

It is meant to be:
- authored on a globe-safe master map
- previewed as a wrapped world
- expandable later into deeper globe workflows

By this point, the app should already have:
- a world map document
- authored layers/content
- exports
- nested maps
- persistence

Now the user needs to see that the world can actually live on a globe.

This prompt should establish a practical globe preview that is:
- real
- navigable
- connected to current map content
- honest about Phase 1 limits

Do this cleanly. The globe preview should feel exciting, but not fragile.

---

## Required outcome
By the end of this prompt, the app should have:

- a real Three.js-based globe preview surface
- the active **world map** usable as a globe texture source
- a user-facing way to open/toggle the globe preview
- a rotatable/zoomable 3D globe view
- a practical flat-map-to-globe texture pipeline
- clear handling of which map scopes are previewable on the globe
- sensible fallback behavior for non-world scopes
- basic lighting/material setup suitable for a world preview
- inspector/UI integration for globe-preview context
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** attempt full 3D globe editing in this prompt.
- Do **not** replace the flat editor with the globe; the flat map remains the primary authoring surface.
- Do **not** build a full planet renderer with terrain displacement, atmosphere simulation, clouds, seasons, or day/night systems yet.
- Do **not** pretend region/local maps are full standalone globe surfaces if they are not.
- Do **not** hardcode the globe preview into a brittle one-off demo component.
- Do **not** export runtime/debug editor overlays into the globe texture unless explicitly intended.

---

## Main goal
Create a globe preview that already feels like a real, meaningful feature:

- user authors on the flat master map
- user opens globe preview
- the world appears wrapped around a sphere
- user can rotate and inspect the planet
- the app proves the flat map basis is globe-safe

This should feel like a powerful payoff moment in the product.

---

## What to build

### 1) Globe preview entry point
Add a real user-facing way to open the globe preview.

Good options:
- a top bar button like `Globe Preview`
- a right sidebar panel toggle
- a dedicated workspace mode
- a split-view or modal-style preview if clean

Requirements:
- the user can intentionally enter/exit globe preview
- it is obvious when globe preview is active
- it does not disrupt the flat authoring workflow unnecessarily

A practical toggleable preview mode is enough.

---

### 2) Three.js integration foundation
Integrate Three.js cleanly into the app architecture.

Requirements:
- mount/unmount cleanly in React
- avoid memory leaks
- keep Three.js scene setup separate from general UI components where practical
- organize globe-preview logic so it can be extended later
- do not bury the entire globe renderer in a random button handler

Good separation might include:
- globe preview component/host
- scene setup module
- texture source adapter
- controls module

Keep it structured.

---

### 3) World-map-only globe source rule
Define and enforce the baseline rule for globe preview input.

Recommended rule for Phase 1:
- the **world map** is the canonical globe texture source
- region/local maps are **not** independently wrapped as full globes
- if the active map is region/local:
  - either preview the parent/root world globe
  - or clearly explain that globe preview is based on the root world map

Requirements:
- scope behavior is explicit
- UI does not mislead the user
- the user can understand what they are seeing

This matters a lot for trust and clarity.

---

### 4) Flat-map-to-globe texture pipeline
Implement a practical pipeline that turns the current world map content into a texture suitable for globe preview.

Requirements:
- use the active project’s world map content
- respect authored visible content meaningfully
- avoid editor chrome/debug overlays unless intentionally included
- produce a clean texture for wrapping on a sphere
- keep the pipeline reasonably aligned with the export/render system if possible

A good practical approach:
- reuse controlled map rendering/export logic to produce a texture source for the globe
- then feed that texture into the Three.js globe material

Do not build a totally separate contradictory rendering truth if a shared source path is cleaner.

---

### 5) Sphere rendering
Render the world map on a sphere.

Requirements:
- equirectangular wrapping works correctly
- texture orientation is correct
- the globe is visually clear and not obviously inverted/seamed incorrectly
- the sphere is sized and framed sensibly
- seam handling is at least acceptable for Phase 1

The most important thing is that the user sees:
“yes, this map is truly wrapping onto a globe.”

---

### 6) Globe camera and controls
Implement usable globe navigation controls.

At minimum support:
- rotate/orbit around the globe
- zoom in/out
- sensible default framing
- reset view if practical
- smooth enough interaction to feel intentional

Good baseline:
- orbit controls
- wheel zoom
- drag rotation
- optional damping if it feels nice and stable

Do not overcomplicate controls.  
They should feel clear and dependable.

---

### 7) Basic scene composition
Create a visually readable globe scene.

At minimum include:
- globe mesh
- simple lighting
- background or scene backdrop that does not distract
- camera set up for a clean first impression

A good baseline might be:
- dark neutral background
- modest directional + ambient light
- material that shows the map clearly without over-shining it

Avoid:
- noisy space scenes
- overdone dramatic effects
- distractingly bright environment visuals

This is a preview tool, not a cinematic trailer.

---

### 8) Globe material guidance
Choose a practical material setup.

A good Phase 1 baseline:
- use a standard or basic material with the world texture
- prioritize clarity of the map texture
- allow enough shading that the sphere reads as 3D
- avoid visual choices that wash out text/symbols too badly

Optional if natural:
- slight specular/roughness tuning
- subtle atmosphere placeholder later stub
- simple normal/displacement hooks for future phases, but not active yet unless they fit naturally

Be careful: map readability matters.

---

### 9) Globe preview workspace UX
Decide how the globe preview fits into the workspace.

Good options:
- replace the center canvas temporarily while in globe mode
- open in a side-by-side split with the flat editor
- open in a dedicated preview pane or tab

My recommendation:
- a clean toggle that swaps the center stage between flat editor and globe preview
- or a split preview only if it remains performant and understandable

Requirements:
- user knows whether they are in flat or globe mode
- switching between modes is coherent
- existing app chrome/panels remain understandable

Do not let the workspace become confusing.

---

### 10) Globe preview status and UI feedback
Surface globe-preview context in the UI.

At minimum:
- indicate that globe preview is active
- indicate which world map is being used as the source
- if active map is a region/local map, clarify what is happening
- provide a quick return to flat editing

Good optional details:
- globe mode badge
- source world map name
- preview freshness/status hint if relevant

This helps the feature feel grounded and honest.

---

### 11) Refresh/update behavior
Decide how the globe preview updates relative to authored changes.

Good baseline options:
- globe preview regenerates texture when opened
- manual refresh button
- auto-refresh when significant document changes occur if it is cheap enough
- a “preview may be stale / refresh” indicator if live sync is too expensive right now

Recommended practical Phase 1 approach:
- regenerate on open
- optionally provide manual refresh
- add live updating only if it is clean and performant

Do not force expensive full re-renders on every tiny authoring action if it hurts the editor.

Be honest in `STATUS.md` about the chosen behavior.

---

### 12) Region/local map behavior
Be explicit about how region and local maps relate to globe preview.

Strong baseline behavior:
- if user is on a region/local map and enters globe preview, show the root world globe
- optionally highlight or indicate the parent extent of the current region/local area on the globe only if that is easy and reliable
- otherwise, make it clear the globe is showing the world source, not the local sheet as a tiny separate planet

This avoids conceptual confusion.

Do not fake something misleading.

---

### 13) Optional highlighted extent overlay
If it fits naturally, add a simple visual indication of child-map extents on the globe.

Good possibilities:
- show the current region/local source extent as a subtle highlighted box/overlay on the globe texture
- or a small marker indicating where the current child map lives on the world

This is optional and only worth doing if it stays clear and not too heavy.

Do not let it derail the core globe preview.

---

### 14) Inspector or panel integration
Upgrade the inspector or a dedicated preview panel to show globe-preview information.

At minimum this can include:
- preview source map
- preview mode state
- current behavior notes (world source only)
- refresh button if applicable
- simple globe display options if any exist

Optional light controls:
- toggle background
- reset globe view
- show/hide extent overlay if implemented
- show seam guide placeholder

Keep it practical.

---

### 15) Export-path relationship guidance
The globe preview should align conceptually with export and render systems.

Requirements:
- do not create a separate contradictory interpretation of visible content
- reuse shared map rendering assumptions where practical
- make it plausible that future globe-texture export could grow from this system

You do not need to implement globe-texture export here unless it fits naturally.  
But the architecture should not fight future phases.

---

### 16) Performance guidance
The globe preview should feel smooth enough without damaging editor responsiveness.

Aim for:
- controlled texture generation
- efficient Three.js scene lifecycle
- no unnecessary recreation of heavy resources on every tiny UI change
- clean disposal of textures/materials/geometries when preview closes or updates
- room for future optimization

Avoid:
- rebuilding the entire Three scene on every React rerender
- constant full texture regeneration for every small authoring action unless proven cheap
- leaking WebGL resources
- tightly coupling flat editor runtime objects to the globe renderer

Be practical and honest about any current performance boundaries.

---

### 17) Error handling and fallbacks
Add practical handling for preview edge cases.

Examples:
- no valid world map exists
- world map has no renderable content yet
- texture generation fails
- Three.js context/setup fails
- source map is invalid or incomplete

Requirements:
- user gets understandable feedback
- preview fails gracefully rather than crashing the app
- fallback UI remains coherent

This is important for trust.

---

### 18) UX guidance
The globe preview should feel like a powerful but grounded feature.

Aim for:
- clear entry/exit
- obvious 3D interaction
- readable map wrapping
- honest scope behavior
- smooth-enough controls
- no mystery about source content

Avoid:
- a cluttered preview scene
- a globe that loads with the wrong orientation and no clue why
- region/local scope confusion
- overbuilt effects that hide the actual map
- fragile preview modes that feel like a gimmick

This should feel like the world coming alive.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/globe-preview/...`
- `src/engine/globe/...`
- `src/lib/globe/...`
- `src/components/panels/GlobePreviewPanel...`
- `src/store/editorActions/globe...`

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- the app has a real user-facing globe preview entry point
- a Three.js globe preview renders successfully
- the root/world map can be wrapped onto a sphere
- globe rotation/zoom controls work
- globe preview integrates coherently with the editor workspace
- source-scope behavior is clear and honest
- the user can return easily to flat editing
- globe texture generation is practical and reasonably aligned with current map rendering/export logic
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- manual refresh globe button
- simple extent highlight for current region/local source area
- split flat/globe preview mode
- subtle atmosphere placeholder
- reset-globe-view button
- source-world label in the preview UI

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- real Three.js globe preview integration
- world-map-to-sphere texture pipeline
- usable globe controls
- workspace/UI integration for preview mode
- clear scope/source behavior
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should prove one of its signature promises.

A user should be able to take the authored flat world map, open globe preview, and see that world wrapped around a navigable sphere in a way that feels real and exciting.

That is the bar.
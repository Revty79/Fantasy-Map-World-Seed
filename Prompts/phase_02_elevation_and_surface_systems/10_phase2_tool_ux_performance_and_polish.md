# 10 — Phase 2 Tool UX, Performance, and Polish

## Objective
Refine World Seed Mapper’s Phase 2 terrain systems into a more coherent, efficient, and trustworthy editor experience by improving **terrain tool UX**, **multi-mode clarity**, **performance behavior**, and the overall polish of the new elevation/surface workflows.

This prompt is where the terrain system starts feeling less like “a powerful prototype” and more like “a tool someone can actually work in for a long session.”

---

## Why this prompt exists
By this point, Phase 2 should already include:

- terrain-capable layers
- sculpt brushes
- landform tools
- terrain preview modes
- hydrology assistance
- biome assistance
- multi-scale terrain workflows
- heightmap persistence/import/export
- upgraded surface rendering

That is a lot of power.

Now the biggest gains are not from adding entirely new terrain subsystems.  
Now the gains come from:
- reducing friction
- improving discoverability
- tightening performance behavior
- clarifying active terrain context
- reducing confusion between preview/assist/commit states
- polishing the terrain editing experience

This prompt should focus on making the Phase 2 systems feel more intentional, more readable, and more dependable.

---

## Required outcome
By the end of this prompt, the app should have:

- stronger UX for terrain tools and terrain-target workflows
- clearer active terrain/edit/preview context
- improved performance behavior around terrain editing and surface preview
- better organization of terrain tool settings and inspector content
- cleaner transitions between sculpt, landform, hydrology, biome, and preview modes
- reduced “prototype friction” in visible terrain workflows
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** derail Phase 2 by starting major new systems.
- Do **not** turn this into endless cosmetic tweaking with no usability payoff.
- Do **not** build a giant preferences/settings suite unless it directly improves terrain workflows.
- Do **not** destabilize working terrain systems through unnecessary large refactors.
- Do **not** oversell performance if some limits still remain.
- Do **not** hide confusing behaviors instead of clarifying them.

---

## Main goal
Make the terrain side of the editor feel significantly better to use.

The user should feel:
- “I know what terrain mode I’m in.”
- “I know which terrain layer I’m affecting.”
- “The previews make sense.”
- “The tool settings actually help.”
- “The app feels smoother and less confusing.”
- “I trust the terrain workflow.”

That is the bar for this prompt.

---

## What to build

### 1) Terrain-mode clarity pass
Improve how the editor communicates which terrain mode is active.

At minimum make it clear when the user is in:
- sculpt mode
- landform mode
- terrain preview mode
- hydrology assist mode
- biome assist mode
- surface rendering mode
- import/export terrain workflows where relevant

Good places to reinforce mode:
- top bar
- tool rail
- tool settings panel
- inspector
- status bar
- canvas overlays

The user should not have to guess what terrain system is currently driving behavior.

---

### 2) Active terrain target clarity
Improve how the editor communicates the active terrain target.

At minimum make it obvious:
- which terrain layer is active
- whether the target is editable
- whether the target is blocked due to lock/visibility
- whether the current tool can act on the current target
- when no valid terrain target exists

Good cues:
- target badge in layer panel
- inspector callout
- tool settings summary
- status bar message
- canvas blocked-state hint

This is one of the highest-value UX improvements in the entire terrain workflow.

---

### 3) Terrain tool settings polish
Refine the terrain tool settings area so it becomes a dependable home for:
- sculpt settings
- landform settings
- preview settings
- hydrology settings
- biome-assist settings
- surface mode settings

Requirements:
- settings should be grouped meaningfully
- irrelevant settings should not clutter the panel
- active values should be easy to scan
- units/meaning should be understandable
- tool-specific settings should switch cleanly when tools change

This panel should stop feeling like a technical dump and start feeling like a real terrain control surface.

---

### 4) Inspector polish for terrain workflows
Refine the inspector for terrain-heavy workflows.

At minimum improve:
- terrain layer summaries
- terrain metadata readability
- active mode explanations
- source/target relationships for hydrology/biome assists
- child terrain lineage readouts
- terrain import/export target/source context
- selected terrain-related object/overlay context if applicable

The inspector should help the user understand what is happening, not merely expose raw data.

---

### 5) Terrain panel and layer-panel polish
Improve terrain-related scanning in the layer panel and any terrain-specific panels.

Good candidates:
- clearer terrain icons/badges
- target-state highlight
- chunk/content status hints
- terrain-seeded vs blank terrain hint where helpful
- better active/selected distinction
- clearer visibility/lock interaction for terrain layers
- more intentional empty states

The layer system should feel comfortable handling terrain now, not just tolerating it.

---

### 6) Better blocked-state messaging
Improve feedback when terrain actions cannot proceed.

Examples:
- no active terrain target
- terrain layer hidden
- terrain layer locked
- wrong layer type selected
- hydrology assist missing terrain source
- biome assist missing compatible target layer
- import/export action missing valid terrain context

These messages can appear through:
- status bar
- inline panel messages
- small toasts/notices
- inspector hints

The goal is to reduce silent confusion.

---

### 7) Better preview vs authored-content distinction
One of the biggest UX risks in Phase 2 is confusion between:
- runtime preview
- temporary analysis
- accepted/authored content

Improve the editor so this distinction is obvious for:
- landform previews
- hydrology path previews
- lake suggestions
- biome suggestions
- terrain preview modes
- surface rendering vs authored data

Requirements:
- previews should look temporary/analysis-oriented
- accepted/authored content should look committed
- UI wording should reinforce the distinction
- users should not fear accidentally overwriting work without realizing it

This is critical for trust.

---

### 8) Terrain cursor and overlay polish
Improve the feel and readability of terrain cursors and terrain-related overlays.

Good candidates:
- sculpt brush footprint
- landform preview shapes
- hydrology path previews
- basin/lake overlays
- biome suggestion overlays
- contour/relief/surface readout helpers
- blocked-state cursor feedback

Requirements:
- overlays should be readable at practical zoom levels
- selected/active/preview states should be visually distinct
- overlays should remain editor-like, not flashy clutter
- overlay styling should feel consistent across terrain systems

This can dramatically improve usability.

---

### 9) Terrain interaction consistency pass
Do a consistency pass on terrain interaction rules.

Important areas:
- Enter/confirm behavior
- Escape/cancel behavior
- pointer down/move/up lifecycles
- switching tools mid-operation
- switching maps mid-operation
- switching terrain targets mid-operation
- when history entries are committed
- when previews are discarded

Requirements:
- similar patterns should behave similarly across terrain modes
- the user should not have to relearn basic interaction rules per mode
- partial operations should resolve safely

This is a huge trust builder.

---

### 10) Terrain shortcut and quick-action pass
Improve shortcut support and discoverability for terrain workflows.

At minimum consider:
- sculpt tool switching
- landform tool switching
- terrain preview mode switching
- surface mode toggle
- fit terrain view / reset terrain view
- quick accept/discard for runtime suggestions where practical
- quick toggle for contour/relief/surface layers if appropriate

Requirements:
- shortcuts should not conflict badly with text editing
- useful hints should appear in tooltips, status bar, or help surfaces
- terrain shortcuts should feel consistent with Phase 1 editor shortcuts

Do not overbuild.  
A practical small pass is enough if it helps a lot.

---

### 11) Terrain readout polish
Improve terrain readouts where useful.

Examples:
- sampled height under cursor
- slope under cursor
- current preview mode
- current terrain layer
- hydrology trace state
- biome suggestion category under cursor
- surface mode status
- terrain-seeded lineage hint

These can appear in:
- status bar
- inspector
- small overlay readouts
- terrain panel

The goal is to make terrain feel measurable and legible.

---

### 12) Performance-focused terrain editing pass
Do a targeted performance pass on the most important terrain workflows.

Good areas to review:
- sculpt stroke responsiveness
- chunk update locality
- landform preview responsiveness
- preview-mode switching cost
- surface refresh behavior after edits
- hydrology and biome suggestion refresh behavior
- map switching across world/region/local terrain contexts

Requirements:
- reduce obvious stutter where practical
- avoid unnecessary full-map recomputation where chunk-local updates are enough
- avoid unnecessary React rerender storms from terrain operations
- keep improvements scoped and practical

Do not chase theoretical perfection.  
Fix the performance pain the user would actually feel.

---

### 13) Surface mode and analysis mode UX polish
Refine the relationship between:
- height view
- relief view
- slope view
- contour view
- combined or hybrid views if they exist
- richer surface rendering mode

Requirements:
- mode switching should be coherent
- the current mode should always be obvious
- the user should understand when they are in analysis vs surface presentation
- the surface mode should not make terrain editing feel less controllable
- analysis modes should still feel first-class and useful

This is a major UX coherence point for Phase 2.

---

### 14) Hydrology assist UX polish
Refine hydrology assist so it feels more editor-like and less experimental.

Good candidates:
- clearer source-point picking
- clearer end-condition messaging for flow traces
- clearer accept-as-river actions
- clearer basin/lake preview labeling
- better distinction between preview and committed river/water content
- cleaner settings grouping

The user should feel helped, not confused.

---

### 15) Biome assist UX polish
Refine biome assist so it feels more transparent and controllable.

Good candidates:
- clearer terrain factors summary
- clearer rule/preset display
- better overlay readability
- clearer accept/discard workflow
- better target biome layer messaging
- stronger distinction between suggestion and authored biome paint/data

The user should feel like they are steering the system.

---

### 16) Multi-scale terrain UX polish
Refine terrain behavior across world / region / local.

Good areas:
- current-scope terrain badges
- terrain lineage readability
- seeded-from-parent summaries
- easy “return to parent” context while terrain editing
- current active map visibility in terrain panels
- child terrain creation defaults clarity

The nested-map terrain workflow should feel powerful, not murky.

---

### 17) Terrain import/export UX polish
Refine terrain import/export workflows so they feel safer and clearer.

Good candidates:
- clearer source/target labeling
- better overwrite warnings
- clearer grayscale mapping explanation
- better new-layer vs overwrite decisions
- stronger success/failure feedback
- reduced ambiguity around what format is actually supported

This is a trust-heavy part of Phase 2 and deserves a polish pass.

---

### 18) Surface renderer polish
Refine the richer terrain surface renderer where practical.

Good candidates:
- improve legibility of terrain shape
- tune biome tint subtlety
- tune water/coast blending
- improve coexistence with labels/symbols/vector overlays
- improve switching between surface and analysis modes
- reduce obvious noisy/muddy rendering behavior

Do not turn this into a whole new rendering prompt.  
This is a tuning and usability pass.

---

### 19) Empty states and first-use terrain guidance
Improve terrain-related empty and first-use states.

Examples:
- no terrain layer yet
- no valid terrain target
- no hydrology source yet
- no biome target yet
- no imported terrain yet
- no child terrain seeded yet
- surface mode unavailable due to missing terrain content

These should feel informative and calm, not lazy or cryptic.

A little copy polish can go a long way here.

---

### 20) Terrain terminology and wording consistency pass
Do a deliberate pass on terrain-related wording.

Examples:
- consistent use of terms like:
  - terrain layer
  - elevation layer
  - active terrain target
  - preview
  - accept
  - commit
  - seed from parent
  - surface mode
- remove dev/debug phrasing leaking into user-facing surfaces
- align naming across panels, status, inspector, and tool settings

This is one of the easiest ways to make the editor feel more finished.

---

### 21) Optional lightweight terrain help surface
If it fits naturally, add a small help surface for terrain workflows.

Good possibilities:
- terrain shortcut reference
- concise terrain-mode explanation panel
- contextual “what this mode does” hint area
- small info popup for import/export mapping

This is optional, but can make the terrain systems feel much more approachable.

Keep it restrained.

---

### 22) Honesty about remaining rough edges
Be explicit in `STATUS.md` about what this polish pass improved and what still remains rough.

Good examples:
- sculpt tools feel much clearer, but advanced brush presets are deferred
- hydrology assist is useful, but not a full watershed simulator
- surface mode is much improved, but not photoreal
- terrain import/export is practical, but not a GIS-grade interchange suite
- multi-scale terrain seeding works, but live parent-child sync is still deferred

Honest notes here will make the Phase 2 handoff much stronger.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/terrain/...`
- `src/components/panels/...`
- `src/components/layout/...`
- `src/features/shortcuts/...`
- `src/store/editorActions/ui...`
- `src/lib/ui/...`

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- terrain-mode and active-target context are much easier to understand
- tool settings and inspector are more coherent for terrain workflows
- blocked states and preview-vs-authored distinctions are clearer
- terrain overlays/cursors/previews feel more readable and consistent
- major terrain workflows feel smoother and less confusing
- a targeted performance pass improves practical terrain interaction reliability
- terrain terminology and visible UI roughness are reduced
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- compact terrain shortcut reference
- stronger target badge in the layer panel
- terrain mode chips in the top bar
- small terrain help overlay
- better toast/feedback system for terrain actions

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- improved terrain tool UX
- better terrain-target and terrain-mode clarity
- better inspector/tool-settings polish for terrain systems
- targeted performance and interaction improvements
- reduced terrain workflow friction
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the terrain side of the editor should feel noticeably better to work in.

Not because it has a giant new subsystem, but because the existing terrain systems feel more coherent, more readable, and more trustworthy in actual mapmaking use.

That is the bar.
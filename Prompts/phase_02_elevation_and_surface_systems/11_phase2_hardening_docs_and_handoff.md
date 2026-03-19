# 11 — Phase 2 Hardening, Docs, and Handoff

## Objective
Stabilize and finish **Phase 2 — Elevation and Surface Systems** of World Seed Mapper by hardening the terrain workflows, improving reliability, tightening the editor experience, documenting the terrain architecture clearly, and leaving the repository in a strong handoff-ready state for Phase 3.

This prompt is where Phase 2 stops being “the current terrain build” and becomes “a completed terrain milestone.”

---

## Why this prompt exists
By this point, Phase 2 should already include the major terrain systems:

- elevation-capable layers
- chunk-aware terrain data
- sculpt brushes
- landform tools
- terrain preview modes
- hydrology assistance
- biome assistance
- multi-scale terrain workflows
- terrain import/export and persistence
- upgraded surface rendering
- terrain UX/performance polish

Now the goal is not to start new major systems.

Now the goal is to:
- make the terrain workflows more stable
- reduce breakage and rough edges
- confirm major end-to-end terrain flows actually hold together
- document what exists and what does not
- leave Phase 2 in a trustworthy state
- set Phase 3 up cleanly

This prompt should be treated like a real hardening pass, not an excuse to feature-creep.

---

## Required outcome
By the end of this prompt, the repo should have:

- a more stable and coherent Phase 2 build
- major terrain workflows sanity-checked end to end
- obvious terrain bugs or integration gaps fixed where practical
- clearer setup/run/docs updates for terrain systems
- clearer terrain architecture documentation
- clearer user-facing limitations and known-issues notes for Phase 2
- a stronger final `STATUS.md`
- a useful Phase 3 handoff summary
- a runnable, handoff-ready repository state

---

## Constraints
- Do **not** start major new product systems in this prompt.
- Do **not** rewrite working systems unless they are causing meaningful breakage or major maintainability issues.
- Do **not** hide serious terrain limitations behind vague wording.
- Do **not** spend the whole prompt polishing tiny visuals while core terrain workflows remain shaky.
- Do **not** over-engineer testing infrastructure if a practical hardening pass can still be done well.
- Do **not** destabilize Phase 1 features while hardening Phase 2.

---

## Main goal
Leave World Seed Mapper Phase 2 in a state where someone can honestly say:

- “Terrain editing works.”
- “The main terrain workflows are present.”
- “The limits are documented.”
- “I know what the terrain system can do.”
- “I know what Phase 3 should build next.”

That is the bar.

---

## What to do

### 1) End-to-end terrain workflow sanity pass
Do a practical end-to-end review of the major Phase 2 terrain workflows.

At minimum sanity-check flows such as:
- create/open a project with terrain-capable maps
- create/select terrain layers
- sculpt terrain with raise/lower/smooth/flatten
- create landforms like ridges/basins/plateaus/terraces
- switch terrain preview modes
- use hydrology assist
- use biome assist
- create region/local maps with terrain seeding
- save and reopen terrain-heavy projects
- import/export terrain / heightmap data
- switch between analysis and richer surface modes
- use globe preview with the improved surface renderer where applicable

Fix obvious integration breaks that surface during this pass.

This is one of the most important parts of the prompt.

---

### 2) Fix meaningful terrain bugs and integration issues
Address practical problems that make the Phase 2 terrain experience unreliable or confusing.

Examples:
- wrong active terrain target behavior
- stale terrain target after map/layer switching
- terrain preview not refreshing coherently
- sculpt/history issues
- landform commit/cancel problems
- hydrology assist acceptance issues
- biome assist promotion issues
- seeded child terrain not behaving correctly
- terrain load/save bugs
- terrain import/export mismatches
- surface renderer conflicts with labels/symbols/vector overlays

Do not chase tiny perfection.  
Do fix the things that would undermine trust in the terrain build.

---

### 3) Clean up major user-facing terrain rough edges
Reduce the most obvious “prototype smell” still visible in terrain-related surfaces.

Examples:
- leftover placeholder text
- confusing empty states
- inconsistent terrain naming
- dev/debug phrasing leaking into user-facing terrain UI
- actions that look supported but are not actually stable
- unclear preview-vs-authored messaging
- confusing terrain import/export prompts

The goal is not luxury polish.  
The goal is to make the Phase 2 terrain build feel intentionally delivered.

---

### 4) Review and tighten terrain defaults
Make sure terrain-related startup/default/editor behavior is coherent.

At minimum review:
- default terrain layer creation behavior
- default terrain target behavior
- default terrain preview mode behavior
- default landform/hydrology/biome settings where relevant
- default seeded-child terrain behavior
- default import/export naming and safety behavior
- default surface mode/readability balance

The terrain system should open into sane, usable behavior, not strange partial states.

---

### 5) Harden terrain persistence behavior
Do a focused pass on terrain save/load reliability.

At minimum verify and tighten:
- terrain chunk persistence
- terrain metadata persistence
- child-map seeded terrain persistence
- save/open/save-as workflows with terrain-heavy projects
- dirty-state behavior after terrain edits
- load reconstruction of terrain layers, previews, and active terrain context where appropriate
- handling of malformed terrain data where feasible

If anything remains partial, document it honestly.

This is one of the biggest trust pillars in Phase 2.

---

### 6) Harden terrain import/export behavior
Do a focused pass on terrain interchange reliability.

At minimum verify and tighten:
- grayscale heightmap export
- structured terrain data export
- grayscale heightmap import
- import mapping behavior
- overwrite-vs-new-layer safety behavior
- active map scope correctness
- error feedback on bad terrain input
- naming/path handling

The terrain interchange system does not need to be perfect, but it should feel real and dependable.

---

### 7) Harden multi-scale terrain behavior
Do a focused pass on world → region → local terrain workflows.

At minimum verify:
- child-map terrain seeding from parent extent
- child terrain independence after seeding
- active terrain target correctness after scope switches
- terrain preview correctness in child maps
- hydrology and biome assists working on child maps
- terrain lineage metadata remaining understandable
- save/load preserving multi-scale terrain context

This is a signature Phase 2 feature and should feel controlled and trustworthy.

---

### 8) Harden hydrology and biome assist workflows
Do a focused pass on the assistive systems.

For hydrology assist, verify:
- downhill flow previews
- basin/lake suggestions
- accept-as-river or related promotion workflow
- preview-vs-authored distinction
- active terrain source correctness

For biome assist, verify:
- terrain-aware suggestion overlay
- promotion into authored biome layers
- settings/preset behavior
- target biome layer correctness
- preview-vs-authored distinction

These systems should feel helpful and understandable, not experimental.

---

### 9) Harden surface renderer behavior
Do a focused pass on the richer surface renderer.

At minimum review:
- switching between surface and analysis modes
- localized refresh after terrain edits
- readability of labels/symbols/vector content on top
- water/coast/biome integration
- multi-scale consistency
- compatibility with globe preview expectations
- performance on larger terrain maps

This renderer is one of the biggest visible leaps in Phase 2, so it should feel trustworthy even if still limited.

---

### 10) Cleanup of dead or misleading terrain UI
Audit terrain-related visible UI actions and remove or clarify anything misleading.

Examples:
- controls that imply full simulation when only assist exists
- terrain import/export options that imply unsupported formats
- preview controls that look committed when they are runtime-only
- hidden/destructive actions without clear warning
- terrain settings that do nothing meaningful yet
- surface mode options that should be disabled or explained

It is better to have fewer honest controls than more misleading ones.

---

### 11) Documentation: README updates
Create or substantially improve terrain-related documentation in `README.md` or related docs.

At minimum include:
- what Phase 2 added
- how terrain layers work at a high level
- what sculpt/landform/hydrology/biome/surface systems currently do
- terrain save/load and import/export overview
- multi-scale terrain workflow overview
- important limitations and deferred items

The README should be useful to a real human opening the repo fresh after Phase 2.

---

### 12) Documentation: terrain architecture notes
Add practical architecture documentation for the Phase 2 terrain systems.

This can be in the README or a separate docs file, but it should explain enough of the terrain shape that Phase 3 work starts cleanly.

Good topics:
- terrain data model and chunk strategy
- active terrain target rules
- terrain runtime vs authored data separation
- terrain preview/surface architecture
- hydrology assist philosophy
- biome assist philosophy
- multi-scale terrain seeding and independence rules
- terrain import/export architecture

Do not write a giant novel.  
Write enough to support future work.

---

### 13) Documentation: user-facing Phase 2 capabilities
Add a concise summary of what the terrain system can currently do.

At minimum summarize capabilities like:
- terrain layers
- sculpting and landforms
- terrain previews
- hydrology assistance
- biome assistance
- child-map terrain seeding
- terrain import/export
- richer surface rendering

This makes handoff and review much easier.

---

### 14) Documentation: known limitations / deferred terrain items
Be honest about current terrain limitations.

Create a practical list of items such as:
- no full erosion simulation yet
- no full climate simulation yet
- no live bi-directional parent-child terrain sync
- hydrology assist is not a full fluid simulator
- biome assist is not a full ecological/climate engine
- surface renderer is not photoreal
- globe preview still uses world-map truth, not full 3D terrain editing
- terrain interchange is practical, not GIS-grade

This list builds trust and focuses Phase 3.

---

### 15) Phase 3 handoff notes
Create a short but useful **Phase 3 handoff summary**.

This should help the next queue or developer understand what comes next.

Good content:
- recommended Phase 3 focus areas
- systems now ready for extension
- likely next architectural expansion points
- places where scale/performance should be improved next
- current terrain technical debt to watch
- what Phase 3 should not casually break

A concise, grounded handoff is enough.

---

### 16) Code organization cleanup
Do a practical cleanup pass on code organization where it meaningfully improves maintainability.

Examples:
- move obviously misplaced terrain files
- remove dead code/imports
- consolidate duplicated terrain helpers
- tighten naming consistency
- reduce obvious panel/store clutter
- clean up exports/types that became messy during the build

Do not do gratuitous churn.  
Do clean what genuinely improves the handoff.

---

### 17) Lint/type/build sanity
Run and address the most relevant quality checks available.

At minimum:
- TypeScript sanity
- build sanity
- lint sanity where available
- Tauri app launch sanity if practical within the repo workflow
- terrain-heavy workflows that could expose runtime errors

Fix obvious errors introduced by the Phase 2 queue.

If some warnings remain, document them honestly if they matter.

The repo should not be left in a knowingly sloppy state.

---

### 18) Final STATUS.md completion
Update `STATUS.md` carefully and honestly.

Requirements:
- mark the final Phase 2 prompt complete
- ensure every queue entry reflects reality
- fill in run logs with meaningful summaries
- note important files added/changed
- note known limitations/follow-ups honestly
- update overall project status summary
- make sure end-of-phase checklist reflects truth

`STATUS.md` should be a trustworthy record, not a rushed checkbox dump.

---

### 19) Final user-facing handoff quality
Before finishing, make sure the repo feels like a deliverable Phase 2 milestone.

A new person opening it should be able to understand:
- what the terrain systems now do
- how to use them at a high level
- what is still missing
- where Phase 3 should go next

This is partly code, partly docs, partly honesty.

---

### 20) Performance-sensitive hardening guidance
During hardening, avoid turning the terrain system heavier or more fragile.

Aim for:
- targeted bug fixes
- safer defaults
- clearer docs
- better workflow reliability
- cleanup that improves maintainability

Avoid:
- massive destabilizing refactors
- adding heavy new dependencies without strong reason
- feature creep disguised as hardening
- visual churn that reopens solved problems

This is the stabilization pass.

---

### 21) Honesty rule
Be explicit in docs and `STATUS.md` about what is truly complete versus what is merely foundational.

Good examples:
- “terrain chunk persistence is functional, but not yet deeply optimized for extreme map sizes”
- “hydrology assist provides downhill and basin guidance, but is not a physical water simulator”
- “biome assist uses terrain-aware rules, but is not a climate engine”
- “child terrain is seeded from parent extents and then treated as independent authored terrain”
- “surface mode is a strong baseline, not full satellite realism”

Do not oversell.  
Do not undersell real progress either.  
Be precise.

---

## Suggested file targets
Use or improve files such as:

- `README.md`
- the Phase 2 `STATUS.md`
- optional `docs/...`
- relevant cleanup across `src/...`
- relevant cleanup across `src-tauri/...`

You may choose slightly different documentation locations if they are cleaner.

---

## Acceptance criteria
This prompt is complete when:

- major Phase 2 terrain workflows have been sanity-checked end to end
- meaningful terrain bugs/integration issues found during review are fixed where practical
- terrain startup/default/editor behavior feels coherent
- terrain persistence/import/export/multi-scale/surface flows are more trustworthy
- misleading/dead visible terrain UI has been reduced or clarified
- README and/or docs clearly explain Phase 2 terrain scope and architecture
- known limitations and Phase 3 direction are documented honestly
- `STATUS.md` is fully and truthfully updated
- the repo is left in a runnable, handoff-ready state for Phase 3

---

## Nice-to-have additions
Include only if they fit naturally:

- small terrain troubleshooting section in README
- concise developer notes on terrain architecture hotspots
- sample terrain import/export explanation
- “what Phase 3 should not break” notes
- small cleanup for generated or debug noise files if appropriate

Do not let these distract from the main hardening job.

---

## Deliverables
Codex should leave behind:

- a hardened Phase 2 terrain build
- improved terrain setup/run/use documentation
- clearer terrain architecture and limitations notes
- final Phase 2 `STATUS.md` completion
- useful Phase 3 handoff guidance
- a repository that feels ready for the next phase

---

## Definition of done note
After this prompt, World Seed Mapper Phase 2 should feel like a completed terrain milestone.

Not perfect. Not final. But real, runnable, documented, and ready to hand forward into Phase 3 without confusion.

That is the bar.
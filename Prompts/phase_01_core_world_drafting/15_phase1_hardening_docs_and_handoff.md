# 15 — Phase 1 Hardening, Docs, and Handoff

## Objective
Stabilize and finish **Phase 1 — Core World Drafting** of World Seed Mapper by hardening the existing implementation, improving reliability, cleaning up obvious rough edges, documenting the project clearly, and leaving the repository in a handoff-ready state for Phase 2.

This prompt is where the project stops being “the current build” and becomes “a completed Phase 1.”

---

## Why this prompt exists
By this point, the app should already include the major Phase 1 systems:

- Tauri desktop shell
- world canvas and navigation
- layers
- vector tools
- paint/masks
- symbols
- labels
- nested maps
- project persistence
- export pipeline
- globe preview
- editor polish

Now the goal is not to start new major systems.

Now the goal is to:
- make the app more stable
- reduce breakage and rough edges
- confirm major workflows hold together
- document what exists and what does not
- leave Phase 1 in a trustworthy state
- set Phase 2 up cleanly

This prompt should be treated like a real project hardening pass, not an excuse to wander into new features.

---

## Required outcome
By the end of this prompt, the repo should have:

- a more stable and coherent Phase 1 build
- major workflow sanity-checked end to end
- obvious bugs or integration gaps fixed where practical
- clearer setup/run documentation
- clearer project structure documentation
- clearer user-facing limitations and known issues notes
- a stronger final `STATUS.md`
- a useful Phase 2 handoff summary
- a runnable, handoff-ready repository state

---

## Constraints
- Do **not** start major new product systems in this prompt.
- Do **not** rewrite working systems unless they are causing meaningful breakage or major maintainability issues.
- Do **not** hide serious limitations behind vague wording.
- Do **not** leave setup instructions half-broken.
- Do **not** spend the whole prompt polishing trivial visuals while core workflows remain shaky.
- Do **not** over-engineer testing infrastructure if a practical hardening pass can still be done well.

---

## Main goal
Leave World Seed Mapper Phase 1 in a state where someone can honestly say:

- “It launches.”
- “It works.”
- “The main workflows are present.”
- “The limits are documented.”
- “I know how to run it.”
- “I know what Phase 2 should build next.”

That is the bar.

---

## What to do

### 1) End-to-end workflow sanity pass
Do a practical end-to-end review of the major user flows already built.

At minimum sanity-check flows such as:
- launch the app
- open/create a project
- work on the world canvas
- add/manage layers
- create/edit vector features
- paint masks/biomes/weather overlays
- place/edit symbols
- place/edit labels
- create region/local maps
- save project
- reopen project
- export map outputs
- open globe preview
- return to flat editing

Fix obvious integration breaks that surface during this pass.

This is one of the most important parts of the prompt.

---

### 2) Fix meaningful bugs and rough integration points
Address practical problems that make the Phase 1 experience unreliable or confusing.

Examples:
- actions wired in UI but not functioning correctly
- broken active-layer assumptions
- selection state getting stuck
- unsaved state not updating correctly
- load/save issues
- export issues
- preview issues
- broken scope switching
- missing defaults that make the app feel unstable
- panel/tool state inconsistencies
- canvas/view glitches

Do not chase tiny perfection.  
Do fix the things that would undermine trust in the build.

---

### 3) Clean up major user-facing rough edges
Reduce the most obvious “prototype smell” that still remains.

Examples:
- leftover placeholder text in visible user-facing surfaces
- confusing empty states
- inconsistent naming
- dev/debug phrasing leaking into production UI
- obviously unfinished buttons that should be hidden/disabled/explained
- dead actions with no feedback
- confusing panel labels

The goal is not luxury polish.  
The goal is to make the Phase 1 build feel intentionally delivered.

---

### 4) Review and tighten defaults
Make sure startup/default project/editor behavior is coherent.

At minimum review:
- default untitled project state
- default world map existence
- default layer stack
- default selected tool
- default selected/open map
- default view framing
- default panel state
- default export/save naming behavior where appropriate

The app should open into a sane usable state, not a strange half-empty one.

---

### 5) Harden persistence behavior
Do a focused pass on persistence reliability.

At minimum verify and tighten:
- new project flow
- save
- save as
- open project
- dirty-state handling
- unsaved change prompts
- reconstruction of maps/layers/content after load
- handling of malformed or missing project files where already feasible

If anything remains partial, document it honestly.

This is one of the biggest trust pillars in the app.

---

### 6) Harden export behavior
Do a focused pass on export reliability.

At minimum verify and tighten:
- PNG export
- SVG export behavior and honesty about unsupported content
- JSON export
- map-scope correctness
- export naming defaults
- path handling
- user feedback on success/failure

The export system does not need to be perfect, but it should feel real and dependable.

---

### 7) Harden globe preview behavior
Do a focused pass on globe preview reliability.

At minimum review:
- entering/exiting globe preview
- source map behavior
- world-only rule clarity
- texture generation
- camera controls
- refresh/update behavior
- fallback handling for invalid/no world data

This is a signature feature, so it should feel controlled and trustworthy even if still limited.

---

### 8) Review and tighten nested-map workflow
Do a focused pass on world → region → local behavior.

At minimum verify:
- child map creation from extent
- map switching
- breadcrumb/hierarchy display
- parent extent visualization
- active-scope indicators
- child-map naming/defaults
- parent/child relationship persistence after save/load

This is another signature feature, so any obvious confusion or breakage here should be addressed.

---

### 9) Cleanup of dead or misleading UI
Audit visible UI actions and remove or clarify anything misleading.

Examples:
- buttons that appear clickable but do nothing meaningful
- advanced controls that imply unsupported capability
- placeholders that look like real features
- controls that should be disabled when not available
- unclear preview/export actions

It is better to have fewer honest controls than more misleading ones.

---

### 10) Documentation: README
Create or substantially improve the project `README.md`.

At minimum include:
- what World Seed Mapper is
- current Phase 1 scope
- stack overview
- how to install dependencies
- how to run the app
- how to run the Tauri desktop app
- important folder structure overview
- what major systems are currently included
- what is intentionally deferred to Phase 2
- any important caveats/limitations

The README should be useful to a real human opening the repo fresh.

---

### 11) Documentation: project structure / architecture notes
Add practical architecture documentation.

This can be in the README or a separate docs file, but it should explain enough of the project shape that Phase 2 work starts cleanly.

Good topics:
- app shell vs engine vs persistence boundaries
- document model overview
- layer/content system overview
- nested-map model
- export/persistence/globe-preview relationships
- where key code lives

Do not write a giant novel.  
Write enough to support future work.

---

### 12) Documentation: user-facing Phase 1 capabilities
Add a concise summary of what the app can currently do.

This could be part of the README, a docs file, or both.

At minimum summarize capabilities like:
- world canvas navigation
- layer system
- vector authoring
- paint/masks
- symbols
- labels
- nested maps
- persistence
- export
- globe preview

This makes handoff and review much easier.

---

### 13) Documentation: known limitations / deferred items
Be honest about current limitations.

Create a practical list of items such as:
- what is intentionally not complete yet
- what is structurally supported but still basic
- what is deferred to Phase 2
- any known rough edges still present after hardening

Examples:
- no advanced terrain/elevation editing yet
- no live globe editing
- SVG export only partial for certain layer kinds
- no full climate simulation yet
- no large custom asset import UI yet

This list builds trust and focuses Phase 2.

---

### 14) Phase 2 handoff notes
Create a short but useful **Phase 2 handoff summary**.

This should help the next queue or developer understand what comes next.

Good content:
- recommended Phase 2 focus areas
- likely next architectural expansion points
- systems that are ready for extension
- systems that need care when expanding
- current pain points or technical debt to watch

A concise, grounded handoff is enough.

---

### 15) Code organization cleanup
Do a practical cleanup pass on code organization where it meaningfully improves maintainability.

Examples:
- move obviously misplaced files
- remove dead code/imports
- consolidate duplicated helpers
- tighten naming consistency
- reduce obvious component/store clutter
- clean up types or exports that became messy during the build

Do not do gratuitous churn.  
Do clean the things that genuinely improve handoff readiness.

---

### 16) Lint/type/build sanity
Run and address the most relevant quality checks available.

At minimum:
- TypeScript sanity
- build sanity
- lint sanity where available
- Tauri app launch sanity if practical within the repo workflow

Fix obvious errors introduced by the queue.

If some warnings remain, document them honestly if they matter.

The final repo should not be left in a knowingly sloppy state.

---

### 17) Final STATUS.md completion
Update `STATUS.md` carefully and honestly.

Requirements:
- mark the final prompt complete
- ensure every queue entry reflects reality
- fill in run logs with meaningful summaries
- note important files added/changed
- note known limitations/follow-ups honestly
- update overall project status summary
- make sure end-of-phase checklist reflects truth

`STATUS.md` should be a trustworthy record, not a rushed checkbox dump.

---

### 18) Final user-facing handoff quality
Before finishing, make sure the repo feels like a deliverable.

A new person opening it should be able to understand:
- what this project is
- how to run it
- what Phase 1 delivered
- what still remains
- where to go next

This is partly code, partly docs, partly honesty.

---

### 19) Performance-sensitive hardening guidance
During hardening, avoid turning the app heavier or more fragile.

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
- UI churn that reopens solved problems

This is the stabilization pass.

---

### 20) Honesty rule
Be explicit in docs and `STATUS.md` about what is truly complete versus what is merely foundational.

Good examples:
- “paint chunk persistence is functional but not yet optimized”
- “globe preview works from the root world map only”
- “SVG export currently emphasizes vector/label content and does not fully preserve all painted overlays”
- “nested child maps are anchored and navigable, but advanced live parent-child sync is deferred”

Do not oversell.  
Do not undersell real progress either.  
Be precise.

---

## Suggested file targets
Use or improve files such as:

- `README.md`
- `prompts/STATUS.md`
- optional `docs/...`
- relevant cleanup across `src/...`
- relevant cleanup across `src-tauri/...`

You may choose slightly different documentation locations if they are cleaner.

---

## Acceptance criteria
This prompt is complete when:

- major Phase 1 workflows have been sanity-checked end to end
- meaningful bugs/integration issues found during review are fixed where practical
- startup/default/editor behavior feels coherent
- persistence/export/globe/nested-map flows are more trustworthy
- misleading/dead visible UI has been reduced or clarified
- README and/or docs clearly explain setup, scope, and architecture
- known limitations and Phase 2 direction are documented honestly
- `STATUS.md` is fully and truthfully updated
- the repo is left in a runnable, handoff-ready state

---

## Nice-to-have additions
Include only if they fit naturally:

- small troubleshooting section in README
- concise developer setup notes
- sample project folder explanation
- “what Phase 2 should not break” notes
- small repo cleanup for generated noise files if appropriate

Do not let these distract from the main hardening job.

---

## Deliverables
Codex should leave behind:

- a hardened Phase 1 build
- improved setup/run documentation
- clearer architecture and limitations notes
- final `STATUS.md` completion
- useful Phase 2 handoff guidance
- a repository that feels ready for the next phase

---

## Definition of done note
After this prompt, World Seed Mapper Phase 1 should feel like a completed milestone.

Not perfect. Not final. But real, runnable, documented, and ready to hand forward into Phase 2 without confusion.

That is the bar.
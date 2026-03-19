# 08 — Symbols, Stamps, and Feature Placement

## Objective
Implement the first real **symbol and stamp placement workflow** for World Seed Mapper so the user can place, select, move, style, and organize map features such as mountains, forests, cities, ruins, ports, landmarks, and other visual markers on dedicated feature layers.

This prompt is where the map begins to gain authored visual richness beyond lines and painted regions.

---

## Why this prompt exists
A serious fantasy map editor needs more than:
- vector coastlines
- painted masks
- weather overlays

It also needs authored feature placement:
- mountain symbols
- tree/forest stamps
- settlement markers
- ruin icons
- roadsides/waypoints
- landmarks
- custom decorative features

These should be:
- layer-aware
- selectable
- editable
- future-ready for libraries and imports
- visually useful now even with a modest starter pack

This prompt should establish a clean symbol-placement system that can later grow into a much larger feature library.

---

## Required outcome
By the end of this prompt, the app should have:

- a real symbol/feature placement workflow
- support for symbol-capable layers
- a starter symbol/stamp set or an equivalent clean placeholder pack
- on-canvas placement of symbols/features
- selection of placed symbols
- movement/repositioning of placed symbols
- rotation/scale support at a practical baseline
- inspector integration for selected symbols
- tool settings integration for placement defaults
- layer compatibility rules for feature placement
- clear rendering and ordering on the world canvas
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** attempt to build the full grand fantasy asset library in this prompt.
- Do **not** block progress on perfect art assets.
- Do **not** hardcode the system so only built-in symbols can ever exist.
- Do **not** treat placed symbols as dead decoration with no editability.
- Do **not** make placement ignore layer visibility/lock rules.
- Do **not** overbuild a full marketplace/import pipeline yet.

---

## Main goal
Create a symbol-placement system that already feels like the beginning of a real fantasy map tool:

- choose a stamp/feature tool
- choose a symbol category or symbol asset
- place it on the map
- see it render clearly
- select it later
- move/rotate/scale it
- keep it attached to a proper symbol/feature layer

This should feel like real authored content, not stickers taped onto the app.

---

## What to build

### 1) Symbol tool foundation
Add real symbol/feature placement tools to the tool rail and shared editor state.

At minimum support:
- place feature/symbol tool
- select/edit symbol tool, or allow select tool to edit placed symbols
- optional category-aware placement modes if that fits naturally

Good categories for a starter system:
- mountains
- forests/trees
- settlements/cities
- ruins
- towers/keeps
- ports/ships
- landmarks/misc markers

You do not need a separate rail button for every category if one symbol-placement tool with category selection is cleaner.

---

### 2) Compatible layer behavior
Symbol placement should only target compatible layers.

Requirements:
- symbols can only be placed on symbol/feature-capable layers
- wrong-layer situations are handled clearly
- optionally offer:
  - auto-create symbol layer
  - switch to compatible symbol layer
- locked/hidden layers cannot be authored to
- group layers are not direct placement targets unless your model explicitly supports that later

Do not silently place symbols into the wrong layer.

---

### 3) Starter asset/stamp set
Provide a modest but useful starter symbol set.

This can be:
- simple vector-like built-ins
- lightweight SVG/shape assets
- small clean placeholder icons made for the app
- or a minimal internal asset definition set if visual assets are still basic

The key is that the workflow is real.

The starter set should cover a sensible initial spread such as:
- mountain
- hill
- tree/forest
- city/town
- village
- castle/fort
- ruin
- tower
- port/anchor
- landmark/star or marker

They do not need to be beautiful masterpieces yet.  
They do need to be clear enough to prove the system works.

---

### 4) Symbol asset model hookup
Use the document model properly.

Placed symbols/features must be persisted as real authored entities.

Each placed symbol should reasonably capture:
- id
- symbol asset key/reference
- category/kind
- position in document space
- rotation
- scale
- optional tint/style overrides if supported
- layer id
- optional label/title placeholder
- metadata/tags if natural

The asset reference model should remain future-ready for:
- larger built-in libraries
- user-imported symbols later
- style packs later

---

### 5) On-canvas placement workflow
Implement a usable symbol placement flow.

At minimum:
- select symbol placement tool
- choose symbol or category
- click the canvas to place a symbol
- symbol appears on the correct layer at the clicked document-space position
- placement obeys current camera transforms correctly
- active layer becomes clear in UI
- placement can be repeated without re-entering the tool unless you intentionally choose single-place behavior

Good optional refinements:
- ghost preview under cursor before placement
- snap placeholder if useful later
- placement mode staying active until Escape/tool switch

The workflow should feel fast and intentional.

---

### 6) Symbol rendering on canvas
Render placed symbols clearly on the world canvas.

Requirements:
- symbols render on the correct layer
- ordering respects layer stack
- visibility/opacity respect layer settings
- selected symbols are visually distinct
- scale remains understandable across zoom levels
- rendering architecture is future-ready for larger counts of features

Simple and clean is fine.  
Clarity matters more than style perfection here.

---

### 7) Symbol selection and editing
Placed symbols must be selectable and editable.

At minimum:
- click a placed symbol to select it
- selected symbol updates shared selection state
- selected symbol is visually highlighted
- selected symbol can be moved
- selection clears coherently when appropriate

Good optional refinements if natural:
- hover highlight
- anchor marker
- bounding/selection frame

The main thing is: placed features must be real editor objects, not dead stamps.

---

### 8) Move / transform support
Implement the practical first transform controls for selected symbols.

At minimum:
- move selected symbol by dragging
- update persisted document-space position correctly
- obey lock/visibility rules
- commit changes cleanly for history integration

Good optional additions if natural:
- rotate selected symbol
- scale selected symbol
- simple gizmo/handle approach
- modifier keys for rotation/scale

You do not need a giant transform suite, but position plus at least a practical path to rotation/scale should exist.

---

### 9) Placement defaults and tool settings
The tool settings panel should meaningfully support symbol placement.

At minimum consider support for:
- active symbol/category
- default scale
- default rotation
- random rotation toggle placeholder if useful
- density/brush-like stamp mode placeholder if useful later
- layer target info

A few real editable controls are encouraged if they fit naturally.

This panel should begin feeling like the home of feature-placement configuration.

---

### 10) Inspector integration
Upgrade the inspector for selected symbol instances.

At minimum show:
- symbol/category name
- asset key/reference
- parent layer
- position
- rotation
- scale
- optional tags/title placeholder
- editable/locked state context

Light editing is welcome if natural:
- change symbol asset
- adjust scale
- adjust rotation
- rename/title
- change category/tag

Do not overbuild the symbol style system yet, but the inspector should feel real.

---

### 11) Symbol layer panel feedback
The layers panel should reflect symbol-content presence.

Nice examples:
- symbol count hint
- icon/badge for feature layers
- selected symbol’s parent layer remains obvious
- active symbol placement layer is easy to see

Keep it restrained and useful.

---

### 12) History integration
Placed symbol operations should begin participating in the editor history system.

At minimum support undo/redo for:
- place symbol
- move symbol
- delete symbol
- rotate/scale if those are implemented now

Do not turn every mousemove into useless history noise.  
Commit meaningful operations sensibly.

---

### 13) Deletion and cleanup
Implement basic symbol deletion.

At minimum:
- delete selected symbol
- clear/update selection state safely
- avoid orphan references
- work with current history rules

Keep this consistent with the broader editor editing model.

---

### 14) Asset/library architecture guidance
Do not let this become a one-off hardcoded feature list.

The system should clearly leave room for:
- built-in library expansion
- user-imported assets later
- category browsing/filtering later
- style packs later
- different visual map themes later

You do not need to build the whole browser now, but the internal structure should not box the project in.

A clean modest first asset picker is better than an elaborate brittle fake library.

---

### 15) Optional quick palette / picker UI
If it fits naturally, add a small symbol picker or palette.

Good outcomes:
- compact category tabs
- simple searchable list placeholder
- recently used symbols
- quick selection chips

This is optional, but a small picker often makes the system feel far more usable.

Do not let picker UI bloat the prompt.

---

### 16) Performance guidance
The symbol system should respect the large-map goal.

Aim for:
- efficient rendering of placed symbols
- no unnecessary React rerenders for every feature change
- scene/layer containers organized sensibly
- transform/selection overlays handled in runtime space
- future readiness for many placed features

Avoid:
- rebuilding every symbol sprite on every small unrelated state change
- storing runtime Pixi objects in persisted document data
- tying selection/highlight state to full document rewrites where unnecessary

---

### 17) UX guidance
The symbol workflow should feel playful but controlled.

Aim for:
- quick placement
- easy visible selection
- clear active asset/category
- modest, readable starter visuals
- transform behavior that feels dependable
- obvious layer targeting

Avoid:
- giant clumsy picker flows
- stamps that look placed but cannot be selected later
- all symbols rendering at absurd sizes
- silent wrong-layer failure
- confusing transform controls

This should feel like real feature authoring has arrived.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/symbol-tools/...`
- `src/engine/symbols/...`
- `src/lib/assets/...`
- `src/components/panels/SymbolPicker...`
- `src/store/editorActions/symbols...`

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- symbol/feature placement tools exist in the workflow
- the user can place symbols on compatible layers
- a modest starter symbol set exists
- placed symbols render on the canvas
- placed symbols can be selected
- selected symbols can at least be moved
- rotation/scale support exists at a practical baseline or is clearly prepared and partially implemented
- inspector/tool settings reflect symbol context
- layer visibility/locking/opacity rules are respected
- symbol operations participate sensibly in history
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- cursor ghost preview before placement
- recent symbols list
- duplicate selected symbol
- random rotation toggle
- quick scatter mode placeholder for future forests/mountains
- category tabs in the picker

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- real symbol/stamp placement workflow
- starter asset/stamp set
- selectable/movable placed feature entities
- inspector/tool-settings/history integration for symbols
- future-ready asset/library structure
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should start feeling like an actual fantasy mapmaker.

The user should be able to place mountains, forests, settlements, ruins, and landmarks with purpose-built tools and then adjust them as authored map content.

That is the bar.
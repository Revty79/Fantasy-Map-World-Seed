# 09 — Labels, Text Annotations, and Style Controls

## Objective
Implement the first real **label and text annotation workflow** for World Seed Mapper so the user can place, edit, move, style, and organize map text such as continent names, ocean labels, region names, city names, landmark labels, notes, and other textual annotations on dedicated label layers.

This prompt is where the map begins to speak.

---

## Why this prompt exists
A fantasy map is not usable with shapes and symbols alone.

It also needs meaningful text:
- continent names
- ocean names
- kingdoms
- mountain ranges
- rivers
- roads
- cities
- ruins
- map notes
- custom annotations

These labels should be:
- layer-aware
- selectable
- editable
- movable
- styleable
- future-ready for curved text, advanced typography, and theme packs

This prompt should establish a clean text-authoring system that already feels like part of a serious map editor.

---

## Required outcome
By the end of this prompt, the app should have:

- a real label/text placement workflow
- support for label-capable layers
- on-canvas placement of text labels and annotations
- selection of placed labels
- editing of label text content
- movement/repositioning of labels
- practical baseline style controls
- inspector integration for selected labels
- tool settings integration for text defaults
- layer compatibility rules for label placement
- clear text rendering on the world canvas
- history integration for major label operations
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** attempt to build a full desktop-publishing or typography suite in this prompt.
- Do **not** block progress on perfect font systems.
- Do **not** hardcode the system so labels can only ever be plain static text.
- Do **not** make labels dead overlays that cannot be selected or edited later.
- Do **not** ignore layer visibility/lock rules.
- Do **not** overbuild curved-on-path text if a clean future-ready foundation is better.

---

## Main goal
Create a text-labeling system that already feels like the beginning of a real fantasy/world map editor:

- choose a label tool
- click the map to place a label
- type or edit the text
- see it render clearly
- select it later
- move it
- adjust style basics
- keep it attached to a real label layer

This should feel like authored map content, not UI stickers floating above the app.

---

## What to build

### 1) Label tool foundation
Add real label/text tools to the tool rail and shared editor state.

At minimum support:
- place label/text tool
- select/edit label workflow, or allow the main select tool to edit placed labels
- optional note/annotation mode if it fits naturally

Good label intents for the system to support:
- world/region names
- water labels
- city/settlement labels
- landmark labels
- freeform annotation notes

You do not need a separate rail button for each label type if one label-placement tool with category/type settings is cleaner.

---

### 2) Compatible layer behavior
Label placement should only target compatible layers.

Requirements:
- labels can only be placed on label/text-capable layers
- wrong-layer situations are handled clearly
- optionally offer:
  - auto-create label layer
  - switch to compatible label layer
- locked/hidden layers cannot be authored to
- group layers are not direct text targets unless your model explicitly supports that later

Do not silently place text into the wrong layer.

---

### 3) Label entity model hookup
Use the document model properly.

Placed labels/annotations must be persisted as real authored entities.

Each label should reasonably capture:
- id
- text content
- label kind/category
- position in document space
- rotation
- scale or font size basis
- style settings
- anchor/alignment
- optional width/box constraints if applicable
- layer id
- optional notes/metadata/tags

The model should remain future-ready for:
- curved text
- path-attached labels
- style presets
- imported fonts/themes later

---

### 4) Baseline text rendering on canvas
Render labels clearly on the world canvas.

Requirements:
- labels render on the correct layer
- ordering respects layer stack
- visibility/opacity respect layer settings
- selected labels are visually distinct
- text remains readable and well-positioned during pan/zoom
- rendering architecture stays future-ready for more advanced typography later

A practical baseline is fine:
- straight horizontal text by default
- optional rotation support
- clean readable rendering
- minimal performance overhead

Clarity matters more than fancy typography right now.

---

### 5) Label placement workflow
Implement a usable label placement flow.

At minimum:
- select label tool
- click the canvas to place a new label
- the label is created at the clicked document-space position
- the user can immediately enter/edit text
- the new label appears on the correct layer
- placement obeys camera transforms correctly
- repeated placement is possible without awkward extra steps

Good practical options:
- click to place, then inline edit
- click to place with default placeholder text, then edit in inspector/overlay
- compact inline text-entry overlay anchored to the label

Choose the simplest approach that still feels like real authoring.

---

### 6) Text editing workflow
Implement real label text editing.

At minimum:
- user can edit label text after placement
- user can re-edit an existing selected label
- text changes update rendered content
- empty-label behavior is handled cleanly
- editing integrates sensibly with selection and history

Practical good behaviors:
- double-click selected label to edit
- Enter confirms text edit
- Escape cancels text edit
- deleting all text may delete the label or keep an empty placeholder based on your chosen rule, but be consistent

This should not feel like labels are write-once.

---

### 7) Label selection and movement
Placed labels must be selectable and movable.

At minimum:
- click a placed label to select it
- selected label updates shared selection state
- selected label is visually highlighted
- selected label can be moved by dragging
- selection clears coherently when appropriate

Good optional refinements if natural:
- anchor marker
- bounding/selection frame
- hover highlight
- drag preview

The main thing is that labels are real editor objects.

---

### 8) Practical style controls
Implement baseline text style controls.

At minimum consider support for:
- font size
- font weight/style placeholder if supported
- color
- opacity
- rotation
- alignment/anchor
- letter spacing placeholder if it fits naturally

You do **not** need a full typography engine.  
But the user should be able to do more than place one identical default label forever.

A good baseline is enough if it is clean and extendable.

---

### 9) Label categories / semantic intent
Support the idea that labels can have different semantic purposes.

Examples:
- continent/world label
- ocean/water label
- region/political label
- settlement label
- landmark label
- freeform note/annotation

This does not need a giant rules engine, but category/intention should exist in the model and inspector/tool settings.

That will matter later for presets, exports, and styling.

---

### 10) Tool settings integration
The tool settings panel should meaningfully support label placement.

At minimum consider support for:
- default label category
- default text style
- default font size
- default alignment/anchor
- default rotation
- target layer info

A few real editable defaults are encouraged if they fit naturally.

This panel should become the home of label-placement defaults.

---

### 11) Inspector integration
Upgrade the inspector for selected labels.

At minimum show:
- label text
- category/kind
- parent layer
- position
- rotation
- font size or scale basis
- alignment/anchor
- editable/locked state context

Light editing is welcome and encouraged:
- edit text
- change category
- adjust font size
- adjust color
- adjust rotation
- adjust alignment

Do not overbuild the style system, but the inspector should feel real and useful.

---

### 12) Layer panel feedback
The layers panel should reflect that label content exists.

Nice examples:
- label count hint
- icon/badge for label layers
- selected label’s parent layer remains obvious
- active label placement layer is easy to see

Keep it restrained and useful.

---

### 13) History integration
Label operations should participate in the editor history system.

At minimum support undo/redo for:
- place label
- edit label text
- move label
- delete label
- adjust basic style if that is implemented now

Do not create useless history noise for every keystroke if a better grouped commit pattern is practical.  
A text edit should feel like one sensible committed action when appropriate.

---

### 14) Deletion and cleanup
Implement basic label deletion.

At minimum:
- delete selected label
- clear/update selection state safely
- avoid orphan references
- work with current history rules

Keep this consistent with the rest of the editor editing model.

---

### 15) Annotation support
Support simple non-map-name annotations in addition to map labels.

This can be light, but the system should support the idea that not all text is geographic naming.

Good examples:
- freeform note labels
- reminder annotations
- TODO or planning notes on a draft map
- custom commentary markers

This can share the same underlying label system with a different category/type.

---

### 16) Future-ready typography guidance
Do not overbuild now, but do not box the project in.

The internal structure should leave room for:
- curved/path text later
- advanced style presets
- multi-line text handling
- imported fonts later
- fantasy style packs later
- label collision/placement helpers later
- halo/outline effects later if desired

A clean baseline is better than a fake advanced system.

---

### 17) Optional quick style presets
If it fits naturally, add a few simple style presets.

Examples:
- World / Continent
- Ocean
- Region
- City
- Note

This is optional, but even a tiny preset system can make the workflow feel much more intentional.

Do not let preset UI bloat the prompt.

---

### 18) Performance guidance
The label system should respect the large-map goal.

Aim for:
- efficient rendering of placed labels
- no unnecessary React rerenders for every label change
- scene/layer containers organized sensibly
- selection and edit overlays handled in runtime/editor space
- future readiness for many labels

Avoid:
- rebuilding all labels on every unrelated state change
- storing runtime Pixi objects in persisted document data
- forcing full document rewrites for tiny overlay-only selection updates

---

### 19) UX guidance
The label workflow should feel calm, readable, and purposeful.

Aim for:
- quick placement
- easy re-editing
- clear active label layer
- obvious selected-state feedback
- useful baseline style controls
- readable text at normal working zoom
- consistent edit/confirm/cancel behavior

Avoid:
- label placement that immediately feels cumbersome
- text that is impossible to re-edit
- tiny unreadable defaults
- silent wrong-layer failure
- confusing edit mode transitions

This should feel like real map naming and annotation has arrived.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/label-tools/...`
- `src/engine/labels/...`
- `src/lib/text/...`
- `src/components/panels/LabelEditor...`
- `src/store/editorActions/labels...`

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- label/text placement tools exist in the workflow
- the user can place labels on compatible layers
- placed labels render on the canvas
- placed labels can be selected
- selected labels can be moved
- label text can be edited after placement
- practical baseline style controls exist
- inspector/tool settings reflect label context
- layer visibility/locking/opacity rules are respected
- label operations participate sensibly in history
- annotation/freeform text use is supported in a practical way
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- small inline text-entry overlay
- style presets
- text halo/outline placeholder
- duplicate selected label
- multi-line label support
- hover highlight before selection

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- real label/text placement workflow
- selectable/editable/movable label entities
- baseline style controls
- inspector/tool-settings/history integration for labels
- future-ready text/annotation structure
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should feel like the map can finally be named and annotated with intent.

The user should be able to place continent names, ocean labels, city names, landmark labels, and freeform notes as real authored content.

That is the bar.
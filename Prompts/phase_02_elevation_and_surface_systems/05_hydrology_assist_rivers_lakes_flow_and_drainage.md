# 05 — Hydrology Assist: Rivers, Lakes, Flow, and Drainage

## Objective
Implement the first real **elevation-aware hydrology assistance workflow** for World Seed Mapper so the user can use authored terrain data to guide and improve the creation of **rivers**, **lakes**, **flow paths**, and **drainage-aware terrain decisions** without turning Phase 2 into a full fluid simulation project.

This prompt is where terrain starts informing water in a meaningful, practical way.

---

## Why this prompt exists
By this point, the app should have:
- elevation-aware terrain layers
- sculpt brushes
- higher-level landform tools
- terrain preview modes like relief, slope, contour, and height

That means the editor now has enough terrain structure to start helping the user with water placement.

A serious worldbuilding terrain workflow benefits enormously from:
- terrain-informed river guidance
- basin and drainage detection
- lake placement assistance
- downhill flow-path previews
- better relationship between terrain and water features

This prompt should create **assistive hydrology tooling**, not a giant simulation engine.

The goal is:
- useful
- terrain-aware
- editable
- performant
- future-ready

---

## Required outcome
By the end of this prompt, the app should have:

- elevation-aware river assist foundations
- downhill flow-path helpers or previews
- practical basin/lake assistance
- drainage-aware terrain readouts or overlays
- workflows that help the user place or improve rivers/lakes using terrain data
- integration with existing vector river workflows where appropriate
- runtime hydrology analysis kept separate from persisted authored documents unless deliberately stored
- coherent UI/tool/settings support for hydrology assist behavior
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** build a full physical hydrology simulator.
- Do **not** build rainfall/climate/season systems here.
- Do **not** try to solve every real-world water edge case.
- Do **not** overwrite authored river geometry automatically without user intent.
- Do **not** store transient analysis overlays directly in persisted map documents unless they are explicitly promoted to authored content.
- Do **not** turn this into a full procedural river generator.
- Do **not** sacrifice editability for automation.

---

## Main goal
Create terrain-aware hydrology tools that already feel like useful worldbuilding assistance:

- the user can inspect downhill flow
- identify likely basins and drainage structures
- get help laying rivers onto terrain
- create or refine lake locations based on terrain
- use water-aware overlays to make smarter terrain decisions

This should feel like **assistance**, not a black-box generator.

---

## What to build

### 1) Hydrology assist foundation
Add a real hydrology-assist mode or feature group to the editor.

At minimum support practical terrain-aware helpers for:
- flow direction / downhill tracing
- river path assistance
- basin / depression awareness
- lake placement assistance
- drainage visualization or readouts

These may exist as:
- separate hydrology tools
- a hydrology assist panel
- or terrain preview/analysis modes plus river/lake helper actions

Any of those is acceptable if the workflow is coherent.

The user should be able to tell:
“this is the water/flow assistance part of the terrain system.”

---

### 2) Valid terrain target behavior
Hydrology assistance must operate against valid terrain data.

Requirements:
- hydrology assist requires a valid visible terrain source on the active map
- hidden terrain layers are not hydrology analysis sources unless explicitly allowed by your rules
- locked terrain layers may still be analyzed if visible, but not edited
- if no valid terrain source exists, the UI should explain that clearly
- active map scope should determine which terrain is analyzed

Keep this behavior consistent with the terrain target/view rules already established.

---

### 3) Downhill flow-path helper
Implement a practical downhill flow-path helper.

This is one of the most valuable hydrology assist features.

Requirements:
- user can choose a start point on the terrain
- the editor can trace or approximate a downhill flow path from that point based on authored elevation
- result is shown as a preview or analysis overlay
- the path should be useful enough to guide river placement
- the system should stop or resolve sensibly when hitting:
  - local minima
  - basins
  - edges of the map/terrain scope
  - unresolved flat areas

A good baseline:
- stepwise downhill tracing across sampled terrain
- path preview in document space
- visual overlay that can later become river geometry if the user chooses

Do **not** overbuild fluid simulation.  
This is a path-assist system.

---

### 4) River assist workflow
Implement a practical terrain-aware river assistance workflow.

Good possible workflows:
- click a source point → preview downhill river path
- preview can be accepted into a river vector layer
- or used as a guide while manually drawing rivers
- or used to snap/shape authored river geometry

Requirements:
- the workflow must remain editable and user-controlled
- the editor should not silently convert previews into permanent rivers
- accepted river assists should integrate with existing vector river workflows where practical
- terrain should meaningfully influence the suggested path

A strong baseline:
- preview downhill path
- user chooses to:
  - accept as new river path
  - use as a temporary guide
  - discard

This is one of the clearest “terrain starts helping content” moments in Phase 2.

---

### 5) Basin detection / depression awareness
Implement a practical basin or depression-awareness helper.

Requirements:
- the editor can detect or approximate likely local basins / depressions / sinks from terrain data
- results can be visualized or summarized in a useful way
- the user can understand where water would likely collect or stop
- basin awareness should support later lake placement workflows

You do **not** need perfect terrain hydrology science here.  
A useful approximation is enough.

Good baseline:
- identify low areas / local minima regions
- visualize or mark probable collection zones
- expose them through overlay, inspector readout, or analysis mode

This feature will also help the user understand why flow paths terminate where they do.

---

### 6) Lake placement assistance
Implement a practical terrain-aware lake assistance workflow.

Requirements:
- user can select or inspect a basin/depression area
- the editor can help suggest a likely lake area or water fill zone
- the result can be previewed as an overlay
- the user can choose whether to promote the result into authored content (for example mask, overlay, or vector/shape support depending on your architecture)

A good baseline:
- basin area preview from a selected depression / low region
- threshold/fill-level concept if practical
- user-controlled commit or discard

This does not need to become a volumetric water simulation.  
It just needs to be useful for fantasy mapmaking.

---

### 7) Drainage / flow visualization
Add a practical way to visualize hydrology-relevant terrain behavior.

At minimum consider one or more of:
- flow direction arrows or simplified field
- drainage accumulation hints
- basin overlays
- major downhill channels preview
- watershed-ish region hints in a simple form

You do **not** need a full watershed analysis suite if that is too heavy.  
But some visible hydrology intelligence should now exist.

A good baseline:
- a downhill flow preview from selected points
- plus basin visualization
- plus optional simple drainage emphasis overlay

This will help terrain feel more alive and usable.

---

### 8) Integration with vector river layers
This is important.

The terrain-aware hydrology tools should connect meaningfully to the existing vector river system from Phase 1.

Requirements:
- accepted river assists can become river vector features where practical
- or can generate editable river geometry on a compatible vector layer
- the user should still be able to refine the result afterward
- hidden/locked/incompatible target layer cases should be handled clearly
- the assist workflow must not bypass the vector layer architecture

This keeps the app coherent:
terrain informs rivers, but rivers remain real authored map content.

---

### 9) Hydrology overlays as runtime analysis
Hydrology assist outputs should generally be treated as runtime/editor analysis unless the user explicitly promotes them into authored content.

Examples of runtime-only hydrology data:
- downhill preview path
- basin highlight overlay
- flow arrows
- drainage intensity preview
- lake fill preview

Requirements:
- keep these separate from persisted authored documents by default
- make promotion/commit into actual content a deliberate action
- keep the architecture clear and regenerable

This separation matters a lot for keeping Phase 2 sane.

---

### 10) Tool and panel UI
Add practical UI for hydrology assistance.

Good possibilities:
- a hydrology section in terrain tools
- a hydrology assist panel
- tool settings for flow and lake assist
- top bar or inspector actions for “trace flow” / “suggest lake” / “accept river”

Requirements:
- the current hydrology assist mode should be visible
- the user should understand what the tool is analyzing
- the controls should be compact and editor-like
- invalid-target or incompatible target cases should be explained

Do not bury the hydrology workflow in obscure UI.

---

### 11) Hydrology settings
Provide practical settings for the hydrology assist workflow.

At minimum consider support for:
- flow tracing step or sensitivity controls
- stop rules for path tracing
- basin detection sensitivity / threshold
- lake fill threshold or water level assist
- target river layer for accepting a traced path
- overlay visibility toggles

You do **not** need a huge lab of water parameters.  
A few understandable controls are enough.

Keep settings grounded in useful outcomes.

---

### 12) Cursor / preview feedback
Hydrology assist should have visible feedback during use.

At minimum:
- selected source point for flow tracing should be visible
- traced path preview should be visible
- basin/lake preview should be visible when relevant
- invalid areas or blocked states should be understandable

Optional useful additions:
- hover readout of local slope/height
- end condition marker (stopped at basin / edge / local minima)
- preview styling distinction between accepted/authored and temporary/analysis water paths

This is important for usability.

---

### 13) Inspector integration
Upgrade the inspector for hydrology assist context.

At minimum consider:
- active terrain source layer
- active hydrology mode
- traced path summary:
  - approximate length
  - start/end state
  - stopped by basin/edge/etc.
- selected basin summary if relevant
- target layer for accepted river geometry
- lake assist settings if relevant

The inspector should help the user understand what the analysis is telling them.

---

### 14) Status bar integration
The status bar should reflect hydrology context where helpful.

Examples:
- active mode: Flow Trace / River Assist / Basin Detect / Lake Assist
- active terrain layer
- cursor coordinates
- sampled height under cursor
- local slope or flow state, if practical
- accepted target layer for river output, if relevant

Keep it concise but useful.

---

### 15) Commit / cancel rules
Define a coherent lifecycle for hydrology-assist operations.

Good baseline:
- start analysis from a selected point or mode
- preview generated as runtime overlay
- user can:
  - accept/promote
  - discard
  - adjust settings and rerun
- Escape cancels current preview/assist safely
- committed authored content (such as accepted river paths) enters history
- runtime-only overlays do not pollute authored history unnecessarily

This distinction is important.

---

### 16) History integration
Hydrology assistance should integrate with history in a sensible way.

Requirements:
- accepting a river assist into authored river content should create a meaningful history entry
- committing a lake area into authored content should create a meaningful history entry if supported
- runtime-only preview generation should generally **not** spam history
- undo/redo should restore accepted authored content coherently

Be practical and honest in `STATUS.md` about what is preview-only versus committed/authored.

---

### 17) Multi-scale behavior
Hydrology assistance should work coherently across:
- world maps
- region maps
- local maps

Requirements:
- active map scope determines terrain source and analysis bounds
- the system should not assume world-only hydrology
- region/local analysis should remain meaningful and not be blocked by the architecture
- accepted river/lake outputs should go to the active map’s appropriate layers

Do not fully solve cross-map hydrology inheritance here, but do make the analysis workflow scope-aware.

---

### 18) Performance guidance
This prompt must remain scale-aware.

Aim for:
- localized terrain analysis when possible
- chunk-aware flow tracing and basin checks
- runtime overlay generation separate from authored content
- avoiding full-map hydrology recalculation for every small action
- sensible caching or reuse where it helps, without overbuilding

Avoid:
- giant monolithic hydrology passes for every click
- storing runtime overlays in persisted documents
- recomputing unrelated chunks constantly
- analysis that visibly lags on ordinary terrain interaction

Be practical and honest about any current limits.

---

### 19) UX guidance
The hydrology assist workflow should feel helpful, not magical or confusing.

Aim for:
- clear start-point selection
- obvious flow-path preview
- understandable basin/lake suggestions
- explicit accept vs discard behavior
- river-assist results that remain editable
- terrain actually feels like it matters now

Avoid:
- silent river generation
- confusing previews with no explanation
- accepted content being indistinguishable from temporary overlays
- too many cryptic water settings
- pretending perfect hydrology realism exists when it does not

This should feel like the terrain is now teaching the user where water wants to go.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/terrain/hydrology/...`
- `src/engine/terrain/hydrology/...`
- `src/lib/terrain/hydrology/...`
- `src/engine/overlays/...`
- `src/store/editorActions/hydrology...`
- `src/components/panels/...`

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- the editor has practical hydrology assist workflows
- downhill flow-path tracing exists in a useful baseline form
- basin/depression awareness exists
- lake placement assistance exists in a practical previewable form
- river assist can meaningfully connect terrain-informed paths to the vector river workflow
- hydrology overlays are treated as runtime analysis unless explicitly promoted to authored content
- UI/tool/settings/inspector/status support hydrology context coherently
- world/region/local active-map behavior is respected
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- simple drainage accumulation heat hint
- end-condition legend for flow traces
- “accept as river and switch to edit mode” convenience action
- simple watershed-ish overlay hint
- quick “suggest lake from basin” action
- local slope readout near the traced path

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- practical terrain-aware hydrology assist workflows
- downhill flow tracing
- basin/lake assistance
- integration path into authored river content
- runtime hydrology overlay architecture
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should no longer treat rivers and lakes as completely disconnected from terrain.

A user should be able to use elevation data to trace likely water flow, identify basins, preview lake areas, and turn helpful results into real authored river or water content.

That is the bar.
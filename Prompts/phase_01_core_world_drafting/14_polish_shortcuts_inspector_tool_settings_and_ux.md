# 14 — Polish, Shortcuts, Inspector, Tool Settings, and UX

## Objective
Refine World Seed Mapper into a more cohesive, efficient, and trustworthy editor by polishing the core user experience, improving shortcuts and interaction flow, strengthening the inspector and tool-settings systems, and reducing the rough edges that make creative work feel clumsy.

This prompt is where the app starts feeling less like “a promising build” and more like “a tool I can actually work in.”

---

## Why this prompt exists
By this point, the app should already have most of the major Phase 1 systems:

- world canvas and navigation
- layers
- vector tools
- paint/masks
- symbols
- labels
- nested maps
- persistence
- export
- globe preview

Now the biggest gains are in **editor quality**:
- reducing friction
- improving discoverability
- making common actions faster
- making state and context easier to understand
- tightening consistency across panels, tools, and interactions

This prompt should focus on making the existing systems feel more coherent, more deliberate, and more usable.

---

## Required outcome
By the end of this prompt, the app should have:

- stronger keyboard shortcut support for common actions
- more polished inspector behavior
- better-organized tool settings
- clearer active-context feedback
- improved editing and navigation affordances
- more coherent status/readout behavior
- cleaner panel ergonomics
- more consistent interaction rules across tools
- reduced “placeholder feel” in visible editor surfaces
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** derail Phase 1 by starting major new feature systems.
- Do **not** turn this into endless cosmetic tweaking with no usability payoff.
- Do **not** build a giant preference/settings suite unless it directly supports editor UX.
- Do **not** overcomplicate shortcut handling beyond what is useful now.
- Do **not** create inconsistent shortcut behavior that conflicts badly with text editing fields.
- Do **not** re-architect major systems unless it is truly needed to fix UX coherence.

---

## Main goal
Make the app feel significantly better to use.

The user should feel:
- “the editor is easier to read”
- “the right thing happens more often”
- “the inspector actually helps me”
- “common actions are faster”
- “tools feel more consistent”
- “the whole app feels more intentional”

This prompt is about editor maturity, not flashy additions.

---

## What to build

### 1) Keyboard shortcut pass
Implement or refine practical keyboard shortcuts for core editor actions.

At minimum consider support for:
- tool switching shortcuts
- select tool
- pan tool
- vector/path tool
- paint tool
- erase tool
- symbol tool
- label tool
- undo / redo
- delete selected item
- escape / cancel current operation
- zoom to fit
- reset view
- save
- open project if practical
- globe preview toggle if practical

Requirements:
- shortcuts should be coherent and discoverable
- conflicts with text editing must be handled sensibly
- shortcuts should not fire unexpectedly while typing into text inputs
- visible shortcut hints are encouraged where useful

You do not need to match another app exactly, but the scheme should feel editor-like and consistent.

---

### 2) Shortcut discoverability
Surface shortcuts in the UI where practical.

Good places:
- tooltips on tool buttons
- status bar hints
- command labels in top bar menus/actions
- inspector hints for current tool
- small help overlay or shortcut reference entry if it fits naturally

This can be light, but shortcuts should not feel hidden.

Do not build an overblown onboarding system unless it genuinely helps.

---

### 3) Inspector polish
Refine the inspector so it behaves more like a real context-sensitive editor inspector.

Requirements:
- inspector content should respond clearly to current selection/tool/layer/map context
- empty states should feel intentional, not dead
- grouped information should be readable and ordered sensibly
- property editing controls should feel consistent
- lock/visibility/editability state should be obvious
- important metadata should be present without flooding the panel with noise

A good hierarchy might be:
- selection summary
- editable primary properties
- transform/properties
- parent/layer/map relationship info
- secondary metadata/debug info

The inspector should help the user work, not just prove data exists.

---

### 4) Tool settings polish
Refine the tool settings area so it becomes a dependable home for current-tool options.

Requirements:
- active tool settings should be clearly labeled
- settings should be grouped meaningfully
- shared controls (size, opacity, category, layer target, etc.) should feel consistent
- irrelevant settings should not remain cluttering the view
- defaults and active values should be understandable
- switching tools should update the panel cleanly

This panel should stop feeling like a placeholder dump and start feeling like a real editor control surface.

---

### 5) Consistent active-context cues
Improve the editor’s visual communication about what is currently active.

At minimum make it clear:
- active tool
- active map and scope
- active layer
- selected entity, if any
- whether the current target is editable
- when the current context is blocked due to hidden/locked state
- whether the project is dirty/unsaved

Good places to reinforce context:
- top bar
- tool rail
- layer panel
- inspector
- status bar
- canvas overlays where useful

This is one of the biggest overall UX wins.

---

### 6) Panel ergonomics
Improve panel usability and space usage.

Good areas to refine:
- sidebar section spacing
- panel header consistency
- collapsible section behavior
- scroll behavior
- row density
- control alignment
- action button placement

Requirements:
- panels should feel compact but readable
- common actions should be easy to reach
- the right sidebar should not feel like a stack of unrelated boxes
- the layout should still prioritize the canvas

Avoid:
- giant empty cards
- crowded micro-controls
- inconsistent spacing between sections
- repeated styling patterns that fight each other

---

### 7) Layer panel polish
Refine the layers panel with a more professional editing feel.

At minimum consider:
- better row affordances
- clearer icons/badges
- easier identification of active layer vs selected entity layer
- better group expand/collapse readability if groups exist
- quick actions that are useful without clutter
- more intentional empty states
- clearer content-type hints

This should feel closer to a real creative-tool layers panel now.

---

### 8) Canvas interaction polish
Refine the feel of common on-canvas interactions.

Good candidates:
- smoother cursor feedback
- more obvious hover states where applicable
- clearer selection handles
- more readable overlay styling
- improved transform drag feel
- clearer extent-selection visuals for nested maps
- more consistent cancel/confirm behaviors

You do not need to rewrite tool systems, but you should sand down the roughest interaction edges.

---

### 9) Better state messaging
Improve how the app communicates what is going on.

At minimum consider messaging for:
- wrong-layer targeting
- locked layer edits blocked
- hidden layer issues
- no compatible layer selected
- unsaved changes
- preview needs refresh if applicable
- export/save success or failure feedback
- invalid selection state recovery

These can appear through:
- status bar text
- small inline notices
- modest toasts/messages
- inspector hints

The goal is to reduce silent confusion.

---

### 10) Status bar refinement
Upgrade the status bar into a more useful, less noisy editing aid.

At minimum refine/display useful combinations of:
- current tool
- current map scope
- current map name
- active layer
- selection summary
- pointer coordinates
- zoom
- dirty/save state
- lightweight shortcut hints
- preview mode/context hints when relevant

Do not overload it with every possible signal.  
It should feel alive, not chaotic.

---

### 11) Top bar polish
Refine the top bar so it feels more like a professional editor frame.

Good improvements may include:
- clearer project/map naming
- breadcrumb readability
- unsaved indicator clarity
- grouping of file/view/preview/export actions
- clearer globe preview toggle
- cleaner map-scope badge treatment
- quick access to current important actions

Avoid:
- turning it into a website navbar
- giant branding presence
- too many equal-weight buttons fighting for attention

This is editor chrome, not marketing chrome.

---

### 12) Empty states and first-impression polish
Improve empty/initial states that the user is likely to see.

Examples:
- no selection in inspector
- no compatible layer selected for current tool
- no child maps yet
- no symbols selected
- no labels selected
- fresh untitled project
- globe preview unavailable or world-only rule explanation

These states should feel informative and calm, not lazy.

A little copywriting polish goes a long way here.

---

### 13) Property editing consistency
Make property editing controls feel more unified across systems.

Examples:
- similar input patterns for name/opacity/rotation/scale
- consistent number input styling
- common toggle presentation
- consistent disabled/locked presentation
- similar confirm/apply rules where relevant

The more the app feels internally consistent, the more trustworthy it becomes.

---

### 14) Map navigator / nested-map UX polish
Refine the nested-map workflow surfaces.

Good candidates:
- clearer breadcrumb path
- better parent/child badges
- easier “return to parent”
- clearer current active map highlight
- more understandable extent overlay labels
- better naming/defaults for new child maps
- stronger map hierarchy readability if a navigator exists

This is one of the signature features, so polish matters here.

---

### 15) Tool/category preset refinement
Improve how tool-specific categories/defaults are chosen.

Examples:
- better biome category selection flow
- cleaner symbol category picker behavior
- clearer label category defaults
- vector feature type defaults that remain obvious
- persistence of last-used tool settings where sensible

The user should not have to constantly re-learn what the tool is set to do.

---

### 16) Light accessibility and readability pass
Without turning this into a full accessibility audit, improve practical readability/usability.

Consider:
- contrast of key text
- legibility of active/disabled states
- click-target size for important controls
- readability of selected-state styling
- panel scroll usability
- text size in dense surfaces
- keyboard-focus visibility where practical

This improves quality for everyone.

---

### 17) Error and feedback polish
Refine feedback around actions that can fail or be ignored.

Examples:
- failed save/open/export
- invalid project format
- unsupported SVG content warning
- attempt to edit locked content
- attempt to paint on wrong layer type
- failed globe preview generation
- canceled actions

The app should feel honest and calm, not silent or brittle.

---

### 18) Optional command palette / quick actions foundation
If it fits naturally, add a light command/quick-actions foundation.

Good examples:
- quick action palette trigger
- searchable common commands
- project/file/view/tool command entries

This is optional.  
Only do it if it stays light and truly improves usability.

Do not let it derail the polish pass.

---

### 19) Optional lightweight help surface
If it fits naturally, add a small help affordance.

Good examples:
- shortcut reference modal
- “?” help button
- first-use editor tips panel
- contextual hint area

This is optional, but can make the app feel far more approachable.

Keep it restrained.

---

### 20) UX consistency audit and cleanup
Do a deliberate pass across the visible editor to tighten inconsistencies.

Examples:
- inconsistent wording
- mismatched button labels
- duplicate action patterns
- uneven panel headers
- confusing terminology
- inconsistent scope naming
- too many “placeholder” labels still visible
- rough dev/debug language leaking into user-facing surfaces

This is important.  
A lot of polish comes from removing friction and inconsistency, not adding more UI.

---

### 21) Performance-sensitive polish guidance
Polish should not make the app feel heavier or slower.

Aim for:
- targeted UI improvements
- avoiding unnecessary rerender storms
- keeping overlays efficient
- keeping sidebar logic clean
- leaving heavy runtime systems alone unless polish requires a real fix

Avoid:
- cosmetic animations that hurt responsiveness
- huge UI rewrites that destabilize working systems
- adding state churn just for visual flair

This is a working editor, not a motion-design demo.

---

### 22) Honesty about remaining rough edges
Be direct in `STATUS.md` about what this polish pass improved and what still remains rough.

Good examples:
- keyboard shortcuts mostly complete, but no rebinding yet
- inspector much cleaner, but advanced property groups deferred
- panel UX improved, but command palette postponed
- globe preview messaging improved, but live refresh remains manual

A truthful polish log builds trust and makes Phase 2 planning easier.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/shortcuts/...`
- `src/components/panels/...`
- `src/components/layout/...`
- `src/features/workspace/...`
- `src/store/editorActions/ui...`
- `src/lib/ui/...`

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- practical keyboard shortcuts exist for major common actions
- shortcuts are surfaced or hinted in at least some useful places
- inspector behavior is more coherent and helpful
- tool settings are cleaner and more context-aware
- active tool/layer/map/selection context is easier to read
- panel ergonomics are noticeably improved
- state messaging reduces silent confusion
- status bar/top bar are more useful and polished
- nested-map and general editor UX feel more intentional
- visible placeholder/developer-ish roughness is reduced
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- quick shortcut reference modal
- lightweight command palette
- recent tools indicator
- better toast/message system
- per-tool cursor hints
- stronger breadcrumb interaction affordances

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- better shortcut support
- improved inspector/tool-settings UX
- stronger panel and editor ergonomics
- clearer active-context communication
- reduced friction and placeholder feel
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should feel noticeably better to work in.

Not because it has huge new features, but because the existing features feel more coherent, more readable, and more trustworthy in day-to-day mapmaking.

That is the bar.
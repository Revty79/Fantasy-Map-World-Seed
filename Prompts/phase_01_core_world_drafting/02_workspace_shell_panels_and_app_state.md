# 02 — Workspace Shell, Panels, and App State

## Objective
Turn the foundation shell into a real editor workspace by building the main panel system, wiring it to practical app state, and making the interface feel like an actual mapping tool rather than static scaffolding.

This prompt is where the app stops being “a shell with placeholders” and starts becoming a usable editor frame.

---

## Why this prompt exists
The previous prompt established the app shell.  
The document model prompt established the language of the project.

Now the workspace needs to become the real operating surface for the product:
- panel-driven
- state-aware
- ready for tools
- ready for layers
- ready for inspector workflows
- ready for world / region / local map context

This prompt should create the editor skeleton that later drawing and rendering prompts can plug into cleanly.

---

## Required outcome
By the end of this prompt, the app should have:

- a clear editor workspace screen
- meaningful top bar controls/state display
- a functional left tool rail with selectable tools
- a structured right-side panel stack
- a usable layers panel placeholder wired to state
- an inspector/tool settings panel area wired to selection/tool context
- a bottom status bar reflecting real state
- app state organized enough to support future editor workflows
- support for current map scope awareness (`world`, `region`, `local`)
- basic project/session presence in the UI
- panel/layout components organized cleanly
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** implement the real Pixi renderer yet.
- Do **not** implement actual drawing/editing behaviors yet.
- Do **not** implement persistence/save/load yet beyond placeholder actions/state.
- Do **not** turn this into a generic admin dashboard.
- Do **not** make every panel fully featured now.
- Do **not** bury core state in scattered local component state if a shared store is cleaner.

---

## Main goal
Create a workspace structure where later prompts can drop in:
- the world canvas
- layer management
- vector editing
- paint tools
- symbol placement
- labels
- nested map navigation
- globe preview

without needing to rip apart the UI frame.

---

## What to build

### 1) Workspace screen structure
Build a clean editor workspace composition with recognizable regions:

- **Top bar**
- **Left tool rail**
- **Main center workspace**
- **Right sidebar panel area**
- **Bottom status bar**

Refactor the initial shell if needed so these are proper reusable workspace/layout components.

This should feel intentional and structured, not like one giant component.

---

### 2) Top bar improvements
Upgrade the top bar so it reflects real editor context.

Include things like:
- current project name
- current active map name
- current scope badge (`World`, `Region`, `Local`)
- placeholder project actions:
  - New Project
  - Open Project
  - Save
- placeholder view actions:
  - zoom to fit
  - reset view
  - toggle grid/guides later placeholder
- optional breadcrumb or path concept for map nesting

These actions do not all need real functionality yet, but they should be wired to state and structured for later hookup.

Avoid clutter. Make it feel like an editor toolbar, not a website navbar.

---

### 3) Left tool rail
Create a real tool rail backed by app state.

At minimum define and display selectable tools for future use, such as:
- select
- pan
- coastline/path draw
- paint
- erase
- symbol/place feature
- label/text
- measure or inspect placeholder if useful

Requirements:
- one active tool at a time
- visible active state
- tool buttons wired to shared editor/app state
- future-friendly structure for icons, labels, tooltips, and shortcuts

Text labels are acceptable if icons are not ready, but the rail should be built like a real tool selector.

---

### 4) Center workspace panel
Refine the center workspace into an editor-ready stage.

Since the renderer is not implemented yet, this area should still be a placeholder — but a good one.

It should show meaningful live state such as:
- current project
- current map
- current scope
- active tool
- active layer if any
- document dimensions or basis if available from the model
- a clear statement that the render surface attaches here next

It should visually read as the canvas stage.

Optional:
- subtle inner frame for the future canvas
- placeholder mini overlay cards for map info
- “world canvas attaches here” style messaging, but not in a lazy TODO way

---

### 5) Right sidebar panel system
Build the right sidebar as a proper panel stack.

At minimum, include structured panels for:
- **Layers**
- **Inspector**
- **Tool Settings**

Optional later-ready stubs:
- assets
- map info
- navigator
- history

The key here is structure and state wiring, not feature depth.

Each panel should:
- have a title/header
- render meaningful placeholder or state-aware content
- be reusable and cleanly separated into components
- be able to react to store/editor state

A simple collapsible pattern is welcome if it fits naturally.

---

### 6) Layers panel foundation
Even though the full layer system is the next prompt, create a practical state-aware layer panel foundation now.

Use the document model where possible.

At minimum:
- show current map layer list if available
- show empty/default state gracefully
- show layer rows in a clean format
- allow selecting a layer in shared state
- reflect visibility/lock placeholders if the layer model already supports them
- provide placeholder buttons for:
  - add layer
  - group layer
  - delete layer
  - reorder later

Do not fully implement layer authoring yet unless it fits naturally.  
But do make this panel feel like the real future home of layer operations.

---

### 7) Inspector panel foundation
Create a state-aware inspector panel.

It should react to context such as:
- no selection
- selected layer
- selected tool
- active map/project info when nothing is selected

Examples of useful behavior:
- when no layer/entity is selected, show active map info
- when a layer is selected, show basic layer info from state/document data
- when a tool is selected, show placeholder tool settings summary

This should begin establishing the “context-sensitive inspector” pattern.

---

### 8) Tool settings panel foundation
Create a dedicated panel or section for the active tool’s settings.

For now, it can show placeholder settings based on active tool type, such as:
- brush size / opacity placeholder for paint
- stroke width / smoothing placeholder for path tools
- text style placeholder for label tool
- placement scale/rotation placeholder for symbol tool

These do not need full controls yet, but they should demonstrate the intended structure and state flow.

A few lightweight editable controls are acceptable if helpful.

---

### 9) Bottom status bar
Make the bottom status bar actually reflect editor state.

At minimum, include:
- active tool
- active map scope
- selected layer name or none
- zoom placeholder/readout
- coordinate placeholder/readout
- project/session status placeholder (e.g. unsaved/ready placeholder state)

Optional:
- shortcut hints
- performance placeholder text
- current projection/basis indicator

The goal is to make the app feel alive and stateful.

---

### 10) App state organization
This is a major part of the prompt.

Refine the state structure so it can cleanly support:
- current project
- open map id
- active scope
- selected tool
- selected layer id
- selected entity id placeholder
- panel visibility/collapse state
- status bar info
- view options placeholders
- dirty/unsaved placeholder state

Use a pragmatic shared store approach.

Good options:
- a lightweight store
- a reducer/context combo if still clean
- a small editor store module

Choose the simplest approach that remains scalable.

Do not scatter essential editor state across unrelated components.

---

### 11) Editor actions / commands foundation
Add a thin action layer or command helpers for common editor interactions, such as:
- set active tool
- set selected layer
- set open map
- toggle panel state
- mark document dirty
- set scope
- reset workspace view placeholder

This does not need to become a formal command system yet, but there should be a cleaner pattern than raw ad hoc state mutation everywhere.

---

### 12) Workspace defaults / bootstrapping
When the app starts, it should land in a plausible default editor state.

For example:
- a default in-memory project exists
- a default world map is open
- a few starter layers may exist if appropriate
- the world scope is active
- a sensible default tool is selected (`select` or `pan`)

This is especially helpful for keeping the app visually meaningful before persistence exists.

If you use mock/default data, keep it consistent with the document model and clearly temporary but real.

---

### 13) Component organization
Refactor toward clean workspace-oriented components.

Something along these lines is good:

- `src/features/workspace/...`
- `src/components/layout/...`
- `src/components/panels/...`
- `src/store/editorStore.ts`
- `src/features/tools/...`

Not mandatory exactly, but keep the code easy to extend.

Avoid one giant `App.tsx` monster.

---

### 14) UX guidance
The workspace should begin feeling like a serious creative tool.

Aim for:
- balanced layout proportions
- tool rail that is easy to scan
- side panels that feel dense but readable
- center stage clearly dominant
- obvious feedback for active selections and context
- crisp hierarchy of information

Avoid:
- oversized empty cards
- giant dead placeholder blocks
- cluttered top bar
- all panels looking identical with no hierarchy
- “admin dashboard” vibes

---

### 15) Light interactivity is encouraged
Even though the real editing tools are later, this prompt should include enough interactivity to make the app feel responsive.

Good examples:
- selecting tools changes active state
- selecting a layer updates inspector
- changing active scope updates badges/readouts
- panel collapse toggle changes layout or panel display
- mock toolbar actions produce harmless state changes or notices

Avoid fake buttons that do nothing visually.

---

## Suggested implementation mindset
Think of this prompt as building the **operating frame** of the editor.

Later prompts should be able to say:
- here is the Pixi canvas
- here is the layer engine
- here are vector tools
- here are paint tools

and plug them into an already coherent interface.

---

## Acceptance criteria
This prompt is complete when:

- the workspace is composed from clean reusable regions/components
- tool selection is stateful and visible
- the right sidebar contains meaningful panel foundations
- the layers panel is wired to current map/layer state
- the inspector reacts to context
- the tool settings area reflects active tool context
- the status bar reflects real shared state
- app/editor state is organized more cleanly than before
- the app feels like a real editor workspace, not just static scaffolding
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- collapsible/right-sidebar sections
- map breadcrumb UI for future nesting
- keyboard shortcut badges on tools
- simple command palette placeholder trigger
- subtle unsaved-state indicator in the title bar/top bar

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- improved workspace layout components
- stateful tool rail
- state-aware top bar
- right sidebar panel foundations
- working layers/inspector/tool settings placeholders
- cleaner app/editor state organization
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should feel like a real editor that is waiting for its drawing engine — not like a generic template.

A person opening it should be able to tell where tools live, where layers live, where inspection happens, and where the map work will happen.

That is the bar.
# 00 — Foundation: Tauri + Vite Shell

## Objective
Create the runnable foundation for **World Seed Mapper** as a **desktop-first Tauri application** using **React + TypeScript + Vite**, with a clean app shell and file structure that future prompts can safely build on.

This prompt is about establishing the base product shape correctly — not about building drawing tools yet.

---

## Why this prompt exists
Before we build map editing, layers, vector tools, paint tools, persistence, or globe preview, we need a stable foundation that:

- launches cleanly
- has a maintainable folder structure
- separates app UI from engine concerns
- supports future renderer integration
- supports future file/project actions
- is pleasant enough to continue building in without immediate rewrites

This is the base slab. Pour it correctly.

---

## Required outcome
By the end of this prompt, the repo should contain a runnable desktop app with:

- Tauri configured and launching
- Vite + React + TypeScript app working cleanly
- a basic application shell/layout
- placeholder panels for the future workspace
- a small but real global app state foundation
- top-level menu/toolbar area
- left tool rail placeholder
- center workspace placeholder
- right inspector/sidebar placeholder
- bottom status bar placeholder
- theme variables / base styling foundation
- a clean file/folder structure aligned to this product
- basic scripts/instructions updated if needed
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** implement the actual map renderer yet.
- Do **not** implement Pixi drawing tools yet.
- Do **not** implement real project persistence yet.
- Do **not** over-engineer menu systems.
- Do **not** add fake complexity just to look advanced.
- Do **not** introduce a backend/database.
- Do **not** bloat the first screen with marketing UI.
- Build the actual product shell, not a landing page.

---

## Architecture expectations
Use the locked project direction unless the repo setup forces a clearly better equivalent:

- **Desktop shell:** Tauri
- **Frontend:** React + TypeScript + Vite
- **State foundation:** lightweight and pragmatic
- **Styling:** clean, maintainable, app-style UI
- **Renderer integration path:** leave clear space for future PixiJS and Three.js features
- **Persistence path:** leave clear space for Tauri-side file/project operations later

If you need a state library, choose a minimal and reasonable one. If local React state is enough at this phase, that is acceptable. Avoid premature complexity.

---

## Folder structure target
Prefer a structure close to this, adapting only where necessary:

- `src/app`
- `src/components`
- `src/features`
- `src/engine`
- `src/store`
- `src/types`
- `src/lib`
- `src/styles`
- `src-tauri`

At minimum, establish enough structure that later prompts will not need to immediately reorganize the repo.

---

## What to build

### 1) App shell
Create a desktop-app-style shell with these visual regions:

- **Top bar**
  - app title / project name area
  - placeholder controls for future file/project actions
  - placeholder map scope indicator (world / region / local)
  - placeholder view controls area

- **Left rail**
  - vertical tools strip placeholder
  - future slots for select / draw / paint / label / symbol tools
  - icons or text placeholders are fine for now

- **Center workspace**
  - the main working area
  - for now, show a proper canvas placeholder panel
  - make it clear this is where the world canvas will live
  - should resize well with the window

- **Right sidebar**
  - inspector/panel stack placeholder
  - include labeled placeholder sections such as:
    - Layers
    - Selection / Inspector
    - Tool Settings

- **Bottom status bar**
  - placeholder zoom readout
  - placeholder coordinates area
  - placeholder active tool area
  - placeholder project status area

This should feel like the beginning of a real editor application.

---

### 2) App routing / workspace shape
Even if there is only one screen now, structure the app so it is obvious how later screens/views would fit.

Examples of good separation:
- app bootstrap
- layout shell
- workspace screen
- reusable panel components

Do not build an unnecessary router maze, but do keep the app organized.

---

### 3) Basic app state foundation
Add a simple global state or store shape for future use.

It should at least leave room for:
- current project metadata
- active map scope
- selected tool
- selected layer id
- sidebar/panel state
- status bar info

It does **not** need full functionality yet, but it should be real enough to wire placeholders to.

---

### 4) Type foundations
Create initial types/interfaces/enums for foundation-level UI state, such as:
- map scope kind (`world`, `region`, `local`)
- editor tool ids/placeholders
- panel ids
- app project/session status basics

Keep these tidy and future-friendly.

---

### 5) Styling foundation
Set up a clean editor-style visual foundation.

Requirements:
- dark-theme-first is acceptable
- should feel like a serious creation tool, not a marketing page
- use CSS variables, theme tokens, or a similarly maintainable base
- good spacing and panel contrast
- visually readable at a glance
- avoid over-designed fantasy theming at this phase

The UI should look solid, neutral, and extendable.

---

### 6) Tauri readiness
Ensure the project actually runs as a Tauri desktop app.

If setup files or scripts are missing, add/fix them.

Make sure the repo is in a state where a developer can reasonably:
- install dependencies
- run the frontend
- run the Tauri desktop shell

Document anything unusual only if necessary.

---

### 7) Workspace placeholder quality
The placeholder center panel should not just say “TODO.”

Make it useful and intentional. For example, it can show:
- current scope: World
- renderer status: not attached yet
- expected canvas behavior coming next
- a brief description of the future world canvas role

This is still scaffolding, but it should be product scaffolding, not dead scaffolding.

---

## UX guidance
Aim for a layout that makes sense for a large creative tool.

Good qualities:
- balanced panel widths
- obvious center workspace priority
- no cramped layout
- status/info areas feel intentional
- window resizing behaves sensibly

Avoid:
- giant empty margins
- oversized branding
- toy-like styling
- awkward mobile-first patterns

This is a desktop editor.

---

## Suggested implementation mindset
Think like you are laying the first stones for something closer to:
- a map editor
- a content creation suite
- a design tool

Not:
- a dashboard SaaS homepage
- a brochure site
- a temporary demo throwaway

---

## Acceptance criteria
This prompt is complete when all of the following are true:

- the app launches successfully
- Tauri is wired correctly
- the layout shell renders cleanly
- the app has clear top/left/center/right/bottom workspace regions
- the codebase structure is improved and ready for future prompts
- there is a basic state/type foundation
- the UI looks like the start of a real editor
- no major obvious TypeScript/build issues remain
- `STATUS.md` is updated

---

## Nice-to-have additions
Include these only if they fit naturally and do not derail the prompt:

- keyboard shortcut hint text in the status bar
- collapsible panel placeholders
- a small welcome workspace card in the center panel
- a “New Project / Open Project” placeholder action area
- subtle app branding: “World Seed Mapper”

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- working Tauri + Vite + React + TypeScript foundation
- organized source tree
- initial shared types/state
- editor-style shell UI
- updated `STATUS.md`

---

## Definition of done note
This prompt should create a real, sturdy starting point.

A person opening the app after this prompt should immediately understand:
“this is going to become a serious world map editor.”

That is the bar.
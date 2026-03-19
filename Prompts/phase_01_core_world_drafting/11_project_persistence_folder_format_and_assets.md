# 11 — Project Persistence, Folder Format, and Assets

## Objective
Implement the first real **project persistence system** for World Seed Mapper so the user can create, save, load, and reopen projects from a folder-based on-disk format that preserves maps, layers, authored content, and asset references in a way that is stable, inspectable, and future-ready.

This prompt is where the editor stops being an in-memory prototype and starts becoming a real tool.

---

## Why this prompt exists
By this point, the app should already support real authored map content:
- maps
- layers
- vector features
- paint/mask content
- symbols
- labels
- nested world/region/local maps

None of that matters long-term if the user cannot:
- save the project
- close the app
- reopen the project later
- trust that the content structure is preserved

This prompt should create a clean **project folder format** and practical save/load flow that can grow with the app.

Do this carefully. Bad persistence decisions create years of pain.

---

## Required outcome
By the end of this prompt, the app should have:

- a real project folder format
- create/save/save-as/open project workflows
- a project manifest file and supporting document files
- serialized persistence for current authored map data
- persisted map relationships and layer content
- persisted asset references and basic asset folder structure
- dirty/unsaved state tracking integrated into the UI
- safe load/reload behavior for project documents
- a clean separation between persisted document data and runtime/editor state
- basic version/schema awareness in saved files
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** switch to a database-first persistence model.
- Do **not** hide everything in a single opaque binary blob unless there is a very strong reason.
- Do **not** bake runtime Pixi/selection/editor state into saved project data.
- Do **not** block the workflow on a perfect migration system.
- Do **not** build a giant enterprise asset manager yet.
- Do **not** make save/load depend on future export code.
- Do **not** create a persistence layout that is impossible for a developer to inspect and reason about.

---

## Main goal
Create a persistence system that already feels like a real desktop creative tool:

- user can make a project
- author content
- save it to disk
- reopen it later
- continue where they left off
- trust that maps, layers, and content relationships are preserved

This should feel reliable and grounded.

---

## What to build

### 1) Folder-based project format
Implement a clear on-disk **project folder structure**.

A good baseline structure might be something like:

- project root folder
  - project manifest
  - maps folder
  - assets folder
  - optional thumbnails/previews later
  - optional metadata/settings files as needed

For example, a practical shape could resemble:

- `project.json` or `world-seed-project.json`
- `maps/`
- `assets/`
- optional `maps/<map-id>.json`
- optional `assets/symbols/...`
- optional `assets/imports/...`

You do not have to use these exact names, but the structure must be:
- understandable
- durable
- future-friendly
- appropriate for a desktop creative tool

Do not hide everything in one giant unreadable save file if cleaner separation is possible.

---

### 2) Project manifest design
Create and use a real persisted project manifest.

The manifest should reasonably contain:
- project id
- project name
- schema version
- creation/update timestamps
- root world map id
- map registry/order summary
- asset registry summary or references
- project-level settings/metadata as appropriate

The manifest should help the app locate and validate the rest of the project structure.

Do not overload it with every byte of map content if cleaner per-map files are better.

---

### 3) Per-map persistence
Persist map documents in a clean and practical way.

Requirements:
- each map’s saved data should preserve:
  - map id
  - scope
  - metadata
  - parent/child relationships or references
  - extents
  - layer stack
  - authored content on those layers
- world, region, and local maps all save coherently
- active-map switching after load works correctly

A strong recommendation is:
- keep map data as separate files rather than baking all maps into one giant document, unless your actual structure has a clearly better reason

That keeps the project scalable and inspectable.

---

### 4) Layer content persistence
Persist the currently supported authored content types in a clean way.

At minimum, saving/loading should cover the content already implemented by earlier prompts, such as:
- vector geometry features
- paint/mask/data content
- symbol instances
- labels/text annotations
- layer ordering/visibility/locking/opacity
- group/container structure where applicable

The saved structure must preserve enough fidelity that reopening the project reconstructs the authored document meaningfully.

Be careful not to mix runtime overlay state into saved layer content.

---

### 5) Paint/mask chunk persistence
This is a major part of the prompt.

The paint/mask system was designed to be large-map aware.  
Persistence should respect that.

Requirements:
- save/load touched paint chunks or equivalent partitioned paint data
- do not flatten everything into one giant texture if that breaks the architecture
- maintain a practical mapping between layer content and chunk files/data
- reopening the project reconstructs visible painted content correctly

You do **not** need a perfect highly optimized asset-pack pipeline yet.  
But the saved structure should clearly support:
- partitioned paint data
- selective loading in the future
- large map compatibility

Be honest in `STATUS.md` if the first implementation is structurally sound but not yet highly optimized.

---

### 6) Asset folder and asset references
Implement the first real asset persistence foundation.

The project should have a basic asset structure that can handle:
- built-in symbol references
- imported assets later
- project-local asset references
- logical paths/ids for asset usage

At minimum:
- define how asset references are stored in saved documents
- create a project asset folder structure
- keep saved references stable enough that reopening the project preserves symbol usage and future imported assets can fit in cleanly

Do not build a full import UI if that belongs later, but do give assets a real home in the project format.

---

### 7) Save workflow
Implement a practical **Save Project** workflow.

At minimum:
- save the current project to disk
- if the project has no current folder/path yet, route through a save-as flow
- update dirty/unsaved state appropriately on successful save
- reflect saved state in top bar/status bar

This should feel like a real desktop-app action, not a fake button.

Since this is a Tauri desktop app, use desktop-appropriate filesystem access patterns.

---

### 8) Save As workflow
Implement **Save As** behavior.

Requirements:
- user can choose a project folder location
- current project is written to that folder in the defined format
- active project path is updated afterward
- subsequent standard save uses the chosen project location
- the app stays coherent after save-as

This is important because creative tools often begin from in-memory/default projects.

---

### 9) Open Project workflow
Implement **Open Project** behavior.

Requirements:
- user can pick an existing project folder or manifest file, depending on your chosen UX
- the app validates and loads the project
- maps/layers/content reconstruct into the editor correctly
- current active project state updates coherently
- current active map becomes sensible after load
- errors are handled reasonably if the project is invalid or incomplete

This is the moment where the app becomes a real reusable tool.

---

### 10) New Project workflow
Implement a practical **New Project** behavior.

At minimum:
- user can create a new in-memory project with sensible defaults
- optionally ask for basic metadata such as project name if that fits naturally
- editor resets into the new project cleanly
- unsaved/dirty state is handled coherently

You do not need an elaborate modal wizard unless it genuinely helps.

A small practical new-project flow is enough.

---

### 11) Dirty/unsaved state tracking
This is a major quality-of-life piece.

Implement project dirty-state tracking that reflects whether the current project has unsaved changes.

Requirements:
- major document changes mark the project dirty
- successful save clears dirty state
- top bar and/or title area reflect unsaved status
- status bar may reflect project save state
- switching projects/new/open behaviors handle unsaved work coherently

A simple but trustworthy dirty-state model is far better than none.

---

### 12) Unsaved changes safeguards
Add practical safeguards around unsaved work.

At minimum consider:
- warning before discarding unsaved changes on open/new
- warning before replacing the current project with another if dirty
- clean rule for canceling those actions

This does not need a huge modal framework, but the editor should not casually destroy user work.

Be practical and consistent.

---

### 13) Runtime reconstruction from persisted documents
When a project is loaded, the editor must reconstruct working runtime state from saved documents.

Requirements:
- document data loads into live editor/project state
- canvas switches to the appropriate active/open map
- layers and authored content appear correctly
- selection/runtime overlays do not persist unless explicitly intended
- view state initializes sensibly after load

This is an important proof that the persisted structures and live editor structures are well separated.

---

### 14) Schema/version handling
Use project/document schema versioning in the persistence layer.

At minimum:
- saved files include schema version info
- loader checks version presence
- unsupported/unknown version cases fail clearly or warn clearly
- structure leaves room for future migration steps later

You do not need to build migrations now.  
But the save format should acknowledge that the app will evolve.

---

### 15) Validation and error handling
Add practical validation/error handling around persistence.

Good examples:
- missing manifest
- malformed map document
- missing referenced map file
- invalid schema version
- missing asset reference
- unreadable/corrupt paint chunk data

You do not need bulletproof production hardening yet, but the loader should not fail as mysterious silence.

Be honest in `STATUS.md` about what is handled versus deferred.

---

### 16) Top bar and status integration
Upgrade the app UI to reflect real persistence state.

At minimum:
- New Project
- Open Project
- Save
- Save As
should now be real or meaningfully connected

Also surface:
- current project name/path or folder name
- unsaved indicator
- save success/failure feedback where appropriate
- maybe current manifest path or project root hint if useful

This is important for making the editor feel like a real desktop application.

---

### 17) Project boot and default state behavior
Decide how the app behaves on startup.

A good baseline:
- open a default in-memory untitled project if no project is loaded
- allow Save / Save As to persist it
- optionally remember/reopen last project later only if it fits naturally

Do not overcomplicate startup state, but do make it coherent.

---

### 18) Persistence architecture guidance
Organize persistence cleanly.

Good separation might include modules such as:
- project serializer/deserializer
- manifest loader/saver
- map document loader/saver
- asset path helpers
- filesystem adapters
- validation helpers

Do not bury filesystem code inside random UI components.

Keep the persistence layer easy to reason about.

---

### 19) Asset import readiness
You do not need a full asset import prompt yet, but persistence should leave room for it.

The structure should clearly support future:
- imported symbol images
- custom brushes
- reference images
- local textures
- style packs

A clean first asset path/reference approach is enough.

Avoid one-off decisions that make future imports painful.

---

### 20) Performance guidance
Persistence should respect project scale.

Aim for:
- per-map file separation or equivalent scalable structure
- partitioned paint save/load strategy
- avoiding giant monolithic writes when cleaner segmented writes are possible
- runtime reconstruction that does not keep every file permanently hot if unnecessary
- clean room for lazy load later

Avoid:
- serializing giant runtime-only objects
- huge save blobs created from mixed UI+document state
- writing every tiny transient field to disk
- excessive save churn for non-document changes

The project should be able to grow.

---

### 21) UX guidance
The save/load experience should feel grounded and trustworthy.

Aim for:
- obvious project identity
- coherent save actions
- understandable dirty-state signals
- safe warnings before destructive replacement
- successful reopen of actual authored work
- no mystery about where the project lives

Avoid:
- fake save buttons
- silent data loss
- project structure that feels invisible and magical
- confusing open/save-as behaviors
- brittle load flows with no useful feedback

This is the point where the user begins trusting the software with real work.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/projects/...`
- `src/lib/persistence/...`
- `src/lib/filesystem/...`
- `src-tauri/src/...` for desktop filesystem commands where appropriate
- `src/store/editorActions/projects...`

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- the app can create a new project coherently
- the app can save a project to disk
- the app can save-as to a chosen project location
- the app can open an existing saved project
- the folder/project format is clear and future-friendly
- maps, layers, and authored content load back correctly
- dirty/unsaved state is tracked and reflected in UI
- unsaved-change safeguards exist in a practical form
- schema/version info is present in saved data
- asset folder/reference foundations exist
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- recent project path placeholder
- quick reload current project
- manifest validation summary
- human-readable project info panel
- simple autosave placeholder note for future work
- basic save success toast/status message

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- real folder-based project persistence
- save/open/save-as/new workflows
- manifest and per-map saved documents
- persisted authored content reconstruction
- asset folder/reference foundation
- dirty-state and unsaved-change safeguards
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should no longer feel like a temporary session-based prototype.

It should feel like a real mapmaking application where a world project can live on disk, be reopened later, and continue growing over time.

That is the bar.
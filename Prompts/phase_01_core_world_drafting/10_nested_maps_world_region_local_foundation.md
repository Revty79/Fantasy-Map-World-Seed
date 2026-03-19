# 10 — Nested Maps: World, Region, and Local Foundation

## Objective
Implement the foundational **nested map workflow** for World Seed Mapper so a project can meaningfully relate a master world map to child region maps and local maps, with clear parent-child links, scoped navigation, anchored extents, and editor awareness of which map level the user is working in.

This prompt is where the app stops being “a single map editor” and starts becoming a true worldbuilding map system.

---

## Why this prompt exists
One of the defining features of this product is that it must support:

- a master globe-safe world map
- region maps derived from specific world extents
- local maps derived from regions or directly from the world
- navigation between those related spaces
- a clean foundation for future deeper detail work

Without this, the app is just another map editor.

This prompt should establish a practical and future-ready nested-map system that already feels real, even if advanced synchronization and editing behaviors come later.

---

## Required outcome
By the end of this prompt, the app should have:

- a usable project structure for multiple related maps
- world / region / local map relationships represented in the live editor
- creation of child maps from parent map extents
- parent-child nested map links stored in document data
- map switching/navigation within the editor
- visible current-map scope awareness in the UI
- a practical region/local extent selection workflow
- inspector/panel support for map relationship information
- basic breadcrumb/path awareness for nested maps
- clear default rules for inherited vs independent content scope
- `STATUS.md` updated honestly

---

## Constraints
- Do **not** attempt full bi-directional live sync of every content type between parent and child maps in this prompt.
- Do **not** build a giant GIS/georeferencing engine.
- Do **not** make nested maps vague disconnected files with no anchored relationship.
- Do **not** overbuild special cases like hollow-earth or dual-surface modes yet.
- Do **not** require persistence/save/load to be finished before this can exist in-memory.
- Do **not** create confusing map ownership rules that no one can reason about later.

---

## Main goal
Create a nested map system that already feels like the start of a real fantasy worldbuilding suite:

- the world map exists as the root
- a user can define a region from part of that world
- a user can define a local map from part of a region or world
- those child maps are linked and navigable
- the editor understands which scope is active
- the UI gives the user confidence about where they are working

This should feel deliberate and powerful, not hacked on.

---

## What to build

### 1) Multi-map project awareness
Upgrade the editor so the project clearly supports multiple map documents at once.

Requirements:
- project state can contain several maps, not just the root world map
- one map is currently open/active in the editor
- active map switching works coherently
- top bar / workspace / status bar all reflect the current map and scope
- map list/order structure is usable in UI or a dedicated panel/section

This is the foundation of the nested workflow.

---

### 2) Scope-aware map model in live editor
Use the document model properly.

The editor should now operate cleanly against maps of scope:
- `world`
- `region`
- `local`

Requirements:
- the current active map drives the canvas
- current scope is visible in UI
- the app no longer assumes “world only”
- creating/opening/selecting a map updates relevant state cleanly

This should already feel like true multi-map awareness.

---

### 3) Parent-child nested map links
Implement real nested-map relationship usage in the editor.

A nested map relationship should practically express:
- parent map id
- child map id
- child scope kind
- parent-space source extent / anchored area
- normalized/document-space bounds or equivalent
- display name and map metadata
- relationship kind or intent if useful

These links must not be decorative.  
They should actually drive how child maps are created and understood.

---

### 4) Region creation from world extent
Implement a practical workflow for creating a **region map** from a selected extent of the world map.

At minimum:
- while on the world map, the user can initiate “Create Region Map”
- user can define a rectangular or bounded extent on the parent map
- a new region map is created from that extent
- the child map is linked to the world map in document state
- the region map becomes accessible and navigable
- the editor can optionally switch to it immediately

A rectangular extent is perfectly acceptable as the first implementation.  
Do not let fancy irregular boundaries derail the prompt.

---

### 5) Local map creation from region or world extent
Implement a practical workflow for creating a **local map** from a selected extent.

At minimum:
- while on a region map, user can create a local map from a chosen extent
- optionally allow creating a local map directly from the world map too
- resulting local map is linked to its chosen parent
- the child map is navigable and reflected in project/map UI
- relationship data is persisted in project/editor document state

The important thing is that the chain feels real:
- World → Region
- Region → Local
and optionally
- World → Local

---

### 6) Extent selection workflow
Create the first usable extent-selection workflow.

Good outcomes:
- a dedicated “create child map” mode/tool
- drag a rectangle on the current parent map
- see the selected bounds clearly
- confirm creation with a coherent action
- cancel safely with Escape or UI button

Requirements:
- selection happens in parent document space
- created child map stores the extent in a consistent way
- UI makes it clear the user is defining a child-map area, not just doing generic selection

This workflow is central to the nested-map system. Make it understandable.

---

### 7) Child-map defaults
When a child map is created, give it sensible initial defaults.

Examples:
- generated display name like:
  - `Northern Continent Region`
  - `Region 01`
  - `Local Map 01`
- inherited or derived size/settings
- default starter layer stack appropriate to that map
- parent link metadata
- projection/basis compatible with the parent source

Keep it practical and editable.

---

### 8) Navigation and map switching
Implement a clean way to move between related maps.

At minimum provide:
- map switching UI somewhere practical
- visible current map name and scope
- parent/child awareness
- ability to navigate back to parent
- ability to open a child map from its parent relationship

Good optional locations:
- top bar breadcrumb/path
- map panel/sidebar section
- inspector when a map relationship/extent is selected
- quick “open parent / open child” controls

The user should not get lost.

---

### 9) Breadcrumb / hierarchy awareness
Add a clear nested-map breadcrumb or hierarchy indicator.

Good example:
- `World / Northern Continent / Frostmere Valley`

Requirements:
- current active map’s position in the hierarchy is visible
- clicking breadcrumb segments may navigate if natural
- the scope (`World`, `Region`, `Local`) is obvious
- map lineage is understandable at a glance

This does a lot of UX heavy lifting.

---

### 10) Parent extent visualization
Add a practical way to visualize child-map extents on the parent map.

At minimum:
- if the current map has child maps, their extents can be displayed on the parent canvas
- child extents are distinguishable and selectable or inspectable at a basic level
- clicking or interacting with a child extent may offer navigation/open behavior if natural

This is important because it helps the user understand:
- what parts of the world have been broken out into child maps
- how the nested system is organized

Do not over-style it. Clarity first.

---

### 11) Child-map metadata and inspector support
Upgrade the inspector or map-info area so nested-map relationships are visible and useful.

At minimum show things like:
- current map name
- scope
- parent map
- child maps
- source extent/bounds
- creation relationship summary
- maybe derived size or logical extents

For selected child extents or map links, the inspector can show:
- child map name
- scope
- parent relationship
- open/navigate action
- rename field if practical

This should help explain the nested system to the user.

---

### 12) Map panel or navigator foundation
If it fits naturally, add a dedicated map list/panel/navigator area.

Good outcomes:
- list all maps in project
- show hierarchy/indentation
- show map scope badges
- allow selecting/opening maps
- highlight current active map

This is optional if breadcrumb + inspector + top bar are already enough, but some map navigation surface will likely help a lot.

Do not let a complex navigator bloat the prompt.

---

### 13) Inheritance vs independence rules
Define and implement the first rules for how child maps behave relative to parent maps.

This is important.

For this phase, a good baseline might be:
- child maps are **anchored** to a parent extent
- child maps are **independent authoring spaces** after creation
- parent-child relationship metadata remains visible
- advanced synchronization is deferred
- some optional inherited metadata/settings may be copied at creation time

This is probably the safest foundation.

Whatever rule you choose:
- make it explicit
- apply it consistently
- document it in code/comments/status if useful

Do not leave this concept vague.

---

### 14) Canvas behavior for different scopes
The canvas system should now work against whichever map is currently active.

Requirements:
- switching active map updates the canvas bounds and current content
- world/region/local maps all use the same general editor shell
- view reset / zoom-to-fit respects the active map’s extents
- overlays like child extents only show when relevant

This is an important proof that the app is becoming multi-map, not just multi-record.

---

### 15) History integration
Nested-map operations should participate in history where practical.

At minimum consider support for undo/redo of:
- create region map
- create local map
- rename map if implemented
- delete/remove child map if that exists now
- parent-extent selection commit

If full map deletion is too risky right now, be honest about that in `STATUS.md`.

Do not add useless history noise for every drag sample while defining an extent.  
Commit at meaningful interaction boundaries.

---

### 16) Deletion / unlinking guidance
You do not need a full complex map-management suite yet, but decide what basic delete/unlink behavior exists now.

Options:
- no deletion yet, but structure is ready
- safe delete for child map with relationship cleanup
- unlink later stub only

Whichever you choose, keep it coherent and document it honestly.

Do not create orphaned relationship data.

---

### 17) Default project bootstrapping
When the default in-memory project loads, consider whether it should remain:
- world-only by default
or
- include one sample region/local map for demonstration

Either can work.

My recommendation:
- default to a single world map
- make child creation easy and obvious
- optionally include a clearly labeled demo hierarchy only if it truly helps the editor feel alive

Do not confuse the user with fake nested clutter.

---

### 18) Future-ready scope guidance
Do not overbuild now, but do not box the project in.

The nested-map structure should leave room for later:
- linked map previews
- parent-child sync helpers
- map bookmarks/portals
- nested export workflows
- world-to-globe integration
- more complex extent shapes
- thematic style inheritance
- special map modes like alternate surfaces later

A clean foundation is better than a fake “advanced” system.

---

### 19) Performance guidance
Nested maps should respect scale and project growth.

Aim for:
- active-map-centric rendering
- no need to load/render every map in full all the time
- child extent overlays drawn efficiently
- navigation updates that do not thrash the canvas/runtime
- clear room for selective loading later

Avoid:
- treating all maps as one giant merged surface
- tightly coupling all map data into one always-live scene
- forcing unrelated map rerenders on every small map metadata change

---

### 20) UX guidance
The nested-map workflow should feel powerful but understandable.

Aim for:
- obvious current scope
- easy child-map creation
- visible parent-child relationships
- breadcrumbs that reduce confusion
- clear extent visualization on parent maps
- easy way back to parent map
- project feeling like a world system, not just loose files

Avoid:
- vague hidden relationships
- child maps that feel disconnected from parent source
- giant modal-heavy creation flows
- confusing scope switching
- unexplained duplicated content expectations

This is one of the signature features of the product. It should feel intentional.

---

## Suggested file targets
Use clean organization. Something roughly like:

- `src/features/maps/...`
- `src/features/nesting/...`
- `src/engine/maps/...`
- `src/components/panels/MapNavigator...`
- `src/store/editorActions/maps...`

You may choose a slightly different organization if it is cleaner.

---

## Acceptance criteria
This prompt is complete when:

- the project/editor supports multiple related maps
- world / region / local maps are represented in live editor state
- the user can create a region map from a world extent
- the user can create a local map from a region/world extent
- parent-child relationships are stored coherently
- active map switching/navigation works
- breadcrumbs or hierarchy awareness exist
- child extents can be visualized on parent maps
- inspector/panel UI reflects nested-map relationships
- canvas/view behavior respects the active map scope
- no major build/type regressions are introduced
- `STATUS.md` is updated honestly

---

## Nice-to-have additions
Include only if they fit naturally:

- quick-open child from extent overlay
- mini map hierarchy tree
- rename child map on creation
- different extent colors by child scope
- “return to parent” shortcut
- child count badges on parent maps

Do not let these distract from the main job.

---

## Deliverables
Codex should leave behind:

- real nested map relationship workflow
- region/local creation from parent extents
- active map navigation and hierarchy awareness
- parent extent visualization
- inspector/panel integration for map relationships
- updated `STATUS.md`

---

## Definition of done note
After this prompt, the app should no longer feel like a single flat editor.

It should feel like a true worldbuilding mapping suite where a master world can branch into regions and regions can branch into local maps with clear relationships and navigation.

That is the bar.
# Prompt 04 — Terrain Editing Tools

## Goal
Add direct terrain editing tools so the terrain field is not only generated, but also sculptable by hand.

## Why this exists
A true terrain mapper must allow procedural generation plus manual control.

## Required outcomes
1. Add terrain edit actions that directly modify terrain data.

2. Implement a practical first-pass terrain tool set:
   - raise
   - lower
   - smooth
   - flatten / level
   - optional noise stamp or roughen tool if manageable

3. Add brush settings appropriate for terrain editing, such as:
   - size
   - strength
   - falloff / hardness
   - target elevation for flatten if needed

4. Integrate terrain edits into undo/redo history.

5. Terrain edits should immediately update flat terrain rendering.

6. Add UI controls for selecting terrain tools and editing their parameters.

## Strong guidance
Terrain editing should operate on the terrain source of truth, not on paint chunks pretending to be elevation.

## Constraints
- Do not degrade existing vector/paint/symbol/label tool behavior.
- Keep terrain editing responsive.
- Avoid overbuilding advanced sculpt tools this early.

## Acceptance criteria
- User can sculpt terrain directly in flat editor.
- Undo/redo works for terrain edits.
- Terrain display updates after edits.
- Existing drafting tool workflows remain intact.
- Typecheck passes.
- `STATUS.md` is updated and this prompt is checked off.

## Suggested files
- terrain editing modules
- canvas interaction layer
- store terrain actions
- tool settings UI

## End-of-prompt instructions
When complete:
1. Check off this prompt in `STATUS.md`
2. Fill in its Run Log section
3. Commit only the work for this prompt
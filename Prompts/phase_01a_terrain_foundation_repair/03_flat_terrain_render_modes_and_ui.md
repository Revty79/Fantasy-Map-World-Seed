# Prompt 03 — Flat Terrain Render Modes and UI

## Goal
Make terrain visible and meaningful in the flat editor by adding terrain-aware 2D render modes and basic controls.

## Why this exists
Even with real terrain data, the app will still feel like a shape editor unless the user can actually see the terrain clearly in the flat workspace.

## Required outcomes
1. Add terrain rendering support to the flat canvas pipeline.

2. Support useful first-pass terrain display modes such as:
   - grayscale height
   - colored elevation ramp
   - simple shaded relief
   - land/water view based on sea level

3. Add lightweight UI controls so the user can switch terrain display mode for the active map.

4. Terrain rendering should coexist with current authored layers.
   A good model is:
   - terrain base rendering first
   - current drafting layers rendered on top

5. Make the terrain display stable enough that the user can immediately tell:
   - where land is
   - where ocean is
   - where high and low terrain are
   - whether the generator is producing believable continental structure

## Strong guidance
The goal is not visual perfection yet.
The goal is to make the terrain data legible and useful inside the editor.

## Constraints
- Do not remove existing layer rendering.
- Keep render logic shared where practical with export/globe pathways.
- Avoid making terrain view a fake overlay disconnected from terrain data.

## Acceptance criteria
- Generated terrain is visible in flat editor.
- User can switch between at least several terrain display modes.
- Terrain display works with existing map navigation.
- Existing vectors/labels/symbols still render on top.
- Typecheck passes.
- `STATUS.md` is updated and this prompt is checked off.

## Suggested files
- canvas engine files
- render helper files
- terrain rendering module(s)
- sidebar/tool settings UI files
- store additions for terrain display preferences

## End-of-prompt instructions
When complete:
1. Check off this prompt in `STATUS.md`
2. Fill in its Run Log section
3. Commit only the work for this prompt
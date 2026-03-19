# Prompt 05 — Derived Coastlines, Masks, and Contours

## Goal
Add terrain-derived products so the system can compute coastlines and related map structures from elevation + sea level.

## Why this exists
Right now coastlines are primarily authored vectors. That is useful artistically, but a terrain-first foundation must be able to derive them from actual terrain data.

## Required outcomes
1. Add terrain-derived land/water interpretation based on sea level.

2. Add a derived coastline output path.
   This may begin as:
   - preview geometry
   - generated vector features
   - or a derived overlay renderer

3. Add optional derived contour visualization or contour extraction.

4. Add a clean separation between:
   - authored coastline vectors
   - derived coastline output

5. Add UI controls to:
   - toggle derived coastline visibility
   - adjust sea level
   - toggle land/water interpretation view
   - optionally toggle contour preview

## Strong guidance
It is acceptable for generated coastline output to begin as preview/derived data rather than permanent destructive writes.
The important thing is that the system can now derive geographic structure from terrain truth.

## Constraints
- Do not delete or overwrite user-authored vector coastlines automatically.
- Keep the distinction between derived and hand-authored content clear.
- Avoid trying to perfect cartographic beautification in this prompt.

## Acceptance criteria
- Terrain + sea level can produce visible land/water separation.
- A derived coastline workflow exists.
- Contour preview or contour extraction exists in a usable first-pass form.
- Existing vector tools still work.
- Typecheck passes.
- `STATUS.md` is updated and this prompt is checked off.

## Suggested files
- terrain derivation modules
- vector conversion helpers if used
- UI/store additions
- render pipeline helpers

## End-of-prompt instructions
When complete:
1. Check off this prompt in `STATUS.md`
2. Fill in its Run Log section
3. Commit only the work for this prompt
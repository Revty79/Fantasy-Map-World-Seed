# Prompt 07 — Persistence, Export, and Schema Compatibility

## Goal
Make terrain data durable and safe by integrating it fully into save/open/export flows and documenting any compatibility behavior.

## Why this exists
Terrain cannot be a real system unless it survives disk round-trips and participates correctly in export logic.

## Required outcomes
1. Extend persistence so terrain data saves and loads correctly.

2. Ensure old projects that do not contain terrain data still open safely.
   Hydration defaults are acceptable.

3. Update outward-facing export behavior so terrain-aware outputs are sensible.
   At minimum:
   - PNG should reflect terrain rendering
   - JSON should include terrain data or terrain metadata appropriately
   - SVG should continue to warn clearly where terrain content is not directly representable

4. Add any needed schema/version notes.

5. Add tests or smoke-check helpers where practical for:
   - generate terrain -> save -> reopen -> terrain preserved
   - export still works after terrain integration

## Constraints
- Do not silently corrupt or discard terrain data.
- Do not casually break older project loading.
- Keep export warnings explicit and honest.

## Acceptance criteria
- Terrain survives save/open round trips.
- JSON export meaningfully includes terrain-related information.
- PNG export reflects terrain-aware render output.
- SVG behavior remains explicit and safe.
- Typecheck/build pass.
- `STATUS.md` is updated and this prompt is checked off.

## Suggested files
- persistence files
- export files
- schema/version helpers
- docs as needed

## End-of-prompt instructions
When complete:
1. Check off this prompt in `STATUS.md`
2. Fill in its Run Log section
3. Commit only the work for this prompt
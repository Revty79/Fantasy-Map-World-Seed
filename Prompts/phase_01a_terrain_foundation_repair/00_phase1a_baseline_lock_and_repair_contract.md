# Prompt 00 — Phase 01A Baseline Lock and Repair Contract

## Goal
Create a clear, explicit repair contract for Phase 01A so the current drafting baseline is preserved while terrain-first capabilities are retrofitted into the existing codebase.

## Why this exists
The current app is not a failed build. It is a successful drafting/editor baseline. The problem is that it does not yet have a true terrain/elevation source of truth.

This prompt exists to:
- preserve the value of the current implementation
- prevent accidental rewrites of working systems
- define the architectural rules for the terrain retrofit
- document the current state honestly for later phases

## Required outcomes
1. Add a new Phase 01A documentation note that clearly states:
   - Phase 01 delivered a drafting/editor baseline
   - Phase 01A retrofits terrain foundation into that baseline
   - this is an additive corrective phase, not a scratch rebuild

2. Add a repair contract doc in `docs/` that defines:
   - what is already good and must be preserved
   - what is currently missing
   - what Phase 01A must add
   - what must not regress

3. Review existing docs and adjust wording where needed so the repo truth is consistent:
   - README
   - architecture docs
   - phase handoff docs
   - any wording that implies terrain is already fully implemented

4. Do not add terrain behavior yet unless needed for tiny scaffolding.
   This prompt is for baseline lock, documentation truth, and architectural guardrails.

## Constraints
- Do not rewrite the repo history or delete existing phase docs.
- Do not remove current vector / paint / symbol / label systems.
- Do not make speculative large refactors here.
- Keep changes documentation-heavy and architecture-light.

## Acceptance criteria
- A new document exists that clearly explains the purpose of Phase 01A.
- Existing docs no longer create false expectations about terrain completeness.
- The repo now has an explicit non-regression contract for the terrain retrofit.
- `STATUS.md` is updated and this prompt is checked off.

## Suggested files
- `docs/PHASE1A_REPAIR_CONTRACT.md`
- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/PHASE2_HANDOFF.md`
- `prompts/phase_01a_terrain_foundation_repair/STATUS.md`

## End-of-prompt instructions
When complete:
1. Check off this prompt in `STATUS.md`
2. Fill in its Run Log section
3. Commit only the work for this prompt
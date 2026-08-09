# Phase 7 Chapter 8 Report

## Chapter 8 Status

- Mass battle: **COMPLETE**
- Siege: **COMPLETE**
- Additional Chapter 8 coverage: Skirmish is **COMPLETE** for command and follower procedures; individual blows deliberately use the existing Chapter 7 engine.

## Implemented Rules

- Skirmish commander roll, first-round-only combat modifier, delayed follower fate, canonical casualties, capture and rescue.
- Battle setup, command chain, situation modifiers, first charge, mounted and missile consequences, 3d6 melee events, fresh per-round enemies, unit actions, personal exchanges, rally and Chapter 7-returning special events.
- Retreat, rout stand, opposed escape, surrender/capture, two-round pursuit, final result, force fate, loot, ransom claims and battle Glory.
- Separate simple and advanced siege models with DV rings, natural defenses, equipment, health, assault, blockade, treachery, single combat result, morale chains, withdrawal and capture.
- Shared character wounds, pending death, lifecycle death confirmation, horse state, family/follower state, Honor, Glory ledger, chronicle, captives, economy queue and fortress history.

## Tables

Tables 8-3 through 8-16 are source verified, exposed as pure executors, called by the runtime state machines, and covered by regression assertions. Tables 8-1 and 8-2 were also implemented and tested because they are part of the same chapter. Detailed call sites and transitions are in `CHAPTER_8_SOURCE_AUDIT.md`.

## End-To-End Flows

- Skirmish: setup -> failed command -> two Chapter 7 melee-result records -> follower failure -> exact killed/wounded/captured assignment -> victory and prisoner rescue -> chronicle/history.
- Mass battle: setup -> two command rolls -> first charge -> follower fate -> melee event and exchange -> follower fate -> decisive victory -> loot/ransom/Glory -> campaign history.
- Injury/death: enemy charge damage -> shared HP/wound state -> same-day pending death -> shared lifecycle Salvation gate.
- Capture: surrender -> activity lock -> explicit ransom resolution -> Chapter 12 pending economy record.
- Retreat/pursuit: battalion rout -> stand -> enemy rout -> pursuit decision -> melee pursuit -> Hunting pursuit -> aftermath.
- Siege assault: monthly health -> assault through final DV ring -> defender morale -> castle capture -> Glory, captives and fortress control.
- Siege blockade/treachery: blockade to next month -> health -> paid treachery -> defender morale surrender.
- Simple siege: one opposed assault matrix -> aftermath, with reload preserving the exact phase.

## Campaign Integration

Persistent schema v8 fields include `skirmish`, `massBattle`, `siege`, their histories, health wounds and pending death, `captivity`, canonical follower status, family timeline, horse state, Glory ledger, Honor, captives, `pendingEconomy`, chronicle events, and fortress control. Sanitizers preserve every valid active phase and prevent a completed award from being applied twice.

## Remaining Gaps

- Chapter 8 has no omitted executable table or phase in the implemented scope.
- Ransom settlement amount remains a Chapter 12 task; the claim itself is persistent and visible.
- The source assigns some outcomes to the Gamemaster, including loot amount, skirmish narrative result, follower selection and rescue, and single-combat winner. The app requires an explicit choice and does not invent a roll.
- Full Chapter 7 advanced/multiple/ranged combat, Chapter 12 economy, Chapter 17 cultures, Chapter 18 bestiary, and Chapter 19 adventures remain release-wide gaps, not Chapter 8 substitutions.

## Verification

- Typecheck: **N/A** (repository has no TypeScript/typecheck script)
- Chapter 8 module lint: **PASS**
- Repository-wide lint: **FAIL** (136 errors and 3 warnings in legacy `CharacterSheet`, `FamilyRegister`, `SoloOracles`, and related files; outside the Chapter 8 scope)
- Unit tests: **PASS**
- Integration tests: **PASS**
- Existing combat/winter/lifecycle/campaign regressions: **PASS**
- Production build: **PASS**
- Responsive 360-1920 and horizontal-overflow check: **PASS**

## Screenshots

- `artifacts/screenshots/chapter-8-skirmish-mobile.png`
- `artifacts/screenshots/chapter-8-skirmish-desktop.png`
- `artifacts/screenshots/chapter-8-mass-battle-desktop.png`
- `artifacts/screenshots/chapter-8-siege-desktop.png`

## Final Assessment

Can Chapter 8 now be played from beginning to end without reopening the rulebook? **YES.**

The only stops are choices the printed chapter itself gives to the Gamemaster or economic settlement explicitly belonging to Chapter 12; both are surfaced and persisted instead of being silently fabricated or lost.

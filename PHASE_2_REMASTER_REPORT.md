# Remaster Phase 2: Character Creation

## Source and scope

- Authoritative source: `paladin_core_rulebook.pdf`, Chapter One creation procedure, PDF pages 26-41.
- Scope: Rules Engine to application state to 20-step creation UI, save/resume, and one atomic completion transaction.
- Excluded: Phase 3+ lifecycle expansion, successor inheritance completion, Winter, combat and later gameplay.

## Changed files and reasons

- `src/rules/characterCreationData.js`: printed tables, formulas, labels and 20 source-ordered checkpoints.
- `src/rules/characterCreationRules.js`: seeded/manual dice ledger, recomputation, all Chapter One creation procedures and completion transaction.
- `src/rules/personalityRules.js`, `src/rules/index.js`: correct Romantic traits and expose the creation engine through the shared rules boundary.
- `src/components/CharacterCreationWizard.jsx`, `src/components/CharacterCreationWizard.css`: resumable chronicle wizard, source disclosure, gated choices, review, responsive and accessible controls.
- `src/components/CharacterSheet.jsx`: make the core-rule route primary and visibly separate authored presets/manual overrides.
- `src/utils/campaignState.js`, `src/App.jsx`: schema version 4, migration, creation session, completion IDs and archives.
- `src/index.css`: prevent the existing character sheet from widening the 390px mobile document.
- `scripts/character-creation-regression.mjs`, `scripts/rule-audit-regression.mjs`, `package.json`: Rule-ID coverage and CI wiring.
- `RULE_AUDIT.md`, `RULE_TRACEABILITY.md`, `RULE_DIFFERENCES.md`: Phase 2 compliance, source ambiguity and implementation evidence.
- `docs/screenshots/phase-2-*`: desktop and mobile visual evidence.

## Rule compliance change

| Status | Phase 1 | Phase 2 |
|---|---:|---:|
| Exact | 16 | 31 |
| Partial | 74 | 64 |
| Incorrect | 1 | 0 |
| Missing | 14 | 12 |
| UI-only | 25 | 23 |
| Logic-only | 3 | 3 |
| House Rule | 3 | 3 |

The canonical core route is exact for father/survival, Page education, culture and homeland, attributes, feature category, traits, passions, Standings, male skills, skill application order, knighthood, initial Glory, outfit, birth gifts and story completion. Female source tables are exact in the engine but remain `Partial` at the UI boundary because the printed son-number/application order is ambiguous.

## Test result

- `npm run test:character-creation`: passed, 19 Rule-ID groups.
- `npm run test:rules`: passed, 24 Phase 1 groups.
- `node scripts/hostile-regression.mjs`: passed.
- `npm run ci:temporary`: passed.
- Targeted ESLint for Phase 2 files: passed.
- `npm run build`: passed; the pre-existing large-bundle advisory remains.

## Screenshots

- `docs/screenshots/phase-2-character-start.png`
- `docs/screenshots/phase-2-traits.png`
- `docs/screenshots/phase-2-passions.png`
- `docs/screenshots/phase-2-initial-glory.png`
- `docs/screenshots/phase-2-review.png`
- `docs/screenshots/phase-2-mobile.png`

## Remaining work

- Confirm the intended female-specific son-number and modifier application order before enabling that route.
- Complete shared-family ownership and same-family successor modifiers in later lifecycle phases.
- Enforce all ongoing Ideal benefits in their owning Winter/prayer/adventure phases.
- Address repository-wide legacy lint findings and bundle splitting in their scheduled polish/performance phases.

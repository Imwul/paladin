# Remaster Phase 3: Lifecycle, Salvation, Succession and Korean UI

## Scope

Phase 3 implements the Chapter One career-end sequence without expanding Winter, combat or health into later phases. The printed Rulebook pages 41-43 and Tables 1-16/1-17 were reread before implementation and remain authoritative.

Included:

- Death, retirement, temporary incapacity, bedridden state and recovery boundaries.
- Atomic career-end confirmation and schema-version-5 persistence.
- Salvation, Canonization and pending Legacy.
- Same-family, new-family and prepared-second-character routes.
- Reuse of the Phase 2 twenty-step canonical character-creation wizard.
- Korean-primary lifecycle/creation UI with English fallback.

Excluded:

- Full Winter Phase rewrite, survival target expansion, combat/health and regency.
- Female-specific creation interpretation, multiplayer family ownership and whole-app lore translation.

## Implementation

### Lifecycle state machine

`src/rules/lifecycleRules.js` owns all lifecycle changes. UI components request transitions and render returned state; they do not assign lifecycle strings or calculate rule results. Every accepted transition writes one lifecycle event, applied effect IDs, Journal entry, Chronicle event and save revision.

Death and retirement first enter a resumable confirmation state. Confirmation clears the active-character identity, keeps the predecessor in the Family Tree as deceased or living-retired, and opens `pending_salvation`. Incapacity and bedridden state remain living career states and never open Salvation.

### Salvation and Canonization

The Salvation ledger stores the lowest religious trait, Amor/Honor/Love Charlemagne/Love God bonuses, each deed bonus, final statistic, physical d20 record and result. Automatic seeded and manual dice both call the Phase 1 d20 resolver.

A successful check creates `pending_legacy`, not a character. Canonization is offered only when deed bonuses are at least +15, the Salvation statistic is at least 20 and Salvation was critical. Its separate Church Standing check grants exactly two score transfers and one consumable Table 1-17 blessing roll on success.

### Legacy and successor

Legacy stores the predecessor, successor mode, selectable/capped scores, selected transfers, extra Birth Gift, optional blessing grant, classified equipment, GM-approved manors, inherited family data, unresolved choices and consumption state.

- Same family: reuses family data, applies the printed APP/Valorous/Glory modifiers, replaces Table 1-14 with approved inheritance, applies transfers in the recorded creation order, and records provenance.
- New family: starts a fresh family after approval, applies no lineage benefit and forfeits unused prior-family Legacy.
- Prepared second character: is available only for temporary incapacity, remains distinct from succession and can return control to the recovered primary character.

Candidates below 15 are blocked. Ages 15-17 enter the same squire-year progression and printed qualification checks as older candidates; age 18 is not a fixed gate.

### Save migration

Schema version 5 preserves version 4 creation sessions, family records and Journal text while adding lifecycle events, Chronicle events, Legacy, grants, prepared characters and successor context. Ambiguous old `pending_succession` data migrates to a historical predecessor and unresolved `pending_successor`; it never revives the predecessor. Existing blessing prose is preserved without creating a new blessing grant.

### Korean UI

`src/i18n/ko.js`, `en.js` and `index.js` provide Korean-primary translation, English fallback, parameter substitution and missing-key diagnostics. Phase 3 covers lifecycle status, career end, Salvation, Legacy, successor routes, the canonical wizard's main controls/steps, Character Sheet navigation and principal save/resume/error text.

## Changed Files

| Area | Files | Reason |
|---|---|---|
| Rules engine | `src/rules/lifecycleRules.js`, `coreRules.js`, `campaignRules.js`, `characterCreationRules.js`, `index.js` | Central lifecycle resolution, seeded RNG, successor context and canonical wizard integration. |
| State/migration | `src/utils/campaignState.js`, `src/App.jsx` | Schema v5, conservative migration, pending-state save/resume and one-active-character invariant. |
| UI | `src/components/LifecyclePanel.jsx`, `LifecyclePanel.css`, `CharacterCreationWizard.jsx`, `CharacterCreationWizard.css`, `CharacterSheet.jsx`, `FamilyTree.jsx`, `FamilyWinter.jsx`, `src/index.css` | Korean lifecycle flow, confirmation dialog, inheritance-aware wizard, Family Tree states and responsive fixes. |
| Localization | `src/i18n/ko.js`, `en.js`, `index.js` | Korean default, English fallback and missing-key checks. |
| Verification | `scripts/lifecycle-regression.mjs`, character/rule/hostile regressions, `package.json` | Rule-ID regression, migration/idempotency checks and CI inclusion. |
| Audit | `RULE_AUDIT.md`, `RULE_TRACEABILITY.md`, `RULE_DIFFERENCES.md` | Phase 3 evidence, counts and interpretation record. |

## Rule Compliance

| Status | Phase 2 | Phase 3 |
|---|---:|---:|
| Exact | 31 | 36 |
| Partial | 64 | 60 |
| Incorrect | 0 | 0 |
| Missing | 12 | 11 |
| UI-only | 23 | 23 |
| Logic-only | 3 | 3 |
| House Rule | 3 | 3 |

Promoted to `Exact`: `LIFE-001`, `LIFE-LEGACY-001`, `LIFE-SAINT-001`, `LIFE-NEWCHAR-001`, `LIFE-NEWFAMILY-001`. `LIFE-SALVATION-001` and `WINTER-AGING-001` remain `Exact` with stronger engine/persistence evidence. Global `SAVE-IDEMP-001` remains `Partial` because unrelated legacy mutations are outside Phase 3.

## Verification

- `npm run ci:temporary`: passed.
- Phase 1 rule regression: passed.
- Phase 2 character-creation regression: passed.
- Phase 3 lifecycle regression: passed.
- Hostile save/state and schema migration regression: passed.
- Production build: passed; existing large-bundle advisory remains.
- Targeted ESLint for the Phase 3 rules/i18n modules, lifecycle panel, canonical wizard, Winter integration, migration and regressions: passed.
- Repository-wide ESLint: not clean; the legacy baseline reports 159 errors and 3 warnings across 10 older files. No new Phase 3 module appears in that finding set.
- Browser flow: career end, Salvation, Legacy, successor selection and same-family wizard passed.
- Responsive: 390 and 1440 CSS pixels passed with no document overflow.
- Accessibility smoke: dialog focus entry/Escape path, visible focus, semantic status text, 44px controls and reduced-motion CSS checked.
- Browser console: 0 errors, 0 warnings.

## Screenshots

- `docs/screenshots/phase-3-lifecycle-desktop.png`
- `docs/screenshots/phase-3-career-end-confirmation.png`
- `docs/screenshots/phase-3-salvation.png`
- `docs/screenshots/phase-3-legacy-selection.png`
- `docs/screenshots/phase-3-successor-selection.png`
- `docs/screenshots/phase-3-successor-wizard.png`
- `docs/screenshots/phase-3-lifecycle-mobile.png`

## Remaining Work

- Phase 4: complete Winter Survival, special-mount/herd handling, personal/family event effects, economy choices and ordered step ownership.
- Resolve the printed female-specific creation ambiguity only after user confirmation.
- Add configured Firebase round-trip/conflict smoke; local migration and rule outcomes are already shared.
- Continue Korean extraction for remaining Family Tree editing, Winter, oracles and lore screens.
- Address the existing 2.02 MB main-bundle advisory during the later performance phase.

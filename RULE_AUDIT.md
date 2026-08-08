# Paladin Rule Audit

## Audit scope

This is a rules-conformance audit, not a general code or visual-design review. It compares the complete 463-page `paladin_core_rulebook.pdf` with the rules that can affect play in the web app, including character generation, ancestry, traits and passions, Glory and Standings, checks, combat helpers, mass-combat helpers, magic helpers, the Winter Phase, succession, chronology, random tables, and persistence.

The audit treats one independently triggered procedure or one random-table family as one rule. Rows of the same table are grouped only when they share one trigger and resolution path; row-level differences are recorded in the issue column. Setting prose without a mechanical instruction is catalogued as reference data rather than a game rule.

## Rulebook used

- File: `paladin_core_rulebook.pdf`
- Publication metadata: Nocturnal Media, PDF produced in 2018
- Length: 463 PDF pages
- Rules covered: Introduction and Book I in full; Book II rules-bearing passages in Chapters 13-19; appendices where they supply generators or sheets
- Primary page references: printed/PDF page numbers as displayed by the file

## Baseline result before this audit's fixes

The app is a useful campaign companion, but it is not a complete implementation of the core rulebook. It contains substantial character, ancestry, Winter Phase, oracle, mass-battle, magic, and reference functionality, while the full personal-combat, health, siege, adventure, ambition, wealth, foreign-character, creature, and solo-scenario engines are not implemented end to end.

The most serious baseline findings are:

1. The shared d20 behavior used by many oracle flows treats a natural 1 as an automatic critical. The rulebook makes a critical the roll exactly equal to the modified statistic; a 1 is critical only when the statistic is 1. Values above 20 and values at or below 0 are also resolved incorrectly.
2. Character creation omits the required `Love [Charlemagne]` passion and substitutes nonstandard default passions. Saint Denis modifies Standing instead of `Love [Charlemagne]`. Custom generation uses fixed skills and traits rather than Tables 1-8, 1-10, 1-12 and the cultural/homeland rolls.
3. The default campaign starts in 768 although the core campaign and first characters start in 767. The displayed 745-767 father era includes 767 even though the father history procedure ends in 766 and the player starts in 767.
4. Winter aging happens after all Winter steps instead of at Step 2. The age-30 boundary is therefore one year late, the replacement squire starts at 15 instead of 14, attributes are clamped at 3 so aging can never cause death at 0, and incapacitation at 3 or less is not modeled.
5. Salvation uses natural 1 as the critical and uses Loyalty [liege] where the table requires Love [Charlemagne]. Its legacy action invents a 1.1x Glory inheritance and an instant replacement heir instead of the rulebook's score transfer and birth-gift/blessing benefits.
6. Manual succession resets the successor to a fixed template, does not run the new-character rules, and records the predecessor as retired regardless of whether the career ended by death. The sanitizer can manufacture a living active character when a save contains none.
7. The Winter personal-event table is displayed close to the source, but many result effects are omitted, applied to the wrong statistic, or applied without required player choices. Harvest ignores several mandatory modifiers and adds gross manor income to cash without completing the maintenance procedure.
8. Random generation calls `Math.random` directly in roughly 180 places. There is no seedable RNG boundary, so table distributions and duplicate-application defenses cannot be tested deterministically end to end.

## Priority and fix policy

Fixes are applied in this order: common resolution mechanics; death/retirement/succession; year and phase boundaries; character creation; Winter state transitions and arithmetic; random tables; persistence/UI mismatches. Missing full subsystems are not replaced with invented abbreviated rules. Where exact automation needs a Gamemaster decision or gameplay outside the app, the app must preserve a visible unresolved state instead of silently choosing.

## Compatibility policy

Existing saves are migrated through `sanitizeCampaignState`. Legacy fields are preserved when they may contain user-entered information. New canonical fields are derived only where the rulebook gives an unambiguous mapping. No save is deleted and no previously recorded journal entry is rewritten.

### Schema migration record

- Existing format: schema version 2 saves may omit lifecycle/economy fields, use `loyaltyLiege` instead of `loveCharlemagne`, clamp attributes above zero and contain only free-form family status strings.
- New format: schema version 3 adds canonical lifecycle (`active`, `incapacitated`, `deceased`, `retired`, `pending_succession`), pending Salvation legacy, Winter harvest/economy state and canonical Love Charlemagne while preserving arbitrary legacy fields.
- Phase 2 format: schema version 4 adds an in-progress character-creation session, completion IDs, character archives and a full roll/choice/modifier trace. Version 2/3 saves continue through the same sanitizer, and a malformed object-valued saint effect is repaired to a display-safe summary.
- Phase 3 format: schema version 5 replaces the ambiguous succession flag with the explicit lifecycle state machine, event/effect ledgers, Chronicle events, Salvation/Canonization ledgers, pending Legacy, prepared-character state and successor creation context. Version 4 `pending_succession` saves migrate to a historical predecessor plus an unresolved `pending_successor`; blessing text never manufactures a fresh grant.
- Reason: death, retirement, incapacity, succession and unresolved annual economy must survive save/load without inventing a living character or applying income twice.
- Migration/read path: `sanitizeCampaignState` accepts old or incomplete objects, overlays safe structural defaults, maps Loyalty only when Love Charlemagne is absent, derives lifecycle conservatively and preserves journal/family/user text.
- Rollback: exported version 3 JSON remains ordinary JSON and keeps the old fields; an older build can ignore added campaign keys, but it cannot reproduce the corrected lifecycle semantics. Users should retain an exported backup before intentionally reopening a campaign in an older build.

## Deliverables

- `RULE_TRACEABILITY.md`: rule-to-code-to-test matrix and detailed high-risk rule cards
- `RULE_DIFFERENCES.md`: house rules, historical/version differences, ambiguities, and interface-only behavior
- This file: scope, counts, critical findings, fix summary, and verification result

## Compliance counts

The matrix contains 136 independently triggered rule or table-family entries. The latest column reflects the Grand Remaster and Chapter 10 pass described below.

| Status | Baseline | Audit fixes | Remaster Phase 1 | Remaster Phase 2 | Remaster Phase 3 | Grand Remaster |
|---|---:|---:|---:|---:|---:|---:|
| Exact | 3 | 16 | 16 | 31 | 36 | 38 |
| Partial | 62 | 75 | 74 | 64 | 60 | 58 |
| Incorrect | 21 | 1 | 1 | 0 | 0 | 0 |
| Missing | 19 | 16 | 14 | 12 | 11 | 11 |
| UI-only | 28 | 25 | 25 | 23 | 23 | 23 |
| Logic-only | 0 | 0 | 3 | 3 | 3 | 3 |
| House Rule | 3 | 3 | 3 | 3 | 3 | 3 |

The rise in `Partial` is intentional: an incorrect or missing rule is not called exact merely because its highest-risk arithmetic was corrected. For example, the Winter personal-event roll now uses the exact d20 resolver, but the row remains partial because several event choices and downstream effects are not automated.

## Fix result

- Added the initial source-derived rules layer for Paladin rounding, standard and opposed d20 checks, campaign/lineage boundaries, successor age eligibility, aging outcomes, harvest, starting passions/Standings, and Frankish Ardennes base generation; Remaster Phase 1 below splits and extends that layer.
- Corrected the 767 start, the 745-766 father era, the 768-814 phase boundaries and the 767 opening chronology.
- Corrected natural-1, natural-20, above-20 and below-zero resolution in the major oracle, Winter and Salvation paths.
- Rebuilt the default rules-based male creation path around the twelve source trait pairs, four starting passions, six derived Standings, Table 1-12 skill dice, culture/homeland modifiers, Saint Denis and Paladin rounding. Authored quick-start presets remain separate convenience data.
- Separated active, incapacitated, deceased, retired and pending-succession lifecycle states. Successor preparation begins at age 15, retirement is not rewritten as death, and dead saves no longer manufacture a living active character.
- Replaced the fabricated 1.1x Glory/instant-heir Salvation result with a pending source-shaped legacy record. Canonization now uses the source thresholds and Church Standing check; Table 1-17 is available only when a canonized predecessor granted it and consumes that grant.
- Moved age, squire age and mount age handling into Winter Step 2; restored age-14 replacement squires and attribute-zero death. Harvest now uses the printed result values and Standing/phase/situational modifiers, while maintenance requires an explicit net ledger resolution.
- Migrated schema version 2 saves to version 3 without deleting legacy passions, user text or historical records.

## Remaster Phase 1: Rules Engine

### Authoritative source pass

The complete 463-page PDF was extracted and read again before implementation. The table of contents, all chapter boundaries and all rules-bearing passages were scanned, with original rendered pages rechecked for dice and rounding, the twelve opposed traits, d20 and opposed resolution, modifiers, Feats, movement and travel, forced march, and experience.

This pass found one source inconsistency and one audit error. The Introduction gives Phase 4 as 801-813 while Chapter 15 includes 814; the current 801-814 interpretation is retained and recorded for user confirmation. The old matrix also claimed that a critical automatically outranked a higher ordinary success in opposed resolution. Chapter 6 instead awards the win to the highest successful modified die result, so the engine, tests and matrix now follow that wording.

### Architecture and behavior

- Split the mixed helper file into `src/rules` modules for core resolution, personality, progression, travel, campaign and character rules. `src/utils/paladinRules.js` remains as a compatibility facade.
- Routed source dice used by the four large gameplay components through shared `rollDie`/`rollD3` functions. Random list selection remains later-phase work.
- Added exact engine procedures for printed dice notation, d3 conversion, statistic and reflexive modifiers, opposed partial success, Feats, Movement Rate, Table 6-2 travel, unknown routes, forced march and experience.
- Replaced duplicated trait-pair arithmetic in character creation, the sheet, ancestry, personal events, Winter training, Winter experience and Glory bonuses with the twelve-pair engine.
- Removed the remaining `Pious` Winter training option. Table 10-9 event 19 now records its required Christian-trait choice as unresolved instead of silently awarding an invented Pious check.
- Corrected Winter and Solo experience boundaries: equal-or-higher succeeds, values 20+ receive a free check, a 20 can raise a value above 20, and traits may become heroic while the opposite remains 0.
- Removed the save sanitizer's invented score-30 ceiling. Existing values and schema keys are unchanged; finite nonnegative heroic values now survive save/load in either trait direction.

### Compliance change

- `INTRO-DICE-001`, `CORE-FEAT-001` and `CORE-MOVE-001` moved to `Logic-only`: the engine is exact, but no new player-facing feature was added in this phase.
- `CORE-OPPOSED-001`, `CORE-MOD-001`, `CORE-XP-001`, `CORE-XP-002`, `TRAIT-PAIR-001` and `RNG-001` remain `Partial` with narrower, explicit remaining scope.
- Missing decreased from 16 to 14. Partial decreased from 75 to 74. No row was promoted to `Exact` without a complete app surface.

### Verification

- Production build: passed, with the existing large-bundle advisory.
- Rule regression: 24 Rule-ID groups passed.
- Hostile save/state regression: passed, including nonnumeric score recovery and heroic-value round trips.
- Browser smoke: passed for heroic trait `21/0`, the equal-or-higher experience wording, unchecked-skill gating and an empty browser error log.
- Screenshots: `docs/screenshots/phase-1-rules-engine.jpg` and `docs/screenshots/phase-1-experience-roll.jpg`.
- Repository-wide lint remains outside a clean baseline; the existing legacy component findings are still present.

### Remaining after Phase 1

The Rules Engine APIs do not by themselves complete the player-facing Feat or travel workflows. Several later-phase event and combat callers still own consequence-specific branches, experience adjustments awarded by events are not consistently deferred until after the annual roll, the Solo trait helper narrates checks without persisting every check, and random list selection is not yet injectable. These items remain visible as `Logic-only` or `Partial` rather than being treated as complete.

## Remaster Phase 2: Character Creation

### Authoritative source pass

Chapter One was extracted again from the printed PDF and every source page used by creation was visually rechecked before editing. The implementation follows the printed procedure rather than the legacy generator: personal data and family, youth, attributes, personality, skills, knighthood, initial Glory, possessions, birth gifts and the first character story.

The requested 20-step interface preserves the rulebook's nine-step order while separating dense source subprocedures into visible checkpoints. Every step displays its Rule ID and page, and a downstream change recomputes from stored dice and choices instead of stacking modifiers twice.

### Architecture and behavior

- Added one deterministic character-creation engine and source-data module. Automatic and manual physical dice use the same roll record, source page and modifier ledger.
- Added a resumable schema-version-4 session with seed, current step, rolls, choices, invalidations, unresolved choices and squire-year history. The active character is untouched until final confirmation.
- Added exact father/subtable/survival, Page education, culture/homeland, attribute, trait, passion, Standing, skill-order, knighthood, initial Glory, outfit and birth-gift procedures.
- Added a 20-step chronicle wizard with gated progress, source disclosures, mobile controls, keyboard focus and reduced-motion handling. Authored presets and manual editing remain visibly separate from the rulebook path.
- Added an atomic, idempotent completion transaction that updates the character sheet, family tree, journal and campaign lifecycle together and archives the previous summary.
- Did not enable the source-ambiguous female-specific route. Its printed tables are implemented and tested, while the UI records why user confirmation is required.

### Compliance change

- `Incorrect` decreased from 1 to 0 by correcting `CHAR-GLORY-001` with source-itemized cumulative Glory and one knighting award.
- `Exact` increased from 16 to 31. Father, survival, Page, culture, attributes, feature, traits, passions, Standings, skill ordering, knighthood, Glory, outfit and birth-gift rows now have engine, UI and regression coverage.
- `Missing` decreased from 14 to 12. Female skill formulas and knighthood are no longer absent; the former remains `Partial` until the female-specific route is interpreted.
- Female-specific generation and full later-year Ideal benefits remain `Partial`; no ambiguous or later-phase rule was invented to improve the count.

### Verification

- Character-creation regression: passed, covering 19 Rule-ID groups, every relevant d20/d6 table boundary, male/female formulas, source-order caps, nested rerolls, save/resume and atomic/idempotent completion.
- Phase 1 rule regression and hostile save/state regression: passed unchanged.
- Production build and targeted lint for all new Phase 2 modules: passed. The existing large-bundle advisory remains.
- Browser full path: passed from seed entry through Review at desktop width and at 390 CSS pixels. A completion-render incompatibility found during this pass was fixed with a save migration and a regression assertion.
- Screenshots: `docs/screenshots/phase-2-character-start.png`, `phase-2-traits.png`, `phase-2-passions.png`, `phase-2-initial-glory.png`, `phase-2-review.png`, and `phase-2-mobile.png`.

### Remaining after Phase 2

The female-specific route needs user confirmation on son-number/application order before it can be enabled. Shared multiplayer family ownership, same-family successor modifiers, later-year Ideal benefits and lifecycle procedures remain assigned to subsequent phases. Phase 3 and later gameplay was not expanded here.

## Remaster Phase 3: Lifecycle, Salvation, Succession and Korean UI

### Authoritative source pass

Chapter One's end-of-career pages and Tables 1-16/1-17 were extracted and visually reread before editing. The implemented order is career end, Salvation, optional Canonization, pending Legacy, successor route selection and the existing twenty-step character-creation procedure. Death, retirement, temporary incapacity and bedridden survival never share one result.

### Architecture and behavior

- Added a schema-version-5 lifecycle engine with pure resolvers for incapacity, bedridden state, recovery, death, retirement, career-end preparation/confirmation, Salvation, Canonization, Legacy and successor activation.
- Career end updates the active identity, Family Tree, Journal, Chronicle, pending state, save revision and effect IDs in one idempotent transaction. Reloads and repeated commands reuse the recorded result.
- Added persisted Salvation and Canonization ledgers using the shared d20 resolver and injectable seeded/manual rolls. Canonization requires the deed threshold, Salvation 20+, a critical Salvation and a successful Church Standing roll.
- Added source-shaped Legacy grants and the separate same-family, new-family and prepared-second-character routes. Same-family generation reuses the Phase 2 wizard and applies only the printed APP, Valorous, Glory, equipment, manor, score-transfer, gift and blessing changes with provenance.
- Added Korean-primary locale files with English fallback for the lifecycle panel, canonical creation wizard and principal Character Sheet navigation/status labels. The destructive career-end dialog has focus management, keyboard dismissal, visible status text, reduced-motion styling and 44px controls.
- Kept Winter Phase scope narrow: only attribute consequences now enter the lifecycle resolver. Survival, mount and the remaining Winter procedures stay assigned to Phase 4.

### Compliance change

- `Exact`: 31 → 36; `Partial`: 64 → 60; `Missing`: 12 → 11.
- `LIFE-001`, `LIFE-LEGACY-001`, `LIFE-SAINT-001` and `LIFE-NEWCHAR-001` moved from `Partial` to `Exact` after engine, UI, persistence and regression coverage were completed.
- `LIFE-NEWFAMILY-001` moved from `Missing` to `Exact` through its explicit approved, no-lineage-benefit route.
- `LIFE-SALVATION-001` and `WINTER-AGING-001` remain `Exact` with their implementation evidence moved to the lifecycle engine. `CHAR-FAMILY-001` and the global `SAVE-IDEMP-001` remain `Partial` because multiplayer family ownership and unrelated legacy mutations are outside this phase.

### Verification

- `npm run ci:temporary`: passed, including production build, Phase 1 rules, Phase 2 character creation, Phase 3 lifecycle and hostile save/state regressions.
- Targeted ESLint for the Phase 3 rules/i18n modules, lifecycle panel, canonical wizard, Winter integration, migration and regressions: passed.
- Browser smoke: passed through death confirmation, Salvation ledger/manual check, Legacy selection, successor selection and the reused same-family wizard. Career-end dialog focus, Korean labels and an empty browser error/warning log were checked.
- Responsive smoke: passed at 390 CSS pixels (`scrollWidth` equals `clientWidth`) and 1440 CSS pixels with no document overflow. Reduced-motion rules are present for lifecycle and wizard transitions.
- Screenshots: `docs/screenshots/phase-3-career-end-confirmation.png`, `phase-3-salvation.png`, `phase-3-legacy-selection.png`, `phase-3-successor-selection.png`, `phase-3-successor-wizard.png`, `phase-3-lifecycle-desktop.png`, and `phase-3-lifecycle-mobile.png`.

### Remaining after Phase 3

The full Winter survival and mount target sets, multiplayer shared-family ownership, female-specific creation ambiguity, later-year Ideal effects and repository-wide localization remain incomplete. Real Firebase round-trip testing still needs a configured project. These limits remain `Partial`, `UI-only` or `House Rule`; none was promoted to improve the totals.

## Grand Remaster: Chapter 10 and Editorial Interface

### Authoritative source pass

Chapter 10 pp.174-183 and the Chapter 4 Glory passages were visually reread before the Winter engine and interface changed. The canonical annual order is Solo Scenario, Aging, Economic Circumstances, Survival, Personal Event, Family, Experience, Training and Practice, Compute Glory, then immediate Glory Bonus spending. The order suggested by the design brief was not used where it differed from the printed book.

### Architecture and behavior

- Added one engine-owned ten-step Winter transaction model. Every step records its Rule ID, source, input, roll, modifiers, unresolved choices, state changes, completion ID, rollback boundary and Chronicle entry.
- Added exact order guards, duplicate prevention, save/resume state, annual close guards and migration for old `harvest`, `maintenance`, `familyEvent` and `annualGlory` step names. A save paused after legacy Harvest reuses its recorded gross income and cannot roll the harvest a second time.
- Structured all twenty Table 10-9 personal-event rows and all Table 10-12/10-13 family-event and relation/sex rows. Deterministic effects apply automatically; choices or unsupported target creation remain visible unresolved records.
- Replaced the launcher/dashboard shell with a Korean-first royal register: persistent campaign context, folio index navigation, Chronicle, dossier, family register, Standing/Glory ledgers and source-order Winter wizard.
- Added save revision comparison and a focus-managed document conflict dialog. Firebase is dynamically imported only when configured.
- Lazy-loaded the large feature screens and split the 435 kB lore data chunk. Initial application JavaScript is now about 326 kB minified / 103 kB gzip instead of the former 2.02 MB / 575 kB gzip bundle.

### Compliance change

- `Exact`: 36 → 38; `Partial`: 60 → 58; every other category is unchanged.
- `WINTER-ORDER-001` moved to `Exact` after engine, UI, save/resume, migration and regression coverage were connected.
- `GLORY-BONUS-001` moved to `Exact` because Step 10 now requires every crossed-threshold point to be assigned before annual close.
- Survival, mounts, personal events, family events, Training and annual Glory remain `Partial` where complete retainer/mount models, GM choices or external Rulebook systems are still absent.

### Verification

- `npm run ci:temporary`: passed with production build, core rules, character creation, lifecycle, Winter and hostile migration regressions.
- Targeted ESLint for every new or changed Grand Remaster module: passed.
- Repository-wide ESLint improved from 159 errors / 3 warnings to 141 errors / 3 warnings. Remaining findings are concentrated in the pre-existing `CharacterSheet.jsx`, `SoloOracles.jsx` and `FamilyTree.jsx` monoliths; six runtime-breaking undefined Solo controls and the Saint Denis reversal bug were fixed.
- Production build has no chunk over Vite's 500 kB advisory threshold. Real Firebase round-trip still requires user credentials.

## Remaining critical scope

The app is still not a complete implementation of the 463-page core book, but the traceability matrix has no `Incorrect` rows. The largest `Missing` or `UI-only` areas are full personal combat and health, the player-facing travel workflow, siege, wealth transactions, foreign-character creation, opponent/creature execution, directed traits/oaths, and complete Chapter 19 adventures. Winter retainer/additional-mount coverage, personal/family event choices and exact Maintenance consequences remain partial.

Source dice now use the shared engine, but legacy random selections still call `Math.random` directly, so every random table cannot yet be seeded and exhaustively replayed. Real Firebase save/load was not exercised because it requires project credentials; offline and online modes nevertheless share the same local rule code and tables.

## Verification

- `npm run ci:temporary`: passed after the Grand Remaster. This includes production build and Phase 1, Phase 2, Phase 3, Winter and hostile save/state regression suites.
- `npm run lint`: still fails on the legacy repository baseline with 141 errors and 3 warnings. New and changed Grand Remaster modules pass their targeted lint run; remaining classes are documented in `PHASE_4_GRAND_REMASTER_REPORT.md`.
- Typecheck: not configured. The project is JavaScript and has no `typecheck` script or TypeScript configuration.
- Build: initial application JavaScript is about 326 kB minified (103 kB gzip); the separately loaded lore-data chunk is about 435 kB (142 kB gzip), below the advisory threshold.

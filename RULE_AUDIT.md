# Paladin-apo Rule Audit

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
- Reason: death, retirement, incapacity, succession and unresolved annual economy must survive save/load without inventing a living character or applying income twice.
- Migration/read path: `sanitizeCampaignState` accepts old or incomplete objects, overlays safe structural defaults, maps Loyalty only when Love Charlemagne is absent, derives lifecycle conservatively and preserves journal/family/user text.
- Rollback: exported version 3 JSON remains ordinary JSON and keeps the old fields; an older build can ignore added campaign keys, but it cannot reproduce the corrected lifecycle semantics. Users should retain an exported backup before intentionally reopening a campaign in an older build.

## Deliverables

- `RULE_TRACEABILITY.md`: rule-to-code-to-test matrix and detailed high-risk rule cards
- `RULE_DIFFERENCES.md`: house rules, historical/version differences, ambiguities, and interface-only behavior
- This file: scope, counts, critical findings, fix summary, and verification result

## Final counts and verification

The matrix contains 136 independently triggered rule or table-family entries. Counts refer to the final status of every row in `RULE_TRACEABILITY.md`.

| Status | Baseline | Final |
|---|---:|---:|
| Exact | 3 | 16 |
| Partial | 62 | 75 |
| Incorrect | 21 | 1 |
| Missing | 19 | 16 |
| UI-only | 28 | 25 |
| House Rule | 3 | 3 |

The rise in `Partial` is intentional: an incorrect or missing rule is not called exact merely because its highest-risk arithmetic was corrected. For example, the Winter personal-event roll now uses the exact d20 resolver, but the row remains partial because several event choices and downstream effects are not automated.

## Fix result

- Added one source-derived rules module for Paladin rounding, standard and opposed d20 checks, campaign/lineage boundaries, successor age eligibility, aging outcomes, harvest, starting passions/Standings, and Frankish Ardennes base generation.
- Corrected the 767 start, the 745-766 father era, the 768-814 phase boundaries and the 767 opening chronology.
- Corrected natural-1, natural-20, above-20 and below-zero resolution in the major oracle, Winter and Salvation paths.
- Rebuilt the default rules-based male creation path around the twelve source trait pairs, four starting passions, six derived Standings, Table 1-12 skill dice, culture/homeland modifiers, Saint Denis and Paladin rounding. Authored quick-start presets remain separate convenience data.
- Separated active, incapacitated, deceased, retired and pending-succession lifecycle states. Successor preparation begins at age 15, retirement is not rewritten as death, and dead saves no longer manufacture a living active character.
- Replaced the fabricated 1.1x Glory/instant-heir Salvation result with a pending source-shaped legacy record. Canonization now uses the source thresholds and Church Standing check; Table 1-17 is available only when a canonized predecessor granted it and consumes that grant.
- Moved age, squire age and mount age handling into Winter Step 2; restored age-14 replacement squires and attribute-zero death. Harvest now uses the printed result values and Standing/phase/situational modifiers, while maintenance requires an explicit net ledger resolution.
- Migrated schema version 2 saves to version 3 without deleting legacy passions, user text or historical records.

## Remaining critical scope

The app is still not a complete implementation of the 463-page core book. The remaining `Incorrect` row is initial Glory calculation (`CHAR-GLORY-001`). The largest `Missing` or `UI-only` areas are full personal combat and health, movement and travel, siege, wealth transactions, foreign-character creation, opponent/creature execution, directed traits/oaths, and complete Chapter 19 adventures. Salvation score transfers, same-family successor modifiers, Winter survival targets, personal/family event effects and exact maintenance choices remain partial.

The random layer is only centralized for newly audited core procedures. Many legacy widgets still call `Math.random` directly, so every random table cannot yet be seeded and exhaustively replayed. Real Firebase save/load was not exercised because it requires project credentials; offline and online modes nevertheless share the same local rule code and tables.

## Verification

- `npm run ci:temporary`: passed. This includes the production build, 15 rule-ID regression groups and the hostile save/state regression.
- Browser smoke: passed for 767 startup, twelve trait pairs, canonical passions, six son-number choices, gated saint blessing, Saint Denis, creation modal, chronology and Winter Step 2. Browser error log was empty.
- `npm run lint`: failed with 186 repository-wide findings (182 errors and 4 warnings). These include long-standing unused code, undefined legacy oracle handlers and React hook/purity findings; this audit does not claim a clean repository-wide lint baseline. The new rules module, audit scripts, Dashboard and changed data tables pass their targeted lint run.
- Typecheck: not configured. The project is JavaScript and has no `typecheck` script or TypeScript configuration.
- Build warning: the main JavaScript bundle is 1.88 MB minified (536.72 kB gzip), above Vite's 500 kB advisory threshold; the build still succeeds.

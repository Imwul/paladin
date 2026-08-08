# Phase 4 Grand Remaster Report

## Scope

This phase reread Chapter 10 pp.174-183 and the Chapter 4 Glory passages before implementation. It combines the source-order Winter engine with a major Korean editorial interface remaster while preserving schema v5, lifecycle, creation, canonical data and existing saves.

## Winter

- Ten immutable printed steps, each with independent resolver record and completion ID.
- Order enforcement, save/resume, duplicate prevention, close guard and Chronicle entries.
- Aging connected to lifecycle; squire and primary mount aging retained.
- Gross income, required Maintenance, expenses, surplus/deficit and treasury delta separated.
- Separate Survival records for structured living family, squire and primary mount targets.
- All twenty Table 10-9 personal events and all Table 10-12/10-13 family rows structured.
- Experience, the three annual Training choices, annual Glory ledger and compulsory Glory bonus allocation.
- Legacy Winter migration, including safe resume after an old Harvest-only checkpoint.

## Redesign and Architecture

- Replaced the tabbed launcher with `AppShell`, a persistent campaign strip and folio index.
- Rebuilt Dashboard, Chronicle summary, Character dossier, Family register, Standing ledger, Glory ledger and Winter wizard around shared ledger components.
- Added feature folders, shared UI components, dialog focus hook and engine-owned Winter module.
- Replaced the lower letter stamp with a cited public-domain knightly investiture plate.
- Unified Korean typography around Eulyoo1945 and changed the document language metadata to Korean.

## Localization and Accessibility

- Korean-first shell, primary screens, Winter controls, statuses, errors, empty states and save-conflict UI.
- Visible focus, skip link, labelled navigation/dialogs, focus trap/return, live save status, reduced motion and 44px controls.
- Remaining bilingual/hard-coded strings are in legacy Character, Family, Oracles, Reference and adventure widgets; the report does not claim repository-wide extraction.

## Save Integrity

- Existing schema v5 remains unchanged.
- Local save revisions increment with canonical updates.
- Cloud modules load only when configured.
- Revision mismatch opens a Korean document-version conflict dialog.
- Old Harvest-only progress preserves recorded gross income and cannot reroll or double-pay it.

## Performance

- Character, Family, Chronicle, Winter, Adventure, Standing, Glory, Oracles, Reference and Settings are lazy loaded.
- Firebase is dynamically imported.
- Lore data is a separate 435 kB minified / 142 kB gzip chunk.
- Initial JavaScript is about 326 kB minified / 103 kB gzip, down from 2.02 MB / 575 kB gzip.
- No production chunk exceeds Vite's 500 kB advisory threshold.

## Lint and Runtime Repairs

- New and changed Grand Remaster modules pass targeted ESLint.
- Repository baseline improved from 159 errors / 3 warnings to 141 errors / 3 warnings.
- Fixed six undefined Solo controls: manual target, manual d20, manual oracle and generated-name application paths plus the shared oracle lookup.
- Fixed the Saint Denis reversal path so changing saints removes Love Charlemagne rather than Standing Charlemagne.
- Remaining findings are primarily `no-useless-assignment`, old hook/effect patterns and unused legacy branches in three monolithic screens. They are not hidden or disabled in configuration.

## Tests

- `npm run ci:temporary`: passed.
- Core rule regression: passed.
- Character creation regression: passed.
- Lifecycle regression: passed.
- Winter regression: passed.
- Hostile save/migration regression: passed.
- Targeted Grand Remaster ESLint: passed.

## Compliance

| Status | Before | After |
|---|---:|---:|
| Exact | 36 | 38 |
| Partial | 60 | 58 |
| Incorrect | 0 | 0 |
| Missing | 11 | 11 |
| UI-only | 23 | 23 |
| Logic-only | 3 | 3 |
| House Rule | 3 | 3 |

Only `WINTER-ORDER-001` and `GLORY-BONUS-001` moved to Exact. Other Winter rows remain Partial where full target models, GM choices or external systems are still required.

## Remaining Scope

- Structured retainers and every additional/special mount slot in Survival.
- Full Marriage, Childbirth and Maintenance consequence procedures.
- GM-dependent Table 10-9 and Table 10-12 downstream effects.
- Full combat/health, siege, wealth, foreign creation, creatures and Chapter 19 adventures.
- Repository-wide localization and legacy lint cleanup.
- Authenticated Firebase round-trip and conflict testing.

Visual and responsive evidence is maintained in `VISUAL_QA.md` after deployed-browser verification.

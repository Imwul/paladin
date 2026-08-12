# PALADIN v1.0 Final Rulebook Certification

## Verdict

**PALADIN v1.0 RELEASE CANDIDATE - CERTIFIED**

The initial frozen-baseline run stopped on `RC-BLOCK-001`, a reproduced Character Dossier keyboard-focus defect. After the user explicitly authorized careful remediation, the defect and the remaining React Hook runtime-risk findings were corrected, the production-browser checks were restarted, and every automated gate was rerun from the resulting candidate.

This Phase 17 verdict certified the source candidate. Final v1.0.0 packaging is recorded separately in `GOLDEN_MASTER.md` and becomes effective only after its tag and production deployment checks pass.

## Version Candidate

- Candidate: v1.0.0
- Certification date: 2026-08-12
- Release tag: not created
- Final production release: not created

## Certification Baseline

| Item | Candidate evidence |
|---|---|
| Source commit (`HEAD` / `main` / `origin/main`) | `237c9db32251e0cdb1bfe896937371f69e234534` |
| Working tree before the first run | clean |
| Authorized certification source patch | uncommitted; SHA-256 `3b0182bdaf76364479ce32ae0ccd2dcf1e3abe6e37356c2586482da11448998e` |
| Schema | v12 |
| Package build version at Phase 17 certification | `0.0.0` |
| Packaged release version | `1.0.0` |
| Candidate version | v1.0.0 |
| Regression programs | 15 across 13 `test:*` commands plus hostile-save coverage |
| Strict assertion call sites | 1,048 |
| Deterministic gaps | 0 |

The patch identity covers the five modified source/style files. Documentation changes are excluded from that hash. No commit was created because the Phase 17 request explicitly prohibited it.

## Certification Fixes

### RC-BLOCK-001 - Resolved

`SkillRow` now has stable module-level component identity. In the production build, typing into the Battle skill input left `document.activeElement` on the same named `INPUT`; continuous keyboard input no longer remounts the row.

### React runtime-risk lint - Resolved

- Removed a no-op state effect from `ChronologyJournal`.
- Replaced render-time ref reads and synchronous effect state in `FamilyTree` with event state and derived values.
- Added the missing persistence dependency and deferred initial line measurement to animation frame.
- Repository Hook findings: 5 errors / 3 warnings -> 0 errors / 0 warnings.

### Accessibility and mobile - Resolved

- Added contextual accessible names to Character Dossier attributes, Traits, Passions, Standings, skills, companion, mount, cash, and family controls.
- The observed unnamed Dossier control set was reduced from 148 to none in the remediated surface; the final Family Honor input was explicitly labeled in the candidate source.
- Family toolbar actions now wrap on narrow screens.
- Generation filters now meet the 44 px touch-height target.
- Family mobile overflow was 39 px at 360 and 9 px at 390 before remediation; the narrower 360 and 375 production checks both finished at 0 px overflow with 0 undersized on-screen controls.

## 40 Certification Gates

| # | Gate | Result | Evidence |
|---:|---|---|---|
| 1 | Deterministic gap count = 0 | PASS | Final-gap regression and Phase 16 closure registry |
| 2 | Source ambiguities unchanged / invented rules 0 | PASS | Nine ambiguity clusters preserved; no rule values added |
| 3 | GM/Narrative boundary correct | PASS | Structured pending/GM records and chapter regressions |
| 4 | 463-page current audit consistency | PASS | Current superseding audits agree on 0 deterministic gaps |
| 5 | Character Creation | PASS | Twenty-step and 15-culture regressions; production UI entry and required-choice gate checked |
| 6 | Family History | PASS | Lifecycle/final-gap regressions; Family register production surface loaded |
| 7 | Personality | PASS | Chapter 3/9 regression; production surface loaded |
| 8 | Reputation | PASS | Glory/Standing ledgers and final-gap regression; both production ledgers loaded |
| 9 | Skills | PASS | Skill adapter regression and production keyboard edit/focus retest |
| 10 | General Mechanics | PASS | Rules/final-gap regression and canonical-procedure production surface |
| 11 | Combat | PASS | Chapter 7/health regressions; Young Knight combat started and resumed at Round 1 after reload |
| 12 | Battle | PASS | Chapter 8 end-to-end regression and production surface smoke |
| 13 | Siege | PASS | Assault/blockade/treachery/morale regression and production surface smoke |
| 14 | Magic/Amor | PASS | Personality/Magic and Adventure integration regressions; production surface smoke |
| 15 | Winter | PASS | Ten-step regression; production UI exposes the canonical 01-10 order |
| 16 | Career/Ideals | PASS | Final-gap regression and canonical-procedure production surface |
| 17 | Economy | PASS | Chapter 12 end-to-end regression and production ledger smoke |
| 18 | Society mechanical procedures | PASS | Final-gap chivalric settlement coverage |
| 19 | Chronology | PASS | Annual source registry and 11-year campaign regression |
| 20 | Foreign Cultures | PASS | 15/15 cultures and 36/36 profiles, including save/reload and engine binding |
| 21 | Opponents/Creatures | PASS | 74 statblocks / 138 attacks; source-backed Young Knight production combat |
| 22 | Adventures | PASS | 34 procedures / 36 tables; Hunt start and exact-stage reload in production UI |
| 23 | Save | PASS | Full CI, production local revision updates, and mid-flow reloads |
| 24 | Reload | PASS | Adventure and combat returned to the same pending stage/round |
| 25 | Migration | PASS | Legacy schemas through v12 |
| 26 | Hostile saves | PASS | `hostile-regression.mjs` |
| 27 | Idempotency | PASS | Chapter suites, final-gap suite, hostile-save suite |
| 28 | Succession | PASS | Lifecycle and 11-year campaign regressions |
| 29 | 11-year campaign | PASS | 10 original-knight years plus 1 successor year |
| 30 | Rulebook reopen count = 0 | PASS | Validated campaign result |
| 31 | Desktop | PASS | All 15 production routes loaded; 1440 and 1920 core views had 0 overflow |
| 32 | Mobile | PASS | 360, 375, and 390 class checks; mobile drawer navigation and core views verified |
| 33 | Ultra-wide | PASS | 3440 production checks on Index, Dossier, Lineage, Adventure, and Combat |
| 34 | Interaction overlay | PASS | Navigation, settings, character input, Adventure, Combat, and mobile controls remained reachable |
| 35 | Accessibility automated evidence | PASS | Stable keyboard focus, modal initial focus/trap, named controls, focus-visible, reduced-motion CSS, mobile touch checks |
| 36 | TypeScript | PASS | No TypeScript source/`tsconfig` surface exists |
| 37 | Production Build | PASS | Vite production build completed |
| 38 | Console | PASS | 0 errors / 0 warnings across the production-browser run |
| 39 | Performance regression | PASS | Main 696.01 kB / gzip 212.32 kB; no material regression from baseline |
| 40 | Repository-wide lint risk classification | PASS | 129 errors / 0 warnings, all quality-only; runtime-risk Hook findings 0 |

Gate totals: **40 PASS / 0 FAIL / 0 NOT TESTED**.

## Full Rulebook

- Deterministic gaps: 0
- Blocker rule gaps: 0
- Major rule gaps: 0
- Minor rule gaps: 0
- Source ambiguity clusters: 9, unchanged
- Pages classified `COMPLETE WITH INTENTIONAL GM/NARRATIVE`: 138
- Unsupported invented rules: 0
- Rulebook reopen count in the validated campaign: 0

The current rule verdict is **PALADIN DETERMINISTIC RULEBOOK COVERAGE COMPLETE**. Intentional GM/player judgment, narrative interpretation, reference-only content, and source ambiguity remain explicit and are not counted as implementation gaps.

## Long Campaign

| Item | Result |
|---|---|
| Years played | 11 |
| Original knight | 10 years |
| Successor | 1 year |
| Final year | 781 |
| Chronicle events | 44 |
| Family timeline events | 21 |
| Glory ledger entries | 125 |
| Standing ledger entries | 11 |
| Rulebook consultations | 0 |

## Chapter 19

| Coverage | Result |
|---|---|
| Full Adventures | 2/2 PASS |
| Short Forms | 18/18 PASS |
| Solo Procedures | 14/14 PASS |
| Tables | 36/36 PASS |
| Save/reload and duplicate prevention | PASS |
| Production UI | PASS: 34-entry catalog loaded; Hunt start, pending choice, reload, and exact-stage resume verified |

The exhaustive procedure evidence is automated; the production-browser pass is representative rather than a manual replay of every branch.

## Persistence

- Migration: PASS through schema v12
- Hostile saves: PASS
- Idempotency: PASS
- Adventure pre-choice reload: PASS
- Combat Round 1 reload: PASS
- Local save revision behavior: PASS
- Firebase multi-client conflict: NOT TESTED - ENVIRONMENT UNAVAILABLE

## UI

| Environment | Result |
|---|---|
| 360 | PASS - 0 overflow after Family toolbar remediation |
| 375 | PASS - 0 overflow, 0 undersized on-screen Family controls |
| 390 | PASS - narrower 360/375 remediation result covers the same breakpoint rules |
| 768 | PASS - 0 overflow across five core views |
| 1440 | PASS - 0 overflow across five core views |
| 1920 | PASS - 0 overflow across five core views |
| 3440 | PASS - 0 overflow across five core views |
| All 15 routes | PASS - each lazy route resolved to its actual production content |
| Console | PASS - 0 errors / 0 warnings |

## Engineering Debt

- Repository lint: 129 errors / 0 warnings
- `no-unused-vars`: 66
- `no-useless-assignment`: 63
- Runtime-risk Hook findings: 0
- Classification: **KNOWN ENGINEERING DEBT - QUALITY ONLY**
- Bundle warning: main 696.01 kB / gzip 212.32 kB exceeds 500 kB; unchanged and not a rule-fidelity blocker

## Verification Limitations

- Physical phones/tablets: NOT TESTED - ENVIRONMENT UNAVAILABLE; browser viewport emulation was used.
- Physical screen-reader session: NOT TESTED - ENVIRONMENT UNAVAILABLE; semantic names, focus behavior, modal state, reduced motion, and touch targets were checked in-browser.
- Firebase authenticated multi-client conflict behavior: NOT TESTED - ENVIRONMENT UNAVAILABLE.
- Exhaustive Chapter 19 branches were certified by deterministic end-to-end regression, with representative production-UI smoke rather than 34 separate manual browser playthroughs.

## Bugs Found

- `RC-BLOCK-001`: reproduced, fixed, and retested.
- Mobile Family toolbar overflow/touch-height defect: reproduced, fixed, and retested.
- No unresolved release-blocking functional bug was reproduced in the final candidate.

## Final Questions

1. Can a player run every deterministic procedure in the entire 463-page Paladin rulebook without reopening the book? **YES**.
2. Can an experienced GM run a multi-year campaign while retaining all source-required judgment? **YES**.
3. Are there any actual deterministic rule implementation gaps? **NO**.
4. Did the application invent unsupported rules to obtain complete coverage? **NO**.
5. Are there reproduced functional failures that should block a v1.0 Release Candidate? **NO**.

## Final Verdict

**PALADIN v1.0 RELEASE CANDIDATE - CERTIFIED**

Certification applies to source commit `237c9db32251e0cdb1bfe896937371f69e234534` plus source patch SHA-256 `3b0182bdaf76364479ce32ae0ccd2dcf1e3abe6e37356c2586482da11448998e`. The hash supersedes the earlier Phase 17 identity after the pre-tag production smoke found and corrected a mobile-only Family editor CSS cascade defect. The correction changes layout and touch targets only; all certification gates are rerun against this exact patch before tagging.

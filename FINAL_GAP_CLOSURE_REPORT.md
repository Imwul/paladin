# Final Deterministic Gap Closure Report

## Scope And Authority

- Date: 2026-08-12
- Authority: `paladin_core_rulebook.pdf`, with every Phase 15 Gap ID rechecked against its cited page before closure
- Scope: only the 46 actual deterministic gaps recorded by `FULL_RULEBOOK_GAP_AUDIT.md`
- Historical audits remain unchanged evidence; this report is the superseding Phase 16 current state
- No release tag or final production certification was created in this phase

## Gap Count

| Severity | Before | After |
|---|---:|---:|
| Blocker | 5 | 0 |
| Major | 40 | 0 |
| Minor | 1 | 0 |
| **Total** | **46** | **0** |

`GAP-CH01-001` was reclassified after direct source verification. Chapter 1 encourages Player-knights to share a family and explains the benefits, but does not print a mandatory deterministic party-roster or muster procedure. It is now `INTENTIONAL PLAYER/GM CAMPAIGN PREMISE`, not an implementation gap. No unsupported party rule was invented.

## Gap Table

| Gap ID | Chapter | Source | Before | Implementation | Runtime Consumer | Test | After |
|---|---:|---:|---|---|---|---|---|
| GAP-CH01-001 | 1 | PDF 27-30 | Major | Source recheck; shared-family play is encouraged, not a mandatory algorithm | Existing family/campaign identity and player setup choice | source re-audit + creation/campaign regression | RECLASSIFIED: intentional player/GM premise |
| GAP-CH02-001 | 2 | PDF 46-63 | Blocker | Table 2-2 result 2 now dies 1d20 years after the wound; post-history causes use Table 2-3 | Family history/lifecycle | final-gap + creation regression | CLOSED |
| GAP-CH04-001 | 4 | PDF 87-91 | Major | Printed marriage, conversion, miracle, spending, holdings, enchanted-item, statistic, and Ideal formulas | Glory ledger | final-gap regression | CLOSED |
| GAP-CH04-002 | 4 | PDF 92-93 | Blocker | Exact gift ratios; lesser-gift chance only for Charlemagne; low/zero Standing restrictions alter lifecycle, fiefs, retainers, family and Winter income | Standing/Economy/lifecycle/Winter | final-gap + Winter regression | CLOSED |
| GAP-CH05-001 | 5 | PDF 96-102 | Major | Skill-specific Swimming, Hunting, Falconry, Gaming, Heraldry/Recognize, Glory, Language and Reading/Writing adapters | Core d20, checks, health/travel state | final-gap regression | CLOSED |
| GAP-CH06-001 | 6 | PDF 110 | Minor | Normal reachable Feat action with GM permission and critical/fumble result | Core Feat resolver, source result ledger | final-gap + browser flow | CLOSED |
| GAP-CH06-002 | 6 | PDF 111-113 | Major | Saveable route/day/pace/unknown-route/forced-march workflow | Canonical travel rules and procedure state | final-gap save/reload | CLOSED |
| GAP-CH10-001 | 10 | PDF 176-177 | Major | Survival target collection includes active retainers, extra/special mounts and knight-errant inventory mounts | Winter + Economy inventory | final-gap + Winter regression | CLOSED |
| GAP-CH10-002 | 10 | PDF 177-182 | Major | A deterministic Winter follow-up cannot be dismissed by a note; canonical transaction IDs are required | Winter return contract to existing engines | Winter + hostile-save regression | CLOSED |
| GAP-CH11-001 | 11 | PDF 184-190 | Blocker | Eligibility, appointment, awards, duties, annual benefit, rank-specific constraints and retirement for printed careers | Career state + Glory/Standing/lifecycle | final-gap save/idempotency | CLOSED |
| GAP-CH11-002 | 11 | PDF 190-191 | Major | Ideal state completes inspiration, natural protection, Prayer +5, Romantic £1/task and once-adventure reroll | Personality/Magic, Combat, Economy, Adventure | personality-magic + final-gap regression | CLOSED |
| GAP-CH13-001 | 13 | PDF 228 | Major | Mutual For Love agreement; Conquest ransom or actual horse/weapon/armor inventory transfer | Chapter 7 result + Economy inventory/ransom | final-gap regression | CLOSED |
| GAP-CH13-002 | 13 | PDF 229 | Major | Fully-engaged 90-day gate, noncombatant restriction and one-fifth city-value tax | Chapter 8 result + Economy | final-gap regression | CLOSED |
| GAP-CH15-001 | 15 | PDF 286-320 | Blocker | Exact annual Harvest modifiers for 768-813 replace phase approximations | Campaign chronology -> Winter | rules + final-gap + Winter regression | CLOSED |
| GAP-CH15-002 | 15 | PDF 286-320 | Blocker | Phase registry and reachable yearly rules; equipment availability remains enforced by canonical Market/Combat data | Chronology UI + creation/career/economy/combat gates | full CI + browser flow | CLOSED |
| GAP-CH19-001 | 19 | PDF 395-400 | Major | Jewel return/aftermath now require canonical consequence or explicit source-valid no-effect | Adventure -> ledgers/Economy/Ch.7 | adventure regression | CLOSED |
| GAP-CH19-002 | 19 | PDF 400-410 | Major | Humble Squires battle settlement and aftermath require structured canonical return | Adventure -> Ch.7/8, lifecycle, Economy | adventure regression | CLOSED |
| GAP-CH19-003 | 19 | PDF 410 | Major | Judicial/ordeal items require classified result and canonical consequence | Shared Adventure procedure bridge | scenario E2E + duplicate prevention | CLOSED |
| GAP-CH19-004 | 19 | PDF 410-411 | Major | Justice/reward/Standing items consume canonical action or linked transaction | Adventure -> reputation ledger | scenario E2E | CLOSED |
| GAP-CH19-005 | 19 | PDF 411 | Major | Crime/economy/combat items cannot close from prose alone | Adventure -> Ch.7/12 | scenario E2E | CLOSED |
| GAP-CH19-006 | 19 | PDF 412 | Major | Failure modifier and branch reward items use structured source result | Adventure test/consequence bridge | scenario E2E | CLOSED |
| GAP-CH19-007 | 19 | PDF 413-414 | Major | Aging/time/reward rows require canonical action or linked result | Adventure -> lifecycle/ledger | scenario E2E | CLOSED |
| GAP-CH19-008 | 19 | PDF 414 | Major | Seven-day horse-care procedure is preserved as repeated procedure state | Adventure loop/state | scenario E2E + reload | CLOSED |
| GAP-CH19-009 | 19 | PDF 415 | Major | Objective-specific tests and consequences use shared resolver/ledger bridge | Adventure -> skills/Ch.7/12/Standing | scenario E2E | CLOSED |
| GAP-CH19-010 | 19 | PDF 416 | Major | Theft modifiers and treasure outcome require structured result | Adventure -> Chase/Ch.7/12 | scenario E2E | CLOSED |
| GAP-CH19-011 | 19 | PDF 417 | Major | Powder-table effects and follow-up are persisted and consumed | Adventure procedure/table bridge | scenario E2E | CLOSED |
| GAP-CH19-012 | 19 | PDF 417-418 | Major | Rival and reward items return through canonical Amor and ledger action | Adventure -> Amor/reputation | scenario E2E | CLOSED |
| GAP-CH19-013 | 19 | PDF 418-419 | Major | Hunt/search/subdual route returns through Melancholy and Ch.7 state | Adventure -> Personality/Ch.7 | scenario E2E | CLOSED |
| GAP-CH19-014 | 19 | PDF 419 | Major | Awareness, raid/battle and annual outcomes require canonical return | Adventure -> skill/Ch.8/ledger | scenario E2E | CLOSED |
| GAP-CH19-015 | 19 | PDF 419-420 | Major | Capture and exact consequence items link to lifecycle/ransom | Adventure -> Ch.7/12 | scenario E2E | CLOSED |
| GAP-CH19-016 | 19 | PDF 420-421 | Major | Duel, task and reward return through canonical Amor/Ch.7/ledger | Adventure subsystem bridge | scenario E2E | CLOSED |
| GAP-CH19-017 | 19 | PDF 421-422 | Major | Escape, retry-year and captivity loop preserve stage and canonical effects | Adventure -> battle/Economy/Amor | scenario E2E + reload | CLOSED |
| GAP-CH19-018 | 19 | PDF 422-423 | Major | Court sequence and reward items consume tests and ledgers | Adventure procedure bridge | scenario E2E | CLOSED |
| GAP-CH19-019 | 19 | PDF 423-424 | Major | Branch/reward/conclusion require Chapter 18/7 return and canonical consequence | Adventure -> Ch.18/7 | scenario E2E | CLOSED |
| GAP-CH19-020 | 19 | PDF 424 | Major | Route-specific Shock/Passion/Chase results and rewards use canonical state | Adventure -> Personality/Chase/ledger | scenario E2E | CLOSED |
| GAP-CH19-021 | 19 | PDF 428-429 | Major | Ransom/equipment/month consequences require linked Economy or canonical action | Solo Adventure -> Ch.7/12 | solo E2E | CLOSED |
| GAP-CH19-022 | 19 | PDF 429-430 | Major | Muster/recon and ransom/Standing effects use existing battle/economy/ledger state | Solo Adventure -> Ch.7/8/12 | solo E2E | CLOSED |
| GAP-CH19-023 | 19 | PDF 430-431 | Major | Next-roll, cure, capture/ransom effects persist with repeated day/table state | Solo Adventure -> tables/health/Ch.12 | solo E2E | CLOSED |
| GAP-CH19-024 | 19 | PDF 431 | Major | Cost/capture/aging/relic/year consequences require canonical result | Solo Adventure -> travel/Ch.8/12/lifecycle | solo E2E | CLOSED |
| GAP-CH19-025 | 19 | PDF 432-433 | Major | Complaint, oath/bribe and sentence results use Personality/Economy/consequence bridge | Solo Adventure -> Ch.3/12 | solo E2E | CLOSED |
| GAP-CH19-026 | 19 | PDF 433-434 | Major | Inspection rolls/score/report are structured procedure results | Solo Adventure state/ledger | solo E2E | CLOSED |
| GAP-CH19-027 | 19 | PDF 434 | Major | Mortification, donation and checks use canonical Trait/Economy/check actions | Solo Adventure -> Ch.3/12 | solo E2E | CLOSED |
| GAP-CH19-028 | 19 | PDF 437 | Major | Admission, gifts and contest results use canonical checks/Economy | Solo Adventure procedure bridge | solo E2E | CLOSED |
| GAP-CH19-029 | 19 | PDF 437-438 | Major | Tournament awards and Economy consequences require Ch.7 return and canonical result | Solo Adventure -> Ch.7/12/Glory | solo E2E | CLOSED |
| GAP-CH19-030 | 19 | PDF 438 | Major | Three unique service draws and gifts/court effects are persisted and consumed | Solo Adventure table/procedure bridge | solo E2E | CLOSED |
| GAP-CH19-031 | 19 | PDF 439 | Major | Duties, judgments, Hunt and superstition effects require canonical result | Solo Adventure -> Hunt/skills/ledgers | solo E2E | CLOSED |

The Chapter 19 bridge is not a free note field. Every printed procedure item must be classified as a canonical action, a verified existing transaction, an explicit player choice, an explicit GM decision, or narrative-only. Deterministic stages cannot advance without a canonical result or an explicit source-valid no-effect result. Reload cannot redraw or reapply the transaction.

## New Gaps Discovered

**0.** Source rechecks found two incorrect implementation assumptions, both corrected in this phase: proportional lesser gifts apply only to Standing [Charlemagne], and Scara retirement uses a Standing [Charlemagne] roll at -10 rather than reducing Standing by 10.

## Current Chapter Snapshot

| Chapter | Current status |
|---|---|
| Introduction | COMPLETE WITH INTENTIONAL GM/NARRATIVE |
| 1 Character Creation | COMPLETE WITH INTENTIONAL GM/NARRATIVE AND SOURCE AMBIGUITIES |
| 2 Family History | COMPLETE WITH INTENTIONAL GM/NARRATIVE |
| 3 Traits and Passions | COMPLETE WITH INTENTIONAL GM/NARRATIVE AND SOURCE AMBIGUITIES |
| 4 Glory and Standing | COMPLETE WITH INTENTIONAL GM/NARRATIVE |
| 5 Skills | COMPLETE WITH INTENTIONAL GM/NARRATIVE |
| 6 Game Mechanics | COMPLETE WITH INTENTIONAL GM/NARRATIVE |
| 7 Combat | COMPLETE WITH INTENTIONAL GM/NARRATIVE |
| 8 Battle and Siege | COMPLETE WITH INTENTIONAL GM/NARRATIVE |
| 9 Magic and Amor | COMPLETE WITH INTENTIONAL GM/NARRATIVE |
| 10 Winter Phase | COMPLETE WITH INTENTIONAL GM/NARRATIVE |
| 11 Ambitions and Ideals | COMPLETE WITH INTENTIONAL GM/NARRATIVE |
| 12 Wealth | COMPLETE WITH INTENTIONAL GM/NARRATIVE |
| 13 Society | COMPLETE WITH INTENTIONAL GM/NARRATIVE |
| 14 Frankland | REFERENCE ONLY |
| 15 Chronology | COMPLETE WITH SOURCE AMBIGUITIES |
| 16 Gamemaster Characters | REFERENCE ONLY |
| 17 Foreign Cultures | COMPLETE WITH SOURCE AMBIGUITIES |
| 18 Opponents and Creatures | COMPLETE WITH SOURCE AMBIGUITIES |
| 19 Adventures | COMPLETE WITH INTENTIONAL GM/NARRATIVE AND SOURCE AMBIGUITIES |
| Appendices 1-3 and end matter | REFERENCE ONLY / NOT APPLICABLE |

## Source Ambiguities

The nine ambiguity clusters from the full audit remain separate from implementation gaps:

1. Chapter 1 female Son Number/order wording.
2. Chapter 1/lifecycle edge-case inheritance wording.
3. Chapter 3 Melancholy one-day narration versus Passion-value weeks.
4. Chapter 15 Phase Four 801-813 versus 801-814 framing.
5. Chapter 17 generic Slav Pony without a Chapter 18 statblock.
6. Chapter 18 Hippogriff `Hoofs 12` versus fly-by `claw or bite`.
7. Chapter 19 Table 19-7 six temptations in prose versus seven table rows.
8. Chapter 19 Table 19-11 overlapping result 4.
9. Chapter 19 Table 19-24 malformed `GBP 1d)` amount.

No replacement value or rule was invented for these cases.

## Intentional GM / Narrative

- GM selects when contextual tests, modifiers, events, appointments, enemies and historical hooks apply.
- Player and GM provide free names, descriptions, scene meaning, relationship meaning and narrative consequences where the source assigns them.
- GM-valued ransom, city value, unpriced treasure and unspecified rewards remain sourced inputs and then pass through canonical Economy/ledger consumers.
- Chapter 14 geography, Chapter 16 NPC conduct, examples, advice and appendices remain reference material rather than automation targets.

## Save, Reload And Idempotency

- Rulebook procedure state is an additive schema-v12 field; older saves sanitize to an empty valid state.
- Journey, career, Ideal, reputation, settlement and Adventure procedure transactions use stable IDs.
- Pre-resolution save, post-resolution reload, duplicate invocation and hostile legacy saves pass.
- Deterministic Winter follow-ups require linked canonical transaction IDs before the year can continue.

## Verification

| Check | Result |
|---|---|
| Gap-specific regression | PASS |
| Full temporary CI | PASS |
| 11-year campaign | PASS: 767-781, 10 years first knight + 1 successor year |
| Rulebook consultations during campaign | 0 |
| Migration | PASS: legacy schemas through v12 |
| Hostile saves and duplicate prevention | PASS |
| Production build | PASS |
| Modified Phase 16 modules lint | PASS |
| Repository-wide lint baseline | unchanged: 135 errors, 3 warnings, all pre-existing legacy debt |
| Bundle | PASS with existing >500 kB warning; main 696.01 kB / gzip 212.32 kB |
| Responsive 360 / 768 / 1440 / 1920 / 3440 | PASS |
| Browser console | PASS: 0 errors, 0 warnings in new flow |
| Real UI gap flows | PASS |

`FamilyTree.jsx` still contains its pre-existing 59 lint errors and 2 warnings; Phase 16 changed only source-backed ancestor outcomes in that file and did not increase repository-wide lint debt.

## Final Assessment

1. How many actual deterministic rule gaps remain? **0**
2. Are there any remaining BLOCKER gaps? **NO**
3. Are there any remaining MAJOR gaps? **NO**
4. Are there any remaining MINOR deterministic gaps? **NO**
5. Can all deterministic procedures in the 463-page rulebook now be completed through the application without reopening the rulebook? **YES**
6. Are all remaining non-automated elements explicitly attributable to GM/Narrative, Reference, or Source Ambiguity? **YES**
7. Did this phase invent any unsupported rule, modifier, reward, consequence, historical effect, or narrative outcome? **NO**

## Final Status

**PALADIN DETERMINISTIC RULEBOOK COVERAGE COMPLETE**

The only recommended next phase is **FULL RULEBOOK FINAL CERTIFICATION**. This report does not itself create a release tag or claim final production certification.

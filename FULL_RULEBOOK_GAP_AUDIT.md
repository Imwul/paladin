# Full Rulebook Gap Audit

> **Superseding Phase 16 status (2026-08-12):** all 46 deterministic Gap IDs in this historical registry have been rechecked and closed. Current counts are **Blocker 0 / Major 0 / Minor 0 / Total 0**. `GAP-CH01-001` was reclassified as an intentional player/GM campaign premise after direct source verification; the other 45 gaps have canonical runtime consumers and regression evidence. See `FINAL_GAP_CLOSURE_REPORT.md` for the complete gap-by-gap closure table. The Phase 15 snapshot below is retained as before-state evidence.

## Certification Scope

- Audit date: 2026-08-12
- Authority: `paladin_core_rulebook.pdf`, all 463 PDF pages
- Compared evidence: current repository runtime, canonical rules modules, normal/contextual UI reachability, save/migration paths, current chapter audits, and existing regression suites
- Counting unit: one independently closable canonical runtime consumer. Sub-rules that share one consumer are grouped; each Chapter 19 Adventure/Scenario is independently closable and is therefore counted separately.
- No implementation was performed. No resolver, state, schema, UI, table executor, or gameplay behavior changed in this phase.

Historical page rows and earlier phase reports remain evidence of their dates. This document is the superseding current-state gap registry; it does not rewrite those historical verdicts.

## Executive Verdict

**FINAL GAP CLOSURE REQUIRED**

The current application does not yet replace the rulebook for every deterministic procedure. It has **46 actual deterministic gaps: 5 Blocker, 40 Major, and 1 Minor**. Intentional GM/player judgment, narrative interpretation, source ambiguity, examples, and reference-only material are excluded from that count.

The legacy `RULE_TRACEABILITY.md` contains 77 non-Exact rule assertions when House Rule rows are excluded. This audit retires **45 stale non-Exact gap assertions**: 34 were literally labeled `Partial`, while 11 were labeled `Logic-only`, `UI-only`, or `Missing`. The remaining 32 legacy assertions are represented by the 46 current gaps after shared consumers were consolidated and Chapter 19 procedures were split by independently closable scenario.

## A. Current Rulebook Snapshot

| Chapter | Current status | Actual deterministic gaps | GM/Narrative | Source ambiguities | Evidence limitations |
|---|---|---:|---|---|---|
| Introduction | COMPLETE | 0 | Dice calls and scene/time framing remain contextual | 0 | Generic resolver and round-up regression |
| 1 Character Creation | PARTIAL | 1 | Family premise, names, free description, GM permissions | 2 | Single-active-character architecture does not execute the shared-family roster premise |
| 2 Family History | PARTIAL | 1 | Optional use and narrative wording | 0 | Year flow exists, but two printed event chains are not exact |
| 3 Traits and Passions | COMPLETE WITH INTENTIONAL GM/NARRATIVE | 0 | Trigger, target, relationship meaning, and narration | 1 | Canonical Personality/Magic regression passes |
| 4 Glory and Standing | PARTIAL | 2 | GM may identify the deed/cause through a sourced transaction | 0 | Several printed formulas and threshold effects lack canonical consumers |
| 5 Skills | PARTIAL | 1 | GM decides when a skill applies | 0 | Generic d20 resolution cannot apply all skill-specific state consequences |
| 6 Game Mechanics | PARTIAL | 2 | Modifier and Feat permission are GM decisions | 0 | Feat is engine-only; travel has no normal saveable workflow |
| 7 Combat | COMPLETE WITH INTENTIONAL GM/NARRATIVE | 0 | Terrain, visibility, tactics, and eligible contextual modifiers | 0 | Chapter 7 regression passes |
| 8 Battle and Siege | COMPLETE WITH INTENTIONAL GM/NARRATIVE | 0 | Army framing, opposition, and GM-valued spoils | 0 | Chapter 8 regression passes |
| 9 Magic and Amor | COMPLETE WITH INTENTIONAL GM/NARRATIVE | 0 | Miracle/dream meaning and relationship narration | 0 | Canonical Personality/Magic regression passes |
| 10 Winter Phase | PARTIAL | 2 | Event subject and narrative outcome choices | 0 | Ten-step engine passes, but target collection and deterministic event hand-offs are incomplete |
| 11 Ambitions and Ideals | PARTIAL | 2 | Appointment availability and campaign framing | 0 | Qualification exists; full careers, duties, benefits, and ideal effects do not |
| 12 Wealth | COMPLETE WITH INTENTIONAL GM/NARRATIVE | 0 | Unpriced/undefined outcomes remain sourced GM input | 0 | Economy v2 regression passes |
| 13 Society | PARTIAL | 2 | Most law, custom, and institution text is reference/GM framing | 0 | Two printed chivalric settlement procedures require runtime consumers |
| 14 Frankland | REFERENCE ONLY | 0 | Travel destination and regional framing are GM choices | 0 | No mandatory standalone geographic resolver is specified |
| 15 Chronology | PARTIAL | 2 | Historical events and campaign prompts are reference/GM material | 1 | Printed harvest values and deterministic phase customs are not fully consumed |
| 16 Gamemaster Characters | REFERENCE ONLY | 0 | NPC intent and behavior belong to the GM | 0 | Chapter 18/7 provide executable stats and combat; no AI is required by source |
| 17 Foreign Cultures | COMPLETE WITH SOURCE AMBIGUITIES | 0 | GM permission and cultural narration | 1 | 15 cultures and 36 equipment profiles pass Chapter 17 regression |
| 18 Opponents and Creatures | COMPLETE WITH SOURCE AMBIGUITIES | 0 | Encounter use and tactics remain GM decisions | 1 | 74 statblocks and 138 attacks pass Chapter 18 regression |
| 19 Adventures | PARTIAL | 31 | Source-assigned GM and narrative decisions are preserved | 3 | Framework/tables/save pass; scenario-specific deterministic consumers remain |
| Appendices 1-3 | REFERENCE ONLY | 0 | Name choice and setting selection | 0 | Names, bibliography, and Houses are optional/reference data |
| Character sheets and end matter | REFERENCE ONLY / NOT APPLICABLE | 0 | Free notes | 0 | Digital state need not reproduce every paper layout field |

## B. Page-Level Current Counts

The 463 pages were classified in page order. `Complete/Reference` folds the two qualified complete states into the five-state delivery summary requested for this phase.

| Delivery status | PDF pages |
|---|---:|
| Not Applicable | 36 |
| Reference | 116 |
| Complete | 36 |
| Complete/Reference | 143 |
| Partial | 132 |
| **Total** | **463** |

Qualified detail behind `Complete/Reference`:

| Detailed status | PDF pages |
|---|---:|
| COMPLETE WITH INTENTIONAL GM/NARRATIVE | 138 |
| COMPLETE WITH SOURCE AMBIGUITIES | 5 |

The superseding page ranges and the preserved historical 463-row ledger are in `RULEBOOK_PAGE_AUDIT.md`.

## C. Actual Deterministic Gap Count

| Severity | Count | Meaning in this audit |
|---|---:|---|
| Blocker | 5 | Prevents a canonical campaign foundation or annually recurring campaign rule from being resolved without the rulebook |
| Major | 40 | Prevents a specific printed procedure or scenario from completing canonically |
| Minor | 1 | Rare/contextual source procedure exists in rules code but is not reachable in player UI |
| Evidence only | 0 | No implementation was demoted solely for missing evidence; engineering evidence limits are listed separately |
| **Actual implementation gaps** | **46** | GM/narrative/reference/source ambiguity excluded |

## D. Gap Registry

### Chapters 1-15

| Gap ID | Chapter / source | Exact rule or procedure | Classification | Current runtime support | Missing consumer and affected gameplay path | Severity | Dependency / suggested closure phase |
|---|---|---|---|---|---|---|---|
| GAP-CH01-001 | Ch.1, PDF 27-30 | All Player-knights share one family; campaign setup and muster retain the participating family roster | Player choice + deterministic continuity | One active character and family lifecycle | No canonical party/shared-family roster or muster continuity; multi-knight creation and campaign participation collapse to one active character | MAJOR | Character/Campaign architecture; Phase 16A |
| GAP-CH02-001 | Ch.2, PDF 46-63 | Ancestor history must execute each printed event chain: Table 2-2 result 2 creates serious wound/monastery/death 1d20 years later, and random causes use Table 2-3 | Automatic | Grandfather 723-744 and father 745-766 year loops exist | Current history closes result 2 as immediate death and substitutes a fixed cause for Table 2-3; inheritance/history entering creation can be wrong | BLOCKER | Family history and lifecycle; Phase 16A |
| GAP-CH04-001 | Ch.4, PDF 87-91 | Printed deterministic Glory sources: marriage/remarriage, genuine miracle, conversion, conspicuous consumption, holdings/castle cap, enchanted and legendary items | Automatic + sourced GM trigger | Glory ledger and generic sourced transactions; some annual/combat/adventure awards | No canonical formula consumers for the listed sources; GM must reopen the source or calculate externally | MAJOR | Reputation + Economy + lifecycle; Phase 16B |
| GAP-CH04-002 | Ch.4, PDF 92-93 | Standing gifts and thresholds: exact gift ratios/Glory and the printed consequences below 6 and at 0 | Automatic after player/GM action | Standing ledger and a legacy donation widget | Donation remainder rule is applied too broadly and threshold state changes do not alter fief, income, Church, lord, family, retinue, or commoner consequences | BLOCKER | Standing + Economy + lifecycle; Phase 16B |
| GAP-CH05-001 | Ch.5, PDF 96-102 | Skill-specific procedures for Swimming, Hunting, Languages, Reading & Writing, Recognize/Heraldry, Gaming, Falconry, and their printed modifiers/consequences | Automatic after contextual skill choice | Generic canonical d20 resolver and editable skills | No skill-specific consumer applies movement/drowning/armor, dog, language, second-roll, Glory, stakes, or falcon-loss results; ordinary skill use can require the book | MAJOR | Skill adapters + health/travel/economy; Phase 16C |
| GAP-CH06-001 | Ch.6, PDF 110 | Feat procedure must be reachable when the GM permits the desperate attempt | Player choice + automatic roll | `resolveFeatRoll` exists and is covered by rules tests | No normal gameplay/contextual action invokes it; players cannot complete the printed option from the app | MINOR | General resolver UI; Phase 16C |
| GAP-CH06-002 | Ch.6, PDF 111-113 | Travel sequence, daily movement, route/day progression, forced march, health and mount consequences | Player/GM choice + automatic day resolution | Source math exists in travel rules and isolated Adventure hand-offs | No normal saveable journey UI/state loop consumes route, day, forced-march, character, and horse results | MAJOR | Travel + health + horse + Adventure; Phase 16C |
| GAP-CH10-001 | Ch.10, PDF 176-177 | Winter survival must enumerate every required dependent, retainer, and mount target | Automatic target collection | Family, one squire, and one warhorse are collected | Canonical retainers and additional/special/errant mounts are omitted; Winter survival can silently skip owned entities | MAJOR | Winter + Economy retainers/mount inventory; Phase 16B |
| GAP-CH10-002 | Ch.10, PDF 177-182 | Printed personal/family event results must hand off to combat, Standing, aging, maintenance, equipment/gifts/booty, battle, and exact downstream effects | GM/player selection + automatic consequence | Tables roll and a manual Winter-resolution record can close a step | A note can mark deterministic events resolved without invoking their canonical subsystem; affected Winter years can advance with unapplied results | MAJOR | Winter adapters to Ch.3/7/8/12/lifecycle; Phase 16B |
| GAP-CH11-001 | Ch.11, PDF 184-190 | Ambition/career state machine: eligibility, rank awards, duties, benefits, offices, progression, and retirement across printed careers | Player/GM choice + automatic consequences | Some qualification values and generic character status | No canonical career lifecycle for household/mercenary, companion, officer, scara, vassal, banneret, count, duke, lay abbot/bishop, missus, paladin, or black knight | BLOCKER | Career + Standing/Glory + lifecycle; Phase 16B |
| GAP-CH11-002 | Ch.11, PDF 190-191 | Full Chivalrous, Religious, and Romantic ideal benefits/duties, not only qualification and annual Glory | Automatic after qualification + player choice | Ideal eligibility and annual +100 Glory mostly exist | Double inspiration/protection, Prayer +5, annual romantic gift/task, double Amor inspiration, and once-adventure reroll have no shared runtime consumers | MAJOR | Personality/Magic + Adventure + Winter; Phase 16B |
| GAP-CH13-001 | Ch.13, PDF 228 | Chivalric combat terms: agree For Love or Conquest; Love gives Glory only; Conquest settles ransom or horse/weapons/armor | Player choice + automatic settlement | Chapter 7 resolves the fight and Chapter 12 can hold assets/ransom | No pre-combat terms or post-combat chivalric settlement adapter; trial/chivalric combat can end without the printed settlement | MAJOR | Ch.7 + Ch.12 + Glory; Phase 16C |
| GAP-CH13-002 | Ch.13, PDF 229 | Chivalric siege settlement: besieged determines fully engaged, surrender after 90 days without relief, plunder tax one-fifth city value | Player/GM input + automatic elapsed-time/economy result | Chapter 8 resolves siege modes and Chapter 12 accepts economy transactions | No 90-day relief/surrender clock or one-fifth tax settlement consumer | MAJOR | Ch.8 + Ch.12; Phase 16C |
| GAP-CH15-001 | Ch.15, PDF 286-320 | Each chronology year supplies its printed Harvest Stewardship modifier to that year's Winter | Automatic year lookup | `getCampaignPhase` supplies broad phase modifiers | Current +1/+2/+1 phase values are not the annual printed modifiers, commonly +0 with specific exceptional years; every landed Winter can use the wrong target | BLOCKER | Chronology + Winter harvest; Phase 16A |
| GAP-CH15-002 | Ch.15, PDF 286-320 | Deterministic phase/year customs and availability must alter canonical state where printed: marriage/inheritance, authority, equipment/technology, crossbow/Church, tournament, scutage, and related gates | Automatic year/phase + player/GM choices | Some equipment, market, gear, and mount phase gates exist | No complete source registry/runtime consumers for all deterministic phase changes; campaign behavior can remain anachronistic or omit required effects | BLOCKER | Chronology registry across creation/career/economy/combat; Phase 16A |

### Chapter 19

All rows below already have the shared Adventure state machine, source/table data, save/resume, and available canonical hand-offs. The missing consumer is the scenario-specific deterministic procedure named in the row. Free-form GM or narrative decisions are not included.

| Gap ID | Adventure / source | Current runtime support | Missing deterministic consumer / affected path | Severity | Suggested closure phase |
|---|---|---|---|---|---|
| GAP-CH19-001 | The Adventure of the Jewel, PDF 395-400 | Route stages, Prayer/Dream, Chase, Ch.7 and Economy/ledger hand-offs | Branch-specific rewards and consequences are still manual | MAJOR | Phase 16D, long Adventures |
| GAP-CH19-002 | The Adventure of the Humble Squires, PDF 400-410 | Hunt, Ch.7/8, knighting and save/return | Mount Bitter details and capture, loot, and reward effects | MAJOR | Phase 16D, long Adventures |
| GAP-CH19-003 | The Adulterous Spouse, PDF 410 | Generic flow, Prayer, combat | Judicial/ordeal branch and exact consequences | MAJOR | Phase 16D, Short Forms |
| GAP-CH19-004 | The Angry Merchant, PDF 410-411 | Personality and combat hand-offs | Justice branch and reward/Standing consequences | MAJOR | Phase 16D, Short Forms |
| GAP-CH19-005 | Children of the Blue Heaven, PDF 411 | Tests, combat, Economy | Crime branch and exact economy/combat consequences | MAJOR | Phase 16D, Short Forms |
| GAP-CH19-006 | The Devil's Bridge, PDF 412 | Prayer/Dream and combat/battle | Failure modifier path and exact branch rewards | MAJOR | Phase 16D, Short Forms |
| GAP-CH19-007 | The Faerie Castle, PDF 413-414 | Tables 19-6/7 selectable | Aging/time and source-defined reward effects | MAJOR | Phase 16D, Short Forms |
| GAP-CH19-008 | For the Love of Bayard, PDF 414 | Choice/test stages | Seven-day repeated horse-care procedure | MAJOR | Phase 16D, Short Forms |
| GAP-CH19-009 | The Foreign Embassy, PDF 415 | Test/combat/economy/Standing hand-offs | Objective-specific tests and consequences | MAJOR | Phase 16D, Short Forms |
| GAP-CH19-010 | The Greedy Abbot, PDF 416 | Chase and Ch.7 | Theft attempts, modifiers, and treasure outcome | MAJOR | Phase 16D, Short Forms |
| GAP-CH19-011 | Guarding Maugis, PDF 417 | Chase and Ch.7 | Magical powder table/effects and follow-up | MAJOR | Phase 16D, Short Forms |
| GAP-CH19-012 | Love Conquers All, PDF 417-418 | Canonical Amor task state | Rival resolution and final reward | MAJOR | Phase 16D, Short Forms |
| GAP-CH19-013 | The Melancholic Paladin, PDF 418-419 | Canonical Melancholy recovery | Hunt/search/subdual route | MAJOR | Phase 16D, Short Forms |
| GAP-CH19-014 | The Miracle of Truth, PDF 419 | Prayer and GM miracle state | Awareness modifier, raid/battle, and annual result | MAJOR | Phase 16D, Short Forms |
| GAP-CH19-015 | The Noble Hostage, PDF 419-420 | Combat and Economy/ransom | Capture commands and exact consequences | MAJOR | Phase 16D, Short Forms |
| GAP-CH19-016 | The Pagan Lady, PDF 420-421 | Canonical Amor/Hate conversion | Duel, annual task, and rewards | MAJOR | Phase 16D, Short Forms |
| GAP-CH19-017 | The Pagan Prison, PDF 421-422 | Amor, combat/battle, Economy | Escape branches, retry-year, and captivity loop | MAJOR | Phase 16D, Short Forms |
| GAP-CH19-018 | The Rebellious Baron, PDF 422-423 | Test/combat/ledger | Court activity sequence and exact rewards | MAJOR | Phase 16D, Short Forms |
| GAP-CH19-019 | The Small Knight, PDF 423-424 | Ch.18 to Ch.7 hand-off | Branch, reward, and conclusion consequences | MAJOR | Phase 16D, Short Forms |
| GAP-CH19-020 | The Wrathful Lord, PDF 424 | Shock, Passion conflict, Chase | Route-specific results and rewards | MAJOR | Phase 16D, Short Forms |
| GAP-CH19-021 | Challenges, PDF 428-429 | Tables 19-13/14, nested encounter, Ch.7 | Ransom, equipment, and remaining-month consequences | MAJOR | Phase 16D, Solo procedures |
| GAP-CH19-022 | The Feud, PDF 429-430 | Table 19-15 and Ch.7/8 | Muster/recon and ransom/economy/Standing effects | MAJOR | Phase 16D, Solo procedures |
| GAP-CH19-023 | The Forest, PDF 430-431 | Tables 19-16/17, nested 19-11, day loop | Next-roll modifiers, cure, and capture/ransom effects | MAJOR | Phase 16D, Solo procedures |
| GAP-CH19-024 | The Holy Lands, PDF 431 | Travel/annual tables and Ch.8 | Costs, capture, aging, relic, and annual consequences | MAJOR | Phase 16D, Solo procedures |
| GAP-CH19-025 | The Mallus, PDF 432-433 | Tables 19-22/23/24 selectable | Complaint test, oath/bribe, and sentence consumers | MAJOR | Phase 16D, Solo procedures |
| GAP-CH19-026 | Missus Dominicus, PDF 433-434 | Table 19-25 selectable | Inspection rolls, score construction, and report effects | MAJOR | Phase 16D, Solo procedures |
| GAP-CH19-027 | The Pilgrimage, PDF 434 | Table 19-26 outbound/return state | Mortification, donation/economy, and check consequences | MAJOR | Phase 16D, Solo procedures |
| GAP-CH19-028 | The Royal Court, PDF 437 | Contest and optional Amor hand-offs | Admission, gifts, and contest results | MAJOR | Phase 16D, Solo procedures |
| GAP-CH19-029 | The Tournament, PDF 437-438 | Tables 19-31/32/33 and Ch.7 | Awards and Economy consequences | MAJOR | Phase 16D, Solo procedures |
| GAP-CH19-030 | Vassal Service, PDF 438 | Table 19-34 unique draw state | Gifts and court-life consequences | MAJOR | Phase 16D, Solo procedures |
| GAP-CH19-031 | Your Manor, PDF 439 | Tables 19-35/36 nested selection | Annual duties, judgments, Hunt, and superstition effects | MAJOR | Phase 16D, Solo procedures |

## E. Retired Stale Gaps

`RULE_TRACEABILITY.md` is historical and was not rewritten. The rows below are retired only in the current snapshot.

| Historical Rule ID | Historical status | Current disposition |
|---|---|---|
| INTRO-DICE-001 | Logic-only | RETIRED - CLOSED BY shared dice resolver and regression |
| INTRO-ROUND-001 | Partial | RETIRED - CLOSED BY shared rounding helpers |
| CORE-RES-001 | Partial | RETIRED - CLOSED BY canonical d20 resolver |
| CORE-OPPOSED-001 | Partial | RETIRED - CLOSED BY opposed resolution engine |
| CORE-MOD-001 | Partial | RETIRED - CLOSED BY sourced pre-roll modifiers |
| CORE-TIME-001 | Partial | RETIRED - CLOSED BY campaign/adventure time state |
| CORE-XP-001 | Partial | RETIRED - CLOSED BY experience-check ledger |
| CORE-XP-002 | Partial | RETIRED - CLOSED BY Winter experience step |
| CHAR-FAMCHAR-F-001 | Partial | RETIRED - SOURCE AMBIGUITY, not deterministic gap |
| CHAR-DIRECTED-001 | Missing | RETIRED - CLOSED BY Directed Trait entity/resolver |
| CHAR-DERIVED-001 | Partial | RETIRED - CLOSED BY creation/lifecycle derived-state rules |
| CHAR-SKILL-F-001 | Partial | RETIRED - SOURCE AMBIGUITY preserved, deterministic table implemented |
| CHAR-FEMALE-001 | Partial | RETIRED - SOURCE AMBIGUITY preserved, route implemented |
| TRAIT-HEROIC-001 | Partial | RETIRED - CLOSED BY canonical trait resolver |
| TRAIT-ROLL-001 | Partial | RETIRED - CLOSED BY canonical trait resolver |
| TRAIT-PAIR-001 | Partial | RETIRED - CLOSED BY opposed trait-pair state |
| TRAIT-DISHONOR-001 | Missing | RETIRED - CLOSED BY Honor ledger and Table 3-2 |
| PASSION-GAIN-001 | Partial | RETIRED - CLOSED BY canonical Passion engine |
| PASSION-USE-001 | Partial | RETIRED - CLOSED BY canonical Passion engine |
| PASSION-GROUP-001 | Partial | RETIRED - CLOSED BY canonical group Passion flow |
| PASSION-MAND-001 | UI-only | RETIRED - CLOSED BY mandatory/reckless Passion flow |
| GLORY-BASIC-001 | Partial | RETIRED - CLOSED BY sourced Glory transaction input; specific printed formulas remain GAP-CH04-001 |
| GLORY-COMBAT-001 | Partial | RETIRED - CLOSED BY Chapters 7/8 Glory ledgers |
| MAGIC-PRAYER-001 | Partial | RETIRED - CLOSED BY Chapter 9 canonical subsystem |
| MAGIC-TRIAL-001 | Partial | RETIRED - CLOSED BY Chapter 7 plus sourced GM meaning; settlement remains GAP-CH13-001 |
| MAGIC-CONVERT-001 | Partial | RETIRED - CLOSED BY Chapter 9 canonical subsystem |
| MAGIC-DREAM-001 | Partial | RETIRED - CLOSED BY structured dream/GM state |
| MAGIC-AMOR-001 | Partial | RETIRED - CLOSED BY canonical Amor subsystem |
| WINTER-MAINT-001 | Partial | RETIRED - CLOSED BY Winter/Economy maintenance; target coverage is GAP-CH10-001 |
| WINTER-MARRIAGE-001 | Partial | RETIRED - CLOSED BY lifecycle/Winter marriage flow |
| WINTER-CHILDBIRTH-001 | Partial | RETIRED - CLOSED BY lifecycle/Winter childbirth flow |
| WINTER-TRAIN-001 | Partial | RETIRED - CLOSED BY Winter training flow |
| SOCIETY-LAW-001 | UI-only | RETIRED - REFERENCE/GM law material; only explicit settlement rules are GAP-CH13-001/002 |
| SOCIETY-HUNT-001 | Partial | RETIRED - CLOSED BY Chapter 19 Hunt |
| FRANKLAND-001 | Partial | RETIRED - REFERENCE/GM geography, no mandatory standalone executor |
| CULTURE-ATTR-001 | UI-only | RETIRED - CLOSED BY Chapter 17 canonical creation |
| CULTURE-SKILL-001 | UI-only | RETIRED - CLOSED BY Chapter 17 canonical creation |
| OPPONENT-001 | UI-only | RETIRED - CLOSED BY Chapter 18/7 adapter |
| CREATURE-001 | UI-only | RETIRED - CLOSED BY 74 Chapter 18 statblocks |
| ADV-STRUCT-001 | UI-only | RETIRED - CLOSED BY shared Adventure state machine |
| HUNT-001 | UI-only | RETIRED - CLOSED BY Chapter 19 Hunt, with source ambiguity separated |
| SOLO-ROMANCE-001 | Partial | RETIRED - CLOSED BY canonical Amor/Chapter 19 Romance flow |
| APP-NAME-001 | Partial | RETIRED - REFERENCE/optional generator; free input is canonical |
| SAVE-IDEMP-001 | Partial | RETIRED - ENGINEERING EVIDENCE, not a printed-rule gap; covered canonical transactions pass hostile regression |
| RNG-001 | Partial | RETIRED - ENGINEERING EVIDENCE, not a printed-rule gap; source dice paths use injectable/shared dice |

Retired total: **45** = 34 `Partial` + 8 `UI-only` + 2 `Missing` + 1 `Logic-only`.

## F. Source Ambiguities

These **9 source ambiguity clusters are not implementation gaps**. The application preserves an interpretation or structured pending/GM record rather than inventing a rule.

| Ambiguity ID | Source | Ambiguity | Current handling |
|---|---|---|---|
| AMB-CH01-001 | Ch.1, PDF 41 | Female-specific Son Number/order is not fully specified | Existing female route retained; no invented order rule |
| AMB-CH01-002 | Ch.1/lifecycle | Retirement/death inheritance wording permits more than one reading in edge continuity cases | Current documented interpretation retained; user confirmation remains explicit |
| AMB-CH03-001 | Ch.3, PDF 80 | Melancholy text conflicts between one day and Passion-value weeks | Canonical state records the documented interpretation and source note |
| AMB-CH15-001 | Ch.15, PDF 286-287 | Phase Four is labeled 801-813 in Table 15-1 but 801-814 in chapter chronology/core reign framing | Existing difference remains documented; not silently normalized |
| AMB-CH17-001 | Ch.17, PDF 370 | Generic Slav Pony is named without a Chapter 18 combat statblock | Structured pending profile; Rouncy alternative remains executable |
| AMB-CH18-001 | Ch.18, PDF 387 | Hippogriff statblock says `Hoofs 12`; fly-by text says claw or bite | GM/source record retained; no attack invented |
| AMB-CH19-001 | Ch.19, Table 19-7 | Prose says six temptations while the table has seven rows | All printed rows preserved with ambiguity note |
| AMB-CH19-002 | Ch.19, Table 19-11 | Roll 4 overlaps Deer and Aurochs | Overlap preserved and surfaced; no hidden rerange |
| AMB-CH19-003 | Ch.19, Table 19-24 | Printed amount is malformed as `GBP 1d)` | Exact source text/pending GM value preserved |

## G. Reference-Only Chapters and Sections

- **Chapter 14 Frankland:** geography, political context, and place descriptions support GM framing. The chapter does not prescribe a mandatory location-by-location movement or encounter executor.
- **Chapter 16 Gamemaster Characters:** NPC motives and conduct are GM material. Executable opponent statistics and combat already flow through Chapters 18 and 7; source does not require behavioral AI.
- **Appendix 1 Names:** the tables are optional inspiration. Free name entry is valid, so complete random generation is not a campaign blocker.
- **Appendix 2 Bibliography:** bibliography only.
- **Appendix 3 Houses:** setting/reference profiles; selection is not a mandatory mechanical creation step.
- **Character sheets/end matter:** presentation, reusable paper fields, notes, and art. Digital state equivalence is required only where a rule consumes the value; no new deterministic field gap was found.
- Historical prose, examples, sidebars, designer advice, narrative outcomes, and GM scene framing elsewhere remain reference or intentional judgment unless a printed calculation/state transition exists.

## H. Evidence and Engineering Debt

These concerns do not change the 46-rule-gap count.

| Concern | Current evidence | Classification | Follow-up |
|---|---|---|---|
| Full temporary CI | PASS: build, rules, creation, lifecycle, Winter, Chapters 7/8/12/17/18/19, Personality/Magic, 11-year campaign, hostile save | Evidence | Keep as closure regression gate |
| Migration/save | PASS in existing v4/v6-to-v12 and hostile/idempotency suites | Evidence | Live multi-client conflict remains unverified |
| Repository ESLint | FAIL: 135 errors, 3 warnings | Engineering debt | Separate engineering phase; do not mix with source gap closure |
| Dead/unused code lint | 67 `no-unused-vars` + 63 `no-useless-assignment` errors | Dead code / code quality, 130 errors | Remove after rule closure with behavior-preserving tests |
| Hook lint | 2 static component + 2 set-state-in-effect + 1 refs errors; 3 exhaustive-deps warnings | Potential runtime/performance risk, 5 errors + 3 warnings | Dedicated React correctness pass; no proven rule miscalculation in current regressions |
| Production bundle | PASS with main chunk 690.11 kB, gzip 210.49 kB; >500 kB warning | Release performance | Profiling/code splitting phase, not rulebook gap |
| Physical devices | Responsive evidence exists from 360 to 3440 CSS px, not a physical device matrix | Evidence limitation | Physical low-end mobile and ultrawide smoke test |
| Firebase | Local migration/idempotency passes; real credential multi-client conflict recovery not exercised here | Evidence limitation | Staged live conflict test before release |
| Screen reader | Keyboard/focus/contrast/reduced-motion evidence exists; no current assistive-technology user session | Evidence limitation | VoiceOver/NVDA manual verification |

## I. Prioritized Final Gap Closure Plan

Do not start these phases from this audit automatically.

1. **Phase 16A - campaign foundations:** GAP-CH01-001, GAP-CH02-001, GAP-CH15-001, GAP-CH15-002. These affect campaign identity, ancestry, every year, and Winter outcomes.
2. **Phase 16B - reputation, Winter, and careers:** GAP-CH04-001/002, GAP-CH10-001/002, GAP-CH11-001/002. These are frequent cross-chapter state changes and include the remaining non-chronology blocker.
3. **Phase 16C - skills, travel, and chivalric settlement:** GAP-CH05-001, GAP-CH06-001/002, GAP-CH13-001/002. Build adapters around existing canonical engines rather than parallel engines.
4. **Phase 16D - Chapter 19 exact procedures:** GAP-CH19-001 through GAP-CH19-031. Close the two long Adventures, then 18 Short Forms, then 11 partial Solo procedures; keep Hunt, Wild Hunt, and Romance current COMPLETE qualifications intact.
5. **Final certification:** rerun the 463-page audit, all regressions, migration/idempotency, real UI paths, repository lint risk review, and release smoke tests. Do not claim complete replacement until the deterministic gap count reaches zero.

## Final Assessment

1. **How many actual deterministic rule gaps remain?** 46.
2. **How many previous PARTIAL findings were stale and are now retired?** 45 prior non-Exact gap assertions; 34 of those carried the literal `Partial` label.
3. **Can the current application replace the rulebook for all deterministic procedures?** PARTIAL.
4. **Which procedures still require the rulebook because implementation is missing?** `GAP-CH01-001`, `GAP-CH02-001`, `GAP-CH04-001` through `GAP-CH06-002`, `GAP-CH10-001` through `GAP-CH11-002`, `GAP-CH13-001` through `GAP-CH15-002`, and `GAP-CH19-001` through `GAP-CH19-031`.
5. **Are intentional GM/narrative decisions incorrectly counted as missing implementation?** NO.
6. **Did this audit change gameplay behavior?** NO.

**FINAL GAP CLOSURE REQUIRED - 46 gaps: 5 Blocker, 40 Major, 1 Minor.**

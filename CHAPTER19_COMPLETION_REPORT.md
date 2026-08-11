# Chapter 19 Completion Report

## Current Verdict

**Chapter 19: PARTIAL**

Audit date: 2026-08-12  
Authoritative source: `paladin_core_rulebook.pdf`, printed pp.391-438 (PDF pp.392-439)

The source was re-read in page order and visually checked across all 48 Chapter 19 pages. The application has a sound shared Adventure framework, 34 catalog entries, all 36 tables transcribed, stable subsystem returns, and save-safe transaction identities. It does not yet execute every source-specific deterministic procedure. A generic `Setting -> Problem -> Secrets -> Tests -> Actions -> Conclusion -> Glory` sequence, a checklist, or a free-form consequence control is not counted as completion.

## Status

| Area | Status |
|---|---|
| Adventure Framework | COMPLETE |
| The Adventure of the Jewel | PARTIAL |
| The Adventure of the Humble Squires | PARTIAL |
| Short Form Scenarios | PARTIAL |
| Solo Procedures | PARTIAL |
| Chapter 19 Tables | PARTIAL |

## Source Inventory

| Kind | Count | Source coverage |
|---|---:|---|
| Full Adventures | 2 | pp.394-409 |
| Short Form Scenarios | 18 | pp.409-423 |
| Solo Procedures | 14 | pp.424-438 |
| Numbered Tables | 36 | Tables 19-1 through 19-36 |

GM decisions and narrative descriptions explicitly assigned by the source remain intentional manual inputs. They are not implementation gaps. Source ambiguities are recorded separately and never silently resolved.

## Adventure Coverage

| Adventure / Scenario | Source | Runtime and engine integration | Remaining deterministic gap | Status |
|---|---:|---|---|---|
| The Adventure of the Jewel | 394-399 | Route stages, Prayer/Dream, Chase, Chapter 7, Economy/ledger hand-off | Several branch rewards and consequences remain manual | PARTIAL |
| The Adventure of the Humble Squires | 399-409 | Hunt, Chapter 7/8, knighting and save/return | Mount Bitter details and several capture/loot/reward effects remain manual | PARTIAL |
| The Adulterous Spouse | 409 | Generic flow, Prayer and combat hand-off | Judicial/ordeal branch and exact consequences | PARTIAL |
| The Angry Merchant | 409-410 | Personality and combat hand-off | Justice branch and reward/Standing consequences | PARTIAL |
| Children of the Blue Heaven | 410 | Tests, combat and Economy hand-off | Crime branch and exact economy/combat consequences | PARTIAL |
| The Devil's Bridge | 411 | Prayer/Dream and combat/battle hand-off | Failure modifier path and exact branch rewards | PARTIAL |
| The Faerie Castle | 412-413 | Tables 19-6/7 selectable | Aging/time and source-defined rewards are manual; 19-7 ambiguity | PARTIAL |
| For the Love of Bayard | 413 | Choice/test stages | Seven-day repeated horse-care procedure | PARTIAL |
| The Foreign Embassy | 414 | Test/combat/economy/Standing hand-offs | Objective-specific tests and consequences | PARTIAL |
| The Greedy Abbot | 415 | Chase and Chapter 7 hand-off | Theft attempts, modifiers, and treasure outcome | PARTIAL |
| Guarding Maugis | 416 | Chase and Chapter 7 hand-off | Magical powder table/effects and follow-up | PARTIAL |
| Love Conquers All | 416-417 | Canonical Amor task state | Rival resolution and final reward | PARTIAL |
| The Melancholic Paladin | 417-418 | Canonical Melancholy recovery | Hunt/search/subdual route | PARTIAL |
| The Miracle of Truth | 418 | Prayer and GM miracle state | Awareness modifier, raid/battle, annual result | PARTIAL |
| The Noble Hostage | 418-419 | Combat and Economy/ransom hand-off | Capture commands and exact consequences | PARTIAL |
| The Pagan Lady | 419-420 | Canonical Amor/Hate conversion | Duel, annual task, and rewards | PARTIAL |
| The Pagan Prison | 420-421 | Amor, combat/battle and Economy hand-offs | Escape branches, retry-year and captivity loop | PARTIAL |
| The Rebellious Baron | 421-422 | Test/combat/ledger hand-offs | Court activity sequence and exact rewards | PARTIAL |
| The Small Knight | 422-423 | Chapter 18 to Chapter 7 hand-off | Branch/reward/conclusion consequences | PARTIAL |
| The Wrathful Lord | 423 | Shock, Passion conflict, Chase | Route-specific results and rewards | PARTIAL |
| The Hunt | 424-426, 430 | Search, Chase, obstacle, nested prey, Chapter 7 return and stop | Only Table 19-11 source overlap remains | COMPLETE WITH SOURCE AMBIGUITY |
| Challenges | 427-428 | Tables 19-13/14, nested special encounter, Chapter 7 return | Ransom, equipment and remaining-month consequences | PARTIAL |
| The Feud | 428-429 | Table 19-15 and Chapter 7/8 hand-off | Muster/recon and ransom/economy/Standing effects | PARTIAL |
| The Forest | 429-430 | Tables 19-16/17 and nested 19-11, day loop | Next-roll modifiers, cure and capture/ransom effects | PARTIAL |
| The Holy Lands | 430 | Travel/annual tables and Chapter 8 hand-off | Costs, capture, aging, relic and annual consequences | PARTIAL |
| The Wild Hunt | 431 | Tables 19-20/21 and canonical Madness | Source-assigned GM/narrative decisions only | COMPLETE WITH INTENTIONAL GM/NARRATIVE |
| The Mallus | 431-432 | Tables 19-22/23/24 selectable | Complaint test, oath/bribe and sentence consumers; 19-24 ambiguity | PARTIAL |
| Missus Dominicus | 432-433 | Table 19-25 selectable | Inspection rolls, score construction and report effects | PARTIAL |
| The Pilgrimage | 433 | Table 19-26 outbound/return state | Mortification, donation/economy and check consequences | PARTIAL |
| Romance | 433-435 | Tables 19-27 through 19-30 and canonical Amor | Source-assigned GM/narrative decisions only | COMPLETE WITH INTENTIONAL GM/NARRATIVE |
| The Royal Court | 436 | Contest and optional Amor hand-offs | Admission, gifts and contest results | PARTIAL |
| The Tournament | 436-437 | Tables 19-31/32/33 and Chapter 7 hand-off | Awards and Economy consequences | PARTIAL |
| Vassal Service | 437 | Table 19-34 unique draw state | Gifts and court-life consequences | PARTIAL |
| Your Manor | 438 | Tables 19-35/36 nested selection | Annual duties, judgments, Hunt and superstition effects | PARTIAL |

## Table Coverage

All 36 table definitions are source-verified and every row is covered by min/max/midpoint lookup regression. Runtime consequence coverage is stricter:

| Tables | Data and selector | Runtime consumer | Status |
|---|---|---|---|
| 19-1 to 19-7 | PASS | Adventure stages exist; several row-specific consequences remain manual | PARTIAL |
| 19-8 to 19-12 | PASS | Hunt resolver, nested special prey, obstacle loop, Chapter 7 return | COMPLETE WITH 19-11 SOURCE AMBIGUITY |
| 19-13 to 19-19 | PASS | Nested table and subsystem returns exist; several modifiers/rewards remain manual | PARTIAL |
| 19-20 to 19-21 | PASS | Canonical Madness/Personality consumers | COMPLETE WITH INTENTIONAL GM/NARRATIVE |
| 19-22 to 19-26 | PASS | Selectors exist; judgment/economy/score consequences are incomplete | PARTIAL |
| 19-27 to 19-30 | PASS | Canonical Amor consumers | COMPLETE WITH INTENTIONAL GM/NARRATIVE |
| 19-31 to 19-36 | PASS | Selectors and Chapter 7 return exist; awards/annual consequences incomplete | PARTIAL |

## Changes In This Pass

1. Table 19-14 Special Encounter now opens and consumes its special subtable before combat.
2. Forest Table 19-16 Wild Animal now enters Table 19-11 instead of skipping prey selection.
3. Table 19-11 result 20 now preserves and consumes the Special Encounters subtable result.
4. Hunt Table 19-10 Dead End now requires two additional rolls and ignores repeated 11 results without consuming either roll.
5. Adventure return now pauses on pending death, active captivity, ransom wait, or inactive/incapacitated lifecycle state.
6. A source-visible interruption decision can resume with the recovered character, continue with a successor/survivors, or end the Adventure without double-applying the subsystem result.
7. Regression now checks every row of all 36 tables, nested table identity, save/reload through loops, death/captivity interruption, and a five-procedure sequential campaign.

## Save / Resume

| Checkpoint | Result |
|---|---|
| pre-choice and post-roll | PASS |
| nested table result | PASS |
| pre-combat and subsystem return | PASS |
| pending death interruption | PASS |
| pending captivity/ransom interruption | PASS |
| Hunt Dead End repeated roll | PASS |
| completed transaction reload | PASS |
| duplicate subsystem return or reward | NONE FOUND IN COVERED PATHS |

Unimplemented source-specific consequences cannot be certified for idempotency until their runtime consumers exist.

## Source Ambiguities

1. Table 19-7 prose says six temptations while the table has seven rows.
2. Table 19-11 roll 4 overlaps Deer and Aurochs.
3. Table 19-24 contains the malformed amount `Plaintiff Offers GBP 1d)`.
4. Chapter 18 p.386 conflicts between Hippogriff `Hoofs 12` and fly-by `claw or bite`.

## Verification

| Check | Result |
|---|---|
| Chapter 19 regression | PASS |
| Modified-file ESLint | PASS |
| Production build | PASS, existing main-chunk size warning remains |
| Full temporary CI | PASS: build, rules, creation, lifecycle, Winter, Chapters 7/8/12/18/19, Personality/Magic, 11-year campaign, hostile save |
| Repository-wide ESLint | FAIL: unchanged legacy baseline, 135 errors and 3 warnings; modified Chapter 19 files pass |
| Real UI 360/768/1440/1920/3440 | PASS for catalog and Forest nested-table path; full 34-entry rule completion is not certified |
| Browser console | PASS, 0 warnings and 0 errors |

Responsive checks reported zero document-level horizontal overflow at 360, 768, 1440, 1920, and 3440 CSS pixels. At 360px the 620px source table remains readable inside its own 322px horizontal scroller without widening the document. The live Forest path confirmed `19-16 Wild Animal -> 19-11 Prey -> 19-11 Special Encounters` in the user UI.

## Final Assessment

1. Can Chapter 19 be played from beginning to end without reopening the rulebook except for intentional GM/narrative judgment? **PARTIAL**
2. Can The Adventure of the Jewel be completed end-to-end with all deterministic consequences? **PARTIAL**
3. Can The Adventure of the Humble Squires be completed end-to-end with all deterministic consequences? **PARTIAL**
4. Can every procedural Short Form Scenario be completed end-to-end? **NO**
5. Can every Solo procedure be completed end-to-end? **PARTIAL**
6. Does Chapter 19 reuse Chapters 3, 7, 8, 12, and 18 rather than duplicating them? **YES**
7. Did this pass invent a rule, modifier, reward, encounter, branch, or narrative result? **NO**

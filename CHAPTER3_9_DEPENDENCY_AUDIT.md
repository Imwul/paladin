# Chapter 3 / 9 Canonical Dependency Audit

## Current Decision

- **Chapter 3: COMPLETE WITH INTENTIONAL GM/NARRATIVE**
- **Chapter 9: COMPLETE WITH INTENTIONAL GM/NARRATIVE**
- **Chapter 19 direct Chapter 3/9 dependencies: COMPLETE**

This current-state verdict supersedes the earlier Phase 12 direct-dependency-only audit. The historical finding that Table 3-2, voluntary Winter Passion reduction, Fear opportunities, and the pagan-lady procedure were outside that narrower pass is preserved here as superseded: each now has a canonical runtime consumer and regression coverage.

The source audit reread printed Chapter 3 pp.65-81 and Chapter 9 pp.163-171 in `paladin_core_rulebook.pdf`, including tables, examples, exceptions, sidebars, cross-references, and timing rules. GM judgment and narrative interpretation remain manual where the book assigns them to the table.

## Classification

| Classification | Runtime policy | Examples |
|---|---|---|
| Automatic | Apply only printed arithmetic and deterministic consequences | Table 3-4 outcomes, Honor loss, prayer modifiers, Amor tables |
| Player Choice | Persist the pending choice and apply only the selected branch | Passion use, Winter -3, Amor retention, lovers' tasks |
| GM Choice | Record source, context, allowed input, decision, and result | Directed values, Fear opportunity, miracle nature, dream meaning |
| Narrative | Preserve state and a note without generating fiction | Madness interval, dream content, relationship description |
| Reference | Present source information without manufacturing state | Theology and setting explanation |
| Source Ambiguity | Preserve both readings and require explicit resolution | Melancholy's “usually one day” versus natural recovery in Passion-value weeks |

## Canonical State

`campaign.personalityMagic` stores Directed Traits and Passions, pending Trait/Passion/Prayer resolution, consequences, Madness, Melancholy, Oath, Amor, external NPC Passions, dreams, GM decisions, transactions, and Adventure return cursors. `character.traits` and `character.passions` remain the only score stores. Honor, Glory, and Standing changes use their existing ledgers. Schema v12 migration absorbs legacy `campaign.passionStates` without recreating or duplicating it.

## Personality Coverage

| Area | Source | Runtime coverage | Status |
|---|---|---|---|
| Traits | Ch.3 pp.66-73 | 24 Traits, 12 opposed pairs, ordinary/critical/fumble result, checks | COMPLETE |
| Directed Traits | Ch.3 pp.69-70 | target, modifier, origin, use, one inherited trait, removal, save | COMPLETE |
| Directed Passions | Ch.3 pp.74-78 | Love/Hate/Fear target and player/GM-agreed starting value | COMPLETE |
| Passion use | Ch.3 pp.74-80 | ordinary, mandatory, reckless/frivolous, conflict, aftermath | COMPLETE |
| Contrary action | Ch.3 p.66 | immediate GM-directed -1, idempotent transaction | COMPLETE |
| Honor | Ch.3 pp.73-75 | Table 3-2, <=5 lord judgment, Honor 0 removal from active play | COMPLETE |
| Fear | Ch.3 pp.77-78 | GM-created opportunity, former Fear removal, GM-approved Glory | COMPLETE WITH GM CHOICE |
| Oaths | Ch.3 p.81 | one active oath, stake, fulfillment/breaking, unresolved fatal timing | COMPLETE WITH GM/NARRATIVE |
| Madness | Ch.3 pp.79-80; Ch.19 p.431 | trigger, onset, annual Mad Act/Character Change, recovery | COMPLETE |
| Melancholy | Ch.3 p.79 | trigger, restriction, natural/Snap Out recovery, both source durations | COMPLETE WITH SOURCE AMBIGUITY |
| Winter Passion reduction | Ch.3 pp.80-81 | voluntary -3 to a selected Passion, floor 0, once-per-transaction | COMPLETE |

## Magic And Amor Coverage

| Area | Source | Runtime coverage | Status |
|---|---|---|---|
| Prayer | Ch.9 pp.165-168 | eligibility, beneficiary, all printed modifiers, Table 9-2 choice | COMPLETE |
| Miracles | Ch.9 pp.167-169 | deterministic prerequisites and explicit GM miracle decision | COMPLETE WITH INTENTIONAL GM/NARRATIVE |
| Relics | Ch.9 p.170 | Prayer modifier and canonical inventory/relic reference | COMPLETE FOR CURRENT GAMEPLAY |
| Dreams | Ch.9 p.169 | Passion and Religion checks, sourced or GM-authored message | COMPLETE WITH INTENTIONAL GM/NARRATIVE |
| Amor initiation | Ch.3 pp.75-77; Ch.9 pp.170-171 | ordinary and pagan-lady passive/deliberate initiation | COMPLETE |
| Amor progression | Ch.19 pp.433-435 | Potential Amor, reluctance, annual gift, Essai, Consummation | COMPLETE |
| Lovers' tasks | Ch.19 p.434 | assignment, pending, exact test, completion/failure | COMPLETE |
| Discovery / Exposure | Ch.19 p.435 | factors, opposed result, exposure consequence and history | COMPLETE |
| Pagan lover betrayal | Ch.9 p.170 | existing Amor value becomes Hate; Honor -5 and Love [God] -5 once | COMPLETE |

## Procedure Source Audit

| Rule / Procedure | Chapter | Source Page | Classification | Runtime Consumer | Test | Status |
|---|---:|---:|---|---|---|---|
| Passion contrary action | 3 | 66 | GM Choice + Automatic | `reducePassionForContraryAction` | personality regression | COMPLETE |
| Directed Trait | 3 | 69-70 | GM/Player Choice | `addDirectedTrait`, Trait resolver | personality regression | COMPLETE |
| Trait results and conflict | 3 | 70-72 | Automatic/Player Choice | Trait/conflict resolvers | personality regression | COMPLETE |
| Dishonorable acts | 3 | 74 | Player/GM input + Automatic | `applyDishonorableAct`, Honor ledger | personality regression | COMPLETE |
| Low/zero Honor | 3 | 74-75 | GM Choice + Automatic | Honor threshold state, lord judgment | personality regression | COMPLETE |
| Directed Passion | 3 | 74-78 | Player + GM Choice | `addDirectedPassion` | personality regression | COMPLETE |
| Amor declaration | 3 | 75-77 | Player + GM Choice | canonical Amor state | personality regression | COMPLETE |
| Fear opportunity | 3 | 77-78 | GM Choice | `resolveFearOpportunity` | personality regression | COMPLETE |
| Passion consequences | 3 | 77-80 | Automatic/GM Choice | Passion aftermath, Shock, Madness, Melancholy | personality regression | COMPLETE |
| Voluntary Winter reduction | 3 | 80-81 | Player Choice | `lowerPassionDuringWinter` | personality regression | COMPLETE |
| Oath | 3 | 81 | Player Choice + GM/Narrative | Oath resolver | personality regression | COMPLETE |
| Christian magic eligibility | 9 | 163-165 | Automatic/Reference | Prayer eligibility gate | personality regression | COMPLETE |
| Prayer | 9 | 165-168 | Player + GM Choice | Prayer resolver | personality regression | COMPLETE |
| Miracles | 9 | 168-169 | GM Choice/Narrative | miracle decision ledger | personality regression | COMPLETE |
| Dreams | 9 | 169 | GM Choice/Narrative | Dream resolver | personality regression | COMPLETE |
| Relic benefit | 9 | 170 | Automatic/Reference | Prayer/inventory adapter | Adventure regression | COMPLETE |
| Pagan Lady Amor | 9 | 170-171 | Player + GM Choice | `resolvePaganLadyAmor` | personality regression | COMPLETE |
| Pagan lover betrayal | 9 | 170 | Automatic after narrative trigger | `convertExternalAmorToHate` | personality regression | COMPLETE |

## Table Audit

| Table | Source | Runtime consumer | Test | Status |
|---|---:|---|---|---|
| 3-1 Trait Results | 70 | Trait resolver | personality regression | COMPLETE |
| 3-2 Dishonorable Acts | 74 | Honor transaction resolver | personality regression | COMPLETE |
| 3-3 Famous Traits and Passions | 75 | reference and source prompts | source audit | REFERENCE |
| 3-4 Passion Results | 78 | Passion resolver | personality regression | COMPLETE |
| 9-1 Prayer | 166 | Prayer modifier resolver | personality regression | COMPLETE |
| 9-2 Effects of a Prayer | 168 | Prayer result resolver | personality regression | COMPLETE |
| 19-20 Mad Acts | 431 | Madness annual lifecycle | personality + Adventure regression | COMPLETE |
| 19-21 Character Changes | 431 | Madness character mutation | personality + Adventure regression | COMPLETE |
| 19-27 Amor Modifiers | 433 | Amor initiation | personality + Adventure regression | COMPLETE |
| 19-28 Lover's Tasks | 434 | task assignment/result | personality + Adventure regression | COMPLETE |
| 19-29 Discovery Factors | 435 | Amor discovery | personality + Adventure regression | COMPLETE |
| 19-30 Exposure Results | 435 | Amor exposure | personality + Adventure regression | COMPLETE |

## Chapter 19 Dependencies Closed

| Scenario | Previous dependency | Canonical subsystem now used | Remaining GM/Narrative | Implementation gap | Status |
|---|---|---|---|---|---|
| Romance | disconnected long-term relationship state | Amor + 19-27 through 19-30 | relationship narration | none | COMPLETE |
| Love Conquers All | scenario-only task note | Amor + 19-28 | scene narration | none | COMPLETE |
| Pagan Lady | journal-only conversion | external Amor/Hate + Honor/Love [God] ledgers | betrayal trigger | none | COMPLETE |
| Pagan Prison | free NPC relationship note | Ch.9 passive/deliberate pagan-lady Amor | identity and narrative context | none | COMPLETE |
| Wild Hunt | boolean Madness risk | canonical Madness + 19-20/21 | unknown interval narrative | none | COMPLETE |
| Melancholic Paladin | scenario-only condition | canonical Melancholy recovery | social narration | none | COMPLETE |
| Miracle of Truth | free miracle memo | Prayer + miracle decision | miracle meaning | none | COMPLETE |

No active Chapter 3/9 implementation dependency remains in Chapter 19. Remaining manual items are `INTENTIONAL GM/NARRATIVE`, the Melancholy `SOURCE AMBIGUITY`, or `REFERENCE ONLY`. The Chapter 18 Hippogriff p.386 conflict remains a separate Chapter 18 source ambiguity and is not a Chapter 3/9 blocker.

## Save / Resume

Directed Trait, Directed Passion, pending Passion, Passion consequence, Madness, Melancholy, recovery, Prayer, GM miracle, active Amor, lovers' task, discovery/exposure, Chapter 19 hand-off, and return are all **PASS**. Stable transaction IDs prevent duplicate Passion, Honor, Glory, Standing, damage, and Adventure effects after reload.

## Verification

| Check | Result |
|---|---|
| Chapter 3 unit and integration | PASS |
| Chapter 9 unit and integration | PASS |
| Chapter 19 dependency regression | PASS, 34 procedures and 36 tables |
| Character / Family / Winter | PASS |
| Chapter 7 / 8 / 12 / 18 | PASS |
| Death / Succession / Chronicle | PASS |
| 11-year campaign | PASS, 0 post-fix rulebook consultations |
| schema v12 migration and hostile saves | PASS |
| modified-file lint | PASS, new errors/warnings 0 |
| repository-wide lint | FAIL, pre-existing 135 errors and 3 warnings; not increased |
| production build | PASS, 596.94 kB main chunk warning remains |
| 360 / 768 / 1440 / 1920 / wide breakpoint | PASS, horizontal overflow 0 |
| browser console | PASS, application errors/warnings 0 |

## Final Assessment

1. Deterministic Chapter 3 procedures required by current gameplay: **YES**.
2. Deterministic Chapter 9 procedures required by current gameplay: **YES**.
3. One canonical Amor subsystem from initiation through save/resume: **YES**.
4. Madness and Melancholy trigger through canonical recovery: **YES**, with the printed Melancholy duration ambiguity preserved.
5. Listed Chapter 19 scenarios free of missing Chapter 3/9 dependencies: **YES**.
6. Any unsupported rule, modifier, reward, recovery, or narrative outcome invented: **NO**.

**CHAPTER 3/9 CANONICAL DEPENDENCY COMPLETE.**

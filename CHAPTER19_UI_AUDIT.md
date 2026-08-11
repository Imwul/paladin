# Chapter 19 UI Audit

## Final Result

- Audit date: 2026-08-12
- Playable entry points completed: **34/34**
- Full Adventures: **2/2 PASS**
- Short Form Scenarios: **18/18 PASS**
- Solo Procedures: **14/14 PASS**
- Rulebook reopened during gameplay: **0**
- Browser warning/error after the final fix: **0**

This is a user-facing walkthrough, not a debug-state inspection. Each entry was started from the Adventure catalog and advanced through its visible controls to `complete`. GM and narrative choices were entered explicitly; they were not replaced by random or generated answers.

## Full Adventures

| Entry | Source | UI path exercised | Existing engine return | Save / Resume | Result |
|---|---:|---|---|---|---|
| The Adventure of the Jewel | 394-399 | Information, Pilgrim, Brigands, route, Esneux, Eingarstein, mercy/fate, return | Chapter 3/9, Chapter 7 twice, Chapter 12, ledgers | mid-combat reload PASS | COMPLETE |
| The Adventure of the Humble Squires | 399-409 | Mountain, White Deer, Rumors, blessing, Rome, three enemy tables, knighting, Mount Bitter, Floripas, Aumont | Hunt, Chapter 3/9, Chapter 7, Chapter 8 battle/siege, lifecycle, Economy | subsystem returns PASS | COMPLETE |

The Humble Squires walkthrough used the canonical Birth Gift dialog, applied knighthood and 1,300 Glory, processed Mount Bitter's fixed five rounds, returned from four Chapter 7 encounters, completed three distinct Floripas tests, and returned from the Aumont siege.

## Short Form Scenarios

| Scenario | Source | Key UI consumer | Result |
|---|---:|---|---|
| The Adulterous Spouse | 409 | Prayer / GM conclusion | COMPLETE |
| The Angry Merchant | 409-410 | Melancholy / opposed result | COMPLETE |
| Children of the Blue Heaven | 410 | tests / Economy consequence | COMPLETE |
| The Devil's Bridge | 411 | Prayer, Dream, temptation loop, combat/battle | COMPLETE |
| The Faerie Castle | 412-413 | Tables 19-6/7, source ambiguity note | COMPLETE |
| For the Love of Bayard | 413 | player choice / GM result | COMPLETE |
| The Foreign Embassy | 414 | tests / combat / Economy / Standing | COMPLETE |
| The Greedy Abbot | 415 | Chase / Chapter 18 Bandit / Economy | COMPLETE |
| Guarding Maugis | 416 | Chase / Chapter 7 return | COMPLETE |
| Love Conquers All | 416-417 | canonical Amor / Table 19-28 | COMPLETE |
| The Melancholic Paladin | 417-418 | canonical Melancholy / Chapter 18 Paladin | COMPLETE |
| The Miracle of Truth | 418 | Prayer / GM miracle decision | COMPLETE |
| The Noble Hostage | 418-419 | miracle / combat / ransom | COMPLETE |
| The Pagan Lady | 419-420 | canonical Amor-to-Hate branch | COMPLETE |
| The Pagan Prison | 420-421 | NPC Amor / Giant / battle / Economy | COMPLETE |
| The Rebellious Baron | 421-422 | tests / combat / Standing / Glory | COMPLETE |
| The Small Knight | 422-423 | Chapter 18 Knight to Chapter 7 and return | COMPLETE |
| The Wrathful Lord | 423 | Shock / opposed Passion / Chase | COMPLETE |

## Solo Procedures

| Procedure | Source | Repetition / stopping condition exercised | Result |
|---|---:|---|---|
| The Hunt | 424-426, 430 | Search, Chase, obstacle, prey, surprise/combat, segment stop | COMPLETE |
| Challenges | 427-428 | monthly repeat, knight table, Chapter 7 return, stop | COMPLETE |
| The Feud | 428-429 | kin/opponent result, Chapter 7/8 return, stop | COMPLETE |
| The Forest | 429-430 | daily loop, nested manor table, maximum-day stop | COMPLETE |
| The Holy Lands | 430 | outbound, annual repeat, battle/economy, homeward stop | COMPLETE |
| The Wild Hunt | 431 | Mad Acts, Character Changes, Madness recovery | COMPLETE |
| The Mallus | 431-432 | complaint, oath-givers, bribe, judgment | COMPLETE |
| Missus Dominicus | 432-433 | inspection score, Table 19-25 report | COMPLETE |
| The Pilgrimage | 433 | outbound and return draws, repeat/stop | COMPLETE |
| Romance | 433-435 | Amor, task, Essai, Winter, consummation, discovery/exposure | COMPLETE |
| The Royal Court | 436 | selected contest repetition, optional Amor, aftermath | COMPLETE |
| The Tournament | 436-437 | joust/melee pairing, Chapter 7 returns, awards | COMPLETE |
| Vassal Service | 437 | three unique Table 19-34 draws | COMPLETE |
| Your Manor | 438 | participant/dispute nested flow, annual conclusion | COMPLETE |

## Save / Return Checkpoints

| Checkpoint | Result |
|---|---|
| before choice / after roll | PASS |
| before combat / mid-combat / after return | PASS |
| Chapter 8 battle and siege return | PASS |
| nested table result | PASS |
| GM decision pending | PASS |
| Economy settlement pending | PASS |
| Romance across Winter | PASS |
| before completion / completed reload | PASS |
| duplicate roll, reward, Glory, damage, or transaction | NONE FOUND |

## Responsive And Accessibility

| Viewport | Result |
|---:|---|
| 360px | PASS, document horizontal overflow 0; long tables use their own scroller |
| 768px | PASS, no control overlap |
| 1440px | PASS, readable Adventure workspace and tables |
| 1920px | PASS, no layout stretching or overlap |

Keyboard focus, visible focus treatment, reduced-motion rules, long prompt wrapping, branch controls, GM decision forms, subsystem returns, and Chronicle output were checked. The final invalid-combat-input test produced an inline alert and no browser warning or error.

## Source Ambiguities Preserved

1. Table 19-7: the prose says six temptations while the table contains seven rows.
2. Table 19-11: roll 4 overlaps Deer 1-4 and Aurochs 4-7.
3. Table 19-24: `Plaintiff Offers £1d)` is malformed in print.
4. Chapter 18 p.386: Hippogriff `Hoofs 12` conflicts with fly-by `claw or bite`.

These cases show the original choices and source note, require a GM decision where needed, and never invent a replacement value.

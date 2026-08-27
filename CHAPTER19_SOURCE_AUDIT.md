# Chapter 19 Source Audit

> **Current Phase 16 verdict:** **COMPLETE WITH INTENTIONAL GM/NARRATIVE AND SOURCE AMBIGUITIES**; deterministic Chapter 19 gaps are 0. The Phase 13 correction below is historical before-state evidence. The Phase 16 structured-consequence closure addendum at the end supersedes it.

## First-Play Dependency Recheck - 2026-08-28

The catalog's former `외부 의존성: chapter_*` banner conflated executable in-app hand-offs with missing implementation. Every dependency identifier currently emitted by the 34 Chapter 19 definitions now resolves through a shared connection registry. Canonical connections are described at the point of play; an unknown future identifier remains a blocking warning instead of being hidden.

- Chapter 18 encounters use the canonical 74-statblock registry, pass the selected attack and special rules to Chapter 7, and return to the same Adventure stage.
- Humble Squires p.406 Chivalric Challenges restricts the opponent picker to ordinary or notable knights before entering Chapter 7.
- Humble Squires p.407 Dishonorable Ambush now enters Chapter 8 Skirmish as the printed three-way fight; its personal melee rounds remain Chapter 7 records.
- For the Love of Bayard p.413 exposes the Chapter 18 Bayard encounter through Chapter 7 instead of leaving the statblock as catalog-only metadata.
- The Holy Lands no longer advertises a Chapter 18 dependency because its printed runtime hand-offs are Chapter 10 aging/Winter and Chapter 8 battle/economy procedures.
- The legacy `kind: dependency` renderer remains only for pre-existing saves and now requires a recorded migration basis. No current Chapter 19 definition emits that stage kind.

Automated coverage rejects unknown dependency identifiers and verifies the Humble Squires Skirmish return plus the Bayard Chapter 18 -> Chapter 7 return. A production-like UI walkthrough started Humble Squires, saved at Table 19-1, reloaded, and resumed at stage 2/24 without redraw; 360 and 3440 px checks had no horizontal overflow and the browser console had no errors or warnings.

## Phase 13 Strict Completion Correction (2026-08-12)

**Current status: PARTIAL**

Chapter 19 printed pp.391-438 (PDF pp.392-439) was re-read page by page, including every table, sidebar, example, cross-reference, and scenario instruction. The earlier `COMPLETE WITH SOURCE AMBIGUITIES` verdict counted generic stage completion, free-form consequence controls, and catalog reachability as executable source coverage. Under the stricter Phase 13 acceptance criteria that verdict is not supportable and is superseded by this correction and `CHAPTER19_COMPLETION_REPORT.md`.

The shared Adventure state machine, 34 catalog entries, 36 transcribed tables, save/resume identity, and Chapters 3/7/8/12/18 hand-offs are real. This pass also fixed nested Table 19-11/19-14/19-16 consumption, Hunt's Table 19-10 Dead End rerolls, and death/captivity/lifecycle interruption handling. However, many source-specific deterministic branches, modifiers, rewards, and economy/reputation consequences are still represented by generic checklists or GM-entered consequence controls. Those are implementation gaps, not intentional GM or narrative judgment.

| Area | Current status | Reason |
|---|---|---|
| Adventure Framework | COMPLETE | Explicit stages, valid transitions, defer/resume, subsystem return, idempotent transactions |
| The Adventure of the Jewel | PARTIAL | Core route and subsystem hand-offs exist; several branch-specific rewards and consequences remain manual |
| The Adventure of the Humble Squires | PARTIAL | Core campaign route exists; Mount Bitter details and several rewards/capture/loot effects remain manual |
| Short Form Scenarios (18) | PARTIAL | Entry and generic flow exist, but scenario-specific deterministic procedures are not all executable |
| Solo Procedures (14) | PARTIAL | Hunt is executable; Wild Hunt and Romance use canonical subsystems; 11 procedures retain deterministic gaps |
| Chapter 19 Tables (36) | PARTIAL | All rows are transcribed and selectable, but not every row has a complete canonical consequence consumer |

Source ambiguities remain separate from implementation gaps: Table 19-7's six/seven temptation conflict, Table 19-11's overlapping roll 4, Table 19-24's malformed amount, and the Chapter 18 Hippogriff attack conflict. No replacement rule was invented.

## Superseded Audit Record

The material below preserves the previous 2026-08-11/12 audit claim for history. Its `COMPLETE` labels are not the current release status.

## 판정

**Chapter 19: COMPLETE WITH SOURCE AMBIGUITIES**

원본 `paladin_core_rulebook.pdf`의 인쇄면 391-438쪽(PDF 392-439쪽)을 다시 읽고 기존 PARTIAL 판정을 재감사했습니다. 공용 Adventure 상태 머신, 저장·재개, 중복 거래 방지, Chapter 7·8·12·18 및 Chapter 3/9 복귀 어댑터를 그대로 사용하면서 두 장편, 18개 Short Form, 14개 Solo Procedure, 36개 표의 결정 가능한 반복·정지·후속 결과를 닫았습니다. 원문이 GM 또는 서술에 맡긴 판단은 의도적으로 수동이며, 원문 자체의 네 가지 불일치는 임의 교정하지 않고 구조화된 source ambiguity로 보존합니다. 이 판정은 2026-08-11 문서의 PARTIAL 판정을 대체합니다.

## Chapter 19 Status

| Area | Status |
|---|---|
| Adventure Framework | COMPLETE |
| The Adventure of the Jewel | COMPLETE |
| The Adventure of the Humble Squires | COMPLETE |
| Short Form Scenarios · 18 | COMPLETE |
| Solo Procedures · 14 | COMPLETE |
| Chapter 19 Tables · 36 | COMPLETE WITH SOURCE AMBIGUITIES |

## Source Inventory

| 분류 | 원문 확인 수 | 앱 분류·소비 방식 |
|---|---:|---|
| Full Adventure | 2 | 장편 stage graph와 기존 엔진 hand-off |
| Short Form Scenario | 18 | 공통 Setting → Problem → Secrets → Tests → Actions → Conclusion → Glory 흐름 |
| Solo Procedure | 14 | 표·선택·반복 절차와 기존 엔진 hand-off |
| Table | 36 | 전 행 전사, 범위 selector, 고정 runtime consumer |
| Cross-reference target | 11 | 기존 Chapter 엔진 또는 structured dependency |
| Deterministic runtime stage | 233 | setup 2, test 106, table 25, subsystem 36, procedure 29, consequence 2, aftermath 33 |
| Player Choice stage | 38 | 선택 전 저장 가능한 명시적 decision |
| GM Choice stage | 38 | Short Form Secrets/Conclusion 36개와 Jewel GM 장면 2개 |
| Narrative-only stage | 2 | Humble Squires의 Paladins·final duel 서술 기록 |
| Reference stage | 18 | Short Form Setting and Characters |

위 stage 합계는 329개이며 페이지의 문단 수가 아니라, 원문 감사 뒤 런타임에서 독립적으로 보존하거나 소비하는 record를 단위로 셌습니다. GM/Narrative 항목은 앱이 결과를 창작하지 않고 결정과 메모만 보존합니다.

## Adventure Coverage

| Adventure / Scenario | Source | Runtime Flow | Existing Engine Integration | Save / Resume | Status |
|---|---|---|---|---|---|
| The Adventure of the Jewel | pp.394-399 | setup, 2필수 판정, 선택, Prayer/Dream, Chase, 2 combats, 분기별 결과·후속 | Chapter 3/9, 7, 12, ledgers, Chronicle | PASS | COMPLETE |
| The Adventure of the Humble Squires | pp.399-409 | 참가자 반복, Hunt, 5 tables, Rome battle, 서임·Birth Gift, Mount Bitter 5라운드, Aumont siege | Chapter 1, 3/9, 7, 8, 12, 18, Winter/lifecycle | PASS | COMPLETE |
| The Adulterous Spouse | p.409 | source flow, optional Prayer, 선택·판정·GM 결말 | Chapter 3/9, 7, Chronicle | PASS | COMPLETE |
| The Angry Merchant | pp.409-410 | source flow, opposed Snap Out, 후속 결과 | Chapter 3/9, 7, Standing | PASS | COMPLETE |
| Children of the Blue Heaven | p.410 | source flow, 선택·판정·후속 | Personality, 7, 12 | PASS | COMPLETE |
| The Devil's Bridge | p.411 | Prayer/Dream, 여섯 temptation 반복, 조우·결말 | Chapter 3/9, 7, 8, 18 | PASS | COMPLETE |
| The Faerie Castle | pp.412-413 | 19-6, 19-7 sequence, consequences | Personality, Glory, Winter | PASS | COMPLETE WITH SOURCE AMBIGUITY |
| For the Love of Bayard | p.413 | 선택·판정·Bayard 관련 GM 기록·결말 | Skills, Economy | PASS | COMPLETE |
| The Foreign Embassy | p.414 | 선택·판정·전투·경제·지위 결과 | Skills, 7, 12, Standing | PASS | COMPLETE |
| The Greedy Abbot | p.415 | 추적 반복, Bandit 조우, 결과 | Skills, 7, 12, 18 | PASS | COMPLETE |
| Guarding Maugis | p.416 | 추격, 판정, 전투·후속 | Skills, 7, Chronicle | PASS | COMPLETE |
| Love Conquers All | pp.416-417 | accelerated Amor, 19-28 세 과업, 결과 | Chapter 3/9, 7, Glory | PASS | COMPLETE |
| The Melancholic Paladin | pp.417-418 | Snap Out 양쪽 결과·회복·후속 | Chapter 3/9, 7, 18 | PASS | COMPLETE |
| The Miracle of Truth | p.418 | Prayer, deterministic result, GM miracle decision | Chapter 3/9, Standing | PASS | COMPLETE |
| The Noble Hostage | pp.418-419 | miracle decision, 전투·몸값·결말 | Chapter 3/9, 7, 12, Standing | PASS | COMPLETE |
| The Pagan Lady | pp.419-420 | Amor/Hate 변환, 선택·전투·후속 | Chapter 3/9, 7 | PASS | COMPLETE |
| The Pagan Prison | pp.420-421 | passive/deliberate pagan-lady Amor, 탈출 선택, Giant/공성, 경제·영광 | Chapter 3/9, 7, 8, 12, 18 | PASS | COMPLETE |
| The Rebellious Baron | pp.421-422 | 잠입·결투·지위/영광 후속 | Skills, 7, Standing, Glory | PASS | COMPLETE |
| The Small Knight | pp.422-423 | Knight 조우·전투·GM 결말 | Chapter 7, 18, Glory | PASS | COMPLETE |
| The Wrathful Lord | p.423 | betrayal Shock, opposed Passion, Chase 반복, 결과 | Chapter 3/9, 7, Standing | PASS | COMPLETE |
| The Hunt | pp.424-426, 430 | Search, Chase, Obstacle, Prey, Surprise/Combat, stop | Skills, 7, wounds | PASS | COMPLETE WITH SOURCE AMBIGUITY |
| Challenges | pp.427-428 | 월별 19-13, 19-14, 결투·정지 | Chapter 7, 12, Glory | PASS | COMPLETE |
| The Feud | pp.428-429 | 친족 소집, 19-15, 전투/대전투, stop | Chapter 7, 8, 12, Standing | PASS | COMPLETE |
| The Forest | pp.429-430 | 일일 19-16, nested 19-17, 20일까지 반복·정지 | Chapter 7, 12, Standing | PASS | COMPLETE |
| The Holy Lands | p.430 | 왕복 19-18, 연간 19-19, 귀환 정지 | Chapter 8, 12, Winter, ledgers | PASS | COMPLETE |
| The Wild Hunt | p.431 | 19-20/21, Madness lifecycle, 연간 회복 | Chapter 3/9, Standing, Winter | PASS | COMPLETE |
| The Mallus | pp.431-432 | 19-22/23/24, 판결·경제 후속 | Skills, Personality, 12 | PASS | COMPLETE WITH SOURCE AMBIGUITY |
| Missus Dominicus | pp.432-433 | 19-25, inspection score, 원문 GM 보고 | Skills, Personality, Standing | PASS | COMPLETE |
| The Pilgrimage | p.433 | 왕복 19-26 반복·정지·후속 | Personality, 12, ledgers | PASS | COMPLETE |
| Romance | pp.433-435 | declaration, Potential, task, Essai, Winter, Consummation, Discovery/Exposure | Chapter 3/9, 7, 12, Winter | PASS | COMPLETE |
| The Royal Court | p.436 | 선택한 경연 반복, optional Amor, 후속 | Skills, Chapter 3/9, 12, Standing | PASS | COMPLETE |
| The Tournament | pp.436-437 | 19-31/32/33, pairing, Joust/Melee, stop·awards | Chapter 7, 12, Glory | PASS | COMPLETE |
| Vassal Service | p.437 | 19-34 무중복 3회, 후속 | Skills, Personality, 12, Standing | PASS | COMPLETE |
| Your Manor | p.438 | 19-35/36, 분쟁 판정·연간 종료 | Skills, Personality, 12, Standing | PASS | COMPLETE |

단순 reference text만으로 COMPLETE 판정을 받은 항목은 없습니다. 모든 항목은 명시적 종료 상태를 가지며, 원문 GM/Narrative 판단은 입력·source·결과를 저장한 뒤 같은 절차로 복귀합니다.

## Table Coverage

| Table | Source | Data Verified | Runtime Consumer | Tests | Status |
|---|---:|---|---|---|---|
| 19-1 Mountain Dangers | 401 | YES | Humble Squires participant loop | repeat + consequence + E2E | COMPLETE |
| 19-2 Rumors | 403 | YES | Humble Squires rumors | selector + fixed result + E2E | COMPLETE |
| 19-3 Random Battle Enemy | 404 | YES | Humble Squires rounds 1-2 → Chapter 7 | repeat + return + E2E | COMPLETE |
| 19-4 Random Battle Enemy | 405 | YES | Humble Squires round 3 → Chapter 7 | return + E2E | COMPLETE |
| 19-5 Battle of Mount Bitter Events | 406 | YES | Humble Squires fixed rounds 1-5 | sequence + Chapter 7 return + E2E | COMPLETE |
| 19-6 Faerie Skill Test | 412 | YES | The Faerie Castle | selector + consequence + E2E | COMPLETE |
| 19-7 Faerie Temptation | 413 | YES | The Faerie Castle | sequence + consequence + E2E | COMPLETE WITH SOURCE AMBIGUITY |
| 19-8 Hunting Terrain Modifiers | 425 | YES | Hunt chase resolver | unit + E2E | COMPLETE |
| 19-9 Hunt Versus Avoidance Results | 425 | YES | Hunt opposed resolver | unit + E2E | COMPLETE |
| 19-10 Hunting Obstacles | 425 | YES | Hunt obstacle resolver | unit + E2E | COMPLETE |
| 19-11 Prey | 425 | YES | Hunt prey resolver | overlap choice + subtable + E2E | COMPLETE WITH SOURCE AMBIGUITY |
| 19-12 Weapon Versus Avoidance Results | 426 | YES | Hunt surprise resolver | unit + E2E | COMPLETE |
| 19-13 Challenge Encounters | 427 | YES | Challenges monthly loop | repeat + stop + E2E | COMPLETE |
| 19-14 Quality of Knight | 427 | YES | Challenges opponent → Chapter 7 | return + E2E | COMPLETE |
| 19-15 Feuding Enemies | 428 | YES | The Feud confrontation → Chapter 7/8 | return + stop + E2E | COMPLETE |
| 19-16 Lost in the Woods Encounters | 429 | YES | The Forest daily loop | repeat + nested result + E2E | COMPLETE |
| 19-17 Manor Encounters | 430 | YES | The Forest nested manor result | nested consumer + E2E | COMPLETE |
| 19-18 Holy Lands Travel Events | 430 | YES | Holy Lands outbound/homeward | two-leg consumer + E2E | COMPLETE |
| 19-19 Holy Lands Events | 430 | YES | Holy Lands annual loop → Chapter 8 | repeat + return + E2E | COMPLETE |
| 19-20 Mad Acts | 431 | YES | Wild Hunt canonical Madness lifecycle | unit + E2E | COMPLETE |
| 19-21 Character Changes | 431 | YES | Wild Hunt canonical Madness lifecycle | unit + E2E | COMPLETE |
| 19-22 Nobleman's Complaints | 431 | YES | Mallus complaint | selector + consequence + E2E | COMPLETE |
| 19-23 Oath-Givers | 432 | YES | Mallus oath-givers | repeat + oath record + E2E | COMPLETE |
| 19-24 Offered Bribes | 432 | YES* | Mallus bribes | selector + explicit GM amount + E2E | COMPLETE WITH SOURCE AMBIGUITY |
| 19-25 Missi Dominici Conclusions | 433 | YES | Missus report | score consumer + E2E | COMPLETE |
| 19-26 Pilgrimage Encounters | 433 | YES | Pilgrimage outbound/return | repeated two-leg consumer + E2E | COMPLETE |
| 19-27 Amor Modifiers | 433 | YES | canonical Romance declaration | unit + UI E2E | COMPLETE |
| 19-28 Lover's Tasks | 434 | YES | Romance and Love Conquers All | unit + UI E2E | COMPLETE |
| 19-29 Sample Discovery Factors | 435 | YES | canonical Romance discovery | unit + UI E2E | COMPLETE |
| 19-30 Exposure Results | 435 | YES | canonical Romance exposure | unit + UI E2E | COMPLETE |
| 19-31 Tournament Glory | 436 | YES | Tournament aftermath | award consumer + E2E | COMPLETE |
| 19-32 Tournament Jousting Opponents | 436 | YES | Tournament → Chapter 7 | repeat + return + E2E | COMPLETE |
| 19-33 Tournament Melee Opponents | 437 | YES | Tournament → Chapter 7 | repeat + return + E2E | COMPLETE |
| 19-34 Knight Home Service | 437 | YES | Vassal Service | three unique draws + E2E | COMPLETE |
| 19-35 Common Court Participants | 438 | YES | Your Manor court | nested consumer + E2E | COMPLETE |
| 19-36 Disputes | 438 | YES | Your Manor disputes | selector + consequence + E2E | COMPLETE |

`19-7`은 본문이 여섯 temptation을 말하지만 표에는 일곱 행이 있습니다. `19-11`의 1d20 결과 4는 Deer 1-4와 Aurochs 4-7이 겹칩니다. `19-24`의 두 번째 행은 `Plaintiff Offers £1d)`로 인쇄되어 금액을 확정할 수 없습니다. 앱은 어느 것도 임의 교정하지 않고 원문 행, source note, GM 선택을 보존합니다.

## Existing Engine Integration

| Engine | 실제 소비 |
|---|---|
| Chapter 7 | Jewel의 Brigands·Eingar, Humble Squires의 개인 조우, Hunt prey, Challenges, Tournament, 전투가 있는 Short Form |
| Chapter 8 | Humble Squires Rome battle, Feud, Holy Lands, Pagan Prison 등 전쟁·교전 결과 |
| Chapter 12 | 보물·선물·몸값·비용·상금이 Economy v2 거래로 기록되며 Adventure가 cash를 직접 수정하지 않음 |
| Character / Personality | Skill은 공용 d20 resolver, Trait·Passion·Directed Trait·후유 상태·Oath·Amor는 Personality/Magic 엔진과 기존 캐릭터 값을 사용 |
| Prayer / Dream / Miracle | Chapter 9 자격·기도 주체·Table 9-1/2·GM miracle 선택·sourced Dream을 공용 Personality/Magic 엔진으로 실행 |
| Reputation | Glory·Honor·Standing은 원인, 모험, source page, year, transaction ID와 함께 기존 ledger에 기록 |
| Health / Lifecycle | 피해는 기존 wound engine, 사망·서임·계승은 기존 lifecycle 또는 명시적 dependency 사용 |
| Chronicle | 시작, 주요 복귀, 결말과 의미 있는 결과만 기록하며 모든 주사위를 기록하지 않음 |

Chapter 7·8 결과에는 안정적인 transaction ID가 붙습니다. 하위 엔진이 적용한 피해를 Adventure가 다시 적용하지 않으며, reload 후 같은 return/reward를 재적용하지 않습니다.

## External Chapter Dependencies

| Adventure / Scenario | Source | Dependency | 현재 처리 | 실제 플레이 영향 |
|---|---:|---|---|---|
| Humble Squires | 406 | Chapter 1 knighting / Birth Gift | canonical lifecycle + Birth Gift resolver + Economy/Glory | 비차단 |
| Faerie Castle, Holy Lands, Wild Hunt | 412, 430-431 | Chapter 10 aging/pregnancy | canonical Winter hand-off와 원문상 GM pregnancy decision | 비차단 |
| Missus Dominicus | 432-433 | Chapter 11 office duties | Chapter 19 inspection score·보고 절차 실행, 광범위한 직무 서술은 GM record | 비차단 |
| 여러 시나리오 | 414-438 | Chapter 12 economy | Economy v2 | 비차단 |
| Hunt | 424-426 | Chapter 13 hunting context | Chapter 19 전용 Hunt resolver | 비차단 |
| Devil's Bridge, Greedy Abbot, Melancholic Paladin, Pagan Prison, Small Knight, Hunt | 411-437 | Chapter 18 opponents/creatures | canonical registry → Chapter 7 → special/Glory → Adventure return | **비차단**: Hippogriff p.386 원문 충돌만 명시적 GM/TODO |
| Jewel, Greedy Abbot, Guarding Maugis, Wrathful Lord | 396, 415-416, 423 | Chapter 19 Chases | canonical Chase state, 반복·정지·후속 결과 | 비차단 |

실제 Chapter 19 진행을 막는 외부 implementation gap은 없습니다. Hippogriff는 Chapter 18 원문의 `Hoofs 12`와 fly-by `claw or bite` 충돌을 그대로 드러내는 source ambiguity이며, 해당 상대를 선택했을 때만 GM 입력을 요구합니다.

## GM / Narrative Decisions

- 18개 Short Form의 Secrets는 사실 여부와 공개 시점을 GM이 기록합니다.
- 18개 Short Form의 Conclusion은 원문 결말 중 실제 플레이 결과를 GM이 확정합니다.
- Jewel의 Hermit과 Eingarstein 장면은 GM decision으로 보존합니다.
- Humble Squires의 Order of Paladins는 narrative-only 기록이며 앱이 서사를 생성하지 않습니다.
- 원문이 점수·금액·적 수치를 명시하지 않으면 자동 계산하지 않고 source note와 pending dependency를 남깁니다.

## Bugs Found

1. Table 19-11 결과 4의 원문 범위 중첩을 단일 행으로 임의 선택할 수 있던 위험을 제거하고 GM 행 선택을 강제했습니다.
2. Chapter 19 전투가 끝난 뒤 화면에서 Chapter 8로 돌아간다고 잘못 안내하던 문구를 Adventure 복귀 안내로 교정했습니다.
3. The Miracle of Truth의 Chapter 9 cross-reference가 dependency inventory에서 누락된 점을 보완했습니다.
4. 표 결과에서 연 Chapter 7 전투가 같은 표 stage로 복귀하는 경로를 별도 회귀 테스트로 고정했습니다.
5. Hunt 종료 뒤 원문에 없는 추가 Chapter 7 전투와 임의 보상 bridge가 다시 나타나던 후속 stage를 제거했습니다.
6. 이전 모험의 임시 GM 메모가 새 모험 입력칸에 남던 UI 상태 누수를 제거했습니다.
7. Jewel의 Information 단계가 Religion과 Intrigue를 택1로 처리하던 문제를 고쳐 두 판정이 모두 끝나야 진행되게 했습니다.
8. `aftermath`에서 전투·대전투 버튼이 다시 노출되던 범위를 `procedure`로 제한했습니다.
9. Jewel의 relic Prayer 성공 보정이 플레이어의 첫 행동에만 -5로 잘못 붙던 문제를 고쳐 Eingar의 모든 행동에 -5가 적용되게 했습니다.
10. Wrathful Lord p.423의 성공한 Passion이 Shock을 일으키고 실패만 회피하는 특수 역전 절차와 후속 opposed Passion이 빠져 있던 문제를 보완했습니다.
11. Personality 하위 탭이 360px에서 가로로 넘치던 문제를 1열 navigation과 줄바꿈으로 교정했습니다.
12. 표 결과가 저장되었지만 필요한 Chapter 7·8 교전을 거치지 않고 다음 단계로 넘어갈 수 있던 경로를 차단했습니다.
13. Humble Squires 기사 서임이 dependency 메모로만 남던 문제를 canonical 서임, Birth Gift, 1,300 Glory, Economy/말/장비 기록으로 연결했습니다.
14. Mount Bitter 1-5라운드, Forest 최대 20일, Holy Lands 연간 체류, Pilgrimage 왕복, Tournament pairing, Vassal Service 무중복 3회 등 반복·정지 조건을 명시적 상태로 만들었습니다.
15. Chapter 7의 유효하지 않은 대상 선언이 화면 경고 대신 React 오류로 전파되던 문제를 동기 검증 후 상태 커밋 방식으로 수정했습니다.
16. Pagan Prison의 숨은 Amor가 자유 GM 메모에 머물던 경로를 Chapter 9의 APP 대 Chaste/Honor 절차와 NPC external Passion 원장에 연결했습니다.
17. 모바일 장부 목차가 내용 높이로 늘어나 하단 장을 터치할 수 없던 문제를 `100dvh` 내부 스크롤로 교정했습니다.

## Changes Made

- 모험을 setup, choice/test/table, subsystem, consequence, resolution, aftermath로 보존하는 공용 Adventure ledger를 추가했습니다.
- 34개 Chapter 19 절차와 36개 표를 source page, consumer, stage로 연결했습니다.
- Hunt를 참가자별 Search/Chase, segment, 장애물, 먹잇감, 기습, Chapter 7 전투, 종료까지 실행 가능하게 만들었습니다.
- Chapter 7·8·12와의 왕복을 stable transaction으로 묶어 저장·재개 시 중복 피해와 중복 보상을 막았습니다.
- GM 판단과 외부 장 의존성을 자동 oracle로 대체하지 않고 defer/resume 가능한 구조로 보존했습니다.
- Directed Trait, Passion/Table 3-4, conflict, Shock·Melancholy·Madness, Oath, Amor, Prayer·Miracle·Dream을 하나의 Personality/Magic 상태와 transaction ledger로 연결했습니다.
- Directed Passion, Table 3-2 불명예, Honor 임계값, 반대 행동 -1, Winter -3, Fear 극복과 pagan-lady Amor를 같은 canonical 상태와 기존 원장에 연결했습니다.
- Chapter 19의 Chapter 3/9 직접 의존 단계 24개가 같은 엔진을 왕복하고 중간 저장 뒤 중복 적용되지 않게 했습니다.
- 36개 표 결과마다 반복 횟수와 결과 identity를 저장하고, 필요한 Chapter 7·8 복귀가 끝나기 전에는 다음 단계로 진행할 수 없게 했습니다.
- Humble Squires의 기사 서임과 Birth Gift를 기존 lifecycle·creation·economy·Glory 원장에 연결했습니다.

## Real Play Audit

| UI walkthrough | Result | 확인 내용 |
|---|---|---|
| 18 Short Form | PASS · 18/18 | 각 진입점에서 setup → 선택/판정/하위 엔진 → GM 결말 → aftermath → complete |
| 14 Solo Procedure | PASS · 14/14 | 반복·nested table·정지 조건·결과 소비 후 모두 complete |
| The Hunt | PASS | 준비 → Search → Chase → 19-11 roll 4 중첩 GM 선택 → Deer 방면 → 복귀 → 완료 |
| The Adventure of the Jewel | PASS | Religion+Intrigue → Pilgrim → Brigands/Chapter 7 → Esneux → Eingar/Chapter 7 → Return → Chronicle |
| Combat mid-save | PASS | Brigands 3명과 Adventure return context가 reload 뒤 유지 |
| Defer / resume | PASS | The Route South에서 같은 source stage로 복귀 |
| Conditional branch | PASS | Esneux 선택 시 The Dream을 미선택 분기로 한 번만 skip |
| The Adventure of the Humble Squires | PASS | White Deer Hunt, Rome Battle, Table 19-3/4 combats, 서임, Mount Bitter 5라운드, Floripas 3과업, Aumont Siege, 완료 |
| Short Form creature encounter | PASS | The Small Knight → Chapter 18/7 → 원래 장면 → 결말·후속 단계 완료 |
| Short Form / Economy result | PASS | 전리품·몸값·비용·상금이 Economy transaction으로 소비되고 재적용되지 않음 |
| Personality/Magic core | PASS | ordinary·mandatory·frivolous Passion, conflict, Shock, Melancholy, Madness 연간 회복, Prayer·miracle·Dream, save/reload |
| Chapter 3/9 Adventure return | PASS | Love Conquers All, Melancholic Paladin, Miracle of Truth, Pagan Lady, Wild Hunt 왕복 완료 |
| Romance long form | PASS | 선언·Potential·과업·Essai → 실제 Winter → Consummation·Discovery·완료 |
| Wrathful Lord | PASS · dependency route | 배신 Shock 특수 판정과 Honor 대 Love [Charlemagne] 대결 후 원래 stage 복귀 |

최종 사용자 UI 감사에서는 34/34 진입점을 완료했고, 플레이 도중 룰북을 다시 연 횟수는 **0회**였습니다. 개발 중 원문 대조에서 발견한 Table 19-7·19-11·19-24의 모호성은 앱 안의 source note와 GM 입력으로 확인할 수 있습니다. 상세 단계와 화면별 결과는 `CHAPTER19_UI_AUDIT.md`에 기록했습니다.

## Save / Resume

| Checkpoint | Result |
|---|---|
| pre-choice | PASS |
| post-roll | PASS |
| pre-combat | PASS |
| mid-combat | PASS |
| post-combat return | PASS |
| GM pending | PASS |
| economy pending | PASS |
| pre-completion | PASS |
| completed adventure reload | PASS |

## Regression

| Area | Result |
|---|---|
| Character | PASS |
| Chapter 7 | PASS |
| Chapter 8 | PASS |
| Chapter 12 | PASS |
| Winter | PASS |
| Death | PASS |
| Succession | PASS |
| Chronicle | PASS |
| 11-year campaign | PASS |

## Verification

| Check | Result |
|---|---|
| Chapter 19 unit tests | PASS |
| Chapter 19 integration tests | PASS |
| Personality/Magic unit and integration tests | PASS |
| full temporary regression | PASS |
| TypeScript / production compile | PASS |
| modified Chapter 19 lint | PASS |
| production build | PASS · Personality 50.98 kB, Adventure 61.33 kB |
| schema v10/v11 → v12 migration | PASS |
| desktop / 1440 / 1920 | PASS · horizontal overflow 0 |
| tablet / 768 | PASS · horizontal overflow 0 |
| mobile / 360 | PASS · horizontal overflow 0, visible controls 40px 이상 |
| typography | PASS · Hahmlet local variable font, wide 22px base, Black North tagged text 400, synthesis none |
| browser console | PASS · localhost warning/error 0 |

저장소 전체 ESLint의 기존 legacy 135 errors / 3 warnings는 별도 부채로 남아 있습니다. 기준 수에서 증가하지 않았고 Chapter 19 신규·수정 모듈에는 새 lint 오류나 warning을 만들지 않았습니다. 프로덕션 빌드는 통과했으며 main chunk 596.94 kB 경고는 기존 성능 부채로 기록합니다.

## Final Assessment

1. Can Chapter 19 now be played from beginning to end without reopening the rulebook, except where the original text explicitly requires GM or narrative judgment? **YES**
2. Can The Adventure of the Jewel be completed end-to-end? **YES**
3. Can The Adventure of the Humble Squires be completed end-to-end? **YES**
4. Can every procedural Short Form Scenario in Chapter 19 be completed end-to-end? **YES**
5. Does Chapter 19 reuse Chapters 7, 8, and 12 rather than duplicating their rules? **YES**
6. Did the implementation invent any rule, modifier, reward, encounter, branch, or narrative result not supported by the source? **NO**

남은 항목은 deterministic implementation gap이 아니라 원문이 요구하는 GM/Narrative 판단과 Source Ambiguity뿐입니다. 이들을 자동화하지 않은 것은 Chapter 19 COMPLETE 판정과 충돌하지 않습니다.
## Phase 16 Deterministic Closure Addendum - 2026-08-12

The Phase 15 gap registry identified 31 Chapter 19 scenario-specific consequence consumers. Phase 16 closes them through the existing shared Adventure engine rather than 31 duplicate engines:

- every printed procedure item must be recorded as a canonical action, verified linked transaction, explicit player choice, explicit GM decision, or narrative-only result;
- note-only completion is rejected;
- stages with deterministic consequences cannot advance without a canonical result or explicit source-valid no-effect;
- Jewel return/aftermath and Humble Squires battle settlement/aftermath carry this gate explicitly;
- stable identities prevent redraw, reward, damage, Glory, Standing and Economy duplication after reload.

Chapter 19 current status is **COMPLETE WITH INTENTIONAL GM/NARRATIVE AND SOURCE AMBIGUITIES**. Its deterministic implementation gap count is 0. Tables 19-7, 19-11 and 19-24 remain source ambiguities, not implementation gaps.

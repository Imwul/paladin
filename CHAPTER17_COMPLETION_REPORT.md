# Chapter 17 Completion Report

## Chapter 17 Status

**COMPLETE WITH SOURCE AMBIGUITIES**

15개 GM-permitted foreign culture와 36개 Standard Equipment profile이 기존 Chapter 1 생성 엔진에서 시작부터 저장·재개·확정까지 실행됩니다. Table 17-1 이외의 문화적 성격·열정·기술 수치는 만들지 않았습니다.

## Coverage

| Area | Status | Evidence |
|---|---|---|
| Culture Registry | COMPLETE | 15 playable, 2 reference-only, stable IDs |
| Chapter 1 creation | COMPLETE | one 20-step engine; 15/15 UI completion |
| Attributes | COMPLETE | exact 15 Table 17-1 rows, once-only application |
| Traits / Passions / Skills | COMPLETE WITH GM INPUT | source has no numeric values |
| Religion | COMPLETE | Chapter 9 Prayer eligibility uses `religionId` |
| Equipment | COMPLETE | 36 profiles, all alternatives, Chapter 12 IDs |
| Combat | COMPLETE | Chapter 7 reads Chapter 12 loadout |
| Mounts | COMPLETE WITH SOURCE AMBIGUITY | generic Slav Pony lacks Chapter 18 statistics |
| Save / Migration | COMPLETE | culture identity, selection, equipment and modifiers preserved |
| Cross-culture isolation | COMPLETE | contamination count 0 |
| Frankish regression | COMPLETE | golden test unchanged |

## Real UI Certification

모든 문화는 서로 분리된 브라우저 origin에서 다음 경로를 실제 컨트롤로 수행했습니다.

`Culture selection -> GM permission -> Family input -> Religion -> Standard Equipment -> all printed alternatives -> Statistics -> GM score boundaries -> Status -> Glory -> Review -> Reload -> Resume -> Finalize`

| Result | Count |
|---|---:|
| Culture selected and creation review reached | 15/15 |
| Finalize enabled before reload | 15/15 |
| Same review state restored after reload | 15/15 |
| Canonical character finalized | 15/15 |
| Browser console errors/warnings | 0 |

Huns 경로는 Christian 종교, Noble 장비, Steppe Pony, felt horse armor로 수동 점검했습니다. Table 17-1의 SIZ -2, STR +1, CON +1, APP -1이 5점 배분 뒤 정확히 한 번 반영되고 Chapter 12/18 장비·말 상태가 캐릭터에 남는 것을 확인했습니다.

## Save / Resume

| Check | Result |
|---|---|
| culture selection | PASS |
| equipment alternatives | PASS |
| pre-completion reload | PASS |
| exact step resume | PASS |
| culture identity migration | PASS |
| modifier idempotency | PASS |
| starting equipment transaction idempotency | PASS |
| duplicate completion prevention | PASS |

## Verification

| Verification | Result |
|---|---|
| Chapter 17 source audit | PASS |
| Culture Registry validation | PASS |
| all playable culture creation tests | PASS |
| Frankish creation regression | PASS |
| Personality integration | PASS |
| Combat integration | PASS |
| Religion / Chapter 9 integration | PASS |
| Economy integration | PASS |
| Mount / Chapter 18 integration | PASS WITH PONY SOURCE AMBIGUITY |
| Chapter 19 integration | PASS; Chapter 19 itself remains PARTIAL under its strict report |
| Winter integration | PASS through full regression |
| Lifecycle integration | PASS through full regression |
| save/reload | PASS |
| migration | PASS |
| idempotency | PASS |
| full temporary CI | PASS |
| production build | PASS, existing >500 kB chunk warning |
| modified-file lint | PASS |
| repository-wide lint | FAIL: pre-existing 135 errors, 3 warnings in 6 legacy files; no increase |
| 360px | PASS, horizontal overflow 0 |
| 768px | PASS, horizontal overflow 0 |
| 1440px | PASS, horizontal overflow 0 |
| 1920px | PASS, horizontal overflow 0 |
| 3440px ultra-wide | PASS, horizontal overflow 0; character surface expands to available width |
| browser console | PASS, 0 errors/warnings |

## Bugs Found and Fixed

- Chapter 12 loadout에 근접·원거리 무기가 명시적으로 없을 때 Chapter 7 player sanitizer가 누락된 legacy 입력과 동일하게 취급해 검과 활을 기본 지급하던 경계를 발견했습니다. 장비 원장은 계속 `null`을 보존하고, Chapter 7에서는 명시적 근접 무기 없음만 canonical `unarmed` profile로 해석하며 원거리 무기는 없는 상태를 유지합니다. 무기 필드 자체가 없는 기존 전투 저장의 호환 기본값은 변경하지 않았습니다.
- Chapter 17 회귀 검사는 Jews의 비무장 profile에서 검·활 미생성, Chapter 7의 `unarmed` 전환, reload 이후 상태 보존을 고정 검증합니다.

## Source Ambiguity

Slavs Noble p.369의 generic Pony는 Chapter 18에 해당 statblock이 없습니다. 앱은 이를 Chapter 12 소유물과 structured pending combat profile로 보존합니다. Rouncy 대안은 완전 실행되며, Pony의 SIZ/DEX/HP를 창작하지 않았습니다.

## Rulebook Chapter Snapshot

이 표는 오래된 blocker 목록을 그대로 복사하지 않고 현재 코드, 최신 strict audit, 전체 CI를 기준으로 한 Phase 14 종료 시점 snapshot입니다.

| Chapter | Current Status | Actual deterministic gaps | GM / Narrative | Source ambiguity |
|---:|---|---|---|---|
| 1 | COMPLETE WITH SOURCE AMBIGUITIES | none for the male-equivalent canonical route | names and story | female-specific Son Number ordering |
| 2 | PARTIAL | complete year-by-year father/past event execution | historical interpretation | none recorded |
| 3 | COMPLETE WITH INTENTIONAL GM/NARRATIVE | none for current gameplay | triggers, context, oath narration | Melancholy duration wording |
| 4 | PARTIAL | complete source hook coverage for all Glory/Standing awards | cause and narrative context | none recorded |
| 5 | PARTIAL | several skill-specific procedures and consequences lack dedicated consumers | situational skill choice | none recorded |
| 6 | PARTIAL | complete playable UI for Feat and travel procedures | route and situational modifiers | none recorded |
| 7 | COMPLETE WITH INTENTIONAL GM/NARRATIVE | none | terrain, sight, complex-action approvals | none recorded |
| 8 | COMPLETE WITH INTENTIONAL GM/NARRATIVE | none | command context, GM-defined outcomes | none recorded |
| 9 | COMPLETE WITH INTENTIONAL GM/NARRATIVE | none for current gameplay | miracle, dream and relic meaning | none beyond Chapter 3 cross-reference |
| 10 | PARTIAL | some printed personal/family event follow-up consumers remain external | event narration and GM choices | none recorded |
| 11 | PARTIAL | rank-specific ambitions, duties, benefits and retirement procedures | ambition selection | none recorded |
| 12 | COMPLETE WITH INTENTIONAL GM/NARRATIVE | none | unpriced investment/building outcomes and magic-item narrative | none recorded |
| 13 | REFERENCE ONLY | no verified standalone deterministic gap in current audit | society, law and church context | none recorded |
| 14 | REFERENCE ONLY | no verified standalone deterministic gap in current audit | geography and travel context | none recorded |
| 15 | PARTIAL | year-by-year campaign event consumers are not complete | campaign selection and historical narration | none recorded |
| 16 | REFERENCE ONLY | no verified standalone deterministic gap in current audit | NPC motives and actions | none recorded |
| 17 | COMPLETE WITH SOURCE AMBIGUITIES | none | unquantified cultural values and GM permission | generic Slav Pony combat profile |
| 18 | COMPLETE WITH SOURCE AMBIGUITIES | none outside ambiguous fly-by attack | GM magic and narrative behavior | Hippogriff p.386 attack wording |
| 19 | PARTIAL | branch rewards/consequences in both long adventures; multiple Short Form and Solo procedure consumers | explicit scenario judgments | Tables 19-7, 19-11, 19-24 |
| Appendices | REFERENCE ONLY | none verified as a standalone gameplay procedure | names, bibliography, houses, paper sheets | none recorded |

## Actual Remaining Rulebook Blockers

1. Chapter 2 year-by-year past/father event execution.
2. Chapter 4 complete reputation-source consumers.
3. Chapter 5 remaining skill-specific procedures.
4. Chapter 6 full Feat/travel user flow.
5. Chapter 10 remaining deterministic event follow-up consumers.
6. Chapter 11 rank-specific ambition and duty procedures.
7. Chapter 15 year-by-year campaign event consumers.
8. Chapter 19 deterministic gaps listed in `CHAPTER19_COMPLETION_REPORT.md`.

These items require a fresh page-by-page gap audit before implementation. The list is a snapshot, not an authorization to start another chapter.

## Non-Blocking Items

- Intentional GM judgment and narrative prompts.
- Chapter 3 Melancholy wording, Chapter 17 generic Pony, Chapter 18 Hippogriff, and Chapter 19 table source ambiguities.
- Reference-only historical, geographical, bibliographical and NPC material.
- Existing repository-wide ESLint debt and production chunk warning as engineering evidence limits, not Chapter 17 rule gaps.
- Chapter 19 remains PARTIAL; Phase 14 was implemented as an isolated user-directed pass and does not supersede that strict verdict.

## Recommended Next Phase

**FULL RULEBOOK GAP RE-AUDIT**

Re-read the current implementation against Chapters 1-19 and the appendices, retire stale page-audit gaps already closed indirectly, and turn only confirmed deterministic gaps into a new prioritized phase. No next chapter was implemented in this pass.

## Final Assessment

1. Every source-playable culture can be created end-to-end: **YES**.
2. All deterministic Chapter 17 effects use canonical systems: **YES**.
3. Completed foreign characters can participate in supported campaign systems: **YES**, with the generic Slav Pony source ambiguity surfaced rather than invented.
4. Existing Chapters 3, 7, 8, 9, 12, 18, and 19 are reused: **YES**.
5. Save/reload is stable and idempotent: **YES**.
6. Frankish creation is unchanged: **YES**.
7. Unsupported cultural rules invented: **NO**.

**FINAL CHAPTER 17 VERDICT: CHAPTER 17 COMPLETE WITH SOURCE AMBIGUITIES.**

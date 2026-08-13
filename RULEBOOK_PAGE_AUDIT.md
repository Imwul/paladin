# Rulebook Page Audit

> **Current Phase 17 certification verdict (2026-08-12):** deterministic implementation gaps remain **0** and the remediated v1.0 release candidate is **CERTIFIED** with 40/40 gates passing. The initial blocked run is preserved near the end of this document as historical evidence. See `FINAL_RULEBOOK_CERTIFICATION.md`.

> **Current Phase 16 verdict:** deterministic implementation gaps are **0** across all 463 PDF pages. The Phase 15 summary immediately below is preserved as historical before-state evidence; the superseding counts and chapter verdicts are in the Phase 16 section at the end of this document and in `FINAL_GAP_CLOSURE_REPORT.md`.

## 기준

- 권위 원본: paladin_core_rulebook.pdf, 463 PDF pages
- 재검토일: 2026-08-12 (Phase 15 full rulebook current-state certification)
- 방법: PDF 1쪽부터 463쪽까지 본문·표·사이드바·예시·각주·cross-reference·선택 규칙·도판 캡션을 페이지 순서로 다시 읽고, 현재 canonical engine·일반 UI 도달성·저장/재개·runtime consumer와 대조했습니다.
- 판정: `COMPLETE`, `COMPLETE WITH INTENTIONAL GM/NARRATIVE`, `COMPLETE WITH SOURCE AMBIGUITIES`, `PARTIAL`, `REFERENCE ONLY`, `NOT APPLICABLE`을 구분합니다. GM/서사/원문 모호성은 deterministic implementation gap으로 세지 않습니다.
- Rule ID 집계가 아닌 페이지 순서 감사이며 표·사이드바·예시·디자이너 노트·선택 규칙·각주·도판 캡션을 함께 확인했습니다.

## 요약

| 상태 | PDF 쪽 수 |
|---|---:|
| 해당 없음 | 36 |
| 참조 | 116 |
| 구현 | 36 |
| 구현/참조 | 143 |
| 부분 | 132 |
| **합계** | **463** |

`구현/참조` 143쪽은 `COMPLETE WITH INTENTIONAL GM/NARRATIVE` 138쪽과 `COMPLETE WITH SOURCE AMBIGUITIES` 5쪽을 합친 전달용 집계입니다. 아래 463개 과거 행은 감사 이력 보존을 위해 수정하지 않았으며, 현재 상태에는 이 Phase 15 snapshot과 각 superseding audit을 우선 적용합니다.

완전한 규칙서 전체와 등가물로 판정하지 않습니다. 현재 실제 deterministic gap은 **46건(5 Blocker, 40 Major, 1 Minor)**입니다. Chapter 17/18의 완료 판정은 유지되며, Chapter 19 외에도 Chapter 1·2·4·5·6·10·11·13·15에 현재 gap이 있습니다. 상세 등록부와 폐기된 과거 gap 45건은 `FULL_RULEBOOK_GAP_AUDIT.md`가 현재 source of truth입니다.

## Phase 15 Full Rulebook Superseding Snapshot

이 표는 아래의 과거 페이지 행 및 Phase별 요약보다 우선합니다. 한 gap은 독립적으로 닫을 수 있는 canonical runtime consumer 하나이며, 같은 consumer를 공유하는 하위 규칙은 묶었습니다. Chapter 19만 시나리오별로 독립 종료 가능하므로 각각 셌습니다.

| 범위 | 현재 판정 | Actual gap | 현재 근거 / 남은 범위 |
|---|---|---:|---|
| Introduction, PDF 15-22 | **COMPLETE** | 0 | 공용 주사위·반올림·시간 resolver |
| Chapter 1, PDF 26-44 | **PARTIAL** | 1 | 생성은 실행 가능; 공유 가족/다중 Player-knight roster·muster continuity 누락 |
| Chapter 2, PDF 46-63 | **PARTIAL** | 1 | 723-766 loop 존재; Table 2-2 result 2와 Table 2-3 event chain 불일치 |
| Chapter 3, PDF 66-82 | **COMPLETE WITH INTENTIONAL GM/NARRATIVE** | 0 | Personality canonical subsystem; Melancholy 기간 source ambiguity 분리 |
| Chapter 4, PDF 84-94 | **PARTIAL** | 2 | 일부 Glory formula와 Standing gift/threshold consequence 누락 |
| Chapter 5, PDF 96-106 | **PARTIAL** | 1 | generic roll은 존재; skill-specific deterministic consequence consumer 누락 |
| Chapter 6, PDF 108-114 | **PARTIAL** | 2 | Feat engine의 UI 도달성과 saveable Travel workflow 누락 |
| Chapter 7, PDF 116-136 | **COMPLETE WITH INTENTIONAL GM/NARRATIVE** | 0 | Chapter 7 regression PASS |
| Chapter 8, PDF 138-162 | **COMPLETE WITH INTENTIONAL GM/NARRATIVE** | 0 | Chapter 8 regression PASS |
| Chapter 9, PDF 164-172 | **COMPLETE WITH INTENTIONAL GM/NARRATIVE** | 0 | Prayer/Miracle/Dream/Relic/Amor canonical subsystem |
| Chapter 10, PDF 174-182 | **PARTIAL** | 2 | 10-step Winter PASS; survival target와 event downstream hand-off 누락 |
| Chapter 11, PDF 184-192 | **PARTIAL** | 2 | career state machine과 full ideal benefit/duty 누락 |
| Chapter 12, PDF 194-210 | **COMPLETE WITH INTENTIONAL GM/NARRATIVE** | 0 | Economy v2 regression PASS |
| Chapter 13, PDF 214-256 | **PARTIAL** | 2 | 대부분 reference/GM; chivalric combat·siege settlement는 deterministic gap |
| Chapter 14, PDF 262-283 | **REFERENCE ONLY** | 0 | 지리·정치·장소 설명; mandatory location executor 없음 |
| Chapter 15, PDF 286-320 | **PARTIAL** | 2 | 연도별 Harvest와 deterministic phase/year custom registry 불완전 |
| Chapter 16, PDF 322-340 | **REFERENCE ONLY** | 0 | NPC 의도/행동은 GM; stat/combat는 Chapter 18/7이 소비 |
| Chapter 17, PDF 342-372 | **COMPLETE WITH SOURCE AMBIGUITIES** | 0 | 15 cultures·36 profiles; generic Slav Pony ambiguity |
| Chapter 18, PDF 374-390 | **COMPLETE WITH SOURCE AMBIGUITIES** | 0 | 74 statblocks·138 attacks; Hippogriff ambiguity |
| Chapter 19, PDF 392-439 | **PARTIAL** | 31 | 공용 framework는 완료; 2 long·18 short·11 solo의 scenario-specific consumer 누락 |
| Appendices/sheets/end matter, PDF 440-463 | **REFERENCE ONLY / NOT APPLICABLE** | 0 | 선택 이름·서지·Houses·종이 서식·도판 |
| **합계** | **PARTIAL** | **46** | **5 Blocker · 40 Major · 1 Minor** |

현재 페이지 범위 분류는 다음과 같습니다. 이 compact range ledger가 아래 역사적 개별 행의 현재 판정을 대체합니다.

| Detailed status | Current PDF ranges | 쪽 수 |
|---|---|---:|
| NOT APPLICABLE | 1-2, 23-25, 45, 64-65, 83, 95, 107, 115, 136-137, 163, 173, 183, 193, 211-213, 257-261, 265, 284-285, 319-321, 341, 373, 391, 463 | 36 |
| REFERENCE ONLY | 3-14, 37-38, 214-228, 230-232, 236-256, 262-264, 266-283, 322-340, 440-462 | 116 |
| COMPLETE | 15-22, 31-36, 39-40, 42-44, 84-87, 103-106, 108-110, 114, 174-175, 372, 425, 427 | 36 |
| COMPLETE WITH INTENTIONAL GM/NARRATIVE | 66-79, 81-82, 116-135, 138-162, 164-172, 194-210, 342-369, 371, 374-386, 388-390, 392-394, 432, 435-436 | 138 |
| COMPLETE WITH SOURCE AMBIGUITIES | 41, 80, 370, 387, 426 | 5 |
| PARTIAL | 26-30, 46-63, 88-94, 96-102, 111-113, 176-182, 184-192, 229, 233-235, 286-318, 395-424, 428-431, 433-434, 437-439 | 132 |

Final assessment: **PARTIAL**. Intentional GM/narrative decisions are not counted as gaps. **FINAL GAP CLOSURE REQUIRED.**

## Chapter 17 Phase 14 Superseding Audit

아래 판정은 과거 페이지별 기록 중 PDF 342-372의 `참조` 행을 대체합니다. 과거 행은 감사 이력을 위해 유지하며 현재 상태 판단에는 사용하지 않습니다.

| PDF | 인쇄 | 범위 | 현재 구현 여부 | 남은 항목 | 검증 |
|---:|---:|---|---|---|---|
| 342-345 | 341-344 | Basques, Bretons | **구현** | 원문상 GM 허가와 비수치 가족·성격 입력 | 5 profiles·Table 17-1·UI 생성 |
| 345-348 | 344-347 | Britons, Byzantines | **구현** | 정치·사회 맥락의 GM 판단 | 6 profiles·Prayer·mount adapters |
| 348-351 | 347-350 | Danes, Gascons | **구현** | 문화적 서술 | 5 profiles·Pagan/Christian gate |
| 352-355 | 351-354 | Huns, Jews | **구현** | 훈족 종교 선택, 유대인 비군사 신분의 GM 맥락 | 4 profiles·무장 금지·UI 종단 |
| 355-361 | 354-360 | Lombards, Moors/Saracens | **구현** | 원문 역사·종교 용어의 서술 맥락 | 5 profiles·Chapter 7/12/18 |
| 361-368 | 360-367 | Persians, Romans, Saxons/Frisians | **구현** | 신분과 정치 관계의 GM 판단 | 6 profiles·모든 장비 대안 |
| 368-371 | 367-370 | Slavs, Visigoths | **구현** | 없음 | 5 profiles; Rouncy와 모든 비마상 경로 실행 |
| 372 | 371 | Legendary Lands, Table 17-1 | **구현/참조** | generic Slav Pony combat statblock의 원문 누락 | 15행 exact table·Ethiopia/Cathay reference-only |

Chapter 17은 **COMPLETE WITH SOURCE AMBIGUITIES**입니다. Source inventory와 각 문화/장비 profile의 상세 증거는 `CHAPTER17_SOURCE_AUDIT.md`, 실제 UI와 전체 snapshot은 `CHAPTER17_COMPLETION_REPORT.md`에 기록했습니다.

## Chapter 3 / 9 Current Superseding Audit

아래 판정은 과거 페이지별 기록 중 PDF 66-82와 164-172의 PARTIAL 행을 대체합니다. 과거 행은 감사 이력을 위해 유지하며 현재 상태 판단에는 사용하지 않습니다.

| PDF | 인쇄 | 범위 | 현재 구현 여부 | 남은 항목 | 검증 |
|---:|---:|---|---|---|---|
| 66-69 | 65-68 | Traits, Passions, contrary action | **구현** | 원문이 상황 선택을 GM에게 맡김 | 24 Traits·12 pairs·Passion -1 |
| 70-73 | 69-72 | Directed Trait, Trait results/conflict | **구현** | Directed 맥락과 값의 GM 판단 | Table 3-1·save/reload |
| 74-75 | 73-74 | Honor, Dishonorable Acts | **구현** | 실제 불명예 trigger의 table judgment | Table 3-2·Honor <=5/0 |
| 76-78 | 75-77 | Amor, Directed Passion, Fear | **구현** | 시작값 합의와 Fear 기회 GM 판단 | Love/Hate/Fear·pagan Amor |
| 79-82 | 78-81 | Passion aftermath, Madness, Melancholy, Winter -3, Oath | **구현** | Melancholy 기간 source ambiguity와 서사 | Table 3-4·recovery·Oath |
| 164-165 | 163-164 | Magic and eligibility | **구현/참조** | 마법의 서사적 의미 | Prayer gate |
| 166-169 | 165-168 | Prayer and Miracles | **구현** | miracle 성격의 GM 판단 | Tables 9-1/2·Adventure return |
| 170 | 169 | Dreams | **구현** | 꿈 내용과 해석 | sourced/GM dream state |
| 171 | 170 | Relics and pagan lover betrayal | **구현/참조** | 성물의 원문상 서사 | relic modifier·Amor→Hate·-5/-5 |
| 172 | 171 | Pagan Lady Amor | **구현** | NPC 수치·관계 맥락의 GM 판단 | APP vs Chaste/Honor·external Passion |

상세 procedure, table, save/resume와 Chapter 19 복귀 증거는 `CHAPTER3_9_DEPENDENCY_AUDIT.md`에 기록했습니다.

## Chapter 19 Phase 13 Superseding Audit

아래 판정은 2026-08-12의 Chapter 19 `COMPLETE` 판정을 대체합니다. 과거 행과 완료 주장은 감사 이력을 위해 그대로 두며 현재 상태 판단에는 사용하지 않습니다.

| PDF | 인쇄 | 범위 | 현재 구현 여부 | 남은 항목 | 검증 |
|---:|---:|---|---|---|---|
| 392-394 | 391-393 | Chapter 19 introduction and Adventure model | **구현** | 원문 GM/Narrative 판단 | 공용 상태 머신·save/resume |
| 395-400 | 394-399 | The Adventure of the Jewel | **부분** | branch-specific reward/consequence consumers | route와 Chapter 7/12 hand-off는 구현 |
| 401-410 | 400-409 | The Adventure of the Humble Squires | **부분** | Mount Bitter 세부, capture/loot/reward consumers | Hunt·Chapter 7/8·서임 hand-off는 구현 |
| 411-424 | 410-423 | 18 Short Form Scenarios | **부분** | 다수 고유 절차가 generic checklist/consequence 입력 | 18개 catalog와 공용 flow는 구현 |
| 425-427 | 424-426 | Hunt and Tables 19-8 to 19-12 | **구현** | Table 19-11 source ambiguity | Search, Chase, Dead End, nested prey, Chapter 7 return |
| 428-433 | 427-432 | Challenges through Mallus | **부분** | next-roll modifiers, economy/reputation and judgment consumers | nested tables와 반복 state 일부 구현 |
| 434-436 | 433-435 | Pilgrimage and Romance | **부분** | Pilgrimage deterministic costs/results | Romance canonical Amor flow는 구현 |
| 437-439 | 436-438 | Royal Court through Your Manor | **부분** | awards, annual duties and dispute consequences | table selection과 Chapter 7/12 hand-off 일부 구현 |

Table 19-7, 19-11, 19-24의 인쇄 모호성은 구현 누락으로 세지 않고 GM/source record로 보존합니다. 그와 별개로 `CHAPTER19_COMPLETION_REPORT.md`에 나열한 결정적 절차 공백이 남으므로 Chapter 19 전체는 PARTIAL입니다.

## 전 페이지 기록

| PDF | 인쇄 | 범위 | 앱 구현 여부 | 누락 | 비고 |
|---:|---:|---|---|---|---|
| 1 | front | NMPAL01 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 책 구조 확인 |
| 2 | front | Ruben in ’t Groen | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 책 구조 확인 |
| 3 | 2 | Book Design: Aileen E. Miles | **참조** · 목차·판권을 감사 범위와 탐색 구조 검증에 반영 | 앱에 원문 목차 전체를 복제하지 않음 | 전체 규칙 위치 대조 |
| 4 | 3 | Table of Contents | **참조** · 목차·판권을 감사 범위와 탐색 구조 검증에 반영 | 앱에 원문 목차 전체를 복제하지 않음 | 전체 규칙 위치 대조 |
| 5 | 4 | Paladin: Warriors of Charlemagne | **참조** · 목차·판권을 감사 범위와 탐색 구조 검증에 반영 | 앱에 원문 목차 전체를 복제하지 않음 | 전체 규칙 위치 대조 |
| 6 | 5 | Table of Contents | **참조** · 목차·판권을 감사 범위와 탐색 구조 검증에 반영 | 앱에 원문 목차 전체를 복제하지 않음 | 전체 규칙 위치 대조 |
| 7 | 6 | Paladin: Warriors of Charlemagne | **참조** · 목차·판권을 감사 범위와 탐색 구조 검증에 반영 | 앱에 원문 목차 전체를 복제하지 않음 | 전체 규칙 위치 대조 |
| 8 | 7 | Table of Contents | **참조** · 목차·판권을 감사 범위와 탐색 구조 검증에 반영 | 앱에 원문 목차 전체를 복제하지 않음 | 전체 규칙 위치 대조 |
| 9 | 8 | Paladin: Warriors of Charlemagne | **참조** · 목차·판권을 감사 범위와 탐색 구조 검증에 반영 | 앱에 원문 목차 전체를 복제하지 않음 | 전체 규칙 위치 대조 |
| 10 | 9 | Table of Contents | **참조** · 목차·판권을 감사 범위와 탐색 구조 검증에 반영 | 앱에 원문 목차 전체를 복제하지 않음 | 전체 규칙 위치 대조 |
| 11 | 10 | Paladin: Warriors of Charlemagne | **참조** · 목차·판권을 감사 범위와 탐색 구조 검증에 반영 | 앱에 원문 목차 전체를 복제하지 않음 | 전체 규칙 위치 대조 |
| 12 | 11 | Table of Contents | **참조** · 목차·판권을 감사 범위와 탐색 구조 검증에 반영 | 앱에 원문 목차 전체를 복제하지 않음 | 전체 규칙 위치 대조 |
| 13 | 12 | Paladin: Warriors of Charlemagne | **참조** · 목차·판권을 감사 범위와 탐색 구조 검증에 반영 | 앱에 원문 목차 전체를 복제하지 않음 | 전체 규칙 위치 대조 |
| 14 | 13 | Index of Tables and Maps | **참조** · 목차·판권을 감사 범위와 탐색 구조 검증에 반영 | 앱에 원문 목차 전체를 복제하지 않음 | 전체 규칙 위치 대조 |
| 15 | 14 | Introduction | **부분** · 캠페인 전제·주사위·연도 개념을 엔진과 도움말에 반영 | 입문 예시와 진행자 조언 전체 | 핵심 절차만 실행 가능 |
| 16 | 15 | C | **부분** · 캠페인 전제·주사위·연도 개념을 엔진과 도움말에 반영 | 입문 예시와 진행자 조언 전체 | 핵심 절차만 실행 가능 |
| 17 | 16 | Introduction | **부분** · 캠페인 전제·주사위·연도 개념을 엔진과 도움말에 반영 | 입문 예시와 진행자 조언 전체 | 핵심 절차만 실행 가능 |
| 18 | 17 | The Players as Knights | **부분** · 캠페인 전제·주사위·연도 개념을 엔진과 도움말에 반영 | 입문 예시와 진행자 조언 전체 | 핵심 절차만 실행 가능 |
| 19 | 18 | Introduction | **부분** · 캠페인 전제·주사위·연도 개념을 엔진과 도움말에 반영 | 입문 예시와 진행자 조언 전체 | 핵심 절차만 실행 가능 |
| 20 | 19 | P | **부분** · 캠페인 전제·주사위·연도 개념을 엔진과 도움말에 반영 | 입문 예시와 진행자 조언 전체 | 핵심 절차만 실행 가능 |
| 21 | 20 | Introduction | **부분** · 캠페인 전제·주사위·연도 개념을 엔진과 도움말에 반영 | 입문 예시와 진행자 조언 전체 | 핵심 절차만 실행 가능 |
| 22 | 21 | Chapter 11 deals with the ambitions of knights, and the paign on track. | **부분** · 캠페인 전제·주사위·연도 개념을 엔진과 도움말에 반영 | 입문 예시와 진행자 조언 전체 | 핵심 절차만 실행 가능 |
| 23 | 22 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 24 | 23 | Book I: Character | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 책 구조 확인 |
| 25 | 24 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 26 | 25 | Chapter One: | **부분** · 개인 정보와 Frankish 이름·가문 입력 제공 | 모든 문화권 이름 자료 | 핵심 생성 흐름 지원 |
| 27 | 26 | Chapter One: Character Creation | **부분** · 개인 정보와 Frankish 이름·가문 입력 제공 | 모든 문화권 이름 자료 | 핵심 생성 흐름 지원 |
| 28 | 27 | Step 2: Family | **구현** · 가문 특성·수호성인 표와 효과 실행 | 없음 | 표 범위 회귀 검사 |
| 29 | 28 | Chapter One: Character Creation | **구현** · 부친 계급·생존·교육·아들 순서 실행 | 없음 | 종속 결과 재계산 |
| 30 | 29 | Step 3: Youth | **구현** · 부친 계급·생존·교육·아들 순서 실행 | 없음 | 종속 결과 재계산 |
| 31 | 30 | Chapter One: Character Creation | **구현** · 부친 계급·생존·교육·아들 순서 실행 | 없음 | 종속 결과 재계산 |
| 32 | 31 | Step 4: Attributes | **구현** · 능력치·특징·성격·열정·지위·기술·기사 자격 실행 | 없음 | 수식과 자격 자동 검사 |
| 33 | 32 | Chapter One: Character Creation | **구현** · 능력치·특징·성격·열정·지위·기술·기사 자격 실행 | 없음 | 수식과 자격 자동 검사 |
| 34 | 33 | Step 6: Skills | **구현** · 능력치·특징·성격·열정·지위·기술·기사 자격 실행 | 없음 | 수식과 자격 자동 검사 |
| 35 | 34 | Chapter One: Character Creation | **구현** · 능력치·특징·성격·열정·지위·기술·기사 자격 실행 | 없음 | 수식과 자격 자동 검사 |
| 36 | 35 | Step 7: Knighthood | **구현** · 능력치·특징·성격·열정·지위·기술·기사 자격 실행 | 없음 | 수식과 자격 자동 검사 |
| 37 | 36 | A Chief Per Fesse Per Pale A Chevron | **참조** · 문장학 도판을 서술 참고로 확인 | 문장 제작기 | 핵심 진행 비필수 |
| 38 | 37 | Mullet Lion Sejant Crescent Lion Rampant Reguardant | **참조** · 문장학 도판을 서술 참고로 확인 | 문장 제작기 | 핵심 진행 비필수 |
| 39 | 38 | Chapter One: Character Creation | **구현** · 시작 장비와 출생 선물 표 실행 | 없음 | 재굴림·조건부 효과 추적 |
| 40 | 39 | Step 8: Possessions | **구현** · 시작 장비와 출생 선물 표 실행 | 없음 | 재굴림·조건부 효과 추적 |
| 41 | 40 | Chapter One: Character Creation | **부분** · 영광스러운 이야기와 여성 기사 선택 제공 | 여성 전용 아들 순서 해석 | 모호성은 차이 문서에 보존 |
| 42 | 41 | Death and Retirement | **구현** · 사망·은퇴·구원·시성·유산·후계자 실행 | 없음 | 가족·연대 보존 |
| 43 | 42 | Chapter One: Character Creation | **구현** · 사망·은퇴·구원·시성·유산·후계자 실행 | 없음 | 가족·연대 보존 |
| 44 | 43 | New Characters | **구현** · 사망·은퇴·구원·시성·유산·후계자 실행 | 없음 | 가족·연대 보존 |
| 45 | 44 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 46 | 45 | Chapter Two: The Past | **부분** · 선대 역사와 연표 자료를 가문·연대 참고에 반영 | 모든 연도별 부친 사건의 완전 실행 | 참고·부분 자동화 |
| 47 | 46 | Chapter Two: The Past | **부분** · 선대 역사와 연표 자료를 가문·연대 참고에 반영 | 모든 연도별 부친 사건의 완전 실행 | 참고·부분 자동화 |
| 48 | 47 | F | **부분** · 선대 역사와 연표 자료를 가문·연대 참고에 반영 | 모든 연도별 부친 사건의 완전 실행 | 참고·부분 자동화 |
| 49 | 48 | Chapter Two: The Past | **부분** · 선대 역사와 연표 자료를 가문·연대 참고에 반영 | 모든 연도별 부친 사건의 완전 실행 | 참고·부분 자동화 |
| 50 | 49 | Phase –1: Charles Martel | **부분** · 선대 역사와 연표 자료를 가문·연대 참고에 반영 | 모든 연도별 부친 사건의 완전 실행 | 참고·부분 자동화 |
| 51 | 50 | Chapter Two: The Past | **부분** · 선대 역사와 연표 자료를 가문·연대 참고에 반영 | 모든 연도별 부친 사건의 완전 실행 | 참고·부분 자동화 |
| 52 | 51 | Phase –1: Charles Martel | **부분** · 선대 역사와 연표 자료를 가문·연대 참고에 반영 | 모든 연도별 부친 사건의 완전 실행 | 참고·부분 자동화 |
| 53 | 52 | Chapter Two: The Past | **부분** · 선대 역사와 연표 자료를 가문·연대 참고에 반영 | 모든 연도별 부친 사건의 완전 실행 | 참고·부분 자동화 |
| 54 | 53 | F | **부분** · 선대 역사와 연표 자료를 가문·연대 참고에 반영 | 모든 연도별 부친 사건의 완전 실행 | 참고·부분 자동화 |
| 55 | 54 | Chapter Two: The Past | **부분** · 선대 역사와 연표 자료를 가문·연대 참고에 반영 | 모든 연도별 부친 사건의 완전 실행 | 참고·부분 자동화 |
| 56 | 55 | Phase 0: King Pepin | **부분** · 선대 역사와 연표 자료를 가문·연대 참고에 반영 | 모든 연도별 부친 사건의 완전 실행 | 참고·부분 자동화 |
| 57 | 56 | Chapter Two: The Past | **부분** · 선대 역사와 연표 자료를 가문·연대 참고에 반영 | 모든 연도별 부친 사건의 완전 실행 | 참고·부분 자동화 |
| 58 | 57 | Phase 0: King Pepin | **부분** · 선대 역사와 연표 자료를 가문·연대 참고에 반영 | 모든 연도별 부친 사건의 완전 실행 | 참고·부분 자동화 |
| 59 | 58 | Chapter Two: The Past | **부분** · 선대 역사와 연표 자료를 가문·연대 참고에 반영 | 모든 연도별 부친 사건의 완전 실행 | 참고·부분 자동화 |
| 60 | 59 | Phase 0: King Pepin | **부분** · 선대 역사와 연표 자료를 가문·연대 참고에 반영 | 모든 연도별 부친 사건의 완전 실행 | 참고·부분 자동화 |
| 61 | 60 | Chapter Two: The Past | **부분** · 선대 역사와 연표 자료를 가문·연대 참고에 반영 | 모든 연도별 부친 사건의 완전 실행 | 참고·부분 자동화 |
| 62 | 61 | Phase 0: King Pepin | **부분** · 선대 역사와 연표 자료를 가문·연대 참고에 반영 | 모든 연도별 부친 사건의 완전 실행 | 참고·부분 자동화 |
| 63 | 62 | Chapter Two: The Past | **부분** · 선대 역사와 연표 자료를 가문·연대 참고에 반영 | 모든 연도별 부친 사건의 완전 실행 | 참고·부분 자동화 |
| 64 | 63 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 65 | 64 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 66 | 65 | Chapter Three: Personality: | **부분** · 24 Traits·12 대립쌍과 공용 Personality/Magic 상태 | Table 3-2 전역 자동 탐지, Winter 자발적 Passion -3, Fear 기회 | Chapter 19 직접 의존은 닫힘 |
| 67 | 66 | Chapter Three: Personality: Traits and Passions | **부분** · Trait·Passion·경험·강제 행동을 canonical resolver로 처리 | Table 3-2 전역 자동 탐지와 독립 Winter/Fear 절차 | GM·서술 판단은 명시적 입력 |
| 68 | 67 | T | **부분** · 12개 대립쌍과 Trait test·conflict 실행 | 모든 불명예 원인의 자동 감지 | 단일 `character.traits` 사용 |
| 69 | 68 | Chapter Three: Personality: Traits and Passions | **부분** · Trait check와 반대 Trait 결과 실행 | 모든 캠페인 사건의 자동 Trait trigger | 앱이 상황을 창작하지 않음 |
| 70 | 69 | Traits | **부분** · Directed Trait 대상·modifier·기원·GM 제거 실행 | 모든 맥락의 자동 Directed trigger | 합의 modifier와 source 저장 |
| 71 | 70 | Chapter Three: Personality: Traits and Passions | **부분** · Table 3-1 생성과 1개 계승 Directed Trait 실행 | 다른 생성 문화 전체 | 기존 생성 흐름과 연결 |
| 72 | 71 | Traits | **부분** · Trait 경험 체크와 대립값 보존 | 모든 캠페인 원인의 자동 경험 부여 | canonical 값 사용 |
| 73 | 72 | Chapter Three: Personality: Traits and Passions | **부분** · Trait 관련 선택·결과·source ledger 제공 | Table 3-2 전역 탐지 | explicit Honor 거래 유지 |
| 74 | 73 | Passions | **부분** · 초기·공통 Passion, 일반·의무·부적절 사용 실행 | Winter 자발적 -3, Fear 극복 기회 | Chapter 19 직접 의존은 닫힘 |
| 75 | 74 | Chapter Three: Personality: Traits and Passions | **부분** · Honor·Oath와 Table 3-2 reference/거래 연결 | 20개 행의 앱 전체 자동 감지 | 한 번에 하나의 Oath 보존 |
| 76 | 75 | Passions | **부분** · Amor 하나, 최대 modifier +10, 16+ 제약 실행 | NPC 관계 전체 자동 판정 | 원문 밖 관계 규칙 없음 |
| 77 | 76 | Chapter Three: Personality: Traits and Passions | **부분** · 일반 Passion 발동·행동 완료·경험 처리 | Fear 기회의 모든 자동 제시 | player/GM 선택 저장 |
| 78 | 77 | Passions | **부분** · Table 3-4 결과와 Inspiration 실행 | 모든 외부 행동의 자동 보정 소비 | modifier transaction 고정 |
| 79 | 78 | Chapter Three: Personality: Traits and Passions | **부분** · Shock는 Table 10-1 Aging을 재사용 | 원문이 GM에 맡긴 Shock 상황 자동 판단 | Wrathful Lord 특수 역전 포함 |
| 80 | 79 | Passions | **부분** · Melancholy·Madness·Snap Out·연간 회복 실행 | Madness 기간의 서사 자동 생성 | 모호한 두 Melancholy 기간 보존 |
| 81 | 80 | Chapter Three: Personality: Traits and Passions | **부분** · Introspection·Group Inspiration 실행 | 모든 게임 그룹의 참가자 자동 편성 | frivolous/mandatory 구분 |
| 82 | 81 | Passions | **부분** · Oath·Honor stakes와 후유 상태 종료 실행 | 모든 명예 위반 자동 탐지 | Chapter 19 직접 의존은 닫힘 |
| 83 | 82 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 84 | 83 | Chapter Four: Reputation: | **부분** · 영광·지위 계산과 연도·원인·출처 원장 제공 | 모든 전투·토너먼트·명예 원천 자동 산정 | 기록된 획득은 겨울에 게시 |
| 85 | 84 | Chapter Four: Reputation: Glory and Standing | **부분** · 영광·지위 계산과 연도·원인·출처 원장 제공 | 모든 전투·토너먼트·명예 원천 자동 산정 | 기록된 획득은 겨울에 게시 |
| 86 | 85 | Table 4–3: Sample Glory | **부분** · 영광·지위 계산과 연도·원인·출처 원장 제공 | 모든 전투·토너먼트·명예 원천 자동 산정 | 기록된 획득은 겨울에 게시 |
| 87 | 86 | Chapter Four: Reputation: Glory and Standing | **부분** · 영광·지위 계산과 연도·원인·출처 원장 제공 | 모든 전투·토너먼트·명예 원천 자동 산정 | 기록된 획득은 겨울에 게시 |
| 88 | 87 | Areas of Glory Gain | **부분** · 영광·지위 계산과 연도·원인·출처 원장 제공 | 모든 전투·토너먼트·명예 원천 자동 산정 | 기록된 획득은 겨울에 게시 |
| 89 | 88 | Chapter Four: Reputation: Glory and Standing | **부분** · 영광·지위 계산과 연도·원인·출처 원장 제공 | 모든 전투·토너먼트·명예 원천 자동 산정 | 기록된 획득은 겨울에 게시 |
| 90 | 89 | Areas of Glory Gain | **부분** · 영광·지위 계산과 연도·원인·출처 원장 제공 | 모든 전투·토너먼트·명예 원천 자동 산정 | 기록된 획득은 겨울에 게시 |
| 91 | 90 | Chapter Four: Reputation: Glory and Standing | **부분** · 영광·지위 계산과 연도·원인·출처 원장 제공 | 모든 전투·토너먼트·명예 원천 자동 산정 | 기록된 획득은 겨울에 게시 |
| 92 | 91 | Standings | **부분** · 영광·지위 계산과 연도·원인·출처 원장 제공 | 모든 전투·토너먼트·명예 원천 자동 산정 | 기록된 획득은 겨울에 게시 |
| 93 | 92 | Chapter Four: Reputation: Glory and Standing | **부분** · 영광·지위 계산과 연도·원인·출처 원장 제공 | 모든 전투·토너먼트·명예 원천 자동 산정 | 기록된 획득은 겨울에 게시 |
| 94 | 93 | Standings | **부분** · 영광·지위 계산과 연도·원인·출처 원장 제공 | 모든 전투·토너먼트·명예 원천 자동 산정 | 기록된 획득은 겨울에 게시 |
| 95 | 94 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 96 | 95 | Chapter Five: Skills | **부분** · 기술 수치·분류·경험과 캐릭터 화면 제공 | 모든 기술별 특수 결과 자동 강제 | 핵심 판정과 성장 구현 |
| 97 | 96 | Chapter Five: Skills | **부분** · 기술 수치·분류·경험과 캐릭터 화면 제공 | 모든 기술별 특수 결과 자동 강제 | 핵심 판정과 성장 구현 |
| 98 | 97 | Common Skills | **부분** · 기술 수치·분류·경험과 캐릭터 화면 제공 | 모든 기술별 특수 결과 자동 강제 | 핵심 판정과 성장 구현 |
| 99 | 98 | Chapter Five: Skills | **부분** · 기술 수치·분류·경험과 캐릭터 화면 제공 | 모든 기술별 특수 결과 자동 강제 | 핵심 판정과 성장 구현 |
| 100 | 99 | Courtly Skills | **부분** · 기술 수치·분류·경험과 캐릭터 화면 제공 | 모든 기술별 특수 결과 자동 강제 | 핵심 판정과 성장 구현 |
| 101 | 100 | Chapter Five: Skills | **부분** · 기술 수치·분류·경험과 캐릭터 화면 제공 | 모든 기술별 특수 결과 자동 강제 | 핵심 판정과 성장 구현 |
| 102 | 101 | Paladin music is medieval. It uses a variety of instruments | **부분** · 기술 수치·분류·경험과 캐릭터 화면 제공 | 모든 기술별 특수 결과 자동 강제 | 핵심 판정과 성장 구현 |
| 103 | 102 | Chapter Five: Skills | **부분** · 기술 수치·분류·경험과 캐릭터 화면 제공 | 모든 기술별 특수 결과 자동 강제 | 핵심 판정과 성장 구현 |
| 104 | 103 | Melee Weapon Skills | **부분** · 기술 수치·분류·경험과 캐릭터 화면 제공 | 모든 기술별 특수 결과 자동 강제 | 핵심 판정과 성장 구현 |
| 105 | 104 | Chapter Five: Skills | **부분** · 기술 수치·분류·경험과 캐릭터 화면 제공 | 모든 기술별 특수 결과 자동 강제 | 핵심 판정과 성장 구현 |
| 106 | 105 | Missile Weapon Skills | **부분** · 기술 수치·분류·경험과 캐릭터 화면 제공 | 모든 기술별 특수 결과 자동 강제 | 핵심 판정과 성장 구현 |
| 107 | 106 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 108 | 107 | Chapter Six: | **부분** · d20·대립·수정치·경험·이동·여행 계산 엔진 제공 | Feat·여행 전체 플레이 화면 | 일부는 화면 없는 엔진 |
| 109 | 108 | Chapter Six: General Mechanics | **부분** · d20·대립·수정치·경험·이동·여행 계산 엔진 제공 | Feat·여행 전체 플레이 화면 | 일부는 화면 없는 엔진 |
| 110 | 109 | Die-Roll Resolutions | **부분** · d20·대립·수정치·경험·이동·여행 계산 엔진 제공 | Feat·여행 전체 플레이 화면 | 일부는 화면 없는 엔진 |
| 111 | 110 | Chapter Six: General Mechanics | **부분** · d20·대립·수정치·경험·이동·여행 계산 엔진 제공 | Feat·여행 전체 플레이 화면 | 일부는 화면 없는 엔진 |
| 112 | 111 | Table 6–2: Travel Distances (in miles per day) | **부분** · d20·대립·수정치·경험·이동·여행 계산 엔진 제공 | Feat·여행 전체 플레이 화면 | 일부는 화면 없는 엔진 |
| 113 | 112 | Chapter Six: General Mechanics | **부분** · d20·대립·수정치·경험·이동·여행 계산 엔진 제공 | Feat·여행 전체 플레이 화면 | 일부는 화면 없는 엔진 |
| 114 | 113 | Experience | **부분** · d20·대립·수정치·경험·이동·여행 계산 엔진 제공 | Feat·여행 전체 플레이 화면 | 일부는 화면 없는 엔진 |
| 115 | 114 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 116 | 115 | Chapter Seven: Combat | **구현** · 개인 전투 설정, 행동 선언, 라운드 상태와 종료를 단일 Chapter 7 엔진으로 실행 | 없음 | Chapter 8 개인 교전도 같은 엔진을 호출 |
| 117 | 116 | Chapter Seven: Combat | **구현** · 결정·판정·승자·패자·이동 5단계와 대립 판정·피해 처리 | 없음 | 적용 전 판정 저장과 중복 적용 방지 |
| 118 | 117 | T | **구현** · 피해·갑옷·방패·피해 주사위 | 없음 | 승패 결과에서 단일 파이프라인 적용 |
| 119 | 118 | Chapter Seven: Combat | **구현** · 넘어짐·갑옷·방패·DEX 균형과 일반 DEX 행동 | 없음 | 낙마 1d6 별도 상처 포함 |
| 120 | 119 | Table 7–1: Encumbrance | **구현** · 휴대 중량 자동 분류, DEX·Awareness·무기·이동 수정, 등반·도약·은신 실행 | 없음 | 한계 초과는 원문대로 GM 판단 표시 |
| 121 | 120 | Chapter Seven: Combat | **구현** · 이동률·주도권·접근·이탈·승하마·일어서기와 위치 거리를 저장 | 없음 | 교전 중 빠른 이동과 복합 행동은 GM 승인 기록 |
| 122 | 121 | C | **구현** · 상처·기마·돌격·대기병 등 확정 수정 자동 적용, 상황 수정은 근거와 함께 입력 | 없음 | 엄폐·시야·협소 공간은 원문이 GM 판단으로 지정 |
| 123 | 122 | Chapter Seven: Combat | **구현** · 마상창 돌격·비돌격 Spear 전환·기마 대 보병·돌격 후 직진 | 없음 | Chapter 8 첫 충돌 수정은 첫 라운드에만 적용 |
| 124 | 123 | Mounted Combat | **구현** · 말별 HP·DEX·갑옷·부상·죽음·쓰러짐·낙마와 기수 상태 분리 | 없음 | Caparison +2와 중마갑 착용 제한 포함 |
| 125 | 124 | Chapter Seven: Combat | **구현** · 무기 특수 효과·비살상·장비 마모와 마상창 시합 전 과정 | 없음 | 시합 대실패 결과는 원문대로 GM 선택 저장 |
| 126 | 125 | Special Rules for Melee Combat | **구현** · 방패 공격·양손 타격·다수 상대 기술 배분·인원 상한 | 없음 | 사거리 밖 원거리 사수는 인원 제한 없이 등록 |
| 127 | 126 | Chapter Seven: Combat | **구현** · 원거리 사거리·엄폐·탄약·속사·조준·재장전·날씨와 방어·회피·이중 페인트 | 없음 | 선택 전술을 화면에서 명시 |
| 128 | 127 | 2. Re-arm with a Dagger: He may rearm with a dagger | **구현** · 이탈, 붙잡기·고정·해제·역전·단검 재무장·타격·던지기 | 없음 | 다수 상대 이탈은 GM 승인 기록 |
| 129 | 128 | Chapter Seven: Combat | **구현** · Grapple 후속 행동, Uncontrolled Attack 세 대응, Flail 자연 1 자상 | 없음 | 상대 Unarmed를 별도 수치로 저장 |
| 130 | 129 | Injury and Health | **구현** · HP 손실·회복·의식 한계·음수 HP·기마 의식 상실 DEX | 없음 | 음수 HP와 낙마 상처를 저장에서 보존 |
| 131 | 130 | Chapter Seven: Combat | **구현** · 개별 상처·부상 수정·큰 부상·능력치 손실·Valorous 계속 판정 | 없음 | 실패 시 강제 재진입만 허용, 대실패 시 도주·항복 |
| 132 | 131 | 1. First Aid must be successfully applied within one | **구현** · 치명상·1시간 응급처치·자정 사망·불건강 | 없음 | 사망 확정은 생애·계승으로 연결 |
| 133 | 132 | Chapter Seven: Combat | **구현** · Table 7-3·7-4, 상처별 1회 처치, 주간 외과 | 없음 | 일요일 정오 회복 원장 |
| 134 | 133 | Table 7–5: Health | **구현** · 활동별 회복 취소·악화·상태 악화 | 없음 | 표를 화면에 원형 유지 |
| 135 | 134 | Chapter Seven: Combat | **구현** · 질병·낙하물·추락·불·독·질식 | 없음 | GM 질병 피해는 원문대로 명시 입력 |
| 136 | 135 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 137 | 136 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 138 | 137 | Chapter Eight: | **구현** · 전쟁 장부에서 Chapter 8의 세 절차를 독립 상태로 시작 | 없음 | 소규모 교전·대전투·공성 탭 |
| 139 | 138 | Chapter Eight: Mass Combat | **구현** · Skirmish 지휘와 Table 8-1, 8-2 실행 | 없음 | 첫 라운드 한정 수정과 추종자 집단 판정 |
| 140 | 139 | B | **구현** · 개인 근접전 결과 기록, 1~5라운드 지연, 포획·구출 연결 | 없음 | 개인 공격은 Chapter 7 엔진 사용 |
| 141 | 140 | Chapter Eight: Mass Combat | **구현** · 군·대대·부대·단독 역할과 병력 구조를 전투 설정에 보존 | 없음 | 지휘 역할별 Glory 계산 |
| 142 | 141 | 1. Determine the enemy. | **구현** · 적 결정, 병력비·국토 상황, 군·대대 지휘 판정 실행 | 없음 | pre-battle 상태 머신 |
| 143 | 142 | Chapter Eight: Mass Combat | **구현** · 전투 전 지휘 결과와 선택을 첫 돌격으로 전달 | 없음 | 허용 단계 외 action 차단 |
| 144 | 143 | 1. Players determine if they will take part in the First | **구현** · 첫 돌격, 기마·마상창 조건, 말/기사 피격 분기 실행 | 없음 | 첫 돌격을 1라운드로 기록 |
| 145 | 144 | Chapter Eight: Mass Combat | **구현** · 3d6 사건, Table 8-3·8-4 부대 판정과 교전 선택 실행 | 없음 | 라운드 상태 저장 |
| 146 | 145 | Table 8–5: Battle Special Events | **구현** · Table 8-5·8-6 특별 사건과 집결을 실제 행동에 연결 | 없음 | 다음 근접전 수정 지속 |
| 147 | 146 | Chapter Eight: Mass Combat | **구현** · Table 8-7 도주, 항복·포획, 장비·말·상처 결과 실행 | 없음 | Chapter 7 건강 상태 공유 |
| 148 | 147 | Battle System | **구현** · 퇴각·패주·항전·추격과 Table 8-8 추종자 운명 실행 | 없음 | 교전 여부별 허용 행동 제한 |
| 149 | 148 | Chapter Eight: Mass Combat | **구현** · Table 8-9·8-10 승패, 군 전체 운명, 전리품·몸값·Glory 확정 | 없음 | 전리품과 몸값 청구를 Chapter 12 경제 장부로 직접 전달 |
| 150 | 149 | A | **구현** · 초기 기사 Battle Enemy 표를 런타임 적 선택에 사용 | 없음 | 1~20·21+ 경계 테스트 |
| 151 | 150 | Chapter Eight: Mass Combat | **구현** · 후기 기사 Battle Enemy 표를 런타임 적 선택에 사용 | 없음 | 1~20·21+ 경계 테스트 |
| 152 | 151 | Battle Enemy Tables | **구현** · 보병 Battle Enemy 표를 런타임 적 선택에 사용 | 없음 | 1~20·21+ 경계 테스트 |
| 153 | 152 | Chapter Eight: Mass Combat | **구현** · 색슨·데인 Battle Enemy 표를 런타임 적 선택에 사용 | 없음 | 1~20·21+ 경계 테스트 |
| 154 | 153 | Battle Enemy Tables | **구현** · 브르타뉴인 Battle Enemy 표를 런타임 적 선택에 사용 | 없음 | 1~20·21+ 경계 테스트 |
| 155 | 154 | Chapter Eight: Mass Combat | **구현** · 바스크인·슬라브인 Battle Enemy 표를 런타임 적 선택에 사용 | 없음 | 1~20·21+ 경계 테스트 |
| 156 | 155 | Battle Enemy Tables | **구현** · 훈·아바르 Battle Enemy 표를 런타임 적 선택에 사용 | 없음 | 1~20·21+ 경계 테스트 |
| 157 | 156 | Chapter Eight: Mass Combat | **구현** · 단순·상세 공성, 요새·양측·다중 DV 방어선을 별도 상태로 생성 | 없음 | battle과 분리된 siege state |
| 158 | 157 | DV | **구현** · DV·자연 지형·공성 장비와 월별 절차를 실행 | 없음 | 방어선 진행과 장비 소모 저장 |
| 159 | 158 | Chapter Eight: Mass Combat | **구현** · Table 8-11 건강과 Table 8-12 강습·손실 실행 | 없음 | 개인 질병은 공용 건강 상태 연결 |
| 160 | 159 | Table 8–13: Blockade Defender) | **구현** · Table 8-13 봉쇄와 Table 8-14 배신 공작 실행 | 없음 | 뇌물은 현금에서 차감 |
| 161 | 160 | Chapter Eight: Mass Combat | **구현** · Table 8-15·8-16 수비·공격 사기 연쇄 실행 | 없음 | 항복·반란·철수 종료 조건 반영 |
| 162 | 161 | Siege | **구현** · 요새 함락·유지, 포로, 공성 Glory, 연대기와 fortress 상태 확정 | 포로의 도주·사망은 GM/후속 장 판단 | 구조화된 미결 상태로 보존 |
| 163 | 162 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 164 | 163 | Chapter Nine: Magic | **부분** · Prayer·Miracle·Dream 공용 상태와 source record 제공 | 신명재판·악한 마법·성물별 전체 서사 | Chapter 19 직접 의존은 닫힘 |
| 165 | 164 | Chapter Nine: Magic | **부분** · 원문 eligibility와 청원 대상 판정 실행 | 마법의 모든 narrative consequence | 자동 서사 생성 없음 |
| 166 | 165 | Magic for Player-knights | **부분** · 자신의 Love [Charlemagne], 타인의 Love [God] 기도 실행 | 모든 캠페인 장면의 자동 기도 trigger | prayer transaction 저장 |
| 167 | 166 | Chapter Nine: Magic | **부분** · Table 9-1 결과와 Table 9-2 선택 여부 실행 | Table 9-2를 자동 선택할 GM 기준 | GM 선택을 침범하지 않음 |
| 168 | 167 | 1. The Player-knight must be in a position to talk. In | **부분** · 대상·상황·허용 입력을 검증하고 결과 적용 | 모든 비정형 대상 효과 | explicit source effect 사용 |
| 169 | 168 | Chapter Nine: Magic | **부분** · critical Prayer 뒤 miracle 성격을 GM decision으로 저장 | 기적의 서사적 내용 자동 생성 | 결정 후 Adventure 복귀 |
| 170 | 169 | Magic for Player-knights | **부분** · sourced Dream과 Love Passion test 실행 | 꿈 내용·해석 자동 생성 | 원문 prompt와 결과 보존 |
| 171 | 170 | Chapter Nine: Magic | **부분** · relic Prayer modifier와 Adventure 효과 연결 | 성물 전체 catalog의 개별 효과 | Jewel Eingar -5 정확히 연결 |
| 172 | 171 | Magic for Player-knights | **부분** · 장기 상태와 save/reload transaction 보존 | judicial ordeal·evil magic 전체 | Chapter 19 직접 의존은 닫힘 |
| 173 | 172 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 174 | 173 | Chapter Ten: | **구현** · 겨울 10단계를 고정 순서 마법사로 제공 | 없음 | 선실행·미완료 마감 차단 |
| 175 | 174 | Chapter Ten: The Winter Phase | **부분** · 나이·노화·수확 판정 실행 | 연대기 기반 모든 지역 재난 자동 적용 | 외부 사건 수정치는 입력 |
| 176 | 175 | 3. Economic Circumstances | **부분** · 유지 등급·수입·비용·생존 수정치 계산 | Temperate/Indulgent 강제 변경과 모든 빈곤 결과 | 수입 중복 가산 방지 |
| 177 | 176 | Chapter Ten: The Winter Phase | **부분** · 가족·종자·주요 말 생존과 가족 단계 실행 | 자유 텍스트 수행원·추가 특수마 구조화 | 질병·사망은 가문 연대 기록 |
| 178 | 177 | 6. Family | **부분** · 개인 사건 20행·혼인·출산·가족 사건·대상 표 실행 | 결투·몸값 등 외부 플레이·GM 판단의 자동 결론 | 결정 가능한 효과만 자동 |
| 179 | 178 | Chapter Ten: The Winter Phase | **부분** · 개인 사건 20행·혼인·출산·가족 사건·대상 표 실행 | 결투·몸값 등 외부 플레이·GM 판단의 자동 결론 | 결정 가능한 효과만 자동 |
| 180 | 179 | 6. Family | **부분** · 개인 사건 20행·혼인·출산·가족 사건·대상 표 실행 | 결투·몸값 등 외부 플레이·GM 판단의 자동 결론 | 결정 가능한 효과만 자동 |
| 181 | 180 | Chapter Ten: The Winter Phase | **부분** · 개인 사건 20행·혼인·출산·가족 사건·대상 표 실행 | 결투·몸값 등 외부 플레이·GM 판단의 자동 결론 | 결정 가능한 효과만 자동 |
| 182 | 181 | 10. Glory Bonus | **부분** · 경험·훈련·영광 합산·1,000점 보너스 실행 | 모든 외부 모험·마법 물품 원천 자동 수집 | 미소비 보너스 마감 차단 |
| 183 | 182 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 184 | 183 | Chapter Eleven: | **참조** · 야망·이상 자격 일부와 설명 제공 | 계급별 자격·의무·혜택·은퇴 실행기 | 이상 영광 일부만 자동 |
| 185 | 184 | Chapter Eleven: Ambitions and Ideals | **참조** · 야망·이상 자격 일부와 설명 제공 | 계급별 자격·의무·혜택·은퇴 실행기 | 이상 영광 일부만 자동 |
| 186 | 185 | Knighthood | **참조** · 야망·이상 자격 일부와 설명 제공 | 계급별 자격·의무·혜택·은퇴 실행기 | 이상 영광 일부만 자동 |
| 187 | 186 | Chapter Eleven: Ambitions and Ideals | **참조** · 야망·이상 자격 일부와 설명 제공 | 계급별 자격·의무·혜택·은퇴 실행기 | 이상 영광 일부만 자동 |
| 188 | 187 | Standings: A count is a powerful and respected lord, and as | **참조** · 야망·이상 자격 일부와 설명 제공 | 계급별 자격·의무·혜택·은퇴 실행기 | 이상 영광 일부만 자동 |
| 189 | 188 | Chapter Eleven: Ambitions and Ideals | **참조** · 야망·이상 자격 일부와 설명 제공 | 계급별 자격·의무·혜택·은퇴 실행기 | 이상 영광 일부만 자동 |
| 190 | 189 | Standings: +3 to all | **참조** · 야망·이상 자격 일부와 설명 제공 | 계급별 자격·의무·혜택·은퇴 실행기 | 이상 영광 일부만 자동 |
| 191 | 190 | Chapter Eleven: Ambitions and Ideals | **참조** · 야망·이상 자격 일부와 설명 제공 | 계급별 자격·의무·혜택·은퇴 실행기 | 이상 영광 일부만 자동 |
| 192 | 191 | Chapter 19). | **참조** · 야망·이상 자격 일부와 설명 제공 | 계급별 자격·의무·혜택·은퇴 실행기 | 이상 영광 일부만 자동 |
| 193 | 192 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 194 | 193 | Chapter Twelve: | **구현** · 화폐·장원·생활 수준을 단일 경제 상태와 겨울 정산에 연결 | 없음 | £1=20s=240d와 £6 보통 유지 기준 |
| 195 | 194 | Chapter Twelve: Wealth and Treasure | **구현** · 다섯 생활 수준의 비용·연간 결과 실행 | 없음 | 사회적 외형과 법적 서술은 참조로 제공 |
| 196 | 195 | N | **구현** · 전쟁 전리품을 보물 자산으로 인계하고 토지·수행단과 전문 인력 상태 제공 | 없음 | 현금화 전 전리품은 Inventory·Economy·Chronicle에 한 번만 기록 |
| 197 | 196 | Chapter Twelve: Wealth and Treasure | **구현** · 몸값 Table 12-1, 주군·가문 지원, 보편적 원조 실행 | 없음 | Chapter 8 청구·포로 상태·현금·연대기를 한 정산으로 연결 |
| 198 | 197 | Getting Money | **구현** · 원조·Tallage·Impost·서비스·대출 절차 실행 | 없음 | Impost Commoners Standing -2 포함 |
| 199 | 198 | Chapter Twelve: Wealth and Treasure | **구현** · 전리품 매각·예금·대규모 지출·시장 거래 실행 | 없음 | 매각은 통상 반값·자신의 주군 정가, 중복 거래 ID는 재적용하지 않음 |
| 200 | 199 | The Market | **구현** · 도시 시장, Phase, 기근 식량 배수와 탈것 가격표 실행 | 없음 | 외래품은 비교 참조, GM 품절은 명시 입력 |
| 201 | 200 | Chapter Twelve: Wealth and Treasure | **구현** · 동물·갑옷·방패 가격과 전투 수치 연결 | 없음 | Protection·DEX가 Chapter 7 상태에 전달 |
| 202 | 201 | The Market | **구현** · 마갑·근접·원거리 무기 표와 전투 장비 연결 | 없음 | 말 이동·DEX, 무기 특수값과 탄약 연결 |
| 203 | 202 | Chapter Twelve: Wealth and Treasure | **구현** · 의복·보석·서비스·잡화 전체 가격표 거래 | 없음 | 표 구조와 단위 보존 |
| 204 | 203 | The Market | **구현** · 일반 건물·개량·방어시설 비용·Phase·DV 실행 | 없음 | 방어시설 Standing [lord] 승인 필요 |
| 205 | 204 | Chapter Twelve: Wealth and Treasure | **구현** · 용병·공성 장비·전문 수행원 생성과 특수 능력 실행 | 없음 | 연봉·Glory·겨울 경험·해고 포함 |
| 206 | 205 | H | **구현** · 첩자·종자·청지기, 해방 목적 지불, 마법 물품 획득 경계 실행 | 없음 | 말 공격 행동은 Chapter 18 범위로 분리 |
| 207 | 206 | Chapter Twelve: Wealth and Treasure | **구현** · 마법 서적·잡화 전체를 참조·소유·사용 상태로 제공 | 없음 | GM 서사 결과는 기록하되 자동 창작하지 않음 |
| 208 | 207 | Enchanted Items | **구현** · 전투·전쟁·노화 관련 마법 효과를 해당 엔진에 연결 | 없음 | 사용 횟수와 소모 상태 저장 |
| 209 | 208 | Chapter Twelve: Wealth and Treasure | **구현** · 마법 무기·갑옷 수치와 기사도적 사용 제약 실행 | 없음 | 기술·피해·방어·HP·낙마·첫 사격 연결 |
| 210 | 209 | Enchanted Items | **구현** · 잔여 갑옷·기독교 유물의 효과·조건과 사용 기록 제공 | 없음 | 정확한 종교 특성 6종, 화염·First Aid·보호 반지·첫 라운드 방어 연결 |
| 211 | 210 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 212 | 211 | Book II: Setting | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 책 구조 확인 |
| 213 | 212 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 214 | 213 | Chapter Thirteen: | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 215 | 214 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 216 | 215 | Feudalism | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 217 | 216 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 218 | 217 | Social Classes | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 219 | 218 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 220 | 219 | F | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 221 | 220 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 222 | 221 | Justice | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 223 | 222 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 224 | 223 | Justice | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 225 | 224 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 226 | 225 | The Palace | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 227 | 226 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 228 | 227 | Knighthood | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 229 | 228 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 230 | 229 | Hunting | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 231 | 230 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 232 | 231 | A | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 233 | 232 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 234 | 233 | F | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 235 | 234 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 236 | 235 | Travel | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 237 | 236 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 238 | 237 | L | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 239 | 238 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 240 | 239 | Family | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 241 | 240 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 242 | 241 | I | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 243 | 242 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 244 | 243 | Religion | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 245 | 244 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 246 | 245 | Church Organization | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 247 | 246 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 248 | 247 | Church Organization | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 249 | 248 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 250 | 249 | Church Organization | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 251 | 250 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 252 | 251 | Church Organization | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 253 | 252 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 254 | 253 | Warfare | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 255 | 254 | Chapter Thirteen: Frankish Society | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 256 | 255 | S | **참조** · Frankish 사회·의무·종교·생활 자료 제공 | 봉건 의무와 법·교회 절차 전체 자동 판정 | 서술을 규칙으로 추측하지 않음 |
| 257 | 256 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 258 | 257 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 259 | 258 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 260 | 259 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 261 | 260 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 262 | 261 | Chapter Fourteen: | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 263 | 262 | Chapter Fourteen: Frankland | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 264 | 263 | Austrasia | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 265 | 264 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 266 | 265 | Austrasia | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 267 | 266 | Chapter Fourteen: Frankland Austrasia | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 268 | 267 | Austrasia | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 269 | 268 | Chapter Fourteen: Frankland | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 270 | 269 | Austrasia | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 271 | 270 | Chapter Fourteen: Frankland | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 272 | 271 | Austrasia | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 273 | 272 | Chapter Fourteen: Frankland | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 274 | 273 | Neustria | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 275 | 274 | Chapter Fourteen: Frankland | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 276 | 275 | Neustria | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 277 | 276 | Chapter Fourteen: Frankland | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 278 | 277 | Aquitaine | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 279 | 278 | Chapter Fourteen: Frankland | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 280 | 279 | C | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 281 | 280 | Chapter Fourteen: Frankland | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 282 | 281 | C | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 283 | 282 | Chapter Fourteen: Frankland | **참조** · Frankland 지역·장소·지도 자료 제공 | 모든 장소 보정과 이동의 상태 연결 | 여행 화면은 부분 |
| 284 | 283 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 285 | 284 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 286 | 285 | Chapter Fifteen: The Future | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 287 | 286 | Chapter Fifteen: The Future | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 288 | 287 | Phase 1: Unification | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 289 | 288 | Chapter Fifteen: The Future | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 290 | 289 | Phase 1: Unification | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 291 | 290 | Chapter Fifteen: The Future | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 292 | 291 | Phase 1: Unification | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 293 | 292 | Chapter Fifteen: The Future | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 294 | 293 | Phase 1: Unification | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 295 | 294 | Chapter Fifteen: The Future | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 296 | 295 | Phase 1: Unification | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 297 | 296 | Chapter Fifteen: The Future | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 298 | 297 | F | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 299 | 298 | Chapter Fifteen: The Future | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 300 | 299 | Phase 2: Expansion | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 301 | 300 | Chapter Fifteen: The Future | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 302 | 301 | Phase 2: Expansion | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 303 | 302 | Chapter Fifteen: The Future | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 304 | 303 | Phase 2: Expansion | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 305 | 304 | Chapter Fifteen: The Future | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 306 | 305 | Phase 2: Expansion | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 307 | 306 | Chapter Fifteen: The Future | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 308 | 307 | F | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 309 | 308 | Chapter Fifteen: The Future | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 310 | 309 | Phase 3: Consolidation | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 311 | 310 | Chapter Fifteen: The Future | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 312 | 311 | F | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 313 | 312 | Chapter Fifteen: The Future | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 314 | 313 | Phase 4: Empire | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 315 | 314 | Chapter Fifteen: The Future | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 316 | 315 | Phase 4: Empire | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 317 | 316 | Chapter Fifteen: The Future | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 318 | 317 | Phase 4: Empire | **부분** · 767-814 연대와 Phase를 연도 자료에 반영 | 모든 연도 사건의 자동 모험·수확·전쟁 실행 | 사건은 GM 캠페인 선택 |
| 319 | 318 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 320 | 319 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 321 | 320 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 322 | 321 | Chapter Sixteen: | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 323 | 322 | Chapter Sixteen: Non-Player Characters | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 324 | 323 | Main Heroes | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 325 | 324 | Chapter Sixteen: Non-Player Characters | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 326 | 325 | Paladins | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 327 | 326 | Chapter Sixteen: Non-Player Characters | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 328 | 327 | S | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 329 | 328 | Chapter Sixteen: Non-Player Characters | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 330 | 329 | Minor Characters | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 331 | 330 | Chapter Sixteen: Non-Player Characters | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 332 | 331 | Minor Characters | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 333 | 332 | Chapter Sixteen: Non-Player Characters | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 334 | 333 | Minor Characters | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 335 | 334 | Chapter Sixteen: Non-Player Characters | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 336 | 335 | Paladins. | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 337 | 336 | Chapter Sixteen: Non-Player Characters | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 338 | 337 | Minor Characters | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 339 | 338 | Chapter Sixteen: Non-Player Characters | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 340 | 339 | Minor Characters | **참조** · 주요·부차 인물 자료 검색 제공 | NPC 모든 행동·전투 실행 | 전투 엔진 미구현 영향 |
| 341 | 340 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 342 | 341 | Chapter Seventeen: | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 343 | 342 | Chapter Seventeen: Foreign Cultures | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 344 | 343 | Bretons | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 345 | 344 | Chapter Seventeen: Foreign Cultures | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 346 | 345 | M | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 347 | 346 | Chapter Seventeen: Foreign Cultures | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 348 | 347 | Danes | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 349 | 348 | Chapter Seventeen: Foreign Cultures | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 350 | 349 | M | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 351 | 350 | Chapter Seventeen: Foreign Cultures | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 352 | 351 | Huns | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 353 | 352 | Chapter Seventeen: Foreign Cultures | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 354 | 353 | Jews | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 355 | 354 | Chapter Seventeen: Foreign Cultures | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 356 | 355 | Lombards | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 357 | 356 | Chapter Seventeen: Foreign Cultures | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 358 | 357 | Moors and Saracens | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 359 | 358 | Chapter Seventeen: Foreign Cultures | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 360 | 359 | Moors and Saracens | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 361 | 360 | Chapter Seventeen: Foreign Cultures | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 362 | 361 | Persians | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 363 | 362 | Chapter Seventeen: Foreign Cultures | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 364 | 363 | Romans | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 365 | 364 | Chapter Seventeen: Foreign Cultures | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 366 | 365 | Saxons and Frisians | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 367 | 366 | Chapter Seventeen: Foreign Cultures | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 368 | 367 | M | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 369 | 368 | Chapter Seventeen: Foreign Cultures | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 370 | 369 | 767. The Franks wholly reconquered Septimania in 754, and | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 371 | 370 | Chapter Seventeen: Foreign Cultures | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 372 | 371 | S | **참조** · 외국 문화 자료 제공 | 문화별 완전한 캐릭터 생성·수정치 적용 | Frankish Ardennes만 완전 경로 |
| 373 | 372 | 도판·백지 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 렌더링으로 확인 |
| 374 | 373 | Chapter Eighteen: | **구현** · Glory Won·Movement와 표준 기사 statblock registry | 없음 | Chapter 7 adapter와 원문 page 보존 |
| 375 | 374 | Chapter Eighteen: Opponents and Creatures | **구현** · 기사·병사·외국 전사와 공격·탈것 선택 | 없음 | 범위 없는 값은 exact |
| 376 | 375 | SIZ 12, DEX 14, STR 15, CON 15, APP 13 | **구현** · 외국 전사·일반인 stat/skill/Glory | 없음 | Chapter 7 participant |
| 377 | 376 | Chapter Eighteen: Opponents and Creatures | **구현** · 일반인·여성 NPC statblock | 없음 | 공격 없는 NPC도 reference participant 지원 |
| 378 | 377 | SIZ 15, DEX 10, STR 15, CON 10 | **구현** · 12종 일반 말 stat·HP·DEX·Armor·Move | 없음 | Economy v2 mount identity 재사용 |
| 379 | 378 | Chapter Eighteen: Opponents and Creatures | **구현** · Hunt/Combat/Attack Training, Table 18-1, Ruining Horses, Bayard | 없음 | 매 라운드 통제·도주·+5·파손 수치 실행 |
| 380 | 379 | SIZ 55, DEX 17, STR 20, CON 12 | **구현** · Camel·Elephant·Pony·trained animal | Table 10-8 Camel 추위는 외부 참조 | Elephant Prudent/throw 실행 |
| 381 | 380 | Chapter Eighteen: Opponents and Creatures | **구현** · Avoidance와 Discretion/Valor gate, Aurochs | 없음 | 주저·도주·재시도·Prudent 회피 저장 |
| 382 | 381 | SIZ 25, DEX 10, STR 25, CON 18 | **구현** · Bear·Boar·Deer·Lions 다중/조건 공격 | 없음 | mount-first·last round 포함 |
| 383 | 382 | Chapter Eighteen: Opponents and Creatures | **구현** · Panther·Wolf·Ogre와 monster partial Glory | 없음 | 행동 노트·Glory 분배 |
| 384 | 383 | SIZ 5, DEX 25, STR 10, CON 50 | **구현** · Giants·Basilisk·Centaur의 범위/특수 공격 | 없음 | gaze·독·배타 공격 state |
| 385 | 384 | Chapter Eighteen: Opponents and Creatures | **구현** · Demon·Dragon·Ghost reference | Ghost는 원문상 narrative | 재생·GM fire·Christian magic record |
| 386 | 385 | SIZ 6, DEX 30, STR 16, CON 20 | **구현** · Goblin virtue와 Griffin fly-by/grapple/drop | 없음 | source ability transaction |
| 387 | 386 | Chapter Eighteen: Opponents and Creatures | **부분** · Harpy·Hippogriff | Hippogriff Hoofs와 fly-by claw/bite 원문 충돌 | Harpy 면역 실행, Hippogriff TODO/GM record |
| 388 | 387 | SIZ 3, DEX 10, STR 30, CON 15 | **구현** · Manticore·Nuton·Orc·Pegasus | 없음 | 면역·재생·capture/Honor·lance -5/12d6 |
| 389 | 388 | Chapter Eighteen: Opponents and Creatures | **구현** · Siren·Unicorn·Will-o-wisp/Faerie reference | 서사 마법은 GM 판단 | song·Cruel·uncapturable 실행 |
| 390 | 389 | Enchanted Creatures | **구현/참조** · Faerie Enchantress GM state와 named faerie/Other Monsters reference | 원문이 GM 생성 요구 | 원문 없는 stat을 창작하지 않음 |
| 391 | 390 | 390 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 책 구조 확인 |
| 392 | 391 | Chapter Nineteen: | **부분** · Chapter 19 원문 범위와 모험 유형을 앱 목록에 반영 | 완전 장편·Short Form 분기 | 34개 절차 catalog 진입점 |
| 393 | 392 | Chapter Nineteen: Adventures | **부분** · 저장 가능한 Adventure state와 GM/player decision 제공 | 모든 장면별 전용 resolver | 공용 engine은 구현 |
| 394 | 393 | S | **부분** · 모험 시작·참가자·연도·단계 상태 보존 | 원문 예시 전체의 실행 소비 | narrative는 GM 기록 |
| 395 | 394 | Chapter Nineteen: Adventures | **부분** · Jewel setup과 판정 stage 구현 | 도적 추격 Hunt 분기 | Chapter 7 복귀 지원 |
| 396 | 395 | The Adventure of the Jewel | **부분** · 순례자 선택, relic Prayer, Brigands 전투 구현 | 추격·자비의 모든 후속 체크 | 기도 결과는 canonical 복귀 |
| 397 | 396 | Chapter Nineteen: Adventures | **부분** · route 선택, Hermit GM 결정, sourced Dream 구현 | route별 세부 이동 반복 | 선택하지 않은 Dream 자동 skip |
| 398 | 397 | The Adventure of the Jewel | **부분** · Beaver Dam과 Esneux 원문 판정 구현 | 모든 실패 후속을 전용 state로 분리 | 공용 test 사용 |
| 399 | 398 | Chapter Nineteen: Adventures | **부분** · Eingarstein 결정과 Chapter 7 전투 구현 | Eingar의 모든 서사 분기 | relic Prayer 성공 시 Eingar 전 행동 -5 |
| 400 | 399 | The Adventure of the Jewel | **부분** · 귀환, Glory·Treasure ledger 연결 | 조건별 Glory preset 자동화 | Economy v2 사용 |
| 401 | 400 | Chapter Nineteen: Adventures | **부분** · Humble Squires setup과 원정 참가자 보존 | 전체 원정 세부 분기 | 다인 참가자 명시 |
| 402 | 401 | The Adventure of the Humble Squires | **부분** · Mountain Dangers와 White Deer Hunt 구현 | 산악 위험의 모든 피해 자동 연결 | Hunt는 종단 실행 |
| 403 | 402 | Chapter Nineteen: Adventures | **부분** · Rumors와 canonical blessing·Passion conflict·Dream 구현 | 소문별 후속 서술 | Personality/Magic 복귀 고정 |
| 404 | 403 | Table 19–2: Rumors During a short religious ceremony, Archbishop Turpin | **부분** · Passion conflict 후 Rome battle을 Chapter 8로 호출 | 전투 전 세부 지휘 분기 | Chapter 8 복귀 지원 |
| 405 | 404 | Chapter Nineteen: Adventures | **부분** · Table 19-3 적 결과와 Chapter 7 연결 | 모든 round 반복·종료 자동화 | 표 결과 재추첨 방지 |
| 406 | 405 | Table 19–4: Random Battle Enemy in the back: 100. | **부분** · 3라운드 적과 포로·약탈 선택 구현 | 선택별 전체 후속 수치 preset | Economy 연결 가능 |
| 407 | 406 | Chapter Nineteen: Adventures | **부분** · 서임 dependency, Mount Bitter 표와 개인전 연결 | 전투 전체 round 자동 진행 | Chapter 1·18 의존 보존 |
| 408 | 407 | The Adventure of the Humble Squires | **부분** · 선택적 challenge·ambush 전투 구현 | Aumont·Floripas 세부 분기 | Chapter 7 사용 |
| 409 | 408 | Chapter Nineteen: Adventures | **부분** · 결말과 Chronicle/ledger 후속 stage 구현 | 조건별 Glory preset 자동화 | 의미 있는 결말 기록 |
| 410 | 409 | T | **부분** · Humble Squires 완료·보류·재개 지원 | 모든 장기 후속 자동화 | active state 정상 종료 |
| 411 | 410 | Chapter Nineteen: Adventures | **부분** · 18개 Short Form 공통 source 구조 구현 | 각 시나리오의 개별 branch state | Secrets는 GM decision |
| 412 | 411 | Short Form Scenarios | **부분** · Adulterous Prayer와 Angry Merchant Snap Out 실행 | 세부 후속 자동화 | Personality/Magic·Chapter 7·Standing 연결 |
| 413 | 412 | Chapter Nineteen: Adventures | **부분** · Blue Heaven·Devil's Bridge Prayer/Dream·Faerie Castle 흐름 | 시나리오별 전용 반복 | Chapter 18·Personality/Magic 연결 |
| 414 | 413 | Short Form Scenarios | **부분** · Bayard·Foreign Embassy 흐름 | Bayard 특수 상태 전용 resolver | Economy·Standing 연결 |
| 415 | 414 | Chapter Nineteen: Adventures | **부분** · Greedy Abbot 원문 접근·판정·결말 기록 | 마법·적 특수능력 | GM 결정 보존 |
| 416 | 415 | Short Form Scenarios | **부분** · Guarding Maugis 흐름 | 추격과 마법 가루 전용 state | Chapter 7 연결 |
| 417 | 416 | Chapter Nineteen: Adventures | **부분** · Love Conquers All의 accelerated Amor와 세 과업 실행 | 다른 조우 세부 branch | Chapter 3/9 직접 의존 닫힘 |
| 418 | 417 | Short Form Scenarios | **부분** · Melancholic Paladin Snap Out와 양쪽 후유 상태 실행 | 시나리오 세부 설득 branch | Chapter 3·18 직접 의존 닫힘 |
| 419 | 418 | Chapter Nineteen: Adventures | **부분** · Miracle of Truth Prayer·miracle decision·Standing 연결 | 기적의 원문상 GM 서술 | Chapter 9 직접 의존 닫힘 |
| 420 | 419 | Short Form Scenarios | **부분** · Noble Hostage miracle·Pagan Lady Amor 변환 실행 | 인질 세부 branch | Economy v2 몸값 |
| 421 | 420 | Chapter Nineteen: Adventures | **부분** · Pagan Prison NPC Amor와 전투·공성·경제 bridge | 탈출 세부 branch | Chapter 7·8·12·18 재사용 |
| 422 | 421 | Short Form Scenarios | **부분** · Rebellious Baron 흐름 | 모든 잠입·결투 후속 자동화 | Standing·Glory 연결 |
| 423 | 422 | Chapter Nineteen: Adventures | **부분** · Small Knight 흐름과 Chapter 7 연결 | NPC 특수 수치·비극 분기 | GM 결말 기록 |
| 424 | 423 | Short Form Scenarios | **부분** · Wrathful Lord 특수 Shock·opposed Passion 실행 | Chase 세부 반복 resolver | 성공 시 Aging, 실패 시 Shock 회피 원문 보존 |
| 425 | 424 | Chapter Nineteen: Adventures | **구현** · Hunt 준비, 참가자와 segment 상태 | 없음 | Search/Chase 진입 |
| 426 | 425 | Table 19–8: Hunting Terrain Modifiers | **구현** · Table 19-8-11을 Chase·Obstacle·Prey에서 소비 | 원문 Table 19-11 중첩은 GM 선택 | 재추첨 방지 |
| 427 | 426 | Chapter Nineteen: Adventures | **구현** · Table 19-12 기습과 Chapter 7 전투·종료 구현 | Chapter 18 특수능력은 GM stat 입력 | Hunt 종단 완료 |
| 428 | 427 | Table 19–13: Challenge Encounters | **부분** · Challenges 표 2개와 Chapter 7 복귀 | 월간 반복 자동 종료 | 표 결과 보존 |
| 429 | 428 | Chapter Nineteen: Adventures | **부분** · Feud 표와 Chapter 8 bridge | 친족 소집·정지 자동화 | GM 선택 보존 |
| 430 | 429 | Paladin: A Player-knight may attempt to cure a melan- | **부분** · Forest 표 2개와 전투 bridge | 20까지 일일 반복 자동화 | 결과 고정 |
| 431 | 430 | Chapter Nineteen: Adventures | **부분** · Holy Lands 표 2개와 Economy·Battle bridge | 다년 반복·Aging 자동 연결 | 외부 의존 보존 |
| 432 | 431 | Table 19–20: Mad Acts | **부분** · Wild Hunt의 Mad Acts·Character Changes·연간 회복 실행 | Madness 기간의 원문상 서사 | canonical 상태와 GM 후속 기록 |
| 433 | 432 | Chapter Nineteen: Adventures | **부분** · Mallus·Missus 표 소비 | 판결·감찰 후속 자동화 | 인쇄 모호성 보존 |
| 434 | 433 | Table 19–27: Amor Modifiers | **구현** · Pilgrimage·Romance의 canonical 선언과 modifier 소비 | 없음 | Chapter 3/9 직접 의존 닫힘 |
| 435 | 434 | Chapter Nineteen: Adventures | **구현** · Lover's Tasks·Essai·다음 Winter·Consummation 실행 | 임신은 Family/GM 원문 절차 | 장기 상태 저장·재개 |
| 436 | 435 | Table 19–29: Sample Discovery Factors | **구현** · Discovery·Exposure 표와 Amor 종료 실행 | 없음 | UI 종단 실플레이 통과 |
| 437 | 436 | Chapter Nineteen: Adventures | **부분** · Royal Court optional Amor·Tournament 절차와 표 소비 | 경연·pairing 자동 반복 | Chapter 7·Personality/Magic 재사용 |
| 438 | 437 | Table 19–33: | **부분** · Tournament·Vassal Service 표 소비 | melee·3회 무중복 추첨 자동화 | 결과 저장 |
| 439 | 438 | Chapter Nineteen: Adventures | **부분** · Your Manor 표 2개와 Economy·Standing bridge | 연간 장원 반복 자동화 | Chapter 12 재사용 |
| 440 | 439 | Appendix One: Names | **부분** · 이름 자료 일부를 생성·참고에 사용 | 모든 문화권·성별 이름 선택기 | Frankish 기본 지원 |
| 441 | 440 | Appendix One: Names | **부분** · 이름 자료 일부를 생성·참고에 사용 | 모든 문화권·성별 이름 선택기 | Frankish 기본 지원 |
| 442 | 441 | Appendix Two: Bibliography | **참조** · 서지를 감사 출처 확인에 사용 | 런타임 구현 대상 아님 | 규칙 근거용 |
| 443 | 442 | Appendix Two: Bibliography | **참조** · 서지를 감사 출처 확인에 사용 | 런타임 구현 대상 아님 | 규칙 근거용 |
| 444 | 443 | Carolingian Studies | **참조** · 서지를 감사 출처 확인에 사용 | 런타임 구현 대상 아님 | 규칙 근거용 |
| 445 | 444 | Appendix Three: | **참조** · 가계도·가족 연대와 원문 가문 자료 연결 | 모든 부록 가문의 사전 구성 데이터 | 사용자 가문 사건은 시간순 기록 |
| 446 | 445 | The House of the Agilolfings (Bavaria and Denmark) | **참조** · 가계도·가족 연대와 원문 가문 자료 연결 | 모든 부록 가문의 사전 구성 데이터 | 사용자 가문 사건은 시간순 기록 |
| 447 | 446 | The House of Ardennes Lambert of | **참조** · 가계도·가족 연대와 원문 가문 자료 연결 | 모든 부록 가문의 사전 구성 데이터 | 사용자 가문 사건은 시간순 기록 |
| 448 | 447 | The House of the Arnulfings (Carolingians) | **참조** · 가계도·가족 연대와 원문 가문 자료 연결 | 모든 부록 가문의 사전 구성 데이터 | 사용자 가문 사건은 시간순 기록 |
| 449 | 448 | The House of Aigremont/Clermont (The Aymonides) | **참조** · 가계도·가족 연대와 원문 가문 자료 연결 | 모든 부록 가문의 사전 구성 데이터 | 사용자 가문 사건은 시간순 기록 |
| 450 | 449 | The House of Doon de Mayence | **참조** · 가계도·가족 연대와 원문 가문 자료 연결 | 모든 부록 가문의 사전 구성 데이터 | 사용자 가문 사건은 시간순 기록 |
| 451 | 450 | The House of Mayence (The Traitors) | **참조** · 가계도·가족 연대와 원문 가문 자료 연결 | 모든 부록 가문의 사전 구성 데이터 | 사용자 가문 사건은 시간순 기록 |
| 452 | 451 | The House of Nanteuil | **참조** · 가계도·가족 연대와 원문 가문 자료 연결 | 모든 부록 가문의 사전 구성 데이터 | 사용자 가문 사건은 시간순 기록 |
| 453 | 452 | The House of Monglane (The Narbonnais) | **참조** · 가계도·가족 연대와 원문 가문 자료 연결 | 모든 부록 가문의 사전 구성 데이터 | 사용자 가문 사건은 시간순 기록 |
| 454 | 453 | DEX 20__________________________ | **부분** · 캐릭터·가문·연대·영광·지위를 디지털 화면으로 표현 | 종이 시트의 모든 자유 메모·전투 필드 등가 | 핵심 저장 필드 보존 |
| 455 | 454 | SIZ ____________ | **부분** · 캐릭터·가문·연대·영광·지위를 디지털 화면으로 표현 | 종이 시트의 모든 자유 메모·전투 필드 등가 | 핵심 저장 필드 보존 |
| 456 | 455 | DEX __________________________ | **부분** · 캐릭터·가문·연대·영광·지위를 디지털 화면으로 표현 | 종이 시트의 모든 자유 메모·전투 필드 등가 | 핵심 저장 필드 보존 |
| 457 | 456 | DEX __________________________ | **부분** · 캐릭터·가문·연대·영광·지위를 디지털 화면으로 표현 | 종이 시트의 모든 자유 메모·전투 필드 등가 | 핵심 저장 필드 보존 |
| 458 | 457 | SIZ 18 | **부분** · 캐릭터·가문·연대·영광·지위를 디지털 화면으로 표현 | 종이 시트의 모든 자유 메모·전투 필드 등가 | 핵심 저장 필드 보존 |
| 459 | 458 | SIZ 16 | **부분** · 캐릭터·가문·연대·영광·지위를 디지털 화면으로 표현 | 종이 시트의 모든 자유 메모·전투 필드 등가 | 핵심 저장 필드 보존 |
| 460 | 459 | DEX __________________________ | **부분** · 캐릭터·가문·연대·영광·지위를 디지털 화면으로 표현 | 종이 시트의 모든 자유 메모·전투 필드 등가 | 핵심 저장 필드 보존 |
| 461 | 460 | Standings _____________________________ | **부분** · 캐릭터·가문·연대·영광·지위를 디지털 화면으로 표현 | 종이 시트의 모든 자유 메모·전투 필드 등가 | 핵심 저장 필드 보존 |
| 462 | 461 | Family Character SHeet | **부분** · 캐릭터·가문·연대·영광·지위를 디지털 화면으로 표현 | 종이 시트의 모든 자유 메모·전투 필드 등가 | 핵심 저장 필드 보존 |
| 463 | 462 | NMPAL01 | **해당 없음** · 표지·구분지·백지·도판 | 없음 | 책 구조 확인 |

## 최종 판정

Chapter 17의 15개 외국 문화 생성, 종교, 장비, 말, 저장·재개와 기존 엔진 연결을 완료했습니다. 그러나 Chapter 2·4·5·6·10·11·15와 Chapter 19에 확인된 결정적 공백이 있어 현재 빌드를 Rulebook 없이 모든 Paladin 절차를 완주 가능한 최종판으로 승인할 수는 없습니다. 현재 장별 snapshot과 실제 blocker는 `CHAPTER17_COMPLETION_REPORT.md`에 기록했으며, 다음 작업은 특정 장 구현이 아니라 전체 규칙서 gap 재감사여야 합니다.
## Superseding Phase 16 Current State - 2026-08-12

The Phase 15 page ledger and all older page rows below are preserved as historical evidence. Phase 16 rechecked every one of its 46 Gap IDs against the cited source pages and closed the actual deterministic set.

| Current delivery status | PDF pages |
|---|---:|
| Not Applicable | 36 |
| Reference | 116 |
| Complete | 36 |
| Complete / qualified complete | 275 |
| Partial due to deterministic implementation gap | 0 |
| **Total** | **463** |

The 132 pages previously folded into `Partial` now have reachable canonical consumers. Qualified completion still preserves intentional GM/player narrative and the nine source-ambiguity clusters; those are not implementation gaps. Current chapter verdicts and all 46 source-to-runtime mappings are recorded in `FINAL_GAP_CLOSURE_REPORT.md`.

Current deterministic counts: **Blocker 0 / Major 0 / Minor 0 / Total 0**.

## Phase 17 Release Candidate Certification - 2026-08-12

- Certification baseline: `237c9db32251e0cdb1bfe896937371f69e234534`, schema v12, clean worktree.
- Page coverage remains: Not Applicable 36 / Reference 116 / Complete 36 / Complete or qualified complete 275 / deterministic Partial 0 / Total 463.
- The nine source ambiguity clusters remain unchanged and no unsupported value was invented.
- Full temporary CI, all current chapter regressions, final-gap regression, migration, hostile saves, production build and the 11-year campaign passed.
- Production-browser certification reproduced `RC-BLOCK-001`: editing a Character Dossier skill number causes focus to move to `BODY` after the state update.
- The defect does not reopen any rule Gap ID, but it fails desktop keyboard accessibility and repository lint-risk gates.
- Per the Phase 17 stop policy, the remaining manual UI matrix was not executed and no gameplay source was modified.

Current rule status: **PALADIN DETERMINISTIC RULEBOOK COVERAGE COMPLETE**.

Current release status: **PALADIN v1.0 RELEASE CANDIDATE - BLOCKED**.

## Superseding Phase 17 Remediation and Certification Restart - 2026-08-12

The blocked result immediately above is preserved as the first frozen-baseline run. After explicit user authorization, `RC-BLOCK-001` and the remaining React Hook runtime-risk findings were corrected and the complete automated and production-browser gates were rerun.

- Source baseline: `237c9db32251e0cdb1bfe896937371f69e234534` plus authorized uncommitted source patch SHA-256 `3b0182bdaf76364479ce32ae0ccd2dcf1e3abe6e37356c2586482da11448998e`.
- Page coverage remains: Not Applicable 36 / Reference 116 / Complete 36 / Complete or qualified complete 275 / deterministic Partial 0 / Total 463.
- Deterministic counts remain: Blocker 0 / Major 0 / Minor 0 / Total 0.
- Nine source ambiguity clusters remain explicit and unchanged.
- Full temporary CI, all chapter regressions, migration, hostile saves, production build, and the 11-year campaign pass.
- Production UI: all 15 routes load; Character skill focus survives updates; Hunt and Combat survive reload at the exact stage/round; responsive 360/375/390/768/1440/1920/3440 checks have 0 horizontal overflow after Family remediation; the mobile Family editor uses readable one-column cards and 44 px action controls; console has 0 errors / 0 warnings.

## Superseding v1.1 Personal Rulebook Transplant Evidence - 2026-08-13

- 463/463 PDF pages are available through the lazy Personal Rulebook reader, with exact physical-page facsimile fallback.
- All 22 source groups, 163 tables, 210 Rule blocks, 152 Procedure blocks and nine source-ambiguity clusters pass the transplant regression.
- Production-browser certification passes 37/37 gates, including contextual links, search, tables, personal library persistence and read-only campaign behavior.
- Responsive reader evidence passes at 360, 390, 768, 1440, 1920 and 3440 px with zero horizontal overflow.
- Representative normal play required zero deterministic consultations of the external PDF.
- Full v1.0 gameplay CI, schema-v12 migration, hostile saves/idempotency and the 11-year campaign remain PASS.

Current transplant status: **PALADIN PERSONAL RULEBOOK TRANSPLANT COMPLETE**. See `PERSONAL_RULEBOOK_BROWSER_CERTIFICATION.md`.
- Repository lint is now 129 errors / 0 warnings, all `no-unused-vars` or `no-useless-assignment`; runtime-risk Hook findings are 0.
- Physical-device, physical screen-reader, and authenticated Firebase multi-client checks remain environment limitations rather than rule gaps.

Current rule status: **PALADIN DETERMINISTIC RULEBOOK COVERAGE COMPLETE**.

Current release status: **PALADIN v1.0 RELEASE CANDIDATE - CERTIFIED**.

The authoritative certification evidence is `FINAL_RULEBOOK_CERTIFICATION.md`. No commit, push, release tag, deployment, or final production release was performed.

# Release Candidate Checklist

> **Current Phase 16 verdict:** **PALADIN DETERMINISTIC RULEBOOK COVERAGE COMPLETE** with Blocker 0 / Major 0 / Minor 0. The Phase 15 hold immediately below is retained as historical before-state evidence; the superseding Phase 16 checklist follows it. Final release certification remains a separate phase.

## 판정

**완전판 출시 보류 - FINAL GAP CLOSURE REQUIRED**

Phase 15의 463-page current-state certification이 이전 체크리스트 판정을 supersede합니다. 현재 실제 deterministic rule gap은 **46건: 5 Blocker, 40 Major, 1 Minor**입니다. Chapter 3·7·8·9·12의 `COMPLETE WITH INTENTIONAL GM/NARRATIVE`, Chapter 17·18의 `COMPLETE WITH SOURCE AMBIGUITIES`, Chapter 19 framework의 완료 판정은 유지됩니다. 그러나 Chapter 1·2·4·5·6·10·11·13·15 및 Chapter 19의 명시적 절차가 남아 있어 앱 전체를 Rulebook replacement로 출시할 수 없습니다.

Intentional GM/player judgment, narrative interpretation, reference-only text, and 9 source ambiguity clusters are 공개하되 implementation gap으로 세지 않습니다. 상세 source of truth는 `FULL_RULEBOOK_GAP_AUDIT.md`입니다.

## 체크리스트

| 영역 | 상태 | 확인 내용 | 남은 차단 항목 |
|---|---|---|---|
| Rulebook Fidelity | 보류 | 463쪽 재감사, 46 actual gaps, 45 stale findings retired, 9 source ambiguities 분리 | `GAP-CH01-001` through `GAP-CH19-031`의 registry 46건 |
| Save Integrity | 통과 | schema v12·Economy v2·Adventure v1·Chapter 17 stable culture identity·Chapter 18 v1·Personality/Magic v1, 결정적 거래 ID 재적용 방지 | 실제 Firebase 자격 증명 환경의 충돌 복구 실검증 |
| Accessibility | 통과 | 360·390·768·1440·1920·3440px, 키보드 초점 이동·focus-visible·reduced motion·44px 터치 영역 확인 | 실제 화면 읽기 도구 사용자 검증은 후속 권장 |
| Mobile | 통과 | 상태띠 2행, 입력 격자 1열, `100dvh` 내부 스크롤 장부 목차, 모든 장 접근, 가로 넘침 0 | 없음 |
| Localization | 부분 통과 | 한국어 기본, 영문 병기, 캐릭터 이름 비고정, Hahmlet 로컬 서체, 영문 Black North 합성 Bold 제거 | 백과 원문의 일부 영문 문장과 고유명사 일관성 |
| Chronicle | 통과 | 전리품 확보와 몸값 정산을 포함한 의미 있는 사건만 자동 기록, 행정 정산 문구 제외 | 기존 사용자가 직접 작성한 과거 행정 문구는 원본 보존 |
| Family | 부분 통과 | 혼인·출산·사망·서임·계승 Family Timeline | shared-family/player roster와 Chapter 2 event-chain exactness |
| Winter | 부분 통과 | 원문 10단계, 결혼·출산·가족, 경험·훈련·영광, 영지 수입·대출 이자·예금 수수료·전문 수행원 정산, 11회 종단 실행 | survival target completeness, event hand-off, annual Harvest source map |
| Performance | 부분 통과 | 큰 기능 lazy loading 유지, Chapter 기능 chunk 분리, Hahmlet 662.99 kB | main production chunk 690.11 kB 경고와 실제 저사양 기기 React Profiler 계측 |
| Testing | 부분 통과 | full temporary CI PASS: build, rules, creation, lifecycle, Winter, Chapters 7/8/12/17/18/19, Personality/Magic, 11년 campaign, hostile save | 미구현 46건은 기존 통과 테스트의 coverage 밖; 전체 ESLint 135 errors/3 warnings |
| Remaining Known Issues | 보류 | 아래 목록을 공개 차단 항목으로 유지 | 완전판 출시 전 해결 필요 |

## 알려진 차단 항목

1. **Campaign foundation Blockers (3):** `GAP-CH02-001`, `GAP-CH15-001`, `GAP-CH15-002`. Exact ancestor event chains, annual Harvest values, and deterministic chronology customs are not canonical end-to-end. Shared-family roster `GAP-CH01-001` is a Major gap rather than a single-player campaign blocker.
2. **Standing/career Blockers (2):** `GAP-CH04-002`, `GAP-CH11-001`. Standing threshold consequences and the printed career/office lifecycle are not executable.
3. **Core Major/Minor gaps (10):** Major `GAP-CH01-001`, `GAP-CH04-001`, `GAP-CH05-001`, `GAP-CH06-002`, `GAP-CH10-001/002`, `GAP-CH11-002`, `GAP-CH13-001/002`; Minor `GAP-CH06-001`. These cover roster continuity, printed formulas, skill consequences, travel, Winter targets/events, ideals, chivalric settlement, and Feat reachability.
4. **Chapter 19 Major gaps (31):** `GAP-CH19-001` through `GAP-CH19-031`. The two long Adventures, all 18 Short Forms, and 11 of 14 Solo procedures still have at least one source-defined deterministic result without a runtime consumer. Hunt, Wild Hunt, and Romance retain their qualified COMPLETE statuses.
5. **Source ambiguities (not blockers):** Chapter 1 female Son Number/inheritance wording, Chapter 3 Melancholy duration, Chapter 15 Phase Four boundary, Chapter 17 generic Slav Pony, Chapter 18 Hippogriff attack, and Chapter 19 Tables 19-7/19-11/19-24. They are disclosed and excluded from the 46-gap count.
6. **Repository engineering debt (not a rule gap):** ESLint remains 135 errors/3 warnings. 130 errors are unused/dead assignment rules; 5 Hook errors and 3 dependency warnings warrant a separate React correctness pass. Production build passes with the existing 690.11 kB main-chunk warning.

## 검증 상태

| 검증 | 현재 결과 |
|---|---|
| Current full temporary CI | PASS |
| Production build | PASS, existing >500 kB chunk warning |
| Rules / creation / lifecycle / Winter | PASS |
| Chapters 7 / 8 / 12 / 17 / 18 / 19 | PASS for currently implemented coverage |
| Personality / Magic | PASS |
| 11-year campaign | PASS: 11 years, successor continuation, 0 consultations in covered regression path |
| Hostile save / idempotency / migration | PASS |
| Phase 15 modified-file lint | N/A: Markdown audit only; no JS/TS source changed |
| Repository-wide ESLint | FAIL: unchanged 135 errors / 3 warnings |
| Live Firebase conflict | NOT VERIFIED |
| Physical device and screen-reader session | NOT VERIFIED |

## 출시 허용 조건

- 완전한 디지털 Rulebook를 표방할 경우: `FULL_RULEBOOK_GAP_AUDIT.md`의 46건을 모두 닫고 463쪽 certification을 다시 수행해야 합니다.
- 현재 기능 범위로 출시할 경우: Character, Chronicle, Winter core, Complete Combat, Mass Battle, Siege, Economy, Chapter 17 Foreign Cultures, Chapter 18 Creatures, Chapter 3/9 gameplay dependency와 **Chapter 19 preview/partial support**만 명시할 수 있습니다. Chapter 19 또는 책 전체를 완전 지원한다고 표현해서는 안 됩니다.
- 두 경우 모두 저장 내보내기 백업과 배포본 smoke test를 마지막으로 통과해야 합니다. 360-3440px 시각 검사와 브라우저 콘솔 검사는 이 후보에서 통과했습니다.

Final rulebook status: **PARTIAL - FINAL GAP CLOSURE REQUIRED.**
## Superseding Phase 16 Deterministic Coverage - 2026-08-12

- [x] All 46 Phase 15 deterministic Gap IDs rechecked against their cited rulebook pages.
- [x] Current deterministic gap count: Blocker 0 / Major 0 / Minor 0 / Total 0.
- [x] Chapter 2 delayed ancestor death and Table 2-3 causes use the printed procedure.
- [x] Chapter 4 printed Glory formulas, exact Standing gifts and threshold consequences reach canonical state.
- [x] Chapter 5/6 skill, Feat and saveable travel procedures are normally reachable.
- [x] Chapter 10 survival target coverage and canonical Winter follow-up contract are enforced.
- [x] Chapter 11 careers, annual benefits, retirement and all three Ideal effects use shared engines.
- [x] Chapter 13 For Love/Conquest and chivalric siege settlements reach Chapter 7/8/12 state.
- [x] Chapter 15 annual Harvest modifiers and deterministic phase registry are active.
- [x] Chapter 19 note-only completion is blocked; every deterministic result requires canonical action, verified transaction or source-valid no-effect.
- [x] Schema v12 additive state, migration, save/reload and duplicate prevention pass.
- [x] Full temporary CI, hostile save regression and 11-year campaign pass.
- [x] Modified Phase 16 modules pass lint; repository baseline remains 135 errors / 3 warnings.
- [x] Production build passes; existing main-chunk warning remains release-performance debt.
- [x] 360 / 768 / 1440 / 1920 / 3440 and browser-console smoke checks pass.

Current rule status: **PALADIN DETERMINISTIC RULEBOOK COVERAGE COMPLETE**.

This is not the final release certification. Remaining release work is the separate `FULL RULEBOOK FINAL CERTIFICATION`, plus the already documented repository lint, physical-device, assistive-technology and live multi-client Firebase evidence checks. See `FINAL_GAP_CLOSURE_REPORT.md`.

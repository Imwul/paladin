# Release Candidate Checklist

> **v1.1 Personal Rulebook (2026-08-13):** `feature/v1.1-personal-rulebook-transplant` preserves the v1.0.0 Golden Master and adds the 463-page integrated reader. Campaign schema remains v12. Source coverage, 163-table indexing, full CI, hostile saves, the 11-year campaign and all 37 production-browser gates pass. Current status: **PALADIN PERSONAL RULEBOOK TRANSPLANT COMPLETE**. See `PERSONAL_RULEBOOK_BROWSER_CERTIFICATION.md`.

> **Current Phase 17 verdict (2026-08-12):** **PALADIN v1.0 RELEASE CANDIDATE - CERTIFIED**. The initial frozen-baseline run reproduced a keyboard focus blocker; after explicit remediation authorization, that defect and the remaining Hook runtime risks were fixed and all 40 gates passed. The blocked first-run section remains below as historical evidence. `FINAL_RULEBOOK_CERTIFICATION.md` is the current certification record.

> **v1.0.0 packaging:** release metadata is fixed at `1.0.0`; the immutable release identity is the annotated `v1.0.0` tag target. Production target is the existing GitHub Pages workflow at `https://imwul.github.io/paladin/`. See `GOLDEN_MASTER.md`.

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

## Phase 17 Final Certification Result - 2026-08-12

### Release Decision

- [x] Certification baseline fixed at `237c9db32251e0cdb1bfe896937371f69e234534`.
- [x] `HEAD`, `main`, and `origin/main` matched before certification.
- [x] Working tree was clean and schema remained v12.
- [x] Deterministic rule gaps remain Blocker 0 / Major 0 / Minor 0 / Total 0.
- [x] Full temporary CI and production build passed.
- [x] 11-year campaign passed with 0 rulebook consultations.
- [x] Repository lint reproduced the Phase 16 baseline: 135 errors / 3 warnings.
- [ ] Desktop keyboard interaction gate: **FAIL**.
- [ ] Accessibility automated-evidence gate: **FAIL**.
- [ ] Repository lint-risk gate: **FAIL**.
- [ ] v1.0 release candidate certification: **BLOCKED**.

### Blocking Defect

`RC-BLOCK-001`: Character Dossier skill inputs lose focus after a value update because `SkillRow` is created inside the `CharacterSheet` render. The production-build browser run observed the edited value apply once and `document.activeElement` immediately become `BODY`. This matches two `react-hooks/static-components` errors and makes continuous keyboard editing unreliable.

### Gate Summary

- PASS: 16
- FAIL: 3
- NOT TESTED after mandatory stop: 21
- Physical device, screen reader and live Firebase multi-client behavior remain `NOT TESTED - ENVIRONMENT UNAVAILABLE`.
- No release tag, Golden Master or final production release may be created from this baseline.

Rule coverage remains **PALADIN DETERMINISTIC RULEBOOK COVERAGE COMPLETE**.

Release status is **PALADIN v1.0 RELEASE CANDIDATE - BLOCKED**.

## Superseding Phase 17 Remediation and Certification Restart - 2026-08-12

The blocked first-run result above remains as historical evidence. After explicit authorization to fix the reproduced defect carefully, certification restarted against source commit `237c9db32251e0cdb1bfe896937371f69e234534`. The final pre-tag source patch SHA-256 is `3b0182bdaf76364479ce32ae0ccd2dcf1e3abe6e37356c2586482da11448998e`; it supersedes the earlier Phase 17 identity after the mobile Family editor cascade correction.

### Release Decision

- [x] `RC-BLOCK-001` fixed and production keyboard focus retest passed.
- [x] Remaining React Hook runtime-risk lint findings fixed; Hook errors/warnings are 0.
- [x] Character Dossier repeated controls receive contextual accessible names.
- [x] Family mobile toolbar overflow fixed; generation controls meet 44 px touch height.
- [x] Family mobile editor generation rows remain single-column at 360-390 px; member cards retain readable width, saved desktop drag offsets are neutralized, and action controls are 44 px.
- [x] Full temporary CI passes after all remediation.
- [x] Deterministic gaps remain Blocker 0 / Major 0 / Minor 0 / Total 0.
- [x] 11-year campaign passes with one successor year and 0 rulebook consultations.
- [x] Migration through schema v12, hostile saves, save/reload, and duplicate prevention pass.
- [x] Production build passes with the unchanged >500 kB main-chunk warning.
- [x] All 15 production routes load with actual content.
- [x] Hunt resumes at the exact pending stage after reload.
- [x] Chapter 7 combat resumes at Round 1 with the same opponent after reload.
- [x] 360 / 375 / 768 / 1440 / 1920 / 3440 production responsive checks pass with 0 horizontal overflow on the tested core views.
- [x] Production browser console: 0 errors / 0 warnings.
- [x] Repository lint classified: 129 quality-only errors / 0 warnings / 0 runtime-risk Hook findings.
- [x] v1.0 release candidate certification: **CERTIFIED**.

### Remaining Non-Blocking Evidence Limits

- [ ] Physical phone/tablet session: `NOT TESTED - ENVIRONMENT UNAVAILABLE`.
- [ ] Physical screen-reader session: `NOT TESTED - ENVIRONMENT UNAVAILABLE`.
- [ ] Authenticated Firebase multi-client conflict session: `NOT TESTED - ENVIRONMENT UNAVAILABLE`.
- [ ] Repository quality-only lint debt: 66 unused values and 63 useless assignments.
- [ ] Main chunk remains 696.01 kB / gzip 212.32 kB and triggers the existing build warning.

Current rule status: **PALADIN DETERMINISTIC RULEBOOK COVERAGE COMPLETE**.

Current release status: **PALADIN v1.0 RELEASE CANDIDATE - CERTIFIED**.

Certification does not create a release tag, Golden Master, deployment, or final production release. See `FINAL_RULEBOOK_CERTIFICATION.md` for all 40 gates and evidence limitations.

## v1.1 Personal Rulebook Transplant - 2026-08-13

- [x] 463/463 source pages, 22 groups, 163 tables, 210 Rule blocks and 152 Procedure blocks are transplanted.
- [x] Nine certified source ambiguities remain explicit and non-inventive.
- [x] Reader, full-text search, Table Library, contextual source drawer and PDF facsimile fallback pass in the production build.
- [x] Bookmarks, recent history, personal notes and separately labeled House Rule notes persist outside campaign storage.
- [x] Production-browser certification passes 37/37 gates.
- [x] 360/390/768/1440/1920/3440 reader checks have 0 horizontal overflow; audited 360px critical controls meet 44px.
- [x] Keyboard focus trap, semantic names and browser console gates pass.
- [x] Full temporary CI, migration, hostile saves/idempotency and the 11-year campaign pass after browser remediation.
- [x] Deterministic rulebook consultation count remains 0.
- [x] Schema remains v12 and the v1.0.0 Golden Master tag remains unchanged.
- [ ] Physical device, physical screen-reader and authenticated Firebase multi-client sessions remain `NOT TESTED - ENVIRONMENT UNAVAILABLE`.
- [ ] Existing quality-only repository lint debt remains 129 errors / 0 warnings.
- [ ] Existing main-chunk warning remains: 700.56 kB / gzip 213.38 kB.

Current v1.1 status: **PALADIN PERSONAL RULEBOOK TRANSPLANT COMPLETE**.

Evidence: `PERSONAL_RULEBOOK_BROWSER_CERTIFICATION.md`.

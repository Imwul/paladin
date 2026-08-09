# Phase 5 Combat and Health Report

## 변경 파일

- `src/rules/combatRules.js`: 개인 전투, 피해, 상처, 큰 부상 후 Valorous, 응급처치, 외과 치료, 주간 회복, 환경 피해 규칙 엔진
- `src/features/combat/CombatEncounter.jsx`, `CombatEncounter.css`: 전투와 회복 장부
- `src/utils/campaignState.js`, `src/App.jsx`, `src/app/AppShell.jsx`: schema v7 이행, 지연 로딩, 목차와 현재 상태
- `scripts/combat-regression.mjs`, `package.json`: Chapter 7 회귀와 통합 CI
- 감사·검증·출시 문서와 전투 화면 증거

## 변경 이유

기존 앱은 `currentHp` 한 값만 저장하고 음수 HP를 0으로 잘라 상처별 First Aid, Mortal Wound의 자정 사망, Chirurgery와 Deterioration을 재현할 수 없었습니다. 원본 Rulebook PDF 116-135쪽과 Tables 7-1부터 7-5를 다시 읽고, 모든 수치 변화를 Rules Engine → Application State → UI 경로로 옮겼습니다.

## Rule Compliance 변화

- `COMBAT-DAMAGE-001`, `HEALTH-HP-001`, `HEALTH-HEAL-001`, `HEALTH-HAZARD-001`: Exact
- `COMBAT-MELEE-001`, `COMBAT-DEX-001`, `COMBAT-MOD-001`, `COMBAT-MOUNT-001`, `COMBAT-SPECIAL-001`: Missing/UI-only에서 Partial
- 남은 Partial: 이동 위치, 중량 자동 분류, 다수 상대, 그래플, 무제어 공격, 마상창 시합, 원거리 전투, 말 자체의 HP·DEX·마갑

## 테스트 결과

- `npm run ci:temporary`: 통과
- `npm run test:combat`: 파생 수치, 방패 부분 성공, 갑옷, 넘어짐, 기마 돌격, 의식 상실 낙마, 큰 부상 후 Valorous, 치명상, 응급처치 대실패, 주간 회복, 환경 피해, v6→v7 이행 검증
- `npm run test:winter`: 갑옷 없는 3d6 겨울 부상이 공통 상처·치료 장부에 기록되는지 검증
- 신규 전투·규칙·테스트 모듈 ESLint: 통과
- 저장소 전체 ESLint: 기존 대형 레거시 화면의 135개 오류·3개 경고가 남아 있음. 이번 점검에서 발견한 프리셋 이름 보존 `no-undef` 런타임 위험 1건과 그 원인이던 유휴 선언 1건은 수정
- 11년 캠페인: 기존 결과 유지, 룰북 재확인 0회

## 스크린샷

- `docs/screenshots/final-combat-360.png`
- `docs/screenshots/final-combat-1440.png`

## 남은 작업

후속 Phase에서 Chapter 7 고급·다수·원거리 전투와 일반 DEX 행동, Chapter 8 대규모 전투·공성을 완료했습니다. 현재 남은 범위는 다음과 같습니다.

1. Chapter 12 거래·몸값·대출·마법 물품 효과: Phase 9에서 완료
2. Chapter 17 외국 문화 캐릭터 생성
3. Chapter 18 적·생물 특수능력 실행
4. Chapter 19 모험 종단 실행

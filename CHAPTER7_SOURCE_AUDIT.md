# Chapter 7 Source Audit

## 판정 기준

- 권위 원본: `paladin_core_rulebook.pdf`, PDF 116-135쪽, 인쇄 115-134쪽.
- 재검토일: 2026-08-09.
- 분류: 실행 규칙, GM 선택, 플레이어 선택, 서술 전용을 문단·표·예시·사이드바 단위로 다시 확인했습니다.
- Chapter 5 원거리 무기 수치와 Chapter 6 대립 판정은 Chapter 7이 직접 호출하는 선행 규칙으로 함께 대조했습니다.
- Chapter 8은 개인 교전 진입·복귀 어댑터만 검사했으며 전쟁 절차를 중복 구현하지 않았습니다.

## Chapter 7 Status

**Complete**

인쇄 115-134쪽에서 전투 중 실행되는 규칙은 모두 앱 안에서 판정하거나, 원문이 GM에게 맡긴 선택을 명시적으로 기록할 수 있습니다. Chapter 18의 공격 훈련된 말 공격은 외부 장 규칙이므로 이번 판정에서 구현 완료로 세지 않았습니다.

## Source Audit

| 인쇄 쪽 | 분류 | 앱 처리 |
|---:|---|---|
| 115-117 | 실행 | 결정, 판정, 승자, 패자, 이동의 5단계 상태 머신, 행동 선언, 피해 적용, 복합 행동 승인 |
| 117-121 | 실행 | 갑옷·방패, 이동률·주도권, Table 7-1 하중, 일반 DEX, 등반·도약·은신, Table 7-2 확정 수정 |
| 121-124 | 실행 | 기마 높이, 대기병, Lance 돌격과 후속 직진, 말의 독립 상태, 낙마, 마갑, 시합 |
| 124-126 | 실행 | 무기 특수 효과, 비살상, 방패 공격, 양손 타격, 다수 상대와 기술 배분, 원거리 사격 |
| 126-128 | 실행 | Defend, Dodge, Double Feint, Evasion, Grapple 전 과정, Uncontrolled Attack |
| 129-134 | 실행 | 기존 공통 상처 엔진의 HP, Knockdown, Major/Mortal Wound, First Aid, Chirurgery, 회복, 위험 환경 |

### GM Choice

- 선언 순서, 복합 행동 허용과 수정, 험한 지면·시야·엄폐·협소 공간의 상황 수정.
- 근접 중 빠른 이동과 다수 상대 이탈 허용, 특수 전술 사용 여부.
- 기마 양손 무기와 방패 공격의 예외 조합, Caparison보다 무거운 마갑의 원문상 제한·방어값.
- 마상창 시합 대실패 결과, 일반 DEX 실패의 장면별 결과, 주목할 전투 경험 체크.
- 이 선택들은 자동 추측하지 않으며 승인·수정값·판단 근거를 저장합니다.

### Player Choice

- 행동, 대상, 다수 상대 기술 배분, 아군이 맡을 상대, 교전 전환.
- 이동 방향·거리·속도, 접근·이탈·승하마, 원거리 발사 방식·엄폐·조준·재장전.
- 비살상 강도, Defend·Dodge·Double Feint·Evasion, Grapple 후속 행동, Uncontrolled Attack 대응.
- 무기 재선택, 종자 요청, 전투 종료 결과와 연대기 메모.

### Narrative Only

- 전투의 시간 감각, 전술 조언, 예시 기사와 Saxon의 수치, 설명용 장면과 도판 캡션.
- 규칙 결과를 바꾸는 예시는 테스트 기대값으로 대조했지만 별도 자동 이벤트로 만들지 않았습니다.

## Combat Coverage

| 범위 | 상태 | 검증 |
|---|---|---|
| 근접 | COMPLETE | 5단계, 대립·비김·쌍방 실패·파손·피해·장비 마모 |
| 다수 | COMPLETE | 2:1, 3:1, 기마 2명, 기마 1명+보병 2명, 지원·교전 전환, 기술 배분 |
| 원거리 | COMPLETE | 활·쇠뇌·투창·투석구·기타 투척, 사거리, 엄폐, 탄약, 속사, 조준, 날씨, 기마 사격, 인원 제한 없는 사격선 |
| 창 | COMPLETE | 비돌격 Spear 기술, 돌격 Lance 기술·말 피해·첫 충돌·후속 직진, 시합 |
| 말 | COMPLETE | HP, DEX, 갑옷, 상태, 부상, 죽음, 쓰러짐, 낙마, 마갑 제한 |
| Grapple | COMPLETE | 붙잡기, 고정, 해제, 역전, 단검 재무장, 타격, 던지기, 대실패 |
| Movement | COMPLETE | 이동률, 주도권, 위치 거리, 접근, 이탈, 승하마, 일어서기 |
| DEX | COMPLETE | 균형, 등반, 도약, 은신, 말 도약, 사용자 지정 상황 행동 |

## Chapter 8 Integration

| 진입점 | 상태 | 실제 연결 |
|---|---|---|
| Skirmish | PASS | 지휘 결과를 첫 라운드 수정으로 전달하고 Chapter 7 결말을 원래 소규모 교전 라운드에 반환 |
| Mass Battle | PASS | First Charge, Melee, Special Event가 같은 `engineVersion: 2` 교전을 호출하고 피해를 중복 적용하지 않음 |
| Siege | PASS | Single Combat가 Chapter 7을 호출하고 결말을 현재 공성 턴에 반환 |

## Remaining Gaps

- Chapter 7 내부 누락: 없음.
- 외부 장 의존성: Chapter 12의 경제·장비 취득 절차, Chapter 18의 공격 훈련된 말 공격과 적·생물 특수능력. 이들은 이번 Phase의 금지 범위이며 Chapter 7 완료 판정에 포함하지 않았습니다.
- 원문상 GM 판단: 자동화 대상이 아니라 명시적 선택으로 남으며, 저장·재로드 후에도 판단 근거가 유지됩니다.

## Verification

| 항목 | 결과 |
|---|---|
| Unit · movement/ranged/lance/grapple/horse/uncontrolled/multiple | PASS |
| Integration · 1v1/2v1/3v1/mounted/horse death/ranged/grapple | PASS |
| Save mid-combat/reload/idempotency | PASS |
| Chapter 8 combat callback | PASS |
| Winter/Battle/Siege/Character/Succession regression | PASS |
| 신규 Chapter 7 모듈 lint | PASS |
| Production build | PASS |
| Desktop/mobile visual check | PASS · 360 요청보다 좁은 유효 폭과 1920 요청 와이드 뷰에서 가로 넘침·컨트롤 이탈 없음 |

## Final Assessment

**YES.** Chapter 7에 속하는 개인 전투는 원문이 요구하는 GM 판단을 앱에 기록하면서 시작부터 종료까지 Rulebook를 다시 펼치지 않고 진행할 수 있습니다.

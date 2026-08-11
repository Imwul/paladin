# Release Candidate Checklist

## 판정

**조건부 보류**

캐릭터 생성, 생애, 겨울, 가족, 연대기, 영광·지위 원장, Chapter 7 개인 전투·건강, 사망과 계승, Chapter 8 소규모 교전·대전투·공성, Chapter 12 경제, Chapter 18의 74개 statblock과 Chapter 19를 종단 경로로 검증했습니다. Chapter 19는 두 장편, 18개 Short Form, 14개 Solo Procedure, 36개 표를 앱 안에서 완료하며 Chapter 3/9·7·8·12·18 canonical subsystem을 재사용합니다. 저장소 전체의 남은 보류 사유는 Chapter 17, 일부 Winter 외부 사건, repository-wide ESLint debt와 원문 source ambiguity입니다.

## 체크리스트

| 영역 | 상태 | 확인 내용 | 남은 차단 항목 |
|---|---|---|---|
| Rulebook Fidelity | 보류 | 463쪽 페이지 순서 감사, Chapter 3·9·18·19 source 재감사, Chapter 7·8·12, Chapter 18 74/74, Chapter 19 34/34 procedures·36/36 tables | Chapter 17 외국 문화·Hippogriff와 Chapter 19 표 3건의 source ambiguity |
| Save Integrity | 통과 | schema v12·Economy v2·Adventure v1·Chapter 18 v1·Personality/Magic v1, 진행 중 Passion·후유 상태·Amor·Prayer·Dream·GM decision 및 하위 엔진 return 보존, 결정적 거래 ID 재적용 방지 | 실제 Firebase 자격 증명 환경의 충돌 복구 실검증 |
| Accessibility | 통과 | 360·390·768·1440·1920·wide breakpoint, 키보드 초점 이동·focus-visible·reduced motion·44px 터치 영역 확인 | 실제 화면 읽기 도구 사용자 검증은 후속 권장 |
| Mobile | 통과 | 상태띠 2행, 입력 격자 1열, `100dvh` 내부 스크롤 장부 목차, 모든 장 접근, 가로 넘침 0 | 없음 |
| Localization | 부분 통과 | 한국어 기본, 영문 병기, 캐릭터 이름 비고정, Hahmlet 로컬 서체, 영문 Black North 합성 Bold 제거 | 백과 원문의 일부 영문 문장과 고유명사 일관성 |
| Chronicle | 통과 | 전리품 확보와 몸값 정산을 포함한 의미 있는 사건만 자동 기록, 행정 정산 문구 제외 | 기존 사용자가 직접 작성한 과거 행정 문구는 원본 보존 |
| Family | 통과 | 혼인·출산·사망·서임·계승 Family Timeline | GM 선택 가족 사건의 모든 후속 절차 자동화 |
| Winter | 부분 통과 | 원문 10단계, 결혼·출산·가족, 경험·훈련·영광, 영지 수입·대출 이자·예금 수수료·전문 수행원 정산, 11회 종단 실행 | 일부 사건의 외부 결투와 GM 서사 후속 |
| Performance | 부분 통과 | 큰 기능 lazy loading 유지, Personality 50.98 kB·Adventure 61.33 kB로 분리, Hahmlet 662.99 kB | main production chunk 596.94 kB 경고와 실제 저사양 기기 React Profiler 계측 |
| Testing | 부분 통과 | build, rules, creation, lifecycle, winter, Chapter 7·8 회귀, Chapter 12 경제, Chapter 18, Chapter 19 34개 절차·36개 표·반복·save/return, Personality/Magic, 11년 campaign, hostile save 및 수정 파일 lint | 전체 ESLint의 기존 레거시 오류와 경고 |
| Remaining Known Issues | 보류 | 아래 목록을 공개 차단 항목으로 유지 | 완전판 출시 전 해결 필요 |

## 알려진 차단 항목

1. Chapter 7은 완료했습니다. 지형·시야·복합 행동처럼 원문이 GM에게 맡긴 값은 근거와 승인을 기록하는 명시적 입력으로 남습니다. Chapter 18의 공격 훈련된 말 +5, 일반 말 통제와 파손도 같은 엔진을 사용합니다.
2. Chapter 8은 완료했습니다. 전리품은 Chapter 12의 매각 가능한 보물 자산으로 한 번만 전달되고, 포로는 몸값·현금·연대기 정산 뒤 석방 상태로 닫힙니다. 원문이 GM에게 맡긴 전리품 금액·교전 승패·포로 구출은 명시적 선택으로 기록됩니다.
3. Chapter 12는 완료했습니다. 원문이 수치를 주지 않은 투자 수익·일반 건물 유지비와 환상·예언 같은 서사 효과는 만들지 않고 GM 선택으로 남깁니다. 말 소유·장비·공격 훈련 flag는 Chapter 18 adapter가 같은 Economy entity에서 읽습니다.
4. Chapter 17 외국 문화 캐릭터 생성은 참고 자료에 머뭅니다.
5. Chapter 18은 74개 statblock과 138개 원문 공격을 선택·저장·전투·정산할 수 있습니다. Hippogriff p.386의 `Hoofs 12`와 fly-by `claw or bite` 충돌만 `RULE_DIFFERENCES.md` 해석이 없어 GM record/TODO로 남습니다.
6. Chapter 3/9 현재 gameplay dependency는 **COMPLETE WITH INTENTIONAL GM/NARRATIVE**입니다. Directed Trait/Passion, Table 3-2, Honor 임계값, Passion 사용·후유증, Fear, Winter -3, Madness, Melancholy, Oath, Prayer, Miracle, Dream, Amor가 한 canonical subsystem과 기존 원장을 사용합니다.
7. Chapter 19는 **COMPLETE WITH SOURCE AMBIGUITIES**입니다. 34/34 진입점과 36/36 표가 실제 runtime consumer, 반복·정지 조건, save/resume, canonical subsystem return을 가지며 실제 UI에서 모두 완료했습니다. 원문상 GM/Narrative 판단과 Table 19-7·19-11·19-24 모호성은 의도적으로 수동입니다.
8. 일부 겨울 개인·가족 사건은 외부 결투나 GM 판단이 필요해 명시적 수동 해결로 남습니다.
9. 전체 ESLint에는 대형 레거시 화면의 미사용 코드와 React hook 구조 오류 135건, 경고 3건이 남습니다. 작업 전 부채 수에서 증가하지 않았고 Chapter 7·8·12·19 및 Personality/Magic 신규 모듈과 상태 어댑터의 정적 검사는 통과했지만, 저장소 전체 정적 품질 게이트는 아직 통과하지 않습니다.

## 출시 허용 조건

- 완전한 디지털 Rulebook를 표방할 경우: 위 차단 항목을 모두 구현하고 페이지 감사를 다시 수행해야 합니다.
- 현재 기능 범위로 출시할 경우: Character, Chronicle, Winter, Complete Combat, Mass Battle, Siege, Economy, Chapter 18 Creatures, Chapter 3/9 gameplay dependency와 Chapter 19 Adventures를 포함할 수 있습니다. Chapter 17 및 책 전체를 완전 지원한다고 표현해서는 안 됩니다.
- 두 경우 모두 저장 내보내기 백업과 배포본 smoke test를 마지막으로 통과해야 합니다. 360-wide breakpoint 시각 검사는 이 후보에서 통과했습니다.

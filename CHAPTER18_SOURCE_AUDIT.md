# Chapter 18 Source Audit

## 판정

**Chapter 18: PARTIAL**

원본 인쇄면 373-389쪽(PDF 374-390쪽)을 본문, 표, 전투 주석, 교차참조까지 다시 감사했습니다. 74개 실제 statblock은 모두 canonical registry와 Chapter 7 adapter를 가지며, 저장·특수효과·Glory·Chronicle·Chapter 19 복귀까지 실행됩니다. 단, Hippogriff는 statblock에 `Hoofs 12`만 있으나 바로 뒤 combat note는 fly-by 때 `claw or bite`라고 적고 해당 기술값을 주지 않습니다. `RULE_DIFFERENCES.md`에도 해석이 없어 `flyby_hoofs`를 창작하지 않고 명시적 GM 결정/TODO로 남겼으므로 전체 장은 COMPLETE로 과장하지 않습니다.

## Source Inventory

| 항목 | 원문 확인 수 | Runtime |
|---|---:|---|
| 실제 statblock | 74 | registry + adapter |
| 사람·기사 | 29 | Chapter 7 participant |
| animals 합계 | 27 | 16 mounts + 11 hunting/general animals |
| 말·탈것 | 16 | 독립 horse state |
| 사냥 동물·일반 동물 | 11 | Chapter 7 + Hunt |
| enchanted creature | 18 | Chapter 7 + special consequence |
| 명시된 공격 | 138 | 공격 선택 + Chapter 7 |
| 조건부·특수 공격 속성 | 29 | target/damage/multiattack/effect adapter |
| 별도 special records | 18 | deterministic/structured/GM/narrative |
| 면역·취약·전투 제한 | 5 | damage/choice/movement state |
| 필수 성격 판정 | 3 | Valorous/Prudent/Cruel gate |
| 표 | 1 | Table 18-1 resolver |
| GM/structured decision | 16 | 저장 가능한 decision record |
| narrative/reference-only | 15 | reference registry; 자동 결과를 만들지 않음 |

## Classification

- **Automatic:** participant 변환, HP/Armor/Move, 명시 피해, 다중 타격, Avoidance, Table 18-1, 공격 훈련 +5, 말 파손, 재생, 독 피해, 일반 무기 면역, Glory 분배.
- **Player Choice:** 공격 선택, Valorous 성공 뒤 Prudent로 회피, Hunt 발견 후 행동, 전투 종료 결과.
- **GM Choice:** fierce 판정 여부, 원문 범위값 확정, creature 행동·퇴각, Christian magic, Dragon fire/고유 처치, Goblin magic, 마법 탈것 길들이기, faerie magic.
- **Narrative:** Ghost/Will-o-wisp, Harpy 오염, Nuton 소원, Unicorn virgin ploy, named faeries와 Other Monsters.
- **Reference:** 특별 탈것 생성 조언, Camel의 Table 10-8 교차참조, 원문 설명·예시.

## Architecture

`Chapter 18 registry → encounter adapter → Chapter 7 → Chapter 18 consequence → Glory/Chronicle → Chapter 19 return`

Chapter 18은 별도 HP·명중·피해 엔진을 만들지 않습니다. Chapter 7이 공격, 상처, 방어, 이동, 말 HP를 처리하고 Chapter 18은 원문 stat, gate, 특수 결과, 행동 선택, 공적만 제공합니다. Schema v12의 `campaign.chapter18`은 active encounter, pending check/special, ongoing effect, GM record, applied transaction과 history를 보존합니다.

## Creature Coverage

`Save=YES`는 registry identity, 현재 HP/상태, attack selection, special/pending state가 schema v12에서 보존됨을 뜻합니다.

| Creature | Source | Stats | Combat | Special | Avoidance | Valor/Discretion | Glory Won | Save | Status |
|---|---:|---|---|---|---:|---|---:|---|---|
| Young Knight | 373 | Exact | Ch.7 | - | - | GM fierce | 40 | YES | COMPLETE |
| Ordinary Knight | 373 | Exact | Ch.7 | - | - | GM fierce | 50 | YES | COMPLETE |
| Old Knight | 373 | Exact | Ch.7 | - | - | GM fierce | 50 | YES | COMPLETE |
| Notable Knight | 374 | Exact | Ch.7 | - | - | GM fierce | 100 | YES | COMPLETE |
| Famous Knight / Scara | 374 | Exact | Ch.7 | - | - | GM fierce | 250 | YES | COMPLETE |
| Paladin | 374 | Exact | Ch.7 | GM fine-tune | - | GM fierce | 500 | YES | COMPLETE |
| Bandit | 374 | Exact | Ch.7 | - | - | GM fierce | 10 | YES | COMPLETE |
| Archer | 374 | Exact | Ch.7 | - | - | GM fierce | 10 | YES | COMPLETE |
| Footman | 374 | Exact | Ch.7 | - | - | GM fierce | 15 | YES | COMPLETE |
| Sergeant | 374 | Exact | Ch.7 | - | - | GM fierce | 35 | YES | COMPLETE |
| Basque Noble | 374 | Exact | Ch.7 | - | - | GM fierce | 25 | YES | COMPLETE |
| Basque Marauder | 374 | Exact | Ch.7 | - | - | GM fierce | 10 | YES | COMPLETE |
| Byzantine Officer | 375 | Exact | Ch.7 | mount | - | GM fierce | 100 | YES | COMPLETE |
| Byzantine Cataphract | 375 | Exact | Ch.7 | mount | - | GM fierce | 40 | YES | COMPLETE |
| Saxon Hearthguard / Danish Huscarl | 375 | Exact | Ch.7 | - | - | GM fierce | 25 | YES | COMPLETE |
| Hunnish Noble | 375 | Exact | Ch.7 | mount | - | GM fierce | 100 | YES | COMPLETE |
| Hunnish Mounted Archer | 375 | Exact | Ch.7 | mount | - | GM fierce | 35 | YES | COMPLETE |
| Moorish Faris | 375 | Exact | Ch.7 | mount | - | GM fierce | 100 | YES | COMPLETE |
| Moorish Askari | 375 | Exact | Ch.7 | mount | - | GM fierce | 35 | YES | COMPLETE |
| Persian Noble | 375 | Exact | Ch.7 | mount | - | GM fierce | 100 | YES | COMPLETE |
| Slav Noble | 375 | Exact | Ch.7 | mount | - | GM fierce | 50 | YES | COMPLETE |
| Monk | 375 | Exact | no listed attack | reference | - | GM fierce | 1 | YES | COMPLETE |
| Farmer | 375 | Exact | Ch.7 | club -1d6 | - | GM fierce | 1 | YES | COMPLETE |
| Rich Merchant | 376 | Exact | Ch.7 | - | - | GM fierce | 1 | YES | COMPLETE |
| Village Blacksmith | 376 | Exact | Ch.7 | - | - | GM fierce | 1 | YES | COMPLETE |
| Common Maidservant | 376 | Exact | Ch.7 | - | - | GM fierce | - | YES | COMPLETE |
| Maid-in-Waiting | 376 | Exact | Ch.7 | - | - | GM fierce | - | YES | COMPLETE |
| Damosel | 376 | Exact | Ch.7 | personal Glory ref | - | GM fierce | - | YES | COMPLETE |
| Lady | 376 | Exact | Ch.7 | personal Glory ref | - | GM fierce | - | YES | COMPLETE |
| Palfrey | 377 | Exact | horse state | Table 18-1 | - | - | - | YES | COMPLETE |
| Rouncy | 377 | Exact | horse state | combat-trained | - | - | - | YES | COMPLETE |
| Charger | 377 | Exact | horse state | combat-trained | - | - | - | YES | COMPLETE |
| Andalusian Charger | 377 | Exact | horse state | combat-trained | - | - | - | YES | COMPLETE |
| Courser | 377 | Exact | horse state | Hunt +5 | - | - | - | YES | COMPLETE |
| Arab Courser | 377 | Exact | horse state | Table 18-1 | - | - | - | YES | COMPLETE |
| Destrier | 377 | Exact | horse state | combat/attack training | - | - | - | YES | COMPLETE |
| Carthorse | 377 | Exact | horse state | Table 18-1 | - | - | - | YES | COMPLETE |
| Donkey | 377 | Exact | horse state | Table 18-1 | - | - | - | YES | COMPLETE |
| Mule | 377 | Exact | horse state | Table 18-1 | - | - | - | YES | COMPLETE |
| Sumpter | 377 | Exact | horse state | MW 10 | - | - | - | YES | COMPLETE |
| Bayard | 378 | Exact | Ch.7/horse | bite/kick, 17d6 lance | 39 | required | - | YES | COMPLETE |
| Camel | 379 | Exact | horse state | rider +5 vs horse | - | GM fierce | - | YES | COMPLETE |
| Elephant | 379 | Exact | Ch.7 | Prudent +5, throw 6d6 | - | required | 100 | YES | COMPLETE |
| Basque Pony | 379 | Exact | horse state | MW 10 | - | - | - | YES | COMPLETE |
| Steppe Pony | 379 | Exact | horse state | MW 10 | - | - | - | YES | COMPLETE |
| Common Dog | 379 | Exact | Ch.7 | metal -1d6 | - | GM fierce | - | YES | COMPLETE |
| Mastiff | 379 | Exact | Ch.7 | metal -1d6 | - | GM fierce | - | YES | COMPLETE |
| Hawk | 379 | Exact | Ch.7 | metal -1d6 | - | GM fierce | - | YES | COMPLETE |
| Aurochs | 380 | Exact | Ch.7 | charge/gore/trample | 5 | GM fierce | 12 | YES | COMPLETE |
| Bear | 381 | Exact | Ch.7 | 2 claws/one target | 7 | GM fierce | 10 | YES | COMPLETE |
| Boar | 381 | Exact | Ch.7 | mount first/last round | 10 | GM fierce | 15 | YES | COMPLETE |
| Deer | 381 | Exact | Ch.7 | charge +5/+2d6 | 15 | GM fierce | 5 | YES | COMPLETE |
| African Lion | 381 | Exact | Ch.7 | 2 claws/prone bite | 10 | required -5 | 100 | YES | COMPLETE |
| European Forest Lion | 381 | Exact | Ch.7 | 2 claws/prone bite | 10 | required -3 | 75 | YES | COMPLETE |
| Panther | 382 | Exact | Ch.7 | 2 claws/bite +1d6 | 17 | GM fierce | 50 | YES | COMPLETE |
| Wolf | 382 | Exact | Ch.7 | pack note | 10 | GM fierce | 5 | YES | COMPLETE |
| Ogre | 382 | Exact | Ch.7 | - | 5 | magical gate | 100 | YES | COMPLETE |
| Half-Giant | 383 | Exact | Ch.7 | knight +20 Glory | - | magical gate | 150 | YES | COMPLETE |
| Giant | 383 | Exact | Ch.7 | grapple | 5 | -5 / Prudent +5 | 250 | YES | COMPLETE |
| Basilisk | 383 | Exact | Ch.7 | gaze/2 poisons | 13 | -15 / Prudent +15 | 250 | YES | COMPLETE |
| Centaur | 383 | Exact | Ch.7 | club/hoof exclusive | 12 | magical gate | 75 | YES | COMPLETE |
| Demon | 384 | ranged values | Ch.7 | poison/GM magic/vulnerability | - | -5 | 250 | YES | COMPLETE |
| Dragon (Wyrm) | 384 | Exact | Ch.7 | regen/two targets/GM fire | 7 | -10 | 400 | YES | COMPLETE |
| Goblin | 385 | armor range | Ch.7 | opposed vice/GM magic | 30 | +5 | 15 | YES | COMPLETE |
| Griffin | 385 | Exact | Ch.7 | ground x2/fly-by/drop | 30 | -5 | 250 | YES | COMPLETE |
| Harpy | 386 | Exact | Ch.7 | normal weapon immunity | - | -10 | 250 | YES | COMPLETE |
| Hippogriff | 386 | Exact | Hoofs 12 | source conflict/TODO | 30 | magical gate | 200 | YES | PARTIAL |
| Manticore | 386 | Exact | Ch.7 | tail 6d6 | 10 | -10 / Prudent +10 | 300 | YES | COMPLETE |
| Nuton | 387 | Exact | Ch.7 | 1 HP regen/wish | 20 | Prudent +5 | 0 | YES | COMPLETE |
| Orc | 387 | Exact | Ch.7 | armor 30/swim | - | -10 | 400 | YES | COMPLETE |
| Pegasus | 387 | Exact | Ch.7/horse | immunity, lance -5/12d6 | 15 | required | capture 150 | YES | COMPLETE |
| Siren | 387 | Exact | Ch.7 | Chaste vs song/GM result | 8 | magical gate | 100 | YES | COMPLETE |
| Unicorn | 388 | Exact | Ch.7 | Cruel, x2 charge, no capture | 20 | required | 75 | YES | COMPLETE |
| Faerie Enchantress | 389 | Exact | no listed attack | GM magic/ransom | 20 | Prudent +5 | - | YES | COMPLETE |

## Chapter Integration

| Chapter | Result | Evidence |
|---|---|---|
| Chapter 7 | PASS | 모든 registry entry가 participant/horse로 변환되고 명중·피해·HP·이동은 Chapter 7만 사용 |
| Chapter 8 | PASS | 기존 Chapter 8 개인전 callback이 Chapter 7을 유지하며 Chapter 18 adapter가 그 전투 상태와 공존 |
| Chapter 12 | PASS | market mount identity와 attack-training flag를 Economy v2에서 읽고 별도 inventory를 만들지 않음 |
| Chapter 19 Hunt | PASS | Table 19-11 prey → canonical creature ID → Avoidance → Chapter 7 → Hunt return |
| Chapter 19 Adventure | PASS for dependency bridge | source 대상 selector → Chapter 18 → Chapter 7 → consequence → stable return transaction |

## Chapter 19 Dependencies Closed

- Devil's Bridge: Giant/Demon canonical 선택과 Chapter 7 복귀.
- Greedy Abbot: Bandit canonical 선택.
- Melancholic Paladin: Paladin statblock 연결. Chapter 3 melancholy는 별도 의존성으로 유지.
- Pagan Prison: Giant 개인전 연결. 공성은 기존 Chapter 8 유지.
- Small Knight: Ordinary/Notable Knight 선택.
- Hunt: 11개 prey/special result를 canonical ID와 Avoidance에 연결.
- Humble Squires: Table 19-3/19-4의 시나리오 전용 수치는 원문 그대로 Chapter 7에 전달하며 Chapter 18 수치로 덮어쓰지 않음.

## Remaining Source Ambiguity

1. **Hippogriff p.386:** statblock `Hoofs 12`와 fly-by note의 `claw or bite`가 충돌합니다. 앱은 둘을 합성하지 않고 source conflict GM record를 저장합니다. 해석 확정 전 fly-by 공격만 PARTIAL입니다.

## Remaining External Dependencies

1. Chapter 10 Table 10-8은 Camel 추위 생존의 외부 consumer입니다. Chapter 18에는 modifier와 reference를 보존하고 Winter 규칙을 복제하지 않습니다.
2. Ghost, Will-o-wisp, Oberon, Morgan, named faeries, Other Monsters는 원문 자체가 statblock 없는 narrative/reference/GM creation 항목이므로 새 creature를 만들지 않았습니다.

## Real Play Audit

| UI walkthrough | Result | 확인 내용 |
|---|---|---|
| 일반 동물 | PASS | Bear 선택 → Chapter 7 → 전투 불능 → victory → Glory 10 → Chronicle |
| 공격 훈련 동물 | PASS | Bayard의 Bite and Kick/Lance 선택, Valorous와 Chapter 7 진입 |
| Giant / monster | PASS | Half-Giant 원문 stat·공격·Valorous gate → Chapter 7 |
| Enchanted Creature | PASS | Goblin armor 범위 확정, Valorous +5, virtue 대 vice → flee |
| Chapter 19 Short Form | PASS | The Small Knight → Ordinary Knight → Chapter 7 → 같은 Actions stage 복귀 → 완료 |
| Chapter 19 Hunt | PASS | Search → Chase → Table 19-11 Deer → Chapter 18 → Chapter 7 → Hunt 복귀 → 완료 |
| mid-combat save/reload | PASS | Bear의 선택 공격·상태·return context가 reload 뒤 같은 round에서 복원 |
| defeat / Glory / Chronicle | PASS | Bear 공적 10점이 `CH18-GLORY`로 한 번만 기록되고 encounter Chronicle 생성 |

실플레이에서 직접 Chapter 18 종료가 Chapter 8 callback을 한 번 더 호출하던 문제, 범위형 stat의 화면 기본값이 제출되지 않던 문제, Hunt Avoidance 누락이 React 화면 전체를 종료하던 문제를 발견해 수정했습니다. Chapter 18과 Chapter 19의 규칙 예외는 이제 화면 내 오류로 남고 앱 전체를 중단시키지 않습니다.

스크린샷: `tmp/screenshots/chapter18/chapter18-360.png`, `chapter18-768.png`, `chapter18-1440.png`, `chapter18-1920.png`.

## Verification

| Check | Result |
|---|---|
| Chapter 18 unit/integration | PASS |
| Chapter 7 regression | PASS |
| Chapter 19 Hunt/adventure regression | PASS |
| schema v12 migration/save/reload | PASS |
| modified-file lint | PASS |
| production build | PASS |
| TypeScript / production compile | PASS (JavaScript project; Vite compile) |
| full regression | PASS |
| 360 / 768 / 1440 / 1920 | PASS · horizontal overflow 0 |
| browser console | PASS · clean-tab error/warning 0 |

## Final Assessment

Can every Chapter 18 opponent and creature now be used in actual gameplay without reopening the rulebook, except where the original explicitly requires GM/narrative judgment? **PARTIAL**

Hippogriff의 원문 내부 공격 불일치 한 건을 제외하면 **YES**입니다. 모든 실제 statblock은 선택·저장·전투·정산 경로를 가집니다.

Did this Phase invent any creature behavior, ability, modifier, reward, or narrative outcome not present in the source? **NO**

# Chapter 17 Source Audit

## Current Decision

**CHAPTER 17 COMPLETE WITH SOURCE AMBIGUITIES**

`paladin_core_rulebook.pdf`의 인쇄면 341-371쪽(PDF 342-372쪽)을 본문, Table 17-1, 장비 문단, 교차참조와 Legendary Lands까지 다시 감사했습니다. 원문이 GM에게 허용하는 15개 대체 Player-character 문화는 Chapter 1의 동일한 20단계 생성 엔진을 사용합니다. 별도 외국 문화 생성기나 NPC statblock 기반 PC 생성은 없습니다.

Chapter 17이 수치화하는 문화별 생성 효과는 Table 17-1의 기본 Statistics 보정뿐입니다. 문화 문단에 언급된 Traits, Passions, Skills, 가족, 신분과 시작 Glory는 수치 보너스로 추정하지 않고 명시적인 GM/player 입력으로 보존합니다.

## Source Inventory

| Kind | Count | Runtime treatment |
|---|---:|---|
| GM-permitted playable cultures | 15 | stable `cultureId`와 Chapter 1 생성 흐름 |
| Standard Equipment profiles | 36 | Chapter 12 market item identity |
| Executable tables | 1 | Table 17-1 Statistics modifiers |
| Reference-only legendary lands | 2 | Ethiopia, Cathay |
| Chapter 17-specific numeric Trait/Passion/Skill rules | 0 | 앱이 수치를 만들지 않음 |
| Source ambiguities / cross-chapter omissions | 1 | Slavs p.369의 generic Pony combat profile |

## Classification

| Classification | Source material | Runtime behavior |
|---|---|---|
| Automatic | Table 17-1, 선택 완료된 장비 지급, 단일 종교 항목 | 생성 시 정확히 한 번 적용 |
| Player Choice | 문화, 이름, 종교 선택지, 장비 역할과 `or` 대안 | 현재 단계에서 명시적으로 선택 |
| GM Choice | 대체 문화 허가, 가족, 교육, 본향, Traits, Passions, Standings, Skills, 신분, 시작 Glory | 근거와 함께 저장하며 자동 추정하지 않음 |
| Narrative | 문화사, 행동 성향, 정치·종교적 태도 | 상태 변화로 변환하지 않음 |
| Reference | 역사 설명, Legendary Lands, 이름 자료 | 조회용이며 gameplay 수치를 만들지 않음 |
| Source Ambiguity | Slavs Noble의 `pony or rouncy` 중 generic Pony | Pony 선택은 보존하되 Chapter 7용 SIZ/DEX/HP를 발명하지 않음 |

## Culture Registry

| Culture | Printed source | Table 17-1 (SIZ/DEX/STR/CON/APP) | Religion | Profiles | Social status boundary |
|---|---:|---|---|---:|---|
| Basques | 341-342 | -1/0/0/+1/0 | Christian or Pagan | 2 | knighthood unknown |
| Bretons | 342-344 | -2/0/0/+1/-1 | Pagan | 3 | knighthood unknown |
| Britons | 344-345 | 0/0/0/0/0 | Christian | 3 | knighthood recognized |
| Byzantines | 345-347 | -1/+1/-1/0/+1 | Christian | 3 | analogous military status |
| Danes | 347-350 | +1/-2/+1/+1/-2 | Pagan | 2 | knighthood unknown |
| Gascons | 349-350 | -1/+1/-1/0/+1 | Christian | 3 | knighthood recognized |
| Huns | 351-353 | -2/0/+1/+1/-1 | Pagan, Jewish, or Christian | 3 | knighthood unknown |
| Jews | 353-354 | -1/0/-2/0/0 | Jewish | 1 | military service and weapons forbidden |
| Lombards | 354-357 | 0/0/0/0/0 | Christian | 2 | knighthood recognized |
| Moors / Saracens | 357-360 | -1/+1/0/0/0 | Pagan, using the printed game category | 3 | analogous military status |
| Persians | 360-363 | -1/+1/0/0/+1 | Pagan | 2 | analogous military status |
| Romans | 363-365 | -1/0/-1/0/+1 | Christian | 2 | knighthood recognized |
| Saxons / Frisians | 364-367 | +1/-1/+1/0/-1 | Pagan | 2 | knighthood unknown |
| Slavs | 367-369 | -2/0/0/0/0 | Pagan | 2 | knighthood unknown |
| Visigoths | 369-370 | -1/0/0/0/0 | Christian | 3 | knighthood recognized |

## Equipment Profiles

| Culture | Printed profiles | Canonical consumers | Status |
|---|---|---|---|
| Basques | Noble; Footman | Chapter 12 inventory, Chapter 7 loadout | COMPLETE |
| Bretons | Noble; Horseman; Footman | Chapter 12, Chapter 18 rouncy/courser | COMPLETE |
| Britons | Noble; Horseman; Footman | Chapter 12, Chapter 18 mount choice | COMPLETE |
| Byzantines | Higher rank; Cataphract; Footman | Chapter 12, Chapter 7, Chapter 18 | COMPLETE |
| Danes | Jarl/Huscarl; Carl | Chapter 12, Chapter 7 | COMPLETE |
| Gascons | Noble; Horseman; Footman | Chapter 12, Chapter 7, Chapter 18 | COMPLETE |
| Huns | Noble; Mounted archer; Footman | Chapter 12, Chapter 7, Steppe Pony, horse armor | COMPLETE |
| Jews | Unarmed traveler | clothing only; no weapon auto-equipped | COMPLETE |
| Lombards | Noble; Footman/Urban militia | Chapter 12, Chapter 7, Chapter 18 | COMPLETE |
| Moors/Saracens | Faris; Askari; Footman | Chapter 12, Chapter 7, courser/charger/camel | COMPLETE |
| Persians | Noble; Footman | Chapter 12, Chapter 7, courser/camel | COMPLETE |
| Romans | Equites/Knight; Footman | Chapter 12, Chapter 7, Chapter 18 | COMPLETE |
| Saxons/Frisians | Edhilingui/Hearthguard; Ceorl | Chapter 12, Chapter 7, mount choice | COMPLETE |
| Slavs | Noble; Footman | Chapter 12, Chapter 7; Rouncy exact, Pony pending | COMPLETE WITH SOURCE AMBIGUITY |
| Visigoths | Knight; Horseman; Footman | Chapter 12, Chapter 7 | COMPLETE |

All 36 profiles and every printed equipment alternative have a Chapter 12 market ID and automated regression coverage. Chapter 17 does not duplicate weapon, armor, shield, horse armor, or mount combat values.

## Canonical Integration

| System | Integration |
|---|---|
| Chapter 1 | one 20-step state machine; Frankish route remains the golden baseline |
| Chapter 3 | foreign Traits and Passions use the canonical score structures; unquantified values are explicit GM input |
| Chapter 7 | equipped Chapter 12 weapon/armor/shield metadata supplies the combat loadout |
| Chapter 8 | no culture modifier is invented; completed characters use the existing callbacks |
| Chapter 9 | `religionId` gates Christian Prayer eligibility; pagan and Jewish characters are rejected by the canonical Prayer resolver |
| Chapter 12 | one equipment/inventory transaction with stable item IDs and duplicate prevention |
| Chapter 18 | exact mount statblocks are reused; Chapter 17 PC statistics never use foreign NPC statblocks |
| Chapter 19 | culture metadata survives Adventure participation and return; scenario restrictions remain source-driven |
| Winter/Lifecycle | canonical character, family and save state are retained; no foreign Winter or family table is invented |

## NPC / PC Separation

Chapter 18의 Basque Noble, Byzantine Officer/Cataphract, Hunnish Noble/Mounted Archer, Moorish Faris/Askari, Persian Noble, Saxon/Danish opponent는 NPC registry입니다. Chapter 17 PC는 Chapter 1의 2d6+3 Statistics, 5점 배분, Table 17-1 보정과 GM 입력을 사용하며 이 NPC 고정 능력치를 복사하지 않습니다.

## Save And Idempotency

- `personal.cultureId`, `cultureSource`, `religionId`, 장비 profile과 선택 결과를 additive migration으로 보존합니다.
- legacy save는 `frankish`로 이관되며 기존 표시 문자열 `Frankish`를 유지합니다.
- Table 17-1 보정은 생성 trace와 modifier log에 한 번만 적용됩니다.
- reopen, edit, migration, reload, duplicate completion에서 Statistics나 장비 거래가 누적되지 않습니다.
- 생성 완료 뒤 culture metadata 편집은 생성 규칙을 재적용하지 않습니다.

## Source Ambiguity

**Slavs, Noble, p.369:** 원문은 `pony or rouncy`를 지급하지만 Chapter 18에는 Basque Pony와 Steppe Pony만 있고 generic Pony statblock은 없습니다. 앱은 Pony를 Chapter 12 소유물로 정확히 저장하고 `pending_combat_profile`로 표시합니다. SIZ, DEX, HP를 유추하지 않으며, mounted Chapter 7 combat은 GM이 원문 밖 수치를 승인하기 전까지 보류됩니다. Rouncy 선택은 즉시 완전 실행됩니다.

## Verification Evidence

- 모든 15개 문화와 36개 장비 profile: 생성, JSON reload, schema migration, Chapter 12 inventory, Chapter 7 loadout, Chapter 18 mount adapter PASS.
- 실제 UI: 15/15 문화가 선택, 모든 원문 대안, 최종 검토, pre-completion reload, exact resume, completion PASS.
- 대표 실플레이: Huns/Christian/Noble/Steppe Pony/Felt armor를 실제 UI에서 완료하고 저장 복원 PASS.
- Religion: Christian Prayer PASS; Pagan/Jewish Prayer eligibility gate PASS.
- Cross-culture contamination: Attributes, Traits, Passions, Skills, equipment, religion 0건.
- Frankish golden creation regression PASS.

## Final Assessment

1. Every source-playable culture can be created end-to-end: **YES**.
2. Every deterministic Chapter 17 creation effect uses canonical systems: **YES**.
3. Completed foreign characters can use source-permitted campaign systems: **YES**, except the generic Slav Pony source ambiguity described above.
4. Chapters 3, 7, 8, 9, 12, 18, and 19 are reused: **YES**.
5. Save/reload preserves culture without duplicate modifiers: **YES**.
6. Frankish creation remains unchanged: **YES**.
7. Any unsupported cultural rule, value, stereotype, restriction, or behavior invented: **NO**.

**CHAPTER 17 COMPLETE WITH SOURCE AMBIGUITIES.**

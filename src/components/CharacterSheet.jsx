import React, { useState } from 'react';
import { Sparkles, Dices, RefreshCw, Check } from 'lucide-react';
import { applyOnce, deepClone, hasAppliedEvent } from '../utils/campaignState';

export const patronSaints = [
  { name: "성 암브로시오 (St. Ambrose)", patronage: "필기사", benefit: "+5 웅변 (Eloquence)", apply: (char) => { char.skills.eloquence = (char.skills.eloquence || 0) + 5; } },
  { name: "성 아나스타시아 (St. Anastasia)", patronage: "순교자", benefit: "+3 정숙 (Chaste)", apply: (char) => { char.traits.chaste = Math.min(20, (char.traits.chaste || 10) + 3); char.traits.lustful = 20 - char.traits.chaste; } },
  { name: "성 보니파시오 (St. Boniface)", patronage: "청년", benefit: "+3 자비 (Merciful)", apply: (char) => { char.traits.merciful = Math.min(20, (char.traits.merciful || 10) + 3); char.traits.cruel = 20 - char.traits.merciful; } },
  { name: "성 크리스토포로 (St. Christopher)", patronage: "여행자", benefit: "+3 겸손 (Modest)", apply: (char) => { char.traits.modest = Math.min(20, (char.traits.modest || 10) + 3); char.traits.proud = 20 - char.traits.modest; } },
  { name: "성 데니스 (St. Denis)", patronage: "프랑크인", benefit: "+2 샤를마뉴 충성 (Love Charlemagne)", apply: (char) => { char.standings.charlemagne = (char.standings.charlemagne || 10) + 2; } },
  { name: "성 엘리기오 (St. Eligius)", patronage: "치유자", benefit: "+5 응급처치 (First Aid)", apply: (char) => { char.skills.firstAid = (char.skills.firstAid || 0) + 5; } },
  { name: "성 가브리엘 (St. Gabriel)", patronage: "전령", benefit: "+3 관용 (Forgiving)", apply: (char) => { char.traits.forgiving = Math.min(20, (char.traits.forgiving || 10) + 3); char.traits.vengeful = 20 - char.traits.forgiving; } },
  { name: "성 헬레나 (St. Helena)", patronage: "미망인", benefit: "+2 가족에 대한 사랑 (Love Family)", apply: (char) => { char.passions.loveFamily = (char.passions.loveFamily || 15) + 2; } },
  { name: "성 힐라리오 (St. Hilary)", patronage: "광인", benefit: "+3 정의 (Just)", apply: (char) => { char.traits.just = Math.min(20, (char.traits.just || 10) + 3); char.traits.arbitrary = 20 - char.traits.just; } },
  { name: "성 후베르토 (St. Hubert)", patronage: "사냥꾼", benefit: "+5 수렵 (Hunting)", apply: (char) => { char.skills.hunting = (char.skills.hunting || 0) + 5; } },
  { name: "성 야고보 (St. James)", patronage: "노동자", benefit: "+3 열정 (Energetic)", apply: (char) => { char.traits.energetic = Math.min(20, (char.traits.energetic || 10) + 3); char.traits.lazy = 20 - char.traits.energetic; } },
  { name: "성 예로니모 (St. Jerome)", patronage: "학생", benefit: "+3 신뢰 (Trusting)", apply: (char) => { char.traits.trusting = Math.min(20, (char.traits.trusting || 10) + 3); char.traits.suspicious = 20 - char.traits.trusting; } },
  { name: "성 요한 세례자 (St. John the Baptist)", patronage: "어린이", benefit: "+3 정직 (Honest)", apply: (char) => { char.traits.honest = Math.min(20, (char.traits.honest || 10) + 3); char.traits.deceitful = 20 - char.traits.honest; } },
  { name: "성 요셉 (St. Joseph)", patronage: "장인", benefit: "+2 명예 (Honor Passion)", apply: (char) => { char.passions.honor = (char.passions.honor || 16) + 2; } },
  { name: "성 유스티노 (St. Justin)", patronage: "연설가", benefit: "+3 신중 (Prudent)", apply: (char) => { char.traits.prudent = Math.min(20, (char.traits.prudent || 10) + 3); char.traits.reckless = 20 - char.traits.prudent; } },
  { name: "성 마르티노 (St. Martin)", patronage: "군인", benefit: "+3 절제 (Temperate)", apply: (char) => { char.traits.temperate = Math.min(20, (char.traits.temperate || 10) + 3); char.traits.indulgent = 20 - char.traits.temperate; } },
  { name: "성모 마리아 (St. Mary)", patronage: "어머니", benefit: "+2 신에 대한 사랑 (Love God)", apply: (char) => { char.passions.loveGod = (char.passions.loveGod || 15) + 2; } },
  { name: "성 미카엘 (St. Michael)", patronage: "전사", benefit: "+3 용맹 (Valorous)", apply: (char) => { char.traits.valorous = Math.min(20, (char.traits.valorous || 10) + 3); char.traits.cowardly = 20 - char.traits.valorous; } },
  { name: "성 오메르 (St. Omer)", patronage: "병자 및 빈민", benefit: "+3 관대 (Generous)", apply: (char) => { char.traits.generous = Math.min(20, (char.traits.generous || 10) + 3); char.traits.selfish = 20 - char.traits.generous; } },
  { name: "자유 선택 (Player's Choice)", patronage: "자유 선택", benefit: "원하는 성인의 효과를 수동 적용", apply: () => { /* 룰북 Table 1-3 Roll 20: Player's choice. 캐릭터 시트에서 수동으로 원하는 성인 보너스를 적용하세요. */ } }
];

const familyCharacteristics = [
  { name: "예리한 감각 (Keen of eye and ear)", benefit: "+5 경계 (Awareness)", apply: (char) => { char.skills.awareness = (char.skills.awareness || 0) + 5; } },
  { name: "타고난 상처 치유력 (Natural healers of wounds)", benefit: "+5 응급처치 (First Aid)", apply: (char) => { char.skills.firstAid = (char.skills.firstAid || 0) + 5; } },
  { name: "얼굴과 방패를 잊지 않음 (Never forget a face/shield)", benefit: "+5 문장학 & 신분 식별", apply: (char) => { char.skills.heraldry = (char.skills.heraldry || 0) + 5; char.skills.recognize = (char.skills.recognize || 0) + 5; } },
  { name: "말 위에서 태어남 (Born in the saddle)", benefit: "+5 마술 (Horsemanship)", apply: (char) => { char.skills.horsemanship = (char.skills.horsemanship || 0) + 5; } },
  { name: "자연과의 호흡 (At home in nature)", benefit: "+5 수렵 (Hunting)", apply: (char) => { char.skills.hunting = (char.skills.hunting || 0) + 5; } },
  { name: "수달의 재능 (Like otters in the river)", benefit: "+10 수영 (Swimming)", apply: (char) => { char.skills.swimming = (char.skills.swimming || 0) + 10; } },
  { name: "예절 바르고 사랑스러움 (Polite, elegant, lovable)", benefit: "+10 예의 (Courtesy)", apply: (char) => { char.skills.courtesy = (char.skills.courtesy || 0) + 10; } },
  { name: "가벼운 발걸음 (Light-footed and elegant)", benefit: "+10 무용 (Dancing)", apply: (char) => { char.skills.dancing = (char.skills.dancing || 0) + 10; } },
  { name: "훌륭한 이야기꾼 (Good speakers and storytellers)", benefit: "+10 웅변 (Eloquence)", apply: (char) => { char.skills.eloquence = (char.skills.eloquence || 0) + 10; } },
  { name: "매들의 군주 (Masters of birds)", benefit: "+10 매사냥 (Falconry)", apply: (char) => { char.skills.falconry = (char.skills.falconry || 0) + 10; } },
  { name: "지혜로운 노련미 (Clever at games)", benefit: "+10 유희 (Gaming)", apply: (char) => { char.skills.gaming = (char.skills.gaming || 0) + 10; } },
  { name: "놀라운 통찰과 귀띔 (Surprisingly deductive)", benefit: "+10 음모 (Intrigue)", apply: (char) => { char.skills.intrigue = (char.skills.intrigue || 0) + 10; } },
  { name: "타고난 악사 (Gifted musicians)", benefit: "+10 악기 연주 (Play Instruments)", apply: (char) => { char.skills.playInstruments = (char.skills.playInstruments || 0) + 10; } },
  { name: "축복받은 목소리 (Excellent voice)", benefit: "+10 가창 (Singing)", apply: (char) => { char.skills.singing = (char.skills.singing || 0) + 10; } },
  // 룰북 Table 1-1 Roll 19: "+5 Battle or Siege" (택1). 기본값은 Battle. 공성 선택 시 수동 조정 필요.
  { name: "전장의 지배자 (Master tacticians)", benefit: "+5 전술 또는 공성 (택1, 기본: 전술)", apply: (char) => { char.skills.battle = (char.skills.battle || 0) + 5; } },
  { name: "자유 선택 (Player's choice)", benefit: "원하는 가문 특성을 수동 적용", apply: () => { /* 룰북 Table 1-1 Roll 20: Player's choice */ } }
];

const fathersClasses = [
  { name: "봉신 기사 (Vassal Knight)", benefit: "+14 기술 포인트, 영광 250", skillsAdd: 14, glory: 250 },
  { name: "기치 기사 (Banneret Knight)", benefit: "+16 기술 포인트, 영광 300", skillsAdd: 16, glory: 300 },
  { name: "독신 기사 (Bachelor Knight)", benefit: "+12 기술 포인트, 영광 200", skillsAdd: 12, glory: 200 },
  { name: "용병 기사 (Mercenary Knight)", benefit: "+10 기술, 검 +3, 근접무기(택1) +3, Cruel +3, 영광 100", skillsAdd: 10, bonusWeapon: 3, glory: 100 },
  // 룰북 Table 1-5: Lord(1-5) / Officer(6-20) 세부 직책별 보너스가 상이. 현재는 간소화 구현.
  { name: "영주/지방관 기사 (Lord or Officer)", benefit: "+18 기술 포인트, 영광 500 (간소화)", skillsAdd: 18, glory: 500 }
];

export const birthGiftsTable = [
  { roll: 1, name: "Decorated Saddle", benefit: "장식된 말 안장 (가치 120d)", apply: (char) => { char.gear.personalGear = (char.gear.personalGear ? char.gear.personalGear + ", " : "") + "장식된 말 안장 (가치 120d)"; } },
  { roll: 2, name: "Magnificent Cloak", benefit: "화려한 가문 망토 (가치 £1)", apply: (char) => { char.gear.personalGear = (char.gear.personalGear ? char.gear.personalGear + ", " : "") + "화려한 가문 망토 (가치 £1)"; } },
  { roll: 3, name: "Blessed Spear", benefit: "축복받은 창 (Spear 기술 판정 시 이교도 상대 +1 보정)", apply: (char) => { char.skills.spear = (char.skills.spear || 0) + 1; char.gear.personalGear = (char.gear.personalGear ? char.gear.personalGear + ", " : "") + "축복받은 창 (이교도 상대 +1)"; } },
  { roll: 4, name: "Money £1", benefit: "동전 £1 (£1 in coin)", apply: (char) => { char.gear.cash = (char.gear.cash || 0) + 1; } },
  { roll: 5, name: "Blessed Iron Sword", benefit: "축복받은 철검 (Sword 기술 판정 시 이교도 상대 +1 보정)", apply: (char) => { char.skills.sword = (char.skills.sword || 0) + 1; char.gear.personalGear = (char.gear.personalGear ? char.gear.personalGear + ", " : "") + "축복받은 철검 (이교도 상대 +1)"; } },
  { roll: 6, name: "Blessed Iron Sword", benefit: "축복받은 철검 (Sword 기술 판정 시 이교도 상대 +1 보정)", apply: (char) => { char.skills.sword = (char.skills.sword || 0) + 1; char.gear.personalGear = (char.gear.personalGear ? char.gear.personalGear + ", " : "") + "축복받은 철검 (이교도 상대 +1)"; } },
  { roll: 7, name: "Golden Ring", benefit: "금반지 (가치 £2)", apply: (char) => { char.gear.personalGear = (char.gear.personalGear ? char.gear.personalGear + ", " : "") + "금반지 (가치 £2)"; } },
  { roll: 8, name: "Sacred Relic", benefit: "성유물 성골함 (선택한 종교 Traits +2)", apply: (char) => { char.traits.pious = Math.min(20, (char.traits.pious || 10) + 2); char.traits.worldly = 20 - char.traits.pious; char.gear.personalGear = (char.gear.personalGear ? char.gear.personalGear + ", " : "") + "성골함 (성유물 보관)"; } },
  { roll: 9, name: "Sacred Relic", benefit: "성유물 성골함 (선택한 종교 Traits +2)", apply: (char) => { char.traits.pious = Math.min(20, (char.traits.pious || 10) + 2); char.traits.worldly = 20 - char.traits.pious; char.gear.personalGear = (char.gear.personalGear ? char.gear.personalGear + ", " : "") + "성골함 (성유물 보관)"; } },
  { roll: 10, name: "Extra Palfrey", benefit: "여분의 경량마 (Palfrey) 1필 추가", apply: (char) => { char.horses.other3 = "여분 경량마 (Palfrey)"; } },
  { roll: 11, name: "Extra Palfrey", benefit: "여분의 경량마 (Palfrey) 1필 추가", apply: (char) => { char.horses.other3 = "여분 경량마 (Palfrey)"; } },
  { roll: 12, name: "Money £3", benefit: "동전 £3 (£3 in coin)", apply: (char) => { char.gear.cash = (char.gear.cash || 0) + 3; } },
  { roll: 13, name: "Extra Charger", benefit: "여분의 돌격마 (Charger) 1필 추가", apply: (char) => { char.horses.other4 = "여분 돌격마 (Charger)"; } },
  { roll: 14, name: "Extra Charger", benefit: "여분의 돌격마 (Charger) 1필 추가", apply: (char) => { char.horses.other4 = "여분 돌격마 (Charger)"; } },
  { roll: 15, name: "Upgrade Outfit", benefit: "시작 복장 패키지 1단계 업그레이드 (+£1 가치 추가)", apply: (char) => { char.gear.cash = (char.gear.cash || 0) + 1; } },
  { roll: 16, name: "Annual Stipend £1", benefit: "평생 매년 연금 £1 영구 수급권", apply: (char) => { char.gear.personalGear = (char.gear.personalGear ? char.gear.personalGear + ", " : "") + "평생 연간 영지 영수증 (£1/년)"; } },
  { roll: 17, name: "Exceptional Weapon", benefit: "장인의 특수 무기 (검 선택 시 기술 +1, 다른 무기 선택 시 기술 +3)", apply: (char) => { char.skills.sword = (char.skills.sword || 0) + 1; char.gear.personalGear = (char.gear.personalGear ? char.gear.personalGear + ", " : "") + "명품 장인의 철검 (기술 +1)"; } },
  { roll: 18, name: "Healing Potion", benefit: "신비한 치유 물약 (사용 시 1d6 체력 즉시 회복)", apply: (char) => { char.gear.personalGear = (char.gear.personalGear ? char.gear.personalGear + ", " : "") + "신비한 치유 물약 (1d6 HP 회복)"; } },
  { roll: 19, name: "Roll Twice", benefit: "가문의 특별한 은혜: 2회 추가로 굴림", apply: (char) => { char.gear.cash = (char.gear.cash || 0) + 1; char.gear.personalGear = (char.gear.personalGear ? char.gear.personalGear + ", " : "") + "가문의 희귀 보물함"; } },
  { roll: 20, name: "Player's Choice", benefit: "자유 선택 (여분의 돌격마 또는 원하는 특수 보물)", apply: (char) => { char.gear.personalGear = (char.gear.personalGear ? char.gear.personalGear + ", " : "") + "황제의 칙임 보물 (유저 선택)"; } }
];

export const frankishBlessings = [
  { rollRange: [1, 3], name: "보호 (Protection)", desc: "모든 종류의 피해를 1점 흡수하는 자연 방어력을 얻습니다. (+1 natural armor)" },
  { rollRange: [4, 4], name: "말 교감 (Horse Whisperer)", desc: "말들과 매우 기본적인 수준에서 대화할 수 있습니다." },
  { rollRange: [5, 5], name: "독 면역 (Immunity to poisons)", desc: "독으로 인한 피해를 절반만 받습니다." },
  { rollRange: [6, 8], name: "번영 (Prosperity)", desc: "겨울 단계 동안 모든 수입 및 수확 굴림에 +3 보너스를 받습니다." },
  { rollRange: [9, 11], name: "출산력 (Fertility)", desc: "겨울 단계 동안 자녀 출산 테이블 굴림에 +5 보너스를 받습니다." },
  { rollRange: [12, 13], name: "영원한 젊음 (Eternal Youth)", desc: "30세 대신 35세부터 노화가 시작됩니다." },
  { rollRange: [14, 14], name: "화염 면역 (Immunity to fire)", desc: "열과 화염 피해를 절반만 받습니다." },
  { rollRange: [15, 15], name: "조류 친화 (Bird Affinity)", desc: "새들의 원시적인 언어를 이해합니다." },
  { rollRange: [16, 17], name: "예지 (Premonition)", desc: "Love [God] 성공 판정 시 예언적 꿈과 징조를 능동적으로 불러일으킬 수 있습니다." },
  { rollRange: [18, 19], name: "치유의 손길 (Healing hands)", desc: "주 1회 다른 기독교 캐릭터에게 안수 치료를 하여 1d3 HP를 회복시킵니다." },
  { rollRange: [20, 20], name: "진실 감지 (Truth sense)", desc: "Glory 보너스 대비 d20 성공 시 의도된 거짓말을 감지할 수 있습니다." }
];

export const pageEducations = [
  { rollRange: [1, 3], name: "왕실 궁정 (Royal court)", benefit: "Courtesy +5, Falconry +3, Hunting +3, Intrigue +3, Just +3, Modest -3, Glory +200" },
  { rollRange: [4, 6], name: "대귀족 궁정 (Great noble's court)", benefit: "Courtesy +3, Falconry +2, Hunting +2, Intrigue +2, Stewardship +2, Modest -2, Valorous +2, Glory +100" },
  { rollRange: [7, 9], name: "대수도원 (Great monastery)", benefit: "Chirurgery +2, Eloquence +2, Faerie Lore +2, Languages +2, Reading/Writing +3, Religion +2, Singing +2, Love [God]+1, Glory +50" },
  { rollRange: [10, 15], name: "기사 배너렛 궁정 (Knight banneret's court)", benefit: "Courtesy +2, Falconry +1, Folk Lore +2, Gaming +2, Hunting +1, Bow +2, Valorous +1, Glory +50" },
  { rollRange: [16, 19], name: "기사 영지 (Knight's manor)", benefit: "Folk Lore +2, Gaming +2, Hunting +1, Dagger +1, Bow +1, Modest +1, Prudent +1, Glory +20" },
  { rollRange: [20, 999], name: "소수도원 (Small monastery)", benefit: "Folk Lore +2, Reading/Writing +2, Religion +1, Singing +1, Chaste +1, Modest +1, Love [God]+1, Glory +10" }
];

export const fatherSurvivals = [
  { rollRange: [1, 13], name: "부친 생존 (Father living)", desc: "부친이 살아서 정정하게 활동하고 있습니다." },
  { rollRange: [14, 17], name: "부친 사망 (Father deceased)", desc: "부친이 사망하였습니다." },
  { rollRange: [18, 19], name: "부친 병상 (Father bedridden)", desc: "부친이 살아있으나 병상에 누워있어 대리직무나 치료가 필요합니다." },
  { rollRange: [20, 20], name: "부친 실종 (Father missing)", desc: "부친이 2d6년 동안 행방불명 상태입니다." }
];



const presets = [
  {
    name: "용맹한 돌격 대장 (The Chivalrous Vanguard)",
    description: "전장의 최전선에서 마창을 치켜들고 돌격하는 기사입니다. 뛰어난 무력과 마술, 가문의 용맹함을 지니고 있습니다.",
    stats: {
      personal: {
        name: "롤랑 경 (Sir Roland)",
        age: 21,
        sonNumber: "첫째",
        blessing: "성스러운 아우라 (Holy Aura)",
        homeland: "아르덴 (Ardennes)",
        home: "바스토뉴 (Bastogne)",
        culture: "프랑크 (Frankish)",
        lineage: "아르덴 (Ardennes)",
        liegeLord: "티에리 공작 (Duke Thierry)",
        fathersClass: "봉신 기사 (Vassal Knight)",
        personalClass: "기사 (Knight)",
        features: ["왼쪽 뺨의 흉터", "날카로운 벽안", "크고 날씬한 체형"]
      },
      attributes: { siz: 15, dex: 11, str: 14, con: 13, app: 9, currentHp: 28 },
      traits: {
        chaste: 10, lustful: 10,
        energetic: 12, lazy: 8,
        forgiving: 11, vengeful: 9,
        generous: 12, selfish: 8,
        honest: 12, deceitful: 8,
        just: 10, arbitrary: 10,
        merciful: 10, cruel: 10,
        modest: 10, proud: 10,
        pious: 12, worldly: 8,
        prudent: 9, reckless: 11,
        temperate: 10, indulgent: 10,
        trusting: 11, suspicious: 9,
        valorous: 18, cowardly: 2
      },
      skills: {
        awareness: 8, chirurgery: 1, faerieLore: 2, firstAid: 10, folkLore: 4,
        horsemanship: 17,
        hunting: 6, industry: 5, recognize: 5, religion: 6, stewardship: 3, swimming: 5,
        courtesy: 8, dancing: 2, eloquence: 6, falconry: 4, gaming: 5, heraldry: 5, intrigue: 3, playInstruments: 1, readingWriting: 2, romance: 4, singing: 3,
        battle: 12, siege: 5,
        axe: 6, bludgeon: 5, dagger: 8, spear: 10, sword: 15, unarmed: 6,
        lance: 14, bow: 4, crossbow: 5, thrownWeapon: 4
      },
      passions: { loyaltyLiege: 15, loveFamily: 15, hospitality: 15, honor: 16, hateSaracens: 12, loveGod: 15 },
      standings: { charlemagne: 10, liegeLord: 18, family: 16, retinue: 12, church: 15, commoners: 10 }
    }
  },
  {
    name: "지혜로운 문관 기사 (The Courtly Counselor)",
    description: "샤를마뉴 대제의 궁정에서 조언하고 사절 역할을 담당하는 기사입니다. 뛰어난 외모와 세련된 교양, 말솜씨를 자랑합니다.",
    stats: {
      personal: {
        name: "올리비에 경 (Sir Olivier)",
        age: 21,
        sonNumber: "첫째",
        blessing: "기민한 지성 (Keen Intellect)",
        homeland: "아르덴 (Ardennes)",
        home: "바스토뉴 (Bastogne)",
        culture: "프랑크 (Frankish)",
        lineage: "아르덴 (Ardennes)",
        liegeLord: "티에리 공작 (Duke Thierry)",
        fathersClass: "영주/지방관 기사 (Lord or Officer)",
        personalClass: "기사 (Knight)",
        features: ["기품 있는 눈매", "단정한 금발", "세련된 예복"]
      },
      attributes: { siz: 11, dex: 12, str: 10, con: 12, app: 16, currentHp: 23 },
      traits: {
        chaste: 10, lustful: 10,
        energetic: 12, lazy: 8,
        forgiving: 11, vengeful: 9,
        generous: 14, selfish: 6,
        honest: 14, deceitful: 6,
        just: 14, arbitrary: 6,
        merciful: 12, cruel: 8,
        modest: 13, proud: 7,
        pious: 12, worldly: 8,
        prudent: 13, reckless: 7,
        temperate: 11, indulgent: 9,
        trusting: 11, suspicious: 9,
        valorous: 15, cowardly: 5
      },
      skills: {
        awareness: 8, chirurgery: 1, faerieLore: 2, firstAid: 10, folkLore: 4,
        horsemanship: 12, hunting: 6, industry: 5, recognize: 8, religion: 6, stewardship: 3, swimming: 5,
        courtesy: 14, dancing: 8, eloquence: 18, falconry: 6, gaming: 8, heraldry: 10, intrigue: 12, playInstruments: 6, readingWriting: 5, romance: 10, singing: 8,
        battle: 10, siege: 5,
        axe: 5, bludgeon: 5, dagger: 8, spear: 8, sword: 12, unarmed: 6,
        lance: 11, bow: 4, crossbow: 5, thrownWeapon: 4
      },
      passions: { loyaltyLiege: 15, loveFamily: 15, hospitality: 16, honor: 17, hateSaracens: 12, loveGod: 15 },
      standings: { charlemagne: 12, liegeLord: 15, family: 17, retinue: 14, church: 15, commoners: 12 }
    }
  },
  {
    name: "고결한 성전사 (The Devout Crusader)",
    description: "신과 주군에 대한 굳건한 믿음으로 신성 마법과 치유의 능력을 발휘하는 기사입니다. 가문의 경건함과 치유의 성품을 지닙니다.",
    stats: {
      personal: {
        name: "가바레 경 (Sir Gavaret)",
        age: 21,
        sonNumber: "첫째",
        blessing: "기적의 숨결 (Miraculous Breath)",
        homeland: "아르덴 (Ardennes)",
        home: "바스토뉴 (Bastogne)",
        culture: "프랑크 (Frankish)",
        lineage: "아르덴 (Ardennes)",
        liegeLord: "티에리 공작 (Duke Thierry)",
        fathersClass: "기치 기사 (Banneret Knight)",
        personalClass: "기사 (Knight)",
        features: ["이마의 십자가 흉터", "온화한 미소", "굳센 풍채"]
      },
      attributes: { siz: 13, dex: 10, str: 12, con: 14, app: 11, currentHp: 27 },
      traits: {
        chaste: 15, lustful: 5,
        energetic: 12, lazy: 8,
        forgiving: 14, vengeful: 6,
        generous: 14, selfish: 6,
        honest: 12, deceitful: 8,
        just: 11, arbitrary: 9,
        merciful: 15, cruel: 5,
        modest: 13, proud: 7,
        pious: 18, worldly: 2,
        prudent: 11, reckless: 9,
        temperate: 15, indulgent: 5,
        trusting: 14, suspicious: 6,
        valorous: 15, cowardly: 5
      },
      skills: {
        awareness: 8, chirurgery: 1, faerieLore: 2, firstAid: 15, folkLore: 4, horsemanship: 12, hunting: 6, industry: 5, recognize: 5, religion: 14, stewardship: 3, swimming: 5,
        courtesy: 10, dancing: 2, eloquence: 6, falconry: 4, gaming: 5, heraldry: 8, intrigue: 3, playInstruments: 1, readingWriting: 4, romance: 4, singing: 6,
        battle: 10, siege: 5,
        axe: 6, bludgeon: 8, dagger: 8, spear: 10, sword: 13, unarmed: 6,
        lance: 12, bow: 4, crossbow: 5, thrownWeapon: 4
      },
      passions: { loyaltyLiege: 15, loveFamily: 15, hospitality: 15, honor: 16, hateSaracens: 12, loveGod: 17 },
      standings: { charlemagne: 11, liegeLord: 15, family: 16, retinue: 14, church: 17, commoners: 15 }
    }
  },
  {
    name: "생존 전문 용병 기사 (The Veteran Mercenary)",
    description: "어떤 참혹한 전장에서도 살아남은 실전 기사입니다. 가문의 예리한 경계심과 잔혹하지만 생존에 특화된 전투 기술을 보유합니다.",
    stats: {
      personal: {
        name: "가랑 경 (Sir Garin)",
        age: 21,
        sonNumber: "첫째",
        blessing: "질긴 생명력 (Iron Resilience)",
        homeland: "아르덴 (Ardennes)",
        home: "바스토뉴 (Bastogne)",
        culture: "프랑크 (Frankish)",
        lineage: "아르덴 (Ardennes)",
        liegeLord: "티에리 공작 (Duke Thierry)",
        fathersClass: "용병 기사 (Mercenary Knight)",
        personalClass: "기사 (Knight)",
        features: ["턱 밑의 깊은 칼자국", "그을린 피부", "다부진 체구"]
      },
      attributes: { siz: 13, dex: 14, str: 14, con: 12, app: 9, currentHp: 25 },
      traits: {
        chaste: 10, lustful: 10,
        energetic: 12, lazy: 8,
        forgiving: 10, vengeful: 10,
        generous: 10, selfish: 10,
        honest: 10, deceitful: 10,
        just: 10, arbitrary: 10,
        merciful: 8, cruel: 12,
        modest: 13, proud: 7,
        pious: 10, worldly: 10,
        prudent: 9, reckless: 11,
        temperate: 10, indulgent: 10,
        trusting: 10, suspicious: 10,
        valorous: 15, cowardly: 5
      },
      skills: {
        awareness: 13, chirurgery: 1, faerieLore: 2, firstAid: 10, folkLore: 4, horsemanship: 12, hunting: 10, industry: 5, recognize: 5, religion: 4, stewardship: 3, swimming: 5,
        courtesy: 6, dancing: 2, eloquence: 6, falconry: 4, gaming: 6, heraldry: 4, intrigue: 6, playInstruments: 1, readingWriting: 2, romance: 4, singing: 3,
        battle: 12, siege: 5,
        axe: 9, bludgeon: 8, dagger: 8, spear: 10, sword: 16, unarmed: 8, lance: 12, bow: 4, crossbow: 5, thrownWeapon: 4
      },
      passions: { loyaltyLiege: 14, loveFamily: 15, hospitality: 12, honor: 15, hateSaracens: 15, loveGod: 11 },
      standings: { charlemagne: 8, liegeLord: 15, family: 15, retinue: 10, church: 11, commoners: 8 }
    }
  }
];


const traitList = [
  { key1: "chaste", label1: "정숙", key2: "lustful", label2: "음탕", sym: "✝♥" },
  { key1: "energetic", label1: "열정", key2: "lazy", label2: "나태", sym: "⦿" },
  { key1: "forgiving", label1: "관용", key2: "vengeful", label2: "복수", sym: "✝♥" },
  { key1: "generous", label1: "관대", key2: "selfish", label2: "이기", sym: "⦿♥" },
  { key1: "honest", label1: "정직", key2: "deceitful", label2: "기만", sym: "⦿♥" },
  { key1: "just", label1: "정의", key2: "arbitrary", label2: "독단", sym: "⦿" },
  { key1: "merciful", label1: "자비", key2: "cruel", label2: "잔혹", sym: "⦿✝" },
  { key1: "modest", label1: "겸손", key2: "proud", label2: "오만", sym: "⦿✝" },
  { key1: "pious", label1: "경건", key2: "worldly", label2: "세속", sym: "✝⦿" },
  { key1: "prudent", label1: "신중", key2: "reckless", label2: "무모", sym: "♥" },
  { key1: "temperate", label1: "절제", key2: "indulgent", label2: "방종", sym: "✝" },
  { key1: "trusting", label1: "신뢰", key2: "suspicious", label2: "의심", sym: "✝♥" },
  { key1: "valorous", label1: "용맹", key2: "cowardly", label2: "겁쟁이", sym: "⦿" }
];

const commonSkills = [
  { key: "awareness", label: "경계" }, { key: "chirurgery", label: "의술" },
  { key: "faerieLore", label: "요정 전설" }, { key: "firstAid", label: "응급처치" },
  { key: "folkLore", label: "민간 전설" }, { key: "horsemanship", label: "마술" },
  { key: "hunting", label: "수렵" }, { key: "industry", label: "근면" },
  { key: "recognize", label: "신분 식별" }, { key: "religion", label: "종교 지식" },
  { key: "stewardship", label: "영지 관리" }, { key: "swimming", label: "수영" }
];

const courtlySkills = [
  { key: "courtesy", label: "예의" }, { key: "dancing", label: "무용" },
  { key: "eloquence", label: "웅변" }, { key: "falconry", label: "매사냥" },
  { key: "gaming", label: "유희" }, { key: "heraldry", label: "문장학" },
  { key: "intrigue", label: "음모" }, { key: "playInstruments", label: "악기 연주" },
  { key: "readingWriting", label: "독서 및 집필" }, { key: "romance", label: "로맨스" },
  { key: "singing", label: "가창" }
];

const weaponSkills = [
  { key: "sword", label: "검" }, { key: "lance", label: "마창" },
  { key: "axe", label: "도끼" }, { key: "spear", label: "창 / 폴암" },
  { key: "dagger", label: "단검" }, { key: "bludgeon", label: "둔기" },
  { key: "unarmed", label: "맨손 격투" }
];

const personalFields = [
  { key: 'name', label: '이름', cat: 'personal' },
  { key: 'age', label: '나이', cat: 'personal', type: 'number' },
  { key: 'campaignYear', label: '현재 연도', cat: 'personal', type: 'number' },
  { key: 'homeland', label: '고향/출신지', cat: 'personal' },
  { key: 'home', label: '영지/거처', cat: 'personal' },
  { key: 'culture', label: '문화권', cat: 'personal' },
  { key: 'lineage', label: '가문/혈통', cat: 'personal' },
  { key: 'liegeLord', label: '섬기는 주군', cat: 'personal' },
  { key: 'personalClass', label: '현재 신분', cat: 'personal' },
];

const passions = [
  { key: "loyaltyLiege", label: "주군에 대한 충성 (Loyalty)", defaultVal: 15 },
  { key: "loveFamily", label: "가족에 대한 사랑 (Love Family)", defaultVal: 15 },
  { key: "hospitality", label: "손대접 및 환대 (Hospitality)", defaultVal: 15 },
  { key: "honor", label: "기사의 명예 (Honor)", defaultVal: 16 },
  { key: "hateSaracens", label: "이교도에 대한 증오 (Hate Saracens)", defaultVal: 12 },
  { key: "loveGod", label: "신에 대한 사랑 (Love God)", defaultVal: 15 },
  { key: "amor", label: "연인에 대한 로맨스 (Amor)", defaultVal: 0 }
];

// 🎲 룰북 주사위 눈 대응 매핑 함수 (Page 25-30)
const getSaintIndexFromRoll = (roll) => {
  const r = Math.min(20, Math.max(1, parseInt(roll) || 1));
  return r - 1; // Saint Table 1-3 is a direct 1-to-20 mapping
};

const getCharIndexFromRoll = (roll) => {
  const r = Math.min(20, Math.max(1, parseInt(roll) || 1));
  if (r <= 2) return 0; // 1-2: Keen of eye
  if (r === 3) return 1; // 3: Healers
  if (r === 4) return 2; // 4: Never forget
  if (r <= 6) return 3; // 5-6: Born in saddle
  if (r <= 8) return 4; // 7-8: Nature
  if (r <= 10) return 5; // 9-10: Otters
  if (r === 11) return 6; // 11: Courtesy
  if (r === 12) return 7; // 12: Dancing
  if (r === 13) return 8; // 13: Eloquence
  if (r === 14) return 9; // 14: Falconry
  if (r === 15) return 10; // 15: Gaming
  if (r === 16) return 11; // 16: Intrigue
  if (r === 17) return 12; // 17: Instruments
  if (r === 18) return 13; // 18: Singing
  if (r === 19) return 14; // 19: Tacticians
  return 15; // 20: Player's choice
};

const getFatherIndexFromRoll = (roll) => {
  const r = Math.min(20, Math.max(1, parseInt(roll) || 1));
  if (r === 1) return 4; // 1: Lord or Officer
  if (r <= 3) return 1; // 2-3: Banneret Knight
  if (r <= 8) return 0; // 4-8: Vassal Knight
  if (r <= 15) return 2; // 9-15: Bachelor Knight
  return 3; // 16-20: Mercenary Knight
};

const parseName = (fullName) => {
  if (!fullName) return { ko: '', en: '' };
  const regex = /([^(]+)\s*(?:\(([^)]+)\))?/;
  const match = fullName.match(regex);
  let koPart = fullName;
  let enPart = '';

  if (match) {
    koPart = match[1].trim();
    enPart = match[2] ? match[2].trim() : '';
  }

  // Remove common titles
  const cleanKo = koPart.replace(/\s*(경|남작|백작|공작|영주|부인|종자)$/, '').trim();
  const cleanEn = enPart.replace(/^(Sir|Baron|Count|Earl|Duke|Lord|Lady)\s+/i, '').trim();

  return { ko: cleanKo, en: cleanEn };
};

const getTitleByNameAndClass = (koName, enName, statusClass) => {
  if (!koName) return '';
  const cleanKo = koName.replace(/\s*(경|남작|백작|공작|영주|부인|종자)$/, '').trim();
  const cleanEn = enName ? enName.replace(/^(Sir|Baron|Count|Earl|Duke|Lord|Lady)\s+/i, '').trim() : '';

  const cls = (statusClass || '').toLowerCase();

  let koTitle = '';
  let enPrefix = '';

  if (cls.includes('공작') || cls.includes('duke')) {
    koTitle = ' 공작';
    enPrefix = 'Duke ';
  } else if (cls.includes('백작') || cls.includes('count') || cls.includes('earl')) {
    koTitle = ' 백작';
    enPrefix = 'Count ';
  } else if (cls.includes('남작') || cls.includes('baron')) {
    koTitle = ' 남작';
    enPrefix = 'Baron ';
  } else if (cls.includes('영주') || cls.includes('lord') || cls.includes('officer') || cls.includes('지방관')) {
    koTitle = ' 영주';
    enPrefix = 'Lord ';
  } else if (cls.includes('부인') || cls.includes('lady')) {
    koTitle = ' 부인';
    enPrefix = 'Lady ';
  } else if (cls.includes('종자') || cls.includes('squire')) {
    koTitle = '';
    enPrefix = '';
  } else if (cls.includes('기사') || cls.includes('knight') || cls.includes('vassal') || cls.includes('bachelor') || cls.includes('mercenary') || cls.includes('banneret')) {
    koTitle = ' 경';
    enPrefix = 'Sir ';
  } else {
    koTitle = '';
    enPrefix = '';
  }

  const finalKo = `${cleanKo}${koTitle}`;
  const finalEn = cleanEn ? ` (${enPrefix}${cleanEn})` : '';
  return `${finalKo}${finalEn}`;
};

const revertSaint = (char, saintName) => {
  if (!saintName) return;
  const oldSaint = patronSaints.find(s => s.name === saintName || saintName.includes(s.name.split(' (')[0]));
  if (!oldSaint) return;

  if (oldSaint.name.includes("암브로시오") || oldSaint.name.includes("Ambrose")) {
    char.skills.eloquence = Math.max(0, (char.skills.eloquence || 0) - 5);
  } else if (oldSaint.name.includes("아나스타시아") || oldSaint.name.includes("Anastasia")) {
    char.traits.chaste = Math.max(0, (char.traits.chaste || 10) - 3);
    char.traits.lustful = 20 - char.traits.chaste;
  } else if (oldSaint.name.includes("보니파시오") || oldSaint.name.includes("Boniface")) {
    char.traits.merciful = Math.max(0, (char.traits.merciful || 10) - 3);
    char.traits.cruel = 20 - char.traits.merciful;
  } else if (oldSaint.name.includes("크리스토포로") || oldSaint.name.includes("Christopher")) {
    char.traits.modest = Math.max(0, (char.traits.modest || 10) - 3);
    char.traits.proud = 20 - char.traits.modest;
  } else if (oldSaint.name.includes("데니스") || oldSaint.name.includes("Denis")) {
    char.standings.charlemagne = Math.max(0, (char.standings.charlemagne || 10) - 2);
  } else if (oldSaint.name.includes("엘리기오") || oldSaint.name.includes("Eligius")) {
    char.skills.firstAid = Math.max(0, (char.skills.firstAid || 0) - 5);
  } else if (oldSaint.name.includes("가브리엘") || oldSaint.name.includes("Gabriel")) {
    char.traits.forgiving = Math.max(0, (char.traits.forgiving || 10) - 3);
    char.traits.vengeful = 20 - char.traits.forgiving;
  } else if (oldSaint.name.includes("헬레나") || oldSaint.name.includes("Helena")) {
    char.passions.loveFamily = Math.max(0, (char.passions.loveFamily || 15) - 2);
  } else if (oldSaint.name.includes("힐라리오") || oldSaint.name.includes("Hilary")) {
    char.traits.just = Math.max(0, (char.traits.just || 10) - 3);
    char.traits.arbitrary = 20 - char.traits.just;
  } else if (oldSaint.name.includes("후베르토") || oldSaint.name.includes("Hubert")) {
    char.skills.hunting = Math.max(0, (char.skills.hunting || 0) - 5);
  } else if (oldSaint.name.includes("야고보") || oldSaint.name.includes("James")) {
    char.traits.energetic = Math.max(0, (char.traits.energetic || 10) - 3);
    char.traits.lazy = 20 - char.traits.energetic;
  } else if (oldSaint.name.includes("예로니모") || oldSaint.name.includes("Jerome")) {
    char.traits.trusting = Math.max(0, (char.traits.trusting || 10) - 3);
    char.traits.suspicious = 20 - char.traits.trusting;
  } else if (oldSaint.name.includes("요한 세례자") || oldSaint.name.includes("John the Baptist")) {
    char.traits.honest = Math.max(0, (char.traits.honest || 10) - 3);
    char.traits.deceitful = 20 - char.traits.honest;
  } else if (oldSaint.name.includes("요셉") || oldSaint.name.includes("Joseph")) {
    char.passions.honor = Math.max(0, (char.passions.honor || 16) - 2);
  } else if (oldSaint.name.includes("유스티노") || oldSaint.name.includes("Justin")) {
    char.traits.prudent = Math.max(0, (char.traits.prudent || 10) - 3);
    char.traits.reckless = 20 - char.traits.prudent;
  } else if (oldSaint.name.includes("마르티노") || oldSaint.name.includes("Martin")) {
    char.traits.temperate = Math.max(0, (char.traits.temperate || 10) - 3);
    char.traits.indulgent = 20 - char.traits.temperate;
  } else if (oldSaint.name.includes("성모 마리아") || oldSaint.name.includes("Mary")) {
    char.passions.loveGod = Math.max(0, (char.passions.loveGod || 15) - 2);
  } else if (oldSaint.name.includes("미카엘") || oldSaint.name.includes("Michael")) {
    char.traits.valorous = Math.max(0, (char.traits.valorous || 10) - 3);
    char.traits.cowardly = 20 - char.traits.valorous;
  } else if (oldSaint.name.includes("오메르") || oldSaint.name.includes("Omer")) {
    char.traits.generous = Math.max(0, (char.traits.generous || 10) - 3);
    char.traits.selfish = 20 - char.traits.generous;
  }
};

const revertCharacteristic = (char, charName) => {
  if (!charName) return;
  const oldChar = familyCharacteristics.find(c => c.name === charName || charName.includes(c.name.split(' (')[0]));
  if (!oldChar) return;

  if (oldChar.name.includes("예리한 감각") || oldChar.name.includes("Keen of eye")) {
    char.skills.awareness = Math.max(0, (char.skills.awareness || 0) - 5);
  } else if (oldChar.name.includes("타고난 상처 치유력") || oldChar.name.includes("Natural healers")) {
    char.skills.firstAid = Math.max(0, (char.skills.firstAid || 0) - 5);
  } else if (oldChar.name.includes("얼굴과 방패를 잊지 않음") || oldChar.name.includes("Never forget")) {
    char.skills.heraldry = Math.max(0, (char.skills.heraldry || 0) - 5);
    char.skills.recognize = Math.max(0, (char.skills.recognize || 0) - 5);
  } else if (oldChar.name.includes("말 위에서 태어남") || oldChar.name.includes("Born in the saddle")) {
    char.skills.horsemanship = Math.max(0, (char.skills.horsemanship || 0) - 5);
  } else if (oldChar.name.includes("자연과의 호흡") || oldChar.name.includes("At home in nature")) {
    char.skills.hunting = Math.max(0, (char.skills.hunting || 0) - 5);
  } else if (oldChar.name.includes("수달의 재능") || oldChar.name.includes("Like otters")) {
    char.skills.swimming = Math.max(0, (char.skills.swimming || 0) - 10);
  } else if (oldChar.name.includes("예절 바르고 사랑스러움") || oldChar.name.includes("Polite")) {
    char.skills.courtesy = Math.max(0, (char.skills.courtesy || 0) - 10);
  } else if (oldChar.name.includes("가벼운 발걸음") || oldChar.name.includes("Light-footed")) {
    char.skills.dancing = Math.max(0, (char.skills.dancing || 0) - 10);
  } else if (oldChar.name.includes("훌륭한 이야기꾼") || oldChar.name.includes("Good speakers")) {
    char.skills.eloquence = Math.max(0, (char.skills.eloquence || 0) - 10);
  } else if (oldChar.name.includes("매들의 군주") || oldChar.name.includes("Masters of birds")) {
    char.skills.falconry = Math.max(0, (char.skills.falconry || 0) - 10);
  } else if (oldChar.name.includes("지혜로운 노련미") || oldChar.name.includes("Clever at games")) {
    char.skills.gaming = Math.max(0, (char.skills.gaming || 0) - 10);
  } else if (oldChar.name.includes("놀라운 통찰과 귀띔") || oldChar.name.includes("Surprisingly deductive")) {
    char.skills.intrigue = Math.max(0, (char.skills.intrigue || 0) - 10);
  } else if (oldChar.name.includes("타고난 악사") || oldChar.name.includes("Gifted musicians")) {
    char.skills.playInstruments = Math.max(0, (char.skills.playInstruments || 0) - 10);
  } else if (oldChar.name.includes("축복받은 목소리") || oldChar.name.includes("Excellent voice")) {
    char.skills.singing = Math.max(0, (char.skills.singing || 0) - 10);
  } else if (oldChar.name.includes("전장의 지배자") || oldChar.name.includes("Master tacticians")) {
    char.skills.battle = Math.max(0, (char.skills.battle || 0) - 5);
  }
};

export default function CharacterSheet({ character, setCharacter, initialCharacterState }) {
  const [isGenOpen, setIsGenOpen] = useState(false);
  const [genActiveTab, setGenActiveTab] = useState('preset'); // 'preset' or 'custom'
  const [selectedPreset, setSelectedPreset] = useState(0);

  // 가문 캐릭터 시트 로컬 상태들
  const [sheetSaintMode, setSheetSaintMode] = useState('select'); // 'select' | 'roll'
  const [sheetCharMode, setSheetCharMode] = useState('select'); // 'select' | 'roll'
  const [sheetMusterMode, setSheetMusterMode] = useState('manual'); // 'manual' | 'roll'
  const [sheetStandingsMode, setSheetStandingsMode] = useState('manual'); // 'manual' | 'roll'

  const [sheetSaintRoll, setSheetSaintRoll] = useState('');
  const [sheetSaintResult, setSheetSaintResult] = useState(null);
  const [sheetCharRoll, setSheetCharRoll] = useState('');
  const [sheetCharResult, setSheetCharResult] = useState(null);

  const [sheetMusterRollResults, setSheetMusterRollResults] = useState(null);
  const [sheetStandingsRollResults, setSheetStandingsRollResults] = useState(null);
  const [sheetHonorRollResult, setSheetHonorRollResult] = useState(null);
  const [sheetEnemyHateRollResult, setSheetEnemyHateRollResult] = useState(null);

  const handleFamilyChange = (key, val) => {
    setCharacter(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.family = updated.family || {};
      updated.family[key] = val;
      return updated;
    });
  };

  const applySheetSaint = (saint, rollVal = null) => {
    if (!saint) return;
    if (hasAppliedEvent(character, 'character_creation:patron_saint')) {
      alert("수호 성인 보너스는 이미 이 캠페인에 반영되었습니다.");
      return;
    }
    setCharacter(prev => {
      const result = applyOnce(prev, 'character_creation:patron_saint', updated => {
        if (updated.family?.patronSaintApplied && updated.family?.patronSaint) {
          revertSaint(updated, updated.family.patronSaint);
        }
        if (typeof saint.apply === 'function') {
          saint.apply(updated);
        }
        updated.family = updated.family || {};
        updated.family.patronSaint = saint.name;
        updated.family.patronSaintRoll = rollVal || patronSaints.indexOf(saint) + 1;
        updated.family.patronSaintBenefit = saint.benefit;
        updated.family.patronSaintApplied = true;
        return updated;
      }, `수호 성인: ${saint.name}`);
      return result.character;
    });
    setSheetSaintResult({
      roll: rollVal || patronSaints.indexOf(saint) + 1,
      saint
    });
  };

  const applySheetChar = (characteristic, rollVal = null) => {
    if (!characteristic) return;
    if (hasAppliedEvent(character, 'character_creation:family_characteristic')) {
      alert("가문 특성 보너스는 이미 이 캠페인에 반영되었습니다.");
      return;
    }
    setCharacter(prev => {
      const result = applyOnce(prev, 'character_creation:family_characteristic', updated => {
        if (updated.family?.characteristic?.name && updated.family?.characteristic?.applied) {
          revertCharacteristic(updated, updated.family.characteristic.name);
        }
        if (typeof characteristic.apply === 'function') {
          characteristic.apply(updated);
        }
        updated.family = updated.family || {};
        updated.family.characteristic = {
          name: characteristic.name,
          desc: characteristic.name,
          bonusText: characteristic.benefit,
          applied: true,
          appliedBonus: null
        };
        return updated;
      }, `가문 특성: ${characteristic.name}`);
      return result.character;
    });
    setSheetCharResult({
      roll: rollVal || familyCharacteristics.indexOf(characteristic) + 1,
      characteristic
    });
  };

  const rollSheetMuster = () => {
    const rOld = Math.floor(Math.random() * 6) + 1;
    const oldVal = Math.max(0, rOld - 5);
    const rMid = Math.floor(Math.random() * 6) + 1;
    const midVal = Math.max(0, rMid - 2);
    const rYoung = Math.floor(Math.random() * 6) + 1;
    const youngVal = rYoung + 1;
    const rL1 = Math.floor(Math.random() * 6) + 1;
    const rL2 = Math.floor(Math.random() * 6) + 1;
    const rL3 = Math.floor(Math.random() * 6) + 1;
    const lineageVal = rL1 + rL2 + rL3 + 5;

    setCharacter(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.family = updated.family || {};
      updated.family.oldKnights = oldVal;
      updated.family.middleKnights = midVal;
      updated.family.youngKnights = youngVal;
      updated.family.lineageMen = lineageVal;
      return updated;
    });

    setSheetMusterRollResults({
      old: { roll: rOld, val: oldVal },
      middle: { roll: rMid, val: midVal },
      young: { roll: rYoung, val: youngVal },
      lineage: { rolls: [rL1, rL2, rL3], val: lineageVal }
    });
  };

  const rollSheetStandings = () => {
    const rChar1 = Math.floor(Math.random() * 6) + 1;
    const rChar2 = Math.floor(Math.random() * 6) + 1;
    const charVal = rChar1 + rChar2;

    const rChur1 = Math.floor(Math.random() * 6) + 1;
    const rChur2 = Math.floor(Math.random() * 6) + 1;
    const churchVal = rChur1 + rChur2;

    const rComm1 = Math.floor(Math.random() * 6) + 1;
    const rComm2 = Math.floor(Math.random() * 6) + 1;
    const commonVal = rComm1 + rComm2;

    setCharacter(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.family = updated.family || {};
      updated.family.standingCharlemagne = charVal;
      updated.family.standingChurch = churchVal;
      updated.family.standingCommoners = commonVal;
      return updated;
    });

    setSheetStandingsRollResults({
      charlemagne: { rolls: [rChar1, rChar2], val: charVal },
      church: { rolls: [rChur1, rChur2], val: churchVal },
      commoners: { rolls: [rComm1, rComm2], val: commonVal }
    });
  };

  const rollSheetHonor = () => {
    const r1 = Math.floor(Math.random() * 6) + 1;
    const r2 = Math.floor(Math.random() * 6) + 1;
    const val = r1 + r2 + 3;

    setCharacter(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.family = updated.family || {};
      updated.family.honor = val;
      return updated;
    });
    setSheetHonorRollResult({ rolls: [r1, r2], val });
  };
  const [knightFatherClassRollResult, setKnightFatherClassRollResult] = useState(null);
  const [knightFatherSurvivalRollResult, setKnightFatherSurvivalRollResult] = useState(null);
  const [knightSonNumberRollResult, setKnightSonNumberRollResult] = useState(null);
  const [knightPageEducationRollResult, setKnightPageEducationRollResult] = useState(null);
  const [knightBlessingRollResult, setKnightBlessingRollResult] = useState(null);
  const [knightLeapRollResult, setKnightLeapRollResult] = useState(null);
  const [knightCulturalRollResult, setKnightCulturalRollResult] = useState(null);
  const [knightHomelandRollResult, setKnightHomelandRollResult] = useState(null);
  const [knightFeatureRollResult, setKnightFeatureRollResult] = useState(null);
  const [gearOutfitRollResult, setGearOutfitRollResult] = useState(null);
  const [gearBirthGiftRollResult, setGearBirthGiftRollResult] = useState(null);

  const rollKnightFatherClass = () => {
    const r = Math.floor(Math.random() * 20) + 1;
    let className = '';
    if (r === 1) className = "영주 또는 관료 (Lord or Officer)";
    else if (r >= 2 && r <= 3) className = "기치 기사 (Banneret Knight)";
    else if (r >= 4 && r <= 8) className = "봉신 기사 (Vassal Knight)";
    else if (r >= 9 && r <= 15) className = "독신 기사 (Bachelor Knight)";
    else className = "용병 기사 (Mercenary Knight)";

    handleInputChange('personal', 'fathersClass', className);
    setKnightFatherClassRollResult({ roll: r, name: className });
  };

  const rollKnightFatherSurvival = () => {
    const r = Math.floor(Math.random() * 20) + 1;
    let condition = '';
    if (r <= 13) condition = "부친 생존 (Father living)";
    else if (r <= 17) condition = "부친 사망 (Father deceased)";
    else if (r <= 19) condition = "부친 병상 (Father bedridden)";
    else {
      const missingYears = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);
      condition = `부친 실종 (Father missing, ${missingYears}년 동안)`;
    }
    handleInputChange('personal', 'fathersSurvival', condition);
    setKnightFatherSurvivalRollResult({ roll: r, desc: condition });
  };

  const rollKnightSonNumber = () => {
    const r = Math.floor(Math.random() * 6) + 1;
    let sonNum = '';
    if (r <= 2) sonNum = "첫째 (Eldest)";
    else if (r <= 4) sonNum = "둘째 (Second)";
    else sonNum = `셋째 (Third)`;
    handleInputChange('personal', 'sonNumber', sonNum);
    setKnightSonNumberRollResult({ roll: r, desc: sonNum });
  };

  const rollKnightPageEducation = () => {
    const r = Math.floor(Math.random() * 20) + 1;
    const edu = pageEducations.find(b => r >= b.rollRange[0] && r <= b.rollRange[1]);
    const name = edu ? edu.name : "왕실 궁정 (Royal court)";
    handleInputChange('personal', 'pageEducation', name);
    setKnightPageEducationRollResult({ roll: r, name });
  };

  const rollKnightBlessing = () => {
    const r = Math.floor(Math.random() * 20) + 1;
    const blessing = frankishBlessings.find(b => r >= b.rollRange[0] && r <= b.rollRange[1]);
    const desc = blessing ? `${blessing.name}: ${blessing.desc}` : "성스러운 가호";
    handleInputChange('personal', 'blessing', desc);
    setKnightBlessingRollResult({ roll: r, blessing: desc });
  };

  const rollKnightLeap = () => {
    if (hasAppliedEvent(character, 'character_creation:knight_leap_glory')) {
      alert("기사 도약 영광은 이미 이 캠페인에 반영되었습니다.");
      return;
    }
    const r = Math.floor(Math.random() * 20) + 1;
    const dex = character?.attributes?.dex || 10;
    const success = r <= dex;
    setKnightLeapRollResult({ roll: r, dex, success });
    if (success) {
      setCharacter(prev => {
        const result = applyOnce(prev, 'character_creation:knight_leap_glory', updated => {
          updated.gear.gloryTotal = (updated.gear.gloryTotal || 0) + 10;
          return updated;
        }, '기사 도약 영광 +10');
        return result.character;
      });
    }
  };

  const rollKnightCulturalModifiers = () => {
    if (hasAppliedEvent(character, 'character_creation:frankish_cultural_modifiers')) {
      alert("프랑크 문화 보정은 이미 이 캠페인에 반영되었습니다.");
      return;
    }
    const r1 = Math.floor(Math.random() * 3) + 1; // +1d3 Energetic
    const r2 = Math.floor(Math.random() * 3) + 1; // +1d3 Generous
    const r3 = Math.floor(Math.random() * 3) + 1; // +1d3 Valorous

    setCharacter(prev => {
      const result = applyOnce(prev, 'character_creation:frankish_cultural_modifiers', updated => {
        updated.traits.energetic = Math.min(20, (updated.traits.energetic || 10) + r1);
        updated.traits.lazy = 20 - updated.traits.energetic;

        updated.traits.generous = Math.min(20, (updated.traits.generous || 10) + r2);
        updated.traits.selfish = 20 - updated.traits.generous;

        updated.traits.valorous = Math.min(20, (updated.traits.valorous || 10) + r3);
        updated.traits.cowardly = 20 - updated.traits.valorous;

        updated.passions.honor = (updated.passions.honor || 16) + 1;
        updated.passions.loveGod = (updated.passions.loveGod || 15) + 1;

        const rels = ['chaste', 'forgiving', 'merciful', 'modest', 'temperate', 'trusting'];
        rels.forEach(trait => {
          updated.traits[trait] = Math.min(20, (updated.traits[trait] || 10) + 1);
          const opposed = {
            chaste: 'lustful', forgiving: 'vengeful', merciful: 'cruel',
            modest: 'proud', temperate: 'indulgent', trusting: 'suspicious'
          }[trait];
          updated.traits[opposed] = 20 - updated.traits[trait];
        });

        return updated;
      }, '프랑크 문화 보정');
      return result.character;
    });

    setKnightCulturalRollResult({ energetic: r1, generous: r2, valorous: r3 });
  };

  const rollKnightHomelandModifiers = () => {
    const r1 = Math.floor(Math.random() * 3) + 1;
    const r2 = Math.floor(Math.random() * 3) + 1;
    const r3 = Math.floor(Math.random() * 3) + 1;
    const r4 = Math.floor(Math.random() * 3) + 1;

    setCharacter(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.skills.hunting = (updated.skills.hunting || 0) + r1;

      updated.traits.temperate = Math.min(20, (updated.traits.temperate || 10) + r2);
      updated.traits.indulgent = 20 - updated.traits.temperate;

      updated.traits.modest = Math.min(20, (updated.traits.modest || 10) + r3);
      updated.traits.proud = 20 - updated.traits.modest;

      updated.traits.suspicious = Math.min(20, (updated.traits.suspicious || 10) + r4);
      updated.traits.trusting = 20 - updated.traits.suspicious;

      return updated;
    });

    setKnightHomelandRollResult({ hunting: r1, temperate: r2, modest: r3, suspicious: r4 });
  };

  const rollKnightFeature = () => {
    const catRoll = Math.floor(Math.random() * 6) + 1;
    let desc = '';
    let feature = '';

    if (catRoll === 1) {
      desc = "헤어스타일 (Hair)";
      const items = ["아주 긴 머리", "곱슬머리", "적발", "스포츠머리", "금발", "털이 아주 많음", "새치 머리", "윤기 나는 머리", "대머리"];
      feature = items[Math.floor(Math.random() * items.length)];
    } else if (catRoll === 2) {
      desc = "상체 (Torso)";
      const items = ["구부정한 상체", "맥주통 가슴", "곱사등", "키가 매우 큼", "날씬함", "어깨가 매우 넓음", "어깨가 위로 솟음", "단단한 근육질", "다부진 체격", "웅크린 어깨"];
      feature = items[Math.floor(Math.random() * items.length)];
    } else if (catRoll === 3) {
      desc = "사지 (Limbs)";
      const items = ["짧은 다리", "우람한 이두박근", "한쪽 팔이 더 김", "거친 손", "긴 손톱", "털이 많은 팔과 손", "오화자 다리", "눈에 띄는 절음발이", "큰 발", "긴 손가락"];
      feature = items[Math.floor(Math.random() * items.length)];
    } else if (catRoll === 4) {
      desc = "말투 (Speech)";
      const items = ["혀 짧은 소리", "말더듬", "독특한 사투리", "저음의 목소리", "날카로운 말투", "비음", "새되거나 째지는 목소리", "미성", "크고 웅장함", "속삭이듯 부드러움"];
      feature = items[Math.floor(Math.random() * items.length)];
    } else if (catRoll === 5) {
      desc = "얼굴 특징 (Facial Feature)";
      const items = ["수려한 매부리코", "고운 피부", "뺨의 칼흉터", "그을린 구리빛 피부", "칠흑 같은 눈동자", "짙은 눈썹", "깊게 파인 눈매", "광대뼈 돌출", "귀가 아주 큼", "길고 멋진 콧수염"];
      feature = items[Math.floor(Math.random() * items.length)];
    } else {
      desc = "표정 (Facial expression)";
      const items = ["빛나는 눈동자", "자존심 강한 표정", "비웃는 표정", "오만함", "싱그러운 미소", "털수염에 가려진 미소", "고른 하얀 이목구비", "시무룩함", "매사 쾌활함", "찌푸린 미간", "꿰뚫어보는 듯한 사나운 눈빛"];
      feature = items[Math.floor(Math.random() * items.length)];
    }

    setCharacter(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.personal = updated.personal || {};
      updated.personal.features = updated.personal.features || [];
      updated.personal.features.push(`${desc}: ${feature}`);
      return updated;
    });

    setKnightFeatureRollResult({ catRoll, desc, feature });
  };

  const rollStartingOutfit = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    let outfitDesc = '';
    let cashVal = 0;
    let armorText = '';
    let clothingText = '';
    let weaponsText = '';

    if (roll === 1) {
      armorText = "Cuirbouilli/Chainmail; 1 shield";
      clothingText = "90d 상당의 기본 의상";
      weaponsText = "1 iron sword, 1 spear, 1 dagger, 1 axe/flail/hammer, 1 bow & 12 arrows, 3 lances";
      cashVal = 90;
      outfitDesc = "Outfit 1: Rouncy; No squire. 90d; no coin.";
    } else if (roll === 2) {
      armorText = "Cuirbouilli/Chainmail; 2 shields";
      clothingText = "120d 상당의 의상";
      weaponsText = "1 iron sword, 1 spear, 1 dagger, 1 axe/flail/hammer, 1 bow & 12 arrows, 3 lances";
      cashVal = 120;
      outfitDesc = "Outfit 2: 2 rouncies; 1 squire. 120d; no coin.";
    } else if (roll === 3) {
      armorText = "Ring mail/Chain mail; 2 shields";
      clothingText = "£1 상당의 의상";
      weaponsText = "1 iron sword, 1 spear, 1 dagger, 1 axe/flail/hammer, 1 bow & 12 arrows, 3 lances";
      cashVal = 240;
      outfitDesc = "Outfit 3: 1 charger, 1 rouncy; 1 squire. £1; no coin.";
    } else if (roll === 4) {
      armorText = "Reinforced chain mail/Partial plate; 3 shields";
      clothingText = "£4 상당의 귀한 의상";
      weaponsText = "1 steel sword, 2 spears, 2 daggers, 1 axe/flail/hammer, light crossbow & 12 bolts, 5 lances";
      cashVal = 960;
      outfitDesc = "Outfit 4: 1 charger, 1 rouncy, 1 sumpter, 1 palfrey; 1 squire. £4; £2 in coin.";
    } else if (roll === 5) {
      armorText = "Partial plate/Full plate; 3 shields";
      clothingText = "£6 상당의 궁정 의상";
      weaponsText = "1 steel sword, 2 spears, 2 daggers, 1 axe/flail/hammer, light crossbow & 12 bolts, 5 lances";
      cashVal = 1440;
      outfitDesc = "Outfit 5: 2 chargers, 1 courser, 2 rouncies, 1 sumpter, 1 palfrey; 2 squires. £6; £3 in coin.";
    } else {
      armorText = "Full plate; 3 shields";
      clothingText = "£8 상당의 최고급 비단/모피 의상";
      weaponsText = "1 steel sword, 2 spears, 2 daggers, 1 axe/flail/hammer, light crossbow & 12 bolts, 5 lances";
      cashVal = 1920;
      outfitDesc = "Outfit 6: 2 chargers, 1 courser, 2 rouncies, 1 sumpter, 1 palfrey, 1 destrier; 4 squires.";
    }

    setGearOutfitRollResult({ roll, desc: outfitDesc, armor: armorText, clothing: clothingText, weapons: weaponsText, cash: cashVal });
  };

  const applyGearOutfit = () => {
    if (!gearOutfitRollResult) return;
    setCharacter(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.gear = updated.gear || {};
      updated.gear.cash = gearOutfitRollResult.cash;
      updated.gear.armorShield = gearOutfitRollResult.armor;
      updated.gear.clothing = gearOutfitRollResult.clothing;
      updated.gear.personalGear = (updated.gear.personalGear ? updated.gear.personalGear + ", " : "") + gearOutfitRollResult.weapons;
      return updated;
    });
    alert(`시작 복장 패키지 [Outfit ${gearOutfitRollResult.roll}]이(가) 성공적으로 적용되었습니다!`);
  };

  const rollGearBirthGift = () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    const gift = birthGiftsTable.find(g => g.roll === roll) || birthGiftsTable[roll - 1];
    setGearBirthGiftRollResult({ roll, name: gift.name, benefit: gift.benefit });
  };

  const applyGearBirthGift = () => {
    if (!gearBirthGiftRollResult) return;
    setCharacter(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.gear = updated.gear || {};
      updated.gear.personalGear = updated.gear.personalGear || '';
      updated.gear.cash = updated.gear.cash || 0;
      updated.skills = updated.skills || {};
      updated.traits = updated.traits || {};
      updated.horses = updated.horses || {};

      const gift = birthGiftsTable.find(g => g.roll === gearBirthGiftRollResult.roll);
      if (gift && gift.apply) {
        gift.apply(updated);
      }
      return updated;
    });
    alert(`가문 탄생 유산 [${gearBirthGiftRollResult.benefit}]이(가) 시트에 성공적으로 적용되었습니다!`);
  };

  const rollSheetEnemyHate = () => {
    const r1 = Math.floor(Math.random() * 6) + 1;
    const r2 = Math.floor(Math.random() * 6) + 1;
    const val = r1 + r2 + 3;
    setSheetEnemyHateRollResult({ rolls: [r1, r2], val });
  };


  // Custom Roll State
  const [customNameKo, setCustomNameKo] = useState('지벤');
  const [customNameEn, setCustomNameEn] = useState('Ghiben');
  const [customSiz, setCustomSiz] = useState(14);
  const [customDex, setCustomDex] = useState(12);
  const [customStr, setCustomStr] = useState(13);
  const [customCon, setCustomCon] = useState(12);
  const [customApp, setCustomApp] = useState(11);

  // 🎲 주사위 롤링 연동 상태 (d20 눈 입력바)
  const [customSaintRoll, setCustomSaintRoll] = useState(18); // St. Michael default
  const [customCharRoll, setCustomCharRoll] = useState(5); // Born in the saddle default
  const [customFatherRoll, setCustomFatherRoll] = useState(4); // Vassal Knight default

  const [customSaintIndex, setCustomSaintIndex] = useState(17); // St. Michael default
  const [customCharIndex, setCustomCharIndex] = useState(3); // Born in the saddle default
  const [customFatherIndex, setCustomFatherIndex] = useState(0); // Vassal Knight default
  const [customBlessing, setCustomBlessing] = useState('용맹의 징표');

  const [customBirthGiftRoll1, setCustomBirthGiftRoll1] = useState(4);
  const [customBirthGiftRoll2, setCustomBirthGiftRoll2] = useState(10);
  const [customBirthGiftRoll3, setCustomBirthGiftRoll3] = useState(17);

  const getBirthGiftRollCount = (fatherIndex) => {
    if (fatherIndex === 0) return 2; // Vassal
    if (fatherIndex === 1) return 3; // Banneret
    if (fatherIndex === 2) return 1; // Bachelor
    if (fatherIndex === 3) return 1; // Mercenary
    if (fatherIndex === 4) return 3; // Lord or Officer
    return 2;
  };

  const handleSaintRollChange = (val) => {
    const num = Math.min(20, Math.max(1, parseInt(val) || 1));
    setCustomSaintRoll(num);
    setCustomSaintIndex(num - 1);
  };

  const handleCharRollChange = (val) => {
    const num = Math.min(20, Math.max(1, parseInt(val) || 1));
    setCustomCharRoll(num);
    setCustomCharIndex(getCharIndexFromRoll(num));
  };

  const handleFatherRollChange = (val) => {
    const num = Math.min(20, Math.max(1, parseInt(val) || 1));
    setCustomFatherRoll(num);
    setCustomFatherIndex(getFatherIndexFromRoll(num));
  };

  const handleRollAttributes = () => {
    // 룰북 Table 1-8: 모든 남성 능력치 2d6+3 (범위 5~15)
    const roll2d6plus3 = () => Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 5;
    const rollD20 = () => Math.floor(Math.random() * 20) + 1;

    setCustomStr(roll2d6plus3());
    setCustomDex(roll2d6plus3());
    setCustomApp(roll2d6plus3());
    setCustomSiz(roll2d6plus3());
    setCustomCon(roll2d6plus3());

    const saintRoll = rollD20();
    const charRoll = rollD20();
    const fatherRoll = rollD20();

    setCustomSaintRoll(saintRoll);
    setCustomSaintIndex(saintRoll - 1);

    setCustomCharRoll(charRoll);
    setCustomCharIndex(getCharIndexFromRoll(charRoll));

    setCustomFatherRoll(fatherRoll);
    setCustomFatherIndex(getFatherIndexFromRoll(fatherRoll));

    setCustomBirthGiftRoll1(rollD20());
    setCustomBirthGiftRoll2(rollD20());
    setCustomBirthGiftRoll3(rollD20());
  };

  const handleApplyPreset = () => {
    const preset = presets[selectedPreset];

    // Mapping of family characteristics corresponding to each preset knight
    const presetCharacteristics = [
      {
        gender: 'male',
        roll: 5, // Born in the saddle
        desc: "말 위에서 태어남 (Born in the saddle)",
        bonusText: "스킬 [horsemanship] +5",
        applied: true,
        appliedBonus: { skills: { horsemanship: 5 } }
      },
      {
        gender: 'male',
        roll: 13, // Good speakers and storytellers
        desc: "훌륭한 이야기꾼 (Good speakers and storytellers)",
        bonusText: "스킬 [eloquence] +10",
        applied: true,
        appliedBonus: { skills: { eloquence: 10 } }
      },
      {
        gender: 'male',
        roll: 3, // Natural healers of wounds
        desc: "타고난 상처 치유력 (Natural healers of wounds)",
        bonusText: "스킬 [firstAid] +5",
        applied: true,
        appliedBonus: { skills: { firstAid: 5 } }
      }
    ];

    setCharacter(() => {
      const base = deepClone(initialCharacterState || character);
      base.campaign = {
        ...base.campaign,
        schemaVersion: 2,
        appliedEvents: {
          'character_creation:preset': {
            appliedAt: new Date().toISOString(),
            year: preset.stats.personal?.campaignYear || 768,
            label: `프리셋 생성: ${preset.name}`
          },
          'character_creation:family_characteristic': {
            appliedAt: new Date().toISOString(),
            year: preset.stats.personal?.campaignYear || 768,
            label: '프리셋 가문 특성'
          }
        },
        winter: {
          ...base.campaign?.winter,
          year: preset.stats.personal?.campaignYear || 768
        }
      };
      return {
        ...base,
        personal: {
          ...base.personal,
          ...preset.stats.personal,
          campaignYear: 768
        },
        attributes: {
          ...base.attributes,
          ...preset.stats.attributes
        },
        traits: {
          ...base.traits,
          ...preset.stats.traits
        },
        skills: {
          ...base.skills,
          ...preset.stats.skills
        },
        passions: {
          ...base.passions,
          ...preset.stats.passions
        },
        standings: {
          ...base.standings,
          ...preset.stats.standings
        },
        family: {
          ...base.family,
          characteristic: presetCharacteristics[selectedPreset] || null
        }
      };
    });
    setIsGenOpen(false);
    alert(`${preset.name} 프리셋이 성공적으로 시트에 적용되었습니다!`);
  };

  const handleApplyCustom = () => {
    const newChar = deepClone(initialCharacterState || character || {});
    const finalCustomName = getTitleByNameAndClass(customNameKo, customNameEn, "종자 (Squire)");

    newChar.personal = {
      ...newChar.personal,
      name: finalCustomName,
      age: 18,
      campaignYear: 768,
      sonNumber: "첫째",
      blessing: customBlessing || "가문의 축복",
      homeland: "아르덴 (Ardennes)",
      home: "바스토뉴 (Bastogne)",
      culture: "프랑크 (Frankish)",
      lineage: "아르덴 (Ardennes)",
      liegeLord: "티에리 공작 (Duke Thierry)",
      fathersClass: fathersClasses[customFatherIndex].name,
      personalClass: "종자 (Squire)",
      features: ["외마디 흉터", "다부진 근육", "예리한 시선"]
    };

    newChar.attributes = {
      ...newChar.attributes,
      siz: customSiz,
      dex: customDex,
      str: customStr,
      con: customCon,
      app: customApp,
      currentHp: customSiz + customCon
    };

    newChar.skills = {
      awareness: 8, chirurgery: 1, faerieLore: 2, firstAid: 10, folkLore: 4,
      horsemanship: 12, hunting: 6, industry: 5, recognize: 5, religion: 6, stewardship: 3, swimming: 5,
      courtesy: 8, dancing: 2, eloquence: 6, falconry: 4, gaming: 5, heraldry: 5, intrigue: 3, playInstruments: 1, readingWriting: 2, romance: 4, singing: 3,
      battle: 10, siege: 5,
      axe: 6, bludgeon: 5, dagger: 8, spear: 10, sword: 13, unarmed: 6,
      lance: 12, bow: 4, crossbow: 5, thrownWeapon: 4
    };

    newChar.traits = {
      chaste: 10, lustful: 10,
      energetic: 12, lazy: 8,
      forgiving: 11, vengeful: 9,
      generous: 13, selfish: 7,
      honest: 12, deceitful: 8,
      just: 10, arbitrary: 10,
      merciful: 11, cruel: 9,
      modest: 10, proud: 10,
      pious: 12, worldly: 8,
      prudent: 10, reckless: 10,
      temperate: 10, indulgent: 10,
      trusting: 11, suspicious: 9,
      valorous: 15, cowardly: 5
    };

    newChar.passions = {
      loyaltyLiege: 15,
      loveFamily: 15,
      hospitality: 15,
      honor: 16,
      hateSaracens: 12,
      loveGod: 15
    };

    newChar.standings = {
      charlemagne: 10,
      liegeLord: 15,
      family: 16,
      retinue: 13,
      church: 15,
      commoners: 11
    };

    const saint = patronSaints[customSaintIndex];
    saint.apply(newChar);

    const characteristic = familyCharacteristics[customCharIndex];
    characteristic.apply(newChar);

    // Sync with FamilyWinter characteristic roll system
    const indexToRoll = [1, 3, 4, 5, 7, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const charRoll = indexToRoll[customCharIndex] || 1;

    const charIndexToEffect = [
      { skills: { awareness: 5 } },        // 0: 예리한 감각
      { skills: { firstAid: 5 } },         // 1: 타고난 상처 치유력
      { skills: { heraldry: 5, recognize: 5 } }, // 2: 얼굴과 방패
      { skills: { horsemanship: 5 } },     // 3: 말 위에서
      { skills: { hunting: 5 } },          // 4: 자연과의 호흡
      { skills: { swimming: 10 } },        // 5: 수달의 재능
      { skills: { courtesy: 10 } },        // 6: 예절
      { skills: { dancing: 10 } },         // 7: 가벼운 발걸음
      { skills: { eloquence: 10 } },        // 8: 이야기꾼
      { skills: { falconry: 10 } },        // 9: 매들의 군주
      { skills: { gaming: 10 } },          // 10: 지혜로운 노련미
      { skills: { intrigue: 10 } },        // 11: 놀라운 통찰
      { skills: { playInstruments: 10 } }, // 12: 타고난 악사
      { skills: { singing: 10 } },         // 13: 축복받은 목소리
      { skills: { battle: 5 } },           // 14: 전장의 지배자 (룰북: Battle or Siege 택1, 기본 Battle)
      { skills: {} }                        // 15: 자유 선택 (Player's choice — 수동 적용)
    ];

    const effect = charIndexToEffect[customCharIndex] || { skills: {} };

    newChar.family.characteristic = {
      gender: 'male',
      roll: charRoll,
      desc: characteristic.name,
      bonusText: characteristic.benefit,
      applied: true,
      appliedBonus: effect
    };

    const father = fathersClasses[customFatherIndex];
    newChar.personal.fathersClass = father.name;
    newChar.personal.blessing = `${customBlessing} / ${saint.name}의 가호`;
    newChar.gear.gloryTotal = 1000 + father.glory;

    // Apply Table 1-15: Frankish Birth Gifts
    const rollsCount = getBirthGiftRollCount(customFatherIndex);
    const appliedGifts = [];
    if (rollsCount >= 1) {
      const gift = birthGiftsTable[customBirthGiftRoll1 - 1];
      if (gift) {
        gift.apply(newChar);
        appliedGifts.push(gift.benefit);
      }
    }
    if (rollsCount >= 2) {
      const gift = birthGiftsTable[customBirthGiftRoll2 - 1];
      if (gift) {
        gift.apply(newChar);
        appliedGifts.push(gift.benefit);
      }
    }
    if (rollsCount >= 3) {
      const gift = birthGiftsTable[customBirthGiftRoll3 - 1];
      if (gift) {
        gift.apply(newChar);
        appliedGifts.push(gift.benefit);
      }
    }

    newChar.attributes.currentHp = newChar.attributes.siz + newChar.attributes.con;
    newChar.campaign = {
      schemaVersion: 2,
      appliedEvents: {
        'character_creation:custom': {
          appliedAt: new Date().toISOString(),
          year: 768,
          label: `커스텀 생성: ${finalCustomName}`
        },
        'character_creation:patron_saint': {
          appliedAt: new Date().toISOString(),
          year: 768,
          label: `수호 성인: ${saint.name}`
        },
        'character_creation:family_characteristic': {
          appliedAt: new Date().toISOString(),
          year: 768,
          label: `가문 특성: ${characteristic.name}`
        },
        ...appliedGifts.reduce((acc, gift, index) => {
          acc[`character_creation:birth_gift:${index + 1}`] = {
            appliedAt: new Date().toISOString(),
            year: 768,
            label: `탄생 선물: ${gift}`
          };
          return acc;
        }, {})
      },
      winter: {
        year: 768,
        steps: {
          aging: 'pending',
          harvest: 'pending',
          survival: 'pending',
          personalEvent: 'pending',
          familyEvent: 'pending',
          experience: 'pending',
          training: 'pending',
          annualGlory: 'pending',
          maintenance: 'pending'
        },
        logs: [],
        unresolved: {},
        gloryBonusPoints: 0,
        bonusSpent: 0,
        skippedWithConfirmation: {}
      }
    };

    setCharacter(newChar);
    setIsGenOpen(false);
    alert(`커스텀 기사 [${finalCustomName}]이(가) 성공적으로 생성되어 캐릭터 시트에 적용되었습니다!\n(적용된 수호 성인: ${saint.name}, 가문 특성: ${characteristic.name}${appliedGifts.length > 0 ? `, 탄생 선물: ${appliedGifts.join(', ')}` : ''})`);
  };

  const handleInputChange = (category, field, value) => {
    setCharacter(prev => {
      const updated = { ...prev };
      if (category) {
        updated[category] = { ...updated[category], [field]: value };
      } else {
        updated[field] = value;
      }
      return updated;
    });
  };

  const handleTraitChange = (traitName, oppositeName, value) => {
    const numValue = Math.min(20, Math.max(0, parseInt(value) || 0));
    const oppositeValue = 20 - numValue;
    setCharacter(prev => ({
      ...prev,
      traits: { ...(prev?.traits || {}), [traitName]: numValue, [oppositeName]: oppositeValue }
    }));
  };

  // Calculated stats
  const str = parseInt(character?.attributes?.str) || 0;
  const siz = parseInt(character?.attributes?.siz) || 0;
  const dex = parseInt(character?.attributes?.dex) || 0;
  const con = parseInt(character?.attributes?.con) || 0;
  const app = parseInt(character?.attributes?.app) || 0;

  const calculatedDamage = Math.floor((str + siz) / 6);
  const calculatedHealing = Math.round((str + con) / 10);
  const calculatedMove = Math.round((str + dex) / 10);
  const maxHP = siz + con;
  const knockdown = siz;
  const majorWound = con;
  const currentHp = character?.attributes?.currentHp || 0;
  const hpPercent = maxHP > 0 ? Math.max(0, Math.min(100, (currentHp / maxHP) * 100)) : 0;

  // 1. Chivalrous Knight: Energetic, Generous, Just, Merciful, Modest, Valorous (Total >= 90 & Honor >= 16)
  const chivalrousTraitsTotal =
    (character?.traits?.energetic || 0) + (character?.traits?.generous || 0) +
    (character?.traits?.just || 0) + (character?.traits?.merciful || 0) +
    (character?.traits?.modest || 0) + (character?.traits?.valorous || 0);
  const honorVal = parseInt(character?.passions?.honor) || 0;
  const isChivalrousActive = chivalrousTraitsTotal >= 90 && honorVal >= 16;

  // 2. Religious Knight: Chaste, Forgiving, Merciful, Modest, Temperate, Trusting (Total >= 90 & Love[God] >= 16)
  const religiousTraitsTotal =
    (character?.traits?.chaste || 0) + (character?.traits?.forgiving || 0) +
    (character?.traits?.merciful || 0) + (character?.traits?.modest || 0) +
    (character?.traits?.temperate || 0) + (character?.traits?.trusting || 0);
  const loveGodVal = parseInt(character?.passions?.loveGod) || 0;
  const isReligiousActive = religiousTraitsTotal >= 90 && loveGodVal >= 16;

  // 3. Romantic Knight: Forgiving, Generous, Honest, Just, Prudent, Trusting (Total >= 90 & Amor >= 16 & Romance skill >= 10 & 4 other courtly skills >= 10)
  const romanticTraitsTotal =
    (character?.traits?.forgiving || 0) + (character?.traits?.generous || 0) +
    (character?.traits?.honest || 0) + (character?.traits?.just || 0) +
    (character?.traits?.prudent || 0) + (character?.traits?.trusting || 0);

  const romanceVal = character?.skills?.romance || 0;
  const otherCourtlySkillsOver10 = courtlySkills
    .filter(s => s.key !== 'romance')
    .filter(s => (character?.skills?.[s.key] || 0) >= 10)
    .length;
  const hasRequiredCourtlySkills = romanceVal >= 10 && otherCourtlySkillsOver10 >= 4;
  const amorVal = parseInt(character?.passions?.amor) || 0;
  const isRomanticActive = romanticTraitsTotal >= 90 && amorVal >= 16 && hasRequiredCourtlySkills;

  // 4. Standings Base values auto-calculated
  const baseStandings = {
    charlemagne: Math.min(
      character?.traits?.energetic || 0,
      character?.traits?.generous || 0,
      character?.traits?.just || 0,
      character?.traits?.merciful || 0,
      character?.traits?.modest || 0,
      character?.traits?.valorous || 0
    ),
    liegeLord: character?.traits?.valorous || 0,
    family: honorVal,
    retinue: character?.traits?.generous || 0,
    church: loveGodVal,
    commoners: character?.traits?.merciful || 0
  };

  const standingsList = [
    { key: "charlemagne", label: "황제 샤를마뉴 (Charlemagne)", base: baseStandings.charlemagne },
    { key: "liegeLord", label: "섬기는 주군 (Liege Lord)", base: baseStandings.liegeLord },
    { key: "family", label: "가문 가계 (Family)", base: baseStandings.family },
    { key: "retinue", label: "종자 및 시종단 (Retinue)", base: baseStandings.retinue },
    { key: "church", label: "성 교회 (The Church)", base: baseStandings.church },
    { key: "commoners", label: "영지 평민단 (Commoners)", base: baseStandings.commoners }
  ];

  // Data arrays are declared at module scope level

  const SkillRow = ({ skill, category = 'skills' }) => (
    <div className="cs-skill-row">
      <span className="cs-skill-name">{skill.label}</span>
      <span className="cs-skill-val">
        <div className="cs-num-ctrl">
          <button type="button" className="cs-ctrl-btn" onClick={() => handleInputChange('skills', skill.key, Math.max(0, (character?.skills?.[skill.key] || 0) - 1))}>−</button>
          <input type="number" value={character?.skills?.[skill.key] || 0}
            onChange={e => handleInputChange('skills', skill.key, parseInt(e.target.value) || 0)} />
          <button type="button" className="cs-ctrl-btn" onClick={() => handleInputChange('skills', skill.key, (character?.skills?.[skill.key] || 0) + 1)}>+</button>
        </div>
      </span>
      <input type="checkbox" className="exp-checkbox"
        checked={character?.skillsChecked?.[skill.key] || false}
        onChange={e => handleInputChange('skillsChecked', skill.key, e.target.checked)} />
    </div>
  );

  // Personal fields are declared at module scope level

  const attrList = [
    { key: 'siz', label: '체구', abbr: 'SIZ', note: `넉다운 ${knockdown}` },
    { key: 'dex', label: '민첩', abbr: 'DEX' },
    { key: 'str', label: '근력', abbr: 'STR' },
    { key: 'con', label: '체질', abbr: 'CON', note: `중상 ${majorWound}` },
    { key: 'app', label: '외모', abbr: 'APP' },
  ];

  // Passions are declared at module scope level

  return (
    <div className="cs-page view-animate">

      {/* 🔮 룰북 기반 캐릭터 생성 도우미 배너 및 패널 */}
      <div className="cs-gen-trigger-bar" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button
          type="button"
          className="btn-medieval btn-medieval-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.88rem' }}
          onClick={() => setIsGenOpen(!isGenOpen)}
        >
          <Sparkles size={16} />
          {isGenOpen ? '생성 도우미 닫기' : '✨ 룰북 캐릭터 생성 도우미'}
        </button>
      </div>

      {isGenOpen && (
        <div className="cs-gen-container view-animate">
          <div className="cs-gen-header">
            <h3>
              <Sparkles size={20} className="glow-effect" style={{ color: 'var(--color-gold)' }} />
              룰북 기반 기사 캐릭터 생성기 (Page 25-30)
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)' }}>
              18~21세의 아르덴 출신 기사단원을 규칙서 기준으로 자동 생성합니다.
            </span>
          </div>

          <div className="cs-gen-tabs">
            <button
              type="button"
              className={`cs-gen-tab-btn ${genActiveTab === 'preset' ? 'active' : ''}`}
              onClick={() => setGenActiveTab('preset')}
            >
              👑 기사 프리셋 빠른 시작
            </button>
            <button
              type="button"
              className={`cs-gen-tab-btn ${genActiveTab === 'custom' ? 'active' : ''}`}
              onClick={() => setGenActiveTab('custom')}
            >
              🎲 규칙서 커스텀 주사위 생성
            </button>
          </div>

          {genActiveTab === 'preset' ? (
            <div>
              <div className="cs-presets-grid">
                {presets.map((p, idx) => (
                  <div
                    key={p.name}
                    className={`cs-preset-card ${selectedPreset === idx ? 'selected' : ''}`}
                    onClick={() => setSelectedPreset(idx)}
                  >
                    <div>
                      <div className="cs-preset-title">{p.name}</div>
                      <div className="cs-preset-desc">{p.description}</div>
                    </div>
                    <div className="cs-preset-meta">
                      수호성인: {p.stats.personal.blessing.split(' / ')[0]}<br />
                      부친신분: {p.stats.personal.fathersClass}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.4)', padding: '12px 16px', borderRadius: '6px', border: '1px solid rgba(201,168,76,0.15)', fontSize: '0.8rem', color: 'var(--color-ink)' }}>
                <strong>선택된 프리셋 상세 정보:</strong><br />
                • 이름: {presets[selectedPreset].stats.personal.name}<br />
                • 주요 속성: STR {presets[selectedPreset].stats.attributes.str} / SIZ {presets[selectedPreset].stats.attributes.siz} / DEX {presets[selectedPreset].stats.attributes.dex} / CON {presets[selectedPreset].stats.attributes.con} / APP {presets[selectedPreset].stats.attributes.app}<br />
                • 대표 성향: 용맹 {presets[selectedPreset].stats.traits.valorous} / 경건 {presets[selectedPreset].stats.traits.pious}<br />
                • 주 무기 숙련도: 검 {presets[selectedPreset].stats.skills.sword} / 마창 {presets[selectedPreset].stats.skills.lance} / 전술 {presets[selectedPreset].stats.skills.battle}
              </div>

              <div className="cs-gen-apply-bar">
                <button type="button" className="btn-medieval" onClick={() => setIsGenOpen(false)}>취소</button>
                <button type="button" className="btn-medieval btn-medieval-primary" onClick={handleApplyPreset}>
                  <Check size={16} style={{ marginRight: '6px' }} />
                  이 프리셋으로 캐릭터 시트 생성
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="cs-roll-grid">
                <div className="cs-roll-col">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="ft-form-group">
                      <label className="ft-label">기사 한국어 이름:</label>
                      <input
                        type="text"
                        className="ft-input"
                        value={customNameKo}
                        onChange={e => setCustomNameKo(e.target.value)}
                        placeholder="예: 지벤"
                      />
                    </div>
                    <div className="ft-form-group">
                      <label className="ft-label">기사 영어 이름 (선택):</label>
                      <input
                        type="text"
                        className="ft-input"
                        value={customNameEn}
                        onChange={e => setCustomNameEn(e.target.value)}
                        placeholder="예: Ghiben"
                      />
                    </div>
                  </div>

                  <div className="ft-form-group" style={{ backgroundColor: 'rgba(201,168,76,0.05)', padding: '6px 10px', borderRadius: '4px', border: '1px solid rgba(201,168,76,0.15)', fontSize: '0.78rem', color: 'var(--color-grey)', marginBottom: '12px' }}>
                    생성 기사 이름 예시 (종자 신분): <strong>{getTitleByNameAndClass(customNameKo, customNameEn, "종자 (Squire)")}</strong>
                  </div>

                  <div className="ft-form-group">
                    <label className="ft-label">가문 수호 성인 (Table 1-3 d20 굴림 입력):</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '8px' }}>
                      <input
                        type="number"
                        className="ft-input"
                        min="1" max="20"
                        value={customSaintRoll}
                        onChange={e => handleSaintRollChange(Number(e.target.value))}
                        style={{ textAlign: 'center', fontWeight: 'bold' }}
                      />
                      <select
                        className="cs-roll-select"
                        value={customSaintIndex}
                        onChange={e => {
                          const idx = Number(e.target.value);
                          setCustomSaintIndex(idx);
                          setCustomSaintRoll(idx + 1);
                        }}
                      >
                        {patronSaints.map((saint, idx) => (
                          <option key={saint.name} value={idx}>{saint.name} (효과: {saint.benefit})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="ft-form-group">
                    <label className="ft-label">가문 특성 (Table 1-1 d20 굴림 입력):</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '8px' }}>
                      <input
                        type="number"
                        className="ft-input"
                        min="1" max="20"
                        value={customCharRoll}
                        onChange={e => handleCharRollChange(Number(e.target.value))}
                        style={{ textAlign: 'center', fontWeight: 'bold' }}
                      />
                      <select
                        className="cs-roll-select"
                        value={customCharIndex}
                        onChange={e => {
                          const idx = Number(e.target.value);
                          setCustomCharIndex(idx);
                          const repRolls = [1, 3, 4, 5, 7, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19];
                          setCustomCharRoll(repRolls[idx] || 20);
                        }}
                      >
                        {familyCharacteristics.map((char, idx) => (
                          <option key={char.name} value={idx}>{char.name} (효과: {char.benefit})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="ft-form-group">
                    <label className="ft-label">부친의 신분 (Table 1-4 d20 굴림 입력):</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '8px' }}>
                      <input
                        type="number"
                        className="ft-input"
                        min="1" max="20"
                        value={customFatherRoll}
                        onChange={e => handleFatherRollChange(Number(e.target.value))}
                        style={{ textAlign: 'center', fontWeight: 'bold' }}
                      />
                      <select
                        className="cs-roll-select"
                        value={customFatherIndex}
                        onChange={e => {
                          const idx = Number(e.target.value);
                          setCustomFatherIndex(idx);
                          const repRolls = [4, 2, 9, 16, 1]; // Vassal, Banneret, Bachelor, Mercenary, Lord
                          setCustomFatherRoll(repRolls[idx] || 4);
                        }}
                      >
                        {fathersClasses.map((f, idx) => (
                          <option key={f.name} value={idx}>{f.name} (효과: {f.benefit})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="ft-form-group">
                    <label className="ft-label">시작 축복 이름:</label>
                    <input
                      type="text"
                      className="ft-input"
                      value={customBlessing}
                      onChange={e => setCustomBlessing(e.target.value)}
                    />
                  </div>

                  {/* 가문 탄생 선물 (Table 1-15 Frankish Birth Gifts) */}
                  <div className="ft-form-group" style={{ borderTop: '1px dashed rgba(201,168,76,0.2)', paddingTop: '12px', marginTop: '12px' }}>
                    <label className="ft-label" style={{ color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      🎁 가문 탄생 선물 (부친 신분 보너스: {getBirthGiftRollCount(customFatherIndex)}회 굴림)
                    </label>
                    <span style={{ fontSize: '0.74rem', color: 'var(--color-grey)', display: 'block', marginBottom: '8px' }}>
                      룰북 40쪽 Table 1-15에 따라 조상 소지품 또는 유산을 획득합니다.
                    </span>

                    {getBirthGiftRollCount(customFatherIndex) >= 1 && (
                      <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '8px', marginBottom: '6px' }}>
                        <input
                          type="number"
                          className="ft-input"
                          min="1" max="20"
                          value={customBirthGiftRoll1}
                          onChange={e => setCustomBirthGiftRoll1(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
                          style={{ textAlign: 'center', fontWeight: 'bold' }}
                        />
                        <select
                          className="cs-roll-select"
                          value={customBirthGiftRoll1}
                          onChange={e => setCustomBirthGiftRoll1(Number(e.target.value))}
                        >
                          {birthGiftsTable.map((g) => (
                            <option key={g.roll + '-' + g.name} value={g.roll}>{g.roll}: {g.benefit}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {getBirthGiftRollCount(customFatherIndex) >= 2 && (
                      <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '8px', marginBottom: '6px' }}>
                        <input
                          type="number"
                          className="ft-input"
                          min="1" max="20"
                          value={customBirthGiftRoll2}
                          onChange={e => setCustomBirthGiftRoll2(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
                          style={{ textAlign: 'center', fontWeight: 'bold' }}
                        />
                        <select
                          className="cs-roll-select"
                          value={customBirthGiftRoll2}
                          onChange={e => setCustomBirthGiftRoll2(Number(e.target.value))}
                        >
                          {birthGiftsTable.map((g) => (
                            <option key={g.roll + '-' + g.name} value={g.roll}>{g.roll}: {g.benefit}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {getBirthGiftRollCount(customFatherIndex) >= 3 && (
                      <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '8px' }}>
                        <input
                          type="number"
                          className="ft-input"
                          min="1" max="20"
                          value={customBirthGiftRoll3}
                          onChange={e => setCustomBirthGiftRoll3(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
                          style={{ textAlign: 'center', fontWeight: 'bold' }}
                        />
                        <select
                          className="cs-roll-select"
                          value={customBirthGiftRoll3}
                          onChange={e => setCustomBirthGiftRoll3(Number(e.target.value))}
                        >
                          {birthGiftsTable.map((g) => (
                            <option key={g.roll + '-' + g.name} value={g.roll}>{g.roll}: {g.benefit}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="cs-roll-col">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="ft-label" style={{ margin: 0 }}>능력치 주사위 굴림 결과:</label>
                    <button type="button" className="cs-roll-btn" onClick={handleRollAttributes} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <RefreshCw size={12} style={{ marginRight: '4px' }} />
                      주사위 새로 굴리기
                    </button>
                  </div>

                  <div className="cs-roll-stat-row">
                    <span className="cs-roll-stat-label">근력 (STR):</span>
                    <span className="cs-roll-stat-val">{customStr}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-grey)' }}>3d6 굴림</span>
                  </div>

                  <div className="cs-roll-stat-row">
                    <span className="cs-roll-stat-label">체구 (SIZ):</span>
                    <span className="cs-roll-stat-val">{customSiz}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-grey)' }}>2d6+6 굴림</span>
                  </div>

                  <div className="cs-roll-stat-row">
                    <span className="cs-roll-stat-label">민첩 (DEX):</span>
                    <span className="cs-roll-stat-val">{customDex}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-grey)' }}>3d6 굴림</span>
                  </div>

                  <div className="cs-roll-stat-row">
                    <span className="cs-roll-stat-label">체질 (CON):</span>
                    <span className="cs-roll-stat-val">{customCon}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-grey)' }}>2d6+6 굴림</span>
                  </div>

                  <div className="cs-roll-stat-row">
                    <span className="cs-roll-stat-label">외모 (APP):</span>
                    <span className="cs-roll-stat-val">{customApp}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-grey)' }}>3d6 굴림</span>
                  </div>

                  <div style={{ backgroundColor: 'rgba(255,255,255,0.4)', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(201,168,76,0.15)', fontSize: '0.74rem', color: 'var(--color-grey)', lineHeight: 1.45 }}>
                    💡 <strong>성인/가문 특성 반영 규칙:</strong><br />
                    • 선택하신 수호 성인과 가문 특성의 추가 보너스 능력치가 생성 시 자동으로 더해집니다.<br />
                    • 부친의 신분에 따라 시작 명예(Glory)가 가산되며(+1000 기본), 추가 기술 보너스가 검/마창/둔기 기술에 자동 투자됩니다.
                  </div>
                </div>
              </div>

              <div className="cs-gen-apply-bar">
                <button type="button" className="btn-medieval" onClick={() => setIsGenOpen(false)}>취소</button>
                <button type="button" className="btn-medieval btn-medieval-primary" onClick={handleApplyCustom}>
                  <Check size={16} style={{ marginRight: '6px' }} />
                  커스텀 주사위 캐릭터 생성 및 적용
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════ PERSONAL DATA ══════ */}
      <section className="cs-section">
        <div className="sheet-ribbon"><h3>기사 인적 사항</h3></div>
        <div className="cs-section-inner">
          <div className="cs-field-grid">
            {personalFields.map(f => {
              if (f.key === 'name') {
                const { ko, en } = parseName(character?.personal?.name);
                return (
                  <React.Fragment key={f.key}>
                    <div className="cs-field">
                      <span className="cs-field-label">한국어 이름:</span>
                      <input
                        type="text"
                        value={ko}
                        onChange={e => {
                          const newKo = e.target.value;
                          const newName = getTitleByNameAndClass(newKo, en, character?.personal?.personalClass);
                          handleInputChange('personal', 'name', newName);
                        }}
                        placeholder="예: 롤랑"
                      />
                    </div>
                    <div className="cs-field">
                      <span className="cs-field-label">영어 이름 (선택):</span>
                      <input
                        type="text"
                        value={en}
                        onChange={e => {
                          const newEn = e.target.value;
                          const newName = getTitleByNameAndClass(ko, newEn, character?.personal?.personalClass);
                          handleInputChange('personal', 'name', newName);
                        }}
                        placeholder="예: Roland"
                      />
                    </div>
                    <div className="cs-field cs-field-full" style={{ gridColumn: 'span 2', backgroundColor: 'rgba(201,168,76,0.04)', padding: '6px 12px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(201,168,76,0.15)', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)' }}>계산된 최종 이름 (칭호 자동 부여):</span>
                      <strong style={{ color: 'var(--color-royal-blue)', fontSize: '0.88rem' }}>{character?.personal?.name || '-'}</strong>
                    </div>
                  </React.Fragment>
                );
              }

              return (
                <div className="cs-field" key={f.key}>
                  <span className="cs-field-label">{f.label}:</span>
                  <input type={f.type || 'text'}
                    value={f.type === 'number' ? (character?.personal?.[f.key] || 0) : (character?.personal?.[f.key] || '')}
                    onChange={e => {
                      const val = e.target.value;
                      handleInputChange('personal', f.key, f.type === 'number' ? (parseInt(val) || 0) : val);

                      // If editing current status (personalClass), recalculate name titles!
                      if (f.key === 'personalClass') {
                        const { ko, en } = parseName(character?.personal?.name);
                        const newName = getTitleByNameAndClass(ko, en, val);
                        handleInputChange('personal', 'name', newName);
                      }
                    }}
                  />
                </div>
              );
            })}
            {character?.family?.characteristic?.applied && (
              <div className="cs-field cs-field-full" style={{ gridColumn: 'span 2', backgroundColor: 'rgba(46,107,51,0.03)', padding: '8px 12px', borderRadius: '4px', border: '1px solid rgba(46,107,51,0.15)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: '#2e6b33', fontWeight: 'bold' }}>🛡️ 가문 전승 특징:</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-royal-blue)' }}>
                  <strong>{character.family?.characteristic?.desc}</strong> ({character.family?.characteristic?.bonusText})
                </span>
              </div>
            )}
          </div>
        </div>
  </section>

      {/* ══════ BIRTH, EDUCATION & BLESSING (p.30-32, p.42) ══════ */}
      <section className="cs-section" style={{ marginTop: '16px' }}>
        <div className="sheet-ribbon"><h3>출생, 교육 및 축복 (Birth, Education & Blessing)</h3></div>
        <div className="cs-section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>

            {/* Father's Class */}
            <div style={{ backgroundColor: 'rgba(201,168,76,0.03)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.18)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-gold-dark)' }}>부친의 신분 (Table 1-4 & 1-5)</label>
                <button type="button" className="btn-medieval" style={{ padding: '3px 8px', fontSize: '0.75rem' }} onClick={rollKnightFatherClass}>
                  <Dices size={12} style={{ marginRight: '4px' }} /> 1d20 굴리기
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={character?.personal?.fathersClass || ''}
                  onChange={e => handleInputChange('personal', 'fathersClass', e.target.value)}
                  style={{ flex: 1, padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--color-gold-light)', fontSize: '0.88rem', backgroundColor: '#faf6eb' }}
                >
                  <option value="">-- 신분 선택 --</option>
                  {fathersClasses.map(fc => <option key={fc.name} value={fc.name}>{fc.name}</option>)}
                </select>
                <input
                  type="text"
                  value={character?.personal?.fathersClass || ''}
                  onChange={e => handleInputChange('personal', 'fathersClass', e.target.value)}
                  placeholder="또는 직접 입력"
                  style={{ width: '120px', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--color-gold-light)', fontSize: '0.88rem', backgroundColor: '#faf6eb' }}
                />
              </div>
              {knightFatherClassRollResult && (
                <div style={{ fontSize: '0.82rem', color: 'var(--color-royal-blue)', backgroundColor: 'white', padding: '6px 10px', borderRadius: '4px', border: '1px dotted var(--color-border)' }}>
                  🎲 굴림 결과: <strong>{knightFatherClassRollResult.roll}</strong> → <strong>{knightFatherClassRollResult.name}</strong>
                </div>
              )}
            </div>

            {/* Father's Survival */}
            <div style={{ backgroundColor: 'rgba(201,168,76,0.03)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.18)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-gold-dark)' }}>부친의 생존 상태 (Table 1-6)</label>
                <button type="button" className="btn-medieval" style={{ padding: '3px 8px', fontSize: '0.75rem' }} onClick={rollKnightFatherSurvival}>
                  <Dices size={12} style={{ marginRight: '4px' }} /> 1d20 굴리기
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={character?.personal?.fathersSurvival || ''}
                  onChange={e => handleInputChange('personal', 'fathersSurvival', e.target.value)}
                  style={{ flex: 1, padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--color-gold-light)', fontSize: '0.88rem', backgroundColor: '#faf6eb' }}
                >
                  <option value="">-- 생존 여부 선택 --</option>
                  <option value="부친 생존 (Father living)">부친 생존 (Father living)</option>
                  <option value="부친 사망 (Father deceased)">부친 사망 (Father deceased)</option>
                  <option value="부친 병상 (Father bedridden)">부친 병상 (Father bedridden)</option>
                  <option value="부친 실종 (Father missing)">부친 실종 (Father missing)</option>
                </select>
                <input
                  type="text"
                  value={character?.personal?.fathersSurvival || ''}
                  onChange={e => handleInputChange('personal', 'fathersSurvival', e.target.value)}
                  placeholder="또는 직접 입력"
                  style={{ width: '120px', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--color-gold-light)', fontSize: '0.88rem', backgroundColor: '#faf6eb' }}
                />
              </div>
              {knightFatherSurvivalRollResult && (
                <div style={{ fontSize: '0.82rem', color: 'var(--color-royal-blue)', backgroundColor: 'white', padding: '6px 10px', borderRadius: '4px', border: '1px dotted var(--color-border)' }}>
                  🎲 굴림 결과: <strong>{knightFatherSurvivalRollResult.roll}</strong> → <strong>{knightFatherSurvivalRollResult.desc}</strong>
                </div>
              )}
            </div>

            {/* Son Number */}
            <div style={{ backgroundColor: 'rgba(201,168,76,0.03)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.18)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-gold-dark)' }}>자녀 서열 (Son Number, p.31)</label>
                <button type="button" className="btn-medieval" style={{ padding: '3px 8px', fontSize: '0.75rem' }} onClick={rollKnightSonNumber}>
                  <Dices size={12} style={{ marginRight: '4px' }} /> 1d6 굴리기
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={character?.personal?.sonNumber || ''}
                  onChange={e => handleInputChange('personal', 'sonNumber', e.target.value)}
                  style={{ flex: 1, padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--color-gold-light)', fontSize: '0.88rem', backgroundColor: '#faf6eb' }}
                >
                  <option value="">-- 서열 선택 --</option>
                  <option value="첫째 (Eldest)">첫째 (Eldest)</option>
                  <option value="둘째 (Second)">둘째 (Second)</option>
                  <option value="셋째 (Third)">셋째 (Third)</option>
                  <option value="넷째 (Fourth)">넷째 (Fourth)</option>
                </select>
                <input
                  type="text"
                  value={character?.personal?.sonNumber || ''}
                  onChange={e => handleInputChange('personal', 'sonNumber', e.target.value)}
                  placeholder="직접 입력"
                  style={{ width: '120px', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--color-gold-light)', fontSize: '0.88rem', backgroundColor: '#faf6eb' }}
                />
              </div>
              {knightSonNumberRollResult && (
                <div style={{ fontSize: '0.82rem', color: 'var(--color-royal-blue)', backgroundColor: 'white', padding: '6px 10px', borderRadius: '4px', border: '1px dotted var(--color-border)' }}>
                  🎲 굴림 결과: <strong>{knightSonNumberRollResult.roll}</strong> → <strong>{knightSonNumberRollResult.desc}</strong>
                </div>
              )}
            </div>

            {/* Page Education */}
            <div style={{ backgroundColor: 'rgba(201,168,76,0.03)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.18)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-gold-dark)' }}>페이지 교육 (Table 1-7)</label>
                <button type="button" className="btn-medieval" style={{ padding: '3px 8px', fontSize: '0.75rem' }} onClick={rollKnightPageEducation}>
                  <Dices size={12} style={{ marginRight: '4px' }} /> 1d20 굴리기
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={character?.personal?.pageEducation || ''}
                  onChange={e => handleInputChange('personal', 'pageEducation', e.target.value)}
                  style={{ flex: 1, padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--color-gold-light)', fontSize: '0.88rem', backgroundColor: '#faf6eb' }}
                >
                  <option value="">-- 교육 기관 선택 --</option>
                  {pageEducations.map(pe => <option key={pe.name} value={pe.name}>{pe.name}</option>)}
                </select>
                <input
                  type="text"
                  value={character?.personal?.pageEducation || ''}
                  onChange={e => handleInputChange('personal', 'pageEducation', e.target.value)}
                  placeholder="또는 직접 입력"
                  style={{ width: '120px', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--color-gold-light)', fontSize: '0.88rem', backgroundColor: '#faf6eb' }}
                />
              </div>
              {character?.personal?.pageEducation && (
                <div style={{ fontSize: '0.82rem', color: 'var(--color-royal-blue)', backgroundColor: 'white', padding: '6px 10px', borderRadius: '4px', border: '1px dotted var(--color-border)' }}>
                  {pageEducations.find(pe => pe.name === character.personal.pageEducation)?.benefit && (
                    <span><strong>효과:</strong> {pageEducations.find(pe => pe.name === character.personal.pageEducation).benefit}</span>
                  )}
                  {knightPageEducationRollResult && knightPageEducationRollResult.name === character.personal.pageEducation && (
                    <div style={{ marginTop: '4px', color: 'var(--color-grey)' }}>🎲 굴림값: {knightPageEducationRollResult.roll}</div>
                  )}
                </div>
              )}
            </div>

            {/* Frankish Blessing */}
            <div style={{ backgroundColor: 'rgba(201,168,76,0.03)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.18)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-gold-dark)' }}>성스러운 축복 (Table 1-17, p.42)</label>
                <button type="button" className="btn-medieval" style={{ padding: '3px 8px', fontSize: '0.75rem' }} onClick={rollKnightBlessing}>
                  <Dices size={12} style={{ marginRight: '4px' }} /> 1d20 굴리기
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={character?.personal?.blessing || ''}
                  onChange={e => handleInputChange('personal', 'blessing', e.target.value)}
                  style={{ flex: 1, padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--color-gold-light)', fontSize: '0.88rem', backgroundColor: '#faf6eb' }}
                >
                  <option value="">-- 축복 선택 --</option>
                  {frankishBlessings.map(b => (
                    <option key={b.name} value={`${b.name}: ${b.desc}`}>{b.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={character?.personal?.blessing || ''}
                  onChange={e => handleInputChange('personal', 'blessing', e.target.value)}
                  placeholder="또는 직접 입력"
                  style={{ width: '120px', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--color-gold-light)', fontSize: '0.88rem', backgroundColor: '#faf6eb' }}
                />
              </div>
              {character?.personal?.blessing && (
                <div style={{ fontSize: '0.82rem', color: 'var(--color-royal-blue)', backgroundColor: 'white', padding: '6px 10px', borderRadius: '4px', border: '1px dotted var(--color-border)' }}>
                  <strong>상세:</strong> {character.personal.blessing}
                  {knightBlessingRollResult && character.personal.blessing.includes(knightBlessingRollResult.blessing.split(':')[0]) && (
                    <div style={{ marginTop: '4px', color: 'var(--color-grey)' }}>🎲 굴림값: {knightBlessingRollResult.roll}</div>
                  )}
                </div>
              )}
            </div>

            {/* The Leap Ceremony */}
            <div style={{ backgroundColor: 'rgba(201,168,76,0.03)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.18)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-gold-dark)' }}>마창 도약 의식 (The Leap, p.36)</label>
                <button type="button" className="btn-medieval btn-medieval-primary" style={{ padding: '3px 10px', fontSize: '0.75rem' }} onClick={rollKnightLeap}>
                  <Dices size={12} style={{ marginRight: '4px' }} /> 1d20 굴리기
                </button>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-grey)', margin: 0, lineHeight: '1.3' }}>
                DEX 이하로 굴리면 성공하여 <strong>+10 Glory</strong>를 획득합니다.
              </p>
              {knightLeapRollResult && (
                <div style={{
                  fontSize: '0.85rem',
                  backgroundColor: knightLeapRollResult.success ? 'rgba(46,107,51,0.06)' : 'rgba(139,0,0,0.06)',
                  border: knightLeapRollResult.success ? '1px solid rgba(46,107,51,0.2)' : '1px solid rgba(139,0,0,0.2)',
                  color: knightLeapRollResult.success ? '#2e6b33' : 'var(--color-danger)',
                  padding: '8px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  🎲 굴림값: {knightLeapRollResult.roll} vs DEX: {knightLeapRollResult.dex} → {knightLeapRollResult.success ? "성공! 🎉 (+10 영예 추가됨)" : "실패! 😢 (모두가 웃어넘깁니다)"}
                </div>
              )}
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
            {/* Cultural & Homeland Rollers */}
            <div style={{ backgroundColor: 'rgba(201,168,76,0.02)', padding: '12px', borderRadius: '6px', border: '1px dashed var(--color-border)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'var(--color-gold-dark)', fontSize: '0.88rem', fontWeight: 'bold' }}>문화권 및 고향 능력치 보정 (Step 3, p.32)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button type="button" className="btn-medieval" style={{ flex: 1, padding: '6px' }} onClick={rollKnightCulturalModifiers}>
                    프랑크인 문화 보너스 적용
                  </button>
                  {knightCulturalRollResult && (
                    <span style={{ fontSize: '0.78rem', color: '#2e6b33', fontWeight: 'bold' }}>
                      🎲 +{knightCulturalRollResult.energetic} 활기 / +{knightCulturalRollResult.generous} 관대 / +{knightCulturalRollResult.valorous} 용맹 (+명예/종교/종교Traits +1)
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button type="button" className="btn-medieval" style={{ flex: 1, padding: '6px' }} onClick={rollKnightHomelandModifiers}>
                    아르덴 출신 보너스 적용
                  </button>
                  {knightHomelandRollResult && (
                    <span style={{ fontSize: '0.78rem', color: '#2e6b33', fontWeight: 'bold' }}>
                      🎲 +{knightHomelandRollResult.hunting} 수렵 / +{knightHomelandRollResult.temperate} 절제 / +{knightHomelandRollResult.modest} 겸손 / +{knightHomelandRollResult.suspicious} 의심
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Distinctive Features */}
            <div style={{ backgroundColor: 'rgba(201,168,76,0.02)', padding: '12px', borderRadius: '6px', border: '1px dashed var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, color: 'var(--color-gold-dark)', fontSize: '0.88rem', fontWeight: 'bold' }}>외형적 특징 무작위 생성 (Table 1-9)</h4>
                <button type="button" className="btn-medieval" style={{ padding: '3px 8px', fontSize: '0.75rem' }} onClick={rollKnightFeature}>
                  <Dices size={12} style={{ marginRight: '4px' }} /> 특징 추가 굴림
                </button>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-grey)', margin: '0 0 8px 0' }}>
                주사위를 굴리면 무작위 특징 카테고리가 선택되고 새 특징이 특징 목록에 추가됩니다.
              </p>
              {knightFeatureRollResult && (
                <div style={{ fontSize: '0.78rem', color: 'var(--color-royal-blue)', backgroundColor: 'white', padding: '6px', borderRadius: '4px', border: '1px dotted var(--color-border)', marginBottom: '8px' }}>
                  🎲 굴림 결과 (카테고리 {knightFeatureRollResult.catRoll}: {knightFeatureRollResult.desc}) → <strong>{knightFeatureRollResult.feature}</strong>
                </div>
              )}
              {/* Features List displaying on character sheet */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(character?.personal?.features || []).map((feat, fidx) => (
                  <div key={fidx} style={{
                    fontSize: '0.9rem',
                    backgroundColor: 'rgba(201,168,76,0.06)',
                    border: '1.2px solid rgba(201,168,76,0.25)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ fontWeight: '500', color: 'var(--color-ink)' }}>{feat}</span>
                    <button type="button" style={{
                      border: 'none',
                      background: 'none',
                      color: 'var(--color-danger)',
                      cursor: 'pointer',
                      padding: '2px 6px',
                      fontWeight: 'bold',
                      fontSize: '0.95rem'
                    }} onClick={() => {
                      const updated = (character?.personal?.features || []).filter((_, idx) => idx !== fidx);
                      handleInputChange('personal', 'features', updated);
                    }}>×</button>
                  </div>
                ))}
                {(character?.personal?.features || []).length === 0 && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)', fontStyle: 'italic' }}>아직 등록된 특징이 없습니다.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ ATTRIBUTES (Stat Blocks) ══════ */}
      <section className="cs-section">
        <div className="sheet-ribbon"><h3>주요 능력치</h3></div>
        <div className="cs-section-inner">
          <div className="cs-attr-row">
            {attrList.map(attr => (
              <div className="cs-attr-block" key={attr.key}>
                <span className="cs-attr-abbr">{attr.abbr}</span>
                <span className="cs-attr-label">{attr.label}</span>
                <input type="number" value={character?.attributes?.[attr.key] || 0}
                  onChange={e => handleInputChange('attributes', attr.key, parseInt(e.target.value) || 0)} />
                <div className="cs-attr-actions">
                  <button type="button" className="cs-attr-btn"
                    onClick={() => handleInputChange('attributes', attr.key, Math.max(0, (character?.attributes?.[attr.key] || 0) - 1))}>−</button>
                  <button type="button" className="cs-attr-btn"
                    onClick={() => handleInputChange('attributes', attr.key, (character?.attributes?.[attr.key] || 0) + 1)}>+</button>
                </div>
                {attr.note && <span className="cs-attr-note">{attr.note}</span>}
              </div>
            ))}
          </div>

          {/* Derived Stats */}
          <div className="cs-derived-strip">
            <div className="cs-derived-item">
              <span className="cs-derived-label">피해량</span>
              <span className="cs-derived-value">{calculatedDamage}d6</span>
            </div>
            <div className="cs-derived-item">
              <span className="cs-derived-label">치유력</span>
              <span className="cs-derived-value">{calculatedHealing}</span>
            </div>
            <div className="cs-derived-item">
              <span className="cs-derived-label">이동</span>
              <span className="cs-derived-value">{calculatedMove}</span>
            </div>
            <div className="cs-derived-item cs-derived-hp">
              <span className="cs-derived-label">최대 HP</span>
              <span className="cs-derived-value">{maxHP}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ HP + GLORY (side by side) ══════ */}
      <div className="cs-row">
        <section className="cs-section">
          <div className="sheet-ribbon"><h3>현재 체력</h3></div>
          <div className="cs-section-inner">
            <div className="cs-hp-panel">
              <div className="cs-hp-main">
                <span style={{ fontWeight: 700, color: 'var(--color-danger)', fontSize: '0.95rem' }}>HP</span>
                <input type="number" value={currentHp} max={maxHP}
                  onChange={e => handleInputChange('attributes', 'currentHp', Math.min(maxHP, parseInt(e.target.value) || 0))} />
                <span style={{ fontSize: '1.1rem', color: 'var(--color-grey)' }}>/ {maxHP}</span>
              </div>
              <div className="cs-hp-bar">
                <div className="cs-hp-bar-fill" style={{ width: `${hpPercent}%` }} />
              </div>
              <div className="cs-hp-thresholds">
                <span className={`cs-hp-threshold ${currentHp <= maxHP * 0.75 ? 'active' : ''}`}>
                  ⦿ 3/4 [{Math.round(maxHP * 0.75)}] -5
                </span>
                <span className={`cs-hp-threshold ${currentHp <= maxHP * 0.5 ? 'active' : ''}`}>
                  ⦿ 1/2 [{Math.round(maxHP * 0.5)}] -10
                </span>
                <span className={`cs-hp-threshold ${currentHp <= maxHP * 0.25 ? 'active' : ''}`}>
                  ⦿ 1/4 [{Math.round(maxHP * 0.25)}] 의식불명
                </span>
                <span className={`cs-hp-threshold ${currentHp <= 0 ? 'active' : ''}`} style={{ color: 'var(--color-danger)' }}>
                  ✝ 사망 위험
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="cs-section">
          <div className="sheet-ribbon"><h3>영예 (Glory)</h3></div>
          <div className="cs-section-inner">
            <div className="cs-glory-row">
              <div className="cs-glory-item">
                <label>이번 세션</label>
                <input type="number" value={character?.gear?.gloryThisGame || 0}
                  onChange={e => handleInputChange('gear', 'gloryThisGame', parseInt(e.target.value) || 0)} />
              </div>
              <div className="cs-glory-item cs-glory-total">
                <label>누적 총합</label>
                <input type="number" value={character?.gear?.gloryTotal || 0}
                  onChange={e => handleInputChange('gear', 'gloryTotal', parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>

          {/* Shield mini */}
          <div className="cs-shield-wrap">
            <div className="shield-container" style={{ width: '140px', height: '170px', maxWidth: '140px' }}>
              <div className="shield-text" style={{ fontSize: '1rem' }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--color-crimson)', marginBottom: '4px' }}>❖</div>
                <div style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>가문의 문장</div>
                <div style={{ fontSize: '0.6rem', marginTop: '3px', color: 'var(--color-gold-dark)', fontWeight: 'bold' }}>
                  {character?.family?.name || "아르덴"}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ══════ PERSONALITY TRAITS ══════ */}
      <section className="cs-section">
        <div className="sheet-ribbon"><h3>성향 및 도덕률</h3></div>
        <div className="cs-section-inner">
          {/* Bonus indicators */}
          <div className="cs-bonus-strip" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span className={`cs-bonus-item ${isChivalrousActive ? 'active' : ''}`}>
              ⦿ 기사도 [{chivalrousTraitsTotal}/90] {isChivalrousActive ? '★ +3 아머 (Divine Aid)' : ''}
            </span>
            <span className={`cs-bonus-item ${isReligiousActive ? 'active' : ''}`}>
              ✝ 신앙심 [{religiousTraitsTotal}/90] {isReligiousActive ? '★ +5 기도 보너스' : ''}
            </span>
            <span className={`cs-bonus-item ${isRomanticActive ? 'active' : ''}`} style={{ borderColor: isRomanticActive ? '#4a148c' : 'inherit', backgroundColor: isRomanticActive ? 'rgba(74,20,140,0.06)' : 'inherit', color: isRomanticActive ? '#4a148c' : 'inherit' }}>
              🌹 로맨스 [{romanticTraitsTotal}/90] {isRomanticActive ? '★ 1회 주사위 재굴림' : ''}
            </span>
          </div>

          <table className="cs-trait-table">
            <tbody>
              {traitList.map(t => (
                <tr key={t.key1}>
                  <td className="cs-trait-sym">{t.sym}</td>
                  <td className="cs-trait-name">{t.label1}</td>
                  <td className="cs-trait-val">
                    <div className="cs-num-ctrl mini">
                      <button type="button" className="cs-ctrl-btn" onClick={() => handleTraitChange(t.key1, t.key2, Math.max(0, (character?.traits?.[t.key1] || 0) - 1))}>−</button>
                      <input type="number" value={character?.traits?.[t.key1] || 0}
                        onChange={e => handleTraitChange(t.key1, t.key2, e.target.value)} />
                      <button type="button" className="cs-ctrl-btn" onClick={() => handleTraitChange(t.key1, t.key2, Math.min(20, (character?.traits?.[t.key1] || 0) + 1))}>+</button>
                    </div>
                  </td>
                  <td className="cs-trait-divider">/</td>
                  <td className="cs-trait-val">
                    <div className="cs-num-ctrl mini">
                      <button type="button" className="cs-ctrl-btn" onClick={() => handleTraitChange(t.key2, t.key1, Math.max(0, (character?.traits?.[t.key2] || 0) - 1))}>−</button>
                      <input type="number" value={character?.traits?.[t.key2] || 0}
                        onChange={e => handleTraitChange(t.key2, t.key1, e.target.value)} />
                      <button type="button" className="cs-ctrl-btn" onClick={() => handleTraitChange(t.key2, t.key1, Math.min(20, (character?.traits?.[t.key2] || 0) + 1))}>+</button>
                    </div>
                  </td>
                  <td className="cs-trait-name-right">{t.label2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ══════ PASSIONS + STANDINGS (side by side) ══════ */}
      <div className="cs-row">
        {/* Passions */}
        <section className="cs-section" style={{ flex: '1' }}>
          <div className="sheet-ribbon"><h3>기사의 열망 (Passions)</h3></div>
          <div className="cs-section-inner">
            {passions.map(p => (
              <div className="cs-passion-row" key={p.key}>
                <input type="checkbox" className="exp-checkbox"
                  checked={character?.passionsChecked?.[p.key] || false}
                  onChange={e => handleInputChange('passionsChecked', p.key, e.target.checked)} />
                <span className="cs-passion-name">{p.label}</span>
                <span className="cs-skill-val">
                  <div className="cs-num-ctrl">
                    <button type="button" className="cs-ctrl-btn" onClick={() => {
                      const val = character?.passions?.[p.key] !== undefined ? character?.passions?.[p.key] : p.defaultVal;
                      handleInputChange('passions', p.key, Math.max(0, val - 1));
                    }}>−</button>
                    <input type="number"
                      value={character?.passions?.[p.key] !== undefined ? character?.passions?.[p.key] : p.defaultVal}
                      onChange={e => handleInputChange('passions', p.key, parseInt(e.target.value) || 0)} />
                    <button type="button" className="cs-ctrl-btn" onClick={() => {
                      const val = character?.passions?.[p.key] !== undefined ? character?.passions?.[p.key] : p.defaultVal;
                      handleInputChange('passions', p.key, val + 1);
                    }}>+</button>
                  </div>
                </span>
              </div>
            ))}
            {/* Dynamic Hates/Passions inherited from lineage */}
            {Object.keys(character?.passions || {}).map(key => {
              if (passions.some(p => p.key === key)) return null;
              const label = key === 'hateSaxons' ? '작센인에 대한 증오 (Hate Saxons)'
                          : key === 'hateMoors' ? '이교도(무어인)에 대한 증오 (Hate Moors)'
                          : key === 'hateDanes' ? '덴마크인에 대한 증오 (Hate Danes)'
                          : key;
              return (
                <div className="cs-passion-row" key={key}>
                  <input type="checkbox" className="exp-checkbox"
                    checked={character?.passionsChecked?.[key] || false}
                    onChange={e => handleInputChange('passionsChecked', key, e.target.checked)} />
                  <span className="cs-passion-name">{label}</span>
                  <span className="cs-skill-val">
                    <div className="cs-num-ctrl">
                      <button type="button" className="cs-ctrl-btn" onClick={() => {
                        const val = character?.passions?.[key] || 0;
                        handleInputChange('passions', key, Math.max(0, val - 1));
                      }}>−</button>
                      <input type="number"
                        value={character?.passions?.[key] || 0}
                        onChange={e => handleInputChange('passions', key, parseInt(e.target.value) || 0)} />
                      <button type="button" className="cs-ctrl-btn" onClick={() => {
                        const val = character?.passions?.[key] || 0;
                        handleInputChange('passions', key, val + 1);
                      }}>+</button>
                    </div>
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Standings */}
        <section className="cs-section" style={{ flex: '1' }}>
          <div className="sheet-ribbon"><h3>사회적 명망 &amp; 신분 (Standings)</h3></div>
          <div className="cs-section-inner">
            {standingsList.map(s => (
              <div className="cs-passion-row" key={s.key}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span className="cs-passion-name" style={{ fontWeight: 'bold' }}>{s.label}</span>
                    <span className="cs-skill-val">
                      <div className="cs-num-ctrl">
                        <button type="button" className="cs-ctrl-btn" onClick={() => {
                          const val = character?.standings?.[s.key] !== undefined ? character?.standings?.[s.key] : s.base;
                          handleInputChange('standings', s.key, Math.max(0, val - 1));
                        }}>−</button>
                        <input type="number"
                          value={character?.standings?.[s.key] !== undefined ? character?.standings?.[s.key] : s.base}
                          onChange={e => handleInputChange('standings', s.key, parseInt(e.target.value) || 0)} />
                        <button type="button" className="cs-ctrl-btn" onClick={() => {
                          const val = character?.standings?.[s.key] !== undefined ? character?.standings?.[s.key] : s.base;
                          handleInputChange('standings', s.key, val + 1);
                        }}>+</button>
                      </div>
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-grey)', textAlign: 'right', marginTop: '4px' }}>
                    공식 산출 기준: {s.base}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ══════ SKILLS: Common + Courtly (side by side) ══════ */}
      <div className="cs-row">
        <section className="cs-section">
          <div className="sheet-ribbon"><h3>기본 모험 기술</h3></div>
          <div className="cs-section-inner">
            <div className="cs-skill-list">
              {commonSkills.map(s => <SkillRow key={s.key} skill={s} />)}
            </div>
          </div>
        </section>
        <section className="cs-section">
          <div className="sheet-ribbon"><h3>궁정 예법 기술</h3></div>
          <div className="cs-section-inner">
            <div className="cs-skill-list">
              {courtlySkills.map(s => <SkillRow key={s.key} skill={s} />)}
            </div>
          </div>
        </section>
      </div>

      {/* ══════ COMBAT SKILLS + WEAPONS (side by side) ══════ */}
      <div className="cs-row">
        <section className="cs-section">
          <div className="sheet-ribbon"><h3>전투 기술</h3></div>
          <div className="cs-section-inner">
            <div className="cs-skill-list">
              <SkillRow skill={{ key: 'battle', label: '전술 (Battle)' }} />
              <SkillRow skill={{ key: 'siege', label: '공성 (Siege)' }} />
            </div>
          </div>
        </section>
        <section className="cs-section">
          <div className="sheet-ribbon"><h3>무기 기술</h3></div>
          <div className="cs-section-inner">
            <div className="cs-skill-list">
              {weaponSkills.map(s => <SkillRow key={s.key} skill={s} />)}
            </div>
          </div>
        </section>
      </div>


      {/* ══════ SQUIRE + HORSE (side by side) ══════ */}
      <div className="cs-row">
        <section className="cs-section">
          <div className="sheet-ribbon"><h3>종자 (Squire)</h3></div>
          <div className="cs-section-inner">
            <div className="cs-companion-fields">
              <div className="cs-companion-row">
                <div className="cs-companion-field" style={{ flex: '2 1 140px' }}>
                  <label>이름:</label>
                  <input type="text" value={character?.squire?.name || ''}
                    onChange={e => handleInputChange('squire', 'name', e.target.value)} />
                </div>
                <div className="cs-companion-field" style={{ flex: '1 1 80px' }}>
                  <label>나이:</label>
                  <div className="cs-num-ctrl">
                    <button type="button" className="cs-ctrl-btn" onClick={() => handleInputChange('squire', 'age', Math.max(0, (character?.squire?.age || 0) - 1))}>−</button>
                    <input type="number" value={character?.squire?.age || 0}
                      onChange={e => handleInputChange('squire', 'age', parseInt(e.target.value) || 0)} />
                    <button type="button" className="cs-ctrl-btn" onClick={() => handleInputChange('squire', 'age', (character?.squire?.age || 0) + 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="cs-section">
          <div className="sheet-ribbon"><h3>전투마 ({character?.horses?.warhorse?.type || 'Charger'})</h3></div>
          <div className="cs-section-inner">
            <div className="cs-companion-fields">
              <div className="cs-companion-row">
                <div className="cs-companion-field">
                  <label>HP:</label>
                  <div className="cs-num-ctrl">
                    <button type="button" className="cs-ctrl-btn" onClick={() => {
                      const updated = { ...(character?.horses?.warhorse || {}), hp: Math.max(0, (character?.horses?.warhorse?.hp || 0) - 1) };
                      handleInputChange('horses', 'warhorse', updated);
                    }}>−</button>
                    <input type="number" value={character?.horses?.warhorse?.hp || 0}
                      onChange={e => {
                        const updated = { ...(character?.horses?.warhorse || {}), hp: parseInt(e.target.value) || 0 };
                        handleInputChange('horses', 'warhorse', updated);
                      }} />
                    <button type="button" className="cs-ctrl-btn" onClick={() => {
                      const updated = { ...(character?.horses?.warhorse || {}), hp: (character?.horses?.warhorse?.hp || 0) + 1 };
                      handleInputChange('horses', 'warhorse', updated);
                    }}>+</button>
                  </div>
                </div>
                <div className="cs-companion-field">
                  <label>방어:</label>
                  <div className="cs-num-ctrl">
                    <button type="button" className="cs-ctrl-btn" onClick={() => {
                      const updated = { ...(character?.horses?.warhorse || {}), armor: Math.max(0, (character?.horses?.warhorse?.armor || 0) - 1) };
                      handleInputChange('horses', 'warhorse', updated);
                    }}>−</button>
                    <input type="number" value={character?.horses?.warhorse?.armor || 0}
                      onChange={e => {
                        const updated = { ...(character?.horses?.warhorse || {}), armor: parseInt(e.target.value) || 0 };
                        handleInputChange('horses', 'warhorse', updated);
                      }} />
                    <button type="button" className="cs-ctrl-btn" onClick={() => {
                      const updated = { ...(character?.horses?.warhorse || {}), armor: (character?.horses?.warhorse?.armor || 0) + 1 };
                      handleInputChange('horses', 'warhorse', updated);
                    }}>+</button>
                  </div>
                </div>
                <div className="cs-companion-field">
                  <label>피해:</label>
                  <input type="text" value={character?.horses?.warhorse?.damage || ''}
                    onChange={e => {
                      const updated = { ...(character?.horses?.warhorse || {}), damage: e.target.value };
                      handleInputChange('horses', 'warhorse', updated);
                    }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ══════ GEAR & TREASURY ══════ */}
      <section className="cs-section" style={{ marginTop: '16px' }}>
        <div className="sheet-ribbon"><h3>장비 및 금고 (Gear & Treasury)</h3></div>
        <div className="cs-section-inner">

          {/* 시작 장비 복장 패키지 & 가문 탄생 유산 굴리기 (Table 1-14 & 1-15) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px', padding: '12px', borderRadius: '8px', border: '1px dashed var(--color-gold)', backgroundColor: 'rgba(201,168,76,0.03)' }}>

            {/* Table 1-14 Starting Outfit */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.88rem', color: 'var(--color-gold-dark)' }}>시작 복장 설정 (Table 1-14)</span>
                <button type="button" className="btn-medieval" style={{ padding: '3px 8px', fontSize: '0.72rem' }} onClick={rollStartingOutfit}>
                  <Dices size={12} style={{ marginRight: '4px' }} /> 1d6 굴리기
                </button>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--color-grey)', margin: 0 }}>시작 아웃핏 등급에 따른 초기 장비, 의상 및 소지금 설정</p>
              {gearOutfitRollResult && (
                <div style={{ fontSize: '0.8rem', backgroundColor: '#fff', border: '1px dotted var(--color-gold-light)', borderRadius: '4px', padding: '8px', marginTop: '4px' }}>
                  <strong>결과:</strong> {gearOutfitRollResult.desc}<br/>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-royal-blue)', marginTop: '4px' }}>
                    • 소지금: {gearOutfitRollResult.cash}d<br/>
                    • 갑옷: {gearOutfitRollResult.armor}<br/>
                    • 의상: {gearOutfitRollResult.clothing}
                  </div>
                  <button type="button" className="btn-medieval" style={{ padding: '2px 8px', fontSize: '0.7rem', marginTop: '6px', width: '100%', backgroundColor: 'rgba(46,107,51,0.08)', borderColor: '#2e6b33', color: '#2e6b33' }} onClick={applyGearOutfit}>
                    시작 장비 시트에 반영하기
                  </button>
                </div>
              )}
            </div>

            {/* Table 1-15 Frankish Birth Gift */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.88rem', color: 'var(--color-gold-dark)' }}>가문 탄생 유산 굴리기 (Table 1-15)</span>
                <button type="button" className="btn-medieval" style={{ padding: '3px 8px', fontSize: '0.72rem' }} onClick={rollGearBirthGift}>
                  <Dices size={12} style={{ marginRight: '4px' }} /> 1d20 굴리기
                </button>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--color-grey)', margin: 0 }}>조상들로부터 물려받은 특별한 장비 또는 유산 획득</p>
              {gearBirthGiftRollResult && (
                <div style={{ fontSize: '0.8rem', backgroundColor: '#fff', border: '1px dotted var(--color-gold-light)', borderRadius: '4px', padding: '8px', marginTop: '4px' }}>
                  <strong>🎲 굴림값: {gearBirthGiftRollResult.roll}</strong> → {gearBirthGiftRollResult.benefit}<br/>
                  <button type="button" className="btn-medieval" style={{ padding: '2px 8px', fontSize: '0.7rem', marginTop: '6px', width: '100%', backgroundColor: 'rgba(46,107,51,0.08)', borderColor: '#2e6b33', color: '#2e6b33' }} onClick={applyGearBirthGift}>
                    유산/보너스 시트에 반영하기
                  </button>
                </div>
              )}
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '12px' }}>

            {/* Cash */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--color-ink-light)' }}>소지금 (Cash):</label>
              <div className="cs-num-ctrl" style={{ width: '120px', height: '32px', border: '1px solid var(--color-gold-light)', borderRadius: '4px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', padding: '0 4px', gap: '4px' }}>
                <button type="button" style={{ width: '24px', height: '24px', borderRadius: '3px', border: 'none', background: 'var(--color-crimson)', color: '#fff', fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => handleInputChange('gear', 'cash', Math.max(0, (character?.gear?.cash || 0) - 1))}>−</button>
                <input type="number" value={character?.gear?.cash || 0}
                  onChange={e => handleInputChange('gear', 'cash', parseInt(e.target.value) || 0)}
                  style={{ width: '50px', height: '24px', border: 'none', background: 'transparent', textAlign: 'center', fontWeight: 'bold', fontSize: '1rem', outline: 'none' }}
                />
                <button type="button" style={{ width: '24px', height: '24px', borderRadius: '3px', border: 'none', background: 'var(--color-crimson)', color: '#fff', fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => handleInputChange('gear', 'cash', (character?.gear?.cash || 0) + 1)}>+</button>
              </div>
            </div>

            {/* Armor & Shield */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--color-ink-light)' }}>갑옷 및 방패 (Armor & Shield):</label>
              <input type="text" value={character?.gear?.armorShield || ''}
                onChange={e => handleInputChange('gear', 'armorShield', e.target.value)}
                placeholder="예: 사슬갑옷 (10점) + 방패 (+3)"
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  fontSize: '0.9rem',
                  borderRadius: '4px',
                  border: '1px solid var(--color-gold-light)',
                  backgroundColor: '#faf6eb',
                  color: 'var(--color-ink)',
                  outline: 'none'
                }}
              />
            </div>

            {/* Clothing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--color-ink-light)' }}>의상 (Clothing):</label>
              <input type="text" value={character?.gear?.clothing || ''}
                onChange={e => handleInputChange('gear', 'clothing', e.target.value)}
                placeholder="예: £2 상당의 궁정 튜닉"
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  fontSize: '0.9rem',
                  borderRadius: '4px',
                  border: '1px solid var(--color-gold-light)',
                  backgroundColor: '#faf6eb',
                  color: 'var(--color-ink)',
                  outline: 'none'
                }}
              />
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--color-ink-light)' }}>개인 소지품 (Personal Gear):</label>
              <textarea
                value={character?.gear?.personalGear || ''}
                onChange={e => handleInputChange('gear', 'personalGear', e.target.value)}
                placeholder="예: 나무 십자가, 숫돌, 리넨 천 뭉치"
                style={{
                  width: '100%',
                  minHeight: '80px',
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  border: '1px solid var(--color-gold-light)',
                  borderRadius: '4px',
                  padding: '8px',
                  fontFamily: 'inherit',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--color-ink-light)' }}>영지 소유물 (Home Possessions):</label>
              <textarea
                value={character?.gear?.homePossessions || ''}
                onChange={e => handleInputChange('gear', 'homePossessions', e.target.value)}
                placeholder="예: 곡물 상자, 여분의 검 두 자루, 조상의 태피스트리"
                style={{
                  width: '100%',
                  minHeight: '80px',
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  border: '1px solid var(--color-gold-light)',
                  borderRadius: '4px',
                  padding: '8px',
                  fontFamily: 'inherit',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FAMILY CHARACTER SHEET (p.28-31) ══════ */}
      <section className="cs-section" style={{ marginTop: '16px', border: '2px solid var(--color-gold)' }}>
        <div className="sheet-ribbon" style={{ backgroundColor: 'var(--color-crimson)' }}>
          <h3>🏰 가문 캐릭터 시트 (Family Character Sheet, p.28-31)</h3>
        </div>
        <div className="cs-section-inner" style={{ backgroundColor: 'rgba(250, 246, 235, 0.4)' }}>

          {/* 가문 기본 정보 */}
          <div className="cs-field-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px 20px', marginBottom: '16px' }}>
            <div className="cs-field">
              <span className="cs-field-label">가문 성씨 (Family Name):</span>
              <input type="text" value={character?.family?.name || ''}
                onChange={e => handleFamilyChange('name', e.target.value)} placeholder="예: 아르덴 (Ardennes)" />
            </div>
            <div className="cs-field">
              <span className="cs-field-label">가문 시조 (Ancestor Founder):</span>
              <input type="text" value={character?.family?.ancestor || ''}
                onChange={e => handleFamilyChange('ancestor', e.target.value)} placeholder="예: 알베르 경 (Sir Albert)" />
            </div>
            <div className="cs-field">
              <span className="cs-field-label">고향 영지 (Home County):</span>
              <input type="text" value={character?.family?.homeCountry || ''}
                onChange={e => handleFamilyChange('homeCountry', e.target.value)} placeholder="예: 아키텐 (Aquitaine)" />
            </div>

            {/* Family Honor (2d6+3) */}
            <div className="cs-field" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                <span className="cs-field-label">가문 고유 명예 (Family Honor):</span>
                <button type="button" className="btn-medieval" style={{ padding: '2px 6px', fontSize: '0.7rem' }} onClick={rollSheetHonor}>
                  <Dices size={10} style={{ marginRight: '2px' }} /> 2d6+3 굴리기
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="number" value={character?.family?.honor || 0}
                  onChange={e => handleFamilyChange('honor', parseInt(e.target.value) || 0)} style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }} />
                {sheetHonorRollResult && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-royal-blue)', fontWeight: 'bold' }}>
                    🎲 2d6:[{sheetHonorRollResult.rolls.join('+')}] +3 = {sheetHonorRollResult.val}
                  </span>
                )}
              </div>
            </div>

            {/* Motto & Battle Cry (Full Width) */}
            <div className="cs-field" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
              <span className="cs-field-label">가언/신조 (Motto):</span>
              <input type="text" value={character?.family?.motto || ''}
                onChange={e => handleFamilyChange('motto', e.target.value)} placeholder="예: Amore non timore (사랑으로, 두려움 없이)" />
            </div>
            <div className="cs-field" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
              <span className="cs-field-label">전투 함성 (Battle Cry):</span>
              <input type="text" value={character?.family?.battleCry || ''}
                onChange={e => handleFamilyChange('battleCry', e.target.value)} placeholder="예: 몽주아! (Monjoie!)" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>

            {/* ⛪ 가문 수호 성인 설정 (Table 1-3) */}
            <div style={{ border: '1.2px solid var(--color-gold)', borderRadius: '8px', padding: '14px', backgroundColor: 'rgba(255,255,255,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid var(--color-gold-light)', paddingBottom: '6px', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-gold-dark)' }}>⛪ 가문 수호 성인 설정 (Table 1-3)</span>
                <div style={{ display: 'flex', gap: '4px', backgroundColor: 'rgba(0,0,0,0.04)', padding: '2px', borderRadius: '6px' }}>
                  <button type="button"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.74rem',
                      border: 'none',
                      borderRadius: '4px',
                      background: sheetSaintMode === 'select' ? '#fff' : 'none',
                      color: sheetSaintMode === 'select' ? 'var(--color-gold-dark)' : 'var(--color-ink-light)',
                      fontWeight: sheetSaintMode === 'select' ? 'bold' : 'normal',
                      boxShadow: sheetSaintMode === 'select' ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSheetSaintMode('select')}
                  >선택</button>
                  <button type="button"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.74rem',
                      border: 'none',
                      borderRadius: '4px',
                      background: sheetSaintMode === 'roll' ? '#fff' : 'none',
                      color: sheetSaintMode === 'roll' ? 'var(--color-gold-dark)' : 'var(--color-ink-light)',
                      fontWeight: sheetSaintMode === 'roll' ? 'bold' : 'normal',
                      boxShadow: sheetSaintMode === 'roll' ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSheetSaintMode('roll')}
                  >굴리기</button>
                </div>
              </div>

              {sheetSaintMode === 'select' ? (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <select
                    style={{ flex: 1, padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--color-gold-light)', fontSize: '0.85rem' }}
                    value={patronSaints.findIndex(s => s.name === character?.family?.patronSaint)}
                    onChange={e => {
                      const idx = parseInt(e.target.value);
                      if (idx >= 0 && idx < patronSaints.length) {
                        applySheetSaint(patronSaints[idx]);
                      }
                    }}
                  >
                    <option value={-1}>-- 수호 성인 선택 --</option>
                    {patronSaints.map((saint, idx) => (
                      <option key={idx} value={idx}>{idx + 1}. {saint.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="number" min={1} max={20} placeholder="d20" value={sheetSaintRoll} onChange={e => setSheetSaintRoll(e.target.value)}
                    style={{ width: '60px', padding: '6px', textAlign: 'center', fontWeight: 'bold', border: '1px solid var(--color-gold-light)', borderRadius: '4px' }} />
                  <button type="button" className="btn-medieval" onClick={() => {
                    let d20 = parseInt(sheetSaintRoll);
                    if (isNaN(d20) || d20 < 1 || d20 > 20) d20 = Math.floor(Math.random() * 20) + 1;
                    applySheetSaint(patronSaints[d20 - 1], d20);
                  }}>🎲 d20 굴림</button>
                </div>
              )}

              {character?.family?.patronSaint && (
                <div style={{ marginTop: '10px', backgroundColor: '#faf6eb', border: '1px dashed var(--color-gold)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--color-gold-dark)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>⛪ {character.family?.patronSaint}</span>
                    {sheetSaintResult && <span style={{ color: 'var(--color-grey)' }}>🎲 굴림값: {sheetSaintResult.roll}</span>}
                  </div>
                  {(() => {
                    const saint = patronSaints.find(s => s.name === character.family?.patronSaint);
                    if (!saint) return null;
                    return (
                      <div style={{ marginTop: '4px', lineHeight: '1.4' }}>
                        <div><strong>수호 분야:</strong> {saint.patronage}</div>
                        <div style={{ color: 'var(--color-royal-blue)' }}><strong>가호 효과:</strong> {saint.benefit}</div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* ⚔️ 가문 특징 설정 (Table 1-1) */}
            <div style={{ border: '1.2px solid var(--color-gold)', borderRadius: '8px', padding: '14px', backgroundColor: 'rgba(255,255,255,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid var(--color-gold-light)', paddingBottom: '6px', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-gold-dark)' }}>⚔️ 가문 특징 설정 (Table 1-1)</span>
                <div style={{ display: 'flex', gap: '4px', backgroundColor: 'rgba(0,0,0,0.04)', padding: '2px', borderRadius: '6px' }}>
                  <button type="button"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.74rem',
                      border: 'none',
                      borderRadius: '4px',
                      background: sheetCharMode === 'select' ? '#fff' : 'none',
                      color: sheetCharMode === 'select' ? 'var(--color-gold-dark)' : 'var(--color-ink-light)',
                      fontWeight: sheetCharMode === 'select' ? 'bold' : 'normal',
                      boxShadow: sheetCharMode === 'select' ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSheetCharMode('select')}
                  >선택</button>
                  <button type="button"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.74rem',
                      border: 'none',
                      borderRadius: '4px',
                      background: sheetCharMode === 'roll' ? '#fff' : 'none',
                      color: sheetCharMode === 'roll' ? 'var(--color-gold-dark)' : 'var(--color-ink-light)',
                      fontWeight: sheetCharMode === 'roll' ? 'bold' : 'normal',
                      boxShadow: sheetCharMode === 'roll' ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSheetCharMode('roll')}
                  >굴리기</button>
                </div>
              </div>

              {sheetCharMode === 'select' ? (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <select
                    style={{ flex: 1, padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--color-gold-light)', fontSize: '0.85rem' }}
                    value={familyCharacteristics.findIndex(c => c.name === character?.family?.characteristic?.name)}
                    onChange={e => {
                      const idx = parseInt(e.target.value);
                      if (idx >= 0 && idx < familyCharacteristics.length) {
                        applySheetChar(familyCharacteristics[idx]);
                      }
                    }}
                  >
                    <option value={-1}>-- 가문 특징 선택 --</option>
                    {familyCharacteristics.map((char, idx) => (
                      <option key={idx} value={idx}>{idx + 1}. {char.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="number" min={1} max={20} placeholder="d20" value={sheetCharRoll} onChange={e => setSheetCharRoll(e.target.value)}
                    style={{ width: '60px', padding: '6px', textAlign: 'center', fontWeight: 'bold', border: '1px solid var(--color-gold-light)', borderRadius: '4px' }} />
                  <button type="button" className="btn-medieval" onClick={() => {
                    let d20 = parseInt(sheetCharRoll);
                    if (isNaN(d20) || d20 < 1 || d20 > 20) d20 = Math.floor(Math.random() * 20) + 1;
                    applySheetChar(familyCharacteristics[d20 - 1], d20);
                  }}>🎲 d20 굴림</button>
                </div>
              )}

              {character?.family?.characteristic?.name && (
                <div style={{ marginTop: '10px', backgroundColor: '#faf6eb', border: '1px dashed var(--color-gold)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--color-gold-dark)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>⚔️ {character.family?.characteristic?.name}</span>
                    {sheetCharResult && <span style={{ color: 'var(--color-grey)' }}>🎲 굴림값: {sheetCharResult.roll}</span>}
                  </div>
                  <div style={{ marginTop: '4px', color: 'var(--color-royal-blue)' }}>
                    <strong>효과:</strong> {character.family?.characteristic?.bonusText}
                  </div>
                </div>
              )}
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>

            {/* 📊 가문 평판 설정 (Family Standings, 2d6) */}
            <div className="cs-section-flat" style={{ border: 'none', borderBottom: '1px solid var(--color-gold-light)', padding: '14px 0', backgroundColor: 'transparent' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid var(--color-gold-light)', paddingBottom: '6px', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-gold-dark)' }}>📊 가문 평판 설정 (2d6, p.30)</span>
                <div style={{ display: 'flex', gap: '4px', backgroundColor: 'rgba(0,0,0,0.04)', padding: '2px', borderRadius: '6px' }}>
                  <button type="button"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.74rem',
                      border: 'none',
                      borderRadius: '4px',
                      background: sheetStandingsMode === 'manual' ? '#fff' : 'none',
                      color: sheetStandingsMode === 'manual' ? 'var(--color-gold-dark)' : 'var(--color-ink-light)',
                      fontWeight: sheetStandingsMode === 'manual' ? 'bold' : 'normal',
                      boxShadow: sheetStandingsMode === 'manual' ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSheetStandingsMode('manual')}
                  >직접 입력</button>
                  <button type="button"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.74rem',
                      border: 'none',
                      borderRadius: '4px',
                      background: sheetStandingsMode === 'roll' ? '#fff' : 'none',
                      color: sheetStandingsMode === 'roll' ? 'var(--color-gold-dark)' : 'var(--color-ink-light)',
                      fontWeight: sheetStandingsMode === 'roll' ? 'bold' : 'normal',
                      boxShadow: sheetStandingsMode === 'roll' ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSheetStandingsMode('roll')}
                  >굴리기</button>
                </div>
              </div>

              {sheetStandingsMode === 'roll' && (
                <div style={{ marginBottom: '10px' }}>
                  <button type="button" className="btn-medieval" onClick={rollSheetStandings}>🎲 평판 2d6 주사위 굴리기</button>
                  {sheetStandingsRollResults && (
                    <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--color-royal-blue)', backgroundColor: 'white', padding: '6px', borderRadius: '4px', border: '1px dotted var(--color-border)' }}>
                      👑 대제: <strong>2d6: [{sheetStandingsRollResults.charlemagne.rolls.join('+')}]</strong> → {sheetStandingsRollResults.charlemagne.val}<br />
                      ⛪ 교회: <strong>2d6: [{sheetStandingsRollResults.church.rolls.join('+')}]</strong> → {sheetStandingsRollResults.church.val}<br />
                      🚜 평민: <strong>2d6: [{sheetStandingsRollResults.commoners.rolls.join('+')}]</strong> → {sheetStandingsRollResults.commoners.val}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-ink)' }}>👑 대제 평판 (Charlemagne):</span>
                  <input type="number" value={character?.family?.standingCharlemagne || 0} onChange={e => handleFamilyChange('standingCharlemagne', parseInt(e.target.value) || 0)} style={{ width: '60px', textAlign: 'center' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-ink)' }}>⛪ 교회 평판 (Church):</span>
                  <input type="number" value={character?.family?.standingChurch || 0} onChange={e => handleFamilyChange('standingChurch', parseInt(e.target.value) || 0)} style={{ width: '60px', textAlign: 'center' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-ink)' }}>🚜 평민 평판 (Commoners):</span>
                  <input type="number" value={character?.family?.standingCommoners || 0} onChange={e => handleFamilyChange('standingCommoners', parseInt(e.target.value) || 0)} style={{ width: '60px', textAlign: 'center' }} />
                </div>
              </div>
            </div>

            {/* 🛡️ 가문의 군역 설정 (Family Muster, p.28) */}
            <div className="cs-section-flat" style={{ border: 'none', borderBottom: '1px solid var(--color-gold-light)', padding: '14px 0', backgroundColor: 'transparent' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid var(--color-gold-light)', paddingBottom: '6px', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-gold-dark)' }}>🛡️ 가문의 군역 (Muster, p.28)</span>
                <div style={{ display: 'flex', gap: '4px', backgroundColor: 'rgba(0,0,0,0.04)', padding: '2px', borderRadius: '6px' }}>
                  <button type="button"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.74rem',
                      border: 'none',
                      borderRadius: '4px',
                      background: sheetMusterMode === 'manual' ? '#fff' : 'none',
                      color: sheetMusterMode === 'manual' ? 'var(--color-gold-dark)' : 'var(--color-ink-light)',
                      fontWeight: sheetMusterMode === 'manual' ? 'bold' : 'normal',
                      boxShadow: sheetMusterMode === 'manual' ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSheetMusterMode('manual')}
                  >직접 입력</button>
                  <button type="button"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.74rem',
                      border: 'none',
                      borderRadius: '4px',
                      background: sheetMusterMode === 'roll' ? '#fff' : 'none',
                      color: sheetMusterMode === 'roll' ? 'var(--color-gold-dark)' : 'var(--color-ink-light)',
                      fontWeight: sheetMusterMode === 'roll' ? 'bold' : 'normal',
                      boxShadow: sheetMusterMode === 'roll' ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSheetMusterMode('roll')}
                  >굴리기</button>
                </div>
              </div>

              {sheetMusterMode === 'roll' && (
                <div style={{ marginBottom: '10px' }}>
                  <button type="button" className="btn-medieval" onClick={rollSheetMuster}>🎲 군역 다이스 굴리기</button>
                  {sheetMusterRollResults && (
                    <div style={{ marginTop: '8px', fontSize: '0.74rem', color: 'var(--color-royal-blue)', backgroundColor: 'white', padding: '6px', borderRadius: '4px', border: '1px dotted var(--color-border)' }}>
                      👴 노년 (1d6-5): <strong>d6:[{sheetMusterRollResults.old.roll}]</strong> → {sheetMusterRollResults.old.val}명<br />
                      ⚔️ 장년 (1d6-2): <strong>d6:[{sheetMusterRollResults.middle.roll}]</strong> → {sheetMusterRollResults.middle.val}명<br />
                      🛡️ 청년 (1d6+1): <strong>d6:[{sheetMusterRollResults.young.roll}]+1</strong> → {sheetMusterRollResults.young.val}명<br />
                      🏹 보병 (3d6+5): <strong>3d6:[{sheetMusterRollResults.lineage.rolls.join('+')}]+5</strong> → {sheetMusterRollResults.lineage.val}명
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem' }}>노년 기사:</span>
                  <input type="number" value={character?.family?.oldKnights || 0} onChange={e => handleFamilyChange('oldKnights', parseInt(e.target.value) || 0)} style={{ width: '45px', textAlign: 'center' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem' }}>장년 기사:</span>
                  <input type="number" value={character?.family?.middleKnights || 0} onChange={e => handleFamilyChange('middleKnights', parseInt(e.target.value) || 0)} style={{ width: '45px', textAlign: 'center' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem' }}>청년 기사:</span>
                  <input type="number" value={character?.family?.youngKnights || 0} onChange={e => handleFamilyChange('youngKnights', parseInt(e.target.value) || 0)} style={{ width: '45px', textAlign: 'center' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem' }}>친족 보병:</span>
                  <input type="number" value={character?.family?.lineageMen || 0} onChange={e => handleFamilyChange('lineageMen', parseInt(e.target.value) || 0)} style={{ width: '45px', textAlign: 'center' }} />
                </div>
              </div>
            </div>

          </div>

          {/* Directed Traits & Passions */}
          <div style={{ border: '1.2px solid var(--color-gold)', borderRadius: '8px', padding: '14px', backgroundColor: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-gold-dark)', display: 'block', borderBottom: '1.5px solid var(--color-gold-light)', paddingBottom: '4px', marginBottom: '10px' }}>
              🎭 가문 고유 성향 및 열망 (Directed Traits & Passions, p.30)
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div className="cs-field" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <span className="cs-field-label">🛡️ 가문 지향성 성향 (Directed Traits):</span>
                <input type="text" value={character?.family?.directedTraits || ''} onChange={e => handleFamilyChange('directedTraits', e.target.value)} placeholder="예: 색슨족 혐오 (Hate Saxons) +3" />
              </div>
              <div className="cs-field" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <span className="cs-field-label">💖 가문 고유 열망 (Family Passions):</span>
                <input type="text" value={character?.family?.directedPassions || ''} onChange={e => handleFamilyChange('directedPassions', e.target.value)} placeholder="예: 마옌스 가문 적대 (Hate Mayence) 12" />
              </div>
            </div>
          </div>

          {/* Allies & Enemies */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '28px', marginBottom: '4px' }}>
                <label style={{ fontWeight: 'bold' }}>우방 동맹 가문 (Allies, p.30):</label>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-grey)', margin: '0 0 6px 0', lineHeight: '1.3' }}>
                * 가문의 친구 및 먼 일족입니다. 도움 요청 시 <strong>Love [Family] -10</strong> 굴림에 성공해야 합니다.
              </p>
              <textarea rows={3} value={character?.family?.allies || ''} onChange={e => handleFamilyChange('allies', e.target.value)}
                placeholder="동맹 가문들과 그 관계를 적어두세요." style={{ width: '100%', resize: 'vertical', fontSize: '0.85rem', padding: '8px', minHeight: '80px', border: '1px solid var(--color-gold-light)', borderRadius: '4px' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '28px', marginBottom: '4px' }}>
                <label style={{ fontWeight: 'bold' }}>적대 대립 가문 (Enemies, p.30):</label>
                <button type="button" className="btn-medieval" style={{ padding: '2px 6px', fontSize: '0.7rem' }} onClick={rollSheetEnemyHate}>
                  <Dices size={10} style={{ marginRight: '2px' }} /> 증오(Hate) 2d6+3 굴리기
                </button>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-grey)', margin: '0 0 6px 0', lineHeight: '1.3' }}>
                * 대립 가문입니다. 각 적대 가문별 <strong>증오(Hate) 열망 수치는 2d6+3</strong>으로 결정됩니다.
              </p>
              <textarea rows={3} value={character?.family?.enemies || ''} onChange={e => handleFamilyChange('enemies', e.target.value)}
                placeholder="적대 가문 이름 및 갈등 요인을 적어두세요." style={{ width: '100%', resize: 'vertical', fontSize: '0.85rem', padding: '8px', minHeight: '80px', border: '1px solid var(--color-gold-light)', borderRadius: '4px' }} />
              {sheetEnemyHateRollResult && (
                <div style={{ marginTop: '6px', fontSize: '0.78rem', color: 'var(--color-danger)', fontWeight: 'bold', backgroundColor: 'white', padding: '4px 8px', borderRadius: '4px', border: '1px dotted var(--color-danger)' }}>
                  🎲 증오 판정 굴림: 2d6:[{sheetEnemyHateRollResult.rolls.join('+')}] +3 = {sheetEnemyHateRollResult.val}점 (Hate [Family Enemy])
                </div>
              )}
            </div>
          </div>

          {/* Notable Members & History */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 'bold', marginBottom: '4px' }}>명망 있는 가문원 &amp; 가문 역사 (Notable Members &amp; History, p.30):</label>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-grey)', margin: '0 0 6px 0', lineHeight: '1.3' }}>
              * 백작, 공작, 주교, 성직자 등 가문의 명성을 빛낸 중요 위인들의 이름과 주요 업적, 가문 역사를 기록하는 칸입니다.
            </p>
            <textarea rows={3} value={character?.family?.notableMembers || ''} onChange={e => handleFamilyChange('notableMembers', e.target.value)}
              placeholder="예: 공작 알베르 2세, 수도원장 장 등 명망 높은 가문원 목록과 대소사를 적어주세요." style={{ width: '100%', resize: 'vertical', fontSize: '0.85rem', padding: '8px', minHeight: '80px', border: '1px solid var(--color-gold-light)', borderRadius: '4px' }} />
          </div>

        </div>
      </section>

    </div>
  );
}

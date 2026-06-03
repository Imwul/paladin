import React, { useState } from 'react';
import { Sparkles, Dices, RefreshCw, Check } from 'lucide-react';

const patronSaints = [
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
  { name: "전장의 지배자 (Master tacticians)", benefit: "+5 전술 & 공성", apply: (char) => { char.skills.battle = (char.skills.battle || 0) + 5; char.skills.siege = (char.skills.siege || 0) + 5; } }
];

const fathersClasses = [
  { name: "봉신 기사 (Vassal Knight)", benefit: "+14 기술 포인트, 명예 250", skillsAdd: 14, glory: 250 },
  { name: "기치 기사 (Banneret Knight)", benefit: "+16 기술 포인트, 명예 300", skillsAdd: 16, glory: 300 },
  { name: "독신 기사 (Bachelor Knight)", benefit: "+12 기술 포인트, 명예 200", skillsAdd: 12, glory: 200 },
  { name: "용병 기사 (Mercenary Knight)", benefit: "+10 기술 포인트, 검/둔기 +3, 명예 100", skillsAdd: 10, bonusWeapon: 3, glory: 100 },
  { name: "영주/지방관 기사 (Lord or Officer)", benefit: "+18 기술 포인트, 명예 500", skillsAdd: 18, glory: 500 }
];

const birthGiftsTable = [
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
      passions: { loyaltyLiege: 15, loveFamily: 15, hospitality: 15, honor: 16, hateSarasens: 12, loveGod: 15 },
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
      passions: { loyaltyLiege: 15, loveFamily: 15, hospitality: 16, honor: 17, hateSarasens: 12, loveGod: 15 },
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
      passions: { loyaltyLiege: 15, loveFamily: 15, hospitality: 15, honor: 16, hateSarasens: 12, loveGod: 17 },
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
      passions: { loyaltyLiege: 14, loveFamily: 15, hospitality: 12, honor: 15, hateSarasens: 15, loveGod: 11 },
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
  { key: 'sonNumber', label: '자녀 서열', cat: 'personal' },
  { key: 'blessing', label: '성스러운 축복', cat: 'personal' },
  { key: 'homeland', label: '고향/출신지', cat: 'personal' },
  { key: 'home', label: '영지/거처', cat: 'personal' },
  { key: 'culture', label: '문화권', cat: 'personal' },
  { key: 'lineage', label: '가문/혈통', cat: 'personal' },
  { key: 'liegeLord', label: '섬기는 주군', cat: 'personal' },
  { key: 'fathersClass', label: '부친의 신분', cat: 'personal' },
  { key: 'personalClass', label: '현재 신분', cat: 'personal' },
];

const passions = [
  { key: "loyaltyLiege", label: "주군에 대한 충성 (Loyalty)", defaultVal: 15 },
  { key: "loveFamily", label: "가족에 대한 사랑 (Love Family)", defaultVal: 15 },
  { key: "hospitality", label: "손대접 및 환대 (Hospitality)", defaultVal: 15 },
  { key: "honor", label: "기사의 명예 (Honor)", defaultVal: 16 },
  { key: "hateSarasens", label: "이교도에 대한 증오 (Hate Saracens)", defaultVal: 12 },
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
  return 14; // 20: Player's choice (default to Tacticians)
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

export default function CharacterSheet({ character, setCharacter }) {
  const [isGenOpen, setIsGenOpen] = useState(false);
  const [genActiveTab, setGenActiveTab] = useState('preset'); // 'preset' or 'custom'
  const [selectedPreset, setSelectedPreset] = useState(0);

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
    const roll3d6 = () => Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 3;
    const roll2d6Plus6 = () => Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 8;
    const rollD20 = () => Math.floor(Math.random() * 20) + 1;

    setCustomStr(roll3d6());
    setCustomDex(roll3d6());
    setCustomApp(roll3d6());
    setCustomSiz(roll2d6Plus6());
    setCustomCon(roll2d6Plus6());
    
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
    setCharacter(prev => {
      return {
        ...prev,
        personal: {
          ...prev.personal,
          ...preset.stats.personal
        },
        attributes: {
          ...prev.attributes,
          ...preset.stats.attributes
        },
        traits: {
          ...prev.traits,
          ...preset.stats.traits
        },
        skills: {
          ...prev.skills,
          ...preset.stats.skills
        },
        passions: {
          ...prev.passions,
          ...preset.stats.passions
        },
        standings: {
          ...prev.standings,
          ...preset.stats.standings
        }
      };
    });
    setIsGenOpen(false);
    alert(`${preset.name} 프리셋이 성공적으로 시트에 적용되었습니다!`);
  };

  const handleApplyCustom = () => {
    const newChar = JSON.parse(JSON.stringify(character || {}));
    const finalCustomName = getTitleByNameAndClass(customNameKo, customNameEn, "종자 (Squire)");
    
    newChar.personal = {
      ...newChar.personal,
      name: finalCustomName,
      age: 18,
      sonNumber: "첫째",
      blessing: customBlessing || "가문의 축복",
      homeland: "아르덴 (Ardennes)",
      home: "바스토뉴 (Bastogne)",
      culture: "프랑크 (Frankish)",
      lineage: "아르덴 (Ardennes)",
      liegeLord: "티ಎ리 공작 (Duke Thierry)",
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
      hateSarasens: 12,
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

    const father = fathersClasses[customFatherIndex];
    if (father.skillsAdd) {
      newChar.skills.sword += Math.floor(father.skillsAdd / 2);
      newChar.skills.lance += Math.ceil(father.skillsAdd / 2);
    }
    if (father.bonusWeapon) {
      newChar.skills.sword += father.bonusWeapon;
      newChar.skills.bludgeon += father.bonusWeapon;
      newChar.traits.merciful = Math.max(0, newChar.traits.merciful - 3);
      newChar.traits.cruel = 20 - newChar.traits.merciful;
    }
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

      {/* ══════ DISTINCTIVE FEATURES ══════ */}
      <section className="cs-section">
        <div className="sheet-ribbon"><h3>외형적 특징</h3></div>
        <div className="cs-section-inner">
          <div className="cs-feature-list">
            {[0, 1, 2].map(i => (
              <input key={i} type="text"
                value={character?.personal?.features?.[i] || ''}
                onChange={e => {
                  const arr = [...(character?.personal?.features || ['', '', ''])];
                  arr[i] = e.target.value;
                  handleInputChange('personal', 'features', arr);
                }}
                placeholder={['1. 예: 왼쪽 뺨의 흉터', '2. 예: 날카로운 벽안', '3. 예: 크고 날씬한 체형'][i]} />
            ))}
          </div>
        </div>
      </section>

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
          <div className="sheet-ribbon"><h3>전투마 (Charger)</h3></div>
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

    </div>
  );
}

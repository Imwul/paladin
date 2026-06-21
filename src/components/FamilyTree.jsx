import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Heart, Plus, Trash2, Edit, Crown, UserPlus, X, RefreshCw, Info, Calendar, Skull, Dices, Check, Shield, Award, ChevronLeft, ChevronRight, Sparkles, RotateCcw, Compass } from 'lucide-react';
import { maleNames, femaleNames, frankishMalePrefixes, frankishMaleSuffixes, frankishFemalePrefixes, frankishFemaleSuffixes } from '../data/names';
import { getCharacteristicDetails, SKILL_TRANSLATIONS } from '../data/characteristics';
import { birthGiftsTable, patronSaints } from './CharacterSheet';
import { applyOnce, hasAppliedEvent, sanitizeCampaignState } from '../utils/campaignState';

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

  // Remove common titles to get raw name
  const cleanKo = koPart.replace(/\s*(경|남작|백작|공작|영주|부인|종자)$/, '').trim();
  const cleanEn = enPart.replace(/^(Sir|Baron|Count|Earl|Duke|Lord|Lady)\s+/i, '').trim();

  return { ko: cleanKo, en: cleanEn };
};

const getGender = (member) => {
  if (member.gender) return member.gender;
  const rel = member.relation || '';
  const name = member.name || '';
  const mClass = member.memberClass || '';
  if (
    rel.includes('모친') || 
    rel.includes('부인') || 
    rel.includes('딸') || 
    rel.includes('여동생') || 
    rel.includes('누나') || 
    rel.includes('조모') ||
    name.includes('부인') || 
    name.includes('Lady') || 
    mClass.includes('부인') || 
    mClass.includes('Lady')
  ) {
    return 'female';
  }
  return 'male';
};

const getBirthYearFromLifeYears = (lifeYears) => {
  if (!lifeYears) return 9999;
  const match = String(lifeYears).match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 9999;
};

const areTreeLinesEqual = (prevLines, nextLines) => {
  if (prevLines.length !== nextLines.length) return false;
  return prevLines.every((line, index) => {
    const next = nextLines[index];
    return line.id === next.id && line.type === next.type && line.path === next.path;
  });
};

const resolveMemberCharacteristic = (member, allMembers, globalFamilyChar) => {
  if (member.familyCharacteristic) {
    return member.familyCharacteristic;
  }

  const memberGender = member.gender || getGender(member);

  if (!member.parentId) {
    if (memberGender === 'male' && globalFamilyChar) {
      return globalFamilyChar;
    }
    return null;
  }

  const parent = allMembers.find(m => m.id === member.parentId);
  if (!parent) {
    if (memberGender === 'male' && globalFamilyChar) {
      return globalFamilyChar;
    }
    return null;
  }

  const parentGender = parent.gender || getGender(parent);

  if (memberGender === 'female') {
    let mother = null;
    if (parentGender === 'female') {
      mother = parent;
    } else {
      mother = allMembers.find(m => m.id === parent.spouseId || m.spouseId === parent.id);
    }

    if (mother) {
      return resolveMemberCharacteristic(mother, allMembers, globalFamilyChar);
    }
  } else {
    let father = null;
    if (parentGender === 'male') {
      father = parent;
    } else {
      father = allMembers.find(m => m.id === parent.spouseId || m.spouseId === parent.id);
    }

    if (father) {
      return resolveMemberCharacteristic(father, allMembers, globalFamilyChar);
    }
    
    if (globalFamilyChar) {
      return globalFamilyChar;
    }
  }

  return null;
};

const medievalDeathCauses = [
  '노환 (Old Age)', '역병 (Plague)', '전투 중 전사 (Killed in Battle)', 
  '상처 감염 (Wound Infection)', '마상창시합 사고 (Jousting Accident)', 
  '낙마 사고 (Riding Accident)', '사냥 사고 (Hunting Accident)', 
  '폐렴 (Pneumonia)', '심장마비 (Heart Attack)', '독살 의혹 (Suspected Poisoning)'
];

const generateRandomName = (gender) => {
  const isFrankish = Math.random() < 0.5;
  if (!isFrankish) {
    const pool = gender === 'male' ? maleNames : femaleNames;
    const selected = pool[Math.floor(Math.random() * pool.length)];
    if (selected) {
      return selected;
    }
  }
  
  const prefixes = gender === 'male' ? frankishMalePrefixes : frankishFemalePrefixes;
  const suffixes = gender === 'male' ? frankishMaleSuffixes : frankishFemaleSuffixes;
  const randPre = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randSuf = suffixes[Math.floor(Math.random() * suffixes.length)];

  const cleanPre = randPre.split('/')[0].replace('(', '').replace(')', '').replace('-', '');
  const cleanSuf = randSuf.split('/')[0].replace('(', '').replace(')', '').replace('-', '');

  const fullNameEN = cleanPre + cleanSuf;
  const capitalizedEN = fullNameEN.charAt(0).toUpperCase() + fullNameEN.slice(1).toLowerCase();

  const preKoMap = {
    Adal: '아달', Amal: '아말', Agil: '아길', Ag: '아그', Ald: '알드', Alb: '알브', And: '안드', Ans: '안스',
    Angil: '앙질', Arbo: '아르보', Arn: '아르노', Aud: '오드', Aut: '오', Bald: '발드', Baud: '보',
    Bern: '베른', Bert: '베르', Brun: '브륀', Char: '샤를', Gar: '가르', Chil: '실', Chlo: '클로',
    Dag: '다그', Ever: '에베르', Erle: '에를레', Megin: '메진', Fara: '파라', Floris: '플로리스',
    Fred: '프레드', Frid: '프리드', Foul: '풀', Fulc: '풀크', Geno: '제노', Ger: '제르', Geld: '겔드',
    Gond: '공', Gund: '군드', Grim: '그림', Guerim: '게랭', Had: '하드', Hard: '하르드', Hegi: '헤지',
    Her: '헤르', Heil: '하일', Heim: '하임', Hugo: '위고', Huno: '위노', Ingo: '인고', Irmin: '이르민',
    Isem: '이젬', Lam: '람', Land: '랑드', Lud: '뤼드', Madal: '마달', Magin: '마쟁', Marc: '마르크',
    Mero: '메로', Nort: '노르', Raban: '라반', Rade: '라드', Ragno: '라뇨', Ragin: '라쟁', Rein: '랭',
    Rich: '리슈', Rudo: '뤼도', Sig: '지그', Swind: '스윈드', Theod: '테오드', Thiad: '티아드',
    Thurin: '튀랭', Walde: '발데', Warin: '와랭', Wido: '위도', Wulf: '울프',
    Ad: '아드', Bas: '바지', Chrot: '크로', Dhuo: '듀오', Flor: '플로르', Fleur: '플뢰르', Folch: '폴슈',
    Gise: '지젤', Hersi: '에르지', Hilde: '힐데', Inge: '인게', Mat: '마트', Mar: '마르', Nant: '낭', Rol: '롤', Theo: '테오'
  };

  const sufKoMap = {
    atus: '아투스', bert: '베르', bard: '바르', bold: '보', obald: '보', baud: '보', bern: '베르',
    brand: '브랑', char: '샤르', gar: '가르', ger: '지에', cor: '코르', drad: '드라', don: '동',
    dio: '디오', duin: '댕', elin: '랭', eric: '리', oric: '리', fried: '프리드', fred: '프레드',
    froid: '프루아', gand: '강', gang: '강', gaud: '고', gast: '가스트', grim: '그림', hard: '하르드',
    hart: '하르트', helm: '엘름', er: '에', hair: '에르', ing: '앵', land: '랑', lant: '랑',
    mar: '마르', mer: '메르', man: '망', mond: '몽', nier: '니에', olph: '올프', gulph: '울프',
    omer: '오메르', imer: '이메르', rad: '라드', ric: '릭', vech: '베슈', veus: '보', wald: '발트',
    win: '뱅', ouin: '댕', wulf: '울프',
    burge: '뷔르주', berga: '베르가', delis: '델리스', da: '다', tha: '타', dith: '디트', rada: '라다',
    trada: '트라다', elma: '엘마', fride: '프리드', pride: '프리드', gise: '지즈', gisela: '지젤라',
    gonde: '공드', gonda: '공다', haide: '아이드', hilde: '힐드', ilia: '일리아', hilda: '힐다',
    inga: '인가', landa: '린다', lina: '리나', lindis: '린디스', lena: '레나', trudis: '트뤼디스', truda: '트뤼다'
  };

  const koPre = preKoMap[cleanPre] || cleanPre;
  const koSuf = sufKoMap[cleanSuf] || cleanSuf;

  return { ko: koPre + koSuf, en: capitalizedEN };
};

const getCalculatedRelation = (member, allMembers) => {
  const me = allMembers.find(m => m.relation === '본인' && m.status !== '사망')
    || allMembers.find(m => m.relation === '본인');
  if (!me) return member.relation;
  if (member.id === me.id) return '본인';

  const memberGender = getGender(member);
  const meBirth = getBirthYearFromLifeYears(me.lifeYears);
  const memberBirth = getBirthYearFromLifeYears(member.lifeYears);

  // 1. 본인의 배우자
  if (member.spouseId === me.id) {
    return memberGender === 'female' ? '부인' : '남편';
  }

  // 2. 본인의 부모
  const myParents = allMembers.filter(p => p.id === me.parentId || p.spouseId === me.parentId);
  const myParentIds = myParents.map(p => p.id);
  if (myParentIds.includes(member.id)) {
    return memberGender === 'female' ? '모친' : '부친';
  }

  // 3. 본인의 조부모
  const parentObj = allMembers.find(p => p.id === me.parentId);
  if (parentObj) {
    const grandparents = allMembers.filter(gp => gp.id === parentObj.parentId || gp.spouseId === parentObj.parentId);
    const grandparentIds = grandparents.map(gp => gp.id);
    if (grandparentIds.includes(member.id)) {
      return memberGender === 'female' ? '조모' : '조부';
    }
  }

  // 4. 본인의 자녀
  if (member.parentId === me.id || (me.spouseId && member.parentId === me.spouseId)) {
    return memberGender === 'female' ? '딸' : '아들';
  }

  // 5. 본인의 형제/자매
  if (member.parentId && myParentIds.includes(member.parentId)) {
    if (memberBirth < meBirth) {
      return memberGender === 'female' ? '누나' : '형';
    } else {
      return memberGender === 'female' ? '여동생' : '남동생';
    }
  }

  // 6. 부모의 형제/자매 (삼촌, 고모, 큰아버지, 작은아버지 등)
  if (parentObj && parentObj.parentId) {
    const grandparents = allMembers.filter(gp => gp.id === parentObj.parentId || gp.spouseId === parentObj.parentId);
    const grandparentIds = grandparents.map(gp => gp.id);
    
    // 조부모의 자녀들 (부모의 형제자매)
    if (member.parentId && grandparentIds.includes(member.parentId) && !myParentIds.includes(member.id)) {
      if (memberGender === 'female') {
        return '고모';
      } else {
        const fatherBirth = getBirthYearFromLifeYears(parentObj.lifeYears);
        if (memberBirth < fatherBirth) {
          return '큰아버지';
        } else {
          return '작은아버지';
        }
      }
    }

    // 부모의 형제자매의 배우자
    const parentSiblings = allMembers.filter(ps => ps.parentId && grandparentIds.includes(ps.parentId) && !myParentIds.includes(ps.id));
    const parentSiblingSpouse = parentSiblings.find(ps => ps.spouseId === member.id);
    if (parentSiblingSpouse) {
      const spouseGender = getGender(parentSiblingSpouse);
      if (spouseGender === 'female') {
        return '고모부';
      } else {
        const fatherBirth = getBirthYearFromLifeYears(parentObj.lifeYears);
        const siblingBirth = getBirthYearFromLifeYears(parentSiblingSpouse.lifeYears);
        if (siblingBirth < fatherBirth) {
          return '큰어머니';
        } else {
          return '작은어머니';
        }
      }
    }
  }

  // 7. 조카 (형제자매의 자녀)
  const mySiblings = allMembers.filter(sib => sib.parentId && myParentIds.includes(sib.parentId) && sib.id !== me.id);
  const mySiblingIds = mySiblings.map(sib => sib.id);
  if (member.parentId && mySiblingIds.includes(member.parentId)) {
    return memberGender === 'female' ? '조카 (딸)' : '조카 (아들)';
  }

  // 8. 사촌 (부모의 형제자매의 자녀)
  if (parentObj && parentObj.parentId) {
    const grandparents = allMembers.filter(gp => gp.id === parentObj.parentId || gp.spouseId === parentObj.parentId);
    const grandparentIds = grandparents.map(gp => gp.id);
    const parentSiblings = allMembers.filter(ps => ps.parentId && grandparentIds.includes(ps.parentId) && !myParentIds.includes(ps.id));
    const parentSiblingIds = parentSiblings.map(ps => ps.id);
    
    if (member.parentId && parentSiblingIds.includes(member.parentId)) {
      return '사촌';
    }
  }

  // 9. 손자녀 (자녀의 자녀)
  const myChildren = allMembers.filter(ch => ch.parentId === me.id || (me.spouseId && ch.parentId === me.spouseId));
  const myChildrenIds = myChildren.map(ch => ch.id);
  if (member.parentId && myChildrenIds.includes(member.parentId)) {
    return memberGender === 'female' ? '손녀' : '손자';
  }

  // 직접 연결이 없는 후원자/피후견인/의붓친족 같은 수동 관계명은 그대로 존중합니다.
  const standardRelations = [
    '조부', '조모', '부친', '모친', '본인', '부인', '남편',
    '형', '누나', '남동생', '여동생', '아들', '딸',
    '자녀', '형제', '친족', '가문원', ''
  ];
  const hasCustomRelation = member.relation && !standardRelations.includes(member.relation.trim());
  if (hasCustomRelation) {
    return member.relation;
  }

  if (!member.relation || member.relation.trim() === '') {
    return memberGender === 'female' ? '친족 (여)' : '친족 (남)';
  }
  return member.relation;
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
    // Default fallback to "경" / "Sir" for general knights/nobles
    koTitle = '';
    enPrefix = '';
  }

  const finalKo = `${cleanKo}${koTitle}`;
  const finalEn = cleanEn ? ` (${enPrefix}${cleanEn})` : '';
  return `${finalKo}${finalEn}`;
};

const splitName = (fullName) => {
  if (!fullName) return { ko: '', en: '' };
  const regex = /([^(]+)\s*(?:\(([^)]+)\))?/;
  const match = fullName.match(regex);
  let koPart = fullName;
  let enPart = '';
  
  if (match) {
    koPart = match[1].trim();
    enPart = match[2] ? match[2].trim() : '';
  }
  return { ko: koPart, en: enPart };
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

export default function FamilyTree({ character, setCharacter }) {

  // Collapsible accordion state
  const [activePanel, setActivePanel] = useState(null); // 'settings' | 'chronicle' | 'salvation' | null

    // --- 구원 및 성인 판정 (Salvation & Canonization) 추가 상태 ---
  const [salvationDeedsPaladin, setSalvationDeedsPaladin] = useState(false);
  const [salvationDeedsHolyWar, setSalvationDeedsHolyWar] = useState(false);
  const [salvationPagans, setSalvationPagans] = useState(0);
  const [salvationCustomDeeds, setSalvationCustomDeeds] = useState(0);
  const [salvationManualD20, setSalvationManualD20] = useState('');
  const [salvationRollResult, setSalvationRollResult] = useState(null);
  const [blessingRollResult, setBlessingRollResult] = useState(null);
  const [patronSaintRoll, setPatronSaintRoll] = useState('');
  const [patronSaintResult, setPatronSaintResult] = useState(null);

    // 📜 조상 연대기 발전기 (Page 45-49) States
  const initialChronicleState = character?.family?.chronicleState || {};

  const [isAncestorGenOpen, setIsAncestorGenOpen] = useState(
    initialChronicleState.isAncestorGenOpen !== undefined ? initialChronicleState.isAncestorGenOpen : false
  );
  const [ancestorRollLog, setAncestorRollLog] = useState(() => {
    if (character?.family?.ancestorRollLog !== undefined) {
      return character.family?.ancestorRollLog;
    }
    return initialChronicleState.ancestorRollLog !== undefined ? initialChronicleState.ancestorRollLog : [];
  });
  const [grandfatherGlory, setGrandfatherGlory] = useState(
    initialChronicleState.grandfatherGlory !== undefined ? initialChronicleState.grandfatherGlory : 2500
  );
  const [grandfatherDeathYear, setGrandfatherDeathYear] = useState(
    initialChronicleState.grandfatherDeathYear !== undefined ? initialChronicleState.grandfatherDeathYear : 747
  );
  const [grandfatherDeathCause, setGrandfatherDeathCause] = useState(
    initialChronicleState.grandfatherDeathCause !== undefined ? initialChronicleState.grandfatherDeathCause : '노환'
  );
  const [grandfatherHates, setGrandfatherHates] = useState(
    initialChronicleState.grandfatherHates !== undefined ? initialChronicleState.grandfatherHates : { saxons: 0, moors: 0, danes: 0 }
  );

  const [fatherGlory, setFatherGlory] = useState(
    initialChronicleState.fatherGlory !== undefined ? initialChronicleState.fatherGlory : 2500
  );
  const [fatherDeathYear, setFatherDeathYear] = useState(
    initialChronicleState.fatherDeathYear !== undefined ? initialChronicleState.fatherDeathYear : 766
  );
  const [fatherDeathCause, setFatherDeathCause] = useState(
    initialChronicleState.fatherDeathCause !== undefined ? initialChronicleState.fatherDeathCause : '작센 원정 중 용맹 전사'
  );
  const [fatherHates, setFatherHates] = useState(
    initialChronicleState.fatherHates !== undefined ? initialChronicleState.fatherHates : { saxons: 0, moors: 0, danes: 0 }
  );
  const [ancestorApplied, setAncestorApplied] = useState(() => {
    if (character?.family?.ancestorApplied !== undefined) {
      return character.family?.ancestorApplied;
    }
    return initialChronicleState.ancestorApplied !== undefined ? initialChronicleState.ancestorApplied : false;
  });
  const [showRefTables, setShowRefTables] = useState(false);
  const [showRefAging, setShowRefAging] = useState(false);
  const [showRefHarvest, setShowRefHarvest] = useState(false);
  const [showRefSurvival, setShowRefSurvival] = useState(false);
  const [showRefPersonal, setShowRefPersonal] = useState(false);
  const [showRefFamily, setShowRefFamily] = useState(false);
  const [showRefExperience, setShowRefExperience] = useState(false);

  // --- 신설: 인터랙티브 연대기용 추가 상태 ---
  const [chronicleMode, setChronicleMode] = useState(
    initialChronicleState.chronicleMode !== undefined ? initialChronicleState.chronicleMode : 'interactive'
  );
  const [interactiveYear, setInteractiveYear] = useState(
    initialChronicleState.interactiveYear !== undefined ? initialChronicleState.interactiveYear : 723
  );
  const [interactiveStage, setInteractiveStage] = useState(
    initialChronicleState.interactiveStage !== undefined ? initialChronicleState.interactiveStage : 'idle'
  );
  const [chronicleManualD20, setChronicleManualD20] = useState(
    initialChronicleState.chronicleManualD20 !== undefined ? initialChronicleState.chronicleManualD20 : ''
  );
  const [currentYearRolled, setCurrentYearRolled] = useState(
    initialChronicleState.currentYearRolled !== undefined ? initialChronicleState.currentYearRolled : false
  );
  const [currentYearResultText, setCurrentYearResultText] = useState(
    initialChronicleState.currentYearResultText !== undefined ? initialChronicleState.currentYearResultText : ''
  );
  const [fSkipYearsUntil, setFSkipYearsUntil] = useState(
    initialChronicleState.fSkipYearsUntil !== undefined ? initialChronicleState.fSkipYearsUntil : 0
  );
  const [gfDead, setGfDead] = useState(
    initialChronicleState.gfDead !== undefined ? initialChronicleState.gfDead : false
  );
  const [fatherDead, setFatherDead] = useState(
    initialChronicleState.fatherDead !== undefined ? initialChronicleState.fatherDead : false
  );
  const [chronicleHistory, setChronicleHistory] = useState(
    initialChronicleState.chronicleHistory !== undefined ? initialChronicleState.chronicleHistory : []
  );
  const [chroniclePendingRoll, setChroniclePendingRoll] = useState(
    initialChronicleState.chroniclePendingRoll !== undefined ? initialChronicleState.chroniclePendingRoll : null
  );

  // --- 신설: 주사위 1d6/1d3 수동 입력 및 명예 보정치 상태 ---
  const [chronicleManualD6, setChronicleManualD6] = useState(
    initialChronicleState.chronicleManualD6 !== undefined ? initialChronicleState.chronicleManualD6 : ''
  );
  const [fatherHonorModifier, setFatherHonorModifier] = useState(
    initialChronicleState.fatherHonorModifier !== undefined ? initialChronicleState.fatherHonorModifier : 0
  );
  const [chronicleBirthGifts, setChronicleBirthGifts] = useState(
    initialChronicleState.chronicleBirthGifts !== undefined ? initialChronicleState.chronicleBirthGifts : 0
  );

	  // --- 연대기 상태 메인 캠페인 저장소 동기화 ---

	    useEffect(() => {
    const stateToSave = {
      isAncestorGenOpen,
      chronicleMode,
      interactiveYear,
      interactiveStage,
      ancestorRollLog,
      grandfatherGlory,
      grandfatherDeathYear,
      grandfatherDeathCause,
      grandfatherHates,
      gfDead,
      fatherGlory,
      fatherDeathYear,
      fatherDeathCause,
      fatherHates,
      fatherDead,
      ancestorApplied,
      currentYearRolled,
      currentYearResultText,
      fSkipYearsUntil,
      chronicleHistory,
      chroniclePendingRoll,
      chronicleManualD6,
      fatherHonorModifier,
      chronicleBirthGifts
    };
      const nextSerialized = JSON.stringify(stateToSave);
      if (character.family?.chronicleState && JSON.stringify(character.family.chronicleState) === nextSerialized) {
        return;
      }
      setCharacter(prev => {
        if (prev.family?.chronicleState && JSON.stringify(prev.family.chronicleState) === nextSerialized) {
          return prev;
        }
        return {
          ...prev,
          family: {
            ...prev.family,
            chronicleState: stateToSave,
            ancestorRollLog
          }
        };
      });
	  }, [
      character.family?.chronicleState,
	    isAncestorGenOpen,
    chronicleMode,
    interactiveYear,
    interactiveStage,
    ancestorRollLog,
    grandfatherGlory,
    grandfatherDeathYear,
    grandfatherDeathCause,
    grandfatherHates,
    gfDead,
    fatherGlory,
    fatherDeathYear,
    fatherDeathCause,
    fatherHates,
    fatherDead,
    ancestorApplied,
    currentYearRolled,
    currentYearResultText,
    fSkipYearsUntil,
    chronicleHistory,
    chroniclePendingRoll,
    chronicleManualD6,
    fatherHonorModifier,
    chronicleBirthGifts
  ]);


    const ANCESTOR_EVENTS = {
    723: "작센(Saxony) 신성수 파괴 원정: 데시데리우스(Desiderius) 교회의 보호자이자 궁재 카롤루스 마르텔(Charles Martel)의 명에 따라, 헤센(Hesse) 지방 가이스마르(Geismar)의 토르 신성한 떡갈나무(Donar Oak)를 벌채하고 작센인(Saxons)들의 프리츨라(Fritzlar) 요새 인근 이교도 신성림(Holy Trees)들을 파괴하는 원정에 종군하였습니다.",
    724: "교황 그레고리오 2세(Gregory II)의 성유물 기증 및 제라르 경 탄생: 교황이 카롤루스 마르텔(Charles Martel)에게 성 베드로의 쇠사슬(Saint Peter's Chains)과 열쇠 성유물함(Shrine of Keys)을 기증하며 보호를 요청했습니다. 한편, 가문의 영광스러운 상속자이자 부친이 되실 제라르(Gerard) 경이 탄생하는 영광을 맞이했습니다.",
    725: "오툉(Autun) 포위전 결사 항전: 셉티마니아(Septimania)를 장악한 무어인(Moors)들의 대군이 님(Nîmes)과 카르카손(Carcassonne)을 차례로 함락하고, 론(Rhône) 강 계곡을 따라 북상하여 부르고뉴의 심장부 오툉(Autun)까지 약탈과 파괴를 자행하자 오툉 성채 수비대원으로서 결사 항전했습니다. 아키텐의 오도(Eudes) 공작이 무어인들과 밀약을 맺었다는 매수 소문이 흉흉히 돌았습니다.",
    726: "영지 방비와 평화기: 무어인들의 공세가 한 차례 꺾이고 기사단이 전열을 정비하는 동안, 겨울철 영지 순찰을 돌며 후방의 성벽과 참호를 보수하고 평온한 기사 의무를 완수했습니다.",
    727: "국경의 평화와 풍작: 제국 국경과 영지에 아무런 마찰이 없었던 한 해로, 봉토의 곡식 수확을 직접 감독하고 가문의 권세와 영지민들의 치안을 평화롭게 유지하였습니다.",
    728: "작센 정벌 및 아키텐 공작 제압 대원정: 카롤루스 마르텔(Charles Martel)이 북방 작센(Saxony)과 동프리지아(East Frisia)를 징벌하는 원정을 단행하고, 스페인의 이슬람 세력과 밀약을 맺어 프랑크 왕국으로부터 독립하려는 아키텐(Aquitaine)의 오도(Eudes) 공작을 무릎 꿇리기 위해 남북을 가르는 군사 작전에 참전했습니다.",
    729: "작센 바르벨 타워(Varbel Tower) 공방전: 가린 드 몽글란(Garin de Monglane) 공작과 두온 드 메양스(Doon de Mayence) 공작을 구출하고 도우려 작센인(Saxons)들의 굳건한 거점 요새인 바르벨(Varbel) 타워 인근 전장으로 출정하여 치열한 정벌전을 벌였습니다.",
    730: "무훈시 [고프레(Gaufrey)] 및 [오베리 드 부르고뉴(Auberi de Bourgogne)]의 대사건: 바르벨(Varbel) 타워에 갇혔던 프랑크 기사들이 플뢰르드핀(Fleurdepine) 공주의 지혜로 은밀한 지하 통로를 통해 탈출하고, 거인 로바스트르(Robastre)가 이교도 전사 글로리앙(Gloriant)을 처단했습니다. 또한 바이에른(Bavaria) 영토에서는 오베리(Auberi) 경이 아바르(Avars)족의 공습으로부터 영토를 완전 사수하였습니다.",
    731: "오리돈(Oridon) 공성전: 궁재 카롤루스 마르텔(Charles Martel)의 영에 따라, 배반자 람베르트(Lambert) 백작이 굳건히 수비하던 오리돈(Oridon) 성을 겹겹이 에워싸고 공성하여 반역도당을 소탕했습니다.",
    732: "역사적인 포아티에(Poitiers/투르) 전투: 안달루스(al-Andalus)의 아브드 알 라흐만(Abdul Rahman) 총독이 이끄는 사라센 무어인(Moors)들의 대규모 침공군에 맞서, 서유럽 기독교 세계의 운명을 걸고 카롤루스 마르텔(Charles Martel)과 아키텐의 오도(Eudes) 공작 연합군의 정예 기사로 평원에 집결하여 격전을 벌였습니다.",
    733: "무훈시 [도렐과 베통(Daurel and Beton)] 및 아키텐 상속: 브라반트(Brabant)의 보브(Boves) 백작이 프랑크 국왕의 누이인 에르멩가르드(Ermengard) 공주와 혼인했으나 질투에 눈먼 기(Guy) 백작의 음모가 도사렸습니다. [역사] 아키텐(Aquitaine)의 오도(Eudes) 공작이 서거하고 후놀트(Hunald)가 아키텐 공위를 상속받았습니다.",
    734: "기사도의 희망 베통(Beton) 탄생 및 종자 교육: [도렐과 베통]의 영웅 베통(Beton) 경이 탄생했습니다. [역사] 궁재 카롤루스 마르텔(Charles Martel)이 둘째 아들 단신왕 피핀(Pepin the Short)을 롬바르디아(Lombardy) 왕실 파비아(Pavia)로 보내 기사 훈련을 쌓게 했습니다.",
    735: "보르도(Bordeaux) 공성전 및 루시옹의 제라르 대결: 카롤루스 마르텔(Charles Martel)과 함께 아키텐의 보르도(Bordeaux)와 블라이(Blaye)를 공성하여 후놀트(Hunald) 공작의 항복을 받아내고, 루시옹(Roussillon)의 제라르(Gerard) 공작 세력을 압박하는 전투에 투입되었습니다.",
    736: "아를(Arles) 해방 포위 공성전: 이슬람 무어인(Moors) 세력과 손을 잡은 루시옹의 제라르(Gerard) 공작의 반역 세력을 격퇴하고, 사라센인들의 손에 떨어진 아를(Arles) 시를 구출해내기 위한 포위전 and 돌격전에 참전했습니다.",
    737: "아비뇽(Avignon) 공성전 및 반역 징벌전: 무어인들과 결탁해 프랑크 왕국을 배신한 서고트(Visigoth) 귀족들을 처벌하기 위해 아비뇽(Avignon) 성벽을 공성 병기로 부수고 돌입하였으며, 성내의 모든 반역 이교도들을 학살하고 도시를 초토화시켰습니다.",
    738: "부르고뉴(Burgundy) 무어 평정 및 보르들레(Bordelais) 습격전: 로렌(Lorraine) 가문을 지원하여 부르고뉴 지방 깊숙이 침입한 무어인 군세를 소탕하거나, 오랜 가문 복수의 화신인 보르들레(Bordelais) 세력의 거점을 소탕하는 야간 습격전에 나섰습니다.",
    739: "셉티마니아(Septimania) 사라센 축출전: 단신왕 피핀(Pepin the Short) and 롬바르디아 왕 리우트프란트(Liutprand)의 동맹군에 종군하여, 무어인(Moors)들의 남부 요새들을 포위 공성하고 협력자들의 영지를 몰수하는 전투에서 큰 무공을 세워 전리품을 배분받았습니다.",
    740: "로슈브룬(Rochebrune) 성곽 수호전과 덴마크 왕 정벌: 덴마크(Denmark)의 침략군에 맞서 나이모(Naimon) 대공의 사촌인 파스루즈(Passerose)가 농성하던 로슈브룬(Rochebrune) 성을 성공적으로 방어 및 탈환했습니다. 이후 조부님(알베르 경)께서는 덴마크 본토까지 전격 돌입하여 덴마크 왕을 전사시키고 왕위를 찬탈한 영웅적 쾌거를 기록했습니다. 귀로에는 로바스트르(Robastre) 경이 이교도 거인 모리에(Morhier)를 결투 끝에 참수하며 거인들의 타워를 함락시켰습니다.",
    741: "궁재 카롤루스 마르텔(Charles Martel) 서거 및 안덴 장례식: 30여 년간 왕국을 지배한 공의 안덴(Andenne) 대성당 장례식에 참석하여 슬픔을 나누고, 유산을 분할받은 두 아들 카를로만(Carloman)과 피핀(Pepin)에 반기를 든 그리포(Grifo) 왕자의 반란군을 격퇴해 기사를 생포했습니다.",
    742: "쾰른 백작 두온 드 라 로슈(Doon de La Roche)의 성대한 왕실 혼례: 국왕 피핀(Pepin)의 아름다운 누이인 올리브(Olive) 공주와 충신 두온(Doon) 백작의 쾰른(Cologne) 대성당 결혼식에 공식 하객으로 참석하여 연회를 즐겼습니다.",
    743: "레겐스부르크(Regensburg) 대결전 및 삼면 평정 원정: 바이에른(Bavaria)을 영구 병합하기 위해 도나우 강변의 레겐스부르크(Regensburg)에서 오딜로(Odilo) 공작 군대를 격파하고, 아키텐의 반란군 및 북방 작센(Saxony) 이교도 국경지대를 불태우는 징벌 원정에 나섰습니다.",
    744: "조부 알베르 경의 최후 원정과 은퇴: 왕실에 잠입한 아키텐 공작 후놀트(Hunald)의 간첩들을 적발해 참수하고, 왕국 국경을 침범한 작센인(Saxons)들을 토벌하여 영예로운 무공 훈장을 수여받으며 평생의 기사 현역을 매듭지었습니다.",

    745: "돈 드 라 로슈(Doon de la Roche)의 결혼 & 아키텐 공국 와이페르 승계: 돈 경이 토밀의 딸 오드구르와 결혼하여 아들 말랭그를 낳았고, 아키텐의 후놀트 공작이 포로로 잡혀 수도원으로 보내지며 아들 와이페르가 공작위에 즉위했습니다. 이와 동시에 부친 제라르(Gerard) 경이 조부 알베르 경으로부터 기사직을 승계하며 혼례를 성취하셨습니다.",
    746: "당신(플레이어 캐릭터)의 탄생 및 알레마니아 피의 의무: 가문의 미래이자 위대한 기사가 될 당신(플레이어)이 탄생했습니다. [역사] 궁재 카를로만(Carloman)의 명에 따라 알레마니아(Alemannia) 반란 귀족들을 처단하는 냉혹한 작전에 종군하여 반역자들을 엄벌했습니다.",
    747: "롬바르디아 및 로마(Rome) 순례 동행: 세속의 명예를 내려놓고 롬바르디아(Lombardy)를 거쳐 몬테카시노(Monte Cassino) 수도원으로 귀의하려는 카를로만(Carloman) 공을 호위하며 성지 로마에 당도하여 엄숙한 면죄 성사를 받았습니다.",
    748: "무훈시 [라울 드 캉브레(Raoul de Cambrai)]의 속죄 순례 및 그리포 반란: 베르니에(Bernier)와 베아트릭스(Beatrix) 부부가 속죄 순례 도중 무어인의 기습을 받아 포로로 감금되는 시련을 겪었습니다. [역사] 왕국의 반역자 그리포(Grifo) 왕자가 바이에른(Bavaria)으로 탈출하였으며 타실로 3세(Tassilo III)가 바이에른 공작으로 취임했습니다.",
    749: "바이에른(Bavaria) 그리포 추격전: 바이에른으로 패주하여 아키텐 공작 바이에르(Waifer) 및 롬바르디아 국왕 아이스툴프(Aistulf)와 연대하려는 역도 그리포(Grifo) 왕자의 잔당을 토벌하기 위해 험난한 군사 작전에 종군했습니다.",
    750: "작센 대전투와 이교도 추장 저스타몽 격퇴: 뫼즈 강과 국경지대를 위협하며 작센의 이교 추장 저스타몽(Justamont)이 이끄는 이교도 군단에 맞서 피핀(Pepin) 국왕의 선봉장으로 대평원 벌판에서 뼈를 깎는 혈투를 벌여 이교도를 축출했습니다.",
    751: "역사적인 피핀 3세(Pepin III) 대관식 경비: 메로빙거 왕조의 무기력한 마지막 국왕 힐데리히 3세(Childeric III)의 폐위식과 피핀 3세(Pepin the Short) 국왕의 대관식 경비를 성대히 담당했습니다.",
    752: "무어 왕실 망명기 [마이네(Mainet)] 및 피핀 2세 공습: 독살 음모를 피해 톨레도(Toledo)로 피신한 젊은 샤를마뉴(마이네) 왕자가 갈라프레(Galafre)의 용병으로 뛰며 활약하고 갈리엔나(Galienne) 공주와의 숭고한 사랑을 얻었습니다. [역사] 남부 국경에 사라센 침공이 발생하고 샤를마뉴의 친동생 카를로만 2세(Carloman II)가 출생했습니다.",
    753: "비부르크(Wiburg) 산 대결전과 그리포 최후: 작센(Saxony)인들의 이교도 반역군에 대항해 피핀(Pepin) 국왕과 함께 친정하여 험준한 비부르크(Wiburg) 산맥에서 격렬한 산악전을 전개했습니다. (이 전투에서 힐데가르(Hildegar) 대주교가 전사하고, 도주하던 반역자 그리포 왕자가 사로잡혀 감옥에서 사망함)",
    754: "나르본(Narbonne) 탈환 공성전 및 알프스 돌파: 아이메리 드 나르본(Aymeri de Narbonne) 경을 도와 셉티마니아의 요충지 나르본(Narbonne) 시를 사라센인들의 억압으로부터 완전히 구출하기 위해 피비린내 나는 참호전과 성벽 격돌을 치렀습니다.",
    755: "무훈시 [리옹 드 부르주(Lion de Bourges)] 및 [오르송 드 보베(Orson de Beauvais)] 노래: 리옹(Lion) 경이 잃어버린 부모를 찾아 이탈리아 몬테로세(Monterose) 성을 공성했으며, 늙은 백작 오르송(Orson)이 예루살렘의 감옥에서 충직한 아들 밀로(Milo)의 결사 구출 작전으로 마침내 사법적 정의를 지켰습니다.",
    756: "롬바르디아 파비아(Pavia) 요새 대공성전: 교황령을 거듭 침범하는 롬바르디아 왕 아이스툴프(Aistulf)의 콧대를 꺾기 위해 파비아(Pavia) 성벽 아래에서 치열한 격전을 펼치며 롬바르디아의 항복을 받아내고 교황청 기증령(Donation of Pepin)의 토대를 닦았습니다.",
    757: "덴마크(Denmark) 수륙 양면 징벌 원정: 쾰른 백작 두온(Doon)과 피핀(Pepin) 국왕의 친정에 종군하여 북방의 호전적인 덴마크 바이킹 함대들을 격파하고 덴마크 왕으로부터 왕자 오지에(Ogier the Dane)를 인질로 인도받았습니다.",
    758: "작센(Saxony) 무자비한 보복 초토화 작전: 공약한 연 300필 군마 조공을 거부하고 무장 봉기한 작센 영토 깊숙이 침투하여 파괴와 거부 불허의 강제 기독교 개종을 동반한 대토벌전을 완수했습니다.",
    759: "무훈시 [로렌 사람들(Les Lorrains)] 복수극 및 셉티마니아 완전 수복: 멧돼지 사냥 중 가문 원수에게 암살당한 베고(Bego) 백작의 복수극으로 프랑크 영내가 피로 물들었습니다. [역사] 피핀(Pepin) 국왕이 마침내 사라센 무어인(Moors)들을 한 명도 남김없이 몰아내어 남방 셉티마니아(Septimania)를 완전히 탈환했습니다.",
    760: "아키텐(Aquitaine) 대원정 개막 및 리무쟁(Limousin) 공성: 아키텐 공작 와이페르(Waifer)의 독립 시도를 분쇄하기 위해 샤를마뉴 왕자 및 피핀 국왕의 선봉으로 아키텐 영내 리무쟁(Limousin) 성을 포위 공성하여 함락시켰습니다. 쾰른의 란드리(Landri) 경을 모시고 파리로 귀국하는 길을 보좌했습니다.",
    761: "부르주(Bourges) 성채 포위 공략: 아키텐 정벌의 노른자위 거점인 부르주(Bourges)와 리모주(Limoges) 시를 완전히 장악하기 위해 기사단의 사다리 돌격을 감행해 적의 철옹성 방어벽을 깨부수고 승리했습니다.",
    762: "아키텐(Aquitaine) 약탈 전초전 및 샤를마뉴 궁정: 아키텐의 잔당들을 압박하기 위해 국경지대 아르장통(Argenton)에 요새를 건설하고, 어린 롤랑(밀로의 아들)의 대담한 당돌함을 왕실 연회에서 기쁨으로 나눴습니다.",
    763: "쾰른 라 로슈(La Roche) 성곽 결사 사수: 배반자 토밀(Tomile)과 말랭그(Malingre)가 이끄는 대반란군의 삼중 포위망 속에 갇혀, 본대 지원군이 도착하기 전까지 밤낮으로 성곽에서 저항하며 요새를 지켰습니다.",
    764: "라 로슈(La Roche) 탈환 공성전 및 툴루즈 함락: 오베리(Auberi) 주교의 복수군에 참전해 라 로슈 성을 맹렬히 격파해 탈환하고 쾰른(Cologne)을 수복하였으며, 아키텐 와이페르 공작의 수도 툴루즈(Toulouse)를 최종 점령했습니다.",
    765: "오트페이유(Hautefeuille) 포위 공성전 및 작센 족장 브로히막스 격파: 쾰른의 평화를 위협하는 작센 군대를 요격하기 위해 오트페이유 공성전에서 목숨을 건 격전을 벌였으며, 국왕 피핀을 납치하려는 작센의 악랄한 족장 브로히막스(Brohimax) 세력을 참수 토벌했습니다.",
    766: "몽펠리에(Montpellier) 및 에그르몽(Aigremont) 최후 대공성전: 부친 제라르 경의 영광스러운 현역 마지막 해로, 후계자 샤를마뉴 왕자 및 위비앙(Vivien)의 프랑크 성전 연합군에 합류해 몽펠리에와 이교도의 요새 에그르몽 성벽을 격파하여 최후의 기사도 불꽃을 피워냈습니다."
  };

  const cleanAncestorName = (fullName) => {
    if (!fullName) return '알베르';
    const regex = /([^(]+)/;
    const match = fullName.match(regex);
    let koPart = match ? match[1].trim() : fullName;
    return koPart.replace(/\s*(경|남작|백작|공작|영주|부인|종자)$/, '').trim();
  };

  const getEventText = (yr) => {
    if (!ANCESTOR_EVENTS[yr]) return "";
    const ancestorFullName = character.family?.ancestor || '알베르 경';
    const rawAncestorName = cleanAncestorName(ancestorFullName);
    return ANCESTOR_EVENTS[yr]
      .replace(/조조부/g, '조부')
      .replace(/할아버님/g, '조부님')
      .replace(/조부 알베르/g, '조부 알베르')
      .replace(/알베르/g, rawAncestorName);
  };

  const isGapYear = (yr, stage) => {
    // 모든 연도는 고유 핸들러 또는 runGfOrdinaryYear/runFOrdinaryYear로 처리됨
    // 갭 연도(공백기 자동통과) 개념은 사용하지 않음
    return false;
  };

  // 룰북에 이벤트 테이블이 없어 주사위 판정 없이 자동 통과해야 하는 연도
  const isAutoPassYear = (yr, stage) => {
    if (stage === 'gf_running') {
      return [724, 726, 727, 730, 733, 734].includes(yr);
    }
    return false;
  };

  const saveChronicleHistory = () => {
    const snapshot = {
      interactiveYear,
      interactiveStage,
      grandfatherGlory,
      grandfatherDeathYear,
      grandfatherDeathCause,
      grandfatherHates: { ...grandfatherHates },
      fatherGlory,
      fatherDeathYear,
      fatherDeathCause,
      fatherHates: { ...fatherHates },
      gfDead,
      fatherDead,
      ancestorRollLog: [...ancestorRollLog],
      currentYearRolled,
      currentYearResultText,
      fSkipYearsUntil,
      chronicleManualD20,
      chroniclePendingRoll
    };
    setChronicleHistory(prev => [...prev, snapshot]);
  };

  const undoLastChronicleStep = () => {
    if (chronicleHistory.length === 0) return;
    const prev = chronicleHistory[chronicleHistory.length - 1];
    setChronicleHistory(hist => hist.slice(0, -1));
    setInteractiveYear(prev.interactiveYear);
    setInteractiveStage(prev.interactiveStage);
    setGrandfatherGlory(prev.grandfatherGlory);
    setGrandfatherDeathYear(prev.grandfatherDeathYear);
    setGrandfatherDeathCause(prev.grandfatherDeathCause);
    setGrandfatherHates(prev.grandfatherHates);
    setFatherGlory(prev.fatherGlory);
    setFatherDeathYear(prev.fatherDeathYear);
    setFatherDeathCause(prev.fatherDeathCause);
    setFatherHates(prev.fatherHates);
    setGfDead(prev.gfDead);
    setFatherDead(prev.fatherDead);
    setAncestorRollLog(prev.ancestorRollLog);
    setCurrentYearRolled(prev.currentYearRolled);
    setCurrentYearResultText(prev.currentYearResultText);
    setFSkipYearsUntil(prev.fSkipYearsUntil);
    setChronicleManualD20(prev.chronicleManualD20);
    setChroniclePendingRoll(prev.chroniclePendingRoll);
  };

  const handleGapYearInteractive = () => {
    saveChronicleHistory();
    const event = getEventText(interactiveYear);
    const logMsg = `🏰 ${interactiveYear}년: [역사] ${event}\n  └ 📖 평온한 공백기: 무사히 한 해를 보냈습니다.`;
    setAncestorRollLog(prev => [...prev, logMsg]);
    setCurrentYearRolled(true);
    setCurrentYearResultText("🕊️ 역사적 평온기: 무사히 생존");
  };

  const startInteractiveChronicle = () => {
    if (hasAppliedEvent(character, 'ancestor:legacy')) {
      alert("조상 유산은 이미 이 캠페인에 반영되었습니다. 다시 굴려 중복 보상을 만들 수 없습니다.");
      return;
    }
    setInteractiveStage('gf_running');
    setInteractiveYear(723);
    setGrandfatherGlory(2500);
    setGrandfatherDeathYear(null);
    setGrandfatherDeathCause('');
    setGrandfatherHates({ saxons: 0, moors: 0, danes: 0, cruel: 0 });

    setFatherGlory(2500);
    setFatherDeathYear(null);
    setFatherDeathCause('');
    setFatherHates({ saxons: 0, moors: 0, danes: 0, cruel: 0 });

    setChronicleManualD20('');
    setChronicleManualD6('');
    setFatherHonorModifier(0);
    setChronicleBirthGifts(0);
    setCurrentYearRolled(false);
    setCurrentYearResultText('');
    setFSkipYearsUntil(0);
    setAncestorRollLog(["📜 [인터랙티브 가문 연대기 시작 - 723년]"]);
    setAncestorApplied(false);
    setChronicleHistory([]);
    setGfDead(false);
    setFatherDead(false);
    setChroniclePendingRoll(null);
  };

  const rollAndAdvanceAutoPassYear = () => {
    saveChronicleHistory();
    const yr = interactiveYear;
    const event = getEventText(yr);
    let logMsg = "";
    
    if (yr === 724) {
      logMsg = `🏰 724년: [역사] ${event}\n  └ 🍼 올해는 가문의 큰 경사 — 훗날 기사가 될 부친 제라르(Gerard)께서 탄생하셨습니다! 조부님은 영지를 지키며 이 기쁜 소식을 맞이하셨습니다.`;
    } else if (yr === 726 || yr === 727) {
      logMsg = `🏰 ${yr}년: [역사] ${event}\n  └ 📖 주목할 만한 사건 없음(No noteworthy events). 조부님은 영지를 평온히 지키셨습니다.`;
    } else if (yr === 730) {
      logMsg = `🏰 730년: [역사] ${event}\n  └ 📖 역사적 평온기: 무훈시 [고프레]와 [오베리 드 부르고뉴]의 대사건이 있던 해입니다. 조부님은 영지를 굳건히 수호하셨습니다.`;
    } else if (yr === 733 || yr === 734) {
      logMsg = `🏰 ${yr}년: [역사] ${event}\n  └ 📖 역사적 평온기: 무훈시 [도렐과 베통] 등의 사건이 있던 평화로운 시기입니다. 조부님은 영지 치안을 다졌습니다.`;
    }

    setAncestorRollLog(prev => [...prev, logMsg]);

    const nextYr = yr + 1;
    setInteractiveYear(nextYr);
    setCurrentYearRolled(false);
    setCurrentYearResultText('');
    setChronicleManualD20('');
  };

  const rollSingleYearInteractive = () => {
    try {
      if (currentYearRolled) return;

      if (isGapYear(interactiveYear, interactiveStage)) {
        handleGapYearInteractive();
        return;
      }

      saveChronicleHistory();

      if (chroniclePendingRoll) {
        const pending = { ...chroniclePendingRoll };

        if (pending.type === 'gf_hate_roll') {
          setChroniclePendingRoll(null);
          let val = parseInt(chronicleManualD6);
          if (isNaN(val) || val < 1 || (pending.hateType === 'd3' && val > 3) || (pending.hateType === 'd6' && val > 6)) {
            val = Math.floor(Math.random() * (pending.hateType === 'd3' ? 3 : 6)) + 1;
          }

          let updatedHates = { ...grandfatherHates };
          let logAdd = "";
          let outcomeText = "";

          if (pending.hateTarget === 'cruel') {
            logAdd = `\n  └ [기질 획득] 배신자들에 대한 복수심으로 가득 차 무자비함(Cruel) +${val} 기질 획득!`;
            outcomeText = `아비뇽 징벌 공방전 승리 및 복수 기질 획득 (+${pending.gloryGained} Glory)`;
            updatedHates.cruel = (updatedHates.cruel || 0) + val;
            setGrandfatherHates(updatedHates);
          } else {
            const enemyKorean = pending.hateTarget === 'saxons' ? '작센인' : pending.hateTarget === 'moors' ? '무어인' : '덴마크 바이킹';
            const enemyKey = pending.hateTarget;
            updatedHates[enemyKey] = (updatedHates[enemyKey] || 0) + val;
            setGrandfatherHates(updatedHates);

            logAdd = `\n  └ [증오 획득] ${enemyKorean}에 대한 증오 +${val}`;
            
            if (pending.poitiersOutcome) {
              if (pending.poitiersOutcome === 'hero') {
                outcomeText = `영웅: 포아티에 돌격 전공 획득 (+500 Glory, 무어 증오 +${val})`;
              } else if (pending.poitiersOutcome === 'survive') {
                outcomeText = `승전: 투르-포아티에 승전 생존 (+400 Glory, 무어 증오 +${val})`;
              } else {
                outcomeText = `👑 불멸의 무공: 적장 압둘 라흐만 결투 처단 (+900 Glory, 무어 증오 +${val})`;
              }
              setChronicleBirthGifts(prev => prev + 1);
            } else if (pending.customOutcome === 'danes_hate') {
              outcomeText = `덴마크 성벽 사수 및 덴마크 증오 +${val} 획득 (+${pending.gloryGained} Glory)`;
              logAdd = `\n  └ [새로운 위협] 평생 처음 마주한 덴마크인들에 대해 엄청난 분노를 품었습니다! (Hate [Danes] +${val})`;
            } else {
              const enemyNameKo = pending.hateTarget === 'saxons' ? '작센' : pending.hateTarget === 'moors' ? '무어' : '덴마크';
              outcomeText = `${enemyNameKo} 전투 생존 및 증오 +${val} 획득 (+${pending.gloryGained} Glory)`;
            }
          }

          const finalLog = pending.logPrefix + logAdd;
          setAncestorRollLog(prev => [...prev, finalLog]);
          setCurrentYearRolled(true);
          setCurrentYearResultText(outcomeText);
          setChronicleManualD20('');
          setChronicleManualD6('');
          return;
        }

        if (pending.type === 'f_hate_roll') {
          setChroniclePendingRoll(null);
          let val = parseInt(chronicleManualD6);
          if (isNaN(val) || val < 1 || (pending.hateType === 'd3' && val > 3) || (pending.hateType === 'd6' && val > 6)) {
            val = Math.floor(Math.random() * (pending.hateType === 'd3' ? 3 : 6)) + 1;
          }

          let updatedHates = { ...fatherHates };
          let logAdd = "";
          let outcomeText = "";

          if (pending.hateTarget === 'cruel') {
            updatedHates.cruel = (updatedHates.cruel || 0) + val;
            setFatherHates(updatedHates);
            logAdd = `\n  └ [기질 획득] 알레마니아 반역자 숙청 대열에 합류하여 잔혹성(Cruel) +${val} 기질 획득!`;
            outcomeText = `대숙청 참전 및 잔혹성 기질 +${val} 획득`;
          } else {
            const enemyKorean = pending.hateTarget === 'saxons' ? '작센인' : pending.hateTarget === 'moors' ? '무어인' : '덴마크 바이킹';
            const enemyKey = pending.hateTarget;
            updatedHates[enemyKey] = (updatedHates[enemyKey] || 0) + val;
            setFatherHates(updatedHates);

            if (pending.customOutcome === 'saxons_hate_d6') {
              logAdd = `\n  └ [증오 획득] 작센인에 대한 극심한 증오 +${val}`;
              outcomeText = `작센 격전 생존 및 극심한 증오 +${val} (+${pending.gloryGained} Glory)`;
            } else {
              logAdd = `\n  └ [증오 획득] ${enemyKorean}에 대한 증오 +${val}`;
              const enemyNameKo = pending.hateTarget === 'saxons' ? '작센' : pending.hateTarget === 'moors' ? '무어' : '바이킹';
              outcomeText = `${enemyNameKo} 전투 생존 및 증오 +${val} (+${pending.gloryGained} Glory)`;
            }
          }

          const finalLog = pending.logPrefix + logAdd;
          setAncestorRollLog(prev => [...prev, finalLog]);
          setCurrentYearRolled(true);
          setCurrentYearResultText(outcomeText);
          setChronicleManualD20('');
          setChronicleManualD6('');
          return;
        }

        setChroniclePendingRoll(null);

        let d20 = parseInt(chronicleManualD20);
        if (isNaN(d20) || d20 < 1 || d20 > 20) {
          d20 = Math.floor(Math.random() * 20) + 1;
        }

        const rollD20 = () => Math.floor(Math.random() * 20) + 1;
        const rollD6 = () => {
          const val = parseInt(chronicleManualD6);
          if (!isNaN(val) && val >= 1 && val <= 6) return val;
          return Math.floor(Math.random() * 6) + 1;
        };
        const rollD3 = () => {
          const val = parseInt(chronicleManualD6);
          if (!isNaN(val) && val >= 1 && val <= 3) return val;
          return Math.floor(Math.random() * 3) + 1;
        };

        let logMsg = pending.logPrefix;
        let yearOutcomeText = "";

        if (pending.type === 'gf_combat_survival') {
          const runGfCombatSurvival = (eventName, battleModifier = 0, isVictor = true, standardGlory = 100) => {
            const rollVal = d20;
            const modifiedRoll = rollVal + battleModifier;
            let dead = false;
            let gloryGained = standardGlory * (isVictor ? 2 : 1);
            let cause = "";
            let rollDescText = "";

            if (modifiedRoll <= 0) {
              dead = true;
              gloryGained += 1000;
              cause = "전투 중 장렬한 전사 (Combat)";
              rollDescText = `🗡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 전공을 치하받으며 장렬히 전사하셨습니다! (+${gloryGained} Glory)`;
            } else if (modifiedRoll === 1) {
              dead = true;
              cause = "전투 중 전사 (Combat)";
              rollDescText = `🗡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 전투 중 아쉽게 전사하셨습니다. (+${gloryGained} Glory)`;
            } else if (modifiedRoll === 2) {
              dead = true;
              const retiredYears = rollD20();
              cause = `부상 은퇴 (수도원에서 ${retiredYears}년 후 영면)`;
              rollDescText = `🏥 주사위 ${rollVal}(보정 ${modifiedRoll}) - 불구가 되는 중상을 입어 은퇴 후 에히터나흐 수도원으로 들어갑니다. ${retiredYears}년 뒤 수도원에서 조용히 영면에 드십니다. (+${gloryGained} Glory)`;
            } else if (modifiedRoll === 3) {
              dead = true;
              cause = "포로 압송 및 실종 (Captured)";
              rollDescText = `🔗 주사위 ${rollVal}(보정 ${modifiedRoll}) - 포로로 잡혀 적국으로 압송되었으며 영영 돌아오지 못했습니다. (+${gloryGained} Glory)`;
            } else if (modifiedRoll <= 5) {
              gloryGained += 100;
              rollDescText = `✨ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 기적적으로 생존하고 전장에 큰 기여를 한 영웅적 전공을 세웠습니다! (+${gloryGained} Glory)`;
            } else {
              rollDescText = `🛡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 치열한 전투 속에서 무사히 살아남으셨습니다. (+${gloryGained} Glory)`;
            }

            return { dead, gloryGained, cause, rollDescText };
          };

          const res = runGfCombatSurvival(pending.eventName, pending.battleModifier, pending.isVictor, pending.standardGlory);
          logMsg += res.rollDescText;

          if (res.dead) {
            setGfDead(true);
            setGrandfatherDeathYear(pending.yr);
            setGrandfatherDeathCause(res.cause);
            setInteractiveStage('gf_dead');
            yearOutcomeText = `사망: ${res.cause}`;
          } else {
            setGrandfatherGlory(prev => prev + res.gloryGained);
            
            let needHateRoll = false;
            let hateType = "";
            let hateTarget = "";
            
            if (pending.customOutcome === 'danes_hate') {
              needHateRoll = true;
              hateType = 'd6';
              hateTarget = 'danes';
            } else if (pending.customOutcome === 'cruel_trait') {
              needHateRoll = true;
              hateType = 'd6';
              hateTarget = 'cruel';
            } else if (pending.hateEnemy) {
              needHateRoll = true;
              hateType = 'd3';
              hateTarget = pending.hateEnemy;
            }

            if (needHateRoll) {
              setChroniclePendingRoll({
                type: 'gf_hate_roll',
                yr: pending.yr,
                logPrefix: logMsg,
                hateType,
                hateTarget,
                gloryGained: res.gloryGained,
                customOutcome: pending.customOutcome
              });
              setChronicleManualD20('');
              setChronicleManualD6('');
              return;
            } else {
              if (pending.customOutcome === 'birth_gift') {
                logMsg += "\n  └ [왕실의 선물] 수복 공헌을 기려 마르텔 공으로부터 프랑크 탄생 선물을 받았습니다! (Frankish Birth Gift 획득!)";
                yearOutcomeText = `셉티마니아 대승리 및 왕실 하사품(Birth Gift) 획득 (+${res.gloryGained} Glory)`;
                setChronicleBirthGifts(prev => prev + 1);
              } else {
                yearOutcomeText = `전투 생존 완료 (+${res.gloryGained} Glory)`;
              }
            }
          }
        }
        else if (pending.type === 'gf_raid_survival') {
          let sDead = false;
          let sGlory = 25;
          let sCause = "";
          let sLog = "";

          if (d20 === 1) {
            sDead = true;
            sCause = `${pending.enemyName} 습격 방어 중 전사`;
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 안타깝게도 밀려오는 적들을 막아서다 격전 중 장렬히 전사하셨습니다.`;
          } else if (d20 === 2) {
            sDead = true;
            const retiredYears = rollD20();
            sCause = `부상 은퇴 (수도원에서 ${retiredYears}년 후 영면)`;
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 불구가 되는 중상을 입어 은퇴 후 수도원에 귀의합니다. ${retiredYears}년 뒤 조용히 영면에 드십니다.`;
          } else if (d20 === 3) {
            sDead = true;
            sCause = `포로 압송 및 실종`;
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 적들의 포로가 되어 머나먼 이교의 땅으로 납치되었으며 끝내 돌아오지 못했습니다.`;
          } else if (d20 <= 5) {
            sGlory += 100;
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 기적적으로 습격의 대장을 척살하는 위대한 영웅적 무훈을 세우며 살아남았습니다! (+${sGlory} Glory)`;
          } else {
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 무사히 습격을 격퇴하고 칼날 끝에서 살아남았습니다. (+${sGlory} Glory)`;
          }

          if (sDead) {
            setGfDead(true);
            setGrandfatherDeathYear(pending.yr);
            setGrandfatherDeathCause(sCause);
            setInteractiveStage('gf_dead');
            yearOutcomeText = `사망: ${sCause}`;
            logMsg += "\n" + sLog;
          } else {
            setGrandfatherGlory(prev => prev + sGlory);
            const targetEnemy = pending.enemyName === "Saxons" ? "saxons" : "moors";
            setChroniclePendingRoll({
              type: 'gf_hate_roll',
              yr: pending.yr,
              logPrefix: logMsg + "\n" + sLog,
              hateType: 'd3',
              hateTarget: targetEnemy,
              gloryGained: sGlory
            });
            setChronicleManualD20('');
            setChronicleManualD6('');
            return;
          }
        }
        else if (pending.type === 'gf_poitiers') {
          if (d20 === 1) {
            setGfDead(true);
            setGrandfatherDeathYear(pending.yr);
            setGrandfatherDeathCause("Poitiers 전사 (Combat)");
            setInteractiveStage('gf_dead');
            setGrandfatherGlory(prev => prev + 1400);
            logMsg += `🗡️ 포아티에 주사위 ${d20} - 전설적인 전공을 기사단에 남기며 장렬히 전사하셨습니다! (+1400 Glory)`;
            yearOutcomeText = "전사: 포아티에 전투 장렬한 전사 (+1400 Glory)";
          } else if (d20 <= 11) {
            setGfDead(true);
            setGrandfatherDeathYear(pending.yr);
            setGrandfatherDeathCause("Poitiers 전사 (Combat)");
            setInteractiveStage('gf_dead');
            setGrandfatherGlory(prev => prev + 400);
            logMsg += `🗡️ 포아티에 주사위 ${d20} - 전투 중 영예롭게 전사하셨습니다. (+400 Glory)`;
            yearOutcomeText = "전사: 포아티에 격전 중 전사 (+400 Glory)";
          } else if (d20 === 12) {
            setGfDead(true);
            setGrandfatherDeathYear(pending.yr);
            setGrandfatherDeathCause("스페인 압송 포로 (Captured)");
            setInteractiveStage('gf_dead');
            setGrandfatherGlory(prev => prev + 400);
            logMsg += `🔗 포아티에 주사위 ${d20} - 포로로 잡혀 무어인의 땅(스페인)으로 압송되어 소식이 끊겼습니다. (+400 Glory)`;
            yearOutcomeText = "포로: 무어인 땅으로 압송 실종 (+400 Glory)";
          } else if (d20 === 13) {
            setGrandfatherGlory(prev => prev + 500);
            setChroniclePendingRoll({
              type: 'gf_hate_roll',
              yr: pending.yr,
              logPrefix: logMsg + `✨ 포아티에 주사위 ${d20} - 적진을 돌파하는 영웅적 전공을 세우며 전리품을 획득했습니다! (+500 Glory)`,
              hateType: 'd3',
              hateTarget: 'moors',
              gloryGained: 500,
              poitiersOutcome: 'hero'
            });
            setChronicleManualD20('');
            setChronicleManualD6('');
            return;
          } else if (d20 <= 19) {
            setGrandfatherGlory(prev => prev + 400);
            setChroniclePendingRoll({
              type: 'gf_hate_roll',
              yr: pending.yr,
              logPrefix: logMsg + `🛡️ 포아티에 주사위 ${d20} - 무사히 생존하여 대승리에 공헌했습니다. (+400 Glory)`,
              hateType: 'd3',
              hateTarget: 'moors',
              gloryGained: 400,
              poitiersOutcome: 'survive'
            });
            setChronicleManualD20('');
            setChronicleManualD6('');
            return;
          } else {
            setGrandfatherGlory(prev => prev + 900);
            setChroniclePendingRoll({
              type: 'gf_hate_roll',
              yr: pending.yr,
              logPrefix: logMsg + `👑 포아티에 주사위 ${d20} - 전장 한가운데서 침공 사령관 에미르 압둘 라흐만을 결투로 베는 불멸의 업적을 세우셨습니다! (+900 Glory)`,
              hateType: 'd3',
              hateTarget: 'moors',
              gloryGained: 900,
              poitiersOutcome: 'legend'
            });
            setChronicleManualD20('');
            setChronicleManualD6('');
            return;
          }
        }
        else if (pending.type === 'f_combat_survival') {
          const runFCombatSurvival = (eventName, battleModifier = 0, isVictor = true, standardGlory = 100) => {
            const rollVal = d20;
            const modifiedRoll = rollVal + battleModifier;
            let dead = false;
            let gloryGained = standardGlory * (isVictor ? 2 : 1);
            let cause = "";
            let rollDescText = "";

            if (modifiedRoll <= 0) {
              dead = true;
              gloryGained += 1000;
              cause = "전투 중 장렬한 전사 (Combat)";
              rollDescText = `🗡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 전공을 치하받으며 장렬히 전사하셨습니다! (+${gloryGained} Glory)`;
            } else if (modifiedRoll === 1) {
              dead = true;
              cause = "전투 중 전사 (Combat)";
              rollDescText = `🗡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 전투 중 아쉽게 전사하셨습니다. (+${gloryGained} Glory)`;
            } else if (modifiedRoll === 2) {
              dead = true;
              const retiredYears = rollD20();
              cause = `부상 은퇴 (수도원에서 ${retiredYears}년 후 영면)`;
              rollDescText = `🏥 주사위 ${rollVal}(보정 ${modifiedRoll}) - 불구가 되는 중상을 입어 은퇴 후 에히터나흐 수도원으로 들어갑니다. ${retiredYears}년 뒤 수도원에서 조용히 영면에 드십니다. (+${gloryGained} Glory)`;
            } else if (modifiedRoll === 3) {
              dead = true;
              cause = "포로 압송 및 실종 (Captured)";
              rollDescText = `🔗 주사위 ${rollVal}(보정 ${modifiedRoll}) - 포로로 잡혀 적국으로 압송되었으며 영영 돌아오지 못했습니다. (+${gloryGained} Glory)`;
            } else if (modifiedRoll <= 5) {
              gloryGained += 100;
              rollDescText = `✨ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 기적적으로 생존하고 전장에 큰 기여를 한 영웅적 전공을 세웠습니다! (+${gloryGained} Glory)`;
            } else {
              rollDescText = `🛡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 치열한 전투 속에서 무사히 살아남으셨습니다. (+${gloryGained} Glory)`;
            }

            return { dead, gloryGained, cause, rollDescText };
          };

          const res = runFCombatSurvival(pending.eventName, pending.battleModifier, pending.isVictor, pending.standardGlory);
          logMsg += res.rollDescText;

          if (res.dead) {
            setFatherDead(true);
            setFatherDeathYear(pending.yr);
            setFatherDeathCause(res.cause);
            setInteractiveStage('f_dead');
            yearOutcomeText = `사망: ${res.cause}`;
          } else {
            setFatherGlory(prev => prev + res.gloryGained);
            
            let needHateRoll = false;
            let hateType = "";
            let hateTarget = "";
            
            if (pending.customOutcome === 'saxons_hate_d6') {
              needHateRoll = true;
              hateType = 'd6';
              hateTarget = 'saxons';
            } else if (pending.hateEnemy) {
              needHateRoll = true;
              hateType = 'd3';
              hateTarget = pending.hateEnemy;
            }

            if (needHateRoll) {
              setChroniclePendingRoll({
                type: 'f_hate_roll',
                yr: pending.yr,
                logPrefix: logMsg,
                hateType,
                hateTarget,
                gloryGained: res.gloryGained,
                customOutcome: pending.customOutcome
              });
              setChronicleManualD20('');
              setChronicleManualD6('');
              return;
            } else {
              if (pending.customOutcome === 'viviens_baptism') {
                setFatherGlory(prev => prev + 25);
                logMsg += `\n  └ ⛪ 이교도 귀족 위비앙 부부의 역사적인 기독교 세례 성사에서 가문의 명예 하객 대열을 호위하셨습니다! (+25 Glory)`;
                yearOutcomeText = `위비앙 세례식 가문 호위 및 대성당 참석 (+75 Glory)`;
              } else {
                yearOutcomeText = `전투 생존 완료 (+${res.gloryGained} Glory)`;
              }
            }
          }
        }
        else if (pending.type === 'f_raid_survival') {
          let sDead = false;
          let sGlory = 25;
          let sCause = "";
          let sLog = "";

          if (d20 === 1) {
            sDead = true;
            sCause = `${pending.enemyName} 습격 방어 중 전사`;
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 안타깝게도 밀려오는 적들을 막아서다 격전 중 장렬히 전사하셨습니다.`;
          } else if (d20 === 2) {
            sDead = true;
            const retiredYears = rollD20();
            sCause = `부상 은퇴 (수도원에서 ${retiredYears}년 후 영면)`;
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 불구가 되는 중상을 입어 은퇴 후 수도원에 귀의합니다. ${retiredYears}년 뒤 조용히 영면에 드십니다.`;
          } else if (d20 === 3) {
            sDead = true;
            sCause = `포로 압송 및 실종`;
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 적들의 포로가 되어 머나먼 이교의 땅으로 납치되었으며 끝내 돌아오지 못했습니다.`;
          } else if (d20 <= 5) {
            sGlory += 100;
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 기적적으로 습격의 대장을 척살하는 위대한 영웅적 무훈을 세우며 살아남았습니다! (+${sGlory} Glory)`;
          } else {
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 무사히 습격을 격퇴하고 칼날 끝에서 살아남았습니다. (+${sGlory} Glory)`;
          }

          if (sDead) {
            setFatherDead(true);
            setFatherDeathYear(pending.yr);
            setFatherDeathCause(sCause);
            setInteractiveStage('f_dead');
            yearOutcomeText = `사망: ${sCause}`;
            logMsg += "\n" + sLog;
          } else {
            setFatherGlory(prev => prev + sGlory);
            const targetEnemy = pending.enemyName === "Saxons" ? "saxons" : pending.enemyName === "Moors" ? "moors" : "danes";
            setChroniclePendingRoll({
              type: 'f_hate_roll',
              yr: pending.yr,
              logPrefix: logMsg + "\n" + sLog,
              hateType: 'd3',
              hateTarget: targetEnemy,
              gloryGained: sGlory
            });
            setChronicleManualD20('');
            setChronicleManualD6('');
            return;
          }
        }

        setAncestorRollLog(prev => [...prev, logMsg]);
        setCurrentYearRolled(true);
        setCurrentYearResultText(yearOutcomeText);
        setChronicleManualD20('');
        setChronicleManualD6('');
        return;
      }

      let d20 = parseInt(chronicleManualD20);
      if (isNaN(d20) || d20 < 1 || d20 > 20) {
        d20 = Math.floor(Math.random() * 20) + 1;
      }

      const rollD20 = () => Math.floor(Math.random() * 20) + 1;
      const rollD6 = () => {
        const val = parseInt(chronicleManualD6);
        if (!isNaN(val) && val >= 1 && val <= 6) return val;
        return Math.floor(Math.random() * 6) + 1;
      };
      const rollD3 = () => {
        const val = parseInt(chronicleManualD6);
        if (!isNaN(val) && val >= 1 && val <= 3) return val;
        return Math.floor(Math.random() * 3) + 1;
      };

      let logMsg = "";
      let yearOutcomeText = "";
      const yr = interactiveYear;

      if (interactiveStage === 'gf_running') {
        const runGfCombatSurvival = (eventName, battleModifier = 0, isVictor = true, standardGlory = 100) => {
          const rollVal = rollD20();
          const modifiedRoll = rollVal + battleModifier;
          let dead = false;
          let gloryGained = standardGlory * (isVictor ? 2 : 1);
          let cause = "";
          let rollDescText = "";

          if (modifiedRoll <= 0) {
            dead = true;
            gloryGained += 1000;
            cause = "전투 중 장렬한 전사 (Combat)";
            rollDescText = `🗡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 전공을 치하받으며 장렬히 전사하셨습니다! (+${gloryGained} Glory)`;
          } else if (modifiedRoll === 1) {
            dead = true;
            cause = "전투 중 전사 (Combat)";
            rollDescText = `🗡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 전투 중 아쉽게 전사하셨습니다. (+${gloryGained} Glory)`;
          } else if (modifiedRoll === 2) {
            dead = true;
            const retiredYears = rollD20();
            cause = `부상 은퇴 (수도원에서 ${retiredYears}년 후 영면)`;
            rollDescText = `🏥 주사위 ${rollVal}(보정 ${modifiedRoll}) - 불구가 되는 중상을 입어 은퇴 후 에히터나흐 수도원으로 들어갑니다. ${retiredYears}년 뒤 수도원에서 조용히 영면에 드십니다. (+${gloryGained} Glory)`;
          } else if (modifiedRoll === 3) {
            dead = true;
            cause = "포로 압송 및 실종 (Captured)";
            rollDescText = `🔗 주사위 ${rollVal}(보정 ${modifiedRoll}) - 포로로 잡혀 적국으로 압송되었으며 영영 돌아오지 못했습니다. (+${gloryGained} Glory)`;
          } else if (modifiedRoll <= 5) {
            gloryGained += 100;
            rollDescText = `✨ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 기적적으로 생존하고 전장에 큰 기여를 한 영웅적 전공을 세웠습니다! (+${gloryGained} Glory)`;
          } else {
            rollDescText = `🛡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 치열한 전투 속에서 무사히 살아남으셨습니다. (+${gloryGained} Glory)`;
          }

          return { dead, gloryGained, cause, rollDescText };
        };

        const runGfOrdinaryYear = (eventDescription, enemyName = "Saxons") => {
          let gloryGained = 0;
          let dead = false;
          let cause = "";
          let rollDescText = "";

          if (d20 === 1) {
            dead = true;
            cause = "예기치 못한 급사 (Ordinary Year Death)";
            rollDescText = `💀 [주사위 ${d20}] - 평화로운 겨울철에 갑작스러운 불의의 사고 혹은 급병으로 서거하셨습니다.`;
          } else if (d20 <= 17) {
            rollDescText = `🏰 [주사위 ${d20}] - 기사로서 성채 수비대(Garrison) 의무 및 영지 보초 임무를 평온히 완수했습니다.`;
          } else if (d20 <= 19) {
            gloryGained = 50;
            rollDescText = `✨ [주사위 ${d20}] - 봉토를 훌륭히 순찰하고 주군의 신임을 받아 기념비적이고 명예로운 무훈을 올렸습니다! (+50 Glory)`;
          } else {
            return { isRaidPending: true };
          }

          return { dead, gloryGained, cause, rollDescText };
        };

        const event = getEventText(yr);
        if (yr === 723) {
          if (d20 <= 10) {
            logMsg = `🏰 723년: [역사] ${event}\n  └ [주사위 ${d20}] - 후방 수비대(Garrison) 의무를 안전하게 수행했습니다.`;
            yearOutcomeText = "후방 수비대 의무 완수 (무사 생존)";
          } else {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 723,
              firstRoll: d20,
              logPrefix: `🏰 723년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 작센 습격전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: 0,
              isVictor: true,
              standardGlory: 25,
              hateEnemy: 'saxons'
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 724) {
          // 룰북 Anno 724: 이벤트 테이블 없음 — "교황이 카롤루스 마르텔에게 성 베드로 성유물 기증, 부친 탄생"
          // 주사위 판정 없이 자동 통과
          logMsg = `🏰 724년: [역사] ${event}\n  └ 🍼 올해는 가문의 큰 경사 — 훗날 기사가 될 부친 제라르(Gerard)께서 탄생하셨습니다! 조부님은 영지를 지키며 이 기쁜 소식을 맞이하셨습니다.`;
          yearOutcomeText = "부친 탄생 (이벤트 없음 — 자동 통과)";
        } else if (yr === 725) {
          if (d20 === 1) {
            setGfDead(true);
            setGrandfatherDeathYear(yr);
            setGrandfatherDeathCause("질병사 (Illness)");
            setInteractiveStage('gf_dead');
            logMsg = `🏰 725년: [역사] ${event}\n  └ 💀 행군 도중 돌발적인 질병으로 급거 서거하셨습니다.`;
            yearOutcomeText = "사망: 질병사";
          } else if (d20 <= 10) {
            logMsg = `🏰 725년: [역사] ${event}\n  └ 후방 성채 경계 근무를 수행했습니다.`;
            yearOutcomeText = "후방 성채 수비 완료";
          } else {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 725,
              firstRoll: d20,
              logPrefix: `🏰 725년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 오툉 포위 공방전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: 0,
              isVictor: false,
              standardGlory: 50,
              hateEnemy: 'moors'
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 726 || yr === 727) {
          // 룰북 Anno 726/727: "No noteworthy events" — 이벤트 테이블 없음, 자동 통과
          logMsg = `🏰 ${yr}년: [역사] ${event}\n  └ 📖 주목할 만한 사건 없음(No noteworthy events). 조부님은 영지를 평온히 지키셨습니다.`;
          yearOutcomeText = `${yr}년 — 평온한 한 해 (이벤트 없음, 자동 통과)`;
        } else if (yr === 728) {
          if (d20 === 1) {
            setGfDead(true);
            setGrandfatherDeathYear(yr);
            setGrandfatherDeathCause("사고 (Accident)");
            setInteractiveStage('gf_dead');
            logMsg = `🏰 728년: [역사] ${event}\n  └ 💀 불의의 마차 낙마 사고로 서거하셨습니다.`;
            yearOutcomeText = "사망: 낙마 사고";
          } else if (d20 <= 10) {
            logMsg = `🏰 728년: [역사] ${event}\n  └ 후방 영지 보급 호위를 전담했습니다.`;
            yearOutcomeText = "보급 호위 의무 완수";
          } else if (d20 <= 15) {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 728,
              firstRoll: d20,
              logPrefix: `🏰 728년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 아키텐 결전(오도 공작 응징전)에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: -1,
              isVictor: true,
              standardGlory: 100,
              hateEnemy: null
            });
            setChronicleManualD20('');
            return;
          } else {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 728,
              firstRoll: d20,
              logPrefix: `🏰 728년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 북방 작센 대공세에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: 0,
              isVictor: true,
              standardGlory: 100,
              hateEnemy: 'saxons'
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 729) {
          if (d20 === 1) {
            setGfDead(true);
            setGrandfatherDeathYear(yr);
            setGrandfatherDeathCause("사냥 사고 (Hunting Accident)");
            setInteractiveStage('gf_dead');
            logMsg = `🏰 729년: [역사] ${event}\n  └ 💀 사냥 중 멧돼지의 기습을 받아 서거하셨습니다.`;
            yearOutcomeText = "사망: 멧돼지 습격 사고";
          } else if (d20 <= 10) {
            logMsg = `🏰 729년: [역사] ${event}\n  └ 성벽 경계 및 보초 근무를 수행했습니다.`;
            yearOutcomeText = "성벽 경계 근무 완수";
          } else if (d20 <= 15) {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 729,
              firstRoll: d20,
              logPrefix: `🏰 729년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - Vauclere 전투에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: -1,
              isVictor: false,
              standardGlory: 100,
              hateEnemy: 'saxons'
            });
            setChronicleManualD20('');
            return;
          } else {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 729,
              firstRoll: d20,
              logPrefix: `🏰 729년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - Barbel Tower 공방전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: -1,
              isVictor: true,
              standardGlory: 100,
              hateEnemy: 'saxons'
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 730) {
          // 룰북 Anno 730: 이벤트 테이블 없음 (Gaufrey 전설: 바르벨탑 해방 & 플뢰르드핀 세례) — 자동 통과
          logMsg = `🏰 730년: [역사] ${event}\n  └ 📖 바르벨탑 전투가 프랑크군의 승리로 끝나고 색슨 공주 플뢰르드핀이 세례를 받았습니다. 조부님은 영지를 지키셨습니다.`;
          yearOutcomeText = "730년 — 이벤트 없음 (자동 통과)";
        } else if (yr === 731) {
          if (d20 === 1) {
            setGfDead(true);
            setGrandfatherDeathYear(yr);
            setGrandfatherDeathCause("질병사 (Illness)");
            setInteractiveStage('gf_dead');
            logMsg = `🏰 731년: [역사] ${event}\n  └ 💀 군영 내 전염병으로 돌연 서거하셨습니다.`;
            yearOutcomeText = "사망: 군영 전염병";
          } else if (d20 <= 15) {
            logMsg = `🏰 731년: [역사] ${event}\n  └ 후방 수비대 임무를 마쳤습니다.`;
            yearOutcomeText = "수비대 복무 완료";
          } else {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 731,
              firstRoll: d20,
              logPrefix: `🏰 731년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 오리돈 포위 공성전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: 0,
              isVictor: true,
              standardGlory: 50,
              hateEnemy: null
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 732) {
          if (d20 === 1) {
            setGfDead(true);
            setGrandfatherDeathYear(yr);
            setGrandfatherDeathCause("낙사 (Accident)");
            setInteractiveStage('gf_dead');
            logMsg = `🏰 732년: [역사] ${event}\n  └ 💀 전투 직전 말에서 떨어져 서거하셨습니다.`;
            yearOutcomeText = "사망: 낙마사";
          } else if (d20 <= 5) {
            logMsg = `🏰 732년: [역사] ${event}\n  └ 기사단 후방 보급을 호위했습니다.`;
            yearOutcomeText = "보급 호위 완료 (전투 불참)";
          } else {
            setChroniclePendingRoll({
              type: 'gf_poitiers',
              yr: 732,
              firstRoll: d20,
              logPrefix: `🏰 732년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 투르-포아티에 역사적 대전투에 참전합니다. 생존 판정이 필요합니다.\n`
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 733 || yr === 734) {
          // 룰북 Anno 733/734: 이벤트 테이블 없음 (도렐과 베통 전설, 돈 드 낭퇴유 귀환) — 자동 통과
          logMsg = `🏰 ${yr}년: [역사] ${event}\n  └ 📖 이벤트 테이블 없음. 조부님은 영지를 수호하며 역사의 흐름을 지켜보셨습니다.`;
          yearOutcomeText = `${yr}년 — 이벤트 없음 (자동 통과)`;
        } else if (yr === 735) {
          if (d20 === 1) {
            setGfDead(true);
            setGrandfatherDeathYear(yr);
            setGrandfatherDeathCause("사망 (Feud)");
            setInteractiveStage('gf_dead');
            logMsg = `🏰 735년: [역사] ${event}\n  └ 💀 가문 불화 결투 도중 서거하셨습니다.`;
            yearOutcomeText = "사망: 가문 불화 결투 사망";
          } else if (d20 <= 5) {
            logMsg = `🏰 735년: [역사] ${event}\n  └ 쾰른 경비 의무를 마쳤습니다.`;
            yearOutcomeText = "쾰른 성벽 경비";
          } else if (d20 <= 12) {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 735,
              firstRoll: d20,
              logPrefix: `🏰 735년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 루시옹 대결전(제라르 공작 결투전)에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: 0,
              isVictor: true,
              standardGlory: 50,
              hateEnemy: null
            });
            setChronicleManualD20('');
            return;
          } else if (d20 <= 15) {
            logMsg = `🏰 735년: [역사] ${event}\n  └ ⚖️ 위옹 경의 아모르 스캔들 재판에서 위증을 강요받아 정직함이 무너집니다. (Just 수치 하락)`;
            yearOutcomeText = "사법 재판 명예 실추 (Just 타격)";
          } else {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 735,
              firstRoll: d20,
              logPrefix: `🏰 735년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 보르도 공성전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: 0,
              isVictor: true,
              standardGlory: 50,
              hateEnemy: null
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 736) {
          if (d20 === 1) {
            setGfDead(true);
            setGrandfatherDeathYear(yr);
            setGrandfatherDeathCause("질병사 (Illness)");
            setInteractiveStage('gf_dead');
            logMsg = `🏰 736년: [역사] ${event}\n  └ 💀 진중의 무서운 열병으로 서거하셨습니다.`;
            yearOutcomeText = "사망: 진중 열병";
          } else if (d20 <= 5) {
            logMsg = `🏰 736년: [역사] ${event}\n  └ 기사단 초소 근무를 섰습니다.`;
            yearOutcomeText = "초소 근무 복무";
          } else if (d20 <= 10) {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 736,
              firstRoll: d20,
              logPrefix: `🏰 736년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 제라르군 매복 전투에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: -1,
              isVictor: false,
              standardGlory: 100,
              hateEnemy: null
            });
            setChronicleManualD20('');
            return;
          } else {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 736,
              firstRoll: d20,
              logPrefix: `🏰 736년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 아를 해방전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: 0,
              isVictor: true,
              standardGlory: 50,
              hateEnemy: 'moors'
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 737) {
          if (d20 === 1) {
            setGfDead(true);
            setGrandfatherDeathYear(yr);
            setGrandfatherDeathCause("사고 (Accident)");
            setInteractiveStage('gf_dead');
            logMsg = `🏰 737년: [역사] ${event}\n  └ 💀 성벽 수축 공사 도중 돌에 깔려 서거하셨습니다.`;
            yearOutcomeText = "사망: 돌 압사";
          } else if (d20 <= 5) {
            logMsg = `🏰 737년: [역사] ${event}\n  └ 영지 가드 근무를 섰습니다.`;
            yearOutcomeText = "영지 가드 순찰";
          } else if (d20 <= 10) {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 737,
              firstRoll: d20,
              logPrefix: `🏰 737년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 제라르 반란 잔당전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: -1,
              isVictor: false,
              standardGlory: 100,
              hateEnemy: null
            });
            setChronicleManualD20('');
            return;
          } else {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 737,
              firstRoll: d20,
              logPrefix: `🏰 737년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 아비뇽 대참화(징벌 공방전)에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: 0,
              isVictor: true,
              standardGlory: 50,
              hateEnemy: null,
              customOutcome: 'cruel_trait'
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 738) {
          if (d20 === 1) {
            setGfDead(true);
            setGrandfatherDeathYear(yr);
            setGrandfatherDeathCause("사망 (Feud)");
            setInteractiveStage('gf_dead');
            logMsg = `🏰 738년: [역사] ${event}\n  └ 💀 라이벌 가문의 자객에게 급습받아 서거하셨습니다.`;
            yearOutcomeText = "사망: 자객 습격 사망";
          } else if (d20 <= 10) {
            logMsg = `🏰 738년: [역사] ${event}\n  └ 쾰른 성 수비대에 소집되었습니다.`;
            yearOutcomeText = "쾰른 성벽 경계근무";
          } else if (d20 <= 15) {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 738,
              firstRoll: d20,
              logPrefix: `🏰 738년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 부르고뉴 무어인전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: -1,
              isVictor: true,
              standardGlory: 100,
              hateEnemy: 'moors'
            });
            setChronicleManualD20('');
            return;
          } else {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 738,
              firstRoll: d20,
              logPrefix: `🏰 738년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 보르들레 보복 습격전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: 0,
              isVictor: true,
              standardGlory: 25,
              hateEnemy: null
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 739) {
          if (d20 === 1) {
            setGfDead(true);
            setGrandfatherDeathYear(yr);
            setGrandfatherDeathCause("행방불명 (Disappeared)");
            setInteractiveStage('gf_dead');
            logMsg = `🏰 739년: [역사] ${event}\n  └ 💀 원정길의 수풀 속에서 실종되시어 돌아오지 못했습니다.`;
            yearOutcomeText = "실종: 셉티마니아 숲 속 행방불명";
          } else if (d20 <= 5) {
            logMsg = `🏰 739년: [역사] ${event}\n  └ 후방 수비 의무를 원활하게 수행했습니다.`;
            yearOutcomeText = "후방 지원 완수";
          } else if (d20 <= 10) {
            logMsg = `🏰 739년: [역사] ${event}\n  └ 🛡️ 실패로 끝난 프로방스 아를 포위전에 참전했으나 전투 없이 퇴각했습니다.`;
            yearOutcomeText = "아를 실패 포위전 무사 퇴각 (생존, 판정 없음)";
          } else {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 739,
              firstRoll: d20,
              logPrefix: `🏰 739년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 셉티마니아 대공성전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: 0,
              isVictor: true,
              standardGlory: 50,
              hateEnemy: null,
              customOutcome: 'birth_gift'
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 740) {
          if (d20 === 1) {
            setGfDead(true);
            setGrandfatherDeathYear(yr);
            setGrandfatherDeathCause("덴마크 전사 (Combat)");
            setInteractiveStage('gf_dead');
            logMsg = `🏰 740년: [역사] ${event}\n  └ 💀 덴마크 상륙 도중 전함 위에서 적의 도끼에 스러지셨습니다.`;
            yearOutcomeText = "전사: 바이킹 상륙 전함 백병전 사망";
          } else if (d20 <= 10) {
            logMsg = `🏰 740년: [역사] ${event}\n  └ 후방 성벽을 지켰습니다.`;
            yearOutcomeText = "로슈브룬 후방 방어";
          } else {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 740,
              firstRoll: d20,
              logPrefix: `🏰 740년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 덴마크인 습격 방어전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: 0,
              isVictor: true,
              standardGlory: 50,
              hateEnemy: 'danes',
              customOutcome: 'danes_hate'
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 741) {
          logMsg = `🏰 741년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setGfDead(true);
            setGrandfatherDeathYear(yr);
            setGrandfatherDeathCause("질병사 (Illness)");
            setInteractiveStage('gf_dead');
            logMsg += `💀 주군 카롤루스 마르텔의 부고를 듣고 상심 속에 병사하셨습니다.`;
            yearOutcomeText = "사망: 주군 서거 상심에 병사";
          } else if (d20 <= 5) {
            logMsg += `쾰른에서 애도 기간을 가졌습니다.`;
            yearOutcomeText = "쾰른 애도 복무";
          } else if (d20 <= 10) {
            setGrandfatherGlory(prev => prev + 50);
            logMsg += `🛡️ 반역 왕자의 병력을 기습해 체포에 일조했습니다! (+50 Glory)`;
            yearOutcomeText = "그리포 진압 공헌 (+50 Glory)";
          } else {
            setGrandfatherGlory(prev => prev + 50);
            logMsg += `🕯️ 카롤루스 마르텔의 장엄한 아르덴 성당 매장식에 기치를 들었습니다. (+50 Glory)`;
            yearOutcomeText = "국왕급 주군 대장례식 기치 배정 (+50 Glory)";
          }
        } else if (yr === 742) {
          logMsg = `🏰 742년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setGfDead(true);
            setGrandfatherDeathYear(yr);
            setGrandfatherDeathCause("노환 (Old Age)");
            setInteractiveStage('gf_dead');
            logMsg += `💀 주군들의 결혼 잔치 직후 노환으로 평화로이 서거하셨습니다.`;
            yearOutcomeText = "서거: 결혼식 하객 복귀 중 노환 영면";
          } else if (d20 <= 10) {
            logMsg += `축제 기간 영지 순찰을 담당했습니다.`;
            yearOutcomeText = "축제 영지 보초";
          } else {
            setGrandfatherGlory(prev => prev + 25);
            logMsg += `🎉 국왕과 대귀족들이 모인 성대한 연회에서 가문의 권세를 떨쳤습니다. (+25 Glory)`;
            yearOutcomeText = "국왕 연회 공식 하객 참석 (+25 Glory)";
          }
        } else if (yr === 743) {
          if (d20 === 1) {
            setGfDead(true);
            setGrandfatherDeathYear(yr);
            setGrandfatherDeathCause("바이에른 전사 (Combat)");
            setInteractiveStage('gf_dead');
            logMsg = `🏰 743년: [역사] ${event}\n  └ 💀 알프스 고갯길에서 바이에른 보병의 기습을 받아 전사하셨습니다.`;
            yearOutcomeText = "전사: 바이에른 고지 기습 전사";
          } else if (d20 <= 5) {
            logMsg = `🏰 743년: [역사] ${event}\n  └ 가문 영지를 수호했습니다.`;
            yearOutcomeText = "아르덴 영지 수호";
          } else if (d20 <= 10) {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 743,
              firstRoll: d20,
              logPrefix: `🏰 743년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 레겐스부르크 결전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: -1,
              isVictor: true,
              standardGlory: 100,
              hateEnemy: null
            });
            setChronicleManualD20('');
            return;
          } else if (d20 <= 15) {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 743,
              firstRoll: d20,
              logPrefix: `🏰 743년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 작센 정벌전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: 0,
              isVictor: true,
              standardGlory: 25,
              hateEnemy: 'saxons'
            });
            setChronicleManualD20('');
            return;
          } else {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 743,
              firstRoll: d20,
              logPrefix: `🏰 743년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 아키텐 진압전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: 0,
              isVictor: true,
              standardGlory: 25,
              hateEnemy: null
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 744) {
          if (d20 <= 10) {
            logMsg = `🏰 744년: [역사] ${event}\n  └ 노장이 되어 고향 영지를 지켰습니다.`;
            yearOutcomeText = "노장 은퇴 준비 보초";
          } else if (d20 <= 14) {
            setChroniclePendingRoll({
              type: 'gf_combat_survival',
              yr: 744,
              firstRoll: d20,
              logPrefix: `🏰 744년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 작센 최후 전투에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              battleModifier: 0,
              isVictor: true,
              standardGlory: 25,
              hateEnemy: 'saxons'
            });
            setChronicleManualD20('');
            return;
          } else if (d20 <= 18) {
            setGrandfatherGlory(prev => prev + 25);
            logMsg = `🏰 744년: [역사] ${event}\n  └ 👑 파리 대성당에서 섭정 베르트라다 왕비의 성대하고 역사적인 복귀식 대열에 합류했습니다. (+25 Glory)`;
            yearOutcomeText = "왕비 친위 대열 합류 무훈 (+25 Glory)";
          } else {
            setGrandfatherGlory(prev => prev + 100);
            logMsg = `🏰 744년: [역사] ${event}\n  └ 🔍 피핀 국왕의 어전에서 아키텐 위노 공작이 심어놓은 흉악한 세작을 기지로 생포해 상을 받았습니다! (+100 Glory)`;
            yearOutcomeText = "왕실 스파이 생포 훈장 획득 (+100 Glory)";
          }
        }

        setAncestorRollLog(prev => [...prev, logMsg]);
        setCurrentYearRolled(true);
        setCurrentYearResultText(yearOutcomeText);
        setChronicleManualD20('');
        setChronicleManualD6('');
      }
      else if (interactiveStage === 'f_running') {
        const runFCombatSurvival = (eventName, battleModifier = 0, isVictor = true, standardGlory = 100) => {
          const rollVal = rollD20();
          const modifiedRoll = rollVal + battleModifier;
          let dead = false;
          let gloryGained = standardGlory * (isVictor ? 2 : 1);
          let cause = "";
          let rollDescText = "";

          if (modifiedRoll <= 0) {
            dead = true;
            gloryGained += 1000;
            cause = "전투 중 장렬한 전사 (Combat)";
            rollDescText = `🗡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 전공을 치하받으며 장렬히 전사하셨습니다! (+${gloryGained} Glory)`;
          } else if (modifiedRoll === 1) {
            dead = true;
            cause = "전투 중 전사 (Combat)";
            rollDescText = `🗡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 전투 중 아쉽게 전사하셨습니다. (+${gloryGained} Glory)`;
          } else if (modifiedRoll === 2) {
            dead = true;
            const retiredYears = rollD20();
            cause = `부상 은퇴 (수도원에서 ${retiredYears}년 후 영면)`;
            rollDescText = `🏥 주사위 ${rollVal}(보정 ${modifiedRoll}) - 불구가 되는 중상을 입어 은퇴 후 에히터나흐 수도원으로 들어갑니다. ${retiredYears}년 뒤 수도원에서 조용히 영면에 드십니다. (+${gloryGained} Glory)`;
          } else if (modifiedRoll === 3) {
            dead = true;
            cause = "포로 압송 및 실종 (Captured)";
            rollDescText = `🔗 주사위 ${rollVal}(보정 ${modifiedRoll}) - 포로로 잡혀 적국으로 압송되었으며 영영 돌아오지 못했습니다. (+${gloryGained} Glory)`;
          } else if (modifiedRoll <= 5) {
            gloryGained += 100;
            rollDescText = `✨ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 기적적으로 생존하고 전장에 큰 기여를 한 영웅적 전공을 세웠습니다! (+${gloryGained} Glory)`;
          } else {
            rollDescText = `🛡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 치열한 전투 속에서 무사히 살아남으셨습니다. (+${gloryGained} Glory)`;
          }

          return { dead, gloryGained, cause, rollDescText };
        };

        const runFOrdinaryYear = (eventDescription, enemyName = "Saxons") => {
          let gloryGained = 0;
          let dead = false;
          let cause = "";
          let rollDescText = "";

          if (d20 === 1) {
            dead = true;
            cause = "예기치 못한 급사 (Ordinary Year Death)";
            rollDescText = `💀 [주사위 ${d20}] - 평화로운 겨울철에 갑작스러운 불의의 사고 혹은 급병으로 서거하셨습니다.`;
          } else if (d20 <= 17) {
            rollDescText = `🏰 [주사위 ${d20}] - 기사로서 성채 수비대(Garrison) 의무 및 영지 보초 임무를 평온히 완수했습니다.`;
          } else if (d20 <= 19) {
            gloryGained = 50;
            rollDescText = `✨ [주사위 ${d20}] - 봉토를 훌륭히 순찰하고 주군의 신임을 받아 기념비적이고 명예로운 무훈을 올렸습니다! (+50 Glory)`;
          } else {
            return { isRaidPending: true };
          }

          return { dead, gloryGained, cause, rollDescText };
        };

        const event = getEventText(yr);
        if (yr === 745) {
          logMsg = `👰 745년: [가문] ${event}\n  └ [주사위 ${d20}] - 부친께서 `;
          if (d20 <= 5) {
            setFatherGlory(prev => prev + 100);
            logMsg += `자신의 첩이자 임신 상태인 어머니(어머니께서 임신 소식을 전함)와 혼인하셨습니다. (+100 Glory)`;
            yearOutcomeText = "임신 소식을 전한 어머니와 혼사 성취 (+100 Glory)";
          } else if (d20 <= 10) {
            setFatherGlory(prev => prev + 200);
            logMsg += `주군에 대한 충성스러운 복무의 보상으로 어머니의 손을 건네받아 혼인하셨습니다. (+200 Glory)`;
            yearOutcomeText = "충성 복무의 보상으로 어머니와 혼사 성취 (+200 Glory)";
          } else {
            setFatherGlory(prev => prev + 400);
            logMsg += `라이벌 영주의 딸인 어머니를 납치하여 혼인하셨습니다. (+400 Glory)`;
            yearOutcomeText = "라이벌 영주의 딸인 어머니를 납치하여 혼사 성취 (+400 Glory)";
          }
        } else if (yr === 746) {
          logMsg = `🏰 746년: [가문] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause("전역사 (Illness)");
            setInteractiveStage('f_dead');
            logMsg += `💀 무서운 군영 내 돌림병에 걸려 아들(당신)의 탄생 소식만을 듣고 서거하셨습니다.`;
            yearOutcomeText = "사망: 군영 열병사 (아들 탄생)";
          } else if (d20 <= 10) {
            logMsg += `기쁜 아들(당신)의 탄생을 전장에서 전해 듣고 가문의 축배를 올렸습니다.`;
            yearOutcomeText = "아들 탄생 축하연 (전선 유지)";
          } else if (d20 <= 15) {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 746년: [가문] ${event}\n  └ [1차 주사위 ${d20}] - 셉티마니아 무어인 방어전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (셉티마니아 무어인 방어전)",
              battleModifier: -1,
              isVictor: false,
              standardGlory: 25,
              hateEnemy: 'moors'
            });
            setChronicleManualD20('');
            return;
          } else if (d20 <= 18) {
            setChroniclePendingRoll({
              type: 'f_hate_roll',
              yr,
              logPrefix: `🏰 746년: [역사] ${event}\n  └ [주사위 ${d20}] - 알레마니아 반역자들을 징벌하는 피핀의 대숙청 대열에 참여하셨습니다.\n`,
              hateType: 'd6',
              hateTarget: 'cruel',
              gloryGained: 0
            });
            setChronicleManualD20('');
            setChronicleManualD6('');
            return;
          } else {
            setFatherGlory(prev => prev + 50);
            logMsg += `마침내 아들(당신)의 장엄한 탄생을 직접 보고 기사로서 성인 묘비에 참배하며 믿음을 다짐했습니다. (+1 Love God, +50 Glory)`;
            yearOutcomeText = "아들의 세례식 친히 참석 및 영적인 다짐 (+50 Glory)";
          }
        } else if (yr === 747) {
          logMsg = `🏰 747년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause("순례 중 사망 (Accident)");
            setInteractiveStage('f_dead');
            logMsg += `💀 알프스 산맥을 돌파하던 도중 눈사태로 낙사하셨습니다.`;
            yearOutcomeText = "사망: 알프스 눈사태 조난";
          } else if (d20 <= 10) {
            logMsg += `쾰른 궁정의 보초를 섰습니다.`;
            yearOutcomeText = "쾰른 대정문 보초";
          } else if (d20 <= 18) {
            setFatherGlory(prev => prev + 25);
            logMsg += `카를로만 공의 은퇴길 로마 대순례단에 하객으로 동참해 축복을 목도했습니다. (+25 Glory)`;
            yearOutcomeText = "로마 대주교 순례 가이드 무사 수행 (+25 Glory)";
          } else {
            setFatherDead(true);
            const yearsRet = rollD20();
            setFatherDeathYear(yr + yearsRet);
            setFatherDeathCause("성스러운 은수사 은퇴 (Hermit)");
            setInteractiveStage('f_dead');
            logMsg += `🌲 마인츠 대주교 보니파키우스를 접견한 후 깊은 성령을 깨달아 아르덴 깊은 숲의 은수사(Hermit)로 기꺼이 은퇴하셨습니다. (+1 Love God, 기사 전역, ${yearsRet}년 뒤 임종)`;
            yearOutcomeText = `은퇴: 성직자 접견 후 은수사 전격 은퇴 (${yearsRet}년 뒤 서거)`;
          }
        } else if (yr === 748) {
          const res = runFOrdinaryYear(event, "Moors");
          if (res.isRaidPending) {
            setChroniclePendingRoll({
              type: 'f_raid_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 748년: [역사] ${event}\n  └ 🔥 [1차 주사위 ${d20}] - 국경을 넘나드는 무어 이교도 습격단에 맞서 치열한 영지 방어전을 벌였습니다! 생존 판정이 필요합니다.`,
              enemyName: 'Moors'
            });
            setChronicleManualD20('');
            return;
          }
          logMsg = `🏰 748년: [역사] ${event}\n  └ ${res.rollDescText}`;
          setFatherGlory(prev => prev + res.gloryGained);
          if (res.dead) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause(res.cause);
            setInteractiveStage('f_dead');
            yearOutcomeText = `사망: ${res.cause}`;
          } else {
            yearOutcomeText = `제국 후방 평화 수비 완료 (+${res.gloryGained} Glory)`;
          }
        } else if (yr === 749) {
          logMsg = `🏰 749년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause("바이에른 전사 (Combat)");
            setInteractiveStage('f_dead');
            logMsg += `💀 레겐스부르크 근교의 기습전에서 전사하셨습니다.`;
            yearOutcomeText = "전사: 바이에른 그리포 기습전 전사";
          } else if (d20 <= 10) {
            logMsg += `기사단 행군 대열의 중심을 지켰습니다.`;
            yearOutcomeText = "기사단 행군 복무";
          } else if (d20 <= 18) {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 749년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 바이에른 기습 공세에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (바이에른 기습 공세)",
              battleModifier: -1,
              isVictor: true,
              standardGlory: 100
            });
            setChronicleManualD20('');
            return;
          } else {
            setFatherHonorModifier(prev => prev - 1);
            logMsg += `⚠️ 포로 그리포 왕자의 참모진 경비를 전담했으나, 한밤중 감시망이 뚫려 왕자가 도주하는 명예 훼손을 겪었습니다. (Honor -1)`;
            yearOutcomeText = "경비 누수로 인한 명예 징계 실추 (Honor -1)";
          }
        } else if (yr === 750) {
          logMsg = `🏰 750년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause("작센 전사 (Combat)");
            setInteractiveStage('f_dead');
            logMsg += `💀 작센인들의 숲속 함정에 포위되어 장렬히 전사하셨습니다.`;
            yearOutcomeText = "전사: 작센 매복 함정 전사";
          } else if (d20 <= 10) {
            logMsg += `영지 수비 근무를 섰습니다.`;
            yearOutcomeText = "수비대 근무";
          } else {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 750년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 작센 대전투에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event,
              battleModifier: 0,
              isVictor: true,
              standardGlory: 100,
              customOutcome: 'saxons_hate_d6'
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 751) {
          logMsg = `🏰 751년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause("수비 중 사망 (Feud)");
            setInteractiveStage('f_dead');
            logMsg += `💀 반역도당의 황궁 난입 사태에서 왕가를 지키다 서거하셨습니다.`;
            yearOutcomeText = "사망: 황궁 습격 경호 중 사망";
          } else if (d20 <= 10) {
            logMsg += `즉위식장 외부 바리케이드를 경비했습니다.`;
            yearOutcomeText = "즉위식장 외곽 수비";
          } else if (d20 <= 15) {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 751년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 궁정 반역 세작 처단전에 나섭니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (반역 세작 처단)",
              battleModifier: 0,
              isVictor: true,
              standardGlory: 25
            });
            setChronicleManualD20('');
            return;
          } else {
            setFatherGlory(prev => prev + 50);
            logMsg += `👑 성스러운 피핀 3세의 대관 미사에서 왕의 최측근 근위대로 기립하며 큰 명예를 획득했습니다! (+50 Glory)`;
            yearOutcomeText = "👑 역사적 대관식 황실 대근위대 발탁 (+50 Glory)";
          }
        } else if (yr === 752) {
          const res = runFOrdinaryYear(event, "Moors");
          if (res.isRaidPending) {
            setChroniclePendingRoll({
              type: 'f_raid_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 752년: [역사] ${event}\n  └ 🔥 [1차 주사위 ${d20}] - 국경을 넘나드는 무어 이교도 습격단에 맞서 치열한 영지 방어전을 벌였습니다! 생존 판정이 필요합니다.`,
              enemyName: 'Moors'
            });
            setChronicleManualD20('');
            return;
          }
          logMsg = `🏰 752년: [역사] ${event}\n  └ ${res.rollDescText}`;
          setFatherGlory(prev => prev + res.gloryGained);
          if (res.dead) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause(res.cause);
            setInteractiveStage('f_dead');
            yearOutcomeText = `사망: ${res.cause}`;
          } else {
            yearOutcomeText = `왕실 수습 외교 지원 성공 (+${res.gloryGained} Glory)`;
          }
        } else if (yr === 753) {
          logMsg = `🏰 753년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause("작센 전사 (Combat)");
            setInteractiveStage('f_dead');
            logMsg += `💀 비부르크 산 절벽 전장에서 추락사 혹은 장렬히 전사하셨습니다.`;
            yearOutcomeText = "전사: 비부르크 산 절벽 결사전 사망";
          } else if (d20 <= 10) {
            logMsg += `쾰른 군영을 수호했습니다.`;
            yearOutcomeText = "쾰른 수비대";
          } else if (d20 <= 15) {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 753년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 비부르크 대참패 전장에 낙오되어 고립되었습니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (비부르크 참사)",
              battleModifier: -1,
              isVictor: true,
              standardGlory: 100,
              customOutcome: 'saxons_hate_d6'
            });
            setChronicleManualD20('');
            return;
          } else {
            setFatherGlory(prev => prev + 50);
            logMsg += `🗡️ 국경을 이탈해 암약을 시도하던 반역자 그리포를 검거하는 기사 특별 부대를 이끌어 활약했습니다! (+50 Glory)`;
            yearOutcomeText = "그리포 탈주 검거대 대장 공적 (+50 Glory)";
          }
        } else if (yr === 754) {
          logMsg = `🏰 754년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause("무어 전사 (Combat)");
            setInteractiveStage('f_dead');
            logMsg += `💀 나르본 성문을 부수던 와중 적들의 화포 혹은 불화살을 맞고 전사하셨습니다.`;
            yearOutcomeText = "전사: 나르본 성문 격파 공세 사망";
          } else if (d20 <= 8) {
            logMsg += `교황 전령을 접견하는 경호 임무를 수행했습니다.`;
            yearOutcomeText = "교황 특사 가드 임무";
          } else if (d20 <= 14) {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 754년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 알프스 설산 포위망 돌파전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (알프스 원정 전투)",
              battleModifier: -1,
              isVictor: true,
              standardGlory: 100
            });
            setChronicleManualD20('');
            return;
          } else if (d20 <= 18) {
            setFatherGlory(prev => prev + 25);
            logMsg += `🇮🇹 롬바르디아 영지 약탈 공방전에서 적들의 식량 창고를 털어 군에 공헌했습니다. (+25 Glory)`;
            yearOutcomeText = "롬바르디아 적 기지 창고 파괴 공적 (+25 Glory)";
          } else {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 754년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 나르본 탈환 대작전 선봉에 섭니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (나르본 탈환 대작전)",
              battleModifier: 0,
              isVictor: true,
              standardGlory: 50,
              hateEnemy: 'moors'
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 755) {
          const res = runFOrdinaryYear(event, "Moors");
          if (res.isRaidPending) {
            setChroniclePendingRoll({
              type: 'f_raid_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 755년: [역사] ${event}\n  └ 🔥 [1차 주사위 ${d20}] - 국경을 넘나드는 무어 이교도 습격단에 맞서 치열한 영지 방어전을 벌였습니다! 생존 판정이 필요합니다.`,
              enemyName: 'Moors'
            });
            setChronicleManualD20('');
            return;
          }
          logMsg = `🏰 755년: [역사] ${event}\n  └ ${res.rollDescText}`;
          setFatherGlory(prev => prev + res.gloryGained);
          if (res.dead) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause(res.cause);
            setInteractiveStage('f_dead');
            yearOutcomeText = `사망: ${res.cause}`;
          } else {
            yearOutcomeText = `이탈리아 정의 구현 무공 기록 (+${res.gloryGained} Glory)`;
          }
        } else if (yr === 756) {
          logMsg = `🏰 756년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause("파비아 전사 (Combat)");
            setInteractiveStage('f_dead');
            logMsg += `💀 파비아 성루 기습 작전에서 전사하셨습니다.`;
            yearOutcomeText = "전사: 파비아 공성 사다리 작전 중 사망";
          } else if (d20 <= 10) {
            logMsg += `이탈리아 고지 점령대를 경계했습니다.`;
            yearOutcomeText = "파비아 외곽 고지 경비";
          } else if (d20 <= 15) {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 756년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 파비아 성문 기습 돌격대에 자원합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (파비아 성문 공략)",
              battleModifier: -1,
              isVictor: true,
              standardGlory: 50
            });
            setChronicleManualD20('');
            return;
          } else {
            setFatherGlory(prev => prev + 25);
            logMsg += `⛪ 승리 후 로마 바티칸 성당의 정예 황실 가드로 배정되어 교황령 수호의 증인이 되었습니다. (+25 Glory)`;
            yearOutcomeText = "⛪ 교황청 직속 황실 가드 임명 대업 (+25 Glory)";
          }
        } else if (yr === 757) {
          logMsg = `🏰 757년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause("덴마크 전사 (Combat)");
            setInteractiveStage('f_dead');
            logMsg += `💀 덴마크 상륙 도중 전함 위에서 적의 도끼에 스러지셨습니다.`;
            yearOutcomeText = "전사: 바이킹 상륙 전함 백병전 사망";
          } else if (d20 <= 10) {
            logMsg += `초소 순찰을 돌며 조용히 보냈습니다.`;
            yearOutcomeText = "초소 근무 복무";
          } else if (d20 <= 18) {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 757년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 습격해 온 북방 바이킹과의 격전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (바이킹 결전)",
              battleModifier: 0,
              isVictor: true,
              standardGlory: 100,
              hateEnemy: 'danes'
            });
            setChronicleManualD20('');
            return;
          } else {
            // 룰북 Father 757 Roll 19-20: 1d6 Hate [Danes], Honor -1
            const daneHateRoll = Math.floor(Math.random() * 6) + 1;
            setFatherHates(prev => ({ ...prev, danes: (prev.danes || 0) + daneHateRoll }));
            setFatherHonorModifier(prev => prev - 1);
            logMsg += `⚠️ 덴마크 국왕의 오만한 기습에 걸려 머리가 깎인 채로 사절에서 풀려나는 굴욕을 겪었습니다. (Honor -1, 덴마크인 증오 +${daneHateRoll})`;
            yearOutcomeText = `오욕: 바이킹 포로 수모 및 덴마크 증오 +${daneHateRoll}, Honor -1 획득`;
          }
        } else if (yr === 758) {
          logMsg = `🏰 758년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause("작센 전사 (Combat)");
            setInteractiveStage('f_dead');
            logMsg += `💀 불타는 작센 성읍의 철수 도중 전사하셨습니다.`;
            yearOutcomeText = "전사: 작센 소탕 철수 도중 매복 전사";
          } else if (d20 <= 10) {
            logMsg += `국경 참호를 보수했습니다.`;
            yearOutcomeText = "참호 수축 근무";
          } else if (d20 <= 16) {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 758년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 작센 강제정벌 레이드 종군을 결정합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (작센 강제정벌 레이드)",
              battleModifier: 0,
              isVictor: true,
              standardGlory: 25,
              hateEnemy: 'saxons'
            });
            setChronicleManualD20('');
            return;
          } else {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 758년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 피비린내 나는 작센 대학살 징벌전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (작센 대학살 징벌전)",
              battleModifier: -1,
              isVictor: true,
              standardGlory: 100,
              customOutcome: 'saxons_hate_d6'
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 759) {
          const res = runFOrdinaryYear(event, "Saxons");
          if (res.isRaidPending) {
            setChroniclePendingRoll({
              type: 'f_raid_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 759년: [역사] ${event}\n  └ 🔥 [1차 주사위 ${d20}] - 국경을 넘나드는 작센 이교도 습격단에 맞서 치열한 영지 방어전을 벌였습니다! 생존 판정이 필요합니다.`,
              enemyName: 'Saxons'
            });
            setChronicleManualD20('');
            return;
          }
          logMsg = `🏰 759년: [역사] ${event}\n  └ ${res.rollDescText}`;
          setFatherGlory(prev => prev + res.gloryGained);
          if (res.dead) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause(res.cause);
            setInteractiveStage('f_dead');
            yearOutcomeText = `사망: ${res.cause}`;
          } else {
            yearOutcomeText = `사라센 남부 완전 소탕 축제 참석 (+${res.gloryGained} Glory)`;
          }
        } else if (yr === 760) {
          logMsg = `🏰 760년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause("아키텐 전사 (Combat)");
            setInteractiveStage('f_dead');
            logMsg += `💀 리무쟁 공성망을 공격하던 와중 화살을 맞아 전사하셨습니다.`;
            yearOutcomeText = "전사: 리무쟁 성 포위망 공격 도중 전사";
          } else if (d20 <= 5) {
            logMsg += `후방 포병대를 경호했습니다.`;
            yearOutcomeText = "후방 포병 경호";
          } else if (d20 <= 10) {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 760년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 리무쟁 요새 공성망 돌파전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (리무쟁 공성 돌파)",
              battleModifier: 0,
              isVictor: true,
              standardGlory: 50
            });
            setChronicleManualD20('');
            return;
          } else if (d20 <= 15) {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 760년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 아키텐 수림 게릴라 소탕전에 종군합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (아키텐 수림 게릴라전)",
              battleModifier: 0,
              isVictor: true,
              standardGlory: 25
            });
            setChronicleManualD20('');
            return;
          } else {
            setFatherGlory(prev => prev + 200);
            setFSkipYearsUntil(763);
            setFatherHonorModifier(prev => prev + 1);
            logMsg += `✈️ 쾰른의 백장 란드리 경의 신뢰를 받아 비잔티움 대원정단의 참모로 전격 합류했습니다! 761~762년 동안 콘스탄티노플에서 외교 원정을 수행합니다. (+200 Glory, Honor +1 획득 (가문 유산 자동 반영))`;
            yearOutcomeText = "비잔티움 제국 외교 대사절 특사 발탁 (761~762 스킵) (+200 Glory, Honor +1)";
          }

        } else if (yr === 761) {
          logMsg = `🏰 761년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause("부르주 전사 (Combat)");
            setInteractiveStage('f_dead');
            logMsg += `💀 부르주 성벽 함락 작전에서 적의 불벼락을 맞고 전사하셨습니다.`;
            yearOutcomeText = "전사: 부르주 참호 격파 중 화염 사망";
          } else if (d20 <= 10) {
            logMsg += `기사단 예비 진지를 보수했습니다.`;
            yearOutcomeText = "예비 진지 복무";
          } else if (d20 <= 17) {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 761년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 부르주 요새 대격파 격전에 뛰어듭니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (부르주 격파전)",
              battleModifier: 0,
              isVictor: true,
              standardGlory: 50
            });
            setChronicleManualD20('');
            return;
          } else {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 761년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 브르타뉴 소탕전에 지원합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (브르타뉴 소탕)",
              battleModifier: 0,
              isVictor: true,
              standardGlory: 25
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 762) {
          logMsg = `🏰 762년: [가문] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause("아키텐 전사 (Combat)");
            setInteractiveStage('f_dead');
            logMsg += `💀 아키텐 기습군의 정찰 칼날에 희생되셨습니다.`;
            yearOutcomeText = "전사: 아키텐 정찰 조우 격전 중 사망";
          } else if (d20 <= 10) {
            logMsg += `아르헨돈 요새 수비를 섰습니다.`;
            yearOutcomeText = "아르헨돈 요새 지킴이";
          } else if (d20 <= 15) {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 762년: [가문] ${event}\n  └ [1차 주사위 ${d20}] - 아키텐 산지 약탈 돌파 작전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (아키텐 산악 약탈전)",
              battleModifier: 0,
              isVictor: true,
              standardGlory: 25
            });
            setChronicleManualD20('');
            return;
          } else {
            setFatherGlory(prev => prev + 50);
            logMsg += `👑 왕궁 기사단 훈련 중 어린 롤랑(밀로의 아들)이 왕의 식탁에서 대담하게 고기를 훔쳐 왕을 감탄시키고, 밀로 백작 부부가 왕의 용서를 받아 화해하는 역사적 현장에 배석했습니다. (+50 Glory)`;
            yearOutcomeText = "👑 밀로 부부 화해 및 롤랑의 어전 대담한 해프닝 배석 (+50 Glory)";
          }
        } else if (yr === 763) {
          logMsg = `🏰 763년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause("라 로슈 전사 (Combat)");
            setInteractiveStage('f_dead');
            logMsg += `💀 포위당한 라 로슈 성루에서 적의 발석기에 깔려 전사하셨습니다.`;
            yearOutcomeText = "전사: 성곽 수비 도중 투석 바위 사망";
          } else if (d20 <= 5) {
            logMsg += `화살 통을 날 나르며 공성에 저항했습니다.`;
            yearOutcomeText = "화살 보급 의무 복무";
          } else {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 763년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 성루 총사수 결사방어전에 나섭니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (성루 총사수 결전)",
              battleModifier: -1,
              isVictor: true,
              standardGlory: 50
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 764) {
          logMsg = `🏰 764년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause("툴루즈 전사 (Combat)");
            setInteractiveStage('f_dead');
            logMsg += `💀 툴루즈 성문 돌파 시도 중 성루 위에서 쏟아지는 화약/기름에 전사하셨습니다.`;
            yearOutcomeText = "전사: 툴루즈 공성 기름 화상 사망";
          } else if (d20 <= 10) {
            logMsg += `보급선 방어를 담당했습니다.`;
            yearOutcomeText = "보급 마차 지킴이";
          } else if (d20 <= 15) {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 764년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 오베리 백작의 라 로슈 탈환 공성전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (오베리 백작의 라 로슈 탈환전)",
              battleModifier: 0,
              isVictor: true,
              standardGlory: 50
            });
            setChronicleManualD20('');
            return;
          } else {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 764년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 툴루즈 대공격의 돌격대에 자원합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (툴루즈 대공격)",
              battleModifier: 0,
              isVictor: true,
              standardGlory: 25
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 765) {
          logMsg = `🏰 765년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause("작센 전사 (Combat)");
            setInteractiveStage('f_dead');
            logMsg += `💀 쾰른을 지키는 격돌에서 전사하셨습니다.`;
            yearOutcomeText = "전사: 쾰른 대침공 작센 격파 중 사망";
          } else if (d20 <= 10) {
            logMsg += `수비 진영을 정리했습니다.`;
            yearOutcomeText = "진영 후방 정돈";
          } else if (d20 <= 15) {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 765년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 오트페이유 포위 돌파전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (오트페이유 포위전)",
              battleModifier: 0,
              isVictor: true,
              standardGlory: 50
            });
            setChronicleManualD20('');
            return;
          } else {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 765년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 추장 브로히막스와의 역사적인 브로히막스 결전에 나섭니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (브로히막스 결전)",
              battleModifier: -1,
              isVictor: true,
              standardGlory: 100,
              customOutcome: 'saxons_hate_d6'
            });
            setChronicleManualD20('');
            return;
          }
        } else if (yr === 766) {
          logMsg = `🏰 766년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
          if (d20 === 1) {
            setFatherDead(true);
            setFatherDeathYear(yr);
            setFatherDeathCause("최후의 전사 (Combat)");
            setInteractiveStage('f_dead');
            logMsg += `💀 아들(당신)의 성인식을 몇 달 앞두고 가문의 무훈을 빛내며 성벽 아래에서 전사하셨습니다.`;
            yearOutcomeText = "장렬한 전사: 아들 기사식을 앞두고 에그르몽 결전 전사";
          } else if (d20 <= 10) {
            logMsg += `황실 가드 임무를 다했습니다.`;
            yearOutcomeText = "황실 특수 가드 수행";
          } else if (d20 <= 15) {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 766년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 몽펠리에 포위 공성전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (몽펠리에 공성전)",
              battleModifier: 0,
              isVictor: true,
              standardGlory: 50
            });
            setChronicleManualD20('');
            return;
          } else {
            setChroniclePendingRoll({
              type: 'f_combat_survival',
              yr,
              firstRoll: d20,
              logPrefix: `🏰 766년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 에그르몽 대 격전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
              eventName: event + " (에그르몽 대승)",
              battleModifier: 0,
              isVictor: true,
              standardGlory: 50,
              customOutcome: 'viviens_baptism'
            });
            setChronicleManualD20('');
            return;
          }
        }

        setAncestorRollLog(prev => [...prev, logMsg]);
        setCurrentYearRolled(true);
        setCurrentYearResultText(yearOutcomeText);
        setChronicleManualD20('');
        setChronicleManualD6('');
      }
    } catch (err) {
      console.error(err);
      alert("Error in rollSingleYearInteractive:\n" + err.stack);
    }
  };

  const advanceChronicleYear = () => {
    try {
      if (!currentYearRolled) return;

      saveChronicleHistory();

      const rollD20 = () => Math.floor(Math.random() * 20) + 1;

      if (interactiveStage === 'gf_running') {
        const nextYr = interactiveYear + 1;
        if (nextYr > 744) {
          const deathYr = 744 + rollD20();
          const cause = "평화로운 영면 (Old Age)";
          const finalMsg = `👴 ${deathYr}년: 은퇴한 조부님(시조 ${character.family?.ancestor || '알베르'})께서 평화롭게 침상에서 영면에 드셨습니다.`;

          setGfDead(true);
          setGrandfatherDeathYear(deathYr);
          setGrandfatherDeathCause(cause);
          setAncestorRollLog(prev => [...prev, finalMsg]);
          moveToFatherStage();
        } else {
          setInteractiveYear(nextYr);
          setCurrentYearRolled(false);
          setCurrentYearResultText('');
          setChronicleManualD20('');
        }
      }
      else if (interactiveStage === 'gf_dead') {
        moveToFatherStage();
      }
      else if (interactiveStage === 'f_running') {
        if (fSkipYearsUntil > interactiveYear) {
          const nextYr = fSkipYearsUntil;
          setInteractiveYear(nextYr);
          setCurrentYearRolled(false);
          setCurrentYearResultText('');
          setChronicleManualD20('');
          setFSkipYearsUntil(0);
          setAncestorRollLog(prev => [...prev, `✈️ 761~762년: 부친께서는 란드리 경과 함께 비잔티움 대원정에 참전하시어 머나먼 동방에 계십니다. (Garrison 및 전투 자동 생존)`]);
        } else {
          const nextYr = interactiveYear + 1;
          if (nextYr > 766) {
            const deathYr = 766 + rollD20();
            const cause = "평화로운 영면 (Old Age)";
            const finalMsg = `👴 ${deathYr}년: 은퇴한 아버님(제라르 경)께서 영광스러운 대공의 은퇴 생활 도중 침상에서 평화로이 서거하셨습니다.`;

            setFatherDead(true);
            setFatherDeathYear(deathYr);
            setFatherDeathCause(cause);
            setAncestorRollLog(prev => [...prev, finalMsg]);

            completeInteractiveChronicle(fatherGlory, deathYr, cause);
          } else {
            setInteractiveYear(nextYr);
            setCurrentYearRolled(false);
            setCurrentYearResultText('');
            setChronicleManualD20('');
          }
        }
      }
      else if (interactiveStage === 'f_dead') {
        completeInteractiveChronicle(fatherGlory, fatherDeathYear, fatherDeathCause);
      }
    } catch (err) {
      console.error(err);
      alert("Error in advanceChronicleYear:\n" + err.stack);
    }
  };

  const moveToFatherStage = () => {
    setInteractiveStage('f_running');
    setInteractiveYear(745);
    setCurrentYearRolled(false);
    setCurrentYearResultText('');
    setChronicleManualD20('');

    const inheritedGlory = Math.floor(grandfatherGlory / 10);
    const startGlory = 2500 + inheritedGlory;
    setFatherGlory(startGlory);

    let inhSaxons = grandfatherHates.saxons > 10 ? grandfatherHates.saxons : 0;
    let inhMoors = grandfatherHates.moors > 10 ? grandfatherHates.moors : 0;
    let inhDanes = grandfatherHates.danes > 10 ? grandfatherHates.danes : 0;
    let inhCruel = grandfatherHates.cruel || 0;
    setFatherHates({ saxons: inhSaxons, moors: inhMoors, danes: inhDanes, cruel: inhCruel });

    setAncestorRollLog(prev => {
      const logs = [
        ...prev,
        "",
        "📜 [부친의 생애: 연대기 시작 745년]",
        `🎁 745년: 부친(724년생)께서 성인식을 마치고 조부의 위대한 유산 1/10을 물려받아 ${startGlory} Glory로 당당히 기사 서임을 받으셨습니다.`
      ];
      if (inhCruel > 0) {
        logs.push(`  └ [기질 상속] 조부로부터 무자비함(Cruel) 기질 +${inhCruel}을 물려받았습니다.`);
      }
      return logs;
    });
  };

  const completeInteractiveChronicle = (finalFGlory, finalFDeathYear, finalFDeathCause) => {
    setInteractiveStage('completed');
    setFatherGlory(finalFGlory);
    setFatherDeathYear(finalFDeathYear);
    setFatherDeathCause(finalFDeathCause);

    const summaryLogs = [
      "",
      "🎉 [연대기 결과 요약]",
      `• 조부 최종 영광: ${grandfatherGlory} Glory (생존기간: 702~${grandfatherDeathYear || 744}, Odin/영면: ${grandfatherDeathCause || '평화로운 영면'})`,
      `• 부친 최종 영광: ${finalFGlory} Glory (생존기간: 724~${finalFDeathYear}, 사인: ${finalFDeathCause})`,
      `• 조상으로부터 플레이어 캐릭터(당신)에게 계승될 유산:`,
      `  - 계승 영광: +${Math.floor(finalFGlory / 10)} Glory (부친 영광의 1/10)`,
      fatherHates.saxons > 10 ? `  - 계승 증오: 작센인에 대한 증오 Passion [${fatherHates.saxons}]` : null,
      fatherHates.moors > 10 ? `  - 계승 증오: 이교도(무어인)에 대한 증오 Passion [${fatherHates.moors}]` : null,
      fatherHates.danes > 10 ? `  - 계승 증오: 덴마크인에 대한 증오 Passion [${fatherHates.danes}]` : null,
      fatherHates.cruel && fatherHates.cruel > 0 ? `  - 계승 기질: 무자비함(Cruel) 기질 +${fatherHates.cruel} (캐릭터 시트 반영)` : null,
      fatherHonorModifier !== 0 ? `  - 계승 명예 보정치: Honor Passion [${fatherHonorModifier >= 0 ? '+' : ''}${fatherHonorModifier}]` : null
    ].filter(Boolean);

    setAncestorRollLog(prev => [...prev, ...summaryLogs]);
  };

  const rollAncestorHistory = () => {
    const logs = [];
    const rollD20 = () => Math.floor(Math.random() * 20) + 1;
    const rollD6 = () => Math.floor(Math.random() * 6) + 1;
    const rollD3 = () => Math.floor(Math.random() * 3) + 1;

    logs.push(`📜 [${character.family?.ancestor || '알베르'} 경(조부)의 생애: 연대기 시작 723년]`);
    let gfGlory = 2500;
    let gfHateSaxons = 0;
    let gfHateMoors = 0;
    let gfHateDanes = 0;
    let gfCruel = 0;
    let gfBirthGifts = 0;
    let gfDead = false;
    let gfDeathYr = 744;
    let gfCause = '노환';

    const runCombatSurvival = (yr, eventName, isGrandfather, battleModifier = 0, isVictor = true, standardGlory = 100) => {
      const roll = rollD20();
      const modifiedRoll = roll + battleModifier;

      let dead = false;
      let gloryGained = standardGlory * (isVictor ? 2 : 1);
      let logMsg = "";
      let cause = "";
      let status = "survived";

      if (modifiedRoll <= 0) {
        dead = true;
        status = "dead";
        gloryGained += 1000;
        cause = "전투 중 장렬한 전사 (Combat)";
        logMsg = `🗡️ ${yr}년: ${eventName} -> 주사위 ${roll}(보정 ${modifiedRoll}) - 전공을 치하받으며 장렬히 전사하셨습니다! (+${gloryGained} Glory)`;
      } else if (modifiedRoll === 1) {
        dead = true;
        status = "dead";
        cause = "전투 중 전사 (Combat)";
        logMsg = `🗡️ ${yr}년: ${eventName} -> 주사위 ${roll}(보정 ${modifiedRoll}) - 전투 중 아쉽게 전사하셨습니다. (+${gloryGained} Glory)`;
      } else if (modifiedRoll === 2) {
        dead = true;
        status = "retired";
        const retiredYears = rollD20();
        cause = `부상 은퇴 (수도원에서 ${retiredYears}년 후 영면)`;
        logMsg = `🏥 ${yr}년: ${eventName} -> 주사위 ${roll}(보정 ${modifiedRoll}) - 불구가 되는 중상을 입어 은퇴 후 에히터나흐 수도원으로 들어갑니다. ${retiredYears}년 뒤 수도원에서 조용히 영면에 드십니다. (+${gloryGained} Glory)`;
      } else if (modifiedRoll === 3) {
        dead = true;
        status = "captured";
        cause = "포로 압송 및 실종 (Captured)";
        logMsg = `🔗 ${yr}년: ${eventName} -> 주사위 ${roll}(보정 ${modifiedRoll}) - 포로로 잡혀 적국으로 압송되었으며 영영 돌아오지 못했습니다. (+${gloryGained} Glory)`;
      } else if (modifiedRoll <= 5) {
        gloryGained += 100;
        logMsg = `✨ ${yr}년: ${eventName} -> 주사위 ${roll}(보정 ${modifiedRoll}) - 기적적으로 생존하고 전장에 큰 기여를 한 영웅적 전공을 세웠습니다! (+${gloryGained} Glory)`;
      } else {
        logMsg = `🛡️ ${yr}년: ${eventName} -> 주사위 ${roll}(보정 ${modifiedRoll}) - 치열한 전투 속에서 무사히 살아남으셨습니다. (+${gloryGained} Glory)`;
      }

      if (isGrandfather) {
        gfGlory += gloryGained;
        if (dead) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = cause;
        }
      } else {
        fGlory += gloryGained;
        if (dead) {
          fDead = true;
          fDeathYr = yr;
          fCause = cause;
        }
      }
      logs.push(logMsg);
      return { dead, status };
    };

    const rollOrdinaryYear = (yr, eventDescription, isGrandfather, enemyName = "Saxons") => {
      const d20 = rollD20();
      let gloryGained = 0;
      let dead = false;
      let logMsg = "";
      let cause = "";
      let status = "survived";

      if (d20 === 1) {
        dead = true;
        status = "dead";
        cause = "예기치 못한 급사 (Ordinary Year Death)";
        logMsg = `💀 ${yr}년: [역사] ${eventDescription}\n  └ [주사위 ${d20}] - 평화로운 겨울철에 갑작스러운 불의의 사고 혹은 급병으로 서거하셨습니다.`;
      } else if (d20 <= 17) {
        logMsg = `🏰 ${yr}년: [역사] ${eventDescription}\n  └ [주사위 ${d20}] - 기사로서 성채 수비대(Garrison) 의무 및 영지 보초 임무를 평온히 완수했습니다.`;
      } else if (d20 <= 19) {
        gloryGained = 50;
        logMsg = `✨ ${yr}년: [역사] ${eventDescription}\n  └ [주사위 ${d20}] - 봉토를 훌륭히 순찰하고 주군의 신임을 받아 기념비적이고 명예로운 무훈을 올렸습니다! (+50 Glory)`;
      } else {
        logMsg = `🔥 ${yr}년: [역사] ${eventDescription}\n  └ [주사위 ${d20}] - 국경을 넘나드는 ${enemyName === "Saxons" ? "작센" : enemyName === "Moors" ? "무어" : "덴마크"} 이교도 습격단에 맞서 치열한 영지 방어전을 벌였습니다! (전투 생존 판정 돌입)`;

        // Combat Survival on a raid (25 Glory, unmodified, victor)
        const survivalRoll = rollD20();
        let sDead = false;
        let sGlory = 25;
        let sCause = "";
        let sLog = "";

        if (survivalRoll === 1) {
          sDead = true;
          sCause = `${enemyName} 습격 방어 중 전사`;
          sLog = `    └ [습격 수비전 주사위 ${survivalRoll}] - 안타깝게도 밀려오는 적들을 막아서다 격전 중 장렬히 전사하셨습니다.`;
        } else if (survivalRoll === 2) {
          sDead = true;
          const retiredYears = rollD20();
          sCause = `부상 은퇴 (수도원에서 ${retiredYears}년 후 영면)`;
          sLog = `    └ [습격 수비전 주사위 ${survivalRoll}] - 불구가 되는 중상을 입어 은퇴 후 수도원에 귀의합니다. ${retiredYears}년 뒤 조용히 영면에 드십니다.`;
        } else if (survivalRoll === 3) {
          sDead = true;
          sCause = `포로 압송 및 실종`;
          sLog = `    └ [습격 수비전 주사위 ${survivalRoll}] - 적들의 포로가 되어 머나먼 이교의 땅으로 납치되었으며 끝내 돌아오지 못했습니다.`;
        } else if (survivalRoll <= 5) {
          sGlory += 100;
          sLog = `    └ [습격 수비전 주사위 ${survivalRoll}] - 기적적으로 습격의 대장을 척살하는 위대한 영웅적 무훈을 세우며 살아남았습니다! (+${sGlory} Glory)`;
        } else {
          sLog = `    └ [습격 수비전 주사위 ${survivalRoll}] - 무사히 습격을 격퇴하고 칼날 끝에서 살아남았습니다. (+${sGlory} Glory)`;
        }

        const hVal = rollD3();
        if (isGrandfather) {
          gfGlory += sGlory;
          if (sDead) {
            gfDead = true;
            gfDeathYr = yr;
            gfCause = sCause;
          } else {
            if (enemyName === "Saxons") gfHateSaxons += hVal;
            else gfHateMoors += hVal;
            sLog += ` (이교도 증오 +${hVal} 획득)`;
          }
        } else {
          fGlory += sGlory;
          if (sDead) {
            fDead = true;
            fDeathYr = yr;
            fCause = sCause;
          } else {
            if (enemyName === "Saxons") fHateSaxons += hVal;
            else if (enemyName === "Moors") fHateMoors += hVal;
            else fHateDanes += hVal;
            sLog += ` (이교도 증오 +${hVal} 획득)`;
          }
        }
        logMsg += `\n` + sLog;
      }

      if (isGrandfather) {
        if (dead) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = cause;
        }
      } else {
        if (dead) {
          fDead = true;
          fDeathYr = yr;
          fCause = cause;
        }
      }
      logs.push(logMsg);
    };

    // 👴 [조부의 연대기 (723~744)]
    for (let yr = 723; yr <= 744; yr++) {
      if (gfDead) continue;

      if (yr === 723) {
        const event = "작센 신성수 파괴 공격: 카롤루스 마르텔이 가이스마르와 프리츨라 인근의 작센 신성한 나무(holy trees)들을 파괴한 역사적 원정에 종군했습니다.";
        const roll = rollD20();
        if (roll <= 10) {
          logs.push(`🏰 723년: [역사] ${event} -> 주사위 ${roll} - 후방 수비대(Garrison) 의무를 안전하게 수행했습니다.`);
        } else {
          const res = runCombatSurvival(yr, event, true, 0, true, 25);
          if (!res.dead) {
            const hVal = rollD3();
            gfHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 증오 +${hVal} (누적: ${gfHateSaxons})`);
          }
        }
      } else if (yr === 724) {
        const event = "교황 성유물 기증: 교황이 카롤루스 마르텔에게 성 베드로의 쇠사슬과 열쇠 성유물함을 기증하였습니다. 가문의 영광스러운 후계자이자 아버님이 되실 제라르 경(Gerard)이 탄생하셨습니다.";
        logs.push(`🏰 724년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 725) {
        const event = "오툉 포위전: 무어인들이 Nîmes과 Carcassonne을 함락시키고 론 강을 따라 오툉(Autun)까지 대약탈을 감행하여, 오툉 수비대로서 결사 항전했습니다. (오도 공작 매수 소문)";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "질병사 (Illness)";
          logs.push(`💀 725년: [역사] ${event} -> 주사위 ${roll} - 행군 도중 돌발적인 질병으로 급거 서거하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 725년: [역사] ${event} -> 주사위 ${roll} - 후방 성채 경계 근무를 수행했습니다.`);
        } else {
          const res = runCombatSurvival(yr, event, true, 0, false, 50);
          if (!res.dead) {
            const hVal = rollD3();
            gfHateMoors += hVal;
            logs.push(`  └ [증오 획득] 무어인에 대한 증오 +${hVal} (누적: ${gfHateMoors})`);
          }
        }
      } else if (yr === 726) {
        const event = "중대한 무훈의 공백기: 기사단이 전열을 정비하는 동안, 조부님께서는 후방 참호를 강화하고 평화로운 겨울 보초 임무에 전념하셨습니다.";
        logs.push(`🏰 726년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 727) {
        const event = "영지의 평온: 제국 국경에 마찰이 일어나지 않은 해로, 봉토의 곡식 수확을 관리하고 가문의 권세를 평화롭게 유지하였습니다.";
        logs.push(`🏰 727년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 728) {
        const event = "작센 및 아키텐 대원정: 카롤루스 마르텔이 작센과 프리지아에서 원정을 벌이고, 독립을 선포하며 무어인과 연맹을 맺은 아키텐의 오도 공작을 제압하기 위해 대원정에 나섰습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "사고 (Accident)";
          logs.push(`💀 728년: [역사] ${event} -> 주사위 ${roll} - 불의의 마차 낙마 사고로 서거하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 728년: [역사] ${event} -> 주사위 ${roll} - 후방 영지 보급 호위를 전담했습니다.`);
        } else if (roll <= 15) {
          runCombatSurvival(yr, event + " (오도 공작 응징전)", true, -1, true, 100);
        } else {
          const res = runCombatSurvival(yr, event + " (북방 작센전)", true, 0, true, 100);
          if (!res.dead) {
            const hVal = rollD3();
            gfHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 증오 +${hVal} (누적: ${gfHateSaxons})`);
          }
        }
      } else if (yr === 729) {
        const event = "작센 전투 및 바르벨 타워 공성: 가린과 두온 공작을 돕기 위해 작센인들의 거점인 바르벨 타워 근처에서 대전투를 펼쳤습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "사냥 사고 (Hunting Accident)";
          logs.push(`💀 729년: [역사] ${event} -> 주사위 ${roll} - 사냥 중 멧돼지의 기습을 받아 서거하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 729년: [역사] ${event} -> 주사위 ${roll} - 성벽 경계 및 보초 근무를 수행했습니다.`);
        } else if (roll <= 15) {
          const res = runCombatSurvival(yr, event + " (Vauclere 전투)", true, -1, false, 100);
          if (!res.dead) {
            const hVal = rollD3();
            gfHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 증오 +${hVal} (누적: ${gfHateSaxons})`);
          }
        } else {
          const res = runCombatSurvival(yr, event + " (Barbel Tower 공방전)", true, -1, true, 100);
          if (!res.dead) {
            const hVal = rollD3();
            gfHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 증오 +${hVal} (누적: ${gfHateSaxons})`);
          }
        }
      } else if (yr === 730) {
        const event = "무훈시 [Gaufrey] & [Auberi de Bourgogne]: 바르벨 타워에서 공주 플뢰르드핀의 지혜로 갇힌 프랑크 기사들이 구출되고 거인 로바스트르가 글로리앙을 결투로 참수했으며, 오베리 경이 아바르족의 공습으로부터 바이에른 영토를 완전히 사수하여 귀족적 안착에 성공했습니다.";
        logs.push(`🏰 730년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 731) {
        const event = "오리돈 공성전: 카롤루스 마르텔을 도와 배반자 람베르트의 성인 오리돈(Oridon)을 포위 공성했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "질병사 (Illness)";
          logs.push(`💀 731년: [역사] ${event} -> 주사위 ${roll} - 군영 내 전염병으로 돌연 서거하셨습니다.`);
        } else if (roll <= 15) {
          logs.push(`🏰 731년: [역사] ${event} -> 주사위 ${roll} - 후방 수비대 임무를 마쳤습니다.`);
        } else {
          runCombatSurvival(yr, event, true, 0, true, 50);
        }
      } else if (yr === 732) {
        const event = "포아티에 전투 (투르 전투): 이슬람 무어인들의 대규모 침공군에 맞서 서유럽의 운명을 걸고 카롤루스 마르텔의 연합군에 합류하여 평원에서 격전을 벌였습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "낙사 (Accident)";
          logs.push(`💀 732년: [역사] ${event} -> 주사위 ${roll} - 전투 직전 말에서 떨어져 서거하셨습니다.`);
        } else if (roll <= 5) {
          logs.push(`🏰 732년: [역사] ${event} -> 주사위 ${roll} - 기사단 후방 보급을 호위했습니다.`);
        } else {
          const pRoll = rollD20();
          if (pRoll === 1) {
            gfDead = true;
            gfDeathYr = yr;
            gfCause = "Poitiers 전사 (Combat)";
            gfGlory += 1400;
            logs.push(`🗡️ 732년: [역사] ${event} -> 포아티에 주사위 ${pRoll} - 전설적인 전공을 기사단에 남기며 장렬히 전사하셨습니다! (+${gfGlory} Glory)`);
          } else if (pRoll <= 11) {
            gfDead = true;
            gfDeathYr = yr;
            gfCause = "Poitiers 전사 (Combat)";
            gfGlory += 400;
            logs.push(`🗡️ 732년: [역사] ${event} -> 포아티에 주사위 ${pRoll} - 전투 중 영예롭게 전사하셨습니다. (+400 Glory)`);
          } else if (pRoll === 12) {
            gfDead = true;
            gfDeathYr = yr;
            gfCause = "스페인 압송 포로 (Captured)";
            gfGlory += 400;
            logs.push(`🔗 732년: [역사] ${event} -> 포아티에 주사위 ${pRoll} - 포로로 잡혀 무어인의 땅(스페인)으로 압송되어 소식이 끊겼습니다. (+400 Glory)`);
          } else if (pRoll === 13) {
            gfGlory += 500;
            gfBirthGifts += 1;
            const hVal = rollD3();
            gfHateMoors += hVal;
            logs.push(`✨ 732년: [역사] ${event} -> 포아티에 주사위 ${pRoll} - 적진을 돌파하는 영웅적 전공을 세우며 전리품을 획득했습니다! (+500 Glory, 무어인 증오 +${hVal}, Frankish Birth Gift 획득!)`);
          } else if (pRoll <= 19) {
            gfGlory += 400;
            gfBirthGifts += 1;
            const hVal = rollD3();
            gfHateMoors += hVal;
            logs.push(`🛡️ 732년: [역사] ${event} -> 포아티에 주사위 ${pRoll} - 무사히 생존하여 대승리에 공헌했습니다. (+400 Glory, 무어인 증오 +${hVal}, Frankish Birth Gift 획득!)`);
          } else {
            gfGlory += 900;
            gfBirthGifts += 1;
            const hVal = rollD3();
            gfHateMoors += hVal;
            logs.push(`👑 732년: [역사] ${event} -> 포아티에 주사위 ${pRoll} - 전장 한가운데서 침공 사령관 에미르 압둘 라흐만을 결투로 베는 불멸의 업적을 세우셨습니다! (+900 Glory, 무어인 증오 +${hVal}, Frankish Birth Gift 획득!)`);
          }
        }
      } else if (yr === 733) {
        const event = "무훈시 [Daurel and Beton] & [역사]: 브라반트 공작 베비스가 프랑크 왕국 국왕의 누이 에르멩가르드 공주와 성대한 축복 속에 결혼했으나, 질투심에 타락한 기(Guy) 백작이 주군을 해칠 비열한 음모를 꾸몄습니다. [역사] 아키텐의 수호자 오도 공작이 서거하여 아들 후놀트가 작위를 상속받았습니다.";
        logs.push(`🏰 733년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 734) {
        const event = "무훈시 [Daurel and Beton] & [역사]: 주군 가문의 위대한 희망이자 기사도의 정수인 아기 베통 경이 출생하였습니다. [역사] 프랑크의 진정한 권력자 카롤루스 마르텔이 그의 둘째 아들 피핀(Pepin)을 롬바르디아의 Pavia 왕실로 보내 수습 종자 훈련을 거치도록 조치했습니다.";
        logs.push(`🏰 734년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 735) {
        const event = "루시옹 대결 및 보르도 공성전: 카롤루스 마르텔을 종군하여 보르도 공성에 나서거나, 루시옹의 제라르 공작과의 대결전에 참전했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "사망 (Feud)";
          logs.push(`💀 735년: [역사] ${event} -> 주사위 ${roll} - 가문 불화 결투 도중 서거하셨습니다.`);
        } else if (roll <= 5) {
          logs.push(`🏰 735년: [역사] ${event} -> 주사위 ${roll} - 쾰른 경비 의무를 마쳤습니다.`);
        } else if (roll <= 12) {
          runCombatSurvival(yr, event + " (루시옹 대결)", true, 0, true, 50);
        } else if (roll <= 15) {
          logs.push(`⚖️ 735년: [역사] ${event} -> 주사위 ${roll} - 위옹 경의 아모르 스캔들 재판에서 위증을 강요받아 정직함이 무너집니다. (Just 수치 하락)`);
        } else {
          runCombatSurvival(yr, event + " (보르도 공성)", true, 0, true, 50);
        }
      } else if (yr === 736) {
        const event = "제라르 격퇴 및 아를 해방전: 무어인들과 손을 잡은 반역세력을 토벌하고, 무어인의 치하에서 아를(Arles)을 완전히 탈환하기 위한 공성전에 참전했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "질병사 (Illness)";
          logs.push(`💀 736년: [역사] ${event} -> 주사위 ${roll} - 진중의 무서운 열병으로 서거하셨습니다.`);
        } else if (roll <= 5) {
          logs.push(`🏰 736년: [역사] ${event} -> 주사위 ${roll} - 기사단 초소 근무를 섰습니다.`);
        } else if (roll <= 10) {
          runCombatSurvival(yr, event + " (제라르 전투)", true, -1, false, 100);
        } else {
          const res = runCombatSurvival(yr, event + " (아를 해방전)", true, 0, true, 50);
          if (!res.dead) {
            const hVal = rollD3();
            gfHateMoors += hVal;
            logs.push(`  └ [증오 획득] 무어인에 대한 증오 +${hVal} (누적: ${gfHateMoors})`);
          }
        }
      } else if (yr === 737) {
        const event = "아비뇽 공성전 및 학살극: 무어인과 연맹을 맺은 비시고트 반역자들을 징벌하기 위해 아비뇽을 격파하고, 도시 함락 후 가차 없는 학살 및 처벌에 가담했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "사고 (Accident)";
          logs.push(`💀 737년: [역사] ${event} -> 주사위 ${roll} - 성벽 수축 공사 도중 돌에 깔려 서거하셨습니다.`);
        } else if (roll <= 5) {
          logs.push(`🏰 737년: [역사] ${event} -> 주사위 ${roll} - 영지 가드 근무를 섰습니다.`);
        } else if (roll <= 10) {
          runCombatSurvival(yr, event + " (제라르 전투)", true, -1, false, 100);
        } else {
          runCombatSurvival(yr, event + " (아비뇽 대참화)", true, 0, true, 50);
          const cVal = rollD6();
          gfCruel += cVal;
          logs.push(`  └ [기질 획득] 배신자들에 대한 복수심으로 가득 차 무자비함(Cruel) +${cVal} 기질 획득! (누적: ${gfCruel})`);
        }
      } else if (yr === 738) {
        const event = "부르고뉴 전투 및 보르들레 습격전: 로렌 가문을 도우며 부르고뉴로 쳐들어온 무어 침공군을 격파하거나, 보르들레 가문을 급습하는 가문 불화 전투에 나섰습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "사망 (Feud)";
          logs.push(`💀 738년: [역사] ${event} -> 주사위 ${roll} - 라이벌 가문의 자객에게 급습받아 서거하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 738년: [역사] ${event} -> 주사위 ${roll} - 쾰른 성 수비대에 소집되었습니다.`);
        } else if (roll <= 15) {
          const res = runCombatSurvival(yr, event + " (부르고뉴 무어인전)", true, -1, true, 100);
          if (!res.dead) {
            const hVal = rollD3();
            gfHateMoors += hVal;
            logs.push(`  └ [증오 획득] 무어인에 대한 증오 +${hVal} (누적: ${gfHateMoors})`);
          }
        } else {
          runCombatSurvival(yr, event + " (보르들레 습격전)", true, 0, true, 25);
        }
      } else if (yr === 739) {
        const event = "셉티마니아 수복전: 남부에서 무어인들을 축출하기 위한 셉티마니아 공성전에 가담해 큰 전리품을 획득하고 충성스러운 기사로 인정받았습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "행방불명 (Disappeared)";
          logs.push(`💀 739년: [역사] ${event} -> 주사위 ${roll} - 원정길의 수풀 속에서 실종되시어 돌아오지 못했습니다.`);
        } else if (roll <= 5) {
          logs.push(`🏰 739년: [역사] ${event} -> 주사위 ${roll} - 후방 수비 의무를 원활하게 수행했습니다.`);
        } else if (roll <= 10) {
          gfGlory += 50;
          logs.push(`🛡️ 739년: [역사] ${event} -> 프로방스 공성전 주사위 ${roll} - 실패로 끝난 아를 포위전에서 힘겹게 목숨을 건졌습니다. (+50 Glory)`);
        } else {
          const res = runCombatSurvival(yr, event + " (셉티마니아 대공성)", true, 0, true, 50);
          if (!res.dead) {
            gfBirthGifts += 1;
            logs.push("  └ [왕실의 선물] 수복 공헌을 기려 마르텔 공으로부터 프랑크 탄생 선물을 받았습니다! (Frankish Birth Gift 획득!)");
          }
        }
      } else if (yr === 740) {
        const event = "로슈브룬 공성전: 대공 나이모의 사촌 파스루즈를 구출하기 위해 덴마크 침공군에 맞서 로슈브룬 성을 방어 및 탈환했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "덴마크 전사 (Combat)";
          logs.push(`💀 740년: [역사] ${event} -> 주사위 ${roll} - 북유럽 바이킹 도끼에 맞서 장렬히 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 740년: [역사] ${event} -> 주사위 ${roll} - 후방 성벽을 지켰습니다.`);
        } else {
          const res = runCombatSurvival(yr, event, true, 0, true, 50);
          if (!res.dead) {
            logs.push("  └ [새로운 위협] 평생 처음 마주한 덴마크인들에 대해 엄청난 분노(Hate Danes 1d6)를 품었습니다!");
          }
        }
      } else if (yr === 741) {
        const event = "카롤루스 마르텔의 서거 및 장례: 마르텔 공의 서거을 기리고, 영지를 탈취하려는 그리포 왕자의 반란군을 생포하는 진압군에 가담했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "질병사 (Illness)";
          logs.push(`💀 741년: [역사] ${event} -> 주사위 ${roll} - 주군 카롤루스 마르텔의 부고를 듣고 상심 속에 병사하셨습니다.`);
        } else if (roll <= 5) {
          logs.push(`🏰 741년: [역사] ${event} -> 주사위 ${roll} - 쾰른에서 애도 기간을 가졌습니다.`);
        } else if (roll <= 10) {
          gfGlory += 50;
          logs.push(`🛡️ 741년: [역사] ${event} -> 그리포 생포전 주사위 ${roll} - 반역 왕자의 병력을 기습해 체포에 일조했습니다! (+50 Glory)`);
        } else {
          gfGlory += 50;
          logs.push(`🕯️ 741년: [역사] ${event} -> 장례식 참석 주사위 ${roll} - 카롤루스 마르텔의 장엄한 아르덴 성당 매장식에 기치를 들었습니다. (+50 Glory)`);
        }
      } else if (yr === 742) {
        const event = "두온 백작의 결혼식: 국왕 피핀의 누이 올리브 공주와 두온 백작의 화려한 쾰른 혼례식에 공식 하객으로 참석했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "노환 (Old Age)";
          logs.push(`💀 742년: [역사] ${event} -> 주사위 ${roll} - 주군들의 결혼 잔치 직후 노환으로 평화로이 서거하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 742년: [역사] ${event} -> 주사위 ${roll} - 축제 기간 영지 순찰을 담당했습니다.`);
        } else {
          gfGlory += 25;
          logs.push(`🎉 742년: [역사] ${event} -> 하객 참석 주사위 ${roll} - 국왕과 대귀족들이 모인 성대한 연회에서 가문의 권세를 떨쳤습니다. (+25 Glory)`);
        }
      } else if (yr === 743) {
        const event = "레겐스부르크 전투 및 삼면 원정: 바이에른을 완전 병합하기 위한 레겐스부르크 전투에 참전하거나, 아키텐/작센의 반란을 평정하기 위해 종군했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "바이에른 전사 (Combat)";
          logs.push(`💀 743년: [역사] ${event} -> 주사위 ${roll} - 알프스 고갯길에서 바이에른 보병의 기습을 받아 전사하셨습니다.`);
        } else if (roll <= 5) {
          logs.push(`🏰 743년: [역사] ${event} -> 주사위 ${roll} - 가문 영지를 수호했습니다.`);
        } else if (roll <= 10) {
          runCombatSurvival(yr, event + " (레겐스부르크 결전)", true, -1, true, 100);
        } else if (roll <= 15) {
          const res = runCombatSurvival(yr, event + " (작센 정벌)", true, 0, true, 25);
          if (!res.dead) {
            const hVal = rollD3();
            gfHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 증오 +${hVal} (누적: ${gfHateSaxons})`);
          }
        } else {
          runCombatSurvival(yr, event + " (아키텐 진압)", true, 0, true, 25);
        }
      } else if (yr === 744) {
        const event = "조부 은퇴 전 최후의 원정: 궁정의 간첩을 적발하고 최후의 작센 습격을 차단하며 기사로서의 영예로운 일생을 매듭지었습니다.";
        const roll = rollD20();
        if (roll <= 10) {
          logs.push(`🏰 744년: [역사] ${event} -> 주사위 ${roll} - 노장이 되어 고향 영지를 지켰습니다.`);
        } else if (roll <= 14) {
          const res = runCombatSurvival(yr, event + " (작센 최후 전투)", true, 0, true, 25);
          if (!res.dead) {
            const hVal = rollD3();
            gfHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 증오 +${hVal} (누적: ${gfHateSaxons})`);
          }
        } else if (roll <= 18) {
          gfGlory += 25;
          logs.push(`👑 744년: [역사] ${event} -> 주사위 ${roll} - 파리 대성당에서 섭정 베르트라다 왕비의 성대하고 역사적인 복귀식 대열에 합류했습니다. (+25 Glory)`);
        } else {
          gfGlory += 100;
          logs.push(`🔍 744년: [역사] ${event} -> 주사위 ${roll} - 피핀 국왕의 어전에서 아키텐 위노 공작이 심어놓은 흉악한 세작을 기지로 생포해 상을 받았습니다! (+100 Glory)`);
        }
      }
    }

    if (!gfDead) {
      gfDeathYr = 744 + rollD20();
      gfCause = "평화로운 영면 (Old Age)";
      logs.push(`👴 ${gfDeathYr}년: 은퇴한 조부님(시조 ${character.family?.ancestor || '알베르'})께서 평화롭게 침상에서 영면에 드셨습니다.`);
    }

    setGrandfatherGlory(gfGlory);
    setGrandfatherDeathYear(gfDeathYr);
    setGrandfatherDeathCause(gfCause);
    setGrandfatherHates({ saxons: gfHateSaxons, moors: gfHateMoors, cruel: gfCruel });

    let inheritedSaxons = gfHateSaxons > 10 ? gfHateSaxons : 0;
    let inheritedMoors = gfHateMoors > 10 ? gfHateMoors : 0;
    let inheritedCruel = gfCruel;

    // 👨 [부친의 연대기 (745~766)]
    logs.push("");
    logs.push("📜 [부친의 생애: 연대기 시작 745년]");
    let fGlory = 2500 + Math.floor(gfGlory / 10);
    logs.push(`🎁 745년: 부친(724년생)께서 성인식을 마치고 조부의 위대한 유산 1/10을 물려받아 ${fGlory} Glory로 당당히 기사 서임을 받으셨습니다.`);
    if (inheritedCruel > 0) {
      logs.push(`  └ [기질 상속] 조부로부터 무자비함(Cruel) 기질 +${inheritedCruel}을 물려받았습니다.`);
    }

    let fHateSaxons = inheritedSaxons;
    let fHateMoors = inheritedMoors;
    let fHateDanes = 0;
    let fCruel = inheritedCruel;
    let fHonorMod = 0;
    let fDead = false;
    let fDeathYr = 766;
    let fCause = '노환';
    let skipYearsUntil = 0;

    for (let yr = 745; yr <= 766; yr++) {
      if (fDead) continue;
      if (yr < skipYearsUntil) {
        logs.push(`✈️ ${yr}년: 부친께서는 란드리 경과 함께 비잔티움 대원정에 참전하시어 머나먼 동방에 계십니다. (Garrison 및 전투 자동 생존)`);
        continue;
      }

      if (yr === 745) {
        const event = "돈 드 라 로슈의 결혼 & 아키텐 와이페르 공작 승계 및 부친 기사직 승계";
        const roll = rollD20();
        if (roll <= 5) {
          fGlory += 100;
          logs.push(`👰 745년: [가문] ${event} -> 주사위 ${roll} - 부친께서 자신의 첩이자 임신 상태인 어머니(어머니께서 임신 소식을 전함)와 혼인하셨습니다. (+100 Glory)`);
        } else if (roll <= 10) {
          fGlory += 200;
          logs.push(`👰 745년: [가문] ${event} -> 주사위 ${roll} - 주군에 대한 충성스러운 복무의 보상으로 어머니의 손을 건네받아 혼인하셨습니다. (+200 Glory)`);
        } else {
          fGlory += 400;
          logs.push(`👰 745년: [가문] ${event} -> 주사위 ${roll} - 라이벌 영주의 딸인 어머니를 납치하여 혼인하셨습니다. (+400 Glory)`);
        }
      } else if (yr === 746) {
        const event = "롤랑 경의 탄생 및 셉티마니아 원정: 무어인들의 셉티마니아 습격에 동참하거나, 알레마니아 반란을 피의 숙청으로 다스린 혹독한 군무에 참전했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "전역사 (Illness)";
          logs.push(`💀 746년: [역사] ${event} -> 주사위 ${roll} - 무서운 군영 내 돌림병에 걸려 롤랑 경의 탄생 소식만을 듣고 서거하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 746년: [가문] ${event} -> 주사위 ${roll} - 기쁜 롤랑 경의 탄생을 전장에서 전해 듣고 가문의 축배를 올렸습니다.`);
        } else if (roll <= 15) {
          const res = runCombatSurvival(yr, event + " (셉티마니아 무어인 방어전)", false, -1, false, 25);
          if (!res.dead) {
            const hVal = rollD3();
            fHateMoors += hVal;
            logs.push(`  └ [증오 획득] 무어인에 대한 증오 +${hVal} (누적: ${fHateMoors})`);
          }
        } else if (roll <= 18) {
          const cVal = rollD6();
          fCruel += cVal;
          logs.push(`🪓 746년: [역사] ${event} -> 주사위 ${roll} - 알레마니아 반역자들을 징벌하는 피핀의 대숙청 대열에 참여하셨습니다. 잔혹성(Cruel) +${cVal} 기질 획득! (누적: ${fCruel})`);
        } else {
          fGlory += 50;
          logs.push(`✝️ 746년: [가문] ${event} -> 주사위 ${roll} - 마침내 롤랑 경의 장엄한 탄생을 직접 보고 기사로서 성인 묘비에 참배하며 믿음을 다짐했습니다. (+1 Love God, +50 Glory)`);
        }
      } else if (yr === 747) {
        const event = "카를로만 공의 순례 동행: 궁정의 번잡함을 떠나 카를로만 공을 모시고 롬바르디아를 거쳐 로마로 순례 여행을 다녀오거나, 신앙의 부름을 받았습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "순례 중 사망 (Accident)";
          logs.push(`💀 747년: [역사] ${event} -> 주사위 ${roll} - 알프스 산맥을 돌파하던 도중 눈사태로 낙사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 747년: [역사] ${event} -> 주사위 ${roll} - 쾰른 궁정의 보초를 섰습니다.`);
        } else if (roll <= 18) {
          fGlory += 25;
          logs.push(`✝️ 747년: [역사] ${event} -> 주사위 ${roll} - 카를로만 공의 은퇴길 로마 대순례단에 하객으로 동참해 축복을 목도했습니다. (+25 Glory)`);
        } else {
          fDead = true;
          fDeathYr = yr + rollD20();
          fCause = "성스러운 은수사 은퇴 (Hermit)";
          logs.push(`🌲 747년: [역사] ${event} -> 주사위 ${roll} - 마인츠 대주교 보니파키우스를 접견한 후 깊은 성령을 깨달아 아르덴 깊은 숲의 은수사(Hermit)로 기꺼이 은퇴하셨습니다. (+1 Love God, 기사 전역)`);
        }
      } else if (yr === 748) {
        const event = "무훈시 [Raoul de Cambrai] & [역사]: 베르니에와 베아트릭스가 고난 끝에 죄를 씻기 위한 순례 도중 무어인 기습을 받아 스페인 지하 감옥에 갇혔습니다. [역사] 반역도당 그리포 왕자가 바이에른으로 패주했고, 피핀 왕의 중재로 타실로 3세가 공작으로 정식 등극했습니다.";
        logs.push(`🏰 748년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 749) {
        const event = "바이에른 전역 및 그리포 왕자 탈출 사건: 반역자 그리포 왕자가 피핀을 피해 탈출하자, 그의 바이에른 지지 병력들을 격파하는 평정 작전에 참전했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "바이에른 전사 (Combat)";
          logs.push(`💀 749년: [역사] ${event} -> 주사위 ${roll} - 레겐스부르크 근교의 기습전에서 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 749년: [역사] ${event} -> 주사위 ${roll} - 기사단 행군 대열의 중심을 지켰습니다.`);
        } else if (roll <= 18) {
          runCombatSurvival(yr, event + " (바이에른 기습 공세)", false, -1, true, 100);
        } else {
          fHonorMod -= 1;
          logs.push(`⚠️ 749년: [역사] ${event} -> 주사위 ${roll} - 포로 그리포 왕자의 참모진 경비를 전담했으나, 한밤중 감시망이 뚫려 왕자가 도주하는 명예 훼손을 겪었습니다. (Honor -1)`);
        }
      } else if (yr === 750) {
        const event = "작센 대전투: 작센 추장 저스타몽이 선포한 이교 대침공에 대항해, 피핀 국왕의 선봉으로 작센 벌판에서 치열한 혈투를 전개했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "작센 전사 (Combat)";
          logs.push(`💀 750년: [역사] ${event} -> 주사위 ${roll} - 작센인들의 숲속 함정에 포위되어 장렬히 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 750년: [역사] ${event} -> 주사위 ${roll} - 영지 수비 근무를 섰습니다.`);
        } else {
          const res = runCombatSurvival(yr, event, false, 0, true, 100);
          if (!res.dead) {
            const hVal = rollD6();
            fHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 격렬한 증오 +${hVal} (누적: ${fHateSaxons})`);
          }
        }
      } else if (yr === 751) {
        const event = "피핀 3세의 대관식 경비: 메로빙거 최후의 국왕 힐데리히 3세의 폐위식과 피핀 3세의 새로운 프랑크 국왕 즉위식 대관 경비를 맡았습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "수비 중 사망 (Feud)";
          logs.push(`💀 751년: [역사] ${event} -> 주사위 ${roll} - 반역도당의 황궁 난입 사태에서 왕가를 지키다 서거하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 751년: [역사] ${event} -> 주사위 ${roll} - 즉위식장 외부 바리케이드를 경비했습니다.`);
        } else if (roll <= 15) {
          runCombatSurvival(yr, event + " (반역 세작 처단)", false, 0, true, 25);
        } else {
          fGlory += 50;
          logs.push(`👑 751년: [역사] ${event} -> 즉위 경비 주사위 ${roll} - 성스러운 피핀 3세의 대관 미사에서 왕의 최측근 근위대로 기립하며 큰 명예를 획득했습니다! (+50 Glory)`);
        }
      } else if (yr === 752) {
        const event = "무훈시 [Mainet] & [역사]: 사생아들의 독살 음모를 기지로 피해 툴레도로 망명한 젊은 샤를마뉴(마이네)가 술탄 갈라프레의 휘하 용병으로 뛰며 거인 카이망과 브라이망을 영웅적으로 베고, 공주 갈리엔나의 숭고한 구애를 쟁취했습니다. [역사] 이교도들이 남방 국경을 무단 습격하였으며, 샤를마뉴의 친동생 카를로만 2세가 출생했습니다.";
        logs.push(`🏰 752년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 753) {
        const event = "비부르크 산 전투: 작센 이교도들의 반란에 맞서 피핀 왕과 함께 출정하여 대지진 속 비부르크 산에서 격렬한 전투를 벌였습니다. (대주교 힐데가르 전사)";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "작센 전사 (Combat)";
          logs.push(`💀 753년: [역사] ${event} -> 주사위 ${roll} - 비부르크 산 절벽 전장에서 추락사 혹은 장렬히 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 753년: [역사] ${event} -> 주사위 ${roll} - 쾰른 군영을 수호했습니다.`);
        } else if (roll <= 15) {
          const res = runCombatSurvival(yr, event + " (비부르크 참사)", false, -1, true, 100);
          if (!res.dead) {
            const hVal = rollD6();
            fHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 극심한 원한 +${hVal} (누적: ${fHateSaxons})`);
          }
        } else {
          fGlory += 50;
          logs.push(`🗡️ 753년: [역사] ${event} -> 주사위 ${roll} - 국경을 이탈해 암약을 시도하던 반역자 그리포를 검거하는 기사 특별 부대를 이끌어 활약했습니다! (+50 Glory)`);
        }
      } else if (yr === 754) {
        const event = "나르본 공성전 및 알프스 행군: 교황의 동맹 요청에 응하여 반역 동맹군에 맞서 알프스를 돌파하거나 사라센 세력을 격퇴하기 위해 나르본 탈환전에 종군했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "무어 전사 (Combat)";
          logs.push(`💀 754년: [역사] ${event} -> 주사위 ${roll} - 나르본 성문을 부수던 와중 적들의 화포 혹은 불화살을 맞고 전사하셨습니다.`);
        } else if (roll <= 8) {
          logs.push(`🏰 754년: [역사] ${event} -> 주사위 ${roll} - 교황 전령을 접견하는 경호 임무를 수행했습니다.`);
        } else if (roll <= 14) {
          runCombatSurvival(yr, event + " (알프스 원정 전투)", false, -1, true, 100);
        } else if (roll <= 18) {
          fGlory += 25;
          logs.push(`🇮🇹 754년: [역사] ${event} -> 주사위 ${roll} - 롬바르디아 영지 약탈 공방전에서 적들의 식량 창고를 털어 군에 공헌했습니다. (+25 Glory)`);
        } else {
          const res = runCombatSurvival(yr, event + " (나르본 탈환 대작전)", false, 0, true, 50);
          if (!res.dead) {
            const hVal = rollD3();
            fHateMoors += hVal;
            logs.push(`  └ [증오 획득] 무어인에 대한 증오 +${hVal} (누적: ${fHateMoors})`);
          }
        }
      } else if (yr === 755) {
        const event = "무훈시 [Lion de Bourges] & [Orson de Beauvais]: 사자 젖을 먹고 자란 영웅 리옹이 친부모를 찾아 위대한 모험을 돌파하고 이탈리아 Monterose성을 공성했으며, [Orson de Beauvais] Chanson에서 충직한 밀로 기사가 성지 예루살렘의 암흑 감옥에 갇힌 늙은 아버지 오르송 백작을 극적으로 탈환해 사법적 정의를 지켰습니다.";
        logs.push(`🏰 755년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 756) {
        const event = "파비아 포위 공성전: 교황령 수호를 방해하는 롬바르디아 왕 아이스툴프를 징벌하기 위해 파비아 성벽 아래에서 격전을 전개했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "파비아 전사 (Combat)";
          logs.push(`💀 756년: [역사] ${event} -> 주사위 ${roll} - 파비아 성루 기습 작전에서 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 756년: [역사] ${event} -> 주사위 ${roll} - 이탈리아 고지 점령대를 경계했습니다.`);
        } else if (roll <= 15) {
          runCombatSurvival(yr, event + " (파비아 성문 공략)", false, -1, true, 50);
        } else {
          fGlory += 25;
          logs.push(`⛪ 756년: [역사] ${event} -> 주사위 ${roll} - 승리 후 로마 바티칸 성당의 정예 황실 가드로 배정되어 교황령 수호의 증인이 되었습니다. (+25 Glory)`);
        }
      } else if (yr === 757) {
        const event = "덴마크 정벌 원정: 쾰른의 백작 두온과 피핀 왕의 공세에 동참하여 북방의 덴마크인들을 제압하고 국위를 떨쳤습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "덴마크 전사 (Combat)";
          logs.push(`💀 757년: [역사] ${event} -> 주사위 ${roll} - 덴마크 상륙 도중 전함 위에서 적의 도끼에 스러지셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 757년: [역사] ${event} -> 주사위 ${roll} - 초소 순찰을 돌며 조용히 보냈습니다.`);
        } else if (roll <= 18) {
          const res = runCombatSurvival(yr, event + " (바이킹 결전)", false, 0, true, 100);
          if (!res.dead) {
            const hVal = rollD3();
            fHateDanes += hVal;
            logs.push(`  └ [증오 획득] 덴마크 바이킹에 대한 원한 +${hVal}`);
          }
        } else {
          fHateDanes += 6;
          fHonorMod -= 5;
          logs.push(`⚠️ 757년: [역사] ${event} -> 주사위 ${roll} - 덴마크 국왕의 오만한 기습에 걸려 머리가 깎인 채로 사절에서 풀려나는 엄청난 굴욕을 겪었습니다. (Honor -5, 덴마크인 증오 대폭 상승)`);
        }
      } else if (yr === 758) {
        const event = "작센 보복 정벌: 매년 300필의 군마 조공을 거부하고 거듭 반란을 일으키는 작센 영토로 침투해 강제 개종과 무자비한 토벌전을 벌였습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "작센 전사 (Combat)";
          logs.push(`💀 758년: [역사] ${event} -> 주사위 ${roll} - 불타는 작센 성읍의 철수 도중 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 758년: [역사] ${event} -> 주사위 ${roll} - 국경 참호를 보수했습니다.`);
        } else if (roll <= 16) {
          const res = runCombatSurvival(yr, event + " (작센 강제정벌 레이드)", false, 0, true, 25);
          if (!res.dead) {
            const hVal = rollD3();
            fHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 증오 +${hVal} (누적: ${fHateSaxons})`);
          }
        } else {
          const res = runCombatSurvival(yr, event + " (작센 대학살 징벌전)", false, -1, true, 100);
          if (!res.dead) {
            const hVal = rollD6();
            fHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 뼈에 사무친 복수심 +${hVal} (누적: ${fHateSaxons})`);
          }
        }
      } else if (yr === 759) {
        const event = "무훈시 [Les Lorrains] & [역사]: 영예로운 Bego 백작이 멧돼지 사냥 도중 가문의 오래된 원수인 Fromont 패거리에게 야만적으로 암살당하여 피비린내 나는 복수극이 재발했습니다. [역사] 피핀 국왕이 마침내 사라센 무어인들을 완전히 몰아내어 남부 Septimania 영토를 완전히 탈환하였습니다.";
        logs.push(`🏰 759년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 760) {
        const event = "리무쟁 공성전 및 쾰른 사절단: 아키텐 전역의 포문을 열기 위해 리무쟁 성을 공격하거나, 반역을 꾀하는 토밀 가문의 계획에 맞서 사절로 나섰습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "아키텐 전사 (Combat)";
          logs.push(`💀 760년: [역사] ${event} -> 주사위 ${roll} - 리무쟁 공성망을 공격하던 와중 화살을 맞아 전사하셨습니다.`);
        } else if (roll <= 5) {
          logs.push(`🏰 760년: [역사] ${event} -> 주사위 ${roll} - 후방 포병대를 경호했습니다.`);
        } else if (roll <= 10) {
          runCombatSurvival(yr, event + " (리무쟁 공성 돌파)", false, 0, true, 50);
        } else if (roll <= 15) {
          runCombatSurvival(yr, event + " (아키텐 수림 게릴라전)", false, 0, true, 25);
        } else {
          fGlory += 200;
          skipYearsUntil = 763;
          fHonorMod += 1;
          logs.push(`✈️ ${yr}년: [역사] ${event} -> 주사위 ${roll} - 쾰른의 백장 란드리 경의 신뢰를 받아 비잔티움 대원정단의 참모로 전격 합류했습니다! 761~762년 동안 로마를 거쳐 콘스탄티노플에서 장대한 외교 원정을 수행합니다. (+200 Glory, Honor +1)`);
        }
      } else if (yr === 761) {
        const event = "부르주 포위전 및 브르타뉴 습격: 아키텐 정벌 전역의 핵심 거점인 부르주(Bourges) 성을 성공적으로 공략하여 대승을 거두었습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "부르주 전사 (Combat)";
          logs.push(`💀 761년: [역사] ${event} -> 주사위 ${roll} - 부르주 성벽 함락 작전에서 적의 불벼락을 맞고 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 761년: [역사] ${event} -> 주사위 ${roll} - 기사단 예비 진지를 보수했습니다.`);
        } else if (roll <= 17) {
          runCombatSurvival(yr, event + " (부르주 격파전)", false, 0, true, 50);
        } else {
          runCombatSurvival(yr, event + " (브르타뉴 소탕)", false, 0, true, 25);
        }
      } else if (yr === 762) {
        const event = "아키텐 약탈전 및 왕가의 화해: 아키텐 전초 기지를 견고하게 세우고, 어린 롤랑이 왕궁 음식물 서리를 하던 당돌한 순간과 가문의 기쁨을 지켜보았습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "아키텐 전사 (Combat)";
          logs.push(`💀 762년: [역사] ${event} -> 주사위 ${roll} - 아키텐 기습군의 정찰 칼날에 희생되셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 762년: [역사] ${event} -> 주사위 ${roll} - 아르헨돈 요새 수비를 섰습니다.`);
        } else if (roll <= 15) {
          runCombatSurvival(yr, event + " (아키텐 산악 약탈전)", false, 0, true, 25);
        } else {
          fGlory += 50;
          logs.push(`👑 762년: [가문] ${event} -> 주사위 ${roll} - 왕궁 기사단 훈련 중 어린 아들 롤랑이 왕의 식탁에서 대담하게 고기를 훔쳐 아버지를 감탄시키고 밀로 백작 가문이 화해하는 역사적 현장을 배석했습니다. (+50 Glory)`);
        }
      } else if (yr === 763) {
        const event = "쾰른 라 로슈 성의 기적적인 방어: 토밀과 말랭그가 이끄는 대반란군의 겹겹이 쌓인 포위를 뚫고 성을 사수했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "라 로슈 전사 (Combat)";
          logs.push(`💀 763년: [역사] ${event} -> 주사위 ${roll} - 포위당한 라 로슈 성루에서 적의 발석기에 깔려 전사하셨습니다.`);
        } else if (roll <= 5) {
          logs.push(`🏰 763년: [역사] ${event} -> 주사위 ${roll} - 화살 통을 날 나르며 공성에 저항했습니다.`);
        } else {
          runCombatSurvival(yr, event + " (성루 총사수 결전)", false, -1, true, 50);
        }
      } else if (yr === 764) {
        const event = "라 로슈 제2차 공성 및 툴루즈 함락: 오베리 주교와 함께 성을 격파하고 쾰른을 탈환하거나, 아키텐의 수도 툴루즈 점령 작전에 합류했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "툴루즈 전사 (Combat)";
          logs.push(`💀 764년: [역사] ${event} -> 주사위 ${roll} - 툴루즈 성문 돌파 시도 중 성루 위에서 쏟아지는 화약/기름에 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 764년: ${event} -> 주사위 ${roll} - 보급선 방어를 담당했습니다.`);
        } else if (roll <= 15) {
          runCombatSurvival(yr, event + " (오베리 백작의 라 로슈 탈환전)", false, 0, true, 50);
        } else {
          runCombatSurvival(yr, event + " (툴루즈 대공격)", false, 0, true, 25);
        }
      } else if (yr === 765) {
        const event = "오트페이유 공성과 작센 족장 브로히막스 격퇴: 쾰른의 평화를 깨려는 작센 군단을 맞아 족장 브로히막스와의 대결에서 목숨을 건 수호전을 벌였습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "작센 전사 (Combat)";
          logs.push(`💀 765년: [역사] ${event} -> 주사위 ${roll} - 쾰른을 지키는 격돌에서 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 765년: [역사] ${event} -> 주사위 ${roll} - 수비 진영을 정리했습니다.`);
        } else if (roll <= 15) {
          runCombatSurvival(yr, event + " (오트페이유 포위전)", false, 0, true, 50);
        } else {
          const res = runCombatSurvival(yr, event + " (브로히막스 결전)", false, -1, true, 100);
          if (!res.dead) {
            const hVal = rollD6();
            fHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센 군단에 대한 증오 +${hVal} (누적: ${fHateSaxons})`);
          }
        }
      } else if (yr === 766) {
        const event = "부친 은퇴 전 마지막 참전: 샤를마뉴 왕자 및 위비앙의 세력과 함께 몽펠리에와 에그르몽 포위 공성전에 참전하여 최후의 기사도 영광을 불살랐습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "최후의 전사 (Combat)";
          logs.push(`💀 766년: [역사] ${event} -> 주사위 ${roll} - 아들 롤랑의 성인식을 몇 달 앞두고 가문의 무훈을 빛내며 성벽 아래에서 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 766년: [역사] ${event} -> 주사위 ${roll} - 황실 가드 임무를 다했습니다.`);
        } else if (roll <= 15) {
          runCombatSurvival(yr, event + " (몽펠리에 공성전)", false, 0, true, 50);
        } else {
          const res = runCombatSurvival(yr, event + " (에그르몽 대승)", false, 0, true, 50);
          if (!res.dead) {
            fGlory += 25;
            logs.push(`⛪ 766년: [역사] ${event} -> 주사위 ${roll} - 이교도 귀족 위비앙 부부의 역사적인 기독교 세례 성사에서 가문의 명예 하객 대열을 호위하셨습니다! (+25 Glory)`);
          }
        }
      }
    }

    if (!fDead) {
      fDeathYr = 766 + rollD20();
      fCause = "평화로운 영면 (Old Age)";
      logs.push(`👴 ${fDeathYr}년: 은퇴한 아버님(제라르 경)께서 영광스러운 대공의 은퇴 생활 도중 침상에서 평화로이 서거하셨습니다.`);
    }

    setFatherGlory(fGlory);
    setFatherDeathYear(fDeathYr);
    setFatherDeathCause(fCause);
    setFatherHates({ saxons: fHateSaxons, moors: fHateMoors, cruel: fCruel });
    setFatherHonorModifier(fHonorMod);
    setChronicleBirthGifts(gfBirthGifts);

    logs.push("");
    logs.push("🎉 [연대기 결과 요약]");
    logs.push(`• 조부 최종 영광: ${gfGlory} Glory (생존기간: 702~${gfDeathYr}, 사인: ${gfCause})`);
    logs.push(`• 부친 최종 영광: ${fGlory} Glory (생존기간: 724~${fDeathYr}, 사인: ${fCause})`);
    logs.push(`• 조상으로부터 플레이어 캐릭터(당신)에게 계승될 유산:`);
    logs.push(`  - 계승 영광: +${Math.floor(fGlory / 10)} Glory (부친 영광의 1/10)`);
    if (fHateSaxons > 10) logs.push(`  - 계승 증오: 작센인에 대한 증오 Passion [${fHateSaxons}]`);
    if (fHateMoors > 10) logs.push(`  - 계승 증오: 이교도(무어인)에 대한 증오 Passion [${fHateMoors}]`);
    if (fHateDanes > 10) logs.push(`  - 계승 증오: 덴마크인에 대한 증오 Passion [${fHateDanes}]`);
    if (fCruel > 0) logs.push(`  - 계승 기질: 무자비함(Cruel) 기질 +${fCruel} (캐릭터 시트 반영)`);
    if (fHonorMod !== 0) logs.push(`  - 계승 명예 보정치: Honor Passion [${fHonorMod >= 0 ? '+' : ''}${fHonorMod}]`);
    if (gfBirthGifts > 0) logs.push(`  - 계승 하사품: 프랑크 탄생 선물(Birth Gift) +${gfBirthGifts}회 롤링 획득 가능`);

    setAncestorRollLog(logs);
    setAncestorApplied(false);
  };


	  const applyAncestorLegacy = () => {
	    if (ancestorApplied || hasAppliedEvent(character, 'ancestor:legacy')) {
        alert("조상 연대기 유산은 이미 이 캠페인에 반영되었습니다.");
        return;
      }

    // Roll birth gifts first
    const rolledGiftsText = [];
    const rollGiftIndices = [];
    let giftsToRoll = chronicleBirthGifts;
    
    for (let i = 0; i < giftsToRoll; i++) {
      const roll = Math.floor(Math.random() * 20) + 1;
      rollGiftIndices.push(roll);
      const gift = birthGiftsTable[roll - 1];
      if (gift) {
        rolledGiftsText.push(`[주사위 ${roll}] ${gift.name} (${gift.benefit})`);
        if (roll === 19) {
          // Roll twice (adds 2 more rolls)
          giftsToRoll += 2;
        }
      }
    }

	    setCharacter(prev => {
        const result = applyOnce(prev, 'ancestor:legacy', updated => {

	      const inheritedGlory = Math.floor(fatherGlory / 10);
      updated.gear.gloryTotal = (updated.gear.gloryTotal || 1000) + inheritedGlory;

      if (fatherHates.saxons > 10) {
        updated.passions.hateSaxons = fatherHates.saxons;
      }
      if (fatherHates.moors > 10) {
        updated.passions.hateMoors = fatherHates.moors;
      }
      if (fatherHates.danes > 10) {
        updated.passions.hateDanes = fatherHates.danes;
      }

      // Inherit Cruel trait if father had any
      if (fatherHates.cruel && fatherHates.cruel > 0) {
        const currentCruel = updated.traits.cruel || 9;
        const newCruel = Math.min(20, currentCruel + fatherHates.cruel);
        updated.traits.cruel = newCruel;
        updated.traits.merciful = 20 - newCruel;
      }

      // Inherit Honor modifier if father had any
      if (fatherHonorModifier !== 0) {
        updated.family.honor = (updated.family.honor || 16) + fatherHonorModifier;
        updated.passions.honor = (updated.passions.honor || 16) + fatherHonorModifier;
      }

      // Apply the pre-rolled birth gifts
      rollGiftIndices.forEach(roll => {
        const gift = birthGiftsTable[roll - 1];
        if (gift) {
          gift.apply(updated);
        }
      });

      if (updated.family && updated.family.members) {
        updated.family.members = updated.family.members.map(m => {
          if (m.id === 'albert' || m.relation === '조부') {
            return {
              ...m,
              name: updated.family.ancestor || m.name,
              lifeYears: `702~${grandfatherDeathYear}`,
              status: '사망',
              deathCause: grandfatherDeathCause,
              note: `가문의 기틀을 세운 조부. ${grandfatherDeathCause}로 서거. 최종 영광 ${grandfatherGlory} Glory.`
            };
          }
          if (m.id === 'gerard' || m.relation === '부친') {
            return {
              ...m,
              lifeYears: `724~${fatherDeathYear}`,
              status: '사망',
              deathCause: fatherDeathCause,
              note: `작센 및 파비아 원정에 참전한 부친. ${fatherDeathCause}로 장렬히 서거. 최종 영광 ${fatherGlory} Glory.`
            };
          }
          if (m.relation === '본인') {
            return {
              ...m,
              name: updated.personal.name || m.name
            };
          }
          return m;
        });
      }

	      if (updated.family) {
	        updated.family.ancestorRollLog = [...ancestorRollLog];
	        updated.family.ancestorApplied = true;
          updated.family.chronicleState = {
            ...(updated.family.chronicleState || {}),
            grandfatherGlory,
            grandfatherDeathYear,
            grandfatherDeathCause,
            fatherGlory,
            fatherDeathYear,
            fatherDeathCause,
            fatherHates,
            fatherHonorModifier,
            chronicleBirthGifts,
            ancestorApplied: true
          };
	      }

	      return updated;
        }, '조상 연대기 유산');
        return result.character;
	    });

    setAncestorApplied(true);
    const inheritedGloryMsg = `\n(계승 영광: +${Math.floor(fatherGlory / 10)} Glory)`;
    const inheritedHonorMsg = fatherHonorModifier !== 0 
      ? `\n(계승 명예 보정: ${fatherHonorModifier >= 0 ? '+' : ''}${fatherHonorModifier} Honor)`
      : '';
    const inheritedCruelMsg = fatherHates.cruel && fatherHates.cruel > 0 
      ? `\n(계승 잔혹성 기질: +${fatherHates.cruel} Cruel)`
      : '';
    const inheritedGiftsMsg = rolledGiftsText.length > 0
      ? `\n\n🎁 [가문 전승 하사품 획득!]\n${rolledGiftsText.join('\n')}`
      : '';
    alert(`조상들의 연대기 유산이 캐릭터 시트와 가계도에 영구히 반영되었습니다!${inheritedGloryMsg}${inheritedHonorMsg}${inheritedCruelMsg}${inheritedGiftsMsg}`);
  };

  const syncFamilyTreeOnly = () => {
    setCharacter(prev => {
      const updated = JSON.parse(JSON.stringify(prev));

      if (updated.family && updated.family.members) {
        updated.family.members = updated.family.members.map(m => {
          if (m.id === 'albert' || m.relation === '조부') {
            return {
              ...m,
              name: updated.family.ancestor || m.name,
              lifeYears: `702~${grandfatherDeathYear}`,
              status: '사망',
              deathCause: grandfatherDeathCause,
              note: `가문의 기틀을 세운 조부. ${grandfatherDeathCause}로 서거. 최종 영광 ${grandfatherGlory} Glory.`
            };
          }
          if (m.id === 'gerard' || m.relation === '부친') {
            return {
              ...m,
              lifeYears: `724~${fatherDeathYear}`,
              status: '사망',
              deathCause: fatherDeathCause,
              note: `작센 및 파비아 원정에 참전한 부친. ${fatherDeathCause}로 장렬히 서거. 최종 영광 ${fatherGlory} Glory.`
            };
          }
          if (m.relation === '본인') {
            return {
              ...m,
              name: updated.personal.name || m.name
            };
          }
          return m;
        });
      }

      if (updated.family) {
        updated.family.ancestorRollLog = [...ancestorRollLog];
        updated.family.ancestorApplied = true;
      }

      return updated;
    });

    alert(`가계도 계보의 조상(조부, 부친) 정보가 연대기 결과로 재연동되었습니다!\n• 조부: 702~${grandfatherDeathYear} (${grandfatherDeathCause})\n• 부친: 724~${fatherDeathYear} (${fatherDeathCause || '평화로운 영면'})`);
  };

  const handleFamilyChange = (field, value) => {
    setCharacter(prev => {
      const updated = {
        ...prev,
        family: {
          ...prev.family,
          [field]: value
        }
      };
      if (field === 'ancestor' && updated.family && updated.family.members) {
        updated.family.members = updated.family.members.map(m => {
          if (m.id === 'albert' || m.relation === '조부') {
            return { ...m, name: value };
          }
          return m;
        });
      }
      return updated;
    });
  };


  

  // --- Salvation Roll handlers ---
  const rollSalvation = () => {
    // Calculate lowest religious trait
    const chaste = character.traits.chaste || 10;
    const forgiving = character.traits.forgiving || 10;
    const merciful = character.traits.merciful || 10;
    const modest = character.traits.modest || 10;
    const temperate = character.traits.temperate || 10;
    const trusting = character.traits.trusting || 10;

    const lowestReligiousTrait = Math.min(chaste, forgiving, merciful, modest, temperate, trusting);

    // Passion bonuses
    const amorVal = character.passions.amor || 0;
    const honorVal = character.passions.honor || 0;
    const loyaltyLiege = character.passions.loyaltyLiege || 0;
    const loveGodVal = character.passions.loveGod || 0;

    const amorBonus = Math.min(5, Math.max(0, amorVal - 15));
    const honorBonus = Math.min(5, Math.max(0, honorVal - 15));
    const liegeBonus = Math.min(5, Math.max(0, loyaltyLiege - 15));
    const godBonus = Math.min(5, Math.max(0, loveGodVal - 15));

    const deedsBonus = (salvationDeedsPaladin ? 5 : 0) +
      (salvationDeedsHolyWar ? 5 : 0) +
      Math.min(5, Math.max(0, parseInt(salvationPagans) || 0)) +
      (parseInt(salvationCustomDeeds) || 0);

    const totalSalvationScore = lowestReligiousTrait + amorBonus + honorBonus + liegeBonus + godBonus + deedsBonus;

    let d20 = parseInt(salvationManualD20);
    if (isNaN(d20) || d20 < 1 || d20 > 20) {
      d20 = Math.floor(Math.random() * 20) + 1;
    }

    let outcome = "";
    let destination = "";
    let saintEligible = false;
    let isSaint = false;

    // Critical
    if (d20 === 1) {
      outcome = "⭐ 임계 성공 (Critical Success!)";
      destination = "👼 천국 직행 (Immediate Heaven!)";
      if (deedsBonus >= 15) {
        saintEligible = true;
      }
    }
    // Fumble
    else if (d20 === 20) {
      outcome = "💀 임계 실패 (Fumble!)";
      if (totalSalvationScore <= 5) {
        destination = "🔥 지옥 낙하 (Damned to Hell!)";
      } else {
        destination = "⛪ 연옥 (Purgatory)";
      }
    }
    // Success
    else if (d20 <= totalSalvationScore) {
      outcome = "✅ 성공 (Success)";
      destination = "👼 천국 (Heaven)";
    }
    // Failure
    else {
      outcome = "❌ 실패 (Failure)";
      destination = "⛪ 연옥 (Purgatory)";
    }

    // If saint eligible, check church standing
    const churchStanding = character.standings.church || 15;
    const churchRoll = Math.floor(Math.random() * 20) + 1;
    if (saintEligible && churchRoll <= churchStanding) {
      isSaint = true;
    }

    setSalvationRollResult({
      roll: d20,
      total: totalSalvationScore,
      outcome,
      destination,
      isSaint,
      churchRoll,
      churchStanding
    });
  };

  const applySalvationLegacy = () => {
    if (!salvationRollResult) return;
    const { isSaint } = salvationRollResult;

    setCharacter(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      
      const oldName = prev.personal.name || "롤랑 경";
      const currentYear = prev.personal.campaignYear || 768;
      const newName = "계승자 " + oldName.replace(" 경", "").replace("Sir ", "");
      
      // Find old self in family tree
      const oldSelfIndex = updated.family?.members?.findIndex(m => m.relation === '본인') ?? -1;
      let oldSelfId = 'roland';
      let oldSelfGen = 3;
      
      if (oldSelfIndex !== -1 && updated.family && updated.family.members) {
        const oldSelf = updated.family.members[oldSelfIndex];
        oldSelfId = oldSelf.id;
        oldSelfGen = oldSelf.generation;
        
        // Transition previous self to be "부친" and set as "사망"
        oldSelf.relation = '부친';
        oldSelf.status = '사망';
        const birthYear = currentYear - (prev.personal.age || 18);
        oldSelf.lifeYears = `${birthYear}~${currentYear}`;
        oldSelf.note = `대대적인 무공을 세우고 영면을 맞이한 선조. 최종 영광 ${prev.gear?.gloryTotal || 1000} Glory.`;
      }
      
      // Create new heir member
      const heirId = 'heir_' + Date.now();
      const newHeirMember = {
        id: heirId,
        name: newName,
        relation: '본인',
        generation: oldSelfGen + 1,
        status: '생존',
        lifeYears: `${currentYear}~`,
        note: `위대한 가문의 법통을 계승하는 새로운 후계 성기사 종자.`,
        parentId: oldSelfId
      };
      
      if (updated.family && updated.family.members) {
        updated.family.members.push(newHeirMember);
      }

      // Heirloom / legacy bonuses
      updated.gear.gloryTotal = Math.floor((updated.gear.gloryTotal || 1000) * 1.1); // Inherit 1.1x total glory in next generation
      updated.personal.age = 18;
      updated.personal.personalClass = "종자 (Squire)";
      updated.personal.name = newName;

      if (isSaint) {
        updated.personal.blessing = "가문의 수호 성인 축복 (Saintly Lineage)";
      }

      // Record succession in campaign year journal
      if (!updated.journal) updated.journal = {};
      const msg = `[계승] 기사 ${oldName} 은퇴/사망 및 후계자 ${newName} 가업 승계.`;
      const currentEntry = updated.journal[currentYear]?.text || '';
      updated.journal[currentYear] = {
        text: currentEntry ? `${currentEntry}\n\n• ${msg}` : `• ${msg}`,
        updatedAt: new Date().toISOString()
      };

      return updated;
    });

    alert("기사의 은퇴 판정 유산이 성기사 캐릭터 시트에 영구히 반영되었습니다!\n(다음 세대 계승자 종자가 가계도와 시트에 추가되었습니다!)");
  };
  const [editingMember, setEditingMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  
  // Modal Form States
  const [formName, setFormName] = useState('');
  const [formNameKo, setFormNameKo] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formMemberClass, setFormMemberClass] = useState('기사 (Knight)');
  const [formRelation, setFormRelation] = useState('자녀');
  const [formGeneration, setFormGeneration] = useState(3);
  const [formStatus, setFormStatus] = useState('생존');
  const [formLifeYears, setFormLifeYears] = useState('');
  const [formNote, setFormNote] = useState('');
  const [formDeathCause, setFormDeathCause] = useState('');
  const [formParentId, setFormParentId] = useState('');
  const [formSpouseId, setFormSpouseId] = useState('');
  const [formGender, setFormGender] = useState('male');

  const [fcRoll, setFcRoll] = useState('');
  const [fcManualD20, setFcManualD20] = useState('');
  const [fcChoiceSkill, setFcChoiceSkill] = useState('');
  const [fcChoiceValue, setFcChoiceValue] = useState(10);
  const [fcChoiceAttribute, setFcChoiceAttribute] = useState('');

  useEffect(() => {
    if (fcRoll === 20 && !fcChoiceSkill && character?.skills) {
      const firstSkill = Object.keys(character.skills)[0] || '';
      setFcChoiceSkill(firstSkill);
    }
  }, [fcRoll, character.skills]);

  const treeContainerRef = useRef(null);
  const hasCenteredRef = useRef(false);
  const [lines, setLines] = useState([]);
  const [showRelationLines, setShowRelationLines] = useState(false);
  const dragRef = useRef({
    memberId: null,
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
    isDragging: false
  });

  const handleMouseDown = (e, memberId) => {
    if (e.target.closest('.ft-action-btn') || e.target.closest('button')) return;

    const positions = character.family?.positions || {};
    const pos = positions[memberId] || { x: 0, y: 0 };
    
    dragRef.current = {
      memberId,
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: pos.x,
      startOffsetY: pos.y,
      isDragging: false
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    const drag = dragRef.current;
    if (!drag.memberId) return;

    const dx = e.clientX - drag.startX;

    if (!drag.isDragging && Math.abs(dx) > 3) {
      drag.isDragging = true;
    }

    if (drag.isDragging) {
      const nextX = Math.max(-450, Math.min(450, drag.startOffsetX + dx));

      setCharacter(prev => {
        const updated = JSON.parse(JSON.stringify(prev));
        if (!updated.family.positions) {
          updated.family.positions = {};
        }
        updated.family.positions[drag.memberId] = { x: nextX, y: 0 };
        return updated;
      });
    }
  };

  const handleMouseUp = () => {
    dragRef.current = { memberId: null, startX: 0, startY: 0, startOffsetX: 0, startOffsetY: 0, isDragging: false };
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e, memberId) => {
    if (e.target.closest('.ft-action-btn') || e.target.closest('button')) return;
    const touch = e.touches[0];
    const positions = character.family?.positions || {};
    const pos = positions[memberId] || { x: 0, y: 0 };
    
    dragRef.current = {
      memberId,
      startX: touch.clientX,
      startY: touch.clientY,
      startOffsetX: pos.x,
      startOffsetY: pos.y,
      isDragging: false
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    const drag = dragRef.current;
    if (!drag.memberId) return;
    const touch = e.touches[0];

    const dx = touch.clientX - drag.startX;

    if (!drag.isDragging && Math.abs(dx) > 3) {
      drag.isDragging = true;
    }

    if (drag.isDragging) {
      const nextX = Math.max(-450, Math.min(450, drag.startOffsetX + dx));

      setCharacter(prev => {
        const updated = JSON.parse(JSON.stringify(prev));
        if (!updated.family.positions) {
          updated.family.positions = {};
        }
        updated.family.positions[drag.memberId] = { x: nextX, y: 0 };
        return updated;
      });
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    dragRef.current = { memberId: null, startX: 0, startY: 0, startOffsetX: 0, startOffsetY: 0, isDragging: false };
  };

  const handleResetPositions = () => {
    if (window.confirm("가문원 카드의 수동 배치 위치를 모두 초기화하고 자동 정렬 상태로 되돌리시겠습니까?")) {
      setCharacter(prev => {
        const nextChar = JSON.parse(JSON.stringify(prev));
        nextChar.family.positions = {};
        return nextChar;
      });
    }
  };

	  const handleInheritCharacter = () => {
	    if (!editingMember) return;
      const eventId = `succession:${editingMember.id}`;
      if (hasAppliedEvent(character, eventId)) {
        alert("이 후계자로의 승계는 이미 처리되었습니다.");
        return;
      }
	    const confirmInherit = window.confirm(`정말로 이 인물(${editingMember.name})로 대를 이어 플레이를 계속하시겠습니까?\n• 기사 시트의 실명, 나이(가계도 기반 자동 계산)가 동적 전환됩니다.\n• 가계도 내 기존 '본인'은 은퇴/사망 처리되고 이 인물이 새로운 '본인'이 됩니다.`);
	    if (!confirmInherit) return;

    const birthYearStr = editingMember.lifeYears?.split('~')?.[0]?.trim() || '';
    const birthYear = parseInt(birthYearStr) || 768;
    const currentYear = character.personal?.campaignYear || 768;
	    const calculatedAge = currentYear - birthYear;
      if (!Number.isFinite(calculatedAge) || calculatedAge < 18) {
        alert("18세 미만 후계자는 플레이 가능한 기사로 승계할 수 없습니다.");
        return;
      }

	    setCharacter(prev => {
        const result = applyOnce(prev, eventId, updated => {

      const oldName = prev.personal?.name || "롤랑 경";
      const newName = editingMember.name;

      // 1. Find and update the old "본인"
      const oldSelfIndex = updated.family?.members?.findIndex(m => m.relation === '본인') ?? -1;
      let oldSelfId = 'roland';
      if (oldSelfIndex !== -1 && updated.family && updated.family.members) {
        const oldSelf = updated.family.members[oldSelfIndex];
        oldSelfId = oldSelf.id;
        const isChildOfOldSelf = editingMember.parentId === oldSelf.id;
	        oldSelf.relation = isChildOfOldSelf ? '부친' : '친족';
	        oldSelf.status = '은퇴';
	        oldSelf.lifeYears = oldSelf.lifeYears.split('~')[0] + `~${currentYear}`;
	        oldSelf.note = `위대한 모험을 마치고 명예롭게 은퇴한 선조 기사. 최종 영광 ${prev.gear?.gloryTotal || 1000} Glory.`;
	      }

      // 2. Find and update the new "본인" in members array
      if (updated.family && updated.family.members) {
        updated.family.members = updated.family.members.map(m => {
          if (m.id === editingMember.id) {
            return {
              ...m,
              relation: '본인',
              status: '생존',
              note: `가문의 영광스러운 기사직을 새로이 계승한 플레이어 캐릭터.`
            };
          }
          return m;
        });
      }

      // 3. Update character sheet profile
	      updated.personal = {
          ...updated.personal,
          name: editingMember.name,
          age: calculatedAge,
          personalClass: "기사 (Knight)"
        };
        updated.attributes = {
          siz: 14, dex: 12, str: 13, con: 12, app: 11, currentHp: 26
        };
        updated.skills = {
          awareness: 8, chirurgery: 1, faerieLore: 2, firstAid: 10, folkLore: 4,
          horsemanship: 12, hunting: 6, industry: 5, recognize: 5, religion: 6, stewardship: 3, swimming: 5,
          courtesy: 8, dancing: 2, eloquence: 6, falconry: 4, gaming: 5, heraldry: 5, intrigue: 3, playInstruments: 1, readingWriting: 2, romance: 4, singing: 3,
          battle: 10, siege: 5, axe: 6, bludgeon: 5, dagger: 8, spear: 10, sword: 13, unarmed: 6,
          lance: 12, bow: 4, crossbow: 5, thrownWeapon: 4
        };
        updated.traits = {
          chaste: 10, lustful: 10, energetic: 12, lazy: 8, forgiving: 11, vengeful: 9,
          generous: 13, selfish: 7, honest: 12, deceitful: 8, just: 10, arbitrary: 10,
          merciful: 11, cruel: 9, modest: 10, proud: 10, pious: 12, worldly: 8,
          prudent: 10, reckless: 10, temperate: 10, indulgent: 10, trusting: 11, suspicious: 9,
          valorous: 15, cowardly: 5
        };
        updated.passions = {
          loyaltyLiege: 15,
          loveFamily: 15,
          hospitality: 15,
          honor: 16,
          hateSaracens: 12,
          loveGod: 15
        };
        updated.skillsChecked = {};
        updated.traitsChecked = {};
        updated.passionsChecked = {};
        updated.gear = {
          armorShield: "사슬갑옷 (10점) + 방패 (+3)",
          clothing: "£2 상당의 궁정 튜닉",
          personalGear: "나무 십자가, 숫돌, 리넨 천 뭉치",
          homePossessions: "가문 상속 장비",
          cash: 5,
          gloryThisGame: 0,
          gloryTotal: 1000 + Math.floor((prev.gear?.gloryTotal || 0) / 10)
        };

      // 4. Record succession in campaign year journal
      if (!updated.journal) updated.journal = {};
      const msg = `[계승] 기사 ${oldName} 은퇴/사망 및 후계자 ${newName} 가업 승계.`;
      const currentEntry = updated.journal[currentYear]?.text || '';
      updated.journal[currentYear] = {
        text: currentEntry ? `${currentEntry}\n\n• ${msg}` : `• ${msg}`,
        updatedAt: new Date().toISOString()
      };

	      return updated;
        }, `가문 승계: ${editingMember.name}`);
        return result.character;
	    });

    setIsModalOpen(false);
    setEditingMember(null);
    alert(`[가문 상속 완료]: 새로운 계승자 기사(${editingMember.name}, ${calculatedAge}세)로의 전환이 시트와 가계도에 공식 적용되었습니다!`);
  };

  const members = useMemo(() => {
    return (character.family?.members || []).map(m => {
      if (m.relation === '본인') {
        return { ...m, name: character.personal?.name || m.name };
      }
      return m;
    });
  }, [character.family?.members, character.personal?.name]);

  // Default Template for reset
  const defaultMembers = [
    { id: 'albert', name: '알베르 경 (Sir Albert)', relation: '조부', generation: 1, status: '사망', lifeYears: '702~770', deathCause: '영지 분쟁', note: '샤를마뉴 대제 초기의 백작 기사이자 전설적인 용사.', gender: 'male' },
    { id: 'gerard', name: '제라르 경 (Sir Gerard)', relation: '부친', generation: 2, status: '사망', lifeYears: '724~768', deathCause: '파비아 공성전', note: '작센 원정에서 주군을 구하고 명예롭게 전사.', spouseId: 'eleanor', gender: 'male' },
    { id: 'eleanor', name: '엘레오노르 부인 (Lady Eleanor)', relation: '모친', generation: 2, status: '생존', lifeYears: '748~', note: '기품 있는 성품으로 영지 관리를 돌보는 인자한 어머니.', spouseId: 'gerard', gender: 'female' },
    { id: 'roland', name: '롤랑 경 (Sir Roland)', relation: '본인', generation: 3, status: '생존', lifeYears: '768~', note: '플레이어 캐릭터. 샤를마뉴 대제의 젊은 성기사.', parentId: 'gerard', gender: 'male' },
    { id: 'pierre', name: '피에르 경 (Sir Pierre)', relation: '남동생', generation: 3, status: '생존', lifeYears: '772~', note: '형의 뒤를 이어 성기사가 되기 위해 맹훈련 중인 종자.', parentId: 'gerard', gender: 'male' }
  ];

  // SVG Lines Calculation
  // SVG Lines Calculation
  const calculateLines = useCallback(() => {
    if (!showRelationLines) {
      setLines(prevLines => (prevLines.length ? [] : prevLines));
      return;
    }
    if (!treeContainerRef.current) return;
    const containerRect = treeContainerRef.current.getBoundingClientRect();
    const computedLines = [];

    // Track drawn marriages to avoid duplicate lines
    const drawnMarriages = new Set();

    // Helper to robustly find card DOM elements by attribute value (bypassing querySelector syntax/escaping quirks)
    const findNodeEl = (id) => {
      if (!treeContainerRef.current || !id) return null;
      const nodes = treeContainerRef.current.querySelectorAll('[data-node-id]');
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].getAttribute('data-node-id') === String(id)) {
          return nodes[i];
        }
      }
      return null;
    };

    // Cache generation bounds to place horizontal lines in the center of the vertical gaps
    const genBounds = {};
    const getGenBounds = (g) => {
      if (genBounds[g]) return genBounds[g];
      const genMembers = members.filter(m => m.generation === g);
      let minTop = Infinity;
      let maxBottom = -Infinity;
      genMembers.forEach(m => {
        const el = findNodeEl(m.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top - containerRect.top;
          const bottom = rect.bottom - containerRect.top;
          if (top < minTop) minTop = top;
          if (bottom > maxBottom) maxBottom = bottom;
        }
      });
      const bounds = { minTop, maxBottom };
      genBounds[g] = bounds;
      return bounds;
    };

    members.forEach(member => {
      // 1. Marriage Lines
      if (member.spouseId && !drawnMarriages.has(`${member.id}-${member.spouseId}`) && !drawnMarriages.has(`${member.spouseId}-${member.id}`)) {
        const nodeEl = findNodeEl(member.id);
        const spouseEl = findNodeEl(member.spouseId);
        
        if (nodeEl && spouseEl) {
          const r1 = nodeEl.getBoundingClientRect();
          const r2 = spouseEl.getBoundingClientRect();

          // Draw line from the right edge of the left card to the left edge of the right card
          const isLeft = r1.left < r2.left;
          const leftCard = isLeft ? r1 : r2;
          const rightCard = isLeft ? r2 : r1;

          const x1 = leftCard.right - containerRect.left;
          const y1 = (leftCard.top + leftCard.bottom) / 2 - containerRect.top;
          const x2 = rightCard.left - containerRect.left;
          const y2 = (rightCard.top + rightCard.bottom) / 2 - containerRect.top;

          computedLines.push({
            type: 'marriage',
            id: `m-${member.id}-${member.spouseId}`,
            x1, y1, x2, y2,
            path: `M ${x1} ${y1} L ${x2} ${y2}`
          });
          drawnMarriages.add(`${member.id}-${member.spouseId}`);
        }
      }

      // 2. Parent-Child Lines
      if (member.parentId) {
        const childEl = findNodeEl(member.id);
        const parentNode = members.find(m => m.id === member.parentId);
        
        if (childEl && parentNode) {
          const childRect = childEl.getBoundingClientRect();
          const childX = (childRect.left + childRect.right) / 2 - containerRect.left;
          const childY = childRect.top - containerRect.top;

          // If the parent has a spouse, we should draw from the marriage center rather than a single parent
          let parentX, parentY;
          const parentEl = findNodeEl(parentNode.id);
          const spouseEl = parentNode.spouseId ? findNodeEl(parentNode.spouseId) : null;

          if (parentEl && spouseEl) {
            const pr = parentEl.getBoundingClientRect();
            const sr = spouseEl.getBoundingClientRect();
            parentX = ((pr.left + pr.right) / 2 + (sr.left + sr.right) / 2) / 2 - containerRect.left;
            parentY = ((pr.top + pr.bottom) / 2 + (sr.top + sr.bottom) / 2) / 2 - containerRect.top;
          } else if (parentEl) {
            const pr = parentEl.getBoundingClientRect();
            parentX = (pr.left + pr.right) / 2 - containerRect.left;
            parentY = pr.bottom - containerRect.top;
          }

          if (parentX !== undefined && parentY !== undefined) {
            // Determine vertical center of the gap between the parent's generation and child's generation
            const parentGenBounds = getGenBounds(parentNode.generation);
            const childGenBounds = getGenBounds(member.generation);
            
            let midY;
            if (parentGenBounds.maxBottom !== -Infinity && childGenBounds.minTop !== Infinity && childGenBounds.minTop > parentGenBounds.maxBottom) {
              midY = (parentGenBounds.maxBottom + childGenBounds.minTop) / 2;
            } else {
              midY = (parentY + childY) / 2;
            }

            // Orthogonal routing (직각 형태 연결선)
            const path = `M ${parentX} ${parentY} L ${parentX} ${midY} L ${childX} ${midY} L ${childX} ${childY}`;
            
            computedLines.push({
              type: 'lineage',
              id: `l-${parentNode.id}-${member.id}`,
              path
            });
          }
        }
      }
    });

    setLines(prevLines => (areTreeLinesEqual(prevLines, computedLines) ? prevLines : computedLines));
  }, [members, showRelationLines]);

  useLayoutEffect(() => {
    // 1. Calculate lines immediately
    calculateLines();

    // 2. Schedule progressive recalculations for animations or font loads
    const timeouts = [50, 150, 300, 600, 1000].map(delay => 
      setTimeout(() => {
        calculateLines();
      }, delay)
    );

    // 3. Re-align lines when transitions finish inside the container
    const container = treeContainerRef.current;
    const handleTransitionEnd = (e) => {
      calculateLines();
    };
    if (container) {
      container.addEventListener('transitionend', handleTransitionEnd);
    }

    // 4. Handle resize events
    window.addEventListener('resize', calculateLines);
    
    // 5. Setup ResizeObserver for dynamic DOM shifts
    let observer;
    if (container && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        calculateLines();

        // Centering logic inside ResizeObserver to guarantee scrollWidth is fully calculated
        if (!hasCenteredRef.current) {
          const wrapper = container.parentElement;
          if (wrapper) {
            const maxScroll = container.scrollWidth - wrapper.clientWidth;
            if (maxScroll > 0) {
              wrapper.scrollLeft = maxScroll / 2;
              hasCenteredRef.current = true;
            }
          }
        }
      });
      observer.observe(container);
    }

    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener('resize', calculateLines);
      if (container) {
        container.removeEventListener('transitionend', handleTransitionEnd);
      }
      if (observer) observer.disconnect();
    };
  }, [calculateLines, character.family?.positions]);

  const handleRandomName = (gender) => {
    setFormGender(gender);
    // 50% chance: Choose from pre-defined historical names
    // 50% chance: Combine Frankish prefixes & suffixes
    const isFrankish = Math.random() < 0.5;

    if (!isFrankish) {
      const pool = gender === 'male' ? maleNames : femaleNames;
      const selected = pool[Math.floor(Math.random() * pool.length)];
      if (selected) {
        setFormNameKo(selected.ko);
        setFormNameEn(selected.en);
      }
    } else {
      const prefixes = gender === 'male' ? frankishMalePrefixes : frankishFemalePrefixes;
      const suffixes = gender === 'male' ? frankishMaleSuffixes : frankishFemaleSuffixes;
      const randPre = prefixes[Math.floor(Math.random() * prefixes.length)];
      const randSuf = suffixes[Math.floor(Math.random() * suffixes.length)];

      const cleanPre = randPre.split('/')[0].replace('(', '').replace(')', '').replace('-', '');
      const cleanSuf = randSuf.split('/')[0].replace('(', '').replace(')', '').replace('-', '');

      const fullNameEN = cleanPre + cleanSuf;
      const capitalizedEN = fullNameEN.charAt(0).toUpperCase() + fullNameEN.slice(1).toLowerCase();

      const preKoMap = {
        Adal: '아달', Amal: '아말', Agil: '아길', Ag: '아그', Ald: '알드', Alb: '알브', And: '안드', Ans: '안스',
        Angil: '앙질', Arbo: '아르보', Arn: '아르노', Aud: '오드', Aut: '오', Bald: '발드', Baud: '보',
        Bern: '베른', Bert: '베르', Brun: '브륀', Char: '샤를', Gar: '가르', Chil: '실', Chlo: '클로',
        Dag: '다그', Ever: '에베르', Erle: '에를레', Megin: '메진', Fara: '파라', Floris: '플로리스',
        Fred: '프레드', Frid: '프리드', Foul: '풀', Fulc: '풀크', Geno: '제노', Ger: '제르', Geld: '겔드',
        Gond: '공', Gund: '군드', Grim: '그림', Guerim: '게랭', Had: '하드', Hard: '하르드', Hegi: '헤지',
        Her: '헤르', Heil: '하일', Heim: '하임', Hugo: '위고', Huno: '위노', Ingo: '인고', Irmin: '이르민',
        Isem: '이젬', Lam: '람', Land: '랑드', Lud: '뤼드', Madal: '마달', Magin: '마쟁', Marc: '마르크',
        Mero: '메로', Nort: '노르', Raban: '라반', Rade: '라드', Ragno: '라뇨', Ragin: '라쟁', Rein: '랭',
        Rich: '리슈', Rudo: '뤼도', Sig: '지그', Swind: '스윈드', Theod: '테오드', Thiad: '티아드',
        Thurin: '튀랭', Walde: '발데', Warin: '와랭', Wido: '위도', Wulf: '울프',
        Ad: '아드', Bas: '바지', Chrot: '크로', Dhuo: '듀오', Flor: '플로르', Fleur: '플뢰르', Folch: '폴슈',
        Gise: '지젤', Hersi: '에르지', Hilde: '힐데', Inge: '인게', Mat: '마트', Mar: '마르', Nant: '낭', Rol: '롤', Theo: '테오'
      };

      const sufKoMap = {
        atus: '아투스', bert: '베르', bard: '바르', bold: '보', obald: '보', baud: '보', bern: '베르',
        brand: '브랑', char: '샤르', gar: '가르', ger: '지에', cor: '코르', drad: '드라', don: '동',
        dio: '디오', duin: '댕', elin: '랭', eric: '리', oric: '리', fried: '프리드', fred: '프레드',
        froid: '프루아', gand: '강', gang: '강', gaud: '고', gast: '가스트', grim: '그림', hard: '하르드',
        hart: '하르트', helm: '엘름', er: '에', hair: '에르', ing: '앵', land: '랑', lant: '랑',
        mar: '마르', mer: '메르', man: '망', mond: '몽', nier: '니에', olph: '올프', gulph: '울프',
        omer: '오메르', imer: '이메르', rad: '라드', ric: '릭', vech: '베슈', veus: '보', wald: '발트',
        win: '뱅', ouin: '댕', wulf: '울프',
        burge: '뷔르주', berga: '베르가', delis: '델리스', da: '다', tha: '타', dith: '디트', rada: '라다',
        trada: '트라다', elma: '엘마', fride: '프리드', pride: '프리드', gise: '지즈', gisela: '지젤라',
        gonde: '공드', gonda: '공다', haide: '아이드', hilde: '힐드', ilia: '일리아', hilda: '힐다',
        inga: '인가', landa: '린다', lina: '리나', lindis: '린디스', lena: '레나', trudis: '트뤼디스', truda: '트뤼다'
      };

      const koPre = preKoMap[cleanPre] || cleanPre;
      const koSuf = sufKoMap[cleanSuf] || cleanSuf;

      setFormNameKo(koPre + koSuf);
      setFormNameEn(capitalizedEN);
    }
  };

  const rollFamilyCharacteristic = () => {
    let r;
    if (fcManualD20) {
      const val = parseInt(fcManualD20);
      if (val >= 1 && val <= 20) {
        r = val;
      } else {
        alert("1부터 20 사이의 숫자를 입력해주세요!");
        return;
      }
    } else {
      r = Math.floor(Math.random() * 20) + 1;
    }
    setFcRoll(r);
    setFcManualD20('');
  };

	  const applyFamilyCharacteristicToCharacter = (rollVal, genderVal, choiceSkillVal, choiceValueVal, choiceAttributeVal) => {
	    const details = getCharacteristicDetails(rollVal, genderVal, choiceSkillVal, choiceValueVal, choiceAttributeVal);
	    if (!details) return;
      if (hasAppliedEvent(character, 'character_creation:family_characteristic')) {
        alert("가문 특성 보너스는 이미 이 캠페인에 반영되었습니다.");
        return;
      }

    const prevApplied = character.family?.characteristic?.appliedBonus;
    
	    setCharacter(prev => {
        const result = applyOnce(prev, 'character_creation:family_characteristic', draft => {
	      const nextSkills = { ...prev.skills };
	      const nextAttributes = { ...prev.attributes };

      if (prevApplied && prev.family?.characteristic?.applied) {
        if (prevApplied.skills) {
          Object.entries(prevApplied.skills).forEach(([sKey, val]) => {
            nextSkills[sKey] = Math.max(0, (nextSkills[sKey] || 0) - val);
          });
        }
        if (prevApplied.attributes) {
          Object.entries(prevApplied.attributes).forEach(([aKey, val]) => {
            nextAttributes[aKey] = Math.max(3, (nextAttributes[aKey] || 0) - val);
          });
        }
      }

      if (details.effect.skills) {
        Object.entries(details.effect.skills).forEach(([sKey, val]) => {
          nextSkills[sKey] = Math.min(20, (nextSkills[sKey] || 0) + val);
        });
      }
      if (details.effect.attributes) {
        Object.entries(details.effect.attributes).forEach(([aKey, val]) => {
          nextAttributes[aKey] = Math.min(20, (nextAttributes[aKey] || 0) + val);
        });
      }

	      return {
	        ...draft,
	        skills: nextSkills,
	        attributes: nextAttributes,
	        family: {
	          ...draft.family,
	          characteristic: {
            gender: genderVal,
            roll: rollVal,
            desc: details.desc,
            bonusText: details.bonusText,
            applied: true,
            appliedBonus: details.effect
          }
	        }
	      };
        }, `가문 특성: ${details.desc}`);
        return result.character;
	    });

    alert(`가문 특징 [${details.desc}] 보너스가 캐릭터 시트에 성공적으로 반영되었습니다!\n(${details.bonusText})`);
  };

  const removeFamilyCharacteristicFromCharacter = () => {
    const prevApplied = character.family?.characteristic?.appliedBonus;
    if (!prevApplied || !character.family?.characteristic?.applied) {
      alert("현재 캐릭터 시트에 반영된 가문 특징이 없습니다.");
      return;
    }

    setCharacter(prev => {
      const nextSkills = { ...prev.skills };
      const nextAttributes = { ...prev.attributes };

      if (prevApplied.skills) {
        Object.entries(prevApplied.skills).forEach(([sKey, val]) => {
          nextSkills[sKey] = Math.max(0, (nextSkills[sKey] || 0) - val);
        });
      }
      if (prevApplied.attributes) {
        Object.entries(prevApplied.attributes).forEach(([aKey, val]) => {
          nextAttributes[aKey] = Math.max(3, (nextAttributes[aKey] || 0) - val);
        });
      }

      return {
        ...prev,
        skills: nextSkills,
        attributes: nextAttributes,
        family: {
          ...prev.family,
          characteristic: {
            ...prev.family.characteristic,
            applied: false,
            appliedBonus: null
          }
        }
      };
    });

    alert("반영되었던 가문 특징 보너스를 캐릭터 시트에서 안전하게 해제했습니다.");
  };

  // Open Modal to Add Member
  const handleOpenAdd = (defaultParentId = '', defaultSpouseId = '', targetGen = 3) => {
    setModalMode('add');
    setFormNameKo('');
    setFormNameEn('');
    setFormMemberClass('기사 (Knight)');
    setFormName('');
    setFormRelation('자녀');
    setFormGeneration(targetGen);
    setFormStatus('생존');
    setFormLifeYears('');
    setFormNote('');
    setFormDeathCause('');
    setFormParentId(defaultParentId);
    setFormSpouseId(defaultSpouseId);
    
    if (defaultSpouseId) {
      const spouse = members.find(m => m.id === defaultSpouseId);
      if (spouse) {
        setFormGender(getGender(spouse) === 'male' ? 'female' : 'male');
      } else {
        setFormGender('male');
      }
    } else {
      setFormGender('male');
    }
    setFcRoll('');
    setFcManualD20('');
    setFcChoiceSkill('');
    setFcChoiceValue(10);
    setFcChoiceAttribute('');
    setIsModalOpen(true);
  };

  // Open Modal to Edit Member
  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setModalMode('edit');
    const parsed = parseName(member.name);
    setFormNameKo(parsed.ko);
    setFormNameEn(parsed.en);
    setFormMemberClass(member.memberClass || (member.name.includes('경') ? '기사 (Knight)' : member.name.includes('부인') ? '부인 (Lady)' : member.name.includes('공작') ? '공작 (Duke)' : member.name.includes('백작') ? '백작 (Count)' : member.name.includes('남작') ? '남작 (Baron)' : member.name.includes('영주') ? '영주 (Lord)' : '종자 (Squire)'));
    setFormName(member.name);
    setFormRelation(member.relation);
    setFormGeneration(member.generation);
    setFormStatus(member.status);
    setFormLifeYears(member.lifeYears || '');
    setFormNote(member.note || '');
    setFormDeathCause(member.deathCause || '');
    setFormParentId(member.parentId || '');
    setFormSpouseId(member.spouseId || '');
    setFormGender(member.gender || getGender(member));
    if (member.familyCharacteristic) {
      setFcRoll(member.familyCharacteristic.roll || '');
      setFcManualD20('');
      setFcChoiceSkill(member.familyCharacteristic.choiceSkill || '');
      setFcChoiceValue(member.familyCharacteristic.choiceValue || 10);
      setFcChoiceAttribute(member.familyCharacteristic.choiceAttribute || '');
    } else {
      setFcRoll('');
      setFcManualD20('');
      setFcChoiceSkill('');
      setFcChoiceValue(10);
      setFcChoiceAttribute('');
    }
    setIsModalOpen(true);
  };

  // Save Modal Form Data
  const handleSave = (e) => {
    e.preventDefault();
    try {
      if (!formNameKo.trim()) {
        alert("한국어 이름을 입력해 주세요!");
        return;
      }

      if (modalMode === 'edit' && !editingMember) {
        alert("수정할 대상 인물이 지정되지 않았습니다.");
        return;
      }

      // 수동 입력 관계가 없거나 지워진 경우, 저장 시점에 자동 계산된 촌수 관계를 구해서 대입해 줍니다.
      let savedRelation = formRelation.trim();
      const targetId = modalMode === 'edit' ? editingMember.id : ('m-' + Date.now());
      const selectedParent = formParentId ? members.find(m => m.id === formParentId) : null;
      const selectedSpouse = formSpouseId ? members.find(m => m.id === formSpouseId) : null;

      const wouldCreateParentCycle = (candidateParentId) => {
        let cursor = candidateParentId;
        const seen = new Set([targetId]);
        while (cursor) {
          if (seen.has(cursor)) return true;
          seen.add(cursor);
          const parent = members.find(m => m.id === cursor);
          cursor = parent?.parentId;
        }
        return false;
      };

      if (formParentId === targetId) {
        alert("가문원은 자기 자신을 부모로 지정할 수 없습니다.");
        return;
      }

      if (formSpouseId === targetId) {
        alert("가문원은 자기 자신을 배우자로 지정할 수 없습니다.");
        return;
      }

      if (formParentId && formSpouseId && formParentId === formSpouseId) {
        alert("같은 인물을 부모와 배우자로 동시에 지정할 수 없습니다.");
        return;
      }

      if (formParentId && wouldCreateParentCycle(formParentId)) {
        alert("부모 연결이 가문 계보 순환을 만들기 때문에 저장할 수 없습니다.");
        return;
      }

      if (selectedParent && Number(formGeneration) <= Number(selectedParent.generation || 0)) {
        alert("자녀 세대는 부모 세대보다 뒤여야 합니다.");
        return;
      }

      if (selectedSpouse && Number(selectedSpouse.generation) !== Number(formGeneration)) {
        alert("배우자는 같은 세대의 인물만 연결할 수 있습니다.");
        return;
      }

      if (
        selectedSpouse
        && (selectedSpouse.parentId === targetId || formParentId === selectedSpouse.id || selectedSpouse.id === selectedParent?.id)
      ) {
        alert("부모/자녀 관계의 인물은 배우자로 지정할 수 없습니다.");
        return;
      }
      
      if (!savedRelation) {
        const tempMember = {
          id: targetId,
          parentId: formParentId || undefined,
          spouseId: formSpouseId || undefined,
          gender: formGender,
          lifeYears: formLifeYears,
          relation: ''
        };
        const allMembersForCalc = modalMode === 'edit'
          ? members.map(m => m.id === editingMember.id ? tempMember : m)
          : [...members, tempMember];
        
        savedRelation = getCalculatedRelation(tempMember, allMembersForCalc);
      }

      // 핵심 인물(albert, gerard, eleanor, roland)의 관계 강제 보존
      if (modalMode === 'edit' && ['albert', 'gerard', 'eleanor', 'roland'].includes(editingMember.id)) {
        if (editingMember.id === 'albert') savedRelation = '조부';
        if (editingMember.id === 'gerard') savedRelation = '부친';
        if (editingMember.id === 'eleanor') savedRelation = '모친';
        if (editingMember.id === 'roland') savedRelation = '본인';
      }

      if (savedRelation === '본인' && formStatus === '생존') {
        const otherActiveSelf = members.find(m => m.id !== targetId && m.relation === '본인' && m.status === '생존');
        if (otherActiveSelf) {
          alert(`활성 플레이어 기사(본인)는 한 명만 존재할 수 있습니다. 현재 본인: ${otherActiveSelf.name}`);
          return;
        }
      }

      const combinedName = getTitleByNameAndClass(formNameKo, formNameEn, formMemberClass);
      let updatedMembers = [...members];
      const memberCharInfo = fcRoll ? {
        roll: Number(fcRoll),
        gender: formGender,
        desc: getCharacteristicDetails(Number(fcRoll), formGender, fcChoiceSkill, fcChoiceValue, fcChoiceAttribute)?.desc || '',
        bonusText: getCharacteristicDetails(Number(fcRoll), formGender, fcChoiceSkill, fcChoiceValue, fcChoiceAttribute)?.bonusText || '',
        choiceSkill: fcChoiceSkill,
        choiceValue: fcChoiceValue,
        choiceAttribute: fcChoiceAttribute
      } : undefined;

      if (modalMode === 'add') {
        const newMember = {
          id: targetId,
          name: combinedName,
          relation: savedRelation,
          generation: Number(formGeneration),
          status: formStatus,
          lifeYears: formLifeYears,
          note: formNote,
          memberClass: formMemberClass,
          gender: formGender,
          deathCause: formStatus === '사망' ? formDeathCause : undefined,
          parentId: formParentId || undefined,
          spouseId: formSpouseId || undefined,
          familyCharacteristic: memberCharInfo
        };

        updatedMembers.push(newMember);

        // If spouse selected, mutually link them
        if (formSpouseId) {
          updatedMembers = updatedMembers.map(m => {
            if (m && m.id === formSpouseId) {
              return { ...m, spouseId: targetId };
            }
            return m;
          });
        }
      } else {
        // Edit mode
        const prevSpouseId = editingMember.spouseId;

        updatedMembers = updatedMembers.map(m => {
          if (!m) return m;
          if (m.id === editingMember.id) {
            return {
              ...m,
              name: combinedName,
              relation: savedRelation,
              generation: Number(formGeneration),
              status: formStatus,
              lifeYears: formLifeYears,
              note: formNote,
              memberClass: formMemberClass,
              gender: formGender,
              deathCause: formStatus === '사망' ? formDeathCause : undefined,
              parentId: formParentId || undefined,
              spouseId: formSpouseId || undefined,
              familyCharacteristic: memberCharInfo
            };
          }
          
          // Remove link from previous spouse if spouse changed
          if (prevSpouseId && prevSpouseId !== formSpouseId && m.id === prevSpouseId) {
            return { ...m, spouseId: undefined };
          }

          // Add link to new spouse
          if (formSpouseId && m.id === formSpouseId) {
            return { ...m, spouseId: editingMember.id };
          }

          return m;
        });
      }

      // If editing player main character (relation === '본인'), sync character name
      const isPlayer = (modalMode === 'edit' && editingMember?.relation === '본인') || (savedRelation === '본인');

      setCharacter(prev => {
        const nextChar = {
          ...prev,
          family: {
            ...prev.family,
            members: updatedMembers
          }
        };
        if (isPlayer) {
          nextChar.personal = {
            ...prev.personal,
            name: combinedName
          };
          if (fcRoll) {
            const details = getCharacteristicDetails(Number(fcRoll), formGender, fcChoiceSkill, fcChoiceValue, fcChoiceAttribute);
            nextChar.family.characteristic = {
              gender: formGender,
              roll: Number(fcRoll),
              desc: details?.desc || '',
              bonusText: details?.bonusText || '',
              applied: prev.family?.characteristic?.applied || false,
              appliedBonus: prev.family?.characteristic?.appliedBonus || null
            };
          } else {
            nextChar.family.characteristic = null;
          }
        }
        return sanitizeCampaignState(nextChar, prev);
      });

      setIsModalOpen(false);
      setEditingMember(null);
    } catch (err) {
      console.error("Error in FamilyTree handleSave:", err);
      alert("정보 저장 중 오류가 발생했습니다: " + err.message);
    }
  };

  // Delete Member
  const handleDelete = (id) => {
    const target = members.find(m => m.id === id);
    if (!target) return;
    
    if (target.relation === '본인') {
      alert("플레이어 기사 본인은 가계도에서 삭제할 수 없습니다!");
      return;
    }

    if (!window.confirm(`정말로 ${target.name}님을 가계도에서 삭제하시겠습니까?\n(연결된 배우자 및 자식 관계선도 함께 정리됩니다)`)) {
      return;
    }

    let updatedMembers = members.filter(m => m.id !== id);

    // Clean up references in other members
    updatedMembers = updatedMembers.map(m => {
      let updated = { ...m };
      if (m.parentId === id) {
        updated.parentId = undefined;
      }
      if (m.spouseId === id) {
        updated.spouseId = undefined;
      }
      return updated;
    });

    setCharacter(prev => ({
      ...prev,
      family: {
        ...prev.family,
        members: updatedMembers
      }
    }));
  };

  // Quick Toggle Death Status
  const handleToggleDeath = (id) => {
    const updatedMembers = members.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === '사망' ? '생존' : '사망';
        return { ...m, status: nextStatus };
      }
      return m;
    });
    setCharacter(prev => ({
      ...prev,
      family: {
        ...prev.family,
        members: updatedMembers
      }
    }));
  };

  // Reset to Default Template
  const handleReset = () => {
    if (window.confirm("가계도를 아르덴 가문의 기본 계보 템플릿으로 초기화하시겠습니까?\n(유저가 추가한 임의의 구성원은 삭제됩니다)")) {
      setCharacter(prev => ({
        ...prev,
        family: {
          ...prev.family,
          members: defaultMembers
        }
      }));
    }
  };

  const getMeBirthYear = () => {
    const me = members.find(m => m.relation === '본인');
    if (me && me.lifeYears) {
      const match = me.lifeYears.match(/^(\d+)/);
      if (match) return parseInt(match[1], 10);
    }
    return 768; // Default fallback
  };

  const handleAddRandomMember = (gen) => {
    const gender = Math.random() < 0.5 ? 'male' : 'female';
    const randNameObj = generateRandomName(gender);
    const memberClass = gender === 'male' 
      ? (Math.random() < 0.8 ? '기사 (Knight)' : '종자 (Squire)') 
      : '부인 (Lady)';
    const fullName = getTitleByNameAndClass(randNameObj.ko, randNameObj.en, memberClass);

    // Birth Year Calculation
    const meBirth = getMeBirthYear();
    const diff = gen - 3;
    const baseBirth = meBirth + (diff * 25);
    const birthYear = baseBirth + Math.floor(Math.random() * 11) - 5; // ±5 years

    // Status and Death
    const currentYear = character.personal?.campaignYear || 768;
    let status = '생존';
    let lifeYears = `${birthYear}~`;
    let deathCause = undefined;

    if (birthYear < currentYear - 75) {
      status = '사망';
      const ageAtDeath = 45 + Math.floor(Math.random() * 31); // 45~75 age
      const deathYear = birthYear + ageAtDeath;
      lifeYears = `${birthYear}~${deathYear}`;
      deathCause = medievalDeathCauses[Math.floor(Math.random() * medievalDeathCauses.length)];
    }

    // Parent Link
    let parentId = undefined;
    if (gen > 1) {
      // Find possible parents in gen - 1
      const potentialParents = members.filter(m => m.generation === gen - 1);
      if (potentialParents.length > 0) {
        // Prefer married couples
        const marriedParents = potentialParents.filter(m => m.spouseId);
        if (marriedParents.length > 0) {
          const randomParent = marriedParents[Math.floor(Math.random() * marriedParents.length)];
          const partner = marriedParents.find(m => m.id === randomParent.spouseId);
          if (partner && getGender(randomParent) === 'female') {
            parentId = partner.id;
          } else {
            parentId = randomParent.id;
          }
        } else {
          parentId = potentialParents[Math.floor(Math.random() * potentialParents.length)].id;
        }
      }
    }

    const newMember = {
      id: 'm-rand-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      name: fullName,
      relation: '', // Calculated
      generation: gen,
      status,
      lifeYears,
      memberClass,
      gender,
      deathCause,
      parentId,
      note: '가계도 시스템에 의해 자동 생성된 가문원.'
    };

    // Calculate relation
    const allMembersWithNew = [...members, newMember];
    newMember.relation = getCalculatedRelation(newMember, allMembersWithNew);

    setCharacter(prev => ({
      ...prev,
      family: {
        ...prev.family,
        members: [...(prev.family?.members || []), newMember]
      }
    }));
  };

  const handleAddRandomSpouse = (gen) => {
    const genMembers = members.filter(m => m.generation === gen);
    const eligibleSingles = genMembers.filter(m => !m.spouseId && m.relation !== '조모' && m.relation !== '모친');
    
    if (eligibleSingles.length === 0) {
      alert(`${gen}대에 배우자가 없는 1인 구성원이 없습니다. 먼저 구성원을 생성해 주세요!`);
      return;
    }

    const targetMember = eligibleSingles[Math.floor(Math.random() * eligibleSingles.length)];
    const spouseGender = getGender(targetMember) === 'male' ? 'female' : 'male';
    const randNameObj = generateRandomName(spouseGender);
    const memberClass = spouseGender === 'male' 
      ? '기사 (Knight)' 
      : '부인 (Lady)';
    const fullName = getTitleByNameAndClass(randNameObj.ko, randNameObj.en, memberClass);

    // Birth Year aligned with spouse
    let targetBirth = 740;
    const match = String(targetMember.lifeYears || '').match(/^(\d+)/);
    if (match) {
      targetBirth = parseInt(match[1], 10);
    }
    const birthYear = targetBirth + Math.floor(Math.random() * 7) - 3; // ±3 years

    // Status and Death aligned with spouse
    let status = targetMember.status;
    let lifeYears = `${birthYear}~`;
    let deathCause = undefined;

    if (status === '사망') {
      let targetDeath = birthYear + 50;
      const deathMatch = String(targetMember.lifeYears || '').match(/~(\d+)$/);
      if (deathMatch) {
        targetDeath = parseInt(deathMatch[1], 10);
      }
      const deathYear = targetDeath + Math.floor(Math.random() * 5) - 2; // ±2 years of spouse death
      lifeYears = `${birthYear}~${deathYear}`;
      deathCause = targetMember.deathCause || medievalDeathCauses[Math.floor(Math.random() * medievalDeathCauses.length)];
    }

    const newSpouseId = 'm-rand-spouse-' + Date.now();
    const newSpouse = {
      id: newSpouseId,
      name: fullName,
      relation: '', // Calculated
      generation: gen,
      status,
      lifeYears,
      memberClass,
      gender: spouseGender,
      deathCause,
      spouseId: targetMember.id,
      note: `${targetMember.name}의 배우자로 자동 생성됨.`
    };

    // Calculate relation
    const allMembersWithNew = [...members, newSpouse];
    newSpouse.relation = getCalculatedRelation(newSpouse, allMembersWithNew);

    setCharacter(prev => {
      const nextChar = JSON.parse(JSON.stringify(prev));
      nextChar.family.members = nextChar.family.members.map(m => {
        if (m.id === targetMember.id) {
          return { ...m, spouseId: newSpouseId };
        }
        return m;
      });
      nextChar.family.members.push(newSpouse);
      return nextChar;
    });
  };

  // Group Members by Generation
  const generations = [1, 2, 3, 4, 5, 6];
  const genLabels = [
    "",
    "조부모 세대 (Grandparents)",
    "부모 세대 (Parents)",
    "본인 및 형제 세대 (Knight's Gen)",
    "자녀 세대 (Children)",
    "손자녀 세대 (Descendants)",
    "증손자녀 세대 (Great-Grandchildren)"
  ];



  // Helper to render spouse links side-by-side
  const renderGenerationRow = (gen) => {
    const genMembers = members.filter(m => m.generation === gen);
    if (genMembers.length === 0) return null;

    // 출생연도 기준 오름차순 정렬 (나이가 많은 순으로 왼쪽부터 정렬)
    const getBirthYear = (ly) => {
      if (!ly) return 9999;
      const match = String(ly).match(/^(\d+)/);
      return match ? parseInt(match[1], 10) : 9999;
    };
    genMembers.sort((a, b) => getBirthYear(a.lifeYears) - getBirthYear(b.lifeYears));

    const positions = character.family?.positions || {};
    const renderedIds = new Set();
    const groups = [];

    genMembers.forEach(member => {
      if (renderedIds.has(member.id)) return;

      if (member.spouseId) {
        const spouse = genMembers.find(m => m.id === member.spouseId);
        if (spouse) {
          groups.push({
            type: 'marriage',
            husband: member,
            wife: spouse
          });
          renderedIds.add(member.id);
          renderedIds.add(spouse.id);
          return;
        }
      }

      groups.push({
        type: 'single',
        member
      });
      renderedIds.add(member.id);
    });

    return (
      <div key={gen} className="ft-gen-row view-animate">
        <div className="ft-gen-label" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="ft-gen-badge">{gen}대</span>
            <span className="ft-gen-text">{genLabels[gen]}</span>
          </div>
          <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
            <button 
              type="button" 
              className="btn-medieval" 
              style={{ padding: '2px 6px', fontSize: '0.66rem', display: 'flex', alignItems: 'center', gap: '2px', borderRadius: '4px', background: 'rgba(201,168,76,0.06)' }}
              onClick={() => handleAddRandomMember(gen)}
              title="해당 세대에 랜덤 구성원(형제/친족)을 자동 생성하여 추가합니다."
            >
              구성원 추가
            </button>
            <button 
              type="button" 
              className="btn-medieval" 
              style={{ padding: '2px 6px', fontSize: '0.66rem', display: 'flex', alignItems: 'center', gap: '2px', borderRadius: '4px', background: 'rgba(201,168,76,0.06)' }}
              onClick={() => handleAddRandomSpouse(gen)}
              title="해당 세대의 미혼 1인 가문원 중 한 명에게 배우자를 자동 생성하여 연결합니다."
            >
              배우자 등록
            </button>
          </div>
        </div>
        <div className="ft-gen-nodes">
          {groups.map((group, idx) => {
            if (group.type === 'marriage') {
              const husbandPos = positions[group.husband.id] || { x: 0, y: 0 };
              const wifePos = positions[group.wife.id] || { x: 0, y: 0 };
              const heartX = (husbandPos.x + wifePos.x) / 2;
              return (
                <div key={idx} className="ft-marriage-block">
                  {renderMemberCard(group.husband)}
                  <div 
                    className="ft-marriage-heart"
                    style={{ transform: `translateX(${heartX}px)` }}
                  >
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-ink-light)', fontWeight: 'bold', lineHeight: 1 }}>⚭</span>
                  </div>
                  {renderMemberCard(group.wife)}
                </div>
              );
            } else {
              return (
                <div key={idx} className="ft-single-block">
                  {renderMemberCard(group.member)}
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '생존': return '#2e6b33';
      case '사망': return '#6b5d4e';
      case '질병': return '#8b2020';
      case '실종': return '#702b8b';
      case '포로': return '#d27c2c';
      default: return '#2e1f0f';
    }
  };

  const getChronicleMarginalia = (member) => {
    if (!member) return null;
    const note = member.note || '';
    const status = member.status || '';
    const deathCause = member.deathCause || '';

    if (note.includes('수도원') || deathCause.includes('수도원')) {
      return '수도원의 기록에 이름이 남음';
    }
    if (status === '은퇴' || note.includes('은퇴') || deathCause.includes('은퇴')) {
      return '명예롭게 칼을 내려놓음';
    }
    if (note.includes('전사') || deathCause.includes('전사')) {
      return '봉사의 길 위에서 생을 마침';
    }
    if (note.includes('순례') || deathCause.includes('순례')) {
      return '먼 성지를 향해 길을 나섬';
    }
    if (note.includes('병사') || deathCause.includes('병사') || note.includes('전장') || deathCause.includes('전장')) {
      return '전장에서 오래 복무함';
    }
    return null;
  };

  const renderMemberCard = (member) => {
    const isKnight = member.relation === '본인';
    const statusColor = getStatusColor(member.status);
    const isDeceased = member.status === '사망';
    const memberGender = getGender(member);
    let calculatedRelation = getCalculatedRelation(member, members);
    const selfMember = members.find(m => m.relation === '본인' && m.status !== '사망')
      || members.find(m => m.relation === '본인');
    const impossibleSameGenerationAncestor = selfMember
      && member.id !== selfMember.id
      && Number(member.generation) === Number(selfMember.generation)
      && ['조부', '조모', '부친', '모친'].includes(calculatedRelation);
    if (impossibleSameGenerationAncestor) {
      const memberBirth = getBirthYearFromLifeYears(member.lifeYears);
      const selfBirth = getBirthYearFromLifeYears(selfMember.lifeYears);
      const older = memberBirth < selfBirth;
      calculatedRelation = memberGender === 'female'
        ? (older ? '누나' : '여동생')
        : (older ? '형' : '남동생');
    }

    const positions = character.family?.positions || {};
    const pos = positions[member.id] || { x: 0, y: 0 };
    const isGrabbing = dragRef.current.memberId === member.id;
    const parent = member.parentId ? members.find(m => m.id === member.parentId) : null;
    const spouse = member.spouseId
      ? members.find(m => m.id === member.spouseId)
      : members.find(m => m.spouseId === member.id);
    const childNames = members
      .filter(m => m.parentId === member.id || (member.spouseId && m.parentId === member.spouseId))
      .map(c => splitName(c.name).ko);
 
    return (
      <div 
        className={`ft-card ${isKnight ? 'ft-card-knight' : ''} ${isDeceased ? 'ft-card-deceased' : ''} ft-card-${memberGender}`}
        data-node-id={member.id}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          cursor: isGrabbing ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none'
        }}
        onMouseDown={(e) => handleMouseDown(e, member.id)}
        onTouchStart={(e) => handleTouchStart(e, member.id)}
      >


        
        {/* Name */}
        <h4 className="ft-name" style={{ textDecoration: isDeceased ? 'line-through' : 'none', margin: '2px 0 4px 0', lineHeight: 1.2 }}>
          <span className="ft-name-ko">{splitName(member.name).ko}</span>
          {splitName(member.name).en && (
            <span className="ft-name-en">
              ({splitName(member.name).en})
            </span>
          )}
        </h4>

        {/* Relation & Dates & Status */}
        <div className="ft-card-meta">
          <span className="ft-relation" style={{ marginRight: '4px' }}>[{calculatedRelation}]</span>
          <span>{member.lifeYears || '연도 미상'}</span>
          <span style={{ marginLeft: '4px', color: statusColor, fontWeight: 'normal' }}>
            {member.status === '생존' && '생존'}
            {member.status === '사망' && '영면'}
            {member.status === '질병' && '병환'}
            {member.status === '실종' && '실종'}
            {member.status === '포로' && '포로'}
          </span>
          {isDeceased && member.deathCause && (
            <span className="ft-death-cause" style={{ color: 'var(--color-crimson)', marginLeft: '3px' }}>
              ({member.deathCause})
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="ft-card-divider"></div>

        {/* Estate, Muster, Heirs */}
        <div className="ft-card-records">
          <div>
            <span className="record-label">부모: </span>
            <span className="record-value">
              {parent ? splitName(parent.name).ko : '없음'}
            </span>
          </div>
          <div>
            <span className="record-label">배우자: </span>
            <span className="record-value">
              {spouse ? splitName(spouse.name).ko : '없음'}
            </span>
          </div>
          <div>
            <span className="record-label">자녀: </span>
            <span className="record-value">
              {childNames.join(', ') || '없음'}
            </span>
          </div>
          <div>
            <span className="record-label">영지/거처: </span>
            <span className="record-value">
              {isKnight ? (character.personal?.home || '바스토뉴') : '아르덴'}
            </span>
          </div>
          <div>
            <span className="record-label">군역: </span>
            <span className="record-value">
              {isKnight ? `${character.family?.lineageMen || 20}명` : (member.gender === 'female' ? '면제' : (isDeceased ? '봉사 완료' : '의무 수임'))}
            </span>
          </div>
        </div>

        {/* Divider */}
        {(getChronicleMarginalia(member) || resolveMemberCharacteristic(member, members, character.family?.characteristic)) && (
          <div className="ft-card-divider"></div>
        )}

        {/* Notes (Marginalia) */}
        {(() => {
          const marginaliaText = getChronicleMarginalia(member);
          if (!marginaliaText) return null;
          return (
            <div className="chronicle-marginalia ft-card-marginalia">
              {marginaliaText}
            </div>
          );
        })()}

        {/* Characteristics */}
        {(() => {
          const resolvedChar = resolveMemberCharacteristic(member, members, character.family?.characteristic);
          if (!resolvedChar) return null;
          const isInherited = !member.familyCharacteristic;
          
          return (
            <div className="ft-card-characteristic">
              <span className="record-label">특성: </span>
              <span className="record-value" style={{ fontStyle: 'italic' }}>
                {resolvedChar.desc} {isInherited && '(상속)'}
              </span>
            </div>
          );
        })()}




        <div className="ft-card-actions">
          <button 
            className="ft-action-btn" 
            title="인물 정보 편집"
            onClick={() => handleOpenEdit(member)}
          >
            <Edit size={12} />
          </button>
          
          <button 
            className="ft-action-btn" 
            title="자녀 추가"
            onClick={() => handleOpenAdd(member.id, undefined, member.generation + 1)}
          >
            <Plus size={12} />
          </button>

          {!member.spouseId && (
            <button 
              className="ft-action-btn" 
              title="배우자 추가"
              onClick={() => handleOpenAdd(undefined, member.id, member.generation)}
            >
              <UserPlus size={12} />
            </button>
          )}

          <button 
            className={`ft-action-btn ${isDeceased ? 'btn-revive' : 'btn-kill'}`} 
            title={isDeceased ? "생존 상태로 전환" : "사망 상태로 전환 (비명서거)"}
            onClick={() => handleToggleDeath(member.id)}
            style={{ fontSize: '0.9rem' }}
          >
            {isDeceased ? "🌱" : "💀"}
          </button>

          {!isKnight && (
            <button 
              className="ft-action-btn btn-danger" 
              title="가문원 삭제"
              onClick={() => handleDelete(member.id)}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="ft-container view-animate">
      
      {/* Action Header controls */}
      <div className="ft-toolbar">
        <div>
          <h5 style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--color-ink-light)', margin: 0 }}>
            🏰 {character.family?.name || '무명'} 가문 계보도
          </h5>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-grey)', marginTop: '2px' }}>
            가문원 카드에 마우스를 올리면 관계선 추가, 편집, 삭제가 가능합니다. (본인 {character.personal?.name || '롤랑 경'} 중심)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn-medieval ${showRelationLines ? 'btn-medieval-primary' : ''}`}
            onClick={() => setShowRelationLines(prev => !prev)}
            title="부모/자녀 관계선을 보조 레이어로 표시합니다. 좁은 화면에서는 기록부 가독성을 위해 숨겨집니다."
          >
            {showRelationLines ? '관계선 숨김' : '관계선 보기'}
          </button>
          <button className="btn-medieval btn-medieval-primary" onClick={() => handleOpenAdd()}>
            <Plus size={14} /> 새 가문원 영입
          </button>
          <button className="btn-medieval" onClick={handleResetPositions} title="수동 드래그한 카드 위치 초기화">
            📐 배치 초기화
          </button>
          <button className="btn-medieval" onClick={handleReset}>
            <RefreshCw size={13} /> 계보도 초기화
          </button>
        </div>
      </div>

      {/* 가문 역사 및 대서사 관리 판넬 (Collapsible Panels) */}
      <div className="ft-panels-stack" style={{ margin: '12px 0 16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        


        {/* Panel 2: 조상 연대기 발전기 */}
        <div className="ft-panel" style={{ border: '1px solid var(--color-gold-light)', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.45)', overflow: 'hidden', boxShadow: 'var(--shadow-medieval)' }}>
          <div 
            style={{ backgroundColor: 'rgba(201, 168, 76, 0.1)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none', fontWeight: 'bold', color: 'var(--color-gold-dark)' }}
            onClick={() => setActivePanel(activePanel === 'chronicle' ? null : 'chronicle')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Sparkles size={14} /> 📜 조상 연대기 발전기 (Page 45-49)</span>
            <span style={{ fontSize: '0.8rem' }}>{activePanel === 'chronicle' ? '접기 ▲' : '펼치기 ▼'}</span>
          </div>
          {activePanel === 'chronicle' && (
            <div className="view-animate" style={{ padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.65)', borderTop: '1px solid var(--color-gold-light)' }}>
                              <div className="view-animate" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', border: '1px solid var(--color-gold-light)', borderRadius: '8px', padding: '16px', marginTop: '10px' }}>

                  {/* 📖 룰북 판정표 레퍼런스 (Table 2-2 & Table 2-3) */}
                  <div style={{ marginBottom: '16px', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: 'rgba(201,168,76,0.1)', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} onClick={() => setShowRefTables(!showRefTables)}>
                      <strong style={{ fontSize: '0.82rem', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        📖 룰북 판정 레퍼런스 테이블 보기 (Table 2-1, 2-2, 2-3)
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)' }}>{showRefTables ? '접기 ▲' : '펼치기 ▼'}</span>
                    </div>
                    {showRefTables && (
                      <div style={{ padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.74rem', borderTop: '1px solid rgba(201,168,76,0.2)' }}>
                        {/* Left Column: Table 2-1 & Table 2-2 */}
                        <div>
                          {/* Table 2-1: Ordinary Year Events */}
                          <h5 style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: 'var(--color-crimson)', borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>
                            Table 2-1: Ordinary Year Events (평시 연도 사건)
                          </h5>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '14px' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                <th style={{ padding: '3px 2px' }}>d20 결과</th>
                                <th style={{ padding: '3px 2px' }}>연간 사건 (Event)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>1</td>
                                <td style={{ padding: '3px 2px' }}>무작위 원인으로 사망 (Table 2-3 참조)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>2~17</td>
                                <td style={{ padding: '3px 2px' }}>성채 경비 임무 수행 (Served garrison duty)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>18~19</td>
                                <td style={{ padding: '3px 2px' }}>명예롭고 기념비적인 업적 달성 (+50 Glory)</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>20</td>
                                <td style={{ padding: '3px 2px' }}>작센/프리지아 습격 시 국경 방어전 (Defended homeland during raid)<br />
                                  <span style={{ fontSize: '0.68rem', color: 'var(--color-grey)' }}>
                                    * Combat Survival(Table 2-2) 판정 진행. 생존 시 작센/프리지아 증오 +1d3 획득
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          {/* Table 2-2: Combat Survival */}
                          <h5 style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: 'var(--color-crimson)', borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>
                            Table 2-2: Combat Survival (전투 생존 판정)
                          </h5>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                <th style={{ padding: '3px 2px' }}>d20 결과*</th>
                                <th style={{ padding: '3px 2px' }}>판정 결과 (Combat Result)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>0 이하</td>
                                <td style={{ padding: '3px 2px' }}>장렬한 전사 (+1,000 Glory)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>1</td>
                                <td style={{ padding: '3px 2px' }}>전투 중 전사 (추가 명예 없음)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>2</td>
                                <td style={{ padding: '3px 2px' }}>부상 은퇴 (수도원행, 1d20년 후 서거)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>3</td>
                                <td style={{ padding: '3px 2px' }}>포로 압송 및 행방불명 (미귀환)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>4~5</td>
                                <td style={{ padding: '3px 2px', color: 'var(--color-success)', fontWeight: 600 }}>생존 및 영웅적 업적 달성 (+100 Glory)</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>6~20</td>
                                <td style={{ padding: '3px 2px' }}>무사히 생존 완료</td>
                              </tr>
                            </tbody>
                          </table>
                          <div style={{ fontSize: '0.68rem', color: 'var(--color-grey)', marginTop: '6px', lineHeight: 1.3 }}>
                            * 역사적 대전투(Battle) 판정 시에는 <strong>주사위 값에 -1 보정</strong>을 적용합니다.<br />
                            * 승전한 경우 획득하는 명예(Glory)가 2배로 계산됩니다.
                          </div>
                        </div>

                        {/* Table 2-3: Miscellaneous Death Causes */}
                        <div>
                          <h5 style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: 'var(--color-crimson)', borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>
                            Table 2-3: Miscellaneous Death Causes (기타 사망 원인)
                          </h5>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                <th style={{ padding: '3px 2px' }}>d20 결과</th>
                                <th style={{ padding: '3px 2px' }}>남성 (Male)</th>
                                <th style={{ padding: '3px 2px' }}>여성 (Female)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>1~3</td>
                                <td style={{ padding: '3px 2px' }}>전투 중 전사 (Battle)</td>
                                <td style={{ padding: '3px 2px' }}>산고 중 사망 (Childbirth)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>4</td>
                                <td style={{ padding: '3px 2px' }}>가문 불화 (Feud)</td>
                                <td style={{ padding: '3px 2px' }}>가문 불화 (Feud)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>5</td>
                                <td style={{ padding: '3px 2px' }}>적 습격 (Raid)</td>
                                <td style={{ padding: '3px 2px' }}>적 습격 (Raid)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>6</td>
                                <td style={{ padding: '3px 2px' }}>가문 불화 (Feud)</td>
                                <td style={{ padding: '3px 2px' }}>사냥 사고 (Hunting)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>7~8</td>
                                <td style={{ padding: '3px 2px' }}>적 습격 (Raid)</td>
                                <td style={{ padding: '3px 2px' }}>사고사 (Accident)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>9~10</td>
                                <td style={{ padding: '3px 2px' }}>사냥 사고 (Hunting)</td>
                                <td style={{ padding: '3px 2px' }}>사고사 (Accident)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>11~13</td>
                                <td style={{ padding: '3px 2px' }}>사고사 (Accident)</td>
                                <td style={{ padding: '3px 2px' }}>사고사 (Accident)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>14</td>
                                <td style={{ padding: '3px 2px' }}>실종 (Disappeared)</td>
                                <td style={{ padding: '3px 2px' }}>실종 (Disappeared)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>15~18</td>
                                <td style={{ padding: '3px 2px' }}>질병사 (Illness)</td>
                                <td style={{ padding: '3px 2px' }}>질병사 (Illness)</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>19~20</td>
                                <td style={{ padding: '3px 2px' }}>노환 (Old age)</td>
                                <td style={{ padding: '3px 2px' }}>노환 (Old age)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mode Selector */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', borderBottom: '1px solid rgba(201, 168, 76, 0.2)', paddingBottom: '10px' }}>
                    <button
                      type="button"
                      className={`tab-btn btn-medieval ${chronicleMode === 'interactive' ? 'active' : ''}`}
                      onClick={() => { setChronicleMode('interactive'); }}
                      style={{ padding: '6px 12px', fontSize: '0.8rem', flex: 1, justifyContent: 'center' }}
                    >
                      📜 1단계씩 직접 개척 (권장: 서사 누적 체험)
                    </button>
                    <button
                      type="button"
                      className={`tab-btn btn-medieval ${chronicleMode === 'auto' ? 'active' : ''}`}
                      onClick={() => { setChronicleMode('auto'); }}
                      style={{ padding: '6px 12px', fontSize: '0.8rem', flex: 1, justifyContent: 'center' }}
                    >
                      🎲 일괄 자동 생성 (Auto-Roll)
                    </button>
                  </div>

                  {chronicleMode === 'auto' ? (
                    <div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--color-grey)', margin: '0 0 12px 0', lineHeight: 1.45 }}>
                        룰북 규칙서 25~30쪽 및 45~49쪽 고증 규칙에 따라, 조부(723년~744년)와 부친(745년~766년)의 전공 및 사망 원인을 대진표식으로 시뮬레이션합니다.<br />
                        • 조부는 2,500 Glory에서 출발해 매년의 모험과 삭센/무어 원정 참전 주사위를 굴립니다.<br />
                        • 부친은 2,500 Glory + 조부의 최종 영광의 1/10을 상속받아 평생의 업적을 쌓습니다.<br />
                        • 생성된 영광과 증오 속성은 1/10의 비율로 캐릭터 시트에 정식으로 계승 반영됩니다.
                      </p>

                      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                        <button
                          type="button"
                          className="btn-medieval btn-medieval-primary"
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                          onClick={rollAncestorHistory}
                        >
                          <RefreshCw size={14} />
                          조상 연대기 일괄 주사위 롤링 (Auto-Roll All)
                        </button>
                        {ancestorRollLog.length > 0 && (
                          ancestorApplied ? (
                            <button
                              type="button"
                              className="btn-medieval"
                              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--color-gold-dark)', borderColor: 'var(--color-gold)' }}
                              onClick={syncFamilyTreeOnly}
                            >
                              <RefreshCw size={13} />
                              가계도 재연동 (Re-sync)
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn-medieval btn-medieval-primary"
                              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                              onClick={applyAncestorLegacy}
                            >
                              <Check size={14} />
                              연대기 유산 적용하기 (Glory & 증오 계승)
                            </button>
                          )
                        )}
                      </div>

                      {ancestorRollLog.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: 'rgba(43, 65, 112, 0.04)', padding: '12px', borderRadius: '6px', border: '1.5px solid var(--color-gold-light)' }}>
                            <div>
                              <h5 style={{ margin: '0 0 6px 0', color: 'var(--color-royal-blue)', fontSize: '0.86rem' }}>👴 조부 ({character.family?.ancestor || '알베르 경 (Sir Albert)'})</h5>
                              <span style={{ fontSize: '0.78rem', color: 'var(--color-ink)', lineHeight: '1.4' }}>
                                • 최종 영광: <strong>{grandfatherGlory} Glory</strong><br />
                                • 생몰년도: 702년 ~ {grandfatherDeathYear}년<br />
                                • 사인: {grandfatherDeathCause}<br />
                                • 누적 증오: 작센인 ({grandfatherHates.saxons}), 무어인 ({grandfatherHates.moors})
                              </span>
                            </div>
                            <div>
                              <h5 style={{ margin: '0 0 6px 0', color: 'var(--color-crimson)', fontSize: '0.86rem' }}>👨 부친 (Gerard 경)</h5>
                              <span style={{ fontSize: '0.78rem', color: 'var(--color-ink)', lineHeight: '1.4' }}>
                                • 최종 영광: <strong>{fatherGlory} Glory</strong><br />
                                • 생몰년도: 724년 ~ {fatherDeathYear}년<br />
                                • 사인: {fatherDeathCause}<br />
                                • 누적 증오: 작센인 ({fatherHates.saxons}), 무어인 ({fatherHates.moors})
                              </span>
                            </div>
                          </div>

                          <div style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#faf6eb', border: '1.2px solid rgba(201, 168, 76, 0.3)', padding: '10px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.76rem', whiteSpace: 'pre-wrap', color: '#5a4933', scrollbarWidth: 'thin' }}>
                            {ancestorRollLog.join('\n')}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // 📜 INTERACTIVE MODE UI
                    <div className="view-animate" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {interactiveStage === 'idle' ? (
                        <div style={{ textAlign: 'center', padding: '24px 10px', backgroundColor: 'rgba(179,143,67,0.03)', border: '1px dashed var(--color-gold)' }}>
                          <Compass size={36} style={{ margin: '0 auto 12px', color: 'var(--color-gold-dark)' }} />
                          <h4 style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--color-ink)' }}>가문의 역사를 한 해씩 직접 개척해 보세요</h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-grey)', margin: '6px 0 16px', lineHeight: 1.4 }}>
                            723년부터 766년까지 프랑크 왕국 역사적 대기사 원정 사건들을 실시간으로 읽으며,<br />
                            조부와 아버지가 쌓아 올린 전설적인 무공과 유산을 생생한 주사위 판정으로 체험할 수 있습니다.
                          </p>
                          <button
                            type="button"
                            className="btn-medieval btn-medieval-primary"
                            style={{ margin: '0 auto', fontSize: '0.9rem', padding: '8px 18px', justifyContent: 'center' }}
                            onClick={startInteractiveChronicle}
                          >
                            📜 가문 연대기 직접 개척 시작하기
                          </button>
                        </div>
                      ) : (
                        <div>
                          {/* Top Status Board */}
                          {interactiveStage !== 'completed' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(201, 168, 76, 0.2)', marginBottom: '12px' }}>
                              <div>
                                <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)', textTransform: 'uppercase' }}>진행 인물</span>
                                <h5 style={{ margin: '2px 0 0 0', fontWeight: 'bold', fontSize: '0.92rem', color: interactiveStage.startsWith('gf') ? 'var(--color-royal-blue)' : 'var(--color-crimson)' }}>
                                  {interactiveStage.startsWith('gf') ? `👴 조부 (${character.family?.ancestor || '알베르 경 (Sir Albert)'})` : '👨 부친 (Gerard 경)'}
                                </h5>
                                <div style={{ fontSize: '0.76rem', marginTop: '4px', color: 'var(--color-ink)' }}>
                                  • 생몰: {interactiveStage.startsWith('gf') ? '702 ~ ?' : '724 ~ ?'}<br />
                                  • 현재 연도: <strong style={{ fontSize: '1.05rem', color: 'var(--color-gold-dark)' }}>{interactiveYear}년</strong>
                                </div>
                              </div>
                              <div>
                                <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)', textTransform: 'uppercase' }}>누적 무훈 현황</span>
                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: '2px 0 0 0' }}>
                                  🏆 {interactiveStage.startsWith('gf') ? grandfatherGlory : fatherGlory} Glory
                                </div>
                                <div style={{ fontSize: '0.74rem', marginTop: '4px', color: 'var(--color-ink-light)' }}>
                                  • 작센 증오: {interactiveStage.startsWith('gf') ? grandfatherHates.saxons : fatherHates.saxons}<br />
                                  • 무어 증오: {interactiveStage.startsWith('gf') ? grandfatherHates.moors : fatherHates.moors}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Historical Event Scroll */}
                          {interactiveStage !== 'completed' && (
                            <div style={{ border: '1.5px solid var(--color-gold-light)', background: '#faf6eb', padding: '12px 14px', borderRadius: '6px', position: 'relative', marginBottom: '14px' }}>
                              <div style={{ position: 'absolute', right: '10px', top: '-10px', backgroundColor: 'var(--color-gold)', color: '#fff', fontSize: '0.62rem', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                역사 사건서
                              </div>
                              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                🛡️ {interactiveYear}년 국경 원정 기록
                              </h4>
                              <p style={{ margin: 0, fontSize: '0.82rem', color: '#5a4933', lineHeight: '1.5' }}>
                                {getEventText(interactiveYear)}
                              </p>
                            </div>
                          )}

                          {/* Dice Roll / Input Box */}
                          {interactiveStage !== 'completed' && !currentYearRolled && (
                            isGapYear(interactiveYear, interactiveStage) ? (
                              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '14px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                                  <div>
                                    <h5 style={{ margin: 0, fontWeight: 'bold', fontSize: '0.86rem', color: 'var(--color-success)' }}>🕊️ 역사적 평온기 (공백기)</h5>
                                    <span style={{ fontSize: '0.76rem', color: 'var(--color-ink)' }}>
                                      룰북 규칙에 따라 이 연도에는 전쟁이나 주사위 판정(위험)이 발생하지 않습니다.
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    className="btn-medieval btn-medieval-primary"
                                    style={{ fontSize: '0.86rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px', borderColor: 'var(--color-success)', background: 'var(--color-success)' }}
                                    onClick={handleGapYearInteractive}
                                  >
                                    🕊️ 평온하게 한 해 보내기
                                  </button>
                                </div>
                              </div>
                            ) : chroniclePendingRoll ? (
                              <div style={{ backgroundColor: 'rgba(185, 28, 28, 0.04)', border: '1px solid rgba(185, 28, 28, 0.2)', padding: '14px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ fontSize: '0.82rem', color: 'var(--color-grey)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <span style={{ fontWeight: 'bold', color: 'var(--color-crimson)' }}>
                                    {(chroniclePendingRoll.type === 'gf_hate_roll' || chroniclePendingRoll.type === 'f_hate_roll') 
                                      ? '🔥 추가 판정: 증오/기질 수치 결정' 
                                      : '🛡️ 2차 생존 판정 필요!'}
                                  </span>
                                  <span style={{ fontSize: '0.78rem', lineHeight: 1.4, whiteSpace: 'pre-wrap', backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px', borderRadius: '4px', borderLeft: '3px solid var(--color-crimson)' }}>
                                    {(chroniclePendingRoll.type === 'gf_hate_roll' || chroniclePendingRoll.type === 'f_hate_roll')
                                      ? `${chroniclePendingRoll.logPrefix.trim()}\n\n👉 생존에 성공하셨습니다! ${
                                          chroniclePendingRoll.hateTarget === 'cruel'
                                            ? '무자비함(Cruel) 기질'
                                            : chroniclePendingRoll.hateTarget === 'saxons'
                                            ? '작센인 증오'
                                            : chroniclePendingRoll.hateTarget === 'moors'
                                            ? '무어인 증오'
                                            : '덴마크 바이킹 증오'
                                        } 수치를 결정하기 위해 ${chroniclePendingRoll.hateType} 주사위를 굴립니다.`
                                      : chroniclePendingRoll.logPrefix.trim()}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                    {!(chroniclePendingRoll.type === 'gf_hate_roll' || chroniclePendingRoll.type === 'f_hate_roll') ? (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>🎲 2차 주사위(d20):</span>
                                        <input
                                          type="text"
                                          placeholder="예: 10"
                                          value={chronicleManualD20}
                                          onChange={e => setChronicleManualD20(e.target.value)}
                                          style={{ width: '80px', padding: '6px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-crimson)', textAlign: 'center', border: '1.5px solid var(--color-gold-light)', borderRadius: '4px' }}
                                        />
                                      </div>
                                    ) : (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>🎲 추가 주사위({chroniclePendingRoll.hateType}):</span>
                                        <input
                                          type="text"
                                          placeholder={`예: ${chroniclePendingRoll.hateType === 'd3' ? '2' : '5'}`}
                                          value={chronicleManualD6}
                                          onChange={e => setChronicleManualD6(e.target.value)}
                                          style={{ width: '80px', padding: '6px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-crimson)', textAlign: 'center', border: '1.5px solid var(--color-gold-light)', borderRadius: '4px' }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    className="btn-medieval btn-medieval-primary"
                                    style={{ fontSize: '0.86rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px', borderColor: 'var(--color-crimson)', background: 'var(--color-crimson)' }}
                                    onClick={rollSingleYearInteractive}
                                  >
                                    {(chroniclePendingRoll.type === 'gf_hate_roll' || chroniclePendingRoll.type === 'f_hate_roll')
                                      ? '⚔️ 증오/기질 주사위 판정'
                                      : `🛡️ ${interactiveYear}년 생존 판정 굴리기`}
                                  </button>
                                </div>
                                <span style={{ fontSize: '0.74rem', color: 'var(--color-grey)' }}>
                                  {(chroniclePendingRoll.type === 'gf_hate_roll' || chroniclePendingRoll.type === 'f_hate_roll')
                                    ? `* 추가 주사위 값을 입력하면 해당 눈으로 강제 적용되며, 입력하지 않으면 무작위(${chroniclePendingRoll.hateType})로 결정됩니다.`
                                    : `* 1차 판정 결과(${chroniclePendingRoll.firstRoll})에 따른 추가 생존 판정입니다. 입력하지 않으면 무작위(d20)로 결정됩니다.`}
                                </span>
                              </div>
                            ) : (
                              <div style={{ backgroundColor: 'rgba(179,143,67,0.04)', border: '1px solid rgba(179,143,67,0.2)', padding: '14px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {isAutoPassYear(interactiveYear, interactiveStage) ? (
                                  // 자동 통과 연도: 주사위 없이 바로 통과 버튼
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '0.82rem', color: 'var(--color-grey)', textAlign: 'center' }}>
                                      📖 이 해는 룰북에 이벤트 테이블이 없습니다. 주사위 판정 없이 자동으로 넘어갑니다.
                                    </span>
                                    <button
                                      type="button"
                                      className="btn-medieval btn-medieval-primary"
                                      style={{ fontSize: '0.86rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-success)', borderColor: 'var(--color-success)' }}
                                      onClick={rollAndAdvanceAutoPassYear}
                                    >
                                      ✅ {interactiveYear}년 자동 통과
                                    </button>
                                  </div>
                                ) : (
                                  // 일반 연도: 주사위 입력 + 판정 버튼
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>🎲 주사위 수동 입력(d20):</span>
                                      <input
                                        type="text"
                                        placeholder="예: 15"
                                        value={chronicleManualD20}
                                        onChange={e => setChronicleManualD20(e.target.value)}
                                        style={{ width: '130px', padding: '6px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-crimson)', textAlign: 'center', border: '1.5px solid var(--color-gold-light)', borderRadius: '4px' }}
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      className="btn-medieval btn-medieval-primary"
                                      style={{ fontSize: '0.86rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                      onClick={rollSingleYearInteractive}
                                    >
                                      ⚔️ {interactiveYear}년 운명 주사위 판정
                                    </button>
                                  </div>
                                )}
                                {!isAutoPassYear(interactiveYear, interactiveStage) && (
                                  <span style={{ fontSize: '0.74rem', color: 'var(--color-grey)' }}>
                                    * 수동 값을 입력하면 주사위 결과가 해당 눈으로 강제 적용되며, 입력하지 않으면 무작위(d20)로 결정됩니다.
                                  </span>
                                )}
                              </div>

                            )
                          )}

                          {/* Year Outcome display */}
                          {currentYearRolled && interactiveStage !== 'completed' && (
                            <div className="view-animate" style={{ backgroundColor: currentYearResultText.includes('사망') || currentYearResultText.includes('전사') ? 'rgba(153, 34, 34, 0.05)' : 'rgba(16, 185, 129, 0.05)', border: `1.5px solid ${currentYearResultText.includes('사망') || currentYearResultText.includes('전사') ? 'var(--color-danger)' : 'var(--color-success)'}`, padding: '14px', borderRadius: '6px', marginBottom: '14px', textAlign: 'center' }}>
                              <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>{interactiveYear}년 판정 결과</span>
                              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: 'bold', color: currentYearResultText.includes('사망') || currentYearResultText.includes('전사') ? 'var(--color-danger)' : 'var(--color-success)' }}>
                                {currentYearResultText}
                              </h4>

                              <p style={{ fontSize: '0.76rem', color: 'var(--color-grey)', margin: '4px 0 12px 0' }}>
                                당해 세부 사건 전개가 연대기 로그 북에 정식 마킹되었습니다.
                              </p>

                              <button
                                type="button"
                                className="btn-medieval"
                                style={{ margin: '0 auto', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', borderColor: 'var(--color-gold-dark)' }}
                                onClick={advanceChronicleYear}
                              >
                                {interactiveStage === 'gf_dead' ? '👨 부친 Gerard 경의 시대로 이동' :
                                  interactiveStage === 'f_dead' ? '🏁 연대기 완료 및 유산 정산' :
                                    interactiveYear === 744 ? '👴 조부 은퇴 및 부친 상속식 진행' :
                                      interactiveYear === 766 ? '🏁 부친 은퇴 및 연대기 매듭짓기' :
                                        `➡️ ${interactiveYear + 1}년으로 시간선 진행`}
                              </button>
                            </div>
                          )}

                          {/* Undo & Reset buttons */}
                          {interactiveStage !== 'completed' && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px', marginBottom: '8px' }}>
                              <button
                                type="button"
                                className="btn-medieval"
                                style={{ fontSize: '0.78rem', padding: '4px 10px', color: 'var(--color-crimson)', borderColor: 'rgba(185, 28, 28, 0.3)', display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent' }}
                                onClick={() => {
                                  if (window.confirm("⚠️ 정말 연대기를 처음(723년)부터 다시 시작하시겠습니까?\n이때까지 기록된 모든 연대기 진행 내역이 초기화됩니다.")) {
                                    startInteractiveChronicle();
                                  }
                                }}
                              >
                                🔄 연대기 초기화 (처음부터)
                              </button>
                              {chronicleHistory.length > 0 && (
                                <button
                                  type="button"
                                  className="btn-medieval"
                                  style={{ fontSize: '0.78rem', padding: '4px 10px', color: 'var(--color-grey)', borderColor: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent' }}
                                  onClick={undoLastChronicleStep}
                                >
                                  ↩️ 뒤로가기 (직전 판정 취소)
                                </button>
                              )}
                            </div>
                          )}

                          {/* Completed Stage View */}
                          {interactiveStage === 'completed' && (
                            <div className="view-animate" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.04)', border: '1.5px solid var(--color-success)', borderRadius: '6px' }}>
                                <Award size={32} style={{ color: 'var(--color-success)', margin: '0 auto 8px' }} />
                                <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--color-success)' }}>
                                  🎉 위대한 조상들의 연대기가 완전히 완성되었습니다!
                                </h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-grey)', marginTop: '4px', lineHeight: 1.4 }}>
                                  조부 {character.family?.ancestor || '알베르 경 (Sir Albert)'}와 부친 제라르 경의 웅장한 영웅담이 가문에 뿌리내렸습니다.<br />
                                  쌓아올린 영광(Glory)의 1/10과 불굴의 신조, 이교도에 대한 분노가 당신에게 오롯이 계승됩니다.
                                </p>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: 'rgba(43, 65, 112, 0.04)', padding: '12px', borderRadius: '6px', border: '1.5px solid var(--color-gold-light)' }}>
                                <div>
                                  <h5 style={{ margin: '0 0 6px 0', color: 'var(--color-royal-blue)', fontSize: '0.86rem' }}>👴 조부 ({character.family?.ancestor || '알베르 경 (Sir Albert)'})</h5>
                                  <span style={{ fontSize: '0.78rem', color: 'var(--color-ink)', lineHeight: '1.4' }}>
                                    • 최종 영광: <strong>{grandfatherGlory} Glory</strong><br />
                                    • 생몰년도: 702년 ~ {grandfatherDeathYear}년<br />
                                    • 사인: {grandfatherDeathCause || '평화로운 임종'}<br />
                                    • 누적 증오: 작센인 ({grandfatherHates.saxons}), 무어인 ({grandfatherHates.moors})
                                  </span>
                                </div>
                                <div>
                                  <h5 style={{ margin: '0 0 6px 0', color: 'var(--color-crimson)', fontSize: '0.86rem' }}>👨 부친 (Gerard 경)</h5>
                                  <span style={{ fontSize: '0.78rem', color: 'var(--color-ink)', lineHeight: '1.4' }}>
                                    • 최종 영광: <strong>{fatherGlory} Glory</strong><br />
                                    • 생몰년도: 724년 ~ {fatherDeathYear}년<br />
                                    • 사인: {fatherDeathCause || '평화로운 임종'}<br />
                                    • 누적 증오: 작센인 ({fatherHates.saxons}), 무어인 ({fatherHates.moors})
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                {!ancestorApplied ? (
                                  <button
                                    type="button"
                                    className="btn-medieval btn-medieval-primary"
                                    style={{ fontSize: '0.9rem', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    onClick={applyAncestorLegacy}
                                  >
                                    <Check size={16} />
                                    연대기 유산 최종 적용하기 (시트 계승)
                                  </button>
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ color: 'var(--color-success)', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid var(--color-success)', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.03)' }}>
                                      <Check size={16} /> 계승 유산 시트 반영 완료!
                                    </div>
                                    <button
                                      type="button"
                                      className="btn-medieval"
                                      style={{ fontSize: '0.8rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-gold-dark)', borderColor: 'var(--color-gold)' }}
                                      onClick={syncFamilyTreeOnly}
                                    >
                                      <RefreshCw size={12} /> 가계도 재연동 (Re-sync)
                                    </button>
                                  </div>
                                )}
                                <button
                                  type="button"
                                  className="btn-medieval"
                                  style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                                  onClick={startInteractiveChronicle}
                                >
                                  🔄 다시 개척하기 (초기화)
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Historical Log Scroll Box */}
                          <div style={{ marginTop: '16px' }}>
                            <span style={{ fontSize: '0.74rem', color: 'var(--color-grey)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>📜 양가 가문 대서사 로그 북</span>
                            <div style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#faf6eb', border: '1.2px solid rgba(201, 168, 76, 0.3)', padding: '12px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.76rem', whiteSpace: 'pre-wrap', color: '#5a4933', scrollbarWidth: 'thin', lineHeight: '1.5' }}>
                              {ancestorRollLog.slice().reverse().map((line, idx) => (
                                <div key={idx} style={{ borderBottom: '1px dashed rgba(201,168,76,0.15)', paddingBottom: '4px', marginBottom: '4px' }}>
                                  {line}
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  )}

                </div>

                  {/* 📖 Table 1-3: 가문 수호 성인 판정 (Family Patron Saints) */}
                  <div style={{ marginTop: '16px', border: '1.5px solid var(--color-gold)', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.7)' }}>
                    <div style={{ backgroundColor: 'rgba(201,168,76,0.12)', padding: '10px 14px', borderBottom: '1px solid var(--color-gold-light)' }}>
                      <h4 style={{ margin: 0, fontWeight: 'bold', fontSize: '0.92rem', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        ⛪ Table 1-3: 가문 수호 성인 판정 (Family Patron Saints)
                      </h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.76rem', color: 'var(--color-grey)' }}>
                        룰북 Page 25. 가문이 모시는 수호 성인을 d20으로 결정합니다. 성인의 가호에 따른 보너스가 가문원에게 적용됩니다.
                      </p>
                    </div>
                    <div style={{ padding: '14px' }}>
                      {/* Roll Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>d20 수동 입력 (1~20):</span>
                        <input
                          type="number"
                          min={1} max={20}
                          placeholder="랜덤"
                          value={patronSaintRoll}
                          onChange={e => setPatronSaintRoll(e.target.value)}
                          style={{ width: '70px', padding: '4px', textAlign: 'center', fontWeight: 'bold', border: '1.5px solid var(--color-gold-light)', borderRadius: '4px' }}
                        />
                        <button
                          type="button"
                          className="btn-medieval btn-medieval-primary"
                          style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                          onClick={() => {
                            let d20 = parseInt(patronSaintRoll);
                            if (isNaN(d20) || d20 < 1 || d20 > 20) {
                              d20 = Math.floor(Math.random() * 20) + 1;
                            }
                            const saint = patronSaints[d20 - 1];
                            setPatronSaintResult({ roll: d20, saint });
                          }}
                        >
                          ⛪ 수호 성인 굴림
                        </button>
                        {patronSaintResult && (
                          <button
                            type="button"
                            className="btn-medieval"
                            style={{ fontSize: '0.78rem', padding: '5px 10px' }}
	                            onClick={() => {
	                              const saint = patronSaintResult.saint;
                                if (hasAppliedEvent(character, 'character_creation:patron_saint')) {
                                  alert("수호 성인 보너스는 이미 이 캠페인에 반영되었습니다.");
                                  return;
                                }
	                              setCharacter(prev => {
                                  const result = applyOnce(prev, 'character_creation:patron_saint', updated => {
                                    saint.apply(updated);
                                    updated.family = updated.family || {};
                                    updated.family.patronSaint = saint.name;
                                    updated.family.patronSaintApplied = true;
                                    return updated;
                                  }, `수호 성인: ${saint.name}`);
	                                return result.character;
	                              });
	                              alert(`수호 성인 [${saint.name}]의 가호가 캐릭터 시트에 적용되었습니다!\n효과: ${saint.benefit}`);
	                            }}
                          >
                            🌟 시트에 적용
                          </button>
                        )}
                      </div>

                      {/* Result Display */}
                      {patronSaintResult && (
                        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.04)', border: '1.5px solid var(--color-success)', padding: '12px', borderRadius: '6px', marginBottom: '14px' }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-success)', marginBottom: '6px' }}>
                            🎲 d20: [{patronSaintResult.roll}] → {patronSaintResult.saint.name}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--color-ink)' }}>
                            • 수호 대상: <strong>{patronSaintResult.saint.patronage}</strong><br />
                            • 가호 효과: <strong style={{ color: 'var(--color-royal-blue)' }}>{patronSaintResult.saint.benefit}</strong>
                          </div>
                        </div>
                      )}

                      {/* Full Table Reference */}
                      <div style={{ border: '1px solid rgba(201,168,76,0.25)', borderRadius: '6px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem' }}>
                          <thead>
                            <tr style={{ backgroundColor: 'rgba(201,168,76,0.1)' }}>
                              <th style={{ padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid var(--color-gold-light)', width: '50px' }}>d20</th>
                              <th style={{ padding: '6px 8px', textAlign: 'left', borderBottom: '1px solid var(--color-gold-light)' }}>수호 성인 (Saint)</th>
                              <th style={{ padding: '6px 8px', textAlign: 'left', borderBottom: '1px solid var(--color-gold-light)' }}>수호 대상</th>
                              <th style={{ padding: '6px 8px', textAlign: 'left', borderBottom: '1px solid var(--color-gold-light)' }}>가호 효과</th>
                            </tr>
                          </thead>
                          <tbody>
                            {patronSaints.map((saint, idx) => (
                              <tr
                                key={idx}
                                style={{
                                  backgroundColor: patronSaintResult?.roll === idx + 1 ? 'rgba(16, 185, 129, 0.08)' : (idx % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(201,168,76,0.03)'),
                                  fontWeight: patronSaintResult?.roll === idx + 1 ? 'bold' : 'normal',
                                  borderLeft: patronSaintResult?.roll === idx + 1 ? '3px solid var(--color-success)' : '3px solid transparent'
                                }}
                              >
                                <td style={{ padding: '4px 8px', textAlign: 'center', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>{idx + 1}</td>
                                <td style={{ padding: '4px 8px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>{saint.name}</td>
                                <td style={{ padding: '4px 8px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>{saint.patronage}</td>
                                <td style={{ padding: '4px 8px', borderBottom: '1px solid rgba(201,168,76,0.1)', color: 'var(--color-royal-blue)' }}>{saint.benefit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

            </div>
          )}
        </div>

        {/* Panel 3: 기사의 마지막 기록과 구원 판정 */}
        <div className="ft-panel" style={{ border: '1px solid var(--color-gold-light)', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.45)', overflow: 'hidden', boxShadow: 'none' }}>
          <div 
            style={{ backgroundColor: 'rgba(201, 168, 76, 0.1)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none', fontWeight: 'bold', color: 'var(--color-gold-dark)' }}
            onClick={() => setActivePanel(activePanel === 'salvation' ? null : 'salvation')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Award size={14} /> ⛪ 기사의 마지막 기록과 구원 판정 (Salvation)</span>
            <span style={{ fontSize: '0.8rem' }}>{activePanel === 'salvation' ? '접기 ▲' : '펼치기 ▼'}</span>
          </div>
          {activePanel === 'salvation' && (() => {
            // Calculate all salvation variables at render time
            const chaste = character.traits.chaste || 10;
            const forgiving = character.traits.forgiving || 10;
            const merciful = character.traits.merciful || 10;
            const modest = character.traits.modest || 10;
            const temperate = character.traits.temperate || 10;
            const trusting = character.traits.trusting || 10;
            const lowestReligiousTrait = Math.min(chaste, forgiving, merciful, modest, temperate, trusting);

            const amorVal = character.passions.amor || 0;
            const honorVal = character.passions.honor || 0;
            const loyaltyLiege = character.passions.loyaltyLiege || 0;
            const loveGodVal = character.passions.loveGod || 0;

            const amorBonus = Math.min(5, Math.max(0, amorVal - 15));
            const honorBonus = Math.min(5, Math.max(0, honorVal - 15));
            const liegeBonus = Math.min(5, Math.max(0, loyaltyLiege - 15));
            const godBonus = Math.min(5, Math.max(0, loveGodVal - 15));

            const deedsBonus = (salvationDeedsPaladin ? 5 : 0) +
              (salvationDeedsHolyWar ? 5 : 0) +
              Math.min(5, Math.max(0, parseInt(salvationPagans) || 0)) +
              (parseInt(salvationCustomDeeds) || 0);

            const totalSalvationScore = lowestReligiousTrait + amorBonus + honorBonus + liegeBonus + godBonus + deedsBonus;

            return (
            <div className="view-animate" style={{ padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.65)', borderTop: '1px solid var(--color-gold-light)' }}>
                        <section className="cs-section view-animate">
            <div className="sheet-ribbon"><h3>⛪ 기사의 마지막 기록과 구원 판정 (Salvation Roll)</h3></div>
            <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div style={{ backgroundColor: 'rgba(43, 65, 112, 0.04)', border: '1.5px solid var(--color-gold)', padding: '16px', borderRadius: '6px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '1rem', color: 'var(--color-royal-blue)' }}>
                  📖 기사의 마지막 기록과 구원 판정 규칙
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-ink)', lineHeight: '1.45', margin: 0 }}>
                  룰북 42쪽 규칙에 의거, 기사 캐릭터가 전사하거나 일생을 마칠 때 자신의 평생의 공적과 신앙심을 저울질하여 천국, 연옥, 지옥 중 어디로 갈지 판정합니다.<br />
                  구원 판정에 성공하면 다음 세대 계승자는 **이전 캐릭터의 특정한 핵심 스킬 전수 보너스** 및 **시작 탄생 선물 가산 혜택**을 누립니다.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                {/* Score Calculator */}
                <div style={{ border: '1.2px solid rgba(201,168,76,0.3)', padding: '14px', borderRadius: '6px', backgroundColor: '#fff' }}>
                  <h5 style={{ margin: '0 0 12px 0', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: '1.5px solid var(--color-gold-light)', paddingBottom: '4px' }}>
                    📊 구원 스코어 계산기 (Salvation Score)
                  </h5>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #eee', paddingBottom: '4px' }}>
                      <span>⛪ 가장 낮은 종교적 성향 수치 (기본값):</span>
                      <strong style={{ color: 'var(--color-crimson)' }}>{lowestReligiousTrait} 점</strong>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--color-grey)', marginTop: '-6px', marginBottom: '4px' }}>
                      * 정숙({chaste}), 관용({forgiving}), 자비({merciful}), 겸손({modest}), 절제({temperate}), 신뢰({trusting}) 중 최솟값
                    </span>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #eee', paddingBottom: '4px' }}>
                      <span>💘 연인 열망 보너스 (Amor &gt; 15):</span>
                      <span>+{amorBonus} 점 <span style={{ color: 'var(--color-grey)' }}>({amorVal}점)</span></span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #eee', paddingBottom: '4px' }}>
                      <span>🏅 명예 열망 보너스 (Honor &gt; 15):</span>
                      <span>+{honorBonus} 점 <span style={{ color: 'var(--color-grey)' }}>({honorVal}점)</span></span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #eee', paddingBottom: '4px' }}>
                      <span>👑 주군 충성 보너스 (Loyalty &gt; 15):</span>
                      <span>+{liegeBonus} 점 <span style={{ color: 'var(--color-grey)' }}>({loyaltyLiege}점)</span></span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #eee', paddingBottom: '4px' }}>
                      <span>⛪ 신앙 열망 보너스 (Love God &gt; 15):</span>
                      <span>+{godBonus} 점 <span style={{ color: 'var(--color-grey)' }}>({loveGodVal}점)</span></span>
                    </div>

                    {/* Deeds Checklist */}
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                        <input type="checkbox" checked={salvationDeedsPaladin} onChange={e => setSalvationDeedsPaladin(e.target.checked)} />
                        🛡️ 성기사 공적 (Paladin Deeds): +5 점
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                        <input type="checkbox" checked={salvationDeedsHolyWar} onChange={e => setSalvationDeedsHolyWar(e.target.checked)} />
                        ⛪ 성전 참전 중 전사 또는 일생을 마치고 수도자 귀의: +5 점
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'bold' }}>🧙 직접 개종시킨 이교도 수 (최대 5):</span>
                        <input type="number" min={0} max={5} value={salvationPagans} onChange={e => setSalvationPagans(Math.min(5, Math.max(0, parseInt(e.target.value) || 0)))} style={{ width: '60px', padding: '2px 4px', textAlign: 'center' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'bold' }}>🎭 GM 부여 기타 가산치:</span>
                        <input type="number" value={salvationCustomDeeds} onChange={e => setSalvationCustomDeeds(parseInt(e.target.value) || 0)} style={{ width: '60px', padding: '2px 4px', textAlign: 'center' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1.5px solid var(--color-gold-dark)', paddingTop: '8px', marginTop: '10px', fontSize: '0.92rem' }}>
                      <strong>최종 구원 판정 기준치 (Salvation Score):</strong>
                      <strong style={{ color: 'var(--color-success)', fontSize: '1.05rem' }}>{totalSalvationScore} 점</strong>
                    </div>
                  </div>
                </div>

                {/* Roller & Outcome */}
                <div style={{ border: '1.2px solid rgba(201,168,76,0.3)', padding: '14px', borderRadius: '6px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h5 style={{ margin: '0 0 12px 0', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: '1.5px solid var(--color-gold-light)', paddingBottom: '4px' }}>
                      🎲 운명 주사위 굴림 및 영면 판정
                    </h5>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>주사위 수동 입력 (1~20):</span>
                      <input
                        type="number"
                        min={1} max={20}
                        placeholder="랜덤"
                        value={salvationManualD20}
                        onChange={e => setSalvationManualD20(e.target.value)}
                        style={{ width: '80px', padding: '4px', textAlign: 'center', fontWeight: 'bold', border: '1.5px solid var(--color-gold-light)', borderRadius: '4px' }}
                      />
                      <button
                        type="button"
                        className="btn-medieval btn-medieval-primary"
                        style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                        onClick={rollSalvation}
                      >
                        ⛪ 영면 판정 굴림
                      </button>
                    </div>

                    {salvationRollResult && (
                      <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.03)', border: '1px solid var(--color-success)', padding: '12px', borderRadius: '6px', fontSize: '0.82rem', lineHeight: '1.45' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-success)', borderBottom: '1px dashed var(--color-success)', paddingBottom: '4px', marginBottom: '6px' }}>
                          영혼 판정 결과: {salvationRollResult.outcome}
                        </div>
                        • 구원 판정 기준치: <strong>{salvationRollResult.total}</strong><br />
                        • 운명 주사위 결과: <strong>d20: [ {salvationRollResult.roll} ]</strong><br />
                        • 영면의 안식처: <strong style={{ color: 'var(--color-crimson)', fontSize: '0.92rem' }}>{salvationRollResult.destination}</strong><br />

                        {salvationRollResult.isSaint ? (
                          <div style={{ marginTop: '8px', padding: '6px', backgroundColor: 'rgba(255, 215, 0, 0.1)', border: '1px solid gold', borderRadius: '4px', fontWeight: 'bold', color: 'var(--color-gold-dark)', textAlign: 'center' }}>
                            👼 🎉 가문의 기적: 성인(Saint) 추대 성공!<br />
                            (다음 계승자: Table 1-17 성인의 축복 획득!)
                          </div>
                        ) : (
                          <div style={{ marginTop: '4px', fontSize: '0.74rem', color: 'var(--color-grey)' }}>
                            * 성인(Sainthood) 조건: 구원 공적 보너스 15점 이상 확보, 주사위 임계 성공(1), 교단 소속 Standing 판정 패스
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {salvationRollResult && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                      <button
                        type="button"
                        className="btn-medieval btn-medieval-primary"
                        style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}
                        onClick={applySalvationLegacy}
                      >
                        🌟 영면 및 가문 계승 시트 적용
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </section>
            </div>
            );
          })()}
        </div>

      </div>

      {/* 가문 동원력 현황판 (Family Muster Scores, p.28) */}
      <div className="view-animate" style={{
        margin: '0 0 12px 0',
        padding: '10px 16px',
        backgroundColor: '#faf6eb',
        border: '1.5px solid var(--color-gold)',
        borderRadius: '2px',
        boxShadow: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.1rem' }}>🛡️</span>
          <strong style={{ fontSize: '0.9rem', color: 'var(--color-gold-dark)' }}>가문의 군역 (Family Muster, p.28)</strong>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-ink)' }}>
            👴 노년 기사 (50세+): <strong style={{ color: 'var(--color-crimson)', fontSize: '0.95rem' }}>{character.family?.oldKnights ?? 0}</strong>명
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-ink)' }}>
            ⚔️ 장년 기사 (31~49세): <strong style={{ color: 'var(--color-crimson)', fontSize: '0.95rem' }}>{character.family?.middleKnights ?? 0}</strong>명
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-ink)' }}>
            🛡️ 청년 기사 (30세 이하): <strong style={{ color: 'var(--color-crimson)', fontSize: '0.95rem' }}>{character.family?.youngKnights ?? 0}</strong>명
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-ink)' }}>
            🏹 친족 보병 (비기사 친족): <strong style={{ color: 'var(--color-crimson)', fontSize: '0.95rem' }}>{character.family?.lineageMen ?? 0}</strong>명
          </div>
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--color-grey)' }}>
          * 총 군역: 기사 <strong>{(character.family?.oldKnights || 0) + (character.family?.middleKnights || 0) + (character.family?.youngKnights || 0)}</strong>명 / 보병 <strong>{character.family?.lineageMen || 0}</strong>명
        </div>
      </div>

      {/* Main Family Tree Drawer Canvas */}
      <div className="ft-canvas-wrapper">
        <div className="ft-canvas" ref={treeContainerRef}>
          
          {/* SVG Overlay layer for connection lines */}
          {showRelationLines && (
            <svg className="ft-svg-layer">
              {lines.map((line) => (
                <path
                  key={line.id}
                  d={line.path}
                  className={`ft-svg-path ${line.type === 'marriage' ? 'path-marriage' : 'path-lineage'}`}
                />
              ))}
            </svg>
          )}

          {/* Render Generations Row by Row */}
          <div className="ft-rows-container">
            {generations.map(gen => renderGenerationRow(gen))}
          </div>

        </div>
      </div>

      {/* Modal Dialog for Add/Edit Member */}
      {isModalOpen && createPortal(
        <div className="ft-modal-overlay">
          <form onSubmit={handleSave} className="ft-modal view-animate">
            <div className="ft-modal-header">
              <h3>{modalMode === 'add' ? '새 가문원 추가' : '가문원 정보 수정'}</h3>
              <button type="button" className="ft-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="ft-modal-body">
              <div className="ft-form-group">
                <label className="ft-label">성별 (Gender):</label>
                <div style={{ display: 'flex', gap: '16px', marginTop: '4px', marginBottom: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-ink)' }}>
                    <input 
                      type="radio" 
                      name="gender" 
                      value="male" 
                      checked={formGender === 'male'} 
                      onChange={() => setFormGender('male')} 
                    />
                    남성 (Male)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-ink)' }}>
                    <input 
                      type="radio" 
                      name="gender" 
                      value="female" 
                      checked={formGender === 'female'} 
                      onChange={() => setFormGender('female')} 
                    />
                    여성 (Female)
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="ft-form-group">
                  <label className="ft-label">한국어 이름:</label>
                  <input 
                    type="text" 
                    className="ft-input" 
                    value={formNameKo} 
                    onChange={e => setFormNameKo(e.target.value)}
                    placeholder="예: 기욤"
                    required
                  />
                </div>
                <div className="ft-form-group">
                  <label className="ft-label">영어 이름 (선택):</label>
                  <input 
                    type="text" 
                    className="ft-input" 
                    value={formNameEn} 
                    onChange={e => setFormNameEn(e.target.value)}
                    placeholder="예: Guillaume"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', marginTop: '-4px' }}>
                <button
                  type="button"
                  className="btn-medieval"
                  style={{ padding: '4px 10px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(201,168,76,0.08)' }}
                  onClick={() => handleRandomName('male')}
                >
                  🎲 남성 이름 생성
                </button>
                <button
                  type="button"
                  className="btn-medieval"
                  style={{ padding: '4px 10px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(201,168,76,0.08)' }}
                  onClick={() => handleRandomName('female')}
                >
                  🎲 여성 이름 생성
                </button>
              </div>

              <div className="ft-form-group">
                <label className="ft-label">가문원 신분/칭호 규칙:</label>
                <select 
                  className="ft-input"
                  value={formMemberClass}
                  onChange={e => setFormMemberClass(e.target.value)}
                >
                  <option value="종자 (Squire)">종자 (Squire) - 칭호 없음</option>
                  <option value="기사 (Knight)">기사 (Knight) - 경 / Sir</option>
                  <option value="영주 (Lord)">영주/지방관 기사 (Lord) - 영주 / Lord</option>
                  <option value="남작 (Baron)">남작 (Baron) - 남작 / Baron</option>
                  <option value="백작 (Count)">백작 (Count) - 백작 / Count</option>
                  <option value="공작 (Duke)">공작 (Duke) - 공작 / Duke</option>
                  <option value="부인 (Lady)">부인 (Lady) - 부인 / Lady</option>
                  <option value="기타 (Custom)">기타 (직접 지정 안함) - 기본값 출력</option>
                </select>
              </div>

              <div className="ft-form-group" style={{ backgroundColor: 'rgba(201,168,76,0.05)', padding: '8px 12px', borderRadius: '4px', border: '1px solid rgba(201,168,76,0.15)', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-grey)', display: 'block' }}>계산된 최종 이름 (가계도 표시):</span>
                <strong style={{ color: 'var(--color-gold-dark)', fontSize: '0.88rem' }}>
                  {getTitleByNameAndClass(formNameKo, formNameEn, formMemberClass) || '(이름을 입력하세요)'}
                </strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="ft-form-group">
                  <label className="ft-label">가문내 관계/역할 (선택):</label>
                  <input 
                    type="text" 
                    className="ft-input" 
                    value={formRelation} 
                    onChange={e => setFormRelation(e.target.value)}
                    placeholder="미입력 시 자동 계산 (예: 형, 작은아버지, 조카 등)"
                    disabled={['albert', 'gerard', 'eleanor', 'roland'].includes(editingMember?.id)}
                  />
                  {['albert', 'gerard', 'eleanor', 'roland'].includes(editingMember?.id) && (
                    <span style={{ fontSize: '0.68rem', color: 'var(--color-grey)', marginTop: '2px' }}>
                      🔒 핵심 구성원의 계보 관계는 고정됩니다.
                    </span>
                  )}
                </div>
                
                <div className="ft-form-group">
                  <label className="ft-label">세대 선택 (0~5대):</label>
                  <select 
                    className="ft-input" 
                    value={formGeneration} 
                    onChange={e => setFormGeneration(e.target.value)}
                  >
                    {generations.map(gen => (
                      <option key={gen} value={gen}>{gen}대 ({genLabels[gen].split(' ')[0]})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="ft-form-group">
                  <label className="ft-label">현재 생존/건강 상태:</label>
                  <select 
                    className="ft-input" 
                    value={formStatus} 
                    onChange={e => setFormStatus(e.target.value)}
                  >
                    <option value="생존">생존 (Healthy)</option>
                    <option value="사망">사망 (Deceased)</option>
                    <option value="질병">질병 (Illness)</option>
                    <option value="실종">실종 (Missing)</option>
                    <option value="포로">포로 (Captive)</option>
                  </select>
                </div>

                <div className="ft-form-group">
                  <label className="ft-label">생몰년도:</label>
                  <input 
                    type="text" 
                    className="ft-input" 
                    value={formLifeYears} 
                    onChange={e => setFormLifeYears(e.target.value)}
                    placeholder="예: 768~ 또는 725~770"
                  />
                </div>
              </div>

              {formStatus === '사망' && (
                <div className="ft-form-group view-animate">
                  <label className="ft-label">사망 원인 (예: 파비아 공성전, 노환, 사고):</label>
                  <input 
                    type="text" 
                    className="ft-input" 
                    value={formDeathCause} 
                    onChange={e => setFormDeathCause(e.target.value)}
                    placeholder="예: 파비아 공성전, 노환, 사고 등 짧게 입력"
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="ft-form-group">
                  <label className="ft-label">부모 연결:</label>
                  <select 
                    className="ft-input" 
                    value={formParentId} 
                    onChange={e => setFormParentId(e.target.value)}
                  >
                    <option value="">없음</option>
                    {members
                      .filter(m => m.id !== editingMember?.id)
                      .map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.relation})</option>
                      ))
                    }
                  </select>
                </div>

                <div className="ft-form-group">
                  <label className="ft-label">배우자 연결:</label>
                  <select 
                    className="ft-input" 
                    value={formSpouseId} 
                    onChange={e => setFormSpouseId(e.target.value)}
                  >
                    <option value="">없음</option>
                    {members
                      .filter(m => m.id !== editingMember?.id && m.generation === Number(formGeneration))
                      .map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.relation})</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="ft-form-group">
                <label className="ft-label">인물 기록 및 특징 (메모):</label>
                <textarea 
                  className="ft-input" 
                  rows={2}
                  value={formNote} 
                  onChange={e => setFormNote(e.target.value)}
                  placeholder="예: 사생아 출생 룰로 인해 태어남. 가문의 기사단장."
                  style={{ resize: 'none' }}
                />
              </div>

              {/* ⚔️ 가문 특징 결정기 (Family Characteristic) 섹션 */}
              <div style={{ marginTop: '16px', borderTop: '2px dashed var(--color-gold-light)', paddingTop: '12px', marginBottom: '12px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--color-royal-blue)', fontFamily: 'var(--font-korean)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                  <Shield size={14} />
                  ⚔️ 가문 특징 결정기 (Family Characteristic)
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-grey)', marginBottom: '10px', lineHeight: 1.4 }}>
                  가문이 선천적으로 가지는 자질입니다. {formGender === 'male' ? '남성 기사단/종자(Table 1-1)' : '여성(Table 1-2)'} 테이블 기준으로 결정됩니다.
                  {formRelation === '본인' && " (본인은 캐릭터 시트 능력치/스킬에 직접 반영됩니다)"}
                </p>

                <div style={{ backgroundColor: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.18)', borderRadius: '6px', padding: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: '12px' }}>
                    
                    {/* Left panel: Roll settings */}
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-grey)', marginBottom: '2px' }}>수동 주사위 (1~20):</span>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <input
                              type="number"
                              min={1} max={20}
                              placeholder="d20"
                              value={fcManualD20}
                              onChange={e => setFcManualD20(e.target.value)}
                              style={{ width: '60px', padding: '4px', fontSize: '0.8rem', border: '1px solid var(--color-gold-light)', borderRadius: '4px', textAlign: 'center', background: '#fff' }}
                            />
                            <button
                              type="button"
                              className="btn-medieval"
                              onClick={() => {
                                if (!fcManualD20) {
                                  alert("수동 주사위 값을 먼저 입력해 주세요!");
                                  return;
                                }
                                rollFamilyCharacteristic();
                              }}
                              style={{ height: '28px', fontSize: '0.74rem', padding: '0 8px', display: 'flex', alignItems: 'center' }}
                            >
                              입력
                            </button>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px', width: '100%' }}>
                          <button
                            type="button"
                            className="btn-medieval btn-medieval-primary"
                            onClick={() => {
                              setFcManualD20('');
                              const r = Math.floor(Math.random() * 20) + 1;
                              setFcRoll(r);
                            }}
                            style={{ height: '28px', display: 'flex', alignItems: 'center', gap: '4px', padding: '0 10px', fontSize: '0.76rem', flex: 1 }}
                          >
                            <Dices size={12} />
                            랜덤
                          </button>
                          <button
                            type="button"
                            className="btn-medieval"
                            onClick={() => {
                              setFcRoll('');
                              setFcManualD20('');
                              setFcChoiceSkill('');
                              setFcChoiceValue(10);
                              setFcChoiceAttribute('');
                            }}
                            style={{ height: '28px', fontSize: '0.76rem', padding: '0 8px' }}
                          >
                            지우기
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right panel: Roll results */}
                    <div style={{ borderLeft: '1px solid rgba(201,168,76,0.15)', paddingLeft: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      {fcRoll ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem' }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-grey)' }}>결과:</span>
                            <strong style={{ fontSize: '0.86rem', color: 'var(--color-crimson)', marginLeft: '4px' }}>🎲 {fcRoll}</strong>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-grey)' }}>특징명:</span>
                            <strong style={{ fontSize: '0.8rem', color: 'var(--color-royal-blue)', display: 'block' }}>
                              {getCharacteristicDetails(fcRoll, formGender, fcChoiceSkill, fcChoiceValue, fcChoiceAttribute)?.desc}
                            </strong>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-grey)' }}>효과:</span>
                            <span style={{ fontSize: '0.76rem', color: 'var(--color-gold-dark)', fontWeight: 'bold', display: 'block' }}>
                              {getCharacteristicDetails(fcRoll, formGender, fcChoiceSkill, fcChoiceValue, fcChoiceAttribute)?.bonusText}
                            </span>
                          </div>

                          {/* Choice skill / attribute logic (when roll is 20) */}
                          {(fcRoll === 20) && (
                            <div style={{ marginTop: '4px', border: '1px solid #ddd', padding: '6px', borderRadius: '4px', backgroundColor: '#fff', fontSize: '0.74rem' }}>
                              <strong style={{ display: 'block', color: 'var(--color-crimson)', marginBottom: '2px' }}>🎯 자유 선택:</strong>
                              {formGender === 'female' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                    <input type="radio" checked={fcChoiceAttribute === 'app'} onChange={() => setFcChoiceAttribute('app')} />
                                    능력치 APP +5
                                  </label>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                    <input type="radio" checked={fcChoiceAttribute !== 'app'} onChange={() => setFcChoiceAttribute('')} />
                                    스킬 직접 선택
                                  </label>
                                  {fcChoiceAttribute !== 'app' && (
                                    <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                                      <select value={fcChoiceSkill} onChange={e => setFcChoiceSkill(e.target.value)} style={{ padding: '2px', fontSize: '0.72rem' }}>
                                        <option value="">-- 스킬 선택 --</option>
                                        {Object.keys(character.skills || {}).map(s => (
                                          <option key={s} value={s}>{SKILL_TRANSLATIONS[s] || s}</option>
                                        ))}
                                      </select>
                                      <select value={fcChoiceValue} onChange={e => setFcChoiceValue(parseInt(e.target.value))} style={{ padding: '2px', fontSize: '0.72rem' }}>
                                        <option value={10}>+10</option>
                                        <option value={5}>+5</option>
                                      </select>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <select value={fcChoiceSkill} onChange={e => setFcChoiceSkill(e.target.value)} style={{ padding: '2px', fontSize: '0.72rem' }}>
                                    <option value="">-- 스킬 선택 --</option>
                                    {Object.keys(character.skills || {}).map(s => (
                                      <option key={s} value={s}>{SKILL_TRANSLATIONS[s] || s}</option>
                                    ))}
                                  </select>
                                  <select value={fcChoiceValue} onChange={e => setFcChoiceValue(parseInt(e.target.value))} style={{ padding: '2px', fontSize: '0.72rem' }}>
                                    <option value={10}>+10</option>
                                    <option value={5}>+5</option>
                                  </select>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Apply/Remove Buttons only for main character (본인) */}
                          {formRelation === '본인' && (
                            <div style={{ marginTop: '6px', display: 'flex', gap: '4px' }}>
                              <button
                                type="button"
                                className="btn-medieval btn-medieval-primary"
                                style={{ fontSize: '0.72rem', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '2px', height: '24px' }}
                                onClick={() => applyFamilyCharacteristicToCharacter(fcRoll, formGender, fcChoiceSkill, fcChoiceValue, fcChoiceAttribute)}
                              >
                                <Check size={10} />
                                시트 반영
                              </button>
                              {character.family?.characteristic?.applied && (
                                <button
                                  type="button"
                                  className="btn-medieval"
                                  style={{ fontSize: '0.72rem', padding: '4px 8px', color: 'var(--color-danger)', borderColor: 'var(--color-danger)', height: '24px' }}
                                  onClick={removeFamilyCharacteristicFromCharacter}
                                >
                                  반영 해제
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.74rem', color: 'var(--color-grey)', fontStyle: 'italic' }}>
                          주사위를 굴리거나 입력하면 결과가 나타납니다.
                        </span>
                      )}
                    </div>

                  </div>
                </div>

                {/* Show active character-sheet reflection state if editing main character (본인) */}
                {formRelation === '본인' && character.family?.characteristic?.applied && (
                  <div style={{ marginTop: '8px', backgroundColor: 'rgba(46,107,51,0.05)', border: '1px solid rgba(46,107,51,0.2)', borderRadius: '4px', padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.74rem', color: '#2e6b33' }}>
                      <strong>✓ 시트 반영됨</strong>: [{character.family?.characteristic?.desc || ''}] ({character.family?.characteristic?.bonusText || ''})
                    </div>
                    <button
                      type="button"
                      className="btn-medieval"
                      style={{ fontSize: '0.68rem', padding: '2px 6px', color: 'var(--color-danger)', borderColor: 'var(--color-danger)', height: '20px' }}
                      onClick={removeFamilyCharacteristicFromCharacter}
                    >
                      해제
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="ft-modal-footer">
              {modalMode === 'edit' && editingMember?.status === '생존' && editingMember?.relation !== '본인' && (
                <button 
                  type="button" 
                  className="btn-medieval" 
                  style={{ backgroundColor: 'var(--color-crimson)', color: '#fff', borderColor: 'var(--color-crimson)', marginRight: 'auto' }}
                  onClick={handleInheritCharacter}
                >
                  ⚔️ 이 캐릭터로 계승하기
                </button>
              )}
              <button type="button" className="btn-medieval" onClick={() => setIsModalOpen(false)}>
                취소
              </button>
              <button type="submit" className="btn-medieval btn-medieval-primary">
                {modalMode === 'add' ? '추가하기' : '수정 완료'}
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}

    </div>
  );
}

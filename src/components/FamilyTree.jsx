import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Heart, Plus, Trash2, Edit, Crown, UserPlus, X, RefreshCw, Info, Calendar, Skull } from 'lucide-react';
import { maleNames, femaleNames, frankishMalePrefixes, frankishMaleSuffixes, frankishFemalePrefixes, frankishFemaleSuffixes } from '../data/names';

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
  const me = allMembers.find(m => m.relation === '본인');
  if (!me) return member.relation;
  if (member.id === me.id) return '본인';

  // 만약 사용자가 수동으로 특수한 관계 명칭을 기입했다면, 이를 존중하여 그대로 표시합니다.
  const standardRelations = ['조부', '부친', '모친', '본인', '남동생', '자녀', '형제', '친족', '가문원', ''];
  const hasCustomRelation = member.relation && !standardRelations.includes(member.relation.trim());
  if (hasCustomRelation) {
    return member.relation;
  }

  const getBirthYear = (ly) => {
    if (!ly) return 9999;
    const match = String(ly).match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 9999;
  };

  const memberGender = getGender(member);
  const meBirth = getBirthYear(me.lifeYears);
  const memberBirth = getBirthYear(member.lifeYears);

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
        const fatherBirth = getBirthYear(parentObj.lifeYears);
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
        const fatherBirth = getBirthYear(parentObj.lifeYears);
        const siblingBirth = getBirthYear(parentSiblingSpouse.lifeYears);
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

export default function FamilyTree({ character, setCharacter }) {
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

  const treeContainerRef = useRef(null);
  const hasCenteredRef = useRef(false);
  const [lines, setLines] = useState([]);
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

    const positions = character.family.positions || {};
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
      calculateLines();
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
    const positions = character.family.positions || {};
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
      calculateLines();
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
    const confirmInherit = window.confirm(`정말로 이 인물(${editingMember.name})로 대를 이어 플레이를 계속하시겠습니까?\n• 기사 시트의 실명, 나이(가계도 기반 자동 계산)가 동적 전환됩니다.\n• 가계도 내 기존 '본인'은 은퇴/사망 처리되고 이 인물이 새로운 '본인'이 됩니다.`);
    if (!confirmInherit) return;

    const birthYearStr = editingMember.lifeYears?.split('~')?.[0]?.trim() || '';
    const birthYear = parseInt(birthYearStr) || 768;
    const currentYear = character.personal?.campaignYear || 768;
    const calculatedAge = Math.max(15, currentYear - birthYear);

    setCharacter(prev => {
      const updated = JSON.parse(JSON.stringify(prev));

      // 1. Find and update the old "본인"
      const oldSelfIndex = updated.family?.members?.findIndex(m => m.relation === '본인') ?? -1;
      let oldSelfId = 'roland';
      if (oldSelfIndex !== -1 && updated.family && updated.family.members) {
        const oldSelf = updated.family.members[oldSelfIndex];
        oldSelfId = oldSelf.id;
        const isChildOfOldSelf = editingMember.parentId === oldSelf.id;
        oldSelf.relation = isChildOfOldSelf ? '부친' : '친족';
        oldSelf.status = '사망';
        oldSelf.lifeYears = oldSelf.lifeYears.split('~')[0] + `~${currentYear}`;
        oldSelf.note = `위대한 모험을 마치고 명예롭게 은퇴/전사한 선조 기사. 최종 영광 ${prev.gear?.gloryTotal || 1000} Glory.`;
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
      updated.personal.name = editingMember.name;
      updated.personal.age = calculatedAge;
      updated.gear.gloryTotal = Math.floor((prev.gear?.gloryTotal || 1000) * 1.1);

      return updated;
    });

    setIsModalOpen(false);
    setEditingMember(null);
    alert(`[가문 상속 완료]: 새로운 계승자 기사(${editingMember.name}, ${calculatedAge}세)로의 전환이 시트와 가계도에 공식 적용되었습니다!`);
  };

  const members = (character.family?.members || []).map(m => {
    if (m.relation === '본인') {
      return { ...m, name: character.personal?.name || m.name };
    }
    return m;
  });

  // Default Template for reset
  const defaultMembers = [
    { id: 'albert', name: '알베르 경 (Sir Albert)', relation: '조부', generation: 1, status: '사망', lifeYears: '702~770', deathCause: '영지 분쟁', note: '샤를마뉴 대제 초기의 백작 기사이자 전설적인 용사.', gender: 'male' },
    { id: 'gerard', name: '제라르 경 (Sir Gerard)', relation: '부친', generation: 2, status: '사망', lifeYears: '724~768', deathCause: '파비아 공성전', note: '작센 원정에서 주군을 구하고 명예롭게 전사.', spouseId: 'eleanor', gender: 'male' },
    { id: 'eleanor', name: '엘레오노르 부인 (Lady Eleanor)', relation: '모친', generation: 2, status: '생존', lifeYears: '748~', note: '기품 있는 성품으로 영지 관리를 돌보는 인자한 어머니.', spouseId: 'gerard', gender: 'female' },
    { id: 'roland', name: '롤랑 경 (Sir Roland)', relation: '본인', generation: 3, status: '생존', lifeYears: '768~', note: '플레이어 캐릭터. 샤를마뉴 대제의 젊은 성기사.', parentId: 'gerard', gender: 'male' },
    { id: 'pierre', name: '피에르 경 (Sir Pierre)', relation: '남동생', generation: 3, status: '생존', lifeYears: '772~', note: '형의 뒤를 이어 성기사가 되기 위해 맹훈련 중인 종자.', parentId: 'gerard', gender: 'male' }
  ];

  // SVG Lines Calculation
  const calculateLines = () => {
    if (!treeContainerRef.current) return;
    const containerRect = treeContainerRef.current.getBoundingClientRect();
    const computedLines = [];

    // Track drawn marriages to avoid duplicate lines
    const drawnMarriages = new Set();

    members.forEach(member => {
      // 1. Marriage Lines
      if (member.spouseId && !drawnMarriages.has(`${member.id}-${member.spouseId}`) && !drawnMarriages.has(`${member.spouseId}-${member.id}`)) {
        const nodeEl = treeContainerRef.current.querySelector(`[data-node-id="${member.id}"]`);
        const spouseEl = treeContainerRef.current.querySelector(`[data-node-id="${member.spouseId}"]`);

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
        const childEl = treeContainerRef.current.querySelector(`[data-node-id="${member.id}"]`);
        const parentNode = members.find(m => m.id === member.parentId);
        
        if (childEl && parentNode) {
          const childRect = childEl.getBoundingClientRect();
          const childX = (childRect.left + childRect.right) / 2 - containerRect.left;
          const childY = childRect.top - containerRect.top;

          // If the parent has a spouse, we should draw from the marriage center rather than a single parent
          let parentX, parentY;
          const parentEl = treeContainerRef.current.querySelector(`[data-node-id="${parentNode.id}"]`);
          const spouseEl = parentNode.spouseId ? treeContainerRef.current.querySelector(`[data-node-id="${parentNode.spouseId}"]`) : null;

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
            // Orthogonal routing (직각 형태 연결선)
            const midY = (parentY + childY) / 2;
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

    setLines(computedLines);
  };

  useEffect(() => {
    // Recalculate layout paths after component rendering or data changes
    const timer = setTimeout(() => {
      calculateLines();
    }, 100);

    window.addEventListener('resize', calculateLines);
    
    // Setup ResizeObserver for the tree container itself to track dynamic DOM shifts
    let observer;
    if (treeContainerRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        calculateLines();

        // Centering logic inside ResizeObserver to guarantee scrollWidth is fully calculated
        if (!hasCenteredRef.current) {
          const wrapper = treeContainerRef.current.parentElement;
          if (wrapper) {
            const maxScroll = treeContainerRef.current.scrollWidth - wrapper.clientWidth;
            if (maxScroll > 0) {
              wrapper.scrollLeft = maxScroll / 2;
              hasCenteredRef.current = true;
            }
          }
        }
      });
      observer.observe(treeContainerRef.current);
    }

    // Fallback centering timer
    const fallbackCenteringTimer = setTimeout(() => {
      if (!hasCenteredRef.current && treeContainerRef.current) {
        const wrapper = treeContainerRef.current.parentElement;
        if (wrapper) {
          wrapper.scrollLeft = (treeContainerRef.current.scrollWidth - wrapper.clientWidth) / 2;
          hasCenteredRef.current = true;
        }
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackCenteringTimer);
      window.removeEventListener('resize', calculateLines);
      if (observer) observer.disconnect();
    };
  }, [members]);

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

      const combinedName = getTitleByNameAndClass(formNameKo, formNameEn, formMemberClass);
      let updatedMembers = [...members];

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
          spouseId: formSpouseId || undefined
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
              spouseId: formSpouseId || undefined
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
      const isPlayer = modalMode === 'edit' && editingMember.relation === '본인';

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
        }
        return nextChar;
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

    const positions = character.family.positions || {};
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
              🎲 랜덤 구성원
            </button>
            <button 
              type="button" 
              className="btn-medieval" 
              style={{ padding: '2px 6px', fontSize: '0.66rem', display: 'flex', alignItems: 'center', gap: '2px', borderRadius: '4px', background: 'rgba(201,168,76,0.06)' }}
              onClick={() => handleAddRandomSpouse(gen)}
              title="해당 세대의 미혼 1인 가문원 중 한 명에게 배우자를 자동 생성하여 연결합니다."
            >
              ❤️ 배우자 생성
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
                    <Heart size={14} fill="var(--color-danger)" color="var(--color-danger)" />
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

  const renderMemberCard = (member) => {
    const isKnight = member.relation === '본인';
    const statusColor = getStatusColor(member.status);
    const isDeceased = member.status === '사망';
    const memberGender = getGender(member);
    const calculatedRelation = getCalculatedRelation(member, members);

    const positions = character.family.positions || {};
    const pos = positions[member.id] || { x: 0, y: 0 };
    const isGrabbing = dragRef.current.memberId === member.id;
 
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


        
        <div className="ft-card-header">
          <span className="ft-relation">{calculatedRelation}</span>
          <span 
            className="ft-status-text"
            style={{ color: statusColor, fontWeight: 'bold', fontSize: '0.62rem', letterSpacing: '-0.02em' }}
          >
            {member.status === '생존' && '🌱 생존'}
            {member.status === '사망' && '🪦 영면'}
            {member.status === '질병' && '🩸 병환'}
            {member.status === '실종' && '🌫️ 행방'}
            {member.status === '포로' && '⛓️ 억류'}
          </span>
        </div>

        <h4 className="ft-name" style={{ textDecoration: isDeceased ? 'line-through' : 'none', margin: '2px 0 3px 0' }}>
          <span className="ft-name-ko" style={{ fontSize: '0.84rem', fontWeight: 'bold' }}>{splitName(member.name).ko}</span>
          {splitName(member.name).en && (
            <span className="ft-name-en" style={{ fontSize: '0.72rem', fontWeight: '500', color: 'var(--color-grey)', marginLeft: '4px' }}>
              ({splitName(member.name).en})
            </span>
          )}
        </h4>
        
        <div className="ft-details-row" style={{ display: 'flex', justifyContent: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--color-grey)', flexWrap: 'wrap', width: '100%', lineHeight: '1.2' }}>
          {member.lifeYears && <span className="ft-years" style={{ display: 'inline', width: 'auto', margin: 0 }}>{member.lifeYears}</span>}
          {isDeceased && member.deathCause && (
            <span className="ft-death-cause" style={{ display: 'inline', width: 'auto', margin: 0, color: 'var(--color-crimson)' }}>
              ({member.deathCause})
            </span>
          )}
        </div>




        {/* Hover overlay with action buttons */}
        <div className="ft-card-overlay">
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
          <h4 style={{ fontWeight: 'bold', color: 'var(--color-royal-blue)' }}>🏰 {character.family.name} 가문 계보도</h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-grey)', marginTop: '2px' }}>
            가문원 카드에 마우스를 올리면 관계선 추가, 편집, 삭제가 가능합니다. (본인 {character.personal?.name || '롤랑 경'} 중심)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
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

      {/* Main Family Tree Drawer Canvas */}
      <div className="ft-canvas-wrapper">
        <div className="ft-canvas" ref={treeContainerRef}>
          
          {/* SVG Overlay layer for connection lines */}
          <svg className="ft-svg-layer">
            {lines.map((line) => (
              <path
                key={line.id}
                d={line.path}
                className={`ft-svg-path ${line.type === 'marriage' ? 'path-marriage' : 'path-lineage'}`}
              />
            ))}
          </svg>

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

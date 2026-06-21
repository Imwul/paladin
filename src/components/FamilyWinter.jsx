import React, { useState, useEffect } from 'react';
import { Shield, Dices, RotateCcw, ChevronRight, ChevronLeft, Check, Award, Compass, Heart, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';
import { maleNames, femaleNames } from '../data/names';
import FamilyTree from './FamilyTree';
import { birthGiftsTable } from './CharacterSheet';
import { applyOnce, appendWinterLog, hasAppliedEvent, markAppliedEvent, markWinterStep } from '../utils/campaignState';

const winterCheckKeyMap = {
  standingLord: 'liegeLord',
  standingChurch: 'church',
  standingCommoners: 'commoners',
  standingFamily: 'family',
  loveCharlemagne: 'charlemagne'
};

const resolveWinterCheckKey = (key) => winterCheckKeyMap[key] || key;

const appendGearNote = (character, field, note) => {
  character.gear = character.gear || {};
  character.gear[field] = character.gear[field] ? `${character.gear[field]}, ${note}` : note;
};

const rollBirthGift = (character) => {
  character.gear = character.gear || {};
  character.skills = character.skills || {};
  character.traits = character.traits || {};
  character.horses = character.horses || {};
  const roll = Math.floor(Math.random() * 20) + 1;
  const gift = birthGiftsTable.find(item => item.roll === roll) || birthGiftsTable[roll - 1];
  if (gift?.apply) gift.apply(character);
  return { roll, gift };
};

export default function FamilyWinter({ character, setCharacter }) {
  const [activeSubTab, setActiveSubTab] = useState('tree');
  const [winterStep, setWinterStep] = useState(1);
  const [logMessages, setLogMessages] = useState([]);

  // Interactive Step States
  const [agingD20, setAgingD20] = useState(null);
  const [agingLosses, setAgingLosses] = useState([]);
  const [agingApplied, setAgingApplied] = useState(false);

  const [harvestRoll, setHarvestRoll] = useState(null);
  const [harvestMult, setHarvestMult] = useState(null);
  const [harvestRevenue, setHarvestRevenue] = useState(null);
  const [harvestApplied, setHarvestApplied] = useState(false);

  const [squireSurvivalRoll, setSquireSurvivalRoll] = useState(null);
  const [squireStatus, setSquireStatus] = useState('');
  const [horseSurvivalRoll, setHorseSurvivalRoll] = useState(null);
  const [horseStatus, setHorseStatus] = useState('');
  const [survivalApplied, setSurvivalApplied] = useState(false);

  const [personalEventRoll, setPersonalEventRoll] = useState(null);
  const [personalEventText, setPersonalEventText] = useState(null);
  const [personalEventApplied, setPersonalEventApplied] = useState(false);

  const [marriageRoll, setMarriageRoll] = useState(null);
  const [marriageResult, setMarriageResult] = useState(null);
  const [childbirthRoll, setChildbirthRoll] = useState(null);
  const [childbirthResult, setChildbirthResult] = useState(null);
  const [familyEventRoll, setFamilyEventRoll] = useState(null);
  const [familyEventResult, setFamilyEventResult] = useState(null);
  const [familyApplied, setFamilyApplied] = useState(false);

  // New state variables for rulebook alignments
  const [marriageModifier, setMarriageModifier] = useState(0);
  const [childbirthMother, setChildbirthMother] = useState('wife'); // 'wife' or 'lover'
  const [familyEventChoice, setFamilyEventChoice] = useState(null); // 'a'/'b' or Battle result ('crit'/'success'/'failure'/'fumble') or Roll index (1-19)
  const [familyEventD6Roll, setFamilyEventD6Roll] = useState(null); // for debt and ransom rolls
  const [familyEventRoll20Selection, setFamilyEventRoll20Selection] = useState(null);

  const [experienceLogs, setExperienceLogs] = useState([]);
  const [experienceApplied, setExperienceApplied] = useState(false);

  // Step 8 states
  const [trainingOption, setTrainingOption] = useState(null);
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [selectedTrait, setSelectedTrait] = useState('');
  const [selectedPassion, setSelectedPassion] = useState('');
  const [selectedStanding, setSelectedStanding] = useState('');

  // Option B: 4 skills
  const [selectedSkills, setSelectedSkills] = useState({ adventure: '', courtly: '', combat: '', free: '' });
  // Option C: 1 high skill
  const [selectedHighSkill, setSelectedHighSkill] = useState('');
  const [trainingApplied, setTrainingApplied] = useState(false);

  // 연도별 이벤트 매핑
  // 연도별 이벤트 매핑
  const addLog = (msg) => {
    setLogMessages(prev => [msg, ...prev]);
    setCharacter(prev => ({
      ...prev,
      campaign: appendWinterLog(prev, msg)
    }));
  };

  const currentYear = character.personal?.campaignYear || 768;
  const currentWinter = character.campaign?.winter || {};
  const [calculatedAnnualGlory, setCalculatedAnnualGlory] = useState(null);
  const [gloryApplied, setGloryApplied] = useState(hasAppliedEvent(character, `winter:annual_glory:${currentYear}`));
  const [gloryBonusPoints, setGloryBonusPoints] = useState(currentWinter.gloryBonusPoints || 0);
  const [bonusSpent, setBonusSpent] = useState(currentWinter.bonusSpent || 0);
  const [showRefAging, setShowRefAging] = useState(false);
  const [showRefHarvest, setShowRefHarvest] = useState(false);
  const [showRefSurvival, setShowRefSurvival] = useState(false);
  const [showRefPersonal, setShowRefPersonal] = useState(false);
  const [showRefFamily, setShowRefFamily] = useState(false);
  const [showRefExperience, setShowRefExperience] = useState(false);

  useEffect(() => {
    if (Array.isArray(currentWinter.logs)) {
      setLogMessages([...currentWinter.logs].reverse());
    }
  }, [currentWinter.year]);

  const resolveWinterStep = (step, status = 'resolved') => {
    setCharacter(prev => ({
      ...prev,
      campaign: markWinterStep(prev, step, status)
    }));
  };

  // ══════════════════════════════════════════════════
  // STEP 2: AGING LOGIC
  // ══════════════════════════════════════════════════
  const rollAging = () => {
    const age = character.personal.age || 0;
    const hasEternalYouth = character.personal?.blessing?.includes("영원한 젊음") || character.personal?.blessing?.includes("Eternal Youth");
    const agingStartAge = hasEternalYouth ? 35 : 30;
    
    if (age < agingStartAge) {
      addLog(`[노화]: ${age}세 (${agingStartAge}세 미만${hasEternalYouth ? ' - 영원한 젊음 가호' : ''}). 노화 주사위를 생략합니다.`);
      setAgingD20(20);
      setAgingLosses([]);
      setAgingApplied(true);
      resolveWinterStep('aging');
      return;
    }

    const d20 = Math.floor(Math.random() * 20) + 1;
    setAgingD20(d20);

    let numRolls = 0;
    if (d20 === 1) numRolls = 5;
    else if (d20 <= 3) numRolls = 4;
    else if (d20 <= 6) numRolls = 3;
    else if (d20 <= 10) numRolls = 2;
    else if (d20 <= 15) numRolls = 1;

    const losses = [];
    const stats = ["SIZ", "DEX", "STR", "CON", "APP"];
    for (let i = 0; i < numRolls; i++) {
      const d6 = Math.floor(Math.random() * 6) + 1;
      if (d6 <= 5) {
        losses.push(stats[d6 - 1]);
      } else {
        losses.push("None");
      }
    }

    setAgingLosses(losses);
    setAgingApplied(false);
  };

  const applyAging = () => {
    if (agingApplied) return;
    const eventId = `winter:aging:${currentYear}`;
    if (hasAppliedEvent(character, eventId)) {
      alert("올해 노화 정산은 이미 반영되었습니다.");
      return;
    }
    const resolvedLosses = agingLosses.filter(l => l !== "None");

    setCharacter(prev => {
      const result = applyOnce(prev, eventId, updated => {
        resolvedLosses.forEach(stat => {
          const key = stat.toLowerCase();
          updated.attributes[key] = Math.max(3, (updated.attributes[key] || 0) - 1);
        });
        updated.attributes.currentHp = Math.min(updated.attributes.currentHp || 0, updated.attributes.siz + updated.attributes.con);
        updated.campaign = markWinterStep(updated, 'aging');
        return updated;
      }, '겨울 노화 정산');
      return result.character;
    });

    const lossText = resolvedLosses.length > 0 ? resolvedLosses.join(', ') + ' 각 -1' : '하락 없음';
    addLog(`[노화 적용]: d20 [${agingD20}] -> ${lossText}.`);
    setAgingApplied(true);
  };

  // ══════════════════════════════════════════════════
  // STEP 3: HARVEST LOGIC
  // ══════════════════════════════════════════════════
  const rollHarvest = () => {
    if (hasAppliedEvent(character, `winter:harvest:${currentYear}`)) {
      alert("올해 수확 수입은 이미 반영되었습니다.");
      return;
    }
    const d20 = Math.floor(Math.random() * 20) + 1;
    setHarvestRoll(d20);

    const hasProsperity = character.personal?.blessing?.includes("번영") || character.personal?.blessing?.includes("Prosperity");
    const stewardship = (character.skills.stewardship || 3) + (hasProsperity ? 3 : 0);
    let mult = 1.0;
    let outcome = "성공";

    if (d20 === 20) {
      mult = 0.5; outcome = "대실패";
    } else if (d20 === 1 || d20 === stewardship) {
      mult = 1.5; outcome = "대성공";
    } else if (d20 < stewardship) {
      mult = 1.0; outcome = "성공";
    } else {
      mult = 0.75; outcome = "실패";
    }

    const revenue = Math.round(6 * mult);
    setHarvestMult(mult);
    setHarvestRevenue(revenue);
    setHarvestApplied(false);
  };

  const applyHarvest = () => {
    if (harvestApplied) return;
    const eventId = `winter:harvest:${currentYear}`;
    if (hasAppliedEvent(character, eventId)) {
      alert("올해 수확 수입은 이미 반영되었습니다.");
      return;
    }
    setCharacter(prev => {
      const result = applyOnce(prev, eventId, updated => {
        updated.gear.cash = (updated.gear.cash || 0) + harvestRevenue;
        updated.campaign = markWinterStep(updated, 'harvest');
        return updated;
      }, `겨울 수확 £${harvestRevenue}`);
      return result.character;
    });

    addLog(`[영지 수확]: 영지관리 d20 [${harvestRoll}] vs [${character.skills.stewardship}]. 배율 x${harvestMult} -> £${harvestRevenue} 획득!`);
    setHarvestApplied(true);
  };

  // ══════════════════════════════════════════════════
  // STEP 4: SURVIVAL LOGIC
  // ══════════════════════════════════════════════════
  const rollSurvival = () => {
    const maintenanceLevel = character.personal?.maintenance || 'ordinary';
    
    // Squire Age & Maintenance Modifiers
    const squireAge = character.squire?.age || 14;
    let squireAgeMod = 0;
    if (squireAge <= 14) squireAgeMod = 1;
    else if (squireAge >= 30) squireAgeMod = -1;

    let squireMaintMod = 0;
    if (maintenanceLevel === 'rich' || maintenanceLevel === 'superlative') squireMaintMod = 1;
    else if (maintenanceLevel === 'poor') squireMaintMod = -1;
    else if (maintenanceLevel === 'impoverished' || maintenanceLevel === 'miserly') squireMaintMod = -2;

    const squirePenalty = character.squire?.nextYearPenalty || 0;
    const sRoll = Math.floor(Math.random() * 20) + 1;
    setSquireSurvivalRoll(sRoll);

    const finalSquireRoll = Math.min(20, Math.max(1, sRoll + squireAgeMod + squireMaintMod + squirePenalty));
    let sStatus = "건강함";
    if (finalSquireRoll === 1) sStatus = "사망 위험!";
    else if (finalSquireRoll === 2) sStatus = "질병 (내년 판정 -5)";
    setSquireStatus(sStatus);

    // Horse Age & Maintenance Modifiers
    const horseAge = character.horses?.warhorse?.age || 5;
    let horseAgeMod = 0;
    if (horseAge <= 2) horseAgeMod = 0;
    else if (horseAge <= 5) horseAgeMod = 1;
    else if (horseAge >= 12) horseAgeMod = -1;

    let horseMaintMod = 0;
    if (maintenanceLevel === 'superlative') horseMaintMod = 1;
    else if (maintenanceLevel === 'poor') horseMaintMod = -2;
    else if (maintenanceLevel === 'impoverished' || maintenanceLevel === 'miserly') horseMaintMod = -5;

    const horsePenalty = character.horses?.warhorse?.nextYearPenalty || 0;
    const hRoll = Math.floor(Math.random() * 20) + 1;
    setHorseSurvivalRoll(hRoll);

    const finalHorseRoll = Math.min(20, Math.max(1, hRoll + horseAgeMod + horseMaintMod + horsePenalty));
    let hStatus = "건강함";
    if (finalHorseRoll === 1) hStatus = "사망 위험!";
    else if (finalHorseRoll === 2) hStatus = "질병 (내년 판정 -5)";
    setHorseStatus(hStatus);

    setSurvivalApplied(false);
  };

  const applySurvival = () => {
    if (survivalApplied) return;
    const eventId = `winter:survival:${currentYear}`;
    if (hasAppliedEvent(character, eventId)) {
      alert("올해 종자/군마 생존 정산은 이미 반영되었습니다.");
      return;
    }

    const maintenanceLevel = character.personal?.maintenance || 'ordinary';
    const squireAge = character.squire?.age || 14;
    let squireAgeMod = 0;
    if (squireAge <= 14) squireAgeMod = 1;
    else if (squireAge >= 30) squireAgeMod = -1;

    let squireMaintMod = 0;
    if (maintenanceLevel === 'rich' || maintenanceLevel === 'superlative') squireMaintMod = 1;
    else if (maintenanceLevel === 'poor') squireMaintMod = -1;
    else if (maintenanceLevel === 'impoverished' || maintenanceLevel === 'miserly') squireMaintMod = -2;

    const squirePenalty = character.squire?.nextYearPenalty || 0;
    const finalSquireRoll = Math.min(20, Math.max(1, squireSurvivalRoll + squireAgeMod + squireMaintMod + squirePenalty));

    const horseAge = character.horses?.warhorse?.age || 5;
    let horseAgeMod = 0;
    if (horseAge <= 2) horseAgeMod = 0;
    else if (horseAge <= 5) horseAgeMod = 1;
    else if (horseAge >= 12) horseAgeMod = -1;

    let horseMaintMod = 0;
    if (maintenanceLevel === 'superlative') horseMaintMod = 1;
    else if (maintenanceLevel === 'poor') horseMaintMod = -2;
    else if (maintenanceLevel === 'impoverished' || maintenanceLevel === 'miserly') horseMaintMod = -5;

    const horsePenalty = character.horses?.warhorse?.nextYearPenalty || 0;
    const finalHorseRoll = Math.min(20, Math.max(1, horseSurvivalRoll + horseAgeMod + horseMaintMod + horsePenalty));

    setCharacter(prev => {
      const result = applyOnce(prev, eventId, updated => {
        if (squireStatus.includes('사망')) {
          updated.squire = { ...updated.squire, status: '사망' };
        } else if (squireStatus.includes('질병')) {
          updated.squire = { ...updated.squire, status: '질병', nextYearPenalty: -5 };
        } else {
          updated.squire = { ...updated.squire, status: '건강함', nextYearPenalty: 0 };
        }

        if (horseStatus.includes('사망')) {
          updated.horses.warhorse = { ...updated.horses.warhorse, status: '사망', hp: 0 };
        } else if (horseStatus.includes('질병')) {
          updated.horses.warhorse = { ...updated.horses.warhorse, status: '질병', nextYearPenalty: -5 };
        } else {
          if (updated.horses?.warhorse) {
            updated.horses.warhorse.status = '건강함';
            updated.horses.warhorse.nextYearPenalty = 0;
          }
        }
        updated.campaign = markWinterStep(updated, 'survival');
        return updated;
      }, '종자/군마 생존 정산');
      return result.character;
    });

    addLog(`[동료 생존]: 종자 d20 [${squireSurvivalRoll}] (나이보정 [${squireAgeMod}], 유지비보정 [${squireMaintMod}], 디버프 [${squirePenalty}]) -> 최종 [${finalSquireRoll}]: ${squireStatus}, 군마 d20 [${horseSurvivalRoll}] (나이보정 [${horseAgeMod}], 유지비보정 [${horseMaintMod}], 디버프 [${horsePenalty}]) -> 최종 [${finalHorseRoll}]: ${hStatus}`);
    setSurvivalApplied(true);
  };

  // ══════════════════════════════════════════════════
  // STEP 5: PERSONAL EVENT LOGIC (Table 10-9)
  // ══════════════════════════════════════════════════
  const personalEventTable = {
    1: { name: "정숙 (Chaste) 시험", trait: "chaste", crit: "레이디의 유혹을 뿌리치고 도덕을 증명했습니다! 정숙 +1", succ: "Serving wenches의 유혹을 물리쳤습니다. 정숙 체크!", fail: "사생아가 생겼습니다. 내년에 태어납니다. 음탕 체크!", fumb: "유혹에 들키는 수치! 은밀 기사 음모 적발. 명예 -1" },
    2: { name: "열정 (Energetic) 시험", trait: "energetic", crit: "엄청난 헌신! 훈련 포인트 +2 추가!", succ: "성실하게 수련했습니다. 훈련 포인트 +1 획득!", fail: "태만하게 여흥과 음주로 겨울을 보냈습니다. 나태 체크!", fumb: "완전한 나태와 방종! 이번 겨울 훈련과 실습 단계(Step 8)를 완전히 건너뜁니다!" },
    3: { name: "관용 (Forgiving) 시험", trait: "forgiving", crit: "친족의 무거운 잘못에 눈물을 흘리며 포용했습니다. 관용 +1", succ: "어전회의 모욕을 유머로 승화시켰습니다. 관용 체크!", fail: "라이벌 기사와의 사소한 언쟁으로 결투 신청을 감행했습니다. 실패 시 명예 -1", fumb: "이성을 잃고 라이벌을 검으로 베어 가문의 참혹한 복수극(Feud)을 열었습니다!" },
    4: { name: "관대 (Generous) 시험", trait: "generous", crit: "빈민 구제에 전재산의 절반을 기부했습니다. 관대 +1, 명망 +1", succ: "극빈층에게 £1을 선사했습니다. 관대 체크!", fail: "왕궁에서 지나친 탐욕과 명예욕을 부렸습니다. 이기 체크!", fumb: "지독한 이기심으로 인해 평민, 종교, 영지 명망(Standings) 각 -1 하락!" },
    5: { name: "정직 (Honest) 시험", trait: "honest", crit: "위증 압박 속에서도 진실을 굳게 대변했습니다. 정직 +1", succ: "주군의 사리사욕에 대해 솔직히 간언했습니다. 정직 체크!", fail: "비열하게 거짓말을 하다 들통났습니다. 무작위 명망 -1 하락", fumb: "거짓말의 대명사로 전락해 기사의 기틀인 명예(Honor)가 1점 깎입니다!" },
    6: { name: "정의 (Just) 시험", trait: "just", crit: "교회 비리를 눈감지 않고 법을 관철했습니다. 정의 +1", succ: "정당한 영지 재판 판결을 내렸습니다. 정의 체크!", fail: "뇌물 £1을 챙기는 부정을 저질렀습니다. 평민 명망 -1", fumb: "대주교에게 부정한 판결로 대중 앞에서 호된 질타를 당했습니다. 명예 -1" },
    7: { name: "자비 (Merciful) 시험", trait: "merciful", crit: "무고함을 증명하고 나를 해하려 한 정적을 사면했습니다. 자비 +1", succ: "영토 분쟁을 평화적으로 합의 종결했습니다. 자비 체크!", fail: "사소한 기득권을 지키려 피농민의 딸을 가혹한 벌로 복역했습니다. 잔혹 체크!", fumb: "빈민들의 애절한 구걸을 묵살했습니다. 교회 및 평민 명망 각 -1 하락" },
    8: { name: "겸손 (Modest) 시험", trait: "modest", crit: "타인이 나의 전술적 업적을 가로챘음에도 웃으며 축하했습니다. 겸손 +1", succ: "동료들을 먼저 주군의 만찬 테이블에 앉혔습니다. 겸손 체크!", fail: "가수 광대를 고용해 위업을 부풀렸습니다. £1 지출, 내년 영예 2배", fumb: "지나친 boast로 분노한 라이벌 기사에게 명예 배상금 £1을 강제 배상했습니다." },
    9: { name: "신중 (Prudent) 시험", trait: "prudent", crit: "현명한 보급책으로 겨울 영지의 굶주림을 사전에 면했습니다. 신중 +1", succ: "사냥터 무리한 계곡 점프를 사양했습니다. 신중 체크!", fail: "추운 눈폭풍 속에 고행 길을 강행했습니다. CON 굴림 실패 시 즉각 노화 d20!", fumb: "무모한 모험으로 인해 무작위 명망 수치가 1점 깎입니다." },
    10: { name: "절제 (Temperate) 시험", trait: "temperate", crit: "자발적 빈곤 서약으로 절제를 증명했습니다. £1 획득, 절제 +1", succ: "근검절약하는 겨울 라이프를 지켰습니다. 절제 체크!", fail: "지나친 궁정 명품을 지르고 말았습니다. 내년 유지비 상향 의무화.", fumb: "퇴폐적인 호화 잔치로 재산을 탕진하여 내년에 Rich 유지비 배수 지불!" },
    11: { name: "신뢰 (Trusting) 시험", trait: "trusting", crit: "온갖 혐의로 몰린 정인을 변론하여 믿음을 수호했습니다. 신뢰 +1", succ: "라이벌 기사단에 믿음을 표시하며 영지를 맡겼습니다. 신뢰 체크!", fail: "말도 안 되는 궁정 루머로 이웃을 무고했습니다. 주군의 사법 굴림 개입.", fumb: "wild한 비난 무고로 주군을 분노케 해, 주군 명망(Standing) -1 하락" },
    12: { name: "용맹 (Valorous) 시험", trait: "valorous", crit: "주군을 기습한 거대 야생 멧돼지의 목을 따 구출했습니다! 용맹 +1, 50 Glory", succ: "화마에 휩싸인 동료의 마구간에서 말을 구했습니다. 용맹 체크, 10 Glory", fail: "추운 작센 정찰 작전에서 거짓 꾀병으로 숨었습니다. 겁쟁이 체크!", fumb: "늑대 한 마리에 소스라치게 놀라 낙마하여 도주했습니다. 명예 -1" },
    13: { name: "왕 사랑 (Love [Charlemagne]) 시험", trait: "loveCharlemagne", crit: "황제의 가호! 내년 전투나 모험 중 무작위 1회 주사위 재굴림 찬스!", succ: "순찰사 앞에서 주군을 영광스럽게 찬양했습니다. 국왕 사랑 체크!", fail: "기사들이 술자리에서 황제를 조롱할 때 함께 껄껄댔습니다. (아무일 없음)", fumb: "황제의 명예로운 위업에 의심을 제기해, 국왕 명망(Standing) -1 하락" },
    14: { name: "명예 (Honor) 시험", trait: "honor", crit: "주군이 영지를 보상으로 하사했습니다! 장원 2개 및 £2d6 소지금 획득!", succ: "전령들이 명예로운 품격을 송축합니다. 20 Glory 획득, 명예 체크!", fail: "주인의 환대를 짓밟는 결례를 범했습니다. 사죄용 연회 개최비 £1 지출.", fumb: "비열한 도적과 야합하여 비열한 수치를 떨쳤습니다. 무작위 명망 -2 하락" },
    15: { name: "가족 사랑 (Love [family]) 시험", trait: "loveFamily", crit: "가문 명예 결투에 대리 출전해 사투를 벌였습니다! 3d6 노아머 부상, 용맹/가족사랑/가문명망 체크!", succ: "피소된 가문 일원의 신원 보증을 서주었습니다. 가문 명망 체크!", fail: "의회를 앞두고 혈육을 등지고 험담을 하였습니다. 가족 사랑 -1", fumb: "죽음의 위기에 빠진 삼촌이나 사촌의 구원 요청을 묵살했습니다. 가족 사랑 -2" },
    16: { name: "신 사랑 (Love [God]) 시험", trait: "loveGod", crit: "거룩한 성지 순례를 다녀왔습니다. £1 지출, 신 사랑 +1, 교회 명망 +1 (훈련 단계 스킵)", succ: "성직자의 감동적 설교의 모범 사례로 칭송받았습니다. 신 사랑 체크!", fail: "폭언과 신성모독적 저주를 내뱉었습니다. 교회 명망 -1", fumb: "정기 주일 미사를 수차례 거부하고 타락했습니다. 신 사랑 -1" },
    17: { name: "주군 명망 (Standing [lord]) 시험", trait: "standingLord", crit: "주군이 장비와 군마를 최고급 전투마(Charger)로 전면 무상 교체해주었습니다!", succ: "주군이 위업을 기려 선물을 하사합니다. 탄생 기프트 1개 획득!", fail: "전리품 분배에서 철저히 소외되었습니다. 쟁취 시 £1 및 이기 체크!", fumb: "불충 혐의로 몰렸습니다. 사법 도전을 펼치거나 명예 1점 영구 삭감." },
    18: { name: "교회 명망 (Standing [Church]) 시험", trait: "standingChurch", crit: "주교가 가을 대의회에서 축사를 올렸습니다. 25 Glory 및 국왕 명망 +1", succ: "주교의 전용 사냥 파티에 특별 초대를 받았습니다. 수렵 체크!", fail: "어전에서 사제에게 비열한 성정으로 공개 비난당했습니다. 평민 명망 -1", fumb: "교회 불경죄로 영구 순례 퀘스트를 명령받았습니다. 거부 시 교회 명망 -1" },
    19: { name: "평민 명망 (Standing [commoners]) 시험", trait: "standingCommoners", crit: "평민 상인 길드에서 최고급 Coursers 명마를 기부했습니다. 평민 명망 +1", succ: "장원 농민들이 기사를 위해 축제를 열었습니다. 민간 전설/평민 명망 체크!", fail: "백성들이 주교에게 불만을 제소했습니다. 무작위 기독교 성향 성공 시 체크, 실패 시 반대 체크.", fumb: "부랑 아웃로 무리에게 숲속 매복 기습을 당해 3d6 노아머 피해!" },
    20: { name: "기사의 결단 (Player's Choice)", trait: "choice", crit: "기사가 원하는 성향 하나를 자유롭게 +1 올립니다.", succ: "원하는 성향이나 기술 하나에 자유롭게 체크를 남깁니다.", fail: "아무 일도 일어나지 않았습니다.", fumb: "사소한 수치로 무작위 명망 하나가 1점 하락합니다." }
  };

  const fullyAutomatedPersonalEvents = new Set([12, 14, 16, 17, 18, 19]);
  const automatedFamilyEvents = new Set([1, 2, 3, 4, 5, 8, 10, 11, 12, 17, 19]);
  const personalEventNeedsManualResolution = personalEventRoll && !fullyAutomatedPersonalEvents.has(Number(personalEventRoll));
  const familyEventNeedsManualResolution = familyEventRoll
    && familyEventResult
    && !familyEventResult.includes('평온')
    && !automatedFamilyEvents.has(Number(familyEventRoll));

  const rollPersonalEvent = () => {
    if (hasAppliedEvent(character, `winter:personal_event:${currentYear}`)) {
      alert("올해 개인 사건은 이미 해결되었습니다.");
      return;
    }
    const d20 = Math.floor(Math.random() * 20) + 1;
    setPersonalEventRoll(d20);
    setPersonalEventText(personalEventTable[d20]);
    setPersonalEventApplied(false);
  };

  const applyPersonalEvent = () => {
    if (personalEventApplied) return;
    const eventId = `winter:personal_event:${currentYear}`;
    if (hasAppliedEvent(character, eventId)) {
      alert("올해 개인 사건은 이미 해결되었습니다.");
      return;
    }
    if (!personalEventText) return;
    const key = personalEventText.trait;
    const resolvedKey = resolveWinterCheckKey(key);
    const testValue = character.traits?.[key] ?? character.passions?.[key] ?? character.standings?.[resolvedKey] ?? 10;
    const testRoll = Math.floor(Math.random() * 20) + 1;
    let outcome = 'Failure';
    if (testRoll === 20) outcome = 'Fumble';
    else if (testRoll === 1 || testRoll === testValue) outcome = 'Critical';
    else if (testRoll < testValue) outcome = 'Success';

    setCharacter(prev => {
      const result = applyOnce(prev, eventId, updated => {
        updated.gear = updated.gear || {};
        updated.skills = updated.skills || {};
        updated.traits = updated.traits || {};
        updated.passions = updated.passions || {};
        updated.standings = updated.standings || {};
        updated.derived = updated.derived || {};
        updated.campaign = updated.campaign || {};
        updated.campaign.winter = updated.campaign.winter || {};
        updated.campaign.winter.steps = updated.campaign.winter.steps || {};

        const checkTrait = (traitKey) => {
          const mappedKey = resolveWinterCheckKey(traitKey);
          if (updated.traits?.[traitKey] !== undefined) {
            updated.traitsChecked = { ...(updated.traitsChecked || {}), [traitKey]: true };
          } else if (updated.passions?.[traitKey] !== undefined) {
            updated.passionsChecked = { ...(updated.passionsChecked || {}), [traitKey]: true };
          } else if (updated.standings?.[mappedKey] !== undefined) {
            updated.standings[mappedKey] = Math.min(25, (updated.standings[mappedKey] || 0) + 1);
          }
        };
        const checkSkill = (skillKey) => {
          updated.skillsChecked = { ...(updated.skillsChecked || {}), [skillKey]: true };
        };
        const addTrait = (traitKey, amount) => {
          const opposites = {
            chaste: 'lustful', energetic: 'lazy', forgiving: 'vengeful',
            generous: 'selfish', honest: 'deceitful', just: 'arbitrary',
            merciful: 'cruel', modest: 'proud', pious: 'worldly',
            prudent: 'reckless', temperate: 'indulgent', trusting: 'suspicious',
            valorous: 'cowardly'
          };
          const next = Math.min(20, Math.max(0, (updated.traits[traitKey] || 0) + amount));
          updated.traits[traitKey] = next;
          if (opposites[traitKey]) updated.traits[opposites[traitKey]] = 20 - next;
        };
        const addPassion = (passionKey, amount) => {
          updated.passions[passionKey] = Math.min(25, Math.max(0, (updated.passions[passionKey] || 0) + amount));
        };
        const addStanding = (standingKey, amount) => {
          const mappedKey = resolveWinterCheckKey(standingKey);
          updated.standings[mappedKey] = Math.min(25, Math.max(0, (updated.standings[mappedKey] || 0) + amount));
        };

        if (outcome === 'Critical') {
          if (updated.traits?.[key] !== undefined) addTrait(key, 1);
          if (key === 'valorous') updated.gear.gloryThisGame = (updated.gear.gloryThisGame || 0) + 50;
          if (key === 'honor') {
            updated.gear.gloryThisGame = (updated.gear.gloryThisGame || 0) + 20;
            updated.gear.cash = (updated.gear.cash || 0) + Math.floor(Math.random() * 12) + 2;
          }
          if (key === 'loveGod') {
            addPassion('loveGod', 1);
            addStanding('church', 1);
            updated.campaign.winter.steps.training = 'skipped';
          }
          if (key === 'standingLord') {
            appendGearNote(updated, 'personalGear', '주군이 하사한 최고급 장비');
            updated.horses = { ...(updated.horses || {}), warhorse: '최고급 돌격마 (Charger, 주군 하사)' };
          }
          if (key === 'standingChurch') {
            updated.gear.gloryThisGame = (updated.gear.gloryThisGame || 0) + 25;
            addStanding('charlemagne', 1);
          }
          if (key === 'standingCommoners') {
            updated.horses = { ...(updated.horses || {}), other3: '상인 길드가 기부한 최고급 경량마 (Courser)' };
            addStanding('commoners', 1);
          }
          if (key === 'loveCharlemagne') {
            updated.campaign.winter.unresolved = {
              ...(updated.campaign.winter.unresolved || {}),
              charlemagneReroll: {
                label: `${currentYear + 1}년 전투나 모험 중 무작위 1회 재굴림 기회`,
                required: false
              }
            };
          }
        } else if (outcome === 'Success') {
          checkTrait(key);
          if (key === 'valorous') updated.gear.gloryThisGame = (updated.gear.gloryThisGame || 0) + 10;
          if (key === 'honor') updated.gear.gloryThisGame = (updated.gear.gloryThisGame || 0) + 20;
          if (key === 'standingLord') {
            const { roll, gift } = rollBirthGift(updated);
            appendGearNote(updated, 'personalGear', `주군 하사품 d20 ${roll}: ${gift?.benefit || '탄생 기프트'}`);
          }
          if (key === 'standingChurch') checkSkill('hunting');
          if (key === 'standingCommoners') {
            checkSkill('folkLore');
            checkTrait('standingCommoners');
          }
          if (key === 'loveCharlemagne') checkTrait('loveCharlemagne');
        } else if (outcome === 'Failure') {
          if (key === 'loveFamily') addPassion('loveFamily', -1);
          if (key === 'loveGod') addStanding('church', -1);
          if (key === 'generous') updated.gear.cash = Math.max(0, (updated.gear.cash || 0) - 1);
          if (key === 'standingChurch') addStanding('commoners', -1);
          if (key === 'standingCommoners') checkTrait('pious');
          if (updated.traits?.[key] !== undefined) checkTrait(key);
        } else if (outcome === 'Fumble') {
          if (key === 'honor') addPassion('honor', -1);
          if (key === 'loveFamily') addPassion('loveFamily', -2);
          if (key === 'loveGod') addPassion('loveGod', -1);
          if (key === 'standingLord') addPassion('honor', -1);
          if (key === 'standingChurch') addStanding('church', -1);
          if (key === 'standingCommoners') updated.derived.currentHp = Math.max(0, (updated.derived?.currentHp || updated.derived?.maxHp || 0) - (Math.floor(Math.random() * 6) + 1) - (Math.floor(Math.random() * 6) + 1) - (Math.floor(Math.random() * 6) + 1));
          if (key === 'loveCharlemagne') addStanding('charlemagne', -1);
          if (key === 'energetic') updated.campaign.winter.steps.training = 'skipped';
        }

        updated.campaign = markWinterStep(updated, 'personalEvent');
        return updated;
      }, `개인 사건 ${personalEventText.name}: ${outcome}`);
      return result.character;
    });
    addLog(`[개인 사건]: 사건 d20 [${personalEventRoll}] ${personalEventText.name}; 테스트 d20 [${testRoll}] vs [${testValue}] -> ${outcome} 적용.`);
    setPersonalEventApplied(true);
  };

  // ══════════════════════════════════════════════════
  // STEP 6: FAMILY LOGIC (Marriage / Childbirth / Family Event)
  // ══════════════════════════════════════════════════
  const rollMarriage = () => {
    if (hasAppliedEvent(character, `winter:family_phase:${currentYear}`)) {
      alert("올해 가문 단계는 이미 정산되었습니다.");
      return;
    }
    const d20 = Math.floor(Math.random() * 20) + 1;
    const finalRoll = d20 + (parseInt(marriageModifier) || 0);
    setMarriageRoll(finalRoll);
    let rank = "가신 기사의 딸";
    let dowry = 1;
    let glory = 50;

    if (finalRoll <= 5) { rank = "부유한 평민 상인의 딸"; dowry = Math.floor(Math.random() * 18) + 9; glory = 0; }
    else if (finalRoll <= 8) { rank = "수습 종자의 딸"; dowry = 3; glory = 10; }
    else if (finalRoll <= 10) { rank = "가신 기사의 딸"; dowry = Math.floor(Math.random() * 6) + 1; glory = 50; }
    else if (finalRoll === 11) { rank = "부유한 봉신기사의 맏딸"; dowry = Math.floor(Math.random() * 3) + 7; glory = 100; }
    else if (finalRoll <= 20) { rank = "일반 봉신기사의 딸"; dowry = Math.floor(Math.random() * 6) + 1; glory = 100; }
    else if (finalRoll <= 25) { rank = "봉신기사 가문 여상속인"; dowry = 15; glory = 100; } // 1 manor + 1d6+10 represented as £15
    else { rank = "남작 가문의 막내딸"; dowry = 20; glory = 250; }

    setMarriageResult({ rank, dowry, glory });
  };

  const rollChildbirth = () => {
    if (hasAppliedEvent(character, `winter:family_phase:${currentYear}`)) {
      alert("올해 가문 단계는 이미 정산되었습니다.");
      return;
    }
    if (childbirthMother === 'lover' && (character.gear?.cash || 0) < 0.5) {
      alert("소지금이 부족하여 연인/첩의 출산 테이블을 굴릴 수 없습니다. (유지비 £0.5 필요)");
      return;
    }
    const d20 = Math.floor(Math.random() * 20) + 1;
    
    // Blessings & Maintenance Modifiers
    const maintenanceLevel = character.personal?.maintenance || 'ordinary';
    let mChildbirthMod = 0;
    if (maintenanceLevel === 'rich') mChildbirthMod = 1;
    else if (maintenanceLevel === 'superlative') mChildbirthMod = 2;

    const hasFertility = character.personal?.blessing?.includes("출산력") || character.personal?.blessing?.includes("Fertility");
    const fertilityMod = hasFertility ? 5 : 0;

    const finalRoll = Math.min(20, Math.max(1, d20 + mChildbirthMod + fertilityMod));
    setChildbirthRoll(finalRoll);

    let outcome = "아무 일 없음";
    if (finalRoll <= 10) outcome = "아무 일 없음";
    else if (finalRoll === 11) outcome = "비극: 산모와 아이 모두 출산 중 서거 😭";
    else if (finalRoll === 12) outcome = "비극: 산모 서거, 아이 생존 (성별 1d6) 🕯️";
    else if (finalRoll <= 19) outcome = "경사: 건강한 아이 출생! (성별 1d6) 👶";
    else if (finalRoll === 20) outcome = "경사: 쌍둥이 아이 출생! 🎉👶👶";

    setChildbirthResult(outcome);
  };

  const rollFamilyEvent = () => {
    if (hasAppliedEvent(character, `winter:family_phase:${currentYear}`)) {
      alert("올해 가문 단계는 이미 정산되었습니다.");
      return;
    }
    const d20 = Math.floor(Math.random() * 20) + 1;
    setFamilyEventRoll(d20);
    setFamilyEventChoice(null);

    // Roll d6 immediately if debts or ransom are rolled
    if (d20 === 7 || d20 === 14) {
      const d6 = Math.floor(Math.random() * 6) + 1;
      setFamilyEventD6Roll(d6);
    } else {
      setFamilyEventD6Roll(null);
    }

    let outcome = "평온한 한 해";
    if (d20 === 1) outcome = "가문의 비극: 친족이 시합 또는 불화 끝에 사망 (Table 10-13 롤필요)";
    else if (d20 === 2) outcome = "가문의 영광: 귀인의 목숨을 구하고 서거. 친족 전원 +10 Glory (Table 10-13 롤필요)";
    else if (d20 === 3) outcome = "위대한 위업: 멧돼지 사냥에서 주군 구출. 친족 전원 +5 Glory (Table 10-13 롤필요)";
    else if (d20 === 4) outcome = "납치 사건: 친족이 강제 결혼이나 몸값을 노린 무리에 납치됨 (Table 10-13 롤필요)";
    else if (d20 === 5) outcome = "실종 사건: 친족 한 명이 행방불명됨 (Table 10-13 롤필요)";
    else if (d20 === 6) outcome = "주군 모욕: 친족이 주군을 모욕함. 가문 옹호(a) 또는 책망(b) 선택 필요";
    else if (d20 === 7) outcome = "가문의 채무: 친족의 빚 변제 도움 요청. 지불(a) 또는 거절(b) 선택 필요";
    else if (d20 === 8) outcome = "뜻밖의 하사품: 가문의 선조 유물 선물 획득! (Table 1-15 롤필요)";
    else if (d20 === 9) outcome = "혼사 파탄: 파혼 또는 arranged 거부 발생. 가문 결사 옹호(a) 또는 무시(b) 선택 필요";
    else if (d20 === 10) outcome = "경사스런 혼사: 가문 일원이 고위 귀족가와 혼인. 명예 +1";
    else if (d20 === 11) outcome = "사생아 출생: 가문 일원이 사생아를 낳았습니다.";
    else if (d20 === 12) outcome = "피후견인 영입: 미성년 친족의 후견인이 됨. 영지 관리하여 성인 전까지 매년 £1 수급";
    else if (d20 === 13) outcome = "도망자 보호 요청: 친족이 형벌을 피해 도망쳐옴. 수용(a) 또는 거절(b) 선택 필요";
    else if (d20 === 14) outcome = "몸값 요구: 친족이 감금됨. 몸값 지불(a) 또는 거절(b) 선택 필요";
    else if (d20 === 15) outcome = "경범죄 기소: 친족이 경범죄 기소됨. £1 벌금 지불(a) 또는 거부(b) 선택 필요";
    else if (d20 === 16) outcome = "중범죄 기소: 친족이 중범죄 기소됨. £5 벌금 지불(a) 또는 거부(b) 선택 필요";
    else if (d20 === 17) outcome = "간통 스캔들: 친족 간통 연루로 상대 가문과 피의 복수(Feud) 시작!";
    else if (d20 === 18) outcome = "가문 Feud 격돌: 복수극 격화로 적 가문과 사투 격돌. Battle 체크 필요";
    else if (d20 === 19) outcome = "벼락 영전: 친족이 궁성 백작이나 순찰사 임명. +10 Glory";
    else if (d20 === 20) outcome = "기사의 결단 (Player's Choice): 가문 사건 결과(1-19) 선택 필요";

    setFamilyEventResult(outcome);
  };

  const skipChildbirth = () => {
    setChildbirthRoll(null);
    setChildbirthResult("출산 단계 건너뜀 (선택)");
    setChildbirthMother('none');
    setCharacter(prev => {
      if (prev.campaign?.unresolvedChildbirthBlocked) {
        return {
          ...prev,
          campaign: {
            ...prev.campaign,
            unresolvedChildbirthBlocked: false
          }
        };
      }
      return prev;
    });
  };

  const applyFamilyPhase = () => {
    if (familyApplied) return;
    const eventId = `winter:family_phase:${currentYear}`;
    if (hasAppliedEvent(character, eventId)) {
      alert("올해 가문 단계는 이미 정산되었습니다.");
      return;
    }

    let actualRoll = familyEventRoll;
    if (familyEventRoll === 20) {
      if (!familyEventRoll20Selection) {
        alert("기사의 결단으로 선택할 사건을 먼저 지정해 주세요.");
        return;
      }
      actualRoll = Number(familyEventRoll20Selection);
    }

    if (actualRoll === 6 || actualRoll === 7 || actualRoll === 9 || 
        actualRoll === 13 || actualRoll === 14 || actualRoll === 15 || 
        actualRoll === 16 || actualRoll === 18) {
      if (!familyEventChoice) {
        alert("가문 사건에 대한 선택이나 판정이 아직 내려지지 않았습니다!");
        return;
      }
    }

    setCharacter(prev => {
      const result = applyOnce(prev, eventId, updated => {
      const currentYear = prev.personal?.campaignYear || 768;
      const selfMember = updated.family?.members?.find(m => m.relation === '본인');
      const playerGen = selfMember?.generation ?? 3;
      const playerId = selfMember?.id ?? 'roland';

      // 1. Marriage Cash, Glory, and Spouse Addition
      if (marriageResult) {
        const existingLivingSpouse = updated.family?.members?.some(m => m.relation === '배우자' && m.spouseId === playerId && m.status === '생존');
        if (!existingLivingSpouse) {
          updated.gear.cash = (updated.gear?.cash || 0) + marriageResult.dowry;
          updated.gear.gloryThisGame = (updated.gear?.gloryThisGame || 0) + marriageResult.glory;

          // Increment manors if marrying an heiress or baron's daughter
          if (marriageResult.rank.includes("상속인")) {
            updated.family.manors = (updated.family.manors || 0) + (marriageResult.rank.includes("부유한") ? 2 : 1);
          } else if (marriageResult.rank.includes("남작")) {
            updated.family.manors = (updated.family.manors || 0) + 1;
          }

          // Add Spouse to Family Tree automatically
          const spouseId = 'spouse_' + Date.now();
          const randFemale = femaleNames[Math.floor(Math.random() * femaleNames.length)] || { en: "Mathilde", ko: "마틸드" };
          const spouseName = `${randFemale.ko} 부인 (Lady ${randFemale.en})`;
          const newSpouseMember = {
            id: spouseId,
            name: spouseName,
            relation: '배우자',
            generation: playerGen,
            status: '생존',
            lifeYears: `${currentYear - 18}~`,
            note: `기사와 ${currentYear}년에 정식 혼례를 올린 배우자. 신분: ${marriageResult.rank}. 지참금: £${marriageResult.dowry}.`,
            spouseId: playerId
          };

          if (updated.family) {
            if (!updated.family.members) updated.family.members = [];
            updated.family.members.push(newSpouseMember);
          }
        }
      }

      // 2. Childbirth Member Addition & Upkeep Cost
      if (childbirthResult && updated.family) {
        if (!updated.family.members) updated.family.members = [];
        
        // Upkeep deduction for lover/concubine
        if (childbirthMother === 'lover') {
          updated.gear.cash = Math.max(0, (updated.gear.cash || 0) - 0.5);
        }

        const spawnChild = (isSon) => {
          const childId = 'child_' + Math.random().toString(36).substr(2, 9);
          let childName = '';
          let childNote = '';
          if (isSon) {
            const randMale = maleNames[Math.floor(Math.random() * maleNames.length)] || { en: "Pierre", ko: "피에르" };
            childName = `${randMale.ko} 경 (Sir ${randMale.en})`;
            childNote = childbirthMother === 'lover' ? `연인/첩 소생 아들(서자).` : `가문의 적통을 이어갈 아들.`;
          } else {
            const randFemale = femaleNames[Math.floor(Math.random() * femaleNames.length)] || { en: "Aude", ko: "오드" };
            childName = `${randFemale.ko} 부인 (Lady ${randFemale.en})`;
            childNote = childbirthMother === 'lover' ? `연인/첩 소생 딸.` : `가문의 사랑받는 귀족 영애 딸.`;
          }
          return {
            id: childId,
            name: childName,
            relation: '자녀',
            generation: playerGen + 1,
            status: '생존',
            lifeYears: `${currentYear}~`,
            note: childNote,
            parentId: playerId
          };
        };

        if (childbirthResult.includes("건강한 아이 출생") || childbirthResult.includes("쌍둥이")) {
          const isTwin = childbirthResult.includes("쌍둥이");
          if (isTwin) {
            const son1 = Math.random() < 0.5;
            const son2 = Math.random() < 0.5;
            updated.family.members.push(spawnChild(son1));
            updated.family.members.push(spawnChild(son2));
          } else {
            const son = Math.random() < 0.5;
            updated.family.members.push(spawnChild(son));
          }
        } else if (childbirthResult.includes("산모 서거, 아이 생존")) {
          const son = Math.random() < 0.5;
          updated.family.members.push(spawnChild(son));

          // Only archive/kill spouse if rolled for Wife
          if (childbirthMother === 'wife') {
            const spouseIndex = updated.family.members.findIndex(m => m.relation === '배우자' && m.spouseId === playerId && m.status === '생존');
            if (spouseIndex !== -1) {
              updated.family.members[spouseIndex].status = '사망';
              updated.family.members[spouseIndex].deathCause = '출산 중 난산';
              updated.family.members[spouseIndex].lifeYears = updated.family.members[spouseIndex].lifeYears.split('~')[0] + `~${currentYear}`;
            }
          }
        } else if (childbirthResult.includes("산모와 아이 모두 출산 중 서거")) {
          // Only archive/kill spouse if rolled for Wife
          if (childbirthMother === 'wife') {
            const spouseIndex = updated.family.members.findIndex(m => m.relation === '배우자' && m.spouseId === playerId && m.status === '생존');
            if (spouseIndex !== -1) {
              updated.family.members[spouseIndex].status = '사망';
              updated.family.members[spouseIndex].deathCause = '출산 중 사망';
              updated.family.members[spouseIndex].lifeYears = updated.family.members[spouseIndex].lifeYears.split('~')[0] + `~${currentYear}`;
            }
          }
        }
      }

      // 3. Family Event Resolution (Fully expanded Table 10-12)
      if (familyEventResult && updated.family?.members) {
        const candidates = updated.family.members.filter(m => m.relation !== '본인' && m.status === '생존');
        const target = candidates[Math.floor(Math.random() * candidates.length)];
        
        let actualRoll = familyEventRoll;
        if (familyEventRoll === 20 && familyEventRoll20Selection) {
          actualRoll = Number(familyEventRoll20Selection);
        }

        updated.gear = updated.gear || {};
        updated.skills = updated.skills || {};
        updated.traits = updated.traits || {};
        updated.passions = updated.passions || {};
        updated.standings = updated.standings || {};
        updated.horses = updated.horses || {};

        const checkTrait = (updatedChar, traitKey) => {
          const mappedKey = resolveWinterCheckKey(traitKey);
          if (updatedChar.traits?.[traitKey] !== undefined) {
            updatedChar.traitsChecked = { ...(updatedChar.traitsChecked || {}), [traitKey]: true };
          } else if (updatedChar.passions?.[traitKey] !== undefined) {
            updatedChar.passionsChecked = { ...(updatedChar.passionsChecked || {}), [traitKey]: true };
          } else if (updatedChar.standings?.[mappedKey] !== undefined) {
            updatedChar.standings[mappedKey] = Math.min(25, (updatedChar.standings[mappedKey] || 0) + 1);
          }
        };

        const checkSkill = (updatedChar, skillKey) => {
          updatedChar.skillsChecked = { ...(updatedChar.skillsChecked || {}), [skillKey]: true };
        };

        if (actualRoll === 1 && target) {
          target.status = '사망';
          target.deathCause = '가문 비극 (토너먼트/불화)';
          target.lifeYears = (target.lifeYears || `${currentYear - 20}~`).split('~')[0] + `~${currentYear}`;
        } else if (actualRoll === 2) {
          updated.gear.gloryThisGame = (updated.gear.gloryThisGame || 0) + 10;
          if (target) {
            target.status = '사망';
            target.deathCause = '가문의 영광 (귀인 구출 중 전사)';
            target.lifeYears = (target.lifeYears || `${currentYear - 20}~`).split('~')[0] + `~${currentYear}`;
          }
        } else if (actualRoll === 3) {
          updated.gear.gloryThisGame = (updated.gear.gloryThisGame || 0) + 5;
        } else if (actualRoll === 4 && target) {
          target.status = '실종';
          target.note = `${target.note || ''}\n${currentYear}년 납치됨.`;
        } else if (actualRoll === 5 && target) {
          target.status = '실종';
          target.note = `${target.note || ''}\n${currentYear}년 행방불명.`;
        } else if (actualRoll === 6) {
          if (familyEventChoice === 'a') {
            checkTrait(updated, 'loveFamily');
          } else if (familyEventChoice === 'b') {
            checkTrait(updated, 'honor');
            updated.passions.loveFamily = Math.max(0, (updated.passions.loveFamily || 15) - 1);
          }
        } else if (actualRoll === 7) {
          if (familyEventChoice === 'a') {
            const cost = familyEventD6Roll || 3;
            updated.gear.cash = Math.max(0, (updated.gear.cash || 0) - cost);
            checkTrait(updated, 'standingFamily');
          } else {
            updated.standings.family = Math.max(0, (updated.standings.family || 16) - 1);
          }
        } else if (actualRoll === 8) {
          const { roll, gift } = rollBirthGift(updated);
          appendGearNote(updated, 'homePossessions', `가문 선조 유물 d20 ${roll}: ${gift?.benefit || '탄생 기프트'}`);
          checkTrait(updated, 'loveFamily');
        } else if (actualRoll === 9) {
          if (familyEventChoice === 'a') {
            checkTrait(updated, 'loveFamily');
            checkTrait(updated, 'standingFamily');
          }
        } else if (actualRoll === 10) {
          updated.passions.honor = Math.min(25, (updated.passions.honor || 16) + 1);
        } else if (actualRoll === 11) {
          if (target) {
            target.note = `${target.note || ''}\n${currentYear}년 사생아 출생 기록 있음.`;
          }
        } else if (actualRoll === 12) {
          updated.gear.homePossessions = `${updated.gear.homePossessions || ''}, 피후견인 영지 관리 (+£1/년)`;
          updated.gear.cash = (updated.gear.cash || 0) + 1;
        } else if (actualRoll === 13) {
          if (familyEventChoice === 'a') {
            checkTrait(updated, 'standingFamily');
            checkTrait(updated, 'honor');
            updated.traits.just = Math.max(0, (updated.traits.just || 10) - 1);
            updated.traits.arbitrary = 20 - updated.traits.just;
          } else {
            checkTrait(updated, 'just');
            updated.standings.family = Math.max(0, (updated.standings.family || 16) - 1);
          }
        } else if (actualRoll === 14) {
          if (familyEventChoice === 'a') {
            const cost = familyEventD6Roll || 3;
            updated.gear.cash = Math.max(0, (updated.gear.cash || 0) - cost);
            checkTrait(updated, 'loveFamily');
            checkTrait(updated, 'standingFamily');
          }
        } else if (actualRoll === 15) {
          if (familyEventChoice === 'a') {
            updated.gear.cash = Math.max(0, (updated.gear.cash || 0) - 1);
          } else {
            updated.passions.honor = Math.max(0, (updated.passions.honor || 16) - 1);
          }
        } else if (actualRoll === 16) {
          if (familyEventChoice === 'a') {
            updated.gear.cash = Math.max(0, (updated.gear.cash || 0) - 5);
          } else {
            updated.passions.honor = Math.max(0, (updated.passions.honor || 16) - 2);
          }
        } else if (actualRoll === 17) {
          updated.gear.homePossessions = `${updated.gear.homePossessions || ''}, 가문 피의 원한 (Feud)`;
        } else if (actualRoll === 18) {
          if (familyEventChoice === 'crit') {
            checkSkill(updated, 'battle');
            checkTrait(updated, 'honor');
            checkTrait(updated, 'loveFamily');
            checkTrait(updated, 'standingFamily');
          } else if (familyEventChoice === 'success') {
            checkTrait(updated, 'loveFamily');
          } else if (familyEventChoice === 'fumble') {
            updated.passions.loveFamily = Math.max(0, (updated.passions.loveFamily || 15) - 2);
            updated.standings.family = Math.max(0, (updated.standings.family || 16) - 2);
          }
        } else if (actualRoll === 19) {
          updated.gear.gloryThisGame = (updated.gear.gloryThisGame || 0) + 10;
          checkTrait(updated, 'honor');
          checkTrait(updated, 'loveFamily');
        }
      }

      if (updated.campaign) {
        updated.campaign.unresolvedChildbirthBlocked = false;
      }
      updated.campaign = markWinterStep(updated, 'familyEvent');
      return updated;
      }, '겨울 가문 단계 정산');
      return result.character;
    });

    let msg = `[가문 정산]: `;
    if (marriageResult) msg += `결혼 성공 (${marriageResult.rank}, dowry £${marriageResult.dowry}, +${marriageResult.glory} Glory) `;
    if (childbirthResult) msg += `/ 출산 d20 [${childbirthRoll}] (대상: ${childbirthMother === 'wife' ? '배우자' : '연인/첩'}) -> ${childbirthResult} `;
    if (familyEventResult) {
      let extra = '';
      if (familyEventRoll === 7 || familyEventRoll === 14) extra = `(비용 £${familyEventD6Roll})`;
      else if (familyEventChoice) extra = `(선택/판정: ${familyEventChoice})`;
      msg += `/ 가문사건 d20 [${familyEventRoll}] -> ${familyEventResult} ${extra}`;
    }

    addLog(msg);
    setFamilyApplied(true);
  };

  // ══════════════════════════════════════════════════
  // STEP 7: EXPERIENCE LOGIC
  // ══════════════════════════════════════════════════
  const runExperiencePhase = () => {
    if (experienceApplied) return;
    const eventId = `winter:experience:${currentYear}`;
    if (hasAppliedEvent(character, eventId)) {
      alert("올해 경험 판정은 이미 반영되었습니다.");
      return;
    }

    const checkedSkills = Object.keys(character.skillsChecked).filter(k => character.skillsChecked[k]);
    const checkedPassions = Object.keys(character.passionsChecked).filter(k => character.passionsChecked[k]);
    const checkedTraits = Object.keys(character.traitsChecked || {}).filter(k => character.traitsChecked[k]);

    // Auto-check skills & passions with value >= 20 as per rulebook
    const allCheckedSkills = new Set([
      ...checkedSkills,
      ...Object.keys(character.skills).filter(k => (character.skills[k] || 0) >= 20)
    ]);
    const allCheckedPassions = new Set([
      ...checkedPassions,
      ...Object.keys(character.passions).filter(k => (character.passions[k] || 0) >= 20)
    ]);

    const logs = [];
    const updatedSkills = { ...character.skills };
    const updatedPassions = { ...character.passions };
    const updatedTraits = { ...character.traits };

    // Roll for skills
    allCheckedSkills.forEach(key => {
      const val = character.skills[key] || 0;
      const d20 = Math.floor(Math.random() * 20) + 1;
      const target = Math.min(20, val);
      const success = d20 >= target;
      if (success) {
        updatedSkills[key] = val + 1;
        logs.push(`[기술 ${key} 성장]: d20 [${d20}] vs [${target}]. 성공! → ${val + 1} 🎉`);
      } else {
        logs.push(`[기술 ${key} 유지]: d20 [${d20}] vs [${target}]. 실패.`);
      }
    });

    // Roll for passions
    allCheckedPassions.forEach(key => {
      const val = character.passions[key] || 0;
      const d20 = Math.floor(Math.random() * 20) + 1;
      const target = Math.min(20, val);
      const success = d20 >= target;
      if (success) {
        updatedPassions[key] = val + 1;
        logs.push(`[열망 ${key} 성장]: d20 [${d20}] vs [${target}]. 성공! → ${val + 1} 🎉`);
      } else {
        logs.push(`[열망 ${key} 유지]: d20 [${d20}] vs [${target}]. 실패.`);
      }
    });

    const oppositeMap = {
      chaste: "lustful", energetic: "lazy", forgiving: "vengeful",
      generous: "selfish", honest: "deceitful", just: "arbitrary",
      merciful: "cruel", modest: "proud", pious: "worldly",
      prudent: "reckless", temperate: "indulgent", trusting: "suspicious",
      valorous: "cowardly"
    };
    checkedTraits.forEach(key => {
      const val = character.traits[key] || 0;
      const d20 = Math.floor(Math.random() * 20) + 1;
      const success = d20 >= val || d20 === 20;
      // Traits cannot exceed 20 because they are paired
      if (success && val < 20) {
        updatedTraits[key] = val + 1;
        if (oppositeMap[key]) updatedTraits[oppositeMap[key]] = 20 - updatedTraits[key];
        logs.push(`[성향 ${key} 성장]: d20 [${d20}] vs [${val}]. 성공! → ${val + 1} 🎉`);
      } else {
        logs.push(`[성향 ${key} 유지]: d20 [${d20}] vs [${val}]. 실패.`);
      }
    });

    setCharacter(prev => {
      const updated = {
        ...prev,
        skills: updatedSkills,
        skillsChecked: {},
        traits: updatedTraits,
        traitsChecked: {},
        passions: updatedPassions,
        passionsChecked: {}
      };
      updated.campaign = markAppliedEvent(updated, eventId, '겨울 경험 판정');
      updated.campaign = markWinterStep(updated, 'experience');
      return updated;
    });

    setExperienceLogs(logs);
    if (logs.length > 0) {
      logs.forEach(l => addLog(l));
    } else {
      addLog(`[경험 판정]: 체크된 기술/열망이 없습니다.`);
    }

    setExperienceApplied(true);
  };

  // ══════════════════════════════════════════════════
  // STEP 8: TRAINING & PRACTICE LOGIC
  // ══════════════════════════════════════════════════
  const applyTraining = () => {
    if (trainingApplied) return;
    const eventId = `winter:training:${currentYear}`;
    if (hasAppliedEvent(character, eventId)) {
      alert("올해 훈련은 이미 반영되었습니다.");
      return;
    }

    if (trainingOption === 'optionA') {
      if (selectedAttribute) {
        const age = character.personal.age || 0;
        if (age >= 30) {
          alert("나이가 30세 이상입니다! 룰북 규정에 따라 30세 이후에는 훈련으로 기본 능력치를 상승시킬 수 없습니다.");
          return;
        }
        if (selectedAttribute === 'siz' && age >= 21) {
          alert("나이가 21세 이상입니다! 룰북 규정에 따라 체구(SIZ)는 21세 이후로 증가시킬 수 없습니다.");
          return;
        }
        setCharacter(prev => {
          const updated = {
            ...prev,
            attributes: { ...prev.attributes, [selectedAttribute]: Math.min(20, (prev.attributes[selectedAttribute] || 0) + 1) }
          };
          updated.campaign = markWinterStep(updated, 'training');
          updated.campaign = markAppliedEvent(updated, eventId, '겨울 훈련');
          return updated;
        });
        addLog(`[자유 단련]: 능력치 [${selectedAttribute.toUpperCase()}] +1 영구 증가!`);
      } else if (selectedTrait) {
        if ((character.traits[selectedTrait] || 0) >= 15) {
          alert("성향은 자유 단련(Option A)으로 15를 초과하여 올릴 수 없습니다!");
          return;
        }
        // opposite trait adjusts automatically
        const oppositeMap = {
          chaste: "lustful", energetic: "lazy", forgiving: "vengeful",
          generous: "selfish", honest: "deceitful", just: "arbitrary",
          merciful: "cruel", modest: "proud", pious: "worldly",
          prudent: "reckless", temperate: "indulgent", trusting: "suspicious",
          valorous: "cowardly"
        };
        const opp = oppositeMap[selectedTrait];
        setCharacter(prev => {
          const nextTraits = { ...prev.traits };
          const newVal = Math.min(15, (prev.traits[selectedTrait] || 0) + 1);
          nextTraits[selectedTrait] = newVal;
          nextTraits[opp] = 20 - newVal;
          const updated = {
            ...prev,
            traits: nextTraits
          };
          updated.campaign = markWinterStep(updated, 'training');
          updated.campaign = markAppliedEvent(updated, eventId, '겨울 훈련');
          return updated;
        });
        addLog(`[자유 단련]: 성향 [${selectedTrait}] +1 증가!`);
      } else if (selectedPassion) {
        if ((character.passions[selectedPassion] || 0) >= 15) {
          alert("열망은 자유 단련(Option A)으로 15를 초과하여 올릴 수 없습니다!");
          return;
        }
        setCharacter(prev => {
          const updated = {
            ...prev,
            passions: { ...prev.passions, [selectedPassion]: Math.min(15, (prev.passions[selectedPassion] || 0) + 1) }
          };
          updated.campaign = markWinterStep(updated, 'training');
          updated.campaign = markAppliedEvent(updated, eventId, '겨울 훈련');
          return updated;
        });
        addLog(`[자유 단련]: 열망 [${selectedPassion}] +1 증가!`);
      } else if (selectedStanding) {
        if ((character.standings[selectedStanding] || 0) >= 15) {
          alert("사회적 명망은 자유 단련(Option A)으로 15를 초과하여 올릴 수 없습니다!");
          return;
        }
        setCharacter(prev => {
          const updated = {
            ...prev,
            standings: { ...prev.standings, [selectedStanding]: Math.min(15, (prev.standings[selectedStanding] || 0) + 1) }
          };
          updated.campaign = markWinterStep(updated, 'training');
          updated.campaign = markAppliedEvent(updated, eventId, '겨울 훈련');
          return updated;
        });
        addLog(`[자유 단련]: 명망 [${selectedStanding}] +1 증가!`);
      }
    }
    else if (trainingOption === 'optionB') {
      const keys = Object.values(selectedSkills).filter(k => k);
      if (keys.length !== 4) {
        alert("Option B는 정확히 4개의 기술을 선택해야 합니다.");
        return;
      }

      const uniqueKeys = new Set(keys);
      if (uniqueKeys.size !== keys.length) {
        alert("동일한 기술을 중복해서 단련할 수 없습니다! 각각 다른 기술을 선택해 주십시오.");
        return;
      }

      const activeFC = character.family?.characteristic;
      for (const k of keys) {
        const fcBonus = (activeFC?.applied && activeFC?.appliedBonus?.skills?.[k]) || 0;
        const rawSkillVal = (character.skills[k] || 0) - fcBonus;
        if (rawSkillVal <= 0) {
          alert(`[${k}] 기술의 순수 수치가 0이거나 습득하지 않은 상태입니다. 겨울 정산(Option B)으로 0인 기술을 새로 단련할 수 없습니다.`);
          return;
        }
        if (rawSkillVal >= 15) {
          alert(`[${k}] 기술의 순수 수치가 이미 15 이상입니다. Option B는 15 미만인 기술만 단련할 수 있습니다.`);
          return;
        }
      }

      setCharacter(prev => {
        const skills = { ...prev.skills };
        keys.forEach(k => {
          skills[k] = (skills[k] || 0) + 1;
        });
        const updated = { ...prev, skills };
        updated.campaign = markWinterStep(updated, 'training');
        updated.campaign = markAppliedEvent(updated, eventId, '겨울 훈련');
        return updated;
      });
      addLog(`[자유 단련]: 4개 기술 훈련 (+1 상승, 한계 15) 적용 완료!`);
    }
    else if (trainingOption === 'optionC') {
      if (selectedHighSkill && (character.skills[selectedHighSkill] >= 15)) {
        setCharacter(prev => {
          const updated = {
            ...prev,
            skills: { ...prev.skills, [selectedHighSkill]: Math.min(20, (prev.skills[selectedHighSkill] || 0) + 1) }
          };
          updated.campaign = markWinterStep(updated, 'training');
          updated.campaign = markAppliedEvent(updated, eventId, '겨울 훈련');
          return updated;
        });
        addLog(`[자유 단련]: 상급 기술 [${selectedHighSkill}] +1 돌파 상승! (상한 20)`);
      } else {
        alert("선택한 기술의 수치가 15 미만입니다! 옵션 C는 수치 15 이상인 기술만 단련할 수 있습니다.");
        return;
      }
    }

    setTrainingApplied(true);
  };

  // ══════════════════════════════════════════════════
  // STEP 9: COMPUTE ANNUAL GLORY
  // ══════════════════════════════════════════════════
  const computeGlory = () => {
    // 1. Manor: +6 glory per manor
    const hasEstate = Boolean(
      character.family?.hasEstate ||
      String(character.gear?.homePossessions || '').includes('장원')
    );
    const manorsCount = character.family?.manors !== undefined ? character.family.manors : (hasEstate ? 1 : 0);
    let annual = manorsCount * 6;

    // 2. Chivalrous Active: +100
    const chivalrousTraitsTotal =
      (character?.traits?.energetic || 0) + (character?.traits?.generous || 0) +
      (character?.traits?.just || 0) + (character?.traits?.merciful || 0) +
      (character?.traits?.modest || 0) + (character?.traits?.valorous || 0);
    const honorVal = parseInt(character?.passions?.honor) || 0;
    const isChivalrousActive = chivalrousTraitsTotal >= 90 && honorVal >= 16;
    if (isChivalrousActive) annual += 100;

    // 3. Religious Active: +100
    const religiousTraitsTotal =
      (character?.traits?.chaste || 0) + (character?.traits?.forgiving || 0) +
      (character?.traits?.merciful || 0) + (character?.traits?.modest || 0) +
      (character?.traits?.temperate || 0) + (character?.traits?.trusting || 0);
    const loveGodVal = parseInt(character?.passions?.loveGod) || 0;
    const isReligiousActive = religiousTraitsTotal >= 90 && loveGodVal >= 16;
    if (isReligiousActive) annual += 100;

    // 4. Romantic Active: +100
    const romanceVal = character?.skills?.romance || 0;
    const otherCourtlySkillsOver10 = Object.keys(character.skills)
      .filter(k => ["courtesy", "dancing", "eloquence", "falconry", "gaming", "heraldry", "intrigue", "playInstruments", "readingWriting", "singing"].includes(k))
      .filter(k => (character.skills[k] || 0) >= 10)
      .length;
    const hasRequiredCourtlySkills = romanceVal >= 10 && otherCourtlySkillsOver10 >= 4;
    const amorVal = parseInt(character?.passions?.amor) || 0;
    const isRomanticActive = (character?.traits?.forgiving || 0) + (character?.traits?.generous || 0) +
      (character?.traits?.honest || 0) + (character?.traits?.just || 0) +
      (character?.traits?.prudent || 0) + (character?.traits?.trusting || 0) >= 90 && amorVal >= 16 && hasRequiredCourtlySkills;
    if (isRomanticActive) annual += 100;

    // 5. Passive Glory: stats > 15
    let passiveGlory = 0;
    Object.keys(character.skills).forEach(k => { if (character.skills[k] > 15) passiveGlory += (character.skills[k] - 15); });
    Object.keys(character.traits).forEach(k => { if (character.traits[k] > 15) passiveGlory += (character.traits[k] - 15); });
    Object.keys(character.passions).forEach(k => { if (character.passions[k] > 15) passiveGlory += (character.passions[k] - 15); });
    Object.keys(character.standings || {}).forEach(k => { if (character.standings[k] > 15) passiveGlory += (character.standings[k] - 15); });

    // 6. Maintenance Glory
    const maintenanceLevel = character.personal?.maintenance || 'ordinary';
    let maintGlory = 0;
    if (maintenanceLevel === 'rich') maintGlory = 10;
    else if (maintenanceLevel === 'superlative') maintGlory = 15;

    const totalCalculated = annual + passiveGlory + maintGlory;
    setCalculatedAnnualGlory(totalCalculated);
    setGloryApplied(false);
  };

  const applyGlory = () => {
    const eventId = `winter:annual_glory:${currentYear}`;
    if (gloryApplied || hasAppliedEvent(character, eventId)) {
      alert("올해 영예 정산은 이미 반영되었습니다.");
      return;
    }
    if (calculatedAnnualGlory === null) {
      alert("먼저 연간 영예를 계산해 주세요.");
      return;
    }

    const previousTotal = character.gear.gloryTotal || 0;
    const addedGlory = calculatedAnnualGlory + (character.gear.gloryThisGame || 0);
    const newTotal = previousTotal + addedGlory;

    // Calculate Glory Bonus points (1 point per 1,000 threshold crossed)
    const prevThreshold = Math.floor(previousTotal / 1000);
    const newThreshold = Math.floor(newTotal / 1000);
    const bonusEarned = Math.max(0, newThreshold - prevThreshold);

    setCharacter(prev => {
      const updated = {
        ...prev,
        gear: {
          ...prev.gear,
          gloryTotal: newTotal,
          gloryThisGame: 0
        }
      };
      updated.campaign = markWinterStep(updated, 'annualGlory');
      updated.campaign = markAppliedEvent(updated, eventId, `연간 영예 +${addedGlory}`);
      updated.campaign.winter = {
        ...updated.campaign.winter,
        gloryBonusPoints: bonusEarned,
        bonusSpent: 0
      };
      return updated;
    });

    const hasEstate = Boolean(
      character.family?.hasEstate ||
      String(character.gear?.homePossessions || '').includes('장원')
    );
    const manorsCount = character.family?.manors !== undefined ? character.family.manors : (hasEstate ? 1 : 0);
    const maintenanceLevel = character.personal?.maintenance || 'ordinary';
    let maintGlory = 0;
    if (maintenanceLevel === 'rich') maintGlory = 10;
    else if (maintenanceLevel === 'superlative') maintGlory = 15;

    addLog(`[영예 정산]: 연간정산 +${calculatedAnnualGlory} Glory (장원 ${manorsCount}개: ${manorsCount * 6}점 + 유지비 보너스: ${maintGlory}점 + 활성 이상 보너스) 합산 완료. 누적 영예: ${newTotal}`);
    if (bonusEarned > 0) {
      addLog(`[축하합니다!]: 영예 1,000단위 돌파! 자유 능력치 +1 보너스 점수 [${bonusEarned}]점을 획득했습니다! (Step 10 위젯 사용)`);
      setGloryBonusPoints(bonusEarned);
      setBonusSpent(0);
    }
    setGloryApplied(true);
  };

  const spendGloryBonus = (statType, key) => {
    if (bonusSpent >= gloryBonusPoints) {
      alert("부여받은 돌파 보너스 점수를 모두 소모했습니다!");
      return;
    }

    setCharacter(prev => {
      const nextSkills = { ...prev.skills };
      const nextAttributes = { ...prev.attributes };
      const nextPassions = { ...prev.passions };
      const nextStandings = { ...prev.standings };
      const nextTraits = { ...prev.traits };

      if (statType === 'attribute') {
        nextAttributes[key] = Math.min(20, (prev.attributes[key] || 0) + 1);
      } else if (statType === 'skill') {
        nextSkills[key] = Math.min(20, (prev.skills[key] || 0) + 1);
      } else if (statType === 'passion') {
        nextPassions[key] = Math.min(20, (prev.passions[key] || 0) + 1);
      } else if (statType === 'standing') {
        nextStandings[key] = Math.min(20, (prev.standings[key] || 0) + 1);
      } else if (statType === 'trait') {
        const oppositeMap = {
          chaste: "lustful", energetic: "lazy", forgiving: "vengeful",
          generous: "selfish", honest: "deceitful", just: "arbitrary",
          merciful: "cruel", modest: "proud", pious: "worldly",
          prudent: "reckless", temperate: "indulgent", trusting: "suspicious",
          valorous: "cowardly"
        };
        const opp = oppositeMap[key];
        nextTraits[key] = Math.min(20, (prev.traits[key] || 0) + 1);
        nextTraits[opp] = Math.max(0, (prev.traits[opp] || 0) - 1);
      }

      const updated = {
        ...prev,
        skills: nextSkills,
        attributes: nextAttributes,
        passions: nextPassions,
        standings: nextStandings,
        traits: nextTraits
      };
      updated.campaign = {
        ...(updated.campaign || {}),
        winter: {
          ...(updated.campaign?.winter || {}),
          gloryBonusPoints,
          bonusSpent: bonusSpent + 1
        }
      };
      return updated;
    });

    addLog(`[영예 돌파 보너스 사용]: ${key} +1 영구 증가!`);
    setBonusSpent(b => b + 1);
  };

  const endWinterPhase = () => {
    if (character.campaign?.unresolvedChildbirthBlocked) {
      alert("배우자가 없어 해결되지 않은 출산 정산이 있습니다. 연인/첩을 고르거나 건너뛰기하여 해결해 주세요.");
      return;
    }
    const requiredSteps = [
      ['aging', '노화'],
      ['harvest', '수확'],
      ['survival', '종자/군마 생존'],
      ['personalEvent', '개인 사건'],
      ['familyEvent', '가문 사건'],
      ['experience', '경험'],
      ['training', '훈련'],
      ['annualGlory', '연간 영예'],
      ['maintenance', '생활 유지비']
    ];
    const winterSteps = character.campaign?.winter?.steps || {};
    const unresolvedRequiredEvents = Object.entries(character.campaign?.winter?.unresolved || {})
      .filter(([, event]) => event?.required !== false);
    const maintenanceResolved = hasAppliedEvent(character, `economy:maintenance:${currentYear}`);
    const unresolved = requiredSteps.filter(([key]) => {
      if (key === 'maintenance' && maintenanceResolved) return false;
      return !['resolved', 'skipped'].includes(winterSteps[key]);
    });
    let skippedNow = [];
    if (unresolved.length > 0 || unresolvedRequiredEvents.length > 0) {
      const names = [
        ...unresolved.map(([, label]) => label),
        ...unresolvedRequiredEvents.map(([key, event]) => event?.label || key)
      ].join(', ');
      const confirmSkip = window.confirm(`아직 해결되지 않은 겨울 단계가 있습니다: ${names}\n명시적으로 건너뛰고 겨울을 종료하시겠습니까?`);
      if (!confirmSkip) return;
      skippedNow = unresolved.map(([key]) => key);
    }

    // Check if there are unspent Glory Bonus points
    if (gloryBonusPoints > 0 && bonusSpent < gloryBonusPoints) {
      const confirmEnd = window.confirm(`아직 사용하지 않은 돌파 보너스 점수가 [ ${gloryBonusPoints - bonusSpent} ]점 있습니다. 정산을 완료하면 이 보너스 점수는 사라집니다. 그래도 정산을 끝내시겠습니까?`);
      if (!confirmEnd) return;
    }

    const endingYear = character.personal?.campaignYear || 768;

    setCharacter(prev => {
      const updated = JSON.parse(JSON.stringify(prev));

      // 1. Increment player's age and campaign year
      updated.personal.age = (prev.personal?.age || 0) + 1;
      updated.personal.campaignYear = endingYear + 1;

      // 2. Increment Squire's age and replace if age >= 21
      let squireStatusMsg = '';
      if (updated.squire) {
        const nextSquireAge = (prev.squire?.age || 14) + 1;
        if (nextSquireAge >= 21) {
          const randMale = maleNames[Math.floor(Math.random() * maleNames.length)] || { en: "Pierre", ko: "피에르" };
          updated.squire = {
            name: `${randMale.ko} (Squire ${randMale.en})`,
            age: 14,
            siz: 10,
            dex: 10,
            str: 10,
            con: 10,
            firstAid: 8,
            horsemanship: 9,
            weapon: 8
          };
          squireStatusMsg = `• [종자 독립] 기존 종자가 21세가 되어 독립하고, 새 14세 종자 [${updated.squire.name}]를 영입했습니다.`;
        } else {
          updated.squire.age = nextSquireAge;
          squireStatusMsg = `• [종자 성장] 종자 ${prev.squire?.name || '종자'}의 나이가 ${prev.squire?.age || 14}세 -> ${nextSquireAge}세로 성장했습니다.`;
        }
      }

      // 3. Compile Winter Logs into Chronology Journal
      const persistedLogs = Array.isArray(prev.campaign?.winter?.logs) ? prev.campaign.winter.logs : [];
      const skipLogs = skippedNow.map(step => `[겨울 단계 스킵]: ${step} 단계가 사용자 확인으로 건너뛰어졌습니다.`);
      const reverseLogs = [...persistedLogs, ...skipLogs];
      const logsCombined = [...reverseLogs.map(line => `• ${line}`)];
      if (squireStatusMsg) {
        logsCombined.push(squireStatusMsg);
      }

      if (logsCombined.length > 0) {
        const winterSummary = `[${endingYear}년 겨울 정산 일지]\n` + logsCombined.join('\n');

        if (!updated.journal) updated.journal = {};
        const existingEntry = prev.journal?.[endingYear]?.text || '';
        const combinedText = existingEntry
          ? `${existingEntry}\n\n${winterSummary}`
          : winterSummary;

        updated.journal[endingYear] = {
          text: combinedText,
          updatedAt: new Date().toISOString()
        };
      }

      const nextSteps = {
        aging: 'pending',
        harvest: 'pending',
        survival: 'pending',
        personalEvent: 'pending',
        familyEvent: 'pending',
        experience: 'pending',
        training: 'pending',
        annualGlory: 'pending',
        maintenance: 'pending'
      };
      skippedNow.forEach(step => {
        if (!updated.campaign) updated.campaign = {};
        if (!updated.campaign.winter) updated.campaign.winter = {};
        updated.campaign.winter.steps = {
          ...(updated.campaign.winter.steps || {}),
          [step]: 'skipped'
        };
      });
      updated.campaign = {
        ...(updated.campaign || {}),
        schemaVersion: 2,
        appliedEvents: updated.campaign?.appliedEvents || {},
        winter: {
        year: endingYear + 1,
          steps: nextSteps,
          logs: [],
          unresolved: {},
          gloryBonusPoints: 0,
          bonusSpent: 0,
          skippedWithConfirmation: {}
        }
      };

      return updated;
    });

    // Check if squire was replaced to output a log
    if (character.squire?.age >= 20) {
      alert(`[종자 자립 및 영입]: 기존 종자가 21세가 되어 성인 기사로 독립했습니다! 새로운 14세 기망 종자가 가신단에 배치되었습니다.`);
    }

    addLog(`⚔️ 겨울 정산 완료: 기사의 나이 +1세! 따스한 햇빛과 함께 새 봄이 찾아옵니다! ⚔️`);
    setWinterStep(1);
    setActiveSubTab('tree');

    // reset states
    setAgingD20(null); setHarvestRoll(null); setSquireSurvivalRoll(null);
    setPersonalEventRoll(null); setMarriageRoll(null); setChildbirthRoll(null);
    setFamilyEventRoll(null); setExperienceLogs([]); setTrainingApplied(false);
    setCalculatedAnnualGlory(null); setGloryBonusPoints(0); setBonusSpent(0);
    // reset training options
    setTrainingOption('optionA');
    setSelectedAttribute('');
    setSelectedTrait('');
    setSelectedPassion('');
    setSelectedStanding('');
    setSelectedHighSkill('');
    setSelectedSkills({ adventure: '', courtly: '', combat: '', free: '' });
  };

  const resetWinter = () => {
    setWinterStep(1);
    setLogMessages([]);
    setAgingD20(null); setHarvestRoll(null); setSquireSurvivalRoll(null);
    setPersonalEventRoll(null); setMarriageRoll(null); setChildbirthRoll(null);
    setFamilyEventRoll(null); setExperienceLogs([]); setTrainingApplied(false);
    setCalculatedAnnualGlory(null); setGloryBonusPoints(0); setBonusSpent(0);
    // reset training options
    setTrainingOption('optionA');
    setSelectedAttribute('');
    setSelectedTrait('');
    setSelectedPassion('');
    setSelectedStanding('');
    setSelectedHighSkill('');
    setSelectedSkills({ adventure: '', courtly: '', combat: '', free: '' });
  };

  // Lists for selection
  const attributeKeys = ['siz', 'dex', 'str', 'con', 'app'];
  const traitKeys = ['chaste', 'energetic', 'forgiving', 'generous', 'honest', 'just', 'merciful', 'modest', 'pious', 'prudent', 'temperate', 'trusting', 'valorous'];
  const passionKeys = Object.keys(character.passions);
  const standingKeys = Object.keys(character.standings || {});

  return (
    <div className="cs-page view-animate">
      <h2 className="cs-page-title">
        <Shield size={20} style={{ color: 'var(--color-gold-dark)' }} />
        가문 계보 및 겨울 정산부
      </h2>

      <div className="tutorial-banner">
        <div>
          <p style={{ margin: 0 }}>
            1년 주기의 모험 정리는 기사의 성장과 다음 해의 경제를 결정합니다. 연대기 작성이 다음 세대를 향해 나아갑니다.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="sub-tab-navigation" style={{ margin: '12px 0 16px 0' }}>
        <button
          className={`sub-tab-btn ${activeSubTab === 'tree' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('tree')}
        >
          <Shield size={14} /> 가문의 영예와 연대기 계보 (Lineage)
        </button>
        <button
          className={`sub-tab-btn ${activeSubTab === 'winter' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('winter')}
        >
          <RotateCcw size={14} /> 겨울 정산과 역사 서술 (Winter Phase)
        </button>
      </div>

      {/* SUB TAB: FAMILY TREE */}
      {activeSubTab === 'tree' && (
        <FamilyTree character={character} setCharacter={setCharacter} />
      )}

      {/* SUB TAB: 10-STEP WINTER PHASE WIZARD */}
      {activeSubTab === 'winter' && (
        <div className="view-animate">

          {/* Main Step Panel */}
          <section className="cs-section">
            <div className="sheet-ribbon" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>단계 {winterStep}: {[
                "1단계: 솔로 시나리오",
                "2단계: 노화 판정 (Aging)",
                "3단계: 영지 수확 및 경제 정산",
                "4단계: 동료 및 군마 생존 판정",
                "5단계: 개인 돌발 사건 (Personal Events)",
                "6단계: 가문 정산 (결혼/출산/가문사건)",
                "7단계: 경험 판정 (Experience)",
                "8단계: 자유 단련 및 수련 (Training)",
                "9단계: 영예 계산 및 정산 (Glory)",
                "10단계: 영예 돌파 보너스 및 봄 맞이"
              ][winterStep - 1]}</h3>
              <button className="btn-medieval" onClick={resetWinter} style={{ fontSize: '0.78rem', padding: '2px 6px', background: 'none' }}>
                <RotateCcw size={12} /> 초기화
              </button>
            </div>

            <div className="cs-section-inner" style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

              {/* CONTENT FOR EACH STEP */}
              <div style={{ marginBottom: '20px' }}>

                {/* STEP 1 */}
                {winterStep === 1 && (
                  <div>
                    <p style={{ marginBottom: '10px' }}>여름 모험 세션에 참여하지 못했거나 추가 성장이 필요하다면, 주사위 판정으로 1대1 솔로 시나리오를 전개할 수 있습니다.</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-grey)' }}>팁: 신설된 <strong>제국 백과사전(Lore)</strong> 탭에서 15가지 솔로 시나리오의 흐름과 룰을 확인해 보세요.</p>
                    <div style={{ marginTop: '16px', padding: '10px', border: '1px dashed var(--color-gold)', background: 'rgba(179,143,67,0.03)', textAlign: 'center' }}>
                      <Compass size={24} style={{ margin: '0 auto 8px', color: 'var(--color-gold)' }} />
                      <h4 style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>솔로 시나리오 진행을 마쳤습니까?</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', marginTop: '4px' }}>진행 완료 시 다음 단계로 진행하세요. 만약 진행하지 않았다면 무시하고 넘어가시면 됩니다.</p>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {winterStep === 2 && (
                  <div>
                    {/* 📖 룰북 노화 판정 레퍼런스 */}
                    <div style={{ marginBottom: '16px', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: 'rgba(201,168,76,0.06)', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} onClick={() => setShowRefAging(!showRefAging)}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          📖 룰북 노화 판정 레퍼런스 테이블 보기
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)' }}>{showRefAging ? '접기 ▲' : '펼치기 ▼'}</span>
                      </div>
                      {showRefAging && (
                        <div style={{ padding: '10px', fontSize: '0.74rem', borderTop: '1px solid rgba(201,168,76,0.15)', backgroundColor: '#fff' }}>
                          <p style={{ margin: '0 0 6px 0', color: 'var(--color-ink-light)' }}>
                            * 기사의 나이가 <strong>30세 이상</strong>일 때 매 겨울마다 d20을 굴려 노화 여부를 판정합니다. (30세 미만은 무조건 생략)
                          </p>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                <th style={{ padding: '4px' }}>d20 결과</th>
                                <th style={{ padding: '4px' }}>감소 판정 주사위 횟수 (1d6)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold', color: 'var(--color-crimson)' }}>1</td>
                                <td style={{ padding: '4px' }}><strong>5회</strong> 굴림</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold' }}>2 ~ 3</td>
                                <td style={{ padding: '4px' }}><strong>4회</strong> 굴림</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold' }}>4 ~ 6</td>
                                <td style={{ padding: '4px' }}><strong>3회</strong> 굴림</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold' }}>7 ~ 10</td>
                                <td style={{ padding: '4px' }}><strong>2회</strong> 굴림</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold' }}>11 ~ 15</td>
                                <td style={{ padding: '4px' }}><strong>1회</strong> 굴림</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold', color: 'green' }}>16 ~ 20</td>
                                <td style={{ padding: '4px' }}><strong>0회</strong> (스탯 하락 없음)</td>
                              </tr>
                            </tbody>
                          </table>
                          <p style={{ margin: '6px 0 0 0', fontStyle: 'italic', color: 'var(--color-grey)', lineHeight: '1.3' }}>
                            ※ 감소 판정 1d6 결과에 따라 해당 능력치 영구 -1 하락:<br />
                            1 = SIZ, 2 = DEX, 3 = STR, 4 = CON, 5 = APP, 6 = 하락 없음 (피해 무효)
                          </p>
                        </div>
                      )}
                    </div>
                    <p style={{ marginBottom: '12px' }}>기사의 나이가 <strong>30세 이상</strong>이면 세월의 흐름에 따른 노화 판정 주사위를 굴립니다.</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ padding: '10px 14px', border: '1px solid var(--color-crimson)', background: 'rgba(153,34,34,0.03)' }}>
                        현재 기사의 나이: <strong style={{ fontSize: '1.2rem', color: 'var(--color-crimson)' }}>{character.personal.age}세</strong>
                      </div>

                      {!agingApplied ? (
                        <button className="btn-medieval btn-medieval-primary" onClick={rollAging}>
                          <Dices size={15} /> 노화 판정 굴리기 (d20)
                        </button>
                      ) : (
                        <div style={{ color: 'green', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={16} /> 적용 완료!
                        </div>
                      )}
                    </div>

                    {agingD20 && (
                      <div style={{ marginTop: '16px', border: '1px solid var(--color-gold-light)', padding: '12px', background: 'rgba(179,143,67,0.04)' }}>
                        <div>d20 결과: <strong>{agingD20}</strong> (30세 미만은 항상 패스)</div>
                        <div style={{ marginTop: '6px' }}>
                          영향받는 주요 속성 개수: <strong>{agingLosses.length}개</strong>
                          {agingLosses.length > 0 && (
                            <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                              {agingLosses.map((l, i) => (
                                <span key={i} style={{ padding: '2px 8px', border: '1px solid var(--color-danger)', fontSize: '0.8rem', background: '#fff', color: 'var(--color-danger)', fontWeight: 'bold' }}>
                                  {l === 'None' ? '피해없음' : `${l} -1`}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {!agingApplied && (
                          <button className="btn-medieval" onClick={applyAging} style={{ marginTop: '12px', justifyContent: 'center', width: '100%' }}>
                            노화 피해 시트에 영구 반영하기
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3 */}
                {winterStep === 3 && (
                  <div>
                    {/* 📖 룰북 영지 수확 및 경제 판정 레퍼런스 */}
                    <div style={{ marginBottom: '16px', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: 'rgba(201,168,76,0.06)', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} onClick={() => setShowRefHarvest(!showRefHarvest)}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          📖 룰북 영지 수확 및 경제 판정 레퍼런스 테이블 보기
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)' }}>{showRefHarvest ? '접기 ▲' : '펼치기 ▼'}</span>
                      </div>
                      {showRefHarvest && (
                        <div style={{ padding: '10px', fontSize: '0.74rem', borderTop: '1px solid rgba(201,168,76,0.15)', backgroundColor: '#fff' }}>
                          <p style={{ margin: '0 0 6px 0', color: 'var(--color-ink-light)' }}>
                            * 기사의 영지 관리(Stewardship) 기술 수치를 기준으로 d20을 굴려 세입 배율을 결정합니다.
                          </p>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                <th style={{ padding: '4px' }}>Stewardship 판정 결과</th>
                                <th style={{ padding: '4px' }}>세입 배율</th>
                                <th style={{ padding: '4px' }}>획득 세입 (£)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold', color: 'green' }}>대성공 (Critical) <span style={{ fontWeight: 'normal', fontSize: '0.7rem', color: 'var(--color-grey)' }}>(d20 결과가 1 또는 Stewardship 수치와 동일)</span></td>
                                <td style={{ padding: '4px' }}><strong>x1.5</strong></td>
                                <td style={{ padding: '4px' }}>£9</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold' }}>성공 (Success) <span style={{ fontWeight: 'normal', fontSize: '0.7rem', color: 'var(--color-grey)' }}>(d20 결과가 Stewardship 수치 미만)</span></td>
                                <td style={{ padding: '4px' }}><strong>x1.0</strong></td>
                                <td style={{ padding: '4px' }}>£6 (기본 수입)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold' }}>실패 (Failure) <span style={{ fontWeight: 'normal', fontSize: '0.7rem', color: 'var(--color-grey)' }}>(d20 결과가 Stewardship 수치 초과)</span></td>
                                <td style={{ padding: '4px' }}><strong>x0.75</strong></td>
                                <td style={{ padding: '4px' }}>£4 (반올림)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold', color: 'var(--color-crimson)' }}>대실패 (Fumble) <span style={{ fontWeight: 'normal', fontSize: '0.7rem', color: 'var(--color-grey)' }}>(d20 결과가 20)</span></td>
                                <td style={{ padding: '4px' }}><strong>x0.5</strong></td>
                                <td style={{ padding: '4px' }}>£3</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    <p style={{ marginBottom: '12px' }}>영지 관리(Stewardship) 판정을 통해 올해 대농장의 풍흉작과 세입 배율을 결정합니다.</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ padding: '10px 14px', border: '1px solid var(--color-gold)', background: 'rgba(179,143,67,0.02)' }}>
                        영지관리(Stewardship) 수치: <strong>{character.skills.stewardship || 3}</strong>
                      </div>

                      {!harvestApplied ? (
                        <button className="btn-medieval btn-medieval-primary" onClick={rollHarvest}>
                          <Dices size={15} /> 수확 판정 굴리기 (d20)
                        </button>
                      ) : (
                        <div style={{ color: 'green', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={16} /> 소지금 합산 완료!
                        </div>
                      )}
                    </div>

                    {harvestRoll && (
                      <div style={{ marginTop: '16px', border: '1px solid var(--color-gold-light)', padding: '12px', background: 'rgba(179,143,67,0.04)' }}>
                        <div>d20 결과: <strong>{harvestRoll}</strong> (Stewardship 이하 성공)</div>
                        <div style={{ marginTop: '6px', fontSize: '1rem' }}>
                          수확 결과 배율: <strong style={{ color: 'var(--color-crimson)' }}>x{harvestMult}</strong> (매출: <strong>£{harvestRevenue}</strong> 상당)
                        </div>
                        {!harvestApplied && (
                          <button className="btn-medieval" onClick={applyHarvest} style={{ marginTop: '12px', justifyContent: 'center', width: '100%' }}>
                            £{harvestRevenue} 소지금에 합산하기
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 4 */}
                {winterStep === 4 && (
                  <div>
                    {/* 📖 룰북 동료 및 군마 생존 판정 레퍼런스 */}
                    <div style={{ marginBottom: '16px', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: 'rgba(201,168,76,0.06)', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} onClick={() => setShowRefSurvival(!showRefSurvival)}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          📖 룰북 동료 및 군마 생존 판정 레퍼런스 테이블 보기
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)' }}>{showRefSurvival ? '접기 ▲' : '펼치기 ▼'}</span>
                      </div>
                      {showRefSurvival && (
                        <div style={{ padding: '10px', fontSize: '0.74rem', borderTop: '1px solid rgba(201,168,76,0.15)', backgroundColor: '#fff' }}>
                          <p style={{ margin: '0 0 6px 0', color: 'var(--color-ink-light)' }}>
                            * 동종 기사의 종자(Squire)와 군마(Warhorse)가 겨울을 건강히 넘겼는지 d20 생존 주사위를 굴립니다.
                          </p>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                <th style={{ padding: '4px' }}>d20 결과</th>
                                <th style={{ padding: '4px' }}>상태 및 게임 효과</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold', color: 'var(--color-crimson)' }}>1</td>
                                <td style={{ padding: '4px' }}><strong>사망 위험 (Die / Lost)</strong> - 사망하거나 가출/실종됩니다. 새로운 동료/말을 구해야 합니다.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold' }}>2</td>
                                <td style={{ padding: '4px' }}><strong>질병 (Illness / Injured)</strong> - 심한 병치레나 골절상을 겪어, 다음 해 생존 판정에 <strong>-5 보정</strong>을 적용받습니다.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold', color: 'green' }}>3 ~ 20</td>
                                <td style={{ padding: '4px' }}><strong>건강함 (Healthy)</strong> - 이상 없이 겨울을 보내고 다음 해 기사를 보조합니다.</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    <p style={{ marginBottom: '12px' }}>소중한 충복 종자(Squire) 및 아끼는 돌격 전투마(Charger)의 생존을 체크합니다.</p>

                    {!survivalApplied ? (
                      <button className="btn-medieval btn-medieval-primary" onClick={rollSurvival}>
                        <Dices size={15} /> 생존 판정 굴리기 (d20)
                      </button>
                    ) : (
                      <div style={{ color: 'green', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={16} /> 생존 결과 기록 완료!
                      </div>
                    )}

                    {squireSurvivalRoll && (
                      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ border: '1px solid var(--color-gold-light)', padding: '10px', background: squireStatus.includes('사망') ? 'rgba(153,34,34,0.04)' : '#fff' }}>
                          <strong>종자 (Squire) 생존:</strong>
                          <div style={{ marginTop: '4px' }}>d20 결과: <strong>{squireSurvivalRoll}</strong></div>
                          <div style={{ fontWeight: 'bold', color: squireStatus.includes('사망') ? 'var(--color-danger)' : 'green' }}>상태: {squireStatus}</div>
                        </div>
                        <div style={{ border: '1px solid var(--color-gold-light)', padding: '10px', background: horseStatus.includes('사망') ? 'rgba(153,34,34,0.04)' : '#fff' }}>
                          <strong>전투마 (warhorse) 생존:</strong>
                          <div style={{ marginTop: '4px' }}>d20 결과: <strong>{horseSurvivalRoll}</strong></div>
                          <div style={{ fontWeight: 'bold', color: horseStatus.includes('사망') ? 'var(--color-danger)' : 'green' }}>상태: {horseStatus}</div>
                        </div>
                      </div>
                    )}

                    {squireSurvivalRoll && !survivalApplied && (
                      <button className="btn-medieval" onClick={applySurvival} style={{ marginTop: '12px', justifyContent: 'center', width: '100%' }}>
                        생존 결과 기록실 인계하기
                      </button>
                    )}
                  </div>
                )}

                {/* STEP 5 */}
                {winterStep === 5 && (
                  <div>
                    {/* 📖 룰북 개인 돌발 사건 레퍼런스 */}
                    <div style={{ marginBottom: '16px', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: 'rgba(201,168,76,0.06)', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} onClick={() => setShowRefPersonal(!showRefPersonal)}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          📖 룰북 개인 돌발 사건 (Table 10-9) 레퍼런스 전체 보기
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)' }}>{showRefPersonal ? '접기 ▲' : '펼치기 ▼'}</span>
                      </div>
                      {showRefPersonal && (
                        <div style={{ padding: '10px', fontSize: '0.72rem', borderTop: '1px solid rgba(201,168,76,0.15)', backgroundColor: '#fff', maxHeight: '300px', overflowY: 'auto' }}>
                          <p style={{ margin: '0 0 8px 0', color: 'var(--color-ink-light)' }}>
                            * 겨울철 기사 한 명 한 명에게 닥쳐오는 성향, 열망 또는 지위 시험 이벤트 테이블입니다. (d20 굴림)
                          </p>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #ccc', backgroundColor: '#f9f9f9', fontWeight: 'bold' }}>
                                <th style={{ padding: '4px', width: '40px' }}>d20</th>
                                <th style={{ padding: '4px', width: '120px' }}>성향/지위 시험</th>
                                <th style={{ padding: '4px' }}>성공/실패 효과 요약</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(personalEventTable).map(([d, ev]) => (
                                <tr key={d} style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '4px', fontWeight: 'bold', textAlign: 'center' }}>{d}</td>
                                  <td style={{ padding: '4px', fontWeight: 'bold', color: 'var(--color-royal-blue)' }}>{ev.name}</td>
                                  <td style={{ padding: '4px', lineHeight: '1.25' }}>
                                    <span style={{ color: 'green' }}><strong>대성공:</strong> {ev.crit}</span><br />
                                    <span style={{ color: '#666' }}><strong>성공:</strong> {ev.succ}</span><br />
                                    <span style={{ color: 'var(--color-crimson)' }}><strong>실패:</strong> {ev.fail}</span><br />
                                    <span style={{ color: 'red' }}><strong>대실패:</strong> {ev.fumb}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    <p style={{ marginBottom: '12px' }}>룰북 <strong>Table 10-9</strong>에 수록된 기사들의 겨울철 20가지 성향 연동 돌발 사건을 판정합니다.</p>

                    {!personalEventApplied ? (
                      <button className="btn-medieval btn-medieval-primary" onClick={rollPersonalEvent}>
                        <Dices size={15} /> 개인 사건 굴리기 (Table 10-9 d20)
                      </button>
                    ) : (
                      <div style={{ color: 'green', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={16} /> 사건 해결 완료!
                      </div>
                    )}

                    {personalEventRoll && personalEventText && (
                      <div style={{ marginTop: '16px', border: '1px solid var(--color-gold)', padding: '14px', background: 'rgba(179,143,67,0.03)' }}>
                        <h4 style={{ color: 'var(--color-royal-blue)', fontWeight: 'bold', fontSize: '1.05rem', marginBottom: '8px' }}>
                          d20 [#{personalEventRoll}]: {personalEventText.name}
                        </h4>

                        <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                          <div><strong>대성공 (Critical):</strong> {personalEventText.crit}</div>
                          <div><strong>성공 (Success):</strong> {personalEventText.succ}</div>
                          <div><strong>실패 (Failure):</strong> {personalEventText.fail}</div>
                          <div><strong>대실패 (Fumble):</strong> {personalEventText.fumb}</div>
                        </div>

                        {personalEventNeedsManualResolution && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', color: 'var(--color-crimson)', fontSize: '0.82rem', fontWeight: 'bold' }}>
                            <AlertTriangle size={14} /> manual resolution required: 자동 반영되지 않는 세부 효과는 기록 후 수동으로 적용하세요.
                          </div>
                        )}

                        {!personalEventApplied && (
                          <button className="btn-medieval btn-medieval-primary" style={{ fontSize: '0.82rem', padding: '6px 12px' }} onClick={applyPersonalEvent}>
                            <Dices size={14} /> 테스트 굴려 결과 자동 반영
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 6 */}
                {winterStep === 6 && (
                  <div>
                    {/* 📖 룰북 가문 정산 레퍼런스 */}
                    <div style={{ marginBottom: '16px', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: 'rgba(201,168,76,0.06)', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} onClick={() => setShowRefFamily(!showRefFamily)}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          📖 룰북 가문 정산 (결혼, 출산, 가문 사건) 판정 테이블 보기
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)' }}>{showRefFamily ? '접기 ▲' : '펼치기 ▼'}</span>
                      </div>
                      {showRefFamily && (
                        <div style={{ padding: '12px', fontSize: '0.72rem', borderTop: '1px solid rgba(201,168,76,0.15)', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '350px', overflowY: 'auto' }}>
                          {/* Marriage Table */}
                          <div>
                            <h5 style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: 'var(--color-royal-blue)', borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>
                              1. Marriage Table (결혼 주사위 판정표)
                            </h5>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                              <thead>
                                <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                  <th style={{ padding: '3px 2px' }}>d20 결과</th>
                                  <th style={{ padding: '3px 2px' }}>배우자 신분</th>
                                  <th style={{ padding: '3px 2px' }}>지참금 (£)</th>
                                  <th style={{ padding: '3px 2px' }}>결혼 영예</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>1 ~ 5</td>
                                  <td style={{ padding: '3px 2px' }}>부유한 평민 상인의 딸</td>
                                  <td style={{ padding: '3px 2px' }}>9d3 (£9 ~ 27)</td>
                                  <td style={{ padding: '3px 2px' }}>0 Glory</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>6 ~ 8</td>
                                  <td style={{ padding: '3px 2px' }}>수습 종자의 딸</td>
                                  <td style={{ padding: '3px 2px' }}>£3</td>
                                  <td style={{ padding: '3px 2px' }}>10 Glory</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>9 ~ 10</td>
                                  <td style={{ padding: '3px 2px' }}>가신 기사의 딸</td>
                                  <td style={{ padding: '3px 2px' }}>1d6 (£1 ~ 6)</td>
                                  <td style={{ padding: '3px 2px' }}>50 Glory</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>11</td>
                                  <td style={{ padding: '3px 2px' }}>부유한 봉신기사의 맏딸</td>
                                  <td style={{ padding: '3px 2px' }}>1d3+6 (£7 ~ 9)</td>
                                  <td style={{ padding: '3px 2px' }}>100 Glory</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>12 ~ 20</td>
                                  <td style={{ padding: '3px 2px' }}>일반 봉신기사의 딸</td>
                                  <td style={{ padding: '3px 2px' }}>1d6 (£1 ~ 6)</td>
                                  <td style={{ padding: '3px 2px' }}>100 Glory</td>
</tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>21 ~ 25</td>
                                  <td style={{ padding: '3px 2px' }}>봉신기사 가문 여상속인 (Heir)</td>
                                  <td style={{ padding: '3px 2px' }}>£15 (장원 상속)</td>
                                  <td style={{ padding: '3px 2px' }}>100 Glory</td>
                                </tr>
                                <tr>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'green' }}>26 이상</td>
                                  <td style={{ padding: '3px 2px' }}>남작 가문의 막내딸</td>
                                  <td style={{ padding: '3px 2px' }}>£20</td>
                                  <td style={{ padding: '3px 2px' }}>250 Glory</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          {/* Childbirth Table */}
                          <div style={{ marginTop: '10px' }}>
                            <h5 style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: 'var(--color-royal-blue)', borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>
                              2. Childbirth Table (출산 주사위 판정표)
                            </h5>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                              <thead>
                                <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                  <th style={{ padding: '3px 2px' }}>d20 결과</th>
                                  <th style={{ padding: '3px 2px' }}>출산 결과 및 상태</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>1 ~ 10</td>
                                  <td style={{ padding: '3px 2px' }}>아무 일 없음 (임신하지 않았거나 출산 지연)</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'red' }}>11</td>
                                  <td style={{ padding: '3px 2px' }}><strong>비극:</strong> 산모(배우자)와 신생아 모두 출산 중 사망</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'var(--color-crimson)' }}>12</td>
                                  <td style={{ padding: '3px 2px' }}><strong>비극:</strong> 산모 사망, 아이는 생존 (성별 1d6: 홀수=아들, 짝수=딸)</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'green' }}>13 ~ 19</td>
                                  <td style={{ padding: '3px 2px' }}><strong>경사:</strong> 건강한 아이 출생 (성별 1d6: 홀수=아들, 짝수=딸)</td>
                                </tr>
                                <tr>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'green' }}>20</td>
                                  <td style={{ padding: '3px 2px' }}><strong>경사:</strong> 쌍둥이 탄생! (각 성별 1d6)</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          {/* Family Event Table */}
                          <div style={{ marginTop: '10px' }}>
                            <h5 style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: 'var(--color-royal-blue)', borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>
                              3. Family Event Table (가문 무작위 사건표)
                            </h5>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                              <thead>
                                <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                  <th style={{ padding: '3px 2px', width: '60px' }}>d20 결과</th>
                                  <th style={{ padding: '3px 2px' }}>사건 명칭 및 게임 효과</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'red' }}>1</td>
                                  <td style={{ padding: '3px 2px' }}><strong>가문의 비극:</strong> 친족 한 명이 마상시합 또는 혈투 끝에 급서</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'green' }}>2</td>
                                  <td style={{ padding: '3px 2px' }}><strong>가문의 영광:</strong> 친족이 주군 구출 후 사망. (가문 전원 +10 Glory)</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'green' }}>3</td>
                                  <td style={{ padding: '3px 2px' }}><strong>위대한 위업:</strong> 친족이 멧돼지 습격에서 주군 구출. (가문 전원 +5 Glory)</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>4</td>
                                  <td style={{ padding: '3px 2px' }}><strong>납치 사건:</strong> 친족이 강제 결혼 또는 몸값을 노린 도적단에 납치됨</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>5</td>
                                  <td style={{ padding: '3px 2px' }}><strong>실종 사건:</strong> 가문 일원 중 한 명이 사냥 또는 전쟁 중 행방불명됨</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'var(--color-royal-blue)' }}>8</td>
                                  <td style={{ padding: '3px 2px' }}><strong>뜻밖의 하사품:</strong> 선조의 고대 성물 발견 및 상속</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'var(--color-royal-blue)' }}>10</td>
                                  <td style={{ padding: '3px 2px' }}><strong>경사스런 혼사:</strong> 영예로운 가문 동맹 및 명문가 결혼. (가문 명예 +1)</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'green' }}>19</td>
                                  <td style={{ padding: '3px 2px' }}><strong>벼락 영전:</strong> 친족이 황실 궁정 백작이나 순찰사 임명. (가문 전원 +10 Glory)</td>
                                </tr>
                                <tr>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'var(--color-grey)' }}>기타 결과</td>
                                  <td style={{ padding: '3px 2px' }}><strong>가문 평온:</strong> 특별한 일 없이 무난하게 영지에서 생활함</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                    {(() => {
                      const playerId = character.personal?.id || 'player';
                      const hasLivingSpouse = Boolean(character.family?.members?.some(m => m.relation === '배우자' && m.spouseId === playerId && m.status === '생존'));
                      
                      return (
                        <div style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                          {character.campaign?.unresolvedChildbirthBlocked && (
                            <div style={{ color: 'var(--color-crimson)', border: '1px solid var(--color-crimson)', padding: '10px', background: '#ffe6e6', borderRadius: '4px', marginBottom: '12px', fontSize: '0.8rem' }}>
                              <strong>경고:</strong> 배우자가 없어 정산이 중단된 과거 출산 판정이 있습니다. 아래에서 연인/첩을 고르고 출산을 굴리거나 건너뛰기하여 해결해 주세요.
                              <button className="btn-medieval btn-medieval-secondary" style={{ marginLeft: '12px', padding: '3px 8px', fontSize: '0.75rem' }} onClick={() => {
                                setCharacter(prev => ({
                                  ...prev,
                                  campaign: {
                                    ...prev.campaign,
                                    unresolvedChildbirthBlocked: false
                                  }
                                }));
                              }}>정산 대기 해제 (강제 리셋)</button>
                            </div>
                          )}

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <div>
                              <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>결혼 굴림 보정치 (수정값):</label>
                              <input
                                type="number"
                                className="input-medieval"
                                value={marriageModifier}
                                onChange={(e) => setMarriageModifier(Number(e.target.value))}
                                style={{ width: '100%', padding: '6px' }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>출산 대상 선택:</label>
                              <select
                                className="input-medieval"
                                value={childbirthMother}
                                onChange={(e) => setChildbirthMother(e.target.value)}
                                style={{ width: '100%', padding: '6px' }}
                              >
                                <option value="wife" disabled={!hasLivingSpouse}>배우자 (Wife) {!hasLivingSpouse ? '(배우자 없음)' : ''}</option>
                                <option value="lover">연인/첩 (Lover/Concubine - £0.5)</option>
                                <option value="none">없음/건너뛰기</option>
                              </select>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button className="btn-medieval" onClick={rollMarriage}><Dices size={12} /> 무작위 결혼 굴림 (Table 10-10)</button>
                            <button className="btn-medieval" onClick={rollChildbirth} disabled={childbirthMother === 'none'}><Dices size={12} /> 출산 d20 (Table 10-11)</button>
                            <button className="btn-medieval" onClick={rollFamilyEvent}><Dices size={12} /> 가문사건 d20 (Table 10-12)</button>
                            {childbirthMother === 'none' && (
                              <button className="btn-medieval btn-medieval-secondary" onClick={skipChildbirth}>출산 단계 건너뛰기</button>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {marriageResult && (
                        <div style={{ border: '1px solid var(--color-gold-light)', padding: '8px', background: '#fff', fontSize: '0.85rem' }}>
                          <strong>결혼 판정:</strong> {marriageResult.rank} (지참금: <strong>£{marriageResult.dowry}</strong>, 영예: <strong>+{marriageResult.glory}</strong>)
                        </div>
                      )}
                      {childbirthResult && (
                        <div style={{ border: '1px solid var(--color-gold-light)', padding: '8px', background: '#fff', fontSize: '0.85rem' }}>
                          <strong>출산 d20 [{childbirthRoll}]:</strong> {childbirthResult}
                        </div>
                      )}
                      {familyEventResult && (
                        <div style={{ border: '1px solid var(--color-gold-light)', padding: '8px', background: '#fff', fontSize: '0.85rem' }}>
                          <strong>가문사건 d20 [{familyEventRoll}]:</strong> {familyEventResult}
                          
                          {/* Event 6 */}
                          {familyEventRoll === 6 && (
                            <div style={{ marginTop: '8px', borderTop: '1px dashed #ddd', paddingTop: '6px' }}>
                              <span style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--color-gold-dark)' }}>가문 옹호 여부 선택:</span>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button className={`btn-medieval ${familyEventChoice === 'a' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('a')}>가문 옹호 (a: 가문 사랑 체크)</button>
                                <button className={`btn-medieval ${familyEventChoice === 'b' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('b')}>친족 책망 (b: 명예 체크, 가문 사랑 -1)</button>
                              </div>
                            </div>
                          )}

                          {/* Event 7 */}
                          {familyEventRoll === 7 && (
                            <div style={{ marginTop: '8px', borderTop: '1px dashed #ddd', paddingTop: '6px' }}>
                              <span style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--color-gold-dark)' }}>채무 상환 결정 (필요 금액: £{familyEventD6Roll}):</span>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button className={`btn-medieval ${familyEventChoice === 'a' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('a')}>상환하기 (a: £{familyEventD6Roll} 지불, 가문 입지 체크)</button>
                                <button className={`btn-medieval ${familyEventChoice === 'b' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('b')}>거절하기 (b: 가문 입지 -1)</button>
                              </div>
                            </div>
                          )}

                          {/* Event 9 */}
                          {familyEventRoll === 9 && (
                            <div style={{ marginTop: '8px', borderTop: '1px dashed #ddd', paddingTop: '6px' }}>
                              <span style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--color-gold-dark)' }}>혼사 파탄 대응:</span>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button className={`btn-medieval ${familyEventChoice === 'a' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('a')}>가문 결사 옹호 (a: 가문 사랑 &amp; 입지 체크)</button>
                                <button className={`btn-medieval ${familyEventChoice === 'b' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('b')}>무시하기 (b: 변화 없음)</button>
                              </div>
                            </div>
                          )}

                          {/* Event 13 */}
                          {familyEventRoll === 13 && (
                            <div style={{ marginTop: '8px', borderTop: '1px dashed #ddd', paddingTop: '6px' }}>
                              <span style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--color-gold-dark)' }}>도망자 보호 여부:</span>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button className={`btn-medieval ${familyEventChoice === 'a' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('a')}>보호 수용 (a: 가문 입지 &amp; 명예 체크, 정의 -1)</button>
                                <button className={`btn-medieval ${familyEventChoice === 'b' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('b')}>거절 인도 (b: 정의 체크, 가문 입지 -1)</button>
                              </div>
                            </div>
                          )}

                          {/* Event 14 */}
                          {familyEventRoll === 14 && (
                            <div style={{ marginTop: '8px', borderTop: '1px dashed #ddd', paddingTop: '6px' }}>
                              <span style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--color-gold-dark)' }}>몸값 지불 여부 (필요 금액: £{familyEventD6Roll}):</span>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button className={`btn-medieval ${familyEventChoice === 'a' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('a')}>지불하기 (a: £{familyEventD6Roll} 지불, 가문 사랑 &amp; 입지 체크)</button>
                                <button className={`btn-medieval ${familyEventChoice === 'b' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('b')}>지불 거절 (b: 변화 없음)</button>
                              </div>
                            </div>
                          )}

                          {/* Event 15 */}
                          {familyEventRoll === 15 && (
                            <div style={{ marginTop: '8px', borderTop: '1px dashed #ddd', paddingTop: '6px' }}>
                              <span style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--color-gold-dark)' }}>경범죄 벌금 납부 여부 (필요 금액: £1):</span>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button className={`btn-medieval ${familyEventChoice === 'a' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('a')}>납부하기 (a: £1 지불)</button>
                                <button className={`btn-medieval ${familyEventChoice === 'b' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('b')}>납부 거부 (b: 명예 -1)</button>
                              </div>
                            </div>
                          )}

                          {/* Event 16 */}
                          {familyEventRoll === 16 && (
                            <div style={{ marginTop: '8px', borderTop: '1px dashed #ddd', paddingTop: '6px' }}>
                              <span style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--color-gold-dark)' }}>중범죄 벌금 납부 여부 (필요 금액: £5):</span>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button className={`btn-medieval ${familyEventChoice === 'a' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('a')}>납부하기 (a: £5 지불)</button>
                                <button className={`btn-medieval ${familyEventChoice === 'b' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('b')}>납부 거부 (b: 명예 -2)</button>
                              </div>
                            </div>
                          )}

                          {/* Event 18 */}
                          {familyEventRoll === 18 && (
                            <div style={{ marginTop: '8px', borderTop: '1px dashed #ddd', paddingTop: '6px' }}>
                              <span style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--color-gold-dark)' }}>피의 원한 사투 - 전술(Battle) 판정 결과 선택:</span>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button className={`btn-medieval ${familyEventChoice === 'crit' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.72rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('crit')}>대성공 (Crit: 전술, 명예, 가문사랑, 가문입지 체크)</button>
                                <button className={`btn-medieval ${familyEventChoice === 'success' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.72rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('success')}>성공 (Success: 가문사랑 체크)</button>
                                <button className={`btn-medieval ${familyEventChoice === 'failure' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.72rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('failure')}>실패 (Failure)</button>
                                <button className={`btn-medieval ${familyEventChoice === 'fumble' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.72rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('fumble')}>대실패 (Fumble: 가문사랑 -2, 가문입지 -2)</button>
                              </div>
                            </div>
                          )}

                          {/* Event 20 */}
                          {familyEventRoll === 20 && (
                            <div style={{ marginTop: '8px', borderTop: '1px dashed #ddd', paddingTop: '6px' }}>
                              <span style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--color-gold-dark)' }}>기사의 결단 (1~19번 사건 선택):</span>
                              <select className="input-medieval" style={{ width: '100%', padding: '4px', fontSize: '0.8rem' }}
                                value={familyEventRoll20Selection || ''} onChange={(e) => {
                                  setFamilyEventRoll20Selection(e.target.value);
                                  setFamilyEventChoice(null); // Reset choice for the new event
                                }}>
                                <option value="">-- 사건 선택 --</option>
                                {Array.from({ length: 19 }, (_, i) => i + 1).map(num => (
                                  <option key={num} value={num}>{num}번 사건</option>
                                ))}
                              </select>
                              
                              {/* If selected event requires a choice */}
                              {familyEventRoll20Selection && ['6', '7', '9', '13', '14', '15', '16', '18'].includes(String(familyEventRoll20Selection)) && (
                                <div style={{ marginTop: '8px', borderTop: '1px dotted #ccc', paddingTop: '6px' }}>
                                  <span style={{ display: 'block', fontSize: '0.78rem', marginBottom: '4px', color: 'var(--color-gold-dark)' }}>{familyEventRoll20Selection}번 사건의 세부 결정:</span>
                                  {String(familyEventRoll20Selection) === '6' && (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button className={`btn-medieval ${familyEventChoice === 'a' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('a')}>가문 옹호 (a)</button>
                                      <button className={`btn-medieval ${familyEventChoice === 'b' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('b')}>친족 책망 (b)</button>
                                    </div>
                                  )}
                                  {String(familyEventRoll20Selection) === '7' && (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button className={`btn-medieval ${familyEventChoice === 'a' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('a')}>상환하기 (a: £{familyEventD6Roll || 3} 지불)</button>
                                      <button className={`btn-medieval ${familyEventChoice === 'b' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('b')}>거절하기 (b)</button>
                                    </div>
                                  )}
                                  {String(familyEventRoll20Selection) === '9' && (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button className={`btn-medieval ${familyEventChoice === 'a' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('a')}>결사 옹호 (a)</button>
                                      <button className={`btn-medieval ${familyEventChoice === 'b' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('b')}>무시하기 (b)</button>
                                    </div>
                                  )}
                                  {String(familyEventRoll20Selection) === '13' && (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button className={`btn-medieval ${familyEventChoice === 'a' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('a')}>보호 수용 (a)</button>
                                      <button className={`btn-medieval ${familyEventChoice === 'b' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('b')}>거절 인도 (b)</button>
                                    </div>
                                  )}
                                  {String(familyEventRoll20Selection) === '14' && (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button className={`btn-medieval ${familyEventChoice === 'a' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('a')}>지불하기 (a: £{familyEventD6Roll || 3} 지불)</button>
                                      <button className={`btn-medieval ${familyEventChoice === 'b' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('b')}>지불 거절 (b)</button>
                                    </div>
                                  )}
                                  {String(familyEventRoll20Selection) === '15' && (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button className={`btn-medieval ${familyEventChoice === 'a' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('a')}>납부하기 (a: £1)</button>
                                      <button className={`btn-medieval ${familyEventChoice === 'b' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('b')}>거부하기 (b)</button>
                                    </div>
                                  )}
                                  {String(familyEventRoll20Selection) === '16' && (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button className={`btn-medieval ${familyEventChoice === 'a' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('a')}>납부하기 (a: £5)</button>
                                      <button className={`btn-medieval ${familyEventChoice === 'b' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('b')}>거부하기 (b)</button>
                                    </div>
                                  )}
                                  {String(familyEventRoll20Selection) === '18' && (
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                      <button className={`btn-medieval ${familyEventChoice === 'crit' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.72rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('crit')}>대성공 (Crit)</button>
                                      <button className={`btn-medieval ${familyEventChoice === 'success' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.72rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('success')}>성공 (Success)</button>
                                      <button className={`btn-medieval ${familyEventChoice === 'failure' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.72rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('failure')}>실패 (Failure)</button>
                                      <button className={`btn-medieval ${familyEventChoice === 'fumble' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.72rem', padding: '4px 8px' }} onClick={() => setFamilyEventChoice('fumble')}>대실패 (Fumble)</button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          {familyEventNeedsManualResolution && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: 'var(--color-crimson)', fontWeight: 'bold' }}>
                              <AlertTriangle size={14} /> manual resolution required: 인물 사망, 납치, 실종 등 선택 대상이 필요한 효과는 수동으로 확정하세요.
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {(marriageResult || childbirthResult || familyEventResult) && !familyApplied && (
                      <button className="btn-medieval btn-medieval-primary" onClick={applyFamilyPhase} style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}>
                        가문 정산 결과(소지금 &amp; 영예) 최종 반영하기
                      </button>
                    )}
                  </div>
                )}

                {/* STEP 7 */}
                {winterStep === 7 && (
                  <div>
                    {/* 📖 룰북 경험 성장 레퍼런스 */}
                    <div style={{ marginBottom: '16px', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: 'rgba(201,168,76,0.06)', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} onClick={() => setShowRefExperience(!showRefExperience)}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          📖 룰북 경험 성장 (Experience Check) 레퍼런스 규칙
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)' }}>{showRefExperience ? '접기 ▲' : '펼치기 ▼'}</span>
                      </div>
                      {showRefExperience && (
                        <div style={{ padding: '10px', fontSize: '0.74rem', borderTop: '1px solid rgba(201,168,76,0.15)', backgroundColor: '#fff' }}>
                          <p style={{ margin: '0 0 6px 0', color: 'var(--color-ink-light)', lineHeight: '1.3' }}>
                            * 세션 시나리오 도중 체크(☐)된 모든 스펙트럼(기술, 성향, 열망)에 대해 각각 d20을 굴려 성장을 시도합니다.
                          </p>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                <th style={{ padding: '4px' }}>d20 굴림 결과</th>
                                <th style={{ padding: '4px' }}>성공 판정 기준 및 결과</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold', color: 'green' }}>현재 수치 이상 <span style={{ fontWeight: 'normal' }}>또는</span> 20</td>
                                <td style={{ padding: '4px' }}><strong>성장 성공:</strong> 해당 능력치가 <strong>+1점 상승</strong>하며, 체크가 해제됩니다.</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '4px', fontWeight: 'bold', color: 'var(--color-grey)' }}>현재 수치 미만 <span style={{ fontWeight: 'normal' }}>(20 미만)</span></td>
                                <td style={{ padding: '4px' }}><strong>성장 실패:</strong> 능력치 상승은 없으며, 체크만 해제됩니다.</td>
                              </tr>
                            </tbody>
                          </table>
                          <p style={{ margin: '6px 0 0 0', fontStyle: 'italic', color: 'var(--color-grey)' }}>
                            ※ 수치 한계: 경험 판정(d20 결과가 현재 값 이상 또는 20)을 통한 성장은 룰북 규정에 따라 15점 제한이 적용되지 않으며, 자연 성장을 통해 최대 20점까지 자력으로 상승할 수 있습니다. (자유 단련 Option B의 15점 제한과 다름)
                          </p>
                        </div>
                      )}
                    </div>
                    <p style={{ marginBottom: '12px' }}>여름 모험 중에 체크(☐)된 기사의 기술, 성향, 열망들을 한 해 수련 성과로 d20 성장 판정합니다.</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-grey)', marginBottom: '12px' }}>룰북 규정: d20 굴림 결과가 <strong>현재 값 이상 또는 20</strong>이 나오면 +1점 상승하고 시트 체크가 해제됩니다.</p>

                    {!experienceApplied ? (
                      <button className="btn-medieval btn-medieval-primary" onClick={runExperiencePhase}>
                        <Dices size={15} /> 경험 성장 판정 실행 (Checked Stats d20)
                      </button>
                    ) : (
                      <div>
                        <div style={{ color: 'green', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                          <Check size={16} /> 성장 판정 실행 완료!
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '160px', overflowY: 'auto', border: '1px solid var(--color-grey-light)', padding: '8px', background: '#fff' }}>
                          {experienceLogs.map((l, i) => <div key={i} style={{ fontSize: '0.8rem' }}>{l}</div>)}
                          {experienceLogs.length === 0 && <div style={{ fontSize: '0.8rem', color: 'var(--color-grey)', fontStyle: 'italic' }}>성장한 스탯이 없습니다.</div>}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 8 */}
                {winterStep === 8 && (
                  <div>
                    <p style={{ marginBottom: '12px' }}>겨울 여유 시간 동안 기사의 특별 자유 연마를 설계하여 시트에 직접 즉시 반영합니다.</p>

                    {!trainingApplied ? (
                      <div style={{ border: '1px solid var(--color-gold-light)', padding: '14px', background: 'rgba(179,143,67,0.02)' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                          <button className={`btn-medieval ${trainingOption === 'optionA' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.8rem' }} onClick={() => { setTrainingOption('optionA'); setSelectedAttribute(''); setSelectedTrait(''); setSelectedPassion(''); setSelectedStanding(''); }}>
                            A. 능력치/성향/열망 +1
                          </button>
                          <button className={`btn-medieval ${trainingOption === 'optionB' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.8rem' }} onClick={() => setTrainingOption('optionB')}>
                            B. 4개 기술 단련 (+1)
                          </button>
                          <button className={`btn-medieval ${trainingOption === 'optionC' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.8rem' }} onClick={() => { setTrainingOption('optionC'); setSelectedHighSkill(''); }}>
                            C. 상급기술 돌파 (+1)
                          </button>
                        </div>

                        {/* Option A form */}
                        {trainingOption === 'optionA' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                            <div>
                              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>능력치 상승 (SIZ는 21세, 기타 30세 나이제한 적용):</label>
                              <select value={selectedAttribute} onChange={e => { setSelectedAttribute(e.target.value); setSelectedTrait(''); setSelectedPassion(''); setSelectedStanding(''); }} style={{ width: '100%', padding: '4px' }}>
                                <option value="">-- 선택 --</option>
                                {attributeKeys.map(k => <option key={k} value={k}>{k.toUpperCase()} (현재: {character.attributes[k]}점)</option>)}
                              </select>
                            </div>
                            <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-grey)' }}>또는</div>
                            <div>
                              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>성향/열망/사회적 명망 상승 (한계 15):</label>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <select value={selectedTrait} onChange={e => { setSelectedTrait(e.target.value); setSelectedAttribute(''); setSelectedPassion(''); setSelectedStanding(''); }} style={{ flex: '1', padding: '4px' }}>
                                  <option value="">-- 성향 선택 --</option>
                                  {traitKeys.map(k => <option key={k} value={k}>{k} (현재: {character.traits[k]}점)</option>)}
                                </select>
                                <select value={selectedPassion} onChange={e => { setSelectedPassion(e.target.value); setSelectedAttribute(''); setSelectedTrait(''); setSelectedStanding(''); }} style={{ flex: '1', padding: '4px' }}>
                                  <option value="">-- 열망 선택 --</option>
                                  {passionKeys.map(k => <option key={k} value={k}>{k} (현재: {character.passions[k]}점)</option>)}
                                </select>
                                <select value={selectedStanding} onChange={e => { setSelectedStanding(e.target.value); setSelectedAttribute(''); setSelectedTrait(''); setSelectedPassion(''); }} style={{ flex: '1', padding: '4px' }}>
                                  <option value="">-- 명망 선택 --</option>
                                  {standingKeys.map(k => <option key={k} value={k}>{k} (현재: {character.standings[k]}점)</option>)}
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Option B form */}
                        {trainingOption === 'optionB' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                            <p style={{ color: 'var(--color-crimson)', fontWeight: 'bold' }}>4개 종류 기술에 각 +1점 성장 (단, 15점 초과 불가능 &amp; 초기치 0 불가능)</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                              <div>
                                <label style={{ display: 'block', marginBottom: '2px' }}>일반 모험 기술:</label>
                                <select value={selectedSkills.adventure} onChange={e => setSelectedSkills(prev => ({ ...prev, adventure: e.target.value }))} style={{ width: '100%', padding: '4px' }}>
                                  <option value="">-- 선택 --</option>
                                  {Object.keys(character.skills).filter(k => ["awareness", "chirurgery", "faerieLore", "firstAid", "folkLore", "horsemanship", "hunting", "industry", "recognize", "religion", "stewardship", "swimming"].includes(k)).map(k => <option key={k} value={k}>{k} ({character.skills[k]})</option>)}
                                </select>
                              </div>
                              <div>
                                <label style={{ display: 'block', marginBottom: '2px' }}>궁정 예법 기술:</label>
                                <select value={selectedSkills.courtly} onChange={e => setSelectedSkills(prev => ({ ...prev, courtly: e.target.value }))} style={{ width: '100%', padding: '4px' }}>
                                  <option value="">-- 선택 --</option>
                                  {Object.keys(character.skills).filter(k => ["courtesy", "dancing", "eloquence", "falconry", "gaming", "heraldry", "intrigue", "playInstruments", "readingWriting", "romance", "singing"].includes(k)).map(k => <option key={k} value={k}>{k} ({character.skills[k]})</option>)}
                                </select>
                              </div>
                              <div>
                                <label style={{ display: 'block', marginBottom: '2px' }}>전투/무기 기술:</label>
                                <select value={selectedSkills.combat} onChange={e => setSelectedSkills(prev => ({ ...prev, combat: e.target.value }))} style={{ width: '100%', padding: '4px' }}>
                                  <option value="">-- 선택 --</option>
                                  {Object.keys(character.skills).filter(k => ["battle", "siege", "sword", "lance", "axe", "spear", "dagger", "bludgeon", "unarmed"].includes(k)).map(k => <option key={k} value={k}>{k} ({character.skills[k]})</option>)}
                                </select>
                              </div>
                              <div>
                                <label style={{ display: 'block', marginBottom: '2px' }}>자유 선택 기술:</label>
                                <select value={selectedSkills.free} onChange={e => setSelectedSkills(prev => ({ ...prev, free: e.target.value }))} style={{ width: '100%', padding: '4px' }}>
                                  <option value="">-- 선택 --</option>
                                  {Object.keys(character.skills).map(k => <option key={k} value={k}>{k} ({character.skills[k]})</option>)}
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Option C form */}
                        {trainingOption === 'optionC' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                            <p style={{ color: 'var(--color-crimson)', fontWeight: 'bold' }}>이미 15점 이상에 도달한 최상급 기술 하나를 +1점 돌파 성장 (상한 20)</p>
                            <select value={selectedHighSkill} onChange={e => setSelectedHighSkill(e.target.value)} style={{ width: '100%', padding: '4px' }}>
                              <option value="">-- 선택 (15점 이상 기술 목록) --</option>
                              {Object.keys(character.skills).filter(k => (character.skills[k] >= 15)).map(k => <option key={k} value={k}>{k} (현재: {character.skills[k]}점)</option>)}
                            </select>
                          </div>
                        )}

                        {trainingOption && (
                          <button className="btn-medieval btn-medieval-primary" onClick={applyTraining} style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>
                            자유 수련 단련 효과 시트에 즉시 반영하기
                          </button>
                        )}

                      </div>
                    ) : (
                      <div style={{ color: 'green', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={16} /> 기사 자유 단련 수련이 성공적으로 시트에 반영되었습니다!
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 9 */}
                {winterStep === 9 && (
                  <div>
                    <p style={{ marginBottom: '12px' }}>올해 모험 중 획득한 세션 영예와 영지 6점, Chivalrous/Religious/Romantic 기사 등 이상 보너스(+100) 및 패시브 영예를 합산 정산합니다.</p>

                    {!calculatedAnnualGlory ? (
                      <button className="btn-medieval btn-medieval-primary" onClick={computeGlory}>
                        <Award size={15} /> 연간 영예 자동 계산 실행
                      </button>
                    ) : (
                      <div>
                        <div style={{ border: '1px solid var(--color-gold)', padding: '12px', background: 'rgba(179,143,67,0.03)', marginBottom: '12px' }}>
                          <div>이번 세션 중 획득 영예: <strong>{character.gear.gloryThisGame} Glory</strong></div>
                          <div style={{ marginTop: '4px', fontWeight: 'bold', fontSize: '1rem', color: 'var(--color-crimson)' }}>
                            연간 고정 및 패시브 영예 합산: +{calculatedAnnualGlory} Glory
                          </div>
                        </div>

                        {!gloryApplied ? (
                          <button className="btn-medieval btn-medieval-primary" onClick={applyGlory} style={{ width: '100%', justifyContent: 'center' }}>
                            모든 정산 영예를 시트 누적 영예(Glory Total)에 최종 합산하기
                          </button>
                        ) : (
                          <div style={{ color: 'green', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Check size={16} /> 영예 합산 정산 완료!
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 10 */}
                {winterStep === 10 && (
                  <div>
                    <p style={{ marginBottom: '12px' }}>기사의 총누적 영예가 <strong>새로운 1,000단위</strong>를 돌파할 때마다 부여되는 <strong>영예 보너스 위젯</strong>입니다.</p>

                    {gloryBonusPoints > 0 ? (
                      <div style={{ border: '1px solid var(--color-gold)', padding: '14px', background: 'rgba(179,143,67,0.03)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--color-crimson)' }}>
                          🎉 영예 돌파 보너스 활성화! 사용 가능 점수: {gloryBonusPoints - bonusSpent} / {gloryBonusPoints} 점
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-light)' }}>돌파 보너스는 나이 제한이나 수치 제한 없이 시트의 원하는 어떤 수치든 +1점 상승시킬 수 있습니다.</p>

                        {bonusSpent < gloryBonusPoints && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <select id="bonus-attr-sel" style={{ flex: '1', padding: '4px' }} onChange={e => { spendGloryBonus('attribute', e.target.value); e.target.value = ''; }}>
                                <option value="">-- 주요능력치 (+1) --</option>
                                {attributeKeys.map(k => <option key={k} value={k}>{k.toUpperCase()} ({character.attributes[k]})</option>)}
                              </select>
                              <select id="bonus-trait-sel" style={{ flex: '1', padding: '4px' }} onChange={e => { spendGloryBonus('trait', e.target.value); e.target.value = ''; }}>
                                <option value="">-- 기사성향 (+1) --</option>
                                {traitKeys.map(k => <option key={k} value={k}>{k} ({character.traits[k]})</option>)}
                              </select>
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <select id="bonus-skill-sel" style={{ flex: '1', padding: '4px' }} onChange={e => { spendGloryBonus('skill', e.target.value); e.target.value = ''; }}>
                                <option value="">-- 기사기술 (+1) --</option>
                                {Object.keys(character.skills).map(k => <option key={k} value={k}>{k} ({character.skills[k]})</option>)}
                              </select>
                              <select id="bonus-passion-sel" style={{ flex: '1', padding: '4px' }} onChange={e => { spendGloryBonus('passion', e.target.value); e.target.value = ''; }}>
                                <option value="">-- 기사열망 (+1) --</option>
                                {passionKeys.map(k => <option key={k} value={k}>{k} ({character.passions[k]})</option>)}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p style={{ fontStyle: 'italic', color: 'var(--color-grey)' }}>올해는 영예 1,000단위 돌파 보너스 점수가 활성화되지 않았습니다.</p>
                    )}

                    <div style={{ marginTop: '20px', borderTop: '2px solid var(--color-gold)', paddingTop: '16px', textAlign: 'center' }}>
                      <h4 style={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'green', marginBottom: '8px' }}>⚔️ 겨울을 이겨내고 새 봄을 맞이할 준비가 되셨습니까?</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)', marginBottom: '14px' }}>
                        버튼을 누르면 겨울 정산이 완전히 영구 완료되며, 기사의 공식 연령이 **+1세** 증가하고 대시보드로 돌아갑니다.
                      </p>
                      <button className="btn-medieval btn-medieval-primary" style={{ margin: '0 auto', fontSize: '1.05rem', padding: '8px 20px' }} onClick={endWinterPhase}>
                        새로운 봄 기운 열기 (기사 나이 +1)
                      </button>
                    </div>

                  </div>
                )}

              </div>

              {/* Wizard Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-gold-light)', paddingTop: '12px' }}>
                <button className="btn-medieval" disabled={winterStep === 1} onClick={() => setWinterStep(w => w - 1)}>
                  <ChevronLeft size={14} /> 이전 단계
                </button>
                <button className="btn-medieval" disabled={winterStep === 10} onClick={() => setWinterStep(w => w + 1)}>
                  다음 단계 <ChevronRight size={14} />
                </button>
              </div>

            </div>
          </section>

          {/* Sub Panel: Logger */}
          <section className="cs-section" style={{ marginTop: '8px' }}>
            <div className="sheet-ribbon"><h3>겨울 정산 연대기 기록 (Log)</h3></div>
            <div className="cs-section-inner">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto', backgroundColor: '#fff', padding: '10px', border: '1px solid var(--color-gold-light)' }}>
                {logMessages.length === 0 ? (
                  <div style={{ color: 'var(--color-grey)', fontStyle: 'italic', fontSize: '0.85rem', textAlign: 'center', padding: '30px 0' }}>
                    겨울 주사위 굴림 기록이 여기에 기록됩니다.
                  </div>
                ) : (
                  logMessages.map((msg, i) => (
                    <div key={i} style={{ fontSize: '0.85rem', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '5px', lineHeight: 1.4, display: 'flex', gap: '6px' }}>
                      <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>[로그]</span>
                      <span style={{ color: 'var(--color-ink)' }}>{msg}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

        </div>
      )}



    </div>
  );
}

import React, { useState } from 'react';
import { Shield, Dices, RotateCcw, ChevronRight, ChevronLeft, Check, Award, Compass, Heart, AlertTriangle } from 'lucide-react';
import { greatFamilies } from '../data/lore';

export default function FamilyWinter({ character, setCharacter }) {
  const [activeSubTab, setActiveSubTab] = useState('family');
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

  // Step 9 & 10 states
  const [calculatedAnnualGlory, setCalculatedAnnualGlory] = useState(null);
  const [gloryApplied, setGloryApplied] = useState(false);
  const [gloryBonusPoints, setGloryBonusPoints] = useState(0);
  const [bonusSpent, setBonusSpent] = useState(0);

  const handleFamilyChange = (field, value) => {
    setCharacter(prev => ({ ...prev, family: { ...prev.family, [field]: value } }));
  };

  const addLog = (msg) => {
    setLogMessages(prev => [msg, ...prev]);
  };

  // ══════════════════════════════════════════════════
  // STEP 2: AGING LOGIC
  // ══════════════════════════════════════════════════
  const rollAging = () => {
    const age = character.personal.age || 0;
    if (age < 30) {
      addLog(`[노화]: ${age}세 (30세 미만). 노화 주사위를 생략합니다.`);
      setAgingD20(20);
      setAgingLosses([]);
      setAgingApplied(true);
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
    const resolvedLosses = agingLosses.filter(l => l !== "None");

    setCharacter(prev => {
      const updatedAttr = { ...prev.attributes };
      resolvedLosses.forEach(stat => {
        const key = stat.toLowerCase();
        updatedAttr[key] = Math.max(1, (updatedAttr[key] || 0) - 1);
      });
      // Adjust current HP if SIZ or CON changed
      updatedAttr.currentHp = Math.min(updatedAttr.currentHp || 0, updatedAttr.siz + updatedAttr.con);
      return { ...prev, attributes: updatedAttr };
    });

    const lossText = resolvedLosses.length > 0 ? resolvedLosses.join(', ') + ' 각 -1' : '하락 없음';
    addLog(`[노화 적용]: d20 [${agingD20}] -> ${lossText}.`);
    setAgingApplied(true);
  };

  // ══════════════════════════════════════════════════
  // STEP 3: HARVEST LOGIC
  // ══════════════════════════════════════════════════
  const rollHarvest = () => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    setHarvestRoll(d20);

    const stewardship = character.skills.stewardship || 3;
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

    const revenue = Math.floor(6 * mult);
    setHarvestMult(mult);
    setHarvestRevenue(revenue);
    setHarvestApplied(false);
  };

  const applyHarvest = () => {
    if (harvestApplied) return;
    setCharacter(prev => {
      const updatedGear = { ...prev.gear };
      updatedGear.cash = (updatedGear.cash || 0) + harvestRevenue;
      return { ...prev, gear: updatedGear };
    });

    addLog(`[영지 수확]: 영지관리 d20 [${harvestRoll}] vs [${character.skills.stewardship}]. 배율 x${harvestMult} -> £${harvestRevenue} 획득!`);
    setHarvestApplied(true);
  };

  // ══════════════════════════════════════════════════
  // STEP 4: SURVIVAL LOGIC
  // ══════════════════════════════════════════════════
  const rollSurvival = () => {
    // Squire
    const sRoll = Math.floor(Math.random() * 20) + 1;
    setSquireSurvivalRoll(sRoll);
    let sStatus = "건강함";
    if (sRoll === 1) sStatus = "사망 위험!";
    else if (sRoll === 2) sStatus = "질병 (내년 판정 -5)";
    setSquireStatus(sStatus);

    // Horse
    const hRoll = Math.floor(Math.random() * 20) + 1;
    setHorseSurvivalRoll(hRoll);
    let hStatus = "건강함";
    if (hRoll === 1) hStatus = "사망 위험!";
    else if (hRoll === 2) hStatus = "질병 (내년 판정 -5)";
    setHorseStatus(hStatus);

    setSurvivalApplied(false);
  };

  const applySurvival = () => {
    if (survivalApplied) return;
    addLog(`[동료 생존]: 종자 d20 [${squireSurvivalRoll}] -> ${squireStatus}, 군마 d20 [${horseSurvivalRoll}] -> ${horseStatus}`);
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

  const rollPersonalEvent = () => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    setPersonalEventRoll(d20);
    setPersonalEventText(personalEventTable[d20]);
    setPersonalEventApplied(false);
  };

  const applyPersonalEvent = (outcome) => {
    if (personalEventApplied) return;
    addLog(`[개인 사건]: d20 [${personalEventRoll}] ${personalEventText.name} -> 결과 [${outcome}] 적용.`);
    setPersonalEventApplied(true);
  };

  // ══════════════════════════════════════════════════
  // STEP 6: FAMILY LOGIC (Marriage / Childbirth / Family Event)
  // ══════════════════════════════════════════════════
  const rollMarriage = () => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    setMarriageRoll(d20);
    let rank = "가신 기사의 딸";
    let dowry = 1;
    let glory = 50;

    if (d20 <= 5) { rank = "부유한 평민 상인의 딸"; dowry = Math.floor(Math.random() * 18) + 9; glory = 0; }
    else if (d20 <= 8) { rank = "수습 종자의 딸"; dowry = 3; glory = 10; }
    else if (d20 <= 10) { rank = "가신 기사의 딸"; dowry = Math.floor(Math.random() * 6) + 1; glory = 50; }
    else if (d20 === 11) { rank = "부유한 봉신기사의 맏딸"; dowry = Math.floor(Math.random() * 3) + 7; glory = 100; }
    else if (d20 <= 20) { rank = "일반 봉신기사의 딸"; dowry = Math.floor(Math.random() * 6) + 1; glory = 100; }
    else if (d20 <= 25) { rank = "봉신기사 가문 여상속인"; dowry = 15; glory = 100; } // 1 manor + 1d6+10 represented as £15
    else { rank = "남작 가문의 막내딸"; dowry = 20; glory = 250; }

    setMarriageResult({ rank, dowry, glory });
  };

  const rollChildbirth = () => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    setChildbirthRoll(d20);
    let outcome = "아무 일 없음";
    if (d20 === 11) outcome = "비극: 산모와 아이 모두 출산 중 서거 😭";
    else if (d20 === 12) outcome = "비극: 산모 서거, 아이 생존 (성별 1d6) 🕯️";
    else if (d20 <= 19) outcome = "경사: 건강한 아이 출생! (성별 1d6) 👶";
    else if (d20 === 20) outcome = "경사: 쌍둥이 아이 출생! 🎉👶👶";

    setChildbirthResult(outcome);
  };

  const rollFamilyEvent = () => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    setFamilyEventRoll(d20);
    let outcome = "평온한 한 해";
    if (d20 === 1) outcome = "가문의 비극: 친족이 시합 또는 불화 끝에 사망";
    else if (d20 === 2) outcome = "가문의 영광: 귀인의 목숨을 구하고 서거. 친족 전원 +10 Glory";
    else if (d20 === 3) outcome = "위대한 위업: 멧돼지 사냥에서 주군 구출. 친족 전원 +5 Glory";
    else if (d20 === 4) outcome = "납치 사건: 친족이 강제 결혼이나 몸값을 노린 무리에 납치됨";
    else if (d20 === 5) outcome = "실종 사건: 친족 한 명이 행방불명됨";
    else if (d20 === 8) outcome = "뜻밖의 하사품: 가문의 선조 유물 선물 획득!";
    else if (d20 === 10) outcome = "경사스런 혼사: 가문 일원이 엄청난 귀족가와 혼인. 명예 +1";
    else if (d20 === 19) outcome = "벼락 영전: 친족이 궁성 백작이나 순찰사로 전격 임명! +10 Glory";
    else outcome = "가문 평온: 가문 내에 무난하고 평화로운 기운이 돕니다.";

    setFamilyEventResult(outcome);
  };

  const applyFamilyPhase = () => {
    if (familyApplied) return;
    
    setCharacter(prev => {
      const updatedGear = { ...prev.gear };
      if (marriageResult) {
        updatedGear.cash = (updatedGear.cash || 0) + marriageResult.dowry;
        updatedGear.gloryThisGame = (updatedGear.gloryThisGame || 0) + marriageResult.glory;
      }
      return { ...prev, gear: updatedGear };
    });

    let msg = `[가문 정산]: `;
    if (marriageResult) msg += `결혼 성공 (${marriageResult.rank}, dowry £${marriageResult.dowry}, +${marriageResult.glory} Glory) `;
    if (childbirthResult) msg += `/ 출산 d20 [${childbirthRoll}] -> ${childbirthResult} `;
    if (familyEventResult) msg += `/ 가문사건 d20 [${familyEventRoll}] -> ${familyEventResult}`;

    addLog(msg);
    setFamilyApplied(true);
  };

  // ══════════════════════════════════════════════════
  // STEP 7: EXPERIENCE LOGIC
  // ══════════════════════════════════════════════════
  const runExperiencePhase = () => {
    if (experienceApplied) return;

    const checkedSkills = Object.keys(character.skillsChecked).filter(k => character.skillsChecked[k]);
    const checkedPassions = Object.keys(character.passionsChecked).filter(k => character.passionsChecked[k]);

    const logs = [];
    const updatedSkills = { ...character.skills };
    const updatedPassions = { ...character.passions };

    // Roll for skills
    checkedSkills.forEach(key => {
      const val = character.skills[key] || 0;
      const d20 = Math.floor(Math.random() * 20) + 1;
      const success = d20 >= val || d20 === 20;
      if (success && val < 20) {
        updatedSkills[key] = val + 1;
        logs.push(`[기술 ${key} 성장]: d20 [${d20}] vs [${val}]. 성공! → ${val + 1} 🎉`);
      } else {
        logs.push(`[기술 ${key} 유지]: d20 [${d20}] vs [${val}]. 실패.`);
      }
    });

    // Roll for passions
    checkedPassions.forEach(key => {
      const val = character.passions[key] || 0;
      const d20 = Math.floor(Math.random() * 20) + 1;
      const success = d20 >= val || d20 === 20;
      if (success && val < 20) {
        updatedPassions[key] = val + 1;
        logs.push(`[열망 ${key} 성장]: d20 [${d20}] vs [${val}]. 성공! → ${val + 1} 🎉`);
      } else {
        logs.push(`[열망 ${key} 유지]: d20 [${d20}] vs [${val}]. 실패.`);
      }
    });

    setCharacter(prev => ({
      ...prev,
      skills: updatedSkills,
      skillsChecked: {},
      passions: updatedPassions,
      passionsChecked: {}
    }));

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
        setCharacter(prev => ({
          ...prev,
          attributes: { ...prev.attributes, [selectedAttribute]: (prev.attributes[selectedAttribute] || 0) + 1 }
        }));
        addLog(`[자유 단련]: 능력치 [${selectedAttribute.toUpperCase()}] +1 영구 증가!`);
      } else if (selectedTrait) {
        // opposite trait adjusts automatically
        const oppositeMap = {
          chaste: "lustful", energetic: "lazy", forgiving: "vengeful",
          generous: "selfish", honest: "deceitful", just: "arbitrary",
          merciful: "cruel", modest: "proud", pious: "worldly",
          prudent: "reckless", temperate: "indulgent", trusting: "suspicious",
          valorous: "cowardly"
        };
        const opp = oppositeMap[selectedTrait];
        setCharacter(prev => ({
          ...prev,
          traits: {
            ...prev.traits,
            [selectedTrait]: Math.min(20, (prev.traits[selectedTrait] || 0) + 1),
            [opp]: Math.max(0, (prev.traits[opp] || 0) - 1)
          }
        }));
        addLog(`[자유 단련]: 성향 [${selectedTrait}] +1 증가!`);
      } else if (selectedPassion) {
        setCharacter(prev => ({
          ...prev,
          passions: { ...prev.passions, [selectedPassion]: Math.min(20, (prev.passions[selectedPassion] || 0) + 1) }
        }));
        addLog(`[자유 단련]: 열망 [${selectedPassion}] +1 증가!`);
      } else if (selectedStanding) {
        setCharacter(prev => ({
          ...prev,
          standings: { ...prev.standings, [selectedStanding]: Math.min(20, (prev.standings[selectedStanding] || 0) + 1) }
        }));
        addLog(`[자유 단련]: 명망 [${selectedStanding}] +1 증가!`);
      }
    } 
    else if (trainingOption === 'optionB') {
      setCharacter(prev => {
        const skills = { ...prev.skills };
        const keys = Object.values(selectedSkills).filter(k => k);
        keys.forEach(k => {
          if (skills[k] < 15) {
            skills[k] = (skills[k] || 0) + 1;
          }
        });
        return { ...prev, skills };
      });
      addLog(`[자유 단련]: 4개 기술 훈련 (+1 상승, 한계 15) 적용 완료!`);
    } 
    else if (trainingOption === 'optionC') {
      if (selectedHighSkill && (character.skills[selectedHighSkill] >= 15)) {
        setCharacter(prev => ({
          ...prev,
          skills: { ...prev.skills, [selectedHighSkill]: Math.min(20, (prev.skills[selectedHighSkill] || 0) + 1) }
        }));
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
    // 1. Manor: +6
    let annual = 6;

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

    const totalCalculated = annual + passiveGlory;
    setCalculatedAnnualGlory(totalCalculated);
    setGloryApplied(false);
  };

  const applyGlory = () => {
    if (gloryApplied) return;

    const previousTotal = character.gear.gloryTotal || 0;
    const addedGlory = calculatedAnnualGlory + (character.gear.gloryThisGame || 0);
    const newTotal = previousTotal + addedGlory;

    // Calculate Glory Bonus points (1 point per 1,000 threshold crossed)
    const prevThreshold = Math.floor(previousTotal / 1000);
    const newThreshold = Math.floor(newTotal / 1000);
    const bonusEarned = Math.max(0, newThreshold - prevThreshold);

    setCharacter(prev => ({
      ...prev,
      gear: {
        ...prev.gear,
        gloryTotal: newTotal,
        gloryThisGame: 0
      }
    }));

    addLog(`[영예 정산]: 연간정산 +${calculatedAnnualGlory} Glory (장원 6점 + 활성 이상 보너스) 합산 완료. 누적 영예: ${newTotal}`);
    if (bonusEarned > 0) {
      addLog(`[축하합니다!]: 영예 1,000단위 돌파! 자유 능력치 +1 보너스 점수 [${bonusEarned}]점을 획득했습니다! (Step 10 위젯 사용)`);
      setGloryBonusPoints(bonusEarned);
    }
    setGloryApplied(true);
  };

  const spendGloryBonus = (statType, key) => {
    if (bonusSpent >= gloryBonusPoints) {
      alert("부여받은 돌파 보너스 점수를 모두 소모했습니다!");
      return;
    }

    setCharacter(prev => {
      const updated = { ...prev };
      if (statType === 'attribute') {
        updated.attributes[key] = (updated.attributes[key] || 0) + 1;
      } else if (statType === 'skill') {
        updated.skills[key] = (updated.skills[key] || 0) + 1;
      } else if (statType === 'passion') {
        updated.passions[key] = (updated.passions[key] || 0) + 1;
      } else if (statType === 'standing') {
        updated.standings[key] = (updated.standings[key] || 0) + 1;
      } else if (statType === 'trait') {
        const oppositeMap = {
          chaste: "lustful", energetic: "lazy", forgiving: "vengeful",
          generous: "selfish", honest: "deceitful", just: "arbitrary",
          merciful: "cruel", modest: "proud", pious: "worldly",
          prudent: "reckless", temperate: "indulgent", trusting: "suspicious",
          valorous: "cowardly"
        };
        const opp = oppositeMap[key];
        updated.traits[key] = Math.min(20, (updated.traits[key] || 0) + 1);
        updated.traits[opp] = Math.max(0, (updated.traits[opp] || 0) - 1);
      }
      return updated;
    });

    addLog(`[영예 돌파 보너스 사용]: ${key} +1 영구 증가!`);
    setBonusSpent(b => b + 1);
  };

  const endWinterPhase = () => {
    setCharacter(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        age: (prev.personal.age || 0) + 1
      }
    }));
    addLog(`⚔️ 겨울 정산 완료: 기사의 나이 +1세! 따스한 햇빛과 함께 새 봄이 찾아옵니다! ⚔️`);
    setWinterStep(1);
    setActiveSubTab('family');
    // reset states
    setAgingD20(null); setHarvestRoll(null); setSquireSurvivalRoll(null);
    setPersonalEventRoll(null); setMarriageRoll(null); setChildbirthRoll(null);
    setFamilyEventRoll(null); setExperienceLogs([]); setTrainingApplied(false);
    setCalculatedAnnualGlory(null); setGloryBonusPoints(0); setBonusSpent(0);
  };

  const resetWinter = () => {
    setWinterStep(1);
    setLogMessages([]);
    setAgingD20(null); setHarvestRoll(null); setSquireSurvivalRoll(null);
    setPersonalEventRoll(null); setMarriageRoll(null); setChildbirthRoll(null);
    setFamilyEventRoll(null); setExperienceLogs([]); setTrainingApplied(false);
    setCalculatedAnnualGlory(null); setGloryBonusPoints(0); setBonusSpent(0);
  };

  // Lists for selection
  const attributeKeys = ['siz', 'dex', 'str', 'con', 'app'];
  const traitKeys = ['chaste', 'energetic', 'forgiving', 'generous', 'honest', 'just', 'merciful', 'modest', 'pious', 'prudent', 'temperate', 'trusting', 'valorous'];
  const passionKeys = Object.keys(character.passions);
  const standingKeys = Object.keys(character.standings || {});

  return (
    <div className="cs-page view-animate">
      
      <div className="tutorial-banner">
        <div>
          <h4 className="tutorial-banner-title">🏰 가문 및 겨울 정산 (The Winter Phase)</h4>
          <p>1년 주기의 모험 정리는 기사의 성장과 다음 해의 경제를 결정합니다. 룰북 공식 10단계를 진행하세요.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--color-gold-light)', paddingBottom: '8px', marginBottom: '16px' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: activeSubTab === 'family' ? 'bold' : 'normal', color: activeSubTab === 'family' ? 'var(--color-crimson)' : 'var(--color-ink-light)' }}
          onClick={() => setActiveSubTab('family')}>가문 정보 시트</button>
        <span style={{ color: 'var(--color-gold-light)' }}>|</span>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: activeSubTab === 'winter' ? 'bold' : 'normal', color: activeSubTab === 'winter' ? 'var(--color-crimson)' : 'var(--color-ink-light)' }}
          onClick={() => setActiveSubTab('winter')}>공식 겨울 정산 (10단계 마법사)</button>
      </div>

      {/* SUB TAB: FAMILY DETAILS */}
      {activeSubTab === 'family' && (
        <section className="cs-section view-animate">
          <div className="sheet-ribbon"><h3>가문 명망 및 영지 설정</h3></div>
          <div className="cs-section-inner">
            <div className="cs-field-grid">
              {[
                { key: 'name', label: '가문 성씨', ph: '예: 아르덴' },
                { key: 'motto', label: '가언/신조', ph: '예: 명예와 신조' },
                { key: 'battleCry', label: '전투 함성', ph: '예: 몽주아 생드니!' },
                { key: 'ancestor', label: '가문 시조', ph: '예: 고드프루아 경' },
                { key: 'homeCountry', label: '영지/고향', ph: '예: 아키텐' },
                { key: 'patronSaint', label: '수호 성인', ph: '예: 성 데니스' },
              ].map(f => (
                <div className="cs-field" key={f.key}>
                  <span className="cs-field-label">{f.label}:</span>
                  <input type="text" value={character.family[f.key] || ''} placeholder={f.ph}
                    onChange={e => handleFamilyChange(f.key, e.target.value)} />
                </div>
              ))}
              <div className="cs-field">
                <span className="cs-field-label">가문 고유 명예:</span>
                <input type="number" value={character.family.honor || 0}
                  onChange={e => handleFamilyChange('honor', parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>우방 동맹 가문:</label>
                <textarea className="form-input" rows={2} value={character.family.allies || ''} style={{ width: '100%', padding: '6px' }}
                  onChange={e => handleFamilyChange('allies', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>적대 대립 가문:</label>
                <textarea className="form-input" rows={2} value={character.family.enemies || ''} style={{ width: '100%', padding: '6px' }}
                  onChange={e => handleFamilyChange('enemies', e.target.value)} />
              </div>
            </div>
          </div>
        </section>
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

                        {!personalEventApplied && (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {['Critical', 'Success', 'Failure', 'Fumble'].map(o => (
                              <button key={o} className="btn-medieval" style={{ fontSize: '0.8rem', padding: '4px 10px' }} onClick={() => applyPersonalEvent(o)}>
                                {o} 결과 적용
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 6 */}
                {winterStep === 6 && (
                  <div>
                    <p style={{ marginBottom: '10px' }}>기사의 대를 잇기 위한 <strong>결혼(Courtesy), 출산(Childbirth), 가문사건(Table 10-12)</strong>을 정산합니다.</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <button className="btn-medieval" onClick={rollMarriage}><Dices size={12} /> 무작위 결혼 굴림 (Table 10-10)</button>
                      <button className="btn-medieval" onClick={rollChildbirth}><Dices size={12} /> 출산 d20 (Table 10-11)</button>
                      <button className="btn-medieval" onClick={rollFamilyEvent}><Dices size={12} /> 가문사건 d20 (Table 10-12)</button>
                    </div>

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
            <div className="sheet-ribbon"><h3>겨울 정산 결과 실시간 기록실 (Log)</h3></div>
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

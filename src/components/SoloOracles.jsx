import React, { useState } from 'react';
import ProperNoun from './ProperNoun';
import { maleNames, femaleNames, surnames, locations, titles } from '../data/names';
import { rollGrades, yesNoOracle, soloScenariosRef } from '../data/oracles';
import { Dices, RefreshCw, HelpCircle, ArrowRight, Shield, Heart, Flame, Sparkles, Smile, AlertCircle, Info, ChevronRight, User } from 'lucide-react';

// D6 Tactile Dice Face Component
const DiceFace = ({ value, isRolling }) => {
  const activeDotsMap = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
  };
  const activeDots = activeDotsMap[value] || [];
  return (
    <div className={`die-face ${isRolling ? 'roll-blur' : 'roll-pop'}`} data-val={value}>
      {[...Array(9)].map((_, i) => (
        <div key={i} className="die-cell">
          {activeDots.includes(i) && <div className="die-dot" />}
        </div>
      ))}
    </div>
  );
};

// D20 Tactile Icosahedron Component
const D20Face = ({ value, isRolling, color }) => {
  return (
    <div className={`d20-container ${isRolling ? 'roll-blur' : 'roll-pop'}`}>
      <svg viewBox="0 0 100 100" className="d20-svg">
        {/* 중앙 삼각형 */}
        <polygon points="50,25 24,70 76,70" className="d20-face-center" />
        
        {/* 외곽 삼각형 3D 투영 면들 */}
        <polygon points="50,5 50,25 7,30" className="d20-face-outer" />
        <polygon points="50,5 93,30 50,25" className="d20-face-outer" />
        <polygon points="93,30 93,75 76,70" className="d20-face-outer" />
        <polygon points="93,75 50,95 76,70" className="d20-face-outer" />
        <polygon points="50,95 7,75 24,70" className="d20-face-outer" />
        <polygon points="7,75 7,30 24,70" className="d20-face-outer" />
        <polygon points="7,30 50,25 24,70" className="d20-face-outer" />
        <polygon points="93,30 50,25 76,70" className="d20-face-outer" />
        <polygon points="24,70 50,95 76,70" className="d20-face-outer" />
        
        {/* 내부 와이어프레임 입체 구분선 */}
        <line x1="50" y1="5" x2="50" y2="25" className="d20-line" />
        <line x1="93" y1="30" x2="50" y2="25" className="d20-line" />
        <line x1="93" y1="30" x2="76" y2="70" className="d20-line" />
        <line x1="93" y1="75" x2="76" y2="70" className="d20-line" />
        <line x1="50" y1="95" x2="76" y2="70" className="d20-line" />
        <line x1="50" y1="95" x2="24" y2="70" className="d20-line" />
        <line x1="7" y1="75" x2="24" y2="70" className="d20-line" />
        <line x1="7" y1="30" x2="24" y2="70" className="d20-line" />
        <line x1="7" y1="30" x2="50" y2="25" className="d20-line" />
        
        <polygon points="50,5 93,30 93,75 50,95 7,75 7,30" className="d20-outline" />
      </svg>
      <div className="d20-number" style={{ color: color || 'var(--color-crimson)' }}>
        {value}
      </div>
    </div>
  );
};

export default function SoloOracles({ character, setCharacter }) {
  const [activeSubTab, setActiveSubTab] = useState('general'); // 'general' | 'personality'

  // ==========================================
  // GENERAL SUB-TAB STATES
  // ==========================================
  const [d20Result, setD20Result] = useState(null);
  const [d6Count, setD6Count] = useState(1);
  const [d6Results, setD6Results] = useState([]);
  const [d6Sum, setD6Sum] = useState(0);
  const [targetSkill, setTargetSkill] = useState(10);
  const [rollResolution, setRollResolution] = useState(null);
  const [oracleAnswer, setOracleAnswer] = useState(null);
  const [generatedName, setGeneratedName] = useState(null);

  const [isRollingD20, setIsRollingD20] = useState(false);
  const [isRollingD6, setIsRollingD6] = useState(false);
  const [isRollingOracle, setIsRollingOracle] = useState(false);
  const [isRollingName, setIsRollingName] = useState(false);

  // ==========================================
  // PERSONALITY SUB-TAB STATES
  // ==========================================
  // 1. Trait Roll states
  const [selectedTraitPair, setSelectedTraitPair] = useState(0); // Index of traitPairs
  const [selectedTraitDirection, setSelectedTraitDirection] = useState('left'); // 'left' | 'right'
  const [traitModifier, setTraitModifier] = useState(0);
  const [traitRollResult, setTraitRollResult] = useState(null);
  const [isRollingTrait, setIsRollingTrait] = useState(false);

  // 2. Passion Roll states
  const [selectedPassionKey, setSelectedPassionKey] = useState('');
  const [passionModifier, setPassionModifier] = useState(0);
  const [passionRollResult, setPassionRollResult] = useState(null);
  const [isRollingPassion, setIsRollingPassion] = useState(false);
  const [isChivalryActive, setIsChivalryActive] = useState(false);
  const [passionActionApplied, setPassionActionApplied] = useState(false);

  // 3. Conflicting Emotions states
  const [emotionA, setEmotionA] = useState({ type: 'trait', key: 'just', label: '정의 (Just)', value: 10 });
  const [emotionB, setEmotionB] = useState({ type: 'trait', key: 'merciful', label: '자비 (Merciful)', value: 11 });
  const [emotionRollResult, setEmotionRollResult] = useState(null);
  const [isRollingEmotions, setIsRollingEmotions] = useState(false);

  // 4. Group Inspiration states
  const [groupKnights, setGroupKnights] = useState([
    { name: '롤랑 경 (Sir Roland)', passionScore: 16 },
    { name: '올리비에 경 (Sir Oliver)', passionScore: 14 },
    { name: '오지에 경 (Sir Ogier)', passionScore: 12 }
  ]);
  const [groupPassionName, setGroupPassionName] = useState('Honor');
  const [groupRollResult, setGroupRollResult] = useState(null);
  const [isRollingGroup, setIsRollingGroup] = useState(false);

  // 5. Introspection states
  const [selectedAmorKey, setSelectedAmorKey] = useState('loveFamily');
  const [introspectionResult, setIntrospectionResult] = useState(null);
  const [isRollingIntro, setIsRollingIntro] = useState(false);

  // 13 Trait pairs mapped with keys and Korean translations
  const traitPairs = [
    { left: 'chaste', leftKo: '정숙 (Chaste)', right: 'lustful', rightKo: '음탕 (Lustful)' },
    { left: 'energetic', leftKo: '열정 (Energetic)', right: 'lazy', rightKo: '나태 (Lazy)' },
    { left: 'forgiving', leftKo: '관용 (Forgiving)', right: 'vengeful', rightKo: '보복 (Vengeful)' },
    { left: 'generous', leftKo: '관대 (Generous)', right: 'selfish', rightKo: '이기 (Selfish)' },
    { left: 'honest', leftKo: '정직 (Honest)', right: 'deceitful', rightKo: '기만 (Deceitful)' },
    { left: 'just', leftKo: '정의 (Just)', right: 'arbitrary', rightKo: '독단 (Arbitrary)' },
    { left: 'merciful', leftKo: '자비 (Merciful)', right: 'cruel', rightKo: '잔혹 (Cruel)' },
    { left: 'modest', leftKo: '겸손 (Modest)', right: 'proud', rightKo: '오만 (Proud)' },
    { left: 'pious', leftKo: '신앙 (Pious)', right: 'worldly', rightKo: '세속 (Worldly)' },
    { left: 'prudent', leftKo: '신중 (Prudent)', right: 'reckless', rightKo: '무모 (Reckless)' },
    { left: 'temperate', leftKo: '절제 (Temperate)', right: 'indulgent', rightKo: '방종 (Indulgent)' },
    { left: 'trusting', leftKo: '신뢰 (Trusting)', right: 'suspicious', rightKo: '의심 (Suspicious)' },
    { left: 'valorous', leftKo: '용맹 (Valorous)', right: 'cowardly', rightKo: '겁쟁이 (Cowardly)' }
  ];

  const passionNamesKo = {
    loyaltyLiege: '주군에 대한 충성 (Loyalty [Liege])',
    loveFamily: '가족 사랑 (Love [Family])',
    hospitality: '손님 대접 (Hospitality)',
    honor: '기사의 명예 (Honor)',
    hateSarasens: '사라센인 증오 (Hate [Sarasens])',
    loveGod: '신에 대한 사랑 (Love [God])',
    hateSaxons: '작센인 증오 (Hate [Saxons])',
    hateMoors: '무어인 증오 (Hate [Moors])'
  };

  // ==========================================
  // GENERAL SUB-TAB LOGIC
  // ==========================================
  const resolveD20 = (roll, skill) => {
    if (roll === 20) return rollGrades.FUMBLE;
    if (roll === 1) return rollGrades.CRITICAL;
    if (roll === skill) return rollGrades.CRITICAL;
    if (roll < skill) return rollGrades.SUCCESS;
    return rollGrades.FAILURE;
  };

  const handleManualD20Result = (val) => {
    const num = Math.min(20, Math.max(1, parseInt(val) || 1));
    setD20Result(num);
    setRollResolution(resolveD20(num, targetSkill));
  };

  const handleTargetSkillChange = (val) => {
    const skill = parseInt(val) || 1;
    setTargetSkill(skill);
    if (d20Result) {
      setRollResolution(resolveD20(d20Result, skill));
    }
  };

  const getOracleAnswerFromRoll = (roll) => {
    if (roll <= 2) return yesNoOracle[0];
    if (roll <= 8) return yesNoOracle[1];
    if (roll <= 12) return yesNoOracle[2];
    if (roll <= 18) return yesNoOracle[3];
    return yesNoOracle[4];
  };

  const handleManualOracleRoll = (val) => {
    const num = Math.min(20, Math.max(1, parseInt(val) || 1));
    const match = getOracleAnswerFromRoll(num);
    setOracleAnswer({ roll: num, ...match });
  };

  const rollD20 = () => {
    if (isRollingD20) return;
    setIsRollingD20(true);
    setRollResolution(null);
    let counter = 0;
    const interval = setInterval(() => {
      const tempRoll = Math.floor(Math.random() * 20) + 1;
      setD20Result(tempRoll);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        setD20Result(finalRoll);
        setRollResolution(resolveD20(finalRoll, targetSkill));
        setIsRollingD20(false);
      }
    }, 50);
  };

  const rollD6Pool = () => {
    if (isRollingD6) return;
    setIsRollingD6(true);
    let counter = 0;
    const interval = setInterval(() => {
      const rolls = [];
      let sum = 0;
      for (let i = 0; i < d6Count; i++) {
        const r = Math.floor(Math.random() * 6) + 1;
        rolls.push(r);
        sum += r;
      }
      setD6Results(rolls);
      setD6Sum(sum);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        const rollsFinal = [];
        let sumFinal = 0;
        for (let i = 0; i < d6Count; i++) {
          const r = Math.floor(Math.random() * 6) + 1;
          rollsFinal.push(r);
          sumFinal += r;
        }
        setD6Results(rollsFinal);
        setD6Sum(sumFinal);
        setIsRollingD6(false);
      }
    }, 50);
  };

  const askOracle = () => {
    if (isRollingOracle) return;
    setIsRollingOracle(true);
    let counter = 0;
    const interval = setInterval(() => {
      const tempRoll = Math.floor(Math.random() * 20) + 1;
      const tempMatch = getOracleAnswerFromRoll(tempRoll);
      setOracleAnswer({ roll: tempRoll, ...tempMatch });
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        const match = getOracleAnswerFromRoll(finalRoll);
        setOracleAnswer({ roll: finalRoll, ...match });
        setIsRollingOracle(false);
      }
    }, 50);
  };

  const generateFrankishName = () => {
    if (isRollingName) return;
    setIsRollingName(true);
    let counter = 0;
    const interval = setInterval(() => {
      const isMale = Math.random() > 0.5;
      const namePool = isMale ? maleNames : femaleNames;
      const name = namePool[Math.floor(Math.random() * namePool.length)];
      const surname = surnames[Math.floor(Math.random() * surnames.length)];
      const title = titles[Math.floor(Math.random() * titles.length)];
      const loc = locations[Math.floor(Math.random() * locations.length)];
      setGeneratedName({
        title, name, surname, loc,
        fullTextEN: `${title.en} ${name.en} ${surname.en} of ${loc.en}`,
        fullTextKO: `${title.ko} ${name.ko} ${surname.ko} ${loc.ko}`
      });
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        const isMaleFinal = Math.random() > 0.5;
        const namePoolFinal = isMaleFinal ? maleNames : femaleNames;
        const nameFinal = namePoolFinal[Math.floor(Math.random() * namePoolFinal.length)];
        const surnameFinal = surnames[Math.floor(Math.random() * surnames.length)];
        const titleFinal = titles[Math.floor(Math.random() * titles.length)];
        const locFinal = locations[Math.floor(Math.random() * locations.length)];
        setGeneratedName({
          title: titleFinal, name: nameFinal, surname: surnameFinal, loc: locFinal,
          fullTextEN: `${titleFinal.en} ${nameFinal.en} ${surnameFinal.en} of ${locFinal.en}`,
          fullTextKO: `${titleFinal.ko} ${nameFinal.ko} ${surnameFinal.ko} ${locFinal.ko}`
        });
        setIsRollingName(false);
      }
    }, 50);
  };

  const applyName = () => {
    if (!generatedName) return;
    const cleanName = `${generatedName.name.en} ${generatedName.surname.en}`;
    setCharacter(prev => ({ ...prev, personal: { ...prev.personal, name: cleanName, homeland: generatedName.loc.en } }));
    alert(`[${cleanName}]이 기사 시트에 적용되었습니다!`);
  };


  // ==========================================
  // PERSONALITY SUB-TAB LOGIC (Chapter 3)
  // ==========================================
  
  // Helper to get trait values dynamically
  const getTraitValue = (key) => {
    return character?.traits?.[key] ?? 10;
  };

  // Helper to get passion values dynamically
  const getPassionValue = (key) => {
    return character?.passions?.[key] ?? 10;
  };

  // 1. Trait Roll Execution
  const executeTraitRoll = () => {
    if (isRollingTrait) return;
    setIsRollingTrait(true);
    setTraitRollResult(null);

    const activePair = traitPairs[selectedTraitPair];
    const rolledKey = selectedTraitDirection === 'left' ? activePair.left : activePair.right;
    const opposedKey = selectedTraitDirection === 'left' ? activePair.right : activePair.left;
    const rolledKo = selectedTraitDirection === 'left' ? activePair.leftKo : activePair.rightKo;
    const opposedKo = selectedTraitDirection === 'left' ? activePair.rightKo : activePair.leftKo;

    const baseValue = getTraitValue(rolledKey);
    const modifiedTarget = baseValue + parseInt(traitModifier);

    let counter = 0;
    const interval = setInterval(() => {
      const tempRoll = Math.floor(Math.random() * 20) + 1;
      setTraitRollResult({
        roll: tempRoll,
        key: rolledKey,
        opposedKey,
        rolledKo,
        opposedKo,
        baseValue,
        modifiedTarget,
        isRolling: true
      });
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        
        let outcome = '';
        let desc = '';
        let color = '';
        let checkRequired = false;
        let oppositeCheckRequired = false;
        let opposedRollVal = null;
        let opposedOutcome = '';

        if (finalRoll === 20) {
          outcome = '펌블 (Fumble) ⚠️';
          desc = `최악의 성향 무너짐! 즉시 반대 성향 [${opposedKo}]에 경험치 성장 체크를 기록하며, 본래 의지와 달리 반대 성향의 충동에 완전히 휩쓸려 충동적으로 행동해야 합니다.`;
          color = 'var(--color-crimson)';
          oppositeCheckRequired = true;
        } else if (finalRoll === 1 || finalRoll === modifiedTarget) {
          outcome = '결정적 성공 (Critical Success) 🌟';
          desc = `완벽한 도덕성 증명! 본 성향 [${rolledKo}]에 즉각 경험치 체크(Checked)가 주어집니다. 기사는 명예롭고 overt하며 타인이 즉각 알아챌 수준의 성스러운 성격 묘사 위업을 직접 대변합니다!`;
          color = 'var(--color-success)';
          checkRequired = true;
        } else if (finalRoll < modifiedTarget) {
          outcome = '성공 (Success) ✓';
          desc = `마음이 성향에 맞춰 동요합니다. 기사는 [${rolledKo}] 규칙에 맞춰 행동해야 합니다. 플레이어는 이를 성실히 받아들이면 경험치 체크를 획득할 수 있습니다.\n\n*만약 플레이어가 이를 거역하고 반대로 억지 행동을 취할 경우, 반대 성향 [${opposedKo}]에 체크 패널티가 기록됩니다.`;
          color = 'var(--color-royal-blue)';
          checkRequired = true;
        } else {
          // Failure: Opposed roll triggered!
          const opposedBase = getTraitValue(opposedKey);
          opposedRollVal = Math.floor(Math.random() * 20) + 1;
          
          if (opposedRollVal === 20 || opposedRollVal < opposedBase) {
            outcome = '실패 -> 반대 성향 주도 ⚖️';
            desc = `본 성향 굴림 실패 후, 기사의 내면에 잠재된 반대 욕망 [${opposedKo}: 스탯 ${opposedBase}]이 주도권을 잡았습니다 (반대 d20 굴림: ${opposedRollVal}). 의지와 관계없이 [${opposedKo}]의 충동에 따라 이끌리듯 행동하게 됩니다.`;
            color = 'var(--color-gold-dark)';
            opposedOutcome = 'Opposed Won';
          } else {
            outcome = '실패 -> 이성의 제어 성공 🛡️';
            desc = `본 성향과 반대 욕망 모두 제어에 실패했습니다. 하지만 이는 기사가 마침내 철저한 이성적 이치로 스스로를 제어했음을 대변합니다! 아무런 내적 충동 구애 없이 플레이어가 100% 완벽하게 자유 의지로 행동을 직접 결정할 수 있습니다!`;
            color = 'var(--color-grey)';
            opposedOutcome = 'Free Will';
          }
        }

        setTraitRollResult({
          roll: finalRoll,
          key: rolledKey,
          opposedKey,
          rolledKo,
          opposedKo,
          baseValue,
          modifiedTarget,
          outcome,
          desc,
          color,
          checkRequired,
          oppositeCheckRequired,
          opposedRollVal,
          opposedOutcome,
          isRolling: false
        });
        setIsRollingTrait(false);
      }
    }, 50);
  };

  // Trait action sheet apply
  const applyTraitOutcome = (type) => {
    if (!traitRollResult) return;
    
    const key = traitRollResult.key;
    const opposedKey = traitRollResult.opposedKey;
    const ko = traitRollResult.rolledKo;
    const oppKo = traitRollResult.opposedKo;

    if (type === 'fumble' || type === 'act_opposite') {
      alert(`[반대 성향 페널티]: ${oppKo}의 충동이 기록되었습니다! 다음 겨울 정산 시 ${oppKo} 성장을 굴릴 수 있는 자격을 획득합니다.`);
    } else {
      alert(`[특성 반영 완료]: 성향 [${ko}]이 기사의 서사 행동에 숭고히 반영되었습니다!`);
    }
  };

  // 2. Passion Roll Execution
  const executePassionRoll = () => {
    if (!selectedPassionKey) {
      alert('판정할 열정(Passion)을 먼저 선택해 주세요!');
      return;
    }
    if (isRollingPassion) return;
    setIsRollingPassion(true);
    setPassionRollResult(null);
    setPassionActionApplied(false);

    const baseValue = getPassionValue(selectedPassionKey);
    const modifiedTarget = baseValue + parseInt(passionModifier);
    const passionKo = passionNamesKo[selectedPassionKey] || selectedPassionKey;

    let counter = 0;
    const interval = setInterval(() => {
      const tempRoll = Math.floor(Math.random() * 20) + 1;
      setPassionRollResult({
        roll: tempRoll,
        key: selectedPassionKey,
        passionKo,
        baseValue,
        modifiedTarget,
        isRolling: true
      });
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 20) + 1;

        let outcome = '';
        let state = ''; // 'inspiration' | 'disheartened' | 'madness'
        let skillBonus = 0;
        let desc = '';
        let color = '';

        if (finalRoll === 20) {
          outcome = '펌블 (Fumble) 💀';
          state = 'madness';
          desc = `광란(Madness) 대폭발! 주군의 명령이나 연인의 사랑을 저버리는 끔찍한 절망 속에 기사는 온 정신이 무너져 즉각 '광기 상태'에 돌입합니다. 신체적 능력치가 일시 감퇴하며 광기 전용 솔로 시나리오(p.431)로 돌입해야 합니다. 열정 수치 -1 하락 페널티가 부여됩니다.`;
          color = 'var(--color-crimson)';
        } else if (finalRoll === 1 || finalRoll === modifiedTarget) {
          outcome = '결정적 성공 (Critical Success) 👑';
          state = 'inspiration';
          skillBonus = isChivalryActive ? 20 : 10;
          desc = `위대한 팔라딘의 현현! 성스러운 힘이 뼈마디를 채우며 '초극의 영감 고취(Inspired)' 상태가 됩니다. 하루 동안 모든 기사 기술(Skills) 판정에 [ +${skillBonus} ] 보정치를 일괄 가산합니다! 전투/모험 임무를 찬란하게 극복 시 열정 수치 +1이 상승합니다.`;
          color = 'var(--color-success)';
        } else if (finalRoll < modifiedTarget) {
          outcome = '성공 (Success) 🛡️';
          state = 'inspiration';
          skillBonus = isChivalryActive ? 10 : 5;
          desc = `강력한 신념의 고양! 기사의 사기와 투지가 치솟으며 '영감 고취(Inspired)' 상태가 됩니다. 하루 동안 모든 기사 기술(Skills) 판정에 [ +${skillBonus} ] 보정치를 가산합니다! 임무 극복 성공 시 열정 체크를 획득합니다.`;
          color = 'var(--color-royal-blue)';
        } else {
          outcome = '실패 (Failure) 🕯️';
          state = 'disheartened';
          desc = `사기 저하 및 슬픔! 전의를 상실해 기사는 '낙담(Disheartened)' 상태에 들어갑니다. 상황이 끝날 때까지 모든 판정에 [ -5 ] 페널티를 받으며, 상황이 종결된 후 즉각 깊은 '우울증(Melancholy)' 장벽에 가로막힙니다. 극복하지 못할 경우 열정 수치 -1 하락.`;
          color = 'var(--color-gold-dark)';
        }

        setPassionRollResult({
          roll: finalRoll,
          key: selectedPassionKey,
          passionKo,
          baseValue,
          modifiedTarget,
          outcome,
          state,
          skillBonus,
          desc,
          color,
          isRolling: false
        });
        setIsRollingPassion(false);
      }
    }, 50);
  };

  const applyPassionResolution = (successType) => {
    if (!passionRollResult || passionActionApplied) return;

    const key = passionRollResult.key;
    const ko = passionRollResult.passionKo;

    setCharacter(prev => {
      const updated = { ...prev };
      
      if (passionRollResult.state === 'inspiration') {
        if (successType === 'success') {
          // Success action: Gained Passion Check OR +1 for critical
          if (passionRollResult.roll === 1 || passionRollResult.roll === passionRollResult.modifiedTarget) {
            updated.passions[key] = Math.min(20, (updated.passions[key] || 10) + 1);
            alert(`[열망 상승 완료]: 전공 완수! ${ko} 수치가 +1 상승하였습니다!`);
          } else {
            updated.passionsChecked[key] = true;
            alert(`[경험 체크 완료]: 전공 완수! ${ko}에 겨울 성장용 경험 체크를 누적했습니다.`);
          }
        } else if (successType === 'fail') {
          // Shock! (Aging table d20)
          alert(`[기사의 쇼크 충격!]: 열정 영감으로도 극복하지 못해 정신적 쇼크(Shock)가 닥칩니다! 가문&겨울 탭의 노화 d20 판정(Aging Table)을 즉각 1회 실행하세요.`);
        }
      } else if (passionRollResult.state === 'disheartened') {
        if (successType === 'success') {
          // Overcome: Passion +1
          updated.passions[key] = Math.min(20, (updated.passions[key] || 10) + 1);
          alert(`[역경 극복]: 극적인 사투 끝에 낙담을 물리쳤습니다! ${ko} 수치가 +1 상승했습니다!`);
        } else {
          // Melancholy and -1 passion
          updated.passions[key] = Math.max(1, (updated.passions[key] || 10) - 1);
          alert(`[우울증 봉착]: 깊은 슬픔(Melancholy) 속에 기사는 침잠합니다. ${ko} 수치가 -1 하락하는 참담한 상처를 받았습니다.`);
        }
      } else if (passionRollResult.state === 'madness') {
        updated.passions[key] = Math.max(1, (updated.passions[key] || 10) - 1);
        alert(`[광기 적용]: 기사는 이성을 잃고 야만인처럼 울부짖으며 들판으로 사라집니다! ${ko} 수치가 -1 하락했습니다.`);
      }

      return updated;
    });

    setPassionActionApplied(true);
  };

  // 3. Conflicting Emotions Execution
  const executeEmotionRoll = () => {
    if (isRollingEmotions) return;
    setIsRollingEmotions(true);
    setEmotionRollResult(null);

    let counter = 0;
    const interval = setInterval(() => {
      const rollA = Math.floor(Math.random() * 20) + 1;
      const rollB = Math.floor(Math.random() * 20) + 1;
      setEmotionRollResult({
        rollA,
        rollB,
        isRolling: true
      });
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        
        const finalRollA = Math.floor(Math.random() * 20) + 1;
        const finalRollB = Math.floor(Math.random() * 20) + 1;
        
        // Resolve matching values
        const valA = emotionA.value;
        const valB = emotionB.value;

        // Opposed resolution: Whoever rolls lower or equal to stat and higher than the other wins.
        // Simplified TRPG resolution: Success roll defeats failure, higher success defeats lower success.
        const successA = finalRollA <= valA;
        const successB = finalRollB <= valB;

        let winner = '';
        let textResult = '';
        let color = '';

        if (successA && !successB) {
          winner = 'A';
          textResult = `[${emotionA.label}]가 승리했습니다! 기사는 마음속 정의롭거나 신성한 신념에 감회되어 이 결정을 따릅니다.`;
          color = 'var(--color-success)';
        } else if (!successA && successB) {
          winner = 'B';
          textResult = `[${emotionB.label}]가 승리했습니다! 기사는 따뜻한 자비 혹은 원초적 충동에 굴복하여 결정을 따릅니다.`;
          color = 'var(--color-crimson)';
        } else if (successA && successB) {
          if (finalRollA > finalRollB) {
            winner = 'A';
            textResult = `두 충동이 치열히 갈등했으나, 더 높은 주사위 강도를 지닌 [${emotionA.label}]가 이겼습니다!`;
            color = 'var(--color-success)';
          } else if (finalRollB > finalRollA) {
            winner = 'B';
            textResult = `두 충동이 충돌했으나, 더 높은 강도를 뿜어낸 [${emotionB.label}]가 주도했습니다!`;
            color = 'var(--color-crimson)';
          } else {
            winner = 'None';
            textResult = `기이할 정도로 두 신념이 평형을 이룹니다. 플레이어가 원하는 내러티브 결단을 자유롭게 선언하십시오.`;
            color = 'var(--color-grey)';
          }
        } else {
          winner = 'None';
          textResult = `두 감정 모두 아무런 신념을 주지 못했습니다. 기사는 잠시 깊은 사색(Free Choice) 속에 자기 통제력을 유지합니다.`;
          color = 'var(--color-grey)';
        }

        setEmotionRollResult({
          rollA: finalRollA,
          rollB: finalRollB,
          winner,
          textResult,
          color,
          isRolling: false
        });
        setIsRollingEmotions(false);
      }
    }, 50);
  };

  // 4. Group Inspiration Execution
  const executeGroupRoll = () => {
    if (isRollingGroup) return;
    setIsRollingGroup(true);
    setGroupRollResult(null);

    let counter = 0;
    const interval = setInterval(() => {
      const tempRoll = Math.floor(Math.random() * 20) + 1;
      setGroupRollResult({
        roll: tempRoll,
        isRolling: true
      });
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        
        // Compare single roll to each individual's score
        let successesCount = 0;
        let criticalsCount = 0;
        let fumblesCount = 0;

        const details = groupKnights.map(k => {
          let indRes = '';
          if (finalRoll === 20) {
            indRes = '펌블 (광기 위험)';
            fumblesCount++;
          } else if (finalRoll === 1 || finalRoll === k.passionScore) {
            indRes = '결정적 성공 ( Inspired +10 )';
            criticalsCount++;
            successesCount++;
          } else if (finalRoll < k.passionScore) {
            indRes = '성공 ( Inspired +5 )';
            successesCount++;
          } else {
            indRes = '실패 (낙담 -5)';
          }
          return { ...k, result: indRes };
        });

        // Determine average group outcome
        let finalGroupOutcome = '실패 (낙담)';
        let groupDesc = `부대 사기 저하! 연설이 와닿지 못했습니다. 동료 기사 전원 '낙담(Disheartened)' 상태에 빠집니다. (모든 롤에 -5 페널티)`;
        let color = 'var(--color-gold-dark)';

        if (successesCount === groupKnights.length) {
          finalGroupOutcome = '대성공 (영감 대고취)';
          groupDesc = `완벽한 군대의 탄생! 우레와 같은 결의 속에 기사단 전원이 한마음으로 '영감 고취(Inspired)'에 돌입합니다! (스킬 각 +5/+10 부여)`;
          color = 'var(--color-success)';
        } else if (successesCount >= 2) {
          finalGroupOutcome = '성공 (사기 진작)';
          groupDesc = `충분한 기개! 과반수 이상의 기사가 고취되어 다수가 Inspired 보정 효과를 누리며 영웅적 대열을 갖춥니다!`;
          color = 'var(--color-royal-blue)';
        } else if (fumblesCount > 0) {
          finalGroupOutcome = '재앙적 펌블 (대혼란)';
          groupDesc = `연설 도중 끔찍한 도발이나 비열함이 노출되어 대혼란과 광기가 무리에 엄습합니다! 일부는 대장에게 분노합니다.`;
          color = 'var(--color-crimson)';
        }

        setGroupRollResult({
          roll: finalRoll,
          details,
          finalGroupOutcome,
          groupDesc,
          color,
          isRolling: false
        });
        setIsRollingGroup(false);
      }
    }, 50);
  };

  // 5. Introspection Roll Execution
  const executeIntrospectionRoll = () => {
    if (isRollingIntro) return;
    setIsRollingIntro(true);
    setIntrospectionResult(null);

    const baseVal = getPassionValue(selectedAmorKey);
    const amorKo = passionNamesKo[selectedAmorKey] || selectedAmorKey;

    let counter = 0;
    const interval = setInterval(() => {
      const tempRoll = Math.floor(Math.random() * 20) + 1;
      setIntrospectionResult({
        roll: tempRoll,
        isRolling: true
      });
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        let isDazed = false;
        let title = '평온함';
        let desc = '기사는 현실의 임무에 또렷이 집중하고 있습니다. 정상적인 모험 활동이 가능합니다.';
        let color = 'var(--color-grey)';

        if (finalRoll === 1 || finalRoll <= 3) {
          isDazed = true;
          title = '사랑의 자기성찰 (Introspection) Daze! 🌌';
          desc = `황홀경 돌입! 기사의 눈앞에 문득 연인(Amor)의 고운 실루엣과 하얀 손길이 몽환적으로 떠오릅니다. 향후 [ 4d6분 ] 동안 깊은 트랜스 상태에 빠집니다. 이 시간 동안 감각(Awareness), 지식, 통찰 등 모든 인지 스킬 굴림이 전원 원천 금지됩니다! 단, 적들의 기습을 방어하는 개인 호신전투 중에는 Inspired(+5) 보정을 정상 획득합니다.`;
          color = 'var(--color-success)';
        } else {
          title = '마음의 안정 유지 ✓';
          desc = '연인에 대한 그리움이 깊으나, 기사로서의 기품과 평정심을 유지하며 눈앞의 장애물에 집중합니다.';
          color = 'var(--color-royal-blue)';
        }

        setIntrospectionResult({
          roll: finalRoll,
          title,
          desc,
          color,
          baseVal,
          amorKo,
          isRolling: false
        });
        setIsRollingIntro(false);
      }
    }, 50);
  };

  // Helper for rendering custom select options
  const renderTraitOptions = () => {
    return traitPairs.map((p, index) => {
      const lVal = getTraitValue(p.left);
      const rVal = getTraitValue(p.right);
      return (
        <option key={index} value={index}>
          {p.leftKo} ({lVal}) vs {p.rightKo} ({rVal})
        </option>
      );
    });
  };

  const getPassionKeys = () => {
    return character?.passions ? Object.keys(character.passions) : [];
  };

  return (
    <div className="cs-page view-animate">
      
      {/* Dynamic Character Profile Banner */}
      <div className="tutorial-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h4 className="tutorial-banner-title">
            🛡️ {character?.personal?.name || '기사'}의 오라클 성소
          </h4>
          <p>
            명예: {character?.gear?.gloryTotal || 1000} Glory &bull; {character?.personal?.lineage || '가문'} 가신 기사
          </p>
        </div>
        
        {/* Interactive Sub-tab toggle buttons */}
        <div className="sub-tab-navigation" style={{ display: 'flex', gap: '8px', margin: 0 }}>
          <button 
            className={`tab-btn btn-medieval ${activeSubTab === 'general' ? 'active' : ''}`} 
            onClick={() => setActiveSubTab('general')}
            style={{ padding: '6px 12px', fontSize: '0.8rem', minWidth: '130px', justifyContent: 'center' }}
          >
            <Dices size={14} style={{ marginRight: '4px' }} /> 일반 판정 &amp; 오라클
          </button>
          <button 
            className={`tab-btn btn-medieval ${activeSubTab === 'personality' ? 'active' : ''}`} 
            onClick={() => setActiveSubTab('personality')}
            style={{ padding: '6px 12px', fontSize: '0.8rem', minWidth: '160px', justifyContent: 'center', borderLeft: '1px solid var(--color-gold-light)' }}
          >
            <Sparkles size={14} style={{ marginRight: '4px' }} /> 챕터 3: 성격 &amp; 열정 판정
          </button>
        </div>
      </div>

      {/* ========================================================
          SUB-TAB 1: GENERAL ORACLES & BASIC DICE
          ======================================================== */}
      {activeSubTab === 'general' && (
        <>
          {/* Dice row */}
          <div className="cs-row">
            {/* d20 */}
            <section className="cs-section">
              <div className="sheet-ribbon"><h3><Dices size={16} style={{ marginRight: '6px' }} />d20 판정기</h3></div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="cs-field" style={{ margin: 0 }}>
                    <span className="cs-field-label">기준값:</span>
                    <input 
                      type="number" 
                      value={targetSkill} 
                      min={1} max={20}
                      onChange={e => handleTargetSkillChange(e.target.value)} 
                      style={{ width: '100%' }} 
                    />
                  </div>
                  <div className="cs-field" style={{ margin: 0 }}>
                    <span className="cs-field-label" style={{ color: 'var(--color-gold-dark)' }}>🎲 직접 입력 (d20):</span>
                    <input 
                      type="number" 
                      value={d20Result || ''} 
                      min={1} max={20}
                      placeholder="눈 입력"
                      onChange={e => handleManualD20Result(e.target.value)} 
                      style={{ width: '100%', fontWeight: 'bold', color: 'var(--color-crimson)', textAlign: 'center' }} 
                    />
                  </div>
                </div>
                <button className="btn-medieval btn-medieval-primary" onClick={rollD20} style={{ justifyContent: 'center' }} disabled={isRollingD20}>
                  {isRollingD20 ? "주사위 굴리는 중..." : "d20 판정 던지기"}
                </button>
                {d20Result && (
                  <div style={{ border: '1px solid var(--color-gold)', background: 'rgba(179,143,67,0.03)', padding: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-grey)', textTransform: 'uppercase', marginBottom: '4px' }}>판정 주사위</span>
                    <D20Face value={d20Result} isRolling={isRollingD20} color={rollResolution?.color} />
                    {rollResolution && !isRollingD20 && (
                      <div style={{ marginTop: '8px' }}>
                        <h4 style={{ color: rollResolution.color, fontWeight: 'bold', fontSize: '1rem' }}>{rollResolution.title}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', marginTop: '2px', whiteSpace: 'pre-line' }}>{rollResolution.desc}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* d6 */}
            <section className="cs-section">
              <div className="sheet-ribbon"><h3><Dices size={16} style={{ marginRight: '6px' }} />d6 피해 롤러</h3></div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="cs-field">
                  <span className="cs-field-label">주사위 수:</span>
                  <input type="number" value={d6Count} min={1} max={15}
                    onChange={e => setD6Count(parseInt(e.target.value) || 1)} style={{ maxWidth: '80px' }} />
                </div>
                <button className="btn-medieval btn-medieval-primary" onClick={rollD6Pool} style={{ justifyContent: 'center' }} disabled={isRollingD6}>
                  {isRollingD6 ? "피해 굴리는 중..." : "d6 피해 굴리기"}
                </button>
                {d6Results.length > 0 && (
                  <div style={{ border: '1px solid var(--color-gold-light)', padding: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                      {d6Results.map((r, i) => (
                        <DiceFace key={i} value={r} isRolling={isRollingD6} />
                      ))}
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                      합계: <span style={{ color: 'var(--color-crimson)', fontSize: '1.3rem' }}>{d6Sum}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Oracle + Name Gen row */}
          <div className="cs-row">
            {/* Oracle */}
            <section className="cs-section">
              <div className="sheet-ribbon"><h3><HelpCircle size={16} style={{ marginRight: '6px' }} />예/아니오 오라클</h3></div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)', margin: 0 }}>
                  상황에 대한 질문을 떠올리고 운명에 물어보세요:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '8px', alignItems: 'center' }}>
                  <button className="btn-medieval" onClick={askOracle} style={{ justifyContent: 'center', height: '38px', margin: 0 }} disabled={isRollingOracle}>
                    {isRollingOracle ? "신탁 묻는 중..." : "오라클에 묻기"}
                  </button>
                  <div className="cs-field" style={{ margin: 0, height: '38px', padding: '0 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="cs-field-label" style={{ fontSize: '0.72rem', whiteSpace: 'nowrap', color: 'var(--color-gold-dark)' }}>🎲 d20:</span>
                    <input 
                      type="number" 
                      value={oracleAnswer?.roll || ''} 
                      min={1} max={20}
                      placeholder="눈"
                      onChange={e => handleManualOracleRoll(e.target.value)} 
                      style={{ width: '100%', fontWeight: 'bold', color: 'var(--color-crimson)', textAlign: 'center', padding: '4px' }} 
                    />
                  </div>
                </div>
                {oracleAnswer && (
                  <div style={{ border: '1px solid var(--color-gold)', background: 'rgba(179,143,67,0.03)', padding: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-grey)', marginBottom: '4px' }}>신탁 주사위</span>
                    <D20Face value={oracleAnswer.roll} isRolling={isRollingOracle} color="var(--color-crimson)" />
                    <div className={isRollingOracle ? "roll-blur" : ""} style={{ marginTop: '8px' }}>
                      <h4 style={{ color: 'var(--color-crimson)', fontWeight: 'bold', fontSize: '1.05rem', margin: '4px 0' }}>{oracleAnswer.result}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)' }}>{oracleAnswer.desc}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Name Gen */}
            <section className="cs-section">
              <div className="sheet-ribbon"><h3><RefreshCw size={16} style={{ marginRight: '6px' }} />이름 생성기</h3></div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)' }}>
                  프랑크인 이름과 작위를 자동 생성합니다:
                </p>
                <button className="btn-medieval" onClick={generateFrankishName} style={{ justifyContent: 'center' }} disabled={isRollingName}>
                  {isRollingName ? "이름 모색 중..." : "이름 생성"}
                </button>
                {generatedName && (
                  <div style={{ border: '1px solid var(--color-gold)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className={isRollingName ? "roll-blur" : ""} style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px dashed var(--color-gold-light)', paddingBottom: '6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                        <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-crimson)' }}>
                          {generatedName.title.en} {generatedName.name.en}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)', marginLeft: '8px', fontWeight: 'normal' }}>
                          ({generatedName.title.ko} {generatedName.name.ko})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.95rem' }}>
                        <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold-dark)' }}>
                          {generatedName.surname.en} of {generatedName.loc.en}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-grey)', marginLeft: '8px' }}>
                          ({generatedName.surname.ko} {generatedName.loc.ko})
                        </span>
                      </div>
                    </div>
                    <button className="btn-medieval" onClick={applyName} style={{ fontSize: '0.8rem', padding: '3px 8px', justifyContent: 'center' }} disabled={isRollingName}>
                      시트에 적용
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Quick Reference */}
          <section className="cs-section">
            <div className="sheet-ribbon"><h3>솔로 규칙 요약집</h3></div>
            <div className="cs-section-inner">
              <div className="cs-row" style={{ gap: '16px' }}>
                {soloScenariosRef.map((sc, i) => (
                  <div key={i} style={{ flex: '1 1 250px', minWidth: 0, borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '10px' }}>
                    <h4 style={{ color: 'var(--color-royal-blue)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>
                      {sc.name}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', marginBottom: '6px' }}>{sc.desc}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '8px', borderLeft: '2px solid var(--color-gold-light)' }}>
                      {sc.flow.map((f, fi) => (
                        <span key={fi} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <ArrowRight size={9} color="var(--color-gold)" />{f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ========================================================
          SUB-TAB 2: CHAPTER 3 PERSONALITY TRAITS & PASSIONS
          ======================================================== */}
      {activeSubTab === 'personality' && (
        <>
          {/* Section 1: Traits and Passions Rollers */}
          <div className="cs-row">
            
            {/* 1. 성격 특성 판정기 (Trait Roller) */}
            <section className="cs-section" style={{ flex: '1 1 450px' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-royal-blue)' }}>
                <h3><Shield size={16} style={{ marginRight: '6px' }} />성격 특성(Traits) 판정기 (p.70-71)</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: 0 }}>
                  상황에서 기사가 어떤 비이성적 충동이나 신조적 행동을 할지 주사위 d20으로 가늠합니다.
                </p>

                {/* Trait selector */}
                <div className="cs-field">
                  <span className="cs-field-label">성격 스펙트럼 선택:</span>
                  <select 
                    value={selectedTraitPair}
                    onChange={e => {
                      setSelectedTraitPair(parseInt(e.target.value));
                      setTraitRollResult(null);
                    }}
                    style={{ width: '100%', padding: '6px' }}
                  >
                    {renderTraitOptions()}
                  </select>
                </div>

                {/* Direct trait toggle */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(0,0,0,0.02)', padding: '8px', border: '1px solid var(--color-grey-light)' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '6px', border: selectedTraitDirection === 'left' ? '2px solid var(--color-royal-blue)' : '2px solid transparent', background: selectedTraitDirection === 'left' ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }}>
                    <input 
                      type="radio" 
                      name="traitDirection" 
                      checked={selectedTraitDirection === 'left'}
                      onChange={() => {
                        setSelectedTraitDirection('left');
                        setTraitRollResult(null);
                      }}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-ink)' }}>
                      {traitPairs[selectedTraitPair].leftKo.split(' ')[0]}
                    </span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-royal-blue)', marginTop: '4px' }}>
                      {getTraitValue(traitPairs[selectedTraitPair].left)}
                    </span>
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '6px', border: selectedTraitDirection === 'right' ? '2px solid var(--color-royal-blue)' : '2px solid transparent', background: selectedTraitDirection === 'right' ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }}>
                    <input 
                      type="radio" 
                      name="traitDirection" 
                      checked={selectedTraitDirection === 'right'}
                      onChange={() => {
                        setSelectedTraitDirection('right');
                        setTraitRollResult(null);
                      }}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-ink)' }}>
                      {traitPairs[selectedTraitPair].rightKo.split(' ')[0]}
                    </span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-royal-blue)', marginTop: '4px' }}>
                      {getTraitValue(traitPairs[selectedTraitPair].right)}
                    </span>
                  </label>
                </div>

                {/* Modifiers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="cs-field" style={{ margin: 0 }}>
                    <span className="cs-field-label">상황적 보정치 (Modifier):</span>
                    <input 
                      type="number" 
                      value={traitModifier} 
                      onChange={e => {
                        setTraitModifier(parseInt(e.target.value) || 0);
                        setTraitRollResult(null);
                      }}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="cs-field" style={{ margin: 0, opacity: 0.85 }}>
                    <span className="cs-field-label">최종 판정 목표치:</span>
                    <div style={{ display: 'flex', alignItems: 'center', height: '36px', paddingLeft: '8px', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--color-crimson)' }}>
                      {getTraitValue(selectedTraitDirection === 'left' ? traitPairs[selectedTraitPair].left : traitPairs[selectedTraitPair].right) + parseInt(traitModifier)} 이하
                    </div>
                  </div>
                </div>

                {/* Roll button */}
                <button 
                  className="btn-medieval btn-medieval-primary" 
                  onClick={executeTraitRoll}
                  style={{ justifyContent: 'center' }}
                  disabled={isRollingTrait}
                >
                  {isRollingTrait ? '주사위가 구르는 중...' : '성격 특성 주사위 던지기'}
                </button>

                {/* Trait Roll result display */}
                {traitRollResult && (
                  <div style={{ border: `2px solid ${traitRollResult.color}`, background: 'rgba(0,0,0,0.01)', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)', marginBottom: '4px' }}>d20 결과</span>
                    <D20Face value={traitRollResult.roll} isRolling={isRollingTrait} color={traitRollResult.color} />
                    
                    {!traitRollResult.isRolling && (
                      <div style={{ marginTop: '10px', textAlign: 'center', width: '100%' }}>
                        <h4 style={{ color: traitRollResult.color, fontWeight: 'bold', fontSize: '1.1rem', margin: '4px 0' }}>
                          {traitRollResult.outcome}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', whiteSpace: 'pre-line', margin: '8px 0' }}>
                          {traitRollResult.desc}
                        </p>
                        
                        {/* Interactive consequence buttons */}
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
                          {traitRollResult.checkRequired && (
                            <button 
                              className="btn-medieval" 
                              onClick={() => applyTraitOutcome('checked')}
                              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                            >
                              ✓ 신조대로 행동 (영광 반영)
                            </button>
                          )}
                          {traitRollResult.checkRequired && (
                            <button 
                              className="btn-medieval" 
                              onClick={() => applyTraitOutcome('act_opposite')}
                              style={{ fontSize: '0.75rem', padding: '4px 8px', borderColor: 'var(--color-crimson)', color: 'var(--color-crimson)' }}
                            >
                              ✗ 유혹 굴복 (반대 성정 페널티)
                            </button>
                          )}
                          {traitRollResult.oppositeCheckRequired && (
                            <button 
                              className="btn-medieval" 
                              onClick={() => applyTraitOutcome('fumble')}
                              style={{ fontSize: '0.75rem', padding: '4px 8px', borderColor: 'var(--color-crimson)', color: 'var(--color-crimson)' }}
                            >
                              ☠️ 펌블 충동 굴복 확인
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* 2. 열정 & 영감 판정기 (Passion Roller) */}
            <section className="cs-section" style={{ flex: '1 1 450px' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-crimson)' }}>
                <h3><Flame size={16} style={{ marginRight: '6px' }} />열정(Passions) &amp; 영감 롤러 (p.78-79)</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: 0 }}>
                  가족이나 주군을 향한 열정을 불태워 전투 및 스킬 판정에 위대한 초인적인 보정치(Inspiration)를 불어넣습니다.
                </p>

                {/* Passion selector */}
                <div className="cs-field">
                  <span className="cs-field-label">보유한 열정 선택:</span>
                  <select 
                    value={selectedPassionKey}
                    onChange={e => {
                      setSelectedPassionKey(e.target.value);
                      setPassionRollResult(null);
                      setPassionActionApplied(false);
                    }}
                    style={{ width: '100%', padding: '6px' }}
                  >
                    <option value="">-- 열정 선택 --</option>
                    {getPassionKeys().map(key => (
                      <option key={key} value={key}>
                        {passionNamesKo[key] || key} ({getPassionValue(key)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Options (Chivalry / Romance) */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={isChivalryActive}
                      onChange={e => {
                        setIsChivalryActive(e.target.checked);
                        setPassionRollResult(null);
                      }}
                    />
                    🛡️ 기사도/로맨스 보너스 활성화 (Inspiration 효과 2배!)
                  </label>
                </div>

                {/* Modifiers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="cs-field" style={{ margin: 0 }}>
                    <span className="cs-field-label">상황적 보정치 (Modifier):</span>
                    <input 
                      type="number" 
                      value={passionModifier} 
                      onChange={e => {
                        setPassionModifier(parseInt(e.target.value) || 0);
                        setPassionRollResult(null);
                      }}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="cs-field" style={{ margin: 0 }}>
                    <span className="cs-field-label">최종 영감 판정치:</span>
                    <div style={{ display: 'flex', alignItems: 'center', height: '36px', paddingLeft: '8px', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--color-crimson)' }}>
                      {selectedPassionKey ? (getPassionValue(selectedPassionKey) + parseInt(passionModifier)) : 0} 이하
                    </div>
                  </div>
                </div>

                {/* Roll button */}
                <button 
                  className="btn-medieval btn-medieval-primary" 
                  onClick={executePassionRoll}
                  style={{ justifyContent: 'center' }}
                  disabled={isRollingPassion || !selectedPassionKey}
                >
                  {isRollingPassion ? '열정을 울부짖는 중...' : '열정 영감 고취 주사위 굴리기'}
                </button>

                {/* Result Display with applying choices */}
                {passionRollResult && (
                  <div style={{ border: `2px solid ${passionRollResult.color}`, background: 'rgba(0,0,0,0.01)', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)', marginBottom: '4px' }}>d20 결과</span>
                    <D20Face value={passionRollResult.roll} isRolling={isRollingPassion} color={passionRollResult.color} />
                    
                    {!passionRollResult.isRolling && (
                      <div style={{ marginTop: '10px', textAlign: 'center', width: '100%' }}>
                        <h4 style={{ color: passionRollResult.color, fontWeight: 'bold', fontSize: '1.1rem', margin: '4px 0' }}>
                          {passionRollResult.outcome}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', whiteSpace: 'pre-line', margin: '8px 0' }}>
                          {passionRollResult.desc}
                        </p>
                        
                        {/* Live Update Interactions */}
                        <div style={{ marginTop: '12px', borderTop: '1px dashed var(--color-grey-light)', paddingTop: '10px' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)', display: 'block', marginBottom: '8px' }}>
                            플레이한 사투/행동의 내러티브 결과를 반영하세요:
                          </span>
                          
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {passionRollResult.state === 'inspiration' && (
                              <>
                                <button 
                                  className="btn-medieval" 
                                  onClick={() => applyPassionResolution('success')}
                                  disabled={passionActionApplied}
                                  style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(16, 185, 129, 0.05)', color: 'var(--color-success)', borderColor: 'var(--color-success)' }}
                                >
                                  ⚔️ 전투/임무 성공 (기사 위업 반영)
                                </button>
                                <button 
                                  className="btn-medieval" 
                                  onClick={() => applyPassionResolution('fail')}
                                  disabled={passionActionApplied}
                                  style={{ fontSize: '0.75rem', padding: '4px 8px', color: 'var(--color-crimson)', borderColor: 'var(--color-crimson)' }}
                                >
                                  💥 전투/임무 실패 (쇼크 충격)
                                </button>
                              </>
                            )}

                            {passionRollResult.state === 'disheartened' && (
                              <>
                                <button 
                                  className="btn-medieval" 
                                  onClick={() => applyPassionResolution('success')}
                                  disabled={passionActionApplied}
                                  style={{ fontSize: '0.75rem', padding: '4px 8px', color: 'var(--color-success)', borderColor: 'var(--color-success)' }}
                                >
                                  ✓ 역경 훌륭히 극복 (+1 Passion)
                                </button>
                                <button 
                                  className="btn-medieval" 
                                  onClick={() => applyPassionResolution('fail')}
                                  disabled={passionActionApplied}
                                  style={{ fontSize: '0.75rem', padding: '4px 8px', color: 'var(--color-crimson)', borderColor: 'var(--color-crimson)' }}
                                >
                                  ☠️ 낙담에 굴복 (-1 Passion &amp; 우울)
                                </button>
                              </>
                            )}

                            {passionRollResult.state === 'madness' && (
                              <button 
                                className="btn-medieval" 
                                onClick={() => applyPassionResolution('madness')}
                                disabled={passionActionApplied}
                                style={{ fontSize: '0.75rem', padding: '4px 8px', color: 'var(--color-crimson)', borderColor: 'var(--color-crimson)', width: '100%', justifyContent: 'center' }}
                              >
                                💀 이성을 잃고 광기에 침식됨 적용 (-1 Passion)
                              </button>
                            )}
                          </div>

                          {passionActionApplied && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', display: 'block', marginTop: '8px', fontWeight: 'bold' }}>
                              ✓ 기사단 보존용 클라우드 데이터(동적 시트)에 판정 결과가 실시간 기록되었습니다!
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Section 2: Conflicting Emotions & Group Inspiration & Introspection */}
          <div className="cs-row">
            
            {/* 3. 감정 대립 판정기 (Conflicting Emotions) */}
            <section className="cs-section" style={{ flex: '1 1 300px' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-royal-blue)' }}>
                <h3>⚖️ 감정 대립 대결기 (p.71-72)</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: 0 }}>
                  두 개의 상충되는 감정(예: 정의 vs 자비)이 격돌할 때, 어떠한 기사로서의 본능이 서사를 결정지을지 대결합니다.
                </p>

                {/* Match inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="cs-field" style={{ margin: 0 }}>
                    <span className="cs-field-label">대치 가치 A:</span>
                    <select 
                      value={emotionA.key} 
                      onChange={e => {
                        const k = e.target.value;
                        setEmotionA({
                          type: 'trait',
                          key: k,
                          label: traitPairs.find(p => p.left === k || p.right === k)?.leftKo.split(' ')[0] || k,
                          value: getTraitValue(k)
                        });
                        setEmotionRollResult(null);
                      }}
                      style={{ width: '100%' }}
                    >
                      {traitPairs.map(p => (
                        <option key={p.left} value={p.left}>{p.leftKo.split(' ')[0]}</option>
                      ))}
                    </select>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-grey)', display: 'block', marginTop: '4px', textAlign: 'center' }}>
                      (능력: {emotionA.value})
                    </span>
                  </div>

                  <div className="cs-field" style={{ margin: 0 }}>
                    <span className="cs-field-label">대치 가치 B:</span>
                    <select 
                      value={emotionB.key} 
                      onChange={e => {
                        const k = e.target.value;
                        setEmotionB({
                          type: 'trait',
                          key: k,
                          label: traitPairs.find(p => p.left === k || p.right === k)?.leftKo.split(' ')[0] || k,
                          value: getTraitValue(k)
                        });
                        setEmotionRollResult(null);
                      }}
                      style={{ width: '100%' }}
                    >
                      {traitPairs.map(p => (
                        <option key={p.left} value={p.left}>{p.leftKo.split(' ')[0]}</option>
                      ))}
                    </select>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-grey)', display: 'block', marginTop: '4px', textAlign: 'center' }}>
                      (능력: {emotionB.value})
                    </span>
                  </div>
                </div>

                <button 
                  className="btn-medieval" 
                  onClick={executeEmotionRoll}
                  style={{ justifyContent: 'center' }}
                  disabled={isRollingEmotions}
                >
                  {isRollingEmotions ? '두 이성이 내면에서 격돌 중...' : '⚖️ 갈등 대결 굴리기'}
                </button>

                {emotionRollResult && (
                  <div style={{ border: '1px solid var(--color-gold)', padding: '12px', background: 'rgba(0,0,0,0.01)', marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-grey)', textAlign: 'center' }}>{emotionA.label} d20</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-royal-blue)', textAlign: 'center' }}>{emotionRollResult.rollA}</div>
                      </div>
                      <div style={{ fontWeight: 'bold', color: 'var(--color-gold-dark)' }}>vs</div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-grey)', textAlign: 'center' }}>{emotionB.label} d20</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-crimson)', textAlign: 'center' }}>{emotionRollResult.rollB}</div>
                      </div>
                    </div>
                    {!emotionRollResult.isRolling && (
                      <div style={{ textAlign: 'center', borderTop: '1px dashed var(--color-grey-light)', paddingTop: '8px' }}>
                        <h4 style={{ color: emotionRollResult.color, fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>
                          {emotionRollResult.textResult}
                        </h4>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* 4. 그룹 영감 롤러 (Group Inspiration) */}
            <section className="cs-section" style={{ flex: '1 1 300px' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-gold-dark)' }}>
                <h3>📢 기사단 그룹 영감 고취 (p.81)</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: 0 }}>
                  동료 기사단 무리 전체에게 동일한 열정(예: Honor)에 대고 웅변을 펼쳐, 무리 전체의 사기를 영광스럽게 일괄 고양합니다.
                </p>

                {/* Input for shared passion */}
                <div className="cs-field">
                  <span className="cs-field-label">공유하는 대의/열망 이름:</span>
                  <input 
                    type="text" 
                    value={groupPassionName} 
                    onChange={e => {
                      setGroupPassionName(e.target.value);
                      setGroupRollResult(null);
                    }}
                    style={{ width: '100%' }}
                  />
                </div>

                {/* List of squad members */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '6px', background: 'rgba(0,0,0,0.01)', border: '1px solid var(--color-grey-light)' }}>
                  {groupKnights.map((k, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: 'bold' }}>{k.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)' }}>대의 값:</span>
                        <input 
                          type="number" 
                          value={k.passionScore}
                          onChange={e => {
                            const val = parseInt(e.target.value) || 10;
                            setGroupKnights(prev => prev.map((item, i) => i === idx ? { ...item, passionScore: val } : item));
                            setGroupRollResult(null);
                          }}
                          style={{ width: '50px', padding: '2px', textAlign: 'center', fontSize: '0.8rem' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  className="btn-medieval" 
                  onClick={executeGroupRoll}
                  style={{ justifyContent: 'center' }}
                  disabled={isRollingGroup}
                >
                  {isRollingGroup ? '웅장한 대기사 선언 연설 중...' : '📢 군대 연설 판정 (Group d20)'}
                </button>

                {groupRollResult && (
                  <div style={{ border: '1px solid var(--color-gold)', padding: '12px', background: 'rgba(0,0,0,0.01)', marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-grey)' }}>연설 주사위 굴림:</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-crimson)' }}>{groupRollResult.roll}</span>
                    </div>

                    {!groupRollResult.isRolling && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {groupRollResult.details.map((k, idx) => (
                          <div key={idx} style={{ fontSize: '0.75rem', borderBottom: '1px dashed var(--color-grey-light)', paddingBottom: '3px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{k.name}</span>
                            <span style={{ fontWeight: 'bold', color: k.result.includes('성공') ? 'var(--color-success)' : 'var(--color-crimson)' }}>{k.result}</span>
                          </div>
                        ))}
                        <div style={{ marginTop: '8px', borderTop: '1px solid var(--color-gold-light)', paddingTop: '8px', textAlign: 'center' }}>
                          <h4 style={{ color: groupRollResult.color, fontWeight: 'bold', fontSize: '0.9rem' }}>
                            그룹 평균 대결론: {groupRollResult.finalGroupOutcome}
                          </h4>
                          <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-light)', marginTop: '3px' }}>
                            {groupRollResult.groupDesc}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* 5. 사랑의 자기성찰 판정기 (Introspection Roller) */}
            <section className="cs-section" style={{ flex: '1 1 300px' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-royal-blue)' }}>
                <h3>🌌 사랑의 황홀경 daze 판정기 (p.81)</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: 0 }}>
                  Amor/Love 성정을 깊이 지닌 성기사가 매일 겪는 몽상(Introspection) 상태에 빠질지 가늠합니다.
                </p>

                {/* Love Select */}
                <div className="cs-field">
                  <span className="cs-field-label">그리워하는 대상 (Amor/Love):</span>
                  <select 
                    value={selectedAmorKey} 
                    onChange={e => {
                      setSelectedAmorKey(e.target.value);
                      setIntrospectionResult(null);
                    }}
                    style={{ width: '100%' }}
                  >
                    {getPassionKeys().map(key => (
                      <option key={key} value={key}>{passionNamesKo[key] || key}</option>
                    ))}
                  </select>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-grey)', display: 'block', marginTop: '4px', textAlign: 'center' }}>
                    (대상 열정 값: {getPassionValue(selectedAmorKey)})
                  </span>
                </div>

                <button 
                  className="btn-medieval" 
                  onClick={executeIntrospectionRoll}
                  style={{ justifyContent: 'center' }}
                  disabled={isRollingIntro}
                >
                  {isRollingIntro ? '레이디의 손길만을 꿈꾸는 중...' : '🌌 몽상 자극 주사위 굴리기 (d20)'}
                </button>

                {introspectionResult && (
                  <div style={{ border: '1px solid var(--color-gold)', padding: '12px', background: 'rgba(0,0,0,0.01)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)', marginBottom: '4px' }}>d20 굴림</span>
                    <D20Face value={introspectionResult.roll} isRolling={isRollingIntro} color={introspectionResult.color} />
                    
                    {!introspectionResult.isRolling && (
                      <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        <h4 style={{ color: introspectionResult.color, fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>
                          {introspectionResult.title}
                        </h4>
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-light)', lineHeight: '1.4' }}>
                          {introspectionResult.desc}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </>
      )}

    </div>
  );
}

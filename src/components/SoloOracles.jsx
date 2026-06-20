import React, { useState } from 'react';
import ProperNoun from './ProperNoun';
import { maleNames, femaleNames, surnames, locations, titles } from '../data/names';
import { rollGrades, yesNoOracle, soloScenariosRef } from '../data/oracles';
import { Dices, RefreshCw, HelpCircle, ArrowRight, Shield, Heart, Flame, Sparkles, Smile, AlertCircle, Info, ChevronRight, User, Award, Coins } from 'lucide-react';
import { applyOnce, hasAppliedEvent, markAppliedEvent, markWinterStep } from '../utils/campaignState';

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
  const [activeSubTab, setActiveSubTab] = useState('general'); // 'general' | 'personality' | 'reputation' | 'combat_skills'

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
  // PERSONALITY SUB-TAB STATES (Chapter 3)
  // ==========================================
  const [selectedTraitPair, setSelectedTraitPair] = useState(0);
  const [selectedTraitDirection, setSelectedTraitDirection] = useState('left');
  const [traitModifier, setTraitModifier] = useState(0);
  const [traitRollResult, setTraitRollResult] = useState(null);
  const [isRollingTrait, setIsRollingTrait] = useState(false);

  const [selectedPassionKey, setSelectedPassionKey] = useState('');
  const [passionModifier, setPassionModifier] = useState(0);
  const [passionRollResult, setPassionRollResult] = useState(null);
  const [isRollingPassion, setIsRollingPassion] = useState(false);
  const [isChivalryActive, setIsChivalryActive] = useState(false);
  const [passionActionApplied, setPassionActionApplied] = useState(false);

  const [emotionA, setEmotionA] = useState({ type: 'trait', key: 'just', label: '정의 (Just)', value: 10 });
  const [emotionB, setEmotionB] = useState({ type: 'trait', key: 'merciful', label: '자비 (Merciful)', value: 11 });
  const [emotionRollResult, setEmotionRollResult] = useState(null);
  const [isRollingEmotions, setIsRollingEmotions] = useState(false);

  const [groupKnights, setGroupKnights] = useState([
    { name: '롤랑 경 (Sir Roland)', passionScore: 16 },
    { name: '올리비에 경 (Sir Oliver)', passionScore: 14 },
    { name: '오지에 경 (Sir Ogier)', passionScore: 12 }
  ]);
  const [groupPassionName, setGroupPassionName] = useState('Honor');
  const [groupRollResult, setGroupRollResult] = useState(null);
  const [isRollingGroup, setIsRollingGroup] = useState(false);

  const [selectedAmorKey, setSelectedAmorKey] = useState('loveFamily');
  const [introspectionResult, setIntrospectionResult] = useState(null);
  const [isRollingIntro, setIsRollingIntro] = useState(false);

  // ==========================================
  // REPUTATION & COMBAT SKILLS STATES (Chapter 4 & 5)
  // ==========================================
  // 1. Glory Calculator States
  const [selectedOpponentType, setSelectedOpponentType] = useState('ordinary_knight');
  const [combatType, setCombatType] = useState('mortal'); // 'mortal' | 'love'
  const [damage6d6, setDamage6d6] = useState(false);
  const [halfGiant, setHalfGiant] = useState(false);
  const [passionInspiration, setPassionInspiration] = useState(false);
  const [critPassionInspiration, setCritPassionInspiration] = useState(false);
  const [critMiracle, setCritMiracle] = useState(false);
  const [magicEquipment, setMagicEquipment] = useState(false);
  const [fantasticItem, setFantasticItem] = useState(false);
  
  const [spouseGlory, setSpouseGlory] = useState(500);
  const [spouseIsPagan, setSpouseIsPagan] = useState(false);
  const [spouseHonor, setSpouseHonor] = useState(15);
  
  const [gloryActionApplied, setGloryActionApplied] = useState(false);
  const [marriageGloryActionApplied, setMarriageGloryActionApplied] = useState(false);

  // 2. Standing States
  const [selectedStandingKey, setSelectedStandingKey] = useState('charlemagne');
  const [giftAmount, setGiftAmount] = useState(10);
  const [giftRollResult, setGiftRollResult] = useState(null);
  const [standingRollResult, setStandingRollResult] = useState(null);
  const [isRollingStanding, setIsRollingStanding] = useState(false);
  const [isRollingGiftProportion, setIsRollingGiftProportion] = useState(false);
  const [standingActionApplied, setStandingActionApplied] = useState(false);

  // 3. Melee Clash Simulator States
  const [playerWeapon, setPlayerWeapon] = useState('sword');
  const [playerMounted, setPlayerMounted] = useState(true);
  const [playerSkillOverride, setPlayerSkillOverride] = useState(13); // defaults to actual sword skill 13
  const [opponentWeapon, setOpponentWeapon] = useState('spear');
  const [opponentMounted, setOpponentMounted] = useState(false);
  const [opponentSkill, setOpponentSkill] = useState(11);
  const [isCharging, setIsCharging] = useState(true);
  
  const [clashResult, setClashResult] = useState(null);
  const [isRollingClash, setIsRollingClash] = useState(false);

  // 4. 스킬 판정 및 수련기 관련 State
  const [selectedSkillKey, setSelectedSkillKey] = useState('awareness');
  const [skillMod, setSkillMod] = useState(0);
  const [skillRollResult, setSkillRollResult] = useState(null);
  const [isRollingSkill, setIsRollingSkill] = useState(false);
  const [skillCheckApplied, setSkillCheckApplied] = useState(false);

  // 스킬 향상 수련기 관련 State
  const [selectedImproveKey, setSelectedImproveKey] = useState('awareness');
  const [improveRollResult, setImproveRollResult] = useState(null);
  const [isRollingImprove, setIsRollingImprove] = useState(false);
  const [improveApplied, setImproveApplied] = useState(false);

  // 5. 대규모 집단 전투 (Mass Combat - Chapter 8) States
  const [battleTacticsResult, setBattleTacticsResult] = useState(null);
  const [meleeEventResult, setMeleeEventResult] = useState(null);
  const [followersFateResult, setFollowersFateResult] = useState(null);
  const [isRollingBattle, setIsRollingBattle] = useState(false);
  const [isRollingMeleeEvent, setIsRollingMeleeEvent] = useState(false);
  const [isRollingFollowersFate, setIsRollingFollowersFate] = useState(false);
  const [battleApplied, setBattleApplied] = useState(false);
  const [battleGloryTotal, setBattleGloryTotal] = useState(0);
  const [battleLootTotal, setBattleLootTotal] = useState(0);
  const [enemyCommanderSkill, setEnemyCommanderSkill] = useState(12);
  const [playerBattleSkillOverride, setPlayerBattleSkillOverride] = useState(10);

  // 6. 성스러운 기적과 사법 신탁 및 연애 (Chapter 9 - Magic & Miracles) States
  const [prayerResult, setPrayerResult] = useState(null);
  const [isRollingPrayer, setIsRollingPrayer] = useState(false);
  const [selectedPrayerModifier, setSelectedPrayerModifier] = useState(0);

  const [conversionResult, setConversionResult] = useState(null);
  const [isRollingConversion, setIsRollingConversion] = useState(false);
  const [paganCommanderName, setPaganCommanderName] = useState('작센 귀족');

  const [trialResult, setTrialResult] = useState(null);
  const [isRollingTrial, setIsRollingTrial] = useState(false);
  const [selectedTrialType, setSelectedTrialType] = useState('combat'); // 'combat' | 'ordeal_iron' | 'ordeal_water'

  const [courtshipResult, setCourtshipResult] = useState(null);
  const [isRollingCourtship, setIsRollingCourtship] = useState(false);
  const [selectedLadyAmorType, setSelectedLadyAmorType] = useState('passive'); // 'passive' | 'active_romance'
  const [targetLadyName, setTargetLadyName] = useState('로트링겐 영애');
  const [ladyLoveStat, setLadyLoveStat] = useState(12);

  const [dreamResult, setDreamResult] = useState(null);
  const [isRollingDream, setIsRollingDream] = useState(false);

  const [magicApplied, setMagicApplied] = useState(false);
  const [magicGloryTotal, setMagicGloryTotal] = useState(0);

  // 서사적 기행록용 연대기 States (Narrative building)
  const [magicLogs, setMagicLogs] = useState([]);
  const [prayerIntention, setPrayerIntention] = useState('가문의 위기 극복과 전장 생존');
  const [trialAccusation, setTrialAccusation] = useState('이단 혐의 및 작센과의 밀통 밀고');
  const [courtshipGift, setCourtshipGift] = useState('비단 스카프와 향기로운 장미 백합');

  // 7. 재정 생활 수준 및 무구 상점 (Chapter 12 - Wealth & Treasure) States
  const [selectedLivingStandard, setSelectedLivingStandard] = useState('ordinary'); // 'rich' | 'ordinary' | 'poor' | 'miserly'
  const [appraisedTreasure, setAppraisedTreasure] = useState(null);
  const [isAppraising, setIsAppraising] = useState(false);
  const [armoryLogs, setArmoryLogs] = useState([]);

  // Mappings
  const allSkills = [
    // 일반 스킬 (Common Skills)
    { key: "awareness", label: "경계 (Awareness)", category: "common" },
    { key: "chirurgery", label: "의술 (Chirurgery)", category: "common" },
    { key: "faerieLore", label: "요정 전설 (Faerie Lore)", category: "common" },
    { key: "firstAid", label: "응급처치 (First Aid)", category: "common" },
    { key: "folkLore", label: "민간 전설 (Folk Lore)", category: "common" },
    { key: "horsemanship", label: "마술 (Horsemanship)", category: "common" },
    { key: "hunting", label: "수렵 (Hunting)", category: "common" },
    { key: "industry", label: "근면 (Industry)", category: "common" },
    { key: "recognize", label: "신분 식별 (Recognize)", category: "common" },
    { key: "religion", label: "종교 지식 (Religion)", category: "common" },
    { key: "stewardship", label: "영지 관리 (Stewardship)", category: "common" },
    { key: "swimming", label: "수영 (Swimming)", category: "common" },

    // 궁정 스킬 (Courtly Skills)
    { key: "courtesy", label: "예의 (Courtesy)", category: "courtly" },
    { key: "dancing", label: "무용 (Dancing)", category: "courtly" },
    { key: "eloquence", label: "웅변 (Eloquence)", category: "courtly" },
    { key: "falconry", label: "매사냥 (Falconry)", category: "courtly" },
    { key: "gaming", label: "유희 (Gaming)", category: "courtly" },
    { key: "heraldry", label: "문장학 (Heraldry)", category: "courtly" },
    { key: "intrigue", label: "음모 (Intrigue)", category: "courtly" },
    { key: "playInstruments", label: "악기 연주 (Play Instruments)", category: "courtly" },
    { key: "readingWriting", label: "독서 및 집필 (Reading & Writing)", category: "courtly" },
    { key: "romance", label: "로맨스 (Romance)", category: "courtly" },
    { key: "singing", label: "가창 (Singing)", category: "courtly" },

    // 전투/무기 스킬 (Combat/Weapon Skills)
    { key: "battle", label: "전술 (Battle)", category: "combat" },
    { key: "siege", label: "공성 (Siege)", category: "combat" },
    { key: "sword", label: "검 (Sword)", category: "combat" },
    { key: "lance", label: "마창 (Lance)", category: "combat" },
    { key: "axe", label: "도끼 (Axe)", category: "combat" },
    { key: "spear", label: "창 / 폴암 (Spear)", category: "combat" },
    { key: "dagger", label: "단검 (Dagger)", category: "combat" },
    { key: "bludgeon", label: "둔기 (Bludgeon)", category: "combat" },
    { key: "unarmed", label: "맨손 격투 (Unarmed)", category: "combat" }
  ];
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
    hateSaracens: '사라센인 증오 (Hate [Saracens])',
    loveGod: '신에 대한 사랑 (Love [God])',
    hateSaxons: '작센인 증오 (Hate [Saxons])',
    hateMoors: '무어인 증오 (Hate [Moors])'
  };

  const humanOpponents = {
    ordinary_knight: { label: '일반 기사 (Ordinary Knight)', baseGlory: 50, loveGlory: 5 },
    notable_knight: { label: '유력 기사 (Notable Knight)', baseGlory: 100, loveGlory: 10 },
    famous_knight: { label: '유명 기사 (Famous Knight)', baseGlory: 250, loveGlory: 25 },
    extraordinary_knight: { label: '비범한 기사 (Extraordinary Knight)', baseGlory: 500, loveGlory: 50 },
    peasant: { label: '무법 평민 (Unruly Peasant)', baseGlory: 1, loveGlory: 0 },
    thief: { label: '도둑 (Thief)', baseGlory: 5, loveGlory: 0 },
    ordinary_bandit: { label: '일반 도적 (Ordinary Bandit)', baseGlory: 10, loveGlory: 0 },
    notable_bandit: { label: '유명 도적 (Notable Bandit)', baseGlory: 25, loveGlory: 0 },
    unarmored_foot: { label: '무장하지 않은 보병 (Unarmored Foot)', baseGlory: 10, loveGlory: 0 },
    armored_foot: { label: '무장 보병 (Armored Foot)', baseGlory: 25, loveGlory: 0 },
    mounted_warrior: { label: '기마 전사 (Mounted Non-Knight)', baseGlory: 35, loveGlory: 0 }
  };

  const weaponProperties = {
    lance: { label: '랜스 (Lance)', damage: '돌격마 피해 (Damage as per Horse)', note: '기마 돌격 시 +5 보정, 보병의 창 방어에 카운터됨' },
    sword: { label: '검 (One-Handed Sword)', damage: '기본 피해 (Normal)', note: '동률 시 상대방 비-검 파괴, 대실패(Fumble) 시 떨어뜨릴 뿐 부러지지 않음' },
    two_handed_sword: { label: '양손검 (Two-Handed Sword)', damage: '기본 +1d6 추가 피해', note: '동률 시 상대방 비-검 파괴, 대실패(Fumble) 시 떨어뜨림, 방패 사용 불가능' },
    spear: { label: '창 (Spear/Polearm)', damage: '기본 피해 (Normal)', note: '보병 상태에서 기마 적 대적 시 +5 창 보정 및 적 랜스 돌격 보너스 무효화' },
    halberd: { label: '할버드 (Halberd)', damage: '기본 +1d6 추가 피해', note: '보병 상태에서 기마 대적 시 +5 보정, 대실패(Fumble) 시 무기 완파' },
    dagger: { label: '단검 (Dagger)', damage: '기본 피해 (Normal)', note: '초근접 난전용 무기' },
    unarmed: { label: '맨손 (Unarmed Grapple)', damage: '맨손 그래플링', note: '상대 무기 해제 및 그래플링 상태 돌입' }
  };

  const standingNamesKo = {
    charlemagne: '샤를마뉴 대제 (Standing [Charlemagne])',
    liegeLord: '영주 백작 (Standing [Lord])',
    family: '가문 구성원 (Standing [Family])',
    retinue: '가신단/종자 (Standing [Retinue])',
    church: '성직자/교회 (Standing [Church])',
    commoners: '평민/상인 (Standing [Commoners])'
  };

  // ==========================================
  // GENERAL SUB-TAB LOGIC
  // ==========================================
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

  // ==========================================
  // PERSONALITY SUB-TAB LOGIC (Chapter 3)
  // ==========================================
  const getTraitValue = (key) => {
    return character?.traits?.[key] ?? 10;
  };

  const getPassionValue = (key) => {
    return character?.passions?.[key] ?? 10;
  };

  const getStandingValue = (key) => {
    return character?.standings?.[key] ?? 10;
  };

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
          outcome = '대실패 (Fumble) ⚠️';
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

  const applyTraitOutcome = (type) => {
    if (!traitRollResult) return;
    const oppKo = traitRollResult.opposedKo;
    const ko = traitRollResult.rolledKo;

    if (type === 'fumble' || type === 'act_opposite') {
      alert(`[반대 성향 페널티]: ${oppKo}의 충동이 기록되었습니다! 다음 겨울 정산 시 ${oppKo} 성장을 굴릴 수 있는 자격을 획득합니다.`);
    } else {
      alert(`[특성 반영 완료]: 성향 [${ko}]이 기사의 서사 행동에 숭고히 반영되었습니다!`);
    }
  };

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
        let state = '';
        let skillBonus = 0;
        let desc = '';
        let color = '';

        if (finalRoll === 20) {
          outcome = '대실패 (Fumble) 💀';
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
      const updatedPassions = { ...prev.passions };
      const updatedPassionsChecked = { ...prev.passionsChecked };

      if (passionRollResult.state === 'inspiration') {
        if (successType === 'success') {
          if (passionRollResult.roll === 1 || passionRollResult.roll === passionRollResult.modifiedTarget) {
            updatedPassions[key] = Math.min(20, (updatedPassions[key] || 10) + 1);
            alert(`[열망 상승 완료]: 전공 완수! ${ko} 수치가 +1 상승하였습니다!`);
          } else {
            updatedPassionsChecked[key] = true;
            alert(`[경험 체크 완료]: 전공 완수! ${ko}에 겨울 성장용 경험 체크를 누적했습니다.`);
          }
        } else if (successType === 'fail') {
          alert(`[기사의 쇼크 충격!]: 열정 영감으로도 극복하지 못해 정신적 쇼크(Shock)가 닥칩니다! 가문&겨울 탭의 노화 d20 판정(Aging Table)을 즉각 1회 실행하세요.`);
        }
      } else if (passionRollResult.state === 'disheartened') {
        if (successType === 'success') {
          updatedPassions[key] = Math.min(20, (updatedPassions[key] || 10) + 1);
          alert(`[역경 극복]: 극적인 사투 끝에 낙담을 물리쳤습니다! ${ko} 수치가 +1 상승했습니다!`);
        } else {
          updatedPassions[key] = Math.max(1, (updatedPassions[key] || 10) - 1);
          alert(`[우울증 봉착]: 깊은 슬픔(Melancholy) 속에 기사는 침잠합니다. ${ko} 수치가 -1 하락하는 참담한 상처를 받았습니다.`);
        }
      } else if (passionRollResult.state === 'madness') {
        updatedPassions[key] = Math.max(1, (updatedPassions[key] || 10) - 1);
        alert(`[광기 적용]: 기사는 이성을 잃고 야만인처럼 울부짖으며 들판으로 사라집니다! ${ko} 수치가 -1 하락했습니다.`);
      }

      return {
        ...prev,
        passions: updatedPassions,
        passionsChecked: updatedPassionsChecked
      };
    });
    setPassionActionApplied(true);
  };

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
        const valA = emotionA.value;
        const valB = emotionB.value;

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
        let successesCount = 0;
        let fumblesCount = 0;

        const details = groupKnights.map(k => {
          let indRes = '';
          if (finalRoll === 20) {
            indRes = '대실패 (광기 위험)';
            fumblesCount++;
          } else if (finalRoll === 1 || finalRoll === k.passionScore) {
            indRes = '결정적 성공 ( Inspired +10 )';
            successesCount++;
          } else if (finalRoll < k.passionScore) {
            indRes = '성공 ( Inspired +5 )';
            successesCount++;
          } else {
            indRes = '실패 (낙담 -5)';
          }
          return { ...k, result: indRes };
        });

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
          finalGroupOutcome = '재앙적 대실패 (대혼란)';
          groupDesc = `연설 도중 끔찍한 도발이나 비열함이 노출되어 대혼란과 광기가 무리에 엄습합니다!`;
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
        let title = '평온함';
        let desc = '기사는 현실의 임무에 또렷이 집중하고 있습니다. 정상적인 모험 활동이 가능합니다.';
        let color = 'var(--color-grey)';

        if (finalRoll === 1 || finalRoll <= 3) {
          title = '사랑의 몽상: 넋을 잃음! 🌌';
          desc = `넋을 잃음 돌입! 기사의 눈앞에 문득 연인(Amor)의 고운 실루엣과 하얀 손길이 몽환적으로 떠오릅니다. 향후 [ 4d6분 ] 동안 사랑에 넋을 잃은 채 깊은 몽상 상태에 빠집니다. 이 시간 동안 감각(Awareness), 지식, 통찰 등 모든 인지 스킬 굴림이 전원 원천 금지됩니다! 단, 적들의 기습을 방어하는 개인 호신전투 중에는 Inspired(+5) 보정을 정상 획득합니다.`;
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

  // ==========================================
  // REPUTATION & COMBAT LOGIC (Chapter 4 & 5)
  // ==========================================
  
  // 1. Glory Value Calculators
  const getCalculatedGlory = () => {
    const opponent = humanOpponents[selectedOpponentType];
    if (!opponent) return 0;
    
    let base = combatType === 'mortal' ? opponent.baseGlory : opponent.loveGlory;
    let add = 0;
    
    if (damage6d6) add += 10;
    if (halfGiant) add += 20;
    if (passionInspiration) add += 10;
    if (critPassionInspiration) add += 20;
    if (critMiracle) add += 50;
    if (magicEquipment) add += 25;
    if (fantasticItem) add += 50;
    
    if (combatType === 'love') {
      add = Math.floor(add / 10);
    }
    
    return base + add;
  };

  const getCalculatedMarriageGlory = () => {
    if (spouseIsPagan) {
      const val = Math.floor((spouseGlory / 100) * spouseHonor);
      return Math.min(1000, val);
    } else {
      return Math.min(1000, spouseGlory);
    }
  };

  const applyGloryToSheet = () => {
    const eventId = `solo:glory:${character.personal?.campaignYear || 768}`;
    if (gloryActionApplied || hasAppliedEvent(character, eventId)) {
      alert("올해의 솔로 오라클 명예 보상은 이미 시트에 반영되었습니다.");
      return;
    }
    const addedGlory = getCalculatedGlory();
    setCharacter(prev => {
      const result = applyOnce(prev, eventId, updated => {
        updated.gear.gloryTotal = (updated.gear?.gloryTotal || 1000) + addedGlory;
        return updated;
      }, `솔로 오라클 명예 +${addedGlory}`);
      return result.character;
    });
    setGloryActionApplied(true);
    alert(`[명예 획득 반영]: +${addedGlory} Glory가 성기사의 시트 명예 총량에 성공적으로 반영되었습니다!`);
  };

  const applyMarriageGloryToSheet = () => {
    const eventId = `solo:marriage_glory:${character.personal?.campaignYear || 768}`;
    if (marriageGloryActionApplied || hasAppliedEvent(character, eventId)) {
      alert("올해의 결혼 명예 보상은 이미 시트에 반영되었습니다.");
      return;
    }
    const addedGlory = getCalculatedMarriageGlory();
    setCharacter(prev => {
      const result = applyOnce(prev, eventId, updated => {
        updated.gear.gloryTotal = (updated.gear?.gloryTotal || 1000) + addedGlory;
        return updated;
      }, `결혼 명예 +${addedGlory}`);
      return result.character;
    });
    setMarriageGloryActionApplied(true);
    alert(`[결혼 명예 반영]: +${addedGlory} Glory가 성공적으로 기사 시트에 반영되었습니다!`);
  };

  // 2. Standing Gift & Rolls Logic
  const handleGiftDonation = () => {
    if (standingActionApplied) return;
    const cash = character?.gear?.cash || 0;
    if (cash < giftAmount) {
      alert(`보유 소지금(£${cash})이 헌납하고자 하는 금액(£${giftAmount})보다 부족합니다!`);
      return;
    }

    setStandingActionApplied(true);
    setGiftRollResult(null);

    let pointsEarned = 0;
    let rollText = '';

    if (selectedStandingKey === 'charlemagne') {
      pointsEarned = Math.floor(giftAmount / 100);
      const remainder = giftAmount % 100;
      if (remainder > 0) {
        setIsRollingGiftProportion(true);
        const roll = Math.floor(Math.random() * 100) + 1;
        const success = roll <= remainder;
        if (success) {
          pointsEarned += 1;
          rollText = `국왕 헌납 비율 판정: d100 [ ${roll} ] vs 목표 [ ${remainder}% ]. 성공! 명망 +1점 혜택을 극적으로 획득하셨습니다!`;
        } else {
          rollText = `국왕 헌납 비율 판정: d100 [ ${roll} ] vs 목표 [ ${remainder}% ]. 아쉽게 명망 추가점을 얻지 못했습니다.`;
        }
        setIsRollingGiftProportion(false);
      }
    } else {
      pointsEarned = Math.floor(giftAmount / 10);
      const remainder = giftAmount % 10;
      if (remainder > 0) {
        setIsRollingGiftProportion(true);
        const roll = Math.floor(Math.random() * 10) + 1;
        const success = roll <= remainder;
        if (success) {
          pointsEarned += 1;
          rollText = `일반 명망 비율 판정: d10 [ ${roll} ] vs 목표 [ ${remainder} ]. 성공! 명망 +1점 추가 상승!`;
        } else {
          rollText = `일반 명망 비율 판정: d10 [ ${roll} ] vs 목표 [ ${remainder} ]. 명망 추가 상승에 실패했습니다.`;
        }
        setIsRollingGiftProportion(false);
      }
    }

    // Apply to sheet
    setCharacter(prev => ({
      ...prev,
      gear: {
        ...prev.gear,
        cash: Math.max(0, (prev.gear?.cash || 0) - giftAmount)
      },
      standings: {
        ...prev.standings,
        [selectedStandingKey]: Math.min(25, (prev.standings?.[selectedStandingKey] || 10) + pointsEarned)
      }
    }));

    setGiftRollResult({
      pointsEarned,
      rollText,
      amount: giftAmount
    });
  };

  const executeStandingRoll = () => {
    if (isRollingStanding) return;
    setIsRollingStanding(true);
    setStandingRollResult(null);

    const baseVal = getStandingValue(selectedStandingKey);
    const standingKo = standingNamesKo[selectedStandingKey] || selectedStandingKey;

    let counter = 0;
    const interval = setInterval(() => {
      const tempRoll = Math.floor(Math.random() * 20) + 1;
      setStandingRollResult({
        roll: tempRoll,
        isRolling: true
      });
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        
        let outcome = '';
        let desc = '';
        let color = '';

        if (finalRoll === 20) {
          outcome = '대실패 (Fumble) ☠️';
          desc = `청탁 대참사! 오만방자하거나 예의를 지키지 못해 집단의 격한 분노를 샀습니다. Standing 수치가 즉각 1점 차감되며 상당한 배척을 받게 됩니다.`;
          color = 'var(--color-crimson)';
          
          // Deduct standing on Fumble
          setCharacter(prev => ({
            ...prev,
            standings: {
              ...prev.standings,
              [selectedStandingKey]: Math.max(1, (prev.standings?.[selectedStandingKey] || 10) - 1)
            }
          }));
        } else if (finalRoll === 1 || finalRoll === baseVal) {
          outcome = '결정적 성공 (Critical Success) 🌟';
          desc = `감동적인 대환대! 국왕 혹은 집단이 눈물을 흘릴 정도의 숭고한 헌신을 느끼고 기사의 부탁을 최고의 권한으로 승인하며, 가문 및 추종 기사단 전체에 대한 총애를 하사합니다.`;
          color = 'var(--color-success)';
        } else if (finalRoll < baseVal) {
          outcome = '성공 (Success) ✓';
          desc = `호의적 협조! 기사의 예의를 갖춘 요청을 흔쾌히 수락하여 아군으로 기꺼이 조력하거나 청탁한 favor를 승인해 줍니다.`;
          color = 'var(--color-royal-blue)';
        } else {
          outcome = '실패 (Failure) 🕯️';
          desc = `묵살 및 냉소! 요청이 거절되거나 침묵으로 묵살되었습니다. 아무런 도움이나 우호적 반응을 이끌어내지 못했습니다.`;
          color = 'var(--color-grey)';
        }

        setStandingRollResult({
          roll: finalRoll,
          outcome,
          desc,
          color,
          baseVal,
          standingKo,
          isRolling: false
        });
        setIsRollingStanding(false);
      }
    }, 50);
  };

  // 3. Melee Clash Simulator Logic (Chapter 5)
  const executeClashMatch = () => {
    if (isRollingClash) return;
    setIsRollingClash(true);
    setClashResult(null);

    // Grab modifiers
    let pSkill = parseInt(playerSkillOverride) || 10;
    let oSkill = parseInt(opponentSkill) || 10;

    let pModName = '';
    let oModName = '';
    let pMod = 0;
    let oMod = 0;

    // Mounted vs Foot spear/halberd modifiers (Chapters 5 & Chapter 8 Combat Rules)
    if (playerMounted && !opponentMounted) {
      if (opponentWeapon === 'spear' || opponentWeapon === 'halberd') {
        oMod = 5;
        oModName = '보병의 대기마 창/할버드 방어 보정 (+5)';
      }
      if (playerWeapon === 'lance' && isCharging) {
        if (opponentWeapon === 'spear' || opponentWeapon === 'halberd') {
          pModName = '상대 보병의 창/할버드 방어로 인한 기마 랜스 충격 무효화';
        } else {
          pMod = 5;
          pModName = '기마 랜스 돌격 차징 보정 (+5)';
        }
      }
    }

    if (opponentMounted && !playerMounted) {
      if (playerWeapon === 'spear' || playerWeapon === 'halberd') {
        pMod = 5;
        pModName = '보병의 대기마 창/할버드 방어 보정 (+5)';
      }
      if (opponentWeapon === 'lance' && isCharging) {
        if (playerWeapon === 'spear' || playerWeapon === 'halberd') {
          oModName = '기사의 창/할버드 방어로 인한 상대방 랜스 보너스 무효화';
        } else {
          oMod = 5;
          oModName = '기마 랜스 돌격 차징 보정 (+5)';
        }
      }
    }

    const pTarget = pSkill + pMod;
    const oTarget = oSkill + oMod;

    let counter = 0;
    const interval = setInterval(() => {
      const rollP = Math.floor(Math.random() * 20) + 1;
      const rollO = Math.floor(Math.random() * 20) + 1;
      setClashResult({
        rollP,
        rollO,
        isRolling: true
      });
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        const finalRollP = Math.floor(Math.random() * 20) + 1;
        const finalRollO = Math.floor(Math.random() * 20) + 1;

        // Success Grades
        const successP = finalRollP <= pTarget && finalRollP !== 20;
        const critP = finalRollP === 1 || finalRollP === pTarget;
        const fumbleP = finalRollP === 20;

        const successO = finalRollO <= oTarget && finalRollO !== 20;
        const critO = finalRollO === 1 || finalRollO === oTarget;
        const fumbleO = finalRollO === 20;

        let pGrade = fumbleP ? 'Fumble' : critP ? 'Critical' : successP ? 'Success' : 'Failure';
        let oGrade = fumbleO ? 'Fumble' : critO ? 'Critical' : successO ? 'Success' : 'Failure';

        let pWeaponState = 'Intact';
        let oWeaponState = 'Intact';
        let clashOutcome = '';
        let winner = '';
        let color = '';
        let detailDesc = '';

        // Fumble breakage rules
        if (fumbleP) {
          if (playerWeapon === 'sword' || playerWeapon === 'two_handed_sword') {
            pWeaponState = 'Dropped';
            detailDesc += '⚠️ 기사가 대실패(Fumble)를 범해 무기를 떨어뜨렸습니다 (검의 낙하 안전 룰: 파괴 안됨).\n';
          } else {
            pWeaponState = 'Broken';
            detailDesc += '💥 대실패! 기사의 비-검 무기 [' + weaponProperties[playerWeapon].label + ']가 산산조각났습니다!\n';
          }
        }
        if (fumbleO) {
          if (opponentWeapon === 'sword' || opponentWeapon === 'two_handed_sword') {
            oWeaponState = 'Dropped';
            detailDesc += '⚠️ 상대방이 대실패(Fumble)를 범해 검을 바닥에 떨어뜨렸습니다.\n';
          } else {
            oWeaponState = 'Broken';
            detailDesc += '💥 대실패! 상대의 비-검 무기 [' + weaponProperties[opponentWeapon].label + ']가 부서졌습니다!\n';
          }
        }

        // Opposed resolution checks
        const pScore = fumbleP ? -2 : !successP ? -1 : critP ? 100 + finalRollP : finalRollP;
        const oScore = fumbleO ? -2 : !successO ? -1 : critO ? 100 + finalRollO : finalRollO;

        if (pScore > oScore) {
          winner = 'Player';
          clashOutcome = '기사의 격돌 대승리! 🎉';
          color = 'var(--color-success)';
          
          let dmg = '기본 무기 피해';
          if (playerWeapon === 'two_handed_sword' || playerWeapon === 'halberd') dmg = '무기 피해 + 1d6 추가 피해';
          else if (playerWeapon === 'lance' && playerMounted) dmg = '돌격 군마의 피해량 적용';
          
          detailDesc += `🛡️ 기사가 주사위 차이로 방어를 뚫고 적을 격타하여 상해를 줍니다! (예상 피해: ${dmg})`;
        } else if (oScore > pScore) {
          winner = 'Opponent';
          clashOutcome = '상대방의 격돌 승리 ⚔️';
          color = 'var(--color-crimson)';
          
          let dmg = '적 기본 피해';
          if (opponentWeapon === 'two_handed_sword' || opponentWeapon === 'halberd') dmg = '적 피해 + 1d6 추가 피해';
          
          detailDesc += `⚠️ 상대방의 주사위가 더 강하여 기사의 방어를 뚫고 무거운 피해를 선사했습니다.`;
        } else {
          // TIE situation - Sword tie breaker rules!
          winner = 'None';
          
          const pHasSword = playerWeapon === 'sword' || playerWeapon === 'two_handed_sword';
          const oHasSword = opponentWeapon === 'sword' || opponentWeapon === 'two_handed_sword';

          if (successP && successO) {
            if (pHasSword && !oHasSword) {
              winner = 'Player';
              oWeaponState = 'Broken';
              clashOutcome = '검의 결투 법칙 승리! ⚔️';
              color = 'var(--color-success)';
              detailDesc += `✨ 동률 상황에서의 철칙! 기사의 고귀한 검이 상대방의 비-검 무기 [${weaponProperties[opponentWeapon].label}]의 날을 박살내어 동강내며 위대한 승리를 가져왔습니다!`;
            } else if (!pHasSword && oHasSword) {
              winner = 'Opponent';
              pWeaponState = 'Broken';
              clashOutcome = '상대방 검의 타이 브레이커 패배 😭';
              color = 'var(--color-crimson)';
              detailDesc += `💥 동률 상황 철칙 패배! 상대방의 예리한 명검이 기사가 쥐고 있던 비-검 무기 [${weaponProperties[playerWeapon].label}]의 자루를 박살내며 승리했습니다! 무기 완파!`;
            } else {
              clashOutcome = '동률 무기 대격돌 (Standoff) ⚖️';
              color = 'var(--color-grey)';
              detailDesc += `기사와 적의 무기가 똑같은 동률(Tie) 세기로 공중에서 폭발적으로 맞부딪혔습니다! 아무도 상처를 입지 않고 뒤로 밀려납니다.`;
            }
          } else {
            clashOutcome = '쌍방 공격 실패 (Standoff)';
            color = 'var(--color-grey)';
            detailDesc += '서로의 허공을 가르는 둔탁한 소리만이 가득했습니다. 아무도 격타에 실패했습니다.';
          }
        }

        setClashResult({
          rollP: finalRollP,
          rollO: finalRollO,
          pTarget,
          oTarget,
          pModName,
          oModName,
          pGrade,
          oGrade,
          pWeaponState,
          oWeaponState,
          clashOutcome,
          winner,
          color,
          detailDesc,
          isRolling: false
        });
        setIsRollingClash(false);
      }
    }, 50);
  };

  // 4. 스킬 판정 (Skill Roll) 및 성장 (Improvement) 로직 (Chapter 5)
  const executeSkillRoll = () => {
    if (isRollingSkill) return;
    setIsRollingSkill(true);
    setSkillRollResult(null);
    setSkillCheckApplied(false);

    const skillVal = character?.skills?.[selectedSkillKey] || 0;
    const finalTarget = skillVal + parseInt(skillMod);

    let counter = 0;
    const interval = setInterval(() => {
      const tempRoll = Math.floor(Math.random() * 20) + 1;
      setSkillRollResult({
        roll: tempRoll,
        isRolling: true
      });
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        
        let outcome = '';
        let desc = '';
        let color = '';
        let isSuccess = false;

        if (finalRoll === 20) {
          outcome = '대실패 (Fumble) ☠️';
          desc = '최악의 참패! 기술적 실수나 예상치 못한 변수로 임무에 치명적인 곤경을 겪습니다.';
          color = 'var(--color-crimson)';
        } else if (finalRoll === 1 || finalRoll === finalTarget) {
          outcome = '결정적 성공 (Critical Success) 🌟';
          desc = '기적적인 완성도! 완벽한 조화와 실력으로 모두를 경탄시키며, 즉각 스킬 체크를 획득합니다.';
          color = 'var(--color-success)';
          isSuccess = true;
        } else if (finalRoll < finalTarget) {
          outcome = '성공 (Success) ✓';
          desc = '능숙한 실행! 목적한 바를 원활하게 수행하고 가치 있는 스킬 체크를 얻습니다.';
          color = 'var(--color-royal-blue)';
          isSuccess = true;
        } else {
          outcome = '실패 (Failure) 🕯️';
          desc = '역량 부족! 기량을 완벽히 발휘하지 못해 난관을 헤쳐나가지 못했습니다.';
          color = 'var(--color-grey)';
        }

        const skillName = allSkills.find(s => s.key === selectedSkillKey)?.label || selectedSkillKey;

        setSkillRollResult({
          roll: finalRoll,
          outcome,
          desc,
          color,
          isSuccess,
          skillVal,
          finalTarget,
          skillName,
          isRolling: false
        });
        setIsRollingSkill(false);
      }
    }, 50);
  };

  const applySkillCheckToSheet = () => {
    if (skillCheckApplied || !skillRollResult?.isSuccess) return;
    setCharacter(prev => ({
      ...prev,
      skillsChecked: {
        ...prev.skillsChecked,
        [selectedSkillKey]: true
      }
    }));
    setSkillCheckApplied(true);
    alert(`[스킬 경험치 반영]: ${skillRollResult.skillName}의 경험치 체크(✓)가 기사 시트에 성공적으로 동기화 마킹되었습니다!`);
  };

  const executeImprovementRoll = () => {
    if (isRollingImprove) return;
    setIsRollingImprove(true);
    setImproveRollResult(null);
    setImproveApplied(false);

    const skillVal = character?.skills?.[selectedImproveKey] || 0;

    let counter = 0;
    const interval = setInterval(() => {
      const tempRoll = Math.floor(Math.random() * 20) + 1;
      setImproveRollResult({
        roll: tempRoll,
        isRolling: true
      });
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        
        let outcome = '';
        let desc = '';
        let color = '';
        let isSuccess = false;

        if (skillVal >= 20) {
          outcome = '수련 최고 한계치 도달';
          desc = '이미 20 이상의 신의 기량에 도달하여, 일반 겨울철 수련으로는 더 이상 스킬을 올릴 수 없습니다.';
          color = 'var(--color-grey)';
        } else if (finalRoll > skillVal || finalRoll === 20) {
          outcome = '수련 대성공! (스킬 +1 상승) 📈';
          desc = `귀중한 깨달음! 주사위 눈 [ ${finalRoll} ]이 현재 기술 레벨 [ ${skillVal} ]의 장벽을 훌륭히 초과하여, 영구적인 기량 상승을 쟁취했습니다.`;
          color = 'var(--color-success)';
          isSuccess = true;
        } else {
          outcome = '수련 유지 (스킬 변화 없음) 🕯️';
          desc = `배움의 깊이 축적! 주사위 눈 [ ${finalRoll} ]이 현재 기술 [ ${skillVal} ]의 한계를 넘지 못해 수치 상 변화는 없지만 기사의 내공에 쌓입니다. 경험치 체크는 규정에 따라 소실됩니다.`;
          color = 'var(--color-grey)';
        }

        const skillName = allSkills.find(s => s.key === selectedImproveKey)?.label || selectedImproveKey;

        setImproveRollResult({
          roll: finalRoll,
          outcome,
          desc,
          color,
          isSuccess,
          skillVal,
          skillName,
          isRolling: false
        });
        setIsRollingImprove(false);
      }
    }, 50);
  };

  const applyImprovementToSheet = () => {
    if (improveApplied) return;
    
    setCharacter(prev => {
      const updatedSkillsChecked = prev.skillsChecked ? {
        ...prev.skillsChecked,
        [selectedImproveKey]: false
      } : {};
      
      const updatedSkills = { ...prev.skills };
      if (improveRollResult?.isSuccess) {
        const currentVal = prev.skills?.[selectedImproveKey] || 0;
        updatedSkills[selectedImproveKey] = Math.min(20, currentVal + 1);
      }
      
      return {
        ...prev,
        skillsChecked: updatedSkillsChecked,
        skills: updatedSkills
      };
    });

    setImproveApplied(true);
    const addedText = improveRollResult?.isSuccess ? '스킬 레벨이 영구히 +1 상승하고 ' : '';
    alert(`[시트 수련 반영]: ${improveRollResult?.skillName} 스킬에 대해 ${addedText}경험치 체크(✓)를 정상 해제(소모)하였습니다.`);
  };

  // ==========================================
  // 5. MASS COMBAT (CHAPTER 8) LOGIC
  // ==========================================
  const rollBattleTactics = () => {
    if (isRollingBattle) return;
    setIsRollingBattle(true);
    setBattleTacticsResult(null);

    setTimeout(() => {
      const pRoll = Math.floor(Math.random() * 20) + 1;
      const eRoll = Math.floor(Math.random() * 20) + 1;

      // Opposed resolution
      const pVal = playerBattleSkillOverride;
      const eVal = enemyCommanderSkill;

      const pSuccess = pRoll <= pVal;
      const pCrit = pRoll === pVal;
      const pFumble = pRoll === 20 && pVal < 20;

      const eSuccess = eRoll <= eVal;
      const eCrit = eRoll === eVal;
      const eFumble = eRoll === 20 && eVal < 20;

      let pOutcome = '';
      let eOutcome = '';
      let advantage = '';
      let color = 'var(--color-grey)';

      // Determine outcomes
      if (pCrit) pOutcome = '대성공 (Critical!)';
      else if (pFumble) pOutcome = '대실패 (Fumble!)';
      else if (pSuccess) pOutcome = '성공 (Success)';
      else pOutcome = '실패 (Failure)';

      if (eCrit) eOutcome = '대성공 (Critical!)';
      else if (eFumble) eOutcome = '대실패 (Fumble!)';
      else if (eSuccess) eOutcome = '성공 (Success)';
      else eOutcome = '실패 (Failure)';

      // Compare
      if (pCrit && !eCrit) {
        advantage = '아군 전술적 압승! (+10 전투 보정 획득)';
        color = 'var(--color-success)';
      } else if (eCrit && !pCrit) {
        advantage = '적군 전술적 압승! (아군 대열 붕괴 및 -5 패널티)';
        color = 'var(--color-danger)';
      } else if (pSuccess && !eSuccess) {
        advantage = '아군 우세! (+5 전투 보정 획득)';
        color = 'var(--color-success)';
      } else if (eSuccess && !pSuccess) {
        advantage = '적군 우세! (아군 -3 패널티)';
        color = 'var(--color-danger)';
      } else if (pSuccess && eSuccess) {
        if (pRoll > eRoll) {
          advantage = '아군 판정승! (+3 전투 보정 획득)';
          color = 'var(--color-success)';
        } else if (eRoll > pRoll) {
          advantage = '적군 판정승! (아군 -2 패널티)';
          color = 'var(--color-danger)';
        } else {
          advantage = '치열한 대치 (동률)';
        }
      } else if (pFumble && !eFumble) {
        advantage = '아군 전열 붕괴! 극심한 패배 위기';
        color = 'var(--color-danger)';
      } else if (eFumble && !pFumble) {
        advantage = '적군 전열 붕괴! 기사의 전광석화 기회 (+5 보정)';
        color = 'var(--color-success)';
      } else {
        advantage = '난전 및 혼전 (양측 실패)';
      }

      setBattleTacticsResult({
        playerRoll: pRoll,
        enemyRoll: eRoll,
        playerOutcome: pOutcome,
        enemyOutcome: eOutcome,
        advantage,
        color
      });
      setIsRollingBattle(false);
    }, 800);
  };

  const rollMeleeEvent = () => {
    if (isRollingMeleeEvent) return;
    setIsRollingMeleeEvent(true);
    setMeleeEventResult(null);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 20) + 1;
      let outcome = '';
      let desc = '';
      let glory = 0;
      let loot = 0;

      if (roll <= 2) {
        outcome = '끔찍한 고립 (Surrounded by Enemy)';
        desc = '전투 대열이 완전히 붕괴되고 쇄도하는 작센 이교도 야만전사단에 포위되었습니다! 동료들의 엄호가 단절되었으므로 1대1 무기 대결창으로 이동하여 2명의 적과 연속으로 칼을 맞대어 돌파구를 직접 마련해야 합니다.';
        glory = 15;
      } else if (roll <= 5) {
        outcome = '보병 전사단 격돌 (Clash with Pagan Footmen)';
        desc = '선봉에 나선 무장한 작센 보병들이 아군 전열을 방패로 밀쳐내며 습격해옵니다. 단일 적과의 정면 대결이 전개됩니다.';
        glory = 25;
      } else if (roll <= 9) {
        outcome = '정예 기마 돌격 (Mounted Charger)';
        desc = '말을 타고 진흙을 가르며 가문 휘장을 노려 기습 돌격해오는 이교도 정예 기마전사와 맹렬한 창끝 대결이 벌어집니다. 1대1 대결기에서 랜스 충돌을 시뮬레이션하십시오.';
        glory = 35;
      } else if (roll <= 13) {
        outcome = '방패벽 유지 및 대열전 (Hold the Shieldwall)';
        desc = '프랑크 기사단의 거대한 방패벽 뒤에서 전우들과 함께 전열을 사수하며 버텨냅니다. 혼란스러운 전장의 철림 속에서 방패로 밀어내며 생존에 전념하십시오.';
        glory = 15;
      } else if (roll <= 16) {
        outcome = '적 우익 텐트 급습 및 전리품 쟁취 (Flanking & Plunder)';
        desc = '우회 기동에 성공하여 적 지휘부의 텐트 및 수레 수송대를 타격할 천금 같은 기회입니다! 이번 전투에서 기사적 대결을 승리하면, £5 상당의 막대한 약탈 보화와 무구를 쟁취합니다.';
        glory = 20;
        loot = 5;
      } else if (roll <= 19) {
        outcome = '적 백작과의 일대일 대치 (Enemy Commander Challenge)';
        desc = '프랑크의 전세를 뒤집기 위해 작센 침공군의 선봉장 백작 경이 가문의 문장을 보고 창을 겨누며 결투를 신청합니다! 기사도의 명예가 걸린 위대한 생사 결투가 성립됩니다!';
        glory = 100;
        loot = 10;
      } else {
        outcome = '위대한 선봉 대진격 (Glorious Vanguard Charge)';
        desc = '샤를마뉴 대제의 위엄찬 황금 나팔 소리와 함께 적 진형 정중앙을 분쇄하는 전설적인 쐐기 대돌격(Vanguard Charge)을 전개합니다! 이교도 전열이 아수라장으로 조각납니다!';
        glory = 50;
      }

      setMeleeEventResult({
        roll,
        outcome,
        desc,
        gloryAward: glory,
        lootAward: loot
      });

      // 즉각 누적 가산
      setBattleGloryTotal(prev => prev + glory);
      setBattleLootTotal(prev => prev + loot);

      setIsRollingMeleeEvent(false);
    }, 800);
  };

  const rollFollowersFate = () => {
    if (isRollingFollowersFate) return;
    setIsRollingFollowersFate(true);
    setFollowersFateResult(null);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 20) + 1;
      let outcome = '';
      let desc = '';
      let glory = 0;
      let loot = 0;

      if (roll <= 2) {
        outcome = '애마 사망 및 종자의 중상 (Squire Injured / Mount Slain)';
        desc = '적 창병의 가혹한 집단 공세에 휘말려 애마가 부러져 쓰러져 즉사하고, 종자가 자신의 몸을 던져 기사를 구하다 적의 날카로운 도끼에 큰 상처를 입었습니다! 기사 캐릭터의 마구 창에서 기동마 1필이 사망 처리되거나, 종자의 긴급 치료비로 은화 £2가 강제 차감됩니다.';
      } else if (roll <= 7) {
        outcome = '종자 경상 및 장비 파손 (Squire Scratched / Gear Damaged)';
        desc = '종자가 방패로 비산하는 파편과 화살을 막아내다 경미한 찰과상을 입었으며, 기사의 아머 가죽끈이 파손되어 정비가 필요합니다. 무구 보수 비용 £1이 발생합니다.';
        loot = -1; // penalty
      } else if (roll <= 14) {
        outcome = '안전 및 대열 유지 (Safe & Loyal)';
        desc = '검날과 돌이 비산하는 극도의 난전 속에서도 기사의 소중한 종자와 가신 군마 모두 상처 하나 없이 건재하게 전장을 수호했습니다.';
      } else if (roll <= 18) {
        outcome = '종자의 눈부신 수호 (Squire Shield Cover)';
        desc = '절체절명의 기습 화살 공격의 순간, 기사의 충성스러운 종자가 자신의 가죽 방패를 머리 위로 던져 주인의 목숨을 구했습니다! 종자의 헌신적인 전우애에 군사적 명예를 드높입니다!';
        glory = 10;
      } else {
        outcome = '신화적 무공 및 전리군마 포획 (Legendary Fate: Capture Enemy Steed)';
        desc = '종자가 주위의 아수라장 속에서 낙마한 적 이교도 기사의 기품 있고 튼튼한 적장 전용 기동마 고삐를 낚아채어 주군에게 바쳤습니다! 가문 마굿간에 명품 군마가 추가되며 가문의 부가 늘어납니다!';
        glory = 30;
        loot = 4;
      }

      setFollowersFateResult({
        roll,
        outcome,
        desc
      });

      // 누적 가산
      setBattleGloryTotal(prev => Math.max(0, prev + glory));
      setBattleLootTotal(prev => prev + loot);

      setIsRollingFollowersFate(false);
    }, 800);
  };

  const applyBattleToSheet = () => {
    const eventId = `solo:battle_settlement:${character.personal?.campaignYear || 768}`;
    if (battleApplied || hasAppliedEvent(character, eventId)) {
      alert("올해의 전투 정산은 이미 시트에 반영되었습니다.");
      return;
    }

    setCharacter(prev => {
      const result = applyOnce(prev, eventId, updated => {
        updated.gear.gloryTotal = (updated.gear?.gloryTotal || 1000) + battleGloryTotal;
        updated.gear.cash = Math.max(0, (updated.gear?.cash || 0) + battleLootTotal);
        
        // Apply battle follower fate roll <= 2 injuries/death to character sheet
        if (followersFateResult && followersFateResult.roll <= 2) {
          const currentCash = updated.gear?.cash || 0;
          if (currentCash >= 2) {
            updated.gear.cash = Math.max(0, currentCash - 2);
          } else {
            if (updated.squire) {
              updated.squire.status = '부상';
            }
            if (updated.horses?.warhorse) {
              updated.horses.warhorse.status = '사망';
              updated.horses.warhorse.hp = 0;
            }
          }
        }
        return updated;
      }, `전투 정산: Glory +${battleGloryTotal}, £${battleLootTotal}`);
      return result.character;
    });

    setBattleApplied(true);
    let alertMsg = `[전투 전술 정산 완료]: 대규모 집단 전장에서 거둔 위업이 기사 시트에 연동되었습니다.\n• 획득 명예: +${battleGloryTotal} Glory\n• 소지금 변동: £${battleLootTotal >= 0 ? '+' : ''}${battleLootTotal}`;
    if (followersFateResult && followersFateResult.roll <= 2) {
      alertMsg += `\n• 종자/군마 피해 적용: 소지금 £2 감액 또는 종자 부상 및 군마 사망 처리 완료.`;
    }
    alert(alertMsg);
  };

  const resetBattleSimulator = () => {
    setBattleTacticsResult(null);
    setMeleeEventResult(null);
    setFollowersFateResult(null);
    setBattleGloryTotal(0);
    setBattleLootTotal(0);
    setBattleApplied(false);
  };

  // ==========================================
  // 6. MAGIC & MIRACLES (CHAPTER 9) LOGIC
  // ==========================================
  const rollPrayerAndMiracle = () => {
    if (isRollingPrayer) return;
    setIsRollingPrayer(true);
    setPrayerResult(null);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 20) + 1;
      const isReligious = character?.skills?.religion >= 16; 
      const finalVal = 10 + selectedPrayerModifier + (isReligious ? 5 : 0);

      const isSuccess = roll <= finalVal;
      const isCrit = roll === finalVal;
      const isFumble = roll === 20 && finalVal < 20;

      let outcome = '';
      let desc = '';
      let color = '';
      let glory = 0;

      if (isCrit) {
        outcome = '성스러운 기적 발현 (Divine Miracle! - Critical)';
        desc = `기사가 [${prayerIntention}]을(를) 바라고 무릎을 꿇자, 하늘의 장막이 걷히고 영광스러운 가호가 비추며 기사의 상처가 씻은 듯이 나았습니다! 다가올 전투 라운드에 +10 절대 가호를 입습니다.`;
        color = 'var(--color-success)';
        glory = 50;
      } else if (isFumble) {
        outcome = '신의 분노와 불경 (Divine Displeasure - 대실패)';
        desc = `[${prayerIntention}]을(를) 부르짖었으나 기사의 불경스러운 마음이 탄로 나 하늘의 분노와 거절을 입었습니다. 다음 스킬 및 전투 판정에 -3 불이익이 주어집니다.`;
        color = 'var(--color-danger)';
      } else if (isSuccess) {
        outcome = '기도 성사 (Prayer Answered - Success)';
        desc = `[${prayerIntention}]의 간절한 외침이 하늘에 닿았습니다. 기사의 마음에 영적 평화가 깃들며, 다음 판정에 +3 영적 보정을 부여받습니다.`;
        color = 'var(--color-royal-blue)';
        glory = 10;
      } else {
        outcome = '침묵 (No Response - Failure)';
        desc = `[${prayerIntention}]을(를) 향한 간구는 무거운 침묵 속에 가라앉았습니다. 더 헌신적인 참회와 고행의 행로가 요구됩니다.`;
        color = 'var(--color-grey)';
      }

      setPrayerResult({ roll, outcome, desc, color, glory });
      setMagicGloryTotal(prev => prev + glory);
      setIsRollingPrayer(false);

      // Add to narrative chronicle
      setMagicLogs(prev => [
        {
          id: Date.now(),
          type: 'prayer',
          title: '🛐 성스러운 기도와 기적',
          detail: `간구 지향: "${prayerIntention}" | 결과: d20: ${roll} -> ${outcome}`,
          narrative: desc,
          glory: glory,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
    }, 800);
  };

  const rollPaganConversion = () => {
    if (isRollingConversion) return;
    setIsRollingConversion(true);
    setConversionResult(null);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 20) + 1;
      const targetVal = character?.skills?.religion || 10;
      const isSuccess = roll <= targetVal;
      const isCrit = roll === targetVal;
      const isFumble = roll === 20 && targetVal < 20;

      let outcome = '';
      let desc = '';
      let glory = 0;

      if (isCrit) {
        outcome = '기적적인 개종 성사 (Miraculous Conversion - Critical)';
        desc = `이교 장수 ${paganCommanderName}(이)가 기사의 흔들림 없는 숭고한 믿음과 십자가의 광채에 압도되어 무기를 내려놓고 즉시 개종하여 세례를 약속했습니다! 제국에 찬송이 울려 퍼집니다.`;
        glory = 100;
      } else if (isFumble) {
        outcome = '기만적 배신 (Pagan Hostility - 대실패)';
        desc = `개종을 권유받은 ${paganCommanderName}(이)가 위선적인 조롱으로 기사를 기만하며 기습 공격을 감행해 가문의 명예를 실추시키고 깊은 불명예를 안겼습니다.`;
        glory = -20;
      } else if (isSuccess) {
        outcome = '진실한 개종 (True Conversion - Success)';
        desc = `이교도 장수 ${paganCommanderName}(이)가 무릎을 꿇고 거짓된 우상을 버린 채 성부와 성자와 성령의 이름으로 개종을 서약했습니다.`;
        glory = 50;
      } else {
        outcome = '완강한 거부 (Conversion Refused - Failure)';
        desc = `${paganCommanderName}는 "나의 고결한 옛 선조들의 신을 배신할 수 없다"며 기사의 권고를 칼같이 거절했습니다.`;
      }

      setConversionResult({ roll, outcome, desc, glory });
      setMagicGloryTotal(prev => prev + glory);
      setIsRollingConversion(false);

      // Add to narrative chronicle
      setMagicLogs(prev => [
        {
          id: Date.now(),
          type: 'conversion',
          title: '⛪ 이교 장수 개종 판정',
          detail: `대상: "${paganCommanderName}" | 결과: d20: ${roll} -> ${outcome}`,
          narrative: desc,
          glory: glory,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
    }, 800);
  };

  const rollJudicialTrial = () => {
    if (isRollingTrial) return;
    setIsRollingTrial(true);
    setTrialResult(null);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 20) + 1;
      let targetVal = 10;
      let typeLabel = '';

      if (selectedTrialType === 'combat') {
        targetVal = character?.skills?.sword || 13;
        typeLabel = '사법 결투 (Trial by Combat)';
      } else if (selectedTrialType === 'ordeal_iron') {
        targetVal = character?.attributes?.con || 12;
        typeLabel = '달군 철 시련 (Trial by Hot Iron)';
      } else {
        targetVal = character?.attributes?.con || 12;
        typeLabel = '끓는 물 시련 (Trial by Hot Water)';
      }

      const isSuccess = roll <= targetVal;
      const isCrit = roll === targetVal;
      const isFumble = roll === 20 && targetVal < 20;

      let outcome = '';
      let desc = '';
      let glory = 0;

      if (isCrit) {
        outcome = '완벽한 결백 입증 (Divine Vindicated - Critical)';
        desc = `기사에게 씌워진 [${trialAccusation}]에 대해 신성한 법정에서 신께서 완벽한 무고함을 친히 선포하셨습니다! 모함한 원수들이 즉시 파문과 추방을 입으며 명예가 드높아졌습니다.`;
        glory = 50;
      } else if (isFumble) {
        outcome = '신의 정죄와 유죄 선고 (Guilty Verdict - 대실패)';
        desc = `[${trialAccusation}]의 신명 재판 도중 비참한 부상이나 패배가 깃들어 사법 심관들이 공식 유죄를 선포했습니다! 징벌적 불이익과 씻을 수 없는 치욕을 뒤집어씁니다.`;
        glory = -50;
      } else if (isSuccess) {
        outcome = '무죄 선포 (Innocent - Success)';
        desc = `[${trialAccusation}]의 사법적 시련을 훌륭히 견뎌내어, 3일 후 깨끗하게 아문 상처(혹은 결투 승리)를 본 판관들로부터 '결백(Innocent)' 판정을 쟁취했습니다!`;
        glory = 25;
      } else {
        outcome = '의혹 미해소 (Guilty by default - Failure)';
        desc = `시련을 입증하는 데 실패하여 [${trialAccusation}] 혐의가 기소 인정되었습니다. 주군에게 거액의 배상금을 헌납하거나 참회의 순례길을 떠나야 합니다.`;
      }

      setTrialResult({ roll, outcome, desc, glory });
      setMagicGloryTotal(prev => prev + glory);
      setIsRollingTrial(false);

      // Add to narrative chronicle
      setMagicLogs(prev => [
        {
          id: Date.now(),
          type: 'trial',
          title: `⚖️ 신명 사법 시련: ${typeLabel}`,
          detail: `혐의: "${trialAccusation}" | 결과: d20: ${roll} -> ${outcome}`,
          narrative: desc,
          glory: glory,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
    }, 800);
  };

  const rollLadyCourtship = () => {
    if (isRollingCourtship) return;
    setIsRollingCourtship(true);
    setCourtshipResult(null);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 20) + 1;
      let targetVal = 10;
      if (selectedLadyAmorType === 'passive') {
        targetVal = ladyLoveStat;
      } else {
        targetVal = character?.skills?.romance || 10;
      }

      const isSuccess = roll <= targetVal;
      const isCrit = roll === targetVal;
      const isFumble = roll === 20 && targetVal < 20;

      let outcome = '';
      let desc = '';
      let glory = 0;
      let amorIncrease = 0;

      if (selectedLadyAmorType === 'passive') {
        if (isCrit) {
          outcome = '낭만적인 넋을 잃음 (Fallen Madly in Love - Critical)';
          desc = `고결하고 눈부신 ${targetLadyName}의 우아한 자태에 눈이 멀어 기사의 영혼이 마법처럼 격렬한 사랑(Amor)에 사로잡혔습니다. 사랑의 주술을 입어 그녀를 향한 Amor 성향이 폭등합니다!`;
          glory = 20;
          amorIncrease = 5;
        } else if (isFumble) {
          outcome = '사랑의 저주와 불경 (Love Rejected - 대실패)';
          desc = `${targetLadyName}에게 낭만을 구했으나, 어설픈 행동과 오만방자한 태도로 가문의 비웃음을 사고 구애의 기회가 영구히 가로막혔습니다.`;
          glory = -10;
        } else if (isSuccess) {
          outcome = '사랑의 감성 고양 (Infatuated - Success)';
          desc = `${targetLadyName}의 순결하고 우아한 태도에 마음을 빼앗겨 기사로서 품을 수 있는 고귀한 열망과 Amor가 영혼 속에 진실하게 싹텄습니다.`;
          glory = 10;
          amorIncrease = 2;
        } else {
          outcome = '무덤덤함 (Indifference - Failure)';
          desc = `${targetLadyName}는 눈부신 미소만 스쳐 보냈을 뿐, 무덤덤하게 시선을 돌려 기사의 마음에 아무런 상흔을 남기지 않았습니다.`;
        }
      } else {
        if (isCrit) {
          outcome = '기사적 연애 대성공 (Deliberate Courtship - Critical)';
          desc = `적절한 교양 서정시와 [${courtshipGift}]을(를) 선물로 바쳐 ${targetLadyName}의 영혼을 깊은 눈물의 감동으로 가득 채웠습니다! 그녀는 감사의 징표로 기사에게 향기로운 리본을 건넸습니다.`;
          glory = 50;
          amorIncrease = 4;
        } else if (isFumble) {
          outcome = '사랑의 파멸 (Courtship Ruined - 대실패)';
          desc = `[${courtshipGift}]을(를) 바치려다 처참한 궁정 예법 위반으로 ${targetLadyName}의 명예를 더럽히고 궁정에서 영구 퇴출당했습니다! 양가에 대대적인 원한이 서립니다.`;
          glory = -30;
        } else if (isSuccess) {
          outcome = '구애 성공 (Lady Courted - Success)';
          desc = `기품 있는 예절과 헌신적인 Chanson을 지어 부르고 [${courtshipGift}]을(를) 건네어 ${targetLadyName}의 숭고한 호감과 연애 애정을 얻는 데 드디어 성공했습니다!`;
          glory = 20;
          amorIncrease = 1;
        } else {
          outcome = '매력 발산 실패 (Courtship Rejected - Failure)';
          desc = `[${courtshipGift}]을(를) 건네었으나 ${targetLadyName}의 마음의 빗장을 열기에 기사로서의 무훈과 세련된 교양의 깊이가 여전히 못 미쳤습니다.`;
        }
      }

      setCourtshipResult({ roll, outcome, desc, glory, amorIncrease });
      setMagicGloryTotal(prev => prev + glory);
      setIsRollingCourtship(false);

      // Add to narrative chronicle
      setMagicLogs(prev => [
        {
          id: Date.now(),
          type: 'courtship',
          title: `🌹 궁정 구애: ${selectedLadyAmorType === 'passive' ? '넋을 잃음' : '적극적 연애'}`,
          detail: `상대: "${targetLadyName}" | 공물: "${courtshipGift}" | 결과: d20: ${roll} -> ${outcome}`,
          narrative: desc,
          glory: glory,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
    }, 800);
  };

  const rollDreamsAndOmens = () => {
    if (isRollingDream) return;
    setIsRollingDream(true);
    setDreamResult(null);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 20) + 1;
      let outcome = '';
      let desc = '';

      if (roll <= 3) {
        outcome = '불길한 피의 징조 (Omen of Blood)';
        desc = '어둠 속에서 가문의 웅장한 방패가 불타오르고, 전장에 피가 강물처럼 흘러넘치는 참담한 전쟁 꿈을 꿨습니다. 다음 전투의 첫 1회 타격에 -3 절대 보정치를 적용받습니다.';
      } else if (roll <= 8) {
        outcome = '성모님의 신성한 가호 (Omen of Protection)';
        desc = '온화한 성모님께서 빛의 망토로 기사를 덮으며 피 묻은 가슴을 씻겨주시는 자애로운 꿈을 꾸었습니다! 다음 모험 중 직면할 생사 위기를 1회에 한해 완전 방어(자동 아머 세이브)할 수 있습니다.';
      } else if (roll <= 14) {
        outcome = '평온한 예언 (Quiet Dream)';
        desc = '비가 평화롭게 쏟아지는 밀밭과 영지의 백성들이 풍성한 추수를 거두는 평화로운 꿈을 꾸었습니다. 특별한 징조는 없습니다.';
      } else if (roll <= 18) {
        outcome = '용맹의 고취 (Dream of Valor)';
        desc = '전설 속의 황금 사자가 군단 깃발에 올라타 포효하는 웅장한 환시를 보았습니다! 다음 용맹(Valorous) 성향 시험 판정에 +5 절대 보정을 부여받습니다.';
      } else {
        outcome = '천사의 영감 계시 (Angelic Revelation)';
        desc = '천사 가브리엘이 기사의 꿈속에 내려와, 다가올 이교도 군단의 은밀한 약점과 승리의 행로를 귓속말로 귀띔해주셨습니다! 다음 모험/전투 판정 1회에 주사위 재굴림 권능을 얻습니다.';
      }

      setDreamResult({ roll, outcome, desc });
      setIsRollingDream(false);

      // Add to narrative chronicle
      setMagicLogs(prev => [
        {
          id: Date.now(),
          type: 'dream',
          title: '🌌 전야의 꿈과 징조',
          detail: `결과: d20: ${roll} -> ${outcome}`,
          narrative: desc,
          glory: 0,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
    }, 800);
  };

  const applyMagicToSheet = () => {
    const eventId = `solo:magic_settlement:${character.personal?.campaignYear || 768}`;
    if (magicApplied || hasAppliedEvent(character, eventId)) {
      alert("올해의 신앙 and 기적 정산은 이미 시트에 반영되었습니다.");
      return;
    }

    setCharacter(prev => {
      const result = applyOnce(prev, eventId, updated => {
        updated.gear.gloryTotal = (updated.gear?.gloryTotal || 1000) + magicGloryTotal;
        if (courtshipResult?.amorIncrease) {
          const currentAmor = updated.passions?.amor || 0;
          updated.passions.amor = Math.min(20, currentAmor + courtshipResult.amorIncrease);
        }

        // Prayer Critical: heals the character to full HP
        if (prayerResult?.outcome?.includes('Divine Miracle!') || prayerResult?.outcome?.includes('Critical')) {
          updated.attributes.currentHp = (updated.attributes?.siz || 0) + (updated.attributes?.con || 0);
        }

        // Pagan Conversion Fumble: deducts 1 point of Honor
        if (conversionResult?.outcome?.includes('대실패')) {
          updated.passions.honor = Math.max(0, (updated.passions?.honor || 16) - 1);
        }

        // Judicial Trial Fumble: deducts £5; failure: deducts £3
        if (trialResult) {
          if (trialResult.outcome.includes('대실패')) {
            updated.gear.cash = Math.max(0, (updated.gear.cash || 0) - 5);
          } else if (trialResult.outcome.includes('Failure')) {
            updated.gear.cash = Math.max(0, (updated.gear.cash || 0) - 3);
          }
        }

        // Courtship Fumble: deducts 2 Amor
        if (courtshipResult?.outcome?.includes('대실패')) {
          updated.passions.amor = Math.max(0, (updated.passions?.amor || 0) - 2);
        }

        return updated;
      }, `신앙과 기적 정산: Glory +${magicGloryTotal}`);
      return result.character;
    });

    setMagicApplied(true);
    let alertMsg = `[신앙과 기적 정산 완료]: 성스러운 위업 및 모험에서 거둔 영예가 공식 적용되었습니다.\n• 획득 명예: +${magicGloryTotal} Glory`;
    if (courtshipResult?.amorIncrease) {
      alertMsg += `\n• 연망(Amor) 상승: +${courtshipResult.amorIncrease}`;
    }
    if (prayerResult?.outcome?.includes('Divine Miracle!') || prayerResult?.outcome?.includes('Critical')) {
      alertMsg += `\n• 기도 기적: 최대 체력 회복 완료!`;
    }
    if (conversionResult?.outcome?.includes('대실패')) {
      alertMsg += `\n• 개종 대실패: 명예 -1 페널티 적용`;
    }
    if (trialResult?.outcome?.includes('대실패')) {
      alertMsg += `\n• 신명재판 대실패: £5 강제 벌금 징수`;
    } else if (trialResult?.outcome?.includes('Failure')) {
      alertMsg += `\n• 신명재판 실패: £3 강제 벌금 징수`;
    }
    if (courtshipResult?.outcome?.includes('대실패')) {
      alertMsg += `\n• 구애 대실패: 연망(Amor) -2 하락`;
    }
    alert(alertMsg);
  };

  const resetMagicSimulator = () => {
    setPrayerResult(null);
    setConversionResult(null);
    setTrialResult(null);
    setCourtshipResult(null);
    setDreamResult(null);
    setMagicGloryTotal(0);
    setMagicApplied(false);
    setMagicLogs([]);
  };

  // ==========================================
  // 7. WEALTH & TREASURE (CHAPTER 12) LOGIC
  // ==========================================
  const payMaintenance = () => {
    const eventId = `economy:maintenance:${character.personal?.campaignYear || 768}`;
    if (hasAppliedEvent(character, eventId)) {
      alert("올해의 생활 수준 유지비는 이미 지불되었습니다.");
      return;
    }
    const costMap = { rich: 12, ordinary: 6, poor: 3, miserly: 1.5 };
    const cost = costMap[selectedLivingStandard];
    const currentCash = character?.gear?.cash || 0;

    if (currentCash < cost) {
      alert(`[재정 지불 실패]: 현재 기사단 소지금(£${currentCash})이 ${selectedLivingStandard === 'rich' ? '풍족함' : selectedLivingStandard === 'ordinary' ? '보통' : selectedLivingStandard === 'poor' ? '빈곤함' : '인색함'} 유지비 £${cost}보다 부족합니다!`);
      return;
    }

    setCharacter(prev => {
      const updated = {
        ...prev,
        gear: {
          ...prev.gear,
          cash: Math.max(0, (prev.gear?.cash || 0) - cost)
        }
      };
      updated.campaign = markWinterStep(updated, 'maintenance');
      updated.campaign = markAppliedEvent(updated, eventId, `생활 수준 유지비 £${cost}`);
      return updated;
    });

    const logs = [
      {
        id: Date.now(),
        type: 'maintenance',
        title: '💼 생활 수준 유지비 지불',
        detail: `생활 수준: ${selectedLivingStandard.toUpperCase()} | 지출: £${cost}`,
        narrative: `올해 겨울 정산을 위해 기사의 기품 있는 신분을 상징하는 ${selectedLivingStandard === 'rich' ? '풍족한(Rich)' : selectedLivingStandard === 'ordinary' ? '보통의(Ordinary)' : selectedLivingStandard === 'poor' ? '빈곤한(Poor)' : '인색한(Miserly)'} 가문 생활 수준 유지비 £${cost}를 금고에서 기꺼이 지불했습니다.`,
        cost: -cost,
        timestamp: new Date().toLocaleTimeString()
      }
    ];
    setArmoryLogs(prev => [...logs, ...prev]);
    alert(`[생활 수준 유지비 납부 완료]: £${cost}가 지출되었으며, 시트 소지금에 동기화되었습니다.`);
  };

  const buyArmoryItem = (label, cost, category, itemData) => {
    const currentCash = character?.gear?.cash || 0;

    if (currentCash < cost) {
      alert(`[상점 구매 실패]: 소지금(£${currentCash})이 부족하여 ${label} (£${cost})을(를) 구매할 수 없습니다!`);
      return;
    }

    setCharacter(prev => {
      const updated = {
        ...prev,
        gear: {
          ...prev.gear,
          cash: Math.max(0, (prev.gear?.cash || 0) - cost)
        }
      };
      
      // Update inventory on sheet if matching category
      if (category === 'horse') {
        updated.horses = {
          ...prev.horses,
          warhorse: {
            ...prev.horses?.warhorse,
            type: label,
            hp: itemData.hp,
            armor: itemData.armor,
            damage: itemData.damage
          }
        };
      } else if (category === 'armor') {
        const currentShield = prev.gear?.armorShield?.includes('방패') ? ' + 방패 (+3)' : '';
        updated.gear.armorShield = label + currentShield;
      } else if (category === 'shield') {
        const currentArmor = prev.gear?.armorShield?.split('+')[0]?.trim() || '사슬갑옷 (10점)';
        updated.gear.armorShield = currentArmor + ' + ' + label;
      } else if (category === 'weapon') {
        const currentGear = prev.gear?.personalGear ? prev.gear.personalGear + ', ' : '';
        updated.gear.personalGear = currentGear + label;
      }
      
      return updated;
    });

    const logs = [
      {
        id: Date.now(),
        type: 'purchase',
        title: `🛒 상점 무구/군마 구입`,
        detail: `품명: ${label} | 지출: £${cost}`,
        narrative: `장원 금고에서 £${cost}를 인출하여 장인단 및 장교로부터 최고급 무구인 [${label}]을(를) 공식 취득하였습니다. 이는 즉시 기사 시트의 장비고에 등재되었습니다.`,
        cost: -cost,
        timestamp: new Date().toLocaleTimeString()
      }
    ];
    setArmoryLogs(prev => [...logs, ...prev]);
    alert(`[구매 완료]: ${label}을(를) £${cost}에 구매하여 기사 장비 및 군마 정보가 실시간 업데이트되었습니다.`);
  };

  const rollAppraiseLoot = () => {
    const eventId = `economy:treasure_appraisal:${character.personal?.campaignYear || 768}`;
    if (hasAppliedEvent(character, eventId)) {
      alert("올해의 전리품 감정 현금 보상은 이미 정산되었습니다.");
      return;
    }
    if (isAppraising) return;
    setIsAppraising(true);
    setAppraisedTreasure(null);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 20) + 1;
      
      let name = '';
      let value = 0;
      let desc = '';

      if (roll <= 3) {
        name = '이교도 장병들의 전술 무구 파편';
        value = 0.5;
        desc = '전투 후 흙더미에 반쯤 파묻힌 이교 보병들의 구리 장식 칼자루와 부러진 창날 조각들을 쓸어 모았습니다. 고철상에게 소량의 가치가 있습니다.';
      } else if (roll <= 7) {
        name = '정교한 사라센 놋쇠 브로치';
        value = 1.0;
        desc = '죽은 이교 지휘관의 옷자락을 여미던 반짝이는 놋쇠 세공 브로치입니다. 흠집이 거의 없어 시장에 가져가면 £1에 처분할 수 있습니다.';
      } else if (roll <= 11) {
        name = '귀족용 사라센 실크 튜닉';
        value = 2.0;
        desc = '이국적이고 촉감이 매우 부드러운 동방의 실크 외투입니다. 귀족이나 학자들에게 훌륭한 장식복이 되어 높은 몸값을 부를 수 있습니다.';
      } else if (roll <= 14) {
        name = '세공된 이단 단죄용 은제 성배';
        value = 3.0;
        desc = '세례의 성수를 담을 수 있도록 장인단이 수려하게 세공해 놓은 순은제 성배입니다. 교회의 대의나 영지 제단에 훌륭하게 바치거나 £3에 처분합니다.';
      } else if (roll <= 17) {
        name = '불꽃이 비치는 루비 세공 가락지';
        value = 5.0;
        desc = '중앙에 핏빛처럼 영롱하게 빛나는 천연 루비가 장식된 장인의 금반지입니다. 가문의 보물함에 가득 찬 기사적 자긍심과 보화가 됩니다.';
      } else if (roll <= 19) {
        name = '화려한 황금 모자이크 영지 장식물';
        value = 8.0;
        desc = '비잔티움 장인들이 직접 모자이크 타일을 구워 만든 정교한 성화 장식판입니다. 장원의 위엄을 한 단계 높여주며 막대한 가치를 지닙니다.';
      } else {
        name = '천상의 가호를 담은 성물 성골함의 봉인 봉화';
        value = 12.0;
        desc = '전설적인 성 성골함의 모조 장식 테두리 조각 또는 황금 세공 뚜껑입니다! 룰북 p.209에 해당하는 최고의 위엄찬 보화로 주군에게 명예를 사거나 £12의 엄청난 소지금으로 즉시 정산할 수 있습니다!';
      }

      setCharacter(prev => {
        const result = applyOnce(prev, eventId, updated => {
          updated.gear.cash = (updated.gear?.cash || 0) + value;
          return updated;
        }, `전리품 감정 £${value}`);
        return result.character;
      });

      setAppraisedTreasure({ roll, name, value, desc });
      setIsAppraising(false);

      const logs = [
        {
          id: Date.now(),
          type: 'appraise',
          title: `💎 보물 감정 & 전리품 정산`,
          detail: `획득: ${name} | 가치: +£${value}`,
          narrative: `모험 중 수습한 전리보화를 감정한 결과, [${name}]의 진정한 위용이 드러났습니다! 즉시 처분하여 장원 금고에 +£${value}의 현금이 정산되었습니다.`,
          cost: value,
          timestamp: new Date().toLocaleTimeString()
        }
      ];
      setArmoryLogs(prev => [...logs, ...prev]);
    }, 800);
  };

  const resetArmoryLogs = () => {
    setArmoryLogs([]);
    setAppraisedTreasure(null);
  };

  const getOracleAnswerFromRollText = (ans) => {
    if (!ans) return '';
    return ans.result + ': ' + ans.desc;
  };

  return (
    <div className="cs-page view-animate">
      <h2 className="cs-page-title">
        <Sparkles size={20} style={{ color: 'var(--color-gold-dark)' }} />
        운명의 신탁과 주사위
      </h2>
      
      {/* Profile Header Banner */}
      <div className="tutorial-banner" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <p style={{ fontSize: '0.86rem', margin: 0, color: 'var(--color-grey)' }}>
              기사: <strong style={{ color: 'var(--color-ink)' }}>{(character?.personal?.name || '기사').split(' (')[0]}</strong> &bull; 명예: <strong style={{ color: 'var(--color-ink)' }}>{character?.gear?.gloryTotal || 1000} Glory</strong> &bull; 소지금: <strong style={{ color: 'var(--color-ink)' }}>£{character?.gear?.cash || 0}</strong>
            </p>
          </div>
        </div>
        
        {/* Immersive Chapter 6 General Solo Rules Explanation */}
        <div style={{ borderTop: '1px solid rgba(201, 168, 76, 0.15)', paddingTop: '8px', marginTop: '4px', fontSize: '0.82rem', color: 'var(--color-grey)', lineHeight: 1.45 }}>
          📖 <strong>제너럴 솔로 모험 규칙 (General Rules)</strong>: 기사의 모든 운명 판정은 1인 플레이 기본 수칙을 따릅니다. 이 오라클 패널의 모든 굴림(일반 신탁, 성격 및 열정 시험, 전투 격돌)은 캐릭터 성장의 모태가 되며, 겨울 정산 단계(가문 역사 탭)의 수련 및 가문 계승과 유기적으로 긴밀히 연결됩니다.
        </div>

        {/* Expanded sub-tabs with consistent premium pills */}
        <div className="sub-tab-navigation" style={{ margin: '8px 0 0 0' }}>
          <button 
            className={`sub-tab-btn ${activeSubTab === 'general' ? 'active' : ''}`} 
            onClick={() => setActiveSubTab('general')}
          >
            <Dices size={14} /> 일반 판정 및 운명 신탁
          </button>
          <button 
            className={`sub-tab-btn ${activeSubTab === 'personality' ? 'active' : ''}`} 
            onClick={() => setActiveSubTab('personality')}
          >
            <Sparkles size={14} /> 성격 특성과 기사적 열정
          </button>
          <button 
            className={`sub-tab-btn ${activeSubTab === 'reputation' ? 'active' : ''}`} 
            onClick={() => setActiveSubTab('reputation')}
          >
            <Award size={14} /> 명예 계산과 명망 알현
          </button>
          <button 
            className={`sub-tab-btn ${activeSubTab === 'combat_skills' ? 'active' : ''}`} 
            onClick={() => setActiveSubTab('combat_skills')}
          >
            <Shield size={14} /> 1대1 무기 격돌 및 전투 기술
          </button>
          <button 
            className={`sub-tab-btn ${activeSubTab === 'miracles_amor' ? 'active' : ''}`} 
            onClick={() => setActiveSubTab('miracles_amor')}
          >
            <Heart size={14} /> 신앙 기적과 사법 재판 및 연애
          </button>
          <button 
            className={`sub-tab-btn ${activeSubTab === 'wealth_armory' ? 'active' : ''}`} 
            onClick={() => setActiveSubTab('wealth_armory')}
          >
            <Coins size={14} /> 재정 생활 수준 및 무구 상점
          </button>
        </div>
      </div>

      {/* ========================================================
          SUB-TAB 1: GENERAL ORACLES & BASIC DICES
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

          {/* Oracle + Name Gen */}
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
                  <div className="cs-field" style={{ margin: 0, height: '38px', padding: '0 8px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px' }}>
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
          <div className="cs-row">
            {/* 1. Trait Roller */}
            <section className="cs-section" style={{ flex: '1 1 450px' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-royal-blue)' }}>
                <h3><Shield size={16} style={{ marginRight: '6px' }} />성격 특성 판정기</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: 0 }}>
                  상황에서 기사가 어떤 비이성적 충동이나 신조적 행동을 할지 주사위 d20으로 가늠합니다.
                </p>

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
                    {traitPairs.map((p, idx) => (
                      <option key={idx} value={idx}>
                        {p.leftKo} ({getTraitValue(p.left)}) vs {p.rightKo} ({getTraitValue(p.right)})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(0,0,0,0.02)', padding: '8px', border: '1px solid var(--color-grey-light)' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '6px', border: selectedTraitDirection === 'left' ? '2px solid var(--color-royal-blue)' : '2px solid transparent', background: selectedTraitDirection === 'left' ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }}>
                    <input type="radio" checked={selectedTraitDirection === 'left'} onChange={() => { setSelectedTraitDirection('left'); setTraitRollResult(null); }} style={{ display: 'none' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{traitPairs[selectedTraitPair].leftKo.split(' ')[0]}</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-royal-blue)', marginTop: '4px' }}>{getTraitValue(traitPairs[selectedTraitPair].left)}</span>
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '6px', border: selectedTraitDirection === 'right' ? '2px solid var(--color-royal-blue)' : '2px solid transparent', background: selectedTraitDirection === 'right' ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }}>
                    <input type="radio" checked={selectedTraitDirection === 'right'} onChange={() => { setSelectedTraitDirection('right'); setTraitRollResult(null); }} style={{ display: 'none' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{traitPairs[selectedTraitPair].rightKo.split(' ')[0]}</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-royal-blue)', marginTop: '4px' }}>{getTraitValue(traitPairs[selectedTraitPair].right)}</span>
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="cs-field" style={{ margin: 0 }}>
                    <span className="cs-field-label">상황적 보정치:</span>
                    <input type="number" value={traitModifier} onChange={e => { setTraitModifier(parseInt(e.target.value) || 0); setTraitRollResult(null); }} style={{ width: '100%' }} />
                  </div>
                  <div className="cs-field" style={{ margin: 0, opacity: 0.85 }}>
                    <span className="cs-field-label">최종 판정 목표치:</span>
                    <div style={{ display: 'flex', alignItems: 'center', height: '36px', paddingLeft: '8px', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--color-crimson)' }}>
                      {getTraitValue(selectedTraitDirection === 'left' ? traitPairs[selectedTraitPair].left : traitPairs[selectedTraitPair].right) + parseInt(traitModifier)} 이하
                    </div>
                  </div>
                </div>

                <button className="btn-medieval btn-medieval-primary" onClick={executeTraitRoll} style={{ justifyContent: 'center' }} disabled={isRollingTrait}>
                  {isRollingTrait ? '주사위 굴림 중...' : '특성 주사위 굴리기'}
                </button>

                {traitRollResult && (
                  <div style={{ border: `2px solid ${traitRollResult.color}`, background: 'rgba(0,0,0,0.01)', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)', marginBottom: '4px' }}>d20 결과</span>
                    <D20Face value={traitRollResult.roll} isRolling={isRollingTrait} color={traitRollResult.color} />
                    
                    {!traitRollResult.isRolling && (
                      <div style={{ marginTop: '10px', textAlign: 'center', width: '100%' }}>
                        <h4 style={{ color: traitRollResult.color, fontWeight: 'bold', fontSize: '1.1rem' }}>{traitRollResult.outcome}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: '8px 0', whiteSpace: 'pre-line' }}>{traitRollResult.desc}</p>
                        
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
                          {traitRollResult.checkRequired && <button className="btn-medieval" onClick={() => applyTraitOutcome('checked')} style={{ fontSize: '0.75rem', padding: '4px 8px' }}>✓ 신조대로 행동</button>}
                          {traitRollResult.checkRequired && <button className="btn-medieval" onClick={() => applyTraitOutcome('act_opposite')} style={{ fontSize: '0.75rem', padding: '4px 8px', borderColor: 'var(--color-crimson)', color: 'var(--color-crimson)' }}>✗ 유혹 굴복 페널티</button>}
                          {traitRollResult.oppositeCheckRequired && <button className="btn-medieval" onClick={() => applyTraitOutcome('fumble')} style={{ fontSize: '0.75rem', padding: '4px 8px', borderColor: 'var(--color-crimson)', color: 'var(--color-crimson)' }}>☠️ 대실패 굴복</button>}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* 2. Passion Roller */}
            <section className="cs-section" style={{ flex: '1 1 450px' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-crimson)' }}>
                <h3><Flame size={16} style={{ marginRight: '6px' }} />열정 &amp; 영감 롤러</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: 0 }}>
                  가족이나 주군을 향한 열정을 불태워 전투 및 스킬 판정에 위대한 초인적 영감(Inspiration) 보정을 불러옵니다.
                </p>

                <div className="cs-field">
                  <span className="cs-field-label">열정 선택:</span>
                  <select value={selectedPassionKey} onChange={e => { setSelectedPassionKey(e.target.value); setPassionRollResult(null); setPassionActionApplied(false); }} style={{ width: '100%', padding: '6px' }}>
                    <option value="">-- 열정 선택 --</option>
                    {character?.passions && Object.keys(character.passions).map(key => (
                      <option key={key} value={key}>{passionNamesKo[key] || key} ({getPassionValue(key)})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={isChivalryActive} onChange={e => { setIsChivalryActive(e.target.checked); setPassionRollResult(null); }} />
                    🛡️ 기사도/로맨스 보너스 활성화 (효과 2배!)
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="cs-field" style={{ margin: 0 }}>
                    <span className="cs-field-label">상황 보정치:</span>
                    <input type="number" value={passionModifier} onChange={e => { setPassionModifier(parseInt(e.target.value) || 0); setPassionRollResult(null); }} style={{ width: '100%' }} />
                  </div>
                  <div className="cs-field" style={{ margin: 0 }}>
                    <span className="cs-field-label">최종 영감 판정치:</span>
                    <div style={{ display: 'flex', alignItems: 'center', height: '36px', paddingLeft: '8px', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--color-crimson)' }}>
                      {selectedPassionKey ? (getPassionValue(selectedPassionKey) + parseInt(passionModifier)) : 0} 이하
                    </div>
                  </div>
                </div>

                <button className="btn-medieval btn-medieval-primary" onClick={executePassionRoll} style={{ justifyContent: 'center' }} disabled={isRollingPassion || !selectedPassionKey}>
                  {isRollingPassion ? '열정 부르짖는 중...' : '열정 주사위 굴리기'}
                </button>

                {passionRollResult && (
                  <div style={{ border: `2px solid ${passionRollResult.color}`, background: 'rgba(0,0,0,0.01)', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)', marginBottom: '4px' }}>d20 결과</span>
                    <D20Face value={passionRollResult.roll} isRolling={isRollingPassion} color={passionRollResult.color} />
                    
                    {!passionRollResult.isRolling && (
                      <div style={{ marginTop: '10px', textAlign: 'center', width: '100%' }}>
                        <h4 style={{ color: passionRollResult.color, fontWeight: 'bold', fontSize: '1.1rem' }}>{passionRollResult.outcome}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: '8px 0' }}>{passionRollResult.desc}</p>
                        
                        <div style={{ marginTop: '12px', borderTop: '1px dashed var(--color-grey-light)', paddingTop: '10px' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {passionRollResult.state === 'inspiration' && (
                              <>
                                <button className="btn-medieval" onClick={() => applyPassionResolution('success')} disabled={passionActionApplied} style={{ fontSize: '0.75rem', padding: '4px 8px', color: 'var(--color-success)', borderColor: 'var(--color-success)' }}>⚔️ 임무 성공 반영</button>
                                <button className="btn-medieval" onClick={() => applyPassionResolution('fail')} disabled={passionActionApplied} style={{ fontSize: '0.75rem', padding: '4px 8px', color: 'var(--color-crimson)', borderColor: 'var(--color-crimson)' }}>💥 임무 실패 (쇼크)</button>
                              </>
                            )}
                            {passionRollResult.state === 'disheartened' && (
                              <>
                                <button className="btn-medieval" onClick={() => applyPassionResolution('success')} disabled={passionActionApplied} style={{ fontSize: '0.75rem', padding: '4px 8px', color: 'var(--color-success)', borderColor: 'var(--color-success)' }}>✓ 역경 극복 (+1)</button>
                                <button className="btn-medieval" onClick={() => applyPassionResolution('fail')} disabled={passionActionApplied} style={{ fontSize: '0.75rem', padding: '4px 8px', color: 'var(--color-crimson)', borderColor: 'var(--color-crimson)' }}>☠️ 낙담 침전 (-1 &amp; 우울)</button>
                              </>
                            )}
                            {passionRollResult.state === 'madness' && (
                              <button className="btn-medieval" onClick={() => applyPassionResolution('madness')} disabled={passionActionApplied} style={{ fontSize: '0.75rem', padding: '4px 8px', color: 'var(--color-crimson)', borderColor: 'var(--color-crimson)', width: '100%', justifyContent: 'center' }}>💀 광기 돌입 적용 (-1)</button>
                            )}
                          </div>
                          {passionActionApplied && <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', display: 'block', marginTop: '8px', fontWeight: 'bold' }}>✓ 캐릭터 데이터 시트에 성공적으로 동적 반영되었습니다!</span>}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="cs-row">
            {/* 3. Conflicting Emotions */}
            <section className="cs-section" style={{ flex: '1 1 300px' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-royal-blue)' }}>
                <h3>⚖️ 감정 대립 대결기</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: 0 }}>두 감정이 대치할 때의 본능을 대결합니다.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <div className="cs-field" style={{ flex: '1 1 130px', margin: 0, minWidth: '130px' }}>
                      <span className="cs-field-label" style={{ whiteSpace: 'nowrap' }}>감정 A:</span>
                      <select value={emotionA.key} onChange={e => { const k = e.target.value; setEmotionA({ type: 'trait', key: k, label: traitPairs.find(p => p.left === k || p.right === k)?.leftKo.split(' ')[0] || k, value: getTraitValue(k) }); setEmotionRollResult(null); }} style={{ width: '100%', flexGrow: 1 }}>
                        {traitPairs.map(p => {
                          const name = p.leftKo.split(' ')[0];
                          const val = getTraitValue(p.left);
                          return <option key={p.left} value={p.left}>{`${name} (${val})`}</option>;
                        })}
                      </select>
                    </div>
                    <div className="cs-field" style={{ flex: '1 1 130px', margin: 0, minWidth: '130px' }}>
                      <span className="cs-field-label" style={{ whiteSpace: 'nowrap' }}>감정 B:</span>
                      <select value={emotionB.key} onChange={e => { const k = e.target.value; setEmotionB({ type: 'trait', key: k, label: traitPairs.find(p => p.left === k || p.right === k)?.leftKo.split(' ')[0] || k, value: getTraitValue(k) }); setEmotionRollResult(null); }} style={{ width: '100%', flexGrow: 1 }}>
                        {traitPairs.map(p => {
                          const name = p.leftKo.split(' ')[0];
                          const val = getTraitValue(p.left);
                          return <option key={p.left} value={p.left}>{`${name} (${val})`}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                <button className="btn-medieval" onClick={executeEmotionRoll} style={{ justifyContent: 'center' }} disabled={isRollingEmotions}>
                  {isRollingEmotions ? '갈등 격돌 중...' : '⚖️ 갈등 굴림 실행'}
                </button>
                {emotionRollResult && (
                  <div style={{ border: '1px solid var(--color-gold)', padding: '12px', background: 'rgba(0,0,0,0.01)', marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-grey)' }}>{emotionA.label}</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-royal-blue)', textAlign: 'center' }}>{emotionRollResult.rollA}</div>
                      </div>
                      <div style={{ fontWeight: 'bold' }}>vs</div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-grey)' }}>{emotionB.label}</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-crimson)', textAlign: 'center' }}>{emotionRollResult.rollB}</div>
                      </div>
                    </div>
                    {!emotionRollResult.isRolling && <div style={{ textAlign: 'center', borderTop: '1px dashed var(--color-grey-light)', paddingTop: '8px', color: emotionRollResult.color, fontWeight: 'bold', fontSize: '0.85rem' }}>{emotionRollResult.textResult}</div>}
                  </div>
                )}
              </div>
            </section>

            {/* 4. Group Inspiration */}
            <section className="cs-section" style={{ flex: '1 1 300px' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-gold-dark)' }}>
                <h3>📢 기사단 그룹 영감 고취</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: 0 }}>단 한 번의 연설로 동료 기사단 전체 사기를 일괄 고취시킵니다.</p>
                <div className="cs-field">
                  <span className="cs-field-label">대의/열망 이름:</span>
                  <input type="text" value={groupPassionName} onChange={e => { setGroupPassionName(e.target.value); setGroupRollResult(null); }} style={{ width: '100%' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '6px', background: 'rgba(0,0,0,0.01)', border: '1px solid var(--color-grey-light)' }}>
                  {groupKnights.map((k, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: 'bold' }}>{k.name}</span>
                      <input type="number" value={k.passionScore} onChange={e => { const val = parseInt(e.target.value) || 10; setGroupKnights(prev => prev.map((item, i) => i === idx ? { ...item, passionScore: val } : item)); setGroupRollResult(null); }} style={{ width: '55px', textAlign: 'center' }} />
                    </div>
                  ))}
                </div>
                <button className="btn-medieval" onClick={executeGroupRoll} style={{ justifyContent: 'center' }} disabled={isRollingGroup}>📢 군대 연설 굴리기</button>
                {groupRollResult && (
                  <div style={{ border: '1px solid var(--color-gold)', padding: '12px', background: 'rgba(0,0,0,0.01)', marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-grey)' }}>굴림 눈:</span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-crimson)' }}>{groupRollResult.roll}</span>
                    </div>
                    {!groupRollResult.isRolling && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {groupRollResult.details.map((k, idx) => (
                          <div key={idx} style={{ fontSize: '0.75rem', borderBottom: '1px dashed var(--color-grey-light)', paddingBottom: '2px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{k.name}</span>
                            <span style={{ fontWeight: 'bold', color: k.result.includes('성공') ? 'var(--color-success)' : 'var(--color-crimson)' }}>{k.result}</span>
                          </div>
                        ))}
                        <div style={{ marginTop: '8px', borderTop: '1px solid var(--color-gold-light)', paddingTop: '6px', textAlign: 'center' }}>
                          <h4 style={{ color: groupRollResult.color, fontWeight: 'bold', fontSize: '0.88rem' }}>평균 결과: {groupRollResult.finalGroupOutcome}</h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-light)' }}>{groupRollResult.groupDesc}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* 5. Introspection Roller */}
            <section className="cs-section" style={{ flex: '1 1 300px' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-royal-blue)' }}>
                <h3>🌌 사랑의 몽상: 넋을 잃음 판정 (p.81)</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: 0 }}>그리워하는 대상의 넋을 잃음(Introspection) 여부를 판정합니다.</p>
                <div className="cs-field">
                  <span className="cs-field-label">그리움 대상 (Amor/Love):</span>
                  <select value={selectedAmorKey} onChange={e => { setSelectedAmorKey(e.target.value); setIntrospectionResult(null); }} style={{ width: '100%' }}>
                    {character?.passions && Object.keys(character.passions).map(key => (
                      <option key={key} value={key}>{passionNamesKo[key] || key}</option>
                    ))}
                  </select>
                </div>
                <button className="btn-medieval" onClick={executeIntrospectionRoll} style={{ justifyContent: 'center' }} disabled={isRollingIntro}>🌌 몽상 자극 굴리기</button>
                {introspectionResult && (
                  <div style={{ border: '1px solid var(--color-gold)', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)', marginBottom: '4px' }}>d20 굴림</span>
                    <D20Face value={introspectionResult.roll} isRolling={isRollingIntro} color={introspectionResult.color} />
                    {!introspectionResult.isRolling && (
                      <div style={{ marginTop: '8px', textAlign: 'center' }}>
                        <h4 style={{ color: introspectionResult.color, fontWeight: 'bold', fontSize: '0.88rem', marginBottom: '4px' }}>{introspectionResult.title}</h4>
                        <p style={{ fontSize: '0.76rem', color: 'var(--color-ink-light)', lineHeight: '1.4' }}>{introspectionResult.desc}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </>
      )}

      {/* ========================================================
          SUB-TAB 3: CHAPTER 4 & 5 REPUTATION GLORY & MELEE TACTICS
          ======================================================== */}
      {activeSubTab === 'reputation' && (
        <>
          {/* Section 1: Glory & Standing calculators */}
          <div className="cs-row">
            
            {/* 1. 명예(Glory) 계산기 */}
            <section className="cs-section" style={{ flex: '1 1 450px' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-gold-dark)' }}>
                <h3><Award size={16} style={{ marginRight: '6px' }} />기사의 명예(Glory) 계산기</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: 0 }}>
                  TRPG 시나리오 중 거둔 기사로서의 전투 위업(Table 4-4)을 정밀 계산하여 기사 명성도에 가중합니다.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="cs-field">
                    <span className="cs-field-label">물리친 적 유형 (Table 4-4):</span>
                    <select 
                      value={selectedOpponentType} 
                      onChange={e => {
                        setSelectedOpponentType(e.target.value);
                        setGloryActionApplied(false);
                      }}
                      style={{ width: '100%', padding: '6px' }}
                    >
                      {Object.keys(humanOpponents).map(key => (
                        <option key={key} value={key}>{humanOpponents[key].label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="cs-field">
                    <span className="cs-field-label">결투 형태:</span>
                    <select 
                      value={combatType} 
                      onChange={e => {
                        setCombatType(e.target.value);
                        setGloryActionApplied(false);
                      }}
                      style={{ width: '100%', padding: '6px' }}
                    >
                      <option value="mortal">생사 결투 (Mortal / For Life)</option>
                      <option value="love">시합 결투 (Joust / For Love - 1/10배)</option>
                    </select>
                  </div>
                </div>

                {/* Additional Glory modifiers checklist */}
                <div style={{ background: 'rgba(0,0,0,0.01)', border: '1px solid var(--color-grey-light)', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-gold-dark)' }}>추가 명예 획득 사유 (중복 선택 가능):</span>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={damage6d6} onChange={e => { setDamage6d6(e.target.checked); setGloryActionApplied(false); }} />
                      단일 피해 6d6 이상 (+10)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={halfGiant} onChange={e => { setHalfGiant(e.target.checked); setGloryActionApplied(false); }} />
                      상대가 거인/반거인 (+20)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={passionInspiration} onChange={e => { setPassionInspiration(e.target.checked); setGloryActionApplied(false); }} />
                      열정 영감 고취 상태 (+10)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={critPassionInspiration} onChange={e => { setCritPassionInspiration(e.target.checked); setGloryActionApplied(false); }} />
                      영감 대성공/성사 성공 (+20)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={critMiracle} onChange={e => { setCritMiracle(e.target.checked); setGloryActionApplied(false); }} />
                      종교적 성사 대성공 (+50)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={magicEquipment} onChange={e => { setMagicEquipment(e.target.checked); setGloryActionApplied(false); }} />
                      마법 말/갑옷/무기 소지 (+25)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={fantasticItem} onChange={e => { setFantasticItem(e.target.checked); setGloryActionApplied(false); }} />
                      환상종/전설적 아티팩트 소지 (+50)
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(179,143,67,0.04)', padding: '10px', border: '1px solid var(--color-gold)' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)' }}>계산된 총 획득 명예</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--color-gold-dark)' }}>
                      + {getCalculatedGlory()} <span style={{ fontSize: '0.9rem' }}>Glory</span>
                    </div>
                  </div>
                  <button 
                    className="btn-medieval btn-medieval-primary" 
                    onClick={applyGloryToSheet}
                    disabled={gloryActionApplied}
                    style={{ margin: 0, height: '42px' }}
                  >
                    {gloryActionApplied ? '시트 반영 완료 ✓' : '기사 시트에 명예 적용'}
                  </button>
                </div>

                {/* 1-2. 결혼 명예 계산기 (Marriage Glory) */}
                <div style={{ borderTop: '1px dashed var(--color-grey-light)', paddingTop: '12px', marginTop: '4px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-ink)', marginBottom: '8px' }}>
                    👰 영예로운 결혼 명예 (Marriage Glory)
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', alignItems: 'center' }}>
                    <div className="cs-field" style={{ margin: 0 }}>
                      <span className="cs-field-label">배우자 명예량:</span>
                      <input 
                        type="number" 
                        value={spouseGlory} 
                        onChange={e => { setSpouseGlory(parseInt(e.target.value) || 0); setMarriageGloryActionApplied(false); }} 
                        style={{ width: '100%', fontSize: '0.8rem' }}
                      />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', cursor: 'pointer', height: '36px', marginTop: '14px' }}>
                      <input 
                        type="checkbox" 
                        checked={spouseIsPagan} 
                        onChange={e => { setSpouseIsPagan(e.target.checked); setMarriageGloryActionApplied(false); }}
                      />
                      개종 이교도 배우자
                    </label>

                    {spouseIsPagan && (
                      <div className="cs-field" style={{ margin: 0 }}>
                        <span className="cs-field-label">배우자 존엄(Honor):</span>
                        <input 
                          type="number" 
                          value={spouseHonor} 
                          onChange={e => { setSpouseHonor(parseInt(e.target.value) || 0); setMarriageGloryActionApplied(false); }}
                          style={{ width: '100%', fontSize: '0.8rem' }}
                        />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.01)', padding: '8px', border: '1px solid var(--color-grey-light)', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.75rem' }}>
                      결혼 획득 명예: <strong style={{ color: 'var(--color-crimson)' }}>+{getCalculatedMarriageGlory()} Glory</strong> (최대 1,000 제한)
                    </span>
                    <button 
                      className="btn-medieval" 
                      onClick={applyMarriageGloryToSheet} 
                      disabled={marriageGloryActionApplied} 
                      style={{ padding: '3px 8px', fontSize: '0.75rem', height: '28px', margin: 0 }}
                    >
                      {marriageGloryActionApplied ? '적용 완료 ✓' : '결혼 명예 반영'}
                    </button>
                  </div>
                </div>

              </div>
            </section>

            {/* 2. 명망(Standing) 선물 & 청탁 판정기 */}
            <section className="cs-section" style={{ flex: '1 1 450px' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-royal-blue)' }}>
                <h3><Coins size={16} style={{ marginRight: '6px' }} />명망(Standing) 선물 &amp; 청탁기</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: 0 }}>
                  영주, 성직자, 길드에 헌납금(£)을 바쳐 호의를 얻거나, 판정을 통해 영주의 군사 지원 등의 도움(Favor)을 청탁합니다.
                </p>

                <div className="cs-field">
                  <span className="cs-field-label">상호작용할 명망 집단:</span>
                  <select 
                    value={selectedStandingKey} 
                    onChange={e => {
                      setSelectedStandingKey(e.target.value);
                      setGiftRollResult(null);
                      setStandingRollResult(null);
                      setStandingActionApplied(false);
                    }}
                    style={{ width: '100%', padding: '6px' }}
                  >
                    {Object.keys(standingNamesKo).map(key => (
                      <option key={key} value={key}>
                        {standingNamesKo[key]} (현재 수치: {getStandingValue(key)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gift Donation section */}
                <div style={{ background: 'rgba(0,0,0,0.01)', border: '1px solid var(--color-grey-light)', padding: '12px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-gold-dark)', display: 'block', marginBottom: '8px' }}>
                    💰 소지금을 바쳐 명망 상승 (일반 £10당 +1, 샤를마뉴 국왕 £100당 +1)
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '8px', alignItems: 'center' }}>
                    <div className="cs-field" style={{ margin: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px', padding: '0 8px' }}>
                      <span className="cs-field-label" style={{ whiteSpace: 'nowrap' }}>헌납 금액:</span>
                      <input 
                        type="number" 
                        value={giftAmount} 
                        min={1}
                        onChange={e => {
                          setGiftAmount(Math.max(1, parseInt(e.target.value) || 1));
                          setGiftRollResult(null);
                          setStandingActionApplied(false);
                        }}
                        style={{ width: '100%', fontWeight: 'bold' }}
                      />
                      <strong style={{ fontSize: '1rem' }}>£</strong>
                    </div>

                    <button 
                      className="btn-medieval btn-medieval-primary" 
                      onClick={handleGiftDonation}
                      disabled={standingActionApplied}
                      style={{ margin: 0, height: '36px', fontSize: '0.78rem', justifyContent: 'center' }}
                    >
                      {standingActionApplied ? '기부 반영됨' : '은화 기부 적용'}
                    </button>
                  </div>

                  {giftRollResult && (
                    <div style={{ marginTop: '8px', fontSize: '0.76rem', color: 'var(--color-success)', background: 'rgba(16, 185, 129, 0.04)', padding: '6px', borderLeft: '3px solid var(--color-success)' }}>
                      <strong>£{giftRollResult.amount} 기부 완료!</strong> 명망 수치가 <strong>+{giftRollResult.pointsEarned}</strong> 상승했습니다.<br />
                      {giftRollResult.rollText && <span style={{ fontSize: '0.7rem', color: 'var(--color-ink-light)' }}>{giftRollResult.rollText}</span>}
                    </div>
                  )}
                </div>

                {/* Standing roll request section */}
                <div style={{ borderTop: '1px dashed var(--color-grey-light)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-ink-light)', display: 'block', marginBottom: '8px' }}>
                    👑 해당 평판으로 집단에 도움 청탁 굴림 (Standing vs d20)
                  </span>

                  <button 
                    className="btn-medieval" 
                    onClick={executeStandingRoll}
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={isRollingStanding}
                  >
                    {isRollingStanding ? '알현 요청을 조율하는 중...' : '명망 호의 청탁 굴리기'}
                  </button>

                  {standingRollResult && (
                    <div style={{ border: `1px solid ${standingRollResult.color}`, padding: '12px', background: 'rgba(0,0,0,0.01)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '8px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)', marginBottom: '4px' }}>알현 주사위 굴림</span>
                      <D20Face value={standingRollResult.roll} isRolling={isRollingStanding} color={standingRollResult.color} />
                      
                      {!standingRollResult.isRolling && (
                        <div style={{ marginTop: '8px', textAlign: 'center' }}>
                          <h4 style={{ color: standingRollResult.color, fontWeight: 'bold', fontSize: '0.88rem', margin: '2px 0' }}>
                            {standingRollResult.outcome} (명망 평가: {standingRollResult.baseVal})
                          </h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-light)' }}>
                            {standingRollResult.desc}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </section>
          </div>
        </>
      )}

      {activeSubTab === 'combat_skills' && (
        <>
          {/* Section 2: Melee Clash Simulator (Chapter 5) */}
          <section className="cs-section" style={{ width: '100%' }}>
            <div className="sheet-ribbon" style={{ background: 'var(--color-crimson)' }}>
              <h3>⚔️ 전술적 무기 격돌 시뮬레이터 (Tactical Melee Clash Simulator)</h3>
            </div>
            <div className="cs-section-inner">
              <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-light)', marginBottom: '12px' }}>
                기사와 이교도/정적의 1대1 무기 대결을 무기별 고유 특성(검의 타이 브레이커, 보병 창의 돌격 무력화, 할버드 기마 대항, 대실패(Fumble) 파괴 등)을 적용해 opposed roll로 정밀 모사합니다.
              </p>

              {/* Selection board */}
              <div className="cs-row" style={{ gap: '16px', background: 'rgba(0,0,0,0.01)', padding: '12px', border: '1px solid var(--color-grey-light)' }}>
                
                {/* User side */}
                <div style={{ flex: '1 1 200px' }}>
                  <h4 style={{ color: 'var(--color-success)', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: '2px solid var(--color-success)', paddingBottom: '4px', marginBottom: '8px' }}>
                    🛡️ 성기사 (기사단 플레이어)
                  </h4>
                  
                  <div className="cs-field">
                    <span className="cs-field-label">선택한 주무기:</span>
                    <select value={playerWeapon} onChange={e => { setPlayerWeapon(e.target.value); setClashResult(null); }} style={{ width: '100%' }}>
                      {Object.keys(weaponProperties).map(key => (
                        <option key={key} value={key}>{weaponProperties[key].label}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div className="cs-field" style={{ margin: 0 }}>
                      <span className="cs-field-label">기본 숙련 Level:</span>
                      <input 
                        type="number" 
                        value={playerSkillOverride} 
                        onChange={e => { setPlayerSkillOverride(parseInt(e.target.value) || 1); setClashResult(null); }}
                        style={{ width: '100%' }}
                      />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', cursor: 'pointer', marginTop: '14px' }}>
                      <input type="checkbox" checked={playerMounted} onChange={e => { setPlayerMounted(e.target.checked); setClashResult(null); }} />
                      🐎 군마 기마 상태
                    </label>
                  </div>
                </div>

                {/* Special Clash options */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: '0 0 140px', gap: '6px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)', textAlign: 'center' }}>전투 세팅</span>
                  
                  {(playerMounted || opponentMounted) && (playerWeapon === 'lance' || opponentWeapon === 'lance') && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', cursor: 'pointer', background: 'rgba(0,0,0,0.02)', padding: '4px 8px', border: '1px solid var(--color-gold-light)' }}>
                      <input type="checkbox" checked={isCharging} onChange={e => { setIsCharging(e.target.checked); setClashResult(null); }} />
                      ⚡ 랜스 돌격차징
                    </label>
                  )}
                  
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-gold-dark)', margin: '8px 0' }}>VS</div>
                </div>

                {/* Opponent side */}
                <div style={{ flex: '1 1 200px' }}>
                  <h4 style={{ color: 'var(--color-crimson)', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: '2px solid var(--color-crimson)', paddingBottom: '4px', marginBottom: '8px' }}>
                    👿 이교도 적수 / 야만인 족장
                  </h4>
                  
                  <div className="cs-field">
                    <span className="cs-field-label">장착 무기:</span>
                    <select value={opponentWeapon} onChange={e => { setOpponentWeapon(e.target.value); setClashResult(null); }} style={{ width: '100%' }}>
                      {Object.keys(weaponProperties).map(key => (
                        <option key={key} value={key}>{weaponProperties[key].label}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div className="cs-field" style={{ margin: 0 }}>
                      <span className="cs-field-label">적 무기 숙련도:</span>
                      <input 
                        type="number" 
                        value={opponentSkill} 
                        onChange={e => { setOpponentSkill(parseInt(e.target.value) || 1); setClashResult(null); }}
                        style={{ width: '100%' }}
                      />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', cursor: 'pointer', marginTop: '14px' }}>
                      <input type="checkbox" checked={opponentMounted} onChange={e => { setOpponentMounted(e.target.checked); setClashResult(null); }} />
                      🐎 기마 기마 상태
                    </label>
                  </div>
                </div>

              </div>

              {/* Clash button */}
              <button 
                className="btn-medieval btn-medieval-primary" 
                onClick={executeClashMatch} 
                disabled={isRollingClash}
                style={{ width: '100%', justifyContent: 'center', height: '44px', marginTop: '12px', fontSize: '0.95rem' }}
              >
                {isRollingClash ? '무기와 갑옷이 격돌하는 비명 소리...' : '⚔️ 전투 무기 격돌 주사위 던지기!'}
              </button>

              {/* Clash Result panel */}
              {clashResult && (
                <div style={{ border: `2px solid ${clashResult.color}`, background: 'rgba(0,0,0,0.01)', padding: '16px', marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: '16px' }}>
                    
                    {/* Player rolled */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-success)' }}>기사 굴림 ({clashResult.pTarget} 이하)</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <span style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>{clashResult.rollP}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)' }}>({clashResult.pGrade})</span>
                      </div>
                      {clashResult.pModName && <span style={{ fontSize: '0.68rem', color: 'var(--color-success)', marginTop: '2px' }}>{clashResult.pModName}</span>}
                      {clashResult.pWeaponState !== 'Intact' && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-crimson)', background: 'rgba(239,68,68,0.05)', padding: '2px 6px', marginTop: '4px', border: '1px solid var(--color-crimson)' }}>
                          무기 상태: {clashResult.pWeaponState === 'Dropped' ? '⚠️ 놓침 (Dropped)' : '💥 완파 (Broken!)'}
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-gold-dark)' }}>vs</div>

                    {/* Opponent rolled */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-crimson)' }}>적군 굴림 ({clashResult.oTarget} 이하)</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <span style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>{clashResult.rollO}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)' }}>({clashResult.oGrade})</span>
                      </div>
                      {clashResult.oModName && <span style={{ fontSize: '0.68rem', color: 'var(--color-crimson)', marginTop: '2px' }}>{clashResult.oModName}</span>}
                      {clashResult.oWeaponState !== 'Intact' && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-crimson)', background: 'rgba(239,68,68,0.05)', padding: '2px 6px', marginTop: '4px', border: '1px solid var(--color-crimson)' }}>
                          무기 상태: {clashResult.oWeaponState === 'Dropped' ? '⚠️ 놓침 (Dropped)' : '💥 완파 (Broken!)'}
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Clash narration */}
                  {!clashResult.isRolling && (
                    <div style={{ borderTop: '1px solid var(--color-gold-light)', marginTop: '12px', paddingTop: '12px', textAlign: 'center' }}>
                      <h4 style={{ color: clashResult.color, fontWeight: 'bold', fontSize: '1.05rem', marginBottom: '6px' }}>
                        {clashResult.clashOutcome}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                        {clashResult.detailDesc}
                      </p>
                    </div>
                  )}

                </div>
              )}
            </div>
          </section>

          {/* Section 3: Skill Roller & Improvement (Chapter 5) */}
          <section className="cs-section" style={{ width: '100%', marginTop: '16px' }}>
            <div className="sheet-ribbon" style={{ background: 'var(--color-gold-dark)' }}>
              <h3>🔮 기사 스킬 판정 및 수련기</h3>
            </div>
            <div className="cs-section-inner">
              <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-light)', marginBottom: '12px' }}>
                기사의 일반 능력, 궁정 교양, 전투 무술 기술들을 굴려 성공 체크를 남기거나, 겨울 단계에서 훈련 d20 굴림(d20 &gt; 현재 레벨)을 통해 영구히 스킬 레벨을 단련합니다.
              </p>

              <div className="cs-row" style={{ gap: '16px' }}>
                
                {/* 3-1. 일반 기사 스킬 d20 판정기 */}
                <div style={{ flex: '1 1 300px', background: 'rgba(0,0,0,0.01)', padding: '12px', border: '1px solid var(--color-grey-light)' }}>
                  <h4 style={{ color: 'var(--color-royal-blue)', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: '2px solid var(--color-royal-blue)', paddingBottom: '4px', marginBottom: '8px' }}>
                    🎲 기사 기술 d20 판정 굴림
                  </h4>

                  <div className="cs-field">
                    <span className="cs-field-label" style={{ whiteSpace: 'nowrap' }}>판정할 기술:</span>
                    <select 
                      value={selectedSkillKey} 
                      onChange={e => {
                        setSelectedSkillKey(e.target.value);
                        setSkillRollResult(null);
                        setSkillCheckApplied(false);
                      }} 
                      style={{ width: '100%', padding: '6px' }}
                    >
                      {allSkills.map(s => (
                        <option key={s.key} value={s.key}>
                          {s.label} (현재 Level: {character?.skills?.[s.key] || 0})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="cs-field" style={{ marginTop: '8px' }}>
                    <span className="cs-field-label" style={{ whiteSpace: 'nowrap' }}>상황 보정치:</span>
                    <input 
                      type="number" 
                      value={skillMod} 
                      onChange={e => {
                        setSkillMod(parseInt(e.target.value) || 0);
                        setSkillRollResult(null);
                      }} 
                      style={{ width: '100px' }} 
                    />
                  </div>

                  <button 
                    className="btn-medieval" 
                    onClick={executeSkillRoll} 
                    style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
                    disabled={isRollingSkill}
                  >
                    {isRollingSkill ? '지혜와 완력을 조율하는 중...' : '🎲 기술 판정 굴리기'}
                  </button>

                  {skillRollResult && (
                    <div style={{ border: `1px solid ${skillRollResult.color}`, padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '8px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)', marginBottom: '4px' }}>d20 판정 결과</span>
                      <D20Face value={skillRollResult.roll} isRolling={isRollingSkill} color={skillRollResult.color} />
                      
                      {!skillRollResult.isRolling && (
                        <div style={{ marginTop: '8px', textAlign: 'center', width: '100%' }}>
                          <h4 style={{ color: skillRollResult.color, fontWeight: 'bold', fontSize: '0.88rem', margin: '2px 0' }}>
                            {skillRollResult.outcome} (목표: {skillRollResult.finalTarget} 이하)
                          </h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-light)', marginBottom: '8px' }}>
                            {skillRollResult.desc}
                          </p>

                          {skillRollResult.isSuccess && (
                            <button 
                              className="btn-medieval" 
                              onClick={applySkillCheckToSheet} 
                              disabled={skillCheckApplied || (character?.skillsChecked?.[selectedSkillKey] || false)} 
                              style={{ width: '100%', padding: '4px 8px', fontSize: '0.75rem', color: 'var(--color-success)', borderColor: 'var(--color-success)', justifyContent: 'center' }}
                            >
                              {skillCheckApplied || (character?.skillsChecked?.[selectedSkillKey] || false) 
                                ? '✓ 시트 경험치 마킹 완료' 
                                : '📈 기사 시트에 경험치(✓) 기록하기'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3-2. 겨울 단계 스킬 성장 수련기 */}
                <div style={{ flex: '1 1 300px', background: 'rgba(0,0,0,0.01)', padding: '12px', border: '1px solid var(--color-grey-light)' }}>
                  <h4 style={{ color: 'var(--color-gold-dark)', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: '2px solid var(--color-gold-dark)', paddingBottom: '4px', marginBottom: '8px' }}>
                    📈 겨울철 스킬 수련 훈련 (Skill Improvement)
                  </h4>

                  <div className="cs-field">
                    <span className="cs-field-label" style={{ whiteSpace: 'nowrap' }}>수련할 기술:</span>
                    <select 
                      value={selectedImproveKey} 
                      onChange={e => {
                        setSelectedImproveKey(e.target.value);
                        setImproveRollResult(null);
                        setImproveApplied(false);
                      }} 
                      style={{ width: '100%', padding: '6px' }}
                    >
                      {allSkills.map(s => {
                        const isChecked = character?.skillsChecked?.[s.key] || false;
                        return (
                          <option key={s.key} value={s.key}>
                            {s.label} ({isChecked ? '✓ 경험 축적됨' : '❌ 무체크 상태'}) [Lv. {character?.skills?.[s.key] || 0}]
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <p style={{ fontSize: '0.74rem', color: 'var(--color-grey)', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                    * 수련 룰: d20 굴림이 <strong>현재 스킬 레벨을 초과</strong>하거나 <strong>20</strong>이 나오면 레벨이 +1 영구 상승합니다. (수련 완료 시 성공 여부와 상관없이 시트 체크는 소모 해제됩니다)
                  </p>

                  <button 
                    className="btn-medieval" 
                    onClick={executeImprovementRoll} 
                    style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
                    disabled={isRollingImprove}
                  >
                    {isRollingImprove ? '수련 성과를 점검하는 중...' : '📈 스킬 성장 수련 굴리기'}
                  </button>

                  {improveRollResult && (
                    <div style={{ border: `1px solid ${improveRollResult.color}`, padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '8px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)', marginBottom: '4px' }}>d20 수련 굴림 결과</span>
                      <D20Face value={improveRollResult.roll} isRolling={isRollingImprove} color={improveRollResult.color} />
                      
                      {!improveRollResult.isRolling && (
                        <div style={{ marginTop: '8px', textAlign: 'center', width: '100%' }}>
                          <h4 style={{ color: improveRollResult.color, fontWeight: 'bold', fontSize: '0.88rem', margin: '2px 0' }}>
                            {improveRollResult.outcome} (현재 레벨: {improveRollResult.skillVal})
                          </h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-light)', marginBottom: '8px' }}>
                            {improveRollResult.desc}
                          </p>

                          <button 
                            className="btn-medieval" 
                            onClick={applyImprovementToSheet} 
                            disabled={improveApplied} 
                            style={{ width: '100%', padding: '4px 8px', fontSize: '0.75rem', color: 'var(--color-gold-dark)', borderColor: 'var(--color-gold-dark)', justifyContent: 'center' }}
                          >
                            {improveApplied 
                              ? '✓ 시트 반영 및 체크 초기화 완료' 
                              : '📈 수련 성과 시트 데이터 연동 적용'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </section>

          {/* Section 4: 대규모 집단 전투 시뮬레이터 (Chapter 8) */}
          <section className="cs-section" style={{ width: '100%', marginTop: '16px' }}>
            <div className="sheet-ribbon" style={{ background: 'var(--color-crimson)' }}>
              <h3>⚔️ 대규모 집단 전투 및 전술 시뮬레이터 (Mass Combat &amp; Battle)</h3>
            </div>
            <div className="cs-section-inner">
              <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-light)', marginBottom: '12px' }}>
                제국의 거대한 군단들과 함께 전장에 나서는 집단 전투 상황(Mass Combat)을 모사합니다. 부대 전술 대결을 벌이고 전장 돌발 조우와 가신단의 운명을 결정하세요.
              </p>

              <div className="cs-row" style={{ gap: '16px' }}>
                
                {/* 4-1. 부대 전술 및 대지휘 대결 (Battle Tactics) */}
                <div style={{ flex: '1 1 300px', background: 'rgba(0,0,0,0.01)', padding: '12px', border: '1px solid var(--color-grey-light)' }}>
                  <h4 style={{ color: 'var(--color-royal-blue)', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: '2px solid var(--color-royal-blue)', paddingBottom: '4px', marginBottom: '8px' }}>
                    📊 부대 대열 전술 대결 (Tactics)
                  </h4>
                  
                  <div className="cs-field" style={{ marginBottom: '8px' }}>
                    <span className="cs-field-label">기사의 전술 (Battle) 스킬 레벨:</span>
                    <input 
                      type="number" 
                      value={playerBattleSkillOverride} 
                      onChange={e => { setPlayerBattleSkillOverride(parseInt(e.target.value) || 10); setBattleTacticsResult(null); }}
                    />
                  </div>

                  <div className="cs-field" style={{ marginBottom: '12px' }}>
                    <span className="cs-field-label">적장 지휘관의 전술 레벨:</span>
                    <input 
                      type="number" 
                      value={enemyCommanderSkill} 
                      onChange={e => { setEnemyCommanderSkill(parseInt(e.target.value) || 10); setBattleTacticsResult(null); }}
                    />
                  </div>

                  <button 
                    className="btn-medieval btn-medieval-primary" 
                    onClick={rollBattleTactics}
                    disabled={isRollingBattle}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {isRollingBattle ? '전술 수 읽는 중...' : '⚔️ 부대 전술 대결 주사위 굴리기 (Opposed)'}
                  </button>

                  {battleTacticsResult && (
                    <div style={{ marginTop: '12px', border: '1px solid ' + battleTacticsResult.color, padding: '10px', background: 'rgba(0,0,0,0.01)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>
                        <span>🛡️ 기사 롤: {battleTacticsResult.playerRoll} ({battleTacticsResult.playerOutcome})</span>
                        <span>😈 적장 롤: {battleTacticsResult.enemyRoll} ({battleTacticsResult.enemyOutcome})</span>
                      </div>
                      <h4 style={{ color: battleTacticsResult.color, fontWeight: 'bold', fontSize: '0.86rem', textAlign: 'center', marginTop: '6px', borderTop: '1px dashed ' + battleTacticsResult.color, paddingTop: '6px' }}>
                        {battleTacticsResult.advantage}
                      </h4>
                    </div>
                  )}
                </div>

                {/* 4-2. 전장 돌발 조우 및 추종자 운명 (Melee Events) */}
                <div style={{ flex: '1 1 300px', background: 'rgba(0,0,0,0.01)', padding: '12px', border: '1px solid var(--color-grey-light)' }}>
                  <h4 style={{ color: 'var(--color-royal-blue)', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: '2px solid var(--color-royal-blue)', paddingBottom: '4px', marginBottom: '8px' }}>
                    🚩 전장 돌발 상황 &amp; 종자 운명
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                    <button 
                      className="btn-medieval" 
                      onClick={rollMeleeEvent}
                      disabled={isRollingMeleeEvent}
                      style={{ justifyContent: 'center', fontSize: '0.78rem', padding: '6px' }}
                    >
                      {isRollingMeleeEvent ? '조우 주입 중...' : '🎲 전장 상황 조우 (d20)'}
                    </button>

                    <button 
                      className="btn-medieval" 
                      onClick={rollFollowersFate}
                      disabled={isRollingFollowersFate}
                      style={{ justifyContent: 'center', fontSize: '0.78rem', padding: '6px' }}
                    >
                      {isRollingFollowersFate ? '운명 갈리는 중...' : '🐴 종자/군마 운명 (d20)'}
                    </button>
                  </div>

                  {/* Results scroll box */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {meleeEventResult && (
                      <div style={{ border: '1px solid var(--color-gold)', padding: '8px', background: '#faf6eb', borderRadius: '4px' }}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--color-crimson)', display: 'block', marginBottom: '2px' }}>
                          🚩 전장 조우 (d20: {meleeEventResult.roll}): {meleeEventResult.outcome}
                        </strong>
                        <p style={{ fontSize: '0.74rem', color: 'var(--color-ink-light)', margin: 0, lineHeight: '1.4' }}>
                          {meleeEventResult.desc}
                        </p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '0.72rem', color: 'var(--color-success)', fontWeight: 'bold' }}>
                          {meleeEventResult.gloryAward > 0 && <span>• 명예 +{meleeEventResult.gloryAward} Glory</span>}
                          {meleeEventResult.lootAward > 0 && <span>• 전리품 +£{meleeEventResult.lootAward}</span>}
                        </div>
                      </div>
                    )}

                    {followersFateResult && (
                      <div style={{ border: '1px solid var(--color-grey)', padding: '8px', background: '#f5ecd5', borderRadius: '4px' }}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--color-ink)', display: 'block', marginBottom: '2px' }}>
                          🐴 종자 및 가신단 운명 (d20: {followersFateResult.roll}): {followersFateResult.outcome}
                        </strong>
                        <p style={{ fontSize: '0.74rem', color: 'var(--color-ink-light)', margin: 0, lineHeight: '1.4' }}>
                          {followersFateResult.desc}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4-3. 전투 전획품 및 명예 정산 (Battle Rewards) */}
                <div style={{ flex: '1 1 200px', background: 'rgba(139, 105, 20, 0.03)', padding: '12px', border: '1.5px solid var(--color-gold)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ color: 'var(--color-gold-dark)', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: '2px solid var(--color-gold)', paddingBottom: '4px', marginBottom: '10px' }}>
                      🏆 전장 위업 정산 총계
                    </h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem', color: 'var(--color-ink)', margin: '8px 0' }}>
                      <div>누적 획득 명예: <strong style={{ color: 'var(--color-success)', fontSize: '1.05rem' }}>+{battleGloryTotal} Glory</strong></div>
                      <div>누적 소지금 변동: <strong style={{ color: battleLootTotal >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontSize: '1.05rem' }}>£{battleLootTotal >= 0 ? '+' : ''}{battleLootTotal}</strong></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                    <button 
                      className="btn-medieval btn-medieval-primary" 
                      onClick={applyBattleToSheet} 
                      disabled={battleApplied || (battleGloryTotal === 0 && battleLootTotal === 0)}
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
                    >
                      {battleApplied ? '✓ 시트 데이터 정산 완료' : '📈 전장 위업 시트 데이터 반영'}
                    </button>
                    
                    <button 
                      className="btn-medieval" 
                      onClick={resetBattleSimulator}
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.76rem', padding: '4px' }}
                    >
                      🔄 전장 초기화
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </>
      )}

      {/* ========================================================
          SUB-TAB 5: PRAYER, DIVINE MIRACLES, TRIALS & COURTSHIP
          ======================================================== */}
      {activeSubTab === 'miracles_amor' && (
        <>
          <div className="cs-row">
            {/* 1. 성스러운 기도와 기적 (Prayers & Miracles) */}
            <section className="cs-section" style={{ flex: '1 1 340px' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-royal-blue)' }}>
                <h3>✝️ 성스러운 기도와 신앙의 기적</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-grey)', margin: 0, lineHeight: 1.45 }}>
                  주님과 성 교회를 위해 간절히 무릎 꿇고 머리를 숙여, 전장의 불타는 시련을 극복하고 성스러운 가호와 징조를 요청합니다. (Religion 16 이상 기사는 +5 신앙의 가중치를 입습니다)
                </p>
                <div className="cs-field">
                  <span className="cs-field-label">기도의 세부 지향 (나만의 서사):</span>
                  <input 
                    type="text" 
                    value={prayerIntention} 
                    onChange={e => { setPrayerIntention(e.target.value); setPrayerResult(null); }}
                    placeholder="예: 가문의 가혹한 운명 극복과 전장 생존"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
                <div className="cs-field">
                  <span className="cs-field-label">기도의 환경적 보정:</span>
                  <select value={selectedPrayerModifier} onChange={e => { setSelectedPrayerModifier(parseInt(e.target.value)); setPrayerResult(null); }}>
                    <option value={0}>일반 야영지 기도 (보정 없음)</option>
                    <option value={2}>장엄한 대성당 십자가 앞 기도 (+2)</option>
                    <option value={5}>기적을 간직한 전설의 성유물 앞 기도 (+5)</option>
                    <option value={-3}>화살이 빗발치는 긴박한 전장 한가운데 (-3)</option>
                  </select>
                </div>
                <button className="btn-medieval btn-medieval-primary" onClick={rollPrayerAndMiracle} disabled={isRollingPrayer} style={{ width: '100%', justifyContent: 'center' }}>
                  {isRollingPrayer ? '성령의 계시를 기다리는 중...' : '🛐 성스러운 기도 굴리기 (d20)'}
                </button>
                {prayerResult && (
                  <div style={{ border: '1.5px solid ' + prayerResult.color, padding: '10px', background: 'rgba(0,0,0,0.01)', marginTop: '8px', borderRadius: '4px' }}>
                    <strong style={{ color: prayerResult.color, fontSize: '0.86rem', display: 'block', marginBottom: '4px' }}>
                      기도 결과 (d20: {prayerResult.roll}): {prayerResult.outcome}
                    </strong>
                    <p style={{ fontSize: '0.76rem', color: 'var(--color-ink-light)', margin: 0, lineHeight: 1.45 }}>
                      {prayerResult.desc}
                    </p>
                    {prayerResult.glory > 0 && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-success)', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>
                        • 획득한 신앙 영예: +{prayerResult.glory} Glory
                      </span>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* 2. 이교도 개종 판정기 (Pagan Conversion) */}
            <section className="cs-section" style={{ flex: '1 1 340px' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-gold-dark)' }}>
                <h3>⛪ 이교 장수 개종 및 귀순 판정기</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-grey)', margin: 0, lineHeight: 1.45 }}>
                  전장이나 사법 결투에서 사로잡거나 굴복시킨 작센/사라센 귀족 장수를 기독교의 십자가 아래 신실히 세례 받도록 설파합니다. (기준: 기사의 Religion 종교 스킬)
                </p>
                <div className="cs-field">
                  <span className="cs-field-label">개종시킬 적장 이름:</span>
                  <input 
                    type="text" 
                    value={paganCommanderName} 
                    onChange={e => { setPaganCommanderName(e.target.value); setConversionResult(null); }}
                    placeholder="예: 뷔두킨트 백작"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
                <button className="btn-medieval" onClick={rollPaganConversion} disabled={isRollingConversion} style={{ width: '100%', justifyContent: 'center' }}>
                  {isRollingConversion ? '참회와 교리를 해설하는 중...' : '✝️ 이교도 귀순/개종 판정 (d20 vs 종교 스킬)'}
                </button>
                {conversionResult && (
                  <div style={{ border: '1.5px solid var(--color-gold)', padding: '10px', background: '#faf6eb', marginTop: '8px', borderRadius: '4px' }}>
                    <strong style={{ color: 'var(--color-crimson)', fontSize: '0.86rem', display: 'block', marginBottom: '4px' }}>
                      설파 결과 (d20: {conversionResult.roll}): {conversionResult.outcome}
                    </strong>
                    <p style={{ fontSize: '0.76rem', color: 'var(--color-ink-light)', margin: 0, lineHeight: 1.45 }}>
                      {conversionResult.desc}
                    </p>
                    {conversionResult.glory !== 0 && (
                      <span style={{ fontSize: '0.72rem', color: conversionResult.glory > 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>
                        • 명예 획득 변동: {conversionResult.glory > 0 ? '+' : ''}{conversionResult.glory} Glory
                      </span>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="cs-row" style={{ marginTop: '16px' }}>
            {/* 3. 사법 시련 및 결투 재판 (Judicial Ordeals & Combat Trials) */}
            <section className="cs-section" style={{ flex: '1 1 340px' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-royal-blue)' }}>
                <h3>⚖️ 사법 결투 및 신명 시련 시뮬레이터</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-grey)', margin: 0, lineHeight: 1.45 }}>
                  주군 혹은 시기심 가득한 경쟁 가문의 부당한 고소에 직면하여, 고대 전례에 따른 신들의 심판(사법 결투, 달군 철판, 끓는 성수 시련)을 열어 기사의 완전 무죄와 가문 무고를 입증합니다.
                </p>
                <div className="cs-field">
                  <span className="cs-field-label">피소 및 고소당한 혐의 사건명:</span>
                  <input 
                    type="text" 
                    value={trialAccusation} 
                    onChange={e => { setTrialAccusation(e.target.value); setTrialResult(null); }}
                    placeholder="예: 사라센 첩자와 내통했다는 간신들의 모략"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
                <div className="cs-field">
                  <span className="cs-field-label">사법 입증 시험 방식:</span>
                  <select value={selectedTrialType} onChange={e => { setSelectedTrialType(e.target.value); setTrialResult(null); }}>
                    <option value="combat">사법 기사 결투 (d20 vs 기사의 검술 스킬)</option>
                    <option value="ordeal_iron">뜨거운 달군 철판 시련 (d20 vs 기사의 체력 속성)</option>
                    <option value="ordeal_water">끓는 가마솥 성수 시련 (d20 vs 기사의 체력 속성)</option>
                  </select>
                </div>
                <button className="btn-medieval" onClick={rollJudicialTrial} disabled={isRollingTrial} style={{ width: '100%', justifyContent: 'center' }}>
                  {isRollingTrial ? '주님의 거룩한 재판이 열리는 중...' : '⚖️ 결백 입증 신명 시련 개시'}
                </button>
                {trialResult && (
                  <div style={{ border: '1.5px solid var(--color-grey)', padding: '10px', background: '#faf6eb', marginTop: '8px', borderRadius: '4px' }}>
                    <strong style={{ color: 'var(--color-ink)', fontSize: '0.86rem', display: 'block', marginBottom: '4px' }}>
                      재판 결과 (d20: {trialResult.roll}): {trialResult.outcome}
                    </strong>
                    <p style={{ fontSize: '0.76rem', color: 'var(--color-ink-light)', margin: 0, lineHeight: 1.45 }}>
                      {trialResult.desc}
                    </p>
                    {trialResult.glory !== 0 && (
                      <span style={{ fontSize: '0.72rem', color: trialResult.glory > 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>
                        • 정산 영예 변동: {trialResult.glory > 0 ? '+' : ''}{trialResult.glory} Glory
                      </span>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* 4. 궁정 연애 & 꿈과 예지 */}
            <section className="cs-section" style={{ flex: '1 1 340px' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-crimson)' }}>
                <h3>🌹 궁정 고결한 연애 &amp; 밤의 신성한 예지</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Courtship */}
                <div>
                  <strong style={{ fontSize: '0.82rem', color: 'var(--color-gold-dark)', display: 'block', marginBottom: '4px' }}>궁정 연애 및 숙녀 구애 (Amor &amp; Romance)</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-grey)', margin: '0 0 8px 0', lineHeight: 1.35 }}>
                    고귀한 혈통의 숙녀에게 Chanson(서정시)을 바치고 넋을 잃는 사랑의 포로가 되거나 헌신적인 사랑을 고백합니다.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '6px', marginBottom: '6px' }}>
                    <div className="cs-field" style={{ margin: 0 }}>
                      <span className="cs-field-label" style={{ fontSize: '0.74rem' }}>대상 숙녀 성함:</span>
                      <input 
                        type="text" 
                        value={targetLadyName} 
                        onChange={e => { setTargetLadyName(e.target.value); setCourtshipResult(null); }}
                        style={{ padding: '4px', minHeight: '30px', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div className="cs-field" style={{ margin: 0 }}>
                      <span className="cs-field-label" style={{ fontSize: '0.74rem' }}>숙녀의 자태(수치):</span>
                      <input 
                        type="number" 
                        value={ladyLoveStat} 
                        onChange={e => { setLadyLoveStat(parseInt(e.target.value) || 12); setCourtshipResult(null); }}
                        style={{ padding: '4px', minHeight: '30px', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>
                  <div className="cs-field" style={{ marginBottom: '8px' }}>
                    <span className="cs-field-label" style={{ fontSize: '0.74rem' }}>바치는 시와 고결한 예물:</span>
                    <input 
                      type="text" 
                      value={courtshipGift} 
                      onChange={e => { setCourtshipGift(e.target.value); setCourtshipResult(null); }}
                      placeholder="예: 붉은 리본 백합화와 헌신적인 사랑의 Chanson"
                      style={{ padding: '4px', minHeight: '30px', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div className="cs-field" style={{ marginBottom: '8px' }}>
                    <span className="cs-field-label" style={{ fontSize: '0.74rem' }}>연애 구애의 형식:</span>
                    <select 
                      value={selectedLadyAmorType} 
                      onChange={e => { setSelectedLadyAmorType(e.target.value); setCourtshipResult(null); }}
                      style={{ padding: '4px', minHeight: '30px', fontSize: '0.8rem' }}
                    >
                      <option value="passive">넋을 잃음 (Amor 판정, 대상 자태 d20 이하 성공)</option>
                      <option value="active_romance">적극적 구애 수련 (Romance 판정, 기사 스킬 이하 성공)</option>
                    </select>
                  </div>
                  <button className="btn-medieval" onClick={rollLadyCourtship} disabled={isRollingCourtship} style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '6px' }}>
                    {isRollingCourtship ? 'Chansons를 읊으며 무릎 꿇는 중...' : '🌹 숙녀의 마음을 구하는 연애 주사위'}
                  </button>
                  {courtshipResult && (
                    <div style={{ border: '1px solid var(--color-gold)', padding: '8px', background: '#faf6eb', marginTop: '6px', fontSize: '0.74rem', borderRadius: '4px' }}>
                      <strong>d20: {courtshipResult.roll} - {courtshipResult.outcome}</strong>
                      <p style={{ margin: '2px 0 0 0', lineHeight: 1.35 }}>{courtshipResult.desc}</p>
                      {courtshipResult.amorIncrease > 0 && (
                        <span style={{ color: 'var(--color-crimson)', fontWeight: 'bold', display: 'block', marginTop: '2px' }}>
                          💘 숙녀에 대한 가문적 애정도(Amor)가 즉시 +{courtshipResult.amorIncrease} 증가했습니다!
                        </span>
                      )}
                      {courtshipResult.glory !== 0 && (
                        <span style={{ color: 'var(--color-success)', fontWeight: 'bold', display: 'block' }}>
                          • 기사 명예 변동: {courtshipResult.glory > 0 ? '+' : ''}{courtshipResult.glory} Glory
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Dreams & Omens */}
                <div style={{ borderTop: '1px dashed var(--color-grey-light)', paddingTop: '10px', marginTop: '4px' }}>
                  <strong style={{ fontSize: '0.82rem', color: 'var(--color-gold-dark)', display: 'block', marginBottom: '4px' }}>밤의 신성한 예지와 징조 (Dreams &amp; Omens)</strong>
                  <button className="btn-medieval" onClick={rollDreamsAndOmens} disabled={isRollingDream} style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '6px' }}>
                    {isRollingDream ? '밤하늘의 징조와 은하를 해석하는 중...' : '🌌 전야의 꿈과 신성한 예언 (d20)'}
                  </button>
                  {dreamResult && (
                    <div style={{ border: '1px solid var(--color-grey)', padding: '8px', background: '#f5ecd5', marginTop: '6px', fontSize: '0.74rem', borderRadius: '4px' }}>
                      <strong>예지 판정 (d20: {dreamResult.roll}) - {dreamResult.outcome}</strong>
                      <p style={{ margin: '2px 0 0 0', lineHeight: 1.35 }}>{dreamResult.desc}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* 누적 명예 정산 및 캐릭터 시트 연동 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(139,105,20,0.03)', padding: '14px', border: '1.5px solid var(--color-gold)', marginTop: '16px', borderRadius: '4px' }}>
            <div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-gold-dark)' }}>⛪ 성스러운 신앙 및 연애 모험 영예 정산</strong>
              <div style={{ fontSize: '0.84rem', marginTop: '4px' }}>누적 명예 획득: <strong style={{ color: 'var(--color-success)' }}>+{magicGloryTotal} Glory</strong></div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-medieval btn-medieval-primary" onClick={applyMagicToSheet} disabled={magicApplied || (magicGloryTotal === 0 && !(courtshipResult?.amorIncrease > 0))} style={{ fontSize: '0.82rem' }}>
                {magicApplied ? '✓ 시트 반영 완료' : '📈 영예 시트 데이터 반영'}
              </button>
              <button className="btn-medieval" onClick={resetMagicSimulator} style={{ fontSize: '0.78rem' }}>
                🔄 시뮬레이터 및 서사 로그 초기화
              </button>
            </div>
          </div>

          {/* 5. 나의 기사적 연대기 (My Knightly Chronicle - Dynamic narrative flow) */}
          <section className="cs-section" style={{ width: '100%', marginTop: '16px' }}>
            <div className="sheet-ribbon" style={{ background: 'var(--color-gold-dark)' }}>
              <h3>📜 나의 기사단 성스러운 모험 연대기 (My Knightly Chronicle)</h3>
            </div>
            <div className="cs-section-inner" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-grey)' }}>
                  기사의 모험 주사위 굴림을 통해 실시간으로 작성되는 서사적인 행적 연대기입니다.
                </span>
                {magicLogs.length > 0 && (
                  <button 
                    className="btn-medieval" 
                    style={{ fontSize: '0.76rem', padding: '4px 8px' }}
                    onClick={() => {
                      const text = magicLogs.map(log => `[${log.timestamp}] ${log.title}\n- 요약: ${log.detail}\n- 묘사: ${log.narrative}\n- 명예 변동: ${log.glory >= 0 ? '+' : ''}${log.glory} Glory\n`).join('\n');
                      navigator.clipboard.writeText(text);
                      alert('기사의 위대한 모험 서사가 클립보드에 통째로 복사되었습니다! 소설 집필이나 캠페인 세션 노트에 활용하세요.');
                    }}
                  >
                    📋 전체 서사 텍스트 복사
                  </button>
                )}
              </div>

              {magicLogs.length === 0 ? (
                <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--color-grey)', fontStyle: 'italic', fontSize: '0.86rem' }}>
                  "아직 성스럽고 고결한 가문의 역사적 기행이 개시되지 않았습니다.<br />
                  상단의 신앙 기도, 이교도 개종, 신명 시련, 혹은 숙녀에 대한 궁정 예법 구애를 거쳐 기사 가문의 위대한 서사를 직조해 나가십시오."
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                  {magicLogs.map((log) => (
                    <div 
                      key={log.id} 
                      style={{ 
                        borderLeft: `3px solid ${log.type === 'prayer' ? 'var(--color-royal-blue)' : log.type === 'conversion' ? 'var(--color-gold)' : log.type === 'trial' ? 'var(--color-grey)' : 'var(--color-crimson)'}`, 
                        padding: '10px 14px', 
                        background: '#faf6eb', 
                        borderRadius: '0 4px 4px 0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.86rem', color: 'var(--color-ink)' }}>{log.title}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)' }}>{log.timestamp}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-gold-dark)', fontWeight: 'bold', marginBottom: '4px' }}>
                        {log.detail}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: '0 0 6px 0', lineHeight: 1.45, fontStyle: 'italic' }}>
                        "{log.narrative}"
                      </p>
                      {log.glory !== 0 && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.74rem', color: log.glory > 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 'bold' }}>
                          {log.glory > 0 ? '영예 획득' : '명예 실추'}: {log.glory > 0 ? '+' : ''}{log.glory} Glory
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* ========================================================
          SUB-TAB 6: WEALTH, LIVING STANDARDS, SHOP & LOOT APPRAISAL (Chapter 12)
          ======================================================== */}
      {activeSubTab === 'wealth_armory' && (
        <>
          {/* Header Status Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(139,105,20,0.03)', padding: '14px', border: '1.5px solid var(--color-gold)', borderRadius: '4px', marginBottom: '16px' }}>
            <div>
              <strong style={{ fontSize: '0.94rem', color: 'var(--color-gold-dark)' }}>💼 기사의 현재 영지 재정 및 소지금 현황</strong>
              <div style={{ fontSize: '0.84rem', marginTop: '4px' }}>
                기사의 금고 소지금: <strong style={{ color: 'var(--color-success)', fontSize: '1.05rem' }}>£{character?.gear?.cash || 0}</strong>
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-grey)', textAlign: 'right' }}>
              📖 <strong>룰북 챕터 12 (Wealth &amp; Treasure)</strong>: 기사의 생활 수준(Ordinary £6/년)을 유지하고<br />
              소유 장원의 이득을 소모하여 새로운 군마와 무구를 충당하거나 전리품 보물을 시장에 처분합니다.
            </div>
          </div>

          <div className="cs-row">
            {/* 1. 생활 수준 설정 및 유지비 납부 (Living Standards) */}
            <section className="cs-section" style={{ flex: '1 1 340px' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-royal-blue)' }}>
                <h3>💼 품격 있는 생활 수준 (Living Standard) 설정</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-grey)', margin: 0, lineHeight: 1.45 }}>
                  기사의 매년 생활 수준은 신체 건강, 종자 육성, 사회적 명예(Glory) 및 겨울철 회복 판정에 직접적인 가중치/패널티를 부여합니다.
                </p>
                
                <div className="cs-field">
                  <span className="cs-field-label">생활 수준 선택 (Table 12-1):</span>
                  <select 
                    value={selectedLivingStandard} 
                    onChange={e => setSelectedLivingStandard(e.target.value)}
                    style={{ fontSize: '0.82rem' }}
                  >
                    <option value="rich">풍족함 (Rich - £12/년) &bull; 연간 Glory +10, 치료 판정 +1 보정</option>
                    <option value="ordinary">보통 (Ordinary - £6/년) &bull; 기본 생활 (보정 없음)</option>
                    <option value="poor">빈곤함 (Poor - £3/년) &bull; 연간 Glory -10, 종자 사망 판정 -2 불이익</option>
                    <option value="miserly">인색함 (Miserly - £1.5/년) &bull; 연간 Glory -20, 치료 판정 -2 불이익</option>
                  </select>
                </div>

                <div style={{ padding: '10px', background: 'rgba(0,0,0,0.01)', border: '1px dashed var(--color-grey-light)', fontSize: '0.78rem', lineHeight: 1.4 }}>
                  <strong>선택된 생활 수준 효과:</strong>
                  {selectedLivingStandard === 'rich' && <div style={{ color: 'var(--color-success)', marginTop: '4px' }}>✨ [풍족한 삶]: 매년 겨울 정산 시 **영예 +10 Glory** 자동 획득 및 부상 치료 판정에 **+1 절대 유리함**을 얻습니다.</div>}
                  {selectedLivingStandard === 'ordinary' && <div style={{ color: 'var(--color-ink-light)', marginTop: '4px' }}>🛡️ [보통의 삶]: 기사의 품위를 해치지 않는 일반적인 상태로 특별한 패널티나 버프가 없습니다.</div>}
                  {selectedLivingStandard === 'poor' && <div style={{ color: 'var(--color-danger)', marginTop: '4px' }}>⚠️ [빈곤한 삶]: 매년 겨울 정산 시 **영예 -10 Glory**를 잃으며, 겨울 혹한기 종자 생존 판정에 **-2 치명적인 감점**이 주어집니다.</div>}
                  {selectedLivingStandard === 'miserly' && <div style={{ color: 'var(--color-danger)', marginTop: '4px' }}>🚨 [인색한 삶]: 매년 겨울 정산 시 **영예 -20 Glory**를 잃고, 치료 판정에 **-2 불이익**을 얻으며 가신들이 파업 위기에 처합니다.</div>}
                </div>

                <button 
                  className="btn-medieval btn-medieval-primary" 
                  onClick={payMaintenance}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
                >
                  💼 선택한 생활 수준 유지비 지불하기
                </button>
              </div>
            </section>

            {/* 2. 전리품 및 보화 감정기 (Loot Appraisal) */}
            <section className="cs-section" style={{ flex: '1 1 340px' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-gold-dark)' }}>
                <h3>💎 전획 보화 및 전리품 시장 처분 (Loot Appraisal)</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-grey)', margin: 0, lineHeight: 1.45 }}>
                  모험 도중이나 시나리오 클리어 후 획득한 이교도의 정밀 약탈물이나 가문의 수습 골동품들을 시장에서 정산하여 돈으로 즉시 치환합니다 (Table 12-4).
                </p>

                <button 
                  className="btn-medieval" 
                  onClick={rollAppraiseLoot} 
                  disabled={isAppraising} 
                  style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                >
                  {isAppraising ? '보물의 금 함량과 가치를 저울질하는 중...' : '💎 미확인 보물 감정 굴리기 (d20)'}
                </button>

                {appraisedTreasure && (
                  <div style={{ border: '1.5px solid var(--color-gold)', padding: '10px', background: '#faf6eb', marginTop: '8px', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--color-crimson)', marginBottom: '4px' }}>
                      <span>💎 감정 결과 (d20: {appraisedTreasure.roll}): {appraisedTreasure.name}</span>
                      <span>+£{appraisedTreasure.value}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-light)', margin: 0, lineHeight: 1.45, fontStyle: 'italic' }}>
                      "{appraisedTreasure.desc}"
                    </p>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-success)', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>
                      ✓ 감정 완료 즉시 £{appraisedTreasure.value}의 소지금이 기사 시트 금고에 가산 처리되었습니다!
                    </span>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="cs-row" style={{ marginTop: '16px' }}>
            {/* 3. 명마 무구 기사단 상점 (Equipping a Knight Store) */}
            <section className="cs-section" style={{ flex: '1 1 100%' }}>
              <div className="sheet-ribbon" style={{ background: 'var(--color-crimson)' }}>
                <h3>🛒 기사단 공식 명마 및 군마/무구 상점 (Table 12-2 &amp; 12-3)</h3>
              </div>
              <div className="cs-section-inner" style={{ padding: '16px' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-grey)', marginBottom: '14px' }}>
                  겨울철 생존 판정 실패나 전장의 혹독한 칼날에 무기와 말이 파괴되었다면, 장원의 소지금을 투자하여 즉시 최고급 명마와 갑옷을 재구입합니다. (구매 시 기사 시트의 전투마 정보가 즉각 자동 갱신됩니다)
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {/* Horses Section */}
                  <div style={{ border: '1px solid var(--color-grey-light)', padding: '12px', background: 'rgba(0,0,0,0.01)', borderRadius: '4px' }}>
                    <h4 style={{ color: 'var(--color-gold-dark)', fontWeight: 'bold', fontSize: '0.88rem', borderBottom: '2px solid var(--color-gold-light)', paddingBottom: '4px', marginBottom: '8px' }}>
                      🐴 군마 및 전투마/이동마 구매 (Table 12-2)
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* Charger */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '6px', background: '#fff', border: '1px solid #eee' }}>
                        <div>
                          <strong>전투 기동마 (Charger) &bull; £10</strong>
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-grey)' }}>최고급 군속마 (체력 HP: 24, 아머: 5, 피해: 3d6+3)</div>
                        </div>
                        <button className="btn-medieval" style={{ padding: '4px 8px', fontSize: '0.74rem' }} onClick={() => buyArmoryItem('전투 기동마 (Charger)', 10, 'horse', { hp: 24, armor: 5, damage: '3d6+3' })}>
                          구입 £10
                        </button>
                      </div>
                      {/* Palfrey */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '6px', background: '#fff', border: '1px solid #eee' }}>
                        <div>
                          <strong>우아한 승용마 (Palfrey) &bull; £5</strong>
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-grey)' }}>장거리 승마용 준마 (체력 HP: 16, 아머: 2, 피해: 1d6)</div>
                        </div>
                        <button className="btn-medieval" style={{ padding: '4px 8px', fontSize: '0.74rem' }} onClick={() => buyArmoryItem('우아한 승용마 (Palfrey)', 5, 'horse', { hp: 16, armor: 2, damage: '1d6' })}>
                          구입 £5
                        </button>
                      </div>
                      {/* Rouncy */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '6px', background: '#fff', border: '1px solid #eee' }}>
                        <div>
                          <strong>일반 기동마 (Rouncy) &bull; £2</strong>
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-grey)' }}>일반 승마 및 다목적마 (체력 HP: 12, 아머: 1, 피해: 1d6-1)</div>
                        </div>
                        <button className="btn-medieval" style={{ padding: '4px 8px', fontSize: '0.74rem' }} onClick={() => buyArmoryItem('일반 기동마 (Rouncy)', 2, 'horse', { hp: 12, armor: 1, damage: '1d6-1' })}>
                          구입 £2
                        </button>
                      </div>
                      {/* Pack horse */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '6px', background: '#fff', border: '1px solid #eee' }}>
                        <div>
                          <strong>종자용 짐말 (Pack Horse) &bull; £1</strong>
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-grey)' }}>물자 수송용 짐말 (체력 HP: 10, 아머: 0, 피해: 0)</div>
                        </div>
                        <button className="btn-medieval" style={{ padding: '4px 8px', fontSize: '0.74rem' }} onClick={() => buyArmoryItem('종자용 짐말 (Pack Horse)', 1, 'horse', { hp: 10, armor: 0, damage: '0' })}>
                          구입 £1
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Weapons & Armor Section */}
                  <div style={{ border: '1px solid var(--color-grey-light)', padding: '12px', background: 'rgba(0,0,0,0.01)', borderRadius: '4px' }}>
                    <h4 style={{ color: 'var(--color-gold-dark)', fontWeight: 'bold', fontSize: '0.88rem', borderBottom: '2px solid var(--color-gold-light)', paddingBottom: '4px', marginBottom: '8px' }}>
                      ⚔️ 신성 무구 및 명인 갑옷 단련 (Table 12-3)
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* Reinforced Mail */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '6px', background: '#fff', border: '1px solid #eee' }}>
                        <div>
                          <strong>강화형 명인 사슬갑옷 &bull; £10</strong>
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-grey)' }}>기사의 방어력 등급 대폭 상승 (소장용)</div>
                        </div>
                        <button className="btn-medieval" style={{ padding: '4px 8px', fontSize: '0.74rem' }} onClick={() => buyArmoryItem('강화형 명인 사슬갑옷', 10, 'armor', {})}>
                          구입 £10
                        </button>
                      </div>
                      {/* Standard Mail */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '6px', background: '#fff', border: '1px solid #eee' }}>
                        <div>
                          <strong>기사용 표준 사슬갑옷 &bull; £5</strong>
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-grey)' }}>기본 기사 임관용 표준 아머 복구</div>
                        </div>
                        <button className="btn-medieval" style={{ padding: '4px 8px', fontSize: '0.74rem' }} onClick={() => buyArmoryItem('기사용 표준 사슬갑옷', 5, 'armor', {})}>
                          구입 £5
                        </button>
                      </div>
                      {/* Two handed sword */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '6px', background: '#fff', border: '1px solid #eee' }}>
                        <div>
                          <strong>양손 대검 (Two-handed Sword) &bull; £3</strong>
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-grey)' }}>격돌 승리 시 +1d6 추가 타격 옵션</div>
                        </div>
                        <button className="btn-medieval" style={{ padding: '4px 8px', fontSize: '0.74rem' }} onClick={() => buyArmoryItem('양손 대검', 3, 'weapon', {})}>
                          구입 £3
                        </button>
                      </div>
                      {/* Great Knight Shield */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '6px', background: '#fff', border: '1px solid #eee' }}>
                        <div>
                          <strong>기사단 정예 대형방패 &bull; £1</strong>
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-grey)' }}>대실패(Fumble) 시 무기 파손을 엄격 방어하는 쉴드</div>
                        </div>
                        <button className="btn-medieval" style={{ padding: '4px 8px', fontSize: '0.74rem' }} onClick={() => buyArmoryItem('기사단 정예 대형방패', 1, 'shield', {})}>
                          구입 £1
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* 4. 나의 장원 재정 기행록 (My Armory Ledger) */}
          <section className="cs-section" style={{ width: '100%', marginTop: '16px' }}>
            <div className="sheet-ribbon" style={{ background: 'var(--color-gold-dark)' }}>
              <h3>📜 나의 기사단 장원 재정 및 소비 장부 (My Financial Ledger)</h3>
            </div>
            <div className="cs-section-inner" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-grey)' }}>
                  기사의 상점 구입, 생활 유지비, 그리고 보화 감정 정산 결과가 실시간 기록되는 장부입니다.
                </span>
                {armoryLogs.length > 0 && (
                  <button 
                    className="btn-medieval" 
                    style={{ fontSize: '0.76rem', padding: '4px 8px' }}
                    onClick={() => {
                      const text = armoryLogs.map(log => `[${log.timestamp}] ${log.title}\n- 내역: ${log.detail}\n- 경위: ${log.narrative}\n- 수지 변동: ${log.cost >= 0 ? '+' : ''}${log.cost} 파운드(£)\n`).join('\n');
                      navigator.clipboard.writeText(text);
                      alert('기사의 소중한 재정 장부가 통째로 클립보드에 복사되었습니다! 겨울 세션 일지 정리에 활용하세요.');
                    }}
                  >
                    📋 전체 재정 장부 복사
                  </button>
                )}
              </div>

              {armoryLogs.length === 0 ? (
                <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--color-grey)', fontStyle: 'italic', fontSize: '0.86rem' }}>
                  아직 올해 가문 장원에 어떠한 재정 지출이나 전리품 감정이 기록되지 않았습니다.
                  <br />
                  상단의 생활 수준 유지비를 결제하거나, 보물을 감정하고, 또는 군마를 구입하여 대서사를 채워가세요.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                  {armoryLogs.map((log) => (
                    <div 
                      key={log.id} 
                      style={{ 
                        borderLeft: `3px solid ${log.type === 'maintenance' ? 'var(--color-royal-blue)' : log.type === 'purchase' ? 'var(--color-crimson)' : 'var(--color-success)'}`, 
                        padding: '10px 14px', 
                        background: '#faf6eb', 
                        borderRadius: '0 4px 4px 0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.86rem', color: 'var(--color-ink)' }}>{log.title}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)' }}>{log.timestamp}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-gold-dark)', fontWeight: 'bold', marginBottom: '4px' }}>
                        {log.detail}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: '0 0 6px 0', lineHeight: 1.45, fontStyle: 'italic' }}>
                        "{log.narrative}"
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.74rem', color: log.cost >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 'bold' }}>
                        수지 변동: {log.cost >= 0 ? '+' : ''}£{log.cost}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

    </div>
  );
}

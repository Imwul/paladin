import { getAgingRollCount, getHarvestModifier, resolveHarvest } from './campaignRules.js';
import { applyCharacterDamage } from './combatRules.js';
import { resolveD20Roll, rollDice, rollDie } from './coreRules.js';
import { resolveAttributeLifecycle } from './lifecycleRules.js';
import { appendChronicleEvent, appendFamilyTimeline, postAnnualGlory, recordGloryAward, recordStandingChange } from './ledgerRules.js';
import { adjustOpposedTrait, RELIGIOUS_TRAITS } from './personalityRules.js';
import { resolveExperienceChecks, resolveTraitExperienceChecks } from './progressionRules.js';

export const WINTER_STEPS = [
  { id: 'soloScenario', number: 1, ruleId: 'WINTER-ORDER-001', sourcePage: 'Ch.10 p.173', label: '개인 모험', english: 'Solo Scenario', summary: '필요한 개인 모험을 먼저 마치거나 해당 없음으로 기록합니다.' },
  { id: 'aging', number: 2, ruleId: 'WINTER-AGING-001', sourcePage: 'Ch.10 pp.174-175', label: '노화', english: 'Aging', summary: '기사, 종자, 탈것의 나이를 올리고 30세 이상 노화를 판정합니다.' },
  { id: 'economy', number: 3, ruleId: 'WINTER-HARVEST-001 / WINTER-MAINT-001', sourcePage: 'Ch.10 pp.174-176', label: '경제 사정', english: 'Economic Circumstances', summary: '장원 총수입과 유지비를 분리해 순결과만 보물고에 반영합니다.' },
  { id: 'survival', number: 4, ruleId: 'WINTER-SURVIVAL-001 / WINTER-MOUNT-001', sourcePage: 'Ch.10 p.176', label: '생존', english: 'Survival', summary: '친족, 수행원, 자녀와 필요한 탈것을 각각 판정합니다.' },
  { id: 'personalEvent', number: 5, ruleId: 'WINTER-PERSONAL-001', sourcePage: 'Ch.10 pp.176-179', label: '개인 사건', english: 'Personal Event', summary: '개인 모험을 하지 않았다면 Table 10-9 사건을 처리합니다.' },
  { id: 'family', number: 6, ruleId: 'WINTER-MARRIAGE-001 / WINTER-CHILDBIRTH-001 / WINTER-FAMILY-001', sourcePage: 'Ch.10 pp.176-181', label: '가족', english: 'Family', summary: '혼인, 출산, 가족 사건과 대상 관계를 원문 순서로 기록합니다.' },
  { id: 'experience', number: 7, ruleId: 'CORE-XP-002', sourcePage: 'Ch.10 p.181', label: '경험', english: 'Experience', summary: '표시된 경험 체크와 20 이상 무료 체크를 한 번씩 판정합니다.' },
  { id: 'training', number: 8, ruleId: 'WINTER-TRAIN-001', sourcePage: 'Ch.10 pp.181-182', label: '훈련과 실습', english: 'Training and Practice', summary: '원문의 세 훈련 방식 중 하나만 선택합니다.' },
  { id: 'glory', number: 9, ruleId: 'WINTER-GLORY-001 / GLORY-PASSIVE-001', sourcePage: 'Ch.10 pp.181-182; Ch.4 p.90', label: '영광 계산', english: 'Compute Glory', summary: '플레이, 장원, 유지 수준, 이상과 저명한 수치의 연간 영광을 합산합니다.' },
  { id: 'gloryBonus', number: 10, ruleId: 'GLORY-BONUS-001', sourcePage: 'Ch.10 p.181; Ch.4 pp.90-91', label: '영광 보너스', english: 'Glory Bonus', summary: '새로 넘은 1,000점 경계마다 보너스를 즉시 소비합니다.' }
];

export const MAINTENANCE_GRADES = {
  impoverished: { label: '빈곤(Impoverished)', minimum: 0, maximum: 2, childbirth: 0, childSurvival: -2, horseSurvival: -5, annualGlory: 0 },
  poor: { label: '가난(Poor)', minimum: 3, maximum: 5, childbirth: 0, childSurvival: -1, horseSurvival: -2, annualGlory: 0 },
  ordinary: { label: '보통(Ordinary)', minimum: 6, maximum: 8, childbirth: 0, childSurvival: 0, horseSurvival: 0, annualGlory: 0 },
  rich: { label: '부유(Rich)', minimum: 9, maximum: 12, childbirth: 1, childSurvival: 1, horseSurvival: 0, annualGlory: 10 },
  superlative: { label: '최상(Superlative)', minimum: 13, maximum: Number.POSITIVE_INFINITY, childbirth: 2, childSurvival: 1, horseSurvival: 1, annualGlory: 15 }
};

export const FAMILY_RELATION_TABLE = [
  { min: 1, max: 2, key: 'grandparent', label: '조부모', keywords: ['조부', '조모', 'grandparent'] },
  { min: 3, max: 4, key: 'parent', label: '부모', keywords: ['부친', '모친', '아버지', '어머니', 'parent'] },
  { min: 5, max: 6, key: 'sibling', label: '형제자매', keywords: ['형', '동생', '누나', '언니', '오빠', '자매', 'sibling'] },
  { min: 7, max: 8, key: 'parentSibling', label: '부모의 형제자매', keywords: ['삼촌', '숙부', '백부', '고모', '이모', 'uncle', 'aunt'] },
  { min: 9, max: 12, key: 'cousin', label: '사촌', keywords: ['사촌', 'cousin'] },
  { min: 13, max: 16, key: 'distantCousin', label: '먼 사촌', keywords: ['먼 사촌', '육촌', '팔촌', 'distant'] },
  { min: 17, max: 19, key: 'inLawHalfKin', label: '인척 또는 이복 혈족', keywords: ['인척', '처남', '매부', '시동생', '이복', 'half', 'in-law'] },
  { min: 20, max: 20, key: 'nibling', label: '조카', keywords: ['조카', 'nephew', 'niece'] }
];

export const RANDOM_MARRIAGE_TABLE = [
  { min: 1, max: 5, rank: 'wealthy_commoner', label: '부유한 평민의 딸', dowry: '3d6+6', glory: 0, manors: 0 },
  { min: 6, max: 8, rank: 'esquire_daughter', label: '향사의 딸', dowry: '3', glory: 10, manors: 0 },
  { min: 9, max: 10, rank: 'household_knight_daughter', label: '가신 기사의 딸', dowry: '1d6', glory: 50, manors: 0 },
  { min: 11, max: 11, rank: 'rich_vassal_eldest', label: '부유한 봉신 기사의 장녀', dowry: '1d3+6', glory: 100, manors: 0 },
  { min: 12, max: 20, rank: 'vassal_knight_daughter', label: '봉신 기사의 딸', dowry: '1d6', glory: 100, manors: 0 },
  { min: 21, max: 25, rank: 'vassal_heiress', label: '봉신 기사의 상속녀', dowry: '1d6+10', glory: 100, manors: 1 },
  { min: 26, max: 27, rank: 'wealthy_vassal_heiress', label: '부유한 봉신 기사의 상속녀', dowry: '1d6', glory: 300, manors: 2 },
  { min: 28, max: Number.POSITIVE_INFINITY, rank: 'baron_younger_daughter', label: '남작의 차녀', dowry: '1d6+10', glory: 250, manors: 1 }
];

const rollDowry = (notation, rng) => {
  if (notation === '3') return 3;
  if (notation === '3d6+6') return rollDice(3, 6, rng) + 6;
  if (notation === '1d3+6') return rollDie(3, rng) + 6;
  if (notation === '1d6+10') return rollDie(6, rng) + 10;
  return rollDie(6, rng);
};

export const resolveRandomMarriage = ({ roll, waitingModifier = 0 }, rng = Math.random) => {
  const modifiedRoll = Number(roll) + Math.max(0, Number(waitingModifier || 0));
  const result = RANDOM_MARRIAGE_TABLE.find(entry => modifiedRoll >= entry.min && modifiedRoll <= entry.max);
  return { ...result, roll: Number(roll), waitingModifier: Math.max(0, Number(waitingModifier || 0)), modifiedRoll, dowryAmount: rollDowry(result.dowry, rng) };
};

export const resolveChildbirthRoll = ({ roll, modifier = 0, sexRolls = [] }, rng = Math.random) => {
  const adjustedRoll = Math.max(1, Math.min(20, Number(roll) + Number(modifier || 0)));
  const births = adjustedRoll === 20 ? 2 : adjustedRoll >= 12 ? 1 : 0;
  const childSexRolls = Array.from({ length: births }, (_, index) => Number(sexRolls[index] || rollDie(6, rng)));
  return {
    roll: Number(roll),
    modifier: Number(modifier || 0),
    adjustedRoll,
    motherDies: adjustedRoll === 11 || adjustedRoll === 12,
    childrenDie: adjustedRoll === 11,
    births,
    children: adjustedRoll === 11 ? [] : childSexRolls.map(sexRoll => ({ sexRoll, gender: sexRoll % 2 === 1 ? 'female' : 'male' }))
  };
};

const eventOutcome = (summary, data = {}) => ({
  summary,
  mandatoryEffect: data.mandatoryEffect || [],
  optionalChoice: data.optionalChoice || null,
  traitCheck: data.traitCheck || [],
  passionCheck: data.passionCheck || [],
  skillCheck: data.skillCheck || [],
  glory: data.glory || 0,
  standing: data.standing || [],
  familyEffect: data.familyEffect || null,
  lifecycleEffect: data.lifecycleEffect || null,
  unresolvedChoice: data.unresolvedChoice || null,
  journalPrompt: data.journalPrompt || summary
});

const row = (roll, trigger, checkGroup, checkKey, outcomes) => ({
  rollRange: [roll, roll],
  roll,
  trigger,
  checkGroup,
  checkKey,
  ruleId: 'WINTER-PERSONAL-001',
  sourcePage: roll <= 8 ? 'Ch.10 p.177' : roll <= 16 ? 'Ch.10 p.178' : 'Ch.10 p.179',
  outcomes
});

export const PERSONAL_EVENT_TABLE = {
  1: row(1, 'Chaste', 'traits', 'chaste', {
    critical: eventOutcome('유혹을 이겨 모범을 보였습니다.', { mandatoryEffect: [{ type: 'score', group: 'traits', key: 'chaste', amount: 1 }] }),
    success: eventOutcome('궁정의 유혹을 물리쳤습니다.', { traitCheck: ['chaste'] }),
    failure: eventOutcome('다음 해 태어날 사생아가 잉태되었습니다.', { familyEffect: 'unborn_bastard', unresolvedChoice: { type: 'bastard_parent', label: '모친의 계급과 나이를 원문 표로 결정' } }),
    fumble: eventOutcome('현장에서 발각되어 혼인, 배상, 명예 손실 중 하나를 택해야 합니다.', { optionalChoice: ['marry', 'compensation', 'lose_honor'], unresolvedChoice: { type: 'caught_in_affair', label: '혼인·배상·명예 -1 중 선택' } })
  }),
  2: row(2, 'Energetic', 'traits', 'energetic', {
    critical: eventOutcome('헌신적인 겨울 노동으로 추가 훈련점 2점을 얻었습니다.', { mandatoryEffect: [{ type: 'winterFlag', key: 'trainingBonusPoints', amount: 2 }] }),
    success: eventOutcome('성실한 겨울 노동으로 추가 훈련점 1점을 얻었습니다.', { mandatoryEffect: [{ type: 'winterFlag', key: 'trainingBonusPoints', amount: 1 }] }),
    failure: eventOutcome('잔치와 유흥으로 겨울을 보냈습니다.', { traitCheck: ['lazy'] }),
    fumble: eventOutcome('기본 의무까지 소홀히 하여 훈련 단계를 잃습니다.', { mandatoryEffect: [{ type: 'winterFlag', key: 'skipTraining', value: true }] })
  }),
  3: row(3, 'Forgiving', 'traits', 'forgiving', {
    critical: eventOutcome('가까운 이의 고백을 용서했습니다.', { mandatoryEffect: [{ type: 'score', group: 'traits', key: 'forgiving', amount: 1 }] }),
    success: eventOutcome('궁정의 모욕을 재치 있게 용서했습니다.', { traitCheck: ['forgiving'] }),
    failure: eventOutcome('결투를 요구했습니다.', { unresolvedChoice: { type: 'opposed_melee', label: '평범한 기사와 대립 무기 판정, 패배 시 Honor -1' } }),
    fumble: eventOutcome('상대를 즉시 공격해 가문 간 불화를 시작했습니다.', { familyEffect: 'start_feud' })
  }),
  4: row(4, 'Generous', 'traits', 'generous', {
    critical: eventOutcome('자선에 큰 재산을 기부했습니다.', { mandatoryEffect: [{ type: 'scaledCash', key: 'generous', divisor: 2, amount: -1 }, { type: 'score', group: 'traits', key: 'generous', amount: 1 }], optionalChoice: ['standing_except_charlemagne'], unresolvedChoice: { type: 'standing_choice', label: 'Charlemagne 외 지위 하나 +1' } }),
    success: eventOutcome('가난한 이에게 £1을 기부했습니다.', { mandatoryEffect: [{ type: 'cash', amount: -1 }], traitCheck: ['generous'] }),
    failure: eventOutcome('자신의 영광을 과하게 주장했습니다.', { traitCheck: ['selfish'] }),
    fumble: eventOutcome('부양자들에게 인색하여 수행단, 교회, 평민 지위가 하락했습니다.', { standing: [{ key: 'retinue', amount: -1 }, { key: 'church', amount: -1 }, { key: 'commoners', amount: -1 }] })
  }),
  5: row(5, 'Honest', 'traits', 'honest', {
    critical: eventOutcome('거짓 증언을 거부했습니다.', { mandatoryEffect: [{ type: 'score', group: 'traits', key: 'honest', amount: 1 }] }),
    success: eventOutcome('주군의 행동에 대한 의견을 공개적으로 지켰습니다.', { traitCheck: ['honest'] }),
    failure: eventOutcome('거짓말이 들통나 무작위 지위가 하락합니다.', { unresolvedChoice: { type: 'random_standing', label: '무작위 지위 -1' } }),
    fumble: eventOutcome('반복된 거짓말로 Honor가 하락했습니다.', { mandatoryEffect: [{ type: 'score', group: 'passions', key: 'honor', amount: -1 }] })
  }),
  6: row(6, 'Just', 'traits', 'just', {
    critical: eventOutcome('주교의 부당한 과세를 지적했습니다.', { mandatoryEffect: [{ type: 'score', group: 'traits', key: 'just', amount: 1 }] }),
    success: eventOutcome('법적 다툼에서 주군의 편의를 거절했습니다.', { traitCheck: ['just'] }),
    failure: eventOutcome('뇌물 £1을 얻었으나 평민 지위가 하락했습니다.', { mandatoryEffect: [{ type: 'cash', amount: 1 }], standing: [{ key: 'commoners', amount: -1 }] }),
    fumble: eventOutcome('부당한 판단으로 공개 질책을 받아 Honor가 하락했습니다.', { mandatoryEffect: [{ type: 'score', group: 'passions', key: 'honor', amount: -1 }] })
  }),
  7: row(7, 'Merciful', 'traits', 'merciful', {
    critical: eventOutcome('거짓 고발자를 용서했습니다.', { mandatoryEffect: [{ type: 'score', group: 'traits', key: 'merciful', amount: 1 }] }),
    success: eventOutcome('이웃과의 분쟁을 관대하게 합의했습니다.', { traitCheck: ['merciful'] }),
    failure: eventOutcome('한 사람의 죄를 가족 전체에 물었습니다.', { traitCheck: ['cruel'] }),
    fumble: eventOutcome('궁핍한 이의 청원을 외면해 교회와 평민 지위가 하락했습니다.', { standing: [{ key: 'church', amount: -1 }, { key: 'commoners', amount: -1 }] })
  }),
  8: row(8, 'Modest', 'traits', 'modest', {
    critical: eventOutcome('공을 가로챈 이를 오히려 축하했습니다.', { mandatoryEffect: [{ type: 'score', group: 'traits', key: 'modest', amount: 1 }] }),
    success: eventOutcome('동료에게 상석을 양보했습니다.', { traitCheck: ['modest'] }),
    failure: eventOutcome('음유시인에게 £1을 주어 다음 해 위업 영광을 두 배로 합니다.', { mandatoryEffect: [{ type: 'cash', amount: -1 }, { type: 'winterFlag', key: 'doubleDeedGloryNextYear', value: true }] }),
    fumble: eventOutcome('허풍으로 기사를 모욕해 배상금 £1을 냈습니다.', { mandatoryEffect: [{ type: 'cash', amount: -1 }] })
  }),
  9: row(9, 'Prudent', 'traits', 'prudent', {
    critical: eventOutcome('치밀한 준비로 식량 부족을 막았습니다.', { mandatoryEffect: [{ type: 'score', group: 'traits', key: 'prudent', amount: 1 }] }),
    success: eventOutcome('위험한 도약을 따르지 않아 말을 지켰습니다.', { traitCheck: ['prudent'] }),
    failure: eventOutcome('폭풍 속 외출로 노화 위험을 맞았으나 무모한 용기로 영광을 얻었습니다.', { traitCheck: ['reckless'], glory: 10, unresolvedChoice: { type: 'constitution_then_aging', label: 'CON 실패 시 Table 10-2 노화 1회' } }),
    fumble: eventOutcome('사고를 일으켜 무작위 지위가 하락합니다.', { unresolvedChoice: { type: 'random_standing_except_charlemagne', label: 'Charlemagne 외 무작위 지위 -1' } })
  }),
  10: row(10, 'Temperate', 'traits', 'temperate', {
    critical: eventOutcome('자발적 검소함으로 £1과 Temperate 1점을 얻었습니다.', { mandatoryEffect: [{ type: 'cash', amount: 1 }, { type: 'score', group: 'traits', key: 'temperate', amount: 1 }] }),
    success: eventOutcome('검소한 삶을 살았습니다.', { traitCheck: ['temperate'] }),
    failure: eventOutcome('사치품에 지출하여 유지 수준 한 단계 상승 비용을 부담해야 합니다.', { unresolvedChoice: { type: 'maintenance_upgrade', label: '유지 수준 한 단계 상승 비용 지불' } }),
    fumble: eventOutcome('퇴폐적 사치로 최소 Rich 유지 비용을 내되 생존 보너스는 얻지 못합니다.', { unresolvedChoice: { type: 'maintenance_rich_no_survival', label: 'Rich 이상 유지 비용, 생존 보너스 제외' } })
  }),
  11: row(11, 'Trusting', 'traits', 'trusting', {
    critical: eventOutcome('중대한 혐의에도 친구를 변호했습니다.', { mandatoryEffect: [{ type: 'score', group: 'traits', key: 'trusting', amount: 1 }] }),
    success: eventOutcome('평판 나쁜 경쟁자에게 사랑하는 이를 맡겼습니다.', { traitCheck: ['trusting'] }),
    failure: eventOutcome('궁정 사람을 고발해 주군의 Just/Arbitrary 판단이 필요합니다.', { unresolvedChoice: { type: 'lord_trait_roll', label: '주군의 Just/Arbitrary 판정에 따라 Standing [lord] ±1' } }),
    fumble: eventOutcome('무모한 고발로 주군의 지위가 하락했습니다.', { standing: [{ key: 'liegeLord', amount: -1 }] })
  }),
  12: row(12, 'Valorous', 'traits', 'valorous', {
    critical: eventOutcome('사냥 중 주군을 구해 Valorous와 영광을 얻었습니다.', { mandatoryEffect: [{ type: 'score', group: 'traits', key: 'valorous', amount: 1 }], glory: 50 }),
    success: eventOutcome('불길에서 주군의 수행원을 구했습니다.', { traitCheck: ['valorous'], glory: 10 }),
    failure: eventOutcome('야간 원정에서 꾀병을 부렸습니다.', { traitCheck: ['cowardly'] }),
    fumble: eventOutcome('늑대에게 달아나 Honor가 하락했습니다.', { mandatoryEffect: [{ type: 'score', group: 'passions', key: 'honor', amount: -1 }] })
  }),
  13: row(13, 'Love [Charlemagne]', 'passions', 'loveCharlemagne', {
    critical: eventOutcome('작은 기적으로 다음 모험에서 주사위 하나를 다시 굴릴 수 있습니다.', { mandatoryEffect: [{ type: 'winterFlag', key: 'nextAdventureRerolls', amount: 1 }] }),
    success: eventOutcome('왕을 찬양한 말이 전해졌습니다.', { passionCheck: ['loveCharlemagne'] }),
    failure: eventOutcome('왕을 모욕하는 농담을 웃어넘겼습니다.'),
    fumble: eventOutcome('왕의 위업을 의심해 Charlemagne 지위가 하락했습니다.', { standing: [{ key: 'charlemagne', amount: -1 }] })
  }),
  14: row(14, 'Honor', 'passions', 'honor', {
    critical: eventOutcome('미혼이면 두 장원과 £2d6의 신부를, 기혼이면 시대 최고의 말을 받습니다.', { passionCheck: ['honor'], unresolvedChoice: { type: 'honor_reward', label: '혼인 상태에 따라 신부 또는 최고급 말 적용' } }),
    success: eventOutcome('명예로운 행동이 찬양받았습니다.', { passionCheck: ['honor'], glory: 20 }),
    failure: eventOutcome('환대 위반을 수습하는 잔치에 £1을 썼습니다.', { mandatoryEffect: [{ type: 'cash', amount: -1 }] }),
    fumble: eventOutcome('불명예한 평판으로 무작위 지위가 2점 하락합니다.', { unresolvedChoice: { type: 'random_standing', label: '무작위 지위 -2', amount: -2 } })
  }),
  15: row(15, 'Love [family]', 'passions', 'loveFamily', {
    critical: eventOutcome('가문의 명예를 위한 결투에서 상처를 입고 여러 체크를 얻었습니다.', { mandatoryEffect: [{ type: 'wound', dice: [3, 6] }], traitCheck: ['valorous'], passionCheck: ['loveFamily'], standing: [{ key: 'family', check: true }] }),
    success: eventOutcome('고발된 가족의 보증인이 되었습니다.', { standing: [{ key: 'family', check: true }] }),
    failure: eventOutcome('가족을 공개 비난해 Love [family]가 1점 하락합니다.', { mandatoryEffect: [{ type: 'score', group: 'passions', key: 'loveFamily', amount: -1 }], unresolvedChoice: { type: 'family_member_target', label: 'Table 10-13 가족 대상 기록' } }),
    fumble: eventOutcome('곤경의 가족을 외면해 Love [family]가 2점 하락합니다.', { mandatoryEffect: [{ type: 'score', group: 'passions', key: 'loveFamily', amount: -2 }], unresolvedChoice: { type: 'family_member_target', label: 'Table 10-13 가족 대상 기록' } })
  }),
  16: row(16, 'Love [God]', 'passions', 'loveGod', {
    critical: eventOutcome('성지를 순례해 비용을 내고 신앙과 교회 지위를 얻지만 훈련을 잃습니다.', { mandatoryEffect: [{ type: 'cash', amount: -1 }, { type: 'score', group: 'passions', key: 'loveGod', amount: 1 }, { type: 'score', group: 'standings', key: 'church', amount: 1 }, { type: 'winterFlag', key: 'skipTraining', value: true }] }),
    success: eventOutcome('모범적 신앙이 설교에서 인용되었습니다.', { passionCheck: ['loveGod'] }),
    failure: eventOutcome('신성모독으로 교회 지위가 하락했습니다.', { standing: [{ key: 'church', amount: -1 }] }),
    fumble: eventOutcome('미사 불참으로 Love [God]가 하락했습니다.', { mandatoryEffect: [{ type: 'score', group: 'passions', key: 'loveGod', amount: -1 }] })
  }),
  17: row(17, 'Standing [lord]', 'standings', 'liegeLord', {
    critical: eventOutcome('주군이 장비와 말을 개선했습니다.', { unresolvedChoice: { type: 'equipment_upgrade', label: '현재 시대에 맞는 장비와 말 개선 기록' } }),
    success: eventOutcome('주군이 Frankish Birth Gift를 주었습니다.', { unresolvedChoice: { type: 'birth_gift', label: 'Table 1-15 출생 선물 판정' } }),
    failure: eventOutcome('전리품 요구 여부를 선택합니다.', { optionalChoice: ['claim_share', 'leave_share'], unresolvedChoice: { type: 'booty_choice', label: '£1과 Selfish 체크 또는 Proud 체크' } }),
    fumble: eventOutcome('주군의 불신에 도전으로 답하거나 Honor를 잃습니다.', { optionalChoice: ['accept_challenge', 'leave'], unresolvedChoice: { type: 'lord_accusation_choice', label: '도전과 Honor 체크 또는 Honor -1' } })
  }),
  18: row(18, 'Standing [Church]', 'standings', 'church', {
    critical: eventOutcome('주교의 공개 칭찬으로 영광과 Charlemagne 지위를 얻었습니다.', { glory: 25, standing: [{ key: 'charlemagne', amount: 1 }] }),
    success: eventOutcome('주교의 사냥에 초대되었습니다.', { skillCheck: ['hunting'] }),
    failure: eventOutcome('설교의 질책으로 평민 지위가 하락했습니다.', { standing: [{ key: 'commoners', amount: -1 }] }),
    fumble: eventOutcome('순례 명령을 받았습니다. 거부하면 교회 지위를 잃습니다.', { optionalChoice: ['pilgrimage', 'refuse'], unresolvedChoice: { type: 'pilgrimage_choice', label: '순례 수행 또는 Standing [Church] -1' } })
  }),
  19: row(19, 'Standing [commoners]', 'standings', 'commoners', {
    critical: eventOutcome('상인에게 courser를 받고 평민 지위를 얻었습니다.', { standing: [{ key: 'commoners', amount: 1 }], mandatoryEffect: [{ type: 'gearNote', key: 'personalGear', value: '상인이 준 courser' }] }),
    success: eventOutcome('주민의 잔치에서 Folk Lore와 평민 지위 체크를 얻었습니다.', { skillCheck: ['folkLore'], standing: [{ key: 'commoners', check: true }] }),
    failure: eventOutcome('여섯 Christian Trait 중 하나를 골라 판정해야 합니다.', { optionalChoice: RELIGIOUS_TRAITS, unresolvedChoice: { type: 'christian_trait_roll', label: '인쇄된 Religious Trait 선택 후 판정, 실패 시 반대 성향 체크' } }),
    fumble: eventOutcome('도적에게 습격당해 갑옷 없는 3d6 상처를 입었습니다.', { mandatoryEffect: [{ type: 'wound', dice: [3, 6] }], lifecycleEffect: 'wound' })
  }),
  20: row(20, 'Player choice', null, null, {
    critical: eventOutcome('플레이어가 Table 10-9의 사건을 선택합니다.', { optionalChoice: Array.from({ length: 19 }, (_, index) => index + 1), unresolvedChoice: { type: 'personal_event_choice', label: '1-19번 사건 중 하나 선택' } }),
    success: eventOutcome('플레이어가 Table 10-9의 사건을 선택합니다.', { optionalChoice: Array.from({ length: 19 }, (_, index) => index + 1), unresolvedChoice: { type: 'personal_event_choice', label: '1-19번 사건 중 하나 선택' } }),
    failure: eventOutcome('플레이어가 Table 10-9의 사건을 선택합니다.', { optionalChoice: Array.from({ length: 19 }, (_, index) => index + 1), unresolvedChoice: { type: 'personal_event_choice', label: '1-19번 사건 중 하나 선택' } }),
    fumble: eventOutcome('플레이어가 Table 10-9의 사건을 선택합니다.', { optionalChoice: Array.from({ length: 19 }, (_, index) => index + 1), unresolvedChoice: { type: 'personal_event_choice', label: '1-19번 사건 중 하나 선택' } })
  })
};

export const FAMILY_EVENT_TABLE = {
  1: { title: '비극적 죽음', affects: 'family', summary: '가문원이 경기나 불화 중재 중 사망합니다.', lifecycleEffect: 'target_death' },
  2: { title: '영웅적 죽음', affects: 'family', summary: '가문원이 귀인을 구하다 사망하고 모든 가문원이 영광 10을 얻습니다.', glory: 10, lifecycleEffect: 'target_death' },
  3: { title: '영광스러운 위업', affects: 'family', summary: '가문원이 영웅적 위업을 이루어 모든 가문원이 영광 5를 얻습니다.', glory: 5 },
  4: { title: '투옥', affects: 'family', summary: '가문원이 강제 혼인 또는 몸값을 위해 붙잡힙니다.', familyEffect: 'captive' },
  5: { title: '실종', affects: 'family', summary: '가문원이 실종되었다는 소식이 옵니다.', familyEffect: 'missing' },
  6: { title: '모욕', affects: 'family', summary: '주군을 모욕한 가문원을 지지하거나 꾸짖습니다.', choice: ['support', 'rebuke'] },
  7: { title: '채무', affects: 'family', summary: '가문원이 빚 £1d6의 도움을 요청합니다.', choice: ['pay', 'refuse'] },
  8: { title: '전리품', affects: 'character', summary: '가문원이 출생 선물표의 물건을 주고 Love [family] 체크를 얻습니다.', unresolved: 'birth_gift' },
  9: { title: '실패한 혼인', affects: 'family', summary: '이혼, 파혼 또는 혼인 거부가 일어납니다.', unresolved: 'optional_challenge' },
  10: { title: '영광스러운 혼인', affects: 'family', summary: '가문원이 훨씬 높은 계급과 혼인해 Honor가 1점 오릅니다.', effect: [{ type: 'score', group: 'passions', key: 'honor', amount: 1 }] },
  11: { title: '사생아', affects: 'family', summary: '가문원에게 사생아가 생깁니다.', familyEffect: 'new_bastard_child' },
  12: { title: '후견인', affects: 'character', summary: '미성년 친족의 후견인이 되어 성년까지 연 £1을 얻습니다.', familyEffect: 'ward' },
  13: { title: '피난민', affects: 'character', summary: '정당한 처벌을 피해 온 친족을 받아들이거나 거절합니다.', choice: ['accept', 'refuse'] },
  14: { title: '몸값', affects: 'family', summary: '가문원의 몸값 £1d6을 도울지 선택합니다.', choice: ['pay', 'refuse'] },
  15: { title: '경범죄', affects: 'family', summary: '벌금 £1을 내거나 Honor 1점을 잃습니다.', choice: ['pay', 'lose_honor'] },
  16: { title: '중범죄', affects: 'family', summary: '벌금 £5를 내거나 Honor 2점을 잃습니다.', choice: ['pay', 'lose_honor'] },
  17: { title: '간통', affects: 'family', summary: '추문으로 두 가문 사이에 불화가 시작됩니다.', familyEffect: 'start_feud' },
  18: { title: '곪은 불화', affects: 'family', summary: '가문 간 충돌이 터져 Battle 판정이 필요합니다.', unresolved: 'battle_roll' },
  19: { title: '승진', affects: 'character', summary: '가문원이 고위 직위에 올라 Honor와 Love [family] 체크, 영광 10을 얻습니다.', glory: 10 },
  20: { title: '플레이어 선택', affects: 'character', summary: '플레이어가 가족 사건 하나를 선택합니다.', choice: Array.from({ length: 19 }, (_, index) => index + 1) }
};

const clone = value => JSON.parse(JSON.stringify(value));

const getManorCount = character => {
  if (Number.isFinite(Number(character.family?.manors))) return Math.max(0, Number(character.family.manors));
  return character.family?.hasEstate || String(character.gear?.homePossessions || '').includes('장원') ? 1 : 0;
};

const getSpouse = character => (character.family?.members || []).find(member => ['부인', '남편', '배우자', 'wife', 'husband', 'spouse'].some(label => String(member.relation).toLowerCase().includes(label)) && member.status !== '사망');

const hasSpouse = character => Boolean(getSpouse(character));

const hasBlessing = (character, key, label) => {
  const blessing = character.campaign?.creationTrace?.blessing || character.personal?.blessing || '';
  return blessing?.key === key || String(blessing?.label || blessing).toLowerCase().includes(String(label).toLowerCase());
};

const getSelfMember = character => {
  const activeId = character.campaign?.lifecycle?.activeCharacterId;
  return (character.family?.members || []).find(member => member.id === activeId)
    || (character.family?.members || []).find(member => member.relation === '본인');
};

const familyMemberId = (character, prefix, year, index = 0) => {
  const used = new Set((character.family?.members || []).map(member => member.id));
  let id = `${prefix}-${year}-${index + 1}`;
  let suffix = 1;
  while (used.has(id)) id = `${prefix}-${year}-${index + 1}-${suffix++}`;
  return id;
};

const createEmptyWinter = year => ({
  year,
  transactionId: `winter:${year}`,
  currentStep: 'soloScenario',
  steps: Object.fromEntries(WINTER_STEPS.map(step => [step.id, 'pending'])),
  records: {},
  transactions: [],
  logs: [],
  unresolved: {},
  annualLedger: null,
  survivalRecords: [],
  gloryBonusPoints: 0,
  bonusSpent: 0,
  skippedWithConfirmation: {},
  flags: {}
});

export const ensureWinterState = character => {
  const year = Number(character.personal?.campaignYear || 767);
  const source = character.campaign?.winter || {};
  if (source.year !== year || source.transactionId !== `winter:${year}`) return createEmptyWinter(year);
  return {
    ...createEmptyWinter(year),
    ...source,
    steps: { ...createEmptyWinter(year).steps, ...(source.steps || {}) },
    records: source.records || {},
    transactions: Array.isArray(source.transactions) ? source.transactions : [],
    logs: Array.isArray(source.logs) ? source.logs : [],
    unresolved: source.unresolved || {},
    survivalRecords: Array.isArray(source.survivalRecords) ? source.survivalRecords : [],
    flags: source.flags || {}
  };
};

const nextPendingStep = winter => WINTER_STEPS.find(step => winter.steps[step.id] === 'pending' || winter.steps[step.id] === 'awaiting_choice')?.id || 'complete';

const markApplied = (character, completionId, label) => {
  character.campaign.appliedEvents = character.campaign.appliedEvents || {};
  character.campaign.appliedEvents[completionId] = {
    appliedAt: new Date().toISOString(),
    year: character.personal?.campaignYear,
    label
  };
};

const isApplied = (character, completionId) => Boolean(character.campaign?.appliedEvents?.[completionId]);

const pushChronicle = (character, record) => {
  if (!record.isMeaningful) return;
  appendChronicleEvent(character, {
    id: record.completionId,
    year: record.year,
    age: character.personal?.age,
    type: record.chronicleType || 'winter',
    title: record.chronicleTitle || record.label,
    narrative: record.journalEntry,
    sourceRuleId: record.ruleId,
    sourcePage: record.sourcePage,
    glory: record.glory || undefined,
    standing: record.standing || undefined,
    lifecycleEffect: record.lifecycleEffect || undefined
  });
};

const createRecord = (step, year, input = {}) => ({
  stepId: step.id,
  number: step.number,
  label: step.label,
  ruleId: step.ruleId,
  sourcePage: step.sourcePage,
  year,
  input,
  roll: null,
  modifiers: [],
  unresolvedChoice: null,
  result: null,
  stateChanges: [],
  completionId: `winter:${year}:${step.id}`,
  rollbackBoundary: `winter:${year}:before:${step.id}`,
  journalEntry: '',
  isMeaningful: false,
  chronicleType: 'winter',
  chronicleTitle: ''
});

const applyScore = (character, group, key, amount, context = {}) => {
  character[group] = character[group] || {};
  const before = Number(character[group][key] || 0);
  if (group === 'standings') {
    const ledger = recordStandingChange(character, {
      id: context.id || `standing:${context.year || character.personal?.campaignYear}:${key}:${context.sequence || 0}`,
      year: context.year,
      standingKey: key,
      amount,
      title: context.title || `${key} 지위 변화`,
      narrative: context.narrative || '',
      sourceRuleId: context.sourceRuleId || '',
      sourcePage: context.sourcePage || ''
    });
    return { path: `${group}.${key}`, before: ledger.before, after: ledger.after, ledgerId: ledger.id };
  }
  if (group === 'traits') character.traits = adjustOpposedTrait(character.traits, key, amount);
  else character[group][key] = Math.max(0, before + Number(amount || 0));
  return { path: `${group}.${key}`, before, after: Number(character[group][key] || 0) };
};

const addCheck = (character, group, key) => {
  const mapName = group === 'traits' ? 'traitsChecked' : group === 'passions' ? 'passionsChecked' : group === 'standings' ? 'standingsChecked' : 'skillsChecked';
  character[mapName] = character[mapName] || {};
  character[mapName][key] = true;
  return { path: `${mapName}.${key}`, before: false, after: true };
};

const applyOutcome = (character, winter, outcome, rng, context = {}) => {
  const stateChanges = [];
  const unresolved = [];
  const applyCash = amount => {
    const before = Number(character.gear?.cash || 0);
    const after = before + amount;
    if (after < 0) {
      unresolved.push({ type: 'insufficient_cash', label: `£${Math.abs(amount)} 지출을 위한 재산 정리 필요` });
      return;
    }
    character.gear.cash = after;
    stateChanges.push({ path: 'gear.cash', before, after });
  };

  (outcome.mandatoryEffect || []).forEach(effect => {
    if (effect.type === 'score') stateChanges.push(applyScore(character, effect.group, effect.key, effect.amount, context));
    if (effect.type === 'cash') applyCash(effect.amount);
    if (effect.type === 'scaledCash') applyCash(-Math.ceil(Number(character.traits?.[effect.key] || 0) / effect.divisor));
    if (effect.type === 'winterFlag') {
      const before = winter.flags[effect.key];
      winter.flags[effect.key] = effect.amount ? Number(before || 0) + effect.amount : effect.value;
      stateChanges.push({ path: `campaign.winter.flags.${effect.key}`, before, after: winter.flags[effect.key] });
    }
    if (effect.type === 'wound') {
      const damage = rollDice(effect.dice[0], effect.dice[1], rng);
      const before = Number(character.attributes?.currentHp || 0);
      const applied = applyCharacterDamage(character, {
        rolledDamage: damage,
        direct: true,
        skipKnockdown: true,
        year: context.year,
        source: context.title || '겨울 사건 부상',
        sourceRuleId: context.sourceRuleId || 'WINTER-PERSONAL-001',
        sourcePage: context.sourcePage || 'Ch.10 pp.176-179'
      }, rng);
      Object.assign(character, applied.character);
      stateChanges.push({
        path: 'attributes.currentHp',
        before,
        after: character.attributes.currentHp,
        roll: `${effect.dice[0]}d${effect.dice[1]}=${damage}`,
        woundId: applied.injury.woundId,
        classification: applied.injury.classification
      });
    }
    if (effect.type === 'gearNote') {
      const before = character.gear?.[effect.key] || '';
      character.gear[effect.key] = before ? `${before}, ${effect.value}` : effect.value;
      stateChanges.push({ path: `gear.${effect.key}`, before, after: character.gear[effect.key] });
    }
  });
  (outcome.traitCheck || []).forEach(key => stateChanges.push(addCheck(character, 'traits', key)));
  (outcome.passionCheck || []).forEach(key => stateChanges.push(addCheck(character, 'passions', key)));
  (outcome.skillCheck || []).forEach(key => stateChanges.push(addCheck(character, 'skills', key)));
  (outcome.standing || []).forEach(effect => {
    if (effect.check) stateChanges.push(addCheck(character, 'standings', effect.key));
    else stateChanges.push(applyScore(character, 'standings', effect.key, effect.amount, { ...context, id: `${context.id || 'standing'}:${effect.key}` }));
  });
  if (outcome.glory) {
    const before = Number(character.gear?.gloryThisGame || 0);
    recordGloryAward(character, {
      id: `${context.id || `glory:${winter.year}`}:glory`,
      year: winter.year,
      title: context.title || '겨울 사건 영광',
      narrative: outcome.journalPrompt || '',
      amount: outcome.glory,
      sourceRuleId: context.sourceRuleId || '',
      sourcePage: context.sourcePage || ''
    });
    stateChanges.push({ path: 'gear.gloryThisGame', before, after: character.gear.gloryThisGame });
  }
  if (outcome.unresolvedChoice) unresolved.push(outcome.unresolvedChoice);
  return { stateChanges, unresolved };
};

export const getNpcAgeModifier = age => {
  const value = Number(age || 0);
  if (value >= 3 && value <= 14) return 1;
  if (value >= 30) return -1;
  return 0;
};

export const getHorseAgeModifier = age => {
  const value = Number(age || 0);
  if (value >= 3 && value <= 5) return 1;
  if (value >= 12) return -1;
  return 0;
};

export const resolveSurvivalRoll = ({ roll, ageModifier = 0, maintenanceModifier = 0, illnessModifier = 0 }) => {
  const adjustedRoll = Math.max(1, Math.min(20, Number(roll) + Number(ageModifier) + Number(maintenanceModifier) + Number(illnessModifier)));
  return {
    roll,
    adjustedRoll,
    result: adjustedRoll === 1 ? 'death' : adjustedRoll === 2 ? 'illness' : 'healthy',
    consequence: adjustedRoll === 1 ? '사망' : adjustedRoll === 2 ? '다음 해 생존 판정 -5' : '건강'
  };
};

const parseBirthYear = member => {
  const match = String(member.lifeYears || '').match(/^(\d{3,4})/);
  return match ? Number(match[1]) : null;
};

export const collectSurvivalTargets = character => {
  const year = Number(character.personal?.campaignYear || 767);
  const activeId = character.campaign?.lifecycle?.activeCharacterId;
  const targets = (character.family?.members || [])
    .filter(member => !['사망', '역사적'].includes(member.status) && member.id !== activeId && member.relation !== '본인')
    .map(member => ({
      targetId: member.id,
      type: 'family',
      relationship: member.relation,
      label: member.name,
      age: parseBirthYear(member) === null ? null : year - parseBirthYear(member),
      priorIllness: member.status === '질병',
      replacementPolicy: 'none'
    }));

  if (character.squire && character.squire.status !== '사망') {
    targets.push({ targetId: 'primary-squire', type: 'squire', relationship: '종자', label: character.squire.name || '종자', age: character.squire.age, priorIllness: character.squire.status === '질병', replacementPolicy: 'replace_at_age_18' });
  }

  const hasHerd = getManorCount(character) > 0 || Number(character.standings?.liegeLord || 0) > 0;
  const warhorse = character.horses?.warhorse;
  if (warhorse && warhorse.status !== '사망') {
    const type = String(warhorse.type || '').toLowerCase();
    const ordinary = ['charger', 'rouncy', 'sumpter', '돌격마', '승용마', '짐말'].some(label => type.includes(label));
    targets.push({
      targetId: 'warhorse',
      type: ordinary ? 'ordinary_mount' : 'special_mount',
      relationship: '주요 탈것',
      label: warhorse.type || '주요 군마',
      age: warhorse.age,
      priorIllness: warhorse.status === '질병',
      replacementPolicy: ordinary && hasHerd ? 'herd' : 'none',
      rollRequired: !ordinary || !hasHerd
    });
  }
  return targets;
};

export const resolveFamilyRelation = ({ relationRoll, sexRoll, members = [] }) => {
  const relation = FAMILY_RELATION_TABLE.find(entry => relationRoll >= entry.min && relationRoll <= entry.max);
  const gender = Number(sexRoll) % 2 === 1 ? 'female' : 'male';
  const candidates = members.filter(member => {
    if (member.status === '사망') return false;
    const memberGender = member.gender || 'unknown';
    const genderMatches = memberGender === 'unknown' || memberGender === gender;
    const relationText = `${member.relation || ''} ${member.note || ''}`.toLowerCase();
    return genderMatches && relation.keywords.some(keyword => relationText.includes(keyword.toLowerCase()));
  });
  return {
    relationRoll,
    sexRoll,
    relationKey: relation.key,
    relationLabel: relation.label,
    gender,
    candidates,
    selectedTarget: candidates.length === 1 ? candidates[0] : null,
    unresolvedChoice: candidates.length === 1 ? null : {
      type: candidates.length ? 'family_target_choice' : 'family_target_creation_or_reroll',
      label: candidates.length ? `${relation.label} 후보 중 ${gender === 'female' ? '여성' : '남성'} 대상 선택` : `${relation.label} ${gender === 'female' ? '여성' : '남성'} 대상이 없어 생성 또는 재굴림 필요`
    }
  };
};

const resolveSolo = (character, winter, record, input) => {
  const choice = input.choice;
  if (!['completed', 'not_applicable'].includes(choice)) throw new RangeError('Solo Scenario requires completed or not_applicable.');
  record.result = choice;
  record.journalEntry = choice === 'completed' ? `개인 모험을 마치고 ${record.year}년 겨울 정산을 시작했습니다.` : `개인 모험이 해당되지 않아 ${record.year}년 겨울 정산을 시작했습니다.`;
  record.isMeaningful = choice === 'completed';
  record.chronicleType = 'adventure';
  record.chronicleTitle = '개인 모험을 마치다';
  winter.flags.soloScenarioPerformed = choice === 'completed';
};

const resolveAging = (character, winter, record, input, rng) => {
  const beforeAge = Number(character.personal?.age || 0);
  character.personal.age = beforeAge + 1;
  record.stateChanges.push({ path: 'personal.age', before: beforeAge, after: character.personal.age });
  if (character.squire) {
    const before = Number(character.squire.age || 14);
    const next = before + 1;
    character.squire.age = next >= 18 ? 14 : next;
    record.stateChanges.push({ path: 'squire.age', before, after: character.squire.age, replacement: next >= 18 });
  }
  if (Number.isFinite(Number(character.horses?.warhorse?.age))) {
    const before = Number(character.horses.warhorse.age);
    character.horses.warhorse.age = before + 1;
    record.stateChanges.push({ path: 'horses.warhorse.age', before, after: before + 1 });
  }
  const agingStartsAt = hasBlessing(character, 'eternalYouth', 'eternal youth') ? 35 : 30;
  if (character.personal.age < agingStartsAt) {
    record.result = { age: character.personal.age, agingRollRequired: false, agingStartsAt };
    record.journalEntry = `${character.personal.age}세가 되었으며 ${agingStartsAt}세 미만이므로 노화 표 판정은 없습니다.`;
    return;
  }
  const agingRoll = input.agingRoll || rollDie(20, rng);
  const count = getAgingRollCount(agingRoll);
  const attributeRolls = Array.from({ length: count }, (_, index) => input.attributeRolls?.[index] || rollDie(6, rng));
  const keys = ['siz', 'dex', 'str', 'con', 'app'];
  attributeRolls.forEach(roll => {
    if (roll <= 5) record.stateChanges.push(applyScore(character, 'attributes', keys[roll - 1], -1));
  });
  record.roll = { aging: agingRoll, attributes: attributeRolls };
  record.result = { affected: count, losses: attributeRolls.filter(roll => roll <= 5).map(roll => keys[roll - 1]) };
  const lifecycleResolution = resolveAttributeLifecycle(character, {
    eventId: `lifecycle:winter-aging:${record.year}`,
    cause: '겨울 노화 능력치 하락',
    year: record.year,
    sourceRuleId: 'WINTER-AGING-001',
    sourcePage: 'Ch.10 p.174',
    triggeringEvent: 'winter_aging'
  });
  Object.assign(character, lifecycleResolution.character);
  record.lifecycleEffect = character.campaign?.lifecycle?.careerStatus;
  if (['deceased', 'bedridden'].includes(record.lifecycleEffect)) {
    record.unresolvedChoice = { type: 'lifecycle_transition', label: record.lifecycleEffect === 'deceased' ? '사망 후 구원과 계승 절차' : '병상 상태와 활동 제한 확인', required: true };
  }
  record.journalEntry = `${character.personal.age}세 노화 d20 ${agingRoll}: ${record.result.losses.length ? record.result.losses.join(', ').toUpperCase() + ' 감소' : '능력치 감소 없음'}. 생애 상태 ${record.lifecycleEffect || 'active'}.`;
  record.isMeaningful = record.result.losses.length > 0 || ['deceased', 'bedridden'].includes(record.lifecycleEffect);
  record.chronicleType = ['deceased', 'bedridden'].includes(record.lifecycleEffect) ? 'death' : 'winter';
  record.chronicleTitle = record.lifecycleEffect === 'deceased' ? '노화로 생을 마치다' : record.lifecycleEffect === 'bedridden' ? '병상에 들다' : '세월의 흔적';
};

const resolveEconomy = (character, winter, record, input, rng) => {
  const manors = getManorCount(character);
  const gradeKey = input.maintenanceGrade || character.personal?.maintenance || 'ordinary';
  const grade = MAINTENANCE_GRADES[gradeKey];
  if (!grade) throw new RangeError('Unknown maintenance grade.');
  const householdKnight = manors === 0;
  let harvest = { roll: null, target: null, modifier: 0, income: 0, outcome: 'not_landed' };
  if (!householdKnight) {
    if (winter.flags?.legacyHarvestResolved && winter.economy?.maintenancePending) {
      harvest = {
        roll: null,
        target: Number(winter.economy.stewardshipTarget || 0),
        modifier: Number(winter.economy.stewardshipModifier || 0),
        income: Number(winter.economy.grossIncome || 0),
        outcome: 'migrated_harvest'
      };
    } else {
      const harvestRoll = input.harvestRoll || rollDie(20, rng);
      const modifier = getHarvestModifier({
        year: record.year,
        standings: character.standings,
        prosperity: hasBlessing(character, 'prosperity', 'prosperity'),
        situationalModifier: Number(input.situationalModifier || 0)
      });
      harvest = resolveHarvest({ roll: harvestRoll, stewardship: character.skills?.stewardship || 0, modifier, manors });
    }
  }
  const requiredMaintenance = householdKnight ? 0 : grade.minimum;
  const activeWards = (character.family?.wards || []).filter(ward => Number(ward.startYear || 0) <= record.year && (!ward.endYear || record.year < ward.endYear));
  const wardIncome = activeWards.reduce((sum, ward) => sum + Number(ward.annualIncome || 1), 0);
  const grossIncome = harvest.income + wardIncome;
  const surplus = grossIncome - requiredMaintenance;
  const cashBefore = Number(character.gear?.cash || 0);
  if (cashBefore + surplus < 0) {
    record.unresolvedChoice = { type: 'maintenance_deficit', label: `£${Math.abs(surplus)} 적자를 충당할 매각 또는 유지 수준 변경`, required: true };
  } else {
    character.gear.cash = cashBefore + surplus;
    record.stateChanges.push({ path: 'gear.cash', before: cashBefore, after: character.gear.cash });
    character.personal.maintenance = gradeKey;
  }
  const baseExpenses = householdKnight ? { knightAndSquire: 0, family: 0, horses: 0, additionalMaintenance: 0 } : {
    knightAndSquire: 2,
    family: hasSpouse(character) ? 2 : 0,
    horses: 2,
    additionalMaintenance: Math.max(0, requiredMaintenance - (hasSpouse(character) ? 6 : 4))
  };
  winter.annualLedger = {
    year: record.year,
    grossIncome,
    requiredMaintenance,
    manorExpense: 0,
    householdExpense: baseExpenses.knightAndSquire + baseExpenses.family,
    militaryExpense: baseExpenses.horses,
    additionalMaintenance: baseExpenses.additionalMaintenance,
    surplus: Math.max(0, surplus),
    deficit: Math.max(0, -surplus),
    grade: gradeKey,
    choice: input.choice || 'maintain',
    treasuryDelta: record.unresolvedChoice ? 0 : surplus,
    harvest,
    wardIncome,
    completionId: record.completionId
  };
  record.roll = harvest.roll;
  record.modifiers = [{ label: 'Stewardship', value: character.skills?.stewardship || 0 }, { label: 'Harvest modifiers', value: harvest.modifier || 0 }];
  record.result = winter.annualLedger;
  record.journalEntry = householdKnight
    ? `${record.year}년은 주군이 보통 수준의 생활을 제공하는 가신 기사로 기록했습니다.`
    : `장원 ${manors}곳과 후견 수입 £${grossIncome}, ${grade.label} 유지비 £${requiredMaintenance}, 보물고 순변동 ${surplus >= 0 ? '+' : ''}£${surplus}.`;
  record.isMeaningful = Boolean(record.unresolvedChoice) || (!householdKnight && ['critical', 'fumble'].includes(harvest.outcome));
  record.chronicleTitle = record.unresolvedChoice ? '겨울 재정의 위기' : harvest.outcome === 'critical' ? '풍요로운 수확' : '혹독한 수확';
  if (!record.unresolvedChoice && winter.flags?.legacyHarvestResolved) {
    winter.flags.legacyHarvestResolved = false;
    winter.economy.maintenancePending = false;
  }
};

const resolveSurvival = (character, winter, record, _input, rng) => {
  const grade = MAINTENANCE_GRADES[character.personal?.maintenance] || MAINTENANCE_GRADES.ordinary;
  const targets = collectSurvivalTargets(character);
  const familyMembers = character.family?.members || [];
  winter.survivalRecords = targets.map(target => {
    if (target.type === 'ordinary_mount' && target.replacementPolicy === 'herd') {
      return { ...target, roll: null, modifiers: [], result: 'herd_replacement', consequence: '장원 또는 주군의 마구간이 평범한 말을 보충', replacement: 'automatic', journal: `${target.label}: 마구간 보충 대상`, appliedEffectId: `${record.completionId}:${target.targetId}` };
    }
    const roll = rollDie(20, rng);
    const ageModifier = target.type.includes('mount') ? getHorseAgeModifier(target.age) : getNpcAgeModifier(target.age);
    const maintenanceModifier = target.type.includes('mount') ? grade.horseSurvival : grade.childSurvival;
    const illnessModifier = target.priorIllness ? -5 : 0;
    const resolution = resolveSurvivalRoll({ roll, ageModifier, maintenanceModifier, illnessModifier });
    if (target.type === 'family') {
      const member = familyMembers.find(candidate => candidate.id === target.targetId);
      if (member) member.status = resolution.result === 'death' ? '사망' : resolution.result === 'illness' ? '질병' : '생존';
    }
    if (target.type === 'squire') character.squire.status = resolution.result === 'death' ? '사망' : resolution.result === 'illness' ? '질병' : '건강';
    if (target.targetId === 'warhorse') character.horses.warhorse.status = resolution.result === 'death' ? '사망' : resolution.result === 'illness' ? '질병' : '건강';
    return {
      ...target,
      roll,
      modifiers: [{ type: 'age', value: ageModifier }, { type: 'maintenance', value: maintenanceModifier }, { type: 'priorIllness', value: illnessModifier }],
      ...resolution,
      replacement: resolution.result === 'death' && target.replacementPolicy === 'herd' ? 'automatic' : 'none',
      journal: `${target.label}: d20 ${roll}, 수정 ${resolution.adjustedRoll}, ${resolution.consequence}`,
      appliedEffectId: `${record.completionId}:${target.targetId}`
    };
  });
  winter.survivalRecords.filter(item => item.type === 'family' && ['death', 'illness'].includes(item.result)).forEach(item => {
    appendFamilyTimeline(character, {
      id: `${record.completionId}:family:${item.targetId}:${item.result}`,
      year: record.year,
      type: item.result,
      memberId: item.targetId,
      title: item.result === 'death' ? `${item.label} 사망` : `${item.label} 질병`,
      narrative: item.journal,
      sourceRuleId: 'WINTER-SURVIVAL-001',
      sourcePage: 'Ch.10 p.176'
    });
  });
  record.roll = winter.survivalRecords.map(item => ({ targetId: item.targetId, roll: item.roll }));
  record.result = { healthy: winter.survivalRecords.filter(item => ['healthy', 'herd_replacement'].includes(item.result)).length, illness: winter.survivalRecords.filter(item => item.result === 'illness').length, deaths: winter.survivalRecords.filter(item => item.result === 'death').length };
  record.stateChanges = winter.survivalRecords.map(item => ({ path: `survival.${item.targetId}`, after: item.result }));
  record.journalEntry = `${winter.survivalRecords.length}개 대상의 생존을 개별 판정했습니다. 사망 ${record.result.deaths}, 질병 ${record.result.illness}, 건강 또는 보충 ${record.result.healthy}.`;
  record.isMeaningful = record.result.deaths > 0 || record.result.illness > 0;
  record.chronicleType = record.result.deaths > 0 ? 'death' : 'family';
  record.chronicleTitle = record.result.deaths > 0 ? '가문에 죽음이 닥치다' : '겨울 질병';
};

const resolvePersonalEvent = (character, winter, record, input, rng) => {
  if (winter.flags.soloScenarioPerformed) {
    record.result = { skippedByRule: true };
    record.journalEntry = '올해 개인 모험을 수행했으므로 무작위 개인 사건은 판정하지 않았습니다.';
    return;
  }
  const previous = winter.records.personalEvent;
  const eventRoll = previous?.status === 'awaiting_event_choice' ? previous.roll?.event : (input.eventRoll || rollDie(20, rng));
  const selectedEvent = eventRoll === 20 ? Number(input.eventChoice || previous?.input?.eventChoice || 0) : eventRoll;
  if (eventRoll === 20 && (selectedEvent < 1 || selectedEvent > 19)) {
    record.roll = { event: 20 };
    record.result = { status: 'awaiting_event_choice' };
    record.unresolvedChoice = PERSONAL_EVENT_TABLE[20].outcomes.success.unresolvedChoice;
    record.journalEntry = 'Table 10-9 결과 20: 플레이어가 1-19번 사건 중 하나를 선택해야 합니다.';
    record.status = 'awaiting_event_choice';
    return;
  }
  const event = PERSONAL_EVENT_TABLE[selectedEvent];
  const checkRoll = input.checkRoll || rollDie(20, rng);
  const target = Number(character[event.checkGroup]?.[event.checkKey] || 0);
  const check = resolveD20Roll(checkRoll, target);
  const outcome = event.outcomes[check.outcome];
  const applied = applyOutcome(character, winter, outcome, rng, {
    id: record.completionId,
    year: record.year,
    title: `개인 사건 · ${event.trigger}`,
    narrative: outcome.journalPrompt,
    sourceRuleId: record.ruleId,
    sourcePage: event.sourcePage
  });
  record.input = { ...input, eventChoice: eventRoll === 20 ? selectedEvent : undefined };
  record.roll = { event: eventRoll, selectedEvent, check: checkRoll };
  record.modifiers = [{ label: event.trigger, value: target }];
  record.result = { event: selectedEvent, trigger: event.trigger, check, outcome };
  record.stateChanges.push(...applied.stateChanges);
  record.glory = outcome.glory || 0;
  record.standing = outcome.standing?.length ? outcome.standing : undefined;
  if (applied.unresolved.length) record.unresolvedChoice = applied.unresolved;
  record.journalEntry = `개인 사건 ${selectedEvent}번 ${event.trigger}, d20 ${checkRoll}/${target}: ${check.outcome}. ${outcome.journalPrompt}`;
  record.isMeaningful = true;
  record.chronicleType = 'winter';
  record.chronicleTitle = `겨울의 ${event.trigger} 사건`;
  if (applied.unresolved.length) record.status = 'awaiting_choice';
};

const createSpouse = (character, { year, name, rank, age }) => {
  const self = getSelfMember(character);
  const id = familyMemberId(character, 'spouse', year);
  const spouse = {
    id,
    name: String(name || '이름 미정 배우자'),
    relation: '배우자',
    generation: self?.generation || 3,
    status: '생존',
    lifeYears: `${year - Number(age || character.personal?.age || 18)}~`,
    birthYear: year - Number(age || character.personal?.age || 18),
    spouseId: self?.id,
    gender: character.personal?.gender === 'female' ? 'male' : 'female',
    note: rank
  };
  character.family.members.push(spouse);
  if (self) self.spouseId = id;
  return spouse;
};

const resolveMarriage = (character, winter, record, input, rng) => {
  const action = hasSpouse(character) ? 'already_married' : input.marriageAction || 'skip';
  const result = { action, status: 'skipped', spouse: null, glory: 0, dowry: 0, manors: 0 };
  if (action === 'already_married' || action === 'skip') return result;
  if (!['below_class', 'within_class_wait', 'within_class_roll'].includes(action)) throw new RangeError('Unknown marriage action.');

  if (action === 'below_class') {
    const roll = Number(input.marriagePermissionRoll || rollDie(20, rng));
    const check = resolveD20Roll(roll, Number(character.standings?.liegeLord || 0));
    result.permission = check;
    result.roll = roll;
    if (!check.success) {
      result.status = 'permission_refused';
      return result;
    }
    result.status = 'married';
    result.rank = 'ordinary_woman';
    result.label = '평범한 여성';
    result.dowry = Number(input.dowryRoll || rollDie(6, rng));
    result.glory = 10;
  } else {
    const roll = Number(input.courtesyRoll || rollDie(20, rng));
    const check = resolveD20Roll(roll, Number(character.skills?.courtesy || 0));
    result.courtesy = check;
    result.roll = roll;
    if (!check.success) {
      result.status = 'no_candidate';
      return result;
    }
    if (action === 'within_class_wait') {
      winter.flags.marriageWaitingBonus = Number(winter.flags.marriageWaitingBonus || 0) + 1;
      result.status = 'candidate_met';
      result.waitingModifier = winter.flags.marriageWaitingBonus;
      return result;
    }
    const tableRoll = Number(input.marriageTableRoll || rollDie(20, rng));
    const tableResult = resolveRandomMarriage({ roll: tableRoll, waitingModifier: winter.flags.marriageWaitingBonus || 0 }, rng);
    Object.assign(result, tableResult, { status: 'married' });
    winter.flags.marriageWaitingBonus = 0;
  }

  const spouse = createSpouse(character, { year: record.year, name: input.spouseName, rank: result.label || result.rank, age: input.spouseAge });
  result.spouse = spouse;
  const cashBefore = Number(character.gear?.cash || 0);
  character.gear.cash = cashBefore + Number(result.dowry || result.dowryAmount || 0);
  result.dowry = Number(result.dowry || result.dowryAmount || 0);
  record.stateChanges.push({ path: 'gear.cash', before: cashBefore, after: character.gear.cash });
  if (result.manors) {
    const before = getManorCount(character);
    character.family.manors = before + Number(result.manors);
    record.stateChanges.push({ path: 'family.manors', before, after: character.family.manors });
  }
  if (result.glory) {
    const before = Number(character.gear?.gloryThisGame || 0);
    recordGloryAward(character, {
      id: `${record.completionId}:marriage:glory`, year: record.year, title: '혼인 영광', narrative: `${result.label || result.rank}과 혼인했습니다.`, amount: result.glory,
      sourceRuleId: 'WINTER-MARRIAGE-001', sourcePage: 'Ch.10 pp.176-179'
    });
    record.stateChanges.push({ path: 'gear.gloryThisGame', before, after: character.gear.gloryThisGame });
  }
  appendFamilyTimeline(character, {
    id: `${record.completionId}:marriage`, year: record.year, type: 'marriage', memberId: getSelfMember(character)?.id, relatedMemberId: spouse.id,
    title: `${character.personal?.name || '기사'}의 혼인`, narrative: `${spouse.name}와 혼인하여 지참금 £${result.dowry}${result.manors ? `와 장원 ${result.manors}곳` : ''}을 받았습니다.`,
    sourceRuleId: 'WINTER-MARRIAGE-001', sourcePage: 'Ch.10 pp.176-179'
  });
  return result;
};

const resolveChildbirths = (character, record, input, rng) => {
  const grade = MAINTENANCE_GRADES[character.personal?.maintenance] || MAINTENANCE_GRADES.ordinary;
  const requests = Array.isArray(input.childbirths) ? input.childbirths : input.childbirthAction === 'roll' ? [{ motherId: input.motherId, motherName: input.motherName, childNames: input.childNames }] : [];
  const results = [];
  requests.forEach((request, requestIndex) => {
    const spouse = getSpouse(character);
    const mother = (character.family?.members || []).find(member => member.id === request.motherId) || spouse;
    const isWife = Boolean(mother && mother.id === spouse?.id);
    if (!isWife) {
      const before = Number(character.gear?.cash || 0);
      if (before < 0.5) {
        results.push({ status: 'departed_unpaid', motherId: mother?.id || null, motherName: request.motherName || mother?.name || '기록되지 않은 여성' });
        return;
      }
      character.gear.cash = before - 0.5;
      record.stateChanges.push({ path: 'gear.cash', before, after: character.gear.cash });
    }
    const fertility = hasBlessing(character, 'fertility', 'fertility') ? 5 : 0;
    const modifier = grade.childbirth + fertility;
    const roll = Number(request.roll || rollDie(20, rng));
    const childbirth = resolveChildbirthRoll({ roll, modifier, sexRolls: request.sexRolls }, rng);
    const result = { ...childbirth, status: childbirth.births ? 'birth' : childbirth.motherDies ? 'death' : 'no_birth', motherId: mother?.id || null, motherName: request.motherName || mother?.name || '기록되지 않은 여성', children: [] };
    if (childbirth.motherDies && mother) {
      mother.status = '사망';
      mother.deathCause = '출산';
      mother.lifeYears = `${String(mother.lifeYears || '').split('~')[0]}~${record.year}`;
      appendFamilyTimeline(character, {
        id: `${record.completionId}:mother-death:${mother.id}`, year: record.year, type: 'death', memberId: mother.id,
        title: `${mother.name} 출산 중 사망`, narrative: childbirth.childrenDie ? '산모와 아이가 모두 출산 중 숨졌습니다.' : '산모는 숨졌으나 아이는 살아남았습니다.',
        sourceRuleId: 'WINTER-CHILDBIRTH-001', sourcePage: 'Ch.10 p.179'
      });
    }
    childbirth.children.forEach((child, childIndex) => {
      const self = getSelfMember(character);
      const id = familyMemberId(character, 'child', record.year, requestIndex * 2 + childIndex);
      const relation = child.gender === 'female' ? '딸' : '아들';
      const member = {
        id,
        name: String(request.childNames?.[childIndex] || `이름 미정 ${relation}`),
        relation,
        generation: Math.min(12, Number(self?.generation || 3) + 1),
        status: '생존',
        lifeYears: `${record.year}~`,
        birthYear: record.year,
        parentId: self?.id,
        gender: child.gender,
        note: mother ? `${mother.name}의 자녀` : '출생 기록'
      };
      character.family.members.push(member);
      result.children.push(member);
      appendFamilyTimeline(character, {
        id: `${record.completionId}:birth:${id}`, year: record.year, type: 'birth', memberId: id, relatedMemberId: mother?.id || null,
        title: `${member.name} 탄생`, narrative: `${relation}이 건강하게 태어났습니다.`, sourceRuleId: 'WINTER-CHILDBIRTH-001', sourcePage: 'Ch.10 p.179'
      });
    });
    results.push(result);
  });
  return results;
};

const applyFamilyEvent = (character, winter, record, familyEvent, relation, rng) => {
  const unresolved = [];
  const target = relation.selectedTarget;
  const context = { id: `${record.completionId}:family-event`, year: record.year, title: `가족 사건 · ${familyEvent.title}`, narrative: familyEvent.summary, sourceRuleId: 'WINTER-FAMILY-001', sourcePage: 'Ch.10 p.180' };
  if (familyEvent.effect) {
    const applied = applyOutcome(character, winter, eventOutcome(familyEvent.summary, { mandatoryEffect: familyEvent.effect }), rng, context);
    record.stateChanges.push(...applied.stateChanges);
  }
  if (familyEvent.glory) {
    const before = Number(character.gear?.gloryThisGame || 0);
    recordGloryAward(character, { ...context, amount: familyEvent.glory, id: `${context.id}:glory` });
    record.stateChanges.push({ path: 'gear.gloryThisGame', before, after: character.gear.gloryThisGame });
    record.glory = Number(record.glory || 0) + familyEvent.glory;
  }
  if ([1, 2].includes(familyEvent.roll) || familyEvent.lifecycleEffect === 'target_death') {
    if (target) {
      target.status = '사망';
      target.deathCause = familyEvent.title;
      target.lifeYears = `${String(target.lifeYears || '').split('~')[0]}~${record.year}`;
    } else unresolved.push({ type: 'family_target_required', label: `${familyEvent.title}: 사망할 가문원을 선택하거나 새 대상 기록` });
  }
  if (familyEvent.familyEffect === 'captive') {
    if (target) target.status = '포로'; else unresolved.push({ type: 'family_target_required', label: '투옥된 가문원 선택' });
  }
  if (familyEvent.familyEffect === 'missing') {
    if (target) target.status = '실종'; else unresolved.push({ type: 'family_target_required', label: '실종된 가문원 선택' });
  }
  if (familyEvent.familyEffect === 'start_feud') winter.flags.familyFeud = true;
  if (familyEvent.familyEffect === 'ward') {
    const birthYear = Number(target?.birthYear || String(target?.lifeYears || '').split('~')[0]);
    character.family.wards = Array.isArray(character.family.wards) ? character.family.wards : [];
    character.family.wards.push({
      id: `${record.completionId}:ward`,
      memberId: target?.id || null,
      memberName: target?.name || '미지정 미성년 친족',
      annualIncome: 1,
      startYear: record.year + 1,
      endYear: Number.isFinite(birthYear) ? birthYear + 15 : null,
      sourceRuleId: 'WINTER-FAMILY-001'
    });
    if (!Number.isFinite(birthYear)) unresolved.push({ type: 'ward_age_required', label: '후견 종료 연도를 계산할 미성년 친족의 출생 연도 기록' });
  }
  if (familyEvent.roll === 19) {
    record.stateChanges.push(addCheck(character, 'passions', 'honor'));
    record.stateChanges.push(addCheck(character, 'passions', 'loveFamily'));
  }
  if (familyEvent.choice) unresolved.push({ type: 'family_event_effect_choice', label: `${familyEvent.title}: ${familyEvent.summary}`, choices: familyEvent.choice });
  if (familyEvent.unresolved) unresolved.push({ type: familyEvent.unresolved, label: `${familyEvent.title}: ${familyEvent.summary}` });
  if (familyEvent.familyEffect === 'new_bastard_child') unresolved.push({ type: 'new_bastard_child', label: '사생아의 이름, 부모와 성별을 정해 가계도에 추가' });
  appendFamilyTimeline(character, {
    id: `${record.completionId}:event`, year: record.year, type: familyEvent.lifecycleEffect === 'target_death' ? 'death' : familyEvent.familyEffect || 'family', memberId: target?.id || null,
    title: familyEvent.title, narrative: `${familyEvent.summary}${target ? ` 대상: ${target.name}.` : ''}`, sourceRuleId: 'WINTER-FAMILY-001', sourcePage: 'Ch.10 p.180'
  });
  return unresolved;
};

const resolveFamily = (character, winter, record, input, rng) => {
  character.family = character.family || {};
  character.family.members = Array.isArray(character.family.members) ? character.family.members : [];
  const previous = winter.records.family;
  const resumingEventChoice = previous?.status === 'awaiting_event_choice';
  const marriage = resumingEventChoice ? previous.result?.marriage : resolveMarriage(character, winter, record, input, rng);
  const childbirths = resumingEventChoice ? (previous.result?.childbirths || []) : resolveChildbirths(character, record, input, rng);
  if (resumingEventChoice) record.stateChanges = [...(previous.stateChanges || [])];
  const familyEventRoll = resumingEventChoice ? Number(previous.roll?.familyEvent || 20) : Number(input.familyEventRoll || rollDie(20, rng));
  if (familyEventRoll === 20 && !(Number(input.eventChoice) >= 1 && Number(input.eventChoice) <= 19)) {
    const births = childbirths.reduce((sum, item) => sum + item.children.length, 0);
    record.roll = { marriage: marriage?.roll, familyEvent: 20, selectedEvent: 20, childbirths: childbirths.map(item => ({ roll: item.roll, adjustedRoll: item.adjustedRoll })) };
    record.result = { status: 'awaiting_event_choice', marriage, childbirths };
    record.unresolvedChoice = { type: 'family_event_choice', label: 'Table 10-12의 1-19번 가족 사건 중 하나 선택' };
    record.journalEntry = [marriage?.status === 'married' ? `${marriage.spouse.name}와 혼인` : '', births ? `자녀 ${births}명 탄생` : '', 'Table 10-12 결과 20: 플레이어가 가족 사건 하나를 선택해야 합니다.'].filter(Boolean).join('. ');
    record.isMeaningful = marriage?.status === 'married' || births > 0;
    record.chronicleType = marriage?.status === 'married' ? 'marriage' : 'family';
    record.chronicleTitle = marriage?.status === 'married' ? '혼인과 가문의 겨울' : '새 세대의 탄생';
    record.status = 'awaiting_event_choice';
    return;
  }
  const eventNumber = familyEventRoll === 20 && Number(input.eventChoice) >= 1 && Number(input.eventChoice) <= 19 ? Number(input.eventChoice) : familyEventRoll;
  const familyEvent = { ...FAMILY_EVENT_TABLE[eventNumber], roll: eventNumber };
  const relationRoll = Number(input.relationRoll || rollDie(20, rng));
  const sexRoll = Number(input.sexRoll || rollDie(6, rng));
  const relation = resolveFamilyRelation({ relationRoll, sexRoll, members: character.family.members });
  record.roll = { marriage: marriage.roll, familyEvent: familyEventRoll, selectedEvent: eventNumber, relation: relationRoll, sex: sexRoll, childbirths: childbirths.map(item => ({ roll: item.roll, adjustedRoll: item.adjustedRoll })) };
  record.result = { marriage, childbirths, familyEvent, relation };
  const unresolved = [];
  if (relation.unresolvedChoice) unresolved.push(relation.unresolvedChoice);
  unresolved.push(...applyFamilyEvent(character, winter, record, familyEvent, relation, rng));
  if (unresolved.length) {
    record.unresolvedChoice = unresolved;
    record.status = 'awaiting_choice';
  }
  const births = childbirths.reduce((sum, item) => sum + item.children.length, 0);
  const parts = [marriage.status === 'married' ? `${marriage.spouse.name}와 혼인` : marriage.status === 'candidate_met' ? '혼인 후보와 만남' : '', births ? `자녀 ${births}명 탄생` : '', `${familyEvent.title}: ${familyEvent.summary}`].filter(Boolean);
  record.journalEntry = parts.join('. ');
  record.isMeaningful = true;
  record.chronicleType = marriage.status === 'married' ? 'marriage' : births ? 'family' : familyEvent.lifecycleEffect === 'target_death' ? 'death' : 'family';
  record.chronicleTitle = marriage.status === 'married' ? '혼인과 가문의 겨울' : births ? '새 세대의 탄생' : familyEvent.title;
};

const resolveExperience = (character, _winter, record, _input, rng) => {
  const categories = [
    ['skills', 'skillsChecked'],
    ['passions', 'passionsChecked'],
    ['standings', 'standingsChecked']
  ];
  const results = [];
  categories.forEach(([valuesKey, checkedKey]) => {
    const resolved = resolveExperienceChecks({ values: character[valuesKey] || {}, checked: character[checkedKey] || {}, rng });
    character[valuesKey] = resolved.values;
    character[checkedKey] = {};
    resolved.results.forEach(item => results.push({ group: valuesKey, ...item }));
  });
  const traitResult = resolveTraitExperienceChecks({ traits: character.traits || {}, checked: character.traitsChecked || {}, rng });
  Object.entries(traitResult.values).forEach(([key, value]) => {
    if (value !== character.traits[key]) character.traits = adjustOpposedTrait(character.traits, key, value - character.traits[key]);
  });
  character.traitsChecked = {};
  traitResult.results.forEach(item => results.push({ group: 'traits', ...item }));

  const squireResults = [];
  ['firstAid', 'horsemanship', 'weapon'].forEach(key => {
    const value = Number(character.squire?.[key] || 0);
    const roll = rollDie(20, rng);
    const success = roll >= Math.min(20, value);
    if (success) character.squire[key] = value + 1;
    squireResults.push({ key, value, roll, success, nextValue: character.squire[key] });
  });
  record.roll = [...results.map(item => ({ group: item.group, key: item.key, roll: item.roll })), ...squireResults.map(item => ({ group: 'squire', key: item.key, roll: item.roll }))];
  record.result = { checks: results, squireChecks: squireResults };
  record.stateChanges = [...results.filter(item => item.success).map(item => ({ path: `${item.group}.${item.key}`, before: item.value, after: item.nextValue })), ...squireResults.filter(item => item.success).map(item => ({ path: `squire.${item.key}`, before: item.value, after: item.nextValue }))];
  record.journalEntry = `경험 체크 ${results.length + squireResults.length}건을 판정해 ${record.stateChanges.length}개 수치가 성장했습니다. 동일 수치는 한 번만 판정했습니다.`;
};

const ORDINARY_SKILLS = new Set(['awareness', 'chirurgery', 'faerieLore', 'firstAid', 'folkLore', 'horsemanship', 'hunting', 'industry', 'recognize', 'religion', 'stewardship', 'swimming']);
const COURTLY_SKILLS = new Set(['courtesy', 'dancing', 'eloquence', 'falconry', 'gaming', 'heraldry', 'intrigue', 'languages', 'playInstruments', 'readingWriting', 'romance', 'singing']);
const COMBAT_SKILLS = new Set(['battle', 'siege', 'axe', 'bludgeon', 'dagger', 'spear', 'sword', 'unarmed', 'lance', 'bow', 'crossbow', 'thrownWeapon']);

const resolveTraining = (character, winter, record, input) => {
  if (winter.flags.skipTraining) {
    record.result = { skippedByEvent: true };
    record.journalEntry = '개인 사건의 의무 효과로 올해 훈련과 실습을 건너뜁니다.';
    return;
  }
  const option = input.option;
  const context = { id: `${record.completionId}:training`, year: record.year, title: '겨울 훈련', narrative: '훈련과 실습으로 지위가 변화했습니다.', sourceRuleId: 'WINTER-TRAIN-001', sourcePage: 'Ch.10 p.181' };
  if (option === 'score') {
    const group = input.group;
    const key = input.key;
    const amount = Number(input.amount || 1);
    if (!['attributes', 'traits', 'passions', 'standings'].includes(group) || !key || ![-1, 1].includes(amount)) throw new RangeError('Invalid score training choice.');
    const current = Number(character[group]?.[key] || 0);
    if (amount > 0 && ['traits', 'passions', 'standings'].includes(group) && current >= 15) throw new RangeError('Traits, passions and standings cannot be trained over 15.');
    if (amount > 0 && group === 'attributes' && (current >= 20 || character.personal?.age > 30 || (key === 'siz' && character.personal?.age > 21))) throw new RangeError('Attribute training age or maximum restriction applies.');
    record.stateChanges.push(applyScore(character, group, key, amount, context));
  } else if (option === 'skills15') {
    const selections = input.selections || {};
    const selected = [selections.ordinary, selections.courtly, selections.combat, selections.free];
    if (selected.some(value => !value) || new Set(selected).size !== 4) throw new RangeError('Four distinct skill categories are required.');
    if (!ORDINARY_SKILLS.has(selections.ordinary) || !COURTLY_SKILLS.has(selections.courtly) || !COMBAT_SKILLS.has(selections.combat)) throw new RangeError('Skill category mismatch.');
    selected.forEach(key => {
      const current = Number(character.skills?.[key] || 0);
      if (current <= 0 || current >= 15) throw new RangeError('Selected skills must start above 0 and remain at or below 15.');
      record.stateChanges.push(applyScore(character, 'skills', key, 1, context));
    });
  } else if (option === 'skill20') {
    const key = input.key;
    const current = Number(character.skills?.[key] || 0);
    if (!key || current <= 15 || current >= 20) throw new RangeError('One skill from 16 through 19 is required.');
    record.stateChanges.push(applyScore(character, 'skills', key, 1, context));
  } else {
    throw new RangeError('One printed training option is required.');
  }
  record.result = { option, changes: record.stateChanges };
  record.journalEntry = `훈련 방식 ${option}을 선택해 ${record.stateChanges.map(change => change.path).join(', ')}을 조정했습니다.`;
};

const qualifiesIdeal = (character, keys, passionKey) => keys.reduce((sum, key) => sum + Number(character.traits?.[key] || 0), 0) >= 90 && Number(character.passions?.[passionKey] || 0) >= 16;

export const computeAnnualGlory = character => {
  const entries = [];
  const play = Number(character.gear?.gloryThisGame || 0);
  if (play) entries.push({ source: 'play', label: '플레이와 사건', amount: play });
  const manors = getManorCount(character);
  if (manors) entries.push({ source: 'holdings', label: `장원 ${manors}곳`, amount: Math.min(100, manors * 6) });
  const grade = MAINTENANCE_GRADES[character.personal?.maintenance] || MAINTENANCE_GRADES.ordinary;
  if (grade.annualGlory) entries.push({ source: 'maintenance', label: grade.label, amount: grade.annualGlory });
  const amorKey = Object.keys(character.passions || {}).find(key => key === 'amor' || key.startsWith('amor'));
  const ideals = [
    ['Chivalrous', ['energetic', 'generous', 'just', 'merciful', 'modest', 'valorous'], 'honor'],
    ['Religious', ['chaste', 'forgiving', 'merciful', 'modest', 'temperate', 'trusting'], 'loveGod'],
    ['Romantic', ['forgiving', 'generous', 'honest', 'just', 'prudent', 'trusting'], amorKey]
  ];
  ideals.forEach(([label, traits, passion]) => {
    if (passion && qualifiesIdeal(character, traits, passion)) entries.push({ source: 'ideal', label, amount: 100 });
  });
  ['attributes', 'skills', 'traits', 'passions', 'standings'].forEach(group => {
    Object.entries(character[group] || {}).forEach(([key, value]) => {
      if (key !== 'currentHp' && Number(value) > 15) entries.push({ source: 'notable_stat', label: `${group}.${key}`, amount: Number(value) });
    });
  });
  const enchanted = Number(character.gear?.annualItemGlory || 0);
  if (enchanted) entries.push({ source: 'enchanted_item', label: '마법 물품과 말', amount: enchanted });
  return { entries, total: entries.reduce((sum, entry) => sum + entry.amount, 0) };
};

const resolveGlory = (character, winter, record) => {
  const calculation = computeAnnualGlory(character);
  const before = Number(character.gear?.gloryTotal || 0);
  const after = before + calculation.total;
  character.gear.gloryTotal = after;
  character.gear.gloryThisGame = 0;
  const claimedThreshold = Math.max(0, Number(character.campaign?.gloryBonusClaimedThreshold || 0));
  const currentThreshold = Math.floor(after / 1000);
  const bonus = currentThreshold - claimedThreshold;
  winter.gloryBonusPoints = Math.max(0, bonus);
  winter.bonusSpent = 0;
  postAnnualGlory(character, { year: record.year, entries: calculation.entries, total: calculation.total, previousTotal: before, newTotal: after, sourceRuleId: 'WINTER-GLORY-001', sourcePage: 'Ch.10 pp.181-182; Ch.4 p.90' });
  record.result = { ...calculation, previousTotal: before, newTotal: after, claimedThreshold, currentThreshold, bonusPoints: bonus };
  record.stateChanges = [{ path: 'gear.gloryTotal', before, after }, { path: 'gear.gloryThisGame', before: calculation.entries.find(entry => entry.source === 'play')?.amount || 0, after: 0 }];
  record.glory = calculation.total;
  record.journalEntry = `플레이와 연간 원천 ${calculation.entries.length}건에서 영광 ${calculation.total}점을 더해 누적 ${after}점이 되었습니다. 보너스 ${Math.max(0, bonus)}점.`;
  record.isMeaningful = bonus > 0;
  record.chronicleType = 'glory';
  record.chronicleTitle = `${currentThreshold * 1000} 영광의 경지`;
};

const resolveGloryBonus = (character, winter, record, input) => {
  const available = Number(winter.gloryBonusPoints || 0) - Number(winter.bonusSpent || 0);
  if (available <= 0) {
    record.result = { available: 0, spent: 0 };
    record.journalEntry = '새로 넘은 1,000점 영광 경계가 없어 보너스 배분이 없습니다.';
    return;
  }
  const allocations = Array.isArray(input.allocations) ? input.allocations : [];
  if (allocations.length !== available) throw new RangeError(`All ${available} Glory bonus points must be spent immediately.`);
  allocations.forEach(({ group, key }) => {
    if (!['attributes', 'traits', 'passions', 'standings', 'skills'].includes(group) || !key || character[group]?.[key] === undefined) throw new RangeError('Invalid Glory bonus allocation.');
    record.stateChanges.push(applyScore(character, group, key, 1, { id: `${record.completionId}:${group}:${key}`, year: record.year, title: '영광 보너스', narrative: '1,000 영광 경계를 넘어 보너스를 배분했습니다.', sourceRuleId: 'GLORY-BONUS-001', sourcePage: 'Ch.10 p.181; Ch.4 pp.90-91' }));
  });
  winter.bonusSpent += allocations.length;
  character.campaign.gloryBonusClaimedThreshold = Math.floor(Number(character.gear?.gloryTotal || 0) / 1000);
  record.result = { available, spent: allocations.length, allocations };
  record.journalEntry = `영광 보너스 ${allocations.length}점을 즉시 배분했습니다: ${allocations.map(item => `${item.group}.${item.key}`).join(', ')}.`;
};

const STEP_RESOLVERS = {
  soloScenario: resolveSolo,
  aging: resolveAging,
  economy: resolveEconomy,
  survival: resolveSurvival,
  personalEvent: resolvePersonalEvent,
  family: resolveFamily,
  experience: resolveExperience,
  training: resolveTraining,
  glory: resolveGlory,
  gloryBonus: resolveGloryBonus
};

export const resolveWinterStep = (rawCharacter, { stepId, input = {} }, rng = Math.random) => {
  const character = clone(rawCharacter);
  character.campaign = character.campaign || {};
  let winter = ensureWinterState(character);
  character.campaign.winter = winter;
  const step = WINTER_STEPS.find(item => item.id === stepId);
  if (!step) throw new RangeError('Unknown Winter step.');
  const completionId = `winter:${winter.year}:${stepId}`;
  if (isApplied(character, completionId)) return { character: rawCharacter, record: winter.records[stepId], applied: false };
  const earliest = nextPendingStep(winter);
  const existingAwaitingChoice = winter.steps[stepId] === 'awaiting_choice';
  if (earliest !== stepId && !existingAwaitingChoice) throw new RangeError(`Winter steps must remain in printed order. Expected ${earliest}.`);

  const record = createRecord(step, winter.year, input);
  STEP_RESOLVERS[stepId](character, winter, record, input, rng);
  const awaiting = record.status === 'awaiting_choice' || record.status === 'awaiting_event_choice' || record.unresolvedChoice;
  if (awaiting) {
    record.status = record.status || 'awaiting_choice';
    winter.steps[stepId] = 'awaiting_choice';
    winter.records[stepId] = record;
    winter.unresolved[stepId] = { label: Array.isArray(record.unresolvedChoice) ? record.unresolvedChoice.map(item => item.label).join('; ') : record.unresolvedChoice?.label, required: true, ruleId: step.ruleId };
    winter.currentStep = stepId;
    character.campaign.winter = winter;
    return { character, record, applied: true, awaitingChoice: true };
  }

  record.status = 'resolved';
  winter.steps[stepId] = 'resolved';
  winter.records[stepId] = record;
  winter.transactions.push(record);
  winter.logs.push(record.journalEntry);
  winter.currentStep = nextPendingStep(winter);
  delete winter.unresolved[stepId];
  markApplied(character, completionId, `${step.number}단계 ${step.label}`);
  pushChronicle(character, record);
  character.campaign.winter = winter;
  return { character, record, applied: true, awaitingChoice: false };
};

export const recordManualWinterResolution = (rawCharacter, { stepId, note }) => {
  if (!String(note || '').trim()) throw new RangeError('A manual resolution note is required.');
  const character = clone(rawCharacter);
  const winter = ensureWinterState(character);
  const record = winter.records[stepId];
  const step = WINTER_STEPS.find(item => item.id === stepId);
  if (!record || winter.steps[stepId] !== 'awaiting_choice') throw new RangeError('No unresolved choice exists for this Winter step.');
  record.status = 'resolved_manual';
  record.manualResolution = { note: String(note).trim(), recordedAt: new Date().toISOString(), gmOverride: true };
  record.journalEntry = `${record.journalEntry} 수동 판정 기록: ${record.manualResolution.note}`;
  winter.steps[stepId] = 'resolved';
  winter.transactions.push(record);
  winter.logs.push(record.journalEntry);
  winter.currentStep = nextPendingStep(winter);
  delete winter.unresolved[stepId];
  character.campaign.winter = winter;
  markApplied(character, record.completionId, `${step.number}단계 ${step.label} 수동 판정`);
  pushChronicle(character, record);
  return { character, record, applied: true };
};

export const closeWinterYear = rawCharacter => {
  const character = clone(rawCharacter);
  const winter = ensureWinterState(character);
  const incomplete = WINTER_STEPS.filter(step => winter.steps[step.id] !== 'resolved');
  if (incomplete.length) throw new RangeError(`Winter cannot close with incomplete steps: ${incomplete.map(step => step.id).join(', ')}`);
  if (winter.gloryBonusPoints !== winter.bonusSpent) throw new RangeError('Glory bonus points must be spent immediately.');
  const year = winter.year;
  const completionId = `winter:${year}:closed`;
  if (isApplied(character, completionId)) return { character: rawCharacter, applied: false };
  const meaningful = winter.transactions.filter(transaction => transaction.isMeaningful);
  const summary = `${year}년 겨울 정산 완료. ${winter.transactions.length}개 규칙 거래 중 연대기 사건 ${meaningful.length}건을 봉인했습니다.`;
  character.personal.campaignYear = year + 1;
  character.campaign.winterHistory = [...(character.campaign.winterHistory || []), { ...winter, closedAt: new Date().toISOString(), summary }].slice(-50);
  character.campaign.winter = createEmptyWinter(year + 1);
  markApplied(character, completionId, summary);
  return { character, applied: true, summary };
};

export const getTrainingSkillGroups = () => ({
  ordinary: [...ORDINARY_SKILLS],
  courtly: [...COURTLY_SKILLS],
  combat: [...COMBAT_SKILLS]
});

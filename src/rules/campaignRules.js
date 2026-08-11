import { resolveD20Roll } from './coreRules.js';

export const CHRONOLOGY_HARVEST_MODIFIERS = Object.freeze({
  768: 0, 769: 0, 770: 0, 771: -2, 772: 0, 773: 0, 774: 0, 775: 5, 776: 0, 777: 0, 778: 0,
  779: -7, 780: 0, 781: 0, 782: 0, 783: 0, 784: 0, 785: 0, 786: 0, 787: 0, 788: 0, 789: 0,
  790: 0, 791: 0, 792: -15, 793: 0, 794: 0, 795: 0, 796: 0, 797: 0, 798: 0, 799: 0, 800: 0,
  801: 0, 802: 0, 803: 0, 804: 0, 805: -10, 806: 0, 807: -5, 808: 0, 809: -5, 810: -5,
  811: 0, 812: 0, 813: 0
});

export const getChronologyHarvestModifier = year => CHRONOLOGY_HARVEST_MODIFIERS[Number(year)] ?? 0;

export const getCampaignPhase = (year) => {
  const value = Number(year);
  if (value >= 801 && value <= 814) return { key: 'phase4', number: 4, start: 801, end: 814, harvestModifier: getChronologyHarvestModifier(value) };
  if (value >= 790 && value <= 800) return { key: 'phase3', number: 3, start: 790, end: 800, harvestModifier: getChronologyHarvestModifier(value) };
  if (value >= 779 && value <= 789) return { key: 'phase2', number: 2, start: 779, end: 789, harvestModifier: getChronologyHarvestModifier(value) };
  if (value >= 768 && value <= 778) return { key: 'phase1', number: 1, start: 768, end: 778, harvestModifier: getChronologyHarvestModifier(value) };
  if (value >= 742 && value <= 767) return { key: 'phase0', number: 0, start: 742, end: 767, harvestModifier: 0 };
  return null;
};

export const getLineageEra = (year) => {
  const value = Number(year);
  if (value >= 723 && value <= 744) return 'grandfather';
  if (value >= 745 && value <= 766) return 'father';
  if (value >= 767) return 'player';
  return null;
};

export const resolveMaleAncestorDeathCause = (roll) => {
  const value = Math.min(20, Math.max(1, Math.trunc(Number(roll) || 1)));
  if (value <= 3) return '전투 중 전사 (Killed in Battle)';
  if (value <= 6) return '가문 간 불화 (Family Feud)';
  if (value <= 8) return '적의 습격 (Enemy Raid)';
  if (value <= 10) return '사냥 사고 (Hunting Accident)';
  if (value <= 13) return '사고사 (Accident)';
  if (value === 14) return '실종 (Disappeared)';
  if (value <= 18) return '질병 (Illness)';
  return '노환 (Old Age)';
};

export const getSuccessorEligibility = ({ birthYear, currentYear }) => {
  if (birthYear === '' || birthYear === null || birthYear === undefined) {
    return { eligible: false, age: null, reason: 'unknown_age' };
  }
  const parsedBirthYear = Number(birthYear);
  const parsedCurrentYear = Number(currentYear);
  if (!Number.isFinite(parsedBirthYear) || !Number.isFinite(parsedCurrentYear)) {
    return { eligible: false, age: null, reason: 'unknown_age' };
  }
  const age = parsedCurrentYear - parsedBirthYear;
  return { eligible: age >= 15, age, reason: age >= 15 ? 'eligible' : 'underage' };
};

export const getAgingRollCount = (roll) => {
  const value = Math.min(20, Math.max(1, Math.trunc(Number(roll) || 1)));
  if (value === 1) return 5;
  if (value <= 3) return 4;
  if (value <= 6) return 3;
  if (value <= 10) return 2;
  if (value <= 15) return 1;
  return 0;
};

export const getAttributeCareerStatus = (attributes = {}) => {
  const values = ['siz', 'dex', 'str', 'con', 'app'].map(key => Number(attributes[key]));
  if (values.some(value => Number.isFinite(value) && value <= 0)) return 'deceased';
  if (values.some(value => Number.isFinite(value) && value <= 3)) return 'bedridden';
  return 'active';
};

export const getHarvestModifier = ({ year, standings = {}, prosperity = false, situationalModifier = 0 }) => {
  let modifier = prosperity ? 3 : 0;
  if (Number(standings.commoners) >= 16) modifier += 5;
  else if (Number(standings.commoners) <= 4) modifier -= 5;
  if (Number(standings.retinue) >= 16) modifier += 5;
  else if (Number(standings.retinue) <= 4) modifier -= 5;
  modifier += getChronologyHarvestModifier(year);
  modifier += Number(situationalModifier) || 0;
  return modifier;
};

export const resolveHarvest = ({ roll, stewardship, modifier = 0, manors = 1 }) => {
  const check = resolveD20Roll(roll, Number(stewardship) + Number(modifier));
  const incomePerManor = check.critical ? 9 : check.success ? 6 : check.fumble ? 3 : 5;
  return {
    ...check,
    modifier,
    incomePerManor,
    income: incomePerManor * Math.max(0, Number(manors) || 0),
    multiplier: check.critical ? 1.5 : check.success ? 1 : check.fumble ? 0.5 : 0.75
  };
};

export const rollDie = (sides, rng = Math.random) => Math.floor(rng() * sides) + 1;

export const rollDice = (count, sides = 6, rng = Math.random) => {
  let total = 0;
  for (let index = 0; index < count; index += 1) total += rollDie(sides, rng);
  return total;
};

export const roundPaladin = (value) => Math.floor(Number(value) + 0.5);

export const getCampaignPhase = (year) => {
  const value = Number(year);
  if (value >= 801 && value <= 814) return { key: 'phase4', number: 4, start: 801, end: 814, harvestModifier: 0 };
  if (value >= 790 && value <= 800) return { key: 'phase3', number: 3, start: 790, end: 800, harvestModifier: 1 };
  if (value >= 779 && value <= 789) return { key: 'phase2', number: 2, start: 779, end: 789, harvestModifier: 2 };
  if (value >= 768 && value <= 778) return { key: 'phase1', number: 1, start: 768, end: 778, harvestModifier: 1 };
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
  return {
    eligible: age >= 15,
    age,
    reason: age >= 15 ? 'eligible' : 'underage'
  };
};

export const resolveD20Roll = (rawRoll, rawTarget) => {
  const roll = Math.min(20, Math.max(1, Math.trunc(Number(rawRoll) || 1)));
  const target = Number.isFinite(Number(rawTarget)) ? Number(rawTarget) : 0;

  if (target > 20) {
    const effectiveRoll = roll + (target - 20);
    const critical = effectiveRoll >= 20;
    return {
      roll,
      target,
      effectiveRoll,
      critical,
      success: true,
      fumble: false,
      outcome: critical ? 'critical' : 'success'
    };
  }

  if (target <= 0) {
    const fumbleThreshold = Math.max(1, 20 + target);
    const fumble = roll >= fumbleThreshold;
    return {
      roll,
      target,
      effectiveRoll: roll,
      fumbleThreshold,
      critical: false,
      success: false,
      fumble,
      outcome: fumble ? 'fumble' : 'failure'
    };
  }

  const critical = roll === target;
  const fumble = roll === 20 && target < 20;
  const success = critical || (!fumble && roll < target);
  return {
    roll,
    target,
    effectiveRoll: roll,
    critical,
    success,
    fumble,
    outcome: critical ? 'critical' : fumble ? 'fumble' : success ? 'success' : 'failure'
  };
};

export const compareOpposedD20 = (actor, opponent) => {
  if (actor.critical || opponent.critical) {
    if (actor.critical && opponent.critical) return 'tie';
    return actor.critical ? 'actor' : 'opponent';
  }
  if (actor.success || opponent.success) {
    if (!actor.success) return 'opponent';
    if (!opponent.success) return 'actor';
    if (actor.effectiveRoll === opponent.effectiveRoll) return 'tie';
    return actor.effectiveRoll > opponent.effectiveRoll ? 'actor' : 'opponent';
  }
  return 'bothFail';
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
  if (values.some(value => Number.isFinite(value) && value <= 3)) return 'incapacitated';
  return 'active';
};

export const getHarvestModifier = ({ year, standings = {}, prosperity = false, situationalModifier = 0 }) => {
  let modifier = prosperity ? 3 : 0;
  if (Number(standings.commoners) >= 16) modifier += 5;
  else if (Number(standings.commoners) <= 4) modifier -= 5;
  if (Number(standings.retinue) >= 16) modifier += 5;
  else if (Number(standings.retinue) <= 4) modifier -= 5;
  modifier += getCampaignPhase(year)?.harvestModifier || 0;
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

export const deriveStartingPassions = ({ traits, sonNumber, loveCharlemagneRoll, loveFamilyRoll = rollDie(6) }) => {
  const religious = ['chaste', 'forgiving', 'merciful', 'modest', 'temperate', 'trusting'];
  return {
    honor: roundPaladin(((traits.generous || 0) + (traits.just || 0) + (traits.valorous || 0)) / 3),
    loveCharlemagne: Number(loveCharlemagneRoll),
    loveFamily: Number(loveFamilyRoll) + 10 - Number(sonNumber || 1),
    loveGod: Math.min(...religious.map(key => Number(traits[key]) || 0))
  };
};

export const deriveStartingStandings = ({ traits, passions }) => ({
  charlemagne: Math.min(
    traits.energetic || 0,
    traits.generous || 0,
    traits.just || 0,
    traits.merciful || 0,
    traits.modest || 0,
    traits.valorous || 0
  ),
  liegeLord: traits.valorous || 0,
  family: passions.honor || 0,
  retinue: traits.generous || 0,
  church: passions.loveGod || 0,
  commoners: traits.merciful || 0
});

const FRANKISH_TRAIT_PAIRS = [
  ['chaste', 'lustful'],
  ['energetic', 'lazy'],
  ['forgiving', 'vengeful'],
  ['generous', 'selfish'],
  ['honest', 'deceitful'],
  ['just', 'arbitrary'],
  ['merciful', 'cruel'],
  ['modest', 'proud'],
  ['prudent', 'reckless'],
  ['temperate', 'indulgent'],
  ['trusting', 'suspicious'],
  ['valorous', 'cowardly']
];

const setTrait = (traits, virtue, value) => {
  const pair = FRANKISH_TRAIT_PAIRS.find(([left]) => left === virtue);
  if (!pair) return;
  traits[virtue] = Math.max(0, Number(value) || 0);
  traits[pair[1]] = Math.max(0, 20 - traits[virtue]);
};

export const createFrankishArdennesTraits = (rng = Math.random) => {
  const traits = {};
  FRANKISH_TRAIT_PAIRS.forEach(([virtue]) => setTrait(traits, virtue, rollDice(2, 6, rng) + 3));

  ['energetic', 'generous', 'valorous'].forEach(key => setTrait(traits, key, traits[key] + rollDie(3, rng)));
  ['chaste', 'forgiving', 'merciful', 'modest', 'temperate', 'trusting'].forEach(key => setTrait(traits, key, traits[key] + 1));
  setTrait(traits, 'temperate', traits.temperate + rollDie(3, rng));
  setTrait(traits, 'modest', traits.modest + rollDie(3, rng));
  setTrait(traits, 'trusting', traits.trusting - rollDie(3, rng));
  return traits;
};

export const createFrankishMaleBaseSkills = ({ dex, rng = Math.random }) => {
  const d6 = () => rollDie(6, rng);
  const twoD6 = () => d6() + d6();
  const halfDex = roundPaladin(Number(dex) / 2);
  return {
    awareness: d6() + 3,
    chirurgery: 0,
    faerieLore: 1,
    firstAid: twoD6() + 3,
    folkLore: d6(),
    horsemanship: twoD6() + 3,
    hunting: twoD6() + 3,
    industry: 0,
    recognize: d6(),
    religion: d6(),
    stewardship: d6(),
    swimming: twoD6(),
    courtesy: d6() + 3,
    dancing: d6(),
    eloquence: d6(),
    falconry: d6(),
    gaming: d6(),
    heraldry: d6(),
    intrigue: d6(),
    languages: 1,
    playInstruments: d6(),
    readingWriting: 0,
    romance: d6(),
    singing: d6(),
    battle: twoD6() + 3,
    siege: d6() + 3,
    axe: twoD6(),
    bludgeon: twoD6(),
    dagger: twoD6(),
    spear: twoD6(),
    sword: twoD6() + 3,
    unarmed: halfDex,
    lance: d6() + 3,
    bow: halfDex,
    crossbow: halfDex,
    thrownWeapon: halfDex
  };
};

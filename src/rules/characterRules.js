import { rollD3, rollDice, rollDie, roundPaladin } from './coreRules.js';
import { RELIGIOUS_TRAITS, TRAIT_PAIRS, adjustOpposedTrait, setOpposedTraitValue } from './personalityRules.js';

export const deriveStartingPassions = ({ traits, sonNumber, loveCharlemagneRoll, loveFamilyRoll = rollDie(6) }) => ({
  honor: roundPaladin(((traits.generous || 0) + (traits.just || 0) + (traits.valorous || 0)) / 3),
  loveCharlemagne: Number(loveCharlemagneRoll),
  loveFamily: Number(loveFamilyRoll) + 10 - Number(sonNumber || 1),
  loveGod: Math.min(...RELIGIOUS_TRAITS.map(key => Number(traits[key]) || 0))
});

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

export const createFrankishArdennesTraits = (rng = Math.random) => {
  let traits = {};
  TRAIT_PAIRS.forEach(([virtue]) => {
    traits = setOpposedTraitValue(traits, virtue, rollDice(2, 6, rng) + 3);
  });
  ['energetic', 'generous', 'valorous'].forEach(key => {
    traits = adjustOpposedTrait(traits, key, rollD3(rng));
  });
  RELIGIOUS_TRAITS.forEach(key => {
    traits = adjustOpposedTrait(traits, key, 1);
  });
  traits = adjustOpposedTrait(traits, 'temperate', rollD3(rng));
  traits = adjustOpposedTrait(traits, 'modest', rollD3(rng));
  return adjustOpposedTrait(traits, 'trusting', -rollD3(rng));
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

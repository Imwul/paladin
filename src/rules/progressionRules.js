import { rollDie } from './coreRules.js';
import { TRAIT_KEYS } from './personalityRules.js';

const requireScore = (value) => {
  const score = Number(value);
  if (!Number.isFinite(score) || score < 0) throw new RangeError('experience score must be zero or greater.');
  return score;
};

export const getsAutomaticExperienceCheck = (value) => requireScore(value) >= 20;

export const resolveExperienceRoll = (roll, value) => {
  const score = requireScore(value);
  const parsedRoll = Number(roll);
  if (!Number.isInteger(parsedRoll) || parsedRoll < 1 || parsedRoll > 20) {
    throw new RangeError('experience roll must be an integer from 1 through 20.');
  }
  const target = Math.min(20, score);
  const success = parsedRoll >= target;
  return {
    roll: parsedRoll,
    value: score,
    target,
    automaticCheck: getsAutomaticExperienceCheck(score),
    success,
    nextValue: success ? score + 1 : score
  };
};

export const collectExperienceKeys = (values = {}, checked = {}) => (
  [...new Set([
    ...Object.keys(checked).filter(key => checked[key] === true),
    ...Object.keys(values).filter(key => getsAutomaticExperienceCheck(values[key]))
  ])]
);

export const resolveExperienceChecks = ({ values = {}, checked = {}, rng = Math.random }) => {
  const nextValues = { ...values };
  const results = collectExperienceKeys(values, checked).map(key => {
    const result = resolveExperienceRoll(rollDie(20, rng), values[key] || 0);
    nextValues[key] = result.nextValue;
    return { key, ...result };
  });
  return { values: nextValues, results };
};

export const resolveTraitExperienceChecks = ({ traits = {}, checked = {}, rng = Math.random }) => {
  const coreTraits = Object.fromEntries(TRAIT_KEYS.map(key => [key, traits[key] || 0]));
  const coreChecks = Object.fromEntries(TRAIT_KEYS.map(key => [key, checked[key] === true]));
  return resolveExperienceChecks({ values: coreTraits, checked: coreChecks, rng });
};

export const applyDeferredExperienceAdjustments = (experienceResult, adjustments = []) => ({
  ...experienceResult,
  nextValue: adjustments.reduce((value, adjustment) => value + Number(adjustment || 0), experienceResult.nextValue)
});

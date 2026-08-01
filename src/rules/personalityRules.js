export const TRAIT_PAIRS = [
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
export const TRAIT_KEYS = TRAIT_PAIRS.flat();

export const RELIGIOUS_TRAITS = ['chaste', 'forgiving', 'merciful', 'modest', 'temperate', 'trusting'];
export const CHIVALROUS_TRAITS = ['energetic', 'generous', 'just', 'merciful', 'modest', 'valorous'];
export const ROMANTIC_TRAITS = ['forgiving', 'generous', 'honest', 'just', 'prudent', 'trusting'];

const traitOpposites = new Map();
TRAIT_PAIRS.forEach(([left, right]) => {
  traitOpposites.set(left, right);
  traitOpposites.set(right, left);
});

const normalizeTraitScore = (value) => {
  const score = Number(value);
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.trunc(score));
};

export const getOpposedTrait = (trait) => traitOpposites.get(trait) || null;

export const setOpposedTraitValue = (traits, trait, value) => {
  const opposite = getOpposedTrait(trait);
  if (!opposite) return { ...traits };
  const score = normalizeTraitScore(value);
  return {
    ...traits,
    [trait]: score,
    [opposite]: score > 19 ? 0 : 20 - score
  };
};

export const adjustOpposedTrait = (traits, trait, amount, maximum = Number.MAX_SAFE_INTEGER) => {
  const current = normalizeTraitScore(traits?.[trait]);
  const next = Math.min(maximum, Math.max(0, current + Number(amount || 0)));
  return setOpposedTraitValue(traits, trait, next);
};

export const normalizeOpposedTraits = (traits = {}, defaults = {}) => {
  let normalized = { ...traits };
  TRAIT_PAIRS.forEach(([left, right]) => {
    const leftValue = normalizeTraitScore(normalized[left] ?? defaults[left] ?? 10);
    const rightValue = normalizeTraitScore(normalized[right] ?? defaults[right] ?? (20 - leftValue));
    if (rightValue > 19 && leftValue <= 19) {
      normalized = setOpposedTraitValue(normalized, right, rightValue);
    } else {
      normalized = setOpposedTraitValue(normalized, left, leftValue);
    }
  });
  return normalized;
};

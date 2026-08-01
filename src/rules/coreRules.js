const requireFiniteNumber = (value, label) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new TypeError(`${label} must be a finite number.`);
  return parsed;
};

const requirePositiveInteger = (value, label) => {
  const parsed = requireFiniteNumber(value, label);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new RangeError(`${label} must be a positive integer.`);
  }
  return parsed;
};

const requireD20Roll = (value) => {
  const roll = requireFiniteNumber(value, 'd20 roll');
  if (!Number.isInteger(roll) || roll < 1 || roll > 20) {
    throw new RangeError('d20 roll must be an integer from 1 through 20.');
  }
  return roll;
};

export const rollDie = (sides, rng = Math.random) => {
  const dieSides = requirePositiveInteger(sides, 'die sides');
  const randomValue = requireFiniteNumber(rng(), 'random value');
  if (randomValue < 0 || randomValue >= 1) {
    throw new RangeError('random value must be at least 0 and less than 1.');
  }
  return Math.floor(randomValue * dieSides) + 1;
};

export const rollDice = (count, sides = 6, rng = Math.random) => {
  const diceCount = requirePositiveInteger(count, 'dice count');
  let total = 0;
  for (let index = 0; index < diceCount; index += 1) total += rollDie(sides, rng);
  return total;
};

export const rollD3 = (rng = Math.random) => Math.ceil(rollDie(6, rng) / 2);

export const createSeededRng = (seed, startIndex = 0) => {
  let hash = 2166136261;
  for (const char of String(seed)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  let index = Math.max(0, Math.trunc(Number(startIndex) || 0));
  return () => {
    let value = (hash + Math.imul(index + 1, 0x9e3779b9)) >>> 0;
    index += 1;
    value ^= value >>> 16;
    value = Math.imul(value, 0x21f0aaad);
    value ^= value >>> 15;
    value = Math.imul(value, 0x735a2d97);
    value ^= value >>> 15;
    return (value >>> 0) / 4294967296;
  };
};

export const parseDiceNotation = (notation) => {
  const normalized = String(notation).trim().toLowerCase().replace(/\s+/g, '');
  const match = normalized.match(/^(\d*)d(\d+)([+-]\d+)?$/);
  if (!match) throw new TypeError(`Invalid dice notation: ${notation}`);

  return {
    notation: normalized,
    count: match[1] ? requirePositiveInteger(match[1], 'dice count') : 1,
    sides: requirePositiveInteger(match[2], 'die sides'),
    modifier: match[3] ? Number(match[3]) : 0
  };
};

export const rollDiceNotation = (notation, rng = Math.random) => {
  const parsed = parseDiceNotation(notation);
  const rawRolls = [];
  const rolls = [];

  for (let index = 0; index < parsed.count; index += 1) {
    const rawRoll = rollDie(parsed.sides === 3 ? 6 : parsed.sides, rng);
    rawRolls.push(rawRoll);
    rolls.push(parsed.sides === 3 ? Math.ceil(rawRoll / 2) : rawRoll);
  }

  const subtotal = rolls.reduce((total, roll) => total + roll, 0);
  return {
    ...parsed,
    rawRolls,
    rolls,
    subtotal,
    total: subtotal + parsed.modifier
  };
};

export const roundPaladin = (value) => Math.floor(requireFiniteNumber(value, 'value') + 0.5);

export const applyStatisticModifiers = (baseValue, modifiers = []) => {
  const modifierList = Array.isArray(modifiers) ? modifiers : [modifiers];
  return modifierList.reduce(
    (total, modifier) => total + requireFiniteNumber(modifier, 'modifier'),
    requireFiniteNumber(baseValue, 'base statistic')
  );
};

export const createReflexiveModifier = (modifier) => {
  const value = requireFiniteNumber(modifier, 'reflexive modifier');
  return { actor: value, opponent: -value };
};

export const resolveD20Roll = (rawRoll, rawTarget) => {
  const roll = requireD20Roll(rawRoll);
  const target = requireFiniteNumber(rawTarget, 'target');

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

export const resolveModifiedD20 = ({ roll, statistic, modifiers = [] }) => {
  const target = applyStatisticModifiers(statistic, modifiers);
  return { ...resolveD20Roll(roll, target), statistic: Number(statistic), modifiers };
};

export const resolveFeatRoll = (roll, statistic) => {
  const featTarget = roundPaladin(requireFiniteNumber(statistic, 'statistic') / 2);
  const check = resolveD20Roll(roll, featTarget);
  const success = check.success;
  return {
    ...check,
    featTarget,
    critical: success,
    success,
    fumble: !success,
    outcome: success ? 'critical' : 'fumble'
  };
};

export const resolveOpposedD20 = (actor, opponent) => {
  if (!actor?.success && !opponent?.success) {
    return { winner: 'bothFail', actorOutcome: 'failure', opponentOutcome: 'failure' };
  }
  if (actor?.success && !opponent?.success) {
    return { winner: 'actor', actorOutcome: 'win', opponentOutcome: 'failure' };
  }
  if (!actor?.success && opponent?.success) {
    return { winner: 'opponent', actorOutcome: 'failure', opponentOutcome: 'win' };
  }
  if (actor.effectiveRoll === opponent.effectiveRoll) {
    return { winner: 'tie', actorOutcome: 'tie', opponentOutcome: 'tie' };
  }
  if (actor.effectiveRoll > opponent.effectiveRoll) {
    return { winner: 'actor', actorOutcome: 'win', opponentOutcome: 'partial' };
  }
  return { winner: 'opponent', actorOutcome: 'partial', opponentOutcome: 'win' };
};

export const compareOpposedD20 = (actor, opponent) => resolveOpposedD20(actor, opponent).winner;

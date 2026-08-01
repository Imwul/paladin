import { resolveD20Roll, rollDice, roundPaladin } from './coreRules.js';

export const TRAVEL_DISTANCES = Object.freeze({
  royalRoad: Object.freeze({ cautious: 10, leisurely: 15, normal: 20, hurried: 30, forcedFactor: 3 }),
  tradeRoad: Object.freeze({ cautious: 10, leisurely: 15, normal: 20, hurried: 30, forcedFactor: 3 }),
  localRoad: Object.freeze({ cautious: 5, leisurely: 10, normal: 15, hurried: 25, forcedFactor: 3 }),
  path: Object.freeze({ cautious: 2, leisurely: 5, normal: 8, hurried: 12, forcedFactor: 2 }),
  track: Object.freeze({ cautious: 1, leisurely: 2, normal: 3, hurried: 4, forcedFactor: 1 })
});

export const TRAVEL_AWARENESS_MODIFIERS = Object.freeze({
  cautious: 10,
  leisurely: 5,
  normal: 0,
  hurried: -5,
  forcedMarch: -10
});

export const calculateMovementRate = ({ str, dex, creature = 'human', unencumbered = false, adjustment = 0 }) => {
  const divisor = creature === 'quadruped' ? 5 : 10;
  const base = roundPaladin((Number(str) + Number(dex)) / divisor);
  return base + (unencumbered ? 2 : 0) + Number(adjustment || 0);
};

export const getTravelDistance = (roadType, pace) => {
  const road = TRAVEL_DISTANCES[roadType];
  if (!road || !Object.hasOwn(road, pace)) throw new RangeError('Unknown road type or travel pace.');
  return road[pace];
};

export const resolveUnknownRoute = (huntingOutcome) => {
  const outcomes = {
    critical: { pace: 'normal', delayDays: 0, lost: false },
    success: { pace: 'leisurely', delayDays: 0, lost: false },
    failure: { pace: null, delayDays: 1, lost: false },
    fumble: { pace: null, delayDays: null, lost: true }
  };
  if (!outcomes[huntingOutcome]) throw new RangeError('Unknown Hunting outcome.');
  return outcomes[huntingOutcome];
};

export const resolveForcedMarch = ({ roll, con, movementRate, roadType, traveler = 'human', rng = Math.random }) => {
  const road = TRAVEL_DISTANCES[roadType];
  if (!road) throw new RangeError('Unknown road type.');
  const check = resolveD20Roll(roll, con);
  const attemptedDistance = road.hurried + (Number(movementRate) * road.forcedFactor);
  const completedDistance = check.success ? attemptedDistance : attemptedDistance / 2;
  return {
    ...check,
    roadType,
    attemptedDistance,
    distance: completedDistance,
    mustRest: !check.success,
    lamed: check.fumble && traveler === 'horse',
    damage: check.fumble && traveler === 'human' ? rollDice(2, 6, rng) : 0
  };
};

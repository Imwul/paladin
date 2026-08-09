import {
  resolveD20Roll,
  resolveOpposedD20,
  rollD3,
  rollDie,
  roundPaladin
} from './coreRules.js';
import { applyCharacterDamage, confirmHealthDeath, resolveFirstAid } from './combatRules.js';
import { appendChronicleEvent, appendFamilyTimeline, recordGloryAward } from './ledgerRules.js';
import { BATTLE_ENEMY_TABLES, lookupBattleEnemy } from './battleEnemyTables.js';
import { ensureEconomy, getMagicCombatEffects, recordEconomyTransfer } from './economyRules.js';

const clone = value => JSON.parse(JSON.stringify(value));
const asNumber = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const asInt = (value, fallback = 0) => Math.trunc(asNumber(value, fallback));
const clamp = (value, min, max, fallback = min) => Math.min(max, Math.max(min, asInt(value, fallback)));
const iso = value => typeof value === 'string' ? value : (value || new Date()).toISOString();
const safeId = value => String(value || '').replace(/[^a-z0-9:_-]/gi, '_');
const requirePhase = (state, phases) => {
  if (!state || state.status !== 'active' || !phases.includes(state.phase)) {
    throw new Error(`현재 단계(${state?.phase || '없음'})에서는 이 판정을 할 수 없습니다.`);
  }
};
const outcomeModifier = outcome => ({ critical: 5, success: 0, failure: -5, fumble: -10 }[outcome] ?? 0);
const outcomeMultiplier = outcome => ({ critical: 2, success: 1, partial: 1, failure: 0.5, fumble: 0.5, disengaged: 0.01 }[outcome] ?? 0);
const commanderMultiplier = outcome => ({ critical: 2, success: 1, failure: 0.5, fumble: 0 }[outcome] ?? 0);
const rollD6Total = (count, rng) => Array.from({ length: count }, () => rollDie(6, rng)).reduce((sum, value) => sum + value, 0);

export const BATTLE_PHASES = Object.freeze([
  'pre_battle', 'first_charge', 'melee', 'melee_action', 'follower_fate',
  'withdrawal', 'pursuit_decision', 'pursuit', 'aftermath', 'complete'
]);

export const SKIRMISH_PHASES = Object.freeze(['command', 'melee', 'followers', 'follower_fate', 'aftermath', 'complete']);

export const SIEGE_PHASES = Object.freeze(['health', 'tactic', 'morale', 'aftermath', 'complete']);

export const BATTLE_SCALE_GLORY = Object.freeze({ small: 15, medium: 30, large: 45, huge: 60 });

export const resolveCommandRoll = ({ roll, skill, modifiers = [] }) => {
  const target = asInt(skill) + modifiers.reduce((sum, value) => sum + asInt(value), 0);
  const check = resolveD20Roll(roll, target);
  return { ...check, modifier: outcomeModifier(check.outcome) };
};

export const calculateBattleSituationModifier = ({ playerArmySize, enemyArmySize, ownHomeland, enemyHomeland }) => {
  const own = Math.max(1, asInt(playerArmySize, 1));
  const enemy = Math.max(1, asInt(enemyArmySize, 1));
  let odds = 0;
  if (own >= enemy * 5) odds = 10;
  else if (own >= enemy * 2) odds = 5;
  else if (enemy >= own * 5) odds = -10;
  else if (enemy >= own * 2) odds = -5;
  return odds + (ownHomeland ? 10 : 0) - (enemyHomeland ? 10 : 0);
};

const disengagedActions = ({ lone, mounted }) => [
  'engage', 'remain_disengaged', 'withdraw', 'first_aid', 'aid_fallen', 'pillage',
  'change_armor', 'rally', ...(lone ? ['call_squire', 'find_unit'] : []),
  ...(lone && !mounted ? ['find_mount'] : [])
];

export const executeTable83 = ({ outcome, lone = false, mounted = false }) => {
  if (outcome === 'critical') return { table: '8-3', engaged: false, modifier: 0, actions: [...disengagedActions({ lone, mounted }), 'special_event', 'join_unit'] };
  if (outcome === 'success') return { table: '8-3', engaged: false, modifier: 0, actions: disengagedActions({ lone, mounted }) };
  if (outcome === 'failure') return { table: '8-3', engaged: true, modifier: 0, actions: ['engage', 'surrender', 'flee'] };
  return { table: '8-3', engaged: true, modifier: -5, actions: ['engage', 'surrender', 'flee'] };
};

export const executeTable84 = ({ outcome, meleeEventTotal }) => {
  if (outcome === 'critical') return { table: '8-4', engaged: false, modifier: 0, actions: ['engage', 'withdraw'] };
  if (outcome === 'success' && asInt(meleeEventTotal) >= 9) return { table: '8-4', engaged: false, modifier: 0, actions: ['engage', 'withdraw'] };
  if (outcome === 'fumble') return { table: '8-4', engaged: true, modifier: -5, actions: ['engage', 'surrender'] };
  return { table: '8-4', engaged: true, modifier: 0, actions: ['engage', 'surrender'] };
};

export const resolveUnitBattleRoll = ({ roll, skill, modifiers = [], playerMounted, enemyMounted, lone, meleeEventTotal }) => {
  const target = asInt(skill) + modifiers.reduce((sum, value) => sum + asInt(value), 0);
  const check = resolveD20Roll(roll, target);
  const table = !playerMounted && enemyMounted
    ? executeTable84({ outcome: check.outcome, meleeEventTotal })
    : executeTable83({ outcome: check.outcome, lone, mounted: playerMounted });
  return { check, target, ...table };
};

export const executeTable85 = roll => {
  const value = clamp(roll, 1, 20);
  if (value <= 5) return { roll: value, type: 'disadvantage', weaponModifier: -3, enemyTableModifier: 0, nextMeleeModifier: 0 };
  if (value <= 10) return { roll: value, type: 'normal_enemy', weaponModifier: 0, enemyTableModifier: 0, nextMeleeModifier: 0 };
  if (value <= 15) return { roll: value, type: 'advantage', weaponModifier: 3, enemyTableModifier: 0, nextMeleeModifier: 0 };
  if (value <= 18) return { roll: value, type: 'hero_or_noble', weaponModifier: 0, enemyTableModifier: 3, nextMeleeModifier: 5 };
  if (value === 19) return { roll: value, type: 'standard', weaponModifier: 0, enemyTableModifier: 5, nextMeleeModifier: 10 };
  return { roll: value, type: 'battalion_commander', weaponModifier: 0, enemyTableModifier: 0, nextMeleeModifier: 15 };
};

export const executeTable86 = ({ roll, battleSkill, glory, rallyDice, rng = Math.random }) => {
  const gloryModifier = roundPaladin(Math.max(0, asNumber(glory)) / 1000);
  const dice = Array.isArray(rallyDice) && rallyDice.length === 2 ? rallyDice.map(value => clamp(value, 1, 6)) : [rollDie(6, rng), rollDie(6, rng)];
  const modifier = gloryModifier - dice.reduce((sum, value) => sum + value, 0);
  const check = resolveD20Roll(roll, asInt(battleSkill) + modifier);
  let rallied = 0;
  if (check.critical) rallied = (rollDie(6, rng) + rollDie(6, rng)) + 6;
  else if (check.success) rallied = (rollDie(6, rng) + rollDie(6, rng)) + 3;
  return {
    table: '8-6', check, modifier, modifierDice: dice, rallied,
    becomesCommander: check.success,
    deserts: check.fumble
  };
};

export const executeTable87 = ({ roll, skill, modifier = 0, opponentRoll, opponentSkill }) => {
  const check = resolveD20Roll(roll, asInt(skill) + asInt(modifier));
  const opposed = opponentRoll == null
    ? null
    : resolveOpposedD20(check, resolveD20Roll(opponentRoll, asInt(opponentSkill)));
  const resolvedOutcome = opposed?.winner === 'actor' ? (check.critical ? 'critical' : 'success')
    : opposed?.actorOutcome === 'partial' ? 'partial'
      : check.fumble ? 'fumble' : 'failure';
  const effects = {
    critical: { escaped: true, engaged: false, nextBattleModifier: 5, damage: 'none', weaponLoss: false },
    success: { escaped: true, engaged: false, nextBattleModifier: 0, damage: 'none', weaponLoss: false },
    partial: { escaped: true, engaged: false, nextBattleModifier: 0, damage: 'normal_with_shield', weaponLoss: false },
    failure: { escaped: false, engaged: true, nextBattleModifier: 0, damage: 'normal_no_shield', weaponLoss: false },
    fumble: { escaped: false, engaged: true, nextBattleModifier: 0, damage: 'normal_no_shield', weaponLoss: true }
  };
  return { table: '8-7', check, opposed, outcome: resolvedOutcome, ...effects[resolvedOutcome] };
};

export const executeTable88 = ({ outcome, followerCount }) => {
  const count = Math.max(0, asInt(followerCount));
  const result = { table: '8-8', outcome, count, killed: 0, wounded: 0, captured: 0, enemyCaptured: 0, survivorsRouted: outcome === 'fumble' };
  if (outcome === 'critical') result.enemyCaptured = Math.floor(count / 5);
  if (outcome === 'success') {
    result.killed = roundPaladin(count * 0.02);
    result.wounded = roundPaladin(count * 0.08);
  }
  if (outcome === 'failure') {
    result.killed = roundPaladin(count * 0.10);
    result.wounded = roundPaladin(count * 0.25);
    result.captured = roundPaladin(count * 0.15);
  }
  if (outcome === 'fumble') {
    result.killed = roundPaladin(count * 0.50);
    result.captured = roundPaladin(count * 0.25);
  }
  const over = Math.max(0, result.killed + result.wounded + result.captured - count);
  if (over) result.wounded = Math.max(0, result.wounded - over);
  result.survived = count - result.killed - result.wounded - result.captured;
  return result;
};

export const calculateTable89Modifier = ({ playerRouted, playerRetreated, enemyRetreated, enemyRouted }) => (
  (playerRouted ? -10 : 0) + (playerRetreated ? -5 : 0) + (enemyRetreated ? 5 : 0) + (enemyRouted ? 10 : 0)
);

export const executeTable810 = ({ roll, modifier = 0 }) => {
  const adjusted = asInt(roll) + asInt(modifier);
  if (adjusted <= 2) return { table: '8-10', roll: asInt(roll), modifier: asInt(modifier), adjusted, result: 'decisive_defeat', fateModifier: 5 };
  if (adjusted >= 19) return { table: '8-10', roll: asInt(roll), modifier: asInt(modifier), adjusted, result: 'decisive_victory', fateModifier: -5 };
  return { table: '8-10', roll: asInt(roll), modifier: asInt(modifier), adjusted, result: 'indecisive', fateModifier: 0 };
};

export const executeTable811 = ({ roll, skill, kind }) => {
  const check = resolveD20Roll(roll, asInt(skill));
  const personal = {
    critical: { skillPenalty: 0, nextHealthModifier: 0, surgeryNeeded: false },
    success: { skillPenalty: 0, nextHealthModifier: 0, surgeryNeeded: false },
    failure: { skillPenalty: -5, nextHealthModifier: -1, surgeryNeeded: false },
    fumble: { skillPenalty: -15, nextHealthModifier: 0, surgeryNeeded: true }
  };
  const troops = {
    critical: { unavailablePercent: 0, siegeModifier: 0, nextHealthModifier: 0, moraleModifier: null },
    success: { unavailablePercent: 0, siegeModifier: 0, nextHealthModifier: 0, moraleModifier: null },
    failure: { unavailablePercent: 10, siegeModifier: -2, nextHealthModifier: -1, moraleModifier: 0 },
    fumble: { unavailablePercent: 50, siegeModifier: -10, nextHealthModifier: -5, moraleModifier: -5 }
  };
  return { table: '8-11', kind, check, ...(kind === 'personal' ? personal[check.outcome] : troops[check.outcome]) };
};

const SIEGE_ASSAULT_MATRIX = Object.freeze({
  critical: {
    critical: ['held', 'light', 'none', false], success: ['taken', 'light', 'moderate', true],
    failure: ['taken', 'light', 'heavy', true], fumble: ['taken', 'none', 'crushing', true, 2]
  },
  success: {
    critical: ['held', 'moderate', 'none', false], success: ['held', 'light', 'light', false],
    failure: ['taken', 'moderate', 'light', true], fumble: ['taken', 'light', 'light', true]
  },
  failure: {
    critical: ['held', 'heavy', 'none', false], success: ['held', 'moderate', 'none', false],
    failure: ['held', 'moderate', 'light', false], fumble: ['held', 'moderate', 'moderate', false]
  },
  fumble: {
    critical: ['held', 'crushing', 'none', false], success: ['held', 'heavy', 'none', false],
    failure: ['held', 'moderate', 'moderate', false], fumble: ['held', 'heavy', 'heavy', false]
  }
});

export const SIEGE_LOSS_RATES = Object.freeze({
  none: { killed: 0, wounded: 0, captured: 0, moraleModifier: null },
  light: { killed: 2, wounded: 8, captured: 0, moraleModifier: null },
  moderate: { killed: 5, wounded: 15, captured: 5, moraleModifier: 0 },
  heavy: { killed: 10, wounded: 25, captured: 15, moraleModifier: -5 },
  crushing: { killed: 50, wounded: 0, captured: 25, moraleModifier: -10 }
});

export const executeTable812 = ({ attackerOutcome, defenderOutcome }) => {
  const [status, attackerLoss, defenderLoss, defenderMayRetire, defenseLinesTaken = 1] = SIEGE_ASSAULT_MATRIX[attackerOutcome][defenderOutcome];
  return {
    table: '8-12', defensesTaken: status === 'taken', defenderMayRetire,
    defenseLinesTaken: status === 'taken' ? defenseLinesTaken : 0,
    attackerLoss, defenderLoss,
    attackerRates: SIEGE_LOSS_RATES[attackerLoss], defenderRates: SIEGE_LOSS_RATES[defenderLoss]
  };
};

export const executeTable813 = ({ roll, stewardship, modifier = 0 }) => {
  const check = resolveD20Roll(roll, asInt(stewardship) + asInt(modifier));
  const effects = {
    critical: { nextModifier: 5, moraleModifier: null }, success: { nextModifier: 0, moraleModifier: null },
    failure: { nextModifier: -1, moraleModifier: 0 }, fumble: { nextModifier: -5, moraleModifier: -5 }
  };
  return { table: '8-13', check, ...effects[check.outcome] };
};

export const executeTable814 = ({ roll, intrigue, bribe = 0, target }) => {
  const check = resolveD20Roll(roll, asInt(intrigue) + Math.max(0, asInt(bribe)));
  const effects = {
    critical: { moraleRequired: true, targetModifier: -5, nextTargetModifier: 0 },
    success: { moraleRequired: true, targetModifier: -2, nextTargetModifier: 0 },
    failure: { moraleRequired: false, targetModifier: 0, nextTargetModifier: 0 },
    fumble: { moraleRequired: false, targetModifier: 0, nextTargetModifier: 5 }
  };
  return { table: '8-14', target, bribe: Math.max(0, asInt(bribe)), check, ...effects[check.outcome] };
};

export const executeTable815 = ({ category, outcome }) => {
  const table = {
    valorous: {
      critical: { nextValorous: 5, immediateRetinue: 5 }, success: {},
      failure: { end: 'honorable_surrender' }, fumble: { end: 'unconditional_surrender', honorLoss: 2 }
    },
    retinue: {
      critical: { nextRetinue: 5, immediateCommoners: 5 }, success: {},
      failure: { nextRetinue: -5, immediateCommoners: -5 },
      fumble: { end: 'knights_revolt', honorLoss: 1 }
    },
    commoners: {
      critical: { nextCommoners: 5 }, success: {},
      failure: { end: 'betrayal' }, fumble: { end: 'commoners_revolt' }
    }
  };
  return { table: '8-15', category, outcome, ...table[category][outcome] };
};

export const executeTable816 = ({ category, outcome }) => {
  const table = {
    valorous: {
      critical: { nextValorous: 5, immediateRetinue: 5 }, success: {},
      failure: { end: 'abandon_siege', retainEquipment: true },
      fumble: { end: 'abandon_army', loseEquipment: true, honorLoss: 2 }
    },
    retinue: {
      critical: { nextRetinue: 5, immediateCommoners: 5 }, success: {},
      failure: { nextRetinue: -5, immediateCommoners: -5 },
      fumble: { end: 'knights_revolt', loseEquipment: true, honorLoss: 1 }
    },
    commoners: {
      critical: { nextCommoners: 5, nextSiegeModifier: 5 }, success: { clearSiegePenalty: true },
      failure: { ongoingSiegeModifier: -10 }, fumble: { end: 'commoners_abandon', loseEquipment: true }
    }
  };
  return { table: '8-16', category, outcome, ...table[category][outcome] };
};

export const resolveMeleeEvent = diceValue => {
  const dice = Array.isArray(diceValue) && diceValue.length === 3
    ? diceValue.map(value => clamp(value, 1, 6))
    : [clamp(diceValue, 3, 18), 0, 0];
  const total = dice[1] ? dice.reduce((sum, value) => sum + value, 0) : dice[0];
  const triple = dice[1] && dice[0] === dice[1] && dice[1] === dice[2] ? dice[0] : null;
  const rows = {
    3: ['player_battalion_routs', -15], 4: ['player_unit_retreats', -10], 5: ['enemy_knight_surge', -10],
    6: [triple === 2 ? 'player_battalion_retreats' : 'player_battalion_outnumbered', -5],
    7: ['player_battalion_surrounded', -5], 8: ['enemy_pushes', -5],
    13: ['enemy_confused', 5], 14: ['enemy_battalion_outnumbered', 5],
    15: [triple === 5 ? 'enemy_battalion_retreats' : 'enemy_pulls_away', 5],
    16: ['surge_of_victory', 10], 17: ['enemy_unit_retreats', 10], 18: ['enemy_battalion_routs', 15]
  };
  const [event, modifier] = rows[total] || ['even_fight', 0];
  return { dice, total, triple, event, modifier };
};

const sanitizeRef = ref => ({ type: ref?.type === 'squire' ? 'squire' : 'family', id: String(ref?.id || '') });

export const sanitizeMassBattleState = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return {
    ...value,
    id: String(value.id || 'battle:migrated'),
    year: clamp(value.year, 700, 1200, 767),
    status: value.status === 'complete' ? 'complete' : 'active',
    phase: BATTLE_PHASES.includes(value.phase) ? value.phase : 'pre_battle',
    round: clamp(value.round, 0, 100),
    duration: clamp(value.duration, 0, 12, 8),
    enemyTableId: Object.hasOwn(BATTLE_ENEMY_TABLES, value.enemyTableId || value.enemy?.tableId) ? (value.enemyTableId || value.enemy.tableId) : 'earlyKnights',
    enemyRoll: clamp(value.enemyRoll || value.enemy?.roll, 1, 100, 1),
    rounds: Array.isArray(value.rounds) ? value.rounds.filter(Boolean).slice(-100) : [],
    followerRefs: Array.isArray(value.followerRefs) ? value.followerRefs.map(sanitizeRef).filter(ref => ref.id).slice(0, 1000) : [],
    routedFollowerRefs: Array.isArray(value.routedFollowerRefs) ? value.routedFollowerRefs.map(sanitizeRef).filter(ref => ref.id).slice(0, 1000) : [],
    captives: Array.isArray(value.captives) ? value.captives.filter(Boolean).slice(-1000) : [],
    pendingFollowerFate: value.pendingFollowerFate && typeof value.pendingFollowerFate === 'object' ? value.pendingFollowerFate : null,
    pendingRound: value.pendingRound && typeof value.pendingRound === 'object' ? value.pendingRound : null,
    aftermath: value.aftermath && typeof value.aftermath === 'object' ? value.aftermath : null
  };
};

export const sanitizeSkirmishState = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const seen = new Set();
  const followerRefs = (Array.isArray(value.followerRefs) ? value.followerRefs : [])
    .map(sanitizeRef)
    .filter(ref => {
      const key = followerKey(ref);
      if (!ref.id || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 1000);
  return {
    ...value,
    id: String(value.id || 'skirmish:migrated'),
    year: clamp(value.year, 700, 1200, 767),
    status: value.status === 'complete' ? 'complete' : 'active',
    phase: SKIRMISH_PHASES.includes(value.phase) ? value.phase : 'command',
    followerRound: clamp(value.followerRound, 1, 5, 3),
    rounds: Array.isArray(value.rounds) ? value.rounds.filter(Boolean).slice(0, 100) : [],
    followerRefs,
    captives: Array.isArray(value.captives) ? value.captives.filter(Boolean).slice(-1000) : [],
    pendingFollowerFate: value.pendingFollowerFate && typeof value.pendingFollowerFate === 'object' ? value.pendingFollowerFate : null,
    result: value.result && typeof value.result === 'object' ? value.result : null
  };
};

export const sanitizeSiegeState = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return {
    ...value,
    id: String(value.id || 'siege:migrated'),
    year: clamp(value.year, 700, 1200, 767),
    status: value.status === 'complete' ? 'complete' : 'active',
    phase: SIEGE_PHASES.includes(value.phase) ? value.phase : 'health',
    month: clamp(value.month, 1, 1200, 1),
    originalDv: Array.isArray(value.originalDv) ? value.originalDv.map(item => Math.max(0, asInt(item))).filter(Boolean).slice(0, 20) : [5, 3],
    currentRing: clamp(value.currentRing, 0, 19, 0),
    turns: Array.isArray(value.turns) ? value.turns.filter(Boolean).slice(-1200) : [],
    moraleRequired: value.moraleRequired && typeof value.moraleRequired === 'object' ? value.moraleRequired : { attacker: null, defender: null },
    result: value.result && typeof value.result === 'object' ? value.result : null
  };
};

const followerKey = ref => `${ref.type}:${ref.id}`;
const followerEntity = (character, ref) => ref.type === 'squire'
  ? character.squire
  : character.family?.members?.find(member => member.id === ref.id);

const activeFollowerRefs = (character, refs, excludedRefs = []) => {
  const excluded = new Set(excludedRefs.map(followerKey));
  return refs.filter(ref => {
  const entity = followerEntity(character, ref);
    return !excluded.has(followerKey(ref)) && entity && !['사망', '포로', '실종'].includes(entity.status);
  });
};

const followerFateCheck = (character, battle, roll) => {
  const activeRefs = activeFollowerRefs(character, battle.followerRefs, battle.routedFollowerRefs);
  const target = asInt(character.skills?.battle) + asInt(battle.player?.magicBattleBonus) + asInt(battle.command?.chargeModifier) + asInt(battle.nextBattleModifier);
  const check = resolveD20Roll(roll, target);
  return { check, fate: executeTable88({ outcome: check.outcome, followerCount: activeRefs.length }), activeRefs };
};

const stageFollowerFate = (character, battle, roll, resumePhase, roundIndex) => {
  const resolved = followerFateCheck(character, battle, roll);
  const fate = resolved.fate;
  if (fate.enemyCaptured) {
    for (let index = 0; index < fate.enemyCaptured; index += 1) {
      battle.captives.push({ id: `${battle.id}:captive:${battle.captives.length + 1}`, type: 'battle_enemy', ransomEligible: false, status: 'held', year: battle.year });
    }
  }
  const affected = fate.killed + fate.wounded + fate.captured;
  battle.rounds[roundIndex].followerFate = fate;
  battle.rounds[roundIndex].followerBattleCheck = resolved.check;
  if (!affected) {
    if (fate.survivorsRouted) battle.routedFollowerRefs = [...battle.routedFollowerRefs, ...resolved.activeRefs];
    battle.phase = resumePhase;
    return;
  }
  battle.pendingFollowerFate = { fate, refs: resolved.activeRefs, resumePhase, roundIndex };
  battle.phase = 'follower_fate';
};

const getAfterRoundPhase = battle => {
  const latest = battle.rounds.at(-1);
  if (latest?.playerWithdrawal) return 'withdrawal';
  if (latest?.enemyWithdrawal) return 'pursuit_decision';
  if (battle.round >= battle.duration) return 'aftermath';
  return 'melee';
};

export const assignFollowerFates = (characterValue, assignments = {}, now) => {
  const character = clone(characterValue);
  const battle = sanitizeMassBattleState(character.campaign?.massBattle);
  requirePhase(battle, ['follower_fate']);
  const pending = battle.pendingFollowerFate;
  const counts = { killed: 0, wounded: 0, captured: 0 };
  pending.refs.forEach(ref => {
    const fate = assignments[followerKey(ref)] || 'survived';
    if (Object.hasOwn(counts, fate)) counts[fate] += 1;
  });
  if (pending.fate.survivorsRouted) {
    const routed = pending.refs.filter(ref => (assignments[followerKey(ref)] || 'survived') === 'survived');
    battle.routedFollowerRefs = [...battle.routedFollowerRefs, ...routed];
  }
  for (const key of Object.keys(counts)) {
    if (counts[key] !== pending.fate[key]) throw new Error(`${key} 배정은 ${pending.fate[key]}명이어야 합니다.`);
  }
  pending.refs.forEach(ref => {
    const fate = assignments[followerKey(ref)] || 'survived';
    if (fate === 'survived') return;
    const entity = followerEntity(character, ref);
    if (!entity) return;
    entity.status = fate === 'killed' ? '사망' : fate === 'wounded' ? '병상' : '포로';
    entity.battleStatus = { battleId: battle.id, fate, year: battle.year };
    if (fate === 'killed') {
      entity.deathYear = battle.year;
      entity.deathCause = `${battle.name}에서 전사`;
    }
    if (ref.type === 'family') {
      appendFamilyTimeline(character, {
        id: `${battle.id}:follower:${ref.id}:${fate}`,
        year: battle.year,
        type: fate === 'killed' ? 'death' : fate === 'captured' ? 'capture' : 'injury',
        memberId: ref.id,
        title: fate === 'killed' ? `${entity.name} 전사` : fate === 'captured' ? `${entity.name} 포획` : `${entity.name} 부상`,
        narrative: `${battle.name}에서 ${fate === 'killed' ? '전사했습니다' : fate === 'captured' ? '포로가 되었습니다' : '부상을 입었습니다'}.`,
        sourceRuleId: 'BATTLE-FOLLOWERS-8-8', sourcePage: 'Chapter 8 p.147', createdAt: iso(now)
      });
    }
  });
  battle.pendingFollowerFate = null;
  battle.phase = pending.resumePhase === 'after_round' ? getAfterRoundPhase(battle) : pending.resumePhase;
  battle.updatedAt = iso(now);
  character.campaign.massBattle = battle;
  return { character, battle };
};

export const startSkirmish = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  if (character.campaign?.captivity?.status === 'active') throw new Error('포로 상태에서는 교전을 시작할 수 없습니다.');
  const lifecycle = character.campaign?.lifecycle?.careerStatus;
  if (['deceased', 'retired', 'historical'].includes(lifecycle)) throw new Error('현재 기사는 교전에 참가할 수 없습니다.');
  const timestamp = iso(now);
  const skirmish = sanitizeSkirmishState({
    id: safeId(input.id || `skirmish:${character.personal?.campaignYear || 767}:${timestamp}`),
    year: character.personal?.campaignYear || 767,
    name: String(input.name || '이름 없는 교전'),
    enemy: String(input.enemy || '적군'),
    status: 'active',
    phase: 'command',
    playerCommander: Boolean(input.playerCommander),
    commanderSkill: clamp(input.commanderSkill, 0, 100, character.skills?.battle || 10),
    followerRound: clamp(input.followerRound, 1, 5, 3),
    followerRefs: Array.isArray(input.followerRefs) ? input.followerRefs : [],
    command: null,
    rounds: [],
    captives: [],
    pendingFollowerFate: null,
    result: null,
    createdAt: timestamp,
    updatedAt: timestamp
  });
  character.campaign = character.campaign || {};
  character.campaign.skirmish = skirmish;
  return { character, skirmish };
};

export const resolveSkirmishCommand = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const skirmish = sanitizeSkirmishState(character.campaign?.skirmish);
  requirePhase(skirmish, ['command']);
  const command = resolveCommandRoll({
    roll: input.roll || rollDie(20, rng),
    skill: skirmish.commanderSkill
  });
  skirmish.command = { ...command, table: '8-1' };
  skirmish.phase = 'melee';
  skirmish.updatedAt = iso(input.now);
  character.campaign.skirmish = skirmish;
  return { character, skirmish, command: skirmish.command };
};

export const recordSkirmishMeleeRound = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const skirmish = sanitizeSkirmishState(character.campaign?.skirmish);
  requirePhase(skirmish, ['melee']);
  const number = skirmish.rounds.length + 1;
  const outcome = ['victory', 'draw', 'defeat', 'withdrawal'].includes(input.outcome) ? input.outcome : 'draw';
  skirmish.rounds.push({
    number,
    outcome,
    enemiesDefeated: Math.max(0, asInt(input.enemiesDefeated)),
    commandModifier: number === 1 ? asInt(skirmish.command?.modifier) : 0,
    note: String(input.note || ''),
    resolvedBy: 'chapter_7_combat',
    createdAt: iso(now)
  });
  if (number >= skirmish.followerRound || outcome === 'withdrawal') skirmish.phase = 'followers';
  skirmish.updatedAt = iso(now);
  character.campaign.skirmish = skirmish;
  return { character, skirmish, round: skirmish.rounds.at(-1) };
};

export const resolveSkirmishFollowers = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const skirmish = sanitizeSkirmishState(character.campaign?.skirmish);
  requirePhase(skirmish, ['followers']);
  const refs = activeFollowerRefs(character, skirmish.followerRefs);
  const target = asInt(character.skills?.battle) + asInt(skirmish.command?.modifier);
  const check = resolveD20Roll(input.roll || rollDie(20, rng), target);
  const fate = executeTable88({ outcome: check.outcome, followerCount: refs.length });
  if (fate.enemyCaptured) {
    for (let index = 0; index < fate.enemyCaptured; index += 1) {
      skirmish.captives.push({ id: `${skirmish.id}:captive:${index + 1}`, type: 'skirmish_enemy', ransomEligible: false, status: 'held', year: skirmish.year });
    }
  }
  skirmish.followerCheck = { ...check, target, table: '8-2', fate };
  if (fate.killed + fate.wounded + fate.captured) {
    skirmish.pendingFollowerFate = { fate, refs };
    skirmish.phase = 'follower_fate';
  } else {
    skirmish.phase = 'aftermath';
  }
  skirmish.updatedAt = iso(input.now);
  character.campaign.skirmish = skirmish;
  return { character, skirmish, check, fate };
};

export const assignSkirmishFollowerFates = (characterValue, assignments = {}, now) => {
  const character = clone(characterValue);
  const skirmish = sanitizeSkirmishState(character.campaign?.skirmish);
  requirePhase(skirmish, ['follower_fate']);
  const pending = skirmish.pendingFollowerFate;
  const counts = { killed: 0, wounded: 0, captured: 0 };
  pending.refs.forEach(ref => {
    const fate = assignments[followerKey(ref)] || 'survived';
    if (Object.hasOwn(counts, fate)) counts[fate] += 1;
  });
  for (const key of Object.keys(counts)) {
    if (counts[key] !== pending.fate[key]) throw new Error(`${key} 배정은 ${pending.fate[key]}명이어야 합니다.`);
  }
  pending.refs.forEach(ref => {
    const fate = assignments[followerKey(ref)] || 'survived';
    if (fate === 'survived') return;
    const entity = followerEntity(character, ref);
    if (!entity) return;
    entity.status = fate === 'killed' ? '사망' : fate === 'wounded' ? '병상' : '포로';
    entity.battleStatus = { battleId: skirmish.id, fate, year: skirmish.year };
    if (fate === 'killed') {
      entity.deathYear = skirmish.year;
      entity.deathCause = `${skirmish.name}에서 전사`;
    }
    if (ref.type === 'family') {
      appendFamilyTimeline(character, {
        id: `${skirmish.id}:follower:${ref.id}:${fate}`,
        year: skirmish.year,
        type: fate === 'killed' ? 'death' : fate === 'captured' ? 'capture' : 'injury',
        memberId: ref.id,
        title: fate === 'killed' ? `${entity.name} 전사` : fate === 'captured' ? `${entity.name} 포획` : `${entity.name} 부상`,
        narrative: `${skirmish.name}에서 ${fate === 'killed' ? '전사했습니다' : fate === 'captured' ? '포로가 되었습니다' : '부상을 입었습니다'}.`,
        sourceRuleId: 'SKIRMISH-FOLLOWERS-8-2', sourcePage: 'Chapter 8 pp.138-139', createdAt: iso(now)
      });
    }
  });
  skirmish.pendingFollowerFate = null;
  skirmish.phase = 'aftermath';
  skirmish.updatedAt = iso(now);
  character.campaign.skirmish = skirmish;
  return { character, skirmish };
};

export const finalizeSkirmish = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const skirmish = sanitizeSkirmishState(character.campaign?.skirmish);
  requirePhase(skirmish, ['aftermath']);
  const timestamp = iso(now);
  const outcome = ['victory', 'draw', 'defeat'].includes(input.outcome) ? input.outcome : 'draw';
  const rescueCaptured = outcome === 'victory' && Boolean(input.rescueCaptured);
  if (rescueCaptured) {
    skirmish.followerRefs.forEach(ref => {
      const entity = followerEntity(character, ref);
      if (entity?.battleStatus?.battleId === skirmish.id && entity.battleStatus.fate === 'captured') {
        entity.status = '생존';
        entity.battleStatus = { ...entity.battleStatus, rescued: true, rescuedYear: skirmish.year };
        if (ref.type === 'family') appendFamilyTimeline(character, {
          id: `${skirmish.id}:rescue:${ref.id}`, year: skirmish.year, type: 'return', memberId: ref.id,
          title: `${entity.name} 구출`, narrative: `${skirmish.name}의 승리 뒤 포로 상태에서 구출되었습니다.`,
          sourceRuleId: 'SKIRMISH-FOLLOWERS-8-2', sourcePage: 'Chapter 8 p.139', createdAt: timestamp
        });
      }
    });
  }
  const defeated = skirmish.rounds.reduce((sum, round) => sum + asInt(round.enemiesDefeated), 0);
  skirmish.result = { outcome, rescueCaptured, enemiesDefeated: defeated };
  skirmish.status = 'complete';
  skirmish.phase = 'complete';
  skirmish.completedAt = timestamp;
  character.campaign.captives = [...(character.campaign.captives || []), ...skirmish.captives].slice(-1000);
  appendChronicleEvent(character, {
    id: `${skirmish.id}:chronicle`, year: skirmish.year, type: 'battle', title: skirmish.name,
    narrative: `${skirmish.enemy}과의 교전은 ${outcome === 'victory' ? '승리로' : outcome === 'defeat' ? '패배로' : '결판 없이'} 끝났습니다.`,
    sourceRuleId: 'SKIRMISH-001', sourcePage: 'Chapter 8 pp.138-139', createdAt: timestamp
  });
  character.campaign.skirmish = skirmish;
  character.campaign.skirmishHistory = [...(character.campaign.skirmishHistory || []), clone(skirmish)].slice(-100);
  return { character, skirmish };
};

const battleEnemy = input => ({
  name: String(input?.name || '적 전사'), mounted: Boolean(input?.mounted), missile: Boolean(input?.missile),
  greatSpear: Boolean(input?.greatSpear), primarySkill: clamp(input?.primarySkill, 0, 100, 12),
  secondarySkill: clamp(input?.secondarySkill, 0, 100, 10), damageDice: clamp(input?.damageDice, 1, 30, 4),
  armor: clamp(input?.armor, 0, 100, 6), shield: Boolean(input?.shield), ransomEligible: Boolean(input?.ransomEligible)
});

export const startMassBattle = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  if (character.campaign?.captivity?.status === 'active') throw new Error('포로 상태에서는 전투를 시작할 수 없습니다.');
  const lifecycle = character.campaign?.lifecycle?.careerStatus;
  if (['deceased', 'retired', 'historical'].includes(lifecycle)) throw new Error('현재 기사는 전투에 참가할 수 없습니다.');
  const timestamp = iso(now);
  const magicBattleBonus = getMagicCombatEffects(character).battleBonus;
  const playerRole = ['lone', 'unit', 'battalion', 'army'].includes(input.playerRole) ? input.playerRole : 'unit';
  const battle = sanitizeMassBattleState({
    id: safeId(input.id || `battle:${character.personal?.campaignYear || 767}:${timestamp}`),
    year: character.personal?.campaignYear || 767, name: String(input.name || '이름 없는 전투'), status: 'active', phase: 'pre_battle',
    scale: Object.hasOwn(BATTLE_SCALE_GLORY, input.scale) ? input.scale : 'small', duration: clamp(input.duration, 0, 12, 8), round: 0,
    sides: {
      player: { name: String(input.playerSideName || '아군'), size: Math.max(1, asInt(input.playerArmySize, 200)), armyBattle: clamp(asInt(input.playerArmyBattle, 10) + (playerRole === 'army' ? magicBattleBonus : 0), 0, 100, 10), battalionBattle: clamp(asInt(input.battalionBattle, character.skills?.battle || 10) + magicBattleBonus, 0, 100, character.skills?.battle || 10) },
      enemy: { name: String(input.enemySideName || '적군'), size: Math.max(1, asInt(input.enemyArmySize, 200)), armyBattle: clamp(input.enemyArmyBattle, 0, 100, 10) }
    },
    battlefield: { ownHomeland: Boolean(input.ownHomeland), enemyHomeland: Boolean(input.enemyHomeland), playerRetreated: false, playerRouted: false, enemyRetreated: false, enemyRouted: false },
    player: {
      role: playerRole, magicBattleBonus,
      isUnitCommander: Boolean(input.unitCommander || input.playerRole === 'battalion' || input.playerRole === 'army' || input.followerRefs?.length),
      mounted: Boolean(input.mounted), hasHorse: Boolean(input.mounted), hasLance: Boolean(input.hasLance), lanceIntact: Boolean(input.hasLance),
      armor: clamp(input.armor, 0, 100, 10), shield: clamp(input.shield, 0, 100, 6), holdingPrisonerId: null, unitState: input.playerRole === 'lone' ? 'alone' : 'attached'
    },
    enemy: battleEnemy(input.enemy), enemyTableId: String(input.enemyTable || input.enemy?.tableId || 'earlyKnights'), enemyRoll: clamp(input.enemyRoll || input.enemy?.roll, 1, 100, 1),
    followerRefs: Array.isArray(input.followerRefs) ? input.followerRefs : [], routedFollowerRefs: [],
    command: null, rounds: [], pendingRound: null, pendingFollowerFate: null, nextBattleModifier: 0,
    captives: [], ransomClaims: [], loot: null, aftermath: null, createdAt: timestamp, updatedAt: timestamp
  });
  character.campaign = character.campaign || {};
  character.campaign.massBattle = battle;
  return { character, battle };
};

export const resolveBattlePreparation = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const battle = sanitizeMassBattleState(character.campaign?.massBattle);
  requirePhase(battle, ['pre_battle']);
  const situationModifier = calculateBattleSituationModifier({
    playerArmySize: battle.sides.player.size, enemyArmySize: battle.sides.enemy.size,
    ownHomeland: battle.battlefield.ownHomeland, enemyHomeland: battle.battlefield.enemyHomeland
  });
  const armyRoll = input.armyRoll || rollDie(20, rng);
  const army = resolveCommandRoll({ roll: armyRoll, skill: battle.sides.player.armyBattle, modifiers: [situationModifier] });
  const battalionRoll = input.battalionRoll || rollDie(20, rng);
  const battalion = resolveCommandRoll({ roll: battalionRoll, skill: battle.sides.player.battalionBattle, modifiers: [army.modifier] });
  battle.command = { situationModifier, army, battalion, chargeModifier: battalion.modifier };
  battle.phase = battle.duration === 0 ? 'aftermath' : 'first_charge';
  battle.updatedAt = iso(input.now);
  character.campaign.massBattle = battle;
  return { character, battle };
};

const applyBattleDamage = (character, battle, input, source, rng) => {
  if (!(asNumber(input.damageTotal) > 0)) return { character, injury: null };
  return applyCharacterDamage(character, {
    rolledDamage: asInt(input.damageTotal), armor: battle.player.armor,
    shield: battle.player.shield, shieldApplies: Boolean(input.shieldApplies),
    year: battle.year, source, sourceRuleId: 'BATTLE-PERSONAL-001', sourcePage: 'Chapter 8 pp.143-147',
    requiresValorousToContinue: true, now: input.now
  }, rng);
};

const resolvePersonalExchange = (character, battle, input, { charge = false, flee = false } = {}, rng = Math.random) => {
  const enemy = input.enemyOverride || battle.enemy;
  const enemySkill = charge && enemy.mounted ? enemy.secondarySkill : enemy.primarySkill;
  const playerSkill = charge ? character.skills?.lance : character.skills?.[input.weaponSkill || 'sword'];
  const mountedReflexive = battle.player.mounted !== enemy.mounted && !(enemy.greatSpear && !enemy.mounted)
    ? (battle.player.mounted ? 5 : -5) : 0;
  const chargeBonus = charge && battle.player.mounted && !enemy.mounted && !enemy.greatSpear ? 5 : 0;
  const playerRoll = input.playerRoll || rollDie(20, rng);
  const enemyRoll = input.enemyRoll || rollDie(20, rng);
  const playerCheck = resolveD20Roll(playerRoll, asInt(playerSkill) + asInt(input.weaponModifier) + mountedReflexive + chargeBonus);
  const enemyCheck = resolveD20Roll(enemyRoll, enemySkill - mountedReflexive);
  const opposed = resolveOpposedD20(playerCheck, enemyCheck);
  let nextCharacter = character;
  let injury = null;
  let horseInjury = null;
  if (opposed.winner === 'opponent') {
    const damageTotal = input.enemyDamageTotal ?? rollD6Total(enemy.damageDice, rng);
    if (charge && enemy.missile && damageTotal % 2 === 1) {
      const horse = nextCharacter.horses?.warhorse;
      if (horse) {
        const before = asInt(horse.hp);
        const actualDamage = Math.max(0, asInt(damageTotal) - asInt(horse.armor));
        horse.hp = before - actualDamage;
        horse.status = horse.hp <= 0 ? '사망' : actualDamage > 0 ? '부상' : (horse.status || '건강');
        const horsemanship = actualDamage > 0
          ? resolveD20Roll(input.horsemanshipRoll || rollDie(20, rng), nextCharacter.skills?.horsemanship || 0)
          : null;
        horseInjury = { targeted: true, rolledDamage: damageTotal, actualDamage, hpBefore: before, hpAfter: horse.hp, horsemanship };
        if (horsemanship?.fumble) {
          battle.player.mounted = false;
          const thrown = applyBattleDamage(nextCharacter, battle, {
            damageTotal: input.throwDamage ?? rollDie(6, rng), shieldApplies: false, now: input.now
          }, '부상당한 말에서 내던져짐', rng);
          nextCharacter = thrown.character;
          horseInjury.riderInjury = thrown.injury;
        }
        if (horse.hp <= 0 || input.horseMajorWound) {
          const dexCheck = resolveD20Roll(input.fallDexRoll || rollDie(20, rng), nextCharacter.attributes?.dex || 0);
          horseInjury.fallDexCheck = dexCheck;
          battle.player.mounted = false;
          if (!dexCheck.success) {
            const fallen = applyBattleDamage(nextCharacter, battle, {
              damageTotal: input.fallDamage ?? rollD6Total(2, rng), shieldApplies: false, now: input.now
            }, '쓰러진 말에서 낙마', rng);
            nextCharacter = fallen.character;
            horseInjury.riderInjury = fallen.injury;
          }
        }
      }
    } else {
      const damaged = applyBattleDamage(nextCharacter, battle, {
        damageTotal, shieldApplies: opposed.actorOutcome === 'partial', now: input.now
      }, flee ? '전장에서 도주 중 입은 상처' : charge ? '첫 돌격에서 입은 상처' : '대규모 전투 교전 상처', rng);
      nextCharacter = damaged.character;
      injury = damaged.injury;
    }
  }
  const combatOutcome = opposed.winner === 'actor' ? playerCheck.outcome
    : opposed.actorOutcome === 'partial' ? 'partial' : playerCheck.fumble ? 'fumble' : 'failure';
  return { character: nextCharacter, exchange: { enemy, playerCheck, enemyCheck, opposed, combatOutcome, injury, horseInjury } };
};

export const resolveFirstCharge = (characterValue, input = {}, rng = Math.random) => {
  let character = clone(characterValue);
  const battle = sanitizeMassBattleState(character.campaign?.massBattle);
  requirePhase(battle, ['first_charge']);
  const participates = Boolean(input.participates);
  if (participates && (!battle.player.mounted || !battle.player.hasLance || !battle.player.lanceIntact)) {
    throw new Error('첫 돌격에는 말, 마상창, 돌격하는 부대가 모두 필요합니다.');
  }
  const timestamp = iso(input.now);
  let exchange = null;
  if (participates) {
    if (input.chapter7Resolution) {
      exchange = { ...clone(input.chapter7Resolution), resolvedBy: 'chapter_7_combat' };
      if (input.lanceBroken) battle.player.lanceIntact = false;
    } else {
      const result = resolvePersonalExchange(character, battle, { ...input, weaponModifier: battle.command?.chargeModifier, now: timestamp }, { charge: true }, rng);
      character = result.character;
      exchange = result.exchange;
      if (exchange.playerCheck.success && exchange.playerCheck.roll % 2 === 1) battle.player.lanceIntact = false;
    }
  }
  battle.round = 1;
  battle.rounds.push({
    number: 1, type: 'first_charge', risked: participates, combatOutcome: participates ? exchange.combatOutcome : 'disengaged',
    exchange, commandModifier: battle.command?.chargeModifier || 0, createdAt: timestamp
  });
  battle.phase = character.campaign?.health?.pendingDeath || character.campaign?.health?.unconscious ? 'aftermath' : battle.round >= battle.duration ? 'aftermath' : 'melee';
  if (input.surrender) {
    character.campaign.captivity = { status: 'active', sourceId: battle.id, year: battle.year, captor: battle.sides.enemy.name, ransom: null, sourceRuleId: 'BATTLE-SURRENDER-001' };
    battle.phase = 'aftermath';
  }
  if (participates) stageFollowerFate(character, battle, input.followerRoll || rollDie(20, rng), battle.phase, 0);
  battle.updatedAt = timestamp;
  character.campaign.massBattle = battle;
  return { character, battle, exchange };
};

export const beginBattleMeleeRound = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const battle = sanitizeMassBattleState(character.campaign?.massBattle);
  requirePhase(battle, ['melee']);
  if (character.campaign?.captivity?.status === 'active' || character.campaign?.health?.pendingDeath || character.campaign?.health?.unconscious) {
    battle.phase = 'aftermath';
    character.campaign.massBattle = battle;
    return { character, battle, blocked: true };
  }
  if (battle.player.unitState === 'retreated') {
    battle.pendingRound = { number: battle.round + 1, type: 'rally_from_rear', actions: ['rally', 'withdraw'] };
    battle.phase = 'melee_action';
    character.campaign.massBattle = battle;
    return { character, battle, pendingRound: battle.pendingRound };
  }
  const event = resolveMeleeEvent(input.eventDice || [rollDie(6, rng), rollDie(6, rng), rollDie(6, rng)]);
  if (battle.player.role === 'lone' && ['player_battalion_routs', 'player_battalion_retreats'].includes(event.event)) {
    return beginBattleMeleeRound(character, { ...input, eventDice: [rollDie(6, rng), rollDie(6, rng), rollDie(6, rng)] }, rng);
  }
  const isolation = battle.player.unitState === 'isolated' ? (battle.battlefield.playerRouted ? -10 : -5) : 0;
  const lone = battle.player.role === 'lone' || battle.player.unitState === 'alone';
  const enemyTableRoll = input.enemyTableRoll || rollDie(20, rng);
  const enemyRow = lookupBattleEnemy(battle.enemyTableId, enemyTableRoll);
  const roundEnemy = battleEnemy({ ...enemyRow, name: `${enemyRow.quality} · ${enemyRow.weapon}` });
  const unitRoll = resolveUnitBattleRoll({
    roll: input.battleRoll || rollDie(20, rng), skill: asInt(character.skills?.battle) + asInt(battle.player?.magicBattleBonus),
    modifiers: [event.modifier, isolation, lone ? -10 : 0, battle.nextBattleModifier],
    playerMounted: battle.player.mounted, enemyMounted: roundEnemy.mounted, lone, meleeEventTotal: event.total
  });
  const actions = unitRoll.actions.filter(action => !(battle.player.holdingPrisonerId && action === 'engage'));
  battle.enemy = roundEnemy;
  battle.pendingRound = { number: battle.round + 1, type: 'melee', event, enemyTableRoll, enemy: roundEnemy, unitRoll, actions, createdAt: iso(input.now) };
  battle.nextBattleModifier = 0;
  battle.phase = 'melee_action';
  character.campaign.massBattle = battle;
  return { character, battle, pendingRound: battle.pendingRound };
};

export const prepareBattleSpecialEvent = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const battle = sanitizeMassBattleState(character.campaign?.massBattle);
  requirePhase(battle, ['melee_action']);
  if (!battle.pendingRound?.actions?.includes('special_event')) throw new Error('현재 라운드에서는 특별 조우를 찾을 수 없습니다.');
  if (battle.pendingRound.specialEvent) return { character, battle, applied: false };
  const specialEvent = executeTable85(input.specialEventRoll || rollDie(20, rng));
  const enemyRoll = (input.specialEnemyRoll || rollDie(20, rng)) + specialEvent.enemyTableModifier;
  const enemyRow = lookupBattleEnemy(battle.enemyTableId, enemyRoll);
  const enemy = battleEnemy({ ...enemyRow, name: `${enemyRow.quality} · ${enemyRow.weapon}` });
  battle.pendingRound = {
    ...battle.pendingRound,
    specialEvent: { ...specialEvent, enemyRoll, enemy },
    specialEnemy: enemy
  };
  battle.updatedAt = iso(input.now);
  character.campaign.massBattle = battle;
  return { character, battle, specialEvent: battle.pendingRound.specialEvent, applied: true };
};

const meleeWithdrawal = event => {
  if (event === 'player_battalion_routs') return { side: 'player', kind: 'rout' };
  if (['player_unit_retreats', 'player_battalion_retreats'].includes(event)) return { side: 'player', kind: 'retreat' };
  if (event === 'enemy_battalion_routs') return { side: 'enemy', kind: 'rout' };
  if (['enemy_unit_retreats', 'enemy_battalion_retreats'].includes(event)) return { side: 'enemy', kind: 'retreat' };
  return null;
};

export const completeBattleMeleeRound = (characterValue, input = {}, rng = Math.random) => {
  let character = clone(characterValue);
  const battle = sanitizeMassBattleState(character.campaign?.massBattle);
  requirePhase(battle, ['melee_action']);
  const pending = battle.pendingRound;
  const action = String(input.action || '');
  if (!pending.actions.includes(action)) throw new Error('현재 판정 결과에서 허용되지 않는 행동입니다.');
  let exchange = null;
  let specialEvent = null;
  let rally = null;
  let flee = null;
  let firstAid = null;
  let equipmentChange = null;
  let specialCombatResolution = null;
  if (action === 'engage') {
    if (battle.player.holdingPrisonerId && !input.prisonerEscorted) throw new Error('포로를 후방으로 호송하거나 종자에게 맡기기 전에는 교전할 수 없습니다.');
    if (battle.player.holdingPrisonerId && input.prisonerEscorted) battle.player.holdingPrisonerId = null;
    if (input.chapter7Resolution) exchange = { ...clone(input.chapter7Resolution), resolvedBy: 'chapter_7_combat' };
    else {
      const resolved = resolvePersonalExchange(character, battle, {
        ...input, enemyOverride: pending.enemy, weaponModifier: asInt(pending.unitRoll?.modifier), now: iso(input.now)
      }, {}, rng);
      character = resolved.character;
      exchange = resolved.exchange;
    }
  } else if (action === 'special_event') {
    specialEvent = pending.specialEvent;
    if (!specialEvent) throw new Error('먼저 Table 8-5 특별 조우와 상대를 결정하세요.');
    const outcome = ['defeated', 'captured', 'gave_up'].includes(input.specialCombatResult) ? input.specialCombatResult : null;
    if (!outcome) throw new Error('Chapter 7 개인 전투의 결말을 기록하세요.');
    const won = outcome === 'defeated' || outcome === 'captured';
    const extraGlory = Math.max(0, asInt(input.specialCombatGlory));
    specialCombatResolution = { outcome, won, extraGlory, resolvedBy: 'chapter_7_combat', note: String(input.note || '') };
    specialEvent = { ...specialEvent, resolution: specialCombatResolution };
    if (won && specialEvent.nextMeleeModifier) battle.nextBattleModifier += specialEvent.nextMeleeModifier;
    if (outcome === 'captured') {
      const captive = { id: `${battle.id}:special:${pending.number}`, type: specialEvent.type, status: 'held', ransomEligible: Boolean(specialEvent.enemy?.ransomEligible), year: battle.year };
      battle.captives.push(captive);
      battle.player.holdingPrisonerId = captive.id;
    }
  } else if (action === 'surrender') {
    character.campaign.captivity = { status: 'active', sourceId: battle.id, year: battle.year, captor: battle.sides.enemy.name, ransom: null, sourceRuleId: 'BATTLE-SURRENDER-001' };
  } else if (action === 'flee') {
    const enemy = pending.enemy || battle.enemy;
    const skill = battle.player.mounted ? character.skills?.horsemanship : character.attributes?.dex;
    flee = executeTable87({
      roll: input.fleeRoll || rollDie(20, rng), skill,
      modifier: battle.player.mounted && !enemy.mounted ? 10 : 0,
      opponentRoll: input.enemyRoll || rollDie(20, rng), opponentSkill: enemy.primarySkill
    });
    battle.nextBattleModifier += flee.nextBattleModifier;
    if (flee.damage !== 'none') {
      const damaged = applyBattleDamage(character, battle, { damageTotal: input.enemyDamageTotal ?? rollD6Total(enemy.damageDice, rng), shieldApplies: flee.damage === 'normal_with_shield', now: iso(input.now) }, '전장에서 도주 중 입은 상처', rng);
      character = damaged.character;
      flee.injury = damaged.injury;
    }
    if (flee.weaponLoss) battle.player.weaponLost = true;
  } else if (action === 'rally') {
    rally = executeTable86({ roll: input.rallyRoll || rollDie(20, rng), battleSkill: character.skills?.battle, glory: character.gear?.gloryTotal, rallyDice: input.rallyDice, rng });
    if (rally.check.success) {
      battle.player.unitState = 'attached';
      battle.player.role = 'unit';
      battle.player.isUnitCommander = true;
      battle.player.ralliedFollowers = rally.rallied;
    } else if (rally.deserts && battle.player.isUnitCommander) {
      battle.player.unitState = 'alone';
      battle.player.isUnitCommander = false;
      rally.desertsApplied = true;
    }
  } else if (action === 'first_aid') {
    if (!input.woundId) throw new Error('응급처치할 상처를 선택하세요.');
    const treated = resolveFirstAid(character, {
      woundId: input.woundId,
      ageInHours: Math.max(0, asNumber(input.woundAgeInHours)),
      roll: input.firstAidRoll,
      healingRoll: input.healingRoll,
      now: iso(input.now)
    }, rng);
    character = treated.character;
    firstAid = treated.treatment;
  } else if (action === 'change_armor') {
    battle.player.armor = clamp(input.armor, 0, 100, battle.player.armor);
    battle.player.shield = clamp(input.shield, 0, 100, battle.player.shield);
    equipmentChange = { armor: battle.player.armor, shield: battle.player.shield, confirmedByPlayer: true };
  } else if (action === 'join_unit') {
    battle.player.unitState = 'attached';
  } else if (action === 'call_squire') {
    battle.player.squireCalled = true;
  } else if (action === 'find_unit') {
    const check = resolveD20Roll(input.awarenessRoll || rollDie(20, rng), character.skills?.awareness || 0);
    if (check.success) battle.player.unitState = 'attached';
  } else if (action === 'find_mount') {
    const mountRoll = input.mountRoll || rollDie(6, rng);
    const check = resolveD20Roll(input.horsemanshipRoll || rollDie(20, rng), character.skills?.horsemanship || 0);
    if (check.success) {
      battle.player.mounted = true;
      battle.player.hasHorse = true;
      battle.player.foundMount = mountRoll <= 4 ? 'charger' : mountRoll === 5 ? 'rouncy' : 'palfrey';
    }
  }
  const combatOutcome = exchange?.combatOutcome || (action === 'special_event' ? 'success' : action === 'flee' ? (flee.escaped ? 'disengaged' : flee.outcome) : 'disengaged');
  const withdrawal = pending.event ? meleeWithdrawal(pending.event.event) : null;
  const record = { ...pending, action, exchange, specialEvent, specialCombatResolution, rally, flee, firstAid, equipmentChange, note: String(input.note || ''), bonusGlory: specialCombatResolution?.extraGlory || 0, combatOutcome, playerWithdrawal: withdrawal?.side === 'player' ? withdrawal.kind : null, enemyWithdrawal: withdrawal?.side === 'enemy' ? withdrawal.kind : null, resolvedAt: iso(input.now) };
  battle.round = pending.number;
  battle.rounds.push(record);
  battle.pendingRound = null;
  if (withdrawal?.side === 'player') {
    battle.battlefield[withdrawal.kind === 'rout' ? 'playerRouted' : 'playerRetreated'] = true;
  } else if (withdrawal?.side === 'enemy') {
    battle.battlefield[withdrawal.kind === 'rout' ? 'enemyRouted' : 'enemyRetreated'] = true;
  }
  if (action === 'surrender' || character.campaign?.health?.pendingDeath || character.campaign?.health?.unconscious) battle.phase = 'aftermath';
  else if (action === 'withdraw') battle.phase = 'aftermath';
  else battle.phase = 'after_round';
  stageFollowerFate(character, battle, input.followerRoll || rollDie(20, rng), battle.phase === 'after_round' ? 'after_round' : battle.phase, battle.rounds.length - 1);
  if (battle.phase === 'after_round') battle.phase = getAfterRoundPhase(battle);
  battle.updatedAt = iso(input.now);
  character.campaign.massBattle = battle;
  return { character, battle, record };
};

export const resolveRoutStand = ({ roll, battleSkill, rng = Math.random }) => {
  const check = resolveD20Roll(roll, asInt(battleSkill));
  if (check.critical) return { check, rallied: true, glory: 100, foes: 0, weaponModifier: 0, enemyTableModifier: 0 };
  if (check.success) return { check, rallied: true, glory: 0, ralliedFollowers: rollDie(6, rng) + rollDie(6, rng) + 1, foes: rollD3(rng), weaponModifier: 0, enemyTableModifier: 0 };
  if (check.fumble) return { check, rallied: false, glory: 0, foes: rollDie(6, rng), weaponModifier: -10, enemyTableModifier: 10 };
  return { check, rallied: false, glory: 0, foes: rollD3(rng), weaponModifier: -5, enemyTableModifier: 5 };
};

export const resolveBattleWithdrawal = (characterValue, input = {}, rng = Math.random) => {
  let character = clone(characterValue);
  const battle = sanitizeMassBattleState(character.campaign?.massBattle);
  requirePhase(battle, ['withdrawal']);
  const latest = battle.rounds.at(-1);
  const kind = latest?.playerWithdrawal;
  const action = input.action;
  if (kind === 'retreat') {
    if (!['follow', 'stay'].includes(action)) throw new Error('퇴각에는 부대를 따르거나 전장에 남아야 합니다.');
    battle.player.unitState = action === 'stay' ? 'isolated' : 'retreated';
    battle.phase = battle.round >= battle.duration ? 'aftermath' : 'melee';
  } else {
    const allowed = pending => pending ? ['run', 'stand'] : ['escape', 'run', 'stand'];
    if (!allowed(Boolean(latest?.unitRoll?.engaged)).includes(action)) throw new Error('패주 상태에서 허용되지 않는 행동입니다.');
    if (action === 'stand') {
      const stand = resolveRoutStand({ roll: input.battleRoll || rollDie(20, rng), battleSkill: character.skills?.battle, rng });
      latest.routStand = stand;
      if (stand.glory) latest.bonusGlory = (latest.bonusGlory || 0) + stand.glory;
      battle.player.unitState = stand.rallied ? 'attached' : 'isolated';
      battle.nextBattleModifier += stand.enemyTableModifier;
      battle.phase = 'melee';
    } else {
      const enemy = latest?.enemy || battle.enemy;
      const skill = battle.player.mounted ? character.skills?.horsemanship : character.attributes?.dex;
      const flee = executeTable87({
        roll: input.fleeRoll || rollDie(20, rng), skill, modifier: action === 'run' ? -15 : 0,
        opponentRoll: input.enemyRoll || rollDie(20, rng), opponentSkill: enemy.primarySkill
      });
      latest.routFlee = flee;
      if (flee.damage !== 'none') {
        const damaged = applyBattleDamage(character, battle, { damageTotal: input.enemyDamageTotal ?? rollD6Total(enemy.damageDice, rng), shieldApplies: false, now: iso(input.now) }, '패주 중 입은 상처', rng);
        character = damaged.character;
      }
      battle.phase = flee.escaped ? 'aftermath' : 'melee';
      battle.player.unitState = flee.escaped ? 'withdrawn' : 'isolated';
    }
  }
  battle.updatedAt = iso(input.now);
  character.campaign.massBattle = battle;
  return { character, battle };
};

export const choosePursuit = (characterValue, pursue) => {
  const character = clone(characterValue);
  const battle = sanitizeMassBattleState(character.campaign?.massBattle);
  requirePhase(battle, ['pursuit_decision']);
  if (pursue && !battle.player.mounted && battle.enemy.mounted) throw new Error('기마 적은 기마 기사만 추격할 수 있습니다.');
  if (pursue) {
    battle.phase = 'pursuit';
    battle.pursuit = { round: 0, results: [] };
  } else battle.phase = battle.round >= battle.duration ? 'aftermath' : 'melee';
  character.campaign.massBattle = battle;
  return { character, battle };
};

export const endPursuit = characterValue => {
  const character = clone(characterValue);
  const battle = sanitizeMassBattleState(character.campaign?.massBattle);
  requirePhase(battle, ['pursuit']);
  if (!battle.pursuit?.round) throw new Error('추격을 시작했다면 첫 추격 라운드를 먼저 해결하세요.');
  battle.phase = 'aftermath';
  battle.player.unitState = 'pursuit_complete';
  character.campaign.massBattle = battle;
  return { character, battle };
};

export const resolvePursuitRound = (characterValue, input = {}, rng = Math.random) => {
  let character = clone(characterValue);
  const battle = sanitizeMassBattleState(character.campaign?.massBattle);
  requirePhase(battle, ['pursuit']);
  if (character.campaign?.health?.pendingDeath || character.campaign?.health?.unconscious) throw new Error('행동 불능 기사는 추격할 수 없습니다.');
  const number = battle.pursuit.round + 1;
  if (number > 2) throw new Error('한 번의 패주에서는 두 라운드만 추격할 수 있습니다.');
  let result;
  if (number === 1) {
    const enemyTableRoll = input.enemyTableRoll || rollDie(20, rng);
    const enemyRow = lookupBattleEnemy(battle.enemyTableId, enemyTableRoll);
    const enemy = battleEnemy({ ...enemyRow, name: `${enemyRow.quality} · ${enemyRow.weapon}` });
    const resolved = resolvePersonalExchange(character, battle, { ...input, enemyOverride: enemy, now: iso(input.now) }, {}, rng);
    character = resolved.character;
    result = { number, type: 'melee', enemyTableRoll, enemy, exchange: resolved.exchange, gloryRounds: 1, killed: resolved.exchange.opposed.winner === 'actor' ? 1 : 0, loot: 0 };
  } else {
    const roll = input.huntingRoll || rollDie(20, rng);
    const check = resolveD20Roll(roll, character.skills?.hunting || 0);
    const enemyCheck = resolveD20Roll(input.enemyRoll || rollDie(20, rng), battle.enemy.primarySkill);
    const opposed = resolveOpposedD20(check, enemyCheck);
    const outcome = opposed.winner === 'actor' ? (check.critical ? 'critical' : 'success')
      : opposed.actorOutcome === 'partial' ? 'partial' : check.fumble ? 'fumble' : 'failure';
    if (outcome === 'critical') result = { number, type: 'hunt', check, enemyCheck, opposed, outcome, killed: 0, enemyCamp: true, loot: (input.bootyDice || rollDie(6, rng) + rollDie(6, rng)) + 2, gloryRounds: 2 };
    else if (outcome === 'success') {
      const prudent = resolveD20Roll(input.prudentRoll || rollDie(20, rng), character.traits?.prudent || 0);
      result = { number, type: 'hunt', check, enemyCheck, opposed, outcome, prudent, killed: input.enemyCountRoll || rollDie(6, rng), captured: prudent.success, loot: 0, gloryRounds: 1 };
    } else if (outcome === 'partial') result = { number, type: 'hunt', check: { ...check, outcome }, enemyCheck, opposed, outcome, killed: input.enemyCountRoll || rollD3(rng), loot: 0, gloryRounds: 1 };
    else if (outcome === 'fumble') {
      const injuries = [];
      if (battle.player.mounted) {
        const damaged = applyBattleDamage(character, battle, { damageTotal: input.ambushDamage ?? rollD6Total(6, rng), shieldApplies: false, now: iso(input.now) }, '추격 중 기마 매복', rng);
        character = damaged.character;
        injuries.push(damaged.injury);
      } else {
        for (let strike = 0; strike < 2; strike += 1) {
          const damaged = applyBattleDamage(character, battle, { damageTotal: input.footAmbushDamage?.[strike] ?? rollD6Total(3, rng), shieldApplies: false, now: iso(input.now) }, '추격 중 보병 매복', rng);
          character = damaged.character;
          injuries.push(damaged.injury);
        }
      }
      result = { number, type: 'hunt', check, enemyCheck, opposed, outcome, killed: 0, loot: 0, gloryRounds: 0, ambushed: true, injuries };
    } else {
      const damaged = applyBattleDamage(character, battle, { damageTotal: input.armorDamage ?? rollD6Total(3, rng), shieldApplies: false, now: iso(input.now) }, '추격 중 입은 상처', rng);
      character = damaged.character;
      result = { number, type: 'hunt', check, enemyCheck, opposed, outcome, killed: 1, loot: 0, gloryRounds: 1, armorDamage: true, injury: damaged.injury };
    }
  }
  if (result.captured) battle.captives.push({ id: `${battle.id}:pursuit:${number}`, type: 'battle_enemy', status: 'held', ransomEligible: true, year: battle.year });
  battle.pursuit.round = number;
  battle.pursuit.results.push(result);
  battle.phase = number >= 2 || character.campaign?.health?.pendingDeath ? 'aftermath' : 'pursuit';
  character.campaign.massBattle = battle;
  return { character, battle, result };
};

const battleSpecialMultiplier = battle => {
  const own = battle.sides.player.size;
  const enemy = battle.sides.enemy.size;
  if (enemy >= own * 5) return 2;
  if (enemy > own * 2) return 1.5;
  if (own >= enemy * 5) return 0.5;
  if (own > enemy * 2) return 0.75;
  return 1;
};

export const calculateBattleGlory = (battleValue, result) => {
  const battle = sanitizeMassBattleState(battleValue);
  const base = BATTLE_SCALE_GLORY[battle.scale];
  const victory = { decisive_victory: 2, indecisive: 1, decisive_defeat: 0.5 }[result] || 1;
  const odds = battleSpecialMultiplier(battle);
  const participant = battle.rounds.reduce((total, round) => total + roundPaladin(base * outcomeMultiplier(round.combatOutcome) * victory * odds) + asInt(round.bonusGlory), 0);
  const pursuit = (battle.pursuit?.results || []).reduce((total, item) => total + (base * asInt(item.gloryRounds)), 0);
  const role = battle.player.role;
  const commander = role === 'army' ? roundPaladin(base * battle.round * victory)
    : role === 'battalion' ? roundPaladin((base * battle.round * victory) / 3) : 0;
  return { participant, pursuit, commander, total: participant + pursuit + commander, base, victoryMultiplier: victory, oddsMultiplier: odds };
};

export const resolveBattleAftermath = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const battle = sanitizeMassBattleState(character.campaign?.massBattle);
  requirePhase(battle, ['aftermath']);
  const victoryModifier = calculateTable89Modifier(battle.battlefield);
  const result = input.clearResult && ['decisive_victory', 'indecisive', 'decisive_defeat'].includes(input.clearResult)
    ? { table: '8-10', result: input.clearResult, fateModifier: input.clearResult === 'decisive_victory' ? -5 : input.clearResult === 'decisive_defeat' ? 5 : 0, manual: true }
    : executeTable810({ roll: input.resultRoll || rollDie(20, rng), modifier: victoryModifier });
  const armyCheck = resolveD20Roll(input.finalArmyRoll || rollDie(20, rng), battle.sides.player.armyBattle + result.fateModifier);
  const armyFate = executeTable88({ outcome: armyCheck.outcome, followerCount: battle.sides.player.size });
  battle.aftermath = {
    result, victoryModifier, armyCheck, armyFate,
    glory: calculateBattleGlory(battle, result.result),
    loot: result.result === 'decisive_victory' ? Math.max(0, asNumber(input.loot)) : 0,
    ransomClaims: battle.captives.filter(item => item.ransomEligible).map(item => ({ captiveId: item.id, amount: null, status: 'pending_chapter_12' })),
    note: String(input.note || ''), preparedAt: iso(input.now), applied: false
  };
  character.campaign.massBattle = battle;
  return { character, battle, aftermath: battle.aftermath };
};

export const finalizeMassBattle = (characterValue, now) => {
  let character = ensureEconomy(characterValue);
  const battle = sanitizeMassBattleState(character.campaign?.massBattle);
  requirePhase(battle, ['aftermath']);
  if (!battle.aftermath) throw new Error('먼저 전투 결과와 군 전체 피해를 확정하세요.');
  if (battle.aftermath.applied) return { character, battle, applied: false };
  const timestamp = iso(now);
  const glory = battle.aftermath.glory.total;
  if (glory) recordGloryAward(character, {
    id: `${battle.id}:glory`, year: battle.year, title: battle.name,
    narrative: `${battle.round}라운드 동안 대규모 전투에 참여했습니다.`, amount: glory,
    sourceRuleId: 'BATTLE-GLORY-001', sourcePage: 'Chapter 8 pp.148-149', createdAt: timestamp
  });
  if (battle.aftermath.loot) {
    character = recordEconomyTransfer(character, {
      id: `${battle.id}:loot`, year: battle.year, type: 'battle_loot', amountLivres: battle.aftermath.loot,
      label: `${battle.name} 전리품`, sourceRuleId: 'BATTLE-AFTERMATH-001 / WEALTH-INCOME-001',
      sourcePage: 'Chapter 8 pp.148-149; Chapter 12 p.197', createdAt: timestamp
    }).character;
  }
  character.campaign.captives = [...(character.campaign.captives || []), ...battle.captives].slice(-1000);
  const existingRansomIds = new Set(character.campaign.economy.ransoms.map(claim => claim.id));
  character.campaign.economy.ransoms = [
    ...character.campaign.economy.ransoms,
    ...battle.aftermath.ransomClaims
      .map((claim, index) => ({
        ...claim,
        id: claim.id || `${battle.id}:ransom:${index + 1}`,
        sourceId: battle.id,
        year: battle.year,
        sourceType: 'battle_ransom',
        direction: 'receivable',
        status: 'pending'
      }))
      .filter(claim => !existingRansomIds.has(claim.id))
  ].slice(-1000);
  character.campaign.pendingEconomy = [];
  appendChronicleEvent(character, {
    id: `${battle.id}:chronicle`, year: battle.year, type: 'battle', title: battle.name,
    narrative: `${battle.sides.player.name}은 ${battle.sides.enemy.name}과 맞섰고, 전투는 ${battle.aftermath.result.result === 'decisive_victory' ? '결정적 승리' : battle.aftermath.result.result === 'decisive_defeat' ? '결정적 패배' : '결정되지 않은 채'} 끝났습니다.`,
    glory, sourceRuleId: 'BATTLE-AFTERMATH-001', sourcePage: 'Chapter 8 pp.148-149', createdAt: timestamp
  });
  battle.aftermath.applied = true;
  battle.status = 'complete';
  battle.phase = 'complete';
  battle.completedAt = timestamp;
  character.campaign.massBattle = battle;
  character.campaign.battleHistory = [...(character.campaign.battleHistory || []), clone(battle)].slice(-100);
  return { character, battle, applied: true };
};

export const confirmMassBattleDeath = (characterValue, now) => confirmHealthDeath(characterValue, { timestamp: now });

export const resolvePlayerCaptivity = (characterValue, input = {}, now) => {
  const character = ensureEconomy(characterValue);
  const captivity = character.campaign?.captivity;
  if (!captivity || captivity.status !== 'active') throw new Error('해결할 포로 상태가 없습니다.');
  const timestamp = iso(now);
  const resolution = ['ransomed', 'released', 'escaped'].includes(input.resolution) ? input.resolution : 'released';
  const amount = input.amount === '' || input.amount == null ? null : Math.max(0, asNumber(input.amount));
  character.campaign.captivity = { ...captivity, status: resolution === 'ransomed' ? 'awaiting_ransom' : 'resolved', resolution, ransom: amount, resolvedAt: resolution === 'ransomed' ? null : timestamp };
  if (resolution === 'ransomed') {
    const claimId = `${captivity.sourceId}:player-ransom`;
    if (!character.campaign.economy.ransoms.some(claim => claim.id === claimId)) {
      character.campaign.economy.ransoms.push({
        id: claimId, sourceType: 'player_ransom', direction: 'payable', status: 'pending',
        amountDeniers: amount == null ? null : Math.round(amount * 240), sourceId: captivity.sourceId,
        year: captivity.year, sourceRuleId: 'BATTLE-SURRENDER-001'
      });
    }
    character.campaign.pendingEconomy = [];
  }
  appendChronicleEvent(character, {
    id: `${captivity.sourceId}:captivity:${resolution}`, year: captivity.year, type: 'captivity', title: resolution === 'ransomed' ? '몸값 조건이 정해지다' : '포로 생활이 끝나다',
    narrative: resolution === 'escaped' ? `${captivity.captor}의 포로 상태에서 탈출했습니다.`
      : resolution === 'ransomed' ? `${captivity.captor}와 몸값 조건을 정했으며, Chapter 12 정산 뒤 석방됩니다.`
        : `${captivity.captor}에게서 석방되었습니다.`,
    sourceRuleId: 'BATTLE-SURRENDER-001', sourcePage: 'Chapter 8 p.146', createdAt: timestamp
  });
  return { character, captivity: character.campaign.captivity };
};

const emptyMorale = () => ({ attacker: null, defender: null });
const siegeSide = (input, fallbackName, fallbackSkill) => ({
  name: String(input?.name || fallbackName), siege: clamp(input?.siege, 0, 100, fallbackSkill), stewardship: clamp(input?.stewardship, 0, 100, 10),
  intrigue: clamp(input?.intrigue, 0, 100, 10), valorous: clamp(input?.valorous, 0, 100, 15), retinue: clamp(input?.retinue, 0, 100, 10), commoners: clamp(input?.commoners, 0, 100, 10),
  troops: Math.max(0, asInt(input?.troops, 100)), equipment: Math.max(0, asInt(input?.equipment, 0)), casualties: { killed: 0, wounded: 0, captured: 0 },
  nextHealthModifier: 0, nextStewardshipModifier: 0, nextSiegeModifier: 0, nextMorale: { valorous: 0, retinue: 0, commoners: 0 }, ongoingSiegeModifier: 0, unavailable: 0
});

export const startSiege = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  if (character.campaign?.captivity?.status === 'active') throw new Error('포로 상태에서는 공성전을 시작할 수 없습니다.');
  const timestamp = iso(now);
  const originalDv = String(input.dv || '5/3').split('/').map(value => Math.max(0, asInt(value))).filter(Boolean);
  if (!originalDv.length) throw new Error('요새 DV를 바깥 방어선부터 입력하세요.');
  const siege = sanitizeSiegeState({
    id: safeId(input.id || `siege:${character.personal?.campaignYear || 767}:${timestamp}`), year: character.personal?.campaignYear || 767,
    name: String(input.name || '이름 없는 공성전'), fortress: String(input.fortress || '이름 없는 요새'), mode: input.mode === 'simple' ? 'simple' : 'advanced',
    playerSide: input.playerSide === 'defender' ? 'defender' : 'attacker', playerCommander: Boolean(input.playerCommander),
    originalDv, currentRing: 0, naturalDv: Math.max(0, asInt(input.naturalDv)), month: 1, status: 'active', phase: input.mode === 'simple' ? 'tactic' : 'health',
    sides: {
      attacker: siegeSide(input.attacker, '공격군', character.skills?.siege || 5),
      defender: siegeSide(input.defender, '수비군', 10)
    },
    originalAttackerEquipment: Math.max(0, asInt(input.attacker?.equipment)),
    turns: [], currentTurn: null, moraleRequired: emptyMorale(), result: null, firstAssaultFallen: false, createdAt: timestamp, updatedAt: timestamp
  });
  character.campaign = character.campaign || {};
  character.campaign.siege = siege;
  return { character, siege };
};

const applyTroopLoss = (side, level) => {
  const rates = SIEGE_LOSS_RATES[level];
  const base = side.troops;
  const killed = roundPaladin(base * rates.killed / 100);
  const wounded = roundPaladin(base * rates.wounded / 100);
  const captured = roundPaladin(base * rates.captured / 100);
  side.casualties.killed += killed;
  side.casualties.wounded += wounded;
  side.casualties.captured += captured;
  side.troops = Math.max(0, side.troops - killed - wounded - captured);
  return { level, killed, wounded, captured, moraleModifier: rates.moraleModifier };
};

export const resolveSiegeHealth = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const siege = sanitizeSiegeState(character.campaign?.siege);
  requirePhase(siege, ['health']);
  const turn = { month: siege.month, health: {}, tactic: null, morale: null, createdAt: iso(input.now) };
  for (const sideKey of ['attacker', 'defender']) {
    const side = siege.sides[sideKey];
    const result = executeTable811({ roll: input[`${sideKey}TroopRoll`] || rollDie(20, rng), skill: side.siege + side.nextHealthModifier, kind: 'troops' });
    side.unavailable = roundPaladin(side.troops * result.unavailablePercent / 100);
    side.siegeHealthModifier = result.siegeModifier;
    side.nextHealthModifier = result.nextHealthModifier;
    turn.health[sideKey] = result;
    if (result.moraleModifier !== null) siege.moraleRequired[sideKey] = { modifier: result.moraleModifier, reason: 'health' };
  }
  const playerSide = siege.sides[siege.playerSide];
  const personal = executeTable811({
    roll: input.playerRoll || rollDie(20, rng),
    skill: (character.skills?.siege || 0) + asInt(siege.playerSkillPenalty) + asInt(siege.playerNextHealthModifier),
    kind: 'personal'
  });
  siege.playerSkillPenalty = personal.skillPenalty;
  siege.playerNextHealthModifier = personal.nextHealthModifier;
  character.campaign.conditions = (character.campaign.conditions || []).filter(item => item.sourceId !== siege.id);
  if (personal.skillPenalty) {
    character.campaign.conditions = [...character.campaign.conditions, {
      id: `${siege.id}:illness`, sourceId: siege.id, type: 'siege_illness', skillPenalty: personal.skillPenalty,
      surgeryNeeded: personal.surgeryNeeded, status: 'active', year: siege.year, sourceRuleId: 'SIEGE-HEALTH-8-11'
    }];
  }
  if (personal.surgeryNeeded) {
    character.campaign.health = character.campaign.health || {};
    character.campaign.health.surgeryNeeded = true;
    character.campaign.health.lastUpdatedAt = iso(input.now);
  }
  turn.health.player = personal;
  turn.playerSide = siege.playerSide;
  siege.currentTurn = turn;
  siege.phase = 'tactic';
  siege.updatedAt = iso(input.now);
  character.campaign.siege = siege;
  return { character, siege, health: turn.health, playerSide };
};

const siegeAssaultModifiers = (siege, attackerEquipment, defenderEquipment) => {
  const dv = (siege.originalDv[siege.currentRing] || 0) + siege.naturalDv;
  const balance = dv + Math.max(0, asInt(defenderEquipment)) - Math.max(0, asInt(attackerEquipment));
  return { dv, attacker: balance < 0 ? -balance : 0, defender: balance > 0 ? balance : 0 };
};

export const resolveSimpleSiege = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const siege = sanitizeSiegeState(character.campaign?.siege);
  requirePhase(siege, ['tactic']);
  if (siege.mode !== 'simple') throw new Error('단순 공성 상태가 아닙니다.');
  const totalDv = siege.originalDv.reduce((sum, value) => sum + value, 0) + siege.naturalDv;
  const committedAttacker = Math.min(siege.sides.attacker.equipment, Math.max(0, asInt(input.attackerEquipment)));
  const committedDefender = Math.min(siege.sides.defender.equipment, Math.max(0, asInt(input.defenderEquipment)));
  const balance = totalDv + committedDefender - committedAttacker;
  const attackerCheck = resolveD20Roll(input.attackerRoll || rollDie(20, rng), siege.sides.attacker.siege + Math.max(0, -balance));
  const defenderCheck = resolveD20Roll(input.defenderRoll || rollDie(20, rng), siege.sides.defender.siege + Math.max(0, balance));
  const assault = executeTable812({ attackerOutcome: attackerCheck.outcome, defenderOutcome: defenderCheck.outcome });
  siege.sides.attacker.equipment -= committedAttacker;
  siege.sides.defender.equipment -= committedDefender;
  applyTroopLoss(siege.sides.attacker, assault.attackerLoss);
  applyTroopLoss(siege.sides.defender, assault.defenderLoss);
  siege.result = { winner: assault.defensesTaken ? 'attacker' : 'defender', reason: 'simple_siege', assault };
  siege.currentTurn = { month: 1, tactic: { type: 'assault', simple: true, attackerCheck, defenderCheck, assault } };
  siege.turns.push(siege.currentTurn);
  siege.phase = 'aftermath';
  character.campaign.siege = siege;
  return { character, siege, assault };
};

export const resolveSiegeTactic = (characterValue, input = {}, rng = Math.random) => {
  let character = ensureEconomy(characterValue);
  const siege = sanitizeSiegeState(character.campaign?.siege);
  requirePhase(siege, ['tactic']);
  if (siege.mode === 'simple') return resolveSimpleSiege(character, input, rng);
  const tactic = input.tactic;
  const turn = siege.currentTurn;
  if (!['assault', 'blockade', 'treachery', 'single_combat'].includes(tactic)) throw new Error('원문에 있는 월간 전술을 선택하세요.');
  if (tactic === 'assault') {
    const committedAttacker = Math.min(siege.sides.attacker.equipment, Math.max(0, asInt(input.attackerEquipment)));
    const committedDefender = Math.min(siege.sides.defender.equipment, Math.max(0, asInt(input.defenderEquipment)));
    const modifiers = siegeAssaultModifiers(siege, committedAttacker, committedDefender);
    const attackerCheck = resolveD20Roll(input.attackerRoll || rollDie(20, rng), siege.sides.attacker.siege + modifiers.attacker + asInt(siege.sides.attacker.siegeHealthModifier) + asInt(siege.sides.attacker.ongoingSiegeModifier) + asInt(siege.sides.attacker.nextSiegeModifier));
    const defenderCheck = resolveD20Roll(input.defenderRoll || rollDie(20, rng), siege.sides.defender.siege + modifiers.defender + asInt(siege.sides.defender.siegeHealthModifier) + asInt(siege.sides.defender.ongoingSiegeModifier) + asInt(siege.sides.defender.nextSiegeModifier));
    siege.sides.attacker.nextSiegeModifier = 0;
    siege.sides.defender.nextSiegeModifier = 0;
    const assault = executeTable812({ attackerOutcome: attackerCheck.outcome, defenderOutcome: defenderCheck.outcome });
    const attackerLoss = applyTroopLoss(siege.sides.attacker, assault.attackerLoss);
    const defenderLoss = applyTroopLoss(siege.sides.defender, assault.defenderLoss);
    siege.sides.attacker.equipment -= committedAttacker;
    siege.sides.defender.equipment -= committedDefender;
    if (attackerLoss.moraleModifier !== null) siege.moraleRequired.attacker = { modifier: attackerLoss.moraleModifier, reason: 'assault_loss' };
    if (defenderLoss.moraleModifier !== null) siege.moraleRequired.defender = { modifier: defenderLoss.moraleModifier, reason: 'assault_loss' };
    if (assault.defensesTaken) {
      if (siege.currentRing === 0 && siege.month === 1) siege.firstAssaultFallen = true;
      siege.moraleRequired.defender = { modifier: siege.moraleRequired.defender?.modifier || 0, reason: 'line_fallen' };
      siege.currentRing += assault.defenseLinesTaken;
      if (siege.currentRing >= siege.originalDv.length) siege.result = { winner: 'attacker', reason: 'castle_captured' };
    }
    turn.tactic = { type: tactic, attackerCheck, defenderCheck, assault, attackerLoss, defenderLoss, modifiers, committedAttacker, committedDefender };
  } else if (tactic === 'blockade') {
    for (const sideKey of ['attacker', 'defender']) {
      const side = siege.sides[sideKey];
      const result = executeTable813({ roll: input[`${sideKey}Roll`] || rollDie(20, rng), stewardship: side.stewardship, modifier: asInt(side.nextStewardshipModifier) + asInt(side.ongoingSiegeModifier) + asInt(side.nextSiegeModifier) });
      side.nextStewardshipModifier = result.nextModifier;
      side.nextSiegeModifier = 0;
      if (result.moraleModifier !== null) siege.moraleRequired[sideKey] = { modifier: result.moraleModifier, reason: 'blockade' };
      turn.tactic = { ...(turn.tactic || { type: tactic }), [sideKey]: result };
    }
  } else if (tactic === 'treachery') {
    const bribe = Math.max(0, asInt(input.bribe));
    if (siege.playerSide === 'attacker' && bribe > asNumber(character.gear?.cash)) throw new Error('보유 현금보다 많은 뇌물을 쓸 수 없습니다.');
    if (siege.playerSide === 'attacker' && bribe) character = recordEconomyTransfer(character, {
      id: `${siege.id}:treachery:${siege.month}`, year: siege.year, type: 'siege_bribe', amountLivres: -bribe,
      label: `${siege.fortress} 공성 뇌물`, sourceRuleId: 'BATTLE-SIEGE-TREACHERY-001 / WEALTH-MARKET-001',
      sourcePage: 'Chapter 8 pp.155-156; Chapter 12 p.198'
    }).character;
    const result = executeTable814({ roll: input.roll || rollDie(20, rng), intrigue: siege.sides.attacker.intrigue + siege.sides.attacker.ongoingSiegeModifier, bribe, target: input.target || 'commander' });
    if (result.moraleRequired) siege.moraleRequired.defender = { modifier: 0, reason: 'treachery', target: result.target, targetModifier: result.targetModifier };
    if (result.nextTargetModifier) {
      const key = result.target === 'commander' ? 'valorous' : result.target === 'knights' ? 'retinue' : 'commoners';
      siege.sides.defender.nextMorale[key] += result.nextTargetModifier;
    }
    turn.tactic = { type: tactic, result };
  } else {
    if (!['attacker', 'defender', 'draw'].includes(input.winner)) throw new Error('대표 결투의 판정 결과를 기록하세요.');
    turn.tactic = { type: tactic, winner: input.winner, note: String(input.note || ''), manual: true };
    if (input.winner !== 'draw') siege.result = { winner: input.winner, reason: 'single_combat' };
  }
  const needsMorale = Boolean(siege.moraleRequired.attacker || siege.moraleRequired.defender);
  siege.phase = needsMorale ? 'morale' : siege.result ? 'aftermath' : 'health';
  if (!needsMorale && !siege.result) {
    siege.turns.push(turn);
    siege.currentTurn = null;
    siege.month += 1;
  }
  character.campaign.siege = siege;
  return { character, siege, tactic: turn.tactic };
};

const moraleKeyForTarget = target => target === 'commander' ? 'valorous' : target === 'knights' ? 'retinue' : 'commoners';

const resolveSideMorale = (siege, sideKey, input, rng) => {
  const side = siege.sides[sideKey];
  const required = siege.moraleRequired[sideKey];
  if (!required) return null;
  const table = sideKey === 'defender' ? executeTable815 : executeTable816;
  const results = [];
  let immediate = 0;
  for (const category of ['valorous', 'retinue', 'commoners']) {
    const targetPenalty = required.target && moraleKeyForTarget(required.target) === category ? asInt(required.targetModifier) : 0;
    const target = side[category] + side.nextMorale[category] + asInt(required.modifier) + immediate + targetPenalty;
    const check = resolveD20Roll(input?.[`${category}Roll`] || rollDie(20, rng), target);
    const effect = table({ category, outcome: check.outcome });
    results.push({ category, check, effect });
    side.nextMorale[category] = effect[`next${category[0].toUpperCase()}${category.slice(1)}`] || 0;
    immediate = effect.immediateRetinue ?? effect.immediateCommoners ?? 0;
    if (effect.nextSiegeModifier) side.nextSiegeModifier = effect.nextSiegeModifier;
    if (effect.ongoingSiegeModifier !== undefined) side.ongoingSiegeModifier = effect.ongoingSiegeModifier;
    if (effect.clearSiegePenalty) side.ongoingSiegeModifier = 0;
    if (effect.end) return { side: sideKey, results, end: effect.end, honorLoss: effect.honorLoss || 0, loseEquipment: effect.loseEquipment, retainEquipment: effect.retainEquipment };
  }
  return { side: sideKey, results, end: null, honorLoss: 0 };
};

export const resolveSiegeMorale = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const siege = sanitizeSiegeState(character.campaign?.siege);
  requirePhase(siege, ['morale']);
  const attacker = resolveSideMorale(siege, 'attacker', input.attacker, rng);
  const defender = resolveSideMorale(siege, 'defender', input.defender, rng);
  const endings = [attacker, defender].filter(Boolean);
  endings.forEach(result => {
    if (result.honorLoss && siege.playerSide === result.side) character.passions.honor = Math.max(0, asInt(character.passions?.honor) - result.honorLoss);
    if (result.loseEquipment) siege.sides[result.side].equipment = 0;
    if (!result.end) return;
    if (result.side === 'attacker') siege.result = { winner: 'defender', reason: result.end };
    else siege.result = { winner: 'attacker', reason: result.end };
  });
  siege.currentTurn.morale = { attacker, defender };
  siege.turns.push(siege.currentTurn);
  siege.currentTurn = null;
  siege.moraleRequired = emptyMorale();
  siege.phase = siege.result ? 'aftermath' : 'health';
  if (!siege.result) siege.month += 1;
  character.campaign.siege = siege;
  return { character, siege, morale: { attacker, defender } };
};

export const withdrawFromSiege = (characterValue, side = 'attacker') => {
  const character = clone(characterValue);
  const siege = sanitizeSiegeState(character.campaign?.siege);
  if (!siege || siege.status !== 'active' || siege.phase === 'complete') throw new Error('종료할 진행 중 공성전이 없습니다.');
  siege.result = { winner: side === 'attacker' ? 'defender' : 'attacker', reason: 'manual_withdrawal' };
  siege.phase = 'aftermath';
  character.campaign.siege = siege;
  return { character, siege };
};

export const calculateSiegeGlory = siegeValue => {
  const siege = sanitizeSiegeState(siegeValue);
  const winner = siege.result?.winner;
  const playerWon = winner === siege.playerSide;
  if (!playerWon) return { participant: 0, commander: 0, total: 0 };
  const totalDv = siege.originalDv.reduce((sum, value) => sum + value, 0) + siege.naturalDv;
  const months = Math.max(1, siege.turns.length || siege.month);
  let participant = totalDv * months;
  if (siege.playerSide === 'attacker' && siege.firstAssaultFallen) participant += 10;
  if (siege.playerSide === 'defender' && winner === 'defender') participant *= 2;
  if (months > 12) participant *= 2;
  const originalAttackerEquipment = asInt(siege.originalAttackerEquipment ?? siege.sides.attacker.equipment);
  if (siege.playerSide === 'defender' && originalAttackerEquipment >= totalDv * 3) participant *= 2;
  let commander = 0;
  if (siege.playerCommander) {
    siege.turns.forEach(turn => {
      const tactic = turn.tactic;
      if (!tactic) return;
      if (tactic.type === 'assault') {
        const check = tactic[`${siege.playerSide}Check`];
        commander += roundPaladin(siege.sides[siege.playerSide].siege * commanderMultiplier(check?.outcome));
      } else if (tactic.type === 'blockade') {
        const check = tactic[siege.playerSide]?.check;
        commander += roundPaladin(siege.sides[siege.playerSide].stewardship * commanderMultiplier(check?.outcome));
      } else if (tactic.type === 'treachery' && siege.playerSide === 'attacker') {
        commander += roundPaladin(siege.sides.attacker.intrigue * commanderMultiplier(tactic.result?.check?.outcome));
      }
    });
  }
  return { participant: roundPaladin(participant), commander, total: roundPaladin(participant) + commander, totalDv, months };
};

export const finalizeSiege = (characterValue, now) => {
  const character = clone(characterValue);
  const siege = sanitizeSiegeState(character.campaign?.siege);
  requirePhase(siege, ['aftermath']);
  const timestamp = iso(now);
  const glory = calculateSiegeGlory(siege);
  if (glory.total) recordGloryAward(character, {
    id: `${siege.id}:glory`, year: siege.year, title: `${siege.fortress} 공성전`,
    narrative: `${glory.months}개월의 공성전에서 승리했습니다.`, amount: glory.total,
    sourceRuleId: 'SIEGE-GLORY-001', sourcePage: 'Chapter 8 pp.160-161', createdAt: timestamp
  });
  if (siege.result?.winner === 'attacker') {
    character.campaign.captives = [...(character.campaign.captives || []), {
      id: `${siege.id}:castle-captives`, type: 'castle_nobles', status: 'pending_gm_escape_or_death',
      sourceId: siege.id, year: siege.year, sourceRuleId: 'SIEGE-CAPTURE-001'
    }].slice(-1000);
  }
  character.campaign.fortresses = [...(character.campaign.fortresses || []).filter(item => item.id !== siege.fortress), {
    id: siege.fortress, name: siege.fortress, dv: siege.originalDv, status: siege.result?.winner === 'attacker' ? 'captured' : 'held',
    controllingSide: siege.result?.winner, lastSiegeId: siege.id, year: siege.year
  }].slice(-100);
  appendChronicleEvent(character, {
    id: `${siege.id}:chronicle`, year: siege.year, type: 'siege', title: `${siege.fortress} 공성전`,
    narrative: `${siege.name}은 ${Math.max(1, siege.turns.length)}개월 이어졌고 ${siege.result?.winner === 'attacker' ? '공격군이 요새를 차지했습니다' : '수비군이 요새를 지켰습니다'}.`,
    glory: glory.total, sourceRuleId: 'SIEGE-AFTERMATH-001', sourcePage: 'Chapter 8 pp.156-161', createdAt: timestamp
  });
  siege.glory = glory;
  siege.status = 'complete';
  siege.phase = 'complete';
  siege.completedAt = timestamp;
  character.campaign.siege = siege;
  character.campaign.siegeHistory = [...(character.campaign.siegeHistory || []), clone(siege)].slice(-100);
  return { character, siege, glory };
};

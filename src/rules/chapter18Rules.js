import {
  CHAPTER_18_ADVENTURE_DEFAULTS,
  CHAPTER_18_CREATURE_BY_ID,
  CHAPTER_18_CREATURES,
  CHAPTER_18_HUNT_MAP
} from '../data/chapter18Creatures.js';
import { resolveD20Roll, resolveOpposedD20, rollDie, roundPaladin } from './coreRules.js';
import { applyCharacterDamage, confirmHealthDeath, resolveHazard, sanitizeHealthState } from './combatRules.js';
import { concludeChapter7Combat, startChapter7Combat } from './chapter7CombatRules.js';
import { appendChronicleEvent, recordGloryAward, recordHonorChange } from './ledgerRules.js';
import { triggerMadness } from './personalityMagicRules.js';

const clone = value => JSON.parse(JSON.stringify(value));
const asNumber = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const asInt = (value, fallback = 0) => Math.trunc(asNumber(value, fallback));
const iso = value => typeof value === 'string' ? value : (value || new Date()).toISOString();
const safeId = value => String(value || '').replace(/[^a-z0-9:_-]/gi, '_');
const list = value => Array.isArray(value) ? value : [];
const suppliedDie = (value, sides, rng) => value === undefined || value === null || value === '' ? rollDie(sides, rng) : asInt(value);

export const createChapter18Ledger = () => ({ engineVersion: 1, active: null, history: [] });

export const sanitizeChapter18Ledger = value => {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const sanitizeEncounter = encounter => encounter && typeof encounter === 'object' ? {
    ...clone(encounter),
    id: safeId(encounter.id || 'chapter18:migrated'),
    status: ['active', 'completed', 'aborted'].includes(encounter.status) ? encounter.status : 'active',
    creatureIds: list(encounter.creatureIds).filter(id => Object.hasOwn(CHAPTER_18_CREATURE_BY_ID, id)),
    opponentMap: encounter.opponentMap && typeof encounter.opponentMap === 'object' ? clone(encounter.opponentMap) : {},
    attackSelections: encounter.attackSelections && typeof encounter.attackSelections === 'object' ? clone(encounter.attackSelections) : {},
    pendingChecks: list(encounter.pendingChecks).filter(check => check && typeof check === 'object').slice(-50),
    pendingSpecial: encounter.pendingSpecial && typeof encounter.pendingSpecial === 'object' ? clone(encounter.pendingSpecial) : null,
    ongoingEffects: list(encounter.ongoingEffects).filter(effect => effect && typeof effect === 'object').slice(-50),
    abilityRecords: list(encounter.abilityRecords).filter(record => record && typeof record === 'object').slice(-100),
    appliedTransactions: list(encounter.appliedTransactions).filter(id => typeof id === 'string').slice(-500),
    logs: list(encounter.logs).filter(log => log && typeof log === 'object').slice(-250)
  } : null;
  return {
    engineVersion: 1,
    active: sanitizeEncounter(source.active),
    history: list(source.history).map(sanitizeEncounter).filter(Boolean).slice(-100)
  };
};

export const getChapter18Creature = id => CHAPTER_18_CREATURE_BY_ID[id] || null;
export const listChapter18Creatures = options => CHAPTER_18_CREATURES.filter(creature => !options?.category || creature.category === options.category);
export const getChapter18HuntCreatureId = name => CHAPTER_18_HUNT_MAP[name] || null;
export const getChapter18AdventureDefaults = adventureId => CHAPTER_18_ADVENTURE_DEFAULTS[adventureId] || [];

const scalar = (value, supplied, label) => {
  if (value && typeof value === 'object' && Number.isFinite(Number(value.min)) && Number.isFinite(Number(value.max))) {
    const result = Number(supplied);
    if (!Number.isFinite(result) || result < Number(value.min) || result > Number(value.max)) {
      throw new RangeError(`${label} 값은 원문 범위 ${value.min}-${value.max} 안에서 GM이 확정해야 합니다.`);
    }
    return Math.trunc(result);
  }
  return asInt(value);
};

const armorTypeFor = creature => {
  if (creature.category !== 'human') return 'none';
  if (asInt(creature.armor) >= 8) return 'chainmail';
  if (asInt(creature.armor) > 0) return 'leather';
  return 'none';
};

export const chapter18MountToHorse = (creatureId, input = {}) => {
  const creature = getChapter18Creature(creatureId);
  if (!creature || (creature.category !== 'mount' && !['pegasus', 'hippogriff'].includes(creature.id))) throw new RangeError('Chapter 18 탈것을 찾을 수 없습니다.');
  const overrides = input.overrides || {};
  const standardProfile = ['rouncy', 'charger', 'courser', 'destrier'].includes(creature.id)
    ? creature.id
    : creature.id === 'andalusian_charger' ? 'charger' : 'charger';
  return {
    id: String(input.id || `horse:${creature.id}`), chapter18Id: creature.id, profileKey: standardProfile,
    name: String(input.name || creature.name), type: creature.name,
    siz: scalar(creature.stats.siz, overrides.siz, `${creature.name} SIZ`),
    dex: scalar(creature.stats.dex, overrides.dex, `${creature.name} DEX`),
    str: scalar(creature.stats.str, overrides.str, `${creature.name} STR`),
    con: scalar(creature.stats.con, overrides.con, `${creature.name} CON`),
    damageDice: scalar(creature.damageDice, overrides.damageDice, `${creature.name} Damage`),
    baseArmor: scalar(creature.armor, overrides.armor, `${creature.name} Armor`),
    move: asInt(creature.move), currentHp: scalar(creature.hp, overrides.hp, `${creature.name} Hit Points`),
    majorWoundThreshold: creature.majorWound ?? null, unconsciousThreshold: creature.unconscious ?? null,
    combatTrained: creature.category === 'enchanted' || creature.training?.includes('combat'), huntTrained: creature.training?.includes('hunt'),
    attackTrained: Boolean(input.attackTrained || creature.training?.includes('attack')),
    lanceAttackModifier: asInt(creature.riderLance?.skillModifier), lanceDamageDice: creature.riderLance?.damageDice ?? null,
    armorType: input.armorType, armorBonus: input.armorBonus, movementDexPenalty: input.movementDexPenalty
  };
};

const findAttack = (creature, attackId) => {
  if (!creature.attacks.length) return null;
  if (!attackId && creature.attacks.length === 1) return creature.attacks[0];
  const selected = creature.attacks.find(attack => attack.id === attackId);
  if (!selected) throw new RangeError(`${creature.name}의 원문 공격을 선택해야 합니다.`);
  return selected;
};

const attackProfile = (creature, selected) => selected ? {
  ...clone(selected),
  damageDice: selected.damageDice == null ? scalar(creature.damageDice, null, `${creature.name} Damage`) : asInt(selected.damageDice),
  actsAfterIncapacitation: creature.specials?.some(special => special.effect === 'acts_one_round_after_incapacitation') || false
} : { id: 'no_listed_attack', name: 'No listed attack', skill: 0, noDamage: true };

export const chapter18CreatureToOpponent = (creatureId, input = {}) => {
  const creature = getChapter18Creature(creatureId);
  if (!creature) throw new RangeError('Chapter 18 canonical registry에서 대상을 찾을 수 없습니다.');
  const overrides = input.overrides || {};
  const siz = scalar(creature.stats.siz, overrides.siz, `${creature.name} SIZ`);
  const damageDice = scalar(creature.damageDice, overrides.damageDice, `${creature.name} Damage`);
  const armor = scalar(creature.armor, overrides.armor, `${creature.name} Armor`);
  const con = scalar(creature.stats.con, overrides.con, `${creature.name} CON`);
  const maxHp = scalar(creature.hp, overrides.hp, `${creature.name} Hit Points`);
  const selected = findAttack(creature, input.attackId);
  const profile = attackProfile(creature, selected);
  const mount = input.mountId && getChapter18Creature(input.mountId)?.category === 'mount'
    ? chapter18MountToHorse(input.mountId, input.mountInput || {})
    : null;
  const id = safeId(input.opponentId || `chapter18:${creature.id}:${input.index ?? 0}`);
  return {
    id,
    name: String(input.name || creature.name),
    chapter18Id: creature.id,
    sourcePage: creature.sourcePage,
    skill: asInt(selected?.skill),
    unarmed: asInt(selected?.kind === 'grapple' ? selected.skill : creature.attacks.find(attack => attack.weaponId === 'unarmed')?.skill, selected?.skill),
    rangedSkill: asInt(selected?.kind === 'ranged' ? selected.skill : creature.attacks.find(attack => attack.kind === 'ranged')?.skill),
    dex: scalar(creature.stats.dex, overrides.dex, `${creature.name} DEX`),
    str: scalar(creature.stats.str, overrides.str, `${creature.name} STR`),
    siz,
    con,
    currentHp: maxHp,
    maxHp,
    majorWoundThreshold: creature.majorWound ?? null,
    unconsciousThreshold: creature.unconscious ?? null,
    damageDice,
    weaponId: selected?.weaponId || 'natural',
    missileWeaponId: selected?.missileWeaponId || 'bow',
    armor,
    armorType: armorTypeFor(creature),
    armorDexModifier: 0,
    shield: asInt(creature.shield),
    mounted: Boolean(mount),
    horse: mount,
    movementRate: asInt(creature.move),
    distance: Math.max(0, asNumber(input.distance, selected?.kind === 'ranged' ? 20 : 1)),
    attackOptions: creature.attacks.map(option => attackProfile(creature, option)),
    selectedAttackId: selected?.id || null,
    attackProfile: profile,
    immunities: clone(creature.immunities || []),
    vulnerabilities: clone(creature.vulnerabilities || []),
    combatRestrictions: clone(creature.combatRestrictions || []),
    healingRate: creature.healingRate ?? null,
    status: 'active'
  };
};

const checkKey = check => `${check.trait}:${check.sourceCreatureId}:${check.reason || ''}`;

const encounterChecks = (creatures, input) => {
  const partySize = Math.max(1, asInt(input.partySize, 1));
  const checks = [];
  creatures.forEach(creature => {
    const valorousModifier = creature.modifiers?.valorous;
    if (creature.magical || valorousModifier != null || input.fierceCreatureIds?.includes(creature.id)) {
      checks.push({ trait: 'valorous', modifier: roundPaladin(asNumber(valorousModifier) / partySize), sourceCreatureId: creature.id, sourcePage: creature.sourcePage, reason: 'attack_fierce_creature' });
    }
    list(creature.requiredChecks).forEach(required => checks.push({ ...clone(required), modifier: roundPaladin(asNumber(required.modifier) / partySize), sourceCreatureId: creature.id, sourcePage: creature.sourcePage }));
  });
  return checks.filter((check, index) => checks.findIndex(candidate => checkKey(candidate) === checkKey(check)) === index);
};

const requireEncounter = character => {
  const ledger = sanitizeChapter18Ledger(character.campaign?.chapter18);
  if (!ledger.active || ledger.active.status !== 'active') throw new RangeError('진행 중인 Chapter 18 encounter가 필요합니다.');
  character.campaign.chapter18 = ledger;
  return ledger.active;
};

export const startChapter18Encounter = (characterValue, input = {}, now) => {
  let character = clone(characterValue);
  character.campaign = character.campaign || {};
  const ledger = sanitizeChapter18Ledger(character.campaign.chapter18);
  if (ledger.active?.status === 'active') throw new RangeError('이미 Chapter 18 encounter가 진행 중입니다.');
  if (character.campaign.combat?.status === 'active') throw new RangeError('진행 중인 Chapter 7 전투를 먼저 마쳐야 합니다.');
  const creatureIds = list(input.creatureIds).length ? input.creatureIds : [input.creatureId];
  const creatures = creatureIds.map(getChapter18Creature);
  if (!creatures.length || creatures.some(creature => !creature)) throw new RangeError('Chapter 18 대상을 선택해야 합니다.');
  const timestamp = iso(now);
  const encounterId = safeId(input.id || `chapter18:${character.personal?.campaignYear || 767}:${timestamp}`);
  const attackSelections = input.attackSelections || {};
  const opponents = creatures.map((creature, index) => chapter18CreatureToOpponent(creature.id, {
    index,
    opponentId: `${encounterId}:opponent:${index + 1}`,
    attackId: attackSelections[index] || attackSelections[creature.id] || input.attackId,
    overrides: input.overrides?.[index] || input.overrides?.[creature.id] || input.overrides,
    mountId: input.mountSelections?.[index] || input.mountSelections?.[creature.id] || input.mountId,
    mountInput: input.mountInputs?.[index] || input.mountInputs?.[creature.id] || input.mountInput,
    distance: input.distances?.[index] ?? input.distance
  }));
  const pendingChecks = encounterChecks(creatures, input);
  const encounter = {
    id: encounterId,
    year: asInt(character.personal?.campaignYear, 767),
    status: 'active',
    creatureIds: creatures.map(creature => creature.id),
    opponentMap: Object.fromEntries(opponents.map(opponent => [opponent.id, opponent.chapter18Id])),
    attackSelections: Object.fromEntries(opponents.map(opponent => [opponent.id, opponent.selectedAttackId])),
    partySize: Math.max(1, asInt(input.partySize, 1)),
    victors: Math.max(1, asInt(input.victors, input.partySize || 1)),
    pendingChecks,
    pendingSpecial: null,
    ongoingEffects: [],
    abilityRecords: [],
    appliedTransactions: [],
    logs: [{ id: `${encounterId}:started`, type: 'encounter_started', createdAt: timestamp }],
    returnContext: input.returnContext && typeof input.returnContext === 'object' ? clone(input.returnContext) : null,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  character.campaign.chapter18 = { ...ledger, active: encounter };
  character = startChapter7Combat(character, {
    id: input.combatId || `${encounterId}:combat`,
    source: `chapter_18:${creatures.map(creature => creature.id).join(',')}`,
    player: input.player,
    opponents,
    openingModifier: input.openingModifier,
    openingModifierSource: input.openingModifierSource,
    externalGate: pendingChecks.length ? { type: 'chapter_18', encounterId, status: 'pending' } : null,
    returnContext: { ...(input.returnContext || {}), type: input.returnContext?.type || 'chapter_18', chapter18EncounterId: encounterId }
  }, now);
  character.campaign.schemaVersion = 12;
  return { character, encounter: character.campaign.chapter18.active, combat: character.campaign.combat };
};

const syncGate = (character, encounter) => {
  const combat = character.campaign?.combat;
  if (!combat || combat.status !== 'active') return;
  if (encounter.gateOutcome) combat.externalGate = { type: 'chapter_18', encounterId: encounter.id, status: 'blocked', outcome: encounter.gateOutcome };
  else if (!encounter.pendingChecks.length && !encounter.fearDelay) combat.externalGate = combat.externalGate?.type === 'chapter_18' ? null : combat.externalGate;
  else combat.externalGate = { type: 'chapter_18', encounterId: encounter.id, status: 'pending' };
};

export const resolveChapter18Gate = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const encounter = requireEncounter(character);
  if (encounter.fearDelay) throw new RangeError('공포 또는 주저함의 남은 라운드를 먼저 진행하세요.');
  const pending = encounter.pendingChecks[0];
  if (!pending) return { character, encounter, applied: false };
  const traitValue = asInt(character.traits?.[pending.trait]) + asInt(character.attributes?.magicValorousBonus && pending.trait === 'valorous' ? character.attributes.magicValorousBonus : 0);
  const target = traitValue + asInt(pending.modifier);
  const roll = Math.min(20, Math.max(1, suppliedDie(input.roll, 20, rng)));
  const check = resolveD20Roll(roll, target);
  const record = { id: `${encounter.id}:gate:${encounter.logs.length + 1}`, type: 'gate_check', ...clone(pending), target, check, createdAt: iso(input.now) };
  if (pending.trait === 'valorous') {
    if (check.fumble) {
      encounter.fearDelay = { type: 'flee', rounds: Math.max(1, suppliedDie(input.fleeRounds, 6, rng)), check: record.id };
    } else if (!check.success) encounter.fearDelay = { type: 'hesitate', rounds: 1, check: record.id };
    else {
      encounter.pendingChecks.shift();
      encounter.valorousPassed = true;
    }
  } else if (pending.trait === 'prudent' && pending.effect === 'refrain') {
    encounter.pendingChecks.shift();
    if (check.success) encounter.gateOutcome = 'required_prudent_refrain';
  } else if (pending.trait === 'cruel' && pending.effect === 'required_to_attack') {
    if (check.success) encounter.pendingChecks.shift();
  } else {
    if (check.success) encounter.pendingChecks.shift();
  }
  encounter.logs.push(record);
  encounter.updatedAt = iso(input.now);
  syncGate(character, encounter);
  return { character, encounter, check, pending, applied: true };
};

export const advanceChapter18FearDelay = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const encounter = requireEncounter(character);
  if (!encounter.fearDelay) throw new RangeError('진행할 주저함 또는 공포 상태가 없습니다.');
  encounter.fearDelay.rounds = Math.max(0, asInt(encounter.fearDelay.rounds) - Math.max(1, asInt(input.rounds, 1)));
  if (!encounter.fearDelay.rounds) encounter.fearDelay = null;
  encounter.updatedAt = iso(now);
  syncGate(character, encounter);
  return { character, encounter };
};

export const resolveChapter18PrudentWithdrawal = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const encounter = requireEncounter(character);
  if (!encounter.valorousPassed) throw new RangeError('원문상 Valorous 판정에 성공한 뒤에만 Prudent로 전투를 피할 수 있습니다.');
  if (encounter.pendingChecks.length || encounter.fearDelay) throw new RangeError('진행 중인 원문 판정을 먼저 해결하세요.');
  if (encounter.prudentAttempted) throw new RangeError('이 조우의 Prudent 선택은 이미 판정했습니다.');
  const creature = getChapter18Creature(input.creatureId || encounter.creatureIds[0]);
  const modifier = roundPaladin(asNumber(creature?.modifiers?.prudent) / Math.max(1, encounter.partySize));
  const roll = Math.min(20, Math.max(1, suppliedDie(input.roll, 20, rng)));
  const check = resolveD20Roll(roll, asInt(character.traits?.prudent) + modifier);
  encounter.prudentAttempted = true;
  encounter.logs.push({ id: `${encounter.id}:prudent:${encounter.logs.length + 1}`, type: 'prudent_withdrawal', creatureId: creature?.id, modifier, check, createdAt: iso(input.now) });
  if (check.success) encounter.gateOutcome = 'prudent_withdrawal';
  syncGate(character, encounter);
  return { character, encounter, check };
};

export const selectChapter18Attack = (characterValue, input = {}) => {
  const character = clone(characterValue);
  const encounter = requireEncounter(character);
  const combat = character.campaign?.combat;
  if (!combat || combat.status !== 'active' || combat.phase !== 'determination') throw new RangeError('행동 선언 전에만 creature 공격을 선택할 수 있습니다.');
  const opponent = combat.opponents.find(item => item.id === input.opponentId);
  if (!opponent?.chapter18Id) throw new RangeError('Chapter 18 전투 참가자를 찾을 수 없습니다.');
  const creature = getChapter18Creature(opponent.chapter18Id);
  const selected = findAttack(creature, input.attackId);
  if (selected.requiresTargetProne && !combat.player.prone) throw new RangeError('이 공격은 원문상 넘어진 대상에게만 사용할 수 있습니다.');
  if (selected.groundOnly && input.airborne === true) throw new RangeError('이 공격은 지상에서만 사용할 수 있습니다.');
  opponent.selectedAttackId = selected.id;
  opponent.attackProfile = attackProfile(creature, selected);
  opponent.skill = asInt(selected.skill);
  opponent.unarmed = selected.kind === 'grapple' ? asInt(selected.skill) : opponent.unarmed;
  opponent.rangedSkill = selected.kind === 'ranged' ? asInt(selected.skill) : opponent.rangedSkill;
  opponent.weaponId = selected.weaponId || 'natural';
  opponent.missileWeaponId = selected.missileWeaponId || opponent.missileWeaponId;
  encounter.attackSelections[opponent.id] = selected.id;
  return { character, encounter, opponent, attack: selected };
};

export const resolveChapter18Avoidance = (input = {}, rng = Math.random) => {
  const creature = getChapter18Creature(input.creatureId);
  const avoidance = asInt(input.avoidance, creature?.avoidance);
  if (avoidance <= 0) throw new RangeError('원문 Avoidance가 있는 Chapter 18 대상을 선택해야 합니다.');
  const hunterRoll = Math.min(20, Math.max(1, suppliedDie(input.hunterRoll, 20, rng)));
  const creatureRoll = Math.min(20, Math.max(1, suppliedDie(input.creatureRoll, 20, rng)));
  const hunterCheck = resolveD20Roll(hunterRoll, asInt(input.hunting) + asInt(input.modifier));
  const avoidanceCheck = resolveD20Roll(creatureRoll, avoidance);
  return { creatureId: creature?.id || null, avoidance, hunterCheck, avoidanceCheck, opposed: resolveOpposedD20(hunterCheck, avoidanceCheck), sourcePage: 380 };
};

const successfulSpecialHits = combat => list(combat?.pending?.exchanges).flatMap(exchange => exchange.specialHit ? [exchange.specialHit] : []);
const rollDice = (count, rng, supplied) => {
  if (Array.isArray(supplied) && supplied.length === count) return supplied.reduce((sum, value) => sum + Math.min(6, Math.max(1, asInt(value))), 0);
  return Array.from({ length: count }, () => rollDie(6, rng)).reduce((sum, value) => sum + value, 0);
};

export const applyChapter18RoundEffects = (characterValue, input = {}, rng = Math.random) => {
  let character = clone(characterValue);
  let encounter = requireEncounter(character);
  const combat = character.campaign?.combat;
  if (!combat?.pending || combat.phase !== 'movement') throw new RangeError('Chapter 7 피해 적용 뒤에만 특수 결과를 처리할 수 있습니다.');
  const transactionId = `${combat.pending.id}:chapter18`;
  if (encounter.appliedTransactions.includes(transactionId)) return { character, encounter, applied: false };
  for (const hit of successfulSpecialHits(combat)) {
    const opponent = combat.opponents.find(item => item.id === hit.attackerId);
    const creature = getChapter18Creature(opponent?.chapter18Id);
    const selected = creature?.attacks.find(attack => attack.id === hit.attackId);
    if (!selected) continue;
    if (selected.effect === 'instant_death') {
      character.attributes.currentHp = 0;
      character.campaign.health = sanitizeHealthState({ ...(character.campaign.health || {}), pendingDeath: { reason: `${creature.name}의 Gaze`, due: 'immediate' } }, character.attributes);
      character = confirmHealthDeath(character, { cause: `${creature.name}의 Gaze`, timestamp: input.now }).character;
      encounter = requireEncounter(character);
    } else if (selected.effect === 'poison') {
      character = resolveHazard(character, { type: 'poison', potencyDice: selected.potencyDice, damageTotal: input.poisonTotal, now: input.now }, rng).character;
      encounter = requireEncounter(character);
    } else if (selected.effect === 'madness_poison') {
      const potency = rollDice(selected.potencyDice, rng, input.poisonRolls);
      if (potency > asInt(character.attributes?.con)) {
        character = triggerMadness(character, {
          conditionId: `${transactionId}:madness`,
          transactionId: `${transactionId}:madness:triggered`,
          passionKey: '',
          externalSource: 'Basilisk hydrophobia',
          sourcePage: `Ch.18 p.${creature.sourcePage}`,
          note: `Potency ${potency}가 CON을 넘어 물에 대한 혐오를 동반한 Madness 발생`
        }, input.now).character;
        encounter = requireEncounter(character);
      }
    } else if (selected.effect === 'ongoing_poison_damage') {
      encounter.ongoingEffects.push({ id: `${transactionId}:ongoing`, type: 'poison_damage', damage: selected.damagePerRound, stopRoll: selected.stopRoll, active: true, appliedRounds: [] });
    } else if (selected.effect === 'throw_damage') {
      const damage = rollDice(selected.throwDamageDice, rng, input.throwDamageRolls);
      character = applyCharacterDamage(character, {
        rolledDamage: damage, armor: 0, shield: 0, shieldApplies: false, direct: true,
        year: encounter.year, now: input.now, source: `${creature.name}의 Grapple and Throw`,
        sourceRuleId: 'CH18-ELEPHANT-THROW', sourcePage: `Ch.18 p.${creature.sourcePage}`
      }, rng).character;
      encounter = requireEncounter(character);
    } else if (selected.effect === 'siren_song') {
      const songRoll = Math.min(20, Math.max(1, suppliedDie(input.songRoll, 20, rng)));
      const chasteRoll = Math.min(20, Math.max(1, suppliedDie(input.chasteRoll, 20, rng)));
      const opposed = resolveOpposedD20(resolveD20Roll(chasteRoll, asInt(character.traits?.chaste)), resolveD20Roll(songRoll, selected.skill));
      if (opposed.winner !== 'actor') encounter.pendingSpecial = { id: `${transactionId}:siren`, type: 'siren_song', options: ['lure_to_doom', 'magical_sleep'], opposed, sourcePage: creature.sourcePage };
    } else if (selected.effect === 'grapple_drop' && asInt(character.attributes?.siz) <= asInt(selected.maxTargetSiz)) {
      encounter.pendingSpecial = { id: `${transactionId}:griffin_drop`, type: 'griffin_drop', remainingMoveYards: null, sourcePage: creature.sourcePage };
    } else if (['gm_magic', 'gm_fire'].includes(selected.effect)) {
      encounter.pendingSpecial = { id: `${transactionId}:${selected.effect}`, type: selected.effect, noteRequired: true, sourcePage: creature.sourcePage };
    }
  }
  encounter.appliedTransactions.push(transactionId);
  encounter.updatedAt = iso(input.now);
  return { character, encounter, applied: true };
};

export const resolveChapter18PendingSpecial = (characterValue, input = {}, rng = Math.random) => {
  let character = clone(characterValue);
  const encounter = requireEncounter(character);
  const pending = encounter.pendingSpecial;
  if (!pending) throw new RangeError('해결할 Chapter 18 특수 결과가 없습니다.');
  if (encounter.appliedTransactions.includes(`${pending.id}:resolved`)) return { character, encounter, applied: false };
  let result;
  if (pending.type === 'griffin_drop') {
    const yards = Math.max(0, asInt(input.remainingMoveYards));
    character = resolveHazard(character, { type: 'fall', distanceFeet: yards * 3, damageTotal: input.damageTotal, now: input.now }, rng).character;
    result = { remainingMoveYards: yards };
  } else if (pending.type === 'siren_song') {
    if (!pending.options.includes(input.choice)) throw new RangeError('원문 Siren 결과 중 하나를 GM이 확정해야 합니다.');
    const condition = { id: pending.id, type: input.choice, year: encounter.year, sourceRuleId: 'CH18-SPECIAL', sourcePage: 'Ch.18 p.387', note: String(input.note || '') };
    character.campaign.conditions = [...list(character.campaign.conditions).filter(item => item.id !== condition.id), condition].slice(-100);
    result = condition;
  } else {
    if (!String(input.note || '').trim()) throw new RangeError('원문이 GM에게 맡긴 마법 결과를 기록해야 합니다.');
    result = { note: String(input.note) };
  }
  encounter.appliedTransactions.push(`${pending.id}:resolved`);
  encounter.logs.push({ id: `${pending.id}:log`, type: 'special_resolved', pendingType: pending.type, result, createdAt: iso(input.now) });
  encounter.pendingSpecial = null;
  return { character, encounter, result, applied: true };
};

export const advanceChapter18Round = (characterValue, input = {}, rng = Math.random) => {
  let character = clone(characterValue);
  let encounter = requireEncounter(character);
  const combat = character.campaign?.combat;
  if (!combat || combat.status !== 'active') return { character, encounter, applied: false };
  const roundId = `${encounter.id}:round:${combat.round}`;
  if (encounter.appliedTransactions.includes(roundId)) return { character, encounter, applied: false };
  for (const opponent of combat.opponents) {
    const creature = getChapter18Creature(opponent.chapter18Id);
    if (creature?.specials?.some(special => special.id === 'regeneration') || creature?.healingRate === '1d6/round') {
      const amount = Math.max(1, suppliedDie(input.regenerationRolls?.[opponent.id], 6, rng));
      opponent.currentHp = Math.min(opponent.maxHp, opponent.currentHp + amount);
      opponent.health = sanitizeHealthState(opponent.health, { siz: opponent.siz, con: opponent.con, str: opponent.str, hpBonus: opponent.hpBonus, currentHp: opponent.currentHp });
      encounter.logs.push({ id: `${roundId}:${opponent.id}:regen`, type: 'regeneration', opponentId: opponent.id, amount, createdAt: iso(input.now) });
    } else if (creature?.healingRate === '1/round') {
      opponent.currentHp = Math.min(opponent.maxHp, opponent.currentHp + 1);
    }
    const completedRound = combat.rounds?.[combat.rounds.length - 1];
    const selectedAttack = creature?.attacks?.find(attack => attack.id === opponent.selectedAttackId);
    const attackedThisRound = completedRound?.exchanges?.some(exchange => (
      exchange.opponentId === opponent.id || exchange.actorId === opponent.id || exchange.attackerId === opponent.id
    ));
    if (selectedAttack?.flyby && attackedThisRound) {
      const before = opponent.distance;
      opponent.distance += Math.max(0, asInt(opponent.movementRate));
      encounter.logs.push({ id: `${roundId}:${opponent.id}:flyby`, type: 'flyby_withdrawal', opponentId: opponent.id, before, after: opponent.distance, createdAt: iso(input.now) });
    }
  }
  const activeEffectIds = encounter.ongoingEffects.filter(item => item.active).map(item => item.id);
  for (const effectId of activeEffectIds) {
    encounter = requireEncounter(character);
    const effect = encounter.ongoingEffects.find(item => item.id === effectId);
    if (!effect?.active) continue;
    const stopRoll = Math.min(6, Math.max(1, suppliedDie(input.stopRolls?.[effect.id], 6, rng)));
    effect.appliedRounds.push({ round: combat.round, stopRoll });
    if (stopRoll === effect.stopRoll) effect.active = false;
    else character = applyCharacterDamage(character, {
      rolledDamage: effect.damage, armor: 0, shield: 0, shieldApplies: false, direct: true,
      year: encounter.year, now: input.now, source: 'Basilisk 독의 라운드 피해',
      sourceRuleId: 'CH18-BASILISK-POISON', sourcePage: 'Ch.18 p.383'
    }, rng).character;
  }
  encounter = requireEncounter(character);
  encounter.appliedTransactions.push(roundId);
  encounter.updatedAt = iso(input.now);
  return { character, encounter, applied: true };
};

export const resolveNormalHorseControl = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const combat = character.campaign?.combat;
  if (!combat || combat.status !== 'active' || !combat.player?.mounted || !combat.player.horse || combat.player.horse.combatTrained) {
    throw new RangeError('전투 훈련을 받지 않은 탑승마가 필요합니다.');
  }
  if (combat.horseControl?.round !== combat.round || !['pending', 'bolted'].includes(combat.horseControl?.status)) {
    throw new RangeError('이 라운드에 해결할 일반 말 통제 판정이 없습니다.');
  }
  if (combat.horseControl.status === 'bolted' && combat.horseControl.lastAttemptRound === combat.round) {
    throw new RangeError('말이 달아난 이번 라운드를 먼저 진행해야 합니다.');
  }
  const roll = Math.min(20, Math.max(1, suppliedDie(input.roll, 20, rng)));
  const check = resolveD20Roll(roll, asInt(character.skills?.horsemanship));
  const status = check.critical ? 'exempt' : check.success ? 'success' : check.fumble ? 'bolted' : 'failure';
  combat.horseControl = { status, round: combat.round, lastAttemptRound: combat.round, check, sourcePage: 378 };
  return { character, combat, check, status };
};

export const advanceNormalHorseBolt = (characterValue, now) => {
  const character = clone(characterValue);
  const combat = character.campaign?.combat;
  if (!combat || combat.status !== 'active' || combat.phase !== 'determination' || combat.horseControl?.status !== 'bolted') {
    throw new RangeError('말이 전장을 벗어나 달리는 상태가 아닙니다.');
  }
  if (combat.horseControl.lastAttemptRound !== combat.round) throw new RangeError('이 라운드의 Horsemanship 판정을 먼저 시도해야 합니다.');
  const timestamp = iso(now);
  const distance = Math.max(0, asInt(combat.player.horse?.move));
  combat.opponents = combat.opponents.map(opponent => ({ ...opponent, distance: opponent.distance + distance }));
  combat.rounds.push({
    id: `${combat.id}:round:${combat.round}:horse-bolt`, round: combat.round,
    declaration: { action: 'horse_bolt' }, exchanges: [], packets: [], effects: [],
    movement: { player: { direction: 'away', yards: distance }, enemies: [] },
    visitedPhases: ['determination', 'movement'], completedAt: timestamp
  });
  combat.rounds = combat.rounds.slice(-250);
  combat.round += 1;
  combat.horseControl = { ...combat.horseControl, status: 'bolted', round: combat.round };
  combat.updatedAt = timestamp;
  character.campaign.schemaVersion = 12;
  return { character, combat, distance };
};

export const setChapter18CreatureBehavior = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const encounter = requireEncounter(character);
  const opponent = character.campaign?.combat?.opponents?.find(item => item.id === input.opponentId);
  if (!opponent) throw new RangeError('행동 결과를 적용할 creature를 찾을 수 없습니다.');
  if (!['active', 'fled', 'surrendered', 'defeated'].includes(input.status)) throw new RangeError('원문 또는 GM 판단으로 확정한 상태를 선택하세요.');
  opponent.status = input.status;
  encounter.logs.push({ id: `${encounter.id}:behavior:${encounter.logs.length + 1}`, type: 'gm_behavior', opponentId: opponent.id, status: input.status, note: String(input.note || ''), createdAt: iso(now) });
  return { character, encounter, opponent };
};

const GOBLIN_VIRTUES = Object.freeze({
  selfish: 'generous', deceitful: 'honest', lustful: 'chaste', cruel: 'merciful',
  indulgent: 'temperate', lazy: 'energetic', proud: 'modest'
});

export const resolveChapter18GoblinVice = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const encounter = requireEncounter(character);
  const opponent = character.campaign?.combat?.opponents?.find(item => item.id === input.opponentId && item.chapter18Id === 'goblin');
  if (!opponent) throw new RangeError('Goblin 전투 참가자를 선택하세요.');
  const vice = String(input.vice || '').toLowerCase();
  const virtue = GOBLIN_VIRTUES[vice];
  if (!virtue) throw new RangeError('원문 Goblin 죄악 유형을 선택하세요.');
  const transactionId = `${encounter.id}:goblin:${opponent.id}:${vice}`;
  if (encounter.appliedTransactions.includes(transactionId)) return { character, encounter, applied: false };
  const roll = Math.min(20, Math.max(1, suppliedDie(input.roll, 20, rng)));
  const check = resolveD20Roll(roll, asInt(character.traits?.[virtue]));
  if (check.success) opponent.status = 'fled';
  const record = { id: transactionId, type: 'goblin_opposed_virtue', opponentId: opponent.id, vice, virtue, check, sourcePage: 385, createdAt: iso(input.now) };
  encounter.abilityRecords.push(record);
  encounter.appliedTransactions.push(transactionId);
  return { character, encounter, opponent, check, applied: true };
};

export const recordChapter18AbilityDecision = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const encounter = requireEncounter(character);
  const creature = getChapter18Creature(input.creatureId || encounter.creatureIds[0]);
  const abilities = [...list(creature?.specials), ...list(creature?.vulnerabilities)];
  const ability = abilities.find(item => item.id === input.abilityId);
  if (!ability || !['gm_choice', 'structured_choice', 'narrative'].includes(ability.classification)) throw new RangeError('기록할 원문 GM·서술 능력을 선택하세요.');
  const note = String(input.note || '').trim();
  if (!note) throw new RangeError('GM 판단 또는 원문 서술 결과를 기록하세요.');
  const id = safeId(`${encounter.id}:ability:${creature.id}:${ability.id}`);
  if (encounter.abilityRecords.some(record => record.id === id)) return { character, encounter, applied: false };
  const record = { id, type: 'ability_decision', creatureId: creature.id, abilityId: ability.id, classification: ability.classification, choice: String(input.choice || ''), note, sourcePage: creature.sourcePage, createdAt: iso(now) };
  encounter.abilityRecords.push(record);
  encounter.logs.push(record);
  return { character, encounter, record, applied: true };
};

const gloryFor = (creature, result, input) => {
  if (creature.id === 'pegasus') return result === 'capture' ? asInt(creature.glory.captured) : result === 'victory' ? asInt(creature.glory.killed) : 0;
  const full = asInt(creature.glory?.defeated);
  if (result === 'victory' || result === 'capture') return full + (input.halfGiantKnight && creature.id === 'half_giant' ? asInt(creature.glory.knightBonus) : 0);
  if (input.partialVictoryApproved && creature.category === 'enchanted') return roundPaladin(full / 10);
  return 0;
};

export const completeChapter18Encounter = (characterValue, input = {}, now) => {
  let character = clone(characterValue);
  const encounter = requireEncounter(character);
  if (encounter.pendingChecks.length || encounter.fearDelay || encounter.pendingSpecial) throw new RangeError('남은 Chapter 18 판정 또는 특수 결과를 먼저 해결해야 합니다.');
  if (encounter.ongoingEffects.some(effect => effect.active)) throw new RangeError('지속 중인 Chapter 18 효과를 먼저 끝까지 처리해야 합니다.');
  let combat = character.campaign?.combat;
  if (!combat || (combat.id !== `${encounter.id}:combat` && combat.returnContext?.chapter18EncounterId !== encounter.id)) throw new RangeError('이 Chapter 18 encounter의 Chapter 7 전투를 찾을 수 없습니다.');
  if (combat.status !== 'concluded') {
    const concluded = concludeChapter7Combat(character, input, now);
    character = concluded.character;
    combat = concluded.combat;
  }
  const result = combat.outcome?.result || input.result || 'truce';
  if (['prudent_withdrawal', 'required_prudent_refrain'].includes(encounter.gateOutcome) && !['flight', 'truce'].includes(result)) throw new RangeError('Prudent로 피한 조우는 승리나 생포로 정산할 수 없습니다.');
  if (result === 'capture' && encounter.creatureIds.some(creatureId => creatureId === 'unicorn')) throw new RangeError('원문상 Unicorn은 산 채로 생포할 수 없습니다.');
  encounter.creatureIds.forEach((creatureId, index) => {
    const creature = getChapter18Creature(creatureId);
    const opponent = combat.opponents[index];
    const defeated = result === 'capture' || opponent?.status === 'defeated' || opponent?.currentHp <= 0 || input.defeatedOpponentIds?.includes(opponent?.id);
    const gloryResult = defeated ? result : input.partialVictoryApproved ? 'partial' : 'truce';
    const amount = roundPaladin(gloryFor(creature, gloryResult, input) / Math.max(1, encounter.victors));
    if (amount) recordGloryAward(character, {
      id: `${encounter.id}:glory:${index + 1}`, year: encounter.year, amount,
      title: `${creature.name} 조우`, narrative: `${creature.name}에 대한 Chapter 18 공적 ${amount}점을 기록했습니다.`,
      creature: creature.id, encounterId: encounter.id, transactionId: `${encounter.id}:settlement`, sourceRuleId: 'CH18-GLORY', sourcePage: `Ch.18 p.${creature.sourcePage}`
    });
    if (creature.id === 'pegasus' && result === 'victory' && defeated) recordHonorChange(character, {
      id: `${encounter.id}:pegasus-honor`, year: encounter.year, amount: -3, title: 'Pegasus를 죽임', narrative: 'Pegasus를 죽여 Honor 3점을 잃었습니다.', sourceRuleId: 'CH18-GLORY', sourcePage: 'Ch.18 p.387'
    });
    if (input.honorLossApproved && asInt(creature.glory?.honorLossPossible)) recordHonorChange(character, {
      id: `${encounter.id}:ordinary-honor:${index + 1}`, year: encounter.year, amount: -asInt(creature.glory.honorLossPossible), title: `${creature.name} 살해`, narrative: '상황에 따른 원문 Honor 손실을 GM이 확정했습니다.', sourceRuleId: 'CH18-GLORY', sourcePage: `Ch.18 p.${creature.sourcePage}`
    });
  });
  appendChronicleEvent(character, {
    id: `${encounter.id}:chronicle`, year: encounter.year, type: 'creature_encounter', title: 'Chapter 18 조우',
    narrative: `${encounter.creatureIds.map(id => getChapter18Creature(id)?.name).join(', ')}와의 조우가 ${result}로 끝났습니다.${input.note ? ` ${input.note}` : ''}`,
    sourceRuleId: 'CH18-ENCOUNTER', sourcePage: `Ch.18 pp.${Math.min(...encounter.creatureIds.map(id => getChapter18Creature(id).sourcePage))}-${Math.max(...encounter.creatureIds.map(id => getChapter18Creature(id).sourcePage))}`, createdAt: iso(now)
  });
  const ledger = sanitizeChapter18Ledger(character.campaign.chapter18);
  const completed = { ...ledger.active, status: 'completed', result, combatId: combat.id, completedAt: iso(now), updatedAt: iso(now) };
  character.campaign.chapter18 = { ...ledger, active: null, history: [...ledger.history, completed].slice(-100) };
  character.campaign.schemaVersion = 12;
  return { character, encounter: completed, combat, result, applied: true };
};

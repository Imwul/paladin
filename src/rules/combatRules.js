import {
  resolveD20Roll,
  resolveOpposedD20,
  rollD3,
  rollDie,
  roundPaladin
} from './coreRules.js';
import { appendChronicleEvent } from './ledgerRules.js';
import { prepareCareerEnd, resolveCareerEnd } from './lifecycleRules.js';

export const COMBAT_PHASES = Object.freeze([
  { id: 'determination', label: '결정', sourcePage: 'Ch.7 p.116' },
  { id: 'resolution', label: '판정', sourcePage: 'Ch.7 p.116' },
  { id: 'winner', label: '승자 처리', sourcePage: 'Ch.7 p.117' },
  { id: 'loser', label: '패자 처리', sourcePage: 'Ch.7 p.117' },
  { id: 'movement', label: '이동', sourcePage: 'Ch.7 p.117' }
]);

export const COMBAT_TACTICS = Object.freeze({
  standard: { label: '보통 공격', optional: false },
  defend: { label: '방어', modifier: 10, optional: true },
  dodge: { label: '회피', optional: true },
  doubleFeint: { label: '이중 페인트', optional: true },
  evasion: { label: '이탈', modifier: -5, opponentModifier: 5, optional: true }
});

export const WEAPON_PROFILES = Object.freeze({
  sword: { label: '검', skillKey: 'sword', dice: 0, hands: 1, sword: true },
  frankishSword: { label: '프랑크 강철검', skillKey: 'sword', skillModifier: 1, dice: 0, hands: 1, sword: true },
  persianSword: { label: '페르시아 강철검', skillKey: 'sword', dice: 0, hands: 1, sword: true, bonusVsNonMetal: 1 },
  greatSword: { label: '양손검', skillKey: 'sword', dice: 1, hands: 2, sword: true },
  axe: { label: '한손 도끼', skillKey: 'axe', dice: 0, hands: 1, shieldDamagePerSix: 2 },
  greatAxe: { label: '양손 도끼', skillKey: 'axe', dice: 1, hands: 2, shieldDamagePerSix: 2 },
  dagger: { label: '단검', skillKey: 'dagger', dice: -1, hands: 1 },
  spear: { label: '창', skillKey: 'spear', dice: 0, hands: 1 },
  greatSpear: { label: '양손창', skillKey: 'spear', dice: 1, hands: 2, antiCavalry: true },
  halberd: { label: '할버드', skillKey: 'spear', dice: 1, hands: 2, antiCavalry: true },
  mace: { label: '철퇴', skillKey: 'bludgeon', dice: 0, hands: 1, bonusVsChainmail: 1 },
  hammer: { label: '전투 망치', skillKey: 'bludgeon', dice: 0, hands: 1, bonusVsPlate: 1 },
  greatHammer: { label: '양손 망치', skillKey: 'bludgeon', dice: 1, hands: 2, bonusVsPlate: 1 },
  flail: { label: '도리깨', skillKey: 'bludgeon', dice: 0, hands: 1, ignoresShield: true, bonusVsChainmail: 1, selfHitOnOne: true },
  morningStar: { label: '모닝스타', skillKey: 'bludgeon', dice: 1, hands: 2, bonusVsChainmail: 1 },
  warflail: { label: '전투 도리깨', skillKey: 'bludgeon', dice: 1, hands: 2, ignoresShield: true, bonusVsChainmail: 1, selfHitOnOne: true },
  lance: { label: '마상창', skillKey: 'lance', dice: 0, hands: 1, lance: true },
  unarmed: { label: '맨손', skillKey: 'unarmed', dice: -2, hands: 0 },
  shield: { label: '방패 밀치기', skillKey: 'unarmed', dice: -1, hands: 1, shieldAttack: true }
});

const clone = value => JSON.parse(JSON.stringify(value));
const asNumber = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const asInt = (value, fallback = 0) => Math.trunc(asNumber(value, fallback));
const clamp = (value, min, max, fallback = min) => Math.min(max, Math.max(min, asInt(value, fallback)));
const iso = value => typeof value === 'string' ? value : (value || new Date()).toISOString();
const safeId = value => String(value || '').replace(/[^a-z0-9:_-]/gi, '_');
const validTactic = value => Object.hasOwn(COMBAT_TACTICS, value) ? value : 'standard';
const validWeapon = value => Object.hasOwn(WEAPON_PROFILES, value) ? value : 'sword';

const rollDamageDice = (count, rng, suppliedTotal) => {
  const dice = Math.max(1, asInt(count, 1));
  if (suppliedTotal !== undefined && suppliedTotal !== '') {
    return { dice, rolls: [], total: Math.max(0, asInt(suppliedTotal)), manual: true };
  }
  const rolls = Array.from({ length: dice }, () => rollDie(6, rng));
  return { dice, rolls, total: rolls.reduce((sum, value) => sum + value, 0), manual: false };
};

const maximumDamage = count => ({
  dice: Math.max(1, asInt(count, 1)),
  rolls: Array.from({ length: Math.max(1, asInt(count, 1)) }, () => 6),
  total: Math.max(1, asInt(count, 1)) * 6,
  maximum: true
});

export const getDerivedHealth = attributes => {
  const siz = Math.max(0, asInt(attributes?.siz));
  const con = Math.max(0, asInt(attributes?.con));
  const str = Math.max(0, asInt(attributes?.str));
  const totalHp = siz + con;
  const currentHp = asInt(attributes?.currentHp, totalHp);
  const lostHp = Math.max(0, totalHp - currentHp);
  const woundPenalty = lostHp > totalHp / 2 ? -10 : lostHp >= totalHp / 4 ? -5 : 0;
  return {
    siz,
    con,
    totalHp,
    currentHp,
    lostHp,
    damageDice: Math.max(1, roundPaladin((str + siz) / 6)),
    healingRate: Math.max(0, roundPaladin((str + con) / 10)),
    unconsciousThreshold: Math.max(0, roundPaladin(totalHp / 4)),
    majorWoundThreshold: con,
    woundPenalty,
    physicalPenalty: woundPenalty,
    allSkillsPenalty: woundPenalty === -10 ? -10 : 0
  };
};

export const createEmptyHealthState = () => ({
  wounds: [],
  surgeryNeeded: false,
  unconscious: false,
  pendingDeath: null,
  majorWoundCourage: null,
  weeklyCare: [],
  lastUpdatedAt: null
});

export const sanitizeHealthState = (value, attributes = {}) => {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const derived = getDerivedHealth(attributes);
  const wounds = Array.isArray(source.wounds) ? source.wounds.filter(entry => entry && typeof entry === 'object').slice(-250).map((entry, index) => ({
    id: String(entry.id || `wound_${index + 1}`),
    year: clamp(entry.year, 700, 1200),
    source: String(entry.source || '부상'),
    sourceRuleId: String(entry.sourceRuleId || 'HEALTH-HP-001'),
    sourcePage: String(entry.sourcePage || 'Ch.7 pp.129-132'),
    rolledDamage: Math.max(0, asInt(entry.rolledDamage)),
    actualDamage: Math.max(0, asInt(entry.actualDamage)),
    classification: ['light', 'major', 'mortal'].includes(entry.classification) ? entry.classification : 'light',
    treated: Boolean(entry.treated),
    firstAid: entry.firstAid && typeof entry.firstAid === 'object' ? entry.firstAid : null,
    createdAt: typeof entry.createdAt === 'string' ? entry.createdAt : null,
    notes: typeof entry.notes === 'string' ? entry.notes : ''
  })) : [];
  return {
    wounds,
    surgeryNeeded: Boolean(source.surgeryNeeded),
    unconscious: Boolean(source.unconscious) || derived.currentHp < derived.unconsciousThreshold,
    pendingDeath: source.pendingDeath && typeof source.pendingDeath === 'object' ? source.pendingDeath : derived.currentHp <= 0 ? {
      reason: '생명력이 0 이하입니다.',
      due: 'same_day_midnight',
      sourceRuleId: 'HEALTH-HP-001'
    } : null,
    majorWoundCourage: source.majorWoundCourage && typeof source.majorWoundCourage === 'object' ? {
      woundId: String(source.majorWoundCourage.woundId || ''),
      status: ['pending', 'continued', 'blocked', 'must_withdraw', 'forced'].includes(source.majorWoundCourage.status)
        ? source.majorWoundCourage.status
        : 'pending',
      roll: source.majorWoundCourage.roll == null ? null : clamp(source.majorWoundCourage.roll, 1, 20),
      target: source.majorWoundCourage.target == null ? null : asInt(source.majorWoundCourage.target),
      outcome: typeof source.majorWoundCourage.outcome === 'string' ? source.majorWoundCourage.outcome : null,
      year: clamp(source.majorWoundCourage.year, 700, 1200, 767),
      resolvedAt: typeof source.majorWoundCourage.resolvedAt === 'string' ? source.majorWoundCourage.resolvedAt : null
    } : null,
    weeklyCare: Array.isArray(source.weeklyCare) ? source.weeklyCare.filter(entry => entry && typeof entry === 'object').slice(-100) : [],
    lastUpdatedAt: typeof source.lastUpdatedAt === 'string' ? source.lastUpdatedAt : null
  };
};

const createOpponent = input => {
  const siz = clamp(input?.siz, 1, 100);
  const con = clamp(input?.con, 1, 100);
  const maxHp = siz + con;
  return {
    name: String(input?.name || '이름 없는 적'),
    skill: clamp(input?.skill, 0, 100),
    dex: clamp(input?.dex, 0, 100),
    siz,
    con,
    damageDice: clamp(input?.damageDice, 1, 30),
    str: clamp(input?.str, 0, 100, siz),
    app: clamp(input?.app, 0, 100, 10),
    weaponId: validWeapon(input?.weaponId),
    armor: clamp(input?.armor, 0, 100),
    armorType: ['none', 'leather', 'chainmail', 'plate'].includes(input?.armorType) ? input.armorType : 'chainmail',
    shield: clamp(input?.shield, 0, 100),
    mounted: Boolean(input?.mounted),
    horseDamageDice: clamp(input?.horseDamageDice, 1, 30, 6),
    currentHp: clamp(input?.currentHp, -1000, maxHp, maxHp),
    health: sanitizeHealthState(input?.health, { siz, con, str: input?.str ?? siz, currentHp: input?.currentHp ?? maxHp })
  };
};

export const createCombatEncounter = (character, input = {}, now) => {
  const year = clamp(input.year ?? character?.personal?.campaignYear, 700, 1200, 767);
  const timestamp = iso(now);
  return {
    id: safeId(input.id || `combat:${year}:${timestamp}`),
    year,
    status: 'active',
    round: 0,
    player: {
      weaponId: validWeapon(input.player?.weaponId),
      armor: clamp(input.player?.armor, 0, 100, 10),
      armorType: ['none', 'leather', 'chainmail', 'plate'].includes(input.player?.armorType) ? input.player.armorType : 'chainmail',
      shield: clamp(input.player?.shield, 0, 100, 6),
      mounted: Boolean(input.player?.mounted),
      horseDamageDice: clamp(input.player?.horseDamageDice, 1, 30, 6)
    },
    opponent: createOpponent(input.opponent || { siz: 12, con: 12, dex: 10, skill: 12, damageDice: 4, armor: 6, shield: 6 }),
    rounds: [],
    outcome: null,
    createdAt: timestamp,
    updatedAt: timestamp
  };
};

export const sanitizeCombatState = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const source = value;
  return {
    id: String(source.id || 'combat:migrated'),
    year: clamp(source.year, 700, 1200, 767),
    status: ['active', 'concluded'].includes(source.status) ? source.status : 'active',
    round: clamp(source.round, 0, 10000),
    player: {
      weaponId: validWeapon(source.player?.weaponId),
      armor: clamp(source.player?.armor, 0, 100, 10),
      armorType: ['none', 'leather', 'chainmail', 'plate'].includes(source.player?.armorType) ? source.player.armorType : 'chainmail',
      shield: clamp(source.player?.shield, 0, 100, 6),
      mounted: Boolean(source.player?.mounted),
      horseDamageDice: clamp(source.player?.horseDamageDice, 1, 30, 6)
    },
    opponent: createOpponent(source.opponent),
    rounds: Array.isArray(source.rounds) ? source.rounds.filter(entry => entry && typeof entry === 'object').slice(-100) : [],
    outcome: source.outcome && typeof source.outcome === 'object' ? source.outcome : null,
    createdAt: typeof source.createdAt === 'string' ? source.createdAt : null,
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : null
  };
};

const rollAttributeLoss = (attributes, count, suppliedRolls, rng) => {
  const keys = ['siz', 'dex', 'str', 'con', 'app'];
  const rolls = Array.from({ length: count }, (_, index) => suppliedRolls?.[index] || rollDie(6, rng));
  const losses = [];
  rolls.forEach(roll => {
    if (roll <= 5) {
      const key = keys[roll - 1];
      const before = asInt(attributes[key]);
      attributes[key] = Math.max(0, before - 1);
      losses.push({ key, before, after: attributes[key] });
    }
  });
  return { rolls, losses };
};

const applyDamageState = (attributes, healthValue, input, rng) => {
  const health = sanitizeHealthState(healthValue, attributes);
  const before = getDerivedHealth(attributes);
  const rolledDamage = Math.max(0, asInt(input.rolledDamage));
  const armor = Math.max(0, asInt(input.armor));
  const shield = input.shieldApplies ? Math.max(0, asInt(input.shield)) : 0;
  const reducedDamage = input.damageFraction ? roundPaladin(rolledDamage * input.damageFraction) : rolledDamage;
  const actualDamage = input.direct ? reducedDamage : Math.max(0, reducedDamage - armor - shield);
  const balanceRoll = input.skipKnockdown
    ? null
    : input.balanceRoll || (rolledDamage >= before.siz && rolledDamage < before.siz * 2 ? rollDie(20, rng) : null);
  const knockedDown = input.skipKnockdown
    ? false
    : rolledDamage >= before.siz * 2 || (
      rolledDamage >= before.siz && rolledDamage < before.siz * 2 && !resolveD20Roll(balanceRoll, attributes.dex || 0).success
    );
  const timestamp = iso(input.now);
  const result = {
    rolledDamage,
    reducedDamage,
    armor,
    shield,
    actualDamage,
    knockedDown,
    balanceRoll,
    classification: null,
    woundId: null,
    attributeLoss: null,
    currentHpBefore: before.currentHp,
    currentHpAfter: before.currentHp
  };

  if (actualDamage <= 0) return { attributes, health, result };

  const recordsWound = input.recordWound !== false;
  const classification = recordsWound
    ? actualDamage >= before.totalHp ? 'mortal' : actualDamage >= before.majorWoundThreshold ? 'major' : 'light'
    : null;
  attributes.currentHp = before.currentHp - actualDamage;
  result.classification = classification;
  result.currentHpAfter = attributes.currentHp;
  const woundId = recordsWound
    ? safeId(input.woundId || `wound:${input.year || 767}:${timestamp}:${health.wounds.length + 1}`)
    : null;
  result.woundId = woundId;
  if (recordsWound) {
    health.wounds.push({
      id: woundId,
      year: clamp(input.year, 700, 1200, 767),
      source: String(input.source || '전투 부상'),
      sourceRuleId: String(input.sourceRuleId || 'HEALTH-HP-001'),
      sourcePage: String(input.sourcePage || 'Ch.7 pp.129-132'),
      rolledDamage,
      actualDamage,
      classification,
      treated: false,
      firstAid: null,
      createdAt: timestamp,
      notes: String(input.notes || '')
    });
  }

  if (classification === 'major') {
    health.surgeryNeeded = true;
    const consciousnessRoll = input.consciousnessRoll || rollDie(20, rng);
    const stayedConscious = attributes.currentHp > 0 && consciousnessRoll <= attributes.currentHp;
    result.consciousnessRoll = consciousnessRoll;
    result.stayedConscious = stayedConscious;
    if (!stayedConscious) health.unconscious = true;
    result.attributeLoss = rollAttributeLoss(attributes, 1, input.attributeLossRolls, rng);
    if (stayedConscious && input.requiresValorousToContinue) {
      health.majorWoundCourage = {
        woundId,
        status: 'pending',
        roll: null,
        target: null,
        outcome: null,
        year: clamp(input.year, 700, 1200, 767),
        resolvedAt: null
      };
    }
  }

  if (classification === 'mortal') {
    health.surgeryNeeded = true;
    health.unconscious = true;
    result.firstAidRequiredWithinHour = true;
    result.fatalWithoutMagic = attributes.currentHp < -5;
    health.majorWoundCourage = null;
  }

  const after = getDerivedHealth(attributes);
  if (after.currentHp < after.unconsciousThreshold) {
    health.unconscious = true;
    health.surgeryNeeded = true;
    health.majorWoundCourage = null;
  }
  if (after.currentHp <= 0) {
    health.pendingDeath = {
      reason: String(input.source || '부상으로 생명력이 0 이하가 됨'),
      due: 'same_day_midnight',
      year: clamp(input.year, 700, 1200, 767),
      woundId,
      sourceRuleId: 'HEALTH-HP-001',
      createdAt: timestamp
    };
  }
  health.lastUpdatedAt = timestamp;
  return { attributes, health, result };
};

export const applyCharacterDamage = (characterValue, input, rng = Math.random) => {
  const character = clone(characterValue);
  character.campaign = character.campaign || {};
  const applied = applyDamageState(character.attributes, character.campaign.health, input, rng);
  character.attributes = applied.attributes;
  character.campaign.health = applied.health;
  return { character, injury: applied.result };
};

const weaponDice = (combatant, defender, profile, charging) => {
  if (profile.lance && charging) return Math.max(1, asInt(combatant.horseDamageDice, 6));
  let dice = Math.max(1, asInt(combatant.damageDice, 1) + asInt(profile.dice));
  if (profile.bonusVsChainmail && defender.armorType === 'chainmail') dice += profile.bonusVsChainmail;
  if (profile.bonusVsPlate && defender.armorType === 'plate') dice += profile.bonusVsPlate;
  if (profile.bonusVsNonMetal && !['chainmail', 'plate'].includes(defender.armorType)) dice += profile.bonusVsNonMetal;
  return dice;
};

export const getWeaponDamageDice = ({ baseDamageDice, weaponId, defenderArmorType = 'none', charging = false, horseDamageDice = 6 }) => {
  const profile = WEAPON_PROFILES[validWeapon(weaponId)];
  return weaponDice(
    { damageDice: Math.max(1, asInt(baseDamageDice, 1)), horseDamageDice },
    { armorType: defenderArmorType },
    profile,
    Boolean(charging && profile.lance)
  );
};

const tacticTarget = (combatant, opponent, tactic, profile, health, options = {}) => {
  let base = asInt(combatant.skill);
  if (tactic === 'dodge' || tactic === 'evasion') base = asInt(combatant.dex);
  let modifier = asInt(profile.skillModifier) + getDerivedHealth(health).physicalPenalty + asInt(options.situationalModifier);
  if (tactic === 'defend') modifier += 10;
  if (tactic === 'evasion') modifier -= 5;
  if (combatant.mounted && !opponent.mounted && !WEAPON_PROFILES[opponent.weaponId]?.antiCavalry) modifier += 5;
  if (!combatant.mounted && opponent.mounted && !profile.antiCavalry) modifier -= 5;
  if (options.charging && profile.lance && !(WEAPON_PROFILES[opponent.weaponId]?.antiCavalry || options.opponentCharging)) modifier += 5;
  if (options.opponentTactic === 'evasion') modifier += 5;
  return { base, modifier, target: base + modifier };
};

const feintResult = (combatant, tactic, suppliedRoll, rng) => {
  if (tactic !== 'doubleFeint') return null;
  const roll = suppliedRoll || rollDie(20, rng);
  return resolveD20Roll(roll, combatant.dex);
};

const weaponMishap = (profile, check, tiedAgainstSword = false) => {
  if (tiedAgainstSword && !profile.sword) return 'broken';
  if (!check.fumble) return null;
  return profile.sword ? 'dropped' : 'broken';
};

export const startCombat = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  character.campaign = character.campaign || {};
  character.campaign.health = sanitizeHealthState(character.campaign.health, character.attributes);
  character.campaign.combat = createCombatEncounter(character, input, now);
  character.campaign.schemaVersion = 8;
  return character;
};

export const resolveMajorWoundCourage = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const health = sanitizeHealthState(character.campaign?.health, character.attributes);
  if (health.majorWoundCourage?.status !== 'pending') throw new RangeError('A conscious Major Wound requiring a Valorous roll was not found.');
  const roll = input.roll || rollDie(20, rng);
  const check = resolveD20Roll(roll, asInt(input.target ?? character.traits?.valorous));
  const status = check.success ? 'continued' : check.fumble ? 'must_withdraw' : 'blocked';
  health.majorWoundCourage = {
    ...health.majorWoundCourage,
    status,
    roll,
    target: check.target,
    outcome: check.outcome,
    resolvedAt: iso(input.now)
  };
  character.traitsChecked = { ...(character.traitsChecked || {}), valorous: true };
  character.campaign.health = health;
  character.campaign.schemaVersion = 8;
  return { character, courage: { check, status } };
};

export const resolveCombatRound = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const encounter = sanitizeCombatState(character.campaign?.combat);
  if (!encounter || encounter.status !== 'active') throw new RangeError('An active combat encounter is required.');
  const healthAtStart = sanitizeHealthState(character.campaign?.health, character.attributes);
  const actorAtStart = getDerivedHealth(character.attributes);
  if (healthAtStart.unconscious || actorAtStart.currentHp <= 0) throw new RangeError('An unconscious or dying character cannot resolve another combat round.');
  if (encounter.opponent.health?.unconscious || encounter.opponent.currentHp <= 0) throw new RangeError('The opponent can no longer resolve another combat round.');
  if (healthAtStart.majorWoundCourage?.status === 'pending') throw new RangeError('Resolve the required Valorous roll before continuing combat.');
  if (healthAtStart.majorWoundCourage?.status === 'must_withdraw') throw new RangeError('A Valorous fumble requires flight or surrender. Conclude the combat.');
  if (healthAtStart.majorWoundCourage?.status === 'blocked') {
    if (!input.forcedContinuation) throw new RangeError('The knight cannot re-enter combat unless forced.');
    healthAtStart.majorWoundCourage.status = 'forced';
    character.campaign.health = healthAtStart;
  }
  const actorTactic = validTactic(input.actorTactic);
  const opponentTactic = validTactic(input.opponentTactic);
  const actorProfile = WEAPON_PROFILES[encounter.player.weaponId];
  const opponentProfile = WEAPON_PROFILES[encounter.opponent.weaponId];
  const actorDerived = getDerivedHealth(character.attributes);
  const actorCharging = Boolean(input.actorCharging && encounter.player.mounted && actorProfile.lance);
  const opponentCharging = Boolean(input.opponentCharging && encounter.opponent.mounted && opponentProfile.lance);
  const actor = {
    ...encounter.player,
    skill: asInt(character.skills?.[actorProfile.lance && !actorCharging ? 'spear' : actorProfile.skillKey]),
    dex: asInt(character.attributes?.dex),
    siz: asInt(character.attributes?.siz),
    con: asInt(character.attributes?.con),
    damageDice: actorDerived.damageDice
  };
  const opponent = {
    ...encounter.opponent,
    skill: opponentProfile.lance && !opponentCharging
      ? asInt(input.opponentSpearSkill, encounter.opponent.skill)
      : encounter.opponent.skill
  };
  const actorTarget = tacticTarget(actor, opponent, actorTactic, actorProfile, character.attributes, {
    charging: actorCharging,
    opponentCharging,
    opponentTactic,
    situationalModifier: input.actorModifier
  });
  const opponentAttributes = { str: opponent.str, siz: opponent.siz, dex: opponent.dex, con: opponent.con, app: opponent.app, currentHp: opponent.currentHp };
  const opponentTarget = tacticTarget(opponent, actor, opponentTactic, opponentProfile, opponentAttributes, {
    charging: opponentCharging,
    opponentCharging: actorCharging,
    opponentTactic: actorTactic,
    situationalModifier: input.opponentModifier
  });
  const actorRoll = input.actorRoll || rollDie(20, rng);
  const opponentRoll = input.opponentRoll || rollDie(20, rng);
  const actorCheck = resolveD20Roll(actorRoll, actorTarget.target);
  const opponentCheck = resolveD20Roll(opponentRoll, opponentTarget.target);
  const actorFeint = feintResult(actor, actorTactic, input.actorFeintRoll, rng);
  const opponentFeint = feintResult(opponent, opponentTactic, input.opponentFeintRoll, rng);
  let opposed = actorCheck.critical && opponentCheck.critical
    ? { winner: 'tie', actorOutcome: 'tie', opponentOutcome: 'tie' }
    : resolveOpposedD20(actorCheck, opponentCheck);
  if (actorTactic === 'defend' && opponentTactic === 'defend') {
    opposed = { winner: 'noCombat', actorOutcome: 'defend', opponentOutcome: 'defend' };
  }

  const timestamp = iso(input.now);
  const round = {
    number: encounter.round + 1,
    phases: COMBAT_PHASES.map(phase => phase.id),
    tactics: { actor: actorTactic, opponent: opponentTactic },
    targets: { actor: actorTarget, opponent: opponentTarget },
    rolls: { actor: actorCheck, opponent: opponentCheck, actorFeint, opponentFeint },
    opposed,
    damage: null,
    injury: null,
    fallInjury: null,
    opponentInjury: null,
    opponentFallInjury: null,
    actorUnconsciousMountCheck: null,
    opponentUnconsciousMountCheck: null,
    weaponEffects: {
      actor: weaponMishap(actorProfile, actorCheck, opposed.winner === 'tie' && opponentProfile.sword),
      opponent: weaponMishap(opponentProfile, opponentCheck, opposed.winner === 'tie' && actorProfile.sword)
    },
    createdAt: timestamp,
    sourceRuleIds: ['COMBAT-SEQUENCE-001', 'COMBAT-DAMAGE-001']
  };

  const dealDamage = (winner, loser, winnerProfile, winnerCheck, loserOutcome, options) => {
    const dice = weaponDice(winner, loser, winnerProfile, options.charging);
    const damage = winnerCheck.critical
      ? maximumDamage(dice)
      : rollDamageDice(dice, rng, options.suppliedDamage);
    const feint = options.feint;
    let armor = asInt(loser.armor);
    if (feint?.critical) armor = 0;
    else if (feint?.success) armor = roundPaladin(armor / 2);
    const shieldApplies = loserOutcome === 'partial' && !winnerProfile.ignoresShield;
    return {
      ...damage,
      armor,
      shield: asInt(loser.shield),
      shieldApplies,
      damageFraction: options.damageFraction,
      source: `${winnerProfile.label} 공격`,
      sourceRuleId: 'COMBAT-DAMAGE-001',
      sourcePage: 'Ch.7 pp.116-119'
    };
  };

  const actorSelfHit = actorProfile.selfHitOnOne && actorCheck.roll === 1;
  const opponentSelfHit = opponentProfile.selfHitOnOne && opponentCheck.roll === 1;
  const actorMayDamage = !actorSelfHit && !['defend', 'dodge', 'evasion'].includes(actorTactic) && !(actorTactic === 'doubleFeint' && !actorFeint?.success);
  const opponentMayDamage = !opponentSelfHit && !['defend', 'dodge', 'evasion'].includes(opponentTactic) && !(opponentTactic === 'doubleFeint' && !opponentFeint?.success);
  if (opposed.winner === 'actor' && actorMayDamage) {
    const damage = dealDamage(actor, opponent, actorProfile, actorCheck, opposed.opponentOutcome, {
      charging: actorCharging,
      suppliedDamage: input.actorDamageTotal,
      feint: actorFeint,
      damageFraction: input.actorNonlethal === 'quarter' ? 0.25 : input.actorNonlethal === 'half' ? 0.5 : 1
    });
    round.damage = { side: 'actor', ...damage };
    const opponentDamage = applyDamageState(opponentAttributes, opponent.health, {
      ...damage,
      rolledDamage: damage.total,
      year: encounter.year,
      now: timestamp,
      balanceRoll: input.opponentBalanceRoll,
      consciousnessRoll: input.opponentConsciousnessRoll,
      attributeLossRolls: input.opponentAttributeLossRolls,
      requiresValorousToContinue: false
    }, rng);
    opponent.currentHp = opponentDamage.attributes.currentHp;
    opponent.siz = opponentDamage.attributes.siz;
    opponent.con = opponentDamage.attributes.con;
    opponent.dex = opponentDamage.attributes.dex;
    opponent.str = opponentDamage.attributes.str;
    opponent.app = opponentDamage.attributes.app;
    opponent.health = opponentDamage.health;
    round.opponentInjury = opponentDamage.result;
    if (opponentDamage.result.knockedDown && opponent.mounted) {
      const fallDamage = input.opponentFallDamage || rollDie(6, rng);
      const fallen = applyDamageState(opponentDamage.attributes, opponent.health, {
        rolledDamage: fallDamage,
        armor: 0,
        year: encounter.year,
        now: timestamp,
        source: '낙마',
        sourceRuleId: 'COMBAT-KNOCKDOWN-001',
        sourcePage: 'Ch.7 p.119',
        consciousnessRoll: input.opponentFallConsciousnessRoll,
        attributeLossRolls: input.opponentFallAttributeLossRolls,
        requiresValorousToContinue: false
      }, rng);
      opponent.currentHp = fallen.attributes.currentHp;
      opponent.siz = fallen.attributes.siz;
      opponent.con = fallen.attributes.con;
      opponent.dex = fallen.attributes.dex;
      opponent.str = fallen.attributes.str;
      opponent.app = fallen.attributes.app;
      opponent.health = fallen.health;
      round.opponentFallInjury = fallen.result;
    } else if (opponentDamage.health.unconscious && opponent.mounted) {
      const roll = input.opponentUnconsciousMountRoll || rollDie(20, rng);
      const check = resolveD20Roll(roll, opponentDamage.attributes.dex);
      round.opponentUnconsciousMountCheck = check;
      if (!check.success) {
        const fallDamage = input.opponentFallDamage || rollDie(6, rng);
        const fallen = applyDamageState(opponentDamage.attributes, opponent.health, {
          rolledDamage: fallDamage,
          armor: 0,
          year: encounter.year,
          now: timestamp,
          source: '의식 상실 낙마',
          sourceRuleId: 'HEALTH-HP-001',
          sourcePage: 'Ch.7 p.129'
        }, rng);
        opponent.currentHp = fallen.attributes.currentHp;
        opponent.siz = fallen.attributes.siz;
        opponent.con = fallen.attributes.con;
        opponent.dex = fallen.attributes.dex;
        opponent.str = fallen.attributes.str;
        opponent.app = fallen.attributes.app;
        opponent.health = fallen.health;
        round.opponentFallInjury = fallen.result;
      }
    }
  } else if (opposed.winner === 'opponent' && opponentMayDamage) {
    const damage = dealDamage(opponent, actor, opponentProfile, opponentCheck, opposed.actorOutcome, {
      charging: opponentCharging,
      suppliedDamage: input.opponentDamageTotal,
      feint: opponentFeint,
      damageFraction: input.opponentNonlethal === 'quarter' ? 0.25 : input.opponentNonlethal === 'half' ? 0.5 : 1
    });
    round.damage = { side: 'opponent', ...damage };
    const actorDamage = applyDamageState(character.attributes, character.campaign?.health, {
      ...damage,
      rolledDamage: damage.total,
      year: encounter.year,
      now: timestamp,
      balanceRoll: input.actorBalanceRoll,
      consciousnessRoll: input.actorConsciousnessRoll,
      attributeLossRolls: input.actorAttributeLossRolls,
      requiresValorousToContinue: true
    }, rng);
    character.attributes = actorDamage.attributes;
    character.campaign.health = actorDamage.health;
    round.injury = actorDamage.result;
    if (actorDamage.result.knockedDown && actor.mounted) {
      const fallDamage = input.actorFallDamage || rollDie(6, rng);
      const fallen = applyDamageState(actorDamage.attributes, actorDamage.health, {
        rolledDamage: fallDamage,
        armor: 0,
        year: encounter.year,
        now: timestamp,
        source: '낙마',
        sourceRuleId: 'COMBAT-KNOCKDOWN-001',
        sourcePage: 'Ch.7 p.119',
        consciousnessRoll: input.actorFallConsciousnessRoll,
        attributeLossRolls: input.actorFallAttributeLossRolls,
        requiresValorousToContinue: true
      }, rng);
      character.attributes = fallen.attributes;
      character.campaign.health = fallen.health;
      round.fallInjury = fallen.result;
    } else if (actorDamage.health.unconscious && actor.mounted) {
      const roll = input.actorUnconsciousMountRoll || rollDie(20, rng);
      const check = resolveD20Roll(roll, character.attributes.dex);
      round.actorUnconsciousMountCheck = check;
      if (!check.success) {
        const fallDamage = input.actorFallDamage || rollDie(6, rng);
        const fallen = applyDamageState(actorDamage.attributes, actorDamage.health, {
          rolledDamage: fallDamage,
          armor: 0,
          year: encounter.year,
          now: timestamp,
          source: '의식 상실 낙마',
          sourceRuleId: 'HEALTH-HP-001',
          sourcePage: 'Ch.7 p.129'
        }, rng);
        character.attributes = fallen.attributes;
        character.campaign.health = fallen.health;
        round.fallInjury = fallen.result;
      }
    }
    if (['major', 'mortal'].includes(actorDamage.result.classification)) {
      appendChronicleEvent(character, {
        id: `${encounter.id}:round:${round.number}:wound`,
        year: encounter.year,
        type: 'injury',
        title: actorDamage.result.classification === 'mortal' ? '치명상을 입다' : '큰 부상을 입다',
        narrative: `${encounter.opponent.name}의 ${opponentProfile.label}에 ${actorDamage.result.actualDamage}점의 상처를 입었습니다.`,
        sourceRuleId: 'HEALTH-HP-001',
        sourcePage: 'Ch.7 pp.129-132',
        createdAt: timestamp
      });
    }
  }

  if (actorSelfHit) {
    const damage = rollDamageDice(weaponDice(actor, actor, actorProfile, false), rng, input.actorDamageTotal);
    const selfDamage = applyDamageState(character.attributes, character.campaign?.health, {
      rolledDamage: damage.total,
      armor: actor.armor,
      shield: 0,
      shieldApplies: false,
      year: encounter.year,
      now: timestamp,
      source: `${actorProfile.label} 자상`,
      sourceRuleId: 'COMBAT-SPECIAL-001',
      sourcePage: 'Ch.5 pp.103-104',
      requiresValorousToContinue: true
    }, rng);
    character.attributes = selfDamage.attributes;
    character.campaign.health = selfDamage.health;
    round.weaponEffects.actor = 'self_hit';
    round.injury = selfDamage.result;
  }
  if (opponentSelfHit) {
    opponentAttributes.currentHp = opponent.currentHp;
    opponentAttributes.siz = opponent.siz;
    opponentAttributes.con = opponent.con;
    const damage = rollDamageDice(weaponDice(opponent, opponent, opponentProfile, false), rng, input.opponentDamageTotal);
    const selfDamage = applyDamageState(opponentAttributes, opponent.health, {
      rolledDamage: damage.total,
      armor: opponent.armor,
      shield: 0,
      shieldApplies: false,
      year: encounter.year,
      now: timestamp,
      source: `${opponentProfile.label} 자상`,
      sourceRuleId: 'COMBAT-SPECIAL-001',
      sourcePage: 'Ch.5 pp.103-104'
    }, rng);
    opponent.currentHp = selfDamage.attributes.currentHp;
    opponent.health = selfDamage.health;
    round.weaponEffects.opponent = 'self_hit';
    round.opponentInjury = selfDamage.result;
  }
  if (actorProfile.lance && actorCheck.success && actorCheck.roll % 2 === 1) round.weaponEffects.actor = 'broken';
  if (opponentProfile.lance && opponentCheck.success && opponentCheck.roll % 2 === 1) round.weaponEffects.opponent = 'broken';
  encounter.opponent = opponent;
  encounter.round = round.number;
  encounter.rounds = [...encounter.rounds, round].slice(-100);
  encounter.updatedAt = timestamp;
  character.campaign.combat = encounter;
  character.campaign.schemaVersion = 8;
  return { character, round };
};

export const resolveFirstAid = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const health = sanitizeHealthState(character.campaign?.health, character.attributes);
  const wound = health.wounds.find(entry => entry.id === input.woundId);
  if (!wound) throw new RangeError('The selected wound does not exist.');
  if (wound.treated) throw new RangeError('First Aid can only be attempted once per wound.');
  if (asNumber(input.ageInHours, 0) > 24) throw new RangeError('First Aid cannot be applied to a wound more than one day old.');
  if (wound.classification === 'mortal' && asNumber(input.ageInHours, 0) > 1) throw new RangeError('A Mortal Wound requires First Aid within one hour.');
  const roll = input.roll || rollDie(20, rng);
  const check = resolveD20Roll(roll, asInt(input.skill ?? character.skills?.firstAid));
  let amount = 0;
  if (check.critical) amount = (input.healingRoll || rollD3(rng)) + 3;
  else if (check.success) amount = input.healingRoll || rollD3(rng);
  else if (check.fumble) amount = -(input.healingRoll || rollD3(rng));
  const before = asInt(character.attributes.currentHp);
  const recovered = amount > 0 ? Math.min(amount, wound.actualDamage) : amount;
  character.attributes.currentHp = Math.min(getDerivedHealth(character.attributes).totalHp, before + recovered);
  wound.treated = true;
  wound.firstAid = { roll, target: check.target, outcome: check.outcome, amount: recovered, treatedAt: iso(input.now) };
  if (check.fumble) health.surgeryNeeded = true;
  let mortalAttributeLoss = null;
  if (wound.classification === 'mortal' && check.success && character.attributes.currentHp > 0) {
    mortalAttributeLoss = rollAttributeLoss(character.attributes, 3, input.attributeLossRolls, rng);
  }
  if (character.attributes.currentHp > 0) health.pendingDeath = null;
  else health.pendingDeath = {
    reason: '응급처치 뒤 생명력이 0 이하가 됨',
    due: 'same_day_midnight',
    year: clamp(input.year ?? character.personal?.campaignYear, 700, 1200, 767),
    woundId: wound.id,
    sourceRuleId: 'HEALTH-HEAL-001',
    createdAt: iso(input.now)
  };
  const derived = getDerivedHealth(character.attributes);
  if (character.attributes.currentHp < derived.unconsciousThreshold) {
    health.unconscious = true;
    health.surgeryNeeded = true;
    health.majorWoundCourage = null;
  } else if (wound.classification !== 'mortal') health.unconscious = false;
  health.lastUpdatedAt = iso(input.now);
  character.campaign.health = health;
  character.campaign.schemaVersion = 8;
  return {
    character,
    treatment: { woundId: wound.id, check, amount: recovered, currentHpBefore: before, currentHpAfter: character.attributes.currentHp, mortalAttributeLoss }
  };
};

export const resolveWeeklyRecovery = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const health = sanitizeHealthState(character.campaign?.health, character.attributes);
  const before = getDerivedHealth(character.attributes);
  const requestedActivity = ['none', 'light', 'moderate', 'strenuous'].includes(input.activity) ? input.activity : 'none';
  const activity = health.unconscious ? 'light' : requestedActivity;
  const unhealthy = health.surgeryNeeded;
  const naturalCancelled = activity === 'strenuous' && before.currentHp < before.totalHp * 0.75 || unhealthy && ['moderate', 'strenuous'].includes(activity);
  const aggravationRequired = activity === 'strenuous' && before.currentHp < before.totalHp * 0.5 || unhealthy && ['moderate', 'strenuous'].includes(activity);
  let surgery = { required: unhealthy, outcome: 'not_needed', roll: null };
  let deterioration = 0;
  let immediateLoss = 0;
  let healing = naturalCancelled ? 0 : before.healingRate;
  if (unhealthy) {
    const roll = input.chirurgeryRoll || rollDie(20, rng);
    const check = asInt(input.caregivers, 1) > 1
      ? { ...resolveD20Roll(20, 1), outcome: 'automatic_failure', success: false, critical: false, fumble: false }
      : resolveD20Roll(roll, asInt(input.skill ?? character.skills?.chirurgery) + asInt(input.conditionsModifier));
    surgery = { required: true, roll, check, outcome: check.outcome };
    if (check.critical && !naturalCancelled) healing = before.healingRate * 2;
    if (!check.success) deterioration = input.deteriorationRoll || rollDie(6, rng);
    if (check.fumble) immediateLoss = input.fumbleLossRoll || rollD3(rng);
  }
  const aggravation = aggravationRequired ? clamp(input.aggravationDamage, 1, 3, 1) : 0;
  const afterImmediate = before.currentHp - immediateLoss - aggravation;
  character.attributes.currentHp = Math.min(before.totalHp, afterImmediate + healing - deterioration);
  const after = getDerivedHealth(character.attributes);
  if (after.currentHp <= 0) {
    health.pendingDeath = {
      reason: '주간 회복 중 생명력이 0 이하가 됨',
      due: 'same_day_midnight',
      year: clamp(input.year ?? character.personal?.campaignYear, 700, 1200, 767),
      sourceRuleId: 'HEALTH-HEAL-001',
      createdAt: iso(input.now)
    };
  } else {
    health.pendingDeath = null;
  }
  if (health.surgeryNeeded && after.currentHp >= after.totalHp / 2) health.surgeryNeeded = false;
  if (after.currentHp >= after.unconsciousThreshold && after.currentHp > 0) health.unconscious = false;
  const record = {
    id: safeId(input.id || `care:${character.personal?.campaignYear || 767}:${iso(input.now)}:${health.weeklyCare.length + 1}`),
    year: clamp(input.year ?? character.personal?.campaignYear, 700, 1200, 767),
    activity,
    requestedActivity,
    surgery,
    naturalCancelled,
    aggravation,
    immediateLoss,
    healing,
    deterioration,
    currentHpBefore: before.currentHp,
    currentHpAfter: character.attributes.currentHp,
    sourceRuleId: 'HEALTH-HEAL-001',
    sourcePage: 'Ch.7 pp.132-134',
    createdAt: iso(input.now)
  };
  health.weeklyCare = [...health.weeklyCare, record].slice(-100);
  health.lastUpdatedAt = record.createdAt;
  character.campaign.health = health;
  character.campaign.schemaVersion = 8;
  return { character, recovery: record };
};

export const resolveHazard = (characterValue, input = {}, rng = Math.random) => {
  const type = input.type;
  let rolledDamage;
  let armor = asInt(input.armor);
  let direct = false;
  let source;
  if (type === 'fall') {
    const dice = asNumber(input.distanceFeet) < 3 ? 0 : Math.ceil(asNumber(input.distanceFeet) / 6);
    rolledDamage = dice ? rollDamageDice(dice, rng, input.damageTotal).total : 0;
    armor = 0;
    source = `${asNumber(input.distanceFeet)}피트 추락`;
  } else if (type === 'droppedObject') {
    rolledDamage = Math.ceil(asNumber(input.weightPounds) / 10) + Math.ceil(asNumber(input.distanceFeet) / 3);
    source = '낙하물 충격';
  } else if (type === 'fire') {
    const rounds = clamp(input.rounds, 1, 20, 1);
    const intensity = clamp(input.intensityDice, 1, 10, 1);
    const armorDice = armor > 0 ? 1 : 0;
    rolledDamage = Array.from({ length: rounds }, (_, index) => Math.max(0, intensity * (index + 1) - armorDice))
      .reduce((sum, dice) => sum + (dice ? rollDamageDice(dice, rng).total : 0), 0);
    armor = 0;
    source = `${rounds}라운드 화염`;
  } else if (type === 'poison') {
    const potency = clamp(input.potencyDice, 1, 30, 1);
    rolledDamage = Math.max(0, rollDamageDice(potency, rng, input.damageTotal).total - asInt(characterValue.attributes?.con));
    armor = 0;
    direct = true;
    source = `${potency}d6 독`;
  } else if (type === 'suffocation') {
    const rolls = Array.isArray(input.conRolls) ? input.conRolls : [];
    let failed = false;
    let damageRounds = 0;
    rolls.forEach(roll => {
      if (failed || !resolveD20Roll(roll, characterValue.attributes?.con || 0).success) {
        failed = true;
        damageRounds += 1;
      }
    });
    rolledDamage = damageRounds ? rollDamageDice(damageRounds, rng, input.damageTotal).total : 0;
    armor = 0;
    direct = true;
    source = `${rolls.length}라운드 질식`;
  } else if (type === 'aggravation') {
    rolledDamage = clamp(input.damage, 1, 3, 1);
    armor = 0;
    direct = true;
    source = '부상 악화';
  } else if (type === 'disease') {
    rolledDamage = clamp(input.damage, 0, 1000, 0);
    armor = 0;
    direct = true;
    source = '질병';
  } else {
    throw new RangeError('Unknown hazard type.');
  }
  const resolved = applyCharacterDamage(characterValue, {
    ...input,
    rolledDamage,
    armor,
    direct,
    recordWound: type === 'disease' ? Boolean(input.recordWound) : !['poison', 'suffocation', 'aggravation'].includes(type),
    source,
    sourceRuleId: 'HEALTH-HAZARD-001',
    sourcePage: 'Ch.7 pp.134-135'
  }, rng);
  if (type === 'poison' && rolledDamage > asInt(characterValue.attributes?.con)) {
    resolved.character.campaign.health.surgeryNeeded = true;
  }
  if (type === 'disease') resolved.character.campaign.health.surgeryNeeded = true;
  return { ...resolved, hazard: { type, rolledDamage, source } };
};

export const concludeCombat = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const encounter = sanitizeCombatState(character.campaign?.combat);
  if (!encounter) throw new RangeError('A combat encounter is required.');
  const timestamp = iso(now);
  encounter.status = 'concluded';
  encounter.outcome = {
    result: ['victory', 'defeat', 'withdrawal', 'truce'].includes(input.result) ? input.result : 'truce',
    note: String(input.note || ''),
    concludedAt: timestamp
  };
  encounter.updatedAt = timestamp;
  character.campaign.combat = encounter;
  appendChronicleEvent(character, {
    id: `${encounter.id}:conclusion`,
    year: encounter.year,
    type: 'combat',
    title: `${encounter.opponent.name}와의 전투`,
    narrative: `${encounter.round}라운드 끝에 ${encounter.outcome.result}로 전투를 마쳤습니다.${encounter.outcome.note ? ` ${encounter.outcome.note}` : ''}`,
    sourceRuleId: 'COMBAT-SEQUENCE-001',
    sourcePage: 'Ch.7 pp.116-117',
    createdAt: timestamp
  });
  character.campaign.schemaVersion = 8;
  return character;
};

export const confirmHealthDeath = (characterValue, input = {}) => {
  if (asInt(characterValue.attributes?.currentHp) > 0 || !characterValue.campaign?.health?.pendingDeath) {
    return { character: characterValue, applied: false, reason: 'death_not_due' };
  }
  const prepared = prepareCareerEnd(characterValue, {
    type: 'death',
    cause: input.cause || characterValue.campaign.health.pendingDeath.reason,
    year: input.year || characterValue.personal?.campaignYear,
    timestamp: input.timestamp,
    sourceRuleId: 'HEALTH-HP-001',
    sourcePage: 'Ch.7 p.129'
  });
  if (!prepared.prepared) return prepared;
  const resolved = resolveCareerEnd(prepared.character, { timestamp: input.timestamp });
  if (resolved.character?.campaign?.health) resolved.character.campaign.health.pendingDeath = null;
  return resolved;
};

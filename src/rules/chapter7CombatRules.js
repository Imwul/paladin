import { resolveD20Roll, resolveOpposedD20, rollDie, roundPaladin } from './coreRules.js';
import {
  WEAPON_PROFILES,
  applyCharacterDamage,
  applyDamageState,
  getDerivedHealth,
  resolveFirstAid,
  sanitizeHealthState
} from './combatRules.js';
import { appendChronicleEvent } from './ledgerRules.js';
import { getMagicCombatEffects } from './economyRules.js';

export const CHAPTER_7_PHASES = Object.freeze([
  { id: 'determination', label: '행동 선언', page: 115 },
  { id: 'resolution', label: '판정', page: 116 },
  { id: 'winner', label: '승자 처리', page: 116 },
  { id: 'loser', label: '패자 처리', page: 116 },
  { id: 'movement', label: '이동', page: 117 }
]);

export const CHAPTER_7_ACTIONS = Object.freeze({
  attack: { label: '근접 공격', phase: 'resolution' },
  defend: { label: '방어', phase: 'resolution', optional: true },
  dodge: { label: '회피', phase: 'resolution', optional: true },
  double_feint: { label: '이중 페인트', phase: 'resolution', optional: true },
  grapple: { label: '붙잡기', phase: 'resolution', optional: true },
  grapple_pin: { label: '붙잡아 누르기', phase: 'resolution', optional: true },
  grapple_break: { label: '붙잡기 해제', phase: 'resolution', optional: true },
  grapple_reverse: { label: '붙잡기 역전', phase: 'resolution', optional: true },
  grapple_rearm: { label: '붙잡은 채 단검 뽑기', phase: 'resolution', optional: true },
  grapple_strike: { label: '붙잡은 채 공격', phase: 'resolution', optional: true },
  grapple_throw: { label: '상대를 내던지기', phase: 'resolution', optional: true },
  uncontrolled: { label: '무제어 공격', phase: 'resolution', optional: true },
  ranged: { label: '원거리 공격', phase: 'resolution' },
  aim: { label: '조준', phase: 'resolution' },
  reload: { label: '재장전', phase: 'movement' },
  lance_charge: { label: '마상창 돌격', phase: 'resolution' },
  joust: { label: '마상창 시합', phase: 'resolution' },
  dex: { label: '일반 DEX 행동', phase: 'resolution' },
  awareness: { label: '주변 살피기', phase: 'resolution' },
  rearm: { label: '무기 다시 들기', phase: 'resolution' },
  move: { label: '이동', phase: 'movement' },
  evade: { label: '이탈', phase: 'movement', optional: true },
  mount: { label: '승마', phase: 'movement' },
  dismount: { label: '하마', phase: 'movement' },
  get_up: { label: '일어서기', phase: 'movement' },
  follow_through: { label: '돌격 직진 계속', phase: 'movement' },
  command: { label: '부하에게 명령', phase: 'resolution' },
  converse: { label: '짧은 대화', phase: 'resolution' },
  squire: { label: '종자에게 도움 요청', phase: 'resolution' },
  hold: { label: '대기', phase: 'resolution' }
});

export const MISSILE_PROFILES = Object.freeze({
  bow: { label: '활', skillKey: 'bow', damage: { dice: 3, bonus: 0 }, rate: 1, maxRange: 150, ammoKey: 'arrows', bowstring: true, twoHanded: true },
  compoundBow: { label: '합성궁', skillKey: 'bow', damage: { dice: 5, bonus: 0 }, rate: 1, maxRange: 150, ammoKey: 'arrows', bowstring: true, twoHanded: true },
  longbow: { label: '장궁', skillKey: 'bow', damage: { dice: 6, bonus: 0 }, rate: 1, maxRange: 150, ammoKey: 'arrows', bowstring: true, twoHanded: true },
  lightCrossbow: { label: '경쇠뇌', skillKey: 'crossbow', damage: { dice: 1, bonus: 10 }, rate: 1, maxRange: 150, ammoKey: 'bolts', bowstring: true, twoHanded: true },
  mediumCrossbow: { label: '중쇠뇌', skillKey: 'crossbow', damage: { dice: 1, bonus: 13 }, reloadRounds: 1, maxRange: 200, ammoKey: 'bolts', bowstring: true, twoHanded: true },
  heavyCrossbow: { label: '대형 쇠뇌', skillKey: 'crossbow', damage: { dice: 1, bonus: 16 }, reloadRounds: 3, maxRange: 250, ammoKey: 'bolts', bowstring: true, twoHanded: true },
  javelin: { label: '투창', skillKey: 'thrownWeapon', damage: { baseDiceModifier: -1, bonus: 0 }, rate: 1, maxRange: 30, ammoKey: 'javelins' },
  sling: { label: '투석구', skillKey: 'thrownWeapon', damage: { baseDiceModifier: -1, bonus: 0 }, rate: 1, maxRange: 100, ammoKey: 'stones' },
  thrownObject: { label: '기타 투척물', skillKey: 'thrownWeapon', damage: { baseDiceModifier: -1, bonus: 0 }, rate: 1, maxRange: null, ammoKey: 'objects', gmRange: true }
});

export const HORSE_PROFILES = Object.freeze({
  rouncy: { label: '승용마', type: 'Rouncy', siz: 26, dex: 10, str: 18, con: 14, damageDice: 4, armor: 4, move: 6, combatTrained: true },
  charger: { label: '돌격마', type: 'Charger', siz: 34, dex: 17, str: 30, con: 12, damageDice: 6, armor: 5, move: 8, combatTrained: true },
  courser: { label: '준마', type: 'Courser', siz: 30, dex: 25, str: 24, con: 15, damageDice: 5, armor: 5, move: 9, combatTrained: true },
  destrier: { label: '군마', type: 'Destrier', siz: 42, dex: 10, str: 38, con: 10, damageDice: 8, armor: 5, move: 7, combatTrained: true }
});

const clone = value => JSON.parse(JSON.stringify(value));
const asNumber = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const asInt = (value, fallback = 0) => Math.trunc(asNumber(value, fallback));
const clamp = (value, min, max, fallback = min) => Math.min(max, Math.max(min, asInt(value, fallback)));
const iso = value => typeof value === 'string' ? value : (value || new Date()).toISOString();
const safeId = value => String(value || '').replace(/[^a-z0-9:_-]/gi, '_');
const validAction = value => Object.hasOwn(CHAPTER_7_ACTIONS, value) ? value : 'hold';
const validMeleeWeapon = value => Object.hasOwn(WEAPON_PROFILES, value) ? value : 'sword';
const validMissileWeapon = value => Object.hasOwn(MISSILE_PROFILES, value) ? value : 'bow';

const rollDice = (count, rng, supplied, bonus = 0) => {
  const dice = Math.max(1, asInt(count, 1));
  if (supplied !== undefined && supplied !== '') {
    return { dice, rolls: [], bonus, total: Math.max(0, asInt(supplied)), manual: true };
  }
  const rolls = Array.from({ length: dice }, () => rollDie(6, rng));
  return { dice, rolls, bonus, total: rolls.reduce((sum, value) => sum + value, 0) + bonus };
};

const maximumDamage = (count, bonus = 0) => ({
  dice: Math.max(1, asInt(count, 1)),
  rolls: Array.from({ length: Math.max(1, asInt(count, 1)) }, () => 6),
  bonus,
  total: Math.max(1, asInt(count, 1)) * 6 + bonus,
  maximum: true
});

export const getEncumbrance = (strength, pounds) => {
  const str = Math.max(1, asInt(strength, 1));
  const carried = Math.max(0, asNumber(pounds));
  if (carried <= str * 2) return { id: 'none', label: '무부하', dexModifier: 2, awarenessModifier: 5, weaponModifier: 5, moveModifier: 2 };
  if (carried <= str * 4) return { id: 'light', label: '가벼움', dexModifier: 0, awarenessModifier: 0, weaponModifier: 0, moveModifier: 0 };
  if (carried <= str * 8) return { id: 'moderate', label: '보통', dexModifier: -5, awarenessModifier: 0, weaponModifier: 0, moveModifier: 0 };
  if (carried <= str * 16) return { id: 'severe', label: '무거움', dexModifier: -10, awarenessModifier: 0, weaponModifier: 0, moveModifier: 0 };
  return { id: 'overloaded', label: '한계 초과', dexModifier: -10, awarenessModifier: 0, weaponModifier: 0, moveModifier: 0, gmRequired: true };
};

export const getMovementRate = (attributes, pounds = 0) => (
  Math.max(0, roundPaladin((asInt(attributes?.str) + asInt(attributes?.dex)) / 10) + getEncumbrance(attributes?.str, pounds).moveModifier)
);

export const getRangeModifier = (distance, maximum) => {
  const yards = Math.max(0, asNumber(distance));
  const max = Math.max(1, asNumber(maximum, 1));
  if (yards > max) return null;
  if (yards <= max / 3) return 0;
  if (yards <= max * 2 / 3) return -5;
  return -10;
};

const armorDexModifier = combatant => {
  if (Number.isFinite(Number(combatant?.armorDexModifier))) return asInt(combatant.armorDexModifier);
  if (combatant?.armorType === 'leather') return -2;
  if (combatant?.armorType === 'chainmail') return -5;
  if (combatant?.armorType === 'plate') return -10;
  return 0;
};

const createHorse = (input = {}) => {
  const profileKey = Object.hasOwn(HORSE_PROFILES, input.profileKey) ? input.profileKey : 'charger';
  const profile = HORSE_PROFILES[profileKey];
  const siz = clamp(input.siz, 1, 100, profile.siz);
  const con = clamp(input.con, 1, 100, profile.con);
  const totalHp = siz + con;
  const armorType = ['none', 'caparison', 'trapper', 'cuirbouilli', 'barding', 'plate_barding'].includes(input.armorType) ? input.armorType : asInt(input.armorBonus) === 2 ? 'caparison' : 'none';
  const armorBonus = Math.max(0, asInt(input.armorBonus, armorType === 'caparison' ? 2 : 0));
  const movementDexPenalty = Math.min(0, asInt(input.movementDexPenalty));
  const applyArmorPenalty = !input.armorMoveDexApplied;
  const dex = clamp(input.dex, 0, 100, profile.dex);
  const move = clamp(input.move, 0, 100, profile.move);
  return {
    id: String(input.id || `horse:${profileKey}`), profileKey, chapter18Id: typeof input.chapter18Id === 'string' ? input.chapter18Id : null,
    name: String(input.name || profile.label), type: String(input.type || profile.type),
    siz, dex: Math.max(0, dex + (applyArmorPenalty ? movementDexPenalty : 0)), str: clamp(input.str, 0, 100, profile.str), con,
    damageDice: clamp(input.damageDice, 1, 30, profile.damageDice), move: Math.max(0, move + (applyArmorPenalty ? movementDexPenalty : 0)),
    baseArmor: clamp(input.baseArmor, 0, 30, profile.armor), armorBonus, armor: clamp(input.baseArmor, 0, 30, profile.armor) + armorBonus,
    armorType, movementDexPenalty, armorMoveDexApplied: true,
    currentHp: clamp(input.currentHp ?? input.hp, -1000, totalHp, totalHp), maxHp: totalHp,
    majorWoundThreshold: input.majorWoundThreshold == null ? null : Math.max(0, asInt(input.majorWoundThreshold)),
    unconsciousThreshold: input.unconsciousThreshold == null ? null : Math.max(0, asInt(input.unconsciousThreshold)),
    status: ['healthy', 'wounded', 'broken', 'unconscious', 'dead', 'fallen'].includes(input.status) ? input.status : 'healthy',
    combatTrained: input.combatTrained !== undefined ? Boolean(input.combatTrained) : profile.combatTrained,
    huntTrained: Boolean(input.huntTrained), attackTrained: Boolean(input.attackTrained),
    lanceAttackModifier: asInt(input.lanceAttackModifier),
    lanceDamageDice: input.lanceDamageDice == null ? null : clamp(input.lanceDamageDice, 1, 30, 1),
    ruinApplied: Boolean(input.ruinApplied),
    control: input.control && typeof input.control === 'object' ? clone(input.control) : null,
    health: sanitizeHealthState(input.health, {
      siz, con, str: input.str ?? profile.str, currentHp: input.currentHp ?? input.hp ?? totalHp,
      majorWoundThreshold: input.majorWoundThreshold, unconsciousThreshold: input.unconsciousThreshold
    })
  };
};

const createOpponent = (input = {}, index = 0) => {
  const siz = clamp(input.siz, 1, 100, 12);
  const con = clamp(input.con, 1, 100, 12);
  const maxHp = clamp(input.maxHp ?? input.hp, 1, 1000, siz + con);
  const hpBonus = maxHp - siz - con;
  return {
    id: safeId(input.id || `enemy:${index + 1}`), name: String(input.name || `상대 ${index + 1}`),
    skill: clamp(input.skill, 0, 100, 12), unarmed: clamp(input.unarmed, 0, 100, input.skill ?? 12),
    rangedSkill: clamp(input.rangedSkill, 0, 100, input.skill ?? 12),
    horsemanship: clamp(input.horsemanship, 0, 100, input.dex ?? 10),
    dex: clamp(input.dex, 0, 100, 10), str: clamp(input.str, 0, 100, siz), siz, con,
    currentHp: clamp(input.currentHp, -1000, maxHp, maxHp), maxHp, hpBonus, damageDice: clamp(input.damageDice, 1, 30, 4),
    majorWoundThreshold: input.majorWoundThreshold == null ? null : Math.max(0, asInt(input.majorWoundThreshold)),
    unconsciousThreshold: input.unconsciousThreshold == null ? null : Math.max(0, asInt(input.unconsciousThreshold)),
    weaponId: validMeleeWeapon(input.weaponId), missileWeaponId: validMissileWeapon(input.missileWeaponId),
    armor: clamp(input.armor, 0, 100, 6), armorMax: clamp(input.armorMax, 0, 100, input.armor ?? 6),
    armorType: ['none', 'leather', 'chainmail', 'plate'].includes(input.armorType) ? input.armorType : 'chainmail',
    armorDexModifier: Number.isFinite(Number(input.armorDexModifier)) ? asInt(input.armorDexModifier) : undefined,
    shield: clamp(input.shield, 0, 100, 6), shieldMax: clamp(input.shieldMax, 0, 100, input.shield ?? 6),
    mounted: Boolean(input.mounted), horse: input.horse ? createHorse(input.horse) : input.mounted ? createHorse({ profileKey: input.horseProfileKey || 'rouncy' }) : null,
    distance: Math.max(0, asNumber(input.distance, 1)), movementRate: clamp(input.movementRate, 0, 100, roundPaladin((siz + clamp(input.dex, 0, 100, 10)) / 10)),
    prone: Boolean(input.prone), knockedDownRound: input.knockedDownRound == null ? null : Math.max(0, asInt(input.knockedDownRound)),
    grapple: input.grapple && typeof input.grapple === 'object' ? input.grapple : null,
    status: ['active', 'defeated', 'surrendered', 'fled'].includes(input.status) ? input.status : 'active',
    weaponStatus: ['ready', 'dropped', 'broken'].includes(input.weaponStatus) ? input.weaponStatus : 'ready',
    supportedByAlly: Boolean(input.supportedByAlly), ammo: { arrows: 12, bolts: 12, javelins: 3, stones: 12, objects: 3, ...(input.ammo || {}) },
    reloadRemaining: Math.max(0, asInt(input.reloadRemaining)), aimed: Boolean(input.aimed), missileStatus: String(input.missileStatus || 'ready'),
    chargeFollowThrough: Boolean(input.chargeFollowThrough),
    chapter18Id: typeof input.chapter18Id === 'string' ? input.chapter18Id : null,
    sourcePage: input.sourcePage == null ? null : Number(input.sourcePage),
    attackOptions: Array.isArray(input.attackOptions) ? clone(input.attackOptions) : [],
    selectedAttackId: typeof input.selectedAttackId === 'string' ? input.selectedAttackId : null,
    attackProfile: input.attackProfile && typeof input.attackProfile === 'object' ? clone(input.attackProfile) : null,
    immunities: Array.isArray(input.immunities) ? input.immunities.filter(value => typeof value === 'string') : [],
    vulnerabilities: Array.isArray(input.vulnerabilities) ? clone(input.vulnerabilities) : [],
    combatRestrictions: Array.isArray(input.combatRestrictions) ? input.combatRestrictions.filter(value => typeof value === 'string') : [],
    healingRate: input.healingRate ?? null,
    lastStandUntilRound: input.lastStandUntilRound == null ? null : Math.max(1, asInt(input.lastStandUntilRound)),
    health: sanitizeHealthState(input.health, {
      siz, con, str: input.str ?? siz, hpBonus, currentHp: input.currentHp ?? maxHp,
      majorWoundThreshold: input.majorWoundThreshold, unconsciousThreshold: input.unconsciousThreshold
    })
  };
};

const sanitizePlayer = (input = {}, character = {}) => {
  const weaponId = Object.hasOwn(input, 'weaponId') && input.weaponId == null
    ? 'unarmed'
    : validMeleeWeapon(input.weaponId);
  const missileWeaponId = Object.hasOwn(input, 'missileWeaponId') && input.missileWeaponId == null
    ? null
    : validMissileWeapon(input.missileWeaponId);
  const magicEffects = getMagicCombatEffects(character);
  if (input.firstRoundArmorEligible === false) magicEffects.firstRoundArmorBonus = 0;
  const baseArmor = clamp(input.armor, 0, 100, 10);
  const armor = clamp((magicEffects.armorOverride ?? baseArmor) + magicEffects.armorBonus, 0, 100, 10);
  const shield = WEAPON_PROFILES[weaponId]?.hands > 1 ? 0 : clamp(input.shield, 0, 100, 6);
  return {
    weaponId, missileWeaponId, armor, armorMax: clamp(input.armorMax, 0, 100, armor),
    armorType: ['none', 'leather', 'chainmail', 'plate'].includes(input.armorType) ? input.armorType : 'chainmail',
    armorDexModifier: Number.isFinite(Number(input.armorDexModifier)) ? asInt(input.armorDexModifier) : undefined,
    equipmentSkillBonus: asInt(input.equipmentSkillBonus), weaponBreakOnTie: Boolean(input.weaponBreakOnTie), weaponUnbreakable: Boolean(input.weaponUnbreakable),
    shield, shieldMax: clamp(input.shieldMax, 0, 100, shield), mounted: Boolean(input.mounted),
    horse: input.horse ? createHorse(input.horse) : input.mounted ? createHorse(character.horses?.warhorse || {}) : null,
    carriedPounds: Math.max(0, asNumber(input.carriedPounds, asInt(character.attributes?.str) * 3)),
    ammo: { arrows: 12, bolts: 12, javelins: 3, stones: 12, objects: 3, ...(input.ammo || {}) },
    reloadRemaining: Math.max(0, asInt(input.reloadRemaining)), aimed: Boolean(input.aimed), missileStatus: String(input.missileStatus || 'ready'),
    prone: Boolean(input.prone), knockedDownRound: input.knockedDownRound == null ? null : Math.max(0, asInt(input.knockedDownRound)),
    weaponStatus: ['ready', 'dropped', 'broken'].includes(input.weaponStatus) ? input.weaponStatus : 'ready',
    grapple: input.grapple && typeof input.grapple === 'object' ? input.grapple : null,
    chargeFollowThrough: Boolean(input.chargeFollowThrough), position: asNumber(input.position),
    magicEffects,
    magicUseContext: ['chivalrous', 'evil_or_dishonorable', 'unknown'].includes(input.magicUseContext) ? input.magicUseContext : 'chivalrous',
    knowinglyUsesMagic: input.knowinglyUsesMagic !== false, firstRoundArmorEligible: input.firstRoundArmorEligible !== false,
    attackTrainedMount: Boolean(input.attackTrainedMount)
  };
};

export const createChapter7Combat = (character, input = {}, now) => {
  const timestamp = iso(now);
  const opponents = (Array.isArray(input.opponents) && input.opponents.length ? input.opponents : [input.opponent || {}]).map(createOpponent);
  const player = sanitizePlayer(input.player, character);
  return {
    engineVersion: 2,
    id: safeId(input.id || `combat:${character?.personal?.campaignYear || 767}:${timestamp}`),
    year: clamp(input.year ?? character?.personal?.campaignYear, 700, 1200, 767), status: 'active', phase: 'determination', round: 1,
    player, opponents, declaration: null, pending: null, rounds: [], outcome: null,
    horseControl: player.mounted && player.horse && !player.horse.combatTrained
      ? { status: 'pending', round: 1, check: null, sourcePage: 378 }
      : null,
    appliedResolutionIds: [], openingModifier: asInt(input.openingModifier),
    openingModifierSource: String(input.openingModifierSource || ''),
    externalGate: input.externalGate && typeof input.externalGate === 'object' ? clone(input.externalGate) : null,
    initiativeOrder: [], returnContext: input.returnContext && typeof input.returnContext === 'object' ? clone(input.returnContext) : null,
    source: String(input.source || 'chapter_7'), createdAt: timestamp, updatedAt: timestamp
  };
};

export const sanitizeChapter7CombatState = (value, character = {}) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (value.engineVersion !== 2) {
    const migrated = createChapter7Combat(character, {
      id: value.id, year: value.year, player: value.player, opponents: value.opponents || [value.opponent], source: 'migrated_v8'
    }, value.createdAt);
    migrated.status = ['active', 'concluded'].includes(value.status) ? value.status : 'active';
    migrated.round = Math.max(1, asInt(value.round) + 1);
    migrated.rounds = Array.isArray(value.rounds) ? value.rounds.filter(Boolean).slice(-250) : [];
    migrated.outcome = value.outcome && typeof value.outcome === 'object' ? clone(value.outcome) : null;
    migrated.updatedAt = typeof value.updatedAt === 'string' ? value.updatedAt : migrated.updatedAt;
    return migrated;
  }
  const state = {
    ...value,
    engineVersion: 2,
    id: String(value.id || 'combat:migrated'), year: clamp(value.year, 700, 1200, 767),
    status: ['active', 'concluded'].includes(value.status) ? value.status : 'active',
    phase: CHAPTER_7_PHASES.some(phase => phase.id === value.phase) ? value.phase : 'determination',
    round: clamp(value.round, 1, 10000, 1), player: sanitizePlayer(value.player, character),
    opponents: (Array.isArray(value.opponents) ? value.opponents : [value.opponent]).filter(Boolean).map(createOpponent),
    declaration: value.declaration && typeof value.declaration === 'object' ? value.declaration : null,
    pending: value.pending && typeof value.pending === 'object' ? value.pending : null,
    rounds: Array.isArray(value.rounds) ? value.rounds.filter(Boolean).slice(-250) : [],
    outcome: value.outcome && typeof value.outcome === 'object' ? value.outcome : null,
    appliedResolutionIds: Array.isArray(value.appliedResolutionIds) ? value.appliedResolutionIds.filter(id => typeof id === 'string').slice(-500) : [],
    openingModifier: asInt(value.openingModifier), openingModifierSource: String(value.openingModifierSource || ''),
    externalGate: value.externalGate && typeof value.externalGate === 'object' ? clone(value.externalGate) : null,
    horseControl: value.horseControl && typeof value.horseControl === 'object' ? clone(value.horseControl) : null,
    initiativeOrder: Array.isArray(value.initiativeOrder) ? value.initiativeOrder.filter(id => typeof id === 'string') : [],
    returnContext: value.returnContext && typeof value.returnContext === 'object' ? value.returnContext : null,
    source: String(value.source || 'chapter_7'), createdAt: typeof value.createdAt === 'string' ? value.createdAt : null,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : null
  };
  return state;
};

export const startChapter7Combat = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const horseInputs = [input.player?.horse, ...(Array.isArray(input.opponents) ? input.opponents.map(opponent => opponent?.horse) : [input.opponent?.horse])].filter(Boolean);
  horseInputs.forEach(horse => {
    const profileKey = Object.hasOwn(HORSE_PROFILES, horse.profileKey) ? horse.profileKey : 'charger';
    if (['barding', 'plate_barding'].includes(horse.armorType) && !['charger', 'destrier'].includes(profileKey)) throw new RangeError('Barding은 Charger와 Destrier만 착용할 수 있습니다.');
    if (horse.armorType === 'plate_barding' && profileKey !== 'destrier') throw new RangeError('Plate barding은 Destrier만 착용할 수 있습니다.');
  });
  character.campaign = character.campaign || {};
  character.campaign.health = sanitizeHealthState(character.campaign.health, character.attributes);
  character.campaign.combat = createChapter7Combat(character, input, now);
  const magicEffects = character.campaign.combat.player.magicEffects;
  const chivalrousTotal = ['energetic', 'generous', 'just', 'merciful', 'modest', 'valorous']
    .reduce((sum, key) => sum + asInt(character.traits?.[key]), 0);
  if (magicEffects.itemIds.length && chivalrousTotal >= 90 && asInt(character.passions?.honor) >= 16
    && character.campaign.combat.player.knowinglyUsesMagic
    && character.campaign.combat.player.magicUseContext === 'chivalrous'
    && !magicEffects.personalityBasedOnly) {
    const conditionId = `magic-natural-armor:${character.personal?.campaignYear || 767}`;
    character.campaign.conditions = [
      ...(character.campaign.conditions || []).filter(condition => condition.id !== conditionId),
      { id: conditionId, type: 'natural_armor_lost', year: character.personal?.campaignYear || 767, expiresAfterWinter: true, sourceRuleId: 'ITEM-MAGIC-001', sourcePage: 'Ch.12 p.205' }
    ].slice(-100);
  }
  character.campaign.schemaVersion = 12;
  return character;
};

const activeState = character => {
  const state = sanitizeChapter7CombatState(character.campaign?.combat, character);
  if (!state || state.status !== 'active') throw new RangeError('진행 중인 Chapter 7 교전이 필요합니다.');
  return state;
};

const livingOpponents = state => state.opponents.filter(opponent => (
  (opponent.lastStandUntilRound != null && state.round <= opponent.lastStandUntilRound)
  || (opponent.currentHp > 0 && !opponent.health?.unconscious && opponent.status !== 'defeated')
));
const opponentById = (state, id) => state.opponents.find(opponent => opponent.id === id);
const isEngaged = opponent => asNumber(opponent.distance) <= 1 && !opponent.supportedByAlly;

const allowedOpponentCount = opponents => {
  const mounted = opponents.filter(opponent => opponent.mounted).length;
  const foot = opponents.length - mounted;
  if (mounted === 0) return foot <= 3;
  if (mounted === 1) return foot <= 2;
  return mounted === 2 && foot === 0;
};

export const getChapter7LegalActions = (characterValue) => {
  const state = sanitizeChapter7CombatState(characterValue.campaign?.combat, characterValue);
  if (!state || state.status !== 'active' || state.phase !== 'determination') return [];
  if (['pending', 'blocked'].includes(state.externalGate?.status)) return [];
  if (state.horseControl?.round === state.round) {
    if (['pending', 'bolted'].includes(state.horseControl.status)) return [];
    if (state.horseControl.status === 'failure') return ['evade'];
  }
  if (state.player.chargeFollowThrough) return ['follow_through'];
  if (state.player.grapple?.heldBy) return ['grapple_break', 'grapple_reverse', 'grapple_rearm'];
  if (state.player.grapple?.holding) return ['grapple_pin', 'grapple_rearm', 'grapple_strike', 'grapple_throw'];
  const actions = ['attack', 'defend', 'dodge', 'double_feint', 'grapple', 'uncontrolled', 'dex', 'awareness', 'rearm', 'move', 'command', 'converse', 'hold'];
  if (characterValue.squire?.name && !['사망', '포로', '실종'].includes(characterValue.squire.status)) actions.push('squire');
  if (state.player.prone && state.player.knockedDownRound != null && state.player.knockedDownRound < state.round) actions.push('get_up');
  if (state.player.mounted) actions.push('lance_charge', 'joust', 'dismount');
  else if (state.player.horse && state.player.horse.status !== 'dead') actions.push('mount');
  if (livingOpponents(state).some(isEngaged)) actions.push('evade');
  if (Object.values(state.player.ammo).some(value => asInt(value) > 0)) actions.push('ranged', 'aim');
  if (state.player.reloadRemaining > 0) actions.push('reload');
  return actions;
};

export const declareChapter7Action = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = activeState(character);
  if (state.phase !== 'determination') throw new RangeError('행동 선언 단계가 아닙니다.');
  if (['pending', 'blocked'].includes(state.externalGate?.status)) throw new RangeError('연결된 원문 판정을 먼저 해결하거나 전투를 종료해야 합니다.');
  if (state.horseControl?.round === state.round && ['pending', 'bolted'].includes(state.horseControl.status)) {
    throw new RangeError('전투 훈련을 받지 않은 말의 Horsemanship 판정을 먼저 해결해야 합니다.');
  }
  const health = sanitizeHealthState(character.campaign?.health, character.attributes);
  if (health.unconscious || asInt(character.attributes?.currentHp) <= 0) throw new RangeError('의식을 잃었거나 죽어가는 기사는 새 행동을 선언할 수 없습니다.');
  if (health.majorWoundCourage?.status === 'pending') throw new RangeError('큰 부상 뒤 전투를 계속할지 Valorous 판정을 먼저 해결하세요.');
  if (health.majorWoundCourage?.status === 'must_withdraw') throw new RangeError('Valorous 대실패로 도주하거나 항복해야 합니다. 전투를 종료하세요.');
  const action = validAction(input.action);
  if (!getChapter7LegalActions(character).includes(action)) throw new RangeError('현재 상태에서 허용되지 않는 행동입니다.');
  let targetIds = [...new Set((Array.isArray(input.targetIds) ? input.targetIds : input.targetId ? [input.targetId] : []).map(String))];
  if (action.startsWith('grapple_')) targetIds = [state.player.grapple?.heldBy || state.player.grapple?.holding].filter(Boolean);
  const targets = targetIds.map(id => opponentById(state, id)).filter(Boolean);
  if (['attack', 'double_feint', 'grapple', 'uncontrolled', 'ranged', 'lance_charge', 'joust'].includes(action) && !targets.length) {
    throw new RangeError('행동의 대상을 선택하세요.');
  }
  if (['uncontrolled', 'grapple', 'lance_charge', 'joust', 'ranged'].includes(action) && targets.length !== 1) {
    throw new RangeError('이 행동은 한 명만 대상으로 삼을 수 있습니다.');
  }
  if (['attack', 'double_feint', 'grapple', 'uncontrolled'].includes(action) && targets.some(target => target.distance > 1)) {
    throw new RangeError('근접 행동은 1야드 안의 상대에게만 사용할 수 있습니다.');
  }
  if (!allowedOpponentCount(livingOpponents(state).filter(isEngaged))) throw new RangeError('원문이 허용하는 동시 근접 상대 수를 초과했습니다.');
  if (action === 'uncontrolled' && state.player.weaponId === 'lance') throw new RangeError('무제어 공격에는 Lance를 사용할 수 없습니다.');
  if (action === 'dodge' && state.player.mounted) throw new RangeError('Dodge는 보병 상태에서만 사용할 수 있습니다. 기마 상태에서는 이탈을 사용하세요.');
  if (action === 'double_feint') {
    const forbidden = ['flail', 'warflail'];
    if (forbidden.includes(state.player.weaponId)) throw new RangeError('Flail과 Warflail은 Double Feint에 사용할 수 없습니다.');
    if (['greatSpear', 'halberd'].includes(state.player.weaponId) && targets.some(target => input.enemyPlans?.[target.id] === 'lance_charge')) throw new RangeError('기병 돌격을 상대하는 Great Spear와 Halberd는 Double Feint에 사용할 수 없습니다.');
  }
  if (input.twoHandedStrike && (action !== 'attack' || WEAPON_PROFILES[state.player.weaponId]?.hands !== 1)) {
    throw new RangeError('양손 타격은 한손 무기로 하는 보통 공격에만 사용할 수 있습니다.');
  }
  if (state.player.mounted && WEAPON_PROFILES[state.player.weaponId]?.hands > 1 && ['attack', 'defend', 'double_feint', 'uncontrolled'].includes(action) && !input.gmMountedTwoHandedApproved) {
    throw new RangeError('양손 무기는 보통 기마 상태에서 사용할 수 없습니다. GM이 예외를 승인해야 합니다.');
  }
  if (state.player.weaponId === 'shield' && !['attack', 'defend'].includes(action) && !input.gmShieldTacticApproved) {
    throw new RangeError('방패 공격은 GM 승인 없이 다른 전투 전술과 결합할 수 없습니다.');
  }
  if (action === 'rearm' && state.player.weaponStatus === 'broken' && validMeleeWeapon(input.rearmWeaponId) === state.player.weaponId && asInt(input.rearmShield) <= 0) {
    throw new RangeError('부러진 무기는 전투 중 수리할 수 없습니다. 다른 무기를 선택하세요.');
  }
  if (action === 'lance_charge') {
    if (!state.player.mounted || state.player.weaponId !== 'lance') throw new RangeError('마상창과 말을 갖춘 기사만 돌격할 수 있습니다.');
    if (targets[0].distance < 6) throw new RangeError('마상창 돌격에는 직선 6야드 이상의 거리가 필요합니다.');
  }
  if (action === 'joust' && (!state.player.mounted || state.player.weaponId !== 'lance' || !targets[0].mounted)) {
    throw new RangeError('마상창 시합은 말을 탄 두 참가자가 Lance를 사용해야 합니다.');
  }
  if (action === 'move' && livingOpponents(state).some(isEngaged) && !input.gmBypassApproved) {
    throw new RangeError('교전에서 벗어나려면 이탈 행동을 사용하거나 GM이 자유 통과를 승인해야 합니다.');
  }
  if (action === 'ranged') {
    const profile = MISSILE_PROFILES[state.player.missileWeaponId];
    const maximum = profile.maxRange || Math.max(1, asNumber(input.gmMaximumRange));
    if (getRangeModifier(targets[0].distance, maximum) === null) throw new RangeError('선택한 원거리 무기의 최대 사거리를 벗어났습니다.');
    if (asInt(state.player.ammo[profile.ammoKey]) <= 0) throw new RangeError('해당 원거리 무기의 탄약이 없습니다.');
    if (state.player.reloadRemaining > 0) throw new RangeError('먼저 재장전을 완료해야 합니다.');
    if (input.fireMode === 'rapid' && profile.reloadRounds) throw new RangeError('중쇠뇌와 대형 쇠뇌는 속사를 사용할 수 없습니다.');
  }
  for (const opponent of livingOpponents(state)) {
    const plan = input.enemyPlans?.[opponent.id];
    if (['ranged', 'rapid_ranged'].includes(plan)) {
      const profile = MISSILE_PROFILES[opponent.missileWeaponId];
      if (asInt(opponent.ammo[profile.ammoKey]) <= 0) throw new RangeError(`${opponent.name}에게 원거리 탄약이 없습니다.`);
      if (opponent.reloadRemaining > 0) throw new RangeError(`${opponent.name}은 먼저 재장전해야 합니다.`);
      if (plan === 'rapid_ranged' && profile.reloadRounds) throw new RangeError(`${opponent.name}의 중·대형 쇠뇌는 속사할 수 없습니다.`);
      if (getRangeModifier(opponent.distance, profile.maxRange || Math.max(1, asNumber(input.gmMaximumRange))) === null) throw new RangeError(`${opponent.name}의 원거리 사거리를 벗어났습니다.`);
    }
    if (plan === 'lance_charge' && (!opponent.mounted || opponent.weaponId !== 'lance' || opponent.distance < 6)) {
      throw new RangeError(`${opponent.name}은 현재 마상창 돌격 조건을 충족하지 않습니다.`);
    }
  }
  const declaration = {
    id: safeId(`${state.id}:round:${state.round}:declaration`), round: state.round, action, targetIds,
    allocations: input.allocations && typeof input.allocations === 'object' ? clone(input.allocations) : {},
    enemyPlans: input.enemyPlans && typeof input.enemyPlans === 'object' ? clone(input.enemyPlans) : {},
    allyEngagedIds: Array.isArray(input.allyEngagedIds) ? input.allyEngagedIds.map(String) : [],
    movement: input.movement && typeof input.movement === 'object' ? clone(input.movement) : {},
    dexAction: input.dexAction && typeof input.dexAction === 'object' ? clone(input.dexAction) : {},
    awarenessSkill: input.awarenessSkill === 'hunting' ? 'hunting' : 'awareness',
    rearmWeaponId: validMeleeWeapon(input.rearmWeaponId), rearmShield: Math.max(0, asInt(input.rearmShield)),
    squireRequest: ['weapon', 'shield', 'help'].includes(input.squireRequest) ? input.squireRequest : 'weapon',
    grappleRearmStat: input.grappleRearmStat === 'strength' ? 'strength' : 'unarmed',
    joustFumbleChoice: ['lance_broke', 'struck_horse', 'self_fall', 'saddle_failure'].includes(input.joustFumbleChoice) ? input.joustFumbleChoice : 'lance_broke',
    joustFumbleNote: String(input.joustFumbleNote || ''),
    fireMode: ['normal', 'rapid'].includes(input.fireMode) ? input.fireMode : 'normal',
    weather: ['clear', 'rain_snow', 'strong_wind', 'heavy_storm', 'gale'].includes(input.weather) ? input.weather : 'clear',
    shieldUse: ['active', 'passive', 'none'].includes(input.shieldUse) ? input.shieldUse : 'passive',
    playerShieldUse: ['active', 'passive', 'none'].includes(input.playerShieldUse) ? input.playerShieldUse : 'passive',
    uncontrolledDefense: ['free_attack', 'defend', 'uncontrolled'].includes(input.uncontrolledDefense) ? input.uncontrolledDefense : 'free_attack',
    nonlethal: ['full', 'half', 'quarter'].includes(input.nonlethal) ? input.nonlethal : 'full',
    twoHandedStrike: Boolean(input.twoHandedStrike),
    gmMountedTwoHandedApproved: Boolean(input.gmMountedTwoHandedApproved), gmShieldTacticApproved: Boolean(input.gmShieldTacticApproved),
    experienceApproved: Boolean(input.experienceApproved),
    sourceModifier: state.round === 1 ? state.openingModifier : 0,
    sourceModifierLabel: state.round === 1 ? state.openingModifierSource : '',
    gmModifier: asInt(input.gmModifier), gmNote: String(input.gmNote || ''), gmMaximumRange: Math.max(0, asNumber(input.gmMaximumRange)),
    createdAt: iso(now)
  };
  state.opponents = state.opponents.map(opponent => ({ ...opponent, supportedByAlly: declaration.allyEngagedIds.includes(opponent.id) }));
  if (state.player.aimed && !['ranged', 'aim'].includes(action)) state.player.aimed = false;
  state.declaration = declaration;
  state.phase = 'resolution';
  state.updatedAt = declaration.createdAt;
  character.campaign.combat = state;
  character.campaign.schemaVersion = 12;
  return { character, declaration };
};

const meleeDamageDice = (combatant, defender, weaponId, charging = false, diceBonus = 0) => {
  const attackProfile = combatant.attackProfile;
  if (attackProfile) {
    const base = Number.isFinite(Number(attackProfile.damageDice)) ? asInt(attackProfile.damageDice) : asInt(combatant.damageDice, 1);
    const metalModifier = ['chainmail', 'plate'].includes(defender.armorType) ? asInt(attackProfile.damageDiceModifierVsMetal) : 0;
    return Math.max(1, base + asInt(attackProfile.damageDiceModifier) + metalModifier + asInt(diceBonus));
  }
  const profile = WEAPON_PROFILES[validMeleeWeapon(weaponId)];
  if (charging && profile.lance) return Math.max(1, asInt(combatant.horse?.lanceDamageDice ?? combatant.horse?.damageDice ?? combatant.horseDamageDice ?? 6));
  let dice = Math.max(1, asInt(combatant.damageDice, 1) + asInt(profile.dice));
  if (profile.bonusVsChainmail && defender.armorType === 'chainmail') dice += profile.bonusVsChainmail;
  if (profile.bonusVsPlate && defender.armorType === 'plate') dice += profile.bonusVsPlate;
  if (profile.bonusVsNonMetal && !['chainmail', 'plate'].includes(defender.armorType)) dice += profile.bonusVsNonMetal;
  return Math.max(1, dice + asInt(diceBonus));
};

const playerCombatant = (character, state) => {
  const profile = WEAPON_PROFILES[state.player.weaponId];
  const derived = getDerivedHealth(character.attributes);
  return {
    side: 'player', id: 'player', name: character.personal?.name || '기사', ...state.player,
    armor: state.player.armor + (state.round === 1 ? asInt(state.player.magicEffects?.firstRoundArmorBonus) : 0),
    skill: asInt(character.skills?.[profile.lance ? 'spear' : profile.skillKey]) + asInt(state.player.magicEffects?.skillBonus) + asInt(state.player.equipmentSkillBonus)
      + (state.player.mounted && state.player.attackTrainedMount && !profile.lance ? 5 : 0),
    spearSkill: asInt(character.skills?.spear), unarmed: asInt(character.skills?.unarmed),
    dex: asInt(character.attributes?.dex), str: asInt(character.attributes?.str), siz: asInt(character.attributes?.siz),
    con: asInt(character.attributes?.con), damageDice: derived.damageDice,
    healthPenalty: state.player.magicEffects?.ignoreHealthPenalties ? 0 : derived.physicalPenalty,
    movementRate: getMovementRate(character.attributes, state.player.carriedPounds),
    encumbrance: getEncumbrance(character.attributes?.str, state.player.carriedPounds)
  };
};

const opponentCombatant = opponent => ({
  side: 'opponent', ...opponent, unarmed: opponent.unarmed, spearSkill: opponent.skill,
  healthPenalty: getDerivedHealth({
    siz: opponent.siz, con: opponent.con, str: opponent.str, hpBonus: opponent.hpBonus,
    currentHp: opponent.currentHp, majorWoundThreshold: opponent.majorWoundThreshold,
    unconsciousThreshold: opponent.unconsciousThreshold
  }).physicalPenalty,
  encumbrance: { id: 'light', weaponModifier: 0, dexModifier: 0, awarenessModifier: 0, moveModifier: 0 }
});

const combatModifiers = (actor, opponent, options = {}) => {
  const reasons = [];
  const add = (value, label) => { if (value) reasons.push({ value, label }); };
  add(actor.healthPenalty, '부상');
  add(actor.encumbrance?.weaponModifier, '무부하');
  if (actor.prone) add(-5, '넘어진 상태');
  if (opponent.prone) add(5, '높이 우위');
  if (actor.grapple?.pinned) add(-10, '고정됨');
  if (opponent.grapple?.pinned) add(10, '상대 고정');
  const actorWeapon = WEAPON_PROFILES[actor.weaponId];
  const opponentWeapon = WEAPON_PROFILES[opponent.weaponId];
  if (actor.mounted && !opponent.mounted && !opponentWeapon?.antiCavalry && !options.grapple) add(5, '기마 높이 우위');
  if (!actor.mounted && opponent.mounted && !actorWeapon?.antiCavalry && !options.grapple) add(-5, '상대 기마 높이 우위');
  if (options.charging && actorWeapon?.lance && !(opponentWeapon?.antiCavalry || options.opponentCharging)) add(5, '마상창 돌격');
  if (options.defend) add(10, '방어');
  if (options.uncontrolled) add(10, '무제어 공격');
  add(asInt(options.sourceModifier), options.sourceModifierLabel || '연결 절차 수정');
  add(asInt(options.gmModifier), 'GM 상황 판정');
  return { modifier: reasons.reduce((sum, item) => sum + item.value, 0), reasons };
};

const resolveWeaponCheck = (roll, base, modifiers) => {
  const target = asInt(base) + asInt(modifiers.modifier);
  return { ...resolveD20Roll(roll, target), base: asInt(base), modifier: modifiers.modifier, reasons: modifiers.reasons };
};

const damagePacket = ({ attacker, defender, check, weaponId, charging = false, diceBonus = 0, suppliedDamage, suppliedRolls, nonlethal = 'full', shieldApplies = false, source }) => {
  const dice = meleeDamageDice(attacker, defender, weaponId, charging, diceBonus);
  const magicBonus = Math.max(0, asInt(attacker.magicEffects?.damageBonus));
  const damage = check.critical
    ? maximumDamage(dice, magicBonus)
    : suppliedDamage !== undefined && suppliedDamage !== ''
      ? { dice, rolls: [], bonus: magicBonus, total: Math.max(0, asInt(suppliedDamage)) + magicBonus, manual: true }
      : { dice, rolls: [], bonus: magicBonus, total: 0, pending: true };
  if (Array.isArray(suppliedRolls) && suppliedRolls.length) {
    damage.rolls = suppliedRolls.map(value => clamp(value, 1, 6));
    damage.total = (suppliedDamage !== undefined && suppliedDamage !== '' ? Math.max(0, asInt(suppliedDamage)) : damage.rolls.reduce((sum, value) => sum + value, 0)) + magicBonus;
  }
  return {
    targetType: defender.side, targetId: defender.id, damage, rolledDamage: damage.total,
    armor: attacker.magicEffects?.halveArmor ? roundPaladin(asInt(defender.armor) / 2) : asInt(defender.armor), shield: asInt(defender.shield), shieldApplies,
    damageFraction: (nonlethal === 'quarter' ? 0.25 : nonlethal === 'half' ? 0.5 : 1) * (defender.magicEffects?.halfDamageSources?.includes('steel') ? 0.5 : 1) * Math.max(1, asNumber(attacker.attackProfile?.damageMultiplier, 1)),
    weaponId, source: source || `${WEAPON_PROFILES[weaponId]?.label || '무기'} 공격`,
    sourcePage: 'Ch.7 pp.116-125'
  };
};

const rngDamagePacket = (args, rng) => {
  const packet = damagePacket(args);
  if (!args.check.critical && args.suppliedDamage === undefined) {
    packet.damage = rollDice(
      meleeDamageDice(args.attacker, args.defender, args.weaponId, args.charging, args.diceBonus),
      rng,
      undefined,
      Math.max(0, asInt(args.attacker.magicEffects?.damageBonus))
    );
    packet.rolledDamage = packet.damage.total;
  }
  return packet;
};

const flailSelfHitPacket = (combatant, input, rng) => rngDamagePacket({
  attacker: combatant,
  defender: combatant,
  check: { critical: false },
  weaponId: combatant.weaponId,
  suppliedDamage: input.damageTotal,
  suppliedRolls: input.damageRolls,
  shieldApplies: false,
  source: `${WEAPON_PROFILES[combatant.weaponId]?.label || '도리깨'} 자상`
}, rng);

const weaponMishap = (weaponId, check, tiedAgainstSword = false) => {
  const profile = WEAPON_PROFILES[weaponId];
  if (tiedAgainstSword && !profile?.sword) return 'broken';
  if (!check.fumble) return null;
  return profile?.sword ? 'dropped' : 'broken';
};

const opposedWinner = (actorCheck, opponentCheck) => (
  actorCheck.critical && opponentCheck.critical
    ? { winner: 'tie', actorOutcome: 'tie', opponentOutcome: 'tie' }
    : resolveOpposedD20(actorCheck, opponentCheck)
);

const allocationFor = (declaration, id, base, targetCount, action) => {
  if (action === 'dodge') return base;
  if (targetCount === 1) return Math.min(base, Math.max(0, asInt(declaration.allocations[id], base)));
  return Math.max(0, asInt(declaration.allocations[id]));
};

const validateAllocations = (declaration, base, ids, action) => {
  if (action === 'dodge') return;
  const total = ids.reduce((sum, id) => sum + allocationFor(declaration, id, base, ids.length, action), 0);
  if (ids.length > 1 && total !== base) throw new RangeError(`다수 상대에게 나눈 기술 합계가 ${base}이어야 합니다.`);
};

const makeUnopposedAttack = (attacker, defender, input, rng, options = {}) => {
  const modifiers = combatModifiers(attacker, defender, { ...options, gmModifier: options.gmModifier });
  const roll = input.roll || rollDie(20, rng);
  const check = resolveWeaponCheck(roll, attacker.skill, modifiers);
  const exchange = { type: 'unopposed', attackerId: attacker.id, defenderId: defender.id, check, packets: [], effects: [] };
  const selfHit = WEAPON_PROFILES[attacker.weaponId]?.selfHitOnOne && check.roll === 1;
  if (selfHit) {
    exchange.packets.push(flailSelfHitPacket(attacker, input, rng));
    exchange.effects.push({ type: 'self_hit', side: attacker.side, targetId: attacker.id });
  } else if (check.success) {
    exchange.packets.push(rngDamagePacket({
      attacker, defender, check, weaponId: attacker.weaponId, charging: Boolean(options.charging),
      suppliedDamage: input.damageTotal, suppliedRolls: input.damageRolls,
      shieldApplies: Boolean(options.shieldAlways), nonlethal: options.nonlethal, source: options.source
    }, rng));
  }
  const mishap = weaponMishap(attacker.weaponId, check);
  if (mishap) exchange.effects.push({ type: 'weapon', side: attacker.side, targetId: attacker.id, status: mishap });
  return exchange;
};

const resolveMeleeExchange = (actor, opponent, declaration, input, rng, baseSkill, action) => {
  const actorModifiers = action === 'dodge' ? {
    modifier: actor.healthPenalty + armorDexModifier(actor) + actor.encumbrance.dexModifier + declaration.sourceModifier + declaration.gmModifier,
    reasons: [{ value: actor.healthPenalty, label: '부상' }, { value: armorDexModifier(actor), label: '갑옷' }, { value: actor.encumbrance.dexModifier, label: '하중' }, { value: declaration.sourceModifier, label: declaration.sourceModifierLabel || '연결 절차 수정' }, { value: declaration.gmModifier, label: 'GM 상황 판정' }].filter(reason => reason.value)
  } : combatModifiers(actor, opponent, {
    defend: action === 'defend', uncontrolled: action === 'uncontrolled', charging: action === 'lance_charge',
    opponentCharging: declaration.enemyPlans?.[opponent.id] === 'lance_charge', sourceModifier: declaration.sourceModifier,
    sourceModifierLabel: declaration.sourceModifierLabel, gmModifier: declaration.gmModifier
  });
  if (action === 'lance_charge' && asInt(actor.horse?.lanceAttackModifier)) {
    actorModifiers.modifier += asInt(actor.horse.lanceAttackModifier);
    actorModifiers.reasons.push({ value: asInt(actor.horse.lanceAttackModifier), label: 'Chapter 18 특수 탈것 마상창' });
  }
  if (asInt(opponent.attackProfile?.defenderModifier)) {
    actorModifiers.modifier += asInt(opponent.attackProfile.defenderModifier);
    actorModifiers.reasons.push({ value: asInt(opponent.attackProfile.defenderModifier), label: 'Chapter 18 공격 방식' });
  }
  if (actor.mounted && actor.horse?.chapter18Id === 'camel' && opponent.mounted && opponent.horse?.chapter18Id !== 'camel') {
    actorModifiers.modifier += 5;
    actorModifiers.reasons.push({ value: 5, label: 'Camel 대 horseback' });
  }
  if (declaration.twoHandedStrike && WEAPON_PROFILES[actor.weaponId]?.hands === 1) {
    actorModifiers.modifier -= 5;
    actorModifiers.reasons.push({ value: -5, label: '한손 무기 양손 타격' });
  }
  const opponentPlan = declaration.enemyPlans?.[opponent.id] || 'attack';
  const opponentModifiers = combatModifiers(opponent, actor, {
    defend: opponentPlan === 'defend', uncontrolled: opponentPlan === 'uncontrolled', charging: opponentPlan === 'lance_charge',
    opponentCharging: action === 'lance_charge', grapple: opponentPlan === 'grapple'
  });
  if (opponentPlan === 'lance_charge' && asInt(opponent.horse?.lanceAttackModifier)) {
    opponentModifiers.modifier += asInt(opponent.horse.lanceAttackModifier);
    opponentModifiers.reasons.push({ value: asInt(opponent.horse.lanceAttackModifier), label: 'Chapter 18 특수 탈것 마상창' });
  }
  if (asInt(opponent.attackProfile?.attackModifier)) {
    opponentModifiers.modifier += asInt(opponent.attackProfile.attackModifier);
    opponentModifiers.reasons.push({ value: asInt(opponent.attackProfile.attackModifier), label: 'Chapter 18 공격 방식' });
  }
  if (opponent.mounted && opponent.horse?.chapter18Id === 'camel' && actor.mounted && actor.horse?.chapter18Id !== 'camel') {
    opponentModifiers.modifier += 5;
    opponentModifiers.reasons.push({ value: 5, label: 'Camel 대 horseback' });
  }
  let feint = null;
  if (action === 'double_feint') {
    const encumbrance = actor.encumbrance?.dexModifier || 0;
    const target = actor.dex + armorDexModifier(actor) + encumbrance;
    feint = resolveD20Roll(input.feintRoll || rollDie(20, rng), target);
    if (opponent.armor <= 0 && feint.success) {
      const bonus = feint.critical ? 10 : 5;
      actorModifiers.modifier += bonus;
      actorModifiers.reasons.push({ value: bonus, label: '무장갑 상대 이중 페인트' });
    }
  }
  const actorRoll = input.actorRoll || rollDie(20, rng);
  const opponentRoll = input.opponentRoll || rollDie(20, rng);
  let actorCheck = resolveWeaponCheck(actorRoll, baseSkill, actorModifiers);
  const opponentCheck = resolveWeaponCheck(opponentRoll, opponentPlan === 'grapple' ? opponent.unarmed : opponent.skill, opponentModifiers);
  const actorSelfHit = WEAPON_PROFILES[actor.weaponId]?.selfHitOnOne && actorCheck.roll === 1;
  const opponentSelfHit = opponentPlan !== 'grapple' && WEAPON_PROFILES[opponent.weaponId]?.selfHitOnOne && opponentCheck.roll === 1;
  if (action === 'double_feint' && feint.fumble) actorCheck = { ...actorCheck, forcedMishap: WEAPON_PROFILES[actor.weaponId]?.sword ? 'dropped' : 'broken' };
  const opposed = action === 'defend' && opponentPlan === 'defend'
    ? { winner: 'noCombat', actorOutcome: 'defend', opponentOutcome: 'defend' }
    : opposedWinner(actorCheck, opponentCheck);
  const exchange = { type: 'opposed', actorId: actor.id, opponentId: opponent.id, action, opponentPlan, actorCheck, opponentCheck, feint, opposed, packets: [], effects: [] };
  const actorCanDamage = !actorSelfHit && !['defend', 'dodge'].includes(action) && !(action === 'double_feint' && !feint?.success);
  const opponentCanDamage = !opponentSelfHit && !['defend', 'grapple'].includes(opponentPlan);
  if (opposed.winner === 'actor' && actorCanDamage) {
    const packet = rngDamagePacket({
      attacker: actor, defender: opponent, check: actorCheck, weaponId: actor.weaponId, charging: action === 'lance_charge',
      diceBonus: declaration.twoHandedStrike && WEAPON_PROFILES[actor.weaponId]?.hands === 1 ? 1 : 0,
      suppliedDamage: input.actorDamageTotal, suppliedRolls: input.actorDamageRolls,
      shieldApplies: opposed.opponentOutcome === 'partial' && !WEAPON_PROFILES[actor.weaponId]?.ignoresShield,
      nonlethal: declaration.nonlethal
    }, rng);
    if (action === 'double_feint' && feint.critical) packet.armor = 0;
    else if (action === 'double_feint' && feint.success) packet.armor = roundPaladin(packet.armor / 2);
    exchange.packets.push(packet);
  } else if (opposed.winner === 'opponent' && opponentPlan === 'grapple') {
    exchange.effects.push({ type: 'grapple_hold', holder: 'opponent', holderId: opponent.id, targetId: 'player' });
    exchange.effects.push({ type: 'weapon', side: 'opponent', targetId: opponent.id, status: 'dropped' });
    exchange.effects.push({ type: 'shield_drop', side: 'opponent', targetId: opponent.id });
    exchange.effects.push({ type: 'weapon', side: 'player', targetId: 'player', status: 'dropped' });
  } else if (opposed.winner === 'opponent' && opponentCanDamage && !opponent.attackProfile?.noDamage) {
    const packetCount = Math.max(1, asInt(opponent.attackProfile?.packetCount, 1));
    for (let packetIndex = 0; packetIndex < packetCount; packetIndex += 1) {
      const packet = rngDamagePacket({
        attacker: opponent, defender: actor, check: opponentCheck, weaponId: opponent.weaponId,
        charging: opponentPlan === 'lance_charge', suppliedDamage: input.opponentDamageTotals?.[packetIndex] ?? input.opponentDamageTotal,
        suppliedRolls: input.opponentDamageRollSets?.[packetIndex] ?? input.opponentDamageRolls, shieldApplies: !declaration.twoHandedStrike && opposed.actorOutcome === 'partial' && !WEAPON_PROFILES[opponent.weaponId]?.ignoresShield
      }, rng);
      if (opponent.attackProfile?.target === 'mount_if_mounted' && actor.mounted && actor.horse) packet.targetType = 'player_horse';
      exchange.packets.push(packet);
    }
  }
  if (opposed.winner === 'opponent' && opponent.attackProfile?.effect) {
    exchange.specialHit = { attackerId: opponent.id, attackId: opponent.selectedAttackId, effect: opponent.attackProfile.effect };
  }
  if (actorSelfHit) {
    exchange.packets.push(flailSelfHitPacket(actor, { damageTotal: input.actorDamageTotal, damageRolls: input.actorDamageRolls }, rng));
    exchange.effects.push({ type: 'self_hit', side: 'player', targetId: 'player' });
  }
  if (opponentSelfHit) {
    exchange.packets.push(flailSelfHitPacket(opponent, { damageTotal: input.opponentDamageTotal, damageRolls: input.opponentDamageRolls }, rng));
    exchange.effects.push({ type: 'self_hit', side: 'opponent', targetId: opponent.id });
  }
  const grappleTie = opponentPlan === 'grapple';
  const actorMishap = actor.magicEffects?.unbreakable || actor.weaponUnbreakable ? null
    : actorCheck.forcedMishap || (actor.weaponBreakOnTie && opposed.winner === 'tie' ? 'broken' : weaponMishap(actor.weaponId, actorCheck, !grappleTie && opposed.winner === 'tie' && WEAPON_PROFILES[opponent.weaponId]?.sword));
  const opponentMishap = grappleTie ? null : weaponMishap(opponent.weaponId, opponentCheck, opposed.winner === 'tie' && WEAPON_PROFILES[actor.weaponId]?.sword);
  if (actorMishap) exchange.effects.push(actor.weaponId === 'shield' ? { type: 'shield_drop', side: 'player', targetId: 'player' } : { type: 'weapon', side: 'player', targetId: 'player', status: actorMishap });
  if (opponentMishap) exchange.effects.push(opponent.weaponId === 'shield' ? { type: 'shield_drop', side: 'opponent', targetId: opponent.id } : { type: 'weapon', side: 'opponent', targetId: opponent.id, status: opponentMishap });
  if (opposed.winner === 'actor' && actorCanDamage && actor.magicEffects?.automaticUnhorse && opponent.mounted) {
    exchange.effects.push({ type: 'dismount', side: 'opponent', targetId: opponent.id, source: 'Golden Lance' });
    exchange.effects.push({ type: 'prone', side: 'opponent', targetId: opponent.id, value: true });
  }
  if (opponentPlan === 'grapple' && opponentCheck.fumble) {
    exchange.effects.push({ type: 'prone', side: 'opponent', targetId: opponent.id, value: true });
    if (opponent.mounted) {
      const fall = rollDice(1, rng, input.opponentFallDamage);
      exchange.effects.push({ type: 'dismount', side: 'opponent', targetId: opponent.id });
      exchange.packets.push({ targetType: 'opponent', targetId: opponent.id, damage: fall, rolledDamage: fall.total, armor: 0, shield: 0, shieldApplies: false, direct: true, source: '붙잡기 대실패 낙마', sourcePage: 'Ch.7 p.128' });
    }
  }
  if (declaration.twoHandedStrike && WEAPON_PROFILES[actor.weaponId]?.hands === 1) exchange.effects.push({ type: 'shield_drop', side: 'player' });
  return exchange;
};

const weatherModifier = weather => ({ clear: 0, rain_snow: -5, strong_wind: -5, heavy_storm: -15, gale: -20 }[weather] || 0);

const resolveRangedAction = (character, state, declaration, input, rng) => {
  const actor = playerCombatant(character, state);
  const target = opponentById(state, declaration.targetIds[0]);
  const profile = MISSILE_PROFILES[state.player.missileWeaponId];
  const maximum = profile.maxRange || declaration.gmMaximumRange;
  const rangeModifier = getRangeModifier(target.distance, maximum);
  const shieldModifier = declaration.shieldUse === 'active' ? -target.shield : declaration.shieldUse === 'passive' && target.shield > 0 ? -3 : 0;
  const mountedModifier = actor.mounted && ['bow', 'compoundBow', 'longbow'].includes(state.player.missileWeaponId) ? -5 : 0;
  const aimModifier = state.player.aimed ? 5 : 0;
  const arrowBonus = profile.skillKey === 'bow' ? asInt(state.player.magicEffects?.firstShotBowBonus) : 0;
  const baseSkill = asInt(character.skills?.[profile.skillKey]) + arrowBonus;
  const rapid = declaration.fireMode === 'rapid';
  const attackBase = rapid ? Math.trunc(baseSkill / 2) : baseSkill;
  const modifier = rangeModifier + weatherModifier(declaration.weather) + shieldModifier + mountedModifier + aimModifier + actor.healthPenalty + actor.encumbrance.weaponModifier + declaration.sourceModifier + declaration.gmModifier;
  const shots = rapid ? 2 : 1;
  const exchange = { type: 'ranged', actorId: 'player', opponentId: target.id, profileId: state.player.missileWeaponId, range: target.distance, maximum, modifier, shots: [], packets: [], effects: [] };
  for (let index = 0; index < shots; index += 1) {
    const roll = input.actorRolls?.[index] || (index === 0 ? input.actorRoll : null) || rollDie(20, rng);
    const check = resolveD20Roll(roll, attackBase + modifier);
    const shot = { index: index + 1, check };
    if (check.success) {
      const dice = profile.damage.dice || Math.max(1, actor.damageDice + asInt(profile.damage.baseDiceModifier));
      const supplied = input.actorDamageTotals?.[index] ?? (index === 0 ? input.actorDamageTotal : undefined);
      const damage = check.critical ? maximumDamage(dice, profile.damage.bonus) : rollDice(dice, rng, supplied, profile.damage.bonus);
      exchange.packets.push({
        targetType: 'opponent', targetId: target.id, damage, rolledDamage: damage.total, armor: target.armor, shield: 0,
        shieldApplies: false, damageFraction: 1, weaponId: state.player.missileWeaponId,
        source: `${profile.label} 원거리 공격`, sourcePage: 'Ch.5 pp.104-105; Ch.7 p.126'
      });
    }
    if (check.fumble) exchange.effects.push({ type: 'missile_mishap', side: 'player', status: 'broken', note: '대실패' });
    if (profile.bowstring && declaration.weather === 'rain_snow' && [1, 2].includes(check.roll)) {
      exchange.effects.push({ type: 'missile_mishap', side: 'player', status: 'broken_string', note: '비나 눈 속 자연 1 또는 2' });
    }
    exchange.shots.push(shot);
  }
  exchange.effects.push({ type: 'ammo', side: 'player', ammoKey: profile.ammoKey, amount: -shots });
  if (profile.reloadRounds) exchange.effects.push({ type: 'reload', side: 'player', rounds: profile.reloadRounds });
  exchange.effects.push({ type: 'aim', side: 'player', value: false });
  if (arrowBonus) exchange.effects.push({ type: 'magic_item_use', side: 'player', magicItemId: 'griffin_arrow' });
  exchange.gloryMultiplier = 0.1;
  return exchange;
};

const resolveOpponentRangedAction = (character, state, declaration, opponentValue, input, rng, rapid = false) => {
  const player = playerCombatant(character, state);
  const opponent = opponentCombatant(opponentValue);
  const profile = MISSILE_PROFILES[opponent.missileWeaponId];
  const naturalRanged = opponent.attackProfile?.kind === 'ranged' && !opponent.attackProfile?.missileWeaponId;
  const maximum = opponent.attackProfile?.range || profile.maxRange || declaration.gmMaximumRange;
  const rangeModifier = getRangeModifier(opponent.distance, maximum);
  const shieldModifier = declaration.playerShieldUse === 'active' ? -player.shield : declaration.playerShieldUse === 'passive' && player.shield > 0 ? -3 : 0;
  const mountedModifier = opponent.mounted && ['bow', 'compoundBow', 'longbow'].includes(opponent.missileWeaponId) ? -5 : 0;
  const aimModifier = opponent.aimed ? 5 : 0;
  const attackBase = rapid ? Math.trunc(opponent.rangedSkill / 2) : opponent.rangedSkill;
  const modifier = rangeModifier + weatherModifier(declaration.weather) + shieldModifier + mountedModifier + aimModifier + opponent.healthPenalty;
  const shots = rapid ? 2 : 1;
  const exchange = { type: 'opponent_ranged', actorId: opponent.id, opponentId: 'player', profileId: opponent.missileWeaponId, range: opponent.distance, maximum, modifier, shots: [], packets: [], effects: [] };
  for (let index = 0; index < shots; index += 1) {
    const roll = input.enemyRolls?.[opponent.id]?.[index] || input.enemyRolls?.[opponent.id] || rollDie(20, rng);
    const check = resolveD20Roll(roll, attackBase + modifier);
    exchange.shots.push({ index: index + 1, check });
    if (check.success && !opponent.attackProfile?.noDamage) {
      const dice = opponent.attackProfile?.damageDice || profile.damage.dice || Math.max(1, opponent.damageDice + asInt(profile.damage.baseDiceModifier));
      const supplied = input.enemyDamageTotals?.[opponent.id]?.[index] ?? input.enemyDamageTotals?.[opponent.id];
      const damage = check.critical ? maximumDamage(dice, profile.damage.bonus) : rollDice(dice, rng, supplied, profile.damage.bonus);
      exchange.packets.push({
        targetType: 'player', targetId: 'player', damage, rolledDamage: damage.total, armor: player.armor, shield: 0,
        shieldApplies: false, damageFraction: 1, weaponId: opponent.missileWeaponId,
        source: `${opponent.name}의 ${profile.label} 원거리 공격`, sourcePage: 'Ch.5 pp.104-105; Ch.7 p.126'
      });
    }
    if (check.success && opponent.attackProfile?.effect && !exchange.specialHit) {
      exchange.specialHit = { attackerId: opponent.id, attackId: opponent.selectedAttackId, effect: opponent.attackProfile.effect };
    }
    if (!naturalRanged && check.fumble) exchange.effects.push({ type: 'missile_mishap', side: 'opponent', targetId: opponent.id, status: 'broken', note: '대실패' });
    if (!naturalRanged && profile.bowstring && declaration.weather === 'rain_snow' && [1, 2].includes(check.roll)) {
      exchange.effects.push({ type: 'missile_mishap', side: 'opponent', targetId: opponent.id, status: 'broken_string', note: '비나 눈 속 자연 1 또는 2' });
    }
  }
  if (!naturalRanged) exchange.effects.push({ type: 'ammo', side: 'opponent', targetId: opponent.id, ammoKey: profile.ammoKey, amount: -shots });
  if (!naturalRanged && profile.reloadRounds) exchange.effects.push({ type: 'reload', side: 'opponent', targetId: opponent.id, rounds: profile.reloadRounds });
  exchange.effects.push({ type: 'aim', side: 'opponent', targetId: opponent.id, value: false });
  return exchange;
};

const resolveDexAction = (character, state, declaration, input, rng) => {
  const actor = playerCombatant(character, state);
  const dexAction = declaration.dexAction || {};
  const type = ['balance', 'climb', 'jump', 'sneak', 'horse_jump', 'custom'].includes(dexAction.type) ? dexAction.type : 'custom';
  let modifier = asInt(dexAction.modifier) + declaration.sourceModifier + declaration.gmModifier;
  let target = actor.dex;
  if (type === 'balance') modifier += 0;
  else if (type === 'sneak') modifier += ['chainmail', 'plate'].includes(actor.armorType) || ['moderate', 'severe', 'overloaded'].includes(actor.encumbrance.id) ? -5 : 0;
  else if (type === 'horse_jump') {
    const horse = state.player.horse;
    if (!horse || !state.player.mounted) throw new RangeError('말을 탄 상태에서만 말 도약을 시도할 수 있습니다.');
    target = horse.dex;
  }
  else modifier += armorDexModifier(actor) + actor.encumbrance.dexModifier;
  if (type === 'climb') {
    if (dexAction.aid === 'rope') modifier += 5;
    if (dexAction.aid === 'ladder') modifier += 10;
    if (dexAction.aid === 'siege_ladder') modifier += clamp(input.siegeLadderRoll || rollDie(6, rng), 1, 6, 1) + 4;
  }
  const roll = input.dexRoll || rollDie(20, rng);
  const check = resolveD20Roll(roll, target + modifier);
  const exchange = { type: 'dex', actionType: type, check, modifier, effects: [], packets: [] };
  if (type === 'climb') {
    exchange.heightFeet = Math.max(1, asNumber(dexAction.heightFeet, 30));
    exchange.requiredChecks = Math.max(1, Math.ceil(exchange.heightFeet / 30));
    exchange.checks = Array.from({ length: exchange.requiredChecks }, (_, index) => index === 0 ? check : resolveD20Roll(input.dexRolls?.[index] || rollDie(20, rng), target + modifier));
    exchange.success = exchange.checks.every(item => item.success);
  }
  if (type === 'sneak') {
    const awarenessRoll = input.awarenessRoll || rollDie(20, rng);
    const awarenessCheck = resolveD20Roll(awarenessRoll, asInt(dexAction.awarenessTarget));
    exchange.awarenessCheck = awarenessCheck;
    exchange.opposed = check.critical && !awarenessCheck.critical
      ? { winner: 'actor', actorOutcome: 'critical', opponentOutcome: awarenessCheck.outcome }
      : check.fumble ? { winner: 'opponent', actorOutcome: 'fumble', opponentOutcome: awarenessCheck.outcome }
        : opposedWinner(check, awarenessCheck);
  }
  if (type === 'jump') {
    exchange.baseHeightFeet = actor.movementRate;
    exchange.baseDistanceYards = actor.movementRate;
    exchange.reachFeet = exchange.baseHeightFeet + actor.siz / 3;
    if (dexAction.extended) {
      exchange.strCheck = resolveD20Roll(input.strRoll || rollDie(20, rng), actor.str);
      exchange.extended = exchange.strCheck.success && check.success;
      if (exchange.extended) {
        exchange.heightFeet = exchange.baseHeightFeet + 1;
        exchange.distanceYards = exchange.baseDistanceYards + 1;
      }
    }
  }
  if (type === 'horse_jump') {
    const horse = state.player.horse;
    exchange.horseDexCheck = check;
    exchange.success = check.success;
    exchange.baseHeightFeet = horse.move;
    exchange.baseDistanceYards = horse.move;
    if (dexAction.extended) {
      exchange.horsemanshipCheck = resolveD20Roll(input.horsemanshipRoll || rollDie(20, rng), asInt(character.skills?.horsemanship) + asInt(state.player.magicEffects?.horsemanshipBonus));
      exchange.success = exchange.success && exchange.horsemanshipCheck.success;
      if (exchange.success) {
        exchange.heightFeet = exchange.baseHeightFeet + 1;
        exchange.distanceYards = exchange.baseDistanceYards + 1;
      }
    }
  }
  return exchange;
};

const resolveAwarenessAction = (character, state, declaration, input, rng) => {
  const actor = playerCombatant(character, state);
  const skillKey = declaration.awarenessSkill;
  const base = asInt(character.skills?.[skillKey]);
  const modifier = actor.healthPenalty + actor.encumbrance.awarenessModifier + declaration.sourceModifier + declaration.gmModifier;
  const check = resolveD20Roll(input.awarenessRoll || rollDie(20, rng), base + modifier);
  return { type: 'awareness', skillKey, check, modifier, packets: [], effects: [] };
};

const resolveSquireAction = (character, declaration, input, rng) => {
  const age = Math.max(0, asInt(character.squire?.age));
  const check = resolveD20Roll(input.squireRoll || rollDie(20, rng), age);
  const effects = [];
  if (check.success && declaration.squireRequest === 'weapon') effects.push({ type: 'weapon', side: 'player', targetId: 'player', weaponId: declaration.rearmWeaponId, status: 'ready' });
  if (check.success && declaration.squireRequest === 'shield') effects.push({ type: 'shield_restore', side: 'player', value: declaration.rearmShield || 6 });
  return { type: 'squire', request: declaration.squireRequest, check, packets: [], effects };
};

const resolveGrappleAction = (character, state, declaration, input, rng) => {
  const actor = playerCombatant(character, state);
  const targetId = declaration.targetIds[0] || state.player.grapple?.heldBy || state.player.grapple?.holding;
  const target = opponentById(state, targetId);
  if (!target) throw new RangeError('붙잡기 상대를 찾을 수 없습니다.');
  const opponent = opponentCombatant(target);
  const action = declaration.action;
  const actorBase = action === 'grapple_rearm' && declaration.grappleRearmStat === 'strength' ? actor.str : actor.unarmed;
  const defenderBase = target.weaponStatus === 'ready' && action === 'grapple' ? target.skill : target.unarmed;
  const actorMountedPenalty = !actor.mounted && opponent.mounted ? -5 : 0;
  const defenderMountedBonus = !actor.mounted && opponent.mounted ? 5 : 0;
  const actorCheck = resolveD20Roll(input.actorRoll || rollDie(20, rng), actorBase + actorMountedPenalty + declaration.sourceModifier + declaration.gmModifier);
  const opponentCheck = resolveD20Roll(input.opponentRoll || rollDie(20, rng), defenderBase + defenderMountedBonus);
  const opposed = opposedWinner(actorCheck, opponentCheck);
  const exchange = { type: 'grapple', action, actorId: 'player', opponentId: target.id, actorCheck, opponentCheck, opposed, packets: [], effects: [] };
  if (actorCheck.fumble) {
    exchange.effects.push({ type: 'prone', side: 'player', value: true });
    if (actor.mounted) {
      exchange.effects.push({ type: 'dismount', side: 'player', targetId: 'player' });
      exchange.packets.push({ targetType: 'player', rolledDamage: input.fallDamage || rollDie(6, rng), armor: 0, shield: 0, shieldApplies: false, direct: true, source: '붙잡기 대실패 낙마', sourcePage: 'Ch.7 p.128' });
    }
    return exchange;
  }
  if (opposed.winner === 'actor') {
    if (action === 'grapple') {
      exchange.effects.push({ type: 'grapple_hold', holder: 'player', targetId: target.id });
      exchange.effects.push({ type: 'weapon', side: 'player', targetId: 'player', status: 'dropped' });
      exchange.effects.push({ type: 'shield_drop', side: 'player' });
      exchange.effects.push({ type: 'weapon', side: 'opponent', targetId: target.id, status: 'dropped' });
    } else if (action === 'grapple_pin') exchange.effects.push({ type: 'grapple_pin', holder: 'player', targetId: target.id });
    else if (action === 'grapple_break') exchange.effects.push({ type: 'grapple_release', targetId: target.id });
    else if (action === 'grapple_reverse') exchange.effects.push({ type: 'grapple_reverse', targetId: target.id });
    else if (action === 'grapple_rearm') exchange.effects.push({ type: 'rearm_dagger', side: 'player' });
    else if (action === 'grapple_throw') {
      const dice = target.mounted ? 2 : 1;
      const damage = rollDice(dice, rng, input.throwDamageTotal);
      exchange.packets.push({ targetType: 'opponent', targetId: target.id, damage, rolledDamage: damage.total, armor: 0, shield: 0, shieldApplies: false, direct: true, source: '붙잡아 내던짐', sourcePage: 'Ch.7 p.128' });
      exchange.effects.push({ type: 'grapple_release', targetId: target.id });
      exchange.effects.push({ type: 'prone', side: 'opponent', targetId: target.id, value: true });
    } else if (action === 'grapple_strike') {
      const weaponId = state.player.weaponId === 'dagger' ? 'dagger' : 'unarmed';
      exchange.packets.push(rngDamagePacket({ attacker: { ...actor, weaponId }, defender: opponent, check: actorCheck, weaponId, suppliedDamage: input.actorDamageTotal, shieldApplies: false }, rng));
    }
  } else if (action === 'grapple' && opposed.winner === 'opponent' && target.weaponStatus === 'ready') {
    exchange.packets.push(rngDamagePacket({ attacker: opponent, defender: actor, check: opponentCheck, weaponId: opponent.weaponId, suppliedDamage: input.opponentDamageTotal, shieldApplies: false }, rng));
  }
  if (opponentCheck.fumble) {
    exchange.effects.push({ type: 'prone', side: 'opponent', targetId: target.id, value: true });
    if (opponent.mounted) {
      exchange.effects.push({ type: 'dismount', side: 'opponent', targetId: target.id });
      exchange.packets.push({ targetType: 'opponent', targetId: target.id, rolledDamage: input.opponentFallDamage || rollDie(6, rng), armor: 0, shield: 0, shieldApplies: false, direct: true, source: '붙잡기 대실패 낙마', sourcePage: 'Ch.7 p.128' });
    }
  }
  return exchange;
};

const wouldKnockDown = (packet, defender, balanceRoll, rng) => {
  if (packet.rolledDamage >= defender.siz * 2) return { knockedDown: true, automatic: true, check: null };
  if (packet.rolledDamage < defender.siz) return { knockedDown: false, automatic: false, check: null };
  const check = resolveD20Roll(balanceRoll || rollDie(20, rng), defender.dex);
  return { knockedDown: !check.success, automatic: false, check };
};

const resolveUncontrolled = (character, state, declaration, input, rng) => {
  const actor = playerCombatant(character, state);
  const target = opponentCombatant(opponentById(state, declaration.targetIds[0]));
  const defense = declaration.uncontrolledDefense;
  if (defense === 'defend') {
    const adjusted = { ...declaration, enemyPlans: { ...declaration.enemyPlans, [target.id]: 'defend' } };
    return resolveMeleeExchange(actor, target, adjusted, input, rng, actor.skill, 'uncontrolled');
  }
  if (defense === 'uncontrolled') {
    const actorStrike = makeUnopposedAttack(actor, target, input, rng, { uncontrolled: true, shieldAlways: true, source: '무제어 공격' });
    const defenderStrike = makeUnopposedAttack(target, actor, {
      roll: input.opponentRoll, damageTotal: input.opponentDamageTotal, damageRolls: input.opponentDamageRolls
    }, rng, { uncontrolled: true, shieldAlways: true, source: '상대의 무제어 공격' });
    return { type: 'uncontrolled_simultaneous', actorId: 'player', opponentId: target.id, packets: [...actorStrike.packets, ...defenderStrike.packets], effects: [...actorStrike.effects, ...defenderStrike.effects], strikes: [actorStrike, defenderStrike] };
  }
  const freeAttack = makeUnopposedAttack(target, actor, {
    roll: input.opponentRoll, damageTotal: input.opponentDamageTotal, damageRolls: input.opponentDamageRolls
  }, rng, { source: '무제어 공격에 앞선 자유 공격' });
  const packet = freeAttack.packets[0];
  const knockdown = packet ? wouldKnockDown(packet, actor, input.actorBalanceRoll, rng) : { knockedDown: false, check: null };
  const exchange = { type: 'uncontrolled', actorId: 'player', opponentId: target.id, defense, freeAttack, knockdown, packets: [...freeAttack.packets], effects: [...freeAttack.effects] };
  if (!knockdown.knockedDown) {
    const strike = makeUnopposedAttack(actor, target, {
      roll: input.actorRoll, damageTotal: input.actorDamageTotal, damageRolls: input.actorDamageRolls
    }, rng, { uncontrolled: true, shieldAlways: true, source: '무제어 공격' });
    exchange.strike = strike;
    exchange.packets.push(...strike.packets);
    exchange.effects.push(...strike.effects);
  } else {
    exchange.effects.push({ type: 'prone', side: 'player', value: true });
  }
  return exchange;
};

const resolveJoust = (character, state, declaration, input, rng) => {
  const actor = playerCombatant(character, state);
  const target = opponentCombatant(opponentById(state, declaration.targetIds[0]));
  const actorCheck = resolveD20Roll(input.actorRoll || rollDie(20, rng), asInt(character.skills?.lance) + declaration.sourceModifier + declaration.gmModifier);
  const opponentCheck = resolveD20Roll(input.opponentRoll || rollDie(20, rng), target.skill);
  const opposed = opposedWinner(actorCheck, opponentCheck);
  const exchange = { type: 'joust', actorId: 'player', opponentId: target.id, actorCheck, opponentCheck, opposed, packets: [], effects: [] };
  const addLoser = (winner, loser, winnerCheck, side, suppliedDamage) => {
    const fall = rollDice(1, rng, suppliedDamage);
    exchange.packets.push({ targetType: side, targetId: loser.id, damage: fall, rolledDamage: fall.total, armor: 0, shield: 0, shieldApplies: false, direct: true, source: '마상창 시합 낙마', sourcePage: 'Ch.7 p.125' });
    exchange.effects.push({ type: 'dismount', side, targetId: loser.id });
    exchange.effects.push({ type: 'prone', side, targetId: loser.id, value: true });
    if (winnerCheck.critical) {
      exchange.packets.push(rngDamagePacket({ attacker: winner, defender: loser, check: winnerCheck, weaponId: 'lance', charging: true, suppliedDamage: side === 'player' ? input.opponentLanceDamageTotal : input.actorLanceDamageTotal, shieldApplies: false, source: '마상창 시합 대성공' }, rng));
    }
  };
  if (opposed.winner === 'actor') addLoser(actor, target, actorCheck, 'opponent', input.opponentFallDamage);
  if (opposed.winner === 'opponent') addLoser(target, actor, opponentCheck, 'player', input.actorFallDamage);
  if ((actorCheck.success && actorCheck.roll % 2 === 1) || actorCheck.fumble) exchange.effects.push({ type: 'weapon', side: 'player', targetId: 'player', status: 'broken' });
  if ((opponentCheck.success && opponentCheck.roll % 2 === 1) || opponentCheck.fumble) exchange.effects.push({ type: 'weapon', side: 'opponent', targetId: target.id, status: 'broken' });
  if (actorCheck.fumble || opponentCheck.fumble) {
    exchange.gmChoice = {
      choice: declaration.joustFumbleChoice,
      note: declaration.joustFumbleNote,
      source: 'GM choice from printed examples; no invented modifier'
    };
    if (exchange.gmChoice.choice === 'self_fall' || exchange.gmChoice.choice === 'saddle_failure') {
      const side = actorCheck.fumble ? 'player' : 'opponent';
      const loser = side === 'player' ? actor : target;
      const fall = rollDice(1, rng, side === 'player' ? input.actorFallDamage : input.opponentFallDamage);
      exchange.packets.push({ targetType: side, targetId: loser.id, damage: fall, rolledDamage: fall.total, armor: 0, shield: 0, shieldApplies: false, direct: true, source: '마상창 시합 대실패 낙마', sourcePage: 'Ch.7 p.125' });
      exchange.effects.push({ type: 'dismount', side, targetId: loser.id });
      exchange.effects.push({ type: 'prone', side, targetId: loser.id, value: true });
    } else if (exchange.gmChoice.choice === 'struck_horse') {
      const targetSide = actorCheck.fumble ? 'opponent_horse' : 'player_horse';
      const owner = actorCheck.fumble ? target : actor;
      if (owner.horse) {
        const damage = rollDice(owner.horse.damageDice || 6, rng, input.joustHorseDamageTotal);
        exchange.packets.push({ targetType: targetSide, targetId: owner.id, damage, rolledDamage: damage.total, armor: owner.horse.armor, shield: 0, shieldApplies: false, source: '마상창 시합 대실패로 말을 가격', sourcePage: 'Ch.7 p.125' });
      }
    }
  }
  return exchange;
};

const resolveEvasion = (character, state, declaration, input, rng) => {
  const actor = playerCombatant(character, state);
  const enemies = livingOpponents(state).filter(isEngaged);
  if (enemies.length > 1 && !declaration.movement?.gmMultipleApproved) throw new RangeError('다수 상대에게서 이탈하려면 GM 승인이 필요합니다.');
  const normalHorseEvasion = state.horseControl?.round === state.round && state.horseControl.status === 'failure';
  const base = actor.mounted ? asInt(character.skills?.horsemanship) + asInt(state.player.magicEffects?.horsemanshipBonus) : actor.dex;
  validateAllocations(declaration, base, enemies.map(enemy => enemy.id), 'evade');
  const exchanges = enemies.map((enemy, index) => {
    const opponent = opponentCombatant(enemy);
    const actorBase = allocationFor(declaration, enemy.id, base, enemies.length, 'evade');
    const actorModifier = (normalHorseEvasion ? 0 : -5 + (actor.mounted ? 0 : actor.encumbrance.dexModifier)) + declaration.sourceModifier + declaration.gmModifier;
    const opponentModifier = 5 + opponent.healthPenalty;
    const actorCheck = resolveD20Roll(input.actorRolls?.[enemy.id] || (index === 0 ? input.actorRoll : null) || rollDie(20, rng), actorBase + actorModifier);
    const opponentCheck = resolveD20Roll(input.opponentRolls?.[enemy.id] || (index === 0 ? input.opponentRoll : null) || rollDie(20, rng), opponent.skill + opponentModifier);
    const opposed = opposedWinner(actorCheck, opponentCheck);
    const exchange = { type: 'evasion', actorId: 'player', opponentId: enemy.id, actorCheck, opponentCheck, opposed, normalHorseEvasion, packets: [], effects: [] };
    if (opposed.winner === 'opponent') {
      exchange.packets.push(rngDamagePacket({ attacker: opponent, defender: actor, check: opponentCheck, weaponId: opponent.weaponId, suppliedDamage: input.enemyDamageTotals?.[enemy.id] ?? input.opponentDamageTotal, shieldApplies: opposed.actorOutcome === 'partial' }, rng));
    }
    if (actorCheck.fumble) {
      exchange.effects.push({ type: 'prone', side: 'player', value: true });
      if (actor.mounted) {
        const fall = rollDice(1, rng, input.actorFallDamage);
        exchange.packets.push({ targetType: 'player', damage: fall, rolledDamage: fall.total, armor: 0, shield: 0, shieldApplies: false, direct: true, source: '이탈 대실패 낙마', sourcePage: 'Ch.7 p.127' });
      }
    }
    return exchange;
  });
  const success = exchanges.every(exchange => exchange.opposed.winner === 'actor');
  exchanges.push({ type: 'evasion_result', success, packets: [], effects: [{ type: 'evasion', success }] });
  return exchanges;
};

const independentEnemyActions = (character, state, declaration, input, rng, alreadyOpposed) => {
  const player = playerCombatant(character, state);
  return livingOpponents(state).flatMap(opponent => {
    if (alreadyOpposed.has(opponent.id) || opponent.supportedByAlly || opponent.chargeFollowThrough) return [];
    const plan = declaration.enemyPlans[opponent.id] || (isEngaged(opponent) ? 'attack' : 'approach');
    if (plan === 'aim') return [{ type: 'opponent_aim', packets: [], effects: [{ type: 'aim', side: 'opponent', targetId: opponent.id, value: true }] }];
    if (['ranged', 'rapid_ranged'].includes(plan)) return [resolveOpponentRangedAction(character, state, declaration, opponent, input, rng, plan === 'rapid_ranged')];
    if (plan === 'lance_charge') {
      return [makeUnopposedAttack(opponentCombatant(opponent), player, {
        roll: input.enemyRolls?.[opponent.id], damageTotal: input.enemyDamageTotals?.[opponent.id], damageRolls: input.enemyDamageRolls?.[opponent.id]
      }, rng, { charging: true, source: `${opponent.name}의 마상창 돌격` }), { type: 'enemy_charge_follow_through', packets: [], effects: [{ type: 'charge_follow_through', side: 'opponent', targetId: opponent.id, value: true }] }];
    }
    if (plan === 'grapple' && isEngaged(opponent)) {
      const adjusted = { ...declaration, enemyPlans: { ...declaration.enemyPlans, [opponent.id]: 'grapple' } };
      return [resolveMeleeExchange(player, opponentCombatant(opponent), adjusted, {
        ...input, actorRoll: input.actorRoll, opponentRoll: input.enemyRolls?.[opponent.id] ?? input.opponentRoll,
        actorDamageTotal: input.actorDamageTotal
      }, rng, player.skill, 'attack')];
    }
    if (plan === 'uncontrolled' && isEngaged(opponent)) {
      return [makeUnopposedAttack(opponentCombatant(opponent), player, {
        roll: input.enemyRolls?.[opponent.id], damageTotal: input.enemyDamageTotals?.[opponent.id], damageRolls: input.enemyDamageRolls?.[opponent.id]
      }, rng, { uncontrolled: true, shieldAlways: true, source: `${opponent.name}의 무제어 공격` })];
    }
    if (plan !== 'attack' || !isEngaged(opponent)) return [];
    return [makeUnopposedAttack(opponentCombatant(opponent), player, {
      roll: input.enemyRolls?.[opponent.id], damageTotal: input.enemyDamageTotals?.[opponent.id], damageRolls: input.enemyDamageRolls?.[opponent.id]
    }, rng, { source: `${opponent.name}의 무방비 공격` })];
  });
};

const horseFallEffects = (character, state, exchanges, input, rng) => {
  const extra = [];
  for (const exchange of exchanges) {
    for (const packet of exchange.packets || []) {
      if (packet.weaponId !== 'lance' || packet.rolledDamage <= 0) continue;
      if (packet.targetType === 'player' && state.player.mounted && state.player.horse && packet.rolledDamage > state.player.horse.siz) {
        const riding = resolveD20Roll(input.actorHorsemanshipRoll || rollDie(20, rng), asInt(character.skills?.horsemanship) + asInt(state.player.magicEffects?.horsemanshipBonus));
        if (riding.success) {
          const horseDex = resolveD20Roll(input.actorHorseDexRoll || rollDie(20, rng), state.player.horse.dex);
          exchange.horseCheck = { side: 'player', riding, horseDex };
          if (!horseDex.success) {
            exchange.effects.push({ type: 'horse_fall', side: 'player' });
            const fall = rollDice(1, rng, input.actorFallDamage);
            extra.push({ targetType: 'player', damage: fall, rolledDamage: fall.total, armor: 0, shield: 0, shieldApplies: false, direct: true, source: '말이 쓰러져 낙마', sourcePage: 'Ch.7 p.123' });
          }
        } else exchange.horseCheck = { side: 'player', riding, horseDex: null };
      }
      if (packet.targetType === 'opponent') {
        const target = opponentById(state, packet.targetId);
        if (!target?.mounted || !target.horse || packet.rolledDamage <= target.horse.siz) continue;
        const riding = resolveD20Roll(input.opponentHorsemanshipRoll || rollDie(20, rng), target.horsemanship);
        if (riding.success) {
          const horseDex = resolveD20Roll(input.opponentHorseDexRoll || rollDie(20, rng), target.horse.dex);
          exchange.horseCheck = { side: 'opponent', targetId: target.id, riding, horseDex };
          if (!horseDex.success) {
            exchange.effects.push({ type: 'horse_fall', side: 'opponent', targetId: target.id });
            const fall = rollDice(1, rng, input.opponentFallDamage);
            extra.push({ targetType: 'opponent', targetId: target.id, damage: fall, rolledDamage: fall.total, armor: 0, shield: 0, shieldApplies: false, direct: true, source: '말이 쓰러져 낙마', sourcePage: 'Ch.7 p.123' });
          }
        } else exchange.horseCheck = { side: 'opponent', targetId: target.id, riding, horseDex: null };
      }
    }
  }
  if (extra.length && exchanges[0]) exchanges[0].packets.push(...extra);
};

export const resolveChapter7Action = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = activeState(character);
  if (state.phase !== 'resolution' || !state.declaration) throw new RangeError('판정할 선언이 없습니다.');
  const declaration = state.declaration;
  const resolutionId = `${declaration.id}:resolution`;
  if (state.appliedResolutionIds.includes(resolutionId)) throw new RangeError('이미 판정한 행동입니다.');
  const action = declaration.action;
  const player = playerCombatant(character, state);
  const exchanges = [];
  const opposedIds = new Set();

  if (['attack', 'defend', 'dodge', 'double_feint', 'lance_charge'].includes(action)) {
    const ids = ['defend', 'dodge'].includes(action)
      ? livingOpponents(state).filter(opponent => isEngaged(opponent) || declaration.enemyPlans?.[opponent.id] === 'lance_charge').map(opponent => opponent.id)
      : declaration.targetIds;
    const base = action === 'dodge' ? player.dex : action === 'lance_charge' ? asInt(character.skills?.lance) : player.skill;
    validateAllocations(declaration, base, ids, action);
    let dodgeKnockedDown = Boolean(state.player.prone);
    ids.forEach((id, index) => {
      const opponent = opponentById(state, id);
      if (!opponent) return;
      opposedIds.add(id);
      const exchangeInput = {
        ...input,
        actorRoll: input.actorRolls?.[id] ?? (index === 0 ? input.actorRoll : undefined),
        opponentRoll: input.opponentRolls?.[id] ?? (index === 0 ? input.opponentRoll : undefined),
        actorDamageTotal: input.actorDamageTotals?.[id] ?? (index === 0 ? input.actorDamageTotal : undefined),
        opponentDamageTotal: input.opponentDamageTotals?.[id] ?? (index === 0 ? input.opponentDamageTotal : undefined)
      };
      if (action === 'dodge' && dodgeKnockedDown) {
        exchanges.push(makeUnopposedAttack(opponentCombatant(opponent), { ...player, prone: true }, {
          roll: exchangeInput.opponentRoll, damageTotal: exchangeInput.opponentDamageTotal, damageRolls: exchangeInput.opponentDamageRolls
        }, rng, { source: `${opponent.name}의 넘어진 상대 공격` }));
        return;
      }
      const exchange = resolveMeleeExchange(player, opponentCombatant(opponent), declaration, exchangeInput, rng, allocationFor(declaration, id, base, ids.length, action), action);
      if (action === 'dodge') {
        const packet = exchange.packets.find(item => item.targetType === 'player');
        if (packet) {
          const predicted = wouldKnockDown(packet, player, input.actorBalanceRolls?.[id] ?? input.actorBalanceRoll, rng);
          exchange.predictedKnockdown = predicted;
          dodgeKnockedDown = predicted.knockedDown;
        }
      }
      exchanges.push(exchange);
    });
    if (action === 'lance_charge') exchanges.push({ type: 'charge_follow_through', packets: [], effects: [{ type: 'charge_follow_through', side: 'player', value: true }] });
  } else if (action === 'ranged') {
    exchanges.push(resolveRangedAction(character, state, declaration, input, rng));
  } else if (action === 'uncontrolled') {
    opposedIds.add(declaration.targetIds[0]);
    exchanges.push(resolveUncontrolled(character, state, declaration, input, rng));
  } else if (action === 'joust') {
    opposedIds.add(declaration.targetIds[0]);
    exchanges.push(resolveJoust(character, state, declaration, input, rng));
  } else if (action === 'evade') {
    exchanges.push(...resolveEvasion(character, state, declaration, input, rng));
  } else if (action === 'dex') {
    exchanges.push(resolveDexAction(character, state, declaration, input, rng));
  } else if (action === 'awareness') {
    exchanges.push(resolveAwarenessAction(character, state, declaration, input, rng));
  } else if (action.startsWith('grapple')) {
    opposedIds.add(declaration.targetIds[0] || state.player.grapple?.heldBy || state.player.grapple?.holding);
    exchanges.push(resolveGrappleAction(character, state, declaration, input, rng));
  } else if (action === 'aim') exchanges.push({ type: 'aim', packets: [], effects: [{ type: 'aim', side: 'player', value: true }] });
  else if (action === 'rearm') exchanges.push({ type: 'rearm', packets: [], effects: declaration.rearmShield > 0
    ? [{ type: 'shield_restore', side: 'player', value: declaration.rearmShield }]
    : [{ type: 'weapon', side: 'player', targetId: 'player', weaponId: declaration.rearmWeaponId, status: 'ready' }] });
  else if (action === 'squire') exchanges.push(resolveSquireAction(character, declaration, input, rng));
  else exchanges.push({ type: action, packets: [], effects: [] });

  if (!['defend', 'dodge', 'evade'].includes(action)) {
    exchanges.push(...independentEnemyActions(character, state, declaration, input, rng, opposedIds));
  }
  horseFallEffects(character, state, exchanges, input, rng);
  const packets = exchanges.flatMap(exchange => exchange.packets || []);
  const effects = exchanges.flatMap(exchange => exchange.effects || []);
  const pending = {
    id: resolutionId, round: state.round, action, declaration: clone(declaration), exchanges, packets, effects,
    visitedPhases: ['determination', 'resolution', 'winner'], createdAt: iso(input.now)
  };
  state.pending = pending;
  state.phase = 'winner';
  state.updatedAt = pending.createdAt;
  character.campaign.combat = state;
  character.campaign.schemaVersion = 12;
  return { character, pending };
};

const setOpponent = (state, updated) => {
  state.opponents = state.opponents.map(opponent => opponent.id === updated.id ? updated : opponent);
};

const applyEquipmentWear = (state, packet) => {
  const target = packet.targetType === 'player' ? state.player : opponentById(state, packet.targetId);
  if (!target || !Array.isArray(packet.damage?.rolls) || !packet.damage.rolls.length) return null;
  const sixes = packet.damage.rolls.filter(value => value === 6).length;
  if (!sixes) return null;
  const profile = WEAPON_PROFILES[packet.weaponId];
  if (packet.shieldApplies && target.shield > 0) {
    const loss = sixes * (profile?.shieldDamagePerSix || 1);
    const before = target.shield;
    target.shield = Math.max(0, before - loss);
    return { item: 'shield', before, after: target.shield, loss };
  }
  const loss = Math.floor(sixes / 2);
  if (!loss) return null;
  const before = target.armor;
  target.armor = Math.max(0, before - loss);
  return { item: 'armor', before, after: target.armor, loss };
};

const applyHorsePacket = (horseValue, packet, rng) => {
  const horse = createHorse(horseValue);
  const alreadyRuined = Boolean(horse.ruinApplied || horse.status === 'broken');
  const attributes = {
    siz: horse.siz, dex: horse.dex, str: horse.str, con: horse.con, currentHp: horse.currentHp,
    majorWoundThreshold: horse.majorWoundThreshold, unconsciousThreshold: horse.unconsciousThreshold
  };
  const applied = applyDamageState(attributes, horse.health, {
    rolledDamage: packet.rolledDamage, armor: packet.direct ? 0 : horse.armor, shield: 0, shieldApplies: false,
    direct: Boolean(packet.direct), year: packet.year, source: packet.source || '말의 부상', sourceRuleId: 'COMBAT-HORSE-001',
    sourcePage: packet.sourcePage || 'Ch.7 pp.119, 123-124', requiresValorousToContinue: false
  }, rng);
  horse.currentHp = applied.attributes.currentHp;
  horse.siz = applied.attributes.siz;
  horse.dex = applied.attributes.dex;
  horse.str = applied.attributes.str;
  horse.con = applied.attributes.con;
  horse.health = applied.health;
  if (horse.currentHp <= 0) horse.status = 'dead';
  else if (applied.health.unconscious) horse.status = 'unconscious';
  else if (['major', 'mortal'].includes(applied.result.classification)) {
    horse.status = 'broken';
    if (!alreadyRuined) {
      horse.str = Math.max(1, horse.str - 2);
      horse.con = Math.max(1, horse.con - 2);
      horse.move = Math.max(0, horse.move - 1);
      horse.maxHp = Math.max(1, horse.maxHp - 2);
      horse.currentHp = Math.min(horse.currentHp, horse.maxHp);
      horse.ruinApplied = true;
      horse.health = sanitizeHealthState(horse.health, {
        siz: horse.siz, con: horse.con, str: horse.str, currentHp: horse.currentHp,
        majorWoundThreshold: horse.majorWoundThreshold, unconsciousThreshold: horse.unconsciousThreshold
      });
    }
  }
  else if (applied.result.actualDamage > 0) horse.status = 'wounded';
  return { horse, injury: applied.result };
};

const applyEffect = (state, effect) => {
  const target = effect.side === 'player' ? state.player : opponentById(state, effect.targetId);
  if (effect.type === 'weapon' && target) {
    if (effect.weaponId) target.weaponId = effect.weaponId;
    target.weaponStatus = effect.status;
  } else if (effect.type === 'shield_drop' && target) target.shield = 0;
  else if (effect.type === 'shield_restore' && target) {
    target.shield = Math.max(0, asInt(effect.value));
    target.shieldMax = Math.max(target.shieldMax, target.shield);
  }
  else if (effect.type === 'prone' && target) {
    target.prone = Boolean(effect.value);
    target.knockedDownRound = effect.value ? state.round : null;
  }
  else if (effect.type === 'ammo' && target) target.ammo[effect.ammoKey] = Math.max(0, asInt(target.ammo[effect.ammoKey]) + asInt(effect.amount));
  else if (effect.type === 'reload' && target) target.reloadRemaining = Math.max(0, asInt(effect.rounds));
  else if (effect.type === 'aim' && target) target.aimed = Boolean(effect.value);
  else if (effect.type === 'missile_mishap' && target) target.missileStatus = effect.status;
  else if (effect.type === 'dismount' && target) target.mounted = false;
  else if (effect.type === 'charge_follow_through' && target) target.chargeFollowThrough = Boolean(effect.value);
  else if (effect.type === 'horse_fall' && target?.horse) {
    target.horse.status = 'fallen';
    target.mounted = false;
    target.prone = true;
    target.knockedDownRound = state.round;
  } else if (effect.type === 'grapple_hold') {
    if (effect.holder === 'opponent') {
      state.player.grapple = { heldBy: effect.holderId, pinned: false };
      const opponent = opponentById(state, effect.holderId);
      if (opponent) opponent.grapple = { holding: 'player', pinned: false };
    } else {
      state.player.grapple = { holding: effect.targetId, pinned: false };
      const opponent = opponentById(state, effect.targetId);
      if (opponent) opponent.grapple = { heldBy: 'player', pinned: false };
    }
  } else if (effect.type === 'grapple_pin') {
    state.player.grapple = { holding: effect.targetId, pinned: false };
    const opponent = opponentById(state, effect.targetId);
    if (opponent) opponent.grapple = { heldBy: 'player', pinned: true };
  } else if (effect.type === 'grapple_release') {
    state.player.grapple = null;
    const opponent = opponentById(state, effect.targetId);
    if (opponent) opponent.grapple = null;
  } else if (effect.type === 'grapple_reverse') {
    state.player.grapple = { holding: effect.targetId, pinned: false };
    const opponent = opponentById(state, effect.targetId);
    if (opponent) opponent.grapple = { heldBy: 'player', pinned: false };
  } else if (effect.type === 'rearm_dagger') {
    state.player.weaponId = 'dagger';
    state.player.weaponStatus = 'ready';
  }
};

export const applyChapter7Consequences = (characterValue, input = {}, rng = Math.random) => {
  let character = clone(characterValue);
  const state = activeState(character);
  if (state.phase !== 'winner' || !state.pending) throw new RangeError('적용할 승자 처리 결과가 없습니다.');
  if (state.appliedResolutionIds.includes(state.pending.id)) throw new RangeError('이미 적용한 공격 결과입니다.');
  const injuries = [];
  const wear = [];
  for (const packet of state.pending.packets) {
    if (packet.targetType === 'player') {
      const applied = applyCharacterDamage(character, {
        ...packet, rolledDamage: packet.rolledDamage, year: state.year, balanceRoll: packet.balanceRoll,
        sourceRuleId: 'COMBAT-DAMAGE-001', requiresValorousToContinue: true, now: input.now
      }, rng);
      character = applied.character;
      injuries.push({ side: 'player', injury: applied.injury, packet });
      if (state.player.magicEffects?.automaticFirstAid && applied.injury.actualDamage > 0 && applied.injury.woundId) {
        const treated = resolveFirstAid(character,{woundId:applied.injury.woundId,skill:19,roll:1,healingRoll:input.automaticFirstAidHealing,now:input.now},rng);
        character = treated.character;
        injuries.push({side:'player',treatment:treated.treatment,source:'Otuel’s Gambeson'});
      }
      if (applied.injury.knockedDown) {
        state.player.prone = true;
        state.player.knockedDownRound = state.round;
        if (state.player.mounted) {
          const fall = applyCharacterDamage(character, { rolledDamage: input.actorFallDamage || rollDie(6, rng), direct: true, armor: 0, skipKnockdown: true, year: state.year, source: '낙마', sourceRuleId: 'COMBAT-KNOCKDOWN-001', sourcePage: 'Ch.7 p.119', now: input.now }, rng);
          character = fall.character;
          state.player.mounted = false;
          injuries.push({ side: 'player', injury: fall.injury, fall: true });
        }
      }
    } else if (packet.targetType === 'opponent') {
      const opponent = opponentById(state, packet.targetId);
      if (!opponent) continue;
      const attributes = {
        siz: opponent.siz, dex: opponent.dex, str: opponent.str, con: opponent.con, hpBonus: opponent.hpBonus, currentHp: opponent.currentHp,
        majorWoundThreshold: opponent.majorWoundThreshold, unconsciousThreshold: opponent.unconsciousThreshold
      };
      const immuneToNormalWeapons = opponent.immunities.includes('normal_weapons') && !state.player.magicEffects?.weaponItemIds?.length;
      const applied = applyDamageState(attributes, opponent.health, {
        ...packet, rolledDamage: immuneToNormalWeapons ? 0 : packet.rolledDamage, year: state.year, sourceRuleId: 'COMBAT-DAMAGE-001', requiresValorousToContinue: false, now: input.now
      }, rng);
      opponent.currentHp = applied.attributes.currentHp;
      opponent.siz = applied.attributes.siz;
      opponent.dex = applied.attributes.dex;
      opponent.str = applied.attributes.str;
      opponent.con = applied.attributes.con;
      opponent.health = applied.health;
      if (applied.health.unconscious || opponent.currentHp <= 0) {
        if (opponent.attackOptions.some(option => option.actsAfterIncapacitation)) {
          opponent.lastStandUntilRound = state.round + 1;
          opponent.status = 'active';
        } else opponent.status = 'defeated';
      }
      if (applied.result.knockedDown) {
        opponent.prone = true;
        opponent.knockedDownRound = state.round;
        if (opponent.mounted) {
          const fall = applyDamageState(applied.attributes, opponent.health, { rolledDamage: input.opponentFallDamage || rollDie(6, rng), direct: true, armor: 0, skipKnockdown: true, year: state.year, source: '낙마', sourceRuleId: 'COMBAT-KNOCKDOWN-001', sourcePage: 'Ch.7 p.119', now: input.now }, rng);
          opponent.currentHp = fall.attributes.currentHp;
          opponent.health = fall.health;
          opponent.mounted = false;
          injuries.push({ side: 'opponent', targetId: opponent.id, injury: fall.result, fall: true });
        }
      }
      setOpponent(state, opponent);
      injuries.push({ side: 'opponent', targetId: opponent.id, injury: applied.result, packet });
    } else if (packet.targetType === 'player_horse' && state.player.horse) {
      const applied = applyHorsePacket(state.player.horse, { ...packet, year: state.year }, rng);
      state.player.horse = applied.horse;
      if (applied.horse.status === 'dead' || applied.horse.status === 'unconscious') state.player.mounted = false;
      injuries.push({ side: 'player_horse', injury: applied.injury });
    } else if (packet.targetType === 'opponent_horse') {
      const opponent = opponentById(state, packet.targetId);
      if (!opponent?.horse) continue;
      const applied = applyHorsePacket(opponent.horse, { ...packet, year: state.year }, rng);
      opponent.horse = applied.horse;
      if (applied.horse.status === 'dead' || applied.horse.status === 'unconscious') opponent.mounted = false;
      setOpponent(state, opponent);
      injuries.push({ side: 'opponent_horse', targetId: opponent.id, injury: applied.injury });
    }
    const equipment = applyEquipmentWear(state, packet);
    if (equipment) wear.push({ side: packet.targetType, targetId: packet.targetId, ...equipment });
  }
  state.pending.effects.forEach(effect => applyEffect(state, effect));
  state.pending.effects.filter(effect => effect.type === 'magic_item_use').forEach(effect => {
    const owned = (character.campaign?.economy?.magicItems || []).find(item => item.magicItemId === effect.magicItemId && item.equipped && !item.consumed);
    if (owned) {
      owned.used = true;
      owned.useCount = asInt(owned.useCount) + 1;
      owned.lastUsedYear = state.year;
      state.player.magicEffects = getMagicCombatEffects(character);
    }
  });
  if (state.pending.declaration.experienceApproved) {
    const notableWin = state.pending.exchanges.some(exchange => exchange.actorCheck?.success && exchange.opposed?.winner === 'actor');
    if (notableWin) {
      const profile = WEAPON_PROFILES[state.player.weaponId];
      const skillKey = state.pending.action === 'lance_charge' || state.pending.action === 'joust' ? 'lance' : profile?.lance ? 'spear' : profile?.skillKey;
      if (skillKey) character.skillsChecked = { ...(character.skillsChecked || {}), [skillKey]: true };
    }
  }
  state.appliedResolutionIds.push(state.pending.id);
  state.pending.injuries = injuries;
  state.pending.equipmentWear = wear;
  state.pending.visitedPhases.push('loser');
  state.phase = 'movement';
  state.updatedAt = iso(input.now);
  character.campaign.combat = state;
  character.campaign.schemaVersion = 12;
  return { character, injuries, wear, pending: state.pending };
};

const movementAllowance = (player, movement = {}) => {
  const speed = ['walk', 'run', 'sprint'].includes(movement.speed) ? movement.speed : 'walk';
  const multiplier = speed === 'sprint' ? 3 : speed === 'run' ? 2 : 1;
  const base = player.mounted && player.horse ? player.horse.move : player.movementRate;
  return { speed, base, maximum: base * multiplier, awarenessModifier: speed === 'sprint' ? -10 : speed === 'run' ? -5 : 0 };
};

const moveRelativeToTarget = (state, movement, maximum) => {
  const target = opponentById(state, movement.targetId);
  if (!target) return null;
  const yards = Math.min(maximum, Math.max(0, asNumber(movement.yards, maximum)));
  const before = target.distance;
  target.distance = movement.direction === 'away' ? before + yards : Math.max(0, before - yards);
  setOpponent(state, target);
  return { targetId: target.id, before, after: target.distance, yards, direction: movement.direction === 'away' ? 'away' : 'toward' };
};

export const completeChapter7Movement = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = activeState(character);
  if (state.phase !== 'movement' || !state.pending) throw new RangeError('이동 단계가 아닙니다.');
  if (character.campaign?.chapter18?.active?.pendingSpecial) throw new RangeError('Chapter 18 특수 결과를 먼저 확정해야 합니다.');
  const declaration = state.pending.declaration;
  const player = playerCombatant(character, state);
  const movementOrder = [
    { id: 'player', rate: state.player.mounted && state.player.horse ? state.player.horse.move : player.movementRate, dex: player.dex },
    ...livingOpponents(state).map(opponent => ({
      id: opponent.id,
      rate: opponent.mounted && opponent.horse ? opponent.horse.move : opponent.movementRate,
      dex: opponent.dex
    }))
  ].sort((left, right) => right.rate - left.rate || right.dex - left.dex);
  state.initiativeOrder = movementOrder.map(entry => entry.id);
  const movement = { ...declaration.movement, ...(input.movement || {}) };
  let moved = null;
  if (state.player.prone && state.player.knockedDownRound != null && state.player.knockedDownRound < state.round) {
    state.player.prone = false;
    state.player.knockedDownRound = null;
  }
  if (declaration.action === 'move' || (declaration.action === 'evade' && state.pending.exchanges.find(exchange => exchange.type === 'evasion_result')?.success)) {
    const allowance = movementAllowance(player, movement);
    if (['run', 'sprint'].includes(allowance.speed) && !movement.gmFastMovementApproved) throw new RangeError('근접 상황의 달리기나 전력 질주는 GM 승인이 필요합니다.');
    moved = { ...moveRelativeToTarget(state, movement, allowance.maximum), ...allowance };
  } else if (declaration.action === 'lance_charge') {
    const target = opponentById(state, declaration.targetIds[0]);
    if (target) {
      moved = { targetId: target.id, before: target.distance, after: 1, yards: Math.max(6, target.distance - 1), direction: 'through' };
      target.distance = 1;
      setOpponent(state, target);
    }
  } else if (declaration.action === 'follow_through') {
    const yards = state.player.horse?.move || 0;
    state.opponents = state.opponents.map(opponent => ({ ...opponent, distance: opponent.distance + yards }));
    state.player.chargeFollowThrough = false;
    moved = { yards, direction: 'straight_through' };
  } else if (declaration.action === 'reload') {
    state.player.reloadRemaining = Math.max(0, state.player.reloadRemaining - 1);
  } else if (declaration.action === 'mount') {
    if (!state.player.horse || ['dead', 'unconscious', 'fallen'].includes(state.player.horse.status)) throw new RangeError('현재 말에는 탈 수 없습니다.');
    state.player.mounted = true;
  } else if (declaration.action === 'dismount') state.player.mounted = false;
  else if (declaration.action === 'get_up') {
    state.player.prone = false;
    state.player.knockedDownRound = null;
  }

  const enemyMovement = [];
  for (const opponent of livingOpponents(state)) {
    const plan = declaration.enemyPlans?.[opponent.id] || (opponent.distance > 1 ? 'approach' : 'attack');
    if (opponent.chargeFollowThrough) {
      const before = opponent.distance;
      const yards = opponent.horse?.move || 0;
      opponent.distance += yards;
      opponent.chargeFollowThrough = false;
      enemyMovement.push({ targetId: opponent.id, before, after: opponent.distance, direction: 'straight_through' });
      setOpponent(state, opponent);
    } else if (plan === 'reload') {
      const before = opponent.reloadRemaining;
      opponent.reloadRemaining = Math.max(0, before - 1);
      enemyMovement.push({ targetId: opponent.id, action: 'reload', before, after: opponent.reloadRemaining });
      setOpponent(state, opponent);
    } else if (plan === 'lance_charge') {
      const before = opponent.distance;
      opponent.distance = 1;
      enemyMovement.push({ targetId: opponent.id, before, after: 1, direction: 'charge' });
      setOpponent(state, opponent);
    } else if (plan === 'approach' && opponent.distance > 1 && !opponent.supportedByAlly) {
      const before = opponent.distance;
      opponent.distance = Math.max(0, opponent.distance - (opponent.mounted && opponent.horse ? opponent.horse.move : opponent.movementRate));
      enemyMovement.push({ targetId: opponent.id, before, after: opponent.distance });
      setOpponent(state, opponent);
    }
  }
  state.opponents = state.opponents.map(opponent => opponent.prone && opponent.knockedDownRound != null && opponent.knockedDownRound < state.round
    ? { ...opponent, prone: false, knockedDownRound: null }
    : opponent);
  const roundRecord = {
    ...state.pending, movement: { player: moved, enemies: enemyMovement },
    initiativeOrder: [...state.initiativeOrder],
    visitedPhases: [...state.pending.visitedPhases, 'movement'], completedAt: iso(now)
  };
  state.rounds.push(roundRecord);
  state.rounds = state.rounds.slice(-250);
  state.round += 1;
  state.phase = 'determination';
  state.declaration = null;
  state.pending = null;
  if (state.player.mounted && state.player.horse && !state.player.horse.combatTrained && state.horseControl?.status !== 'exempt') {
    state.horseControl = { status: 'pending', round: state.round, check: null, sourcePage: 378 };
  }
  state.updatedAt = roundRecord.completedAt;
  character.campaign.combat = state;
  character.campaign.schemaVersion = 12;
  return { character, round: roundRecord };
};

export const applyChapter7HorseDamage = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = activeState(character);
  if (state.phase !== 'determination') throw new RangeError('말의 별도 피해는 새 라운드의 행동 선언 전에 처리하세요. 판정 중 상태는 변경할 수 없습니다.');
  const side = input.side === 'opponent' ? 'opponent' : 'player';
  const owner = side === 'player' ? state.player : opponentById(state, input.targetId);
  if (!owner?.horse) throw new RangeError('피해를 받을 말을 찾을 수 없습니다.');
  const packet = {
    rolledDamage: Math.max(0, asInt(input.rolledDamage)), direct: Boolean(input.direct),
    source: String(input.source || '말 전투 피해'), sourcePage: 'Ch.7 pp.119, 123-124', year: state.year
  };
  const applied = applyHorsePacket(owner.horse, packet, rng);
  owner.horse = applied.horse;
  if (['dead', 'unconscious'].includes(applied.horse.status)) owner.mounted = false;
  if (input.fall || applied.injury.knockedDown) {
    owner.horse.status = applied.horse.status === 'dead' ? 'dead' : 'fallen';
    owner.mounted = false;
    owner.prone = true;
    owner.knockedDownRound = state.round;
  }
  if (side === 'opponent') setOpponent(state, owner);
  state.updatedAt = iso(input.now);
  character.campaign.combat = state;
  character.campaign.schemaVersion = 12;
  return { character, horse: owner.horse, injury: applied.injury };
};

export const concludeChapter7Combat = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = activeState(character);
  if (state.phase === 'winner') throw new RangeError('이미 판정한 공격의 피해를 먼저 적용하세요.');
  const result = ['victory', 'capture', 'defeat', 'surrender', 'flight', 'truce'].includes(input.result) ? input.result : 'truce';
  const timestamp = iso(now);
  state.status = 'concluded';
  state.outcome = { result, note: String(input.note || ''), rounds: state.rounds.length, concludedAt: timestamp };
  state.updatedAt = timestamp;
  character.campaign.combat = state;
  character.campaign.combatHistory = [...(character.campaign.combatHistory || []), {
    id: state.id, year: state.year, result, rounds: state.rounds.length, opponents: state.opponents.map(opponent => opponent.name),
    source: state.source, returnContext: state.returnContext, concludedAt: timestamp
  }].slice(-250);
  appendChronicleEvent(character, {
    id: `${state.id}:conclusion`, year: state.year, type: 'combat', title: `개인 전투 ${result === 'victory' ? '승리' : result === 'capture' ? '생포' : result === 'defeat' ? '패배' : result === 'surrender' ? '항복' : result === 'flight' ? '이탈' : '종결'}`,
    narrative: `${state.opponents.map(opponent => opponent.name).join(', ')}와의 전투가 ${state.rounds.length}라운드 만에 끝났습니다.${input.note ? ` ${input.note}` : ''}`,
    sourceRuleId: 'COMBAT-SEQUENCE-001', sourcePage: 'Ch.7 pp.115-128', createdAt: timestamp
  });
  character.campaign.schemaVersion = 12;
  return { character, combat: state, returnContext: state.returnContext };
};

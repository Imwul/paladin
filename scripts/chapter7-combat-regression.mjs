import assert from 'node:assert/strict';
import {
  applyChapter7Consequences,
  applyChapter7HorseDamage,
  beginChapter8PersonalCombat,
  completeChapter7Movement,
  completeChapter8PersonalCombat,
  declareChapter7Action,
  resolveBattlePreparation,
  resolveChapter7Action,
  resolveSiegeHealth,
  resolveSkirmishCommand,
  sanitizeChapter7CombatState,
  startChapter7Combat,
  startMassBattle,
  startSiege,
  startSkirmish
} from '../src/rules/index.js';
import { sanitizeCampaignState } from '../src/utils/campaignState.js';

const makeCharacter = () => ({
  personal: { name: 'Adalhart', age: 30, campaignYear: 780, maintenance: 'ordinary', features: [] },
  attributes: { siz: 14, dex: 14, str: 14, con: 14, app: 10, currentHp: 28 },
  traits: { valorous: 15, cowardly: 5 },
  passions: { honor: 15, loveFamily: 15, loveGod: 15, loveCharlemagne: 15 },
  standings: { charlemagne: 10, liegeLord: 10, family: 10, retinue: 10, church: 10, commoners: 10 },
  skills: { battle: 15, sword: 16, spear: 14, lance: 16, axe: 12, bludgeon: 10, dagger: 10, unarmed: 12, bow: 15, crossbow: 13, thrownWeapon: 12, awareness: 12, hunting: 10, horsemanship: 15 },
  skillsChecked: {}, traitsChecked: {}, passionsChecked: {}, standingsChecked: {},
  squire: { name: 'Haimon', age: 16, status: '생존' },
  horses: { warhorse: { profileKey: 'charger', type: 'Charger', hp: 46, armor: 5 } },
  gear: { cash: 5, gloryThisGame: 0, gloryTotal: 100 },
  family: { name: 'House', members: [{ id: 'adalhart', name: 'Adalhart', relation: '본인', generation: 3, status: '생존' }], ancestorRollLog: [] },
  journal: {},
  campaign: {
    schemaVersion: 9, saveRevision: 0, appliedEvents: {}, chronicleEvents: [], gloryLedger: [], standingLedger: [], familyTimeline: [], combatHistory: [],
    passionStates: [], captives: [], pendingEconomy: [], conditions: [], fortresses: [],
    lifecycle: { status: 'active', careerStatus: 'active', activeCharacterId: 'adalhart', primaryCharacterId: 'adalhart', events: [], unresolvedChoices: [] },
    health: { wounds: [], surgeryNeeded: false, unconscious: false, pendingDeath: null, majorWoundCourage: null, weeklyCare: [] },
    combat: null, winter: { year: 780, steps: {}, logs: [], unresolved: {} }
  }
});

const enemy = (id = 'enemy:1', overrides = {}) => ({
  id, name: id, skill: 12, unarmed: 9, rangedSkill: 12, horsemanship: 10, dex: 10, str: 12, siz: 12, con: 12,
  damageDice: 4, weaponId: 'axe', missileWeaponId: 'bow', armor: 6, armorType: 'chainmail', shield: 6,
  distance: 1, ...overrides
});

const start = (options = {}) => startChapter7Combat(makeCharacter(), {
  id: options.id || 'combat:test',
  player: { weaponId: 'sword', missileWeaponId: 'bow', armor: 10, armorType: 'chainmail', shield: 6, carriedPounds: 42, ...(options.player || {}) },
  opponents: options.opponents || [enemy()],
  openingModifier: options.openingModifier || 0,
  openingModifierSource: options.openingModifierSource || ''
}, '2026-08-09T00:00:00.000Z');

const declare = (character, input) => declareChapter7Action(character, input, '2026-08-09T00:01:00.000Z').character;
const resolve = (character, input = {}) => resolveChapter7Action(character, { ...input, now: '2026-08-09T00:02:00.000Z' }).character;
const apply = character => applyChapter7Consequences(character, { now: '2026-08-09T00:03:00.000Z' }).character;
const move = character => completeChapter7Movement(character, {}, '2026-08-09T00:04:00.000Z').character;

// Movement is a persisted fifth phase, and initiative follows Movement Rate then DEX.
let movement = start({ opponents: [enemy('enemy:1', { distance: 8, movementRate: 2 })] });
movement = declare(movement, { action: 'move', movement: { targetId: 'enemy:1', direction: 'toward', speed: 'walk', yards: 3 } });
movement = resolve(movement);
movement = apply(movement);
movement = move(movement);
assert.equal(movement.campaign.combat.opponents[0].distance, 3);
assert.equal(movement.campaign.combat.round, 2);
assert.equal(movement.campaign.combat.initiativeOrder[0], 'player');

// Two and three opponents divide only the base skill; mounted and other modifiers are added afterward.
for (const count of [2, 3]) {
  const opponents = Array.from({ length: count }, (_, index) => enemy(`enemy:${index + 1}`));
  let multiple = start({ id: `combat:${count}v1`, opponents });
  const allocations = Object.fromEntries(opponents.map((item, index) => [item.id, Math.floor(16 / count) + (index === 0 ? 16 - Math.floor(16 / count) * count : 0)]));
  multiple = declare(multiple, { action: 'attack', targetIds: opponents.map(item => item.id), allocations });
  multiple = resolve(multiple, { actorRolls: Object.fromEntries(opponents.map(item => [item.id, 5])), opponentRolls: Object.fromEntries(opponents.map(item => [item.id, 20])) });
  assert.equal(multiple.campaign.combat.pending.exchanges.filter(item => item.type === 'opposed').length, count);
}

let twoMounted = start({ opponents: [enemy('enemy:1', { mounted: true, horse: { profileKey: 'rouncy' } }), enemy('enemy:2', { mounted: true, horse: { profileKey: 'rouncy' } })] });
twoMounted = declare(twoMounted, { action: 'attack', targetIds: ['enemy:1', 'enemy:2'], allocations: { 'enemy:1': 8, 'enemy:2': 8 } });
assert.equal(twoMounted.campaign.combat.declaration.targetIds.length, 2);

// Dodge is sequential: a first knockdown makes later attacks unopposed.
let dodge = start({ opponents: [enemy('enemy:1'), enemy('enemy:2')] });
dodge = declare(dodge, { action: 'dodge' });
dodge = resolve(dodge, { actorRolls: { 'enemy:1': 20 }, opponentRolls: { 'enemy:1': 5, 'enemy:2': 5 }, opponentDamageTotals: { 'enemy:1': 28, 'enemy:2': 12 } });
assert.equal(dodge.campaign.combat.pending.exchanges[0].predictedKnockdown.knockedDown, true);
assert.equal(dodge.campaign.combat.pending.exchanges[1].type, 'unopposed');

// Missile range, shield cover, weather, ammunition, and enemy fire all use executable actions.
let ranged = start({ opponents: [enemy('enemy:1', { distance: 100, armor: 0, shield: 6 })] });
ranged = declare(ranged, { action: 'ranged', targetId: 'enemy:1', shieldUse: 'passive', weather: 'clear' });
ranged = resolve(ranged, { actorRoll: 5, actorDamageTotal: 12 });
const shot = ranged.campaign.combat.pending.exchanges[0];
assert.equal(shot.modifier, -8);
ranged = apply(ranged);
assert.equal(ranged.campaign.combat.player.ammo.arrows, 11);

let enemyRanged = start({ opponents: [enemy('enemy:1', { distance: 30, rangedSkill: 18 })] });
enemyRanged = declare(enemyRanged, { action: 'hold', enemyPlans: { 'enemy:1': 'ranged' }, playerShieldUse: 'active' });
enemyRanged = resolve(enemyRanged, { enemyRolls: { 'enemy:1': 5 }, enemyDamageTotals: { 'enemy:1': 18 } });
assert.equal(enemyRanged.campaign.combat.pending.exchanges[1].type, 'opponent_ranged');
enemyRanged = apply(enemyRanged);
assert.equal(enemyRanged.campaign.combat.opponents[0].ammo.arrows, 11);

const rangedLine = Array.from({ length: 4 }, (_, index) => enemy(`archer:${index + 1}`, { distance: 30 }));
let rangedVolley = start({ opponents: rangedLine });
rangedVolley = declare(rangedVolley, { action: 'hold', enemyPlans: Object.fromEntries(rangedLine.map(item => [item.id, 'ranged'])) });
rangedVolley = resolve(rangedVolley, { enemyRolls: Object.fromEntries(rangedLine.map(item => [item.id, 20])) });
assert.equal(rangedVolley.campaign.combat.pending.exchanges.filter(item => item.type === 'opponent_ranged').length, 4);

// A non-charging lance uses Spear; a charge uses Lance, horse damage, and the Chapter 8 opening modifier once.
let spearLance = start({ player: { weaponId: 'lance', mounted: true, horse: { profileKey: 'charger' } } });
spearLance = declare(spearLance, { action: 'attack', targetId: 'enemy:1' });
spearLance = resolve(spearLance, { actorRoll: 5, opponentRoll: 20 });
assert.equal(spearLance.campaign.combat.pending.exchanges[0].actorCheck.base, 14);

let charge = start({
  player: { weaponId: 'lance', mounted: true, horse: { profileKey: 'charger' } },
  opponents: [enemy('enemy:1', { distance: 6 })], openingModifier: 5, openingModifierSource: 'Chapter 8 지휘 결과'
});
charge = declare(charge, { action: 'lance_charge', targetId: 'enemy:1' });
charge = resolve(charge, { actorRoll: 5, opponentRoll: 20, actorDamageTotal: 24 });
const chargeExchange = charge.campaign.combat.pending.exchanges[0];
assert.equal(chargeExchange.actorCheck.base, 16);
assert.equal(chargeExchange.actorCheck.reasons.some(item => item.label === 'Chapter 8 지휘 결과' && item.value === 5), true);
assert.equal(chargeExchange.packets[0].damage.dice, 6);
charge = move(apply(charge));
assert.equal(charge.campaign.combat.round, 2);
charge = declare(charge, { action: 'follow_through' });
assert.equal(charge.campaign.combat.declaration.sourceModifier, 0);

// Grapple changes weapon and hold state, while uncontrolled attacks preserve the free-attack order.
let grapple = start();
grapple = declare(grapple, { action: 'grapple', targetId: 'enemy:1' });
grapple = resolve(grapple, { actorRoll: 5, opponentRoll: 20 });
grapple = apply(grapple);
assert.equal(grapple.campaign.combat.player.grapple.holding, 'enemy:1');
assert.equal(grapple.campaign.combat.player.shield, 0);
assert.equal(grapple.campaign.combat.opponents[0].weaponStatus, 'dropped');

let enemyGrapple = start();
enemyGrapple = declare(enemyGrapple, { action: 'hold', enemyPlans: { 'enemy:1': 'grapple' } });
enemyGrapple = resolve(enemyGrapple, { actorRoll: 20, enemyRolls: { 'enemy:1': 5 } });
assert.equal(enemyGrapple.campaign.combat.pending.exchanges[1].opponentCheck.target, 9);
enemyGrapple = apply(enemyGrapple);
assert.equal(enemyGrapple.campaign.combat.player.grapple.heldBy, 'enemy:1');
assert.equal(enemyGrapple.campaign.combat.player.shield, 6);

let uncontrolled = start();
uncontrolled = declare(uncontrolled, { action: 'uncontrolled', targetId: 'enemy:1', uncontrolledDefense: 'free_attack' });
uncontrolled = resolve(uncontrolled, { opponentRoll: 20, actorRoll: 5, actorDamageTotal: 12 });
assert.equal(uncontrolled.campaign.combat.pending.exchanges[0].type, 'uncontrolled');
assert.equal(uncontrolled.campaign.combat.pending.exchanges[0].strike.packets.length, 1);

// Flails and warflails strike their wielder on an unmodified natural 1 in opposed and unopposed attacks.
let playerFlail = start({ player: { weaponId: 'flail' }, opponents: [enemy()] });
playerFlail = declare(playerFlail, { action: 'attack', targetId: 'enemy:1' });
playerFlail = resolve(playerFlail, { actorRoll: 1, opponentRoll: 20, actorDamageTotal: 18 });
assert.equal(playerFlail.campaign.combat.pending.packets.length, 1);
assert.equal(playerFlail.campaign.combat.pending.packets[0].targetType, 'player');

let enemyFlail = start({ opponents: [enemy('enemy:1', { weaponId: 'warflail' })] });
enemyFlail = declare(enemyFlail, { action: 'hold', enemyPlans: { 'enemy:1': 'attack' } });
enemyFlail = resolve(enemyFlail, { enemyRolls: { 'enemy:1': 1 }, enemyDamageTotals: { 'enemy:1': 18 } });
assert.equal(enemyFlail.campaign.combat.pending.packets.length, 1);
assert.equal(enemyFlail.campaign.combat.pending.packets[0].targetType, 'opponent');

// Horses own their HP, DEX, armor, injury, fall, and death state independently of the rider.
let horse = start({ player: { mounted: true, horse: { profileKey: 'charger', armorBonus: 2, armorType: 'caparison' } } });
const riderHp = horse.attributes.currentHp;
horse = applyChapter7HorseDamage(horse, { side: 'player', rolledDamage: 200, direct: true }, () => 0).character;
assert.equal(horse.campaign.combat.player.horse.status, 'dead');
assert.equal(horse.campaign.combat.player.mounted, false);
assert.equal(horse.attributes.currentHp, riderHp);

// DEX, Awareness, rearming, and the age-based Squire Roll resolve through the same state machine.
let climb = start();
climb = declare(climb, { action: 'dex', dexAction: { type: 'climb', heightFeet: 65, aid: 'rope', modifier: 0 } });
climb = resolve(climb, { dexRoll: 5, dexRolls: [5, 5, 5] });
assert.equal(climb.campaign.combat.pending.exchanges[0].requiredChecks, 3);
assert.equal(climb.campaign.combat.pending.exchanges[0].success, true);

let awareness = start();
awareness = declare(awareness, { action: 'awareness', awarenessSkill: 'awareness' });
awareness = resolve(awareness, { awarenessRoll: 5 });
assert.equal(awareness.campaign.combat.pending.exchanges[0].type, 'awareness');

let rearm = start();
rearm.campaign.combat.player.weaponStatus = 'dropped';
rearm = declare(rearm, { action: 'rearm', rearmWeaponId: 'sword' });
rearm = apply(resolve(rearm));
assert.equal(rearm.campaign.combat.player.weaponStatus, 'ready');

let squire = start();
squire = declare(squire, { action: 'squire', squireRequest: 'weapon', rearmWeaponId: 'spear' });
squire = apply(resolve(squire, { squireRoll: 5 }));
assert.equal(squire.campaign.combat.player.weaponId, 'spear');

// A resolved-but-unapplied attack survives reload and cannot be applied twice.
let saved = start();
saved = declare(saved, { action: 'attack', targetId: 'enemy:1' });
saved = resolve(saved, { actorRoll: 5, opponentRoll: 20, actorDamageTotal: 14 });
const defaults = makeCharacter();
const reloaded = sanitizeCampaignState(JSON.parse(JSON.stringify(saved)), defaults);
assert.equal(reloaded.campaign.combat.phase, 'winner');
assert.equal(reloaded.campaign.combat.pending.packets[0].rolledDamage, 14);
const applied = applyChapter7Consequences(reloaded).character;
assert.throws(() => applyChapter7Consequences(applied), /승자 처리 결과|이미 적용/);

const oldConcluded = sanitizeChapter7CombatState({ id: 'old', year: 779, status: 'concluded', round: 2, player: {}, opponent: enemy(), rounds: [{ number: 1 }], outcome: { result: 'victory' } }, makeCharacter());
assert.equal(oldConcluded.status, 'concluded');
assert.equal(oldConcluded.rounds.length, 1);

// Every Chapter 8 entry point starts engineVersion 2 and returns through the existing Chapter 8 state.
let skirmish = startSkirmish(makeCharacter(), { id: 'skirmish:callback', enemy: 'Saxons', commanderSkill: 15, followerRound: 1 }).character;
skirmish = resolveSkirmishCommand(skirmish, { roll: 5 }).character;
skirmish = beginChapter8PersonalCombat(skirmish, { type: 'skirmish' });
assert.equal(skirmish.campaign.combat.engineVersion, 2);
assert.match(skirmish.campaign.combat.source, /chapter_8:skirmish/);
skirmish = completeChapter8PersonalCombat(skirmish, { result: 'victory' }).character;
assert.equal(skirmish.campaign.skirmish.rounds[0].resolvedBy, 'chapter_7_combat');

let battle = startMassBattle(makeCharacter(), { id: 'battle:callback', duration: 2, playerArmySize: 300, enemyArmySize: 300, mounted: true, hasLance: true, enemy: enemy('battle-enemy', { mounted: true, weapon: 'lance', primarySkill: 12 }) }).character;
battle = resolveBattlePreparation(battle, { armyRoll: 5, battalionRoll: 5 }).character;
battle = beginChapter8PersonalCombat(battle, { type: 'mass_battle_first_charge' });
assert.equal(battle.campaign.combat.engineVersion, 2);
assert.equal(battle.campaign.combat.returnContext.type, 'mass_battle_first_charge');
battle = completeChapter8PersonalCombat(battle, { result: 'victory', followerRoll: 5 }).character;
assert.equal(battle.campaign.massBattle.rounds[0].exchange.resolvedBy, 'chapter_7_combat');

let siege = startSiege(makeCharacter(), {
  id: 'siege:callback', fortress: 'Test Keep', dv: '3', mode: 'advanced', playerSide: 'attacker', playerCommander: true,
  attacker: { siege: 15, troops: 300, equipment: 10 }, defender: { siege: 10, troops: 100, equipment: 0 }
}).character;
siege = resolveSiegeHealth(siege, { attackerTroopRoll: 5, defenderTroopRoll: 5, playerRoll: 5 }).character;
siege = beginChapter8PersonalCombat(siege, { type: 'siege_single_combat' });
assert.equal(siege.campaign.combat.engineVersion, 2);
assert.equal(siege.campaign.combat.returnContext.type, 'siege_single_combat');
siege = completeChapter8PersonalCombat(siege, { result: 'victory' }).character;
assert.equal(siege.campaign.siege.currentTurn.tactic.type, 'single_combat');

console.log('chapter 7 combat regression passed');

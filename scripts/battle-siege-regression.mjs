import assert from 'node:assert/strict';
import {
  BATTLE_PHASES,
  SIEGE_PHASES,
  SKIRMISH_PHASES,
  assignSkirmishFollowerFates,
  assignFollowerFates,
  beginBattleMeleeRound,
  calculateBattleSituationModifier,
  choosePursuit,
  completeBattleMeleeRound,
  confirmMassBattleDeath,
  endPursuit,
  executeTable83,
  executeTable84,
  executeTable85,
  executeTable86,
  executeTable87,
  executeTable88,
  executeTable810,
  executeTable811,
  executeTable812,
  executeTable813,
  executeTable814,
  executeTable815,
  executeTable816,
  finalizeMassBattle,
  finalizeSkirmish,
  finalizeSiege,
  lookupBattleEnemy,
  prepareBattleSpecialEvent,
  resolveBattleAftermath,
  resolveBattlePreparation,
  resolveBattleWithdrawal,
  resolveFirstCharge,
  resolveMeleeEvent,
  resolvePlayerCaptivity,
  resolvePursuitRound,
  resolveSiegeHealth,
  resolveSiegeMorale,
  resolveSiegeTactic,
  resolveSkirmishCommand,
  resolveSkirmishFollowers,
  recordSkirmishMeleeRound,
  sanitizeMassBattleState,
  sanitizeSiegeState,
  sanitizeSkirmishState,
  startMassBattle,
  startSkirmish,
  startSiege
} from '../src/rules/index.js';
import { sanitizeCampaignState } from '../src/utils/campaignState.js';

const traits = { valorous: 15, cowardly: 5 };
const makeCharacter = (followers = 10) => ({
  personal: { name: '시험 기사', campaignYear: 770, age: 25 },
  attributes: { siz: 14, con: 14, str: 14, dex: 14, app: 10, currentHp: 28 },
  traits: { ...traits }, passions: { honor: 16 }, standings: { retinue: 14, commoners: 12 },
  skills: { battle: 15, lance: 16, sword: 16, horsemanship: 15, hunting: 15, awareness: 12, firstAid: 15, siege: 18, stewardship: 16, intrigue: 14 },
  gear: { cash: 20, gloryThisGame: 0, gloryTotal: 1200 },
  horses: { warhorse: { type: 'Charger', hp: 42, armor: 5, status: '건강' } },
  squire: { name: '종자', age: 16, status: '생존' },
  family: {
    members: [
      { id: 'self', name: '시험 기사', relation: '본인', status: '생존', generation: 3 },
      ...Array.from({ length: followers }, (_, index) => ({ id: `f${index + 1}`, name: `추종자 ${index + 1}`, relation: '가신', status: '생존', generation: 3 }))
    ]
  },
  campaign: {
    schemaVersion: 9, saveRevision: 0, chronicleEvents: [], familyTimeline: [], gloryLedger: [], standingLedger: [],
    captives: [], pendingEconomy: [], conditions: [], fortresses: [],
    health: { wounds: [], surgeryNeeded: false, unconscious: false, pendingDeath: null, majorWoundCourage: null, weeklyCare: [] },
    lifecycle: { status: 'active', careerStatus: 'active', activeCharacterId: 'self', primaryCharacterId: 'self', events: [], unresolvedChoices: [] }
  }
});

const refs = count => Array.from({ length: count }, (_, index) => ({ type: 'family', id: `f${index + 1}` }));
const fixed = value => () => value;

for (const phase of SKIRMISH_PHASES) assert.equal(sanitizeSkirmishState({ phase }).phase, phase);
for (const phase of BATTLE_PHASES) assert.equal(sanitizeMassBattleState({ phase }).phase, phase);
for (const phase of SIEGE_PHASES) assert.equal(sanitizeSiegeState({ phase }).phase, phase);

// Skirmish Tables 8-1 and 8-2, first-round-only modifier, canonical followers, and reload.
let skirmish = makeCharacter();
skirmish = startSkirmish(skirmish, {
  id: 'skirmish:e2e', name: '시험 교전', enemy: '색슨 약탈대', playerCommander: false,
  commanderSkill: 10, followerRound: 2, followerRefs: [...refs(10), { type: 'family', id: 'f1' }]
}, '2026-08-09T00:00:00.000Z').character;
assert.equal(skirmish.campaign.skirmish.followerRefs.length, 10);
skirmish = resolveSkirmishCommand(skirmish, { roll: 15 }).character;
assert.equal(skirmish.campaign.skirmish.command.modifier, -5);
skirmish = recordSkirmishMeleeRound(skirmish, { outcome: 'victory', enemiesDefeated: 1 }).character;
assert.equal(skirmish.campaign.skirmish.rounds[0].commandModifier, -5);
skirmish = recordSkirmishMeleeRound(skirmish, { outcome: 'draw' }).character;
assert.equal(skirmish.campaign.skirmish.rounds[1].commandModifier, 0);
assert.equal(sanitizeSkirmishState(JSON.parse(JSON.stringify(skirmish.campaign.skirmish))).phase, 'followers');
skirmish = resolveSkirmishFollowers(skirmish, { roll: 16 }).character;
assert.equal(skirmish.campaign.skirmish.phase, 'follower_fate');
skirmish = assignSkirmishFollowerFates(skirmish, {
  'family:f1': 'killed', 'family:f2': 'wounded', 'family:f3': 'wounded', 'family:f4': 'wounded',
  'family:f5': 'captured', 'family:f6': 'captured'
}).character;
assert.equal(skirmish.family.members.find(member => member.id === 'f1').status, '사망');
assert.equal(skirmish.family.members.find(member => member.id === 'f5').status, '포로');
skirmish = finalizeSkirmish(skirmish, { outcome: 'victory', rescueCaptured: true }).character;
assert.equal(skirmish.family.members.find(member => member.id === 'f5').status, '생존');
assert.equal(skirmish.campaign.skirmishHistory.length, 1);

// Tables 8-3 through 8-10.
assert.deepEqual(executeTable83({ outcome: 'failure' }).actions, ['engage', 'surrender', 'flee']);
assert.equal(executeTable83({ outcome: 'fumble' }).modifier, -5);
assert.deepEqual(executeTable84({ outcome: 'success', meleeEventTotal: 8 }).actions, ['engage', 'surrender']);
assert.deepEqual(executeTable84({ outcome: 'success', meleeEventTotal: 9 }).actions, ['engage', 'withdraw']);
assert.equal(executeTable85(4).weaponModifier, -3);
assert.equal(executeTable85(19).nextMeleeModifier, 10);
assert.equal(executeTable85(20).type, 'battalion_commander');
assert.equal(executeTable86({ roll: 15, battleSkill: 15, glory: 2000, rallyDice: [1, 1], rng: fixed(0) }).check.critical, true);
const partialFlee = executeTable87({ roll: 5, skill: 15, opponentRoll: 10, opponentSkill: 15 });
assert.equal(partialFlee.outcome, 'partial');
assert.equal(partialFlee.damage, 'normal_with_shield');
assert.deepEqual(executeTable88({ outcome: 'failure', followerCount: 10 }), {
  table: '8-8', outcome: 'failure', count: 10, killed: 1, wounded: 3, captured: 2, enemyCaptured: 0, survivorsRouted: false, survived: 4
});
assert.equal(executeTable88({ outcome: 'fumble', followerCount: 4 }).survivorsRouted, true);
assert.equal(calculateBattleSituationModifier({ playerArmySize: 1000, enemyArmySize: 200, ownHomeland: true }), 20);
assert.equal(executeTable810({ roll: 9, modifier: 10 }).result, 'decisive_victory');
assert.equal(resolveMeleeEvent([2, 2, 2]).event, 'player_battalion_retreats');
assert.equal(resolveMeleeEvent([5, 5, 5]).event, 'enemy_battalion_retreats');

// Tables 8-11 through 8-16.
assert.equal(executeTable811({ roll: 20, skill: 10, kind: 'personal' }).skillPenalty, -15);
assert.equal(executeTable811({ roll: 19, skill: 10, kind: 'personal' }).surgeryNeeded, false);
assert.equal(executeTable811({ roll: 19, skill: 10, kind: 'troops' }).unavailablePercent, 10);
assert.equal(executeTable812({ attackerOutcome: 'critical', defenderOutcome: 'fumble' }).defenderLoss, 'crushing');
assert.equal(executeTable812({ attackerOutcome: 'critical', defenderOutcome: 'fumble' }).defenseLinesTaken, 2);
assert.equal(executeTable812({ attackerOutcome: 'success', defenderOutcome: 'success' }).defensesTaken, false);
assert.equal(executeTable813({ roll: 16, stewardship: 10 }).nextModifier, -1);
assert.equal(executeTable814({ roll: 14, intrigue: 14, bribe: 1, target: 'knights' }).targetModifier, -2);
assert.equal(executeTable815({ category: 'valorous', outcome: 'failure' }).end, 'honorable_surrender');
assert.equal(executeTable815({ category: 'retinue', outcome: 'fumble' }).honorLoss, 1);
assert.equal(executeTable816({ category: 'commoners', outcome: 'failure' }).ongoingSiegeModifier, -10);
assert.equal(executeTable816({ category: 'valorous', outcome: 'fumble' }).loseEquipment, true);

// Every Battle Enemy table maps 1, 20, and 21+ correctly.
for (const tableId of ['earlyKnights', 'lateKnights', 'footmen', 'saxonsDanes', 'bretons', 'basques', 'slavs', 'hunsAvars']) {
  assert.equal(lookupBattleEnemy(tableId, 1).roll, 1);
  assert.ok(lookupBattleEnemy(tableId, 20).primarySkill > 0);
  assert.equal(lookupBattleEnemy(tableId, 25).quality, lookupBattleEnemy(tableId, 21).quality);
}

// Full battle, follower casualty, loot, ransom structure, and save/reload.
let campaign = makeCharacter();
campaign = startMassBattle(campaign, {
  id: 'battle:e2e', name: '종단 전투', scale: 'small', duration: 2,
  playerArmySize: 600, enemyArmySize: 600, playerArmyBattle: 18, battalionBattle: 18,
  playerRole: 'battalion', mounted: true, hasLance: true, armor: 10, shield: 6,
  followerRefs: refs(10), enemy: lookupBattleEnemy('earlyKnights', 1)
}, '2026-08-09T00:00:00.000Z').character;
campaign = resolveBattlePreparation(campaign, { armyRoll: 10, battalionRoll: 10, now: '2026-08-09T00:00:01.000Z' }).character;
campaign = resolveFirstCharge(campaign, { participates: true, playerRoll: 10, enemyRoll: 20, followerRoll: 10, now: '2026-08-09T00:00:02.000Z' }).character;
assert.equal(campaign.campaign.massBattle.phase, 'follower_fate');
campaign = assignFollowerFates(campaign, { 'family:f1': 'wounded' }, '2026-08-09T00:00:03.000Z').character;
assert.equal(campaign.family.members.find(member => member.id === 'f1').status, '병상');
assert.equal(campaign.campaign.massBattle.phase, 'melee');

const battleReload = JSON.parse(JSON.stringify(campaign.campaign.massBattle));
assert.equal(sanitizeMassBattleState(battleReload).phase, 'melee');
campaign = beginBattleMeleeRound(campaign, { eventDice: [3, 3, 3], battleRoll: 5, now: '2026-08-09T00:00:04.000Z' }).character;
campaign = completeBattleMeleeRound(campaign, { action: 'engage', playerRoll: 5, enemyRoll: 20, followerRoll: 5, now: '2026-08-09T00:00:05.000Z' }).character;
assert.equal(campaign.campaign.massBattle.phase, 'follower_fate');
campaign = assignFollowerFates(campaign, { 'family:f2': 'wounded' }, '2026-08-09T00:00:06.000Z').character;
assert.equal(campaign.campaign.massBattle.phase, 'aftermath');
campaign.campaign.massBattle.captives.push({ id: 'ransomable', status: 'held', ransomEligible: true });
campaign = resolveBattleAftermath(campaign, { clearResult: 'decisive_victory', finalArmyRoll: 5, loot: 4, now: '2026-08-09T00:00:07.000Z' }).character;
campaign = finalizeMassBattle(campaign, '2026-08-09T00:00:08.000Z').character;
assert.equal(campaign.campaign.massBattle.status, 'complete');
assert.equal(campaign.gear.cash, 24);
assert.ok(campaign.gear.gloryThisGame > 0);
assert.equal(campaign.campaign.pendingEconomy.some(item => item.type === 'ransom'), true);
assert.equal(campaign.campaign.battleHistory.length, 1);

// A disengaged First Aid action uses the shared Chapter 7 health ledger rather than a battle-only wound model.
let fieldMedic = makeCharacter(0);
fieldMedic.attributes.currentHp = 23;
fieldMedic.campaign.health.wounds.push({ id: 'field-wound', source: '시험 상처', rolledDamage: 5, actualDamage: 5, classification: 'minor', treated: false, createdAt: '2026-08-09T00:00:00.000Z' });
fieldMedic = startMassBattle(fieldMedic, { id: 'battle:first-aid', duration: 2, playerArmySize: 300, enemyArmySize: 300, mounted: true, hasLance: true, enemy: lookupBattleEnemy('earlyKnights', 1) }).character;
fieldMedic = resolveBattlePreparation(fieldMedic, { armyRoll: 5, battalionRoll: 5 }).character;
fieldMedic = resolveFirstCharge(fieldMedic, { participates: false }).character;
fieldMedic = beginBattleMeleeRound(fieldMedic, { eventDice: [4, 4, 4], battleRoll: 5 }).character;
fieldMedic = completeBattleMeleeRound(fieldMedic, { action: 'first_aid', woundId: 'field-wound', firstAidRoll: 5, healingRoll: 2, followerRoll: 5 }).character;
assert.equal(fieldMedic.campaign.health.wounds[0].treated, true);
assert.equal(fieldMedic.attributes.currentHp, 25);
assert.equal(fieldMedic.campaign.massBattle.rounds.at(-1).firstAid.amount, 2);

// Table 8-5 rolls the selected Battle Enemy table again with its printed modifier.
let specialEventBattle = makeCharacter(0);
specialEventBattle = startMassBattle(specialEventBattle, { id: 'battle:special', duration: 2, playerArmySize: 300, enemyArmySize: 300, mounted: true, hasLance: true, enemyTable: 'earlyKnights', enemyRoll: 1, enemy: lookupBattleEnemy('earlyKnights', 1) }).character;
specialEventBattle = resolveBattlePreparation(specialEventBattle, { armyRoll: 5, battalionRoll: 5 }).character;
specialEventBattle = resolveFirstCharge(specialEventBattle, { participates: false }).character;
specialEventBattle = beginBattleMeleeRound(specialEventBattle, { eventDice: [4, 4, 4], battleRoll: 15 }).character;
specialEventBattle = prepareBattleSpecialEvent(specialEventBattle, { specialEventRoll: 19, specialEnemyRoll: 16 }).character;
assert.equal(specialEventBattle.campaign.massBattle.pendingRound.specialEvent.enemyRoll, 21);
assert.equal(specialEventBattle.campaign.massBattle.pendingRound.specialEvent.enemy.primarySkill, 25);
specialEventBattle = completeBattleMeleeRound(specialEventBattle, { action: 'special_event', specialCombatResult: 'captured', specialCombatGlory: 10, followerRoll: 5 }).character;
assert.equal(specialEventBattle.campaign.massBattle.rounds.at(-1).bonusGlory, 10);
assert.equal(specialEventBattle.campaign.massBattle.captives.length, 1);

// Table 8-8 fumble survivors rout and cannot be rolled as active followers again.
let routedFollowers = makeCharacter(4);
routedFollowers = startMassBattle(routedFollowers, { id: 'battle:follower-rout', duration: 3, playerArmySize: 300, enemyArmySize: 300, mounted: true, hasLance: true, followerRefs: refs(4), enemy: lookupBattleEnemy('earlyKnights', 1) }).character;
routedFollowers = resolveBattlePreparation(routedFollowers, { armyRoll: 5, battalionRoll: 5 }).character;
routedFollowers = resolveFirstCharge(routedFollowers, { participates: true, playerRoll: 5, enemyRoll: 20, followerRoll: 20 }).character;
routedFollowers = assignFollowerFates(routedFollowers, { 'family:f1': 'killed', 'family:f2': 'killed', 'family:f3': 'captured' }).character;
assert.deepEqual(routedFollowers.campaign.massBattle.routedFollowerRefs, [{ type: 'family', id: 'f4' }]);
routedFollowers = beginBattleMeleeRound(routedFollowers, { eventDice: [4, 4, 4], battleRoll: 5 }).character;
routedFollowers = completeBattleMeleeRound(routedFollowers, { action: 'engage', playerRoll: 5, enemyRoll: 20, followerRoll: 20 }).character;
assert.notEqual(routedFollowers.campaign.massBattle.phase, 'follower_fate');

// Player injury can reach canonical pending death; capture blocks and resolves explicitly.
let injured = makeCharacter(0);
injured = startMassBattle(injured, { id: 'battle:injury', duration: 1, playerArmySize: 300, enemyArmySize: 300, mounted: true, hasLance: true, enemy: lookupBattleEnemy('earlyKnights', 20) }).character;
injured = resolveBattlePreparation(injured, { armyRoll: 5, battalionRoll: 5 }).character;
injured = resolveFirstCharge(injured, { participates: true, playerRoll: 20, enemyRoll: 5, enemyDamageTotal: 40 }).character;
assert.equal(injured.campaign.health.pendingDeath?.due, 'same_day_midnight');
assert.equal(injured.campaign.massBattle.phase, 'aftermath');
injured = confirmMassBattleDeath(injured, '2026-08-09T00:30:00.000Z').character;
assert.equal(injured.campaign.lifecycle.status, 'pending_salvation');

let captive = makeCharacter(0);
captive = startMassBattle(captive, { id: 'battle:capture', duration: 1, playerArmySize: 300, enemyArmySize: 300, mounted: true, hasLance: true, enemy: lookupBattleEnemy('earlyKnights', 1) }).character;
captive = resolveBattlePreparation(captive, { armyRoll: 5, battalionRoll: 5 }).character;
captive = resolveFirstCharge(captive, { participates: false, surrender: true }).character;
assert.equal(captive.campaign.captivity.status, 'active');
captive = resolvePlayerCaptivity(captive, { resolution: 'ransomed', amount: 6 }).character;
assert.equal(captive.campaign.captivity.status, 'resolved');
assert.equal(captive.campaign.pendingEconomy.at(-1).amount, 6);

// Rout stand, enemy rout, and both pursuit rounds.
let routed = makeCharacter(0);
routed = startMassBattle(routed, { id: 'battle:rout', duration: 4, playerArmySize: 300, enemyArmySize: 300, mounted: true, hasLance: true, enemy: lookupBattleEnemy('footmen', 6) }).character;
routed = resolveBattlePreparation(routed, { armyRoll: 5, battalionRoll: 5 }).character;
routed = resolveFirstCharge(routed, { participates: false }).character;
routed = beginBattleMeleeRound(routed, { eventDice: [1, 1, 1], battleRoll: 5, enemyTableRoll: 1 }).character;
routed = completeBattleMeleeRound(routed, { action: 'engage', playerRoll: 5, enemyRoll: 20, followerRoll: 5 }).character;
assert.equal(routed.campaign.massBattle.phase, 'withdrawal');
assert.equal(sanitizeMassBattleState(JSON.parse(JSON.stringify(routed.campaign.massBattle))).phase, 'withdrawal');
routed = resolveBattleWithdrawal(routed, { action: 'stand', battleRoll: 15 }, fixed(0)).character;
assert.equal(routed.campaign.massBattle.phase, 'melee');
routed = beginBattleMeleeRound(routed, { eventDice: [6, 6, 6], battleRoll: 5, enemyTableRoll: 1 }).character;
routed = completeBattleMeleeRound(routed, { action: 'engage', playerRoll: 5, enemyRoll: 20, followerRoll: 5 }).character;
assert.equal(routed.campaign.massBattle.phase, 'pursuit_decision');
routed = choosePursuit(routed, true).character;
assert.equal(sanitizeMassBattleState(JSON.parse(JSON.stringify(routed.campaign.massBattle))).phase, 'pursuit');
routed = resolvePursuitRound(routed, { enemyTableRoll: 1, playerRoll: 5, enemyRoll: 20 }).character;
assert.equal(endPursuit(JSON.parse(JSON.stringify(routed))).character.campaign.massBattle.phase, 'aftermath');
routed = resolvePursuitRound(routed, { huntingRoll: 15, enemyRoll: 20, enemyCountRoll: 3 }).character;
assert.equal(routed.campaign.massBattle.phase, 'aftermath');

// Advanced assault through one ring, morale, fortress persistence, and save/reload.
let siegeCampaign = makeCharacter(0);
siegeCampaign = startSiege(siegeCampaign, {
  id: 'siege:assault', name: '종단 공성', fortress: '시험 성채', dv: '3', mode: 'advanced', playerSide: 'attacker', playerCommander: true,
  attacker: { siege: 20, stewardship: 16, intrigue: 14, valorous: 15, retinue: 14, commoners: 12, troops: 500, equipment: 20 },
  defender: { siege: 10, stewardship: 10, intrigue: 10, valorous: 10, retinue: 10, commoners: 10, troops: 200, equipment: 0 }
}).character;
siegeCampaign = resolveSiegeHealth(siegeCampaign, { attackerTroopRoll: 5, defenderTroopRoll: 5, playerRoll: 5 }).character;
const siegeReload = JSON.parse(JSON.stringify(siegeCampaign.campaign.siege));
assert.equal(sanitizeSiegeState(siegeReload).phase, 'tactic');
siegeCampaign = resolveSiegeTactic(siegeCampaign, { tactic: 'assault', attackerEquipment: 4, defenderEquipment: 0, attackerRoll: 20, defenderRoll: 20 }).character;
assert.equal(siegeCampaign.campaign.siege.phase, 'morale');
assert.equal(sanitizeSiegeState(JSON.parse(JSON.stringify(siegeCampaign.campaign.siege))).phase, 'morale');
siegeCampaign = resolveSiegeMorale(siegeCampaign, { defender: { valorousRoll: 5, retinueRoll: 5, commonersRoll: 5 } }).character;
assert.equal(siegeCampaign.campaign.siege.phase, 'aftermath');
siegeCampaign = finalizeSiege(siegeCampaign, '2026-08-09T01:00:00.000Z').character;
assert.equal(siegeCampaign.campaign.siege.status, 'complete');
assert.equal(siegeCampaign.campaign.fortresses.at(-1).status, 'captured');
assert.ok(siegeCampaign.campaign.siege.glory.total > 0);

// Simple siege also resolves through Table 8-12 and survives aftermath reload.
let simpleSiege = makeCharacter(0);
simpleSiege = startSiege(simpleSiege, {
  id: 'siege:simple', fortress: '단순 요새', dv: '5/3', mode: 'simple', playerSide: 'attacker',
  attacker: { siege: 20, troops: 300, equipment: 20 }, defender: { siege: 5, troops: 100, equipment: 0 }
}).character;
simpleSiege = resolveSiegeTactic(simpleSiege, { attackerEquipment: 10, defenderEquipment: 0, attackerRoll: 20, defenderRoll: 20 }).character;
assert.equal(simpleSiege.campaign.siege.phase, 'aftermath');
assert.equal(sanitizeSiegeState(JSON.parse(JSON.stringify(simpleSiege.campaign.siege))).phase, 'aftermath');

// Whole-campaign migration keeps each Chapter 8 state and history in schema v9.
const reloadedCampaign = sanitizeCampaignState(JSON.parse(JSON.stringify(simpleSiege)), makeCharacter(0));
assert.equal(reloadedCampaign.campaign.schemaVersion, 9);
assert.equal(reloadedCampaign.campaign.siege.phase, 'aftermath');

// Blockade persists to the next month; treachery can force surrender.
let blockade = makeCharacter(0);
blockade = startSiege(blockade, {
  id: 'siege:blockade', fortress: '봉쇄 성채', dv: '5/3', mode: 'advanced', playerSide: 'attacker',
  attacker: { siege: 15, stewardship: 15, intrigue: 18, valorous: 15, retinue: 14, commoners: 12, troops: 400, equipment: 5 },
  defender: { siege: 12, stewardship: 12, intrigue: 10, valorous: 10, retinue: 10, commoners: 10, troops: 150, equipment: 2 }
}).character;
blockade = resolveSiegeHealth(blockade, { attackerTroopRoll: 5, defenderTroopRoll: 5, playerRoll: 5 }).character;
blockade = resolveSiegeTactic(blockade, { tactic: 'blockade', attackerRoll: 5, defenderRoll: 5 }).character;
assert.equal(blockade.campaign.siege.phase, 'health');
assert.equal(blockade.campaign.siege.month, 2);
blockade = resolveSiegeHealth(blockade, { attackerTroopRoll: 5, defenderTroopRoll: 5, playerRoll: 5 }).character;
blockade = resolveSiegeTactic(blockade, { tactic: 'treachery', target: 'commander', bribe: 1, roll: 18 }).character;
assert.equal(blockade.campaign.siege.phase, 'morale');
blockade = resolveSiegeMorale(blockade, { defender: { valorousRoll: 19 } }).character;
assert.equal(blockade.campaign.siege.result.winner, 'attacker');

// Attacker commoner morale critical gives +5 to exactly the next Assault or Blockade roll.
let moraleBoost = makeCharacter(0);
moraleBoost = startSiege(moraleBoost, {
  id: 'siege:morale-boost', fortress: '사기 성채', dv: '3', mode: 'advanced', playerSide: 'attacker',
  attacker: { siege: 15, stewardship: 15, intrigue: 10, valorous: 15, retinue: 14, commoners: 12, troops: 300, equipment: 0 },
  defender: { siege: 10, stewardship: 10, intrigue: 10, valorous: 10, retinue: 10, commoners: 10, troops: 100, equipment: 0 }
}).character;
moraleBoost = resolveSiegeHealth(moraleBoost, { attackerTroopRoll: 19, defenderTroopRoll: 5, playerRoll: 5 }).character;
moraleBoost = resolveSiegeTactic(moraleBoost, { tactic: 'blockade', attackerRoll: 5, defenderRoll: 5 }).character;
moraleBoost = resolveSiegeMorale(moraleBoost, { attacker: { valorousRoll: 5, retinueRoll: 5, commonersRoll: 12 } }).character;
assert.equal(moraleBoost.campaign.siege.sides.attacker.nextSiegeModifier, 5);
moraleBoost = resolveSiegeHealth(moraleBoost, { attackerTroopRoll: 5, defenderTroopRoll: 5, playerRoll: 5 }).character;
moraleBoost = resolveSiegeTactic(moraleBoost, { tactic: 'assault', attackerRoll: 5, defenderRoll: 5 }).character;
assert.equal(moraleBoost.campaign.siege.turns.at(-1).tactic.attackerCheck.target, 20);
assert.equal(moraleBoost.campaign.siege.sides.attacker.nextSiegeModifier, 0);

console.log(JSON.stringify({
  tables: '8-1 through 8-16 passed', skirmish: 'end-to-end passed', battle: 'end-to-end passed', retreatPursuit: 'passed',
  injuryCaptureFollowers: 'passed', siegeAssaultBlockadeTreacheryMorale: 'passed', saveReload: 'passed'
}, null, 2));

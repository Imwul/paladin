import assert from 'node:assert/strict';
import {
  applyCharacterDamage,
  concludeCombat,
  getDerivedHealth,
  resolveCombatRound,
  resolveFirstAid,
  resolveHazard,
  resolveMajorWoundCourage,
  resolveWeeklyRecovery,
  startCombat
} from '../src/rules/index.js';
import { sanitizeCampaignState } from '../src/utils/campaignState.js';

const test = (ruleId, name, assertion) => {
  assertion();
  console.log(`[${ruleId}] ${name}`);
};

const makeCharacter = () => ({
  personal: { name: 'Adalhart', age: 30, campaignYear: 780, maintenance: 'ordinary', features: [] },
  attributes: { siz: 14, dex: 12, str: 13, con: 12, app: 11, currentHp: 26 },
  traits: { valorous: 15, cowardly: 5 },
  passions: { honor: 15, loveFamily: 15, loveGod: 15, loveCharlemagne: 15 },
  standings: { charlemagne: 10, liegeLord: 10, family: 10, retinue: 10, church: 10, commoners: 10 },
  skills: { sword: 15, spear: 12, lance: 13, axe: 10, bludgeon: 10, dagger: 10, unarmed: 8, firstAid: 10, chirurgery: 10, horsemanship: 12 },
  skillsChecked: {}, traitsChecked: {}, passionsChecked: {}, standingsChecked: {},
  squire: { name: '', age: 15 },
  horses: { warhorse: { type: 'Charger', damage: '6d6', age: 6, hp: 42, armor: 5 } },
  gear: { armorShield: 'Mail and shield', cash: 5, gloryThisGame: 0, gloryTotal: 100 },
  family: { name: 'House', members: [{ id: 'adalhart', name: 'Adalhart', relation: '본인', generation: 3, status: '생존' }], ancestorRollLog: [] },
  journal: {},
  campaign: {
    schemaVersion: 7,
    saveRevision: 0,
    appliedEvents: {},
    chronicleEvents: [],
    gloryLedger: [],
    standingLedger: [],
    familyTimeline: [],
    passionStates: [],
    lifecycle: { status: 'active', careerStatus: 'active', activeCharacterId: 'adalhart', primaryCharacterId: 'adalhart', events: [], unresolvedChoices: [] },
    health: { wounds: [], surgeryNeeded: false, unconscious: false, pendingDeath: null, majorWoundCourage: null, weeklyCare: [] },
    combat: null,
    winter: { year: 780, steps: {}, logs: [], unresolved: {} }
  }
});

const encounterInput = {
  player: { weaponId: 'sword', armor: 10, armorType: 'chainmail', shield: 6 },
  opponent: { name: 'Saxon warrior', skill: 12, dex: 10, siz: 12, con: 12, damageDice: 4, weaponId: 'axe', armor: 6, armorType: 'chainmail', shield: 6 }
};

test('CHAR-DERIVED-001/HEALTH-HP-001', 'health thresholds use Paladin rounding', () => {
  const health = getDerivedHealth(makeCharacter().attributes);
  assert.equal(health.totalHp, 26);
  assert.equal(health.damageDice, 5);
  assert.equal(health.healingRate, 3);
  assert.equal(health.unconsciousThreshold, 7);
  assert.equal(health.majorWoundThreshold, 12);
});

test('COMBAT-SEQUENCE-001/COMBAT-DAMAGE-001', 'opposed partial success grants shield after armor', () => {
  const started = startCombat(makeCharacter(), encounterInput, '2026-08-09T00:00:00.000Z');
  const resolved = resolveCombatRound(started, {
    actorRoll: 10,
    opponentRoll: 8,
    actorDamageTotal: 20,
    opponentBalanceRoll: 1,
    now: '2026-08-09T00:01:00.000Z'
  });
  assert.equal(resolved.round.opposed.winner, 'actor');
  assert.equal(resolved.round.opposed.opponentOutcome, 'partial');
  assert.equal(resolved.round.damage.shieldApplies, true);
  assert.equal(resolved.round.opponentInjury.actualDamage, 8);
  assert.equal(resolved.character.campaign.combat.opponent.currentHp, 16);
  assert.equal(resolved.character.campaign.combat.round, 1);
});

test('COMBAT-DAMAGE-001/HEALTH-HP-001', 'knockdown uses rolled damage and a major wound uses actual damage', () => {
  const result = applyCharacterDamage(makeCharacter(), {
    rolledDamage: 22,
    armor: 10,
    balanceRoll: 1,
    consciousnessRoll: 1,
    attributeLossRolls: [6],
    source: 'Axe attack',
    year: 780,
    now: '2026-08-09T00:02:00.000Z'
  });
  assert.equal(result.injury.knockedDown, false);
  assert.equal(result.injury.actualDamage, 12);
  assert.equal(result.injury.classification, 'major');
  assert.equal(result.character.campaign.health.surgeryNeeded, true);
  assert.equal(result.character.attributes.currentHp, 14);
});

test('HEALTH-HP-001', 'non-combat wounds share the health ledger without rolling knockdown', () => {
  let rngCalls = 0;
  const result = applyCharacterDamage(makeCharacter(), {
    rolledDamage: 12,
    direct: true,
    skipKnockdown: true,
    consciousnessRoll: 1,
    attributeLossRolls: [6],
    source: 'Winter event',
    year: 780
  }, () => {
    rngCalls += 1;
    return 0;
  });
  assert.equal(result.injury.knockedDown, false);
  assert.equal(result.injury.balanceRoll, null);
  assert.equal(result.character.campaign.health.wounds[0].source, 'Winter event');
  assert.equal(rngCalls, 0);
});

test('HEALTH-HP-001', 'a conscious Major Wound requires Valorous before combat can continue', () => {
  const wounded = applyCharacterDamage(makeCharacter(), {
    rolledDamage: 12,
    direct: true,
    requiresValorousToContinue: true,
    consciousnessRoll: 1,
    attributeLossRolls: [6],
    source: 'Major wound',
    year: 780
  }).character;
  assert.equal(wounded.campaign.health.majorWoundCourage.status, 'pending');
  const passed = resolveMajorWoundCourage(wounded, { roll: 10 });
  assert.equal(passed.courage.status, 'continued');
  assert.equal(passed.character.traitsChecked.valorous, true);

  const failed = resolveMajorWoundCourage(wounded, { roll: 16 });
  assert.equal(failed.courage.status, 'blocked');
  const fumbled = resolveMajorWoundCourage(wounded, { roll: 20 });
  assert.equal(fumbled.courage.status, 'must_withdraw');
});

test('COMBAT-SPECIAL-001', 'double feint halves armor before the hit is applied', () => {
  const started = startCombat(makeCharacter(), encounterInput);
  const result = resolveCombatRound(started, {
    actorTactic: 'doubleFeint',
    actorFeintRoll: 5,
    actorRoll: 10,
    opponentRoll: 8,
    actorDamageTotal: 20,
    opponentBalanceRoll: 1
  });
  assert.equal(result.round.rolls.actorFeint.success, true);
  assert.equal(result.round.damage.armor, 3);
  assert.equal(result.round.opponentInjury.actualDamage, 11);
});

test('COMBAT-MOUNT-001', 'charging lance uses horse damage and the charge modifier', () => {
  const started = startCombat(makeCharacter(), {
    ...encounterInput,
    player: { ...encounterInput.player, weaponId: 'lance', mounted: true, horseDamageDice: 6 }
  });
  const result = resolveCombatRound(started, {
    actorCharging: true,
    actorRoll: 17,
    opponentRoll: 5,
    opponentBalanceRoll: 1
  }, () => 0);
  assert.equal(result.round.targets.actor.target, 23);
  assert.equal(result.round.damage.dice, 6);
  assert.equal(result.round.damage.total, 36);
});

test('COMBAT-KNOCKDOWN-001/COMBAT-MOUNT-001', 'a mounted loser records separate 1d6 falling damage', () => {
  const started = startCombat(makeCharacter(), {
    ...encounterInput,
    player: { ...encounterInput.player, weaponId: 'lance', mounted: true, horseDamageDice: 6 },
    opponent: { ...encounterInput.opponent, mounted: true }
  });
  const result = resolveCombatRound(started, {
    actorCharging: true,
    actorRoll: 18,
    opponentRoll: 20,
    opponentFallDamage: 4
  });
  assert.equal(result.round.opponentInjury.knockedDown, true);
  assert.equal(result.round.opponentFallInjury.actualDamage, 4);
  assert.equal(result.character.campaign.combat.opponent.health.wounds.length, 2);
});

test('HEALTH-HP-001/COMBAT-MOUNT-001', 'falling unconscious while mounted permits a separate DEX roll to avoid the fall', () => {
  const character = makeCharacter();
  character.attributes.currentHp = 10;
  const started = startCombat(character, {
    player: { ...encounterInput.player, mounted: true, armor: 0, shield: 0 },
    opponent: { ...encounterInput.opponent, weaponId: 'greatSpear', shield: 0 }
  });
  const result = resolveCombatRound(started, {
    actorRoll: 20,
    opponentRoll: 5,
    opponentDamageTotal: 8,
    actorUnconsciousMountRoll: 20,
    actorFallDamage: 4
  });
  assert.equal(result.round.injury.knockedDown, false);
  assert.equal(result.round.actorUnconsciousMountCheck.success, false);
  assert.equal(result.round.fallInjury.actualDamage, 4);
  assert.equal(result.character.attributes.currentHp, -2);
});

test('HEALTH-HP-001/HEALTH-HEAL-001', 'a mortal wound at -5 can survive only when First Aid restores positive HP', () => {
  const wounded = applyCharacterDamage(makeCharacter(), {
    rolledDamage: 31,
    armor: 0,
    source: 'Mortal wound',
    year: 780,
    now: '2026-08-09T00:03:00.000Z'
  }).character;
  assert.equal(wounded.attributes.currentHp, -5);
  assert.equal(wounded.campaign.health.pendingDeath.due, 'same_day_midnight');
  const wound = wounded.campaign.health.wounds[0];
  const treated = resolveFirstAid(wounded, {
    woundId: wound.id,
    ageInHours: 1,
    roll: 10,
    healingRoll: 3,
    attributeLossRolls: [1, 2, 6],
    now: '2026-08-09T00:30:00.000Z'
  });
  assert.equal(treated.treatment.check.outcome, 'critical');
  assert.equal(treated.character.attributes.currentHp, 1);
  assert.equal(treated.character.attributes.siz, 13);
  assert.equal(treated.character.attributes.dex, 11);
  assert.equal(treated.character.campaign.health.pendingDeath, null);
  assert.throws(() => resolveFirstAid(treated.character, { woundId: wound.id }), /once per wound/);
});

test('HEALTH-HEAL-001', 'a First Aid fumble that reaches zero HP creates same-midnight death', () => {
  const character = makeCharacter();
  character.attributes.currentHp = 4;
  const wounded = applyCharacterDamage(character, { rolledDamage: 2, direct: true, skipKnockdown: true, year: 780 }).character;
  const treated = resolveFirstAid(wounded, { woundId: wounded.campaign.health.wounds[0].id, roll: 20, healingRoll: 2 });
  assert.equal(treated.character.attributes.currentHp, 0);
  assert.equal(treated.character.campaign.health.pendingDeath.due, 'same_day_midnight');
  assert.equal(treated.character.campaign.health.unconscious, true);
});

test('HEALTH-HEAL-001', 'weekly Chirurgery, natural healing and activity cancellation follow Tables 7-4 and 7-5', () => {
  const character = makeCharacter();
  character.attributes.currentHp = 10;
  character.campaign.health.surgeryNeeded = true;
  const recovered = resolveWeeklyRecovery(character, { activity: 'none', chirurgeryRoll: 10, now: '2026-08-09T12:00:00.000Z' });
  assert.equal(recovered.recovery.surgery.outcome, 'critical');
  assert.equal(recovered.recovery.healing, 6);
  assert.equal(recovered.character.attributes.currentHp, 16);
  assert.equal(recovered.character.campaign.health.surgeryNeeded, false);

  const active = makeCharacter();
  active.attributes.currentHp = 10;
  const aggravated = resolveWeeklyRecovery(active, { activity: 'strenuous', aggravationDamage: 2 });
  assert.equal(aggravated.recovery.naturalCancelled, true);
  assert.equal(aggravated.recovery.aggravation, 2);
  assert.equal(aggravated.character.attributes.currentHp, 8);

  const unconscious = makeCharacter();
  unconscious.attributes.currentHp = 2;
  unconscious.campaign.health.unconscious = true;
  const limited = resolveWeeklyRecovery(unconscious, { activity: 'strenuous', aggravationDamage: 3 });
  assert.equal(limited.recovery.requestedActivity, 'strenuous');
  assert.equal(limited.recovery.activity, 'light');
  assert.equal(limited.recovery.aggravation, 0);
});

test('HEALTH-HAZARD-001', 'falls create wounds while poison bypasses armor and First Aid records', () => {
  const fall = resolveHazard(makeCharacter(), { type: 'fall', distanceFeet: 12, damageTotal: 12, year: 780 });
  assert.equal(fall.hazard.rolledDamage, 12);
  assert.equal(fall.injury.classification, 'major');
  assert.equal(fall.character.campaign.health.wounds.length, 1);

  const poison = resolveHazard(makeCharacter(), { type: 'poison', potencyDice: 4, damageTotal: 20, armor: 20, year: 780 });
  assert.equal(poison.hazard.rolledDamage, 8);
  assert.equal(poison.injury.actualDamage, 8);
  assert.equal(poison.character.campaign.health.wounds.length, 0);

  const disease = resolveHazard(makeCharacter(), { type: 'disease', damage: 2, year: 780 });
  assert.equal(disease.character.attributes.currentHp, 24);
  assert.equal(disease.character.campaign.health.surgeryNeeded, true);
  assert.equal(disease.character.campaign.health.wounds.length, 0);
  const visibleDisease = resolveHazard(makeCharacter(), { type: 'disease', damage: 2, recordWound: true, year: 780 });
  assert.equal(visibleDisease.character.campaign.health.wounds.length, 1);
});

test('SAVE-IMPORT-001', 'schema v6 saves migrate to v12 and preserve negative HP', () => {
  const defaults = makeCharacter();
  const old = makeCharacter();
  old.campaign.schemaVersion = 6;
  old.attributes.currentHp = -2;
  delete old.campaign.health;
  delete old.campaign.combat;
  const migrated = sanitizeCampaignState(old, defaults);
  assert.equal(migrated.campaign.schemaVersion, 12);
  assert.equal(migrated.attributes.currentHp, -2);
  assert.equal(migrated.campaign.health.pendingDeath.due, 'same_day_midnight');
  assert.equal(migrated.campaign.combat, null);

  const historical = makeCharacter();
  historical.attributes.currentHp = -2;
  historical.campaign.lifecycle.careerStatus = 'deceased';
  historical.campaign.health.pendingDeath = { due: 'same_day_midnight' };
  historical.campaign.health.majorWoundCourage = { status: 'pending', year: 780 };
  const sanitizedHistorical = sanitizeCampaignState(historical, defaults);
  assert.equal(sanitizedHistorical.campaign.health.pendingDeath, null);
  assert.equal(sanitizedHistorical.campaign.health.majorWoundCourage, null);
});

test('COMBAT-SEQUENCE-001', 'combat conclusion creates one meaningful Chronicle event', () => {
  const started = startCombat(makeCharacter(), encounterInput, '2026-08-09T00:00:00.000Z');
  const concluded = concludeCombat(started, { result: 'victory', note: 'The foe yielded.' }, '2026-08-09T01:00:00.000Z');
  assert.equal(concluded.campaign.combat.status, 'concluded');
  assert.equal(concluded.campaign.chronicleEvents.length, 1);
  assert.match(concluded.campaign.chronicleEvents[0].narrative, /0라운드/);
});

console.log('combat regression passed');

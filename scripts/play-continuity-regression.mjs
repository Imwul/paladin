import assert from 'node:assert/strict';
import { collectSurvivalTargets, resolveWinterFamilyChallenge, resolveWinterStep } from '../src/rules/winterRules.js';
import { getChronicleEventPresentation } from '../src/utils/chronicleLabels.js';
import { applyChapter7Consequences, completeChapter7Movement, concludeChapter7Combat, declareChapter7Action, resolveChapter7Action, startChapter7Combat } from '../src/rules/chapter7CombatRules.js';
import { getJourneyTravelers, recordJourneyDecision, resolveJourneyDay, startJourney } from '../src/rules/rulebookProcedureRules.js';
import { buyMarketItem, sanitizeEconomyState } from '../src/rules/economyRules.js';

let count = 0;
const test = (name, action) => { action(); count += 1; console.log(`PASS ${name}`); };
const knight = () => ({ personal: { name: 'Continuity Knight', age: 23, campaignYear: 767 }, attributes: { siz: 14, con: 14, str: 12, dex: 12, app: 10, currentHp: 28 }, skills: { sword: 16, hunting: 12 }, standings: { liegeLord: 10 }, traits: { valorous: 15 }, passions: { honor: 15 }, gear: { gloryTotal: 100 }, horses: {}, family: { members: [] }, campaign: { lifecycle: { status: 'active' }, health: {}, chronicleEvents: [] } });
const reload = value => JSON.parse(JSON.stringify(value));

test('Winter targets exclude metadata but preserve legacy animals', () => {
  const c = knight();
  c.horses = { warhorse: { type: 'Charger' }, inventory: { charger: 1 }, canonicalMountIds: ['charger'], other2: 'Palfrey', other3: { type: 'Courser', age: 4, status: '건강' } };
  const targets = collectSurvivalTargets(reload(c));
  assert.equal(targets.some(target => ['horse-slot:inventory', 'horse-slot:canonicalMountIds'].includes(target.targetId)), false);
  assert.equal(targets.some(target => target.targetId === 'horse-slot:other2'), true);
  assert.equal(targets.some(target => target.targetId === 'horse-slot:other3'), true);
});
test('known first-knight legacy label is corrected, actual succession and saved history remain intact', () => {
  const old = { type: 'succession', title: 'Adalhart의 계승', narrative: '선대의 유산', sourceRuleId: 'CHAR-STORY-001', cause: 'character_creation', triggeringEvent: 'successor_creation_and_knighting' };
  const before = JSON.stringify(old);
  assert.equal(getChronicleEventPresentation(old).type, 'character');
  assert.equal(getChronicleEventPresentation(old).title, 'Adalhart의 활동 시작');
  assert.equal(JSON.stringify(old), before);
  assert.equal(getChronicleEventPresentation({ ...old, cause: 'successor_creation' }).type, 'succession');
});
test('decisive final round is retained before movement without repeating damage', () => {
  let c = startChapter7Combat(knight(), { id: 'decisive', opponents: [{ id: 'bandit', name: 'Bandit', skill: 12, siz: 12, con: 12, str: 12, dex: 12, armor: 0, shield: 0, distance: 1 }], player: { weaponId: 'sword' } });
  c = declareChapter7Action(c, { action: 'attack', targetIds: ['bandit'] }).character;
  c = resolveChapter7Action(c, { actorRoll: 1, opponentRoll: 20, actorDamageTotal: 100 }).character;
  c = applyChapter7Consequences(c).character;
  const hp = c.campaign.combat.opponents[0].currentHp;
  const concluded = concludeChapter7Combat(reload(c), { result: 'victory' }).character;
  assert.equal(concluded.campaign.combat.outcome.rounds, 1);
  assert.equal(concluded.campaign.combat.rounds.length, 1);
  assert.equal(concluded.campaign.combat.rounds[0].endedAtConclusion, true);
  assert.equal(concluded.campaign.combat.opponents[0].currentHp, hp);
  assert.match(concluded.campaign.chronicleEvents.at(-1).narrative, /1라운드/);
  const afterMovement = completeChapter7Movement(c).character;
  assert.equal(concludeChapter7Combat(afterMovement, { result: 'victory' }).character.campaign.combat.rounds.length, 1);
});
test('foot Hurried and surgery fast travel are rejected by source p.111', () => {
  assert.throws(() => startJourney(knight(), { destination: 'Aachen', distance: 30, pace: 'hurried' }), /도보/);
  const c = knight(); c.campaign.health.surgeryNeeded = true;
  assert.throws(() => startJourney(c, { destination: 'Aachen', distance: 30, pace: 'normal' }), /Chirurgery/);
  assert.equal(startJourney(c, { destination: 'Aachen', distance: 30, pace: 'leisurely' }).journey.pace, 'leisurely');
});
test('only real owned mounts are selectable; no guessed CON', () => {
  const c = knight(); c.horses = { warhorse: { type: 'Charger', move: 8 }, inventory: { charger: 1 }, canonicalMountIds: ['charger'], other2: '' };
  assert.equal(getJourneyTravelers(c).length, 2);
  let travel = startJourney(c, { id: 'legacy', destination: 'Aachen', distance: 80, travelerId: 'horse-slot:warhorse', pace: 'forcedMarch' }).character;
  assert.throws(() => resolveJourneyDay(travel, { journeyId: 'legacy', conRoll: 1 }), /GM/);
  travel = resolveJourneyDay(travel, { journeyId: 'legacy', conRoll: 1, con: 12, movementRate: 8, profileNote: 'GM verifies this individual charger profile', gmProfileConfirmed: true }).character;
  const resumed = resolveJourneyDay(reload(travel), { journeyId: 'legacy', conRoll: 1 });
  assert.equal(resumed.day.forced.target, 12);
  assert.equal(resumed.day.forced.movementRate, 8);
});
test('mounted fumble marks only the ridden animal, not human HP or every unit; reload is idempotent', () => {
  const buyer = knight(); buyer.gear.cash = 100;
  let c = buyMarketItem(buyer, { transactionId: 'mounts', itemId: 'rouncy', quantity: 2 }).character;
  const mount = c.campaign.economy.equipment.find(item => item.marketItemId === 'rouncy');
  c = startJourney(c, { id: 'mounted', destination: 'Aachen', distance: 100, travelerId: `inventory:${mount.id}`, pace: 'forcedMarch' }).character;
  const result = resolveJourneyDay(c, { journeyId: 'mounted', transactionId: 'mounted:day:1', conRoll: 20 });
  c = reload(result.character);
  assert.equal(result.day.forced.target, 14); assert.equal(result.day.forced.movementRate, 6);
  assert.equal(result.day.forced.lamed, true); assert.equal(result.day.forced.damage, 0); assert.equal(c.attributes.currentHp, 28);
  const mounts = c.campaign.economy.equipment.filter(item => item.marketItemId === 'rouncy');
  assert.equal(mounts.reduce((sum, item) => sum + item.quantity, 0), 2);
  assert.equal(mounts.filter(item => item.travelCondition?.kind === 'lamed').length, 1);
  assert.equal(mounts.find(item => item.travelCondition)?.quantity, 1);
  const duplicate = resolveJourneyDay(c, { journeyId: 'mounted', transactionId: 'mounted:day:1', conRoll: 20 });
  assert.equal(duplicate.applied, false); assert.deepEqual(duplicate.character.campaign.economy.equipment, mounts);
  assert.equal(sanitizeEconomyState(c.campaign.economy).equipment.find(item => item.travelCondition)?.travelCondition.kind, 'lamed');
  c = recordJourneyDecision(c, { journeyId: 'mounted', note: 'GM confirms rest; continue on foot', gmConfirmed: true, travelerId: 'human', pace: 'normal' }).character;
  const continued = resolveJourneyDay(reload(c), { journeyId: 'mounted' });
  assert.equal(continued.day.traveler.kind, 'human'); assert.equal(continued.day.distance, 15);
  assert.equal(continued.character.campaign.economy.equipment.find(item => item.travelCondition)?.travelCondition.kind, 'lamed');
});
test('Winter survival is not invented lameness recovery', () => {
  let c = knight(); c.horses.warhorse = { type: 'Courser', status: '건강', age: 4, travelCondition: { kind: 'lamed', transactionId: 'horse:lamed' } };
  c = resolveWinterStep(c, { stepId: 'soloScenario', input: { choice: 'not_applicable' } }).character;
  c = resolveWinterStep(c, { stepId: 'aging', input: {} }, () => 0.5).character;
  c = resolveWinterStep(c, { stepId: 'economy', input: { harvestRoll: 5, maintenanceGrade: 'ordinary' } }).character;
  c = resolveWinterStep(c, { stepId: 'survival', input: { rolls: { warhorse: 10 } } }, () => 0.5).character;
  assert.equal(reload(c).horses.warhorse.travelCondition.kind, 'lamed');
});

test('failed marriage offers a no-effect decline and source checks on challenge exactly once', () => {
  let c = knight(); c.family.members = [{ id: 'mother', name: 'Test Mother', relation: '모친', gender: 'female', status: '생존', lifeYears: '726~' }];
  c = resolveWinterStep(c, { stepId: 'soloScenario', input: { choice: 'not_applicable' } }).character;
  c = resolveWinterStep(c, { stepId: 'aging' }).character;
  c = resolveWinterStep(c, { stepId: 'economy', input: { harvestRoll: 5, maintenanceGrade: 'ordinary' } }).character;
  c = resolveWinterStep(c, { stepId: 'survival' }, () => 0.5).character;
  c.traits.chaste = 10;
  c = resolveWinterStep(c, { stepId: 'personalEvent', input: { eventRoll: 1, checkRoll: 1 } }).character;
  c = resolveWinterStep(c, { stepId: 'family', input: { marriageAction: 'skip', familyEventRoll: 9, relationRoll: 3, sexRoll: 1 } }).character;
  const declined = resolveWinterFamilyChallenge(reload(c), { challenged: false }).character;
  assert.equal(declined.campaign.winter.steps.family, 'resolved');
  assert.equal(declined.passionsChecked?.loveFamily, undefined);
  assert.equal(declined.standingsChecked?.family, undefined);
  assert.throws(() => resolveWinterFamilyChallenge(c, { challenged: true }), /실제로/);
  const challenged = resolveWinterFamilyChallenge(reload(c), { challenged: true, challengeDeclared: true, note: 'Player declares challenge against abusive knight; no battle outcome presumed' }).character;
  assert.equal(challenged.passionsChecked.loveFamily, true);
  assert.equal(challenged.standingsChecked.family, true);
  const duplicate = resolveWinterFamilyChallenge(reload(challenged), { challenged: true });
  assert.equal(duplicate.applied, false);
  assert.deepEqual(duplicate.character.campaign.winter.transactions, challenged.campaign.winter.transactions);
});

console.log(`Play continuity: ${count} scenarios passed.`);

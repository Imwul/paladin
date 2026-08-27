import assert from 'node:assert/strict';
import {
  closeWinterYear,
  collectSurvivalTargets,
  ensureWinterState,
  FAMILY_RELATION_TABLE,
  PERSONAL_EVENT_TABLE,
  RANDOM_MARRIAGE_TABLE,
  resolveChildbirthRoll,
  resolveFamilyRelation,
  resolveRandomMarriage,
  resolveSurvivalRoll,
  resolveWinterFamilyBattle,
  resolveWinterFamilyTarget,
  resolveWinterStep,
  WINTER_STEPS
} from '../src/rules/winterRules.js';

const traitPairs = [
  ['chaste', 'lustful'], ['energetic', 'lazy'], ['forgiving', 'vengeful'], ['generous', 'selfish'],
  ['honest', 'deceitful'], ['just', 'arbitrary'], ['merciful', 'cruel'], ['modest', 'proud'],
  ['prudent', 'reckless'], ['temperate', 'indulgent'], ['trusting', 'suspicious'], ['valorous', 'cowardly']
];

const makeCharacter = () => ({
  personal: { name: 'Test Knight', age: 18, campaignYear: 767, maintenance: 'ordinary', personalClass: 'Knight', blessing: '' },
  attributes: { siz: 12, dex: 12, str: 12, con: 12, app: 12, currentHp: 24 },
  traits: Object.fromEntries(traitPairs.flatMap(([left, right]) => [[left, 10], [right, 10]])),
  traitsChecked: {},
  passions: { loveCharlemagne: 15, loveFamily: 15, honor: 15, loveGod: 15 },
  passionsChecked: {},
  standings: { charlemagne: 10, liegeLord: 10, family: 10, retinue: 10, church: 10, commoners: 10 },
  standingsChecked: {},
  skills: {
    awareness: 8, firstAid: 10, folkLore: 8, horsemanship: 12, hunting: 8, stewardship: 10,
    courtesy: 8, dancing: 8, eloquence: 8, battle: 10, sword: 12, lance: 10
  },
  skillsChecked: { awareness: true },
  squire: { name: 'Test Squire', age: 15, firstAid: 8, horsemanship: 8, weapon: 8, status: '건강' },
  horses: { warhorse: { type: 'Charger', age: 6, status: '건강', hp: 40, armor: 5 } },
  gear: { cash: 10, gloryThisGame: 0, gloryTotal: 1200, homePossessions: '장원', personalGear: '' },
  family: {
    name: 'Test House',
    manors: 1,
    members: [
      { id: 'self', name: 'Test Knight', relation: '본인', generation: 3, status: '생존', lifeYears: '749~', gender: 'male' },
      { id: 'father', name: 'Test Father', relation: '부친', generation: 2, status: '생존', lifeYears: '725~', gender: 'male' },
      { id: 'mother', name: 'Test Mother', relation: '모친', generation: 2, status: '생존', lifeYears: '730~', gender: 'female' }
    ]
  },
  journal: {},
  campaign: {
    schemaVersion: 7,
    appliedEvents: {},
    chronicleEvents: [],
    gloryLedger: [], standingLedger: [], familyTimeline: [], gloryBonusClaimedThreshold: 0,
    lifecycle: { status: 'active', careerStatus: 'active', activeCharacterId: 'self', primaryCharacterId: 'self', events: [], unresolvedChoices: [] },
    winter: null
  }
});

const constantRng = value => () => value;

assert.equal(WINTER_STEPS.length, 10, 'Winter must retain the ten printed steps.');
assert.deepEqual(WINTER_STEPS.map(step => step.id), ['soloScenario', 'aging', 'economy', 'survival', 'personalEvent', 'family', 'experience', 'training', 'glory', 'gloryBonus']);

assert.throws(
  () => resolveWinterStep(makeCharacter(), { stepId: 'aging', input: {} }, constantRng(0.5)),
  /printed order/,
  'A later Winter step cannot run before Step 1.'
);

let character = makeCharacter();
let result = resolveWinterStep(character, { stepId: 'soloScenario', input: { choice: 'not_applicable' } });
assert.equal(result.applied, true);
assert.equal(ensureWinterState(result.character).currentStep, 'aging');
const duplicate = resolveWinterStep(result.character, { stepId: 'soloScenario', input: { choice: 'not_applicable' } });
assert.equal(duplicate.applied, false, 'A completion ID prevents duplicate application.');

let woundedInWinter = makeCharacter();
woundedInWinter = resolveWinterStep(woundedInWinter, { stepId: 'soloScenario', input: { choice: 'not_applicable' } }).character;
woundedInWinter = resolveWinterStep(woundedInWinter, { stepId: 'aging', input: {} }, constantRng(0.5)).character;
woundedInWinter = resolveWinterStep(woundedInWinter, { stepId: 'economy', input: { harvestRoll: 5, maintenanceGrade: 'ordinary' } }).character;
woundedInWinter = resolveWinterStep(woundedInWinter, { stepId: 'survival', input: {} }, constantRng(0.5)).character;
const woundResult = resolveWinterStep(woundedInWinter, { stepId: 'personalEvent', input: { eventRoll: 15, checkRoll: 15 } }, constantRng(0.5));
assert.equal(woundResult.character.attributes.currentHp, 12, 'The printed armorless 3d6 Winter wound applies actual damage.');
assert.equal(woundResult.character.campaign.health.wounds.length, 1, 'Winter wounds enter the shared wound ledger.');
assert.equal(woundResult.character.campaign.health.wounds[0].classification, 'major');
assert.equal(woundResult.record.stateChanges.some(change => Boolean(change.woundId)), true);

character = JSON.parse(JSON.stringify(result.character));
assert.equal(ensureWinterState(character).currentStep, 'aging', 'An in-progress Winter resumes after serialization.');

result = resolveWinterStep(character, { stepId: 'aging', input: {} }, constantRng(0.99));
character = result.character;
assert.equal(character.personal.age, 19);
assert.equal(character.squire.age, 16);
assert.equal(character.horses.warhorse.age, 7);

result = resolveWinterStep(character, { stepId: 'economy', input: { harvestRoll: 5, maintenanceGrade: 'ordinary', situationalModifier: 0 } });
character = result.character;
assert.equal(character.campaign.winter.annualLedger.grossIncome, 6);
assert.equal(character.campaign.winter.annualLedger.requiredMaintenance, 6);
assert.equal(character.campaign.winter.annualLedger.treasuryDelta, 0, 'Gross income is not added directly to cash.');
assert.equal(character.gear.cash, 10);

let lowCommonerStanding = makeCharacter();
lowCommonerStanding.standings.commoners = 5;
lowCommonerStanding = resolveWinterStep(lowCommonerStanding, { stepId: 'soloScenario', input: { choice: 'not_applicable' } }).character;
lowCommonerStanding = resolveWinterStep(lowCommonerStanding, { stepId: 'aging', input: {} }, constantRng(0.99)).character;
lowCommonerStanding = resolveWinterStep(lowCommonerStanding, { stepId: 'economy', input: { harvestRoll: 5, maintenanceGrade: 'ordinary' } }).character;
assert.equal(lowCommonerStanding.campaign.winter.annualLedger.standingAdjustedHarvest, 3, 'Standing [commoners] 5 halves fief income.');
let rebelliousCommoners = makeCharacter();
rebelliousCommoners.standings.commoners = 0;
rebelliousCommoners = resolveWinterStep(rebelliousCommoners, { stepId: 'soloScenario', input: { choice: 'not_applicable' } }).character;
rebelliousCommoners = resolveWinterStep(rebelliousCommoners, { stepId: 'aging', input: {} }, constantRng(0.99)).character;
rebelliousCommoners = resolveWinterStep(rebelliousCommoners, { stepId: 'economy', input: { harvestRoll: 5, maintenanceGrade: 'ordinary' } }).character;
assert.equal(rebelliousCommoners.campaign.winter.annualLedger.standingAdjustedHarvest, 0, 'Standing [commoners] 0 removes fief income.');

result = resolveWinterStep(character, { stepId: 'survival', input: {} }, constantRng(0.9));
character = result.character;
assert.equal(character.campaign.winter.survivalRecords.length, 4, 'Each family member, squire and mount receives a separate record.');
assert.equal(character.campaign.winter.survivalRecords.find(item => item.targetId === 'warhorse').result, 'herd_replacement');
assert.equal(character.campaign.winter.survivalRecords.every(item => item.appliedEffectId), true);

result = resolveWinterStep(character, { stepId: 'personalEvent', input: { eventRoll: 13, checkRoll: 16 } });
character = result.character;
assert.equal(result.record.result.check.outcome, 'failure');
assert.equal(result.awaitingChoice, false);

const familyStepStart = structuredClone(character);
result = resolveWinterStep(character, { stepId: 'family', input: {
  familyEventRoll: 3, relationRoll: 3, sexRoll: 2,
  marriageAction: 'within_class_roll', courtesyRoll: 1, marriageTableRoll: 21, spouseName: 'Adele', spouseAge: 18,
  childbirthAction: 'roll', childbirths: [{ roll: 20, childNames: ['Emma', 'Hugo'], sexRolls: [1, 2] }]
} });
character = result.character;
assert.equal(result.record.result.relation.selectedTarget.id, 'father');
assert.equal(result.awaitingChoice, false);
assert.equal(result.record.result.marriage.status, 'married');
assert.equal(result.record.result.marriage.manors, 1);
assert.deepEqual(result.record.result.childbirths[0].children.map(child => child.gender), ['female', 'male']);
assert.equal(character.campaign.familyTimeline.filter(entry => ['marriage', 'birth'].includes(entry.type)).length, 3);

let choiceResult = resolveWinterStep(familyStepStart, { stepId: 'family', input: {
  familyEventRoll: 20,
  marriageAction: 'within_class_roll', courtesyRoll: 1, marriageTableRoll: 21, spouseName: 'Adele', spouseAge: 18,
  childbirthAction: 'roll', childbirths: [{ roll: 20, childNames: ['Emma', 'Hugo'], sexRolls: [1, 2] }]
} });
assert.equal(choiceResult.awaitingChoice, true);
assert.equal(choiceResult.record.result.marriage.status, 'married', 'Marriage resolves before the family-event choice pause.');
assert.equal(choiceResult.record.result.childbirths[0].children.length, 2, 'Childbirth resolves before the family-event choice pause.');
const memberCountBeforeChoice = choiceResult.character.family.members.length;
const lineageCountBeforeChoice = choiceResult.character.campaign.familyTimeline.length;
choiceResult = resolveWinterStep(choiceResult.character, { stepId: 'family', input: { eventChoice: 3, relationRoll: 3, sexRoll: 2 } });
assert.equal(choiceResult.awaitingChoice, false);
assert.equal(choiceResult.character.family.members.length, memberCountBeforeChoice, 'Resuming a family-event choice cannot duplicate spouse or children.');
assert.equal(choiceResult.character.campaign.familyTimeline.length, lineageCountBeforeChoice + 1, 'Only the selected family event is appended on resume.');

let missingTarget = resolveWinterStep(familyStepStart, { stepId: 'family', input: {
  familyEventRoll: 2, relationRoll: 14, sexRoll: 5,
  marriageAction: 'skip', childbirthAction: 'skip'
} });
assert.equal(missingTarget.awaitingChoice, true, 'A missing printed-table family target pauses Winter.');
assert.deepEqual(missingTarget.character.campaign.winter.unresolved.family.types.sort(), ['family_target_creation_or_reroll', 'family_target_required']);
const gloryTransactionsBeforeTarget = missingTarget.character.campaign.gloryLedger.length;
missingTarget = resolveWinterFamilyTarget(missingTarget.character, { relationRoll: 3, sexRoll: 2 });
assert.equal(missingTarget.awaitingChoice, false, 'The printed reroll path can resolve a missing family target.');
assert.equal(missingTarget.character.family.members.find(member => member.id === 'father').status, '사망');
assert.equal(missingTarget.character.campaign.winter.steps.family, 'resolved');
assert.equal(missingTarget.character.campaign.familyTimeline.find(entry => entry.id === 'winter:767:family:event').memberId, 'father');
assert.equal(missingTarget.character.campaign.gloryLedger.length, gloryTransactionsBeforeTarget, 'Resolving the target cannot replay the family event reward.');
assert.throws(
  () => resolveWinterFamilyTarget(missingTarget.character, { relationRoll: 3, sexRoll: 2 }),
  /No unresolved Winter family target/,
  'A resolved family target cannot be applied twice.'
);

let familyBattle = resolveWinterStep(familyStepStart, { stepId: 'family', input: {
  familyEventRoll: 18, relationRoll: 3, sexRoll: 2,
  marriageAction: 'skip', childbirthAction: 'skip'
} });
assert.equal(familyBattle.awaitingChoice, true, 'Festering Feud pauses for its printed Battle roll.');
assert.deepEqual(familyBattle.character.campaign.winter.unresolved.family.types, ['battle_roll']);
familyBattle = resolveWinterFamilyBattle(familyBattle.character, { roll: 10 });
assert.equal(familyBattle.result.outcome, 'critical');
assert.equal(familyBattle.character.skillsChecked.battle, true);
assert.equal(familyBattle.character.passionsChecked.honor, true);
assert.equal(familyBattle.character.passionsChecked.loveFamily, true);
assert.equal(familyBattle.character.standingsChecked.family, true);
assert.equal(familyBattle.character.campaign.winter.steps.family, 'resolved');
assert.throws(() => resolveWinterFamilyBattle(familyBattle.character, { roll: 10 }), /No unresolved Winter family Battle roll/);

let familyBattleFumble = resolveWinterStep(familyStepStart, { stepId: 'family', input: {
  familyEventRoll: 18, relationRoll: 3, sexRoll: 2,
  marriageAction: 'skip', childbirthAction: 'skip'
} });
familyBattleFumble = resolveWinterFamilyBattle(familyBattleFumble.character, { roll: 20 });
assert.equal(familyBattleFumble.result.outcome, 'fumble');
assert.equal(familyBattleFumble.character.passions.loveFamily, 13);
assert.equal(familyBattleFumble.character.standings.family, 8);

result = resolveWinterStep(character, { stepId: 'experience', input: {} }, constantRng(0.99));
character = result.character;
assert.equal(character.skills.awareness, 9, 'Equal-or-higher experience resolution is applied once.');
assert.equal(character.skillsChecked.awareness, undefined);

result = resolveWinterStep(character, { stepId: 'training', input: { option: 'score', group: 'traits', key: 'chaste', amount: 1 } });
character = result.character;
assert.equal(character.traits.chaste, 11);
assert.equal(character.traits.lustful, 9);

result = resolveWinterStep(character, { stepId: 'glory', input: {} });
character = result.character;
assert.equal(result.record.result.entries.some(entry => entry.source === 'holdings'), true);
assert.equal(character.gear.gloryThisGame, 0);
assert.equal(character.campaign.winter.gloryBonusPoints, 1, 'An unclaimed 1,000-point threshold is available exactly once.');

result = resolveWinterStep(character, { stepId: 'gloryBonus', input: { allocations: [{ group: 'skills', key: 'sword' }] } });
character = result.character;
assert.equal(character.campaign.gloryBonusClaimedThreshold, 1);
assert.equal(ensureWinterState(character).currentStep, 'complete');
const closed = closeWinterYear(character);
assert.equal(closed.applied, true);
assert.equal(closed.character.personal.campaignYear, 768);
assert.equal(closed.character.campaign.winter.currentStep, 'soloScenario');
assert.equal(closed.character.campaign.winterHistory.length, 1);

const personalRows = Object.values(PERSONAL_EVENT_TABLE);
assert.equal(personalRows.length, 20);
personalRows.forEach(event => {
  assert.equal(event.ruleId, 'WINTER-PERSONAL-001');
  ['critical', 'success', 'failure', 'fumble'].forEach(outcomeKey => {
    const outcome = event.outcomes[outcomeKey];
    ['mandatoryEffect', 'optionalChoice', 'traitCheck', 'passionCheck', 'skillCheck', 'glory', 'standing', 'familyEffect', 'lifecycleEffect', 'unresolvedChoice', 'journalPrompt'].forEach(key => assert.equal(Object.hasOwn(outcome, key), true, `Event ${event.roll} ${outcomeKey} requires ${key}.`));
  });
});

assert.equal(FAMILY_RELATION_TABLE.length, 8);
for (let roll = 1; roll <= 20; roll += 1) {
  const relation = resolveFamilyRelation({ relationRoll: roll, sexRoll: 2, members: makeCharacter().family.members });
  assert.ok(relation.relationKey);
  assert.equal(relation.gender, 'male');
}

assert.equal(RANDOM_MARRIAGE_TABLE.length, 8);
for (let roll = 1; roll <= 35; roll += 1) assert.ok(resolveRandomMarriage({ roll }), `Marriage roll ${roll} must resolve.`);
assert.equal(resolveRandomMarriage({ roll: 20, waitingModifier: 1 }).rank, 'vassal_heiress');
assert.deepEqual(resolveChildbirthRoll({ roll: 10 }), { roll: 10, modifier: 0, adjustedRoll: 10, motherDies: false, childrenDie: false, births: 0, children: [] });
assert.equal(resolveChildbirthRoll({ roll: 11 }).motherDies, true);
assert.equal(resolveChildbirthRoll({ roll: 12, sexRolls: [2] }).children[0].gender, 'male');
assert.deepEqual(resolveChildbirthRoll({ roll: 20, sexRolls: [1, 2] }).children.map(child => child.gender), ['female', 'male']);

assert.deepEqual(resolveSurvivalRoll({ roll: 1 }), { roll: 1, adjustedRoll: 1, result: 'death', consequence: '사망' });
assert.equal(resolveSurvivalRoll({ roll: 2 }).result, 'illness');
assert.equal(resolveSurvivalRoll({ roll: 3 }).result, 'healthy');

const deadTargetCharacter = makeCharacter();
deadTargetCharacter.family.members[1].status = '사망';
assert.equal(collectSurvivalTargets(deadTargetCharacter).some(target => target.targetId === 'father'), false, 'Dead targets never return to next-year Survival.');

console.log('Winter regression passed: 10-step order, persistence, idempotency, tables, economy, survival, progression and close.');

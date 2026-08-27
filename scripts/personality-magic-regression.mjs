import assert from 'node:assert/strict';
import {
  addDirectedPassion,
  addDirectedTrait,
  advanceMelancholyRecovery,
  applyDishonorableAct,
  beginAmorWinter,
  beginPassionResolution,
  beginPrayerResolution,
  beginSelfImposedLoversTask,
  completeIntrospection,
  completePassionResolution,
  consummateAmor,
  convertExternalAmorToHate,
  createPersonalityMagicState,
  drawLoversTask,
  inheritDirectedTrait,
  lowerPassionDuringWinter,
  recordMiracleDecision,
  reducePassionForContraryAction,
  resolveAmorDiscovery,
  resolveDream,
  resolveEssai,
  resolveExternalMelancholyRecovery,
  resolveFearOpportunity,
  resolveHonorLordJudgment,
  resolveIntrospection,
  resolveLoversTask,
  resolveMadnessOnset,
  resolveMadnessYear,
  resolvePersonalityConflict,
  resolvePaganLadyAmor,
  resolveScenarioPassionShock,
  resumeAmorProcedure,
  resolveStandardTraitTest,
  setPotentialAmor,
  settleOath,
  startAmor,
  takeOath
} from '../src/rules/personalityMagicRules.js';
import { createEconomyState, toDeniers } from '../src/rules/economyRules.js';
import { sanitizeCampaignState } from '../src/utils/campaignState.js';

const baseCharacter = () => {
  const character = {
    personal: { name: 'Test Knight', age: 30, campaignYear: 780, maintenance: 'ordinary' },
    attributes: { siz: 13, dex: 13, str: 13, con: 13, app: 18, currentHp: 26 },
    traits: {
      chaste: 16, lustful: 4, energetic: 16, lazy: 4, forgiving: 15, vengeful: 5,
      generous: 16, selfish: 4, honest: 16, deceitful: 4, just: 16, arbitrary: 4,
      merciful: 15, cruel: 5, modest: 15, proud: 5, prudent: 16, reckless: 4,
      temperate: 15, indulgent: 5, trusting: 16, suspicious: 4, valorous: 16, cowardly: 4
    },
    skills: {
      awareness: 12, chirurgery: 5, faerieLore: 5, firstAid: 10, folkLore: 8,
      horsemanship: 15, hunting: 12, industry: 8, recognize: 10, religion: 15, stewardship: 10, swimming: 8,
      courtesy: 12, dancing: 10, eloquence: 14, falconry: 10, gaming: 10, heraldry: 10, intrigue: 10,
      languages: 8, playInstruments: 10, readingWriting: 8, romance: 15, singing: 15,
      battle: 12, siege: 10, axe: 10, bludgeon: 8, dagger: 10, spear: 12, sword: 16,
      unarmed: 10, lance: 16, bow: 8, crossbow: 8, thrownWeapon: 8
    },
    passions: { honor: 16, loveCharlemagne: 16, loveFamily: 15, loveGod: 16 },
    standings: { charlemagne: 12, liegeLord: 12, family: 12, retinue: 12, church: 12, commoners: 12 },
    gear: { cash: 20, gloryThisGame: 0, gloryTotal: 1000 },
    squire: { name: 'Squire', age: 15 },
    horses: { warhorse: { type: 'Charger', hp: 40, armor: 5, age: 5 } },
    family: { members: [], manors: 0 }, journal: {}, skillsChecked: {}, traitsChecked: {}, passionsChecked: {}, standingsChecked: {},
    campaign: {
      schemaVersion: 12, personalityMagic: createPersonalityMagicState(), appliedEvents: {}, chronicleEvents: [],
      gloryLedger: [], standingLedger: [], honorLedger: [], familyTimeline: [], lifecycle: { status: 'active', careerStatus: 'active' }
    }
  };
  character.campaign.economy = createEconomyState(character);
  character.campaign.economy.coinDeniers = toDeniers(20);
  return character;
};

let character = baseCharacter();

const directed = addDirectedTrait(character, { traitKey: 'suspicious', target: 'Gascons', modifier: 3, origin: 'voluntary', gmAgreed: true }).character;
assert.equal(directed.campaign.personalityMagic.directedTraits[0].modifier, 3);
const inherited = inheritDirectedTrait(directed, { directedTraitId: directed.campaign.personalityMagic.directedTraits[0].id });
assert.equal(inherited.directedTrait.origin, 'inherited');
assert.equal(inherited.directedTrait.modifier, 3);
const trait = resolveStandardTraitTest(directed, {
  traitKey: 'suspicious', directedTraitIds: [directed.campaign.personalityMagic.directedTraits[0].id], roll: 7, significantAction: true
});
assert.equal(trait.result.primary.target, 7);
assert.equal(trait.result.primary.outcome, 'critical');

let directedPassion = addDirectedPassion(trait.character, {
  kind: 'fear', target: 'Moving standing stones', value: 12, playerAgreed: true, gmAgreed: true,
  transactionId: 'directed:fear:stones'
});
assert.equal(directedPassion.character.passions['fear:Moving_standing_stones'], 12);
directedPassion = reducePassionForContraryAction(directedPassion.character, {
  passionKey: 'fear:Moving_standing_stones', action: 'Approached the stones', gmDirected: true,
  transactionId: 'fear:stones:contrary'
});
assert.equal(directedPassion.character.passions['fear:Moving_standing_stones'], 11);
const winterLowered = lowerPassionDuringWinter(directedPassion.character, {
  passionKey: 'fear:Moving_standing_stones', duringWinter: true, transactionId: 'winter:780:fear:stones'
});
assert.equal(winterLowered.character.passions['fear:Moving_standing_stones'], 8);
const winterDuplicate = lowerPassionDuringWinter(winterLowered.character, {
  passionKey: 'fear:Moving_standing_stones', duringWinter: true, transactionId: 'winter:780:fear:stones'
});
assert.equal(winterDuplicate.applied, false);
const overcameFear = resolveFearOpportunity(winterLowered.character, {
  passionKey: 'fear:Moving_standing_stones', context: 'Faced the standing stones again', overcame: true,
  glory: 80, gmCreatedOpportunity: true, gmApprovedGlory: true, transactionId: 'fear:stones:overcome'
});
assert.equal(overcameFear.character.passions['fear:Moving_standing_stones'], 0);
assert.equal(overcameFear.character.gear.gloryThisGame, 80);

const conflict = resolvePersonalityConflict(trait.character, {
  actorGroup: 'traits', actorKey: 'just', actorRoll: 10,
  opponentGroup: 'traits', opponentKey: 'merciful', opponentRoll: 8
});
assert.equal(conflict.result.result.winner, 'actor');

const lowHonor = baseCharacter();
lowHonor.passions.honor = 6;
const dishonored = applyDishonorableAct(lowHonor, { actId: 'cowardice', transactionId: 'dishonor:cowardice' });
assert.equal(dishonored.character.passions.honor, 5);
assert.equal(dishonored.character.campaign.honorStatus.pendingLordJudgment, true);
const judged = resolveHonorLordJudgment(dishonored.character, { outcome: 'degraded', note: 'The lord strips the knighthood.' });
assert.equal(judged.character.campaign.honorStatus.state, 'degraded');
const zeroHonor = baseCharacter();
zeroHonor.passions.honor = 1;
const removedFromPlay = applyDishonorableAct(zeroHonor, { actId: 'cowardice', transactionId: 'dishonor:zero' });
assert.equal(removedFromPlay.character.passions.honor, 0);
assert.equal(removedFromPlay.character.campaign.lifecycle.careerStatus, 'historical');
assert.equal(removedFromPlay.character.campaign.honorStatus.activePlayRemoved, true);

let passion = beginPassionResolution(conflict.character, { passionKey: 'honor', mode: 'mandatory', roll: 16 });
assert.equal(passion.resolution.outcome, 'critical');
const savedResolution = sanitizeCampaignState(JSON.parse(JSON.stringify(passion.character)), baseCharacter());
assert.equal(savedResolution.campaign.personalityMagic.activeResolution.id, passion.resolution.id);
passion = completePassionResolution(passion.character, { actionOutcome: 'successful' });
assert.equal(passion.character.passions.honor, 17);
assert.equal(passion.character.passionsChecked.honor, true);

let frivolous = beginPassionResolution(passion.character, { passionKey: 'honor', mode: 'frivolous', roll: 1 });
frivolous = completePassionResolution(frivolous.character, {
  actionOutcome: 'failed', agingRoll: 1, attributeRolls: [1, 2, 3, 4, 5]
});
const shock = frivolous.character.campaign.personalityMagic.conditions.find(item => item.type === 'shock');
assert.deepEqual(shock.aging.losses, ['siz', 'dex', 'str', 'con', 'app']);

const wrathfulShock = resolveScenarioPassionShock(passion.character, {
  passionKey: 'honor', roll: 1, agingRoll: 20, transactionId: 'wrathful:shock', sourcePage: 'Ch.19 p.423'
});
assert.equal(wrathfulShock.result.shocked, true);
assert.equal(wrathfulShock.condition.sourcePage, 'Ch.19 p.423');
const wrathfulAvoided = resolveScenarioPassionShock(passion.character, {
  passionKey: 'honor', roll: 18, transactionId: 'wrathful:avoided', sourcePage: 'Ch.19 p.423'
});
assert.equal(wrathfulAvoided.result.shocked, false);

let failed = beginPassionResolution(frivolous.character, { passionKey: 'loveFamily', mode: 'ordinary', gmApproved: true, roll: 18 });
failed = completePassionResolution(failed.character, { actionOutcome: 'failed' });
assert.equal(failed.character.passions.loveFamily, 14);
const melancholy = failed.character.campaign.personalityMagic.conditions.find(item => item.type === 'melancholy' && item.status === 'active');
assert.equal(melancholy.naturalRecoveryWeeks, 15);
const recoveredMelancholy = advanceMelancholyRecovery(failed.character, { conditionId: melancholy.id, weeks: 15 });
assert.equal(recoveredMelancholy.condition.status, 'resolved');

let fumble = beginPassionResolution(recoveredMelancholy.character, {
  passionKey: 'loveGod', mode: 'ordinary', gmApproved: true, roll: 20
});
assert.equal(fumble.character.passions.loveGod, 15);
const madness = fumble.character.campaign.personalityMagic.conditions.find(item => item.type === 'madness' && item.status === 'active');
assert.equal(madness.onset, 'gm_pending');
const onset = resolveMadnessOnset(fumble.character, { conditionId: madness.id, onset: 'after_action' });
assert.equal(onset.condition.onset, 'after_action');
assert.equal(onset.result.type, 'madness_onset_decision');
const duplicateOnset = resolveMadnessOnset(onset.character, { conditionId: madness.id, onset: 'after_action' });
assert.equal(duplicateOnset.applied, false);
assert.throws(() => resolveMadnessOnset(onset.character, { conditionId: madness.id, onset: 'immediate', transactionId: `${madness.id}:changed` }), /바꿀 수 없습니다/);
fumble = onset;
fumble = resolveMadnessYear(fumble.character, {
  conditionId: madness.id,
  changes: [{ roll: 1, key: 'chaste' }, { roll: 12, key: 'awareness' }, { roll: 13, key: 'gaming' }, { roll: 14, key: 'sword' }],
  recoveryRoll: 6
});
assert.equal(fumble.result.recovered, true);
assert.equal(fumble.condition.status, 'resolved');

const healer = resolveExternalMelancholyRecovery(fumble.character, {
  subject: 'Melancholic Paladin', healerGroup: 'passions', healerKey: 'loveFamily',
  healerRoll: 14, victimPassionValue: 16, victimRoll: 6
});
assert.equal(healer.result.victimState, 'recovered', JSON.stringify(healer.result));

let oath = takeOath(healer.character, { kind: 'positive', text: 'Rescue my lord', passionKey: 'honor', roll: 10 });
oath = settleOath(oath.character, { fulfilled: true });
assert.equal(oath.character.passions.honor, 18);

let prayer = beginPrayerResolution(oath.character, {
  eligible: true, beneficiary: 'self_prayer', intention: 'Protect the village', form: 'mass', place: 'church',
  faithful: 'none', day: 'sunday', sacredItem: 'relic', gmUsesTable: true, roll: 18
});
assert.equal(prayer.resolution.passionKey, 'loveCharlemagne');
assert.equal(prayer.resolution.target, 18);
assert.equal(prayer.resolution.outcome, 'critical');
assert.throws(() => completePassionResolution(prayer.character, { actionOutcome: 'successful' }), /miracle 결과/);
prayer = recordMiracleDecision(prayer.character, {
  context: 'The Miracle of Truth', chosenResult: 'GM confirms a true miracle', downstreamState: 'Saxons may genuinely convert'
});
prayer = completePassionResolution(prayer.character, { actionOutcome: 'successful' });
assert.equal(prayer.character.passions.loveCharlemagne, 17);

const dream = resolveDream(prayer.character, { loveGodRoll: 10, religionRoll: 15, messageSource: 'GM', message: 'A warning' });
assert.equal(dream.dream.religion.target, 15);
const sourceDream = resolveDream(dream.character, {
  passionKey: 'loveCharlemagne', passionRoll: 17, religionRoll: 1,
  messageSource: 'source', sourcePage: 'Ch.19 p.396', transactionId: 'jewel:dream'
});
assert.equal(sourceDream.dream.passionKey, 'loveCharlemagne');
assert.equal(sourceDream.dream.passionCheck.outcome, 'critical');

const narrativePrayer = beginPrayerResolution(dream.character, {
  eligible: true, beneficiary: 'other_prayer', intention: 'Aid the wounded', form: 'normal', place: 'ordinary',
  faithful: 'none', day: 'ordinary', sacredItem: 'none', gmUsesTable: false
});
assert.equal(narrativePrayer.resolution.outcome, 'gm_narrative');
assert.equal(narrativePrayer.character.campaign.personalityMagic.activeResolution, null);

const passiveAmor = resolvePaganLadyAmor(baseCharacter(), {
  mode: 'passive', ladyName: 'Lady Orable', ladyResistanceValue: 15, appRoll: 18, ladyRoll: 20,
  ladyAmorValue: 16, playerAgreed: true, gmAgreed: true, transactionId: 'pagan:passive'
});
assert.equal(passiveAmor.result.success, true);
assert.equal(passiveAmor.character.campaign.personalityMagic.externalPassions[0].visibility, 'gm_only');
assert.equal(passiveAmor.character.campaign.personalityMagic.amor, null);

const deliberateAmor = resolvePaganLadyAmor(baseCharacter(), {
  mode: 'deliberate', ladyName: 'Lady Floripas', ladyResistanceValue: 15, appRoll: 18, ladyRoll: 20,
  ladyAmorValue: 17, playerAmorValue: 16, playerAgreed: true, gmAgreed: true, transactionId: 'pagan:deliberate'
});
assert.equal(deliberateAmor.result.success, true);
assert.equal(deliberateAmor.character.passions['amor:Lady_Floripas'], 16);
assert.equal(deliberateAmor.character.campaign.personalityMagic.amor.potentialAmor, 17);

let selfTask = startAmor(baseCharacter(), { targetName: 'Unmet Lady', roll: 6, keep: true });
selfTask = beginSelfImposedLoversTask(selfTask.character);
selfTask = drawLoversTask(selfTask.character, { roll: 9 });
selfTask = resolveLoversTask(selfTask.character, { testKey: 'singing', roll: 14 });
assert.equal(selfTask.amor.selfImposedTasks, 1);
selfTask = setPotentialAmor(selfTask.character, { value: 16, chaste: 15 });
assert.equal(selfTask.amor.potentialAmor, 17);

let amor = startAmor(dream.character, {
  targetName: 'Lady Test', secretName: 'The Rose', roll: 6, amorGender: 'woman', amorGlory: 2000,
  amorApp: 18, knightSavedAmor: true, keep: true
});
assert.equal(amor.amor.value, 22);
let introspection = resolveIntrospection(amor.character, { gameDay: '780-spring-01', roll: 18, durationRolls: [1, 2, 3, 4] });
assert.equal(introspection.condition.durationMinutes, 10);
const duplicateIntrospection = resolveIntrospection(introspection.character, { gameDay: '780-spring-01', roll: 18, durationRolls: [6, 6, 6, 6] });
assert.equal(duplicateIntrospection.applied, false);
introspection = completeIntrospection(introspection.character, { conditionId: introspection.condition.id });
assert.equal(introspection.condition.status, 'resolved');
amor.character = introspection.character;
amor = setPotentialAmor(amor.character, { value: 17, chaste: 15 });
assert.equal(amor.amor.reluctance, 3);
amor = beginAmorWinter(amor.character, { giftLivres: 1, romanceRoll: 15 });
amor = drawLoversTask(amor.character, { roll: 9 });
assert.throws(() => resolveLoversTask(amor.character, { testKey: 'sword', roll: 1 }), /singing 판정만/);
amor = resolveLoversTask(amor.character, { testKey: 'singing', roll: 14 });
assert.equal(amor.amor.reluctance, 1);
amor.character.personal.campaignYear += 1;
amor = beginAmorWinter(amor.character, { giftLivres: 1, romanceRoll: 15 });
amor = drawLoversTask(amor.character, { roll: 10 });
amor = resolveLoversTask(amor.character, { testKey: 'eloquence', roll: 13 });
assert.equal(amor.amor.phase, 'essai');
const resumedAmor = resumeAmorProcedure(amor.character, { action: 'romance_progression' });
assert.equal(resumedAmor.result.type, 'amor_resumed');
amor.character = resumedAmor.character;
amor = resolveEssai(amor.character, { chasteRoll: 16 });
assert.equal(amor.amor.phase, 'essai_passed');
amor.character.personal.campaignYear += 1;
amor = consummateAmor(amor.character);
assert.equal(amor.amor.phase, 'affair');
amor = resolveAmorDiscovery(amor.character, { discoveryDie: 1, observerValue: 4, loveRoll: 12, discoveryRoll: 6 });
assert.equal(amor.result.success, true);
assert.equal(amor.character.gear.gloryThisGame, 50);

const external = convertExternalAmorToHate(passiveAmor.character, { subject: 'Lady Orable', target: 'Test Knight', value: 99, reason: 'Betrayal', transactionId: 'pagan:betrayal' });
assert.equal(external.result.after, 'Hate');
assert.equal(external.result.value, 16);
assert.equal(external.character.campaign.personalityMagic.externalPassions[0].value, 16);
assert.equal(external.character.passions.honor, 11);
assert.equal(external.character.passions.loveGod, 11);
const externalDuplicate = convertExternalAmorToHate(external.character, { subject: 'Lady Orable', target: 'Test Knight', value: 16, reason: 'Betrayal', transactionId: 'pagan:betrayal' });
assert.equal(externalDuplicate.applied, false);
assert.equal(externalDuplicate.character.passions.honor, 11);

const defaults = baseCharacter();
const legacy = baseCharacter();
delete legacy.campaign.personalityMagic;
legacy.campaign.passionStates = [{ id: 'legacy-madness', type: 'madness', status: 'active', passionKey: 'honor', year: 779 }];
const migrated = sanitizeCampaignState(legacy, defaults);
assert.equal(migrated.campaign.personalityMagic.conditions[0].id, 'legacy-madness');
assert.equal(migrated.campaign.passionStates, undefined);

console.log('Chapter 3/9 personality and magic regression passed.');

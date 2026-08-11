import assert from 'node:assert/strict';
import {
  acknowledgeChronologyRules, activateIdeal, applyAnnualCareerBenefits, appointCareer, consumeRomanticIdealReroll,
  getCareerEligibility, getChivalrousNaturalArmor, recordChivalricCombatSettlement,
  recordChivalricSiegeSettlement, recordPrintedGlorySource, recordRomanticIdealDuty,
  recordSourcedStandingChange, recordStandingGift, resolveFeatProcedure, resolveJourneyDay,
  resolveSkillProcedure, retireCareer, startJourney
} from '../src/rules/rulebookProcedureRules.js';
import { getChronologyHarvestModifier, resolveMaleAncestorDeathCause } from '../src/rules/campaignRules.js';
import { applyCharacterDamage } from '../src/rules/combatRules.js';
import { createEconomyState } from '../src/rules/economyRules.js';
import { collectSurvivalTargets } from '../src/rules/winterRules.js';
import {
  completeAdventureStage, getCurrentAdventureStage, recordAdventureDecision,
  recordAdventureProcedureItem, resolveAdventureTest, startAdventure
} from '../src/rules/adventureRules.js';

const baseCharacter = () => {
  const character = {
    personal: { name: 'Test Knight', age: 28, campaignYear: 790, maintenance: 'ordinary' },
    attributes: { siz: 14, dex: 16, str: 16, con: 16, app: 12, currentHp: 30 },
    traits: { honest: 16, just: 16, valorous: 20, energetic: 18, generous: 16, merciful: 16, modest: 16, prudent: 16 },
    passions: { honor: 20, loveCharlemagne: 18, loveGod: 16, loveFamily: 16 },
    skills: { swimming: 12, hunting: 12, falconry: 12, gaming: 12, heraldry: 12, recognize: 12, courtesy: 16, dancing: 16, eloquence: 16, languages: 16, readingWriting: 16, firstAid: 16, horsemanship: 16, awareness: 16, folkLore: 16, religion: 16, stewardship: 16, intrigue: 16, battle: 16, siege: 16, sword: 20, spear: 20, lance: 16 },
    skillsChecked: {}, traitsChecked: {}, passionsChecked: {}, standingsChecked: {},
    standings: { charlemagne: 18, liegeLord: 18, family: 16, retinue: 18, church: 18, commoners: 12 },
    gear: { cash: 200, gloryThisGame: 0, gloryTotal: 9000 },
    family: { members: [{ id: 'self', relation: '본인', name: 'Test Knight', status: '생존', lifeYears: '762~' }, { id: 'kin', relation: '형제', name: 'Kin', status: '생존', lifeYears: '765~' }], manors: 1 },
    squire: { name: 'Squire', age: 16, status: '생존' },
    horses: { warhorse: { type: 'Charger', age: 6, status: '생존' }, other2: 'Palfrey' },
    campaign: { schemaVersion: 12, appliedEvents: {}, gloryLedger: [], standingLedger: [], honorLedger: [], chronicleEvents: [], familyTimeline: [], lifecycle: { status: 'active', careerStatus: 'active', activeCharacterId: 'self', events: [] }, health: { wounds: [], weeklyCare: [] }, combatHistory: [], battleHistory: [], siegeHistory: [], adventures: { engineVersion: 1, active: null, history: [] }, personalityMagic: { transactions: [] }, conditions: [] }
  };
  character.campaign.economy = createEconomyState(character);
  character.campaign.economy.coinDeniers = 200 * 240;
  character.campaign.economy.retainers.push({ id: 'steward', name: 'Steward', status: 'active', age: 35 });
  character.campaign.economy.equipment.push({ id: 'arab', marketItemId: 'arab_courser', category: 'mount', label: 'Arab Courser', quantity: 1 });
  return character;
};

assert.equal(getChronologyHarvestModifier(771), -2);
assert.equal(getChronologyHarvestModifier(775), 5);
assert.equal(getChronologyHarvestModifier(792), -15);
assert.equal(getChronologyHarvestModifier(813), 0);
assert.match(resolveMaleAncestorDeathCause(4), /Family Feud/);
assert.match(resolveMaleAncestorDeathCause(14), /Disappeared/);

let character = baseCharacter();
let result = acknowledgeChronologyRules(character, { transactionId: 'chronology-test' });
character = result.character;
assert.equal(result.registry.phase, 3);
assert.equal(acknowledgeChronologyRules(character, { transactionId: 'chronology-test' }).applied, false);

result = resolveSkillProcedure(character, { skillId: 'swimming', roll: 5, armor: 6, encumbrance: 'light', transactionId: 'skill-swim' });
character = result.character;
assert.equal(result.result.target, 1);
assert.equal(result.result.outcome, 'failure');
assert.equal(resolveSkillProcedure(character, { skillId: 'swimming', roll: 5, transactionId: 'skill-swim' }).applied, false);
result = resolveSkillProcedure(character, { skillId: 'falconry', roll: 20, transactionId: 'skill-falcon' });
character = result.character;
assert.equal(result.result.consequence, 'bird_lost_or_dead');

result = resolveFeatProcedure(character, { statistic: 15, roll: 8, gmApproved: true, transactionId: 'feat-test' });
character = result.character;
assert.equal(result.result.featTarget, 8);
assert.equal(result.result.outcome, 'critical');

result = startJourney(character, { id: 'journey-test', destination: 'Aachen', distance: 40, roadType: 'royalRoad', pace: 'normal' });
character = result.character;
result = resolveJourneyDay(character, { journeyId: 'journey-test', transactionId: 'journey-day-1' });
character = JSON.parse(JSON.stringify(result.character));
assert.equal(result.day.distance, 20);
result = resolveJourneyDay(character, { journeyId: 'journey-test', transactionId: 'journey-day-2' });
character = result.character;
assert.equal(result.journey.status, 'complete');

assert.equal(getCareerEligibility(character, 'count', { charlemagneAppointment: true }).eligible, true);
assert.equal(getCareerEligibility(character, 'vassal', {}).eligible, false);
assert.equal(getCareerEligibility(character, 'vassal', { landSource: 'granted' }).eligible, true);
result = appointCareer(character, { roleId: 'count', charlemagneAppointment: true, transactionId: 'career-count' });
character = result.character;
assert.equal(character.campaign.rulebookProcedures.career.activeRoleId, 'count');
assert.ok(character.campaign.gloryLedger.some(entry => entry.id === 'career-count:glory' && entry.amount === 350));
result = applyAnnualCareerBenefits(character, { holdingIncomeLivres: 120, transactionId: 'career-count-annual' });
character = result.character;
assert.equal(result.amount, 100);

result = recordPrintedGlorySource(character, { sourceType: 'marriage_converted_pagan', spouseGlory: 1200, spouseHonor: 16, transactionId: 'glory-marriage' });
character = result.character;
assert.equal(result.amount, 192);
result = recordPrintedGlorySource(character, { sourceType: 'enchanted_item', bonusPoints: 2, specialPowers: 1, legendaryFeats: 1, transactionId: 'glory-item' });
character = result.character;
assert.equal(result.amount, 18);

const coinBeforeGift = character.campaign.economy.coinDeniers;
result = recordStandingGift(character, { standingKey: 'liegeLord', giftLivres: 10, transactionId: 'standing-gift' });
character = result.character;
assert.equal(result.standing.amount, 1);
assert.equal(character.campaign.economy.coinDeniers, coinBeforeGift - 2400);
assert.equal(recordStandingGift(character, { standingKey: 'liegeLord', giftLivres: 10, transactionId: 'standing-gift' }).applied, false);
result = recordStandingGift(character, { standingKey: 'liegeLord', giftLivres: 15, roll: 1, transactionId: 'standing-gift-non-king' });
character = result.character;
assert.equal(result.standing.amount, 1);

let thresholdCharacter = baseCharacter();
result = recordSourcedStandingChange(thresholdCharacter, { standingKey: 'retinue', amount: -18, reason: 'Retinue abandoned', transactionId: 'standing-retinue-zero' });
thresholdCharacter = result.character;
assert.equal(result.consequence, 'retinue_leaves_or_sells_out');
assert.equal(thresholdCharacter.campaign.economy.retainers[0].status, 'left_service');
assert.equal(recordSourcedStandingChange(thresholdCharacter, { standingKey: 'retinue', amount: -18, reason: 'Retinue abandoned', transactionId: 'standing-retinue-zero' }).applied, false);

result = activateIdeal(character, { idealId: 'chivalrous', transactionId: 'ideal-chivalrous' });
character = result.character;
assert.equal(getChivalrousNaturalArmor(character), 3);
const hpBefore = character.attributes.currentHp;
result = applyCharacterDamage(character, { rolledDamage: 10, direct: true, source: 'drowning test', woundId: 'natural-armor-test' }, () => 0.5);
character = result.character;
assert.equal(result.injury.actualDamage, 7);
assert.equal(character.attributes.currentHp, hpBefore - 7);

result = activateIdeal(character, { idealId: 'romantic', transactionId: 'ideal-romantic' });
character = result.character;
result = recordRomanticIdealDuty(character, { task: 'Guard the pilgrim road', transactionId: 'romantic-duty' });
character = result.character;
assert.equal(result.ideal.annualGiftPaidYear, 790);
result = consumeRomanticIdealReroll(character, { adventureId: 'adventure:test', transactionId: 'romantic-reroll' });
character = result.character;
assert.equal(result.applied, true);
assert.equal(consumeRomanticIdealReroll(character, { adventureId: 'adventure:test', transactionId: 'romantic-reroll' }).applied, false);

result = recordChivalricCombatSettlement(character, { terms: 'conquest', winner: 'Test Knight', conquestChoice: 'ransom', ransomLivres: 20, transactionId: 'combat-settlement' });
character = result.character;
assert.equal(result.settlement.ransomLivres, 20);
result = recordChivalricCombatSettlement(character, { terms: 'conquest', winner: 'Test Knight', conquestChoice: 'seize_equipment', seizedEquipment: ['charger', 'frankish_sword', 'chain_mail'], transactionId: 'combat-equipment-settlement' });
character = result.character;
assert.equal(result.settlement.seizedEquipment.length, 3);
assert.ok(character.campaign.economy.equipment.some(item => item.marketItemId === 'charger' && item.source === 'chapter13_chivalric_conquest'));
assert.throws(() => recordChivalricCombatSettlement(character, { terms: 'love', winner: 'Test Knight', agreedByBoth: false, transactionId: 'combat-love-no-agreement' }), /두 기사 모두/);
result = recordChivalricSiegeSettlement(character, { fullyEngaged: true, daysWithoutRelief: 90, cityValueLivres: 100, noncombatantRestrictionAccepted: true, transactionId: 'siege-settlement' });
character = result.character;
assert.equal(result.settlement.taxLivres, 20);
assert.throws(() => recordChivalricSiegeSettlement(character, { fullyEngaged: false, daysWithoutRelief: 90, cityValueLivres: 100, noncombatantRestrictionAccepted: true, transactionId: 'siege-not-engaged' }), /fully engaged/);

const survivalTargets = collectSurvivalTargets(character);
assert.ok(survivalTargets.some(target => target.targetId === 'retainer:steward'));
assert.ok(survivalTargets.some(target => target.targetId === 'inventory-mount:arab'));
assert.ok(survivalTargets.some(target => target.targetId === 'horse-slot:other2'));

let scara = baseCharacter();
result = appointCareer(scara, { roleId: 'scara', hasIdeal: true, transactionId: 'career-scara' });
scara = result.character;
const charlemagneStanding = scara.standings.charlemagne;
result = retireCareer(scara, { route: 'leave_service', standingRoll: 5, transactionId: 'career-scara-retire' });
scara = result.character;
assert.equal(result.applied, true);
assert.equal(scara.standings.charlemagne, charlemagneStanding);

character = startAdventure(character, { adventureId: 'adulterous_spouse', id: 'adventure-gap-test' }).character;
const advanceDecision = (kind, value = 'confirmed') => {
  character = recordAdventureDecision(character, { kind, value, note: 'source regression' }).character;
  character = completeAdventureStage(character, { confirmed: true, note: 'source regression' }).character;
};
while (getCurrentAdventureStage(character.campaign.adventures.active).id !== 'actions') {
  const stage = getCurrentAdventureStage(character.campaign.adventures.active);
  if (stage.kind === 'test') {
    character = resolveAdventureTest(character, { testKey: stage.tests[0], roll: 1, target: 20 }).character;
    character = completeAdventureStage(character, { confirmed: true, note: 'test complete' }).character;
  } else if (stage.kind === 'player_choice') advanceDecision('player', stage.options[0]);
  else advanceDecision(stage.kind === 'narrative' ? 'narrative' : 'gm');
}
let blocked = false;
try { recordAdventureProcedureItem(character, { itemId: 'hear_testimony', note: 'note only' }); } catch { blocked = true; }
assert.equal(blocked, true);
result = recordAdventureProcedureItem(character, { itemId: 'hear_testimony', resolutionKind: 'canonical_action', action: { type: 'check', group: 'skills', key: 'intrigue' }, note: 'testimony heard' });
character = JSON.parse(JSON.stringify(result.character));
assert.equal(result.applied, true);
assert.equal(recordAdventureProcedureItem(character, { itemId: 'hear_testimony', resolutionKind: 'canonical_action', action: { type: 'check', group: 'skills', key: 'intrigue' } }).applied, false);

console.log('Final deterministic gap regression passed.');

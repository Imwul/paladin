import assert from 'node:assert/strict';
import {
  SAINT_BLESSINGS,
  beginSuccessorCreation,
  calculateSalvationLedger,
  createCharacterCreationSession,
  createSuccessorContext,
  getCreationRollRequests,
  prepareCareerEnd,
  prepareSalvation,
  resolveAttributeLifecycle,
  resolveCanonization,
  resolveCareerEnd,
  resolveIncapacitation,
  resolveSalvation,
  restorePrimaryCharacter,
  updateCharacterCreationChoice,
  updateLegacyChoices
} from '../src/rules/index.js';
import { sanitizeCampaignState } from '../src/utils/campaignState.js';
import { clearMissingTranslationKeys, getMissingTranslationKeys, setLocale, t } from '../src/i18n/index.js';

const test = (ruleId, name, assertion) => {
  assertion();
  console.log(`[${ruleId}] ${name}`);
};

const traitPairs = [
  ['chaste', 'lustful'], ['energetic', 'lazy'], ['forgiving', 'vengeful'], ['generous', 'selfish'],
  ['honest', 'deceitful'], ['just', 'arbitrary'], ['merciful', 'cruel'], ['modest', 'proud'],
  ['prudent', 'reckless'], ['temperate', 'indulgent'], ['trusting', 'suspicious'], ['valorous', 'cowardly']
];

const makeCharacter = () => ({
  personal: { name: 'Adalhart', age: 44, campaignYear: 790, maintenance: 'ordinary', features: [], personalClass: 'Knight', culture: 'Frankish', homeland: 'Ardennes', home: 'Bastogne', liegeLord: 'Duke Thierry' },
  attributes: { siz: 13, dex: 12, str: 14, con: 13, app: 11, currentHp: 26 },
  traits: Object.fromEntries(traitPairs.flatMap(([left, right]) => [[left, left === 'valorous' ? 20 : 10], [right, left === 'valorous' ? 0 : 10]])),
  passions: { amorIsabel: 20, honor: 20, loveCharlemagne: 20, loveFamily: 15, loveGod: 20 },
  standings: { charlemagne: 10, liegeLord: 20, family: 20, retinue: 10, church: 15, commoners: 10 },
  skills: { awareness: 10, firstAid: 10, horsemanship: 12, courtesy: 10, dancing: 10, battle: 10, sword: 15, spear: 13, lance: 10, stewardship: 8 },
  skillsChecked: {}, traitsChecked: {}, passionsChecked: {}, standingsChecked: {},
  squire: { name: '', age: 15 }, horses: { warhorse: { type: 'Charger', age: 8, hp: 42, armor: 5 } },
  gear: { armorShield: 'Mail and shield', clothing: 'Court clothes', personalGear: 'Sword, relic', homePossessions: 'Family chest', cash: 12, gloryThisGame: 0, gloryTotal: 4500 },
  family: {
    name: 'House Ardennes', motto: 'Faith and courage', battleCry: 'Montjoie', ancestor: 'Arnulf', homeCountry: 'Ardennes', notableMembers: 'Count Ansegisel',
    characteristic: { name: 'Keen of eye and ear', bonusText: JSON.stringify({ skills: { awareness: 5 } }) },
    patronSaint: 'St. Denis', patronSaintBenefit: 'passions.loveCharlemagne +2', muster: { oldKnights: 1 }, honor: 16, standings: { church: 12 }, manors: 1,
    members: [
      { id: 'adalhart', name: 'Adalhart', relation: '본인', generation: 3, status: '생존', lifeYears: '746~', gender: 'male' },
      { id: 'bertram', name: 'Bertram', relation: '아들', generation: 4, status: '생존', lifeYears: '773~', birthYear: 773, parentId: 'adalhart', memberClass: 'Squire', gender: 'male' }
    ], ancestorRollLog: [], ancestorApplied: false
  },
  journal: {},
  campaign: {
    schemaVersion: 5, saveRevision: 0, appliedEvents: {}, chronicleEvents: [], passionStates: [], characterCreationSession: null, completedCreationIds: [], characterArchives: [],
    lifecycle: { status: 'active', careerStatus: 'active', activeCharacterId: 'adalhart', primaryCharacterId: 'adalhart', pendingSuccession: false, events: [], unresolvedChoices: [] },
    winter: { year: 790, steps: {}, logs: [], unresolved: {} }
  }
});

const endCareer = (character, type = 'death') => {
  const prepared = prepareCareerEnd(character, { type, cause: type === 'death' ? 'battle wound' : 'monastic retirement', timestamp: '2026-08-02T00:00:00.000Z' });
  assert.equal(prepared.prepared, true);
  return resolveCareerEnd(prepared.character, { timestamp: '2026-08-02T00:00:01.000Z' });
};

test('LIFE-001', 'incapacitated, bedridden, deceased and retired remain distinct', () => {
  const incapacitated = resolveIncapacitation(makeCharacter(), { cause: 'temporary wound', timestamp: '2026-08-02T00:00:00.000Z' });
  assert.equal(incapacitated.character.campaign.lifecycle.careerStatus, 'incapacitated');
  assert.equal(incapacitated.character.family.members[0].status, '행동 불능');

  const bedriddenSource = makeCharacter();
  bedriddenSource.attributes.dex = 3;
  const bedridden = resolveAttributeLifecycle(bedriddenSource, { eventId: 'bedridden:test', timestamp: '2026-08-02T00:00:00.000Z' });
  assert.equal(bedridden.character.campaign.lifecycle.careerStatus, 'bedridden');
  assert.equal(bedridden.character.campaign.lifecycle.status, 'bedridden');
  assert.equal(bedridden.character.campaign.lifecycle.salvationEligibility, undefined);

  const death = endCareer(makeCharacter(), 'death');
  assert.equal(death.character.campaign.lifecycle.careerStatus, 'deceased');
  assert.equal(death.character.campaign.lifecycle.status, 'pending_salvation');
  assert.equal(death.character.family.members[0].status, '사망');
  assert.equal(death.character.campaign.lifecycle.activeCharacterId, null);

  const retirement = endCareer(makeCharacter(), 'retirement');
  assert.equal(retirement.character.campaign.lifecycle.careerStatus, 'retired');
  assert.equal(retirement.character.family.members[0].status, '은퇴');
  assert.equal(retirement.character.family.members[0].deathCause, undefined);
});

test('SAVE-IDEMP-001', 'career end and Salvation cannot apply twice', () => {
  const ended = endCareer(makeCharacter()).character;
  const duplicateEnd = resolveCareerEnd(ended);
  assert.equal(duplicateEnd.applied, false);
  let prepared = prepareSalvation(ended, { paladin: true });
  const first = resolveSalvation(prepared.character, { rawRoll: 10, timestamp: '2026-08-02T00:00:02.000Z' });
  const second = resolveSalvation(first.character, { rawRoll: 1, timestamp: '2026-08-02T00:00:03.000Z' });
  assert.equal(first.applied, true);
  assert.equal(second.applied, false);
  assert.equal(second.character.campaign.lifecycle.salvation.roll.rawResult, 10);
});

test('LIFE-SALVATION-001', 'Salvation ledger and destinations use the shared d20 result', () => {
  const ledger = calculateSalvationLedger(makeCharacter(), { paladin: true, holyWarOrReligiousRetirement: true, convertedPagans: 8, gmOther: 2, amorKey: 'amorIsabel' });
  assert.equal(ledger.baseStatistic, 10);
  assert.equal(ledger.passionTotal, 20);
  assert.equal(ledger.deedTotal, 17);
  assert.equal(ledger.finalStatistic, 47);
  assert.equal(ledger.deedBonuses.find(entry => entry.key === 'convertedPagans').bonus, 5);

  const low = makeCharacter();
  ['chaste', 'forgiving', 'merciful', 'modest', 'temperate', 'trusting'].forEach(key => { low.traits[key] = 1; });
  low.passions = { honor: 0, loveCharlemagne: 0, loveGod: 0 };
  const ended = endCareer(low).character;
  const prepared = prepareSalvation(ended, {}).character;
  const result = resolveSalvation(prepared, { rawRoll: 20 });
  assert.equal(result.salvation.roll.result, 'fumble');
  assert.equal(result.salvation.destination, 'hell');
  assert.equal(result.character.campaign.lifecycle.status, 'pending_successor');
});

test('LIFE-SAINT-001/LIFE-LEGACY-001', 'Canonization grants two transfers and one non-duplicated blessing roll', () => {
  const ended = endCareer(makeCharacter()).character;
  const prepared = prepareSalvation(ended, { paladin: true, holyWarOrReligiousRetirement: true, convertedPagans: 5 }).character;
  const salvation = resolveSalvation(prepared, { rawRoll: 10 }).character;
  assert.equal(salvation.campaign.lifecycle.salvation.roll.result, 'critical');
  assert.equal(salvation.campaign.lifecycle.salvation.canonization.eligible, true);
  const canonized = resolveCanonization(salvation, { rawRoll: 10 }).character;
  const legacy = canonized.campaign.lifecycle.legacy;
  assert.equal(legacy.scoreCaps.transferCount, 2);
  assert.equal(legacy.birthGiftGrant.count, 1);
  assert.equal(legacy.blessingGrant.count, 1);
  assert.equal(SAINT_BLESSINGS.length, 11);
  assert.deepEqual(SAINT_BLESSINGS.map(entry => entry.range), [[1, 3], [4, 4], [5, 5], [6, 8], [9, 11], [12, 13], [14, 14], [15, 15], [16, 17], [18, 19], [20, 20]]);
});

test('LIFE-NEWCHAR-001/LIFE-NEWFAMILY-001', 'same-family, new-family and prepared-second routes remain separate', () => {
  const ended = endCareer(makeCharacter()).character;
  const prepared = prepareSalvation(ended, { paladin: true }).character;
  const salvation = resolveSalvation(prepared, { rawRoll: 1 }).character;
  const legacy = salvation.campaign.lifecycle.legacy;
  const selectedIds = [legacy.transferableScores.find(entry => entry.id === 'traits.valorous').id];
  const resolvedLegacy = updateLegacyChoices(salvation, { selectedTransfers: selectedIds, selectedEquipmentIds: ['gear.personalGear'], equipmentDecisionRecorded: true, manorApproved: true, manorApprovalNote: 'GM approved' });
  assert.equal(resolvedLegacy.updated, true);
  const same = createSuccessorContext(resolvedLegacy.character, { mode: 'same_family', candidateId: 'bertram' });
  assert.equal(same.ok, true);
  assert.equal(same.context.candidate.age, 17);
  assert.equal(same.context.availableScoreTransfers.length, 1);
  assert.equal(same.context.inheritedEquipment.length, 1);

  let session = createCharacterCreationSession({ seed: 'same-family', existingFamily: same.context.family, successorContext: same.context, now: '2026-08-02T00:00:00.000Z' });
  session = updateCharacterCreationChoice(session, 'successorFatherClass', 'vassal', 'father');
  assert.equal(getCreationRollRequests(session, 'familyCharacteristic').length, 0);
  assert.equal(getCreationRollRequests(session, 'saint').length, 0);
  assert.equal(getCreationRollRequests(session, 'father').length, 0);
  assert.equal(session.modifierLog.some(entry => entry.ruleId === 'LIFE-NEWCHAR-001' && entry.targetKey === 'app' && entry.amount === 4), true);
  assert.equal(session.modifierLog.some(entry => entry.ruleId === 'LIFE-LEGACY-001' && entry.targetKey === 'valorous'), true);
  assert.equal(getCreationRollRequests(session, 'birthGift').filter(entry => entry.key.startsWith('gift.')).length, 3);

  const newFamily = createSuccessorContext(resolvedLegacy.character, { mode: 'new_family', gmApproved: true, gmApprovalNote: 'campaign choice' });
  assert.equal(newFamily.ok, true);
  assert.equal(newFamily.context.pendingLegacy, null);
  assert.equal(newFamily.context.family, null);

  const incapacitated = resolveIncapacitation(makeCharacter(), { cause: 'wound' }).character;
  const preparedSecond = createSuccessorContext(incapacitated, { mode: 'prepared_second', candidateId: 'bertram' });
  assert.equal(preparedSecond.ok, true);
  const secondSession = createCharacterCreationSession({ seed: 'prepared', existingFamily: preparedSecond.context.family, successorContext: preparedSecond.context });
  const started = beginSuccessorCreation(incapacitated, preparedSecond.context, secondSession);
  assert.equal(started.started, true);
  assert.equal(started.character.campaign.lifecycle.status, 'successor_in_creation');
  assert.equal(started.character.campaign.lifecycle.successor.mode, 'prepared_second');

  const bedridden = makeCharacter();
  bedridden.attributes.dex = 3;
  const bedriddenState = resolveAttributeLifecycle(bedridden, { eventId: 'bedridden:prepared-route' }).character;
  assert.equal(createSuccessorContext(bedriddenState, { mode: 'prepared_second', candidateId: 'bertram' }).ok, false);
});

test('LIFE-001/SAVE-IDEMP-001', 'prepared-second return requires recovery confirmation and preserves shared records', () => {
  const primary = resolveIncapacitation(makeCharacter(), { cause: 'temporary wound', timestamp: '2026-08-02T01:00:00.000Z' }).character;
  const prepared = structuredClone(primary);
  prepared.personal.name = 'Bertram';
  prepared.campaign.completedCreationIds = ['prepared:bertram'];
  prepared.campaign.preparedCharacter = {
    primaryCharacterSnapshot: structuredClone(primary),
    primaryCharacterId: 'adalhart',
    preparedCharacterId: 'bertram'
  };
  prepared.campaign.lifecycle = {
    ...prepared.campaign.lifecycle,
    status: 'active',
    careerStatus: 'active',
    activeRole: 'prepared_second',
    activeCharacterId: 'bertram',
    primaryCharacterId: 'adalhart'
  };
  prepared.family.members = prepared.family.members.map(member => member.id === 'adalhart'
    ? { ...member, relation: '주인공', status: '행동 불능', lifecycleStatus: 'incapacitated' }
    : { ...member, relation: '본인', status: '생존', lifecycleStatus: 'active' });
  prepared.journal['790'] = { text: 'Prepared character adventure record', updatedAt: '2026-08-02T01:05:00.000Z' };

  assert.equal(restorePrimaryCharacter(prepared).reason, 'recovery_confirmation_required');
  const restored = restorePrimaryCharacter(prepared, { recoveryConfirmed: true, timestamp: '2026-08-02T02:00:00.000Z' });
  assert.equal(restored.restored, true);
  assert.equal(restored.character.personal.name, 'Adalhart');
  assert.equal(restored.character.campaign.lifecycle.careerStatus, 'active');
  assert.equal(restored.character.campaign.lifecycle.activeCharacterId, 'adalhart');
  assert.equal(restored.character.campaign.preparedCharacter, null);
  assert.deepEqual(restored.character.campaign.completedCreationIds, ['prepared:bertram']);
  assert.match(restored.character.journal['790'].text, /Prepared character adventure record/);
  assert.equal(restored.character.campaign.lifecycle.events.at(-1).triggeringEvent, 'prepared_second_return');
  assert.equal(restored.character.family.members.find(member => member.id === 'adalhart').relation, '본인');
});

test('LIFE-NEWCHAR-001', 'inheritance copies usable equipment records, not predecessor Birth Gift grants', () => {
  const source = makeCharacter();
  source.gear.birthGifts = [{ path: 'gift.1', key: 'exceptionalWeapon', label: 'An exceptional weapon', weapon: 'sword' }];
  source.gear.conditionalModifiers = [{ skill: 'spear', amount: 1, condition: 'against pagans' }];
  const ended = endCareer(source).character;
  const salvation = resolveSalvation(prepareSalvation(ended, {}).character, { rawRoll: 1 }).character;
  const equipment = salvation.campaign.lifecycle.legacy.inheritableEquipment;
  assert.equal(equipment.some(item => item.id === 'gear.birthGifts'), false);
  assert.equal(equipment.some(item => item.id === 'gear.conditionalModifiers' && item.category === 'blessed_weapon'), true);
});

test('CHAR-KNIGHT-QUAL-001', 'successor age uses 15 rather than a fixed 18 gate', () => {
  const character = makeCharacter();
  character.family.members[1].birthYear = 775;
  character.family.members[1].lifeYears = '775~';
  const context = createSuccessorContext(resolveIncapacitation(character, { cause: 'wound' }).character, { mode: 'prepared_second', candidateId: 'bertram' });
  assert.equal(context.ok, true);
  assert.equal(context.context.candidate.age, 15);
});

test('SAVE-IMPORT-001', 'schema v4 migrates to v5 without manufacturing a blessing grant', () => {
  const defaults = makeCharacter();
  const old = structuredClone(defaults);
  old.campaign.schemaVersion = 4;
  old.campaign.salvation = { sourceCharacterId: 'adalhart', year: 790, score: 20, outcome: 'critical', canonized: true };
  old.campaign.legacy = { sourceCharacterId: 'adalhart', salvationScore: 20, transferSlots: 2, birthGiftRolls: 1, blessingRolls: 1 };
  delete old.campaign.lifecycle.salvation;
  delete old.campaign.lifecycle.legacy;
  const migrated = sanitizeCampaignState(old, defaults);
  assert.equal(migrated.campaign.schemaVersion, 5);
  assert.equal(migrated.campaign.lifecycle.legacy.blessingGrant.consumed, true);
  assert.equal(migrated.campaign.lifecycle.legacy.blessingGrant.count, 0);
});

test('I18N-KO-001', 'Korean is primary and English is retained as fallback', () => {
  const requiredKeys = [
    'common.save', 'common.resume', 'common.review', 'common.roll', 'common.manualRoll', 'common.unresolved', 'common.progress',
    'lifecycle.active', 'lifecycle.incapacitated', 'lifecycle.bedridden', 'lifecycle.deceased', 'lifecycle.retired',
    'lifecycle.pending_salvation', 'lifecycle.pending_legacy', 'lifecycle.pending_successor', 'lifecycle.successor_in_creation',
    'creation.core', 'creation.finalize', 'creation.steps.mode', 'creation.steps.review'
  ];
  setLocale('ko');
  assert.equal(t('lifecycle.active'), '활동 중');
  clearMissingTranslationKeys();
  requiredKeys.forEach(key => t(key, { current: 35 }));
  assert.deepEqual(getMissingTranslationKeys(), []);
  assert.equal(t('common.progress', { current: 35 }), '진행률 35%');
  setLocale('en');
  assert.equal(t('lifecycle.active'), 'Active');
  clearMissingTranslationKeys();
  requiredKeys.forEach(key => t(key, { current: 35 }));
  assert.deepEqual(getMissingTranslationKeys(), []);
  assert.equal(t('common.progress', { current: 35 }), 'Progress 35%');
  setLocale('ko');
  clearMissingTranslationKeys();
  assert.equal(t('missing.example'), 'missing.example');
  assert.deepEqual(getMissingTranslationKeys(), ['missing.example']);
});

console.log('lifecycle regression passed');

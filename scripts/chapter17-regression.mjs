import assert from 'node:assert/strict';
import {
  CHAPTER17_CULTURES,
  LEGENDARY_LANDS,
  MARKET_CATALOG,
  applyCultureAttributeModifiers,
  beginPrayerResolution,
  completeCharacterCreation,
  createCharacterCreationSession,
  getCultureEquipmentChoiceRequests,
  getEquippedMarketCombat,
  resolveCultureEquipment,
  resolveWinterStep,
  sanitizeCharacterCreationSession,
  startAdventure,
  startChapter7Combat,
  startSkirmish,
  updateCharacterCreationChoice,
  validateChapter17Registry,
  rollCharacterCreationStep
} from '../src/rules/index.js';
import { sanitizeCampaignState } from '../src/utils/campaignState.js';

const setChoice = (session, path, value, stepId) => updateCharacterCreationChoice(session, path, value, stepId);

const BASE_CHARACTER = {
  personal: { name: 'Legacy knight', age: 18, campaignYear: 767, maintenance: 'ordinary', features: [] },
  attributes: { siz: 10, dex: 10, str: 10, con: 10, app: 10, currentHp: 20 },
  traits: {}, skills: {}, skillsChecked: {}, traitsChecked: {},
  passions: { honor: 10, loveCharlemagne: 10, loveFamily: 10, loveGod: 10 }, passionsChecked: {},
  standings: {}, standingsChecked: {}, squire: { name: '', age: 0 },
  horses: { warhorse: { type: '', hp: 0, armor: 0 } },
  gear: { cash: 0, gloryThisGame: 0, gloryTotal: 0 },
  family: { name: '', members: [], ancestorRollLog: [], ancestorApplied: false },
  journal: {},
  campaign: {
    schemaVersion: 12,
    saveRevision: 0,
    completedCreationIds: [],
    appliedEvents: {},
    pendingEconomy: [],
    lifecycle: { status: 'active', events: [] },
    chronicleEvents: [], gloryLedger: [], standingLedger: [], familyTimeline: []
  }
};

const TABLE_17_1 = {
  basques: { siz: -1, dex: 0, str: 0, con: 1, app: 0 },
  bretons: { siz: -2, dex: 0, str: 0, con: 1, app: -1 },
  britons: { siz: 0, dex: 0, str: 0, con: 0, app: 0 },
  byzantines: { siz: -1, dex: 1, str: -1, con: 0, app: 1 },
  danes: { siz: 1, dex: -2, str: 1, con: 1, app: -2 },
  gascons: { siz: -1, dex: 1, str: -1, con: 0, app: 1 },
  huns: { siz: -2, dex: 0, str: 1, con: 1, app: -1 },
  jews: { siz: -1, dex: 0, str: -2, con: 0, app: 0 },
  lombards: { siz: 0, dex: 0, str: 0, con: 0, app: 0 },
  moors_saracens: { siz: -1, dex: 1, str: 0, con: 0, app: 0 },
  persians: { siz: -1, dex: 1, str: 0, con: 0, app: 1 },
  romans: { siz: -1, dex: 0, str: -1, con: 0, app: 1 },
  saxons_frisians: { siz: 1, dex: -1, str: 1, con: 0, app: -1 },
  slavs: { siz: -2, dex: 0, str: 0, con: 0, app: 0 },
  visigoths: { siz: -1, dex: 0, str: 0, con: 0, app: 0 }
};

const configureForeignSession = (culture, profile, suffix = '') => {
  let session = createCharacterCreationSession({
    seed: `chapter17-${culture.id}-${profile.id}-${suffix}`,
    now: '2026-08-12T00:00:00.000Z'
  });
  session = setChoice(session, 'cultureId', culture.id, 'mode');
  session = setChoice(session, 'name', `${culture.printedName} Test`, 'mode');
  session = setChoice(session, 'culturePermissionConfirmed', true, 'mode');

  const family = {
    name: `${culture.printedName} House`, motto: 'GM recorded motto', battleCry: 'GM recorded cry',
    ancestor: 'GM recorded ancestor', homeCounty: culture.homeland, greatNoble: 'GM recorded patron'
  };
  Object.entries(family).forEach(([key, value]) => { session = setChoice(session, `family.${key}`, value, 'family'); });
  session = setChoice(session, 'foreignFamilyConfirmed', true, 'family');
  session = setChoice(session, 'foreignFatherStatus', 'GM recorded household status', 'father');
  session = setChoice(session, 'foreignSonNumber', 1, 'sonNumber');
  session = setChoice(session, 'foreignEducation', 'GM recorded upbringing', 'pageEducation');
  session = setChoice(session, 'foreignHome', culture.homeland, 'cultureHomeland');
  session = setChoice(session, 'religionId', culture.defaultReligionId || culture.religionOptions[0], 'cultureHomeland');
  session = setChoice(session, 'cultureEquipmentProfileId', profile.id, 'cultureHomeland');
  getCultureEquipmentChoiceRequests(culture.id, profile.id).forEach(request => {
    session = setChoice(session, `cultureEquipmentChoices.${request.id}`, request.options[0], 'cultureHomeland');
  });
  session = setChoice(session, 'foreignPassions.loveGod', 10, 'passions');
  session = setChoice(session, 'foreignPassions.loveCharlemagne', 10, 'passions');
  session = setChoice(session, 'foreignPassions.honor', 10, 'passions');
  session = setChoice(session, 'foreignScoreAssignmentConfirmed', true, 'cultureHomeland');

  session = rollCharacterCreationStep(session, 'attributes');
  session = setChoice(session, 'attributeBonuses.siz', 3, 'attributes');
  session = setChoice(session, 'attributeBonuses.dex', 2, 'attributes');
  session = setChoice(session, 'featureMode', 'choose', 'feature');
  session = setChoice(session, 'featureCategory', 'hair', 'feature');
  session = setChoice(session, 'featureText', 'GM recorded distinctive feature', 'feature');
  session = setChoice(session, 'foreignStatusLabel', profile.label, 'squireYears');
  session = setChoice(session, 'foreignInitialGlory', 0, 'glory');
  session = setChoice(session, 'foreignGloryConfirmed', true, 'glory');
  session = setChoice(session, 'story', `${culture.printedName} character creation completed through the canonical Chapter 1 flow.`, 'review');
  return session;
};

const expectedAttribute = (session, key, culture) => (
  Number(session.rolls[`attribute.${key}`].modifiedResult) + Number(session.choices.attributeBonuses[key]) + Number(culture.attributeModifiers[key])
);

const registry = validateChapter17Registry();
assert.equal(registry.valid, true, registry.errors.join('\n'));
assert.equal(registry.cultureCount, 15);
assert.equal(registry.playableCultureCount, 15);
assert.equal(registry.referenceOnlyCount, 2);
assert.equal(registry.equipmentProfileCount, 36);
assert.equal(registry.tableCount, 1);
assert.deepEqual(registry.mountRegistryBoundaries, [{ cultureId: 'slavs', profileId: 'noble', mountId: 'pony', runtime: 'chapter12' }]);
assert.deepEqual(LEGENDARY_LANDS.map(entry => [entry.id, entry.playable]), [['ethiopia', false], ['cathay', false]]);
console.log('[CH17-SOURCE-001] 15 playable cultures, 36 source equipment profiles, one executable table, and two reference-only lands');

CHAPTER17_CULTURES.forEach(culture => {
  assert.deepEqual(culture.attributeModifiers, TABLE_17_1[culture.id], `${culture.id} Table 17-1 row`);
  const sample = { siz: 10, dex: 10, str: 10, con: 10, app: 10 };
  assert.deepEqual(applyCultureAttributeModifiers(sample, culture.id), Object.fromEntries(
    Object.keys(sample).map(key => [key, sample[key] + TABLE_17_1[culture.id][key]])
  ));
});
console.log('[CH17-ATTR-001] all Table 17-1 rows match the source transcription');

const completedByCulture = new Map();
for (const culture of CHAPTER17_CULTURES) {
  for (const profile of culture.equipmentProfiles) {
    const everyChoice = getCultureEquipmentChoiceRequests(culture.id, profile.id);
    everyChoice.forEach(request => request.options.forEach(option => {
      const choices = Object.fromEntries(everyChoice.map(entry => [entry.id, entry.id === request.id ? option : entry.options[0]]));
      const resolved = resolveCultureEquipment(culture.id, profile.id, choices);
      assert.equal(resolved.unresolved.length, 0, `${culture.id}/${profile.id}/${option}`);
      assert.ok(resolved.allMarketItemIds.includes(option));
      resolved.allMarketItemIds.forEach(id => assert.ok(MARKET_CATALOG.some(item => item.id === id), `missing Chapter 12 item ${id}`));
    }));

    const session = configureForeignSession(culture, profile);
    assert.equal(session.stepStates.review.canAdvance, true, `${culture.id}/${profile.id}: ${session.stepStates.review.issues.join('; ')}`);
    for (const key of ['siz', 'dex', 'str', 'con', 'app']) {
      assert.equal(session.draftCharacter.attributes[key], expectedAttribute(session, key, culture), `${culture.id}/${profile.id}/${key}`);
    }

    const saved = JSON.parse(JSON.stringify(session));
    const restored = sanitizeCharacterCreationSession(saved);
    assert.equal(restored.choices.cultureId, culture.id);
    assert.equal(restored.choices.cultureEquipmentProfileId, profile.id);
    assert.deepEqual(restored.draftCharacter.attributes, session.draftCharacter.attributes, `${culture.id}/${profile.id} save/reload modifier idempotency`);

    const result = completeCharacterCreation(structuredClone(BASE_CHARACTER), restored, '2026-08-12T00:30:00.000Z');
    assert.equal(result.completed, true, `${culture.id}/${profile.id}: ${result.issues?.join('; ')}`);
    assert.equal(result.character.personal.cultureId, culture.id);
    assert.equal(result.character.personal.cultureEquipmentProfileId, profile.id);
    assert.equal(result.character.personal.religionId, culture.defaultReligionId || culture.religionOptions[0]);
    assert.deepEqual(result.character.campaign.creationTrace.culture.attributeModifiers, culture.attributeModifiers);
    assert.ok(result.character.campaign.economy.transactions.some(entry => entry.type === 'starting_equipment'));
    const resolved = resolveCultureEquipment(culture.id, profile.id, restored.choices.cultureEquipmentChoices);
    assert.deepEqual(
      result.character.campaign.economy.equipment.map(entry => entry.marketItemId),
      resolved.allMarketItemIds,
      `${culture.id}/${profile.id} Chapter 12 inventory`
    );
    const combatLoadout = getEquippedMarketCombat(result.character);
    assert.ok(combatLoadout.itemIds.length > 0, `${culture.id}/${profile.id} Chapter 7 loadout`);
    if (culture.id === 'jews') {
      assert.equal(combatLoadout.weaponId, null);
      assert.equal(combatLoadout.missileWeaponId, null);
    }
    if (resolved.mountIds.length) {
      assert.equal(result.character.horses.canonicalMountIds[0], resolved.mountIds[0]);
      if (resolved.mountIds[0] === 'pony') {
        assert.equal(result.character.horses.warhorse.chapter18Id, null);
        assert.equal(result.character.horses.warhorse.marketItemId, 'pony');
        assert.equal(result.character.horses.warhorse.status, 'pending_combat_profile');
        assert.equal(result.character.horses.warhorse.currentHp, undefined);
      } else {
        assert.ok(result.character.horses.warhorse.currentHp > 0, `${culture.id}/${profile.id} Chapter 18 mount HP`);
      }
    }
    const duplicate = completeCharacterCreation(result.character, result.session, '2026-08-12T00:31:00.000Z');
    assert.equal(duplicate.duplicate, true);
    assert.equal(duplicate.character.campaign.economy.transactions.filter(entry => entry.type === 'starting_equipment').length, 1);
    const migrated = sanitizeCampaignState(result.character, BASE_CHARACTER);
    assert.equal(migrated.personal.cultureId, culture.id);
    assert.equal(migrated.personal.religionId, culture.defaultReligionId || culture.religionOptions[0]);
    completedByCulture.set(culture.id, result.character);
  }
}
assert.equal(completedByCulture.size, 15);
console.log('[CH17-CREATION-001/CH17-EQUIPMENT-001] all 15 cultures and all 36 profiles complete, reload, migrate, and bind to Chapters 7/12/18');

const christian = completedByCulture.get('britons');
const prayer = beginPrayerResolution(christian, {
  eligible: true,
  gmUsesTable: false,
  beneficiary: 'self_prayer',
  intention: 'Record a source-valid prayer request without inventing its narrative result.',
  transactionId: 'chapter17:religion:christian',
  now: '2026-08-12T01:00:00.000Z'
});
assert.equal(prayer.resolution.outcome, 'gm_narrative');
assert.throws(() => beginPrayerResolution(completedByCulture.get('danes'), {
  eligible: true, gmUsesTable: false, intention: 'Not eligible', transactionId: 'chapter17:religion:pagan'
}), /Christian/);
assert.throws(() => beginPrayerResolution(completedByCulture.get('jews'), {
  eligible: true, gmUsesTable: false, intention: 'Not eligible', transactionId: 'chapter17:religion:jewish'
}), /Christian/);
console.log('[CH17-RELIGION-001] culture religion is persisted and Chapter 9 prayer eligibility consumes it');

const basque = configureForeignSession(CHAPTER17_CULTURES[0], CHAPTER17_CULTURES[0].equipmentProfiles[0], 'contamination');
const dane = configureForeignSession(CHAPTER17_CULTURES[4], CHAPTER17_CULTURES[4].equipmentProfiles[0], 'contamination');
assert.notDeepEqual(basque.draftCharacter.attributes, dane.draftCharacter.attributes);
assert.deepEqual(sanitizeCharacterCreationSession(JSON.parse(JSON.stringify(basque))).draftCharacter.attributes, basque.draftCharacter.attributes);
assert.equal(basque.rollLog.some(entry => entry.key.startsWith('culture.') || entry.key.startsWith('homeland.')), false);
assert.equal(dane.rollLog.some(entry => entry.key.startsWith('culture.') || entry.key.startsWith('homeland.')), false);
console.log('[CH17-ISOLATION-001] culture switching and reload do not leak Frankish rolls or stack foreign modifiers');

for (const cultureId of ['britons', 'danes', 'huns', 'jews']) {
  const representative = completedByCulture.get(cultureId);
  const loadout = getEquippedMarketCombat(representative);
  const combat = startChapter7Combat(representative, {
    id: `chapter17:${cultureId}:combat`,
    player: {
      weaponId: loadout.weaponId,
      missileWeaponId: loadout.missileWeaponId,
      armor: loadout.armor ?? 0,
      armorType: loadout.armorType ?? 'none',
      armorDexModifier: loadout.armorDexModifier ?? 0,
      shield: loadout.shield ?? 0
    },
    opponents: [{ id: `chapter17:${cultureId}:opponent`, name: 'GM-selected opponent' }]
  }, '2026-08-12T02:00:00.000Z');
  assert.equal(combat.personal.cultureId, cultureId);
  assert.equal(combat.campaign.combat.status, 'active');
  if (cultureId === 'jews') {
    assert.equal(loadout.weaponId, null);
    assert.equal(loadout.missileWeaponId, null);
    assert.equal(combat.campaign.combat.player.weaponId, 'unarmed');
    assert.equal(combat.campaign.combat.player.missileWeaponId, null);
  }

  const skirmish = startSkirmish(representative, {
    id: `chapter17:${cultureId}:skirmish`,
    name: 'Culture integration skirmish',
    enemy: 'GM-selected enemy'
  }, '2026-08-12T02:01:00.000Z').character;
  assert.equal(skirmish.personal.cultureId, cultureId);
  assert.equal(skirmish.campaign.skirmish.status, 'active');

  const winter = resolveWinterStep(representative, {
    stepId: 'soloScenario',
    input: { choice: 'not_applicable' }
  }).character;
  assert.equal(winter.personal.cultureId, cultureId);
  assert.equal(winter.campaign.winter.steps.soloScenario, 'resolved');

  const adventure = startAdventure(representative, {
    id: `chapter17:${cultureId}:adventure`,
    adventureId: 'hunt'
  }, '2026-08-12T02:02:00.000Z').character;
  assert.equal(adventure.personal.cultureId, cultureId);
  assert.equal(adventure.campaign.adventures.active.status, 'active');
}
console.log('[CH17-CAMPAIGN-001] representative Christian, pagan, mounted-profile, and non-military cultures enter Chapters 7/8/19 and Winter without culture loss');

console.log('chapter 17 regression passed');

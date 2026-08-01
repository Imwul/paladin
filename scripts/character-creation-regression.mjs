/* global console, structuredClone */
import assert from 'node:assert/strict';
import {
  BIRTH_GIFTS,
  CHARACTER_CREATION_STEPS,
  DISTINCTIVE_FEATURES,
  FAMILY_CHARACTERISTICS_FEMALE,
  FAMILY_CHARACTERISTICS_MALE,
  FATHER_CLASSES,
  FATHER_SUBCLASSES,
  FRANKISH_SKILL_FORMULAS,
  PAGE_EDUCATIONS,
  PATRON_SAINTS,
  ROMANTIC_TRAITS,
  STARTING_OUTFITS,
  TRAIT_PAIRS,
  addCharacterCreationSquireYear,
  calculateCumulativeScoreGlory,
  completeCharacterCreation,
  createCharacterCreationSession,
  getCreationRollRequests,
  recordManualCharacterCreationRoll,
  rollCharacterCreationStep,
  sanitizeCharacterCreationSession,
  updateCharacterCreationChoice
} from '../src/rules/index.js';
import { sanitizeCampaignState } from '../src/utils/campaignState.js';

const test = (ruleId, name, assertion) => {
  assertion();
  console.log(`[${ruleId}] ${name}`);
};

const setChoice = (session, path, value, stepId) => updateCharacterCreationChoice(session, path, value, stepId);

const record = (session, stepId, key, rawRolls) => {
  const spec = getCreationRollRequests(session, stepId).find(entry => entry.key === key);
  assert.ok(spec, `missing roll request ${key} in ${stepId}`);
  return recordManualCharacterCreationRoll(session, spec, rawRolls);
};

const fillStep = (session, stepId, rawForSpec = () => null) => {
  let next = session;
  let guard = 0;
  while (guard < 100) {
    const pending = getCreationRollRequests(next, stepId);
    if (!pending.length) break;
    for (const spec of pending) {
      const parsedCount = Number(spec.notation.match(/^(\d*)d/)?.[1] || 1);
      const requested = rawForSpec(spec);
      const rolls = requested || Array(parsedCount).fill(spec.notation.includes('d20') ? 10 : 4);
      next = recordManualCharacterCreationRoll(next, spec, rolls);
    }
    guard += 1;
  }
  return next;
};

const configureIdentity = session => {
  let next = setChoice(session, 'name', 'Adalhart', 'mode');
  const family = {
    name: 'House of Ardennes',
    motto: 'Amore non timore',
    battleCry: 'Monjoie',
    ancestor: 'Arnulf',
    homeCounty: 'Ardennes',
    greatNoble: 'Count Ansegisel',
    directedTraits: '',
    directedPassions: ''
  };
  Object.entries(family).forEach(([key, value]) => { next = setChoice(next, `family.${key}`, value, 'family'); });
  return next;
};

const makeHappySession = () => {
  let session = configureIdentity(createCharacterCreationSession({
    seed: 'phase2-happy-path',
    now: '2026-08-01T00:00:00.000Z'
  }));
  session = record(session, 'familyCharacteristic', 'family.characteristic', [11]);
  session = record(session, 'saint', 'family.saint', [6]);
  session = fillStep(session, 'father', spec => {
    const rolls = {
      'father.class': [2],
      'father.survival': [1],
      'muster.old': [6],
      'muster.middle': [6],
      'muster.young': [6],
      'muster.men': [6, 6, 6],
      'family.honor': [6, 6],
      'family.standingCharlemagne': [6, 6],
      'family.standingChurch': [6, 6],
      'family.standingCommoners': [6, 6]
    };
    return rolls[spec.key];
  });
  session = setChoice(session, 'sonNumberMethod', 'first', 'sonNumber');
  session = record(session, 'pageEducation', 'page.education', [1]);
  session = fillStep(session, 'cultureHomeland', () => [1]);
  session = fillStep(session, 'attributes', () => [6, 6]);
  for (const key of ['siz', 'dex', 'str', 'con', 'app']) session = setChoice(session, `attributeBonuses.${key}`, 1, 'attributes');
  session = setChoice(session, 'featureText', 'A long red moustache', 'feature');
  session = record(session, 'feature', 'feature.category', [1]);
  session = fillStep(session, 'traits', () => [5, 5]);
  session = fillStep(session, 'passions', spec => spec.key === 'passion.loveCharlemagne' ? [6, 6] : [6]);
  session = fillStep(session, 'skills', spec => Array(Number(spec.notation.match(/^(\d*)d/)?.[1] || 1)).fill(6));
  const allocations = { awareness: 6, dancing: 6, falconry: 1, intrigue: 1, axe: 1, bludgeon: 1 };
  Object.entries(allocations).forEach(([key, value]) => { session = setChoice(session, `skillTraining.${key}`, value, 'skills'); });
  session = setChoice(session, 'story', 'Adalhart served Duke Thierry and earned his spurs in 767.', 'review');
  session = record(session, 'birthGift', 'gift.1', [3]);
  session = record(session, 'birthGift', 'gift.2', [8]);
  session = record(session, 'birthGift', 'gift.3', [17]);
  session = setChoice(session, 'relicTraits', { 'gift.2': 'chaste' }, 'birthGift');
  session = setChoice(session, 'exceptionalWeapons', { 'gift.3': 'axe' }, 'birthGift');
  session = fillStep(session, 'birthGift', () => [4]);
  return session;
};

const defaults = {
  personal: { name: 'Legacy knight', age: 18, campaignYear: 767, maintenance: 'ordinary', features: [] },
  attributes: { siz: 10, dex: 10, str: 10, con: 10, app: 10, currentHp: 20 },
  traits: Object.fromEntries(TRAIT_PAIRS.flatMap(([left, right]) => [[left, 10], [right, 10]])),
  skills: { sword: 10, stewardship: 10 },
  skillsChecked: {}, traitsChecked: {},
  passions: { honor: 10, loveCharlemagne: 10, loveFamily: 10, loveGod: 10 },
  passionsChecked: {},
  standings: { charlemagne: 10, liegeLord: 10, family: 10, retinue: 10, church: 10, commoners: 10 },
  standingsChecked: {},
  squire: { name: '', age: 15 },
  horses: { warhorse: { type: '', hp: 30, armor: 5 } },
  gear: { cash: 0, gloryThisGame: 0, gloryTotal: 1000 },
  family: { name: 'Legacy family', members: [], ancestorRollLog: [], ancestorApplied: false },
  journal: { 766: { text: 'Legacy record', updatedAt: '2026-01-01T00:00:00.000Z' } },
  campaign: { schemaVersion: 3, appliedEvents: {}, passionStates: [], winter: { year: 767, steps: {}, logs: [], unresolved: {} } }
};

test('CHAR-PERSONAL-001/CHAR-NAME-001', 'twenty source-ordered creation steps and one-name identity', () => {
  const session = createCharacterCreationSession({ seed: 'steps', now: '2026-08-01T00:00:00.000Z' });
  assert.equal(CHARACTER_CREATION_STEPS.length, 20);
  assert.deepEqual(CHARACTER_CREATION_STEPS.map(step => step.id), [
    'mode', 'family', 'familyCharacteristic', 'saint', 'father', 'sonNumber', 'pageEducation', 'cultureHomeland',
    'attributes', 'feature', 'traits', 'passions', 'standings', 'skills', 'squireYears', 'ideals', 'glory', 'outfit', 'birthGift', 'review'
  ]);
  assert.equal(session.draftCharacter.personal.campaignYear, 767);
  assert.equal(session.draftCharacter.personal.home, 'Bastogne');
  assert.equal(session.draftCharacter.personal.culture, 'Frankish');
});

test('RNG-001', 'seeded rolls are reproducible and manual rolls use the same record shape', () => {
  const a = rollCharacterCreationStep(createCharacterCreationSession({ seed: 'repeat', now: '2026-08-01T00:00:00.000Z' }), 'familyCharacteristic');
  const b = rollCharacterCreationStep(createCharacterCreationSession({ seed: 'repeat', now: '2026-08-01T00:00:00.000Z' }), 'familyCharacteristic');
  assert.deepEqual(a.rolls['family.characteristic'].rawResult, b.rolls['family.characteristic'].rawResult);
  const manualStart = createCharacterCreationSession({ seed: 'manual', now: '2026-08-01T00:00:00.000Z' });
  const manual = record(manualStart, 'familyCharacteristic', 'family.characteristic', a.rolls['family.characteristic'].rawResult);
  assert.equal(manual.rolls['family.characteristic'].modifiedResult, a.rolls['family.characteristic'].modifiedResult);
  assert.equal(manual.rolls['family.characteristic'].source, 'manual');
});

test('CHAR-FAMCHAR-M/F-001', 'every family-characteristic d20 result maps to the printed distribution', () => {
  for (const [profile, table] of [['male', FAMILY_CHARACTERISTICS_MALE], ['female', FAMILY_CHARACTERISTICS_FEMALE]]) {
    for (let roll = 1; roll <= 20; roll += 1) {
      let session = createCharacterCreationSession({ seed: `${profile}-${roll}`, now: '2026-08-01T00:00:00.000Z' });
      if (profile === 'female') {
        session = setChoice(session, 'gender', 'female', 'mode');
        session = setChoice(session, 'femaleGeneration', 'femaleSpecific', 'mode');
      }
      session = record(session, 'familyCharacteristic', 'family.characteristic', [roll]);
      const expected = table.find(entry => roll >= entry.range[0] && roll <= entry.range[1]);
      assert.equal(session.draftCharacter.family.characteristic.key, expected.key);
    }
  }
});

test('CHAR-SAINT-001/CHAR-PASSION-001', 'every saint maps exactly and St. Denis targets Love Charlemagne', () => {
  assert.equal(PATRON_SAINTS.length, 20);
  for (let roll = 1; roll <= 19; roll += 1) assert.equal(PATRON_SAINTS[roll - 1].roll, roll);
  assert.deepEqual(PATRON_SAINTS[4].effects, { passions: { loveCharlemagne: 2 } });
  assert.equal(PATRON_SAINTS[4].effects.passions.loveCharlemagne, 2);
  assert.equal(PATRON_SAINTS[4].effects.standings, undefined);
});

test('CHAR-FATHER-001/CHAR-FATHER-SURV-001', 'father class and subtable boundaries preserve all printed benefits', () => {
  assert.deepEqual(FATHER_CLASSES.map(entry => entry.range), [[1, 1], [2, 3], [4, 8], [9, 15], [16, 20]]);
  assert.deepEqual(FATHER_SUBCLASSES.map(entry => entry.range), [[1, 5], [6, 8], [9, 10], [11, 12], [13, 14], [15, 16], [17, 18], [19, 20]]);
  const lord = FATHER_SUBCLASSES[0];
  assert.equal(lord.glory, 400);
  assert.equal(lord.effects.traits.modest, -2);
  const mercenary = FATHER_CLASSES.at(-1);
  assert.equal(mercenary.effects.skills.sword, 3);
  assert.equal(mercenary.effects.traits.cruel, 3);
});

test('CHAR-SON-001/CHAR-PAGE-001', 'son numbers 1-6 and Page Education ranges/modifiers are retained', () => {
  assert.deepEqual(PAGE_EDUCATIONS.map(entry => entry.key), ['royalCourt', 'greatNobleCourt', 'greatMonastery', 'banneretCourt', 'knightManor', 'smallMonastery']);
  for (let roll = 1; roll <= 6; roll += 1) {
    let session = configureIdentity(createCharacterCreationSession({ seed: `son-${roll}`, now: '2026-08-01T00:00:00.000Z' }));
    session = record(session, 'familyCharacteristic', 'family.characteristic', [1]);
    session = record(session, 'saint', 'family.saint', [1]);
    session = fillStep(session, 'father', spec => spec.key === 'father.class' ? [2] : spec.notation.includes('d20') ? [1] : Array(Number(spec.notation.match(/^(\d*)d/)?.[1] || 1)).fill(2));
    session = setChoice(session, 'sonNumberMethod', 'roll', 'sonNumber');
    session = record(session, 'sonNumber', 'sonNumber.order', [roll]);
    assert.equal(session.draftCharacter.personal.sonNumber, roll);
  }
});

test('CHAR-ATTR-001/CHAR-DERIVED-001', 'five 2d6+3 attributes require exactly five allocated points and derive once', () => {
  let session = createCharacterCreationSession({ seed: 'attributes', now: '2026-08-01T00:00:00.000Z' });
  session = fillStep(session, 'attributes', () => [3, 4]);
  assert.equal(session.stepStates.attributes.canAdvance, false);
  for (const key of ['siz', 'dex', 'str', 'con', 'app']) session = setChoice(session, `attributeBonuses.${key}`, 1, 'attributes');
  assert.equal(session.stepStates.attributes.canAdvance, true);
  assert.deepEqual(session.draftCharacter.attributes, { siz: 11, dex: 11, str: 11, con: 11, app: 11, currentHp: 22 });
  assert.equal(session.draftCharacter.derived.damage, 4);
  assert.equal(session.draftCharacter.derived.unconscious, 6);
  session = setChoice(session, 'attributeBonuses.siz', 4, 'attributes');
  assert.equal(session.stepStates.attributes.canAdvance, false);
});

test('CHAR-FEATURE-001', 'every d6 maps to one printed feature category while prose remains player-authored', () => {
  assert.equal(DISTINCTIVE_FEATURES.length, 6);
  for (let roll = 1; roll <= 6; roll += 1) {
    let session = createCharacterCreationSession({ seed: `feature-${roll}`, now: '2026-08-01T00:00:00.000Z' });
    session = setChoice(session, 'featureText', `Player description ${roll}`, 'feature');
    session = record(session, 'feature', 'feature.category', [roll]);
    assert.equal(session.draftCharacter.distinctiveFeature.category, DISTINCTIVE_FEATURES[roll - 1].key);
    assert.equal(session.draftCharacter.personal.features[0], `Player description ${roll}`);
  }
});

test('CHAR-CULTURE-001/CHAR-HOMELAND-001/CHAR-TRAIT-001', 'seven d3 modifiers affect only their named side of twelve opposed pairs', () => {
  const session = makeHappySession();
  assert.equal(TRAIT_PAIRS.length, 12);
  assert.equal(Object.hasOwn(session.draftCharacter.traits, 'pious'), false);
  TRAIT_PAIRS.forEach(([left, right]) => {
    const leftValue = session.draftCharacter.traits[left];
    const rightValue = session.draftCharacter.traits[right];
    assert.ok(leftValue > 19 ? rightValue === 0 : leftValue + rightValue === 20);
  });
  const suspiciousLog = session.modifierLog.find(entry => entry.sourceLabel === 'Ardennes homeland' && entry.targetKey === 'suspicious');
  assert.equal(suspiciousLog.targetKey, 'suspicious');
});

test('CHAR-PASSION-001/CHAR-STANDING-001', 'core characters have four formula-based passions and six derived Standings', () => {
  const draft = makeHappySession().draftCharacter;
  assert.deepEqual(Object.keys(draft.passions).sort(), ['honor', 'loveCharlemagne', 'loveFamily', 'loveGod'].sort());
  assert.deepEqual(Object.keys(draft.standings).sort(), ['charlemagne', 'church', 'commoners', 'family', 'liegeLord', 'retinue'].sort());
  assert.equal(draft.standings.family, draft.passions.honor);
  assert.equal(draft.standings.church, draft.passions.loveGod);
  assert.equal(draft.standings.commoners, draft.traits.merciful);
});

test('CHAR-SKILL-M/F-001', 'male and female skill tables retain every printed formula', () => {
  assert.equal(Object.keys(FRANKISH_SKILL_FORMULAS.male).length, 36);
  assert.equal(Object.keys(FRANKISH_SKILL_FORMULAS.female).length, 36);
  assert.equal(FRANKISH_SKILL_FORMULAS.male.chirurgery, 0);
  assert.equal(FRANKISH_SKILL_FORMULAS.female.chirurgery, '2d6');
  assert.equal(FRANKISH_SKILL_FORMULAS.male.siege, '1d6+3');
  assert.equal(FRANKISH_SKILL_FORMULAS.female.siege, '1d6');
  assert.equal(FRANKISH_SKILL_FORMULAS.female.romance, '1d6+3');
});

test('CHAR-SKILL-ORDER-001', 'skill cap order is base/father/page/homeland, cap 15, training, family/saint cap 20', () => {
  const session = makeHappySession();
  assert.equal(session.draftCharacter.skills.courtesy, 20);
  assert.equal(session.draftCharacter.skills.firstAid, 20);
  const preTrainingCap = session.modifierLog.find(entry => entry.targetKey === 'hunting' && entry.sourceLabel === 'Pre-training creation cap');
  const familyCourtesy = session.modifierLog.find(entry => entry.targetKey === 'courtesy' && entry.sourceLabel.startsWith('Family characteristic'));
  assert.ok(preTrainingCap);
  assert.equal(familyCourtesy.cap, 20);
  assert.ok(session.modifierLog.indexOf(preTrainingCap) < session.modifierLog.indexOf(familyCourtesy));
});

test('CHAR-KNIGHT-QUAL-001', 'squire-year benefits are two distinct types and stop immediately on qualification', () => {
  const qualified = makeHappySession();
  assert.equal(qualified.draftCharacter.qualification.qualified, true);
  assert.equal(addCharacterCreationSquireYear(qualified, { categories: ['attribute', 'score'], attributeKey: 'str', scoreGroup: 'passions', scoreKey: 'honor' }).added, false);
  let low = createCharacterCreationSession({ seed: 'squire-year', now: '2026-08-01T00:00:00.000Z' });
  low = fillStep(low, 'attributes', () => [1, 1]);
  low = fillStep(low, 'traits', () => [1, 1]);
  const result = addCharacterCreationSquireYear(low, { categories: ['attribute', 'score'], attributeKey: 'str', scoreGroup: 'passions', scoreKey: 'honor' });
  assert.equal(result.added, true);
  assert.equal(result.session.draftCharacter.personal.age, 16);
  assert.equal(result.session.draftCharacter.squireYearHistory[0].changes.length, 2);
});

test('CHAR-IDEAL-001', 'ideal eligibility uses only the printed trait totals and associated Passion', () => {
  let session = makeHappySession();
  session = setChoice(session, 'romanticPassionValue', 16, 'ideals');
  const romantic = session.draftCharacter.ideals.romantic;
  assert.equal(ROMANTIC_TRAITS.join(','), 'forgiving,generous,honest,just,prudent,trusting');
  assert.equal(romantic.eligible, romantic.traitTotal >= 90 && romantic.passionValue >= 16);
  assert.equal(Object.hasOwn(romantic, 'skillRequirement'), false);
});

test('CHAR-GLORY-001', 'initial Glory uses cumulative triangular score awards and a source ledger', () => {
  assert.equal(calculateCumulativeScoreGlory(15), 0);
  assert.equal(calculateCumulativeScoreGlory(16), 16);
  assert.equal(calculateCumulativeScoreGlory(19), 70);
  const draft = makeHappySession().draftCharacter;
  assert.ok(draft.gloryLedger.some(entry => entry.sourceLabel === 'Knighthood' && entry.amount === 1000));
  assert.ok(draft.gloryLedger.some(entry => entry.sourceLabel.startsWith('Father class:') && entry.amount === 300));
  assert.ok(draft.gloryLedger.every(entry => entry.sourceRuleId && entry.calculation && entry.appliedAtStep && entry.sourcePage));
  assert.equal(draft.gloryTotal, draft.gloryLedger.reduce((total, entry) => total + entry.amount, 0));
});

test('CHAR-OUTFIT-001/CHAR-GIFT-001', 'outfit, conditional blessed weapons, relic choice, and exceptional weapon are distinct', () => {
  const draft = makeHappySession().draftCharacter;
  assert.deepEqual(Object.keys(STARTING_OUTFITS).map(Number), [1, 2, 3, 4, 5, 6]);
  Object.values(STARTING_OUTFITS).forEach(outfit => {
    assert.ok(outfit.armorByPhase && Object.keys(outfit.armorByPhase).length === 5);
    assert.ok(Array.isArray(outfit.weapons) && outfit.weapons.length > 0);
    assert.ok(outfit.horses && Number.isFinite(outfit.cash));
  });
  assert.equal(draft.outfit.rank, 3);
  assert.equal(draft.outfit.armor, 'Ring mail');
  assert.equal(BIRTH_GIFTS.length, 16);
  for (let roll = 1; roll <= 20; roll += 1) assert.ok(BIRTH_GIFTS.find(entry => roll >= entry.range[0] && roll <= entry.range[1]));
  assert.ok(draft.gearExtras.conditionalModifiers.some(entry => entry.skill === 'spear' && entry.condition === 'against pagans'));
  assert.equal(draft.gifts.entries.find(entry => entry.key === 'sacredRelic').religiousTrait, 'chaste');
  assert.equal(draft.gifts.entries.find(entry => entry.key === 'exceptionalWeapon').weapon, 'axe');
});

test('CHAR-GIFT-001', 'result 19 ignores nested 19 and duplicate outfit upgrades reroll', () => {
  let session = configureIdentity(createCharacterCreationSession({ seed: 'nested-gifts', now: '2026-08-01T00:00:00.000Z' }));
  session = record(session, 'familyCharacteristic', 'family.characteristic', [1]);
  session = record(session, 'saint', 'family.saint', [1]);
  session = fillStep(session, 'father', spec => spec.key === 'father.class' ? [2] : spec.notation.includes('d20') ? [1] : Array(Number(spec.notation.match(/^(\d*)d/)?.[1] || 1)).fill(2));
  session = record(session, 'birthGift', 'gift.1', [19]);
  session = record(session, 'birthGift', 'gift.2', [15]);
  session = record(session, 'birthGift', 'gift.3', [15]);
  session = record(session, 'birthGift', 'gift.1.a', [19]);
  session = record(session, 'birthGift', 'gift.1.b', [4]);
  session = record(session, 'birthGift', 'gift.1.a.ignore19', [12]);
  session = record(session, 'birthGift', 'gift.3.duplicate15', [13]);
  assert.equal(session.draftCharacter.gifts.outfitUpgrades, 1);
  assert.ok(session.draftCharacter.gifts.entries.some(entry => entry.key === 'moneyThree'));
  assert.ok(session.draftCharacter.gifts.entries.some(entry => entry.key === 'extraCharger'));
});

test('CHAR-STORY-001/SAVE-MIG-001', 'in-progress sessions survive schema migration and completion is atomic/idempotent', () => {
  const session = makeHappySession();
  assert.equal(session.stepStates.review.canAdvance, true, session.stepStates.review.issues.join('; '));
  const restored = sanitizeCharacterCreationSession(JSON.parse(JSON.stringify(session)));
  assert.equal(restored.seed, session.seed);
  assert.deepEqual(restored.rollLog.map(entry => entry.rawResult), session.rollLog.map(entry => entry.rawResult));
  const first = completeCharacterCreation(structuredClone(defaults), restored, '2026-08-01T12:00:00.000Z');
  assert.equal(first.completed, true);
  assert.equal(first.character.personal.name, 'Adalhart');
  assert.equal(first.character.family.members.some(member => member.relation === '본인'), true);
  assert.equal(first.character.family.patronSaintBenefit, 'skills.firstAid +5');
  assert.equal(first.character.journal[766].text, 'Legacy record');
  assert.equal(first.character.journal[767].text.includes('earned his spurs'), true);
  assert.equal(first.character.campaign.schemaVersion, 5);
  const duplicate = completeCharacterCreation(first.character, first.session, '2026-08-01T12:01:00.000Z');
  assert.equal(duplicate.completed, false);
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.character.campaign.completedCreationIds.length, 1);
  const migrated = sanitizeCampaignState(first.character, defaults);
  assert.equal(migrated.campaign.schemaVersion, 5);
  assert.equal(migrated.campaign.characterCreationSession.status, 'completed');
  const repaired = sanitizeCampaignState({
    ...first.character,
    family: { ...first.character.family, patronSaintBenefit: { traits: { chaste: 3 } } }
  }, defaults);
  assert.equal(repaired.family.patronSaintBenefit, 'traits.chaste +3');
});

test('CHAR-SON-001/CHAR-PAGE-001/CHAR-OUTFIT-001', 'earlier choices recalculate only dependent downstream results', () => {
  let session = makeHappySession();
  const pageAtOne = session.draftCharacter.pageEducation.modifiedRoll;
  const outfitAtOne = session.draftCharacter.outfit.rank;
  session = setChoice(session, 'sonNumberMethod', 'roll', 'sonNumber');
  session = record(session, 'sonNumber', 'sonNumber.order', [2]);
  assert.equal(session.draftCharacter.pageEducation.modifiedRoll, pageAtOne + 1);
  assert.equal(session.draftCharacter.outfit.rank, outfitAtOne - 1);
  assert.equal(session.draftCharacter.passions.loveFamily, 14);
  assert.ok(session.invalidationLog.some(entry => entry.fromStep === 'sonNumber'));
});

console.log('character creation regression passed');

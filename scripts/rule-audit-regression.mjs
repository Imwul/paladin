import assert from 'node:assert/strict';
import {
  adjustOpposedTrait,
  applyDeferredExperienceAdjustments,
  applyStatisticModifiers,
  calculateMovementRate,
  compareOpposedD20,
  createFrankishArdennesTraits,
  createFrankishMaleBaseSkills,
  createReflexiveModifier,
  deriveStartingPassions,
  deriveStartingStandings,
  getAgingRollCount,
  getAttributeCareerStatus,
  getCampaignPhase,
  getHarvestModifier,
  getLineageEra,
  getSuccessorEligibility,
  getsAutomaticExperienceCheck,
  getTravelDistance,
  parseDiceNotation,
  resolveD20Roll,
  resolveExperienceChecks,
  resolveExperienceRoll,
  resolveFeatRoll,
  resolveForcedMarch,
  resolveHarvest,
  resolveOpposedD20,
  resolveTraitExperienceChecks,
  resolveUnknownRoute,
  rollD3,
  rollDiceNotation,
  roundPaladin,
  TRAIT_PAIRS
} from '../src/rules/index.js';
import { sanitizeCampaignState } from '../src/utils/campaignState.js';

const test = (ruleId, name, assertion) => {
  assertion();
  console.log(`[${ruleId}] ${name}`);
};

test('CORE-RES-001', 'ordinary d20 boundaries', () => {
  assert.equal(resolveD20Roll(1, 10).outcome, 'success');
  assert.equal(resolveD20Roll(10, 10).outcome, 'critical');
  assert.equal(resolveD20Roll(11, 10).outcome, 'failure');
  assert.equal(resolveD20Roll(20, 10).outcome, 'fumble');
  assert.equal(resolveD20Roll(1, 1).outcome, 'critical');
  assert.equal(resolveD20Roll(20, 20).outcome, 'critical');
});

test('CORE-RES-002', 'heroic values above 20', () => {
  assert.equal(resolveD20Roll(17, 22).outcome, 'success');
  assert.equal(resolveD20Roll(18, 22).outcome, 'critical');
  assert.equal(resolveD20Roll(20, 22).effectiveRoll, 22);
});

test('CORE-RES-003', 'zero and negative values', () => {
  assert.equal(resolveD20Roll(19, 0).outcome, 'failure');
  assert.equal(resolveD20Roll(20, 0).outcome, 'fumble');
  assert.equal(resolveD20Roll(15, -4).outcome, 'failure');
  assert.equal(resolveD20Roll(16, -4).outcome, 'fumble');
});

test('CORE-RES-004', 'opposed roll ordering', () => {
  assert.equal(compareOpposedD20(resolveD20Roll(8, 10), resolveD20Roll(6, 10)), 'actor');
  assert.equal(compareOpposedD20(resolveD20Roll(10, 10), resolveD20Roll(9, 10)), 'actor');
  assert.equal(compareOpposedD20(resolveD20Roll(12, 10), resolveD20Roll(20, 10)), 'bothFail');
});

test('INTRO-DICE-001', 'printed dice notation and d3 conversion', () => {
  assert.deepEqual(parseDiceNotation('5d6+150'), { notation: '5d6+150', count: 5, sides: 6, modifier: 150 });
  const values = [0, 0.999];
  const result = rollDiceNotation('2d3+1', () => values.shift());
  assert.deepEqual(result.rawRolls, [1, 6]);
  assert.deepEqual(result.rolls, [1, 3]);
  assert.equal(result.total, 5);
  assert.equal(rollD3(() => 0.5), 2);
});

test('CORE-RES-001', 'invalid physical d20 results are rejected', () => {
  assert.throws(() => resolveD20Roll(0, 10), RangeError);
  assert.throws(() => resolveD20Roll(21, 10), RangeError);
  assert.throws(() => resolveD20Roll(10, Number.NaN), TypeError);
});

test('CORE-OPPOSED-001', 'highest successful modified roll wins and loser may be partial', () => {
  const lowerCritical = resolveD20Roll(10, 10);
  const higherSuccess = resolveD20Roll(15, 20);
  const result = resolveOpposedD20(lowerCritical, higherSuccess);
  assert.equal(result.winner, 'opponent');
  assert.equal(result.actorOutcome, 'partial');
  assert.equal(result.opponentOutcome, 'win');
  assert.equal(resolveOpposedD20(resolveD20Roll(8, 10), resolveD20Roll(8, 12)).winner, 'tie');
});

test('CORE-MOD-001', 'statistic and reflexive modifiers are applied before resolution', () => {
  assert.equal(applyStatisticModifiers(15, [-5, 2]), 12);
  assert.deepEqual(createReflexiveModifier(5), { actor: 5, opponent: -5 });
  assert.equal(resolveD20Roll(18, applyStatisticModifiers(20, 2)).outcome, 'critical');
});

test('CORE-FEAT-001', 'feat halves the statistic and yields only critical or fumble', () => {
  assert.equal(resolveFeatRoll(6, 15).featTarget, 8);
  assert.equal(resolveFeatRoll(6, 15).outcome, 'critical');
  assert.equal(resolveFeatRoll(9, 15).outcome, 'fumble');
});

test('CORE-MOVE-001', 'movement, travel, unknown route and forced march tables', () => {
  assert.equal(calculateMovementRate({ str: 10, dex: 15 }), 3);
  assert.equal(calculateMovementRate({ str: 10, dex: 15, creature: 'quadruped', unencumbered: true }), 7);
  assert.equal(getTravelDistance('royalRoad', 'normal'), 20);
  assert.equal(getTravelDistance('track', 'hurried'), 4);
  assert.deepEqual(resolveUnknownRoute('success'), { pace: 'leisurely', delayDays: 0, lost: false });
  const march = resolveForcedMarch({ roll: 20, con: 10, movementRate: 9, roadType: 'royalRoad', rng: () => 0 });
  assert.equal(march.attemptedDistance, 57);
  assert.equal(march.distance, 28.5);
  assert.equal(march.mustRest, true);
  assert.equal(march.damage, 2);
});

test('CORE-XP-002', 'experience succeeds on equal-or-higher and has no score-20 cap', () => {
  assert.equal(resolveExperienceRoll(10, 10).nextValue, 11);
  assert.equal(resolveExperienceRoll(9, 10).nextValue, 10);
  assert.equal(resolveExperienceRoll(20, 22).nextValue, 23);
  assert.equal(getsAutomaticExperienceCheck(20), true);
  const result = resolveExperienceChecks({ values: { sword: 20, hunting: 10 }, checked: {}, rng: () => 0.999 });
  assert.equal(result.values.sword, 21);
  assert.equal(result.results.some(entry => entry.key === 'hunting'), false);
  assert.equal(applyDeferredExperienceAdjustments(resolveExperienceRoll(10, 10), [-1]).nextValue, 10);
});

test('TRAIT-PAIR-001', 'heroic trait values keep the opposed trait at zero', () => {
  assert.equal(TRAIT_PAIRS.length, 12);
  assert.equal(TRAIT_PAIRS.flat().includes('pious'), false);
  const legacyCheck = resolveTraitExperienceChecks({ traits: { pious: 20 }, checked: { pious: true }, rng: () => 0.999 });
  assert.equal(legacyCheck.results.some(result => result.key === 'pious'), false);
  const heroic = adjustOpposedTrait({ valorous: 19, cowardly: 1 }, 'valorous', 1);
  assert.deepEqual(heroic, { valorous: 20, cowardly: 0 });
  assert.deepEqual(adjustOpposedTrait(heroic, 'valorous', 1), { valorous: 21, cowardly: 0 });
});

test('CORE-MATH-001', 'Paladin half-up rounding', () => {
  assert.equal(roundPaladin(2.49), 2);
  assert.equal(roundPaladin(2.5), 3);
  assert.equal(roundPaladin(25 / 6), 4);
});

test('ERA-001', 'campaign phase boundaries', () => {
  const expected = new Map([
    [742, 0], [767, 0], [768, 1], [778, 1], [779, 2], [789, 2],
    [790, 3], [800, 3], [801, 4], [814, 4]
  ]);
  expected.forEach((phase, year) => assert.equal(getCampaignPhase(year)?.number, phase));
  assert.equal(getCampaignPhase(741), null);
  assert.equal(getCampaignPhase(815), null);
});

test('ERA-002', 'lineage era boundaries', () => {
  assert.equal(getLineageEra(723), 'grandfather');
  assert.equal(getLineageEra(744), 'grandfather');
  assert.equal(getLineageEra(745), 'father');
  assert.equal(getLineageEra(766), 'father');
  assert.equal(getLineageEra(767), 'player');
});

test('SUCCESSION-001', 'successor procedure starts at age 15, not 18', () => {
  assert.deepEqual(getSuccessorEligibility({ birthYear: 752, currentYear: 767 }), {
    eligible: true,
    age: 15,
    reason: 'eligible'
  });
  assert.equal(getSuccessorEligibility({ birthYear: 753, currentYear: 767 }).eligible, false);
  assert.equal(getSuccessorEligibility({ birthYear: '', currentYear: 767 }).reason, 'unknown_age');
});

test('WIN-AGE-001', 'aging table and career end', () => {
  assert.deepEqual([1, 2, 4, 7, 12, 16].map(getAgingRollCount), [5, 4, 3, 2, 1, 0]);
  assert.equal(getAttributeCareerStatus({ siz: 4, dex: 4, str: 4, con: 4, app: 4 }), 'active');
  assert.equal(getAttributeCareerStatus({ siz: 3, dex: 4, str: 4, con: 4, app: 4 }), 'bedridden');
  assert.equal(getAttributeCareerStatus({ siz: 0, dex: 4, str: 4, con: 4, app: 4 }), 'deceased');
});

test('WIN-ECO-001', 'harvest modifiers and income table', () => {
  assert.equal(getHarvestModifier({ year: 779, standings: { commoners: 16, retinue: 4 }, prosperity: true }), 5);
  assert.equal(resolveHarvest({ roll: 10, stewardship: 8, modifier: 2, manors: 2 }).income, 18);
  assert.equal(resolveHarvest({ roll: 3, stewardship: 8, modifier: 2, manors: 2 }).income, 12);
  assert.equal(resolveHarvest({ roll: 11, stewardship: 8, modifier: 2, manors: 2 }).income, 10);
  assert.equal(resolveHarvest({ roll: 20, stewardship: 8, modifier: 2, manors: 2 }).income, 6);
});

test('CC-PASSION-001', 'starting passions and standings', () => {
  const traits = {
    chaste: 12, forgiving: 13, merciful: 14, modest: 11, temperate: 15, trusting: 10,
    energetic: 9, generous: 13, just: 14, valorous: 16
  };
  const passions = deriveStartingPassions({
    traits,
    sonNumber: 2,
    loveCharlemagneRoll: 11,
    loveFamilyRoll: 5
  });
  assert.deepEqual(passions, { honor: 14, loveCharlemagne: 11, loveFamily: 13, loveGod: 10 });
  assert.deepEqual(deriveStartingStandings({ traits, passions }), {
    charlemagne: 9,
    liegeLord: 16,
    family: 14,
    retinue: 13,
    church: 10,
    commoners: 14
  });
});

test('CC-BASE-001', 'Frankish male skills and Ardennes traits use source dice formulas', () => {
  const minimumSkills = createFrankishMaleBaseSkills({ dex: 5, rng: () => 0 });
  assert.equal(minimumSkills.awareness, 4);
  assert.equal(minimumSkills.firstAid, 5);
  assert.equal(minimumSkills.horsemanship, 5);
  assert.equal(minimumSkills.bow, 3);
  assert.equal(minimumSkills.sword, 5);
  const minimumTraits = createFrankishArdennesTraits(() => 0);
  assert.equal(minimumTraits.energetic, 6);
  assert.equal(minimumTraits.modest, 7);
  assert.equal(minimumTraits.trusting, 5);
  assert.equal(minimumTraits.suspicious, 15);
  assert.equal(Object.hasOwn(minimumTraits, 'pious'), false);
});

const defaults = {
  personal: { name: '기본 기사', age: 18, campaignYear: 767, maintenance: 'ordinary', features: [] },
  attributes: { siz: 10, dex: 10, str: 10, con: 10, app: 10, currentHp: 20 },
  traits: {
    chaste: 10, lustful: 10, energetic: 10, lazy: 10, forgiving: 10, vengeful: 10,
    generous: 10, selfish: 10, honest: 10, deceitful: 10, just: 10, arbitrary: 10,
    merciful: 10, cruel: 10, modest: 10, proud: 10, prudent: 10, reckless: 10,
    temperate: 10, indulgent: 10, trusting: 10, suspicious: 10, valorous: 10, cowardly: 10
  },
  skills: { sword: 10, stewardship: 10 },
  skillsChecked: {},
  traitsChecked: {},
  passions: { honor: 10, loveCharlemagne: 10, loveFamily: 10, loveGod: 10 },
  passionsChecked: {},
  standings: { charlemagne: 10, liegeLord: 10, family: 10, retinue: 10, church: 10, commoners: 10 },
  standingsChecked: {},
  squire: { name: '종자', age: 14 },
  horses: { warhorse: { hp: 30, armor: 5 } },
  gear: { cash: 0, gloryThisGame: 0, gloryTotal: 1000 },
  family: { members: [], ancestorRollLog: [], ancestorApplied: false },
  journal: {},
  campaign: { schemaVersion: 3, appliedEvents: {}, passionStates: [], winter: { year: 767, steps: {}, logs: [], unresolved: {} } }
};

test('SAVE-MIG-001', 'legacy passions and winter economy migrate', () => {
  const oldSave = structuredClone(defaults);
  oldSave.passions = { honor: 12, loyaltyLiege: 17, loveFamily: 13, loveGod: 11 };
  oldSave.campaign.schemaVersion = 2;
  oldSave.campaign.winter.harvestModifier = -3;
  oldSave.campaign.winter.economy = { grossIncome: 18, stewardshipTarget: 12, stewardshipModifier: 2, treasuryDelta: -4, maintenancePending: true };
  const migrated = sanitizeCampaignState(oldSave, defaults);
  assert.equal(migrated.passions.loveCharlemagne, 17);
  assert.equal(migrated.campaign.schemaVersion, 10);
  assert.equal(migrated.campaign.winter.harvestModifier, -3);
  assert.deepEqual(migrated.campaign.winter.economy, oldSave.campaign.winter.economy);
});

test('SAVE-LIFE-001', 'dead characters stay dead', () => {
  const deadSave = structuredClone(defaults);
  deadSave.attributes.siz = 0;
  deadSave.attributes.currentHp = 0;
  deadSave.family.members = [
    { id: 'old_self', name: '전임 기사', relation: '본인', status: '사망', generation: 3, lifeYears: '730~767' },
    { id: 'heir', name: '후계자', relation: '자녀', status: '생존', generation: 4, lifeYears: '752~' }
  ];
  const migrated = sanitizeCampaignState(deadSave, defaults);
  assert.equal(migrated.attributes.siz, 0);
  assert.equal(migrated.campaign.lifecycle.careerStatus, 'deceased');
  assert.equal(migrated.campaign.lifecycle.activeCharacterId, null);
  assert.equal(migrated.campaign.health.pendingDeath, null);
  assert.equal(migrated.family.members.some(member => member.relation === '본인' && member.status === '생존'), false);
});

test('SAVE-LIFE-002', 'pending succession cannot reactivate a living predecessor', () => {
  const pendingSave = structuredClone(defaults);
  pendingSave.family.members = [
    { id: 'old_self', name: '전임 기사', relation: '본인', status: '생존', generation: 3, lifeYears: '749~' },
    { id: 'heir', name: '후계자', relation: '자녀', status: '생존', generation: 4, lifeYears: '752~' }
  ];
  pendingSave.campaign.lifecycle = {
    careerStatus: 'pending_succession',
    activeCharacterId: null,
    pendingSuccession: true
  };
  const migrated = sanitizeCampaignState(pendingSave, defaults);
  assert.equal(migrated.campaign.lifecycle.careerStatus, 'historical');
  assert.equal(migrated.campaign.lifecycle.status, 'pending_successor');
  assert.equal(migrated.campaign.lifecycle.activeCharacterId, null);
});

test('SAVE-HEROIC-001', 'heroic scores survive save sanitization in either trait direction', () => {
  const heroicSave = structuredClone(defaults);
  heroicSave.skills.sword = 37;
  heroicSave.traits.chaste = 0;
  heroicSave.traits.lustful = 24;
  const migrated = sanitizeCampaignState(heroicSave, defaults);
  assert.equal(migrated.skills.sword, 37);
  assert.equal(migrated.traits.chaste, 0);
  assert.equal(migrated.traits.lustful, 24);
});

console.log('rule audit regression passed');

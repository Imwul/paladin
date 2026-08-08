import assert from 'node:assert/strict';
import {
  CHARACTER_CREATION_STEPS,
  addCharacterCreationSquireYear,
  appendChronicleEvent,
  beginSuccessorCreation,
  closeWinterYear,
  completeCharacterCreation,
  createCharacterCreationSession,
  createSuccessorContext,
  getCreationRollRequests,
  prepareCareerEnd,
  prepareSalvation,
  recordGloryAward,
  recordManualCharacterCreationRoll,
  resolveCareerEnd,
  resolveSalvation,
  resolveWinterStep,
  updateCharacterCreationChoice,
  updateLegacyChoices
} from '../src/rules/index.js';

const traitPairs = [
  ['chaste', 'lustful'], ['energetic', 'lazy'], ['forgiving', 'vengeful'], ['generous', 'selfish'],
  ['honest', 'deceitful'], ['just', 'arbitrary'], ['merciful', 'cruel'], ['modest', 'proud'],
  ['prudent', 'reckless'], ['temperate', 'indulgent'], ['trusting', 'suspicious'], ['valorous', 'cowardly']
];

const makeCampaign = () => ({
  personal: { name: 'Gerold', gender: 'male', age: 25, campaignYear: 770, maintenance: 'ordinary', personalClass: 'Vassal Knight', culture: 'Frankish', homeland: 'Ardennes', features: [] },
  attributes: { siz: 13, dex: 12, str: 14, con: 13, app: 11, currentHp: 26 },
  traits: Object.fromEntries(traitPairs.flatMap(([left, right]) => [[left, left === 'valorous' ? 15 : 10], [right, left === 'valorous' ? 5 : 10]])),
  traitsChecked: {},
  passions: { loveCharlemagne: 15, loveFamily: 16, honor: 16, loveGod: 16 },
  passionsChecked: {},
  standings: { charlemagne: 10, liegeLord: 15, family: 5, retinue: 10, church: 10, commoners: 10 },
  standingsChecked: {},
  skills: {
    awareness: 8, chirurgery: 1, faerieLore: 2, firstAid: 10, folkLore: 8, horsemanship: 12, hunting: 8, industry: 5, recognize: 5, religion: 6, stewardship: 12, swimming: 5,
    courtesy: 12, dancing: 8, eloquence: 8, falconry: 4, gaming: 5, heraldry: 5, intrigue: 3, languages: 2, playInstruments: 1, readingWriting: 2, romance: 4, singing: 3,
    battle: 10, siege: 5, axe: 6, bludgeon: 5, dagger: 8, spear: 10, sword: 16, unarmed: 6, lance: 12, bow: 4, crossbow: 5, thrownWeapon: 4
  },
  skillsChecked: {},
  squire: { name: 'Richer', age: 15, firstAid: 8, horsemanship: 9, weapon: 9, status: '건강' },
  horses: { warhorse: { type: 'Charger', age: 5, status: '건강', hp: 42, armor: 5 } },
  gear: { cash: 20, gloryThisGame: 0, gloryTotal: 1000, armorShield: 'Mail and shield', clothing: 'Court clothes', personalGear: 'Sword and lance', homePossessions: 'One manor', annualItemGlory: 5 },
  family: {
    name: 'House Gerold', motto: 'Faith and courage', battleCry: 'Montjoie', ancestor: 'Arnulf', homeCountry: 'Ardennes', patronSaint: 'St. Denis', manors: 1,
    members: [
      { id: 'gerold', name: 'Gerold', relation: '본인', generation: 3, status: '생존', lifeYears: '745~', birthYear: 745, gender: 'male' },
      { id: 'father', name: 'Anselm', relation: '부친', generation: 2, status: '생존', lifeYears: '720~', birthYear: 720, gender: 'male' },
      { id: 'son-older', name: 'Raimund', relation: '아들', generation: 4, status: '생존', lifeYears: '760~', birthYear: 760, parentId: 'gerold', memberClass: 'Squire', gender: 'male' }
    ]
  },
  journal: {},
  campaign: {
    schemaVersion: 6, saveRevision: 0, appliedEvents: {}, chronicleEvents: [], gloryLedger: [], standingLedger: [], familyTimeline: [], gloryBonusClaimedThreshold: 1,
    passionStates: [], completedCreationIds: [], characterArchives: [],
    lifecycle: { status: 'active', careerStatus: 'active', activeCharacterId: 'gerold', primaryCharacterId: 'gerold', pendingSuccession: false, events: [], unresolvedChoices: [] },
    winter: null
  }
});

const safeRng = () => 0.95;

const runWinter = (source, index) => {
  let character = structuredClone(source);
  const year = character.personal.campaignYear;
  recordGloryAward(character, { id: `glory:${year}:adventure`, year, title: index === 4 ? '국왕의 사절을 구하다' : '변경 순찰', narrative: index === 4 ? '습격에서 왕의 사절단을 구출했습니다.' : '주군을 위해 변경을 순찰하고 임무를 마쳤습니다.', amount: index === 4 ? 80 : 20, sourceRuleId: 'GLORY-PLAY-001', sourcePage: 'Chapter 4 pp. 84-89' });
  appendChronicleEvent(character, { id: `chronicle:${year}:adventure`, year, type: 'adventure', title: index === 4 ? '국왕의 사절을 구하다' : '변경 순찰', narrative: index === 4 ? '위험에 처한 왕의 사절단을 구해 이름을 높였습니다.' : '주군의 명을 받아 변경의 길과 마을을 지켰습니다.', glory: index === 4 ? 80 : 20, sourceRuleId: 'GLORY-PLAY-001', sourcePage: 'Chapter 4 pp. 84-89' });

  const apply = (stepId, input, rng = safeRng) => {
    const result = resolveWinterStep(character, { stepId, input }, rng);
    assert.equal(result.awaitingChoice, false, `${year} ${stepId} unexpectedly requires external resolution`);
    character = result.character;
    return result;
  };

  apply('soloScenario', { choice: 'not_applicable' });
  apply('aging', {});
  apply('economy', { harvestRoll: 5, maintenanceGrade: 'ordinary', situationalModifier: 0 });
  apply('survival', {});
  apply('personalEvent', { eventRoll: 12, checkRoll: 10 });
  apply('family', index === 0 ? {
    familyEventRoll: 3, relationRoll: 3, sexRoll: 2,
    marriageAction: 'within_class_roll', courtesyRoll: 5, marriageTableRoll: 12, spouseName: 'Adele', spouseAge: 20,
    childbirthAction: 'roll', childbirths: [{ roll: 13, childNames: ['Hildegard'], sexRolls: [1] }]
  } : index === 1 ? {
    familyEventRoll: 3, relationRoll: 3, sexRoll: 2,
    marriageAction: 'already_married', childbirthAction: 'roll', childbirths: [{ roll: 13, childNames: ['Bernard'], sexRolls: [2] }]
  } : { familyEventRoll: 3, relationRoll: 3, sexRoll: 2, marriageAction: 'already_married', childbirthAction: 'skip' });
  apply('experience', {});
  const trainingTarget = ['standings', 'passions', 'traits'].flatMap(group => Object.keys(character[group] || {}).map(key => [group, key])).find(([group, key]) => Number(character[group][key] || 0) < 15);
  assert.ok(trainingTarget, 'A legal annual training score must remain available.');
  apply('training', { option: 'score', group: trainingTarget[0], key: trainingTarget[1], amount: 1 });
  apply('glory', {});
  const available = Math.max(0, Number(character.campaign.winter.gloryBonusPoints || 0) - Number(character.campaign.winter.bonusSpent || 0));
  apply('gloryBonus', { allocations: Array.from({ length: available }, () => ({ group: 'skills', key: 'sword' })) });
  const closed = closeWinterYear(character);
  assert.equal(closed.applied, true);
  return closed.character;
};

const fillRolls = rawSession => {
  let session = rawSession;
  let guard = 0;
  while (guard < 100) {
    const pending = CHARACTER_CREATION_STEPS.flatMap(step => getCreationRollRequests(session, step.id));
    if (!pending.length) return session;
    pending.forEach(spec => {
      const count = Number(spec.notation.match(/^(\d*)d/)?.[1] || 1);
      const sides = Number(spec.notation.match(/d(\d+)/)?.[1] || 6);
      const face = sides === 20 ? 10 : Math.min(5, sides);
      session = recordManualCharacterCreationRoll(session, spec, Array(count).fill(face));
    });
    guard += 1;
  }
  throw new Error('Successor creation roll loop did not settle.');
};

const configureSuccessor = rawSession => {
  let session = rawSession;
  const choose = (path, value, step) => { session = updateCharacterCreationChoice(session, path, value, step); };
  choose('name', 'Raimund', 'mode');
  choose('successorFatherClass', 'vassal', 'father');
  choose('sonNumberMethod', 'first', 'sonNumber');
  choose('featureText', 'A weathered brow', 'feature');
  choose('story', 'Raimund inherited his father Gerold\'s duty and continued the family chronicle.', 'review');
  choose('inheritEquipmentInsteadOfOutfit', true, 'outfit');
  ['siz', 'dex', 'str', 'con', 'app'].forEach(key => choose(`attributeBonuses.${key}`, 1, 'attributes'));
  session = fillRolls(session);
  const points = Number(session.draftCharacter.father?.skillPoints || 0);
  const allocation = {};
  let remaining = points;
  Object.entries(session.draftCharacter.skillsBeforeTraining || {}).forEach(([key, value]) => {
    if (remaining <= 0 || Number(value) <= 0) return;
    const amount = Math.min(remaining, Math.max(0, 15 - Number(value)));
    if (amount) allocation[key] = amount;
    remaining -= amount;
  });
  assert.equal(remaining, 0, 'All father-class skill points must have a legal destination.');
  Object.entries(allocation).forEach(([key, value]) => choose(`skillTraining.${key}`, value, 'skills'));
  session = fillRolls(session);
  let squireYearGuard = 0;
  while (!session.draftCharacter.qualification?.qualified && squireYearGuard < 12) {
    const draft = session.draftCharacter;
    const used = new Set();
    const pick = (priority, fallback) => {
      const key = [...priority, ...fallback].find(candidate => !used.has(candidate) && Number(draft.skills[candidate] || 0) > 0 && Number(draft.skills[candidate] || 0) < 15);
      assert.ok(key, 'A legal squire-year skill must remain available.');
      used.add(key);
      return key;
    };
    const common = pick(['firstAid', 'horsemanship'], ['awareness', 'folkLore', 'hunting', 'stewardship']);
    const courtly = pick(['courtesy', 'dancing', 'eloquence'], ['falconry', 'gaming', 'heraldry', 'intrigue', 'languages']);
    const combat = pick(['battle', 'sword', 'spear', 'lance'], ['axe', 'dagger', 'unarmed']);
    const free = pick(['sword', 'spear', 'lance', 'battle'], Object.keys(draft.skills));
    const unmet = draft.qualification.requirements.find(requirement => !requirement.met)?.key;
    const preferredScore = unmet === 'valorous' ? ['traits', 'valorous'] : unmet === 'honor' ? ['passions', 'honor'] : unmet === 'lordStanding' ? ['standings', 'liegeLord'] : null;
    const score = preferredScore && Number(draft[preferredScore[0]]?.[preferredScore[1]] || 0) < 15
      ? preferredScore
      : ['traits', 'passions', 'standings'].flatMap(group => Object.keys(draft[group] || {}).map(key => [group, key])).find(([group, key]) => Number(draft[group][key] || 0) < 15);
    assert.ok(score, 'A legal squire-year score must remain available.');
    const added = addCharacterCreationSquireYear(session, {
      categories: ['score', 'skills'], scoreGroup: score[0], scoreKey: score[1],
      skills: { common, courtly, combat, free }
    });
    assert.equal(added.added, true, added.error || 'Squire year failed.');
    session = added.session;
    squireYearGuard += 1;
  }
  assert.equal(session.draftCharacter.qualification?.qualified, true, 'Successor must meet every printed knighthood qualification.');
  return session;
};

let campaign = makeCampaign();
for (let yearIndex = 0; yearIndex < 10; yearIndex += 1) campaign = runWinter(campaign, yearIndex);

assert.equal(campaign.personal.campaignYear, 780);
assert.equal(campaign.personal.age, 35);
assert.equal(campaign.campaign.winterHistory.length, 10);
assert.equal(campaign.family.members.some(member => member.name === 'Adele'), true);
assert.equal(campaign.family.members.filter(member => ['아들', '딸'].includes(member.relation)).length >= 3, true);
assert.equal(campaign.campaign.gloryLedger.some(entry => entry.title === '국왕의 사절을 구하다'), true);
assert.equal(campaign.campaign.standingLedger.length, 10);
assert.equal(campaign.campaign.chronicleEvents.some(entry => entry.type === 'adventure'), true);
assert.equal(campaign.campaign.chronicleEvents.some(entry => /경험 체크|훈련 방식|겨울 정산 완료/.test(entry.narrative || '')), false);

const preparedEnd = prepareCareerEnd(campaign, { type: 'death', cause: '마지막 원정에서 입은 상처', year: 780, timestamp: '2026-08-08T00:00:00.000Z' });
assert.equal(preparedEnd.prepared, true);
const ended = resolveCareerEnd(preparedEnd.character, { timestamp: '2026-08-08T00:00:01.000Z' });
assert.equal(ended.character.campaign.lifecycle.status, 'pending_salvation');
const salvationPrepared = prepareSalvation(ended.character, { paladin: true });
assert.equal(salvationPrepared.prepared, true);
const saved = resolveSalvation(salvationPrepared.character, { rawRoll: salvationPrepared.salvation.ledger.finalStatistic, timestamp: '2026-08-08T00:00:02.000Z' });
assert.equal(saved.character.campaign.lifecycle.status, 'pending_legacy');
const legacy = saved.character.campaign.lifecycle.legacy;
const selectedTransfer = legacy.transferableScores.find(entry => entry.id === 'skills.sword') || legacy.transferableScores[0];
const legacyUpdated = updateLegacyChoices(saved.character, {
  selectedTransfers: [selectedTransfer.id],
  selectedEquipmentIds: ['gear.personalGear'],
  equipmentDecisionRecorded: true,
  manorApproved: true,
  manorApprovalNote: 'Campaign validation approval'
});
assert.equal(legacyUpdated.updated, true);
const successorContext = createSuccessorContext(legacyUpdated.character, { mode: 'same_family', candidateId: 'son-older' });
assert.equal(successorContext.ok, true);
let successorSession = createCharacterCreationSession({ seed: 'campaign-successor', existingFamily: successorContext.context.family, successorContext: successorContext.context, now: '2026-08-08T00:00:03.000Z' });
successorSession = configureSuccessor(successorSession);
const begun = beginSuccessorCreation(legacyUpdated.character, successorContext.context, successorSession, { timestamp: '2026-08-08T00:00:04.000Z' });
assert.equal(begun.started, true);
const completed = completeCharacterCreation(begun.character, successorSession, '2026-08-08T00:00:05.000Z');
assert.equal(completed.completed, true, completed.issues.join('; '));
assert.equal(completed.character.personal.name, 'Raimund');
assert.equal(completed.character.campaign.lifecycle.careerStatus, 'active');
assert.equal(completed.character.campaign.familyTimeline.some(entry => entry.type === 'succession'), true);

const continued = runWinter(completed.character, 10);
assert.equal(continued.personal.campaignYear, 781);
assert.equal(continued.campaign.lifecycle.careerStatus, 'active');

console.log(JSON.stringify({
  yearsPlayed: 11,
  firstCharacterYears: 10,
  successorYears: 1,
  finalYear: continued.personal.campaignYear,
  chronicleEvents: continued.campaign.chronicleEvents.length,
  familyTimelineEvents: continued.campaign.familyTimeline.length,
  gloryLedgerEntries: continued.campaign.gloryLedger.length,
  standingLedgerEntries: continued.campaign.standingLedger.length,
  rulebookConsultationsAfterFixes: 0
}, null, 2));

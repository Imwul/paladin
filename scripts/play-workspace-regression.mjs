import assert from 'node:assert/strict';
import { getPlayActions, PLAY_VIEWS, readPlayView, rememberPlayView } from '../src/app/playWorkspace.js';
import { getProcedureConsequence, PROCEDURE_TASKS, readProcedureTask } from '../src/features/rules/procedurePresentation.js';
import { recordJourneyDecision, resolveJourneyDay, resolveSkillProcedure, startJourney } from '../src/rules/rulebookProcedureRules.js';

let count = 0;
const test = (name, action) => { action(); count += 1; console.log(`PASS ${name}`); };
const knight = () => ({ personal: { name: 'Audit Knight', campaignYear: 767 }, attributes: { siz: 14, con: 14, str: 12, dex: 12, currentHp: 28 }, skills: { swimming: 12, gaming: 12, hunting: 12 }, skillsChecked: {}, campaign: { lifecycle: { status: 'active' }, health: {} } });
const storage = { values: {}, getItem(key) { return this.values[key]; }, setItem(key, value) { this.values[key] = value; } };

test('blank campaign has creation, not demo annual obligations', () => {
  const actions = getPlayActions({ personal: {}, campaign: {} });
  assert.equal(actions.length, 1); assert.equal(actions[0].kind, 'creation');
});
test('lifecycle decisions precede fresh creation', () => {
  for (const [status, tab] of [['pending_salvation', 'character'], ['pending_legacy', 'character'], ['pending_successor', 'family']]) {
    assert.equal(getPlayActions({ personal: {}, campaign: { lifecycle: { status } } })[0].tab, tab);
  }
});
test('death risk precedes combat', () => {
  const c = knight(); c.campaign.health.pendingDeath = true; c.campaign.combat = { status: 'active' };
  assert.equal(getPlayActions(c)[0].kind, 'danger');
});
test('captivity exposes ransom, not free adventuring', () => {
  const c = knight(); c.campaign.captivity = { status: 'awaiting_ransom' };
  assert.equal(getPlayActions(c)[0].tab, 'economy'); assert.equal(getPlayActions(c).some(item => item.tab === 'winter'), false);
});
test('combat and war continuation use canonical statuses', () => {
  const c = knight(); c.campaign.combat = { status: 'active' }; assert.equal(getPlayActions(c)[0].tab, 'combat');
  c.campaign.combat.status = 'concluded'; c.campaign.siege = { status: 'active' }; assert.equal(getPlayActions(c)[0].tab, 'battle');
});
test('personality adventure bridge uses connected view', () => {
  const c = knight(); c.campaign.adventures = { active: { status: 'active', stageIndex: 3, pendingSubsystem: { type: 'personality_magic' } } };
  assert.equal(getPlayActions(c)[0].tab, 'personality');
  c.campaign.adventures.active.pendingSubsystem = null; assert.equal(getPlayActions(c)[0].tab, 'adventure');
});
test('pending Passion aftermath stays ahead of fresh adventure and survives reload', () => {
  const c = knight();
  c.campaign.personalityMagic = { activeResolution: { type: 'passion', outcome: 'critical' } };
  c.campaign.adventures = { active: { status: 'active', title: 'The Hunt' } };
  assert.equal(getPlayActions(JSON.parse(JSON.stringify(c)))[0].kind, 'personality');
  c.campaign.combat = { status: 'active' };
  assert.equal(getPlayActions(c)[0].tab, 'combat');
});
test('arrived journey with pending rest remains resumable', () => {
  const c = knight(); c.campaign.rulebookProcedures = { journeys: [{ status: 'complete', destination: 'Aachen', remainingDistance: 0, pendingDecision: { kind: 'rest' } }] };
  assert.equal(getPlayActions(c).some(item => item.kind === 'travel'), true);
});
test('Winter close and unresolved false flags are distinct', () => {
  const c = knight(); c.campaign.winter = { currentStep: 'complete', steps: Object.fromEntries(Array.from({ length: 10 }, (_, i) => [i, 'resolved'])), unresolved: { ignored: false } };
  assert.equal(getPlayActions(c).at(-1).actionLabel, '연도 마감');
});
test('selectors do not mutate save data', () => {
  const c = knight(); const before = JSON.stringify(c); getPlayActions(c); assert.equal(JSON.stringify(c), before);
});
test('every valid view reloads, unknown view falls back', () => {
  for (const view of PLAY_VIEWS) { rememberPlayView(storage, view); assert.equal(readPlayView(storage), view); }
  storage.values.paladin_play_view = 'missing_view'; assert.equal(readPlayView(storage), 'dashboard');
  assert.equal(readPlayView({ getItem() { throw Error('disabled'); } }), 'dashboard');
  assert.doesNotThrow(() => rememberPlayView({ setItem() { throw Error('disabled'); } }, 'combat'));
});
test('all six task panels and active journey default are reachable', () => {
  assert.equal(PROCEDURE_TASKS.length, 6); assert.equal(new Set(PROCEDURE_TASKS.map(item => item.id)).size, 6);
  storage.values.paladin_procedure_task = 'career'; assert.equal(readProcedureTask(storage), 'career'); assert.equal(readProcedureTask(storage, true), 'travel');
});
test('skill success alone cannot award experience (pp.112-113)', () => {
  const result = resolveSkillProcedure(knight(), { skillId: 'swimming', roll: 1 });
  assert.equal(result.character.skillsChecked.swimming, undefined); assert.equal(result.result.experienceApproved, false);
});
test('GM-authorized success awards experience once and preserves old checks', () => {
  let c = knight(); c.skillsChecked.hunting = true;
  const result = resolveSkillProcedure(c, { skillId: 'swimming', roll: 1, experienceApproved: true, transactionId: 'approved' });
  c = JSON.parse(JSON.stringify(result.character)); assert.equal(c.skillsChecked.swimming, true); assert.equal(c.skillsChecked.hunting, true);
  const duplicate = resolveSkillProcedure(c, { skillId: 'swimming', roll: 20, transactionId: 'approved' });
  assert.equal(duplicate.applied, false); assert.equal(duplicate.result.roll, 1); assert.equal(duplicate.character.campaign.rulebookProcedures.skillResults.length, 1);
});
test('GM approval cannot turn failed use into a skill check', () => {
  const result = resolveSkillProcedure(knight(), { skillId: 'swimming', roll: 20, experienceApproved: true });
  assert.equal(result.character.skillsChecked.swimming, undefined); assert.match(getProcedureConsequence(result.result), /익수/);
});
test('Gaming presentation calls canonical opposed resolution (p.100)', () => {
  const result = resolveSkillProcedure(knight(), { skillId: 'gaming', roll: 8, opponentValue: 12, opponentRoll: 3 });
  assert.match(getProcedureConsequence(result.result), /기사 승리/);
  assert.match(getProcedureConsequence(JSON.parse(JSON.stringify(result.result))), /자동 정산하지/);
});
test('Latin literacy needs one roll; non-Latin needs both (p.101)', () => {
  const c = knight(); c.skills.readingWriting = 12;
  const latin = resolveSkillProcedure(c, { skillId: 'readingWriting', roll: 1, readingLanguage: 'latin' });
  assert.equal(latin.result.consequence, 'read_or_write'); assert.equal(latin.result.secondaryCheck, null);
  assert.throws(() => resolveSkillProcedure(c, { skillId: 'readingWriting', roll: 1, readingLanguage: 'other' }), /Languages/);
  const other = resolveSkillProcedure(c, { skillId: 'readingWriting', roll: 1, readingLanguage: 'other', languageRoll: 15, languageValue: 5 });
  assert.equal(other.result.consequence, 'not_understood'); assert.equal(other.result.secondaryCheck.success, false);
});
test('Reading critical and fumble retain their special meanings', () => {
  const c = knight(); c.skills.readingWriting = 12;
  for (const [roll, consequence, text] of [[12, 'read_quickly', /짧은 시간/], [20, 'misinterpreted', /오독/]]) {
    const result = resolveSkillProcedure(c, { skillId: 'readingWriting', roll });
    assert.equal(result.result.consequence, consequence); assert.match(getProcedureConsequence(result.result), text);
    assert.equal(result.result.sourcePage, 'Ch.5 p.101');
  }
});
test('forced-march fumble damages canonical health once (p.112)', () => {
  let c = startJourney(knight(), { id: 'forced', destination: 'Aachen', distance: 100, pace: 'forcedMarch' }).character;
  const result = resolveJourneyDay(c, { journeyId: 'forced', transactionId: 'forced-day', conRoll: 20, movementRate: 2, rng: () => 0 });
  c = JSON.parse(JSON.stringify(result.character)); assert.equal(c.attributes.currentHp, 26); assert.equal(result.day.forced.damage, 2);
  assert.equal(c.campaign.rulebookProcedures.journeys[0].pendingDecision.kind, 'rest');
  assert.throws(() => resolveJourneyDay(c, { journeyId: 'forced', conRoll: 1 }), /GM/);
  const repeated = resolveJourneyDay(c, { journeyId: 'forced', transactionId: 'forced-day', conRoll: 20 });
  assert.equal(repeated.applied, false); assert.equal(repeated.character.attributes.currentHp, 26);
});
test('GM rest resolution is saved and cannot be bypassed by free text alone', () => {
  let c = startJourney(knight(), { id: 'rest', destination: 'Aachen', distance: 1, pace: 'forcedMarch' }).character;
  c = resolveJourneyDay(c, { journeyId: 'rest', conRoll: 15, movementRate: 2 }).character;
  assert.throws(() => recordJourneyDecision(c, { journeyId: 'rest', note: 'rest' }), /GM/);
  c = recordJourneyDecision(c, { journeyId: 'rest', gmConfirmed: true, note: 'GM confirms required rest completed' }).character;
  c = JSON.parse(JSON.stringify(c)); assert.equal(c.campaign.rulebookProcedures.journeys[0].status, 'complete'); assert.equal(c.campaign.rulebookProcedures.journeys[0].pendingDecision, null);
  assert.equal(recordJourneyDecision(c, { journeyId: 'rest', gmConfirmed: true, note: 'repeat' }).applied, false);
});
test('lost route cannot silently advance (p.112)', () => {
  let c = startJourney(knight(), { id: 'lost', destination: 'Aachen', distance: 50, routeKnown: false }).character;
  c = resolveJourneyDay(c, { journeyId: 'lost', huntingRoll: 20 }).character;
  assert.throws(() => resolveJourneyDay(c, { journeyId: 'lost' }), /GM/);
  c = recordJourneyDecision(c, { journeyId: 'lost', gmConfirmed: true, note: 'GM allows renewed search' }).character;
  const result = resolveJourneyDay(c, { journeyId: 'lost', huntingRoll: 1 });
  assert.equal(result.day.distance, 10); assert.equal(result.journey.days.length, 2);
});

console.log(`Play workspace: ${count} scenarios passed.`);

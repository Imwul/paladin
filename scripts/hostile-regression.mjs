import assert from 'node:assert/strict';
import {
  applyOnce,
  hasAppliedEvent,
  sanitizeCampaignState,
  validateCampaignImport
} from '../src/utils/campaignState.js';

const defaults = {
  personal: { name: '롤랑 경', age: 18, campaignYear: 768, maintenance: 'ordinary', features: [] },
  attributes: { siz: 14, dex: 12, str: 13, con: 12, app: 11, currentHp: 26 },
  traits: {
    chaste: 10, lustful: 10, energetic: 12, lazy: 8, forgiving: 11, vengeful: 9,
    generous: 13, selfish: 7, honest: 12, deceitful: 8, just: 10, arbitrary: 10,
    merciful: 11, cruel: 9, modest: 10, proud: 10, pious: 12, worldly: 8,
    prudent: 10, reckless: 10, temperate: 10, indulgent: 10, trusting: 11, suspicious: 9,
    valorous: 15, cowardly: 5
  },
  skills: { sword: 13, lance: 12, stewardship: 3 },
  skillsChecked: {},
  traitsChecked: {},
  passions: { honor: 16, loveGod: 15, loveFamily: 15 },
  passionsChecked: {},
  standings: { family: 16, church: 15, commoners: 11 },
  squire: { name: '피에르', age: 14 },
  horses: { warhorse: { hp: 42, armor: 5, damage: '6d6' } },
  gear: { cash: 5, gloryThisGame: 100, gloryTotal: 1200 },
  family: {
    members: [
      { id: 'parent', relation: '부친', status: '은퇴', generation: 2, name: '부친' },
      { id: 'self', relation: '본인', status: '생존', generation: 3, parentId: 'parent', name: '본인', lifeYears: '768~' }
    ],
    ancestorRollLog: [],
    ancestorApplied: false
  },
  journal: { 768: { text: 'start', updatedAt: new Date().toISOString() } },
  campaign: {
    schemaVersion: 2,
    appliedEvents: {},
    passionStates: [],
    winter: {
      year: 768,
      steps: {},
      logs: [],
      unresolved: {},
      gloryBonusPoints: 0,
      bonusSpent: 0,
      skippedWithConfirmation: {}
    }
  }
};

const corrupt = structuredClone(defaults);
corrupt.gear.cash = -50;
corrupt.gear.gloryTotal = -500;
corrupt.attributes.siz = 99;
corrupt.attributes.currentHp = 999;
corrupt.personal.maintenance = 'dragon-hoard';
corrupt.traits.chaste = 18;
corrupt.traits.lustful = 18;
corrupt.family.members = [
  { id: 'a', relation: '본인', status: '생존', generation: 3, parentId: 'b', spouseId: 'a', name: 'A', lifeYears: '790~' },
  { id: 'b', relation: '본인', status: '생존', generation: 2, parentId: 'a', name: 'B' },
  { id: 'c', relation: '후계자', status: '불가능', generation: 1, parentId: 'missing', spouseId: 'missing', name: 'C' }
];
corrupt.campaign.winter.steps = { aging: 'bogus', harvest: 'resolved' };
corrupt.campaign.winter.unresolved = { wound: { label: 'unresolved wound', required: true } };
corrupt.campaign.passionStates = [
  { id: '', type: 'dragon', status: 'cursed', passionKey: 7, year: 3000, note: 123 }
];

const sanitized = sanitizeCampaignState(corrupt, defaults);
const saveLoadRoundTrip = sanitizeCampaignState(JSON.parse(JSON.stringify(corrupt)), defaults);

assert.equal(sanitized.gear.cash, 0);
assert.equal(sanitized.gear.gloryTotal, 0);
assert.equal(sanitized.attributes.siz, 20);
assert.equal(sanitized.attributes.currentHp <= sanitized.attributes.siz + sanitized.attributes.con, true);
assert.equal(sanitized.personal.maintenance, 'ordinary');
assert.equal(sanitized.traits.chaste + sanitized.traits.lustful, 20);
assert.equal(sanitized.family.members.filter(m => m.relation === '본인' && m.status === '생존').length, 1);
assert.equal(sanitized.family.members.some(m => m.parentId === m.id || m.spouseId === m.id), false);
assert.equal(sanitized.family.members.some(m => m.status === '불가능'), false);
assert.equal(sanitized.family.members.some(m => m.spouseId && sanitized.family.members.find(other => other.id === m.spouseId)?.parentId === m.id), false);
assert.equal(sanitized.campaign.winter.steps.aging, 'pending');
assert.equal(sanitized.campaign.winter.steps.harvest, 'resolved');
assert.equal(Object.hasOwn(sanitized.campaign.winter.steps, 'annualGlory'), true);
assert.equal(Object.hasOwn(sanitized.campaign.winter.steps, 'maintenance'), true);
assert.equal(sanitized.campaign.winter.unresolved.wound.required, true);
assert.equal(sanitized.campaign.passionStates.length, 1);
assert.equal(sanitized.campaign.passionStates[0].type, 'shock');
assert.equal(sanitized.campaign.passionStates[0].status, 'active');
assert.equal(sanitized.campaign.passionStates[0].year, 1200);
assert.equal(saveLoadRoundTrip.family.members.filter(m => m.relation === '본인' && m.status === '생존').length, 1);
assert.equal(saveLoadRoundTrip.campaign.winter.unresolved.wound.required, true);
assert.equal(saveLoadRoundTrip.campaign.passionStates[0].type, 'shock');

const legacyMaintenance = structuredClone(defaults);
legacyMaintenance.personal.maintenance = 'miserly';
assert.equal(sanitizeCampaignState(legacyMaintenance, defaults).personal.maintenance, 'impoverished');

const firstApply = applyOnce(sanitized, 'reward:test', character => {
  character.gear.cash += 10;
  return character;
}, 'test reward');
const secondApply = applyOnce(firstApply.character, 'reward:test', character => {
  character.gear.cash += 10;
  return character;
}, 'test reward');

assert.equal(firstApply.applied, true);
assert.equal(secondApply.applied, false);
assert.equal(hasAppliedEvent(secondApply.character, 'reward:test'), true);
assert.equal(secondApply.character.gear.cash, firstApply.character.gear.cash);
assert.equal(secondApply.character.campaign.passionStates[0].type, 'shock');

const successionGuard = applyOnce(secondApply.character, 'succession:self-to-heir:790', character => {
  character.personal.age = 15;
  character.gear.gloryTotal += 100;
  return character;
}, 'succession');
const duplicateSuccessionGuard = applyOnce(successionGuard.character, 'succession:self-to-heir:790', character => {
  character.personal.age = 15;
  character.gear.gloryTotal += 100;
  return character;
}, 'succession');

assert.equal(successionGuard.applied, true);
assert.equal(duplicateSuccessionGuard.applied, false);
assert.equal(duplicateSuccessionGuard.character.gear.gloryTotal, successionGuard.character.gear.gloryTotal);

assert.deepEqual(validateCampaignImport({ personal: {}, attributes: {}, skills: {} }), {
  ok: false,
  errors: ['traits', 'passions', 'gear', 'family', 'journal']
});

console.log('hostile regression passed');

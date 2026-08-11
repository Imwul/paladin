import { sanitizeCharacterCreationSession } from '../rules/characterCreationRules.js';
import { sanitizeMassBattleState, sanitizeSiegeState, sanitizeSkirmishState } from '../rules/battleRules.js';
import { sanitizeHealthState } from '../rules/combatRules.js';
import { sanitizeChapter7CombatState } from '../rules/chapter7CombatRules.js';
import { sanitizeLifecycleState } from '../rules/lifecycleRules.js';
import { sanitizeEconomyState, toLivres } from '../rules/economyRules.js';
import { sanitizeAdventureLedger } from '../rules/adventureRules.js';
import { sanitizeChapter18Ledger } from '../rules/chapter18Rules.js';
import { normalizeOpposedTraits } from '../rules/personalityRules.js';
import { sanitizePersonalityMagicState } from '../rules/personalityMagicRules.js';

const VALID_STATUSES = new Set(['생존', '사망', '은퇴', '실종', '질병', '포로', '행동 불능', '병상', '역사적']);
const VALID_GENDERS = new Set(['male', 'female', 'unknown']);
const RULE_SCORE_MAX = Number.MAX_SAFE_INTEGER;

export const deepClone = (value) => JSON.parse(JSON.stringify(value));

const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const clampNumber = (value, min, max, fallback = min) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
};

const clampInt = (value, min, max, fallback = min) => Math.round(clampNumber(value, min, max, fallback));

const sanitizeString = (value, fallback = '') => (
  typeof value === 'string' && value.trim() ? value : fallback
);

const sanitizeStringArray = (value, fallback = []) => {
  if (!Array.isArray(value)) return [...fallback];
  return value.filter(item => typeof item === 'string').slice(0, 20);
};

const sanitizeEffectSummary = (value, fallback = '') => {
  if (typeof value === 'string') return value;
  if (!isPlainObject(value)) return fallback;
  return Object.entries(value).flatMap(([group, entries]) => (
    isPlainObject(entries)
      ? Object.entries(entries).map(([key, amount]) => `${group}.${key} ${Number(amount) >= 0 ? '+' : ''}${amount}`)
      : []
  )).join(', ') || fallback;
};

const sanitizeCheckedMap = (value, defaults = {}) => {
  const source = isPlainObject(value) ? value : {};
  return Object.keys({ ...defaults, ...source }).reduce((acc, key) => {
    if (source[key] === true) acc[key] = true;
    return acc;
  }, {});
};

const sanitizeNumberMap = (value, defaults = {}, min = 0, max = 25) => {
  const source = isPlainObject(value) ? value : {};
  return Object.keys({ ...defaults, ...source }).reduce((acc, key) => {
    acc[key] = clampInt(source[key] ?? defaults[key], min, max, defaults[key] ?? min);
    return acc;
  }, {});
};

const sanitizeJournal = (value, defaults = {}) => {
  const source = isPlainObject(value) ? value : {};
  const merged = { ...defaults, ...source };
  return Object.entries(merged).reduce((acc, [year, entry]) => {
    const parsedYear = Number(year);
    if (!Number.isInteger(parsedYear) || parsedYear < 700 || parsedYear > 1200) return acc;
    if (!isPlainObject(entry)) return acc;
    const text = typeof entry.text === 'string' ? entry.text : '';
    if (!text.trim()) return acc;
    acc[parsedYear] = {
      text,
      updatedAt: typeof entry.updatedAt === 'string' ? entry.updatedAt : new Date().toISOString()
    };
    return acc;
  }, {});
};

const createsParentCycle = (members, childId, parentId) => {
  let cursor = parentId;
  const seen = new Set([childId]);
  while (cursor) {
    if (seen.has(cursor)) return true;
    seen.add(cursor);
    const parent = members.find(member => member.id === cursor);
    cursor = parent?.parentId;
  }
  return false;
};

const sanitizeFamilyMembers = (membersValue, defaults = []) => {
  const rawMembers = Array.isArray(membersValue) && membersValue.length ? membersValue : defaults;
  const seenIds = new Set();
  let members = rawMembers
    .filter(isPlainObject)
    .map((member, index) => {
      const fallbackId = `member_${index + 1}`;
      let id = sanitizeString(member.id, fallbackId).replace(/\s+/g, '_');
      if (seenIds.has(id)) id = `${id}_${index + 1}`;
      seenIds.add(id);
      return {
        ...member,
        id,
        name: sanitizeString(member.name, `가문원 ${index + 1}`),
        relation: sanitizeString(member.relation, '친족'),
        generation: clampInt(member.generation, 1, 12, 3),
        status: VALID_STATUSES.has(member.status) ? member.status : '생존',
        lifeYears: typeof member.lifeYears === 'string' ? member.lifeYears : '',
        note: typeof member.note === 'string' ? member.note : '',
        memberClass: typeof member.memberClass === 'string' ? member.memberClass : undefined,
        gender: VALID_GENDERS.has(member.gender) ? member.gender : 'unknown',
        deathCause: typeof member.deathCause === 'string' ? member.deathCause : undefined,
        parentId: typeof member.parentId === 'string' ? member.parentId : undefined,
        spouseId: typeof member.spouseId === 'string' ? member.spouseId : undefined
      };
    });

  const ids = new Set(members.map(member => member.id));
  members = members.map(member => {
    const next = { ...member };
    if (next.parentId && (!ids.has(next.parentId) || next.parentId === next.id)) delete next.parentId;
    if (next.spouseId && (!ids.has(next.spouseId) || next.spouseId === next.id)) delete next.spouseId;
    return next;
  });

  members = members.map(member => {
    const next = { ...member };
    if (next.parentId && createsParentCycle(members, next.id, next.parentId)) delete next.parentId;
    const parent = next.parentId ? members.find(candidate => candidate.id === next.parentId) : null;
    if (parent && next.generation <= parent.generation) {
      next.generation = Math.min(12, parent.generation + 1);
    }
    return next;
  });

  const activeSelf = members.filter(member => member.relation === '본인' && member.status === '생존');
  if (activeSelf.length > 1) {
    const keepId = activeSelf[0].id;
    members = members.map(member => (
      member.relation === '본인' && member.status === '생존' && member.id !== keepId
        ? { ...member, relation: '친족' }
        : member
    ));
  }

  const spousePairs = new Map();
  members.forEach(member => {
    if (member.spouseId) spousePairs.set(member.id, member.spouseId);
  });

  members = members.map(member => {
    const spouseId = spousePairs.get(member.id);
    if (!spouseId) return member;
    const spouse = members.find(candidate => candidate.id === spouseId);
    if (!spouse || spouse.parentId === member.id || member.parentId === spouse.id) {
      return { ...member, spouseId: undefined };
    }
    return member;
  });

  return members;
};

const sanitizeAppliedEvents = (value) => {
  const source = isPlainObject(value) ? value : {};
  return Object.entries(source).reduce((acc, [eventId, event]) => {
    if (!eventId || typeof eventId !== 'string') return acc;
    acc[eventId] = {
      appliedAt: typeof event?.appliedAt === 'string' ? event.appliedAt : new Date().toISOString(),
      year: Number.isInteger(Number(event?.year)) ? Number(event.year) : undefined,
      label: typeof event?.label === 'string' ? event.label : eventId
    };
    return acc;
  }, {});
};

const sanitizeWinter = (value, campaignYear) => {
  const source = isPlainObject(value) ? value : {};
  const legacyHarvestResolved = ['resolved', 'skipped'].includes(source.steps?.harvest)
    && !['resolved', 'skipped'].includes(source.steps?.maintenance);
  const defaultSteps = {
    soloScenario: 'pending',
    aging: 'pending',
    economy: 'pending',
    survival: 'pending',
    personalEvent: 'pending',
    family: 'pending',
    experience: 'pending',
    training: 'pending',
    glory: 'pending',
    gloryBonus: 'pending'
  };
  const migratedSteps = {
    ...source.steps,
    economy: source.steps?.economy || (
      ['resolved', 'skipped'].includes(source.steps?.harvest) && ['resolved', 'skipped'].includes(source.steps?.maintenance)
        ? 'resolved'
        : legacyHarvestResolved ? 'awaiting_choice' : 'pending'
    ),
    family: source.steps?.family || source.steps?.familyEvent || 'pending',
    glory: source.steps?.glory || source.steps?.annualGlory || 'pending'
  };
  const validStepState = new Set(['pending', 'resolved', 'skipped', 'awaiting_choice']);
  const steps = Object.entries(defaultSteps).reduce((acc, [key, fallback]) => {
    const value = migratedSteps[key];
    acc[key] = validStepState.has(value) ? value : fallback;
    return acc;
  }, {});
  const currentStep = typeof source.currentStep === 'string' && (source.currentStep === 'complete' || Object.hasOwn(defaultSteps, source.currentStep))
    ? source.currentStep
    : Object.keys(defaultSteps).find(key => !['resolved', 'skipped'].includes(steps[key])) || 'complete';
  const year = clampInt(source.year, 700, 1200, campaignYear);
  return {
    year,
    transactionId: sanitizeString(source.transactionId, `winter:${year}`),
    currentStep,
    steps,
    logs: Array.isArray(source.logs) ? source.logs.filter(line => typeof line === 'string').slice(-250) : [],
    unresolved: isPlainObject(source.unresolved) ? source.unresolved : {},
    records: isPlainObject(source.records) ? source.records : {},
    transactions: Array.isArray(source.transactions) ? source.transactions.filter(isPlainObject).slice(-20) : [],
    annualLedger: isPlainObject(source.annualLedger) ? source.annualLedger : null,
    survivalRecords: Array.isArray(source.survivalRecords) ? source.survivalRecords.filter(isPlainObject).slice(-250) : [],
    flags: {
      ...(isPlainObject(source.flags) ? source.flags : {}),
      ...(legacyHarvestResolved ? { legacyHarvestResolved: true } : {})
    },
    gloryBonusPoints: clampInt(source.gloryBonusPoints, 0, 100, 0),
    bonusSpent: clampInt(source.bonusSpent, 0, 100, 0),
    skippedWithConfirmation: isPlainObject(source.skippedWithConfirmation) ? source.skippedWithConfirmation : {},
    harvestModifier: clampInt(source.harvestModifier, -50, 50, 0),
    economy: {
      grossIncome: clampNumber(source.economy?.grossIncome, 0, 1000000, 0),
      stewardshipTarget: clampNumber(source.economy?.stewardshipTarget, -100, 100, 0),
      stewardshipModifier: clampNumber(source.economy?.stewardshipModifier, -100, 100, 0),
      treasuryDelta: clampNumber(source.economy?.treasuryDelta, -1000000, 1000000, 0),
      maintenancePending: Boolean(source.economy?.maintenancePending)
    }
  };
};

const sanitizeLedgerEntries = (value, limit) => (
  Array.isArray(value) ? value.filter(isPlainObject).slice(-limit) : []
);

export const validateCampaignImport = (data) => {
  const errors = [];
  if (!isPlainObject(data)) errors.push('root');
  ['personal', 'attributes', 'skills', 'traits', 'passions', 'gear', 'family', 'journal'].forEach(key => {
    if (!isPlainObject(data?.[key])) errors.push(key);
  });
  return {
    ok: errors.length === 0,
    errors
  };
};

export const sanitizeCampaignState = (data, defaults) => {
  const source = isPlainObject(data) ? deepClone(data) : {};
  const sourceSchemaVersion = clampInt(source.campaign?.schemaVersion, 0, 100, 0);

  if (source.passions?.hateSarasens !== undefined) {
    if (source.passions.hateSaracens === undefined || source.passions.hateSaracens === 12) {
      source.passions.hateSaracens = source.passions.hateSarasens;
    }
    delete source.passions.hateSarasens;
  }
  if (source.passionsChecked?.hateSarasens !== undefined) {
    if (source.passionsChecked.hateSaracens === undefined) {
      source.passionsChecked.hateSaracens = source.passionsChecked.hateSarasens;
    }
    delete source.passionsChecked.hateSarasens;
  }
  if (source.passions?.loveCharlemagne === undefined && source.passions?.loyaltyLiege !== undefined) {
    source.passions.loveCharlemagne = source.passions.loyaltyLiege;
  }
  if (source.passionsChecked?.loveCharlemagne === undefined && source.passionsChecked?.loyaltyLiege !== undefined) {
    source.passionsChecked.loveCharlemagne = source.passionsChecked.loyaltyLiege;
  }

  const personal = {
    ...defaults.personal,
    ...(isPlainObject(source.personal) ? source.personal : {})
  };
  personal.name = sanitizeString(personal.name, defaults.personal.name);
  personal.age = clampInt(personal.age, 0, 120, defaults.personal.age);
  personal.campaignYear = clampInt(personal.campaignYear, 700, 1200, defaults.personal.campaignYear);
  if (personal.maintenance === 'miserly') personal.maintenance = 'impoverished';
  if (!['impoverished', 'poor', 'ordinary', 'rich', 'superlative'].includes(personal.maintenance)) {
    personal.maintenance = defaults.personal.maintenance || 'ordinary';
  }
  personal.features = sanitizeStringArray(personal.features, defaults.personal.features);

  const attributes = sanitizeNumberMap(source.attributes, defaults.attributes, 0, RULE_SCORE_MAX);
  attributes.currentHp = clampInt(source.attributes?.currentHp, -1000, attributes.siz + attributes.con, attributes.siz + attributes.con);

  const traits = normalizeOpposedTraits(
    sanitizeNumberMap(source.traits, defaults.traits, 0, RULE_SCORE_MAX),
    defaults.traits
  );

  const gear = {
    ...defaults.gear,
    ...(isPlainObject(source.gear) ? source.gear : {})
  };
  gear.cash = clampNumber(gear.cash, 0, 100000, defaults.gear.cash);
  gear.gloryThisGame = clampInt(gear.gloryThisGame, 0, 1000000, defaults.gear.gloryThisGame);
  gear.gloryTotal = clampInt(gear.gloryTotal, 0, 10000000, defaults.gear.gloryTotal);

  const family = {
    ...defaults.family,
    ...(isPlainObject(source.family) ? source.family : {})
  };
  family.members = sanitizeFamilyMembers(family.members, defaults.family.members);
  family.patronSaintBenefit = sanitizeEffectSummary(family.patronSaintBenefit, defaults.family.patronSaintBenefit);
  family.ancestorRollLog = Array.isArray(family.ancestorRollLog) ? family.ancestorRollLog.filter(line => typeof line === 'string').slice(-500) : [];
  family.ancestorApplied = Boolean(family.ancestorApplied);

  const sourceLifecycle = isPlainObject(source.campaign?.lifecycle) ? source.campaign.lifecycle : {};
  if (sourceLifecycle.careerStatus === 'pending_succession') {
    sourceLifecycle.careerStatus = 'historical';
    sourceLifecycle.status = 'pending_successor';
    sourceLifecycle.activeCharacterId = null;
    sourceLifecycle.pendingSuccession = true;
    sourceLifecycle.unresolvedChoices = [...new Set([...(sourceLifecycle.unresolvedChoices || []), 'migrated_career_end_status'])];
  }
  if (!sourceLifecycle.salvation && isPlainObject(source.campaign?.salvation)) {
    sourceLifecycle.salvation = {
      salvationId: `migrated-salvation:${source.campaign.salvation.sourceCharacterId || 'unknown'}:${source.campaign.salvation.year || personal.campaignYear}`,
      migratedLegacyRecord: source.campaign.salvation,
      roll: source.campaign.salvation.outcome ? {
        result: source.campaign.salvation.outcome,
        target: source.campaign.salvation.score,
        source: 'migrated-v4',
        sourceRuleId: 'LIFE-SALVATION-001'
      } : null,
      destination: source.campaign.salvation.destination || null,
      canonization: { eligible: false, status: source.campaign.salvation.canonized ? 'migrated_unverified' : 'not_eligible', churchRoll: null }
    };
  }
  if (!sourceLifecycle.legacy && isPlainObject(source.campaign?.legacy)) {
    sourceLifecycle.legacy = {
      ...source.campaign.legacy,
      legacyId: `migrated-legacy:${source.campaign.legacy.sourceCharacterId || 'unknown'}`,
      predecessorId: source.campaign.legacy.sourceCharacterId || null,
      transferableScores: [],
      selectedTransfers: [],
      scoreCaps: { salvation: source.campaign.legacy.salvationScore || 0, transferCount: source.campaign.legacy.transferSlots || 1 },
      birthGiftGrant: { grantId: 'migrated-v4-birth-gift', count: source.campaign.legacy.birthGiftRolls || 1, consumed: false, sourceRuleId: 'LIFE-LEGACY-001' },
      blessingGrant: source.campaign.legacy.blessingRolls ? { grantId: 'migrated-v4-blessing', count: 0, consumed: true, sourceRuleId: 'LIFE-SAINT-001', migrationNote: '기존 텍스트만으로 새 축복 grant를 만들지 않음' } : null,
      inheritableEquipment: [],
      inheritableManors: [],
      inheritableFamilyData: {},
      unresolvedChoices: ['migrated_v4_legacy_review'],
      consumed: false,
      sourceRuleIds: ['LIFE-LEGACY-001']
    };
  }
  const lifecycle = sanitizeLifecycleState(sourceLifecycle, { personal, attributes, family });
  const health = sanitizeHealthState(source.campaign?.health, attributes);
  if (['deceased', 'retired', 'historical'].includes(lifecycle.careerStatus)) {
    health.pendingDeath = null;
    health.majorWoundCourage = null;
  }
  const economy = sanitizeEconomyState(
    source.campaign?.economy,
    { personal, gear, family },
    source.campaign?.pendingEconomy
  );
  gear.cash = toLivres(economy.coinDeniers);
  family.manors = economy.estates.filter(estate => estate.status === 'active').length;

  return {
    ...defaults,
    ...source,
    personal,
    attributes,
    traits,
    skills: sanitizeNumberMap(source.skills, defaults.skills, 0, RULE_SCORE_MAX),
    skillsChecked: sanitizeCheckedMap(source.skillsChecked, defaults.skillsChecked),
    traitsChecked: sanitizeCheckedMap(source.traitsChecked, defaults.traitsChecked || {}),
    passions: sanitizeNumberMap(source.passions, defaults.passions, 0, RULE_SCORE_MAX),
    passionsChecked: sanitizeCheckedMap(source.passionsChecked, defaults.passionsChecked),
    standings: sanitizeNumberMap(source.standings, defaults.standings, 0, RULE_SCORE_MAX),
    standingsChecked: sanitizeCheckedMap(source.standingsChecked, defaults.standingsChecked || {}),
    squire: {
      ...defaults.squire,
      ...(isPlainObject(source.squire) ? source.squire : {}),
      age: clampInt(source.squire?.age, 0, 30, defaults.squire.age)
    },
    horses: {
      ...defaults.horses,
      ...(isPlainObject(source.horses) ? source.horses : {}),
      warhorse: {
        ...defaults.horses.warhorse,
        ...(isPlainObject(source.horses?.warhorse) ? source.horses.warhorse : {}),
        hp: clampInt(source.horses?.warhorse?.hp, 0, 100, defaults.horses.warhorse.hp),
        armor: clampInt(source.horses?.warhorse?.armor, 0, 20, defaults.horses.warhorse.armor)
      }
    },
    gear,
    family,
    journal: sanitizeJournal(source.journal, defaults.journal),
    campaign: {
      ...(isPlainObject(source.campaign) ? source.campaign : {}),
      schemaVersion: 12,
      appliedEvents: sanitizeAppliedEvents(source.campaign?.appliedEvents),
      saveRevision: clampInt(source.campaign?.saveRevision, 0, Number.MAX_SAFE_INTEGER, 0),
      chronicleEvents: Array.isArray(source.campaign?.chronicleEvents)
        ? source.campaign.chronicleEvents.filter(isPlainObject).slice(-500)
        : [],
      gloryLedger: sanitizeLedgerEntries(
        source.campaign?.gloryLedger || source.gear?.gloryLedger,
        1000
      ),
      standingLedger: sanitizeLedgerEntries(source.campaign?.standingLedger, 1000),
      honorLedger: sanitizeLedgerEntries(source.campaign?.honorLedger, 1000),
      familyTimeline: sanitizeLedgerEntries(source.campaign?.familyTimeline, 500),
      gloryBonusClaimedThreshold: source.campaign?.gloryBonusClaimedThreshold !== undefined
        ? clampInt(source.campaign.gloryBonusClaimedThreshold, 0, 10000, 0)
        : sourceSchemaVersion < 6
          ? Math.floor(gear.gloryTotal / 1000)
          : clampInt(defaults.campaign?.gloryBonusClaimedThreshold, 0, 10000, 0),
      passionStates: undefined,
      personalityMagic: sanitizePersonalityMagicState(source.campaign?.personalityMagic, source.campaign?.passionStates),
      health,
      combat: sanitizeChapter7CombatState(source.campaign?.combat, { ...defaults, ...source }),
      combatHistory: sanitizeLedgerEntries(source.campaign?.combatHistory, 250),
      skirmish: sanitizeSkirmishState(source.campaign?.skirmish),
      massBattle: sanitizeMassBattleState(source.campaign?.massBattle),
      siege: sanitizeSiegeState(source.campaign?.siege),
      skirmishHistory: sanitizeLedgerEntries(source.campaign?.skirmishHistory, 100),
      battleHistory: sanitizeLedgerEntries(source.campaign?.battleHistory, 100),
      siegeHistory: sanitizeLedgerEntries(source.campaign?.siegeHistory, 100),
      captives: sanitizeLedgerEntries(source.campaign?.captives, 1000),
      pendingEconomy: [],
      economy,
      adventures: sanitizeAdventureLedger(source.campaign?.adventures),
      chapter18: sanitizeChapter18Ledger(source.campaign?.chapter18),
      conditions: sanitizeLedgerEntries(source.campaign?.conditions, 100),
      fortresses: sanitizeLedgerEntries(source.campaign?.fortresses, 100),
      captivity: isPlainObject(source.campaign?.captivity) ? source.campaign.captivity : null,
      lifecycle,
      characterCreationSession: sanitizeCharacterCreationSession(source.campaign?.characterCreationSession),
      completedCreationIds: Array.isArray(source.campaign?.completedCreationIds)
        ? source.campaign.completedCreationIds.filter(id => typeof id === 'string').slice(-100)
        : [],
      characterArchives: Array.isArray(source.campaign?.characterArchives)
        ? source.campaign.characterArchives.filter(isPlainObject).slice(-25)
        : [],
      preparedCharacter: isPlainObject(source.campaign?.preparedCharacter) ? source.campaign.preparedCharacter : null,
      preparedCharacters: Array.isArray(source.campaign?.preparedCharacters)
        ? source.campaign.preparedCharacters.filter(isPlainObject).slice(-10)
        : [],
      winter: sanitizeWinter(source.campaign?.winter, personal.campaignYear)
    }
  };
};

export const hasAppliedEvent = (character, eventId) => Boolean(character?.campaign?.appliedEvents?.[eventId]);

export const markAppliedEvent = (character, eventId, label) => ({
  ...(character.campaign || {}),
  schemaVersion: 12,
  appliedEvents: {
    ...(character.campaign?.appliedEvents || {}),
    [eventId]: {
      appliedAt: new Date().toISOString(),
      year: character.personal?.campaignYear,
      label: label || eventId
    }
  },
  personalityMagic: sanitizePersonalityMagicState(character.campaign?.personalityMagic, character.campaign?.passionStates),
  passionStates: undefined,
  winter: character.campaign?.winter
});

export const applyOnce = (character, eventId, updater, label) => {
  if (hasAppliedEvent(character, eventId)) {
    return { character, applied: false };
  }
  const updated = updater(deepClone(character));
  updated.campaign = markAppliedEvent(updated, eventId, label);
  return { character: updated, applied: true };
};

export const appendWinterLog = (character, message) => {
  const year = character.personal?.campaignYear || 767;
  const winter = sanitizeWinter(character.campaign?.winter, year);
  return {
    ...(character.campaign || {}),
    schemaVersion: 12,
    appliedEvents: character.campaign?.appliedEvents || {},
    personalityMagic: sanitizePersonalityMagicState(character.campaign?.personalityMagic, character.campaign?.passionStates),
    passionStates: undefined,
    winter: {
      ...winter,
      year,
      logs: [...winter.logs, message].slice(-250)
    }
  };
};

export const markWinterStep = (character, step, status = 'resolved') => {
  const year = character.personal?.campaignYear || 767;
  const winter = sanitizeWinter(character.campaign?.winter, year);
  return {
    ...(character.campaign || {}),
    schemaVersion: 12,
    appliedEvents: character.campaign?.appliedEvents || {},
    personalityMagic: sanitizePersonalityMagicState(character.campaign?.personalityMagic, character.campaign?.passionStates),
    passionStates: undefined,
    winter: {
      ...winter,
      year,
      steps: {
        ...winter.steps,
        [step]: status
      }
    }
  };
};

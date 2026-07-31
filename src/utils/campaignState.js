const TRAIT_PAIRS = [
  ['chaste', 'lustful'],
  ['energetic', 'lazy'],
  ['forgiving', 'vengeful'],
  ['generous', 'selfish'],
  ['honest', 'deceitful'],
  ['just', 'arbitrary'],
  ['merciful', 'cruel'],
  ['modest', 'proud'],
  ['prudent', 'reckless'],
  ['temperate', 'indulgent'],
  ['trusting', 'suspicious'],
  ['valorous', 'cowardly']
];

const VALID_STATUSES = new Set(['생존', '사망', '은퇴', '실종', '질병', '포로']);
const VALID_GENDERS = new Set(['male', 'female', 'unknown']);
const HEROIC_SCORE_MAX = 30;

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
  const defaultSteps = {
    aging: 'pending',
    harvest: 'pending',
    survival: 'pending',
    personalEvent: 'pending',
    familyEvent: 'pending',
    experience: 'pending',
    training: 'pending',
    annualGlory: 'pending',
    maintenance: 'pending'
  };
  const validStepState = new Set(['pending', 'resolved', 'skipped']);
  const steps = Object.entries({ ...defaultSteps, ...source.steps }).reduce((acc, [key, value]) => {
    acc[key] = validStepState.has(value) ? value : defaultSteps[key] || 'pending';
    return acc;
  }, {});
  return {
    year: clampInt(source.year, 700, 1200, campaignYear),
    steps,
    logs: Array.isArray(source.logs) ? source.logs.filter(line => typeof line === 'string').slice(-250) : [],
    unresolved: isPlainObject(source.unresolved) ? source.unresolved : {},
    gloryBonusPoints: clampInt(source.gloryBonusPoints, 0, 20, 0),
    bonusSpent: clampInt(source.bonusSpent, 0, 20, 0),
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

const sanitizePassionStates = (value) => {
  if (!Array.isArray(value)) return [];
  const validTypes = new Set(['shock', 'melancholy', 'madness']);
  const validStatuses = new Set(['active', 'resolved']);
  return value
    .filter(isPlainObject)
    .map((entry, index) => ({
      id: sanitizeString(entry.id, `passion_state_${index + 1}`),
      type: validTypes.has(entry.type) ? entry.type : 'shock',
      status: validStatuses.has(entry.status) ? entry.status : 'active',
      passionKey: typeof entry.passionKey === 'string' ? entry.passionKey : '',
      passionLabel: typeof entry.passionLabel === 'string' ? entry.passionLabel : '',
      year: clampInt(entry.year, 700, 1200, 767),
      note: typeof entry.note === 'string' ? entry.note : '',
      createdAt: typeof entry.createdAt === 'string' ? entry.createdAt : new Date().toISOString()
    }))
    .slice(-50);
};

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

  const attributes = sanitizeNumberMap(source.attributes, defaults.attributes, 0, HEROIC_SCORE_MAX);
  attributes.currentHp = clampInt(source.attributes?.currentHp, 0, attributes.siz + attributes.con, attributes.siz + attributes.con);

  const traits = sanitizeNumberMap(source.traits, defaults.traits, 0, HEROIC_SCORE_MAX);
  TRAIT_PAIRS.forEach(([primary, opposite]) => {
    const primaryVal = clampInt(traits[primary], 0, HEROIC_SCORE_MAX, defaults.traits[primary] ?? 10);
    const oppositeVal = clampInt(traits[opposite], 0, HEROIC_SCORE_MAX, Math.max(0, 20 - primaryVal));
    if (primaryVal + oppositeVal !== 20) {
      traits[primary] = primaryVal;
      traits[opposite] = Math.max(0, 20 - primaryVal);
    } else {
      traits[primary] = primaryVal;
      traits[opposite] = oppositeVal;
    }
  });

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
  family.ancestorRollLog = Array.isArray(family.ancestorRollLog) ? family.ancestorRollLog.filter(line => typeof line === 'string').slice(-500) : [];
  family.ancestorApplied = Boolean(family.ancestorApplied);

  const sourceLifecycle = isPlainObject(source.campaign?.lifecycle) ? source.campaign.lifecycle : {};
  const validCareerStatuses = new Set(['active', 'incapacitated', 'deceased', 'retired', 'pending_succession']);
  const self = family.members.find(member => member.relation === '본인');
  const attributeValues = ['siz', 'dex', 'str', 'con', 'app'].map(key => Number(attributes[key]));
  let careerStatus = validCareerStatuses.has(sourceLifecycle.careerStatus) ? sourceLifecycle.careerStatus : 'active';
  if (attributeValues.some(value => Number.isFinite(value) && value <= 0) || self?.status === '사망') {
    careerStatus = 'deceased';
  } else if (self?.status === '은퇴') {
    careerStatus = 'retired';
  } else if (attributeValues.some(value => Number.isFinite(value) && value <= 3)) {
    careerStatus = 'incapacitated';
  } else if (self?.status === '생존' && !['pending_succession', 'retired', 'deceased'].includes(careerStatus)) {
    careerStatus = 'active';
  }
  const lifecycle = {
    ...sourceLifecycle,
    careerStatus,
    activeCharacterId: self?.status === '생존' && ['active', 'incapacitated'].includes(careerStatus) ? self.id : null,
    pendingSuccession: Boolean(sourceLifecycle.pendingSuccession || ['deceased', 'retired', 'pending_succession'].includes(careerStatus))
  };

  return {
    ...defaults,
    ...source,
    personal,
    attributes,
    traits,
    skills: sanitizeNumberMap(source.skills, defaults.skills, 0, HEROIC_SCORE_MAX),
    skillsChecked: sanitizeCheckedMap(source.skillsChecked, defaults.skillsChecked),
    traitsChecked: sanitizeCheckedMap(source.traitsChecked, defaults.traitsChecked || {}),
    passions: sanitizeNumberMap(source.passions, defaults.passions, 0, HEROIC_SCORE_MAX),
    passionsChecked: sanitizeCheckedMap(source.passionsChecked, defaults.passionsChecked),
    standings: sanitizeNumberMap(source.standings, defaults.standings, 0, HEROIC_SCORE_MAX),
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
      schemaVersion: 3,
      appliedEvents: sanitizeAppliedEvents(source.campaign?.appliedEvents),
      passionStates: sanitizePassionStates(source.campaign?.passionStates),
      lifecycle,
      winter: sanitizeWinter(source.campaign?.winter, personal.campaignYear)
    }
  };
};

export const hasAppliedEvent = (character, eventId) => Boolean(character?.campaign?.appliedEvents?.[eventId]);

export const markAppliedEvent = (character, eventId, label) => ({
  ...(character.campaign || {}),
  schemaVersion: 3,
  appliedEvents: {
    ...(character.campaign?.appliedEvents || {}),
    [eventId]: {
      appliedAt: new Date().toISOString(),
      year: character.personal?.campaignYear,
      label: label || eventId
    }
  },
  passionStates: character.campaign?.passionStates || [],
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
    schemaVersion: 3,
    appliedEvents: character.campaign?.appliedEvents || {},
    passionStates: character.campaign?.passionStates || [],
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
    schemaVersion: 3,
    appliedEvents: character.campaign?.appliedEvents || {},
    passionStates: character.campaign?.passionStates || [],
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

import { resolveD20Roll, rollDie } from './coreRules.js';
import { RELIGIOUS_TRAITS } from './personalityRules.js';
import { getSuccessorEligibility } from './campaignRules.js';
import { appendChronicleEvent, appendFamilyTimeline } from './ledgerRules.js';

export const LIFECYCLE_SCHEMA_VERSION = 6;

export const LIFECYCLE_STATES = Object.freeze([
  'active',
  'incapacitated',
  'bedridden',
  'deceased',
  'retired',
  'pending_salvation',
  'pending_legacy',
  'pending_successor',
  'successor_in_creation',
  'historical'
]);

export const CAREER_STATUSES = Object.freeze([
  'active', 'incapacitated', 'bedridden', 'deceased', 'retired', 'historical'
]);

export const SAINT_BLESSINGS = Object.freeze([
  { range: [1, 3], key: 'protection', label: '수호 (Protection)', effect: '자연 방어력 1' },
  { range: [4, 4], key: 'horseWhisperer', label: '말과의 교감 (Horse-whisperer)', effect: '말과 특별한 교감' },
  { range: [5, 5], key: 'poisonResistance', label: '독 저항 (Poison resistance)', effect: '독 피해 절반' },
  { range: [6, 8], key: 'prosperity', label: '번영 (Prosperity)', effect: '겨울 수확 판정 +3' },
  { range: [9, 11], key: 'fertility', label: '다산 (Fertility)', effect: '출산 판정 +5' },
  { range: [12, 13], key: 'eternalYouth', label: '영원한 젊음 (Eternal youth)', effect: '35세부터 노화 판정' },
  { range: [14, 14], key: 'fireResistance', label: '불 저항 (Fire resistance)', effect: '불 피해 절반' },
  { range: [15, 15], key: 'birdAffinity', label: '새와의 교감 (Bird affinity)', effect: '새와 특별한 교감' },
  { range: [16, 17], key: 'premonition', label: '예지 (Premonition)', effect: 'Love [God] 성공 시 예지' },
  { range: [18, 19], key: 'healingHands', label: '치유의 손길 (Healing hands)', effect: '매주 1d3 회복' },
  { range: [20, 20], key: 'truthSense', label: '진실 감지 (Truth sense)', effect: 'd20 대 영광 보너스 판정' }
]);

const clone = value => JSON.parse(JSON.stringify(value));
const asInt = (value, fallback = 0) => Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : fallback;
const clamp = (value, min, max) => Math.min(max, Math.max(min, asInt(value, min)));
const iso = value => typeof value === 'string' ? value : (value || new Date()).toISOString();
const safeId = value => String(value || '').replace(/[^a-z0-9:_-]/gi, '_');
const stateSet = new Set(LIFECYCLE_STATES);
const careerSet = new Set(CAREER_STATUSES);

const getSelf = character => {
  const activeId = character?.campaign?.lifecycle?.activeCharacterId;
  return character?.family?.members?.find(member => member.id === activeId)
    || character?.family?.members?.find(member => member.relation === '본인');
};

export const getActiveCharacterIdentity = character => {
  const lifecycle = character?.campaign?.lifecycle || {};
  const explicitlyWithoutActiveCharacter = Object.hasOwn(lifecycle, 'activeCharacterId')
    && !lifecycle.activeCharacterId;
  const member = lifecycle.activeCharacterId
    ? character?.family?.members?.find(entry => entry.id === lifecycle.activeCharacterId)
    : character?.family?.members?.find(entry => entry.relation === '본인');
  const careerStatus = lifecycle.careerStatus || member?.lifecycleStatus || 'active';
  const active = !explicitlyWithoutActiveCharacter
    && !['deceased', 'retired', 'historical'].includes(careerStatus);

  return {
    active,
    id: active ? lifecycle.activeCharacterId || member?.id || null : null,
    name: active
      ? character?.personal?.name || member?.name || '이름 없는 기사'
      : '활성 기사 없음',
    predecessorName: active ? null : character?.personal?.name || member?.name || null
  };
};

const appendJournal = (character, year, text, timestamp) => {
  const key = String(year);
  const prior = character.journal?.[key]?.text || '';
  character.journal = {
    ...(character.journal || {}),
    [key]: {
      text: [prior, text].filter(Boolean).join('\n\n'),
      updatedAt: timestamp
    }
  };
};

const ensureCampaign = character => {
  character.campaign = character.campaign || {};
  character.campaign.schemaVersion = LIFECYCLE_SCHEMA_VERSION;
  character.campaign.appliedEvents = character.campaign.appliedEvents || {};
  character.campaign.chronicleEvents = Array.isArray(character.campaign.chronicleEvents)
    ? character.campaign.chronicleEvents
    : [];
  character.campaign.saveRevision = Math.max(0, asInt(character.campaign.saveRevision));
  character.campaign.lifecycle = sanitizeLifecycleState(character.campaign.lifecycle, character);
};

const appendLifecycleEvent = (character, event) => {
  ensureCampaign(character);
  character.campaign.lifecycle.events = [
    ...(character.campaign.lifecycle.events || []),
    event
  ].slice(-250);
  const trigger = String(event.triggeringEvent || '');
  const familyType = trigger.includes('knighting') ? 'knighting'
    : trigger.includes('successor') ? 'succession'
      : trigger.includes('church_standing') ? 'canonization'
        : character.campaign.lifecycle.careerStatus === 'deceased' && event.nextStatus === 'pending_salvation' ? 'death'
          : character.campaign.lifecycle.careerStatus === 'retired' && event.nextStatus === 'pending_salvation' ? 'retirement'
            : ['incapacitated', 'bedridden', 'active'].includes(event.nextStatus) ? event.nextStatus : 'legacy';
  const title = familyType === 'death' ? `${character.personal?.name || '기사'}의 죽음`
    : familyType === 'retirement' ? `${character.personal?.name || '기사'}의 은퇴`
      : familyType === 'knighting' ? `${character.personal?.name || '기사'}의 기사 서임`
        : familyType === 'succession' ? '새 계승자를 정하다'
          : familyType === 'canonization' ? '시성 심사'
            : `${character.personal?.name || '기사'} · ${statusLabel(event.nextStatus)}`;
  const narrative = event.cause
    ? `${event.cause}. ${event.triggeringEvent || ''}`.trim()
    : String(event.triggeringEvent || '생애의 전환을 기록했습니다.');
  appendChronicleEvent(character, { ...event, id: event.lifecycleEventId, type: familyType, title, narrative });
  appendFamilyTimeline(character, {
    ...event,
    id: `family:${event.lifecycleEventId}`,
    type: familyType,
    memberId: character.campaign.lifecycle.primaryCharacterId,
    title,
    narrative
  });
  character.campaign.appliedEvents[event.lifecycleEventId] = {
    appliedAt: event.timestamp,
    year: event.year,
    label: event.triggeringEvent || event.cause || event.nextStatus,
    sourceRuleId: event.sourceRuleId,
    effectIds: event.appliedEffectIds
  };
  character.campaign.saveRevision += 1;
};

const statusLabel = status => ({
  active: '활동 중',
  incapacitated: '행동 불능',
  bedridden: '병상 상태',
  deceased: '사망',
  retired: '은퇴',
  historical: '역사적 인물'
}[status] || status);

const familyStatus = status => ({
  active: '생존', incapacitated: '행동 불능', bedridden: '병상', deceased: '사망', retired: '은퇴', historical: '역사적'
}[status] || '생존');

const buildEvent = (character, {
  eventId,
  sourceRuleId = 'LIFE-001',
  previousStatus,
  nextStatus,
  cause,
  year,
  age,
  sourcePage,
  triggeringEvent,
  unresolvedChoices = [],
  appliedEffectIds = [],
  journalEntryId,
  timestamp
}) => ({
  lifecycleEventId: eventId,
  sourceRuleId,
  previousStatus,
  nextStatus,
  cause: String(cause || ''),
  year: asInt(year, character.personal?.campaignYear || 767),
  age: asInt(age, character.personal?.age || 0),
  sourcePage,
  triggeringEvent: String(triggeringEvent || ''),
  unresolvedChoices: [...unresolvedChoices],
  appliedEffectIds: [...appliedEffectIds],
  journalEntryId,
  timestamp
});

const applyLivingTransition = (character, nextCareerStatus, options = {}) => {
  const next = clone(character);
  ensureCampaign(next);
  const lifecycle = next.campaign.lifecycle;
  if (['deceased', 'retired', 'historical'].includes(lifecycle.careerStatus)) {
    return { character, applied: false, reason: 'career_already_ended' };
  }
  const timestamp = iso(options.timestamp);
  const year = asInt(options.year, next.personal?.campaignYear || 767);
  const eventId = safeId(options.eventId || `lifecycle:${nextCareerStatus}:${lifecycle.activeCharacterId || 'self'}:${year}`);
  if (next.campaign.appliedEvents[eventId]) return { character, applied: false, duplicate: true };
  const previousStatus = lifecycle.careerStatus;
  const journalEntryId = `journal:${eventId}`;
  const effectId = `effect:${eventId}:status`;
  lifecycle.status = nextCareerStatus;
  lifecycle.careerStatus = nextCareerStatus;
  lifecycle.pendingCareerEnd = null;
  lifecycle.lastTransitionAt = timestamp;
  lifecycle.unresolvedChoices = [];
  const self = getSelf(next);
  if (self) {
    self.status = familyStatus(nextCareerStatus);
    self.lifecycleStatus = nextCareerStatus;
    self.statusCause = String(options.cause || '');
  }
  const message = `${year}년, ${next.personal?.name || '기사'}: ${statusLabel(previousStatus)}에서 ${statusLabel(nextCareerStatus)}로 전환. ${options.cause || ''}`.trim();
  appendJournal(next, year, message, timestamp);
  const event = buildEvent(next, {
    ...options,
    eventId,
    previousStatus,
    nextStatus: nextCareerStatus,
    year,
    sourcePage: options.sourcePage || 'Chapter 1 pp. 42-44; Chapter 10 pp. 174-175',
    triggeringEvent: options.triggeringEvent || nextCareerStatus,
    appliedEffectIds: [effectId],
    journalEntryId,
    timestamp
  });
  appendLifecycleEvent(next, event);
  return { character: next, applied: true, event };
};

export const resolveIncapacitation = (character, options = {}) => (
  applyLivingTransition(character, 'incapacitated', {
    ...options,
    sourceRuleId: options.sourceRuleId || 'LIFE-001',
    sourcePage: options.sourcePage || 'Chapter 1 p. 42',
    triggeringEvent: options.triggeringEvent || 'temporary_incapacitation'
  })
);

export const resolveBedridden = (character, options = {}) => (
  applyLivingTransition(character, 'bedridden', {
    ...options,
    sourceRuleId: options.sourceRuleId || 'WINTER-AGING-001',
    sourcePage: options.sourcePage || 'Chapter 10 pp. 174-175',
    triggeringEvent: options.triggeringEvent || 'attribute_at_or_below_three'
  })
);

export const resolveRecovery = (character, options = {}) => {
  const status = character?.campaign?.lifecycle?.careerStatus;
  if (!['incapacitated', 'bedridden'].includes(status)) return { character, applied: false, reason: 'not_incapacitated' };
  return applyLivingTransition(character, 'active', {
    ...options,
    sourceRuleId: options.sourceRuleId || 'LIFE-001',
    sourcePage: options.sourcePage || 'Owning recovery rule',
    triggeringEvent: options.triggeringEvent || 'recovery_confirmed'
  });
};

export const prepareCareerEnd = (character, options = {}) => {
  const type = options.type;
  if (!['death', 'retirement'].includes(type)) return { character, prepared: false, reason: 'invalid_type' };
  const next = clone(character);
  ensureCampaign(next);
  const lifecycle = next.campaign.lifecycle;
  if (['deceased', 'retired', 'historical'].includes(lifecycle.careerStatus)) return { character, prepared: false, reason: 'career_already_ended' };
  const timestamp = iso(options.timestamp);
  const year = asInt(options.year, next.personal?.campaignYear || 767);
  const lifecycleEventId = safeId(options.eventId || `lifecycle:${type}:${lifecycle.activeCharacterId || 'self'}:${year}`);
  lifecycle.pendingCareerEnd = {
    lifecycleEventId,
    type,
    cause: String(options.cause || ''),
    year,
    age: asInt(options.age, next.personal?.age || 0),
    sourceRuleId: options.sourceRuleId || (type === 'death' ? 'LIFE-001' : 'LIFE-001'),
    sourcePage: options.sourcePage || 'Chapter 1 p. 42',
    triggeringEvent: String(options.triggeringEvent || (type === 'death' ? 'explicit_death' : 'definitive_retirement')),
    unresolvedChoices: ['career_end_confirmation'],
    preparedAt: timestamp
  };
  next.campaign.saveRevision += 1;
  return { character: next, prepared: true, pending: lifecycle.pendingCareerEnd };
};

export const cancelCareerEnd = character => {
  const next = clone(character);
  ensureCampaign(next);
  if (!next.campaign.lifecycle.pendingCareerEnd) return { character, cancelled: false };
  next.campaign.lifecycle.pendingCareerEnd = null;
  next.campaign.saveRevision += 1;
  return { character: next, cancelled: true };
};

const resolveCareerEndType = (character, type, options = {}) => {
  const next = clone(character);
  ensureCampaign(next);
  const lifecycle = next.campaign.lifecycle;
  const pending = options.pending || lifecycle.pendingCareerEnd;
  if (!pending || pending.type !== type) return { character, applied: false, reason: 'confirmation_required' };
  if (next.campaign.appliedEvents[pending.lifecycleEventId]) return { character, applied: false, duplicate: true };
  if (['deceased', 'retired', 'historical'].includes(lifecycle.careerStatus)) return { character, applied: false, reason: 'career_already_ended' };

  const timestamp = iso(options.timestamp || pending.preparedAt);
  const year = asInt(pending.year, next.personal?.campaignYear || 767);
  const previousStatus = lifecycle.careerStatus;
  const careerStatus = type === 'death' ? 'deceased' : 'retired';
  const journalEntryId = `journal:${pending.lifecycleEventId}`;
  const appliedEffectIds = [
    `effect:${pending.lifecycleEventId}:sheet`,
    `effect:${pending.lifecycleEventId}:family`,
    `effect:${pending.lifecycleEventId}:journal`,
    `effect:${pending.lifecycleEventId}:salvation`
  ];
  const self = getSelf(next);
  if (self) {
    self.status = familyStatus(careerStatus);
    self.lifecycleStatus = careerStatus;
    self.statusCause = pending.cause;
    if (type === 'death') {
      self.deathYear = year;
      self.deathCause = pending.cause;
      const birth = String(self.lifeYears || '').split('~')[0] || year - asInt(pending.age);
      self.lifeYears = `${birth}~${year}`;
    } else {
      self.retirementYear = year;
      self.retirementReason = pending.cause;
    }
  }
  lifecycle.status = 'pending_salvation';
  lifecycle.careerStatus = careerStatus;
  lifecycle.activeCharacterId = null;
  lifecycle.primaryCharacterId = self?.id || lifecycle.primaryCharacterId || null;
  lifecycle.pendingCareerEnd = null;
  lifecycle.salvationEligibility = {
    eligible: true,
    reason: type === 'death' ? 'death' : 'definitive_retirement',
    sourceRuleId: 'LIFE-SALVATION-001',
    sourcePage: 'Chapter 1 p. 41'
  };
  lifecycle.pendingSuccession = true;
  lifecycle.endedAtYear = year;
  lifecycle.endReason = pending.cause;
  lifecycle.predecessorSnapshot = createPredecessorSnapshot(next, self);
  lifecycle.unresolvedChoices = ['salvation_ledger', 'salvation_roll'];
  const message = type === 'death'
    ? `${year}년, ${next.personal?.name || '기사'} 사망. 원인: ${pending.cause || '기록되지 않음'}. 구원 판정이 남아 있습니다.`
    : `${year}년, ${next.personal?.name || '기사'} 확정 은퇴. 사유: ${pending.cause || '기록되지 않음'}. 구원 판정이 남아 있습니다.`;
  appendJournal(next, year, message, timestamp);
  const event = buildEvent(next, {
    ...pending,
    eventId: pending.lifecycleEventId,
    previousStatus,
    nextStatus: 'pending_salvation',
    sourceRuleId: pending.sourceRuleId || 'LIFE-001',
    unresolvedChoices: lifecycle.unresolvedChoices,
    appliedEffectIds,
    journalEntryId,
    timestamp
  });
  appendLifecycleEvent(next, event);
  return { character: next, applied: true, event };
};

export const resolveDeath = (character, options = {}) => resolveCareerEndType(character, 'death', options);
export const resolveRetirement = (character, options = {}) => resolveCareerEndType(character, 'retirement', options);
export const resolveCareerEnd = (character, options = {}) => {
  const pending = character?.campaign?.lifecycle?.pendingCareerEnd;
  return pending?.type === 'death' ? resolveDeath(character, options) : resolveRetirement(character, options);
};

export const resolveAttributeLifecycle = (character, options = {}) => {
  const values = ['siz', 'dex', 'str', 'con', 'app'].map(key => Number(character?.attributes?.[key]));
  if (values.some(value => Number.isFinite(value) && value <= 0)) {
    const prepared = prepareCareerEnd(character, { ...options, type: 'death', cause: options.cause || '능력치가 0에 도달' });
    return prepared.prepared ? resolveDeath(prepared.character, { timestamp: options.timestamp }) : prepared;
  }
  if (values.some(value => Number.isFinite(value) && value <= 3)) {
    return resolveBedridden(character, { ...options, cause: options.cause || '능력치가 3 이하' });
  }
  return { character, applied: false, reason: 'no_lifecycle_change' };
};

const passionBonus = value => Math.min(5, Math.max(0, asInt(value) - 15));

export const calculateSalvationLedger = (character, deeds = {}) => {
  const traits = character?.traits || {};
  const religious = RELIGIOUS_TRAITS.map(key => ({ key, value: asInt(traits[key]) }));
  const baseStatistic = Math.min(...religious.map(entry => entry.value));
  const selectedReligiousTrait = religious.find(entry => entry.value === baseStatistic) || religious[0];
  const passions = character?.passions || {};
  const amorKey = deeds.amorKey && Object.hasOwn(passions, deeds.amorKey)
    ? deeds.amorKey
    : Object.keys(passions).find(key => /^amor/i.test(key));
  const passionBonuses = [
    { key: amorKey || 'amor', label: 'Amor', value: asInt(passions[amorKey] || 0), bonus: passionBonus(passions[amorKey] || 0) },
    { key: 'honor', label: 'Honor', value: asInt(passions.honor), bonus: passionBonus(passions.honor) },
    { key: 'loveCharlemagne', label: 'Love [Charlemagne]', value: asInt(passions.loveCharlemagne ?? passions.loyaltyLiege), bonus: passionBonus(passions.loveCharlemagne ?? passions.loyaltyLiege) },
    { key: 'loveGod', label: 'Love [God]', value: asInt(passions.loveGod), bonus: passionBonus(passions.loveGod) }
  ];
  const deedBonuses = [
    { key: 'paladin', label: 'Paladin', value: Boolean(deeds.paladin), bonus: deeds.paladin ? 5 : 0 },
    { key: 'holyWarOrReligiousRetirement', label: '성전 중 사망 또는 수도자·은수자 은퇴', value: Boolean(deeds.holyWarOrReligiousRetirement), bonus: deeds.holyWarOrReligiousRetirement ? 5 : 0 },
    { key: 'convertedPagans', label: '직접 개종시킨 이교도', value: clamp(deeds.convertedPagans, 0, 5), bonus: clamp(deeds.convertedPagans, 0, 5) },
    { key: 'gmOther', label: 'GM이 인정한 기타 공적', value: asInt(deeds.gmOther), bonus: asInt(deeds.gmOther) }
  ];
  const passionTotal = passionBonuses.reduce((total, entry) => total + entry.bonus, 0);
  const deedTotal = deedBonuses.reduce((total, entry) => total + entry.bonus, 0);
  return {
    sourceRuleId: 'LIFE-SALVATION-001',
    sourcePage: 'Chapter 1 p. 41, Table 1-16',
    baseStatistic,
    selectedReligiousTrait,
    religiousTraits: religious,
    passionBonuses,
    deedBonuses,
    passionTotal,
    deedTotal,
    bonusPoints: passionTotal + deedTotal,
    finalStatistic: baseStatistic + passionTotal + deedTotal
  };
};

export const prepareSalvation = (character, deeds = {}, options = {}) => {
  const next = clone(character);
  ensureCampaign(next);
  const lifecycle = next.campaign.lifecycle;
  if (!lifecycle.salvationEligibility?.eligible || lifecycle.status !== 'pending_salvation') {
    return { character, prepared: false, reason: 'not_eligible' };
  }
  if (lifecycle.salvation?.roll) return { character, prepared: false, duplicate: true };
  lifecycle.salvation = {
    salvationId: safeId(options.salvationId || `salvation:${lifecycle.primaryCharacterId || 'predecessor'}:${lifecycle.endedAtYear}`),
    ledger: calculateSalvationLedger(next, deeds),
    roll: null,
    destination: null,
    canonization: { eligible: false, status: 'not_eligible', churchRoll: null },
    preparedAt: iso(options.timestamp)
  };
  lifecycle.unresolvedChoices = ['salvation_roll'];
  next.campaign.saveRevision += 1;
  return { character: next, prepared: true, salvation: lifecycle.salvation };
};

const createTransferableScores = (snapshot, cap) => {
  const groups = ['attributes', 'traits', 'passions', 'standings', 'skills'];
  return groups.flatMap(group => Object.entries(snapshot?.[group] || {})
    .filter(([key, value]) => key !== 'currentHp' && Number.isFinite(Number(value)))
    .map(([key, value]) => ({
      id: `${group}.${key}`,
      group,
      key,
      predecessorValue: Number(value),
      cap,
      transferableValue: Math.min(Number(value), cap),
      sourceRuleId: 'LIFE-LEGACY-001'
    })));
};

const classifyEquipment = snapshot => {
  const gear = snapshot?.gear || {};
  const entries = [
    ['armorShield', 'personal_equipment'], ['clothing', 'personal_equipment'],
    ['personalGear', 'personal_equipment'], ['homePossessions', 'family_equipment'],
    ['cash', 'money'], ['conditionalModifiers', 'blessed_weapon']
  ];
  const candidates = entries.filter(([key]) => gear[key] !== undefined && gear[key] !== '' && gear[key] !== null).map(([key, category]) => ({
    id: `gear.${key}`,
    key,
    category,
    value: clone(gear[key]),
    eligible: true,
    selected: false,
    consumedGrant: false,
    sourceRuleId: 'LIFE-NEWCHAR-001'
  }));
  if (snapshot?.horses) candidates.push({ id: 'horses', key: 'horses', category: 'horse', value: clone(snapshot.horses), eligible: true, selected: false, consumedGrant: false, sourceRuleId: 'LIFE-NEWCHAR-001' });
  return candidates;
};

export const createPredecessorSnapshot = (character, member = getSelf(character)) => ({
  characterId: member?.id || character?.campaign?.lifecycle?.activeCharacterId || null,
  name: character?.personal?.name || member?.name || '',
  status: character?.campaign?.lifecycle?.careerStatus || member?.lifecycleStatus || 'active',
  personal: clone(character?.personal || {}),
  attributes: clone(character?.attributes || {}),
  traits: clone(character?.traits || {}),
  passions: clone(character?.passions || {}),
  standings: clone(character?.standings || {}),
  skills: clone(character?.skills || {}),
  gear: clone(character?.gear || {}),
  horses: clone(character?.horses || {}),
  family: clone(character?.family || {})
});

const createLegacy = (character, salvation, canonized = false, timestamp = null) => {
  const lifecycle = character.campaign.lifecycle;
  const snapshot = lifecycle.predecessorSnapshot || createPredecessorSnapshot(character);
  const transferCount = canonized ? 2 : 1;
  const legacyId = safeId(`legacy:${salvation.salvationId}`);
  const manors = Number(snapshot.family?.manors || (snapshot.family?.hasEstate ? 1 : 0));
  return {
    legacyId,
    predecessorId: snapshot.characterId,
    successorMode: null,
    transferableScores: createTransferableScores(snapshot, salvation.ledger.finalStatistic),
    selectedTransfers: [],
    scoreCaps: { salvation: salvation.ledger.finalStatistic, transferCount },
    birthGiftGrant: { grantId: `${legacyId}:birth-gift`, count: 1, consumed: false, sourceRuleId: 'LIFE-LEGACY-001' },
    blessingGrant: canonized ? { grantId: `${legacyId}:blessing`, count: 1, consumed: false, roll: null, blessing: null, sourceRuleId: 'LIFE-SAINT-001' } : null,
    inheritableEquipment: classifyEquipment(snapshot),
    inheritableManors: manors > 0 ? [{ id: 'family.manors', count: manors, approved: null, approvalNote: '', sourceRuleId: 'LIFE-NEWCHAR-001' }] : [],
    inheritableFamilyData: clone(snapshot.family || {}),
    equipmentDecisionRecorded: false,
    unresolvedChoices: [
      'score_transfers',
      'equipment_inheritance',
      ...(manors > 0 ? ['manor_gm_approval'] : []),
      ...(canonized ? ['blessing_roll'] : [])
    ],
    consumed: false,
    sourceRuleIds: ['LIFE-LEGACY-001', ...(canonized ? ['LIFE-SAINT-001'] : []), 'LIFE-NEWCHAR-001'],
    createdAt: iso(timestamp)
  };
};

export const resolveSalvation = (character, options = {}) => {
  const next = clone(character);
  ensureCampaign(next);
  const lifecycle = next.campaign.lifecycle;
  const salvation = lifecycle.salvation;
  if (lifecycle.status !== 'pending_salvation' || !salvation?.ledger) return { character, applied: false, reason: 'ledger_required' };
  if (salvation.roll) return { character, applied: false, duplicate: true, salvation };
  const rawRoll = options.rawRoll === undefined ? (options.rng ? rollDie(20, options.rng) : rollDie(20)) : asInt(options.rawRoll);
  const check = resolveD20Roll(rawRoll, salvation.ledger.finalStatistic);
  const destination = check.fumble && salvation.ledger.finalStatistic <= 5 ? 'hell' : check.success ? 'heaven' : 'purgatory';
  const timestamp = iso(options.timestamp);
  const effectId = `${salvation.salvationId}:roll`;
  salvation.roll = {
    seed: options.seed || null,
    rollIndex: asInt(options.rollIndex),
    notation: '1d20',
    rawResult: rawRoll,
    modifiedRoll: check.effectiveRoll,
    target: salvation.ledger.finalStatistic,
    result: check.outcome,
    source: options.rawRoll === undefined ? 'automatic' : 'manual',
    sourceRuleId: 'LIFE-SALVATION-001',
    sourcePage: 'Chapter 1 p. 41',
    rolledAt: timestamp
  };
  salvation.destination = destination;
  const canonizationEligible = salvation.ledger.bonusPoints >= 15 && salvation.ledger.finalStatistic >= 20 && check.critical;
  salvation.canonization = {
    eligible: canonizationEligible,
    status: canonizationEligible ? 'pending_church_roll' : 'not_eligible',
    churchRoll: null
  };
  lifecycle.status = check.success ? 'pending_legacy' : 'pending_successor';
  lifecycle.legacy = check.success ? createLegacy(next, salvation, false, timestamp) : null;
  lifecycle.unresolvedChoices = check.success
    ? [...lifecycle.legacy.unresolvedChoices, ...(salvation.canonization.eligible ? ['church_standing_roll'] : [])]
    : ['successor_mode'];
  const year = lifecycle.endedAtYear || next.personal?.campaignYear || 767;
  const message = `${year}년 구원 판정: d20 ${rawRoll}, 기준 ${salvation.ledger.finalStatistic}, ${check.outcome}, ${destination}.`;
  appendJournal(next, year, message, timestamp);
  const event = buildEvent(next, {
    eventId: effectId,
    sourceRuleId: 'LIFE-SALVATION-001',
    previousStatus: 'pending_salvation',
    nextStatus: lifecycle.status,
    cause: lifecycle.endReason,
    year,
    sourcePage: 'Chapter 1 p. 41, Table 1-16',
    triggeringEvent: 'salvation_roll',
    unresolvedChoices: lifecycle.unresolvedChoices,
    appliedEffectIds: [effectId],
    journalEntryId: `journal:${effectId}`,
    timestamp
  });
  appendLifecycleEvent(next, event);
  return { character: next, applied: true, salvation, event };
};

export const resolveCanonization = (character, options = {}) => {
  const next = clone(character);
  ensureCampaign(next);
  const lifecycle = next.campaign.lifecycle;
  const salvation = lifecycle.salvation;
  if (!salvation?.canonization?.eligible || salvation.canonization.status !== 'pending_church_roll') {
    return { character, applied: false, reason: 'not_eligible' };
  }
  const rawRoll = options.rawRoll === undefined ? (options.rng ? rollDie(20, options.rng) : rollDie(20)) : asInt(options.rawRoll);
  const target = Number(next.standings?.church || lifecycle.predecessorSnapshot?.standings?.church || 0);
  const check = resolveD20Roll(rawRoll, target);
  const timestamp = iso(options.timestamp);
  const effectId = `${salvation.salvationId}:canonization`;
  salvation.canonization = {
    ...salvation.canonization,
    status: check.success ? 'canonized' : 'failed',
    churchRoll: {
      seed: options.seed || null,
      rollIndex: asInt(options.rollIndex),
      notation: '1d20', rawResult: rawRoll, modifiedRoll: check.effectiveRoll, target,
      result: check.outcome, source: options.rawRoll === undefined ? 'automatic' : 'manual',
      sourceRuleId: 'LIFE-SAINT-001', sourcePage: 'Chapter 1 p. 42', rolledAt: timestamp
    }
  };
  if (check.success) lifecycle.legacy = createLegacy(next, salvation, true, timestamp);
  lifecycle.unresolvedChoices = (lifecycle.legacy?.unresolvedChoices || []).filter(choice => choice !== 'church_standing_roll');
  const year = lifecycle.endedAtYear || next.personal?.campaignYear || 767;
  appendJournal(next, year, `${year}년 시성 판정: 교회 지위 ${target}, d20 ${rawRoll}, ${check.success ? '시성 인정' : '시성 불인정'}.`, timestamp);
  const event = buildEvent(next, {
    eventId: effectId, sourceRuleId: 'LIFE-SAINT-001', previousStatus: 'pending_legacy', nextStatus: 'pending_legacy',
    cause: 'canonization_church_standing', year, sourcePage: 'Chapter 1 p. 42, Table 1-17', triggeringEvent: 'church_standing_roll',
    unresolvedChoices: lifecycle.unresolvedChoices, appliedEffectIds: [effectId], journalEntryId: `journal:${effectId}`, timestamp
  });
  appendLifecycleEvent(next, event);
  return { character: next, applied: true, canonized: check.success, event };
};

export const updateLegacyChoices = (character, choices = {}, options = {}) => {
  const next = clone(character);
  ensureCampaign(next);
  const lifecycle = next.campaign.lifecycle;
  const legacy = lifecycle.legacy;
  if (!legacy || legacy.consumed || lifecycle.status !== 'pending_legacy') return { character, updated: false, reason: 'no_pending_legacy' };
  const count = legacy.scoreCaps.transferCount;
  const selectedIds = [...new Set((choices.selectedTransfers || legacy.selectedTransfers.map(entry => entry.id)).filter(Boolean))];
  if (selectedIds.length !== count) return { character, updated: false, reason: 'transfer_count', required: count };
  const selectedTransfers = selectedIds.map(id => legacy.transferableScores.find(entry => entry.id === id)).filter(Boolean);
  if (selectedTransfers.length !== count) return { character, updated: false, reason: 'invalid_transfer' };
  legacy.selectedTransfers = selectedTransfers.map(entry => ({ ...entry }));
  const selectedEquipmentIds = new Set(choices.selectedEquipmentIds || legacy.inheritableEquipment.filter(item => item.selected).map(item => item.id));
  legacy.inheritableEquipment = legacy.inheritableEquipment.map(item => ({ ...item, selected: item.eligible && selectedEquipmentIds.has(item.id) }));
  legacy.equipmentDecisionRecorded = choices.equipmentDecisionRecorded !== false;
  if (legacy.inheritableManors.length) {
    if (typeof choices.manorApproved !== 'boolean') return { character, updated: false, reason: 'manor_approval_required' };
    legacy.inheritableManors = legacy.inheritableManors.map(item => ({ ...item, approved: choices.manorApproved, approvalNote: String(choices.manorApprovalNote || '') }));
  }
  legacy.unresolvedChoices = legacy.unresolvedChoices.filter(choice => !['score_transfers', 'equipment_inheritance', 'manor_gm_approval'].includes(choice));
  lifecycle.status = 'pending_successor';
  lifecycle.unresolvedChoices = [...legacy.unresolvedChoices, 'successor_mode'];
  const timestamp = iso(options.timestamp);
  const effectId = `${legacy.legacyId}:choices`;
  const year = lifecycle.endedAtYear || next.personal?.campaignYear || 767;
  appendJournal(next, year, `${year}년 유산 선택: 점수 ${selectedIds.join(', ')}; 장비 ${selectedEquipmentIds.size}건; 장원 ${legacy.inheritableManors[0]?.approved === true ? 'GM 승인' : legacy.inheritableManors.length ? '미승인' : '없음'}.`, timestamp);
  const event = buildEvent(next, {
    eventId: effectId, sourceRuleId: 'LIFE-LEGACY-001', previousStatus: 'pending_legacy', nextStatus: 'pending_successor',
    cause: 'legacy_choices_confirmed', year, sourcePage: 'Chapter 1 pp. 41-43', triggeringEvent: 'legacy_choice',
    unresolvedChoices: lifecycle.unresolvedChoices, appliedEffectIds: [effectId], journalEntryId: `journal:${effectId}`, timestamp
  });
  appendLifecycleEvent(next, event);
  return { character: next, updated: true, legacy, event };
};

const parseBirthYear = member => {
  if (Number.isFinite(Number(member?.birthYear))) return Number(member.birthYear);
  const parsed = Number.parseInt(String(member?.lifeYears || '').split('~')[0], 10);
  return Number.isFinite(parsed) ? parsed : null;
};

export const getSuccessorCandidates = character => {
  const year = character?.personal?.campaignYear || 767;
  const predecessorId = character?.campaign?.lifecycle?.primaryCharacterId;
  return (character?.family?.members || [])
    .filter(member => !['사망', '은퇴', '역사적'].includes(member.status) && member.id !== predecessorId && member.relation !== '본인')
    .map(member => {
      const birthYear = parseBirthYear(member);
      return { ...clone(member), birthYear, ...getSuccessorEligibility({ birthYear, currentYear: year }) };
    });
};

export const createSuccessorContext = (character, options = {}) => {
  const mode = options.mode;
  if (!['same_family', 'new_family', 'prepared_second'].includes(mode)) return { ok: false, reason: 'invalid_mode' };
  const lifecycle = character?.campaign?.lifecycle || {};
  const candidate = options.candidateId ? getSuccessorCandidates(character).find(item => item.id === options.candidateId) : null;
  if (['same_family', 'prepared_second'].includes(mode) && (!candidate || !candidate.eligible)) return { ok: false, reason: candidate?.reason || 'candidate_required' };
  if (mode === 'new_family' && !options.gmApproved) return { ok: false, reason: 'gm_approval_required' };
  if (mode === 'prepared_second' && lifecycle.careerStatus !== 'incapacitated') return { ok: false, reason: 'temporary_incapacity_required' };
  if (mode !== 'prepared_second' && !['pending_successor', 'pending_legacy'].includes(lifecycle.status)) return { ok: false, reason: 'succession_not_pending' };
  const legacy = mode === 'same_family' ? clone(lifecycle.legacy || null) : null;
  if (mode === 'same_family' && lifecycle.status === 'pending_legacy') return { ok: false, reason: 'legacy_choices_required' };
  const context = {
    contextId: safeId(`successor:${mode}:${lifecycle.primaryCharacterId || 'primary'}:${options.candidateId || 'new'}`),
    predecessor: clone(lifecycle.predecessorSnapshot || createPredecessorSnapshot(character)),
    family: mode === 'new_family' ? null : clone(character.family || {}),
    successorMode: mode,
    pendingLegacy: legacy,
    inheritedEquipment: legacy?.inheritableEquipment?.filter(item => item.selected) || [],
    inheritedManors: legacy?.inheritableManors?.filter(item => item.approved) || [],
    availableScoreTransfers: legacy?.selectedTransfers || [],
    birthGiftGrant: legacy?.birthGiftGrant || null,
    blessingGrant: legacy?.blessingGrant || null,
    sourceCharacterId: lifecycle.primaryCharacterId || lifecycle.activeCharacterId || null,
    candidate: candidate ? clone(candidate) : null,
    gmApproval: mode === 'new_family' ? { approved: true, note: String(options.gmApprovalNote || ''), approvedAt: iso(options.timestamp) } : null,
    primaryCharacterSnapshot: mode === 'prepared_second' ? clone(character) : null,
    sourceRuleIds: mode === 'new_family' ? ['LIFE-NEWFAMILY-001'] : mode === 'prepared_second' ? ['LIFE-001'] : ['LIFE-NEWCHAR-001', 'LIFE-LEGACY-001'],
    createdAt: iso(options.timestamp)
  };
  return { ok: true, context };
};

export const beginSuccessorCreation = (character, context, session, options = {}) => {
  const next = clone(character);
  ensureCampaign(next);
  if (!context?.contextId || !session?.id) return { character, started: false, reason: 'context_or_session_required' };
  const eventId = `${context.contextId}:selection`;
  if (next.campaign.appliedEvents[eventId]) return { character, started: false, duplicate: true };
  if (next.campaign.completedCreationIds?.includes(`character-creation:${session.id}`)) return { character, started: false, duplicate: true };
  const lifecycle = next.campaign.lifecycle;
  lifecycle.status = 'successor_in_creation';
  lifecycle.successor = { mode: context.successorMode, candidate: clone(context.candidate), contextId: context.contextId, sessionId: session.id, startedAt: iso(options.timestamp) };
  lifecycle.unresolvedChoices = ['successor_creation_completion'];
  next.campaign.characterCreationSession = clone(session);
  const timestamp = iso(options.timestamp);
  const year = next.personal?.campaignYear || 767;
  appendJournal(next, year, `${year}년, ${context.successorMode === 'new_family' ? '새 가문 캐릭터' : context.candidate?.name || '가문 후보'} 생성 절차를 시작했습니다.`, timestamp);
  const event = buildEvent(next, {
    eventId,
    sourceRuleId: context.sourceRuleIds?.[0] || 'LIFE-NEWCHAR-001',
    previousStatus: context.successorMode === 'prepared_second' ? lifecycle.careerStatus : 'pending_successor',
    nextStatus: 'successor_in_creation',
    cause: context.successorMode,
    year,
    sourcePage: 'Chapter 1 pp. 42-43',
    triggeringEvent: 'successor_selection',
    unresolvedChoices: lifecycle.unresolvedChoices,
    appliedEffectIds: [eventId],
    journalEntryId: `journal:${eventId}`,
    timestamp
  });
  appendLifecycleEvent(next, event);
  return { character: next, started: true, event };
};

export const restorePrimaryCharacter = (character, options = {}) => {
  const prepared = character?.campaign?.preparedCharacter;
  const primary = prepared?.primaryCharacterSnapshot;
  if (!primary || character?.campaign?.lifecycle?.activeRole !== 'prepared_second') return { character, restored: false, reason: 'no_prepared_character' };
  if (!options.recoveryConfirmed) return { character, restored: false, reason: 'recovery_confirmation_required' };
  const currentPreparedSnapshot = createPredecessorSnapshot(character);
  const next = clone(primary);
  ensureCampaign(next);
  const timestamp = iso(options.timestamp);
  const year = asInt(options.year, next.personal?.campaignYear || 767);
  const currentCampaign = clone(character.campaign || {});
  const primaryId = primary.campaign?.lifecycle?.primaryCharacterId || primary.campaign?.lifecycle?.activeCharacterId || prepared.primaryCharacterId;
  const preparedId = prepared.preparedCharacterId;
  const originalMembers = new Map((primary.family?.members || []).map(member => [member.id, member]));
  const currentMembers = Array.isArray(character.family?.members) ? character.family.members : [];
  next.family = {
    ...(next.family || {}),
    ...(character.family || {}),
    members: currentMembers.map(member => {
      if (member.id === primaryId) {
        return { ...member, ...(originalMembers.get(member.id) || {}), relation: '본인', status: '생존', lifecycleStatus: 'active', statusCause: String(options.cause || '회복 확인') };
      }
      if (member.id === preparedId) {
        const original = originalMembers.get(member.id) || {};
        return { ...member, relation: original.relation || '가문원', status: original.status || '생존', lifecycleStatus: original.lifecycleStatus || 'active' };
      }
      return member;
    })
  };
  next.journal = clone(character.journal || next.journal || {});
  next.campaign = {
    ...currentCampaign,
    preparedCharacters: [...(currentCampaign.preparedCharacters || []), {
      archivedAt: timestamp,
      character: currentPreparedSnapshot,
      sourceRuleId: 'LIFE-001'
    }].slice(-10),
    preparedCharacter: null,
    lifecycle: {
      ...(currentCampaign.lifecycle || {}),
      status: 'active',
      careerStatus: 'active',
      activeRole: 'primary',
      activeCharacterId: primaryId,
      primaryCharacterId: primaryId,
      successor: null,
      unresolvedChoices: [],
      lastTransitionAt: timestamp
    }
  };
  ensureCampaign(next);
  const eventId = safeId(options.eventId || `lifecycle:primary-restored:${primaryId || 'primary'}:${year}`);
  if (next.campaign.appliedEvents[eventId]) return { character, restored: false, duplicate: true };
  const journalEntryId = `journal:${eventId}`;
  appendJournal(next, year, `${year}년, 원 기사의 회복을 확인하고 준비 캐릭터에서 활성권을 되돌렸습니다.`, timestamp);
  const event = buildEvent(next, {
    eventId,
    sourceRuleId: options.sourceRuleId || 'LIFE-001',
    previousStatus: primary.campaign?.lifecycle?.careerStatus || 'incapacitated',
    nextStatus: 'active',
    cause: options.cause || 'primary_recovery_confirmed',
    year,
    sourcePage: options.sourcePage || 'Chapter 1 p. 41',
    triggeringEvent: 'prepared_second_return',
    unresolvedChoices: [],
    appliedEffectIds: [`effect:${eventId}:active-character`],
    journalEntryId,
    timestamp
  });
  appendLifecycleEvent(next, event);
  return { character: next, restored: true, event };
};

export const sanitizeLifecycleState = (value, character = {}) => {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? clone(value) : {};
  const self = character?.family?.members?.find(member => member.relation === '본인');
  const attributeValues = ['siz', 'dex', 'str', 'con', 'app'].map(key => Number(character?.attributes?.[key]));
  let careerStatus = careerSet.has(source.careerStatus) ? source.careerStatus : 'active';
  if (self?.status === '사망' || attributeValues.some(number => Number.isFinite(number) && number <= 0)) careerStatus = 'deceased';
  else if (self?.status === '은퇴') careerStatus = 'retired';
  else if (!['deceased', 'retired', 'historical'].includes(careerStatus) && attributeValues.some(number => Number.isFinite(number) && number <= 3)) careerStatus = 'bedridden';
  let status = stateSet.has(source.status) ? source.status : careerStatus;
  if (['deceased', 'retired'].includes(careerStatus) && !['pending_salvation', 'pending_legacy', 'pending_successor', 'successor_in_creation', 'historical'].includes(status)) {
    status = source.salvation?.roll ? source.legacy ? 'pending_legacy' : 'pending_successor' : 'pending_salvation';
  }
  const livingActive = ['active', 'incapacitated', 'bedridden'].includes(careerStatus);
  const flowHasNoActiveCharacter = ['pending_salvation', 'pending_legacy', 'pending_successor', 'successor_in_creation', 'historical'].includes(status);
  const activeCharacterId = flowHasNoActiveCharacter
    ? null
    : Object.hasOwn(source, 'activeCharacterId') ? source.activeCharacterId : livingActive ? self?.id || null : null;
  return {
    ...source,
    status,
    careerStatus,
    activeCharacterId,
    primaryCharacterId: source.primaryCharacterId || self?.id || null,
    pendingSuccession: Boolean(source.pendingSuccession || ['deceased', 'retired'].includes(careerStatus) || ['pending_legacy', 'pending_successor', 'successor_in_creation'].includes(status)),
    pendingCareerEnd: source.pendingCareerEnd && typeof source.pendingCareerEnd === 'object' ? source.pendingCareerEnd : null,
    salvation: source.salvation && typeof source.salvation === 'object' ? source.salvation : null,
    legacy: source.legacy && typeof source.legacy === 'object' ? source.legacy : null,
    successor: source.successor && typeof source.successor === 'object' ? source.successor : null,
    predecessorSnapshot: source.predecessorSnapshot && typeof source.predecessorSnapshot === 'object' ? source.predecessorSnapshot : null,
    events: Array.isArray(source.events) ? source.events.slice(-250) : [],
    unresolvedChoices: Array.isArray(source.unresolvedChoices) ? source.unresolvedChoices.filter(item => typeof item === 'string').slice(0, 50) : []
  };
};

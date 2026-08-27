import { CHAPTER_19_TABLES } from '../data/chapter19Data.js';
import { resolveD20Roll, resolveOpposedD20, rollDie } from './coreRules.js';
import { recordEconomyTransfer, toDeniers } from './economyRules.js';
import { appendChronicleEvent, recordGloryAward, recordHonorChange, recordStandingChange } from './ledgerRules.js';
import { getOpposedTrait, RELIGIOUS_TRAITS, ROMANTIC_TRAITS, CHIVALROUS_TRAITS, TRAIT_KEYS } from './personalityRules.js';
import { resolveAgingTableEffect } from './winterRules.js';

const clone = value => JSON.parse(JSON.stringify(value));
const iso = value => value ? new Date(value).toISOString() : new Date().toISOString();
const asInt = (value, fallback = 0) => Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : fallback;
const safeId = value => String(value || '').trim().replace(/[^a-zA-Z0-9:_-]+/g, '_');
const list = value => Array.isArray(value) ? value : [];

export const PERSONALITY_MAGIC_ENGINE_VERSION = 1;
export const PERSONALITY_MAGIC_SCHEMA_VERSION = 12;

export const STANDARD_PASSION_KEYS = Object.freeze(['honor', 'loveCharlemagne', 'loveFamily', 'loveGod']);
export const DIRECTED_PASSION_KINDS = Object.freeze(['love', 'hate', 'fear']);
export const DISHONORABLE_ACTS = Object.freeze([
  { id: 'attack_unarmed_knight', label: 'Attacking an unarmed knight', honorLoss: 1 },
  { id: 'cowardice', label: 'Cowardice', honorLoss: 1 },
  { id: 'refuse_enemy_hospitality', label: 'Refusing hospitality to an enemy', honorLoss: 1 },
  { id: 'steal_commoner', label: 'Stealing from a commoner', honorLoss: 1 },
  { id: 'profitable_lending', label: 'Lending money at a profit', honorLoss: 2 },
  { id: 'desertion', label: 'Desertion from battle or military service', honorLoss: 2 },
  { id: 'refuse_stranger_hospitality', label: 'Refusing hospitality to strangers', honorLoss: 2 },
  { id: 'plunder_own_holy_place', label: 'Plundering a holy place of your religion', honorLoss: 2 },
  { id: 'kill_own_unarmed_holy_person', label: 'Killing an unarmed holy person of your religion', honorLoss: 2 },
  { id: 'harm_noblewoman', label: 'Killing, kidnapping, or raping a noblewoman', honorLoss: 2 },
  { id: 'physical_labor', label: 'Performing physical labor', honorLoss: 2 },
  { id: 'steal_knight', label: 'Stealing from a knight', honorLoss: 2 },
  { id: 'gravely_insult_guest', label: 'Gravely insulting a guest', honorLoss: 3 },
  { id: 'flagrant_cowardice', label: 'Flagrant cowardice', honorLoss: 3 },
  { id: 'break_oath', label: 'Breaking an oath', honorLoss: 3 },
  { id: 'maim_guest', label: 'Maiming a guest', honorLoss: 4 },
  { id: 'treason_lord', label: 'Treason against your lord', honorLoss: 5 },
  { id: 'kill_guest', label: 'Killing a guest', honorLoss: 5 },
  { id: 'betray_family', label: 'Treachery against a member of your family', honorLoss: 5 },
  { id: 'kill_kinsman', label: 'Killing a kinsman', honorLoss: 6 }
]);
export const ORDINARY_SKILL_KEYS = Object.freeze(['awareness', 'chirurgery', 'faerieLore', 'firstAid', 'folkLore', 'horsemanship', 'hunting', 'industry', 'recognize', 'religion', 'stewardship', 'swimming']);
export const COURTLY_SKILL_KEYS = Object.freeze(['courtesy', 'dancing', 'eloquence', 'falconry', 'gaming', 'heraldry', 'intrigue', 'languages', 'playInstruments', 'readingWriting', 'romance', 'singing']);
export const COMBAT_SKILL_KEYS = Object.freeze(['battle', 'siege', 'axe', 'bludgeon', 'dagger', 'spear', 'sword', 'unarmed', 'lance', 'bow', 'crossbow', 'thrownWeapon']);

const VIRTUE_KEYS = Object.freeze(['chaste', 'energetic', 'forgiving', 'generous', 'honest', 'just', 'merciful', 'modest', 'prudent', 'temperate', 'trusting', 'valorous']);
const VICE_KEYS = Object.freeze(['lustful', 'lazy', 'vengeful', 'selfish', 'deceitful', 'arbitrary', 'cruel', 'proud', 'reckless', 'indulgent', 'suspicious', 'cowardly']);

const MAD_ACTS = Object.freeze([
  { min: 1, max: 5, changes: 1, effect: null, label: 'Silent woodsman' },
  { min: 6, max: 10, changes: 2, effect: { type: 'standing', key: 'commoners', amount: -1 }, label: 'Attacked a village' },
  { min: 11, max: 15, changes: 3, effect: { type: 'standing', key: 'church', amount: -1 }, label: 'Sacked a chapel' },
  { min: 16, max: 20, changes: 4, effect: { type: 'honor', amount: -1 }, label: 'Attacked a noble lady' },
  { min: 21, max: Number.POSITIVE_INFINITY, changes: 5, effect: { type: 'honor', amount: -2 }, label: 'Attacked a wedding procession' }
]);

const isObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const sanitizeEntry = (value, fallbackId) => ({
  ...clone(value || {}),
  id: safeId(value?.id || fallbackId),
  createdAt: typeof value?.createdAt === 'string' ? value.createdAt : iso()
});

export const createPersonalityMagicState = () => ({
  engineVersion: PERSONALITY_MAGIC_ENGINE_VERSION,
  directedTraits: [],
  directedPassions: [],
  externalPassions: [],
  activeResolution: null,
  conditions: [],
  amor: null,
  oath: null,
  prayers: [],
  dreams: [],
  gmDecisions: [],
  transactions: [],
  adventureBridge: null
});

const migrateLegacyConditions = value => list(value).map((entry, index) => ({
  id: safeId(entry?.id || `legacy_condition_${index + 1}`),
  type: ['shock', 'melancholy', 'madness'].includes(entry?.type) ? entry.type : 'shock',
  status: entry?.status === 'resolved' ? 'resolved' : 'active',
  passionKey: String(entry?.passionKey || ''),
  passionLabel: String(entry?.passionLabel || ''),
  sourcePage: 'Ch.3 pp.78-80',
  startedYear: Math.min(1200, Math.max(700, asInt(entry?.year, 767))),
  note: String(entry?.note || 'schema v12 이전 상태에서 이전됨'),
  createdAt: typeof entry?.createdAt === 'string' ? entry.createdAt : iso()
}));

export const sanitizePersonalityMagicState = (value, legacyPassionStates = []) => {
  const source = isObject(value) ? value : {};
  const conditions = list(source.conditions).length
    ? list(source.conditions).map((entry, index) => sanitizeEntry(entry, `condition_${index + 1}`))
    : migrateLegacyConditions(legacyPassionStates);
  return {
    engineVersion: PERSONALITY_MAGIC_ENGINE_VERSION,
    directedTraits: list(source.directedTraits).map((entry, index) => ({
      ...sanitizeEntry(entry, `directed_trait_${index + 1}`),
      traitKey: TRAIT_KEYS.includes(entry?.traitKey) ? entry.traitKey : '',
      target: String(entry?.target || ''),
      modifier: asInt(entry?.modifier),
      origin: ['inherited', 'gm', 'voluntary'].includes(entry?.origin) ? entry.origin : 'gm',
      status: entry?.status === 'removed' ? 'removed' : 'active'
    })).filter(entry => entry.traitKey && entry.target),
    directedPassions: list(source.directedPassions).map((entry, index) => ({
      ...sanitizeEntry(entry, `directed_passion_${index + 1}`),
      kind: DIRECTED_PASSION_KINDS.includes(entry?.kind) ? entry.kind : '',
      target: String(entry?.target || ''),
      passionKey: String(entry?.passionKey || ''),
      value: Math.max(0, asInt(entry?.value)),
      status: entry?.status === 'removed' ? 'removed' : 'active'
    })).filter(entry => entry.kind && entry.target && entry.passionKey),
    externalPassions: list(source.externalPassions).map((entry, index) => sanitizeEntry(entry, `external_passion_${index + 1}`)).slice(-250),
    activeResolution: isObject(source.activeResolution) ? clone(source.activeResolution) : null,
    conditions,
    amor: isObject(source.amor) ? clone(source.amor) : null,
    oath: isObject(source.oath) ? clone(source.oath) : null,
    prayers: list(source.prayers).map((entry, index) => sanitizeEntry(entry, `prayer_${index + 1}`)).slice(-250),
    dreams: list(source.dreams).map((entry, index) => sanitizeEntry(entry, `dream_${index + 1}`)).slice(-250),
    gmDecisions: list(source.gmDecisions).map((entry, index) => sanitizeEntry(entry, `gm_decision_${index + 1}`)).slice(-500),
    transactions: list(source.transactions).map((entry, index) => sanitizeEntry(entry, `personality_tx_${index + 1}`)).slice(-2000),
    adventureBridge: isObject(source.adventureBridge) ? clone(source.adventureBridge) : null
  };
};

const ensureState = character => {
  character.campaign = character.campaign || {};
  character.campaign.personalityMagic = sanitizePersonalityMagicState(
    character.campaign.personalityMagic,
    character.campaign.passionStates
  );
  character.campaign.passionStates = undefined;
  character.campaign.schemaVersion = PERSONALITY_MAGIC_SCHEMA_VERSION;
  return character.campaign.personalityMagic;
};

const appendTransaction = (state, entry) => {
  const id = safeId(entry.id);
  const existing = state.transactions.find(item => item.id === id);
  if (existing) return { entry: existing, applied: false };
  const normalized = { ...clone(entry), id, createdAt: entry.createdAt || iso() };
  state.transactions = [...state.transactions, normalized].slice(-2000);
  return { entry: normalized, applied: true };
};

const appendCondition = (state, entry) => {
  const normalized = sanitizeEntry(entry, `condition_${state.conditions.length + 1}`);
  const existing = state.conditions.find(item => item.id === normalized.id);
  if (existing) return existing;
  state.conditions = [...state.conditions, normalized].slice(-250);
  return normalized;
};

const adjustPassion = (character, key, amount) => {
  character.passions = character.passions || {};
  const before = asInt(character.passions[key]);
  const after = Math.max(0, before + asInt(amount));
  character.passions[key] = after;
  return { key, before, after, amount: after - before };
};

const markPassionCheck = (character, key) => {
  character.passionsChecked = { ...(character.passionsChecked || {}), [key]: true };
};

const syncDirectedPassionValue = (state, key, value) => {
  state.directedPassions.forEach(entry => {
    if (entry.passionKey === key && entry.status === 'active') entry.value = Math.max(0, asInt(value));
  });
};

export const addDirectedPassion = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const kind = DIRECTED_PASSION_KINDS.includes(input.kind) ? input.kind : '';
  const target = String(input.target || '').trim();
  const value = Math.max(0, asInt(input.value));
  if (!kind || !target) throw new RangeError('Love, Hate 또는 Fear와 그 대상을 입력하세요.');
  if (!input.playerAgreed || !input.gmAgreed || value < 1) throw new RangeError('새 Passion의 시작값은 플레이어와 GM이 합의해 기록해야 합니다.');
  const passionKey = String(input.passionKey || `${kind}:${safeId(target)}`);
  const id = safeId(input.transactionId || `directed_passion:${passionKey}:${iso(now)}`);
  const existing = state.transactions.find(entry => entry.id === id);
  if (existing) return { character, directedPassion: state.directedPassions.find(entry => entry.id === existing.directedPassionId), applied: false };
  if (state.directedPassions.some(entry => entry.passionKey === passionKey && entry.status === 'active')) throw new RangeError('같은 대상의 활성 Directed Passion이 이미 있습니다.');
  const directedPassion = {
    id, kind, target, passionKey, value, status: 'active',
    agreementNote: String(input.agreementNote || ''), sourcePage: 'Ch.3 p.78', createdAt: iso(now)
  };
  character.passions = { ...(character.passions || {}), [passionKey]: value };
  state.directedPassions.push(directedPassion);
  appendTransaction(state, { id, type: 'directed_passion_added', directedPassionId: id, passionKey, value, sourcePage: 'Ch.3 p.78', createdAt: iso(now) });
  return { character, directedPassion, applied: true };
};

export const reducePassionForContraryAction = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const passionKey = String(input.passionKey || '');
  scoreFor(character, 'passions', passionKey);
  if (!input.gmDirected || !String(input.action || '').trim()) throw new RangeError('Passion에 반한 행동과 GM 지시를 기록하세요.');
  const id = safeId(input.transactionId || `passion_contrary:${passionKey}:${character.personal?.campaignYear || 767}:${iso(now)}`);
  const transaction = appendTransaction(state, { id, type: 'passion_contrary_action', passionKey, action: String(input.action), amount: -1, sourcePage: 'Ch.3 p.66', createdAt: iso(now) });
  if (!transaction.applied) return { character, result: transaction.entry, applied: false };
  const change = adjustPassion(character, passionKey, -1);
  syncDirectedPassionValue(state, passionKey, change.after);
  transaction.entry.change = change;
  return { character, result: transaction.entry, applied: true };
};

export const lowerPassionDuringWinter = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const passionKey = String(input.passionKey || '');
  const value = scoreFor(character, 'passions', passionKey);
  const year = asInt(input.year, character.personal?.campaignYear || 767);
  if (!input.duringWinter) throw new RangeError('이 선택은 Winter Phase 중에만 실행할 수 있습니다.');
  if (value < 1) throw new RangeError('이미 0인 Passion은 더 낮출 수 없습니다.');
  const id = safeId(input.transactionId || `passion_winter_lower:${year}:${passionKey}`);
  const transaction = appendTransaction(state, { id, type: 'passion_winter_lowered', passionKey, year, amount: -3, sourcePage: 'Ch.3 pp.80-81', createdAt: iso(now) });
  if (!transaction.applied) return { character, result: transaction.entry, applied: false };
  const change = adjustPassion(character, passionKey, -3);
  syncDirectedPassionValue(state, passionKey, change.after);
  transaction.entry.change = change;
  return { character, result: transaction.entry, applied: true };
};

export const resolveFearOpportunity = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const passionKey = String(input.passionKey || '');
  const fear = state.directedPassions.find(entry => entry.passionKey === passionKey && entry.kind === 'fear' && entry.status === 'active');
  if (!fear) throw new RangeError('활성 Fear Directed Passion을 선택하세요.');
  if (!input.gmCreatedOpportunity || !String(input.context || '').trim()) throw new RangeError('GM이 마련한 Fear 극복 기회의 맥락을 기록하세요.');
  const prior = state.transactions.filter(entry => entry.type === 'fear_opportunity' && entry.passionKey === passionKey);
  if (prior.length && !input.gmAllowsAdditionalOpportunity) throw new RangeError('Fear 극복 기회는 보통 한 번뿐입니다. 추가 기회는 GM 판단을 기록하세요.');
  const overcame = Boolean(input.overcame);
  const glory = overcame ? Math.max(0, asInt(input.glory)) : 0;
  if (overcame && !input.gmApprovedGlory) throw new RangeError('Fear 극복 Glory는 약 10배라는 원문 범위에서 GM이 확정해야 합니다.');
  const id = safeId(input.transactionId || `fear_opportunity:${passionKey}:${character.personal?.campaignYear || 767}:${iso(now)}`);
  const transaction = appendTransaction(state, {
    id, type: 'fear_opportunity', passionKey, formerValue: fear.value, context: String(input.context), overcame, glory,
    gmAllowsAdditionalOpportunity: Boolean(input.gmAllowsAdditionalOpportunity), sourcePage: 'Ch.3 pp.77-78', createdAt: iso(now)
  });
  if (!transaction.applied) return { character, result: transaction.entry, applied: false };
  if (overcame) {
    const change = adjustPassion(character, passionKey, -scoreFor(character, 'passions', passionKey));
    fear.value = 0;
    fear.status = 'removed';
    fear.removedReason = 'overcame_fear';
    fear.removedAt = iso(now);
    transaction.entry.change = change;
    if (glory) recordGloryAward(character, {
      id: `${id}:glory`, amount: glory, title: `Fear [${fear.target}] 극복`, narrative: String(input.context),
      sourceRuleId: 'PASSION-FEAR-001', sourcePage: 'Ch.3 pp.77-78'
    });
  }
  return { character, result: transaction.entry, applied: true };
};

export const applyDishonorableAct = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const act = DISHONORABLE_ACTS.find(entry => entry.id === input.actId);
  if (!act) throw new RangeError('Table 3-2의 불명예 행위를 선택하세요.');
  const id = safeId(input.transactionId || `dishonor:${act.id}:${character.personal?.campaignYear || 767}:${iso(now)}`);
  const transaction = appendTransaction(state, { id, type: 'dishonorable_act', actId: act.id, label: act.label, amount: -act.honorLoss, sourcePage: 'Ch.3 p.74', createdAt: iso(now) });
  if (!transaction.applied) return { character, result: transaction.entry, applied: false };
  const honor = recordHonorChange(character, {
    id: `${id}:honor`, amount: -act.honorLoss, title: act.label, narrative: String(input.note || act.label),
    sourceRuleId: 'PASSION-DISHONOR-001', sourcePage: 'Ch.3 p.74'
  });
  transaction.entry.honor = honor;
  if (honor.after <= 5) appendChronicleEvent(character, {
    id: `${id}:chronicle`, type: 'dishonor', title: honor.after === 0 ? '명예를 완전히 잃다' : '기사의 명예가 심판대에 오르다',
    narrative: `${act.label}. Honor ${honor.before}에서 ${honor.after}.`, sourceRuleId: 'PASSION-DISHONOR-001', sourcePage: 'Ch.3 pp.74-75'
  });
  return { character, result: transaction.entry, applied: true };
};

export const resolveHonorLordJudgment = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const honorStatus = character.campaign?.honorStatus;
  if (!honorStatus?.pendingLordJudgment) throw new RangeError('영주의 심판을 기다리는 Honor 상태가 없습니다.');
  const outcome = ['outlawed', 'degraded'].includes(input.outcome) ? input.outcome : '';
  if (!outcome || !String(input.note || '').trim()) throw new RangeError('영주가 추방 또는 기사 신분 박탈 중 하나를 결정하고 근거를 기록해야 합니다.');
  const id = safeId(input.transactionId || `honor_lord_judgment:${character.personal?.campaignYear || 767}:${iso(now)}`);
  const transaction = appendTransaction(state, { id, type: 'honor_lord_judgment', outcome, note: String(input.note), sourcePage: 'Ch.3 p.74', createdAt: iso(now) });
  if (!transaction.applied) return { character, result: transaction.entry, applied: false };
  character.campaign.honorStatus = { ...honorStatus, state: outcome, pendingLordJudgment: false, judgmentTransactionId: id, judgmentNote: String(input.note), resolvedAt: iso(now) };
  state.gmDecisions.push(transaction.entry);
  return { character, result: transaction.entry, applied: true };
};

const scoreFor = (character, group, key) => {
  const value = Number(character?.[group]?.[key]);
  if (!Number.isFinite(value)) throw new RangeError(`${group}.${key} 수치를 찾을 수 없습니다.`);
  return asInt(value);
};

const randomKey = (keys, characterGroup, rng) => {
  const eligible = keys.filter(key => Number.isFinite(Number(characterGroup?.[key])));
  if (!eligible.length) throw new RangeError('원문 무작위 변화에 적용할 수치가 없습니다.');
  return eligible[rollDie(eligible.length, rng) - 1];
};

const setScore = (character, group, key, value) => {
  const before = scoreFor(character, group, key);
  const after = Math.max(0, asInt(value));
  character[group][key] = after;
  return { group, key, before, after };
};

const qualifyIdeal = (character, keys, passionKey) => (
  keys.reduce((sum, key) => sum + asInt(character.traits?.[key]), 0) >= 90
  && asInt(character.passions?.[passionKey]) >= 16
);

export const getPersonalityMagicState = character => sanitizePersonalityMagicState(
  character?.campaign?.personalityMagic,
  character?.campaign?.passionStates
);

export const addDirectedTrait = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  if (!TRAIT_KEYS.includes(input.traitKey)) throw new RangeError('원문 Trait을 선택하세요.');
  if (!String(input.target || '').trim()) throw new RangeError('Directed Trait 대상을 입력하세요.');
  const origin = ['inherited', 'gm', 'voluntary'].includes(input.origin) ? input.origin : 'gm';
  const modifier = asInt(input.modifier);
  if (modifier <= 0) throw new RangeError('Directed Trait 수정치는 양수여야 합니다.');
  if (origin === 'inherited' && !String(input.inheritedFrom || '').trim()) {
    throw new RangeError('계승 Directed Trait은 원본 Directed Trait을 지정해야 합니다.');
  }
  if (origin === 'inherited' && state.directedTraits.some(item => item.origin === 'inherited' && item.status === 'active')) {
    throw new RangeError('서임 시 계승할 수 있는 Directed Trait은 하나입니다.');
  }
  if (origin === 'voluntary' && !input.gmAgreed && (modifier < 2 || modifier > 12)) {
    throw new RangeError('자발적 Directed Trait은 보통 +2d6이며 다른 값은 GM 합의가 필요합니다.');
  }
  if (origin === 'gm' && modifier > 5 && !input.gmAgreed) {
    throw new RangeError('GM 부여 Directed Trait은 보통 +5 이하이며 초과값은 합의를 기록해야 합니다.');
  }
  const id = safeId(input.transactionId || `directed:${input.traitKey}:${input.target}:${iso(now)}`);
  const existing = state.directedTraits.find(item => item.id === id);
  if (existing) return { character, directedTrait: existing, applied: false };
  const directedTrait = {
    id, traitKey: input.traitKey, target: String(input.target).trim(), modifier, origin,
    inheritedFrom: input.inheritedFrom || null, sourcePage: 'Ch.3 pp.69-70',
    note: String(input.note || ''), status: 'active', createdAt: iso(now)
  };
  state.directedTraits.push(directedTrait);
  appendTransaction(state, { id, type: 'directed_trait_added', directedTraitId: id, sourcePage: directedTrait.sourcePage, createdAt: iso(now) });
  return { character, directedTrait, applied: true };
};

export const removeDirectedTrait = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const trait = state.directedTraits.find(item => item.id === input.directedTraitId && item.status === 'active');
  if (!trait) throw new RangeError('활성 Directed Trait을 찾을 수 없습니다.');
  if (!String(input.reason || '').trim()) throw new RangeError('삭제는 원문 밖 자동 규칙이 아니므로 GM 사유를 기록하세요.');
  trait.status = 'removed';
  trait.removedAt = iso(now);
  trait.removalReason = String(input.reason);
  appendTransaction(state, { id: input.transactionId || `${trait.id}:removed`, type: 'directed_trait_removed', directedTraitId: trait.id, note: trait.removalReason, sourcePage: 'Ch.3 pp.69-70', createdAt: iso(now) });
  return { character, directedTrait: trait };
};

export const inheritDirectedTrait = (characterValue, input = {}, now) => {
  const source = getPersonalityMagicState(characterValue).directedTraits.find(item => item.id === input.directedTraitId && item.status === 'active');
  if (!source) throw new RangeError('계승할 Directed Trait을 찾을 수 없습니다.');
  return addDirectedTrait(characterValue, {
    traitKey: source.traitKey, target: source.target, modifier: source.modifier,
    origin: 'inherited', inheritedFrom: source.id, gmAgreed: true,
    transactionId: input.transactionId || `directed:inherit:${source.id}:${iso(now)}`,
    note: input.note || '부친 사망 뒤 서임 시 한 개의 Directed Trait을 같은 값으로 계승'
  }, now);
};

export const resolveStandardTraitTest = (characterValue, input = {}) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const traitKey = String(input.traitKey || '');
  const oppositeKey = getOpposedTrait(traitKey);
  if (!oppositeKey) throw new RangeError('대립 Trait을 선택하세요.');
  const directed = list(input.directedTraitIds)
    .map(id => state.directedTraits.find(item => item.id === id && item.status === 'active' && item.traitKey === traitKey))
    .filter(Boolean);
  const modifier = asInt(input.modifier) + directed.reduce((sum, item) => sum + item.modifier, 0);
  const primary = resolveD20Roll(asInt(input.roll), scoreFor(character, 'traits', traitKey) + modifier);
  let opposite = null;
  let forcedTrait;
  let freeChoice = false;
  if (primary.outcome === 'critical') {
    forcedTrait = traitKey;
    character.traitsChecked = { ...(character.traitsChecked || {}), [traitKey]: true };
  } else if (primary.outcome === 'success') {
    forcedTrait = traitKey;
    if (input.actedOpposite) character.traitsChecked = { ...(character.traitsChecked || {}), [oppositeKey]: true };
    else if (input.significantAction) character.traitsChecked = { ...(character.traitsChecked || {}), [traitKey]: true };
  } else if (primary.outcome === 'fumble') {
    forcedTrait = oppositeKey;
    character.traitsChecked = { ...(character.traitsChecked || {}), [oppositeKey]: true };
  } else {
    if (!input.oppositeRoll) throw new RangeError('첫 Trait 실패 뒤 원문에 따라 반대 Trait d20이 필요합니다.');
    opposite = resolveD20Roll(asInt(input.oppositeRoll), scoreFor(character, 'traits', oppositeKey));
    forcedTrait = opposite.success ? oppositeKey : null;
    freeChoice = !opposite.success;
    if (opposite.success && input.significantAction) character.traitsChecked = { ...(character.traitsChecked || {}), [oppositeKey]: true };
  }
  const id = safeId(input.transactionId || `trait:${traitKey}:${character.personal?.campaignYear || 767}:${input.roll}:${iso(input.now)}`);
  const transaction = appendTransaction(state, {
    id, type: 'trait_test', traitKey, oppositeKey, modifier, directedTraitIds: directed.map(item => item.id),
    primary, opposite, forcedTrait, freeChoice, sourcePage: 'Ch.3 pp.70-71', createdAt: iso(input.now)
  }).entry;
  return { character, result: transaction };
};

export const resolvePersonalityConflict = (characterValue, input = {}) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const actorValue = input.actorValue ?? scoreFor(character, input.actorGroup, input.actorKey);
  const opponentValue = input.opponentValue ?? scoreFor(character, input.opponentGroup, input.opponentKey);
  const actor = resolveD20Roll(asInt(input.actorRoll), asInt(actorValue) + asInt(input.actorModifier));
  const opponent = resolveD20Roll(asInt(input.opponentRoll), asInt(opponentValue) + asInt(input.opponentModifier));
  const opposed = resolveOpposedD20(actor, opponent);
  const id = safeId(input.transactionId || `personality_conflict:${input.actorKey}:${input.opponentKey}:${iso(input.now)}`);
  const transaction = appendTransaction(state, {
    id, type: 'personality_conflict', actor: { group: input.actorGroup, key: input.actorKey, ...actor },
    opponent: { group: input.opponentGroup, key: input.opponentKey, ...opponent }, result: opposed,
    sourcePage: 'Ch.3 pp.71-72', createdAt: iso(input.now)
  }).entry;
  return { character, result: transaction };
};

const createMadness = (character, state, input = {}, now) => appendCondition(state, {
  id: safeId(input.id || `madness:${input.passionKey}:${character.personal?.campaignYear || 767}:${iso(now)}`),
  type: 'madness', status: 'active', passionKey: input.passionKey,
  fumbledPassionValue: asInt(input.fumbledPassionValue, character.passions?.[input.passionKey]),
  onset: ['immediate', 'after_action'].includes(input.onset) ? input.onset : 'gm_pending',
  onsetDecision: input.onsetDecision || '', madnessYears: asInt(input.madnessYears), rowOffset: asInt(input.rowOffset),
  sourcePage: input.sourcePage || 'Ch.3 pp.79-80', startedYear: character.personal?.campaignYear || 767,
  note: String(input.note || ''), createdAt: iso(now)
});

export const triggerMadness = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const passionKey = String(input.passionKey || '');
  const fumbledPassionValue = asInt(input.fumbledPassionValue, character.passions?.[passionKey]);
  if (fumbledPassionValue < 1 && !String(input.externalSource || '').trim()) {
    throw new RangeError('Madness를 일으킨 Passion 값이 필요합니다.');
  }
  const condition = createMadness(character, state, {
    id: input.conditionId,
    passionKey,
    fumbledPassionValue,
    onset: input.onset,
    onsetDecision: input.onsetDecision,
    sourcePage: input.sourcePage || 'Ch.3 pp.79-80',
    note: input.note
  }, now);
  if (fumbledPassionValue < 1) {
    condition.externalSource = String(input.externalSource);
    condition.recoveryDependency = 'GM must identify the source procedure before annual Madness Solo resolution';
  }
  const transaction = appendTransaction(state, {
    id: input.transactionId || `${condition.id}:triggered`,
    type: 'madness_triggered',
    conditionId: condition.id,
    passionKey,
    fumbledPassionValue,
    onset: condition.onset,
    sourcePage: condition.sourcePage,
    createdAt: iso(now)
  }).entry;
  return { character, condition, result: transaction };
};

export const resolveMadnessOnset = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const condition = state.conditions.find(item => item.id === input.conditionId && item.type === 'madness' && item.status === 'active');
  if (!condition) throw new RangeError('발현 시점을 정할 Madness를 찾을 수 없습니다.');
  const onset = ['immediate', 'after_action'].includes(input.onset) ? input.onset : '';
  if (!onset) throw new RangeError('GM은 Madness가 즉시 또는 현재 행동 뒤에 발현하는지 정해야 합니다.');
  const transactionId = safeId(input.transactionId || `${condition.id}:onset`);
  const existing = state.transactions.find(item => item.id === transactionId);
  if (existing) return { character, condition, result: existing, applied: false };
  if (condition.onset !== 'gm_pending' && condition.onset !== onset) {
    throw new RangeError('이미 확정한 Madness 발현 시점은 바꿀 수 없습니다.');
  }
  condition.onset = onset;
  condition.onsetDecision = String(input.onsetDecision || (onset === 'immediate' ? 'GM: immediately' : 'GM: after the action'));
  condition.onsetResolvedAt = iso(now);
  const result = appendTransaction(state, {
    id: transactionId,
    type: 'madness_onset_decision',
    conditionId: condition.id,
    onset,
    onsetDecision: condition.onsetDecision,
    sourcePage: condition.sourcePage || 'Ch.3 p.79',
    createdAt: iso(now)
  }).entry;
  return { character, condition, result, applied: true };
};

const createMelancholy = (character, state, input = {}, now) => appendCondition(state, {
  id: safeId(input.id || `melancholy:${input.passionKey}:${character.personal?.campaignYear || 767}:${iso(now)}`),
  type: 'melancholy', status: 'active', passionKey: input.passionKey,
  provokingValue: asInt(input.provokingValue, character.passions?.[input.passionKey]),
  manifestationDays: 1, naturalRecoveryWeeks: asInt(input.provokingValue, character.passions?.[input.passionKey]),
  elapsedWeeks: 0, recoveryInterpretation: 'p.79의 1일 서술과 passion값 주 자연 회복을 함께 보존',
  sourcePage: input.sourcePage || 'Ch.3 p.79', startedYear: character.personal?.campaignYear || 767,
  note: String(input.note || ''), createdAt: iso(now)
});

export const beginPassionResolution = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  if (state.activeResolution) throw new RangeError('먼저 진행 중인 Passion 결과를 마쳐야 합니다.');
  const passionKey = String(input.passionKey || '');
  const value = scoreFor(character, 'passions', passionKey);
  const mode = ['ordinary', 'mandatory', 'frivolous'].includes(input.mode) ? input.mode : 'ordinary';
  if (mode === 'mandatory' && value < 16) throw new RangeError('Mandatory Passion은 값 16 이상일 때 GM이 요구합니다.');
  if (mode === 'ordinary' && !input.gmApproved) throw new RangeError('플레이어의 일반 Passion 사용에는 GM 승인이 필요합니다.');
  const roll = asInt(input.roll, rollDie(20, rng));
  const check = resolveD20Roll(roll, value + asInt(input.modifier));
  const id = safeId(input.transactionId || `passion:${passionKey}:${character.personal?.campaignYear || 767}:${iso(input.now)}`);
  const idealDoubled = input.ideal === 'chivalrous'
    ? qualifyIdeal(character, CHIVALROUS_TRAITS, 'honor')
    : input.ideal === 'romantic' ? qualifyIdeal(character, ROMANTIC_TRAITS, passionKey) : false;
  const bonus = check.outcome === 'critical' ? (idealDoubled ? 20 : 10) : check.outcome === 'success' ? (idealDoubled ? 10 : 5) : check.outcome === 'failure' ? -5 : 0;
  const resolution = {
    id, type: 'passion', table: '3-4', passionKey, passionValue: value, mode,
    roll: check.roll, target: check.target, outcome: check.outcome, skillModifier: bonus,
    ideal: idealDoubled ? input.ideal : null, status: check.outcome === 'fumble' ? 'resolved' : 'awaiting_action',
    sourcePage: 'Ch.3 pp.78-79', createdAt: iso(input.now)
  };
  if (check.outcome === 'fumble') {
    resolution.passionChange = adjustPassion(character, passionKey, -1);
    resolution.conditionId = createMadness(character, state, {
      passionKey, fumbledPassionValue: value, onset: input.onset,
      onsetDecision: input.onsetDecision, sourcePage: 'Ch.3 pp.78-80'
    }, input.now).id;
    appendTransaction(state, { ...resolution, type: 'passion_resolved' });
    state.activeResolution = null;
  } else {
    state.activeResolution = resolution;
  }
  return { character, resolution };
};

const createShock = (character, state, resolution, input, now, rng) => {
  const sourcePage = input.sourcePage || resolution.sourcePage || 'Ch.3 p.78';
  const aging = resolveAgingTableEffect(character, {
    agingRoll: input.agingRoll, attributeRolls: input.attributeRolls,
    eventId: `${resolution.id}:shock-aging`, cause: input.cause || 'Passion Shock',
    sourceRuleId: input.sourceRuleId || 'PASSION-USE-001', sourcePage, triggeringEvent: 'passion_shock'
  }, rng);
  Object.assign(character, aging.character);
  character.campaign = character.campaign || {};
  character.campaign.personalityMagic = state;
  character.campaign.passionStates = undefined;
  return appendCondition(state, {
    id: `${resolution.id}:shock`, type: 'shock', status: 'resolved', passionKey: resolution.passionKey,
    aging: { roll: aging.agingRoll, attributeRolls: aging.attributeRolls, losses: aging.losses },
    sourcePage, startedYear: character.personal?.campaignYear || 767,
    resolvedAt: iso(now), createdAt: iso(now)
  });
};

export const resolveScenarioPassionShock = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const passionKey = String(input.passionKey || '');
  const passionValue = scoreFor(character, 'passions', passionKey);
  const id = safeId(input.transactionId || `scenario_shock:${passionKey}:${character.personal?.campaignYear || 767}:${iso(input.now)}`);
  const existing = state.transactions.find(item => item.id === id);
  if (existing) return { character, result: existing, condition: state.conditions.find(item => item.id === existing.conditionId) || null, applied: false };
  const check = resolveD20Roll(asInt(input.roll, rollDie(20, rng)), passionValue + asInt(input.modifier));
  const sourcePage = input.sourcePage || 'Ch.19 p.423';
  const condition = check.success ? createShock(character, state, { id, passionKey }, {
    ...input,
    sourcePage,
    sourceRuleId: 'ADVENTURE-CH19-WRATHFUL-SHOCK',
    cause: 'Betrayal by a social better'
  }, input.now, rng) : null;
  const result = appendTransaction(state, {
    id,
    type: 'scenario_passion_shock',
    scenario: String(input.scenario || 'wrathful_lord'),
    passionKey,
    passionValue,
    check,
    shocked: Boolean(condition),
    conditionId: condition?.id || null,
    sourcePage,
    createdAt: iso(input.now)
  }).entry;
  return { character, result, condition, applied: true };
};

export const completePassionResolution = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const resolution = state.activeResolution;
  if (!resolution || !['passion', 'prayer'].includes(resolution.type)) throw new RangeError('후속 행동을 기다리는 Passion 또는 Prayer가 없습니다.');
  if (resolution.type === 'prayer' && resolution.outcome === 'critical' && !resolution.miracleDecisionId) {
    throw new RangeError('Critical prayer의 정확한 miracle 결과를 GM이 먼저 기록해야 합니다.');
  }
  const actionOutcome = input.actionOutcome === 'failed' ? 'failed' : 'successful';
  const passionKey = resolution.passionKey;
  let condition = null;
  let passionChange = null;
  if (['critical', 'success'].includes(resolution.outcome)) {
    if (actionOutcome === 'failed') condition = createShock(character, state, resolution, input, input.now, rng);
    else if (resolution.outcome === 'critical') {
      passionChange = adjustPassion(character, passionKey, 1);
      markPassionCheck(character, passionKey);
    } else markPassionCheck(character, passionKey);
  } else if (resolution.outcome === 'failure') {
    if (actionOutcome === 'failed') {
      passionChange = adjustPassion(character, passionKey, -1);
      condition = createMelancholy(character, state, { passionKey, provokingValue: resolution.passionValue }, input.now);
    } else passionChange = adjustPassion(character, passionKey, 1);
  }
  resolution.status = 'resolved';
  resolution.actionOutcome = actionOutcome;
  resolution.passionChange = passionChange;
  resolution.conditionId = condition?.id || null;
  resolution.resolvedAt = iso(input.now);
  const transaction = appendTransaction(state, { ...resolution, type: `${resolution.type}_resolved` }).entry;
  state.activeResolution = null;
  return { character, resolution: transaction, condition };
};

export const advanceMelancholyRecovery = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const condition = state.conditions.find(item => item.id === input.conditionId && item.type === 'melancholy' && item.status === 'active');
  if (!condition) throw new RangeError('회복 중인 Melancholy를 찾을 수 없습니다.');
  condition.elapsedWeeks = Math.max(0, asInt(condition.elapsedWeeks) + Math.max(0, asInt(input.weeks)));
  if (condition.elapsedWeeks >= asInt(condition.naturalRecoveryWeeks)) {
    condition.status = 'resolved';
    condition.recovery = 'natural';
    condition.resolvedAt = iso(now);
  }
  const transaction = appendTransaction(state, {
    id: input.transactionId || `${condition.id}:weeks:${condition.elapsedWeeks}`, type: 'melancholy_time',
    conditionId: condition.id, elapsedWeeks: condition.elapsedWeeks, status: condition.status,
    sourcePage: 'Ch.3 p.79', createdAt: iso(now)
  }).entry;
  return { character, condition, transaction };
};

export const resolveSnapOutCheck = input => {
  const victim = resolveD20Roll(asInt(input.victimRoll), asInt(input.victimPassionValue));
  const healer = resolveD20Roll(asInt(input.healerRoll), asInt(input.healerValue) + asInt(input.healerModifier));
  const opposed = resolveOpposedD20(healer, victim);
  let outcome = opposed.winner === 'actor' ? 'healer_wins' : opposed.winner === 'opponent' ? 'victim_wins' : 'tie';
  if (healer.outcome === 'failure') outcome = 'healer_fails';
  if (healer.outcome === 'fumble') outcome = 'healer_fumbles';
  if (victim.outcome === 'fumble') outcome = 'victim_fumbles';
  return { healer, victim, opposed, outcome };
};

export const resolveExternalMelancholyRecovery = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const healerGroup = input.healerGroup === 'traits' ? 'traits' : 'passions';
  const healerKey = String(input.healerKey || '');
  const healerValue = scoreFor(character, healerGroup, healerKey);
  const result = resolveSnapOutCheck({ ...input, healerValue });
  if (result.outcome === 'healer_fails') {
    if (healerGroup === 'passions') adjustPassion(character, healerKey, -1);
    else character[healerGroup][healerKey] = Math.max(0, healerValue - 1);
    createMelancholy(character, state, { passionKey: healerKey, provokingValue: healerValue, note: 'Snap Out of It healer failure' }, now);
  } else if (result.outcome === 'healer_fumbles') {
    if (healerGroup === 'passions') adjustPassion(character, healerKey, -1);
    else character[healerGroup][healerKey] = Math.max(0, healerValue - 1);
    createMadness(character, state, { passionKey: healerKey, fumbledPassionValue: healerValue, onset: 'immediate', note: 'Snap Out of It healer fumble' }, now);
  }
  const id = safeId(input.transactionId || `external_melancholy:${input.subject || 'npc'}:${iso(now)}`);
  const transaction = appendTransaction(state, {
    id, type: 'external_melancholy_recovery', subject: String(input.subject || 'NPC'), healerGroup, healerKey,
    result, victimState: result.outcome === 'healer_wins' ? 'recovered' : result.outcome === 'victim_fumbles' ? 'madness' : result.outcome === 'victim_wins' ? 'rage' : 'unchanged',
    sourcePage: input.sourcePage || 'Ch.3 p.79', createdAt: iso(now)
  }).entry;
  return { character, result: transaction };
};

const madActFor = (value, offset) => {
  const base = MAD_ACTS.findIndex(row => value >= row.min && value <= row.max);
  return MAD_ACTS[Math.min(MAD_ACTS.length - 1, Math.max(0, base) + Math.max(0, offset))];
};

const applyMadnessChange = (character, roll, input, rng) => {
  if (roll <= 3) {
    const key = input.key || randomKey(VIRTUE_KEYS, character.traits, rng);
    const before = scoreFor(character, 'traits', key);
    return { roll, ...setScore(character, 'traits', key, before >= 20 ? before + 1 : 20) };
  }
  if (roll <= 5) {
    const key = input.key || randomKey(VICE_KEYS, character.traits, rng);
    const before = scoreFor(character, 'traits', key);
    return { roll, ...setScore(character, 'traits', key, before >= 20 ? before + 1 : 20) };
  }
  if (roll <= 7) {
    const key = input.key || randomKey(STANDARD_PASSION_KEYS, character.passions, rng);
    return { roll, ...setScore(character, 'passions', key, 5) };
  }
  if (roll <= 10) {
    const key = input.key || randomKey(Object.keys(character.passions || {}), character.passions, rng);
    const before = scoreFor(character, 'passions', key);
    return { roll, ...setScore(character, 'passions', key, before >= 20 ? before + 1 : 20) };
  }
  if (roll === 11) {
    const removed = Object.keys(character.passions || {}).filter(key => !STANDARD_PASSION_KEYS.includes(key));
    removed.forEach(key => { delete character.passions[key]; });
    return { roll, group: 'passions', removed };
  }
  if (roll === 12) {
    const key = input.key || randomKey(ORDINARY_SKILL_KEYS, character.skills, rng);
    return { roll, ...setScore(character, 'skills', key, 1) };
  }
  if (roll === 13) {
    const key = input.key || randomKey(COURTLY_SKILL_KEYS, character.skills, rng);
    return { roll, ...setScore(character, 'skills', key, 1) };
  }
  if (roll === 14) {
    const key = input.key || randomKey(COMBAT_SKILL_KEYS, character.skills, rng);
    return { roll, ...setScore(character, 'skills', key, 1) };
  }
  if (roll === 15) {
    const candidates = Object.keys(character.passions || {}).filter(key => /^(amor|loveAmor|lovePerson|hate)/i.test(key));
    const key = input.key || randomKey(candidates, character.passions, rng);
    const replacement = key.startsWith('hate') ? key.replace(/^hate/i, 'lovePerson') : key.replace(/^(amor|loveAmor|lovePerson)/i, 'hate');
    character.passions[replacement] = character.passions[key];
    delete character.passions[key];
    return { roll, group: 'passions', key, replacement };
  }
  const aging = resolveAgingTableEffect(character, {
    agingRoll: input.agingRoll, attributeRolls: input.attributeRolls,
    eventId: input.eventId, cause: 'Table 19-21 Character Change',
    sourceRuleId: 'PASSION-MADNESS-001', sourcePage: 'Ch.19 p.431', triggeringEvent: 'madness_character_change'
  }, rng);
  Object.assign(character, aging.character);
  return { roll, group: 'attributes', agingRoll: aging.agingRoll, attributeRolls: aging.attributeRolls, losses: aging.losses };
};

export const resolveMadnessYear = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const condition = state.conditions.find(item => item.id === input.conditionId && item.type === 'madness' && item.status === 'active');
  if (!condition) throw new RangeError('진행 중인 Madness를 찾을 수 없습니다.');
  if (asInt(condition.fumbledPassionValue) < 1) {
    throw new RangeError('외부 원인 Madness의 연간 회복 절차는 원문 source dependency를 먼저 확정해야 합니다.');
  }
  const yearNumber = asInt(condition.madnessYears) + 1;
  const act = madActFor(asInt(condition.fumbledPassionValue), asInt(condition.rowOffset));
  const transactionId = safeId(input.transactionId || `${condition.id}:year:${yearNumber}`);
  const existing = state.transactions.find(item => item.id === transactionId);
  if (existing) return { character, condition, result: existing, applied: false };
  if (act.effect?.type === 'standing') recordStandingChange(character, {
    id: `${transactionId}:standing`, standingKey: act.effect.key, amount: act.effect.amount,
    title: act.label, sourceRuleId: 'PASSION-MADNESS-001', sourcePage: 'Ch.19 p.431'
  });
  if (act.effect?.type === 'honor') recordHonorChange(character, {
    id: `${transactionId}:honor`, amount: act.effect.amount, title: act.label,
    sourceRuleId: 'PASSION-MADNESS-001', sourcePage: 'Ch.19 p.431'
  });
  const changeInputs = list(input.changes);
  const changes = Array.from({ length: act.changes }, (_, index) => {
    const details = changeInputs[index] || {};
    const roll = asInt(details.roll, rollDie(20, rng));
    if (roll < 1 || roll > 20) throw new RangeError('Table 19-21은 d20 1-20을 사용합니다.');
    return applyMadnessChange(character, roll, { ...details, eventId: `${transactionId}:aging:${index}` }, rng);
  });
  const recoveryRoll = asInt(input.recoveryRoll, rollDie(6, rng));
  if (recoveryRoll < 1 || recoveryRoll > 6) throw new RangeError('Madness 회복은 d6를 사용합니다.');
  const recovered = recoveryRoll + yearNumber > act.changes;
  condition.madnessYears = yearNumber;
  condition.lastMadAct = act.label;
  condition.lastChanges = changes;
  condition.lastRecoveryRoll = recoveryRoll;
  if (recovered) {
    condition.status = 'resolved';
    condition.recovery = 'madness_solo';
    condition.resolvedAt = iso(input.now);
  } else condition.rowOffset = asInt(condition.rowOffset) + 1;
  const result = appendTransaction(state, {
    id: transactionId, type: 'madness_year', conditionId: condition.id, yearNumber, madAct: act.label,
    characterChangeCount: act.changes, changes, recoveryRoll, recovered,
    sourcePage: 'Ch.19 p.431', createdAt: iso(input.now)
  }).entry;
  appendChronicleEvent(character, {
    id: `${transactionId}:chronicle`, type: recovered ? 'recovery' : 'madness',
    title: recovered ? '이성을 되찾다' : '광기의 해를 보내다',
    narrative: `${act.label}. ${changes.length}개의 성격 변화를 겪었습니다.`,
    sourceRuleId: 'PASSION-MADNESS-001', sourcePage: 'Ch.19 p.431'
  });
  return { character, condition, result, applied: true };
};

export const takeOath = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  if (state.oath?.status === 'active') throw new RangeError('Player-knight는 활성 oath를 하나만 가질 수 있습니다.');
  const passionKey = String(input.passionKey || 'honor');
  const check = resolveD20Roll(asInt(input.roll, rollDie(20, rng)), scoreFor(character, 'passions', passionKey));
  const stake = { critical: 3, success: 2, failure: 1, fumble: 0 }[check.outcome];
  const kind = input.kind === 'negative' ? 'negative' : 'positive';
  const id = safeId(input.transactionId || `oath:${kind}:${iso(input.now)}`);
  state.oath = {
    id, kind, text: String(input.text || ''), passionKey, roll: check.roll, outcome: check.outcome,
    honorStake: stake, status: 'active', sourcePage: 'Ch.3 p.81', createdAt: iso(input.now)
  };
  if (!state.oath.text) throw new RangeError('맹세 내용을 기록하세요.');
  if (kind === 'negative' && stake) recordHonorChange(character, {
    id: `${id}:honor`, amount: stake, title: 'Negative oath', narrative: state.oath.text,
    sourceRuleId: 'PASSION-OATH-001', sourcePage: 'Ch.3 p.81'
  });
  appendTransaction(state, { id, type: 'oath_taken', oath: clone(state.oath), sourcePage: 'Ch.3 p.81', createdAt: iso(input.now) });
  return { character, oath: state.oath };
};

export const settleOath = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const oath = state.oath;
  if (!oath || oath.status !== 'active') throw new RangeError('정산할 활성 oath가 없습니다.');
  const fulfilled = Boolean(input.fulfilled);
  if (oath.kind === 'positive' && oath.honorStake) recordHonorChange(character, {
    id: `${oath.id}:settlement`, amount: fulfilled ? oath.honorStake : -oath.honorStake,
    title: fulfilled ? 'Oath fulfilled' : 'Oath failed', narrative: oath.text,
    sourceRuleId: 'PASSION-OATH-001', sourcePage: 'Ch.3 p.81'
  });
  oath.status = fulfilled ? 'fulfilled' : 'broken';
  oath.resolvedAt = iso(now);
  if (oath.kind === 'negative' && !fulfilled) {
    appendCondition(state, {
      id: `${oath.id}:fatal`, type: 'broken_negative_oath', status: 'active',
      gmResolutionRequired: true, note: '원문은 결국 죽는다고 명시하지만 시점과 방식은 정하지 않음',
      sourcePage: 'Ch.3 p.81', startedYear: character.personal?.campaignYear, createdAt: iso(now)
    });
  }
  const transaction = appendTransaction(state, {
    id: input.transactionId || `${oath.id}:settled`, type: 'oath_settled', oathId: oath.id,
    fulfilled, status: oath.status, sourcePage: 'Ch.3 p.81', createdAt: iso(now)
  }).entry;
  return { character, oath, transaction };
};

const prayerModifier = (character, input) => {
  const form = { mortal_peril: -2, normal: -1, mass: 0 }[input.form] ?? 0;
  const place = { ordinary: -1, church: 0, cathedral: 1 }[input.place] ?? 0;
  const faithful = { none: 0, ten: 1, hundred: 2, thousand: 3 }[input.faithful] ?? 0;
  const day = { ordinary: -1, sunday: 0, holy: 1 }[input.day] ?? 0;
  const sacred = { none: 0, blessed: 1, relic: 2 }[input.sacredItem] ?? 0;
  const pilgrimage = input.onPilgrimage ? Math.max(1, asInt(input.pilgrimageModifier, 1)) : 0;
  const religious = qualifyIdeal(character, RELIGIOUS_TRAITS, 'loveGod') ? 5 : 0;
  const contextual = asInt(input.contextModifier);
  if (contextual && !String(input.contextNote || '').trim()) throw new RangeError('기도의 추가 수정에는 relic 또는 GM 근거가 필요합니다.');
  return { form, place, faithful, day, sacred, pilgrimage, religious, contextual, total: form + place + faithful + day + sacred + pilgrimage + religious + contextual };
};

export const beginPrayerResolution = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  if (state.activeResolution) throw new RangeError('먼저 진행 중인 Personality/Magic 결과를 마쳐야 합니다.');
  if (character.personal?.religionId && character.personal.religionId !== 'christian') {
    throw new RangeError('Chapter 9 Christian magic은 Christian으로 기록된 캐릭터만 사용할 수 있습니다.');
  }
  if (!input.eligible) throw new RangeError('Charlemagne의 적·마법 사용자·파문자 등은 기도의 이익을 받을 수 없습니다.');
  if (asInt(character.passions?.loveGod) <= 5) throw new RangeError('Love [God] 5 이하는 파문되어 Christian magic의 이익을 받을 수 없습니다.');
  const beneficiary = input.beneficiary === 'other_prayer' ? 'other_prayer' : 'self_prayer';
  const passionKey = beneficiary === 'self_prayer' ? 'loveCharlemagne' : 'loveGod';
  const sourcePage = input.sourcePage || 'Ch.9 pp.165-167';
  const modifiers = prayerModifier(character, input);
  if (typeof input.gmUsesTable !== 'boolean') throw new RangeError('GM이 Table 9–2 적용 여부를 명시해야 합니다.');
  if (!input.gmUsesTable) {
    const id = safeId(input.transactionId || `prayer:${beneficiary}:${character.personal?.campaignYear || 767}:${iso(input.now)}`);
    const resolution = appendTransaction(state, {
      id, type: 'prayer_resolved', table: null, passionKey, beneficiary,
      intention: String(input.intention || ''), modifiers, outcome: 'gm_narrative', skillModifier: 0,
      status: 'resolved', sourcePage, createdAt: iso(input.now)
    }).entry;
    if (!resolution.intention) throw new RangeError('기도로 무엇을 청하는지 명확히 기록하세요.');
    state.prayers.push(resolution);
    return { character, resolution };
  }
  const check = resolveD20Roll(asInt(input.roll, rollDie(20, rng)), scoreFor(character, 'passions', passionKey) + modifiers.total);
  const id = safeId(input.transactionId || `prayer:${beneficiary}:${character.personal?.campaignYear || 767}:${iso(input.now)}`);
  const resolution = {
    id, type: 'prayer', table: '9-2', passionKey, passionValue: scoreFor(character, 'passions', passionKey),
    beneficiary, intention: String(input.intention || ''), modifiers, roll: check.roll, target: check.target,
    outcome: check.outcome, skillModifier: check.outcome === 'critical' ? 20 : check.outcome === 'success' ? 10 : check.outcome === 'failure' ? -5 : 0,
    status: check.outcome === 'fumble' ? 'resolved' : 'awaiting_action', miracleDecisionRequired: check.outcome === 'critical',
    sourcePage, createdAt: iso(input.now)
  };
  if (!resolution.intention) throw new RangeError('기도로 무엇을 청하는지 명확히 기록하세요.');
  state.prayers.push(resolution);
  if (check.outcome === 'fumble') {
    resolution.passionChange = adjustPassion(character, passionKey, -1);
    resolution.conditionId = createMadness(character, state, { passionKey, fumbledPassionValue: resolution.passionValue, onset: input.onset, sourcePage: 'Ch.9 p.166' }, input.now).id;
    appendTransaction(state, { ...resolution, type: 'prayer_resolved' });
  } else state.activeResolution = resolution;
  return { character, resolution };
};

export const recordMiracleDecision = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  if (!String(input.context || '').trim() || !String(input.chosenResult || '').trim()) {
    throw new RangeError('기적의 맥락과 GM이 정한 결과를 기록하세요.');
  }
  const id = safeId(input.transactionId || `miracle:${character.personal?.campaignYear || 767}:${iso(now)}`);
  const decision = {
    id, type: 'miracle', context: String(input.context), availableResult: String(input.availableResult || 'GM determines exact nature'),
    chosenResult: String(input.chosenResult), downstreamState: String(input.downstreamState || ''),
    prayerResolutionId: input.prayerResolutionId || state.activeResolution?.id || null,
    sourcePage: input.sourcePage || 'Ch.9 p.166', createdAt: iso(now)
  };
  const transaction = appendTransaction(state, { ...decision, type: 'miracle_decision' });
  if (transaction.applied) {
    state.gmDecisions.push(decision);
    if (state.activeResolution?.type === 'prayer' && state.activeResolution.outcome === 'critical'
      && state.activeResolution.id === decision.prayerResolutionId) {
      state.activeResolution.miracleDecisionId = transaction.entry.id;
    }
  }
  return { character, decision: transaction.entry, applied: transaction.applied };
};

export const resolveDream = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const passionKey = ['loveGod', 'loveCharlemagne'].includes(input.passionKey) ? input.passionKey : 'loveGod';
  const passionRoll = input.passionRoll ?? input.loveGodRoll;
  const love = resolveD20Roll(asInt(passionRoll, rollDie(20, rng)), scoreFor(character, 'passions', passionKey));
  let religion = null;
  if (love.success) {
    religion = resolveD20Roll(
      asInt(input.religionRoll, rollDie(20, rng)),
      scoreFor(character, 'skills', 'religion') + (love.outcome === 'critical' ? 5 : 0)
    );
  }
  const id = safeId(input.transactionId || `dream:${character.personal?.campaignYear || 767}:${iso(input.now)}`);
  const dream = {
    id, type: 'dream', passionKey, passionCheck: love, loveGod: passionKey === 'loveGod' ? love : null, religion,
    messageSource: String(input.messageSource || 'GM'),
    message: String(input.message || ''), interpretation: String(input.interpretation || ''),
    sourcePage: input.sourcePage || 'Ch.9 pp.168-169', createdAt: iso(input.now)
  };
  if (dream.message && !['GM', 'source'].includes(dream.messageSource)) throw new RangeError('꿈과 징조의 내용은 GM 또는 원문 출처로만 기록합니다.');
  if (dream.messageSource === 'source' && !String(input.sourcePage || '').trim()) throw new RangeError('원문 꿈에는 source page가 필요합니다.');
  const transaction = appendTransaction(state, { ...dream, type: 'dream_resolved' });
  if (transaction.applied) state.dreams.push(dream);
  return { character, dream: transaction.entry, applied: transaction.applied };
};

export const resolveIntrospection = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const amor = state.amor;
  if (!amor || !['active', 'exposed'].includes(amor.status)) throw new RangeError('Amor 또는 Love [amor]가 필요합니다.');
  const gameDay = String(input.gameDay || '').trim();
  if (!gameDay) throw new RangeError('하루 한 번 제한을 확인할 game day를 기록하세요.');
  const transactionId = safeId(input.transactionId || `${amor.id}:introspection:${gameDay}`);
  const existing = state.transactions.find(item => item.id === transactionId);
  if (existing) return { character, result: existing, applied: false };
  const check = resolveD20Roll(asInt(input.roll, rollDie(20, rng)), scoreFor(character, 'passions', amor.passionKey));
  let condition = null;
  if (check.outcome === 'critical') {
    const durationRolls = Array.from({ length: 4 }, (_, index) => asInt(input.durationRolls?.[index], rollDie(6, rng)));
    condition = appendCondition(state, {
      id: `${transactionId}:condition`, type: 'introspection', status: 'active', passionKey: amor.passionKey,
      gameDay, durationRolls, durationMinutes: durationRolls.reduce((sum, value) => sum + value, 0),
      prohibitedRolls: ['awareness', 'heraldry', 'recognize', 'perception', 'knowledge'],
      defenseSkillModifier: 5, sourcePage: 'Ch.3 p.80', startedYear: character.personal?.campaignYear || 767,
      createdAt: iso(input.now)
    });
  }
  const result = appendTransaction(state, {
    id: transactionId, type: 'introspection_check', amorId: amor.id, gameDay, check,
    conditionId: condition?.id || null, sourcePage: 'Ch.3 p.80', createdAt: iso(input.now)
  }).entry;
  return { character, condition, result, applied: true };
};

export const completeIntrospection = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const condition = state.conditions.find(item => item.id === input.conditionId && item.type === 'introspection' && item.status === 'active');
  if (!condition) throw new RangeError('진행 중인 Introspection을 찾을 수 없습니다.');
  condition.status = 'resolved';
  condition.resolvedAt = iso(now);
  const result = appendTransaction(state, {
    id: input.transactionId || `${condition.id}:completed`, type: 'introspection_completed',
    conditionId: condition.id, sourcePage: 'Ch.3 p.80', createdAt: iso(now)
  }).entry;
  return { character, condition, result };
};

const amorModifier = input => {
  const gloryStep = input.amorGender === 'man' ? 5000 : 1000;
  const glory = Math.floor(Math.max(0, asInt(input.amorGlory)) / gloryStep);
  const beauty = Math.max(0, asInt(input.amorApp) - 15);
  const savedKnight = input.amorSavedKnight ? 5 : 0;
  const savedAmor = input.knightSavedAmor ? 5 : 0;
  const enemy = input.enemy ? -1 : 0;
  const raw = glory + beauty + savedKnight + savedAmor + enemy;
  return { glory, beauty, savedKnight, savedAmor, enemy, raw, total: Math.min(10, raw) };
};

export const startAmor = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  if (state.amor && !['ended_by_death'].includes(state.amor.status)) throw new RangeError('한 번에 하나의 Amor만 가질 수 있습니다.');
  if (state.amor?.permanentlyRejected) throw new RangeError('Essai의 결정적 거절 뒤에는 다른 Amor를 가질 수 없습니다.');
  const targetName = String(input.targetName || '').trim();
  if (!targetName) throw new RangeError('Amor 대상을 입력하세요.');
  const roll = asInt(input.roll, rollDie(6, rng));
  if (roll < 1 || roll > 6) throw new RangeError('Amor 시작값은 1d6+6입니다.');
  const modifiers = amorModifier(input);
  const value = roll + 6 + modifiers.total;
  if (value >= 16 && input.keep === false) throw new RangeError('16 이상의 true passion은 버릴 수 없습니다.');
  const id = safeId(input.transactionId || `amor:${targetName}:${character.personal?.campaignYear || 767}:${iso(input.now)}`);
  if (value < 16 && input.keep === false) {
    const transaction = appendTransaction(state, { id, type: 'amor_declined', targetName, roll, modifiers, value, sourcePage: 'Ch.3 p.76', createdAt: iso(input.now) });
    return { character, amor: null, candidate: transaction.entry, applied: transaction.applied };
  }
  const passionKey = `amor:${safeId(targetName)}`;
  character.passions = { ...(character.passions || {}), [passionKey]: value };
  state.amor = {
    id, targetName, secretName: input.secretName ? String(input.secretName) : 'Amor', passionKey, value,
    modifiers, phase: 'declaration', status: 'active', knightPassionType: 'amor', ladyPassionType: 'potential_amor',
    potentialAmor: null, potentialAmorVisibility: 'gm_only', reluctance: null, reluctanceInfinite: null,
    completedTasks: 0, taskHistory: [], pendingTask: null, annual: null, selfImposedTasks: 0,
    affairYears: 0, discoveryHistory: [], sourcePage: 'Ch.3 pp.76-77; Ch.19 pp.433-435', createdAt: iso(input.now)
  };
  appendTransaction(state, { id, type: 'amor_started', amorId: id, targetName, passionKey, value, modifiers, sourcePage: 'Ch.3 p.76', createdAt: iso(input.now) });
  return { character, amor: state.amor, applied: true };
};

export const resolvePaganLadyAmor = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const mode = input.mode === 'deliberate' ? 'deliberate' : 'passive';
  const ladyName = String(input.ladyName || '').trim();
  if (!ladyName) throw new RangeError('이교도 귀부인의 이름 또는 식별자를 기록하세요.');
  const resistanceKey = mode === 'passive' ? 'Chaste' : 'Honor';
  const resistanceValue = asInt(input.ladyResistanceValue);
  if (resistanceValue < 1) throw new RangeError(`귀부인의 ${resistanceKey} 수치가 필요합니다.`);
  const appCheck = resolveD20Roll(asInt(input.appRoll, rollDie(20, rng)), scoreFor(character, 'attributes', 'app'));
  const resistanceCheck = resolveD20Roll(asInt(input.ladyRoll, rollDie(20, rng)), resistanceValue);
  const opposed = resolveOpposedD20(appCheck, resistanceCheck);
  const success = opposed.winner === 'actor';
  const id = safeId(input.transactionId || `pagan_lady_amor:${mode}:${ladyName}:${character.personal?.campaignYear || 767}:${iso(input.now)}`);
  const existing = state.transactions.find(entry => entry.id === id);
  if (existing) return { character, result: existing, applied: false };
  let externalPassion = null;
  let amor = null;
  if (success) {
    const ladyAmorValue = asInt(input.ladyAmorValue);
    if (!input.playerAgreed || !input.gmAgreed || ladyAmorValue < 1) {
      throw new RangeError('생성되는 Amor의 시작값은 플레이어와 GM이 합의해야 합니다.');
    }
    externalPassion = {
      id: `${id}:lady`, subject: ladyName, kind: 'amor', target: character.personal?.name || 'Player-knight',
      value: ladyAmorValue, visibility: mode === 'passive' ? 'gm_only' : 'known', status: 'active',
      sourcePage: 'Ch.9 pp.170-171', createdAt: iso(input.now)
    };
    state.externalPassions.push(externalPassion);
    if (mode === 'deliberate') {
      if (state.amor && !['ended_by_death'].includes(state.amor.status)) throw new RangeError('Player-knight는 한 번에 하나의 Amor만 가질 수 있습니다.');
      const playerAmorValue = asInt(input.playerAmorValue);
      if (playerAmorValue < 1) throw new RangeError('Player-knight의 합의된 Amor 시작값이 필요합니다.');
      const passionKey = `amor:${safeId(ladyName)}`;
      character.passions = { ...(character.passions || {}), [passionKey]: playerAmorValue };
      state.amor = {
        id: `${id}:knight`, targetName: ladyName, secretName: String(input.secretName || 'Amor'), passionKey,
        value: playerAmorValue, modifiers: { source: 'player_gm_agreement' }, phase: 'declaration', status: 'active',
        knightPassionType: 'amor', ladyPassionType: 'amor', potentialAmor: ladyAmorValue,
        potentialAmorVisibility: 'gm_only', reluctance: null, reluctanceInfinite: null, completedTasks: 0,
        taskHistory: [], pendingTask: null, annual: null, selfImposedTasks: 0, affairYears: 0,
        discoveryHistory: [], sourcePage: 'Ch.3 p.76; Ch.9 p.171', createdAt: iso(input.now)
      };
      amor = state.amor;
    }
  }
  const transaction = appendTransaction(state, {
    id, type: 'pagan_lady_amor', mode, ladyName, resistanceKey, appCheck, resistanceCheck, opposed, success,
    externalPassionId: externalPassion?.id || null, amorId: amor?.id || null, sourcePage: 'Ch.9 pp.170-171', createdAt: iso(input.now)
  });
  return { character, result: transaction.entry, externalPassion, amor, applied: transaction.applied };
};

export const resumeAmorProcedure = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const amor = state.amor;
  if (!amor || amor.status !== 'active') throw new RangeError('계속할 활성 Amor가 없습니다.');
  const action = String(input.action || 'romance_start');
  const ready = action === 'romance_start' ? amor.potentialAmor !== null
    : action === 'romance_progression' ? amor.phase === 'essai'
      : action === 'romance_essai' ? amor.phase === 'essai_passed'
        : action === 'romance_consummation' ? amor.phase === 'affair'
          : action === 'romance_discovery' ? amor.phase === 'exposed' || (amor.phase === 'affair' && list(amor.discoveryHistory).length > 0)
            : false;
  if (!ready) throw new RangeError('현재 Amor 상태가 이 Romance 단계의 완료 조건을 아직 충족하지 않습니다.');
  const result = appendTransaction(state, {
    id: input.transactionId || `${amor.id}:resume:${action}:${character.personal?.campaignYear || 767}`,
    type: 'amor_resumed', amorId: amor.id, action, phase: amor.phase,
    sourcePage: 'Ch.19 pp.433-435', createdAt: iso(now)
  });
  return { character, amor, result: result.entry, applied: result.applied };
};

export const setPotentialAmor = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const amor = state.amor;
  if (!amor || amor.status !== 'active') throw new RangeError('진행 중인 Amor가 없습니다.');
  if (amor.pendingTask) throw new RangeError('진행 중인 self-imposed Lover’s Task를 먼저 해결하세요.');
  const baseValue = asInt(input.value);
  if (baseValue < 1) throw new RangeError('Lady의 Potential Amor 값을 GM이 확정하세요.');
  const selfImposedBonus = asInt(amor.selfImposedTasks);
  const value = baseValue + selfImposedBonus;
  amor.potentialAmor = value;
  amor.reluctanceInfinite = value < 10;
  amor.reluctance = value < 10 ? null : Math.max(0, 20 - value + Math.max(0, asInt(input.chaste) - 15));
  amor.phase = amor.reluctance === 0 && !amor.reluctanceInfinite ? 'essai' : 'wooing';
  const transaction = appendTransaction(state, {
    id: input.transactionId || `${amor.id}:potential`, type: 'amor_potential_set', amorId: amor.id,
    baseValue, selfImposedBonus, value, reluctance: amor.reluctance, gmOnly: true, sourcePage: 'Ch.3 p.77; Ch.19 p.434', createdAt: iso(now)
  }).entry;
  return { character, amor, transaction };
};

export const beginAmorWinter = (characterValue, input = {}, rng = Math.random) => {
  let character = clone(characterValue);
  let state = ensureState(character);
  const amor = state.amor;
  if (!amor || amor.status !== 'active' || !['wooing', 'declaration'].includes(amor.phase)) throw new RangeError('Wooing 단계의 Amor가 필요합니다.');
  if (amor.potentialAmor === null) throw new RangeError('만남 뒤 Potential Amor와 Reluctance를 먼저 확정하세요.');
  const year = character.personal?.campaignYear || 767;
  if (amor.annual?.year === year) throw new RangeError('이 해의 Amor 접근은 이미 처리되었습니다.');
  const giftLivres = Number(input.giftLivres ?? 1);
  if (!Number.isFinite(giftLivres) || giftLivres < 1) throw new RangeError('각 겨울 최소 £1의 선물이 필요합니다.');
  const transactionId = safeId(input.transactionId || `${amor.id}:winter:${year}`);
  const transfer = recordEconomyTransfer(character, {
    id: `${transactionId}:gift`, type: 'amor_gift', amountDeniers: -toDeniers(giftLivres),
    label: `${amor.targetName}에게 Amor 선물`, note: 'Gift and Approach',
    sourceRuleId: 'MAGIC-AMOR-001', sourcePage: 'Ch.19 p.434', createdAt: input.now
  });
  character = transfer.character;
  state = ensureState(character);
  const currentAmor = state.amor;
  const romance = resolveD20Roll(asInt(input.romanceRoll, rollDie(20, rng)), scoreFor(character, 'skills', 'romance'));
  currentAmor.annual = { year, giftLivres, romance, status: romance.success ? 'task_pending' : 'ended_for_year' };
  if (romance.success) currentAmor.phase = 'task';
  const transaction = appendTransaction(state, {
    id: transactionId, type: 'amor_approach', amorId: currentAmor.id, year, giftLivres,
    romance, taskAllowed: romance.success, sourcePage: 'Ch.19 p.434', createdAt: iso(input.now)
  }).entry;
  return { character, amor: currentAmor, result: transaction };
};

export const beginAcceleratedLoversTask = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const amor = state.amor;
  if (!amor || amor.status !== 'active') throw new RangeError('진행 중인 Amor가 필요합니다.');
  if (input.context !== 'love_conquers_all') throw new RangeError('가속 과업은 Love Conquers All 원문 절차에서만 사용합니다.');
  if (amor.pendingTask) throw new RangeError('먼저 확정된 Lover’s Task를 해결하세요.');
  if (asInt(amor.completedTasks) >= 3) throw new RangeError('Love Conquers All의 세 과업이 이미 완료되었습니다.');
  const sequence = asInt(amor.completedTasks) + 1;
  const transactionId = safeId(input.transactionId || `${amor.id}:love_conquers_all:task:${sequence}`);
  const existing = state.transactions.find(item => item.id === transactionId);
  if (existing) return { character, amor, result: existing, applied: false };
  amor.phase = 'task';
  amor.annual = {
    year: character.personal?.campaignYear || 767,
    status: 'task_pending',
    context: 'love_conquers_all',
    sequence,
    sourcePage: 417
  };
  const result = appendTransaction(state, {
    id: transactionId,
    type: 'amor_accelerated_task_ready',
    amorId: amor.id,
    sequence,
    sourcePage: 'Ch.19 p.417',
    createdAt: iso(now)
  }).entry;
  return { character, amor, result, applied: true };
};

export const beginSelfImposedLoversTask = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const amor = state.amor;
  if (!amor || amor.status !== 'active' || amor.potentialAmor !== null) {
    throw new RangeError('상대와 만나기 전의 unreciprocated Amor만 자가 과업을 정할 수 있습니다.');
  }
  if (amor.pendingTask) throw new RangeError('먼저 확정된 Lover’s Task를 해결하세요.');
  const sequence = asInt(amor.selfImposedTasks) + 1;
  const transactionId = safeId(input.transactionId || `${amor.id}:self_imposed:task:${sequence}`);
  const existing = state.transactions.find(item => item.id === transactionId);
  if (existing) return { character, amor, result: existing, applied: false };
  amor.phase = 'task';
  amor.annual = {
    year: character.personal?.campaignYear || 767,
    status: 'task_pending',
    context: 'self_imposed',
    sequence,
    sourcePage: 'Ch.3 p.77; Ch.19 p.434'
  };
  const result = appendTransaction(state, {
    id: transactionId, type: 'amor_self_imposed_task_ready', amorId: amor.id, sequence,
    sourcePage: 'Ch.3 p.77; Ch.19 p.434', createdAt: iso(now)
  }).entry;
  return { character, amor, result, applied: true };
};

const loverTaskRow = adjustedRoll => CHAPTER_19_TABLES['19-28'].rows.find(row => adjustedRoll >= row.min && adjustedRoll <= row.max);

export const drawLoversTask = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const amor = state.amor;
  if (!amor || amor.phase !== 'task' || amor.annual?.status !== 'task_pending') throw new RangeError('이번 해의 Lover’s Task를 받을 수 없습니다.');
  if (amor.pendingTask) throw new RangeError('이미 확정된 Lover’s Task가 있습니다.');
  const roll = asInt(input.roll, rollDie(20, rng));
  const adjustedRoll = roll + asInt(amor.completedTasks);
  const row = loverTaskRow(adjustedRoll);
  if (!row) throw new RangeError('Table 19-28 결과 범위를 찾을 수 없습니다.');
  if (input.ignoreDuplicates && amor.taskHistory.some(task => task.result === row.result)) {
    throw new RangeError('Love Conquers All은 이미 나온 Lover’s Task를 무시하고 다시 굴립니다.');
  }
  amor.pendingTask = {
    id: safeId(`${amor.id}:task:${amor.completedTasks + 1}:${amor.annual.year}`),
    roll, adjustedRoll, min: row.min, max: row.max, result: row.result,
    test: row.test || null, status: 'pending', sourcePage: 434
  };
  const transaction = appendTransaction(state, { ...amor.pendingTask, type: 'amor_task_drawn', amorId: amor.id, createdAt: iso(input.now) }).entry;
  return { character, amor, task: amor.pendingTask, result: transaction };
};

const taskScore = (character, amor, task, input) => {
  const requested = String(input.testKey || '').trim();
  const allowed = list(task.test).length ? list(task.test).map(value => String(value)) : task.test ? [String(task.test)] : [];
  if (!allowed.length) return null;
  const normalizedAllowed = allowed.map(value => value.toLowerCase().replace(/[^a-z]/g, ''));
  const normalizedRequested = requested.toLowerCase().replace(/[^a-z]/g, '');
  if (requested && !normalizedAllowed.includes(normalizedRequested)) {
    throw new RangeError(`이 Lover’s Task는 ${allowed.join(' 또는 ')} 판정만 허용합니다.`);
  }
  if (requested === 'amor') return { group: 'passions', key: amor.passionKey, value: scoreFor(character, 'passions', amor.passionKey) };
  if (requested === 'app') return { group: 'attributes', key: 'app', value: scoreFor(character, 'attributes', 'app') };
  if (requested && Number.isFinite(Number(character.skills?.[requested]))) return { group: 'skills', key: requested, value: scoreFor(character, 'skills', requested) };
  if (requested && Number.isFinite(Number(character.traits?.[requested]))) return { group: 'traits', key: requested, value: scoreFor(character, 'traits', requested) };
  const normalized = String(requested || allowed[0]).toLowerCase();
  if (normalized.includes('amor')) return { group: 'passions', key: amor.passionKey, value: scoreFor(character, 'passions', amor.passionKey) };
  if (normalized.includes('app')) return { group: 'attributes', key: 'app', value: scoreFor(character, 'attributes', 'app') };
  const key = [...ORDINARY_SKILL_KEYS, ...COURTLY_SKILL_KEYS, ...TRAIT_KEYS].find(candidate => normalized.replace(/[^a-z]/g, '').includes(candidate.toLowerCase()));
  if (!key) return null;
  const group = TRAIT_KEYS.includes(key) ? 'traits' : 'skills';
  return { group, key, value: scoreFor(character, group, key) };
};

export const resolveLoversTask = (characterValue, input = {}, rng = Math.random) => {
  let character = clone(characterValue);
  let state = ensureState(character);
  let amor = state.amor;
  const task = amor?.pendingTask;
  if (!amor || !task || task.status !== 'pending') throw new RangeError('해결할 Lover’s Task가 없습니다.');
  const transactionId = safeId(input.transactionId || `${task.id}:resolved`);
  const existing = state.transactions.find(item => item.id === transactionId);
  if (existing) return { character, amor, result: existing, applied: false };
  let honorConflict = null;
  if (task.min >= 25) {
    const passion = resolveD20Roll(asInt(input.amorRoll, rollDie(20, rng)), scoreFor(character, 'passions', amor.passionKey));
    const honor = resolveD20Roll(asInt(input.honorRoll, rollDie(20, rng)), scoreFor(character, 'passions', 'honor'));
    honorConflict = { passion, honor, opposed: resolveOpposedD20(passion, honor) };
    if (honorConflict.opposed.winner !== 'actor') {
      task.status = 'not_attempted';
      task.honorConflict = honorConflict;
      amor.annual.status = 'ended_for_year';
      amor.phase = 'wooing';
      const result = appendTransaction(state, {
        id: transactionId, type: 'amor_task_resolved', amorId: amor.id, taskId: task.id,
        success: false, attempted: false, honorConflict, sourcePage: 'Ch.19 p.434', createdAt: iso(input.now)
      }).entry;
      amor.taskHistory.push(clone(task));
      amor.pendingTask = null;
      return { character, amor, result, applied: true };
    }
  }
  let check = null;
  let success;
  let critical;
  const score = taskScore(character, amor, task, input);
  if (score) {
    check = resolveD20Roll(asInt(input.roll, rollDie(20, rng)), score.value - 1);
    success = check.success;
    critical = check.outcome === 'critical';
    if (success && score.group === 'skills') character.skillsChecked = { ...(character.skillsChecked || {}), [score.key]: true };
    if (success && score.group === 'traits') character.traitsChecked = { ...(character.traitsChecked || {}), [score.key]: true };
  } else {
    if (!String(input.canonicalResultId || input.gmNote || '').trim()) throw new RangeError('전투·대회·선물 과업은 기존 엔진 결과 또는 GM 기록이 필요합니다.');
    success = Boolean(input.success);
    critical = Boolean(input.critical);
  }
  if (task.min <= 2 && success) {
    const cost = asInt(input.jewelryLivres);
    if (cost < 1 || cost > 6) throw new RangeError('보석 과업은 원문 1d6£ 범위여야 합니다.');
    const transfer = recordEconomyTransfer(character, {
      id: `${transactionId}:jewelry`, type: 'amor_task_jewelry', amountDeniers: -toDeniers(cost),
      label: `${amor.targetName}에게 보석`, note: 'Table 19-28', sourceRuleId: 'MAGIC-AMOR-001', sourcePage: 'Ch.19 p.434'
    });
    character = transfer.character;
    state = ensureState(character);
    amor = state.amor;
  }
  const taskContext = amor.annual?.context;
  const reduction = success && !amor.reluctanceInfinite && taskContext !== 'self_imposed'
    ? (task.min >= 25 || critical ? 2 : 1)
    : 0;
  if (success) amor.completedTasks = asInt(amor.completedTasks) + 1;
  if (success && taskContext === 'self_imposed') amor.selfImposedTasks = asInt(amor.selfImposedTasks) + 1;
  if (reduction) amor.reluctance = Math.max(0, asInt(amor.reluctance) - reduction);
  const currentTask = amor.pendingTask;
  currentTask.status = success ? 'complete' : 'failed';
  currentTask.check = check;
  currentTask.honorConflict = honorConflict;
  currentTask.reluctanceReduction = reduction;
  currentTask.gmNote = String(input.gmNote || '');
  const accelerated = taskContext === 'love_conquers_all';
  amor.taskHistory.push(clone(currentTask));
  amor.pendingTask = null;
  amor.annual.status = 'complete';
  amor.phase = taskContext === 'self_imposed'
    ? 'declaration'
    : accelerated
      ? (amor.completedTasks >= 3 ? 'essai' : 'wooing')
      : amor.reluctance === 0 && !amor.reluctanceInfinite ? 'essai' : 'wooing';
  const result = appendTransaction(state, {
    id: transactionId, type: 'amor_task_resolved', amorId: amor.id, task: clone(currentTask),
    success, critical, completedTasks: amor.completedTasks, reluctance: amor.reluctance,
    sourcePage: 'Ch.19 p.434', createdAt: iso(input.now)
  }).entry;
  return { character, amor, result, applied: true };
};

export const resolveEssai = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const amor = state.amor;
  if (!amor || amor.phase !== 'essai') throw new RangeError('Reluctance가 제거된 Amor만 Essai를 시도할 수 있습니다.');
  const chaste = resolveD20Roll(asInt(input.chasteRoll, rollDie(20, rng)), scoreFor(character, 'traits', 'chaste'));
  let lustful = null;
  if (chaste.success) {
    amor.phase = 'essai_passed';
    amor.ladyPassionType = 'love';
    amor.essaiYear = character.personal?.campaignYear || 767;
  } else {
    amor.reluctance = asInt(amor.reluctance) + 5;
    lustful = resolveD20Roll(asInt(input.lustfulRoll, rollDie(20, rng)), scoreFor(character, 'traits', 'lustful'));
    if (lustful.success) {
      recordHonorChange(character, {
        id: `${amor.id}:essai:honor`, amount: -3, title: 'Essai dishonor',
        sourceRuleId: 'MAGIC-AMOR-001', sourcePage: 'Ch.19 p.435'
      });
      delete character.passions[amor.passionKey];
      amor.phase = 'rejected';
      amor.status = 'rejected';
      amor.permanentlyRejected = true;
    } else amor.phase = 'wooing';
  }
  const transaction = appendTransaction(state, {
    id: input.transactionId || `${amor.id}:essai:${character.personal?.campaignYear || 767}`,
    type: 'amor_essai', amorId: amor.id, chaste, lustful, phase: amor.phase,
    sourcePage: 'Ch.19 pp.434-435', createdAt: iso(input.now)
  }).entry;
  return { character, amor, result: transaction };
};

export const consummateAmor = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const amor = state.amor;
  if (!amor || amor.phase !== 'essai_passed') throw new RangeError('Essai 성공 뒤 다음 Winter에만 Consummation을 처리합니다.');
  const year = character.personal?.campaignYear || 767;
  if (year <= asInt(amor.essaiYear)) throw new RangeError('Consummation은 Essai 다음 Winter Phase에 진행합니다.');
  const loveKey = `loveAmor:${safeId(amor.targetName)}`;
  const value = scoreFor(character, 'passions', amor.passionKey);
  delete character.passions[amor.passionKey];
  character.passions[loveKey] = value;
  amor.passionKey = loveKey;
  amor.value = value;
  amor.knightPassionType = 'love_amor';
  amor.phase = 'affair';
  amor.consummatedYear = year;
  const transaction = appendTransaction(state, {
    id: input.transactionId || `${amor.id}:consummation:${year}`, type: 'amor_consummated',
    amorId: amor.id, loveKey, value, sourcePage: 'Ch.19 p.435', createdAt: iso(now)
  }).entry;
  return { character, amor, result: transaction };
};

export const resolveAmorDiscovery = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const amor = state.amor;
  if (!amor || amor.phase !== 'affair') throw new RangeError('Consummation 이후의 Love [amor]가 필요합니다.');
  const rollD6 = asInt(input.discoveryDie, rollDie(6, rng));
  const observerValue = asInt(input.observerValue);
  const formula = rollD6 + observerValue + asInt(amor.affairYears) + 1;
  const discoveryFactor = input.discoveryFactorOverride !== undefined ? asInt(input.discoveryFactorOverride) : formula;
  if (input.discoveryFactorOverride !== undefined && !String(input.gmNote || '').trim()) throw new RangeError('Discovery Factor GM 조정 근거를 기록하세요.');
  const love = resolveD20Roll(asInt(input.loveRoll, rollDie(20, rng)), scoreFor(character, 'passions', amor.passionKey));
  const discovery = resolveD20Roll(asInt(input.discoveryRoll, rollDie(20, rng)), discoveryFactor);
  const opposed = resolveOpposedD20(love, discovery);
  const success = opposed.winner === 'actor';
  let exposure = null;
  if (success) {
    amor.affairYears = asInt(amor.affairYears) + 1;
    recordGloryAward(character, {
      id: `${amor.id}:discovery:${amor.affairYears}:glory`, amount: 50,
      title: 'Undiscovered Amor', narrative: `${amor.targetName}와의 관계가 발각되지 않았습니다.`,
      sourceRuleId: 'MAGIC-AMOR-001', sourcePage: 'Ch.19 p.435'
    });
  } else {
    const exposureRoll = asInt(input.exposureRoll, rollDie(20, rng));
    const row = CHAPTER_19_TABLES['19-30'].rows.find(item => exposureRoll >= item.min && exposureRoll <= item.max);
    exposure = { roll: exposureRoll, result: row?.result || '', sourcePage: 435 };
    amor.phase = 'exposed';
    amor.exposure = exposure;
  }
  const transaction = appendTransaction(state, {
    id: input.transactionId || `${amor.id}:discovery:${character.personal?.campaignYear || 767}`,
    type: 'amor_discovery', amorId: amor.id, formula, discoveryFactor, love, discovery, opposed,
    success, exposure, sourcePage: 'Ch.19 p.435', createdAt: iso(input.now)
  }).entry;
  amor.discoveryHistory.push(transaction.id);
  return { character, amor, result: transaction };
};

export const convertExternalAmorToHate = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const subject = String(input.subject || '').trim();
  const target = String(input.target || '').trim();
  if (!subject || !target) throw new RangeError('외부 Amor의 주체와 대상을 기록하세요.');
  const external = state.externalPassions.find(entry => entry.subject === subject && entry.target === target && entry.status === 'active');
  const value = external ? asInt(external.value) : asInt(input.value);
  if (value < 1) throw new RangeError('전환할 기존 Amor 수치를 기록하세요.');
  const transaction = appendTransaction(state, {
    id: input.transactionId || `external_amor_hate:${subject}:${target}:${iso(now)}`,
    type: 'external_amor_conversion', subject, target,
    before: 'Amor', after: 'Hate', value, reason: String(input.reason || ''),
    sourcePage: input.sourcePage || 'Ch.9 p.170; Ch.19 p.420', createdAt: iso(now)
  });
  if (!transaction.applied) return { character, result: transaction.entry, applied: false };
  if (external) {
    external.kind = 'hate';
    external.value = value;
    external.convertedAt = iso(now);
  } else state.externalPassions.push({
    id: `${transaction.entry.id}:external`, subject, target, kind: 'hate',
    value, status: 'active', sourcePage: transaction.entry.sourcePage, createdAt: iso(now)
  });
  const honor = recordHonorChange(character, {
    id: `${transaction.entry.id}:honor`, amount: -5, title: 'Betrayed a pagan lover', narrative: String(input.reason || 'Failed to baptize and marry the pagan lady'),
    sourceRuleId: 'MAGIC-PAGAN-LADY-001', sourcePage: 'Ch.9 p.170'
  });
  const loveGod = adjustPassion(character, 'loveGod', -5);
  transaction.entry.honor = honor;
  transaction.entry.loveGod = loveGod;
  return { character, result: transaction.entry, applied: true };
};

export const recordPersonalityGmDecision = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  if (!String(input.context || '').trim() || !String(input.decision || '').trim()) throw new RangeError('GM 판단의 맥락과 결정을 기록하세요.');
  const id = safeId(input.transactionId || `personality_gm:${iso(now)}`);
  const decision = {
    id, type: String(input.type || 'personality_gm_decision'), context: String(input.context),
    decision: String(input.decision), downstreamState: String(input.downstreamState || ''),
    sourcePage: String(input.sourcePage || 'Ch.3/9'), createdAt: iso(now)
  };
  const transaction = appendTransaction(state, decision);
  if (transaction.applied) state.gmDecisions.push(decision);
  return { character, decision: transaction.entry, applied: transaction.applied };
};

export const resolveGroupInspiration = (characterValue, input = {}) => {
  const character = clone(characterValue);
  const state = ensureState(character);
  const members = list(input.members);
  if (members.length < 3) throw new RangeError('Group Inspiration은 최소 세 기사에게 사용합니다.');
  const roll = asInt(input.roll);
  const checks = members.map(member => ({ id: String(member.id || member.name), name: String(member.name || ''), ...resolveD20Roll(roll, asInt(member.passionValue)) }));
  const rank = { fumble: -1, failure: 0, success: 1, critical: 2 };
  const average = checks.reduce((sum, check) => sum + rank[check.outcome], 0) / checks.length;
  const outcome = average >= 1.5 ? 'critical' : average >= 0.5 ? 'success' : average < 0 ? 'fumble' : 'failure';
  const transaction = appendTransaction(state, {
    id: input.transactionId || `group_inspiration:${character.personal?.campaignYear || 767}:${iso(input.now)}`,
    type: 'group_inspiration', passion: String(input.passion || ''), roll, checks, outcome,
    sourcePage: 'Ch.3 p.80', createdAt: iso(input.now)
  }).entry;
  return { character, result: transaction };
};

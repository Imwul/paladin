import { CHAPTER_19_ADVENTURE_BY_ID, CHAPTER_19_TABLES } from '../data/chapter19Data.js';
import { startMassBattle, startSiege, startSkirmish } from './battleRules.js';
import { resolveStandaloneBirthGift } from './characterCreationRules.js';
import { startChapter7Combat, concludeChapter7Combat } from './chapter7CombatRules.js';
import {
  completeChapter18Encounter,
  getChapter18Creature,
  getChapter18HuntCreatureId,
  resolveChapter18Avoidance,
  startChapter18Encounter
} from './chapter18Rules.js';
import { applyCharacterDamage } from './combatRules.js';
import { resolveD20Roll, resolveOpposedD20 } from './coreRules.js';
import { getEquippedMarketCombat, recordEconomyTransfer } from './economyRules.js';
import { appendChronicleEvent, recordGloryAward, recordHonorChange, recordStandingChange } from './ledgerRules.js';
import { resolveKnighthood } from './lifecycleRules.js';
import { adjustOpposedTrait } from './personalityRules.js';
import { sanitizePersonalityMagicState } from './personalityMagicRules.js';

const TABLE_SUBSYSTEM_REQUIREMENTS = Object.freeze({
  combat: Object.freeze({
    '19-1': ['Prudent'],
    '19-3': ['*'],
    '19-4': ['*'],
    '19-5': ['Saracen Archery', 'Lance Charge', 'Carloman Wounded', 'Player Unit Routs'],
    '19-14': ['*'],
    '19-15': ['Lone Knight'],
    '19-11': ['*'],
    '19-16': ['Bandits', 'Melancholic or Mad Paladin'],
    '19-17': ['Jousting Knight', 'Robber Knight'],
    '19-28': ['Joust All Strangers for a Month', 'Fight a Boar Unarmored', 'Kill Husband, Father, or Guardian'],
    '19-30': ['Fight to the Death'],
    '19-32': ['*'],
    '19-33': ['*']
  }),
  battle: Object.freeze({
    '19-15': ['Half Strength Group', 'Equal Force, Bad Terrain', 'Equal Force', 'Double Strength Group', 'Ambush'],
    '19-18': ['Save Pilgrims'],
    '19-19': ['Siege of Jerusalem', 'Large Battle']
  })
});

export const getAdventureTableSubsystemRequirement = (tableId, result) => {
  for (const [type, tableMap] of Object.entries(TABLE_SUBSYSTEM_REQUIREMENTS)) {
    const allowed = tableMap[tableId] || [];
    if (allowed.includes('*') || allowed.includes(result)) return type;
  }
  return null;
};

const clone = value => JSON.parse(JSON.stringify(value));
const iso = value => value ? new Date(value).toISOString() : new Date().toISOString();
const asInt = (value, fallback = 0) => Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : fallback;
const safeId = value => String(value || '').trim().replace(/[^a-zA-Z0-9:_-]+/g, '_');
const list = value => Array.isArray(value) ? value : [];

export const ADVENTURE_ENGINE_VERSION = 1;
export const ADVENTURE_SCHEMA_VERSION = 12;

export const createAdventureLedger = () => ({
  engineVersion: ADVENTURE_ENGINE_VERSION,
  active: null,
  history: []
});

const sanitizeParticipant = (value, index) => ({
  id: safeId(value?.id || `participant_${index + 1}`),
  name: String(value?.name || `참가자 ${index + 1}`),
  characterId: value?.characterId ? String(value.characterId) : null,
  role: String(value?.role || 'player_knight'),
  status: String(value?.status || 'active')
});

const sanitizeDecision = value => ({
  id: safeId(value?.id || 'decision'),
  stageId: String(value?.stageId || ''),
  kind: ['player', 'gm', 'narrative', 'dependency'].includes(value?.kind) ? value.kind : 'gm',
  value: String(value?.value || ''),
  note: String(value?.note || ''),
  sourcePage: asInt(value?.sourcePage),
  createdAt: typeof value?.createdAt === 'string' ? value.createdAt : iso()
});

export const sanitizeAdventureState = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const definition = CHAPTER_19_ADVENTURE_BY_ID[value.adventureId];
  if (!definition) return null;
  const stageIds = new Set(definition.stages.map(stage => stage.id));
  const stageIndex = Math.min(
    definition.stages.length - 1,
    Math.max(0, asInt(value.stageIndex, definition.stages.findIndex(stage => stage.id === value.currentStageId)))
  );
  return {
    engineVersion: ADVENTURE_ENGINE_VERSION,
    id: safeId(value.id || `adventure:${definition.id}`),
    adventureId: definition.id,
    adventureType: definition.type,
    title: definition.title,
    sourcePage: definition.sourcePage,
    campaignYear: Math.min(1200, Math.max(700, asInt(value.campaignYear, 767))),
    participants: list(value.participants).map(sanitizeParticipant).slice(0, 50),
    status: ['active', 'deferred', 'complete', 'aborted'].includes(value.status) ? value.status : 'active',
    stageIndex,
    currentStageId: stageIds.has(value.currentStageId) ? value.currentStageId : definition.stages[stageIndex].id,
    scene: String(value.scene || ''),
    pendingChoice: value.pendingChoice && typeof value.pendingChoice === 'object' ? clone(value.pendingChoice) : null,
    pendingTest: value.pendingTest && typeof value.pendingTest === 'object' ? clone(value.pendingTest) : null,
    pendingTable: value.pendingTable && typeof value.pendingTable === 'object' ? clone(value.pendingTable) : null,
    pendingSubsystem: value.pendingSubsystem && typeof value.pendingSubsystem === 'object' ? clone(value.pendingSubsystem) : null,
    pendingInterruption: value.pendingInterruption && typeof value.pendingInterruption === 'object' ? clone(value.pendingInterruption) : null,
    pendingConsequence: value.pendingConsequence && typeof value.pendingConsequence === 'object' ? clone(value.pendingConsequence) : null,
    pendingDependency: value.pendingDependency && typeof value.pendingDependency === 'object' ? clone(value.pendingDependency) : null,
    stageProgress: value.stageProgress && typeof value.stageProgress === 'object' && !Array.isArray(value.stageProgress) ? clone(value.stageProgress) : {},
    procedureProgress: value.procedureProgress && typeof value.procedureProgress === 'object' && !Array.isArray(value.procedureProgress) ? clone(value.procedureProgress) : {},
    results: list(value.results).filter(item => item && typeof item === 'object').slice(-1000),
    decisions: list(value.decisions).map(sanitizeDecision).slice(-500),
    rewards: list(value.rewards).filter(item => item && typeof item === 'object').slice(-500),
    penalties: list(value.penalties).filter(item => item && typeof item === 'object').slice(-500),
    chronicleEntryIds: list(value.chronicleEntryIds).filter(item => typeof item === 'string').slice(-100),
    appliedTransactionIds: list(value.appliedTransactionIds).filter(item => typeof item === 'string').slice(-2000),
    completedStageIds: list(value.completedStageIds).filter(id => stageIds.has(id)).slice(-500),
    deferred: value.deferred && typeof value.deferred === 'object' ? clone(value.deferred) : null,
    gmNote: String(value.gmNote || ''),
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : iso(),
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : iso(),
    completedAt: typeof value.completedAt === 'string' ? value.completedAt : null
  };
};

export const sanitizeAdventureLedger = value => {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return {
    engineVersion: ADVENTURE_ENGINE_VERSION,
    active: sanitizeAdventureState(source.active),
    history: list(source.history).map(sanitizeAdventureState).filter(Boolean).slice(-100)
  };
};

const ensureLedger = character => {
  character.campaign = character.campaign || {};
  character.campaign.adventures = sanitizeAdventureLedger(character.campaign.adventures);
  return character.campaign.adventures;
};

const requireActive = character => {
  const ledger = ensureLedger(character);
  const state = ledger.active;
  if (!state || state.status !== 'active') throw new RangeError('진행 중인 Chapter 19 모험이 필요합니다.');
  return state;
};

export const getAdventureDefinition = adventureId => CHAPTER_19_ADVENTURE_BY_ID[adventureId] || null;

export const getCurrentAdventureStage = state => {
  const definition = CHAPTER_19_ADVENTURE_BY_ID[state?.adventureId];
  return definition?.stages?.[state?.stageIndex] || null;
};

export const getAdventureRepeatStatus = state => {
  const stage = getCurrentAdventureStage(state);
  if (!stage?.repeat) return null;
  const progress = state.stageProgress?.[stage.id] || { history: [] };
  const completed = stage.kind === 'table' ? list(progress.history).length
    : stage.kind === 'test' ? state.results.filter(item => item.type === 'test' && item.stageId === stage.id).length
      : progress.history.length;
  return {
    mode: stage.repeat.mode,
    completed,
    target: repeatTarget(state, stage),
    minimum: Math.max(1, asInt(stage.repeat.minimum, 1)),
    allowStop: Boolean(stage.repeat.allowStop || stage.repeat.mode === 'manual'),
    label: stage.repeat.label || '',
    sourceAmbiguity: stage.sourceAmbiguity || ''
  };
};

const transactionApplied = (state, transactionId) => state.appliedTransactionIds.includes(transactionId);

const applyTransaction = (state, transactionId) => {
  if (transactionApplied(state, transactionId)) return false;
  state.appliedTransactionIds = [...state.appliedTransactionIds, transactionId].slice(-2000);
  return true;
};

const continuationBlock = character => {
  if (character.campaign?.health?.pendingDeath) {
    return { type: 'pending_death', reason: '생명력이 0 이하이므로 자정 사망 또는 회복 절차를 먼저 해결해야 합니다.' };
  }
  const captivity = character.campaign?.captivity;
  if (['active', 'awaiting_ransom'].includes(captivity?.status)) {
    return { type: 'captivity', reason: '포로 상태와 몸값 정산을 먼저 해결해야 합니다.' };
  }
  const lifecycle = character.campaign?.lifecycle || {};
  const status = lifecycle.status || lifecycle.careerStatus || 'active';
  if (!['active', 'incapacitated', 'bedridden'].includes(status)) {
    return { type: 'lifecycle', reason: '사망·은퇴·계승 상태를 먼저 해결하고 모험 참가자를 다시 확정해야 합니다.' };
  }
  return null;
};

const pauseForContinuation = (character, state, pending, transactionId, now) => {
  const block = continuationBlock(character);
  if (!block) return false;
  state.pendingInterruption = {
    id: safeId(`${transactionId}:interruption`),
    ...block,
    status: 'pending',
    stageId: pending.stageId,
    sourcePage: pending.sourcePage,
    returnTransactionId: transactionId,
    advanceOnReturn: Boolean(pending.advanceOnReturn),
    parentHunt: Boolean(pending.parentHunt),
    activeCharacterIdBefore: character.campaign?.lifecycle?.activeCharacterId || null,
    createdAt: iso(now)
  };
  state.updatedAt = iso(now);
  return true;
};

const PERSONALITY_MAGIC_RESULTS = Object.freeze({
  jewel_relic_prayer: ['prayer_resolved'],
  jewel_dream: ['dream_resolved'],
  humble_blessing: ['prayer_resolved'],
  humble_passion_conflict: ['personality_conflict'],
  humble_dream: ['dream_resolved'],
  adulterous_spouse_prayer: ['prayer_resolved'],
  angry_merchant_melancholy: ['external_melancholy_recovery'],
  devils_bridge_prayer: ['prayer_resolved'],
  devils_bridge_dream: ['dream_resolved'],
  noble_hostage_miracle: ['miracle_decision'],
  pagan_prison_amor: ['pagan_lady_amor', 'personality_gm_decision'],
  wrathful_lord_shock: ['scenario_passion_shock'],
  wrathful_lord_conflict: ['personality_conflict'],
  royal_court_amor: ['amor_started'],
  love_conquers_all: ['amor_started', 'amor_task_resolved', 'amor_essai'],
  melancholic_paladin: ['external_melancholy_recovery'],
  miracle_truth: ['miracle_decision'],
  pagan_lady: ['external_amor_conversion', 'amor_task_resolved'],
  wild_hunt: ['madness_year', 'prayer_resolved'],
  romance_start: ['amor_started', 'amor_potential_set', 'amor_resumed'],
  romance_progression: ['amor_task_resolved', 'amor_resumed'],
  romance_essai: ['amor_essai', 'amor_resumed'],
  romance_consummation: ['amor_consummated', 'amor_resumed'],
  romance_discovery: ['amor_discovery', 'amor_resumed']
});

const appendAdventureResult = (state, result) => {
  if (state.results.some(item => item.id === result.id)) return state.results.find(item => item.id === result.id);
  state.results = [...state.results, result].slice(-1000);
  return result;
};

const getStageProgress = (state, stage) => {
  const current = state.stageProgress?.[stage.id];
  const history = list(current?.history).filter(item => item && typeof item === 'object');
  const progress = {
    iteration: Math.max(1, asInt(current?.iteration, history.length + 1)),
    history,
    stopped: Boolean(current?.stopped),
    stoppedAt: current?.stoppedAt || null
  };
  state.stageProgress = { ...(state.stageProgress || {}), [stage.id]: progress };
  return progress;
};

const getDecisionValue = (state, stageId) => [...state.decisions].reverse().find(item => item.stageId === stageId)?.value || '';

const getStageTableResults = (state, stageId) => state.results.filter(item => item.type === 'table' && item.stageId === stageId && !item.followUp);

const repeatTarget = (state, stage) => {
  const repeat = stage.repeat;
  if (!repeat) return 1;
  if (repeat.mode === 'count') return Math.max(1, asInt(repeat.count, 1));
  if (repeat.mode === 'participants') return Math.max(1, state.participants.length);
  if (repeat.mode === 'result_target') {
    const source = [...getStageTableResults(state, repeat.sourceStageId)].reverse()[0];
    const choice = getDecisionValue(state, 'setup');
    const field = repeat.choiceFields?.[choice] || repeat.resultField;
    return Math.max(1, asInt(source?.[field], 1));
  }
  return null;
};

const repeatComplete = (state, stage, stopRequested = false) => {
  if (!stage.repeat) return true;
  const progress = getStageProgress(state, stage);
  const rootResults = getStageTableResults(state, stage.id);
  const completedCount = stage.kind === 'table' ? progress.history.length
    : stage.kind === 'test' ? state.results.filter(item => item.type === 'test' && item.stageId === stage.id).length
      : progress.history.length;
  const minimum = Math.max(1, asInt(stage.repeat.minimum, 1));
  if (stage.repeat.mode === 'until_result') {
    return rootResults.some(item => list(stage.repeat.results).includes(item.result));
  }
  if (stage.repeat.mode === 'manual') return stopRequested && completedCount >= minimum;
  const target = repeatTarget(state, stage);
  if (stage.repeat.allowStop && stopRequested && completedCount >= minimum) return true;
  return completedCount >= target;
};

const resetRepeatedStage = (state, stage, now) => {
  const progress = getStageProgress(state, stage);
  progress.iteration = stage.kind === 'test'
    ? state.results.filter(item => item.type === 'test' && item.stageId === stage.id).length + 1
    : progress.history.length + 1;
  state.pendingChoice = null;
  state.pendingTest = null;
  state.pendingTable = null;
  state.pendingInterruption = null;
  state.pendingConsequence = null;
  state.pendingDependency = null;
  state.scene = '';
  prepareStage(state);
  state.updatedAt = iso(now);
  return stage;
};

const prepareStage = state => {
  const stage = getCurrentAdventureStage(state);
  const progress = stage ? getStageProgress(state, stage) : null;
  state.currentStageId = stage?.id || state.currentStageId;
  state.pendingChoice = stage?.kind === 'player_choice' ? {
    stageId: stage.id,
    options: list(stage.options),
    sourcePage: stage.sourcePage
  } : null;
  state.pendingTest = stage?.kind === 'test' ? {
    stageId: stage.id,
    allowedTests: list(stage.tests),
    resolvedTests: [],
    sourcePage: stage.sourcePage
  } : null;
  state.pendingTable = stage?.kind === 'table' ? {
    stageId: stage.id,
    tableId: stage.tableId,
    subtable: null,
    rootTableId: stage.tableId,
    iteration: progress?.iteration || 1,
    sourcePage: stage.sourcePage,
    resolved: null,
    rootResult: null,
    followUpResults: []
  } : null;
  state.pendingDependency = stage?.kind === 'dependency' ? {
    stageId: stage.id,
    dependency: stage.dependency,
    sourcePage: stage.sourcePage,
    status: 'pending'
  } : null;
  state.updatedAt = iso();
  return stage;
};

const stageIsAvailable = (state, stage) => {
  if (!stage?.when) return true;
  return state.decisions.some(decision => decision.stageId === stage.when.stageId && decision.value === stage.when.value);
};

const archiveCompleted = (character, state) => {
  const ledger = ensureLedger(character);
  ledger.history = [...ledger.history.filter(item => item.id !== state.id), clone(state)].slice(-100);
  ledger.active = null;
};

const finishAdventure = (character, state, now) => {
  const timestamp = iso(now);
  state.status = 'complete';
  state.completedAt = timestamp;
  state.updatedAt = timestamp;
  const chronicleId = `${state.id}:complete`;
  appendChronicleEvent(character, {
    id: chronicleId,
    year: state.campaignYear,
    type: 'adventure_complete',
    title: `${state.title} 완료`,
    narrative: '모험의 결말과 후속 처리를 확정했습니다.',
    sourceRuleId: 'ADVENTURE-CH19',
    sourcePage: state.sourcePage,
    transactionId: chronicleId,
    createdAt: timestamp
  });
  state.chronicleEntryIds = [...new Set([...state.chronicleEntryIds, chronicleId])];
  archiveCompleted(character, state);
};

const advance = (character, state, now, options = {}) => {
  const stage = getCurrentAdventureStage(state);
  if (stage?.repeat && !options.force && !repeatComplete(state, stage, Boolean(options.stopRepeat))) {
    return resetRepeatedStage(state, stage, now);
  }
  if (stage && !state.completedStageIds.includes(stage.id)) state.completedStageIds.push(stage.id);
  state.pendingChoice = null;
  state.pendingTest = null;
  state.pendingTable = null;
  state.pendingConsequence = null;
  state.pendingDependency = null;
  state.scene = '';
  const definition = CHAPTER_19_ADVENTURE_BY_ID[state.adventureId];
  if (state.stageIndex >= definition.stages.length - 1) {
    finishAdventure(character, state, now);
    return null;
  }
  state.stageIndex += 1;
  while (state.stageIndex < definition.stages.length && !stageIsAvailable(state, definition.stages[state.stageIndex])) {
    const skipped = definition.stages[state.stageIndex];
    if (!state.completedStageIds.includes(skipped.id)) state.completedStageIds.push(skipped.id);
    appendAdventureResult(state, {
      id: safeId(`${state.id}:${skipped.id}:branch_not_selected`), type: 'stage_skipped', stageId: skipped.id,
      reason: '선택하지 않은 원문 분기', sourcePage: skipped.sourcePage, createdAt: iso(now)
    });
    state.stageIndex += 1;
  }
  if (state.stageIndex >= definition.stages.length) {
    finishAdventure(character, state, now);
    return null;
  }
  prepareStage(state);
  return getCurrentAdventureStage(state);
};

export const startAdventure = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const ledger = ensureLedger(character);
  if (ledger.active && ['active', 'deferred'].includes(ledger.active.status)) throw new RangeError('먼저 진행 중이거나 보류된 모험을 완료해야 합니다.');
  const definition = CHAPTER_19_ADVENTURE_BY_ID[input.adventureId];
  if (!definition) throw new RangeError('Chapter 19 원문 목록에서 모험을 선택하세요.');
  const lifecycle = character.campaign?.lifecycle?.status || character.campaign?.lifecycle?.careerStatus;
  if (['deceased', 'retired', 'historical', 'pending_successor'].includes(lifecycle)) throw new RangeError('현재 활성 기사가 모험에 참가할 수 없습니다.');
  const timestamp = iso(now);
  const activeIdentity = character.campaign?.lifecycle?.activeCharacterId || null;
  const defaultParticipants = [{ id: activeIdentity || 'active_character', characterId: activeIdentity, name: character.personal?.name || '이름 없는 기사', role: 'player_knight' }];
  const state = sanitizeAdventureState({
    id: input.id || `adventure:${definition.id}:${character.personal?.campaignYear || 767}:${timestamp}`,
    adventureId: definition.id,
    campaignYear: character.personal?.campaignYear || 767,
    participants: list(input.participants).length ? input.participants : defaultParticipants,
    status: 'active', stageIndex: 0, currentStageId: definition.stages[0].id,
    results: [], decisions: [], rewards: [], penalties: [], chronicleEntryIds: [],
    appliedTransactionIds: [], completedStageIds: [], gmNote: input.gmNote, createdAt: timestamp, updatedAt: timestamp
  });
  prepareStage(state);
  ledger.active = state;
  const chronicleId = `${state.id}:start`;
  appendChronicleEvent(character, {
    id: chronicleId, year: state.campaignYear, type: 'adventure_start', title: `${state.title} 시작`,
    narrative: `${state.participants.map(item => item.name).join(', ')}이(가) 모험을 시작했습니다.`,
    sourceRuleId: 'ADVENTURE-CH19', sourcePage: state.sourcePage, transactionId: chronicleId, createdAt: timestamp
  });
  state.chronicleEntryIds.push(chronicleId);
  character.campaign.schemaVersion = ADVENTURE_SCHEMA_VERSION;
  return { character, adventure: state, stage: getCurrentAdventureStage(state) };
};

const scoreSource = (character, key) => {
  for (const group of ['attributes', 'skills', 'traits', 'passions', 'standings']) {
    if (Number.isFinite(Number(character[group]?.[key]))) return { group, value: asInt(character[group][key]) };
  }
  return null;
};

export const resolveAdventureTest = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const stage = getCurrentAdventureStage(state);
  if (!['test', 'procedure'].includes(stage?.kind)) throw new RangeError('현재 단계는 판정 단계가 아닙니다.');
  const testKey = String(input.testKey || stage.tests?.[0] || '');
  if (stage.tests?.length && !stage.tests.includes(testKey)) throw new RangeError('원문이 현재 단계에 허용한 판정이 아닙니다.');
  const source = scoreSource(character, testKey);
  if (!source && input.target === undefined) throw new RangeError('판정 대상 수치를 찾을 수 없습니다.');
  const progress = getStageProgress(state, stage);
  if (stage.repeat?.unique && state.results.some(item => item.type === 'test' && item.stageId === stage.id && item.testKey === testKey)) {
    throw new RangeError('원문이 서로 다른 판정을 요구하므로 이미 사용한 판정은 다시 선택할 수 없습니다.');
  }
  const transactionId = safeId(input.transactionId || `${state.id}:${stage.id}:test:${progress.iteration}:${testKey}`);
  const existing = state.results.find(item => item.id === transactionId);
  if (existing) return { character, adventure: state, result: existing, applied: false };
  const roll = Math.min(20, Math.max(1, asInt(input.roll, Math.floor(rng() * 20) + 1)));
  const modifier = asInt(input.modifier);
  const check = resolveD20Roll(roll, asInt(input.target, source?.value) + modifier);
  const result = appendAdventureResult(state, {
    id: transactionId, type: 'test', stageId: stage.id, testKey, scoreGroup: source?.group || 'gm',
    roll: check.roll, target: check.target, modifier, outcome: check.outcome, sourcePage: stage.sourcePage, createdAt: iso(input.now)
  });
  if (check.success && source?.group === 'skills') character.skillsChecked = { ...(character.skillsChecked || {}), [testKey]: true };
  if (check.success && source?.group === 'traits') character.traitsChecked = { ...(character.traitsChecked || {}), [testKey]: true };
  if (check.success && source?.group === 'passions') character.passionsChecked = { ...(character.passionsChecked || {}), [testKey]: true };
  if (check.success && source?.group === 'standings') character.standingsChecked = { ...(character.standingsChecked || {}), [testKey]: true };
  applyTransaction(state, transactionId);
  const resolvedTests = [...new Set(state.results
    .filter(item => item.type === 'test' && item.stageId === stage.id)
    .map(item => item.testKey))];
  const stageResolved = stage.testMode === 'all'
    ? stage.tests.every(key => resolvedTests.includes(key))
    : resolvedTests.length > 0;
  state.pendingTest = {
    ...state.pendingTest,
    resolvedTests,
    lastResolved: result,
    resolved: stageResolved ? result : null
  };
  state.updatedAt = iso(input.now);
  return { character, adventure: state, result, applied: true };
};

const tableRows = (table, subtable) => list(subtable ? table.subtables?.[subtable] : table.rows);

const tableMatches = (table, roll, subtable) => (
  tableRows(table, subtable).map((item, rowIndex) => ({ item, rowIndex })).filter(({ item }) => roll >= item.min && roll <= item.max)
);

const tableRow = (table, roll, subtable, rowIndex) => {
  const rows = subtable ? table.subtables?.[subtable] : table.rows;
  if (rowIndex !== undefined) {
    const selected = list(rows)[asInt(rowIndex, -1)];
    return selected && roll >= selected.min && roll <= selected.max ? selected : null;
  }
  return list(rows).find(item => roll >= item.min && roll <= item.max) || null;
};

export const lookupChapter19Table = (tableId, roll, options = {}) => {
  const table = CHAPTER_19_TABLES[tableId];
  if (!table) throw new RangeError('Chapter 19 표를 찾을 수 없습니다.');
  const value = asInt(roll);
  const matches = tableMatches(table, value, options.subtable);
  if (matches.length > 1 && options.rowIndex === undefined) {
    const error = new RangeError(`${tableId}의 ${value} 결과는 원문 범위가 겹칩니다. 원문 행을 GM이 확정해야 합니다.`);
    error.code = 'AMBIGUOUS_TABLE_RESULT';
    error.matches = matches.map(({ item, rowIndex }) => ({ ...clone(item), rowIndex }));
    throw error;
  }
  const found = tableRow(table, value, options.subtable, options.rowIndex);
  if (!found) throw new RangeError(`${tableId}의 원문 범위에 해당하는 결과가 없습니다.`);
  const selectedIndex = tableRows(table, options.subtable).indexOf(found);
  const { subtable: nextSubtable = null, ...rowData } = clone(found);
  return {
    tableId, title: table.title, sourcePage: table.sourcePage, roll: value, rowIndex: selectedIndex,
    subtable: options.subtable || null, nextSubtable, ...rowData
  };
};

export const resolveAdventureTable = (characterValue, input = {}) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const stage = getCurrentAdventureStage(state);
  if (stage?.kind !== 'table') throw new RangeError('현재 단계는 표 판정 단계가 아닙니다.');
  const pendingTable = state.pendingTable;
  const tableId = String(input.tableId || pendingTable?.tableId || stage.tableId);
  const subtable = input.subtable || pendingTable?.subtable || null;
  if (tableId !== pendingTable?.tableId) throw new RangeError('현재 원문 절차가 호출하는 표가 아닙니다.');
  if (subtable !== (pendingTable?.subtable || null)) throw new RangeError('현재 원문 절차가 호출하는 하위 표가 아닙니다.');
  const progress = getStageProgress(state, stage);
  if (stage.repeat?.sequence && tableId === stage.tableId && asInt(input.roll) !== progress.iteration) {
    throw new RangeError(`원문 고정 순서에 따라 ${progress.iteration}라운드 결과를 처리하세요.`);
  }
  const transactionId = safeId(input.transactionId || `${state.id}:${stage.id}:table:${progress.iteration}:${tableId}:${subtable || 'root'}`);
  const existing = state.results.find(item => item.id === transactionId);
  if (existing) return { character, adventure: state, result: existing, applied: false };
  const followUp = Boolean(pendingTable.rootResult) || tableId !== stage.tableId || Boolean(subtable);
  const result = {
    id: transactionId, type: 'table', stageId: stage.id, iteration: progress.iteration, followUp,
    ...lookupChapter19Table(tableId, input.roll, { ...input, subtable }), createdAt: iso(input.now)
  };
  if (stage.repeat?.unique && !followUp && getStageTableResults(state, stage.id).some(item => item.result === result.result)) {
    throw new RangeError('원문이 중복 결과를 무시하라고 명시하므로 다시 판정하세요.');
  }
  appendAdventureResult(state, result);
  applyTransaction(state, transactionId);
  const followUpRule = !followUp ? list(stage.followUps).find(rule => list(rule.results).includes(result.result)) : null;
  const nextTable = result.nextSubtable
    ? { tableId, subtable: result.nextSubtable }
    : followUpRule
      ? { tableId: followUpRule.tableId, subtable: followUpRule.subtable || null }
      : null;
  if (nextTable) {
    const rootResult = pendingTable.rootResult || result;
    const followUpResults = followUp ? [...list(pendingTable.followUpResults), result] : [];
    state.pendingTable = {
      ...pendingTable,
      tableId: nextTable.tableId,
      subtable: nextTable.subtable,
      sourcePage: CHAPTER_19_TABLES[nextTable.tableId]?.sourcePage || stage.sourcePage,
      resolved: null,
      rootResult,
      followUpResults
    };
    state.pendingConsequence = null;
    state.updatedAt = iso(input.now);
    return {
      character, adventure: state, result, applied: true,
      followUpTableId: nextTable.tableId, followUpSubtable: nextTable.subtable
    };
  }
  const rootResult = pendingTable.rootResult || result;
  const followUpResults = followUp ? [...list(pendingTable.followUpResults), result] : [];
  progress.history.push({ iteration: progress.iteration, rootResult: clone(rootResult), followUpResults: clone(followUpResults), completedAt: iso(input.now) });
  state.pendingTable = { ...pendingTable, tableId, resolved: result, rootResult, followUpResults };
  state.pendingConsequence = (result.effect || list(result.actions).length) ? {
    id: `${transactionId}:consequence`, stageId: stage.id, sourcePage: result.sourcePage,
    description: result.effect || '원문이 고정한 후속 결과를 canonical 상태에 반영합니다.',
    presets: clone(list(result.actions)), status: 'pending', appliedActions: []
  } : null;
  state.updatedAt = iso(input.now);
  return { character, adventure: state, result, applied: true };
};

export const recordAdventureDecision = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const stage = getCurrentAdventureStage(state);
  const kind = input.kind || (stage.kind === 'player_choice' ? 'player' : stage.kind === 'dependency' ? 'dependency' : stage.kind === 'narrative' ? 'narrative' : 'gm');
  if (kind === 'player' && stage.options?.length && !stage.options.includes(input.value)) throw new RangeError('원문 단계에 허용된 선택지가 아닙니다.');
  const id = safeId(input.transactionId || `${state.id}:${stage.id}:decision`);
  const existing = state.decisions.find(item => item.id === id);
  if (existing) return { character, adventure: state, decision: existing, applied: false };
  const decision = sanitizeDecision({ id, stageId: stage.id, kind, value: input.value, note: input.note, sourcePage: stage.sourcePage, createdAt: iso(now) });
  state.decisions.push(decision);
  applyTransaction(state, id);
  if (kind === 'dependency') state.pendingDependency = { ...state.pendingDependency, status: 'recorded', decisionId: id, note: decision.note };
  if (kind === 'player') state.pendingChoice = { ...state.pendingChoice, resolved: decision };
  state.scene = decision.note;
  state.updatedAt = iso(now);
  return { character, adventure: state, decision, applied: true };
};

const applyScoreChange = (character, input) => {
  const group = String(input.group || '');
  const key = String(input.key || '');
  if (!['attributes', 'skills', 'traits', 'passions'].includes(group) || !Number.isFinite(Number(character[group]?.[key]))) {
    throw new RangeError('원문 결과를 적용할 기존 캐릭터 수치를 선택하세요.');
  }
  const before = asInt(character[group][key]);
  character[group][key] = Math.max(0, before + asInt(input.amount));
  return { group, key, before, after: character[group][key], amount: asInt(input.amount) };
};

export const applyAdventureConsequence = (characterValue, input = {}, now) => {
  let character = clone(characterValue);
  let state = requireActive(character);
  const stage = getCurrentAdventureStage(state);
  const consequenceKey = input.key || input.reason || input.type || 'result';
  const transactionId = safeId(input.transactionId || `${state.id}:${stage.id}:consequence:${input.type}:${consequenceKey}`);
  if (!applyTransaction(state, transactionId)) {
    return { character, adventure: state, result: state.results.find(item => item.id === transactionId), applied: false };
  }
  const base = { id: transactionId, stageId: stage.id, type: String(input.type), sourcePage: stage.sourcePage, reason: String(input.reason || stage.title), createdAt: iso(now) };
  let result;
  if (input.type === 'glory') {
    const amount = asInt(input.amount);
    recordGloryAward(character, { ...base, year: state.campaignYear, amount, title: base.reason, narrative: String(input.note || ''), sourceAdventure: state.adventureId, transactionId });
    result = { ...base, amount };
    state.rewards.push(result);
  } else if (input.type === 'standing') {
    const amount = asInt(input.amount);
    const standing = recordStandingChange(character, { ...base, year: state.campaignYear, standingKey: input.key, amount, title: base.reason, narrative: String(input.note || ''), sourceAdventure: state.adventureId, transactionId });
    result = { ...base, standingKey: input.key, amount, before: standing.before, after: standing.after };
    (amount >= 0 ? state.rewards : state.penalties).push(result);
  } else if (input.type === 'honor') {
    const honor = recordHonorChange(character, {
      ...base, year: state.campaignYear, amount: asInt(input.amount), title: base.reason,
      narrative: String(input.note || ''), sourceAdventure: state.adventureId, transactionId
    });
    result = { ...base, amount: honor.amount, before: honor.before, after: honor.after };
    (asInt(input.amount) >= 0 ? state.rewards : state.penalties).push(result);
  } else if (input.type === 'score') {
    result = { ...base, ...applyScoreChange(character, input) };
    (asInt(input.amount) >= 0 ? state.rewards : state.penalties).push(result);
  } else if (input.type === 'economy') {
    const transfer = recordEconomyTransfer(character, {
      id: transactionId, transactionId, type: input.economyType || 'adventure', amountDeniers: asInt(input.amountDeniers),
      label: base.reason, note: input.note, sourceRuleId: 'ADVENTURE-CH19', sourcePage: `Ch.19 p.${stage.sourcePage}`, sourceId: state.id, year: state.campaignYear, createdAt: iso(now)
    });
    character = transfer.character;
    state = requireActive(character);
    result = { ...base, amountDeniers: asInt(input.amountDeniers), economyTransactionId: transfer.transaction?.id };
    state.rewards.push(result);
  } else if (input.type === 'damage') {
    const applied = applyCharacterDamage(character, {
      rolledDamage: Math.max(0, asInt(input.damage)), armor: Math.max(0, asInt(input.armor)), shield: Math.max(0, asInt(input.shield)),
      shieldApplies: Boolean(input.shieldApplies), source: base.reason, sourceRuleId: 'ADVENTURE-CH19', sourcePage: `Ch.19 p.${stage.sourcePage}`, now
    });
    character = applied.character;
    state = requireActive(character);
    result = { ...base, injury: applied.injury };
    state.penalties.push(result);
  } else if (input.type === 'check') {
    const group = String(input.group || 'skills');
    const mapKey = `${group}Checked`;
    if (!['skills', 'traits', 'passions', 'standings'].includes(group)) throw new RangeError('체크할 기존 규칙 그룹을 선택하세요.');
    character[mapKey] = { ...(character[mapKey] || {}), [input.key]: true };
    result = { ...base, group, key: String(input.key) };
  } else throw new RangeError('지원하지 않는 Chapter 19 결과 유형입니다.');
  appendAdventureResult(state, { ...result, id: transactionId });
  if (state.pendingConsequence) {
    state.pendingConsequence.appliedActions = [...new Set([...list(state.pendingConsequence.appliedActions), transactionId])];
  }
  state.updatedAt = iso(now);
  character.campaign.schemaVersion = ADVENTURE_SCHEMA_VERSION;
  return { character, adventure: state, result, applied: true };
};

export const recordAdventureNoMechanicalEffect = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const stage = getCurrentAdventureStage(state);
  if (!['consequence', 'aftermath', 'procedure'].includes(stage.kind)) throw new RangeError('현재 단계에는 별도 무효과 확인이 필요하지 않습니다.');
  if (!String(input.reason || '').trim()) throw new RangeError('원문 조건상 적용할 기계적 결과가 없는 이유를 기록하세요.');
  const transactionId = safeId(input.transactionId || `${state.id}:${stage.id}:no_mechanical_effect`);
  if (!applyTransaction(state, transactionId)) return { character, adventure: state, applied: false };
  const result = { id: transactionId, stageId: stage.id, type: 'no_mechanical_effect', sourcePage: stage.sourcePage, reason: String(input.reason).trim(), createdAt: iso(now) };
  appendAdventureResult(state, result);
  return { character, adventure: state, result, applied: true };
};

export const acknowledgeAdventureConsequence = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  if (!state.pendingConsequence) throw new RangeError('확인할 표 결과가 없습니다.');
  const missingRequired = list(state.pendingConsequence.presets)
    .filter(item => item.required)
    .filter(item => !state.pendingConsequence.appliedActions.includes(safeId(`${state.pendingConsequence.id}:${item.id}`)));
  if (missingRequired.length) throw new RangeError('원문이 고정한 후속 결과를 모두 canonical 상태에 반영하세요.');
  state.pendingConsequence = { ...state.pendingConsequence, status: 'acknowledged', note: String(input.note || ''), acknowledgedAt: iso(now) };
  if (state.pendingSubsystem?.type === 'hunt' && state.pendingSubsystem.awaitingConsequence) {
    state.pendingSubsystem.awaitingConsequence = false;
    if (!state.pendingSubsystem.obstacle) finalizeHuntSegment(state.pendingSubsystem);
  }
  return { character, adventure: state };
};

const huntState = state => {
  const hunt = state.pendingSubsystem;
  if (!hunt || hunt.type !== 'hunt') throw new RangeError('현재 모험에 진행 중인 Hunt 절차가 없습니다.');
  return hunt;
};

const activeHuntHunters = hunt => hunt.hunters.filter(hunter => hunter.mode !== 'follower' && !['out', 'discovered'].includes(hunter.status));

const finalizeHuntSegment = hunt => {
  if (hunt.awaitingConsequence || hunt.phase !== 'segments') return false;
  const acting = activeHuntHunters(hunt);
  if (acting.length && acting.some(hunter => !hunt.segmentActions[hunter.id])) return false;
  if (hunt.hunters.some(hunter => hunter.status === 'discovered')) {
    hunt.phase = 'discovery';
    return true;
  }
  hunt.segmentsRemaining = Math.max(0, hunt.segmentsRemaining - 1);
  hunt.currentSegment += 1;
  hunt.segmentActions = {};
  if (hunt.segmentsRemaining === 0 || !activeHuntHunters(hunt).length) hunt.phase = 'expired';
  return true;
};

const defaultHuntSegments = season => season === 'winter' ? 6 : season === 'summer' ? 10 : 8;

export const beginAdventureHunt = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const stage = getCurrentAdventureStage(state);
  if (stage?.kind !== 'subsystem' || stage.subsystem !== 'hunt') throw new RangeError('현재 장면은 Hunt 절차가 아닙니다.');
  if (state.pendingSubsystem) throw new RangeError('이미 연결된 하위 절차가 진행 중입니다.');
  const fixed = stage.hunt || {};
  const suppliedHunters = list(input.hunters);
  const equippedMount = getEquippedMarketCombat(character).mount;
  const equippedMountSource = getChapter18Creature(equippedMount?.id);
  const hunters = state.participants.map((participant, index) => {
    const supplied = suppliedHunters.find(item => item.participantId === participant.id) || suppliedHunters[index] || {};
    const isActiveCharacter = participant.characterId && participant.characterId === character.campaign?.lifecycle?.activeCharacterId;
    const hunting = asInt(supplied.hunting, isActiveCharacter ? character.skills?.hunting : 0);
    const huntTrainedMount = supplied.huntTrainedMount !== undefined
      ? Boolean(supplied.huntTrainedMount)
      : Boolean(isActiveCharacter && equippedMountSource?.training?.includes('hunt'));
    return {
      id: participant.id, name: participant.name, mode: supplied.mode === 'follower' ? 'follower' : 'hunter',
      follows: supplied.follows ? String(supplied.follows) : null, hunting, huntTrainedMount,
      huntingModifier: huntTrainedMount ? 5 : 0, marker: 3, status: supplied.mode === 'follower' ? 'following' : 'search'
    };
  });
  if (!hunters.some(hunter => hunter.mode === 'hunter')) throw new RangeError('최소 한 명은 직접 Hunting 판정을 해야 합니다.');
  const segments = Math.max(1, asInt(fixed.segments, asInt(input.segments, defaultHuntSegments(input.season))));
  const transactionId = safeId(`${state.id}:${stage.id}:hunt`);
  state.pendingSubsystem = {
    type: 'hunt', subsystemId: transactionId, transactionId, stageId: stage.id, sourcePage: stage.sourcePage,
    status: 'active', phase: 'segments', season: String(input.season || 'spring_autumn'),
    segmentMinutes: Math.max(1, asInt(fixed.segmentMinutes, asInt(input.segmentMinutes, 60))),
    segmentsTotal: segments, segmentsRemaining: segments, currentSegment: 1,
    terrainModifier: asInt(fixed.modifier, asInt(input.terrainModifier)), temporaryModifier: 0,
    preyAvoidance: asInt(fixed.prey?.avoidance, asInt(input.preyAvoidance)),
    prey: fixed.prey ? clone(fixed.prey) : null, fixedPrey: Boolean(fixed.prey),
    hunters, segmentActions: {}, obstacle: null, awaitingConsequence: false,
    results: [], outcome: null, createdAt: iso(now), updatedAt: iso(now)
  };
  state.updatedAt = iso(now);
  return { character, adventure: state, hunt: state.pendingSubsystem };
};

const huntResultId = (hunt, hunterId, suffix) => safeId(`${hunt.transactionId}:segment_${hunt.currentSegment}:${hunterId}:${suffix}`);

export const resolveAdventureHuntAction = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const hunt = huntState(state);
  if (hunt.phase !== 'segments' || hunt.obstacle) throw new RangeError('현재 Hunt 단계에서 Search 또는 Chase를 판정할 수 없습니다.');
  const hunter = hunt.hunters.find(item => item.id === input.hunterId);
  if (!hunter || hunter.mode === 'follower') throw new RangeError('직접 판정할 Hunt 참가자를 선택하세요.');
  if (hunt.segmentActions[hunter.id]) throw new RangeError('이 참가자는 현재 segment의 행동을 이미 확정했습니다.');
  const roll = Math.min(20, Math.max(1, asInt(input.roll, Math.floor(rng() * 20) + 1)));
  const id = huntResultId(hunt, hunter.id, hunter.status);
  let result;
  if (hunter.status === 'search') {
      const check = resolveD20Roll(roll, asInt(input.hunting, hunter.hunting) + asInt(hunter.huntingModifier));
    hunter.status = check.success ? 'chase' : 'search';
    if (!check.success) hunter.marker = Math.max(0, hunter.marker - 1);
    result = { id, type: 'hunt_search', hunterId: hunter.id, check, marker: hunter.marker, sourcePage: 424 };
  } else if (hunter.status === 'chase') {
    const avoidance = asInt(input.preyAvoidance, hunt.preyAvoidance);
    if (avoidance <= 0) throw new RangeError('GM이 원문 먹잇감의 Avoidance를 입력해야 Chase를 판정할 수 있습니다.');
    const preyRoll = Math.min(20, Math.max(1, asInt(input.preyRoll, Math.floor(rng() * 20) + 1)));
    const canonical = hunt.prey?.creatureId ? resolveChapter18Avoidance({
      creatureId: hunt.prey.creatureId, avoidance, hunting: asInt(input.hunting, hunter.hunting),
      modifier: hunt.terrainModifier + hunt.temporaryModifier + asInt(hunter.huntingModifier), hunterRoll: roll, creatureRoll: preyRoll
    }, rng) : null;
    const hunterCheck = canonical?.hunterCheck || resolveD20Roll(roll, asInt(input.hunting, hunter.hunting) + hunt.terrainModifier + hunt.temporaryModifier + asInt(hunter.huntingModifier));
    const preyCheck = canonical?.avoidanceCheck || resolveD20Roll(preyRoll, avoidance);
    const opposed = canonical?.opposed || resolveOpposedD20(hunterCheck, preyCheck);
    const outcome = opposed.winner === 'actor' ? 'win'
      : opposed.actorOutcome === 'partial' ? 'partial'
        : hunterCheck.fumble ? 'fumble' : 'lose';
    if (outcome === 'win') {
      hunter.marker = 6;
      hunter.status = 'discovered';
    } else if (outcome === 'partial') {
      hunter.marker = Math.min(6, hunter.marker + 1);
      if (hunter.marker === 6) hunter.status = 'discovered';
    } else if (outcome === 'fumble') {
      hunter.marker = Math.max(0, hunter.marker - 2);
      hunter.status = 'search';
    } else {
      hunter.marker = Math.max(0, hunter.marker - 1);
      hunter.status = 'obstacle';
      hunt.obstacle = { hunterId: hunter.id, status: 'pending', sourcePage: 425 };
    }
    result = { id, type: 'hunt_chase', hunterId: hunter.id, hunterCheck, preyCheck, opposed, outcome, marker: hunter.marker, sourcePage: 425 };
  } else throw new RangeError('이 참가자는 현재 Search 또는 Chase 상태가 아닙니다.');
  hunt.segmentActions[hunter.id] = id;
  hunt.results.push(result);
  hunt.updatedAt = iso(input.now);
  if (hunter.status === 'discovered') hunt.phase = 'discovery';
  else finalizeHuntSegment(hunt);
  state.updatedAt = iso(input.now);
  return { character, adventure: state, hunt, result };
};

export const resolveAdventureHuntObstacle = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const hunt = huntState(state);
  if (hunt.phase !== 'segments' || !hunt.obstacle) throw new RangeError('현재 해결할 Hunt 장애물이 없습니다.');
  const hunter = hunt.hunters.find(item => item.id === hunt.obstacle.hunterId);
  const tableResult = lookupChapter19Table('19-10', input.roll);
  const sequence = Math.max(1, asInt(hunt.obstacle.sequence, 1));
  const transactionId = safeId(`${huntResultId(hunt, hunter.id, `obstacle_${sequence}`)}:${tableResult.roll}`);
  if (hunt.results.some(item => item.id === transactionId)) return { character, adventure: state, hunt, result: tableResult, applied: false };
  const deadEndFollowUp = asInt(hunt.obstacle.remainingRolls) > 0;
  const ignoredEleven = deadEndFollowUp && tableResult.roll === 11;
  if (ignoredEleven) {
    hunt.obstacle = { ...hunt.obstacle, sequence: sequence + 1 };
  } else if (tableResult.roll === 11 && !input.overcome) {
    hunter.status = 'obstacle';
    hunt.obstacle = { hunterId: hunter.id, status: 'dead_end_followups', remainingRolls: 2, ignoreEleven: true, sequence: sequence + 1, sourcePage: 425 };
  } else if ([4, 12].includes(tableResult.roll)) {
    hunter.status = 'discovered';
    hunt.phase = 'discovery';
    hunt.obstacle = null;
  } else {
    hunter.status = input.overcome ? 'chase' : 'search';
    const remainingRolls = deadEndFollowUp ? Math.max(0, asInt(hunt.obstacle.remainingRolls) - 1) : 0;
    hunt.obstacle = remainingRolls > 0
      ? { ...hunt.obstacle, remainingRolls, sequence: sequence + 1 }
      : null;
  }
  const result = {
    id: transactionId, type: 'hunt_obstacle', hunterId: hunter.id, overcome: Boolean(input.overcome),
    ignored: ignoredEleven, remainingRolls: asInt(hunt.obstacle?.remainingRolls), ...tableResult, createdAt: iso(now)
  };
  hunt.results.push(result);
  const structuralDeadEnd = ignoredEleven || (tableResult.roll === 11 && !input.overcome);
  hunt.awaitingConsequence = Boolean(tableResult.effect) && !structuralDeadEnd;
  if (hunt.awaitingConsequence) {
    state.pendingConsequence = {
      id: `${transactionId}:consequence`, stageId: hunt.stageId, sourcePage: 425,
      description: tableResult.effect, status: 'pending', appliedActions: []
    };
  } else if (!hunt.obstacle) finalizeHuntSegment(hunt);
  state.updatedAt = iso(now);
  return { character, adventure: state, hunt, result, applied: true };
};

export const resolveAdventureHuntPrey = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const hunt = huntState(state);
  if (hunt.phase !== 'discovery') throw new RangeError('아직 먹잇감을 발견할 단계가 아닙니다.');
  if (hunt.prey) return { character, adventure: state, hunt, prey: hunt.prey, applied: false };
  const primary = lookupChapter19Table('19-11', input.roll, { rowIndex: input.rowIndex });
  const selected = primary.nextSubtable
    ? lookupChapter19Table('19-11', input.specialRoll, { subtable: primary.nextSubtable, rowIndex: input.specialRowIndex })
    : primary;
  hunt.prey = {
    name: selected.result, avoidance: asInt(selected.avoidance), chapter18Page: selected.chapter18Page,
    creatureId: getChapter18HuntCreatureId(selected.result),
    sourcePage: 425, tableRoll: primary.roll, specialRoll: selected.subtable ? selected.roll : null,
    rowIndex: primary.rowIndex, specialRowIndex: selected.subtable ? selected.rowIndex : null
  };
  hunt.preyAvoidance = hunt.prey.avoidance;
  hunt.results.push({ id: safeId(`${hunt.transactionId}:prey`), type: 'hunt_prey', ...clone(hunt.prey), createdAt: iso(now) });
  hunt.updatedAt = iso(now);
  return { character, adventure: state, hunt, prey: hunt.prey, applied: true };
};

export const resolveAdventureHuntDiscovery = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const hunt = huntState(state);
  if (hunt.phase !== 'discovery' || !hunt.prey) throw new RangeError('발견한 먹잇감과 행동을 먼저 확정하세요.');
  const choice = String(input.choice || 'wait');
  const result = {
    id: safeId(`${hunt.transactionId}:discovery_choice`), type: 'hunt_discovery_choice', choice,
    prey: hunt.prey.name, note: String(input.note || ''), sourcePage: hunt.fixedPrey ? hunt.prey.sourcePage : 426, createdAt: iso(now)
  };
  if (hunt.fixedPrey && hunt.prey.name === 'White Deer' && choice === 'observe') {
    hunt.phase = 'complete';
    hunt.outcome = 'hidden_pass_found';
  } else if (choice === 'surprise') hunt.phase = 'surprise';
  else if (choice === 'wait' || choice === 'attack') hunt.phase = 'combat_ready';
  else if (choice === 'release') {
    hunt.phase = 'complete';
    hunt.outcome = 'prey_released';
  } else throw new RangeError('원문 Hunt에서 허용되는 발견 후 행동을 선택하세요.');
  hunt.results.push(result);
  hunt.updatedAt = iso(now);
  return { character, adventure: state, hunt, result };
};

export const resolveAdventureHuntSurprise = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const hunt = huntState(state);
  if (hunt.phase !== 'surprise') throw new RangeError('현재는 Hunt 기습 공격 단계가 아닙니다.');
  const hunterRoll = Math.min(20, Math.max(1, asInt(input.roll, Math.floor(rng() * 20) + 1)));
  const preyRoll = Math.min(20, Math.max(1, asInt(input.preyRoll, Math.floor(rng() * 20) + 1)));
  const weaponCheck = resolveD20Roll(hunterRoll, asInt(input.weaponSkill));
  const avoidanceCheck = resolveD20Roll(preyRoll, hunt.prey.avoidance);
  const opposed = resolveOpposedD20(weaponCheck, avoidanceCheck);
  const outcome = opposed.winner === 'actor' ? (weaponCheck.critical ? 'critical' : 'win')
    : opposed.actorOutcome === 'partial' ? 'partial'
      : weaponCheck.fumble ? 'fumble' : 'failure';
  const result = {
    id: safeId(`${hunt.transactionId}:surprise`), type: 'hunt_surprise', weaponSkill: asInt(input.weaponSkill),
    weaponCheck, avoidanceCheck, opposed, outcome, sourcePage: 426, createdAt: iso(input.now)
  };
  hunt.results.push(result);
  if (['partial', 'failure', 'fumble'].includes(outcome)) {
    hunt.phase = 'segments';
    hunt.temporaryModifier = outcome === 'partial' ? 5 : 0;
    hunt.segmentActions = {};
    for (const hunter of hunt.hunters) if (hunter.status === 'discovered') hunter.status = 'chase';
    if (outcome === 'fumble') {
      state.pendingConsequence = { id: `${result.id}:consequence`, stageId: hunt.stageId, sourcePage: 426, description: '낙마로 1d6 피해.', status: 'pending', appliedActions: [] };
      hunt.awaitingConsequence = true;
    }
  } else {
    hunt.phase = 'combat_ready';
    hunt.surpriseOutcome = outcome;
  }
  hunt.updatedAt = iso(input.now);
  return { character, adventure: state, hunt, result };
};

export const completeAdventureHunt = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const hunt = huntState(state);
  if (!['complete', 'expired'].includes(hunt.phase)) throw new RangeError('Hunt의 발견, 전투 또는 종료 결과를 먼저 해결하세요.');
  const transactionId = safeId(`${hunt.transactionId}:return`);
  if (!transactionApplied(state, transactionId)) {
    appendAdventureResult(state, {
      id: transactionId, type: 'hunt_return', stageId: hunt.stageId, outcome: hunt.outcome || hunt.phase,
      prey: clone(hunt.prey), segmentsUsed: hunt.segmentsTotal - hunt.segmentsRemaining, note: String(input.note || ''), sourcePage: hunt.sourcePage, createdAt: iso(now)
    });
    applyTransaction(state, transactionId);
  }
  state.pendingSubsystem = null;
  const next = advance(character, state, now, { force: true });
  return { character, adventure: character.campaign.adventures.active, nextStage: next, applied: true };
};

export const beginAdventureChase = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const stage = getCurrentAdventureStage(state);
  if (stage?.kind !== 'subsystem' || stage.subsystem !== 'chase') throw new RangeError('현재 장면은 Chapter 19 Chase 절차가 아닙니다.');
  if (state.pendingSubsystem) throw new RangeError('이미 연결된 하위 절차가 진행 중입니다.');
  const transactionId = safeId(`${state.id}:${stage.id}:chase`);
  state.pendingSubsystem = {
    type: 'chase', subsystemId: transactionId, transactionId, stageId: stage.id, sourcePage: stage.sourcePage,
    status: 'active', currentStage: 1, maxStages: Math.min(10, Math.max(1, asInt(input.maxStages, 10))),
    unit: String(input.unit || 'distance unit'), distance: Math.max(1, asInt(input.initialDistance, 1)),
    pursuer: { name: String(input.pursuerName || 'Pursuers'), speed: Math.max(0, asInt(input.pursuerSpeed)) },
    fleeing: { name: String(input.fleeingName || 'Fleeing group'), speed: Math.max(0, asInt(input.fleeingSpeed)) },
    rounds: [], outcome: null, createdAt: iso(now), updatedAt: iso(now)
  };
  state.updatedAt = iso(now);
  return { character, adventure: state, chase: state.pendingSubsystem };
};

export const resolveAdventureChaseStage = (characterValue, input = {}, rng = Math.random) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const chase = state.pendingSubsystem;
  if (!chase || chase.type !== 'chase' || chase.status !== 'active') throw new RangeError('진행 중인 Chase stage가 없습니다.');
  const pursuerRoll = Math.min(6, Math.max(1, asInt(input.pursuerRoll, Math.floor(rng() * 6) + 1)));
  const fleeingRoll = Math.min(6, Math.max(1, asInt(input.fleeingRoll, Math.floor(rng() * 6) + 1)));
  const speedDifference = chase.pursuer.speed - chase.fleeing.speed;
  const pursuerSpeedModifier = Math.max(0, speedDifference);
  const fleeingSpeedModifier = Math.max(0, -speedDifference);
  const pursuerModified = pursuerRoll + pursuerSpeedModifier + asInt(input.pursuerTactic) - Math.max(0, asInt(input.pursuerObstacle));
  const fleeingModified = fleeingRoll + fleeingSpeedModifier + asInt(input.fleeingTactic) - Math.max(0, asInt(input.fleeingObstacle));
  const difference = Math.abs(pursuerModified - fleeingModified);
  const before = chase.distance;
  if (pursuerModified > fleeingModified) chase.distance = Math.max(0, chase.distance - difference);
  else if (fleeingModified > pursuerModified) chase.distance += difference;
  const record = {
    id: safeId(`${chase.transactionId}:stage:${chase.currentStage}`), stage: chase.currentStage,
    pursuerRoll, fleeingRoll, pursuerSpeedModifier, fleeingSpeedModifier,
    pursuerTactic: asInt(input.pursuerTactic), fleeingTactic: asInt(input.fleeingTactic),
    pursuerObstacle: Math.max(0, asInt(input.pursuerObstacle)), fleeingObstacle: Math.max(0, asInt(input.fleeingObstacle)),
    pursuerModified, fleeingModified, distanceBefore: before, distanceAfter: chase.distance,
    note: String(input.note || ''), sourcePage: 426, createdAt: iso(input.now)
  };
  chase.rounds.push(record);
  appendAdventureResult(state, { ...record, type: 'chase_stage', stageId: chase.stageId });
  applyTransaction(state, record.id);
  if (chase.distance === 0) {
    chase.status = 'caught';
    chase.outcome = 'caught';
  } else if (input.fleeingReachedObjective) {
    chase.status = 'escaped';
    chase.outcome = 'objective_reached';
  } else if (input.groupStopped) {
    chase.status = 'stopped';
    chase.outcome = String(input.groupStopped);
  } else if (chase.currentStage >= chase.maxStages) {
    chase.status = 'gm_end_pending';
  } else chase.currentStage += 1;
  chase.updatedAt = iso(input.now);
  state.updatedAt = chase.updatedAt;
  return { character, adventure: state, chase, result: record };
};

export const recordAdventureChaseEnding = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const chase = state.pendingSubsystem;
  if (!chase || chase.type !== 'chase') throw new RangeError('종료할 Chase가 없습니다.');
  if (chase.status === 'active') throw new RangeError('붙잡힘, 목표 도달, 정지 또는 최대 stage 조건을 먼저 충족하세요.');
  if (chase.status === 'gm_end_pending') {
    if (!['escaped', 'stopped', 'caught'].includes(input.outcome)) throw new RangeError('원문이 GM에게 맡긴 Chase 종료 결과를 기록하세요.');
    chase.status = input.outcome;
    chase.outcome = input.outcome;
  }
  chase.endingNote = String(input.note || '');
  chase.updatedAt = iso(now);
  return { character, adventure: state, chase };
};

export const completeAdventureChase = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const chase = state.pendingSubsystem;
  if (!chase || chase.type !== 'chase' || !['caught', 'escaped', 'stopped'].includes(chase.status)) {
    throw new RangeError('Chapter 19의 Chase 종료 조건을 먼저 확정하세요.');
  }
  const transactionId = safeId(`${chase.transactionId}:return`);
  if (!transactionApplied(state, transactionId)) {
    appendAdventureResult(state, {
      id: transactionId, type: 'chase_return', stageId: chase.stageId, outcome: chase.outcome,
      stages: chase.rounds.length, finalDistance: chase.distance, note: String(input.note || chase.endingNote || ''),
      sourcePage: chase.sourcePage, createdAt: iso(now)
    });
    applyTransaction(state, transactionId);
  }
  state.pendingSubsystem = null;
  const next = advance(character, state, now);
  return { character, adventure: character.campaign.adventures.active, nextStage: next, applied: true };
};

export const beginAdventureCombat = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const stage = getCurrentAdventureStage(state);
  const definition = CHAPTER_19_ADVENTURE_BY_ID[state.adventureId];
  const parentHunt = state.pendingSubsystem?.type === 'hunt' && state.pendingSubsystem.phase === 'combat_ready'
    ? clone(state.pendingSubsystem) : null;
  const tableResult = stage?.kind === 'table' ? state.pendingTable?.resolved : null;
  const tableIntegrated = tableResult && getAdventureTableSubsystemRequirement(tableResult.tableId, tableResult.result) === 'combat';
  const dedicated = stage?.kind === 'subsystem' && stage.subsystem === 'combat';
  const integrated = tableIntegrated || (['procedure', 'aftermath'].includes(stage?.kind) && definition.integrations.includes('combat'));
  if (!dedicated && !integrated && !parentHunt) throw new RangeError('현재 장면은 개인전투 호출 장면이 아닙니다.');
  if (state.pendingSubsystem && !parentHunt) throw new RangeError('이미 연결된 하위 절차가 진행 중입니다.');
  const chapter18Id = input.chapter18Id || parentHunt?.prey?.creatureId;
  if (stage.dependency && !chapter18Id && !input.gmStatsConfirmed) throw new RangeError('Chapter 18 원문 대상을 선택하거나 GM 입력을 확인해야 합니다.');
  if (parentHunt && !chapter18Id && !input.gmStatsConfirmed) throw new RangeError('Chapter 18 원문 먹잇감을 선택하거나 GM 입력을 확인해야 합니다.');
  if (tableResult && getAdventureTableSubsystemRequirement(tableResult.tableId, tableResult.result) !== 'combat') {
    throw new RangeError('현재 표 결과는 Chapter 7 개인전투를 요구하지 않습니다.');
  }
  const tableSuffix = tableResult ? `:${tableResult.tableId}:${tableResult.iteration}:${tableResult.rowIndex}` : '';
  const transactionId = safeId(input.transactionId || (parentHunt ? `${parentHunt.transactionId}:combat` : `${state.id}:${stage.id}${tableSuffix}:combat`));
  if (transactionApplied(state, `${transactionId}:return`)) throw new RangeError('이 장면의 개인전투 결과는 이미 모험에 반영되었습니다.');
  const returnContext = { type: 'adventure', adventureId: state.id, adventureKey: state.adventureId, stageId: stage.id, transactionId };
  const marcianPrayer = state.results.find(item => item.type === 'personality_magic_return' && item.action === 'jewel_relic_prayer');
  const eingarPenalty = state.adventureId === 'jewel' && stage.id === 'werewolf' && ['critical', 'success'].includes(marcianPrayer?.canonicalOutcome) ? -5 : 0;
  const adjustedInput = eingarPenalty ? {
    ...input,
    opponents: list(input.opponents).map(opponent => ({ ...opponent, skill: asInt(opponent.skill) + eingarPenalty })),
    opponent: input.opponent ? { ...input.opponent, skill: asInt(input.opponent.skill) + eingarPenalty } : input.opponent
  } : input;
  const startedResult = chapter18Id
    ? startChapter18Encounter(character, {
      id: `${transactionId}:chapter18`, combatId: input.combatId || transactionId,
      creatureIds: Array.from({ length: Math.max(1, asInt(input.count, 1)) }, () => chapter18Id),
      attackId: input.attackId, mountId: input.mountId, overrides: input.overrides, distance: input.distance,
      partySize: Math.max(1, state.participants.length), victors: Math.max(1, asInt(input.victors, state.participants.length)),
      player: input.player, returnContext
    }, now)
    : { character: startChapter7Combat(character, {
      id: adjustedInput.combatId || transactionId,
      source: `chapter_19:${state.adventureId}:${stage.id}`,
      player: adjustedInput.player,
      opponents: adjustedInput.opponents,
      opponent: adjustedInput.opponent,
      openingModifier: adjustedInput.openingModifier,
      openingModifierSource: adjustedInput.openingModifierSource,
      returnContext
    }, now) };
  const started = startedResult.character;
  const nextState = requireActive(started);
  nextState.pendingSubsystem = {
    type: 'combat', subsystemId: started.campaign.combat.id, stageId: stage.id, transactionId,
    status: 'active', sourcePage: stage.sourcePage, advanceOnReturn: dedicated, parentHunt,
    tableResultId: tableResult?.id || null,
    chapter18EncounterId: started.campaign.chapter18?.active?.id || null
  };
  nextState.updatedAt = iso(now);
  return { character: started, adventure: nextState, combat: started.campaign.combat };
};

export const completeAdventureCombat = (characterValue, input = {}, now) => {
  let character = clone(characterValue);
  const state = requireActive(character);
  const pending = state.pendingSubsystem;
  if (!pending || pending.type !== 'combat') throw new RangeError('이 모험으로 복귀할 개인전투가 없습니다.');
  const combat = character.campaign?.combat;
  if (combat?.id !== pending.subsystemId) throw new RangeError('현재 전투는 이 모험 장면에서 시작한 전투가 아닙니다.');
  const transactionId = `${pending.transactionId}:return`;
  if (transactionApplied(state, transactionId)) return { character, adventure: state, combat, applied: false };
  const concluded = pending.chapter18EncounterId && character.campaign?.chapter18?.active
    ? completeChapter18Encounter(character, input, now)
    : combat.status === 'concluded' ? { character, combat, returnContext: combat.returnContext } : concludeChapter7Combat(character, input, now);
  character = concluded.character;
  const nextState = requireActive(character);
  const outcome = concluded.combat.outcome;
  appendAdventureResult(nextState, {
    id: transactionId, type: 'combat_return', stageId: pending.stageId, subsystemId: pending.subsystemId,
    tableResultId: pending.tableResultId || null, outcome: clone(outcome), rounds: concluded.combat.rounds.length,
    sourcePage: getCurrentAdventureStage(nextState)?.sourcePage, createdAt: iso(now)
  });
  applyTransaction(nextState, transactionId);
  if (pending.parentHunt) {
    nextState.pendingSubsystem = {
      ...pending.parentHunt, phase: 'complete', status: 'active', outcome: outcome?.result || outcome?.status || 'combat_complete',
      combatTransactionId: transactionId, updatedAt: iso(now)
    };
    pauseForContinuation(character, nextState, pending, transactionId, now);
  } else {
    nextState.pendingSubsystem = null;
    const paused = pauseForContinuation(character, nextState, pending, transactionId, now);
    if (pending.advanceOnReturn && !paused) advance(character, nextState, now);
  }
  return { character, adventure: character.campaign.adventures.active, combat: concluded.combat, applied: true };
};

export const beginAdventureBattle = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const stage = getCurrentAdventureStage(state);
  const definition = CHAPTER_19_ADVENTURE_BY_ID[state.adventureId];
  const tableResult = stage?.kind === 'table' ? state.pendingTable?.resolved : null;
  const tableIntegrated = tableResult && getAdventureTableSubsystemRequirement(tableResult.tableId, tableResult.result) === 'battle';
  const dedicated = stage?.kind === 'subsystem' && stage.subsystem === 'battle';
  const integrated = tableIntegrated || (['procedure', 'aftermath'].includes(stage?.kind) && definition.integrations.includes('battle'));
  if (!dedicated && !integrated) throw new RangeError('현재 장면은 Chapter 8 호출 장면이 아닙니다.');
  if (state.pendingSubsystem) throw new RangeError('이미 연결된 하위 절차가 진행 중입니다.');
  if (tableResult && getAdventureTableSubsystemRequirement(tableResult.tableId, tableResult.result) !== 'battle') {
    throw new RangeError('현재 표 결과는 Chapter 8 전투를 요구하지 않습니다.');
  }
  const requestedBattleType = input.battleType || stage.battleType;
  const battleType = ['skirmish', 'mass_battle', 'siege'].includes(requestedBattleType) ? requestedBattleType : 'mass_battle';
  const tableSuffix = tableResult ? `:${tableResult.tableId}:${tableResult.iteration}:${tableResult.rowIndex}` : '';
  const transactionId = safeId(input.transactionId || `${state.id}:${stage.id}${tableSuffix}:${battleType}`);
  if (transactionApplied(state, `${transactionId}:return`)) throw new RangeError('이 장면의 Chapter 8 결과는 이미 모험에 반영되었습니다.');
  const setup = { ...input.setup, id: input.setup?.id || transactionId, name: input.setup?.name || stage.title };
  const started = battleType === 'skirmish' ? startSkirmish(character, setup, now)
    : battleType === 'siege' ? startSiege(character, setup, now)
      : startMassBattle(character, setup, now);
  const key = battleType === 'skirmish' ? 'skirmish' : battleType === 'siege' ? 'siege' : 'massBattle';
  started.character.campaign[key].returnContext = { type: 'adventure', adventureId: state.id, adventureKey: state.adventureId, stageId: stage.id, transactionId };
  const nextState = requireActive(started.character);
  nextState.pendingSubsystem = {
    type: battleType, subsystemId: started.character.campaign[key].id, stageId: stage.id,
    transactionId, status: 'active', sourcePage: stage.sourcePage, advanceOnReturn: dedicated,
    tableResultId: tableResult?.id || null
  };
  return { character: started.character, adventure: nextState, battle: started.character.campaign[key] };
};

export const completeAdventureBattleReturn = (characterValue, _input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const pending = state.pendingSubsystem;
  if (!pending || !['skirmish', 'mass_battle', 'siege'].includes(pending.type)) throw new RangeError('이 모험으로 복귀할 Chapter 8 절차가 없습니다.');
  const key = pending.type === 'mass_battle' ? 'massBattle' : pending.type;
  const battle = character.campaign?.[key];
  if (!battle || battle.id !== pending.subsystemId || battle.status !== 'complete') throw new RangeError('Chapter 8 절차를 먼저 완료해야 합니다.');
  const transactionId = `${pending.transactionId}:return`;
  if (transactionApplied(state, transactionId)) return { character, adventure: state, battle, applied: false };
  appendAdventureResult(state, {
    id: transactionId, type: 'battle_return', battleType: pending.type, stageId: pending.stageId,
    subsystemId: battle.id, tableResultId: pending.tableResultId || null, result: clone(battle.result || battle.aftermath),
    sourcePage: getCurrentAdventureStage(state)?.sourcePage, createdAt: iso(now)
  });
  applyTransaction(state, transactionId);
  state.pendingSubsystem = null;
  const paused = pauseForContinuation(character, state, pending, transactionId, now);
  if (pending.advanceOnReturn && !paused) advance(character, state, now);
  return { character, adventure: character.campaign.adventures.active, battle, applied: true };
};

export const resolveAdventureInterruption = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const interruption = state.pendingInterruption;
  if (!interruption || interruption.status !== 'pending') throw new RangeError('해결할 모험 중단 상태가 없습니다.');
  const remaining = continuationBlock(character);
  if (remaining) throw new RangeError(remaining.reason);
  const action = ['continue', 'continue_successor', 'continue_survivors', 'end_adventure'].includes(input.action)
    ? input.action
    : 'continue';
  const transactionId = safeId(`${interruption.id}:resolved`);
  if (transactionApplied(state, transactionId)) return { character, adventure: state, applied: false };
  const activeCharacterId = character.campaign?.lifecycle?.activeCharacterId || null;
  const previousCharacterId = interruption.activeCharacterIdBefore;
  if (activeCharacterId !== previousCharacterId) {
    state.participants = state.participants.filter(participant => participant.characterId !== previousCharacterId);
    if (action === 'continue_successor') {
      state.participants.push(sanitizeParticipant({
        id: activeCharacterId || 'successor', characterId: activeCharacterId,
        name: character.personal?.name || '후계 기사', role: 'player_knight', status: 'active'
      }, state.participants.length));
    }
  }
  const decision = sanitizeDecision({
    id: transactionId, stageId: interruption.stageId, kind: 'gm', value: action,
    note: input.note || '전투 후 생애주기·포로 상태를 해결하고 참가자 연속성을 확정함',
    sourcePage: interruption.sourcePage, createdAt: iso(now)
  });
  state.decisions.push(decision);
  appendAdventureResult(state, {
    id: transactionId, type: 'interruption_resolved', stageId: interruption.stageId,
    interruptionType: interruption.type, action, sourcePage: interruption.sourcePage, createdAt: iso(now)
  });
  applyTransaction(state, transactionId);
  state.pendingInterruption = null;
  if (action === 'end_adventure') {
    state.pendingSubsystem = null;
    return abortAdventure(character, { note: decision.note }, now);
  }
  if (!state.participants.length) throw new RangeError('계속할 생존 참가자 또는 후계 기사를 확정하세요.');
  if (interruption.advanceOnReturn && !interruption.parentHunt) advance(character, state, now);
  return { character, adventure: character.campaign.adventures.active, applied: true };
};

export const beginAdventurePersonalityMagic = (characterValue, _input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const stage = getCurrentAdventureStage(state);
  if (stage?.kind !== 'subsystem' || stage.subsystem !== 'personality_magic') {
    throw new RangeError('현재 장면은 Chapter 3·9 canonical 절차가 아닙니다.');
  }
  if (state.pendingSubsystem) throw new RangeError('이미 연결된 하위 절차가 진행 중입니다.');
  const transactionId = safeId(`${state.id}:${stage.id}:personality_magic`);
  if (transactionApplied(state, `${transactionId}:return`)) {
    throw new RangeError('이 장면의 Personality/Magic 결과는 이미 모험에 반영되었습니다.');
  }
  const personalityMagic = sanitizePersonalityMagicState(
    character.campaign?.personalityMagic,
    character.campaign?.passionStates
  );
  const pending = {
    type: 'personality_magic',
    subsystemId: transactionId,
    transactionId,
    stageId: stage.id,
    action: stage.action,
    procedure: clone(stage.procedure || {}),
    status: 'active',
    sourcePage: stage.sourcePage,
    transactionCursor: personalityMagic.transactions.length,
    createdAt: iso(now)
  };
  state.pendingSubsystem = pending;
  personalityMagic.adventureBridge = {
    adventureId: state.id,
    adventureKey: state.adventureId,
    stageId: stage.id,
    action: stage.action,
    procedure: clone(stage.procedure || {}),
    transactionId,
    sourcePage: stage.sourcePage,
    status: 'active'
  };
  character.campaign.personalityMagic = personalityMagic;
  character.campaign.passionStates = undefined;
  state.updatedAt = iso(now);
  return { character, adventure: state, bridge: personalityMagic.adventureBridge };
};

const personalityMagicReady = (action, personalityMagic, result) => {
  const amor = personalityMagic.amor;
  if (action === 'love_conquers_all') return asInt(amor?.completedTasks) >= 3;
  if (action === 'romance_start') return Boolean(result) && amor?.potentialAmor !== null;
  if (action === 'romance_progression') return Boolean(result) && amor?.phase === 'essai';
  if (action === 'romance_essai') return Boolean(result) && amor?.phase === 'essai_passed';
  if (action === 'romance_consummation') return Boolean(result) && amor?.phase === 'affair';
  if (action === 'romance_discovery') return Boolean(result) && (amor?.phase === 'exposed' || (amor?.phase === 'affair' && amor.discoveryHistory?.length));
  if (action === 'wild_hunt') {
    return result?.type === 'madness_year'
      || (result?.type === 'prayer_resolved' && ['critical', 'success'].includes(result.outcome));
  }
  return Boolean(result);
};

export const completeAdventurePersonalityMagic = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const pending = state.pendingSubsystem;
  if (!pending || pending.type !== 'personality_magic') {
    throw new RangeError('이 모험으로 복귀할 Chapter 3·9 절차가 없습니다.');
  }
  const personalityMagic = sanitizePersonalityMagicState(
    character.campaign?.personalityMagic,
    character.campaign?.passionStates
  );
  const allowed = PERSONALITY_MAGIC_RESULTS[pending.action] || [];
  const candidates = personalityMagic.transactions.slice(Math.max(0, asInt(pending.transactionCursor)));
  const result = input.canonicalTransactionId
    ? personalityMagic.transactions.find(item => item.id === input.canonicalTransactionId && allowed.includes(item.type))
    : [...candidates].reverse().find(item => allowed.includes(item.type));
  if (!personalityMagicReady(pending.action, personalityMagic, result)) {
    throw new RangeError('현재 장면이 요구하는 canonical Personality/Magic 절차를 먼저 완료하세요.');
  }
  const transactionId = `${pending.transactionId}:return`;
  if (transactionApplied(state, transactionId)) {
    return { character, adventure: state, result, applied: false };
  }
  appendAdventureResult(state, {
    id: transactionId,
    type: 'personality_magic_return',
    stageId: pending.stageId,
    action: pending.action,
    canonicalTransactionId: result?.id || null,
    canonicalTransactionType: result?.type || null,
    canonicalOutcome: result?.outcome || result?.check?.outcome || null,
    sourcePage: pending.sourcePage,
    createdAt: iso(now)
  });
  applyTransaction(state, transactionId);
  state.pendingSubsystem = null;
  personalityMagic.adventureBridge = null;
  character.campaign.personalityMagic = personalityMagic;
  character.campaign.passionStates = undefined;
  const next = advance(character, state, now);
  return {
    character,
    adventure: character.campaign.adventures.active,
    nextStage: next,
    result,
    applied: true
  };
};

const birthGiftValueDeniers = gift => {
  if (gift.value === '120d') return 120;
  if (gift.value === '1 pound') return 240;
  if (gift.value === '2 pounds') return 480;
  return 0;
};

const applyAdventureBirthGift = (characterValue, gift, transactionId, now) => {
  let character = recordEconomyTransfer(characterValue, {
    id: transactionId,
    transactionId,
    type: 'birth_gift',
    amountDeniers: asInt(gift.cash) * 240,
    label: gift.label,
    note: 'The Adventure of the Humble Squires knighting gift',
    sourceRuleId: 'CHAR-GIFT-001',
    sourcePage: 'Chapter 1 p.39; Chapter 19 p.406',
    sourceId: transactionId,
    year: characterValue.personal?.campaignYear,
    createdAt: iso(now)
  }).character;
  character.gear = character.gear || {};
  character.gear.birthGifts = [...list(character.gear.birthGifts), clone(gift)];
  if (gift.conditionalModifier) {
    character.gear.conditionalModifiers = [...list(character.gear.conditionalModifiers), {
      ...clone(gift.conditionalModifier), source: gift.label, sourceRuleId: 'CHAR-GIFT-001'
    }];
  }
  if (gift.annualStipend) character.gear.annualStipend = asInt(character.gear.annualStipend) + asInt(gift.annualStipend);
  if (gift.special === 'outfitUpgrade') character.gear.outfitUpgrades = asInt(character.gear.outfitUpgrades) + 1;
  if (gift.religiousTrait) character.traits = adjustOpposedTrait(character.traits, gift.religiousTrait, 2);
  if (gift.weapon && Number.isFinite(Number(character.skills?.[gift.weapon]))) {
    character.skills[gift.weapon] += gift.weapon === 'sword' ? 1 : 3;
  }
  if (gift.key === 'extraPalfrey' || gift.key === 'extraCharger') {
    const horseKey = `${gift.key}_${safeId(transactionId)}`;
    character.horses = {
      ...(character.horses || {}),
      [horseKey]: { type: gift.key === 'extraPalfrey' ? 'Palfrey' : 'Charger', status: '건강', source: 'CHAR-GIFT-001' }
    };
  }
  const equipmentKeys = new Set(['decoratedSaddle', 'magnificentCloak', 'blessedSpear', 'blessedSword', 'goldenRing', 'sacredRelic', 'exceptionalWeapon', 'healingPotion', 'extraPalfrey', 'extraCharger']);
  if (equipmentKeys.has(gift.key)) {
    const inventoryId = `${transactionId}:equipment`;
    character.campaign.economy.equipment = [...character.campaign.economy.equipment, {
      id: inventoryId,
      label: gift.relicType ? `${gift.label} (${gift.relicType})` : gift.label,
      category: gift.key === 'extraPalfrey' || gift.key === 'extraCharger' ? 'mount' : 'birth_gift',
      quantity: 1,
      unitValueDeniers: birthGiftValueDeniers(gift),
      acquiredYear: character.personal?.campaignYear,
      source: 'CHAR-GIFT-001',
      sourcePage: 'Chapter 1 p.39; Chapter 19 p.406',
      disposed: false,
      equipped: false
    }];
  }
  return character;
};

export const resolveAdventureKnighthood = (characterValue, input = {}, now) => {
  let character = clone(characterValue);
  let state = requireActive(character);
  const stage = getCurrentAdventureStage(state);
  if (stage?.kind !== 'subsystem' || stage.subsystem !== 'knighthood') throw new RangeError('현재 장면은 기사 서임 절차가 아닙니다.');
  const transactionId = safeId(input.transactionId || `${state.id}:${stage.id}:knighting`);
  if (transactionApplied(state, transactionId)) return { character, adventure: state, applied: false };
  const birthGift = resolveStandaloneBirthGift(input);
  if (!birthGift.complete) throw new RangeError(birthGift.pending.map(item => item.label).join(' '));

  const knighting = resolveKnighthood(character, {
    eventId: `${transactionId}:lifecycle`,
    sourceRuleId: 'ADVENTURE-CH19',
    sourcePage: 'Chapter 19 p.406; Chapter 1 p.35',
    cause: 'knighted_by_charlemagne_with_joyeuse',
    year: state.campaignYear,
    timestamp: iso(now)
  });
  character = knighting.character;
  for (const gift of birthGift.entries) character = applyAdventureBirthGift(character, gift, `${transactionId}:gift:${gift.path}`, now);
  state = requireActive(character);
  recordGloryAward(character, {
    id: `${transactionId}:glory`,
    transactionId: `${transactionId}:glory`,
    year: state.campaignYear,
    amount: 1300,
    title: 'Knighted by Prince Charlemagne',
    narrative: 'Knighted in Saint Peter’s Basilica with Joyeuse.',
    sourceRuleId: 'ADVENTURE-CH19',
    sourcePage: 'Chapter 19 p.405',
    sourceAdventure: state.adventureId,
    createdAt: iso(now)
  });
  const result = {
    id: transactionId,
    type: 'knighting_return',
    stageId: stage.id,
    sourcePage: stage.sourcePage,
    lifecycleEventId: knighting.event?.lifecycleEventId || null,
    birthGifts: clone(birthGift.entries),
    glory: 1300,
    createdAt: iso(now)
  };
  appendAdventureResult(state, result);
  state.rewards.push(result);
  applyTransaction(state, transactionId);
  advance(character, state, now);
  return { character, adventure: character.campaign.adventures.active, result, applied: true };
};

export const recordAdventureProcedureItem = (characterValue, input = {}, now) => {
  let character = clone(characterValue);
  let state = requireActive(character);
  const stage = getCurrentAdventureStage(state);
  if (stage?.kind !== 'procedure' || !stage.procedure) throw new RangeError('현재 장면에는 구조화된 원문 절차가 없습니다.');
  const item = list(stage.procedure.items).find(candidate => candidate.id === input.itemId);
  if (!item) throw new RangeError('현재 원문 절차의 항목을 선택하세요.');
  const current = state.procedureProgress?.[stage.id] || { completedItemIds: [], records: [] };
  if (current.completedItemIds.includes(item.id)) {
    return { character, adventure: state, progress: current, applied: false };
  }
  const transactionId = safeId(input.transactionId || `${state.id}:${stage.id}:procedure:${item.id}`);
  const resolutionKind = ['canonical_action', 'linked_transaction', 'player_choice', 'gm_decision', 'narrative'].includes(input.resolutionKind)
    ? input.resolutionKind
    : '';
  if (!resolutionKind) throw new RangeError('원문 항목을 canonical 결과, 기존 거래, Player/GM 판단 또는 Narrative로 분류하세요.');
  let canonicalResultId = null;
  let linkedTransactionIds = [];
  if (resolutionKind === 'canonical_action') {
    if (!input.action?.type) throw new RangeError('실제 적용할 canonical 결과 유형을 선택하세요.');
    const applied = applyAdventureConsequence(character, {
      ...input.action,
      transactionId: `${transactionId}:canonical`,
      reason: input.action.reason || item.title,
      note: input.note
    }, now);
    character = applied.character;
    state = requireActive(character);
    canonicalResultId = applied.result?.id || `${transactionId}:canonical`;
  } else if (resolutionKind === 'linked_transaction') {
    linkedTransactionIds = [...new Set(list(input.linkedTransactionIds).map(safeId).filter(Boolean))];
    const available = new Set([
      ...list(character.campaign?.gloryLedger), ...list(character.campaign?.standingLedger), ...list(character.campaign?.honorLedger),
      ...list(character.campaign?.economy?.transactions), ...list(character.campaign?.combatHistory), ...list(character.campaign?.battleHistory),
      ...list(character.campaign?.siegeHistory), ...list(character.campaign?.personalityMagic?.transactions), ...list(state.results)
    ].flatMap(entry => [entry.id, entry.transactionId, entry.resultId].filter(Boolean).map(safeId)));
    if (!linkedTransactionIds.length || linkedTransactionIds.some(id => !available.has(id))) throw new RangeError('저장된 canonical 결과의 거래 ID를 정확히 연결하세요.');
  } else if (!String(input.note || '').trim()) throw new RangeError('원문이 맡긴 선택 또는 판단 내용을 구체적으로 기록하세요.');
  const record = {
    id: transactionId,
    itemId: item.id,
    title: item.title,
    note: String(input.note || ''),
    resolutionKind,
    canonicalResultId,
    linkedTransactionIds,
    sourcePage: item.sourcePage || stage.sourcePage,
    createdAt: iso(now)
  };
  const progress = {
    completedItemIds: [...current.completedItemIds, item.id],
    records: [...list(current.records), record]
  };
  state.procedureProgress = { ...(state.procedureProgress || {}), [stage.id]: progress };
  appendAdventureResult(state, { ...record, type: 'procedure_item', stageId: stage.id });
  applyTransaction(state, transactionId);
  state.updatedAt = iso(now);
  return { character, adventure: state, progress, applied: true };
};

export const completeAdventureStage = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const stage = getCurrentAdventureStage(state);
  if (state.pendingInterruption) throw new RangeError('사망·포로·생애주기 중단 상태를 먼저 해결하세요.');
  if (state.pendingSubsystem) throw new RangeError('연결된 하위 절차의 결과를 먼저 모험으로 돌려보내세요.');
  if (stage.kind === 'subsystem') throw new RangeError('현재 장면의 canonical 하위 절차를 시작하고 결과를 반환하세요.');
  if (stage.kind === 'player_choice' && !state.pendingChoice?.resolved) throw new RangeError('플레이어 선택을 먼저 기록하세요.');
  if (stage.kind === 'test' && !state.pendingTest?.resolved) throw new RangeError('원문 판정을 먼저 해결하세요.');
  if (stage.kind === 'table' && !state.pendingTable?.resolved) throw new RangeError('원문 표를 먼저 판정하세요.');
  if (state.pendingConsequence?.status === 'pending') throw new RangeError('표 결과의 후속 처리를 적용하거나 확인하세요.');
  if (stage.kind === 'table' && state.pendingTable?.resolved) {
    const tableResult = state.pendingTable.resolved;
    const requiredSubsystem = getAdventureTableSubsystemRequirement(tableResult.tableId, tableResult.result);
    const returnType = requiredSubsystem === 'combat' ? 'combat_return' : 'battle_return';
    if (requiredSubsystem && !state.results.some(item => item.type === returnType && item.tableResultId === tableResult.id)) {
      throw new RangeError(`현재 표 결과가 요구하는 Chapter ${requiredSubsystem === 'combat' ? '7' : '8'} 절차를 완료하고 결과를 반환하세요.`);
    }
  }
  if (stage.kind === 'dependency' && state.pendingDependency?.status !== 'recorded') throw new RangeError('외부 장 의존성 처리 방법을 기록하세요.');
  if (stage.kind === 'procedure' && stage.procedure) {
    const progress = state.procedureProgress?.[stage.id] || { completedItemIds: [] };
    const required = list(stage.procedure.items).filter(item => !item.optional).map(item => item.id);
    const completed = new Set(list(progress.completedItemIds));
    const minimum = Math.max(0, asInt(stage.procedure.minimum, required.length));
    if (required.some(id => !completed.has(id)) || completed.size < minimum) {
      throw new RangeError('현재 원문 절차의 필수 항목을 모두 처리하세요.');
    }
    const records = list(progress.records);
    if (required.some(id => !records.find(record => record.itemId === id)?.resolutionKind)) {
      throw new RangeError('필수 항목마다 실제 결과 또는 원문 판단 분류를 저장하세요.');
    }
  }
  if (stage.requiresCanonicalConsequence && !state.results.some(item => item.stageId === stage.id && ['glory', 'standing', 'honor', 'score', 'economy', 'damage', 'check', 'no_mechanical_effect'].includes(item.type))) {
    throw new RangeError('이 장면의 원문 결과를 canonical 장부에 반영하거나, 적용할 기계적 결과가 없음을 근거와 함께 확인하세요.');
  }
  if (['gm_decision', 'narrative', 'procedure', 'consequence', 'aftermath', 'setup', 'reference'].includes(stage.kind)
    && !state.decisions.some(item => item.stageId === stage.id)) {
    if (!input.confirmed) throw new RangeError('현재 장면의 GM/서술/절차 기록을 남기고 확인하세요.');
    const decision = sanitizeDecision({
      id: `${state.id}:${stage.id}:decision`, stageId: stage.id,
      kind: stage.kind === 'narrative' ? 'narrative' : 'gm', value: 'confirmed', note: input.note,
      sourcePage: stage.sourcePage, createdAt: iso(now)
    });
    state.decisions.push(decision);
    applyTransaction(state, decision.id);
  }
  const current = requireActive(character);
  if (stage.repeat && input.stopRepeat) {
    const progress = getStageProgress(current, stage);
    progress.stopped = true;
    progress.stoppedAt = iso(now);
  }
  const next = advance(character, current, now, { stopRepeat: input.stopRepeat });
  character.campaign.schemaVersion = ADVENTURE_SCHEMA_VERSION;
  return { character, adventure: character.campaign.adventures.active, nextStage: next };
};

export const skipOptionalAdventureStage = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const stage = getCurrentAdventureStage(state);
  if (!stage?.optional) throw new RangeError('원문상 선택 가능한 장면만 건너뛸 수 있습니다.');
  const transactionId = safeId(`${state.id}:${stage.id}:skipped`);
  appendAdventureResult(state, {
    id: transactionId, type: 'stage_skipped', stageId: stage.id, reason: String(input.reason || '원문 분기에서 선택하지 않음'),
    sourcePage: stage.sourcePage, createdAt: iso(now)
  });
  applyTransaction(state, transactionId);
  const next = advance(character, state, now, { force: true });
  return { character, adventure: character.campaign.adventures.active, nextStage: next };
};

export const deferAdventure = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  const stage = getCurrentAdventureStage(state);
  state.status = 'deferred';
  state.deferred = {
    stageId: stage.id, requirement: String(input.requirement || stage.dependency || 'GM decision'),
    sourcePage: asInt(input.sourcePage, stage.sourcePage), previousResults: state.results.map(item => item.id),
    pendingSubsystem: clone(state.pendingSubsystem), gmNote: String(input.gmNote || ''), deferredAt: iso(now)
  };
  state.updatedAt = iso(now);
  return { character, adventure: state };
};

export const resumeAdventure = (characterValue, now) => {
  const character = clone(characterValue);
  const ledger = ensureLedger(character);
  if (!ledger.active || ledger.active.status !== 'deferred') throw new RangeError('재개할 보류 모험이 없습니다.');
  ledger.active.status = 'active';
  ledger.active.deferred = { ...ledger.active.deferred, resumedAt: iso(now) };
  ledger.active.updatedAt = iso(now);
  return { character, adventure: ledger.active };
};

export const abortAdventure = (characterValue, input = {}, now) => {
  const character = clone(characterValue);
  const state = requireActive(character);
  if (state.pendingSubsystem) throw new RangeError('진행 중인 하위 절차가 있어 모험을 중단할 수 없습니다.');
  state.status = 'aborted';
  state.gmNote = String(input.note || state.gmNote || '중단');
  state.updatedAt = iso(now);
  archiveCompleted(character, state);
  return { character, adventure: state };
};

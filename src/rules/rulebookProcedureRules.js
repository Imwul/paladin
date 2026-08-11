import { getCampaignPhase, getChronologyHarvestModifier } from './campaignRules.js';
import { resolveD20Roll, resolveFeatRoll } from './coreRules.js';
import { grantMarketItems, recordEconomyTransfer, toDeniers } from './economyRules.js';
import { appendChronicleEvent, recordGloryAward, recordHonorChange, recordStandingChange } from './ledgerRules.js';
import { prepareCareerEnd, resolveCareerEnd } from './lifecycleRules.js';
import { getTravelDistance, resolveForcedMarch, resolveUnknownRoute } from './travelRules.js';

const clone = value => JSON.parse(JSON.stringify(value));
const list = value => Array.isArray(value) ? value : [];
const asInt = (value, fallback = 0) => Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : fallback;
const safeId = value => String(value || '').trim().replace(/[^a-zA-Z0-9:_-]+/g, '_');
const iso = value => value ? new Date(value).toISOString() : new Date().toISOString();

export const RULEBOOK_PROCEDURE_SCHEMA_VERSION = 1;

export const createRulebookProcedureState = () => ({
  schemaVersion: RULEBOOK_PROCEDURE_SCHEMA_VERSION,
  transactions: [],
  skillResults: [],
  featResults: [],
  journeys: [],
  career: { activeRoleId: null, history: [] },
  ideals: {},
  settlements: [],
  standingConsequences: [],
  chronologyAcknowledgments: []
});

export const sanitizeRulebookProcedureState = value => {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return {
    schemaVersion: RULEBOOK_PROCEDURE_SCHEMA_VERSION,
    transactions: list(source.transactions).slice(-2000),
    skillResults: list(source.skillResults).slice(-500),
    featResults: list(source.featResults).slice(-250),
    journeys: list(source.journeys).slice(-250),
    career: source.career && typeof source.career === 'object'
      ? { activeRoleId: source.career.activeRoleId || null, history: list(source.career.history).slice(-250) }
      : { activeRoleId: null, history: [] },
    ideals: source.ideals && typeof source.ideals === 'object' ? clone(source.ideals) : {},
    settlements: list(source.settlements).slice(-500),
    standingConsequences: list(source.standingConsequences).slice(-500),
    chronologyAcknowledgments: list(source.chronologyAcknowledgments).slice(-100)
  };
};

const ensureState = characterValue => {
  const character = clone(characterValue);
  character.campaign = character.campaign || {};
  character.campaign.rulebookProcedures = sanitizeRulebookProcedureState(character.campaign.rulebookProcedures);
  character.campaign.schemaVersion = 12;
  return { character, state: character.campaign.rulebookProcedures };
};

const appendTransaction = (state, entry) => {
  const id = safeId(entry.id);
  const existing = state.transactions.find(item => item.id === id);
  if (existing) return { entry: existing, applied: false };
  const normalized = { ...clone(entry), id, createdAt: entry.createdAt || iso() };
  state.transactions = [...state.transactions, normalized].slice(-2000);
  return { entry: normalized, applied: true };
};

const addRecord = (entries, entry, limit = 500) => entries.some(item => item.id === entry.id)
  ? entries
  : [...entries, entry].slice(-limit);

export const CHRONOLOGY_RULES = Object.freeze([
  { id: 'phase1_equipment', phases: [1], label: 'Chainmail 10, Charger, Lance, Frankish Sword, Mace', sourcePage: 'Ch.15 pp.287-296' },
  { id: 'phase1_society', phases: [1], label: 'Heraldry, tournaments, widow third, chivalry, paladins, and Romance begin', sourcePage: 'Ch.15 pp.287-296' },
  { id: 'phase2_inheritance', phases: [2, 3, 4], label: 'Fiefs become inheritable; conquered pagan land may be allodial', sourcePage: 'Ch.15 pp.297-303' },
  { id: 'phase2_church', phases: [2, 3, 4], label: 'Bishops and priests may not bear arms; Christian marriage applies', sourcePage: 'Ch.15 pp.297-303' },
  { id: 'phase2_crossbow', phases: [2], label: 'Light and medium crossbows; use against Christians risks excommunication', sourcePage: 'Ch.15 pp.297-303' },
  { id: 'phase3_liege', phases: [3, 4], label: 'Primary liege lord, missus, mercenary substitution, and royal/paladin knighting', sourcePage: 'Ch.15 pp.304-311' },
  { id: 'phase3_equipment', phases: [3], label: 'Partial plate 14, heavy crossbow, Andalusian charger, chain barding 10', sourcePage: 'Ch.15 pp.304-311' },
  { id: 'phase4_scutage', phases: [4], label: 'Scutage and equipment stakes in tournament events', sourcePage: 'Ch.15 pp.312-320' },
  { id: 'phase4_equipment', phases: [4], label: 'Full plate 16, late halberd/longbow, destrier, partial plate barding 12', sourcePage: 'Ch.15 pp.312-320' }
]);

export const getChronologyRulesForYear = year => {
  const phase = getCampaignPhase(year);
  return {
    year: asInt(year),
    phase: phase?.number ?? 0,
    harvestModifier: getChronologyHarvestModifier(year),
    rules: CHRONOLOGY_RULES.filter(rule => rule.phases.includes(phase?.number))
  };
};

export const acknowledgeChronologyRules = (characterValue, input = {}, now) => {
  const { character, state } = ensureState(characterValue);
  const year = asInt(input.year, character.personal?.campaignYear || 767);
  const registry = getChronologyRulesForYear(year);
  const id = safeId(input.transactionId || `chronology:${year}:phase${registry.phase}`);
  const transaction = appendTransaction(state, { id, type: 'chronology_acknowledgment', year, phase: registry.phase, sourcePage: 'Ch.15 pp.286-320', createdAt: iso(now) });
  if (transaction.applied) state.chronologyAcknowledgments = addRecord(state.chronologyAcknowledgments, { ...transaction.entry, ruleIds: registry.rules.map(rule => rule.id), harvestModifier: registry.harvestModifier }, 100);
  return { character, registry, applied: transaction.applied };
};

const outcomeText = check => check.critical ? 'critical' : check.fumble ? 'fumble' : check.success ? 'success' : 'failure';

export const resolveSkillProcedure = (characterValue, input = {}, now) => {
  const { character, state } = ensureState(characterValue);
  const skillId = String(input.skillId || '');
  const roll = asInt(input.roll);
  let target = asInt(input.value, character.skills?.[skillId] || 0);
  let secondaryCheck = null;
  let consequence = 'check_only';
  let modifier = asInt(input.modifier);
  let sourcePage = 'Ch.5 pp.96-106';

  if (skillId === 'swimming') {
    modifier -= Math.max(0, asInt(input.armor));
    modifier -= input.encumbrance === 'heavy' ? 10 : input.encumbrance === 'light' ? 5 : 0;
  } else if (skillId === 'hunting' && !input.hasDogs) modifier -= 5;
  else if (skillId === 'heraldry') modifier += Math.floor(Math.max(0, asInt(input.targetGlory)) / 1000);
  else if (['recognize', 'courtesy', 'dancing', 'eloquence'].includes(skillId) && input.gmAllowsGloryModifier) modifier += Math.floor(Math.max(0, asInt(input.targetGlory)) / 1000);
  else if (skillId === 'languages') modifier += input.languageDifficulty === 'latin' ? -5 : input.languageDifficulty === 'slav' ? -10 : input.languageDifficulty === 'learned' ? -15 : 0;
  target += modifier;
  const check = resolveD20Roll(roll, target);

  if (skillId === 'swimming') consequence = check.critical ? 'move_double' : check.success ? 'move_normal' : check.fumble ? 'drowning_pending' : 'no_progress';
  if (skillId === 'falconry') consequence = check.critical ? 'prey_and_return' : check.success ? 'prey' : check.fumble ? 'bird_lost_or_dead' : 'miss';
  if (skillId === 'gaming') {
    if (input.opponentRoll === undefined || input.opponentValue === undefined) throw new RangeError('Gaming은 상대의 skill과 d20 결과가 필요합니다.');
    const opponent = resolveD20Roll(asInt(input.opponentRoll), asInt(input.opponentValue));
    secondaryCheck = opponent;
    consequence = check.success === opponent.success ? 'compare_roll_difference' : check.success ? 'win' : 'lose';
  }
  if (skillId === 'readingWriting') {
    if (input.languageRoll === undefined || input.languageValue === undefined) throw new RangeError('비라틴어 독해에는 Languages 판정을 함께 기록해야 합니다.');
    secondaryCheck = resolveD20Roll(asInt(input.languageRoll), asInt(input.languageValue));
    consequence = check.success && secondaryCheck.success ? 'read_or_write' : 'not_understood';
  }

  const id = safeId(input.transactionId || `skill:${skillId}:${character.personal?.campaignYear || 767}:${state.skillResults.length + 1}`);
  const transaction = appendTransaction(state, { id, type: 'skill_procedure', skillId, sourcePage, createdAt: iso(now) });
  if (!transaction.applied) return { character, result: state.skillResults.find(item => item.id === id), applied: false };
  const result = { id, skillId, roll, target, modifier, outcome: outcomeText(check), check, secondaryCheck, consequence, sourcePage, note: String(input.note || ''), createdAt: transaction.entry.createdAt };
  state.skillResults = addRecord(state.skillResults, result);
  if (check.success) character.skillsChecked = { ...(character.skillsChecked || {}), [skillId]: true };
  return { character, result, applied: true };
};

export const resolveFeatProcedure = (characterValue, input = {}, now) => {
  const { character, state } = ensureState(characterValue);
  if (!input.gmApproved) throw new RangeError('Feat는 GM이 허용한 불가능에 가까운 행동에만 사용할 수 있습니다.');
  const statistic = asInt(input.statistic);
  const check = resolveFeatRoll(asInt(input.roll), statistic);
  const id = safeId(input.transactionId || `feat:${character.personal?.campaignYear || 767}:${state.featResults.length + 1}`);
  const transaction = appendTransaction(state, { id, type: 'feat', sourcePage: 'Ch.6 p.108', createdAt: iso(now) });
  if (!transaction.applied) return { character, result: state.featResults.find(item => item.id === id), applied: false };
  const result = { id, statistic, featTarget: Math.round(statistic / 2), roll: asInt(input.roll), outcome: check.success ? 'critical' : 'fumble', sourcePage: 'Ch.6 p.108', note: String(input.note || ''), createdAt: transaction.entry.createdAt };
  state.featResults = addRecord(state.featResults, result, 250);
  return { character, result, applied: true };
};

export const startJourney = (characterValue, input = {}, now) => {
  const { character, state } = ensureState(characterValue);
  const id = safeId(input.id || `journey:${character.personal?.campaignYear || 767}:${state.journeys.length + 1}`);
  const existing = state.journeys.find(item => item.id === id);
  if (existing) return { character, journey: existing, applied: false };
  if (!input.destination || asInt(input.distance) < 1) throw new RangeError('목적지와 이동 거리를 입력하세요.');
  const journey = {
    id, destination: String(input.destination), totalDistance: asInt(input.distance), remainingDistance: asInt(input.distance),
    roadType: input.roadType || 'localRoad', pace: input.pace || 'normal', routeKnown: input.routeKnown !== false,
    days: [], status: input.routeKnown === false ? 'awaiting_route_check' : 'active', sourcePage: 'Ch.6 pp.111-114', createdAt: iso(now)
  };
  state.journeys = addRecord(state.journeys, journey, 250);
  appendTransaction(state, { id: `${id}:start`, type: 'journey_start', sourcePage: journey.sourcePage, createdAt: journey.createdAt });
  return { character, journey, applied: true };
};

export const resolveJourneyDay = (characterValue, input = {}, now) => {
  const { character, state } = ensureState(characterValue);
  const journey = state.journeys.find(item => item.id === input.journeyId && item.status !== 'complete');
  if (!journey) throw new RangeError('진행 중인 여행을 선택하세요.');
  const dayNumber = journey.days.length + 1;
  const id = safeId(input.transactionId || `${journey.id}:day:${dayNumber}`);
  const transaction = appendTransaction(state, { id, type: 'journey_day', sourcePage: journey.sourcePage, createdAt: iso(now) });
  if (!transaction.applied) return { character, journey, day: journey.days.find(item => item.id === id), applied: false };
  let distance = 0;
  let route = null;
  let forced = null;
  if (journey.status === 'awaiting_route_check') {
    const check = resolveD20Roll(asInt(input.huntingRoll), asInt(input.huntingValue, character.skills?.hunting || 0));
    route = resolveUnknownRoute(outcomeText(check));
    if (route.lost) journey.status = 'lost';
    else if (route.delayDays) journey.status = 'delayed';
    else {
      journey.status = 'active';
      journey.pace = route.pace;
      distance = getTravelDistance(journey.roadType, route.pace);
    }
  } else if (journey.pace === 'forcedMarch') {
    forced = resolveForcedMarch({ roll: asInt(input.conRoll), con: asInt(input.con, character.attributes?.con), movementRate: asInt(input.movementRate), roadType: journey.roadType, traveler: input.traveler || 'human' }, input.rng);
    distance = forced.distance;
  } else distance = getTravelDistance(journey.roadType, journey.pace);
  journey.remainingDistance = Math.max(0, journey.remainingDistance - distance);
  if (journey.remainingDistance === 0) journey.status = 'complete';
  const day = { id, dayNumber, distance, route, forced, remainingDistance: journey.remainingDistance, status: journey.status, createdAt: transaction.entry.createdAt };
  journey.days.push(day);
  return { character, journey, day, applied: true };
};

const topCountAtLeast = (values, count, target) => values.filter(value => asInt(value) >= target).length >= count;
const skillValues = (character, keys) => keys.map(key => character.skills?.[key] || 0);
const ordinary = ['awareness', 'chirurgery', 'faerieLore', 'firstAid', 'folkLore', 'horsemanship', 'hunting', 'industry', 'recognize', 'religion', 'stewardship', 'swimming'];
const courtly = ['courtesy', 'dancing', 'eloquence', 'falconry', 'gaming', 'heraldry', 'intrigue', 'languages', 'playInstruments', 'readingWriting', 'romance', 'singing'];
const melee = ['axe', 'bludgeon', 'dagger', 'spear', 'sword', 'unarmed'];

export const CAREER_ROLES = Object.freeze({
  knight: { label: 'Knight', glory: 1000, maintenance: 'ordinary', sourcePage: 'Ch.11 p.184' },
  companion: { label: 'Companion', glory: 0, maintenance: 'ordinary', sourcePage: 'Ch.11 p.185' },
  castellan: { label: 'Castellan', glory: 75, maintenance: 'ordinary', sourcePage: 'Ch.11 p.185' },
  constable: { label: 'Constable', glory: 75, maintenance: 'ordinary', sourcePage: 'Ch.11 p.185' },
  marshal: { label: 'Marshal', glory: 75, maintenance: 'ordinary', sourcePage: 'Ch.11 p.185' },
  seneschal: { label: 'Seneschal', glory: 75, maintenance: 'ordinary', sourcePage: 'Ch.11 p.185' },
  vicar: { label: 'Vicar', glory: 75, maintenance: 'ordinary', sourcePage: 'Ch.11 p.185' },
  scara: { label: 'Scara', glory: 500, maintenance: 'ordinary', standing: { charlemagne: 1, liegeLord: 1, family: 1, retinue: 1, church: 1, commoners: 1 }, sourcePage: 'Ch.11 p.186' },
  vassal: { label: 'Vassal Knight', glory: 50, maintenance: 'ordinary', standing: { liegeLord: 1 }, sourcePage: 'Ch.11 p.186' },
  banneret: { label: 'Banneret', glory: 100, maintenance: 'rich', standing: { liegeLord: 1, retinue: 1 }, sourcePage: 'Ch.11 p.187' },
  count: { label: 'Count', glory: 350, maintenance: 'superlative', standing: { retinue: 2, family: 2 }, sourcePage: 'Ch.11 p.187' },
  duke: { label: 'Duke', glory: 750, maintenance: 'superlative', standing: { retinue: 3, family: 3 }, sourcePage: 'Ch.11 p.187' },
  lay_abbot: { label: 'Lay Abbot', glory: 50, annualGlory: 50, maintenance: 'rich', standing: { church: 2 }, sourcePage: 'Ch.11 p.188' },
  lay_bishop: { label: 'Lay Bishop', glory: 350, annualGlory: 100, maintenance: 'superlative', standing: { church: 3 }, sourcePage: 'Ch.11 p.188' },
  missus: { label: 'Missus Dominicus', glory: 500, standing: { charlemagne: 1, liegeLord: 1, family: 1, retinue: 1, church: 1, commoners: 1 }, sourcePage: 'Ch.11 p.189' },
  paladin: { label: 'Paladin', glory: 1000, standing: { charlemagne: 3, liegeLord: 3, family: 3, retinue: 3, church: 3, commoners: 3 }, sourcePage: 'Ch.11 p.189' },
  black_knight: { label: 'Black Knight', glory: 0, sourcePage: 'Ch.11 p.190' }
});

export const getCareerEligibility = (character, roleId, input = {}) => {
  const failures = [];
  const req = (condition, label) => { if (!condition) failures.push(label); };
  const honor = asInt(character.passions?.honor);
  const glory = asInt(character.gear?.gloryTotal);
  const standing = character.standings || {};
  if (!['knight', 'black_knight'].includes(roleId)) req(asInt(standing.charlemagne) >= 6, 'Standing [Charlemagne] 6 for vassalage, inheritance, or promotion');
  if (roleId === 'knight') {
    req(asInt(character.traits?.valorous) >= 13, 'Valorous 13'); req(honor >= 10, 'Honor 10'); req(asInt(standing.liegeLord) >= 10, 'Standing [lord] 10');
    req(asInt(character.skills?.firstAid) >= 10, 'First Aid 10'); req(asInt(character.skills?.horsemanship) >= 10, 'Horsemanship 10'); req(topCountAtLeast(skillValues(character, courtly), 2, 10), 'two courtly skills 10');
    req(asInt(character.skills?.battle) >= 10, 'Battle 10'); req(topCountAtLeast(skillValues(character, melee), 2, 13), 'two melee skills 13'); req(asInt(character.skills?.lance) >= 10, 'Lance 10');
  } else if (roleId === 'companion') {
    req(list(input.sponsorIds).length >= 2, 'two unrelated knight/scara/paladin sponsors'); req(Boolean(input.oathRecorded), 'public oath');
  } else if (['castellan', 'constable', 'marshal', 'seneschal', 'vicar'].includes(roleId)) {
    const triples = { castellan: ['prudent', 'siege', 'stewardship'], constable: ['energetic', 'courtesy', 'stewardship'], marshal: ['valorous', 'battle', 'siege'], seneschal: ['energetic', 'stewardship', 'courtesy'], vicar: ['just', 'intrigue', 'folkLore'] }[roleId];
    const first = character.traits?.[triples[0]] ?? character.skills?.[triples[0]]; const second = character.skills?.[triples[1]]; const third = character.skills?.[triples[2]];
    req(asInt(first) >= 16, `${triples[0]} 16`); req(asInt(second) >= 16, `${triples[1]} 16`); req(asInt(third) >= 13, `${triples[2]} 13`); req(asInt(standing.liegeLord) >= 16 && asInt(standing.retinue) >= 16, 'Standing [lord/retinue] 16');
  } else if (roleId === 'scara') {
    req(asInt(character.personal?.age) < 30, 'age under 30'); req(asInt(character.traits?.valorous) >= 16, 'Valorous 16'); req(asInt(character.passions?.loveCharlemagne) >= 13 && honor >= 13, 'Love [Charlemagne] and Honor 13'); req(asInt(standing.charlemagne) >= 13, 'Standing [Charlemagne] 13');
    req(asInt(character.skills?.firstAid) >= 13 && asInt(character.skills?.horsemanship) >= 13, 'First Aid and Horsemanship 13'); req(topCountAtLeast(skillValues(character, ordinary), 2, 13), 'two ordinary skills 13'); req(topCountAtLeast(skillValues(character, courtly), 2, 13), 'two courtly skills 13'); req(asInt(character.skills?.battle) >= 13 && asInt(character.skills?.lance) >= 13, 'Battle and Lance 13'); req(topCountAtLeast(skillValues(character, melee), 2, 16), 'two melee skills 16'); req(glory >= 4000, 'Glory 4000'); req(Boolean(input.hasIdeal), 'an Ideal');
  } else if (roleId === 'vassal') req(['inherited', 'granted', 'gifted', 'conquered'].includes(input.landSource), 'land inherited, granted, gifted, or conquered');
  else if (roleId === 'banneret') {
    req(['inherited', 'granted', 'gifted', 'conquered'].includes(input.landSource), 'land inherited, granted, gifted, or conquered');
    req(asInt(input.vassalKnights) >= 3, 'three vassal knights');
  }
  else if (roleId === 'count') {
    req(Boolean(input.charlemagneAppointment), 'appointed by Charlemagne'); req(asInt(character.traits?.honest) >= 13 && asInt(character.traits?.just) >= 13 && asInt(character.traits?.valorous) >= 16, 'Honest 13, Just 13, Valorous 16'); req(asInt(character.passions?.loveCharlemagne) >= 16 && honor >= 16, 'Love [Charlemagne] and Honor 16'); req(asInt(standing.charlemagne) >= 16, 'Standing [Charlemagne] 16'); req(asInt(character.skills?.intrigue) >= 13 && asInt(character.skills?.battle) >= 13 && topCountAtLeast(skillValues(character, melee), 2, 16), 'Intrigue/Battle 13 and two melee 16'); req(glory >= 6000, 'Glory 6000');
  } else if (roleId === 'duke') {
    req(Boolean(input.charlemagneAppointment), 'appointed by Charlemagne'); req(stateRole(character) === 'count', 'already a Count'); req(asInt(character.traits?.energetic) >= 15 && asInt(character.traits?.valorous) >= 16, 'Energetic 15 and Valorous 16'); req(asInt(character.passions?.loveCharlemagne) >= 18 && honor >= 16, 'Love [Charlemagne] 18 and Honor 16'); req(asInt(standing.charlemagne) >= 18, 'Standing [Charlemagne] 18'); req(asInt(character.skills?.intrigue) >= 16 && asInt(character.skills?.battle) >= 16 && asInt(character.skills?.siege) >= 16, 'Intrigue, Battle, Siege 16'); req(glory >= 7000, 'Glory 7000');
  }
  else if (roleId === 'lay_abbot') {
    req(asInt(character.passions?.loveCharlemagne) >= 16 && honor >= 16 && asInt(standing.church) >= 16, 'Love [Charlemagne], Honor, Church Standing 16'); req(asInt(character.skills?.languages) >= 10 && asInt(character.skills?.religion) >= 10 && asInt(character.skills?.readingWriting) >= 10, 'Languages, Religion, Reading & Writing 10'); req(glory >= 5000, 'Glory 5000'); req(Boolean(input.religiousIdeal), 'Religious Ideal');
  } else if (roleId === 'lay_bishop') {
    req(asInt(character.passions?.loveCharlemagne) >= 16 && honor >= 16 && asInt(standing.charlemagne) >= 16, 'Love [Charlemagne], Honor, Charlemagne Standing 16'); req(asInt(character.skills?.intrigue) >= 13 && asInt(character.skills?.languages) >= 10 && asInt(character.skills?.religion) >= 10 && asInt(character.skills?.readingWriting) >= 10, 'Intrigue 13 and clerical skills 10'); req(glory >= 6000, 'Glory 6000'); req(Boolean(input.religiousIdeal), 'Religious Ideal');
  } else if (roleId === 'missus') {
    req(['count', 'lay_abbot', 'lay_bishop'].includes(stateRole(character)), 'Count, Lay Abbot, or Lay Bishop'); req(asInt(character.traits?.energetic) >= 16 && asInt(character.traits?.just) >= 16 && honor >= 16, 'Energetic, Just, Honor 16'); req(asInt(character.skills?.awareness) >= 16 && asInt(character.skills?.folkLore) >= 10 && asInt(character.skills?.eloquence) >= 10 && asInt(character.skills?.intrigue) >= 10, 'Missus skills');
  } else if (roleId === 'paladin') {
    req(Boolean(input.sponsorAndVacancy), 'Paladin sponsor and vacancy'); req(asInt(character.traits?.valorous) >= 20 && asInt(character.passions?.loveCharlemagne) >= 16 && honor >= 20 && asInt(standing.charlemagne) >= 16, 'Valorous 20, Love 16, Honor 20, Standing 16'); req(asInt(character.skills?.horsemanship) >= 16 && topCountAtLeast(skillValues(character, ordinary), 2, 16) && topCountAtLeast(skillValues(character, courtly), 2, 16), 'Horsemanship and four general/courtly skills 16'); req(asInt(character.skills?.battle) >= 16 && asInt(character.skills?.lance) >= 16 && topCountAtLeast(skillValues(character, melee), 2, 20), 'Battle/Lance 16 and two melee 20'); req(glory >= 8000, 'Glory 8000'); req(Boolean(input.chivalrousIdeal), 'Chivalrous Ideal');
  } else if (roleId === 'black_knight') req(Boolean(input.gmDirected), 'explicit GM direction');
  return { eligible: failures.length === 0, failures };
};

const stateRole = character => character.campaign?.rulebookProcedures?.career?.activeRoleId || null;

export const appointCareer = (characterValue, input = {}, now) => {
  let { character, state } = ensureState(characterValue);
  const role = CAREER_ROLES[input.roleId];
  if (!role) throw new RangeError('원문 경력을 선택하세요.');
  const eligibility = getCareerEligibility(character, input.roleId, input);
  if (!eligibility.eligible) throw new RangeError(`요건 미충족: ${eligibility.failures.join(', ')}`);
  const year = asInt(input.year, character.personal?.campaignYear || 767);
  const id = safeId(input.transactionId || `career:${input.roleId}:${year}`);
  const tx = appendTransaction(state, { id, type: 'career_appointment', roleId: input.roleId, sourcePage: role.sourcePage, createdAt: iso(now) });
  if (!tx.applied) return { character, role, eligibility, applied: false };
  const appointmentGlory = ['castellan', 'constable', 'marshal', 'seneschal', 'vicar'].includes(input.roleId)
    ? ({ banneret: 75, count: 150, king: 300 }[input.appointingRank] || 0)
    : input.roleId === 'companion' ? Math.floor(Math.max(0, asInt(input.companionGlory)) / 10) : role.glory;
  if (['castellan', 'constable', 'marshal', 'seneschal', 'vicar'].includes(input.roleId) && !appointmentGlory) throw new RangeError('임명한 주군의 원문 등급을 선택하세요.');
  if (appointmentGlory) recordGloryAward(character, { id: `${id}:glory`, year, amount: appointmentGlory, title: `${role.label} 임명`, narrative: 'Chapter 11의 임명 영광을 기록했습니다.', sourceRuleId: 'CAREER-001', sourcePage: role.sourcePage });
  if (input.roleId === 'companion') {
    const ownHonor = asInt(character.passions?.honor);
    const sharedHonor = Math.min(ownHonor + 1, asInt(input.companionHonor) + 1);
    recordHonorChange(character, { id: `${id}:honor`, year, amount: sharedHonor - ownHonor, title: 'Companionship oath', sourceRuleId: 'CAREER-COMPANION-001', sourcePage: role.sourcePage });
    character.campaign.rulebookProcedures.career.companion = { characterId: String(input.companionId || ''), glory: asInt(input.companionGlory), honor: sharedHonor, commonHeirs: true, consentRequiredForRetirement: true };
  }
  Object.entries(role.standing || {}).forEach(([standingKey, amount]) => recordStandingChange(character, { id: `${id}:standing:${standingKey}`, year, standingKey, amount, title: `${role.label} 임명`, sourceRuleId: 'CAREER-001', sourcePage: role.sourcePage }));
  if (role.maintenance) character.personal.maintenance = role.maintenance;
  if (input.roleId === 'paladin') character.attributes.con = asInt(character.attributes?.con) + 5;
  if (input.roleId === 'black_knight') {
    character.skills.intrigue = asInt(character.skills?.intrigue) + 5;
    character.skills.bow = asInt(character.skills?.bow) + 3;
    character.skills.crossbow = asInt(character.skills?.crossbow) + 3;
  }
  state.career.activeRoleId = input.roleId;
  state.career.history.push({ id, roleId: input.roleId, action: 'appointed', year, sourcePage: role.sourcePage, createdAt: tx.entry.createdAt });
  appendChronicleEvent(character, { id: `${id}:chronicle`, year, title: `${role.label} 임명`, narrative: `${character.personal?.name || '기사'}가 ${role.label} 직위에 올랐습니다.`, sourceRuleId: 'CAREER-001', sourcePage: role.sourcePage });
  return { character, role, eligibility, applied: true };
};

export const getCareerAnnualObligations = character => {
  const roleId = stateRole(character);
  const obligations = {
    knight: ['serve and protect the liege; maintain knightly equipment'],
    companion: ['mutual support; ransom or liberate the companion; use the lower Honor'],
    castellan: ['serve the household and castle all year'], constable: ['serve the household all year'], marshal: ['serve the household and field forces all year'], seneschal: ['serve the household all year'], vicar: ['deliver justice for the county'],
    scara: ['serve the royal court and undertake difficult missions'], vassal: ['military aid and counsel to the liege'], banneret: ['bring vassal and household knights when summoned'],
    count: ['minimum £84 annual support; hunt, feast, local tournament, command and counsel'], duke: ['lead the duchy; attend May Fields and Winter Court when summoned'],
    lay_abbot: ['austerity and prayer; send knights to the royal banner'], lay_bishop: ['maintain episcopal duties and royal obligations'], missus: ['complete the current royal mission'], paladin: ['royal service and leadership in war'], black_knight: ['GM-directed antagonist role']
  };
  return { roleId, obligations: obligations[roleId] || [], sourcePage: 'Ch.11 pp.184-190' };
};

export const applyAnnualCareerBenefits = (characterValue, input = {}, now) => {
  const { character, state } = ensureState(characterValue);
  const roleId = state.career.activeRoleId;
  const role = CAREER_ROLES[roleId];
  if (!role) throw new RangeError('활성 경력이 없습니다.');
  const year = asInt(input.year, character.personal?.campaignYear || 767);
  const id = safeId(input.transactionId || `career:${roleId}:annual:${year}`);
  const tx = appendTransaction(state, { id, type: 'career_annual', roleId, sourcePage: role.sourcePage, createdAt: iso(now) });
  if (!tx.applied) return { character, amount: 0, applied: false };
  const holdingCap = roleId === 'duke' ? 150 : ['count'].includes(roleId) ? 100 : Number.POSITIVE_INFINITY;
  const holdingGlory = Math.min(holdingCap, Math.max(0, Number(input.holdingIncomeLivres) || 0));
  const amount = Math.max(0, asInt(role.annualGlory)) + (['vassal', 'banneret', 'count', 'duke'].includes(roleId) ? holdingGlory : 0);
  if (amount) recordGloryAward(character, { id: `${id}:glory`, year, amount, title: `${role.label} 연간 영광`, narrative: '보유 직위와 영지의 인쇄된 연간 영광입니다.', sourceRuleId: 'CAREER-ANNUAL-001', sourcePage: role.sourcePage });
  state.career.annual = { id, roleId, year, amount, obligations: getCareerAnnualObligations(character).obligations, sourcePage: role.sourcePage };
  return { character, amount, applied: true };
};

export const retireCareer = (characterValue, input = {}, now) => {
  let { character, state } = ensureState(characterValue);
  const roleId = state.career.activeRoleId;
  const role = CAREER_ROLES[roleId];
  if (!role) throw new RangeError('활성 경력이 없습니다.');
  if (roleId === 'black_knight') throw new RangeError('Black Knight는 원문상 은퇴할 수 없습니다.');
  if (roleId === 'companion' && !input.companionConsent) throw new RangeError('Companion의 동의가 필요합니다.');
  if (roleId === 'missus' && input.onMission) throw new RangeError('Missus Dominicus는 임무 중 은퇴할 수 없습니다.');
  if (roleId === 'paladin' && !['monk', 'hermit'].includes(input.route)) throw new RangeError('Paladin은 monk 또는 hermit로만 은퇴할 수 있습니다.');
  if (['knight', 'vassal', 'banneret'].includes(roleId)) {
    const standingCheck = resolveD20Roll(asInt(input.standingRoll), asInt(character.standings?.liegeLord));
    if (!standingCheck.success) throw new RangeError('Standing [lord] 판정에 성공해 은퇴 허가를 받아야 합니다.');
  }
  if (roleId === 'scara') {
    const standingCheck = resolveD20Roll(asInt(input.standingRoll), asInt(character.standings?.charlemagne) - 10);
    if (!standingCheck.success) throw new RangeError('Standing [Charlemagne] -10 판정에 성공해 특별 은퇴 허가를 받아야 합니다.');
  }
  const year = asInt(input.year, character.personal?.campaignYear || 767);
  const id = safeId(input.transactionId || `career:${roleId}:retire:${year}`);
  const tx = appendTransaction(state, { id, type: 'career_retirement', roleId, definitive: Boolean(input.definitive), sourcePage: role.sourcePage, createdAt: iso(now) });
  if (!tx.applied) return { character, applied: false };
  state.career.history.push({ id, roleId, action: 'retired', year, definitive: Boolean(input.definitive), route: input.route || null, sourcePage: role.sourcePage, createdAt: tx.entry.createdAt });
  state.career.activeRoleId = null;
  if (input.definitive) {
    const prepared = prepareCareerEnd(character, { type: 'retirement', cause: `${role.label} 은퇴`, year, sourceRuleId: 'CAREER-RETIREMENT-001', sourcePage: role.sourcePage, eventId: `${id}:lifecycle`, timestamp: now });
    if (!prepared.prepared) throw new RangeError('현재 생애 상태에서는 확정 은퇴를 준비할 수 없습니다.');
    character = resolveCareerEnd(prepared.character, { timestamp: now }).character;
  }
  return { character, applied: true };
};

export const recordPrintedGlorySource = (characterValue, input = {}, now) => {
  const { character, state } = ensureState(characterValue);
  const sourceType = String(input.sourceType || '');
  let amount;
  let title;
  if (sourceType === 'marriage_frankish') { amount = Math.min(1000, Math.max(0, asInt(input.spouseGlory))); title = 'Frankish marriage'; }
  else if (sourceType === 'marriage_converted_pagan') { amount = Math.min(1000, Math.floor(Math.max(0, asInt(input.spouseGlory)) / 100) * Math.max(0, asInt(input.spouseHonor))); title = 'Marriage to converted pagan'; }
  else if (sourceType === 'conversion') { amount = Math.max(0, asInt(character.skills?.eloquence)) + Math.max(0, asInt(character.skills?.religion)) + Math.max(0, asInt(character.passions?.honor)) + Math.max(0, asInt(input.convertHonor)) * 2; title = 'Conversion'; }
  else if (sourceType === 'miracle') { amount = 100; title = 'Genuine miracle'; }
  else if (sourceType === 'conspicuous_spending') { amount = Math.max(0, Number(input.livres) || 0); title = 'Conspicuous spending'; }
  else if (sourceType === 'holdings') { amount = Math.min(100, Math.max(0, Number(input.incomeLivres) || 0) + Math.max(0, Number(input.castleDefenseValue) || 0)); title = 'Annual holdings'; }
  else if (sourceType === 'enchanted_item') { amount = Math.max(0, asInt(input.bonusPoints)) * 5 + Math.max(0, asInt(input.specialPowers)) * 5 + Math.max(0, asInt(input.legendaryFeats)) * 3; title = 'Enchanted item'; }
  else if (sourceType === 'notable_statistics') { amount = list(input.values).map(Number).filter(value => value > 15).reduce((sum, value) => sum + value, 0); title = 'Notable statistics'; }
  else if (sourceType === 'ideals') { amount = Math.max(0, asInt(input.qualifyingIdeals)) * 100; title = 'Annual Ideals'; }
  else throw new RangeError('인쇄된 Glory 원천을 선택하세요.');
  const year = asInt(input.year, character.personal?.campaignYear || 767);
  const id = safeId(input.transactionId || `printed-glory:${sourceType}:${year}:${state.transactions.length + 1}`);
  const tx = appendTransaction(state, { id, type: 'printed_glory', sourceType, amount, sourcePage: 'Ch.4 pp.87-91', createdAt: iso(now) });
  if (!tx.applied) return { character, amount, applied: false };
  recordGloryAward(character, { id: `${id}:ledger`, year, amount, title, narrative: String(input.note || ''), sourceRuleId: 'GLORY-PRINTED-001', sourcePage: 'Ch.4 pp.87-91' });
  return { character, amount, applied: true };
};

export const activateIdeal = (characterValue, input = {}, now) => {
  const { character, state } = ensureState(characterValue);
  const idealId = String(input.idealId || '');
  if (!['chivalrous', 'religious', 'romantic'].includes(idealId)) throw new RangeError('원문 Ideal을 선택하세요.');
  const year = asInt(input.year, character.personal?.campaignYear || 767);
  const id = safeId(input.transactionId || `ideal:${idealId}:${year}`);
  const tx = appendTransaction(state, { id, type: 'ideal_activation', idealId, sourcePage: 'Ch.11 pp.190-191', createdAt: iso(now) });
  if (!tx.applied) return { character, ideal: state.ideals[idealId], applied: false };
  const ideal = { id: idealId, active: true, startedYear: year, annualGiftPaidYear: null, annualTaskYear: null, rerollAdventureIds: [], sourcePage: 'Ch.11 pp.190-191' };
  state.ideals[idealId] = ideal;
  return { character, ideal, applied: true };
};

export const recordRomanticIdealDuty = (characterValue, input = {}, now) => {
  let { character, state } = ensureState(characterValue);
  const ideal = state.ideals.romantic;
  if (!ideal?.active) throw new RangeError('Romantic Ideal이 활성화되어 있지 않습니다.');
  const year = asInt(input.year, character.personal?.campaignYear || 767);
  if (!String(input.task || '').trim()) throw new RangeError('연인이 부여한 연간 과업을 기록하세요.');
  const id = safeId(input.transactionId || `ideal:romantic:duty:${year}`);
  const tx = appendTransaction(state, { id, type: 'romantic_ideal_duty', sourcePage: 'Ch.11 p.191', createdAt: iso(now) });
  if (!tx.applied) return { character, ideal, applied: false };
  const paid = recordEconomyTransfer(character, { id: `${id}:gift`, transactionId: `${id}:gift`, type: 'romantic_ideal_gift', label: 'Romantic Ideal 연간 선물', amountDeniers: -toDeniers(1), year, sourceRuleId: 'IDEAL-ROMANTIC-001', sourcePage: 'Ch.11 p.191' });
  character = paid.character;
  const nextState = character.campaign.rulebookProcedures;
  nextState.ideals.romantic.annualGiftPaidYear = year;
  nextState.ideals.romantic.annualTaskYear = year;
  nextState.ideals.romantic.task = String(input.task).trim();
  return { character, ideal: nextState.ideals.romantic, applied: true };
};

export const consumeRomanticIdealReroll = (characterValue, input = {}, now) => {
  const { character, state } = ensureState(characterValue);
  const ideal = state.ideals.romantic;
  const adventureId = safeId(input.adventureId);
  if (!ideal?.active || !adventureId) throw new RangeError('활성 Romantic Ideal과 모험 ID가 필요합니다.');
  if (ideal.rerollAdventureIds.includes(adventureId)) return { character, applied: false };
  const id = safeId(input.transactionId || `ideal:romantic:reroll:${adventureId}`);
  const tx = appendTransaction(state, { id, type: 'romantic_ideal_reroll', adventureId, sourcePage: 'Ch.11 p.191', createdAt: iso(now) });
  if (tx.applied) ideal.rerollAdventureIds.push(adventureId);
  return { character, applied: tx.applied };
};

export const getChivalrousNaturalArmor = character => {
  const state = sanitizeRulebookProcedureState(character.campaign?.rulebookProcedures);
  const total = ['energetic', 'generous', 'just', 'merciful', 'modest', 'valorous'].reduce((sum, key) => sum + asInt(character.traits?.[key]), 0);
  const lost = list(character.campaign?.conditions).some(condition => condition.type === 'natural_armor_lost' && condition.expiresAfterWinter);
  return state.ideals.chivalrous?.active && total >= 90 && asInt(character.passions?.honor) >= 16 && !lost ? 3 : 0;
};

export const getStandingThresholdConsequence = (standingKey, value) => {
  const score = asInt(value);
  if (score > 5) return null;
  const zero = score === 0;
  const consequences = {
    charlemagne: zero ? 'degraded_out_of_play' : 'no_vassal_inheritance_or_promotion',
    liegeLord: zero ? 'feudal_contract_broken_fiefs_claimed' : 'extra_services_double_gifts',
    family: zero ? 'family_denounces_usurping_bastard' : 'estranged_from_family',
    retinue: zero ? 'retinue_leaves_or_sells_out' : 'retinue_corrupt_or_disobedient',
    church: zero ? 'excommunicated_out_of_play' : 'annual_donation_interdict_or_pilgrimage',
    commoners: zero ? 'rebellion_no_fief_income' : 'half_fief_income_and_banditry'
  };
  return consequences[standingKey] || null;
};

export const recordStandingGift = (characterValue, input = {}, now) => {
  let { character } = ensureState(characterValue);
  const standingKey = String(input.standingKey || '');
  const giftLivres = Math.max(0, Number(input.giftLivres) || 0);
  const unit = standingKey === 'charlemagne' ? 100 : 10;
  const whole = Math.floor(giftLivres / unit);
  const remainder = giftLivres % unit;
  let amount = whole;
  if (standingKey === 'charlemagne' && remainder > 0 && input.roll !== undefined) {
    const chance = Math.floor((remainder / unit) * 20);
    if (asInt(input.roll) <= chance) amount += 1;
  }
  if (amount < 1) throw new RangeError('이 선물은 Standing 1점을 보장하지 않으며, 부분 선물에는 d20 판정이 필요합니다.');
  const year = asInt(input.year, character.personal?.campaignYear || 767);
  const id = safeId(input.transactionId || `standing-gift:${standingKey}:${year}:${giftLivres}`);
  const paid = recordEconomyTransfer(character, { id: `${id}:economy`, transactionId: `${id}:economy`, type: 'standing_gift', label: `Standing [${standingKey}] 선물`, amountDeniers: -toDeniers(giftLivres), year, sourceRuleId: 'STANDING-GIFT-001', sourcePage: 'Ch.4 pp.92-94' });
  character = paid.character;
  const entry = recordStandingChange(character, { id: `${id}:standing`, year, standingKey, amount, title: '선물로 얻은 Standing', sourceRuleId: 'STANDING-GIFT-001', sourcePage: 'Ch.4 pp.92-94' });
  recordGloryAward(character, { id: `${id}:glory`, year, amount: giftLivres, title: '과시적 선물', narrative: '선물 지출 £1당 Glory 1점을 기록했습니다.', sourceRuleId: 'GLORY-SPENDING-001', sourcePage: 'Ch.4 p.90' });
  const consequence = getStandingThresholdConsequence(standingKey, entry.after);
  const nextState = character.campaign.rulebookProcedures;
  if (consequence) nextState.standingConsequences = addRecord(nextState.standingConsequences, { id: `${id}:threshold`, standingKey, value: entry.after, consequence, sourcePage: 'Ch.4 pp.92-94', createdAt: iso(now) });
  return { character, standing: entry, consequence, applied: paid.applied };
};

export const recordSourcedStandingChange = (characterValue, input = {}, now) => {
  const { character } = ensureState(characterValue);
  const standingKey = String(input.standingKey || '');
  const amount = asInt(input.amount);
  if (!Object.hasOwn(character.standings || {}, standingKey) || amount === 0) throw new RangeError('Standing 항목과 0이 아닌 변화량을 입력하세요.');
  if (!String(input.reason || '').trim()) throw new RangeError('원문 사건 또는 행동의 원인을 기록하세요.');
  const year = asInt(input.year, character.personal?.campaignYear || 767);
  const id = safeId(input.transactionId || `standing-change:${standingKey}:${year}:${character.campaign.rulebookProcedures.standingConsequences.length + 1}`);
  const existing = list(character.campaign.standingLedger).find(item => item.id === id);
  if (existing) return { character, standing: existing, consequence: getStandingThresholdConsequence(standingKey, existing.after), applied: false };
  const entry = recordStandingChange(character, { id, year, standingKey, amount, title: String(input.reason), narrative: String(input.note || ''), sourceRuleId: String(input.sourceRuleId || 'STANDING-CHANGE-001'), sourcePage: String(input.sourcePage || 'Ch.4 pp.92-94') });
  const consequence = getStandingThresholdConsequence(standingKey, entry.after);
  if (consequence) {
    character.campaign.rulebookProcedures.standingConsequences = addRecord(character.campaign.rulebookProcedures.standingConsequences, { id: `${id}:threshold`, standingKey, value: entry.after, consequence, sourcePage: 'Ch.4 pp.92-94', createdAt: iso(now) });
    character.campaign.reputationRestrictions = { ...(character.campaign.reputationRestrictions || {}), [standingKey]: consequence };
    if (standingKey === 'liegeLord' && entry.after === 0) character.campaign.economy.estates = list(character.campaign.economy.estates).map(estate => ({ ...estate, status: 'claimed_by_liege', claimedYear: year }));
    if (standingKey === 'family') character.family = { ...(character.family || {}), relationshipStatus: entry.after === 0 ? 'publicly_denounced' : 'estranged' };
    if (standingKey === 'retinue') character.campaign.economy.retainers = list(character.campaign.economy.retainers).map(retainer => entry.after === 0 && retainer.status === 'active' ? { ...retainer, status: 'left_service', leftYear: year, reason: 'Standing [retinue] reached 0' } : retainer);
    if (['charlemagne', 'church'].includes(standingKey) && entry.after === 0) character.campaign.lifecycle = { ...(character.campaign.lifecycle || {}), status: 'historical', careerStatus: 'historical', activeCharacterId: null, reputationRemoval: { standingKey, transactionId: id, sourcePage: 'Ch.4 pp.92-94' } };
  }
  return { character, standing: entry, consequence, applied: true };
};

export const recordChivalricCombatSettlement = (characterValue, input = {}, now) => {
  let { character, state } = ensureState(characterValue);
  const terms = input.terms;
  if (!['love', 'conquest'].includes(terms)) throw new RangeError('전투 전에 For Love 또는 Conquest 조건에 합의해야 합니다.');
  if (terms === 'love' && !input.agreedByBoth) throw new RangeError('두 기사 모두 동의하지 않으면 원문상 전투 조건은 Conquest입니다.');
  if (!input.winner) throw new RangeError('승자를 기록하세요.');
  const id = safeId(input.transactionId || `chivalric:${character.personal?.campaignYear || 767}:${state.settlements.length + 1}`);
  const tx = appendTransaction(state, { id, type: 'chivalric_combat_settlement', terms, sourcePage: 'Ch.13 p.228', createdAt: iso(now) });
  if (!tx.applied) return { character, settlement: state.settlements.find(item => item.id === id), applied: false };
  if (terms === 'conquest' && !['ransom', 'seize_equipment'].includes(input.conquestChoice)) throw new RangeError('Conquest 승자는 몸값 또는 말·무기·갑옷 압수를 선택해야 합니다.');
  if (terms === 'conquest' && input.conquestChoice === 'ransom') {
    if (!(Number(input.ransomLivres) > 0)) throw new RangeError('GM이 확정한 몸값을 입력하세요.');
    const paid = recordEconomyTransfer(character, { id: `${id}:ransom`, transactionId: `${id}:ransom`, type: 'chivalric_ransom', label: '기사도 전투 몸값', amountDeniers: toDeniers(input.ransomLivres), year: character.personal?.campaignYear, sourceRuleId: 'CHIVALRIC-SETTLEMENT-001', sourcePage: 'Ch.13 p.228' });
    character = paid.character;
  }
  let seizedEquipment = [];
  if (terms === 'conquest' && input.conquestChoice === 'seize_equipment') {
    const itemIds = list(input.seizedEquipment).map(String).filter(Boolean);
    if (!itemIds.length) throw new RangeError('압수한 말·무기·갑옷을 선택하세요.');
    const granted = grantMarketItems(character, { transactionId: `${id}:equipment`, itemIds, type: 'chivalric_spoils', label: 'Conquest 전투 장비 압수', source: 'chapter13_chivalric_conquest', sourceRuleId: 'CHIVALRIC-SETTLEMENT-001', sourcePage: 'Ch.13 p.228' });
    character = granted.character;
    seizedEquipment = granted.equipment.map(item => item.id);
  }
  const settlement = { id, terms, agreedByBoth: terms === 'love' ? true : Boolean(input.agreedByBoth), winner: String(input.winner), conquestChoice: terms === 'conquest' ? input.conquestChoice : null, ransomLivres: terms === 'conquest' && input.conquestChoice === 'ransom' ? Number(input.ransomLivres) : 0, seizedEquipment, sourcePage: 'Ch.13 p.228', createdAt: tx.entry.createdAt };
  character.campaign.rulebookProcedures.settlements = addRecord(character.campaign.rulebookProcedures.settlements, settlement);
  return { character, settlement, applied: true };
};

export const recordChivalricSiegeSettlement = (characterValue, input = {}, now) => {
  let { character, state } = ensureState(characterValue);
  const days = Math.max(0, asInt(input.daysWithoutRelief));
  if (days < 90 && input.surrendered) throw new RangeError('구원군 없이 90일이 지나기 전 자동 항복을 적용할 수 없습니다.');
  const surrendered = days >= 90 || Boolean(input.surrendered);
  const cityValueLivres = Math.max(0, Number(input.cityValueLivres) || 0);
  const taxLivres = surrendered ? cityValueLivres / 5 : 0;
  const id = safeId(input.transactionId || `chivalric-siege:${character.personal?.campaignYear || 767}:${state.settlements.length + 1}`);
  const tx = appendTransaction(state, { id, type: 'chivalric_siege_settlement', sourcePage: 'Ch.13 p.229', createdAt: iso(now) });
  if (!tx.applied) return { character, settlement: state.settlements.find(item => item.id === id), applied: false };
  if (surrendered && !input.fullyEngaged) throw new RangeError('90일 항복 기산은 수비 측이 공성이 fully engaged라고 정한 뒤에만 시작됩니다.');
  if (surrendered && !input.noncombatantRestrictionAccepted) throw new RangeError('비전투원과 도시의 수입원을 파괴하지 않는 기사도 공성 조건을 확인하세요.');
  if (taxLivres > 0) {
    const paid = recordEconomyTransfer(character, { id: `${id}:tax`, transactionId: `${id}:tax`, type: 'siege_plunder_tax', label: '항복 도시 전리품세 1/5', amountDeniers: toDeniers(taxLivres), year: character.personal?.campaignYear, sourceRuleId: 'CHIVALRIC-SIEGE-001', sourcePage: 'Ch.13 p.229' });
    character = paid.character;
  }
  const settlement = { id, fullyEngaged: Boolean(input.fullyEngaged), daysWithoutRelief: days, surrendered, cityValueLivres, taxLivres, noncombatantRestrictionAccepted: Boolean(input.noncombatantRestrictionAccepted), sourcePage: 'Ch.13 p.229', createdAt: tx.entry.createdAt };
  character.campaign.rulebookProcedures.settlements = addRecord(character.campaign.rulebookProcedures.settlements, settlement);
  return { character, settlement, applied: true };
};

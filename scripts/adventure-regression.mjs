import assert from 'node:assert/strict';
import {
  CHAPTER_19_ADVENTURES,
  CHAPTER_19_LONG_ADVENTURES,
  CHAPTER_19_SHORT_FORMS,
  CHAPTER_19_SOLOS,
  CHAPTER_19_TABLES
} from '../src/data/chapter19Data.js';
import {
  acknowledgeAdventureConsequence,
  applyAdventureConsequence,
  beginAdventureBattle,
  beginAdventureChase,
  beginAdventureCombat,
  beginAdventureHunt,
  beginAdventurePersonalityMagic,
  completeAdventureBattleReturn,
  completeAdventureChase,
  completeAdventureCombat,
  completeAdventureHunt,
  completeAdventurePersonalityMagic,
  completeAdventureStage,
  deferAdventure,
  getAdventureTableSubsystemRequirement,
  getCurrentAdventureStage,
  lookupChapter19Table,
  recordAdventureDecision,
  recordAdventureProcedureItem,
  resolveAdventureTable,
  resolveAdventureTest,
  resolveAdventureKnighthood,
  resolveAdventureChaseStage,
  resolveAdventureHuntAction,
  resolveAdventureHuntDiscovery,
  resolveAdventureHuntPrey,
  resumeAdventure,
  sanitizeAdventureLedger,
  skipOptionalAdventureStage,
  startAdventure
} from '../src/rules/adventureRules.js';
import { createEconomyState } from '../src/rules/economyRules.js';
import {
  beginAcceleratedLoversTask,
  beginAmorWinter,
  beginPrayerResolution,
  consummateAmor,
  convertExternalAmorToHate,
  drawLoversTask,
  recordPersonalityGmDecision,
  recordMiracleDecision,
  resolveAmorDiscovery,
  resolveEssai,
  resolveExternalMelancholyRecovery,
  resolveLoversTask,
  resolveMadnessYear,
  resolveDream,
  resolvePersonalityConflict,
  resolveScenarioPassionShock,
  setPotentialAmor,
  startAmor,
  triggerMadness
} from '../src/rules/personalityMagicRules.js';

const makeCharacter = () => {
  const character = {
    personal: { name: '검증 기사', campaignYear: 767, age: 18, personalClass: '종자', maintenance: 'ordinary' },
    attributes: { siz: 14, con: 14, str: 14, dex: 14, app: 12, currentHp: 28 },
    traits: {
      chaste: 12, lustful: 8, energetic: 12, lazy: 8, forgiving: 12, vengeful: 8, generous: 12, selfish: 8,
      honest: 12, deceitful: 8, just: 12, arbitrary: 8, merciful: 12, cruel: 8, modest: 12, proud: 8,
      prudent: 12, reckless: 8, temperate: 12, indulgent: 8, trusting: 12, suspicious: 8, valorous: 15, cowardly: 5
    },
    passions: { honor: 16, loveCharlemagne: 15, loveFamily: 15, loveGod: 15, amor: 12 },
    standings: { charlemagne: 12, liegeLord: 14, family: 14, retinue: 12, church: 12, commoners: 12 },
    skills: {
      awareness: 12, religion: 12, intrigue: 12, hunting: 12, folkLore: 12, siege: 12, battle: 15,
      firstAid: 12, chirurgery: 8, horsemanship: 14, courtesy: 12, eloquence: 12, gaming: 12,
      heraldry: 12, recognize: 12, dancing: 10, singing: 10, faerieLore: 10, stewardship: 12,
      romance: 10, lance: 15, sword: 15, spear: 12, dagger: 10, unarmed: 10, bow: 10, crossbow: 8
    },
    skillsChecked: {}, traitsChecked: {}, passionsChecked: {}, standingsChecked: {},
    gear: { cash: 20, gloryThisGame: 0, gloryTotal: 1000 },
    horses: { warhorse: { type: 'Charger', profileKey: 'charger', hp: 42, armor: 5, status: '건강' } },
    squire: { name: '동료 종자', age: 16, status: '생존' },
    family: { name: '검증 가문', honor: 16, members: [{ id: 'self', name: '검증 기사', relation: '본인', generation: 3, status: '생존' }] },
    journal: {},
    campaign: {
      schemaVersion: 11, saveRevision: 0, adventures: { engineVersion: 1, active: null, history: [] },
      chronicleEvents: [], gloryLedger: [], honorLedger: [], standingLedger: [], familyTimeline: [],
      combat: null, combatHistory: [], skirmish: null, massBattle: null, siege: null,
      skirmishHistory: [], battleHistory: [], siegeHistory: [], captives: [], conditions: [], fortresses: [],
      health: { wounds: [], surgeryNeeded: false, unconscious: false, pendingDeath: null, majorWoundCourage: null, weeklyCare: [] },
      lifecycle: { status: 'active', careerStatus: 'active', activeCharacterId: 'self', primaryCharacterId: 'self', events: [], unresolvedChoices: [] }
    }
  };
  character.campaign.economy = createEconomyState(character);
  return character;
};

const reloadAdventure = character => {
  const reloaded = JSON.parse(JSON.stringify(character));
  reloaded.campaign.adventures = sanitizeAdventureLedger(reloaded.campaign.adventures);
  return reloaded;
};

const confirmStage = character => {
  const stage = getCurrentAdventureStage(character.campaign.adventures.active);
  const recorded = recordAdventureDecision(character, { kind: stage.kind === 'narrative' ? 'narrative' : 'gm', value: 'confirmed', note: `test ${stage.id}` });
  return completeAdventureStage(recorded.character, { confirmed: true }).character;
};

const settlePendingConsequence = characterValue => {
  let character = characterValue;
  const pending = character.campaign.adventures.active?.pendingConsequence;
  if (!pending) return character;
  for (const preset of pending.presets || []) {
    character = applyAdventureConsequence(character, {
      ...preset,
      transactionId: `${pending.id}:${preset.id}`,
      reason: preset.label
    }).character;
  }
  return acknowledgeAdventureConsequence(character, { note: 'canonical source consequence settled' }).character;
};

const resolvePersonalityMagicStage = characterValue => {
  let character = beginAdventurePersonalityMagic(characterValue).character;
  const pending = character.campaign.adventures.active.pendingSubsystem;
  const action = pending.action;
  if (['jewel_relic_prayer', 'humble_blessing', 'adulterous_spouse_prayer', 'devils_bridge_prayer'].includes(action)) {
    character = beginPrayerResolution(character, {
      eligible: true,
      beneficiary: pending.procedure?.beneficiary || 'self_prayer',
      intention: action,
      form: 'normal', place: 'ordinary', faithful: 'none', day: 'ordinary', sacredItem: 'none',
      contextModifier: pending.procedure?.contextModifier || 0,
      contextNote: pending.procedure?.contextNote || '',
      gmUsesTable: false,
      transactionId: `${pending.transactionId}:prayer`,
      sourcePage: `Ch.19 p.${pending.sourcePage}`
    }).character;
  } else if (['jewel_dream', 'humble_dream', 'devils_bridge_dream'].includes(action)) {
    character = resolveDream(character, {
      passionKey: pending.procedure?.passionKey || 'loveGod', passionRoll: 1, religionRoll: 1,
      messageSource: 'source', sourcePage: `Ch.19 p.${pending.sourcePage}`,
      transactionId: `${pending.transactionId}:dream`
    }).character;
  } else if (['humble_passion_conflict', 'wrathful_lord_conflict'].includes(action)) {
    character = resolvePersonalityConflict(character, {
      actorGroup: 'passions', actorKey: 'honor', actorRoll: 1,
      opponentGroup: 'passions', opponentKey: 'loveCharlemagne', opponentRoll: 20,
      transactionId: `${pending.transactionId}:conflict`
    }).character;
  } else if (action === 'wrathful_lord_shock') {
    character = resolveScenarioPassionShock(character, {
      passionKey: 'honor', roll: 1, agingRoll: 20,
      transactionId: `${pending.transactionId}:shock`, sourcePage: 'Ch.19 p.423'
    }).character;
  } else if (action === 'angry_merchant_melancholy') {
    character = resolveExternalMelancholyRecovery(character, {
      subject: 'The Count', healerGroup: 'passions', healerKey: 'honor', healerRoll: 1,
      victimPassionValue: 15, victimRoll: 20, transactionId: `${pending.transactionId}:melancholy`, sourcePage: 'Ch.19 p.410'
    }).character;
  } else if (['noble_hostage_miracle', 'miracle_truth'].includes(action)) {
    character = recordMiracleDecision(character, {
      context: action, chosenResult: 'GM confirmed source result', downstreamState: 'Recorded only',
      transactionId: `${pending.transactionId}:miracle`, sourcePage: `Ch.19 p.${pending.sourcePage}`
    }).character;
  } else if (action === 'pagan_prison_amor') {
    character = recordPersonalityGmDecision(character, {
      type: 'personality_gm_decision', context: 'Pagan princess Amor', decision: 'GM recorded the hidden source result',
      transactionId: `${pending.transactionId}:gm`, sourcePage: 'Ch.19 p.421'
    }).character;
  } else if (action === 'royal_court_amor') {
    character = startAmor(character, { targetName: 'Royal Princess', roll: 6, keep: true, transactionId: `${pending.transactionId}:amor` }).character;
  } else if (action === 'love_conquers_all') {
    character = startAmor(character, { targetName: 'The Lady', roll: 6, keep: true }).character;
    for (let index = 0; index < 3; index += 1) {
      character = beginAcceleratedLoversTask(character, { context: 'love_conquers_all' }).character;
      character = drawLoversTask(character, { roll: index === 0 ? 9 : 11, ignoreDuplicates: true }).character;
      character = resolveLoversTask(character, { testKey: index === 0 ? 'singing' : index === 1 ? 'eloquence' : 'energetic', roll: 1 }).character;
    }
  } else if (action === 'melancholic_paladin') {
    character = resolveExternalMelancholyRecovery(character, {
      subject: 'Melancholic Paladin', healerGroup: 'passions', healerKey: 'loveFamily',
      healerRoll: 1, victimPassionValue: 16, victimRoll: 20, sourcePage: 'Ch.19 p.418'
    }).character;
  } else if (action === 'pagan_lady') {
    character = convertExternalAmorToHate(character, { subject: 'Gudrun', target: 'Gervold', value: 14, reason: 'Convincing betrayal' }).character;
  } else if (action === 'wild_hunt') {
    let result = triggerMadness(character, { passionKey: 'honor', fumbledPassionValue: 16, sourcePage: 'Ch.19 p.431' });
    character = result.character;
    result = resolveMadnessYear(character, {
      conditionId: result.condition.id,
      changes: [{ roll: 1 }, { roll: 3 }, { roll: 6 }, { roll: 12 }],
      recoveryRoll: 6
    });
    character = result.character;
  } else if (action === 'romance_start') {
    character = startAmor(character, { targetName: 'Romance Lady', roll: 6, keep: true }).character;
    character = setPotentialAmor(character, { value: 18, chaste: 15 }).character;
  } else if (action === 'romance_progression') {
    character = beginAmorWinter(character, { giftLivres: 1, romanceRoll: 1 }).character;
    character = drawLoversTask(character, { roll: 9 }).character;
    character = resolveLoversTask(character, { testKey: 'singing', roll: 9 }).character;
  } else if (action === 'romance_essai') {
    character = resolveEssai(character, { chasteRoll: 12 }).character;
  } else if (action === 'romance_consummation') {
    character.personal.campaignYear += 1;
    character = consummateAmor(character).character;
  } else if (action === 'romance_discovery') {
    character = resolveAmorDiscovery(character, { discoveryDie: 1, observerValue: 1, loveRoll: 1, discoveryRoll: 20 }).character;
  } else throw new Error(`No personality/magic regression route for ${action}`);
  const saved = reloadAdventure(character);
  const completed = completeAdventurePersonalityMagic(saved);
  assert.equal(completed.applied, true);
  return completed.character;
};

const runDefinition = (definition, options = {}) => {
  let character = startAdventure(makeCharacter(), {
    adventureId: definition.id,
    participants: [{ id: 'self', characterId: 'self', name: '검증 기사' }, { id: 'guest', name: '동료 기사' }]
  }).character;
  let guard = 0;
  while (character.campaign.adventures.active) {
    guard += 1;
    character = reloadAdventure(character);
    const active = character.campaign.adventures.active;
    assert.ok(guard < 200, `${definition.id} did not terminate at ${active.currentStageId}`);
    const stage = getCurrentAdventureStage(active);
    assert.ok(stage, `${definition.id} has a valid current stage`);
    if (stage.optional && !options.includeOptional) {
      character = skipOptionalAdventureStage(character, { reason: 'regression alternate branch' }).character;
      continue;
    }
    if (stage.kind === 'player_choice') {
      character = recordAdventureDecision(character, { kind: 'player', value: stage.options?.[0] || 'player decision', note: 'chosen' }).character;
      character = completeAdventureStage(reloadAdventure(character)).character;
      continue;
    }
    if (stage.kind === 'test') {
      const usedTestKeys = new Set(active.results.filter(item => item.type === 'test' && item.stageId === stage.id).map(item => item.testKey));
      const nextTestKey = stage.repeat?.unique ? stage.tests.find(testKey => !usedTestKeys.has(testKey)) : stage.tests[0];
      for (const testKey of stage.testMode === 'all' ? stage.tests : [nextTestKey]) {
        character = resolveAdventureTest(character, { testKey, roll: 1, target: 12 }).character;
      }
      character = completeAdventureStage(reloadAdventure(character)).character;
      continue;
    }
    if (stage.kind === 'table') {
      const pendingTableId = active.pendingTable?.tableId || stage.tableId;
      const table = CHAPTER_19_TABLES[pendingTableId];
      const priorResults = active.results.filter(item => item.type === 'table' && item.stageId === stage.id && item.tableId === pendingTableId);
      const sequenceRoll = stage.repeat?.sequence ? active.stageProgress?.[stage.id]?.iteration || 1 : null;
      const untilResult = stage.repeat?.mode === 'until_result' ? table.rows.find(item => stage.repeat.results.includes(item.result)) : null;
      const uniqueRow = stage.repeat?.unique ? table.rows.find(item => !priorResults.some(result => result.result === item.result)) : null;
      const row = untilResult || uniqueRow || table.rows[0];
      character = resolveAdventureTable(character, { roll: sequenceRoll || row.min }).character;
      if (!character.campaign.adventures.active.pendingTable?.resolved) continue;
      if (character.campaign.adventures.active.pendingConsequence) character = settlePendingConsequence(character);
      const resolved = character.campaign.adventures.active.pendingTable.resolved;
      const subsystem = getAdventureTableSubsystemRequirement(resolved.tableId, resolved.result);
      if (subsystem === 'combat') {
        character = beginAdventureCombat(character, {
          gmStatsConfirmed: true,
          opponents: [{ id: 'table_enemy', name: resolved.result, skill: 10, damageDice: 3, armor: 2, shield: 0, dex: 10, str: 10, siz: 10, con: 10, weaponId: 'sword', distance: 1 }]
        }).character;
        character = completeAdventureCombat(reloadAdventure(character), { result: 'victory' }).character;
      } else if (subsystem === 'battle') {
        character = beginAdventureBattle(character, {
          battleType: 'mass_battle',
          setup: { duration: 0, playerArmySize: 200, enemyArmySize: 200, playerArmyBattle: 12, enemyArmyBattle: 12 }
        }).character;
        character.campaign.massBattle.status = 'complete';
        character.campaign.massBattle.phase = 'complete';
        character.campaign.massBattle.result = { result: 'indecisive', source: 'chapter_8' };
        character = completeAdventureBattleReturn(reloadAdventure(character)).character;
      }
      character = completeAdventureStage(reloadAdventure(character), { stopRepeat: stage.repeat?.mode === 'manual' }).character;
      continue;
    }
    if (stage.kind === 'dependency') {
      character = recordAdventureDecision(character, { kind: 'dependency', value: 'canonical hand-off', note: stage.dependency }).character;
      character = completeAdventureStage(reloadAdventure(character)).character;
      continue;
    }
    if (stage.kind === 'subsystem' && stage.subsystem === 'combat') {
      character = beginAdventureCombat(character, {
        gmStatsConfirmed: true,
        opponents: [{ id: 'source_enemy', name: 'Source Enemy', skill: 10, damageDice: 3, armor: 2, shield: 0, dex: 10, str: 10, siz: 10, con: 10, weaponId: 'sword', distance: 1 }]
      }).character;
      assert.equal(character.campaign.combat.returnContext.type, 'adventure');
      character = completeAdventureCombat(reloadAdventure(character), { result: 'victory' }).character;
      continue;
    }
    if (stage.kind === 'subsystem' && stage.subsystem === 'battle') {
      const battleType = stage.battleType || 'mass_battle';
      const battleKey = battleType === 'mass_battle' ? 'massBattle' : battleType;
      character = beginAdventureBattle(character, { battleType, setup: { duration: 0, playerArmySize: 200, enemyArmySize: 200, playerArmyBattle: 12, enemyArmyBattle: 12 } }).character;
      character.campaign[battleKey].status = 'complete';
      character.campaign[battleKey].phase = 'complete';
      character.campaign[battleKey].result = { result: 'indecisive', source: 'chapter_8' };
      character = completeAdventureBattleReturn(reloadAdventure(character)).character;
      continue;
    }
    if (stage.kind === 'subsystem' && stage.subsystem === 'hunt') {
      character = beginAdventureHunt(character, {
        season: 'summer', segments: 2, terrainModifier: 0, preyAvoidance: stage.hunt?.prey?.avoidance || 15,
        hunters: active.participants.map(participant => ({ participantId: participant.id, hunting: 20, mode: 'hunter' }))
      }).character;
      character = resolveAdventureHuntAction(reloadAdventure(character), { hunterId: 'self', roll: 1 }).character;
      character = resolveAdventureHuntAction(reloadAdventure(character), { hunterId: 'guest', roll: 1 }).character;
      character = resolveAdventureHuntAction(reloadAdventure(character), { hunterId: 'self', roll: 20, preyRoll: 1 }).character;
      if (!stage.hunt?.prey) character = resolveAdventureHuntPrey(reloadAdventure(character), { roll: 4, rowIndex: 0 }).character;
      character = resolveAdventureHuntDiscovery(reloadAdventure(character), { choice: stage.hunt?.prey ? 'observe' : 'release' }).character;
      character = completeAdventureHunt(reloadAdventure(character), { note: 'canonical Hunt completed' }).character;
      continue;
    }
    if (stage.kind === 'subsystem' && stage.subsystem === 'chase') {
      character = beginAdventureChase(character, { initialDistance: 1, pursuerSpeed: 7, fleeingSpeed: 5, maxStages: 3 }).character;
      character = resolveAdventureChaseStage(reloadAdventure(character), { pursuerRoll: 6, fleeingRoll: 1 }).character;
      character = completeAdventureChase(reloadAdventure(character), { note: 'caught in regression' }).character;
      continue;
    }
    if (stage.kind === 'subsystem' && stage.subsystem === 'personality_magic') {
      character = resolvePersonalityMagicStage(character);
      continue;
    }
    if (stage.kind === 'subsystem' && stage.subsystem === 'knighthood') {
      const beforeGlory = character.gear.gloryThisGame;
      character = resolveAdventureKnighthood(character, { roll: 4 }).character;
      assert.equal(character.personal.personalClass, '기사 (Knight)');
      assert.equal(character.gear.gloryThisGame, beforeGlory + 1300);
      assert.ok(character.campaign.economy.transactions.some(item => item.type === 'birth_gift'));
      continue;
    }
    if (stage.kind === 'procedure' && stage.procedure) {
      const required = stage.procedure.items.filter(item => !item.optional);
      const selected = [...required];
      for (const item of stage.procedure.items) {
        if (selected.length >= stage.procedure.minimum) break;
        if (!selected.some(candidate => candidate.id === item.id)) selected.push(item);
      }
      for (const item of selected) character = recordAdventureProcedureItem(reloadAdventure(character), { itemId: item.id, note: 'regression complete' }).character;
      character = confirmStage(character);
      continue;
    }
    character = confirmStage(character);
  }
  const archived = character.campaign.adventures.history.at(-1);
  assert.equal(archived.adventureId, definition.id);
  assert.equal(archived.status, 'complete');
  assert.equal(archived.completedStageIds.length, definition.stages.length);
  return character;
};

assert.equal(CHAPTER_19_LONG_ADVENTURES.length, 2);
assert.equal(CHAPTER_19_SHORT_FORMS.length, 18);
assert.equal(CHAPTER_19_SOLOS.length, 14);
assert.equal(CHAPTER_19_ADVENTURES.length, 34);
assert.equal(Object.keys(CHAPTER_19_TABLES).length, 36);

const runtimeTableIds = new Set(CHAPTER_19_ADVENTURES.flatMap(definition => [
  ...(definition.tableIds || []),
  ...definition.stages.flatMap(stage => [stage.tableId, ...(stage.tableIds || []), ...(stage.followUps || []).map(item => item.tableId)].filter(Boolean))
]));
assert.deepEqual([...Object.keys(CHAPTER_19_TABLES)].filter(tableId => !runtimeTableIds.has(tableId)), []);

for (const [tableId, table] of Object.entries(CHAPTER_19_TABLES)) {
  assert.ok(table.consumer, `${tableId} has a runtime consumer`);
  assert.ok(table.rows.length, `${tableId} has transcribed rows`);
  assert.equal(lookupChapter19Table(tableId, table.rows[0].min).result, table.rows[0].result);
  assert.equal(lookupChapter19Table(tableId, table.rows.at(-1).max).result, table.rows.at(-1).result);
}

assert.throws(() => lookupChapter19Table('19-11', 4), /범위가 겹칩니다/);
assert.equal(lookupChapter19Table('19-11', 4, { rowIndex: 0 }).result, 'Deer');
assert.equal(lookupChapter19Table('19-11', 4, { rowIndex: 1 }).result, 'Aurochs');

let vassalLoop = startAdventure(makeCharacter(), { adventureId: 'vassal_service' }).character;
vassalLoop = recordAdventureDecision(vassalLoop, { kind: 'player', value: 'annual_service' }).character;
vassalLoop = completeAdventureStage(vassalLoop).character;
vassalLoop = resolveAdventureTable(vassalLoop, { roll: 1 }).character;
vassalLoop = settlePendingConsequence(vassalLoop);
vassalLoop = completeAdventureStage(reloadAdventure(vassalLoop)).character;
assert.equal(vassalLoop.campaign.adventures.active.currentStageId, 'table_19_34');
assert.equal(vassalLoop.campaign.adventures.active.stageProgress.table_19_34.history.length, 1);
assert.throws(() => resolveAdventureTable(vassalLoop, { roll: 2 }), /중복 결과/);
vassalLoop = resolveAdventureTable(vassalLoop, { roll: 6 }).character;
vassalLoop = settlePendingConsequence(vassalLoop);
vassalLoop = completeAdventureStage(reloadAdventure(vassalLoop)).character;
vassalLoop = resolveAdventureTable(vassalLoop, { roll: 11 }).character;
vassalLoop = settlePendingConsequence(vassalLoop);
vassalLoop = completeAdventureStage(reloadAdventure(vassalLoop)).character;
assert.equal(vassalLoop.campaign.adventures.active.currentStageId, 'resolution');

let forestLoop = startAdventure(makeCharacter(), { adventureId: 'forest' }).character;
forestLoop = recordAdventureDecision(forestLoop, { kind: 'player', value: 'lost_in_woods' }).character;
forestLoop = completeAdventureStage(forestLoop).character;
forestLoop = resolveAdventureTable(forestLoop, { roll: 18 }).character;
assert.equal(forestLoop.campaign.adventures.active.pendingTable.tableId, '19-17');
forestLoop = resolveAdventureTable(reloadAdventure(forestLoop), { roll: 2 }).character;
if (forestLoop.campaign.adventures.active.pendingConsequence) forestLoop = settlePendingConsequence(forestLoop);
forestLoop = completeAdventureStage(reloadAdventure(forestLoop)).character;
assert.equal(forestLoop.campaign.adventures.active.currentStageId, 'table_19_16');
forestLoop = resolveAdventureTable(forestLoop, { roll: 20 }).character;
if (forestLoop.campaign.adventures.active.pendingConsequence) forestLoop = settlePendingConsequence(forestLoop);
forestLoop = completeAdventureStage(reloadAdventure(forestLoop)).character;
assert.equal(forestLoop.campaign.adventures.active.currentStageId, 'resolution');

assert.throws(() => completeAdventureStage(startAdventure(makeCharacter(), { adventureId: 'jewel' }).character), /기록/);

let deferred = startAdventure(makeCharacter(), { adventureId: 'jewel' }).character;
deferred = deferAdventure(deferred, { requirement: 'Chapter 18 confirmation', gmNote: 'retain exact scene' }).character;
const savedDeferred = reloadAdventure(deferred);
assert.equal(savedDeferred.campaign.adventures.active.status, 'deferred');
assert.equal(savedDeferred.campaign.adventures.active.deferred.stageId, 'setup');
deferred = resumeAdventure(savedDeferred).character;
assert.equal(deferred.campaign.adventures.active.currentStageId, 'setup');

let reward = startAdventure(makeCharacter(), { adventureId: 'jewel' }).character;
reward = applyAdventureConsequence(reward, { transactionId: 'jewel:fixed-glory', type: 'glory', amount: 50, reason: 'Defeated Sir Eingar' }).character;
const duplicated = applyAdventureConsequence(reward, { transactionId: 'jewel:fixed-glory', type: 'glory', amount: 50, reason: 'Defeated Sir Eingar' });
assert.equal(duplicated.applied, false);
assert.equal(duplicated.character.gear.gloryThisGame, 50);
assert.equal(duplicated.character.campaign.gloryLedger.filter(item => item.id === 'jewel:fixed-glory').length, 1);

reward = applyAdventureConsequence(reward, { transactionId: 'jewel:honor', type: 'honor', amount: -1, reason: 'Source consequence' }).character;
assert.equal(reward.campaign.honorLedger.length, 1);
assert.equal(reward.campaign.honorLedger[0].sourcePage, 394);

reward = applyAdventureConsequence(reward, { transactionId: 'jewel:economy', type: 'economy', amountDeniers: 240, reason: 'Source treasure' }).character;
assert.equal(reward.campaign.economy.coinDeniers, createEconomyState(makeCharacter()).coinDeniers + 240);

let tableCombat = startAdventure(makeCharacter(), { adventureId: 'challenges' }).character;
tableCombat = recordAdventureDecision(tableCombat, { kind: 'player', value: 'royal_road', note: 'source setup' }).character;
tableCombat = completeAdventureStage(tableCombat).character;
tableCombat = resolveAdventureTable(tableCombat, { roll: 1 }).character;
if (tableCombat.campaign.adventures.active.pendingConsequence) {
  tableCombat = acknowledgeAdventureConsequence(tableCombat, { note: 'traffic result fixed' }).character;
}
tableCombat = completeAdventureStage(tableCombat).character;
tableCombat = resolveAdventureTable(tableCombat, { roll: 2 }).character;
if (tableCombat.campaign.adventures.active.pendingConsequence) {
  tableCombat = acknowledgeAdventureConsequence(tableCombat, { note: 'opponent result fixed' }).character;
}
assert.throws(() => completeAdventureStage(tableCombat), /Chapter 7/);
tableCombat = beginAdventureCombat(tableCombat, {
  opponents: [{ id: 'ordinary_knight', name: 'Ordinary Knight', skill: 10, damageDice: 4, armor: 10, shield: 6, dex: 10, str: 10, siz: 10, con: 10, weaponId: 'lance', distance: 10 }]
}).character;
const firstTableCombatId = tableCombat.campaign.adventures.active.pendingSubsystem.transactionId;
tableCombat = completeAdventureCombat(reloadAdventure(tableCombat), { result: 'victory' }).character;
assert.equal(tableCombat.campaign.adventures.active.currentStageId, 'table_19_14');
assert.equal(tableCombat.campaign.adventures.active.pendingSubsystem, null);
assert.equal(tableCombat.campaign.adventures.active.results.filter(item => item.type === 'combat_return').length, 1);
tableCombat = completeAdventureStage(tableCombat).character;
tableCombat = resolveAdventureTable(tableCombat, { roll: 3 }).character;
tableCombat = beginAdventureCombat(tableCombat, {
  opponents: [{ id: 'ordinary_knight_2', name: 'Ordinary Knight', skill: 10, damageDice: 4, armor: 10, shield: 6, dex: 10, str: 10, siz: 10, con: 10, weaponId: 'lance', distance: 10 }]
}).character;
assert.notEqual(tableCombat.campaign.adventures.active.pendingSubsystem.transactionId, firstTableCombatId);

for (const definition of CHAPTER_19_ADVENTURES) runDefinition(definition);
for (const definition of CHAPTER_19_LONG_ADVENTURES) runDefinition(definition, { includeOptional: true });

console.log(`Chapter 19 adventure regression passed: ${CHAPTER_19_ADVENTURES.length} procedures, ${Object.keys(CHAPTER_19_TABLES).length} tables, save/resume and duplicate prevention.`);

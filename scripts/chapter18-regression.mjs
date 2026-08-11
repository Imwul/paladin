import assert from 'node:assert/strict';
import { CHAPTER_18_CREATURES, CHAPTER_18_REFERENCE_ENTRIES } from '../src/data/chapter18Creatures.js';
import {
  advanceChapter18FearDelay,
  advanceChapter18Round,
  advanceNormalHorseBolt,
  applyChapter18RoundEffects,
  applyChapter7Consequences,
  applyChapter7HorseDamage,
  beginAdventureHunt,
  chapter18CreatureToOpponent,
  chapter18MountToHorse,
  completeChapter18Encounter,
  completeChapter7Movement,
  createEconomyState,
  declareChapter7Action,
  getChapter7LegalActions,
  getEquippedMarketCombat,
  completeAdventureStage,
  recordChapter18AbilityDecision,
  resolveChapter18Avoidance,
  resolveChapter18Gate,
  resolveChapter18GoblinVice,
  resolveChapter18PrudentWithdrawal,
  resolveChapter7Action,
  resolveNormalHorseControl,
  recordAdventureDecision,
  resolveAdventureHuntAction,
  startAdventure,
  startChapter18Encounter
} from '../src/rules/index.js';
import { sanitizeCampaignState } from '../src/utils/campaignState.js';

const NOW = '2026-08-11T00:00:00.000Z';
const makeCharacter = () => {
  const character = {
    personal: { name: 'Chapter 18 검증 기사', age: 30, campaignYear: 780, maintenance: 'ordinary' },
    attributes: { siz: 14, dex: 14, str: 14, con: 14, app: 12, currentHp: 28 },
    traits: {
      chaste: 12, lustful: 8, energetic: 12, lazy: 8, forgiving: 12, vengeful: 8, generous: 12, selfish: 8,
      honest: 12, deceitful: 8, just: 12, arbitrary: 8, merciful: 12, cruel: 8, modest: 12, proud: 8,
      prudent: 12, reckless: 8, temperate: 12, indulgent: 8, trusting: 12, suspicious: 8, valorous: 15, cowardly: 5
    },
    passions: { honor: 16, loveFamily: 15, loveGod: 15, loveCharlemagne: 15 },
    standings: { charlemagne: 10, liegeLord: 10, family: 10, retinue: 10, church: 10, commoners: 10 },
    skills: { sword: 16, spear: 14, lance: 16, unarmed: 12, bow: 12, horsemanship: 15, hunting: 12, awareness: 12 },
    skillsChecked: {}, traitsChecked: {}, passionsChecked: {}, standingsChecked: {},
    squire: { name: '검증 종자', age: 16, status: '생존' },
    horses: { warhorse: { profileKey: 'charger', type: 'Charger', hp: 46, armor: 5 } },
    gear: { cash: 10, gloryThisGame: 0, gloryTotal: 1000 },
    family: { name: '검증 가문', members: [{ id: 'self', name: '검증 기사', relation: '본인', generation: 3, status: '생존' }] },
    journal: {},
    campaign: {
      schemaVersion: 12, saveRevision: 0, appliedEvents: {}, chronicleEvents: [], gloryLedger: [], honorLedger: [], standingLedger: [], familyTimeline: [],
      combat: null, combatHistory: [], chapter18: { engineVersion: 1, active: null, history: [] }, conditions: [], passionStates: [], captives: [],
      health: { wounds: [], surgeryNeeded: false, unconscious: false, pendingDeath: null, majorWoundCourage: null, weeklyCare: [] },
      lifecycle: { status: 'active', careerStatus: 'active', activeCharacterId: 'self', primaryCharacterId: 'self', events: [], unresolvedChoices: [] }
    }
  };
  character.campaign.economy = createEconomyState(character);
  return character;
};

const begin = (creatureId, attackId, extra = {}) => startChapter18Encounter(makeCharacter(), {
  id: `test:${creatureId}`, creatureId, attackId, partySize: 1, victors: 1,
  player: { weaponId: 'sword', armor: 10, armorType: 'chainmail', shield: 6, ...extra.player },
  ...extra
}, NOW).character;
const passGate = character => {
  let next = character;
  while (next.campaign.chapter18.active.pendingChecks.length) {
    const pending = next.campaign.chapter18.active.pendingChecks[0];
    if ((next.traits[pending.trait] || 0) + pending.modifier <= 0) next.traits[pending.trait] = 20;
    next = resolveChapter18Gate(next, { roll: 1 }, () => 0).character;
  }
  return next;
};
const combatRound = (character, declaration, resolution = {}) => {
  let next = declareChapter7Action(character, declaration, NOW).character;
  next = resolveChapter7Action(next, { ...resolution, now: NOW }, () => 0).character;
  next = applyChapter7Consequences(next, { now: NOW }, () => 0).character;
  return next;
};

// Every printed statblock is canonical, sourced, and consumable.
assert.equal(CHAPTER_18_CREATURES.length, 74);
assert.deepEqual(Object.fromEntries(['human', 'mount', 'hunting_animal', 'animal', 'enchanted'].map(category => [category, CHAPTER_18_CREATURES.filter(item => item.category === category).length])), {
  human: 29, mount: 16, hunting_animal: 3, animal: 8, enchanted: 18
});
assert.equal(CHAPTER_18_CREATURES.reduce((sum, creature) => sum + creature.attacks.length, 0), 138);
for (const creature of CHAPTER_18_CREATURES) {
  assert.ok(creature.sourcePage >= 373 && creature.sourcePage <= 389, `${creature.id} has a printed source page`);
  assert.ok(creature.stats && creature.hp != null && creature.armor != null && creature.move != null, `${creature.id} has executable combat state`);
  if (creature.attacks.length === 1) assert.equal(chapter18CreatureToOpponent(creature.id).chapter18Id, creature.id);
}
assert.equal(CHAPTER_18_REFERENCE_ENTRIES.some(item => item.id === 'normal_horses_in_combat'), true);
assert.throws(() => chapter18CreatureToOpponent('deer'), /공격을 선택/);
assert.equal(chapter18CreatureToOpponent('bear', { attackId: 'claws' }).attackProfile.packetCount, 2);
assert.equal(chapter18MountToHorse('steppe_pony').majorWoundThreshold, 10);
assert.equal(chapter18MountToHorse('pegasus').combatTrained, true);
assert.equal(chapter18MountToHorse('hippogriff').combatTrained, true);

// Discretion and Valor: hesitation/flee delays persist, retry works, and optional Prudent can end the encounter.
let valor = begin('dragon', 'bite');
valor = resolveChapter18Gate(valor, { roll: 20, fleeRounds: 3 }).character;
assert.equal(valor.campaign.chapter18.active.fearDelay.rounds, 3);
assert.throws(() => resolveChapter18Gate(valor, { roll: 1 }), /남은 라운드/);
valor = advanceChapter18FearDelay(valor, { rounds: 3 }, NOW).character;
valor = resolveChapter18Gate(valor, { roll: 1 }).character;
assert.equal(valor.campaign.chapter18.active.valorousPassed, true);
valor = resolveChapter18PrudentWithdrawal(valor, { roll: 1 }).character;
assert.equal(valor.campaign.chapter18.active.gateOutcome, 'prudent_withdrawal');
assert.deepEqual(getChapter7LegalActions(valor), []);

// Elephant's separate Prudent +5 gate is mandatory and a success requires refraining.
let elephantGate = begin('elephant', 'trample');
elephantGate = resolveChapter18Gate(elephantGate, { roll: 1 }).character;
assert.equal(elephantGate.campaign.chapter18.active.gateOutcome, 'required_prudent_refrain');

// Chapter 18 Avoidance is the opposed Hunt consumer.
const avoidance = resolveChapter18Avoidance({ creatureId: 'deer', hunting: 12, hunterRoll: 5, creatureRoll: 20 });
assert.equal(avoidance.avoidance, 15);
assert.equal(avoidance.opposed.winner, 'actor');

// Table 18-1 controls an untrained horse once per round; a fumble bolts until a later Horsemanship success.
let horse = begin('bandit', 'spear', { player: { mounted: true, horse: chapter18MountToHorse('palfrey') } });
assert.deepEqual(getChapter7LegalActions(horse), []);
horse = resolveNormalHorseControl(horse, { roll: 20 }).character;
assert.equal(horse.campaign.combat.horseControl.status, 'bolted');
assert.throws(() => resolveNormalHorseControl(horse, { roll: 1 }), /라운드를 먼저/);
const beforeBoltDistance = horse.campaign.combat.opponents[0].distance;
horse = advanceNormalHorseBolt(horse, NOW).character;
assert.equal(horse.campaign.combat.round, 2);
assert.equal(horse.campaign.combat.opponents[0].distance, beforeBoltDistance + 6);
horse = resolveNormalHorseControl(horse, { roll: 15 }).character;
assert.equal(horse.campaign.combat.horseControl.status, 'exempt');

let horseFailure = begin('bandit', 'spear', { player: { mounted: true, horse: chapter18MountToHorse('palfrey') } });
horseFailure = resolveNormalHorseControl(horseFailure, { roll: 16 }).character;
assert.deepEqual(getChapter7LegalActions(horseFailure), ['evade']);
horseFailure = declareChapter7Action(horseFailure, { action: 'evade' }, NOW).character;
horseFailure = resolveChapter7Action(horseFailure, { actorRoll: 15, opponentRoll: 20 }, () => 0).character;
assert.equal(horseFailure.campaign.combat.pending.exchanges[0].normalHorseEvasion, true);
assert.equal(horseFailure.campaign.combat.pending.exchanges[0].actorCheck.target, 15);

let ruinedHorse = begin('bandit', 'spear', { player: { mounted: true, horse: chapter18MountToHorse('palfrey') } });
ruinedHorse = applyChapter7HorseDamage(ruinedHorse, { side: 'player', rolledDamage: 20, direct: true }, () => 0).character;
assert.equal(ruinedHorse.campaign.combat.player.horse.status, 'broken');
assert.equal(ruinedHorse.campaign.combat.player.horse.str, 14);
assert.equal(ruinedHorse.campaign.combat.player.horse.con, 6);
assert.equal(ruinedHorse.campaign.combat.player.horse.move, 5);

// Attack-trained mounts grant +5 to the rider's melee weapon, never by changing the source statblock.
let trained = begin('bandit', 'spear', {
  player: { mounted: true, attackTrainedMount: true, horse: chapter18MountToHorse('destrier', { attackTrained: true }) }
});
const trainedTarget = trained.campaign.combat.opponents[0].id;
trained = combatRound(trained, { action: 'attack', targetId: trainedTarget }, { actorRoll: 5, opponentRoll: 20, actorDamageTotal: 10 });
assert.equal(trained.campaign.combat.pending.exchanges[0].actorCheck.base, 21);

let pegasusCharge = begin('bandit', 'spear', {
  distance: 6, player: { weaponId: 'lance', mounted: true, horse: chapter18MountToHorse('pegasus') }
});
const pegasusTarget = pegasusCharge.campaign.combat.opponents[0].id;
pegasusCharge = declareChapter7Action(pegasusCharge, { action: 'lance_charge', targetId: pegasusTarget }, NOW).character;
pegasusCharge = resolveChapter7Action(pegasusCharge, { actorRoll: 5, opponentRoll: 20, actorDamageTotal: 30 }, () => 0).character;
const pegasusExchange = pegasusCharge.campaign.combat.pending.exchanges[0];
assert.equal(pegasusExchange.actorCheck.reasons.some(reason => reason.label === 'Chapter 18 특수 탈것 마상창' && reason.value === -5), true);
assert.equal(pegasusExchange.packets[0].damage.dice, 12);

// Normal-weapon immunity is attached to the creature, and only an equipped magic weapon bypasses it.
let harpy = passGate(begin('harpy', 'claws'));
const harpyId = harpy.campaign.combat.opponents[0].id;
const harpyHp = harpy.campaign.combat.opponents[0].currentHp;
harpy = combatRound(harpy, { action: 'attack', targetId: harpyId }, { actorRoll: 1, opponentRoll: 20, actorDamageTotal: 30 });
assert.equal(harpy.campaign.combat.opponents[0].currentHp, harpyHp);

// Natural ranged specials use their source range, consume no ammunition, and create one persistent effect.
let basilisk = passGate(begin('basilisk', 'poison_spit', { distance: 20 }));
const basiliskId = basilisk.campaign.combat.opponents[0].id;
basilisk = combatRound(basilisk, { action: 'hold', enemyPlans: { [basiliskId]: 'ranged' } }, { enemyRolls: { [basiliskId]: 1 } });
assert.equal(basilisk.campaign.combat.pending.exchanges.find(item => item.type === 'opponent_ranged').maximum, 25);
assert.equal(basilisk.campaign.combat.opponents[0].ammo.arrows, 12);
basilisk = applyChapter18RoundEffects(basilisk, {}, () => 0).character;
assert.equal(basilisk.campaign.chapter18.active.ongoingEffects.length, 1);
basilisk = completeChapter7Movement(basilisk, {}, NOW).character;
const hpBeforePoison = basilisk.attributes.currentHp;
basilisk = advanceChapter18Round(basilisk, { stopRolls: { [basilisk.campaign.chapter18.active.ongoingEffects[0].id]: 2 } }, () => 0).character;
assert.equal(basilisk.attributes.currentHp, hpBeforePoison - 10);
const duplicatePoisonRound = advanceChapter18Round(basilisk, {}, () => 0);
assert.equal(duplicatePoisonRound.applied, false);

// Elephant throw damage and Griffin fly-by movement return through Chapter 7 exactly once.
let elephant = begin('elephant', 'grapple_throw');
elephant = resolveChapter18Gate(elephant, { roll: 20 }).character;
const elephantId = elephant.campaign.combat.opponents[0].id;
elephant = combatRound(elephant, { action: 'hold', enemyPlans: { [elephantId]: 'grapple' } }, { actorRoll: 20, enemyRolls: { [elephantId]: 1 } });
const hpBeforeThrow = elephant.attributes.currentHp;
elephant = applyChapter18RoundEffects(elephant, { throwDamageRolls: [1, 1, 1, 1, 1, 1] }, () => 0).character;
assert.equal(elephant.attributes.currentHp, hpBeforeThrow - 6);
assert.equal(applyChapter18RoundEffects(elephant, {}, () => 0).applied, false);

let griffin = passGate(begin('griffin', 'flyby_claw'));
const griffinId = griffin.campaign.combat.opponents[0].id;
griffin = combatRound(griffin, { action: 'defend', enemyPlans: { [griffinId]: 'attack' } }, { actorRoll: 20, opponentRoll: 1, opponentDamageTotal: 8 });
griffin = applyChapter18RoundEffects(griffin, {}, () => 0).character;
griffin = completeChapter7Movement(griffin, {}, NOW).character;
griffin = advanceChapter18Round(griffin, {}, () => 0).character;
assert.equal(griffin.campaign.combat.opponents[0].distance, 15);

// Regeneration, Goblin opposed virtue, and Dragon's second-target decision are explicit runtime consumers.
let dragon = passGate(begin('dragon', 'bite'));
dragon.campaign.combat.opponents[0].currentHp = 50;
const dragonId = dragon.campaign.combat.opponents[0].id;
dragon = combatRound(dragon, { action: 'hold', enemyPlans: { [dragonId]: 'approach' } });
dragon = applyChapter18RoundEffects(dragon, {}, () => 0).character;
dragon = completeChapter7Movement(dragon, {}, NOW).character;
dragon = advanceChapter18Round(dragon, { regenerationRolls: { [dragonId]: 4 } }).character;
assert.equal(dragon.campaign.combat.opponents[0].currentHp, 54);
dragon = recordChapter18AbilityDecision(dragon, { creatureId: 'dragon', abilityId: 'bite_tail_two_targets', choice: 'second participant', note: 'GM recorded the distinct second target' }, NOW).character;
assert.equal(dragon.campaign.chapter18.active.abilityRecords.at(-1).abilityId, 'bite_tail_two_targets');

let goblin = passGate(begin('goblin', 'bite', { overrides: { armor: 4 } }));
const goblinId = goblin.campaign.combat.opponents[0].id;
goblin = resolveChapter18GoblinVice(goblin, { opponentId: goblinId, vice: 'selfish', roll: 1 }).character;
assert.equal(goblin.campaign.combat.opponents[0].status, 'fled');

// Settlement, ledger IDs, schema migration, and completed reload are stable.
let deer = begin('deer', 'gore');
deer.campaign.combat.opponents[0].status = 'defeated';
deer = completeChapter18Encounter(deer, { result: 'victory' }, NOW).character;
assert.equal(deer.campaign.chapter18.active, null);
assert.equal(deer.campaign.chapter18.history.length, 1);
assert.equal(deer.campaign.gloryLedger.filter(item => item.id === 'test:deer:glory:1').length, 1);
assert.equal(deer.campaign.gloryLedger.find(item => item.id === 'test:deer:glory:1').amount, 5);
const reloaded = sanitizeCampaignState(JSON.parse(JSON.stringify(deer)), makeCharacter());
assert.equal(reloaded.campaign.schemaVersion, 12);
assert.equal(reloaded.campaign.chapter18.history.length, 1);
assert.equal(reloaded.campaign.gloryLedger.filter(item => item.id === 'test:deer:glory:1').length, 1);

// Chapter 12 equipment preserves the trained mount flag consumed by the Chapter 18 player adapter.
const economyCharacter = makeCharacter();
economyCharacter.campaign.economy.equipment.push({ id: 'owned:destrier', marketItemId: 'destrier', category: 'mount', equipped: true, attackTrained: true });
assert.equal(getEquippedMarketCombat(economyCharacter).mount.attackTrained, true);

let huntCharacter = makeCharacter();
huntCharacter.campaign.economy.equipment.push({ id: 'owned:courser', marketItemId: 'courser', category: 'mount', equipped: true });
huntCharacter = startAdventure(huntCharacter, { adventureId: 'hunt', participants: [{ id: 'self', characterId: 'self', name: '검증 기사' }] }, NOW).character;
huntCharacter = recordAdventureDecision(huntCharacter, { kind: 'player', value: 'hunt preparation', note: 'source setup' }, NOW).character;
huntCharacter = completeAdventureStage(huntCharacter, {}, NOW).character;
huntCharacter = beginAdventureHunt(huntCharacter, { season: 'summer', hunters: [{ participantId: 'self', hunting: 12 }] }, NOW).character;
assert.equal(huntCharacter.campaign.adventures.active.pendingSubsystem.hunters[0].huntingModifier, 5);
huntCharacter = resolveAdventureHuntAction(huntCharacter, { hunterId: 'self', roll: 17 }, () => 0).character;
assert.equal(huntCharacter.campaign.adventures.active.pendingSubsystem.results[0].check.target, 17);

console.log('Chapter 18 regression checks passed.');

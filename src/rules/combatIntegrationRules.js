import { startChapter7Combat, concludeChapter7Combat } from './chapter7CombatRules.js';
import {
  completeBattleMeleeRound,
  recordSkirmishMeleeRound,
  resolveFirstCharge,
  resolveSiegeTactic
} from './battleRules.js';

const clone = value => JSON.parse(JSON.stringify(value));
const asInt = (value, fallback = 0) => Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : fallback;

const battleWeapon = enemy => {
  const text = `${enemy?.weapon || ''} ${enemy?.name || ''}`.toLowerCase();
  if (text.includes('axe') || text.includes('도끼')) return 'axe';
  if (text.includes('spear') || text.includes('창')) return enemy?.greatSpear ? 'greatSpear' : 'spear';
  if (text.includes('mace') || text.includes('hammer') || text.includes('철퇴') || text.includes('망치')) return 'mace';
  if (text.includes('dagger') || text.includes('단검')) return 'dagger';
  if (text.includes('lance') || text.includes('마상창')) return 'lance';
  return 'sword';
};

const opponentInput = (enemy = {}, fallbackName = '전장의 상대') => ({
  id: 'chapter8_enemy', name: String(enemy.name || fallbackName), skill: asInt(enemy.primarySkill, 12),
  rangedSkill: asInt(enemy.primarySkill, 12), horsemanship: asInt(enemy.secondarySkill, 10),
  dex: asInt(enemy.dex, 10), str: asInt(enemy.str, 12), siz: asInt(enemy.siz, 12), con: asInt(enemy.con, 12),
  damageDice: asInt(enemy.damageDice, 4), weaponId: battleWeapon(enemy), armor: asInt(enemy.armor, 6),
  armorType: asInt(enemy.armor, 6) >= 8 ? 'chainmail' : asInt(enemy.armor, 6) > 0 ? 'leather' : 'none',
  shield: typeof enemy.shield === 'number' ? enemy.shield : enemy.shield ? 6 : 0,
  mounted: Boolean(enemy.mounted), horseProfileKey: enemy.mounted ? 'rouncy' : undefined, distance: 1
});

const playerInput = (character, context) => {
  const battle = character.campaign?.massBattle;
  const source = battle?.player || {};
  const firstCharge = context.type === 'mass_battle_first_charge';
  return {
    weaponId: firstCharge ? 'lance' : 'sword', missileWeaponId: 'bow', armor: asInt(source.armor, 10), armorType: 'chainmail',
    shield: asInt(source.shield, 6), mounted: firstCharge || Boolean(source.mounted),
    horse: firstCharge || source.mounted ? character.horses?.warhorse || { profileKey: 'charger' } : null,
    carriedPounds: asInt(character.attributes?.str, 10) * 3
  };
};

export const beginChapter8PersonalCombat = (characterValue, context = {}, now) => {
  const character = clone(characterValue);
  let enemy;
  let sourceName;
  if (context.type === 'skirmish') {
    const skirmish = character.campaign?.skirmish;
    if (!skirmish || skirmish.phase !== 'melee') throw new RangeError('개인 교전을 시작할 소규모 교전 단계가 아닙니다.');
    enemy = { ...context.enemy, name: context.enemy?.name || skirmish.enemy };
    sourceName = skirmish.name;
    context = { ...context, sourceId: skirmish.id, round: skirmish.rounds.length + 1, commandModifier: skirmish.rounds.length ? 0 : asInt(skirmish.command?.modifier) };
  } else if (context.type === 'mass_battle_first_charge') {
    const battle = character.campaign?.massBattle;
    if (!battle || battle.phase !== 'first_charge') throw new RangeError('첫 돌격 단계가 아닙니다.');
    enemy = battle.enemy;
    enemy = { ...enemy, weapon: enemy?.mounted ? 'lance' : enemy?.greatSpear ? 'great spear' : 'sword' };
    sourceName = battle.name;
    context = { ...context, sourceId: battle.id, commandModifier: asInt(battle.command?.chargeModifier) };
  } else if (context.type === 'mass_battle_melee' || context.type === 'mass_battle_special') {
    const battle = character.campaign?.massBattle;
    if (!battle || battle.phase !== 'melee_action' || !battle.pendingRound) throw new RangeError('개인 전투를 시작할 대전투 라운드가 아닙니다.');
    enemy = context.type === 'mass_battle_special' ? battle.pendingRound.specialEvent?.enemy : battle.pendingRound.enemy;
    if (!enemy) throw new RangeError('먼저 Chapter 8에서 이번 라운드의 상대를 결정하세요.');
    sourceName = battle.name;
    context = { ...context, sourceId: battle.id, round: battle.pendingRound.number, battleModifier: asInt(battle.pendingRound.unitRoll?.modifier) };
  } else if (context.type === 'siege_single_combat') {
    const siege = character.campaign?.siege;
    if (!siege || siege.phase !== 'tactic') throw new RangeError('대표 결투를 시작할 공성 단계가 아닙니다.');
    enemy = context.enemy || { name: `${siege.fortress} 대표 기사`, primarySkill: 15, damageDice: 5, armor: 10, shield: true };
    sourceName = siege.fortress;
    context = { ...context, sourceId: siege.id, playerSide: siege.playerSide };
  } else throw new RangeError('알 수 없는 Chapter 8 개인 전투 호출입니다.');

  const opponent = opponentInput(enemy, sourceName);
  if (context.type === 'mass_battle_first_charge') opponent.distance = 6;
  return startChapter7Combat(character, {
    source: `chapter_8:${context.type}`,
    player: playerInput(character, context), opponents: [opponent],
    openingModifier: asInt(context.commandModifier ?? context.battleModifier),
    openingModifierSource: context.commandModifier !== undefined ? 'Chapter 8 지휘 결과' : context.battleModifier !== undefined ? 'Chapter 8 부대 결과' : '',
    returnContext: context
  }, now);
};

const combatOutcome = result => {
  if (result === 'victory' || result === 'capture') return 'success';
  if (result === 'truce') return 'partial';
  if (result === 'flight') return 'disengaged';
  return 'failure';
};

export const completeChapter8PersonalCombat = (characterValue, input = {}, now) => {
  const concluded = concludeChapter7Combat(characterValue, input, now);
  let character = concluded.character;
  const context = concluded.returnContext;
  if (!context) return concluded;
  const result = concluded.combat.outcome.result;
  const chapter7Resolution = {
    combatId: concluded.combat.id,
    combatOutcome: combatOutcome(result),
    result,
    rounds: concluded.combat.rounds.length,
    opponent: concluded.combat.opponents[0]?.name,
    resolvedBy: 'chapter_7_combat'
  };
  if (context.type === 'skirmish') {
    character = recordSkirmishMeleeRound(character, {
      outcome: ['victory', 'capture'].includes(result) ? 'victory' : result === 'truce' ? 'draw' : result === 'flight' ? 'withdrawal' : 'defeat',
      enemiesDefeated: ['victory', 'capture'].includes(result) ? Math.max(1, asInt(input.enemiesDefeated, 1)) : 0,
      note: String(input.note || '')
    }, now).character;
  } else if (context.type === 'mass_battle_first_charge') {
    character = resolveFirstCharge(character, {
      participates: true, chapter7Resolution, lanceBroken: concluded.combat.player.weaponStatus === 'broken',
      followerRoll: input.followerRoll, now
    }).character;
  } else if (context.type === 'mass_battle_melee') {
    character = completeBattleMeleeRound(character, { action: 'engage', chapter7Resolution, followerRoll: input.followerRoll, now }).character;
  } else if (context.type === 'mass_battle_special') {
    character = completeBattleMeleeRound(character, {
      action: 'special_event', specialCombatResult: result === 'capture' ? 'captured' : result === 'victory' ? 'defeated' : 'gave_up',
      specialCombatGlory: Math.max(0, asInt(input.combatGlory)), note: input.note, followerRoll: input.followerRoll, now
    }).character;
  } else if (context.type === 'siege_single_combat') {
    const winner = ['victory', 'capture'].includes(result) ? context.playerSide : result === 'truce' ? 'draw' : context.playerSide === 'attacker' ? 'defender' : 'attacker';
    character = resolveSiegeTactic(character, { tactic: 'single_combat', winner, note: input.note }).character;
  }
  return { character, combat: concluded.combat, returnContext: context, chapter7Resolution };
};

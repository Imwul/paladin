import { useMemo, useState } from 'react';
import { AlertTriangle, Check, ChevronRight, Crosshair, Dices, Footprints, HeartCrack, Plus, Shield, Swords, Trash2 } from 'lucide-react';
import { StatusSeal } from '../../components/ui/LedgerUI';
import {
  CHAPTER_7_ACTIONS,
  CHAPTER_7_PHASES,
  HORSE_PROFILES,
  MISSILE_PROFILES,
  applyChapter7Consequences,
  applyChapter7HorseDamage,
  completeChapter7Movement,
  completeChapter8PersonalCombat,
  concludeChapter7Combat,
  declareChapter7Action,
  getChapter7LegalActions,
  getDerivedHealth,
  getEncumbrance,
  getMovementRate,
  resolveChapter7Action,
  startChapter7Combat
} from '../../rules';
import { WEAPON_PROFILES } from '../../rules/combatRules';

const SelectField = ({ label, value, onChange, options, disabled = false }) => (
  <label className="combat-field"><span>{label}</span><select value={value} disabled={disabled} onChange={event => onChange(event.target.value)}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
);

const NumberField = ({ label, value, onChange, min = 0, max = 100, disabled = false }) => (
  <label className="combat-field"><span>{label}</span><input type="number" value={value} min={min} max={max} disabled={disabled} onChange={event => onChange(event.target.value)} /></label>
);

const weaponOptions = Object.entries(WEAPON_PROFILES).map(([value, item]) => ({ value, label: item.label }));
const missileOptions = Object.entries(MISSILE_PROFILES).map(([value, item]) => ({ value, label: item.label }));
const horseOptions = Object.entries(HORSE_PROFILES).map(([value, item]) => ({ value, label: `${item.label} (${item.type})` }));
const armorOptions = [{ value: 'none', label: '없음' }, { value: 'leather', label: '가죽' }, { value: 'chainmail', label: '사슬갑옷' }, { value: 'plate', label: '판금갑옷' }];
const resultOptions = [{ value: 'victory', label: '승리' }, { value: 'capture', label: '상대 생포' }, { value: 'defeat', label: '패배' }, { value: 'surrender', label: '항복' }, { value: 'flight', label: '도주' }, { value: 'truce', label: '휴전·중단' }];
const targetActions = new Set(['attack', 'double_feint', 'grapple', 'uncontrolled', 'ranged', 'lance_charge', 'joust']);
const movementActions = new Set(['move', 'evade']);
const grappleActions = new Set(['grapple_pin', 'grapple_break', 'grapple_reverse', 'grapple_rearm', 'grapple_strike', 'grapple_throw']);
const checkLabels = { critical: '대성공', success: '성공', failure: '실패', fumble: '대실패', partial: '부분 성공', tie: '비김' };
const combatStatusLabels = { active: '교전 가능', defeated: '전투 불능', surrendered: '항복', fled: '도주' };
const horseStatusLabels = { healthy: '건강', wounded: '부상', broken: '중상', unconscious: '의식 불명', dead: '사망', fallen: '쓰러짐' };

const blankOpponent = index => ({
  id: `enemy:${index + 1}`, name: `상대 ${index + 1}`, skill: 12, unarmed: 10, rangedSkill: 12, horsemanship: 10,
  dex: 10, siz: 12, con: 12, str: 12, damageDice: 4, weaponId: 'axe', missileWeaponId: 'bow',
  armor: 6, armorType: 'chainmail', shield: 6, mounted: false, horseProfileKey: 'rouncy', distance: index ? 1 : 1
});

const CombatantLine = ({ name, hp, maxHp, armor, shield, distance, mounted, status, horse }) => (
  <div className="chapter7-combatant">
    <div><strong>{name}</strong><span>{mounted ? '기마' : '보병'}{distance !== undefined ? ` · ${distance}야드` : ''}</span></div>
    <dl><div><dt>생명력</dt><dd>{hp}/{maxHp}</dd></div><div><dt>갑옷</dt><dd>{armor}</dd></div><div><dt>방패</dt><dd>{shield}</dd></div><div><dt>상태</dt><dd>{status || '교전 가능'}</dd></div></dl>
    {horse && <p>말 {horse.name} · HP {horse.currentHp}/{horse.maxHp} · DEX {horse.dex} · 방어 {horse.armor} · {horseStatusLabels[horse.status] || horse.status}</p>}
  </div>
);

const PhaseRail = ({ current }) => (
  <ol className="chapter7-phase-rail" aria-label="현재 전투 단계">
    {CHAPTER_7_PHASES.map((phase, index) => <li key={phase.id} className={phase.id === current ? 'active' : ''} aria-current={phase.id === current ? 'step' : undefined}><span>{String(index + 1).padStart(2, '0')}</span><strong>{phase.label}</strong></li>)}
  </ol>
);

export default function Chapter7CombatEngine({ character, setCharacter, onNavigate }) {
  const combat = character.campaign?.combat;
  const active = combat?.engineVersion === 2 && combat.status === 'active';
  const [error, setError] = useState('');
  const [rollMode, setRollMode] = useState('automatic');
  const [setup, setSetup] = useState({
    playerWeapon: 'sword', missileWeapon: 'bow', armor: 10, armorType: 'chainmail', shield: 6,
    carriedPounds: Math.max(0, Number(character.attributes?.str || 10) * 3), mounted: false, horseProfileKey: 'charger', horseArmorType: 'none', horseArmorBonus: 0,
    arrows: 12, bolts: 12, javelins: 3, stones: 12, opponents: [blankOpponent(0)]
  });
  const [declaration, setDeclaration] = useState({
    action: 'attack', targetIds: ['enemy:1'], allocations: {}, allyEngagedIds: [], gmModifier: 0, gmNote: '',
    enemyPlans: {}, fireMode: 'normal', weather: 'clear', shieldUse: 'passive', playerShieldUse: 'passive', uncontrolledDefense: 'free_attack', nonlethal: 'full', twoHandedStrike: false,
    awarenessSkill: 'awareness', rearmWeaponId: 'sword', rearmShield: 0, squireRequest: 'weapon',
    grappleRearmStat: 'unarmed', joustFumbleChoice: 'lance_broke', joustFumbleNote: '',
    gmMountedTwoHandedApproved: false, gmShieldTacticApproved: false, experienceApproved: false, gmMaximumRange: 30,
    movement: { targetId: 'enemy:1', direction: 'toward', speed: 'walk', yards: 3, gmFastMovementApproved: false, gmMultipleApproved: false },
    dexAction: { type: 'balance', modifier: 0, aid: 'none', awarenessTarget: 10, heightFeet: 30, extended: false }
  });
  const [rolls, setRolls] = useState({ actorRoll: '', opponentRoll: '', feintRoll: '', actorDamageTotal: '', opponentDamageTotal: '', actorDamageRolls: '', opponentDamageRolls: '', dexRoll: '', awarenessRoll: '', strRoll: '', horseDexRoll: '', horsemanshipRoll: '', squireRoll: '', siegeLadderRoll: '' });
  const [horseDamage, setHorseDamage] = useState({ side: 'player', targetId: '', rolledDamage: 0, direct: false, fall: false });
  const [conclusion, setConclusion] = useState({ result: 'victory', note: '', combatGlory: 0 });

  const run = action => {
    try { setError(''); action(); } catch (caught) { setError(caught.message || '전투 절차를 완료하지 못했습니다.'); }
  };
  const updateSetup = (key, value) => setSetup(previous => ({ ...previous, [key]: value }));
  const updateOpponent = (index, key, value) => setSetup(previous => ({ ...previous, opponents: previous.opponents.map((opponent, opponentIndex) => opponentIndex === index ? { ...opponent, [key]: value } : opponent) }));
  const addOpponent = () => setSetup(previous => ({ ...previous, opponents: [...previous.opponents, blankOpponent(previous.opponents.length)] }));
  const removeOpponent = id => setSetup(previous => ({ ...previous, opponents: previous.opponents.length > 1 ? previous.opponents.filter(opponent => opponent.id !== id) : previous.opponents }));
  const updateDeclaration = (key, value) => setDeclaration(previous => ({ ...previous, [key]: value }));
  const updateMovement = (key, value) => setDeclaration(previous => ({ ...previous, movement: { ...previous.movement, [key]: value } }));
  const updateDex = (key, value) => setDeclaration(previous => ({ ...previous, dexAction: { ...previous.dexAction, [key]: value } }));
  const updateEnemyPlan = (id, value) => setDeclaration(previous => ({ ...previous, enemyPlans: { ...previous.enemyPlans, [id]: value } }));
  const updateRoll = (key, value) => setRolls(previous => ({ ...previous, [key]: value }));

  const legalActions = useMemo(() => active ? getChapter7LegalActions(character) : [], [active, character]);
  const activeOpponents = active ? combat.opponents.filter(opponent => opponent.currentHp > 0 && !opponent.health?.unconscious) : [];
  const engagedOpponents = activeOpponents.filter(opponent => opponent.distance <= 1 && !declaration.allyEngagedIds.includes(opponent.id));
  const playerProfile = active ? WEAPON_PROFILES[combat.player.weaponId] : WEAPON_PROFILES[setup.playerWeapon];
  const skillBase = active ? (
    declaration.action === 'dodge' ? Number(character.attributes?.dex || 0)
      : declaration.action === 'evade' ? Number(combat.player.mounted ? character.skills?.horsemanship : character.attributes?.dex || 0)
        : declaration.action === 'lance_charge' || declaration.action === 'joust' ? Number(character.skills?.lance || 0)
          : Number(character.skills?.[playerProfile.skillKey] || 0)
  ) : 0;

  const begin = () => run(() => setCharacter(previous => startChapter7Combat(previous, {
    player: {
      weaponId: setup.playerWeapon, missileWeaponId: setup.missileWeapon, armor: setup.armor, armorType: setup.armorType,
      shield: WEAPON_PROFILES[setup.playerWeapon].hands > 1 ? 0 : setup.shield, carriedPounds: setup.carriedPounds,
      mounted: setup.mounted, horse: { profileKey: setup.horseProfileKey, armorBonus: setup.horseArmorBonus, armorType: setup.horseArmorType },
      ammo: { arrows: setup.arrows, bolts: setup.bolts, javelins: setup.javelins, stones: setup.stones, objects: 3 }
    },
    opponents: setup.opponents.map(opponent => ({ ...opponent, horse: { profileKey: opponent.horseProfileKey } }))
  })));

  const toggleTarget = id => setDeclaration(previous => {
    const single = ['uncontrolled', 'grapple', 'ranged', 'lance_charge', 'joust'].includes(previous.action);
    const targetIds = single ? [id] : previous.targetIds.includes(id) ? previous.targetIds.filter(value => value !== id) : [...previous.targetIds, id];
    return { ...previous, targetIds, movement: { ...previous.movement, targetId: id } };
  });
  const toggleSupport = id => setDeclaration(previous => ({ ...previous, allyEngagedIds: previous.allyEngagedIds.includes(id) ? previous.allyEngagedIds.filter(value => value !== id) : [...previous.allyEngagedIds, id] }));
  const allocationIds = ['defend', 'dodge', 'evade'].includes(declaration.action) ? engagedOpponents.map(opponent => opponent.id) : declaration.targetIds;
  const normalizedAllocations = () => {
    if (declaration.action === 'dodge' || allocationIds.length <= 1) return declaration.allocations;
    const entered = allocationIds.reduce((sum, id) => sum + Number(declaration.allocations[id] || 0), 0);
    if (entered === skillBase) return declaration.allocations;
    const base = Math.floor(skillBase / allocationIds.length);
    return allocationIds.reduce((values, id, index) => ({ ...values, [id]: base + (index === 0 ? skillBase - base * allocationIds.length : 0) }), {});
  };

  const declare = () => run(() => setCharacter(previous => declareChapter7Action(previous, { ...declaration, action: legalActions.includes(declaration.action) ? declaration.action : legalActions[0], allocations: normalizedAllocations() }).character));
  const resolve = () => run(() => {
    const values = Object.fromEntries(Object.entries(rolls).map(([key, value]) => {
      if (rollMode !== 'manual' || value === '') return [key, undefined];
      if (key.endsWith('DamageRolls')) return [key, String(value).split(',').map(item => Number(item.trim())).filter(item => item >= 1 && item <= 6)];
      return [key, Number(value)];
    }));
    setCharacter(previous => resolveChapter7Action(previous, values).character);
  });
  const apply = () => run(() => setCharacter(previous => applyChapter7Consequences(previous).character));
  const completeMovement = () => run(() => setCharacter(previous => completeChapter7Movement(previous).character));
  const damageHorse = () => run(() => setCharacter(previous => applyChapter7HorseDamage(previous, { ...horseDamage, rolledDamage: Number(horseDamage.rolledDamage) }).character));
  const finish = () => run(() => {
    setCharacter(previous => previous.campaign?.combat?.returnContext
      ? completeChapter8PersonalCombat(previous, conclusion).character
      : concludeChapter7Combat(previous, conclusion).character);
    if (combat?.returnContext && onNavigate) onNavigate('battle');
  });

  if (!active) return (
    <section className="chapter7-engine" aria-labelledby="chapter7-setup-title">
      <header className="chapter7-engine__header"><div><span className="serial-label">Chapter 7 · 새 교전</span><h2 id="chapter7-setup-title">전장과 전투원 설정</h2></div>{combat?.status === 'concluded' && <StatusSeal tone="neutral">직전 교전 완료</StatusSeal>}</header>
      <div className="chapter7-setup-grid">
        <fieldset><legend>기사와 장비</legend>
          <SelectField label="근접 무기" value={setup.playerWeapon} onChange={value => updateSetup('playerWeapon', value)} options={weaponOptions} />
          <SelectField label="원거리 무기" value={setup.missileWeapon} onChange={value => updateSetup('missileWeapon', value)} options={missileOptions} />
          <NumberField label="갑옷" value={setup.armor} onChange={value => updateSetup('armor', value)} /><SelectField label="갑옷 종류" value={setup.armorType} onChange={value => updateSetup('armorType', value)} options={armorOptions} />
          <NumberField label="방패" value={WEAPON_PROFILES[setup.playerWeapon].hands > 1 ? 0 : setup.shield} disabled={WEAPON_PROFILES[setup.playerWeapon].hands > 1} onChange={value => updateSetup('shield', value)} />
          <NumberField label="휴대 중량 · 파운드" value={setup.carriedPounds} max={Number(character.attributes?.str || 10) * 16} onChange={value => updateSetup('carriedPounds', value)} />
          <p className="chapter7-rule-line">{getEncumbrance(character.attributes?.str, setup.carriedPounds).label} · 이동 {getMovementRate(character.attributes, setup.carriedPounds)}야드</p>
          <label className="combat-check"><input type="checkbox" checked={setup.mounted} onChange={event => updateSetup('mounted', event.target.checked)} /><span>기마 상태</span></label>
          {setup.mounted && <><SelectField label="말" value={setup.horseProfileKey} onChange={value => updateSetup('horseProfileKey', value)} options={horseOptions} /><SelectField label="마갑" value={setup.horseArmorType} onChange={value => { updateSetup('horseArmorType', value); if (value === 'caparison') updateSetup('horseArmorBonus', 2); }} options={[{ value: 'none', label: '없음' }, { value: 'caparison', label: 'Caparison · +2' }, { value: 'trapper', label: 'Trapper · GM 방어값' }, { value: 'barding', label: 'Barding · Charger/Destrier' }, { value: 'plate_barding', label: 'Plate barding · Destrier만' }]} /><NumberField label="마갑 추가 방어" value={setup.horseArmorBonus} max={10} disabled={setup.horseArmorType === 'caparison'} onChange={value => updateSetup('horseArmorBonus', value)} /></>}
          <div className="chapter7-ammo"><NumberField label="화살" value={setup.arrows} max={999} onChange={value => updateSetup('arrows', value)} /><NumberField label="볼트" value={setup.bolts} max={999} onChange={value => updateSetup('bolts', value)} /><NumberField label="투창" value={setup.javelins} max={99} onChange={value => updateSetup('javelins', value)} /><NumberField label="돌" value={setup.stones} max={999} onChange={value => updateSetup('stones', value)} /></div>
        </fieldset>
        <fieldset><legend>상대 전투원</legend><p className="chapter7-rule-line">현재 {setup.opponents.length}명 · 근접은 보병 3명, 기마 2명 또는 기마 1명과 보병 2명까지입니다. 사거리 밖 원거리 사수는 더 등록할 수 있습니다.</p><button type="button" className="secondary-command" onClick={addOpponent}><Plus size={17} aria-hidden="true" />전투원 추가</button></fieldset>
      </div>
      <div className="chapter7-opponent-setup">{setup.opponents.map((opponent, index) => <fieldset key={opponent.id}><legend>상대 {index + 1}</legend>
        <label className="combat-field"><span>이름</span><input value={opponent.name} onChange={event => updateOpponent(index, 'name', event.target.value)} /></label>
        <SelectField label="근접 무기" value={opponent.weaponId} onChange={value => updateOpponent(index, 'weaponId', value)} options={weaponOptions} /><NumberField label="전투 기술" value={opponent.skill} onChange={value => updateOpponent(index, 'skill', value)} /><NumberField label="Unarmed" value={opponent.unarmed} onChange={value => updateOpponent(index, 'unarmed', value)} />
        <SelectField label="원거리 무기" value={opponent.missileWeaponId} onChange={value => updateOpponent(index, 'missileWeaponId', value)} options={missileOptions} /><NumberField label="원거리 기술" value={opponent.rangedSkill} onChange={value => updateOpponent(index, 'rangedSkill', value)} />
        <NumberField label="DEX" value={opponent.dex} onChange={value => updateOpponent(index, 'dex', value)} /><NumberField label="SIZ" value={opponent.siz} onChange={value => updateOpponent(index, 'siz', value)} /><NumberField label="CON" value={opponent.con} onChange={value => updateOpponent(index, 'con', value)} />
        <NumberField label="피해 d6" value={opponent.damageDice} max={30} onChange={value => updateOpponent(index, 'damageDice', value)} /><NumberField label="갑옷" value={opponent.armor} onChange={value => updateOpponent(index, 'armor', value)} /><NumberField label="방패" value={opponent.shield} onChange={value => updateOpponent(index, 'shield', value)} />
        <NumberField label="거리 · 야드" value={opponent.distance} max={1000} onChange={value => updateOpponent(index, 'distance', value)} /><label className="combat-check"><input type="checkbox" checked={opponent.mounted} onChange={event => updateOpponent(index, 'mounted', event.target.checked)} /><span>기마 상태</span></label>
        {opponent.mounted && <SelectField label="상대 말" value={opponent.horseProfileKey} onChange={value => updateOpponent(index, 'horseProfileKey', value)} options={horseOptions} />}
        <button type="button" className="secondary-command" disabled={setup.opponents.length === 1} onClick={() => removeOpponent(opponent.id)} title="상대 전투원 제거"><Trash2 size={16} aria-hidden="true" />전투원 제거</button>
      </fieldset>)}</div>
      <button type="button" className="primary-command" onClick={begin}><Swords size={17} aria-hidden="true" />교전 시작</button>
      {error && <div className="winter-error" role="alert"><AlertTriangle size={17} aria-hidden="true" />{error}</div>}
    </section>
  );

  const playerHealth = getDerivedHealth(character.attributes);
  const pending = combat.pending;
  return (
    <section className="chapter7-engine" aria-label="진행 중인 Chapter 7 교전">
      <header className="chapter7-engine__header"><div><span className="serial-label">Melee Round {combat.round}</span><h2>개인 전투 절차</h2></div><StatusSeal tone="active">{CHAPTER_7_PHASES.find(phase => phase.id === combat.phase)?.label}</StatusSeal></header>
      {combat.round === 1 && combat.openingModifier !== 0 && <p className="chapter7-return"><Crosshair size={16} aria-hidden="true" />{combat.openingModifierSource || '연결 절차'} {combat.openingModifier > 0 ? '+' : ''}{combat.openingModifier}가 이번 첫 라운드에만 적용됩니다.</p>}
      <PhaseRail current={combat.phase} />
      <div className="chapter7-roster"><CombatantLine name={character.personal?.name || '기사'} hp={playerHealth.currentHp} maxHp={playerHealth.totalHp} armor={combat.player.armor} shield={combat.player.shield} mounted={combat.player.mounted} status={combat.player.prone ? '넘어짐' : combat.player.grapple ? '붙잡기' : '교전 가능'} horse={combat.player.horse} />{combat.opponents.map(opponent => <CombatantLine key={opponent.id} name={opponent.name} hp={opponent.currentHp} maxHp={opponent.siz + opponent.con} armor={opponent.armor} shield={opponent.shield} distance={opponent.distance} mounted={opponent.mounted} status={opponent.prone ? '넘어짐' : opponent.grapple ? '붙잡힘' : combatStatusLabels[opponent.status] || opponent.status} horse={opponent.horse} />)}</div>

      {combat.phase === 'determination' && <div className="chapter7-declaration">
        <SelectField label="기사 행동" value={legalActions.includes(declaration.action) ? declaration.action : legalActions[0]} onChange={value => updateDeclaration('action', value)} options={legalActions.map(value => ({ value, label: `${CHAPTER_7_ACTIONS[value].label}${CHAPTER_7_ACTIONS[value].optional ? ' · 선택 규칙' : ''}` }))} />
        {(targetActions.has(declaration.action) || grappleActions.has(declaration.action)) && <fieldset className="chapter7-targets"><legend>대상</legend>{activeOpponents.map(opponent => <label key={opponent.id} className="combat-check"><input type={['uncontrolled', 'grapple', 'ranged', 'lance_charge', 'joust'].includes(declaration.action) ? 'radio' : 'checkbox'} name="combat-target" checked={declaration.targetIds.includes(opponent.id)} onChange={() => toggleTarget(opponent.id)} /><span>{opponent.name} · {opponent.distance}야드</span></label>)}</fieldset>}
        {activeOpponents.length > 1 && <fieldset className="chapter7-targets"><legend>아군 지원과 교전</legend>{activeOpponents.map(opponent => <label key={opponent.id} className="combat-check"><input type="checkbox" checked={declaration.allyEngagedIds.includes(opponent.id)} onChange={() => toggleSupport(opponent.id)} /><span>아군이 {opponent.name}을 상대함</span></label>)}</fieldset>}
        <fieldset className="chapter7-enemy-plans"><legend>상대 행동 선언</legend>{activeOpponents.map(opponent => <SelectField key={opponent.id} label={opponent.name} value={declaration.enemyPlans[opponent.id] || (opponent.distance > 1 ? 'approach' : 'attack')} onChange={value => updateEnemyPlan(opponent.id, value)} options={[{ value: 'attack', label: '근접 공격' }, { value: 'defend', label: '방어' }, { value: 'grapple', label: '붙잡기' }, { value: 'uncontrolled', label: '무제어 공격' }, { value: 'ranged', label: '원거리 공격' }, { value: 'rapid_ranged', label: '원거리 속사' }, { value: 'aim', label: '조준' }, { value: 'reload', label: '재장전' }, { value: 'lance_charge', label: '마상창 돌격' }, { value: 'approach', label: '접근' }, { value: 'hold', label: '대기' }]} />)}</fieldset>
        {allocationIds.length > 1 && declaration.action !== 'dodge' && <fieldset className="chapter7-allocations"><legend>기술 {skillBase} 배분</legend>{allocationIds.map(id => <NumberField key={id} label={combat.opponents.find(opponent => opponent.id === id)?.name || id} value={declaration.allocations[id] ?? ''} max={skillBase} onChange={value => updateDeclaration('allocations', { ...declaration.allocations, [id]: value })} />)}</fieldset>}
        {(declaration.action === 'ranged' || Object.values(declaration.enemyPlans).some(value => ['ranged', 'rapid_ranged'].includes(value))) && <div className="chapter7-action-options">{declaration.action === 'ranged' && <><SelectField label="발사 방식" value={declaration.fireMode} onChange={value => updateDeclaration('fireMode', value)} options={[{ value: 'normal', label: '보통 사격' }, { value: 'rapid', label: '속사 · 2회, 기술 절반' }]} /><SelectField label="상대 방패 사용" value={declaration.shieldUse} onChange={value => updateDeclaration('shieldUse', value)} options={[{ value: 'active', label: '적극 엄폐 · 방패 값만큼' }, { value: 'passive', label: '수동 엄폐 · -3' }, { value: 'none', label: '방패 엄폐 없음' }]} /></>}<SelectField label="기사 방패 사용" value={declaration.playerShieldUse} onChange={value => updateDeclaration('playerShieldUse', value)} options={[{ value: 'active', label: '적극 엄폐 · 방패 값만큼' }, { value: 'passive', label: '수동 엄폐 · -3' }, { value: 'none', label: '방패 엄폐 없음' }]} /><SelectField label="날씨" value={declaration.weather} onChange={value => updateDeclaration('weather', value)} options={[{ value: 'clear', label: '맑음' }, { value: 'rain_snow', label: '비·눈 -5' }, { value: 'strong_wind', label: '강풍 -5' }, { value: 'heavy_storm', label: '폭풍 -15' }, { value: 'gale', label: '대풍 -20' }]} /></div>}
        {declaration.action === 'uncontrolled' && <SelectField label="상대 대응" value={declaration.uncontrolledDefense} onChange={value => updateDeclaration('uncontrolledDefense', value)} options={[{ value: 'free_attack', label: '먼저 자유 공격' }, { value: 'defend', label: '방어 · 양측 +10' }, { value: 'uncontrolled', label: '양측 동시 무제어 공격' }]} />}
        {declaration.action === 'attack' && WEAPON_PROFILES[combat.player.weaponId]?.hands === 1 && <label className="combat-check"><input type="checkbox" checked={declaration.twoHandedStrike} onChange={event => updateDeclaration('twoHandedStrike', event.target.checked)} /><span>한손 무기를 양손으로 사용 · 방패를 버리고 대결 -5, 피해 +1d6</span></label>}
        {combat.player.mounted && WEAPON_PROFILES[combat.player.weaponId]?.hands > 1 && <label className="combat-check"><input type="checkbox" checked={declaration.gmMountedTwoHandedApproved} onChange={event => updateDeclaration('gmMountedTwoHandedApproved', event.target.checked)} /><span>기마 양손 무기 사용을 GM이 예외 승인</span></label>}
        {combat.player.weaponId === 'shield' && <label className="combat-check"><input type="checkbox" checked={declaration.gmShieldTacticApproved} onChange={event => updateDeclaration('gmShieldTacticApproved', event.target.checked)} /><span>방패 공격과 전술 결합을 GM이 승인</span></label>}
        {['attack', 'double_feint', 'grapple_strike'].includes(declaration.action) && <SelectField label="비살상 피해" value={declaration.nonlethal} onChange={value => updateDeclaration('nonlethal', value)} options={[{ value: 'full', label: '보통 피해' }, { value: 'half', label: '둔화 또는 힘 조절 · 절반' }, { value: 'quarter', label: '둔화와 힘 조절 · 1/4' }]} />}
        {declaration.action === 'dex' && <div className="chapter7-action-options"><SelectField label="DEX 행동" value={declaration.dexAction.type} onChange={value => updateDex('type', value)} options={[{ value: 'balance', label: '균형' }, { value: 'climb', label: '등반' }, { value: 'jump', label: '도약' }, { value: 'sneak', label: '은신' }, { value: 'horse_jump', label: '말 도약' }, { value: 'custom', label: '기타 DEX 행동' }]} /><NumberField label="상황 수정" value={declaration.dexAction.modifier} min={-50} max={50} onChange={value => updateDex('modifier', value)} />{declaration.dexAction.type === 'climb' && <><SelectField label="등반 보조" value={declaration.dexAction.aid} onChange={value => updateDex('aid', value)} options={[{ value: 'none', label: '없음' }, { value: 'rope', label: '밧줄 +5' }, { value: 'ladder', label: '사다리 +10' }, { value: 'siege_ladder', label: '공성 사다리 +1d6+4' }]} /><NumberField label="높이 · 30피트마다 1회" value={declaration.dexAction.heightFeet} min={1} max={1000} onChange={value => updateDex('heightFeet', value)} /></>}{['jump', 'horse_jump'].includes(declaration.dexAction.type) && <label className="combat-check"><input type="checkbox" checked={declaration.dexAction.extended} onChange={event => updateDex('extended', event.target.checked)} /><span>기본 거리를 1피트·야드 초과 시도</span></label>}</div>}
        {declaration.action === 'awareness' && <SelectField label="관찰 기술" value={declaration.awarenessSkill} onChange={value => updateDeclaration('awarenessSkill', value)} options={[{ value: 'awareness', label: 'Awareness' }, { value: 'hunting', label: 'Hunting' }]} />}
        {declaration.action === 'rearm' && <div className="chapter7-action-options"><SelectField label="새 무기" value={declaration.rearmWeaponId} onChange={value => updateDeclaration('rearmWeaponId', value)} options={weaponOptions} /><NumberField label="새 방패 값 · 무기면 0" value={declaration.rearmShield} max={20} onChange={value => updateDeclaration('rearmShield', value)} /></div>}
        {declaration.action === 'squire' && <div className="chapter7-action-options"><SelectField label="종자 요청" value={declaration.squireRequest} onChange={value => updateDeclaration('squireRequest', value)} options={[{ value: 'weapon', label: '새 무기' }, { value: 'shield', label: '새 방패' }, { value: 'help', label: '기타 도움' }]} />{declaration.squireRequest === 'weapon' && <SelectField label="가져올 무기" value={declaration.rearmWeaponId} onChange={value => updateDeclaration('rearmWeaponId', value)} options={weaponOptions} />}{declaration.squireRequest === 'shield' && <NumberField label="방패 값" value={declaration.rearmShield || 6} max={20} onChange={value => updateDeclaration('rearmShield', value)} />}</div>}
        {declaration.action === 'grapple_rearm' && <SelectField label="재무장 판정" value={declaration.grappleRearmStat} onChange={value => updateDeclaration('grappleRearmStat', value)} options={[{ value: 'unarmed', label: 'Unarmed' }, { value: 'strength', label: 'STR' }]} />}
        {declaration.action === 'joust' && <div className="chapter7-action-options"><SelectField label="대실패 시 GM 결과" value={declaration.joustFumbleChoice} onChange={value => updateDeclaration('joustFumbleChoice', value)} options={[{ value: 'lance_broke', label: '마상창 파손' }, { value: 'struck_horse', label: '상대 말 가격' }, { value: 'self_fall', label: '스스로 낙마' }, { value: 'saddle_failure', label: '안장끈 파손과 낙마' }]} /><label className="combat-field"><span>GM 판단 메모</span><input value={declaration.joustFumbleNote} onChange={event => updateDeclaration('joustFumbleNote', event.target.value)} /></label></div>}
        {combat.player.missileWeaponId === 'thrownObject' && declaration.action === 'ranged' && <NumberField label="기타 투척물 최대 사거리 · GM" value={declaration.gmMaximumRange} min={1} max={1000} onChange={value => updateDeclaration('gmMaximumRange', value)} />}
        {movementActions.has(declaration.action) && <div className="chapter7-action-options"><SelectField label="기준 상대" value={declaration.movement.targetId} onChange={value => updateMovement('targetId', value)} options={activeOpponents.map(opponent => ({ value: opponent.id, label: opponent.name }))} /><SelectField label="방향" value={declaration.movement.direction} onChange={value => updateMovement('direction', value)} options={[{ value: 'toward', label: '접근' }, { value: 'away', label: '이탈 방향' }]} /><SelectField label="속도" value={declaration.movement.speed} onChange={value => updateMovement('speed', value)} options={[{ value: 'walk', label: '보통' }, { value: 'run', label: '달리기 · 2배' }, { value: 'sprint', label: '전력 질주 · 3배' }]} /><NumberField label="이동 야드" value={declaration.movement.yards} max={100} onChange={value => updateMovement('yards', value)} /><label className="combat-check"><input type="checkbox" checked={declaration.movement.gmFastMovementApproved} onChange={event => updateMovement('gmFastMovementApproved', event.target.checked)} /><span>근접 중 빠른 이동 GM 승인</span></label><label className="combat-check"><input type="checkbox" checked={declaration.movement.gmMultipleApproved} onChange={event => updateMovement('gmMultipleApproved', event.target.checked)} /><span>다수 상대 이탈 GM 승인</span></label></div>}
        <div className="chapter7-gm"><NumberField label="GM 상황 수정" value={declaration.gmModifier} min={-50} max={50} onChange={value => updateDeclaration('gmModifier', value)} /><label className="combat-field"><span>판단 근거</span><input value={declaration.gmNote} onChange={event => updateDeclaration('gmNote', event.target.value)} /></label></div>
        <label className="combat-check"><input type="checkbox" checked={declaration.experienceApproved} onChange={event => updateDeclaration('experienceApproved', event.target.checked)} /><span>주목할 승리에 대한 무기 경험 체크를 GM이 승인</span></label>
        <button type="button" className="primary-command" onClick={declare}><ChevronRight size={17} aria-hidden="true" />행동 확정</button>
      </div>}

      {combat.phase === 'resolution' && <div className="chapter7-resolution"><p><strong>{CHAPTER_7_ACTIONS[combat.declaration.action]?.label}</strong>을 선언했습니다. 판정 결과는 적용 전 별도로 저장됩니다.</p><div className="segmented-control" aria-label="주사위 방식"><button type="button" className={rollMode === 'automatic' ? 'active' : ''} onClick={() => setRollMode('automatic')}>앱 굴림</button><button type="button" className={rollMode === 'manual' ? 'active' : ''} onClick={() => setRollMode('manual')}>직접 굴림</button></div>{rollMode === 'manual' && <div className="chapter7-roll-grid"><NumberField label="기사 d20" value={rolls.actorRoll} min={1} max={20} onChange={value => updateRoll('actorRoll', value)} /><NumberField label="상대 d20" value={rolls.opponentRoll} min={1} max={20} onChange={value => updateRoll('opponentRoll', value)} /><NumberField label="기사 피해 합계" value={rolls.actorDamageTotal} max={999} onChange={value => updateRoll('actorDamageTotal', value)} /><NumberField label="상대 피해 합계" value={rolls.opponentDamageTotal} max={999} onChange={value => updateRoll('opponentDamageTotal', value)} /><label className="combat-field"><span>기사 피해 d6 · 쉼표</span><input value={rolls.actorDamageRolls} onChange={event => updateRoll('actorDamageRolls', event.target.value)} placeholder="6, 6, 3" /></label><label className="combat-field"><span>상대 피해 d6 · 쉼표</span><input value={rolls.opponentDamageRolls} onChange={event => updateRoll('opponentDamageRolls', event.target.value)} placeholder="6, 4, 2" /></label>{combat.declaration.action === 'double_feint' && <NumberField label="이중 페인트 DEX" value={rolls.feintRoll} min={1} max={20} onChange={value => updateRoll('feintRoll', value)} />}{combat.declaration.action === 'dex' && <><NumberField label="DEX d20" value={rolls.dexRoll} min={1} max={20} onChange={value => updateRoll('dexRoll', value)} /><NumberField label="STR d20" value={rolls.strRoll} min={1} max={20} onChange={value => updateRoll('strRoll', value)} /><NumberField label="Horsemanship d20" value={rolls.horsemanshipRoll} min={1} max={20} onChange={value => updateRoll('horsemanshipRoll', value)} /><NumberField label="공성 사다리 d6" value={rolls.siegeLadderRoll} min={1} max={6} onChange={value => updateRoll('siegeLadderRoll', value)} /></>}{combat.declaration.action === 'awareness' && <NumberField label="관찰 d20" value={rolls.awarenessRoll} min={1} max={20} onChange={value => updateRoll('awarenessRoll', value)} />}{combat.declaration.action === 'squire' && <NumberField label="종자 d20" value={rolls.squireRoll} min={1} max={20} onChange={value => updateRoll('squireRoll', value)} />}</div>}<button type="button" className="primary-command" onClick={resolve}><Dices size={17} aria-hidden="true" />판정 굴리기</button></div>}

      {combat.phase === 'winner' && pending && <div className="chapter7-pending"><header><div><span className="serial-label">판정 완료 · 아직 미적용</span><h3>승자와 피해 확인</h3></div><StatusSeal tone={pending.packets.length ? 'warning' : 'neutral'}>{pending.packets.length}건 피해</StatusSeal></header><div className="chapter7-exchanges">{pending.exchanges.map((exchange, index) => <div key={`${exchange.type}:${index}`}><strong>{exchange.type}</strong><span>{exchange.opposed ? ` · ${exchange.opposed.winner}` : ''}{exchange.actorCheck ? ` · 기사 ${checkLabels[exchange.actorCheck.outcome]}` : ''}{exchange.check ? ` · ${checkLabels[exchange.check.outcome]}` : ''}</span></div>)}</div>{pending.packets.map((packet, index) => <p key={`${packet.targetType}:${index}`}><HeartCrack size={15} aria-hidden="true" />{packet.targetType} · 굴림 피해 {packet.rolledDamage} · 갑옷 {packet.armor}{packet.shieldApplies ? ` · 방패 ${packet.shield}` : ''}</p>)}<button type="button" className="primary-command" onClick={apply}><Shield size={17} aria-hidden="true" />피해와 장비 결과 적용</button></div>}

      {combat.phase === 'movement' && pending && <div className="chapter7-movement"><p>승자와 패자 처리가 끝났습니다. 이동, 재장전, 승하마 또는 돌격 후 직진을 완료하면 다음 라운드가 시작됩니다.</p><button type="button" className="primary-command" onClick={completeMovement}><Footprints size={17} aria-hidden="true" />이동 단계 완료</button></div>}

      <details className="chapter7-horse-damage"><summary>말 피해와 낙마 직접 처리</summary><div><SelectField label="말 소유자" value={horseDamage.side} onChange={value => setHorseDamage(previous => ({ ...previous, side: value }))} options={[{ value: 'player', label: '기사의 말' }, { value: 'opponent', label: '상대의 말' }]} />{horseDamage.side === 'opponent' && <SelectField label="상대" value={horseDamage.targetId} onChange={value => setHorseDamage(previous => ({ ...previous, targetId: value }))} options={combat.opponents.filter(opponent => opponent.horse).map(opponent => ({ value: opponent.id, label: opponent.name }))} />}<NumberField label="굴림 피해" value={horseDamage.rolledDamage} max={999} onChange={value => setHorseDamage(previous => ({ ...previous, rolledDamage: value }))} /><label className="combat-check"><input type="checkbox" checked={horseDamage.direct} onChange={event => setHorseDamage(previous => ({ ...previous, direct: event.target.checked }))} /><span>마갑을 무시하는 직접 피해</span></label><label className="combat-check"><input type="checkbox" checked={horseDamage.fall} onChange={event => setHorseDamage(previous => ({ ...previous, fall: event.target.checked }))} /><span>말이 쓰러짐</span></label><button type="button" className="secondary-command" onClick={damageHorse}><HeartCrack size={17} aria-hidden="true" />말 피해 적용</button></div></details>

      <div className="chapter7-conclusion"><SelectField label="전투 결말" value={conclusion.result} onChange={value => setConclusion(previous => ({ ...previous, result: value }))} options={resultOptions} />{combat.returnContext?.type === 'mass_battle_special' && <NumberField label="특별 조우 개인 Glory" value={conclusion.combatGlory} max={10000} onChange={value => setConclusion(previous => ({ ...previous, combatGlory: value }))} />}<label className="combat-field"><span>연대기 메모</span><input value={conclusion.note} onChange={event => setConclusion(previous => ({ ...previous, note: event.target.value }))} /></label><button type="button" className="secondary-command" onClick={finish} disabled={combat.phase === 'winner'}><Check size={17} aria-hidden="true" />전투 종료</button></div>
      {combat.returnContext && <p className="chapter7-return"><Crosshair size={16} aria-hidden="true" />이 교전은 Chapter 8 절차에서 시작되었습니다. 종료 결과가 원래 전쟁 장부로 돌아갑니다.</p>}
      {error && <div className="winter-error" role="alert"><AlertTriangle size={17} aria-hidden="true" />{error}</div>}
    </section>
  );
}

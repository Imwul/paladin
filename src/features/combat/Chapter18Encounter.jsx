import { useMemo, useState } from 'react';
import { BookOpen, Check, Dices, ShieldAlert, Swords } from 'lucide-react';
import {
  advanceChapter18FearDelay,
  advanceNormalHorseBolt,
  chapter18MountToHorse,
  getChapter18Creature,
  getEquippedMarketCombat,
  listChapter18Creatures,
  resolveChapter18Gate,
  resolveChapter18GoblinVice,
  resolveChapter18PendingSpecial,
  resolveChapter18PrudentWithdrawal,
  resolveNormalHorseControl,
  recordChapter18AbilityDecision,
  selectChapter18Attack,
  setChapter18CreatureBehavior,
  startChapter18Encounter
} from '../../rules';

const categories = [
  { value: 'human', label: '사람과 기사' },
  { value: 'mount', label: '말과 탈것' },
  { value: 'hunting_animal', label: '사냥 동물' },
  { value: 'animal', label: '야생 동물' },
  { value: 'enchanted', label: '마법 존재' }
];

const SelectField = ({ label, value, onChange, options }) => (
  <label className="combat-field"><span>{label}</span><select value={value} onChange={event => onChange(event.target.value)}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
);

const NumberField = ({ label, value, onChange, min = 1, max = 1000 }) => (
  <label className="combat-field"><span>{label}</span><input type="number" value={value} min={min} max={max} onChange={event => onChange(event.target.value)} /></label>
);

const rangeFields = creature => ['siz', 'dex', 'str', 'con'].flatMap(key => {
  const value = creature?.stats?.[key];
  return value && typeof value === 'object' ? [{ key, label: key.toUpperCase(), ...value }] : [];
}).concat(['hp', 'armor', 'damageDice'].flatMap(key => {
  const value = creature?.[key];
  const label = key === 'hp' ? '생명력' : key === 'armor' ? '갑옷' : '피해 주사위';
  return value && typeof value === 'object' ? [{ key, label, ...value }] : [];
}));

const playerLoadout = character => {
  const loadout = getEquippedMarketCombat(character);
  const mount = loadout.mount?.combat;
  const horseArmor = loadout.horseArmor?.combat;
  const canonicalMount = loadout.mount && getChapter18Creature(loadout.mount.id)?.category === 'mount'
    ? chapter18MountToHorse(loadout.mount.id, {
      attackTrained: loadout.mount.attackTrained,
      armorType: horseArmor?.armorType || 'none', armorBonus: horseArmor?.armor || 0,
      movementDexPenalty: horseArmor?.moveDex || 0
    })
    : null;
  return {
    weaponId: loadout.weaponId || 'sword', missileWeaponId: loadout.missileWeaponId || 'bow',
    armor: loadout.armor ?? 10, armorType: loadout.armorType || 'chainmail', armorDexModifier: loadout.armorDexModifier ?? -5,
    shield: loadout.shield ?? 6, equipmentSkillBonus: loadout.weaponSkillBonus || 0,
    weaponBreakOnTie: Boolean(loadout.weaponBreakOnTie), weaponUnbreakable: Boolean(loadout.weaponUnbreakable),
    mounted: Boolean(mount), attackTrainedMount: Boolean(loadout.mount?.attackTrained),
    horse: canonicalMount || (mount ? {
      ...mount, profileKey: mount.profileKey || 'charger', attackTrained: Boolean(mount.attackTrained),
      armorType: horseArmor?.armorType || 'none', armorBonus: horseArmor?.armor || 0,
      movementDexPenalty: horseArmor?.moveDex || 0
    } : undefined)
  };
};

export default function Chapter18Encounter({ character, setCharacter }) {
  const active = character.campaign?.chapter18?.active;
  const combat = character.campaign?.combat;
  const [error, setError] = useState('');
  const [category, setCategory] = useState('human');
  const creatures = useMemo(() => listChapter18Creatures({ category }), [category]);
  const [creatureId, setCreatureId] = useState('young_knight');
  const creature = getChapter18Creature(creatures.some(item => item.id === creatureId) ? creatureId : creatures[0]?.id);
  const [attackId, setAttackId] = useState('');
  const [setup, setSetup] = useState({ count: 1, partySize: 1, victors: 1, distance: 1, mountId: '', overrides: {} });
  const [gate, setGate] = useState({ roll: '', fleeRounds: '' });
  const [horseRoll, setHorseRoll] = useState('');
  const [prudentRoll, setPrudentRoll] = useState('');
  const [special, setSpecial] = useState({ choice: 'lure_to_doom', note: '', remainingMoveYards: 1 });
  const [behavior, setBehavior] = useState({ opponentId: '', status: 'fled', note: '' });
  const [ability, setAbility] = useState({ creatureId: '', abilityId: '', choice: '', note: '' });
  const [goblin, setGoblin] = useState({ opponentId: '', vice: 'selfish', roll: '' });
  const selectedAttack = creature?.attacks?.find(item => item.id === attackId)
    || (creature?.attacks?.length === 1 ? creature.attacks[0] : null);
  const ranges = rangeFields(creature);
  const availableMounts = (creature?.mounts || []).map(getChapter18Creature).filter(item => item?.category === 'mount');

  const run = action => {
    try { setError(''); action(); } catch (caught) { setError(caught.message || 'Chapter 18 절차를 완료하지 못했습니다.'); }
  };
  const applyRule = resolver => run(() => setCharacter(resolver(character).character));
  const chooseCategory = value => {
    const first = listChapter18Creatures({ category: value })[0];
    setCategory(value); setCreatureId(first?.id || ''); setAttackId(''); setSetup(previous => ({ ...previous, mountId: '', overrides: {} }));
  };
  const chooseCreature = value => { setCreatureId(value); setAttackId(''); setSetup(previous => ({ ...previous, mountId: '', overrides: {} })); };
  const updateSetup = (key, value) => setSetup(previous => ({ ...previous, [key]: value }));
  const updateOverride = (key, value) => setSetup(previous => ({ ...previous, overrides: { ...previous.overrides, [key]: value } }));

  const begin = () => applyRule(current => startChapter18Encounter(current, {
    creatureIds: Array.from({ length: Number(setup.count) }, () => creature.id),
    attackId: selectedAttack?.id,
    mountId: setup.mountId || undefined,
    overrides: Object.fromEntries(ranges.map(field => [field.key, Number(setup.overrides[field.key] ?? field.min)])),
    partySize: Number(setup.partySize), victors: Number(setup.victors), distance: Number(setup.distance),
    player: playerLoadout(current)
  }));
  const resolveGate = () => applyRule(current => resolveChapter18Gate(current, {
    roll: gate.roll === '' ? undefined : Number(gate.roll),
    fleeRounds: gate.fleeRounds === '' ? undefined : Number(gate.fleeRounds)
  }));
  const advanceFear = () => applyRule(current => advanceChapter18FearDelay(current));
  const controlHorse = () => applyRule(current => resolveNormalHorseControl(current, { roll: horseRoll === '' ? undefined : Number(horseRoll) }));
  const advanceHorseBolt = () => applyRule(current => advanceNormalHorseBolt(current));
  const withdrawPrudently = () => applyRule(current => resolveChapter18PrudentWithdrawal(current, { roll: prudentRoll === '' ? undefined : Number(prudentRoll) }));
  const chooseAttack = (opponentId, value) => applyRule(current => selectChapter18Attack(current, { opponentId, attackId: value }));
  const resolveSpecial = () => applyRule(current => resolveChapter18PendingSpecial(current, {
    ...special, remainingMoveYards: Number(special.remainingMoveYards)
  }));
  const applyBehavior = () => applyRule(current => setChapter18CreatureBehavior(current, {
    ...behavior, opponentId: behavior.opponentId || current.campaign?.combat?.opponents?.[0]?.id
  }));
  const recordAbility = () => applyRule(current => recordChapter18AbilityDecision(current, {
    ...ability, creatureId: ability.creatureId || abilityCreature?.id
  }));
  const resolveGoblin = () => applyRule(current => resolveChapter18GoblinVice(current, {
    ...goblin, opponentId: goblin.opponentId || current.campaign?.combat?.opponents?.find(item => item.chapter18Id === 'goblin')?.id,
    roll: goblin.roll === '' ? undefined : Number(goblin.roll)
  }));

  if (!active && combat?.status === 'active' && combat.horseControl?.round === combat.round && ['pending', 'bolted'].includes(combat.horseControl.status)) {
    const boltResolved = combat.horseControl.status === 'bolted' && combat.horseControl.lastAttemptRound === combat.round;
    return <section className="chapter18-register chapter18-register--active" aria-label="일반 말 전투 통제"><div className="chapter18-gate"><div><strong>일반 말 통제</strong><p>{boltResolved ? '말이 전장을 벗어나 달립니다.' : '매 전투 라운드 Horsemanship 판정'} · Chapter 18 p.378</p></div>{!boltResolved && <NumberField label="Horsemanship d20 · 비우면 앱 굴림" value={horseRoll} min={1} max={20} onChange={setHorseRoll} />}<button type="button" className="secondary-command" onClick={boltResolved ? advanceHorseBolt : controlHorse}>{boltResolved ? <Swords size={17} aria-hidden="true" /> : <Dices size={17} aria-hidden="true" />}{boltResolved ? '도주 라운드 진행' : '말 통제'}</button></div>{error && <div className="winter-error" role="alert"><ShieldAlert size={17} aria-hidden="true" />{error}</div>}</section>;
  }

  if (!active) return <details className="chapter18-register" open={!combat || combat.status !== 'active'}>
    <summary><BookOpen size={17} aria-hidden="true" /><span>Chapter 18 원문 상대 불러오기</span></summary>
    <div className="chapter18-register__body">
      <p>대상의 원문 능력치와 공격을 불러와 Chapter 7 전투로 진행합니다.</p>
      <div className="chapter18-register__grid">
        <SelectField label="분류" value={category} onChange={chooseCategory} options={categories} />
        <SelectField label="대상" value={creature?.id || ''} onChange={chooseCreature} options={creatures.map(item => ({ value: item.id, label: `${item.name} · p.${item.sourcePage}` }))} />
        <SelectField label="사용할 공격" value={selectedAttack?.id || ''} onChange={setAttackId} options={creature?.attacks?.length ? [{ value: '', label: creature.attacks.length > 1 ? 'GM이 공격 선택' : creature.attacks[0].name }, ...creature.attacks.map(item => ({ value: item.id, label: `${item.name}${item.skill != null ? ` ${item.skill}` : ''}` }))] : [{ value: '', label: '원문 공격 없음' }]} />
        <NumberField label="교전 대상 수" value={setup.count} min={1} max={3} onChange={value => updateSetup('count', value)} />
        <NumberField label="기사단 인원" value={setup.partySize} min={1} max={100} onChange={value => updateSetup('partySize', value)} />
        <NumberField label="공적 분배 인원" value={setup.victors} min={1} max={100} onChange={value => updateSetup('victors', value)} />
        <NumberField label="초기 거리 · 야드" value={setup.distance} min={0} max={1000} onChange={value => updateSetup('distance', value)} />
        {availableMounts.length > 0 && <SelectField label="탑승 탈것 · GM 선택" value={setup.mountId} onChange={value => updateSetup('mountId', value)} options={[{ value: '', label: '보병' }, ...availableMounts.map(item => ({ value: item.id, label: `${item.name} · p.${item.sourcePage}` }))]} />}
        {ranges.map(field => <NumberField key={field.key} label={`${field.label} · GM 확정 ${field.min}-${field.max}`} value={setup.overrides[field.key] ?? field.min} min={field.min} max={field.max} onChange={value => updateOverride(field.key, value)} />)}
      </div>
      <div className="chapter18-source"><strong>{creature?.name}</strong><span>Chapter 18 p.{creature?.sourcePage}</span><span>HP {typeof creature?.hp === 'object' ? `${creature.hp.min}-${creature.hp.max}` : creature?.hp}</span><span>방어 {typeof creature?.armor === 'object' ? `${creature.armor.min}-${creature.armor.max}` : creature?.armor}</span><span>Move {creature?.move}</span></div>
      <button type="button" className="secondary-command" onClick={begin} disabled={!creature || (creature.attacks.length > 1 && !selectedAttack)}><Swords size={17} aria-hidden="true" />원문 상대와 교전 시작</button>
      {error && <div className="winter-error" role="alert"><ShieldAlert size={17} aria-hidden="true" />{error}</div>}
    </div>
  </details>;

  const pendingCheck = active.pendingChecks?.[0];
  const activeCreatures = [...new Map(active.creatureIds.map(id => [id, getChapter18Creature(id)])).values()].filter(Boolean);
  const abilityCreature = getChapter18Creature(ability.creatureId || activeCreatures.find(item => [...(item.specials || []), ...(item.vulnerabilities || [])].some(entry => ['gm_choice', 'structured_choice', 'narrative'].includes(entry.classification)))?.id);
  const recordableAbilities = [...(abilityCreature?.specials || []), ...(abilityCreature?.vulnerabilities || [])].filter(entry => ['gm_choice', 'structured_choice', 'narrative'].includes(entry.classification));
  const goblinOpponents = (combat?.opponents || []).filter(item => item.chapter18Id === 'goblin');
  return <section className="chapter18-register chapter18-register--active" aria-label="Chapter 18 진행 상태">
    <header><div><span className="serial-label">Chapter 18 · 원문 상대</span><h3>{active.creatureIds.map(id => getChapter18Creature(id)?.name).join(', ')}</h3></div><span>원문 p.{Math.min(...active.creatureIds.map(id => getChapter18Creature(id)?.sourcePage || 999))}</span></header>
    {pendingCheck && <div className="chapter18-gate"><div><strong>{pendingCheck.trait} 판정</strong><p>수정 {pendingCheck.modifier >= 0 ? '+' : ''}{pendingCheck.modifier} · {pendingCheck.reason}</p></div><NumberField label="d20 · 비우면 앱 굴림" value={gate.roll} min={1} max={20} onChange={value => setGate(previous => ({ ...previous, roll: value }))} /><NumberField label="대실패 도주 라운드 · 비우면 1d6" value={gate.fleeRounds} min={1} max={6} onChange={value => setGate(previous => ({ ...previous, fleeRounds: value }))} /><button type="button" className="primary-command" onClick={resolveGate}><Dices size={17} aria-hidden="true" />판정</button></div>}
    {active.fearDelay && <div className="chapter18-gate"><div><strong>{active.fearDelay.type}</strong><p>남은 {active.fearDelay.rounds}라운드. 원문 결과를 건너뛸 수 없습니다.</p></div><button type="button" className="secondary-command" onClick={advanceFear}>1라운드 진행</button></div>}
    {active.valorousPassed && !active.prudentAttempted && !active.pendingChecks?.length && !active.gateOutcome && <div className="chapter18-gate"><div><strong>신중하게 전투 피하기</strong><p>Valorous 성공 뒤 원한다면 Prudent 판정 · p.380</p></div><NumberField label="Prudent d20 · 비우면 앱 굴림" value={prudentRoll} min={1} max={20} onChange={setPrudentRoll} /><button type="button" className="secondary-command" onClick={withdrawPrudently}><Dices size={17} aria-hidden="true" />Prudent 판정</button></div>}
    {['prudent_withdrawal', 'required_prudent_refrain'].includes(active.gateOutcome) && <div className="chapter18-gate"><div><strong>전투를 피했습니다.</strong><p>Prudent 결과에 따라 이 조우를 종결할 수 있습니다.</p></div></div>}
    {combat?.horseControl?.round === combat.round && ['pending', 'bolted'].includes(combat.horseControl.status) && <div className="chapter18-gate"><div><strong>일반 말 통제</strong><p>{combat.horseControl.status === 'bolted' && combat.horseControl.lastAttemptRound === combat.round ? '말이 전장을 벗어나 달립니다.' : '매 전투 라운드 Horsemanship 판정'} · p.378</p></div>{!(combat.horseControl.status === 'bolted' && combat.horseControl.lastAttemptRound === combat.round) && <NumberField label="Horsemanship d20 · 비우면 앱 굴림" value={horseRoll} min={1} max={20} onChange={setHorseRoll} />}<button type="button" className="secondary-command" onClick={combat.horseControl.status === 'bolted' && combat.horseControl.lastAttemptRound === combat.round ? advanceHorseBolt : controlHorse}>{combat.horseControl.status === 'bolted' && combat.horseControl.lastAttemptRound === combat.round ? <Swords size={17} aria-hidden="true" /> : <Dices size={17} aria-hidden="true" />}{combat.horseControl.status === 'bolted' && combat.horseControl.lastAttemptRound === combat.round ? '도주 라운드 진행' : '말 통제'}</button></div>}
    {combat?.phase === 'determination' && <div className="chapter18-attacks">{combat.opponents.filter(opponent => opponent.chapter18Id).map(opponent => {
      const source = getChapter18Creature(opponent.chapter18Id);
      if ((source?.attacks?.length || 0) < 2) return null;
      return <SelectField key={opponent.id} label={`${opponent.name} 공격`} value={opponent.selectedAttackId || source.attacks[0].id} onChange={value => chooseAttack(opponent.id, value)} options={source.attacks.map(item => ({ value: item.id, label: `${item.name} ${item.skill ?? 'GM'}` }))} />;
    })}</div>}
    <details className="chapter18-abilities"><summary>공격·방어·특수능력 원문 항목</summary><div>{activeCreatures.map(item => <section key={item.id}><strong>{item.name} · p.{item.sourcePage}</strong><p>공격: {item.attacks.length ? item.attacks.map(attack => `${attack.name} ${attack.skill ?? 'GM'}`).join(', ') : '명시된 전투 공격 없음'}</p>{item.immunities?.length > 0 && <p>면역: {item.immunities.join(', ')}</p>}{item.vulnerabilities?.length > 0 && <p>취약·대응: {item.vulnerabilities.map(entry => entry.effect).join(', ')}</p>}{item.specials?.length > 0 && <p>특수: {item.specials.map(entry => entry.effect || entry.id).join(', ')}</p>}</section>)}</div></details>
    {active.pendingSpecial && <div className="chapter18-special"><strong>특수 결과 · {active.pendingSpecial.type}</strong>{active.pendingSpecial.type === 'siren_song' && <SelectField label="GM 원문 결과" value={special.choice} onChange={value => setSpecial(previous => ({ ...previous, choice: value }))} options={[{ value: 'lure_to_doom', label: '파멸로 유인' }, { value: 'magical_sleep', label: '마법 수면' }]} />}{active.pendingSpecial.type === 'griffin_drop' && <NumberField label="남은 이동 야드" value={special.remainingMoveYards} min={0} max={100} onChange={value => setSpecial(previous => ({ ...previous, remainingMoveYards: value }))} />}<label className="combat-field"><span>GM 기록</span><input value={special.note} onChange={event => setSpecial(previous => ({ ...previous, note: event.target.value }))} /></label><button type="button" className="secondary-command" onClick={resolveSpecial}><Check size={17} aria-hidden="true" />특수 결과 확정</button></div>}
    {goblinOpponents.length > 0 && <div className="chapter18-special"><strong>Goblin 죄악 극복 · p.385</strong><SelectField label="Goblin" value={goblin.opponentId || goblinOpponents[0].id} onChange={value => setGoblin(previous => ({ ...previous, opponentId: value }))} options={goblinOpponents.map(item => ({ value: item.id, label: item.name }))} /><SelectField label="죄악 · 대응 덕목" value={goblin.vice} onChange={value => setGoblin(previous => ({ ...previous, vice: value }))} options={[{ value: 'selfish', label: 'Selfish · Generous' }, { value: 'deceitful', label: 'Deceitful · Honest' }, { value: 'lustful', label: 'Lustful · Chaste' }, { value: 'cruel', label: 'Cruel · Merciful' }, { value: 'indulgent', label: 'Indulgent · Temperate' }, { value: 'lazy', label: 'Lazy · Energetic' }, { value: 'proud', label: 'Proud · Modest' }]} /><NumberField label="덕목 d20 · 비우면 앱 굴림" value={goblin.roll} min={1} max={20} onChange={value => setGoblin(previous => ({ ...previous, roll: value }))} /><button type="button" className="secondary-command" onClick={resolveGoblin}><Dices size={17} aria-hidden="true" />덕목 판정</button></div>}
    {activeCreatures.some(item => [...(item.specials || []), ...(item.vulnerabilities || [])].some(entry => ['gm_choice', 'structured_choice', 'narrative'].includes(entry.classification))) && <details className="chapter18-behavior"><summary>원문 GM·서술 능력 기록</summary><div><SelectField label="대상" value={abilityCreature?.id || ''} onChange={value => setAbility(previous => ({ ...previous, creatureId: value, abilityId: '' }))} options={activeCreatures.filter(item => [...(item.specials || []), ...(item.vulnerabilities || [])].some(entry => ['gm_choice', 'structured_choice', 'narrative'].includes(entry.classification))).map(item => ({ value: item.id, label: `${item.name} · p.${item.sourcePage}` }))} /><SelectField label="능력" value={ability.abilityId} onChange={value => setAbility(previous => ({ ...previous, creatureId: abilityCreature?.id || '', abilityId: value }))} options={[{ value: '', label: '원문 능력 선택' }, ...recordableAbilities.map(item => ({ value: item.id, label: `${item.id.replaceAll('_', ' ')} · ${item.effect || item.classification}` }))]} /><label className="combat-field"><span>선택·판단</span><input value={ability.choice} onChange={event => setAbility(previous => ({ ...previous, choice: event.target.value }))} /></label><label className="combat-field"><span>GM·서술 기록</span><input value={ability.note} onChange={event => setAbility(previous => ({ ...previous, note: event.target.value }))} /></label><button type="button" className="secondary-command" onClick={recordAbility} disabled={!ability.abilityId || !ability.note.trim()}>기록</button></div></details>}
    <details className="chapter18-behavior"><summary>GM 행동·퇴각 결과 기록</summary><div><SelectField label="대상" value={behavior.opponentId || combat?.opponents?.[0]?.id || ''} onChange={value => setBehavior(previous => ({ ...previous, opponentId: value }))} options={(combat?.opponents || []).map(item => ({ value: item.id, label: item.name }))} /><SelectField label="상태" value={behavior.status} onChange={value => setBehavior(previous => ({ ...previous, status: value }))} options={[{ value: 'active', label: '계속 교전' }, { value: 'fled', label: '도주' }, { value: 'surrendered', label: '항복' }, { value: 'defeated', label: '전투 불능' }]} /><label className="combat-field"><span>원문·GM 근거</span><input value={behavior.note} onChange={event => setBehavior(previous => ({ ...previous, note: event.target.value }))} /></label><button type="button" className="secondary-command" onClick={() => applyBehavior()} disabled={!behavior.opponentId && !combat?.opponents?.[0]?.id}>기록</button></div></details>
    {error && <div className="winter-error" role="alert"><ShieldAlert size={17} aria-hidden="true" />{error}</div>}
  </section>;
}

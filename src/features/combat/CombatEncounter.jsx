import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bandage,
  Check,
  Dices,
  HeartPulse,
  Shield,
  Skull,
  Swords
} from 'lucide-react';
import { FolioHeading, SectionHeader, StatusSeal } from '../../components/ui/LedgerUI';
import {
  COMBAT_PHASES,
  COMBAT_TACTICS,
  WEAPON_PROFILES,
  concludeCombat,
  confirmHealthDeath,
  getDerivedHealth,
  getWeaponDamageDice,
  resolveCombatRound,
  resolveFirstAid,
  resolveHazard,
  resolveMajorWoundCourage,
  resolveWeeklyRecovery,
  startCombat
} from '../../rules/combatRules';
import './CombatEncounter.css';

const armorOptions = [
  { value: 'none', label: '없음' },
  { value: 'leather', label: '가죽' },
  { value: 'chainmail', label: '사슬갑옷' },
  { value: 'plate', label: '판금갑옷' }
];

const tacticOptions = Object.entries(COMBAT_TACTICS);
const weaponOptions = Object.entries(WEAPON_PROFILES);
const outcomeLabel = {
  actor: '기사가 승리',
  opponent: '적이 승리',
  tie: '비김',
  bothFail: '양측 실패',
  noCombat: '교전 없음'
};
const checkLabel = { critical: '대성공', success: '성공', failure: '실패', fumble: '대실패' };
const woundLabel = { light: '가벼운 상처', major: '큰 부상', mortal: '치명상' };
const resultLabel = { victory: '승리', defeat: '패배', withdrawal: '철수', truce: '휴전' };

const NumberField = ({ label, value, onChange, min, max, disabled = false }) => (
  <label className="combat-field">
    <span>{label}</span>
    <input type="number" value={value} min={min} max={max} disabled={disabled} onChange={event => onChange(event.target.value)} />
  </label>
);

const SelectField = ({ label, value, onChange, options }) => (
  <label className="combat-field">
    <span>{label}</span>
    <select value={value} onChange={event => onChange(event.target.value)}>
      {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </label>
);

const CombatantSummary = ({ name, hp, maxHp, skill, damage, armor, shield, tone = 'neutral' }) => (
  <section className={`combatant-summary combatant-summary--${tone}`}>
    <header><strong>{name}</strong><StatusSeal tone={hp <= 0 ? 'danger' : tone}>{hp <= 0 ? '위독' : '교전 중'}</StatusSeal></header>
    <div className="combatant-summary__hp"><span>생명력</span><b>{hp}</b><small>/ {maxHp}</small></div>
    <dl>
      <div><dt>전투 기술</dt><dd>{skill}</dd></div>
      <div><dt>피해</dt><dd>{damage}</dd></div>
      <div><dt>갑옷</dt><dd>{armor}</dd></div>
      <div><dt>방패</dt><dd>{shield}</dd></div>
    </dl>
  </section>
);

const RuleTables = () => (
  <details className="combat-rule-tables">
    <summary>치료와 회복 표 확인 <span>Tables 7-3 to 7-5</span></summary>
    <div className="combat-rule-tables__grid">
      <table>
        <caption>응급처치</caption>
        <thead><tr><th>판정</th><th>효과</th></tr></thead>
        <tbody>
          <tr><td>대성공</td><td>1d3+3 회복</td></tr>
          <tr><td>성공</td><td>1d3 회복</td></tr>
          <tr><td>실패</td><td>회복 없음</td></tr>
          <tr><td>대실패</td><td>1d3 손실, 외과 필요</td></tr>
        </tbody>
      </table>
      <table>
        <caption>외과 치료</caption>
        <thead><tr><th>판정</th><th>효과</th></tr></thead>
        <tbody>
          <tr><td>대성공</td><td>회복률 2배, 악화 없음</td></tr>
          <tr><td>성공</td><td>상태 악화 없음</td></tr>
          <tr><td>실패</td><td>1d6 상태 악화</td></tr>
          <tr><td>대실패</td><td>즉시 1d3 및 1d6 상태 악화</td></tr>
        </tbody>
      </table>
      <table>
        <caption>건강과 활동</caption>
        <thead><tr><th>상태</th><th>활동 결과</th></tr></thead>
        <tbody>
          <tr><td>3/4 초과</td><td>모든 활동 가능</td></tr>
          <tr><td>3/4 미만</td><td>격렬한 활동은 자연 회복 취소</td></tr>
          <tr><td>1/2 미만</td><td>격렬한 활동은 회복 취소 및 악화</td></tr>
          <tr><td>불건강</td><td>보통·격렬 활동은 회복 취소 및 악화</td></tr>
        </tbody>
      </table>
    </div>
  </details>
);

export default function CombatEncounter({ character, setCharacter }) {
  const health = getDerivedHealth(character.attributes);
  const healthState = character.campaign?.health || {};
  const encounter = character.campaign?.combat;
  const active = encounter?.status === 'active';
  const [error, setError] = useState('');
  const [rollMode, setRollMode] = useState('automatic');
  const [setup, setSetup] = useState({
    playerWeapon: 'sword', playerArmor: 10, playerArmorType: 'chainmail', playerShield: 6, playerMounted: false,
    opponentName: '색슨 전사', opponentSkill: 12, opponentDex: 10, opponentSiz: 12, opponentCon: 12,
    opponentDamageDice: 4, opponentWeapon: 'axe', opponentArmor: 6, opponentArmorType: 'chainmail', opponentShield: 6, opponentMounted: false
  });
  const [roundInput, setRoundInput] = useState({
    actorTactic: 'standard', opponentTactic: 'standard', actorModifier: 0, opponentModifier: 0,
    actorRoll: '', opponentRoll: '', actorFeintRoll: '', opponentFeintRoll: '', actorDamageTotal: '', opponentDamageTotal: '',
    actorCharging: false, opponentCharging: false, actorNonlethal: 'full', opponentNonlethal: 'full', forcedContinuation: false
  });
  const [courageRoll, setCourageRoll] = useState('');
  const [conclusion, setConclusion] = useState({ result: 'victory', note: '' });
  const [firstAid, setFirstAid] = useState({ ageInHours: 0, roll: '' });
  const [recovery, setRecovery] = useState({ activity: 'none', conditionsModifier: 0, caregivers: 1, roll: '', aggravationDamage: 1 });
  const [hazard, setHazard] = useState({ type: 'fall', distanceFeet: 6, weightPounds: 10, armor: 0, rounds: 1, intensityDice: 1, potencyDice: 1, damage: 1, conRolls: '' });

  const playerProfile = WEAPON_PROFILES[encounter?.player?.weaponId || setup.playerWeapon];
  const opponentProfile = WEAPON_PROFILES[encounter?.opponent?.weaponId || setup.opponentWeapon];
  const latestRound = encounter?.rounds?.at(-1);
  const playerDamageDice = getWeaponDamageDice({
    baseDamageDice: health.damageDice,
    weaponId: encounter?.player?.weaponId || setup.playerWeapon,
    defenderArmorType: encounter?.opponent?.armorType || setup.opponentArmorType
  });
  const opponentHealth = getDerivedHealth({
    siz: encounter?.opponent?.siz || setup.opponentSiz,
    con: encounter?.opponent?.con || setup.opponentCon,
    str: encounter?.opponent?.siz || setup.opponentSiz,
    currentHp: encounter?.opponent?.currentHp
  });
  const opponentDamageDice = getWeaponDamageDice({
    baseDamageDice: encounter?.opponent?.damageDice || setup.opponentDamageDice,
    weaponId: encounter?.opponent?.weaponId || setup.opponentWeapon,
    defenderArmorType: encounter?.player?.armorType || setup.playerArmorType
  });
  const untreatedWounds = useMemo(() => (healthState.wounds || []).filter(wound => !wound.treated), [healthState.wounds]);

  const changeSetup = (key, value) => setSetup(previous => ({ ...previous, [key]: value }));
  const changeRound = (key, value) => setRoundInput(previous => ({ ...previous, [key]: value }));
  const run = action => {
    try {
      setError('');
      action();
    } catch (caught) {
      setError(caught.message || '판정을 완료하지 못했습니다.');
    }
  };

  const beginEncounter = () => run(() => setCharacter(previous => startCombat(previous, {
    player: {
      weaponId: setup.playerWeapon,
      armor: setup.playerArmor,
      armorType: setup.playerArmorType,
      shield: WEAPON_PROFILES[setup.playerWeapon].hands > 1 ? 0 : setup.playerShield,
      mounted: setup.playerMounted,
      horseDamageDice: 6
    },
    opponent: {
      name: setup.opponentName,
      skill: setup.opponentSkill,
      dex: setup.opponentDex,
      siz: setup.opponentSiz,
      con: setup.opponentCon,
      damageDice: setup.opponentDamageDice,
      weaponId: setup.opponentWeapon,
      armor: setup.opponentArmor,
      armorType: setup.opponentArmorType,
      shield: WEAPON_PROFILES[setup.opponentWeapon].hands > 1 ? 0 : setup.opponentShield,
      mounted: setup.opponentMounted,
      horseDamageDice: 6
    }
  })));

  const resolveRound = () => run(() => {
    if (rollMode === 'manual' && (roundInput.actorRoll === '' || roundInput.opponentRoll === '')) throw new RangeError('직접 굴림에서는 양측 d20 결과를 모두 입력하세요.');
    if (rollMode === 'manual' && roundInput.actorTactic === 'doubleFeint' && roundInput.actorFeintRoll === '') throw new RangeError('기사의 이중 페인트 DEX d20 결과를 입력하세요.');
    if (rollMode === 'manual' && roundInput.opponentTactic === 'doubleFeint' && roundInput.opponentFeintRoll === '') throw new RangeError('상대의 이중 페인트 DEX d20 결과를 입력하세요.');
    setCharacter(previous => resolveCombatRound(previous, {
      ...roundInput,
      actorRoll: rollMode === 'manual' ? Number(roundInput.actorRoll) : undefined,
      opponentRoll: rollMode === 'manual' ? Number(roundInput.opponentRoll) : undefined,
      actorFeintRoll: rollMode === 'manual' && roundInput.actorTactic === 'doubleFeint' ? Number(roundInput.actorFeintRoll) : undefined,
      opponentFeintRoll: rollMode === 'manual' && roundInput.opponentTactic === 'doubleFeint' ? Number(roundInput.opponentFeintRoll) : undefined,
      actorDamageTotal: rollMode === 'manual' && roundInput.actorDamageTotal !== '' ? Number(roundInput.actorDamageTotal) : undefined,
      opponentDamageTotal: rollMode === 'manual' && roundInput.opponentDamageTotal !== '' ? Number(roundInput.opponentDamageTotal) : undefined
    }).character);
  });

  const finishEncounter = () => run(() => setCharacter(previous => concludeCombat(previous, conclusion)));

  const resolveCourage = () => run(() => {
    if (rollMode === 'manual' && courageRoll === '') throw new RangeError('직접 굴린 Valorous d20 결과를 입력하세요.');
    setCharacter(previous => resolveMajorWoundCourage(previous, {
      roll: rollMode === 'manual' ? Number(courageRoll) : undefined
    }).character);
  });

  const treatWound = woundId => run(() => {
    if (rollMode === 'manual' && firstAid.roll === '') throw new RangeError('직접 굴린 응급처치 d20 결과를 입력하세요.');
    setCharacter(previous => resolveFirstAid(previous, {
      woundId,
      ageInHours: Number(firstAid.ageInHours),
      roll: rollMode === 'manual' ? Number(firstAid.roll) : undefined
    }).character);
  });

  const recoverWeek = () => run(() => {
    if (rollMode === 'manual' && healthState.surgeryNeeded && recovery.roll === '') throw new RangeError('직접 굴린 외과 치료 d20 결과를 입력하세요.');
    setCharacter(previous => resolveWeeklyRecovery(previous, {
      activity: recovery.activity,
      conditionsModifier: Number(recovery.conditionsModifier),
      caregivers: Number(recovery.caregivers),
      chirurgeryRoll: rollMode === 'manual' && healthState.surgeryNeeded ? Number(recovery.roll) : undefined,
      aggravationDamage: Number(recovery.aggravationDamage)
    }).character);
  });

  const applyHazard = () => run(() => setCharacter(previous => resolveHazard(previous, {
    ...hazard,
    distanceFeet: Number(hazard.distanceFeet),
    weightPounds: Number(hazard.weightPounds),
    armor: Number(hazard.armor),
    rounds: Number(hazard.rounds),
    intensityDice: Number(hazard.intensityDice),
    potencyDice: Number(hazard.potencyDice),
    damage: Number(hazard.damage),
    conRolls: String(hazard.conRolls).split(',').map(value => Number(value.trim())).filter(value => value >= 1 && value <= 20)
  }).character));

  const confirmDeath = () => {
    if (!window.confirm('자정까지 생명력을 양수로 회복하지 못한 사망을 확정합니다. 계승 절차로 이어집니다.')) return;
    run(() => setCharacter(previous => confirmHealthDeath(previous).character));
  };

  return (
    <article className="folio-page combat-ledger view-animate">
      <FolioHeading eyebrow="Liber Certaminum · Chapter Seven" title="전투와 회복" year={character.personal?.campaignYear || 767}>
        개인 전투의 다섯 단계와 상처별 치료를 한 장부에서 처리합니다.
      </FolioHeading>

      <section className="health-register" aria-label="현재 건강 상태">
        <div><HeartPulse size={18} aria-hidden="true" /><span>생명력</span><strong>{health.currentHp}<small>/ {health.totalHp}</small></strong></div>
        <div><Activity size={18} aria-hidden="true" /><span>의식 한계</span><strong>{health.unconsciousThreshold}</strong></div>
        <div><Shield size={18} aria-hidden="true" /><span>큰 부상 한계</span><strong>{health.majorWoundThreshold}</strong></div>
        <div><Bandage size={18} aria-hidden="true" /><span>회복률</span><strong>{health.healingRate}</strong></div>
        <div><Swords size={18} aria-hidden="true" /><span>부상 수정</span><strong>{health.woundPenalty}</strong></div>
        <div><AlertTriangle size={18} aria-hidden="true" /><span>상태</span><StatusSeal tone={healthState.pendingDeath ? 'danger' : healthState.surgeryNeeded ? 'warning' : 'active'}>{healthState.pendingDeath ? '자정 사망 대기' : healthState.surgeryNeeded ? '외과 필요' : healthState.unconscious ? '의식 없음' : '건강'}</StatusSeal></div>
      </section>

      {healthState.pendingDeath && (
        <div className="combat-critical-notice" role="alert">
          <Skull size={22} aria-hidden="true" />
          <div><strong>생명력이 0 이하입니다.</strong><p>같은 날 자정 전에 양수로 회복하지 못하면 사망합니다. 치명상은 1시간 안에 응급처치를 받아야 합니다.</p></div>
          <button type="button" className="secondary-command" onClick={confirmDeath}>자정 사망 확정</button>
        </div>
      )}

      {healthState.majorWoundCourage?.status === 'pending' && (
        <div className="combat-critical-notice" role="alert">
          <AlertTriangle size={22} aria-hidden="true" />
          <div><strong>큰 부상을 입고도 의식을 유지했습니다.</strong><p>전투를 계속하려면 Valorous 판정에 성공해야 합니다. 실패하면 강제로 몰리지 않는 한 다시 교전할 수 없고, 대실패하면 도주하거나 항복해야 합니다.</p></div>
          {rollMode === 'manual' && <NumberField label="Valorous d20" value={courageRoll} min="1" max="20" onChange={setCourageRoll} />}
          <button type="button" className="secondary-command" onClick={resolveCourage}>용기 판정</button>
        </div>
      )}

      {healthState.majorWoundCourage?.status === 'blocked' && (
        <div className="combat-critical-notice" role="status">
          <AlertTriangle size={22} aria-hidden="true" />
          <div><strong>Valorous 판정에 실패했습니다.</strong><p>기사는 스스로 전투에 재진입할 수 없습니다. 적에게 포위되는 등 외부 상황으로 강제될 때만 다음 라운드를 진행합니다.</p></div>
          <label className="combat-check"><input type="checkbox" checked={roundInput.forcedContinuation} onChange={event => changeRound('forcedContinuation', event.target.checked)} /><span>외부 상황으로 강제 재진입</span></label>
        </div>
      )}

      {healthState.majorWoundCourage?.status === 'must_withdraw' && (
        <div className="combat-critical-notice" role="alert">
          <AlertTriangle size={22} aria-hidden="true" />
          <div><strong>Valorous 대실패입니다.</strong><p>기사는 도주하거나 항복해야 합니다. 아래 전투 결말에서 철수 또는 패배를 기록해 교전을 마치세요.</p></div>
        </div>
      )}

      <SectionHeader index="I" title="교전 장부" meta="Determination to Movement" />
      {!active ? (
        <section className="combat-setup" aria-labelledby="combat-setup-title">
          <header><div><span className="serial-label">새 교전</span><h2 id="combat-setup-title">상대와 장비 등록</h2></div>{encounter?.status === 'concluded' && <StatusSeal tone="neutral">이전 전투 {resultLabel[encounter.outcome?.result]}</StatusSeal>}</header>
          <div className="combat-setup__columns">
            <fieldset>
              <legend>기사</legend>
              <SelectField label="무기" value={setup.playerWeapon} onChange={value => changeSetup('playerWeapon', value)} options={weaponOptions.map(([value, item]) => ({ value, label: item.label }))} />
              <NumberField label="갑옷" value={setup.playerArmor} min="0" max="100" onChange={value => changeSetup('playerArmor', value)} />
              <SelectField label="갑옷 종류" value={setup.playerArmorType} onChange={value => changeSetup('playerArmorType', value)} options={armorOptions} />
              <NumberField label="방패" value={WEAPON_PROFILES[setup.playerWeapon].hands > 1 ? 0 : setup.playerShield} min="0" max="100" disabled={WEAPON_PROFILES[setup.playerWeapon].hands > 1} onChange={value => changeSetup('playerShield', value)} />
              <label className="combat-check"><input type="checkbox" checked={setup.playerMounted} onChange={event => changeSetup('playerMounted', event.target.checked)} /><span>기마 상태</span></label>
            </fieldset>
            <fieldset>
              <legend>상대</legend>
              <label className="combat-field"><span>이름</span><input value={setup.opponentName} onChange={event => changeSetup('opponentName', event.target.value)} /></label>
              <SelectField label="무기" value={setup.opponentWeapon} onChange={value => changeSetup('opponentWeapon', value)} options={weaponOptions.map(([value, item]) => ({ value, label: item.label }))} />
              <NumberField label="전투 기술" value={setup.opponentSkill} min="0" max="100" onChange={value => changeSetup('opponentSkill', value)} />
              <NumberField label="피해 주사위" value={setup.opponentDamageDice} min="1" max="30" onChange={value => changeSetup('opponentDamageDice', value)} />
              <NumberField label="SIZ" value={setup.opponentSiz} min="1" max="100" onChange={value => changeSetup('opponentSiz', value)} />
              <NumberField label="CON" value={setup.opponentCon} min="1" max="100" onChange={value => changeSetup('opponentCon', value)} />
              <NumberField label="DEX" value={setup.opponentDex} min="0" max="100" onChange={value => changeSetup('opponentDex', value)} />
              <NumberField label="갑옷" value={setup.opponentArmor} min="0" max="100" onChange={value => changeSetup('opponentArmor', value)} />
              <SelectField label="갑옷 종류" value={setup.opponentArmorType} onChange={value => changeSetup('opponentArmorType', value)} options={armorOptions} />
              <NumberField label="방패" value={WEAPON_PROFILES[setup.opponentWeapon].hands > 1 ? 0 : setup.opponentShield} min="0" max="100" disabled={WEAPON_PROFILES[setup.opponentWeapon].hands > 1} onChange={value => changeSetup('opponentShield', value)} />
              <label className="combat-check"><input type="checkbox" checked={setup.opponentMounted} onChange={event => changeSetup('opponentMounted', event.target.checked)} /><span>기마 상태</span></label>
            </fieldset>
          </div>
          <button type="button" className="primary-command" onClick={beginEncounter}><Swords size={17} aria-hidden="true" />교전 시작</button>
        </section>
      ) : (
        <section className="combat-active" aria-label="진행 중인 교전">
          <ol className="combat-phases" aria-label="전투 단계">
            {COMBAT_PHASES.map((phase, index) => <li key={phase.id}><span>{String(index + 1).padStart(2, '0')}</span><b>{phase.label}</b></li>)}
          </ol>
          <div className="combatants">
            <CombatantSummary name={character.personal?.name || '이름 없는 기사'} hp={health.currentHp} maxHp={health.totalHp} skill={character.skills?.[playerProfile.skillKey] || 0} damage={`${playerDamageDice}d6`} armor={encounter.player.armor} shield={encounter.player.shield} tone="active" />
            <div className="combatants__versus" aria-hidden="true">대</div>
            <CombatantSummary name={encounter.opponent.name} hp={encounter.opponent.currentHp} maxHp={opponentHealth.totalHp} skill={encounter.opponent.skill} damage={`${opponentDamageDice}d6`} armor={encounter.opponent.armor} shield={encounter.opponent.shield} tone="warning" />
          </div>

          <div className="combat-round-form">
            <header><div><span className="serial-label">Round {encounter.round + 1}</span><h2>행동 선언</h2></div><div className="segmented-control" aria-label="주사위 방식"><button type="button" className={rollMode === 'automatic' ? 'active' : ''} onClick={() => setRollMode('automatic')}>앱 굴림</button><button type="button" className={rollMode === 'manual' ? 'active' : ''} onClick={() => setRollMode('manual')}>직접 굴림</button></div></header>
            <div className="combat-round-form__grid">
              <SelectField label="기사 전술" value={roundInput.actorTactic} onChange={value => changeRound('actorTactic', value)} options={tacticOptions.map(([value, item]) => ({ value, label: item.optional ? `${item.label} · 선택 규칙` : item.label }))} />
              <SelectField label="상대 전술" value={roundInput.opponentTactic} onChange={value => changeRound('opponentTactic', value)} options={tacticOptions.map(([value, item]) => ({ value, label: item.optional ? `${item.label} · 선택 규칙` : item.label }))} />
              <NumberField label="기사 상황 수정" value={roundInput.actorModifier} min="-50" max="50" onChange={value => changeRound('actorModifier', value)} />
              <NumberField label="상대 상황 수정" value={roundInput.opponentModifier} min="-50" max="50" onChange={value => changeRound('opponentModifier', value)} />
              <SelectField label="기사 피해 방식" value={roundInput.actorNonlethal} onChange={value => changeRound('actorNonlethal', value)} options={[{ value: 'full', label: '보통 피해' }, { value: 'half', label: '무딘 무기 또는 힘 조절 · 절반' }, { value: 'quarter', label: '둘 다 · 1/4' }]} />
              <SelectField label="상대 피해 방식" value={roundInput.opponentNonlethal} onChange={value => changeRound('opponentNonlethal', value)} options={[{ value: 'full', label: '보통 피해' }, { value: 'half', label: '무딘 무기 또는 힘 조절 · 절반' }, { value: 'quarter', label: '둘 다 · 1/4' }]} />
              {playerProfile.lance && encounter.player.mounted && <label className="combat-check"><input type="checkbox" checked={roundInput.actorCharging} onChange={event => changeRound('actorCharging', event.target.checked)} /><span>기사 마상창 돌격</span></label>}
              {opponentProfile.lance && encounter.opponent.mounted && <label className="combat-check"><input type="checkbox" checked={roundInput.opponentCharging} onChange={event => changeRound('opponentCharging', event.target.checked)} /><span>상대 마상창 돌격</span></label>}
            </div>
            {rollMode === 'manual' && (
              <fieldset className="combat-manual-rolls">
                <legend>직접 굴린 결과</legend>
                <NumberField label="기사 d20" value={roundInput.actorRoll} min="1" max="20" onChange={value => changeRound('actorRoll', value)} />
                <NumberField label="상대 d20" value={roundInput.opponentRoll} min="1" max="20" onChange={value => changeRound('opponentRoll', value)} />
                {roundInput.actorTactic === 'doubleFeint' && <NumberField label="기사 DEX d20" value={roundInput.actorFeintRoll} min="1" max="20" onChange={value => changeRound('actorFeintRoll', value)} />}
                {roundInput.opponentTactic === 'doubleFeint' && <NumberField label="상대 DEX d20" value={roundInput.opponentFeintRoll} min="1" max="20" onChange={value => changeRound('opponentFeintRoll', value)} />}
                <NumberField label="기사 피해 합계 · 선택" value={roundInput.actorDamageTotal} min="0" onChange={value => changeRound('actorDamageTotal', value)} />
                <NumberField label="상대 피해 합계 · 선택" value={roundInput.opponentDamageTotal} min="0" onChange={value => changeRound('opponentDamageTotal', value)} />
              </fieldset>
            )}
            <button type="button" className="primary-command" onClick={resolveRound} disabled={healthState.unconscious || health.currentHp <= 0 || healthState.majorWoundCourage?.status === 'pending' || healthState.majorWoundCourage?.status === 'must_withdraw' || (healthState.majorWoundCourage?.status === 'blocked' && !roundInput.forcedContinuation)}><Dices size={17} aria-hidden="true" />다섯 단계 판정</button>
          </div>

          {latestRound && (
            <section className="combat-round-result" aria-live="polite">
              <header><div><span className="serial-label">Round {latestRound.number}</span><h2>{outcomeLabel[latestRound.opposed.winner]}</h2></div>{latestRound.damage && <StatusSeal tone={latestRound.damage.side === 'actor' ? 'active' : 'danger'}>{latestRound.damage.total}점 굴림</StatusSeal>}</header>
              <dl>
                <div><dt>기사 판정</dt><dd>d20 {latestRound.rolls.actor.roll} / {latestRound.targets.actor.target} · {checkLabel[latestRound.rolls.actor.outcome]}</dd></div>
                <div><dt>상대 판정</dt><dd>d20 {latestRound.rolls.opponent.roll} / {latestRound.targets.opponent.target} · {checkLabel[latestRound.rolls.opponent.outcome]}</dd></div>
                <div><dt>피해 처리</dt><dd>{latestRound.damage ? `${latestRound.damage.dice}d6 = ${latestRound.damage.total}, 갑옷 ${latestRound.damage.armor}${latestRound.damage.shieldApplies ? `, 방패 ${latestRound.damage.shield}` : ''}` : '피해 없음'}</dd></div>
                <div><dt>부상 결과</dt><dd>{latestRound.injury?.actualDamage ? `기사 ${latestRound.injury.actualDamage}점 · ${woundLabel[latestRound.injury.classification] || '직접 피해'}` : latestRound.opponentInjury?.actualDamage ? `상대 ${latestRound.opponentInjury.actualDamage}점 · ${woundLabel[latestRound.opponentInjury.classification] || '직접 피해'}` : '상처 없음'}</dd></div>
              </dl>
              {(latestRound.injury?.knockedDown || latestRound.opponentInjury?.knockedDown) && <p className="combat-result-note"><AlertTriangle size={15} aria-hidden="true" />{latestRound.injury?.knockedDown ? '기사가 넘어졌습니다.' : '상대가 넘어졌습니다.'} 다음 이동 단계에 일어나기 전까지 -5/+5 수정이 필요합니다.</p>}
              {(latestRound.fallInjury?.actualDamage || latestRound.opponentFallInjury?.actualDamage) && <p className="combat-result-note"><AlertTriangle size={15} aria-hidden="true" />낙마 피해 {latestRound.fallInjury?.actualDamage || latestRound.opponentFallInjury.actualDamage}점이 별도 상처로 기록되었습니다.</p>}
              {(latestRound.actorUnconsciousMountCheck || latestRound.opponentUnconsciousMountCheck) && <p className="combat-result-note"><AlertTriangle size={15} aria-hidden="true" />의식 상실 낙마 DEX 판정: d20 {latestRound.actorUnconsciousMountCheck?.roll || latestRound.opponentUnconsciousMountCheck.roll} · {(latestRound.actorUnconsciousMountCheck || latestRound.opponentUnconsciousMountCheck).success ? '낙마 피해 회피' : '낙마 피해 발생'}</p>}
              {latestRound.injury?.attributeLoss?.rolls?.length > 0 && (
                <p className="combat-result-note"><AlertTriangle size={15} aria-hidden="true" />큰 부상 직후 Table 10-2: d6 {latestRound.injury.attributeLoss.rolls.join(', ')} · {latestRound.injury.attributeLoss.losses.length ? latestRound.injury.attributeLoss.losses.map(loss => `${loss.key.toUpperCase()} ${loss.before}→${loss.after}`).join(', ') : '능력치 손실 없음'}</p>
              )}
            </section>
          )}

          <div className="combat-conclusion">
            <SelectField label="전투 결말" value={conclusion.result} onChange={value => setConclusion(previous => ({ ...previous, result: value }))} options={Object.entries(resultLabel).map(([value, label]) => ({ value, label }))} />
            <label className="combat-field"><span>연대기 메모</span><input value={conclusion.note} onChange={event => setConclusion(previous => ({ ...previous, note: event.target.value }))} /></label>
            <button type="button" className="secondary-command" onClick={finishEncounter}><Check size={17} aria-hidden="true" />전투 종료</button>
          </div>
        </section>
      )}

      <SectionHeader index="II" title="상처와 응급처치" meta="Wounds · First Aid" />
      <section className="wound-ledger">
        {healthState.wounds?.length ? (
          <div className="wound-table-wrap">
            <table>
              <thead><tr><th>연도</th><th>상처</th><th>실제 피해</th><th>분류</th><th>처치</th></tr></thead>
              <tbody>
                {[...healthState.wounds].reverse().map(wound => (
                  <tr key={wound.id}>
                    <td>{wound.year}</td><td>{wound.source}</td><td>{wound.actualDamage}</td><td>{woundLabel[wound.classification]}</td>
                    <td>{wound.treated ? <span>{wound.firstAid ? `${checkLabel[wound.firstAid.outcome]} · ${wound.firstAid.amount >= 0 ? '+' : ''}${wound.firstAid.amount}` : '처치 완료'}</span> : <button type="button" className="text-command" onClick={() => treatWound(wound.id)}>응급처치</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="combat-empty">기록된 상처가 없습니다. 직접 피해와 갑옷에 막힌 타격은 상처 장부에 남지 않습니다.</p>}
        {untreatedWounds.length > 0 && (
          <div className="first-aid-controls">
            <NumberField label="상처 경과 시간" value={firstAid.ageInHours} min="0" max="24" onChange={value => setFirstAid(previous => ({ ...previous, ageInHours: value }))} />
            {rollMode === 'manual' && <NumberField label="응급처치 d20" value={firstAid.roll} min="1" max="20" onChange={value => setFirstAid(previous => ({ ...previous, roll: value }))} />}
            <p>각 상처에는 하루 안에 한 번만 시도할 수 있습니다. 치명상은 1시간 안에 성공해야 합니다.</p>
          </div>
        )}
      </section>

      <SectionHeader index="III" title="주간 회복" meta="Chirurgery · Sunday Noon" />
      <section className="recovery-workspace">
        <div className="recovery-workspace__form">
          <SelectField label="이번 주 활동" value={recovery.activity} onChange={value => setRecovery(previous => ({ ...previous, activity: value }))} options={[{ value: 'none', label: '휴식' }, { value: 'light', label: '가벼운 활동' }, { value: 'moderate', label: '보통 활동' }, { value: 'strenuous', label: '격렬한 활동' }]} />
          <NumberField label="치료 환경 수정" value={recovery.conditionsModifier} min="-20" max="20" onChange={value => setRecovery(previous => ({ ...previous, conditionsModifier: value }))} />
          <NumberField label="치료자 수" value={recovery.caregivers} min="1" max="10" onChange={value => setRecovery(previous => ({ ...previous, caregivers: value }))} />
          {rollMode === 'manual' && <NumberField label="외과 치료 d20" value={recovery.roll} min="1" max="20" onChange={value => setRecovery(previous => ({ ...previous, roll: value }))} />}
          <NumberField label="악화 피해" value={recovery.aggravationDamage} min="1" max="3" onChange={value => setRecovery(previous => ({ ...previous, aggravationDamage: value }))} />
          <button type="button" className="primary-command" onClick={recoverWeek}><HeartPulse size={17} aria-hidden="true" />일요일 정오 회복</button>
        </div>
        {healthState.weeklyCare?.at(-1) && (
          <dl className="recovery-result">
            <div><dt>외과</dt><dd>{checkLabel[healthState.weeklyCare.at(-1).surgery?.outcome] || healthState.weeklyCare.at(-1).surgery?.outcome}</dd></div>
            <div><dt>자연 회복</dt><dd>+{healthState.weeklyCare.at(-1).healing}</dd></div>
            <div><dt>상태 악화</dt><dd>-{healthState.weeklyCare.at(-1).deterioration}</dd></div>
            <div><dt>결과</dt><dd>{healthState.weeklyCare.at(-1).currentHpBefore} → {healthState.weeklyCare.at(-1).currentHpAfter}</dd></div>
          </dl>
        )}
        <RuleTables />
      </section>

      <SectionHeader index="IV" title="기타 피해" meta="Falls · Fire · Poison · Suffocation" />
      <section className="hazard-workspace">
        <SelectField label="피해 원인" value={hazard.type} onChange={value => setHazard(previous => ({ ...previous, type: value }))} options={[{ value: 'fall', label: '추락' }, { value: 'droppedObject', label: '낙하물' }, { value: 'fire', label: '불과 열기' }, { value: 'poison', label: '독' }, { value: 'suffocation', label: '질식' }, { value: 'aggravation', label: '부상 악화' }, { value: 'disease', label: '질병 · GM 피해' }]} />
        {['fall', 'droppedObject'].includes(hazard.type) && <NumberField label="거리 · 피트" value={hazard.distanceFeet} min="0" max="1000" onChange={value => setHazard(previous => ({ ...previous, distanceFeet: value }))} />}
        {hazard.type === 'droppedObject' && <NumberField label="무게 · 파운드" value={hazard.weightPounds} min="0" max="10000" onChange={value => setHazard(previous => ({ ...previous, weightPounds: value }))} />}
        {['droppedObject', 'fire'].includes(hazard.type) && <NumberField label="갑옷" value={hazard.armor} min="0" max="100" onChange={value => setHazard(previous => ({ ...previous, armor: value }))} />}
        {hazard.type === 'fire' && <><NumberField label="연속 라운드" value={hazard.rounds} min="1" max="20" onChange={value => setHazard(previous => ({ ...previous, rounds: value }))} /><NumberField label="불길 강도 · d6" value={hazard.intensityDice} min="1" max="10" onChange={value => setHazard(previous => ({ ...previous, intensityDice: value }))} /></>}
        {hazard.type === 'poison' && <NumberField label="독성 · d6" value={hazard.potencyDice} min="1" max="30" onChange={value => setHazard(previous => ({ ...previous, potencyDice: value }))} />}
        {hazard.type === 'suffocation' && <label className="combat-field"><span>라운드별 CON d20 · 쉼표 구분</span><input value={hazard.conRolls} placeholder="8, 13, 17" onChange={event => setHazard(previous => ({ ...previous, conRolls: event.target.value }))} /></label>}
        {['aggravation', 'disease'].includes(hazard.type) && <NumberField label="피해" value={hazard.damage} min={hazard.type === 'disease' ? '0' : '1'} max={hazard.type === 'disease' ? '1000' : '3'} onChange={value => setHazard(previous => ({ ...previous, damage: value }))} />}
        {hazard.type === 'disease' && <label className="combat-check"><input type="checkbox" checked={Boolean(hazard.recordWound)} onChange={event => setHazard(previous => ({ ...previous, recordWound: event.target.checked }))} /><span>GM 판단으로 응급처치 가능한 상처 기록</span></label>}
        <button type="button" className="secondary-command" onClick={applyHazard}>피해 적용</button>
      </section>

      {error && <div className="winter-error" role="alert"><AlertTriangle size={17} aria-hidden="true" />{error}</div>}
    </article>
  );
}

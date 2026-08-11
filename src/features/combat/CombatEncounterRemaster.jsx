import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, Bandage, HeartPulse, Shield, Skull, Swords } from 'lucide-react';
import { FolioHeading, SectionHeader, StatusSeal } from '../../components/ui/LedgerUI';
import {
  confirmHealthDeath,
  getDerivedHealth,
  resolveFirstAid,
  resolveHazard,
  resolveMajorWoundCourage,
  resolveWeeklyRecovery
} from '../../rules/combatRules';
import Chapter7CombatEngine from './Chapter7CombatEngine';
import Chapter18Encounter from './Chapter18Encounter';
import './CombatEncounter.css';

const checkLabel = { critical: '대성공', success: '성공', failure: '실패', fumble: '대실패' };
const woundLabel = { light: '가벼운 상처', major: '큰 부상', mortal: '치명상' };

const NumberField = ({ label, value, onChange, min = 0, max = 1000 }) => (
  <label className="combat-field"><span>{label}</span><input type="number" value={value} min={min} max={max} onChange={event => onChange(event.target.value)} /></label>
);

const SelectField = ({ label, value, onChange, options }) => (
  <label className="combat-field"><span>{label}</span><select value={value} onChange={event => onChange(event.target.value)}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
);

const RuleTables = () => (
  <details className="combat-rule-tables"><summary>치료와 회복 표 확인 <span>Tables 7-3 to 7-5</span></summary><div className="combat-rule-tables__grid">
    <table><caption>응급처치</caption><thead><tr><th>판정</th><th>효과</th></tr></thead><tbody><tr><td>대성공</td><td>1d3+3 회복</td></tr><tr><td>성공</td><td>1d3 회복</td></tr><tr><td>실패</td><td>회복 없음</td></tr><tr><td>대실패</td><td>1d3 손실, 외과 필요</td></tr></tbody></table>
    <table><caption>외과 치료</caption><thead><tr><th>판정</th><th>효과</th></tr></thead><tbody><tr><td>대성공</td><td>회복률 2배, 악화 없음</td></tr><tr><td>성공</td><td>상태 악화 없음</td></tr><tr><td>실패</td><td>1d6 상태 악화</td></tr><tr><td>대실패</td><td>즉시 1d3 및 1d6 상태 악화</td></tr></tbody></table>
    <table><caption>건강과 활동</caption><thead><tr><th>상태</th><th>활동 결과</th></tr></thead><tbody><tr><td>3/4 초과</td><td>모든 활동 가능</td></tr><tr><td>3/4 미만</td><td>격렬한 활동은 자연 회복 취소</td></tr><tr><td>1/2 미만</td><td>격렬한 활동은 회복 취소 및 악화</td></tr><tr><td>불건강</td><td>보통·격렬 활동은 회복 취소 및 악화</td></tr></tbody></table>
  </div></details>
);

export default function CombatEncounterRemaster({ character, setCharacter, onNavigate }) {
  const health = getDerivedHealth(character.attributes);
  const healthState = character.campaign?.health || {};
  const [error, setError] = useState('');
  const [rollMode, setRollMode] = useState('automatic');
  const [courageRoll, setCourageRoll] = useState('');
  const [firstAid, setFirstAid] = useState({ ageInHours: 0, roll: '' });
  const [recovery, setRecovery] = useState({ activity: 'none', conditionsModifier: 0, caregivers: 1, roll: '', aggravationDamage: 1 });
  const [hazard, setHazard] = useState({ type: 'fall', distanceFeet: 6, weightPounds: 10, armor: 0, rounds: 1, intensityDice: 1, potencyDice: 1, damage: 1, conRolls: '' });
  const untreatedWounds = useMemo(() => (healthState.wounds || []).filter(wound => !wound.treated), [healthState.wounds]);
  const run = action => { try { setError(''); action(); } catch (caught) { setError(caught.message || '규칙 처리를 완료하지 못했습니다.'); } };

  const resolveCourage = () => run(() => setCharacter(previous => resolveMajorWoundCourage(previous, { roll: rollMode === 'manual' && courageRoll !== '' ? Number(courageRoll) : undefined }).character));
  const treatWound = woundId => run(() => setCharacter(previous => resolveFirstAid(previous, { woundId, ageInHours: Number(firstAid.ageInHours), roll: rollMode === 'manual' && firstAid.roll !== '' ? Number(firstAid.roll) : undefined }).character));
  const recoverWeek = () => run(() => setCharacter(previous => resolveWeeklyRecovery(previous, { activity: recovery.activity, conditionsModifier: Number(recovery.conditionsModifier), caregivers: Number(recovery.caregivers), chirurgeryRoll: rollMode === 'manual' && recovery.roll !== '' ? Number(recovery.roll) : undefined, aggravationDamage: Number(recovery.aggravationDamage) }).character));
  const applyHazard = () => run(() => setCharacter(previous => resolveHazard(previous, { ...hazard, distanceFeet: Number(hazard.distanceFeet), weightPounds: Number(hazard.weightPounds), armor: Number(hazard.armor), rounds: Number(hazard.rounds), intensityDice: Number(hazard.intensityDice), potencyDice: Number(hazard.potencyDice), damage: Number(hazard.damage), conRolls: String(hazard.conRolls).split(',').map(value => Number(value.trim())).filter(value => value >= 1 && value <= 20) }).character));
  const confirmDeath = () => {
    if (!window.confirm('자정까지 생명력을 양수로 회복하지 못한 사망을 확정합니다. 계승 절차로 이어집니다.')) return;
    run(() => setCharacter(previous => confirmHealthDeath(previous).character));
  };

  return <article className="folio-page combat-ledger view-animate">
    <FolioHeading eyebrow="Liber Certaminum · Chapter Seven" title="전투와 회복" year={character.personal?.campaignYear || 767}>선언부터 이동까지 원문 순서로 진행하고, 말과 모든 상처를 같은 기록에 보존합니다.</FolioHeading>
    <section className="health-register" aria-label="현재 건강 상태"><div><HeartPulse size={18} aria-hidden="true" /><span>생명력</span><strong>{health.currentHp}<small>/ {health.totalHp}</small></strong></div><div><Activity size={18} aria-hidden="true" /><span>의식 한계</span><strong>{health.unconsciousThreshold}</strong></div><div><Shield size={18} aria-hidden="true" /><span>큰 부상 한계</span><strong>{health.majorWoundThreshold}</strong></div><div><Bandage size={18} aria-hidden="true" /><span>회복률</span><strong>{health.healingRate}</strong></div><div><Swords size={18} aria-hidden="true" /><span>부상 수정</span><strong>{health.woundPenalty}</strong></div><div><AlertTriangle size={18} aria-hidden="true" /><span>상태</span><StatusSeal tone={healthState.pendingDeath ? 'danger' : healthState.surgeryNeeded ? 'warning' : 'active'}>{healthState.pendingDeath ? '자정 사망 대기' : healthState.surgeryNeeded ? '외과 필요' : healthState.unconscious ? '의식 없음' : '건강'}</StatusSeal></div></section>
    <div className="segmented-control combat-global-roll-mode" aria-label="기본 주사위 방식"><button type="button" className={rollMode === 'automatic' ? 'active' : ''} onClick={() => setRollMode('automatic')}>앱 굴림</button><button type="button" className={rollMode === 'manual' ? 'active' : ''} onClick={() => setRollMode('manual')}>직접 굴림</button></div>
    {healthState.pendingDeath && <div className="combat-critical-notice" role="alert"><Skull size={22} aria-hidden="true" /><div><strong>생명력이 0 이하입니다.</strong><p>같은 날 자정 전에 양수로 회복하지 못하면 사망합니다. 치명상은 1시간 안에 응급처치를 받아야 합니다.</p></div><button type="button" className="secondary-command" onClick={confirmDeath}>자정 사망 확정</button></div>}
    {healthState.majorWoundCourage?.status === 'pending' && <div className="combat-critical-notice" role="alert"><AlertTriangle size={22} aria-hidden="true" /><div><strong>큰 부상 뒤 용기 판정</strong><p>계속 싸우려면 Valorous 판정에 성공해야 합니다.</p></div>{rollMode === 'manual' && <NumberField label="Valorous d20" value={courageRoll} min={1} max={20} onChange={setCourageRoll} />}<button type="button" className="secondary-command" onClick={resolveCourage}>용기 판정</button></div>}
    <SectionHeader index="I" title="개인 전투" meta="Determination to Movement" />
    <Chapter18Encounter character={character} setCharacter={setCharacter} />
    <Chapter7CombatEngine character={character} setCharacter={setCharacter} onNavigate={onNavigate} />
    <SectionHeader index="II" title="상처와 응급처치" meta="Wounds · First Aid" />
    <section className="wound-ledger">{healthState.wounds?.length ? <div className="wound-table-wrap"><table><thead><tr><th>연도</th><th>상처</th><th>피해</th><th>분류</th><th>처치</th></tr></thead><tbody>{[...healthState.wounds].reverse().map(wound => <tr key={wound.id}><td>{wound.year}</td><td>{wound.source}</td><td>{wound.actualDamage}</td><td>{woundLabel[wound.classification]}</td><td>{wound.treated ? `${checkLabel[wound.firstAid?.outcome] || '완료'}${wound.firstAid ? ` · ${wound.firstAid.amount >= 0 ? '+' : ''}${wound.firstAid.amount}` : ''}` : <button type="button" className="text-command" onClick={() => treatWound(wound.id)}>응급처치</button>}</td></tr>)}</tbody></table></div> : <p className="combat-empty">기록된 상처가 없습니다.</p>}{untreatedWounds.length > 0 && <div className="first-aid-controls"><NumberField label="상처 경과 시간" value={firstAid.ageInHours} max={24} onChange={value => setFirstAid(previous => ({ ...previous, ageInHours: value }))} />{rollMode === 'manual' && <NumberField label="응급처치 d20" value={firstAid.roll} min={1} max={20} onChange={value => setFirstAid(previous => ({ ...previous, roll: value }))} />}<p>상처마다 하루 안에 한 번, 치명상은 1시간 안에 시도합니다.</p></div>}</section>
    <SectionHeader index="III" title="주간 회복" meta="Chirurgery · Sunday Noon" />
    <section className="recovery-workspace"><div className="recovery-workspace__form"><SelectField label="이번 주 활동" value={recovery.activity} onChange={value => setRecovery(previous => ({ ...previous, activity: value }))} options={[{ value: 'none', label: '휴식' }, { value: 'light', label: '가벼운 활동' }, { value: 'moderate', label: '보통 활동' }, { value: 'strenuous', label: '격렬한 활동' }]} /><NumberField label="치료 환경 수정" value={recovery.conditionsModifier} min={-20} max={20} onChange={value => setRecovery(previous => ({ ...previous, conditionsModifier: value }))} /><NumberField label="치료자 수" value={recovery.caregivers} min={1} max={10} onChange={value => setRecovery(previous => ({ ...previous, caregivers: value }))} />{rollMode === 'manual' && <NumberField label="외과 치료 d20" value={recovery.roll} min={1} max={20} onChange={value => setRecovery(previous => ({ ...previous, roll: value }))} />}<NumberField label="악화 피해" value={recovery.aggravationDamage} min={1} max={3} onChange={value => setRecovery(previous => ({ ...previous, aggravationDamage: value }))} /><button type="button" className="primary-command" onClick={recoverWeek}><HeartPulse size={17} aria-hidden="true" />일요일 정오 회복</button></div>{healthState.weeklyCare?.at(-1) && <dl className="recovery-result"><div><dt>외과</dt><dd>{checkLabel[healthState.weeklyCare.at(-1).surgery?.outcome] || healthState.weeklyCare.at(-1).surgery?.outcome}</dd></div><div><dt>자연 회복</dt><dd>+{healthState.weeklyCare.at(-1).healing}</dd></div><div><dt>상태 악화</dt><dd>-{healthState.weeklyCare.at(-1).deterioration}</dd></div><div><dt>결과</dt><dd>{healthState.weeklyCare.at(-1).currentHpBefore} → {healthState.weeklyCare.at(-1).currentHpAfter}</dd></div></dl>}<RuleTables /></section>
    <SectionHeader index="IV" title="기타 피해" meta="Falls · Fire · Poison · Suffocation" />
    <section className="hazard-workspace"><SelectField label="피해 원인" value={hazard.type} onChange={value => setHazard(previous => ({ ...previous, type: value }))} options={[{ value: 'fall', label: '추락' }, { value: 'droppedObject', label: '낙하물' }, { value: 'fire', label: '불과 열기' }, { value: 'poison', label: '독' }, { value: 'suffocation', label: '질식' }, { value: 'aggravation', label: '부상 악화' }, { value: 'disease', label: '질병 · GM 피해' }]} />{['fall', 'droppedObject'].includes(hazard.type) && <NumberField label="거리 · 피트" value={hazard.distanceFeet} max={1000} onChange={value => setHazard(previous => ({ ...previous, distanceFeet: value }))} />}{hazard.type === 'droppedObject' && <NumberField label="무게 · 파운드" value={hazard.weightPounds} max={10000} onChange={value => setHazard(previous => ({ ...previous, weightPounds: value }))} />}{['droppedObject', 'fire'].includes(hazard.type) && <NumberField label="갑옷" value={hazard.armor} onChange={value => setHazard(previous => ({ ...previous, armor: value }))} />}{hazard.type === 'fire' && <><NumberField label="연속 라운드" value={hazard.rounds} max={20} onChange={value => setHazard(previous => ({ ...previous, rounds: value }))} /><NumberField label="불길 강도 · d6" value={hazard.intensityDice} max={10} onChange={value => setHazard(previous => ({ ...previous, intensityDice: value }))} /></>}{hazard.type === 'poison' && <NumberField label="독성 · d6" value={hazard.potencyDice} max={30} onChange={value => setHazard(previous => ({ ...previous, potencyDice: value }))} />}{hazard.type === 'suffocation' && <label className="combat-field"><span>라운드별 CON d20 · 쉼표 구분</span><input value={hazard.conRolls} placeholder="8, 13, 17" onChange={event => setHazard(previous => ({ ...previous, conRolls: event.target.value }))} /></label>}{['aggravation', 'disease'].includes(hazard.type) && <NumberField label="피해" value={hazard.damage} min={hazard.type === 'disease' ? 0 : 1} max={hazard.type === 'disease' ? 1000 : 3} onChange={value => setHazard(previous => ({ ...previous, damage: value }))} />}<button type="button" className="secondary-command" onClick={applyHazard}>피해 적용</button></section>
    {error && <div className="winter-error" role="alert"><AlertTriangle size={17} aria-hidden="true" />{error}</div>}
  </article>;
}

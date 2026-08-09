import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Castle,
  Check,
  ChevronRight,
  Dices,
  Flag,
  Shield,
  Skull,
  Swords,
  UsersRound
} from 'lucide-react';
import { FolioHeading, SectionHeader, StatusSeal } from '../../components/ui/LedgerUI';
import { BATTLE_ENEMY_TABLES, lookupBattleEnemy } from '../../rules/battleEnemyTables';
import { beginChapter8PersonalCombat } from '../../rules/combatIntegrationRules';
import {
  assignSkirmishFollowerFates,
  assignFollowerFates,
  beginBattleMeleeRound,
  choosePursuit,
  completeBattleMeleeRound,
  confirmMassBattleDeath,
  endPursuit,
  finalizeMassBattle,
  finalizeSkirmish,
  finalizeSiege,
  prepareBattleSpecialEvent,
  resolveBattleAftermath,
  resolveBattlePreparation,
  resolveBattleWithdrawal,
  resolveFirstCharge,
  resolvePlayerCaptivity,
  resolvePursuitRound,
  resolveSiegeHealth,
  resolveSiegeMorale,
  resolveSiegeTactic,
  resolveSkirmishCommand,
  resolveSkirmishFollowers,
  startMassBattle,
  startSkirmish,
  startSiege,
  withdrawFromSiege
} from '../../rules/battleRules';
import './BattleSiege.css';

const battlePhaseLabels = {
  pre_battle: '전투 전 결정', first_charge: '첫 돌격', melee: '근접전 사건', melee_action: '부대 행동',
  follower_fate: '추종자 운명', withdrawal: '퇴각 또는 패주', pursuit_decision: '추격 결정', pursuit: '추격',
  aftermath: '전투 뒤 처리', complete: '완료'
};
const siegePhaseLabels = { health: '건강', tactic: '월간 전술', morale: '사기', aftermath: '공성 결말', complete: '완료' };
const skirmishPhaseLabels = { command: '지휘', melee: '개인 근접전', followers: '추종자 판정', follower_fate: '운명 배정', aftermath: '교전 결말', complete: '완료' };
const siegeTacticLabels = { assault: '강습', blockade: '봉쇄', treachery: '배신 공작', single_combat: '대표 결투' };
const siegeLossLabels = { none: '없음', light: '경미', moderate: '중간', heavy: '심각', crushing: '궤멸' };
const actionLabels = {
  engage: '적과 교전', remain_disengaged: '비교전 유지', withdraw: '전장 후방으로 철수', first_aid: '응급처치',
  aid_fallen: '쓰러진 이를 구조', pillage: '시신과 장비 수습', change_armor: '갑옷 정비', rally: '병력 집결',
  call_squire: '종자 부르기', find_unit: '부대 찾기', find_mount: '말 찾기', special_event: '특별 사건 찾기',
  join_unit: '아군 부대 합류', surrender: '항복', flee: '도주'
};
const resultLabels = {
  decisive_victory: '결정적 승리', indecisive: '미결', decisive_defeat: '결정적 패배',
  critical: '대성공', success: '성공', partial: '부분 성공', failure: '실패', fumble: '대실패', disengaged: '비교전'
};

const NumberField = ({ label, value, onChange, min = 0, max = 100000, disabled = false }) => (
  <label className="battle-field"><span>{label}</span><input type="number" value={value} min={min} max={max} disabled={disabled} onChange={event => onChange(event.target.value)} /></label>
);
const TextField = ({ label, value, onChange }) => (
  <label className="battle-field"><span>{label}</span><input value={value} onChange={event => onChange(event.target.value)} /></label>
);
const SelectField = ({ label, value, onChange, options }) => (
  <label className="battle-field"><span>{label}</span><select value={value} onChange={event => onChange(event.target.value)}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
);

const StepRail = ({ phases, current, labels }) => (
  <ol className="battle-step-rail" aria-label="현재 절차">
    {phases.map((phase, index) => <li key={phase} className={phase === current ? 'active' : ''}><span>{String(index + 1).padStart(2, '0')}</span><b>{labels[phase]}</b></li>)}
  </ol>
);

const RuleNote = ({ children, page }) => (
  <aside className="battle-rule-note"><Shield size={17} aria-hidden="true" /><p>{children}</p><code>{page}</code></aside>
);

const ResultBlock = ({ title, children, tone = 'neutral' }) => (
  <section className={`battle-result battle-result--${tone}`}><header><Check size={17} aria-hidden="true" /><strong>{title}</strong></header>{children}</section>
);

const PreviousResult = ({ title, items }) => (
  <section className="battle-previous" aria-label={title}><strong>{title}</strong><dl>{items.filter(item => item.value !== undefined && item.value !== null && item.value !== '').map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></section>
);

const BattleSetup = ({ character, setCharacter, run }) => {
  const [setup, setSetup] = useState({
    name: `${character.personal?.campaignYear || 767}년 전투`, scale: 'small', duration: 8,
    playerSideName: '프랑크군', enemySideName: '적군', playerArmySize: 600, enemyArmySize: 600,
    playerArmyBattle: 15, battalionBattle: character.skills?.battle || 10, playerRole: 'unit',
    mounted: true, hasLance: true, armor: 10, shield: 6, ownHomeland: false, enemyHomeland: false,
    enemyTable: 'earlyKnights', enemyRoll: 1
  });
  const [selectedFollowers, setSelectedFollowers] = useState([]);
  const enemy = useMemo(() => lookupBattleEnemy(setup.enemyTable, setup.enemyRoll), [setup.enemyTable, setup.enemyRoll]);
  const followerOptions = [
    ...(character.squire?.name ? [{ key: 'squire:squire', ref: { type: 'squire', id: 'squire' }, name: `${character.squire.name} · 종자`, status: character.squire.status || '생존' }] : []),
    ...(character.family?.members || []).filter(member => member.relation !== '본인' && !['사망', '포로', '실종'].includes(member.status)).map(member => ({ key: `family:${member.id}`, ref: { type: 'family', id: member.id }, name: `${member.name} · ${member.relation}`, status: member.status }))
  ];
  const update = (key, value) => setSetup(previous => ({ ...previous, [key]: value }));
  const begin = () => run(() => setCharacter(previous => startMassBattle(previous, {
    ...setup,
    enemy: { ...enemy, name: `${enemy.quality} · ${enemy.weapon}` },
    followerRefs: followerOptions.filter(item => selectedFollowers.includes(item.key)).map(item => item.ref)
  }).character));
  return (
    <section className="battle-sheet">
      <header><div><span className="serial-label">새 대규모 전투</span><h2>전장과 지휘 체계</h2></div><StatusSeal tone="neutral">Chapter 8</StatusSeal></header>
      <div className="battle-form-grid battle-form-grid--four">
        <TextField label="전투 이름" value={setup.name} onChange={value => update('name', value)} />
        <SelectField label="규모" value={setup.scale} onChange={value => update('scale', value)} options={[['small','소규모 · 200~2,000'],['medium','중규모 · 2,001~5,000'],['large','대규모 · 5,001~10,000'],['huge','초대형 · 10,001 이상']].map(([value,label]) => ({ value,label }))} />
        <NumberField label="예정 라운드 · 0~12" value={setup.duration} min={0} max={12} onChange={value => update('duration', value)} />
        <SelectField label="기사의 지휘 역할" value={setup.playerRole} onChange={value => update('playerRole', value)} options={[['unit','부대원 또는 부대장'],['lone','홀로 행동'],['battalion','대대 지휘관'],['army','군 지휘관']].map(([value,label]) => ({ value,label }))} />
        <TextField label="아군" value={setup.playerSideName} onChange={value => update('playerSideName', value)} />
        <NumberField label="아군 병력" value={setup.playerArmySize} min={1} onChange={value => update('playerArmySize', value)} />
        <NumberField label="군 지휘관 Battle" value={setup.playerArmyBattle} onChange={value => update('playerArmyBattle', value)} />
        <NumberField label="대대 지휘관 Battle" value={setup.battalionBattle} onChange={value => update('battalionBattle', value)} />
        <TextField label="적군" value={setup.enemySideName} onChange={value => update('enemySideName', value)} />
        <NumberField label="적군 병력" value={setup.enemyArmySize} min={1} onChange={value => update('enemyArmySize', value)} />
        <SelectField label="Battle Enemy 표" value={setup.enemyTable} onChange={value => update('enemyTable', value)} options={Object.entries(BATTLE_ENEMY_TABLES).map(([value, table]) => ({ value, label: `${table.label} · p.${table.sourcePage}` }))} />
        <NumberField label="Enemy 1d20" value={setup.enemyRoll} min={1} max={40} onChange={value => update('enemyRoll', value)} />
      </div>
      <div className="battle-enemy-preview" aria-live="polite">
        <Flag size={20} aria-hidden="true" /><div><strong>{enemy.quality}</strong><p>{enemy.weapon} {enemy.primarySkill}{enemy.secondarySkill ? ` / ${enemy.secondarySkill}` : ''} · 피해 {enemy.damageDice}d6 · 갑옷 {enemy.armor}{enemy.shield ? ' + 방패' : ''}{enemy.horse ? ` · ${enemy.horse}` : ''}</p></div><code>p.{enemy.sourcePage}</code>
      </div>
      <fieldset className="battle-choice-fieldset">
        <legend>기사와 전장 조건</legend>
        <label><input type="checkbox" checked={setup.mounted} onChange={event => update('mounted', event.target.checked)} /><span>기마</span></label>
        <label><input type="checkbox" checked={setup.hasLance} onChange={event => update('hasLance', event.target.checked)} /><span>마상창 보유</span></label>
        <label><input type="checkbox" checked={setup.ownHomeland} onChange={event => update('ownHomeland', event.target.checked)} /><span>자국에서 전투</span></label>
        <label><input type="checkbox" checked={setup.enemyHomeland} onChange={event => update('enemyHomeland', event.target.checked)} /><span>적국에서 전투</span></label>
      </fieldset>
      <fieldset className="battle-followers">
        <legend><UsersRound size={16} aria-hidden="true" /> 참전 추종자 · 동일 인물 참조</legend>
        {followerOptions.length ? followerOptions.map(item => <label key={item.key}><input type="checkbox" checked={selectedFollowers.includes(item.key)} onChange={event => setSelectedFollowers(previous => event.target.checked ? [...previous, item.key] : previous.filter(key => key !== item.key))} /><span><b>{item.name}</b><small>{item.status}</small></span></label>) : <p>가문 장부에 참전시킬 수 있는 생존 추종자가 없습니다.</p>}
      </fieldset>
      <button type="button" className="primary-command" onClick={begin}><Swords size={17} aria-hidden="true" />전투 기록 시작</button>
    </section>
  );
};

const FollowerAllocation = ({ battle, character, setCharacter, run }) => {
  const [assignments, setAssignments] = useState({});
  const pending = battle.pendingFollowerFate;
  const entityName = ref => ref.type === 'squire'
    ? `${character.squire?.name || '이름 없는 종자'} · 종자`
    : `${character.family?.members?.find(member => member.id === ref.id)?.name || ref.id} · 가문`;
  const commit = () => run(() => setCharacter(previous => assignFollowerFates(previous, assignments).character));
  return (
    <section className="battle-sheet battle-sheet--urgent">
      <header><div><span className="serial-label">Table 8-8</span><h2>추종자 운명 배정</h2></div><StatusSeal tone="warning">필수 선택</StatusSeal></header>
      <p>전사 {pending.fate.killed} · 부상 {pending.fate.wounded} · 포획 {pending.fate.captured} · 무사 {pending.fate.survived}. 원문은 인물 선정법을 정하지 않으므로 플레이어가 정확한 인원을 지정합니다.</p>
      <div className="follower-allocation">
        {pending.refs.map(ref => <label key={`${ref.type}:${ref.id}`}><span>{entityName(ref)}</span><select value={assignments[`${ref.type}:${ref.id}`] || 'survived'} onChange={event => setAssignments(previous => ({ ...previous, [`${ref.type}:${ref.id}`]: event.target.value }))}><option value="survived">무사</option><option value="wounded">부상</option><option value="killed">전사</option><option value="captured">포획</option></select></label>)}
      </div>
      <button type="button" className="primary-command" onClick={commit}>배정 확정</button>
    </section>
  );
};

const SkirmishSetup = ({ character, setCharacter, run }) => {
  const [setup, setSetup] = useState({
    name: `${character.personal?.campaignYear || 767}년 소규모 교전`, enemy: '적군',
    playerCommander: false, commanderSkill: character.skills?.battle || 10, followerRound: 3
  });
  const [selectedFollowers, setSelectedFollowers] = useState([]);
  const followerOptions = [
    ...(character.squire?.name && !['사망', '포로', '실종'].includes(character.squire.status) ? [{ key: 'squire:squire', ref: { type: 'squire', id: 'squire' }, name: `${character.squire.name} · 종자`, status: character.squire.status || '생존' }] : []),
    ...(character.family?.members || []).filter(member => member.relation !== '본인' && !['사망', '포로', '실종'].includes(member.status)).map(member => ({ key: `family:${member.id}`, ref: { type: 'family', id: member.id }, name: `${member.name} · ${member.relation}`, status: member.status }))
  ];
  const update = (key, value) => setSetup(previous => ({ ...previous, [key]: value }));
  return <section className="battle-sheet">
    <header><div><span className="serial-label">새 소규모 교전</span><h2>지휘와 참가자</h2></div><StatusSeal tone="neutral">pp.138-139</StatusSeal></header>
    <RuleNote page="Tables 8-1 and 8-2">지휘관의 Battle 결과는 첫 근접전의 전투 기술과 각 부지휘관의 추종자 운명 판정에만 적용됩니다.</RuleNote>
    <div className="battle-form-grid battle-form-grid--four">
      <TextField label="교전 이름" value={setup.name} onChange={value => update('name', value)} />
      <TextField label="상대" value={setup.enemy} onChange={value => update('enemy', value)} />
      <NumberField label="지휘관 Battle" value={setup.commanderSkill} onChange={value => update('commanderSkill', value)} />
      <NumberField label="추종자 판정 라운드 · 1~5" value={setup.followerRound} min={1} max={5} onChange={value => update('followerRound', value)} />
    </div>
    <label className="battle-binary"><input type="checkbox" checked={setup.playerCommander} onChange={event => update('playerCommander', event.target.checked)} /><span>플레이어 기사가 전체 지휘관</span></label>
    <fieldset className="battle-followers">
      <legend><UsersRound size={16} aria-hidden="true" /> 직접 지휘하는 추종자 · 중복 없는 동일 인물 참조</legend>
      {followerOptions.length ? followerOptions.map(item => <label key={item.key}><input type="checkbox" checked={selectedFollowers.includes(item.key)} onChange={event => setSelectedFollowers(previous => event.target.checked ? [...previous, item.key] : previous.filter(key => key !== item.key))} /><span><b>{item.name}</b><small>{item.status}</small></span></label>) : <p>지휘할 수 있는 생존 추종자가 없습니다.</p>}
    </fieldset>
    <button type="button" className="primary-command" onClick={() => run(() => setCharacter(previous => startSkirmish(previous, { ...setup, followerRefs: followerOptions.filter(item => selectedFollowers.includes(item.key)).map(item => item.ref) }).character))}><Swords size={17} aria-hidden="true" />교전 기록 시작</button>
  </section>;
};

const SkirmishFollowerAllocation = ({ skirmish, character, setCharacter, run }) => {
  const [assignments, setAssignments] = useState({});
  const pending = skirmish.pendingFollowerFate;
  const name = ref => ref.type === 'squire' ? `${character.squire?.name || '이름 없는 종자'} · 종자` : `${character.family?.members?.find(member => member.id === ref.id)?.name || ref.id} · 가문`;
  return <section className="battle-sheet battle-sheet--urgent">
    <header><div><span className="serial-label">Table 8-2</span><h2>추종자 운명 배정</h2></div><StatusSeal tone="warning">필수 선택</StatusSeal></header>
    <p>전사 {pending.fate.killed} · 부상 {pending.fate.wounded} · 포획 {pending.fate.captured} · 무사 {pending.fate.survived}. 서로 겹치지 않게 정확한 인원을 지정합니다.</p>
    <div className="follower-allocation">{pending.refs.map(ref => <label key={`${ref.type}:${ref.id}`}><span>{name(ref)}</span><select value={assignments[`${ref.type}:${ref.id}`] || 'survived'} onChange={event => setAssignments(previous => ({ ...previous, [`${ref.type}:${ref.id}`]: event.target.value }))}><option value="survived">무사</option><option value="wounded">부상</option><option value="killed">전사</option><option value="captured">포획</option></select></label>)}</div>
    <button type="button" className="primary-command" onClick={() => run(() => setCharacter(previous => assignSkirmishFollowerFates(previous, assignments).character))}>배정 확정</button>
  </section>;
};

const SkirmishFlow = ({ character, setCharacter, run, openCombat }) => {
  const skirmish = character.campaign?.skirmish;
  const [aftermath, setAftermath] = useState({ outcome: 'draw', rescueCaptured: true });
  if (!skirmish) return null;
  const updateCharacter = resolver => run(() => setCharacter(previous => resolver(previous).character));
  const phaseContent = () => {
    if (skirmish.phase === 'command') return <><RuleNote page="Table 8-1 · p.138">지휘관만 무대결 Battle 판정을 합니다. 플레이어가 지휘관이 아니면 입력한 지휘관 수치를 사용합니다.</RuleNote><button type="button" className="primary-command" onClick={() => updateCharacter(previous => resolveSkirmishCommand(previous))}><Dices size={17} aria-hidden="true" />지휘 판정</button></>;
    if (skirmish.phase === 'melee') {
      const number = skirmish.rounds.length + 1;
      const modifier = number === 1 ? skirmish.command?.modifier || 0 : 0;
      return <><RuleNote page="pp.138-139">개인 공격과 피해는 Chapter 7 엔진에서 끝까지 처리합니다. 지휘 수정 {modifier >= 0 ? '+' : ''}{modifier}는 {number === 1 ? '이번 첫 라운드의 전투 기술에만 적용됩니다' : '더 이상 적용되지 않습니다'}.</RuleNote><button type="button" className="primary-command" onClick={() => openCombat({ type: 'skirmish' })}><Swords size={17} aria-hidden="true" />Chapter 7 개인 교전 시작</button></>;
    }
    if (skirmish.phase === 'followers') return <><RuleNote page="Table 8-2 · p.138">플레이어가 직접 지휘한 추종자 집단만 플레이어의 Battle로 판정합니다. 전체 지휘관의 Table 8-1 수정치를 함께 적용합니다.</RuleNote><button type="button" className="primary-command" onClick={() => updateCharacter(previous => resolveSkirmishFollowers(previous))}><Dices size={17} aria-hidden="true" />추종자 운명 판정</button></>;
    if (skirmish.phase === 'follower_fate') return <SkirmishFollowerAllocation skirmish={skirmish} character={character} setCharacter={setCharacter} run={run} />;
    if (skirmish.phase === 'aftermath') return <><RuleNote page="p.139">교전 승패와 포로 구출은 이야기 상황을 판정한 GM이 정합니다. 별도의 참가 Glory는 없으며 개인 근접전 Glory만 유지합니다.</RuleNote><div className="battle-form-grid"><SelectField label="교전 결과" value={aftermath.outcome} onChange={value => setAftermath(previous => ({ ...previous, outcome: value }))} options={[{value:'victory',label:'아군 승리'},{value:'draw',label:'결판 없음'},{value:'defeat',label:'아군 패배'}]} /><label className="battle-binary"><input type="checkbox" checked={aftermath.rescueCaptured} disabled={aftermath.outcome !== 'victory'} onChange={event => setAftermath(previous => ({ ...previous, rescueCaptured: event.target.checked }))} /><span>승리 뒤 붙잡힌 추종자를 구출</span></label></div><button type="button" className="primary-command" onClick={() => updateCharacter(previous => finalizeSkirmish(previous, aftermath))}>교전 결과 확정</button></>;
    return <ResultBlock title="소규모 교전 기록 완료" tone="active"><p>{skirmish.name} · {skirmish.rounds.length}라운드 · 개인 전투 Glory는 전투 장부에 보존됨</p></ResultBlock>;
  };
  const recent = skirmish.rounds.at(-1);
  return <><StepRail phases={['command','melee','followers','aftermath','complete']} current={skirmish.phase === 'follower_fate' ? 'followers' : skirmish.phase} labels={skirmishPhaseLabels} /><section className="battle-register"><div><span>교전</span><strong>{skirmish.name}</strong></div><div><span>개인 전투</span><strong>{skirmish.rounds.length}/{skirmish.followerRound}</strong></div><div><span>첫 라운드 수정</span><strong>{skirmish.command ? `${skirmish.command.modifier >= 0 ? '+' : ''}${skirmish.command.modifier}` : '-'}</strong></div><div><span>추종자</span><strong>{skirmish.followerRefs.length}</strong></div></section><section className="battle-workspace">{phaseContent()}</section>{recent && <PreviousResult title="직전 개인 전투 기록" items={[{label:'라운드',value:recent.number},{label:'결과',value:resultLabels[recent.outcome] || ({victory:'승리',draw:'결판 없음',defeat:'패배',withdrawal:'이탈'}[recent.outcome])},{label:'쓰러뜨린 적',value:recent.enemiesDefeated},{label:'지휘 수정',value:recent.commandModifier}]} />}</>;
};

const BattleFlow = ({ character, setCharacter, run, openCombat }) => {
  const battle = character.campaign?.massBattle;
  const [charge, setCharge] = useState(true);
  const [action, setAction] = useState('engage');
  const [actionDetails, setActionDetails] = useState({ woundId: '', woundAgeInHours: 0, armor: battle?.player?.armor || 10, shield: battle?.player?.shield || 6, specialCombatResult: 'defeated', specialCombatGlory: 0, note: '' });
  const [aftermath, setAftermath] = useState({ determination: 'roll', loot: 0, note: '' });
  const [captivity, setCaptivity] = useState({ resolution: 'ransomed', amount: '' });
  const latest = battle?.rounds?.at(-1);
  const pending = battle?.pendingRound;
  const updateCharacter = resolver => run(() => setCharacter(previous => resolver(previous).character));
  if (!battle) return null;
  const phaseContent = () => {
    if (battle.phase === 'pre_battle') return <><RuleNote page="pp.141-143">병력비와 국토 상황을 군 지휘관 Battle에 적용한 뒤, 그 결과를 대대 지휘관 판정에 넘깁니다.</RuleNote><button type="button" className="primary-command" onClick={() => updateCharacter(previous => resolveBattlePreparation(previous))}><Dices size={17} aria-hidden="true" />지휘 판정</button></>;
    if (battle.phase === 'first_charge') return <><RuleNote page="p.143">말과 마상창을 갖춘 기사만 첫 돌격에 참가합니다. 참가하면 Chapter 7 마상창 돌격으로 실제 개인 전투를 해결합니다.</RuleNote><label className="battle-binary"><input type="checkbox" checked={charge} onChange={event => setCharge(event.target.checked)} /><span>첫 돌격 참가</span></label><button type="button" className="primary-command" onClick={() => charge ? openCombat({ type: 'mass_battle_first_charge' }) : updateCharacter(previous => resolveFirstCharge(previous, { participates: false }))}>{charge ? <Swords size={17} aria-hidden="true" /> : <ChevronRight size={17} aria-hidden="true" />}{charge ? 'Chapter 7 첫 돌격 시작' : '첫 돌격에 불참'}</button></>;
    if (battle.phase === 'follower_fate') return <FollowerAllocation battle={battle} character={character} setCharacter={setCharacter} run={run} />;
    if (battle.phase === 'melee') return <><RuleNote page="pp.144-145">3d6 근접전 사건을 먼저 굴리고, 그 수정치로 부대 Battle 판정을 합니다.</RuleNote><button type="button" className="primary-command" onClick={() => updateCharacter(previous => beginBattleMeleeRound(previous))}><Dices size={17} aria-hidden="true" />다음 근접전 라운드</button></>;
    if (battle.phase === 'melee_action') {
      const options = pending.actions || [];
      const selected = options.includes(action) ? action : options[0];
      const untreatedWounds = (character.campaign?.health?.wounds || []).filter(wound => !wound.treated);
      const selectedWound = untreatedWounds.some(wound => wound.id === actionDetails.woundId) ? actionDetails.woundId : untreatedWounds[0]?.id || '';
      const specialPrepared = selected === 'special_event' && pending.specialEvent;
      return <>
        <ResultBlock title={`${pending.event?.total || '-'} · ${pending.event?.event || '후방 집결'}`}><p>Battle {resultLabels[pending.unitRoll?.check?.outcome] || '행동 선택'} · 수정 {pending.event?.modifier || 0} · 상대 {pending.enemy?.name || '판정 전'}</p></ResultBlock>
        <SelectField label="이번 라운드 행동" value={selected} onChange={setAction} options={options.map(value => ({ value, label: actionLabels[value] || value }))} />
        {selected === 'first_aid' && (untreatedWounds.length ? <div className="battle-form-grid"><SelectField label="응급처치할 상처" value={selectedWound} onChange={value => setActionDetails(previous => ({ ...previous, woundId: value }))} options={untreatedWounds.map(wound => ({ value: wound.id, label: `${wound.source || wound.classification} · ${wound.actualDamage} 피해` }))} /><NumberField label="상처 경과 시간" value={actionDetails.woundAgeInHours} min={0} max={24} onChange={value => setActionDetails(previous => ({ ...previous, woundAgeInHours: value }))} /></div> : <RuleNote page="Chapter 7">응급처치할 미처리 상처가 없습니다. 다른 행동을 선택하세요.</RuleNote>)}
        {selected === 'change_armor' && <div className="battle-form-grid"><NumberField label="교체 뒤 갑옷" value={actionDetails.armor} min={0} onChange={value => setActionDetails(previous => ({ ...previous, armor: value }))} /><NumberField label="교체 뒤 방패" value={actionDetails.shield} min={0} onChange={value => setActionDetails(previous => ({ ...previous, shield: value }))} /></div>}
        {selected === 'special_event' && !specialPrepared && <RuleNote page="Table 8-5 · p.145">특별 조우 유형과 호위 상대를 먼저 결정합니다. 이후 개인 전투는 Chapter 7 절차로 끝까지 해결합니다.</RuleNote>}
        {specialPrepared && <><ResultBlock title={`${pending.specialEvent.type} · ${pending.specialEvent.enemy.name}`} tone="active"><p>Battle Enemy {pending.specialEvent.enemyRoll} · 무기 {pending.specialEvent.enemy.primarySkill} · 갑옷 {pending.specialEvent.enemy.armor}</p></ResultBlock><RuleNote page="pp.145-146">Chapter 7 개인 전투를 원하는 만큼 진행하면 그 종료 결과가 이 라운드로 자동 복귀합니다.</RuleNote></>}
        {selected === 'special_event' && !specialPrepared ? <button type="button" className="primary-command" onClick={() => updateCharacter(previous => prepareBattleSpecialEvent(previous))}><Dices size={17} aria-hidden="true" />특별 조우 결정</button> : selected === 'engage' ? <button type="button" className="primary-command" onClick={() => openCombat({ type: 'mass_battle_melee' })}><Swords size={17} aria-hidden="true" />Chapter 7 교전 시작</button> : selected === 'special_event' ? <button type="button" className="primary-command" onClick={() => openCombat({ type: 'mass_battle_special' })}><Swords size={17} aria-hidden="true" />Chapter 7 특별 교전 시작</button> : <button type="button" className="primary-command" disabled={selected === 'first_aid' && !selectedWound} onClick={() => updateCharacter(previous => completeBattleMeleeRound(previous, { action: selected, ...actionDetails, woundId: selectedWound }))}><ChevronRight size={17} aria-hidden="true" />행동과 추종자 판정</button>}
      </>;
    }
    if (battle.phase === 'withdrawal') {
      const routed = latest?.playerWithdrawal === 'rout';
      const engaged = Boolean(latest?.unitRoll?.engaged);
      const options = routed ? (engaged ? ['run','stand'] : ['escape','run','stand']) : ['follow','stay'];
      return <><RuleNote page="p.147">{routed ? '패주한 대대에서는 교전 여부에 따라 탈출·도주·항전을 선택합니다.' : '퇴각 부대를 따르거나, 고립 수정치를 감수하고 전장에 남습니다.'}</RuleNote><div className="battle-command-row">{options.map(value => <button key={value} type="button" className="secondary-command" onClick={() => updateCharacter(previous => resolveBattleWithdrawal(previous, { action: value }))}>{({escape:'탈출',run:'도주 · -15',stand:'항전',follow:'부대와 퇴각',stay:'전장에 남기'}[value])}</button>)}</div></>;
    }
    if (battle.phase === 'pursuit_decision') return <><RuleNote page="p.147">추격을 시작하면 그날 전투에 다시 합류할 수 없고, 한 번의 패주에서 최대 2라운드만 추격합니다.</RuleNote><div className="battle-command-row"><button type="button" className="primary-command" onClick={() => updateCharacter(previous => choosePursuit(previous, true))}>추격</button><button type="button" className="secondary-command" onClick={() => updateCharacter(previous => choosePursuit(previous, false))}>추격하지 않음</button></div></>;
    if (battle.phase === 'pursuit') return <><RuleNote page="p.147">{battle.pursuit?.round ? '두 번째 라운드는 Hunting과 도주하는 적의 무기 판정이 맞서는 사냥입니다. 첫 라운드 뒤 지금 끝내도 원래 전투에는 복귀할 수 없습니다.' : '첫 번째 추격은 새로운 적을 정한 보통 전투 라운드입니다.'}</RuleNote><div className="battle-command-row"><button type="button" className="primary-command" onClick={() => updateCharacter(previous => resolvePursuitRound(previous))}><Dices size={17} aria-hidden="true" />추격 {Number(battle.pursuit?.round || 0) + 1}라운드</button>{Boolean(battle.pursuit?.round) && <button type="button" className="secondary-command" onClick={() => updateCharacter(previous => endPursuit(previous))}>추격 종료</button>}</div></>;
    if (battle.phase === 'aftermath') {
      if (!battle.aftermath) return <><RuleNote page="pp.148-149">승패, 부상자 치료, 전리품과 몸값, Glory 순으로 처리합니다. 전리품은 결정적 승리에만 허용됩니다.</RuleNote><div className="battle-form-grid"><SelectField label="승패 결정" value={aftermath.determination} onChange={value => setAftermath(previous => ({ ...previous, determination: value }))} options={[{value:'roll',label:'Table 8-10으로 판정'},{value:'decisive_victory',label:'이야기상 결정적 승리'},{value:'indecisive',label:'이야기상 미결'},{value:'decisive_defeat',label:'이야기상 결정적 패배'}]} /><NumberField label="GM이 정한 전리품 £" value={aftermath.loot} min={0} onChange={value => setAftermath(previous => ({ ...previous, loot: value }))} /></div><button type="button" className="primary-command" onClick={() => updateCharacter(previous => resolveBattleAftermath(previous, { clearResult: aftermath.determination === 'roll' ? undefined : aftermath.determination, loot: aftermath.loot, note: aftermath.note }))}>전투 결말 계산</button></>;
      return <><ResultBlock title={resultLabels[battle.aftermath.result.result]} tone={battle.aftermath.result.result === 'decisive_defeat' ? 'danger' : 'active'}><dl><div><dt>총 Glory</dt><dd>{battle.aftermath.glory.total}</dd></div><div><dt>전리품</dt><dd>£{battle.aftermath.loot}</dd></div><div><dt>포로</dt><dd>{battle.captives.length}</dd></div><div><dt>아군 최종 손실</dt><dd>{battle.aftermath.armyFate.killed + battle.aftermath.armyFate.wounded + battle.aftermath.armyFate.captured}</dd></div></dl></ResultBlock><button type="button" className="primary-command" onClick={() => updateCharacter(previous => finalizeMassBattle(previous))}>캠페인 장부에 확정</button></>;
    }
    return <ResultBlock title="대규모 전투 기록 완료" tone="active"><p>{battle.name} · {battle.round}라운드 · {resultLabels[battle.aftermath?.result?.result] || '결과 기록됨'}</p></ResultBlock>;
  };
  return (
    <>
      <StepRail phases={['pre_battle','first_charge','melee','withdrawal','pursuit','aftermath','complete']} current={battle.phase === 'melee_action' || battle.phase === 'follower_fate' ? 'melee' : battle.phase === 'pursuit_decision' ? 'pursuit' : battle.phase} labels={battlePhaseLabels} />
      <section className="battle-register"><div><span>전투</span><strong>{battle.name}</strong></div><div><span>라운드</span><strong>{battle.round}/{battle.duration}</strong></div><div><span>상태</span><strong>{battlePhaseLabels[battle.phase]}</strong></div><div><span>추종자</span><strong>{battle.followerRefs.length}</strong></div></section>
      <section className="battle-workspace">{phaseContent()}</section>
      {latest && <PreviousResult title="직전 대전투 라운드" items={[{label:'라운드',value:latest.number},{label:'행동',value:actionLabels[latest.action] || latest.type},{label:'개인 결과',value:resultLabels[latest.combatOutcome] || latest.combatOutcome},{label:'특별 조우',value:latest.specialEvent?.enemy?.name},{label:'추종자 손실',value:latest.followerFate ? latest.followerFate.killed + latest.followerFate.wounded + latest.followerFate.captured : 0}]} />}
      {character.campaign?.health?.pendingDeath && <div className="battle-critical" role="alert"><Skull size={20} aria-hidden="true" /><div><strong>생명력이 0 이하입니다.</strong><p>Chapter 7 규칙에 따라 같은 날 자정 전 회복하지 못하면 사망합니다.</p></div><button type="button" className="secondary-command" onClick={() => updateCharacter(previous => confirmMassBattleDeath(previous))}>자정 사망 확정</button></div>}
      {character.campaign?.captivity?.status === 'active' && <section className="battle-captivity"><AlertTriangle size={20} aria-hidden="true" /><div><strong>포로 상태</strong><p>석방 조건을 해결하기 전에는 겨울·모험·개인 전투·신탁 활동이 잠깁니다.</p><div className="battle-form-grid"><SelectField label="해결" value={captivity.resolution} onChange={value => setCaptivity(previous => ({ ...previous, resolution: value }))} options={[{value:'ransomed',label:'몸값 조건으로 석방'},{value:'released',label:'조건 없이 석방'},{value:'escaped',label:'탈출'}]} /><NumberField label="몸값 £ · 미정이면 공란" value={captivity.amount} min={0} onChange={value => setCaptivity(previous => ({ ...previous, amount: value }))} /></div><button type="button" className="secondary-command" onClick={() => updateCharacter(previous => resolvePlayerCaptivity(previous, captivity))}>포로 상태 해결</button></div></section>}
    </>
  );
};

const SiegeSetup = ({ character, setCharacter, run }) => {
  const [setup, setSetup] = useState({
    name: `${character.personal?.campaignYear || 767}년 공성전`, fortress: '이름 없는 요새', dv: '5/3', naturalDv: 0,
    mode: 'advanced', playerSide: 'attacker', playerCommander: true,
    attackerName: '공격군', attackerSiege: character.skills?.siege || 5, attackerStewardship: character.skills?.stewardship || 3, attackerIntrigue: character.skills?.intrigue || 3, attackerTroops: 500, attackerEquipment: 16,
    defenderName: '수비군', defenderSiege: 10, defenderStewardship: 10, defenderIntrigue: 10, defenderTroops: 200, defenderEquipment: 5
  });
  const update = (key, value) => setSetup(previous => ({ ...previous, [key]: value }));
  const makeSide = key => ({
    name: setup[`${key}Name`], siege: setup[`${key}Siege`], stewardship: setup[`${key}Stewardship`], intrigue: setup[`${key}Intrigue`],
    troops: setup[`${key}Troops`], equipment: setup[`${key}Equipment`],
    valorous: key === setup.playerSide ? character.traits?.valorous : 15,
    retinue: key === setup.playerSide ? character.standings?.retinue : 10,
    commoners: key === setup.playerSide ? character.standings?.commoners : 10
  });
  return (
    <section className="battle-sheet">
      <header><div><span className="serial-label">새 공성전</span><h2>요새와 양측 전력</h2></div><StatusSeal tone="neutral">pp.156-161</StatusSeal></header>
      <div className="battle-form-grid battle-form-grid--four">
        <TextField label="공성전 이름" value={setup.name} onChange={value => update('name', value)} /><TextField label="요새" value={setup.fortress} onChange={value => update('fortress', value)} />
        <TextField label="DV · 바깥부터 / 구분" value={setup.dv} onChange={value => update('dv', value)} /><NumberField label="자연 지형 DV · #N" value={setup.naturalDv} onChange={value => update('naturalDv', value)} />
        <SelectField label="해결 방식" value={setup.mode} onChange={value => update('mode', value)} options={[{value:'advanced',label:'상세 공성 · 월 단위'},{value:'simple',label:'단순 공성 · 한 번 판정'}]} />
        <SelectField label="플레이어 측" value={setup.playerSide} onChange={value => update('playerSide', value)} options={[{value:'attacker',label:'공격군'},{value:'defender',label:'수비군'}]} />
      </div>
      {['attacker','defender'].map(key => <fieldset key={key} className="siege-side"><legend>{key === 'attacker' ? '공격군' : '수비군'}</legend><div className="battle-form-grid battle-form-grid--four"><TextField label="이름" value={setup[`${key}Name`]} onChange={value => update(`${key}Name`, value)} /><NumberField label="Siege" value={setup[`${key}Siege`]} onChange={value => update(`${key}Siege`, value)} /><NumberField label="Stewardship" value={setup[`${key}Stewardship`]} onChange={value => update(`${key}Stewardship`, value)} /><NumberField label="Intrigue" value={setup[`${key}Intrigue`]} onChange={value => update(`${key}Intrigue`, value)} /><NumberField label="병력" value={setup[`${key}Troops`]} onChange={value => update(`${key}Troops`, value)} /><NumberField label="공성 장비" value={setup[`${key}Equipment`]} onChange={value => update(`${key}Equipment`, value)} /></div></fieldset>)}
      <label className="battle-binary"><input type="checkbox" checked={setup.playerCommander} onChange={event => update('playerCommander', event.target.checked)} /><span>플레이어가 선택한 측의 지휘관</span></label>
      <button type="button" className="primary-command" onClick={() => run(() => setCharacter(previous => startSiege(previous, { ...setup, attacker: makeSide('attacker'), defender: makeSide('defender') }).character))}><Castle size={17} aria-hidden="true" />공성 기록 시작</button>
    </section>
  );
};

const SiegeFlow = ({ character, setCharacter, run, openCombat }) => {
  const siege = character.campaign?.siege;
  const [tactic, setTactic] = useState('assault');
  const [tacticInput, setTacticInput] = useState({ attackerEquipment: 0, defenderEquipment: 0, bribe: 0, target: 'commander', winner: 'draw' });
  const updateCharacter = resolver => run(() => setCharacter(previous => resolver(previous).character));
  if (!siege) return null;
  const currentDv = siege.originalDv?.[siege.currentRing] || 0;
  const recentTurn = siege.currentTurn || siege.turns.at(-1);
  const content = () => {
    if (siege.phase === 'health') return <><RuleNote page="Table 8-11 · p.158">매월 먼저 플레이어 기사와 양측 병력의 Siege 건강 판정을 해결합니다.</RuleNote><button type="button" className="primary-command" onClick={() => updateCharacter(previous => resolveSiegeHealth(previous))}><Dices size={17} aria-hidden="true" />이번 달 건강 판정</button></>;
    if (siege.phase === 'tactic') return <><RuleNote page="Tables 8-12 to 8-14">강습, 봉쇄, 배신, 대표 결투 중 하나만 이번 달 전술로 선택합니다. 대표 결투는 Chapter 7 엔진으로 해결합니다.</RuleNote><SelectField label="월간 전술" value={siege.mode === 'simple' ? 'assault' : tactic} onChange={setTactic} options={[{value:'assault',label:'강습'},{value:'blockade',label:'봉쇄'},{value:'treachery',label:'배신 공작'},{value:'single_combat',label:'대표 결투'}]} /><div className="battle-form-grid battle-form-grid--four">{(siege.mode === 'simple' || tactic === 'assault') && <><NumberField label="공격 장비 투입" value={tacticInput.attackerEquipment} max={siege.sides.attacker.equipment} onChange={value => setTacticInput(previous => ({ ...previous, attackerEquipment: value }))} /><NumberField label="수비 장비 투입" value={tacticInput.defenderEquipment} max={siege.sides.defender.equipment} onChange={value => setTacticInput(previous => ({ ...previous, defenderEquipment: value }))} /></>}{tactic === 'treachery' && <><NumberField label="뇌물 £" value={tacticInput.bribe} onChange={value => setTacticInput(previous => ({ ...previous, bribe: value }))} /><SelectField label="매수 대상" value={tacticInput.target} onChange={value => setTacticInput(previous => ({ ...previous, target: value }))} options={[{value:'commander',label:'요새 지휘관'},{value:'knights',label:'수비 기사'},{value:'commoners',label:'평민과 하인'}]} /></>}</div><button type="button" className="primary-command" onClick={() => tactic === 'single_combat' ? openCombat({ type: 'siege_single_combat' }) : updateCharacter(previous => resolveSiegeTactic(previous, { ...tacticInput, tactic: siege.mode === 'simple' ? 'assault' : tactic }))}>{tactic === 'single_combat' ? <Swords size={17} aria-hidden="true" /> : <ChevronRight size={17} aria-hidden="true" />}{tactic === 'single_combat' ? 'Chapter 7 대표 결투 시작' : '전술 해결'}</button></>;
    if (siege.phase === 'morale') return <><RuleNote page="Tables 8-15 and 8-16 · p.160">필요한 양측은 Valorous, Standing [retinue], Standing [commoners] 순으로 판정합니다. 항복·반란·철수가 즉시 공성 결과에 반영됩니다.</RuleNote><button type="button" className="primary-command" onClick={() => updateCharacter(previous => resolveSiegeMorale(previous))}><Dices size={17} aria-hidden="true" />사기 연쇄 판정</button></>;
    if (siege.phase === 'aftermath') return <><ResultBlock title={siege.result?.winner === 'attacker' ? '공격군이 요새를 차지함' : '수비군이 요새를 지킴'} tone="active"><p>{siege.result?.reason} · {siege.turns.length || 1}개월</p></ResultBlock><button type="button" className="primary-command" onClick={() => updateCharacter(previous => finalizeSiege(previous))}>공성 결과 확정</button></>;
    return <ResultBlock title="공성 기록 완료" tone="active"><p>{siege.fortress} · {siege.glory?.total || 0} Glory</p></ResultBlock>;
  };
  return <><StepRail phases={['health','tactic','morale','aftermath','complete']} current={siege.phase} labels={siegePhaseLabels} /><section className="battle-register"><div><span>요새</span><strong>{siege.fortress}</strong></div><div><span>월</span><strong>{siege.month}</strong></div><div><span>현재 방어선 DV</span><strong>{currentDv}</strong></div><div><span>남은 방어선</span><strong>{Math.max(0, siege.originalDv.length - siege.currentRing)}</strong></div></section><section className="battle-workspace">{content()}</section>{recentTurn && <PreviousResult title="직전 공성 기록" items={[{label:'월',value:recentTurn.month},{label:'전술',value:siegeTacticLabels[recentTurn.tactic?.type]},{label:'공격 손실',value:siegeLossLabels[recentTurn.tactic?.attackerLoss?.level]},{label:'수비 손실',value:siegeLossLabels[recentTurn.tactic?.defenderLoss?.level]},{label:'방어선',value:recentTurn.tactic?.assault?.defensesTaken ? '함락' : recentTurn.tactic ? '유지' : '판정 전'}]} />}{siege.status === 'active' && !['aftermath','complete'].includes(siege.phase) && <button type="button" className="battle-withdraw" onClick={() => updateCharacter(previous => withdrawFromSiege(previous, siege.playerSide))}>선택한 측이 공성에서 철수</button>}</>;
};

export default function BattleSiege({ character, setCharacter, onNavigate }) {
  const [mode, setMode] = useState('battle');
  const [error, setError] = useState('');
  const run = action => {
    try { setError(''); action(); }
    catch (caught) { setError(caught.message || '판정을 완료하지 못했습니다.'); }
  };
  const skirmish = character.campaign?.skirmish;
  const battle = character.campaign?.massBattle;
  const siege = character.campaign?.siege;
  const openCombat = context => run(() => {
    setCharacter(previous => beginChapter8PersonalCombat(previous, context));
    onNavigate?.('combat');
  });
  return (
    <article className="folio-page battle-ledger view-animate">
      <FolioHeading eyebrow="Liber Belli · Chapter Eight" title="대전투와 공성" year={character.personal?.campaignYear || 767}>전장 지휘부터 추격과 전후 처리, 월별 공성까지 원문 순서대로 기록합니다.</FolioHeading>
      <div className="battle-mode-tabs" role="tablist" aria-label="전쟁 절차"><button type="button" role="tab" aria-selected={mode === 'skirmish'} className={mode === 'skirmish' ? 'active' : ''} onClick={() => setMode('skirmish')}><Swords size={17} aria-hidden="true" />소규모 교전</button><button type="button" role="tab" aria-selected={mode === 'battle'} className={mode === 'battle' ? 'active' : ''} onClick={() => setMode('battle')}><Flag size={17} aria-hidden="true" />대규모 전투</button><button type="button" role="tab" aria-selected={mode === 'siege'} className={mode === 'siege' ? 'active' : ''} onClick={() => setMode('siege')}><Castle size={17} aria-hidden="true" />공성</button></div>
      {error && <div className="battle-error" role="alert"><AlertTriangle size={18} aria-hidden="true" />{error}</div>}
      <SectionHeader index={mode === 'skirmish' ? 'I' : mode === 'battle' ? 'II' : 'III'} title={mode === 'skirmish' ? '교전 절차 장부' : mode === 'battle' ? '전투 절차 장부' : '공성 절차 장부'} meta={mode === 'skirmish' ? 'Skirmish Procedure' : mode === 'battle' ? 'Battle Procedure' : 'Siege Procedure'} />
      {mode === 'skirmish' ? <>{(!skirmish || skirmish.status === 'complete') && <SkirmishSetup character={character} setCharacter={setCharacter} run={run} />}{skirmish && <SkirmishFlow character={character} setCharacter={setCharacter} run={run} openCombat={openCombat} />}</> : mode === 'battle' ? <>{(!battle || battle.status === 'complete') && <BattleSetup character={character} setCharacter={setCharacter} run={run} />}{battle && <BattleFlow character={character} setCharacter={setCharacter} run={run} openCombat={openCombat} />}</> : <>{(!siege || siege.status === 'complete') && <SiegeSetup character={character} setCharacter={setCharacter} run={run} />}{siege && <SiegeFlow character={character} setCharacter={setCharacter} run={run} openCombat={openCombat} />}</>}
    </article>
  );
}

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpenCheck,
  Check,
  ChevronRight,
  CirclePause,
  Coins,
  Dices,
  Flag,
  HeartHandshake,
  Play,
  RotateCcw,
  ScrollText,
  Shield,
  Swords,
  UsersRound
} from 'lucide-react';
import { FolioHeading, SectionHeader, StatusSeal } from '../../components/ui/LedgerUI';
import {
  CHAPTER_19_LONG_ADVENTURES,
  CHAPTER_19_OVERVIEWS,
  CHAPTER_19_SHORT_FORMS,
  CHAPTER_19_SOLOS,
  CHAPTER_19_TABLES
} from '../../data/chapter19Data';
import { BIRTH_GIFTS, MELEE_WEAPON_SKILLS } from '../../rules/characterCreationData';
import {
  abortAdventure,
  acknowledgeAdventureConsequence,
  applyAdventureConsequence,
  beginAdventureBattle,
  beginAdventureChase,
  beginAdventureCombat,
  beginAdventureHunt,
  beginAdventurePersonalityMagic,
  completeAdventureBattleReturn,
  completeAdventureChase,
  completeAdventureHunt,
  completeAdventureStage,
  deferAdventure,
  getAdventureDefinition,
  getAdventureRepeatStatus,
  getAdventureTableSubsystemRequirement,
  getCurrentAdventureStage,
  recordAdventureDecision,
  recordAdventureChaseEnding,
  recordAdventureProcedureItem,
  resolveAdventureTable,
  resolveAdventureTest,
  resolveAdventureHuntAction,
  resolveAdventureHuntDiscovery,
  resolveAdventureHuntObstacle,
  resolveAdventureHuntPrey,
  resolveAdventureHuntSurprise,
  resolveAdventureKnighthood,
  resolveAdventureChaseStage,
  resumeAdventure,
  skipOptionalAdventureStage,
  startAdventure
} from '../../rules/adventureRules';
import {
  getChapter18AdventureDefaults,
  getChapter18Creature,
  listChapter18Creatures
} from '../../rules/chapter18Rules';
import './AdventureJournal.css';

const GROUPS = [
  ['long', '장편 모험', CHAPTER_19_LONG_ADVENTURES],
  ['short', 'Short Form', CHAPTER_19_SHORT_FORMS, 'en'],
  ['solo', 'Solo 절차', CHAPTER_19_SOLOS]
];

const KIND_LABELS = {
  setup: '설정', reference: '원문 참조', player_choice: '플레이어 선택', gm_decision: 'GM 판단', narrative: '서술',
  test: '판정', table: '표', procedure: '절차', subsystem: '기존 엔진', dependency: '외부 의존성', consequence: '결과', aftermath: '후속 처리'
};

const TEST_LABELS = {
  religion: 'Religion', intrigue: 'Intrigue', loveCharlemagne: 'Love [Charlemagne]', siege: 'Siege', folkLore: 'Folk Lore',
  loveGod: 'Love [God]', courtesy: 'Courtesy', eloquence: 'Eloquence', gaming: 'Gaming', heraldry: 'Heraldry', recognize: 'Recognize',
  dancing: 'Dancing', singing: 'Singing', horsemanship: 'Horsemanship', hunting: 'Hunting', faerieLore: 'Faerie Lore',
  energetic: 'Energetic', amor: 'Amor', app: 'APP', chaste: 'Chaste', modest: 'Modest', forgiving: 'Forgiving', generous: 'Generous',
  temperate: 'Temperate', trusting: 'Trusting'
};

const STAGE_NOTES = {
  jewel: {
    setup: '766년, 티에리 공작은 리에주의 성 마르키아누스 성유물을 라 로슈로 운반하라고 종자들과 제롬 사제에게 명합니다.',
    information: '출발 전에 Religion과 Intrigue로 성유물과 주변 상황에 관한 정보를 확인합니다.',
    pilgrim: '낯선 순례자에게 자선을 베풀지 않으면 참가자 모두 Selfish를 확인합니다.',
    brigands: '플레이어 종자 한 명당 도적 셋, 그중 한 명은 궁수입니다. 도적 하나가 Major Wound를 입거나 HP 절반을 잃으면 달아납니다.',
    route: '도적 이후 남쪽 길에서 섬 쪽과 에스뇌 쪽 진행을 선택합니다.',
    hermit: '은자의 정체와 조언은 GM 판단입니다. 환대와 종교적 대화, 치유 결과를 기록합니다.',
    dream: '꿈의 의미는 Love [Charlemagne] 판정으로 다룹니다.',
    beaver_dam: '분노한 농민과 무너질 둑을 마주합니다. Siege 성공은 홍수를 막습니다.',
    esneux: 'Folk Lore로 에스뇌의 소문을 얻습니다. 대성공이면 더 구체적인 정보를 얻습니다.',
    eingarstein: '에인가르슈타인에서 인질, 신혼부부, 에인가르 경에 대한 접근을 GM과 확정합니다.',
    werewolf: '밤의 에인가르와 늑대 가죽은 Chapter 7 전투로 처리합니다. 성 마르키아누스의 기도가 성공했다면 공용 기도 거래가 에인가르의 모든 행동 -5를 자동 반영합니다.',
    return: '라 로슈 귀환, 성유물과 늑대 가죽의 소유·기부, 임무 성공 여부를 확정합니다.',
    aftermath: 'p.399: 도적 사살·부상 1, 포획 2, 꿈 해석 10, 성유물 축복 20, 병사 격파 10, 에인가르 격파 50, 주군에게 기부한 £마다 1, 늑대 망토 50 Glory. 궁정 Eloquence 성공은 이 모험 Glory 전체를 두 배로 합니다. Folk Lore는 자동 체크이며, 원문 조건을 충족한 Just·Merciful·Prudent·Honor·Standing·Hunting·Intrigue·Eloquence 체크만 적용합니다.'
  },
  humble_squires: {
    setup: '767년, 알프스를 넘어 로마로 향하는 프랑크 군과 종자 참가자를 확정합니다.',
    mountain_dangers: '각 참가자가 Table 19-1을 한 번 판정하고 실패 결과를 기존 말·상처 상태에 반영합니다.',
    white_deer: '흰 사슴 추격은 p.424 Hunt 절차를 사용합니다. 15분짜리 4 segment, 원문 합산 수정 +2입니다.',
    rumors: 'Spoleto에서 Intrigue 성공마다 소문 하나, 대성공이면 두 개를 얻습니다.',
    blessing: 'Love [God] 결과로 전투 기간 수정은 성공 +1, 대성공 +2, 대실패 -1입니다.',
    rome_battle: '겸손한 종자들의 전투는 Chapter 8을 실행합니다. 세부 개인 교전은 Chapter 8이 Chapter 7을 호출합니다.',
    battle_enemy: '전투 라운드 상대를 Table 19-3에서 확정합니다. 표 결과는 Chapter 7/8의 적 입력으로 소비합니다.',
    third_round: '3라운드의 Falseron 또는 Morlant를 Table 19-4로 확정합니다.',
    battle_choices: '후반에는 포로 해방, 약탈, 이교도 포획 가운데 원문 행동을 선택합니다.',
    knighting: '서임식과 Frankish Birth Gift는 기존 생애주기/캐릭터 생성 절차에 넘깁니다.',
    paladins: '팔라딘 기사단 창설과 참가자의 지위는 플레이 결과에 맞게 서술합니다.',
    mount_bitter: 'Table 19-5의 1~5라운드 고정 사건을 순서대로 처리합니다. 화살, 돌격, 지휘관 교전과 패주 뒤 개인전은 Chapter 7 결과를 반환받습니다.',
    challenges: 'Carahue 이후의 기사도 도전은 Chapter 7 마상시합/개인전투를 사용합니다.',
    ambush: '불명예스러운 매복의 개인전투는 Chapter 7을 사용합니다.',
    aftermath: 'p.405·408: 알프스 늑대 1, 흰 사슴 길 20(나이모에게 알리면 x2), 관련 소문 1, 투르팽 축복 20, 첫 전투 성공 라운드 50, 샤를마뉴 구출 100/말 구출 50/전마 전달 100, Joyeuse 회수 50, 약탈 £마다 1, 샤를마뉴 직접 서임 1,300. 선택 후속부는 Mount Bitter 성공 라운드 50, 섬 교전 20, 곰 10·표범 75, 그리핀 원조 100, Floripas 시련 25, 공성 저항 100만 적용합니다.'
  }
};

const defaultStageNote = (definition, stage) => {
  if (stage.prompt) return stage.prompt;
  if (definition.type === 'short_form') {
    return `${CHAPTER_19_OVERVIEWS[definition.id]} 현재 ${stage.title} 단계에서 원문 사실과 플레이어·GM 판단을 구분해 기록합니다.`;
  }
  if (stage.kind === 'table') return `${stage.tableId} ${CHAPTER_19_TABLES[stage.tableId]?.title}의 결과를 한 번 확정하고 같은 저장에서 재추첨하지 않습니다.`;
  return CHAPTER_19_OVERVIEWS[definition.id] || '원문이 요구하는 선택, 판정 또는 서술을 기록한 뒤 다음 단계로 진행합니다.';
};

const Field = ({ label, children }) => <label className="adventure-field"><span>{label}</span>{children}</label>;

const AdventureCatalog = ({ onStart }) => {
  const [selected, setSelected] = useState('jewel');
  const [participants, setParticipants] = useState('');
  const definition = getAdventureDefinition(selected);
  return <section className="adventure-catalog" aria-labelledby="adventure-catalog-title">
    <header><div><span className="serial-label" lang="en">Chapter 19 · Initium</span><h2 id="adventure-catalog-title">모험 선택</h2></div><StatusSeal tone="neutral"><span lang="en">34 procedures</span></StatusSeal></header>
    <div className="adventure-catalog__layout">
      <div className="adventure-catalog__groups">
        {GROUPS.map(([id, label, items, language]) => <section key={id}><h3 lang={language}>{label}<small>{items.length}</small></h3><div role="list">{items.map(item => <button type="button" key={item.id} className={selected === item.id ? 'active' : ''} onClick={() => setSelected(item.id)}><span lang="en">{item.title}</span><small>{item.sourcePage}</small><ChevronRight size={15} aria-hidden="true" /></button>)}</div></section>)}
      </div>
      <aside className="adventure-catalog__brief">
        <span className="serial-label">{definition.type.replace('_', ' ')}</span>
        <h3 lang="en">{definition.title}</h3>
        <p>{CHAPTER_19_OVERVIEWS[definition.id]}</p>
        <p>{definition.sourcePage} · {definition.stages.length}단계 · {definition.integrations.join(', ')}</p>
        {definition.dependencies.length > 0 && <div className="adventure-dependencies"><AlertTriangle size={17} aria-hidden="true" /><span>외부 의존성: {definition.dependencies.join(', ')}</span></div>}
        <Field label="추가 참가자 · 쉼표 구분"><input value={participants} onChange={event => setParticipants(event.target.value)} placeholder="다른 Player-knight 이름" /></Field>
        <button type="button" className="primary-command" onClick={() => onStart(selected, participants)}><Play size={17} aria-hidden="true" />모험 시작</button>
      </aside>
    </div>
  </section>;
};

const StageRail = ({ definition, active }) => <ol className="adventure-stage-rail" aria-label="모험 진행 단계">{definition.stages.map((stage, index) => {
  const complete = active.completedStageIds.includes(stage.id);
  const current = index === active.stageIndex;
  return <li key={stage.id} className={current ? 'active' : complete ? 'complete' : ''} aria-current={current ? 'step' : undefined}><span>{String(index + 1).padStart(2, '0')}</span><div><b lang="en">{stage.title}</b><small>{KIND_LABELS[stage.kind]} · p.{stage.sourcePage}</small></div>{complete && <Check size={15} aria-hidden="true" />}</li>;
})}</ol>;

const TableWorkspace = ({ tableId, resolved, onResolve }) => {
  const table = CHAPTER_19_TABLES[tableId];
  const [roll, setRoll] = useState('');
  const [rowIndex, setRowIndex] = useState('');
  const selectable = ['reference', 'opposed', 'gm reference', 'round', 'inspection score', 'fumbled passion value', 'sequence'].includes(table.die);
  const numericRoll = Number(roll);
  const matches = roll === '' ? [] : table.rows.map((item, index) => ({ item, index })).filter(({ item }) => numericRoll >= item.min && numericRoll <= item.max);
  const ambiguous = matches.length > 1;
  return <section className="adventure-table-workspace">
    <header><div><span className="serial-label">Table {tableId}</span><h3 lang="en">{table.title}</h3></div><code>p.{table.sourcePage}</code></header>
    <div className="adventure-table-scroll"><table><thead><tr><th>범위</th><th>결과</th><th>효과·자료</th></tr></thead><tbody>{table.rows.map((item, index) => <tr key={`${item.min}:${item.max}:${index}`} className={resolved?.min === item.min && resolved?.max === item.max ? 'selected' : ''}><td>{item.min === item.max ? item.min : `${item.min}-${item.max}`}</td><td>{item.result}</td><td>{item.effect || [item.skill, item.damage, item.test].filter(Boolean).join(' · ') || '원문 결과 참조'}</td></tr>)}</tbody></table></div>
    {!resolved ? <div className="adventure-table-controls"><Field label={selectable ? '결과 행 값' : table.die}><input type="number" value={roll} onChange={event => { setRoll(event.target.value); setRowIndex(''); }} /></Field>{ambiguous && <fieldset className="adventure-table-ambiguity"><legend>원문 범위 중복 · GM 확정</legend>{matches.map(({ item, index }) => <label key={index}><input type="radio" name={`${tableId}-row`} checked={Number(rowIndex) === index && rowIndex !== ''} onChange={() => setRowIndex(String(index))} /><span>{item.min}-{item.max} · {item.result}</span></label>)}</fieldset>}<button type="button" className="secondary-command" disabled={roll === '' || (ambiguous && rowIndex === '')} onClick={() => onResolve({ roll: numericRoll, rowIndex: rowIndex === '' ? undefined : Number(rowIndex) })}><Dices size={17} aria-hidden="true" />결과 확정</button></div> : <div className="adventure-resolved"><Check size={17} aria-hidden="true" /><div><strong>{resolved.roll} · {resolved.result}</strong><p>{resolved.effect || '표 결과가 현재 모험 저장에 고정되었습니다.'}</p></div></div>}
  </section>;
};

const ConsequenceWorkspace = ({ pending, onApply, onAcknowledge }) => {
  const [form, setForm] = useState({ type: 'check', group: 'skills', key: '', amount: 0, amountDeniers: 0, damage: 0, reason: '' });
  const update = (key, value) => setForm(previous => ({ ...previous, [key]: value }));
  return <section className="adventure-consequence" aria-label="표 결과 후속 처리">
    <header><AlertTriangle size={18} aria-hidden="true" /><div><strong>원문 결과 반영</strong><p>{pending.description}</p></div></header>
    {pending.presets?.length > 0 && <div className="adventure-consequence__presets">{pending.presets.map(preset => {
      const transactionId = `${pending.id}:${preset.id}`;
      const applied = pending.appliedActions?.includes(transactionId);
      return <button type="button" key={preset.id} className="secondary-command" disabled={applied} onClick={() => onApply({ ...preset, transactionId, reason: preset.label })}>{applied ? <Check size={16} aria-hidden="true" /> : null}{preset.label}</button>;
    })}</div>}
    <div className="adventure-consequence__form">
      <Field label="처리 종류"><select value={form.type} onChange={event => update('type', event.target.value)}><option value="check">경험 체크</option><option value="glory">Glory</option><option value="standing">Standing</option><option value="honor">Honor</option><option value="score">수치 변화</option><option value="economy">Economy v2</option><option value="damage">상처 엔진</option></select></Field>
      {['check', 'score'].includes(form.type) && <Field label="그룹"><select value={form.group} onChange={event => update('group', event.target.value)}><option value="skills">Skills</option><option value="traits">Traits</option><option value="passions">Passions</option><option value="standings">Standings</option></select></Field>}
      {['check', 'score', 'standing'].includes(form.type) && <Field label="수치 키"><input value={form.key} onChange={event => update('key', event.target.value)} placeholder="예: hunting" /></Field>}
      {['glory', 'standing', 'honor', 'score'].includes(form.type) && <Field label="변화량"><input type="number" value={form.amount} onChange={event => update('amount', event.target.value)} /></Field>}
      {form.type === 'economy' && <Field label="금액 · denier"><input type="number" value={form.amountDeniers} onChange={event => update('amountDeniers', event.target.value)} /></Field>}
      {form.type === 'damage' && <Field label="피해"><input type="number" min="0" value={form.damage} onChange={event => update('damage', event.target.value)} /></Field>}
      <Field label="근거·사유"><input value={form.reason} onChange={event => update('reason', event.target.value)} placeholder="원문 결과의 해당 항목" /></Field>
      <button type="button" className="secondary-command" onClick={() => onApply(form)}>정식 장부에 반영</button>
      <button type="button" className="text-command" onClick={onAcknowledge}>별도 상태 변화 없음으로 확인</button>
    </div>
    {pending.appliedActions?.length > 0 && <small>{pending.appliedActions.length}개 canonical action 반영됨</small>}
  </section>;
};

const RELIGIOUS_TRAIT_OPTIONS = ['chaste', 'energetic', 'forgiving', 'generous', 'honest', 'just', 'merciful', 'modest', 'prudent', 'temperate'];

const KnighthoodWorkspace = ({ onResolve }) => {
  const [form, setForm] = useState({ roll: '', extraRolls: '', duplicateRerolls: '', choiceRoll: '', relicRoll: '', religiousTrait: 'chaste', weapon: 'sword' });
  const update = (key, value) => setForm(previous => ({ ...previous, [key]: value }));
  const roll = Number(form.roll);
  const gift = BIRTH_GIFTS.find(item => roll >= item.range[0] && roll <= item.range[1]);
  const parseRolls = value => value.split(',').map(item => Number(item.trim())).filter(item => Number.isInteger(item));
  return <section className="adventure-procedure" aria-label="기사 서임과 Frankish Birth Gift">
    <header><Shield size={19} aria-hidden="true" /><div><strong>The Knighting Ceremony</strong><p>Saint Peter’s Basilica · Joyeuse · Chapter 1 ceremony · p.406</p></div></header>
    <div className="adventure-subsystem__grid">
      <Field label="Frankish Birth Gift · 1d20"><input type="number" min="1" max="20" value={form.roll} onChange={event => update('roll', event.target.value)} /></Field>
      {gift?.special === 'rollTwice' && <Field label="추가 1d20 · 쉼표 구분"><input value={form.extraRolls} onChange={event => update('extraRolls', event.target.value)} placeholder="예: 4, 13" /></Field>}
      {gift?.key === 'playerChoice' && <Field label="선택한 표 결과 · 1-19"><input type="number" min="1" max="19" value={form.choiceRoll} onChange={event => update('choiceRoll', event.target.value)} /></Field>}
      {(gift?.key === 'sacredRelic' || form.extraRolls.split(',').map(Number).some(value => [8, 9].includes(value))) && <><Field label="성유물 1d6"><input type="number" min="1" max="6" value={form.relicRoll} onChange={event => update('relicRoll', event.target.value)} /></Field><Field label="Religious Trait"><select value={form.religiousTrait} onChange={event => update('religiousTrait', event.target.value)}>{RELIGIOUS_TRAIT_OPTIONS.map(item => <option key={item} value={item}>{item}</option>)}</select></Field></>}
      {(gift?.key === 'exceptionalWeapon' || form.extraRolls.split(',').map(Number).includes(17)) && <Field label="Exceptional weapon"><select value={form.weapon} onChange={event => update('weapon', event.target.value)}>{MELEE_WEAPON_SKILLS.map(item => <option key={item} value={item}>{item}</option>)}</select></Field>}
      {gift?.special === 'rollTwice' && <Field label="중복 15 재굴림 · 쉼표 구분"><input value={form.duplicateRerolls} onChange={event => update('duplicateRerolls', event.target.value)} /></Field>}
    </div>
    {gift && <div className="adventure-resolved"><BookOpenCheck size={17} aria-hidden="true" /><strong>{gift.label}</strong><span>{gift.range[0] === gift.range[1] ? gift.range[0] : `${gift.range[0]}-${gift.range[1]}`}</span></div>}
    <button type="button" className="primary-command" disabled={!gift} onClick={() => onResolve({ ...form, roll, choiceRoll: Number(form.choiceRoll), relicRoll: Number(form.relicRoll), extraRolls: parseRolls(form.extraRolls), duplicateRerolls: parseRolls(form.duplicateRerolls) })}><Shield size={17} aria-hidden="true" />기사 서임과 선물 확정</button>
  </section>;
};

const ProcedureWorkspace = ({ stage, progress, onRecord, onComplete }) => {
  const [notes, setNotes] = useState({});
  const completed = new Set(progress?.completedItemIds || []);
  const required = stage.procedure.items.filter(item => !item.optional);
  const ready = required.every(item => completed.has(item.id)) && completed.size >= stage.procedure.minimum;
  return <section className="adventure-procedure" aria-label="원문 절차 체크리스트">
    <header><ScrollText size={19} aria-hidden="true" /><div><strong>원문 실행 절차</strong><p>완료한 단계와 판단 근거가 저장·재개 후에도 그대로 유지됩니다.</p></div></header>
    <ol>{stage.procedure.items.map(item => <li key={item.id} className={completed.has(item.id) ? 'complete' : ''}>
      <div><strong>{item.title}</strong><small>p.{item.sourcePage}{item.optional ? ' · 조건부' : ''}</small></div>
      {!completed.has(item.id) ? <><input aria-label={`${item.title} 기록`} value={notes[item.id] || ''} onChange={event => setNotes(previous => ({ ...previous, [item.id]: event.target.value }))} placeholder="플레이 결과 또는 GM 판단" /><button type="button" className="secondary-command" onClick={() => onRecord({ itemId: item.id, note: notes[item.id] || '' })}><Check size={16} aria-hidden="true" />처리 완료</button></> : <StatusSeal tone="active">완료</StatusSeal>}
    </li>)}</ol>
    <button type="button" className="primary-command" disabled={!ready} onClick={onComplete}>절차를 확정하고 계속<ChevronRight size={17} aria-hidden="true" /></button>
  </section>;
};

const ChaseWorkspace = ({ chase, onStart, onResolve, onEnding, onComplete }) => {
  const [setup, setSetup] = useState({ initialDistance: 1, unit: 'distance unit', pursuerName: 'Pursuers', pursuerSpeed: 6, fleeingName: 'Fleeing group', fleeingSpeed: 6, maxStages: 10 });
  const [round, setRound] = useState({ pursuerRoll: '', fleeingRoll: '', pursuerTactic: 0, fleeingTactic: 0, pursuerObstacle: 0, fleeingObstacle: 0, fleeingReachedObjective: false, groupStopped: '', note: '' });
  const [ending, setEnding] = useState({ outcome: 'escaped', note: '' });
  const updateSetup = (key, value) => setSetup(previous => ({ ...previous, [key]: value }));
  const updateRound = (key, value) => setRound(previous => ({ ...previous, [key]: value }));
  if (!chase) return <section className="adventure-chase"><header><Flag size={20} aria-hidden="true" /><div><strong>Chapter 19 Chase 준비</strong><p>p.426의 거리, 상대 속도, 최대 stage를 먼저 확정합니다.</p></div></header><div className="adventure-subsystem__grid">
    <Field label="초기 거리"><input type="number" min="1" value={setup.initialDistance} onChange={event => updateSetup('initialDistance', event.target.value)} /></Field>
    <Field label="거리 단위"><input value={setup.unit} onChange={event => updateSetup('unit', event.target.value)} /></Field>
    <Field label="추격자"><input value={setup.pursuerName} onChange={event => updateSetup('pursuerName', event.target.value)} /></Field>
    <Field label="추격자 속도"><input type="number" min="0" value={setup.pursuerSpeed} onChange={event => updateSetup('pursuerSpeed', event.target.value)} /></Field>
    <Field label="도주자"><input value={setup.fleeingName} onChange={event => updateSetup('fleeingName', event.target.value)} /></Field>
    <Field label="도주자 속도"><input type="number" min="0" value={setup.fleeingSpeed} onChange={event => updateSetup('fleeingSpeed', event.target.value)} /></Field>
    <Field label="최대 stage"><input type="number" min="1" max="10" value={setup.maxStages} onChange={event => updateSetup('maxStages', event.target.value)} /></Field>
  </div><button type="button" className="primary-command" onClick={() => onStart({ ...setup, initialDistance: Number(setup.initialDistance), pursuerSpeed: Number(setup.pursuerSpeed), fleeingSpeed: Number(setup.fleeingSpeed), maxStages: Number(setup.maxStages) })}><Play size={17} aria-hidden="true" />Chase 시작</button></section>;

  return <section className="adventure-chase"><header><Flag size={20} aria-hidden="true" /><div><strong>Chase stage {chase.currentStage}</strong><p>거리 {chase.distance} {chase.unit} · {chase.pursuer.name} {chase.pursuer.speed} / {chase.fleeing.name} {chase.fleeing.speed}</p></div></header>
    {chase.status === 'active' && <><div className="adventure-subsystem__grid">
      <Field label="추격자 1d6"><input type="number" min="1" max="6" value={round.pursuerRoll} onChange={event => updateRound('pursuerRoll', event.target.value)} /></Field>
      <Field label="도주자 1d6"><input type="number" min="1" max="6" value={round.fleeingRoll} onChange={event => updateRound('fleeingRoll', event.target.value)} /></Field>
      <Field label="추격자 지연 전술 +1/+2"><input type="number" min="0" max="2" value={round.pursuerTactic} onChange={event => updateRound('pursuerTactic', event.target.value)} /></Field>
      <Field label="도주자 지연 전술 +1/+2"><input type="number" min="0" max="2" value={round.fleeingTactic} onChange={event => updateRound('fleeingTactic', event.target.value)} /></Field>
      <Field label="추격자 장애물 -1/-2"><input type="number" min="0" max="2" value={round.pursuerObstacle} onChange={event => updateRound('pursuerObstacle', event.target.value)} /></Field>
      <Field label="도주자 장애물 -1/-2"><input type="number" min="0" max="2" value={round.fleeingObstacle} onChange={event => updateRound('fleeingObstacle', event.target.value)} /></Field>
    </div><label className="adventure-checkbox"><input type="checkbox" checked={round.fleeingReachedObjective} onChange={event => updateRound('fleeingReachedObjective', event.target.checked)} /><span>도주자가 GM이 정한 목적지에 도달</span></label><Field label="멈춘 집단 · 해당할 때만"><input value={round.groupStopped} onChange={event => updateRound('groupStopped', event.target.value)} /></Field><Field label="stage 장면"><input value={round.note} onChange={event => updateRound('note', event.target.value)} /></Field><button type="button" className="secondary-command" disabled={round.pursuerRoll === '' || round.fleeingRoll === ''} onClick={() => onResolve({ ...round, pursuerRoll: Number(round.pursuerRoll), fleeingRoll: Number(round.fleeingRoll), pursuerTactic: Number(round.pursuerTactic), fleeingTactic: Number(round.fleeingTactic), pursuerObstacle: Number(round.pursuerObstacle), fleeingObstacle: Number(round.fleeingObstacle) })}><Dices size={17} aria-hidden="true" />stage 판정</button></>}
    {chase.status === 'gm_end_pending' && <div className="adventure-chase__ending"><p>최대 stage에 도달했습니다. 원문이 GM에게 맡긴 종료 조건을 확정합니다.</p><Field label="결과"><select value={ending.outcome} onChange={event => setEnding(previous => ({ ...previous, outcome: event.target.value }))}><option value="escaped">도주 성공</option><option value="stopped">한 집단 정지</option><option value="caught">추격 성공</option></select></Field><Field label="GM 기록"><input value={ending.note} onChange={event => setEnding(previous => ({ ...previous, note: event.target.value }))} /></Field><button type="button" className="secondary-command" onClick={() => onEnding(ending)}>종료 확정</button></div>}
    {['caught', 'escaped', 'stopped'].includes(chase.status) && <><div className="adventure-resolved"><Check size={17} aria-hidden="true" /><strong>{chase.outcome}</strong><span>최종 거리 {chase.distance} · {chase.rounds.length} stage</span></div><button type="button" className="primary-command" onClick={() => onComplete({ note: ending.note })}>모험으로 결과 반환<ChevronRight size={17} aria-hidden="true" /></button></>}
  </section>;
};

const HuntWorkspace = ({ active, stage, character, hunt, onStart, onAction, onObstacle, onPrey, onDiscovery, onSurprise, onCombat, onComplete }) => {
  const fixed = stage.hunt || {};
  const [setup, setSetup] = useState({
    season: 'spring_autumn', segments: fixed.segments || 8, terrainModifier: fixed.modifier || 0,
    preyAvoidance: fixed.prey?.avoidance || 0,
    hunters: active.participants.map(participant => ({ participantId: participant.id, hunting: participant.characterId === character.campaign?.lifecycle?.activeCharacterId ? character.skills?.hunting || 0 : 0, mode: 'hunter' }))
  });
  const [selectedHunter, setSelectedHunter] = useState(active.participants[0]?.id || '');
  const [action, setAction] = useState({ roll: '', preyRoll: '', preyAvoidance: '' });
  const [obstacle, setObstacle] = useState({ roll: '', overcome: true });
  const [prey, setPrey] = useState({ roll: '', rowIndex: '', specialRoll: '' });
  const [surprise, setSurprise] = useState({ weaponSkill: character.skills?.sword || 0, roll: '', preyRoll: '' });
  const updateHunter = (participantId, key, value) => setSetup(previous => ({
    ...previous,
    hunters: previous.hunters.map(item => item.participantId === participantId ? { ...item, [key]: value } : item)
  }));

  if (!hunt) return <section className="adventure-hunt"><header><Dices size={20} aria-hidden="true" /><div><strong>Chapter 19 Hunt 준비</strong><p>Table 19-8~19-12를 이 장면 안에서 순서대로 소비합니다.</p></div></header>
    <div className="adventure-subsystem__grid">
      {!fixed.segments && <Field label="계절"><select value={setup.season} onChange={event => setSetup(previous => ({ ...previous, season: event.target.value, segments: event.target.value === 'winter' ? 6 : event.target.value === 'summer' ? 10 : 8 }))}><option value="winter">Winter · 6</option><option value="spring_autumn">Spring/Autumn · 8</option><option value="summer">Summer · 10</option></select></Field>}
      <Field label="Segment 수"><input type="number" min="1" max="10" value={setup.segments} disabled={Boolean(fixed.segments)} onChange={event => setSetup(previous => ({ ...previous, segments: Number(event.target.value) }))} /></Field>
      <Field label="Hunting 수정"><input type="number" value={setup.terrainModifier} disabled={fixed.modifier !== undefined} onChange={event => setSetup(previous => ({ ...previous, terrainModifier: Number(event.target.value) }))} /></Field>
      <Field label="먹잇감 Avoidance · GM 필수"><input type="number" min="1" value={setup.preyAvoidance || ''} disabled={Boolean(fixed.prey)} onChange={event => setSetup(previous => ({ ...previous, preyAvoidance: Number(event.target.value) }))} /></Field>
    </div>
    <div className="adventure-hunters">{active.participants.map(participant => { const entry = setup.hunters.find(item => item.participantId === participant.id); return <div key={participant.id}><strong>{participant.name}</strong><Field label="역할"><select value={entry.mode} onChange={event => updateHunter(participant.id, 'mode', event.target.value)}><option value="hunter">직접 추적</option><option value="follower">다른 기사 추종</option></select></Field>{entry.mode === 'hunter' && <Field label="Hunting"><input type="number" min="0" value={entry.hunting} onChange={event => updateHunter(participant.id, 'hunting', Number(event.target.value))} /></Field>}</div>; })}</div>
    <button type="button" className="primary-command" disabled={Number(setup.preyAvoidance) < 1} onClick={() => onStart(setup)}><Play size={17} aria-hidden="true" />Hunt 시작</button>
  </section>;

  const selected = hunt.hunters.find(item => item.id === selectedHunter) || hunt.hunters.find(item => item.mode === 'hunter');
  const preyMatches = prey.roll === '' ? [] : CHAPTER_19_TABLES['19-11'].rows.map((item, index) => ({ item, index })).filter(({ item }) => Number(prey.roll) >= item.min && Number(prey.roll) <= item.max);
  return <section className="adventure-hunt"><header><Dices size={20} aria-hidden="true" /><div><strong>Hunt 진행</strong><p>Segment {hunt.currentSegment} · {hunt.segmentsRemaining}/{hunt.segmentsTotal} 남음 · 위치선 0~6</p></div></header>
    <div className="adventure-hunt-track">{hunt.hunters.map(hunter => <button type="button" key={hunter.id} className={selected?.id === hunter.id ? 'active' : ''} onClick={() => setSelectedHunter(hunter.id)} disabled={hunter.mode === 'follower'}><span>{hunter.name}</span><b>{hunter.marker}</b><small>{hunter.status}{hunter.huntTrainedMount ? ' · 사냥마 +5' : ''}</small></button>)}</div>

    {hunt.phase === 'segments' && !hunt.obstacle && selected && <div className="adventure-hunt-action"><p><strong>{selected.name}</strong> · {selected.status === 'search' ? 'Search: Hunting 판정' : 'Chase: Hunting 대 Avoidance'}</p><div className="adventure-subsystem__grid"><Field label="Hunting d20"><input type="number" min="1" max="20" value={action.roll} onChange={event => setAction(previous => ({ ...previous, roll: event.target.value }))} /></Field>{selected.status === 'chase' && <><Field label="먹잇감 Avoidance · GM 필수"><input type="number" min="1" value={action.preyAvoidance || hunt.preyAvoidance || ''} onChange={event => setAction(previous => ({ ...previous, preyAvoidance: event.target.value }))} /></Field><Field label="Avoidance d20"><input type="number" min="1" max="20" value={action.preyRoll} onChange={event => setAction(previous => ({ ...previous, preyRoll: event.target.value }))} /></Field></>}</div><button type="button" className="secondary-command" disabled={action.roll === '' || (selected.status === 'chase' && (action.preyRoll === '' || Number(action.preyAvoidance || hunt.preyAvoidance) < 1)) || Boolean(hunt.segmentActions[selected.id])} onClick={() => { onAction({ hunterId: selected.id, roll: Number(action.roll), preyRoll: action.preyRoll === '' ? undefined : Number(action.preyRoll), preyAvoidance: Number(action.preyAvoidance || hunt.preyAvoidance) }); setAction({ roll: '', preyRoll: '', preyAvoidance: '' }); }}><Dices size={17} aria-hidden="true" />{selected.status === 'search' ? 'Search 판정' : 'Chase 대결'}</button></div>}

    {hunt.phase === 'segments' && hunt.obstacle && <div className="adventure-hunt-action"><p>Table 19-10 · Hunting Obstacles</p><div className="adventure-subsystem__grid"><Field label="2d6 결과"><input type="number" min="2" max="12" value={obstacle.roll} onChange={event => setObstacle(previous => ({ ...previous, roll: event.target.value }))} /></Field><label className="adventure-checkbox"><input type="checkbox" checked={obstacle.overcome} onChange={event => setObstacle(previous => ({ ...previous, overcome: event.target.checked }))} /><span>요구 판정 성공 · 추적 유지</span></label></div><button type="button" className="secondary-command" disabled={obstacle.roll === ''} onClick={() => onObstacle({ roll: Number(obstacle.roll), overcome: obstacle.overcome })}>장애물 결과 확정</button></div>}

    {hunt.phase === 'discovery' && !hunt.prey && <div className="adventure-hunt-action"><p>Table 19-11 · Prey</p><div className="adventure-subsystem__grid"><Field label="1d20"><input type="number" min="1" max="20" value={prey.roll} onChange={event => setPrey(previous => ({ ...previous, roll: event.target.value, rowIndex: '' }))} /></Field>{Number(prey.roll) === 20 && <Field label="Special 1d20"><input type="number" min="1" max="20" value={prey.specialRoll} onChange={event => setPrey(previous => ({ ...previous, specialRoll: event.target.value }))} /></Field>}</div>{preyMatches.length > 1 && <fieldset className="adventure-table-ambiguity"><legend>원문 roll 4 범위 중복 · GM 확정</legend>{preyMatches.map(({ item, index }) => <label key={index}><input type="radio" name="hunt-prey-row" checked={Number(prey.rowIndex) === index && prey.rowIndex !== ''} onChange={() => setPrey(previous => ({ ...previous, rowIndex: String(index) }))} /><span>{item.min}-{item.max} · {item.result}</span></label>)}</fieldset>}<button type="button" className="secondary-command" disabled={prey.roll === '' || (Number(prey.roll) === 20 && prey.specialRoll === '') || (preyMatches.length > 1 && prey.rowIndex === '')} onClick={() => onPrey({ roll: Number(prey.roll), rowIndex: prey.rowIndex === '' ? undefined : Number(prey.rowIndex), specialRoll: prey.specialRoll === '' ? undefined : Number(prey.specialRoll) })}>먹잇감 고정</button></div>}

    {hunt.phase === 'discovery' && hunt.prey && <div className="adventure-hunt-action"><p><strong>{hunt.prey.name}</strong> · Avoidance {hunt.prey.avoidance}</p>{hunt.fixedPrey && hunt.prey.name === 'White Deer' ? <div className="adventure-command-row"><button type="button" className="primary-command" onClick={() => onDiscovery({ choice: 'observe', note: '흰 사슴을 공격하지 않고 숨은 길을 발견함' })}>공격하지 않고 관찰</button><button type="button" className="secondary-command" onClick={() => onDiscovery({ choice: 'attack' })}>공격 시도</button></div> : <div className="adventure-command-row"><button type="button" className="secondary-command" onClick={() => onDiscovery({ choice: 'surprise' })}>기습 공격</button><button type="button" className="secondary-command" onClick={() => onDiscovery({ choice: 'wait' })}>지원 기다린 뒤 전투</button><button type="button" className="text-command" onClick={() => onDiscovery({ choice: 'release' })}>보내기</button></div>}</div>}

    {hunt.phase === 'surprise' && <div className="adventure-hunt-action"><p>Table 19-12 · Weapon versus Avoidance</p><div className="adventure-subsystem__grid"><Field label="무기 기술"><input type="number" min="0" value={surprise.weaponSkill} onChange={event => setSurprise(previous => ({ ...previous, weaponSkill: event.target.value }))} /></Field><Field label="무기 d20"><input type="number" min="1" max="20" value={surprise.roll} onChange={event => setSurprise(previous => ({ ...previous, roll: event.target.value }))} /></Field><Field label="Avoidance d20"><input type="number" min="1" max="20" value={surprise.preyRoll} onChange={event => setSurprise(previous => ({ ...previous, preyRoll: event.target.value }))} /></Field></div><button type="button" className="secondary-command" disabled={surprise.roll === '' || surprise.preyRoll === ''} onClick={() => onSurprise({ weaponSkill: Number(surprise.weaponSkill), roll: Number(surprise.roll), preyRoll: Number(surprise.preyRoll) })}>기습 결과 확정</button></div>}

    {hunt.phase === 'combat_ready' && <><p className="adventure-source-note">먹잇감의 Chapter 18 수치를 확인해 Chapter 7에 전달합니다. Hunt가 피해를 별도로 계산하지 않습니다.</p><CombatLaunch active={active} stage={stage} onLaunch={onCombat} hunt={hunt} /></>}
    {hunt.phase === 'expired' && <div className="adventure-resolved"><AlertTriangle size={17} aria-hidden="true" /><strong>사용 가능한 segment가 모두 끝났습니다.</strong></div>}
    {hunt.phase === 'complete' && <div className="adventure-resolved"><Check size={17} aria-hidden="true" /><strong>{hunt.outcome || 'Hunt 완료'}</strong></div>}
    {['complete', 'expired'].includes(hunt.phase) && <button type="button" className="primary-command" onClick={() => onComplete({ note: hunt.outcome || hunt.phase })}>모험 장면으로 결과 반환<ChevronRight size={17} aria-hidden="true" /></button>}
  </section>;
};

const CombatLaunch = ({ active, stage, onLaunch, hunt = null, preset = null }) => {
  const participantCount = Math.max(1, active.participants.length);
  const isBrigands = active.adventureId === 'jewel' && stage.id === 'brigands';
  const isEingar = active.adventureId === 'jewel' && stage.id === 'werewolf';
  const defaultCreatureIds = getChapter18AdventureDefaults(active.adventureId);
  const presetCreatureId = preset?.result === 'Melancholic or Mad Paladin' ? 'paladin' : null;
  const chapter18Required = Boolean(hunt?.prey?.creatureId || stage.dependency === 'chapter_18' || defaultCreatureIds.length || presetCreatureId || preset?.result === 'Wild Animal');
  const restrictedIds = hunt?.prey?.creatureId
    ? [hunt.prey.creatureId]
    : presetCreatureId
      ? [presetCreatureId]
      : defaultCreatureIds.length
        ? defaultCreatureIds
        : null;
  const registryOptions = listChapter18Creatures().filter(creature => (
    (!restrictedIds || restrictedIds.includes(creature.id))
    && (preset?.result !== 'Wild Animal' || ['animal', 'enchanted'].includes(creature.category))
  ));
  const initialCreatureId = hunt?.prey?.creatureId || presetCreatureId || defaultCreatureIds[0] || '';
  const [canonical, setCanonical] = useState({ creatureId: initialCreatureId, attackId: '', mountId: '', count: active.adventureId === 'greedy_abbot' ? 3 : 1, victors: participantCount, distance: 1, overrides: {} });
  const canonicalCreature = getChapter18Creature(canonical.creatureId);
  const parsedSkill = Number(String(preset?.skill || '').match(/\d+/)?.[0]);
  const parsedDamage = Number(String(preset?.damage || '').match(/\d+/)?.[0]);
  const [form, setForm] = useState({
    name: isBrigands ? 'Brigand' : isEingar ? 'Sir Eingar in wolf shape' : hunt?.prey?.name || preset?.result || 'Chapter 19 opponent', count: isBrigands ? participantCount * 3 : 1,
    archerCount: isBrigands ? participantCount : 0, skill: isBrigands ? 6 : isEingar ? 20 : parsedSkill || 12, rangedSkill: isBrigands ? 10 : 0,
    damageDice: isEingar ? 3 : parsedDamage || 4, armor: isBrigands ? 2 : isEingar ? 5 : Number(preset?.armor) || 6,
    weaponId: 'sword', missileWeaponId: 'bow', openingModifier: 0
  });
  const update = (key, value) => setForm(previous => ({ ...previous, [key]: value }));
  const selectCanonicalCreature = creatureId => setCanonical(previous => ({ ...previous, creatureId, attackId: '', mountId: '', overrides: {} }));
  const rangeFields = canonicalCreature ? ['siz', 'dex', 'str', 'con'].flatMap(key => {
    const value = canonicalCreature.stats?.[key];
    return value && typeof value === 'object' ? [{ key, label: key.toUpperCase(), ...value }] : [];
  }).concat(['hp', 'armor', 'damageDice'].flatMap(key => {
    const value = canonicalCreature[key];
    return value && typeof value === 'object' ? [{ key, label: key === 'hp' ? '생명력' : key === 'armor' ? '갑옷' : '피해 주사위', ...value }] : [];
  })) : [];
  const canonicalMounts = (canonicalCreature?.mounts || []).map(getChapter18Creature).filter(item => item?.category === 'mount');
  if (chapter18Required) return <section className="adventure-subsystem"><header><Swords size={19} aria-hidden="true" /><div><strong>Chapter 18 원문 상대</strong><p>선택한 statblock을 Chapter 7에 전달하고 특수 결과를 정산한 뒤 이 장면으로 돌아옵니다.</p></div></header><div className="adventure-subsystem__grid">
    <Field label="원문 대상"><select value={canonical.creatureId} onChange={event => selectCanonicalCreature(event.target.value)}><option value="">GM이 원문 대상 선택</option>{registryOptions.map(creature => <option key={creature.id} value={creature.id}>{creature.name} · p.{creature.sourcePage}</option>)}</select></Field>
    <Field label="원문 공격"><select value={canonical.attackId} onChange={event => setCanonical(previous => ({ ...previous, attackId: event.target.value }))} disabled={!canonicalCreature}><option value="">{canonicalCreature?.attacks?.length > 1 ? 'GM이 공격 선택' : canonicalCreature?.attacks?.[0]?.name || '원문 공격 없음'}</option>{(canonicalCreature?.attacks || []).map(attack => <option key={attack.id} value={attack.id}>{attack.name} {attack.skill}</option>)}</select></Field>
    <Field label="상대 수"><input type="number" min="1" max="3" value={canonical.count} onChange={event => setCanonical(previous => ({ ...previous, count: event.target.value }))} /></Field>
    <Field label="공적 분배 인원"><input type="number" min="1" value={canonical.victors} onChange={event => setCanonical(previous => ({ ...previous, victors: event.target.value }))} /></Field>
    <Field label="초기 거리 · 야드"><input type="number" min="0" value={canonical.distance} onChange={event => setCanonical(previous => ({ ...previous, distance: event.target.value }))} /></Field>
    {canonicalMounts.length > 0 && <Field label="탑승 탈것 · GM 선택"><select value={canonical.mountId} onChange={event => setCanonical(previous => ({ ...previous, mountId: event.target.value }))}><option value="">보병</option>{canonicalMounts.map(item => <option key={item.id} value={item.id}>{item.name} · p.{item.sourcePage}</option>)}</select></Field>}
    {rangeFields.map(field => <Field key={field.key} label={`${field.label} · GM ${field.min}-${field.max}`}><input type="number" min={field.min} max={field.max} value={canonical.overrides[field.key] ?? field.min} onChange={event => setCanonical(previous => ({ ...previous, overrides: { ...previous.overrides, [field.key]: event.target.value } }))} /></Field>)}
  </div><button type="button" className="primary-command" disabled={!canonicalCreature || (canonicalCreature.attacks.length > 1 && !canonical.attackId)} onClick={() => onLaunch({
    chapter18Id: canonical.creatureId, attackId: canonical.attackId || canonicalCreature?.attacks?.[0]?.id,
    count: Number(canonical.count), victors: Number(canonical.victors), distance: Number(canonical.distance), mountId: canonical.mountId || undefined,
    overrides: Object.fromEntries(Object.entries(canonical.overrides).map(([key, value]) => [key, Number(value)]))
  })}><Swords size={17} aria-hidden="true" />Chapter 7에서 계속</button></section>;
  const opponents = Array.from({ length: Math.max(1, Number(form.count)) }, (_, index) => ({
    id: `adventure_enemy_${index + 1}`, name: `${form.name} ${index + 1}`, skill: Number(form.skill), rangedSkill: Number(form.rangedSkill),
    damageDice: Number(form.damageDice), armor: Number(form.armor), shield: 0,
    dex: isBrigands ? 9 : isEingar ? 22 : 10, str: isBrigands ? 11 : isEingar ? 18 : 12,
    siz: isBrigands ? 11 : isEingar ? 10 : 12, con: isBrigands ? 7 : isEingar ? 14 : 12,
    weaponId: form.weaponId, missileWeaponId: index < Number(form.archerCount) ? form.missileWeaponId : 'bow',
    ammo: { arrows: index < Number(form.archerCount) ? 12 : 0 }, distance: index < Number(form.archerCount) ? 20 : 1
  }));
  return <section className="adventure-subsystem"><header><Swords size={19} aria-hidden="true" /><div><strong>Chapter 7 개인전투</strong><p>적 수치는 Chapter 18 원문 또는 GM 확인값만 입력합니다.</p></div></header><div className="adventure-subsystem__grid">
    <Field label="상대 이름"><input value={form.name} onChange={event => update('name', event.target.value)} /></Field><Field label="상대 수"><input type="number" min="1" max="30" value={form.count} onChange={event => update('count', event.target.value)} /></Field>
    <Field label="궁수 수"><input type="number" min="0" max={form.count} value={form.archerCount} onChange={event => update('archerCount', event.target.value)} /></Field><Field label="전투 기술"><input type="number" value={form.skill} onChange={event => update('skill', event.target.value)} /></Field>
    <Field label="피해 d6"><input type="number" min="1" value={form.damageDice} onChange={event => update('damageDice', event.target.value)} /></Field><Field label="갑옷"><input type="number" min="0" value={form.armor} onChange={event => update('armor', event.target.value)} /></Field>
    <Field label="개시 수정"><input type="number" value={form.openingModifier} onChange={event => update('openingModifier', event.target.value)} /></Field>
  </div><button type="button" className="primary-command" onClick={() => onLaunch({ opponents, openingModifier: Number(form.openingModifier), openingModifierSource: `Chapter 19 p.${stage.sourcePage}`, gmStatsConfirmed: true })}><Swords size={17} aria-hidden="true" />Chapter 7에서 계속</button></section>;
};

const BattleLaunch = ({ stage, character, onLaunch }) => {
  const [form, setForm] = useState({ duration: 5, playerArmySize: 600, enemyArmySize: 600, playerArmyBattle: 15, enemyArmyBattle: 15, scale: 'small' });
  const update = (key, value) => setForm(previous => ({ ...previous, [key]: value }));
  const battleType = stage.battleType || 'mass_battle';
  return <section className="adventure-subsystem"><header><Shield size={19} aria-hidden="true" /><div><strong>Chapter 8 {battleType === 'siege' ? '공성' : '대전투'}</strong><p>원문이 정하지 않은 병력과 지휘 수치는 GM이 확정합니다.</p></div></header><div className="adventure-subsystem__grid">
    <Field label="라운드"><input type="number" min="0" max="12" value={form.duration} onChange={event => update('duration', event.target.value)} /></Field><Field label="아군 병력"><input type="number" min="1" value={form.playerArmySize} onChange={event => update('playerArmySize', event.target.value)} /></Field>
    <Field label="적군 병력"><input type="number" min="1" value={form.enemyArmySize} onChange={event => update('enemyArmySize', event.target.value)} /></Field><Field label="아군 Battle"><input type="number" value={form.playerArmyBattle} onChange={event => update('playerArmyBattle', event.target.value)} /></Field>
    <Field label="적군 Battle"><input type="number" value={form.enemyArmyBattle} onChange={event => update('enemyArmyBattle', event.target.value)} /></Field>
  </div><button type="button" className="primary-command" onClick={() => onLaunch({
    battleType,
    setup: battleType === 'siege'
      ? { name: stage.title, fortress: 'Aumont’s Tower', mode: 'simple', playerSide: 'defender', dv: '10', attacker: { name: 'Sir Balan', siege: 26, troops: Number(form.enemyArmySize) }, defender: { name: 'Franks in Aumont’s Tower', siege: character.skills?.siege || 10, troops: Number(form.playerArmySize) } }
      : { ...form, name: stage.title, playerSideName: 'Franks', enemySideName: 'Saracens', battalionBattle: character.skills?.battle || 10, playerRole: 'unit', mounted: true, hasLance: true, armor: 10, shield: 6 }
  })}><Shield size={17} aria-hidden="true" />Chapter 8에서 계속</button></section>;
};

export default function AdventureJournal({ character, setCharacter, onNavigate }) {
  const active = character.campaign?.adventures?.active;
  const history = character.campaign?.adventures?.history || [];
  const definition = active ? getAdventureDefinition(active.adventureId) : null;
  const stage = active ? getCurrentAdventureStage(active) : null;
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [decision, setDecision] = useState({ value: '', note: '' });
  const [test, setTest] = useState({ key: '', roll: '', modifier: 0 });
  const [defer, setDefer] = useState({ requirement: '', gmNote: '' });
  const stageNote = useMemo(() => definition && stage ? STAGE_NOTES[definition.id]?.[stage.id] || defaultStageNote(definition, stage) : '', [definition, stage]);
  const run = action => { try { setError(''); setNotice(''); action(); } catch (caught) { setError(caught.message || 'Chapter 19 절차를 완료하지 못했습니다.'); } };
  const update = (resolver, message) => run(() => {
    setCharacter(resolver(character).character);
    setDecision({ value: '', note: '' });
    setTest({ key: '', roll: '', modifier: 0 });
    setDefer({ requirement: '', gmNote: '' });
    if (message) setNotice(message);
  });
  const start = (adventureId, names) => update(previous => startAdventure(previous, {
    adventureId,
    participants: names.trim() ? [
      { id: previous.campaign?.lifecycle?.activeCharacterId || 'active_character', characterId: previous.campaign?.lifecycle?.activeCharacterId, name: previous.personal?.name || '이름 없는 기사' },
      ...names.split(',').map((name, index) => ({ id: `guest_${index + 1}`, name: name.trim(), role: 'player_knight' })).filter(item => item.name)
    ] : undefined
  }), '모험을 시작하고 첫 장면을 연대기에 기록했습니다.');
  const resolveDecision = kind => update(previous => recordAdventureDecision(previous, { kind, value: decision.value || 'confirmed', note: decision.note }), '판단을 현재 장면에 저장했습니다.');
  const next = (options = {}) => update(previous => completeAdventureStage(previous, { confirmed: true, note: decision.note, ...options }), '다음 원문 단계로 이동했습니다.');
  const completeNoteStage = kind => update(previous => {
    const recorded = recordAdventureDecision(previous, { kind, value: decision.value || 'confirmed', note: decision.note });
    return completeAdventureStage(recorded.character, { confirmed: true });
  }, '장면 기록을 보존하고 다음 단계로 이동했습니다.');
  const launchCombat = input => run(() => { setCharacter(beginAdventureCombat(character, input).character); onNavigate('combat'); });
  const launchBattle = input => run(() => { setCharacter(beginAdventureBattle(character, input).character); onNavigate('battle'); });
  const launchPersonalityMagic = () => run(() => { setCharacter(beginAdventurePersonalityMagic(character).character); onNavigate('oracles'); });
  const pending = active?.pendingSubsystem || null;
  const hunt = pending?.type === 'hunt' ? pending : null;
  const chase = pending?.type === 'chase' ? pending : null;

  if (!active) return <article className="folio-page adventure-ledger view-animate">
    <FolioHeading eyebrow="Liber Adventurarum · Chapter Nineteen" title="모험 기록부" year={character.personal?.campaignYear || 767}>원문의 장면 순서와 선택을 보존하면서 전투, 대전투, 경제, 명예 장부로 왕복합니다.</FolioHeading>
    <AdventureCatalog onStart={start} />
    <SectionHeader index="II" title="완료된 모험" meta="Historia Adventurarum" />
    {history.length ? <div className="adventure-history">{[...history].reverse().map(item => <article key={item.id}><span>{item.campaignYear}</span><div><strong>{item.title}</strong><p>{item.status} · 참가자 {item.participants.map(participant => participant.name).join(', ')}</p></div><StatusSeal tone={item.status === 'complete' ? 'active' : 'neutral'}>{item.status}</StatusSeal></article>)}</div> : <p className="adventure-empty">아직 완료된 Chapter 19 모험이 없습니다.</p>}
    {error && <div className="adventure-message adventure-message--error" role="alert"><AlertTriangle size={17} aria-hidden="true" />{error}</div>}
  </article>;

  const decisionRecorded = active.decisions.some(item => item.stageId === stage.id);
  const resolvedTestKeys = active.results
    .filter(item => item.type === 'test' && item.stageId === stage.id)
    .map(item => item.testKey);
  const availableTestKeys = stage.kind === 'test' && (stage.testMode === 'all' || stage.repeat?.unique)
    ? stage.tests.filter(key => !resolvedTestKeys.includes(key))
    : stage.tests || [];
  const procedureSubsystemBridge = stage.kind === 'procedure'
    && (definition.integrations.includes('combat') || definition.integrations.includes('battle'));
  const consequenceBridge = ['procedure', 'aftermath'].includes(stage.kind)
    && ['economy', 'glory', 'standing'].some(key => definition.integrations.includes(key));
  const repeatStatus = getAdventureRepeatStatus(active);
  const procedureProgress = active.procedureProgress?.[stage.id] || null;
  const tableSubsystemRequirement = active.pendingTable?.resolved
    ? getAdventureTableSubsystemRequirement(active.pendingTable.resolved.tableId, active.pendingTable.resolved.result)
    : null;
  const tableSubsystemReturned = tableSubsystemRequirement
    ? active.results.some(item => item.type === `${tableSubsystemRequirement}_return` && item.tableResultId === active.pendingTable.resolved.id)
    : true;
  return <article className="folio-page adventure-ledger view-animate">
    <FolioHeading eyebrow={`Liber Adventurarum · ${definition.sourcePage}`} title={definition.title} year={active.campaignYear}>{active.participants.map(item => item.name).join(' · ')}</FolioHeading>
    <section className="adventure-status"><div><span>현재 장면</span><strong>{stage.title}</strong></div><div><span>진행</span><strong>{active.stageIndex + 1} / {definition.stages.length}</strong></div><div><span>상태</span><StatusSeal tone={active.status === 'deferred' ? 'warning' : 'active'}>{active.status}</StatusSeal></div><div><span>출처</span><strong>p.{stage.sourcePage}</strong></div></section>
    <div className="adventure-runtime">
      <StageRail definition={definition} active={active} />
      <div className="adventure-scene">
        <header><div><span className="serial-label">{KIND_LABELS[stage.kind]} · p.{stage.sourcePage}</span><h2 lang="en">{stage.title}</h2></div><BookOpenCheck size={24} aria-hidden="true" /></header>
        <p className="adventure-source-note">{stageNote}</p>
        {repeatStatus && <div className="adventure-repeat-status"><RotateCcw size={17} aria-hidden="true" /><div><strong>{repeatStatus.label}</strong><span>{repeatStatus.target ? `${repeatStatus.completed} / ${repeatStatus.target}` : `${repeatStatus.completed}회 완료`}</span>{repeatStatus.sourceAmbiguity && <small>Source ambiguity · {repeatStatus.sourceAmbiguity}</small>}</div></div>}

        {active.status === 'deferred' ? <section className="adventure-deferred"><CirclePause size={24} aria-hidden="true" /><div><strong>{active.deferred?.requirement}</strong><p>{active.deferred?.gmNote || 'GM 판단 또는 외부 의존성을 기다립니다.'}</p><small>p.{active.deferred?.sourcePage}</small></div><button type="button" className="primary-command" onClick={() => update(previous => resumeAdventure(previous), '같은 장면에서 모험을 재개했습니다.')}><RotateCcw size={17} aria-hidden="true" />재개</button></section> : <>
          {stage.kind === 'player_choice' && <section className="adventure-decision"><fieldset><legend>플레이어 선택</legend>{stage.options?.length ? stage.options.map(option => <label key={option}><input type="radio" name="adventure-choice" checked={decision.value === option} onChange={() => setDecision(previous => ({ ...previous, value: option }))} /><span>{option.replaceAll('_', ' ')}</span></label>) : <Field label="선택"><input value={decision.value} onChange={event => setDecision(previous => ({ ...previous, value: event.target.value }))} /></Field>}</fieldset><Field label="선택 이유·장면 기록"><textarea value={decision.note} onChange={event => setDecision(previous => ({ ...previous, note: event.target.value }))} /></Field>{!active.pendingChoice?.resolved ? <button type="button" className="secondary-command" onClick={() => resolveDecision('player')}>선택 확정</button> : <button type="button" className="primary-command" onClick={() => next()}>다음 장면<ChevronRight size={17} aria-hidden="true" /></button>}</section>}

          {stage.kind === 'test' && <section className="adventure-test"><div><Field label="판정"><select value={test.key || availableTestKeys[0] || stage.tests?.[0]} onChange={event => setTest(previous => ({ ...previous, key: event.target.value }))}>{availableTestKeys.map(key => <option key={key} value={key}>{TEST_LABELS[key] || key}</option>)}</select></Field><Field label="d20 · 비우면 앱 굴림"><input type="number" min="1" max="20" value={test.roll} onChange={event => setTest(previous => ({ ...previous, roll: event.target.value }))} /></Field><Field label="원문 수정"><input type="number" value={test.modifier} onChange={event => setTest(previous => ({ ...previous, modifier: event.target.value }))} /></Field></div>{(stage.testMode === 'all' || stage.repeat) && <p className="adventure-test__progress">판정 완료 {resolvedTestKeys.length}{repeatStatus?.target ? ` / ${repeatStatus.target}` : ''}</p>}{!active.pendingTest?.resolved ? <button type="button" className="secondary-command" disabled={!availableTestKeys.length} onClick={() => update(previous => resolveAdventureTest(previous, { testKey: test.key || availableTestKeys[0] || stage.tests[0], roll: test.roll === '' ? undefined : Number(test.roll), modifier: Number(test.modifier) }), '판정 결과를 저장했습니다.')}><Dices size={17} aria-hidden="true" />판정</button> : <><div className="adventure-resolved"><Check size={17} aria-hidden="true" /><strong>{active.pendingTest.resolved.testKey} · {active.pendingTest.resolved.outcome}</strong><span>d20 {active.pendingTest.resolved.roll} / {active.pendingTest.resolved.target}</span></div><button type="button" className="primary-command" onClick={() => next()}>다음 {stage.repeat && repeatStatus?.completed < repeatStatus?.target ? '판정' : '장면'}<ChevronRight size={17} aria-hidden="true" /></button></>}</section>}

          {stage.kind === 'table' && <><TableWorkspace key={`${stage.id}:${active.pendingTable?.iteration}:${active.pendingTable?.tableId}:${active.pendingTable?.resolved?.id || 'open'}`} tableId={active.pendingTable?.tableId || stage.tableId} resolved={active.pendingTable?.resolved} onResolve={tableInput => update(previous => resolveAdventureTable(previous, tableInput), '표 결과를 이 모험에 고정했습니다.')} />{active.pendingConsequence?.status === 'pending' && <ConsequenceWorkspace pending={active.pendingConsequence} onApply={form => update(previous => applyAdventureConsequence(previous, { ...form, amount: Number(form.amount), amountDeniers: Number(form.amountDeniers), damage: Number(form.damage), reason: form.reason || active.pendingConsequence.description }), '기존 canonical 장부에 결과를 반영했습니다.')} onAcknowledge={() => update(previous => acknowledgeAdventureConsequence(previous), '별도 수치 변화가 없는 결과로 확인했습니다.')} />}{active.pendingTable?.resolved && active.pendingConsequence?.status !== 'pending' && !pending && <>{tableSubsystemRequirement === 'combat' && !tableSubsystemReturned && <CombatLaunch active={active} stage={stage} preset={active.pendingTable.resolved} onLaunch={launchCombat} />}{tableSubsystemRequirement === 'battle' && !tableSubsystemReturned && <BattleLaunch stage={stage} character={character} onLaunch={launchBattle} />}{tableSubsystemReturned && <div className="adventure-command-row"><button type="button" className="primary-command" onClick={() => next()}>{stage.repeat && !(repeatStatus?.target && repeatStatus.completed >= repeatStatus.target) ? '다음 반복' : '표 결과 소비 완료'}<ChevronRight size={17} aria-hidden="true" /></button>{repeatStatus?.allowStop && repeatStatus.completed >= repeatStatus.minimum && <button type="button" className="secondary-command" onClick={() => next({ stopRepeat: true })}>반복 종료</button>}</div>}</>}</>}

          {stage.kind === 'subsystem' && !pending && stage.subsystem === 'combat' && <CombatLaunch active={active} stage={stage} onLaunch={launchCombat} />}
          {stage.kind === 'subsystem' && !pending && stage.subsystem === 'battle' && <BattleLaunch stage={stage} character={character} onLaunch={launchBattle} />}
          {stage.kind === 'subsystem' && !pending && stage.subsystem === 'knighthood' && <KnighthoodWorkspace onResolve={input => update(previous => resolveAdventureKnighthood(previous, input), '기사 서임, Frankish Birth Gift, 1,300 Glory를 canonical 장부에 반영했습니다.')} />}
          {stage.kind === 'subsystem' && !pending && stage.subsystem === 'personality_magic' && <section className="adventure-subsystem"><header><HeartHandshake size={19} aria-hidden="true" /><div><strong>Chapter 3·9 canonical 절차</strong><p>현재 장면의 Amor, Passion, 후유증 또는 기도 결과를 공용 엔진에서 처리합니다.</p></div></header><button type="button" className="primary-command" onClick={launchPersonalityMagic}>기존 엔진 시작<ChevronRight size={17} aria-hidden="true" /></button></section>}
          {stage.kind === 'subsystem' && stage.subsystem === 'hunt' && <HuntWorkspace active={active} stage={stage} character={character} hunt={hunt} onStart={input => update(previous => beginAdventureHunt(previous, input), 'Hunt segment를 시작했습니다.')} onAction={input => update(previous => resolveAdventureHuntAction(previous, input), 'Search/Chase 결과를 저장했습니다.')} onObstacle={input => update(previous => resolveAdventureHuntObstacle(previous, input), '장애물 결과를 저장했습니다.')} onPrey={input => update(previous => resolveAdventureHuntPrey(previous, input), '먹잇감을 원문 표 결과로 고정했습니다.')} onDiscovery={input => update(previous => resolveAdventureHuntDiscovery(previous, input), '발견 후 행동을 저장했습니다.')} onSurprise={input => update(previous => resolveAdventureHuntSurprise(previous, input), '기습 결과를 저장했습니다.')} onCombat={launchCombat} onComplete={input => update(previous => completeAdventureHunt(previous, input), 'Hunt 결과를 모험으로 반환했습니다.')} />}
          {stage.kind === 'subsystem' && stage.subsystem === 'hunt' && active.pendingConsequence?.status === 'pending' && <ConsequenceWorkspace pending={active.pendingConsequence} onApply={form => update(previous => applyAdventureConsequence(previous, { ...form, amount: Number(form.amount), amountDeniers: Number(form.amountDeniers), damage: Number(form.damage), reason: form.reason || active.pendingConsequence.description }), 'Hunt 결과를 canonical 상태에 반영했습니다.')} onAcknowledge={() => update(previous => acknowledgeAdventureConsequence(previous), 'Hunt 후속 결과를 확인했습니다.')} />}
          {stage.kind === 'subsystem' && stage.subsystem === 'chase' && <ChaseWorkspace chase={chase} onStart={input => update(previous => beginAdventureChase(previous, input), 'Chase를 시작했습니다.')} onResolve={input => update(previous => resolveAdventureChaseStage(previous, input), 'Chase stage 결과를 저장했습니다.')} onEnding={input => update(previous => recordAdventureChaseEnding(previous, input), 'GM Chase 종료를 저장했습니다.')} onComplete={input => update(previous => completeAdventureChase(previous, input), 'Chase 결과를 모험으로 반환했습니다.')} />}
          {pending && !['hunt', 'chase'].includes(pending.type) && <section className="adventure-pending-subsystem"><Flag size={22} aria-hidden="true" /><div><strong>{pending.type} 진행 중</strong><p>{pending.subsystemId}</p><small>장면 p.{pending.sourcePage} · transaction {pending.transactionId}</small></div>{pending.type === 'combat' ? <button type="button" className="secondary-command" onClick={() => onNavigate('combat')}>전투로 돌아가기</button> : pending.type === 'personality_magic' ? <button type="button" className="secondary-command" onClick={() => onNavigate('oracles')}>Personality/Magic으로 돌아가기</button> : <button type="button" className="secondary-command" onClick={() => update(previous => completeAdventureBattleReturn(previous), 'Chapter 8 결과를 한 번만 모험으로 돌려보냈습니다.')}>완료 결과 가져오기</button>}</section>}

          {(procedureSubsystemBridge || consequenceBridge) && !pending && <section className="adventure-engine-bridges" aria-label="기존 규칙 엔진 연결">{stage.kind === 'procedure' && definition.integrations.includes('combat') && <CombatLaunch active={active} stage={stage} onLaunch={launchCombat} />}{stage.kind === 'procedure' && definition.integrations.includes('battle') && <BattleLaunch stage={stage} character={character} onLaunch={launchBattle} />}{consequenceBridge && <ConsequenceWorkspace pending={{ description: '이 시나리오 원문이 명시한 결과만 선택하여 기존 장부에 반영합니다.', appliedActions: [] }} onApply={form => update(previous => applyAdventureConsequence(previous, { ...form, amount: Number(form.amount), amountDeniers: Number(form.amountDeniers), damage: Number(form.damage), reason: form.reason || stage.title }), '시나리오 결과를 canonical 장부에 반영했습니다.')} onAcknowledge={() => setNotice('수치 변화가 없는 원문 결과로 확인했습니다.')} />}</section>}

          {stage.kind === 'procedure' && stage.procedure && <ProcedureWorkspace stage={stage} progress={procedureProgress} onRecord={input => update(previous => recordAdventureProcedureItem(previous, input), '원문 절차 항목을 저장했습니다.')} onComplete={() => completeNoteStage('gm')} />}
          {['setup', 'reference', 'gm_decision', 'narrative', 'consequence', 'aftermath'].includes(stage.kind) || (stage.kind === 'procedure' && !stage.procedure) ? <section className="adventure-decision"><Field label={stage.kind === 'narrative' ? '서술 기록' : 'GM·절차 기록'}><textarea value={decision.note} onChange={event => setDecision(previous => ({ ...previous, note: event.target.value }))} placeholder="원문이 정하지 않은 내용은 결정하거나 서술한 주체와 함께 기록" /></Field><button type="button" className="primary-command" onClick={() => completeNoteStage(stage.kind === 'narrative' ? 'narrative' : 'gm')}><ScrollText size={17} aria-hidden="true" />기록하고 계속</button></section> : null}

          {stage.kind === 'dependency' && <section className="adventure-dependency-work"><AlertTriangle size={20} aria-hidden="true" /><p>{stage.dependency}의 canonical 절차가 필요합니다. 처리 결과 또는 보류 사유를 구조적으로 남깁니다.</p><Field label="처리 기록"><textarea value={decision.note} onChange={event => setDecision(previous => ({ ...previous, note: event.target.value }))} /></Field>{!decisionRecorded ? <button type="button" className="secondary-command" onClick={() => resolveDecision('dependency')}>의존성 처리 기록</button> : <button type="button" className="primary-command" onClick={() => next()}>다음 장면</button>}</section>}
        </>}

        {notice && <div className="adventure-message" role="status"><Check size={17} aria-hidden="true" />{notice}</div>}
        {error && <div className="adventure-message adventure-message--error" role="alert"><AlertTriangle size={17} aria-hidden="true" />{error}</div>}
        {stage.optional && !pending && <button type="button" className="text-command adventure-skip" onClick={() => update(previous => skipOptionalAdventureStage(previous), '선택하지 않은 원문 분기를 건너뛰었습니다.')}>이 선택 장면 건너뛰기</button>}
      </div>
    </div>
    <section className="adventure-controls"><div><UsersRound size={17} aria-hidden="true" /><span>{active.participants.length}명 참가</span><Coins size={17} aria-hidden="true" /><span>보상 {active.rewards.length}</span><ScrollText size={17} aria-hidden="true" /><span>결과 {active.results.length}</span></div><details><summary>보류 또는 중단</summary><div><Field label="미결 요구사항"><input value={defer.requirement} onChange={event => setDefer(previous => ({ ...previous, requirement: event.target.value }))} /></Field><Field label="GM 메모"><input value={defer.gmNote} onChange={event => setDefer(previous => ({ ...previous, gmNote: event.target.value }))} /></Field><button type="button" className="secondary-command" onClick={() => update(previous => deferAdventure(previous, defer), '현재 장면과 미결 요구사항을 보존했습니다.')}><CirclePause size={17} aria-hidden="true" />보류</button><button type="button" className="text-command" onClick={() => { if (window.confirm('현재 모험을 중단하고 기록 보관함으로 옮깁니까?')) update(previous => abortAdventure(previous, { note: defer.gmNote }), '모험을 중단 기록으로 보관했습니다.'); }}>모험 중단</button></div></details></section>
  </article>;
}

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Circle,
  Dices,
  FileCheck2,
  Landmark,
  ScrollText,
  Snowflake
} from 'lucide-react';
import {
  closeWinterYear,
  ensureWinterState,
  FAMILY_EVENT_TABLE,
  getTrainingSkillGroups,
  MAINTENANCE_GRADES,
  PERSONAL_EVENT_TABLE,
  recordManualWinterResolution,
  resolveWinterFamilyTarget,
  resolveWinterStep,
  WINTER_STEPS
} from '../../rules';
import { CompleteMark, FolioHeading, LedgerRow, StatusSeal } from '../../components/ui/LedgerUI';
import RulebookButton from '../rulebook/RulebookButton';

const GROUP_LABELS = {
  attributes: '능력치',
  traits: '성향',
  passions: '열정',
  standings: '지위',
  skills: '기술'
};

const SCORE_LABELS = {
  siz: 'SIZ', dex: 'DEX', str: 'STR', con: 'CON', app: 'APP',
  honor: 'Honor', loveFamily: 'Love [family]', loveGod: 'Love [God]', loveCharlemagne: 'Love [Charlemagne]',
  charlemagne: 'Standing [Charlemagne]', liegeLord: 'Standing [lord]', family: 'Standing [family]', retinue: 'Standing [retinue]', church: 'Standing [Church]', commoners: 'Standing [commoners]'
};

const stateTone = status => status === 'resolved' ? 'active' : status === 'awaiting_choice' ? 'warning' : 'neutral';

function SourceReference({ step }) {
  return (
    <details className="rule-reference">
      <summary><BookOpen size={15} aria-hidden="true" /> 규칙 근거 <code>{step.ruleId}</code></summary>
      <div>
        <span>{step.sourcePage}</span>
        <p>{step.summary}</p>
        <RulebookButton sourcePage={step.sourcePage} reason={`${step.label} · ${step.ruleId}`} label="이 단계 원문" />
      </div>
    </details>
  );
}

function ResultPanel({ record }) {
  if (!record) return null;
  const result = record.result || {};
  const rollSummary = record.roll ? JSON.stringify(record.roll) : '';
  return (
    <section className="winter-result" aria-label="적용 결과">
      <header><FileCheck2 size={17} aria-hidden="true" /><strong>적용 결과</strong><StatusSeal tone={record.status?.includes('manual') ? 'warning' : 'active'}>{record.status || 'resolved'}</StatusSeal></header>
      <p>{record.journalEntry}</p>
      <dl className="winter-result__outcome">
        {record.roll && <div><dt>판정</dt><dd>{rollSummary}</dd></div>}
        <div><dt>반영된 변화</dt><dd>{record.stateChanges?.length || 0}건</dd></div>
        {result.total !== undefined && <div><dt>합계</dt><dd>{result.total}</dd></div>}
        {result.deaths !== undefined && <div><dt>생존 결과</dt><dd>사망 {result.deaths} · 질병 {result.illness} · 건강 {result.healthy}</dd></div>}
      </dl>
      {record.manualResolution && <aside><AlertTriangle size={15} aria-hidden="true" /><span>GM 수동 판정: {record.manualResolution.note}</span></aside>}
      <details className="winter-result__technical"><summary>거래 상세</summary><dl><div><dt>완료 ID</dt><dd><code>{record.completionId}</code></dd></div><div><dt>Rollback</dt><dd><code>{record.rollbackBoundary}</code></dd></div>{record.stateChanges?.length > 0 && <div><dt>변경 기록</dt><dd><code>{JSON.stringify(record.stateChanges)}</code></dd></div>}</dl></details>
    </section>
  );
}

function SelectField({ label, value, onChange, options, placeholder = '선택' }) {
  return (
    <label className="winter-field">
      <span>{label}</span>
      <select value={value} onChange={event => onChange(event.target.value)}>
        <option value="">{placeholder}</option>
        {options.map(option => {
          const item = typeof option === 'string' ? { value: option, label: SCORE_LABELS[option] || option } : option;
          return <option key={item.value} value={item.value}>{item.label}</option>;
        })}
      </select>
    </label>
  );
}

export default function WinterPhase({ character, setCharacter }) {
  const winter = ensureWinterState(character);
  const initialIndex = Math.max(0, WINTER_STEPS.findIndex(step => step.id === winter.currentStep));
  const [viewIndex, setViewIndex] = useState(initialIndex < 0 ? 9 : initialIndex);
  const [error, setError] = useState('');
  const [manualNote, setManualNote] = useState('');
  const [manualTransactionIds, setManualTransactionIds] = useState('');
  const [familyRelationRoll, setFamilyRelationRoll] = useState('');
  const [familySexRoll, setFamilySexRoll] = useState('');
  const [familyTargetId, setFamilyTargetId] = useState('');
  const [soloChoice, setSoloChoice] = useState('not_applicable');
  const [maintenanceGrade, setMaintenanceGrade] = useState(character.personal?.maintenance || 'ordinary');
  const [situationalModifier, setSituationalModifier] = useState(0);
  const [personalEventChoice, setPersonalEventChoice] = useState('');
  const [familyEventChoice, setFamilyEventChoice] = useState('');
  const livingSpouse = useMemo(() => (character.family?.members || []).find(member => ['부인', '남편', '배우자', 'wife', 'husband', 'spouse'].some(label => String(member.relation).toLowerCase().includes(label)) && member.status !== '사망'), [character.family?.members]);
  const [marriageAction, setMarriageAction] = useState(livingSpouse ? 'already_married' : 'skip');
  const [spouseName, setSpouseName] = useState('');
  const [spouseAge, setSpouseAge] = useState(character.personal?.age || 18);
  const [childbirthAction, setChildbirthAction] = useState(livingSpouse ? 'roll' : 'skip');
  const [motherName, setMotherName] = useState('');
  const [childNames, setChildNames] = useState('');
  const [trainingOption, setTrainingOption] = useState('score');
  const [trainingGroup, setTrainingGroup] = useState('traits');
  const [trainingKey, setTrainingKey] = useState('');
  const [trainingAmount, setTrainingAmount] = useState(1);
  const [skillSelections, setSkillSelections] = useState({ ordinary: '', courtly: '', combat: '', free: '' });
  const [highSkill, setHighSkill] = useState('');
  const [bonusGroup, setBonusGroup] = useState('skills');
  const [bonusKey, setBonusKey] = useState('');
  const [allocations, setAllocations] = useState([]);
  const step = WINTER_STEPS[viewIndex];
  const record = winter.records?.[step.id];
  const status = winter.steps?.[step.id] || 'pending';
  const pendingChoices = Array.isArray(record?.unresolvedChoice) ? record.unresolvedChoice : record?.unresolvedChoice ? [record.unresolvedChoice] : [];
  const hasFamilyTargetChoice = step.id === 'family' && pendingChoices.some(item => ['family_target_choice', 'family_target_creation_or_reroll', 'family_target_required'].includes(item.type));
  const familyTargetCandidates = record?.result?.relation?.candidates || [];
  const resolvedCount = WINTER_STEPS.filter(item => winter.steps?.[item.id] === 'resolved').length;
  const activeIndex = WINTER_STEPS.findIndex(item => item.id === winter.currentStep);
  const trainingGroups = useMemo(() => getTrainingSkillGroups(), []);
  const allSkills = Object.keys(character.skills || {});
  const highSkills = allSkills.filter(key => Number(character.skills[key]) > 15 && Number(character.skills[key]) < 20);
  const availableBonus = Math.max(0, Number(winter.gloryBonusPoints || 0) - Number(winter.bonusSpent || 0));

  const moveToCurrent = nextCharacter => {
    const nextWinter = ensureWinterState(nextCharacter);
    const index = WINTER_STEPS.findIndex(item => item.id === nextWinter.currentStep);
    if (index >= 0) setViewIndex(index);
  };

  const execute = input => {
    setError('');
    try {
      const result = resolveWinterStep(character, { stepId: step.id, input });
      setCharacter(result.character);
      if (!result.awaitingChoice) moveToCurrent(result.character);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '단계를 적용하지 못했습니다.');
    }
  };

  const resolveManual = () => {
    setError('');
    try {
      const result = recordManualWinterResolution(character, {
        stepId: step.id,
        note: manualNote,
        canonicalTransactionIds: manualTransactionIds.split(',').map(value => value.trim()).filter(Boolean)
      });
      setCharacter(result.character);
      setManualNote('');
      setManualTransactionIds('');
      moveToCurrent(result.character);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '수동 판정 기록을 저장하지 못했습니다.');
    }
  };

  const resolveFamilyTarget = () => {
    setError('');
    try {
      const relationRoll = Number(familyRelationRoll || record?.roll?.relation);
      const sexRoll = Number(familySexRoll || record?.roll?.sex);
      const result = resolveWinterFamilyTarget(character, familyTargetCandidates.length > 1
        ? { targetId: familyTargetId }
        : { relationRoll, sexRoll });
      setCharacter(result.character);
      setFamilyTargetId('');
      setFamilyRelationRoll('');
      setFamilySexRoll('');
      if (!result.awaitingChoice) moveToCurrent(result.character);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '가족 사건 대상을 확정하지 못했습니다.');
    }
  };

  const sealWinter = () => {
    setError('');
    try {
      const result = closeWinterYear(character);
      setCharacter(result.character);
      setViewIndex(0);
      setAllocations([]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '겨울 장부를 마감하지 못했습니다.');
    }
  };

  const addAllocation = () => {
    if (!bonusKey || allocations.length >= availableBonus) return;
    setAllocations(current => [...current, { group: bonusGroup, key: bonusKey }]);
    setBonusKey('');
  };

  const renderControls = () => {
    if (status === 'resolved') return <ResultPanel record={record} />;
    if (status === 'awaiting_choice' && record?.status !== 'awaiting_event_choice') return null;
    if (step.id === 'soloScenario') return (
      <div className="choice-panel">
        <div className="segmented-control" role="group" aria-label="개인 모험 여부">
          <button type="button" className={soloChoice === 'not_applicable' ? 'active' : ''} onClick={() => setSoloChoice('not_applicable')} aria-pressed={soloChoice === 'not_applicable'}>해당 없음</button>
          <button type="button" className={soloChoice === 'completed' ? 'active' : ''} onClick={() => setSoloChoice('completed')} aria-pressed={soloChoice === 'completed'}>개인 모험 완료</button>
        </div>
        <button type="button" className="primary-command" onClick={() => execute({ choice: soloChoice })}><Check size={17} aria-hidden="true" /> 1단계 기록</button>
      </div>
    );
    if (step.id === 'aging') return <button type="button" className="primary-command" onClick={() => execute({})}><Dices size={17} aria-hidden="true" /> 기사·종자·탈것 노화 판정</button>;
    if (step.id === 'economy') return (
      <div className="choice-panel winter-form-grid">
        <SelectField label="유지 수준" value={maintenanceGrade} onChange={setMaintenanceGrade} options={Object.entries(MAINTENANCE_GRADES).map(([value, grade]) => ({ value, label: `${grade.label} · 최소 £${grade.minimum}` }))} />
        <label className="winter-field"><span>지역 재난·연도 보정</span><input type="number" value={situationalModifier} onChange={event => setSituationalModifier(Number(event.target.value))} /></label>
        <button type="button" className="primary-command" onClick={() => execute({ maintenanceGrade, situationalModifier })}><Landmark size={17} aria-hidden="true" /> 수확과 유지비 순정산</button>
      </div>
    );
    if (step.id === 'survival') return <button type="button" className="primary-command" onClick={() => execute({})}><Dices size={17} aria-hidden="true" /> 전체 대상 개별 생존 판정</button>;
    if (step.id === 'personalEvent') {
      const needsEventChoice = record?.status === 'awaiting_event_choice';
      return (
        <div className="choice-panel winter-form-grid">
          {needsEventChoice && <SelectField label="Table 10-9 선택" value={personalEventChoice} onChange={setPersonalEventChoice} options={Object.entries(PERSONAL_EVENT_TABLE).filter(([id]) => id !== '20').map(([value, item]) => ({ value, label: `${value}. ${item.trigger}` }))} />}
          <button type="button" className="primary-command" onClick={() => execute({ eventChoice: Number(personalEventChoice) || undefined })}><Dices size={17} aria-hidden="true" /> {needsEventChoice ? '선택 사건 판정' : '개인 사건과 관련 수치 판정'}</button>
        </div>
      );
    }
    if (step.id === 'family') {
      const needsEventChoice = record?.status === 'awaiting_event_choice';
      const parsedChildNames = childNames.split(',').map(name => name.trim()).filter(Boolean);
      return (
        <div className="choice-panel family-winter-controls">
          <fieldset className="winter-subprocedure">
            <legend>혼인</legend>
            <SelectField label="이번 겨울" value={livingSpouse ? 'already_married' : marriageAction} onChange={setMarriageAction} options={livingSpouse ? [{ value: 'already_married', label: `${livingSpouse.name}와 혼인 중` }] : [
              { value: 'skip', label: '혼인을 시도하지 않음' },
              { value: 'below_class', label: '낮은 계급과 혼인 허가 요청' },
              { value: 'within_class_roll', label: '같은 계급 후보 탐색 후 혼인' },
              { value: 'within_class_wait', label: '같은 계급 후보를 만나고 기다림' }
            ]} />
            {!livingSpouse && !['skip', 'already_married'].includes(marriageAction) && (
              <div className="winter-form-grid">
                <label className="winter-field"><span>배우자 이름</span><input value={spouseName} onChange={event => setSpouseName(event.target.value)} placeholder="혼인 성공 시 가계도에 기록" /></label>
                <label className="winter-field"><span>배우자 나이</span><input type="number" min="14" max="80" value={spouseAge} onChange={event => setSpouseAge(Number(event.target.value))} /></label>
              </div>
            )}
          </fieldset>

          <fieldset className="winter-subprocedure">
            <legend>출산</legend>
            <div className="segmented-control" role="group" aria-label="출산 판정 여부">
              <button type="button" className={childbirthAction === 'skip' ? 'active' : ''} onClick={() => setChildbirthAction('skip')} aria-pressed={childbirthAction === 'skip'}>해당 없음</button>
              <button type="button" className={childbirthAction === 'roll' ? 'active' : ''} onClick={() => setChildbirthAction('roll')} aria-pressed={childbirthAction === 'roll'}>출산 가능 관계 판정</button>
            </div>
            {childbirthAction === 'roll' && (
              <div className="winter-form-grid">
                {!livingSpouse && marriageAction === 'skip' && <label className="winter-field"><span>상대 이름</span><input value={motherName} onChange={event => setMotherName(event.target.value)} placeholder="배우자·연인·동행인" /></label>}
                <label className="winter-field"><span>아이 이름</span><input value={childNames} onChange={event => setChildNames(event.target.value)} placeholder="쌍둥이는 쉼표로 구분" /></label>
              </div>
            )}
          </fieldset>

          {needsEventChoice && <SelectField label="가족 사건 선택" value={familyEventChoice} onChange={setFamilyEventChoice} options={Object.entries(FAMILY_EVENT_TABLE).filter(([id]) => id !== '20').map(([value, item]) => ({ value, label: `${value}. ${item.title}` }))} />}
          <button type="button" className="primary-command" onClick={() => execute({
            eventChoice: Number(familyEventChoice) || undefined,
            marriageAction: livingSpouse ? 'already_married' : marriageAction,
            spouseName,
            spouseAge,
            childbirthAction,
            motherName,
            childNames: parsedChildNames
          })}><Dices size={17} aria-hidden="true" /> {needsEventChoice ? '선택한 가족 절차 판정' : '혼인·출산·가족 사건 판정'}</button>
        </div>
      );
    }
    if (step.id === 'experience') return <button type="button" className="primary-command" onClick={() => execute({})}><Dices size={17} aria-hidden="true" /> 경험 체크 일괄 판정</button>;
    if (step.id === 'training') return (
      <div className="choice-panel training-panel">
        <div className="segmented-control" role="group" aria-label="훈련 방식">
          <button type="button" className={trainingOption === 'score' ? 'active' : ''} onClick={() => setTrainingOption('score')} aria-pressed={trainingOption === 'score'}>수치 하나</button>
          <button type="button" className={trainingOption === 'skills15' ? 'active' : ''} onClick={() => setTrainingOption('skills15')} aria-pressed={trainingOption === 'skills15'}>기술 네 개</button>
          <button type="button" className={trainingOption === 'skill20' ? 'active' : ''} onClick={() => setTrainingOption('skill20')} aria-pressed={trainingOption === 'skill20'}>고급 기술</button>
        </div>
        {trainingOption === 'score' && <div className="winter-form-grid">
          <SelectField label="수치 분류" value={trainingGroup} onChange={value => { setTrainingGroup(value); setTrainingKey(''); }} options={['attributes', 'traits', 'passions', 'standings'].map(value => ({ value, label: GROUP_LABELS[value] }))} />
          <SelectField label="수치" value={trainingKey} onChange={setTrainingKey} options={Object.keys(character[trainingGroup] || {}).filter(key => key !== 'currentHp')} />
          <SelectField label="변화" value={String(trainingAmount)} onChange={value => setTrainingAmount(Number(value))} options={[{ value: '1', label: '+1' }, { value: '-1', label: '-1' }]} />
        </div>}
        {trainingOption === 'skills15' && <div className="winter-form-grid winter-form-grid--four">
          {['ordinary', 'courtly', 'combat'].map(group => <SelectField key={group} label={group.replace(/^./, letter => letter.toUpperCase())} value={skillSelections[group]} onChange={value => setSkillSelections(current => ({ ...current, [group]: value }))} options={trainingGroups[group].filter(key => Number(character.skills[key]) > 0 && Number(character.skills[key]) < 15)} />)}
          <SelectField label="Free" value={skillSelections.free} onChange={value => setSkillSelections(current => ({ ...current, free: value }))} options={allSkills.filter(key => Number(character.skills[key]) > 0 && Number(character.skills[key]) < 15)} />
        </div>}
        {trainingOption === 'skill20' && <SelectField label="16-19 기술" value={highSkill} onChange={setHighSkill} options={highSkills} />}
        <button type="button" className="primary-command" onClick={() => execute(trainingOption === 'score' ? { option: trainingOption, group: trainingGroup, key: trainingKey, amount: trainingAmount } : trainingOption === 'skills15' ? { option: trainingOption, selections: skillSelections } : { option: trainingOption, key: highSkill })}><Check size={17} aria-hidden="true" /> 훈련 적용</button>
      </div>
    );
    if (step.id === 'glory') return <button type="button" className="primary-command" onClick={() => execute({})}><ScrollText size={17} aria-hidden="true" /> 연간 영광 원장 계산</button>;
    if (step.id === 'gloryBonus') {
      if (availableBonus === 0) return <button type="button" className="primary-command" onClick={() => execute({ allocations: [] })}><Check size={17} aria-hidden="true" /> 보너스 없음 확인</button>;
      return (
        <div className="choice-panel bonus-panel">
          <p>즉시 배분할 보너스 <strong>{availableBonus}점</strong> · 선택됨 {allocations.length}/{availableBonus}</p>
          <div className="winter-form-grid">
            <SelectField label="분류" value={bonusGroup} onChange={value => { setBonusGroup(value); setBonusKey(''); }} options={Object.keys(GROUP_LABELS).map(value => ({ value, label: GROUP_LABELS[value] }))} />
            <SelectField label="수치" value={bonusKey} onChange={setBonusKey} options={Object.keys(character[bonusGroup] || {}).filter(key => key !== 'currentHp')} />
            <button type="button" className="secondary-command" onClick={addAllocation} disabled={!bonusKey || allocations.length >= availableBonus}>배분 추가</button>
          </div>
          <ol>{allocations.map((item, index) => <li key={`${item.group}:${item.key}:${index}`}><code>{item.group}.{item.key}</code></li>)}</ol>
          <button type="button" className="primary-command" onClick={() => execute({ allocations })} disabled={allocations.length !== availableBonus}><Check size={17} aria-hidden="true" /> 모든 보너스 즉시 적용</button>
        </div>
      );
    }
    return null;
  };

  return (
    <article className="folio-page winter-folio view-animate">
      <FolioHeading eyebrow="Ritus Hibernus · Annual Administration" title="겨울 정산 장부" year={winter.year}>
        원문 10단계를 순서대로 처리하고, 각 결과를 독립 거래와 연대기 항목으로 남깁니다.
      </FolioHeading>

      <section className="winter-progress" aria-label="겨울 정산 진행 상황">
        <div><span lang="en">Progress</span><strong>{resolvedCount}/10</strong></div>
        <div className="winter-progress__track" aria-hidden="true"><span style={{ width: `${resolvedCount * 10}%` }} /></div>
        <span>{winter.currentStep === 'complete' ? '마감 대기' : `${Math.max(1, activeIndex + 1)}단계 처리 중`}</span>
      </section>

      <nav className="winter-step-index" aria-label="겨울 정산 단계">
        {WINTER_STEPS.map((item, index) => {
          const itemStatus = winter.steps?.[item.id] || 'pending';
          const accessible = itemStatus === 'resolved' || itemStatus === 'awaiting_choice' || index <= Math.max(0, activeIndex);
          return (
            <button key={item.id} type="button" className={`${viewIndex === index ? 'active' : ''} ${itemStatus}`} onClick={() => accessible && setViewIndex(index)} disabled={!accessible} aria-current={viewIndex === index ? 'step' : undefined}>
              <span>{String(item.number).padStart(2, '0')}</span>
              {itemStatus === 'resolved' ? <Check size={14} aria-hidden="true" /> : <Circle size={11} aria-hidden="true" />}
              <b>{item.label}</b>
            </button>
          );
        })}
      </nav>

      <section className="winter-step-sheet">
        <header>
          <div><span className="serial-label" lang="en">Step {String(step.number).padStart(2, '0')} · {step.english}</span><h2>{step.label}</h2></div>
          <StatusSeal tone={stateTone(status)}>{status === 'resolved' ? '완료' : status === 'awaiting_choice' ? '선택 대기' : '미처리'}</StatusSeal>
        </header>
        <p className="winter-step-sheet__summary">{step.summary}</p>
        <SourceReference step={step} />

        <div className="winter-step-sheet__workspace">
          {renderControls()}
          {status === 'awaiting_choice' && record?.status !== 'awaiting_event_choice' && hasFamilyTargetChoice && (
            <section className="manual-resolution">
              <Dices size={20} aria-hidden="true" />
              <div>
                <strong>Table 10-13 가족 대상을 확정하십시오</strong>
                <p>{pendingChoices.filter(item => ['family_target_choice', 'family_target_creation_or_reroll', 'family_target_required'].includes(item.type)).map(item => item.label).join(' · ')}</p>
                {familyTargetCandidates.length > 1 ? (
                  <SelectField label="가족 사건 대상" value={familyTargetId} onChange={setFamilyTargetId} options={familyTargetCandidates.map(member => ({ value: member.id, label: `${member.name} · ${member.relation}` }))} />
                ) : (
                  <div className="winter-form-grid">
                    <label className="winter-field"><span>관계 d20</span><input type="number" min="1" max="20" value={familyRelationRoll || record?.roll?.relation || ''} onChange={event => setFamilyRelationRoll(event.target.value)} /></label>
                    <label className="winter-field"><span>성별 d6</span><input type="number" min="1" max="6" value={familySexRoll || record?.roll?.sex || ''} onChange={event => setFamilySexRoll(event.target.value)} /></label>
                  </div>
                )}
                <p className="adventure-source-note">해당 가문원을 가문 장부에 먼저 추가한 뒤 같은 판정을 다시 확인하거나, 원문이 허용한 재판정 값을 입력할 수 있습니다.</p>
                <button type="button" className="secondary-command" onClick={resolveFamilyTarget} disabled={familyTargetCandidates.length > 1 && !familyTargetId}>{familyTargetCandidates.length > 1 ? '가족 대상 확정' : '가족 대상 다시 판정'}</button>
              </div>
            </section>
          )}
          {status === 'awaiting_choice' && record?.status !== 'awaiting_event_choice' && !hasFamilyTargetChoice && (
            <section className="manual-resolution">
              <AlertTriangle size={20} aria-hidden="true" />
              <div>
                <strong>원문상 플레이어 또는 GM의 판정이 필요합니다</strong>
                <p>{Array.isArray(record?.unresolvedChoice) ? record.unresolvedChoice.map(item => item.label).join(' · ') : record?.unresolvedChoice?.label}</p>
                <label><span>후속 처리 기록</span><textarea value={manualNote} onChange={event => setManualNote(event.target.value)} rows={3} placeholder="원문 선택과 실제 적용 결과" /></label>
                <label><span>Canonical 거래 ID · 쉼표 구분</span><input value={manualTransactionIds} onChange={event => setManualTransactionIds(event.target.value)} placeholder="combat:..., economy:..., standing:..." /></label>
                <p className="adventure-source-note">결정적인 효과는 전투·경제·평판·생애주기 화면에서 먼저 처리한 뒤 저장된 거래 ID를 연결해야 합니다.</p>
                <button type="button" className="secondary-command" onClick={resolveManual} disabled={!manualNote.trim()}>후속 결과 연결 후 봉인</button>
              </div>
            </section>
          )}
          {status === 'awaiting_choice' && <ResultPanel record={record} />}
        </div>

        {error && <div className="winter-error" role="alert"><AlertTriangle size={17} aria-hidden="true" /><span>{error}</span></div>}
      </section>

      <div className="winter-navigation">
        <button type="button" className="secondary-command" onClick={() => setViewIndex(index => Math.max(0, index - 1))} disabled={viewIndex === 0}><ArrowLeft size={16} aria-hidden="true" /> 이전 단계</button>
        <span>{step.number} / 10</span>
        <button type="button" className="secondary-command" onClick={() => setViewIndex(index => Math.min(9, index + 1))} disabled={viewIndex === 9 || winter.steps?.[WINTER_STEPS[viewIndex + 1]?.id] === 'pending'}>다음 단계 <ArrowRight size={16} aria-hidden="true" /></button>
      </div>

      {winter.currentStep === 'complete' && (
        <section className="winter-close">
          <Snowflake size={28} aria-hidden="true" />
          <div><CompleteMark>10단계 완료</CompleteMark><h2>{winter.year}년 겨울 장부 마감</h2><p>연간 거래를 연대기에 봉인하고 캠페인을 {winter.year + 1}년으로 넘깁니다.</p></div>
          <button type="button" className="primary-command" onClick={sealWinter}>연간 장부 봉인</button>
        </section>
      )}

      <details className="winter-transactions">
        <summary><span>연간 거래 원장</span><strong>{winter.transactions?.length || 0}건</strong></summary>
        <div className="winter-transaction-ledger">
          {(winter.transactions || []).map(transaction => <LedgerRow key={transaction.completionId} label={`${transaction.number}. ${transaction.label}`} meta={`${transaction.ruleId} · ${transaction.sourcePage}`} value={transaction.status?.includes('manual') ? 'GM 기록' : '완료'} />)}
          {!winter.transactions?.length && <p className="muted-copy">아직 봉인된 단계 거래가 없습니다.</p>}
        </div>
      </details>
    </article>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, BookOpen, Check, Dices, HeartPulse, History, ScrollText, Shield, UserRoundPlus } from 'lucide-react';
import {
  beginSuccessorCreation,
  calculateSalvationLedger,
  cancelCareerEnd,
  createCharacterCreationSession,
  createSeededRng,
  createSuccessorContext,
  getSuccessorCandidates,
  prepareCareerEnd,
  prepareSalvation,
  resolveCanonization,
  resolveCareerEnd,
  resolveIncapacitation,
  resolveRecovery,
  resolveSalvation,
  restorePrimaryCharacter,
  updateLegacyChoices
} from '../rules';
import { t } from '../i18n';
import './LifecyclePanel.css';

const STATUS_ORDER = ['active', 'incapacitated', 'bedridden', 'pending_salvation', 'pending_legacy', 'pending_successor', 'successor_in_creation', 'deceased', 'retired', 'historical'];

const outcomeLabel = value => ({ critical: '대성공', success: '성공', failure: '실패', fumble: '대실패' }[value] || value);
const destinationLabel = value => ({ heaven: '천국', purgatory: '연옥', hell: '지옥' }[value] || value);

function SourceNote({ ids, page }) {
  return <p className="lc-source"><BookOpen size={14} /> {ids} · 룰북 {page}</p>;
}

export default function LifecyclePanel({ character, setCharacter, onOpenCreation }) {
  const lifecycle = character.campaign?.lifecycle || {};
  const status = lifecycle.status || lifecycle.careerStatus || 'active';
  const [cause, setCause] = useState('');
  const [deeds, setDeeds] = useState({ paladin: false, holyWarOrReligiousRetirement: false, convertedPagans: 0, gmOther: 0, amorKey: '' });
  const [salvationMode, setSalvationMode] = useState('automatic');
  const [salvationManual, setSalvationManual] = useState('');
  const [churchMode, setChurchMode] = useState('automatic');
  const [churchManual, setChurchManual] = useState('');
  const [selectedTransfers, setSelectedTransfers] = useState(() => lifecycle.legacy?.selectedTransfers?.map(entry => entry.id) || []);
  const [selectedEquipment, setSelectedEquipment] = useState(() => lifecycle.legacy?.inheritableEquipment?.filter(item => item.selected).map(item => item.id) || []);
  const [manorDecision, setManorDecision] = useState('');
  const [manorNote, setManorNote] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [gmApproved, setGmApproved] = useState(false);
  const [gmNote, setGmNote] = useState('');
  const [notice, setNotice] = useState('');
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);

  const candidates = useMemo(() => getSuccessorCandidates(character), [character]);
  const ledgerPreview = useMemo(() => calculateSalvationLedger(character, deeds), [character, deeds]);
  const amorChoices = Object.keys(character.passions || {}).filter(key => /^amor/i.test(key));
  const pendingCareerEnd = lifecycle.pendingCareerEnd;
  const legacy = lifecycle.legacy;
  const salvation = lifecycle.salvation;

  useEffect(() => {
    if (!pendingCareerEnd || !dialogRef.current) return undefined;
    const dialog = dialogRef.current;
    const focusables = [...dialog.querySelectorAll('button:not(:disabled), input:not(:disabled)')];
    focusables[0]?.focus();
    const handleKey = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        const result = cancelCareerEnd(character);
        if (result.cancelled) setCharacter(result.character);
        returnFocusRef.current?.focus();
      }
      if (event.key !== 'Tab' || focusables.length < 2) return;
      const first = focusables[0];
      const last = focusables.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    dialog.addEventListener('keydown', handleKey);
    return () => dialog.removeEventListener('keydown', handleKey);
  }, [pendingCareerEnd, character, setCharacter]);

  const applyResult = (result, successText) => {
    if (result.character !== character) setCharacter(result.character);
    setNotice(result.applied || result.prepared || result.updated || result.started || result.restored || result.cancelled ? successText : `처리되지 않음: ${result.reason || '중복 기록'}`);
    return result;
  };

  const requestCareerEnd = type => {
    if (!cause.trim()) { setNotice('원인 또는 사유를 먼저 기록하세요.'); return; }
    returnFocusRef.current = document.activeElement;
    applyResult(prepareCareerEnd(character, { type, cause: cause.trim() }), type === 'death' ? '사망 기록을 확인해 주세요.' : '은퇴 기록을 확인해 주세요.');
  };

  const confirmCareerEnd = () => {
    const result = resolveCareerEnd(character);
    applyResult(result, pendingCareerEnd?.type === 'death' ? '사망과 구원 대기 상태를 함께 기록했습니다.' : '은퇴와 구원 대기 상태를 함께 기록했습니다.');
    setCause('');
    returnFocusRef.current?.focus();
  };

  const prepareLedger = () => applyResult(prepareSalvation(character, deeds), '구원 계산 근거를 저장했습니다.');

  const rollSalvation = () => {
    const seed = salvation?.salvationId || `salvation-${character.personal?.campaignYear || 767}`;
    const rawRoll = salvationMode === 'manual' ? Number(salvationManual) : undefined;
    if (salvationMode === 'manual' && (!Number.isInteger(rawRoll) || rawRoll < 1 || rawRoll > 20)) { setNotice('d20 눈은 1부터 20까지 입력하세요.'); return; }
    const result = resolveSalvation(character, { rawRoll, seed, rollIndex: 0, rng: createSeededRng(seed) });
    applyResult(result, '구원 판정과 다음 대기 단계를 기록했습니다.');
  };

  const rollChurch = () => {
    const seed = `${salvation?.salvationId || 'salvation'}:church`;
    const rawRoll = churchMode === 'manual' ? Number(churchManual) : undefined;
    if (churchMode === 'manual' && (!Number.isInteger(rawRoll) || rawRoll < 1 || rawRoll > 20)) { setNotice('d20 눈은 1부터 20까지 입력하세요.'); return; }
    const result = resolveCanonization(character, { rawRoll, seed, rollIndex: 1, rng: createSeededRng(seed) });
    applyResult(result, result.canonized ? '시성이 인정되어 유산이 두 점수 이전과 축복 grant로 갱신되었습니다.' : '교회 지위 판정 실패를 기록했습니다.');
  };

  const toggleTransfer = id => {
    const maximum = legacy?.scoreCaps?.transferCount || 1;
    setSelectedTransfers(previous => previous.includes(id) ? previous.filter(item => item !== id) : previous.length < maximum ? [...previous, id] : previous);
  };

  const finalizeLegacy = () => {
    const result = updateLegacyChoices(character, {
      selectedTransfers,
      selectedEquipmentIds: selectedEquipment,
      equipmentDecisionRecorded: true,
      manorApproved: legacy?.inheritableManors?.length ? manorDecision === 'approved' : undefined,
      manorApprovalNote: manorNote
    });
    applyResult(result, '유산 선택을 확정하고 후계 절차로 이동했습니다.');
  };

  const startCreation = mode => {
    const contextResult = createSuccessorContext(character, {
      mode,
      candidateId: mode === 'new_family' ? null : candidateId,
      gmApproved,
      gmApprovalNote: gmNote
    });
    if (!contextResult.ok) { setNotice(`생성을 시작할 수 없습니다: ${contextResult.reason}`); return; }
    const context = contextResult.context;
    const session = createCharacterCreationSession({
      seed: `${context.contextId}:${character.personal?.campaignYear || 767}`,
      mode: 'core',
      existingFamily: context.family,
      successorContext: context
    });
    const result = beginSuccessorCreation(character, context, session);
    applyResult(result, mode === 'prepared_second' ? '준비된 두 번째 캐릭터 생성을 시작했습니다.' : '정식 후계자 생성을 시작했습니다.');
    if (result.started) onOpenCreation?.();
  };

  const restorePrimary = () => applyResult(restorePrimaryCharacter(character, { recoveryConfirmed: true, cause: '회복 확인' }), '원 캐릭터의 회복과 활성권 복귀를 기록했습니다.');

  return (
    <section className="lc-panel" aria-labelledby="lifecycle-title">
      <header className="lc-header">
        <div><span>Chapter One · LIFE-001</span><h3 id="lifecycle-title"><History size={19} /> {t('lifecycle.title')}</h3></div>
        <strong className={`lc-status lc-status-${status}`}>{t(`lifecycle.${status}`)}</strong>
      </header>

      <div className="lc-stage-track" aria-label="생애 절차 진행 상태">
        {STATUS_ORDER.slice(0, 7).map((item, index) => <span key={item} className={item === status ? 'is-current' : STATUS_ORDER.indexOf(status) > index ? 'is-past' : ''}>{t(`lifecycle.${item}`)}</span>)}
      </div>

      {['active', 'incapacitated', 'bedridden'].includes(lifecycle.careerStatus) && lifecycle.activeRole !== 'prepared_second' && (
        <div className="lc-section">
          <div className="lc-section-heading"><HeartPulse size={18} /><div><h4>현재 생애 상태</h4><p>사망과 확정 은퇴는 구원 절차를 열지만, 행동 불능과 병상 상태는 생존 기록으로 남습니다.</p></div></div>
          <label className="lc-field"><span>원인 또는 사유</span><input value={cause} onChange={event => setCause(event.target.value)} placeholder="사건과 시점을 간단히 기록" /></label>
          <div className="lc-actions">
            {lifecycle.careerStatus === 'active' && <button type="button" onClick={() => applyResult(resolveIncapacitation(character, { cause: cause || '일시적 행동 불능' }), '행동 불능 상태를 기록했습니다.')}><HeartPulse size={16} /> {t('lifecycle.temporary')}</button>}
            {['incapacitated', 'bedridden'].includes(lifecycle.careerStatus) && <button type="button" onClick={() => applyResult(resolveRecovery(character, { cause: cause || '회복 확인' }), '활동 상태로 돌아왔습니다.')}><Check size={16} /> {t('lifecycle.recover')}</button>}
            <button type="button" ref={returnFocusRef} className="is-danger" onClick={() => requestCareerEnd('death')}><AlertTriangle size={16} /> {t('lifecycle.death')}</button>
            <button type="button" onClick={() => requestCareerEnd('retirement')}><ScrollText size={16} /> {t('lifecycle.retirement')}</button>
          </div>
          <SourceNote ids="LIFE-001 · WINTER-AGING-001" page="41-43, 174-175쪽" />
        </div>
      )}

      {pendingCareerEnd && (
        <div className="lc-dialog-backdrop">
          <div className="lc-dialog" role="alertdialog" aria-modal="true" aria-labelledby="career-end-confirm-title" ref={dialogRef}>
            <AlertTriangle size={24} />
            <h4 id="career-end-confirm-title">{pendingCareerEnd.type === 'death' ? '사망 기록 확인' : '확정 은퇴 기록 확인'}</h4>
            <dl><div><dt>상태</dt><dd>{pendingCareerEnd.type === 'death' ? '사망' : '은퇴'}</dd></div><div><dt>연도 · 나이</dt><dd>{pendingCareerEnd.year}년 · {pendingCareerEnd.age}세</dd></div><div><dt>원인</dt><dd>{pendingCareerEnd.cause}</dd></div><div><dt>다음 단계</dt><dd>구원 판정 대기</dd></div></dl>
            <p>사망은 생존 은퇴로 바뀌지 않으며, 확정 은퇴는 사망 기록을 만들지 않습니다.</p>
            <div className="lc-actions"><button type="button" onClick={() => applyResult(cancelCareerEnd(character), '생애 종료 확인을 취소했습니다.')}>{t('common.cancel')}</button><button type="button" className="is-primary" onClick={confirmCareerEnd}>{t('common.confirm')}</button></div>
          </div>
        </div>
      )}

      {status === 'pending_salvation' && (
        <div className="lc-section">
          <div className="lc-section-heading"><Shield size={18} /><div><h4>구원(Salvation)</h4><p>가장 낮은 종교적 성향과 네 열정, 생전 공적을 항목별로 기록합니다.</p></div></div>
          {!salvation?.ledger ? <>
            <div className="lc-ledger">
              <div><span>가장 낮은 종교적 성향</span><strong>{ledgerPreview.selectedReligiousTrait.key} {ledgerPreview.baseStatistic}</strong></div>
              {ledgerPreview.passionBonuses.map(entry => <div key={entry.key}><span>{entry.label} {entry.value}</span><strong>+{entry.bonus}</strong></div>)}
            </div>
            {amorChoices.length > 0 && <label className="lc-field"><span>Amor 열정</span><select value={deeds.amorKey} onChange={event => setDeeds(previous => ({ ...previous, amorKey: event.target.value }))}><option value="">가장 먼저 기록된 Amor</option>{amorChoices.map(key => <option key={key} value={key}>{key} ({character.passions[key]})</option>)}</select></label>}
            <div className="lc-checks">
              <label><input type="checkbox" checked={deeds.paladin} onChange={event => setDeeds(previous => ({ ...previous, paladin: event.target.checked }))} /> 성기사(Paladin) +5</label>
              <label><input type="checkbox" checked={deeds.holyWarOrReligiousRetirement} onChange={event => setDeeds(previous => ({ ...previous, holyWarOrReligiousRetirement: event.target.checked }))} /> 성전 중 사망 또는 수도자·은수자 은퇴 +5</label>
              <label><span>직접 개종시킨 이교도</span><input type="number" min="0" max="5" value={deeds.convertedPagans} onChange={event => setDeeds(previous => ({ ...previous, convertedPagans: Number(event.target.value) }))} /></label>
              <label><span>GM이 인정한 기타 공적</span><input type="number" value={deeds.gmOther} onChange={event => setDeeds(previous => ({ ...previous, gmOther: Number(event.target.value) }))} /></label>
            </div>
            <p className="lc-total">최종 구원 수치 <strong>{ledgerPreview.finalStatistic}</strong></p>
            <button type="button" className="lc-primary-command" onClick={prepareLedger}><ScrollText size={17} /> 계산 근거 저장</button>
          </> : <>
            <div className="lc-ledger"><div><span>기본 수치</span><strong>{salvation.ledger.selectedReligiousTrait.key} {salvation.ledger.baseStatistic}</strong></div><div><span>열정 보너스</span><strong>+{salvation.ledger.passionTotal}</strong></div><div><span>공적 보너스</span><strong>+{salvation.ledger.deedTotal}</strong></div><div><span>최종 수치</span><strong>{salvation.ledger.finalStatistic}</strong></div></div>
            <div className="lc-roll-row"><div className="lc-segmented"><button type="button" className={salvationMode === 'automatic' ? 'is-current' : ''} onClick={() => setSalvationMode('automatic')}>자동</button><button type="button" className={salvationMode === 'manual' ? 'is-current' : ''} onClick={() => setSalvationMode('manual')}>직접 입력</button></div>{salvationMode === 'manual' && <input aria-label="구원 d20 눈" type="number" min="1" max="20" value={salvationManual} onChange={event => setSalvationManual(event.target.value)} />}<button type="button" className="lc-primary-command" onClick={rollSalvation}><Dices size={17} /> 구원 판정</button></div>
          </>}
          <SourceNote ids="LIFE-SALVATION-001" page="41쪽, 표 1-16" />
        </div>
      )}

      {salvation?.roll && (
        <div className="lc-result"><strong>{destinationLabel(salvation.destination)}</strong><span>d20 {salvation.roll.rawResult} / 기준 {salvation.roll.target} · {outcomeLabel(salvation.roll.result)}</span><small>입력 방식: {salvation.roll.source === 'manual' ? '직접 입력' : '시드 자동 굴림'}</small></div>
      )}

      {salvation?.canonization?.status === 'pending_church_roll' && (
        <div className="lc-section">
          <div className="lc-section-heading"><Shield size={18} /><div><h4>시성(Canonization) 확인</h4><p>보너스 15점 이상과 구원 대성공을 충족했습니다. 교회 지위 판정을 별도로 기록합니다.</p></div></div>
          <div className="lc-roll-row"><div className="lc-segmented"><button type="button" className={churchMode === 'automatic' ? 'is-current' : ''} onClick={() => setChurchMode('automatic')}>자동</button><button type="button" className={churchMode === 'manual' ? 'is-current' : ''} onClick={() => setChurchMode('manual')}>직접 입력</button></div>{churchMode === 'manual' && <input aria-label="교회 지위 d20 눈" type="number" min="1" max="20" value={churchManual} onChange={event => setChurchManual(event.target.value)} />}<button type="button" className="lc-primary-command" onClick={rollChurch}><Dices size={17} /> 교회 지위 판정</button></div>
          <SourceNote ids="LIFE-SAINT-001" page="42쪽, 표 1-17" />
        </div>
      )}

      {status === 'pending_legacy' && legacy && salvation?.canonization?.status !== 'pending_church_roll' && (
        <div className="lc-section">
          <div className="lc-section-heading"><ScrollText size={18} /><div><h4>유산(Legacy) 선택</h4><p>이전 수치는 구원 수치 {legacy.scoreCaps.salvation}을 넘을 수 없습니다. {legacy.scoreCaps.transferCount}개를 선택하세요.</p></div></div>
          <div className="lc-transfer-grid">{legacy.transferableScores.map(entry => <label key={entry.id} className={selectedTransfers.includes(entry.id) ? 'is-selected' : ''}><input type="checkbox" checked={selectedTransfers.includes(entry.id)} onChange={() => toggleTransfer(entry.id)} /><span>{entry.group}.{entry.key}</span><strong>{entry.predecessorValue} → {entry.transferableValue}</strong></label>)}</div>
          <h5>상속 장비</h5>
          <div className="lc-checks">{legacy.inheritableEquipment.map(item => <label key={item.id}><input type="checkbox" checked={selectedEquipment.includes(item.id)} onChange={() => setSelectedEquipment(previous => previous.includes(item.id) ? previous.filter(id => id !== item.id) : [...previous, item.id])} /><span>{item.category} · {item.key}</span></label>)}</div>
          {legacy.inheritableManors.length > 0 && <><h5>장원 GM 승인</h5><div className="lc-segmented"><button type="button" className={manorDecision === 'approved' ? 'is-current' : ''} onClick={() => setManorDecision('approved')}>승인</button><button type="button" className={manorDecision === 'declined' ? 'is-current' : ''} onClick={() => setManorDecision('declined')}>미승인</button></div><label className="lc-field"><span>승인 기록</span><input value={manorNote} onChange={event => setManorNote(event.target.value)} /></label></>}
          <div className="lc-grants"><span>추가 탄생 선물 <strong>1회</strong></span><span>성인의 축복 <strong>{legacy.blessingGrant ? '1회 grant' : '없음'}</strong></span></div>
          <button type="button" className="lc-primary-command" onClick={finalizeLegacy} disabled={selectedTransfers.length !== legacy.scoreCaps.transferCount || (legacy.inheritableManors.length > 0 && !manorDecision)}><Check size={17} /> 유산 선택 확정</button>
          <SourceNote ids="LIFE-LEGACY-001 · LIFE-NEWCHAR-001" page="41-43쪽" />
        </div>
      )}

      {['pending_successor', 'pending_legacy', 'incapacitated', 'bedridden'].includes(status) && (
        <div className="lc-section">
          <div className="lc-section-heading"><UserRoundPlus size={18} /><div><h4>다음 캐릭터 경로</h4><p>같은 가문, 새 가문, 일시적 보조 인물은 서로 다른 기록으로 남습니다.</p></div></div>
          <label className="lc-field"><span>가문 인물 후보</span><select value={candidateId} onChange={event => setCandidateId(event.target.value)}><option value="">후보 선택</option>{candidates.map(item => <option key={item.id} value={item.id} disabled={!item.eligible}>{item.name} · {item.age ?? '?'}세 {item.eligible ? '' : '(15세 미만)'}</option>)}</select></label>
          {['pending_successor', 'pending_legacy'].includes(status) && <div className="lc-successor-routes"><button type="button" disabled={status === 'pending_legacy'} onClick={() => startCreation('same_family')}><Shield size={19} /><strong>같은 가문 후계자</strong><span>{status === 'pending_legacy' ? '먼저 유산 선택을 확정해야 합니다.' : '가문·허용 유산을 이어 정식 생성'}</span></button><div><label><input type="checkbox" checked={gmApproved} onChange={event => setGmApproved(event.target.checked)} /> 새 가문 선택에 대한 GM 승인</label><input value={gmNote} onChange={event => setGmNote(event.target.value)} placeholder="승인 메모" /><button type="button" onClick={() => startCreation('new_family')}><UserRoundPlus size={19} /><strong>새 가문 캐릭터</strong><span>미사용 유산을 포기하고 이전 가문의 이익 없이 새로 생성</span></button></div></div>}
          {status === 'incapacitated' && <button type="button" className="lc-primary-command" onClick={() => startCreation('prepared_second')}><UserRoundPlus size={17} /> 준비된 두 번째 캐릭터 생성</button>}
          <SourceNote ids="LIFE-NEWCHAR-001 · LIFE-NEWFAMILY-001 · CHAR-KNIGHT-QUAL-001" page="42-43쪽" />
        </div>
      )}

      {status === 'successor_in_creation' && <div className="lc-section lc-resume"><ScrollText size={19} /><div><h4>{lifecycle.successor?.mode === 'prepared_second' ? '두 번째 캐릭터 생성 중' : '후계자 생성 중'}</h4><p>저장된 20단계 룰북 생성 절차를 이어갈 수 있습니다.</p></div><button type="button" onClick={onOpenCreation}>생성 이어하기</button></div>}
      {lifecycle.activeRole === 'prepared_second' && <div className="lc-section lc-resume"><HeartPulse size={19} /><div><h4>준비된 두 번째 캐릭터 활동 중</h4><p>원 캐릭터의 회복이 확인되면 활성권을 되돌릴 수 있습니다.</p></div><button type="button" onClick={restorePrimary}>회복 확인 및 복귀</button></div>}

      {lifecycle.unresolvedChoices?.length > 0 && <div className="lc-unresolved"><AlertTriangle size={16} /><strong>{t('common.unresolved')}</strong><span>{lifecycle.unresolvedChoices.join(' · ')}</span></div>}
      {notice && <p className="lc-notice" role="status">{notice}</p>}
    </section>
  );
}

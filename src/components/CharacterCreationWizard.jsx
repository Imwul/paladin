import { useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleDashed,
  Dices,
  FileClock,
  RotateCcw,
  Save,
  ScrollText,
  ShieldCheck
} from 'lucide-react';
import {
  BIRTH_GIFTS,
  CHARACTER_CULTURES,
  CHARACTER_CREATION_STEPS,
  CHAPTER17_RELIGIONS,
  DISTINCTIVE_FEATURES,
  FATHER_CLASSES,
  FAMILY_CHARACTERISTICS_MALE,
  MELEE_WEAPON_SKILLS,
  MARKET_CATALOG,
  PATRON_SAINTS,
  RELIGIOUS_TRAITS,
  SKILL_CATEGORIES,
  SOURCE_SKILL_LABELS,
  SOURCE_TRAIT_LABELS,
  TRAIT_PAIRS,
  addCharacterCreationSquireYear,
  advanceCharacterCreationStep,
  completeCharacterCreation,
  createCharacterCreationSession,
  getCreationRollRequests,
  getCulture,
  getCultureEquipmentChoiceRequests,
  getCultureEquipmentProfile,
  isFrankishCulture,
  goToCharacterCreationStep,
  recordManualCharacterCreationRoll,
  removeLastCharacterCreationSquireYear,
  retreatCharacterCreationStep,
  rollCharacterCreationStep,
  updateCharacterCreationChoice
} from '../rules';
import { t } from '../i18n';
import RulebookButton from '../features/rulebook/RulebookButton';
import './CharacterCreationWizard.css';

const ATTRIBUTE_LABELS = { siz: 'SIZ', dex: 'DEX', str: 'STR', con: 'CON', app: 'APP' };
const PASSION_LABELS = { honor: 'Honor', loveCharlemagne: 'Love [Charlemagne]', loveFamily: 'Love [family]', loveGod: 'Love [God]' };
const STANDING_LABELS = { charlemagne: 'Charlemagne', liegeLord: 'Liege lord', family: 'Family', retinue: 'Retinue', church: 'The Church', commoners: 'Commoners' };
const SCORE_GROUP_LABELS = { traits: 'Trait', passions: 'Passion', standings: 'Standing' };
const displayValue = value => value === null || value === undefined || value === '' ? '-' : value;
const marketLabel = id => MARKET_CATALOG.find(entry => entry.id === id)?.label || id;

function SegmentedControl({ label, value, options, onChange }) {
  return (
    <fieldset className="cc-fieldset">
      <legend>{label}</legend>
      <div className="cc-segmented">
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            className={value === option.value ? 'is-active' : ''}
            onClick={() => onChange(option.value)}
            disabled={option.disabled}
            title={option.title}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function RuleDisclosure({ step, session }) {
  const modifiers = session.modifierLog.filter(entry => entry.stepId === step.id);
  const culture = getCulture(session.choices.cultureId);
  const foreign = !isFrankishCulture(culture.id);
  return (
    <details className="cc-rule-note">
      <summary><BookOpen size={15} /> 룰북 근거</summary>
      <div>
        <span><strong>Rule ID</strong> {foreign ? `${step.ruleIds.join(', ')} · CH17-GM-BOUNDARY` : step.ruleIds.join(', ')}</span>
        <span><strong>페이지</strong> {foreign ? `${step.pages} · ${culture.sourcePage}` : step.pages}</span>
        <span><strong>현재 보정</strong> {modifiers.length ? `${modifiers.length}건 기록됨` : '이 단계에서 적용된 보정 없음'}</span>
        <RulebookButton sourcePage={step.pages} reason={step.title} label="이 단계 원문" />
      </div>
    </details>
  );
}

function RollPanel({ session, stepId, onChange }) {
  const [mode, setMode] = useState('automatic');
  const [manualValues, setManualValues] = useState({});
  const [error, setError] = useState('');
  const pending = getCreationRollRequests(session, stepId);
  const stepRolls = session.rollLog.filter(entry => entry.stepId === stepId);

  const handleAutomatic = () => {
    setError('');
    onChange(rollCharacterCreationStep(session, stepId));
  };

  const handleManual = () => {
    let next = session;
    try {
      for (const spec of pending) {
        const raw = String(manualValues[spec.key] || '').split(',').map(value => Number(value.trim())).filter(Number.isFinite);
        if (!raw.length) throw new Error(`${spec.label}의 주사위 눈을 입력하세요.`);
        next = recordManualCharacterCreationRoll(next, spec, raw);
      }
      setError('');
      setManualValues({});
      onChange(next);
    } catch (caught) {
      setError(caught.message);
    }
  };

  return (
    <section className="cc-roll-panel" aria-label="주사위 기록">
      <div className="cc-roll-toolbar">
        <div className="cc-segmented cc-segmented-small" aria-label="주사위 입력 방식">
          <button type="button" className={mode === 'automatic' ? 'is-active' : ''} onClick={() => setMode('automatic')}>자동</button>
          <button type="button" className={mode === 'manual' ? 'is-active' : ''} onClick={() => setMode('manual')}>수동</button>
        </div>
        {mode === 'automatic' ? (
          <button type="button" className="cc-command cc-command-primary" onClick={handleAutomatic} disabled={!pending.length}>
            <Dices size={17} /> {pending.length ? `${pending.length}개 굴리기` : '주사위 완료'}
          </button>
        ) : (
          <button type="button" className="cc-command cc-command-primary" onClick={handleManual} disabled={!pending.length}>
            <Check size={17} /> 수동 눈 적용
          </button>
        )}
      </div>

      {mode === 'manual' && pending.length > 0 && (
        <div className="cc-manual-rolls">
          {pending.map(spec => (
            <label key={spec.key}>
              <span>{spec.label} <small>{spec.notation}</small></span>
              <input
                value={manualValues[spec.key] || ''}
                onChange={event => setManualValues(previous => ({ ...previous, [spec.key]: event.target.value }))}
                placeholder={spec.notation.startsWith('2d') ? '예: 4, 6' : spec.notation.startsWith('3d') ? '예: 2, 4, 5' : '예: 12'}
                inputMode="numeric"
              />
            </label>
          ))}
        </div>
      )}

      {error && <p className="cc-warning"><AlertTriangle size={15} /> {error}</p>}

      {stepRolls.length > 0 && (
        <details className="cc-roll-log" open={stepRolls.length <= 8}>
          <summary>주사위 기록 {stepRolls.length}건</summary>
          <div className="cc-roll-list">
            {stepRolls.map(entry => (
              <div key={entry.key}>
                <span>{entry.label}</span>
                <code>#{entry.rollIndex + 1} {entry.notation} [{entry.rawResult.join(', ')}] = {entry.modifiedResult}</code>
                {entry.tableResult && <strong>{entry.tableResult}</strong>}
              </div>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}

function ScoreRows({ values, labels = {}, className = '' }) {
  return (
    <div className={`cc-score-grid ${className}`}>
      {Object.entries(values || {}).map(([key, value]) => (
        <div key={key}>
          <span>{labels[key] || SOURCE_TRAIT_LABELS[key] || SOURCE_SKILL_LABELS[key] || key}</span>
          <strong>{displayValue(value)}</strong>
        </div>
      ))}
    </div>
  );
}

function CreationReview({ session }) {
  const draft = session.draftCharacter;
  const context = session.successorContext;
  return (
    <div className="cc-review">
      <section>
        <h4>인물과 가문</h4>
        <dl>
          <div><dt>이름</dt><dd>{draft.personal.name}</dd></div>
          <div><dt>나이</dt><dd>{draft.personal.age}</dd></div>
          <div><dt>문화</dt><dd>{draft.personal.culture}</dd></div>
          <div><dt>종교</dt><dd>{draft.personal.religion || '미정'}</dd></div>
          <div><dt>가문</dt><dd>{draft.family.name}</dd></div>
          <div><dt>부친</dt><dd>{draft.father?.label}</dd></div>
          <div><dt>Page 교육</dt><dd>{draft.pageEducation?.label}</dd></div>
          <div><dt>성인</dt><dd>{draft.family.patronSaint?.label}</dd></div>
        </dl>
      </section>
      <section>
        <h4>능력치와 파생값</h4>
        <ScoreRows values={Object.fromEntries(Object.entries(draft.attributes).filter(([key]) => key !== 'currentHp'))} labels={ATTRIBUTE_LABELS} />
        <ScoreRows values={draft.derived} />
      </section>
      <details open>
        <summary>Traits · Passions · Standings</summary>
        <div className="cc-review-columns">
          <ScoreRows values={draft.traits} />
          <ScoreRows values={draft.passions} labels={PASSION_LABELS} />
          <ScoreRows values={draft.standings} labels={STANDING_LABELS} />
        </div>
      </details>
      <details>
        <summary>Skills {Object.keys(draft.skills).length}개</summary>
        <ScoreRows values={draft.skills} />
      </details>
      <section>
        <h4>신분과 이상</h4>
        <p>{draft.qualification.notApplicable ? `${draft.personal.personalClass} · Frankish 기사 자격 절차 적용 안 함` : draft.qualification.qualified ? `${draft.personal.age}세에 기사 자격 충족` : '아직 기사 자격 미충족'}</p>
        <div className="cc-inline-list">
          {Object.values(draft.ideals).map(ideal => <span key={ideal.key}>{ideal.label}: {ideal.selected ? '선택' : ideal.eligible ? '자격 충족' : '미충족'}</span>)}
        </div>
      </section>
      <section>
        <h4>영광 · 장비 · 탄생 선물</h4>
        <p className="cc-stat-callout">초기 영광 <strong>{draft.gloryTotal}</strong></p>
        <p>{draft.usesInheritedEquipment ? `상속 장비 ${draft.inheritedEquipment.length}건` : `시작 장비 ${draft.outfit?.isCultureProfile ? draft.outfit.profileLabel : draft.outfit?.rank}: ${draft.outfit?.armor || ''}, ${Object.entries(draft.outfit?.horses || {}).map(([key, value]) => `${key} x${value}`).join(', ')}`}</p>
        <ul>{draft.gifts.entries.map(gift => <li key={gift.path}>{gift.label}</li>)}</ul>
        {draft.legacyBlessing && <p>성인의 축복: <strong>{draft.legacyBlessing.label}</strong> · {draft.legacyBlessing.effect}</p>}
      </section>
      {context && <section><h4>계승 문맥</h4><p>{context.successorMode === 'same_family' ? '같은 가문 정식 후계자' : context.successorMode === 'new_family' ? 'GM 승인 새 가문 캐릭터' : '일시적 행동 불능을 위한 두 번째 캐릭터'}</p>{draft.legacyApplication?.map(entry => <p key={entry.id}>{entry.id}: {entry.successorBefore} → {entry.successorAfter} (상한 {entry.cap})</p>)}</section>}
      {(session.unresolvedChoices.length > 0 || draft.rulebookDeviations.length > 0 || draft.manualOverrides.length > 0) && (
        <section className="cc-review-alerts">
          <h4>확인이 필요한 기록</h4>
          {session.unresolvedChoices.map(item => <p key={item.id}>{item.label}</p>)}
          {draft.rulebookDeviations.map(item => <p key={item.ruleId}>{item.ruleId}: {item.note}</p>)}
          {draft.manualOverrides.map((item, index) => <p key={`${item.reason}-${index}`}>{item.reason}</p>)}
        </section>
      )}
    </div>
  );
}

export default function CharacterCreationWizard({ character, setCharacter }) {
  const session = character.campaign?.characterCreationSession || null;
  const [seed, setSeed] = useState('paladin-767');
  const [startFamilyMode, setStartFamilyMode] = useState('new');
  const [notice, setNotice] = useState('');
  const [actionError, setActionError] = useState('');

  const persist = nextSession => {
    const persistedSession = JSON.parse(JSON.stringify(nextSession));
    const blessing = persistedSession.draftCharacter?.legacyBlessing;
    if (blessing && persistedSession.successorContext?.blessingGrant) {
      persistedSession.successorContext.blessingGrant.consumed = true;
      persistedSession.successorContext.blessingGrant.roll = blessing.roll;
      persistedSession.successorContext.blessingGrant.blessing = blessing;
    }
    setCharacter(previous => ({
      ...previous,
      campaign: {
        ...(previous.campaign || {}),
        schemaVersion: 12,
        characterCreationSession: persistedSession,
        lifecycle: blessing && previous.campaign?.lifecycle?.legacy?.blessingGrant ? {
          ...previous.campaign.lifecycle,
          legacy: {
            ...previous.campaign.lifecycle.legacy,
            blessingGrant: {
              ...previous.campaign.lifecycle.legacy.blessingGrant,
              consumed: true,
              roll: blessing.roll,
              blessing
            }
          }
        } : previous.campaign?.lifecycle
      }
    }));
  };

  const begin = () => {
    const next = createCharacterCreationSession({
      seed: seed.trim() || 'paladin-767',
      mode: 'core',
      existingFamily: startFamilyMode === 'reuse' ? character.family : null
    });
    persist(updateCharacterCreationChoice(next, 'familyMode', startFamilyMode, 'family'));
    setNotice('');
  };

  if (!session || ['not_started', 'abandoned'].includes(session.status)) {
    return (
      <div className="cc-start">
        <div className="cc-start-mark"><ScrollText size={28} /></div>
        <div>
          <span className="cc-kicker">{t('creation.chapter')}</span>
          <h4>767년, 아르덴의 새 연대기를 시작합니다</h4>
          <p>완료 전까지 현재 캐릭터는 바뀌지 않습니다. 모든 주사위와 선택은 자동 저장됩니다.</p>
        </div>
        <label className="cc-control cc-start-seed">
          <span>{t('creation.seed')}</span>
          <input value={seed} onChange={event => setSeed(event.target.value)} />
        </label>
        <SegmentedControl
          label="가문"
          value={startFamilyMode}
          options={[
            { value: 'new', label: '새 가문' },
            { value: 'reuse', label: '현재 가문 계승' }
          ]}
          onChange={setStartFamilyMode}
        />
        <button type="button" className="cc-command cc-command-primary cc-start-button" onClick={begin}>
          <ScrollText size={18} /> {t('creation.start')}
        </button>
      </div>
    );
  }

  const step = CHARACTER_CREATION_STEPS[session.currentStep];
  const [localizedStepTitle] = t(`creation.steps.${step.id}`);
  const state = session.stepStates[step.id];
  const draft = session.draftCharacter;
  const culture = getCulture(session.choices.cultureId);
  const frankish = isFrankishCulture(culture.id);
  const choice = (path, value, sourceStep = step.id) => persist(updateCharacterCreationChoice(session, path, value, sourceStep));
  const stepRollPanel = <RollPanel session={session} stepId={step.id} onChange={persist} />;

  const renderStep = () => {
    if (step.id === 'mode') return (
      <div className="cc-step-stack">
        <label className="cc-control">
          <span>문화</span>
          <select value={culture.id} onChange={event => choice('cultureId', event.target.value)}>
            {CHARACTER_CULTURES.map(entry => <option key={entry.id} value={entry.id}>{entry.displayName}</option>)}
          </select>
          <small>{culture.sourcePage} · {culture.permission === 'gm' ? 'GM 허가가 필요한 대체 출신' : '기본 플레이어 기사 문화'}</small>
        </label>
        {!frankish && (
          <label className="cc-check-row">
            <input type="checkbox" checked={session.choices.culturePermissionConfirmed === true} onChange={event => choice('culturePermissionConfirmed', event.target.checked)} />
            <span>Chapter 17의 “inspired game master may allow” 조건에 따라 GM이 이 대체 출신을 허가했습니다.</span>
          </label>
        )}
        <label className="cc-control">
          <span>{frankish ? '프랑크식 이름' : '원문 또는 GM 승인 이름'}</span>
          <input value={session.choices.name || ''} onChange={event => choice('name', event.target.value)} placeholder="예: Adalhart" />
          <small>{frankish ? '가문명이나 현대식 성은 붙이지 않습니다.' : 'Chapter 17의 이름 자료를 참고하되 앱은 이름을 창작하지 않습니다.'}</small>
        </label>
        <SegmentedControl label="성별" value={session.choices.gender} options={[{ value: 'male', label: '남성' }, { value: 'female', label: '여성 기사' }]} onChange={value => choice('gender', value)} />
        {session.choices.gender === 'female' && (
          <>
            <SegmentedControl
              label="여성 기사 생성 방식"
              value={session.choices.femaleGeneration}
              options={[
                { value: 'maleEquivalent', label: '남성과 같은 절차' },
                { value: 'femaleSpecific', label: '여성 전용 표', disabled: true, title: '여성 Son Number의 원문 적용 순서 확인이 필요합니다.' }
              ]}
              onChange={value => choice('femaleGeneration', value)}
            />
            <p className="cc-warning"><AlertTriangle size={15} /> 룰북 기반 여성 전용 표 생성은 아직 미완성입니다. 원문이 허용하는 남성과 같은 생성 절차는 완전하게 사용할 수 있습니다.</p>
          </>
        )}
        <div className="cc-source-facts">
          <span>{draft.personal.campaignYear}</span><span>{draft.personal.culture}</span><span>{draft.personal.homeland}</span><span>{draft.personal.religion || '종교 선택 대기'}</span><span>{culture.sourcePage}</span><span>{frankish ? '종자' : 'GM 신분 입력'}</span>
        </div>
      </div>
    );

    if (step.id === 'family') return (
      <div className="cc-step-stack">
        {session.successorContext ? <p className="cc-result-line"><strong>{session.successorContext.successorMode === 'new_family' ? 'GM 승인 새 가문' : '기존 가문 유지'}</strong><span>{session.successorContext.successorMode === 'new_family' ? '이전 가문의 수치와 유산을 적용하지 않습니다.' : '가문의 특징·수호성인·동원 기록을 다시 굴리지 않습니다.'}</span></p> : <SegmentedControl label="가문 방식" value={session.choices.familyMode} options={[{ value: 'new', label: '새 가문' }, { value: 'reuse', label: '현재 가문 계승' }]} onChange={value => choice('familyMode', value)} />}
        <div className="cc-form-grid">
          {[
            ['name', '가문 이름'], ['ancestor', '공통 조상'], ['homeCounty', '본향'], ['greatNoble', '백작 또는 공작 가문원'],
            ['motto', '가문 표어'], ['battleCry', '전투 함성']
          ].map(([key, label]) => (
            <label className="cc-control" key={key}><span>{label}</span><input value={session.choices.family?.[key] || ''} onChange={event => choice(`family.${key}`, event.target.value)} readOnly={Boolean(session.successorContext && session.successorContext.successorMode !== 'new_family')} /></label>
          ))}
          <label className="cc-control cc-wide"><span>Directed Traits</span><input value={session.choices.family?.directedTraits || ''} onChange={event => choice('family.directedTraits', event.target.value)} placeholder="선택 사항, 대상과 값을 함께 기록" /></label>
          <label className="cc-control cc-wide"><span>Directed Passions</span><input value={session.choices.family?.directedPassions || ''} onChange={event => choice('family.directedPassions', event.target.value)} placeholder="선택 사항, 대상과 값을 함께 기록" /></label>
        </div>
        {!frankish && (
          <>
            <p className="cc-warning"><AlertTriangle size={15} /> Chapter 17에는 이 문화를 위한 가족표가 없습니다. 아래 값은 문화 보정이 아니라 명시적인 GM/player 입력입니다.</p>
            <div className="cc-form-grid">
              <label className="cc-control"><span>가문 Honor</span><input type="number" min="0" max="20" value={session.choices.foreignFamilyHonor || 0} onChange={event => choice('foreignFamilyHonor', Number(event.target.value))} /></label>
              {Object.entries({ charlemagne: 'Charlemagne', church: 'Church', commoners: 'Commoners' }).map(([key, label]) => <label className="cc-control" key={key}><span>가문 Standing · {label}</span><input type="number" min="0" max="20" value={session.choices.foreignFamilyStandings?.[key] || 0} onChange={event => choice(`foreignFamilyStandings.${key}`, Number(event.target.value))} /></label>)}
            </div>
            <label className="cc-check-row"><input type="checkbox" checked={session.choices.foreignFamilyConfirmed === true} onChange={event => choice('foreignFamilyConfirmed', event.target.checked)} /><span>원문에 없는 외국 문화 가족표를 자동 생성하지 않고, 이 기록을 GM/player 입력으로 확정합니다.</span></label>
          </>
        )}
      </div>
    );

    if (!frankish && step.id === 'familyCharacteristic') return (
      <div className="cc-step-stack"><p className="cc-result-line"><strong>GM 입력 경계</strong><span>Chapter 17에는 이 문화를 위한 Family Characteristic 표나 수치가 없습니다. 문화 설명을 가문 보너스로 변환하지 않습니다.</span></p></div>
    );

    if (!frankish && step.id === 'saint') return (
      <div className="cc-step-stack"><p className="cc-result-line"><strong>수호성인 자동 배정 없음</strong><span>Chapter 1의 Frankish Patron Saint 표를 이 문화에 강제하지 않습니다. 종교 정체성은 Culture 단계에서 원문 선택지로 기록됩니다.</span></p></div>
    );

    if (step.id === 'familyCharacteristic') return (
      <div className="cc-step-stack">
        {stepRollPanel}
        {draft.family.characteristic && <p className="cc-result-line"><strong>{draft.family.characteristic.label}</strong><span>{JSON.stringify(draft.family.characteristic.effects || {})}</span></p>}
        {session.rolls['family.characteristic']?.modifiedResult === 19 && (
          <label className="cc-control"><span>Master tacticians</span><select value={session.choices.familyCharacteristicBattleSkill || ''} onChange={event => choice('familyCharacteristicBattleSkill', event.target.value)}><option value="">선택</option><option value="battle">Battle +5</option><option value="siege">Siege +5</option></select></label>
        )}
        {session.rolls['family.characteristic']?.modifiedResult === 20 && (
          <label className="cc-control"><span>Player&apos;s choice</span><select value={session.choices.familyCharacteristicChoice || ''} onChange={event => choice('familyCharacteristicChoice', event.target.value)}><option value="">선택</option>{FAMILY_CHARACTERISTICS_MALE.filter(item => !item.choice).map(item => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label>
        )}
      </div>
    );

    if (step.id === 'saint') return (
      <div className="cc-step-stack">
        {stepRollPanel}
        {draft.family.patronSaint && <p className="cc-result-line"><strong>{draft.family.patronSaint.label}</strong><span>{draft.family.patronSaint.patronage} · {JSON.stringify(draft.family.patronSaint.effects || {})}</span></p>}
        {session.rolls['family.saint']?.modifiedResult === 20 && (
          <label className="cc-control"><span>Player&apos;s choice</span><select value={session.choices.saintChoice || ''} onChange={event => choice('saintChoice', event.target.value)}><option value="">성인 선택</option>{PATRON_SAINTS.filter(item => !item.choice).map(item => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label>
        )}
      </div>
    );

    if (!frankish && step.id === 'father') return (
      <div className="cc-step-stack">
        <p className="cc-warning"><AlertTriangle size={15} /> Chapter 17에는 외국 문화용 부친 신분·생존·동원 표가 없습니다.</p>
        <label className="cc-control"><span>부친 또는 보호 가구의 신분</span><input value={session.choices.foreignFatherStatus || ''} onChange={event => choice('foreignFatherStatus', event.target.value)} placeholder="GM/player가 원문 맥락에 맞춰 기록" /></label>
        <p className="cc-result-line"><strong>{draft.father?.label || '입력 대기'}</strong><span>기술 점수, Glory, 탄생 선물, Outfit을 자동 추정하지 않습니다.</span></p>
      </div>
    );

    if (step.id === 'father') return (
      <div className="cc-step-stack">
        {stepRollPanel}
        {session.successorContext && session.successorContext.successorMode !== 'new_family' && <label className="cc-control"><span>생애 종료 또는 기사 서임 당시 부친 신분</span><select value={session.choices.successorFatherClass || ''} onChange={event => choice('successorFatherClass', event.target.value)}><option value="">원문 신분 선택</option><option value="lord">Lord</option>{FATHER_CLASSES.filter(item => item.key !== 'lordOfficer').map(item => <option key={item.key} value={item.key}>{item.label}</option>)}</select><small>기존 기록만으로 확정할 수 없어 사용자가 원문 신분을 확인합니다.</small></label>}
        <div className="cc-result-grid">
          <div><span>부친 신분</span><strong>{draft.father?.detail || draft.father?.label || '-'}</strong></div>
          <div><span>상태</span><strong>{draft.fatherSurvival?.label || '-'}</strong></div>
          <div><span>기술 점수</span><strong>{displayValue(draft.father?.skillPoints)}</strong></div>
          <div><span>기본 Glory</span><strong>{displayValue(draft.father?.glory)}</strong></div>
          <div><span>탄생 선물</span><strong>{displayValue(draft.father?.giftRolls)}회</strong></div>
          <div><span>기본 Outfit</span><strong>{displayValue(draft.father?.outfit)}</strong></div>
        </div>
        {draft.father?.key === 'lord' && (
          <label className="cc-control"><span>Lord 세부 신분</span><select value={session.choices.lordType || ''} onChange={event => choice('lordType', event.target.value)}><option value="">선택</option>{['Count', 'Duke', 'Lay Bishop', 'Lay Abbot'].map(item => <option key={item}>{item}</option>)}</select></label>
        )}
        {draft.father?.choice === 'mercenaryMelee' && (
          <label className="cc-control"><span>추가 근접 무기 +3</span><select value={session.choices.mercenaryMelee || ''} onChange={event => choice('mercenaryMelee', event.target.value)}><option value="">선택</option>{MELEE_WEAPON_SKILLS.filter(key => key !== 'sword').map(key => <option key={key} value={key}>{SOURCE_SKILL_LABELS[key]}</option>)}</select></label>
        )}
        <h4 className="cc-subheading">가문 소집</h4>
        <ScoreRows values={draft.family.muster} />
      </div>
    );

    if (!frankish && step.id === 'sonNumber') return (
      <div className="cc-step-stack"><label className="cc-control"><span>가족 내 출생 순서</span><input type="number" min="1" max="20" value={session.choices.foreignSonNumber || 1} onChange={event => choice('foreignSonNumber', Number(event.target.value))} /><small>외국 문화용 출생 순서 표가 없으므로 GM/player가 기록합니다.</small></label></div>
    );

    if (step.id === 'sonNumber') return (
      <div className="cc-step-stack">
        <SegmentedControl label="출생 순서" value={session.choices.sonNumberMethod} options={[{ value: 'first', label: '첫째로 기록' }, { value: 'roll', label: '부친 신분에 따라 굴림' }]} onChange={value => choice('sonNumberMethod', value)} />
        {session.choices.sonNumberMethod === 'roll' && stepRollPanel}
        <p className="cc-stat-callout">Son Number <strong>{displayValue(draft.personal.sonNumber)}</strong></p>
      </div>
    );

    if (!frankish && step.id === 'pageEducation') return (
      <div className="cc-step-stack"><label className="cc-control"><span>교육 또는 성장 배경</span><input value={session.choices.foreignEducation || ''} onChange={event => choice('foreignEducation', event.target.value)} placeholder="예: 가문 전사단에서 성장 · GM/player 기록" /><small>Chapter 1의 Frankish Page Education 표를 자동 적용하지 않습니다.</small></label></div>
    );

    if (step.id === 'pageEducation') return (
      <div className="cc-step-stack">
        <SegmentedControl label="교육 결정" value={session.choices.pageEducationMethod} options={[{ value: 'roll', label: 'Table 1-7 굴림' }, { value: 'fatherCourt', label: '부친 궁정 자동 교육' }]} onChange={value => choice('pageEducationMethod', value)} />
        {session.choices.pageEducationMethod === 'fatherCourt' && (['Lay Bishop', 'Lay Abbot'].includes(draft.father?.detail) || draft.father?.officerPatron === 'Lay Bishop or Lay Abbot') && (
          <label className="cc-control"><span>수도원 유형</span><select value={session.choices.pageAutomaticChoice || ''} onChange={event => choice('pageAutomaticChoice', event.target.value)}><option value="">선택</option><option value="greatMonastery">Great monastery</option><option value="smallMonastery">Small monastery</option></select></label>
        )}
        {session.choices.pageEducationMethod === 'roll' && stepRollPanel}
        {draft.pageEducation && <p className="cc-result-line"><strong>{draft.pageEducation.label}</strong><span>{draft.pageEducation.automatic ? '부친 신분에 따른 자동 교육' : `${draft.pageEducation.rawRoll} + ${draft.pageEducation.modifier} = ${draft.pageEducation.modifiedRoll}`} · Glory +{draft.pageEducation.glory}</span></p>}
      </div>
    );

    if (!frankish && step.id === 'cultureHomeland') {
      const selectedProfile = getCultureEquipmentProfile(culture.id, session.choices.cultureEquipmentProfileId);
      const equipmentChoices = getCultureEquipmentChoiceRequests(culture.id, selectedProfile?.id);
      const setEquipmentChoice = (requestId, value) => choice('cultureEquipmentChoices', { ...(session.choices.cultureEquipmentChoices || {}), [requestId]: value });
      return (
        <div className="cc-step-stack">
          <p className="cc-result-line"><strong>{culture.printedName}</strong><span>{culture.sourcePage} · Table 17-1은 기본 Statistics만 수치화합니다.</span></p>
          <div className="cc-form-grid">
            <label className="cc-control"><span>문화권 / 본향</span><input value={session.choices.cultureHomeland || ''} onChange={event => choice('cultureHomeland', event.target.value)} /></label>
            <label className="cc-control"><span>구체적인 거처</span><input value={session.choices.foreignHome || ''} onChange={event => choice('foreignHome', event.target.value)} placeholder="GM/player 입력" /></label>
            <label className="cc-control"><span>주군 또는 정치적 관계</span><input value={session.choices.foreignLiegeLord || ''} onChange={event => choice('foreignLiegeLord', event.target.value)} placeholder="원문이 정하지 않으면 비워둘 수 있음" /></label>
            <label className="cc-control"><span>종교</span><select value={session.choices.religionId || ''} onChange={event => choice('religionId', event.target.value)}><option value="">선택</option>{culture.religionOptions.map(id => <option key={id} value={id}>{CHAPTER17_RELIGIONS[id].label}</option>)}</select></label>
            <label className="cc-control cc-wide"><span>인쇄된 장비 역할</span><select value={session.choices.cultureEquipmentProfileId || ''} onChange={event => choice('cultureEquipmentProfileId', event.target.value)}><option value="">선택</option>{culture.equipmentProfiles.map(profile => <option key={profile.id} value={profile.id}>{profile.label} · p.{profile.sourcePage}</option>)}</select></label>
          </div>
          {culture.religionNote && <p className="cc-warning"><AlertTriangle size={15} /> {culture.religionNote}</p>}
          {selectedProfile && <p className="cc-result-line"><strong>{selectedProfile.label}</strong><span>{selectedProfile.sourceText}</span></p>}
          {equipmentChoices.length > 0 && <div className="cc-form-grid">{equipmentChoices.map(request => <label className="cc-control" key={request.id}><span>원문 장비 선택 · {request.group}</span><select value={session.choices.cultureEquipmentChoices?.[request.id] || ''} onChange={event => setEquipmentChoice(request.id, event.target.value)}><option value="">선택</option>{request.options.map(id => <option key={id} value={id}>{marketLabel(id)}</option>)}</select></label>)}</div>}
          <div className="cc-modifier-list">
            {Object.entries(culture.attributeModifiers).map(([key, amount]) => <div key={key}><span>Table 17-1 · {key.toUpperCase()}</span><code>{amount >= 0 ? '+' : ''}{amount}</code></div>)}
          </div>
          <label className="cc-check-row"><input type="checkbox" checked={session.choices.foreignScoreAssignmentConfirmed === true} onChange={event => choice('foreignScoreAssignmentConfirmed', event.target.checked)} /><span>성격·열정·Standing·Skill은 문화 설명에서 수치화하지 않고, 이후 단계의 값을 GM이 직접 승인합니다.</span></label>
        </div>
      );
    }

    if (step.id === 'cultureHomeland') return (
      <div className="cc-step-stack">
        {stepRollPanel}
        <div className="cc-source-facts"><span>Frankish</span><span>Ardennes</span><span>Christian</span></div>
        <div className="cc-modifier-list">
          {session.modifierLog.filter(entry => entry.stepId === 'cultureHomeland').map((entry, index) => <div key={`${entry.targetKey}-${index}`}><span>{entry.sourceLabel} · {entry.targetKey}</span><code>{entry.before} {entry.amount >= 0 ? '+' : ''}{entry.amount} = {entry.after}</code></div>)}
        </div>
      </div>
    );

    if (step.id === 'attributes') return (
      <div className="cc-step-stack">
        {stepRollPanel}
        <div className="cc-attribute-table">
          {Object.keys(ATTRIBUTE_LABELS).map(key => (
            <label key={key}>
              <span>{ATTRIBUTE_LABELS[key]}</span>
              <em>{session.rolls[`attribute.${key}`]?.modifiedResult ?? '-'}</em>
              <input type="number" min="0" max="3" value={session.choices.attributeBonuses?.[key] || 0} onChange={event => choice(`attributeBonuses.${key}`, Number(event.target.value))} />
              <strong>{draft.attributes[key]}</strong>
            </label>
          ))}
        </div>
        <p className="cc-allocation-status">배분 {Object.values(session.choices.attributeBonuses || {}).reduce((total, value) => total + Number(value || 0), 0)} / 5</p>
        <ScoreRows values={draft.derived} />
      </div>
    );

    if (step.id === 'feature') return (
      <div className="cc-step-stack">
        <SegmentedControl label="특징 범주" value={session.choices.featureMode} options={[{ value: 'roll', label: '1d6 굴림' }, { value: 'choose', label: '직접 선택' }]} onChange={value => choice('featureMode', value)} />
        {session.choices.featureMode === 'roll' ? stepRollPanel : (
          <label className="cc-control"><span>원문 범주</span><select value={session.choices.featureCategory || ''} onChange={event => choice('featureCategory', event.target.value)}><option value="">선택</option>{DISTINCTIVE_FEATURES.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label>
        )}
        <label className="cc-control"><span>사용자 확장 묘사</span><input value={session.choices.featureText || ''} onChange={event => choice('featureText', event.target.value)} placeholder="원문 범주와 별도로 저장됩니다" /></label>
        {draft.distinctiveFeature && <p className="cc-result-line"><strong>{draft.distinctiveFeature.sourceText}</strong><span>{draft.distinctiveFeature.userText || '확장 묘사 없음'}</span></p>}
      </div>
    );

    if (step.id === 'traits') return (
      <div className="cc-step-stack">
        {frankish ? stepRollPanel : <p className="cc-warning"><AlertTriangle size={15} /> 괄호 안의 성향 언급은 수치 보너스가 아닙니다. GM이 각 대립쌍의 왼쪽 값을 정하면 오른쪽은 합계 20으로 기록됩니다.</p>}
        <div className="cc-trait-pairs">
          {TRAIT_PAIRS.map(([left, right]) => <div key={left}><span>{SOURCE_TRAIT_LABELS[left]}</span>{frankish ? <strong>{draft.traits[left]}</strong> : <input aria-label={SOURCE_TRAIT_LABELS[left]} type="number" min="0" max="20" value={session.choices.foreignTraits?.[left] ?? 10} onChange={event => choice(`foreignTraits.${left}`, Number(event.target.value))} />}<i>/</i><strong>{draft.traits[right]}</strong><span>{SOURCE_TRAIT_LABELS[right]}</span></div>)}
        </div>
      </div>
    );

    if (step.id === 'passions') return (
      <div className="cc-step-stack">
        {frankish ? stepRollPanel : <p className="cc-warning"><AlertTriangle size={15} /> Chapter 17은 문화별 Passion 점수를 주지 않습니다. 관련되지 않는 Passion은 0으로 두고 GM이 필요한 값만 배정합니다.</p>}
        <div className="cc-formula-list">
          {Object.entries(draft.passions).map(([key, value]) => <div key={key}><span>{PASSION_LABELS[key]}</span>{frankish ? <strong>{value}</strong> : <input aria-label={PASSION_LABELS[key]} type="number" min="0" max="20" value={session.choices.foreignPassions?.[key] || 0} onChange={event => choice(`foreignPassions.${key}`, Number(event.target.value))} />}<small>{draft.passionCalculations[key]}</small></div>)}
        </div>
      </div>
    );

    if (step.id === 'standings') return (
      <div className="cc-step-stack">
        {!frankish && <p className="cc-warning"><AlertTriangle size={15} /> Frankish Standing 공식을 강제하지 않습니다. 캠페인 시작 관계를 GM이 직접 배정합니다.</p>}
        <div className="cc-formula-list">
          {Object.entries(draft.standings).map(([key, value]) => <div key={key}><span>{STANDING_LABELS[key]}</span>{frankish ? <strong>{value}</strong> : <input aria-label={STANDING_LABELS[key]} type="number" min="0" max="20" value={session.choices.foreignStandings?.[key] || 0} onChange={event => choice(`foreignStandings.${key}`, Number(event.target.value))} />}<small>{frankish ? key === 'charlemagne' ? 'Lowest Chivalrous trait' : key === 'liegeLord' ? 'Valorous' : key === 'family' ? 'Honor' : key === 'retinue' ? 'Generous' : key === 'church' ? 'Love [God]' : 'Merciful' : 'GM assigned · Chapter 17 unquantified'}</small></div>)}
        </div>
      </div>
    );

    if (step.id === 'skills') return (
      <div className="cc-step-stack">
        {frankish ? stepRollPanel : <p className="cc-warning"><AlertTriangle size={15} /> Chapter 17의 Skill 명칭은 문화적 경향을 설명할 뿐 수치 보너스가 아닙니다. GM이 canonical Skill 값을 직접 배정합니다.</p>}
        {frankish && <div className="cc-allocation-status"><span>부친 신분 기술 점수</span><strong>{draft.skillTrainingSummary.allocated} / {draft.skillTrainingSummary.available}</strong><em>남은 점수 {draft.skillTrainingSummary.remaining}</em></div>}
        {Object.entries(SKILL_CATEGORIES).map(([category, keys], categoryIndex) => (
          <details className="cc-skill-group" key={category} open={categoryIndex === 0}>
            <summary>{category === 'common' ? 'Ordinary Skills' : category === 'courtly' ? 'Courtly Skills' : 'Combat Skills'}</summary>
            <div>
              {keys.map(key => (
                <label key={key}>
                  <span>{SOURCE_SKILL_LABELS[key]}</span>
                  {frankish ? <><em>{draft.skillsBeforeTraining[key]}</em><input type="number" min="0" max={Math.max(0, 15 - Number(draft.skillsBeforeTraining[key] || 0))} value={session.choices.skillTraining?.[key] || 0} onChange={event => choice(`skillTraining.${key}`, Number(event.target.value))} disabled={draft.skillsBeforeTraining[key] === 0} /><strong>{draft.skills[key]}</strong></> : <><em>GM</em><input type="number" min="0" max="20" value={session.choices.foreignSkills?.[key] || 0} onChange={event => choice(`foreignSkills.${key}`, Number(event.target.value))} /><strong>{draft.skills[key]}</strong></>}
                </label>
              ))}
            </div>
          </details>
        ))}
      </div>
    );

    if (step.id === 'squireYears') {
      if (!frankish) return (
        <div className="cc-step-stack">
          <p className="cc-warning"><AlertTriangle size={15} /> Frankish Squire Years와 자동 기사 서임 1,000 Glory를 적용하지 않습니다. 원문의 문화적 신분과 선택한 장비 역할을 GM이 기록합니다.</p>
          <div className="cc-form-grid">
            <label className="cc-control"><span>생성 완료 나이</span><input type="number" min="15" max="60" value={session.choices.foreignStartingAge || 18} onChange={event => choice('foreignStartingAge', Number(event.target.value))} /></label>
            <label className="cc-control"><span>사회적 / 군사적 신분</span><input value={session.choices.foreignStatusLabel || ''} onChange={event => choice('foreignStatusLabel', event.target.value)} placeholder={draft.outfit?.profileLabel || 'GM/player 입력'} /></label>
          </div>
          <p className="cc-result-line"><strong>{culture.statusPolicy.replaceAll('_', ' ')}</strong><span>{draft.qualification.note}</span></p>
        </div>
      );
      const plan = session.choices.squireYearDraft || { categories: [], attributeKey: '', scoreGroup: 'traits', scoreKey: '', skills: { common: '', courtly: '', combat: '', free: '' } };
      const toggleCategory = key => choice('squireYearDraft.categories', plan.categories.includes(key) ? plan.categories.filter(item => item !== key) : [...plan.categories, key]);
      const addYear = () => {
        const result = addCharacterCreationSquireYear(session, plan);
        setActionError(result.error || '');
        if (result.added) persist(updateCharacterCreationChoice(result.session, 'squireYearDraft', { categories: [], attributeKey: '', scoreGroup: 'traits', scoreKey: '', skills: { common: '', courtly: '', combat: '', free: '' } }, 'squireYears'));
      };
      return (
        <div className="cc-step-stack">
          <div className={`cc-qualification ${draft.qualification.qualified ? 'is-qualified' : ''}`}><ShieldCheck size={22} /><div><strong>{draft.qualification.qualified ? `${draft.personal.age}세 기사 자격 충족` : `${draft.personal.age}세, 아직 종자`}</strong><span>조건을 충족하는 즉시 기사 서임 절차가 멈춥니다.</span></div></div>
          <div className="cc-requirements">{draft.qualification.requirements.map(item => <div key={item.key} className={item.met ? 'is-met' : ''}>{item.met ? <CircleCheck size={15} /> : <CircleDashed size={15} />}<span>{item.label}</span></div>)}</div>
          {!draft.qualification.qualified && (
            <section className="cc-squire-form">
              <h4>다음 한 해의 서로 다른 혜택 2개</h4>
              <div className="cc-benefit-types">
                {['attribute', 'score', 'skills'].map(key => <label key={key}><input type="checkbox" checked={plan.categories.includes(key)} onChange={() => toggleCategory(key)} />{key === 'attribute' ? 'Attribute +1' : key === 'score' ? 'Trait / Passion / Standing +1' : '네 종류 Skill +1'}</label>)}
              </div>
              {plan.categories.includes('attribute') && <label className="cc-control"><span>Attribute</span><select value={plan.attributeKey} onChange={event => choice('squireYearDraft.attributeKey', event.target.value)}><option value="">선택</option>{Object.keys(ATTRIBUTE_LABELS).map(key => <option key={key} value={key}>{ATTRIBUTE_LABELS[key]}</option>)}</select></label>}
              {plan.categories.includes('score') && <div className="cc-form-grid"><label className="cc-control"><span>종류</span><select value={plan.scoreGroup} onChange={event => choice('squireYearDraft.scoreGroup', event.target.value)}>{Object.entries(SCORE_GROUP_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label className="cc-control"><span>항목</span><select value={plan.scoreKey} onChange={event => choice('squireYearDraft.scoreKey', event.target.value)}><option value="">선택</option>{Object.keys(draft[plan.scoreGroup] || {}).map(key => <option key={key} value={key}>{SOURCE_TRAIT_LABELS[key] || PASSION_LABELS[key] || STANDING_LABELS[key] || key}</option>)}</select></label></div>}
              {plan.categories.includes('skills') && <div className="cc-form-grid">{['common', 'courtly', 'combat', 'free'].map(type => <label className="cc-control" key={type}><span>{type}</span><select value={plan.skills[type] || ''} onChange={event => choice(`squireYearDraft.skills.${type}`, event.target.value)}><option value="">선택</option>{(type === 'free' ? Object.keys(draft.skills) : SKILL_CATEGORIES[type]).map(key => <option key={key} value={key}>{SOURCE_SKILL_LABELS[key]}</option>)}</select></label>)}</div>}
              {actionError && <p className="cc-warning"><AlertTriangle size={15} /> {actionError}</p>}
              <button type="button" className="cc-command cc-command-primary" onClick={addYear}>한 해 적용</button>
            </section>
          )}
          {draft.squireYearHistory.length > 0 && <div className="cc-year-log">{draft.squireYearHistory.map(year => <div key={year.age}><strong>{year.year}</strong><span>{year.age}세 · {year.categories.join(' + ')}</span><em>{year.qualification.qualified ? '자격 충족' : '계속 수련'}</em></div>)}<button type="button" className="cc-command" onClick={() => persist(removeLastCharacterCreationSquireYear(session))}><RotateCcw size={16} /> 마지막 연차 취소</button></div>}
        </div>
      );
    }

    if (step.id === 'ideals') return (
      <div className="cc-step-stack">
        <label className="cc-control"><span>Romantic 판정을 위한 Amor 또는 Love 값</span><input type="number" min="0" value={session.choices.romanticPassionValue || 0} onChange={event => choice('romanticPassionValue', Number(event.target.value))} /></label>
        <div className="cc-ideal-list">
          {Object.values(draft.ideals).map(ideal => (
            <label key={ideal.key} className={ideal.eligible ? 'is-eligible' : ''}>
              <input type="checkbox" checked={(session.choices.selectedIdeals || []).includes(ideal.key)} disabled={!ideal.eligible} onChange={event => choice('selectedIdeals', event.target.checked ? [...(session.choices.selectedIdeals || []), ideal.key] : (session.choices.selectedIdeals || []).filter(key => key !== ideal.key))} />
              <span><strong>{ideal.label}</strong><small>Trait 합 {ideal.traitTotal} / 90 · {ideal.passion} {ideal.passionValue} / 16</small></span>
            </label>
          ))}
        </div>
      </div>
    );

    if (step.id === 'glory') return (
      <div className="cc-step-stack">
        {frankish && session.successorContext?.successorMode !== 'same_family' && <SegmentedControl label="부친 영광 출처" value={session.choices.glorySource} options={[{ value: 'fatherClass', label: '표 1-4/1-5' }, { value: 'fatherHistory', label: '부친 역사 1/10' }]} onChange={value => choice('glorySource', value)} />}
        {frankish && session.successorContext?.successorMode !== 'same_family' && session.choices.glorySource === 'fatherHistory' && <label className="cc-control"><span>부친 최종 영광</span><input type="number" min="0" value={session.choices.fatherHistoryGlory || 0} onChange={event => choice('fatherHistoryGlory', Number(event.target.value))} /></label>}
        {frankish && session.successorContext?.successorMode === 'same_family' && <p className="cc-result-line"><strong>전임자 영광의 1/10</strong><span>{session.successorContext.predecessor?.gear?.gloryTotal || 0} ÷ 10, Paladin 반올림</span></p>}
        {!frankish && <><p className="cc-warning"><AlertTriangle size={15} /> Chapter 17은 시작 Glory를 수치화하지 않습니다.</p><label className="cc-control"><span>GM 배정 시작 Glory</span><input type="number" min="0" value={session.choices.foreignInitialGlory || 0} onChange={event => choice('foreignInitialGlory', Number(event.target.value))} /></label><label className="cc-check-row"><input type="checkbox" checked={session.choices.foreignGloryConfirmed === true} onChange={event => choice('foreignGloryConfirmed', event.target.checked)} /><span>이 수치는 원문 자동 보상이 아니라 GM 입력임을 확인합니다.</span></label></>}
        <p className="cc-stat-callout">초기 영광 <strong>{draft.gloryTotal}</strong></p>
        <div className="cc-ledger">{draft.gloryLedger.map((entry, index) => <div key={`${entry.sourceLabel}-${index}`}><span>{entry.sourceLabel}<small>{entry.calculation}</small></span><strong>+{entry.amount}</strong></div>)}</div>
      </div>
    );

    if (step.id === 'outfit') return (
      <div className="cc-step-stack">
        {draft.inheritedEquipment?.length > 0 && <SegmentedControl label="장비 획득 방식" value={session.choices.inheritEquipmentInsteadOfOutfit === null ? '' : String(session.choices.inheritEquipmentInsteadOfOutfit)} options={[{ value: 'false', label: '표 1-14 시작 장비' }, { value: 'true', label: '선택한 상속 장비' }]} onChange={value => choice('inheritEquipmentInsteadOfOutfit', value === 'true')} />}
        <p className="cc-stat-callout">{draft.usesInheritedEquipment ? '상속 장비' : '시작 장비'} <strong>{draft.usesInheritedEquipment ? `${draft.inheritedEquipment.length}건` : draft.outfit?.isCultureProfile ? draft.outfit.profileLabel : draft.outfit?.rank || '-'}</strong></p>
        {draft.usesInheritedEquipment && <ul className="cc-plain-list">{draft.inheritedEquipment.map(item => <li key={item.id}>{item.category} · {item.key}</li>)}</ul>}
        {draft.outfit && <><div className="cc-result-grid"><div><span>Armor</span><strong>{draft.outfit.armor}</strong></div><div><span>Shields</span><strong>{draft.outfit.shields}</strong></div><div><span>Squires</span><strong>{draft.outfit.squires}</strong></div><div><span>Clothes</span><strong>{draft.outfit.clothes}</strong></div><div><span>Coin</span><strong>£{draft.outfit.cash}</strong></div><div><span>Son penalty</span><strong>{draft.outfit.sonPenalty ? '-1' : '0'}</strong></div></div><h4 className="cc-subheading">말</h4><ScoreRows values={draft.outfit.horses} /><h4 className="cc-subheading">무기</h4><ul className="cc-plain-list">{draft.outfit.weapons.map(item => <li key={item}>{item}</li>)}</ul></>}
      </div>
    );

    if (!frankish && step.id === 'birthGift') return (
      <div className="cc-step-stack"><p className="cc-result-line"><strong>Frankish Birth Gift 적용 안 함</strong><span>Chapter 17은 이 문화에 대한 대체 탄생 선물 표를 제공하지 않습니다. 새 표나 보상을 만들지 않습니다.</span></p></div>
    );

    if (step.id === 'birthGift') {
      const updateMap = (mapKey, path, value) => choice(mapKey, { ...(session.choices[mapKey] || {}), [path]: value });
      const giftChoicePaths = session.unresolvedChoices.filter(item => item.id.startsWith('gift-choice-')).map(item => item.id.replace('gift-choice-', ''));
      const relicPaths = session.unresolvedChoices.filter(item => item.id.startsWith('gift-relic-')).map(item => item.id.replace('gift-relic-', ''));
      const weaponPaths = session.unresolvedChoices.filter(item => item.id.startsWith('gift-weapon-')).map(item => item.id.replace('gift-weapon-', ''));
      return (
        <div className="cc-step-stack">
          {stepRollPanel}
          {giftChoicePaths.map(path => <label className="cc-control" key={path}><span>{path} Player&apos;s choice</span><select value={session.choices.birthGiftChoices?.[path] || ''} onChange={event => updateMap('birthGiftChoices', path, Number(event.target.value))}><option value="">선택</option>{BIRTH_GIFTS.filter(item => item.range[0] <= 19).map(item => <option key={item.key} value={item.range[0]}>{item.label}</option>)}</select></label>)}
          {relicPaths.map(path => <label className="cc-control" key={path}><span>{path} Religious trait +2</span><select value={session.choices.relicTraits?.[path] || ''} onChange={event => updateMap('relicTraits', path, event.target.value)}><option value="">선택</option>{RELIGIOUS_TRAITS.map(key => <option key={key} value={key}>{SOURCE_TRAIT_LABELS[key]}</option>)}</select></label>)}
          {weaponPaths.map(path => <label className="cc-control" key={path}><span>{path} Exceptional weapon</span><select value={session.choices.exceptionalWeapons?.[path] || ''} onChange={event => updateMap('exceptionalWeapons', path, event.target.value)}><option value="">선택</option>{MELEE_WEAPON_SKILLS.map(key => <option key={key} value={key}>{SOURCE_SKILL_LABELS[key]} {key === 'sword' ? '+1' : '+3'}</option>)}</select></label>)}
          <div className="cc-gift-list">{draft.gifts.entries.map(gift => <div key={gift.path}><span>{gift.path} · d20 {gift.roll}</span><strong>{gift.label}</strong><small>{gift.religiousTrait ? `${SOURCE_TRAIT_LABELS[gift.religiousTrait]} +2` : gift.weapon ? `${SOURCE_SKILL_LABELS[gift.weapon]} ${gift.weapon === 'sword' ? '+1' : '+3'}` : gift.conditionalModifier ? `${SOURCE_SKILL_LABELS[gift.conditionalModifier.skill]} +${gift.conditionalModifier.amount}, ${gift.conditionalModifier.condition}` : ''}</small></div>)}</div>
          {draft.legacyBlessing && <p className="cc-result-line"><strong>성인의 축복: {draft.legacyBlessing.label}</strong><span>d20 {draft.legacyBlessing.roll} · {draft.legacyBlessing.effect} · grant 사용 완료</span></p>}
        </div>
      );
    }

    return (
      <div className="cc-step-stack">
        <label className="cc-control"><span>연대기 첫 기록</span><textarea rows="5" value={session.choices.story || ''} onChange={event => choice('story', event.target.value)} placeholder="인물의 가족, 교육, 두드러진 성향과 기사 서임 준비를 기록하세요." /></label>
        <CreationReview session={session} />
      </div>
    );
  };

  const complete = () => {
    const result = completeCharacterCreation(character, session);
    if (!result.completed) {
      setNotice(result.duplicate ? '이미 완료된 생성 기록입니다.' : result.issues.join(' '));
      return;
    }
    setCharacter(result.character);
    setNotice('캐릭터 시트, 가계도, 저널, 캠페인 상태가 함께 갱신되었습니다.');
  };

  const completedSteps = CHARACTER_CREATION_STEPS.filter(item => session.stepStates[item.id]?.resolved).length;
  const progress = Math.round((completedSteps / CHARACTER_CREATION_STEPS.length) * 100);

  return (
    <div className="cc-wizard">
      <header className="cc-wizard-header">
        <div>
          <span className="cc-kicker">{t('creation.chapter')}</span>
          <h4>{localizedStepTitle}</h4>
          <p>{step.ruleIds.join(' · ')} · PDF {step.pages}</p>
        </div>
        <div className="cc-save-state"><Save size={15} /><span>{t('common.automaticSave')}</span><strong>{session.status === 'awaiting_choice' ? '선택 대기' : session.status === 'completed' ? t('common.completed') : t('common.inProgress')}</strong></div>
      </header>

      <div className="cc-progress" aria-label={t('common.progress', { current: progress })}><span style={{ width: `${progress}%` }} /></div>

      <div className="cc-layout">
        <nav className="cc-step-nav" aria-label="캐릭터 생성 단계">
          {CHARACTER_CREATION_STEPS.map((item, index) => {
            const resolved = session.stepStates[item.id]?.resolved;
            const disabled = index > session.maxUnlockedStep && index !== session.currentStep;
            return (
              <button key={item.id} type="button" className={`${index === session.currentStep ? 'is-current' : ''} ${resolved ? 'is-complete' : ''}`} onClick={() => persist(goToCharacterCreationStep(session, index))} disabled={disabled} title={`${index + 1}. ${t(`creation.steps.${item.id}`)[0]}`}>
                <span>{index + 1}</span><em>{t(`creation.steps.${item.id}`)[1]}</em>{resolved ? <CircleCheck size={14} /> : <CircleDashed size={14} />}
              </button>
            );
          })}
        </nav>

        <main className="cc-step-main">
          {renderStep()}
          <RuleDisclosure step={step} session={session} />
          {!state.canAdvance && state.issues.length > 0 && (
            <div className="cc-issues" role="status"><AlertTriangle size={17} /><div><strong>다음 단계 전 확인</strong>{state.issues.slice(0, 5).map(issue => <p key={issue}>{issue}</p>)}</div></div>
          )}
          {notice && <p className="cc-notice"><CircleCheck size={16} /> {notice}</p>}
        </main>
      </div>

      <footer className="cc-wizard-footer">
        <button type="button" className="cc-icon-command" onClick={() => persist(retreatCharacterCreationStep(session))} disabled={session.currentStep === 0} title="이전 단계"><ChevronLeft size={20} /><span>{t('common.previous')}</span></button>
        <div><FileClock size={15} /><span>시드 {session.seed}</span><span>주사위 #{session.rollIndex}</span><span>미해결 {session.unresolvedChoices.length}</span></div>
        {step.id === 'review' ? (
          <button type="button" className="cc-command cc-command-primary" onClick={complete} disabled={!state.canAdvance || session.status === 'completed'}><Check size={18} /> {session.status === 'completed' ? t('creation.creationComplete') : t('creation.finalize')}</button>
        ) : (
          <button type="button" className="cc-command cc-command-primary" onClick={() => persist(advanceCharacterCreationStep(session))} disabled={!state.canAdvance}>{t('common.next')} <ChevronRight size={18} /></button>
        )}
      </footer>
    </div>
  );
}

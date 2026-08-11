import { useMemo, useState } from 'react';
import { BookOpenCheck, Check, Compass, Crown, Dices, Landmark, Route, Scale, ShieldCheck } from 'lucide-react';
import { FolioHeading, SectionHeader, StatusSeal } from '../../components/ui/LedgerUI';
import { MARKET_CATALOG } from '../../rules/economyRules';
import {
  CAREER_ROLES,
  applyAnnualCareerBenefits,
  acknowledgeChronologyRules,
  activateIdeal,
  appointCareer,
  getCareerEligibility,
  getChronologyRulesForYear,
  recordChivalricCombatSettlement,
  recordChivalricSiegeSettlement,
  recordPrintedGlorySource,
  recordRomanticIdealDuty,
  recordSourcedStandingChange,
  recordStandingGift,
  resolveFeatProcedure,
  resolveJourneyDay,
  resolveSkillProcedure,
  retireCareer,
  sanitizeRulebookProcedureState,
  startJourney
} from '../../rules/rulebookProcedureRules';

const Field = ({ label, children }) => <label className="procedure-field"><span>{label}</span>{children}</label>;

const SKILLS = [
  ['swimming', 'Swimming'], ['hunting', 'Hunting'], ['falconry', 'Falconry'], ['gaming', 'Gaming'],
  ['heraldry', 'Heraldry'], ['recognize', 'Recognize'], ['courtesy', 'Courtesy'], ['dancing', 'Dancing'],
  ['eloquence', 'Eloquence'], ['languages', 'Languages'], ['readingWriting', 'Reading & Writing']
];

export default function RulebookProcedures({ character, setCharacter }) {
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [skill, setSkill] = useState({ skillId: 'swimming', roll: '', armor: 0, encumbrance: 'none', modifier: 0, targetGlory: 0, opponentRoll: '', opponentValue: '', languageRoll: '', languageValue: '', hasDogs: true, gmAllowsGloryModifier: false, languageDifficulty: 'none' });
  const [feat, setFeat] = useState({ statistic: character.attributes?.dex || 10, roll: '', gmApproved: false, note: '' });
  const [journey, setJourney] = useState({ destination: '', distance: '', roadType: 'localRoad', pace: 'normal', routeKnown: true });
  const [journeyDay, setJourneyDay] = useState({ huntingRoll: '', conRoll: '', movementRate: 6, traveler: 'human' });
  const [career, setCareer] = useState({ roleId: 'knight', sponsorIds: '', oathRecorded: false, companionId: '', companionGlory: 0, companionHonor: 0, hasIdeal: false, landSource: '', vassalKnights: 0, charlemagneAppointment: false, appointingRank: '', religiousIdeal: false, sponsorAndVacancy: false, chivalrousIdeal: false, gmDirected: false });
  const [ideal, setIdeal] = useState({ idealId: 'chivalrous', task: '' });
  const [careerAnnual, setCareerAnnual] = useState({ holdingIncomeLivres: 0 });
  const [careerRetirement, setCareerRetirement] = useState({ route: 'hermit', standingRoll: '', companionConsent: false, onMission: false, definitive: false });
  const [gift, setGift] = useState({ standingKey: 'liegeLord', giftLivres: 10, roll: '' });
  const [standingChange, setStandingChange] = useState({ standingKey: 'liegeLord', amount: -1, reason: '', sourcePage: 'Ch.4 pp.92-94' });
  const [glory, setGlory] = useState({ sourceType: 'marriage_frankish', spouseGlory: 0, spouseHonor: 0, convertHonor: 0, livres: 0, incomeLivres: 0, castleDefenseValue: 0, bonusPoints: 0, specialPowers: 0, legendaryFeats: 0, values: '', qualifyingIdeals: 0 });
  const [combatTerms, setCombatTerms] = useState({ terms: 'love', agreedByBoth: true, winner: '', conquestChoice: 'ransom', ransomLivres: 0, seizedEquipment: [] });
  const [siege, setSiege] = useState({ fullyEngaged: true, daysWithoutRelief: 90, cityValueLivres: 0, noncombatantRestrictionAccepted: true });
  const state = sanitizeRulebookProcedureState(character.campaign?.rulebookProcedures);
  const chronology = useMemo(() => getChronologyRulesForYear(character.personal?.campaignYear), [character.personal?.campaignYear]);
  const activeJourney = [...state.journeys].reverse().find(item => item.status !== 'complete');
  const eligibility = useMemo(() => getCareerEligibility(character, career.roleId, {
    ...career,
    sponsorIds: career.sponsorIds.split(',').map(value => value.trim()).filter(Boolean)
  }), [career, character]);

  const apply = (resolver, input, message) => {
    setError('');
    try {
      const result = resolver(character, input);
      setCharacter(result.character);
      setNotice(message);
      return result;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '원문 절차를 적용하지 못했습니다.');
      return null;
    }
  };

  const runSkill = () => apply(resolveSkillProcedure, {
    ...skill,
    roll: Number(skill.roll),
    opponentRoll: skill.opponentRoll === '' ? undefined : Number(skill.opponentRoll),
    opponentValue: skill.opponentValue === '' ? undefined : Number(skill.opponentValue),
    languageRoll: skill.languageRoll === '' ? undefined : Number(skill.languageRoll),
    languageValue: skill.languageValue === '' ? undefined : Number(skill.languageValue)
  }, '기술별 원문 결과와 후속 상태를 기록했습니다.');

  return <article className="rulebook-procedures">
    <FolioHeading eyebrow="Procedura Canonica · Chapters 4-15" title="원문 절차" year={character.personal?.campaignYear}>
      기술, 여행, 경력, 지위와 기사도 정산을 기존 캠페인 엔진에 연결합니다.
    </FolioHeading>

    {notice && <div className="procedure-message" role="status"><Check size={17} aria-hidden="true" />{notice}</div>}
    {error && <div className="procedure-message procedure-message--error" role="alert">{error}</div>}

    <section className="procedure-section">
      <SectionHeader index="I" title="연도 규칙" meta="Chronology" />
      <div className="procedure-summary"><div><span>Phase</span><strong>{chronology.phase}</strong></div><div><span>Harvest</span><strong>{chronology.harvestModifier >= 0 ? '+' : ''}{chronology.harvestModifier}</strong></div><div><span>Year</span><strong>{chronology.year}</strong></div></div>
      <div className="procedure-source-list">{chronology.rules.map(rule => <div key={rule.id}><BookOpenCheck size={17} aria-hidden="true" /><span><strong>{rule.label}</strong><small>{rule.sourcePage}</small></span></div>)}</div>
      <button type="button" className="secondary-command" onClick={() => apply(acknowledgeChronologyRules, { year: chronology.year }, '현재 연도의 자동 규칙 묶음을 캠페인에 확인 기록했습니다.')}><ShieldCheck size={17} aria-hidden="true" />현재 연도 규칙 확인</button>
    </section>

    <section className="procedure-section">
      <SectionHeader index="II" title="기술과 Feat" meta="Skills and Feats" />
      <div className="procedure-grid">
        <div className="procedure-pane">
          <Field label="기술"><select value={skill.skillId} onChange={event => setSkill(previous => ({ ...previous, skillId: event.target.value }))}>{SKILLS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></Field>
          <Field label="d20"><input type="number" min="1" max="20" value={skill.roll} onChange={event => setSkill(previous => ({ ...previous, roll: event.target.value }))} /></Field>
          <Field label="상황 보정"><input type="number" value={skill.modifier} onChange={event => setSkill(previous => ({ ...previous, modifier: Number(event.target.value) }))} /></Field>
          {skill.skillId === 'swimming' && <><Field label="갑옷 점수"><input type="number" min="0" value={skill.armor} onChange={event => setSkill(previous => ({ ...previous, armor: Number(event.target.value) }))} /></Field><Field label="하중"><select value={skill.encumbrance} onChange={event => setSkill(previous => ({ ...previous, encumbrance: event.target.value }))}><option value="none">없음</option><option value="light">가벼움 -5</option><option value="heavy">무거움 -10</option></select></Field></>}
          {skill.skillId === 'hunting' && <label className="procedure-check"><input type="checkbox" checked={skill.hasDogs} onChange={event => setSkill(previous => ({ ...previous, hasDogs: event.target.checked }))} />사냥개 동행</label>}
          {['heraldry', 'recognize', 'courtesy', 'dancing', 'eloquence'].includes(skill.skillId) && <><Field label="대상 Glory"><input type="number" min="0" value={skill.targetGlory} onChange={event => setSkill(previous => ({ ...previous, targetGlory: Number(event.target.value) }))} /></Field>{skill.skillId !== 'heraldry' && <label className="procedure-check"><input type="checkbox" checked={skill.gmAllowsGloryModifier} onChange={event => setSkill(previous => ({ ...previous, gmAllowsGloryModifier: event.target.checked }))} />GM이 높은 Glory 보정 허용</label>}</>}
          {skill.skillId === 'gaming' && <><Field label="상대 Gaming"><input type="number" min="0" value={skill.opponentValue} onChange={event => setSkill(previous => ({ ...previous, opponentValue: event.target.value }))} /></Field><Field label="상대 d20"><input type="number" min="1" max="20" value={skill.opponentRoll} onChange={event => setSkill(previous => ({ ...previous, opponentRoll: event.target.value }))} /></Field></>}
          {skill.skillId === 'readingWriting' && <><Field label="Languages"><input type="number" min="0" value={skill.languageValue} onChange={event => setSkill(previous => ({ ...previous, languageValue: event.target.value }))} /></Field><Field label="Languages d20"><input type="number" min="1" max="20" value={skill.languageRoll} onChange={event => setSkill(previous => ({ ...previous, languageRoll: event.target.value }))} /></Field></>}
          {skill.skillId === 'languages' && <Field label="언어 난도"><select value={skill.languageDifficulty} onChange={event => setSkill(previous => ({ ...previous, languageDifficulty: event.target.value }))}><option value="none">어린 시절 언어</option><option value="latin">Latin -5</option><option value="slav">Slav -10</option><option value="learned">Greek/Arabic/Hebrew -15</option></select></Field>}
          <button type="button" className="primary-command" disabled={!skill.roll} onClick={runSkill}><Dices size={17} aria-hidden="true" />기술 절차 판정</button>
        </div>
        <div className="procedure-pane">
          <Field label="Feat 대상 능력"><input type="number" min="0" value={feat.statistic} onChange={event => setFeat(previous => ({ ...previous, statistic: Number(event.target.value) }))} /></Field>
          <Field label="d20"><input type="number" min="1" max="20" value={feat.roll} onChange={event => setFeat(previous => ({ ...previous, roll: event.target.value }))} /></Field>
          <label className="procedure-check"><input type="checkbox" checked={feat.gmApproved} onChange={event => setFeat(previous => ({ ...previous, gmApproved: event.target.checked }))} />GM이 Feat 시도를 허용함</label>
          <Field label="상황"><input value={feat.note} onChange={event => setFeat(previous => ({ ...previous, note: event.target.value }))} /></Field>
          <button type="button" className="secondary-command" disabled={!feat.roll || !feat.gmApproved} onClick={() => apply(resolveFeatProcedure, { ...feat, roll: Number(feat.roll) }, 'Feat의 성공은 Critical, 실패는 Fumble로 저장했습니다.')}><Dices size={17} aria-hidden="true" />Feat 판정</button>
        </div>
      </div>
    </section>

    <section className="procedure-section">
      <SectionHeader index="III" title="여행" meta="Travel" />
      {!activeJourney ? <div className="procedure-form-row">
        <Field label="목적지"><input value={journey.destination} onChange={event => setJourney(previous => ({ ...previous, destination: event.target.value }))} /></Field>
        <Field label="거리"><input type="number" min="1" value={journey.distance} onChange={event => setJourney(previous => ({ ...previous, distance: event.target.value }))} /></Field>
        <Field label="길"><select value={journey.roadType} onChange={event => setJourney(previous => ({ ...previous, roadType: event.target.value }))}><option value="royalRoad">Royal road</option><option value="tradeRoad">Trade road</option><option value="localRoad">Local road</option><option value="path">Path</option><option value="track">Track</option></select></Field>
        <Field label="속도"><select value={journey.pace} onChange={event => setJourney(previous => ({ ...previous, pace: event.target.value }))}><option value="cautious">Cautious</option><option value="leisurely">Leisurely</option><option value="normal">Normal</option><option value="hurried">Hurried</option><option value="forcedMarch">Forced march</option></select></Field>
        <label className="procedure-check"><input type="checkbox" checked={journey.routeKnown} onChange={event => setJourney(previous => ({ ...previous, routeKnown: event.target.checked }))} />경로를 알고 있음</label>
        <button type="button" className="primary-command" onClick={() => apply(startJourney, { ...journey, distance: Number(journey.distance) }, '여행을 시작했습니다.')}><Route size={17} aria-hidden="true" />여행 시작</button>
      </div> : <div className="procedure-journey">
        <div><Compass size={18} aria-hidden="true" /><strong>{activeJourney.destination}</strong><span>{activeJourney.remainingDistance}/{activeJourney.totalDistance} miles · {activeJourney.status}</span></div>
        {activeJourney.status === 'awaiting_route_check' && <Field label="Hunting d20"><input type="number" min="1" max="20" value={journeyDay.huntingRoll} onChange={event => setJourneyDay(previous => ({ ...previous, huntingRoll: event.target.value }))} /></Field>}
        {activeJourney.pace === 'forcedMarch' && <><Field label="CON d20"><input type="number" min="1" max="20" value={journeyDay.conRoll} onChange={event => setJourneyDay(previous => ({ ...previous, conRoll: event.target.value }))} /></Field><Field label="Movement Rate"><input type="number" min="0" value={journeyDay.movementRate} onChange={event => setJourneyDay(previous => ({ ...previous, movementRate: Number(event.target.value) }))} /></Field></>}
        <button type="button" className="secondary-command" onClick={() => apply(resolveJourneyDay, { ...journeyDay, journeyId: activeJourney.id, huntingValue: character.skills?.hunting, con: character.attributes?.con }, '여행 하루의 거리와 후속 상태를 기록했습니다.')}><Route size={17} aria-hidden="true" />하루 진행</button>
      </div>}
    </section>

    <section className="procedure-section">
      <SectionHeader index="IV" title="경력과 Ideal" meta="Career and Ideals" />
      <div className="procedure-grid">
        <div className="procedure-pane">
          <Field label="직위"><select value={career.roleId} onChange={event => setCareer(previous => ({ ...previous, roleId: event.target.value }))}>{Object.entries(CAREER_ROLES).map(([id, role]) => <option key={id} value={id}>{role.label}</option>)}</select></Field>
          {career.roleId === 'companion' && <><Field label="두 서약 기사 ID · 쉼표 구분"><input value={career.sponsorIds} onChange={event => setCareer(previous => ({ ...previous, sponsorIds: event.target.value }))} /></Field><Field label="동료 Character ID"><input value={career.companionId} onChange={event => setCareer(previous => ({ ...previous, companionId: event.target.value }))} /></Field><Field label="동료 Glory"><input type="number" min="0" value={career.companionGlory} onChange={event => setCareer(previous => ({ ...previous, companionGlory: Number(event.target.value) }))} /></Field><Field label="동료 Honor"><input type="number" min="0" value={career.companionHonor} onChange={event => setCareer(previous => ({ ...previous, companionHonor: Number(event.target.value) }))} /></Field><label className="procedure-check"><input type="checkbox" checked={career.oathRecorded} onChange={event => setCareer(previous => ({ ...previous, oathRecorded: event.target.checked }))} />왕실 궁정·Paladin·Missus 앞 공개 맹세</label></>}
          {career.roleId === 'scara' && <label className="procedure-check"><input type="checkbox" checked={career.hasIdeal} onChange={event => setCareer(previous => ({ ...previous, hasIdeal: event.target.checked }))} />Ideal 보유</label>}
          {['vassal', 'banneret'].includes(career.roleId) && <Field label="토지 취득 근거"><select value={career.landSource} onChange={event => setCareer(previous => ({ ...previous, landSource: event.target.value }))}><option value="">선택</option><option value="inherited">상속</option><option value="granted">주군의 grant</option><option value="gifted">주군의 gift</option><option value="conquered">정복</option></select></Field>}
          {career.roleId === 'banneret' && <Field label="봉신 기사 수"><input type="number" min="0" value={career.vassalKnights} onChange={event => setCareer(previous => ({ ...previous, vassalKnights: Number(event.target.value) }))} /></Field>}
          {['count', 'duke'].includes(career.roleId) && <label className="procedure-check"><input type="checkbox" checked={career.charlemagneAppointment} onChange={event => setCareer(previous => ({ ...previous, charlemagneAppointment: event.target.checked }))} />Charlemagne의 임명</label>}
          {['castellan', 'constable', 'marshal', 'seneschal', 'vicar'].includes(career.roleId) && <Field label="임명 주군"><select value={career.appointingRank} onChange={event => setCareer(previous => ({ ...previous, appointingRank: event.target.value }))}><option value="">선택</option><option value="banneret">Banneret · 75</option><option value="count">Count · 150</option><option value="king">King · 300</option></select></Field>}
          {['lay_abbot', 'lay_bishop'].includes(career.roleId) && <label className="procedure-check"><input type="checkbox" checked={career.religiousIdeal} onChange={event => setCareer(previous => ({ ...previous, religiousIdeal: event.target.checked }))} />Religious Ideal</label>}
          {career.roleId === 'paladin' && <><label className="procedure-check"><input type="checkbox" checked={career.sponsorAndVacancy} onChange={event => setCareer(previous => ({ ...previous, sponsorAndVacancy: event.target.checked }))} />후원과 공석 확인</label><label className="procedure-check"><input type="checkbox" checked={career.chivalrousIdeal} onChange={event => setCareer(previous => ({ ...previous, chivalrousIdeal: event.target.checked }))} />Chivalrous Ideal</label></>}
          {career.roleId === 'black_knight' && <label className="procedure-check"><input type="checkbox" checked={career.gmDirected} onChange={event => setCareer(previous => ({ ...previous, gmDirected: event.target.checked }))} />GM이 명시적으로 지시함</label>}
          <div className="procedure-eligibility"><StatusSeal tone={eligibility.eligible ? 'active' : 'warning'}>{eligibility.eligible ? '요건 충족' : `${eligibility.failures.length}개 미충족`}</StatusSeal>{!eligibility.eligible && <p>{eligibility.failures.join(' · ')}</p>}</div>
          <button type="button" className="primary-command" disabled={!eligibility.eligible} onClick={() => apply(appointCareer, { ...career, sponsorIds: career.sponsorIds.split(',').map(value => value.trim()).filter(Boolean) }, '임명 영광·Standing·유지 수준을 원문대로 적용했습니다.')}><Crown size={17} aria-hidden="true" />직위 임명</button>
          {state.career.activeRoleId && <div className="procedure-career-actions"><Field label="연간 영지 수입 £"><input type="number" min="0" value={careerAnnual.holdingIncomeLivres} onChange={event => setCareerAnnual({ holdingIncomeLivres: Number(event.target.value) })} /></Field><button type="button" className="secondary-command" onClick={() => apply(applyAnnualCareerBenefits, careerAnnual, '직위의 연간 영광과 의무를 기록했습니다.')}>연간 직위 정산</button><Field label="은퇴 경로"><select value={careerRetirement.route} onChange={event => setCareerRetirement(previous => ({ ...previous, route: event.target.value }))}><option value="hermit">Hermit</option><option value="monk">Monk</option><option value="office">Office</option><option value="leave_service">직위만 사임</option></select></Field><Field label={state.career.activeRoleId === 'scara' ? 'Standing [Charlemagne] -10 d20' : 'Standing [lord] d20'}><input type="number" min="1" max="20" value={careerRetirement.standingRoll} onChange={event => setCareerRetirement(previous => ({ ...previous, standingRoll: event.target.value }))} /></Field><label className="procedure-check"><input type="checkbox" checked={careerRetirement.companionConsent} onChange={event => setCareerRetirement(previous => ({ ...previous, companionConsent: event.target.checked }))} />Companion 동의</label><label className="procedure-check"><input type="checkbox" checked={careerRetirement.onMission} onChange={event => setCareerRetirement(previous => ({ ...previous, onMission: event.target.checked }))} />현재 Missus 임무 중</label><label className="procedure-check"><input type="checkbox" checked={careerRetirement.definitive} onChange={event => setCareerRetirement(previous => ({ ...previous, definitive: event.target.checked }))} />기사 생애도 확정 은퇴</label><button type="button" className="secondary-command" onClick={() => apply(retireCareer, { ...careerRetirement, standingRoll: Number(careerRetirement.standingRoll) }, '직위 사임 또는 확정 은퇴를 원문 조건으로 처리했습니다.')}>경력 은퇴</button></div>}
        </div>
        <div className="procedure-pane">
          <Field label="Ideal"><select value={ideal.idealId} onChange={event => setIdeal(previous => ({ ...previous, idealId: event.target.value }))}><option value="chivalrous">Chivalrous</option><option value="religious">Religious</option><option value="romantic">Romantic</option></select></Field>
          <button type="button" className="secondary-command" onClick={() => apply(activateIdeal, { idealId: ideal.idealId }, 'Ideal의 공유 효과를 활성화했습니다.')}><ShieldCheck size={17} aria-hidden="true" />Ideal 활성화</button>
          {state.ideals.romantic?.active && <><Field label="올해 연인의 과업"><input value={ideal.task} onChange={event => setIdeal(previous => ({ ...previous, task: event.target.value }))} /></Field><button type="button" className="secondary-command" disabled={!ideal.task.trim()} onClick={() => apply(recordRomanticIdealDuty, { task: ideal.task }, '연간 과업과 £1 선물을 적용했습니다.')}><Landmark size={17} aria-hidden="true" />Romantic 연간 의무</button></>}
        </div>
      </div>
    </section>

    <section className="procedure-section">
      <SectionHeader index="V" title="Glory와 Standing" meta="Reputation" />
      <div className="procedure-grid"><div className="procedure-pane"><Field label="인쇄된 Glory 원천"><select value={glory.sourceType} onChange={event => setGlory(previous => ({ ...previous, sourceType: event.target.value }))}><option value="marriage_frankish">Frankish marriage</option><option value="marriage_converted_pagan">Converted pagan marriage</option><option value="conversion">Conversion</option><option value="miracle">Genuine miracle</option><option value="conspicuous_spending">Conspicuous spending</option><option value="holdings">Annual holdings</option><option value="enchanted_item">Enchanted item</option><option value="notable_statistics">Notable statistics</option><option value="ideals">Annual Ideals</option></select></Field>{['marriage_frankish', 'marriage_converted_pagan'].includes(glory.sourceType) && <><Field label="배우자 Glory"><input type="number" min="0" value={glory.spouseGlory} onChange={event => setGlory(previous => ({ ...previous, spouseGlory: Number(event.target.value) }))} /></Field>{glory.sourceType === 'marriage_converted_pagan' && <Field label="배우자 Honor"><input type="number" min="0" value={glory.spouseHonor} onChange={event => setGlory(previous => ({ ...previous, spouseHonor: Number(event.target.value) }))} /></Field>}</>}{glory.sourceType === 'conversion' && <Field label="개종자 Honor"><input type="number" min="0" value={glory.convertHonor} onChange={event => setGlory(previous => ({ ...previous, convertHonor: Number(event.target.value) }))} /></Field>}{glory.sourceType === 'conspicuous_spending' && <Field label="지출 £"><input type="number" min="0" value={glory.livres} onChange={event => setGlory(previous => ({ ...previous, livres: Number(event.target.value) }))} /></Field>}{glory.sourceType === 'holdings' && <><Field label="영지 수입 £"><input type="number" min="0" value={glory.incomeLivres} onChange={event => setGlory(previous => ({ ...previous, incomeLivres: Number(event.target.value) }))} /></Field><Field label="성채 DV"><input type="number" min="0" value={glory.castleDefenseValue} onChange={event => setGlory(previous => ({ ...previous, castleDefenseValue: Number(event.target.value) }))} /></Field></>}{glory.sourceType === 'enchanted_item' && <><Field label="Bonus 점수"><input type="number" min="0" value={glory.bonusPoints} onChange={event => setGlory(previous => ({ ...previous, bonusPoints: Number(event.target.value) }))} /></Field><Field label="특수 능력 수"><input type="number" min="0" value={glory.specialPowers} onChange={event => setGlory(previous => ({ ...previous, specialPowers: Number(event.target.value) }))} /></Field><Field label="전설적 위업 수"><input type="number" min="0" value={glory.legendaryFeats} onChange={event => setGlory(previous => ({ ...previous, legendaryFeats: Number(event.target.value) }))} /></Field></>}{glory.sourceType === 'notable_statistics' && <Field label="15 초과 수치 · 쉼표 구분"><input value={glory.values} onChange={event => setGlory(previous => ({ ...previous, values: event.target.value }))} /></Field>}{glory.sourceType === 'ideals' && <Field label="충족 Ideal 수"><input type="number" min="0" max="3" value={glory.qualifyingIdeals} onChange={event => setGlory(previous => ({ ...previous, qualifyingIdeals: Number(event.target.value) }))} /></Field>}<button type="button" className="secondary-command" onClick={() => apply(recordPrintedGlorySource, { ...glory, values: glory.values.split(',').map(value => Number(value.trim())).filter(Number.isFinite) }, '인쇄 공식으로 계산한 Glory를 ledger에 기록했습니다.')}><Crown size={17} aria-hidden="true" />Glory 기록</button></div><div className="procedure-pane">
       <div className="procedure-form-row"><Field label="대상"><select value={gift.standingKey} onChange={event => setGift(previous => ({ ...previous, standingKey: event.target.value }))}><option value="charlemagne">Charlemagne</option><option value="liegeLord">Liege lord</option><option value="family">Family</option><option value="retinue">Retinue</option><option value="church">Church</option><option value="commoners">Commoners</option></select></Field><Field label="선물 £"><input type="number" min="0" step="0.25" value={gift.giftLivres} onChange={event => setGift(previous => ({ ...previous, giftLivres: Number(event.target.value) }))} /></Field>{gift.standingKey === 'charlemagne' && <Field label="£100 미만 비례 판정 d20"><input type="number" min="1" max="20" value={gift.roll} onChange={event => setGift(previous => ({ ...previous, roll: event.target.value }))} /></Field>}<button type="button" className="primary-command" onClick={() => apply(recordStandingGift, { ...gift, roll: gift.roll === '' ? undefined : Number(gift.roll) }, '선물 비용·Standing·Glory·임계 효과를 함께 기록했습니다.')}><Crown size={17} aria-hidden="true" />선물 정산</button></div>
       <div className="procedure-form-row"><Field label="Standing 변화 대상"><select value={standingChange.standingKey} onChange={event => setStandingChange(previous => ({ ...previous, standingKey: event.target.value }))}><option value="charlemagne">Charlemagne</option><option value="liegeLord">Liege lord</option><option value="family">Family</option><option value="retinue">Retinue</option><option value="church">Church</option><option value="commoners">Commoners</option></select></Field><Field label="변화량"><input type="number" value={standingChange.amount} onChange={event => setStandingChange(previous => ({ ...previous, amount: Number(event.target.value) }))} /></Field><Field label="원문 사건·원인"><input value={standingChange.reason} onChange={event => setStandingChange(previous => ({ ...previous, reason: event.target.value }))} /></Field><button type="button" className="secondary-command" disabled={!standingChange.reason.trim() || standingChange.amount === 0} onClick={() => apply(recordSourcedStandingChange, standingChange, 'Standing 변화와 임계 효과를 적용했습니다.')}>Standing 변화 적용</button></div>
      </div></div>
    </section>

    <section className="procedure-section">
      <SectionHeader index="VI" title="기사도 정산" meta="Chivalric Settlement" />
      <div className="procedure-grid">
        <div className="procedure-pane"><h3><Scale size={18} aria-hidden="true" />개인 전투</h3><Field label="조건"><select value={combatTerms.terms} onChange={event => setCombatTerms(previous => ({ ...previous, terms: event.target.value }))}><option value="love">For Love</option><option value="conquest">Conquest</option></select></Field>{combatTerms.terms === 'love' && <label className="procedure-check"><input type="checkbox" checked={combatTerms.agreedByBoth} onChange={event => setCombatTerms(previous => ({ ...previous, agreedByBoth: event.target.checked }))} />두 기사 모두 For Love 조건에 동의</label>}<Field label="승자"><input value={combatTerms.winner} onChange={event => setCombatTerms(previous => ({ ...previous, winner: event.target.value }))} /></Field>{combatTerms.terms === 'conquest' && <><Field label="정산"><select value={combatTerms.conquestChoice} onChange={event => setCombatTerms(previous => ({ ...previous, conquestChoice: event.target.value }))}><option value="ransom">몸값</option><option value="seize_equipment">말·무기·갑옷 압수</option></select></Field>{combatTerms.conquestChoice === 'ransom' ? <Field label="GM 확정 몸값 £"><input type="number" min="0" value={combatTerms.ransomLivres} onChange={event => setCombatTerms(previous => ({ ...previous, ransomLivres: Number(event.target.value) }))} /></Field> : <Field label="압수 장비"><select multiple value={combatTerms.seizedEquipment} onChange={event => setCombatTerms(previous => ({ ...previous, seizedEquipment: Array.from(event.target.selectedOptions, option => option.value) }))}>{MARKET_CATALOG.filter(item => ['mount', 'melee', 'missile', 'armor', 'horseArmor'].includes(item.category)).map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></Field>}</>}<button type="button" className="secondary-command" disabled={!combatTerms.winner} onClick={() => apply(recordChivalricCombatSettlement, combatTerms, '전투 조건에 따른 원문 정산을 기록했습니다.')}><Scale size={17} aria-hidden="true" />전투 정산</button></div>
        <div className="procedure-pane"><h3><Landmark size={18} aria-hidden="true" />공성</h3><label className="procedure-check"><input type="checkbox" checked={siege.fullyEngaged} onChange={event => setSiege(previous => ({ ...previous, fullyEngaged: event.target.checked }))} />수비 측이 완전 교전으로 결정</label><Field label="구원군 없이 지난 날"><input type="number" min="0" value={siege.daysWithoutRelief} onChange={event => setSiege(previous => ({ ...previous, daysWithoutRelief: Number(event.target.value) }))} /></Field><Field label="GM 확정 도시 가치 £"><input type="number" min="0" value={siege.cityValueLivres} onChange={event => setSiege(previous => ({ ...previous, cityValueLivres: Number(event.target.value) }))} /></Field><label className="procedure-check"><input type="checkbox" checked={siege.noncombatantRestrictionAccepted} onChange={event => setSiege(previous => ({ ...previous, noncombatantRestrictionAccepted: event.target.checked }))} />비전투원 살해·도시 파괴 금지 확인</label><button type="button" className="secondary-command" onClick={() => apply(recordChivalricSiegeSettlement, siege, '90일 항복과 도시 가치 1/5 세금을 정산했습니다.')}><Landmark size={17} aria-hidden="true" />공성 정산</button></div>
      </div>
    </section>
  </article>;
}

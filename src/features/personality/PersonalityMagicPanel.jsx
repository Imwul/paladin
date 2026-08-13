import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookHeart,
  Check,
  ChevronRight,
  Dices,
  HeartHandshake,
  MoonStar,
  ScrollText,
  Sparkles
} from 'lucide-react';
import { FolioHeading, SectionHeader, StatusSeal } from '../../components/ui/LedgerUI';
import { TRAIT_KEYS } from '../../rules/personalityRules';
import {
  addDirectedPassion,
  addDirectedTrait,
  applyDishonorableAct,
  advanceMelancholyRecovery,
  beginAcceleratedLoversTask,
  beginAmorWinter,
  beginPassionResolution,
  beginPrayerResolution,
  beginSelfImposedLoversTask,
  completeIntrospection,
  completePassionResolution,
  consummateAmor,
  convertExternalAmorToHate,
  DISHONORABLE_ACTS,
  drawLoversTask,
  getPersonalityMagicState,
  lowerPassionDuringWinter,
  recordMiracleDecision,
  removeDirectedTrait,
  reducePassionForContraryAction,
  resolveAmorDiscovery,
  resolveDream,
  resolveEssai,
  resolveExternalMelancholyRecovery,
  resolveFearOpportunity,
  resolveHonorLordJudgment,
  resolveIntrospection,
  resolveLoversTask,
  resolveMadnessYear,
  resolvePersonalityConflict,
  resolvePaganLadyAmor,
  resolveScenarioPassionShock,
  resumeAmorProcedure,
  resolveStandardTraitTest,
  setPotentialAmor,
  settleOath,
  startAmor,
  takeOath,
  triggerMadness
} from '../../rules/personalityMagicRules';
import { completeAdventurePersonalityMagic } from '../../rules/adventureRules';
import RulebookButton from '../rulebook/RulebookButton';
import './PersonalityMagicPanel.css';

const PASSION_LABELS = {
  honor: '명예',
  loveCharlemagne: '샤를마뉴에 대한 사랑',
  loveFamily: '가족에 대한 사랑',
  loveGod: '신에 대한 사랑'
};

const TRAIT_LABELS = {
  chaste: '정숙', lustful: '음탕', energetic: '활기', lazy: '나태', forgiving: '관용', vengeful: '복수',
  generous: '관대', selfish: '이기', honest: '정직', deceitful: '기만', just: '공정', arbitrary: '독단',
  merciful: '자비', cruel: '잔혹', modest: '겸손', proud: '교만', prudent: '신중', reckless: '무모',
  temperate: '절제', indulgent: '방종', trusting: '신뢰', suspicious: '의심', valorous: '용맹', cowardly: '비겁'
};

const BRIDGE_LABELS = {
  jewel_relic_prayer: ['The Adventure of the Jewel · 기도', '성 마르키아누스 성유물의 원문 +5를 Prayer resolver에서 처리합니다.'],
  jewel_dream: ['The Adventure of the Jewel · 꿈', 'Love [Charlemagne] 판정과 원문 꿈의 발생을 기록합니다.'],
  humble_blessing: ['The Humble Squires · 축복', '투르핀의 기도에서 혜택을 받는 Love [God] 판정을 처리합니다.'],
  humble_passion_conflict: ['The Humble Squires · Passion 충돌', 'Honor와 Love [Charlemagne] 또는 원문상 적절한 항목의 충돌을 기록합니다.'],
  humble_dream: ['The Humble Squires · 꿈', 'Love [God] 판정과 원문 예언 꿈의 발생을 기록합니다.'],
  adulterous_spouse_prayer: ['The Adulterous Spouse · 기도', '신명재판에 앞선 타인의 기도 혜택을 원문 Prayer resolver로 처리합니다.'],
  angry_merchant_melancholy: ['The Angry Merchant · 회복', '백작의 Love [Charlemagne]와 관련 Passion의 대결을 Snap Out of It 절차로 기록합니다.'],
  devils_bridge_prayer: ["The Devil's Bridge · 기도", '신의 도움을 청하는 기도를 원문 Prayer resolver로 처리합니다.'],
  devils_bridge_dream: ["The Devil's Bridge · 꿈", 'Love [Charlemagne] 판정 뒤 원문이 제시한 꿈의 발생을 기록합니다.'],
  noble_hostage_miracle: ['The Noble Hostage · 기적', '불길한 사건을 끝낼 기적의 발생과 의미를 GM 판단으로 보존합니다.'],
  pagan_prison_amor: ['The Pagan Prison · Amor', '이교도 공주의 숨겨진 Amor와 후속 약속을 GM 판단으로 보존합니다.'],
  wrathful_lord_shock: ['The Wrathful Lord · Shock', '사회적 상위자의 배신에 대한 Passion 성공 시 Table 10–1 Shock를 적용합니다.'],
  wrathful_lord_conflict: ['The Wrathful Lord · 충성 충돌', '추격대의 충성을 돌리기 위한 원문 opposed Passion을 처리합니다.'],
  royal_court_amor: ['The Royal Court · Amor', '원문 4d6 결과와 플레이어 선택 뒤 Amor를 공용 장기 상태로 시작합니다.'],
  love_conquers_all: ['Love Conquers All', '세 가지 Lover’s Task를 canonical Amor에 기록합니다.'],
  melancholic_paladin: ['The Melancholic Paladin', 'Chapter 3의 Snap Out of It 대결로 회복 상태를 확정합니다.'],
  miracle_truth: ['The Miracle of Truth', '기도 판정과 기적의 정확한 성격에 대한 GM 결정을 분리해 기록합니다.'],
  pagan_lady: ['The Pagan Lady', 'Gudrun의 Amor가 배신을 확신했을 때 Hate로 전환된 사실을 기록합니다.'],
  wild_hunt: ['The Wild Hunt', 'Mad Acts와 Character Changes를 해마다 적용하거나 성공한 기도로 구조합니다.'],
  romance_start: ['Romance · 선언', 'Amor와 GM 전용 Potential Amor를 확정합니다.'],
  romance_progression: ['Romance · 구애', '선물, 접근, Lover’s Task와 Reluctance를 처리합니다.'],
  romance_essai: ['Romance · Essai', 'Chaste 판정과 거절 결과를 처리합니다.'],
  romance_consummation: ['Romance · Consummation', 'Essai 다음 Winter에 Amor를 Love [amor]로 전환합니다.'],
  romance_discovery: ['Romance · 발각', 'Love [amor]와 Discovery Factor의 대결 및 노출 표를 처리합니다.']
};

const PASSION_MODES = [
  ['ordinary', '일반 사용'],
  ['mandatory', '의무 사용'],
  ['frivolous', '부적절한 상황에서 강행']
];

const Field = ({ label, children }) => <label className="personality-field"><span>{label}</span>{children}</label>;
const NumberInput = props => <input type="number" {...props} />;
const toOptionalNumber = value => value === '' ? undefined : Number(value);
const parseRolls = value => String(value || '').split(',').map(item => Number(item.trim())).filter(Number.isFinite);
const passionOptions = character => Object.keys(character.passions || {});

function RuntimeSection({ icon: Icon, title, source, children, open = false }) {
  return <details className="personality-section" open={open}>
    <summary><Icon size={19} aria-hidden="true" /><span>{title}</span><small>{source}</small></summary>
    <div className="personality-section__body"><RulebookButton sourcePage={source} reason={title} label="이 절차 원문" />{children}</div>
  </details>;
}

export default function PersonalityMagicPanel({ character, setCharacter, onNavigate, mode = 'personality', adventureMode = false }) {
  const state = getPersonalityMagicState(character);
  const bridge = adventureMode ? character.campaign?.adventures?.active?.pendingSubsystem : null;
  const bridgeAction = bridge?.type === 'personality_magic' ? bridge.action : null;
  const bridgeProcedure = bridge?.procedure || {};
  const bridgeCopy = BRIDGE_LABELS[bridgeAction];
  const magicBridge = ['jewel_relic_prayer', 'jewel_dream', 'humble_blessing', 'humble_dream', 'adulterous_spouse_prayer', 'devils_bridge_prayer', 'devils_bridge_dream', 'miracle_truth', 'noble_hostage_miracle'].includes(bridgeAction);
  const forcedSection = bridgeAction?.startsWith('romance_') || ['love_conquers_all', 'pagan_lady', 'pagan_prison_amor', 'royal_court_amor'].includes(bridgeAction)
    ? 'amor'
    : magicBridge ? 'magic'
      : ['humble_passion_conflict', 'wrathful_lord_conflict'].includes(bridgeAction) ? 'personality'
        : bridgeAction ? 'conditions' : null;
  const [section, setSection] = useState(forcedSection || mode);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [directed, setDirected] = useState({ traitKey: 'suspicious', target: '', modifier: 5, origin: 'gm', gmAgreed: false });
  const [directedPassion, setDirectedPassion] = useState({ kind: 'fear', target: '', value: '', playerAgreed: true, gmAgreed: true, agreementNote: '' });
  const [trait, setTrait] = useState({ traitKey: 'just', roll: '', oppositeRoll: '', modifier: 0, significantAction: true });
  const [conflict, setConflict] = useState({ actorGroup: 'passions', actorKey: 'honor', actorRoll: '', opponentGroup: 'traits', opponentKey: 'merciful', opponentRoll: '' });
  const [passion, setPassion] = useState({ passionKey: 'honor', mode: 'ordinary', roll: '', modifier: 0, gmApproved: true, ideal: '', actionOutcome: 'successful', agingRoll: '', attributeRolls: '' });
  const [passionChange, setPassionChange] = useState({ passionKey: 'honor', action: '', gmDirected: true, duringWinter: false });
  const [fear, setFear] = useState({ passionKey: '', context: '', overcame: false, glory: 0, gmCreatedOpportunity: true, gmApprovedGlory: false, gmAllowsAdditionalOpportunity: false });
  const [dishonor, setDishonor] = useState({ actId: DISHONORABLE_ACTS[0].id, note: '', outcome: 'degraded', judgmentNote: '' });
  const [madness, setMadness] = useState({ passionKey: 'honor', value: character.passions?.honor || 1, onset: 'gm_pending', recoveryRoll: '', changes: '' });
  const [melancholy, setMelancholy] = useState({ weeks: 1, subject: 'Melancholic Paladin', healerGroup: 'passions', healerKey: 'loveFamily', healerRoll: '', victimPassionValue: 16, victimRoll: '' });
  const [oath, setOath] = useState({ kind: 'positive', text: '', passionKey: 'honor', roll: '', fulfilled: true });
  const [amorForm, setAmorForm] = useState({ targetName: '', secretName: '', roll: '', amorGender: 'woman', amorGlory: 0, amorApp: 15, knightSavedAmor: false, amorSavedKnight: false, enemy: false, keep: true, potential: '', chaste: 15 });
  const [approach, setApproach] = useState({ giftLivres: 1, romanceRoll: '', taskRoll: '', taskTest: 'singing', taskCheckRoll: '', success: true, critical: false, gmNote: '', jewelryLivres: '', amorRoll: '', honorRoll: '' });
  const [essai, setEssai] = useState({ chasteRoll: '', lustfulRoll: '' });
  const [discovery, setDiscovery] = useState({ discoveryDie: '', observerValue: 0, loveRoll: '', discoveryRoll: '', exposureRoll: '' });
  const [introspection, setIntrospection] = useState({ gameDay: '', roll: '', durationRolls: '' });
  const [externalAmor, setExternalAmor] = useState({ subject: 'Gudrun', target: 'Gervold', value: 14, reason: 'Convincing evidence of betrayal' });
  const [paganAmor, setPaganAmor] = useState({ mode: 'passive', ladyName: '', ladyResistanceValue: 15, appRoll: '', ladyRoll: '', ladyAmorValue: 16, playerAmorValue: 16, playerAgreed: true, gmAgreed: true, secretName: '' });
  const [prayer, setPrayer] = useState({
    beneficiary: bridgeProcedure.beneficiary || 'self_prayer',
    intention: '', form: 'normal', place: 'ordinary', faithful: 'none', day: 'ordinary', sacredItem: 'none',
    roll: '', eligible: true, gmUsesTable: true, onPilgrimage: false, pilgrimageModifier: 1,
    contextModifier: bridgeProcedure.contextModifier || 0,
    contextNote: bridgeProcedure.contextNote || ''
  });
  const [miracle, setMiracle] = useState({ context: bridgeCopy?.[0] || 'The Miracle of Truth', chosenResult: '', downstreamState: '' });
  const [dream, setDream] = useState({ passionKey: bridgeProcedure.passionKey || 'loveGod', passionRoll: '', religionRoll: '', message: '', interpretation: '' });
  const [scenarioShock, setScenarioShock] = useState({ passionKey: 'honor', roll: '', agingRoll: '', attributeRolls: '' });
  const activeConditions = useMemo(() => state.conditions.filter(item => item.status === 'active'), [state.conditions]);
  const activeResolution = state.activeResolution;
  const amor = state.amor;
  const fearOptions = state.directedPassions.filter(item => item.kind === 'fear' && item.status === 'active');

  const run = (operation, message) => {
    try {
      const output = operation();
      if (!output?.character) throw new Error('규칙 엔진이 character 결과를 반환하지 않았습니다.');
      setCharacter(output.character);
      setNotice(message);
      setError('');
      return output;
    } catch (caught) {
      setError(caught.message);
      setNotice('');
      return null;
    }
  };

  const finishBridge = () => {
    const output = run(() => completeAdventurePersonalityMagic(character), 'canonical 결과를 모험 장면에 한 번만 반환했습니다.');
    if (output && onNavigate) onNavigate('adventure');
  };

  const beginPassion = () => run(() => beginPassionResolution(character, {
    ...passion,
    roll: toOptionalNumber(passion.roll),
    modifier: Number(passion.modifier),
    ideal: passion.ideal || undefined
  }), 'Passion 판정과 후속 상태를 확정했습니다.');

  const completePassion = () => run(() => completePassionResolution(character, {
    actionOutcome: passion.actionOutcome,
    agingRoll: toOptionalNumber(passion.agingRoll),
    attributeRolls: parseRolls(passion.attributeRolls)
  }), '행동 결과와 Passion 후유증을 적용했습니다.');

  const prepareLoveTask = () => {
    if (bridgeAction === 'love_conquers_all') {
      return run(() => beginAcceleratedLoversTask(character, { context: 'love_conquers_all' }), '다음 가속 Lover’s Task를 열었습니다.');
    }
    return run(() => beginAmorWinter(character, {
      giftLivres: Number(approach.giftLivres),
      romanceRoll: toOptionalNumber(approach.romanceRoll)
    }), '이번 Winter의 선물과 접근을 Economy와 Amor에 기록했습니다.');
  };

  const drawTask = () => run(() => drawLoversTask(character, {
    roll: bridgeAction === 'love_conquers_all'
      ? (approach.taskRoll === '' ? undefined : 6 + Number(approach.taskRoll))
      : toOptionalNumber(approach.taskRoll),
    ignoreDuplicates: bridgeAction === 'love_conquers_all'
  }), 'Table 19-28 결과를 현재 Amor에 고정했습니다.');

  const resolveTask = () => run(() => resolveLoversTask(character, {
    testKey: approach.taskTest,
    roll: toOptionalNumber(approach.taskCheckRoll),
    success: approach.success,
    critical: approach.critical,
    canonicalResultId: approach.gmNote ? `gm:${bridgeAction || 'romance'}` : '',
    gmNote: approach.gmNote,
    jewelryLivres: toOptionalNumber(approach.jewelryLivres),
    amorRoll: toOptionalNumber(approach.amorRoll),
    honorRoll: toOptionalNumber(approach.honorRoll)
  }), 'Lover’s Task 결과를 Amor와 관련 장부에 반영했습니다.');

  const sectionButtons = adventureMode ? [] : [
    ['personality', '성격과 Passion'],
    ['conditions', '후유증과 Oath'],
    ['amor', 'Amor'],
    ['magic', '기도와 기적']
  ];

  return <article className="folio-page personality-workbench view-animate">
    <FolioHeading
      eyebrow={bridgeCopy ? `Chapter 19 dependency · p.${bridge.sourcePage}` : 'Liber Personalitatis · Chapters 3 and 9'}
      title={bridgeCopy?.[0] || (mode === 'magic' ? '기도와 기적' : '성격과 열정')}
      year={character.personal?.campaignYear}
    >{bridgeCopy?.[1] || 'Traits, Passions, Amor, Madness와 Christian Magic의 canonical 기록'}</FolioHeading>

    {sectionButtons.length > 0 && <nav className="personality-tabs" aria-label="Personality and magic sections">
      {sectionButtons.map(([id, label]) => <button key={id} type="button" className={section === id ? 'active' : ''} onClick={() => setSection(id)}>{label}</button>)}
    </nav>}

    {bridgeCopy && <section className="personality-bridge-note"><BookHeart size={21} aria-hidden="true" /><div><span>현재 모험 연결</span><p>{bridgeCopy[1]}</p></div><StatusSeal tone="warning">처리 중</StatusSeal></section>}

    {section === 'personality' && <div className="personality-stack">
      <RuntimeSection icon={ScrollText} title="Directed Trait" source="Ch.3 pp.69–70" open>
        <div className="personality-grid personality-grid--five">
          <Field label="Trait"><select value={directed.traitKey} onChange={event => setDirected({ ...directed, traitKey: event.target.value })}>{TRAIT_KEYS.map(key => <option key={key} value={key}>{TRAIT_LABELS[key] || key}</option>)}</select></Field>
          <Field label="대상"><input value={directed.target} onChange={event => setDirected({ ...directed, target: event.target.value })} /></Field>
          <Field label="수정치"><NumberInput min="1" value={directed.modifier} onChange={event => setDirected({ ...directed, modifier: event.target.value })} /></Field>
          <Field label="기원"><select value={directed.origin} onChange={event => setDirected({ ...directed, origin: event.target.value })}><option value="gm">GM 부여</option><option value="voluntary">자발적</option></select></Field>
          <label className="personality-check"><input type="checkbox" checked={directed.gmAgreed} onChange={event => setDirected({ ...directed, gmAgreed: event.target.checked })} />GM 합의</label>
        </div>
        <button type="button" className="secondary-command" onClick={() => run(() => addDirectedTrait(character, { ...directed, modifier: Number(directed.modifier) }), 'Directed Trait을 추가했습니다.')}>Directed Trait 추가</button>
        {state.directedTraits.filter(item => item.status === 'active').map(item => <div className="personality-record" key={item.id}><span>{TRAIT_LABELS[item.traitKey] || item.traitKey} · {item.target} · +{item.modifier}</span><button type="button" className="text-command" onClick={() => run(() => removeDirectedTrait(character, { directedTraitId: item.id, reason: 'GM confirmed removal' }), 'GM 사유와 함께 제거했습니다.')}>제거</button></div>)}
      </RuntimeSection>

      <RuntimeSection icon={HeartHandshake} title="Directed Passion" source="Ch.3 pp.74–78">
        <div className="personality-grid">
          <Field label="종류"><select value={directedPassion.kind} onChange={event => setDirectedPassion({ ...directedPassion, kind: event.target.value })}><option value="love">Love</option><option value="hate">Hate</option><option value="fear">Fear</option></select></Field>
          <Field label="대상"><input value={directedPassion.target} onChange={event => setDirectedPassion({ ...directedPassion, target: event.target.value })} /></Field>
          <Field label="합의한 시작값"><NumberInput min="1" value={directedPassion.value} onChange={event => setDirectedPassion({ ...directedPassion, value: event.target.value })} /></Field>
          <Field label="합의 기록"><input value={directedPassion.agreementNote} onChange={event => setDirectedPassion({ ...directedPassion, agreementNote: event.target.value })} /></Field>
        </div>
        <div className="personality-actions">
          <label className="personality-check"><input type="checkbox" checked={directedPassion.playerAgreed} onChange={event => setDirectedPassion({ ...directedPassion, playerAgreed: event.target.checked })} />플레이어 합의</label>
          <label className="personality-check"><input type="checkbox" checked={directedPassion.gmAgreed} onChange={event => setDirectedPassion({ ...directedPassion, gmAgreed: event.target.checked })} />GM 합의</label>
          <button type="button" className="secondary-command" onClick={() => run(() => addDirectedPassion(character, { ...directedPassion, value: Number(directedPassion.value) }), '대상과 합의값을 가진 Directed Passion을 추가했습니다.')}>Directed Passion 추가</button>
        </div>
        {state.directedPassions.filter(item => item.status === 'active').map(item => <div className="personality-record" key={item.id}><span>{item.kind} [{item.target}] · {character.passions?.[item.passionKey] ?? item.value}</span><StatusSeal>{item.status}</StatusSeal></div>)}
      </RuntimeSection>

      <RuntimeSection icon={Dices} title="Trait 판정" source="Table 3–1 · pp.70–71">
        <div className="personality-grid">
          <Field label="첫 Trait"><select value={trait.traitKey} onChange={event => setTrait({ ...trait, traitKey: event.target.value })}>{TRAIT_KEYS.map(key => <option key={key} value={key}>{TRAIT_LABELS[key] || key} · {character.traits?.[key] ?? 0}</option>)}</select></Field>
          <Field label="d20"><NumberInput min="1" max="20" value={trait.roll} onChange={event => setTrait({ ...trait, roll: event.target.value })} /></Field>
          <Field label="첫 실패 시 반대 Trait d20"><NumberInput min="1" max="20" value={trait.oppositeRoll} onChange={event => setTrait({ ...trait, oppositeRoll: event.target.value })} /></Field>
          <Field label="원문 수정치"><NumberInput value={trait.modifier} onChange={event => setTrait({ ...trait, modifier: event.target.value })} /></Field>
        </div>
        <button type="button" className="secondary-command" onClick={() => run(() => resolveStandardTraitTest(character, { ...trait, roll: Number(trait.roll), oppositeRoll: toOptionalNumber(trait.oppositeRoll), modifier: Number(trait.modifier) }), 'Table 3–1 결과와 경험 체크를 적용했습니다.')}><Dices size={17} aria-hidden="true" />Trait 판정</button>
      </RuntimeSection>

      <RuntimeSection icon={HeartHandshake} title="Passion 사용" source="Table 3–4 · pp.77–79" open>
        <div className="personality-grid">
          <Field label="Passion"><select value={passion.passionKey} onChange={event => setPassion({ ...passion, passionKey: event.target.value })}>{passionOptions(character).map(key => <option key={key} value={key}>{PASSION_LABELS[key] || key} · {character.passions[key]}</option>)}</select></Field>
          <Field label="사용 방식"><select value={passion.mode} onChange={event => setPassion({ ...passion, mode: event.target.value })}>{PASSION_MODES.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></Field>
          <Field label="d20"><NumberInput min="1" max="20" value={passion.roll} onChange={event => setPassion({ ...passion, roll: event.target.value })} /></Field>
          <Field label="원문 수정치"><NumberInput value={passion.modifier} onChange={event => setPassion({ ...passion, modifier: event.target.value })} /></Field>
        </div>
        {!activeResolution ? <button type="button" className="primary-command" onClick={beginPassion}><Dices size={17} aria-hidden="true" />Passion 판정</button> : <div className="personality-resolution"><div><span>{activeResolution.passionKey}</span><strong>{activeResolution.outcome}</strong><small>행동 수정 {activeResolution.skillModifier >= 0 ? '+' : ''}{activeResolution.skillModifier}</small></div><div className="personality-grid"><Field label="후속 행동"><select value={passion.actionOutcome} onChange={event => setPassion({ ...passion, actionOutcome: event.target.value })}><option value="successful">성공</option><option value="failed">실패</option></select></Field><Field label="Shock Aging d20"><NumberInput min="1" max="20" value={passion.agingRoll} onChange={event => setPassion({ ...passion, agingRoll: event.target.value })} /></Field><Field label="능력치 d6 · 쉼표 구분"><input value={passion.attributeRolls} onChange={event => setPassion({ ...passion, attributeRolls: event.target.value })} /></Field></div><button type="button" className="primary-command" onClick={completePassion}>행동 결과 적용</button></div>}
      </RuntimeSection>

      <RuntimeSection icon={Dices} title="Trait / Passion 충돌" source="Ch.3 pp.71–72">
        <div className="personality-grid">
          <Field label="첫 항목"><select value={conflict.actorKey} onChange={event => setConflict({ ...conflict, actorKey: event.target.value, actorGroup: TRAIT_KEYS.includes(event.target.value) ? 'traits' : 'passions' })}>{[...TRAIT_KEYS, ...passionOptions(character)].map(key => <option key={key} value={key}>{TRAIT_LABELS[key] || PASSION_LABELS[key] || key}</option>)}</select></Field>
          <Field label="첫 d20"><NumberInput min="1" max="20" value={conflict.actorRoll} onChange={event => setConflict({ ...conflict, actorRoll: event.target.value })} /></Field>
          <Field label="맞서는 항목"><select value={conflict.opponentKey} onChange={event => setConflict({ ...conflict, opponentKey: event.target.value, opponentGroup: TRAIT_KEYS.includes(event.target.value) ? 'traits' : 'passions' })}>{[...TRAIT_KEYS, ...passionOptions(character)].map(key => <option key={key} value={key}>{TRAIT_LABELS[key] || PASSION_LABELS[key] || key}</option>)}</select></Field>
          <Field label="맞서는 d20"><NumberInput min="1" max="20" value={conflict.opponentRoll} onChange={event => setConflict({ ...conflict, opponentRoll: event.target.value })} /></Field>
        </div>
        <button type="button" className="secondary-command" onClick={() => run(() => resolvePersonalityConflict(character, { ...conflict, actorRoll: Number(conflict.actorRoll), opponentRoll: Number(conflict.opponentRoll) }), '충돌 판정 결과를 저장했습니다.')}>충돌 판정</button>
      </RuntimeSection>

      <RuntimeSection icon={AlertTriangle} title="Passion 감소와 Fear 극복" source="Ch.3 pp.66, 77–78, 80–81">
        <div className="personality-grid">
          <Field label="Passion"><select value={passionChange.passionKey} onChange={event => setPassionChange({ ...passionChange, passionKey: event.target.value })}>{passionOptions(character).map(key => <option key={key} value={key}>{PASSION_LABELS[key] || key} · {character.passions[key]}</option>)}</select></Field>
          <Field label="반대 행동"><input value={passionChange.action} onChange={event => setPassionChange({ ...passionChange, action: event.target.value })} /></Field>
          <label className="personality-check"><input type="checkbox" checked={passionChange.gmDirected} onChange={event => setPassionChange({ ...passionChange, gmDirected: event.target.checked })} />GM의 즉시 -1 지시</label>
          <label className="personality-check"><input type="checkbox" checked={passionChange.duringWinter} onChange={event => setPassionChange({ ...passionChange, duringWinter: event.target.checked })} />현재 Winter Phase</label>
        </div>
        <div className="personality-actions"><button type="button" className="secondary-command" onClick={() => run(() => reducePassionForContraryAction(character, passionChange), 'Passion에 반한 행동으로 1점을 낮췄습니다.')}>반대 행동 -1</button><button type="button" className="secondary-command" onClick={() => run(() => lowerPassionDuringWinter(character, passionChange), '공개적으로 부정한 Passion을 이번 Winter에 3점 낮췄습니다.')}>Winter 자발적 -3</button></div>
        {fearOptions.length > 0 && <><div className="personality-grid">
          <Field label="Fear"><select value={fear.passionKey || fearOptions[0].passionKey} onChange={event => setFear({ ...fear, passionKey: event.target.value })}>{fearOptions.map(item => <option key={item.id} value={item.passionKey}>{item.target} · {character.passions?.[item.passionKey]}</option>)}</select></Field>
          <Field label="GM이 만든 극복 기회"><input value={fear.context} onChange={event => setFear({ ...fear, context: event.target.value })} /></Field>
          <Field label="GM 확정 Glory"><NumberInput min="0" value={fear.glory} onChange={event => setFear({ ...fear, glory: event.target.value })} /></Field>
          <label className="personality-check"><input type="checkbox" checked={fear.overcame} onChange={event => setFear({ ...fear, overcame: event.target.checked })} />Fear 극복 성공</label>
          <label className="personality-check"><input type="checkbox" checked={fear.gmApprovedGlory} onChange={event => setFear({ ...fear, gmApprovedGlory: event.target.checked })} />Glory GM 확정</label>
          <label className="personality-check"><input type="checkbox" checked={fear.gmAllowsAdditionalOpportunity} onChange={event => setFear({ ...fear, gmAllowsAdditionalOpportunity: event.target.checked })} />추가 기회 GM 승인</label>
        </div><button type="button" className="primary-command" onClick={() => run(() => resolveFearOpportunity(character, { ...fear, passionKey: fear.passionKey || fearOptions[0].passionKey, glory: Number(fear.glory) }), 'Fear 극복 기회와 결과를 기록했습니다.')}>Fear 기회 처리</button></>}
      </RuntimeSection>
    </div>}

    {section === 'conditions' && <div className="personality-stack">
      <section className="personality-condition-ledger"><SectionHeader numeral="I" title="현재 후유증" latin="Status Passionis" />{activeConditions.length ? activeConditions.map(condition => <article key={condition.id}><div><span>{condition.type}</span><p>{condition.passionKey || condition.note} · {condition.sourcePage}</p></div><StatusSeal tone="warning">{condition.status}</StatusSeal>{condition.type === 'melancholy' && <button type="button" className="secondary-command" onClick={() => run(() => advanceMelancholyRecovery(character, { conditionId: condition.id, weeks: Number(melancholy.weeks) }), '경과한 회복 시간을 기록했습니다.')}>주 단위 경과</button>}{condition.type === 'madness' && <button type="button" className="secondary-command" onClick={() => run(() => resolveMadnessYear(character, { conditionId: condition.id, recoveryRoll: toOptionalNumber(madness.recoveryRoll), changes: parseRolls(madness.changes).map(roll => ({ roll })) }), 'Mad Acts, Character Changes와 회복을 적용했습니다.')}>광기의 해 처리</button>}</article>) : <p className="personality-empty">활성 Shock, Melancholy 또는 Madness가 없습니다.</p>}</section>

      <RuntimeSection icon={AlertTriangle} title="Madness 시작과 연간 회복" source="Ch.3 pp.79–80 · Tables 19–20/21" open={bridgeAction === 'wild_hunt'}>
        <div className="personality-grid">
          <Field label="원인이 된 Passion"><select value={madness.passionKey} onChange={event => setMadness({ ...madness, passionKey: event.target.value, value: character.passions?.[event.target.value] || madness.value })}>{passionOptions(character).map(key => <option key={key} value={key}>{PASSION_LABELS[key] || key}</option>)}</select></Field>
          <Field label="Fumble 당시 값"><NumberInput min="1" value={madness.value} onChange={event => setMadness({ ...madness, value: event.target.value })} /></Field>
          <Field label="회복 d6"><NumberInput min="1" max="6" value={madness.recoveryRoll} onChange={event => setMadness({ ...madness, recoveryRoll: event.target.value })} /></Field>
          <Field label="Table 19–21 d20 · 쉼표"><input value={madness.changes} onChange={event => setMadness({ ...madness, changes: event.target.value })} placeholder="예: 3, 12" /></Field>
        </div>
        <button type="button" className="secondary-command" onClick={() => run(() => triggerMadness(character, { passionKey: madness.passionKey, fumbledPassionValue: Number(madness.value), sourcePage: bridgeAction === 'wild_hunt' ? 'Ch.19 p.431' : 'Ch.3 pp.79–80' }), 'Madness 조건을 canonical 상태로 시작했습니다.')}>Madness 시작</button>
      </RuntimeSection>

      <RuntimeSection icon={HeartHandshake} title="Snap Out of It" source="Ch.3 p.79" open={['melancholic_paladin', 'angry_merchant_melancholy'].includes(bridgeAction)}>
        <div className="personality-grid">
          <Field label="대상"><input value={melancholy.subject} onChange={event => setMelancholy({ ...melancholy, subject: event.target.value })} /></Field>
          <Field label="회복에 쓰는 수치"><select value={melancholy.healerKey} onChange={event => setMelancholy({ ...melancholy, healerKey: event.target.value, healerGroup: TRAIT_KEYS.includes(event.target.value) ? 'traits' : 'passions' })}>{[...TRAIT_KEYS, ...passionOptions(character)].map(key => <option key={key} value={key}>{TRAIT_LABELS[key] || PASSION_LABELS[key] || key}</option>)}</select></Field>
          <Field label="기사 d20"><NumberInput min="1" max="20" value={melancholy.healerRoll} onChange={event => setMelancholy({ ...melancholy, healerRoll: event.target.value })} /></Field>
          <Field label="대상 Passion"><NumberInput min="1" value={melancholy.victimPassionValue} onChange={event => setMelancholy({ ...melancholy, victimPassionValue: event.target.value })} /></Field>
          <Field label="대상 d20"><NumberInput min="1" max="20" value={melancholy.victimRoll} onChange={event => setMelancholy({ ...melancholy, victimRoll: event.target.value })} /></Field>
        </div>
        <button type="button" className="primary-command" onClick={() => run(() => resolveExternalMelancholyRecovery(character, { ...melancholy, healerRoll: Number(melancholy.healerRoll), victimPassionValue: Number(melancholy.victimPassionValue), victimRoll: Number(melancholy.victimRoll), transactionId: bridge ? `${bridge.transactionId}:melancholy` : undefined, sourcePage: bridge ? `Ch.19 p.${bridge.sourcePage}` : 'Ch.3 p.79' }), '회복 대결과 양쪽 후유증을 적용했습니다.')}>회복 대결</button>
      </RuntimeSection>

      {bridgeAction === 'wrathful_lord_shock' && <RuntimeSection icon={AlertTriangle} title="Betrayal Shock" source="Ch.19 p.423 · Table 10–1" open>
        <p className="personality-source-warning">이 장면에서는 Passion 성공이 Shock를 일으키고, 실패한 기사만 Shock를 피합니다.</p>
        <div className="personality-grid">
          <Field label="Passion"><select value={scenarioShock.passionKey} onChange={event => setScenarioShock({ ...scenarioShock, passionKey: event.target.value })}><option value="honor">Honor</option><option value="loveFamily">Love [family]</option></select></Field>
          <Field label="Passion d20"><NumberInput min="1" max="20" value={scenarioShock.roll} onChange={event => setScenarioShock({ ...scenarioShock, roll: event.target.value })} /></Field>
          <Field label="Table 10–1 d20"><NumberInput min="1" max="20" value={scenarioShock.agingRoll} onChange={event => setScenarioShock({ ...scenarioShock, agingRoll: event.target.value })} /></Field>
          <Field label="능력치 d6 · 쉼표"><input value={scenarioShock.attributeRolls} onChange={event => setScenarioShock({ ...scenarioShock, attributeRolls: event.target.value })} /></Field>
        </div>
        <button type="button" className="primary-command" onClick={() => run(() => resolveScenarioPassionShock(character, { ...scenarioShock, roll: Number(scenarioShock.roll), agingRoll: toOptionalNumber(scenarioShock.agingRoll), attributeRolls: parseRolls(scenarioShock.attributeRolls), transactionId: `${bridge.transactionId}:shock`, sourcePage: 'Ch.19 p.423' }), '배신 Shock와 Table 10–1 결과를 기록했습니다.')}>Shock 판정</button>
      </RuntimeSection>}

      <RuntimeSection icon={ScrollText} title="Oath와 Honor" source="Ch.3 p.81">
        {!state.oath || state.oath.status !== 'active' ? <><div className="personality-grid"><Field label="종류"><select value={oath.kind} onChange={event => setOath({ ...oath, kind: event.target.value })}><option value="positive">Positive</option><option value="negative">Negative</option></select></Field><Field label="맹세"><input value={oath.text} onChange={event => setOath({ ...oath, text: event.target.value })} /></Field><Field label="Passion"><select value={oath.passionKey} onChange={event => setOath({ ...oath, passionKey: event.target.value })}>{passionOptions(character).map(key => <option key={key} value={key}>{PASSION_LABELS[key] || key}</option>)}</select></Field><Field label="d20"><NumberInput min="1" max="20" value={oath.roll} onChange={event => setOath({ ...oath, roll: event.target.value })} /></Field></div><button type="button" className="secondary-command" onClick={() => run(() => takeOath(character, { ...oath, roll: toOptionalNumber(oath.roll) }), '맹세와 Honor stake를 기록했습니다.')}>맹세</button></> : <div className="personality-resolution"><p>{state.oath.text} · Honor {state.oath.honorStake}</p><label className="personality-check"><input type="checkbox" checked={oath.fulfilled} onChange={event => setOath({ ...oath, fulfilled: event.target.checked })} />맹세 이행</label><button type="button" className="primary-command" onClick={() => run(() => settleOath(character, { fulfilled: oath.fulfilled }), '맹세 결과를 Honor ledger에 정산했습니다.')}>정산</button></div>}
      </RuntimeSection>

      <RuntimeSection icon={AlertTriangle} title="불명예와 영주의 심판" source="Table 3–2 · Ch.3 pp.74–75">
        <div className="personality-grid"><Field label="불명예 행위"><select value={dishonor.actId} onChange={event => setDishonor({ ...dishonor, actId: event.target.value })}>{DISHONORABLE_ACTS.map(item => <option key={item.id} value={item.id}>{item.label} · Honor −{item.honorLoss}</option>)}</select></Field><Field label="사건 기록"><input value={dishonor.note} onChange={event => setDishonor({ ...dishonor, note: event.target.value })} /></Field></div>
        <button type="button" className="secondary-command" onClick={() => run(() => applyDishonorableAct(character, dishonor), 'Table 3-2의 Honor 손실을 장부에 반영했습니다.')}>불명예 적용</button>
        {character.campaign?.honorStatus?.pendingLordJudgment && <div className="personality-resolution"><p>Honor {character.campaign.honorStatus.honor}. 영주는 추방 또는 기사 신분 박탈을 결정해야 합니다.</p><div className="personality-grid"><Field label="영주의 결정"><select value={dishonor.outcome} onChange={event => setDishonor({ ...dishonor, outcome: event.target.value })}><option value="degraded">기사 신분 박탈</option><option value="outlawed">추방</option></select></Field><Field label="판단 기록"><input value={dishonor.judgmentNote} onChange={event => setDishonor({ ...dishonor, judgmentNote: event.target.value })} /></Field></div><button type="button" className="primary-command" onClick={() => run(() => resolveHonorLordJudgment(character, { outcome: dishonor.outcome, note: dishonor.judgmentNote }), '영주의 원문상 필수 결정을 기록했습니다.')}>영주의 심판 확정</button></div>}
      </RuntimeSection>
    </div>}

    {section === 'amor' && <div className="personality-stack">
      <section className="personality-amor-status"><SectionHeader numeral="I" title="현재 Amor" latin="Amor Unicus" />{amor ? <><div className="personality-amor-facts"><div><span>대상</span><strong>{amor.targetName}</strong></div><div><span>값</span><strong>{amor.value}</strong></div><div><span>단계</span><strong>{amor.phase}</strong></div><div><span>Reluctance</span><strong>{amor.reluctanceInfinite ? '∞' : amor.reluctance ?? 'GM 대기'}</strong></div><div><span>완료 과업</span><strong>{amor.completedTasks}</strong></div></div>{bridgeAction?.startsWith('romance_') && <button type="button" className="secondary-command personality-resume" onClick={() => run(() => resumeAmorProcedure(character, { action: bridgeAction }), '현재 Amor가 이 Romance 단계의 조건을 충족했음을 기록했습니다.')}>현재 Amor 단계로 계속</button>}</> : <p className="personality-empty">현재 Amor가 없습니다.</p>}</section>

      <RuntimeSection icon={BookHeart} title="이교도 귀부인의 Amor" source="Ch.9 pp.170–171" open={bridgeAction === 'pagan_prison_amor'}>
        <p className="personality-source-warning">수동 Infatuation은 기사의 APP 대 귀부인의 Chaste, 능동 Amor는 APP 대 Honor입니다. 시작값은 원문대로 플레이어와 GM이 합의합니다.</p>
        <div className="personality-grid">
          <Field label="방식"><select value={paganAmor.mode} onChange={event => setPaganAmor({ ...paganAmor, mode: event.target.value })}><option value="passive">수동 Infatuation</option><option value="deliberate">능동 Amor</option></select></Field>
          <Field label="귀부인"><input value={paganAmor.ladyName} onChange={event => setPaganAmor({ ...paganAmor, ladyName: event.target.value })} /></Field>
          <Field label={paganAmor.mode === 'passive' ? '귀부인 Chaste' : '귀부인 Honor'}><NumberInput min="1" value={paganAmor.ladyResistanceValue} onChange={event => setPaganAmor({ ...paganAmor, ladyResistanceValue: event.target.value })} /></Field>
          <Field label="기사 APP d20"><NumberInput min="1" max="20" value={paganAmor.appRoll} onChange={event => setPaganAmor({ ...paganAmor, appRoll: event.target.value })} /></Field>
          <Field label="귀부인 d20"><NumberInput min="1" max="20" value={paganAmor.ladyRoll} onChange={event => setPaganAmor({ ...paganAmor, ladyRoll: event.target.value })} /></Field>
          <Field label="귀부인 Amor 합의값"><NumberInput min="1" value={paganAmor.ladyAmorValue} onChange={event => setPaganAmor({ ...paganAmor, ladyAmorValue: event.target.value })} /></Field>
          {paganAmor.mode === 'deliberate' && <Field label="기사 Amor 합의값"><NumberInput min="1" value={paganAmor.playerAmorValue} onChange={event => setPaganAmor({ ...paganAmor, playerAmorValue: event.target.value })} /></Field>}
        </div>
        <button type="button" className="secondary-command" onClick={() => run(() => resolvePaganLadyAmor(character, { ...paganAmor, ladyResistanceValue: Number(paganAmor.ladyResistanceValue), appRoll: toOptionalNumber(paganAmor.appRoll), ladyRoll: toOptionalNumber(paganAmor.ladyRoll), ladyAmorValue: Number(paganAmor.ladyAmorValue), playerAmorValue: Number(paganAmor.playerAmorValue), transactionId: bridgeAction === 'pagan_prison_amor' ? `${bridge.transactionId}:pagan-amor` : undefined }), '이교도 귀부인의 Amor 판정과 합의된 Passion을 저장했습니다.')}>Amor 판정</button>
      </RuntimeSection>

      {!amor && <RuntimeSection icon={BookHeart} title="Amor 선언" source="Ch.3 p.76 · Table 19–27" open>
        <div className="personality-grid">
          <Field label="대상"><input value={amorForm.targetName} onChange={event => setAmorForm({ ...amorForm, targetName: event.target.value })} /></Field>
          <Field label="비밀 호칭"><input value={amorForm.secretName} onChange={event => setAmorForm({ ...amorForm, secretName: event.target.value })} /></Field>
          <Field label="1d6"><NumberInput min="1" max="6" value={amorForm.roll} onChange={event => setAmorForm({ ...amorForm, roll: event.target.value })} /></Field>
          <Field label="상대"><select value={amorForm.amorGender} onChange={event => setAmorForm({ ...amorForm, amorGender: event.target.value })}><option value="woman">여성 · Glory 1,000마다 +1</option><option value="man">남성 · Glory 5,000마다 +1</option></select></Field>
          <Field label="상대 Glory"><NumberInput min="0" value={amorForm.amorGlory} onChange={event => setAmorForm({ ...amorForm, amorGlory: event.target.value })} /></Field>
          <Field label="상대 APP"><NumberInput min="0" value={amorForm.amorApp} onChange={event => setAmorForm({ ...amorForm, amorApp: event.target.value })} /></Field>
          <label className="personality-check"><input type="checkbox" checked={amorForm.amorSavedKnight} onChange={event => setAmorForm({ ...amorForm, amorSavedKnight: event.target.checked })} />상대가 기사의 생명을 구함 +5</label>
          <label className="personality-check"><input type="checkbox" checked={amorForm.knightSavedAmor} onChange={event => setAmorForm({ ...amorForm, knightSavedAmor: event.target.checked })} />기사가 상대를 절체절명에서 구함 +5</label>
          <label className="personality-check"><input type="checkbox" checked={amorForm.enemy} onChange={event => setAmorForm({ ...amorForm, enemy: event.target.checked })} />적대 가문·문화 −1</label>
          <label className="personality-check"><input type="checkbox" checked={amorForm.keep} onChange={event => setAmorForm({ ...amorForm, keep: event.target.checked })} />16 미만이어도 이 Amor를 받아들임</label>
        </div>
        <button type="button" className="primary-command" onClick={() => run(() => startAmor(character, { ...amorForm, roll: toOptionalNumber(amorForm.roll), amorGlory: Number(amorForm.amorGlory), amorApp: Number(amorForm.amorApp), transactionId: bridge ? `${bridge.transactionId}:amor` : undefined }), 'Amor 시작값과 Table 19–27 수정치를 적용했습니다.')}><BookHeart size={17} aria-hidden="true" />Amor 선언</button>
      </RuntimeSection>}

      {amor && amor.potentialAmor === null && <RuntimeSection icon={HeartHandshake} title="Potential Amor" source="Ch.3 p.76 · Ch.19 p.434" open>
        <div className="personality-grid"><Field label="GM 전용 값"><NumberInput min="1" value={amorForm.potential} onChange={event => setAmorForm({ ...amorForm, potential: event.target.value })} /></Field><Field label="상대 Chaste"><NumberInput min="0" value={amorForm.chaste} onChange={event => setAmorForm({ ...amorForm, chaste: event.target.value })} /></Field></div>
        <div className="personality-actions">{bridgeAction === 'love_conquers_all' ? <button type="button" className="secondary-command" onClick={prepareLoveTask}>다음 가속 과업 준비</button> : <button type="button" className="secondary-command" onClick={() => run(() => beginSelfImposedLoversTask(character), '상대와 만나기 전의 자가 과업을 열었습니다.')}>자가 과업 준비</button>}<button type="button" className="secondary-command" onClick={() => run(() => setPotentialAmor(character, { value: Number(amorForm.potential), chaste: Number(amorForm.chaste) }), '자가 과업 보너스를 더한 Potential Amor와 Reluctance를 저장했습니다.')}>Potential Amor 확정</button></div>
      </RuntimeSection>}

      {amor && ['declaration', 'wooing', 'task'].includes(amor.phase) && <RuntimeSection icon={ScrollText} title="선물, 접근과 Lover’s Task" source={bridgeAction === 'love_conquers_all' ? 'Ch.19 p.417' : 'Ch.19 pp.434–435'} open>
        {!amor.pendingTask && amor.phase !== 'task' && amor.potentialAmor !== null && <div className="personality-grid"><Field label="선물 £"><NumberInput min="1" value={approach.giftLivres} onChange={event => setApproach({ ...approach, giftLivres: event.target.value })} /></Field><Field label="Romance d20"><NumberInput min="1" max="20" value={approach.romanceRoll} onChange={event => setApproach({ ...approach, romanceRoll: event.target.value })} /></Field><button type="button" className="secondary-command" onClick={prepareLoveTask}>{bridgeAction === 'love_conquers_all' ? '다음 과업 준비' : '연간 접근'}</button></div>}
        {amor.phase === 'task' && !amor.pendingTask && <div className="personality-grid"><Field label={bridgeAction === 'love_conquers_all' ? 'p.417의 1d6 · 앱이 +6' : 'Table 19–28 d20'}><NumberInput min="1" max={bridgeAction === 'love_conquers_all' ? '6' : '20'} value={approach.taskRoll} onChange={event => setApproach({ ...approach, taskRoll: event.target.value })} /></Field><button type="button" className="secondary-command" onClick={drawTask}><Dices size={17} aria-hidden="true" />과업 확정</button></div>}
        {amor.pendingTask && <div className="personality-task"><p><span>현재 과업</span>{amor.pendingTask.result}</p><div className="personality-grid"><Field label="판정 수치"><input value={approach.taskTest} onChange={event => setApproach({ ...approach, taskTest: event.target.value })} /></Field><Field label="d20"><NumberInput min="1" max="20" value={approach.taskCheckRoll} onChange={event => setApproach({ ...approach, taskCheckRoll: event.target.value })} /></Field><Field label="GM·기존 엔진 결과"><input value={approach.gmNote} onChange={event => setApproach({ ...approach, gmNote: event.target.value })} /></Field><Field label="보석 비용 £"><NumberInput min="1" max="6" value={approach.jewelryLivres} onChange={event => setApproach({ ...approach, jewelryLivres: event.target.value })} /></Field></div><button type="button" className="primary-command" onClick={resolveTask}>과업 결과 적용</button></div>}
      </RuntimeSection>}

      {amor?.phase === 'essai' && <RuntimeSection icon={HeartHandshake} title="Essai" source="Ch.19 pp.434–435" open><div className="personality-grid"><Field label="Chaste d20"><NumberInput min="1" max="20" value={essai.chasteRoll} onChange={event => setEssai({ ...essai, chasteRoll: event.target.value })} /></Field><Field label="실패 시 Lustful d20"><NumberInput min="1" max="20" value={essai.lustfulRoll} onChange={event => setEssai({ ...essai, lustfulRoll: event.target.value })} /></Field></div><button type="button" className="primary-command" onClick={() => run(() => resolveEssai(character, { chasteRoll: toOptionalNumber(essai.chasteRoll), lustfulRoll: toOptionalNumber(essai.lustfulRoll) }), 'Essai 결과를 적용했습니다.')}>Essai 판정</button></RuntimeSection>}
      {amor?.phase === 'essai_passed' && <RuntimeSection icon={HeartHandshake} title="Consummation" source="Ch.19 p.435" open><p>Essai가 성공한 다음 Winter에 Amor가 Love [amor]로 바뀝니다.</p><button type="button" className="primary-command" onClick={() => run(() => consummateAmor(character), 'Amor를 Love [amor]로 전환했습니다.')}>Consummation 적용</button></RuntimeSection>}
      {amor?.phase === 'affair' && <RuntimeSection icon={Dices} title="Discovery와 Exposure" source="Tables 19–29/30 · p.435" open><div className="personality-grid"><Field label="1d6"><NumberInput min="1" max="6" value={discovery.discoveryDie} onChange={event => setDiscovery({ ...discovery, discoveryDie: event.target.value })} /></Field><Field label="관찰자 수치"><NumberInput min="0" value={discovery.observerValue} onChange={event => setDiscovery({ ...discovery, observerValue: event.target.value })} /></Field><Field label="Love d20"><NumberInput min="1" max="20" value={discovery.loveRoll} onChange={event => setDiscovery({ ...discovery, loveRoll: event.target.value })} /></Field><Field label="Discovery d20"><NumberInput min="1" max="20" value={discovery.discoveryRoll} onChange={event => setDiscovery({ ...discovery, discoveryRoll: event.target.value })} /></Field><Field label="실패 시 Exposure d20"><NumberInput min="1" max="20" value={discovery.exposureRoll} onChange={event => setDiscovery({ ...discovery, exposureRoll: event.target.value })} /></Field></div><button type="button" className="primary-command" onClick={() => run(() => resolveAmorDiscovery(character, Object.fromEntries(Object.entries(discovery).map(([key, value]) => [key, toOptionalNumber(value)]))), '발각 대결과 노출 결과를 기록했습니다.')}>Discovery 판정</button></RuntimeSection>}

      {amor && <RuntimeSection icon={MoonStar} title="Introspection" source="Ch.3 p.80"><div className="personality-grid"><Field label="게임 날짜"><input value={introspection.gameDay} onChange={event => setIntrospection({ ...introspection, gameDay: event.target.value })} placeholder="예: 768-spring-03" /></Field><Field label="Amor / Love d20"><NumberInput min="1" max="20" value={introspection.roll} onChange={event => setIntrospection({ ...introspection, roll: event.target.value })} /></Field><Field label="Critical 시 4d6 · 쉼표"><input value={introspection.durationRolls} onChange={event => setIntrospection({ ...introspection, durationRolls: event.target.value })} /></Field></div><button type="button" className="secondary-command" onClick={() => run(() => resolveIntrospection(character, { gameDay: introspection.gameDay, roll: toOptionalNumber(introspection.roll), durationRolls: parseRolls(introspection.durationRolls) }), '일일 Introspection 판정을 기록했습니다.')}>Introspection 판정</button>{activeConditions.filter(condition => condition.type === 'introspection').map(condition => <div className="personality-record" key={condition.id}><span>{condition.durationMinutes}분 · 지각/지식 판정 불가 · 자기방어 +5</span><button type="button" className="text-command" onClick={() => run(() => completeIntrospection(character, { conditionId: condition.id }), 'Introspection 시간을 종료했습니다.')}>종료</button></div>)}</RuntimeSection>}

      {bridgeAction === 'pagan_lady' && <RuntimeSection icon={AlertTriangle} title="Amor에서 Hate로" source="Ch.9 p.170 · Ch.19 p.420" open><div className="personality-grid"><Field label="주체"><input value={externalAmor.subject} onChange={event => setExternalAmor({ ...externalAmor, subject: event.target.value })} /></Field><Field label="대상"><input value={externalAmor.target} onChange={event => setExternalAmor({ ...externalAmor, target: event.target.value })} /></Field><Field label="값"><NumberInput min="1" value={externalAmor.value} onChange={event => setExternalAmor({ ...externalAmor, value: event.target.value })} /></Field><Field label="확정된 배신 근거"><input value={externalAmor.reason} onChange={event => setExternalAmor({ ...externalAmor, reason: event.target.value })} /></Field></div><button type="button" className="primary-command" onClick={() => run(() => convertExternalAmorToHate(character, { ...externalAmor, value: Number(externalAmor.value) }), '외부 Amor의 Hate 전환을 기록했습니다.')}>전환 기록</button></RuntimeSection>}
    </div>}

    {section === 'magic' && <div className="personality-stack">
      <RuntimeSection icon={Sparkles} title="Prayer" source="Tables 9–1/2 · pp.165–167" open>
        {bridgeProcedure.sourceEffect && <p className="personality-source-warning">{bridgeProcedure.sourceEffect}</p>}
        <div className="personality-grid">
          <Field label="기도 주체"><select value={prayer.beneficiary} onChange={event => setPrayer({ ...prayer, beneficiary: event.target.value })}><option value="self_prayer">본인의 기도 · Love [Charlemagne]</option><option value="other_prayer">타인의 기도 · Love [God]</option></select></Field>
          <Field label="청원"><input value={prayer.intention} onChange={event => setPrayer({ ...prayer, intention: event.target.value })} /></Field>
          <Field label="형식"><select value={prayer.form} onChange={event => setPrayer({ ...prayer, form: event.target.value })}><option value="mortal_peril">Mortal peril −2</option><option value="normal">Normal −1</option><option value="mass">Mass ±0</option></select></Field>
          <Field label="장소"><select value={prayer.place} onChange={event => setPrayer({ ...prayer, place: event.target.value })}><option value="ordinary">Ordinary −1</option><option value="church">Church ±0</option><option value="cathedral">Cathedral +1</option></select></Field>
          <Field label="날"><select value={prayer.day} onChange={event => setPrayer({ ...prayer, day: event.target.value })}><option value="ordinary">Ordinary −1</option><option value="sunday">Sunday ±0</option><option value="holy">Holy +1</option></select></Field>
          <Field label="함께 기도하는 신자"><select value={prayer.faithful} onChange={event => setPrayer({ ...prayer, faithful: event.target.value })}><option value="none">10명 이하 ±0</option><option value="ten">10명 초과 +1</option><option value="hundred">100명 초과 +2</option><option value="thousand">1,000명 초과 +3</option></select></Field>
          <Field label="성물"><select value={prayer.sacredItem} onChange={event => setPrayer({ ...prayer, sacredItem: event.target.value })}><option value="none">없음</option><option value="blessed">Blessed +1</option><option value="relic">Relic +2</option></select></Field>
          <label className="personality-check"><input type="checkbox" checked={prayer.onPilgrimage} onChange={event => setPrayer({ ...prayer, onPilgrimage: event.target.checked })} />순례 중 +1 이상</label>
          <label className="personality-check"><input type="checkbox" checked={prayer.gmUsesTable} onChange={event => setPrayer({ ...prayer, gmUsesTable: event.target.checked })} />GM이 Table 9–2 사용</label>
          <Field label="d20"><NumberInput min="1" max="20" value={prayer.roll} onChange={event => setPrayer({ ...prayer, roll: event.target.value })} /></Field>
        </div>
        {!activeResolution ? <button type="button" className="primary-command" onClick={() => run(() => beginPrayerResolution(character, { ...prayer, roll: toOptionalNumber(prayer.roll), transactionId: bridge ? `${bridge.transactionId}:prayer` : undefined, sourcePage: bridge ? `Ch.19 p.${bridge.sourcePage}` : undefined }), '기도 수정치와 Passion 결과를 확정했습니다.')}><Sparkles size={17} aria-hidden="true" />기도 판정</button> : activeResolution.type === 'prayer' && <div className="personality-resolution"><p>{activeResolution.outcome} · 행동 수정 {activeResolution.skillModifier >= 0 ? '+' : ''}{activeResolution.skillModifier}</p><button type="button" className="primary-command" onClick={completePassion}>후속 행동 성공으로 완료</button></div>}
      </RuntimeSection>

      <RuntimeSection icon={Sparkles} title="기적의 정확한 성격" source="Ch.9 p.166" open={['miracle_truth', 'noble_hostage_miracle'].includes(bridgeAction)}>
        <p className="personality-source-warning">기적의 발생과 정확한 결과는 앱이 결정하지 않습니다. GM이 원문 맥락에서 확정한 사실만 저장합니다.</p>
        <div className="personality-grid"><Field label="맥락"><input value={miracle.context} onChange={event => setMiracle({ ...miracle, context: event.target.value })} /></Field><Field label="GM이 정한 결과"><input value={miracle.chosenResult} onChange={event => setMiracle({ ...miracle, chosenResult: event.target.value })} /></Field><Field label="후속 상태"><input value={miracle.downstreamState} onChange={event => setMiracle({ ...miracle, downstreamState: event.target.value })} /></Field></div>
        <button type="button" className="secondary-command" onClick={() => run(() => recordMiracleDecision(character, { ...miracle, transactionId: bridge ? `${bridge.transactionId}:miracle` : undefined, sourcePage: bridge ? `Ch.19 p.${bridge.sourcePage}` : undefined }), 'GM의 기적 판단을 저장했습니다.')}>GM 판단 기록</button>
      </RuntimeSection>

      <RuntimeSection icon={MoonStar} title="Dreams" source="Ch.9 pp.168–169" open={bridgeProcedure.kind === 'dream'}>
        {bridgeProcedure.sourcePrompt && <p className="personality-source-warning">{bridgeProcedure.sourcePrompt}</p>}
        <div className="personality-grid"><Field label="Passion"><select value={dream.passionKey} onChange={event => setDream({ ...dream, passionKey: event.target.value })}><option value="loveGod">Love [God]</option><option value="loveCharlemagne">Love [Charlemagne]</option></select></Field><Field label="Passion d20"><NumberInput min="1" max="20" value={dream.passionRoll} onChange={event => setDream({ ...dream, passionRoll: event.target.value })} /></Field><Field label="Religion d20"><NumberInput min="1" max="20" value={dream.religionRoll} onChange={event => setDream({ ...dream, religionRoll: event.target.value })} /></Field><Field label={bridgeProcedure.messageSource === 'source' ? '원문 꿈 기록' : 'GM의 꿈 내용'}><input value={dream.message} onChange={event => setDream({ ...dream, message: event.target.value })} /></Field><Field label="해석 기록"><input value={dream.interpretation} onChange={event => setDream({ ...dream, interpretation: event.target.value })} /></Field></div>
        <button type="button" className="secondary-command" onClick={() => run(() => resolveDream(character, { ...dream, passionRoll: toOptionalNumber(dream.passionRoll), religionRoll: toOptionalNumber(dream.religionRoll), messageSource: bridgeProcedure.messageSource || 'GM', transactionId: bridge ? `${bridge.transactionId}:dream` : undefined, sourcePage: bridge ? `Ch.19 p.${bridge.sourcePage}` : undefined }), '꿈 판정과 출처가 있는 서술을 저장했습니다.')}><MoonStar size={17} aria-hidden="true" />꿈 판정</button>
      </RuntimeSection>
    </div>}

    {bridge && <section className="personality-return"><div><Check size={19} aria-hidden="true" /><span>필요한 canonical 거래가 완료되면 원래 모험 장면으로 돌아갑니다.</span></div><button type="button" className="primary-command" onClick={finishBridge}>모험으로 결과 반환<ChevronRight size={17} aria-hidden="true" /></button></section>}
    {notice && <div className="personality-message" role="status"><Check size={17} aria-hidden="true" />{notice}</div>}
    {error && <div className="personality-message personality-message--error" role="alert"><AlertTriangle size={17} aria-hidden="true" />{error}</div>}
  </article>;
}

import { ArrowRight, Award, BookOpen, Compass, Dices, Snowflake, Swords, UserRound, UsersRound } from 'lucide-react';
import { FolioHeading, LedgerRow, PendingAction, SectionHeader } from './ui/LedgerUI';
import { getActiveCharacterIdentity } from '../rules/lifecycleRules';
import { getChronicleEventPresentation, getChronicleTypeLabel } from '../utils/chronicleLabels';
import { getPlayActions } from '../app/playWorkspace';
import RulebookButton from '../features/rulebook/RulebookButton';

const getRecentChronicle = character => {
  const events = (character.campaign?.chronicleEvents || []).map(event => {
    const presentation = getChronicleEventPresentation(event);
    return { year: event.year || character.personal?.campaignYear, title: presentation.title, meta: getChronicleTypeLabel(presentation.type) };
  }).reverse();
  const journal = Object.entries(character.journal || {}).map(([year, entry]) => ({
    year: Number(year), title: String(entry.text || '').split('\n')[0].slice(0, 72), meta: '기사의 기록'
  }));
  return [...events, ...journal].sort((a, b) => b.year - a.year).slice(0, 5);
};

export default function Dashboard({ character, setActiveTab }) {
  const year = character.personal?.campaignYear || 767;
  const pending = getPlayActions(character);
  const current = pending[0];
  const recent = getRecentChronicle(character);
  const identity = getActiveCharacterIdentity(character);
  const creating = current?.kind === 'creation';
  const winterDone = Object.values(character.campaign?.winter?.steps || {}).filter(value => ['resolved', 'skipped'].includes(value)).length;
  const Icon = ['combat', 'battle', 'danger'].includes(current?.kind) ? Swords : current?.kind === 'adventure' ? Compass : creating ? UserRound : BookOpen;

  return <article className="folio-page dashboard-folio play-home view-animate">
    <FolioHeading eyebrow="Chronicon · Acta Praesentia" title={creating ? '새 기사의 연대' : `${identity.name}의 올해`} year={year}>
      {creating ? '한 기사의 시작에서 가문의 다음 세대까지' : character.personal?.personalClass}
    </FolioHeading>

    <div className="dashboard-columns dashboard-columns--resume">
      <section aria-labelledby="play-current-heading">
        <SectionHeader index="I" title="지금 할 일" />
        <div className={`campaign-now campaign-now--${current?.kind || 'pending'}`}>
          <Icon size={24} aria-hidden="true" />
          <div><h2 id="play-current-heading">{current?.title || '현재 미결 사항 없음'}</h2><p>{current?.detail || '올해의 기록을 확인하고 다음 행동을 선택합니다.'}</p></div>
          {current && <button type="button" className="primary-command" onClick={() => setActiveTab(current.tab)}>{current.actionLabel}<ArrowRight size={17} aria-hidden="true" /></button>}
        </div>
        {pending.length > 1 && <div className="pending-ledger pending-ledger--upcoming"><h3>이어지는 기록</h3>{pending.slice(1, 4).map(item => <PendingAction key={`${item.tab}:${item.title}`} title={item.title} onClick={() => setActiveTab(item.tab)} actionLabel={item.actionLabel}>{item.detail}</PendingAction>)}</div>}
        {!creating && <div className="play-quick-actions" aria-label="플레이 도구">
          <button type="button" className="secondary-command" onClick={() => setActiveTab('procedures')}><Dices size={18} aria-hidden="true" />기술 판정 · 여행</button>
          <button type="button" className="secondary-command" onClick={() => setActiveTab('personality')}><BookOpen size={18} aria-hidden="true" />Trait · Passion</button>
        </div>}
      </section>
      <section>
        <SectionHeader index="II" title={creating ? '생애의 흐름' : '최근 연대기'} action={!creating && <button type="button" className="text-command" onClick={() => setActiveTab('chronicle')}>전체 기록</button>} />
        {creating ? <>
          <ol className="play-life-loop"><li><strong>기사를 만든다</strong><span>출신 · 가족 · 능력 · 성향 · 기술 · 장비</span></li><li><strong>올해의 사건을 겪는다</strong><span>장면의 선택과 판정, 전투와 결과 기록</span></li><li><strong>겨울에 한 해를 닫는다</strong><span>10단계의 변화와 성장, 다음 연도와 계승</span></li></ol>
          <RulebookButton page={25} reason="기사 생성" label="기사 생성 원문" />
        </> : <div className="recent-chronicle">{recent.length ? recent.map((entry, index) => <LedgerRow key={`${entry.year}:${index}`} label={entry.title || '제목 없는 기록'} meta={entry.meta} value={entry.year} accent={index === 0} />) : <p className="muted-copy">아직 작성된 사건이 없습니다.</p>}</div>}
      </section>
    </div>

    {!creating && <section className="play-year-record" aria-label="올해의 기록">
      <SectionHeader index="III" title="올해의 기록" />
      <dl className="play-year-record__values">
        <div><dt><Compass size={17} aria-hidden="true" />모험</dt><dd>{character.campaign?.adventures?.active?.title || '진행 중인 모험 없음'}</dd></div>
        <div><dt><Award size={17} aria-hidden="true" />누적 Glory</dt><dd>{(character.gear?.gloryTotal || 0).toLocaleString()}</dd></div>
        <div><dt><Snowflake size={17} aria-hidden="true" />겨울 정산</dt><dd>{winterDone}/10</dd></div>
        <div><dt><UsersRound size={17} aria-hidden="true" />가문</dt><dd><button type="button" className="text-command" onClick={() => setActiveTab('family')}>{character.family?.name || '가문 기록'}</button></dd></div>
      </dl>
    </section>}
  </article>;
}

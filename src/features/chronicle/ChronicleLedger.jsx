import { useMemo, useState } from 'react';
import { Filter, ScrollText } from 'lucide-react';
import { EmptyState, FolioHeading, SectionHeader, StatusSeal } from '../../components/ui/LedgerUI';

const FILTERS = [
  ['all', '전체'],
  ['character', '기사'],
  ['family', '가문'],
  ['winter', '겨울'],
  ['battle', '전투'],
  ['glory', '영광'],
  ['marriage', '혼인'],
  ['death', '죽음'],
  ['succession', '계승'],
  ['miracle', '기적']
];

const ADMINISTRATIVE_JOURNAL = /겨울 정산 완료|단계 거래와|규칙 거래 중 연대기 사건/;

const normalizeEvents = character => {
  const events = (character.campaign?.chronicleEvents || []).map((event, index) => ({
    id: event.id || `chronicle-${index}`,
    year: Number(event.year || character.personal?.campaignYear || 767),
    age: event.age,
    type: String(event.type || event.category || 'character').toLowerCase(),
    title: event.title || event.label || '연대기 사건',
    narrative: event.narrative || event.summary || event.note || '',
    ruleId: event.sourceRuleId || event.ruleId || '',
    source: event.sourcePage || event.source || '',
    glory: event.glory,
    standing: event.standing,
    lifecycle: event.lifecycleEffect
  }));
  Object.entries(character.journal || {}).forEach(([year, entry]) => {
    const narrative = String(entry.text || '').split(/\n{2,}/).filter(block => !ADMINISTRATIVE_JOURNAL.test(block)).join('\n\n').trim();
    if (!narrative) return;
    events.push({
      id: `journal-${year}`,
      year: Number(year),
      type: /겨울/.test(entry.text) ? 'winter' : 'character',
      title: `${year}년 기록`,
      narrative,
      ruleId: '',
      source: '개인 일지'
    });
  });
  return events.sort((a, b) => b.year - a.year || a.id.localeCompare(b.id));
};

export default function ChronicleLedger({ character }) {
  const [filter, setFilter] = useState('all');
  const events = useMemo(() => normalizeEvents(character), [character]);
  const visibleEvents = filter === 'all' ? events : events.filter(event => event.type.includes(filter));
  const grouped = useMemo(() => visibleEvents.reduce((acc, event) => {
    (acc[event.year] ||= []).push(event);
    return acc;
  }, {}), [visibleEvents]);

  return (
    <article className="folio-page chronicle-folio view-animate">
      <FolioHeading eyebrow="Annales Regni · Registrum Eventuum" title="왕국 연대기" year={character.personal?.campaignYear || 767}>
        기사와 가문의 사건을 연도, 규칙, 결과에 따라 보존합니다.
      </FolioHeading>

      <SectionHeader index="I" title="사건 색인" meta={`${visibleEvents.length} Entries`} />
      <div className="chronicle-filters" role="group" aria-label="연대기 필터">
        <Filter size={15} aria-hidden="true" />
        {FILTERS.map(([id, label]) => (
          <button key={id} type="button" className={filter === id ? 'active' : ''} onClick={() => setFilter(id)} aria-pressed={filter === id}>{label}</button>
        ))}
      </div>

      {Object.keys(grouped).length ? Object.entries(grouped).map(([year, yearEvents]) => (
        <section className="chronicle-year" key={year}>
          <header><strong>{year}</strong><span lang="la">Anno Domini</span><small>{yearEvents.length}건</small></header>
          <div>
            {yearEvents.map(event => (
              <article className="chronicle-entry" key={event.id}>
                <div className="chronicle-entry__meta">
                  <StatusSeal tone={event.type === 'death' ? 'danger' : event.type === 'winter' ? 'active' : 'neutral'}>{event.type}</StatusSeal>
                  {event.age !== undefined && <span lang="en">Age {event.age}</span>}
                  {event.ruleId && <code>{event.ruleId}</code>}
                  {event.source && <span>{event.source}</span>}
                </div>
                <h2>{event.title}</h2>
                {event.narrative && <p>{event.narrative}</p>}
                {(event.glory !== undefined || event.standing || event.lifecycle) && (
                  <footer>
                    {event.glory !== undefined && <span lang="en">Glory {Number(event.glory) >= 0 ? '+' : ''}{event.glory}</span>}
                    {event.standing && <span lang="en">Standing {String(event.standing)}</span>}
                    {event.lifecycle && <span lang="en">Lifecycle {String(event.lifecycle)}</span>}
                  </footer>
                )}
              </article>
            ))}
          </div>
        </section>
      )) : <EmptyState title="조건에 맞는 연대기가 없습니다"><ScrollText size={18} aria-hidden="true" /> 다른 사건 분류를 선택해 보십시오.</EmptyState>}
    </article>
  );
}

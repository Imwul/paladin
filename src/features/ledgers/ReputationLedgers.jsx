import { Award, Crown } from 'lucide-react';
import { EmptyState, FolioHeading, LedgerRow, SectionHeader } from '../../components/ui/LedgerUI';

const STANDING_LABELS = {
  charlemagne: '샤를마뉴(Charlemagne)',
  liegeLord: '주군(Lord)',
  family: '가문(Family)',
  retinue: '수행단(Retinue)',
  church: '교회(Church)',
  commoners: '평민(Commoners)'
};

const getChronicleEntries = (character, type) => (character.campaign?.chronicleEvents || [])
  .filter(event => type === 'glory' ? event.glory !== undefined : event.standing || event.standingChanges)
  .sort((a, b) => Number(b.year || 0) - Number(a.year || 0));

export function StandingLedger({ character }) {
  const entries = getChronicleEntries(character, 'standing');
  return (
    <article className="folio-page reputation-ledger view-animate">
      <FolioHeading eyebrow="Registrum Dignitatis · Standing" title="지위 원장" year={character.personal?.campaignYear || 767}>
        각 공동체의 평판과 변동 근거를 연도별로 기록합니다.
      </FolioHeading>
      <SectionHeader index="I" title="현재 지위" meta="Current Standing" />
      <div className="standing-register">
        {Object.entries(character.standings || {}).map(([key, value]) => (
          <LedgerRow key={key} label={STANDING_LABELS[key] || key} meta={key.replace(/([A-Z])/g, ' $1').replace(/^./, letter => letter.toUpperCase())} value={value} accent={Number(value) >= 16} />
        ))}
      </div>
      <SectionHeader index="II" title="변동 기록" meta="Annual Changes" />
      {entries.length ? entries.map((entry, index) => <LedgerRow key={entry.id || index} label={entry.title || entry.label || '지위 변동'} meta={entry.sourceRuleId || entry.ruleId || 'Standing'} value={entry.year || '-'} />) : <EmptyState title="지위 변동 기록이 없습니다"><Crown size={18} aria-hidden="true" /> 이후의 규칙 거래가 이 원장에 자동으로 연결됩니다.</EmptyState>}
    </article>
  );
}

export function GloryLedger({ character }) {
  const entries = getChronicleEntries(character, 'glory');
  const inherited = entries.filter(entry => String(entry.type || '').includes('legacy')).reduce((sum, entry) => sum + Number(entry.glory || 0), 0);
  return (
    <article className="folio-page reputation-ledger view-animate">
      <FolioHeading eyebrow="Liber Gloriae · Deeds and Honors" title="영광 원장" year={character.personal?.campaignYear || 767}>
        위업, 연간 보유, 유산에서 발생한 영광(Glory)의 근거를 보존합니다.
      </FolioHeading>
      <section className="glory-totals" aria-label="영광 합계">
        <div><span lang="en">Total</span><strong>{(character.gear?.gloryTotal || 0).toLocaleString()}</strong><small>누적 영광</small></div>
        <div><span lang="en">Annual</span><strong>{(character.gear?.gloryThisGame || 0).toLocaleString()}</strong><small>이번 해</small></div>
        <div><span lang="en">Inherited</span><strong>{inherited.toLocaleString()}</strong><small>계승 기록</small></div>
      </section>
      <SectionHeader index="I" title="영광 변동" meta="Glory Ledger" />
      {entries.length ? entries.map((entry, index) => (
        <div className="glory-entry" key={entry.id || index}>
          <span>{entry.year || character.personal?.campaignYear}</span>
          <div><strong>{entry.title || entry.label || '영광 획득'}</strong><small>{entry.sourceRuleId || entry.ruleId || 'Glory'} · {entry.sourcePage || '기록 출처 없음'}</small></div>
          <b>{Number(entry.glory || 0) >= 0 ? '+' : ''}{entry.glory || 0}</b>
        </div>
      )) : <EmptyState title="구조화된 영광 변동 기록이 없습니다"><Award size={18} aria-hidden="true" /> 현재 총계는 보존되며, 이후 Winter 거래부터 근거가 함께 기록됩니다.</EmptyState>}
    </article>
  );
}

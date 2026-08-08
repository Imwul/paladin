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

const getLegacyEntries = (character, type) => (character.campaign?.chronicleEvents || [])
  .filter(event => type === 'glory'
    ? Number(event.glory || 0) !== 0
    : (Array.isArray(event.standing) ? event.standing.length > 0 : Boolean(event.standing || event.standingChanges)))
  .map((entry, index) => ({ ...entry, id: entry.id || `legacy-${type}-${index}`, amount: entry.amount ?? entry.glory ?? 0 }));

const getLedgerEntries = (character, type) => {
  const entries = type === 'glory' ? character.campaign?.gloryLedger : character.campaign?.standingLedger;
  return [...(Array.isArray(entries) && entries.length ? entries : getLegacyEntries(character, type))]
    .sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
};

const signed = value => `${Number(value || 0) >= 0 ? '+' : ''}${Number(value || 0).toLocaleString()}`;

export function StandingLedger({ character }) {
  const entries = getLedgerEntries(character, 'standing');
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
      {entries.length ? entries.map((entry, index) => (
        <div className="glory-entry standing-entry" key={entry.id || index}>
          <span>{entry.year || '-'}</span>
          <div>
            <strong>{entry.title || entry.label || '지위 변동'}</strong>
            <small>{STANDING_LABELS[entry.standingKey] || entry.standingKey || '지위'} · {entry.sourceRuleId || entry.ruleId || '규칙 출처 미기록'}{Number.isFinite(entry.before) && Number.isFinite(entry.after) ? ` · ${entry.before} → ${entry.after}` : ''}</small>
            {entry.narrative && <p>{entry.narrative}</p>}
          </div>
          <b aria-label={`${entry.amount || 0}점 변동`}>{signed(entry.amount)}</b>
        </div>
      )) : <EmptyState title="지위 변동 기록이 없습니다"><Crown size={18} aria-hidden="true" /> 이후의 규칙 거래가 이 원장에 자동으로 연결됩니다.</EmptyState>}
    </article>
  );
}

export function GloryLedger({ character }) {
  const entries = getLedgerEntries(character, 'glory');
  const inherited = entries.filter(entry => /legacy|inherit|계승|유산/i.test(`${entry.type || ''} ${entry.title || ''}`)).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  return (
    <article className="folio-page reputation-ledger view-animate">
      <FolioHeading eyebrow="Liber Gloriae · Deeds and Honors" title="영광 원장" year={character.personal?.campaignYear || 767}>
        위업, 연간 보유, 유산에서 발생한 영광(Glory)의 근거를 보존합니다.
      </FolioHeading>
      <section className="glory-totals" aria-label="영광 합계">
        <div><span>누적</span><strong>{(character.gear?.gloryTotal || 0).toLocaleString()}</strong><small>확정된 영광</small></div>
        <div><span>올해</span><strong>{(character.gear?.gloryThisGame || 0).toLocaleString()}</strong><small>겨울 반영 전</small></div>
        <div><span>계승</span><strong>{inherited.toLocaleString()}</strong><small>유산에서 얻음</small></div>
      </section>
      <SectionHeader index="I" title="영광 변동" meta="Glory Ledger" />
      {entries.length ? entries.map((entry, index) => (
        <div className="glory-entry" key={entry.id || index}>
          <span>{entry.year || character.personal?.campaignYear}</span>
          <div>
            <strong>{entry.title || entry.sourceLabel || entry.label || '영광 획득'}</strong>
            <small>{entry.sourceRuleId || entry.ruleId || '규칙 출처 미기록'} · {entry.sourcePage || '쪽수 미기록'}</small>
            {(entry.narrative || entry.calculation) && <p>{entry.narrative || entry.calculation}</p>}
          </div>
          <b>{entry.status === 'posting' ? `=${Number(entry.totalPosted || 0).toLocaleString()}` : signed(entry.amount)}</b>
        </div>
      )) : <EmptyState title="구조화된 영광 변동 기록이 없습니다"><Award size={18} aria-hidden="true" /> 현재 총계는 보존되며, 이후 Winter 거래부터 근거가 함께 기록됩니다.</EmptyState>}
    </article>
  );
}

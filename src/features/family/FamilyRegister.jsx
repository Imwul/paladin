import { useMemo, useState } from 'react';
import { Focus, UsersRound } from 'lucide-react';
import { FolioHeading, SectionHeader, StatusSeal } from '../../components/ui/LedgerUI';
import FamilyTree from '../../components/FamilyTree';

const memberTone = status => {
  if (status === '사망') return 'danger';
  if (['질병', '행동 불능', '병상', '포로', '실종'].includes(status)) return 'warning';
  if (['은퇴', '역사적'].includes(status)) return 'historical';
  return 'active';
};

export default function FamilyRegister({ character, setCharacter }) {
  const [focusGeneration, setFocusGeneration] = useState('all');
  const members = character.family?.members || [];
  const generations = useMemo(
    () => [...new Set((character.family?.members || []).map(member => member.generation))].sort((a, b) => a - b),
    [character.family?.members]
  );
  const visibleMembers = focusGeneration === 'all' ? members : members.filter(member => String(member.generation) === focusGeneration);
  const timeline = useMemo(() => [...(character.campaign?.familyTimeline || [])]
    .sort((a, b) => Number(b.year || 0) - Number(a.year || 0)), [character.campaign?.familyTimeline]);

  return (
    <article className="folio-page family-register view-animate">
      <FolioHeading eyebrow="Registrum Domus · Linea Successionis" title={`${character.family?.name || '무명'} 가문`} year={character.personal?.campaignYear || 767}>
        {character.family?.motto || '표어 미기록'} · {members.length}명의 혈족과 혼인 관계
      </FolioHeading>

      <SectionHeader index="I" title="세대별 가문 원부" meta="Mobile Focus Register" />
      <div className="generation-control" role="group" aria-label="세대 선택">
        <Focus size={15} aria-hidden="true" />
        <button type="button" className={focusGeneration === 'all' ? 'active' : ''} onClick={() => setFocusGeneration('all')}>전체</button>
        {generations.map(generation => <button type="button" key={generation} className={focusGeneration === String(generation) ? 'active' : ''} onClick={() => setFocusGeneration(String(generation))}>{generation}대</button>)}
      </div>
      <div className="family-lineage-bands">
        {visibleMembers.map(member => (
          <article key={member.id} className="family-register-row">
            <span className="family-register-row__generation">G{member.generation}</span>
            <div><strong>{member.name}</strong><small>{member.relation} · {member.lifeYears || '연대 미상'}</small></div>
            <StatusSeal tone={memberTone(member.status)}>{member.status}</StatusSeal>
            <p>{member.note || '기록 없음'}</p>
          </article>
        ))}
        {!visibleMembers.length && <div className="quiet-complete"><UsersRound size={18} aria-hidden="true" />이 세대에는 기록된 가문원이 없습니다.</div>}
      </div>

      <SectionHeader index="II" title="가문의 연대" meta="Birth · Marriage · Death · Succession" />
      <div className="family-timeline">
        {timeline.length ? timeline.map((event, index) => (
          <article key={event.id || index} className="family-timeline__entry">
            <time>{event.year || '연대 미상'}</time>
            <div><strong>{event.title || '가문 사건'}</strong>{event.narrative && <p>{event.narrative}</p>}</div>
            <StatusSeal tone={event.type === 'death' ? 'danger' : event.type === 'succession' || event.type === 'knighting' ? 'active' : 'neutral'}>{event.type || '가문'}</StatusSeal>
          </article>
        )) : <div className="quiet-complete"><UsersRound size={18} aria-hidden="true" />탄생, 혼인, 죽음과 계승이 이곳에 기록됩니다.</div>}
      </div>

      <SectionHeader index="III" title="계보 편집과 조상 연대" meta="Lineage Map · Ancestor History" />
      <div className="legacy-surface legacy-surface--family"><FamilyTree character={character} setCharacter={setCharacter} /></div>
    </article>
  );
}

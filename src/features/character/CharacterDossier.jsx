import { useState } from 'react';
import { Activity, BookOpen, Heart, History, Shield, Sparkles, UserRound } from 'lucide-react';
import { EmptyState, FolioHeading, SectionHeader, StatusSeal } from '../../components/ui/LedgerUI';
import LifecyclePanel from '../../components/LifecyclePanel';
import CharacterSheet from '../../components/CharacterSheet';
import { getActiveCharacterIdentity } from '../../rules/lifecycleRules';
import RulebookButton from '../rulebook/RulebookButton';

const lifecycleTone = status => ['deceased', 'retired'].includes(status) ? 'danger' : ['incapacitated', 'bedridden'].includes(status) ? 'warning' : 'active';

const LIFECYCLE_LABELS = {
  active: '활동 중',
  incapacitated: '행동 불능',
  bedridden: '병상 상태',
  pending_salvation: '구원 판정 대기',
  pending_legacy: '유산 정산 대기',
  pending_successor: '후계자 선택 대기',
  successor_in_creation: '후계자 생성 중',
  deceased: '사망',
  retired: '은퇴',
  historical: '역사적 인물'
};

const SCORE_LABELS = {
  honor: '명예',
  hospitality: '환대',
  loveCharlemagne: '샤를마뉴에 대한 사랑',
  loveFamily: '가문애',
  loveGod: '신앙',
  loyaltyLiege: '주군에 대한 충성',
  valorous: '용맹',
  generous: '관대',
  honest: '정직',
  just: '공정',
  merciful: '자비'
};

export default function CharacterDossier({ character, setCharacter, initialCharacterState }) {
  const needsCreation = !String(character.personal?.name || '').trim();
  const creationInProgress = Boolean(character.campaign?.characterCreationSession);
  const [view, setView] = useState(needsCreation ? 'record' : 'life');
  const [creationRequest, setCreationRequest] = useState(needsCreation ? 1 : 0);
  const lifecycleState = character.campaign?.lifecycle || {};
  const lifecycle = lifecycleState.status || lifecycleState.careerStatus || 'active';
  const lifecycleLabel = LIFECYCLE_LABELS[lifecycle] || lifecycle;
  const activeCharacter = getActiveCharacterIdentity(character);
  const prominentPassions = Object.entries(character.passions || {})
    .filter(([, value]) => Number.isFinite(Number(value)))
    .sort((left, right) => Number(right[1]) - Number(left[1]))
    .slice(0, 5);
  const prominentTraits = Object.entries(character.traits || {})
    .filter(([, value]) => Number(value) >= 13)
    .sort((left, right) => Number(right[1]) - Number(left[1]))
    .slice(0, 5);
  const recentEvents = [...(character.campaign?.chronicleEvents || [])]
    .sort((left, right) => Number(right.year || 0) - Number(left.year || 0))
    .slice(0, 4);
  const lifecycleNeedsAttention = !['active', 'historical'].includes(lifecycle);

  const openRecord = () => setView('record');
  const openCreation = () => {
    setView('record');
    setCreationRequest(value => value + 1);
  };

  return (
    <article className="folio-page character-dossier view-animate">
      <FolioHeading eyebrow={activeCharacter.active ? 'Dossier Militis · Persona Activa' : 'Dossier Militis · Vita Conclusa'} title={character.personal?.name || '이름 없는 기사'} year={character.personal?.campaignYear || 767}>
        {character.personal?.personalClass} · {character.personal?.homeland} · {character.personal?.age}세
      </FolioHeading>

      <section className="dossier-register" aria-label="기사 핵심 기록">
        <div className="dossier-monogram" aria-hidden="true">{String(character.personal?.name || 'P').trim().charAt(0)}</div>
        <div><UserRound size={15} aria-hidden="true" /><span>생애 상태</span><strong><StatusSeal tone={lifecycleTone(lifecycle)}>{lifecycleLabel}</StatusSeal></strong></div>
        <div><Activity size={15} aria-hidden="true" /><span>생명력</span><strong>{character.attributes?.currentHp || 0}/{(character.attributes?.siz || 0) + (character.attributes?.con || 0)}</strong></div>
        <div><Shield size={15} aria-hidden="true" /><span>명예</span><strong>{character.passions?.honor || 0}</strong></div>
        <div><Heart size={15} aria-hidden="true" /><span>가문애</span><strong>{character.passions?.loveFamily || 0}</strong></div>
        <div><Sparkles size={15} aria-hidden="true" /><span>누적 영광</span><strong>{(character.gear?.gloryTotal || 0).toLocaleString()}</strong></div>
      </section>

      <nav className="dossier-view-tabs" aria-label="기사 기록 보기">
        <button type="button" className={view === 'life' ? 'active' : ''} onClick={() => setView('life')} aria-pressed={view === 'life'}><History size={17} aria-hidden="true" />생애 기록</button>
        <button type="button" className={view === 'record' ? 'active' : ''} onClick={openRecord} aria-pressed={view === 'record'}><BookOpen size={17} aria-hidden="true" />기사 원부</button>
        {needsCreation && <button type="button" className="dossier-view-tabs__creation" onClick={openCreation}><Sparkles size={17} aria-hidden="true" />{creationInProgress ? '기사 생성 재개' : '기사 생성 시작'}</button>}
      </nav>

      {view === 'life' ? <>
        <div className="character-life-workspace">
          <section>
            <SectionHeader index="I" title="현재의 기사" meta="Persona Praesens" />
            <dl className="character-biography">
              <div><dt>신분</dt><dd>{character.personal?.personalClass || '기록 없음'}</dd></div>
              <div><dt>고향</dt><dd>{character.personal?.home || character.personal?.homeland || '기록 없음'}</dd></div>
              <div><dt>문화와 신앙</dt><dd>{[character.personal?.culture, character.personal?.religion].filter(Boolean).join(' · ') || '기록 없음'}</dd></div>
              <div><dt>주군</dt><dd>{character.personal?.liegeLord || '기록 없음'}</dd></div>
              <div><dt>가문의 표어</dt><dd>{character.family?.motto || '기록 없음'}</dd></div>
            </dl>
          </section>
          <section>
            <SectionHeader index="II" title="두드러진 성향" meta="Traits · Passions" action={<button type="button" className="text-command" onClick={openRecord}>전체 원부</button>} />
            <div className="character-defining-scores">
              {prominentPassions.map(([key, value]) => <div className="character-score character-score--passion" key={`passion:${key}`}><span>{SCORE_LABELS[key] || key}</span><strong>{value}</strong><small>Passion</small></div>)}
              {prominentTraits.map(([key, value]) => <div className="character-score character-score--trait" key={`trait:${key}`}><span>{SCORE_LABELS[key] || key}</span><strong>{value}</strong><small>Trait</small></div>)}
            </div>
          </section>
        </div>

        <SectionHeader index="III" title="최근 생애 사건" meta="Vita Recens" />
        {recentEvents.length ? <div className="character-recent-events">{recentEvents.map((event, index) => (
          <article key={event.id || `${event.year}:${index}`}><time>{event.year || character.personal?.campaignYear}</time><div><strong>{event.title || event.label || '연대기 사건'}</strong>{(event.narrative || event.summary || event.note) && <p>{event.narrative || event.summary || event.note}</p>}</div></article>
        ))}</div> : <EmptyState title="아직 생애 사건이 없습니다">모험과 겨울 정산의 중요한 결과가 이곳에 이어집니다.</EmptyState>}

        <details className="dossier-lifecycle" open={lifecycleNeedsAttention}>
          <summary><span>생애와 계승</span><small>사망 · 은퇴 · 구원 · 유산 · 후계</small><StatusSeal tone={lifecycleTone(lifecycle)}>{lifecycleLabel}</StatusSeal></summary>
          <div><LifecyclePanel character={character} setCharacter={setCharacter} onOpenCreation={openCreation} /></div>
        </details>
      </> : <>
        <SectionHeader index="I" title={needsCreation ? '첫 기사 생성' : '기사 원부'} meta="Attributes · Traits · Skills · Passions" action={<RulebookButton page={31} reason="Character records" />} />
        <div className="legacy-surface legacy-surface--character">
          <CharacterSheet key={`character-sheet:${creationRequest}`} character={character} setCharacter={setCharacter} initialCharacterState={initialCharacterState} creationRequest={creationRequest} />
        </div>
      </>}
    </article>
  );
}

import { Activity, Heart, Shield, Sparkles, UserRound } from 'lucide-react';
import { FolioHeading, SectionHeader, StatusSeal } from '../../components/ui/LedgerUI';
import LifecyclePanel from '../../components/LifecyclePanel';
import CharacterSheet from '../../components/CharacterSheet';
import { getActiveCharacterIdentity } from '../../rules/lifecycleRules';

const lifecycleTone = status => ['deceased', 'retired'].includes(status) ? 'danger' : ['incapacitated', 'bedridden'].includes(status) ? 'warning' : 'active';

export default function CharacterDossier({ character, setCharacter, initialCharacterState }) {
  const lifecycle = character.campaign?.lifecycle?.careerStatus || 'active';
  const activeCharacter = getActiveCharacterIdentity(character);
  return (
    <article className="folio-page character-dossier view-animate">
      <FolioHeading eyebrow={activeCharacter.active ? 'Dossier Militis · Persona Activa' : 'Dossier Militis · Vita Conclusa'} title={character.personal?.name || '이름 없는 기사'} year={character.personal?.campaignYear || 767}>
        {character.personal?.personalClass} · {character.personal?.homeland} · {character.personal?.age}세
      </FolioHeading>

      <section className="dossier-register" aria-label="기사 핵심 기록">
        <div className="dossier-monogram" aria-hidden="true">{String(character.personal?.name || 'P').trim().charAt(0)}</div>
        <div><UserRound size={15} aria-hidden="true" /><span>생애 상태</span><strong><StatusSeal tone={lifecycleTone(lifecycle)}>{lifecycle}</StatusSeal></strong></div>
        <div><Activity size={15} aria-hidden="true" /><span>생명력</span><strong>{character.attributes?.currentHp || 0}/{(character.attributes?.siz || 0) + (character.attributes?.con || 0)}</strong></div>
        <div><Shield size={15} aria-hidden="true" /><span>명예</span><strong>{character.passions?.honor || 0}</strong></div>
        <div><Heart size={15} aria-hidden="true" /><span>가문애</span><strong>{character.passions?.loveFamily || 0}</strong></div>
        <div><Sparkles size={15} aria-hidden="true" /><span>누적 영광</span><strong>{(character.gear?.gloryTotal || 0).toLocaleString()}</strong></div>
      </section>

      <SectionHeader index="I" title="생애와 계승" meta="Lifecycle · Salvation · Legacy" />
      <LifecyclePanel character={character} setCharacter={setCharacter} />

      <SectionHeader index="II" title="기사 원부" meta="Attributes · Traits · Skills · Passions" />
      <div className="legacy-surface legacy-surface--character">
        <CharacterSheet character={character} setCharacter={setCharacter} initialCharacterState={initialCharacterState} />
      </div>
    </article>
  );
}

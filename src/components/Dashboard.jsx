import { Award, BookOpen, Crown, ScrollText, Snowflake, UsersRound } from 'lucide-react';
import { FolioHeading, LedgerRow, PendingAction, SectionHeader, StatusSeal } from './ui/LedgerUI';
import { getActiveCharacterIdentity } from '../rules/lifecycleRules';
import bookOfHoursBorder from '../assets/book-of-hours-border.jpg';

const getPendingActions = character => {
  const actions = [];
  const lifecycle = character.campaign?.lifecycle || {};
  const winter = character.campaign?.winter || {};
  const health = character.campaign?.health || {};
  const combat = character.campaign?.combat;
  if (health.pendingDeath) actions.push({ tab: 'combat', title: '자정 전 생명 위기', detail: '생명력이 0 이하입니다. 응급처치로 양수까지 회복하거나 사망을 확정해야 합니다.' });
  else if (health.majorWoundCourage?.status === 'pending') actions.push({ tab: 'combat', title: '큰 부상 뒤 용기 판정', detail: '의식을 유지했지만 전투를 계속하려면 Valorous 판정이 필요합니다.' });
  else if (health.majorWoundCourage?.status === 'blocked') actions.push({ tab: 'combat', title: '전투 재진입 제한', detail: 'Valorous 판정 실패로, 외부 상황에 강제되지 않는 한 다시 교전할 수 없습니다.' });
  else if (health.majorWoundCourage?.status === 'must_withdraw') actions.push({ tab: 'combat', title: '도주 또는 항복', detail: 'Valorous 대실패 결과를 전투 결말에 기록해야 합니다.' });
  else if (health.surgeryNeeded) actions.push({ tab: 'combat', title: '외과 치료 필요', detail: '불건강 상태입니다. 이번 주 외과 치료와 자연 회복을 처리해야 합니다.' });
  if (combat?.status === 'active') actions.push({ tab: 'combat', title: `${combat.opponent?.name || '적'}와 교전 중`, detail: `${combat.round || 0}라운드까지 기록되었습니다. 다음 결정 단계부터 이어갑니다.` });
  if (lifecycle.status === 'pending_salvation') actions.push({ tab: 'character', title: '구원 판정', detail: '끝난 생애의 구원(Salvation) 판정이 남아 있습니다.' });
  if (lifecycle.status === 'pending_legacy') actions.push({ tab: 'character', title: '유산 선택', detail: '다음 기사에게 전할 점수와 유산(Legacy)을 선택해야 합니다.' });
  if (lifecycle.status === 'pending_successor') actions.push({ tab: 'family', title: '계승자 선택', detail: '가문의 연대를 이을 후계자를 지정해야 합니다.' });
  if (character.campaign?.honorStatus?.pendingLordJudgment) actions.push({ tab: 'personality', title: '영주의 명예 심판', detail: `Honor ${character.campaign.honorStatus.honor}. 원문에 따라 추방 또는 기사 신분 박탈을 결정해야 합니다.` });
  const unresolvedWinter = Object.keys(winter.unresolved || {});
  if (unresolvedWinter.length) actions.push({ tab: 'winter', title: '겨울 미결 항목', detail: `${unresolvedWinter.length}건의 선택 또는 판정이 기록에 남아 있습니다.` });
  const completeSteps = Object.values(winter.steps || {}).filter(value => ['resolved', 'skipped'].includes(value)).length;
  if (completeSteps < 10) actions.push({ tab: 'winter', title: `${character.personal?.campaignYear || 767}년 겨울 정산`, detail: `원문 순서 10단계 중 ${completeSteps}단계가 처리되었습니다.` });
  return actions;
};

const getRecentChronicle = character => {
  const structured = (character.campaign?.chronicleEvents || []).map(event => ({
    year: event.year || character.personal?.campaignYear,
    title: event.title || event.label || event.type || '연대기 사건',
    meta: event.sourceRuleId || event.ruleId || event.type || 'Chronicle'
  }));
  const journal = Object.entries(character.journal || {}).map(([year, entry]) => ({
    year: Number(year),
    title: String(entry.text || '').split('\n')[0].slice(0, 72),
    meta: 'Journal'
  }));
  return [...structured, ...journal].sort((a, b) => b.year - a.year).slice(0, 5);
};

export default function Dashboard({ character, setActiveTab }) {
  const year = character.personal?.campaignYear || 767;
  const pending = getPendingActions(character);
  const recent = getRecentChronicle(character);
  const familyMembers = character.family?.members || [];
  const livingFamily = familyMembers.filter(member => !['사망', '역사적'].includes(member.status)).length;
  const winterComplete = Object.values(character.campaign?.winter?.steps || {}).filter(value => ['resolved', 'skipped'].includes(value)).length;
  const activeCharacter = getActiveCharacterIdentity(character);

  return (
    <article className="folio-page dashboard-folio view-animate">
      <FolioHeading eyebrow="Chronicon Palatini · Folio Primum" title="왕실 연대기" year={year}>
        {activeCharacter.active ? `${activeCharacter.name}의 현행 기록` : '활성 기사 없이 계승을 기다리는 기록'}과 가문의 미결 사항
      </FolioHeading>

      <section className="dashboard-register" aria-label="현재 기록 요약">
        <figure className="dashboard-register__illumination">
          <img
            src={bookOfHoursBorder}
            alt="푸른 아칸서스와 금박 덩굴로 장식된 15세기 기도서 필사본"
            loading="eager"
            decoding="async"
          />
          <figcaption><span lang="la">Liber Horarum</span> · Paris, 1455</figcaption>
        </figure>
        <div className="dashboard-register__identity">
          <span className="serial-label">{activeCharacter.active ? 'Persona Activa' : 'Sedes Vacans'}</span>
          <h2>{activeCharacter.name}</h2>
          <p>{character.personal?.personalClass} · {character.personal?.homeland} · {character.personal?.age}세</p>
          <StatusSeal tone={activeCharacter.active ? 'active' : 'warning'}>{activeCharacter.active ? '현재 기사' : '계승 대기'}</StatusSeal>
        </div>
        <dl className="dashboard-register__stats">
          <div><dt><Award size={15} aria-hidden="true" />영광(Glory)</dt><dd>{(character.gear?.gloryTotal || 0).toLocaleString()}</dd></div>
          <div><dt><Crown size={15} aria-hidden="true" />가문 지위</dt><dd>{character.standings?.family || 0}</dd></div>
          <div><dt><UsersRound size={15} aria-hidden="true" />현존 가문원</dt><dd>{livingFamily}</dd></div>
          <div><dt><Snowflake size={15} aria-hidden="true" />겨울 정산</dt><dd>{winterComplete}/10</dd></div>
        </dl>
      </section>

      <div className="dashboard-columns">
        <section>
          <SectionHeader index="I" title="처리할 기록" meta="Acta Pendentia" />
          <div className="pending-ledger">
            {pending.length ? pending.slice(0, 4).map(item => (
              <PendingAction key={`${item.tab}:${item.title}`} title={item.title} onClick={() => setActiveTab(item.tab)} actionLabel="계속">
                {item.detail}
              </PendingAction>
            )) : (
              <div className="quiet-complete"><BookOpen size={18} aria-hidden="true" /><span>현재 미결 기록이 없습니다.</span></div>
            )}
          </div>
        </section>

        <section>
          <SectionHeader index="II" title="최근 연대기" meta="Annalium Recens" action={<button className="text-command" type="button" onClick={() => setActiveTab('chronicle')}>전체 보기</button>} />
          <div className="recent-chronicle">
            {recent.length ? recent.map((entry, index) => (
              <LedgerRow key={`${entry.year}:${index}`} label={entry.title || '제목 없는 기록'} meta={entry.meta} value={entry.year} accent={index === 0} />
            )) : <p className="muted-copy">아직 작성된 연대기 사건이 없습니다.</p>}
          </div>
        </section>
      </div>

      <section className="dashboard-ledgers">
        <SectionHeader index="III" title="가문의 현황" meta="Status Domus" />
        <div className="dashboard-ledgers__grid">
          <LedgerRow label="가문" meta="House" value={character.family?.name || '무명'} />
          <LedgerRow label="표어" meta="Motto" value={character.family?.motto || '기록 없음'} />
          <LedgerRow label="수호성인" meta="Patron" value={character.family?.patronSaint || '미정'} />
          <LedgerRow label="현재 모험" meta="Adventure" value={character.campaign?.currentAdventure?.title || '기록 없음'} />
          <LedgerRow label="현재 임무" meta="Quest" value={character.campaign?.currentQuest?.title || '기록 없음'} />
          <LedgerRow label="연간 영광" meta="Annual" value={character.gear?.gloryThisGame || 0} />
        </div>
      </section>

      <blockquote className="dashboard-motto">
        <ScrollText size={22} aria-hidden="true" />
        <p>“{character.family?.motto || '명예와 신조'}”</p>
        <cite>{character.family?.battleCry || character.family?.name}</cite>
      </blockquote>
    </article>
  );
}

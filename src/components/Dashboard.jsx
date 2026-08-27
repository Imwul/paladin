import { ArrowRight, Award, BookOpen, Compass, Crown, Snowflake, Swords, UserRound, UsersRound } from 'lucide-react';
import { FolioHeading, LedgerRow, PendingAction, SectionHeader, StatusSeal } from './ui/LedgerUI';
import { getActiveCharacterIdentity } from '../rules/lifecycleRules';
import { getChronicleTypeLabel } from '../utils/chronicleLabels';

const getPendingActions = character => {
  const actions = [];
  const lifecycle = character.campaign?.lifecycle || {};
  const winter = character.campaign?.winter || {};
  const health = character.campaign?.health || {};
  const combat = character.campaign?.combat;
  const activeWar = [character.campaign?.massBattle, character.campaign?.skirmish, character.campaign?.siege].find(item => item?.status === 'active');
  const adventure = character.campaign?.adventures?.active;
  const personalityConditions = character.campaign?.personalityMagic?.conditions || [];
  const pendingMadnessOnset = personalityConditions.find(item => item.type === 'madness' && item.status === 'active' && item.onset === 'gm_pending');
  const activeMadness = personalityConditions.find(item => item.type === 'madness' && item.status === 'active' && item.onset !== 'gm_pending');
  const adventureHistory = character.campaign?.adventures?.history || [];
  const needsCreation = !String(character.personal?.name || '').trim();
  const creationInProgress = Boolean(character.campaign?.characterCreationSession);
  const campaignYear = character.personal?.campaignYear || 767;
  const completeSteps = Object.values(winter.steps || {}).filter(value => ['resolved', 'skipped'].includes(value)).length;
  const winterReadyToClose = completeSteps === 10 && winter.currentStep === 'complete';
  const adventureCompletedThisYear = adventureHistory.some(item => item.status === 'complete' && Number(item.campaignYear) === campaignYear);
  if (health.pendingDeath) actions.push({ tab: 'combat', title: '자정 전 생명 위기', detail: '생명력이 0 이하입니다. 응급처치로 양수까지 회복하거나 사망을 확정해야 합니다.', actionLabel: '생명 위기 처리', kind: 'danger' });
  else if (health.majorWoundCourage?.status === 'pending') actions.push({ tab: 'combat', title: '큰 부상 뒤 용기 판정', detail: '의식을 유지했지만 전투를 계속하려면 Valorous 판정이 필요합니다.', actionLabel: '판정하기', kind: 'danger' });
  else if (health.majorWoundCourage?.status === 'blocked') actions.push({ tab: 'combat', title: '전투 재진입 제한', detail: 'Valorous 판정 실패로, 외부 상황에 강제되지 않는 한 다시 교전할 수 없습니다.', actionLabel: '상태 확인', kind: 'danger' });
  else if (health.majorWoundCourage?.status === 'must_withdraw') actions.push({ tab: 'combat', title: '도주 또는 항복', detail: 'Valorous 대실패 결과를 전투 결말에 기록해야 합니다.', actionLabel: '결말 기록', kind: 'danger' });
  else if (pendingMadnessOnset) actions.push({ tab: 'personality', title: 'Madness 발현 시점 결정', detail: 'Passion 대실패가 발생했습니다. GM은 광기가 즉시 또는 현재 행동 뒤에 발현하는지 정해야 합니다.', actionLabel: 'GM 결정', kind: 'danger' });
  else if (activeMadness) actions.push({ tab: 'personality', title: '기사가 광기에 빠졌습니다', detail: '캐릭터 시트는 GM에게 넘어갑니다. Winter Phase의 Madness Solo에서 회복 여부를 처리합니다.', actionLabel: '광기 상태 확인', kind: 'danger' });
  else if (health.surgeryNeeded) actions.push({ tab: 'combat', title: '외과 치료 필요', detail: '불건강 상태입니다. 이번 주 외과 치료와 자연 회복을 처리해야 합니다.', actionLabel: '치료하기', kind: 'warning' });
  if (combat?.status === 'active') actions.push({ tab: 'combat', title: `${combat.opponents?.[0]?.name || combat.opponent?.name || '적'}와 교전 중`, detail: `${combat.round || 1}라운드의 현재 결정 단계부터 이어갑니다. 이미 끝난 공격 결과는 다시 적용되지 않습니다.`, actionLabel: '전투로 복귀', kind: 'combat' });
  else if (activeWar) actions.push({ tab: 'battle', title: activeWar.name || activeWar.fortress || '진행 중인 전쟁', detail: '마지막으로 저장된 소규모 교전·대전투·공성 절차부터 이어갑니다.', actionLabel: '전쟁으로 복귀', kind: 'battle' });
  else if (adventure && ['active', 'deferred'].includes(adventure.status)) actions.push({ tab: 'adventure', title: adventure.title || '진행 중인 모험', detail: `${adventure.currentStageId || '현재 장면'} · ${Number(adventure.stageIndex || 0) + 1}번째 장면에서 이어갑니다.`, actionLabel: '모험으로 복귀', kind: 'adventure' });
  else if (winterReadyToClose) actions.push({ tab: 'winter', title: `${character.personal?.campaignYear || 767}년 겨울 장부 마감`, detail: '원문 10단계가 끝났습니다. 장부를 봉인해 다음 연도로 진행합니다.', actionLabel: '연도 마감', kind: 'winter' });
  else if (needsCreation) actions.push(creationInProgress
    ? { tab: 'character', title: '기사 생성을 계속하십시오', detail: '자동 저장된 생성 세션이 있습니다. 마지막으로 확정한 단계에서 이어갑니다.', actionLabel: '생성 재개', kind: 'creation' }
    : { tab: 'character', title: '첫 기사를 완성하십시오', detail: '이름과 출신, 성향, 기술을 확정하면 이 기사의 연대가 시작됩니다.', actionLabel: '기사 생성', kind: 'creation' });
  if (lifecycle.status === 'pending_salvation') actions.push({ tab: 'character', title: '구원 판정', detail: '끝난 생애의 구원(Salvation) 판정이 남아 있습니다.', actionLabel: '판정하기' });
  if (lifecycle.status === 'pending_legacy') actions.push({ tab: 'character', title: '유산 선택', detail: '다음 기사에게 전할 점수와 유산(Legacy)을 선택해야 합니다.', actionLabel: '유산 선택' });
  if (lifecycle.status === 'pending_successor') actions.push({ tab: 'family', title: '계승자 선택', detail: '가문의 연대를 이을 후계자를 지정해야 합니다.', actionLabel: '계승자 선택' });
  if (character.campaign?.honorStatus?.pendingLordJudgment) actions.push({ tab: 'personality', title: '영주의 명예 심판', detail: `Honor ${character.campaign.honorStatus.honor}. 원문에 따라 추방 또는 기사 신분 박탈을 결정해야 합니다.`, actionLabel: '심판 기록' });
  const unresolvedWinter = Object.keys(winter.unresolved || {});
  if (unresolvedWinter.length) actions.push({ tab: 'winter', title: '겨울 미결 항목', detail: `${unresolvedWinter.length}건의 선택 또는 판정이 기록에 남아 있습니다.`, actionLabel: '미결 처리' });
  if (!needsCreation && lifecycle.status === 'active' && !adventure && combat?.status !== 'active' && !activeWar && completeSteps === 0 && !adventureCompletedThisYear) {
    actions.push({ tab: 'adventure', title: `${campaignYear}년 첫 모험을 선택하십시오`, detail: '현재 기사에게 맞는 모험을 선택해 사건과 판정을 진행한 뒤 겨울 정산으로 넘어갑니다.', actionLabel: '모험 선택', kind: 'adventure' });
  }
  if (!needsCreation && completeSteps < 10) actions.push({ tab: 'winter', title: `${character.personal?.campaignYear || 767}년 겨울 정산`, detail: `원문 순서 10단계 중 ${completeSteps}단계가 처리되었습니다.`, actionLabel: completeSteps ? '정산 재개' : '정산 시작', kind: 'winter' });
  return actions;
};

const getRecentChronicle = character => {
  const structured = (character.campaign?.chronicleEvents || []).map(event => ({
    year: event.year || character.personal?.campaignYear,
    title: event.title || event.label || event.type || '연대기 사건',
    meta: event.sourceRuleId || event.ruleId || getChronicleTypeLabel(event.type)
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
  const current = pending[0];
  const upcoming = pending.slice(1, 4);
  const currentAdventure = character.campaign?.adventures?.active;
  const currentIcon = ['combat', 'battle'].includes(current?.kind) ? Swords : current?.kind === 'adventure' ? Compass : current?.kind === 'creation' ? UserRound : BookOpen;
  const CurrentIcon = currentIcon;

  return (
    <article className="folio-page dashboard-folio view-animate">
      <FolioHeading eyebrow="Chronicon Palatini · Folio Primum" title="왕실 연대기" year={year}>
        {activeCharacter.active ? `${activeCharacter.name}의 현행 기록` : '활성 기사 없이 계승을 기다리는 기록'}과 가문의 미결 사항
      </FolioHeading>

      <div className="dashboard-columns dashboard-columns--resume">
        <section>
          <SectionHeader index="I" title="지금 이어갈 일" meta="Acta Praesentia" />
          <div className={`campaign-now ${current?.kind ? `campaign-now--${current.kind}` : ''}`}>
            {current ? <>
              <CurrentIcon size={24} aria-hidden="true" />
              <div><span>현재 행동</span><h2>{current.title}</h2><p>{current.detail}</p></div>
              <button type="button" className="primary-command" onClick={() => setActiveTab(current.tab)}>{current.actionLabel}<ArrowRight size={17} aria-hidden="true" /></button>
            </> : <><BookOpen size={24} aria-hidden="true" /><div><span>현재 행동</span><h2>미결 기록 없음</h2><p>지금까지의 삶은 모두 장부에 정리되어 있습니다.</p></div></>}
          </div>
          {upcoming.length > 0 && <div className="pending-ledger pending-ledger--upcoming"><h3>그다음</h3>{upcoming.map(item => (
            <PendingAction key={`${item.tab}:${item.title}`} title={item.title} onClick={() => setActiveTab(item.tab)} actionLabel={item.actionLabel}>
              {item.detail}
            </PendingAction>
          ))}</div>}
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

      <section className="dashboard-register" aria-label="현재 기록 요약">
        <div className="dashboard-register__identity">
          <span className="serial-label">{activeCharacter.active ? 'Persona Activa' : 'Sedes Vacans'}</span>
          <h2>{activeCharacter.name}</h2>
          <p>{character.personal?.personalClass} · {character.personal?.homeland} · {character.personal?.age}세</p>
          <blockquote>{character.family?.motto || '명예와 신조'}</blockquote>
          <StatusSeal tone={activeCharacter.active ? 'active' : 'warning'}>{activeCharacter.active ? '현재 기사' : '계승 대기'}</StatusSeal>
        </div>
        <dl className="dashboard-register__stats">
          <div><dt><Award size={15} aria-hidden="true" />영광(Glory)</dt><dd>{(character.gear?.gloryTotal || 0).toLocaleString()}</dd></div>
          <div><dt><Crown size={15} aria-hidden="true" />가문 지위</dt><dd>{character.standings?.family || 0}</dd></div>
          <div><dt><UsersRound size={15} aria-hidden="true" />현존 가문원</dt><dd>{livingFamily}</dd></div>
          <div><dt><Snowflake size={15} aria-hidden="true" />겨울 정산</dt><dd>{winterComplete}/10</dd></div>
        </dl>
      </section>

      <section className="dashboard-ledgers">
        <SectionHeader index="III" title="가문의 현황" meta="Status Domus" />
        <div className="dashboard-ledgers__grid">
          <LedgerRow label="가문" meta="House" value={character.family?.name || '무명'} />
          <LedgerRow label="표어" meta="Motto" value={character.family?.motto || '기록 없음'} />
          <LedgerRow label="수호성인" meta="Patron" value={character.family?.patronSaint || '미정'} />
          <LedgerRow label="현재 모험" meta="Adventure" value={currentAdventure?.title || '기록 없음'} />
          <LedgerRow label="현재 임무" meta="Quest" value={character.campaign?.currentQuest?.title || '기록 없음'} />
          <LedgerRow label="연간 영광" meta="Annual" value={character.gear?.gloryThisGame || 0} />
        </div>
      </section>

    </article>
  );
}

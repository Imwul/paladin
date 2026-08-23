import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  BookOpenText,
  BookText,
  ChevronRight,
  Cloud,
  CloudDownload,
  CloudUpload,
  Coins,
  Compass,
  Crown,
  Dices,
  HeartHandshake,
  Menu,
  LogIn,
  LogOut,
  ScrollText,
  Scale,
  Settings,
  Shield,
  Swords,
  Snowflake,
  UserRound,
  UsersRound,
  X
} from 'lucide-react';
import { getCampaignPhase } from '../rules/campaignRules';
import { getActiveCharacterIdentity } from '../rules/lifecycleRules';
import knightInvestiture from '../assets/knight-investiture.jpg';
import RulebookButton from '../features/rulebook/RulebookButton';

export const NAV_ITEMS = [
  { id: 'dashboard', label: '표지', meta: 'Index', icon: BookOpen, group: 'campaign' },
  { id: 'character', label: '기사', meta: 'Dossier', icon: UserRound, group: 'campaign' },
  { id: 'family', label: '가문', meta: 'Lineage', icon: UsersRound, group: 'campaign' },
  { id: 'chronicle', label: '연대기', meta: 'Chronicle', icon: ScrollText, group: 'campaign' },
  { id: 'adventure', label: '모험', meta: 'Adventure', icon: Compass, group: 'campaign' },
  { id: 'combat', label: '전투와 회복', meta: 'Combat and Health', icon: Swords, group: 'campaign' },
  { id: 'battle', label: '대전투와 공성', meta: 'Battle and Siege', icon: Shield, group: 'campaign' },
  { id: 'winter', label: '겨울 정산', meta: 'Winter', icon: Snowflake, group: 'campaign' },
  { id: 'economy', label: '재산과 보물', meta: 'Wealth and Treasure', icon: Coins, group: 'ledger' },
  { id: 'personality', label: '성격과 신앙', meta: 'Personality and Faith', icon: HeartHandshake, group: 'ledger' },
  { id: 'standing', label: '지위', meta: 'Standing', icon: Crown, group: 'ledger' },
  { id: 'glory', label: '영광', meta: 'Glory', icon: Award, group: 'ledger' },
  { id: 'procedures', label: '원문 절차', meta: 'Canonical Procedures', icon: Scale, group: 'reference' },
  { id: 'oracles', label: '신탁', meta: 'Oracles', icon: Dices, group: 'reference' },
  { id: 'reference', label: '참조', meta: 'Reference', icon: BookText, group: 'reference' },
  { id: 'rulebook', label: '개인 룰북', meta: 'Personal Rulebook', icon: BookOpenText, group: 'reference' }
];

const NAV_GROUPS = [
  { id: 'campaign', label: '기사의 연대' },
  { id: 'ledger', label: '상태 장부' },
  { id: 'reference', label: '참조 도구', compact: true }
];

const getLifecycleLabel = (status) => ({
  active: '활동 중',
  incapacitated: '행동 불능',
  bedridden: '병상',
  deceased: '사망',
  retired: '은퇴',
  historical: '역사 기록',
  pending_salvation: '구원 판정 대기',
  pending_legacy: '유산 선택 대기',
  pending_successor: '계승자 선택 대기',
  successor_in_creation: '계승자 생성 중'
}[status] || status || '활동 중');

export default function AppShell({
  activeTab,
  character,
  children,
  cloudActions,
  cloudState,
  onNavigate,
  onOpenSettings
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const navigationRef = useRef(null);
  const year = character.personal?.campaignYear || 767;
  const phase = getCampaignPhase(year);
  const lifecycle = character.campaign?.lifecycle?.status || character.campaign?.lifecycle?.careerStatus;
  const lifecycleEnded = ['deceased', 'retired', 'historical', 'pending_salvation', 'pending_legacy', 'pending_successor'].includes(lifecycle);
  const healthLabel = lifecycleEnded ? getLifecycleLabel(lifecycle)
    : character.campaign?.health?.pendingDeath ? '자정 사망 대기'
      : character.campaign?.health?.unconscious ? '의식 없음'
        : character.campaign?.health?.surgeryNeeded ? '외과 필요'
          : getLifecycleLabel(lifecycle);
  const unresolvedCount = Object.values(character.campaign?.winter?.unresolved || {}).filter(Boolean).length
    + (character.campaign?.lifecycle?.unresolvedChoices?.length || 0)
    + (character.campaign?.economy?.ransoms?.filter(claim => claim.status !== 'settled').length || 0)
    + (character.campaign?.health?.pendingDeath ? 1 : 0)
    + (['pending', 'blocked', 'must_withdraw'].includes(character.campaign?.health?.majorWoundCourage?.status) ? 1 : 0);
  const adventurePending = character.campaign?.adventures?.active;
  const winterSteps = character.campaign?.winter?.steps || {};
  const winterDone = Object.values(winterSteps).filter(value => value === 'resolved' || value === 'skipped').length;
  const activeItem = NAV_ITEMS.find(item => item.id === activeTab) || NAV_ITEMS[0];
  const activeCharacter = getActiveCharacterIdentity(character);
  const captive = ['active', 'awaiting_ransom'].includes(character.campaign?.captivity?.status);
  const blockedWhileCaptive = new Set(['winter', 'adventure', 'combat', 'oracles']);
  const activeWar = character.campaign?.massBattle?.status === 'active'
    || character.campaign?.skirmish?.status === 'active'
    || character.campaign?.siege?.status === 'active';
  const winterInProgress = winterDone > 0 && (winterDone < 10 || character.campaign?.winter?.currentStep === 'complete');
  const continuation = character.campaign?.combat?.status === 'active'
    ? { tab: 'combat', label: '진행 중인 전투로 돌아가기' }
    : activeWar
      ? { tab: 'battle', label: '진행 중인 전쟁으로 돌아가기' }
      : adventurePending && ['active', 'deferred'].includes(adventurePending.status)
        ? { tab: 'adventure', label: adventurePending.title ? `${adventurePending.title}로 돌아가기` : '진행 중인 모험으로 돌아가기' }
        : winterInProgress
          ? { tab: 'winter', label: `${year}년 겨울 정산으로 돌아가기` }
          : null;

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const handleEscape = event => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key === 'Tab') {
        const focusable = [...(navigationRef.current?.querySelectorAll('button:not([disabled])') || [])];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    navigationRef.current?.querySelector('button:not([disabled])')?.focus();
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [activeTab]);

  const navigate = tab => {
    onNavigate(tab);
    setMobileOpen(false);
  };

  return (
    <div className="remaster-app">
      <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>

      <header className="royal-header">
        <div className="royal-header__identity">
          <span className="serial-label" lang="la">Codex Regius</span>
          <div className="royal-wordmark" aria-label="Paladin">
            <span lang="en">Paladin</span>
          </div>
          <p>샤를마뉴 대제의 기사 생애 기록부</p>
        </div>

        <div className="royal-header__registry" aria-label="현재 캠페인 기록">
          <div className="campaign-date"><span>현재 연대</span><strong>{year}년 · 제{phase?.number ?? 0}기</strong></div>
          <div className={`save-state save-state--${cloudState.tone}`} role="status" aria-live="polite">
            <span lang="en">Save</span><strong>{cloudState.label}</strong>
          </div>
          {cloudActions?.canLogin && (
            <button className="icon-command desktop-cloud-command" type="button" onClick={cloudActions.onLogin} aria-label="구글 계정으로 로그인" title="구글 계정으로 로그인">
              <LogIn size={18} aria-hidden="true" />
            </button>
          )}
          {cloudActions?.isLoggedIn && (
            <>
              <button className="icon-command desktop-cloud-command" type="button" onClick={cloudActions.onSave} disabled={cloudActions.isBusy} aria-busy={cloudActions.isBusy} aria-label="클라우드에 기록 올리기" title={`클라우드에 기록 올리기 · ${cloudState.label}`}><CloudUpload size={18} aria-hidden="true" /></button>
              <button className="icon-command desktop-cloud-command" type="button" onClick={cloudActions.onLoad} disabled={cloudActions.isBusy} aria-label="클라우드 기록 가져오기" title="클라우드 기록 가져오기"><CloudDownload size={18} aria-hidden="true" /></button>
              <button className="icon-command desktop-cloud-command" type="button" onClick={cloudActions.onLogout} disabled={cloudActions.isBusy} aria-label="클라우드 로그아웃" title="클라우드 로그아웃"><LogOut size={18} aria-hidden="true" /></button>
            </>
          )}
          <button className="icon-command" type="button" onClick={onOpenSettings} aria-label="설정과 저장 관리" title="설정과 저장 관리">
            <Settings size={18} aria-hidden="true" />
          </button>
          <button
            ref={menuButtonRef}
            className="icon-command mobile-menu-command"
            type="button"
            onClick={() => setMobileOpen(value => !value)}
            aria-expanded={mobileOpen}
            aria-controls="primary-navigation"
            aria-label={mobileOpen ? '목차 닫기' : '목차 열기'}
          >
            {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div className="campaign-strip" aria-label="캠페인 현재 상태">
        <span><UserRound size={14} aria-hidden="true" /> {activeCharacter.name}</span>
        <span>{healthLabel}</span>
        <span><Snowflake size={14} aria-hidden="true" /> 겨울 {winterDone}/10</span>
        <span className={unresolvedCount || adventurePending ? 'campaign-strip__warning' : ''}>미결 {unresolvedCount + (adventurePending ? 1 : 0)}</span>
        {continuation && activeTab !== continuation.tab && (
          <button type="button" className="campaign-strip__continue" onClick={() => navigate(continuation.tab)}>
            <ArrowLeft size={14} aria-hidden="true" /> {continuation.label}
          </button>
        )}
      </div>

      <div className="remaster-frame">
        <nav
          ref={navigationRef}
          id="primary-navigation"
          className={`folio-navigation ${mobileOpen ? 'is-open' : ''}`}
          aria-label="왕실 장부 목차"
        >
          <div className="folio-navigation__heading">
            <span lang="la">Index Generalis</span>
            <strong>장부 목차</strong>
          </div>
          {NAV_GROUPS.map(group => (
            <section className={`folio-navigation__group ${group.compact ? 'folio-navigation__group--compact' : ''}`} key={group.id} aria-labelledby={`navigation-${group.id}`}>
              <h2 id={`navigation-${group.id}`}>{group.label}</h2>
              <ol>
                {NAV_ITEMS.filter(item => item.group === group.id).map(item => {
                  const Icon = item.icon;
                  const active = item.id === activeTab;
                  const index = NAV_ITEMS.findIndex(entry => entry.id === item.id);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={active ? 'active' : ''}
                        onClick={() => navigate(item.id)}
                        aria-current={active ? 'page' : undefined}
                        disabled={captive && blockedWhileCaptive.has(item.id)}
                        title={captive && blockedWhileCaptive.has(item.id) ? '포로 상태를 먼저 해결해야 합니다.' : item.meta}
                      >
                        <span className="folio-navigation__number">{String(index + 1).padStart(2, '0')}</span>
                        <Icon size={17} aria-hidden="true" />
                        <span className="folio-navigation__label"><b>{item.label}</b></span>
                        <ChevronRight size={15} aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
          <figure className="folio-navigation__plate">
            <img
              src={knightInvestiture}
              alt="군주 앞에서 서임되는 중세 기사들의 필사본 도판"
              loading="lazy"
              decoding="async"
            />
            <figcaption>기사 서임 · BnF Fr. 4274, f.8v</figcaption>
          </figure>
        </nav>

        {mobileOpen && <button type="button" className="navigation-scrim" onClick={() => setMobileOpen(false)} aria-label="목차 닫기" />}

        <main id="main-content" className="folio-main" tabIndex="-1">
          <div className="folio-breadcrumb" aria-label="현재 위치">
            <span lang="la">Palatinum</span><ChevronRight size={12} aria-hidden="true" /><strong>{activeItem.label}</strong>
            <RulebookButton reason={activeItem.meta} label="현재 원문" />
            <span lang="en">{activeItem.meta}</span>
          </div>
          {children}
        </main>
      </div>

      <footer className="royal-footer">
        <span lang="en">Paladin · Living Chronicle</span>
        <span><Cloud size={13} aria-hidden="true" /> 오프라인 우선 기록 · Schema v12</span>
      </footer>
    </div>
  );
}

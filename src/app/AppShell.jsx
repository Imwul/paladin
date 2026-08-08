import { useEffect, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  BookText,
  CalendarDays,
  ChevronRight,
  Cloud,
  CloudDownload,
  CloudUpload,
  Compass,
  Crown,
  Dices,
  Menu,
  LogIn,
  LogOut,
  ScrollText,
  Settings,
  Shield,
  Snowflake,
  UserRound,
  UsersRound,
  X
} from 'lucide-react';
import { getCampaignPhase } from '../rules/campaignRules';
import knightInvestiture from '../assets/knight-investiture.jpg';

export const NAV_ITEMS = [
  { id: 'dashboard', label: '표지', meta: 'INDEX', icon: BookOpen },
  { id: 'chronicle', label: '연대기', meta: 'CHRONICLE', icon: ScrollText },
  { id: 'character', label: '기사', meta: 'DOSSIER', icon: UserRound },
  { id: 'family', label: '가문', meta: 'LINEAGE', icon: UsersRound },
  { id: 'winter', label: '겨울 정산', meta: 'WINTER', icon: Snowflake },
  { id: 'adventure', label: '모험', meta: 'ADVENTURE', icon: Compass },
  { id: 'standing', label: '지위', meta: 'STANDING', icon: Crown },
  { id: 'glory', label: '영광', meta: 'GLORY', icon: Award },
  { id: 'oracles', label: '신탁', meta: 'ORACLES', icon: Dices },
  { id: 'reference', label: '참조', meta: 'REFERENCE', icon: BookText }
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
  const unresolvedCount = Object.values(character.campaign?.winter?.unresolved || {}).filter(Boolean).length
    + (character.campaign?.lifecycle?.unresolvedChoices?.length || 0);
  const winterSteps = character.campaign?.winter?.steps || {};
  const winterDone = Object.values(winterSteps).filter(value => value === 'resolved' || value === 'skipped').length;
  const activeItem = NAV_ITEMS.find(item => item.id === activeTab) || NAV_ITEMS[0];

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

  const navigate = tab => {
    onNavigate(tab);
    setMobileOpen(false);
  };

  return (
    <div className="remaster-app">
      <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>

      <header className="royal-header">
        <div className="royal-header__identity">
          <span className="serial-label" lang="la">CODEX REGIUS · 0767</span>
          <div className="royal-wordmark" aria-label="Paladin">
            <span lang="en">PALADIN</span>
          </div>
          <p>샤를마뉴 대제의 기사 생애 기록부</p>
        </div>

        <div className="royal-header__registry" aria-label="현재 캠페인 기록">
          <div><span>ANNO</span><strong>{year}</strong></div>
          <div><span>FOLIO</span><strong>{String(NAV_ITEMS.findIndex(item => item.id === activeTab) + 1).padStart(2, '0')}</strong></div>
          <div><span>REV.</span><strong>{character.campaign?.saveRevision || 0}</strong></div>
          <div className={`save-state save-state--${cloudState.tone}`} role="status" aria-live="polite">
            <span>SAVE</span><strong>{cloudState.label}</strong>
          </div>
          {cloudActions?.canLogin && (
            <button className="icon-command desktop-cloud-command" type="button" onClick={cloudActions.onLogin} aria-label="구글 계정으로 로그인" title="구글 계정으로 로그인">
              <LogIn size={18} aria-hidden="true" />
            </button>
          )}
          {cloudActions?.isLoggedIn && (
            <>
              <button className="icon-command desktop-cloud-command" type="button" onClick={cloudActions.onSave} aria-label="클라우드에 기록 올리기" title="클라우드에 기록 올리기"><CloudUpload size={18} aria-hidden="true" /></button>
              <button className="icon-command desktop-cloud-command" type="button" onClick={cloudActions.onLoad} aria-label="클라우드 기록 가져오기" title="클라우드 기록 가져오기"><CloudDownload size={18} aria-hidden="true" /></button>
              <button className="icon-command desktop-cloud-command" type="button" onClick={cloudActions.onLogout} aria-label="클라우드 로그아웃" title="클라우드 로그아웃"><LogOut size={18} aria-hidden="true" /></button>
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
        <span><CalendarDays size={14} aria-hidden="true" /> {year}년</span>
        <span><Shield size={14} aria-hidden="true" /> Phase {phase?.number ?? 0}</span>
        <span><UserRound size={14} aria-hidden="true" /> {character.personal?.name || '이름 없는 기사'}</span>
        <span>{getLifecycleLabel(lifecycle)}</span>
        <span><Snowflake size={14} aria-hidden="true" /> 겨울 {winterDone}/10</span>
        <span className={unresolvedCount ? 'campaign-strip__warning' : ''}>미결 {unresolvedCount}</span>
      </div>

      <div className="remaster-frame">
        <nav
          ref={navigationRef}
          id="primary-navigation"
          className={`folio-navigation ${mobileOpen ? 'is-open' : ''}`}
          aria-label="왕실 장부 목차"
        >
          <div className="folio-navigation__heading">
            <span lang="la">INDEX GENERALIS</span>
            <strong>장부 목차</strong>
          </div>
          <ol>
            {NAV_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const active = item.id === activeTab;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={active ? 'active' : ''}
                    onClick={() => navigate(item.id)}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className="folio-navigation__number">{String(index + 1).padStart(2, '0')}</span>
                    <Icon size={17} aria-hidden="true" />
                    <span className="folio-navigation__label"><b>{item.label}</b><small lang="en">{item.meta}</small></span>
                    <ChevronRight size={15} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ol>
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
            <span lang="la">PALATINUM</span><ChevronRight size={12} aria-hidden="true" /><strong>{activeItem.label}</strong><span lang="en">{activeItem.meta}</span>
          </div>
          {children}
        </main>
      </div>

      <footer className="royal-footer">
        <span lang="en">PALADIN · LIVING CHRONICLE</span>
        <span><Cloud size={13} aria-hidden="true" /> 오프라인 우선 기록 · Schema v5</span>
      </footer>
    </div>
  );
}

import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LoadingState } from '../../components/ui/LedgerUI';
import { getContextForView, parseSourcePage } from './rulebookData';
import {
  addRecent,
  readRulebookLibrary,
  toggleBookmark,
  updatePageNote,
  writeRulebookLibrary
} from './rulebookStorage';

const RulebookDrawer = lazy(() => import('./RulebookDrawer'));
const RulebookContext = createContext(null);

export function RulebookProvider({ activeView, onNavigate, children }) {
  const defaultContext = getContextForView(activeView);
  const [drawer, setDrawer] = useState({ open: false, page: defaultContext.page, reason: defaultContext.label, query: '' });
  const [library, setLibrary] = useState(readRulebookLibrary);

  useEffect(() => {
    try {
      writeRulebookLibrary(library);
    } catch (error) {
      console.warn('Rulebook library could not be saved:', error);
    }
  }, [library]);

  const openRulebook = useCallback(input => {
    const context = getContextForView(activeView);
    const page = parseSourcePage(input?.page ?? input?.sourcePage, context.page);
    setDrawer({ open: true, page, reason: input?.reason || context.label, query: String(input?.query || '') });
  }, [activeView]);

  const closeRulebook = useCallback(() => setDrawer(current => ({ ...current, open: false })), []);
  const rememberPage = useCallback(entry => setLibrary(current => addRecent(current, entry)), []);
  const bookmarkPage = useCallback(entry => setLibrary(current => toggleBookmark(current, entry)), []);
  const saveNote = useCallback((page, value, kind) => setLibrary(current => updatePageNote(current, page, value, kind)), []);
  const navigateToGame = useCallback(view => {
    if (!view || view === 'rulebook') return;
    onNavigate(view);
    closeRulebook();
  }, [closeRulebook, onNavigate]);

  const value = useMemo(() => ({
    activeView,
    drawer,
    library,
    openRulebook,
    closeRulebook,
    rememberPage,
    bookmarkPage,
    saveNote,
    navigateToGame
  }), [activeView, bookmarkPage, closeRulebook, drawer, library, navigateToGame, openRulebook, rememberPage, saveNote]);

  return (
    <RulebookContext.Provider value={value}>
      {children}
      {drawer.open && (
        <Suspense fallback={<div className="rulebook-drawer-fallback"><LoadingState label="원문 장을 펼치는 중" /></div>}>
          <RulebookDrawer />
        </Suspense>
      )}
    </RulebookContext.Provider>
  );
}

export function useRulebook() {
  const context = useContext(RulebookContext);
  if (!context) throw new Error('useRulebook must be used inside RulebookProvider');
  return context;
}

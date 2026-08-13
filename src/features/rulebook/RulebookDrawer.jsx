import { useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import useDialogFocus from '../../hooks/useDialogFocus';
import RulebookReader from './RulebookReader';
import { useRulebook } from './RulebookContext';
import './RulebookReader.css';

export default function RulebookDrawer() {
  const { drawer, closeRulebook } = useRulebook();
  const panelRef = useRef(null);
  const close = useCallback(() => closeRulebook(), [closeRulebook]);
  useDialogFocus(true, panelRef, close);

  return (
    <div className="rulebook-drawer-layer" role="presentation">
      <button type="button" className="rulebook-drawer-scrim" onClick={close} aria-label="룰북 닫기" />
      <aside ref={panelRef} className="rulebook-drawer" role="dialog" aria-modal="true" aria-labelledby="rulebook-drawer-title">
        <header className="rulebook-drawer__header">
          <div><span>Personal Rulebook · v1.1</span><h2 id="rulebook-drawer-title">{drawer.reason}</h2></div>
          <button type="button" className="icon-command" onClick={close} aria-label="룰북 닫기" title="룰북 닫기"><X size={20} aria-hidden="true" /></button>
        </header>
        <RulebookReader key={`${drawer.page}:${drawer.query}`} initialPage={drawer.page} initialQuery={drawer.query} compact />
      </aside>
    </div>
  );
}

import { useRef } from 'react';
import { Cloud, FileClock, HardDrive, X } from 'lucide-react';
import useDialogFocus from '../hooks/useDialogFocus';

export default function SaveConflictDialog({ conflict, onClose, onUseCloud, onKeepLocal }) {
  const dialogRef = useRef(null);
  useDialogFocus(Boolean(conflict), dialogRef, onClose);
  if (!conflict) return null;
  const localRevision = conflict.local?.campaign?.saveRevision || 0;
  const cloudRevision = conflict.cloud?.campaign?.saveRevision || 0;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} className="document-conflict" role="dialog" aria-modal="true" aria-labelledby="save-conflict-title" aria-describedby="save-conflict-description">
        <header>
          <span className="serial-label">DOCUMENT REVISION CONFLICT</span>
          <h2 id="save-conflict-title">서로 다른 기록본이 발견되었습니다</h2>
          <button type="button" className="icon-command" onClick={onClose} aria-label="충돌 창 닫기"><X size={18} aria-hidden="true" /></button>
        </header>
        <p id="save-conflict-description">로컬 장부와 클라우드 장부의 내용이 다릅니다. 어느 기록본을 현재 원본으로 사용할지 선택하십시오.</p>
        <div className="document-conflict__versions">
          <article>
            <HardDrive size={20} aria-hidden="true" />
            <span>LOCAL FOLIO</span>
            <strong>개정 {localRevision}</strong>
            <small>{conflict.local?.personal?.campaignYear || '-'}년 · {conflict.local?.personal?.name || '기사 기록'}</small>
            <button type="button" className="btn-medieval" onClick={onKeepLocal}>로컬 기록 유지</button>
          </article>
          <article>
            <Cloud size={20} aria-hidden="true" />
            <span>CLOUD FOLIO</span>
            <strong>개정 {cloudRevision}</strong>
            <small>{conflict.cloud?.personal?.campaignYear || '-'}년 · {conflict.cloud?.personal?.name || '기사 기록'}</small>
            <button type="button" className="btn-medieval btn-medieval-primary" onClick={onUseCloud}>클라우드 기록 사용</button>
          </article>
        </div>
        <footer><FileClock size={15} aria-hidden="true" /> 선택하지 않으면 현재 로컬 장부가 계속 유지됩니다.</footer>
      </section>
    </div>
  );
}

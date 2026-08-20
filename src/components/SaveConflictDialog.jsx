import { useRef } from 'react';
import { Cloud, FileClock, HardDrive, X } from 'lucide-react';
import useDialogFocus from '../hooks/useDialogFocus';

const formatCloudTime = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

export default function SaveConflictDialog({ conflict, onClose, onUseCloud, onKeepLocal, isBusy = false }) {
  const dialogRef = useRef(null);
  useDialogFocus(Boolean(conflict), dialogRef, onClose);
  if (!conflict) return null;
  const localRevision = conflict.local?.campaign?.saveRevision || 0;
  const cloudRevision = conflict.cloud?.campaign?.saveRevision || 0;
  const cloudUpdatedAt = formatCloudTime(conflict.cloudUpdatedAt);
  const concurrentChange = conflict.reason === 'concurrent';
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && !isBusy && onClose()}>
      <section ref={dialogRef} className="document-conflict" role="dialog" aria-modal="true" aria-labelledby="save-conflict-title" aria-describedby="save-conflict-description">
        <header>
          <span className="serial-label" lang="en">Document revision conflict</span>
          <h2 id="save-conflict-title">서로 다른 기록본이 발견되었습니다</h2>
          <button type="button" className="icon-command" onClick={onClose} disabled={isBusy} aria-label="충돌 창 닫기"><X size={18} aria-hidden="true" /></button>
        </header>
        <p id="save-conflict-description">
          {concurrentChange
            ? '업로드하는 동안 다른 기기에서 클라우드 기록이 갱신되었습니다. 덮어쓰기 전에 어느 기록본을 유지할지 선택하십시오.'
            : '로컬 장부와 클라우드 장부의 내용이 다릅니다. 어느 기록본을 현재 원본으로 사용할지 선택하십시오.'}
        </p>
        <div className="document-conflict__versions">
          <article>
            <HardDrive size={20} aria-hidden="true" />
            <span lang="en">Local folio</span>
            <strong>개정 {localRevision}</strong>
            <small>{conflict.local?.personal?.campaignYear || '-'}년 · {conflict.local?.personal?.name || '기사 기록'}</small>
            <button type="button" className="btn-medieval" onClick={onKeepLocal} disabled={isBusy} aria-busy={isBusy}>로컬 기록을 클라우드에 올리기</button>
          </article>
          <article>
            <Cloud size={20} aria-hidden="true" />
            <span lang="en">Cloud folio</span>
            <strong>개정 {cloudRevision}</strong>
            <small>{conflict.cloud?.personal?.campaignYear || '-'}년 · {conflict.cloud?.personal?.name || '기사 기록'}{cloudUpdatedAt ? ` · ${cloudUpdatedAt}` : ''}</small>
            <button type="button" className="btn-medieval btn-medieval-primary" onClick={onUseCloud} disabled={isBusy}>클라우드 기록을 이 기기에 적용</button>
          </article>
        </div>
        <footer><FileClock size={15} aria-hidden="true" /> 창을 닫으면 어느 쪽도 덮어쓰지 않고 현재 로컬 장부를 계속 유지합니다.</footer>
      </section>
    </div>
  );
}

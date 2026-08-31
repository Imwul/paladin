import { useRef } from 'react';
import { Cloud, CloudDownload, CloudUpload, Download, LogIn, LogOut, Settings, Upload, X } from 'lucide-react';
import { validateCampaignImport } from '../utils/campaignState';
import useDialogFocus from '../hooks/useDialogFocus';
import './SettingsModal.css';

const formatCloudTime = (value) => {
  if (!value) return '아직 올린 기록 없음';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '시간 정보 없음';
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

export default function SettingsModal({
  isOpen,
  onClose,
  character,
  setCharacter,
  firebaseStatus,
  cloudActions,
  cloudState,
  cloudMeta
}) {
  const dialogRef = useRef(null);
  useDialogFocus(isOpen, dialogRef, onClose);

  if (!isOpen) return null;

  // JSON Export (Manual Backup)
  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(character, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    
    const timeStamp = new Date().toISOString().slice(0,10);
    const charName = character.personal.name || "UnnamedKnight";
    downloadAnchor.setAttribute("download", `paladin_sheet_${charName}_${timeStamp}.json`);
    
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // JSON Import
  const handleJsonUpload = (event) => {
    const fileReader = new FileReader();
    const file = event.target.files[0];
    if (!file) return;

    fileReader.onload = (e) => {
      try {
        const parsedData = JSON.parse(e.target.result);
        const validation = validateCampaignImport(parsedData);
        if (validation.ok) {
          setCharacter(parsedData);
          alert("성공! 파일 복원을 마쳤습니다. 기사의 영웅담을 시트에서 다시 이어가세요!");
          onClose();
        } else {
          alert(`파일 포맷이 어긋납니다. 누락/손상된 섹션: ${validation.errors.join(', ')}`);
        }
      } catch {
        alert("JSON 백업 파일 파싱에 실패했습니다.");
      }
    };
    fileReader.readAsText(file);
  };

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <div ref={dialogRef} className="modal-content-panel medieval-card" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--color-gold)', paddingBottom: '10px', marginBottom: '20px' }}>
          <h3 id="settings-title" style={{ color: 'var(--color-crimson)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} /> 설정 및 데이터 백업
          </h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="설정 닫기">
            <X size={20} />
          </button>
        </div>

        {/* SECTION 1: MANUAL BACKUP */}
        <div style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px dashed var(--color-gold-light)' }}>
          <h4 style={{ color: 'var(--color-gold-dark)', fontWeight: 'bold', fontSize: '1rem', marginBottom: '8px' }}>
            수동 파일 백업 (JSON)
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)', marginBottom: '15px' }}>
            구글 로그인 없이도 현재 세션(스탯, 가문, 모험 일기)을 내 컴퓨터에 JSON 파일로 다운로드하고 언제든 다시 업로드해 복구할 수 있습니다.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn-medieval" onClick={exportToJson} style={{ flex: 1, justifyContent: 'center' }}>
              <Download size={16} style={{ marginRight: '6px' }} /> 백업 파일 내보내기
            </button>
            <div style={{ position: 'relative', flex: 1 }}>
              <input 
                type="file" 
                accept=".json" 
                onChange={handleJsonUpload}
                aria-label="JSON 백업 파일 불러오기"
                style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
              />
              <button className="btn-medieval" style={{ width: '100%', justifyContent: 'center' }}>
                <Upload size={16} style={{ marginRight: '6px' }} /> 백업 파일 불러오기
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: GOOGLE CLOUD BACKUP */}
        <div>
          <h4 style={{ color: 'var(--color-gold-dark)', fontWeight: 'bold', fontSize: '1rem', marginBottom: '8px' }}>
            구글 클라우드 백업
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)', marginBottom: '15px' }}>
            구글 계정으로 로그인하면 현재 장부가 앱 전용 PALADIN 기록으로 자동 백업됩니다. 다른 기기에서도 같은 계정으로 기록을 이어갈 수 있으며, 서로 다른 개정본은 덮어쓰기 전에 비교합니다.
          </p>

          <section className={`cloud-backup-panel cloud-backup-panel--${cloudState?.tone || 'neutral'}`} aria-label="클라우드 백업 상태">
            <div className="cloud-backup-panel__status" role="status" aria-live="polite">
              <Cloud size={20} aria-hidden="true" />
              <div>
                <span>현재 상태</span>
                <strong>{cloudState?.label || '로컬 저장'}</strong>
              </div>
              {cloudActions?.isLoggedIn && (
                <dl>
                  <div><dt>클라우드 개정</dt><dd>{cloudMeta?.revision ?? '-'}</dd></div>
                  <div><dt>마지막 업로드</dt><dd>{formatCloudTime(cloudMeta?.updatedAt)}</dd></div>
                </dl>
              )}
            </div>

            <div className="cloud-backup-panel__actions">
              {cloudActions?.canLogin && (
                <button type="button" className="btn-medieval btn-medieval-primary" onClick={cloudActions.onLogin}>
                  <LogIn size={17} aria-hidden="true" /> 구글 로그인
                </button>
              )}
              {cloudActions?.isLoggedIn && (
                <>
                  <button type="button" className="btn-medieval btn-medieval-primary" onClick={cloudActions.onSave} disabled={cloudActions.isBusy} aria-busy={cloudActions.isBusy}>
                    <CloudUpload size={17} aria-hidden="true" /> 현재 기록 올리기
                  </button>
                  <button type="button" className="btn-medieval" onClick={cloudActions.onLoad} disabled={cloudActions.isBusy}>
                    <CloudDownload size={17} aria-hidden="true" /> 클라우드 기록 가져오기
                  </button>
                  <button type="button" className="btn-medieval cloud-backup-panel__logout" onClick={cloudActions.onLogout} disabled={cloudActions.isBusy}>
                    <LogOut size={17} aria-hidden="true" /> 로그아웃
                  </button>
                </>
              )}
              {firebaseStatus === 'UNCONFIGURED' && (
                <p>현재 빌드에서 클라우드 연결을 초기화하지 못했습니다. 네트워크 상태를 확인한 뒤 다시 열어 주세요.</p>
              )}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}

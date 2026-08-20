import { useRef, useState } from 'react';
import { Cloud, CloudDownload, CloudUpload, Download, LogIn, LogOut, Settings, Upload, X } from 'lucide-react';
import { validateCampaignImport } from '../utils/campaignState';
import useDialogFocus from '../hooks/useDialogFocus';
import './SettingsModal.css';

const readSavedConfig = () => {
  try {
    return JSON.parse(localStorage.getItem('paladin_firebase_config') || '{}');
  } catch {
    return {};
  }
};

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
  const [config, setConfig] = useState(readSavedConfig);
  useDialogFocus(isOpen, dialogRef, onClose);

  if (!isOpen) return null;

  // Save config
  const saveFirebaseConfig = () => {
    const missing = ['apiKey', 'authDomain', 'projectId', 'appId'].filter(field => !config[field]?.trim() || config[field] === 'YOUR_API_KEY');
    if (missing.length > 0) {
      alert(`Firebase 설정을 저장할 수 없습니다. 필수 항목 누락: ${missing.join(', ')}`);
      return;
    }
    localStorage.setItem('paladin_firebase_config', JSON.stringify(config));
    alert("파이어베이스 설정이 완료되었습니다. 기존 초기화된 연결을 버리고 새 설정으로 동작하기 위해 웹앱을 재시작합니다.");
    window.location.reload();
  };

  // Clear config
  const clearFirebaseConfig = () => {
    if (window.confirm("저장된 개인 파이어베이스 연동 설정을 모두 삭제하시겠습니까?")) {
      localStorage.removeItem('paladin_firebase_config');
      window.location.reload();
    }
  };

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

        {/* SECTION 2: FIREBASE KEY SETUP */}
        <div>
          <h4 style={{ color: 'var(--color-gold-dark)', fontWeight: 'bold', fontSize: '1rem', marginBottom: '8px' }}>
            클라우드 백업 (Firebase)
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)', marginBottom: '15px' }}>
            개인 Firebase 프로젝트와 구글 계정을 연결해 현재 장부를 수동으로 올리거나 다른 기기의 기록을 가져옵니다. 업로드 전에는 원격 개정본을 확인해 뜻하지 않은 덮어쓰기를 막습니다.
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
                <p>아래 연동 키를 먼저 저장하면 구글 로그인과 클라우드 백업을 사용할 수 있습니다.</p>
              )}
            </div>
          </section>
          
          <div className="medieval-form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <div className="form-group">
              <label htmlFor="firebase-api-key" className="form-label" style={{ fontSize: '0.8rem' }}>API Key</label>
              <input id="firebase-api-key" type="password" className="form-input" style={{ padding: '6px 10px', fontSize: '0.9rem' }} value={config.apiKey || ''} onChange={e => setConfig(current => ({ ...current, apiKey: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="firebase-auth-domain" className="form-label" style={{ fontSize: '0.8rem' }}>Auth Domain</label>
              <input id="firebase-auth-domain" type="text" className="form-input" style={{ padding: '6px 10px', fontSize: '0.9rem' }} value={config.authDomain || ''} onChange={e => setConfig(current => ({ ...current, authDomain: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="firebase-project-id" className="form-label" style={{ fontSize: '0.8rem' }}>Project ID</label>
              <input id="firebase-project-id" type="text" className="form-input" style={{ padding: '6px 10px', fontSize: '0.9rem' }} value={config.projectId || ''} onChange={e => setConfig(current => ({ ...current, projectId: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="firebase-storage" className="form-label" style={{ fontSize: '0.8rem' }}>Storage Bucket</label>
              <input id="firebase-storage" type="text" className="form-input" style={{ padding: '6px 10px', fontSize: '0.9rem' }} value={config.storageBucket || ''} onChange={e => setConfig(current => ({ ...current, storageBucket: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="firebase-sender" className="form-label" style={{ fontSize: '0.8rem' }}>Messaging Sender ID</label>
              <input id="firebase-sender" type="text" className="form-input" style={{ padding: '6px 10px', fontSize: '0.9rem' }} value={config.messagingSenderId || ''} onChange={e => setConfig(current => ({ ...current, messagingSenderId: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="firebase-app-id" className="form-label" style={{ fontSize: '0.8rem' }}>App ID</label>
              <input id="firebase-app-id" type="text" className="form-input" style={{ padding: '6px 10px', fontSize: '0.9rem' }} value={config.appId || ''} onChange={e => setConfig(current => ({ ...current, appId: e.target.value }))} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-medieval btn-medieval-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={saveFirebaseConfig}>
              연동 키 저장하기
            </button>
            {firebaseStatus !== 'UNCONFIGURED' && (
              <button className="btn-medieval" style={{ color: 'var(--color-crimson)', borderColor: 'var(--color-crimson)' }} onClick={clearFirebaseConfig}>
                연동 해제
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

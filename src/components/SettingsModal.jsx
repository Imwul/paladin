import React, { useState, useEffect } from 'react';
import ProperNoun from './ProperNoun';
import { X, Download, Upload, Settings, Lock } from 'lucide-react';
import './SettingsModal.css';

export default function SettingsModal({ isOpen, onClose, character, setCharacter, firebaseStatus }) {
  // Config inputs
  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [projectId, setProjectId] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');
  const [appId, setAppId] = useState('');

  // Load config from localStorage on mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('paladin_firebase_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        setApiKey(parsed.apiKey || '');
        setAuthDomain(parsed.authDomain || '');
        setProjectId(parsed.projectId || '');
        setStorageBucket(parsed.storageBucket || '');
        setMessagingSenderId(parsed.messagingSenderId || '');
        setAppId(parsed.appId || '');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Save config
  const saveFirebaseConfig = () => {
    const config = { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };
    localStorage.setItem('paladin_firebase_config', JSON.stringify(config));
    alert("파이어베이스 설정이 완료되었습니다! 컴패니언 연동을 위해 웹앱을 재부팅합니다.");
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
        if (parsedData.personal && parsedData.attributes && parsedData.skills) {
          setCharacter(parsedData);
          alert("성공! 파일 복원을 마쳤습니다. 기사의 영웅담을 시트에서 다시 이어가세요!");
          onClose();
        } else {
          alert("파일 포맷이 어긋납니다. 올바른 Paladin 컴패니언 백업 JSON 파일인지 확인해 주세요.");
        }
      } catch (err) {
        alert("JSON 백업 파일 파싱에 실패했습니다.");
      }
    };
    fileReader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-panel medieval-card" onClick={e => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--color-gold)', paddingBottom: '10px', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-english)', color: 'var(--color-crimson)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} /> 설정 및 데이터 백업
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
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
            파이어베이스 연동 콘솔 (Firebase Setup)
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)', marginBottom: '15px' }}>
            개인의 파이어베이스 프로젝트 키를 입력해 두시면, 구글 로그인을 통한 실시간 원격 동기화가 활성화됩니다.
          </p>
          
          <div className="medieval-form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>API Key</label>
              <input type="password" className="form-input" style={{ padding: '6px 10px', fontSize: '0.9rem' }} value={apiKey} onChange={e => setApiKey(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Auth Domain</label>
              <input type="text" className="form-input" style={{ padding: '6px 10px', fontSize: '0.9rem' }} value={authDomain} onChange={e => setAuthDomain(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Project ID</label>
              <input type="text" className="form-input" style={{ padding: '6px 10px', fontSize: '0.9rem' }} value={projectId} onChange={e => setProjectId(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Storage Bucket</label>
              <input type="text" className="form-input" style={{ padding: '6px 10px', fontSize: '0.9rem' }} value={storageBucket} onChange={e => setStorageBucket(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Messaging Sender ID</label>
              <input type="text" className="form-input" style={{ padding: '6px 10px', fontSize: '0.9rem' }} value={messagingSenderId} onChange={e => setMessagingSenderId(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>App ID</label>
              <input type="text" className="form-input" style={{ padding: '6px 10px', fontSize: '0.9rem' }} value={appId} onChange={e => setAppId(e.target.value)} />
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

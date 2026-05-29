import React, { useState, useEffect } from 'react';
import ProperNoun from './ProperNoun';
import { getFirebaseServices } from '../firebase';
import { Cloud, Upload, Download, Settings, Lock } from 'lucide-react';

export default function SyncBackup({ character, setCharacter }) {
  // Config inputs
  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [projectId, setProjectId] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');
  const [appId, setAppId] = useState('');

  // Firebase state
  const [firebaseStatus, setFirebaseStatus] = useState('UNCONFIGURED');
  const [user, setUser] = useState(null);

  // Load custom config from localStorage on mount
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
        
        if (parsed.apiKey && parsed.apiKey !== "YOUR_API_KEY") {
          setFirebaseStatus('CONFIGURED_OFFLINE');
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Check if user is logged in if Firebase is available
    const services = getFirebaseServices();
    if (!services.isMock && services.auth) {
      const unsubscribe = services.auth.onAuthStateChanged(usr => {
        if (usr) {
          setUser(usr);
          setFirebaseStatus('LOGGED_IN');
          // Load initial cloud data on login
          services.loadFromCloud(usr.uid).then(cloudData => {
            if (cloudData) {
              if (window.confirm("클라우드에 백업된 데이터가 발견되었습니다! 로컬 기사 시트를 클라우드 데이터로 덮어쓰시겠습니까?")) {
                setCharacter(cloudData);
              }
            }
          });
        } else {
          setUser(null);
          setFirebaseStatus('CONFIGURED_OFFLINE');
        }
      });
      return unsubscribe;
    }
  }, [setCharacter]);

  // Save custom Firebase config
  const saveFirebaseConfig = () => {
    const config = { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };
    localStorage.setItem('paladin_firebase_config', JSON.stringify(config));
    alert("파이어베이스 설정이 완료되었습니다! 컴패니언 활성화를 위해 웹앱을 다시 시작합니다.");
    window.location.reload();
  };

  // Clear config
  const clearFirebaseConfig = () => {
    if (window.confirm("저장된 개인 파이어베이스 연동 설정을 모두 초기화하고 삭제하시겠습니까? 클라우드 저장이 중단됩니다.")) {
      localStorage.removeItem('paladin_firebase_config');
      window.location.reload();
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    const services = getFirebaseServices();
    if (services.isMock) {
      alert("파이어베이스가 활성화되지 않았습니다. 하단의 파이어베이스 연동 콘솔에 API 키를 등록해 주세요.");
      return;
    }

    try {
      const usr = await services.loginWithGoogle();
      setUser(usr);
      setFirebaseStatus('LOGGED_IN');
    } catch (error) {
      alert(`로그인 실패: ${error.message}`);
    }
  };

  // Logout
  const handleLogout = async () => {
    const services = getFirebaseServices();
    try {
      await services.logout();
      setUser(null);
      setFirebaseStatus('CONFIGURED_OFFLINE');
    } catch (error) {
      console.error(error);
    }
  };

  // Cloud Save
  const handleCloudSave = async () => {
    if (!user) return;
    const services = getFirebaseServices();
    try {
      await services.saveToCloud(user.uid, character);
      alert("기사 시트 및 연대기 모험 일지가 클라우드 데이터베이스에 완전하게 안전 백업되었습니다!");
    } catch (error) {
      alert(`클라우드 저장 실패: ${error.message}`);
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
        
        // Basic schema validation
        if (parsedData.personal && parsedData.attributes && parsedData.skills) {
          setCharacter(parsedData);
          alert("성공! 파일 복원을 마쳤습니다. 기사의 영웅담을 시트에서 다시 이어가세요!");
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
    <div className="view-animate">
      <div className="tutorial-banner">
        <div>
          <h4 className="tutorial-banner-title">동기화 및 세션 백업 안내</h4>
          <p>
            내 소중한 기사의 사가와 기록을 영구 보관할 수 있습니다. 
            **수동 파일 백업**을 이용하면 로그인 없이도 기사의 정보를 JSON 파일로 로컬 기기에 간편 다운로드할 수 있습니다. 
            다양한 컴퓨터나 스마트폰 간에 실시간 동기화를 원하시면, 본인의 파이어베이스 계정을 만들어 하단 콘솔에 붙여넣어 연동한 뒤 구글 로그인을 활용해 보세요!
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '20px' }}>
        
        {/* MANUAL BACKUP CARD */}
        <div className="medieval-card">
          <h3 className="card-title">
            <span><Download size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />수동 JSON 파일 백업</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-light)', lineHeight: '1.5' }}>
              내 기사의 시트 스탯, 종자, 마필, 가문 및 연대기 일기장까지 통째로 내포한 세션 백업 파일(.json)을 즉석에서 다운로드받습니다. 
              데이터 오너십은 온전히 플레이어의 몫입니다.
            </p>
            <button className="btn-medieval btn-medieval-primary" onClick={exportToJson} style={{ justifyContent: 'center' }}>
              <Download size={16} style={{ marginRight: '6px' }} /> 현재 세션 백업파일 받기
            </button>
            
            <div style={{ borderTop: '1px solid var(--color-gold-light)', paddingTop: '15px' }}>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>저장된 백업 불러오기 (복원)</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleJsonUpload}
                  style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                />
                <button className="btn-medieval" style={{ width: '100%', justifyContent: 'center' }}>
                  <Upload size={16} style={{ marginRight: '6px' }} /> 백업 파일(.json) 올리기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FIREBASE SYNC CARD */}
        <div className="medieval-card">
          <h3 className="card-title">
            <span><Cloud size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />구글 클라우드 실시간 동기화</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {firebaseStatus === 'UNCONFIGURED' ? (
              <div style={{ padding: '15px', backgroundColor: 'rgba(107, 102, 95, 0.05)', border: '1px dashed var(--color-gold)', borderRadius: '4px', fontSize: '0.85rem' }}>
                <Lock size={16} style={{ color: 'var(--color-gold-dark)', marginBottom: '5px' }} />
                <strong>로컬 오프라인 모드:</strong> 파이어베이스 세팅이 비어 있습니다. 하단 연동 콘솔에 키를 등록하시면 구글 로그인 버튼이 즉각 개방되어 서버 저장이 열립니다.
              </div>
            ) : firebaseStatus === 'CONFIGURED_OFFLINE' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '10px', backgroundColor: 'var(--color-success)', color: '#fff', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'center' }}>
                  파이어베이스 서비스 가동 대기 중
                </div>
                <button className="btn-medieval btn-medieval-primary" onClick={handleGoogleLogin} style={{ justifyContent: 'center' }}>
                  구글 계정으로 로그인하기
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ border: '1px solid var(--color-gold)', padding: '12px', borderRadius: '4px', backgroundColor: 'rgba(179,143,67,0.03)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)' }}>로그인된 구글 사용자:</span>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{user?.displayName || user?.email}</div>
                </div>
                <button className="btn-medieval btn-medieval-primary" onClick={handleCloudSave} style={{ justifyContent: 'center' }}>
                  <Cloud size={16} style={{ marginRight: '6px' }} /> 현재 기사 정보 클라우드 저장
                </button>
                <button className="btn-medieval" onClick={handleLogout} style={{ justifyContent: 'center', color: 'var(--color-crimson)', borderColor: 'var(--color-crimson)' }}>
                  로그아웃 실행
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FIREBASE CONFIGURATION FORM */}
        <div className="medieval-card" style={{ gridColumn: 'span 2' }}>
          <h3 className="card-title">
            <span><Settings size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />파이어베이스 연동 콘솔 (Firebase Setup)</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)', marginBottom: '15px' }}>
            본인의 구글 파이어베이스(Firebase) 프로젝트 웹앱에 발급된 API 키와 정보들을 여기에 입력하면, 즉시 개인 클라우드 동기화 모드가 발동합니다:
          </p>
          <div className="medieval-form-grid" style={{ marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">API Key (apiKey)</label>
              <input type="password" className="form-input" value={apiKey} onChange={e => setApiKey(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Auth Domain (authDomain)</label>
              <input type="text" className="form-input" value={authDomain} onChange={e => setAuthDomain(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Project ID (projectId)</label>
              <input type="text" className="form-input" value={projectId} onChange={e => setProjectId(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Storage Bucket (storageBucket)</label>
              <input type="text" className="form-input" value={storageBucket} onChange={e => setStorageBucket(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Messaging Sender ID (messagingSenderId)</label>
              <input type="text" className="form-input" value={messagingSenderId} onChange={e => setMessagingSenderId(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">App ID (appId)</label>
              <input type="text" className="form-input" value={appId} onChange={e => setAppId(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-medieval btn-medieval-primary" onClick={saveFirebaseConfig}>
              파이어베이스 연동 키 저장하기
            </button>
            {firebaseStatus !== 'UNCONFIGURED' && (
              <button className="btn-medieval" onClick={clearFirebaseConfig} style={{ color: 'var(--color-crimson)', borderColor: 'var(--color-crimson)' }}>
                연동 정보 완전히 해제하기
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import ProperNoun from './ProperNoun';
import { getFirebaseServices } from '../firebase';
import { Cloud, Upload, Download, Settings, Lock, Sparkles } from 'lucide-react';

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
              if (window.confirm("Cloud data found! Would you like to overwrite your local character sheet with your cloud-saved sheet? (클라우드 데이터를 불러오시겠습니까?)")) {
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
    alert("Firebase Configuration Saved! Reloading app services... (설정이 저장되었습니다. 페이지를 새로고침하여 활성화하십시오.)");
    window.location.reload();
  };

  // Clear config
  const clearFirebaseConfig = () => {
    if (window.confirm("Delete your custom Firebase keys? This will turn off cloud saving. (파이어베이스 설정을 삭제하시겠습니까?)")) {
      localStorage.removeItem('paladin_firebase_config');
      window.location.reload();
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    const services = getFirebaseServices();
    if (services.isMock) {
      alert("Firebase is not configured yet. Please configure your API key below.");
      return;
    }

    try {
      const usr = await services.loginWithGoogle();
      setUser(usr);
      setFirebaseStatus('LOGGED_IN');
    } catch (error) {
      alert(`Login failed: ${error.message}`);
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
      alert("Successfully backed up your Character Sheet and Journals to the cloud! (성공적으로 클라우드 저장을 완료했습니다!)");
    } catch (error) {
      alert(`Cloud backup failed: ${error.message}`);
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
          alert("Successfully restored your Knight Sheet and saga from JSON! (성공적으로 데이터를 복구했습니다!)");
        } else {
          alert("Invalid file format. Ensure this is a valid Paladin Companion backup JSON.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    fileReader.readAsText(file);
  };

  return (
    <div className="view-animate">
      <div className="tutorial-banner">
        <div>
          <h4 className="tutorial-banner-title">Sync & Backup Tutorial (동기화 및 백업 설명)</h4>
          <p>
            You can back up your sessions to ensure you never lose your knight's achievements. 
            Use the **JSON Backup** to download your session as a local file. To sync across different computers, plug in your **Firebase Credentials** below and authenticate using **Google Login**.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '20px' }}>
        
        {/* MANUAL BACKUP CARD */}
        <div className="medieval-card">
          <h3 className="card-title">
            <span><Download size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Manual Backup (수동 파일 백업)</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-light)', lineHeight: '1.5' }}>
              Download your complete companion data (including character sheet, family sheet, and timeline journals) as a local JSON file. 
              No cloud accounts or database registration required!
            </p>
            <button className="btn-medieval btn-medieval-primary" onClick={exportToJson} style={{ justifyContent: 'center' }}>
              <Download size={16} style={{ marginRight: '6px' }} /> Export Session Data (.json)
            </button>
            
            <div style={{ borderTop: '1px solid var(--color-gold-light)', paddingTop: '15px' }}>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Import Backup File (백업 복원하기)</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleJsonUpload}
                  style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                />
                <button className="btn-medieval" style={{ width: '100%', justifyContent: 'center' }}>
                  <Upload size={16} style={{ marginRight: '6px' }} /> Upload Backup JSON
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FIREBASE SYNC CARD */}
        <div className="medieval-card">
          <h3 className="card-title">
            <span><Cloud size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Google Cloud Sync (구글 클라우드 연동)</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {firebaseStatus === 'UNCONFIGURED' ? (
              <div style={{ padding: '15px', backgroundColor: 'rgba(107, 102, 95, 0.05)', border: '1px dashed var(--color-gold)', borderRadius: '4px', fontSize: '0.85rem' }}>
                <Lock size={16} style={{ color: 'var(--color-gold-dark)', marginBottom: '5px' }} />
                <strong>Offline Mode:</strong> Firebase config is empty. You can enter your API keys below to activate Google Login and live cloud saving.
              </div>
            ) : firebaseStatus === 'CONFIGURED_OFFLINE' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '10px', backgroundColor: 'var(--color-success)', color: '#fff', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  Firebase Services Activated (오프라인 모드 대기)
                </div>
                <button className="btn-medieval btn-medieval-primary" onClick={handleGoogleLogin} style={{ justifyContent: 'center' }}>
                  Sign In with Google (구글 로그인)
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ border: '1px solid var(--color-gold)', padding: '12px', borderRadius: '4px', backgroundColor: 'rgba(179,143,67,0.03)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)' }}>Authenticated as:</span>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{user?.displayName || user?.email}</div>
                </div>
                <button className="btn-medieval btn-medieval-primary" onClick={handleCloudSave} style={{ justifyContent: 'center' }}>
                  <Cloud size={16} style={{ marginRight: '6px' }} /> Backup Session to Cloud (클라우드 저장)
                </button>
                <button className="btn-medieval" onClick={handleLogout} style={{ justifyContent: 'center', color: 'var(--color-crimson)', borderColor: 'var(--color-crimson)' }}>
                  Sign Out (로그아웃)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FIREBASE CONFIGURATION FORM */}
        <div className="medieval-card" style={{ gridColumn: 'span 2' }}>
          <h3 className="card-title">
            <span><Settings size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Firebase Setup Console (파이어베이스 연동 콘솔)</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)', marginBottom: '15px' }}>
            If you want to host this companion privately or sync between your devices, create a free Firebase Web App and paste your credentials here:
          </p>
          <div className="medieval-form-grid" style={{ marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">API Key</label>
              <input type="password" className="form-input" value={apiKey} onChange={e => setApiKey(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Auth Domain</label>
              <input type="text" className="form-input" value={authDomain} onChange={e => setAuthDomain(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Project ID</label>
              <input type="text" className="form-input" value={projectId} onChange={e => setProjectId(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Storage Bucket</label>
              <input type="text" className="form-input" value={storageBucket} onChange={e => setStorageBucket(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Messaging Sender ID</label>
              <input type="text" className="form-input" value={messagingSenderId} onChange={e => setMessagingSenderId(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">App ID</label>
              <input type="text" className="form-input" value={appId} onChange={e => setAppId(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-medieval btn-medieval-primary" onClick={saveFirebaseConfig}>
              Save Credentials (연동 저장하기)
            </button>
            {firebaseStatus !== 'UNCONFIGURED' && (
              <button className="btn-medieval" onClick={clearFirebaseConfig} style={{ color: 'var(--color-crimson)', borderColor: 'var(--color-crimson)' }}>
                Delete Config (연동 해제)
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

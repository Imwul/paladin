import React, { useState, useEffect } from 'react';
import ProperNoun from './components/ProperNoun';
import Dashboard from './components/Dashboard';
import CharacterSheet from './components/CharacterSheet';
import FamilyWinter from './components/FamilyWinter';
import ChronologyJournal from './components/ChronologyJournal';
import SoloOracles from './components/SoloOracles';
import SettingsModal from './components/SettingsModal';
import { getFirebaseServices } from './firebase';
import { BookOpen, User, Shield, Compass, Sparkles, Cloud, Settings, LogIn, LogOut } from 'lucide-react';
import './components/SettingsModal.css';

// Initial state template representing the full blank Knight Character Sheet & Linage
const initialCharacterState = {
  personal: {
    name: "Sir Roland",
    age: 21,
    sonNumber: "첫째",
    blessing: "Holy Aura",
    homeland: "Francia",
    home: "Aachen",
    culture: "Frankish",
    lineage: "Ardennes",
    liegeLord: "Charlemagne",
    fathersClass: "Vassal Knight",
    personalClass: "Knight",
    features: ["Scar on left cheek", "Piercing blue eyes", "Tall and slender frame"]
  },
  attributes: {
    siz: 14,
    dex: 12,
    str: 13,
    con: 12,
    app: 11,
    currentHp: 26 // siz + con initially
  },
  traits: {
    chaste: 10, lustful: 10,
    energetic: 12, lazy: 8,
    forgiving: 11, vengeful: 9,
    generous: 13, selfish: 7,
    honest: 12, deceitful: 8,
    just: 10, arbitrary: 10,
    merciful: 11, cruel: 9,
    modest: 10, proud: 10,
    pious: 12, worldly: 8,
    prudent: 10, reckless: 10,
    temperate: 10, indulgent: 10,
    trusting: 11, suspicious: 9,
    valorous: 15, cowardly: 5
  },
  skills: {
    awareness: 8, chirurgery: 1, faerieLore: 2, firstAid: 10, folkLore: 4,
    horsemanship: 12, hunting: 6, industry: 5, recognize: 5, religion: 6, stewardship: 3, swimming: 5,
    courtesy: 8, dancing: 2, eloquence: 6, falconry: 4, gaming: 5, heraldry: 5, intrigue: 3, playInstruments: 1, readingWriting: 2, romance: 4, singing: 3,
    battle: 10, siege: 5,
    axe: 6, bludgeon: 5, dagger: 8, spear: 10, sword: 13, unarmed: 6,
    lance: 12,
    bow: 4, crossbow: 5, thrownWeapon: 4
  },
  skillsChecked: {}, 
  squire: {
    name: "Pierre",
    age: 14,
    siz: 10, dex: 10, str: 10, con: 10,
    firstAid: 8, horsemanship: 9, weapon: 8
  },
  horses: {
    warhorse: {
      type: "Charger",
      breed: "Frankish",
      damage: "4d6",
      move: 8,
      armor: 5,
      hp: 30
    },
    other2: "Palfrey Riding Horse",
    other3: "",
    other4: "",
    other5: ""
  },
  gear: {
    armorShield: "Chainmail (10 Points) + Shield (+3)",
    clothing: "£2 Courtyard Tunic",
    personalGear: "Wooden crucifix, whetstone, linen roll",
    homePossessions: "Chest of grain, two spare swords, tapestry of ancestor",
    cash: 5,
    gloryThisGame: 100,
    gloryTotal: 1200
  },
  family: {
    name: "Ardennes",
    motto: "Honor and Faith (명예와 신조)",
    battleCry: "Montjoie Saint-Denis! (몽주아 생 드니!)",
    ancestor: "Sir Godefroy",
    homeCountry: "Francia",
    patronSaint: "St. Denis",
    honor: 16,
    allies: "House of Monglane",
    enemies: "House of Mayence (The Traitors)"
  },
  journal: {
    768: {
      text: "올해 페팽 왕께서 서거하시고 제국이 분할되었습니다. 나는 네모 공작 앞에서 기사 서약을 맺고 젊은 샤를마뉴 대제께 충성을 맹세했습니다. 다가오는 봄의 원정을 준비합니다.",
      updatedAt: new Date().toISOString()
    }
  },
  passions: {
    loyaltyLiege: 15,
    loveFamily: 15,
    hospitality: 15,
    honor: 16,
    hateSarasens: 12,
    loveGod: 15
  }
};

const mergeWithDefault = (data) => {
  if (!data || typeof data !== 'object') return initialCharacterState;
  return {
    ...initialCharacterState,
    ...data,
    personal: { ...initialCharacterState.personal, ...data.personal },
    attributes: { ...initialCharacterState.attributes, ...data.attributes },
    traits: { ...initialCharacterState.traits, ...data.traits },
    skills: { ...initialCharacterState.skills, ...data.skills },
    skillsChecked: { ...initialCharacterState.skillsChecked, ...data.skillsChecked },
    squire: { ...initialCharacterState.squire, ...data.squire },
    horses: { 
      ...initialCharacterState.horses, 
      ...data.horses,
      warhorse: { ...initialCharacterState.horses?.warhorse, ...data.horses?.warhorse }
    },
    gear: { ...initialCharacterState.gear, ...data.gear },
    family: { ...initialCharacterState.family, ...data.family },
    journal: { ...initialCharacterState.journal, ...data.journal },
    passions: { ...initialCharacterState.passions, ...data.passions }
  };
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState('UNCONFIGURED');
  const [user, setUser] = useState(null);

  const [rawCharacter, setRawCharacter] = useState(() => {
    try {
      const saved = localStorage.getItem('paladin_companion_data');
      if (!saved) return initialCharacterState;
      const parsed = JSON.parse(saved);
      return mergeWithDefault(parsed);
    } catch (e) {
      console.warn("Failed to parse saved state, loading template:", e);
      return initialCharacterState;
    }
  });

  const character = rawCharacter;
  const setCharacter = (newData) => {
    setRawCharacter(prev => {
      const resolved = typeof newData === 'function' ? newData(prev) : newData;
      return mergeWithDefault(resolved);
    });
  };

  // Load custom config and handle Firebase Auth state
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('paladin_firebase_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed.apiKey && parsed.apiKey !== "YOUR_API_KEY") {
          setFirebaseStatus('CONFIGURED_OFFLINE');
        }
      }
    } catch (e) {
      console.error(e);
    }

    const services = getFirebaseServices();
    if (!services.isMock && services.auth) {
      const unsubscribe = services.auth.onAuthStateChanged(usr => {
        if (usr) {
          setUser(usr);
          setFirebaseStatus('LOGGED_IN');
          // Load cloud data upon login
          services.loadFromCloud(usr.uid).then(cloudData => {
            if (cloudData) {
              if (window.confirm("클라우드 백업 데이터를 발견했습니다! 기존 로컬 시트 데이터를 클라우드 데이터로 복구하시겠습니까?")) {
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
  }, []);

  // Offline-first synchronization with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('paladin_companion_data', JSON.stringify(character));
    } catch (e) {
      console.error("Failed to save state to localStorage:", e);
    }
  }, [character]);

  // Auth Operations
  const handleGoogleLogin = async () => {
    const services = getFirebaseServices();
    if (services.isMock) {
      alert("파이어베이스가 연결되어 있지 않습니다. 우측의 톱니바퀴 아이콘을 눌러 연동 설정을 완료해 주세요!");
      setIsSettingsOpen(true);
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

  const handleCloudSave = async () => {
    if (!user) return;
    const services = getFirebaseServices();
    try {
      await services.saveToCloud(user.uid, character);
      alert("성공적으로 기사 시트와 일지 정보가 클라우드 서버에 백업되었습니다!");
    } catch (error) {
      alert(`클라우드 백업 실패: ${error.message}`);
    }
  };

  return (
    <div className="app-container">
      
      {/* Decorative Title Header bar & Unified Auth Bar */}
      <div className="header-decor">
        <div className="header-title-container">
          <h1>
            <ProperNoun en="Paladin: Passage of Arms" ko="팔라딘: 성기사들의 모험" />
          </h1>
          <p className="subtitle">
            <ProperNoun en="Warriors of Charlemagne" ko="샤를마뉴 대제의 용사들" /> &bull; 1인 전용 컴패니언 웹앱
          </p>
        </div>

        {/* Global Authentication Bar */}
        <div className="auth-bar">
          {firebaseStatus === 'UNCONFIGURED' ? (
            <span className="auth-badge unconfigured">
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#992222', marginRight: '4px' }}></span>
              미설정 (로컬 저장)
            </span>
          ) : firebaseStatus === 'CONFIGURED_OFFLINE' ? (
            <>
              <span className="auth-badge offline">
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6b665f', marginRight: '4px' }}></span>
                오프라인 (미연동)
              </span>
              <button className="btn-medieval" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={handleGoogleLogin}>
                <LogIn size={14} style={{ marginRight: '4px' }} /> 구글 로그인
              </button>
            </>
          ) : (
            <>
              <span className="auth-badge online" style={{ backgroundColor: '#e8f5e9', border: '1px solid #2e7d32', color: '#2e7d32' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2e7d32', marginRight: '4px' }}></span>
                동기화 중 ({user?.displayName || "이준형"})
              </span>
              <button className="btn-medieval btn-medieval-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={handleCloudSave}>
                <Cloud size={14} style={{ marginRight: '4px' }} /> 클라우드 백업
              </button>
              <button className="btn-medieval" style={{ padding: '6px 12px', fontSize: '0.85rem', color: 'var(--color-crimson)', borderColor: 'var(--color-crimson)' }} onClick={handleLogout}>
                <LogOut size={14} style={{ marginRight: '4px' }} /> 로그아웃
              </button>
            </>
          )}

          {/* Settings gear icon always open to allow configuration */}
          <button className="btn-medieval" style={{ padding: '6px 10px' }} onClick={() => setIsSettingsOpen(true)}>
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Navigation tab bar */}
      <div className="tab-navigation">
        <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <BookOpen size={16} /> 대시보드
        </button>
        <button className={`tab-btn ${activeTab === 'character' ? 'active' : ''}`} onClick={() => setActiveTab('character')}>
          <User size={16} /> 기사 시트
        </button>
        <button className={`tab-btn ${activeTab === 'family' ? 'active' : ''}`} onClick={() => setActiveTab('family')}>
          <Shield size={16} /> 가문 & 겨울 정산
        </button>
        <button className={`tab-btn ${activeTab === 'journal' ? 'active' : ''}`} onClick={() => setActiveTab('journal')}>
          <Compass size={16} /> 역사 연대기 & 일지
        </button>
        <button className={`tab-btn ${activeTab === 'oracles' ? 'active' : ''}`} onClick={() => setActiveTab('oracles')}>
          <Sparkles size={16} /> 솔로 오라클
        </button>
      </div>

      {/* Main Content Render area */}
      <div className="main-content">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'character' && <CharacterSheet character={character} setCharacter={setCharacter} />}
        {activeTab === 'family' && <FamilyWinter character={character} setCharacter={setCharacter} />}
        {activeTab === 'journal' && <ChronologyJournal character={character} setCharacter={setCharacter} />}
        {activeTab === 'oracles' && <SoloOracles setCharacter={setCharacter} />}
      </div>

      {/* Settings & JSON Backup popup modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        character={character} 
        setCharacter={setCharacter} 
        firebaseStatus={firebaseStatus} 
      />

    </div>
  );
}

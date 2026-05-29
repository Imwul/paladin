import React, { useState, useEffect } from 'react';
import ProperNoun from './components/ProperNoun';
import Dashboard from './components/Dashboard';
import CharacterSheet from './components/CharacterSheet';
import FamilyWinter from './components/FamilyWinter';
import ChronologyJournal from './components/ChronologyJournal';
import SoloOracles from './components/SoloOracles';
import SyncBackup from './components/SyncBackup';
import { BookOpen, User, Shield, Compass, Sparkles, Cloud } from 'lucide-react';

// Initial state template representing the full blank Knight Character Sheet & Linage
const initialCharacterState = {
  personal: {
    name: "Sir Roland",
    age: 21,
    sonNumber: "First",
    blessing: "Holy Aura",
    homeland: "Francia",
    home: "Aachen",
    culture: "Frankish",
    lineage: "Ardennes",
    liegeLord: "Charlemagne",
    fathersClass: "Vassal Knight",
    personalClass: "Knight"
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
    // Common
    awareness: 8, chirurgery: 1, faerieLore: 2, firstAid: 10, folkLore: 4,
    horsemanship: 12, hunting: 6, industry: 5, recognize: 5, religion: 6, stewardship: 3, swimming: 5,
    // Courtly
    courtesy: 8, dancing: 2, eloquence: 6, falconry: 4, gaming: 5, heraldry: 5, intrigue: 3, playInstruments: 1, readingWriting: 2, romance: 4, singing: 3,
    // Combat
    battle: 10, siege: 5,
    // Melee
    axe: 6, bludgeon: 5, dagger: 8, spear: 10, sword: 13, unarmed: 6,
    // Mounted
    lance: 12,
    // Missiles
    bow: 4, crossbow: 5, thrownWeapon: 4
  },
  skillsChecked: {}, // Tracks checks for Winter Phase
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
      text: "This year, King Pepin passed away. The kingdom was divided. I took my vows as a knight before Duke Naymo and swore loyalty to young Charlemagne. We prepare for the spring campaigns.",
      updatedAt: new Date().toISOString()
    }
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [character, setCharacter] = useState(() => {
    try {
      const saved = localStorage.getItem('paladin_companion_data');
      return saved ? JSON.parse(saved) : initialCharacterState;
    } catch (e) {
      console.warn("Failed to parse saved state, loading template:", e);
      return initialCharacterState;
    }
  });

  // Offline-first synchronization with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('paladin_companion_data', JSON.stringify(character));
    } catch (e) {
      console.error("Failed to save state to localStorage:", e);
    }
  }, [character]);

  return (
    <div className="app-container">
      
      {/* Decorative Title Header bar */}
      <div className="header-decor">
        <h1>
          <ProperNoun en="Paladin: Passage of Arms" ko="팔라딘: 성기사들의 모험" />
        </h1>
        <p className="subtitle">
          <ProperNoun en="Warriors of Charlemagne" ko="샤를마뉴 대제의 용사들" /> &bull; 1인 전용 컴패니언 웹앱
        </p>
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
          <Compass size={16} /> 연대기 & 일지
        </button>
        <button className={`tab-btn ${activeTab === 'oracles' ? 'active' : ''}`} onClick={() => setActiveTab('oracles')}>
          <Sparkles size={16} /> 솔로 오라클
        </button>
        <button className={`tab-btn ${activeTab === 'sync' ? 'active' : ''}`} onClick={() => setActiveTab('sync')}>
          <Cloud size={16} /> 동기화 & 설정
        </button>
      </div>

      {/* Main Content Render area */}
      <div className="main-content">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'character' && <CharacterSheet character={character} setCharacter={setCharacter} />}
        {activeTab === 'family' && <FamilyWinter character={character} setCharacter={setCharacter} />}
        {activeTab === 'journal' && <ChronologyJournal character={character} setCharacter={setCharacter} />}
        {activeTab === 'oracles' && <SoloOracles setCharacter={setCharacter} />}
        {activeTab === 'sync' && <SyncBackup character={character} setCharacter={setCharacter} />}
      </div>

    </div>
  );
}

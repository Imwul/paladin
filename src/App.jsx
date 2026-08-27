import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import AppShell from './app/AppShell';
import { LoadingState } from './components/ui/LedgerUI';
import SaveConflictDialog from './components/SaveConflictDialog';
import { getCloudSaveRevision, getFirebaseServices } from './firebase';
import { deepClone, sanitizeCampaignState } from './utils/campaignState';
import { createEconomyState, toDeniers } from './rules/economyRules';
import { createPersonalityMagicState } from './rules/personalityMagicRules';
import { RulebookProvider } from './features/rulebook/RulebookContext';
import './components/SettingsModal.css';
import './styles/remaster.css';

const CharacterDossier = lazy(() => import('./features/character/CharacterDossier'));
const FamilyRegister = lazy(() => import('./features/family/FamilyRegister'));
const ChronicleLedger = lazy(() => import('./features/chronicle/ChronicleLedger'));
const WinterPhase = lazy(() => import('./features/winter/WinterPhase'));
const CombatEncounter = lazy(() => import('./features/combat/CombatEncounterRemaster'));
const BattleSiege = lazy(() => import('./features/battle/BattleSiege'));
const EconomyLedger = lazy(() => import('./features/economy/EconomyLedger'));
const AdventureJournal = lazy(() => import('./features/adventure/AdventureJournal'));
const PersonalityMagicPanel = lazy(() => import('./features/personality/PersonalityMagicPanel'));
const RulebookProcedures = lazy(() => import('./features/rules/RulebookProcedures'));
const SoloOracles = lazy(() => import('./components/SoloOracles'));
const LoreEncyclopedia = lazy(() => import('./components/LoreEncyclopedia'));
const SettingsModal = lazy(() => import('./components/SettingsModal'));
const StandingLedger = lazy(() => import('./features/ledgers/ReputationLedgers').then(module => ({ default: module.StandingLedger })));
const GloryLedger = lazy(() => import('./features/ledgers/ReputationLedgers').then(module => ({ default: module.GloryLedger })));
const RulebookReader = lazy(() => import('./features/rulebook/RulebookReader'));

// Initial state template representing the full blank Knight Character Sheet & Linage
const initialCharacterState = {
  personal: {
    name: "",
    age: 18,
    campaignYear: 767,
    sonNumber: "첫째",
    blessing: "",
    homeland: "아르덴 (Ardennes)",
    home: "바스토뉴 (Bastogne)",
    cultureId: "frankish",
    culture: "프랑크 (Frankish)",
    cultureSourcePage: "Ch.1 pp.26-41",
    religionId: "christian",
    religion: "Christian",
    lineage: "아르덴 (Ardennes)",
    liegeLord: "티에리 공작 (Duke Thierry)",
    fathersClass: "봉신 기사 (Vassal Knight)",
    personalClass: "종자 (Squire)",
    maintenance: "ordinary",
    features: ["왼쪽 뺨의 흉터", "날카로운 벽안", "크고 날씬한 체형"]
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
    prudent: 10, reckless: 10,
    temperate: 10, indulgent: 10,
    trusting: 11, suspicious: 9,
    valorous: 15, cowardly: 5
  },
  skills: {
    awareness: 8, chirurgery: 1, faerieLore: 2, firstAid: 10, folkLore: 4,
    horsemanship: 12, hunting: 6, industry: 5, recognize: 5, religion: 6, stewardship: 3, swimming: 5,
    courtesy: 8, dancing: 2, eloquence: 6, falconry: 4, gaming: 5, heraldry: 5, intrigue: 3, languages: 2, playInstruments: 1, readingWriting: 2, romance: 4, singing: 3,
    battle: 10, siege: 5,
    axe: 6, bludgeon: 5, dagger: 8, spear: 10, sword: 13, unarmed: 6,
    lance: 12,
    bow: 4, crossbow: 5, thrownWeapon: 4
  },
  skillsChecked: {},
  traitsChecked: {},
  squire: {
    name: "피에르 (Pierre)",
    age: 15,
    siz: 10, dex: 10, str: 10, con: 10,
    firstAid: 8, horsemanship: 9, weapon: 8
  },
  horses: {
    warhorse: {
      type: "돌격마 (Charger)",
      breed: "프랑크 (Frankish)",
      damage: "6d6",
      move: 8,
      armor: 5,
      hp: 42,
      age: 5
    },
    other2: "경량마 (Palfrey)",
    other3: "",
    other4: "",
    other5: ""
  },
  gear: {
    armorShield: "사슬갑옷 (10점) + 방패 (+3)",
    clothing: "£2 상당의 궁정 튜닉",
    personalGear: "나무 십자가, 숫돌, 리넨 천 뭉치",
    homePossessions: "곡물 상자, 여분의 검 두 자루, 조상의 태피스트리",
    cash: 5,
    gloryThisGame: 100,
    gloryTotal: 1200
  },
  family: {
    name: "아르덴 (Ardennes)",
    motto: "명예와 신조 (Honor and Faith)",
    battleCry: "몽주아 생드니! (Montjoie Saint-Denis!)",
    ancestor: "알베르 경 (Sir Albert)",
    homeCountry: "프랑크 왕국 (Francia)",
    patronSaint: "성 데니스 (St. Denis)",
    honor: 16,
    allies: "몽글란 가문 (House of Monglane)",
    enemies: "마옌스 가문 (반역자 무리)",
    members: [
      { id: 'albert', name: '알베르 경 (Sir Albert)', relation: '조부', generation: 1, status: '사망', lifeYears: '702~744', note: '가문 조부 연대의 기사.', gender: 'male' },
      { id: 'gerard', name: '제라르 경 (Sir Gerard)', relation: '부친', generation: 2, status: '생존', lifeYears: '724~', note: '가문 부친 연대의 기사.', spouseId: 'eleanor', gender: 'male' },
      { id: 'eleanor', name: '엘레오노르 부인 (Lady Eleanor)', relation: '모친', generation: 2, status: '생존', lifeYears: '748~', note: '기품 있는 성품으로 영지 관리를 돌보는 인자한 어머니.', spouseId: 'gerard', gender: 'female' },
      { id: 'roland', name: '이름 없는 기사', relation: '본인', generation: 3, status: '생존', lifeYears: '749~', note: '플레이어 캐릭터.', parentId: 'gerard', gender: 'male' },
      { id: 'pierre', name: '피에르 (Pierre)', relation: '남동생', generation: 3, status: '생존', lifeYears: '752~', note: '플레이어의 남동생.', parentId: 'gerard', gender: 'male' }
    ],
    ancestorRollLog: [],
    ancestorApplied: false
  },
  journal: {},
  passions: {
    loveCharlemagne: 15,
    loveFamily: 15,
    honor: 16,
    loveGod: 15
  },
  passionsChecked: {},
  standings: {
    charlemagne: 10,
    liegeLord: 15,
    family: 16,
    retinue: 13,
    church: 15,
    commoners: 11
  },
  standingsChecked: {},
  campaign: {
    schemaVersion: 12,
    saveRevision: 0,
    characterCreationSession: null,
    completedCreationIds: [],
    characterArchives: [],
    appliedEvents: {},
    chronicleEvents: [],
    gloryLedger: [],
    standingLedger: [],
    honorLedger: [],
    familyTimeline: [],
    gloryBonusClaimedThreshold: 0,
    personalityMagic: createPersonalityMagicState(),
    health: {
      wounds: [],
      surgeryNeeded: false,
      unconscious: false,
      pendingDeath: null,
      majorWoundCourage: null,
      weeklyCare: [],
      lastUpdatedAt: null
    },
    combat: null,
    combatHistory: [],
    skirmish: null,
    massBattle: null,
    siege: null,
    skirmishHistory: [],
    battleHistory: [],
    siegeHistory: [],
    captives: [],
    pendingEconomy: [],
    adventures: {
      engineVersion: 1,
      active: null,
      history: []
    },
    chapter18: {
      engineVersion: 1,
      active: null,
      history: []
    },
    conditions: [],
    fortresses: [],
    captivity: null,
    lifecycle: {
      status: 'active',
      careerStatus: 'active',
      activeCharacterId: 'roland',
      primaryCharacterId: 'roland',
      pendingCareerEnd: null,
      salvation: null,
      legacy: null,
      successor: null,
      events: [],
      unresolvedChoices: [],
      pendingSuccession: false
    },
    winter: {
      year: 767,
      transactionId: 'winter:767',
      currentStep: 'soloScenario',
      steps: {
        soloScenario: 'pending',
        aging: 'pending',
        economy: 'pending',
        survival: 'pending',
        personalEvent: 'pending',
        family: 'pending',
        experience: 'pending',
        training: 'pending',
        glory: 'pending',
        gloryBonus: 'pending'
      },
      records: {},
      transactions: [],
      logs: [],
      unresolved: {},
      annualLedger: null,
      survivalRecords: [],
      flags: {},
      gloryBonusPoints: 0,
      bonusSpent: 0,
      skippedWithConfirmation: {}
    }
  }
};

const createInitialCharacterState = () => deepClone(initialCharacterState);

initialCharacterState.campaign.economy = createEconomyState(initialCharacterState);

const mergeWithDefault = (data) => sanitizeCampaignState(data, createInitialCharacterState());

const getInitialFirebaseStatus = () => {
  try {
    const savedConfig = localStorage.getItem('paladin_firebase_config');
    if (!savedConfig) return 'UNCONFIGURED';
    const parsed = JSON.parse(savedConfig);
    return parsed.apiKey && parsed.apiKey !== 'YOUR_API_KEY' ? 'CONFIGURED_OFFLINE' : 'UNCONFIGURED';
  } catch {
    return 'UNCONFIGURED';
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState(getInitialFirebaseStatus);
  const [saveActivity, setSaveActivity] = useState('saved');
  const [saveConflict, setSaveConflict] = useState(null);
  const [cloudMeta, setCloudMeta] = useState(null);
  const [user, setUser] = useState(null);

  const [rawCharacter, setRawCharacter] = useState(() => {
    try {
      const saved = localStorage.getItem('paladin_companion_data');
      if (!saved) return createInitialCharacterState();
      const parsed = JSON.parse(saved);
      return mergeWithDefault(parsed);
    } catch (e) {
      console.warn("Failed to parse saved state, loading template:", e);
      return createInitialCharacterState();
    }
  });

  const character = rawCharacter;
  const setCharacter = useCallback((newData) => {
    setRawCharacter(prev => {
      let resolved = typeof newData === 'function' ? newData(prev) : newData;
      const legacyCashChanged = Number(resolved?.gear?.cash) !== Number(prev?.gear?.cash)
        && Number(resolved?.campaign?.economy?.coinDeniers) === Number(prev?.campaign?.economy?.coinDeniers);
      if (legacyCashChanged) {
        resolved = deepClone(resolved);
        resolved.campaign = resolved.campaign || {};
        resolved.campaign.economy = {
          ...(resolved.campaign.economy || createEconomyState(resolved)),
          coinDeniers: toDeniers(resolved.gear.cash)
        };
      }
      const merged = mergeWithDefault(resolved);
      return {
        ...merged,
        campaign: {
          ...merged.campaign,
          saveRevision: Math.max(prev.campaign?.saveRevision || 0, merged.campaign?.saveRevision || 0) + 1
        }
      };
    });
  }, []);

  // Subscribe to Firebase Auth and compare canonical revisions without overwriting local data.
  useEffect(() => {
    let unsubscribe;
    let active = true;
    getFirebaseServices().then(services => {
      if (!active || services.isMock || !services.auth) return;
      unsubscribe = services.auth.onAuthStateChanged(usr => {
        if (usr) {
          setUser(usr);
          setFirebaseStatus('LOGGED_IN');
          services.getCloudSave(usr.uid).then(cloudSave => {
            if (!active) return;
            if (!cloudSave?.characterData) {
              setCloudMeta({ revision: 0, updatedAt: null, localRevision: null });
              return;
            }
            const localSaved = localStorage.getItem('paladin_companion_data');
            const localData = localSaved ? mergeWithDefault(JSON.parse(localSaved)) : createInitialCharacterState();
            const canonicalCloud = mergeWithDefault(cloudSave.characterData);
            const recordsMatch = JSON.stringify(localData) === JSON.stringify(canonicalCloud);
            setCloudMeta({
              revision: cloudSave.revision,
              updatedAt: cloudSave.updatedAt,
              localRevision: recordsMatch ? getCloudSaveRevision(localData) : null
            });
            if (!recordsMatch && !sessionStorage.getItem('paladin_cloud_prompted')) {
              sessionStorage.setItem('paladin_cloud_prompted', 'true');
              setSaveConflict({
                local: localData,
                cloud: canonicalCloud,
                cloudUpdatedAt: cloudSave.updatedAt,
                reason: 'login'
              });
            }
          }).catch(error => {
            console.error('Cloud comparison failed:', error);
          });
        } else {
          setUser(null);
          setCloudMeta(null);
          setSaveConflict(null);
          setFirebaseStatus('CONFIGURED_OFFLINE');
        }
      });
    }).catch(error => console.error('Firebase initialization failed:', error));
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  // Offline-first synchronization with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('paladin_companion_data', JSON.stringify(character));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }, [character]);

  // Auth Operations
  const handleGoogleLogin = async () => {
    const services = await getFirebaseServices();
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
    const services = await getFirebaseServices();
    try {
      await services.logout();
      setUser(null);
      setCloudMeta(null);
      setSaveConflict(null);
      setSaveActivity('saved');
      setFirebaseStatus('CONFIGURED_OFFLINE');
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloudSave = async () => {
    if (!user || saveActivity === 'saving' || saveActivity === 'loading') return;
    const services = await getFirebaseServices();
    try {
      setSaveActivity('saving');
      const sanitizedForCloud = mergeWithDefault(character);
      let expectedRevision = cloudMeta?.revision;
      let expectedUpdatedAt = cloudMeta?.updatedAt;

      if (!cloudMeta || cloudMeta.localRevision === null) {
        const currentCloud = await services.getCloudSave(user.uid);
        if (currentCloud?.characterData) {
          const canonicalCloud = mergeWithDefault(currentCloud.characterData);
          setCloudMeta({
            revision: currentCloud.revision,
            updatedAt: currentCloud.updatedAt,
            localRevision: null
          });
          if (JSON.stringify(sanitizedForCloud) !== JSON.stringify(canonicalCloud)) {
            setSaveConflict({
              local: sanitizedForCloud,
              cloud: canonicalCloud,
              cloudUpdatedAt: currentCloud.updatedAt,
              reason: 'upload'
            });
            setSaveActivity('saved');
            return;
          }
          expectedRevision = currentCloud.revision;
          expectedUpdatedAt = currentCloud.updatedAt;
        } else {
          expectedRevision = 0;
          expectedUpdatedAt = null;
        }
      }

      const result = await services.saveToCloud(user.uid, sanitizedForCloud, {
        expectedRevision,
        expectedUpdatedAt
      });
      setCloudMeta({
        revision: result.revision,
        updatedAt: result.updatedAt,
        localRevision: getCloudSaveRevision(sanitizedForCloud)
      });
      setSaveActivity('uploaded');
    } catch (error) {
      if (error.code === 'paladin/cloud-conflict' && error.cloudSave?.characterData) {
        const canonicalCloud = mergeWithDefault(error.cloudSave.characterData);
        setCloudMeta({
          revision: error.cloudSave.revision,
          updatedAt: error.cloudSave.updatedAt,
          localRevision: null
        });
        setSaveConflict({
          local: mergeWithDefault(character),
          cloud: canonicalCloud,
          cloudUpdatedAt: error.cloudSave.updatedAt,
          reason: 'concurrent'
        });
        setSaveActivity('saved');
        return;
      }
      setSaveActivity('error');
      alert(`클라우드 백업 실패: ${error.message}`);
    }
  };

  const handleCloudLoad = async () => {
    if (!user || saveActivity === 'saving' || saveActivity === 'loading') return;
    const services = await getFirebaseServices();
    try {
      setSaveActivity('loading');
      const cloudSave = await services.getCloudSave(user.uid);
      if (cloudSave?.characterData) {
        const canonicalCloud = mergeWithDefault(cloudSave.characterData);
        const localData = mergeWithDefault(character);
        const recordsMatch = JSON.stringify(localData) === JSON.stringify(canonicalCloud);
        setCloudMeta({
          revision: cloudSave.revision,
          updatedAt: cloudSave.updatedAt,
          localRevision: recordsMatch ? getCloudSaveRevision(localData) : null
        });
        if (!recordsMatch) {
          setSaveConflict({
            local: localData,
            cloud: canonicalCloud,
            cloudUpdatedAt: cloudSave.updatedAt,
            reason: 'load'
          });
        }
      } else {
        setCloudMeta({ revision: 0, updatedAt: null, localRevision: null });
        alert('저장된 클라우드 기록을 찾을 수 없습니다.');
      }
      setSaveActivity('saved');
    } catch (error) {
      setSaveActivity('error');
      alert(`클라우드 가져오기 실패: ${error.message}`);
    }
  };

  const handleKeepLocal = async () => {
    if (!user || !saveConflict || saveActivity === 'saving') return;
    const services = await getFirebaseServices();
    try {
      setSaveActivity('saving');
      const localData = mergeWithDefault(character);
      const result = await services.saveToCloud(user.uid, localData, { force: true });
      setCloudMeta({
        revision: result.revision,
        updatedAt: result.updatedAt,
        localRevision: getCloudSaveRevision(localData)
      });
      setSaveConflict(null);
      setSaveActivity('uploaded');
    } catch (error) {
      setSaveActivity('error');
      alert(`클라우드 덮어쓰기 실패: ${error.message}`);
    }
  };

  const handleUseCloud = () => {
    if (!saveConflict?.cloud) return;
    const canonicalCloud = mergeWithDefault(saveConflict.cloud);
    setRawCharacter(canonicalCloud);
    setCloudMeta(current => ({
      revision: current?.revision ?? getCloudSaveRevision(canonicalCloud),
      updatedAt: saveConflict.cloudUpdatedAt || current?.updatedAt || null,
      localRevision: getCloudSaveRevision(canonicalCloud)
    }));
    setSaveConflict(null);
    setSaveActivity('synced');
  };

  const cloudState = useMemo(() => {
    if (saveActivity === 'saving') return { label: '올리는 중', tone: 'pending' };
    if (saveActivity === 'loading') return { label: '불러오는 중', tone: 'pending' };
    if (saveActivity === 'error') return { label: '확인 필요', tone: 'danger' };
    if (saveConflict) return { label: '버전 충돌', tone: 'danger' };
    if (firebaseStatus === 'LOGGED_IN') {
      const localRevision = getCloudSaveRevision(character);
      if (!cloudMeta || cloudMeta.localRevision !== localRevision) return { label: '업로드 필요', tone: 'pending' };
      if (saveActivity === 'uploaded') return { label: '업로드 완료', tone: 'active' };
      return { label: '클라우드 최신', tone: 'active' };
    }
    return { label: '로컬 저장', tone: 'neutral' };
  }, [character, cloudMeta, firebaseStatus, saveActivity, saveConflict]);

  const renderActiveScreen = () => {
    if (activeTab === 'dashboard') return <Dashboard character={character} setActiveTab={setActiveTab} />;
    if (activeTab === 'chronicle') return <ChronicleLedger character={character} />;
    if (activeTab === 'character') return <CharacterDossier character={character} setCharacter={setCharacter} initialCharacterState={createInitialCharacterState()} />;
    if (activeTab === 'family') return <FamilyRegister character={character} setCharacter={setCharacter} />;
    if (activeTab === 'winter') return <WinterPhase character={character} setCharacter={setCharacter} onNavigate={setActiveTab} />;
    if (activeTab === 'adventure') return <AdventureJournal character={character} setCharacter={setCharacter} onNavigate={setActiveTab} />;
    if (activeTab === 'combat') return <CombatEncounter character={character} setCharacter={setCharacter} onNavigate={setActiveTab} />;
    if (activeTab === 'battle') return <BattleSiege character={character} setCharacter={setCharacter} onNavigate={setActiveTab} />;
    if (activeTab === 'economy') return <EconomyLedger character={character} setCharacter={setCharacter} />;
    if (activeTab === 'personality') return <PersonalityMagicPanel character={character} setCharacter={setCharacter} onNavigate={setActiveTab} />;
    if (activeTab === 'procedures') return <RulebookProcedures character={character} setCharacter={setCharacter} />;
    if (activeTab === 'standing') return <StandingLedger character={character} />;
    if (activeTab === 'glory') return <GloryLedger character={character} />;
    if (activeTab === 'oracles' && character.campaign?.adventures?.active?.pendingSubsystem?.type === 'personality_magic') {
      return <PersonalityMagicPanel character={character} setCharacter={setCharacter} onNavigate={setActiveTab} adventureMode />;
    }
    if (activeTab === 'oracles') return <SoloOracles character={character} setCharacter={setCharacter} />;
    if (activeTab === 'reference') return <LoreEncyclopedia />;
    if (activeTab === 'rulebook') return <RulebookReader />;
    return <Dashboard character={character} setActiveTab={setActiveTab} />;
  };

  return (
    <RulebookProvider activeView={activeTab} onNavigate={setActiveTab}>
      <AppShell
        activeTab={activeTab}
        character={character}
        cloudState={cloudState}
        cloudActions={{
          canLogin: firebaseStatus === 'CONFIGURED_OFFLINE',
          isLoggedIn: firebaseStatus === 'LOGGED_IN',
          onLogin: handleGoogleLogin,
          onLogout: handleLogout,
          onSave: handleCloudSave,
          onLoad: handleCloudLoad,
          isBusy: saveActivity === 'saving' || saveActivity === 'loading'
        }}
        onNavigate={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
      >
        <Suspense fallback={<LoadingState />}>
          {renderActiveScreen()}
        </Suspense>

        <Suspense fallback={null}>
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            character={character}
            setCharacter={setCharacter}
            firebaseStatus={firebaseStatus}
            cloudActions={{
              canLogin: firebaseStatus === 'CONFIGURED_OFFLINE',
              isLoggedIn: firebaseStatus === 'LOGGED_IN',
              onLogin: handleGoogleLogin,
              onLogout: handleLogout,
              onSave: handleCloudSave,
              onLoad: handleCloudLoad,
              isBusy: saveActivity === 'saving' || saveActivity === 'loading'
            }}
            cloudState={cloudState}
            cloudMeta={cloudMeta}
          />
        </Suspense>

        <SaveConflictDialog
          conflict={saveConflict}
          onClose={() => setSaveConflict(null)}
          onKeepLocal={handleKeepLocal}
          onUseCloud={handleUseCloud}
          isBusy={saveActivity === 'saving'}
        />
      </AppShell>
    </RulebookProvider>
  );
}

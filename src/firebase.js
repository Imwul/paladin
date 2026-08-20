const REQUIRED_CONFIG_FIELDS = ['apiKey', 'authDomain', 'projectId', 'appId'];

export const getCloudSaveRevision = (characterData) => {
  const revision = Number(characterData?.campaign?.saveRevision);
  return Number.isSafeInteger(revision) && revision >= 0 ? revision : 0;
};

export const normalizeCloudSaveDocument = (documentData) => {
  if (!documentData || typeof documentData !== 'object' || !documentData.characterData) return null;
  const storedRevision = Number(documentData.revision);
  return {
    characterData: documentData.characterData,
    revision: Number.isSafeInteger(storedRevision) && storedRevision >= 0
      ? storedRevision
      : getCloudSaveRevision(documentData.characterData),
    updatedAt: typeof documentData.updatedAt === 'string' ? documentData.updatedAt : null
  };
};

export const hasCloudWriteConflict = (currentCloud, localRevision, options = {}) => {
  if (!currentCloud || options.force) return false;
  const expectedRevision = Number(options.expectedRevision);
  const hasExpectedRevision = Number.isSafeInteger(expectedRevision) && expectedRevision >= 0;
  const hasExpectedUpdatedAt = typeof options.expectedUpdatedAt === 'string';
  return (
    (hasExpectedRevision && currentCloud.revision !== expectedRevision) ||
    (hasExpectedUpdatedAt && currentCloud.updatedAt !== options.expectedUpdatedAt) ||
    (!hasExpectedRevision && currentCloud.revision > localRevision)
  );
};

const createCloudConflictError = (cloudSave) => {
  const error = new Error('다른 기기에서 클라우드 기록이 변경되었습니다. 두 기록본을 비교한 뒤 다시 선택해 주세요.');
  error.code = 'paladin/cloud-conflict';
  error.cloudSave = cloudSave;
  return error;
};

const createMockServices = (error = null) => ({
  isMock: true,
  auth: null,
  db: null,
  googleProvider: null,
  loginWithGoogle: async () => {
    throw error || new Error("Firebase is not configured. Please set up your API keys in the Settings tab.");
  },
  logout: async () => {},
  saveToCloud: async () => {
    throw error || new Error("Firebase is not configured.");
  },
  loadFromCloud: async () => null,
  getCloudSave: async () => null
});

const getStoredFirebaseConfig = () => {
  try {
    const savedConfig = localStorage.getItem('paladin_firebase_config');
    if (!savedConfig) return null;
    const parsed = JSON.parse(savedConfig);
    const hasRequiredFields = REQUIRED_CONFIG_FIELDS.every(field => (
      typeof parsed[field] === 'string' &&
      parsed[field].trim() &&
      parsed[field] !== 'YOUR_API_KEY'
    ));
    return hasRequiredFields ? parsed : null;
  } catch (e) {
    console.warn("Failed to load custom Firebase config:", e);
    return null;
  }
};

const getConfigAppName = (config) => `paladin-${btoa(`${config.projectId}:${config.appId}`).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32)}`;

/**
 * Dynamically initializes Firebase based on user-provided config in LocalStorage,
 * or falls back to mock/offline mode.
 */
export async function getFirebaseServices() {
  const config = getStoredFirebaseConfig();
  if (!config) return createMockServices();

  try {
    const [appModule, authModule, firestoreModule] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/firestore')
    ]);
    const { initializeApp, getApps } = appModule;
    const { getAuth, GoogleAuthProvider, signInWithPopup, signOut } = authModule;
    const { getFirestore, doc, getDoc, runTransaction } = firestoreModule;
    const appName = getConfigAppName(config);
    const app = getApps().find(existing => existing.name === appName) || initializeApp(config, appName);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const googleProvider = new GoogleAuthProvider();

    const loginWithGoogle = async () => {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    };

    const logout = async () => {
      await signOut(auth);
    };

    const getCloudSave = async (userId) => {
      if (!db) return null;
      const userDocRef = doc(db, 'saves', userId);
      const snapshot = await getDoc(userDocRef);
      return snapshot.exists() ? normalizeCloudSaveDocument(snapshot.data()) : null;
    };

    const saveToCloud = async (userId, data, options = {}) => {
      if (!db) return;
      const sanitizedData = JSON.parse(JSON.stringify(data));
      const userDocRef = doc(db, 'saves', userId);
      const revision = getCloudSaveRevision(sanitizedData);
      const updatedAt = new Date().toISOString();

      await runTransaction(db, async transaction => {
        const snapshot = await transaction.get(userDocRef);
        const currentCloud = snapshot.exists() ? normalizeCloudSaveDocument(snapshot.data()) : null;
        if (hasCloudWriteConflict(currentCloud, revision, options)) {
          throw createCloudConflictError(currentCloud);
        }

        transaction.set(userDocRef, {
          characterData: sanitizedData,
          revision,
          updatedAt
        }, { merge: true });
      });

      return { revision, updatedAt };
    };

    const loadFromCloud = async (userId) => {
      const cloudSave = await getCloudSave(userId);
      return cloudSave?.characterData || null;
    };

    return {
      isMock: false,
      auth,
      db,
      googleProvider,
      loginWithGoogle,
      logout,
      saveToCloud,
      loadFromCloud,
      getCloudSave
    };
  } catch (error) {
    console.error("Error initializing Firebase, falling back to mock mode:", error);
    return createMockServices(error);
  }
}

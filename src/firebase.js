import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const REQUIRED_CONFIG_FIELDS = ['apiKey', 'authDomain', 'projectId', 'appId'];

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
  loadFromCloud: async () => null
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
export function getFirebaseServices() {
  const config = getStoredFirebaseConfig();
  if (!config) return createMockServices();

  try {
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

    const saveToCloud = async (userId, data) => {
      if (!db) return;
      const sanitizedData = JSON.parse(JSON.stringify(data));
      const userDocRef = doc(db, 'saves', userId);
      await setDoc(userDocRef, {
        characterData: sanitizedData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    };

    const loadFromCloud = async (userId) => {
      if (!db) return null;
      const userDocRef = doc(db, 'saves', userId);
      const snapshot = await getDoc(userDocRef);
      if (snapshot.exists()) {
        return snapshot.data().characterData;
      }
      return null;
    };

    return {
      isMock: false,
      auth,
      db,
      googleProvider,
      loginWithGoogle,
      logout,
      saveToCloud,
      loadFromCloud
    };
  } catch (error) {
    console.error("Error initializing Firebase, falling back to mock mode:", error);
    return createMockServices(error);
  }
}

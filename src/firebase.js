import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Default mock/empty configuration fallback
const defaultFirebaseConfig = {
  apiKey: "AIzaSyCBiEh_2YmbU9W_isONi2FugkTzDIYJ0mE",
  authDomain: "skogsduvasbookshop.firebaseapp.com",
  projectId: "skogsduvasbookshop",
  storageBucket: "skogsduvasbookshop.firebasestorage.app",
  messagingSenderId: "1051912666392",
  appId: "1:1051912666392:web:effb955c211c174b26326d"
};

/**
 * Dynamically initializes Firebase based on user-provided config in LocalStorage,
 * or falls back to system defaults.
 */
export function getFirebaseServices() {
  let config = defaultFirebaseConfig;
  
  try {
    const savedConfig = localStorage.getItem('paladin_firebase_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      // Verify basic fields are present and not mock values
      if (parsed.apiKey && parsed.apiKey !== "YOUR_API_KEY") {
        config = parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to load custom Firebase config:", e);
  }

  // If Firebase credentials are still placeholders, return a mocked offline mode
  if (config.apiKey === "YOUR_API_KEY") {
    return {
      isMock: true,
      auth: null,
      db: null,
      googleProvider: null,
      loginWithGoogle: async () => {
        throw new Error("Firebase is not configured. Please set up your API keys in the Settings tab.");
      },
      logout: async () => {},
      saveToCloud: async () => {},
      loadFromCloud: async () => null
    };
  }

  try {
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
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
      const userDocRef = doc(db, 'saves', userId);
      await setDoc(userDocRef, {
        characterData: data,
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
    return {
      isMock: true,
      auth: null,
      db: null,
      googleProvider: null,
      loginWithGoogle: async () => { throw error; },
      logout: async () => {},
      saveToCloud: async () => {},
      loadFromCloud: async () => null
    };
  }
}

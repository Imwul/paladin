export const firebaseConfig = {
  apiKey: 'AIzaSyCBiEh_2YmbU9W_isONi2FugkTzDIYJ0mE',
  authDomain: 'skogsduvasbookshop.firebaseapp.com',
  projectId: 'skogsduvasbookshop',
  storageBucket: 'skogsduvasbookshop.firebasestorage.app',
  messagingSenderId: '1051912666392',
  appId: '1:1051912666392:web:effb955c211c174b26326d',
  databaseURL: 'https://skogsduvasbookshop-default-rtdb.asia-southeast1.firebasedatabase.app'
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

export const getPaladinCloudSavePath = (userId) => {
  const uid = typeof userId === 'string' ? userId.trim() : '';
  if (!uid) throw new Error('클라우드 저장에 필요한 사용자 계정 정보가 없습니다.');
  return ['saves', `uid_${uid}`, 'payloads', 'paladin_companion'];
};

export const shouldUseRedirectSignIn = () => (
  typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent)
);

export const googleSignInErrorMessage = (error = {}) => {
  const code = error.code || '';
  const message = error.message || '';
  if (code === 'auth/popup-blocked') {
    return '브라우저가 로그인 창을 막았습니다. 팝업을 허용한 뒤 다시 시도해 주세요.';
  }
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    return '로그인 창이 닫혔습니다. 본인 구글 계정을 골라 다시 시도해 주세요.';
  }
  if (code === 'auth/unauthorized-domain') {
    return '현재 사이트 주소가 Firebase 허용 도메인에 없습니다. Firebase Authentication의 승인된 도메인을 확인해 주세요.';
  }
  if (code === 'auth/operation-not-allowed') {
    return 'Firebase 프로젝트에서 Google 로그인이 꺼져 있습니다.';
  }
  if (/access.?denied|403: access_denied|has not completed the Google verification|앱이 확인되지/i.test(`${code} ${message}`)) {
    return 'Google 로그인 앱이 테스트 모드입니다. OAuth 동의 화면을 게시하거나 이 계정을 테스트 사용자로 추가해 주세요.';
  }
  return `로그인 중 오류가 발생했습니다: ${message || code || '알 수 없는 오류'}`;
};

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

export const createPaladinCloudSaveDocument = (userId, data, updatedAt = new Date().toISOString()) => {
  const uid = typeof userId === 'string' ? userId.trim() : '';
  getPaladinCloudSavePath(uid);
  const characterData = JSON.parse(JSON.stringify(data));
  return {
    ownerUid: uid,
    app: 'paladin',
    characterData,
    revision: getCloudSaveRevision(characterData),
    updatedAt
  };
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
  completeRedirectLogin: async () => null,
  loginWithGoogle: async () => {
    throw error || new Error('Firebase가 구성되지 않았습니다.');
  },
  logout: async () => {},
  saveToCloud: async () => {
    throw error || new Error('Firebase가 구성되지 않았습니다.');
  },
  loadFromCloud: async () => null,
  getCloudSave: async () => null
});

let redirectResultPromise = null;

export async function getFirebaseServices() {
  if (!isFirebaseConfigured) return createMockServices();

  try {
    const [appModule, authModule, firestoreModule] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/firestore')
    ]);
    const { initializeApp, getApps } = appModule;
    const {
      getAuth,
      getRedirectResult,
      GoogleAuthProvider,
      signInWithPopup,
      signInWithRedirect,
      signOut
    } = authModule;
    const { getFirestore, doc, getDoc, runTransaction } = firestoreModule;
    const appName = 'paladin-cloud-save';
    const app = getApps().find(existing => existing.name === appName) || initializeApp(firebaseConfig, appName);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });

    const completeRedirectLogin = () => {
      if (!redirectResultPromise) redirectResultPromise = getRedirectResult(auth);
      return redirectResultPromise;
    };

    const loginWithGoogle = async () => {
      if (shouldUseRedirectSignIn()) {
        await signInWithRedirect(auth, googleProvider);
        return null;
      }
      try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
      } catch (error) {
        if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/cancelled-popup-request') {
          await signInWithRedirect(auth, googleProvider);
          return null;
        }
        throw error;
      }
    };

    const logout = async () => {
      await signOut(auth);
    };

    const cloudSaveRef = userId => doc(db, ...getPaladinCloudSavePath(userId));

    const getCloudSave = async (userId) => {
      const snapshot = await getDoc(cloudSaveRef(userId));
      return snapshot.exists() ? normalizeCloudSaveDocument(snapshot.data()) : null;
    };

    const saveToCloud = async (userId, data, options = {}) => {
      const userDocRef = cloudSaveRef(userId);
      const cloudDocument = createPaladinCloudSaveDocument(userId, data);

      await runTransaction(db, async transaction => {
        const snapshot = await transaction.get(userDocRef);
        const currentCloud = snapshot.exists() ? normalizeCloudSaveDocument(snapshot.data()) : null;
        if (hasCloudWriteConflict(currentCloud, cloudDocument.revision, options)) {
          throw createCloudConflictError(currentCloud);
        }

        transaction.set(userDocRef, cloudDocument, { merge: true });
      });

      return { revision: cloudDocument.revision, updatedAt: cloudDocument.updatedAt };
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
      completeRedirectLogin,
      loginWithGoogle,
      logout,
      saveToCloud,
      loadFromCloud,
      getCloudSave
    };
  } catch (error) {
    console.error('Firebase 초기화에 실패해 로컬 저장만 사용합니다:', error);
    return createMockServices(error);
  }
}

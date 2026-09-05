import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBZJu-zH6c0ENk0slhHToYub8SaFmdcCVo',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'violet-65ba3.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'violet-65ba3',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'violet-65ba3.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '833444539463',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:833444539463:web:acaa1c0c5689fb95431562'
};

// Check if valid Firebase configuration is provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.projectId && 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'your_api_key_here' &&
  !firebaseConfig.apiKey.includes('PLACEHOLDER')
);

let app = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
}

export { db };
export const activeProjectId = firebaseConfig.projectId || null;

/**
 * Real-time listener for a Firestore collection
 */
export const subscribeCollection = (collectionName, callback, onError) => {
  if (!db) return () => {};

  const colRef = collection(db, collectionName);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      callback(items);
    },
    (error) => {
      console.error(`Error subscribing to collection "${collectionName}":`, error);
      if (onError) onError(error);
    }
  );
};

/**
 * Real-time listener for a single Firestore document
 */
export const subscribeDocument = (collectionName, docId, callback, onError) => {
  if (!db) return () => {};

  const docRef = doc(db, collectionName, docId);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() });
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error(`Error subscribing to doc "${collectionName}/${docId}":`, error);
      if (onError) onError(error);
    }
  );
};

/**
 * Save or overwrite a document with specific ID
 */
export const saveDocument = async (collectionName, docId, data) => {
  if (!db) return null;
  const docRef = doc(db, collectionName, String(docId));
  await setDoc(docRef, data, { merge: true });
  return { id: docId, ...data };
};

/**
 * Update specific fields in a document
 */
export const updateDocument = async (collectionName, docId, data) => {
  if (!db) return null;
  const docRef = doc(db, collectionName, String(docId));
  await updateDoc(docRef, data);
  return { id: docId, ...data };
};

/**
 * Delete a document
 */
export const deleteDocument = async (collectionName, docId) => {
  if (!db) return null;
  const docRef = doc(db, collectionName, String(docId));
  await deleteDoc(docRef);
  return docId;
};

/**
 * Seed initial mock data to Firestore collections (1-click sync)
 */
export const seedInitialDataToFirebase = async (initialData) => {
  if (!db) throw new Error('Firebase belum dikonfigurasi. Periksa file .env Anda.');

  const batch = writeBatch(db);

  // 1. Routes
  if (Array.isArray(initialData.routes)) {
    initialData.routes.forEach((route) => {
      const ref = doc(db, 'routes', String(route.id));
      batch.set(ref, route, { merge: true });
    });
  }

  // 2. Vehicles
  if (Array.isArray(initialData.vehicles)) {
    initialData.vehicles.forEach((veh) => {
      const ref = doc(db, 'vehicles', String(veh.id));
      batch.set(ref, veh, { merge: true });
    });
  }

  // 3. Drivers
  if (Array.isArray(initialData.drivers)) {
    initialData.drivers.forEach((drv) => {
      const ref = doc(db, 'drivers', String(drv.id));
      batch.set(ref, drv, { merge: true });
    });
  }

  // 4. Schedules
  if (Array.isArray(initialData.schedules)) {
    initialData.schedules.forEach((sch) => {
      const ref = doc(db, 'schedules', String(sch.id));
      batch.set(ref, sch, { merge: true });
    });
  }

  // 5. Bookings
  if (Array.isArray(initialData.bookings)) {
    initialData.bookings.forEach((bk) => {
      const ref = doc(db, 'bookings', String(bk.id));
      batch.set(ref, bk, { merge: true });
    });
  }

  // 6. Settings
  if (initialData.settings) {
    const ref = doc(db, 'settings', 'general');
    batch.set(ref, initialData.settings, { merge: true });
  }

  // 7. Users
  if (Array.isArray(initialData.users)) {
    initialData.users.forEach((usr) => {
      const ref = doc(db, 'users', String(usr.id));
      batch.set(ref, usr, { merge: true });
    });
  }

  await batch.commit();
  return true;
};

/**
 * Delete all documents in a Firestore collection
 */
export const clearCollection = async (collectionName) => {
  if (!db) return;
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return;
    const batch = writeBatch(db);
    snapshot.docs.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error(`Error clearing collection ${collectionName}:`, error);
  }
};


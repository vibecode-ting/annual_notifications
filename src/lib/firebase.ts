import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Use import.meta.glob to optionally load the injected config without breaking the build if it's missing
const configModules = import.meta.glob('../../firebase-applet-config.json', { eager: true });
const injectedConfig = Object.values(configModules)[0] as any;

const firebaseConfig = injectedConfig?.default || {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const dbId = injectedConfig?.default?.firestoreDatabaseId || import.meta.env.VITE_FIRESTORE_DB_ID || '(default)';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, dbId);

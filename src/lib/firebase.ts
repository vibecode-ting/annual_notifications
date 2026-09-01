import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Use import.meta.glob to optionally load the injected config without breaking the build if it's missing
const configModules = import.meta.glob('../../firebase-applet-config.json', { eager: true });
const injectedConfig = Object.values(configModules)[0] as any;

const firebaseConfig = injectedConfig?.default || {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-app.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-app',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-app.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:123456789',
};

const dbId = injectedConfig?.default?.firestoreDatabaseId || import.meta.env.VITE_FIRESTORE_DB_ID || '(default)';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, dbId);

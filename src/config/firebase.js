// src/config/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBIwSPUlh7INk477YW7no8CZ8b534ety48',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ai-interview-4e732.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ai-interview-4e732',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ai-interview-4e732.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '604710690825',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:604710690825:web:7c180e3a5ccf60cbccd8d8',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-HVPF80KD5W'
};

export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey && 
    firebaseConfig.apiKey.length > 5 && 
    firebaseConfig.projectId
  );
};

let app = null;
let auth = null;
let googleProvider = null;
let githubProvider = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
  githubProvider = new GithubAuthProvider();
} catch (err) {
  console.error('Firebase initialization error:', err);
}

export { app, auth, googleProvider, githubProvider, signInWithPopup, signOut };

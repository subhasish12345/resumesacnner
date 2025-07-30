import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "resume-matcher-l5w4q",
  "appId": "1:179227222566:web:9b783a8b6d57c019be7ce7",
  "storageBucket": "resume-matcher-l5w4q.firebasestorage.app",
  "apiKey": "AIzaSyAkAtdtiFrl5uR-F5D7Arbze2r3JETalAI",
  "authDomain": "resume-matcher-l5w4q.firebaseapp.com",
  "messagingSenderId": "179227222566"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

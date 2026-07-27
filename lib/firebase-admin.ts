import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const apps = getApps();

if (!apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
    const serviceAccount = JSON.parse(decoded);
    initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // Local fallback: uses GOOGLE_APPLICATION_CREDENTIALS or Application Default Credentials
    initializeApp();
  }
}

export const db = getFirestore();

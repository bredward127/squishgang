import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as config from '../firebase-applet-config.json';

const apps = getApps();

// We can just use default initialization in a GCP environment,
// but since this might run in various contexts, we initialize with default credentials.
// For AI Studio preview environments with Firebase provisioned, 
// using the default application credentials usually works or we just initializeApp()
if (!apps.length) {
  initializeApp();
}

export const db = getFirestore();

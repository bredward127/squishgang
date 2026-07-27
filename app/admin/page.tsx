'use client';

import { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '@/firebase-applet-config.json';
import { Navbar } from '@/components/Navbar';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Request Google Sheets scope
provider.addScope('https://www.googleapis.com/auth/spreadsheets');

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setToken(credential.accessToken);
        setUser(result.user);
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSync = async () => {
    if (!token) return;
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/admin/sync-sheets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSyncMessage(`Success! Spreadsheet created: ${data.spreadsheetUrl}`);
      } else {
        setSyncMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setSyncMessage('Failed to sync leads.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <h1 className="text-3xl font-black text-slate-800 mb-8 uppercase tracking-tight">Admin Dashboard</h1>
        
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm max-w-2xl">
          <h2 className="text-xl font-bold text-slate-700 mb-4">Export Leads to Google Sheets</h2>
          <p className="text-slate-500 text-sm mb-6">
            Authenticate with Google to create a spreadsheet containing all your collected leads.
          </p>

          {!user || !token ? (
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              {isLoggingIn ? 'Signing in...' : 'Sign in with Google'}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                <div>
                  <p className="text-sm font-bold text-green-800">Authenticated as {user.displayName}</p>
                  <p className="text-xs text-green-600">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="w-full py-3 bg-pink-500 hover:bg-pink-600 transition-colors text-white rounded-lg font-bold disabled:opacity-50"
              >
                {isSyncing ? 'Syncing to Sheets...' : 'Sync Leads to Google Sheets'}
              </button>

              {syncMessage && (
                <div className="mt-4 p-4 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg break-words">
                  {syncMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

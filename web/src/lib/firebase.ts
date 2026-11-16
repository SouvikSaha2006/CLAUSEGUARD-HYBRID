// ClauseGuard Hybrid - Firebase & Firebase AI Logic Configuration (#BuildHybridAI 2026)

import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from 'firebase/app-check';
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import {
  getRemoteConfig,
  fetchAndActivate,
  getString,
  getNumber,
  type RemoteConfig
} from 'firebase/remote-config';
import { getAI, GoogleAIBackend, type AI } from 'firebase/ai';

// 1. Firebase Config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoKeyClauseGuardHybrid2026',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'clauseguard-hybrid.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'clauseguard-hybrid',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'clauseguard-hybrid.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef1234567890',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-DEMOCLAUSE123',
};

// 2. Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 3. Initialize Firebase App Check (DEBUG token set on self before init)
export let appCheck: AppCheck | null = null;
if (typeof window !== 'undefined') {
  const debugToken = import.meta.env.VITE_APPCHECK_DEBUG_TOKEN;
  (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string }).FIREBASE_APPCHECK_DEBUG_TOKEN =
    debugToken === 'false' ? false : debugToken || true;

  try {
    const recaptchaKey =
      import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(recaptchaKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (err) {
    console.info('[Firebase AppCheck] Initialized in development/debug mode:', err);
  }
}

// 4. Firebase Auth with automatic anonymous sign-in
export const auth = getAuth(app);
export let currentUser: User | null = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

signInAnonymously(auth).catch((err) => {
  console.info('[Firebase Auth] Anonymous sign-in initialized (local/offline ready):', err.message);
});

// 5. Firestore Database
export const db = initializeFirestore(app, { experimentalForceLongPolling: true });

// 6. Firebase Remote Config
export const remoteConfig: RemoteConfig = getRemoteConfig(app);
remoteConfig.settings = {
  minimumFetchIntervalMillis: 5000,
  fetchTimeoutMillis: 10000,
};
remoteConfig.defaultConfig = {
  routing_mode: 'hybrid_airgap',
  cloud_escalation_threshold: 60,
};

export interface RemoteConfigValues {
  routing_mode: string;
  cloud_escalation_threshold: number;
}

export async function fetchRemoteConfigValues(): Promise<RemoteConfigValues> {
  try {
    await fetchAndActivate(remoteConfig);
  } catch (err) {
    console.info('[Firebase RemoteConfig] Using default config values:', err);
  }

  return {
    routing_mode: getString(remoteConfig, 'routing_mode') || 'hybrid_airgap',
    cloud_escalation_threshold: getNumber(remoteConfig, 'cloud_escalation_threshold') || 60,
  };
}

// 7. Firebase AI Logic Core
export const ai: AI = getAI(app, { backend: new GoogleAIBackend() });

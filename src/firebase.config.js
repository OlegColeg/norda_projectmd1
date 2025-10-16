// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Build configuration from Vite env vars (so it can be overridden in Vercel)
// If you don't provide env vars, the hard-coded defaults below are used.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDTza6FPVqOJCbkUtb7ETtcJMvavHeoI6M",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "norda-projectmd.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "norda-projectmd",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "norda-projectmd.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "586357941687",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:586357941687:web:eaf327a9d31148e93db432",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-VVFBFLG3GJ"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Only initialize analytics when running in the browser (avoid errors during build/SSR)
let analyticsInstance = null;
try {
  if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
    analyticsInstance = getAnalytics(app);
  }
} catch (err) {
  // Non-fatal: analytics may not be available during build or in some runtimes
  // Log at debug level for troubleshooting but don't throw.
  // console.debug('Analytics not initialized:', err);
}

export const analytics = analyticsInstance;
export const db = getFirestore(app);

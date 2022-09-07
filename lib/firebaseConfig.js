import { initializeApp, getApps, getApp } from 'firebase/app';
/* import { getAnalytics } from 'firebase/analytics'; */
/* import { getFirestore } from 'firebase/firestore'; */

const firebaseConfig = {
  apiKey: 'AIzaSyCPvBC1nx-APa-7lANreN8kuSiAXwgiZuI',
  authDomain: 'chat-app-d31ab.firebaseapp.com',
  projectId: 'chat-app-d31ab',
  storageBucket: 'chat-app-d31ab.appspot.com',
  messagingSenderId: '190855119792',
  appId: '1:190855119792:web:ec29acb374cd314bc98c75',
  measurementId: 'G-81FBN5MZF2',
};

// Initialize Firebase
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
/* export const db = getFirestore(app); */
/* const analytics = getAnalytics(app); */

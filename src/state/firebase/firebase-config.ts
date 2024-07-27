// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const myFirebaseConfigApiKey = import.meta.env.VITE_EMPOWER_LAB_FIREBASE_API_KEY;
const myFirebaseConfigAuthDomain = import.meta.env.VITE_EMPOWER_LAB_FIREBASE_AUTH_DOMAIN
const myFirebaseConfigProjectId = import.meta.env.VITE_EMPOWER_LAB_FIREBASE_PROJECT_ID
const myFirebaseConfigStorageBucket = import.meta.env.VITE_EMPOWER_LAB_FIREBASE_STORAGE_BUCKET
const myFirebaseConfigMessageSenderId = import.meta.env.VITE_EMPOWER_LAB_FIREBASE_MESSAGING_SENDER_ID
const myFirebaseConfigAppId = import.meta.env.VITE_EMPOWER_LAB_FIREBASE_APP_ID
const myFirebaseMeasurementId = import.meta.env.VITE_EMPOWER_LAB_FIREBASE_MEASUREMENT_ID

// Your web app's Firebase configuration
const firebaseConfig2 = {
  apiKey: myFirebaseConfigApiKey,
  authDomain: myFirebaseConfigAuthDomain,
  projectId: myFirebaseConfigProjectId,
  storageBucket: myFirebaseConfigStorageBucket,
  messagingSenderId: myFirebaseConfigMessageSenderId,
  appId: myFirebaseConfigAppId,
  measurementId: myFirebaseMeasurementId
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig2);
export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { partnerFirebaseConfig } from "./environment";

const partnerApp = initializeApp(partnerFirebaseConfig, 'PartnerApp');
export const partnerAuth = getAuth(partnerApp);
export const partnerDb = getFirestore(partnerApp);
console.log('Initialized partner-firebase');

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { myFirebaseConfig } from "./environment";

const myApp = initializeApp(myFirebaseConfig, 'MyApp');
export const myAuth = getAuth(myApp);
export const myDb = getFirestore(myApp);
console.log('Initialized my-firebase');

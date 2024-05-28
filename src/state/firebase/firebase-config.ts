// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCdjr9Jn3tqbYKaRSL9cPlPqT0TsSsVEe8',
  authDomain: 'storygraph2.firebaseapp.com',
  projectId: 'storygraph2',
  storageBucket: 'storygraph2.appspot.com',
  messagingSenderId: '1025377557908',
  appId: '1:1025377557908:web:7160126d56e02092874381',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

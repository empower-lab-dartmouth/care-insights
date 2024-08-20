import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  NextOrObserver,
  User,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { db } from './firebase-config';
import { doc, setDoc } from 'firebase/firestore';
import { UserLoginEvent } from '../recoil';
import { partnerAuth } from '../partner-firebase';
import { convertEmailToMemcaraEmail } from '../fetching-integrated';
import { CookieData } from '../types';
import { resetAuthCache, signInWithEmailAndPasswordCache } from '../globals';

// const auth = getAuth(app);

const logUserSignIn = async (username: string) => {
  const d = new Date();
  const id = `${username}-sign-in-${d.toString()}`;
  const userSignIn: UserLoginEvent = {
    username,
    date: d.getTime(),
    id,
    type: 'login',
  };
  try {
    await setDoc(doc(db, `zEL-${username}`, id), userSignIn);
    await setDoc(doc(db, 'LastUserServer', username), {
      username,
    });
    console.log('Wrote a sign in event to the event log');
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const signInUser = async (email: string, password: string, 
  setCookie: (name: "careInsightsUsername" | "careInsightsPassword", 
    value: any) => void) => {
  if (!email && !password) return;
  logUserSignIn(email);
  console.log('Calling sign in from cache from firebase.ts');
  const auth = await signInWithEmailAndPasswordCache(partnerAuth, convertEmailToMemcaraEmail(email), password, 'firebase');
  if(auth) {
    setCookie('careInsightsUsername', email);
    setCookie('careInsightsPassword', password);
  } else {
    setCookie('careInsightsUsername', '');
    setCookie('careInsightsPassword', '');
  }
  return auth;
};

export const userStateListener = (callback: NextOrObserver<User>) => {
  return onAuthStateChanged(partnerAuth, callback);
};

export const SignOutUser = async () => {
  resetAuthCache();
  await signOut(partnerAuth);
}

export const handleSignUp = async (
  email: string,
  password: string,
  name: string
) => {
  return createUserWithEmailAndPassword(partnerAuth, email, password)
    .then(async userCredential => {
      // Signed in
      const user = userCredential.user;
      const userInfo = {
        username: email,
        createdDate: new Date().toString(),
        name,
      };
      try {
        console.log('adding user info');
        await setDoc(doc(db, 'UserInfo', email), userInfo);
        logUserSignIn(email);
      } catch (e) {
        console.error('Error adding document: ', e);
      }
      console.log(user);
    })
    .catch(async error => {
      const errorCode = await error.code;
      const errorMessage = await error.message;
      console.log(errorCode);
      console.log(errorMessage);

      // customizable error messages
      if (errorCode === 'auth/invalid-email') {
        return 'Please choose a valid email address.';
      } else if (errorCode === 'auth/weak-password') {
        return 'Password should be at least 6 characters.';
      } else if (errorCode === 'auth/email-already-in-use') {
        return 'This email is already in use. Please log in.';
      }
      return errorMessage;
    });
};

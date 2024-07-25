const myFirebaseConfigApiKey = import.meta.env.VITE_CARE_SUITE_FIREBASE_CONFIG_API_KEY;
const myFirebaseConfigAuthDomain = import.meta.env.VITE_VITE_CARE_SUITE_FIREBASE_CONFIG_AUTH_DOMAIN
const myFirebaseConfigProjectId = import.meta.env.VITE_CARE_SUITE_FIREBASE_CONFIG_PROJECT_ID
const myFirebaseConfigStorageBucket = import.meta.env.VITE_CARE_SUITE_FIREBASE_CONFIG_STORAGE_BUCKET
const myFirebaseConfigMessageSenderId = import.meta.env.VITE_CARE_SUITE_FIREBASE_CONFIG_MESSAGING_SENDER_ID
const myFirebaseConfigAppId = import.meta.env.VITE_CARE_SUITE_FIREBASE_CONFIG_APP_ID

const partnerFirebaseConfigApiKey = import.meta.env.VITE_CARE_SUITE_PARTNER_FIREBASE_CONFIG_API_KEY
const partnerFirebaseConfigAuthDomain = import.meta.env.VITE_CARE_SUITE_PARTNER_FIREBASE_CONFIG_AUTH_DOMAIN
const partnerFirebaseConfigProjectId = import.meta.env.VITE_CARE_SUITE_PARTNER_FIREBASE_CONFIG_PROJECT_ID
const partnerFirebaseConfigStorageBucket = import.meta.env.VITE_CARE_SUITE_PARTNER_FIREBASE_CONFIG_STORAGE_BUCKET
const partnerFirebaseConfigMessagingSenderId = import.meta.env.VITE_CARE_SUITE_PARTNER_FIREBASE_CONFIG_MESSAGE_SENDER_ID
const partnerFirebaseConfigAppId = import.meta.env.VITE_CARE_SUITE_PARTNER_FIREBASE_CONFIG_APP_ID

export const myFirebaseConfig = {
  apiKey: myFirebaseConfigApiKey,
  authDomain: myFirebaseConfigAuthDomain,
  projectId: myFirebaseConfigProjectId,
  storageBucket: myFirebaseConfigStorageBucket,
  messagingSenderId: myFirebaseConfigMessageSenderId,
  appId: myFirebaseConfigAppId
};
  
export const partnerFirebaseConfig = {
  apiKey: partnerFirebaseConfigApiKey,
  authDomain: partnerFirebaseConfigAuthDomain,
  projectId: partnerFirebaseConfigProjectId,
  storageBucket: partnerFirebaseConfigStorageBucket,
  messagingSenderId: partnerFirebaseConfigMessagingSenderId,
  appId: partnerFirebaseConfigAppId
};

// export const caregiverEmail = 'bbee-at-oakwoodmanor@memcara.com';
// export const caregiverPassword = 'fabulous';

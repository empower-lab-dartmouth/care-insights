import { SetterOrUpdater } from 'recoil';
import {
  CRProgramEvents,
  CareRecipientInfo,
  CaregiverInfo,
  FacilityInfo,
  PageState,
  ProgramEvent,
} from './types';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebase/firebase-config';
import { defaultQueryEmpty, samplePageState } from './recoil';
import { QueryRecord } from './queryingTypes';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { askQuery, respondToApprovalFeedback } from './querying';
import { myDb } from './my-firebase';
import { partnerAuth, partnerDb } from './partner-firebase';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { DEFAULT_PROFILE_IMAGE } from './sampleData';

export const caregiverEmail = 'mmemcara@well'; //'bmorgan-at-oakwoodmanor@memcara.com';
export const caregiverPassword = 'dartmouth';
// export const caregiverEmail = 'bmorgan-at-oakwoodmanor@memcara.com';
// export const caregiverPassword = 'samuelson';

export const convertEmailToMemcaraEmail = (input: string) => {
  if (input.endsWith('@memcara.com')) {
    return input;
  }
  return input.replaceAll("@", '-at-') + '@memcara.com';
}

export const loadCareRecipientsInfoFromCaresuite = async (
    pageState: PageState,
    setPageContext: SetterOrUpdater<PageState>,
    setCareRecipientInfo: SetterOrUpdater<Record<string, CareRecipientInfo>>
  ) => {
    console.log('loading info on all care recipients from care suite');
    setPageContext({
      ...pageState,
      loadingCRInfo: true,
    });
    // console.log('try to sign in');
  // Given the signed in user's credentials, let's enumerate all the Cr's that he/she can access
  console.log('try to sign in');
  const userCred = await signInWithEmailAndPassword(partnerAuth, convertEmailToMemcaraEmail(caregiverEmail), caregiverPassword);
  console.log('get authorized recipients', userCred);
  const snap = await getDoc(doc(partnerDb, 'account-users', userCred.user.uid));
  const accountId = snap.data()?.accountId;
  
  const [snapAccount, snapCaregiver, snapRecipientsInAccount, snapRecipientsAssignedToCaregiver] = await Promise.all([
    getDoc(doc(partnerDb, 'accounts', accountId)),
    getDoc(doc(partnerDb, 'facility-caregivers', userCred.user.uid)),
    getDocs(query(collection(partnerDb, 'recipients'), where('accountId', '==', accountId), where('removed', '==', false))),
    getDocs(query(collection(partnerDb, 'recipient-caregivers'), where('caregiverId', '==', userCred.user.uid)))
    ]);
    
    const globalRecipientAccess = snapAccount.exists() ? (snapAccount.data().globalRecipientAccess ?? false) : false;
    const caregiverPosition = snapCaregiver.exists() ? (snapCaregiver.data().position ?? 'unknown') : 'unknown';
    const recipientsInAccount = snapRecipientsInAccount.docs.map(doc => ({ recipientId: doc.id, displayName: doc.data().displayName as string }));
    const recipientsAssignedToCaregiver = snapRecipientsAssignedToCaregiver.docs.map(doc => ({ recipientId: doc.data().recipientId as string}));
    
    const pinnedRecipients = recipientsAssignedToCaregiver.map(rc => ({ recipientId: rc.recipientId, displayName: recipientsInAccount.find(r => r.recipientId === rc.recipientId)?.displayName ?? 'unknown'}));
    const searchRecipients = (['Family', 'Volunteer'].includes(caregiverPosition) ? [] : (!globalRecipientAccess ? [] : (recipientsInAccount.map(r => ({ recipientId: r.recipientId, displayName: r.displayName})))));
    await signOut(partnerAuth);
    const result: CareRecipientInfo[] = snapRecipientsInAccount.docs.map((doc) => ({
      imageURL: DEFAULT_PROFILE_IMAGE, // Not set yet
      name: doc.data().displayName, 
            infoBox: [],
            facilityID: 'NA', // Not used anymore
            dateCreated: 1, // Not used  anymore
            uuid: doc.id,
    }));
    const temp: Record<string, CareRecipientInfo> = {};
    const careRecipients: Record<string, CareRecipientInfo> = result.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.uuid]: curr,
      }),
      temp
    );
    setCareRecipientInfo(careRecipients);
    setPageContext({
      ...pageState,
      loadingCRInfo: false,
    });
    // console.log('RESULT', result);
    // return result;
    }
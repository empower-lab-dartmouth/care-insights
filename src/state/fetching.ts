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
import { loadCareRecipientsInfoFromCaresuite } from './fetching-integrated';

// export function getSelectedCRProgramEvents(v: string) {
//     return fetchSampleProgramData(v);
// }

const QUERY_LIMIT = 30;

export const loadCRData = async (
  pageState: PageState,
  setPageContext: SetterOrUpdater<PageState>,
  setLocalQueries: SetterOrUpdater<Record<string, QueryRecord>>,
  careRecipientsInfo: Record<string, CareRecipientInfo>,
) => {
  console.log('loading care recipient data');
  if (pageState.selectedCR !== 'NONE') {
    // Pull sepcific CR's data
    setPageContext({
      ...pageState,
      loadingCRInfo: true,
    });
    const q = query(
      collection(db, `CRProgramEvents`),
      where('CRUUID', '==', pageState.selectedCR),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.docs);
    console.log('Firebase collection read <program events>');
    const docs: ProgramEvent[] = querySnapshot.docs.map((doc: any) => {
      const d = doc.data() as any as ProgramEvent;
      return d as ProgramEvent;
    });
    console.log('DOCS:');
    console.log(docs);
    const temp: CRProgramEvents = {};
    const programEvents: CRProgramEvents = docs.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.uuid]: curr,
      }),
      temp
    );
    const updatedPageState = {
      ...pageState,
      selectedCRProgramEvents: programEvents,
      loadingCRInfo: false,
    };
    setPageContext(updatedPageState);
    loadQueriesForCR(updatedPageState, careRecipientsInfo, setPageContext, setLocalQueries);
  } else {
    // Pull all CRs' data
    setPageContext({
      ...pageState,
      loadingCRInfo: true,
    });
    const q = query(
      collection(db, `CRProgramEvents`),
      limit(QUERY_LIMIT),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.docs);
    console.log('Firebase collection read <program events>');
    const docs: ProgramEvent[] = querySnapshot.docs.map((doc: any) => {
      const d = doc.data() as any as ProgramEvent;
      return d as ProgramEvent;
    });
    const temp: CRProgramEvents = {};
    const programEvents: CRProgramEvents = docs.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.uuid]: curr,
      }),
      temp
    );
    setPageContext({
      ...pageState,
      selectedCRProgramEvents: programEvents,
      loadingCRInfo: false,
      insightsQuery: defaultQueryEmpty,
      suggestedQueries: [],
    });
  }
};

const sampleAvoidQuery = (name: string) => `What specific things should you as a caregiver avoid when working with ${name}?`;
const sampleDoQuery = (name: string) => `What things should you as a caregiver do more of when working with ${name}?`;
const sampleSymptomsQuery = (name: string) => `What common symptoms does ${name} show?`;
const sampleRedirectQuery = (name: string) => `What things should you do as a dementia caregiver to redirect ${name} show?`;

export const generateQuickFactsQueries = async (
  pageState: PageState,
  queries: Record<string, QueryRecord>,
  setLocalQueries: SetterOrUpdater<Record<string, QueryRecord>>) => {
  const handleLocalQueryResponse = (q: QueryRecord) => {
    // setLocalQueries({
    //   ...queries,
    //   [q.query]: q
    // });
    // respondToApprovalFeedback(q);
  }
  console.log('Generating quick facts queries');
  Promise.all([askQuery(pageState.avoidQuery,
    handleLocalQueryResponse,
    pageState.selectedCRProgramEvents,
    pageState.username,
    pageState.selectedCR,
    queries,
    false),
    askQuery(pageState.doQuery,
      handleLocalQueryResponse,
      pageState.selectedCRProgramEvents,
      pageState.username,
      pageState.selectedCR,
      queries,
      false),
    askQuery(pageState.redirectionQuery,
      handleLocalQueryResponse,
      pageState.selectedCRProgramEvents,
      pageState.username,
      pageState.selectedCR,
      queries,
      false),
    askQuery(pageState.symptomsQuery,
      handleLocalQueryResponse,
      pageState.selectedCRProgramEvents,
      pageState.username,
      pageState.selectedCR,
      queries,
      false)]).then((res) => setLocalQueries({
        ...queries,
        [res[0].query]: res[0],
        [res[1].query]: res[1],
        [res[2].query]: res[2],
        [res[3].query]: res[3]
      }));
}

export const loadQueriesForCR = async (
  pageState: PageState,
  careRecipientsInfo: Record<string, CareRecipientInfo>,
  setPageContext: SetterOrUpdater<PageState>,
  setLocalQueries: SetterOrUpdater<Record<string, QueryRecord>>
) => {
  // Pull all CRs' data
  setPageContext({
    ...pageState,
    loadingCRInfo: true,
  });
  const q = query(
    collection(db, `QueryRecord`),
    where('CRUUID', '==', pageState.selectedCR)
  );
  const querySnapshot = await getDocs(q);
  console.log(querySnapshot.docs);
  console.log('Firebase collection read <queries>');
  const CR = careRecipientsInfo[pageState.selectedCR];
  if (CR === undefined) {
    console.log("Invalid care recipient name, cancelling fetch");
    setPageContext({
      ...pageState,
      loadingCRInfo: false,
    });
    return;
  }
  const CRName = careRecipientsInfo[pageState.selectedCR].name;
  if (querySnapshot.empty) {
    setLocalQueries({});
    setPageContext({
      ...pageState,
      suggestedQueries: [],
      insightsQuery: defaultQueryEmpty,
      loadingCRInfo: false,
    });
  } else {
    const docs: QueryRecord[] = querySnapshot.docs
      .map((doc: any) => {
        const d = doc.data() as any as QueryRecord;
        return d;
      })
      .sort((a, b) => (b.dateApproved as number) - (a.dateApproved as number));
    const temp: Record<string, QueryRecord> = {};
    const queries: Record<string, QueryRecord> = docs.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.query]: curr,
      }),
      temp
    );
    setLocalQueries(queries);
    const updatedPageContext = {
      ...pageState,
      doQuery: sampleDoQuery(CRName),
      avoidQuery: sampleAvoidQuery(CRName),
      redirectionQuery: sampleRedirectQuery(CRName),
      symptomsQuery: sampleSymptomsQuery(CRName),
      suggestedQueries: docs.slice(0, 5),
      insightsQuery: docs[0],
      loadingCRInfo: false,
    };
    await generateQuickFactsQueries(updatedPageContext, queries, setLocalQueries);
    setPageContext(updatedPageContext);
  }
};

export const loadPageDataFromFB = async (
  username: string,
  setPageContext: SetterOrUpdater<PageState>,
  setLocalQueries: SetterOrUpdater<Record<string, QueryRecord>>,
  careRecipientsInfo: Record<string, CareRecipientInfo>,
) => {
  console.log('loading session data from fb');
  const ref = doc(db, 'PageContext', username);
  const docSnap = await await getDoc(ref);
  if (docSnap.exists()) {
    console.log('past session exists');
    const data = docSnap.data() as PageState;
    setPageContext(data as PageState);
    await loadCRData(data, setPageContext, setLocalQueries, careRecipientsInfo);
  } else {
    console.log('past session does not exits');
    setPageContext(samplePageState(username));
    await loadCRData(
      samplePageState(username),
      setPageContext,
      setLocalQueries,
      careRecipientsInfo
    );
  }
};

export async function downloadFile(
  path: string,
  localCallBack: (url: string) => void
) {
  const storage = getStorage();
  getDownloadURL(ref(storage, path))
    .then(url => {
      localCallBack(url);
    })
    .catch(error => {
      // Handle any errors
    });
}

export const loadCareGiverInfo = async (
  pageState: PageState,
  setPageContext: SetterOrUpdater<PageState>,
  setCaregiversInfo: SetterOrUpdater<Record<string, CaregiverInfo>>,
  // setCareFacilitiesInfo: SetterOrUpdater<Record<string, FacilityInfo>>,
  currentUser: string
) => {
  console.log('loading info on all caregivers');
  setPageContext({
    ...pageState,
    loadingCRInfo: true,
  });
  const q = query(collection(db, `CaregiverInfo`));
  const querySnapshot = await getDocs(q);
  console.log(querySnapshot.docs);
  console.log('Firebase collection read <caregivers info>');
  if (querySnapshot.empty) {
    console.log('Caregiver info is empty');
    setCaregiversInfo({});
    setPageContext({
      ...pageState,
      loadingCRInfo: false,
    });
  } else {
    const docs: CaregiverInfo[] = querySnapshot.docs
      .map((doc: any) => {
        const d = doc.data() as any as CaregiverInfo;
        return d;
      })
      .sort((a, b) => (b.dateCreated as number) - (a.dateCreated as number));
    const temp: Record<string, CaregiverInfo> = {};
    const v: Record<string, CaregiverInfo> = docs.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.uuid]: curr,
      }),
      temp
    );
    setCaregiversInfo(v);
    console.log('TESTing');
    console.log(v[currentUser]);
    // await loadFacilitiesInfo(
    //   pageState,
    //   setPageContext,
    //   setCareFacilitiesInfo,
    //   // v[currentUser].adminForFacilities
    // );
    setPageContext({
      ...pageState,
      loadingCRInfo: false,
    });
  }
};

export const loadCareRecipientsInfo = async (
  pageState: PageState,
  setPageContext: SetterOrUpdater<PageState>,
  setCareRecipientInfo: SetterOrUpdater<Record<string, CareRecipientInfo>>
) => {
  console.log('making calls to caresuite!');
  await loadCareRecipientsInfoFromCaresuite(pageState, setPageContext, setCareRecipientInfo);
  // console.log('loading info on all care recipients');
  // setPageContext({
  //   ...pageState,
  //   loadingCRInfo: true,
  // });
  // const q = query(collection(db, `CareRecipientInfo`));
  // const querySnapshot = await getDocs(q);
  // console.log(querySnapshot.docs);
  // console.log('Firebase collection read <care recipient info>');
  // if (querySnapshot.empty) {
  //   setCareRecipientInfo({});
  //   setPageContext({
  //     ...pageState,
  //     loadingCRInfo: false,
  //   });
  // } else {
  //   const docs: CareRecipientInfo[] = querySnapshot.docs
  //     .map((doc: any) => {
  //       const d = doc.data() as any as CareRecipientInfo;
  //       return d;
  //     })
  //     .sort((a, b) => (b.dateCreated as number) - (a.dateCreated as number));
    // const temp: Record<string, CareRecipientInfo> = {};
    // const careRecipients: Record<string, CareRecipientInfo> = docs.reduce(
    //   (acc, curr) => ({
    //     ...acc,
    //     [curr.uuid]: curr,
    //   }),
    //   temp
    // );
    // setCareRecipientInfo(careRecipients);
    // setPageContext({
    //   ...pageState,
    //   loadingCRInfo: false,
    // });
  // }
};

// export const loadFacilitiesInfo = async (
//   pageState: PageState,
//   setPageContext: SetterOrUpdater<PageState>,
//   setCareFacilitiesInfo: SetterOrUpdater<Record<string, FacilityInfo>>,
//   // adminForFacilities: string[]
// ) => {
//   console.log('loading info on all facilities');
//   setPageContext({
//     ...pageState,
//     loadingCRInfo: true,
//   });
//   const q = query(collection(db, `CareFacilityInfo`));
//   const querySnapshot = await getDocs(q);
//   console.log(querySnapshot.docs);
//   console.log('Firebase collection read <care facilities info>');
//   if (querySnapshot.empty) {
//     console.log('Facilities query is empty');
//     setCareFacilitiesInfo({});
//     setPageContext({
//       ...pageState,
//       loadingCRInfo: false,
//     });
//   } else {
//     const docs: FacilityInfo[] = querySnapshot.docs
//       .map((doc: any) => {
//         const d = doc.data() as any as FacilityInfo;
//         return d;
//       })
//       .filter(f => {
//         console.log(f);
//         console.log('TEST');
//         return adminForFacilities.includes(f.uuid);
//       })
//       .sort((a, b) => (b.dateCreated as number) - (a.dateCreated as number));
//     const temp: Record<string, FacilityInfo> = {};
//     const facilities: Record<string, FacilityInfo> = docs.reduce(
//       (acc, curr) => ({
//         ...acc,
//         [curr.uuid]: curr,
//       }),
//       temp
//     );
//     console.log('Writing Facilities query');
//     console.log(facilities);
//     setCareFacilitiesInfo(facilities);
//     setPageContext({
//       ...pageState,
//       loadingCRInfo: false,
//     });
//   }
// };



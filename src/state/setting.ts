import { collection, doc, setDoc } from "firebase/firestore";
import {
  CareGroupInfo, CareRecipientInfo,
  CaregiverInfo, FacilityInfo, PageState, ProgramEvent
} from "./types";
import { db } from "./firebase/firebase-config";
import { QueryRecord } from "./queryingTypes";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage();


export const setRemoteProgramEvent = async (event: ProgramEvent) => {
  const programEventRef = collection(db, 'CRProgramEvents');
  try {
    console.log("about to update remote program events");
    const res = await setDoc(doc(programEventRef, event.uuid), event);
    console.log('updated CRProgramEvents!', res);
  } catch (e) {
    console.log('error writing to fb');
    console.log(e);
  }
};

export const setRemoteQueryRecord = async (query: QueryRecord) => {
  const queryRef = collection(db, 'QueryRecord');
  try {
    await setDoc(doc(queryRef, query.query), query);
    console.log('Posted query!', query);
  } catch (e) {
    console.log('error writing to fb');
    console.log(e);
  }
};


export async function uploadFile(file: any, path: string) {
  const storageRef = ref(storage, path);
  // 'file' comes from the Blob or File API
  uploadBytes(storageRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
    console.log(snapshot);
  });
}

export const setCaregiverInfo = async (
  caregiverInfo: CaregiverInfo) => {
  const caregiverInfoRef = collection(db, 'CaregiverInfo');
  try {
    await setDoc(doc(caregiverInfoRef,
      caregiverInfo.uuid), caregiverInfo);
    console.log('Posted caregiver info!');
  } catch (e) {
    console.log('error writing to fb');
    console.log(e);
  }
};

export const setCareRecipientInfo = async (
  careRecipientInfo: CareRecipientInfo) => {
  const careRecipientInfoRef = collection(db, 'CareRecipientInfo');
  try {
    await setDoc(doc(careRecipientInfoRef,
      careRecipientInfo.uuid), careRecipientInfo);
    console.log('Posted care recipient info!');
  } catch (e) {
    console.log('error writing to fb');
    console.log(e);
  }
};


export const setCareGroupInfo = async (
  careGroupInfo: CareGroupInfo) => {
  const careGroupInfoRef = collection(db, 'CareGroupInfo');
  try {
    await setDoc(doc(careGroupInfoRef,
      careGroupInfo.uuid), careGroupInfo);
    console.log('Posted care group info!');
  } catch (e) {
    console.log('error writing to fb');
    console.log(e);
  }
};

export const setFacilityInfo = async (
  facilityInfo: FacilityInfo) => {
  const facilityInfoRef = collection(db, 'CareFacilityInfo');
  try {
    await setDoc(doc(facilityInfoRef,
      facilityInfo.uuid), facilityInfo);
    console.log('Posted care facility info!');
  } catch (e) {
    console.log('error writing to fb');
    console.log(e);
  }
};

export const setPartialPageContext = async (
  pageContext: PageState) => {
  const pageContextRef = collection(db, 'PageContext');
  const partial = {
    ...pageContext,
    suggestedQueries: [],
    selectedCRProgramEvents: [],
  };
  try {
    await setDoc(doc(pageContextRef,
      pageContext.username), partial);
    console.log('Posted page context!');
  } catch (e) {
    console.log('error writing to fb');
    console.log(e);
  }
};


import { collection, doc, setDoc } from "firebase/firestore";
import { ProgramEvent } from "./types";
import { db } from "./firebase/firebase-config";
import { QueryRecord } from "./queryingTypes";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage();


export const setRemoteProgramEvent = async (event: ProgramEvent) => {
  const programEventRef = collection(db, 'CRProgramEvents');
  try {
    await setDoc(doc(programEventRef, event.uuid), event);
    console.log('updated CRProgramEvents!');
  } catch (e) {
    console.log('error writing to fb');
    console.log(e);
  }
};

export const setRemoteQueryRecord = async (query: QueryRecord) => {
  const queryRef = collection(db, 'QueryRecord');
  try {
    await setDoc(doc(queryRef, query.query), query);
    console.log('Posted query!');
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

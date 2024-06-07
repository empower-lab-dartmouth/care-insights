import { collection, doc, setDoc } from "firebase/firestore";
import { ProgramEvent } from "./types";
import { db } from "./firebase/firebase-config";

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

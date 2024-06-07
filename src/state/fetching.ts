import { SetterOrUpdater } from "recoil";
import { fetchSampleProgramData } from "./sampleData";
import { CRProgramEvents, PageState, ProgramEvent } from "./types";
import {
    collection, doc, getDoc, getDocs,
    limit, orderBy, query,
    where
} from "firebase/firestore";
import { db } from "./firebase/firebase-config";
import { samplePageState } from "./recoil";

export function getSelectedCRProgramEvents(v: string) {
    return fetchSampleProgramData(v);
}

const QUERY_LIMIT = 30;

export const loadCRProgramEvents = async (pageState: PageState,
    setPageContext: SetterOrUpdater<PageState>) => {
    if (pageState.selectedCR !== 'NONE') {
        // Pull sepcific CR's data
        setPageContext({
            ...pageState,
            loadingCRInfo: true,
        });
        pageState.loadingCRInfo = false;
        const q = query(collection(db, `CRProgramEvents`),
            where('CRUUID', '==', pageState.selectedCR),
            orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.docs);
        console.log('Firebase collection read <program events>');
        const docs: ProgramEvent[] = querySnapshot.docs
            .map((doc: any) => {
                const d = doc.data() as any as ProgramEvent;
                return d as ProgramEvent;
            });
        console.log('DOCS:');
        console.log(docs);
        const temp: CRProgramEvents = {};
        const programEvents: CRProgramEvents = docs
            .reduce((acc, curr) => ({
                ...acc,
                [curr.uuid]: curr,
            }), temp);
        setPageContext({
            ...pageState,
            selectedCRProgramEvents: programEvents,
            loadingCRInfo: false,
        });
    } else {
        // Pull all CRs' data
        setPageContext({
            ...pageState,
            loadingCRInfo: true,
        });
        const q = query(collection(db, `CRProgramEvents`), limit(QUERY_LIMIT),
            orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.docs);
        console.log('Firebase collection read <program events>');
        const docs: ProgramEvent[] = querySnapshot.docs
            .map((doc: any) => {
                const d = doc.data() as any as ProgramEvent;
                return d as ProgramEvent;
            });
        const temp: CRProgramEvents = {};
        const programEvents: CRProgramEvents = docs
            .reduce((acc, curr) => ({
                ...acc,
                [curr.uuid]: curr,
            }), temp);
        setPageContext({
            ...pageState,
            selectedCRProgramEvents: programEvents,
            loadingCRInfo: false,
        });
    }
};

export const loadPageDataFromFB = async (username: string,
    setPageContext: SetterOrUpdater<PageState>) => {
    console.log('loading session data from fb');
    const ref = doc(db, 'PageContext', username);
    const docSnap = await await getDoc(ref);
    if (docSnap.exists()) {
        console.log('past session exists');
        const data = docSnap.data() as PageState;
        setPageContext(data as PageState);
        await loadCRProgramEvents(data, setPageContext);
    } else {
        console.log('past session does not exits');
        setPageContext(samplePageState);
        await loadCRProgramEvents(samplePageState, setPageContext);
    }
};

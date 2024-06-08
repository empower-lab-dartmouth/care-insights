import { SetterOrUpdater } from "recoil";
import { CRProgramEvents, PageState, ProgramEvent } from "./types";
import {
    collection, doc, getDoc, getDocs,
    limit, orderBy, query,
    where
} from "firebase/firestore";
import { db } from "./firebase/firebase-config";
import { defaultQueryEmpty, samplePageState } from "./recoil";
import { QueryRecord } from "./queryingTypes";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

// export function getSelectedCRProgramEvents(v: string) {
//     return fetchSampleProgramData(v);
// }

const QUERY_LIMIT = 30;

export const loadCRData = async (
    pageState: PageState,
    setPageContext: SetterOrUpdater<PageState>,
    setLocalQueries: SetterOrUpdater<Record<string,
        QueryRecord>>) => {
    if (pageState.selectedCR !== 'NONE') {
        // Pull sepcific CR's data
        setPageContext({
            ...pageState,
            loadingCRInfo: true,
        });
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
        const updatedPageState = {
            ...pageState,
            selectedCRProgramEvents: programEvents,
            loadingCRInfo: false,
        };
        setPageContext(updatedPageState);
        loadQueriesForCR(updatedPageState,
            setPageContext, setLocalQueries);
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
            insightsQuery: defaultQueryEmpty,
            suggestedQueries: []
        });
    }
};

export const loadQueriesForCR = async (pageState: PageState,
    setPageContext: SetterOrUpdater<PageState>,
    setLocalQueries: SetterOrUpdater<Record<string,
        QueryRecord>>) => {
    // Pull all CRs' data
    setPageContext({
        ...pageState,
        loadingCRInfo: true,
    });
    const q = query(collection(db, `QueryRecord`),
        where('CRUUID', '==', pageState.selectedCR));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.docs);
    console.log('Firebase collection read <queries>');
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
            }).sort(
                (a, b) => b.dateApproved as number -
                    (a.dateApproved as number));
        const temp: Record<string, QueryRecord> = {};
        const queries: Record<string, QueryRecord> = docs
            .reduce((acc, curr) => ({
                ...acc,
                [curr.query]: curr,
            }), temp);
        setLocalQueries(queries);
        setPageContext({
            ...pageState,
            suggestedQueries: docs.slice(0, 5),
            insightsQuery: docs[0],
            loadingCRInfo: false,
        });
    }
};

export const loadPageDataFromFB = async (username: string,
    setPageContext: SetterOrUpdater<PageState>,
    setLocalQueries: SetterOrUpdater<Record<string,
        QueryRecord>>) => {
    console.log('loading session data from fb');
    const ref = doc(db, 'PageContext', username);
    const docSnap = await await getDoc(ref);
    if (docSnap.exists()) {
        console.log('past session exists');
        const data = docSnap.data() as PageState;
        setPageContext(data as PageState);
        await loadCRData(data, setPageContext,
            setLocalQueries);
    } else {
        console.log('past session does not exits');
        setPageContext(samplePageState);
        await loadCRData(samplePageState, setPageContext,
            setLocalQueries);
    }
};


export async function downloadFile(path: string,
    localCallBack: (url: string) => void) {
    const storage = getStorage();
    getDownloadURL(ref(storage, path))
        .then((url) => {
            localCallBack(url);
        })
        .catch((error) => {
            // Handle any errors
        });
}

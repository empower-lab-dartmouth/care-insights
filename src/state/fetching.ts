import { SetterOrUpdater } from "recoil";
import { fetchSampleProgramData, timeout} from "./sampleData";
import { PageState } from "./types";

export function getSelectedCRProgramEvents(v: string) {
    return fetchSampleProgramData(v);
}

export async function makeQuery(query: string,
    pageContext: PageState,
    setPageContext: SetterOrUpdater<PageState>,
    setLoadingResponse: (v: boolean) => void) {
    setLoadingResponse(true);
    await timeout(1000);
    const responseFromDB = `responding to query ${query} at ${new Date()}`;
    setPageContext({
        ...pageContext,
        insightsResponse: responseFromDB,
        insightsQuery: query,
    });
    setLoadingResponse(false);
}

export async function fetchCRInfo(newCRUUID: string,
    pageContext: PageState,
    setPageContext: SetterOrUpdater<PageState>) {
    setPageContext({
        ...pageContext,
        loadingCRInfo: true,
    });
    await timeout(1000);
    setPageContext({
        ...pageContext,
        selectedCR: newCRUUID,
        selectedCRProgramEvents: getSelectedCRProgramEvents(
            newCRUUID),
        loadingCRInfo: false,
    });
}

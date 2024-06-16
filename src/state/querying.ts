import { v4 } from "uuid";
import { QueryRecord } from "./queryingTypes";
import { timeout } from "./sampleData";
import { CRProgramEvents, ProgramEvent } from "./types";
import { setRemoteQueryRecord } from "./setting";

// TODO: Bansharee (helper function)
export const getRelevantQueries: (inputQuery: string,
    allCRQueries: Record<string, QueryRecord>) => QueryRecord[] = (
        inputQuery, allCRQueries) => {
        // Filter out unapproved queries.
        const relevantQueries = Object.values(allCRQueries)
            .filter((q) => q.dateApproved !== undefined);
        console.log('relevant care recipient approved past queries');
        console.log(relevantQueries, inputQuery);
        // CRSpecificQueries = query QueryCollection for all queries
        // related to care recipient with the same CRUUID
        // For each query q in CRSpecificQueries, ask ChatGPT if
        // inputQuery is relevant to q.query and q.queryResponse
        // TODO: figure out a good prompt to do the above
        // Return all the queries that are relevant.
        return relevantQueries;
    };

// TODO: Bansharee (helper function)
export const getRelevantRecords: (inputQuery: string,
    allCREvents: CRProgramEvents) => ProgramEvent[] = (
        inputQuery, allEvents) => {
        const relevantEvents = Object.values(allEvents); // placeholder
        console.log('relevant care recipient events');
        console.log(allEvents, inputQuery);
        // CRSpecificRecords = query CRRecordCollection for all
        // queries related to care recipient with the same CRUUID
        // For each record r in CRSpecificRecords, ask ChatGPT if
        // inputQuery is relevant to r.description
        // Return all the records that are relevant.
        return relevantEvents;
    };

// TODO: Bansharee
export async function askQuery(inputQuery: string,
    handleLocalResponse: (q: QueryRecord) => void,
    allCREvents: CRProgramEvents,
    CGUUID: string,
    CRUUID: string,
    allCRQueries: Record<string, QueryRecord>) {
    console.log(inputQuery);
    const existingQueryMatchesExactly = allCRQueries[inputQuery];
    if (existingQueryMatchesExactly !== undefined) {
        console.log('queries match exactly');
        console.log(existingQueryMatchesExactly);
        console.log(allCRQueries);
        handleLocalResponse(existingQueryMatchesExactly);
        return;
    }
    const relevantQueries = getRelevantQueries(inputQuery, allCRQueries);
    const relevantRecords = getRelevantRecords(inputQuery, allCREvents);
    // logging this as placeholder
    // prompt = `you are an expert memory loss therapist
    // with deep knowldge of ${fakeName}. A less knowlegable
    // peer caregiver asks you the question:
    // ${inputQuery}. Answer the question. Your response
    // should use information from past responses,
    // namely: relevantQueries (query + response)
    // You can also draw on the following records you have, relevantRecords`
    //  queryResponse = Ask ChatGPT the prompt
    await timeout(1000); // Mocking the delay of calling ChatGPT
    const ChatGPTResponse =
        'Here is a response to the query "' + inputQuery + '"';
    const completedQuery: QueryRecord = {
        query: inputQuery,
        queryResponse: ChatGPTResponse,
        queryUUID: v4(),
        CGUUID,
        CRUUID,
    };
    handleLocalResponse(completedQuery);
}


// TODO: Bansharee (do this after the above functions are working)
export async function modifyWithFeedback(feedback: string,
    query: QueryRecord,
    handleLocalResponse: (q: QueryRecord) => void,
    allCREvents: CRProgramEvents,
    CGUUID: string,
    CRUUID: string,
    allCRQueries: Record<string, QueryRecord>) {
    // prompt = `you are a memory loss
    // therapist with deep knowldge of ${fakeName}.
    // A more knowlegable peer caregiver just asked you the question:
    // ${query.querty}. You replied
    // ${query.queryResponse}. Your peer just told you
    // that your reply was insufficient,
    // and were given a chance to redo your
    // repsponse according to the suggestion
    // ${feedback.suggestion}. Redo the response:`
    // queryResponse = Ask ChatGPT the prompt
    await timeout(1000); // Mocking the delay of calling ChatGPT
    const ChatGPTResponse =
        'Updated response to include feedback "' + feedback + '"';
    const completedQuery: QueryRecord = {
        ...query,
        dateApproved: undefined,
        queryResponse: ChatGPTResponse,
        CGUUID,
        CRUUID,
    };
    console.log('updating to ', completedQuery);
    handleLocalResponse(completedQuery);
}


export async function respondToApprovalFeedback(
    query: QueryRecord) {
    setRemoteQueryRecord(query);
    // TODO Dylan — log push
};

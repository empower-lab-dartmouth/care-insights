import { v4 } from "uuid";
import { CRRecord, QueryFeedback, QueryRecord } from "./queryingTypes";
import { timeout } from "./sampleData";
import { CRProgramEvents, ProgramEvent } from "./types";

export const storeEvent: (record: CRRecord) => void = (record) => {
    console.log(record); // placeholder
    // - save GRRecord to CRRecordCollection
    // - log a CRRecordAction action to ActionCollection
};

export const getRelevantQueries: (inputQuery: string,
    allCRQueries: Record<string, QueryRecord>) => QueryRecord[] = (
        inputQuery, allCRQueries) => {
        // Filter out unapproved queries.
        const relevantQueries = Object.values(allCRQueries)
            .filter((q) => q.dateApproved !== undefined);
        console.log('relevant care recipient approved past queries');
        console.log(relevantQueries, inputQuery);
        // CRSpecificQueries = query QueryCollection for all queries
        // related to care recepient with the same CRUUID
        // For each query q in CRSpecificQueries, ask ChatGPT if
        // inputQuery is relevant to q.query and q.queryResponse
        // TODO: figure out a good prompt to do the above
        // Return all the queries that are relevant.
        return relevantQueries;
    };

export const getRelevantRecords: (inputQuery: string,
    allCREvents: CRProgramEvents) => ProgramEvent[] = (
        inputQuery, allEvents) => {
        const relevantEvents = Object.values(allEvents); // placeholder
        console.log('relevant care recipient events');
        console.log(allEvents, inputQuery);
        // CRSpecificRecords = query CRRecordCollection for all
        // queries related to care recepient with the same CRUUID
        // For each record r in CRSpecificRecords, ask ChatGPT if
        // inputQuery is relevant to r.description
        // Return all the records that are relevant.
        return relevantEvents;
    };

export async function askQuery(inputQuery: string,
    handleLocalResponse: (q: QueryRecord) => void,
    allCREvents: CRProgramEvents,
    CGUUID: string,
    CRUUID: string,
    allCRQueries: Record<string, QueryRecord>) {
    console.log(inputQuery);
    const existingQueryMatchesExactly = allCRQueries[inputQuery];
    if (existingQueryMatchesExactly !== undefined) {
        console.log('Query exactly matches an existing one');
        return existingQueryMatchesExactly;
    }
    const relevantQueries = getRelevantQueries(inputQuery, allCRQueries);
    const relevantRecords = getRelevantRecords(inputQuery, allCREvents);
    // logging this as placeholder
    console.log(relevantQueries, relevantRecords);
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

export const respondToFeedback: (
    query: QueryRecord,
    feedback: QueryFeedback) => QueryRecord = (inputQuery) => {
        console.log(inputQuery); // placeholder
        // if feedback is positive, save query to
        // QueryRecordCollection. Then return query
        //
        // otherwise:
        // Save feedback to ActionCollection
        // prompt = `you are a memory loss
        // therapist with deep knowldge of ${fakeName}.
        // A more knowlegable peer caregiver just asked you the question:
        // ${query.querty}. You replied
        // ${query.queryResponse}. Your peer just told you
        // that your reply was ${feedback.type},
        // and were given a chance to redo your
        // repsponse according to the suggestion
        // ${feedback.suggestion}. Redo the response:`
        // queryResponse = Ask ChatGPT the prompt
        // return QueryRecord
        return null as any;
    };

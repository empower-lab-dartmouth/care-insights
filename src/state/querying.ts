import { CRRecord, CRUUID, QueryFeedback, QueryRecord } from "./queryingTypes"

export const storeEvent: (record: CRRecord) => void  = (record) => {
// - save GRRecord to CRRecordCollection
// - log a CRRecordAction action to ActionCollection
}

export const getRelevantQueries: (inputQuery: string) => QueryRecord[] = (query) => {
    // CRSpecificQueries = query QueryCollection for all queries related to care recepient with the same CRUUID
    // For each query q in CRSpecificQueries, ask ChatGPT if inputQuery is relevant to q.query and q.queryResponse
    // TODO: figure out a good prompt to do the above
    // Return all the queries that are relevant.
    return null as any
}

export const getRelevantRecords: (id: CRUUID, inputQuery: string) => CRRecord[] = (query, inputQuery) => {
    // CRSpecificRecords = query CRRecordCollection for all queries related to care recepient with the same CRUUID
    // For each record r in CRSpecificRecords, ask ChatGPT if inputQuery is relevant to r.description
    // Return all the records that are relevant.
    return null as any
}

export const askQuery: (inputQuery: string) => QueryRecord = (inputQuery) => {
// relevantQueries = getRelevantQueries(inputQuery)
// relevantRecords = getRelevantRecords(inputQuery)
// const fakeName = CareRecepientInfoCollection[CRUUID] # get this from firebase
// prompt = `you are an expert memory loss therapist with deep knowldge of ${fakeName}. A less knowlegable peer caregiver asks you the question: 
// ${inputQuery}. Answer the question. Your response should use information from past responses, namely: relevantQueries (query + response)
// You can also draw on the following records you have, relevantRecords`
//  queryResponse = Ask ChatGPT the prompt
// return QueryRecord
    return null as any
}

export const respondToFeedback: (query: QueryRecord, feedback: QueryFeedback) => QueryRecord = (inputQuery) => {
    // if feedback is positive, save query to QueryRecordCollection. Then return query
    // 
    // otherwise:
    // Save feedback to ActionCollection
    // prompt = `you are a memory loss therapist with deep knowldge of ${fakeName}. 
    // A more knowlegable peer caregiver just asked you the question: 
// ${query.querty}. You replied ${query.queryResponse}. Your peer just told you that your reply was ${feedback.type},
// and were given a chance to redo your repsponse according to the suggestion ${feedback.suggestion}. Redo the response:`
    // queryResponse = Ask ChatGPT the prompt
    // return QueryRecord
        return null as any
    }
    
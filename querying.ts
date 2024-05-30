type UUID = string
type RecordUUID = UUID
type QueryUUID = UUID
type CRUUID = UUID
type CGUUID = UUID
type ActionUUID = UUID
type Timestamp = number

type GRRecord = {
    description: string
    date: Timestamp
    CGUUID: CGUUID
    CRUUID: CRUUID
    recordUUID: RecordUUID
}

type CRRecordAction = {
    type: 'CR-record-created'
    record: GRRecord
} | {
    type: 'CR-record-updated'
    record: GRRecord
} | {
    type: 'CR-record-deleted'
    recordUUID: RecordUUID
}

type QueryRecord = {
    query: string
    date: Timestamp
    queryResponse: string
    queryUUID: QueryUUID
}

type QueryFeedback = {
    type: 'looks-good'
} | {
    type: 'incorrect'
    suggestion: string
} | {
    type: 'missing-info'
    suggestion: string
}

type QueryAction = {
    type: 'query-created'
    query: QueryRecord
} | {
    type: 'query-cpdated'
    query: QueryRecord
    feedback: QueryFeedback
}

type Action = {
    actionTimestamp: Timestamp
    actionUUID: ActionUUID
} & (QueryAction | CRRecordAction)

type CareRecepientInfo = {
    name: string
    pronouns: string
    fakeName: string
}

// Firebase collections
type CRRecordCollection = Record<RecordUUID, GRRecord> 
type QueryCollection = Record<RecordUUID, GRRecord> 
type ActionCollection = Record<ActionUUID, Action>
type CareRecepientInfoCollection = Record<ActionUUID, Action>

const storeEvent: (record: GRRecord) => void  = (record) => {
// - save GRRecord to CRRecordCollection
// - log a CRRecordAction action to ActionCollection
}

const getRelevantQueries: (inputQuery: string) => QueryRecord[] = (query) => {
    // CRSpecificQueries = query QueryCollection for all queries related to care recepient with the same CRUUID
    // For each query q in CRSpecificQueries, ask ChatGPT if inputQuery is relevant to q.query and q.queryResponse
    // TODO: figure out a good prompt to do the above
    // Return all the queries that are relevant.
    return null as any
}

const getRelevantRecords: (id: CRUUID, inputQuery: string) => GRRecord[] = (query, inputQuery) => {
    // CRSpecificRecords = query CRRecordCollection for all queries related to care recepient with the same CRUUID
    // For each record r in CRSpecificRecords, ask ChatGPT if inputQuery is relevant to r.description
    // Return all the records that are relevant.
    return null as any
}

const askQuery: (inputQuery: string) => QueryRecord = (inputQuery) => {
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

const respondToFeedback: (query: QueryRecord, feedback: QueryFeedback) => QueryRecord = (inputQuery) => {
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
    
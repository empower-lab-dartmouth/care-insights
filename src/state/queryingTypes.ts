export type UUID = string
export type RecordUUID = UUID
export type QueryUUID = UUID
export type CRUUID = UUID
export type CGUUID = UUID
export type ActionUUID = UUID
export type Timestamp = number

export type CRRecord = {
    description: string
    date: Timestamp
    CGUUID: CGUUID
    CRUUID: CRUUID
    recordUUID: RecordUUID
}

export type CRRecordAction = {
    type: 'CR-record-created'
    record: CRRecord
} | {
    type: 'CR-record-updated'
    record: CRRecord
} | {
    type: 'CR-record-deleted'
    recordUUID: RecordUUID
}

export type QueryRecord = {
    query: string
    date: Timestamp
    queryResponse: string
    queryUUID: QueryUUID
}

export type QueryFeedback = {
    type: 'looks-good'
} | {
    type: 'incorrect'
    suggestion: string
} | {
    type: 'missing-info'
    suggestion: string
}

export type QueryAction = {
    type: 'query-created'
    query: QueryRecord
} | {
    type: 'query-cpdated'
    query: QueryRecord
    feedback: QueryFeedback
}

export type Action = {
    actionTimestamp: Timestamp
    actionUUID: ActionUUID
} & (QueryAction | CRRecordAction)

export type CareRecepientInfo = {
    name: string
    pronouns: string
    fakeName: string
}

// Firebase collections
export type CRRecordCollection = Record<RecordUUID, CRRecord> 
export type QueryCollection = Record<RecordUUID, CRRecord> 
export type ActionCollection = Record<ActionUUID, Action>
export type CareRecepientInfoCollection = Record<ActionUUID, Action>
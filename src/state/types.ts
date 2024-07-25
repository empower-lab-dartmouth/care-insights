import { Query } from "firebase/firestore"
import { QueryRecord } from "./queryingTypes"

export type UserUUID = string
export type EventUUID = string

export type PageState = {
    username: string,
    selectedCR: UserUUID,
    selectedCRProgramEvents: CRProgramEvents
    insightsQuery: QueryRecord,
    avoidQuery: string,
    doQuery: string,
    symptomsQuery: string,
    redirectionQuery: string,
    addEventModalOpen: boolean,
    selectedFacilityID: string
    suggestedQueries: QueryRecord[],
    loadingCRInfo: boolean,
}

export type HeatMapDataPoint = number

export type HeatmapData = {
    attention: HeatMapDataPoint[]
}

export type MomentType = 'positive-music' | 'redirection' | 'memory-recall' | 'note'
export type SelectorValue<T = string> = {
    label: string
    value: T
}

export type MeaningfulMoment = {
    startTime: number
    uuid: string,
    description: string,
    type: MomentType
}

export type CRAutoselectOption = {
    label: string,
    uuid: UserUUID,
}

export type CRAutoselectOptions = ReadonlyArray<CRAutoselectOption>

export type CRInfo = {
    label: string,
    name: string,
    uuid: UserUUID,
}

export type CGInfo = {
    name: string,
    email: string,
}

export type CRProgramEvents = Record<EventUUID, ProgramEvent>

export type ProgramEvent = MusicProgramEvent | ManualEntryEvent;

export type EngagementLevel = 'low' | 'average' | 'high' | 'none' | 'na'
export type RedirectionLevel = 'success' | 'none' | 'unsuccessful' | 'na'

export type CommonEventFields = {
    label: string,
    date: number,
    uuid: EventUUID,
    CRUUID: UserUUID,
    CGUUID: UserUUID,
    description: string,
    engagement: EngagementLevel,
    redirection: RedirectionLevel,
    deleted?: 'true'
}

export type MusicProgramEvent = {
    type: 'music-event',
    videoUrl: string,
    meaningfulMoments: Record<string, MeaningfulMoment>
    transcript?: string
} & CommonEventFields

export type ManualEntryEvent = {
    type: 'manual-entry-event',
} & CommonEventFields

export type CaregiverInfo = {
    imageURL: string
    name: string
    uuid: string // this is also the email.
    dateCreated: number,
    memberOfGroupsUUID: string[]
    // adminForFacilities: string[]
    deletedDate?: number
}

export type Features = 'program-events-page'

export type CareGroupInfo = {
    facilityID: string
    imageURL: string
    name: string
    uuid: string
    dateCreated: number
    deletedDate?: number
    careRecipients: string[]
    readPermissions: Features[]
    editPermissions: Features[]
}

export type InfoBox = {
    label: string
    value: string
}

export type CareRecipientInfo = {
    imageURL: string
    facilityID: string
    dateCreated:number
    name: string
    uuid: string
    infoBox: InfoBox[]
    deletedDate?: number
}

export type FacilityInfo = {
    imageURL: string
    dateCreated:number
    name: string
    uuid: string
    deletedDate?: number
}
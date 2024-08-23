import { Query } from "firebase/firestore"
import { QueryRecord } from "./queryingTypes"

export type UserUUID = string
export type EventUUID = string

type Location = {
    name: string
    latitude: number
    longitude: number
    radius: number // meters
}

export const VIDEO_APPROVAL_REQUIRED = ['@oakwoodmanor', '@lccc'];

export const PERMISSIBLE_LOCATIONS: Location[] = [
    // {
    //     name: '@oakwoodmanor',
    //     latitude:  41.3488611111111,
    //     longitude: -73.8376111111111,
    //     radius: 8000,
    // },
//     {
//     name: '@vwhp',
//     latitude: 41.7121388888889,
//     longitude: -73.86825,
//     radius: 12000,
// },
{
    name: '@trnu',
    latitude: 41.6976944444444,
    longitude: -73.9656944444444,
    radius: 8000,
},{
        name: '@lccc',
        latitude: 41.6991111111111,
        longitude: -73.9243055555556,
        radius: 8000,
    }];

export type ProgramEventIndex = {
    programEventId: string
    videoTimestamp?: number
}


export type PageState = {
    username: string,
    selectedCR: UserUUID,
    selectedCRProgramEvents: CRProgramEvents
    insightsQuery: QueryRecord,
    avoidQuery: string,
    doQuery: string,
    position?: string,
    symptomsQuery: string,
    redirectionQuery: string,
    addEventModalOpen: boolean,
    selectedFacilityID: string
    suggestedQueries: QueryRecord[],
    loadingCRInfo: boolean,
}

export type ExtendedAttributes = {
    CRUUID: string,
    firstName: string,
    lastName: string,
    yearOfBirth?: string,
    gender?: string,
    preferredLanguage?: string
    roomNumber?: string,
    hobbies?: string[],
    music?: string,
    mocaScore?: string,
    hearing?: string,
    symptoms?: string[],
    communicationLevel?: string,
    isolationLevel?: string,
    eyesight?: string,
    thingsToTalkAbout?: string,
    activitiesToDo?: string,
    avoid?: string,
    waysToRedirect?: string,
    historyOfIncidents?: string,
}

export type HeatMapDataPoint = number

export type HeatmapData = {
    attention: HeatMapDataPoint[]
}

export type ProgramEventMoment = {
    type: 'programEvent'
    startTime: number
    endTime: number
    uuid: string
    programName: string
    themeName: string
    description: string
}

export type SongEventMoment = {
    type: 'song'
    startTime: number
    endTime: number
    uuid: string
    programName: string
    albumCover: string
    description: string
    songTitle: string
    artistName: string
    isrc: string
}

export type MomentType = 'positiveMusic' | 'redirection' | 'memoryRecall' | 'note' | 'frustration'
export type SelectorValue<T = string> = {
    label: string
    value: T
}

export type DescriptiveMoment = {
    startTime: number
    uuid: string,
    description: string,
    type: MomentType
}

export type MeaningfulMoment = DescriptiveMoment | ProgramEventMoment | SongEventMoment;

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

export type TranscriptSegment = {
    text: string,
    offsetSeconds: number,
}

export type MusicProgramEvent = {
    type: 'music-event',
    facilityId: string,
    videoUrl: string,
    videoApproved?: boolean,
    muxPlaybackId: string,
    muxAssetId: string,
    postTestMood: string,
    preTestMood: string,
    symptom: string,
    strategy: string,
    therapyEffectiveness: string,
    careRecipientName: string,
    caregiverName: string,
    heatmap: string,
    meaningfulMoments: Record<string, MeaningfulMoment>,
    transcript: TranscriptSegment[],
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
    accountID?: string
    facilityID: string
    dateCreated: number
    name: string
    caregiverId?: string
    uuid: string
    infoBox: InfoBox[]
    deletedDate?: number
}

export type FacilityInfo = {
    imageURL: string
    dateCreated: number
    name: string
    uuid: string
    deletedDate?: number
}

export type CookieData = {
    username: string
    password: string
} | undefined
export type UserUUID = string
export type EventUUID = string

export type PageState = {
    selectedCR: UserUUID,
    selectedCRProgramEvents: CRProgramEvents
    insightsQuery: string,
    insightsResponse: string,
    addEventModalOpen: boolean,
    suggestedQueries: string[],
    loadingCRInfo: boolean,
}

export type HeatMapDataPoint = number

export type HeatmapData = {
    attention: HeatMapDataPoint[]
}

export type MeaningfulMoment = {
    startTime: number
    uuid: string,
    description: string,
    type: 'positiveMusic' | 'negative' | 'memory' | 'note'
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

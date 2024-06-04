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
    description: string,
    type: 'positiveMusic' | 'negative' | 'memory'
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

export type ProgramEvent = MusicProgramEvent;

export type MusicProgramEvent = {
    type: 'music-event',
    label: string,
    date: number,
    uuid: EventUUID,
    CRUUID: UserUUID,
    description: string,
    videoUrl: string,
    meaningfulMoments?: MeaningfulMoment[]
    transcript?: string
}
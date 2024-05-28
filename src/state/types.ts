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

export type ProgramEvent = {
    type: 'music-event',
    label: string,
    date: number,
    uuid: EventUUID,
    CRUUID: UserUUID,
    description: string,
    data: string,
}
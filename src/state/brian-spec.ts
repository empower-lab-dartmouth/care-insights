
export type InfoBox = {
    label: string
    value: string
}

export type CareRecipientInfo = {
    imageURL: string
    facilityID: string
    name: string
    uuid: string
    infoBox: InfoBox[]
}

export type CaregiverInfo = {
    imageURL: string
    name: string
    uuid: string
    facilityID: string
    email: string
    role: string
}

export const fetchAllCareRecipientsEnrolledInStudyAtFacility: (facilityID: string) => CareRecipientInfo[] = (facilityID) => {
    /// TODO
    return undefined as any as CareRecipientInfo[]
}

export const fetchCaregiverInfo: (emailUsedInSignIn: string) => CaregiverInfo = (emailUsedInSignIn) => {
    /// TODO
    return undefined as any as CaregiverInfo
}

import { collection, doc, setDoc } from "firebase/firestore";
import {
    CareGroupInfo, CareRecipientInfo,
    CaregiverInfo, FacilityInfo, PageState, ProgramEvent
} from "./types";
import { db } from "./firebase/firebase-config";
import { QueryRecord } from "./queryingTypes";
import { getStorage, ref, uploadBytes } from "firebase/storage";

export type BasicEvent = {
    type: 'login' | 'logout'
}

export type EventWithContext = {
    type: 'expand-program-event'
    context: string
}

export type TrackingEvent = BasicEvent | EventWithContext;
type ExpandedEvent = TrackingEvent & {
    username: string,
    careRecipientID: string,
    date: number,
    url: string
}

export const reportTrackingEvent = async (e: TrackingEvent, username: string, pageState: PageState) => {
    const queryRef = collection(db, 'TrackingEvents');
    const expandedEvent: ExpandedEvent = {
        ...e,
        username: username,
        careRecipientID: pageState.selectedCR,
        date: (new Date()).getTime(),
        url: location.href
    };
    const trackingEventId = expandedEvent.username + '-' + expandedEvent.type + '-' + expandedEvent.date;
    try {
        await setDoc(doc(queryRef, trackingEventId), expandedEvent);
        console.log('Posted query!', expandedEvent);
    } catch (e) {
        console.log('error writing to fb');
        console.log(e);
    }
};
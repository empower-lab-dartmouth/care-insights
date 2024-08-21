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
    type: 'useful-query' | 'saved-query' | 'incorrect-query' | 'incomplete-query' | 'update-query' | 'cancel-query-edit' | 'asking-query'
    query: QueryRecord
}

type ExpandedEvent = TrackingEvent & {
    username: string,
    careRecipientID: string,
    date: number,
    url: string
}

type DebuggingEvent = {
    type: 'debugging',
    message: string
}

type ManualEventCreated = {
    type: 'manual-event-created',
    event: ProgramEvent
}

export type TrackingEvent = BasicEvent | EventWithContext | DebuggingEvent | ManualEventCreated;

export const reportTrackingEvent = async (e: TrackingEvent, username: string, pageState: PageState) => {
    console.log('tracking event');
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
        console.log('Attempting to post tracking log: ', expandedEvent);
        setDoc(doc(queryRef, trackingEventId), expandedEvent);
        console.log('Posted query!', expandedEvent);
    } catch (e) {
        console.log('error writing to fb');
        console.log(e);
    }
};

export const reportTrackingEventNoPageContext = async (e: TrackingEvent, username: string, selectedCR: string) => {
    const queryRef = collection(db, 'TrackingEvents');
    const expandedEvent: ExpandedEvent = {
        ...e,
        username: username,
        careRecipientID: selectedCR,
        date: (new Date()).getTime(),
        url: location.href
    };
    const trackingEventId = expandedEvent.username + '-' + expandedEvent.type + '-' + expandedEvent.date;
    try {
        console.log('Attempting to post tracking log: ', expandedEvent);
        setDoc(doc(queryRef, trackingEventId), expandedEvent);
        console.log('Posted successfully!', expandedEvent);
    } catch (e) {
        console.log('error writing log to fb', expandedEvent);
        console.log(e);
    }
};
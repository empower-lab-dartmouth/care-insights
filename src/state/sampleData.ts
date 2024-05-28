import { CRInfo, CRProgramEvents } from "./types";

export const sampleCRInfo: Record<string, CRInfo> = {
    'abby': {
        name: 'Abby Adams',
        label: 'Abby Adams',
        uuid: 'abby'
    },
    'bart': {
        name: 'Bart Holms',
        label: 'Bart Holms',
        uuid: 'bart',
    },
    'claire': {
        name: 'Claire Kimberly',
        label: 'Claire Kimberly',
        uuid: 'claire'
    },
    'NONE': {
        name: 'Select a care recepient',
        label: 'Select a care recepient',
        uuid: 'NONE'
    }
};

export const fetchSampleProgramData = (v: string) => {
    if (v === 'abby') {
        return sampleProgramData;
    } else if (v == 'bart') {
        return sampleProgramData2;
    } else if (v == 'claire') {
        return {};
    } else {
        return commonProgramEvents;
    }
};

export const sampleProgramData: CRProgramEvents = {
    'e1': {
        type: 'music-event',
        CRUUID: 'abby',
        label: 'Program event',
        date: 10000090,
        uuid: 'e1',
        description: 'Memory care program event 1',
        data: 'expanded data',
    },
    'e2': {
        type: 'music-event',
        CRUUID: 'abby',
        data: 'expanded data',
        label: 'Program event',
        date: 10000050,
        uuid: 'e2',
        description: 'Memory care program event 2',
    },
    'e3': {
        type: 'music-event',
        CRUUID: 'abby',
        data: 'expanded data',
        label: 'Program event',
        date: 10000010,
        uuid: 'e3',
        description: 'Memory care program event 3',
    },
};

export const sampleProgramData2: CRProgramEvents = {
    'b1': {
        type: 'music-event',
        CRUUID: 'bart',
        data: 'expanded data',
        label: 'Program event of type 2',
        date: 10030010,
        uuid: 'b1',
        description: 'Memory care other program event 1',
    },
    'b2': {
        type: 'music-event',
        data: 'expanded data',
        CRUUID: 'bart',
        label: 'Program event of type 2',
        date: 10030010,
        uuid: 'b2',
        description: 'Memory care other program event 2',
    }
};

export const commonProgramEvents: CRProgramEvents = {
    'e1': {
        type: 'music-event',
        data: 'expanded data',
        label: 'Doctor note PCC',
        CRUUID: 'abby',
        date: 10030010,
        uuid: 'e1',
        description: 'Memory care program event 1',
    },
    'e2': {
        type: 'music-event',
        data: 'expanded data',
        label: 'Program event',
        CRUUID: 'abby',
        date: 10030010,
        uuid: 'e2',
        description: 'Memory care program event 2',
    },
    'e3': {
        type: 'music-event',
        data: 'expanded data',
        CRUUID: 'abby',
        label: 'Program event',
        date: 10033010,
        uuid: 'e3',
        description: 'Memory care program event 3',
    },
    'b1': {
        type: 'music-event',
        data: 'expanded data',
        CRUUID: 'bart',
        label: 'Program event of type 2',
        date: 10030014,
        uuid: 'b1',
        description: 'Memory care other program event 1',
    },
    'b2': {
        type: 'music-event',
        data: 'expanded data',
        CRUUID: 'bart',
        label: 'Program event of type 2',
        date: 10031110,
        uuid: 'b2',
        description: 'Memory care other program event 2',
    }
};

export const SAMPLE_SUGGESTED_QUERIES = [
    'what is the most important info I should know about this care recepient?',
    'what are some tips for sundowning?',
    'does this care recepient respond well to physical contact?'
];

export const SAMPLE_SUGGESTED_RECORD_EVENT_RESPONSES = [
    'We had a good session, she responded well to jazz music',
    'We had difficulty with sundowning',
    'She took her medication today'
];

export function timeout(delay: number) {
    return new Promise( (res) => setTimeout(res, delay) );
}

import {
    CRInfo, CRProgramEvents,
    HeatmapData, MeaningfulMoment
} from "./types";

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

export const sampleHeatMapData: HeatmapData = {
    attention: Array.from({ length: 200 },
        () => Math.floor(Math.random() * 40))
};

export const sampleMeaningfulMoments: Record<string, MeaningfulMoment> = {
    'a': {
        startTime: 400,
        uuid: 'a',
        description: 'Abby acted violently.',
        type: 'negative'
    },
    'b': {
        startTime: 4000,
        uuid: 'b',
        description: 'Abby had an above average positive reaction to ' +
            'the song "Autumn leaves."',
        type: 'positiveMusic'
    },
    'c': {
        startTime: 10000,
        uuid: 'c',
        description: 'Abby recalled memories of her experiences in ' +
            'marching band in high school.',
        type: 'memory'
    },
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
        type: 'manual-entry-event',
        CRUUID: 'abby',
        label: 'Manual event',
        redirection: 'na',
        engagement: 'na',
        date: 10000090,
        CGUUID: 'testUser@gmail.com',
        uuid: 'e1',
        description: 'Memory care program event 1',
    },
    'e2': {
        type: 'music-event',
        CRUUID: 'abby',
        CGUUID: 'bart',
        redirection: 'na',
        engagement: 'na',
        videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
        label: 'Program event',
        date: 10000050,
        uuid: 'e2',
        description: 'Memory care program event 2',
        meaningfulMoments: sampleMeaningfulMoments,
    },
    'e3': {
        type: 'music-event',
        CRUUID: 'abby',
        redirection: 'na',
        engagement: 'na',
        CGUUID: 'bart',
        videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
        label: 'Program event',
        date: 10000010,
        uuid: 'e3',
        description: 'Memory care program event 3',
        meaningfulMoments: sampleMeaningfulMoments,
    },
};

export const sampleProgramData2: CRProgramEvents = {
    'b1': {
        type: 'music-event',
        redirection: 'na',
        engagement: 'na',
        CRUUID: 'bart',
        CGUUID: 'bart',
        videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
        label: 'Program event of type 2',
        date: 10030010,
        uuid: 'b1',
        description: 'Memory care other program event 1',
        meaningfulMoments: sampleMeaningfulMoments,
    },
    'b2': {
        type: 'music-event',
        redirection: 'na',
        engagement: 'na',
        videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
        CRUUID: 'bart',
        CGUUID: 'bart',
        label: 'Program event of type 2',
        date: 10030010,
        uuid: 'b2',
        description: 'Memory care other program event 2',
        meaningfulMoments: sampleMeaningfulMoments,
    }
};

export const commonProgramEvents: CRProgramEvents = {
    'e1': {
        type: 'manual-entry-event',
        CRUUID: 'abby',
        redirection: 'na',
        engagement: 'na',
        label: 'Manual event',
        date: 10000090,
        CGUUID: 'testUser@gmail.com',
        uuid: 'e1',
        description: 'Memory care program event 1',
    },
    'e2': {
        type: 'music-event',
        videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
        label: 'Program event',
        CRUUID: 'abby',
        redirection: 'na',
        engagement: 'na',
        CGUUID: 'bart',
        date: 10030010,
        uuid: 'e2',
        description: 'Memory care program event 2',
        meaningfulMoments: sampleMeaningfulMoments,
    },
    'e3': {
        type: 'music-event',
        videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
        CRUUID: 'abby',
        label: 'Program event',
        date: 10033010,
        CGUUID: 'bart',
        redirection: 'na',
        engagement: 'na',
        uuid: 'e3',
        description: 'Memory care program event 3',
        meaningfulMoments: sampleMeaningfulMoments,
    },
    'b1': {
        type: 'music-event',
        videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
        CRUUID: 'bart',
        redirection: 'na',
        engagement: 'na',
        label: 'Program event of type 2',
        date: 10030014,
        CGUUID: 'bart',
        uuid: 'b1',
        description: 'Memory care other program event 1',
        meaningfulMoments: sampleMeaningfulMoments,
    },
    'b2': {
        type: 'music-event',
        videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
        CRUUID: 'bart',
        CGUUID: 'bart',
        redirection: 'na',
        engagement: 'na',
        label: 'Program event of type 2',
        date: 10031110,
        uuid: 'b2',
        description: 'Memory care other program event 2',
        meaningfulMoments: sampleMeaningfulMoments,
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
    return new Promise((res) => setTimeout(res, delay));
}

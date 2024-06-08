import { v4 } from "uuid";
import {
    CRInfo,
    HeatmapData, MeaningfulMoment,
    ProgramEvent
} from "./types";
import { QueryRecord } from "./queryingTypes";

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
        type: 'redirection'
    },
    'b': {
        startTime: 4000,
        uuid: 'b',
        description: 'Abby had an above average positive reaction to ' +
            'the song "Autumn leaves."',
        type: 'positive-music'
    },
    'c': {
        startTime: 10000,
        uuid: 'c',
        description: 'Abby recalled memories of her experiences in ' +
            'marching band in high school.',
        type: 'memory-recall'
    },
};

export const newMusicProgramEvent: () => ProgramEvent = () => ({
    type: 'music-event',
    videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    label: 'Program event',
    CRUUID: 'abby',
    redirection: 'na',
    engagement: 'na',
    CGUUID: 'bart',
    date: 10030010,
    uuid: v4(),
    description: 'Memory care program event 2',
    meaningfulMoments: sampleMeaningfulMoments,
});

export const SAMPLE_SUGGESTED_QUERIES: QueryRecord[] = [{
    query: 'what is the most important info I should ' +
        'know about this care recipient?',
    queryResponse: 'Response 1',
    queryUUID: 'uuid1',
    CGUUID: '',
    CRUUID: '',
}, {
    query: 'what are some tips for sundowning?',
    queryResponse: 'Response 2',
    queryUUID: 'uuid2',
    CGUUID: '',
    CRUUID: '',
}, {
    query: 'does this care recipient respond well to physical contact?',
    queryResponse: 'Response 3',
    queryUUID: 'uuid3',
    CGUUID: '',
    CRUUID: '',
}
];

export const SAMPLE_SUGGESTED_RECORD_EVENT_RESPONSES = [
    'We had a good session, she responded well to jazz music',
    'We had difficulty with sundowning',
    'She took her medication today'
];

export function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
}

export async function delayThenDo(fn: () => void, delay: number) {
    await timeout(delay);
    fn();
}

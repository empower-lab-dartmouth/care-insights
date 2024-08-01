import { DefaultValue, atom, selector } from 'recoil';
import {
  PageState, CGInfo,
  CaregiverInfo, CareGroupInfo, CareRecipientInfo,
  FacilityInfo
} from './types';
import { QueryRecord } from './queryingTypes';
import { syncEffect } from 'recoil-sync';
import { string } from '@recoiljs/refine';

export const trackingTimeUntilNextPush = atom<number>({
  key: 'tracking-elapsed-time',
  default: 30000, // 30 sec
});

export const defaultQueryLoading: QueryRecord = {
  query: '',
  queryResponse: 'loading',
  queryUUID: '',
  CGUUID: '',
  CRUUID: '',
};

export const defaultQueryEmpty: QueryRecord = {
  query: '',
  queryResponse: 'Type in a question below and click the search icon',
  queryUUID: '',
  CGUUID: '',
  CRUUID: '',
};

export const reloadPageQuery: QueryRecord = {
  query: '<loading>',
  queryResponse: 'Try reloading the page, if the issue persists contact your admin.',
  queryUUID: '',
  CGUUID: '',
  CRUUID: '',
};

export const samplePageState: (
  email: string) => PageState = (email) => ({
    selectedCR: 'NONE',
    username: email,
    selectedCRProgramEvents: {},
    selectedFacilityID: 'sandboxID',
    addEventModalOpen: false,
    suggestedQueries: [],
    avoidQuery: reloadPageQuery.query,
    doQuery: reloadPageQuery.query,
    insightsQuery: defaultQueryEmpty,
    symptomsQuery: reloadPageQuery.query,
    redirectionQuery: reloadPageQuery.query,
    loadingCRInfo: false,
  });

export const pageContextState = selector<PageState>({
  key: 'page-state',
  get: ({get}) => {
    const allFields = get(pageContextStateFields);
    const selectedCR = get(selectedCRState)
    return ({
      ...allFields,
      selectedCR
    })
  },
  set: ({set, reset}, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      const selectedCR  = newValue.selectedCR;
      set(selectedCRState, selectedCR);
      set(pageContextStateFields, newValue);
    } else {
      reset(pageContextStateFields);
      reset(selectedCRState);
    }
  }
});

export const pageContextStateFields = atom<PageState>({
  key: 'page-state-fields',
  default: {
    ...samplePageState('not-set'),
    insightsQuery: defaultQueryLoading
  }
});

export const selectedCRState = atom<string>({
  key: 'cr',
  default: 'NONE',
  effects: [syncEffect({ refine: string() })],
});

export const careFacilitiesState = atom<Record<string,
  FacilityInfo>>({
    key: 'facilityInfo',
    default: {}
  });

// export const allCRInfoState = atom<Record<string, CRInfo>>({
//   key: 'all-CR-info',
//   default: sampleCRInfo,
// });

export const allCGInfoState = atom<Record<string, CGInfo>>({
  key: 'all-CG-info',
  default: {},
});

export const NO_CR_SELECTED = 'NONE';

// export const allCRNamesState = selector<CRAutoselectOptions>({
//   key: 'all-user-names',
//   get: ({ get }) => Object.values(get(allCRInfoState))
//     .filter((v) => v.uuid !== NO_CR_SELECTED)
//     .map((v) => (
//       {
//         label: v.name,
//         uuid: v.uuid,
//       }))
// });

export type EventType = string // Will further specify this later.

export type UserLoginEvent = {
  type: 'login',
  date: number,
  id: string,
  username: string
}

export type UserActivityReport = {
  events: number
  idleTime: number
  activeTime: number
}

export type UserSummary = {
  userId: string,
  startDate: number,
  sessionLength: number,
}

export type SessionActivityEvent = {
  type: 'session'
  date: number // End date
  startDate: number
  id: string
  username: string
  videoAnalysis: UserActivityReport
  summaryInsights: UserActivityReport
}

export type LoggedEvent = UserLoginEvent | SessionActivityEvent;

export const SESSION_LENGTH = 900000; // 15 minutes.

export const newActivtySession: (username: string,
  startDate: number) => SessionActivityEvent = (
    username, startDate) => ({
      type: 'session',
      date: startDate + SESSION_LENGTH,
      startDate,
      id: `sess-act-${username}-${startDate}`,
      username,
      videoAnalysis: {
        events: 0,
        idleTime: 0,
        activeTime: 0,
      },
      summaryInsights: {
        events: 0,
        idleTime: 0,
        activeTime: 0,
      }
    });

export const userIsActiveState = atom<boolean>({
  key: 'user-is-active',
  default: true,
});

export const currentSessionActivityState = atom<SessionActivityEvent>({
  key: 'current-session-activity',
  default: newActivtySession('NO-USER', (new Date()).getTime()),
});

type QueryString = string
export const queriesForCurrentCGState = atom<Record<QueryString, QueryRecord>>({
  key: 'queries-for-CG',
  default: {},
});

export const caregiversInfoState = atom<Record<string, CaregiverInfo>>({
  key: 'caregiver-info-state',
  default: {}
});

export const careGroupsInfoState = atom<Record<string, CareGroupInfo>>({
  key: 'care-group-info',
  default: {}
});

export const careRecipientsInfoState = atom<Record<string, CareRecipientInfo>>({
  key: 'care-recipient-info-state',
  default: {}
});


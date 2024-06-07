import { atom, selector } from 'recoil';
import { CRInfo, PageState, CRAutoselectOptions, CGInfo } from './types';
import { SAMPLE_SUGGESTED_QUERIES, sampleCRInfo } from './sampleData';

export const trackingTimeUntilNextPush = atom<number>({
  key: 'tracking-elapsed-time',
  default: 30000, // 30 sec
});

export const samplePageState: PageState = {
  selectedCR: 'NONE',
  selectedCRProgramEvents: {},
  insightsQuery: '',
  insightsResponse: '',
  addEventModalOpen: false,
  suggestedQueries: SAMPLE_SUGGESTED_QUERIES,
  loadingCRInfo: false,
};

export const pageContextState = atom<PageState>({
  key: 'page-state',
  default: {
    ...samplePageState,
    insightsResponse: 'loading'
}});

export const allCRInfoState = atom<Record<string, CRInfo>>({
  key: 'all-CR-info',
  default: sampleCRInfo,
});

export const allCGInfoState = atom<Record<string, CGInfo>>({
  key: 'all-CG-info',
  default: {},
});

export const NO_CR_SELECTED = 'NONE';

export const allCRNamesState = selector<CRAutoselectOptions>({
  key: 'all-user-names',
  get: ({ get }) => Object.values(get(allCRInfoState))
    .filter((v) => v.uuid !== NO_CR_SELECTED)
    .map((v) => (
      {
        label: v.name,
        uuid: v.uuid,
      }))
});

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



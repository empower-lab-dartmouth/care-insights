import React, { useContext, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { AuthContext } from './state/context/auth-context';
import {
  SESSION_LENGTH,
  SessionActivityEvent,
  currentSessionActivityState, newActivtySession,
  pageContextState,
  trackingTimeUntilNextPush, userIsActiveState
} from './state/recoil';
import { useLocation } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './state/firebase/firebase-config';
import { useIdleTimer } from 'react-idle-timer';


type EventCountByPage = {
  snapshot: number,
  questions: number,
  programEvents: number,
  support: number
}

const userWasActive = (session: SessionActivityEvent) =>
  session.snapshot.activeTime > 0 ||
  session.questions.activeTime > 0 ||
  session.programEvents.activeTime > 0;

const postActivitySessionToFB = async (session: SessionActivityEvent) => {
  // No need to waste FB writes on this.
  // The user may just have left the browser open.
  if (!userWasActive(session)) {
    return;
  }

  try {
    await setDoc(
      doc(db, `sessionTracking`, session.id), session);
    console.log('Session logged to FB');
    console.log(session);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

const SessionTracker = () => {
  const { currentUser } = useContext(AuthContext);
  const TIME_BETWEEN_PUSHES = 11000; // 35 seconds
  const [timeUntilNextPush,
    setTimeuntilNextPush] = useRecoilState(trackingTimeUntilNextPush);

  // Check if the current user exists on the initial render.

  const [sessionActivity, setSessionActivity] = useRecoilState(
    currentSessionActivityState);
  const pageContext = useRecoilValue(pageContextState);
  const [isActive, setIsActive] = useRecoilState(userIsActiveState);
  const location = useLocation();
  const startingEventCount: EventCountByPage = {
    snapshot: 0,
    questions: 0,
    programEvents: 0,
    support: 0
  };
  const [eventCount, setEventCount] = React.useState<EventCountByPage>(
    startingEventCount);

  const onIdle = () => {
    setIsActive(false);
  };

  const onActive = () => {
    setIsActive(true);
  };

  const onAction = (event?: Event) => {
    if (event !== undefined && event.type !== 'mousemove') {
      if (location.pathname.includes('/program-events')) {
        setEventCount({
          ...eventCount,
          programEvents: eventCount.programEvents + 1,
        });
      } else if (location.pathname.includes('/info')) {
        setEventCount({
          ...eventCount,
          snapshot: eventCount.snapshot + 1,
        });
      } else if (location.pathname.includes('/questions')) {
        setEventCount({
          ...eventCount,
          questions: eventCount.questions + 1,
        });
      } else if (location.pathname.includes('/support')) {
        setEventCount({
          ...eventCount,
          support: eventCount.support + 1,
        });
      }
    }
  };

  const { getElapsedTime } = useIdleTimer({
    onAction,
    onActive,
    onIdle,
    throttle: 500,
  });

  const updateCRTime = (viewingCR: Record<string, number>, currentCR: string, activeTime: number) => {
    const timeForCurrentCR = viewingCR[currentCR] !== undefined ? viewingCR[currentCR] + activeTime : activeTime;
    return {
      ...viewingCR,
      [currentCR]: timeForCurrentCR,
    }
  }

  const addActiveAndIdleTimeToSession: (session: SessionActivityEvent,
    time: number, currentCRID: string) => SessionActivityEvent = (session, time, currentCRID) => {
      const idleTime = isActive ? 0 : time;
      const activeTime = !isActive ? 0 : time;
      if (location.pathname.includes('/program-events')) {
        return {
          ...session,
          viewingCR: updateCRTime(session.viewingCR, currentCRID, activeTime),
          programEvents: {
            ...session.programEvents,
            idleTime: session.programEvents.idleTime + idleTime,
            activeTime: session.programEvents.activeTime + activeTime,
          },
        };
      } else if (location.pathname.includes('/info')) {
        return {
          ...session,
          viewingCR: updateCRTime(session.viewingCR, currentCRID, activeTime),
          snapshot: {
            ...session.snapshot,
            idleTime: session.snapshot.idleTime + idleTime,
            activeTime: session.snapshot.activeTime + activeTime,
          },
        };
      } else if (location.pathname.includes('/questions')) {
        return {
          ...session,
          viewingCR: updateCRTime(session.viewingCR, currentCRID, activeTime),
          questions: {
            ...session.questions,
            idleTime: session.questions.idleTime + idleTime,
            activeTime: session.questions.activeTime + activeTime,
          },
        };
      } else if (location.pathname.includes('/support')) {
        return {
          ...session,
          viewingCR: updateCRTime(session.viewingCR, currentCRID, activeTime),
          support: {
            ...session.support,
            idleTime: session.support.idleTime + idleTime,
            activeTime: session.support.activeTime + activeTime,
          },
        };
      } else {
        return session;
      }
    };

  const sessionId = (username: string,
    startDate: number) => `${username}-${startDate}`;

  useEffect(() => {
    const interval = setInterval(async () => {
      const elapsedTime = Math.ceil(getElapsedTime() / 1000);
      if (currentUser?.email !== undefined &&
        currentUser?.email !== null) {
        // setReferralSession(currentUser?.email);
        const updatedSessionPreTime: SessionActivityEvent = {
          ...sessionActivity,
          username: currentUser.email,
          id: sessionId(currentUser.email, sessionActivity.date),
          programEvents: {
            ...sessionActivity.programEvents,
            events: eventCount.programEvents,
          },
          questions: {
            ...sessionActivity.questions,
            events: eventCount.questions,
          },
          support: {
            ...sessionActivity.support,
            events: eventCount.support,
          },
          snapshot: {
            ...sessionActivity.snapshot,
            events: eventCount.snapshot,
          }
        };
        const updatedSession = addActiveAndIdleTimeToSession(
          updatedSessionPreTime, elapsedTime,
          pageContext.selectedCR);
        // Start a new session locally.
        if (updatedSession.date < (new Date()).getTime()) {
          console.log('Start a new session locally.');
          const newSession = newActivtySession(
            currentUser.email, updatedSession.date + SESSION_LENGTH);
          console.log('resetting session locally.');
          setSessionActivity(newSession);
          await postActivitySessionToFB(updatedSession);
          setTimeuntilNextPush(TIME_BETWEEN_PUSHES);
        } else {
          if (timeUntilNextPush < 0) {
            console.log(
              'Post session, overriding a prior session in FB if it exists.');
            // Post session, overriding a prior session in FB if it exists.
            setTimeuntilNextPush(TIME_BETWEEN_PUSHES);
            await postActivitySessionToFB(updatedSession);
          } else {
            setTimeuntilNextPush(timeUntilNextPush - elapsedTime);
          }
          setSessionActivity(updatedSession);
        }
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  return (<></>);
};
export default SessionTracker;

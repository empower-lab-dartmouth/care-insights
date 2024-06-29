import React, {useContext, useEffect} from 'react';
import {useRecoilState} from 'recoil';
import {AuthContext} from './state/context/auth-context';
import {SessionActivityEvent,
  currentSessionActivityState, newActivtySession,
  trackingTimeUntilNextPush, userIsActiveState} from './state/recoil';
import {useLocation} from 'react-router-dom';
import {doc, setDoc} from 'firebase/firestore';
import {db} from './state/firebase/firebase-config';
import {useIdleTimer} from 'react-idle-timer';


type EventCountByPage = {
      videoAnalysis: number,
      summaryInsights: number,
  }

const userWasActive = (session: SessionActivityEvent) =>
  session.videoAnalysis.activeTime > 0 ||
    session.summaryInsights.activeTime > 0;

const postActivitySessionToFB = async (session: SessionActivityEvent) => {
  // No need to waste FB writes on this.
  // The user may just have left the browser open.
  if (!userWasActive(session)) {
    return;
  }

  try {
    await setDoc(
        doc(db, `zEL-${session.username}`, session.id), session);
    console.log('Session logged to FB');
    console.log(session);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

const SessionTracker = () => {
  const {currentUser} = useContext(AuthContext);
  const TIME_BETWEEN_PUSHES = 120000; // Two minutes
  const [timeUntilNextPush,
    setTimeuntilNextPush] = useRecoilState(trackingTimeUntilNextPush);

  // Check if the current user exists on the initial render.

  const [sessionActivity, setSessionActivity] = useRecoilState(
      currentSessionActivityState);
  const [isActive, setIsActive] = useRecoilState(userIsActiveState);
  const location = useLocation();
  const startingEventCount = {
    videoAnalysis: 0,
    summaryInsights: 0,
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
      if (location.pathname.includes('videoAnalysis')) {
        setEventCount({
          ...eventCount,
          videoAnalysis: eventCount.videoAnalysis + 1,
        });
      } else if (location.pathname.includes('info')) {
        setEventCount({
          ...eventCount,
          summaryInsights: eventCount.summaryInsights + 1,
        });
      }
    }
  };

  const {getElapsedTime} = useIdleTimer({
    onAction,
    onActive,
    onIdle,
    throttle: 500,
  });

  const addActiveAndIdleTimeToSession: (session: SessionActivityEvent,
       time: number) => SessionActivityEvent = (session, time) => {
         const idleTime = isActive ? 0 : time;
         const activeTime = !isActive ? 0 : time;
         if (location.pathname.includes('program-events')) {
           return {
             ...session,
             facilitator: {
               ...session.videoAnalysis,
               idleTime: session.videoAnalysis.idleTime + idleTime,
               activeTime: session.videoAnalysis.activeTime + activeTime,
             },
           };
         } else if (location.pathname.includes('info')) {
           return {
             ...session,
             progress: {
               ...session.summaryInsights,
               idleTime: session.summaryInsights.idleTime + idleTime,
               activeTime: session.summaryInsights.activeTime + activeTime,
             },
           };
         } else {
           return session;
         }
       };

  const sessionId = (username: string,
      startDate: number) => `sess-act-${username}-${startDate}`;

  useEffect(() => {
    const interval = setInterval(async () => {
      const elapsedTime = Math.ceil(getElapsedTime() / 1000);
      if (currentUser?.email !== undefined &&
          currentUser?.email !== null) {
        const updatedSessionPreTime: SessionActivityEvent = {
          ...sessionActivity,
          username: currentUser.email,
          id: sessionId(currentUser.email, sessionActivity.date),
          summaryInsights: {
            ...sessionActivity.summaryInsights,
            events: eventCount.summaryInsights,
          },
          videoAnalysis: {
            ...sessionActivity.videoAnalysis,
            events: eventCount.videoAnalysis,
          }
        };
        const updatedSession = addActiveAndIdleTimeToSession(
            updatedSessionPreTime, elapsedTime);
          // Start a new session locally.
        if (updatedSession.date < (new Date()).getTime()) {
          console.log('Start a new session locally.');
          const newSession = newActivtySession(
              currentUser.email, updatedSession.date + 1);
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
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });

  return (<></>);
};
export default SessionTracker;

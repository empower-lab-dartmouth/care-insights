import React, { useContext, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import MuxPlayer from '@mux/mux-player-react';
import {
  MeaningfulMoment,
  VIDEO_APPROVAL_REQUIRED,
  MusicProgramEvent,
  ProgramEvent,
} from '../../../state/types';
import EventsTimeline from '../Timeline/Timeline';
import Stack from '@mui/material/Stack';
import HeatMap from '../HeatMap/HeatMap';
import Transcript from '../Transcript/Transcript';
import { StreamGraphPageViewsDemo } from '../programEventsTable/StreamGraph/StreamGraphPageViewsDemo';
import PlayMux from './MuxPlayer';
import { AuthContext } from '../../../state/context/auth-context';
import { expandedProgramRowState, pageContextState } from '../../../state/recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import { QuickInfo } from '../../summaryInsights/CareInsights';
import { Center, Group, Switch } from '@mantine/core';
import { IS_ADMIN } from '../../../state/globals';
import { useLocation } from 'react-router-dom';
import { ErrorBoundary }
  from "react-error-boundary";


type VideoPlayerProps = {
  videoSrc: string;
  programEvent: MusicProgramEvent;
  setProgramEvent: (programEvent: ProgramEvent) => void;
  setMeaningfulMoments: (
    meaningfulMoments: Record<string, MeaningfulMoment>
  ) => void;
};

const VideoPlayer: React.FC<VideoPlayerProps> = props => {
  const { videoSrc, setProgramEvent, programEvent, setMeaningfulMoments } =
    props;
  const ref = React.useRef<ReactPlayer>(null);
  const { currentUser } = useContext(AuthContext);
  const { search } = useLocation();
  const dev = search.includes('dev=true');
  const pageContext = useRecoilValue(pageContextState);
  const [showVideo, setShowVideo] = useState(true);
  const [programEventIndex, setProgramEventIndex] = useRecoilState(expandedProgramRowState);
  const [videoStarted, setVideoStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const displayName = currentUser?.displayName;
  const [isReady, setIsReady] = React.useState(false);
  const videoApprovalRequriedForSite = displayName !== null && VIDEO_APPROVAL_REQUIRED.filter((v) => displayName?.includes(v)).length > 0;
  const userHasPermissions = pageContext.position !== undefined && pageContext.position !== 'Family';
  const showAdminControls = (dev || IS_ADMIN) && videoApprovalRequriedForSite;
  const videoHasBeenApproved = (programEvent.videoApproved != undefined && programEvent.videoApproved == true);
  const videoNotApproved = videoApprovalRequriedForSite && !userHasPermissions && !videoHasBeenApproved;

  const ErrorFallback: React.FC<any> =
    ({ error }) => (
      <div role="alert">
        <h2>
          Video could not load. Try again later.
        </h2>
      </div>
    );


  const onReady = React.useCallback(() => {
    if (!isReady) {
      if (ref.current !== null) {
        const timeToStart = programEventIndex !== undefined && programEventIndex.programEventId === programEvent.uuid && programEventIndex.videoTimestamp !== undefined ? programEventIndex.videoTimestamp / 1000 : 0;
        if (timeToStart !== 0) {
          ref.current.seekTo(timeToStart, "seconds");
        }
        setIsReady(true);
      }
    }
  }, [isReady]);
  // Check if we're dealing with a facility with location services required.
  const videoApproved = VIDEO_APPROVAL_REQUIRED;
  if (videoSrc === 'video-missing') {
    return 'This video has not yet been processed. It will be made available later.'
  }

  const seekTo = (x: number) => {
    ref.current?.seekTo(x);
  }
  return (
    <>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='flex-start'
        spacing={2}
      >
        <EventsTimeline
          seekTo={seekTo}
          setEvents={setMeaningfulMoments}
          programEvent={programEvent}
          setProgramEvent={setProgramEvent}
          showVideo={showVideo}
          setShowVideo={setShowVideo}
          videoStarted={videoStarted}
          progress={progress}
          playedSeconds={playedSeconds}
        />
        {showVideo ? (
          <div>
            {showAdminControls ? <Switch
              checked={videoHasBeenApproved}
              label={'Enable family member access'}
              onChange={(event) => setProgramEvent({
                ...programEvent,
                videoApproved: event.currentTarget.checked
              })}
            /> : <></>}
            <br />
            {
              videoSrc === 'video-missing' ? <h3>This video is no longer available</h3> :
                <>
                  {videoNotApproved ? <div style={{ width: 600, overflow: 'auto' }}>TEST<QuickInfo
                    value={'Unreleased'}
                    label={''}
                  /><p>The facility admin <br />must manually <br /> review and <br />release all videos.</p></div> :
                    <>
                      <ErrorBoundary
                        FallbackComponent={ErrorFallback}>
                        <ReactPlayer
                          ref={ref}
                          onReady={onReady}
                          onProgress={({
                            played,
                            playedSeconds,
                            loaded,
                            loadedSeconds,
                          }) => {
                            setProgress(played);
                            setPlayedSeconds(playedSeconds);
                          }} onStart={() => setVideoStarted(true)} controls={true} url={videoSrc} />
                      </ErrorBoundary>

                      {
                        programEvent.transcript.length > 0 ?
                          <Transcript setVideoTime={seekTo} transcriptSegments={programEvent.transcript}
                            videoStarted={videoStarted}
                            progress={progress}
                            playedSeconds={playedSeconds}
                          /> :
                          <></>
                      }
                    </>}
                </>
            }
          </div>
        ) : (
          <></>
        )}
      </Stack>
      {/* {
        programEvent.heatmap != undefined && programEvent.heatmap.length > 4 ?
          <StreamGraphPageViewsDemo heatmap={programEvent.heatmap} /> : <></>
      } */}
    </>
  );
};

export default VideoPlayer;

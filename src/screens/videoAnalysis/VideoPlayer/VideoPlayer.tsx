import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import MuxPlayer from '@mux/mux-player-react';
import {
  MeaningfulMoment,
  MusicProgramEvent,
  ProgramEvent,
} from '../../../state/types';
import EventsTimeline from '../Timeline/Timeline';
import Stack from '@mui/material/Stack';
import HeatMap from '../HeatMap/HeatMap';
import Transcript from '../Transcript/Transcript';
import { StreamGraphPageViewsDemo } from '../programEventsTable/StreamGraph/StreamGraphPageViewsDemo';
import PlayMux from './MuxPlayer';


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
  const [showVideo, setShowVideo] = useState(true);
  const [videoStarted, setVideoStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  if (videoSrc === 'video-missing') {
    return 'This video has not yet been processed. It will be made available later.'
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
            {
              videoSrc === 'video-missing' ? <h3>This video is no longer available</h3> :
                <>
                  {/* <PlayMux />
                {programEvent.muxPlaybackId} */}
                  {/* {programEvent.muxAssetId} */}
                  <ReactPlayer onProgress={({
                    played,
                    playedSeconds,
                    loaded,
                    loadedSeconds,
                  }) => {
                    setProgress(played);
                    setPlayedSeconds(playedSeconds);
                  }} onStart={() => setVideoStarted(true)} controls={true} url={videoSrc} />
                  {
                    programEvent.transcript.length > 0 ?
                      <Transcript transcriptSegments={programEvent.transcript} 
                      videoStarted={videoStarted}
          progress={progress}
          playedSeconds={playedSeconds}
          /> :
                      <></>
                  }
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

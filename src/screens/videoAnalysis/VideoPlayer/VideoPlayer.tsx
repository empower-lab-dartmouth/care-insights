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
  const [showVideo, setShowVideo] = useState(programEvent.transcript.length === 0);
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
        />
        {showVideo ? (
          <div>
            {
              videoSrc === 'video-missing' ? <h3>This video is no longer available</h3> :
                <>
                <PlayMux />
                {programEvent.muxPlaybackId}
                <br />
                {programEvent.muxAssetId}
                  <ReactPlayer controls={true} url={videoSrc} />
                  {
                    programEvent.transcript.length > 0 ?
                  <Transcript transcriptSegments={programEvent.transcript} /> :
                  <></>
                  }
                </>
            }
          </div>
        ) : (
          <></>
        )}
      </Stack>
      {
        programEvent.heatmap != undefined && programEvent.heatmap.length > 4 ?
          <StreamGraphPageViewsDemo heatmap={programEvent.heatmap} /> : <></>
      }
    </>
  );
};

export default VideoPlayer;

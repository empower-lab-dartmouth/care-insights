/* eslint-disable require-jsdoc */
import React from 'react';
import ReactPlayer from 'react-player';
import {
    MeaningfulMoment, MusicProgramEvent,
    ProgramEvent
} from '../../../state/types';
import EventsTimeline from '../Timeline/Timeline';
import Stack from '@mui/material/Stack';
import HeatMap from '../HeatMap/HeatMap';
import Transcript from '../Transcript/Transcript';

type VideoPlayerProps = {
    videoSrc: string,
    programEvent: MusicProgramEvent
    setProgramEvent: (programEvent: ProgramEvent) => void
    setMeaningfulMoments: (meaningfulMoments:
        Record<string, MeaningfulMoment>) => void
};

const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
    const { videoSrc, setProgramEvent,
        programEvent, setMeaningfulMoments } = props;
    return (
        <>
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="stretch"
                spacing={2}
            >
                <div>
                    <ReactPlayer url={videoSrc} />
                    <br />
                    <HeatMap />
                </div>
                {
                    <EventsTimeline setEvents={setMeaningfulMoments}
                        programEvent={programEvent}
                        setProgramEvent={setProgramEvent} />
                }
            </Stack>
            <Transcript />
        </>
    );
};

export default VideoPlayer;

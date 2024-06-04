/* eslint-disable require-jsdoc */
import React from 'react';
import ReactPlayer from 'react-player';
import { MeaningfulMoment } from '../../../state/types';
import EventsTimeline from '../Timeline/Timeline';
import Stack from '@mui/material/Stack';
import HeatMap from '../HeatMap/HeatMap';
import Transcript from '../Transcript/Transcript';

type VideoPlayerProps = {
    videoSrc: string,
    meaningfulMoments?: MeaningfulMoment[]
};

const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
    const { videoSrc, meaningfulMoments } = props;
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
                    meaningfulMoments === undefined ?
                        <p>Video analysis is running.</p> :
                        <EventsTimeline events={meaningfulMoments} />
                }
            </Stack>
            <Transcript />
        </>
    );
};

export default VideoPlayer;

/* eslint-disable require-jsdoc */
import React from 'react';
import ReactPlayer from 'react-player';
import { MeaningfulMoment } from '../../../state/types';
import EventsTimeline from '../Timeline/Timeline';
import Stack from '@mui/material/Stack';

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
                <ReactPlayer url={videoSrc} />
                {
                    meaningfulMoments === undefined ?
                        <p>Video analysis is running.</p> :
                        <EventsTimeline events={meaningfulMoments} />
                }
            </Stack>
        </>
    );
};

export default VideoPlayer;

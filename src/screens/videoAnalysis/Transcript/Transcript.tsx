import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import React, { useState } from 'react';
import { TranscriptSegment } from '../../../state/types';
import { Text } from '@mantine/core';

export type TranscriptParams = {
    transcriptSegments: TranscriptSegment[]
    videoStarted: boolean;
    progress: number;
    playedSeconds: number;
    setVideoTime: (seconds: number) => void
}

const conditionalBackground = (momentTime: number, playedSeconds: number, videStarted: boolean) => {
    // if (!videStarted) {
    //     return {};
    // }
    if (Math.abs(playedSeconds - momentTime) < 5) {
        return {
            backgroundColor: 'lightyellow'
        };
    } else {
        return {};
    }
}


const Transcript: React.FC<TranscriptParams> = ({ transcriptSegments, setVideoTime, videoStarted, progress, playedSeconds }) => {
    const [showTranscript, setShowTranscript] = useState(true);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowTranscript(event.target.checked);
    };

    return (
        <>
            <FormGroup>
                <FormControlLabel control={<Switch checked={showTranscript}
                    onChange={handleChange} />} label="show transcript" />
            </FormGroup>
            {showTranscript ?
                <>
                    <Box >
                        <div style={{ maxHeight: 300, overflowY: 'scroll' }}>
                            <Text>
                                {transcriptSegments.map((t) => (
                                    <span onClick={() => setVideoTime(t.offsetSeconds)} key={t.text + t.offsetSeconds}
                                        style={{ ...conditionalBackground(t.offsetSeconds, playedSeconds, videoStarted), display: 'flex' }}>
                                        <span style={{ maxWidth: 100 }}>
                                            {t.text !== '0' ? t.text + ' ' : ''}
                                        </span>
                                    </span>
                                ))
                                }
                            </Text>
                        </div>
                    </Box>
                </> :
                <></>
            }
        </>
    );
};

export default Transcript;

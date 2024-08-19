import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { TranscriptSegment } from '../../../state/types';

export type TranscriptParams = {
    transcriptSegments: TranscriptSegment[]
}

const Transcript: React.FC<TranscriptParams> = ({ transcriptSegments }) => {
    const [showTranscript, setShowTranscript] = useState(false);
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
                    <Box sx={{ width: '50%', maxWidth: 200 }}>
                        {transcriptSegments.map((t) => (
                            <Typography variant="body1" gutterBottom>
                                {t.text}
                            </Typography>
                        ))
                        }
                    </Box>
                </> :
                <></>
            }
        </>
    );
};

export default Transcript;

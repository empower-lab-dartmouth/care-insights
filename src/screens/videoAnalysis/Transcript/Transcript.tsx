import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';

const Transcript = () => {
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
                        <Typography variant="body1" gutterBottom>
                            Lorem ipsum dolor sit amet,
                            consectetur adipisicing elit. Quos
                            blanditiis tenetur unde suscipit,
                            quam beatae rerum inventore consectetur,
                            neque doloribus
                        </Typography>
                    </Box>
                </> :
                <></>
            }
        </>
    );
};

export default Transcript;

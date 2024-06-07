/* eslint-disable require-jsdoc */
import React, { useState } from 'react';
import { ManualEntryEvent, ProgramEvent } from '../../../state/types';
import CommonRowControls from '../CommonRowControls/CommonRowControls';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import { Fab, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

type ManualEntryExpandedViewProps = {
    programEvent: ManualEntryEvent
    setProgramEvent: (programEvent: ProgramEvent) => void
};

const inputStyles = {
    'width': '100%',
    'input:focus, input:valid, textarea:valid': {
        'outline': 'none',
        'border': 'none'
    }
};

const ManualEntryExpandedView: React.FC<
    ManualEntryExpandedViewProps> = (props) => {
        const { programEvent, setProgramEvent } = props;
        const [localProgramEvent,
            setLocalProgramEvent] = useState(programEvent);
        const [editing, setEditing] = useState(false);
        return (
            <>
                {
                    editing ?
                        <>
                            <Stack direction={'row'} spacing={1}>
                                <Fab variant="extended"
                                    sx={{
                                        'min-width': '150px'
                                    }}
                                    aria-label="save"
                                    onClick={() => {
                                        setProgramEvent(localProgramEvent);
                                        setEditing(false);
                                    }}>
                                    <SaveIcon color='primary' />
                                    Save edits
                                </Fab>
                                <Fab variant="extended"
                                    sx={{
                                        'min-width': '150px'
                                    }}
                                    aria-label="Cancel"
                                    onClick={() => {
                                        setLocalProgramEvent(programEvent);
                                        setEditing(false);
                                    }}>
                                    <CancelIcon color='primary' />
                                    Cancel
                                </Fab>
                                <CommonRowControls programEvent={programEvent}
                                setProgramEvent={setProgramEvent} />
                            </Stack>
                            <br />
                            <br />
                            <TextField id="outlined-basic"
                                label="Observations"
                                multiline
                                value={localProgramEvent.description}
                                onChange={
                                    (event:
                                        React.ChangeEvent<
                                            HTMLInputElement>) => {
                                        setLocalProgramEvent({
                                            ...localProgramEvent,
                                            description:
                                                event.target.value
                                        });
                                    }}
                                sx={inputStyles}
                            />
                        </> :
                        <div>
                            <Fab variant="extended"
                                sx={{
                                    'min-width': '150px'
                                }}
                                onClick={() => setEditing(true)}
                                aria-label="edit">
                                <EditIcon />
                                Edit
                            </Fab>
                            <br />
                            <br />
                            <Typography variant="body1">
                                {programEvent.description}
                            </Typography>
                        </div>
                }
            </>
        );
    };

export default ManualEntryExpandedView;

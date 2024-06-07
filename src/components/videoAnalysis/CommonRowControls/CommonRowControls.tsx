/* eslint-disable require-jsdoc */
import React, { useState } from 'react';
import {
    EngagementLevel, ProgramEvent,
    RedirectionLevel
} from '../../../state/types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Selector, { SelectionChoice } from './Selector';
import { setRemoteProgramEvent } from '../../../state/setting';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Fab from '@mui/material/Fab';
import DeleteConfirmModal from './DeleteConfirmationModal';
import TextField from '@mui/material/TextField';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const inputStyles = {
    'width': '100%',
    'input:focus, input:valid, textarea:valid': {
        'outline': 'none',
        'border': 'none'
    }
};


const datePickerStyling = {
    'input:focus, input:valid, textarea:valid': {
        'outline': 'none',
        'border': 'none'
    }
};

const ENGAGEMENT_LEVEL_OPTIONS: SelectionChoice<
    EngagementLevel>[] = [
        {
            label: 'Low',
            value: 'low'
        },
        {
            label: 'Average',
            value: 'average'
        },
        {
            label: 'High',
            value: 'high'
        },
        {
            label: 'None',
            value: 'none'
        },
        {
            label: 'N/A',
            value: 'na'
        }];

const REDIRECTION_LEVEL_OPTIONS: SelectionChoice<
    RedirectionLevel>[] = [
        {
            label: 'Success',
            value: 'success'
        },
        {
            label: 'None',
            value: 'none'
        },
        {
            label: 'Unsuccessful',
            value: 'unsuccessful'
        },
        {
            label: 'N/A',
            value: 'na'
        },
    ];


type ManualEntryExpandedViewProps = {
    programEvent: ProgramEvent
    setProgramEvent: (programEvent: ProgramEvent) => void
};

const CommonRowControls: React.FC<
    ManualEntryExpandedViewProps> = (props) => {
        const { programEvent, setProgramEvent } = props;
        console.log(programEvent);
        const [open, setOpen] = React.useState(false);
        const [localProgramEvent, setLocalProgramEvent] = useState(
            programEvent);
        const handleOpen = () => setOpen(true);
        const handleClose = () => {
            setOpen(false);
            setTimeout(() => {
                setLocalProgramEvent(programEvent);
            }, 500);
        };

        return (
            <>
                <Fab variant="extended"
                    sx={{
                        'min-width': '150px'
                    }}
                    onClick={handleOpen}
                    aria-label="edit">
                    <EditIcon />
                    Edit row fields
                </Fab>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={open}>
                        <Box sx={style}>
                            <Typography id="transition-modal-title"
                                variant="h6" component="h2">
                                Edit row fields
                            </Typography>
                            <TextField id="outlined-basic"
                                label="Event type"
                                value={localProgramEvent.label}
                                onChange={
                                    (event:
                                        React.ChangeEvent<
                                            HTMLInputElement>) => {
                                        setLocalProgramEvent({
                                            ...localProgramEvent,
                                            label:
                                                event.target.value
                                        });
                                    }}
                                sx={inputStyles}
                            />
                            <Selector selected={localProgramEvent.engagement}
                                label={'Engagement level'} onSelect={(c) =>
                                    setLocalProgramEvent({
                                        ...localProgramEvent,
                                        engagement: c as EngagementLevel
                                    })}
                                options={ENGAGEMENT_LEVEL_OPTIONS}
                            />
                            <Selector selected={localProgramEvent.redirection}
                                label={'Redirections'} onSelect={(c) =>
                                    setLocalProgramEvent({
                                        ...localProgramEvent,
                                        redirection: c as RedirectionLevel
                                    })}
                                options={REDIRECTION_LEVEL_OPTIONS}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    sx={datePickerStyling}
                                    label="Controlled picker"
                                    value={dayjs(programEvent.date)}
                                    onChange={(newValue) => {
                                        if (newValue != null) {
                                            setLocalProgramEvent({
                                                ...localProgramEvent,
                                                date: newValue.valueOf(),
                                            });
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                            <br />
                            <Button onClick={
                                () => {
                                    setRemoteProgramEvent(localProgramEvent);
                                    setProgramEvent(localProgramEvent);
                                    handleClose();
                                }}>
                                Save</Button>
                            <br />
                            <DeleteConfirmModal deleteAction={() => {
                                setOpen(false);
                                setProgramEvent({
                                    ...programEvent,
                                    deleted: 'true'
                                });
                                setRemoteProgramEvent({
                                    ...programEvent,
                                    deleted: 'true'
                                });
                            }} />
                        </Box>
                    </Fade>
                </Modal>
            </>
        );
    };

export default CommonRowControls;

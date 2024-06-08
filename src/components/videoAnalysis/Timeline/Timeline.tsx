/* eslint max-lines: "off" */

import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent, {
} from '@mui/lab/TimelineContent';
import TimelineOppositeContent, {
    timelineOppositeContentClasses
} from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import prettyMilliseconds from 'pretty-ms';
import Typography from '@mui/material/Typography';
import {
    MeaningfulMoment, MomentType, MusicProgramEvent,
    ProgramEvent,
    SelectorValue
} from '../../../state/types';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { Fab, Slider, Stack, TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuItem from '@mui/material/MenuItem';
import StyleIcon from '@mui/icons-material/Style';
import { v4 as uuidv4 } from 'uuid';
import NotesIcon from '@mui/icons-material/Notes';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { setRemoteProgramEvent } from '../../../state/setting';
import CommonRowControls from '../CommonRowControls/CommonRowControls';

const inputStyles = {
    'width': '100%',
    'input:focus, input:valid, textarea:valid': {
        'outline': 'none',
        'border': 'none'
    }
};

type TimelineProps = {
    programEvent: MusicProgramEvent
    setProgramEvent: (programEvent: ProgramEvent) => void
    setEvents: (events: Record<string, MeaningfulMoment>) => void
}

function eventHeader(moment: MeaningfulMoment) {
    switch (moment.type) {
        case 'memory-recall':
            return "Memory recall";
        case 'redirection':
            return "Redirection";
        case 'note':
            return "Note";
        case 'positive-music':
            return 'Positive response to music';
    }
};

function icon(moment: MeaningfulMoment) {
    switch (moment.type) {
        case 'memory-recall':
            return (<TimelineDot>
                <FavoriteIcon />
            </TimelineDot>);
        case 'redirection':
            return (
                <TimelineDot color="error">
                    <ErrorOutlineIcon />
                </TimelineDot>
            );
        case 'note':
            return (
                <TimelineDot>
                    <NotesIcon />
                </TimelineDot>
            );
        case 'positive-music':
            return (
                <TimelineDot>
                    <MusicNoteIcon />
                </TimelineDot>
            );
    }
}

type OptionsProps = {
    moment: MeaningfulMoment;
    updateMomentType: (type: MomentType) => void
}

const Options: React.FC<OptionsProps> = ({ moment, updateMomentType }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const options: SelectorValue<MomentType>[] = [{
        label: 'Redirection',
        value: 'redirection'
    }, {
        label: 'Positive response to music',
        value: 'positive-music'
    },
    {
        label: 'Memory recall',
        value: 'memory-recall'
    },
    {
        label: 'Note',
        value: 'note'
    }];

    const ITEM_HEIGHT = 48;

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <StyleIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '30ch',
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option.label} selected={
                        option.value === moment.type} onClick={() => {
                            updateMomentType(option.value);
                            handleClose();
                        }}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </div >
    );
};

type DeleteProps = {
    delete: () => void;
}

const Delete: React.FC<DeleteProps> = ({ delete: d }) => {
    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                onClick={d}
            >
                <DeleteIcon />
            </IconButton>
        </div>
    );
};

type TimePickerProps = {
    updateTime: (time: number) => void;
    time: number
}

const TimePicker: React.FC<TimePickerProps> = ({ updateTime, time }) => {
    const [showSlider, setShowTimer] = React.useState(false);
    const [localTime, setLocalTime] = React.useState(time);
    const handleChange = (event: Event, newValue: number | number[]) => {
        setLocalTime(newValue as number);
    };
    return (
        <div>
            <Stack direction={'row'}>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    onClick={() => {
                        console.log('save button clicked');
                        if (showSlider) {
                            console.log('UPDATE TIME');
                            updateTime(localTime);
                        }
                        setShowTimer(!showSlider);
                    }}
                >
                    {
                        showSlider ?
                            <SaveIcon color='primary' /> :
                            <AccessTimeIcon />
                    }

                </IconButton>

                {
                    showSlider ?
                        <Stack direction={'column'}>
                            <Slider sx={{
                                'min-width': '200px'
                            }}
                                aria-label="Change time"
                                valueLabelDisplay="on"
                                value={localTime}
                                onChange={handleChange}
                                min={0}
                                max={10800000} // Three hours
                                valueLabelFormat={(value) => {
                                    return prettyMilliseconds(value);
                                }
                                } />
                            <Typography variant='body1'>
                                Apply changes by closing this slider
                            </Typography>
                        </Stack> : <></>
                }
            </Stack>
        </div>
    );
};

const EventsTimeline: React.FC<TimelineProps> = (props) => {
    const { programEvent, setEvents, setProgramEvent } = props;
    const events = programEvent.meaningfulMoments;
    const [localEvents, setLocalEvents] = React.useState(events);
    const [editModeOn, setEditModeOn] = React.useState(false);

    const addMoment = () => {
        const id = uuidv4();
        setLocalEvents({
            ...localEvents,
            [id]: {
                uuid: id,
                startTime: 0,
                description: '',
                type: 'note'
            }
        });
    };

    const updateTime = (moment: MeaningfulMoment) => (time: number) => {
        setLocalEvents({
            ...localEvents,
            [moment.uuid]: {
                ...localEvents[moment.uuid],
                startTime: time,
            }
        });
    };

    const updateMomentType = (moment:
        MeaningfulMoment) => (type: MomentType) => {
            setLocalEvents({
                ...localEvents,
                [moment.uuid]: {
                    ...localEvents[moment.uuid],
                    type,
                }
            });
        };

    const updateMeaningfulMoments = (moment: MeaningfulMoment) =>
        setLocalEvents({
            ...localEvents,
            [moment.uuid]: moment
        });
    const deleteMeaningfulMoment = (
        moment: MeaningfulMoment) => () => {
            // eslint-disable-next-line no-unused-vars
            const { [moment.uuid]: omit, ...res } = localEvents;
            console.log(omit); // Useless log to avoid unused var error
            setLocalEvents(res);
        };

    if (editModeOn) {
        return (
            <>
                <Timeline sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                        flex: 0.2,
                    },
                }}>
                    <TimelineItem>
                        <TimelineOppositeContent
                            sx={{
                                'm': 'auto 0',
                                'width': '50px',
                                'text-wrap': 'wrap',
                            }}
                            align="right"
                            variant="body2"
                            color="text.secondary"
                        >
                            <Stack direction="row" spacing={0}>
                                <Fab variant="extended"
                                    sx={{
                                        'min-width': '150px'
                                    }}
                                    aria-label="save"
                                    onClick={() => {
                                        setEvents(localEvents);
                                        setRemoteProgramEvent({
                                            ...programEvent,
                                            meaningfulMoments: localEvents,
                                        });
                                        setEditModeOn(false);
                                    }
                                    }>
                                    <SaveIcon color='primary' />
                                    Save edits
                                </Fab>
                                <Fab variant="extended"
                                    aria-label="edit"
                                    sx={{
                                        'min-width': '150px'
                                    }}
                                    onClick={() => {
                                        setEditModeOn(false);
                                        setLocalEvents(events);
                                    }
                                    }>
                                    <CancelIcon />
                                    Cancel
                                </Fab>
                                <Fab variant="extended"
                                    sx={{
                                        'min-width': '150px'
                                    }}
                                    onClick={addMoment}
                                    aria-label="add">
                                    <AddIcon />
                                    Add moment
                                </Fab>
                                <CommonRowControls programEvent={programEvent}
                                    setProgramEvent={setProgramEvent}
                                />
                            </Stack>
                        </TimelineOppositeContent>
                    </TimelineItem>
                    {
                        Object.values(localEvents).sort(
                            (b, a) => a.startTime - b.startTime).map((e) =>
                                <TimelineItem key={e.startTime}>
                                    <TimelineOppositeContent
                                        sx={{
                                            'm': 'auto 0',
                                            'width': '50px',
                                            'text-wrap': 'wrap',
                                        }}
                                        align="right"
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {prettyMilliseconds(e.startTime)}
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineConnector />
                                        {icon(e)}
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                                        <Stack direction="row" spacing={0}>
                                            <Typography variant="h6"
                                                component="span">
                                                {
                                                    eventHeader(e)
                                                }
                                            </Typography>
                                            <Options moment={e}
                                                updateMomentType={
                                                    updateMomentType(e)} />
                                            <Delete delete={
                                                deleteMeaningfulMoment(e)} />
                                            <TimePicker
                                                time={e.startTime}
                                                updateTime={updateTime(e)} />
                                        </Stack>
                                        <br />
                                        <TextField id="outlined-basic"
                                            label="Observations"
                                            multiline
                                            value={e.description}
                                            onChange={
                                                (event:
                                                    React.ChangeEvent<
                                                        HTMLInputElement>) => {
                                                    updateMeaningfulMoments({
                                                        ...e,
                                                        description:
                                                            event.target.value
                                                    });
                                                }}
                                            sx={inputStyles}
                                        />
                                    </TimelineContent>
                                </TimelineItem>
                            )
                    }
                </Timeline>
            </>
        );
    }
    return (
        <>
            <Timeline sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                    flex: 0.2,
                },
            }}>
                <TimelineItem>
                    <TimelineOppositeContent
                        sx={{
                            'm': 'auto 0',
                            'width': '50px',
                            'text-wrap': 'wrap',
                        }}
                        align="right"
                        variant="body2"
                        color="text.secondary"
                    >
                        <Fab variant="extended"
                            sx={{
                                'min-width': '150px'
                            }}
                            onClick={() => setEditModeOn(true)}
                            aria-label="edit">
                            <EditIcon />
                            Edit
                        </Fab>
                    </TimelineOppositeContent>
                </TimelineItem>
                {
                    Object.values(events).sort(
                        (a, b) => a.startTime - b.startTime).map((e) =>
                            <TimelineItem key={e.startTime}>
                                <TimelineOppositeContent
                                    sx={{
                                        'm': 'auto 0',
                                        'width': '50px',
                                        'text-wrap': 'wrap',
                                    }}
                                    align="right"
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {prettyMilliseconds(e.startTime)}
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineConnector />
                                    {icon(e)}
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent sx={{ py: '12px', px: 2 }}>
                                    <Typography variant="h6" component="span">
                                        {
                                            eventHeader(e)
                                        }
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        'width': '200px',
                                        'text-wrap': 'wrap',
                                    }}>
                                        {e.description}</Typography>
                                </TimelineContent>
                            </TimelineItem>
                        )
                }
            </Timeline >
        </>
    );
};

export default EventsTimeline;

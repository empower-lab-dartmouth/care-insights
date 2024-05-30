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
import { MeaningfulMoment } from '../../../state/types';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

type TimelineProps = {
    events: MeaningfulMoment[]
}

function eventHeader(moment: MeaningfulMoment) {
    switch (moment.type) {
        case 'memory':
            return "Memory recall";
        case 'negative':
            return "Concerning event";
        case 'positiveMusic':
            return 'Positive response to music';
    }
};

function icon(moment: MeaningfulMoment) {
    switch (moment.type) {
        case 'memory':
            return (<TimelineDot>
                <FavoriteIcon />
            </TimelineDot>);
        case 'negative':
            return (
                <TimelineDot color="error">
                    <ErrorOutlineIcon />
                </TimelineDot>
            );
        case 'positiveMusic':
            return (
                <TimelineDot>
                    <MusicNoteIcon />
                </TimelineDot>
            );
    }
}

const EventsTimeline: React.FC<TimelineProps> = (props) => {
    const { events } = props;

    return (
        <Timeline sx={{
            [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 0.2,
            },
        }}>
            {
                events.map((e) =>
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
        </Timeline>
    );
};

export default EventsTimeline;

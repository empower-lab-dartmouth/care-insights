import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import React, { useContext, useRef, useState } from 'react';
import { HeatmapData, HeatmapDataPoint, HeatmapKey, TranscriptSegment, attentionColumnName, combinedEngagementName, emotionColumnName, memoryRecallColumnName, noOverlayName, reactionColumnName, symptomColumnName } from '../../../state/types';
import { Center, Group, Select, Text } from '@mantine/core';
import { mean } from 'simple-statistics';
import colormap from 'colormap';
import { useRecoilState, useRecoilValue } from 'recoil';
import { heatmapSelectedKeyState, pageContextState } from '../../../state/recoil';
import { reportTrackingEvent } from '../../../state/tracking';
import { AuthContext } from '../../../state/context/auth-context';

export type TranscriptParams = {
    transcriptSegments: TranscriptSegment[]
    videoStarted: boolean;
    progress: number;
    playedSeconds: number;
    heatmapStringified: string;
    programEventId: string,
    setVideoTime: (seconds: number) => void
}

const conditionalBackground = (momentTime: number, playedSeconds: number, videStarted: boolean, defaultColor: string, key: HeatmapKey) => {
    // if (!videStarted) {
    //     return {};
    // }
    const highlightColor = key === noOverlayName ? 'lightyellow' : 'lightblue';
    if (Math.abs(playedSeconds - momentTime) < 5) {
        if (key === noOverlayName) {
            return {
                backgroundColor: highlightColor
            };
        } else {
            return {
                'background-image': `linear-gradient(to right, ${defaultColor} , ${highlightColor})`
            };
        }
    } else {
        return {
            backgroundColor: defaultColor
        };
    }
}



const greens = colormap({
    colormap: 'greens',
    nshades: 10,
    format: 'hex',
    alpha: 1
}).reverse();

const reds = colormap({
    colormap: 'hot',
    nshades: 10,
    format: 'hex',
    alpha: 1
}).reverse();

const Transcript: React.FC<TranscriptParams> = ({ transcriptSegments, programEventId, setVideoTime, videoStarted, progress, playedSeconds, heatmapStringified }) => {
    const [showTranscript, setShowTranscript] = useState(true);
    const heatmap = JSON.parse(heatmapStringified) as HeatmapDataPoint[];
    const { currentUser } = useContext(AuthContext);
    const pageState = useRecoilValue(pageContextState);
    const [heatmapSelectedKey, setHeatmapSelectedKey] = useRecoilState(heatmapSelectedKeyState);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowTranscript(event.target.checked);
    };
    const myRefArr = useRef<HTMLElement | null[]>([]);


    const getValueForSecond = (seconds: number, key: HeatmapKey) => {
        if (key === noOverlayName) {
            return 0;
        }
        const index = Math.floor(seconds);
        if (index < heatmap.length) {
            const v = heatmap[index];
            if (key === combinedEngagementName) {
                return mean([v[attentionColumnName], v[reactionColumnName], v[symptomColumnName], v[memoryRecallColumnName], v[emotionColumnName]]);
            } else {
                return v[key];
            }
        }
        return 0;
    }

    const getValueForRange = (start: number, end: number, key: HeatmapKey) => {
        let v: number[] = [];
        let i = start;
        while (Math.floor(i) < Math.floor(end)) {
            v.push(getValueForSecond(i, key));
            i = i + 1;
        }
        return mean(v);
    }

    const getColorForRange = (start: number, end: number, key: HeatmapKey) => {
        if (key === noOverlayName) {
            return 'white';
        }
        const colors = key === symptomColumnName ? reds : greens;
        const scalar = key === symptomColumnName ? 1.4 : 1;
        const i = Math.floor(getValueForRange(start, end, key) * 10 * scalar);
        if (i > colors.length) {
            return colors[colors.length - 1];
        }
        return colors[i];
    }

    const colorScaleStyles = () => {
        const colors = heatmapSelectedKey === symptomColumnName ? reds : greens;
        return {
            'background-image': `linear-gradient(to right, ${colors[0]} , ${colors[4]})`
        };
    }


    return (
        <>
            <FormGroup>
                <FormControlLabel control={<Switch checked={showTranscript}
                    onChange={handleChange} />} label="show transcript" />
            </FormGroup>
            {showTranscript ?
                <>
                    <Select
                        value={heatmapSelectedKey}
                        clearable={false}
                        onChange={(e) => {
                            if (e !== null) {
                                reportTrackingEvent({
                                    type: 'toggle-transcript',
                                    programEventId,
                                }, currentUser?.email as string, pageState);
                                setHeatmapSelectedKey(e as HeatmapKey);
                            }
                        }}
                        data={[noOverlayName, combinedEngagementName, symptomColumnName, memoryRecallColumnName,
                            reactionColumnName, attentionColumnName, emotionColumnName]}
                    />
                    <Box >
                        {
                            heatmapSelectedKey !== noOverlayName ? <div style={{ marginBottom: '20px' }}><Center>Color scale: (currently playing text in blue)</Center><Group justify="space-between" style={colorScaleStyles()}><span>Baseline</span><span style={{ color: 'white' }}>High</span></Group></div> :
                                <Text style={{ marginBottom: '20px', color: 'darkblue' }}>Currently playing text is highlighted below in yellow.<br />Use the menu above to color code the transcript<br />based on care recipient engagement.</Text>
                        }
                        <div style={{ maxHeight: 400, overflowY: 'scroll' }}>
                            <Text>
                                {transcriptSegments.map((t) => (
                                    <span onClick={() => {
                                        reportTrackingEvent({
                                            type: 'jump-to-time-in-transcript',
                                            programEventId,
                                            time: t.offsetSeconds,
                                            text: t.text,
                                            engagementScore: getValueForRange(t.offsetSeconds,
                                                Math.min(t.offsetSeconds + 5, heatmap.length - 1), heatmapSelectedKey),
                                            engagementType: heatmapSelectedKey,
                                        }, currentUser?.email as string, pageState);
                                        setVideoTime(t.offsetSeconds);
                                    }} key={t.text + t.offsetSeconds}
                                        style={{
                                            ...conditionalBackground(t.offsetSeconds, playedSeconds, videoStarted, getColorForRange(t.offsetSeconds,
                                                Math.min(t.offsetSeconds + 5, heatmap.length - 1),
                                                heatmapSelectedKey), heatmapSelectedKey), display: 'flex'
                                        }}>
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

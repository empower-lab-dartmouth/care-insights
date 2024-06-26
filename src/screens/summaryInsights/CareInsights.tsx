import React from 'react';
import Nav from '../nav/NavBar';
import './summaryInsights.css';
import QuestionAndAnswerPanel from './QuestionAndAnswerPanel/QuestionAndAnswerPanel';
import CommonCRActions from '../nav/CommonCRActions/CommonCRActions';
import { NO_CR_SELECTED, careRecipientsInfoState, pageContextState, queriesForCurrentCGState } from '../../state/recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import CircularProgress from '@mui/material/CircularProgress';
import UserShell from '../../components/UserShell';
import { Image, Text, Grid, Group, Stack, Paper, Space, Avatar, Button } from '@mantine/core';
import QuickFactsBox, { LOADING_STRING } from './QuickFactsBox';
import { QueryRecord } from '../../state/queryingTypes';

const CareInsightsPage = () => {
    const pageContext = useRecoilValue(pageContextState);
    const careRecipients = useRecoilValue(careRecipientsInfoState);
    const CRName = careRecipients[pageContext.selectedCR] !== undefined ? careRecipients[pageContext.selectedCR].name : 'NONE';

    const quickBoxId = (prompt: string) => `QuickBox  p:${prompt} cr:${pageContext.selectedCR}`;
    const loadingQuery: (prompt: string) => QueryRecord = (query) => ({
        query,
        CGUUID: pageContext.username,
        CRUUID: pageContext.selectedCR,
        queryUUID: quickBoxId(query),
        queryResponse: LOADING_STRING,
    });

    const makeData = (prompt: string) => ({
        queryRecord: loadingQuery(prompt),
    });



    return (
        <div className='min-h-screen flex flex-col bg-gray-200'>
            <UserShell>
                <Paper style={{ marginBottom: 10, padding: 5 }}>
                    <Grid justify="space-between" align="stretch">
                        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                            <CommonCRActions page={'care-insights'} />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            {pageContext.loadingCRInfo ? (
                                <CircularProgress />
                            ) : pageContext.selectedCR === NO_CR_SELECTED ? (
                                <p>No care recipient selected</p>
                            ) : (
                                <Group justify="center">
                                    <Stack
                                        // h={300}
                                        bg="var(--mantine-color-body)"
                                        align="stretch"
                                        // justify="center"
                                        gap="md"
                                    >
                                        <Avatar h={100} w="auto" src={careRecipients[pageContext.selectedCR].imageURL} alt="Care recipient image" />
                                    </Stack>
                                    <Stack
                                        // h={300}
                                        bg="var(--mantine-color-body)"
                                        align="stretch"
                                    // justify="center"
                                    // gap="md"
                                    >
                                        {
                                            careRecipients[pageContext.selectedCR].infoBox ?
                                                careRecipients[pageContext.selectedCR].infoBox.map((i) => (
                                                    <Text>{`${i.label}: ${i.value}`}</Text>
                                                )) : <></>
                                        }
                                    </Stack>
                                </Group>
                            )}
                        </Grid.Col>
                    </Grid>
                </Paper>
                {pageContext.loadingCRInfo ? (
                    <CircularProgress />
                ) : <>
                    {CRName !== 'NONE' ?
                        <Grid justify="flex-start" align="stretch">
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <QuickFactsBox type='avoid' /></Grid.Col>
                            <Grid.Col span={{ base: 12, md: 6 }}><QuickFactsBox type='do' /></Grid.Col>
                            <Grid.Col span={{ base: 12, md: 6 }}><QuickFactsBox type='symptom' /></Grid.Col>
                            <Grid.Col span={{ base: 12, md: 6 }}><QuickFactsBox type='redirection' /></Grid.Col>
                        </Grid> : <></>
                    }
                </>
                }
            </UserShell>
        </div>
    );
};

export default CareInsightsPage;

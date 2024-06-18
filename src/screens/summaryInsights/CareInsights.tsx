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

const sampleAvoidQuery = (name: string) => `What specific things should you as a caregiver avoid when working with ${name}?`;
const sampleDoQuery = (name: string) => `What things should you as a caregiver do more of when working with ${name}?`;
const sampleSymptomsQuery = (name: string) => `What common symptoms does ${name} show?`;
const sampleRedirectQuery = (name: string) => `What things should you do as a dementia caregiver to redirect ${name} show?`;

const CareInsightsPage = () => {
    const pageContext = useRecoilValue(pageContextState);
    const careRecipients = useRecoilValue(careRecipientsInfoState);
    const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
    const CRName = careRecipients[pageContext.selectedCR] !== undefined ? careRecipients[pageContext.selectedCR].name : 'NONE';

    const quickBoxId = (prompt: string) => `QuickBox  p:${prompt} cr:${pageContext.selectedCR}`;
    const loadingQuery: (prompt: string) => QueryRecord = (query) => ({
        query,
        CGUUID: pageContext.username,
        CRUUID: pageContext.selectedCR,
        queryUUID: quickBoxId(query),
        queryResponse: LOADING_STRING,
    });

    const setQuery = (q: QueryRecord) => setQueries({
        ...queries,
        [q.query]: q,
    })

    const makeData = (prompt: string) => ({
        queryRecord: loadingQuery(prompt),
        setQuery,
    });

    const queryData = {
        'do': makeData(sampleDoQuery(CRName)),
        'avoid': makeData(sampleAvoidQuery(CRName)),
        'symptom': makeData(sampleSymptomsQuery(CRName)),
        'redirection': makeData(sampleRedirectQuery(CRName)),
    };

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

                                        {/* <Image
                                            radius="md"
                                            h={100}
                                            w="auto"
                                            fit="contain"
                                            src={}
                                            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                                        /> */}
                                    </Stack>
                                    <Stack
                                        // h={300}
                                        bg="var(--mantine-color-body)"
                                        align="stretch"
                                    // justify="center"
                                    // gap="md"
                                    >
                                        {
                                            careRecipients[pageContext.selectedCR].infoBox.map((i) => (
                                                <Text>{`${i.label}: ${i.value}`}</Text>
                                            ))
                                        }
                                    </Stack>
                                </Group>
                            )}
                        </Grid.Col>
                    </Grid>
                </Paper>
                {CRName !== 'NONE' ?
                    <Grid justify="flex-start" align="stretch">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <QuickFactsBox queryRecord={queryData.avoid.queryRecord} setQueryRecord={queryData.avoid.setQuery} type='avoid' /></Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}><QuickFactsBox queryRecord={queryData.do.queryRecord} setQueryRecord={queryData.do.setQuery} type='do' /></Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}><QuickFactsBox queryRecord={queryData.symptom.queryRecord} setQueryRecord={queryData.symptom.setQuery} type='symptom' /></Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}><QuickFactsBox queryRecord={queryData.redirection.queryRecord} setQueryRecord={queryData.redirection.setQuery} type='redirection' /></Grid.Col>
                    </Grid> : <></>
                }
            </UserShell>
        </div>
    );
};

export default CareInsightsPage;

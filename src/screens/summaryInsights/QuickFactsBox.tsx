import React, { useContext, useEffect, useState } from 'react';
import Nav from '../nav/NavBar';
import './summaryInsights.css';
import QuestionAndAnswerPanel from './QuestionAndAnswerPanel/QuestionAndAnswerPanel';
import CommonCRActions from '../nav/CommonCRActions/CommonCRActions';
import { NO_CR_SELECTED, careRecipientsInfoState, pageContextState, queriesForCurrentCGState } from '../../state/recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import CircularProgress from '@mui/material/CircularProgress';
import UserShell from '../../components/UserShell';
import { Image, Text, Grid, Group, Stack, Paper, Title, Center, Button } from '@mantine/core';
import WYSIWYGEditor from './WYSIWYGEditor/WYSIWYGEditor';
import { MDXEditor, headingsPlugin, imagePlugin, linkDialogPlugin, listsPlugin } from '@mdxeditor/editor';
import { AuthContext } from '../../state/context/auth-context';
import { QueryRecord } from '../../state/queryingTypes';
import { askQuery, modifyWithFeedback, respondToApprovalFeedback } from '../../state/querying';
import { delayThenDo } from '../../state/sampleData';
import { IconCheck, IconX, IconEdit } from '@tabler/icons-react';



export const LOADING_STRING = 'Loading...';

type QuickFactsBoxProps = {
    type: 'avoid' | 'do' | 'symptom' | 'redirection'
    queryRecord: QueryRecord
    setQueryRecord: (q: QueryRecord) => void
}

const title = ({ type }: QuickFactsBoxProps) => {
    switch (type) {
        case 'avoid':
            return "Avoid";
        case 'do':
            return 'Do';
        case 'redirection':
            return 'Redirection';
        case 'symptom':
            return 'Symptoms';
    }
};

const QuickFactsBox: React.FC<QuickFactsBoxProps> = (props) => {
    const { type, queryRecord, setQueryRecord } = props;
    const { currentUser } = useContext(AuthContext);
    const [pageContext, setPageContext] = useRecoilState(pageContextState);
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
    const [feedbackInputOpen, setFeedbackInputOpen] = useState(false);
    const [feedbackInput, setFeedbackInput] = useState('');
    const [editingDirectly, setEditingDirectly] = useState(false);
    const [editedResponse, setEditedResponse] = useState(queryRecord
        .queryResponse);
    const [forceUpdateRequired, setForceUpdateRequired] = useState(false);
    const alreadyApproved = queryRecord !== undefined &&
        queryRecord.CGUUID === currentUser?.email as string;

    const handleLocalQueryResponse = (q: QueryRecord) => {
        setQueries({
            ...queries,
            [q.query]: q
        });
        setQueryRecord(q);
        setEditedResponse(q.queryResponse);
    };
    const makeQuery = async (q: string) => {
        console.log("MAKE QUERY!");
        setLoadingResponse(true);
        setEditingDirectly(false);
        setFeedbackInputOpen(false);
        await askQuery(q, handleLocalQueryResponse,
            pageContext.selectedCRProgramEvents,
            currentUser?.email as string,
            pageContext.selectedCR, queries);
        setForceUpdateRequired(true);
        setLoadingResponse(false);
    };

    const updateWithFeedback = async () => {
        setLoadingResponse(true);
        setFeedbackInput('');
        await modifyWithFeedback(feedbackInput,
            queryRecord,
            handleLocalQueryResponse,
            pageContext.selectedCRProgramEvents,
            currentUser?.email as string,
            pageContext.selectedCR, queries);
        setForceUpdateRequired(true);
        setLoadingResponse(false);
    };

    const submitApprovalFeedback = async () => {
        setLoadingResponse(true);
        const approvedQuery: QueryRecord = {
            ...queryRecord,
            dateApproved: (new Date()).getTime(),
            queryResponse: editedResponse,
        };
        await respondToApprovalFeedback(
            approvedQuery);
        setQueryRecord(approvedQuery);
        setQueries({
            ...queries,
            [approvedQuery.query]: approvedQuery
        });
        setLoadingResponse(false);
    };
    const approve = () => {
        submitApprovalFeedback();
        delayThenDo(() => setForceUpdateRequired(true), 100);
        setFeedbackInputOpen(false);
        setEditingDirectly(false);
        setFeedbackInput('');
    };

    useEffect(() => {
        async function doAsync() {
            makeQuery(queryRecord.query);
        }
        doAsync()
    }, [])

    return (
        <Paper>
            <Stack h={300}>
                <Center>
                    <Title order={1} c={type == 'avoid' ? 'red' : 'dark'}>{title(props)}</Title>
                </Center>
                <WYSIWYGEditor loading={loadingResponse}
                    readOnly={!editingDirectly}
                    update={forceUpdateRequired}
                    updateCallback={(f) => {
                        setEditedResponse(queries[
                            queryRecord.query].queryResponse);
                        setForceUpdateRequired(false);
                        f();
                    }}
                    defaultMessage=
                    'Type in a question above and click "get insights"'
                    showDefaultMessage={false}
                    markdown={editedResponse}
                    onChange={setEditedResponse}
                />
            </Stack>
            <Stack
                align="flex-end"
                justify="flex-end"
            >
                <Group justify="flex-end" h={"auto"}>
                    {
                        alreadyApproved &&
                            !editingDirectly ? <></> :
                            <Button variant="outline" onClick={approve}
                                leftSection={<IconCheck color='green' size={14} />} >
                                Endorse
                            </Button>
                    }
                    {
                        editingDirectly ?
                        <Button variant="outline"
                                onClick={() => {
                                    setEditedResponse(queries[
                                        queryRecord.query].queryResponse);
                                    setEditingDirectly(false);
                                    setFeedbackInputOpen(false);
                                }}
                                leftSection={<IconX size={14} />}>
                                Cancel </Button> : <></>
                    }
                    <Button variant="outline"
                        disabled={editingDirectly}
                        onClick={() => {
                            setForceUpdateRequired(true);
                            setEditingDirectly(true);
                            setFeedbackInputOpen(false);
                            setEditedResponse(pageContext
                                .insightsQuery
                                .queryResponse);
                        }}
                        leftSection={<IconEdit size={14} />}>
                        Make changes
                    </Button>
                </Group>
            </Stack>
        </Paper>
    );
};

export default QuickFactsBox;

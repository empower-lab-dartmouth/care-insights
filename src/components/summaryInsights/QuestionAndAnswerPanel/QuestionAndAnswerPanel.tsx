/* eslint-disable require-jsdoc */
import React, { useContext, useState } from 'react';
import {
    pageContextState,
    queriesForCurrentCGState
} from '../../../state/recoil';
import Paper from '@mui/material/Paper';
import { useRecoilState } from 'recoil';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SuggestedText from '../SuggestedText/SuggestedText';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import { QueryRecord } from '../../../state/queryingTypes';
import { askQuery, respondToApprovalFeedback } from '../../../state/querying';
import { AuthContext } from '../../../state/context/auth-context';

const QuestionAndAnswerPanel: React.FC = () => {
    const [pageContext, setPageContext] = useRecoilState(pageContextState);
    const { currentUser } = useContext(AuthContext);
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
    const [editingQuery, setEditingQuery] = useState(
        pageContext.insightsQuery.query);
    const handleLocalQueryResponse = (q: QueryRecord) => {
        setQueries({
            ...queries,
            [q.query]: q
        });
        setPageContext({
            ...pageContext,
            insightsQuery: q
        });
        setEditingQuery(q.query);
    };
    const makeQuery = async (q: string) => {
        setLoadingResponse(true);
        await askQuery(q, handleLocalQueryResponse,
            pageContext.selectedCRProgramEvents,
            currentUser?.email as string,
            pageContext.selectedCR, queries);
        setLoadingResponse(false);
    };

    const submitApprovalFeedback = async () => {
        setLoadingResponse(true);
        const approvedQuery = {
            ...pageContext.insightsQuery,
            dateApproved: (new Date()).getTime()
        };
        await respondToApprovalFeedback(
            approvedQuery);
        setPageContext({
            ...pageContext,
            insightsQuery: approvedQuery,
        });
        setQueries({
            ...queries,
            [approvedQuery.query]: approvedQuery
        });
        setLoadingResponse(false);
    };
    const queryModified = pageContext.insightsQuery.query !== editingQuery;
    return (
        <>
            <Paper elevation={1}
                sx={{
                    padding: '12px'
                }}>
                <TextField
                    id="standard-multiline-static"
                    label="Ask a question"
                    multiline
                    sx={{
                        'width': '100%',
                        'input:focus, textarea:valid': {
                            'outline': 'none',
                            'border': 'none'
                        }
                    }}
                    variant="standard"
                    value={editingQuery}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        if (event.target.value.endsWith('\n')) {
                            makeQuery(editingQuery);
                        } else {
                            setEditingQuery(event.target.value);
                        }
                    }}
                />
                <SuggestedText textSuggestions={pageContext.suggestedQueries}
                    onSelected={(option) => {
                        setEditingQuery(option.query);
                        makeQuery(option.query);
                    }}
                />
                <Button variant="contained"
                    sx={{ width: '100%' }} color="success"
                    startIcon={<SearchIcon />} onClick={() => {
                        makeQuery(editingQuery);
                    }}>
                    Get insights
                </Button>
                <br />
                <br />
                <Typography variant="h6" gutterBottom>
                    Response:
                </Typography>
                {
                    loadingResponse ? <CircularProgress /> :
                        <Typography variant="body1" gutterBottom>
                            {queryModified ?
                                'Click "Get Insights" when you ' +
                                'finish editing to see results' :
                                pageContext.insightsQuery.queryResponse}
                        </Typography>
                }
                <h1>Feedback</h1>
                {pageContext.insightsQuery.dateApproved !== undefined &&
                    !queryModified ?
                    <p>Approved result</p> : <p>Not approved result</p>}
                <Button onClick={() => submitApprovalFeedback()}>
                    Approve</Button>
                <h2>Debugging purposes: Loaded queries</h2>
                <p>{JSON.stringify(queries)}</p>
            </ Paper >
        </>
    );
};

export default QuestionAndAnswerPanel;

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
import { askQuery } from '../../../state/querying';
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
    };
    const makeQuery = () => {
        setLoadingResponse(true);
        askQuery(editingQuery, handleLocalQueryResponse,
            pageContext.selectedCRProgramEvents,
            currentUser?.email as string,
            pageContext.selectedCR, queries);
        setLoadingResponse(false);
    };

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
                            makeQuery();
                        } else {
                            setEditingQuery(event.target.value);
                        }
                    }}
                />
                <SuggestedText textSuggestions={pageContext.suggestedQueries}
                    onSelected={(option) => {
                        setPageContext({
                            ...pageContext,
                            insightsQuery: option
                        });
                        setEditingQuery(option.query);
                    }}
                />
                <Button variant="contained"
                    sx={{ width: '100%' }} color="success"
                    startIcon={<SearchIcon />} onClick={() => {
                        makeQuery();
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
                            {pageContext.insightsQuery.queryResponse}
                        </Typography>
                }
                <h2>Debugging purposes: Loaded queries</h2>
                <p>{JSON.stringify(queries)}</p>
            </ Paper >
        </>
    );
};

export default QuestionAndAnswerPanel;

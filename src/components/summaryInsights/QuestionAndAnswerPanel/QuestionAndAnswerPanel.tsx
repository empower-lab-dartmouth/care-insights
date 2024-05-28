/* eslint-disable require-jsdoc */
import React, { useState } from 'react';
import { pageContextState } from '../../../state/recoil';
import Paper from '@mui/material/Paper';
import { useRecoilState } from 'recoil';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SuggestedText from '../SuggestedText/SuggestedText';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import { makeQuery } from '../../../state/fetching';

const QuestionAndAnswerPanel: React.FC = () => {
    const [pageContext, setPageContext] = useRecoilState(pageContextState);
    const [loadingResponse, setLoadingResponse] = useState(false);

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
                    value={pageContext.insightsQuery}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        if (event.target.value.endsWith('\n')) {
                            makeQuery(pageContext.insightsQuery,
                                pageContext,
                                setPageContext, setLoadingResponse);
                        } else {
                            setPageContext(({
                                ...pageContext,
                                insightsQuery: event.target.value,
                            }));
                        }
                    }}
                />
                <SuggestedText textSuggestions={pageContext.suggestedQueries}
                    onSelected={(option) => {
                        setPageContext({
                            ...pageContext,
                            insightsQuery: option,
                        });
                        makeQuery(
                            option, pageContext,
                            setPageContext, setLoadingResponse);
                        }}
                />
                <Button variant="contained"
                    sx={{ width: '100%' }} color="success"
                    startIcon={<SearchIcon />} onClick={() => {
                        makeQuery(pageContext.insightsQuery,
                            pageContext, setPageContext,
                            setLoadingResponse);
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
                            {pageContext.insightsResponse}
                        </Typography>
                }
            </ Paper >
        </>
    );
};

export default QuestionAndAnswerPanel;

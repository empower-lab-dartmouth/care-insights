import React, { useContext, useState } from 'react';
import {
  pageContextState,
  queriesForCurrentCGState,
} from '../../../state/recoil';
import Paper from '@mui/material/Paper';
import { useRecoilState } from 'recoil';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SuggestedText from '../SuggestedText/SuggestedText';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { QueryRecord } from '../../../state/queryingTypes';
import {
  askQuery,
  modifyWithFeedback,
  respondToApprovalFeedback,
} from '../../../state/querying';
import { AuthContext } from '../../../state/context/auth-context';
import Chip from '@mui/material/Chip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Stack from '@mui/material/Stack';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EditIcon from '@mui/icons-material/Edit';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import LoopIcon from '@mui/icons-material/Loop';
import CancelIcon from '@mui/icons-material/Cancel';
import WYSIWYGEditor from '../WYSIWYGEditor/WYSIWYGEditor';
import { PageState } from '../../../state/types';
import { delayThenDo } from '../../../state/sampleData';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const inputStyles = {
  'width': '100%',
  'input:focus, input:valid, textarea:valid': {
    outline: 'none',
    border: 'none',
  },
};

const responseChip = (
  loading: boolean,
  queryModified: boolean,
  pageState: PageState,
  alreadyApproved: boolean
) => {
  if (loading || queryModified) {
    return <></>;
  }
  if (pageState.insightsQuery.dateApproved !== undefined) {
    if (alreadyApproved) {
      return (
        <Chip
          icon={<CheckCircleOutlineIcon />}
          color='success'
          label='You approved this'
        />
      );
    } else {
      return (
        <Chip
          icon={<CheckCircleOutlineIcon />}
          color='info'
          label='Someone else approved this'
        />
      );
    }
  }
  return (
    <Chip icon={<WarningAmberIcon />} color='warning' label='AI generated' />
  );
};

const QuestionAndAnswerPanel: React.FC = () => {
  const [pageContext, setPageContext] = useRecoilState(pageContextState);
  const { currentUser } = useContext(AuthContext);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const [editingQuery, setEditingQuery] = useState(
    pageContext.insightsQuery.query
  );
  const [feedbackInputOpen, setFeedbackInputOpen] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [editingDirectly, setEditingDirectly] = useState(false);
  const [editedResponse, setEditedResponse] = useState(
    pageContext.insightsQuery.queryResponse
  );
  const [forceUpdateRequired, setForceUpdateRequired] = useState(false);
  const alreadyApproved =
    pageContext.insightsQuery.dateApproved !== undefined &&
    pageContext.insightsQuery.CGUUID === (currentUser?.email as string);
  const handleLocalQueryResponse = (q: QueryRecord) => {
    setQueries({
      ...queries,
      [q.query]: q,
    });
    setPageContext({
      ...pageContext,
      insightsQuery: q,
    });
    setEditingQuery(q.query);
  };
  const makeQuery = async (q: string) => {
    setLoadingResponse(true);
    setEditingDirectly(false);
    setFeedbackInputOpen(false);
    await askQuery(
      q,
      handleLocalQueryResponse,
      pageContext.selectedCRProgramEvents,
      currentUser?.email as string,
      pageContext.selectedCR,
      queries
    );
    setForceUpdateRequired(true);
    setLoadingResponse(false);
  };

  const updateWithFeedback = async () => {
    setLoadingResponse(true);
    setFeedbackInput('');
    await modifyWithFeedback(
      feedbackInput,
      pageContext.insightsQuery,
      handleLocalQueryResponse,
      pageContext.selectedCRProgramEvents,
      currentUser?.email as string,
      pageContext.selectedCR,
      queries
    );
    setForceUpdateRequired(true);
    setLoadingResponse(false);
  };

  const submitApprovalFeedback = async () => {
    setLoadingResponse(true);
    const approvedQuery = {
      ...pageContext.insightsQuery,
      dateApproved: new Date().getTime(),
      queryResponse: editedResponse,
    };
    await respondToApprovalFeedback(approvedQuery);
    setPageContext({
      ...pageContext,
      insightsQuery: approvedQuery,
    });
    setQueries({
      ...queries,
      [approvedQuery.query]: approvedQuery,
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
  const queryModified = pageContext.insightsQuery.query !== editingQuery;
  return (
    <>
      <Paper
        elevation={1}
        sx={{
          padding: '12px',
        }}
      >
        <Stack direction={'row'}>
          <TextField
            id='standard-multiline-static'
            label='Search Care Insights'
            multiline
            sx={{
              'width': '100%',
              'input:focus, textarea:valid': {
                outline: 'none',
                border: 'none',
              },
            }}
            variant='standard'
            value={editingQuery}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.value.endsWith('\n')) {
                makeQuery(editingQuery);
              } else {
                setEditingQuery(event.target.value);
              }
            }}
          />
          <Button
            variant='contained'
            sx={{ 'max-width': '200px' }}
            color='success'
            startIcon={<SearchIcon />}
            onClick={() => {
              makeQuery(editingQuery);
            }}
          >
            Search
          </Button>
        </Stack>
        <SuggestedText
          textSuggestions={pageContext.suggestedQueries}
          currentText={editingQuery}
          onSelected={async option => {
            console.log('use query string: ' + option.query);
            setEditingQuery(option.query);
            makeQuery(option.query);
          }}
          loadMoreSuggestions={() =>
            setPageContext({
              ...pageContext,
              suggestedQueries: Object.values(queries),
            })
          }
          hasMoreSuggestions={
            pageContext.suggestedQueries.length !==
            Object.values(queries).length
          }
        />
        <br />
        <br />
        <Stack direction={'row'}>
          <Typography variant='h6' gutterBottom>
            Response:
          </Typography>
          {responseChip(
            loadingResponse,
            queryModified,
            pageContext,
            alreadyApproved
          )}
        </Stack>
        <WYSIWYGEditor
          loading={loadingResponse}
          readOnly={!editingDirectly}
          update={forceUpdateRequired}
          updateCallback={f => {
            setEditedResponse(pageContext.insightsQuery.queryResponse);
            setForceUpdateRequired(false);
            f();
          }}
          defaultMessage='Type in a question above and click "get insights"'
          showDefaultMessage={editingQuery !== pageContext.insightsQuery.query}
          markdown={editedResponse}
          onChange={setEditedResponse}
        />
        {queryModified ? (
          <></>
        ) : (
          <>
            <Typography variant='h6' gutterBottom>
              Our AI learns from your feedback! Please improve the model with a
              review:
            </Typography>
            {feedbackInputOpen ? (
              <TextField
                id='outlined-basic'
                label='Include more detail about...'
                multiline
                value={feedbackInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setFeedbackInput(event.target.value);
                }}
                sx={inputStyles}
              />
            ) : (
              <></>
            )}
            <Stack direction={'row'}>
              {alreadyApproved && !editingDirectly ? (
                <></>
              ) : (
                <Button
                  startIcon={<ThumbUpIcon color='success' />}
                  onClick={approve}
                >
                  This is helpful{' '}
                </Button>
              )}
              {feedbackInputOpen ? (
                <Button
                  startIcon={<LoopIcon />}
                  disabled={feedbackInput === ''}
                  onClick={updateWithFeedback}
                >
                  Update response to incoprorate feedback
                </Button>
              ) : (
                <></>
              )}
              {feedbackInputOpen || editingDirectly ? (
                <Button
                  startIcon={<CancelIcon />}
                  onClick={() => {
                    setFeedbackInput('');
                    setEditedResponse(pageContext.insightsQuery.queryResponse);
                    setEditingQuery(pageContext.insightsQuery.query);
                    setEditingDirectly(false);
                    setFeedbackInputOpen(false);
                  }}
                >
                  Cancel{' '}
                </Button>
              ) : (
                <></>
              )}
            </Stack>
            <Stack direction={'row'}>
              <Button
                startIcon={<EditIcon />}
                disabled={editingDirectly}
                onClick={() => {
                  setEditingDirectly(true);
                  setFeedbackInputOpen(false);
                  setFeedbackInput('');
                  setEditedResponse(pageContext.insightsQuery.queryResponse);
                }}
              >
                Let me just fix something...{' '}
              </Button>
              <Button
                startIcon={<ChatBubbleIcon />}
                disabled={feedbackInputOpen}
                onClick={() => {
                  setFeedbackInput('');
                  setEditingDirectly(false);
                  setEditingQuery(pageContext.insightsQuery.query);
                  setEditedResponse(pageContext.insightsQuery.queryResponse);
                  setFeedbackInputOpen(true);
                }}
              >
                Suggest changes...{' '}
              </Button>
            </Stack>
          </>
        )}
      </Paper>
    </>
  );
};

export default QuestionAndAnswerPanel;

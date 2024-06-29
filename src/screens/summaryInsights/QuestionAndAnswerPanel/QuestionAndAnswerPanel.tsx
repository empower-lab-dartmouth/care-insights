import React, { useContext, useState } from 'react';
import {
  pageContextState,
  queriesForCurrentCGState,
} from '../../../state/recoil';
import { useRecoilState } from 'recoil';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SuggestedText from '../SuggestedText/SuggestedText';
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
import SearchBox from './SearchBox';

import { Title, Text, Paper, Button, TextInput, Textarea } from '@mantine/core';
import { IconThumbUp, IconX } from '@tabler/icons-react';

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
      return <Text className='text-green-600 italic'>(Approved by you)</Text>;
    } else {
      return (
        <Text className='text-primary italic'>(Approved by someone else)</Text>
      );
    }
  }
  return <Text className='text-orange-600 italic'>(AI generated)</Text>;
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
      queries,
      false
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
    <div className='relative min-h-[82vh]'>
      <Paper className='mt-[30px] border border-gray-200' p='lg'>
        {editingQuery && (
          <div className='flex flex-col gap-2'>
            <Title order={5}>Question:</Title>
            <Text>{editingQuery}</Text>
          </div>
        )}

        {editedResponse && (
          <div className='mt-4'>
            <div className='flex gap-3'>
              <Title order={5}>Response:</Title>
              {responseChip(
                loadingResponse,
                queryModified,
                pageContext,
                alreadyApproved
              )}
            </div>
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
              showDefaultMessage={
                editingQuery !== pageContext.insightsQuery.query
              }
              markdown={editedResponse}
              onChange={setEditedResponse}
            />
          </div>
        )}
        {queryModified ? (
          <></>
        ) : (
          <>
            <Title order={5}>Help us:</Title>
            <Text>
              Our AI learns from your feedback! Please improve the model with a
              review:
            </Text>
            {feedbackInputOpen ? (
              <Textarea
                id='outlined-basic'
                label='Include more detail about...'
                value={feedbackInput}
                className='mt-3'
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setFeedbackInput(event.target.value);
                }}
              />
            ) : (
              <></>
            )}
            <div className='flex gap-4 mt-3'>
              {alreadyApproved && !editingDirectly ? (
                <></>
              ) : (
                <Button
                  leftSection={<IconThumbUp className='text-green-600' />}
                  onClick={approve}
                  variant='outline'
                  className='text-green-600 hover:text-green-600 border-green-600'
                  size='xs'
                >
                  This is helpful{' '}
                </Button>
              )}
              {feedbackInputOpen ? (
                <Button
                  leftSection={<LoopIcon />}
                  disabled={feedbackInput === ''}
                  variant='outline'
                  onClick={updateWithFeedback}
                  size='xs'
                >
                  Update response to incoprorate feedback
                </Button>
              ) : (
                <></>
              )}
              {feedbackInputOpen || editingDirectly ? (
                <Button
                  leftSection={<IconX className='red-red-600' />}
                  color='red'
                  variant='outline'
                  size='xs'
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
              <Button
                leftSection={<EditIcon />}
                disabled={editingDirectly}
                variant='outline'
                size='xs'
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
                leftSection={<ChatBubbleIcon />}
                disabled={feedbackInputOpen}
                variant='outline'
                size='xs'
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
            </div>
            <Stack direction={'row'}></Stack>
          </>
        )}
      </Paper>
      <div className='absolute w-full bottom-0 flex flex-col gap-6'>
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
        <SearchBox
          value={editingQuery}
          onSearch={() => makeQuery(editingQuery)}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (event.target.value.endsWith('\n')) {
              makeQuery(editingQuery);
            } else {
              setEditingQuery(event.target.value);
            }
          }}
        />
      </div>
    </div>
  );
};

export default QuestionAndAnswerPanel;

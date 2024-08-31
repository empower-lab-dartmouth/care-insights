import React, { useContext, useEffect, useState } from 'react';
import Nav from '../nav/NavBar';
import './summaryInsights.css';
import QuestionAndAnswerPanel from './QuestionAndAnswerPanel/QuestionAndAnswerPanel';
import CommonCRActions from '../nav/CommonCRActions/CommonCRActions';
import {
  NO_CR_SELECTED,
  careRecipientsInfoState,
  extededAttributesState,
  pageContextState,
  queriesForCurrentCGState,
  selectedCRState,
} from '../../state/recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import CircularProgress from '@mui/material/CircularProgress';
import UserShell from '../../components/UserShell';
import {
  Image,
  Text,
  Grid,
  Group,
  Stack,
  Paper,
  Title,
  Center,
  Button,
  Chip,
  Pill,
  Textarea,
  Card,
  Divider,
} from '@mantine/core';
import WYSIWYGEditor from './WYSIWYGEditor/WYSIWYGEditor';

import { AuthContext } from '../../state/context/auth-context';
import { QueryRecord } from '../../state/queryingTypes';
import {
  askQuery,
  modifyWithFeedback,
  respondToApprovalFeedback,
} from '../../state/querying';
import { delayThenDo } from '../../state/sampleData';
import {
  IconCheck,
  IconAlertTriangle,
  IconX,
  IconEdit,
  IconInfoCircle,
  IconThumbUp,
  IconArrowBounce,
} from '@tabler/icons-react';
import { PageState, Reviews } from '../../state/types';
import { Divide, List, Smile, TriangleAlert } from 'lucide-react';

import '@mdxeditor/editor/style.css';
import { generateQuickFactsQueries, loadCRData, sampleAvoidQuery, sampleDoQuery, sampleRedirectQuery, sampleSymptomsQuery } from '../../state/fetching';
import { reportTrackingEvent } from '../../state/tracking';
import { setRemoteQueryRecord } from '../../state/setting';

export const LOADING_STRING = 'Loading...';

type QuickFactsBoxProps = {
  type: 'avoid' | 'do' | 'symptom' | 'redirection';
};

const title = ({ type }: QuickFactsBoxProps) => {
  switch (type) {
    case 'avoid':
      return 'Avoid';
    case 'do':
      return 'Do';
    case 'redirection':
      return 'Redirection';
    case 'symptom':
      return 'Symptoms';
  }
};

export const responseChip = (loading: boolean, alreadyApproved: boolean) => {
  if (loading) {
    return <></>;
  }
  if (!alreadyApproved) {
    return <Pill c={'red'}>AI generated</Pill>;
  }
  return <Pill c={'darkGrey'}>Caregiver reviewed</Pill>;
};

const QuickFactsBoxInner: React.FC<QuickFactsBoxProps> = props => {
  const { type } = props;
  const { currentUser } = useContext(AuthContext);
  // const { currentUser } = useContext(AuthContext);
  const [temp, setTemp] = useRecoilState(selectedCRState);
  const [pageContext, setPageContext] = useRecoilState(pageContextState);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const [editingDirectly, setEditingDirectly] = useState(false);
  const careRecipientsInfo = useRecoilValue(careRecipientsInfoState);
  const CRName = careRecipientsInfo[pageContext.selectedCR] ? careRecipientsInfo[pageContext.selectedCR].name : 'Care recipient';
  const caregiverId = currentUser !== null && currentUser.email !== null ? currentUser.email : pageContext.username;
  const queryRecordQuery =
    type === 'do'
      ? sampleDoQuery(CRName)
      : type === 'avoid'
        ? sampleAvoidQuery(CRName)
        : type === 'redirection'
          ? sampleRedirectQuery(CRName)
          : sampleSymptomsQuery(CRName);
  const queryRecord = queries[queryRecordQuery];
  // console.log(queries);
  // console.log(queryRecordQuery);
  // console.log('query record query');
  const setQueryRecord = (q: QueryRecord) => {
    setQueries({
      ...queries,
      [q.query]: q,
    });
  };
  const [editedResponse, setEditedResponse] = useState(
    queryRecord.queryResponse
  );
  const alreadyApproved = queryRecord.dateApproved !== undefined;

  const submitApprovalFeedback = async () => {
    setLoadingResponse(true);
    const approvedQuery: QueryRecord = {
      ...queryRecord,
      dateApproved: new Date().getTime(),
      queryResponse: editedResponse,
    };
    await respondToApprovalFeedback(approvedQuery);
    setQueryRecord(approvedQuery);
    setLoadingResponse(false);
  };
  const approve = () => {
    reportTrackingEvent({
      type: editingDirectly ? 'saved-query' : `useful-query`,
      query: queryRecord
    }, caregiverId, pageContext);
    submitApprovalFeedback();
    setEditingDirectly(false);
  };

  const icon = (t: 'avoid' | 'do' | 'symptom' | 'redirection') => {
    if (t === 'avoid') {
      return <TriangleAlert color='red' size={26} />
    }
    if (t === 'do') {
      return <Smile color='green' size={26} />
    }
    if (t === 'redirection') {
      return <IconArrowBounce size={26} />
    }
    return <List size={26} />
  }
  return (
    <Card className='mt-[30px] border border-gray-100 ' shadow='xs' p={0}>
      <Stack style={{ minHeight: 300 }}>
        <Group justify='flex-end' h={'auto'}>
          {responseChip(loadingResponse, alreadyApproved)}
        </Group>
        <div className='flex items-center gap-2' style={{ paddingLeft: 10 }}>

          {icon(type)}
          <Title order={3} c={type == 'avoid' ? 'red' : 'dark'}>
            {title(props)}
          </Title>
        </div>
        <div>
          <div className='px-4 pb-2 flex justify-between'>
            <Stack align='flex-end' justify='flex-end'>
              {/* <Group justify='flex-end' h={'auto'}>
                {
                  alreadyApproved && !editingDirectly ?
                    <Button
                      variant='transparent'
                      onClick={approve}
                      disabled={alreadyApproved && !editingDirectly}
                      leftSection={<IconCheck color='green' size={14} />}
                    >
                      {alreadyApproved && !editingDirectly ? 'Useful' : 'Useful?'}
                    </Button>
                    :
                    <Button
                      leftSection={<IconThumbUp className='text-green-600' />}
                      onClick={approve}
                      variant='outline'
                      className='text-green-600 hover:text-green-600 border-green-600'
                      size='xs'
                    >
                      {editingDirectly ? 'Save' : 'Useful?'}
                    </Button>
                }

                {editingDirectly ? (
                  <Button
                    variant='transparent'
                    onClick={() => {
                      reportTrackingEvent({
                        type: `cancel-query-edit`,
                        query: queryRecord
                      }, caregiverId, pageContext);
                      if (queries[queryRecord.query] !== undefined) {
                        setEditedResponse(
                          queries[queryRecord.query].queryResponse
                        );
                      }
                      setEditingDirectly(false);
                    }}
                    leftSection={<IconX size={14} />}
                  >
                    Cancel{' '}
                  </Button>
                ) : (
                  <></>
                )}
                <Button
                  variant='transparent'
                  disabled={editingDirectly}
                  onClick={() => {
                    reportTrackingEvent({
                      type: `incorrect-query`,
                      query: queryRecord
                    }, caregiverId, pageContext);
                    setEditingDirectly(true);
                    // setEditedResponse(pageContext.insightsQuery.queryResponse);
                  }}
                  leftSection={<IconEdit size={14} />}
                >
                  Incorrect feedback
                </Button>
                <Button
                  variant='transparent'
                  disabled={editingDirectly}
                  onClick={() => {
                    reportTrackingEvent({
                      type: `incomplete-query`,
                      query: queryRecord
                    }, caregiverId, pageContext);
                    setEditingDirectly(true);
                    // setEditedResponse(pageContext.insightsQuery.queryResponse);
                  }}
                  leftSection={<IconEdit size={14} />}
                >
                  Incomplete feedback
                </Button>
                <Button
                  variant='transparent'
                  disabled={editingDirectly}
                  onClick={() => {
                    reportTrackingEvent({
                      type: `update-query`,
                      query: queryRecord
                    }, caregiverId, pageContext);
                    setEditingDirectly(true);
                    // setEditedResponse(pageContext.insightsQuery.queryResponse);
                  }}
                  leftSection={<IconEdit size={14} />}
                >
                  Improve feedback
                </Button>
              </Group> */}
            </Stack>
          </div>
          <Divider />
        </div>

        <div className='px-6 pt-2 pb-8'>
          {!editingDirectly ? (
            <WYSIWYGEditor
              updateRating={(key, value) => {
                if (value === undefined) {
                  return;
                } else {
                  const getRating: () => Reviews = () => {
                    if (queryRecord.reviews === undefined) {
                      return {
                        'infoIsActionable': 'N/A',
                        'infoIsCorrect': 'N/A',
                        'infoIsMissing': 'N/A',
                      }
                    } else {
                      if (queryRecord.reviews[currentUser?.email as string] === undefined) {
                        return {
                          'infoIsActionable': 'N/A',
                          'infoIsCorrect': 'N/A',
                          'infoIsMissing': 'N/A',
                        }
                      } else {
                        return queryRecord.reviews[currentUser?.email as string];
                      }
                    }
                  };
                  const currentReviews = queryRecord.reviews === undefined ? {} : queryRecord.reviews;
                  const updatedUserReview: Reviews = {
                    ...getRating(),
                    [key]: value,
                  };
                  const newQuery: QueryRecord = {
                    ...queryRecord,
                    reviews: {
                      ...currentReviews,
                      [currentUser?.email as string]: updatedUserReview,
                    },
                  };
                  setRemoteQueryRecord(newQuery);
                  reportTrackingEvent({
                    type: 'update-rating-for-query',
                    query: newQuery
                  }, currentUser?.email as string, pageContext);
                  setQueries({
                    ...queries,
                    [queryRecord.query]: newQuery
                  });
                }
              }}
              hideFeedback={false}
              readOnly={true}
              markdown={editedResponse}
              loading={false}
              showDefaultMessage={false}
              defaultMessage={''}
              update={false}
              onChange={(t: string) => { }}
              updateCallback={() => { }}
              longform={false}
              query={queryRecord}
            />
            // <Text
            //   style={{
            //     'white-space': 'pre-wrap',
            //   }}
            //   fz='sm'
            //   lh='md'
            // >
            //   {editedResponse}
            // </Text>
          ) : (
            <WYSIWYGEditor
              updateRating={(key, value) => {
                if (value === undefined) {
                  return;
                } else {
                  const getRating: () => Reviews = () => {
                    if (queryRecord.reviews === undefined) {
                      return {
                        'infoIsActionable': 'N/A',
                        'infoIsCorrect': 'N/A',
                        'infoIsMissing': 'N/A',
                      }
                    } else {
                      if (queryRecord.reviews[currentUser?.email as string] === undefined) {
                        return {
                          'infoIsActionable': 'N/A',
                          'infoIsCorrect': 'N/A',
                          'infoIsMissing': 'N/A',
                        }
                      } else {
                        return queryRecord.reviews[currentUser?.email as string];
                      }
                    }
                  };
                  const currentReviews = queryRecord.reviews === undefined ? {} : queryRecord.reviews;
                  const updatedUserReview: Reviews = {
                    ...getRating(),
                    [key]: value,
                  };
                  const newQuery: QueryRecord = {
                    ...queryRecord,
                    reviews: {
                      ...currentReviews,
                      [currentUser?.email as string]: updatedUserReview,
                    },
                  };
                  setRemoteQueryRecord(newQuery);
                  reportTrackingEvent({
                    type: 'update-rating-for-query',
                    query: newQuery
                  }, currentUser?.email as string, pageContext);
                  setQueries({
                    ...queries,
                    [queryRecord.query]: newQuery
                  });
                }
              }}
              readOnly={false}
              hideFeedback={false}
              markdown={editedResponse}
              loading={false}
              showDefaultMessage={false}
              defaultMessage={''}
              update={false}
              onChange={setEditedResponse}
              updateCallback={() => { }}
              longform={false}
              query={queryRecord}
            />
          )}
        </div>
      </Stack>
    </Card>
  );
};

const QuickFactsBox: React.FC<QuickFactsBoxProps> = props => {
  const { type } = props;
  // const { currentUser } = useContext(AuthContext);
  const [pageContext, setPageContext] = useRecoilState(pageContextState);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const careRecipientsInfo = useRecoilValue(careRecipientsInfoState);
  const CRName = careRecipientsInfo[pageContext.selectedCR] ? careRecipientsInfo[pageContext.selectedCR].name : 'Care recipient';
  const extendedAttributes = useRecoilValue(extededAttributesState);
  const { currentUser } = useContext(AuthContext);
  const caregiverId = currentUser !== null && currentUser.email !== null ? currentUser.email : pageContext.username;
  const queryRecordQuery =
    type === 'do'
      ? sampleDoQuery(CRName)
      : type === 'avoid'
        ? sampleAvoidQuery(CRName)
        : type === 'redirection'
          ? sampleRedirectQuery(CRName)
          : sampleSymptomsQuery(CRName);
  return (
    <>
      {queries[queryRecordQuery] !== undefined
        ? (
          <QuickFactsBoxInner type={type} />
        ) : (
          <>
            {
              type === 'do' ?
                <>
                  <CircularProgress />
                  If this takes more than several seconds, please <Button style={{ width: 250 }} onClick={async () => {
                    reportTrackingEvent({
                      type: `debugging`,
                      message: 'click here to manually update—QuickFacts.tsx'
                    }, caregiverId, pageContext);
                    const programEvents = Object.values(pageContext.selectedCRProgramEvents).length === 0 ? await loadCRData(
                      pageContext,
                      setPageContext,
                      setQueries,
                      careRecipientsInfo,
                      extendedAttributes[pageContext.selectedCR],
                      true,
                    ) : pageContext.selectedCRProgramEvents;
                    const newPageContext = {
                      ...pageContext,
                      loadingCRInfo: false,
                      selectedCRProgramEvents: programEvents,
                    };
                    setPageContext(newPageContext);
                    await generateQuickFactsQueries(newPageContext, queries, setQueries, setPageContext, CRName, extendedAttributes[pageContext.selectedCR], true);
                    //   setPageContext({
                    //     ...pageContext,
                    //     loadingCRInfo: false,
                    // });
                  }}>click here to manually update.</Button> If that does not work, please refresh the page or log out and log back in again. Thank you for your patience!
                </>
                : <></>
            }
          </>
        )}
    </>
  );
};

export default QuickFactsBox;

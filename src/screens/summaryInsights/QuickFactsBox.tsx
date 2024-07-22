import React, { useContext, useEffect, useState } from 'react';
import Nav from '../nav/NavBar';
import './summaryInsights.css';
import QuestionAndAnswerPanel from './QuestionAndAnswerPanel/QuestionAndAnswerPanel';
import CommonCRActions from '../nav/CommonCRActions/CommonCRActions';
import {
  NO_CR_SELECTED,
  careRecipientsInfoState,
  pageContextState,
  queriesForCurrentCGState,
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
} from '@tabler/icons-react';
import { PageState } from '../../state/types';
import { Divide } from 'lucide-react';

import '@mdxeditor/editor/style.css';

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

const responseChip = (loading: boolean, alreadyApproved: boolean) => {
  if (loading) {
    return <></>;
  }
  if (!alreadyApproved) {
    return <Pill c={'red'}>AI generated</Pill>;
  }
  return <></>;
};

const QuickFactsBoxInner: React.FC<QuickFactsBoxProps> = props => {
  const { type } = props;
  // const { currentUser } = useContext(AuthContext);
  const [pageContext, setPageContext] = useRecoilState(pageContextState);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const [editingDirectly, setEditingDirectly] = useState(false);
  const queryRecordQuery =
    type === 'do'
      ? pageContext.doQuery
      : type === 'avoid'
      ? pageContext.avoidQuery
      : type === 'redirection'
      ? pageContext.redirectionQuery
      : pageContext.symptomsQuery;
  const queryRecord = queries[queryRecordQuery];
  console.log(queries);
  console.log(queryRecordQuery);
  console.log('query record query');
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
    submitApprovalFeedback();
    setEditingDirectly(false);
  };

  return (
    <Card className='mt-[30px] border border-gray-100 ' shadow='xs' p={0}>
      <Stack style={{ minHeight: 300 }}>
        <Group justify='flex-end' h={'auto'}>
          {responseChip(loadingResponse, alreadyApproved)}
        </Group>
        <div>
          <div className='px-4 pb-2 flex justify-between'>
            <div className='flex items-center gap-2'>
              <IconInfoCircle size={26} />
              <Title order={3} c={type == 'avoid' ? 'red' : 'dark'}>
                {title(props)}
              </Title>
            </div>
            <Stack align='flex-end' justify='flex-end'>
              <Group justify='flex-end' h={'auto'}>
                <Button
                  variant='transparent'
                  onClick={approve}
                  disabled={alreadyApproved && !editingDirectly}
                  leftSection={<IconCheck color='green' size={14} />}
                >
                  {alreadyApproved && !editingDirectly ? 'Endorsed' : 'Endorse'}
                </Button>
                {editingDirectly ? (
                  <Button
                    variant='transparent'
                    onClick={() => {
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
                    setEditingDirectly(true);
                    setEditedResponse(pageContext.insightsQuery.queryResponse);
                  }}
                  leftSection={<IconEdit size={14} />}
                >
                  Make changes
                </Button>
              </Group>
            </Stack>
          </div>
          <Divider />
        </div>

        <div className='px-6 pt-2 pb-8'>
          {!editingDirectly ? (
            <Text
              style={{
                'white-space': 'pre-wrap',
              }}
              fz='sm'
              lh='md'
            >
              {editedResponse}
            </Text>
          ) : (
            <WYSIWYGEditor
              readOnly={false}
              markdown={editedResponse}
              loading={false}
              showDefaultMessage={false}
              defaultMessage={''}
              update={false}
              onChange={setEditedResponse}
              updateCallback={() => {}}
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
  const queryRecordQuery =
    type === 'do'
      ? pageContext.doQuery
      : type === 'avoid'
      ? pageContext.avoidQuery
      : type === 'redirection'
      ? pageContext.redirectionQuery
      : pageContext.symptomsQuery;
  return (
    <>
      {queries[queryRecordQuery] !== undefined ? (
        <QuickFactsBoxInner type={type} />
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default QuickFactsBox;

import React from 'react';
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
  Space,
  Card,
  Avatar,
  Button,
  Title,
} from '@mantine/core';
import QuickFactsBox, { LOADING_STRING } from './QuickFactsBox';
import { QueryRecord } from '../../state/queryingTypes';
import { generateQuickFactsQueries, sampleAvoidQuery, sampleDoQuery, sampleRedirectQuery, sampleSymptomsQuery } from '../../state/fetching';
import { RefreshCcw, RefreshCw } from 'lucide-react';

const QuickInfo = ({ value, label }: { value: string; label: string }) => {
  return (
    <div className='border rounded-md border-dashed p-3 w-[140px] mr-4 mb-4'>
      <Text className='font-semibold text-3xl text-primary'>{value}</Text>
      <Text className='text-gray-500 text-sm mt-1'>{label}</Text>
    </div>
  );
};

const CareInsightsPage = () => {
  const [pageContext, setPageContext] = useRecoilState(pageContextState);
  const careRecipients = useRecoilValue(careRecipientsInfoState);
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const CRName =
    careRecipients[pageContext.selectedCR] !== undefined
      ? careRecipients[pageContext.selectedCR].name
      : 'NONE';

  const quickBoxId = (prompt: string) =>
    `QuickBox  p:${prompt} cr:${pageContext.selectedCR}`;
  const loadingQuery: (prompt: string) => QueryRecord = query => ({
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
    <div className='min-h-screen flex flex-col'>
      <UserShell>
        <div>
          <CommonCRActions page={'snapshot'} />
        <Button onClick={() => {
          const updatedPageContext = {
            ...pageContext,
            doQuery: sampleDoQuery(CRName),
            avoidQuery: sampleAvoidQuery(CRName),
            redirectionQuery: sampleRedirectQuery(CRName),
            symptomsQuery: sampleSymptomsQuery(CRName),
            loadingCRInfo: true,
          };
          setPageContext(updatedPageContext);
          generateQuickFactsQueries(updatedPageContext, queries, setQueries, setPageContext, true);
        }}><RefreshCw size={17} className='mr-1' />Refresh insights</Button>
          {pageContext.loadingCRInfo ? (
            <>
            <CircularProgress />
            If this takes more than twenty seconds, try reloading the web page.
            </>
          ) : pageContext.selectedCR === NO_CR_SELECTED ? (
            <p>No care recipient selected</p>
          ) : (
            <Card
              className='mt-[30px] border border-gray-100'
              shadow='xs'
              p='lg'
            >
              <div className='flex gap-6'>
                <Avatar
                  variant='light'
                  size={120}
                  src={careRecipients[pageContext.selectedCR]?.imageURL}
                  alt='Care recipient image'
                />
                <div className=''>
                  <Title order={4}>{CRName}</Title>
                  {/* <div className='flex-row md:flex pt-4'>
                    {careRecipients[pageContext.selectedCR].infoBox &&
                      careRecipients[pageContext.selectedCR].infoBox.length > 0 ? (
                      careRecipients[pageContext.selectedCR].infoBox.map(i => (
                        <QuickInfo
                          value={i.value}
                          label={i.label}
                          key={i.label + i.value}
                        />
                      ))
                    ) : (
                      <></>
                    )}
                  </div> */}
                </div>
              </div>
            </Card>
          )}
        </div>

        {pageContext.loadingCRInfo ? (
          <CircularProgress /> 
        ) : (
          <>
            {CRName !== 'NONE' ? (
              <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                <QuickFactsBox type='avoid' />
                <QuickFactsBox type='do' />
                <QuickFactsBox type='symptom' />
                <QuickFactsBox type='redirection' />
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </UserShell>
    </div>
  );
};

export default CareInsightsPage;

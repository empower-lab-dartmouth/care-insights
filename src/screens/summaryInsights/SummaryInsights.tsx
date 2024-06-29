import React from 'react';
import Nav from '../nav/NavBar';
import './summaryInsights.css';
import QuestionAndAnswerPanel from './QuestionAndAnswerPanel/QuestionAndAnswerPanel';
import CommonCRActions from '../nav/CommonCRActions/CommonCRActions';
import { NO_CR_SELECTED, pageContextState } from '../../state/recoil';
import { useRecoilValue } from 'recoil';
import CircularProgress from '@mui/material/CircularProgress';
import UserShell from '../../components/UserShell';
import { Paper } from '@mantine/core';

const SummaryInsights = () => {
  const pageContext = useRecoilValue(pageContextState);
  return (
    <UserShell>
      <CommonCRActions page={'care-insights'} />

      <>
        {pageContext.loadingCRInfo ? (
          <CircularProgress />
        ) : pageContext.selectedCR === NO_CR_SELECTED ? (
          <></>
        ) : (
          <QuestionAndAnswerPanel />
        )}
      </>
    </UserShell>
  );
};

export default SummaryInsights;

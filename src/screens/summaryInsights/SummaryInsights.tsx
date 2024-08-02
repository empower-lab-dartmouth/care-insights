import React, { useContext, useEffect } from 'react';
import './summaryInsights.css';
import QuestionAndAnswerPanel from './QuestionAndAnswerPanel/QuestionAndAnswerPanel';
import CommonCRActions from '../nav/CommonCRActions/CommonCRActions';
import { NO_CR_SELECTED, onOpenLoadingState, pageContextState, queriesForCurrentCGState, searchState } from '../../state/recoil';
import { useRecoilState } from 'recoil';
import CircularProgress from '@mui/material/CircularProgress';
import UserShell from '../../components/UserShell';
import { Paper } from '@mantine/core';
import { AuthContext } from '../../state/context/auth-context';
import { loadQueryFromURL } from '../../state/fetching';

const SummaryInsights = () => {
  const { currentUser } = useContext(AuthContext);
  const [pageContext, setPageState] = useRecoilState(pageContextState);
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const [searchURL, setSearchURL] = useRecoilState(searchState);
  const [loading, setLoading] = useRecoilState(onOpenLoadingState);


  useEffect(() => {
    async function fetch() {
      if (currentUser) {
        await loadQueryFromURL(
          pageContext,
          setPageState,
          queries,
          setQueries,
          searchURL
        );
      }
    }

    fetch();
  }, [queries]);
  return (
    <UserShell>
      <CommonCRActions page={'tell-me-more'} />

      <>
        {pageContext.loadingCRInfo ? (
           <>
           <CircularProgress />
           If this takes more than twenty seconds, try reloading the web page.
           </>
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

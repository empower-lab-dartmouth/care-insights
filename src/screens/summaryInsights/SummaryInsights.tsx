import React, { useContext, useEffect } from 'react';
import './summaryInsights.css';
import QuestionAndAnswerPanel from './QuestionAndAnswerPanel/QuestionAndAnswerPanel';
import CommonCRActions from '../nav/CommonCRActions/CommonCRActions';
import { NO_CR_SELECTED, careRecipientsInfoState, extededAttributesState, onOpenLoadingState, pageContextState, queriesForCurrentCGState, searchState } from '../../state/recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import CircularProgress from '@mui/material/CircularProgress';
import UserShell from '../../components/UserShell';
import { Button, Paper } from '@mantine/core';
import { AuthContext } from '../../state/context/auth-context';
import { loadQueryFromURL } from '../../state/fetching';
import { QuickInfo } from './CareInsights';
import { getLoadedQueryFromURL, setLoadedQueryFromURLTrue } from '../../state/globals';

const SummaryInsights = () => {
  const { currentUser } = useContext(AuthContext);
  const [pageContext, setPageState] = useRecoilState(pageContextState);
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const [searchURL, setSearchURL] = useRecoilState(searchState);
  const [loading, setLoading] = useRecoilState(onOpenLoadingState);
  const careRecipientInfo = useRecoilValue(careRecipientsInfoState);
  const CRName = careRecipientInfo[pageContext.selectedCR] ? careRecipientInfo[pageContext.selectedCR].name : 'Care recipient';
  const extendedAttributes = useRecoilValue(extededAttributesState);

  useEffect(() => {
    async function fetch() {
      if (currentUser && getLoadedQueryFromURL()) {
        setLoadedQueryFromURLTrue();
        await loadQueryFromURL(
          pageContext,
          setPageState,
          queries,
          setQueries,
          searchURL,
          CRName,
          extendedAttributes[pageContext.selectedCR]
        );
      }
    }

    fetch();
  }, []);
  return (
    <UserShell>
      <CommonCRActions page={'details'} />

      <>
        {pageContext.loadingCRInfo ? (
           <>
            <CircularProgress />
              If this takes more than several seconds, please <Button style={{width: 250}} onClick={() => {
                setPageState({
                  ...pageContext,
                  loadingCRInfo: false,
              });
              }}>click here to manually update.</Button> If that does not work, please refresh the page or log out and log back in again. Thank you for your patience!
           </>
        ) : pageContext.selectedCR === NO_CR_SELECTED ? (
          <QuickInfo
                        value={'No care recipient selected.'}
                        label={'Please select a care recipient from the box above that says "Select a care recipient"'}
                      />
        ) : (
          <QuestionAndAnswerPanel />
        )}
      </>
    </UserShell>
  );
};

export default SummaryInsights;

import * as React from 'react';

import {
  careRecipientsInfoState,
  extededAttributesState,
  feedbackModalState,
  pageContextState,
  queriesForCurrentCGState,
} from '../../../state/recoil';
import CircularProgress from '@mui/material/CircularProgress';
import { useRecoilState, useRecoilValue } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../../../state/context/auth-context';
import { FeedbackModifier, feedbackModifierOptions, PageState, ProgramEvent } from '../../../state/types';
import { setRemoteProgramEvent, setRemoteQueryRecord } from '../../../state/setting';

import { Textarea, Text, Button, Switch, Select } from '@mantine/core';
import { reportTrackingEvent } from '../../../state/tracking';
import { generateQuickFactsQueries, loadCRData, sampleAvoidQuery, sampleDoQuery, sampleRedirectQuery, sampleSymptomsQuery } from '../../../state/fetching';
import { askQuery } from '../../../state/querying';
import { DEFAULT_BECAUSE_VALUE, formatFeedback } from '../WYSIWYGEditor/WYSIWYGEditor';

const FeedbackModal = ({ close }: { close: () => void }) => {
  const [pageContext, setPageContext] = useRecoilState(pageContextState);
  const { currentUser } = React.useContext(AuthContext);
  const CRInfo = useRecoilValue(careRecipientsInfoState);
  const CRname = CRInfo[pageContext.selectedCR] === undefined ? "the care recipient" : CRInfo[pageContext.selectedCR].name;
  const [feedbackModal, setFeedbackModal] = useRecoilState(feedbackModalState);
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const extendedAttributes = useRecoilValue(extededAttributesState);
  const displayName = extendedAttributes[pageContext.selectedCR] ? extendedAttributes[pageContext.selectedCR].firstName + ' ' + extendedAttributes[pageContext.selectedCR].lastName : CRname;
  const id = uuidv4();
  const [editText, setEditText] = React.useState(false);
  const [modalLoading, setModalLoading] = React.useState(false);
  const becauseDefault = DEFAULT_BECAUSE_VALUE;
  const [becauseText, setBecauseText] = React.useState(becauseDefault);

  const makeQuery = async (regen: boolean) => {
    const programEvents = Object.values(pageContext.selectedCRProgramEvents).length === 0 ? await loadCRData(
      pageContext,
      setPageContext,
      setQueries,
      CRInfo,
      extendedAttributes[pageContext.selectedCR],
      true,
    ) : pageContext.selectedCRProgramEvents;
    const newQuery = await askQuery(
      pageContext.insightsQuery.query,
      () => { },
      programEvents,
      currentUser?.email as string,
      pageContext.selectedCR,
      queries,
      regen,
      displayName,
      extendedAttributes[pageContext.selectedCR],
      true
    );
    setRemoteQueryRecord(newQuery);
    // console.log('the queries are', queries, "our query is: ", newQuery);
    const updatedQueries = {
      ...queries,
      [newQuery.query]: newQuery,
    };
    setQueries(updatedQueries);
    setPageContext({
      ...pageContext,
      loadingCRInfo: false,
      selectedCRProgramEvents: programEvents,
      insightsQuery: newQuery,
    });
    // console.log('made it here', newQuery, pageContext);
    // setForceUpdateRequired(true);
  };

  const submit = async () => {
    if (feedbackModal === false) {
      close();
      return;
    }
    setModalLoading(true);
    console.log('update page context');
    const feedback = editText ? feedbackModal.feedback : await formatFeedback(feedbackModal.targetContent, feedbackModal.feedbackType, feedbackModal.query.query, feedbackModal.modifier, becauseText);
    const newProgramEvent: ProgramEvent = {
      type: feedbackModal.feedbackType,
      query: feedbackModal.query,
      date: new Date().getTime(),
      label: 'Feedback',
      uuid: id,
      redirection: 'na',
      engagement: 'na',
      CGUUID: currentUser?.email as string,
      CRUUID: pageContext.selectedCR,
      description: feedback,
    };
    // console.log(newProgramEvent);
    reportTrackingEvent({
      type: 'feedback-created',
      event: newProgramEvent,
      query: feedbackModal.query,
    }, currentUser?.email as string, pageContext);
    setRemoteProgramEvent(newProgramEvent);
    const newPageContext: PageState = {
      ...pageContext,
      loadingCRInfo: true,
      selectedCRProgramEvents: {
        ...pageContext.selectedCRProgramEvents,
        [id]: newProgramEvent,
      },
      addEventModalOpen: false,
    };
    setPageContext(newPageContext);
    const displayName = extendedAttributes !== undefined ? extendedAttributes.firstName + ' ' + extendedAttributes.lastName : CRname;
    if (feedbackModal.feedbackType === 'details-feedback') {
      await makeQuery(true);
    } else {
      await generateQuickFactsQueries(newPageContext, queries, setQueries, setPageContext, CRname, extendedAttributes[pageContext.selectedCR], true);
    }
    close();
    setPageContext({
      ...newPageContext,
      loadingCRInfo: false,
      doQuery: sampleDoQuery(CRname),
      avoidQuery: sampleAvoidQuery(CRname),
      redirectionQuery: sampleRedirectQuery(CRname),
      symptomsQuery: sampleSymptomsQuery(CRname),
    });
  };
  return (
    <>
      {modalLoading ? <CircularProgress /> :
        <>{feedbackModal === false ? <>Error submitting feedback. Please close this dialog.</> :
          <div>
            <Text className='text-sm'>
              {' '}
              {' '}
              More information will help our A.I. provide better responses. Specific details about {displayName} are especially helpful.
            </Text>
            <Switch
              checked={!editText}
              label={'Simple response'}
              onChange={(event) => setEditText(!editText)}
            />
            <br />
            {editText ?
              <>
                <Button variant={'light'} onClick={() => {
                  setFeedbackModal({
                    ...feedbackModal,
                    feedback: '',
                  });
                }}>Clear feedback</Button>
                <Button variant={'light'} onClick={async () => {
                  setFeedbackModal({
                    ...feedbackModal,
                    feedback: await formatFeedback(feedbackModal.targetContent, feedbackModal.feedbackType, feedbackModal.query.query, feedbackModal.modifier, becauseText),
                  });
                }}>Suggest feedback</Button>
                <Textarea
                  label='More nuanced, specific feedback will improve the A.I. feedback.'
                  className='mt-3'
                  rows={6}
                  value={feedbackModal.feedback}
                  onChange={(event) => {
                    setFeedbackModal({
                      ...feedbackModal,
                      feedback: event.target.value
                    });
                  }}
                /></> : <>
                <Text style={{ color: 'darkgray' }}>I think that the content {feedbackModal.feedbackType === 'details-feedback' ? ' here is: ' : '"' + feedbackModal.targetContent + '" is: '}</Text>
                <Select
                  style={{ color: 'blue', fontWeight: 'bold' }}
                  value={feedbackModal.modifier}
                  onChange={(v) => {
                    if (v !== null && (feedbackModifierOptions as string[]).indexOf(v) !== -1) {
                      setFeedbackModal({
                        ...feedbackModal,
                        modifier: v as FeedbackModifier,
                      });
                    }
                  }}
                  data={feedbackModifierOptions}
                />
                <Textarea
              label='Provide some details please:'
              className='mt-3'
              rows={6}
              value={becauseText}
              onChange={(event) => {
                setBecauseText(event.target.value);
              }}
            />
              </>}
            <p>You can always edit or delete your feedback to the A.I. using the program events table.</p>
            <Button disabled={feedbackModal.feedback === '' && editText} onClick={submit} className='w-full mt-3'>
              Submit
            </Button>
          </div>}</>}
    </>
  );
};

export default FeedbackModal;

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

import { Textarea, Text, Button, Switch, Select, Stack, SegmentedControl, Center } from '@mantine/core';
import { reportTrackingEvent } from '../../../state/tracking';
import { generateQuickFactsQueries, loadCRData, sampleAvoidQuery, sampleDoQuery, sampleRedirectQuery, sampleSymptomsQuery } from '../../../state/fetching';
import { PromptReponse, askQuery, getNegativeFeedbackPrompts, getPositivePrompts } from '../../../state/querying';
import { DEFAULT_BECAUSE_VALUE } from '../WYSIWYGEditor/WYSIWYGEditor';

const inputStyles = {
  'inner': {
      'whiteSpace': 'normal',
  }
};

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
  // const becauseDefault = DEFAULT_BECAUSE_VALUE;
  const [customText, setCustomText] = React.useState('');
  const [prompts, setPrompts] = React.useState<PromptReponse[]>([])
  const [selectedPrompt, setSelectedPrompt] = React.useState('');

  React.useEffect(() => {
    async function fetch() {
      if (feedbackModal === false) {
        setPrompts([]);
      } else {
        if (prompts.length === 0) {
          if (feedbackModal.modifier === 'useful') {
            const r = await getPositivePrompts(feedbackModal, displayName);
            setPrompts(r);
            setSelectedPrompt(r[0].value);
          } else {
            const r = await getNegativeFeedbackPrompts(feedbackModal, displayName);
            setPrompts(r);
            setSelectedPrompt(r[0].value);
          }
        }
      }
    }

    fetch();
  }, [feedbackModal, prompts]);

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
    const i = prompts.map((p) => p.value).indexOf(selectedPrompt as FeedbackModifier);
    const feedback = selectedPrompt === 'custom' || i === -1 ? {value: 'custom', label: customText} : prompts[i];
    if (feedback.label === '') {
      close();
      return;
    }
    const newProgramEvent: ProgramEvent = {
      type: feedbackModal.feedbackType,
      content: {
        ...feedbackModal,
        feedback: feedback.label,
        modifier: feedback.value as FeedbackModifier,
      },
      date: new Date().getTime(),
      label: 'Feedback',
      uuid: id,
      redirection: 'na',
      engagement: 'na',
      CGUUID: currentUser?.email as string,
      CRUUID: pageContext.selectedCR,
      description: feedback.label,
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
    <div>
      {modalLoading || prompts.length === 0 ? <CircularProgress /> :
        <>{feedbackModal === false ? <>Error submitting feedback. Please close this dialog.</> :
          <div>
            <Center>
              <Text className='text-sm' style={{color: 'darkgray'}}>
                Tell the A.I. something about {displayName}.
                Then, it will get smarter over time.<br /><br />
                </Text>
                </Center>
                <Center><Text className='text-sm' style={{color: 'darkgray'}}>
                <b>Which statement about {displayName} is most correct?</b>
              </Text>
            </Center>
            <Stack>
              <SegmentedControl
                styles={{
                  label: { 'whiteSpace': 'normal'}
                }}
                orientation="vertical"
                fullWidth
                color="green"
                style={inputStyles}
                value={selectedPrompt}
                onChange={setSelectedPrompt}
                data={prompts}
              />
              {selectedPrompt === 'custom' ?
                <Textarea
                  label='What should the A.I. know? What should the correct answer be? Or what should it avoid? Be specific.'
                  className='mt-3'
                  rows={4}
                  value={customText}
                  onChange={(event) => {
                    setCustomText(event.target.value);
                  }}
                /> : <></>}
              <Center>
                <Text style={{ color: 'darkgray' }}>You can always edit or delete your feedback to the A.I. using the program events table.<br />After you submit, you need to <b>click "Regenerate feedback"</b> on the top left of the page to update the snapshot.</Text>
              </Center>
              <Button disabled={feedbackModal.feedback === '' && editText} onClick={submit} className='w-full mt-3'>
                Submit
              </Button>
            </Stack>
          </div>}</>}
    </div>
  );
};

export default FeedbackModal;

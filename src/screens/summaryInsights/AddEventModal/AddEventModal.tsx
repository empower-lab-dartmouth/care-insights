import * as React from 'react';

import {
  careRecipientsInfoState,
  pageContextState,
} from '../../../state/recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../../../state/context/auth-context';
import { ProgramEvent } from '../../../state/types';
import { setRemoteProgramEvent } from '../../../state/setting';

import { Textarea, Text, Button } from '@mantine/core';

const AddEvent = ({ close }: { close: () => void }) => {
  const [pageContext, setPageContext] = useRecoilState(pageContextState);
  const { currentUser } = React.useContext(AuthContext);
  const CRInfo = useRecoilValue(careRecipientsInfoState);
  const CRname = CRInfo[pageContext.selectedCR].name;
  const [eventDescription, setEventDescription] = React.useState('');

  const id = uuidv4();

  const submit = () => {
    console.log('update page context');
    const newProgramEvent: ProgramEvent = {
      type: 'manual-entry-event',
      date: new Date().getTime(),
      label: 'Note',
      uuid: id,
      redirection: 'na',
      engagement: 'na',
      CGUUID: currentUser?.email as string,
      CRUUID: pageContext.selectedCR,
      description: eventDescription,
    };
    console.log(newProgramEvent);
    setRemoteProgramEvent(newProgramEvent);
    setPageContext({
      ...pageContext,
      selectedCRProgramEvents: {
        ...pageContext.selectedCRProgramEvents,
        [id]: newProgramEvent,
      },
      addEventModalOpen: false,
    });
    console.log(pageContext);
    close();
  };
  return (
    <>
      <div>
        <Text className='text-sm'>
          {' '}
          Record an event for{' '}
          <span className='font-semibold text-sm'>{CRname}</span>.{' '}
        </Text>

        <Textarea
          label='What happened?'
          className='mt-3'
          rows={6}
          value={eventDescription}
          onChange={(event) => {
            setEventDescription(event.target.value);
          }}
        />

        <Button onClick={submit} className='w-full mt-3'>
          Submit
        </Button>
      </div>
    </>
  );
};

export default AddEvent;

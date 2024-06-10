import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {
  careRecipientsInfoState,
  pageContextState
} from '../../../state/recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import Button from '@mui/material/Button';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../../../state/context/auth-context';
import { ProgramEvent } from '../../../state/types';
import { setRemoteProgramEvent } from '../../../state/setting';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const AddEvent: React.FC = () => {
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
      date: (new Date()).getTime(),
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
  };
  return (
    <>
      <Box sx={{ ...style, width: 400 }}>
        <Paper elevation={1}>
          <h2> Record an event for {CRname} </h2>
          <p>After saving, you can edit this further in the table</p>
          <TextField
            id="standard-multiline-static"
            label="What happened?"
            multiline
            sx={{
              'width': '100%',
              'input:focus, input:valid, textarea:valid': {
                'outline': 'none',
                'border': 'none'
              }
            }}
            rows={4}
            value={eventDescription}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEventDescription(event.target.value);
            }}
          />
          <br />
          <Button onClick={submit} sx={{
            width: '100%'
          }}>Submit</Button>
        </ Paper>
      </Box>
    </>
  );
};

export default AddEvent;

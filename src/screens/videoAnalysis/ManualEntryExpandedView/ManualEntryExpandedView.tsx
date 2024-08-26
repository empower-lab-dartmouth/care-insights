import React, { useState } from 'react';
import { FeedbackEvent, ManualEntryEvent, ProgramEvent } from '../../../state/types';
import CommonRowControls from '../CommonRowControls/CommonRowControls';
import SaveIcon from '@mui/icons-material/Save';
import { Stack, TextField } from '@mui/material';
import { Button, Text } from '@mantine/core';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import WYSIWYGEditor from '../../summaryInsights/WYSIWYGEditor/WYSIWYGEditor';
import { defaultQueryManualEntryEvent } from '../../../state/recoil';


const inputStyles = {
  'width': '100%',
  'input:focus, input:valid, textarea:valid': {
    outline: 'none',
    border: 'none',
  },
};

type ManualEntryExpandedViewProps = {
  programEvent: ManualEntryEvent | FeedbackEvent;
  setProgramEvent: (programEvent: ProgramEvent) => void;
};

const ManualEntryExpandedView: React.FC<
  ManualEntryExpandedViewProps
> = props => {
  const { programEvent, setProgramEvent } = props;
  const [localProgramEvent, setLocalProgramEvent] = useState(programEvent);
  const [editing, setEditingState] = useState(false);
  const [message, setMessage] = useState('');
  const setEditing = (v: boolean) => {
    setEditingState(v);
  };
  return (
    <>
      <Stack direction={'row'} spacing={1}>
        <Button
          variant='light'
          size='md'
          color='green'
          disabled={!editing}
          onClick={() => {
            setProgramEvent(localProgramEvent);
            setEditing(false);
            setMessage('Updated!');
            setTimeout(() => {
              setMessage('');
            }, 2000);
          }}
        >
          Save changes{' '}
        </Button>
        <Button
          disabled={!editing}
          variant='light'
          size='md'
          onClick={() => {
            setLocalProgramEvent(programEvent);
            setEditing(false);
            setMessage('Reverted.');
            setTimeout(() => {
              setMessage('');
            }, 2000);
          }}
        >
          Cancel changes{' '}
        </Button>
        <p style={{color: message === 'Updated!' ? 'green' : 'blue'}}>{message}</p>
      </Stack>
      <TextField
        id='outlined-basic'
        multiline
        value={localProgramEvent.description}
        onChange={(
          event: React.ChangeEvent<HTMLInputElement>
        ) => {
          setLocalProgramEvent({
            ...localProgramEvent,
            description: event.target.value,
          });
          setEditingState(programEvent.description !== event.target.value);
        }}
        sx={inputStyles}
      />
    </>
  );
};

export default ManualEntryExpandedView;

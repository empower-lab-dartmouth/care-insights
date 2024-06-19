import React, { useState } from 'react';
import {
  EngagementLevel,
  ProgramEvent,
  RedirectionLevel,
} from '../../../state/types';
import { SelectionChoice } from './Selector';
import { setRemoteProgramEvent } from '../../../state/setting';
import { DateTimePicker } from '@mantine/dates';
import DeleteConfirmModal from './DeleteConfirmationModal';
import SaveIcon from '@mui/icons-material/Save';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { Select, TextInput, Title, Modal, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const inputStyles = {
  'width': '100%',
  'input:focus, input:valid, textarea:valid': {
    outline: 'none',
    border: 'none',
  },
};

const datePickerStyling = {
  'input:focus, input:valid, textarea:valid': {
    outline: 'none',
    border: 'none',
  },
};

const ENGAGEMENT_LEVEL_OPTIONS: SelectionChoice<EngagementLevel>[] = [
  {
    label: 'Low',
    value: 'low',
  },
  {
    label: 'Average',
    value: 'average',
  },
  {
    label: 'High',
    value: 'high',
  },
  {
    label: 'None',
    value: 'none',
  },
  {
    label: 'N/A',
    value: 'na',
  },
];

const REDIRECTION_LEVEL_OPTIONS: SelectionChoice<RedirectionLevel>[] = [
  {
    label: 'Success',
    value: 'success',
  },
  {
    label: 'None',
    value: 'none',
  },
  {
    label: 'Unsuccessful',
    value: 'unsuccessful',
  },
  {
    label: 'N/A',
    value: 'na',
  },
];

type ManualEntryExpandedViewProps = {
  programEvent: ProgramEvent;
  setProgramEvent: (programEvent: ProgramEvent) => void;
};

const CommonRowControls: React.FC<ManualEntryExpandedViewProps> = props => {
  const { programEvent, setProgramEvent } = props;
  const [opened, { open, close }] = useDisclosure(false);

  const [localProgramEvent, setLocalProgramEvent] = useState(programEvent);
  const handleOpen = () => open();
  const handleClose = () => {
    close();
    setTimeout(() => {
      setLocalProgramEvent(programEvent);
    }, 500);
  };

  return (
    <>
      <Button variant='transparent' onClick={handleOpen} size='xs'>
        Key Metrics
      </Button>
      <Modal opened={opened} onClose={close} title='Key Metrics'>
        <div className='flex flex-col gap-3'>
          <TextInput
            label='Event type'
            value={localProgramEvent.label}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setLocalProgramEvent({
                ...localProgramEvent,
                label: event.target.value,
              });
            }}
          />
          <Select
            label='Engagement level'
            data={ENGAGEMENT_LEVEL_OPTIONS}
            onChange={c =>
              setLocalProgramEvent({
                ...localProgramEvent,
                engagement: c as EngagementLevel,
              })
            }
            defaultValue={localProgramEvent.engagement}
          />
          <Select
            label='Redirections'
            data={REDIRECTION_LEVEL_OPTIONS}
            onChange={c =>
              setLocalProgramEvent({
                ...localProgramEvent,
                redirection: c as RedirectionLevel,
              })
            }
            defaultValue={localProgramEvent.redirection}
          />
          <DateTimePicker
            label='Date of event'
            value={dayjs(programEvent.date)}
            onChange={newValue => {
              if (newValue != null) {
                setLocalProgramEvent({
                  ...localProgramEvent,
                  date: newValue.valueOf(),
                });
              }
            }}
          />
        </div>
        <br />
        <div className='flex items-center justify-end gap-2'>
          <DeleteConfirmModal
            deleteAction={() => {
              close();
              setProgramEvent({
                ...programEvent,
                deleted: 'true',
              });
              setRemoteProgramEvent({
                ...programEvent,
                deleted: 'true',
              });
            }}
          />
          <Button
            onClick={() => {
              setRemoteProgramEvent(localProgramEvent);
              setProgramEvent(localProgramEvent);
              handleClose();
            }}
          >
            Save
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CommonRowControls;

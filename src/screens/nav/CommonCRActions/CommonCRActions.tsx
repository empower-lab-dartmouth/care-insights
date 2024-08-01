import React from 'react';
import { Fab, Stack, Typography } from '@mui/material';
import AddEvent from '../../summaryInsights/AddEventModal/AddEventModal';
import AutocompleteCRSearch from '../AutocompleteCRSearch/AutocompleteCRSearch';
import { NO_CR_SELECTED, pageContextState } from '../../../state/recoil';
import { useRecoilState } from 'recoil';
import EditNoteIcon from '@mui/icons-material/EditNote';


// import { setRemoteProgramEvent } from '../../../state/setting';
// import { newMusicProgramEvent } from '../../../state/sampleData';
// import { setRemoteProgramEvent } from '../../../state/setting';

import { Button, Modal, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Plus } from 'lucide-react';
import ShareButton from '../../../components/ShareButton';
import { useLocation } from 'react-router-dom';

type CommonCRActionsProps = {
  page: 'tell-me-more' | 'program-events' | 'care-team' | 'snapshot';
};

function convertToTitleCase(input: string) {
  // Split the string by hyphens
  let words = input.split('-');

  // Capitalize the first letter of each word and join them with a space
  let titleCased = words
    .map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');

  return titleCased;
}

const CommonCRActions: React.FC<CommonCRActionsProps> = ({ page }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { pathname } = useLocation();

  const [pageContext, setPageContext] = useRecoilState(pageContextState);
  const handleOpen = () => {
    setPageContext({
      ...pageContext,
      addEventModalOpen: true,
    });
  };
  const handleClose = () => {
    setPageContext({
      ...pageContext,
      addEventModalOpen: false,
    });
  };

  const AddNewEventButton = () => {
    return (
      <Button
        onClick={open}
        size='sm'
        disabled={pageContext.selectedCR === NO_CR_SELECTED}
      >
        <Plus size={17} className='mr-1' />
        Record event
      </Button>
    );
  };

  return (
    <>
      <div className='flex justify-between flex-col lg:flex-row'>
        <div className='flex justify-between items-start gap-4'>
          <Title order={3}>{convertToTitleCase(page)}</Title>
          <div className='hidden lg:block'>
            <AddNewEventButton />
          </div>
        </div>
        <div className='md:flex items-end justify-between gap-4 pt-5 lg:p-0'>
          <AutocompleteCRSearch />
          <ShareButton
            title='QR code for this page'
            showButton={pathname === '/info'}
          />

          {page === 'program-events' ? (
            <div className='block lg:hidden'>
              <AddNewEventButton />
            </div>
          ) : (
            <></>
          )}
        </div>
        {/* <Button onClick={() =>
                    setRemoteProgramEvent(newMusicProgramEvent(
                        pageContext.selectedCR as string))
                }>Degugging tool: Push sample event</Button> */}
      </div>

      <Modal opened={opened} onClose={close} title='New event'>
        <AddEvent close={close} />
      </Modal>
    </>
  );
};

export default CommonCRActions;

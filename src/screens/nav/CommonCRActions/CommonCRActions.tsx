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
import { CirclePlus } from 'lucide-react';

type CommonCRActionsProps = {
  page: 'care-insights' | 'program-events' | 'care-team';
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

  return (
    <>
      <div className='flex justify-between'>
        <Title order={3}>{convertToTitleCase(page)}</Title>
        <div className='flex items-center gap-4'>
          <AutocompleteCRSearch />
          {page === 'program-events' ? (
            <Button
              onClick={open}
              disabled={pageContext.selectedCR === NO_CR_SELECTED}
            >
              <CirclePlus size={15} className='mr-1' />
              Record new event
            </Button>
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

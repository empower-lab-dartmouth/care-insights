import React from 'react';
import { Button, Fab, Modal, Stack, Typography } from '@mui/material';
import AddEvent from '../../summaryInsights/AddEventModal/AddEventModal';
import AutocompleteCRSearch from '../AutocompleteCRSearch/AutocompleteCRSearch';
import { NO_CR_SELECTED, pageContextState } from '../../../state/recoil';
import { useRecoilState } from 'recoil';
import AddIcon from '@mui/icons-material/Add';
import { setRemoteProgramEvent } from '../../../state/setting';
import { commonProgramEvents } from '../../../state/sampleData';


const CommonCRActions = () => {
    const [pageContext, setPageContext] = useRecoilState(pageContextState);
    const handleOpen = () => {
        setPageContext({
            ...pageContext,
            addEventModalOpen: true
        });
    };
    const handleClose = () => {
        setPageContext({
            ...pageContext,
            addEventModalOpen: false
        });
    };
    return (
        <>
            <Stack direction="row" spacing={2}>
                <Typography variant="h6">
                    Viewing care recepient:
                </Typography>
                <AutocompleteCRSearch />
                <Button onClick={handleOpen}
                disabled={
                        pageContext.selectedCR === NO_CR_SELECTED}>
                    <Fab color="primary" disabled={
                        pageContext.selectedCR === NO_CR_SELECTED}
                        variant="extended">
                        <AddIcon sx={{ mr: 1 }} />
                        Record event
                    </Fab>
                </Button>
                <Button onClick={() =>
                    setRemoteProgramEvent(commonProgramEvents['e2'])
                }>Degugging tool: Push sample event</Button>
            </Stack>
            <Modal
                open={pageContext.addEventModalOpen}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <AddEvent />
            </Modal>
        </>
    );
};

export default CommonCRActions;

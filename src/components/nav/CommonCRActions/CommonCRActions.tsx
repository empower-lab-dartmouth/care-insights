import React from 'react';
import { Button, Fab, Modal, Stack, Typography } from '@mui/material';
import AddEvent from '../../summaryInsights/AddEventModal/AddEventModal';
import AutocompleteCRSearch from '../AutocompleteCRSearch/AutocompleteCRSearch';
import { NO_CR_SELECTED, pageContextState } from '../../../state/recoil';
import { useRecoilState } from 'recoil';
import EditNoteIcon from '@mui/icons-material/EditNote';
// import { setRemoteProgramEvent } from '../../../state/setting';
// import { newMusicProgramEvent } from '../../../state/sampleData';

type CommonCRActionsProps = {
    page: 'care-insights' | 'program-events'
}
const CommonCRActions: React.FC<CommonCRActionsProps> = ({ page }) => {
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
                    Viewing care recipient:
                </Typography>
                <AutocompleteCRSearch />
                {
                    page === 'program-events' ?
                        <Button onClick={handleOpen}
                            disabled={
                                pageContext.selectedCR === NO_CR_SELECTED}>
                            <Fab color="success" disabled={
                                pageContext.selectedCR === NO_CR_SELECTED}
                                variant="extended">
                                <EditNoteIcon sx={{ mr: 1 }} />
                                New event
                            </Fab>
                        </Button> : <></>
                }
                {/* <Button onClick={() =>
                    setRemoteProgramEvent(newMusicProgramEvent())
                }>Degugging tool: Push sample event</Button> */}
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

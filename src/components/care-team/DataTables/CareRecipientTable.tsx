import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRecoilState } from 'recoil';
import { careRecipientsInfoState } from '../../../state/recoil';
import { CareRecipientInfo } from '../../../state/types';
import {
    Backdrop, Button, Fade, Modal,
    TextField, Typography
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';
import { DEFAULT_PROFILE_IMAGE } from '../../../state/sampleData';
import { v4 } from 'uuid';
import { setCareRecipientInfo } from '../../../state/setting';
import CancelIcon from '@mui/icons-material/Cancel';


type CareRecipientTableRows = {
    name: string,
    uuid: string,
    joinedCareInsights: number,
}

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
        'outline': 'none',
        'border': 'none'
    }
};

const columns: GridColDef<CareRecipientTableRows>[] = [
    {
        field: 'name',
        headerName: 'Name',
        width: 200,
    },
    {
        field: 'joinedCareInsights',
        valueGetter: (v, r, c) => (new Date(v)).toString(),
        headerName: 'Joined Care Insights', width: 200
    },
    {
        field: 'uuid',
        headerName: 'Anonomized ID',
        width: 150,
    },
];

const caregiverInfoToRows: (caregiverInfo:
    Record<string, CareRecipientInfo>) =>
    CareRecipientTableRows[] = (c) => Object.values(c)
        .map((x) => ({
            name: x.name,
            uuid: x.uuid,
            joinedCareInsights: x.dateCreated
        }));

const CareRecipientTable: React.FC = () => {
    const [careRecipients, setCareRecipients] = useRecoilState(
        careRecipientsInfoState);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [newProfileName, setNewProfileName] = React.useState('');
    const handleClose = () => {
        setModalOpen(false);
        setTimeout(() => {
            setNewProfileName('');
        }, 500);
    };

    const newCareRecipientInfo: () =>
        CareRecipientInfo = () => ({
            imageURL: DEFAULT_PROFILE_IMAGE,
            name: newProfileName,
            dateCreated: (new Date()).getTime(),
            uuid: v4(),
        });

    const createNew = () => {
        const newCR = newCareRecipientInfo();
        setCareRecipients({
            ...careRecipients,
            [newCR.uuid]: newCR,
        });
        setCareRecipientInfo(
            newCareRecipientInfo());
    };

    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={modalOpen}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title"
                            variant="h6" component="h2">
                            Create a new care recipient profile
                        </Typography>
                        <br />
                        <TextField id="outlined-basic"
                            label="Care recipient name"
                            value={newProfileName}
                            onChange={
                                (event:
                                    React.ChangeEvent<
                                        HTMLInputElement>) => {
                                    setNewProfileName(
                                        event.target.value);
                                }}
                            sx={inputStyles}
                        />
                        <Button startIcon={
                            <AddIcon color='success' />}
                            onClick={
                                () => {
                                    handleClose();
                                    createNew();
                                }}>
                            Create</Button>
                        <Button startIcon={
                            <CancelIcon />}
                            onClick={
                                () => {
                                    handleClose();
                                }}>
                            Cancel</Button>
                    </Box>
                </Fade>
            </Modal >
            <Box sx={{
                maxHeight: 400, width: '100%',
                backgroundColor: 'white'
            }}>
                <Button startIcon={
                    <PersonAddIcon color='success' />}
                    onClick={
                        () => {
                            setModalOpen(true);
                        }}>
                    Create a new care recipient profile</Button>
                <DataGrid
                    rows={caregiverInfoToRows(careRecipients)}
                    columns={columns}
                    getRowId={(c) => c.uuid}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>
        </>
    );
};

export default CareRecipientTable;

import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRecoilState, useRecoilValue } from 'recoil';
import { careGroupsInfoState, pageContextState } from '../../../state/recoil';
import { CareGroupInfo } from '../../../state/types';
import {
    Backdrop, Button, Fade, Modal,
    TextField, Typography
} from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddIcon from '@mui/icons-material/Add';
import { DEFAULT_PROFILE_IMAGE } from '../../../state/sampleData';
import { v4 } from 'uuid';
import CancelIcon from '@mui/icons-material/Cancel';
import { setCareGroupInfo } from '../../../state/setting';


type CareGroupTableRows = {
    name: string,
    uuid: string,
    dateCreated: number,
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

const columns: GridColDef<CareGroupTableRows>[] = [
    {
        field: 'name',
        headerName: 'Name',
        width: 200,
    },
    {
        field: 'dateCreated',
        valueGetter: (v, r, c) => (new Date(v)).toString(),
        headerName: 'Joined Care Insights', width: 200
    },
    {
        field: 'uuid',
        headerName: 'Anonomized ID',
        width: 150,
    },
];

const caregroupInfoToRows: (careGroupInfo:
    Record<string, CareGroupInfo>) =>
    CareGroupTableRows[] = (c) => Object.values(c)
        .map((x) => ({
            name: x.name,
            uuid: x.uuid,
            dateCreated: x.dateCreated
        }));

const CareGroupTable: React.FC = () => {
    const [careGroups, setCareGroups] = useRecoilState(
        careGroupsInfoState);
    const pageContext = useRecoilValue(
        pageContextState);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [newGroupName, setNewGroupName] = React.useState('');
    const handleClose = () => {
        setModalOpen(false);
        setTimeout(() => {
            setNewGroupName('');
        }, 500);
    };

    const newCareGroupInfo: () =>
        CareGroupInfo = () => ({
            imageURL: DEFAULT_PROFILE_IMAGE,
            name: newGroupName,
            careRecipients: [],
            readPermissions: [],
            facilityID: pageContext.selectedFacilityID,
            editPermissions: [],
            dateCreated: (new Date()).getTime(),
            uuid: v4(),
        });

    const createNew = () => {
        const newCareGroup = newCareGroupInfo();
        setCareGroups({
            ...careGroups,
            [newCareGroup.uuid]: newCareGroup,
        });
        setCareGroupInfo(
            newCareGroup);
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
                            Create a new care group
                        </Typography>
                        <Typography id="transition-modal-title"
                            variant="body1">
                            {"You can modify care group permissions" +
                                "after clicking 'create.'"}
                        </Typography>
                        <br />
                        <TextField id="outlined-basic"
                            label="Care group name"
                            value={newGroupName}
                            onChange={
                                (event:
                                    React.ChangeEvent<
                                        HTMLInputElement>) => {
                                    setNewGroupName(
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
                    <GroupAddIcon color='success' />}
                    onClick={
                        () => {
                            setModalOpen(true);
                        }}>
                    Create a new care group</Button>
                <DataGrid
                    rows={caregroupInfoToRows(careGroups)}
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

export default CareGroupTable;

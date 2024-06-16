import * as React from 'react';
import Box from '@mui/material/Box';
import { useRecoilState } from 'recoil';
import {
    careFacilitiesState,
    caregiversInfoState, pageContextState
} from '../../state/recoil';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { FacilityInfo } from '../../state/types';
import { DEFAULT_PROFILE_IMAGE } from '../../state/sampleData';
import { v4 } from 'uuid';
import {
    setCaregiverInfo, setFacilityInfo,
    setPartialPageContext
} from '../../state/setting';
import HomeIcon from '@mui/icons-material/Home';
import CancelIcon from '@mui/icons-material/Cancel';
import { AuthContext } from '../../state/context/auth-context';


type AutocompleteOpton = {
    value: string
    label: string
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


export default function SelectFacility() {
    const { currentUser } = React.useContext(AuthContext);
    const [pageState, setPageState] = useRecoilState(pageContextState);
    const [caregiverInfo, setCaregiverInfoLocal] = useRecoilState(
        caregiversInfoState);
    const [facilities, setFacilities] = useRecoilState(careFacilitiesState);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [newFacilityName, setNewFacilityName] = React.useState('');
    const handleClose = () => {
        setModalOpen(false);
        setTimeout(() => {
            setNewFacilityName('');
        }, 500);
    };


    const newFacilityInfo: () =>
        FacilityInfo = () => ({
            imageURL: DEFAULT_PROFILE_IMAGE,
            name: newFacilityName,
            dateCreated: (new Date()).getTime(),
            uuid: v4(),
        });

    const createNew = () => {
        const newFacility = newFacilityInfo();
        setFacilities({
            ...facilities,
            [newFacility.uuid]: newFacility,
        });
        setFacilityInfo(newFacility);
        const updatedCaregiverInfo = {
            ...caregiverInfo[currentUser?.email as string],
            adminForFacilities: [
                ...caregiverInfo[currentUser?.email as string]
                    .adminForFacilities, newFacility.uuid]
        };
        setCaregiverInfoLocal({
            ...caregiverInfo,
            [currentUser?.email as string]: updatedCaregiverInfo
        });
        setCaregiverInfo(updatedCaregiverInfo);
        const newPageState = {
            ...pageState,
            selectedFacilityID: newFacility.uuid,
        };
        setPageState(newPageState);
        setPartialPageContext(newPageState);
    };
    const options: AutocompleteOpton[] = Object.values(facilities)
        .filter((f) => f.deletedDate === undefined)
        .map((f) => ({
            value: f.uuid,
            label: f.name,
        }));
    const chosenVal: AutocompleteOpton = {
        value: pageState.selectedFacilityID,
        label: facilities[pageState.selectedFacilityID].name
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
                            Create a new facility
                        </Typography>
                        <br />
                        <TextField id="outlined-basic"
                            label="Care group name"
                            value={newFacilityName}
                            onChange={
                                (event:
                                    React.ChangeEvent<
                                        HTMLInputElement>) => {
                                    setNewFacilityName(
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
            <Button startIcon={
                <HomeIcon color='success' />}
                onClick={
                    () => {
                        setModalOpen(true);
                    }}>
                Create a new facility</Button>
            <Box sx={{ minWidth: 120 }}>
                <Autocomplete
                    disablePortal
                    options={options}
                    value={chosenVal}
                    sx={{
                        'width': 400,
                        'input:focus, input:valid, textarea:valid': {
                            'outline': 'none',
                            'border': 'none'
                        }
                    }}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option
                        .value === value.value}
                    onChange={(event, newValue) => {
                        if (newValue !== null) {
                            const newState = {
                                ...pageState,
                                selectedFacilityID: newValue.value
                            };
                            setPageState(newState);w
                            setPartialPageContext(newState);
                        }
                    }}
                    // inputValue={{label: inputValue, uuid: 'test'}}
                    renderInput={(params) => <TextField {...params}
                        label="Facility Name" />}
                />
            </Box>
        </>
    );
}

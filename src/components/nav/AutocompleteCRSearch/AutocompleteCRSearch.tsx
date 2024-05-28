import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {
    NO_CR_SELECTED, allCRInfoState, allCRNamesState,
    pageContextState
} from '../../../state/recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    fetchCRInfo,
    getSelectedCRProgramEvents
} from '../../../state/fetching';

const AutocompleteUserSearch = () => {
    const allCGNames = useRecoilValue(allCRNamesState);
    const allCGInfo = useRecoilValue(allCRInfoState);
    const [pageContext, setPageContext] = useRecoilState(pageContextState);
    const selectedCGValue = allCGInfo[pageContext.selectedCR];


    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={allCGNames}
            value={selectedCGValue}
            sx={{
                'width': 400,
                'input:focus, input:valid, textarea:valid': {
                    'outline': 'none',
                    'border': 'none'
                }
            }}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
            onChange={(event, newValue) => {
                const newUUID = newValue === null ? 'NONE' : newValue.uuid;
                if (newUUID === NO_CR_SELECTED) {
                    setPageContext({
                        ...pageContext,
                        selectedCR: NO_CR_SELECTED,
                        selectedCRProgramEvents:
                            getSelectedCRProgramEvents(
                                NO_CR_SELECTED),
                        loadingCRInfo: false,
                    });
                } else {
                    fetchCRInfo(newUUID, pageContext, setPageContext);
                }
            }}
            // inputValue={{label: inputValue, uuid: 'test'}}
            renderInput={(params) => <TextField {...params} label="Name" />}
        />);
};

export default AutocompleteUserSearch;

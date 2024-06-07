/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {
    NO_CR_SELECTED, allCRInfoState, allCRNamesState,
    pageContextState,
    queriesForCurrentCGState
} from '../../../state/recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    loadCRData,
} from '../../../state/fetching';

const AutocompleteUserSearch = () => {
    const allCGNames = useRecoilValue(allCRNamesState);
    const allCGInfo = useRecoilValue(allCRInfoState);
    const [pageContext, setPageContext] = useRecoilState(pageContextState);
    const selectedCGValue = allCGInfo[pageContext.selectedCR];
    const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);

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
                console.log(newValue);
                const newUUID = newValue === null ? 'NONE' : newValue.uuid;
                console.log(newUUID);
                const newPageState = {
                    ...pageContext,
                    selectedCR: newUUID,
                    loadingCRInfo: false,
                };
                loadCRData(newPageState, setPageContext, setQueries);
            }}
            // inputValue={{label: inputValue, uuid: 'test'}}
            renderInput={(params) => <TextField {...params} label="Name" />}
        />);
};

export default AutocompleteUserSearch;

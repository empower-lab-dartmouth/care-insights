import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {
  NO_CR_SELECTED,
  careRecipientsInfoState,
  pageContextState,
  queriesForCurrentCGState,
} from '../../../state/recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import { loadCRData } from '../../../state/fetching';
import { setPartialPageContext } from '../../../state/setting';

const AutocompleteUserSearch = () => {
  const allCGInfo = useRecoilValue(careRecipientsInfoState);
  const [pageContext, setPageContext] = useRecoilState(pageContextState);
  const selectedCGValue = allCGInfo[pageContext.selectedCR];
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);

  const options = Object.values(allCGInfo)
    .filter(v => v.uuid !== NO_CR_SELECTED)
    .map(v => ({
      label: v.name,
      uuid: v.uuid,
    }));
  const value =
    selectedCGValue === undefined
      ? {
          label: 'Select a care recipient',
          uuid: 'NONE',
        }
      : {
          label: selectedCGValue.name,
          uuid: selectedCGValue.uuid,
        };

  return (
    <Autocomplete
      disablePortal
      id='combo-box-demo'
      options={options}
      value={value}
      sx={{
        'width': 400,
        'input:focus, input:valid, textarea:valid': {
          outline: 'none',
          border: 'none',
        },
      }}
      getOptionLabel={option => option.label}
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
        setPartialPageContext(newPageState);
        loadCRData(newPageState, setPageContext, setQueries);
      }}
      // inputValue={{label: inputValue, uuid: 'test'}}
      renderInput={params => <TextField {...params} label='Care Recipient' />}
    />
  );
};

export default AutocompleteUserSearch;

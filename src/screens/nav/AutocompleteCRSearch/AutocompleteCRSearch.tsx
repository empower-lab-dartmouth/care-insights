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
import { Avatar, Group, Pill, Select, SelectProps, Text } from '@mantine/core';
import { UserRound } from 'lucide-react';

const AutocompleteUserSearch = () => {
  const allCGInfo = useRecoilValue(careRecipientsInfoState);
  const [pageContext, setPageContext] = useRecoilState(pageContextState);
  const selectedCGValue = allCGInfo[pageContext.selectedCR];
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const careRecipientsInfo = useRecoilValue(careRecipientsInfoState);

  const options = Object.values(allCGInfo)
    .filter(v => v.uuid !== NO_CR_SELECTED)
    .map(v => ({
      label: v.name,
      uuid: v.uuid,
      value: v.uuid,
    }));

  const value =
    selectedCGValue === undefined
      ? {
          label: 'Select a care recipient',
          uuid: 'NONE',
          value: 'NONE',
        }
      : {
          label: selectedCGValue.name,
          uuid: selectedCGValue.uuid,
          value: selectedCGValue.uuid,
        };

  const renderSelectOption: SelectProps['renderOption'] = ({ option }) => (
    <Group flex='1' gap='xs'>
      <Pill>{option.label}</Pill>
    </Group>
  );

  return (
    // <Autocomplete
    //   disablePortal
    //   id='combo-box-demo'
    //   options={options}
    //   value={value}
    //   sx={{
    //     'width': 400,
    //     'input:focus, input:valid, textarea:valid': {
    //       outline: 'none',
    //       border: 'none',
    //     },
    //   }}
    //   getOptionLabel={option => option.label}
    //   isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
    //   onChange={(event, newValue) => {
    //     console.log(newValue);
    //     const newUUID = newValue === null ? 'NONE' : newValue.uuid;
    //     console.log(newUUID);
    //     const newPageState = {
    //       ...pageContext,
    //       selectedCR: newUUID,
    //       loadingCRInfo: false,
    //     };
    //     setPartialPageContext(newPageState);
    //     loadCRData(newPageState, setPageContext, setQueries);
    //   }}
    //   // inputValue={{label: inputValue, uuid: 'test'}}
    //   renderInput={params => <TextField {...params} label='Name' />}
    // />
    <div className='flex flex-col items-start gap-2'>
      <Text className='text-sm font-semibold'>Current patient: </Text>
      <Select
        placeholder='Select a care recipient'
        data={options}
        searchable
        defaultSearchValue={value.label}
        className='w-80'
        renderOption={renderSelectOption}
        onChange={(event, newValue) => {
          const newUUID = newValue === null ? 'NONE' : (newValue as any).uuid;
          const newPageState = {
            ...pageContext,
            selectedCR: newUUID,
            loadingCRInfo: false,
          };
          setPartialPageContext(newPageState);
          loadCRData(newPageState, setPageContext, setQueries, careRecipientsInfo);
        }}
      />
    </div>
  );
};

export default AutocompleteUserSearch;

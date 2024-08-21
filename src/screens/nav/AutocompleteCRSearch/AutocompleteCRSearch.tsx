import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {
  NO_CR_SELECTED,
  careRecipientsInfoState,
  extededAttributesState,
  onlyCRWithRoomNumber,
  pageContextState,
  queriesForCurrentCGState,
} from '../../../state/recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import { loadCRData } from '../../../state/fetching';
import { setPartialPageContext } from '../../../state/setting';
import { Avatar, Checkbox, Group, Pill, Select, SelectProps, Text } from '@mantine/core';
import { UserRound } from 'lucide-react';
import { ExtendedAttributes } from '../../../state/types';


const caregiverName = (id: string, d: string, extendedAttributes: Record<string, ExtendedAttributes>) => {
  return extendedAttributes[id] ? extendedAttributes[id].firstName + ' ' + extendedAttributes[id].lastName : d;
}

const AutocompleteUserSearch = () => {
  const allCGInfo = useRecoilValue(careRecipientsInfoState);
  const [pageContext, setPageContext] = useRecoilState(pageContextState);
  const selectedCGValue = allCGInfo[pageContext.selectedCR];
  const [extendedAttributes, setExtendedAttributes] = useRecoilState(extededAttributesState);
  const [queries, setQueries] = useRecoilState(queriesForCurrentCGState);
  const [checked, setChecked] = useRecoilState(onlyCRWithRoomNumber);

  // const careRecipientsInfo = useRecoilValue(careRecipientsInfoState);

  const options = Object.values(allCGInfo)
    .filter(v => v.uuid !== NO_CR_SELECTED)
    .filter(v => extendedAttributes[v.uuid] &&
      (!checked || (checked && 
      extendedAttributes[v.uuid].roomNumber != undefined &&
      extendedAttributes[v.uuid].roomNumber != 'Not reported')))
    .map(v => ({
      label: caregiverName(v.uuid, v.name, extendedAttributes),
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
        label: caregiverName(selectedCGValue.uuid, selectedCGValue.name, extendedAttributes),
        uuid: selectedCGValue.uuid,
        value: selectedCGValue.uuid,
      };

  const renderSelectOption: SelectProps['renderOption'] = ({ option }) => (
    <Group flex='1' gap='xs'>
      <Pill>{option.label}</Pill>
    </Group>
  );

  return (
    <div className='flex flex-col items-start gap-2 pb-4 md:pb-0'>
      <Text className='text-sm font-semibold'>Showing care recipient: </Text>
      <Group>
        <Checkbox
          checked={checked}
          labelPosition="left"
          label="Only list care recipients with room numbers"
          onChange={(event) => setChecked(event.currentTarget.checked)}
        />
        <Select
          placeholder='Select a care recipient'
          data={options}
          value={pageContext.selectedCR}
          clearable
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
            loadCRData(
              newPageState,
              setPageContext,
              setQueries,
              allCGInfo,
              extendedAttributes[pageContext.selectedCR]
            );
          }}
        />
      </Group>
    </div>
  );
};

export default AutocompleteUserSearch;

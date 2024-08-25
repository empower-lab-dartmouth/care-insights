import React from 'react';
import { IconSearch } from '@tabler/icons-react';
import { useRecoilValue } from 'recoil';
import { pageContextState } from '../../../state/recoil';
import { Group } from '@mantine/core';

const InputBox = ({
  value,
  onSearch,
  onChange,
}: {
  value: string;
  onSearch: (regenerate: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  const pageContext = useRecoilValue(pageContextState);
  const refreshSearch = pageContext.insightsQuery.query !== '' && pageContext.insightsQuery.query === value;
  return (
    <div className='bg-gray-200  gap-1.5 rounded-3xl flex items-center'>
      <div className='flex items-center w-full py-2 px-4  rounded-full shadow-sm'>
        <textarea
          className='flex-1 p-2 bg-transparent border-none outline-none resize-none text-gray-700 placeholder-gray-500'
          rows={1}
          style={{color:'darkBlue', fontWeight:'bold'}}
          placeholder='Search Care Insights'
          value={value}
          onChange={onChange}
        />
      </div>

      <div
        className='p-2 rounded-full bg-primary text-white mr-4 hover:bg-blue-400 cursor-pointer'
        onClick={() => onSearch(refreshSearch)}
      >
        {
           refreshSearch ? 
           <Group wrap="nowrap" justify="flex-end" h={20}>
        <IconSearch size={20} />
        <p>Regenerate</p>
           </Group> :
        <IconSearch size={20} />
        }
      </div>
    </div>
  );
};

export default InputBox;

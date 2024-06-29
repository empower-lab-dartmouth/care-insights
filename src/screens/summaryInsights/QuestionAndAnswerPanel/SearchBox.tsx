import React from 'react';
import { IconSearch } from '@tabler/icons-react';

const InputBox = ({
  value,
  onSearch,
  onChange,
}: {
  value: string;
  onSearch: () => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  return (
    <div className='bg-[#f9f9f9]  gap-1.5 rounded-3xl flex items-center'>
      <div className='flex items-center w-full py-2 px-4  rounded-full shadow-sm'>
        <textarea
          className='flex-1 p-2 bg-transparent border-none outline-none resize-none text-gray-700 placeholder-gray-500'
          rows={1}
          placeholder='Search Care Insights'
          value={value}
          onChange={onChange}
        />
      </div>

      <div
        className='p-2 rounded-full bg-primary text-white mr-4 hover:bg-blue-400 cursor-pointer'
        onClick={onSearch}
      >
        <IconSearch size={20} />
      </div>
    </div>
  );
};

export default InputBox;

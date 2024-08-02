import React from 'react';
import { Chip, Stack } from '@mui/material';
import { Button } from '@mantine/core';
import { QueryRecord } from '../../../state/queryingTypes';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { useRecoilValue } from 'recoil';
import { pageContextState } from '../../../state/recoil';

type SuggestedTextProps = {
  textSuggestions: QueryRecord[];
  onSelected: (option: QueryRecord) => void;
  loadMoreSuggestions: () => void;
  hasMoreSuggestions: boolean;
  currentText: string;
};

const SuggestedText: React.FC<SuggestedTextProps> = props => {
  const {
    textSuggestions,
    onSelected,
    currentText,
    hasMoreSuggestions,
    loadMoreSuggestions,
  } = props;
  const pageContext = useRecoilValue(pageContextState);
  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        useFlexGap
        flexWrap='wrap'
        spacing={{ xs: 1 }}
      >
        {textSuggestions
        .filter(option => option.CRUUID === pageContext.selectedCR)
        .map(option => (
          <Chip
            key={option.queryUUID}
            disabled={currentText === option.query}
            onClick={() => onSelected(option)}
            label={option.query}
            variant='outlined'
          />
        ))}
      </Stack>
      {hasMoreSuggestions ? (
        <Button
          variant='transparent'
          color='blue'
          leftSection={<CloudDownloadIcon />}
          onClick={loadMoreSuggestions}
          className='w-[300px] pl-0'
        >
          Load more suggested prompts
        </Button>
      ) : (
        <></>
      )}
    </>
  );
};

export default SuggestedText;

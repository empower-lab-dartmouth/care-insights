import React from 'react';
import { Button, Chip, Stack } from '@mui/material';
import { QueryRecord } from '../../../state/queryingTypes';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

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
  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        useFlexGap
        flexWrap='wrap'
        spacing={{ xs: 1 }}
      >
        {textSuggestions.map(option => (
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
        <Button startIcon={<CloudDownloadIcon />} onClick={loadMoreSuggestions}>
          Load more suggested prompts
        </Button>
      ) : (
        <></>
      )}
    </>
  );
};

export default SuggestedText;
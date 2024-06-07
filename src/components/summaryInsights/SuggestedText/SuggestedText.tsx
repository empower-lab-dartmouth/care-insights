/* eslint-disable require-jsdoc */
import React from 'react';
import Fab from '@mui/material/Fab';
import { Stack } from '@mui/material';
import { QueryRecord } from '../../../state/queryingTypes';

type SuggestedTextProps = {
    textSuggestions: QueryRecord[],
    onSelected: (option: QueryRecord) => void
}

const SuggestedText: React.FC<SuggestedTextProps> = (props) => {
    const { textSuggestions, onSelected } = props;
    return (
        <>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                useFlexGap flexWrap="wrap"
                spacing={{ xs: 1 }}>
                {
                    textSuggestions.map((option) =>
                    (<Fab variant="extended"
                        key={option.queryUUID} onClick={
                            () => onSelected(option)}>
                        {option.query}
                    </Fab>)
                    )
                }
            </Stack>
        </>
    );
};

export default SuggestedText;

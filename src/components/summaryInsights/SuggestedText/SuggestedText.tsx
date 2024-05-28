/* eslint-disable require-jsdoc */
import React from 'react';
import Fab from '@mui/material/Fab';
import { Stack } from '@mui/material';

type SuggestedTextProps = {
    textSuggestions: string[],
    onSelected: (option: string) => void
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
                        (<Fab variant="extended" key={option} onClick={
                            () => onSelected(option)}>
                            {option}
                        </Fab>)
                    )
                }
            </Stack>
        </>
    );
};

export default SuggestedText;

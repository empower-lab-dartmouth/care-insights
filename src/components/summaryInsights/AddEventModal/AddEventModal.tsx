import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { allCRInfoState, pageContextState } from '../../../state/recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const AddEvent: React.FC = () => {
  const [pageContext, setPageContext] = useRecoilState(pageContextState);
  const CRInfo = useRecoilValue(allCRInfoState);
  const CRname = CRInfo[pageContext.selectedCR].name;
  const [eventDescription, setEventDescription] = React.useState('');
  const handleClose = () => {
    setPageContext({
      ...pageContext,
      addEventModalOpen: false
    });
  };
  return (
    <>
      <Box sx={{ ...style, width: 400 }}>
        <Paper elevation={1}>
          <h2> Record an event for {CRname} </h2>
          <p>To record an event for a different care recepient, close this
            module and choose a different care recepient in the dropdown.</p>
          <TextField
            id="standard-multiline-static"
            label="What happened?"
            multiline
            sx={{
              'width': '100%',
              'input:focus, input:valid, textarea:valid': {
                'outline': 'none',
                'border': 'none'
            }
            }}
            rows={4}
            value={eventDescription}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEventDescription(event.target.value);
            }}
          />
          <br />
          <Button onClick={handleClose} sx={{
            width: '100%'
          }}>Submit</Button>
        </ Paper>
      </Box>
    </>
  );
};

export default AddEvent;

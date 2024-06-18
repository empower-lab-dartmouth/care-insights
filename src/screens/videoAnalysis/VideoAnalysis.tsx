import React from 'react';
import Nav from '../nav/NavBar';
import ProgramEventsTable from './programEventsTable/ProgramEventsTable';
import CommonCRActions from '../nav/CommonCRActions/CommonCRActions';
import { pageContextState } from '../../state/recoil';
import { useRecoilValue } from 'recoil';
import CircularProgress from '@mui/material/CircularProgress';
import UserShell from '../../components/UserShell';
import { Paper } from '@mantine/core';

export default function VideoAnalysis() {
  const pageContext = useRecoilValue(pageContextState);
  return (
    <UserShell>
      <CommonCRActions page={'program-events'} />
      <Paper shadow='xs' p={12} className='mt-8'>
        {pageContext.loadingCRInfo ? (
          <CircularProgress />
        ) : (
          <ProgramEventsTable />
        )}
      </Paper>
    </UserShell>
  );
}

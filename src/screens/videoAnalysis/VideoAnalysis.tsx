import React from 'react';
import Nav from '../nav/NavBar';
import ProgramEventsTable from './programEventsTable/ProgramEventsTable';
import CommonCRActions from '../nav/CommonCRActions/CommonCRActions';
import { pageContextState } from '../../state/recoil';
import { useRecoilValue } from 'recoil';
import CircularProgress from '@mui/material/CircularProgress';
import UserShell from '../../components/UserShell';
import { Paper, Card } from '@mantine/core';

export default function VideoAnalysis() {
  const pageContext = useRecoilValue(pageContextState);
  return (
    <UserShell>
      <CommonCRActions page={'program-events'} />
      <div className='mt-8'>
        {pageContext.loadingCRInfo ? (
          <CircularProgress />
        ) : (
          <ProgramEventsTable />
        )}
      </div>
    </UserShell>
  );
}

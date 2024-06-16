import React from 'react';
import Nav from '../nav/NavBar';
import ProgramEventsTable from './programEventsTable/ProgramEventsTable';
import CommonCRActions from '../nav/CommonCRActions/CommonCRActions';
import { pageContextState } from '../../state/recoil';
import { useRecoilValue } from 'recoil';
import CircularProgress from '@mui/material/CircularProgress';
import UserShell from '../../components/UserShell';

export default function VideoAnalysis() {
  const pageContext = useRecoilValue(pageContextState);
  return (
    <UserShell>
      <div className='container'>
        <CommonCRActions page={'program-events'} />
        {pageContext.loadingCRInfo ? (
          <CircularProgress />
        ) : (
          <ProgramEventsTable />
        )}
      </div>
    </UserShell>
  );
}

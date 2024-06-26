import React from 'react';
import Nav from '../nav/NavBar';
import { Typography } from '@mui/material';
import CaregiverTable from './DataTables/CaregiverTable';
import CareRecipientTable from './DataTables/CareRecipientTable';
import CareGroupTable from './DataTables/CareGroupTable';
import SelectFacility from './SelectFacility';
import { useRecoilValue } from 'recoil';
import { caregiversInfoState } from '../../state/recoil';
import UserShell from '../../components/UserShell';
// import { pageContextState } from '../../state/recoil';
// import { useRecoilValue } from 'recoil';

export default function CareTeam() {
  const caregiverInfo = useRecoilValue(caregiversInfoState);
  console.log(caregiverInfo);

  return (
    <UserShell>
      <div
        className='container'
        style={{
          background: 'white',
        }}
      >
        <SelectFacility />
        {/* <Typography variant='h2'>Your care group</Typography>
        <CareGroupTable /> */}
        <Typography variant='h2'>Your care recipients</Typography>
        <CareRecipientTable />
        <Typography variant='h2'>Your care team</Typography>
        <CaregiverTable />
      </div>
    </UserShell>
  );
}

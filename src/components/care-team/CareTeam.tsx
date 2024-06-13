/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-jsdoc */
import React from 'react';
import Nav from '../nav/NavBar';
import { Typography } from '@mui/material';
import CaregiverTable from './DataTables/CaregiverTable';
import CareRecipientTable from './DataTables/CareRecipientTable';
import CareGroupTable from './DataTables/CareGroupTable';
import SelectFacility from './SelectFacility';
import { useRecoilValue } from 'recoil';
import {
    caregiversInfoState
} from '../../state/recoil';
// import { pageContextState } from '../../state/recoil';
// import { useRecoilValue } from 'recoil';

export default function CareTeam() {
    const caregiverInfo = useRecoilValue(
        caregiversInfoState);
    // eslint-disable-next-line no-unused-vars
    console.log(caregiverInfo);

    return (
        <>
            <Nav />
            <br />
            <br />
            <br />
            <div className='container' style={{
                'background': 'white'
            }}>
                <SelectFacility />
                <Typography variant='h2'>
                    Your care group
                </Typography>
                <CareGroupTable />
                <Typography variant='h2'>
                    Your care recipients
                </Typography>
                <CareRecipientTable />
                <Typography variant='h2'>
                    Your care team
                </Typography>
                <CaregiverTable />
            </div>
        </>
    );
}

/* eslint-disable require-jsdoc */
import React from 'react';
import Nav from '../nav/NavBar';
import CommonCRActions from '../nav/CommonCRActions/CommonCRActions';
import { Typography } from '@mui/material';
import CaregiverTable from './DataTables/CaregiverTable';
import CareRecipientTable from './DataTables/CareRecipientTable';
// import { pageContextState } from '../../state/recoil';
// import { useRecoilValue } from 'recoil';

export default function CareTeam() {
    // const pageContext = useRecoilValue(pageContextState);
    return (
        <>
            <Nav />
            <br />
            <br />
            <br />
            <div className='container' style={{
                'background': 'white'
            }}>
                <CommonCRActions page={'care-team'} />
                <Typography variant='h2'>
                    Your care group
                </Typography>
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

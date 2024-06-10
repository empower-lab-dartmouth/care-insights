import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRecoilValue } from 'recoil';
import { caregiversInfoState } from '../../../state/recoil';
import { CaregiverInfo } from '../../../state/types';
import { Button } from '@mui/material';
import { setCaregiverInfo } from '../../../state/setting';
import { generateCaregiverInfo } from '../../../state/sampleData';

type CaregiverTableRows = {
    name: string,
    email: string,
}

const columns: GridColDef<CaregiverTableRows>[] = [
    {
        field: 'email',
        headerName: 'Email',
        width: 200,
    },
    { field: 'name', headerName: 'Name', width: 200 },
];

const caregiverInfoToRows: (caregiverInfo: Record<string, CaregiverInfo>) =>
    CaregiverTableRows[] = (c) => Object.values(c)
        .map((x) => ({
            name: x.name,
            email: x.uuid,
        }));

const CaregiverTable: React.FC = () => {
    const caregiversInfo = useRecoilValue(
        caregiversInfoState);
    return (
        <Box sx={{ maxHeight: 400, width: '100%', backgroundColor: 'white' }}>
            <Button onClick={() => setCaregiverInfo(
                generateCaregiverInfo())}>Make caregiver info</Button>
            <DataGrid
                rows={caregiverInfoToRows(caregiversInfo)}
                columns={columns}
                getRowId={(c) => c.email}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
};

export default CaregiverTable;

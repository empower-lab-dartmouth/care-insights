/* eslint-disable require-jsdoc */
import React from 'react';
import { CRInfo, EventUUID, ProgramEvent } from "../../../state/types";
import DataTable, { TableColumn } from 'react-data-table-component';
import {
    NO_CR_SELECTED, allCRInfoState,
    pageContextState
} from '../../../state/recoil';
import { useRecoilValue } from 'recoil';
import { ExpandableRowsComponent } from
    'react-data-table-component/dist/DataTable/types';


type Row = {
    type: 'music-event',
    label: string,
    CRName: string,
    uuid: EventUUID,
    description: string,
    data: string,
    defaultExpanded: boolean,
    date: string,
    id: string,
}

const columns: TableColumn<Row>[] = [
    {
        name: 'Event type',
        selector: (row: Row) => row.label,
        sortable: true,
    },
    {
        name: 'Care recipient',
        selector: (row: Row) => row.CRName,
        sortable: true,
    },
    {
        name: 'Date',
        selector: (row: Row) => row.date,
        sortable: true,
        sortFunction: (rowA, rowB) => ((new Date(rowB.date))
            .getTime() - (new Date(rowA.date)).getTime()),
    },
    {
        name: 'Description',
        selector: (row: Row) => row.description,
        sortable: false,
    },
];

const ExpandedComponent: ExpandableRowsComponent<Row> = (
    d) => {
    const { data } = d.data;
    return <pre style={{
        borderWidth: '30px',
        borderStyle: 'none none none solid',
        borderColor: 'lightgray'
    }}>{JSON.stringify(data, null, 2)}</pre>;
};


const programEventsToRows: (v: ProgramEvent[],
    cRInfo: Record<string, CRInfo>) => Row[] = (v, CRInfo) =>
        v.map((l) => ({
            ...l,
            date: (new Date(l.date)).toString(),
            CRName: CRInfo[l.CRUUID].name,
            id: l.uuid,
            defaultExpanded: false,
        }));


const ProgramEventsTable: React.FC = () => {
    const pageContext = useRecoilValue(pageContextState);
    const CRInfo = useRecoilValue(allCRInfoState);
    const data: Row[] = programEventsToRows(
        Object.values(pageContext.selectedCRProgramEvents),
        CRInfo);
    const title = pageContext.selectedCR === NO_CR_SELECTED ?
        'Showing recent events for ' +
        'all care recipients' :
        `Showing events for ${CRInfo[
            pageContext.selectedCR].name}`;
    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                title={title}
                pagination
                expandableRows
                expandableRowExpanded={(row: Row) => row.defaultExpanded}
                expandableRowsComponent={ExpandedComponent}
            />
        </>
    );
};

export default ProgramEventsTable;

/* eslint-disable require-jsdoc */
import React from 'react';
import {
    CRInfo, EventUUID,
    MeaningfulMoment, ProgramEvent
} from "../../../state/types";
import DataTable, { TableColumn } from 'react-data-table-component';
import {
    NO_CR_SELECTED, allCRInfoState,
    pageContextState
} from '../../../state/recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ExpandableRowsComponent } from
    'react-data-table-component/dist/DataTable/types';
import VideoPlayer from '../VideoPlayer/VideoPlayer';

type MusicEventRow = {
    type: 'music-event',
    label: string,
    CRName: string,
    uuid: EventUUID,
    description: string,
    videoUrl: string,
    meaningfulMoments: Record<string, MeaningfulMoment>
    setMeaningfulMoments: (
        meaningfulMoments: Record<string, MeaningfulMoment>) => void
    transcript?: string,
    defaultExpanded: boolean,
    date: string,
    id: string,
}

type Row = MusicEventRow

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
    const { videoUrl,
        meaningfulMoments, setMeaningfulMoments } = d.data;
    return <pre style={{
        borderWidth: '30px',
        borderStyle: 'none none none solid',
        borderColor: 'lightgray'
    }}>
        <VideoPlayer videoSrc={videoUrl}
            setMeaningfulMoments={setMeaningfulMoments}
            meaningfulMoments={meaningfulMoments} />
    </pre>;
};


const programEventsToRows: (v: ProgramEvent[],
    updateMeaningfulMoments: (id: string) =>
        (v: Record<string, MeaningfulMoment>) => void,
    cRInfo: Record<string, CRInfo>) => Row[] = (v,
        updateMeaningfulMoments, CRInfo) =>
        v.map((l) => ({
            ...l,
            date: (new Date(l.date)).toString(),
            CRName: CRInfo[l.CRUUID].name,
            id: l.uuid,
            meaningfulMoments: l.meaningfulMoments,
            setMeaningfulMoments: updateMeaningfulMoments(l.uuid),
            defaultExpanded: false,
        }));


const ProgramEventsTable: React.FC = () => {
    const [pageContext, setPageContext] = useRecoilState(pageContextState);
    const CRInfo = useRecoilValue(allCRInfoState);

    // TODO: also update remote.
    const updateMeaningfulMoments: (id: string) => (
        moments: Record<string, MeaningfulMoment>) => void = (id) =>
            (moments) => setPageContext({
                ...pageContext,
                selectedCRProgramEvents: {
                    ...pageContext.selectedCRProgramEvents,
                    [id]: {
                        ...pageContext.selectedCRProgramEvents[id],
                        meaningfulMoments: moments,
                    }
                }
            });
    const data: Row[] = programEventsToRows(
        Object.values(pageContext.selectedCRProgramEvents),
        updateMeaningfulMoments,
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

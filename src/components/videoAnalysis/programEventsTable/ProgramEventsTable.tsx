/* eslint-disable require-jsdoc */
import React from 'react';
import {
    CareRecipientInfo, EngagementLevel, EventUUID,
    ManualEntryEvent,
    MeaningfulMoment, MusicProgramEvent, ProgramEvent,
    RedirectionLevel
} from "../../../state/types";
import DataTable, { TableColumn } from 'react-data-table-component';
import {
    NO_CR_SELECTED,
    careRecipientsInfoState,
    pageContextState
} from '../../../state/recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ExpandableRowsComponent } from
    'react-data-table-component/dist/DataTable/types';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import ManualEntryExpandedView from
    '../ManualEntryExpandedView/ManualEntryExpandedView';
import { setRemoteProgramEvent } from '../../../state/setting';

type CommonRowFields = {
    label: string,
    CRName: string,
    CGName: string,
    setProgramEvent: (e: ProgramEvent) => void
    uuid: EventUUID,
    description: string,
    defaultExpanded: boolean,
    date: string,
    engagement: EngagementLevel,
    redirection: RedirectionLevel,
}

type MusicEventRow = CommonRowFields & {
    type: 'music-event',
    videoUrl: string,
    programEvent: MusicProgramEvent
    setMeaningfulMoments: (
        meaningfulMoments: Record<string, MeaningfulMoment>) => void
    transcript?: string,
}

type ManualEntryRow = CommonRowFields & {
    type: 'manual-entry-event',
    programEvent: ManualEntryEvent
}

type Row = MusicEventRow | ManualEntryRow;

const engagementLevelLabel = (engagmentLevel: EngagementLevel) => {
    switch (engagmentLevel) {
        case 'average':
            return 'Average';
        case 'high':
            return 'Above Average';
        case 'low':
            return 'Low';
        case 'na':
            return 'N/A';
        case 'none':
            return 'None';
    }
};

const redirectionLevelLabel = (redirectionLevel: RedirectionLevel) => {
    switch (redirectionLevel) {
        case 'na':
            return 'N/A';
        case 'success':
            return 'Success';
        case 'none':
            return 'None';
        case 'unsuccessful':
            return 'Unsuccessful';
    }
};

const columns: TableColumn<Row>[] = [
    {
        name: 'Description',
        selector: (row: Row) => row.description,
        sortable: false,
    },
    {
        name: 'Date',
        selector: (row: Row) => row.date,
        sortable: true,
        sortFunction: (rowA, rowB) => ((new Date(rowB.date))
            .getTime() - (new Date(rowA.date)).getTime()),
    },
    {
        name: 'Engagement level',
        selector: (row: Row) => engagementLevelLabel(
            row.engagement),
        sortable: true,
    },
    {
        name: 'Redirections',
        selector: (row: Row) => redirectionLevelLabel(
            row.redirection),
        sortable: true,
    },
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
        name: 'Caregiver',
        selector: (row: Row) => row.CGName,
        sortable: true,
    },
];

const ExpandedComponent: ExpandableRowsComponent<Row> = (
    d) => {
    if (d.data.type === 'music-event') {
        const { videoUrl,
            programEvent, setMeaningfulMoments,
            setProgramEvent } = d.data;
        return <pre style={{
            borderWidth: '30px',
            borderStyle: 'none none none solid',
            borderColor: 'lightgray'
        }}>
            <VideoPlayer videoSrc={videoUrl}
                setProgramEvent={setProgramEvent}
                setMeaningfulMoments={setMeaningfulMoments}
                programEvent={programEvent as MusicProgramEvent} />
        </pre>;
    }
    return (<pre style={{
        borderWidth: '30px',
        borderStyle: 'none none none solid',
        borderColor: 'lightgray'
    }}>
        <ManualEntryExpandedView programEvent={
            d.data.programEvent}
            setProgramEvent={d.data.setProgramEvent} />
    </pre>);
};


const programEventsToRows: (v: ProgramEvent[],
    updateMeaningfulMoments: (id: string) =>
        (v: Record<string, MeaningfulMoment>) => void,
    updateProgramEvent: (id: string) => (
        programEvent: ProgramEvent) => void,
    cRInfo: Record<string, CareRecipientInfo>) => Row[] = (v,
        updateMeaningfulMoments,
        updateProgramEvent, CRInfo) =>
        v.map((l) => {
            if (l.type === 'music-event') {
                return ({
                    ...l,
                    description: l.description,
                    date: (new Date(l.date)).toString(),
                    CRName: CRInfo[l.CRUUID].name,
                    programEvent: l,
                    setMeaningfulMoments: updateMeaningfulMoments(l.uuid),
                    setProgramEvent: updateProgramEvent(l.uuid),
                    engagement: l.engagement,
                    redirection: l.redirection,
                    CGName: l.CGUUID,
                    defaultExpanded: false,
                });
            } else {
                return ({
                    ...l,
                    description: l.description,
                    date: (new Date(l.date)).toString(),
                    CRName: CRInfo[l.CRUUID].name,
                    programEvent: l,
                    engagement: l.engagement,
                    CGName: l.CGUUID,
                    redirection: l.redirection,
                    setProgramEvent: updateProgramEvent(l.uuid),
                    defaultExpanded: false,
                });
            }
        });


const ProgramEventsTable: React.FC = () => {
    const [pageContext, setPageContext] = useRecoilState(pageContextState);
    const CRInfo = useRecoilValue(careRecipientsInfoState);

    // TODO: also update remote. (maybe this is already done? TODO check)
    const updateMeaningfulMoments: (id: string) => (
        moments: Record<string, MeaningfulMoment>) => void = (id) =>
            (moments) => setPageContext({
                ...pageContext,
                selectedCRProgramEvents: {
                    ...pageContext.selectedCRProgramEvents,
                    [id]: {
                        ...(pageContext.
                            selectedCRProgramEvents[id]) as MusicProgramEvent,
                        meaningfulMoments: moments,
                    }
                }
            });
    const updateProgramEvent: (id: string) => (
        programEvent: ProgramEvent) => void = (id) =>
            (programEvent) => {
                setPageContext({
                    ...pageContext,
                    selectedCRProgramEvents: {
                        ...pageContext.selectedCRProgramEvents,
                        [id]: programEvent,
                    }
                });
                setRemoteProgramEvent(programEvent);
            };
    const data: Row[] = programEventsToRows(
        Object.values(pageContext.selectedCRProgramEvents)
            .filter((v) => v.deleted === undefined),
        updateMeaningfulMoments, updateProgramEvent,
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
                striped
                highlightOnHover
                expandOnRowClicked
                expandableRowExpanded={(row: Row) => row.defaultExpanded}
                expandableRowsComponent={ExpandedComponent}
            />
        </>
    );
};

export default ProgramEventsTable;

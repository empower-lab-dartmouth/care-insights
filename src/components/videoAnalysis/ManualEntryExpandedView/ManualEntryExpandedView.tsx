/* eslint-disable require-jsdoc */
import React, { useState } from 'react';
import { ManualEntryEvent, ProgramEvent } from '../../../state/types';
import CommonRowControls from '../CommonRowControls/CommonRowControls';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import WYSIWYGEditor from '../../summaryInsights/WYSIWYGEditor/WYSIWYGEditor';

type ManualEntryExpandedViewProps = {
    programEvent: ManualEntryEvent
    setProgramEvent: (programEvent: ProgramEvent) => void
};

const ManualEntryExpandedView: React.FC<
    ManualEntryExpandedViewProps> = (props) => {
        const { programEvent, setProgramEvent } = props;
        const [localProgramEvent,
            setLocalProgramEvent] = useState(programEvent);
        const [editing, setEditingState] = useState(false);
        const setEditing = (v: boolean) => {
            setEditingState(v);
            setForceUpdateRequired(true);
        };
        const [forceUpdateRequired, setForceUpdateRequired] = useState(false);
        return (
            <>
                {
                    editing ?
                        <>
                            <Stack direction={'row'} spacing={1}>
                                <Button startIcon={<SaveIcon color='success' />}
                                    onClick={() => {
                                        setProgramEvent(localProgramEvent);
                                        setEditing(false);
                                    }}>
                                    Save changes </Button>
                                <Button startIcon={<CancelIcon />}
                                    onClick={() => {
                                        setLocalProgramEvent(programEvent);
                                        setEditing(false);
                                    }}>
                                    Cancel </Button>
                            </Stack>
                            <WYSIWYGEditor loading={false}
                                readOnly={false}
                                update={forceUpdateRequired}
                                updateCallback={(f) => {
                                    setForceUpdateRequired(false);
                                    f();
                                }}
                                defaultMessage=
                                'Loading...'
                                showDefaultMessage={false}
                                markdown={localProgramEvent.description}
                                onChange={(update) => {
                                    setLocalProgramEvent({
                                        ...localProgramEvent,
                                        description:
                                            update
                                    });
                                }}
                            />
                        </> :
                        <div>
                            <Stack direction={'row'}>
                                <Button startIcon={<EditIcon />}
                                    onClick={() => setEditing(true)}>
                                    Edit details </Button>
                                <CommonRowControls programEvent={programEvent}
                                    setProgramEvent={(e) => {
                                        setProgramEvent(e);
                                        setLocalProgramEvent(
                                            e as ManualEntryEvent);
                                    }} />
                            </Stack>
                            <WYSIWYGEditor loading={false}
                                readOnly={true}
                                update={forceUpdateRequired}
                                updateCallback={(f) => {
                                    setForceUpdateRequired(false);
                                    f();
                                }}
                                defaultMessage=
                                'Loading...'
                                showDefaultMessage={false}
                                markdown={localProgramEvent.description}
                                onChange={(update) => {
                                    setLocalProgramEvent({
                                        ...localProgramEvent,
                                        description:
                                            update
                                    });
                                }}
                            />
                        </div>
                }
            </>
        );
    };

export default ManualEntryExpandedView;

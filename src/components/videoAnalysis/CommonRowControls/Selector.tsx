import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export type SelectionChoice<T = string> = {
    label: string
    value: T
}

export type ControlledSelectorProps = {
    options: SelectionChoice[]
    selected: string,
    label: string,
    onSelect: (choice: string) => void
}

const Selector: React.FC<ControlledSelectorProps> = ({
    options, selected, onSelect, label }) => {
    const [open, setOpen] = React.useState(false);

    const handleChange = (event: SelectChangeEvent) => {
        onSelect(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel
                    id="demo-controlled-open-select-label">
                    Age</InputLabel>
                <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={selected}
                    label={label}
                    onChange={handleChange}
                >
                    {
                        options.map(
                            (o) => <MenuItem key={o.value}
                                value={o.value}>
                                {o.label}</MenuItem>)
                    }
                </Select>
            </FormControl>
        </div>
    );
};

export default Selector;

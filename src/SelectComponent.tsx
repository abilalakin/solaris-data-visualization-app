import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MainContext from './AppContext';

interface ISelectComponent {
    label: string;
    selectItem1: string;
    selectItem2: string;
    selectItem3?: string;
}

export const SelectComponent: React.FC<ISelectComponent> = props => {
    const [item, setItem] = React.useState('');
    const itemSelections: any = React.useContext(MainContext);

    const handleChange = (event: SelectChangeEvent) => {
        setItem(event.target.value as string);
        itemSelections.set(props.label, event.target.value);
    };
    
    return (

        <Box sx={{ width: 100, marginBottom: 10, marginLeft: 5, marginRight: 5 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={item}
                    label={props.label}
                    onChange={handleChange}
                >
                    <MenuItem value={props.selectItem1.toLowerCase()}>{props.selectItem1}</MenuItem>
                    <MenuItem value={props.selectItem2.toLowerCase()}>{props.selectItem2}</MenuItem>
                    {props.selectItem3 ? <MenuItem value={props.selectItem3.toLowerCase()}>{props.selectItem3}</MenuItem> : null}
                </Select>
            </FormControl>
        </Box>
    );
}

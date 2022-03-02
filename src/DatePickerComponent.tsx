import React from 'react';
import { DatePicker } from '@mui/lab';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MainContext from './AppContext';

interface IDatePickerComponentProps {
    minDate: Date;
    maxDate: Date;
}

export const DatePickerComponent: React.FC<IDatePickerComponentProps> = props => {
    const [value, setValue] = React.useState<Date | null>(null);
    const itemSelections: any = React.useContext(MainContext);
    return (
        <div style={{marginLeft: "30px"}}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                minDate={props.minDate}
                maxDate={props.maxDate}
                label="Select date"
                value={value}
                onChange={(newValue) => {
                    setValue(newValue);
                    itemSelections.set("Date", newValue?.toLocaleDateString());
                }}
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
        </div>
    );
};
import React from 'react';
import { CartesianGrid, XAxis, YAxis, Legend, Tooltip, LineChart, Line } from 'recharts';
import { Alert } from '@mui/material';

interface ILineChartProps {
    data: any[];
}

export const StatusLineChartComponent: React.FC<ILineChartProps> = props => {

    return (
        <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', marginBottom: "10px" }}>
            <LineChart width={750} height={500} data={props.data}
                margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis interval={10} dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="alive" stroke="green" />
                <Line type="monotone" dataKey="dead" stroke="red" />
                <Line type="monotone" dataKey="unknown" stroke="blue" />
            </LineChart>
            <Alert severity="info">The above chart shows the number of creatures according to their status day by day.</Alert>
        </div>
    )
}
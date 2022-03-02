import React from 'react';
import { Tooltip, BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
interface IBarChartComponentProps {
    data: any;
}

export const BarChartComponent: React.FC<IBarChartComponentProps> = props => {

    return (
        <BarChart width={800} height={400} data={props.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Afrosoricida" fill="#8884d8" />
            <Bar dataKey="Artiodactyla" fill="#82ca9d" />
            <Bar dataKey="Chiroptera" fill="#red" />
        </BarChart>
    )
}
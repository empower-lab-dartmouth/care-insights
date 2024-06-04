import React from 'react';
import { HeatMapGrid } from 'react-grid-heatmap';

const xLabels = new Array(24).fill(0).map((_, i) => `${i}`);
const yLabels = ['Attention', 'Reaction', 'Memory recall', 'Positive emotions'];
const data = new Array(yLabels.length)
    .fill(0)
    .map(() =>
        new Array(xLabels.length).fill(0).map(
            () => Math.floor(Math.random() * 20 + 50))
    );

const HeatMap = () => {
    return (
        <HeatMapGrid
            cellHeight="2rem"
            data={data}
            xLabels={xLabels}
            yLabels={yLabels}
        />
    );
};

export default HeatMap;

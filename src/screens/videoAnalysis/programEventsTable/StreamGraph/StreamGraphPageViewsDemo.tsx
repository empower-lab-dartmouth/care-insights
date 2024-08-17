import { useEffect, useRef, useState } from "react";
import { StreamGraph, attentionColumnName, emotionColumnName, memoryRecallColumnName, reactionColumnName, symptomColumnName } from "./StreamGraph";
import { sampleHeatmapData } from "./sampleHeatmap";
import { Center } from "@mantine/core";

type InputRow = {
    [attentionColumnName]: number,
    [reactionColumnName]: number,
    [symptomColumnName]: number,
    [memoryRecallColumnName]: number,
    [emotionColumnName]: number
};


type OutputRow = {
    [attentionColumnName]: number,
    [reactionColumnName]: number,
    [symptomColumnName]: number,
    [memoryRecallColumnName]: number,
    [emotionColumnName]: number,
    x: number
};


const formatRow: (input: InputRow, index: number) => OutputRow = (input, x) => ({
    ...input,
    x
})

const reformatRows: (rows: InputRow[]) => OutputRow[] = (rows) =>
    rows.map((row, i) => formatRow(row, i))

const shrinkData: (rows: InputRow[], max: number) => InputRow[] = (rows, max) => {
    let i = 0;
    let result: InputRow[] = [];
    const window = Math.max(1, Math.floor(rows.length / max))
    let newEntry: InputRow = {
        [attentionColumnName]: 0,
        [reactionColumnName]: 0,
        [symptomColumnName]: 0,
        [memoryRecallColumnName]: 0,
        [emotionColumnName]: 0,
    };
    let count = 0;
    while (i < rows.length) {
        if (i % window === 0 && count !== 0) {
            newEntry[attentionColumnName] /= count;
            newEntry[reactionColumnName] /= count;
            newEntry[symptomColumnName] /= count;
            newEntry[memoryRecallColumnName] /= count;
            newEntry[emotionColumnName] /= count;
            count = 0;
            result = [...result, newEntry];
            newEntry = {
                [attentionColumnName]: 0,
                [reactionColumnName]: 0,
                [symptomColumnName]: 0,
                [memoryRecallColumnName]: 0,
                [emotionColumnName]: 0,
            };
        }
        newEntry[attentionColumnName] += rows[i][attentionColumnName];
        newEntry[reactionColumnName] += rows[i][reactionColumnName];
        newEntry[symptomColumnName] += rows[i][symptomColumnName];
        newEntry[memoryRecallColumnName] += rows[i][memoryRecallColumnName];
        newEntry[emotionColumnName] += rows[i][emotionColumnName];
        count = count + 1;
        i += 1;   
    }
    return result;
}

export const StreamGraphPageViewsDemo = ({ width = 700, height = 300 }) => {
    const ref: any = useRef(null);
    const [w, setW] = useState(width);
    const [resolution, setResolution] = useState(100);
    useEffect(() => {
        const Margin = 200;
        setW(ref.current ? ref.current.offsetWidth - Margin : width);
    //   console.log('width', ref.current ? ref.current.offsetWidth : 0);
    }, [ref.current]);
    const inputData = sampleHeatmapData;
    const resolutionWindow = Math.max(1, Math.floor(inputData.length / resolution))
    const data = reformatRows(shrinkData(sampleHeatmapData, resolution));
    return (
        //   <StreamGraphPageViews width={width} height={height} />
        <div ref={ref}>
            <StreamGraph data={data} resolutionWindow={resolutionWindow} width={w} height={height} />
            <div style={{margin: 30}}>
            <Center>
            <h2 style={{padding: 5}}>Resolution</h2>
            <br />
            <input
            type="range"
            min={10}
            max={500}
            value={resolution}
            step={1}
            onChange={(e) => setResolution(parseInt(e.target.value))}
            style={{height: 1, opacity: 0.5, width: 80 }}
            />
            </Center>
            </div>
        </div>
    );
};

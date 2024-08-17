import { useEffect, useState } from "react";
import { DataItem, StreamGraph, parseTime } from "./StreamGraph3";
import { csvParse } from "d3";
import * as d3 from "d3";
import { sampleHeatmapData } from "./sampleHeatmap";

const HEADER_HEIGHT = 150;
const monthTimeFormatter = d3.timeFormat("%B %Y");

type StreamGraphPageViewsProps = {
  width: number;
  height: number;
};


const attentionColumnName = 'Heightened attention to program';
const reactionColumnName = 'Heightened physical engagement in program';
const symptomColumnName = 'Behavioral disturbance';
const memoryRecallColumnName = 'Heightened memory recall';
const emotionColumnName = 'Heightened positive emotional response';

type InputRow = {
    [attentionColumnName]: number,
    [reactionColumnName]: number,
    [symptomColumnName]: number,
    [memoryRecallColumnName]:number,
    [emotionColumnName]:number
};

type OutputRow = {
    date: string,
    group: string,
    value: number,
    startDate: Date
}

const ONE_DAY = 1000 * 60 * 60 * 12;

const reformatRow: (row: InputRow, index: number, startDate: number) => OutputRow[] = (row, index, startDateInput) => {
    const date = new Date(startDateInput + index * ONE_DAY).toDateString();
    // const date = startDate + index * 1000;
    const startDate = new Date(startDateInput);
    return [{
        date,
        group: attentionColumnName,
        value: row[attentionColumnName],
        startDate,
    },{
        date,
        group: reactionColumnName,
        value: row[reactionColumnName]  * 100,
        startDate,
    },{
        date,
        group: symptomColumnName,
        value: row[symptomColumnName]  * 100,
        startDate,
    },{
        date,
        group: memoryRecallColumnName,
        value: row[memoryRecallColumnName]  * 100,
        startDate,
    },
    {
        date,
        group: emotionColumnName,
        value: row[emotionColumnName]  * 100,
        startDate,
    }]
}

const reformatJSON: (rows: InputRow[], startDate: number) => OutputRow[] = (rows, startDate) => 
    rows.flatMap((row, i) => reformatRow(row, i, startDate))


export const StreamGraphPageViews = ({
  width,
  height,
}: StreamGraphPageViewsProps) => {
  const [data, setData] = useState<DataItem[]>();
  const START_DATE_CONST = parseTime("2015-01-01");
  const [startDate, setStartDate] = useState(START_DATE_CONST);
  
  // Data is stored on github at .csv format. This loads it.
  // Note that data is stored in a "long" format. It will be converted to a wide format by the renderer.
  // See the streamgraph section of the react graph gallery for explanations.
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://raw.githubusercontent.com/holtzy/react-graph-gallery/main/data/data_page_views.csv"
      );
      const csvData = await response.text();
      const parsedData: DataItem[] = reformatJSON(sampleHeatmapData.slice(0, 200), START_DATE_CONST.getTime())//csvParse(csvData) as any;

    //   const parsedData: DataItem[] = csvParse(csvData) as any;
      setData(parsedData);
    };

    fetchData();
  }, []);

  if (!data || !startDate) {
    return null;
  }

  return (
    <div>
      <div style={{ height: HEADER_HEIGHT }}>
        <p style={{ fontSize: 17, paddingTop: 40, marginBottom: 0 }}>
          <b>
            Engagement
          </b>
        </p>

        <div style={{ display: "flex", alignItems: "center" }}>
          <p
            style={{
              fontSize: 12,
              width: 155,
              paddingTop: 11,
            }}
          >
            {"Scale timeframe "}
            <b>{monthTimeFormatter(startDate)}</b>
          </p>
          <input
            type="range"
            min={parseTime("2015-01-01")?.getTime()}
            max={parseTime("2018-09-01")?.getTime()}
            value={startDate.getTime()}
            step={10000}
            onChange={(e) => setStartDate(new Date(Number(e.target.value)))}
            style={{ height: 1, opacity: 0.5, width: 80 }}
          />
        </div>
      </div>
      <StreamGraph
        width={width}
        height={height - HEADER_HEIGHT}
        data={data}
        startDate={startDate}
      />
    </div>
  );
};

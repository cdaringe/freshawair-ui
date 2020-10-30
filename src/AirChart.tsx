import React, { useEffect } from "react";
import Chart from "react-apexcharts";
import "./AirChart.css";

// toggle column UI support
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

type Props = {
  binningValue: string;
};

const { REACT_APP_AIR_DATA_ENDPOINT: airEndpoint } = process.env;

const defaultColumns = [
  "abs_humid",
  "co2",
  "co2_est",
  "dew_point",
  "humid",
  "pm10_est",
  "pm25",
  "score",
  "temp",
  "timestamp",
  "voc",
  "voc_baseline",
  "voc_ethanol_raw",
  "voc_h2_raw",
].filter((n) => !n.match(/(baseline|timestamp|raw)/));

type StatRow = [
  number /* abs_humid */,
  number /* co2 */,
  number /* co2_est */,
  number /* dew_point */,
  number /* humid */,
  number /* pm10_est */,
  number /* pm25 */,
  number /* score */,
  number /* temp */,
  string /* timestamp */,
  number /* voc */,
  number /* voc_baseline */,
  number /* voc_ethanol_raw */,
  number /* voc_h2_raw */
];

const asSeries = (
  data: StatRow[],
  columns: string[]
): { name: string; data: any[] }[] => {
  return columns.map((name, i) => ({
    name,
    data: data.map((row) => [row[9], row[i]]),
  }));
};

export const AirChart: React.FC<Props> = ({ binningValue }) => {
  const [colState, setColumns] = React.useState<Record<string, boolean>>(
    defaultColumns.reduce((acc, c) => ({ ...acc, [c]: !!c.match(/score/) }), {})
  );
  const chartColumns = Object.entries(colState).reduce(
    (acc, [colName, isActivated]) => (isActivated ? [...acc, colName] : acc),
    [] as string[]
  );
  const onColumnToggled = (event: any) => {
    setColumns({ ...colState, [event.target.name]: event.target.checked });
  };

  const [data, setData] = React.useState<null | string | StatRow[]>(null);
  useEffect(() => {
    fetch(`${airEndpoint!}?binningValue=${binningValue}`, {})
      .then((t) => t.json())
      .then((data) => setData(data))
      .catch((err) => setData(err.message));
  }, [binningValue]);
  if (typeof data === "string") return <h1>{data}</h1>;
  if (!data) return <h1>Loading</h1>;
  return (
    <>
      <Chart
        key="awair-chart"
        options={{
          chart: {
            id: "freshawair",
          },
          // stroke: {
          //   curve: "smooth",
          // },
          xaxis: {
            type: "datetime",
          },
        }}
        series={asSeries(data, chartColumns)}
      />
      <FormControl component="fieldset">
        <FormLabel component="legend">Toggle columns</FormLabel>
        <FormGroup>
          {Object.entries(colState).map(([colName, isActivated]) => (
            <FormControlLabel
              key={colName}
              control={
                <Switch
                  size="small"
                  checked={isActivated}
                  onChange={onColumnToggled}
                  name={colName}
                />
              }
              label={colName}
            />
          ))}
        </FormGroup>
      </FormControl>
    </>
  );
};

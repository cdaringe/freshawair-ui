import Typography from "@material-ui/core/Typography";
import React from "react";
import { AirChart } from "./AirChart";
import { useQuery } from "./QueryContext";

export const AirChartPage: React.FC = () => {
  if (useQuery().focusMode) return <AirChart />;
  return (
    <>
      <Typography variant="h3">AirChart™</Typography>
      <AirChart />
    </>
  );
};

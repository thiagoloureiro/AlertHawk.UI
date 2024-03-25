import { FC, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { IHistoryData } from "../../interfaces/IHistoryData";
import moment from "moment-timezone";
import { useStoreState } from "../../hooks";
import logging from "../../utils/logging";

interface IChartProps {
  data: IHistoryData[];
  containerWidth: number;
}

const Chart: FC<IChartProps> = ({ data, containerWidth }) => {
  const { selectedDisplayTimezone } = useStoreState((state) => state.app);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    logging.info(chartData);
  }, [chartData]);

  useEffect(() => {
    setChartData(
      data
        .map((dataPoint) => ({
          name: moment
            .utc(dataPoint.timeStamp)
            .tz(selectedDisplayTimezone)
            .format("YYYY-MM-DD HH:mm:ss"),
          responseTime: dataPoint.responseTime,
        }))
        .reverse()
    );
  }, [data, selectedDisplayTimezone]);

  const formatTooltip = (value: any, name: any, _: any) => {
    if (name === "responseTime") {
      return [value + " ms"];
    }
    return [name, value];
  };

  const formatDateTick = (tick: string) => {
    return moment(tick).format("HH:mm");
  };

  return (
    <LineChart
      width={containerWidth}
      height={300}
      data={chartData}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    >
      <Line
        type="monotone"
        dataKey="responseTime"
        stroke="#26c6da"
        strokeWidth={3}
      />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="name" tickFormatter={formatDateTick} />
      <YAxis />
      <Tooltip
        formatter={formatTooltip}
        contentStyle={{ backgroundColor: "rgba(255,255,255,0.8)" }}
        labelStyle={{ color: "black" }}
      />
    </LineChart>
  );
};

export default Chart;

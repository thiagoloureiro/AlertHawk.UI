import { FC, useEffect, useRef, useState } from "react";
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
interface IChartProps {
  data: IHistoryData[];
}

const Chart: FC<IChartProps> = ({ data }) => {
  const { selectedDisplayTimezone, isDarkMode } = useStoreState(
    (state) => state.app
  );
  const [chartData, setChartData] = useState<any[]>([]);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const [screenHeight, setScreenHeight] = useState<number>(window.innerHeight);
  console.log(screenHeight);
  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
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
        setScreenHeight(window.innerHeight);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
    <div
      ref={chartContainerRef}
      style={{
        width: "100%",
        height: screenHeight / 4.8 > 180 ? screenHeight / 4.8 : 180,
      }}
    >
      <LineChart
        width={chartContainerRef.current?.clientWidth || 0}
        height={screenHeight / 4.8 > 180 ? screenHeight / 4.8 : 180}
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
        <XAxis
          tick={isDarkMode ? { fill: "#f5f5f5" } : {}}
          dataKey="name"
          tickFormatter={formatDateTick}
        />
        <YAxis tick={isDarkMode ? { fill: "#f5f5f5" } : {}} />
        <Tooltip
          formatter={formatTooltip}
          contentStyle={{ backgroundColor: "rgba(255,255,255,0.8)" }}
          labelStyle={{ color: "black" }}
        />
      </LineChart>
    </div>
  );
};

export default Chart;

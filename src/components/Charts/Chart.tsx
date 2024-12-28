import { FC, useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Dot,
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
              responseTime: dataPoint.status ? dataPoint.responseTime : 0,
              status: dataPoint.status,
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

  const formatTooltip = (value: any, name: any, props: any) => {
    if (name === "responseTime") {
      return [
        props.payload.status ? 
          `${value} ms` : 
          <span style={{ color: '#ff0000' }}>Failed</span>
      ];
    }
    return [name, value];
  };

  const formatDateTick = (tick: string) => {
    return moment(tick).format("HH:mm");
  };

  // Custom dot component to show different colors based on status
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    return (
      <Dot
        cx={cx}
        cy={cy}
        r={4}
        fill={payload.status ? "#26c6da" : "#ff0000"}
        stroke={payload.status ? "#26c6da" : "#ff0000"}
      />
    );
  };

  const placeholderData = Array.from({ length: 60 })
    .map((_, index) => ({
      name: moment().subtract(index, "minutes").format("YYYY-MM-DD HH:mm:ss"),
      responseTime: 0,
      status: true,
    }))
    .reverse();

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
        data={chartData.length > 0 ? chartData : placeholderData}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <Line
          type="monotone"
          dataKey="responseTime"
          stroke={chartData.length > 0 ? "#26c6da" : "transparent"}
          strokeWidth={3}
          dot={chartData.length > 0 ? CustomDot : false}
          connectNulls
        />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis
          tick={isDarkMode ? { fill: "#f5f5f5" } : {}}
          fontSize={12}
          dataKey="name"
          tickFormatter={formatDateTick}
        />
        <YAxis fontSize={12} tick={isDarkMode ? { fill: "#f5f5f5" } : {}} />
        {chartData.length > 0 && (
          <Tooltip
            formatter={formatTooltip}
            contentStyle={{ backgroundColor: "rgba(255,255,255,0.8)" }}
            labelStyle={{ color: "black" }}
            allowEscapeViewBox={{ x: false, y: true }}
          />
        )}
      </LineChart>
    </div>
  );
};

export default Chart;

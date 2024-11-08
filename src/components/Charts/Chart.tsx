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
import { useNavigate } from "react-router-dom";

interface IChartProps {
  monitorId: number;
  data: IHistoryData[];
}

const Chart: FC<IChartProps> = ({ monitorId, data }) => {
  const navigate = useNavigate();

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
              responseTime: dataPoint.responseTime,
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

  const formatTooltip = (value: any, name: any, _: any) => {
    if (name === "responseTime") {
      return [value + " ms"];
    }
    return [name, value];
  };

  const formatDateTick = (tick: string) => {
    return moment(tick).format("HH:mm");
  };

  const placeholderData = Array.from({ length: 60 })
    .map((_, index) => ({
      name: moment().subtract(index, "minutes").format("YYYY-MM-DD HH:mm:ss"),
      responseTime: 0,
    }))
    .reverse();

  const CustomizedDot = (props: any) => {
    const { payload } = props;
    const status: boolean = payload.status;
    const color = status ? "#26c6da" : "red";

    return <Dot {...props} stroke={color} />;
  };

  const goToAlert = (props: any) => {
    const { payload } = props;
    const status: boolean = payload.status;
    if (status == false) navigate(`/monitor-alert/${monitorId}`);
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
        data={chartData.length > 0 ? chartData : placeholderData}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <Line
          type="monotone"
          dataKey="responseTime"
          stroke={chartData.length > 0 ? "#26c6da" : "transparent"}
          strokeWidth={3}
          activeDot={{
            onClick: (evt, props) => {
              console.log(evt);
              goToAlert(props);
            },
          }}
          dot={<CustomizedDot />}
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
          />
        )}
      </LineChart>
    </div>
  );
};

export default Chart;

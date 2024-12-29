import { FC, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HelmetProvider, Helmet } from "react-helmet-async";
import MonitorHistoryService from "../../services/MonitorHistoryService";
import { IHistoryData } from "../../interfaces/IHistoryData";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useStoreState } from "../../hooks";

interface DayOption {
  value: number;
  label: string;
}

const dayOptions: DayOption[] = [
  { value: 1, label: "1 day" },
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 60, label: "60 days" },
  { value: 90, label: "90 days" },
  { value: 120, label: "120 days" },
  { value: 180, label: "180 days" },
];

const COLORS = ['#4caf50', '#f44336']; // Green for up, Red for down

const MonitorCharts: FC = () => {
  const { t } = useTranslation("global");
  const { monitorId } = useParams<{ monitorId: string }>();
  const { monitorGroupListByUser } = useStoreState((state) => state.monitor);
  const [selectedDays, setSelectedDays] = useState<number>(30);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pieData, setPieData] = useState<{ name: string; value: number; minutes: number }[]>([]);
  const [monitorName, setMonitorName] = useState<string>("");

  useEffect(() => {
    if (monitorId && monitorGroupListByUser) {
      // Find monitor name from all groups
      for (const group of monitorGroupListByUser) {
        const monitor = group.monitors.find(m => m.id === parseInt(monitorId));
        if (monitor) {
          setMonitorName(monitor.name);
          break;
        }
      }
    }
  }, [monitorId, monitorGroupListByUser]);

  const calculatePieData = (data: IHistoryData[]) => {
    const sortedData = [...data].sort((a, b) => 
      new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
    );

    if (sortedData.length < 2) return [];

    // Calculate total duration and status durations
    let totalMinutes = 0;
    let uptimeMinutes = 0;
    let downtimeMinutes = 0;

    for (let i = 0; i < sortedData.length - 1; i++) {
      const currentCheck = sortedData[i];
      const nextCheck = sortedData[i + 1];
      const duration = (new Date(nextCheck.timeStamp).getTime() - new Date(currentCheck.timeStamp).getTime()) / (1000 * 60);
      
      totalMinutes += duration;
      if (currentCheck.status) {
        uptimeMinutes += duration;
      } else {
        downtimeMinutes += duration;
      }
    }

    // Handle the last interval
    if (sortedData.length > 1) {
      const lastInterval = (new Date(sortedData[sortedData.length - 1].timeStamp).getTime() - 
                          new Date(sortedData[sortedData.length - 2].timeStamp).getTime()) / (1000 * 60);
      
      if (sortedData[sortedData.length - 1].status) {
        uptimeMinutes += lastInterval;
      } else {
        downtimeMinutes += lastInterval;
      }
      totalMinutes += lastInterval;
    }

    return [
      {
        name: t("monitorCharts.uptime"),
        value: (uptimeMinutes / totalMinutes) * 100,
        minutes: Math.round(uptimeMinutes)
      },
      {
        name: t("monitorCharts.downtime"),
        value: (downtimeMinutes / totalMinutes) * 100,
        minutes: Math.round(downtimeMinutes)
      }
    ];
  };

  const handleDaysChange = async (event: SelectChangeEvent<number>) => {
    const days = event.target.value as number;
    setSelectedDays(days);
    await fetchChartData(days);
  };

  const fetchChartData = async (days: number) => {
    if (!monitorId) return;
    
    setIsLoading(true);
    try {
      const response = await MonitorHistoryService.getHistoryByDays(
        parseInt(monitorId),
        days
      );
      setPieData(calculatePieData(response));
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (monitorId) {
      fetchChartData(selectedDays);
    }
  }, [monitorId]);

  // Helper function to truncate to 2 decimal places without rounding
  const truncateToTwoDecimals = (num: number): string => {
    return (Math.floor(num * 100) / 100).toFixed(2);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const hours = Math.floor(data.minutes / 60);
      const minutes = data.minutes % 60;
      const timeString = hours > 0 
        ? `${hours}h ${minutes}m`
        : `${minutes}m`;

      return (
        <Box
          sx={{
            backgroundColor: "background.paper",
            padding: "10px",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">
            {data.name}: {truncateToTwoDecimals(data.value)}% ({timeString})
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>AlertHawk | {t("monitorCharts.text")} - {monitorName}</title>
        </Helmet>
      </HelmetProvider>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <Typography variant="h5" component="div">
                  {t("monitorCharts.text")} - {monitorName}
                </Typography>
                <Box>
                  <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                    <Select
                      value={selectedDays}
                      onChange={handleDaysChange}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Select period' }}
                    >
                      {dayOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.value === 1 ? `${option.value} day` : `${option.value} days`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "400px",
                  position: "relative",
                }}
              >
                {isLoading ? (
                  <CircularProgress
                  sx={{
                    '@keyframes circular-rotate': {
                      '0%': {
                        transform: 'rotate(0deg)',
                      },
                      '100%': {
                        transform: 'rotate(360deg)',
                      },
                    },
                    animation: 'circular-rotate 0.7s linear infinite',
                  }}
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, minutes }) => {
                          const hours = Math.floor(minutes / 60);
                          const mins = minutes % 60;
                          const timeString = hours > 0 
                            ? `${hours}h ${mins}m`
                            : `${mins}m`;
                          return `${name}: ${truncateToTwoDecimals(value)}% (${timeString})`;
                        }}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default MonitorCharts; 
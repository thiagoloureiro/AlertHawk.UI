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
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
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
    const total = data.length;
    const upCount = data.filter(item => item.status).length;
    const downCount = total - upCount;

    return [
      { name: 'Up', value: (upCount / total) * 100 },
      { name: 'Down', value: (downCount / total) * 100 }
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ 
          bgcolor: 'background.paper', 
          p: 1.5, 
          border: 1, 
          borderColor: 'divider',
          borderRadius: 1 
        }}>
          <Typography variant="body2">
            {`${payload[0].name}: ${payload[0].value.toFixed(2)}%`}
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
                        label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        isAnimationActive={false} // Disables animation
                      >
                        {pieData.map((_entry, index) => (
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